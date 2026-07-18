/* =============================================================================
 * ULTIMATE MOTORSPORT MANAGER
 * File: data/categoryConfigs.js
 * -----------------------------------------------------------------------------
 * DATA-DRIVEN CATEGORY SCHEMA (Encyclopedia of Game Paradigms)
 *
 * THE GOLDEN RULE: the engine (coreSimulation.js) NEVER contains logic like
 * "if it's F1 do this". Every difference between championships is expressed here
 * as a FLAG, MULTIPLIER or configurable RULE. The Game Engine reads these values
 * and behaves accordingly, remaining "dumb" and totally generic.
 *
 * The same `ChampionshipConfig` schema can describe future disciplines (NASCAR,
 * IndyCar, Formula E, Drift, Baja...) without touching a line of the engine.
 * ========================================================================== */

/* -----------------------------------------------------------------------------
 * 1) SCHEMA / FACTORY
 * Returns a normalized ChampionshipConfig object. Missing fields are filled
 * with safe defaults, so each championship defines ONLY what makes it unique
 * (declarative configuration).
 *
 * Main keys:
 *   id            -> unique key (used for lookup, saves, logo paths)
 *   name          -> localized label shown in UI
 *   family        -> macro-group ("OpenWheel","Bike","Endurance","Rally","Raid"...)
 *   raceType      -> the engine's main router:
 *                    "CircuitRace" | "EnduranceRace" | "StageRally" | "MarathonRaid"
 *                    (extensible in the future with "OvalRace","JudgeStyle","SprintOffroad")
 *   physicsModifiers -> multipliers that alter generic physics
 *   tyreRules     -> tyre rules (degradation, compound, blankets)
 *   driverRules   -> mandatory stints, stamina, rider weight
 *   surfaceRules  -> asphalt/dirt/snow + their impact (rally/raid)
 *   weatherRules  -> weather behavior and micro-localization
 *   scoringType   -> "Time" (normal) or "JudgeStyle" (Drift)
 *   features      -> map of ON/OFF FLAGS that enable/disable subsystems
 * ========================================================================== */
function ChampionshipConfig(cfg) {
    return Object.assign({
        // --- Identity ---
        id: "unknown",
        name: "Untitled Championship",
        family: "Generic",
        season: 2026,

        // --- Engine's main router ---
        raceType: "CircuitRace",

        // --- Generic physics (multipliers: 1.0 = neutral) ---
        physicsModifiers: {
            slipstreamEffect: 1.0,   // slipstream drag reduction (NASCAR/Indy >> 1)
            dirtyAirEffect:   1.0,   // performance degradation behind another car
            draftingPower:    1.0,   // contact drafting effectiveness
            drsBoost:         0.0,   // DRS percentage boost (0 = not applicable)
            contactTolerance: 0.0,   // 0..1: how much body-to-body contact is tolerated
            powerToWeight:    1.0,   // modifies net power delta between contenders
            suspensionStress: 1.0,   // suspension stress (Baja >> 1)
        },

        // --- Tyre rules ---
        tyreRules: {
            compounds:        ["medium"],   // made available
            degradationCurve: 1.0,          // degradation severity multiplier (F1 >> 1)
            blanketAllowed:   true,         // tyre blankets allowed?
            blanketEffect:    1.0,          // performance bonus at start with blanket
            pitLossSeconds:   22,           // time lost in a normal pit stop
            suddenFailureProb:0.0,          // probability of instant failure (Baja/contact)
        },

        // --- Driver rules / stamina ---
        driverRules: {
            stintRequired:    false,        // WEC/IMSA: true (mandatory driver stints)
            minStintMinutes:  0,            // minimum stint duration by regulation
            staminaDrainRate: 1.0,          // stamina drop rate during driving turns
            riderWeightImpact:1.0,          // Moto: rider weight impacts a lot
            crashRiskFactor:  1.0,          // Moto/Baja: crash risk linked to aggressiveness
            nightPenalty:     1.0,          // performance drop at night (Endurance)
        },

        // --- Surfaces (rally / raid / offroad) ---
        surfaceRules: {
            available: ["asphalt"],         // surfaces featured in the championship
            gripTable: {                    // relative grip per surface (1.0 = dry asphalt)
                asphalt: 1.0, gravel: 0.78, snow: 0.60, sand: 0.55, ice: 0.45, dirt: 0.72
            },
            surfaceSwitchTime: 1.0,         // penalty when changing surface (mixed rally)
        },

        // --- Weather & track evolution ---
        weatherRules: {
            localizedPossible: false,       // WRC/Dakar: rain may occur only on part of the course
            rubberingFactor:   1.0,         // lap time improvement from rubber deposit
            marblesFactor:     1.0,         // dead rubber off the racing line
            wetGripMultiplier: 0.65,        // grip on wet compared to dry
        },

        // --- Scoring ---
        scoringType: "Time",                // "Time" or "JudgeStyle" (Drift)

        // --- SUBSYSTEM ACTIVATION FLAGS (heart of data-drivenness) ---
        // The engine iterates these flags: if true it runs the related module.
        features: {
            traffic:          true,   // manages traffic between contenders (CircuitRace/Endurance)
            tyreWear:         true,   // applies tyre degradation
            fuelOrEnergy:     false,  // manages energy/fuel (FE/F1-endurance)
            driverStints:     false,  // manages driver turns and stamina (Endurance)
            dayNightCycle:    false,  // day/night cycle (Endurance)
            multiClassTraffic:false,  // traffic between different classes with double classification
            stageSequence:    false,  // sequential special stages (Rally)
            cumulativeDamage: false,  // damage that accumulates between stages (Rally/Raid)
            navigation:       false,  // navigation errors + waypoints (Raid/Dakar)
            overnightRepair:  false,  // overnight repairs with time/parts (Raid)
            judging:          false,  // judge-style scoring (Drift)
            pointSystem:      "f1",   // point system key (defined in scoringTables)
        },

        // --- Event structure ---
        eventStructure: {
            sessions: ["practice","qualifying","race"],  // standard sessions
            raceDistanceKm: 305,        // or nr. of stages for rally/raid
            stages: 0,                  // special stages (rally/raid)
            days: 1,                    // event days (Endurance/Raid)
        },
    }, cfg);
}

/* -----------------------------------------------------------------------------
 * 2) POINT SYSTEM POOL (defined once, reusable)
 * Each championship references its own via features.pointSystem.
 * ========================================================================== */
const SCORING_TABLES = {
    f1:        [25,18,15,12,10,8,6,4,2,1],         // top10 + 1 pt fastest lap (handled separately)
    moto:      [25,20,16,13,11,10,9,8,7,6,5,4,3,2,1], // top15 MotoGP
    wec:       [25,18,15,12,10,8,6,4,2,1],         // per class
    rally:     [30,24,21,19,17,15,13,11,9,7,5,4,3,2,1], // WRC power-stage excluded
    dakar:     [0,0,0,0,0], // Dakar: time classification, points not used (placeholder)
    touring:   [25,18,15,12,10,8,6,4,2,1],         // WTCR / Stock Car
    rallycross:[30,24,21,19,17,15,13,11,9,7,5,4,3,2,1], // WRX with semifinals
    speedway:  [20,16,14,12,11,10,9,8,7,6,5,4,3,2,1], // Speedway GP
    truck:     [20,15,12,10,8,6,4,3,2,1],          // ETRC
    karting:   [25,20,16,13,11,10,9,8,7,6,5,4,3,2,1], // Karting
    motocross: [25,22,20,18,16,15,14,13,12,11,10,9,8,7,6,5,4,3,2,1], // MXGP top20
    superbike: [25,21,18,16,15,13,12,11,10,9,8,7,6,5,4,3,2,1], // WSBK top18
    gt:        [25,18,15,12,10,8,6,4,2,1],         // GT sprint
    drag:      [0,0,0,0,0],                        // Drag: pure time classification
    hillclimb: [0,0,0,0,0],                        // Hill Climb: pure time
    trial:     [0,0,0,0,0],                        // Trial: point penalties (lower better)
    junior:    [25,18,15,12,10,8,6,4,2,1],         // Junior series (F4, Regional, Moto Junior)
};

/* =============================================================================
 * 3) THE 5 "PROOF OF CONCEPT" CHAMPIONSHIPS
 * Each demonstrates a different paradigm using the SAME generic schema.
 * ========================================================================== */

