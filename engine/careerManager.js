const CareerManager = (() => {
    let state = null;
    let saveSlotId = null;

    function startNewCareer(opts) {
        const champId = opts.champId;
        const cfg = CHAMPIONSHIPS[champId];
        state = {
            id: "career_" + Date.now().toString(36), name: opts.name || "Carriera",
            champId, champName: cfg.name, family: cfg.family, season: 2026,
            currentRound: 0, totalRounds: 24, // Fissato a 24 gare
            playerTeamId: opts.team.id, playerTeamName: opts.team.name, isCustomTeam: !!opts.isCustom,
            finances: { budget: opts.team.budget ?? 0 },
            // Sviluppo del team salvato nella carriera (persiste su reload, a differenza
            // di ALL_TEAMS che viene ricaricato pulito dai file JS).
            playerTeamDev: { staff: Object.assign({}, opts.team.staff), rnd: { unlocked: {} } },
            currentSession: 0, // 0=Practice, 1=Qualifying, 2=Race
            calendar: _buildCalendar(cfg),
            results: [], standings: { drivers: [], teams: [] },
        };
        saveSlotId = null;
        _applyPlayerDev();
        _recomputeStandings();
        return state;
    }

    /* Ri-applica lo sviluppo salvato (staff + progetti R&D) sull'oggetto team
       vivo di ALL_TEAMS. Chiamato all'avvio e dopo ogni restore. */
    function _applyPlayerDev() {
        if (!state) return;
        if (!state.playerTeamDev) state.playerTeamDev = { staff: {}, rnd: { unlocked: {} }, driverMorale: {} };
        const dev = state.playerTeamDev;
        if (!dev.rnd) dev.rnd = { unlocked: {} };
        if (!dev.driverMorale) dev.driverMorale = {};
        const team = getPlayerTeam();
        if (!team) return;
        team.staff = Object.assign({}, team.staff, dev.staff || {});
        team.rnd = { unlocked: Object.assign({}, dev.rnd.unlocked || {}) };
        for (const d of (team.drivers || [])) {
            if (dev.driverMorale[d.id] !== undefined) d.morale = dev.driverMorale[d.id];
        }
    }

    function _buildCalendar(cfg) {
        const cal = [];
        const trackPool = (TRACKS_BY_FAMILY[cfg.family] || []).slice();
        const rounds = 24; // Fissato a 24 gare (vedi startNewCareer.totalRounds)

        // Mescola il pool (Fisher-Yates) per evitare bias di ordine fisso.
        for (let i = trackPool.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [trackPool[i], trackPool[j]] = [trackPool[j], trackPool[i]];
        }

        // Se il pool è più piccolo del numero di gare, ripeti il pool intero
        // almeno una volta, poi continua mescolando una seconda copia. Questo
        // minimizza le ripetizioni e le distribuisce uniformemente.
        const picks = [];
        if (trackPool.length === 0) {
            for (let r = 1; r <= rounds; r++) picks.push({ id:`gen_${r}`, name:`Round ${r}`, country:"-", surface:"asphalt" });
        } else {
            let idx = 0;
            while (picks.length < rounds) {
                if (idx >= trackPool.length) {
                    // seconda passata: re-mescola per variare l'ordine
                    for (let i = trackPool.length - 1; i > 0; i--) {
                        const j = Math.floor(Math.random() * (i + 1));
                        [trackPool[i], trackPool[j]] = [trackPool[j], trackPool[i]];
                    }
                    idx = 0;
                }
                picks.push(trackPool[idx % trackPool.length]);
                idx++;
            }
        }

        for (let r = 1; r <= rounds; r++) {
            const track = picks[r - 1];
            cal.push({
                round: r,
                name: track.name,
                trackId: track.id,
                country: track.country || "-",
                surface: track.surface || "asphalt",
                completed: false,
            });
        }
        return cal;
    }

    function advanceSession() {
        if (!state) return null;
        if (state.currentSession < 2) {
            state.currentSession++;
        } else {
            state.currentSession = 0;
            state.currentRound++;
            if (state.currentRound > state.totalRounds) {
                return { seasonComplete: true };
            }
        }
        _persist();
        return { seasonComplete: false, session: state.currentSession, round: state.currentRound };
    }

    function simulateCurrentSession() {
        if (!state) return null;
        const round = state.calendar[state.currentRound];
        const cfg = CHAMPIONSHIPS[state.champId];
        
        const result = window.engine.simulateEvent(state.champId, {
            weather: Math.random() < 0.2 ? "wet" : "dry",
            surface: round.surface,
            trackId: round.trackId
        });

        if (state.currentSession === 2) { // Solo la Gara assegna punti
            state.results.push({ round: state.currentRound, ...result });
            round.completed = true;
            _applyPointsFromResult(result);
            _awardPrizeMoney(result);
            _updateMorale(result);
            _recomputeStandings();
        }
        _persist();
        return result;
    }

    function _applyPointsFromResult(result) {
        for (const r of result.results) {
            if (r.points > 0) {
                let d = state.standings.drivers.find(x => x.id === r.driverId);
                if (!d) { d = { id:r.driverId, name:r.driver, teamId:r.teamId, points:0 }; state.standings.drivers.push(d); }
                d.points += r.points;
                let t = state.standings.teams.find(x => x.id === r.teamId);
                if (!t) { t = { id:r.teamId, name:r.team, points:0 }; state.standings.teams.push(t); }
                t.points += r.points;
            }
        }
    }

    function _awardPrizeMoney(result) {
        const my = result.results.find(r => r.teamId === state.playerTeamId);
        if (!my) return;
        const pos = typeof my.position === "number" ? my.position : 20;
        const prize = Math.max(0, Math.round(500 * (1 - (pos-1)/20)));
        state.finances.budget += prize;
    }

    /* --- SISTEMA MORALE DINAMICO ------------------------------------------ */
    /* Aggiorna il morale di tutti i piloti dopo una gara in base alla posizione.
       Podio = +, zona punti = +/-, fondo classifica o DNF = -. Persiste il morale
       dei piloti del giocatore in playerTeamDev.driverMorale. */
    function _updateMorale(result) {
        if (!state || !result || !result.results) return;
        _ensureDev();
        const dev = state.playerTeamDev;
        if (!dev.driverMorale) dev.driverMorale = {};
        const teams = ALL_TEAMS[state.champId] || [];

        for (const r of result.results) {
            let delta = 0;
            const pos = r.position;
            if (pos === "DNF") { delta = -5; }
            else if (pos === 1) { delta = 5; }
            else if (pos <= 3) { delta = 3; }
            else if (pos <= 10) { delta = 1; }
            else if (pos <= 15) { delta = -1; }
            else { delta = -2; }

            for (const t of teams) {
                const d = (t.drivers || []).find(x => x.id === r.driverId);
                if (d) {
                    d.morale = Math.max(0, Math.min(100, (d.morale || 75) + delta));
                    // persisti solo i piloti del giocatore
                    if (t.id === state.playerTeamId) dev.driverMorale[r.driverId] = d.morale;
                    break;
                }
            }
        }
    }

    function _recomputeStandings() {
        if (!state) return;
        state.standings.drivers.sort((a,b) => b.points - a.points);
        state.standings.teams.sort((a,b) => b.points - a.points);
    }

    /* --- BUDGET (fonte di verità unica per i soldi del giocatore) ---------- */
    function getBudget() { return state ? (state.finances.budget || 0) : 0; }
    /* Prova a spendere: se i fondi bastano scala e persiste, altrimenti false. */
    function trySpend(amount) {
        if (!state || amount < 0) return false;
        if (state.finances.budget < amount) return false;
        state.finances.budget -= amount;
        _persist();
        return true;
    }

    /* --- SVILUPPO R&D (persistente) --------------------------------------- */
    function _ensureDev() {
        if (!state.playerTeamDev) state.playerTeamDev = { staff: {}, rnd: { unlocked: {} }, driverMorale: {} };
        if (!state.playerTeamDev.staff) state.playerTeamDev.staff = {};
        if (!state.playerTeamDev.rnd) state.playerTeamDev.rnd = { unlocked: {} };
        if (!state.playerTeamDev.rnd.unlocked) state.playerTeamDev.rnd.unlocked = {};
        if (!state.playerTeamDev.driverMorale) state.playerTeamDev.driverMorale = {};
    }
    /* Imposta il livello di un reparto: aggiorna team vivo + snapshot persistente. */
    function setStaffLevel(deptKey, level) {
        if (!state) return;
        _ensureDev();
        state.playerTeamDev.staff[deptKey] = level;
        const team = getPlayerTeam();
        if (team) { team.staff = team.staff || {}; team.staff[deptKey] = level; }
        _persist();
    }
    /* Segna un progetto speciale come sbloccato (team vivo + snapshot). */
    function markProjectUnlocked(projId) {
        if (!state) return;
        _ensureDev();
        state.playerTeamDev.rnd.unlocked[projId] = true;
        const team = getPlayerTeam();
        if (team) { team.rnd = team.rnd || { unlocked: {} }; team.rnd.unlocked = team.rnd.unlocked || {}; team.rnd.unlocked[projId] = true; }
        _persist();
    }

    function _persist() { if (!state) return; if (!saveSlotId) saveSlotId = SaveSystem.createSave(state.name, { careerState: state }); else SaveSystem.updateSave(saveSlotId, { careerState: state }); }
    function loadFromSlot(slotId) { const data = SaveSystem.loadSave(slotId); if (!data) return false; saveSlotId = slotId; return restore(data); }
    function restore(data) { state = data.careerState; _applyPlayerDev(); return true; }
    function close() { state = null; saveSlotId = null; }

    function getState() { return state; }
    function isActive() { return state !== null; }
    function getPlayerTeam() { return (ALL_TEAMS[state.champId]||[]).find(t => t.id === state.playerTeamId) || null; }
    function nextRoundInfo() { return state ? state.calendar[state.currentRound] : null; }

    return { startNewCareer, advanceSession, simulateCurrentSession, loadFromSlot, restore, close, getState, isActive, getPlayerTeam, nextRoundInfo, getBudget, trySpend, setStaffLevel, markProjectUnlocked };
})();
if (typeof window !== "undefined") window.CareerManager = CareerManager;