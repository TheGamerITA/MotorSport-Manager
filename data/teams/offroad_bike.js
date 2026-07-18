/* =============================================================================
 * ULTIMATE MOTORSPORT MANAGER
 * File: data/teams/offroad_bike.js
 * Teams for Offroad Bikes (MXGP, SuperEnduro, Trial, Speedway)
 * ========================================================================== */

/* --- MXGP (FIM Motocross World Championship) --- */
const MXGP_TEAMS = [
    { id:"mxgp_ktm", name:"Red Bull KTM Factory Racing", color:"#F59E0B", carModel:"KTM 450 SX-F", power:0.90, reliability:0.87, drivers:[
        { id:"mxgp_d1", name:"J. Prado", pace:0.90, racecraft:0.87, consistency:0.85, fitness:0.91, age:25, nationality:"ESP" },
        { id:"mxgp_d2", name:"L. Coenen", pace:0.86, racecraft:0.83, consistency:0.81, fitness:0.87, age:18, nationality:"BEL" },
    ]},
    { id:"mxgp_honda", name:"Team HRC", color:"#DC2626", carModel:"Honda CRF450RW", power:0.89, reliability:0.86, drivers:[
        { id:"mxgp_d3", name:"T. Vialle", pace:0.88, racecraft:0.85, consistency:0.83, fitness:0.89, age:23, nationality:"FRA" },
        { id:"mxgp_d4", name:"R. Gifting", pace:0.84, racecraft:0.81, consistency:0.79, fitness:0.85, age:25, nationality:"SWE" },
    ]},
    { id:"mxgp_kawasaki", name:"Kawasaki Racing Team", color:"#059669", carModel:"Kawasaki KX450-SR", power:0.88, reliability:0.85, drivers:[
        { id:"mxgp_d5", name:"R. Febvre", pace:0.89, racecraft:0.86, consistency:0.84, fitness:0.90, age:31, nationality:"FRA" },
        { id:"mxgp_d6", name:"K. Seewer", pace:0.85, racecraft:0.82, consistency:0.80, fitness:0.86, age:29, nationality:"SUI" },
    ]},
    { id:"mxgp_yamaha", name:"Monster Energy Yamaha", color:"#1E40AF", carModel:"Yamaha YZ450FM", power:0.87, reliability:0.84, drivers:[
        { id:"mxgp_d7", name:"M. Gifting", pace:0.86, racecraft:0.83, consistency:0.81, fitness:0.87, age:22, nationality:"SWE" },
        { id:"mxgp_d8", name:"J. Benistant", pace:0.82, racecraft:0.79, consistency:0.77, fitness:0.83, age:21, nationality:"FRA" },
    ]},
    { id:"mxgp_gasgas", name:"GasGas Factory Racing", color:"#7C3AED", carModel:"GasGas MC 450F", power:0.86, reliability:0.83, drivers:[
        { id:"mxgp_d9", name:"P. Guadagnini", pace:0.85, racecraft:0.82, consistency:0.80, fitness:0.86, age:23, nationality:"ITA" },
        { id:"mxgp_d10", name:"S. Rubini", pace:0.81, racecraft:0.78, consistency:0.76, fitness:0.82, age:25, nationality:"FRA" },
    ]},
];

/* --- SUPERENDURO (FIM SuperEnduro World Championship) --- */
const SUPERENDURO_TEAMS = [
    { id:"se_ktm", name:"KTM SuperEnduro", color:"#F59E0B", carModel:"KTM 300 TPI", power:0.88, reliability:0.85, drivers:[
        { id:"se_d1", name:"B. Hook", pace:0.89, racecraft:0.86, consistency:0.84, fitness:0.90, age:34, nationality:"GBR" },
        { id:"se_d2", name:"M. Haidera", pace:0.84, racecraft:0.81, consistency:0.79, fitness:0.85, age:26, nationality:"AUT" },
    ]},
    { id:"se_gasgas", name:"GasGas SuperEnduro", color:"#7C3AED", carModel:"GasGas EC 300", power:0.87, reliability:0.84, drivers:[
        { id:"se_d3", name:"B. Hartwig", pace:0.86, racecraft:0.83, consistency:0.81, fitness:0.87, age:28, nationality:"DEU" },
        { id:"se_d4", name:"J. Cardone", pace:0.82, racecraft:0.79, consistency:0.77, fitness:0.83, age:24, nationality:"ITA" },
    ]},
    { id:"se_husqvarna", name:"Husqvarna Racing", color:"#059669", carModel:"Husqvarna TE 300", power:0.86, reliability:0.83, drivers:[
        { id:"se_d5", name:"G. Daniels", pace:0.85, racecraft:0.82, consistency:0.80, fitness:0.86, age:27, nationality:"USA" },
        { id:"se_d6", name:"T. Apollinaire", pace:0.81, racecraft:0.78, consistency:0.76, fitness:0.82, age:25, nationality:"FRA" },
    ]},
    { id:"se_beta", name:"Beta Factory", color:"#DC2626", carModel:"Beta RR 300", power:0.85, reliability:0.82, drivers:[
        { id:"se_d7", name:"A. Verardo", pace:0.83, racecraft:0.80, consistency:0.78, fitness:0.84, age:30, nationality:"ITA" },
        { id:"se_d8", name:"M. Soppa", pace:0.79, racecraft:0.76, consistency:0.74, fitness:0.80, age:23, nationality:"ITA" },
    ]},
];