/* --- F1 — "Open Wheel" Paradigm ----------------------------------------- */
const F1 = ChampionshipConfig({
    id: "f1",
    name: "Formula 1 World Championship",
    family: "OpenWheel",
    season: 2026,
    raceType: "CircuitRace",
    physicsModifiers: {
        slipstreamEffect: 1.2,
        dirtyAirEffect:   1.3,    // following closely destroys tyres and aero
        drsBoost:         0.18,   // +18% speed with DRS open in the zone
        contactTolerance: 0.05,   // contact almost always fatal for the front wing
        powerToWeight:    1.0,
    },
    tyreRules: {
        compounds: ["soft","medium","hard"],
        degradationCurve: 1.8,    // SEVERE degradation
        blanketAllowed:   true,
        blanketEffect:    1.05,
        pitLossSeconds:   22,
        suddenFailureProb:0.005,
    },
    driverRules: {
        stintRequired:false, riderWeightImpact:1.0, crashRiskFactor:0.3,
    },
    weatherRules: { rubberingFactor:1.3, marblesFactor:1.2, wetGripMultiplier:0.62 },
    features: {
        traffic:true, tyreWear:true, fuelOrEnergy:false, driverStints:false,
        pointSystem:"f1",
    },
    eventStructure: { sessions:["practice","qualifying","race"], raceDistanceKm:305, stages:0, days:1 },
});

/* --- F2 — "Open Wheel Junior" Paradigm -------------------------------- */
const F2 = ChampionshipConfig({
    id: "f2",
    name: "Formula 2 Championship",
    family: "OpenWheel",
    season: 2026,
    raceType: "CircuitRace",
    physicsModifiers: {
        slipstreamEffect: 1.1,
        dirtyAirEffect:   1.1,
        drsBoost:         0.10,   // DRS less powerful than in F1
        contactTolerance: 0.1,
        powerToWeight:    0.8,
    },
    tyreRules: {
        compounds: ["soft","medium","hard"],
        degradationCurve: 1.4,    // DRS tyres degrade a lot in F2
        blanketAllowed:   true,
        blanketEffect:    1.0,
        pitLossSeconds:   26,
        suddenFailureProb:0.01,
    },
    driverRules: {
        stintRequired:false, riderWeightImpact:1.0, crashRiskFactor:0.6, // More rookie mistakes
    },
    weatherRules: { rubberingFactor:1.2, marblesFactor:1.0, wetGripMultiplier:0.65 },
    features: {
        traffic:true, tyreWear:true, fuelOrEnergy:false, driverStints:false,
        pointSystem:"f1", // Same F1 point system for simplicity
    },
    eventStructure: { sessions:["practice","qualifying","race"], raceDistanceKm:170, stages:0, days:1 },
});

/* --- F3 — "Open Wheel Junior Entry" Paradigm ------------------------- */
const F3 = ChampionshipConfig({
    id: "f3",
    name: "FIA Formula 3 Championship",
    family: "OpenWheel",
    season: 2026,
    raceType: "CircuitRace",
    physicsModifiers: {
        slipstreamEffect: 1.0, dirtyAirEffect: 1.0, drsBoost: 0.0, 
        contactTolerance: 0.15, powerToWeight: 0.6,
    },
    tyreRules: {
        compounds: ["medium"], degradationCurve: 1.1, blanketAllowed: false, 
        pitLossSeconds: 30, suddenFailureProb: 0.01,
    },
    driverRules: { stintRequired:false, crashRiskFactor: 0.8 }, // Many incidents among rookies
    weatherRules: { rubberingFactor:1.0, marblesFactor:0.8, wetGripMultiplier: 0.6 },
    features: { traffic:true, tyreWear:true, fuelOrEnergy:false, pointSystem:"f1" },
    eventStructure: { sessions:["practice","qualifying","race"], raceDistanceKm:100, stages:0, days:1 },
});

/* --- FORMULA E — "Electric Energy Mgmt" Paradigm -------------------- */
const FE = ChampionshipConfig({
    id: "fe",
    name: "FIA Formula E World Championship",
    family: "OpenWheel",
    season: 2026,
    raceType: "CircuitRace",
    physicsModifiers: {
        slipstreamEffect: 0.8, dirtyAirEffect: 0.5, drsBoost: 0.0, 
        contactTolerance: 0.2, powerToWeight: 0.7,
    },
    tyreRules: {
        compounds: ["medium"], degradationCurve: 0.5, blanketAllowed: false, 
        pitLossSeconds: 0, suddenFailureProb: 0.0, // No pit stop, they use Attack Charge
    },
    driverRules: { stintRequired:false, crashRiskFactor: 0.5 },
    weatherRules: { rubberingFactor:0.5, marblesFactor:0.0, wetGripMultiplier: 0.5 }, 
    features: { traffic:true, tyreWear:true, fuelOrEnergy: true, pointSystem:"f1" }, // Battery management active!
    eventStructure: { sessions:["practice","qualifying","race"], raceDistanceKm:100, stages:0, days:1 },
});

/* --- MOTO 2 — "Bike Intermediate" Paradigm -------------------------- */
const MOTO2 = ChampionshipConfig({
    id: "moto2",
    name: "Moto2 World Championship",
    family: "Bike",
    season: 2026,
    raceType: "CircuitRace",
    physicsModifiers: {
        slipstreamEffect: 1.2, dirtyAirEffect: 0.7, drsBoost: 0.0, 
        contactTolerance: 0.2, powerToWeight: 0.9,
    },
    tyreRules: {
        compounds: ["medium","hard"], degradationCurve: 1.0, blanketAllowed: false, 
        pitLossSeconds: 30, suddenFailureProb: 0.01,
    },
    driverRules: { stintRequired:false, riderWeightImpact:1.2, crashRiskFactor: 1.3 },
    weatherRules: { rubberingFactor:1.0, marblesFactor:0.5, wetGripMultiplier: 0.65 },
    features: { traffic:true, tyreWear:true, pointSystem:"moto" },
    eventStructure: { sessions:["practice","qualifying","race"], raceDistanceKm:110, stages:0, days:1 },
});

/* --- MOTO 3 — "Bike Entry" Paradigm ---------------------------------- */
const MOTO3 = ChampionshipConfig({
    id: "moto3",
    name: "Moto3 World Championship",
    family: "Bike",
    season: 2026,
    raceType: "CircuitRace",
    physicsModifiers: {
        slipstreamEffect: 1.6, dirtyAirEffect: 0.4, drsBoost: 0.0, 
        contactTolerance: 0.3, powerToWeight: 0.7,
    },
    tyreRules: {
        compounds: ["soft","medium"], degradationCurve: 0.8, blanketAllowed: false, 
        pitLossSeconds: 30, suddenFailureProb: 0.02,
    },
    driverRules: { stintRequired:false, riderWeightImpact:1.5, crashRiskFactor: 1.8 }, // Many crashes
    weatherRules: { rubberingFactor:0.8, marblesFactor:0.2, wetGripMultiplier: 0.6 },
    features: { traffic:true, tyreWear:true, pointSystem:"moto" },
    eventStructure: { sessions:["practice","qualifying","race"], raceDistanceKm:95, stages:0, days:1 },
});

/* --- MOTOGP — "Bike" Paradigm ------------------------------------------- */
const MOTOGP = ChampionshipConfig({
    id: "motogp",
    name: "MotoGP World Championship",
    family: "Bike",
    season: 2026,
    raceType: "CircuitRace",
    physicsModifiers: {
        slipstreamEffect: 1.4,    // slipstream in moto is huge
        dirtyAirEffect:   0.8,    // less aero sensitivity than F1
        drsBoost:         0.0,
        contactTolerance: 0.2,    // frequent touches, rarely fatal
        powerToWeight:    1.15,   // net power delta between bikes
    },
    tyreRules: {
        compounds: ["soft","medium","hard"],
        degradationCurve: 1.2,
        blanketAllowed:   false,  // MotoGP: no blankets
        blanketEffect:    1.0,
        pitLossSeconds:   30,
        suddenFailureProb:0.01,
    },
    driverRules: {
        stintRequired:false,
        riderWeightImpact:1.4,    // rider weight is critical
        crashRiskFactor:  1.6,    // risky crashes linked to aggressiveness
    },
    weatherRules: { rubberingFactor:1.1, marblesFactor:0.6, wetGripMultiplier:0.7 },
    features: {
        traffic:true, tyreWear:true, pointSystem:"moto",
    },
    eventStructure: { sessions:["practice","qualifying","race"], raceDistanceKm:120, stages:0, days:1 },
});

