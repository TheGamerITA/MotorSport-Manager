/* =============================================================================
 * ULTIMATE MOTORSPORT MANAGER
 * File: data/tracks.js
 * -----------------------------------------------------------------------------
 * REAL TRACK REGISTRY — normalized polylines (0..1000).
 *
 * Each track is represented as a sequence of waypoints [x,y] in a 0..1000
 * space. The shapes are TOPOLOGICALLY FAITHFUL: sequences of recognizable
 * corners and distinctive features (Monza's Parabolica, Suzuka's crossover,
 * Monaco's narrow streets, the dunes of a Dakar stage).
 *
 * For millimetric GPS fidelity, external datasets would need to be imported;
 * the data structure here is identical to what would accept projected GPS
 * coordinates, so they can be "dropped" in the future without modifications.
 *
 * Types:
 *   "closed" = closed circuit: drivers go around in a loop (F1/MotoGP/WEC).
 *              The renderer closes the loop between the last and first waypoint.
 *   "open"   = special stage/leg: linear A->B course (WRC/Dakar).
 *
 * Track schema (enriched):
 *   { id, name, country, champFamily, type,
 *     lengthKm, lapRecordSec,
 *     waypoints: [[x,y],...],
 *     finishIndex,            // start/finish waypoint index
 *     surface,                // for rally/raid: asphalt|gravel|snow|sand|dirt
 *     features: [],           // narrative traits ("longstraight","chicanes"...)
 *     // --- attributes that influence the simulation ---
 *     overtakingDifficulty,   // 0..1  (0=easy overtaking, 1=impossible like Monaco)
 *     tyreStress,             // 0..1  tyre stress (Suzuka high, Monza low)
 *     elevationChange,        // 0..1  elevation change (Spa high, Abu Dhabi zero)
 *     drsZones,               // nr. DRS zones (0..3) for OpenWheel/Endurance
 *     fuelEffect,              // 0..1  fuel impact on pace (high altitude/pressure)
 *     // --- descriptive attributes for UI/immersion ---
 *     sectors,                // nr. timing sectors (usually 3)
 *     corners,                // nr. corners of the track
 *     trackWidth,             // 0..1 visual track width (Monaco narrow=0.2)
 *     firstHeld,               // year of first edition
 *     lapRecordHolder,         // record holder name (flavor)
 *     lapRecordYear,           // record year
 *     description              // short narrative description
 *   }
 * ========================================================================== */

/* --- helper for concise definition ------------------------------- */
function T(cfg) { return cfg; }

/* =============================================================================
 * FORMULA 1 — closed circuits
 * ========================================================================== */

/* MONZA — temple of speed: very long straight, Ascari chicane,
 * Double Lesmo, Parabolica that opens back onto the straight. */
const MONZA = T({
    id:"monza", name:"Autodromo di Monza", country:"ITA", champFamily:"OpenWheel",
    type:"closed", lengthKm:5.793, lapRecordSec:81.0,
    waypoints:[
        [500,920],[820,920],[900,910],[910,870],[890,830], // straight + chicane
        [880,780],[820,720],[760,700],                      // Curva Grande
        [700,680],[660,640],[640,580],                      // Prima Lesmo (First Lesmo)
        [620,520],[600,470],                                 // Seconda Lesmo (Second Lesmo)
        [610,400],[640,340],[700,300],                       // Curva del Vialone
        [770,280],[840,270],[880,290],                       // Variante Ascari (Ascari Chicane)
        [890,350],[880,420],                                 // Ascari exit
        [860,490],[820,550],[760,610],                       // Parabolica (wide arc)
        [680,660],[600,700],[520,760],                       // Parabolica continues
        [460,810],[430,860],[420,900],[440,920],             // back to straight
    ],
    finishIndex:0,
    features:["longstraight","chicanes","parabolica","temple_of_speed"],
    overtakingDifficulty:0.20, tyreStress:0.40, elevationChange:0.10, drsZones:2, fuelEffect:0.30,
    sectors:3, corners:11, trackWidth:0.85,
    firstHeld:1922, lapRecordHolder:"R. Bottas", lapRecordYear:2020,
    description:"Temple of speed. Very long straight and fast corners: whoever has the best engine wins here.",
});

/* SILVERSTONE — very fast flowing: Copse, Maggotts/Becketts (S series),
 * Stowe, Club, final complex. */
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
        [380,700],[420,740],[450,780],                        // return
    ],
    finishIndex:0,
    features:["fastflowing","esses","highspeed"],
    overtakingDifficulty:0.30, tyreStress:0.50, elevationChange:0.20, drsZones:2, fuelEffect:0.35,
    sectors:3, corners:18, trackWidth:0.80,
    firstHeld:1948, lapRecordHolder:"M. Verstappen", lapRecordYear:2020,
    description:"Very fast flowing circuit. The Maggotts-Becketts Esses are among the most demanding corners on the calendar.",
});

/* MONACO — narrow and twisty street circuit: Sainte Devote, Casino,
 * Mirabeau, Portier, Tunnel, Chicane, Rascasse. */
const MONACO = T({
    id:"monaco", name:"Circuit de Monaco", country:"MON", champFamily:"OpenWheel",
    type:"closed", lengthKm:3.337, lapRecordSec:74.4,
    waypoints:[
        [400,860],[500,820],[560,760],                        // Sainte Devote
        [600,690],[620,600],[640,500],                        // Beau Rivage climb
        [660,420],[640,360],[580,340],                        // Massenet
        [520,330],[460,350],[440,400],                        // Casino
        [420,460],[380,490],[320,480],                        // Mirabeau
        [260,460],[220,420],[210,370],                        // Grand Hotel
        [240,320],[300,300],[360,320],                        // Portier
        [420,350],[480,390],[540,420],                        // Tunnel (straight)
        [600,450],[640,490],[660,540],                        // Nouvelle Chicane
        [620,580],[560,600],[500,620],                        // Tabac
        [460,660],[440,720],[420,780],                        // Piscine
        [400,820],[380,850],                                   // Rascasse/Finish
    ],
    finishIndex:0,
    features:["street","tight","nodrs_zones","prestigious"],
    overtakingDifficulty:0.95, tyreStress:0.30, elevationChange:0.30, drsZones:0, fuelEffect:0.40,
    sectors:3, corners:19, trackWidth:0.20,
    firstHeld:1929, lapRecordHolder:"L. Hamilton", lapRecordYear:2021,
    description:"The jewel of F1. Narrow streets, no mistakes allowed, overtaking almost impossible. Pole position wins.",
});

/* SUZUKA — figure-8 with crossover: its unique signature. S-Curve, Degner,
 * 130R, Spoon, Casio Triangle. */
const SUZUKA = T({
    id:"suzuka", name:"Suzuka Circuit", country:"JPN", champFamily:"OpenWheel",
    type:"closed", lengthKm:5.807, lapRecordSec:91.3,
    waypoints:[
        [400,820],[500,830],[600,820],                        // main straight
        [690,800],[750,750],[770,680],                         // First Corner (Turn 1)
        [760,610],[720,560],[660,540],                         // S-Curve start
        [600,520],[550,490],[520,450],                         // S-Curve
        [500,400],[520,350],[570,330],                         // S-Curve end
        [630,320],[680,300],[700,260],                         // Degner Curve (descent)
        [690,210],[640,180],[570,170],                         // Hairpin
        [500,180],[440,210],[400,250],                         // crossover (under)
        [360,300],[320,360],[300,420],                         // Spoon Curve start
        [290,490],[310,560],[360,600],                         // Spoon Curve
        [430,630],[510,650],[580,670],                         // 130R
        [650,690],[720,720],[780,760],                         // Casio Triangle
        [820,800],[780,830],[700,840],                         // finish chicane
    ],
    finishIndex:0,
    features:["figure8","crossover","esses","technical"],
    overtakingDifficulty:0.60, tyreStress:0.80, elevationChange:0.40, drsZones:1, fuelEffect:0.35,
    sectors:3, corners:18, trackWidth:0.75,
    firstHeld:1962, lapRecordHolder:"L. Hamilton", lapRecordYear:2019,
    description:"The only figure-8 circuit on the calendar. The Esses and the crossover make it a supreme technical challenge.",
});

/* SPA-FRANCORCHAMPS — long and hilly: Eau Rouge-Raidillon (steep climb),
 * Pouhon, Blanchimont, Bus Stop chicane. */
