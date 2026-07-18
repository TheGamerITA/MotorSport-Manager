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
            const advance = CareerManager.advanceSession();

            if (result) {
                renderRaceResult(result);
                if (state.currentSession === 2 && typeof RenderView !== "undefined") {
                    RenderView.loadAndPlay(result);
                }
            }

            if (advance.seasonComplete) {
                $("#statusMsg").textContent = "Stagione conclusa!";
                btn.textContent = "FINE STAGIONE";
            } else {
                const nextSess = sessions[CareerManager.getState().currentSession];
                $("#statusMsg").textContent = `Round ${state.currentRound + 1}: ${nextSess} completata. Prossima: ${sessions[CareerManager.getState().currentSession]}`;
                btn.textContent = `SIMULA ${sessions[CareerManager.getState().currentSession].toUpperCase()}`;
            }
            btn.disabled = false;
            refreshAllViews();
        }, 500);
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
            </div>`;
        }).join("");
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
        delete newDriver.id;
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