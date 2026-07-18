/* =============================================================================
 * ULTIMATE MOTORSPORT MANAGER
 * File: data/tracks.js
 * -----------------------------------------------------------------------------
 * REGISTRO CIRCUITI REALI — polylines normalizzate (0..1000).
 *
 * Ogni tracciato è rappresentato come sequenza di waypoint [x,y] in uno
 * spazio 0..1000. Le forme sono TOPOLOGICAMENTE FEDELI: sequenza di curve e
 * tratti distintivi riconoscibili (la Parabolica di Monza, il crossover di
 * Suzuka, le strade strette di Monaco, le dune di una tappa Dakar).
 *
 * Per fedeltà GPS millimetrica servirebbe importare dataset esterni; la
 * struttura dati qui è identica a quella che accetterebbe coordinate GPS
 * proiettate, quindi si può "droppare" dentro in futuro senza modifiche.
 *
 * Tipi:
 *   "closed" = circuito chiuso: i piloti girano in tondo (F1/MotoGP/WEC).
 *              Il renderer chiude il loop tra l'ultimo e il primo waypoint.
 *   "open"   = prova speciale/tappa: percorso lineare A->B (WRC/Dakar).
 *
 * Schema tracciato (arricchito):
 *   { id, name, country, champFamily, type,
 *     lengthKm, lapRecordSec,
 *     waypoints: [[x,y],...],
 *     finishIndex,            // indice del waypoint di partenza/arrivo
 *     surface,                // per rally/raid: asphalt|gravel|snow|sand|dirt
 *     features: [],           // tratti narrativi ("longstraight","chicanes"...)
 *     // --- attributi che influenzano la simulazione ---
 *     overtakingDifficulty,   // 0..1  (0=facile sorpasso, 1=impossibile tipo Monaco)
 *     tyreStress,             // 0..1  sollecitazione gomme (Suzuka alta, Monza bassa)
 *     elevationChange,        // 0..1  dislivello (Spa alto, Abu Dhabi zero)
 *     drsZones,               // nr. zone DRS (0..3) per OpenWheel/Endurance
 *     fuelEffect,              // 0..1  impatto carburante sul ritmo (alta quota/pressione)
 *     // --- attributi descrittivi per UI/immersione ---
 *     sectors,                // nr. settori cronometrici (di solito 3)
 *     corners,                // nr. curve del tracciato
 *     trackWidth,             // 0..1 larghezza pista visiva (Monaco stretta=0.2)
 *     firstHeld,               // anno prima edizione
 *     lapRecordHolder,         // nome detentore record (flavor)
 *     lapRecordYear,           // anno del record
 *     description              // breve descrizione narrativa
 *   }
 * ========================================================================== */

/* --- helper per definire in modo conciso ------------------------------- */
function T(cfg) { return cfg; }

/* =============================================================================
 * FORMULA 1 — circuiti chiusi
 * ========================================================================== */

/* MONZA — tempio della velocità: rettilineo lunghissimo, variante Ascari,
 * Doppia Lesmo, Parabolica che riapre sul rettilineo. */
const MONZA = T({
    id:"monza", name:"Autodromo di Monza", country:"ITA", champFamily:"OpenWheel",
    type:"closed", lengthKm:5.793, lapRecordSec:81.0,
    waypoints:[
        [500,920],[820,920],[900,910],[910,870],[890,830], // rettilineo + variante (chicane)
        [880,780],[820,720],[760,700],                      // Curva Grande
        [700,680],[660,640],[640,580],                      // Prima Lesmo
        [620,520],[600,470],                                 // Seconda Lesmo
        [610,400],[640,340],[700,300],                       // Curva del Vialone
        [770,280],[840,270],[880,290],                       // Variante Ascari
        [890,350],[880,420],                                 // uscita Ascari
        [860,490],[820,550],[760,610],                       // Curva Parabolica (ampio arco)
        [680,660],[600,700],[520,760],                       // continuo Parabolica
        [460,810],[430,860],[420,900],[440,920],             // rientro rettilineo
    ],
    finishIndex:0,
    features:["longstraight","chicanes","parabolica","temple_of_speed"],
    overtakingDifficulty:0.20, tyreStress:0.40, elevationChange:0.10, drsZones:2, fuelEffect:0.30,
    sectors:3, corners:11, trackWidth:0.85,
    firstHeld:1922, lapRecordHolder:"R. Bottas", lapRecordYear:2020,
    description:"Tempio della velocità. Rettilineo lunghissimo e curve veloci: chi ha il motore migliore vince qui.",
});

/* SILVERSTONE — flusso velocissimo: Copse, Maggotts/Becketts (serie di S),
 * Stowe, Club, complex finale. */
const SILVERSTONE = T({
    id:"silverstone", name:"Silverstone Circuit", country:"GBR", champFamily:"OpenWheel",
    type:"closed", lengthKm:5.891, lapRecordSec:86.5,
    waypoints:[
        [200,800],[300,820],[420,830],                       // Abbey
        [520,810],[580,760],[600,690],                        // Farm Curve
        [620,620],[640,540],[610,470],                        // Village
        [560,430],[500,410],[440,430],                        // Loop
        [400,470],[380,540],[360,610],                        // Aintree
        [340,680],[300,720],[240,740],                        // Brooklands
        [180,720],[140,670],[130,600],                        // Luffield
        [150,530],[190,480],[240,460],                        // Woodcote
        [300,470],[380,490],[460,500],                        // Copse
        [540,490],[600,460],[640,410],                        // Maggotts
        [650,350],[630,290],[580,250],                        // Becketts
        [520,230],[460,250],[400,290],                        // Chapel
        [340,330],[290,390],[260,460],                        // Stowe
        [250,530],[270,600],[320,660],                        // Club
        [380,700],[420,740],[450,780],                        // rientro
    ],
    finishIndex:0,
    features:["fastflowing","esses","highspeed"],
    overtakingDifficulty:0.30, tyreStress:0.50, elevationChange:0.20, drsZones:2, fuelEffect:0.35,
    sectors:3, corners:18, trackWidth:0.80,
    firstHeld:1948, lapRecordHolder:"M. Verstappen", lapRecordYear:2020,
    description:"Circuito flusso-velocissimo. Le Esses di Maggotts-Becketts sono tra le curve più impegnive del calendario.",
});

