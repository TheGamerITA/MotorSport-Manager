/* =============================================================================
 * ULTIMATE MOTORSPORT MANAGER
 * File: data/categoryConfigs.js
 * -----------------------------------------------------------------------------
 * SCHEMA DATA-DRIVEN DELLE CATEGORIE (Enciclopedia dei Paradigmi di Gioco)
 *
 * LA REGOLA D'ORO: il motore (coreSimulation.js) NON contiene MAI logica del
 * tipo "se è F1 fai questo". Ogni differenza tra campionati è espressa qui come
 * FLAG, MOLTIPLICATORE o REGOLA configurabile. Il Game Engine legge questi valori
 * e si comporta di conseguenza, rimanendo "stupido" e totalmente generico.
 *
 * Lo stesso schema `ChampionshipConfig` può descrivere Discipline futuri (NASCAR,
 * IndyCar, Formula E, Drift, Baja...) senza toccare una riga del motore.
 * ========================================================================== */

/* -----------------------------------------------------------------------------
 * 1) SCHEMA / FACTORY
 * Restituisce un oggetto ChampionshipConfig normalizzato. I campi mancanti
 * vengono riempiti con default sicuri, così ogni campionato definisce SOLO
 * ciò che lo rende unico (configurazione dichiarativa).
 *
 * Chiavi principali:
 *   id            -> chiave univoca (usata per lookup, salvataggi, path loghi)
 *   name          -> etichetta localizzata mostrata in UI
 *   family        -> macro-gruppo ("OpenWheel","Bike","Endurance","Rally","Raid"...)
 *   raceType      -> il grande instradatore del motore:
 *                    "CircuitRace" | "EnduranceRace" | "StageRally" | "MarathonRaid"
 *                    (estendibile in futuro con "OvalRace","JudgeStyle","SprintOffroad")
 *   physicsModifiers -> moltiplicatori che alterano la fisica generica
 *   tyreRules     -> regole gommistica (degrado, compound, blanket)
 *   driverRules   -> stint obbligatori, stamina, peso pilota
 *   surfaceRules  -> asfalto/terra/neve + loro impatto (rally/raid)
 *   weatherRules  -> comportamento meteo e micro-localizzazione
 *   scoringType   -> "Time" (normale) o "JudgeStyle" (Drift)
 *   features      -> mappa di FLAG ON/OFF che attivano/disattivano sottosistemi
 * ========================================================================== */
function ChampionshipConfig(cfg) {
    return Object.assign({
        // --- Identità ---
        id: "unknown",
        name: "Untitled Championship",
        family: "Generic",
        season: 2026,

        // --- Grande instradatore del motore ---
        raceType: "CircuitRace",

        // --- Fisica generica (moltiplicatori: 1.0 = neutro) ---
        physicsModifiers: {
            slipstreamEffect: 1.0,   // riduzione drag di scia (NASCAR/Indy >> 1)
            dirtyAirEffect:   1.0,   // degrado prestazionale dietro un'altra auto
            draftingPower:    1.0,   // efficacia del drafting da contatto
            drsBoost:         0.0,   // boost percentuale DRS (0 = non previsto)
            contactTolerance: 0.0,   // 0..1: quanto contatto corpo-a-corpo è tollerato
            powerToWeight:    1.0,   // modifica il delta di potenza netto tra contendenti
            suspensionStress: 1.0,   // sollecitazione sospensioni (Baja >> 1)
        },

        // --- Regole gomme ---
        tyreRules: {
            compounds:        ["medium"],   // messe a disposizione
            degradationCurve: 1.0,          // moltiplicatore severità degrado (F1 >> 1)
            blanketAllowed:   true,         // tyre blankets ammessi?
            blanketEffect:    1.0,          // bonus prestazionale al via con blanket
            pitLossSeconds:   22,           // tempo perso in un pit stop normale
            suddenFailureProb:0.0,          // probabilità di cedimento istantaneo (Baja/contatti)
        },

        // --- Regole pilota / stamina ---
        driverRules: {
            stintRequired:    false,        // WEC/IMSA: true (driver stints obbligatori)
            minStintMinutes:  0,            // durata minima stint per regolamento
            staminaDrainRate: 1.0,          // velocità calo stamina nei turni di guida
            riderWeightImpact:1.0,          // Moto: il peso pilota impatta molto
            crashRiskFactor:  1.0,          // Moto/Baja: rischio caduta legato ad aggressività
            nightPenalty:     1.0,          // calo prestazioni in notturna (Endurance)
        },

        // --- Superfici (rally / raid / offroad) ---
        surfaceRules: {
            available: ["asphalt"],         // superfici previste nel campionato
            gripTable: {                    // grip relativo per superficie (1.0 = asfalto asciutto)
                asphalt: 1.0, gravel: 0.78, snow: 0.60, sand: 0.55, ice: 0.45, dirt: 0.72
            },
            surfaceSwitchTime: 1.0,         // penalità al cambio appoggio (misto rally)
        },

        // --- Meteo & evoluzione tracciato ---
        weatherRules: {
            localizedPossible: false,       // WRC/Dakar: può piovere solo su parte del percorso
            rubberingFactor:   1.0,         // miglioramento tempi per deposito gomma
            marblesFactor:     1.0,         // gomme morte fuori traiettoria
            wetGripMultiplier: 0.65,        // grip su bagnato rispetto all'asciutto
        },

        // --- Punteggio ---
        scoringType: "Time",                // "Time" oppure "JudgeStyle" (Drift)

        // --- FLAG ATTIVAZIONE SOTTOSISTEMI (cuore della data-drivenness) ---
        // Il motore itera questi flag: se true esegue il relativo modulo.
        features: {
            traffic:          true,   // gestisce il traffico tra contendenti (CircuitRace/Endurance)
            tyreWear:         true,   // applica degrado gomme
            fuelOrEnergy:     false,  // gestisce energia/carburante (FE/F1-endurance)
            driverStints:     false,  // gestisce turni pilota e stamina (Endurance)
            dayNightCycle:    false,  // ciclo giorno/notte (Endurance)
            multiClassTraffic:false,  // traffico tra classi diverse con doppia classifica
            stageSequence:    false,  // prove speciali sequenziali (Rally)
            cumulativeDamage: false,  // danni che si accumulano tra tappe (Rally/Raid)
            navigation:       false,  // errori di rotta + waypoint (Raid/Dakar)
            overnightRepair:  false,  // riparazioni notturne con tempo/pezzi (Raid)
            judging:          false,  // punteggio a stile giudici (Drift)
            pointSystem:      "f1",   // chiave del sistema punti (definito in scoringTables)
        },

        // --- Struttura evento ---
        eventStructure: {
            sessions: ["practice","qualifying","race"],  // sessioni standard
            raceDistanceKm: 305,        // o nr. tappe per rally/raid
            stages: 0,                  // prove speciali (rally/raid)
            days: 1,                    // giorni di evento (Endurance/Raid)
        },
    }, cfg);
}

