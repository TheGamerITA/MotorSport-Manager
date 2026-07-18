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
        $(".brand-sub").textContent = `Stagione ${state.season} · ${state.playerTeamName}`;
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
        const sessions = ["Prova Libera", "Qualifica", "Gara"];

        btn.disabled = true;
        btn.textContent = "SIMULAZIONE...";

        setTimeout(() => {
            const result = CareerManager.simulateCurrentSession();
            const completedSession = state.currentSession;
            const advance = CareerManager.advanceSession();

            if (result) {
                renderSessionResult(result, completedSession);
                if (typeof RenderView !== "undefined") {
                    if (completedSession === 2) {
                        // Gara: animazione completa con piloti
                        RenderView.loadAndPlay(result);
                    } else {
                        // Prove libere / Qualifiche: mostra anteprima statica
                        // del tracciato (evita il "canvas verde" senza animazione)
                        const round = state.calendar[state.currentRound];
                        const label = completedSession === 0 ? "📊 PROVE LIBERE" : "🏁 QUALIFICHE";
                        if (round && round.trackId) {
                            RenderView.showTrackPreview(round.trackId, label);
                        }
                    }
                }
            }

            if (advance.seasonComplete) {
                $("#statusMsg").textContent = "Stagione conclusa!";
                btn.textContent = "NUOVA STAGIONE";
                btn.onclick = _startNextSeason;
                _showSeasonSummary();
            } else {
                const nextSess = sessions[CareerManager.getState().currentSession];
                $("#statusMsg").textContent = `Round ${state.currentRound + 1}: ${sessions[completedSession]} completata. Prossima: ${nextSess}`;
                btn.textContent = `SIMULA ${nextSess.toUpperCase()}`;
            }
            btn.disabled = false;
            refreshAllViews();
        }, 500);
    }

    /* Renderizza i risultati in base al tipo di sessione (0=practice, 1=qualifying, 2=race) */
    function renderSessionResult(result, sessionType) {
        if (sessionType === 0) renderPracticeResult(result);
        else if (sessionType === 1) renderQualifyingResult(result);
        else renderRaceResult(result);
    }

    function renderPracticeResult(result) {
        $("#resultsTable thead").innerHTML = `<tr><th>#</th><th>Pilota</th><th>Team</th><th>Miglior Giro</th><th>Consistenza</th><th>Setup</th></tr>`;
        $("#resultsTable tbody").innerHTML = result.results.map((r, i) => `
            <tr>
                <td class="pos">${i + 1}</td>
                <td>${r.driver}</td>
                <td>${r.team}</td>
                <td class="time">${r.bestLapStr}</td>
                <td>${Math.round(r.consistency * 100)}%</td>
                <td>${Math.round(r.setupConfidence * 100)}%</td>
            </tr>`).join("");
        $("#raceLog").innerHTML = `<div class="log-line">📊 Prove Libere completate. Il team ha raccolto dati sul setup e sull'affidabilità.</div>`;
    }

    function renderQualifyingResult(result) {
        $("#resultsTable thead").innerHTML = `<tr><th>Grid</th><th>Pilota</th><th>Team</th><th>Tempo Giro</th><th>Gap Pole</th><th>Gap Prec.</th></tr>`;
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
        $("#raceLog").innerHTML = `<div class="log-line">🏁 Qualifica completata. La griglia di partenza è stata definita.</div>`;
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
            const statLabel = { pace:"Pace", consistency:"Costanza", racecraft:"Racecraft", wetPerformance:"Bagnato", fuelTyreMgmt:"Mgmt", qualifying:"Qualifica" };
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
                        <div class="dc-meta">Rating: ${Math.round((d.rating||0)*100)} · Età: ${d.age} · ${d.nationality}</div>
                    </div>
                </div>
                <div class="dc-stats">${rows}</div>
                <div style="margin-top:10px; font-size:11px; color:var(--txt-2); display:flex; justify-content:space-between;">
                    <span>Morale: <b style="color:var(--accent);">${d.morale}</b></span>
                    <span>Stipendio: <b style="color:var(--accent-2);">€${(d.salary/1000).toFixed(1)}M</b></span>
                    <span>Contratto: ${d.contractYears}a</span>
                </div>
                <button class="btn-secondary driver-release" data-id="${d.id}" style="margin-top:10px; width:100%; color:var(--bad);">
                    Rilascia Pilota
                </button>
            </div>`;
        }).join("");
        $$("#teamContent .driver-release").forEach(b => b.onclick = () => _releaseDriver(b.dataset.id));
    }

    /* Rilascia un pilota dal team del giocatore (con penale stipendio residuo). */
    function _releaseDriver(driverId) {
        const team = CareerManager.getPlayerTeam();
        if (!team) return;
        const driver = team.drivers.find(d => d.id === driverId);
        if (!driver) return;
        // Penale: 50% dello stipendio residuo per la stagione
        const penalty = Math.round((driver.salary || 0) * 0.5);
        if (!CareerManager.trySpend(penalty)) {
            $("#statusMsg").textContent = "Fondi insufficienti per pagare la penale di rilascio.";
            return;
        }
        team.drivers = team.drivers.filter(d => d.id !== driverId);
        $("#statusMsg").textContent = `${driver.name} rilasciato. Penale pagata: €${(penalty/1000).toFixed(1)}M.`;
        renderTeamView();
        renderFinanceView();
        renderGlobalStats();
    }

    function renderRaceResult(result) {
        $("#resultsTable thead").innerHTML = `<tr><th>Pos</th><th>Pilota</th><th>Team</th><th>Tempo</th><th>Punti</th></tr>`;
        $("#resultsTable tbody").innerHTML = result.results.map(r => `
            <tr>
                <td class="pos">${r.position}</td>
                <td>${r.driver}</td>
                <td>${r.team}</td>
                <td class="time">${r.timeStr}</td>
                <td class="pts">${r.points}</td>
            </tr>`).join("");

        $("#raceLog").innerHTML = result.logs.length ? result.logs.map(l => `<div class="log-line"><span class="drv">${l.driver}</span> ${l.msg}</div>`).join("") : `<div class="log-line">Gara pulita.</div>`;
    }

    function renderFinanceView() {
        const t = CareerManager.getPlayerTeam();
        const budget = CareerManager.getBudget();
        const payroll = (t?.drivers||[]).reduce((s,d)=>s+(d.salary||0),0);
        const projected = (budget - payroll) / 1000;

        $("#financeContent").innerHTML = `
            <div class="card">
                <h3>Bilancio Annuale</h3>
                <div class="fin-row"><span>Budget disponibile</span><span class="v pos">€${(budget/1000).toFixed(2)}M</span></div>
                <div class="fin-row"><span>Stipendi piloti</span><span class="v neg">−€${(payroll/1000).toFixed(2)}M</span></div>
                <div class="fin-row" style="border-bottom:none;"><b>Saldo proiettato</b><b class="v" style="color:var(--accent);">€${projected.toFixed(2)}M</b></div>
            </div>`;
    }

    let scoutResults = [];

    function renderScoutingView() {
        if (scoutResults.length === 0) {
            $("#scoutContent").innerHTML = `<p class="hint">Nessun talento scovato. Usa il pulsante "Avvia Scouting" per cercare giovani promesse.</p>`;
            return;
        }
        $("#scoutContent").innerHTML = scoutResults.map(d => {
            const baseStats = ["pace","consistency","racecraft","wetPerformance","fuelTyreMgmt","qualifying"];
            const statLabel = { pace:"Pace", consistency:"Costanza", racecraft:"Racecraft", wetPerformance:"Bagnato", fuelTyreMgmt:"Mgmt", qualifying:"Qualifica" };
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
                        <div class="dc-meta">Rating: ${Math.round((d.rating||0)*100)} · Età: ${d.age} · ${d.nationality}</div>
                    </div>
                </div>
                <div class="dc-stats">${rows}</div>
                <div style="margin-top:10px; font-size:11px; color:var(--txt-2); display:flex; justify-content:space-between; align-items:center;">
                    <span>Stipendio richiesto: <b style="color:var(--accent-2);">€${(d.salary/1000).toFixed(1)}M</b></span>
                    <button class="btn-primary scout-sign" data-id="${d.id}">Firma</button>
                </div>
            </div>`;
        }).join("");
        $$("#scoutContent .scout-sign").forEach(b => b.onclick = () => _signTalent(b.dataset.id));
    }

    const RND_DEPARTMENTS = [
        { key: "aero",      label: "Aerodinamica", desc: "Carico e efficienza aero." },
        { key: "engine",    label: "Motore",       desc: "Potenza e affidabilità." },
        { key: "mechanics", label: "Meccanica",    desc: "Sospensioni e pit-stop." },
    ];
    const RND_MAX_LEVEL = 99;
    const RND_STEP = 2;
    function rndUpgradeCost(level) { return Math.round(400 + level * 40); }

    const RND_PROJECTS = [
        { id: "drs_evo",       name: "DRS Evoluto",       desc: "Ala posteriore più efficiente.", dept: "aero",      reqLevel: 70, cost: 6000, bonus: 4 },
        { id: "ground_effect", name: "Effetto Suolo Spinto", desc: "Più carico in curva veloce.", dept: "aero",      reqLevel: 85, cost: 12000, bonus: 5 },
        { id: "hybrid_evo",    name: "Powertrain Ibrido", desc: "Migliore efficienza termica.",   dept: "engine",    reqLevel: 70, cost: 7000, bonus: 4 },
        { id: "energy_recovery", name: "Recupero Energia", desc: "ERS potenziato in staccata.",   dept: "engine",    reqLevel: 85, cost: 12000, bonus: 5 },
        { id: "fast_pit",      name: "Pit-Crew Élite",    desc: "Pit-stop più rapidi e sicuri.",  dept: "mechanics", reqLevel: 70, cost: 6000, bonus: 4 },
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
            const btnLabel = maxed ? "MAX" : `Potenzia +${RND_STEP} · ${budgetM(cost)}`;
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
                status = `<span style="color:var(--good);">✔ Sbloccato (+${p.bonus} ${depLabel})</span>`;
                btn = "";
            } else if (!meetsReq) {
                status = `<span style="color:var(--txt-2);">🔒 Richiede ${depLabel} Lv ${p.reqLevel}</span>`;
                btn = `<button class="btn-secondary" disabled style="opacity:.5; cursor:not-allowed;">Bloccato</button>`;
            } else {
                status = `<span style="color:${affordable ? "var(--accent)" : "var(--bad)"};">${budgetM(p.cost)}${affordable ? "" : " (fondi insuff.)"}</span>`;
                btn = `<button class="btn-primary rnd-unlock" data-proj="${p.id}" ${canUnlock ? "" : "disabled style='opacity:.5; cursor:not-allowed;'"}>Sblocca</button>`;
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
                <span>Budget disponibile per lo sviluppo</span>
                <b style="color:var(--accent);">${budgetM(budget)}</b>
            </div>
            <h3 style="margin:6px 0 10px;">Reparti Tecnici</h3>
            <div class="grid-cards">${deptCards}</div>
            <h3 style="margin:20px 0 10px;">Progetti Speciali</h3>
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
        if (!CareerManager.trySpend(cost)) { $("#statusMsg").textContent = "Fondi insufficienti per il potenziamento."; return; }
        CareerManager.setStaffLevel(deptKey, Math.min(RND_MAX_LEVEL, level + RND_STEP));
        $("#statusMsg").textContent = `Reparto potenziato: ${deptKey} → Lv ${t.staff[deptKey]}.`;
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
        if (!CareerManager.trySpend(p.cost)) { $("#statusMsg").textContent = "Fondi insufficienti per il progetto."; return; }
        CareerManager.markProjectUnlocked(p.id);
        CareerManager.setStaffLevel(p.dept, Math.min(RND_MAX_LEVEL, (t.staff[p.dept] ?? 50) + p.bonus));
        $("#statusMsg").textContent = `Progetto sbloccato: ${p.name} (+${p.bonus} ${p.dept}).`;
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
        if (!CareerManager.trySpend(cost)) { $("#statusMsg").textContent = "Fondi insufficienti per lo scouting."; return; }
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
        $("#statusMsg").textContent = `Scouting completato: ${count} talenti trovati.`;
        renderScoutingView();
        renderGlobalStats();
        renderFinanceView();
    }

    function _signTalent(driverId) {
        const driver = scoutResults.find(d => d.id === driverId);
        if (!driver) return;
        const team = CareerManager.getPlayerTeam();
        if (!team) return;
        if (team.drivers.length >= 2) { $("#statusMsg").textContent = "Hai già 2 piloti in squadra."; return; }
        const signCost = 100;
        if (!CareerManager.trySpend(signCost)) { $("#statusMsg").textContent = "Fondi insufficienti per l'ingaggio."; return; }
        const newDriver = { ...driver };
        // NON cancellare newDriver.id: l'ID è fondamentale per il tracciamento
        // del pilota (DNF nell'animazione, progressione carriera, standing).
        team.drivers.push(newDriver);
        scoutResults = scoutResults.filter(d => d.id !== driverId);
        $("#statusMsg").textContent = `${newDriver.name} firmato per ${team.name}!`;
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
            $("#standingsContent").innerHTML = `<div class="card"><p class="hint">Nessun risultato ancora. Disputa una gara per popolare la classifica.</p></div>`;
            return;
        }

        const teamColor = (teamId) => (allTeams.find(tm => tm.id === teamId)?.color) || "#888";
        const teamName = (teamId) => (allTeams.find(tm => tm.id === teamId)?.name) || "—";

        $("#standingsContent").innerHTML = `
            <div class="card">
                <h3>🏆 Classifica Piloti</h3>
                <div class="table-wrap"><table class="data-table">
                    <thead><tr><th>#</th><th>Pilota</th><th>Team</th><th>Punti</th></tr></thead>
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
                <h3>🏁 Classifica Costruttori</h3>
                <div class="table-wrap"><table class="data-table">
                    <thead><tr><th>#</th><th>Team</th><th>Punti</th></tr></thead>
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
        if (!state) { $("#calendarContent").innerHTML = `<p class="hint">Nessuna carriera attiva.</p>`; return; }
        const cal = state.calendar || [];
        if (!cal.length) { $("#calendarContent").innerHTML = `<p class="hint">Calendario non disponibile.</p>`; return; }

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
                        <span style="${statusCls}font-size:12px;">${done?"Completato":isCurrent?"In corso":"Da disputare"}</span>
                    </div>
                    <p class="hint" style="margin:6px 0;">${tr.country || ""}${tr.surface?" · "+tr.surface:""}</p>
                </div>`;
            }).join("")}</div>`;
    }

    function renderSponsorsView() {
        if (!CareerManager.isActive()) { $("#sponsorsContent").innerHTML = `<p class="hint">Nessuna carriera attiva.</p>`; return; }
        const state = CareerManager.getState();
        const team = CareerManager.getPlayerTeam();
        const prestige = team?.prestige ?? 50;
        const sponsorsData = CareerManager.getSponsors();
        const signed = sponsorsData.signed || [];
        const ss = sponsorsData.seasonStats || {};
        const budgetM = (v) => `€${((v||0)/1000).toFixed(1)}M`;

        // Calcola entrate sponsor proiettate per la prossima gara
        const projectedPerRace = signed.reduce((sum, s) => {
            return sum + s.basePerRace * (s.tier === "title" ? 1.0 : s.tier === "technical" ? 0.8 : 0.6);
        }, 0);

        // Sponsor disponibili (non firmati, prestigio sufficiente)
        const available = (window.SPONSOR_POOL || []).filter(s => {
            if (signed.some(x => x.id === s.id)) return false;
            if ((s.prestigeReq || 0) > prestige) return false;
            const tierInfo = window.SPONSOR_TIERS[s.tier] || { maxSlots: 0 };
            const sameTier = signed.filter(x => x.tier === s.tier);
            return sameTier.length < (tierInfo.maxSlots || 0);
        });

        const tierLabel = { title:"Title", technical:"Technical", partner:"Partner" };
        const tierColor = { title:"#00d4ff", technical:"#f39c12", partner:"#27ae60" };

        // Card sponsor firmati
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
                    <span>Base/gara: <b style="color:var(--accent);">${budgetM(s.basePerRace)}</b></span>
                    <span>Bonus vittoria: <b>+${budgetM(s.bonusWin)}</b></span>
                    <span>Bonus podio: <b>+${budgetM(s.bonusPodium)}</b></span>
                    <span>Bonus punti: <b>+${s.bonusPoints}K/pt</b></span>
                </div>
                ${obj.label ? `
                <div style="margin-top:8px; padding:8px; background:rgba(255,255,255,0.03); border-radius:4px;">
                    <div style="font-size:11px; color:var(--txt-2);">📋 Obiettivo: ${obj.label}</div>
                    <div style="font-size:11px; margin-top:4px;">${objProgressText}</div>
                    <div style="font-size:11px; color:var(--accent); margin-top:2px;">Premio: ${budgetM(obj.reward || 0)}</div>
                </div>` : ""}
                <button class="btn-secondary sponsor-remove" data-id="${s.id}" style="margin-top:10px; color:var(--bad);">Risolvi (penale €300K)</button>
            </div>`;
        }).join("") : `<p class="hint">Nessuno sponsor firmato. Cerca sponsor disponibili qui sotto.</p>`;

        // Card sponsor disponibili
        const availCards = available.length ? available.map(s => {
            const tierInfo = window.SPONSOR_TIERS[s.tier] || { maxSlots: 0 };
            return `
            <div class="card" style="border-left:3px solid ${s.color};">
                <div style="display:flex; justify-content:space-between; align-items:baseline;">
                    <h3 style="margin:0;">${s.name}</h3>
                    <span style="font-size:11px; padding:2px 8px; border-radius:8px; background:${s.color}22; color:${s.color};">${tierLabel[s.tier]}</span>
                </div>
                <div style="display:flex; gap:16px; margin:8px 0; font-size:12px; flex-wrap:wrap;">
                    <span>Base/gara: <b style="color:var(--accent);">${budgetM(s.basePerRace)}</b></span>
                    <span>Bonus vittoria: <b>+${budgetM(s.bonusWin)}</b></span>
                    <span>Bonus podio: <b>+${budgetM(s.bonusPodium)}</b></span>
                </div>
                ${s.objective ? `
                <div style="margin-top:6px; font-size:11px; color:var(--txt-2);">📋 ${s.objective.label}</div>
                <div style="font-size:11px; color:var(--accent);">Premio stagione: ${budgetM(s.objective.reward || 0)}</div>` : ""}
                <button class="btn-primary sponsor-sign" data-id="${s.id}" style="margin-top:10px;">Firma Sponsor</button>
            </div>`;
        }).join("") : `<p class="hint">Nessuno sponsor disponibile per il tuo livello di prestigio attuale.</p>`;

        // Statistiche stagionali
        const statsBar = `
        <div class="card" style="margin-bottom:16px;">
            <h3 style="margin:0 0 10px;">📊 Statistiche Stagionali Sponsor</h3>
            <div style="display:flex; gap:20px; flex-wrap:wrap; font-size:12px;">
                <span>Gare disputate: <b>${ss.totalRaces || 0}</b></span>
                <span style="color:var(--good);">Vittorie: <b>${ss.wins || 0}</b></span>
                <span style="color:var(--accent);">Podi: <b>${ss.podiums || 0}</b></span>
                <span>Arrivi: <b>${ss.finishes || 0}</b></span>
                <span>Gare a punti: <b>${ss.pointsFinishes || 0}</b></span>
                <span>Top 5 qualifica: <b>${ss.qualTop5 || 0}</b></span>
            </div>
            <div style="margin-top:10px; font-size:13px; color:var(--accent);">
                💰 Entrate sponsor proiettate prossima gara: <b>${budgetM(projectedPerRace)}</b>
            </div>
        </div>`;

        $("#sponsorsContent").innerHTML = `
            ${statsBar}
            <h3 style="margin:6px 0 10px;">Sponsor Firmati (${signed.length})</h3>
            <div class="grid-cards">${signedCards}</div>
            <h3 style="margin:20px 0 10px;">Sponsor Disponibili</h3>
            <div class="grid-cards">${availCards}</div>`;

        $$("#sponsorsContent .sponsor-sign").forEach(b => b.onclick = () => _signSponsor(b.dataset.id));
        $$("#sponsorsContent .sponsor-remove").forEach(b => b.onclick = () => _removeSponsor(b.dataset.id));
    }

    /* Calcola il testo di progressione dell'obiettivo di uno sponsor. */
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
                return `Progresso: ${Math.round(rate*100)}% / ${Math.round(obj.threshold*100)}%`;
            case "qualifyingPosition": current = ss.qualTop5 || 0; break;
            case "championshipPosition":
                const pos = state.standings.teams.findIndex(t => t.id === state.playerTeamId);
                return pos >= 0 ? `Posizione attuale: ${pos+1} / target top ${obj.threshold}` : "—";
        }
        return `Progresso: ${current} / ${target}`;
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

    /* Mostra un riepilogo di fine stagione come modale/overlay. */
    function _showSeasonSummary() {
        // Valuta gli obiettivi sponsor prima di mostrare il riepilogo
        // (il flag interno evita doppi pagamenti quando startNextSeason richiama la stessa funzione)
        CareerManager._evaluateSponsorObjectives();
        const summary = CareerManager.getSeasonSummary();
        if (!summary) return;

        const medal = ["🥇","🥈","🥉"];
        const teamPosText = summary.teamPosition <= 3 ? medal[summary.teamPosition-1] : `${summary.teamPosition}°`;

        const sponsorRows = summary.sponsorResults.length ? summary.sponsorResults.map(s => `
            <tr>
                <td>${s.name}</td>
                <td>${s.objective || "—"}</td>
                <td style="color:${s.achieved?'var(--good)':'var(--bad)'};">${s.achieved?'✔ Completato':'✘ Non raggiunto'}</td>
                <td class="pts">${s.achieved ? `+€${(s.reward/1000).toFixed(1)}M` : '—'}</td>
            </tr>`).join("") : `<tr><td colspan="4" class="hint">Nessuno sponsor firmato questa stagione.</td></tr>`;

        const driverRows = summary.drivers.length ? summary.drivers.map(d => `
            <tr><td>${d.name}</td><td class="pts">${d.points} pt</td></tr>`).join("") : "";

        const overlay = document.createElement("div");
        overlay.id = "seasonOverlay";
        overlay.style.cssText = "position:fixed;inset:0;background:rgba(0,0,0,0.85);z-index:9999;display:flex;align-items:center;justify-content:center;padding:20px;";
        overlay.innerHTML = `
            <div class="card" style="max-width:600px;width:100%;max-height:85vh;overflow-y:auto;">
                <h2 style="margin-top:0;">🏁 Stagione Conclusa</h2>
                <div style="display:flex;gap:20px;flex-wrap:wrap;margin-bottom:16px;">
                    <div class="stat-pill"><span class="k">Posizione Team</span><span class="v">${teamPosText} / ${summary.totalTeams}</span></div>
                    <div class="stat-pill"><span class="k">Punti Team</span><span class="v">${summary.teamPoints}</span></div>
                </div>
                ${driverRows ? `
                <h3>📋 Risultati Piloti</h3>
                <div class="table-wrap"><table class="data-table">
                    <thead><tr><th>Pilota</th><th>Punti</th></tr></thead>
                    <tbody>${driverRows}</tbody>
                </table></div>` : ""}
                <h3 style="margin-top:16px;">💰 Obiettivi Sponsor</h3>
                <div class="table-wrap"><table class="data-table">
                    <thead><tr><th>Sponsor</th><th>Obiettivo</th><th>Esito</th><th>Ricompensa</th></tr></thead>
                    <tbody>${sponsorRows}</tbody>
                </table></div>
                <button class="primary" id="btnNextSeason" style="margin-top:20px;width:100%;">INIZIA NUOVA STAGIONE →</button>
            </div>`;

        document.body.appendChild(overlay);
        $("#btnNextSeason").onclick = () => {
            _startNextSeason();
            overlay.remove();
        };
    }

    /* Avvia la transizione alla stagione successiva. */
    function _startNextSeason() {
        const res = CareerManager.startNextSeason();
        if (!res) return;

        const btn = $("#simBtn");
        btn.textContent = "SIMULA PROSSIMA SESSIONE";
        btn.onclick = runWeekend;

        $("#statusMsg").textContent = `Stagione ${res.season} iniziata! Bonus budget: €${(res.seasonBonus/1000).toFixed(1)}M`;
        refreshFromCareer();
    }

    function renderRaceMeta() {
        const state = CareerManager.getState();
        if (!state) return;
        const round = state.calendar?.[state.currentRound] || {};
        const sessions = ["Prova Libera","Qualifica","Gara"];
        const sess = sessions[state.currentSession] || "—";
        $("#raceMeta").innerHTML = `
            <span><b>Round ${state.currentRound + 1}/${state.totalRounds}</b></span>
            <span>📍 ${round.name || "—"}</span>
            <span>🏁 ${sess}</span>`;
    }

    return { init, refreshFromCareer };
})();
if (typeof window !== "undefined") window.MasterUI = MasterUI;