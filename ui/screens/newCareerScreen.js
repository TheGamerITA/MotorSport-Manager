const NewCareerScreen = (() => {
    const $ = (s) => document.querySelector(s);
    const $$ = (s) => Array.from(document.querySelectorAll(s));
    let selectedChamp = null, selectedTeam = null, isCustom = false;

    function init() { 
        build(); 
        // RESET COMPLETO OGNI VOLTA CHE SI MOSTRA LA SCHERMATA
        if (typeof ScreenManager !== 'undefined') {
            ScreenManager.register("newcareer", { onShow: resetWizard });
        }
    }

    function resetWizard() {
        selectedChamp = null;
        selectedTeam = null;
        isCustom = false;
        currentFilter = "all";
        const firstStep = $("#step-category");
        if (firstStep) {
            $$(".wiz-step").forEach(s => s.classList.remove("active"));
            firstStep.classList.add("active");
        }
        // Reset visivo del filtro attivo
        const filterBtns = $$("#champFilter .champ-filter-btn");
        filterBtns.forEach(b => b.classList.toggle("active", b.dataset.filter === "all"));
        if (filterBtns.length) _renderChampGrid();
    }

    function build() {
        $("#screen-newcareer").innerHTML = `
            <div class="wizard">
                <div class="wizard-head">
                    <button class="btn-ghost" id="btnBack">← Torna al Menu</button>
                    <h1>Nuova Carriera</h1>
                </div>
                
                <section class="wiz-step active" id="step-category">
                    <h2 class="wiz-title">1 · Scegli Campionato</h2>
                    <div class="champ-filter" id="champFilter"></div>
                    <div class="champ-grid" id="champGrid"></div>
                </section>
                
                <section class="wiz-step" id="step-mode">
                    <h2 class="wiz-title">2 · Modalità</h2>
                    <div class="champ-grid" style="grid-template-columns: 1fr 1fr;">
                        <button class="champ-card" data-mode="custom">
                            <h3>Crea la tua Scuderia</h3>
                            <p class="champ-desc">Nome, colori e livrea personalizzati. Parti dal fondo.</p>
                        </button>
                        <button class="champ-card" data-mode="existing">
                            <h3>Usa Team Esistente</h3>
                            <p class="champ-desc">Prendi il controllo di un team reale del 2026.</p>
                        </button>
                    </div>
                </section>
                
                <section class="wiz-step" id="step-create">
                    <h2 class="wiz-title">3 · Crea Scuderia</h2>
                    <div id="createTeamContainer"></div>
                </section>
                
                <section class="wiz-step" id="step-pick">
                    <h2 class="wiz-title">3 · Scegli Team</h2>
                    <div class="team-pick-grid" id="teamPickGrid"></div>
                </section>
                
                <section class="wiz-step" id="step-confirm">
                    <h2 class="wiz-title">4 · Conferma</h2>
                    <div class="card" style="max-width: 600px; margin: 0 auto;">
                        <div id="confirmCard"></div>
                        <div class="ctf-field" style="margin-top: 20px;">
                            <label>Nome Carriera</label>
                            <input type="text" id="careerName" placeholder="Es. La mia scalata alla F1" />
                        </div>
                        <div class="ctf-actions" style="margin-top: 20px;">
                            <button class="btn-primary" id="btnStart" style="width: auto; padding: 12px 30px;">Inizia</button>
                        </div>
                    </div>
                </section>
            </div>`;
        _bind();
    }

    let currentFilter = "all";

    function _bind() {
        $("#btnBack").onclick = () => ScreenManager.show("start");

        _buildFilter();
        _renderChampGrid();

        // Binding statici (costruiti una sola volta in build())
        $$("[data-mode]").forEach(b => b.onclick = () => {
            isCustom = b.dataset.mode === "custom";
            if (isCustom) {
                if (typeof CreateTeamScreen !== 'undefined') {
                    CreateTeamScreen.mount(selectedChamp, $("#createTeamContainer"), team => {
                        selectedTeam = team;
                        _renderConfirm();
                        _goTo("step-confirm");
                    });
                }
                _goTo("step-create");
            } else {
                _renderTeamPick();
                _goTo("step-pick");
            }
        });

        $("#btnStart").onclick = _start;
    }

    /* Costruisce i pulsanti di filtro per "family" (macro-categoria). */
    function _buildFilter() {
        const families = Array.from(new Set(Object.values(CHAMPIONSHIPS).map(c => c.family))).sort();
        const allBtn = `<button class="champ-filter-btn active" data-filter="all">Tutti</button>`;
        const familyBtns = families.map(f => `<button class="champ-filter-btn" data-filter="${f}">${f}</button>`).join("");
        $("#champFilter").innerHTML = allBtn + familyBtns;

        $$("#champFilter .champ-filter-btn").forEach(b => b.onclick = () => {
            $$("#champFilter .champ-filter-btn").forEach(x => x.classList.remove("active"));
            b.classList.add("active");
            currentFilter = b.dataset.filter;
            _renderChampGrid();
        });
    }

    /* Renderizza la griglia campionati applicando il filtro family attivo. */
    function _renderChampGrid() {
        const all = Object.values(CHAMPIONSHIPS);
        const filtered = currentFilter === "all" ? all : all.filter(c => c.family === currentFilter);
        $("#champGrid").innerHTML = filtered.map(c => `
            <button class="champ-card" data-champ="${c.id}">
                <h3>${c.name}</h3>
                <p class="champ-desc">${c.family} - ${c.raceType}</p>
            </button>`).join("");

        $$("#champGrid .champ-card").forEach(c => c.onclick = () => {
            selectedChamp = c.dataset.champ;
            _goTo("step-mode");
        });
    }

    function _renderTeamPick() {
        $("#teamPickGrid").innerHTML = ALL_TEAMS[selectedChamp].map(t => `
            <button class="team-pick-card" data-team="${t.id}" style="--t-color:${t.color}; border-left: 4px solid ${t.color};">
                <img src="img/${t.id}.png" class="tpc-logo" onerror="this.outerHTML='<div class=&quot;tpc-logo fallback&quot; style=&quot;background:${t.color}&quot;>${t.name.substring(0,2).toUpperCase()}</div>'" />
                <div>
                    <div class="tpc-name">${t.name}</div>
                    <div class="tpc-stats">Budget €${(t.budget/1000).toFixed(1)}M · Prestigio ${t.prestige}</div>
                </div>
            </button>`).join("");
            
        $$("#teamPickGrid .team-pick-card").forEach(c => c.onclick = () => {
            selectedTeam = ALL_TEAMS[selectedChamp].find(t => t.id === c.dataset.team);
            _renderConfirm();
            _goTo("step-confirm");
        });
    }

    function _renderConfirm() {
        $("#confirmCard").innerHTML = `
            <div class="fin-row"><span>Categoria</span><b style="color: var(--accent);">${CHAMPIONSHIPS[selectedChamp].name}</b></div>
            <div class="fin-row"><span>Team</span><b style="color: var(--txt-0);">${selectedTeam.name}</b></div>
            <div class="fin-row" style="border-bottom: none;"><span>Budget Iniziale</span><b style="color: var(--good);">€${(selectedTeam.budget/1000).toFixed(1)}M</b></div>`;
        $("#careerName").value = `${selectedTeam.name} - 2026`;
    }

    function _goTo(id) {
        $$(".wiz-step").forEach(s => s.classList.remove("active"));
        $("#"+id).classList.add("active");
    }

    function _start() {
        CareerManager.startNewCareer({ champId: selectedChamp, team: selectedTeam, isCustom, name: $("#careerName").value });
        ScreenManager.show("app");
        MasterUI.refreshFromCareer();
    }
    
    return { init };
})();
if (typeof window !== "undefined") window.NewCareerScreen = NewCareerScreen;