/* MONACO — circuito cittadino stretto e tortuoso: Sainte Devote, Casino,
 * Mirabeau, Portier, Tunnel, Chicane, Rascasse. */
const MONACO = T({
    id:"monaco", name:"Circuit de Monaco", country:"MON", champFamily:"OpenWheel",
    type:"closed", lengthKm:3.337, lapRecordSec:74.4,
    waypoints:[
        [400,860],[500,820],[560,760],                        // Sainte Devote
        [600,690],[620,600],[640,500],                        // salita Beau Rivage
        [660,420],[640,360],[580,340],                        // Massenet
        [520,330],[460,350],[440,400],                        // Casino
        [420,460],[380,490],[320,480],                        // Mirabeau
        [260,460],[220,420],[210,370],                        // Grand Hotel
        [240,320],[300,300],[360,320],                        // Portier
        [420,350],[480,390],[540,420],                        // Tunnel (rettilineo)
        [600,450],[640,490],[660,540],                        // Nouvelle Chicane
        [620,580],[560,600],[500,620],                        // Tabac
        [460,660],[440,720],[420,780],                        // Piscine
        [400,820],[380,850],                                   // Rascasse/Arrivo
    ],
    finishIndex:0,
    features:["street","tight","nodrs_zones","prestigious"],
    overtakingDifficulty:0.95, tyreStress:0.30, elevationChange:0.30, drsZones:0, fuelEffect:0.40,
    sectors:3, corners:19, trackWidth:0.20,
    firstHeld:1929, lapRecordHolder:"L. Hamilton", lapRecordYear:2021,
    description:"La gioielleria della F1. Strade strette, niente errori permessi, sorpasso quasi impossibile. Vince chi fa pole.",
});

/* SUZUKA — figura a 8 con crossover: la sua firma unica. S-Curve, Degner,
 * 130R, Spoon, Casio Triangle. */
const SUZUKA = T({
    id:"suzuka", name:"Suzuka Circuit", country:"JPN", champFamily:"OpenWheel",
    type:"closed", lengthKm:5.807, lapRecordSec:91.3,
    waypoints:[
        [400,820],[500,830],[600,820],                        // rettilineo principale
        [690,800],[750,750],[770,680],                         // First Corner (Curva 1)
        [760,610],[720,560],[660,540],                         // S-Curve inizio
        [600,520],[550,490],[520,450],                         // S-Curve
        [500,400],[520,350],[570,330],                         // S-Curve fine
        [630,320],[680,300],[700,260],                         // Degner Curve (discesa)
        [690,210],[640,180],[570,170],                         // Hairpin
        [500,180],[440,210],[400,250],                         // crossover (sotto)
        [360,300],[320,360],[300,420],                         // Spoon Curve inizio
        [290,490],[310,560],[360,600],                         // Spoon Curve
        [430,630],[510,650],[580,670],                         // 130R
        [650,690],[720,720],[780,760],                         // Casio Triangle
        [820,800],[780,830],[700,840],                         // chicane arrivo
    ],
    finishIndex:0,
    features:["figure8","crossover","esses","technical"],
    overtakingDifficulty:0.60, tyreStress:0.80, elevationChange:0.40, drsZones:1, fuelEffect:0.35,
    sectors:3, corners:18, trackWidth:0.75,
    firstHeld:1962, lapRecordHolder:"L. Hamilton", lapRecordYear:2019,
    description:"L'unico circuito a figura-8 del calendario. Le Esses e il crossover lo rendono una sfida tecnica suprema.",
});

/* SPA-FRANCORCHAMPS — lungo e collinare: Eau Rouge-Raidillon (salita ripida),
 * Pouhon, Blanchimont, Bus Stop chicane. */
const SPA = T({
    id:"spa", name:"Spa-Francorchamps", country:"BEL", champFamily:"OpenWheel",
    type:"closed", lengthKm:7.004, lapRecordSec:104.0,
    waypoints:[
        [200,860],[300,870],[400,860],                        // La Source hairpin
        [350,800],[300,730],[280,650],                         // Eau Rouge (scende)
        [260,580],[240,500],[230,420],                         // risalita Raidillon
        [260,350],[330,300],[410,280],                         // Les Combes
        [490,270],[570,290],[640,330],                         // Malmedy
        [700,380],[740,450],[760,520],                         // Rivage
        [740,590],[690,640],[630,660],                         // Pouhon (ampio)
        [560,680],[490,700],[430,730],                         // Fagnes
        [370,760],[320,800],[290,840],                         // Stavelot
        [340,880],[420,890],[520,880],                         // Blanchimont
        [620,870],[700,860],[760,840],                         // rettilineo
        [790,800],[760,770],[720,790],                         // Bus Stop chicane
    ],
    finishIndex:0,
    features:["hilly","eau_rouge","long","fast"],
    overtakingDifficulty:0.50, tyreStress:0.70, elevationChange:0.90, drsZones:2, fuelEffect:0.45,
    sectors:3, corners:19, trackWidth:0.80,
    firstHeld:1924, lapRecordHolder:"L. Hamilton", lapRecordYear:2020,
    description:"Il circuito più amato dai piloti. Eau Rouge-Raidillon in salita, dislivello estremo, meteo che cambia tra i settori.",
});

