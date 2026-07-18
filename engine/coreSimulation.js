/* =============================================================================
 * ULTIMATE MOTORSPORT MANAGER
 * File: engine/coreSimulation.js
 * -----------------------------------------------------------------------------
 * THE GAME ENGINE — `RaceCalculator` class.
 *
 * PHILOSOPHY (Golden Rule): the engine is GENERIC and "stupid".
 *  - It does NOT know F1, MotoGP, WEC, WRC or Dakar by name.
 *  - It reads ONLY the `ChampionshipConfig` of a championship and decides what to
 *    calculate based on: cfg.raceType, cfg.features.* and cfg.physicsModifiers.*.
 *  - All the difference between disciplines resides in the data, NOT the code.
 *  - Adding NASCAR/IndyCar/FE/Drift/Baja in the future = add config,
 *    ZERO changes to this file (if the flags already exist in the schema).
 *
 * PIPELINE ARCHITECTURE:
 *   simulateEvent(championshipId, options)
 *     -> for each participant: buildBasePace()
 *     -> apply active modules (read features):
 *          tyreWearModule, trafficModule, stintModule, stageModule,
 *          navigationModule, dayNightModule, judgingModule
 *     -> sort and produce results (Time or JudgeStyle)
 * ========================================================================== */

class RaceCalculator {
    constructor() {
        // Stable RNG (optional seed for event reproducibility).
        this.seed = (Math.random() * 1e9) | 0;
        this.rngState = this.seed;
    }

    /* --- set deterministic seed (used by CareerManager for replays) -------- */
    setSeed(seed) {
        this.seed = (seed >>> 0) || 1;
        this.rngState = this.seed;
    }

    /* --- deterministic RNG mulberry32 (rewindable for replay/scouting) ------ */
    _rand() {
        let t = (this.rngState += 0x6D2B79F5);
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    }
    _randRange(min, max) { return min + this._rand() * (max - min); }

    /* --- utility: reads a driver stat with neutral fallback (0.5) ---------- */
    _stat(driver, key, fallback = 0.5) {
        const v = driver[key];
        return (typeof v === "number" && !isNaN(v)) ? v : fallback;
    }

    /* --- utility: clamp 0..1 ------------------------------------------------ */
    _clamp01(v) { return Math.max(0, Math.min(1, v)); }

    /* =============================================================================
     * QUALIFYING — simulates the qualifying session and returns the grid.
     * Unlike the race, here the `qualifying` stat matters most and you run with
     * light fuel and fresh tyres. Returns an ordered array of
     * {driverId, driver, teamId, team, position, lapTimeMs, lapTimeStr}.
     * options.grid: array of driverIds to force the order (debug/replay).
     * ========================================================================== */
    simulateQualifying(championshipId, options = {}) {
        const cfg = (typeof CHAMPIONSHIPS !== "undefined")
            ? CHAMPIONSHIPS[championshipId] : null;
        if (!cfg) throw new Error(`RaceCalculator: championship '${championshipId}' not found`);

        const teams = (typeof ALL_TEAMS !== "undefined") ? (ALL_TEAMS[championshipId] || []) : [];
        if (teams.length === 0) throw new Error(`No teams for '${championshipId}'`);

        const track = (typeof getTrack === "function" && options.trackId)
            ? getTrack(options.trackId) : null;
        const baseLapMs = this._baseLapTimeMs(cfg, track);

        // Build participants and base pace
        const entrants = [];
        for (const team of teams) {
            for (const driver of team.drivers) {
                const e = { driver, team, rawPace: 0 };
                this.buildBasePace(cfg, e, options);
                entrants.push(e);
            }
        }

        // Simulate 3 attempts (simplified Q1/Q2/Q3 style): take the best lap
        const results = entrants.map(e => {
            let bestLap = Infinity;
            const d = e.driver;
            // Qualifying weighs the qualifying stat + pure pace much more heavily
            let qualPace = e.rawPace * 0.55 + this._stat(d, "qualifying") * 0.35 + this._stat(d, "consistency") * 0.10;
            // Wet weather in qualifying: weighs wetPerformance
            if (options.weather === "wet") qualPace *= (0.75 + 0.25 * this._stat(d, "wetPerformance"));
            if (options.weather === "mixed") qualPace *= (0.90 + 0.10 * this._stat(d, "wetPerformance"));
            // Morale
            qualPace *= (0.92 + 0.08 * ((d.morale || 75) / 100));

            // 3 attempts with variance: the best one counts
            for (let attempt = 1; attempt <= 3; attempt++) {
                // each attempt has a small improvement (tyre warm-up) but also error risk
                const heat = 1 - 0.004 * attempt; // goes slightly faster
                const errorRisk = (1 - this._stat(d, "consistency")) * 0.015 * attempt;
                let lapTime = baseLapMs / Math.max(0.3, qualPace) * heat;
                if (this._rand() < errorRisk) lapTime *= 1.05; // mistake on the lap
                // micro-variance
                lapTime *= (1 + this._randRange(-0.008, 0.008));
                if (lapTime < bestLap) bestLap = lapTime;
            }
            return {
                driverId: d.id, driver: d.name, nationality: d.nationality,
                teamId: e.team.id, team: e.team.name,
                bestLapMs: bestLap,
            };
        });

        results.sort((a, b) => a.bestLapMs - b.bestLapMs);
        return results.map((r, i) => ({
            ...r,
            position: i + 1,
            gridPosition: i + 1,
            lapTimeStr: this._formatTime(r.bestLapMs),
        }));
    }

