const CareerManager = (() => {
    let state = null;
    let saveSlotId = null;

    function startNewCareer(opts) {
        const champId = opts.champId;
        const cfg = CHAMPIONSHIPS[champId];
        state = {
            id: "career_" + Date.now().toString(36), name: opts.name || "Career",
            champId, champName: cfg.name, family: cfg.family, season: 2026,
            currentRound: 0, totalRounds: 24, // Set to 24 races
            playerTeamId: opts.team.id, playerTeamName: opts.team.name, isCustomTeam: !!opts.isCustom,
            finances: { budget: opts.team.budget ?? 0 },
            // Team development saved in the career (persists across reloads, unlike
            // ALL_TEAMS which is reloaded clean from the JS files).
            playerTeamDev: { staff: Object.assign({}, opts.team.staff), rnd: { unlocked: {} } },
            currentSession: 0, // 0=Practice, 1=Qualifying, 2=Race
            calendar: _buildCalendar(cfg),
            results: [], standings: { drivers: [], teams: [] },
            // Sponsor System: slots per tier + seasonal objective tracking
            sponsors: { signed: [], seasonStats: { wins:0, podiums:0, pointsFinishes:0, finishes:0, qualTop5:0, qualTop10:0, totalRaces:0 } },
        };
        saveSlotId = null;
        _applyPlayerDev();
        _recomputeStandings();
        return state;
    }

    /* Re-applies the saved development (staff + R&D projects) to the live team
       object in ALL_TEAMS. Called on startup and after every restore. */
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
        const rounds = 24; // Set to 24 races (see startNewCareer.totalRounds)

        // Shuffle the pool (Fisher-Yates) to avoid fixed-order bias.
        for (let i = trackPool.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [trackPool[i], trackPool[j]] = [trackPool[j], trackPool[i]];
        }

        // If the pool is smaller than the number of races, repeat the entire
        // pool at least once, then continue shuffling a second copy. This
        // minimizes repetitions and distributes them evenly.
        const picks = [];
        if (trackPool.length === 0) {
            for (let r = 1; r <= rounds; r++) picks.push({ id:`gen_${r}`, name:`Round ${r}`, country:"-", surface:"asphalt" });
        } else {
            let idx = 0;
            while (picks.length < rounds) {
                if (idx >= trackPool.length) {
                    // second pass: re-shuffle to vary the order
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
            // totalRounds is a count (e.g. 24); calendar indices are 0..totalRounds-1.
            // Once currentRound reaches totalRounds, the season is over.
            if (state.currentRound >= state.totalRounds) {
                _persist(); // Persist the completed season state
                return { seasonComplete: true };
            }
        }
        _persist();
        return { seasonComplete: false, session: state.currentSession, round: state.currentRound };
    }

    /* --- SEASON TRANSITION & CAREER PROGRESSION -------------------------- */
    /* Advances to the next season: evaluates sponsors, ages drivers,
       progresses/declines their stats, updates prestige and budget. */
    function startNextSeason() {
        if (!state) return null;

        // 1) Evaluate sponsor objectives and credit rewards
        const sponsorResults = _evaluateSponsorObjectives();

        // 2) Calculate prestige based on championship position
        _updateTeamPrestige();

        // 3) Age drivers and progress/decline their stats
        _progressAllDrivers();

        // 4) Renew or release drivers with expired contracts
        _handleDriverContracts();

        // 5) Reset for the new season
        state.season++;
        state.currentRound = 0;
        state.currentSession = 0;
        state.results = [];
        state.standings = { drivers: [], teams: [] };
        state.lastPractice = null;
        state.lastQualifying = null;

        // 6) Regenerate the calendar for the new season
        const cfg = CHAMPIONSHIPS[state.champId];
        state.calendar = _buildCalendar(cfg);

        // 7) Reset seasonal sponsor stats and evaluation flag
        if (state.sponsors) {
            state.sponsors.seasonStats = _newSeasonStats();
            state.sponsors.objectivesEvaluated = false;
            delete state.sponsors.lastEvalResults;
        }

        // 8) Starting budget bonus for the new season (depends on prestige)
        const team = getPlayerTeam();
        const seasonBonus = 2000 + Math.round((team?.prestige ?? 50) * 30);
        state.finances.budget += seasonBonus;

        _applyPlayerDev();
        _persist();
        return { season: state.season, sponsorResults, seasonBonus };
    }

    /* Updates team prestige based on final championship position. */
    function _updateTeamPrestige() {
        if (!state) return;
        const teamStand = state.standings.teams.slice().sort((a,b) => b.points - a.points);
        const myPos = teamStand.findIndex(t => t.id === state.playerTeamId);
        const team = getPlayerTeam();
        if (!team || myPos < 0) return;

        const totalTeams = teamStand.length;
        // Top 3: +5 to +8, points zone: +2 to +3, relegation: -3 to -5
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

    /* Ages all drivers and progresses/declines their stats based on age,
       morale and season performance. */
    function _progressAllDrivers() {
        if (!state) return;
        _ensureDev();
        // Snapshot of ALL drivers (not just the player's): ALL_TEAMS is
        // reloaded clean from the JS files on every reload, so without this
        // snapshot AI driver progress would be lost between seasons.
        if (!state.playerTeamDev.allDriversProgress) state.playerTeamDev.allDriversProgress = {};
        const aiProgress = state.playerTeamDev.allDriversProgress;

        const teams = ALL_TEAMS[state.champId] || [];
        for (const t of teams) {
            for (const d of (t.drivers || [])) {
                // Restore stats saved from the previous season (if present)
                const saved = aiProgress[d.id];
                if (saved) {
                    d.age = saved.age; d.pace = saved.pace; d.consistency = saved.consistency;
                    d.racecraft = saved.racecraft; d.wetPerformance = saved.wetPerformance;
                    d.fuelTyreMgmt = saved.fuelTyreMgmt; d.qualifying = saved.qualifying;
                    d.rating = saved.rating; d.morale = saved.morale;
                } else {
                    d.age = (d.age || 25) + 1;
                }

                // Development window: 16-23 grows, 24-30 stable, 31+ declines
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

                // Recalculate rating
                d.rating = +(d.pace*0.30 + d.consistency*0.20 + d.racecraft*0.20 + d.qualifying*0.15 + d.wetPerformance*0.10 + d.fuelTyreMgmt*0.05).toFixed(3);

                // Reset morale at season start (slightly influenced by performance)
                d.morale = Math.round(Math.max(40, Math.min(90, 65 + (d.rating - 0.5) * 40)));

                // Save driver state for the next season
                aiProgress[d.id] = {
                    age: d.age, pace: d.pace, consistency: d.consistency,
                    racecraft: d.racecraft, wetPerformance: d.wetPerformance,
                    fuelTyreMgmt: d.fuelTyreMgmt, qualifying: d.qualifying,
                    rating: d.rating, morale: d.morale, contractYears: d.contractYears
                };
            }
        }
        // Persist player's driver morale
        _ensureDev();
        const playerTeam = getPlayerTeam();
        if (playerTeam) {
            for (const d of (playerTeam.drivers || [])) {
                state.playerTeamDev.driverMorale[d.id] = d.morale;
            }
        }
    }

    /* Handles contract expiration: decrements years and releases drivers
       with 0-year contracts (only for player teams, for simplicity). */
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
                // Contract expired: 50% chance of automatic renewal if morale is high
                if ((d.morale || 75) >= 70 && Math.random() < 0.5) {
                    d.contractYears = 1 + Math.floor(Math.random() * 2);
                    remaining.push(d);
                }
                // Otherwise the driver leaves the team
            }
        }
        playerTeam.drivers = remaining;
    }

    /* Returns an end-of-season summary for the UI. */
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
        // More varied weather: 60% dry, 25% mixed, 15% wet. More adverse for offroad.
        const isOffroad = (cfg.family === "Rally" || cfg.family === "Raid");
        const r = Math.random();
        let weather;
        if (isOffroad) {
            weather = r < 0.40 ? "dry" : r < 0.70 ? "mixed" : "wet";
        } else {
            weather = r < 0.60 ? "dry" : r < 0.85 ? "mixed" : "wet";
        }

        if (state.currentSession === 0) {
            // PRACTICE: gathers setup info and potential
            const practice = window.engine.simulatePractice(state.champId, {
                weather, surface: round.surface, trackId: round.trackId
            });
            state.lastPractice = { round: state.currentRound, results: practice };
            _persist();
            return { session: 0, type: "practice", results: practice };
        }

        if (state.currentSession === 1) {
            // QUALIFYING: sets the starting grid
            const quali = window.engine.simulateQualifying(state.champId, {
                weather, surface: round.surface, trackId: round.trackId
            });
            state.lastQualifying = { round: state.currentRound, grid: quali };
            _persist();
            return { session: 1, type: "qualifying", grid: quali };
        }

        // RACE (session 2): uses the grid from qualifying if available
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

    /* --- SPONSOR SYSTEM --------------------------------------------------- */
    function _newSeasonStats() {
        return { wins:0, podiums:0, pointsFinishes:0, finishes:0, qualTop5:0, qualTop10:0, totalRaces:0 };
    }

    /* Signs a sponsor if there's room in the tier and prestige is sufficient. */
    function signSponsor(sponsorId) {
        if (!state) return { ok:false, msg:"No active career." };
        if (!state.sponsors) state.sponsors = { signed: [], seasonStats: _newSeasonStats() };
        const sp = (window.SPONSOR_POOL || []).find(s => s.id === sponsorId);
        if (!sp) return { ok:false, msg:"Sponsor not found." };

        const tierInfo = window.SPONSOR_TIERS[sp.tier] || { maxSlots: 0 };
        const sameTier = state.sponsors.signed.filter(s => s.tier === sp.tier);
        if (sameTier.length >= (tierInfo.maxSlots || 0))
            return { ok:false, msg:`${tierInfo.label} slot is full.` };

        if (state.sponsors.signed.some(s => s.id === sponsorId))
            return { ok:false, msg:"Sponsor already signed." };

        const team = getPlayerTeam();
        const prestige = team?.prestige ?? 50;
        if ((sp.prestigeReq || 0) > prestige)
            return { ok:false, msg:"Insufficient prestige." };

        state.sponsors.signed.push({
            id: sp.id, name: sp.name, tier: sp.tier, color: sp.color,
            basePerRace: sp.basePerRace, bonusWin: sp.bonusWin, bonusPodium: sp.bonusPodium,
            bonusPoints: sp.bonusPoints, objective: sp.objective,
            signedAtRound: state.currentRound, objectiveProgress: 0,
        });
        _persist();
        return { ok:true, msg:`${sp.name} signed!` };
    }

    /* Removes a sponsor from the team (with penalty for contract breach). */
    function removeSponsor(sponsorId) {
        if (!state || !state.sponsors) return { ok:false, msg:"No active career." };
        const idx = state.sponsors.signed.findIndex(s => s.id === sponsorId);
        if (idx === -1) return { ok:false, msg:"Sponsor not found." };
        const penalty = 300;
        state.finances.budget = Math.max(0, state.finances.budget - penalty);
        state.sponsors.signed.splice(idx, 1);
        _persist();
        return { ok:true, msg:`Sponsor removed. Penalty: €${penalty}K.` };
    }

    /* Calculates and credits payments for all sponsors after a race. */
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

    /* Updates seasonal stats used by sponsor objectives. */
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

    /* Evaluates whether sponsor objectives are achieved (at end of season).
       Uses a flag to avoid double payments if called multiple times. */
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
                    // topN = qualifying position target (5 or 10); racesCount = how many races to hit it.
                    const topN = obj.topN || 5;
                    const racesCount = obj.racesCount || obj.threshold || 1;
                    achieved = (topN <= 5 ? ss.qualTop5 : ss.qualTop10) >= racesCount;
                    break;
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

    /* --- DYNAMIC MORALE SYSTEM -------------------------------------------- */
    /* Updates all drivers' morale after a race based on position.
       Podium = +, points zone = +/-, back of grid or DNF = -. Persists player's
       driver morale in playerTeamDev.driverMorale. */
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
                    // persist only player's drivers
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

    /* --- BUDGET (single source of truth for player's money) --------------- */
    function getBudget() { return state ? (state.finances.budget || 0) : 0; }
    /* Try to spend: if funds are sufficient, deducts and persists, else false. */
    function trySpend(amount) {
        if (!state || amount < 0) return false;
        if (state.finances.budget < amount) return false;
        state.finances.budget -= amount;
        _persist();
        return true;
    }

    /* --- R&D DEVELOPMENT (persistent) ------------------------------------ */
    function _ensureDev() {
        if (!state.playerTeamDev) state.playerTeamDev = { staff: {}, rnd: { unlocked: {} }, driverMorale: {} };
        if (!state.playerTeamDev.staff) state.playerTeamDev.staff = {};
        if (!state.playerTeamDev.rnd) state.playerTeamDev.rnd = { unlocked: {} };
        if (!state.playerTeamDev.rnd.unlocked) state.playerTeamDev.rnd.unlocked = {};
        if (!state.playerTeamDev.driverMorale) state.playerTeamDev.driverMorale = {};
    }
    /* Sets a department level: updates live team + persistent snapshot. */
    function setStaffLevel(deptKey, level) {
        if (!state) return;
        _ensureDev();
        state.playerTeamDev.staff[deptKey] = level;
        const team = getPlayerTeam();
        if (team) { team.staff = team.staff || {}; team.staff[deptKey] = level; }
        _persist();
    }
    /* Marks a special project as unlocked (live team + snapshot). */
    function markProjectUnlocked(projId) {
        if (!state) return;
        _ensureDev();
        state.playerTeamDev.rnd.unlocked[projId] = true;
        const team = getPlayerTeam();
        if (team) { team.rnd = team.rnd || { unlocked: {} }; team.rnd.unlocked = team.rnd.unlocked || {}; team.rnd.unlocked[projId] = true; }
        _persist();
    }

    function _persist() { if (!state) return; if (!saveSlotId) saveSlotId = SaveSystem.createSave(state.name, { careerState: state }); else SaveSystem.updateSave(saveSlotId, { careerState: state }); }
    /** Public save: forces a persist of the current career. Returns true on success. */
    function save() {
        if (!state) return false;
        _persist();
        return true;
    }
    function loadFromSlot(slotId) { const data = SaveSystem.loadSave(slotId); if (!data) return false; saveSlotId = slotId; return restore(data); }
    function restore(data) { state = data.careerState; _applyPlayerDev(); return true; }
    function close() { state = null; saveSlotId = null; }

    function getState() { return state; }
    function isActive() { return state !== null; }
    function getPlayerTeam() { return (ALL_TEAMS[state.champId]||[]).find(t => t.id === state.playerTeamId) || null; }
    function nextRoundInfo() { return state ? state.calendar[state.currentRound] : null; }

    return { startNewCareer, advanceSession, simulateCurrentSession, loadFromSlot, restore, close, getState, isActive, getPlayerTeam, nextRoundInfo, getBudget, trySpend, setStaffLevel, markProjectUnlocked, signSponsor, removeSponsor, getSponsors, _evaluateSponsorObjectives, startNextSeason, getSeasonSummary, save };
})();
if (typeof window !== "undefined") window.CareerManager = CareerManager;