/* IMOLA — Enzo e Dino Ferrari: Tamburello, Acque Minerali, Variante Alta,
 * Rivazza. Tecnico e appartato, poco sorpasso. */
const IMOLA = T({
    id:"imola", name:"Autodromo Enzo e Dino Ferrari (Imola)", country:"ITA", champFamily:"OpenWheel",
    type:"closed", lengthKm:4.909, lapRecordSec:80.0,
    waypoints:[
        [300,860],[450,870],[600,860],[700,840],              // rettilineo + Tamburello
        [760,790],[740,720],[680,680],                         // Tamburello chicane
        [600,670],[520,680],[460,710],                         // Villeneuve
        [400,750],[360,800],[320,820],                         // Tosa (uscita)
        [280,800],[260,740],[300,690],                         // Acque Minerali (scende)
        [360,640],[440,620],[520,610],                         // Variante Alta
        [580,600],[620,560],[600,510],                         // Rivazza 1
        [540,500],[480,520],[440,560],                         // Rivazza 2
        [400,610],[380,680],[360,750],                         // Minerali rientro
        [330,800],[320,830],                                    // arrivo
    ],
    finishIndex:0,
    features:["anticlockwise","technical","narrow","historic"],
    overtakingDifficulty:0.75, tyreStress:0.55, elevationChange:0.50, drsZones:1, fuelEffect:0.35,
    sectors:3, corners:19, trackWidth:0.55,
    firstHeld:1953, lapRecordHolder:"L. Hamilton", lapRecordYear:2020,
    description:"Circuito tecnico e appartato in senso antiorario. Pochi sorpassi, tante curve veloci: vince la precisione.",
});

/* INTERLAGOS — altitude elevata, sassi di Senna, Subida do Lago, Junção.
 * Sensibile al meteo, tifoso esuberante. */
const INTERLAGOS = T({
    id:"interlagos", name:"Autódromo José Carlos Pace (Interlagos)", country:"BRA", champFamily:"OpenWheel",
    type:"closed", lengthKm:4.309, lapRecordSec:70.0,
    waypoints:[
        [400,860],[520,850],[640,830],                        // rettilineo Senna
        [720,790],[760,730],[740,670],                         // Curva do Sol
        [680,650],[600,660],[540,680],                         // Subida do Lago
        [480,710],[440,690],[420,640],                         // Descida do Lago
        [400,580],[420,520],[480,500],                         // Vai Vai
        [540,490],[600,500],[640,530],                         // Curva do Laranjinha
        [620,580],[560,600],[500,610],                         // Pinheirinho
        [440,630],[400,660],[380,720],                         // Bipé (rialzo)
        [360,780],[340,820],                                    // Junção (rientro)
    ],
    finishIndex:0,
    features:["anticlockwise","altitude","bumpy","weather_tricky"],
    overtakingDifficulty:0.55, tyreStress:0.60, elevationChange:0.55, drsZones:2, fuelEffect:0.55,
    sectors:3, corners:15, trackWidth:0.70,
    firstHeld:1940, lapRecordHolder:"V. Bottas", lapRecordYear:2018,
    description:"Alta quota (800m) e fondo sconnesso. Tifoso chiassoso, meteo imprevedibile: tappa classica di fine stagione.",
});

/* ZANDVOORT — dune sul mare, banking in curva, tecnico e veloce.
 * Scheivlak, Hans Ernst, Arie Luyendykbocht. */
const ZANDVOORT = T({
    id:"zandvoort", name:"Circuit Zandvoort", country:"NLD", champFamily:"OpenWheel",
    type:"closed", lengthKm:4.259, lapRecordSec:73.0,
    waypoints:[
        [400,840],[520,850],[640,840],                        // rettilineo
        [720,810],[760,760],[780,690],                         // Tarzan (hairpin)
        [740,640],[680,620],[620,640],                         // Gerlach
        [560,660],[500,640],[460,600],                         // Hans Ernst
        [440,540],[480,490],[560,480],                         // Scheivlak
        [640,490],[700,520],[720,580],                         // Masters (banking)
        [700,650],[640,690],[560,710],                         // Arie Luyendykbocht
        [470,730],[400,760],[360,800],                         // rientro dune
    ],
    finishIndex:0,
    features:["coastal","banking","technical","dunes"],
    overtakingDifficulty:0.70, tyreStress:0.50, elevationChange:0.35, drsZones:1, fuelEffect:0.30,
    sectors:3, corners:14, trackWidth:0.60,
    firstHeld:1948, lapRecordHolder:"L. Hamilton", lapRecordYear:2021,
    description:"Tra le dune del Mare del Nord. Banking in curva e pochi sorpassi: la qualifica è regina.",
});

/* JEDDAH — street circuit velocissimo sul lungomare, notturno, tanti muri. */
const JEDDAH = T({
    id:"jeddah", name:"Jeddah Corniche Circuit", country:"SAU", champFamily:"OpenWheel",
    type:"closed", lengthKm:6.174, lapRecordSec:85.0,
    waypoints:[
        [200,860],[350,870],[500,860],[620,840],
        [700,800],[760,740],[740,680],
        [680,660],[620,680],[580,720],
        [560,680],[620,640],[700,640],
        [780,630],[840,590],[820,530],
        [760,520],[700,540],[660,580],
        [620,540],[680,500],[740,480],
        [800,450],[820,400],[780,360],
        [720,350],[660,370],[620,410],
        [580,460],[540,520],[500,580],
        [420,640],[320,720],[240,800],
    ],
    finishIndex:0,
    features:["street","night","fast","walls"],
    overtakingDifficulty:0.35, tyreStress:0.45, elevationChange:0.05, drsZones:3, fuelEffect:0.30,
    sectors:3, corners:27, trackWidth:0.50,
    firstHeld:2021, lapRecordHolder:"L. Hamilton", lapRecordYear:2021,
    description:"Street circuit velocissimo sul lungomare di Jeddah, in notturna. Muri ovunque: niente margini di errore.",
});