    /* =============================================================================
     * PRACTICE — simulates the practice session. Returns setup feedback and a
     * "setupConfidence" 0..1 that can influence morale / qualifying.
     * It also reveals an estimate of the real potential (for integrated scouting).
     * ========================================================================== */
    simulatePractice(championshipId, options = {}) {
        const cfg = (typeof CHAMPIONSHIPS !== "undefined")
            ? CHAMPIONSHIPS[championshipId] : null;
        if (!cfg) throw new Error(`RaceCalculator: championship '${championshipId}' not found`);

        const teams = (typeof ALL_TEAMS !== "undefined") ? (ALL_TEAMS[championshipId] || []) : [];
        const track = (typeof getTrack === "function" && options.trackId)
            ? getTrack(options.trackId) : null;
        const baseLapMs = this._baseLapTimeMs(cfg, track);

        const entrants = [];
        for (const team of teams) {
            for (const driver of team.drivers) {
                const e = { driver, team, rawPace: 0 };
                this.buildBasePace(cfg, e, options);
                entrants.push(e);
            }
        }

        // Simulate 10-15 practice laps: detect pace and consistency
        return entrants.map(e => {
            const d = e.driver;
            const laps = 10 + Math.floor(this._rand() * 6);
            let bestLap = Infinity, totalConsistency = 0;
            for (let l = 0; l < laps; l++) {
                let lt = baseLapMs / Math.max(0.3, e.rawPace);
                lt *= (1 + this._randRange(-0.03, 0.03));
                // setup improvement (fuelTyreMgmt = driver feedback)
                lt *= (1 - 0.002 * this._stat(d, "fuelTyreMgmt") * (l / laps));
                if (lt < bestLap) bestLap = lt;
                totalConsistency += lt;
            }
            const avgLap = totalConsistency / laps;
            // setupConfidence: how well the team found a good setup
            const staff = e.team.staff || {};
            const setupConfidence = this._clamp01(
                0.4 + 0.3 * ((staff.mechanics || 50) / 100) + 0.2 * this._stat(d, "fuelTyreMgmt") + this._randRange(-0.1, 0.1)
            );
            // visible potential estimate (for scouting: higher if hiddenPotential is high)
            const potentialHint = d.hiddenPotential
                ? this._clamp01(d.hiddenPotential * (0.85 + 0.3 * this._rand()))
                : null;
            return {
                driverId: d.id, driver: d.name, teamId: e.team.id, team: e.team.name,
                bestLapMs: bestLap, bestLapStr: this._formatTime(bestLap),
                avgLapMs: avgLap, avgLapStr: this._formatTime(avgLap),
                consistency: this._clamp01(1 - (Math.abs(bestLap - avgLap) / avgLap)),
                setupConfidence,
                potentialHint,
                pace: +e.rawPace.toFixed(3),
            };
        }).sort((a, b) => a.bestLapMs - b.bestLapMs);
    }