/* --- WEC HYPERCAR — "Endurance" Paradigm ------------------------------- */
const WEC = ChampionshipConfig({
    id: "wec",
    name: "FIA WEC — Hypercar",
    family: "Endurance",
    season: 2026,
    raceType: "EnduranceRace",
    physicsModifiers: {
        slipstreamEffect: 1.1,
        dirtyAirEffect:   1.1,
        contactTolerance: 0.15,
        powerToWeight:    0.9,    // Hypercars are "free" but balanced by BoP
    },
    tyreRules: {
        compounds: ["soft","medium","hard"],
        degradationCurve: 0.9,    // tyres designed to last
        blanketAllowed:   true,
        blanketEffect:    1.03,
        pitLossSeconds:   45,     // longer pit stops (refueling + 3 drivers)
        suddenFailureProb:0.008,
    },
    driverRules: {
        stintRequired:    true,   // MANDATORY DRIVING TURN
        minStintMinutes:  60,
        staminaDrainRate: 1.0,
        riderWeightImpact:1.0,
        crashRiskFactor:  0.4,
        nightPenalty:     1.15,   // performance drops at night
    },
    weatherRules: { localizedPossible:false, rubberingFactor:1.0, marblesFactor:0.9, wetGripMultiplier:0.68 },
    features: {
        traffic:true, tyreWear:true, driverStints:true, dayNightCycle:true,
        multiClassTraffic:true,     // LMP2/GT among the Hypercars
        pointSystem:"wec",
    },
    eventStructure: { sessions:["practice","qualifying","race"], raceDistanceKm:5100, stages:0, days:1 },
});

/* --- WRC — "Stage Rally" Paradigm -------------------------------------- */
const WRC = ChampionshipConfig({
    id: "wrc",
    name: "FIA World Rally Championship",
    family: "Rally",
    season: 2026,
    raceType: "StageRally",
    physicsModifiers: {
        slipstreamEffect: 0.0,    // raced ALONE against the clock
        dirtyAirEffect:   0.0,
        contactTolerance: 0.0,
        powerToWeight:    1.0,
        suspensionStress: 1.5,     // jumps and bumps on dirt
    },
    tyreRules: {
        compounds: ["soft","medium","hard","wet","snow"],
        degradationCurve: 1.0,
        blanketAllowed:   false,
        blanketEffect:    1.0,
        pitLossSeconds:   0,       // tyres changed in parc fermé / between SS
        suddenFailureProb:0.01,
    },
    driverRules: {
        stintRequired:false, riderWeightImpact:1.0, crashRiskFactor:0.8,
    },
    surfaceRules: {
        available: ["asphalt","gravel","snow"],
        gripTable: { asphalt:1.0, gravel:0.78, snow:0.60, dirt:0.72 },
        surfaceSwitchTime: 1.1,    // slowdown on mixed surfaces
    },
    weatherRules: {
        localizedPossible: true,  // rain may occur only on HALF of the special stage
        rubberingFactor:   0.2,   // no rubbering in rally
        marblesFactor:     0.0,
        wetGripMultiplier: 0.6,
    },
    features: {
        traffic:false, tyreWear:true, stageSequence:true, cumulativeDamage:true,
        pointSystem:"rally",
    },
    eventStructure: {
        sessions:["shakedown","stages"], raceDistanceKm:300, stages:18, days:4,
    },
});

/* --- DAKAR — "Marathon Raid" Paradigm ---------------------------------- */
const DAKAR = ChampionshipConfig({
    id: "dakar",
    name: "Dakar Rally",
    family: "Raid",
    season: 2026,
    raceType: "MarathonRaid",
    physicsModifiers: {
        slipstreamEffect: 0.3,    // little slipstream on dunes/offroad
        dirtyAirEffect:   0.0,
        contactTolerance: 0.0,
        powerToWeight:    1.0,
        suspensionStress: 2.2,    // whoops, bumps, continuous jumps
    },
    tyreRules: {
        compounds: ["allterrain"],
        degradationCurve: 1.1,
        blanketAllowed:   false,
        blanketEffect:    1.0,
        pitLossSeconds:   0,
        suddenFailureProb:0.03,   // frequent INSTANT mechanical failure
    },
    driverRules: {
        stintRequired:false, riderWeightImpact:1.0, crashRiskFactor:1.0,
        staminaDrainRate:1.4,     // stages of hundreds of km, grueling
    },
    surfaceRules: {
        available: ["sand","gravel","dirt"],
        gripTable: { sand:0.55, gravel:0.78, dirt:0.72 },
        surfaceSwitchTime: 1.0,
    },
    weatherRules: {
        localizedPossible: true,  // localized sandstorms
        rubberingFactor:   0.0,
        marblesFactor:     0.0,
        wetGripMultiplier: 0.5,
    },
    features: {
        traffic:false, tyreWear:true, stageSequence:true, cumulativeDamage:true,
        navigation:true,           // hidden waypoints: navigation error = huge penalty
        overnightRepair:true,      // overnight repair with limited time/parts
        pointSystem:"dakar",       // pure time classification
    },
    eventStructure: {
        sessions:["stages"], raceDistanceKm:8000, stages:12, days:14,
    },
});

/* =============================================================================
 * 5) ADDITIONAL CHAMPIONSHIPS — All global motorsport disciplines
 * ========================================================================== */

/* --- FORMULA 4 — Open Wheel Entry-Level --------------------------------- */
const F4 = ChampionshipConfig({
    id: "f4", name: "FIA Formula 4 Championship", family: "OpenWheel", season: 2026, raceType: "CircuitRace",
    physicsModifiers: { slipstreamEffect:0.9, dirtyAirEffect:0.8, drsBoost:0.0, contactTolerance:0.2, powerToWeight:0.5 },
    tyreRules: { compounds:["medium"], degradationCurve:0.8, blanketAllowed:false, pitLossSeconds:30, suddenFailureProb:0.015 },
    driverRules: { stintRequired:false, crashRiskFactor:1.0 }, // Many rookies, many mistakes
    weatherRules: { rubberingFactor:0.8, marblesFactor:0.5, wetGripMultiplier:0.6 },
    features: { traffic:true, tyreWear:true, pointSystem:"junior" },
    eventStructure: { sessions:["practice","qualifying","race"], raceDistanceKm:80, stages:0, days:1 },
});

/* --- FORMULA REGIONAL — Open Wheel Junior Step -------------------------- */
const FREGIONAL = ChampionshipConfig({
    id: "fregional", name: "Formula Regional European Championship", family: "OpenWheel", season: 2026, raceType: "CircuitRace",
    physicsModifiers: { slipstreamEffect:1.0, dirtyAirEffect:0.9, drsBoost:0.0, contactTolerance:0.18, powerToWeight:0.55 },
    tyreRules: { compounds:["medium","hard"], degradationCurve:0.9, blanketAllowed:false, pitLossSeconds:28, suddenFailureProb:0.01 },
    driverRules: { stintRequired:false, crashRiskFactor:0.9 },
    weatherRules: { rubberingFactor:0.9, marblesFactor:0.6, wetGripMultiplier:0.62 },
    features: { traffic:true, tyreWear:true, pointSystem:"junior" },
    eventStructure: { sessions:["practice","qualifying","race"], raceDistanceKm:90, stages:0, days:1 },
});

/* --- EUROPEAN LE MANS SERIES (ELMS) — Endurance Sprint ------------------ */
const ELMS = ChampionshipConfig({
    id: "elms", name: "European Le Mans Series", family: "Endurance", season: 2026, raceType: "EnduranceRace",
    physicsModifiers: { slipstreamEffect:1.1, dirtyAirEffect:1.0, contactTolerance:0.15, powerToWeight:0.85 },
    tyreRules: { compounds:["soft","medium","hard"], degradationCurve:0.9, blanketAllowed:true, blanketEffect:1.02, pitLossSeconds:40, suddenFailureProb:0.01 },
    driverRules: { stintRequired:true, minStintMinutes:45, staminaDrainRate:1.0, crashRiskFactor:0.5, nightPenalty:1.1 },
    weatherRules: { localizedPossible:false, rubberingFactor:1.0, marblesFactor:0.8, wetGripMultiplier:0.66 },
    features: { traffic:true, tyreWear:true, driverStints:true, dayNightCycle:true, multiClassTraffic:true, pointSystem:"wec" },
    eventStructure: { sessions:["practice","qualifying","race"], raceDistanceKm:1600, stages:0, days:1 }, // ~4h races
});

/* --- IMSA — American Endurance ---------------------------------------- */
const IMSA = ChampionshipConfig({
    id: "imsa", name: "IMSA WeatherTech Sportscar Championship", family: "Endurance", season: 2026, raceType: "EnduranceRace",
    physicsModifiers: { slipstreamEffect:1.15, dirtyAirEffect:1.0, contactTolerance:0.2, powerToWeight:0.88 },
    tyreRules: { compounds:["soft","medium","hard"], degradationCurve:0.95, blanketAllowed:true, blanketEffect:1.03, pitLossSeconds:38, suddenFailureProb:0.01 },
    driverRules: { stintRequired:true, minStintMinutes:40, staminaDrainRate:1.0, crashRiskFactor:0.45, nightPenalty:1.12 },
    weatherRules: { localizedPossible:false, rubberingFactor:1.0, marblesFactor:0.85, wetGripMultiplier:0.67 },
    features: { traffic:true, tyreWear:true, driverStints:true, dayNightCycle:true, multiClassTraffic:true, pointSystem:"wec" },
    eventStructure: { sessions:["practice","qualifying","race"], raceDistanceKm:2400, stages:0, days:1 }, // ~6-24h
});