/* AUSTIN (COTA) — circuito tecnico e collinoso: Turn 1 ripida, esse, stadium. */
const AUSTIN = T({
    id:"austin", name:"Circuit of the Americas (Austin)", country:"USA", champFamily:"OpenWheel",
    type:"closed", lengthKm:5.513, lapRecordSec:93.0,
    waypoints:[
        [400,860],[480,830],[540,780],[580,720],
        [620,680],[660,640],[700,600],
        [740,560],[720,500],[660,490],
        [600,500],[560,540],[580,590],
        [640,610],[700,630],[740,670],
        [760,730],[720,790],[660,810],
        [600,800],[540,770],[500,730],
        [460,690],[440,640],[460,590],
        [440,540],[400,510],[360,530],
        [340,580],[360,640],[400,720],
    ],
    finishIndex:0,
    features:["hilly","technical","counterbank","variety"],
    overtakingDifficulty:0.45, tyreStress:0.60, elevationChange:0.55, drsZones:2, fuelEffect:0.35,
    sectors:3, corners:20, trackWidth:0.78,
    firstHeld:2012, lapRecordHolder:"C. Leclerc", lapRecordYear:2019,
    description:"COTA: salita ripida in Turn 1, esse tecnici e stadio finale. Mix di lento e veloce che premia il pacchetto completo.",
});

/* HUNGARORING — tecnico, tortuoso, polvere: poco sorpasso. */
const HUNGARORING = T({
    id:"hungaroring", name:"Hungaroring", country:"HUN", champFamily:"OpenWheel",
    type:"closed", lengthKm:4.381, lapRecordSec:77.0,
    waypoints:[
        [400,840],[500,830],[600,810],
        [680,780],[720,720],[700,660],
        [640,640],[580,660],[540,700],
        [500,660],[560,620],[620,600],
        [680,580],[740,560],[780,520],
        [760,470],[700,450],[640,470],
        [580,490],[540,530],[560,580],
        [620,610],[680,630],[740,650],
        [760,700],[720,760],[660,790],
    ],
    finishIndex:0,
    features:["technical","twisty","dusty","narrow"],
    overtakingDifficulty:0.85, tyreStress:0.50, elevationChange:0.25, drsZones:1, fuelEffect:0.30,
    sectors:3, corners:14, trackWidth:0.60,
    firstHeld:1986, lapRecordHolder:"L. Hamilton", lapRecordYear:2020,
    description:"Monaco senza i muri. Tecnico, tortuoso, polveroso: il sorpasso è rarissimo, la qualifica decide tutto.",
});

/* BAKU — street circuit misto: rettilineo lunghissimo, strettoia nel castello. */
const BAKU = T({
    id:"baku", name:"Baku City Circuit", country:"AZE", champFamily:"OpenWheel",
    type:"closed", lengthKm:6.003, lapRecordSec:85.0,
    waypoints:[
        [200,860],[350,870],[500,860],[650,850],
        [780,840],[860,800],[880,730],
        [840,690],[780,680],[720,700],
        [680,670],[640,640],[620,590],
        [600,540],[620,490],[680,470],
        [740,490],[800,520],[840,570],
        [800,620],[740,630],[680,610],
        [620,600],[560,590],[500,580],
        [440,570],[400,540],[420,490],
        [480,470],[540,490],[580,540],
        [560,600],[500,650],[400,720],
        [300,780],[240,830],
    ],
    finishIndex:0,
    features:["street","longstraight","castle_chicane","chaos","walls"],
    overtakingDifficulty:0.40, tyreStress:0.35, elevationChange:0.15, drsZones:2, fuelEffect:0.30,
    sectors:3, corners:20, trackWidth:0.35,
    firstHeld:2017, lapRecordHolder:"C. Leclerc", lapRecordYear:2019,
    description:"Street circuit estremo: rettilineo di 2 km e strettoia nel castello vecchio. Caos e safety car quasi garantiti.",
});

/* =============================================================================
 * MOTOGP — circuiti chiusi
 * ========================================================================== */

/* MUGELLO — rettilineo lunghissimo, Biondetti, arrivo in frenata, San Donato. */
const MUGELLO = T({
    id:"mugello", name:"Autodromo Mugello", country:"ITA", champFamily:"Bike",
    type:"closed", lengthKm:5.245, lapRecordSec:92.0,
    waypoints:[
        [300,860],[500,870],[700,860],[850,840],              // rettilineo principale (lunghissimo)
        [900,790],[880,710],[820,650],                         // San Donato
        [740,620],[660,600],[590,580],                         // Poggiosecco
        [520,560],[460,530],[420,480],                         // Luco
        [400,420],[420,360],[480,330],                         // Arrabbiata 1
        [550,310],[620,330],[680,370],                         // Arrabbiata 2
        [730,420],[750,490],[730,560],                         // Bucine
        [690,610],[640,640],[580,650],                         // Biondetti 1
        [510,660],[450,680],[400,720],                         // Biondetti 2
        [350,770],[320,820],                                    // Correntaio (rientro)
    ],
    finishIndex:0,
    features:["longstraight","flowing","fast"],
    overtakingDifficulty:0.40, tyreStress:0.45, elevationChange:0.35, drsZones:0, fuelEffect:0.25,
    sectors:3, corners:15, trackWidth:0.75,
    firstHeld:1919, lapRecordHolder:"-", lapRecordYear:0,
    description:"Rettilineo di 1.1 km dove le moto toccano 350+ km/h. Flusso continuo tra i colli toscani.",
});

