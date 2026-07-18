/* =============================================================================
 * ULTIMATE MOTORSPORT MANAGER
 * File: data/teams/touring_car.js
 * Squadre per WTCR e Stock Car Brasil (Touring Car)
 * ========================================================================== */

/* --- WTCR / TCR WORLD --- */
const WTCR_TEAMS = [
    { id:"wtcr_cyan", name:"Cyan Racing", color:"#1E40AF", carModel:"Lynk & Co 03 TCR", power:0.86, reliability:0.83, drivers:[
        { id:"wtcr_d1", name:"Y. Ehrlacher", pace:0.85, racecraft:0.83, consistency:0.80, fitness:0.82, age:27, nationality:"FRA" },
        { id:"wtcr_d2", name:"T. Björk", pace:0.83, racecraft:0.81, consistency:0.79, fitness:0.80, age:46, nationality:"SWE" },
        { id:"wtcr_d3", name:"S. Azcona", pace:0.82, racecraft:0.80, consistency:0.78, fitness:0.79, age:26, nationality:"ESP" },
    ]},
    { id:"wtcr_comtoyou", name:"Comtoyou Racing", color:"#DC2626", carModel:"Audi RS3 LMS TCR", power:0.84, reliability:0.81, drivers:[
        { id:"wtcr_d4", name:"M. Vernay", pace:0.83, racecraft:0.81, consistency:0.78, fitness:0.80, age:36, nationality:"FRA" },
        { id:"wtcr_d5", name:"N. Girolami", pace:0.82, racecraft:0.79, consistency:0.77, fitness:0.78, age:29, nationality:"ARG" },
        { id:"wtcr_d6", name:"B. Vernay", pace:0.80, racecraft:0.77, consistency:0.75, fitness:0.76, age:30, nationality:"FRA" },
    ]},
    { id:"wtcr_hyundai", name:"Hyundai Motorsport", color:"#059669", carModel:"Hyundai i30 N TCR", power:0.85, reliability:0.82, drivers:[
        { id:"wtcr_d7", name:"N. Michelisz", pace:0.84, racecraft:0.82, consistency:0.80, fitness:0.81, age:39, nationality:"HUN" },
        { id:"wtcr_d8", name:"G. Tarquini", pace:0.82, racecraft:0.80, consistency:0.78, fitness:0.79, age:60, nationality:"ITA" },
        { id:"wtcr_d9", name:"M. Homola", pace:0.80, racecraft:0.77, consistency:0.75, fitness:0.76, age:28, nationality:"SVK" },
    ]},
    { id:"wtcr_honda", name:"Honda Racing", color:"#FFFFFF", carModel:"Honda Civic Type R TCR", power:0.83, reliability:0.80, drivers:[
        { id:"wtcr_d10", name:"E. Buckley", pace:0.82, racecraft:0.80, consistency:0.78, fitness:0.79, age:33, nationality:"GBR" },
        { id:"wtcr_d11", name:"A. Girolami", pace:0.80, racecraft:0.77, consistency:0.75, fitness:0.76, age:32, nationality:"ARG" },
        { id:"wtcr_d12", name:"N. Kox", pace:0.78, racecraft:0.74, consistency:0.72, fitness:0.73, age:25, nationality:"NLD" },
    ]},
    { id:"wtcr_allinkl", name:"All-Inkl Motorsport", color:"#F59E0B", carModel:"CUPRA Leon TCR", power:0.82, reliability:0.79, drivers:[
        { id:"wtcr_d13", name:"A. Gião", pace:0.81, racecraft:0.78, consistency:0.76, fitness:0.77, age:35, nationality:"PRT" },
        { id:"wtcr_d14", name:"M. Beretta", pace:0.79, racecraft:0.75, consistency:0.73, fitness:0.74, age:29, nationality:"ITA" },
        { id:"wtcr_d15", name:"J. Krämer", pace:0.77, racecraft:0.73, consistency:0.71, fitness:0.72, age:30, nationality:"DEU" },
    ]},
];

/* --- STOCK CAR BRASIL --- */
const STOCK_CAR_TEAMS = [
    { id:"sc_caciq", name:"Caciq Racing", color:"#059669", carModel:"Toyota Corolla Stock Car", power:0.84, reliability:0.81, drivers:[
        { id:"sc_d1", name:"R. Moura", pace:0.84, racecraft:0.82, consistency:0.80, fitness:0.81, age:42, nationality:"BRA" },
        { id:"sc_d2", name:"D. Ornes", pace:0.82, racecraft:0.80, consistency:0.78, fitness:0.79, age:35, nationality:"BRA" },
    ]},
    { id:"sc_zebra", name:"Zebra Racing", color:"#1E40AF", carModel:"Chevrolet Cruze Stock Car", power:0.83, reliability:0.80, drivers:[
        { id:"sc_d3", name:"G. Tiodoro", pace:0.83, racecraft:0.81, consistency:0.79, fitness:0.80, age:38, nationality:"BRA" },
        { id:"sc_d4", name:"M. Villaça", pace:0.81, racecraft:0.78, consistency:0.76, fitness:0.77, age:32, nationality:"BRA" },
    ]},
    { id:"sc_vogel", name:"Vogel Motorsport", color:"#DC2626", carModel:"Toyota Corolla Stock Car", power:0.82, reliability:0.79, drivers:[
        { id:"sc_d5", name:"V. Roso", pace:0.82, racecraft:0.80, consistency:0.78, fitness:0.79, age:40, nationality:"BRA" },
        { id:"sc_d6", name:"P. Sobreira", pace:0.80, racecraft:0.77, consistency:0.75, fitness:0.76, age:28, nationality:"BRA" },
    ]},
    { id:"sc_koyama", name:"Koyama Racing", color:"#F59E0B", carModel:"Chevrolet Cruze Stock Car", power:0.81, reliability:0.78, drivers:[
        { id:"sc_d7", name:"K. Yamamoto", pace:0.81, racecraft:0.78, consistency:0.76, fitness:0.77, age:34, nationality:"BRA" },
        { id:"sc_d8", name:"R. Fonseca", pace:0.79, racecraft:0.75, consistency:0.73, fitness:0.74, age:26, nationality:"BRA" },
    ]},
];

const TOURING_CAR_DATA = {
    wtcr: WTCR_TEAMS,
    stock_car: STOCK_CAR_TEAMS,
};

if (typeof window !== "undefined") {
    window.WTCR_TEAMS = WTCR_TEAMS;
    window.STOCK_CAR_TEAMS = STOCK_CAR_TEAMS;
    window.TOURING_CAR_DATA = TOURING_CAR_DATA;
    if (window.ALL_TEAMS) {
        window.ALL_TEAMS.wtcr = WTCR_TEAMS;
        window.ALL_TEAMS.stock_car = STOCK_CAR_TEAMS;
    }
}
