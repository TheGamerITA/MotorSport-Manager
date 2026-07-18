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
            // Sistema Sponsor: slot per tier + tracciamento obiettivi stagionali
            sponsors: { signed: [], seasonStats: { wins:0, podiums:0, pointsFinishes:0, finishes:0, qualTop5:0, qualTop10:0, totalRaces:0 } },
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

    /* --- TRANSIZIONE STAGIONE & PROGRESSIONE CARRIERA --------------------- */
    /* Avanza alla stagione successiva: valuta sponsor, invecchia piloti,
       fa progredire/declinare le statistiche, aggiorna prestigio e budget. */
    function startNextSeason() {
        if (!state) return null;

        // 1) Valuta obiettivi sponsor e accredita ricompense
        const sponsorResults = _evaluateSponsorObjectives();

        // 2) Calcola prestigio in base alla posizione in campionato
        _updateTeamPrestige();

        // 3) Invecchia i piloti e fai progredire/declinare le loro statistiche
        _progressAllDrivers();

        // 4) Rinnova o libera piloti con contratto scaduto
        _handleDriverContracts();

        // 5) Reset per la nuova stagione
        state.season++;
        state.currentRound = 0;
        state.currentSession = 0;
        state.results = [];
        state.standings = { drivers: [], teams: [] };
        state.lastPractice = null;
        state.lastQualifying = null;

        // 6) Rigenera il calendario per la nuova stagione
        const cfg = CHAMPIONSHIPS[state.champId];
        state.calendar = _buildCalendar(cfg);

        // 7) Reset statistiche sponsor stagionali e flag valutazione
        if (state.sponsors) {
            state.sponsors.seasonStats = _newSeasonStats();
            state.sponsors.objectivesEvaluated = false;
            delete state.sponsors.lastEvalResults;
        }

        // 8) Bonus budget di partenza per la nuova stagione (dipende da prestigio)
        const team = getPlayerTeam();
        const seasonBonus = 2000 + Math.round((team?.prestige ?? 50) * 30);
        state.finances.budget += seasonBonus;

        _applyPlayerDev();
        _persist();
        return { season: state.season, sponsorResults, seasonBonus };
    }

    /* Aggiorna il prestigio del team in base alla posizione finale in campionato. */
    function _updateTeamPrestige() {
        if (!state) return;
        const teamStand = state.standings.teams.slice().sort((a,b) => b.points - a.points);
        const myPos = teamStand.findIndex(t => t.id === state.playerTeamId);
        const team = getPlayerTeam();
        if (!team || myPos < 0) return;

        const totalTeams = teamStand.length;
        // Top 3: +5 a +8, zona punti: +2 a +3, retrocessione: -3 a -5
        let delta = 0;
        if (myPos === 0) delta = 8;
        else if (myPos <= 2) delta = 5;
        else if (myPos <= totalTeams * 0.3) delta = 3;
        else if (myPos <= totalTeams * 0.5) delta = 1;
        else if (myPos >= totalTeams - 2) delta = -5;
        else delta = -2;

        team.prestige = Math.max(10, Math.min(99, (team.prestige || 50) + delta));
        _ensureDev();
        state.playerTeamDev.prestige = team.prestige;
    }

    /* Invecchia tutti i piloti e ne fa progredire/declinare le statistiche
       in base all'età, al morale e alle prestazioni della stagione. */
    function _progressAllDrivers() {
        if (!state) return;
        _ensureDev();
        // Snapshot di tutti i piloti (non solo del giocatore): ALL_TEAMS viene
        // ricaricato pulito dai file JS a ogni reload, quindi senza questo
        // snapshot i progressi dei piloti AI andrebbero persi tra le stagioni.
        if (!state.playerTeamDev.allDriversProgress) state.playerTeamDev.allDriversProgress = {};
        const aiProgress = state.playerTeamDev.allDriversProgress;

        const teams = ALL_TEAMS[state.champId] || [];
        for (const t of teams) {
            for (const d of (t.drivers || [])) {
                // Ripristina le stat salvate dalla stagione precedente (se presenti)
                const saved = aiProgress[d.id];
                if (saved) {
                    d.age = saved.age; d.pace = saved.pace; d.consistency = saved.consistency;
                    d.racecraft = saved.racecraft; d.wetPerformance = saved.wetPerformance;
                    d.fuelTyreMgmt = saved.fuelTyreMgmt; d.qualifying = saved.qualifying;
                    d.rating = saved.rating; d.morale = saved.morale;
                } else {
                    d.age = (d.age || 25) + 1;
                }

                // Finestra di sviluppo: 16-23 cresce, 24-30 stabile, 31+ declina
                const isYoung = d.age <= 23;
                const isVeteran = d.age >= 31;
                const moraleBonus = ((d.morale || 75) - 50) / 500; // ±0.05

                const stats = ["pace","consistency","racecraft","wetPerformance","fuelTyreMgmt","qualifying"];
                for (const s of stats) {
                    let delta = 0;
                    if (isYoung) {
                        delta = 0.01 + Math.random() * 0.02 + moraleBonus;
                    } else if (isVeteran) {
                        delta = -0.01 - Math.random() * 0.02;
                    } else {
                        delta = (Math.random() - 0.5) * 0.01 + moraleBonus * 0.5;
                    }
                    d[s] = Math.max(0.2, Math.min(0.99, (d[s] || 0.5) + delta));
                }

                // Ricalcola il rating
                d.rating = +(d.pace*0.30 + d.consistency*0.20 + d.racecraft*0.20 + d.qualifying*0.15 + d.wetPerformance*0.10 + d.fuelTyreMgmt*0.05).toFixed(3);

                // Reset morale a inizio stagione (leggermente influenzato dalle prestazioni)
                d.morale = Math.round(Math.max(40, Math.min(90, 65 + (d.rating - 0.5) * 40)));

                // Salva lo stato del pilota per la prossima stagione
                aiProgress[d.id] = {
                    age: d.age, pace: d.pace, consistency: d.consistency,
                    racecraft: d.racecraft, wetPerformance: d.wetPerformance,
                    fuelTyreMgmt: d.fuelTyreMgmt, qualifying: d.qualifying,
                    rating: d.rating, morale: d.morale, contractYears: d.contractYears
                };
            }
        }
        // Persisti il morale dei piloti del giocatore
        _ensureDev();
        const playerTeam = getPlayerTeam();
        if (playerTeam) {
            for (const d of (playerTeam.drivers || [])) {
                state.playerTeamDev.driverMorale[d.id] = d.morale;
            }
        }
    }

    /* Gestisce la scadenza dei contratti: decrementa gli anni e libera
       i piloti con contratto a 0 (solo per i team del giocatore, per semplicità). */
    function _handleDriverContracts() {
        if (!state) return;
        const playerTeam = getPlayerTeam();
        if (!playerTeam) return;
        _ensureDev();

        const remaining = [];
        for (const d of (playerTeam.drivers || [])) {
            d.contractYears = Math.max(0, (d.contractYears || 1) - 1);
            if (d.contractYears > 0) {
                remaining.push(d);
            } else {
                // Contratto scaduto: 50% probabilità di rinnovo automatico se il morale è alto
                if ((d.morale || 75) >= 70 && Math.random() < 0.5) {
                    d.contractYears = 1 + Math.floor(Math.random() * 2);
                    remaining.push(d);
                }
                // Altrimenti il pilota lascia la squadra
            }
        }
        playerTeam.drivers = remaining;
    }

    /* Restituisce un riepilogo di fine stagione per la UI. */
    function getSeasonSummary() {
        if (!state) return null;
        const teamStand = state.standings.teams.slice().sort((a,b) => b.points - a.points);
        const driverStand = state.standings.drivers.slice().sort((a,b) => b.points - a.points);
        const myTeamPos = teamStand.findIndex(t => t.id === state.playerTeamId);
        const myDrivers = driverStand.filter(d => d.teamId === state.playerTeamId);

        return {
            teamPosition: myTeamPos + 1,
            totalTeams: teamStand.length,
            teamPoints: myTeamPos >= 0 ? teamStand[myTeamPos].points : 0,
            drivers: myDrivers.map(d => ({ name: d.name, points: d.points })),
            sponsorResults: state.sponsors?.signed?.map(s => ({
                name: s.name, objective: s.objective?.label, achieved: s.objectiveProgress === 1, reward: s.objective?.reward || 0
            })) || [],
        };
    }

    function simulateCurrentSession() {
        if (!state) return null;
        const round = state.calendar[state.currentRound];
        const cfg = CHAMPIONSHIPS[state.champId];
        // Meteo più vario: 60% dry, 25% mixed, 15% wet. Per offroad più avverso.
        const isOffroad = (cfg.family === "Rally" || cfg.family === "Raid");
        const r = Math.random();
        let weather;
        if (isOffroad) {
            weather = r < 0.40 ? "dry" : r < 0.70 ? "mixed" : "wet";
        } else {
            weather = r < 0.60 ? "dry" : r < 0.85 ? "mixed" : "wet";
        }

        if (state.currentSession === 0) {
            // PROVE LIBERE: raccoglie info setup e potenziale
            const practice = window.engine.simulatePractice(state.champId, {
                weather, surface: round.surface, trackId: round.trackId
            });
            state.lastPractice = { round: state.currentRound, results: practice };
            _persist();
            return { session: 0, type: "practice", results: practice };
        }

        if (state.currentSession === 1) {
            // QUALIFICA: stabilisce la griglia di partenza
            const quali = window.engine.simulateQualifying(state.champId, {
                weather, surface: round.surface, trackId: round.trackId
            });
            state.lastQualifying = { round: state.currentRound, grid: quali };
            _persist();
            return { session: 1, type: "qualifying", grid: quali };
        }

        // GARA (session 2): usa la griglia dalla qualifica se disponibile
        const grid = (state.lastQualifying && state.lastQualifying.round === state.currentRound)
            ? state.lastQualifying.grid.map(g => g.driverId) : undefined;
        const result = window.engine.simulateEvent(state.champId, {
            weather, surface: round.surface, trackId: round.trackId, grid
        });

        state.results.push({ round: state.currentRound, ...result });
        round.completed = true;
        _applyPointsFromResult(result);
        _awardPrizeMoney(result);
        _awardSponsorPayments(result);
        _updateMorale(result);
        _recomputeStandings();
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

    /* --- SISTEMA SPONSOR --------------------------------------------------- */
    function _newSeasonStats() {
        return { wins:0, podiums:0, pointsFinishes:0, finishes:0, qualTop5:0, qualTop10:0, totalRaces:0 };
    }

    /* Firma uno sponsor se c'è spazio nel tier e il prestigio è sufficiente. */
    function signSponsor(sponsorId) {
        if (!state) return { ok:false, msg:"Nessuna carriera attiva." };
        if (!state.sponsors) state.sponsors = { signed: [], seasonStats: _newSeasonStats() };
        const sp = (window.SPONSOR_POOL || []).find(s => s.id === sponsorId);
        if (!sp) return { ok:false, msg:"Sponsor non trovato." };

        const tierInfo = window.SPONSOR_TIERS[sp.tier] || { maxSlots: 0 };
        const sameTier = state.sponsors.signed.filter(s => s.tier === sp.tier);
        if (sameTier.length >= (tierInfo.maxSlots || 0))
            return { ok:false, msg:`Slot ${tierInfo.label} pieno.` };

        if (state.sponsors.signed.some(s => s.id === sponsorId))
            return { ok:false, msg:"Sponsor già firmato." };

        const team = getPlayerTeam();
        const prestige = team?.prestige ?? 50;
        if ((sp.prestigeReq || 0) > prestige)
            return { ok:false, msg:"Prestigio insufficiente." };

        state.sponsors.signed.push({
            id: sp.id, name: sp.name, tier: sp.tier, color: sp.color,
            basePerRace: sp.basePerRace, bonusWin: sp.bonusWin, bonusPodium: sp.bonusPodium,
            bonusPoints: sp.bonusPoints, objective: sp.objective,
            signedAtRound: state.currentRound, objectiveProgress: 0,
        });
        _persist();
        return { ok:true, msg:`${sp.name} firmato!` };
    }

    /* Rimuove uno sponsor dal team (con penalità per rottura contratto). */
    function removeSponsor(sponsorId) {
        if (!state || !state.sponsors) return { ok:false, msg:"Nessuna carriera attiva." };
        const idx = state.sponsors.signed.findIndex(s => s.id === sponsorId);
        if (idx === -1) return { ok:false, msg:"Sponsor non trovato." };
        const penalty = 300;
        state.finances.budget = Math.max(0, state.finances.budget - penalty);
        state.sponsors.signed.splice(idx, 1);
        _persist();
        return { ok:true, msg:`Sponsor rimosso. Penale: €${penalty}K.` };
    }

    /* Calcola e accredita i pagamenti di tutti gli sponsor dopo una gara. */
    function _awardSponsorPayments(result) {
        if (!state.sponsors || !state.sponsors.signed.length) return 0;
        const myDrivers = result.results.filter(r => r.teamId === state.playerTeamId);
        if (!myDrivers.length) return 0;

        let totalEarned = 0;
        for (const sp of state.sponsors.signed) {
            let earned = sp.basePerRace;
            const tierBonusMult = sp.tier === "title" ? 1.0 : sp.tier === "technical" ? 0.8 : 0.6;
            for (const r of myDrivers) {
                const pos = r.position;
                if (pos === "DNF") continue;
                if (pos === 1) earned += sp.bonusWin;
                if (pos <= 3) earned += sp.bonusPodium;
                if (r.points > 0) earned += r.points * sp.bonusPoints;
            }
            earned = Math.round(earned * tierBonusMult);
            totalEarned += earned;
        }
        state.finances.budget += totalEarned;
        _updateSponsorSeasonStats(result);
        return totalEarned;
    }

    /* Aggiorna le statistiche stagionali usate dagli obiettivi sponsor. */
    function _updateSponsorSeasonStats(result) {
        if (!state.sponsors.seasonStats) state.sponsors.seasonStats = _newSeasonStats();
        const ss = state.sponsors.seasonStats;
        const myDrivers = result.results.filter(r => r.teamId === state.playerTeamId);
        ss.totalRaces++;

        if (state.lastQualifying && state.lastQualifying.round === state.currentRound) {
            const grid = state.lastQualifying.grid;
            for (const g of grid) {
                const isMine = myDrivers.some(d => d.driverId === g.driverId);
                if (isMine) {
                    const gridPos = grid.indexOf(g) + 1;
                    if (gridPos <= 5) ss.qualTop5++;
                    if (gridPos <= 10) ss.qualTop10++;
                }
            }
        }

        let teamScored = false, teamFinished = false;
        for (const r of myDrivers) {
            const pos = r.position;
            if (pos === "DNF") continue;
            teamFinished = true;
            if (pos === 1) { ss.wins++; teamScored = true; }
            if (pos <= 3) { ss.podiums++; teamScored = true; }
            if (r.points > 0) teamScored = true;
        }
        if (teamScored) ss.pointsFinishes++;
        if (teamFinished) ss.finishes++;
    }

    /* Valuta se gli obiettivi degli sponsor sono raggiunti (a fine stagione).
       Usa un flag per evitare doppi pagamenti se chiamata più volte. */
    function _evaluateSponsorObjectives() {
        if (!state.sponsors) return [];
        if (state.sponsors.objectivesEvaluated) return state.sponsors.lastEvalResults || [];
        const ss = state.sponsors.seasonStats;
        const results = [];
        for (const sp of state.sponsors.signed) {
            const obj = sp.objective;
            if (!obj) continue;
            let achieved = false;
            switch (obj.type) {
                case "wins": achieved = ss.wins >= obj.threshold; break;
                case "podiums": achieved = ss.podiums >= obj.threshold; break;
                case "pointsFinish": achieved = ss.pointsFinishes >= obj.threshold; break;
                case "finishRate":
                    const rate = ss.totalRaces > 0 ? ss.finishes / ss.totalRaces : 0;
                    achieved = rate >= obj.threshold; break;
                case "qualifyingPosition":
                    achieved = ss.qualTop5 >= (obj.threshold >= 5 ? 5 : 3); break;
                case "championshipPosition":
                    const teamStand = state.standings.teams.findIndex(t => t.id === state.playerTeamId);
                    achieved = teamStand >= 0 && teamStand < obj.threshold; break;
            }
            sp.objectiveProgress = achieved ? 1 : 0;
            if (achieved) state.finances.budget += obj.reward || 0;
            results.push({ sponsor: sp.name, achieved, reward: obj.reward || 0, label: obj.label });
        }
        state.sponsors.objectivesEvaluated = true;
        state.sponsors.lastEvalResults = results;
        _persist();
        return results;
    }

    function getSponsors() { return state?.sponsors || { signed: [], seasonStats: _newSeasonStats() }; }

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

    return { startNewCareer, advanceSession, simulateCurrentSession, loadFromSlot, restore, close, getState, isActive, getPlayerTeam, nextRoundInfo, getBudget, trySpend, setStaffLevel, markProjectUnlocked, signSponsor, removeSponsor, getSponsors, _evaluateSponsorObjectives, startNextSeason, getSeasonSummary };
})();
if (typeof window !== "undefined") window.CareerManager = CareerManager;