/* SACHSENRING — stretto, tante curve a sinistra, Waterfall. */
const SACHSENRING = T({
    id:"sachsenring", name:"Sachsenring", country:"DEU", champFamily:"Bike",
    type:"closed", lengthKm:3.671, lapRecordSec:78.0,
    waypoints:[
        [500,820],[620,830],[720,810],                        // rettilineo
        [780,760],[760,690],[700,660],                         // Turn 1 (Coca-Cola curve)
        [630,650],[560,640],[500,620],                         // serie di sinistre
        [440,600],[390,570],[360,520],                         // continua sinistre
        [340,460],[360,400],[420,370],                         // Ruckwand
        [490,360],[560,370],[620,390],                         // Omega
        [680,420],[720,460],[740,520],                         // cascata (Waterfall)
        [720,580],[670,620],[610,640],                         // Queckenberg
        [540,660],[470,680],[400,710],                         // diramazione finale
        [340,750],[320,790],[350,810],                         // rientro
    ],
    finishIndex:0,
    features:["tight","manyleft","technical"],
    overtakingDifficulty:0.70, tyreStress:0.35, elevationChange:0.30, drsZones:0, fuelEffect:0.25,
    sectors:3, corners:13, trackWidth:0.65,
    firstHeld:1996, lapRecordHolder:"-", lapRecordYear:0,
    description:"Predilige le curve a sinistra. La Waterfall in discesa è il punto chiave: chi non ha grip esce di qua.",
});

/* MISANO — costiero, flusso veloce, Tramonto (curva finale). */
const MISANO = T({
    id:"misano", name:"Misano World Circuit", country:"ITA", champFamily:"Bike",
    type:"closed", lengthKm:4.226, lapRecordSec:87.0,
    waypoints:[
        [400,800],[520,820],[640,810],                        // rettilineo
        [740,780],[780,710],[760,640],                         // Curvone
        [710,590],[640,570],[570,560],                         // variante
        [500,550],[440,530],[400,490],                         // Curva del Carro
        [370,430],[390,370],[450,350],                         // Tramonto inizio
        [520,340],[600,350],[670,380],                         // continuità
        [730,410],[780,450],[800,510],                         // Quercia
        [780,570],[730,610],[670,630],                         // rientro (verso rettilineo)
    ],
    finishIndex:0,
    features:["flowing","coastal","medium"],
    overtakingDifficulty:0.55, tyreStress:0.40, elevationChange:0.15, drsZones:0, fuelEffect:0.25,
    sectors:3, corners:16, trackWidth:0.72,
    firstHeld:1972, lapRecordHolder:"-", lapRecordYear:0,
    description:"Sul mare Adriatico. Flusso veloce e la curva Tramonto, al tramonto, acceca i piloti.",
});

/* PHILLIP ISLAND — vento costante, ocean views, curve velocissime,
 * Lukey Heights in salita. Adatto alle bike veloci. */
const PHILLIP_ISLAND = T({
    id:"phillip_island", name:"Phillip Island Grand Prix Circuit", country:"AUS", champFamily:"Bike",
    type:"closed", lengthKm:4.448, lapRecordSec:88.0,
    waypoints:[
        [300,820],[420,840],[540,830],                        // rettilineo Doohan
        [640,800],[700,750],[720,680],                         // Honda (curva 1)
        [700,620],[640,600],[580,620],                         // Southern Loop
        [520,640],[480,690],[440,730],                         // Miller
        [400,710],[380,650],[420,600],                         // Lukey Heights (salita)
        [480,580],[560,570],[640,560],                         // MG (velocissima)
        [720,540],[780,560],[820,610],                         // Stefan (curva destra)
        [800,670],[740,690],[660,700],                         // Siberia
        [580,710],[500,720],[420,730],                         // rientro Hayshed
        [360,770],[320,810],                                    // Gardner (arrivo)
    ],
    finishIndex:0,
    features:["coastal","windy","fastflowing"],
    overtakingDifficulty:0.45, tyreStress:0.35, elevationChange:0.25, drsZones:0, fuelEffect:0.20,
    sectors:3, corners:12, trackWidth:0.78,
    firstHeld:1956, lapRecordHolder:"-", lapRecordYear:0,
    description:"Vento costante dall'oceano e curve velocissime. Le bike ci volano: il ritmo è implacabile.",
});

/* ASSEN — "Cathedral of Speed": tecnico, storicamente su strada,
 * ora circuito dedicato. Hairpin finale alla Geert Boer. */
const ASSEN = T({
    id:"assen", name:"TT Circuit Assen", country:"NLD", champFamily:"Bike",
    type:"closed", lengthKm:4.555, lapRecordSec:84.0,
    waypoints:[
        [400,830],[520,840],[640,820],                        // rettilineo
        [720,780],[760,720],[740,660],                         // Haarbocht (curva 1)
        [680,640],[620,660],[580,710],                         // Mandeveen
        [540,740],[480,730],[440,690],                         // Mastersen
        [420,640],[460,590],[540,580],                         // Briel
        [620,580],[700,570],[760,540],                         // Stekkenwal
        [780,490],[740,440],[680,430],                         // De Bult
        [620,450],[580,490],[560,550],                         // Ramshoek
        [520,610],[460,640],[400,660],                         // Geert Boer (hairpin)
        [340,690],[320,740],[340,790],                         // rientro arrivo
    ],
    finishIndex:0,
    features:["technical","flowing","historic"],
    overtakingDifficulty:0.60, tyreStress:0.40, elevationChange:0.20, drsZones:0, fuelEffect:0.25,
    sectors:3, corners:18, trackWidth:0.70,
    firstHeld:1925, lapRecordHolder:"-", lapRecordYear:0,
    description:"La Cattedrale delle due ruote. Tecnico e flusso continuo: solo le bike più equilibrate dominano.",
});

