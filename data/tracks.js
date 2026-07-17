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
 * Schema tracciato:
 *   { id, name, country, champFamily, type,
 *     lengthKm, lapRecordSec,
 *     waypoints: [[x,y],...],
 *     finishIndex,            // indice del waypoint di partenza/arrivo
 *     surface,                // per rally/raid: asphalt|gravel|snow|sand|dirt
 *     features: []            // tratti narrativi ("longstraight","chicanes"...)
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
});

/* =============================================================================
 * REGISTRO CENTRALE
 * ========================================================================== */
const TRACKS = {
    [MONZA.id]:MONZA, [SILVERSTONE.id]:SILVERSTONE, [MONACO.id]:MONACO,
    [SUZUKA.id]:SUZUKA, [SPA.id]:SPA,
    [MUGELLO.id]:MUGELLO, [SACHSENRING.id]:SACHSENRING, [MISANO.id]:MISANO,
    [LEMANS.id]:LEMANS, [FUJI.id]:FUJI, [SPA_WEC.id]:SPA_WEC,
    [SS_MONTECARLO.id]:SS_MONTECARLO, [SS_FINLANDIA.id]:SS_FINLANDIA, [SS_GB.id]:SS_GB,
    [DAKAR_DUNE.id]:DAKAR_DUNE, [DAKAR_DESERTO.id]:DAKAR_DESERTO, [DAKAR_MONTAGNA.id]:DAKAR_MONTAGNA,
};

/* indice per famiglia (per costruzione calendari) */
const TRACKS_BY_FAMILY = {
    OpenWheel:[MONZA,SILVERSTONE,MONACO,SUZUKA,SPA],
    Bike:[MUGELLO,SACHSENRING,MISANO],
    Endurance:[LEMANS,FUJI,SPA_WEC],
    Rally:[SS_MONTECARLO,SS_FINLANDIA,SS_GB],
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
