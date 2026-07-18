/* =============================================================================
 * ULTIMATE MOTORSPORT MANAGER
 * File: engine/coreSimulation.js
 * -----------------------------------------------------------------------------
 * IL MOTORE DI GIOCO — classe `RaceCalculator`.
 *
 * FILOSOFIA (Regola d'Oro): il motore è GENERICO e "stupido".
 *  - NON conosce F1, MotoGP, WEC, WRC o Dakar per nome.
 *  - Legge SOLO il `ChampionshipConfig` di un campionato e decide cosa calcolare
 *    in base a: cfg.raceType, cfg.features.* e cfg.physicsModifiers.*.
 *  - Tutta la differenza tra discipline risiede nei dati, NON nel codice.
 *  - Aggiungere NASCAR/IndyCar/FE/Drift/Baja in futuro = aggiungere config,
 *    ZERO modifiche a questo file (se i flag esistono già nello schema).
 *
 * ARCHITETTURA A PIPELINE:
 *   simulateEvent(championshipId, options)
 *     -> per ogni partecipante: buildBasePace()
 *     -> applica moduli attivi (lettura features):
 *          tyreWearModule, trafficModule, stintModule, stageModule,
 *          navigationModule, dayNightModule, judgingModule
 *     -> ordina e produce risultati (Time o JudgeStyle)
 * ========================================================================== */

class RaceCalculator {
    constructor() {
        // RNG stabile (seed opzionale per riproducibilità degli eventi).
        this.seed = (Math.random() * 1e9) | 0;
        this.rngState = this.seed;
    }

    /* --- imposta seed deterministico (usato da CareerManager per replay) -- */
    setSeed(seed) {
        this.seed = (seed >>> 0) || 1;
        this.rngState = this.seed;
    }

    /* --- RNG deterministico mulberry32 (riavvolgibile per replay/scouting) -- */
    _rand() {
        let t = (this.rngState += 0x6D2B79F5);
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    }
    _randRange(min, max) { return min + this._rand() * (max - min); }

    /* --- utility: legge una stat pilota con fallback neutro (0.5) ---------- */
    _stat(driver, key, fallback = 0.5) {
        const v = driver[key];
        return (typeof v === "number" && !isNaN(v)) ? v : fallback;
    }

    /* --- utility: clamp 0..1 ------------------------------------------------ */
    _clamp01(v) { return Math.max(0, Math.min(1, v)); }