/* =============================================================================
 * WEC — circuiti chiusi (molto lunghi)
 * ========================================================================== */

/* LE MANS — leggendario: rettilineo dell'Hunaudières (Mulsanne) lunghissimo,
 * curve di Mulsanne, Indianapolis, Arnage, Ford Chicane. */
const LEMANS = T({
    id:"lemans", name:"Circuit de la Sarthe (Le Mans)", country:"FRA", champFamily:"Endurance",
    type:"closed", lengthKm:13.626, lapRecordSec:200.0,
    waypoints:[
        [200,800],[350,820],[500,830],[650,820],[800,800],   // rettilineo box
        [860,760],[840,690],[780,650],                         // Dunlop
        [720,620],[680,560],[700,490],                         // Esses
        [740,420],[820,400],[900,420],                         // Hunaudières inizio (Mulsanne Straight)
        [950,460],[940,540],[880,590],                         // Mulsanne (con chicane)
        [820,620],[760,650],[720,710],                         // Indianapolis
        [680,770],[600,790],[520,780],                         // Arnage
        [440,760],[380,720],[340,660],                         // Porsche Curves inizio
        [310,590],[330,520],[390,480],                         // Porsche Curves
        [460,460],[530,450],[590,470],                         // Maison Blanche
        [640,500],[680,550],[700,620],                         // Ford Chicane
        [660,690],[590,720],[520,740],                         // rientro arrivo
    ],
    finishIndex:0,
    features:["long","hunaudieres","night","prestigious","multiclass"],
    overtakingDifficulty:0.40, tyreStress:0.60, elevationChange:0.30, drsZones:0, fuelEffect:0.45,
    sectors:3, corners:38, trackWidth:0.82,
    firstHeld:1923, lapRecordHolder:"-", lapRecordYear:0,
    description:"24 ore leggendarie. Rettilineo di 6 km, gara notturna, traffico multiclasse: la resistenza suprema.",
});

/* FUJI — lungo rettilineo, hairpin 100R, Coca-Cola corner. */
const FUJI = T({
    id:"fuji", name:"Fuji Speedway", country:"JPN", champFamily:"Endurance",
    type:"closed", lengthKm:4.563, lapRecordSec:105.0,
    waypoints:[
        [200,840],[400,860],[600,870],[800,860],              // rettilineo (1.5km)
        [880,830],[860,760],[800,720],                         // Turn 1 (Dunlop)
        [730,710],[660,730],[610,780],                         // 100R hairpin
        [570,830],[520,850],[460,840],                         // Coca-Cola Corner
        [410,810],[380,760],[400,700],                         // Hairpin Curve
        [450,660],[520,640],[590,660],                         // torna verso destra
        [640,690],[680,730],[660,780],                         // Grantour
    ],
    finishIndex:0,
    features:["longstraight","hairpin","scenic"],
    overtakingDifficulty:0.30, tyreStress:0.40, elevationChange:0.20, drsZones:0, fuelEffect:0.50,
    sectors:3, corners:16, trackWidth:0.80,
    firstHeld:1966, lapRecordHolder:"-", lapRecordYear:0,
    description:"Rettilineo di 1.5 km ai piedi del Fuji. Quota alta: il motore respira meno e consuma di più.",
});

/* SEBRING — ex pista aeroportuale, sconnessa e tecnica, US leggendaria.
 * Ulmann, Big Bend, Hairpin, Tower. */
const SEBRING = T({
    id:"sebring", name:"Sebring International Raceway", country:"USA", champFamily:"Endurance",
    type:"closed", lengthKm:6.019, lapRecordSec:120.0,
    waypoints:[
        [300,830],[420,840],[540,820],[660,830],              // rettilineo front
        [760,810],[820,760],[820,690],                         // Turn 1 (Johnson)
        [780,650],[700,660],[620,680],                         // Big Bend
        [540,700],[460,710],[400,700],                         // Warehouse
        [340,690],[320,640],[360,600],                         // Ulmann (hairpin)
        [420,580],[500,570],[580,560],                         // Hairpin (curva 10)
        [660,560],[740,560],[820,560],                         // Collier (rettilineo)
        [860,580],[840,640],[780,670],                         // Tower
        [700,680],[620,690],[540,690],                         // Sunset Bend
        [460,700],[400,720],[360,760],                         // rientro
    ],
    finishIndex:0,
    features:["bumpy","airfield","technical","12hours"],
    overtakingDifficulty:0.50, tyreStress:0.65, elevationChange:0.10, drsZones:0, fuelEffect:0.40,
    sectors:3, corners:17, trackWidth:0.72,
    firstHeld:1950, lapRecordHolder:"-", lapRecordYear:0,
    description:"Ex pista aeroportuale, fondo sconnesso e rotto. Le 12 Ore più brutali e fisiche del calendario WEC.",
});

/* SPA riutilizzato per WEC (stessa definizione, famiglia Endurance) */
const SPA_WEC = T({ ...SPA, id:"spa_wec", champFamily:"Endurance" });

/* =============================================================================
 * WRC — prove speciali "open" (A->B) su superficie variabile
 * ========================================================================== */

