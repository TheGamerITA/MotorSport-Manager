const StartScreen = (() => {
    const $ = (s) => document.querySelector(s);
    const $$ = (s) => Array.from(document.querySelectorAll(s));

    function build() {
        $("#screen-start").innerHTML = `
            <div class="hero">
                <div class="hero-badge">2D Racing Edition</div>
                <h1 class="hero-title">Ultimate<br>Motorsport<br>Manager</h1>
                <p class="hero-sub">L'intero ecosistema del motorsport globale</p>
                <div class="hero-actions">
                    <button class="btn-primary" id="btnNewCareer">Nuova Carriera</button>
                    <button class="btn-secondary" id="btnContinue">Carica Carriera</button>
                    <button class="btn-secondary" id="btnSaves">Cartella Salvataggi</button>
                </div>
            </div>

            <div class="saves-panel" id="savesPanel">
                <div class="saves-head">
                    <h2>Carriere Salvate</h2>
                    <button class="btn-ghost" id="btnRefresh">↻ Aggiorna</button>
                </div>
                <div class="saves-list" id="savesList"></div>
            </div>
        `;
        _bind();
    }

    function _bind() {
        $("#btnNewCareer").addEventListener("click", () => ScreenManager.show("newcareer"));
        $("#btnContinue").addEventListener("click", () => {
            $("#savesPanel").scrollIntoView({ behavior: "smooth" });
        });
        $("#btnSaves").addEventListener("click", () => {
            $("#savesPanel").scrollIntoView({ behavior: "smooth" });
        });
        $("#btnRefresh").addEventListener("click", render);
    }

    function render() {
        if (typeof SaveSystem === 'undefined') return;
        const saves = SaveSystem.listSaves();
        const list = $("#savesList");
        
        if (!saves.length) {
            list.innerHTML = `<div class="saves-empty"><p>Nessuna carriera salvata.</p><p class="muted">Inizia la tua avventura con "Nuova Carriera".</p></div>`;
            return;
        }

        list.innerHTML = saves.map(s => `
            <div class="save-card" data-id="${s.id}">
                <div class="save-info">
                    <div class="save-name">${s.name}</div>
                    <div class="save-meta">
                        <span class="chip">${s.champName}</span>
                        <span>Stagione ${s.season}</span>
                        <span>Round ${s.round}/${s.totalRounds}</span>
                    </div>
                </div>
                <div class="save-actions">
                    <button class="btn-primary" style="padding: 8px 15px; font-size: 11px; width: auto;" data-act="load" data-id="${s.id}">Carica</button>
                    <button class="btn-ghost" style="color: var(--bad); border-color: var(--bad);" data-act="delete" data-id="${s.id}">✕</button>
                </div>
            </div>
        `).join("");

        $$("#savesList [data-act]").forEach(btn => {
            btn.addEventListener("click", () => {
                const act = btn.dataset.act;
                const id = btn.dataset.id;
                if (act === "load") {
                    const ok = CareerManager.loadFromSlot(id);
                    if (ok) {
                        ScreenManager.show("app");
                        MasterUI.refreshFromCareer();
                    }
                } else if (act === "delete") {
                    SaveSystem.deleteSave(id);
                    render();
                }
            });
        });
    }

    function init() {
        build();
        ScreenManager.register("start", { onShow: render });
    }

    return { init, render };
})();
if (typeof window !== "undefined") window.StartScreen = StartScreen;