const SPA = T({
    id:"spa", name:"Spa-Francorchamps", country:"BEL", champFamily:"OpenWheel",
    type:"closed", lengthKm:7.004, lapRecordSec:104.0,
    waypoints:[
        [200,860],[300,870],[400,860],                        // La Source hairpin
        [350,800],[300,730],[280,650],                         // Eau Rouge (descends)
        [260,580],[240,500],[230,420],                         // Raidillon climb
        [260,350],[330,300],[410,280],                         // Les Combes
        [490,270],[570,290],[640,330],                         // Malmedy
        [700,380],[740,450],[760,520],                         // Rivage
        [740,590],[690,640],[630,660],                         // Pouhon (wide)
        [560,680],[490,700],[430,730],                         // Fagnes
        [370,760],[320,800],[290,840],                         // Stavelot
        [340,880],[420,890],[520,880],                         // Blanchimont
        [620,870],[700,860],[760,840],                         // straight
        [790,800],[760,770],[720,790],                         // Bus Stop chicane
    ],
    finishIndex:0,
    features:["hilly","eau_rouge","long","fast"],
    overtakingDifficulty:0.50, tyreStress:0.70, elevationChange:0.90, drsZones:2, fuelEffect:0.45,
    sectors:3, corners:19, trackWidth:0.80,
    firstHeld:1924, lapRecordHolder:"L. Hamilton", lapRecordYear:2020,
    description:"The most beloved circuit among drivers. Eau Rouge-Raidillon uphill, extreme elevation, weather that changes between sectors.",
});

/* IMOLA — Enzo e Dino Ferrari: Tamburello, Acque Minerali, Variante Alta,
 * Rivazza. Technical and secluded, little overtaking. */
const IMOLA = T({
    id:"imola", name:"Autodromo Enzo e Dino Ferrari (Imola)", country:"ITA", champFamily:"OpenWheel",
    type:"closed", lengthKm:4.909, lapRecordSec:80.0,
    waypoints:[
        [300,860],[450,870],[600,860],[700,840],              // straight + Tamburello
        [760,790],[740,720],[680,680],                         // Tamburello chicane
        [600,670],[520,680],[460,710],                         // Villeneuve
        [400,750],[360,800],[320,820],                         // Tosa (exit)
        [280,800],[260,740],[300,690],                         // Acque Minerali (descends)
        [360,640],[440,620],[520,610],                         // Variante Alta
        [580,600],[620,560],[600,510],                         // Rivazza 1
        [540,500],[480,520],[440,560],                         // Rivazza 2
        [400,610],[380,680],[360,750],                         // Minerali return
        [330,800],[320,830],                                    // finish
    ],
    finishIndex:0,
    features:["anticlockwise","technical","narrow","historic"],
    overtakingDifficulty:0.75, tyreStress:0.55, elevationChange:0.50, drsZones:1, fuelEffect:0.35,
    sectors:3, corners:19, trackWidth:0.55,
    firstHeld:1953, lapRecordHolder:"L. Hamilton", lapRecordYear:2020,
    description:"Technical and secluded counter-clockwise circuit. Few overtakes, many fast corners: precision wins.",
});

/* INTERLAGOS — high altitude, Senna's S, Subida do Lago, Junção.
 * Sensitive to weather, exuberant fans. */
const INTERLAGOS = T({
    id:"interlagos", name:"Autódromo José Carlos Pace (Interlagos)", country:"BRA", champFamily:"OpenWheel",
    type:"closed", lengthKm:4.309, lapRecordSec:70.0,
    waypoints:[
        [400,860],[520,850],[640,830],                        // Senna straight
        [720,790],[760,730],[740,670],                         // Curva do Sol
        [680,650],[600,660],[540,680],                         // Subida do Lago
        [480,710],[440,690],[420,640],                         // Descida do Lago
        [400,580],[420,520],[480,500],                         // Vai Vai
        [540,490],[600,500],[640,530],                         // Curva do Laranjinha
        [620,580],[560,600],[500,610],                         // Pinheirinho
        [440,630],[400,660],[380,720],                         // Bipé (bump)
        [360,780],[340,820],                                    // Junção (return)
    ],
    finishIndex:0,
    features:["anticlockwise","altitude","bumpy","weather_tricky"],
    overtakingDifficulty:0.55, tyreStress:0.60, elevationChange:0.55, drsZones:2, fuelEffect:0.55,
    sectors:3, corners:15, trackWidth:0.70,
    firstHeld:1940, lapRecordHolder:"V. Bottas", lapRecordYear:2018,
    description:"High altitude (800m) and bumpy surface. Loud fans, unpredictable weather: a classic late-season round.",
});

/* ZANDVOORT — seaside dunes, banked corner, technical and fast.
 * Scheivlak, Hans Ernst, Arie Luyendykbocht. */
const ZANDVOORT = T({
    id:"zandvoort", name:"Circuit Zandvoort", country:"NLD", champFamily:"OpenWheel",
    type:"closed", lengthKm:4.259, lapRecordSec:73.0,
    waypoints:[
        [400,840],[520,850],[640,840],                        // straight
        [720,810],[760,760],[780,690],                         // Tarzan (hairpin)
        [740,640],[680,620],[620,640],                         // Gerlach
        [560,660],[500,640],[460,600],                         // Hans Ernst
        [440,540],[480,490],[560,480],                         // Scheivlak
        [640,490],[700,520],[720,580],                         // Masters (banking)
        [700,650],[640,690],[560,710],                         // Arie Luyendykbocht
        [470,730],[400,760],[360,800],                         // dunes return
    ],
    finishIndex:0,
    features:["coastal","banking","technical","dunes"],
    overtakingDifficulty:0.70, tyreStress:0.50, elevationChange:0.35, drsZones:1, fuelEffect:0.30,
    sectors:3, corners:14, trackWidth:0.60,
    firstHeld:1948, lapRecordHolder:"L. Hamilton", lapRecordYear:2021,
    description:"Among the North Sea dunes. Banked corners and few overtakes: qualifying is king.",
});

/* JEDDAH — very fast street circuit on the seafront, night race, many walls. */
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
    description:"Very fast street circuit on the Jeddah seafront, at night. Walls everywhere: no margin for error.",
});

/* AUSTIN (COTA) — technical and hilly circuit: steep Turn 1, esses, stadium. */
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
    description:"COTA: steep climb at Turn 1, technical esses and final stadium. A mix of slow and fast that rewards the complete package.",
});

/* HUNGARORING — technical, twisty, dusty: little overtaking. */
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
    description:"Monaco without the walls. Technical, twisty, dusty: overtaking is very rare, qualifying decides everything.",
});

/* BAKU — mixed street circuit: very long straight, castle narrow section. */
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
    description:"Extreme street circuit: 2 km straight and a narrow section through the old castle. Chaos and safety car almost guaranteed.",
});

/* =============================================================================
 * MOTOGP — closed circuits
 * ========================================================================== */

/* MUGELLO — very long straight, Biondetti, braking finish, San Donato. */
const MUGELLO = T({
    id:"mugello", name:"Autodromo Mugello", country:"ITA", champFamily:"Bike",
    type:"closed", lengthKm:5.245, lapRecordSec:92.0,
    waypoints:[
        [300,860],[500,870],[700,860],[850,840],              // main straight (very long)
        [900,790],[880,710],[820,650],                         // San Donato
        [740,620],[660,600],[590,580],                         // Poggiosecco
        [520,560],[460,530],[420,480],                         // Luco
        [400,420],[420,360],[480,330],                         // Arrabbiata 1
        [550,310],[620,330],[680,370],                         // Arrabbiata 2
        [730,420],[750,490],[730,560],                         // Bucine
        [690,610],[640,640],[580,650],                         // Biondetti 1
        [510,660],[450,680],[400,720],                         // Biondetti 2
        [350,770],[320,820],                                    // Correntaio (return)
    ],
    finishIndex:0,
    features:["longstraight","flowing","fast"],
    overtakingDifficulty:0.40, tyreStress:0.45, elevationChange:0.35, drsZones:0, fuelEffect:0.25,
    sectors:3, corners:15, trackWidth:0.75,
    firstHeld:1919, lapRecordHolder:"-", lapRecordYear:0,
    description:"1.1 km straight where bikes reach 350+ km/h. Continuous flow through the Tuscan hills.",
});

/* SACHSENRING — narrow, many left-handers, Waterfall. */
const SACHSENRING = T({
    id:"sachsenring", name:"Sachsenring", country:"DEU", champFamily:"Bike",
    type:"closed", lengthKm:3.671, lapRecordSec:78.0,
    waypoints:[
        [500,820],[620,830],[720,810],                        // straight
        [780,760],[760,690],[700,660],                         // Turn 1 (Coca-Cola curve)
        [630,650],[560,640],[500,620],                         // series of lefts
        [440,600],[390,570],[360,520],                         // lefts continue
        [340,460],[360,400],[420,370],                         // Ruckwand
        [490,360],[560,370],[620,390],                         // Omega
        [680,420],[720,460],[740,520],                         // waterfall
        [720,580],[670,620],[610,640],                         // Queckenberg
        [540,660],[470,680],[400,710],                         // final branch
        [340,750],[320,790],[350,810],                         // return
    ],
    finishIndex:0,
    features:["tight","manyleft","technical"],
    overtakingDifficulty:0.70, tyreStress:0.35, elevationChange:0.30, drsZones:0, fuelEffect:0.25,
    sectors:3, corners:13, trackWidth:0.65,
    firstHeld:1996, lapRecordHolder:"-", lapRecordYear:0,
    description:"Favors left-handers. The downhill Waterfall is the key point: whoever lacks grip goes out here.",
});