/* MONTE CARLO — asfalto montano tortuoso, spesso neve/ghiaccio a tratti. */
const SS_MONTECARLO = T({
    id:"ss_montecarlo", name:"SS Monte Carlo — La Bollène", country:"MON", champFamily:"Rally",
    type:"open", lengthKm:24.0, lapRecordSec:780,
    waypoints:[
        [100,900],[160,840],[120,780],[80,720],[140,680],
        [200,720],[260,680],[220,620],[280,580],[240,520],
        [180,540],[140,480],[200,440],[280,460],[340,420],
        [300,360],[360,320],[440,340],[500,300],[460,240],
        [400,220],[460,160],[540,180],[600,220],[560,280],
        [620,320],[700,300],[760,340],[820,300],[880,260],
    ],
    finishIndex:0,
    surface:"snow",
    features:["mountain","twisty","mixed_grip","iconic"],
    overtakingDifficulty:0.90, tyreStress:0.30, elevationChange:0.85, drsZones:0, fuelEffect:0.30,
    sectors:3, corners:35, trackWidth:0.40,
    firstHeld:1911, lapRecordHolder:"-", lapRecordYear:0,
    description:"Asfalto di montagna con neve/ghiaccio a tratti. Grip misto: la scelta gomme è una scommessa.",
});

/* FINLANDIA — terra velocissima con salti (crests), il "rally dei 1000 laghi". */
const SS_FINLANDIA = T({
    id:"ss_finlandia", name:"SS Rally Finland — Ouninpohja", country:"FIN", champFamily:"Rally",
    type:"open", lengthKm:33.0, lapRecordSec:900,
    waypoints:[
        [80,850],[200,830],[320,860],[440,840],[560,870],
        [680,850],[760,790],[720,710],[640,690],[560,710],
        [480,690],[560,650],[640,630],[720,590],[780,530],
        [840,470],[880,400],[840,330],[760,310],[680,340],
        [600,320],[640,250],[720,230],[800,270],[860,210],
        [900,140],
    ],
    finishIndex:0,
    surface:"gravel",
    features:["crests","jumps","highspeed","commitment"],
    overtakingDifficulty:0.60, tyreStress:0.50, elevationChange:0.70, drsZones:0, fuelEffect:0.35,
    sectors:3, corners:40, trackWidth:0.55,
    firstHeld:1951, lapRecordHolder:"-", lapRecordYear:0,
    description:"Terra velocissima con salti ciechi oltre i crest. Veloce al punto da richiedere fegato assoluto.",
});

/* GB GALLES — fango, boschi, visibilità scarsa, scivoloso. */
const SS_GB = T({
    id:"ss_gb", name:"SS Wales Rally GB — Myherin", country:"GBR", champFamily:"Rally",
    type:"open", lengthKm:27.0, lapRecordSec:1020,
    waypoints:[
        [100,820],[160,760],[120,700],[180,650],[140,590],
        [220,560],[280,610],[240,680],[320,710],[380,670],
        [340,600],[420,570],[480,620],[440,690],[520,720],
        [600,690],[560,620],[640,590],[700,640],[660,710],
        [740,740],[800,690],[760,620],[840,590],[880,520],
        [820,470],[880,410],[900,330],
    ],
    finishIndex:0,
    surface:"gravel",
    features:["mud","forests","slippery","lowvis"],
    overtakingDifficulty:0.75, tyreStress:0.55, elevationChange:0.45, drsZones:0, fuelEffect:0.30,
    sectors:3, corners:30, trackWidth:0.45,
    firstHeld:1932, lapRecordHolder:"-", lapRecordYear:0,
    description:"Fango e boschi. Visibilità scarsa e fondo scivoloso: disciplina da amanti del fango e della pazienza.",
});

/* KENYA — Safari Rally: sabbia, polvere, pietre, caldo.
 * "Rally dei macchinari": la resistenza conta più della velocità. */
const SS_KENYA = T({
    id:"ss_kenya", name:"SS Safari Rally Kenya — Kedong", country:"KEN", champFamily:"Rally",
    type:"open", lengthKm:30.0, lapRecordSec:1080,
    waypoints:[
        [80,840],[180,820],[280,840],[380,820],[480,840],
        [560,800],[640,780],[700,740],[760,690],[820,640],
        [860,580],[820,520],[760,540],[700,560],[640,580],
        [560,600],[480,580],[420,540],[380,480],[340,420],
        [400,380],[480,400],[560,420],[640,440],[720,460],
        [800,440],[880,420],[900,360],
    ],
    finishIndex:0,
    surface:"gravel",
    features:["safari","rocks","heat","mechanical_stress","dust"],
    overtakingDifficulty:0.65, tyreStress:0.75, elevationChange:0.40, drsZones:0, fuelEffect:0.60,
    sectors:3, corners:25, trackWidth:0.50,
    firstHeld:1953, lapRecordHolder:"-", lapRecordYear:0,
    description:"Safari Rally: pietre, polvere e caldo. La meccanica soffre: più della resistenza che della velocità.",
});

/* =============================================================================
 * DAKAR — tappe "open" su sabbia/deserto/montagna
 * ========================================================================== */

/* TAPPA DUNE — dune infinite, navigazione critica, sabbia morbida. */
const DAKAR_DUNE = T({
    id:"dakar_dune", name:"Dakar — Tappa Dune (Empty Quarter)", country:"SAU", champFamily:"Raid",
    type:"open", lengthKm:460, lapRecordSec:14400,
    waypoints:[
        [80,800],[180,750],[140,680],[240,640],[320,680],
        [280,590],[380,550],[460,600],[420,690],[520,720],
        [620,680],[580,590],[680,550],[760,600],[720,690],
        [820,720],[880,650],[840,560],[760,530],[820,460],
        [880,390],[820,320],[740,350],[680,290],[760,240],
        [840,200],[900,140],
    ],
    finishIndex:0,
    surface:"sand",
    features:["dunes","navigation","soft_sand","endurance"],
    overtakingDifficulty:0.85, tyreStress:0.50, elevationChange:0.60, drsZones:0, fuelEffect:0.70,
    sectors:3, corners:50, trackWidth:0.60,
    firstHeld:1979, lapRecordHolder:"-", lapRecordYear:0,
    description:"Dune infinite e sabbia morbida. La navigazione conta più della velocità: perdersi costa ore.",
});