/* -----------------------------------------------------------------------------
 * 2) POOL DEI SISTEMI PUNTI (definitivi una volta, riutilizzabili)
 * Ciascun campionato referenzia il proprio tramite features.pointSystem.
 * ========================================================================== */
const SCORING_TABLES = {
    f1:        [25,18,15,12,10,8,6,4,2,1],         // top10 + 1 pt giro veloce (gestito a parte)
    moto:      [25,20,16,13,11,10,9,8,7,6,5,4,3,2,1], // top15 MotoGP
    wec:       [25,18,15,12,10,8,6,4,2,1],         // per classe
    rally:     [30,24,21,19,17,15,13,11,9,7,5,4,3,2,1], // WRC power-stage esclusa
    dakar:     [0,0,0,0,0], // Dakar: classifica a tempo, i punti non si usano (placeholder)
    touring:   [25,18,15,12,10,8,6,4,2,1],         // WTCR / Stock Car
    rallycross:[30,24,21,19,17,15,13,11,9,7,5,4,3,2,1], // WRX con semifinali
    speedway:  [20,16,14,12,11,10,9,8,7,6,5,4,3,2,1], // Speedway GP
    truck:     [20,15,12,10,8,6,4,3,2,1],          // ETRC
    karting:   [25,20,16,13,11,10,9,8,7,6,5,4,3,2,1], // Karting
    motocross: [25,22,20,18,16,15,14,13,12,11,10,9,8,7,6,5,4,3,2,1], // MXGP top20
    superbike: [25,21,18,16,15,13,12,11,10,9,8,7,6,5,4,3,2,1], // WSBK top18
    gt:        [25,18,15,12,10,8,6,4,2,1],         // GT sprint
    drag:      [0,0,0,0,0],                        // Drag: classifica a tempo puro
    hillclimb: [0,0,0,0,0],                        // Hill Climb: tempo puro
    trial:     [0,0,0,0,0],                        // Trial: penalità punti (lower better)
    junior:    [25,18,15,12,10,8,6,4,2,1],         // Junior series (F4, Regional, Moto Junior)
};

/* =============================================================================
 * 3) I 5 CAMPIONATI "PROOF OF CONCEPT"
 * Ognuno dimostra un paradigma diverso usando lo STESSO schema generico.
 * ========================================================================== */