/* --- GT WORLD CHALLENGE — GT Sprint/Endurance -------------------------- */
const GTWC = ChampionshipConfig({
    id: "gtwc", name: "GT World Challenge Europe", family: "GT", season: 2026, raceType: "CircuitRace",
    physicsModifiers: { slipstreamEffect:1.0, dirtyAirEffect:1.0, contactTolerance:0.25, powerToWeight:0.8 },
    tyreRules: { compounds:["soft","medium","hard"], degradationCurve:1.0, blanketAllowed:true, blanketEffect:1.02, pitLossSeconds:35, suddenFailureProb:0.008 },
    driverRules: { stintRequired:true, minStintMinutes:30, staminaDrainRate:0.8, crashRiskFactor:0.5 },
    weatherRules: { rubberingFactor:1.0, marblesFactor:0.7, wetGripMultiplier:0.65 },
    features: { traffic:true, tyreWear:true, driverStints:true, multiClassTraffic:true, pointSystem:"gt" },
    eventStructure: { sessions:["practice","qualifying","race"], raceDistanceKm:600, stages:0, days:1 }, // Sprint + endurance
});

/* --- GT OPEN — International GT Open ----------------------------------- */
const GTOPEN = ChampionshipConfig({
    id: "gtopen", name: "International GT Open", family: "GT", season: 2026, raceType: "CircuitRace",
    physicsModifiers: { slipstreamEffect:1.0, dirtyAirEffect:1.0, contactTolerance:0.22, powerToWeight:0.82 },
    tyreRules: { compounds:["medium","hard"], degradationCurve:0.9, blanketAllowed:true, blanketEffect:1.02, pitLossSeconds:32, suddenFailureProb:0.008 },
    driverRules: { stintRequired:true, minStintMinutes:25, staminaDrainRate:0.8, crashRiskFactor:0.5 },
    weatherRules: { rubberingFactor:1.0, marblesFactor:0.7, wetGripMultiplier:0.65 },
    features: { traffic:true, tyreWear:true, driverStints:true, pointSystem:"gt" },
    eventStructure: { sessions:["practice","qualifying","race"], raceDistanceKm:300, stages:0, days:1 },
});

/* --- GT2 EUROPEAN SERIES ----------------------------------------------- */
const GT2 = ChampionshipConfig({
    id: "gt2", name: "GT2 European Series", family: "GT", season: 2026, raceType: "CircuitRace",
    physicsModifiers: { slipstreamEffect:1.0, dirtyAirEffect:1.0, contactTolerance:0.25, powerToWeight:0.85 },
    tyreRules: { compounds:["medium","hard"], degradationCurve:0.85, blanketAllowed:true, blanketEffect:1.02, pitLossSeconds:30, suddenFailureProb:0.008 },
    driverRules: { stintRequired:true, minStintMinutes:20, staminaDrainRate:0.7, crashRiskFactor:0.5 },
    weatherRules: { rubberingFactor:1.0, marblesFactor:0.7, wetGripMultiplier:0.65 },
    features: { traffic:true, tyreWear:true, driverStints:true, pointSystem:"gt" },
    eventStructure: { sessions:["practice","qualifying","race"], raceDistanceKm:250, stages:0, days:1 },
});

/* --- FERRARI CHALLENGE — One-Make GT ---------------------------------- */
const FERRARI_CHALLENGE = ChampionshipConfig({
    id: "ferrari_challenge", name: "Ferrari Challenge", family: "GT", season: 2026, raceType: "CircuitRace",
    physicsModifiers: { slipstreamEffect:1.0, dirtyAirEffect:1.0, contactTolerance:0.3, powerToWeight:0.8 },
    tyreRules: { compounds:["medium"], degradationCurve:0.8, blanketAllowed:true, blanketEffect:1.01, pitLossSeconds:30, suddenFailureProb:0.005 },
    driverRules: { stintRequired:false, crashRiskFactor:0.6 }, // Gentlemen drivers
    weatherRules: { rubberingFactor:1.0, marblesFactor:0.6, wetGripMultiplier:0.65 },
    features: { traffic:true, tyreWear:true, pointSystem:"gt" },
    eventStructure: { sessions:["practice","qualifying","race"], raceDistanceKm:200, stages:0, days:1 },
});

/* --- PORSCHE CARRERA CUP — One-Make GT -------------------------------- */
const PORSCHE_CUP = ChampionshipConfig({
    id: "porsche_cup", name: "Porsche Carrera Cup", family: "GT", season: 2026, raceType: "CircuitRace",
    physicsModifiers: { slipstreamEffect:1.0, dirtyAirEffect:1.0, contactTolerance:0.25, powerToWeight:0.82 },
    tyreRules: { compounds:["medium","hard"], degradationCurve:0.9, blanketAllowed:true, blanketEffect:1.01, pitLossSeconds:30, suddenFailureProb:0.006 },
    driverRules: { stintRequired:false, crashRiskFactor:0.7 },
    weatherRules: { rubberingFactor:1.0, marblesFactor:0.6, wetGripMultiplier:0.64 },
    features: { traffic:true, tyreWear:true, pointSystem:"gt" },
    eventStructure: { sessions:["practice","qualifying","race"], raceDistanceKm:180, stages:0, days:1 },
});

/* --- LAMBORGHINI SUPER TROFEO — One-Make GT ---------------------------- */
const LAMBORGHINI_TROFEO = ChampionshipConfig({
    id: "lamborghini_trofeo", name: "Lamborghini Super Trofeo", family: "GT", season: 2026, raceType: "CircuitRace",
    physicsModifiers: { slipstreamEffect:1.0, dirtyAirEffect:1.0, contactTolerance:0.28, powerToWeight:0.82 },
    tyreRules: { compounds:["medium"], degradationCurve:0.85, blanketAllowed:true, blanketEffect:1.01, pitLossSeconds:30, suddenFailureProb:0.006 },
    driverRules: { stintRequired:false, crashRiskFactor:0.7 },
    weatherRules: { rubberingFactor:1.0, marblesFactor:0.6, wetGripMultiplier:0.64 },
    features: { traffic:true, tyreWear:true, pointSystem:"gt" },
    eventStructure: { sessions:["practice","qualifying","race"], raceDistanceKm:180, stages:0, days:1 },
});

/* --- WORLD TOURING CAR CUP (WTCR) — Touring Car ------------------------ */
const WTCR = ChampionshipConfig({
    id: "wtcr", name: "World Touring Car Cup (WTCR)", family: "TouringCar", season: 2026, raceType: "CircuitRace",
    physicsModifiers: { slipstreamEffect:1.3, dirtyAirEffect:1.0, drsBoost:0.0, contactTolerance:0.6, powerToWeight:0.7 },
    // Touring cars: frequent and tolerated contact, lots of slipstream
    tyreRules: { compounds:["soft","medium","hard"], degradationCurve:1.0, blanketAllowed:true, blanketEffect:1.02, pitLossSeconds:25, suddenFailureProb:0.01 },
    driverRules: { stintRequired:false, crashRiskFactor:1.2 }, // Bump-and-run
    weatherRules: { rubberingFactor:1.0, marblesFactor:0.7, wetGripMultiplier:0.68 },
    features: { traffic:true, tyreWear:true, pointSystem:"touring" },
    eventStructure: { sessions:["practice","qualifying","race"], raceDistanceKm:150, stages:0, days:1 },
});

/* --- STOCK CAR CHAMPIONSHIPS — Brazilian Touring Car ------------------ */
const STOCK_CAR = ChampionshipConfig({
    id: "stock_car", name: "Stock Car Pro Series", family: "TouringCar", season: 2026, raceType: "CircuitRace",
    physicsModifiers: { slipstreamEffect:1.5, dirtyAirEffect:0.8, drsBoost:0.0, contactTolerance:0.7, powerToWeight:0.75 },
    tyreRules: { compounds:["soft","medium"], degradationCurve:1.1, blanketAllowed:true, blanketEffect:1.02, pitLossSeconds:28, suddenFailureProb:0.01 },
    driverRules: { stintRequired:false, crashRiskFactor:1.5 }, // Very physical races, heavy contact
    weatherRules: { rubberingFactor:1.1, marblesFactor:0.5, wetGripMultiplier:0.65 },
    features: { traffic:true, tyreWear:true, pointSystem:"touring" },
    eventStructure: { sessions:["practice","qualifying","race"], raceDistanceKm:200, stages:0, days:1 },
});