    /* =============================================================================
     * ENTRY POINT PUBBLICO
     * Restituisce un oggetto risultato completo per l'evento.
     *   options:
     *     weather     -> "dry" | "wet" | "mixed"
     *     surface     -> (rally/raid) "asphalt"|"gravel"|"snow"|"sand"|"dirt"
     *     nightStage  -> bool (endurance notturna)
     * ========================================================================== */
    simulateEvent(championshipId, options = {}) {
        const cfg = (typeof CHAMPIONSHIPS !== "undefined")
            ? CHAMPIONSHIPS[championshipId]
            : null;
        if (!cfg) throw new Error(`RaceCalculator: championship '${championshipId}' non trovato`);

        // partecipanti = tutti i piloti di tutti i team del campionato
        const teams = (typeof ALL_TEAMS !== "undefined") ? (ALL_TEAMS[championshipId] || []) : [];
        if (teams.length === 0) throw new Error(`Nessun team per '${championshipId}'`);

        const participants = [];
        for (const team of teams) {
            for (const driver of team.drivers) {
                participants.push({
                    driver, team,
                    rawPace: 0,        // ritmo base
                    tyreWear: 0,       // 0..1 accumulo degrado
                    fuelOrEnergy: 1.0, // 1.0 = pieno
                    stamina: 1.0,      // 1.0 = fresco (endurance)
                    damage: 0,         // 0..1 danni accumulati (rally/raid)
                    timeMs: 0,         // tempo totale (Time scoring)
                    styleScore: 0,     // punteggio giudici (JudgeStyle scoring)
                    notes: [],         // eventi narrativi per il log di gara
                    timeline: [],      // [{t, progress}] per animazione canvas
                });
            }
        }

        // risolve il tracciato dell'evento (da options.trackId o calendario)
        const track = (typeof getTrack === "function" && options.trackId)
            ? getTrack(options.trackId)
            : null;

        // --- INSTRADAMENTO PRINCIPALE per raceType ---
        // Ogni raceType ha il proprio runner. Tutti leggono cfg + features,
        // nessuno sa quale campionato stia girando.
        switch (cfg.raceType) {
            case "CircuitRace":   this._runCircuitRace(cfg, participants, options, track); break;
            case "EnduranceRace": this._runEnduranceRace(cfg, participants, options, track); break;
            case "StageRally":    this._runStageRally(cfg, participants, options, track); break;
            case "MarathonRaid":  this._runMarathonRaid(cfg, participants, options, track); break;
            // Futuri raceType: "OvalRace","JudgeStyle","SprintOffroad"...
            default:
                throw new Error(`RaceCalculator: raceType '${cfg.raceType}' non gestito`);
        }

        // --- CLASSIFICA FINALE (Time o JudgeStyle) ---
        const results = this._buildFinalClassification(cfg, participants);
        return {
            championshipId,
            championshipName: cfg.name,
            raceType: cfg.raceType,
            options,
            track,                                     // per il renderer canvas
            results,
            timelines: participants.map(p => ({        // per l'animazione canvas
                driverId: p.driver.id,
                driver: p.driver.name,
                teamId: p.team.id,
                color: p.team.color,
                timeline: p.timeline,
            })),
            logs: participants.flatMap(p => p.notes.map(n => ({driver: p.driver.name, ...n}))),
        };
    }

    /* =============================================================================
     * MODULO: RITMO BASE (comune a tutti i raceType)
     * Traduce le stat del pilota + livello del team in un "pace score" 0..1.
     * La potenza del team influenza il ritmo: aereo/motore/meccanici.
     * ========================================================================== */
    buildBasePace(cfg, entrant, options) {
        const d = entrant.driver;
        const team = entrant.team;

        // media pesata stat del pilota
        const driverPace =
            this._stat(d, "pace")            * 0.45 +
            this._stat(d, "consistency")     * 0.20 +
            this._stat(d, "racecraft")       * 0.15 +
            this._stat(d, "qualifying")      * 0.10 +
            this._stat(d, "wetPerformance")  * 0.10;

        // contributo del team (sviluppo reparti) normalizzato 0..1
        const staff = team.staff || {};
        const teamPace =
            (staff.aero || 50) / 100 * 0.40 +
            (staff.engine || 50) / 100 * 0.40 +
            (staff.mechanics || 50) / 100 * 0.20;

        // presto: il pilota è il 65%, la macchina il 35% (regolabile)
        let pace = driverPace * 0.65 + teamPace * 0.35;

        // penalità per meteo bagnato: pesa la wetPerformance del pilota
        if (options.weather === "wet") {
            pace *= (0.7 + 0.3 * this._stat(d, "wetPerformance"));
        }
        if (options.weather === "mixed") {
            pace *= (0.88 + 0.12 * this._stat(d, "wetPerformance"));
        }

        // morale basso abbassa lievemente il rendimento (metagame)
        pace *= (0.9 + 0.1 * ((d.morale || 75) / 100));

        entrant.rawPace = this._clamp01(pace);
        return entrant.rawPace;
    }