/* MISANO — coastal, fast flowing, Tramonto (final corner). */
const MISANO = T({
    id:"misano", name:"Misano World Circuit", country:"ITA", champFamily:"Bike",
    type:"closed", lengthKm:4.226, lapRecordSec:87.0,
    waypoints:[
        [400,800],[520,820],[640,810],                        // straight
        [740,780],[780,710],[760,640],                         // Curvone
        [710,590],[640,570],[570,560],                         // chicane
        [500,550],[440,530],[400,490],                         // Curva del Carro
        [370,430],[390,370],[450,350],                         // Tramonto start
        [520,340],[600,350],[670,380],                         // continuation
        [730,410],[780,450],[800,510],                         // Quercia
        [780,570],[730,610],[670,630],                         // return (toward straight)
    ],
    finishIndex:0,
    features:["flowing","coastal","medium"],
    overtakingDifficulty:0.55, tyreStress:0.40, elevationChange:0.15, drsZones:0, fuelEffect:0.25,
    sectors:3, corners:16, trackWidth:0.72,
    firstHeld:1972, lapRecordHolder:"-", lapRecordYear:0,
    description:"On the Adriatic Sea. Fast flowing and the Tramonto corner, at sunset, blinds the riders.",
});

/* PHILLIP ISLAND — constant wind, ocean views, very fast corners,
 * Lukey Heights uphill. Suited to fast bikes. */
const PHILLIP_ISLAND = T({
    id:"phillip_island", name:"Phillip Island Grand Prix Circuit", country:"AUS", champFamily:"Bike",
    type:"closed", lengthKm:4.448, lapRecordSec:88.0,
    waypoints:[
        [300,820],[420,840],[540,830],                        // Doohan straight
        [640,800],[700,750],[720,680],                         // Honda (turn 1)
        [700,620],[640,600],[580,620],                         // Southern Loop
        [520,640],[480,690],[440,730],                         // Miller
        [400,710],[380,650],[420,600],                         // Lukey Heights (uphill)
        [480,580],[560,570],[640,560],                         // MG (very fast)
        [720,540],[780,560],[820,610],                         // Stefan (right turn)
        [800,670],[740,690],[660,700],                         // Siberia
        [580,710],[500,720],[420,730],                         // Hayshed return
        [360,770],[320,810],                                    // Gardner (finish)
    ],
    finishIndex:0,
    features:["coastal","windy","fastflowing"],
    overtakingDifficulty:0.45, tyreStress:0.35, elevationChange:0.25, drsZones:0, fuelEffect:0.20,
    sectors:3, corners:12, trackWidth:0.78,
    firstHeld:1956, lapRecordHolder:"-", lapRecordYear:0,
    description:"Constant ocean wind and very fast corners. Bikes fly here: the pace is relentless.",
});

/* ASSEN — "Cathedral of Speed": technical, historically on roads,
 * now a dedicated circuit. Final hairpin at Geert Boer. */
const ASSEN = T({
    id:"assen", name:"TT Circuit Assen", country:"NLD", champFamily:"Bike",
    type:"closed", lengthKm:4.555, lapRecordSec:84.0,
    waypoints:[
        [400,830],[520,840],[640,820],                        // straight
        [720,780],[760,720],[740,660],                         // Haarbocht (turn 1)
        [680,640],[620,660],[580,710],                         // Mandeveen
        [540,740],[480,730],[440,690],                         // Mastersen
        [420,640],[460,590],[540,580],                         // Briel
        [620,580],[700,570],[760,540],                         // Stekkenwal
        [780,490],[740,440],[680,430],                         // De Bult
        [620,450],[580,490],[560,550],                         // Ramshoek
        [520,610],[460,640],[400,660],                         // Geert Boer (hairpin)
        [340,690],[320,740],[340,790],                         // finish return
    ],
    finishIndex:0,
    features:["technical","flowing","historic"],
    overtakingDifficulty:0.60, tyreStress:0.40, elevationChange:0.20, drsZones:0, fuelEffect:0.25,
    sectors:3, corners:18, trackWidth:0.70,
    firstHeld:1925, lapRecordHolder:"-", lapRecordYear:0,
    description:"The Cathedral of two wheels. Technical and continuous flow: only the most balanced bikes dominate.",
});

/* =============================================================================
 * WEC — closed circuits (very long)
 * ========================================================================== */

/* LE MANS — legendary: very long Hunaudières (Mulsanne) straight,
 * Mulsanne corners, Indianapolis, Arnage, Ford Chicane. */
const LEMANS = T({
    id:"lemans", name:"Circuit de la Sarthe (Le Mans)", country:"FRA", champFamily:"Endurance",
    type:"closed", lengthKm:13.626, lapRecordSec:200.0,
    waypoints:[
        [200,800],[350,820],[500,830],[650,820],[800,800],   // pit straight
        [860,760],[840,690],[780,650],                         // Dunlop
        [720,620],[680,560],[700,490],                         // Esses
        [740,420],[820,400],[900,420],                         // Hunaudières start (Mulsanne Straight)
        [950,460],[940,540],[880,590],                         // Mulsanne (with chicane)
        [820,620],[760,650],[720,710],                         // Indianapolis
        [680,770],[600,790],[520,780],                         // Arnage
        [440,760],[380,720],[340,660],                         // Porsche Curves start
        [310,590],[330,520],[390,480],                         // Porsche Curves
        [460,460],[530,450],[590,470],                         // Maison Blanche
        [640,500],[680,550],[700,620],                         // Ford Chicane
        [660,690],[590,720],[520,740],                         // finish return
    ],
    finishIndex:0,
    features:["long","hunaudieres","night","prestigious","multiclass"],
    overtakingDifficulty:0.40, tyreStress:0.60, elevationChange:0.30, drsZones:0, fuelEffect:0.45,
    sectors:3, corners:38, trackWidth:0.82,
    firstHeld:1923, lapRecordHolder:"-", lapRecordYear:0,
    description:"Legendary 24 hours. 6 km straight, night race, multiclass traffic: the supreme endurance test.",
});

/* FUJI — long straight, 100R hairpin, Coca-Cola corner. */
const FUJI = T({
    id:"fuji", name:"Fuji Speedway", country:"JPN", champFamily:"Endurance",
    type:"closed", lengthKm:4.563, lapRecordSec:105.0,
    waypoints:[
        [200,840],[400,860],[600,870],[800,860],              // straight (1.5km)
        [880,830],[860,760],[800,720],                         // Turn 1 (Dunlop)
        [730,710],[660,730],[610,780],                         // 100R hairpin
        [570,830],[520,850],[460,840],                         // Coca-Cola Corner
        [410,810],[380,760],[400,700],                         // Hairpin Curve
        [450,660],[520,640],[590,660],                         // turn back right
        [640,690],[680,730],[660,780],                         // Grantour
    ],
    finishIndex:0,
    features:["longstraight","hairpin","scenic"],
    overtakingDifficulty:0.30, tyreStress:0.40, elevationChange:0.20, drsZones:0, fuelEffect:0.50,
    sectors:3, corners:16, trackWidth:0.80,
    firstHeld:1966, lapRecordHolder:"-", lapRecordYear:0,
    description:"1.5 km straight at the foot of Mount Fuji. High altitude: the engine breathes less and consumes more.",
});

/* SEBRING — former airfield track, bumpy and technical, legendary US.
 * Ulmann, Big Bend, Hairpin, Tower. */
const SEBRING = T({
    id:"sebring", name:"Sebring International Raceway", country:"USA", champFamily:"Endurance",
    type:"closed", lengthKm:6.019, lapRecordSec:120.0,
    waypoints:[
        [300,830],[420,840],[540,820],[660,830],              // front straight
        [760,810],[820,760],[820,690],                         // Turn 1 (Johnson)
        [780,650],[700,660],[620,680],                         // Big Bend
        [540,700],[460,710],[400,700],                         // Warehouse
        [340,690],[320,640],[360,600],                         // Ulmann (hairpin)
        [420,580],[500,570],[580,560],                         // Hairpin (turn 10)
        [660,560],[740,560],[820,560],                         // Collier (straight)
        [860,580],[840,640],[780,670],                         // Tower
        [700,680],[620,690],[540,690],                         // Sunset Bend
        [460,700],[400,720],[360,760],                         // return
    ],
    finishIndex:0,
    features:["bumpy","airfield","technical","12hours"],
    overtakingDifficulty:0.50, tyreStress:0.65, elevationChange:0.10, drsZones:0, fuelEffect:0.40,
    sectors:3, corners:17, trackWidth:0.72,
    firstHeld:1950, lapRecordHolder:"-", lapRecordYear:0,
    description:"Former airfield track, bumpy and broken surface. The most brutal and physical 12 Hours on the WEC calendar.",
});

/* SPA reused for WEC (same definition, Endurance family) */
const SPA_WEC = T({ ...SPA, id:"spa_wec", champFamily:"Endurance" });