/* --- TRIAL (FIM Trial World Championship) --- */
const TRIAL_TEAMS = [
    { id:"trial_gasgas", name:"GasGas Trial Factory", color:"#7C3AED", carModel:"GasGas TXT 300", power:0.90, reliability:0.87, drivers:[
        { id:"tr_d1", name:"T. Bou", pace:0.95, racecraft:0.93, consistency:0.91, fitness:0.92, age:37, nationality:"ESP" },
        { id:"tr_d2", name:"J. Fajardo", pace:0.85, racecraft:0.82, consistency:0.80, fitness:0.86, age:33, nationality:"ESP" },
    ]},
    { id:"trial_beta", name:"Beta Trial Team", color:"#DC2626", carModel:"Beta EVO 300", power:0.88, reliability:0.85, drivers:[
        { id:"tr_d3", name:"A. Raga", pace:0.88, racecraft:0.85, consistency:0.83, fitness:0.89, age:41, nationality:"ESP" },
        { id:"tr_d4", name:"M. Busto", pace:0.84, racecraft:0.81, consistency:0.79, fitness:0.85, age:28, nationality:"ESP" },
    ]},
    { id:"trial_trrs", name:"TRRS Racing", color:"#1E40AF", carModel:"TRRS RS 300", power:0.86, reliability:0.83, drivers:[
        { id:"tr_d5", name:"G. Casales", pace:0.83, racecraft:0.80, consistency:0.78, fitness:0.84, age:27, nationality:"ESP" },
        { id:"tr_d6", name:"L. Pinell", pace:0.80, racecraft:0.77, consistency:0.75, fitness:0.81, age:24, nationality:"ESP" },
    ]},
    { id:"trial_scorpa", name:"Scorpa Racing", color:"#059669", carModel:"Scorpa SY 300", power:0.84, reliability:0.81, drivers:[
        { id:"tr_d7", name:"M. Bourdariat", pace:0.81, racecraft:0.78, consistency:0.76, fitness:0.82, age:29, nationality:"FRA" },
        { id:"tr_d8", name:"J. Ferrer", pace:0.78, racecraft:0.75, consistency:0.73, fitness:0.79, age:26, nationality:"ESP" },
    ]},
];

/* --- SPEEDWAY (FIM Speedway Grand Prix) --- */
const SPEEDWAY_TEAMS = [
    { id:"sp_rawicz", name:"KS Rawicz", color:"#DC2626", carModel:"GTR 500cc", power:0.89, reliability:0.86, drivers:[
        { id:"sp_d1", name:"B. Zmarzlik", pace:0.93, racecraft:0.91, consistency:0.89, fitness:0.90, age:28, nationality:"POL" },
        { id:"sp_d2", name:"M. Kolodziej", pace:0.84, racecraft:0.81, consistency:0.79, fitness:0.85, age:33, nationality:"POL" },
    ]},
    { id:"sp_gorzow", name:"Stal Gorzow", color:"#1E40AF", carModel:"GM 500cc", power:0.88, reliability:0.85, drivers:[
        { id:"sp_d3", name:"F. Lindback", pace:0.87, racecraft:0.84, consistency:0.82, fitness:0.88, age:38, nationality:"SWE" },
        { id:"sp_d4", name:"P. Pawlicki", pace:0.83, racecraft:0.80, consistency:0.78, fitness:0.84, age:29, nationality:"POL" },
    ]},
    { id:"sp_wroclaw", name:"Sparta Wroclaw", color:"#059669", carModel:"Jawa 500cc", power:0.87, reliability:0.84, drivers:[
        { id:"sp_d5", name:"D. Laguta", pace:0.86, racecraft:0.83, consistency:0.81, fitness:0.87, age:31, nationality:"RUS" },
        { id:"sp_d6", name:"M. Huckenbeck", pace:0.82, racecraft:0.79, consistency:0.77, fitness:0.83, age:30, nationality:"DEU" },
    ]},
    { id:"sp_lebszcz", name:"Unia Leszno", color:"#F59E0B", carModel:"GTR 500cc", power:0.86, reliability:0.83, drivers:[
        { id:"sp_d7", name:"R. Lambert", pace:0.85, racecraft:0.82, consistency:0.80, fitness:0.86, age:25, nationality:"GBR" },
        { id:"sp_d8", name:"J. Bewley", pace:0.81, racecraft:0.78, consistency:0.76, fitness:0.82, age:24, nationality:"GBR" },
    ]},
    { id:"sp_torun", name:"Apator Torun", color:"#7C3AED", carModel:"Jawa 500cc", power:0.85, reliability:0.82, drivers:[
        { id:"sp_d9", name:"M. Drabik", pace:0.84, racecraft:0.81, consistency:0.79, fitness:0.85, age:26, nationality:"POL" },
        { id:"sp_d10", name:"K. Przedpelski", pace:0.80, racecraft:0.77, consistency:0.75, fitness:0.81, age:27, nationality:"POL" },
    ]},
];

const OFFROAD_BIKE_DATA = {
    mxgp: MXGP_TEAMS,
    superenduro: SUPERENDURO_TEAMS,
    trial: TRIAL_TEAMS,
    speedway: SPEEDWAY_TEAMS,
};

if (typeof window !== "undefined") {
    window.MXGP_TEAMS = MXGP_TEAMS;
    window.SUPERENDURO_TEAMS = SUPERENDURO_TEAMS;
    window.TRIAL_TEAMS = TRIAL_TEAMS;
    window.SPEEDWAY_TEAMS = SPEEDWAY_TEAMS;
    window.OFFROAD_BIKE_DATA = OFFROAD_BIKE_DATA;
    if (window.ALL_TEAMS) {
        window.ALL_TEAMS.mxgp = MXGP_TEAMS;
        window.ALL_TEAMS.superenduro = SUPERENDURO_TEAMS;
        window.ALL_TEAMS.trial = TRIAL_TEAMS;
        window.ALL_TEAMS.speedway = SPEEDWAY_TEAMS;
    }
}