    /* =============================================================================
     * RUNNER: CircuitRace  (F1, MotoGP, futuri: NASCAR, IndyCar, WTCC)
     * Gara in pista con gli altri. Moduli attivi in base a cfg.features.
     * ========================================================================== */
    _runCircuitRace(cfg, participants, options, track) {
        const laps = this._estimateLaps(cfg, track);  // nr. giri dal tracciato/distanza

        // qualifica: ordina per pace+qualifying -> griglia
        participants.forEach(p => this.buildBasePace(cfg, p, options));
        let grid = [...participants].sort((a, b) =>
            (b.rawPace + this._stat(b.driver, "qualifying") * 0.1)
          - (a.rawPace + this._stat(a.driver, "qualifying") * 0.1));

        // tempo base per giro di riferimento (ms) — track-aware
        const baseLapMs = this._baseLapTimeMs(cfg, track);

        // fattori tracciato (0..1 con fallback neutro)
        const tOver = track && typeof track.overtakingDifficulty === "number" ? track.overtakingDifficulty : 0.3;
        const tTyre = track && typeof track.tyreStress === "number" ? track.tyreStress : 0.5;
        const tElev = track && typeof track.elevationChange === "number" ? track.elevationChange : 0.3;
        const tFuel = track && typeof track.fuelEffect === "number" ? track.fuelEffect : 0.3;
        const tDrs = track && typeof track.drsZones === "number" ? track.drsZones : 0;

        for (const entrant of participants) {
            // tempo totale iniziale dal ritmo puro
            let totalTime = 0;
            let tyreWear = 0;
            // griglia: chi parte indietro ha un "progress" iniziale negativo
            // (vedi dopo come compensiamo per la visualizzazione). La timeline
            // campiona progress (0..1 = frazione di giro sul circuito chiuso)
            // ogni giro, così il renderer può animare il movimento.
            const gridSlot = grid.indexOf(entrant);
            let cumulativeProgress = -gridSlot * 0.004; // piccolo distacco alla partenza

            for (let lap = 1; lap <= laps; lap++) {
                let lapTime = baseLapMs / entrant.rawPace; // pace alto = giro più veloce

                // --- MODULO TRAFFICO (se features.traffic true) ---
                if (cfg.features.traffic) {
                    lapTime = this._applyTraffic(cfg, entrant, lapTime, grid, lap, tOver);
                }

                // --- MODULO GOMME (se features.tyreWear true) ---
                if (cfg.features.tyreWear) {
                    // più giri fai, più la gomma si degrada e il giro rallenta
                    // il degrado è modulato dal tyreStress del tracciato (Suzuka alta)
                    tyreWear += this._tyreWearPerLap(cfg, entrant) * (0.6 + 0.8 * tTyre);
                    // effetto del degrado sul tempo: fino a +6% con gomma andata
                    lapTime *= (1 + 0.06 * tyreWear * cfg.tyreRules.degradationCurve);
                    // bonus gestione conservativa del pilota
                    lapTime *= (1 - 0.02 * this._stat(entrant.driver, "fuelTyreMgmt"));
                }

                // --- DISELIVELLO: tracciati collinosi (Spa) premiano carControl/stamina ---
                if (tElev > 0.1) {
                    lapTime *= (1 + 0.03 * tElev * (1 - this._stat(entrant.driver, "carControl", 0.7)));
                }

                // --- EFFETTO CARBURANTE/QUOTA (Interlagos, Fuji: alta quota) ---
                // Alta quota = meno potenza ma anche più impatto del peso carburante.
                // fuelTyreMgmt aiuta a gestire il consumo.
                if (tFuel > 0.1) {
                    const fuelLoadFactor = (1 - (lap - 1) / laps) * tFuel;
                    lapTime *= (1 + 0.025 * fuelLoadFactor * (1 - 0.5 * this._stat(entrant.driver, "fuelTyreMgmt")));
                }

                // --- MODULO DRS / SLIPSTREAM (se drsBoost > 0) ---
                // Le zone DRS del tracciato aumentano la probabilità/efficacia del boost.
                if (cfg.physicsModifiers.drsBoost > 0 && lap > 2) {
                    const drsChance = 0.25 + 0.12 * tDrs; // più zone = più occasioni
                    if (this._rand() < drsChance) {
                        const boost = cfg.physicsModifiers.drsBoost * (0.5 + 0.25 * tDrs);
                        lapTime *= (1 - boost);
                    }
                }

                // --- ENERGIA/CARBURANTE (es. FE) ---
                if (cfg.features.fuelOrEnergy) {
                    entrant.fuelOrEnergy = Math.max(0, entrant.fuelOrEnergy - 1 / laps);
                    lapTime *= (1 + 0.03 * (1 - entrant.fuelOrEnergy));
                }

                // --- CADUTA/CONTATTO (Moto/Baja) ---
                if (cfg.driverRules.crashRiskFactor > 1.0 &&
                    this._rand() < cfg.driverRules.crashRiskFactor * 0.002 * (1 - this._stat(entrant.driver, "consistency"))) {
                    // caduta: grosso ritardo o ritiro
                    if (this._rand() < 0.3) {
                        entrant.timeMs = Infinity; // ritiro
                        entrant.notes.push({lap, type:"CRASH", msg:"Caduta/ritiro"});
                        break;
                    } else {
                        lapTime *= 1.15;
                        entrant.notes.push({lap, type:"MISTAKE", msg:"Errore/caduta lieve"});
                    }
                }

                // micro-varianza per realismo (consistency la riduce)
                const variance = (1 - this._stat(entrant.driver, "consistency")) * 0.02;
                lapTime *= (1 + this._randRange(-variance, variance));

                totalTime += lapTime;
                // campiona la timeline per l'animazione (progress 0..1 = giro)
                cumulativeProgress += 1;
                entrant.timeline.push({ t: totalTime, progress: cumulativeProgress });
            }
            if (entrant.timeMs !== Infinity) entrant.timeMs = totalTime;
            entrant.tyreWear = tyreWear;
        }
    }