/* --- F1 — Paradigma "Open Wheel" ----------------------------------------- */
const F1 = ChampionshipConfig({
    id: "f1",
    name: "Formula 1 World Championship",
    family: "OpenWheel",
    season: 2026,
    raceType: "CircuitRace",
    physicsModifiers: {
        slipstreamEffect: 1.2,
        dirtyAirEffect:   1.3,    // seguire da vicino distrugge le gomme e l'aero
        drsBoost:         0.18,   // +18% velocità con DRS aperto in zona
        contactTolerance: 0.05,   // contatti quasi sempre letali per l'aereo anteriore
        powerToWeight:    1.0,
    },
    tyreRules: {
        compounds: ["soft","medium","hard"],
        degradationCurve: 1.8,    // degrado SEVERO
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

/* --- F2 — Paradigma "Open Wheel Junior" -------------------------------- */
const F2 = ChampionshipConfig({
    id: "f2",
    name: "Formula 2 Championship",
    family: "OpenWheel",
    season: 2026,
    raceType: "CircuitRace",
    physicsModifiers: {
        slipstreamEffect: 1.1,
        dirtyAirEffect:   1.1,
        drsBoost:         0.10,   // DRS meno potente rispetto all'F1
        contactTolerance: 0.1,
        powerToWeight:    0.8,
    },
    tyreRules: {
        compounds: ["soft","medium","hard"],
        degradationCurve: 1.4,    // Le gomme DRS degradano molto in F2
        blanketAllowed:   true,
        blanketEffect:    1.0,
        pitLossSeconds:   26,
        suddenFailureProb:0.01,
    },
    driverRules: {
        stintRequired:false, riderWeightImpact:1.0, crashRiskFactor:0.6, // Più errori dei rookie
    },
    weatherRules: { rubberingFactor:1.2, marblesFactor:1.0, wetGripMultiplier:0.65 },
    features: {
        traffic:true, tyreWear:true, fuelOrEnergy:false, driverStints:false,
        pointSystem:"f1", // Stesso sistema punti F1 per semplicità
    },
    eventStructure: { sessions:["practice","qualifying","race"], raceDistanceKm:170, stages:0, days:1 },
});

/* --- F3 — Paradigma "Open Wheel Junior Entry" ------------------------- */
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
    driverRules: { stintRequired:false, crashRiskFactor: 0.8 }, // Tanti incidenti tra esordienti
    weatherRules: { rubberingFactor:1.0, marblesFactor:0.8, wetGripMultiplier: 0.6 },
    features: { traffic:true, tyreWear:true, fuelOrEnergy:false, pointSystem:"f1" },
    eventStructure: { sessions:["practice","qualifying","race"], raceDistanceKm:100, stages:0, days:1 },
});

/* --- FORMULA E — Paradigma "Electric Energy Mgmt" -------------------- */
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
        pitLossSeconds: 0, suddenFailureProb: 0.0, // No pit stop, usano l'Attack Charge
    },
    driverRules: { stintRequired:false, crashRiskFactor: 0.5 },
    weatherRules: { rubberingFactor:0.5, marblesFactor:0.0, wetGripMultiplier: 0.5 }, 
    features: { traffic:true, tyreWear:true, fuelOrEnergy: true, pointSystem:"f1" }, // Gestione Batteria attiva!
    eventStructure: { sessions:["practice","qualifying","race"], raceDistanceKm:100, stages:0, days:1 },
});

/* --- MOTO 2 — Paradigma "Bike Intermediate" -------------------------- */
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

/* --- MOTO 3 — Paradigma "Bike Entry" ---------------------------------- */
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
    driverRules: { stintRequired:false, riderWeightImpact:1.5, crashRiskFactor: 1.8 }, // Tante cadute
    weatherRules: { rubberingFactor:0.8, marblesFactor:0.2, wetGripMultiplier: 0.6 },
    features: { traffic:true, tyreWear:true, pointSystem:"moto" },
    eventStructure: { sessions:["practice","qualifying","race"], raceDistanceKm:95, stages:0, days:1 },
});

/* --- MOTOGP — Paradigma "Bike" ------------------------------------------- */
const MOTOGP = ChampionshipConfig({
    id: "motogp",
    name: "MotoGP World Championship",
    family: "Bike",
    season: 2026,
    raceType: "CircuitRace",
    physicsModifiers: {
        slipstreamEffect: 1.4,    // lo scia in moto è enorme
        dirtyAirEffect:   0.8,    // meno sensibilità aero di una F1
        drsBoost:         0.0,
        contactTolerance: 0.2,    // tocchi frequenti, raramente letali
        powerToWeight:    1.15,   // delta netto di potenza tra moto
    },
    tyreRules: {
        compounds: ["soft","medium","hard"],
        degradationCurve: 1.2,
        blanketAllowed:   false,  // MotoGP: niente blanket
        blanketEffect:    1.0,
        pitLossSeconds:   30,
        suddenFailureProb:0.01,
    },
    driverRules: {
        stintRequired:false,
        riderWeightImpact:1.4,    // il peso pilota è critico
        crashRiskFactor:  1.6,    // cadute rischiose legate ad aggressività
    },
    weatherRules: { rubberingFactor:1.1, marblesFactor:0.6, wetGripMultiplier:0.7 },
    features: {
        traffic:true, tyreWear:true, pointSystem:"moto",
    },
    eventStructure: { sessions:["practice","qualifying","race"], raceDistanceKm:120, stages:0, days:1 },
});