/* --- EUROPEAN RALLY CHAMPIONSHIP (ERC) — Stage Rally -------------------- */
const ERC = ChampionshipConfig({
    id: "erc", name: "FIA European Rally Championship", family: "Rally", season: 2026, raceType: "StageRally",
    physicsModifiers: { slipstreamEffect:0.0, dirtyAirEffect:0.0, contactTolerance:0.0, powerToWeight:0.9, suspensionStress:1.4 },
    tyreRules: { compounds:["soft","medium","hard","wet","snow"], degradationCurve:1.0, blanketAllowed:false, pitLossSeconds:0, suddenFailureProb:0.01 },
    driverRules: { stintRequired:false, crashRiskFactor:0.85 },
    surfaceRules: { available:["asphalt","gravel","snow"], gripTable:{asphalt:1.0,gravel:0.78,snow:0.60,dirt:0.72}, surfaceSwitchTime:1.1 },
    weatherRules: { localizedPossible:true, rubberingFactor:0.2, marblesFactor:0.0, wetGripMultiplier:0.6 },
    features: { traffic:false, tyreWear:true, stageSequence:true, cumulativeDamage:true, pointSystem:"rally" },
    eventStructure: { sessions:["shakedown","stages"], raceDistanceKm:220, stages:14, days:3 },
});

/* --- AFRICAN RALLY CHAMPIONSHIP (ARC) — Stage Rally -------------------- */
const ARC = ChampionshipConfig({
    id: "arc", name: "African Rally Championship", family: "Rally", season: 2026, raceType: "StageRally",
    physicsModifiers: { slipstreamEffect:0.0, dirtyAirEffect:0.0, contactTolerance:0.0, powerToWeight:0.85, suspensionStress:1.6 },
    tyreRules: { compounds:["soft","medium","hard","gravel"], degradationCurve:1.1, blanketAllowed:false, pitLossSeconds:0, suddenFailureProb:0.02 },
    driverRules: { stintRequired:false, crashRiskFactor:0.9, staminaDrainRate:1.2 },
    surfaceRules: { available:["gravel","dirt","sand"], gripTable:{gravel:0.78,dirt:0.72,sand:0.55}, surfaceSwitchTime:1.0 },
    weatherRules: { localizedPossible:true, rubberingFactor:0.15, marblesFactor:0.0, wetGripMultiplier:0.55 },
    features: { traffic:false, tyreWear:true, stageSequence:true, cumulativeDamage:true, pointSystem:"rally" },
    eventStructure: { sessions:["shakedown","stages"], raceDistanceKm:250, stages:12, days:3 },
});

/* --- ASIA PACIFIC RALLY CHAMPIONSHIP (APRC) — Stage Rally -------------- */
const APRC = ChampionshipConfig({
    id: "aprc", name: "Asia Pacific Rally Championship", family: "Rally", season: 2026, raceType: "StageRally",
    physicsModifiers: { slipstreamEffect:0.0, dirtyAirEffect:0.0, contactTolerance:0.0, powerToWeight:0.9, suspensionStress:1.4 },
    tyreRules: { compounds:["soft","medium","hard","wet"], degradationCurve:1.0, blanketAllowed:false, pitLossSeconds:0, suddenFailureProb:0.012 },
    driverRules: { stintRequired:false, crashRiskFactor:0.85 },
    surfaceRules: { available:["gravel","asphalt","dirt"], gripTable:{asphalt:1.0,gravel:0.78,dirt:0.72}, surfaceSwitchTime:1.05 },
    weatherRules: { localizedPossible:true, rubberingFactor:0.2, marblesFactor:0.0, wetGripMultiplier:0.6 },
    features: { traffic:false, tyreWear:true, stageSequence:true, cumulativeDamage:true, pointSystem:"rally" },
    eventStructure: { sessions:["shakedown","stages"], raceDistanceKm:230, stages:14, days:3 },
});

/* --- CODASUR — South American Rally -------------------------------------- */
const CODASUR = ChampionshipConfig({
    id: "codasur", name: "CODASUR Rally Championship", family: "Rally", season: 2026, raceType: "StageRally",
    physicsModifiers: { slipstreamEffect:0.0, dirtyAirEffect:0.0, contactTolerance:0.0, powerToWeight:0.88, suspensionStress:1.5 },
    tyreRules: { compounds:["soft","medium","hard","gravel"], degradationCurve:1.0, blanketAllowed:false, pitLossSeconds:0, suddenFailureProb:0.012 },
    driverRules: { stintRequired:false, crashRiskFactor:0.88 },
    surfaceRules: { available:["gravel","asphalt","dirt"], gripTable:{asphalt:1.0,gravel:0.78,dirt:0.72}, surfaceSwitchTime:1.05 },
    weatherRules: { localizedPossible:true, rubberingFactor:0.2, marblesFactor:0.0, wetGripMultiplier:0.6 },
    features: { traffic:false, tyreWear:true, stageSequence:true, cumulativeDamage:true, pointSystem:"rally" },
    eventStructure: { sessions:["shakedown","stages"], raceDistanceKm:200, stages:12, days:3 },
});

/* --- MIDDLE EAST RALLY CHAMPIONSHIP (MERC) — Stage Rally --------------- */
const MERC = ChampionshipConfig({
    id: "merc", name: "Middle East Rally Championship", family: "Rally", season: 2026, raceType: "StageRally",
    physicsModifiers: { slipstreamEffect:0.0, dirtyAirEffect:0.0, contactTolerance:0.0, powerToWeight:0.9, suspensionStress:1.4 },
    tyreRules: { compounds:["medium","hard","gravel"], degradationCurve:1.0, blanketAllowed:false, pitLossSeconds:0, suddenFailureProb:0.012 },
    driverRules: { stintRequired:false, crashRiskFactor:0.85 },
    surfaceRules: { available:["gravel","sand","asphalt"], gripTable:{asphalt:1.0,gravel:0.78,sand:0.55}, surfaceSwitchTime:1.05 },
    weatherRules: { localizedPossible:true, rubberingFactor:0.2, marblesFactor:0.0, wetGripMultiplier:0.55 },
    features: { traffic:false, tyreWear:true, stageSequence:true, cumulativeDamage:true, pointSystem:"rally" },
    eventStructure: { sessions:["shakedown","stages"], raceDistanceKm:200, stages:12, days:3 },
});

/* --- NACAM RALLY CHAMPIONSHIP — Central/North American Rally -------------- */
const NACAM = ChampionshipConfig({
    id: "nacam", name: "NACAM Rally Championship", family: "Rally", season: 2026, raceType: "StageRally",
    physicsModifiers: { slipstreamEffect:0.0, dirtyAirEffect:0.0, contactTolerance:0.0, powerToWeight:0.88, suspensionStress:1.4 },
    tyreRules: { compounds:["soft","medium","hard","gravel"], degradationCurve:1.0, blanketAllowed:false, pitLossSeconds:0, suddenFailureProb:0.012 },
    driverRules: { stintRequired:false, crashRiskFactor:0.85 },
    surfaceRules: { available:["gravel","asphalt","dirt"], gripTable:{asphalt:1.0,gravel:0.78,dirt:0.72}, surfaceSwitchTime:1.05 },
    weatherRules: { localizedPossible:true, rubberingFactor:0.2, marblesFactor:0.0, wetGripMultiplier:0.6 },
    features: { traffic:false, tyreWear:true, stageSequence:true, cumulativeDamage:true, pointSystem:"rally" },
    eventStructure: { sessions:["shakedown","stages"], raceDistanceKm:200, stages:12, days:3 },
});

/* --- RALLY CUP REGIONAL — Amateur Rally ----------------------------- */
const RALLY_CUP = ChampionshipConfig({
    id: "rally_cup", name: "Rally Cup Regional", family: "Rally", season: 2026, raceType: "StageRally",
    physicsModifiers: { slipstreamEffect:0.0, dirtyAirEffect:0.0, contactTolerance:0.0, powerToWeight:0.8, suspensionStress:1.3 },
    tyreRules: { compounds:["medium","gravel"], degradationCurve:0.9, blanketAllowed:false, pitLossSeconds:0, suddenFailureProb:0.01 },
    driverRules: { stintRequired:false, crashRiskFactor:0.9 },
    surfaceRules: { available:["asphalt","gravel","dirt"], gripTable:{asphalt:1.0,gravel:0.78,dirt:0.72}, surfaceSwitchTime:1.05 },
    weatherRules: { localizedPossible:true, rubberingFactor:0.2, marblesFactor:0.0, wetGripMultiplier:0.6 },
    features: { traffic:false, tyreWear:true, stageSequence:true, cumulativeDamage:true, pointSystem:"rally" },
    eventStructure: { sessions:["shakedown","stages"], raceDistanceKm:150, stages:8, days:2 },
});

