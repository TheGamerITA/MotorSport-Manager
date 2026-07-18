/* =============================================================================
 * ULTIMATE MOTORSPORT MANAGER
 * File: data/teams/raid.js
 * Squadre per Raid (W2RC, Baja Cup)
 * ========================================================================== */

/* --- W2RC (World Rally-Raid Championship — Dakar, Abu Dhabi, etc.) --- */
const W2RC_TEAMS = [
    { id:"w2rc_toyota", name:"Toyota Gazoo Racing W2RC", color:"#DC2626", carModel:"Toyota Hilux GR DKR", power:0.88, reliability:0.85, drivers:[
        { id:"w2rc_d1", name:"N. Al-Attiyah", pace:0.89, racecraft:0.87, consistency:0.85, fitness:0.88, age:52, nationality:"QAT" },
        { id:"w2rc_d2", name:"G. de Mevius", pace:0.84, racecraft:0.82, consistency:0.80, fitness:0.83, age:28, nationality:"BEL" },
    ]},
    { id:"w2rc_prodrive", name:"Prodrive Racing", color:"#1E40AF", carModel:"Prodrive Hunter T1+", power:0.87, reliability:0.84, drivers:[
        { id:"w2rc_d3", name:"S. Loeb", pace:0.88, racecraft:0.86, consistency:0.84, fitness:0.87, age:49, nationality:"FRA" },
        { id:"w2rc_d4", name:"N. Colsoul", pace:0.82, racecraft:0.80, consistency:0.78, fitness:0.81, age:34, nationality:"BEL" },
    ]},
    { id:"w2rc_mini", name:"X-raid Mini", color:"#059669", carModel:"Mini JCW Rally Plus", power:0.86, reliability:0.83, drivers:[
        { id:"w2rc_d5", name:"Y. Al-Rajhi", pace:0.85, racecraft:0.83, consistency:0.81, fitness:0.84, age:41, nationality:"SAU" },
        { id:"w2rc_d6", name:"V. Chicherit", pace:0.83, racecraft:0.81, consistency:0.79, fitness:0.82, age:44, nationality:"FRA" },
    ]},
    { id:"w2rc_astara", name:"Astara Motorsport", color:"#F59E0B", carModel:"Astara 01 Concept", power:0.85, reliability:0.82, drivers:[
        { id:"w2rc_d7", name:"C. Sainz", pace:0.87, racecraft:0.85, consistency:0.83, fitness:0.86, age:60, nationality:"ESP" },
        { id:"w2rc_d8", name:"L. Cruz", pace:0.81, racecraft:0.79, consistency:0.77, fitness:0.80, age:35, nationality:"ESP" },
    ]},
    { id:"w2rc_overdrive", name:"Overdrive Racing", color:"#7C3AED", carModel:"Toyota Hilux Overdrive", power:0.84, reliability:0.81, drivers:[
        { id:"w2rc_d9", name:"J. Terranova", pace:0.83, racecraft:0.81, consistency:0.79, fitness:0.82, age:46, nationality:"ARG" },
        { id:"w2rc_d10", name:"R. ten Brinke", pace:0.80, racecraft:0.78, consistency:0.76, fitness:0.79, age:38, nationality:"NLD" },
    ]},
];

/* --- BAJA WORLD CUP (FIA Cross-Country Baja Cup) --- */
const BAJA_TEAMS = [
    { id:"baja_toyota", name:"Toyota Baja Team", color:"#DC2626", carModel:"Toyota Hilux Baja", power:0.84, reliability:0.81, drivers:[
        { id:"baja_d1", name:"F. Álvarez", pace:0.84, racecraft:0.82, consistency:0.80, fitness:0.83, age:30, nationality:"ESP" },
        { id:"baja_d2", name:"M. Peco", pace:0.81, racecraft:0.79, consistency:0.77, fitness:0.80, age:28, nationality:"PRT" },
    ]},
    { id:"baja_mini", name:"Mini Baja", color:"#059669", carModel:"Mini All4 Baja", power:0.83, reliability:0.80, drivers:[
        { id:"baja_d3", name:"J. Roma", pace:0.84, racecraft:0.82, consistency:0.80, fitness:0.83, age:51, nationality:"ESP" },
        { id:"baja_d4", name:"A. Pisani", pace:0.80, racecraft:0.78, consistency:0.76, fitness:0.79, age:35, nationality:"ITA" },
    ]},
    { id:"baja_south", name:"South Racing", color:"#1E40AF", carModel:"Ford Ranger Baja", power:0.82, reliability:0.79, drivers:[
        { id:"baja_d5", name:"J. Ferreira", pace:0.81, racecraft:0.79, consistency:0.77, fitness:0.80, age:33, nationality:"PRT" },
        { id:"baja_d6", name:"F. Varela", pace:0.78, racecraft:0.76, consistency:0.74, fitness:0.77, age:30, nationality:"ARG" },
    ]},
    { id:"baja_can", name:"Can-Am Baja", color:"#F59E0B", carModel:"Can-Am Maverick X3", power:0.81, reliability:0.78, drivers:[
        { id:"baja_d7", name:"A. Jones", pace:0.80, racecraft:0.78, consistency:0.76, fitness:0.79, age:36, nationality:"USA" },
        { id:"baja_d8", name:"M. Przygonski", pace:0.77, racecraft:0.75, consistency:0.73, fitness:0.76, age:32, nationality:"POL" },
    ]},
];

const RAID_DATA = {
    w2rc: W2RC_TEAMS,
    baja: BAJA_TEAMS,
};

if (typeof window !== "undefined") {
    window.W2RC_TEAMS = W2RC_TEAMS;
    window.BAJA_TEAMS = BAJA_TEAMS;
    window.RAID_DATA = RAID_DATA;
    if (window.ALL_TEAMS) {
        window.ALL_TEAMS.w2rc = W2RC_TEAMS;
        window.ALL_TEAMS.baja_cup = BAJA_TEAMS;
    }
}