    /* =============================================================================
     * RUNNER: EnduranceRace  (WEC, IMSA)
     * Come CircuitRace + driver stints (stamina) + ciclo giorno/notte +
     * traffico multiclasse. La gara è divisa in "stints" temporali.
     * ========================================================================== */
    _runEnduranceRace(cfg, participants, options, track) {
        participants.forEach(p => this.buildBasePace(cfg, p, options));

        const totalMinutes = (cfg.raceType === "EnduranceRace")
            ? this._enduranceMinutes(cfg)
            : 0;

        const baseLapMs = this._baseLapTimeMs(cfg, track);
        let grid = [...participants].sort((a, b) => b.rawPace - a.rawPace);

        // fattori tracciato (0..1 con fallback neutro)
        const tTyre = track && typeof track.tyreStress === "number" ? track.tyreStress : 0.5;
        const tElev = track && typeof track.elevationChange === "number" ? track.elevationChange : 0.3;
        const tFuel = track && typeof track.fuelEffect === "number" ? track.fuelEffect : 0.3;

        for (const entrant of participants) {
            let totalTime = 0;
            let elapsedMinutes = 0;
            let tyreWear = 0;
            let stintMinutes = 0;
            const gridSlot = grid.indexOf(entrant);
            let cumulativeProgress = -gridSlot * 0.003;

            while (elapsedMinutes < totalMinutes) {
                let lapTime = baseLapMs / entrant.rawPace;

                // --- modulo stamina: cala col tempo, penalizza chi ha poca stamina ---
                if (cfg.features.driverStints) {
                    entrant.stamina = Math.max(0.2, entrant.stamina - cfg.driverRules.staminaDrainRate * 0.0015);
                    lapTime *= (1 + 0.04 * (1 - this._stat(entrant.driver, "stamina", 0.8)));
                    stintMinutes += baseLapMs / 60000;
                    // cambio pilota obbligatorio dopo minStintMinutes
                    if (stintMinutes >= cfg.driverRules.minStintMinutes && this._rand() < 0.02) {
                        entrant.stamina = 1.0; // "entra" un compagno fresco
                        stintMinutes = 0;
                        lapTime += cfg.tyreRules.pitLossSeconds * 1000;
                        entrant.notes.push({type:"DRIVER_SWAP", msg:"Cambio pilota ai box"});
                    }
                }

                // --- ciclo giorno/notte: in notturna cala il rendimento ---
                if (cfg.features.dayNightCycle) {
                    const hour = (elapsedMinutes / 60) % 24;
                    const isNight = (hour >= 20 || hour < 6);
                    if (isNight) {
                        lapTime *= (0.98 + 0.04 * cfg.driverRules.nightPenalty * (1 - this._stat(entrant.driver, "nightConsistency", 0.8)));
                    }
                }

                // --- traffico multiclasse: chi è più lento fa da tappo ---
                if (cfg.features.multiClassTraffic && this._rand() < 0.2) {
                    lapTime *= 1.03;
                }

                // --- gomme (modulate dal tyreStress del tracciato) ---
                if (cfg.features.tyreWear) {
                    tyreWear += this._tyreWearPerLap(cfg, entrant) * (0.6 + 0.8 * tTyre);
                    lapTime *= (1 + 0.05 * tyreWear * cfg.tyreRules.degradationCurve);
                    lapTime *= (1 - 0.02 * this._stat(entrant.driver, "fuelTyreMgmt"));
                }

                // --- dislivello (Spa, Sebring) ---
                if (tElev > 0.1) {
                    lapTime *= (1 + 0.03 * tElev * (1 - this._stat(entrant.driver, "carControl", 0.7)));
                }

                const variance = (1 - this._stat(entrant.driver, "consistency")) * 0.015;
                lapTime *= (1 + this._randRange(-variance, variance));

                totalTime += lapTime;
                elapsedMinutes += lapTime / 60000;
                cumulativeProgress += 1;
                entrant.timeline.push({ t: totalTime, progress: cumulativeProgress });
            }
            entrant.timeMs = totalTime;
            entrant.tyreWear = tyreWear;
        }
    }