/* --- WORLD RALLYCROSS CHAMPIONSHIP (WRX) — Rallycross ------------------ */
const WRX = ChampionshipConfig({
    id: "wrx", name: "FIA World Rallycross Championship", family: "Rallycross", season: 2026, raceType: "CircuitRace",
    physicsModifiers: { slipstreamEffect:0.8, dirtyAirEffect:0.5, drsBoost:0.0, contactTolerance:0.8, powerToWeight:1.2, suspensionStress:1.8 },
    // Rallycross: short mixed asphalt+dirt circuits, rolling start, heavy contact, joker lap
    tyreRules: { compounds:["medium","gravel"], degradationCurve:0.7, blanketAllowed:false, pitLossSeconds:0, suddenFailureProb:0.015 },
    driverRules: { stintRequired:false, crashRiskFactor:2.0 }, // Extreme contact, chaotic starts
    surfaceRules: { available:["asphalt","gravel","dirt"], gripTable:{asphalt:1.0,gravel:0.78,dirt:0.72}, surfaceSwitchTime:0.95 },
    weatherRules: { rubberingFactor:0.5, marblesFactor:0.0, wetGripMultiplier:0.65 },
    features: { traffic:true, tyreWear:true, pointSystem:"rallycross" },
    eventStructure: { sessions:["practice","qualifying","race"], raceDistanceKm:8, stages:0, days:1 }, // Very short races ~5 laps
});

/* --- AUTOCROSS CHAMPIONSHIPS — Offroad Sprint -------------------------- */
const AUTOCROSS = ChampionshipConfig({
    id: "autocross", name: "Autocross Championships", family: "Rallycross", season: 2026, raceType: "CircuitRace",
    physicsModifiers: { slipstreamEffect:0.5, dirtyAirEffect:0.3, drsBoost:0.0, contactTolerance:0.5, powerToWeight:1.0, suspensionStress:1.7 },
    tyreRules: { compounds:["gravel"], degradationCurve:0.6, blanketAllowed:false, pitLossSeconds:0, suddenFailureProb:0.01 },
    driverRules: { stintRequired:false, crashRiskFactor:1.5 },
    surfaceRules: { available:["gravel","dirt"], gripTable:{gravel:0.78,dirt:0.72}, surfaceSwitchTime:1.0 },
    weatherRules: { rubberingFactor:0.2, marblesFactor:0.0, wetGripMultiplier:0.6 },
    features: { traffic:true, tyreWear:true, pointSystem:"rallycross" },
    eventStructure: { sessions:["practice","qualifying","race"], raceDistanceKm:5, stages:0, days:1 },
});

/* --- WORLD RALLY-RAID CHAMPIONSHIP (W2RC) — Marathon Raid -------------- */
const W2RC = ChampionshipConfig({
    id: "w2rc", name: "FIA World Rally-Raid Championship", family: "Raid", season: 2026, raceType: "MarathonRaid",
    physicsModifiers: { slipstreamEffect:0.3, dirtyAirEffect:0.0, contactTolerance:0.0, powerToWeight:1.0, suspensionStress:2.0 },
    tyreRules: { compounds:["allterrain"], degradationCurve:1.1, blanketAllowed:false, pitLossSeconds:0, suddenFailureProb:0.025 },
    driverRules: { stintRequired:false, crashRiskFactor:1.0, staminaDrainRate:1.3 },
    surfaceRules: { available:["sand","gravel","dirt"], gripTable:{sand:0.55,gravel:0.78,dirt:0.72}, surfaceSwitchTime:1.0 },
    weatherRules: { localizedPossible:true, rubberingFactor:0.0, marblesFactor:0.0, wetGripMultiplier:0.5 },
    features: { traffic:false, tyreWear:true, stageSequence:true, cumulativeDamage:true, navigation:true, overnightRepair:true, pointSystem:"dakar" },
    eventStructure: { sessions:["stages"], raceDistanceKm:6000, stages:10, days:12 },
});

/* --- WORLD BAJA CUP — Raid Sprint -------------------------------------- */
const BAJA_CUP = ChampionshipConfig({
    id: "baja_cup", name: "FIA World Baja Cup", family: "Raid", season: 2026, raceType: "MarathonRaid",
    physicsModifiers: { slipstreamEffect:0.3, dirtyAirEffect:0.0, contactTolerance:0.0, powerToWeight:1.0, suspensionStress:2.1 },
    tyreRules: { compounds:["allterrain"], degradationCurve:1.1, blanketAllowed:false, pitLossSeconds:0, suddenFailureProb:0.028 },
    driverRules: { stintRequired:false, crashRiskFactor:1.1, staminaDrainRate:1.3 },
    surfaceRules: { available:["sand","gravel","dirt"], gripTable:{sand:0.55,gravel:0.78,dirt:0.72}, surfaceSwitchTime:1.0 },
    weatherRules: { localizedPossible:true, rubberingFactor:0.0, marblesFactor:0.0, wetGripMultiplier:0.5 },
    features: { traffic:false, tyreWear:true, stageSequence:true, cumulativeDamage:true, navigation:true, overnightRepair:true, pointSystem:"dakar" },
    eventStructure: { sessions:["stages"], raceDistanceKm:3000, stages:6, days:5 },
});

/* --- WORLD SUPERBIKE (WSBK) — Bike Senior ------------------------------- */
const WSBK = ChampionshipConfig({
    id: "wsbk", name: "World Superbike Championship", family: "Bike", season: 2026, raceType: "CircuitRace",
    physicsModifiers: { slipstreamEffect:1.5, dirtyAirEffect:0.6, drsBoost:0.0, contactTolerance:0.25, powerToWeight:1.1 },
    tyreRules: { compounds:["soft","medium","hard"], degradationCurve:1.3, blanketAllowed:false, pitLossSeconds:30, suddenFailureProb:0.01 },
    driverRules: { stintRequired:false, riderWeightImpact:1.3, crashRiskFactor:1.5 },
    weatherRules: { rubberingFactor:1.1, marblesFactor:0.5, wetGripMultiplier:0.68 },
    features: { traffic:true, tyreWear:true, pointSystem:"superbike" },
    eventStructure: { sessions:["practice","qualifying","race"], raceDistanceKm:110, stages:0, days:1 },
});

/* --- SUPERSPORT WORLD CHAMPIONSHIP — Bike Intermediate ----------------- */
const SUPERSPORT = ChampionshipConfig({
    id: "supersport", name: "Supersport World Championship", family: "Bike", season: 2026, raceType: "CircuitRace",
    physicsModifiers: { slipstreamEffect:1.4, dirtyAirEffect:0.5, drsBoost:0.0, contactTolerance:0.25, powerToWeight:0.95 },
    tyreRules: { compounds:["medium","hard"], degradationCurve:1.1, blanketAllowed:false, pitLossSeconds:30, suddenFailureProb:0.01 },
    driverRules: { stintRequired:false, riderWeightImpact:1.3, crashRiskFactor:1.6 },
    weatherRules: { rubberingFactor:1.0, marblesFactor:0.4, wetGripMultiplier:0.66 },
    features: { traffic:true, tyreWear:true, pointSystem:"moto" },
    eventStructure: { sessions:["practice","qualifying","race"], raceDistanceKm:100, stages:0, days:1 },
});

/* --- FIM ENDURANCE WORLD CHAMPIONSHIP (EWC) — Bike Endurance ----------- */
const EWC = ChampionshipConfig({
    id: "ewc", name: "FIM Endurance World Championship", family: "Bike", season: 2026, raceType: "EnduranceRace",
    physicsModifiers: { slipstreamEffect:1.3, dirtyAirEffect:0.7, contactTolerance:0.15, powerToWeight:1.0 },
    tyreRules: { compounds:["medium","hard"], degradationCurve:1.2, blanketAllowed:false, pitLossSeconds:35, suddenFailureProb:0.01 },
    driverRules: { stintRequired:true, minStintMinutes:45, staminaDrainRate:1.2, riderWeightImpact:1.2, crashRiskFactor:0.8, nightPenalty:1.2 },
    weatherRules: { localizedPossible:false, rubberingFactor:1.0, marblesFactor:0.5, wetGripMultiplier:0.65 },
    features: { traffic:true, tyreWear:true, driverStints:true, dayNightCycle:true, pointSystem:"wec" },
    eventStructure: { sessions:["practice","qualifying","race"], raceDistanceKm:3500, stages:0, days:1 }, // Bol d'Or, 8h, 24h
});