/* TAPPA DESERTO — piste veloci tra pietraie, meno sabbia. */
const DAKAR_DESERTO = T({
    id:"dakar_deserto", name:"Dakar — Tappa Deserto (Nefud)", country:"SAU", champFamily:"Raid",
    type:"open", lengthKm:380, lapRecordSec:12600,
    waypoints:[
        [100,820],[260,800],[420,820],[580,800],[740,820],
        [860,780],[820,700],[680,690],[560,710],[440,690],
        [340,670],[420,610],[560,600],[700,610],[820,580],
        [880,500],[820,420],[680,410],[540,430],[420,410],
        [300,390],[240,330],[340,290],[480,280],[620,290],
        [760,270],[860,220],[900,150],
    ],
    finishIndex:0,
    surface:"gravel",
    features:["stones","highspeed","mechanical_stress"],
    overtakingDifficulty:0.70, tyreStress:0.80, elevationChange:0.30, drsZones:0, fuelEffect:0.60,
    sectors:3, corners:35, trackWidth:0.70,
    firstHeld:1979, lapRecordHolder:"-", lapRecordYear:0,
    description:"Piste veloci tra pietraie. Le pietre distruggono sospensioni e gomme: chi va troppo forte si rompe.",
});

/* TAPPA MONTAGNA — salite, discese, rocce, alta quota. */
const DAKAR_MONTAGNA = T({
    id:"dakar_montagna", name:"Dakar — Tappa Montagna (Hijaz)", country:"SAU", champFamily:"Raid",
    type:"open", lengthKm:300, lapRecordSec:10800,
    waypoints:[
        [100,860],[160,780],[100,700],[180,640],[140,560],
        [240,520],[200,440],[300,400],[260,330],[360,300],
        [320,230],[420,200],[500,250],[460,330],[560,370],
        [620,320],[580,240],[680,200],[760,250],[720,330],
        [820,360],[860,290],[820,210],[880,150],
    ],
    finishIndex:0,
    surface:"dirt",
    features:["mountains","rocks","altitude","technical"],
    overtakingDifficulty:0.80, tyreStress:0.60, elevationChange:0.95, drsZones:0, fuelEffect:0.75,
    sectors:3, corners:45, trackWidth:0.45,
    firstHeld:1979, lapRecordHolder:"-", lapRecordYear:0,
    description:"Alta quota tra le montagne dell'Hijaz. Meno ossigeno = meno potenza, e la navigazione è ancora più critica.",
});

/* =============================================================================
 * REGISTRO CENTRALE
 * ========================================================================== */
const TRACKS = {
    [MONZA.id]:MONZA, [SILVERSTONE.id]:SILVERSTONE, [MONACO.id]:MONACO,
    [SUZUKA.id]:SUZUKA, [SPA.id]:SPA, [IMOLA.id]:IMOLA, [INTERLAGOS.id]:INTERLAGOS, [ZANDVOORT.id]:ZANDVOORT,
    [JEDDAH.id]:JEDDAH, [AUSTIN.id]:AUSTIN, [HUNGARORING.id]:HUNGARORING, [BAKU.id]:BAKU,
    [MUGELLO.id]:MUGELLO, [SACHSENRING.id]:SACHSENRING, [MISANO.id]:MISANO,
    [PHILLIP_ISLAND.id]:PHILLIP_ISLAND, [ASSEN.id]:ASSEN,
    [LEMANS.id]:LEMANS, [FUJI.id]:FUJI, [SEBRING.id]:SEBRING, [SPA_WEC.id]:SPA_WEC,
    [SS_MONTECARLO.id]:SS_MONTECARLO, [SS_FINLANDIA.id]:SS_FINLANDIA, [SS_GB.id]:SS_GB, [SS_KENYA.id]:SS_KENYA,
    [DAKAR_DUNE.id]:DAKAR_DUNE, [DAKAR_DESERTO.id]:DAKAR_DESERTO, [DAKAR_MONTAGNA.id]:DAKAR_MONTAGNA,
};

/* indice per famiglia (per costruzione calendari) */
const TRACKS_BY_FAMILY = {
    OpenWheel:[MONZA,SILVERSTONE,MONACO,SUZUKA,SPA,IMOLA,INTERLAGOS,ZANDVOORT,JEDDAH,AUSTIN,HUNGARORING,BAKU],
    Bike:[MUGELLO,SACHSENRING,MISANO,PHILLIP_ISLAND,ASSEN],
    Endurance:[LEMANS,FUJI,SEBRING,SPA_WEC],
    Rally:[SS_MONTECARLO,SS_FINLANDIA,SS_GB,SS_KENYA],
    Raid:[DAKAR_DUNE,DAKAR_DESERTO,DAKAR_MONTAGNA],
};

function getTrack(id) { return TRACKS[id] || null; }
function getTracksByFamily(family) { return TRACKS_BY_FAMILY[family] || []; }

/* Esposizione globale */
if (typeof window !== "undefined") {
    window.TRACKS = TRACKS;
    window.TRACKS_BY_FAMILY = TRACKS_BY_FAMILY;
    window.getTrack = getTrack;
    window.getTracksByFamily = getTracksByFamily;
}
if (typeof module !== "undefined" && module.exports) {
    module.exports = { TRACKS, TRACKS_BY_FAMILY, getTrack, getTracksByFamily };
}