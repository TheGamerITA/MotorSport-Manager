const CreateTeamScreen = (() => {
    // Avevo dimenticato di definire queste due funzioni utility qui!
    const $ = (sel, root = document) => root.querySelector(sel);
    const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

    const PRESETS = {
        underdog: { name: "Underdog", desc: "Budget magro, personale scarso. La sfida estrema.", budget: 45000, staff: { aero:55, engine:55, mechanics:60 }, prestige:35, starterPace: 0.45 },
        ribelle: { name: "Ribelle indipendente", desc: "Budget medio, personale modesto. Più giocabile.", budget: 80000, staff: { aero:65, engine:62, mechanics:68 }, prestige:50, starterPace: 0.55 },
        equilibrato: { name: "Operazione salvataggio", desc: "Budget buono, personale discreto. Per competere subito.", budget: 120000, staff: { aero:72, engine:70, mechanics:75 }, prestige:62, starterPace: 0.62 }
    };

    const LOGO_PRESETS = ["◆","★","▲","●","✦","⬢","♛","⚔","♦","⚡"];
    const NATIONS = ["ITA","GBR","DEU","FRA","ESP","USA","JPN","BRA","AUS","NED","FIN","SWE","ARG","MEX"];

    let form = { name: "", nation: "ITA", color1: "#00ff9d", color2: "#0f1117", logoIdx: 0, preset: "underdog" };

    function mount(champId, container, onDone) {
        form = { name:"", nation:"ITA", color1:"#00ff9d", color2:"#0f1117", logoIdx:0, preset:"underdog" };
        container.innerHTML = _template();
        _bind(container, champId, onDone);
        _renderPreview(container);
    }

    function _template() {
        return `
            <div class="create-team-form">
                <div class="ctf-left">
                    <div class="ctf-field">
                        <label>Nome scuderia</label>
                        <input type="text" id="ctName" maxlength="30" placeholder="es. Scuderia Alpha" />
                    </div>
                    <div class="ctf-field">
                        <label>Nazione</label>
                        <select id="ctNation">${NATIONS.map(n=>`<option value="${n}">${n}</option>`).join("")}</select>
                    </div>
                    <div class="ctf-colors">
                        <div class="ctf-field" style="flex-grow: 1;">
                            <label>Colore principale</label>
                            <input type="color" id="ctColor1" value="${form.color1}" />
                        </div>
                        <div class="ctf-field" style="flex-grow: 1;">
                            <label>Colore secondario</label>
                            <input type="color" id="ctColor2" value="${form.color2}" />
                        </div>
                    </div>
                    <div class="ctf-field">
                        <label>Logo</label>
                        <div class="logo-picker" id="logoPicker">
                            ${LOGO_PRESETS.map((g,i)=>`<button type="button" class="logo-opt ${i===0?"sel":""}" data-i="${i}" style="--c1:${form.color1};--c2:${form.color2}">${g}</button>`).join("")}
                        </div>
                    </div>
                    <div id="teamPreviewContainer"></div>
                </div>

                <div class="ctf-right">
                    <div class="ctf-field">
                        <label>Pacchetto di partenza</label>
                        <div class="preset-list">
                            ${Object.entries(PRESETS).map(([k,p])=>`
                                <button type="button" class="preset-card ${k==="underdog"?"sel":""}" data-preset="${k}">
                                    <div class="preset-name">${p.name}</div>
                                    <div class="preset-desc">${p.desc}</div>
                                    <div class="preset-stats">
                                        <span>Budget €${(p.budget/1000).toFixed(0)}M</span>
                                        <span>Aero ${p.staff.aero}</span>
                                        <span>Mot ${p.staff.engine}</span>
                                    </div>
                                </button>`).join("")}
                        </div>
                    </div>
                </div>
            </div>
            <div class="ctf-actions" style="margin-top: 20px; text-align: right;">
                <button class="btn-primary" id="ctConfirm" style="width: auto; padding: 12px 30px;">Crea e Procedi</button>
            </div>
        `;
    }

    function _bind(container, champId, onDone) {
        const update = () => {
            form.name = $("#ctName", container).value;
            form.nation = $("#ctNation", container).value;
            form.color1 = $("#ctColor1", container).value;
            form.color2 = $("#ctColor2", container).value;
            _renderPreview(container);
        };

        ["#ctName","#ctNation","#ctColor1","#ctColor2"].forEach(sel => {
            const el = $(sel, container); if (el) el.addEventListener("input", update);
        });

        $$("#logoPicker .logo-opt", container).forEach(b => {
            b.addEventListener("click", () => {
                $$("#logoPicker .logo-opt", container).forEach(x=>x.classList.remove("sel"));
                b.classList.add("sel");
                form.logoIdx = +b.dataset.i;
                _renderPreview(container);
            });
        });

        $$(".preset-card", container).forEach(b => {
            b.addEventListener("click", () => {
                $$(".preset-card", container).forEach(x=>x.classList.remove("sel"));
                b.classList.add("sel");
                form.preset = b.dataset.preset;
                _renderPreview(container);
            });
        });

        $("#ctConfirm", container).addEventListener("click", () => {
            if (!form.name.trim()) {
                alert("Inserisci un nome per la scuderia.");
                return;
            }
            const team = _buildTeam(champId);
            onDone(team);
        });
    }

    function _renderPreview(container) {
        const preview = $("#teamPreviewContainer", container);
        if (!preview) return;

        const name = form.name.trim() || "NOME SQUADRA";
        const c1 = form.color1;
        const c2 = form.color2;
        const glyph = LOGO_PRESETS[form.logoIdx];

        preview.innerHTML = `
            <div class="ctf-field" style="margin-top: 20px;">
                <label>Anteprima Identità</label>
                <div class="team-preview-card" style="
                    background: ${c1};
                    border: 3px solid ${c2};
                    border-radius: 8px;
                    padding: 15px;
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    margin-top: 5px;
                ">
                    <div class="team-preview-logo" style="
                        background: ${c2};
                        color: ${c1};
                        width: 40px;
                        height: 40px;
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 22px;
                        flex-shrink: 0;
                    ">
                        ${glyph}
                    </div>
                    <div class="team-preview-name" style="
                        color: #fff;
                        font-weight: bold;
                        font-size: 1.1rem;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                    ">
                        ${name}
                    </div>
                </div>
            </div>
        `;
    }

    function _buildTeam(champId) {
        const preset = PRESETS[form.preset];
        const teamId = `player_${champId}`;
        const team = (typeof Team !== "undefined" ? Team : (t)=>t)({
            id: teamId,
            name: form.name.trim(),
            nationality: form.nation,
            color: form.color1,
            secondaryColor: form.color2,
            logoGlyph: LOGO_PRESETS[form.logoIdx],
            budget: preset.budget,
            prestige: preset.prestige,
            staff: { ...preset.staff },
            drivers: [_makeStarter(champId, preset.starterPace, 1), _makeStarter(champId, preset.starterPace-0.03, 2)],
            _custom: true,
        });
        if (typeof ALL_TEAMS !== "undefined") {
            ALL_TEAMS[champId] = (ALL_TEAMS[champId]||[]).filter(t => t.id !== teamId);
            ALL_TEAMS[champId].push(team);
        }
        return team;
    }

    function _makeStarter(champId, paceBase, slot) {
        const first = ["Alex","Robin","Sam","Dev","Mika","Luca","Noa","Kai","Iris","Leo"];
        const last  = ["Stone","Vega","Cross","Reed","Bauer","Russo","Lin","Falk","Hart","Neri"];
        const name = first[Math.floor(Math.random()*first.length)] + " " + last[Math.floor(Math.random()*last.length)];
        const nations = ["ITA","GBR","USA","DEU","FRA","ESP","BRA","JPN"];

        const d = {
            id: `starter_${champId}_${slot}_${Date.now()}`,
            name,
            nationality: nations[Math.floor(Math.random()*nations.length)],
            number: 20 + Math.floor(Math.random()*70),
            age: 21 + Math.floor(Math.random()*5),
            pace: paceBase,
            consistency: paceBase - 0.05,
            racecraft: paceBase - 0.07,
            wetPerformance: paceBase - 0.03,
            fuelTyreMgmt: paceBase - 0.02,
            qualifying: paceBase - 0.02,
            hiddenPotential: Math.min(0.95, paceBase + 0.25),
            morale: 75,
            salary: 1500,
            contractYears: 2,
        };
        d.rating = +(d.pace*0.45+d.consistency*0.2+d.racecraft*0.15+d.qualifying*0.1+d.wetPerformance*0.1).toFixed(3);
        return (typeof Driver !== "undefined") ? Driver(d) : d;
    }

    return { mount };
})();
if (typeof window !== "undefined") window.CreateTeamScreen = CreateTeamScreen;