/* =============================================================================
 * WRC — "open" special stages (A->B) on variable surface
 * ========================================================================== */

/* MONTE CARLO — twisty mountain asphalt, often snow/ice in places. */
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
    description:"Mountain asphalt with snow/ice in places. Mixed grip: tyre choice is a gamble.",
});

/* FINLANDIA — very fast gravel with jumps (crests), the "rally of 1000 lakes". */
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
    description:"Very fast gravel with blind jumps over crests. So fast it requires absolute bravery.",
});

/* GB WALES — mud, forests, poor visibility, slippery. */
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
    description:"Mud and forests. Poor visibility and slippery surface: a discipline for mud lovers and the patient.",
});

/* KENYA — Safari Rally: sand, dust, rocks, heat.
 * "Rally of machinery": endurance matters more than speed. */
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
    description:"Safari Rally: rocks, dust and heat. The mechanics suffer: more about endurance than speed.",
});

/* =============================================================================
 * DAKAR — "open" stages on sand/desert/mountain
 * ========================================================================== */

/* DUNE STAGE — endless dunes, critical navigation, soft sand. */
const DAKAR_DUNE = T({
    id:"dakar_dune", name:"Dakar — Dune Stage (Empty Quarter)", country:"SAU", champFamily:"Raid",
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
    description:"Endless dunes and soft sand. Navigation matters more than speed: getting lost costs hours.",
});

/* DESERT STAGE — fast tracks among rocky fields, less sand. */
const DAKAR_DESERTO = T({
    id:"dakar_deserto", name:"Dakar — Desert Stage (Nefud)", country:"SAU", champFamily:"Raid",
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
    description:"Fast tracks among rocky fields. Stones destroy suspensions and tyres: whoever goes too fast breaks.",
});

/* MOUNTAIN STAGE — climbs, descents, rocks, high altitude. */
const DAKAR_MONTAGNA = T({
    id:"dakar_montagna", name:"Dakar — Mountain Stage (Hijaz)", country:"SAU", champFamily:"Raid",
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
    description:"High altitude among the Hijaz mountains. Less oxygen = less power, and navigation is even more critical.",
});

/* =============================================================================
 * GT CIRCUITS (reuse existing tracks + new dedicated ones)
 * ========================================================================== */

/* NURBURGRING — abbreviated Nordschleife, technical and hilly for GT. */
const NURBURGRING_GT = T({
    id:"nurburgring_gt", name:"Nürburgring GP", country:"DEU", champFamily:"GT",
    type:"closed", lengthKm:5.148, lapRecordSec:95.0,
    waypoints:[
        [400,860],[500,850],[600,840],[700,830],
        [780,800],[760,730],[700,700],[620,710],
        [540,720],[460,710],[400,680],[380,620],
        [420,560],[500,540],[580,550],[660,580],
        [720,620],[760,680],[780,610],[740,540],
        [680,490],[600,480],[520,500],[460,530],
        [420,580],[380,630],[360,700],[350,780],
    ],
    finishIndex:0,
    features:["technical","forest","elevation","german"],
    overtakingDifficulty:0.55, tyreStress:0.65, elevationChange:0.50, drsZones:0, fuelEffect:0.35,
    sectors:3, corners:15, trackWidth:0.75,
    firstHeld:1984, lapRecordHolder:"-", lapRecordYear:0,
    description:"Technical circuit in the Eifel forest. Elevation and variable weather: a complete test for GTs.",
});

/* BARCELONA — Catalunya: technical, sector 3 decisive for lap time. */
const BARCELONA = T({
    id:"barcelona", name:"Circuit de Barcelona-Catalunya", country:"ESP", champFamily:"GT",
    type:"closed", lengthKm:4.655, lapRecordSec:78.0,
    waypoints:[
        [400,850],[500,860],[600,850],[700,820],
        [760,770],[740,700],[680,690],[620,710],
        [560,730],[500,720],[460,670],[500,610],
        [580,590],[660,600],[740,610],[780,560],
        [760,490],[700,480],[640,500],[600,540],
        [560,520],[620,480],[680,460],[660,400],
        [600,390],[520,410],[460,450],[420,520],
        [380,600],[360,700],[370,800],
    ],
    finishIndex:0,
    features:["technical","flowing","test_circuit","mediterranean"],
    overtakingDifficulty:0.65, tyreStress:0.55, elevationChange:0.35, drsZones:1, fuelEffect:0.30,
    sectors:3, corners:16, trackWidth:0.75,
    firstHeld:1991, lapRecordHolder:"-", lapRecordYear:0,
    description:"Winter testing circuit. The final sector 3 is the key: whoever closes well here sets the time.",
});

/* MONZA GT — narrower variant for GT3 (base reuse) */
const MONZA_GT = T({ ...MONZA, id:"monza_gt", champFamily:"GT", lengthKm:5.793, trackWidth:0.70 });

/* SPA GT — for GT World Challenge */
const SPA_GT = T({ ...SPA, id:"spa_gt", champFamily:"GT" });

/* =============================================================================
 * TOURING CAR CIRCUITS
 * ========================================================================== */

/* MACAU — legendary street circuit for WTCC/WTCR, narrow and dangerous. */
const MACAU = T({
    id:"macau", name:"Circuito da Guia (Macau)", country:"MAC", champFamily:"TouringCar",
    type:"closed", lengthKm:6.120, lapRecordSec:125.0,
    waypoints:[
        [200,850],[320,860],[440,850],[560,840],
        [660,810],[700,750],[680,680],[620,660],
        [560,680],[500,700],[460,670],[440,610],
        [480,550],[540,530],[600,550],[640,600],
        [620,660],[560,670],[500,650],[460,610],
        [420,550],[400,480],[440,410],[500,380],
        [560,400],[580,460],[540,510],[480,490],
        [420,470],[380,420],[400,360],[460,330],
        [540,340],[600,370],[580,430],[520,450],
        [460,430],[400,400],[350,450],[320,520],
        [300,600],[290,700],[280,800],
    ],
    finishIndex:0,
    features:["street","tight","dangerous","iconic","melbourne_hairpin"],
    overtakingDifficulty:0.90, tyreStress:0.40, elevationChange:0.45, drsZones:0, fuelEffect:0.30,
    sectors:3, corners:23, trackWidth:0.30,
    firstHeld:1954, lapRecordHolder:"-", lapRecordYear:0,
    description:"Legendary street circuit. Narrow, fast, walls everywhere: the most dangerous touring car race in the world.",
});

/* THAI BURIRAM — Chang International, modern circuit for WTCR. */
const BURIRAM = T({
    id:"buriram", name:"Chang International Circuit", country:"THA", champFamily:"TouringCar",
    type:"closed", lengthKm:4.554, lapRecordSec:82.0,
    waypoints:[
        [400,850],[520,860],[640,850],[740,820],
        [780,760],[760,690],[700,670],[620,680],
        [540,700],[460,690],[400,660],[380,600],
        [420,540],[500,520],[580,540],[660,560],
        [740,570],[800,540],[820,480],[780,420],
        [700,410],[620,430],[540,460],[480,490],
        [420,510],[380,560],[360,650],[360,750],
    ],
    finishIndex:0,
    features:["modern","technical","asia","flowing"],
    overtakingDifficulty:0.50, tyreStress:0.50, elevationChange:0.15, drsZones:1, fuelEffect:0.30,
    sectors:3, corners:14, trackWidth:0.78,
    firstHeld:2014, lapRecordHolder:"-", lapRecordYear:0,
    description:"Modern circuit in Thailand. Technical and continuous flow: great for overtaking among touring cars.",
});

/* INTERLAGOS TC — for Stock Car Brasil (base reuse, different family) */
const INTERLAGOS_TC = T({ ...INTERLAGOS, id:"interlagos_tc", champFamily:"TouringCar" });

/* =============================================================================
 * REGIONAL RALLY SPECIAL STAGES
 * ========================================================================== */

/* SS AZORES — Rally Azores, volcanic soil, jumps, lunar landscape. */
const SS_AZORES = T({
    id:"ss_azores", name:"SS Rally Açores — Sete Cidades", country:"PRT", champFamily:"Rally",
    type:"open", lengthKm:18.5, lapRecordSec:720,
    waypoints:[
        [100,840],[180,780],[140,700],[220,650],[180,580],
        [260,540],[340,580],[300,640],[380,680],[440,640],
        [380,580],[460,520],[540,560],[500,620],[580,660],
        [640,620],[600,560],[680,500],[760,540],[720,600],
        [800,640],[860,580],[820,500],[880,420],[900,340],
    ],
    finishIndex:0,
    surface:"gravel",
    features:["volcanic","crests","scenic","island"],
    overtakingDifficulty:0.70, tyreStress:0.55, elevationChange:0.65, drsZones:0, fuelEffect:0.35,
    sectors:3, corners:28, trackWidth:0.50,
    firstHeld:1965, lapRecordHolder:"-", lapRecordYear:0,
    description:"Volcanic soil of the Azores. Blind crests and lunar landscape: unique in the ERC calendar.",
});

