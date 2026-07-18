/* =============================================================================
 * ULTIMATE MOTORSPORT MANAGER
 * File: data/teams/karting.js
 * Squadre per Karting (World, Regionali)
 * ========================================================================== */

/* --- KARTING WORLD (FIA Karting World Championship — KZ, OK, OKJ) --- */
const KARTING_WORLD_TEAMS = [
    { id:"kw_sodi", name:"Sodi Kart Racing Team", color:"#DC2626", carModel:"Sodi SR5 TM Racing", power:0.85, reliability:0.82, drivers:[
        { id:"kw_d1", name:"É. Gubian", pace:0.85, racecraft:0.82, consistency:0.80, fitness:0.86, age:18, nationality:"FRA" },
        { id:"kw_d2", name:"S. Grosso", pace:0.82, racecraft:0.79, consistency:0.77, fitness:0.83, age:17, nationality:"ITA" },
    ]},
    { id:"kw_tony", name:"Tony Kart Racing Team", color:"#1E40AF", carModel:"Tony Kart 401R Vortex", power:0.84, reliability:0.81, drivers:[
        { id:"kw_d3", name:"J. Turney", pace:0.84, racecraft:0.81, consistency:0.79, fitness:0.85, age:16, nationality:"GBR" },
        { id:"kw_d4", name:"A. Stenshorne", pace:0.81, racecraft:0.78, consistency:0.76, fitness:0.82, age:16, nationality:"NOR" },
    ]},
    { id:"kw_crg", name:"CRG Racing", color:"#059669", carModel:"CRG Road Rebel IAME", power:0.83, reliability:0.80, drivers:[
        { id:"kw_d5", name:"V. Ten Voorde", pace:0.83, racecraft:0.80, consistency:0.78, fitness:0.84, age:18, nationality:"NLD" },
        { id:"kw_d6", name:"F. Halliday", pace:0.80, racecraft:0.77, consistency:0.75, fitness:0.81, age:16, nationality:"GBR" },
    ]},
    { id:"kw_kosmic", name:"Kosmic Racing", color:"#7C3AED", carModel:"Kosmic Mercury R Vortex", power:0.82, reliability:0.79, drivers:[
        { id:"kw_d7", name:"L. Bertuelli", pace:0.82, racecraft:0.79, consistency:0.77, fitness:0.83, age:15, nationality:"ITA" },
        { id:"kw_d8", name:"K. Pasmans", pace:0.79, racecraft:0.76, consistency:0.74, fitness:0.80, age:15, nationality:"BEL" },
    ]},
    { id:"kw_birel", name:"Birel Art Racing", color:"#F59E0B", carModel:"Birel Art AM29 IAME", power:0.81, reliability:0.78, drivers:[
        { id:"kw_d9", name:"T. Pinaut", pace:0.81, racecraft:0.78, consistency:0.76, fitness:0.82, age:16, nationality:"FRA" },
        { id:"kw_d10", name:"D. Pizzi", pace:0.78, racecraft:0.75, consistency:0.73, fitness:0.79, age:15, nationality:"ITA" },
    ]},
];

/* --- KARTING REGIONALI (Campionati Italiani/Europei) --- */
const KARTING_REGIONAL_TEAMS = [
    { id:"kr_energy", name:"Energy Corse", color:"#DC2626", carModel:"Energy Corse TM", power:0.82, reliability:0.79, drivers:[
        { id:"kr_d1", name:"A. Lombardo", pace:0.82, racecraft:0.79, consistency:0.77, fitness:0.83, age:15, nationality:"ITA" },
        { id:"kr_d2", name:"M. Focaccia", pace:0.79, racecraft:0.76, consistency:0.74, fitness:0.80, age:14, nationality:"ITA" },
    ]},
    { id:"kr_ricky", name:" Ricky Motorsport ", color:"#1E40AF", carModel:"RK 100 IAME", power:0.81, reliability:0.78, drivers:[
        { id:"kr_d3", name:"G. Berton", pace:0.81, racecraft:0.78, consistency:0.76, fitness:0.82, age:15, nationality:"ITA" },
        { id:"kr_d4", name:"L. Preti", pace:0.78, racecraft:0.75, consistency:0.73, fitness:0.79, age:14, nationality:"ITA" },
    ]},
    { id:"kr_parilla", name:"Parilla Racing", color:"#059669", carModel:"Parilla Leopard IAME", power:0.80, reliability:0.77, drivers:[
        { id:"kr_d5", name:"S. Galli", pace:0.80, racecraft:0.77, consistency:0.75, fitness:0.81, age:16, nationality:"ITA" },
        { id:"kr_d6", name:"F. Salucci", pace:0.77, racecraft:0.74, consistency:0.72, fitness:0.78, age:15, nationality:"ITA" },
    ]},
    { id:"kr_zanardi", name:"Zanardi Racing", color:"#7C3AED", carModel:"Zanardi Z1 IAME", power:0.79, reliability:0.76, drivers:[
        { id:"kr_d7", name:"A. D'Amico", pace:0.79, racecraft:0.76, consistency:0.74, fitness:0.80, age:15, nationality:"ITA" },
        { id:"kr_d8", name:"G. Pezzucchi", pace:0.76, racecraft:0.73, consistency:0.71, fitness:0.77, age:14, nationality:"ITA" },
    ]},
];

const KARTING_DATA = {
    world: KARTING_WORLD_TEAMS,
    regional: KARTING_REGIONAL_TEAMS,
};

if (typeof window !== "undefined") {
    window.KARTING_WORLD_TEAMS = KARTING_WORLD_TEAMS;
    window.KARTING_REGIONAL_TEAMS = KARTING_REGIONAL_TEAMS;
    window.KARTING_DATA = KARTING_DATA;
    if (window.ALL_TEAMS) {
        window.ALL_TEAMS.karting_world = KARTING_WORLD_TEAMS;
        window.ALL_TEAMS.karting_regional = KARTING_REGIONAL_TEAMS;
    }
}
