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
            
            if (result) renderRaceResult(result);
            
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
                    <img src="img/${team.id}.png" class="team-logo" onerror="this.outerHTML='<div class=&quot;team-logo fallback&quot; style=&quot;background:${team.color}&quot;>${team.name.substring(0,2).toUpperCase()}</div>'" />
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

    function renderScoutingView() {
        $("#scoutContent").innerHTML = `<p class="hint">Sistema di scouting in aggiornamento. Usa il pulsante per trovare talenti.</p>`;
    }

    // --- Configurazione R&D (dichiarativa, facile da bilanciare) ------------
    const RND_DEPARTMENTS = [
        { key: "aero",      label: "Aerodinamica", desc: "Carico e efficienza aero." },
        { key: "engine",    label: "Motore",       desc: "Potenza e affidabilità." },
        { key: "mechanics", label: "Meccanica",    desc: "Sospensioni e pit-stop." },
    ];
    const RND_MAX_LEVEL = 99;
    const RND_STEP = 2;                       // incremento livello per upgrade
    // costo upgrade crescente col livello (unità = migliaia di €, /1000 = milioni)
    function rndUpgradeCost(level) { return Math.round(400 + level * 40); }

    // Progetti speciali: sbloccabili una volta, danno un bonus permanente a un reparto.
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

        // stato progetti sbloccati (persistito in careerState, ri-applicato al team)
        if (!t.rnd) t.rnd = { unlocked: {} };
        if (!t.staff) t.staff = { aero: 50, engine: 50, mechanics: 50 };

        const budget = CareerManager.getBudget();
        const budgetM = (v) => `€${((v || 0) / 1000).toFixed(1)}M`;

        // --- Card reparti con barra livello + bottone potenzia ---
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

        // --- Card progetti speciali (albero) ---
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

        // --- Bind (elementi ricreati a ogni render: nessun accumulo di listener) ---
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

    function scoutNewTalent() { alert("Hai cercato un talento! Nessun talento trovato in questa versione."); }

    return { init, refreshFromCareer };
})();
if (typeof window !== "undefined") window.MasterUI = MasterUI;