/* SS IVORY COAST — Rallye d'Ivoire, Africa, heat and sand. */
const SS_IVORY = T({
    id:"ss_ivory", name:"SS Rallye d'Ivoire — Yamoussoukro", country:"CIV", champFamily:"Rally",
    type:"open", lengthKm:22.0, lapRecordSec:840,
    waypoints:[
        [100,850],[220,830],[300,780],[260,700],[340,650],
        [420,690],[380,600],[460,560],[540,600],[500,520],
        [580,480],[660,520],[620,600],[700,640],[780,600],
        [740,520],[820,480],[880,420],[840,340],[760,320],
        [680,360],[600,340],[520,360],[440,400],[380,460],
        [300,500],[240,560],[200,640],[160,720],[140,800],
    ],
    finishIndex:0,
    surface:"gravel",
    features:["africa","heat","dust","tropical"],
    overtakingDifficulty:0.65, tyreStress:0.65, elevationChange:0.35, drsZones:0, fuelEffect:0.55,
    sectors:3, corners:30, trackWidth:0.55,
    firstHeld:1978, lapRecordHolder:"-", lapRecordYear:0,
    description:"African rally: scorching heat, dust and wide tracks. The mechanics suffer from the temperatures.",
});

/* SS JAPAN — Rally Japan, narrow mountain asphalt. */
const SS_JAPAN = T({
    id:"ss_japan", name:"SS Rally Japan — Rikubetsu", country:"JPN", champFamily:"Rally",
    type:"open", lengthKm:20.0, lapRecordSec:760,
    waypoints:[
        [100,860],[180,800],[140,730],[220,680],[180,610],
        [260,560],[340,600],[300,540],[380,490],[460,530],
        [420,590],[500,630],[560,590],[520,510],[600,470],
        [680,510],[640,580],[720,620],[780,580],[740,500],
        [820,460],[880,400],[840,320],[760,300],[680,340],
    ],
    finishIndex:0,
    surface:"asphalt",
    features:["mountain","tight","forest","asphalt"],
    overtakingDifficulty:0.80, tyreStress:0.45, elevationChange:0.70, drsZones:0, fuelEffect:0.30,
    sectors:3, corners:32, trackWidth:0.40,
    firstHeld:1980, lapRecordHolder:"-", lapRecordYear:0,
    description:"Japanese mountain asphalt, narrow through the forests. Technical and precise: requires surgical driving.",
});

/* SS ARGENTINA — Rally CODASUR, red dirt and jumps. */
const SS_ARGENTINA = T({
    id:"ss_argentina", name:"SS Rally Argentina — El Condor", country:"ARG", champFamily:"Rally",
    type:"open", lengthKm:24.0, lapRecordSec:880,
    waypoints:[
        [100,840],[200,800],[280,740],[240,660],[320,620],
        [400,660],[360,580],[440,540],[520,580],[480,500],
        [560,460],[640,500],[600,580],[680,620],[760,580],
        [720,500],[800,460],[860,400],[820,320],[740,340],
        [660,380],[580,360],[500,400],[420,440],[340,480],
        [280,540],[240,620],[200,700],[160,780],
    ],
    finishIndex:0,
    surface:"gravel",
    features:["red_dirt","jumps","fans","south_america"],
    overtakingDifficulty:0.65, tyreStress:0.60, elevationChange:0.75, drsZones:0, fuelEffect:0.40,
    sectors:3, corners:35, trackWidth:0.55,
    firstHeld:1980, lapRecordHolder:"-", lapRecordYear:0,
    description:"Red dirt and spectacular jumps. The Argentine fans are the most passionate in the rally world.",
});

/* SS MIDDLE EAST — Rally MERC, sand and heat. */
const SS_MIDEAST = T({
    id:"ss_mideast", name:"SS Middle East Rally — Jordan", country:"JOR", champFamily:"Rally",
    type:"open", lengthKm:19.0, lapRecordSec:700,
    waypoints:[
        [100,850],[200,800],[280,730],[240,650],[320,600],
        [400,640],[360,560],[440,520],[520,560],[480,480],
        [560,440],[640,480],[600,560],[680,600],[760,560],
        [720,480],[800,440],[860,380],[820,300],[740,320],
    ],
    finishIndex:0,
    surface:"gravel",
    features:["desert","heat","dust","rocks"],
    overtakingDifficulty:0.70, tyreStress:0.70, elevationChange:0.40, drsZones:0, fuelEffect:0.55,
    sectors:3, corners:25, trackWidth:0.50,
    firstHeld:1981, lapRecordHolder:"-", lapRecordYear:0,
    description:"Desert tracks in Jordan. Sand, rocks and heat: the mechanics are severely tested.",
});

/* SS MEXICO — Rally NACAM, high altitude and dirt. */
const SS_MEXICO = T({
    id:"ss_mexico", name:"SS Rally Mexico — Guanajuato", country:"MEX", champFamily:"Rally",
    type:"open", lengthKm:21.0, lapRecordSec:780,
    waypoints:[
        [100,860],[180,800],[240,730],[200,650],[280,610],
        [360,650],[320,570],[400,530],[480,570],[440,490],
        [520,450],[600,490],[560,570],[640,610],[720,570],
        [680,490],[760,450],[820,390],[780,310],[700,330],
        [620,370],[540,350],[460,390],[380,430],
    ],
    finishIndex:0,
    surface:"gravel",
    features:["altitude","dust","fans","vibrant"],
    overtakingDifficulty:0.68, tyreStress:0.62, elevationChange:0.55, drsZones:0, fuelEffect:0.50,
    sectors:3, corners:28, trackWidth:0.52,
    firstHeld:1978, lapRecordHolder:"-", lapRecordYear:0,
    description:"High altitude in Guanajuato. Less oxygen = less power, and the dusty roads are slippery.",
});

/* SS REGIONAL — generic amateur stage on asphalt+dirt. */
const SS_REGIONAL = T({
    id:"ss_regional", name:"SS Rally Cup Regionale — Colline", country:"ITA", champFamily:"Rally",
    type:"open", lengthKm:12.0, lapRecordSec:480,
    waypoints:[
        [100,840],[180,780],[220,700],[300,650],[260,580],
        [340,530],[420,570],[380,490],[460,450],[540,490],
        [500,410],[580,370],[660,410],[620,490],[700,530],
        [760,470],[820,410],[780,330],[700,310],[620,350],
    ],
    finishIndex:0,
    surface:"asphalt",
    features:["amateur","mixed_surface","hills","regional"],
    overtakingDifficulty:0.75, tyreStress:0.40, elevationChange:0.50, drsZones:0, fuelEffect:0.25,
    sectors:3, corners:20, trackWidth:0.45,
    firstHeld:1990, lapRecordHolder:"-", lapRecordYear:0,
    description:"Regional amateur stage on hill roads. Mixed asphalt-dirt: passion at the local level.",
});

/* =============================================================================
 * RALLYCROSS CIRCUITS
 * ========================================================================== */

/* HOLJES — Swedish rallycross circuit, short with joker lap. */
const HOLJES = T({
    id:"holjes", name:"Höljes Motorstadion", country:"SWE", champFamily:"Rallycross",
    type:"closed", lengthKm:1.150, lapRecordSec:50.0,
    waypoints:[
        [400,800],[520,810],[600,790],[640,740],
        [600,690],[540,680],[460,690],[420,650],   // joker merge
        [480,620],[560,610],[640,620],[700,650],
        [740,690],[720,740],[660,770],[580,780],
    ],
    finishIndex:0,
    features:["short","mixed_surface","joker_lap","banking","swedish"],
    overtakingDifficulty:0.40, tyreStress:0.30, elevationChange:0.30, drsZones:0, fuelEffect:0.15,
    sectors:1, corners:8, trackWidth:0.65,
    firstHeld:1974, lapRecordHolder:"-", lapRecordYear:0,
    description:"The temple of rallycross. Short, mixed asphalt-dirt, decisive joker lap: guaranteed spectacle.",
});

/* LOHEAC — French rallycross circuit. */
const LOHEAC = T({
    id:"loheac", name:"Circuit de Loheac", country:"FRA", champFamily:"Rallycross",
    type:"closed", lengthKm:1.050, lapRecordSec:48.0,
    waypoints:[
        [400,820],[500,830],[580,810],[640,760],
        [600,700],[540,690],[480,700],[440,660],
        [500,630],[580,620],[660,640],[720,670],
        [740,720],[700,760],[620,790],[520,800],
    ],
    finishIndex:0,
    features:["short","mixed_surface","joker_lap","french"],
    overtakingDifficulty:0.45, tyreStress:0.28, elevationChange:0.20, drsZones:0, fuelEffect:0.12,
    sectors:1, corners:7, trackWidth:0.65,
    firstHeld:1976, lapRecordHolder:"-", lapRecordYear:0,
    description:"French rallycross circuit. Technical and scenic: the crowd is just a few meters from the cars.",
});