    /* =============================================================================
     * RUNNER: StageRally  (WRC, WRC2)
     * Nessun duello diretto: gara a tempo su prove speciali (SS) sequenziali.
     * Il tempo dipende da: stat base + superficie + lettura note + danni accumulati.
     * ========================================================================== */
    _runStageRally(cfg, participants, options, track) {
        const stages = cfg.eventStructure.stages || 12;
        participants.forEach(p => this.buildBasePace(cfg, p, options));

        for (const entrant of participants) {
            let totalTime = 0;
            // offset di partenza: nei rally si parte a intervalli, simulato come
            // un piccolo distacco iniziale nella progressione della SS.
            const startOffset = participants.indexOf(entrant) * 0.002;
            for (let s = 1; s <= stages; s++) {
                // la superficie può variare tra SS (opzioni del calendario)
                const surface = options.surfaceList
                    ? options.surfaceList[(s - 1) % options.surfaceList.length]
                    : (options.surface || "gravel");

                const stageStart = totalTime;
                let stageTime = this._stageTimeMs(cfg, surface, entrant, track);

                // --- lettura note del navigatore (stat speciale rally) ---
                stageTime *= (1.1 - 0.1 * this._stat(entrant.driver, "paceNotesReading"));
                stageTime *= (1.1 - 0.1 * this._stat(entrant.driver, "carControl", 0.8));

                // --- danni accumulati: impattano le SS successive ---
                if (cfg.features.cumulativeDamage) {
                    stageTime *= (1 + 0.12 * entrant.damage);
                    // rischio di danno ogni SS, ridotto da carControl
                    if (this._rand() < 0.06 * (1 - this._stat(entrant.driver, "carControl", 0.8))) {
                        const dmg = this._randRange(0.05, 0.25);
                        entrant.damage = Math.min(1, entrant.damage + dmg);
                        entrant.notes.push({stage:s, type:"DAMAGE", msg:`Danno accumulato (+${(dmg*100|0)}%)`});
                    }
                }

                // --- meteo micro-localizzato (può piovere solo su metà SS) ---
                if (cfg.weatherRules.localizedPossible && this._rand() < 0.25) {
                    const wet = cfg.weatherRules.wetGripMultiplier;
                    stageTime *= (1 + 0.05 * (1 - wet) * (1 - this._stat(entrant.driver, "wetPerformance")));
                    entrant.notes.push({stage:s, type:"WEATHER", msg:"Pioggia localizzata sulla SS"});
                }

                // varianza legata alla consistenza
                const variance = (1 - this._stat(entrant.driver, "consistency")) * 0.03;
                stageTime *= (1 + this._randRange(-variance, variance));

                totalTime += stageTime;
                // timeline per rally: progress 0..1 sulla SS corrente. Campioniamo
                // a inizio e fine di ogni SS così il renderer può interpolare.
                const stageProgressStart = (s - 1) / stages + startOffset;
                const stageProgressEnd = s / stages;
                entrant.timeline.push({ t: stageStart, progress: stageProgressStart });
                entrant.timeline.push({ t: totalTime, progress: stageProgressEnd });
            }
            entrant.timeMs = totalTime;
            entrant.tyreWear = 0.5; // indicativo
        }
    }