/* --- WEC HYPERCAR — Paradigma "Endurance" ------------------------------- */
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
        powerToWeight:    0.9,    // le Hypercar sono "libere" ma bilanciate da BoP
    },
    tyreRules: {
        compounds: ["soft","medium","hard"],
        degradationCurve: 0.9,    // gomme studiate per durare
        blanketAllowed:   true,
        blanketEffect:    1.03,
        pitLossSeconds:   45,     // pit più lunghi (rifornimento + 3 piloti)
        suddenFailureProb:0.008,
    },
    driverRules: {
        stintRequired:    true,   // TURNO DI GUIDA OBBLIGATORIO
        minStintMinutes:  60,
        staminaDrainRate: 1.0,
        riderWeightImpact:1.0,
        crashRiskFactor:  0.4,
        nightPenalty:     1.15,   // in notturna il rendimento cala
    },
    weatherRules: { localizedPossible:false, rubberingFactor:1.0, marblesFactor:0.9, wetGripMultiplier:0.68 },
    features: {
        traffic:true, tyreWear:true, driverStints:true, dayNightCycle:true,
        multiClassTraffic:true,     // LMP2/GT tra le Hypercar
        pointSystem:"wec",
    },
    eventStructure: { sessions:["practice","qualifying","race"], raceDistanceKm:5100, stages:0, days:1 },
});