/* AUTOCROSS TRACK — generic for autocross championship. */
const AUTOCROSS_TRACK = T({
    id:"autocross_track", name:"Autocross Circuit", country:"EUR", champFamily:"Rallycross",
    type:"closed", lengthKm:0.800, lapRecordSec:38.0,
    waypoints:[
        [400,800],[500,810],[580,790],[620,740],
        [580,690],[500,680],[440,700],[400,660],
        [480,630],[560,620],[620,640],[660,680],
        [680,730],[640,770],[560,790],
    ],
    finishIndex:0,
    features:["dirt_only","short","amateur","offroad"],
    overtakingDifficulty:0.50, tyreStress:0.25, elevationChange:0.15, drsZones:0, fuelEffect:0.10,
    sectors:1, corners:6, trackWidth:0.60,
    firstHeld:1980, lapRecordHolder:"-", lapRecordYear:0,
    description:"Dirt circuit for autocross. Short and twisty: pure off-road with no asphalt.",
});

/* =============================================================================
 * ADDITIONAL RAID STAGES (W2RC, Baja Cup)
 * ========================================================================== */

/* BAJA STAGE — desert sprint raid (Baja Cup). */
const BAJA_DESERT = T({
    id:"baja_desert", name:"Baja — Desert Sprint", country:"MEX", champFamily:"Raid",
    type:"open", lengthKm:280, lapRecordSec:7200,
    waypoints:[
        [100,840],[220,820],[340,830],[460,810],[580,820],
        [700,800],[780,750],[740,670],[660,650],[580,670],
        [500,650],[420,670],[340,650],[280,610],[340,560],
        [420,580],[500,560],[580,580],[660,560],[740,540],
        [820,510],[880,450],[840,370],[760,350],[680,380],
        [600,360],[520,390],[440,410],[360,380],
    ],
    finishIndex:0,
    surface:"sand",
    features:["desert","highspeed","endurance","navigation"],
    overtakingDifficulty:0.75, tyreStress:0.85, elevationChange:0.35, drsZones:0, fuelEffect:0.65,
    sectors:3, corners:30, trackWidth:0.70,
    firstHeld:1967, lapRecordHolder:"-", lapRecordYear:0,
    description:"Sprint through the Baja desert. Fast and dusty tracks: mechanical endurance and navigation.",
});

/* ATACAMA STAGE — W2RC, ultra-dry Chilean desert. */
const ATACAMA = T({
    id:"atacama", name:"W2RC — Atacama Crossing", country:"CHL", champFamily:"Raid",
    type:"open", lengthKm:320, lapRecordSec:8400,
    waypoints:[
        [100,860],[240,840],[380,850],[520,830],[660,840],
        [780,810],[860,750],[820,670],[740,650],[660,670],
        [580,650],[500,670],[420,650],[340,630],[280,580],
        [340,530],[420,550],[500,530],[580,550],[660,530],
        [740,510],[820,480],[880,420],[840,340],[760,320],
        [680,360],[600,340],[520,370],
    ],
    finishIndex:0,
    surface:"gravel",
    features:["desert","dry","altitude","navigation","endurance"],
    overtakingDifficulty:0.80, tyreStress:0.80, elevationChange:0.50, drsZones:0, fuelEffect:0.70,
    sectors:3, corners:40, trackWidth:0.65,
    firstHeld:2010, lapRecordHolder:"-", lapRecordYear:0,
    description:"Atacama Desert, the driest in the world. Fine dust everywhere, high altitude, critical navigation.",
});

/* =============================================================================
 * ADDITIONAL BIKE CIRCUITS (WSBK, Supersport, EWC)
 * ========================================================================== */

/* ARAGON — Motorland Aragon, technical and varied for WSBK. */
const ARAGON = T({
    id:"aragon", name:"Motorland Aragón", country:"ESP", champFamily:"Bike",
    type:"closed", lengthKm:5.077, lapRecordSec:93.0,
    waypoints:[
        [400,850],[500,860],[600,850],[700,830],
        [780,790],[760,720],[700,700],[620,710],
        [540,720],[460,710],[420,660],[460,600],
        [540,580],[620,600],[700,610],[780,590],
        [820,530],[780,470],[700,460],[620,480],
        [540,500],[480,530],[440,580],[400,630],
        [380,700],[370,780],
    ],
    finishIndex:0,
    features:["technical","flowing","variety","spanish"],
    overtakingDifficulty:0.50, tyreStress:0.50, elevationChange:0.40, drsZones:0, fuelEffect:0.30,
    sectors:3, corners:17, trackWidth:0.75,
    firstHeld:2009, lapRecordHolder:"-", lapRecordYear:0,
    description:"Technical and varied circuit. Designed by Hermann Tilke: a mix of slow and fast corners for bikes.",
});

/* PORTIMAO — Autodromo do Algarve, hilly and technical. */
const PORTIMAO = T({
    id:"portimao", name:"Autódromo do Algarve (Portimão)", country:"PRT", champFamily:"Bike",
    type:"closed", lengthKm:4.692, lapRecordSec:90.0,
    waypoints:[
        [400,840],[500,850],[600,840],[700,820],
        [780,770],[760,700],[700,680],[620,690],
        [540,700],[460,690],[400,650],[420,590],
        [500,570],[580,580],[660,590],[740,580],
        [800,540],[820,470],[780,410],[700,420],
        [620,440],[540,460],[480,490],[440,540],
        [400,600],[370,700],[380,780],
    ],
    finishIndex:0,
    features:["hilly","technical","flowing","portuguese"],
    overtakingDifficulty:0.60, tyreStress:0.55, elevationChange:0.55, drsZones:0, fuelEffect:0.30,
    sectors:3, corners:16, trackWidth:0.72,
    firstHeld:2008, lapRecordHolder:"-", lapRecordYear:0,
    description:"Hilly and technical in the Algarve. Significant elevation: bikes get unbalanced in blind corners.",
});

/* SLOVAKIARING — for FIM EWC bike endurance. */
const SLOVAKIARING = T({
    id:"slovakiaring", name:"Slovakia Ring", country:"SVK", champFamily:"Bike",
    type:"closed", lengthKm:5.922, lapRecordSec:115.0,
    waypoints:[
        [400,850],[520,860],[640,850],[760,830],
        [840,780],[820,710],[760,680],[680,700],
        [600,720],[520,710],[460,680],[440,620],
        [480,560],[560,540],[640,550],[720,560],
        [800,540],[840,480],[820,410],[760,390],
        [680,410],[600,430],[520,460],[460,500],
        [420,560],[400,630],[390,720],[395,800],
    ],
    finishIndex:0,
    features:["long","technical","endurance","slovak"],
    overtakingDifficulty:0.45, tyreStress:0.45, elevationChange:0.25, drsZones:0, fuelEffect:0.30,
    sectors:3, corners:16, trackWidth:0.80,
    firstHeld:2009, lapRecordHolder:"-", lapRecordYear:0,
    description:"Long and technical circuit in Slovakia. Hosts bike endurance races: consistency is everything.",
});

/* =============================================================================
 * MOTOCROSS / OFFROAD BIKE CIRCUITS
 * ========================================================================== */

/* MXGP MANTOVA — dirt motocross circuit, continuous jumps. */
const MX_MANTOVA = T({
    id:"mx_mantova", name:"Mantova MXGP", country:"ITA", champFamily:"Motocross",
    type:"closed", lengthKm:1.850, lapRecordSec:105.0,
    waypoints:[
        [400,800],[500,810],[560,780],[580,730],
        [540,690],[480,690],[440,710],[400,690],
        [380,640],[420,600],[480,590],[540,610],
        [580,640],[620,680],[660,710],[680,760],
        [660,800],[600,810],[520,810],
    ],
    finishIndex:0,
    surface:"dirt",
    features:["dirt","jumps","whoops","italian","mxgp"],
    overtakingDifficulty:0.60, tyreStress:0.20, elevationChange:0.30, drsZones:0, fuelEffect:0.10,
    sectors:1, corners:12, trackWidth:0.55,
    firstHeld:1980, lapRecordHolder:"-", lapRecordYear:0,
    description:"Dirt motocross circuit. Jumps, whoops and ruts: physically extreme, whoever gives up first loses.",
});

/* MXGP VILLADEVERO — sandy dirt, very fast. */
const MX_VILLADEVERO = T({
    id:"mx_villadevero", name:"Villadevero MXGP", country:"ESP", champFamily:"Motocross",
    type:"closed", lengthKm:1.750, lapRecordSec:100.0,
    waypoints:[
        [400,820],[500,830],[600,820],[680,790],
        [700,730],[660,680],[580,670],[500,680],
        [440,700],[400,670],[380,620],[440,590],
        [520,580],[600,600],[660,630],[700,680],
        [680,750],[600,800],[500,820],
    ],
    finishIndex:0,
    surface:"dirt",
    features:["sandy_dirt","fast","jumps","spanish"],
    overtakingDifficulty:0.55, tyreStress:0.25, elevationChange:0.25, drsZones:0, fuelEffect:0.10,
    sectors:1, corners:10, trackWidth:0.58,
    firstHeld:1995, lapRecordHolder:"-", lapRecordYear:0,
    description:"Spanish sandy dirt. Fast and flowing: whoever has courage in the jumps gains.",
});