    /* =============================================================================
     * RUNNER: MarathonRaid  (Dakar)
     * Come StageRally + NAVIGAZIONE (waypoint nascosti) + riparazioni notturne.
     * L'errore di rotta = penalità ENORMI (fattore primario della disciplina).
     * ========================================================================== */
    _runMarathonRaid(cfg, participants, options, track) {
        const stages = cfg.eventStructure.stages || 12;
        participants.forEach(p => this.buildBasePace(cfg, p, options));

        for (const entrant of participants) {
            let totalTime = 0;
            let partsAvailable = 100; // pezzi di riparazione (gestione metagame)
            const startOffset = participants.indexOf(entrant) * 0.002;

            for (let s = 1; s <= stages; s++) {
                const surface = options.surfaceList
                    ? options.surfaceList[(s - 1) % options.surfaceList.length]
                    : (options.surface || "sand");

                const stageStart = totalTime;
                let stageTime = this._stageTimeMs(cfg, surface, entrant, track);
                stageTime *= (1.1 - 0.1 * this._stat(entrant.driver, "carControl", 0.8));

                // --- NAVIGAZIONE: cuore del raid ---
                if (cfg.features.navigation) {
                    const navSkill = this._stat(entrant.driver, "navigationSkill");
                    const desertExp = this._stat(entrant.driver, "desertExperience", navSkill);
                    // probabilità di errore di rotta: inversa alla skill
                    if (this._rand() < (1 - navSkill) * 0.5) {
                        // errore di navigazione: penalità enorme (minuti→ore)
                        const penaltyMin = this._randRange(2, 30) * (1.3 - desertExp);
                        stageTime += penaltyMin * 60000;
                        entrant.notes.push({stage:s, type:"NAV_ERROR", msg:`Errore di rotta: +${penaltyMin.toFixed(1)} min`});
                    }
                }

                // --- danni cumulativi + rottura meccanica istantanea ---
                if (cfg.features.cumulativeDamage) {
                    stageTime *= (1 + 0.15 * entrant.damage);
                    // rottura grave (suddenFailureProb elevata in raid)
                    if (this._rand() < cfg.tyreRules.suddenFailureProb) {
                        const dmg = this._randRange(0.2, 0.6);
                        entrant.damage = Math.min(1, entrant.damage + dmg);
                        stageTime += dmg * 30 * 60000; // decine di minuti persi
                        entrant.notes.push({stage:s, type:"BREAKDOWN", msg:`Rottura meccanica grave (+${(dmg*30|0)} min)`});
                    }
                }

                // --- riparazione notturna: usa i pezzi per abbassare il danno ---
                if (cfg.features.overnightRepair && entrant.damage > 0 && partsAvailable > 0) {
                    const repair = Math.min(entrant.damage, 0.4, partsAvailable / 100);
                    entrant.damage -= repair;
                    partsAvailable -= repair * 100;
                    if (repair > 0.01) {
                        entrant.notes.push({stage:s, type:"REPAIR", msg:`Riparazione notturna (-${(repair*100|0)}% danno)`});
                    }
                }

                // tempesta di sabbia localizzata
                if (cfg.weatherRules.localizedPossible && this._rand() < 0.15) {
                    stageTime *= 1.1;
                    entrant.notes.push({stage:s, type:"WEATHER", msg:"Tempesta di sabbia"});
                }

                // varianza: il raid è la disciplina più caotica
                const variance = (1 - this._stat(entrant.driver, "consistency")) * 0.05;
                stageTime *= (1 + this._randRange(-variance, variance));

                totalTime += stageTime;
                // timeline per raid: progress 0..1 frazionato per tappa
                const stageProgressStart = (s - 1) / stages + startOffset;
                const stageProgressEnd = s / stages;
                entrant.timeline.push({ t: stageStart, progress: stageProgressStart });
                entrant.timeline.push({ t: totalTime, progress: stageProgressEnd });
            }
            entrant.timeMs = totalTime;
        }
    }