/* --- WRC — Paradigma "Stage Rally" -------------------------------------- */
const WRC = ChampionshipConfig({
    id: "wrc",
    name: "FIA World Rally Championship",
    family: "Rally",
    season: 2026,
    raceType: "StageRally",
    physicsModifiers: {
        slipstreamEffect: 0.0,    // si corre DA SOLI contro il cronometro
        dirtyAirEffect:   0.0,
        contactTolerance: 0.0,
        powerToWeight:    1.0,
        suspensionStress: 1.5,     // salti e dossi su terra
    },
    tyreRules: {
        compounds: ["soft","medium","hard","wet","snow"],
        degradationCurve: 1.0,
        blanketAllowed:   false,
        blanketEffect:    1.0,
        pitLossSeconds:   0,       // si cambia gomma nel parc fermé / tra le SS
        suddenFailureProb:0.01,
    },
    driverRules: {
        stintRequired:false, riderWeightImpact:1.0, crashRiskFactor:0.8,
    },
    surfaceRules: {
        available: ["asphalt","gravel","snow"],
        gripTable: { asphalt:1.0, gravel:0.78, snow:0.60, dirt:0.72 },
        surfaceSwitchTime: 1.1,    // rallentamento sul misto
    },
    weatherRules: {
        localizedPossible: true,  // può piovere solo su METÀ della prova speciale
        rubberingFactor:   0.2,   // niente rubbering in rally
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

/* --- DAKAR — Paradigma "Marathon Raid" ---------------------------------- */
const DAKAR = ChampionshipConfig({
    id: "dakar",
    name: "Dakar Rally",
    family: "Raid",
    season: 2026,
    raceType: "MarathonRaid",
    physicsModifiers: {
        slipstreamEffect: 0.3,    // poco scia su dune/sterrato
        dirtyAirEffect:   0.0,
        contactTolerance: 0.0,
        powerToWeight:    1.0,
        suspensionStress: 2.2,    // whoops, dossi, salti continui
    },
    tyreRules: {
        compounds: ["allterrain"],
        degradationCurve: 1.1,
        blanketAllowed:   false,
        blanketEffect:    1.0,
        pitLossSeconds:   0,
        suddenFailureProb:0.03,   // rottura meccanica ISTANTANEA frequente
    },
    driverRules: {
        stintRequired:false, riderWeightImpact:1.0, crashRiskFactor:1.0,
        staminaDrainRate:1.4,     // tappe di centinaia di km, estenuanti
    },
    surfaceRules: {
        available: ["sand","gravel","dirt"],
        gripTable: { sand:0.55, gravel:0.78, dirt:0.72 },
        surfaceSwitchTime: 1.0,
    },
    weatherRules: {
        localizedPossible: true,  // tempeste di sabbia localizzate
        rubberingFactor:   0.0,
        marblesFactor:     0.0,
        wetGripMultiplier: 0.5,
    },
    features: {
        traffic:false, tyreWear:true, stageSequence:true, cumulativeDamage:true,
        navigation:true,           // waypoint nascosti: errore di rotta = penalità enormi
        overnightRepair:true,      // riparazione notturna con tempo/pezzi limitati
        pointSystem:"dakar",       // classifica a tempo puro
    },
    eventStructure: {
        sessions:["stages"], raceDistanceKm:8000, stages:12, days:14,
    },
});

/* =============================================================================
 * 5) CAMPIONATI AGGIUNTIVI — Tutte le discipline del motorsport globale
 * ========================================================================== */

/* --- FORMULA 4 — Open Wheel Entry-Level --------------------------------- */
const F4 = ChampionshipConfig({
    id: "f4", name: "FIA Formula 4 Championship", family: "OpenWheel", season: 2026, raceType: "CircuitRace",
    physicsModifiers: { slipstreamEffect:0.9, dirtyAirEffect:0.8, drsBoost:0.0, contactTolerance:0.2, powerToWeight:0.5 },
    tyreRules: { compounds:["medium"], degradationCurve:0.8, blanketAllowed:false, pitLossSeconds:30, suddenFailureProb:0.015 },
    driverRules: { stintRequired:false, crashRiskFactor:1.0 }, // Tanti rookie, tanti errori
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

/* --- IMSA — Endurance Americana ---------------------------------------- */
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

/* --- FERRARI CHALLENGE — Monomarca GT ---------------------------------- */
const FERRARI_CHALLENGE = ChampionshipConfig({
    id: "ferrari_challenge", name: "Ferrari Challenge", family: "GT", season: 2026, raceType: "CircuitRace",
    physicsModifiers: { slipstreamEffect:1.0, dirtyAirEffect:1.0, contactTolerance:0.3, powerToWeight:0.8 },
    tyreRules: { compounds:["medium"], degradationCurve:0.8, blanketAllowed:true, blanketEffect:1.01, pitLossSeconds:30, suddenFailureProb:0.005 },
    driverRules: { stintRequired:false, crashRiskFactor:0.6 }, // Gentlemen drivers
    weatherRules: { rubberingFactor:1.0, marblesFactor:0.6, wetGripMultiplier:0.65 },
    features: { traffic:true, tyreWear:true, pointSystem:"gt" },
    eventStructure: { sessions:["practice","qualifying","race"], raceDistanceKm:200, stages:0, days:1 },
});

/* --- PORSCHE CARRERA CUP — Monomarca GT -------------------------------- */
const PORSCHE_CUP = ChampionshipConfig({
    id: "porsche_cup", name: "Porsche Carrera Cup", family: "GT", season: 2026, raceType: "CircuitRace",
    physicsModifiers: { slipstreamEffect:1.0, dirtyAirEffect:1.0, contactTolerance:0.25, powerToWeight:0.82 },
    tyreRules: { compounds:["medium","hard"], degradationCurve:0.9, blanketAllowed:true, blanketEffect:1.01, pitLossSeconds:30, suddenFailureProb:0.006 },
    driverRules: { stintRequired:false, crashRiskFactor:0.7 },
    weatherRules: { rubberingFactor:1.0, marblesFactor:0.6, wetGripMultiplier:0.64 },
    features: { traffic:true, tyreWear:true, pointSystem:"gt" },
    eventStructure: { sessions:["practice","qualifying","race"], raceDistanceKm:180, stages:0, days:1 },
});

/* --- LAMBORGHINI SUPER TROFEO — Monomarca GT ---------------------------- */
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
    // Touring cars: contatti frequenti e tollerati, molto scia
    tyreRules: { compounds:["soft","medium","hard"], degradationCurve:1.0, blanketAllowed:true, blanketEffect:1.02, pitLossSeconds:25, suddenFailureProb:0.01 },
    driverRules: { stintRequired:false, crashRiskFactor:1.2 }, // Bump-and-run
    weatherRules: { rubberingFactor:1.0, marblesFactor:0.7, wetGripMultiplier:0.68 },
    features: { traffic:true, tyreWear:true, pointSystem:"touring" },
    eventStructure: { sessions:["practice","qualifying","race"], raceDistanceKm:150, stages:0, days:1 },
});

/* --- STOCK CAR CHAMPIONSHIPS — Touring Car Brasiliana ------------------ */
const STOCK_CAR = ChampionshipConfig({
    id: "stock_car", name: "Stock Car Pro Series", family: "TouringCar", season: 2026, raceType: "CircuitRace",
    physicsModifiers: { slipstreamEffect:1.5, dirtyAirEffect:0.8, drsBoost:0.0, contactTolerance:0.7, powerToWeight:0.75 },
    tyreRules: { compounds:["soft","medium"], degradationCurve:1.1, blanketAllowed:true, blanketEffect:1.02, pitLossSeconds:28, suddenFailureProb:0.01 },
    driverRules: { stintRequired:false, crashRiskFactor:1.5 }, // Gare molto fisiche, contatti pesanti
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

/* --- CODASUR — Rally Sudamericano -------------------------------------- */
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

/* --- NACAM RALLY CHAMPIONSHIP — Rally Centro/Nord America -------------- */
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

/* --- RALLY CUP REGIONALI — Rally Amatoriale ----------------------------- */
const RALLY_CUP = ChampionshipConfig({
    id: "rally_cup", name: "Rally Cup Regionali", family: "Rally", season: 2026, raceType: "StageRally",
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
    // Rallycross: circuiti corti misti asfalto+terra, partenza lanciata, contatti pesanti, joker lap
    tyreRules: { compounds:["medium","gravel"], degradationCurve:0.7, blanketAllowed:false, pitLossSeconds:0, suddenFailureProb:0.015 },
    driverRules: { stintRequired:false, crashRiskFactor:2.0 }, // Contatti estremi, partenze caotiche
    surfaceRules: { available:["asphalt","gravel","dirt"], gripTable:{asphalt:1.0,gravel:0.78,dirt:0.72}, surfaceSwitchTime:0.95 },
    weatherRules: { rubberingFactor:0.5, marblesFactor:0.0, wetGripMultiplier:0.65 },
    features: { traffic:true, tyreWear:true, pointSystem:"rallycross" },
    eventStructure: { sessions:["practice","qualifying","race"], raceDistanceKm:8, stages:0, days:1 }, // Gare brevissime ~5 giri
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
    driverRules: { stintRequired:false, riderWeightImpact:1.6, crashRiskFactor:2.0 }, // Giovanissimi, tante cadute
    weatherRules: { rubberingFactor:0.7, marblesFactor:0.1, wetGripMultiplier:0.58 },
    features: { traffic:true, tyreWear:true, pointSystem:"junior" },
    eventStructure: { sessions:["practice","qualifying","race"], raceDistanceKm:70, stages:0, days:1 },
});

/* --- MXGP — Motocross --------------------------------------------------- */
const MXGP = ChampionshipConfig({
    id: "mxgp", name: "MXGP Motocross World Championship", family: "Motocross", season: 2026, raceType: "CircuitRace",
    physicsModifiers: { slipstreamEffect:0.2, dirtyAirEffect:0.1, drsBoost:0.0, contactTolerance:0.5, powerToWeight:1.1, suspensionStress:2.5 },
    // Motocross: salti continui, terra, nessuna scia, atterraggi brutali
    tyreRules: { compounds:["allterrain"], degradationCurve:0.5, blanketAllowed:false, pitLossSeconds:0, suddenFailureProb:0.0 },
    driverRules: { stintRequired:false, riderWeightImpact:1.5, crashRiskFactor:2.5, staminaDrainRate:2.0 }, // Fisicamente estremo
    surfaceRules: { available:["dirt"], gripTable:{dirt:0.72}, surfaceSwitchTime:1.0 },
    weatherRules: { rubberingFactor:0.0, marblesFactor:0.0, wetGripMultiplier:0.5 }, // Fango = caos
    features: { traffic:true, tyreWear:true, pointSystem:"motocross" },
    eventStructure: { sessions:["practice","qualifying","race"], raceDistanceKm:10, stages:0, days:1 }, // 2 manche da 30min
});

/* --- SUPERENDURO WORLD CHAMPIONSHIP — Indoor Enduro -------------------- */
const SUPERENDURO = ChampionshipConfig({
    id: "superenduro", name: "FIM SuperEnduro World Championship", family: "Motocross", season: 2026, raceType: "StageRally",
    physicsModifiers: { slipstreamEffect:0.1, dirtyAirEffect:0.0, contactTolerance:0.3, powerToWeight:1.0, suspensionStress:2.0 },
    tyreRules: { compounds:["allterrain"], degradationCurve:0.4, blanketAllowed:false, pitLossSeconds:0, suddenFailureProb:0.0 },
    driverRules: { stintRequired:false, riderWeightImpact:1.4, crashRiskFactor:3.0, staminaDrainRate:2.5 }, // Ostacoli estremi
    surfaceRules: { available:["dirt","asphalt"], gripTable:{dirt:0.72,asphalt:1.0}, surfaceSwitchTime:0.9 },
    weatherRules: { rubberingFactor:0.0, marblesFactor:0.0, wetGripMultiplier:0.5 },
    features: { traffic:false, tyreWear:true, stageSequence:true, cumulativeDamage:true, pointSystem:"motocross" },
    eventStructure: { sessions:["practice","qualifying","race"], raceDistanceKm:5, stages:3, days:1 }, // 3 manche indoor
});

/* --- TRIAL WORLD CHAMPIONSHIP — Osservato (no tempo) ------------------- */
const TRIAL = ChampionshipConfig({
    id: "trial", name: "FIM Trial World Championship", family: "Trial", season: 2026, raceType: "CircuitRace",
    scoringType: "JudgeStyle",
    physicsModifiers: { slipstreamEffect:0.0, dirtyAirEffect:0.0, contactTolerance:0.0, powerToWeight:0.3, suspensionStress:1.5 },
    tyreRules: { compounds:["allterrain"], degradationCurve:0.1, blanketAllowed:false, pitLossSeconds:0, suddenFailureProb:0.0 },
    driverRules: { stintRequired:false, riderWeightImpact:1.0, crashRiskFactor:5.0, staminaDrainRate:2.0 }, // Ogni tocco terra = penalità
    surfaceRules: { available:["asphalt","dirt","gravel","rock"], gripTable:{asphalt:1.0,dirt:0.72,gravel:0.78,rock:0.6}, surfaceSwitchTime:1.0 },
    weatherRules: { rubberingFactor:0.0, marblesFactor:0.0, wetGripMultiplier:0.5 },
    features: { traffic:false, tyreWear:false, judging:true, pointSystem:"trial" },
    eventStructure: { sessions:["practice","sections"], raceDistanceKm:0, stages:15, days:1 }, // 15 sezioni osservate
});

/* --- SPEEDWAY GRAND PRIX — Oval Terra ---------------------------------- */
const SPEEDWAY = ChampionshipConfig({
    id: "speedway", name: "FIM Speedway Grand Prix", family: "Speedway", season: 2026, raceType: "CircuitRace",
    physicsModifiers: { slipstreamEffect:2.0, dirtyAirEffect:0.0, drsBoost:0.0, contactTolerance:0.9, powerToWeight:1.3, suspensionStress:1.8 },
    // Speedway: ovale terra, 4 giri, scia enorme, derapata controllata, niente freni
    tyreRules: { compounds:["allterrain"], degradationCurve:0.3, blanketAllowed:false, pitLossSeconds:0, suddenFailureProb:0.0 },
    driverRules: { stintRequired:false, riderWeightImpact:1.5, crashRiskFactor:2.5, staminaDrainRate:1.8 },
    surfaceRules: { available:["dirt"], gripTable:{dirt:0.72}, surfaceSwitchTime:1.0 },
    weatherRules: { rubberingFactor:0.0, marblesFactor:0.0, wetGripMultiplier:0.5 },
    features: { traffic:true, tyreWear:true, pointSystem:"speedway" },
    eventStructure: { sessions:["practice","qualifying","race"], raceDistanceKm:3, stages:0, days:1 }, // 4 giri x ~80s
});

/* --- KARTING WORLD CHAMPIONSHIP — Karting ------------------------------ */
const KARTING_WORLD = ChampionshipConfig({
    id: "karting_world", name: "FIA Karting World Championship", family: "Karting", season: 2026, raceType: "CircuitRace",
    physicsModifiers: { slipstreamEffect:1.8, dirtyAirEffect:0.3, drsBoost:0.0, contactTolerance:0.4, powerToWeight:0.4, suspensionStress:0.5 },
    // Kart: fisica pura, nessuna sospensione, scia enorme, gommaggio basso ma sensibilità al bagnato alta
    tyreRules: { compounds:["soft","medium","hard"], degradationCurve:0.6, blanketAllowed:false, pitLossSeconds:0, suddenFailureProb:0.005 },
    driverRules: { stintRequired:false, riderWeightImpact:2.0, crashRiskFactor:1.2 }, // Peso pilota pesa tantissimo
    weatherRules: { rubberingFactor:1.5, marblesFactor:0.3, wetGripMultiplier:0.5 }, // Kart in bagnato lentissimi
    features: { traffic:true, tyreWear:true, pointSystem:"karting" },
    eventStructure: { sessions:["practice","qualifying","race"], raceDistanceKm:20, stages:0, days:1 },
});

/* --- KARTING REGIONALI — Karting Amatoriale ---------------------------- */
const KARTING_REGIONAL = ChampionshipConfig({
    id: "karting_regional", name: "Karting Cup Regionali", family: "Karting", season: 2026, raceType: "CircuitRace",
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
    // Truck: enormi, pesantissimi, inerzia enorme, frenano per ultimi, scia poca, contatti pesanti
    tyreRules: { compounds:["hard"], degradationCurve:0.8, blanketAllowed:true, blanketEffect:1.01, pitLossSeconds:40, suddenFailureProb:0.005 },
    driverRules: { stintRequired:false, crashRiskFactor:0.8 }, // Campioni esperti, controllati
    weatherRules: { rubberingFactor:0.8, marblesFactor:0.8, wetGripMultiplier:0.7 },
    features: { traffic:true, tyreWear:true, fuelOrEnergy:true, pointSystem:"truck" }, // Consumo carburante limitato per regolamento
    eventStructure: { sessions:["practice","qualifying","race"], raceDistanceKm:80, stages:0, days:1 },
});

/* --- EUROPEAN DRAG RACING CHAMPIONSHIP — Drag Strip ------------------- */
const DRAG = ChampionshipConfig({
    id: "drag", name: "FIA European Drag Racing Championship", family: "Drag", season: 2026, raceType: "CircuitRace",
    scoringType: "Time",
    physicsModifiers: { slipstreamEffect:0.0, dirtyAirEffect:0.0, drsBoost:0.0, contactTolerance:0.0, powerToWeight:3.0, suspensionStress:0.5 },
    // Drag: 402m, accelerazione pura, nessun sorpasso, reazione alla partenza critica
    tyreRules: { compounds:["slick"], degradationCurve:0.2, blanketAllowed:true, blanketEffect:1.1, pitLossSeconds:0, suddenFailureProb:0.02 },
    driverRules: { stintRequired:false, crashRiskFactor:1.5, staminaDrainRate:0.5 }, // Reazione + coraggio
    weatherRules: { rubberingFactor:2.0, marblesFactor:0.0, wetGripMultiplier:0.3 }, // Bagnato = pericoloso
    features: { traffic:false, tyreWear:false, pointSystem:"drag" },
    eventStructure: { sessions:["qualifying","race"], raceDistanceKm:0.4, stages:0, days:1 }, // 1/4 miglio
});

/* --- HILL CLIMB CHAMPIONSHIPS — Salita Cronometrata -------------------- */
const HILLCLIMB = ChampionshipConfig({
    id: "hillclimb", name: "FIA Hill Climb Championships", family: "HillClimb", season: 2026, raceType: "StageRally",
    physicsModifiers: { slipstreamEffect:0.0, dirtyAirEffect:0.0, contactTolerance:0.0, powerToWeight:1.2, suspensionStress:1.0 },
    // Hill Climb: salita A->B in salita, asfalto, tempo puro, 1 auto alla volta
    tyreRules: { compounds:["soft","medium"], degradationCurve:0.4, blanketAllowed:true, blanketEffect:1.05, pitLossSeconds:0, suddenFailureProb:0.005 },
    driverRules: { stintRequired:false, crashRiskFactor:1.0 },
    surfaceRules: { available:["asphalt"], gripTable:{asphalt:1.0}, surfaceSwitchTime:1.0 },
    weatherRules: { localizedPossible:true, rubberingFactor:0.3, marblesFactor:0.0, wetGripMultiplier:0.55 },
    features: { traffic:false, tyreWear:true, stageSequence:true, pointSystem:"hillclimb" },
    eventStructure: { sessions:["practice","qualifying","race"], raceDistanceKm:8, stages:2, days:1 }, // 2 salite cronometrate
});

/* --- MONOMARCA AUTOMOBILISTICI — One-Make Car -------------------------- */
const MONOMARCA_AUTO = ChampionshipConfig({
    id: "monomarca_auto", name: "Monomarca Automobilistici", family: "GT", season: 2026, raceType: "CircuitRace",
    physicsModifiers: { slipstreamEffect:1.2, dirtyAirEffect:0.8, drsBoost:0.0, contactTolerance:0.4, powerToWeight:0.7 },
    tyreRules: { compounds:["medium"], degradationCurve:0.7, blanketAllowed:true, blanketEffect:1.01, pitLossSeconds:28, suddenFailureProb:0.005 },
    driverRules: { stintRequired:false, crashRiskFactor:1.0 },
    weatherRules: { rubberingFactor:1.0, marblesFactor:0.5, wetGripMultiplier:0.65 },
    features: { traffic:true, tyreWear:true, pointSystem:"gt" },
    eventStructure: { sessions:["practice","qualifying","race"], raceDistanceKm:150, stages:0, days:1 },
});

/* --- MONOMARCA MOTOCICLISTICI — One-Make Bike -------------------------- */
const MONOMARCA_MOTO = ChampionshipConfig({
    id: "monomarca_moto", name: "Monomarca Motociclistici", family: "Bike", season: 2026, raceType: "CircuitRace",
    physicsModifiers: { slipstreamEffect:1.5, dirtyAirEffect:0.5, drsBoost:0.0, contactTolerance:0.3, powerToWeight:0.8 },
    tyreRules: { compounds:["medium"], degradationCurve:0.8, blanketAllowed:false, pitLossSeconds:30, suddenFailureProb:0.01 },
    driverRules: { stintRequired:false, riderWeightImpact:1.3, crashRiskFactor:1.5 },
    weatherRules: { rubberingFactor:1.0, marblesFactor:0.4, wetGripMultiplier:0.65 },
    features: { traffic:true, tyreWear:true, pointSystem:"moto" },
    eventStructure: { sessions:["practice","qualifying","race"], raceDistanceKm:80, stages:0, days:1 },
});

/* -----------------------------------------------------------------------------
 * 4) REGISTRO CENTRALE — accesso unificato per id (motore + UI)
 * Aggiungere una nuova disciplina = pushare un nuovo config in questo oggetto.
 * ========================================================================== */
const CHAMPIONSHIPS = {
    // --- Originali (10) ---
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
    // --- Rally Regionali (7) ---
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

/* Esposizione per il browser (oggetto globale) e per moduli Common/ES se servisse. */
if (typeof window !== "undefined") {
    window.ChampionshipConfig = ChampionshipConfig;
    window.SCORING_TABLES = SCORING_TABLES;
    window.CHAMPIONSHIPS = CHAMPIONSHIPS;
}
if (typeof module !== "undefined" && module.exports) {
    module.exports = { ChampionshipConfig, SCORING_TABLES, CHAMPIONSHIPS };
}