/* SUPERENDURO ARENA — indoor, obstacles, logs, rocks. */
const SE_ARENA = T({
    id:"se_arena", name:"SuperEnduro Arena", country:"INT", champFamily:"Motocross",
    type:"closed", lengthKm:0.500, lapRecordSec:45.0,
    waypoints:[
        [400,780],[480,790],[540,770],[560,720],
        [520,680],[460,670],[420,690],[400,650],
        [440,620],[500,610],[560,630],[580,680],
        [600,730],[560,770],[480,780],
    ],
    finishIndex:0,
    surface:"dirt",
    features:["indoor","obstacles","logs","rocks","extreme"],
    overtakingDifficulty:0.80, tyreStress:0.15, elevationChange:0.40, drsZones:0, fuelEffect:0.05,
    sectors:1, corners:8, trackWidth:0.40,
    firstHeld:2000, lapRecordHolder:"-", lapRecordYear:0,
    description:"Indoor arena with extreme obstacles: logs, boulders, steps. Whoever touches the ground with their feet loses points.",
});

/* TRIAL SECTION — trial observation zone (no time, penalties). */
const TRIAL_SECTION = T({
    id:"trial_section", name:"Trial Section — Mont-ROCK", country:"ESP", champFamily:"Trial",
    type:"closed", lengthKm:0.050, lapRecordSec:0,
    waypoints:[
        [450,750],[470,720],[490,700],[510,680],
        [500,650],[480,630],[500,610],[520,590],
        [500,570],[480,550],[500,530],
    ],
    finishIndex:0,
    surface:"rock",
    features:["observed","no_time","penalty","rocks","extreme"],
    overtakingDifficulty:0.95, tyreStress:0.10, elevationChange:0.70, drsZones:0, fuelEffect:0.05,
    sectors:0, corners:8, trackWidth:0.15,
    firstHeld:1975, lapRecordHolder:"-", lapRecordYear:0,
    description:"Observed trial section. Time doesn't count, penalties do: every foot dab costs points.",
});

/* SPEEDWAY CARDIFF — Principality Stadium, indoor dirt oval. */
const SPEEDWAY_CARDIFF = T({
    id:"speedway_cardiff", name:"Speedway GP — Cardiff", country:"GBR", champFamily:"Speedway",
    type:"closed", lengthKm:0.260, lapRecordSec:60.0,
    waypoints:[
        [400,800],[500,810],[600,800],[660,750],
        [640,690],[560,680],[480,690],[440,670],
        [480,640],[560,630],[640,650],[700,690],
        [680,750],[600,790],[500,800],
    ],
    finishIndex:0,
    surface:"dirt",
    features:["oval","dirt","no_brakes","indoor","drift"],
    overtakingDifficulty:0.50, tyreStress:0.10, elevationChange:0.05, drsZones:0, fuelEffect:0.08,
    sectors:1, corners:4, trackWidth:0.60,
    firstHeld:2001, lapRecordHolder:"-", lapRecordYear:0,
    description:"Dirt oval in Cardiff stadium. 4 laps, no brakes, controlled drift: pure adrenaline.",
});

/* =============================================================================
 * KARTING CIRCUITS
 * ========================================================================== */

/* KARTING LONATO — Italian kart circuit, long and technical. */
const KART_LONATO = T({
    id:"kart_lonato", name:"South Garda Karting (Lonato)", country:"ITA", champFamily:"Karting",
    type:"closed", lengthKm:1.200, lapRecordSec:55.0,
    waypoints:[
        [400,820],[500,830],[580,810],[620,760],
        [600,700],[540,690],[480,700],[440,670],
        [480,630],[540,620],[600,640],[660,670],
        [700,720],[680,780],[620,810],
    ],
    finishIndex:0,
    features:["kart","technical","italian","long"],
    overtakingDifficulty:0.55, tyreStress:0.25, elevationChange:0.10, drsZones:0, fuelEffect:0.10,
    sectors:1, corners:10, trackWidth:0.50,
    firstHeld:1988, lapRecordHolder:"-", lapRecordYear:0,
    description:"One of the most technical karting circuits in Europe. Long with fast corners: where champions are born.",
});

/* KARTING GENK — Belgian kart circuit. */
const KART_GENK = T({
    id:"kart_genk", name:"Karting Genk", country:"BEL", champFamily:"Karting",
    type:"closed", lengthKm:1.360, lapRecordSec:58.0,
    waypoints:[
        [400,830],[500,840],[600,830],[680,800],
        [700,740],[660,690],[580,680],[500,690],
        [440,670],[420,610],[480,590],[560,600],
        [640,610],[700,640],[740,690],[720,760],
        [660,800],[560,830],
    ],
    finishIndex:0,
    features:["kart","flowing","belgian","technical"],
    overtakingDifficulty:0.50, tyreStress:0.25, elevationChange:0.08, drsZones:0, fuelEffect:0.10,
    sectors:1, corners:12, trackWidth:0.52,
    firstHeld:1985, lapRecordHolder:"-", lapRecordYear:0,
    description:"Belgian karting circuit, continuous flow and technical. Hosts European karting championships.",
});

/* KARTING REGIONAL — generic amateur karting circuit. */
const KART_REGIONAL = T({
    id:"kart_regional", name:"Kartodromo Regionale", country:"ITA", champFamily:"Karting",
    type:"closed", lengthKm:0.900, lapRecordSec:45.0,
    waypoints:[
        [400,800],[500,810],[580,790],[620,740],
        [580,690],[500,680],[440,700],[420,660],
        [480,630],[560,620],[620,650],[660,700],
        [640,770],[560,800],
    ],
    finishIndex:0,
    features:["kart","amateur","regional","short"],
    overtakingDifficulty:0.60, tyreStress:0.20, elevationChange:0.05, drsZones:0, fuelEffect:0.08,
    sectors:1, corners:8, trackWidth:0.48,
    firstHeld:1995, lapRecordHolder:"-", lapRecordYear:0,
    description:"Amateur karting circuit. Short and twisty: the school for future local champions.",
});

/* =============================================================================
 * SPECIAL CIRCUITS (TRUCK, DRAG, HILLCLIMB, ONE-MAKE)
 * ========================================================================== */

/* NURBURGRING TRUCK — for ETRC (base reuse). */
const NURBURGRING_TRUCK = T({ ...NURBURGRING_GT, id:"nurburgring_truck", champFamily:"Truck", trackWidth:0.85 });

/* LE MANS TRUCK — Bugatti circuit, shorter for trucks. */
const LEMANS_TRUCK = T({
    id:"lemans_truck", name:"Circuit Bugatti (Le Mans)", country:"FRA", champFamily:"Truck",
    type:"closed", lengthKm:4.185, lapRecordSec:95.0,
    waypoints:[
        [400,850],[500,860],[600,850],[700,830],
        [780,780],[760,710],[700,690],[620,700],
        [540,710],[460,700],[400,670],[380,610],
        [420,550],[500,530],[580,540],[660,560],
        [740,570],[800,550],[820,490],[780,430],
        [700,420],[620,440],[540,470],[480,500],
        [420,530],[380,580],[370,650],[370,750],
    ],
    finishIndex:0,
    features:["technical","french","truck","bugatti"],
    overtakingDifficulty:0.45, tyreStress:0.50, elevationChange:0.20, drsZones:0, fuelEffect:0.40,
    sectors:3, corners:14, trackWidth:0.85,
    firstHeld:1965, lapRecordHolder:"-", lapRecordYear:0,
    description:"Bugatti circuit at Le Mans, used for truck racing. Technical and suited to heavy vehicles.",
});

/* DRAG STRIP — Santa Pod, 1/4 mile. */
const DRAG_STRIP = T({
    id:"drag_strip", name:"Santa Pod Raceway", country:"GBR", champFamily:"Drag",
    type:"open", lengthKm:0.402, lapRecordSec:4.5,
    waypoints:[
        [100,500],[200,500],[300,500],[400,500],[500,500],
        [600,500],[700,500],[800,500],[900,500],
    ],
    finishIndex:0,
    surface:"asphalt",
    features:["dragstrip","quarter_mile","straight","prepped"],
    overtakingDifficulty:1.0, tyreStress:0.15, elevationChange:0.0, drsZones:0, fuelEffect:0.0,
    sectors:1, corners:0, trackWidth:0.35,
    firstHeld:1966, lapRecordHolder:"-", lapRecordYear:0,
    description:"402-meter drag strip. 0-400km/h in seconds: reaction time and courage.",
});