    /* =============================================================================
     * CLASSIFICA FINALE
     * Ordina per Time (crescente) o JudgeStyle (decrescente) e assegna punti.
     * ========================================================================== */
    _buildFinalClassification(cfg, participants) {
        const scoring = (typeof SCORING_TABLES !== "undefined")
            ? (SCORING_TABLES[cfg.features.pointSystem] || [])
            : [];

        let sorted;
        if (cfg.scoringType === "JudgeStyle") {
            // Drift: punteggio stile decrescente
            sorted = [...participants].sort((a, b) => b.styleScore - a.styleScore);
        } else {
            // Time: ascending, ritiri (Infinity) in fondo
            sorted = [...participants].sort((a, b) => a.timeMs - b.timeMs);
        }

        return sorted.map((p, idx) => {
            const position = idx + 1;
            const points = (position <= scoring.length && cfg.scoringType === "Time")
                ? scoring[idx]
                : 0;
            const finished = p.timeMs !== Infinity && p.styleScore !== undefined
                ? true
                : p.timeMs !== Infinity;
            return {
                position: finished ? position : "DNF",
                driver: p.driver.name,
                driverId: p.driver.id,
                nationality: p.driver.nationality,
                team: p.team.name,
                teamId: p.team.id,
                timeMs: finished ? p.timeMs : null,
                timeStr: finished ? this._formatTime(p.timeMs) : "DNF",
                points,
                tyreWear: +(p.tyreWear || 0).toFixed(3),
                damage: +(p.damage || 0).toFixed(3),
                morale: p.driver.morale,
            };
        });
    }

    /* =============================================================================
     * SOTTOMETODI AUSILIARI
     * ========================================================================== */

    // traffico: chi sta davanti rallenta chi sta dietro (dirty air) su CircuitRace.
    // tOver = overtakingDifficulty del tracciato (0..1): alto = difficile sorpassare
    // (Monaco), quindi chi resta dietro perde più tempo e non riesce a passare.
    _applyTraffic(cfg, entrant, lapTime, grid, lap, tOver = 0.3) {
        const idx = grid.indexOf(entrant);
        if (idx > 0 && this._rand() < 0.3) {
            // segue qualcuno: dirty air riduce prestazioni ma aiuta sorpasso.
            // Su circuiti dove si sorpassa poco (tOver alto) il danno del restare
            // dietro è maggiore e il "recupero" minore.
            const dirtyAir = cfg.physicsModifiers.dirtyAirEffect;
            const trafficPenalty = 0.01 * dirtyAir * (0.5 + 1.5 * tOver);
            const overtakeChance = 0.1 * (1 - tOver); // facile sorpasso -> più tentativi
            if (this._rand() < overtakeChance) {
                // sorpasso riuscito: piccolo bonus, niente penalità
                lapTime *= (1 - 0.005 * dirtyAir);
            } else {
                lapTime *= (1 + trafficPenalty);
            }
        }
        // tolleranza al contatto: gomme che durano (NASCAR) = contatti frequenti
        if (cfg.physicsModifiers.contactTolerance > 0.15 && this._rand() < 0.05) {
            lapTime *= (1 - 0.005 * cfg.physicsModifiers.contactTolerance); // spinta da contatto
        }
        return lapTime;
    }