/* --- MOTO JUNIOR SERIES — Bike Entry ----------------------------------- */
const MOTO_JUNIOR = ChampionshipConfig({
    id: "moto_junior", name: "Moto Junior Series", family: "Bike", season: 2026, raceType: "CircuitRace",
    physicsModifiers: { slipstreamEffect:1.8, dirtyAirEffect:0.3, drsBoost:0.0, contactTolerance:0.3, powerToWeight:0.6 },
    tyreRules: { compounds:["soft","medium"], degradationCurve:0.7, blanketAllowed:false, pitLossSeconds:30, suddenFailureProb:0.02 },
    driverRules: { stintRequired:false, riderWeightImpact:1.6, crashRiskFactor:2.0 }, // Very young, many crashes
    weatherRules: { rubberingFactor:0.7, marblesFactor:0.1, wetGripMultiplier:0.58 },
    features: { traffic:true, tyreWear:true, pointSystem:"junior" },
    eventStructure: { sessions:["practice","qualifying","race"], raceDistanceKm:70, stages:0, days:1 },
});

/* --- MXGP — Motocross --------------------------------------------------- */
const MXGP = ChampionshipConfig({
    id: "mxgp", name: "MXGP Motocross World Championship", family: "Motocross", season: 2026, raceType: "CircuitRace",
    physicsModifiers: { slipstreamEffect:0.2, dirtyAirEffect:0.1, drsBoost:0.0, contactTolerance:0.5, powerToWeight:1.1, suspensionStress:2.5 },
    // Motocross: continuous jumps, dirt, no slipstream, brutal landings
    tyreRules: { compounds:["allterrain"], degradationCurve:0.5, blanketAllowed:false, pitLossSeconds:0, suddenFailureProb:0.0 },
    driverRules: { stintRequired:false, riderWeightImpact:1.5, crashRiskFactor:2.5, staminaDrainRate:2.0 }, // Physically extreme
    surfaceRules: { available:["dirt"], gripTable:{dirt:0.72}, surfaceSwitchTime:1.0 },
    weatherRules: { rubberingFactor:0.0, marblesFactor:0.0, wetGripMultiplier:0.5 }, // Mud = chaos
    features: { traffic:true, tyreWear:true, pointSystem:"motocross" },
    eventStructure: { sessions:["practice","qualifying","race"], raceDistanceKm:10, stages:0, days:1 }, // 2 races of 30min
});

/* --- SUPERENDURO WORLD CHAMPIONSHIP — Indoor Enduro -------------------- */
const SUPERENDURO = ChampionshipConfig({
    id: "superenduro", name: "FIM SuperEnduro World Championship", family: "Motocross", season: 2026, raceType: "StageRally",
    physicsModifiers: { slipstreamEffect:0.1, dirtyAirEffect:0.0, contactTolerance:0.3, powerToWeight:1.0, suspensionStress:2.0 },
    tyreRules: { compounds:["allterrain"], degradationCurve:0.4, blanketAllowed:false, pitLossSeconds:0, suddenFailureProb:0.0 },
    driverRules: { stintRequired:false, riderWeightImpact:1.4, crashRiskFactor:3.0, staminaDrainRate:2.5 }, // Extreme obstacles
    surfaceRules: { available:["dirt","asphalt"], gripTable:{dirt:0.72,asphalt:1.0}, surfaceSwitchTime:0.9 },
    weatherRules: { rubberingFactor:0.0, marblesFactor:0.0, wetGripMultiplier:0.5 },
    features: { traffic:false, tyreWear:true, stageSequence:true, cumulativeDamage:true, pointSystem:"motocross" },
    eventStructure: { sessions:["practice","qualifying","race"], raceDistanceKm:5, stages:3, days:1 }, // 3 indoor races
});

/* --- TRIAL WORLD CHAMPIONSHIP — Observed (no time) ------------------- */
const TRIAL = ChampionshipConfig({
    id: "trial", name: "FIM Trial World Championship", family: "Trial", season: 2026, raceType: "CircuitRace",
    scoringType: "JudgeStyle",
    physicsModifiers: { slipstreamEffect:0.0, dirtyAirEffect:0.0, contactTolerance:0.0, powerToWeight:0.3, suspensionStress:1.5 },
    tyreRules: { compounds:["allterrain"], degradationCurve:0.1, blanketAllowed:false, pitLossSeconds:0, suddenFailureProb:0.0 },
    driverRules: { stintRequired:false, riderWeightImpact:1.0, crashRiskFactor:5.0, staminaDrainRate:2.0 }, // Every ground touch = penalty
    surfaceRules: { available:["asphalt","dirt","gravel","rock"], gripTable:{asphalt:1.0,dirt:0.72,gravel:0.78,rock:0.6}, surfaceSwitchTime:1.0 },
    weatherRules: { rubberingFactor:0.0, marblesFactor:0.0, wetGripMultiplier:0.5 },
    features: { traffic:false, tyreWear:false, judging:true, pointSystem:"trial" },
    eventStructure: { sessions:["practice","sections"], raceDistanceKm:0, stages:15, days:1 }, // 15 observed sections
});

/* --- SPEEDWAY GRAND PRIX — Dirt Oval ---------------------------------- */
const SPEEDWAY = ChampionshipConfig({
    id: "speedway", name: "FIM Speedway Grand Prix", family: "Speedway", season: 2026, raceType: "CircuitRace",
    physicsModifiers: { slipstreamEffect:2.0, dirtyAirEffect:0.0, drsBoost:0.0, contactTolerance:0.9, powerToWeight:1.3, suspensionStress:1.8 },
    // Speedway: dirt oval, 4 laps, huge slipstream, controlled drift, no brakes
    tyreRules: { compounds:["allterrain"], degradationCurve:0.3, blanketAllowed:false, pitLossSeconds:0, suddenFailureProb:0.0 },
    driverRules: { stintRequired:false, riderWeightImpact:1.5, crashRiskFactor:2.5, staminaDrainRate:1.8 },
    surfaceRules: { available:["dirt"], gripTable:{dirt:0.72}, surfaceSwitchTime:1.0 },
    weatherRules: { rubberingFactor:0.0, marblesFactor:0.0, wetGripMultiplier:0.5 },
    features: { traffic:true, tyreWear:true, pointSystem:"speedway" },
    eventStructure: { sessions:["practice","qualifying","race"], raceDistanceKm:3, stages:0, days:1 }, // 4 laps x ~80s
});

/* --- KARTING WORLD CHAMPIONSHIP — Karting ------------------------------ */
const KARTING_WORLD = ChampionshipConfig({
    id: "karting_world", name: "FIA Karting World Championship", family: "Karting", season: 2026, raceType: "CircuitRace",
    physicsModifiers: { slipstreamEffect:1.8, dirtyAirEffect:0.3, drsBoost:0.0, contactTolerance:0.4, powerToWeight:0.4, suspensionStress:0.5 },
    // Kart: pure physics, no suspension, huge slipstream, low rubbering but high wet sensitivity
    tyreRules: { compounds:["soft","medium","hard"], degradationCurve:0.6, blanketAllowed:false, pitLossSeconds:0, suddenFailureProb:0.005 },
    driverRules: { stintRequired:false, riderWeightImpact:2.0, crashRiskFactor:1.2 }, // Rider weight matters a lot
    weatherRules: { rubberingFactor:1.5, marblesFactor:0.3, wetGripMultiplier:0.5 }, // Karts very slow in the wet
    features: { traffic:true, tyreWear:true, pointSystem:"karting" },
    eventStructure: { sessions:["practice","qualifying","race"], raceDistanceKm:20, stages:0, days:1 },
});

/* --- KARTING REGIONAL — Amateur Karting ---------------------------- */
const KARTING_REGIONAL = ChampionshipConfig({
    id: "karting_regional", name: "Karting Cup Regional", family: "Karting", season: 2026, raceType: "CircuitRace",
    physicsModifiers: { slipstreamEffect:1.8, dirtyAirEffect:0.3, drsBoost:0.0, contactTolerance:0.4, powerToWeight:0.35, suspensionStress:0.5 },
    tyreRules: { compounds:["medium"], degradationCurve:0.5, blanketAllowed:false, pitLossSeconds:0, suddenFailureProb:0.005 },
    driverRules: { stintRequired:false, riderWeightImpact:2.0, crashRiskFactor:1.3 },
    weatherRules: { rubberingFactor:1.4, marblesFactor:0.3, wetGripMultiplier:0.5 },
    features: { traffic:true, tyreWear:true, pointSystem:"karting" },
    eventStructure: { sessions:["practice","qualifying","race"], raceDistanceKm:15, stages:0, days:1 },
});