/* HILL CLIMB — Pikes Peak, legendary timed hill climb. */
const PIKES_PEAK = T({
    id:"pikes_peak", name:"Pikes Peak International Hill Climb", country:"USA", champFamily:"HillClimb",
    type:"open", lengthKm:19.99, lapRecordSec:540,
    waypoints:[
        [100,900],[180,840],[140,770],[220,720],[180,650],
        [260,600],[320,650],[280,580],[360,530],[420,570],
        [380,500],[460,450],[520,490],[480,420],[560,370],
        [620,410],[580,340],[660,290],[720,330],[680,260],
        [760,210],[820,250],[780,180],[860,130],[900,100],
    ],
    finishIndex:0,
    surface:"asphalt",
    features:["hillclimb","altitude","legendary","dangerous","asphalt"],
    overtakingDifficulty:1.0, tyreStress:0.30, elevationChange:1.0, drsZones:0, fuelEffect:0.40,
    sectors:3, corners:156, trackWidth:0.35,
    firstHeld:1916, lapRecordHolder:"R. Millen", lapRecordYear:2018,
    description:"Ascent to the clouds at 4300m. 156 corners, no margins, thin air: the race to the sky.",
});

/* HILL CLIMB — Trento Bondone, Italian hill climb. */
const TRENTO_BONDONE = T({
    id:"trento_bondone", name:"Trento-Bondone", country:"ITA", champFamily:"HillClimb",
    type:"open", lengthKm:17.0, lapRecordSec:480,
    waypoints:[
        [100,890],[180,830],[140,760],[220,700],[180,630],
        [260,570],[340,610],[300,540],[380,480],[460,520],
        [420,450],[500,400],[580,440],[540,370],[620,320],
        [700,360],[660,290],[740,240],[820,280],[780,200],
        [860,150],
    ],
    finishIndex:0,
    surface:"asphalt",
    features:["hillclimb","italian","mountain","technical"],
    overtakingDifficulty:1.0, tyreStress:0.25, elevationChange:0.90, drsZones:0, fuelEffect:0.35,
    sectors:3, corners:120, trackWidth:0.30,
    firstHeld:1925, lapRecordHolder:"-", lapRecordYear:0,
    description:"Bondone climb above Trento. Narrow asphalt, hairpin corners: classic Italian hill climb.",
});

/* ONE-MAKE CAR CIRCUIT — generic for one-make car series (Imola reuse). */
const MONOMARCA_CIRCUIT = T({ ...IMOLA, id:"monomarca_circuit", champFamily:"GT" });

/* ONE-MAKE MOTO CIRCUIT — generic for one-make bike series (Misano reuse). */
const MONOMARCA_MOTO_CIRCUIT = T({ ...MISANO, id:"monomarca_moto_circuit", champFamily:"Bike" });

/* =============================================================================
 * CENTRAL REGISTRY
 * ========================================================================== */
const TRACKS = {
    // Original
    [MONZA.id]:MONZA, [SILVERSTONE.id]:SILVERSTONE, [MONACO.id]:MONACO,
    [SUZUKA.id]:SUZUKA, [SPA.id]:SPA, [IMOLA.id]:IMOLA, [INTERLAGOS.id]:INTERLAGOS, [ZANDVOORT.id]:ZANDVOORT,
    [JEDDAH.id]:JEDDAH, [AUSTIN.id]:AUSTIN, [HUNGARORING.id]:HUNGARORING, [BAKU.id]:BAKU,
    [MUGELLO.id]:MUGELLO, [SACHSENRING.id]:SACHSENRING, [MISANO.id]:MISANO,
    [PHILLIP_ISLAND.id]:PHILLIP_ISLAND, [ASSEN.id]:ASSEN,
    [LEMANS.id]:LEMANS, [FUJI.id]:FUJI, [SEBRING.id]:SEBRING, [SPA_WEC.id]:SPA_WEC,
    [SS_MONTECARLO.id]:SS_MONTECARLO, [SS_FINLANDIA.id]:SS_FINLANDIA, [SS_GB.id]:SS_GB, [SS_KENYA.id]:SS_KENYA,
    [DAKAR_DUNE.id]:DAKAR_DUNE, [DAKAR_DESERTO.id]:DAKAR_DESERTO, [DAKAR_MONTAGNA.id]:DAKAR_MONTAGNA,
    // GT
    [NURBURGRING_GT.id]:NURBURGRING_GT, [BARCELONA.id]:BARCELONA, [MONZA_GT.id]:MONZA_GT, [SPA_GT.id]:SPA_GT,
    // TouringCar
    [MACAU.id]:MACAU, [BURIRAM.id]:BURIRAM, [INTERLAGOS_TC.id]:INTERLAGOS_TC,
    // Regional rally
    [SS_AZORES.id]:SS_AZORES, [SS_IVORY.id]:SS_IVORY, [SS_JAPAN.id]:SS_JAPAN, [SS_ARGENTINA.id]:SS_ARGENTINA,
    [SS_MIDEAST.id]:SS_MIDEAST, [SS_MEXICO.id]:SS_MEXICO, [SS_REGIONAL.id]:SS_REGIONAL,
    // Rallycross
    [HOLJES.id]:HOLJES, [LOHEAC.id]:LOHEAC, [AUTOCROSS_TRACK.id]:AUTOCROSS_TRACK,
    // Additional raid
    [BAJA_DESERT.id]:BAJA_DESERT, [ATACAMA.id]:ATACAMA,
    // Additional bike
    [ARAGON.id]:ARAGON, [PORTIMAO.id]:PORTIMAO, [SLOVAKIARING.id]:SLOVAKIARING,
    // Motocross / Offroad bike
    [MX_MANTOVA.id]:MX_MANTOVA, [MX_VILLADEVERO.id]:MX_VILLADEVERO, [SE_ARENA.id]:SE_ARENA,
    [TRIAL_SECTION.id]:TRIAL_SECTION, [SPEEDWAY_CARDIFF.id]:SPEEDWAY_CARDIFF,
    // Karting
    [KART_LONATO.id]:KART_LONATO, [KART_GENK.id]:KART_GENK, [KART_REGIONAL.id]:KART_REGIONAL,
    // Special
    [NURBURGRING_TRUCK.id]:NURBURGRING_TRUCK, [LEMANS_TRUCK.id]:LEMANS_TRUCK,
    [DRAG_STRIP.id]:DRAG_STRIP, [PIKES_PEAK.id]:PIKES_PEAK, [TRENTO_BONDONE.id]:TRENTO_BONDONE,
    [MONOMARCA_CIRCUIT.id]:MONOMARCA_CIRCUIT, [MONOMARCA_MOTO_CIRCUIT.id]:MONOMARCA_MOTO_CIRCUIT,
};

/* index by family (for calendar construction) */
const TRACKS_BY_FAMILY = {
    OpenWheel:[MONZA,SILVERSTONE,MONACO,SUZUKA,SPA,IMOLA,INTERLAGOS,ZANDVOORT,JEDDAH,AUSTIN,HUNGARORING,BAKU],
    Bike:[MUGELLO,SACHSENRING,MISANO,PHILLIP_ISLAND,ASSEN,ARAGON,PORTIMAO,SLOVAKIARING,MONOMARCA_MOTO_CIRCUIT],
    Endurance:[LEMANS,FUJI,SEBRING,SPA_WEC],
    Rally:[SS_MONTECARLO,SS_FINLANDIA,SS_GB,SS_KENYA,SS_AZORES,SS_IVORY,SS_JAPAN,SS_ARGENTINA,SS_MIDEAST,SS_MEXICO,SS_REGIONAL],
    Raid:[DAKAR_DUNE,DAKAR_DESERTO,DAKAR_MONTAGNA,BAJA_DESERT,ATACAMA],
    GT:[NURBURGRING_GT,BARCELONA,MONZA_GT,SPA_GT,MONOMARCA_CIRCUIT],
    TouringCar:[MACAU,BURIRAM,INTERLAGOS_TC],
    Rallycross:[HOLJES,LOHEAC,AUTOCROSS_TRACK],
    Motocross:[MX_MANTOVA,MX_VILLADEVERO,SE_ARENA],
    Trial:[TRIAL_SECTION],
    Speedway:[SPEEDWAY_CARDIFF],
    Karting:[KART_LONATO,KART_GENK,KART_REGIONAL],
    Truck:[NURBURGRING_TRUCK,LEMANS_TRUCK],
    Drag:[DRAG_STRIP],
    HillClimb:[PIKES_PEAK,TRENTO_BONDONE],
};

function getTrack(id) { return TRACKS[id] || null; }
function getTracksByFamily(family) { return TRACKS_BY_FAMILY[family] || []; }

/* Global exposure */
if (typeof window !== "undefined") {
    window.TRACKS = TRACKS;
    window.TRACKS_BY_FAMILY = TRACKS_BY_FAMILY;
    window.getTrack = getTrack;
    window.getTracksByFamily = getTracksByFamily;
}
if (typeof module !== "undefined" && module.exports) {
    module.exports = { TRACKS, TRACKS_BY_FAMILY, getTrack, getTracksByFamily };
}