    /* =============================================================================
     * PUBLIC ENTRY POINT
     * Returns a complete result object for the event.
     *   options:
     *     weather     -> "dry" | "wet" | "mixed"
     *     surface     -> (rally/raid) "asphalt"|"gravel"|"snow"|"sand"|"dirt"
     *     nightStage  -> bool (night endurance)
     *     grid        -> ordered array of driverIds (from qualifying) to force
     *                    the starting order instead of computing it internally
     * ========================================================================== */
    simulateEvent(championshipId, options = {}) {
        const cfg = (typeof CHAMPIONSHIPS !== "undefined")
            ? CHAMPIONSHIPS[championshipId]
            : null;
        if (!cfg) throw new Error(`RaceCalculator: championship '${championshipId}' not found`);

        // participants = all drivers of all teams in the championship
        const teams = (typeof ALL_TEAMS !== "undefined") ? (ALL_TEAMS[championshipId] || []) : [];
        if (teams.length === 0) throw new Error(`No teams for '${championshipId}'`);

        const participants = [];
        for (const team of teams) {
            for (const driver of team.drivers) {
                participants.push({
                    driver, team,
                    rawPace: 0,        // base pace
                    tyreWear: 0,       // 0..1 wear accumulation
                    fuelOrEnergy: 1.0, // 1.0 = full
                    stamina: 1.0,      // 1.0 = fresh (endurance)
                    damage: 0,         // 0..1 accumulated damage (rally/raid)
                    timeMs: 0,         // total time (Time scoring)
                    styleScore: 0,     // judge score (JudgeStyle scoring)
                    notes: [],         // narrative events for the race log
                    timeline: [],      // [{t, progress}] for canvas animation
                });
            }
        }

        // resolve the event track (from options.trackId or calendar)
        const track = (typeof getTrack === "function" && options.trackId)
            ? getTrack(options.trackId)
            : null;

        // --- MAIN DISPATCH by raceType ---
        // Each raceType has its own runner. All read cfg + features,
        // none knows which championship is running.
        switch (cfg.raceType) {
            case "CircuitRace":   this._runCircuitRace(cfg, participants, options, track); break;
            case "EnduranceRace": this._runEnduranceRace(cfg, participants, options, track); break;
            case "StageRally":    this._runStageRally(cfg, participants, options, track); break;
            case "MarathonRaid":  this._runMarathonRaid(cfg, participants, options, track); break;
            // Future raceTypes: "OvalRace","JudgeStyle","SprintOffroad"...
            default:
                throw new Error(`RaceCalculator: raceType '${cfg.raceType}' not handled`);
        }

        // --- FINAL CLASSIFICATION (Time or JudgeStyle) ---
        const results = this._buildFinalClassification(cfg, participants);
        return {
            championshipId,
            championshipName: cfg.name,
            raceType: cfg.raceType,
            options,
            track,                                     // for the canvas renderer
            results,
            timelines: participants.map(p => ({        // for canvas animation
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
     * MODULE: BASE PACE (common to all raceTypes)
     * Translates driver stats + team level into a "pace score" 0..1.
     * Team power influences pace: aero/engine/mechanics.
     * ========================================================================== */
    buildBasePace(cfg, entrant, options) {
        const d = entrant.driver;
        const team = entrant.team;

        // weighted average of driver stats
        const driverPace =
            this._stat(d, "pace")            * 0.45 +
            this._stat(d, "consistency")     * 0.20 +
            this._stat(d, "racecraft")       * 0.15 +
            this._stat(d, "qualifying")      * 0.10 +
            this._stat(d, "wetPerformance")  * 0.10;

        // team contribution (department development) normalized 0..1
        const staff = team.staff || {};
        const teamPace =
            (staff.aero || 50) / 100 * 0.40 +
            (staff.engine || 50) / 100 * 0.40 +
            (staff.mechanics || 50) / 100 * 0.20;

        // balance: driver is 65%, car is 35% (adjustable)
        let pace = driverPace * 0.65 + teamPace * 0.35;
        // powerToWeight: high-power disciplines (Drag, NASCAR) emphasize
        // the net performance gap between contenders (1.0 = neutral).
        pace *= (0.97 + 0.03 * (cfg.physicsModifiers.powerToWeight || 1.0));

        // wet weather penalty: weighs driver wetPerformance
        if (options.weather === "wet") {
            pace *= (0.7 + 0.3 * this._stat(d, "wetPerformance"));
        }
        if (options.weather === "mixed") {
            pace *= (0.88 + 0.12 * this._stat(d, "wetPerformance"));
        }

        // low morale slightly lowers performance (metagame)
        pace *= (0.9 + 0.1 * ((d.morale || 75) / 100));

        entrant.rawPace = this._clamp01(pace);
        return entrant.rawPace;
    }

    /* =============================================================================
     * RUNNER: CircuitRace  (F1, MotoGP, future: NASCAR, IndyCar, WTCC)
     * On-track racing. Active modules depend on cfg.features.
     * ========================================================================== */
    _runCircuitRace(cfg, participants, options, track) {
        const laps = this._estimateLaps(cfg, track);  // nr. of laps from track/distance

        // qualifying: sort by pace+qualifying -> grid. If options.grid
        // was provided (from the separate qualifying session), sort the
        // participants according to that order instead of recomputing it.
        participants.forEach(p => this.buildBasePace(cfg, p, options));
        let grid;
        if (Array.isArray(options.grid) && options.grid.length > 0) {
            const order = new Map(options.grid.map((id, i) => [id, i]));
            grid = [...participants].sort((a, b) =>
                (order.get(a.driver.id) ?? 999) - (order.get(b.driver.id) ?? 999));
        } else {
            grid = [...participants].sort((a, b) =>
                (b.rawPace + this._stat(b.driver, "qualifying") * 0.1)
              - (a.rawPace + this._stat(a.driver, "qualifying") * 0.1));
        }

        // base reference lap time (ms) — track-aware
        const baseLapMs = this._baseLapTimeMs(cfg, track);

        // track factors (0..1 with neutral fallback)
        const tOver = track && typeof track.overtakingDifficulty === "number" ? track.overtakingDifficulty : 0.3;
        const tTyre = track && typeof track.tyreStress === "number" ? track.tyreStress : 0.5;
        const tElev = track && typeof track.elevationChange === "number" ? track.elevationChange : 0.3;
        const tFuel = track && typeof track.fuelEffect === "number" ? track.fuelEffect : 0.3;
        const tDrs = track && typeof track.drsZones === "number" ? track.drsZones : 0;

        for (const entrant of participants) {
            // initial total time from pure pace
            let totalTime = 0;
            let tyreWear = 0;
            // grid: those starting at the back have a negative initial "progress"
            // (see below how we compensate for visualization). The timeline
            // samples progress (0..1 = fraction of a lap on the closed circuit)
            // every lap, so the renderer can animate movement.
            const gridSlot = grid.indexOf(entrant);
            let cumulativeProgress = -gridSlot * 0.004; // small gap at the start

            for (let lap = 1; lap <= laps; lap++) {
                let lapTime = baseLapMs / entrant.rawPace; // high pace = faster lap

                // --- TRAFFIC MODULE (if features.traffic true) ---
                if (cfg.features.traffic) {
                    lapTime = this._applyTraffic(cfg, entrant, lapTime, grid, lap, tOver);
                }

                // --- TYRE MODULE (if features.tyreWear true) ---
                if (cfg.features.tyreWear) {
                    // the more laps you do, the more the tyre degrades and the lap slows
                    // degradation is modulated by the track's tyreStress (Suzuka high)
                    tyreWear += this._tyreWearPerLap(cfg, entrant) * (0.6 + 0.8 * tTyre);
                    // wear effect on time: up to +6% with worn tyres
                    lapTime *= (1 + 0.06 * tyreWear * cfg.tyreRules.degradationCurve);
                    // conservative management bonus from the driver
                    lapTime *= (1 - 0.02 * this._stat(entrant.driver, "fuelTyreMgmt"));

                    // --- INSTANT TYRE FAILURE (suddenFailureProb) ---
                    // Probability scales with accumulated wear: fresh tyre won't fail.
                    if (tyreWear > 0.5 &&
                        this._rand() < (cfg.tyreRules.suddenFailureProb || 0) * 0.1 * tyreWear) {
                        if (this._rand() < 0.4) {
                            entrant.timeMs = Infinity;
                            entrant.notes.push({lap, type:"TYRE_FAIL", msg:"Tyre failure: retirement"});
                            break;
                        } else {
                            lapTime *= 1.20;
                            entrant.notes.push({lap, type:"TYRE_BLIST", msg:"Tyre blistering: slow lap"});
                        }
                    }

                    // --- PIT STOP: if wear exceeds threshold and pit is provided ---
                    if (tyreWear > 0.75 && (cfg.tyreRules.pitLossSeconds || 0) > 0) {
                        lapTime += cfg.tyreRules.pitLossSeconds * 1000;
                        tyreWear = 0.15; // new tyres but not perfect
                        entrant.notes.push({lap, type:"PIT", msg:"Pit stop: tyre change"});
                    }
                }

                // --- ELEVATION: hilly tracks (Spa) reward carControl/stamina ---
                if (tElev > 0.1) {
                    lapTime *= (1 + 0.03 * tElev * (1 - this._stat(entrant.driver, "carControl", 0.7)));
                }

                // --- FUEL/ALTITUDE EFFECT (Interlagos, Fuji: high altitude) ---
                // High altitude = less power but also more impact of fuel weight.
                // fuelTyreMgmt helps manage consumption.
                if (tFuel > 0.1) {
                    const fuelLoadFactor = (1 - (lap - 1) / laps) * tFuel;
                    lapTime *= (1 + 0.025 * fuelLoadFactor * (1 - 0.5 * this._stat(entrant.driver, "fuelTyreMgmt")));
                }

                // --- DRS / SLIPSTREAM MODULE (if drsBoost > 0) ---
                // DRS zones of the track increase the probability/effectiveness of the boost.
                if (cfg.physicsModifiers.drsBoost > 0 && lap > 2) {
                    const drsChance = 0.25 + 0.12 * tDrs; // more zones = more opportunities
                    if (this._rand() < drsChance) {
                        const boost = cfg.physicsModifiers.drsBoost * (0.5 + 0.25 * tDrs);
                        lapTime *= (1 - boost);
                    }
                }

                // --- ENERGY/FUEL (e.g. FE) ---
                if (cfg.features.fuelOrEnergy) {
                    entrant.fuelOrEnergy = Math.max(0, entrant.fuelOrEnergy - 1 / laps);
                    lapTime *= (1 + 0.03 * (1 - entrant.fuelOrEnergy));
                }

                // --- CRASH/CONTACT (Moto/Baja) ---
                if (cfg.driverRules.crashRiskFactor > 1.0 &&
                    this._rand() < cfg.driverRules.crashRiskFactor * 0.002 * (1 - this._stat(entrant.driver, "consistency"))) {
                    // crash: big delay or retirement
                    if (this._rand() < 0.3) {
                        entrant.timeMs = Infinity; // retirement
                        entrant.notes.push({lap, type:"CRASH", msg:"Crash/retirement"});
                        break;
                    } else {
                        lapTime *= 1.15;
                        entrant.notes.push({lap, type:"MISTAKE", msg:"Minor crash/error"});
                    }
                }

                // micro-variance for realism (consistency reduces it)
                const variance = (1 - this._stat(entrant.driver, "consistency")) * 0.02;
                lapTime *= (1 + this._randRange(-variance, variance));

                totalTime += lapTime;
                // sample the timeline for animation (progress 0..1 = lap)
                cumulativeProgress += 1;
                entrant.timeline.push({ t: totalTime, progress: cumulativeProgress });
            }
            if (entrant.timeMs !== Infinity) entrant.timeMs = totalTime;
            entrant.tyreWear = tyreWear;
        }
    }

    /* =============================================================================
     * RUNNER: EnduranceRace  (WEC, IMSA)
     * Like CircuitRace + driver stints (stamina) + day/night cycle +
     * multiclass traffic. The race is divided into timed "stints".
     * ========================================================================== */
    _runEnduranceRace(cfg, participants, options, track) {
        participants.forEach(p => this.buildBasePace(cfg, p, options));

        const totalMinutes = (cfg.raceType === "EnduranceRace")
            ? this._enduranceMinutes(cfg)
            : 0;

        const baseLapMs = this._baseLapTimeMs(cfg, track);
        let grid = [...participants].sort((a, b) => b.rawPace - a.rawPace);

        // track factors (0..1 with neutral fallback)
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

                // --- stamina module: drops over time, penalizes low stamina ---
                if (cfg.features.driverStints) {
                    entrant.stamina = Math.max(0.2, entrant.stamina - cfg.driverRules.staminaDrainRate * 0.0015);
                    lapTime *= (1 + 0.04 * (1 - this._stat(entrant.driver, "stamina", 0.8)));
                    stintMinutes += baseLapMs / 60000;
                    // mandatory driver swap after minStintMinutes
                    if (stintMinutes >= cfg.driverRules.minStintMinutes && this._rand() < 0.02) {
                        entrant.stamina = 1.0; // a fresh teammate "gets in"
                        stintMinutes = 0;
                        lapTime += cfg.tyreRules.pitLossSeconds * 1000;
                        entrant.notes.push({type:"DRIVER_SWAP", msg:"Driver swap in the pits"});
                    }
                }

                // --- day/night cycle: at night performance drops ---
                if (cfg.features.dayNightCycle) {
                    const hour = (elapsedMinutes / 60) % 24;
                    const isNight = (hour >= 20 || hour < 6);
                    if (isNight) {
                        lapTime *= (0.98 + 0.04 * cfg.driverRules.nightPenalty * (1 - this._stat(entrant.driver, "nightConsistency", 0.8)));
                    }
                }

                // --- multiclass traffic: slower cars act as mobile chicanes ---
                if (cfg.features.multiClassTraffic && this._rand() < 0.2) {
                    lapTime *= 1.03;
                }

                // --- tyres (modulated by track tyreStress) ---
                if (cfg.features.tyreWear) {
                    tyreWear += this._tyreWearPerLap(cfg, entrant) * (0.6 + 0.8 * tTyre);
                    lapTime *= (1 + 0.05 * tyreWear * cfg.tyreRules.degradationCurve);
                    lapTime *= (1 - 0.02 * this._stat(entrant.driver, "fuelTyreMgmt"));
                }

                // --- elevation (Spa, Sebring) ---
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
     * No direct duel: time trial on sequential special stages (SS).
     * Time depends on: base stats + surface + pace notes reading + accumulated damage.
     * ========================================================================== */
    _runStageRally(cfg, participants, options, track) {
        const stages = cfg.eventStructure.stages || 12;
        participants.forEach(p => this.buildBasePace(cfg, p, options));

        for (const entrant of participants) {
            let totalTime = 0;
            // start offset: in rallies you start at intervals, simulated as
            // a small initial gap in the SS progression.
            const startOffset = participants.indexOf(entrant) * 0.002;
            for (let s = 1; s <= stages; s++) {
                // the surface can vary between SSs (calendar options)
                const surface = options.surfaceList
                    ? options.surfaceList[(s - 1) % options.surfaceList.length]
                    : (options.surface || "gravel");

                const stageStart = totalTime;
                let stageTime = this._stageTimeMs(cfg, surface, entrant, track);

                // --- co-driver pace notes reading (rally-specific stat) ---
                stageTime *= (1.1 - 0.1 * this._stat(entrant.driver, "paceNotesReading"));
                stageTime *= (1.1 - 0.1 * this._stat(entrant.driver, "carControl", 0.8));

                // --- accumulated damage: impacts subsequent SSs ---
                if (cfg.features.cumulativeDamage) {
                    stageTime *= (1 + 0.12 * entrant.damage);
                    // risk of damage each SS, reduced by carControl
                    if (this._rand() < 0.06 * (1 - this._stat(entrant.driver, "carControl", 0.8))) {
                        const dmg = this._randRange(0.05, 0.25);
                        entrant.damage = Math.min(1, entrant.damage + dmg);
                        entrant.notes.push({stage:s, type:"DAMAGE", msg:`Accumulated damage (+${(dmg*100|0)}%)`});
                    }
                }

                // --- micro-localized weather (it may rain on only half an SS) ---
                if (cfg.weatherRules.localizedPossible && this._rand() < 0.25) {
                    const wet = cfg.weatherRules.wetGripMultiplier;
                    stageTime *= (1 + 0.05 * (1 - wet) * (1 - this._stat(entrant.driver, "wetPerformance")));
                    entrant.notes.push({stage:s, type:"WEATHER", msg:"Localized rain on the SS"});
                }

                // consistency-based variance
                const variance = (1 - this._stat(entrant.driver, "consistency")) * 0.03;
                stageTime *= (1 + this._randRange(-variance, variance));

                totalTime += stageTime;
                // timeline for rally: progress 0..1 on the current SS. We sample
                // at the start and end of each SS so the renderer can interpolate.
                const stageProgressStart = (s - 1) / stages + startOffset;
                const stageProgressEnd = s / stages;
                entrant.timeline.push({ t: stageStart, progress: stageProgressStart });
                entrant.timeline.push({ t: totalTime, progress: stageProgressEnd });
            }
            entrant.timeMs = totalTime;
            entrant.tyreWear = 0.5; // indicative
        }
    }

    /* =============================================================================
     * RUNNER: MarathonRaid  (Dakar)
     * Like StageRally + NAVIGATION (hidden waypoints) + overnight repairs.
     * Navigation error = HUGE penalty (primary factor of the discipline).
     * ========================================================================== */
    _runMarathonRaid(cfg, participants, options, track) {
        const stages = cfg.eventStructure.stages || 12;
        participants.forEach(p => this.buildBasePace(cfg, p, options));

        for (const entrant of participants) {
            let totalTime = 0;
            let partsAvailable = 100; // repair parts (metagame management)
            const startOffset = participants.indexOf(entrant) * 0.002;

            for (let s = 1; s <= stages; s++) {
                const surface = options.surfaceList
                    ? options.surfaceList[(s - 1) % options.surfaceList.length]
                    : (options.surface || "sand");

                const stageStart = totalTime;
                let stageTime = this._stageTimeMs(cfg, surface, entrant, track);
                stageTime *= (1.1 - 0.1 * this._stat(entrant.driver, "carControl", 0.8));

                // --- NAVIGATION: the heart of the raid ---
                if (cfg.features.navigation) {
                    const navSkill = this._stat(entrant.driver, "navigationSkill");
                    const desertExp = this._stat(entrant.driver, "desertExperience", navSkill);
                    // probability of navigation error: inverse to skill
                    if (this._rand() < (1 - navSkill) * 0.5) {
                        // navigation error: huge penalty (minutes→hours)
                        const penaltyMin = this._randRange(2, 30) * (1.3 - desertExp);
                        stageTime += penaltyMin * 60000;
                        entrant.notes.push({stage:s, type:"NAV_ERROR", msg:`Navigation error: +${penaltyMin.toFixed(1)} min`});
                    }
                }

                // --- cumulative damage + instant mechanical breakdown ---
                if (cfg.features.cumulativeDamage) {
                    stageTime *= (1 + 0.15 * entrant.damage);
                    // severe breakdown (high suddenFailureProb in raid)
                    if (this._rand() < cfg.tyreRules.suddenFailureProb) {
                        const dmg = this._randRange(0.2, 0.6);
                        entrant.damage = Math.min(1, entrant.damage + dmg);
                        stageTime += dmg * 30 * 60000; // tens of minutes lost
                        entrant.notes.push({stage:s, type:"BREAKDOWN", msg:`Severe mechanical breakdown (+${(dmg*30|0)} min)`});
                    }
                }

                // --- overnight repair: use parts to reduce damage ---
                if (cfg.features.overnightRepair && entrant.damage > 0 && partsAvailable > 0) {
                    const repair = Math.min(entrant.damage, 0.4, partsAvailable / 100);
                    entrant.damage -= repair;
                    partsAvailable -= repair * 100;
                    if (repair > 0.01) {
                        entrant.notes.push({stage:s, type:"REPAIR", msg:`Overnight repair (-${(repair*100|0)}% damage)`});
                    }
                }

                // localized sandstorm
                if (cfg.weatherRules.localizedPossible && this._rand() < 0.15) {
                    stageTime *= 1.1;
                    entrant.notes.push({stage:s, type:"WEATHER", msg:"Sandstorm"});
                }

                // variance: raid is the most chaotic discipline
                const variance = (1 - this._stat(entrant.driver, "consistency")) * 0.05;
                stageTime *= (1 + this._randRange(-variance, variance));

                totalTime += stageTime;
                // timeline for raid: progress 0..1 split per stage
                const stageProgressStart = (s - 1) / stages + startOffset;
                const stageProgressEnd = s / stages;
                entrant.timeline.push({ t: stageStart, progress: stageProgressStart });
                entrant.timeline.push({ t: totalTime, progress: stageProgressEnd });
            }
            entrant.timeMs = totalTime;
        }
    }

    /* =============================================================================
     * FINAL CLASSIFICATION
     * Sorts by Time (ascending) or JudgeStyle (descending) and assigns points.
     * ========================================================================== */
    _buildFinalClassification(cfg, participants) {
        const scoring = (typeof SCORING_TABLES !== "undefined")
            ? (SCORING_TABLES[cfg.features.pointSystem] || [])
            : [];

        let sorted;
        if (cfg.scoringType === "JudgeStyle") {
            // Drift: descending style score
            sorted = [...participants].sort((a, b) => b.styleScore - a.styleScore);
        } else {
            // Time: ascending, retirements (Infinity) at the bottom
            sorted = [...participants].sort((a, b) => a.timeMs - b.timeMs);
        }

        return sorted.map((p, idx) => {
            const position = idx + 1;
            const points = (position <= scoring.length && cfg.scoringType === "Time")
                ? scoring[idx]
                : 0;
            const finished = p.timeMs !== Infinity;
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
     * AUXILIARY SUB-METHODS
     * ========================================================================== */

    // traffic: the car ahead slows down the one behind (dirty air) on CircuitRace.
    // tOver = track overtakingDifficulty (0..1): high = hard to overtake
    // (Monaco), so those stuck behind lose more time and can't get past.
    _applyTraffic(cfg, entrant, lapTime, grid, lap, tOver = 0.3) {
        const idx = grid.indexOf(entrant);
        if (idx > 0 && this._rand() < 0.3) {
            // following someone: dirty air reduces performance but helps overtaking.
            // On tracks where overtaking is hard (high tOver) the penalty of being
            // behind is greater and the "recovery" is smaller.
            const dirtyAir = cfg.physicsModifiers.dirtyAirEffect;
            const trafficPenalty = 0.01 * dirtyAir * (0.5 + 1.5 * tOver);
            const overtakeChance = 0.1 * (1 - tOver); // easy overtake -> more attempts
            if (this._rand() < overtakeChance) {
                // successful overtake: bonus proportional to slipstreamEffect (NASCAR >> F1)
                const slip = cfg.physicsModifiers.slipstreamEffect || 1.0;
                lapTime *= (1 - 0.005 * slip);
            } else {
                lapTime *= (1 + trafficPenalty);
            }
        }
        // contact tolerance: durable tyres (NASCAR) = frequent contact
        if (cfg.physicsModifiers.contactTolerance > 0.15 && this._rand() < 0.05) {
            lapTime *= (1 - 0.005 * cfg.physicsModifiers.contactTolerance); // contact push
        }
        return lapTime;
    }

    // tyre wear per lap (depends on category rules + driver style)
    _tyreWearPerLap(cfg, entrant) {
        const base = 0.012; // ~1.2% per lap in neutral conditions
        const mgmt = this._stat(entrant.driver, "fuelTyreMgmt"); // conservative reduces wear
        return base * (1.4 - mgmt) * cfg.tyreRules.degradationCurve / 1.5;
    }

    // estimate of the number of laps: if the track is available use its real length
    _estimateLaps(cfg, track) {
        if (cfg.eventStructure.raceDistanceKm <= 0) return 50;
        if (track && track.lengthKm > 0) {
            return Math.max(5, Math.round(cfg.eventStructure.raceDistanceKm / track.lengthKm));
        }
        // fallback: hypothetical average lap length per family
        const lapLen = { OpenWheel:5, Bike:4.5, Endurance:13, Rally:25, Raid:200 }[cfg.family] || 5;
        return Math.max(10, Math.round(cfg.eventStructure.raceDistanceKm / lapLen));
    }

    // base lap time: track-aware. If the track has lapRecordSec, use it;
    // otherwise fallback per family.
    _baseLapTimeMs(cfg, track) {
        if (track && track.lapRecordSec > 0) {
            return track.lapRecordSec * 1000; // seconds -> ms
        }
        // fallback per family (legacy factors)
        const familyFactor = {
            OpenWheel: 95, Bike: 110, Endurance: 220, Rally: 600, Raid: 1800,
        };
        const factor = familyFactor[cfg.family] || 110;
        return factor * 1000;
    }

    // duration in minutes of an endurance race (WEC 6h/24h, derived from distance)
    _enduranceMinutes(cfg) {
        if (cfg.eventStructure.raceDistanceKm >= 4000) return 24 * 60; // Le Mans 24h
        if (cfg.eventStructure.raceDistanceKm >= 2000) return 8 * 60;
        return 6 * 60;
    }

    // base time of a special stage (SS) rally/raid: track-aware.
    _stageTimeMs(cfg, surface, entrant, track) {
        const grip = (cfg.surfaceRules.gripTable[surface] || 0.8);
        // If the track exists, use its reference time to calculate
        // the time of an SS of track.lengthKm length, then scale with progress.
        let base;
        if (track && track.lapRecordSec > 0) {
            base = track.lapRecordSec * 1000;
        } else {
            base = this._baseLapTimeMs(cfg, null);
        }
        // low grip = higher time
        return base / (0.7 + 0.3 * grip) / Math.max(0.5, entrant.rawPace);
    }

    // time formatting: h:mm:ss.mmm for endurance races (>60min), mm:ss.mmm otherwise
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
 * Ready-to-use singleton instance (UI consumes it as window.engine).
 * ========================================================================== */
const engine = new RaceCalculator();

if (typeof window !== "undefined") {
    window.RaceCalculator = RaceCalculator;
    window.engine = engine;
}
if (typeof module !== "undefined" && module.exports) {
    module.exports = { RaceCalculator, engine };
}