    // degrado gomme per giro (dipende da regole categoria + stile pilota)
    _tyreWearPerLap(cfg, entrant) {
        const base = 0.012; // ~1.2% a giro in condizioni neutre
        const mgmt = this._stat(entrant.driver, "fuelTyreMgmt"); //保守 riduce il degrado
        return base * (1.4 - mgmt) * cfg.tyreRules.degradationCurve / 1.5;
    }

    // stima del numero di giri: se il tracciato è disponibile usa la sua lunghezza reale
    _estimateLaps(cfg, track) {
        if (cfg.eventStructure.raceDistanceKm <= 0) return 50;
        if (track && track.lengthKm > 0) {
            return Math.max(5, Math.round(cfg.eventStructure.raceDistanceKm / track.lengthKm));
        }
        // fallback: lunghezza giro media ipotetica per famiglia
        const lapLen = { OpenWheel:5, Bike:4.5, Endurance:13, Rally:25, Raid:200 }[cfg.family] || 5;
        return Math.max(10, Math.round(cfg.eventStructure.raceDistanceKm / lapLen));
    }

    // tempo base per giro: track-aware. Se il tracciato ha lapRecordSec, lo usa;
    // altrimenti fallback per famiglia.
    _baseLapTimeMs(cfg, track) {
        if (track && track.lapRecordSec > 0) {
            return track.lapRecordSec * 1000; // secondi -> ms
        }
        // fallback per famiglia (fattori legacy)
        const familyFactor = {
            OpenWheel: 95, Bike: 110, Endurance: 220, Rally: 600, Raid: 1800,
        };
        const factor = familyFactor[cfg.family] || 110;
        return factor * 1000;
    }

    // durata in minuti di una gara endurance (WEC 6h/24h, derivato dalla distanza)
    _enduranceMinutes(cfg) {
        if (cfg.eventStructure.raceDistanceKm >= 4000) return 24 * 60; // Le Mans 24h
        if (cfg.eventStructure.raceDistanceKm >= 2000) return 8 * 60;
        return 6 * 60;
    }

    // tempo base di una prova speciale (SS) rally/raid: track-aware.
    _stageTimeMs(cfg, surface, entrant, track) {
        const grip = (cfg.surfaceRules.gripTable[surface] || 0.8);
        // Se il tracciato esiste, usa il suo tempo di riferimento per calcolare
        // il tempo di una SS di lunghezza track.lengthKm, poi scala col progress.
        let base;
        if (track && track.lapRecordSec > 0) {
            base = track.lapRecordSec * 1000;
        } else {
            base = this._baseLapTimeMs(cfg, null);
        }
        // grip basso = tempo più alto
        return base / (0.7 + 0.3 * grip) / Math.max(0.5, entrant.rawPace);
    }

    // formattazione tempo: h:mm:ss.mmm per gare endurance (>60min), mm:ss.mmm altrimenti
    _formatTime(ms) {
        if (ms === Infinity || !isFinite(ms)) return "DNF";
        const totalSec = ms / 1000;
        const h = Math.floor(totalSec / 3600);
        const m = Math.floor((totalSec % 3600) / 60);
        const s = Math.floor(totalSec % 60);
        const milli = Math.floor(ms % 1000);
        const pad = (n, w = 2) => n.toString().padStart(w, "0");
        if (h > 0) {
            return `${h}:${pad(m)}:${pad(s)}.${pad(milli, 3)}`;
        }
        return `${m}:${pad(s)}.${pad(milli, 3)}`;
    }
}

/* =============================================================================
 * Istanza singleton pronta all'uso (UI la consuma come window.engine).
 * ========================================================================== */
const engine = new RaceCalculator();

if (typeof window !== "undefined") {
    window.RaceCalculator = RaceCalculator;
    window.engine = engine;
}
if (typeof module !== "undefined" && module.exports) {
    module.exports = { RaceCalculator, engine };
}
