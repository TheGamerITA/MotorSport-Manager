const MasterUI = (() => {
    let currentChampId = "f1";
    const $ = (s) => document.querySelector(s);
    const $$ = (s) => Array.from(document.querySelectorAll(s));

    function init() {
        bindNav();
        bindRaceControls();
        bindScouting();
    }

    function refreshFromCareer() {
        const state = CareerManager.getState();
        if (!state) return;
        currentChampId = state.champId;
        $(".brand h1").textContent = state.champName;
        $(".brand-sub").textContent = `Season ${state.season} · ${state.playerTeamName}`;
        refreshAllViews();
    }

    function bindNav() {
        $$(".nav-btn").forEach(btn => {
            btn.onclick = () => {
                $$(".nav-btn").forEach(b => b.classList.remove("active"));
                $$(".view").forEach(v => v.classList.remove("active"));
                btn.classList.add("active");
                $("#view-" + btn.dataset.view).classList.add("active");
            };
        });
    }

    function bindRaceControls() { $("#simBtn").onclick = runWeekend; }

    function runWeekend() {
        const btn = $("#simBtn");
        const state = CareerManager.getState();
        const sessions = ["Practice", "Qualifying", "Race"];

        btn.disabled = true;
        btn.textContent = "SIMULATING...";

        setTimeout(() => {
            const result = CareerManager.simulateCurrentSession();
            const completedSession = state.currentSession;
            const advance = CareerManager.advanceSession();

            if (result) {
                renderSessionResult(result, completedSession);
                if (typeof RenderView !== "undefined") {
                    if (completedSession === 2) {
                        // Race: full animation with drivers
                        RenderView.loadAndPlay(result);
                    } else {
                        // Practice / Qualifying: show static track preview
                        // (avoids the "green canvas" with no animation)
                        const round = state.calendar[state.currentRound];
                        const label = completedSession === 0 ? "📊 PRACTICE" : "🏁 QUALIFYING";
                        if (round && round.trackId) {
                            RenderView.showTrackPreview(round.trackId, label);
                        }
                    }
                }
            }

            if (advance.seasonComplete) {
                $("#statusMsg").textContent = "Season complete!";
                btn.textContent = "NEW SEASON";
                btn.onclick = _startNextSeason;
                _showSeasonSummary();
            } else {
                const nextSess = sessions[CareerManager.getState().currentSession];
                $("#statusMsg").textContent = `Round ${state.currentRound + 1}: ${sessions[completedSession]} complete. Next: ${nextSess}`;
                btn.textContent = `SIMULATE ${nextSess.toUpperCase()}`;
            }
            btn.disabled = false;
            refreshAllViews();
        }, 500);
    }

    /* Renders the results based on the session type (0=practice, 1=qualifying, 2=race) */
    function renderSessionResult(result, sessionType) {
        if (sessionType === 0) renderPracticeResult(result);
        else if (sessionType === 1) renderQualifyingResult(result);
        else renderRaceResult(result);
    }

    function renderPracticeResult(result) {
        $("#resultsTable thead").innerHTML = `<tr><th>#</th><th>Driver</th><th>Team</th><th>Best Lap</th><th>Consistency</th><th>Setup</th></tr>`;
        $("#resultsTable tbody").innerHTML = result.results.map((r, i) => `
            <tr>
                <td class="pos">${i + 1}</td>
                <td>${r.driver}</td>
                <td>${r.team}</td>
                <td class="time">${r.bestLapStr}</td>
                <td>${Math.round(r.consistency * 100)}%</td>
                <td>${Math.round(r.setupConfidence * 100)}%</td>
            </tr>`).join("");
        $("#raceLog").innerHTML = `<div class="log-line">📊 Practice complete. The team gathered setup and reliability data.</div>`;
    }

    function renderQualifyingResult(result) {
        $("#resultsTable thead").innerHTML = `<tr><th>Grid</th><th>Driver</th><th>Team</th><th>Lap Time</th><th>Gap to Pole</th><th>Gap to Prev.</th></tr>`;
        const poleTime = result.grid.length ? result.grid[0].bestLapMs : 0;
        const playerTeamId = CareerManager.getState()?.playerTeamId;
        const allTeams = (typeof ALL_TEAMS !== "undefined" && ALL_TEAMS[CareerManager.getState().champId]) || [];
        const teamColor = (teamName) => (allTeams.find(tm => tm.name === teamName)?.color) || "#888";

        $("#resultsTable tbody").innerHTML = result.grid.map((g, i) => {
            const gapPole = i === 0 ? "POLE" : `+${((g.bestLapMs - poleTime) / 1000).toFixed(3)}s`;
            const gapPrev = i === 0 ? "—" : `+${((g.bestLapMs - result.grid[i-1].bestLapMs) / 1000).toFixed(3)}s`;
            const isPlayer = allTeams.some(tm => tm.name === g.team && tm.id === playerTeamId);
            const rowStyle = isPlayer ? 'style="font-weight:bold;background:rgba(0,212,255,0.08);"' : '';
            return `
            <tr ${rowStyle}>
                <td class="pos">${i + 1}</td>
                <td>${g.driver}</td>
                <td><span style="color:${teamColor(g.team)};">●</span> ${g.team}</td>
                <td class="time">${g.lapTimeStr}</td>
                <td>${gapPole}</td>
                <td style="color:var(--txt-2);">${gapPrev}</td>
            </tr>`;
        }).join("");
        $("#raceLog").innerHTML = `<div class="log-line">🏁 Qualifying complete. The starting grid has been set.</div>`;
    }

    function bindScouting() { $("#scoutBtn").onclick = scoutNewTalent; }

    function refreshAllViews() {
        renderGlobalStats();
        renderTeamView();
        renderFinanceView();
        renderScoutingView();
        renderRndView();
        renderStandingsView();
        renderCalendarView();
        renderRaceMeta();
        renderSponsorsView();
    }

    function renderGlobalStats() {
        const state = CareerManager.getState();
        const budget = CareerManager.getBudget();
        $("#globalStats").innerHTML = `
            <div class="stat-pill"><span class="k">Budget</span><span class="v">€${(budget/1000).toFixed(1)}M</span></div>
            <div class="stat-pill"><span class="k">Round</span><span class="v">${state.currentRound + 1}/${state.totalRounds}</span></div>`;
    }

    function statBar(value, cls = "") {
        const pct = Math.round((value || 0) * 100);
        return `<span class="stat-bar ${cls}"><i style="width:${pct}%"></i></span>`;
    }

    function renderTeamView() {
        const team = CareerManager.getPlayerTeam();
        if (!team) return;
        $("#teamContent").innerHTML = team.drivers.map(d => {
            const baseStats = ["pace","consistency","racecraft","wetPerformance","fuelTyreMgmt","qualifying"];
            const statLabel = { pace:"Pace", consistency:"Consistency", racecraft:"Racecraft", wetPerformance:"Wet", fuelTyreMgmt:"Mgmt", qualifying:"Qualifying" };
            const rows = baseStats.map(k => `
                <span class="lab">${statLabel[k]}</span>
                ${statBar(d[k] || 0.5, d[k] < 0.4 ? "bad" : d[k] > 0.85 ? "good" : "")}
                <span class="val">${Math.round((d[k] || 0.5)*100)}</span>
            `).join("");

            return `
            <div class="driver-card" style="border-left-color:${team.color};">
                <div class="dc-head">
                    <img src="img/${team.id}.png" class="team-logo" onerror="this.outerHTML='<div class="team-logo fallback" style="background:${team.color}">${team.name.substring(0,2).toUpperCase()}</div>'" />
                    <div>
                        <div class="dc-name">#${d.number} ${d.name}</div>
                        <div class="dc-meta">Rating: ${Math.round((d.rating||0)*100)} · Age: ${d.age} · ${d.nationality}</div>
                    </div>
                </div>
                <div class="dc-stats">${rows}</div>
                <div style="margin-top:10px; font-size:11px; color:var(--txt-2); display:flex; justify-content:space-between;">
                    <span>Morale: <b style="color:var(--accent);">${d.morale}</b></span>
                    <span>Salary: <b style="color:var(--accent-2);">€${(d.salary/1000).toFixed(1)}M</b></span>
                    <span>Contract: ${d.contractYears}y</span>
                </div>
                <button class="btn-secondary driver-release" data-id="${d.id}" style="margin-top:10px; width:100%; color:var(--bad);">
                    Release Driver
                </button>
            </div>`;
        }).join("");
        $$("#teamContent .driver-release").forEach(b => b.onclick = () => _releaseDriver(b.dataset.id));
    }

    /* Releases a driver from the player's team (with a residual salary penalty). */
    function _releaseDriver(driverId) {
        const team = CareerManager.getPlayerTeam();
        if (!team) return;
        const driver = team.drivers.find(d => d.id === driverId);
        if (!driver) return;
        // Penalty: 50% of the residual salary for the season
        const penalty = Math.round((driver.salary || 0) * 0.5);
        if (!CareerManager.trySpend(penalty)) {
            $("#statusMsg").textContent = "Insufficient funds to pay the release penalty.";
            return;
        }
        team.drivers = team.drivers.filter(d => d.id !== driverId);
        $("#statusMsg").textContent = `${driver.name} released. Penalty paid: €${(penalty/1000).toFixed(1)}M.`;
        renderTeamView();
        renderFinanceView();
        renderGlobalStats();
    }

    function renderRaceResult(result) {
        $("#resultsTable thead").innerHTML = `<tr><th>Pos</th><th>Driver</th><th>Team</th><th>Time</th><th>Points</th></tr>`;
        $("#resultsTable tbody").innerHTML = result.results.map(r => `
            <tr>
                <td class="pos">${r.position}</td>
                <td>${r.driver}</td>
                <td>${r.team}</td>
                <td class="time">${r.timeStr}</td>
                <td class="pts">${r.points}</td>
            </tr>`).join("");

        $("#raceLog").innerHTML = result.logs.length ? result.logs.map(l => `<div class="log-line"><span class="drv">${l.driver}</span> ${l.msg}</div>`).join("") : `<div class="log-line">Clean race.</div>`;
    }

    function renderFinanceView() {
        const t = CareerManager.getPlayerTeam();
        const budget = CareerManager.getBudget();
        const payroll = (t?.drivers||[]).reduce((s,d)=>s+(d.salary||0),0);
        const projected = (budget - payroll) / 1000;

        $("#financeContent").innerHTML = `
            <div class="card">
                <h3>Annual Balance</h3>
                <div class="fin-row"><span>Available budget</span><span class="v pos">€${(budget/1000).toFixed(2)}M</span></div>
                <div class="fin-row"><span>Driver salaries</span><span class="v neg">−€${(payroll/1000).toFixed(2)}M</span></div>
                <div class="fin-row" style="border-bottom:none;"><b>Projected balance</b><b class="v" style="color:var(--accent);">€${projected.toFixed(2)}M</b></div>
            </div>`;
    }

    let scoutResults = [];

    function renderScoutingView() {
        if (scoutResults.length === 0) {
            $("#scoutContent").innerHTML = `<p class="hint">No talent found. Use the "Start Scouting" button to search for young prospects.</p>`;
            return;
        }
        $("#scoutContent").innerHTML = scoutResults.map(d => {
            const baseStats = ["pace","consistency","racecraft","wetPerformance","fuelTyreMgmt","qualifying"];
            const statLabel = { pace:"Pace", consistency:"Consistency", racecraft:"Racecraft", wetPerformance:"Wet", fuelTyreMgmt:"Mgmt", qualifying:"Qualifying" };
            const rows = baseStats.map(k => `
                <span class="lab">${statLabel[k]}</span>
                ${statBar(d[k] || 0.5, d[k] < 0.4 ? "bad" : d[k] > 0.85 ? "good" : "")}
                <span class="val">${Math.round((d[k] || 0.5)*100)}</span>
            `).join("");
            return `
            <div class="driver-card">
                <div class="dc-head">
                    <div>
                        <div class="dc-name">🆕 ${d.name}</div>
                        <div class="dc-meta">Rating: ${Math.round((d.rating||0)*100)} · Age: ${d.age} · ${d.nationality}</div>
                    </div>
                </div>
                <div class="dc-stats">${rows}</div>
                <div style="margin-top:10px; font-size:11px; color:var(--txt-2); display:flex; justify-content:space-between; align-items:center;">
                    <span>Required salary: <b style="color:var(--accent-2);">€${(d.salary/1000).toFixed(1)}M</b></span>
                    <button class="btn-primary scout-sign" data-id="${d.id}">Sign</button>
                </div>
            </div>`;
        }).join("");
        $$("#scoutContent .scout-sign").forEach(b => b.onclick = () => _signTalent(b.dataset.id));
    }

    const RND_DEPARTMENTS = [
        { key: "aero",      label: "Aerodynamics", desc: "Downforce and aero efficiency." },
        { key: "engine",    label: "Engine",        desc: "Power and reliability." },
        { key: "mechanics", label: "Mechanics",     desc: "Suspension and pit stops." },
    ];
    const RND_MAX_LEVEL = 99;
    const RND_STEP = 2;
    function rndUpgradeCost(level) { return Math.round(400 + level * 40); }

    const RND_PROJECTS = [
        { id: "drs_evo",       name: "Advanced DRS",       desc: "More efficient rear wing.",        dept: "aero",      reqLevel: 70, cost: 6000, bonus: 4 },
        { id: "ground_effect", name: "Enhanced Ground Effect", desc: "More downforce in high-speed corners.", dept: "aero",      reqLevel: 85, cost: 12000, bonus: 5 },
        { id: "hybrid_evo",    name: "Hybrid Powertrain",   desc: "Better thermal efficiency.",        dept: "engine",    reqLevel: 70, cost: 7000, bonus: 4 },
        { id: "energy_recovery", name: "Energy Recovery",  desc: "Enhanced ERS under braking.",       dept: "engine",    reqLevel: 85, cost: 12000, bonus: 5 },
        { id: "fast_pit",      name: "Elite Pit Crew",      desc: "Faster and safer pit stops.",       dept: "mechanics", reqLevel: 70, cost: 6000, bonus: 4 },
    ];

    function renderRndView() {
        const t = CareerManager.getPlayerTeam();
        if (!t) return;

        if (!t.rnd) t.rnd = { unlocked: {} };
        if (!t.staff) t.staff = { aero: 50, engine: 50, mechanics: 50 };

        const budget = CareerManager.getBudget();
        const budgetM = (v) => `€${((v || 0) / 1000).toFixed(1)}M`;

        const deptCards = RND_DEPARTMENTS.map(dep => {
            const level = t.staff[dep.key] ?? 50;
            const cost = rndUpgradeCost(level);
            const maxed = level >= RND_MAX_LEVEL;
            const affordable = budget >= cost;
            const disabled = maxed || !affordable;
            const btnLabel = maxed ? "MAX" : `Upgrade +${RND_STEP} · ${budgetM(cost)}`;
            return `
            <div class="card">
                <div style="display:flex; justify-content:space-between; align-items:baseline;">
                    <h3 style="margin:0;">${dep.label}</h3>
                    <b style="color:var(--accent);">Lv ${level}</b>
                </div>
                <p class="hint" style="margin:4px 0 10px;">${dep.desc}</p>
                <div style="display:flex; align-items:center; gap:8px; margin-bottom:12px;">
                    ${statBar(level / 100, level > 85 ? "good" : level < 40 ? "bad" : "")}
                    <span class="val">${level}</span>
                </div>
                <button class="btn-secondary rnd-upgrade" data-dept="${dep.key}"
                    ${disabled ? "disabled style='opacity:.5; cursor:not-allowed;'" : ""}>
                    ${btnLabel}
                </button>
            </div>`;
        }).join("");

        const projCards = RND_PROJECTS.map(p => {
            const unlocked = !!t.rnd.unlocked[p.id];
            const deptLevel = t.staff[p.dept] ?? 50;
            const meetsReq = deptLevel >= p.reqLevel;
            const affordable = budget >= p.cost;
            const canUnlock = !unlocked && meetsReq && affordable;
            const depLabel = (RND_DEPARTMENTS.find(d => d.key === p.dept) || {}).label || p.dept;

            let status, btn;
            if (unlocked) {
                status = `<span style="color:var(--good);">✔ Unlocked (+${p.bonus} ${depLabel})</span>`;
                btn = "";
            } else if (!meetsReq) {
                status = `<span style="color:var(--txt-2);">🔒 Requires ${depLabel} Lv ${p.reqLevel}</span>`;
                btn = `<button class="btn-secondary" disabled style="opacity:.5; cursor:not-allowed;">Locked</button>`;
            } else {
                status = `<span style="color:${affordable ? "var(--accent)" : "var(--bad)"};">${budgetM(p.cost)}${affordable ? "" : " (insufficient funds)"}</span>`;
                btn = `<button class="btn-primary rnd-unlock" data-proj="${p.id}" ${canUnlock ? "" : "disabled style='opacity:.5; cursor:not-allowed;'"}>Unlock</button>`;
            }

            return `
            <div class="card" style="${unlocked ? "border-left:3px solid var(--good);" : ""}">
                <div style="display:flex; justify-content:space-between; align-items:baseline; gap:10px;">
                    <h3 style="margin:0;">${p.name}</h3>
                    ${btn}
                </div>
                <p class="hint" style="margin:6px 0;">${p.desc}</p>
                <div style="font-size:12px;">${status}</div>
            </div>`;
        }).join("");

        $("#rndContent").innerHTML = `
            <div class="fin-row" style="margin-bottom:14px;">
                <span>Available development budget</span>
                <b style="color:var(--accent);">${budgetM(budget)}</b>
            </div>
            <h3 style="margin:6px 0 10px;">Technical Departments</h3>
            <div class="grid-cards">${deptCards}</div>
            <h3 style="margin:20px 0 10px;">Special Projects</h3>
            <div class="grid-cards">${projCards}</div>`;

        $$("#rndContent .rnd-upgrade").forEach(b => b.onclick = () => _upgradeDept(b.dataset.dept));
        $$("#rndContent .rnd-unlock").forEach(b => b.onclick = () => _unlockProject(b.dataset.proj));
    }

    function _upgradeDept(deptKey) {
        const t = CareerManager.getPlayerTeam();
        if (!t) return;
        const level = t.staff[deptKey] ?? 50;
        if (level >= RND_MAX_LEVEL) return;
        const cost = rndUpgradeCost(level);
        if (!CareerManager.trySpend(cost)) { $("#statusMsg").textContent = "Insufficient funds for upgrade."; return; }
        CareerManager.setStaffLevel(deptKey, Math.min(RND_MAX_LEVEL, level + RND_STEP));
        $("#statusMsg").textContent = `Department upgraded: ${deptKey} → Lv ${t.staff[deptKey]}.`;
        renderRndView();
        renderGlobalStats();
        renderTeamView();
        renderFinanceView();
    }

    function _unlockProject(projId) {
        const t = CareerManager.getPlayerTeam();
        if (!t) return;
        const p = RND_PROJECTS.find(x => x.id === projId);
        if (!p || (t.rnd.unlocked && t.rnd.unlocked[p.id])) return;
        if ((t.staff[p.dept] ?? 50) < p.reqLevel) return;
        if (!CareerManager.trySpend(p.cost)) { $("#statusMsg").textContent = "Insufficient funds for project."; return; }
        CareerManager.markProjectUnlocked(p.id);
        CareerManager.setStaffLevel(p.dept, Math.min(RND_MAX_LEVEL, (t.staff[p.dept] ?? 50) + p.bonus));
        $("#statusMsg").textContent = `Project unlocked: ${p.name} (+${p.bonus} ${p.dept}).`;
        renderRndView();
        renderGlobalStats();
        renderTeamView();
        renderFinanceView();
    }

    const TALENT_FIRST = ["Luca","Marco","Sofia","Anna","Leonardo","Giulia","Tommaso","Aurora","Francesco","Beatrice","Alessandro","Chiara","Niccolò","Martina","Enea","Vittoria","Giacomo","Eleonora","Samuele","Gaia"];
    const TALENT_LAST = ["Rossi","Bianchi","Conti","Marino","Ferrari","Esposito","Russo","Greco","Bruni","Costa","Moretti","Fontana","Galli","Lombardi","Barbieri","Rinaldi","Caruso","Pellegrini","Villa","Marchetti"];
    const TALENT_NATIONS = ["IT","GB","ES","DE","FR","NL","BR","AR","JP","AU","BE","MX","US","CA"];

    function _rnd(min,max){ return Math.random()*(max-min)+min; }

    function scoutNewTalent() {
        const cost = 50;
        if (!CareerManager.trySpend(cost)) { $("#statusMsg").textContent = "Insufficient funds for scouting."; return; }
        const count = 2 + Math.floor(Math.random()*2);
        scoutResults = [];
        for (let i=0;i<count;i++){
            const age = 16 + Math.floor(Math.random()*8);
            const base = age <= 18 ? 0.40 : age <= 21 ? 0.50 : 0.58;
            const talent = _rnd(-0.08, 0.12);
            const mk = () => Math.max(0.25, Math.min(0.92, base + talent + _rnd(-0.05,0.05)));
            const driver = {
                id: "scout_" + Date.now() + "_" + i,
                name: `${TALENT_FIRST[Math.floor(Math.random()*TALENT_FIRST.length)]} ${TALENT_LAST[Math.floor(Math.random()*TALENT_LAST.length)]}`,
                age,
                nationality: TALENT_NATIONS[Math.floor(Math.random()*TALENT_NATIONS.length)],
                number: 30 + Math.floor(Math.random()*69),
                pace: mk(), consistency: mk(), racecraft: mk(),
                wetPerformance: mk(), fuelTyreMgmt: mk(), qualifying: mk(),
                salary: Math.round((150 + Math.random()*250)*10)/10,
                morale: 75, contractYears: 2
            };
            driver.rating = (driver.pace+driver.consistency+driver.racecraft+driver.qualifying)/4;
            scoutResults.push(driver);
        }
        $("#statusMsg").textContent = `Scouting complete: ${count} talents found.`;
        renderScoutingView();
        renderGlobalStats();
        renderFinanceView();
    }

    function _signTalent(driverId) {
        const driver = scoutResults.find(d => d.id === driverId);
        if (!driver) return;
        const team = CareerManager.getPlayerTeam();
        if (!team) return;
        if (team.drivers.length >= 2) { $("#statusMsg").textContent = "You already have 2 drivers on the team."; return; }
        const signCost = 100;
        if (!CareerManager.trySpend(signCost)) { $("#statusMsg").textContent = "Insufficient funds for signing."; return; }
        const newDriver = { ...driver };
        // DO NOT delete newDriver.id: the ID is essential for tracking
        // the driver (DNF in the animation, career progression, standings).
        team.drivers.push(newDriver);
        scoutResults = scoutResults.filter(d => d.id !== driverId);
        $("#statusMsg").textContent = `${newDriver.name} signed for ${team.name}!`;
        renderTeamView();
        renderScoutingView();
        renderGlobalStats();
        renderFinanceView();
    }

    function renderStandingsView() {
        const state = CareerManager.getState();
        if (!state) return;
        const allTeams = (typeof ALL_TEAMS !== "undefined" && ALL_TEAMS[state.champId]) ? ALL_TEAMS[state.champId] : [];
        const playerTeamId = state.playerTeamId;
        const medal = ["🥇","🥈","🥉"];

        const driverStand = (state.standings?.drivers || []).slice().sort((a,b)=>b.points-a.points);
        const teamStand = (state.standings?.teams || []).slice().sort((a,b)=>b.points-a.points);

        if (!driverStand.length && !teamStand.length) {
            $("#standingsContent").innerHTML = `<div class="card"><p class="hint">No results yet. Race to populate the standings.</p></div>`;
            return;
        }

        const teamColor = (teamId) => (allTeams.find(tm => tm.id === teamId)?.color) || "#888";
        const teamName = (teamId) => (allTeams.find(tm => tm.id === teamId)?.name) || "—";

        $("#standingsContent").innerHTML = `
            <div class="card">
                <h3>🏆 Drivers' Standings</h3>
                <div class="table-wrap"><table class="data-table">
                    <thead><tr><th>#</th><th>Driver</th><th>Team</th><th>Points</th></tr></thead>
                    <tbody>${driverStand.map((d,i)=>`
                        <tr style="${d.teamId===playerTeamId?'font-weight:bold;':''}">
                            <td class="pos">${medal[i]||(i+1)}</td>
                            <td>${d.name}</td>
                            <td><span style="color:${teamColor(d.teamId)};">●</span> ${teamName(d.teamId)}</td>
                            <td class="pts">${d.points||0}</td>
                        </tr>`).join("")}</tbody>
                </table></div>
            </div>
            <div class="card" style="margin-top:16px;">
                <h3>🏁 Constructors' Standings</h3>
                <div class="table-wrap"><table class="data-table">
                    <thead><tr><th>#</th><th>Team</th><th>Points</th></tr></thead>
                    <tbody>${teamStand.map((t,i)=>`
                        <tr style="${t.id===playerTeamId?'font-weight:bold;':''}">
                            <td class="pos">${medal[i]||(i+1)}</td>
                            <td><span style="color:${teamColor(t.id)};">●</span> ${t.name}</td>
                            <td class="pts">${t.points||0}</td>
                        </tr>`).join("")}</tbody>
                </table></div>
            </div>`;
    }

    function renderCalendarView() {
        const state = CareerManager.getState();
        if (!state) { $("#calendarContent").innerHTML = `<p class="hint">No active career.</p>`; return; }
        const cal = state.calendar || [];
        if (!cal.length) { $("#calendarContent").innerHTML = `<p class="hint">Calendar not available.</p>`; return; }

        const current = state.currentRound;
        $("#calendarContent").innerHTML = `
            <div class="grid-cards">${cal.map((tr,i)=>{
                const done = i < current;
                const isCurrent = i === current;
                const statusCls = done ? "color:var(--txt-2);" : isCurrent ? "color:var(--accent);font-weight:bold;" : "";
                const badge = done ? "✔" : isCurrent ? "▶" : (i+1);
                return `
                <div class="card" style="${isCurrent?'border-left:3px solid var(--accent);':''}">
                    <div style="display:flex; justify-content:space-between; align-items:baseline;">
                        <h3 style="margin:0;">${badge} ${tr.name || "Round "+(i+1)}</h3>
                        <span style="${statusCls}font-size:12px;">${done?"Completed":isCurrent?"In progress":"To be disputed"}</span>
                    </div>
                    <p class="hint" style="margin:6px 0;">${tr.country || ""}${tr.surface?" · "+tr.surface:""}</p>
                </div>`;
            }).join("")}</div>`;
    }

    function renderSponsorsView() {
        if (!CareerManager.isActive()) { $("#sponsorsContent").innerHTML = `<p class="hint">No active career.</p>`; return; }
        const state = CareerManager.getState();
        const team = CareerManager.getPlayerTeam();
        const prestige = team?.prestige ?? 50;
        const sponsorsData = CareerManager.getSponsors();
        const signed = sponsorsData.signed || [];
        const ss = sponsorsData.seasonStats || {};
        const budgetM = (v) => `€${((v||0)/1000).toFixed(1)}M`;

        // Calculate projected sponsor income for the next race
        const projectedPerRace = signed.reduce((sum, s) => {
            return sum + s.basePerRace * (s.tier === "title" ? 1.0 : s.tier === "technical" ? 0.8 : 0.6);
        }, 0);

        // Available sponsors (not signed, sufficient prestige)
        const available = (window.SPONSOR_POOL || []).filter(s => {
            if (signed.some(x => x.id === s.id)) return false;
            if ((s.prestigeReq || 0) > prestige) return false;
            const tierInfo = window.SPONSOR_TIERS[s.tier] || { maxSlots: 0 };
            const sameTier = signed.filter(x => x.tier === s.tier);
            return sameTier.length < (tierInfo.maxSlots || 0);
        });

        const tierLabel = { title:"Title", technical:"Technical", partner:"Partner" };
        const tierColor = { title:"#00d4ff", technical:"#f39c12", partner:"#27ae60" };

        // Signed sponsor cards
        const signedCards = signed.length ? signed.map(s => {
            const obj = s.objective || {};
            const objProgressText = _sponsorObjectiveProgress(s, ss, state);
            return `
            <div class="card" style="border-left:3px solid ${s.color || tierColor[s.tier]};">
                <div style="display:flex; justify-content:space-between; align-items:baseline;">
                    <h3 style="margin:0;">${s.name}</h3>
                    <span style="font-size:11px; padding:2px 8px; border-radius:8px; background:${(s.color||tierColor[s.tier])}22; color:${s.color||tierColor[s.tier]};">${tierLabel[s.tier]}</span>
                </div>
                <div style="display:flex; gap:16px; margin:8px 0; font-size:12px; flex-wrap:wrap;">
                    <span>Base/race: <b style="color:var(--accent);">${budgetM(s.basePerRace)}</b></span>
                    <span>Win bonus: <b>+${budgetM(s.bonusWin)}</b></span>
                    <span>Podium bonus: <b>+${budgetM(s.bonusPodium)}</b></span>
                    <span>Points bonus: <b>+${s.bonusPoints}K/pt</b></span>
                </div>
                ${obj.label ? `
                <div style="margin-top:8px; padding:8px; background:rgba(255,255,255,0.03); border-radius:4px;">
                    <div style="font-size:11px; color:var(--txt-2);">📋 Objective: ${obj.label}</div>
                    <div style="font-size:11px; margin-top:4px;">${objProgressText}</div>
                    <div style="font-size:11px; color:var(--accent); margin-top:2px;">Reward: ${budgetM(obj.reward || 0)}</div>
                </div>` : ""}
                <button class="btn-secondary sponsor-remove" data-id="${s.id}" style="margin-top:10px; color:var(--bad);">Terminate (€300K penalty)</button>
            </div>`;
        }).join("") : `<p class="hint">No sponsors signed. Browse available sponsors below.</p>`;

        // Available sponsor cards
        const availCards = available.length ? available.map(s => {
            const tierInfo = window.SPONSOR_TIERS[s.tier] || { maxSlots: 0 };
            return `
            <div class="card" style="border-left:3px solid ${s.color};">
                <div style="display:flex; justify-content:space-between; align-items:baseline;">
                    <h3 style="margin:0;">${s.name}</h3>
                    <span style="font-size:11px; padding:2px 8px; border-radius:8px; background:${s.color}22; color:${s.color};">${tierLabel[s.tier]}</span>
                </div>
                <div style="display:flex; gap:16px; margin:8px 0; font-size:12px; flex-wrap:wrap;">
                    <span>Base/race: <b style="color:var(--accent);">${budgetM(s.basePerRace)}</b></span>
                    <span>Win bonus: <b>+${budgetM(s.bonusWin)}</b></span>
                    <span>Podium bonus: <b>+${budgetM(s.bonusPodium)}</b></span>
                </div>
                ${s.objective ? `
                <div style="margin-top:6px; font-size:11px; color:var(--txt-2);">📋 ${s.objective.label}</div>
                <div style="font-size:11px; color:var(--accent);">Season reward: ${budgetM(s.objective.reward || 0)}</div>` : ""}
                <button class="btn-primary sponsor-sign" data-id="${s.id}" style="margin-top:10px;">Sign Sponsor</button>
            </div>`;
        }).join("") : `<p class="hint">No sponsors available for your current prestige level.</p>`;

        // Season statistics
        const statsBar = `
        <div class="card" style="margin-bottom:16px;">
            <h3 style="margin:0 0 10px;">📊 Sponsor Season Stats</h3>
            <div style="display:flex; gap:20px; flex-wrap:wrap; font-size:12px;">
                <span>Races: <b>${ss.totalRaces || 0}</b></span>
                <span style="color:var(--good);">Wins: <b>${ss.wins || 0}</b></span>
                <span style="color:var(--accent);">Podiums: <b>${ss.podiums || 0}</b></span>
                <span>Finishes: <b>${ss.finishes || 0}</b></span>
                <span>Points finishes: <b>${ss.pointsFinishes || 0}</b></span>
                <span>Top 5 qualifying: <b>${ss.qualTop5 || 0}</b></span>
            </div>
            <div style="margin-top:10px; font-size:13px; color:var(--accent);">
                💰 Projected sponsor income next race: <b>${budgetM(projectedPerRace)}</b>
            </div>
        </div>`;

        $("#sponsorsContent").innerHTML = `
            ${statsBar}
            <h3 style="margin:6px 0 10px;">Signed Sponsors (${signed.length})</h3>
            <div class="grid-cards">${signedCards}</div>
            <h3 style="margin:20px 0 10px;">Available Sponsors</h3>
            <div class="grid-cards">${availCards}</div>`;

        $$("#sponsorsContent .sponsor-sign").forEach(b => b.onclick = () => _signSponsor(b.dataset.id));
        $$("#sponsorsContent .sponsor-remove").forEach(b => b.onclick = () => _removeSponsor(b.dataset.id));
    }

    /* Calculates the objective progress text for a sponsor. */
    function _sponsorObjectiveProgress(sponsor, ss, state) {
        const obj = sponsor.objective;
        if (!obj) return "";
        let current = 0, target = obj.threshold || 0;
        switch (obj.type) {
            case "wins": current = ss.wins || 0; break;
            case "podiums": current = ss.podiums || 0; break;
            case "pointsFinish": current = ss.pointsFinishes || 0; break;
            case "finishRate":
                const rate = (ss.totalRaces||0) > 0 ? (ss.finishes||0) / ss.totalRaces : 0;
                return `Progress: ${Math.round(rate*100)}% / ${Math.round(obj.threshold*100)}%`;
            case "qualifyingPosition": current = ss.qualTop5 || 0; break;
            case "championshipPosition":
                const pos = state.standings.teams.findIndex(t => t.id === state.playerTeamId);
                return pos >= 0 ? `Current position: ${pos+1} / target top ${obj.threshold}` : "—";
        }
        return `Progress: ${current} / ${target}`;
    }

    function _signSponsor(sponsorId) {
        const res = CareerManager.signSponsor(sponsorId);
        $("#statusMsg").textContent = res.msg;
        renderSponsorsView();
        renderFinanceView();
        renderGlobalStats();
    }

    function _removeSponsor(sponsorId) {
        const res = CareerManager.removeSponsor(sponsorId);
        $("#statusMsg").textContent = res.msg;
        renderSponsorsView();
        renderFinanceView();
        renderGlobalStats();
    }

    /* Shows an end-of-season summary as a modal/overlay. */
    function _showSeasonSummary() {
        // Evaluate sponsor objectives before showing the summary
        // (the internal flag avoids double payments when startNextSeason calls the same function)
        CareerManager._evaluateSponsorObjectives();
        const summary = CareerManager.getSeasonSummary();
        if (!summary) return;

        const medal = ["🥇","🥈","🥉"];
        const teamPosText = summary.teamPosition <= 3 ? medal[summary.teamPosition-1] : `${summary.teamPosition}°`;

        const sponsorRows = summary.sponsorResults.length ? summary.sponsorResults.map(s => `
            <tr>
                <td>${s.name}</td>
                <td>${s.objective || "—"}</td>
                <td style="color:${s.achieved?'var(--good)':'var(--bad)'};">${s.achieved?'✔ Achieved':'✘ Not achieved'}</td>
                <td class="pts">${s.achieved ? `+€${(s.reward/1000).toFixed(1)}M` : '—'}</td>
            </tr>`).join("") : `<tr><td colspan="4" class="hint">No sponsors signed this season.</td></tr>`;

        const driverRows = summary.drivers.length ? summary.drivers.map(d => `
            <tr><td>${d.name}</td><td class="pts">${d.points} pt</td></tr>`).join("") : "";

        const overlay = document.createElement("div");
        overlay.id = "seasonOverlay";
        overlay.style.cssText = "position:fixed;inset:0;background:rgba(0,0,0,0.85);z-index:9999;display:flex;align-items:center;justify-content:center;padding:20px;";
        overlay.innerHTML = `
            <div class="card" style="max-width:600px;width:100%;max-height:85vh;overflow-y:auto;">
                <h2 style="margin-top:0;">🏁 Season Complete</h2>
                <div style="display:flex;gap:20px;flex-wrap:wrap;margin-bottom:16px;">
                    <div class="stat-pill"><span class="k">Team Position</span><span class="v">${teamPosText} / ${summary.totalTeams}</span></div>
                    <div class="stat-pill"><span class="k">Team Points</span><span class="v">${summary.teamPoints}</span></div>
                </div>
                ${driverRows ? `
                <h3>📋 Driver Results</h3>
                <div class="table-wrap"><table class="data-table">
                    <thead><tr><th>Driver</th><th>Points</th></tr></thead>
                    <tbody>${driverRows}</tbody>
                </table></div>` : ""}
                <h3 style="margin-top:16px;">💰 Sponsor Objectives</h3>
                <div class="table-wrap"><table class="data-table">
                    <thead><tr><th>Sponsor</th><th>Objective</th><th>Outcome</th><th>Reward</th></tr></thead>
                    <tbody>${sponsorRows}</tbody>
                </table></div>
                <button class="primary" id="btnNextSeason" style="margin-top:20px;width:100%;">START NEW SEASON →</button>
            </div>`;

        document.body.appendChild(overlay);
        $("#btnNextSeason").onclick = () => {
            _startNextSeason();
            overlay.remove();
        };
    }

    /* Starts the transition to the next season. */
    function _startNextSeason() {
        const res = CareerManager.startNextSeason();
        if (!res) return;

        const btn = $("#simBtn");
        btn.textContent = "SIMULATE NEXT SESSION";
        btn.onclick = runWeekend;

        $("#statusMsg").textContent = `Season ${res.season} started! Budget bonus: €${(res.seasonBonus/1000).toFixed(1)}M`;
        refreshFromCareer();
    }

    function renderRaceMeta() {
        const state = CareerManager.getState();
        if (!state) return;
        const round = state.calendar?.[state.currentRound] || {};
        const sessions = ["Practice","Qualifying","Race"];
        const sess = sessions[state.currentSession] || "—";
        $("#raceMeta").innerHTML = `
            <span><b>Round ${state.currentRound + 1}/${state.totalRounds}</b></span>
            <span>📍 ${round.name || "—"}</span>
            <span>🏁 ${sess}</span>`;
    }

    return { init, refreshFromCareer };
})();
if (typeof window !== "undefined") window.MasterUI = MasterUI;