/* --- EUROPEAN TRUCK RACING CHAMPIONSHIP (ETRC) — Truck ----------------- */
const TRUCK = ChampionshipConfig({
    id: "truck", name: "FIA European Truck Racing Championship", family: "Truck", season: 2026, raceType: "CircuitRace",
    physicsModifiers: { slipstreamEffect:0.3, dirtyAirEffect:1.5, drsBoost:0.0, contactTolerance:0.9, powerToWeight:0.3, suspensionStress:1.0 },
    // Truck: huge, very heavy, massive inertia, brake latest, little slipstream, heavy contact
    tyreRules: { compounds:["hard"], degradationCurve:0.8, blanketAllowed:true, blanketEffect:1.01, pitLossSeconds:40, suddenFailureProb:0.005 },
    driverRules: { stintRequired:false, crashRiskFactor:0.8 }, // Expert champions, controlled
    weatherRules: { rubberingFactor:0.8, marblesFactor:0.8, wetGripMultiplier:0.7 },
    features: { traffic:true, tyreWear:true, fuelOrEnergy:true, pointSystem:"truck" }, // Limited fuel consumption by regulation
    eventStructure: { sessions:["practice","qualifying","race"], raceDistanceKm:80, stages:0, days:1 },
});

/* --- EUROPEAN DRAG RACING CHAMPIONSHIP — Drag Strip ------------------- */
const DRAG = ChampionshipConfig({
    id: "drag", name: "FIA European Drag Racing Championship", family: "Drag", season: 2026, raceType: "CircuitRace",
    scoringType: "Time",
    physicsModifiers: { slipstreamEffect:0.0, dirtyAirEffect:0.0, drsBoost:0.0, contactTolerance:0.0, powerToWeight:3.0, suspensionStress:0.5 },
    // Drag: 402m, pure acceleration, no overtaking, start reaction critical
    tyreRules: { compounds:["slick"], degradationCurve:0.2, blanketAllowed:true, blanketEffect:1.1, pitLossSeconds:0, suddenFailureProb:0.02 },
    driverRules: { stintRequired:false, crashRiskFactor:1.5, staminaDrainRate:0.5 }, // Reaction + courage
    weatherRules: { rubberingFactor:2.0, marblesFactor:0.0, wetGripMultiplier:0.3 }, // Wet = dangerous
    features: { traffic:false, tyreWear:false, pointSystem:"drag" },
    eventStructure: { sessions:["qualifying","race"], raceDistanceKm:0.4, stages:0, days:1 }, // 1/4 mile
});

/* --- HILL CLIMB CHAMPIONSHIPS — Timed Hill Climb -------------------- */
const HILLCLIMB = ChampionshipConfig({
    id: "hillclimb", name: "FIA Hill Climb Championships", family: "HillClimb", season: 2026, raceType: "StageRally",
    physicsModifiers: { slipstreamEffect:0.0, dirtyAirEffect:0.0, contactTolerance:0.0, powerToWeight:1.2, suspensionStress:1.0 },
    // Hill Climb: A->B uphill, asphalt, pure time, 1 car at a time
    tyreRules: { compounds:["soft","medium"], degradationCurve:0.4, blanketAllowed:true, blanketEffect:1.05, pitLossSeconds:0, suddenFailureProb:0.005 },
    driverRules: { stintRequired:false, crashRiskFactor:1.0 },
    surfaceRules: { available:["asphalt"], gripTable:{asphalt:1.0}, surfaceSwitchTime:1.0 },
    weatherRules: { localizedPossible:true, rubberingFactor:0.3, marblesFactor:0.0, wetGripMultiplier:0.55 },
    features: { traffic:false, tyreWear:true, stageSequence:true, pointSystem:"hillclimb" },
    eventStructure: { sessions:["practice","qualifying","race"], raceDistanceKm:8, stages:2, days:1 }, // 2 timed runs
});

/* --- ONE-MAKE CAR CHAMPIONSHIPS — One-Make Car -------------------------- */
const MONOMARCA_AUTO = ChampionshipConfig({
    id: "monomarca_auto", name: "One-Make Car Championship", family: "GT", season: 2026, raceType: "CircuitRace",
    physicsModifiers: { slipstreamEffect:1.2, dirtyAirEffect:0.8, drsBoost:0.0, contactTolerance:0.4, powerToWeight:0.7 },
    tyreRules: { compounds:["medium"], degradationCurve:0.7, blanketAllowed:true, blanketEffect:1.01, pitLossSeconds:28, suddenFailureProb:0.005 },
    driverRules: { stintRequired:false, crashRiskFactor:1.0 },
    weatherRules: { rubberingFactor:1.0, marblesFactor:0.5, wetGripMultiplier:0.65 },
    features: { traffic:true, tyreWear:true, pointSystem:"gt" },
    eventStructure: { sessions:["practice","qualifying","race"], raceDistanceKm:150, stages:0, days:1 },
});

/* --- ONE-MAKE BIKE CHAMPIONSHIPS — One-Make Bike -------------------------- */
const MONOMARCA_MOTO = ChampionshipConfig({
    id: "monomarca_moto", name: "One-Make Bike Championship", family: "Bike", season: 2026, raceType: "CircuitRace",
    physicsModifiers: { slipstreamEffect:1.5, dirtyAirEffect:0.5, drsBoost:0.0, contactTolerance:0.3, powerToWeight:0.8 },
    tyreRules: { compounds:["medium"], degradationCurve:0.8, blanketAllowed:false, pitLossSeconds:30, suddenFailureProb:0.01 },
    driverRules: { stintRequired:false, riderWeightImpact:1.3, crashRiskFactor:1.5 },
    weatherRules: { rubberingFactor:1.0, marblesFactor:0.4, wetGripMultiplier:0.65 },
    features: { traffic:true, tyreWear:true, pointSystem:"moto" },
    eventStructure: { sessions:["practice","qualifying","race"], raceDistanceKm:80, stages:0, days:1 },
});

/* -----------------------------------------------------------------------------
 * 4) CENTRAL REGISTRY — unified access by id (engine + UI)
 * Adding a new discipline = push a new config into this object.
 * ========================================================================== */
const CHAMPIONSHIPS = {
    // --- Originals (10) ---
    [F1.id]:    F1, [F2.id]:F2, [F3.id]:F3, [FE.id]:FE,
    [MOTOGP.id]:MOTOGP, [MOTO2.id]:MOTO2, [MOTO3.id]:MOTO3,
    [WEC.id]:WEC, [WRC.id]:WRC, [DAKAR.id]:DAKAR,
    // --- Open Wheel Junior (2) ---
    [F4.id]:F4, [FREGIONAL.id]:FREGIONAL,
    // --- GT & Endurance (8) ---
    [ELMS.id]:ELMS, [IMSA.id]:IMSA, [GTWC.id]:GTWC, [GTOPEN.id]:GTOPEN, [GT2.id]:GT2,
    [FERRARI_CHALLENGE.id]:FERRARI_CHALLENGE, [PORSCHE_CUP.id]:PORSCHE_CUP, [LAMBORGHINI_TROFEO.id]:LAMBORGHINI_TROFEO,
    // --- Touring Car (2) ---
    [WTCR.id]:WTCR, [STOCK_CAR.id]:STOCK_CAR,
    // --- Regional Rally (7) ---
    [ERC.id]:ERC, [ARC.id]:ARC, [APRC.id]:APRC, [CODASUR.id]:CODASUR, [MERC.id]:MERC, [NACAM.id]:NACAM, [RALLY_CUP.id]:RALLY_CUP,
    // --- Rallycross & Offroad (2) ---
    [WRX.id]:WRX, [AUTOCROSS.id]:AUTOCROSS,
    // --- Raid (2) ---
    [W2RC.id]:W2RC, [BAJA_CUP.id]:BAJA_CUP,
    // --- Bike Senior & Junior (4) ---
    [WSBK.id]:WSBK, [SUPERSPORT.id]:SUPERSPORT, [EWC.id]:EWC, [MOTO_JUNIOR.id]:MOTO_JUNIOR,
    // --- Offroad Bike (4) ---
    [MXGP.id]:MXGP, [SUPERENDURO.id]:SUPERENDURO, [TRIAL.id]:TRIAL, [SPEEDWAY.id]:SPEEDWAY,
    // --- Karting (2) ---
    [KARTING_WORLD.id]:KARTING_WORLD, [KARTING_REGIONAL.id]:KARTING_REGIONAL,
    // --- Special (5) ---
    [TRUCK.id]:TRUCK, [DRAG.id]:DRAG, [HILLCLIMB.id]:HILLCLIMB,
    [MONOMARCA_AUTO.id]:MONOMARCA_AUTO, [MONOMARCA_MOTO.id]:MONOMARCA_MOTO,
};

/* Exposure for the browser (global object) and for Common/ES modules if needed. */
if (typeof window !== "undefined") {
    window.ChampionshipConfig = ChampionshipConfig;
    window.SCORING_TABLES = SCORING_TABLES;
    window.CHAMPIONSHIPS = CHAMPIONSHIPS;
}
if (typeof module !== "undefined" && module.exports) {
    module.exports = { ChampionshipConfig, SCORING_TABLES, CHAMPIONSHIPS };
}