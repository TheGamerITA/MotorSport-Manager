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
        season: 2024,

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
    f1:    [25,18,15,12,10,8,6,4,2,1],         // top10 + 1 pt giro veloce (gestito a parte)
    moto:  [25,20,16,13,11,10,9,8,7,6,5,4,3,2,1], // top15 MotoGP
    wec:   [25,18,15,12,10,8,6,4,2,1],         // per classe
    rally: [30,24,21,19,17,15,13,11,9,7,5,4,3,2,1], // WRC power-stage esclusa
    dakar: [0,0,0,0,0], // Dakar: classifica a tempo, i punti non si usano (placeholder)
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
    season: 2024,
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
    season: 2024,
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
    season: 2024,
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
    season: 2024,
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
    season: 2024,
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
    season: 2024,
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
    season: 2024,
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
    season: 2024,
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
    season: 2024,
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
    season: 2024,
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

/* -----------------------------------------------------------------------------
 * 4) REGISTRO CENTRALE — accesso unificato per id (motore + UI)
 * Aggiungere una nuova disciplina = pushare un nuovo config in questo oggetto.
 * ========================================================================== */
const CHAMPIONSHIPS = {
    [F1.id]:    F1,
    [F2.id]:    F2,
    [F3.id]:    F3,
    [FE.id]:    FE,
    [MOTOGP.id]:MOTOGP,
    [MOTO2.id]: MOTO2,
    [MOTO3.id]: MOTO3,
    [WEC.id]:   WEC,
    [WRC.id]:   WRC,
    [DAKAR.id]: DAKAR,
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
