/* =============================================================================
 * ULTIMATE MOTORSPORT MANAGER
 * File: data/teams/special.js
 * Squadre per Categorie Speciali (Truck, Drag, Hill Climb, Monomarca Auto, Monomarca Moto)
 * ========================================================================== */

/* --- TRUCK (FIA European Truck Racing Championship) --- */
const TRUCK_TEAMS = [
    { id:"tr_man", name:"Team SchwabenTruck", color:"#DC2626", carModel:"MAN TGX Race", power:0.90, reliability:0.87, drivers:[
        { id:"tr_d1", name:"S. Kiss", pace:0.90, racecraft:0.87, consistency:0.85, fitness:0.88, age:39, nationality:"HUN" },
        { id:"tr_d2", name:"A. Albacete", pace:0.88, racecraft:0.85, consistency:0.83, fitness:0.86, age:57, nationality:"ESP" },
    ]},
    { id:"tr_scania", name:"Buggyra Racing", color:"#1E40AF", carModel:"Scania R500 Race", power:0.89, reliability:0.86, drivers:[
        { id:"tr_d3", name:"A. Lacko", pace:0.89, racecraft:0.86, consistency:0.84, fitness:0.87, age:45, nationality:"CZE" },
        { id:"tr_d4", name:"J. Janes", pace:0.85, racecraft:0.82, consistency:0.80, fitness:0.83, age:38, nationality:"SVN" },
    ]},
    { id:"tr_iveco", name:"Iveco Powerstar", color:"#059669", carModel:"Iveco Powerstar R", power:0.88, reliability:0.85, drivers:[
        { id:"tr_d5", name:"G. Hahn", pace:0.88, racecraft:0.85, consistency:0.83, fitness:0.86, age:52, nationality:"DEU" },
        { id:"tr_d6", name:"S. Halm", pace:0.84, racecraft:0.81, consistency:0.79, fitness:0.82, age:35, nationality:"DEU" },
    ]},
    { id:"tr_renault", name:"Renault Trucks", color:"#F59E0B", carModel:"Renault T520 Race", power:0.87, reliability:0.84, drivers:[
        { id:"tr_d7", name:"L. Orsini", pace:0.85, racecraft:0.82, consistency:0.80, fitness:0.83, age:33, nationality:"FRA" },
        { id:"tr_d8", name:"T. Calvet", pace:0.82, racecraft:0.79, consistency:0.77, fitness:0.80, age:30, nationality:"FRA" },
    ]},
];

/* --- DRAG (NHRA / FIA European Drag Racing) --- */
const DRAG_TEAMS = [
    { id:"drag_dsr", name:"Don Schumacher Racing", color:"#DC2626", carModel:"Dodge Charger Top Fuel", power:0.95, reliability:0.90, drivers:[
        { id:"drag_d1", name:"A. Brown", pace:0.95, racecraft:0.92, consistency:0.90, fitness:0.93, age:47, nationality:"USA" },
        { id:"drag_d2", name:"L. Brown", pace:0.91, racecraft:0.88, consistency:0.86, fitness:0.89, age:35, nationality:"USA" },
    ]},
    { id:"drag_force", name:"John Force Racing", color:"#1E40AF", carModel:"Ford Mustang Funny Car", power:0.94, reliability:0.89, drivers:[
        { id:"drag_d3", name:"J. Force", pace:0.96, racecraft:0.93, consistency:0.91, fitness:0.92, age:74, nationality:"USA" },
        { id:"drag_d4", name:"B. Force", pace:0.92, racecraft:0.89, consistency:0.87, fitness:0.90, age:37, nationality:"USA" },
    ]},
    { id:"drag_kalitta", name:"Kalitta Motorsports", color:"#059669", carModel:"Toyota Top Fuel", power:0.93, reliability:0.88, drivers:[
        { id:"drag_d5", name:"D. Kalitta", pace:0.93, racecraft:0.90, consistency:0.88, fitness:0.91, age:55, nationality:"USA" },
        { id:"drag_d6", name:"J. Todd", pace:0.89, racecraft:0.86, consistency:0.84, fitness:0.87, age:39, nationality:"USA" },
    ]},
    { id:"drag_euro", name:"FIA Euro Drag Racing", color:"#7C3AED", carModel:"Top Methanol Dragster", power:0.90, reliability:0.85, drivers:[
        { id:"drag_d7", name:"D. Lexmaul", pace:0.88, racecraft:0.85, consistency:0.83, fitness:0.86, age:42, nationality:"DEU" },
        { id:"drag_d8", name:"S. Smith", pace:0.85, racecraft:0.82, consistency:0.80, fitness:0.83, age:36, nationality:"GBR" },
    ]},
];

/* --- HILL CLIMB (FIA European Hill Climb Championship) --- */
const HILLCLIMB_TEAMS = [
    { id:"hc_norma", name:"Norma Auto Concept", color:"#DC2626", carModel:"Norma M20 FC", power:0.88, reliability:0.85, drivers:[
        { id:"hc_d1", name:"C. Merli", pace:0.92, racecraft:0.89, consistency:0.87, fitness:0.90, age:38, nationality:"ITA" },
        { id:"hc_d2", name:"F. Talaux", pace:0.86, racecraft:0.83, consistency:0.81, fitness:0.84, age:34, nationality:"FRA" },
    ]},
    { id:"hc_osella", name:"Osella Racing", color:"#1E40AF", carModel:"Osella PA30", power:0.87, reliability:0.84, drivers:[
        { id:"hc_d3", name:"S. Pucci", pace:0.88, racecraft:0.85, consistency:0.83, fitness:0.86, age:45, nationality:"ITA" },
        { id:"hc_d4", name:"A. Mercurio", pace:0.84, racecraft:0.81, consistency:0.79, fitness:0.82, age:33, nationality:"ITA" },
    ]},
    { id:"hc_falcon", name:"Falcon Racing", color:"#059669", carModel:"Falcon 016", power:0.86, reliability:0.83, drivers:[
        { id:"hc_d5", name:"J. Votion", pace:0.85, racecraft:0.82, consistency:0.80, fitness:0.83, age:30, nationality:"BEL" },
        { id:"hc_d6", name:"M. Pugno", pace:0.82, racecraft:0.79, consistency:0.77, fitness:0.80, age:28, nationality:"ITA" },
    ]},
    { id:"hc_porsche", name:"Porsche Hill Climb", color:"#F59E0B", carModel:"Porsche 911 GT3 R", power:0.85, reliability:0.82, drivers:[
        { id:"hc_d7", name:"R. Klien", pace:0.84, racecraft:0.81, consistency:0.79, fitness:0.82, age:40, nationality:"AUT" },
        { id:"hc_d8", name:"T. Schirra", pace:0.80, racecraft:0.77, consistency:0.75, fitness:0.78, age:32, nationality:"DEU" },
    ]},
];

/* --- MONOMARCA AUTO (Campionati Monomarca — Fiat 500, Abarth, Clio Cup) --- */
const MONOMARCA_AUTO_TEAMS = [
    { id:"ma_abarth", name:"Abarth Racing Italia", color:"#DC2626", carModel:"Abarth 695 Assetto", power:0.82, reliability:0.79, drivers:[
        { id:"ma_d1", name:"A. Giovanardi", pace:0.84, racecraft:0.81, consistency:0.79, fitness:0.82, age:46, nationality:"ITA" },
        { id:"ma_d2", name:"F. Lorusso", pace:0.81, racecraft:0.78, consistency:0.76, fitness:0.79, age:28, nationality:"ITA" },
    ]},
    { id:"ma_clio", name:"Clio Cup Italia", color:"#1E40AF", carModel:"Renault Clio Cup", power:0.81, reliability:0.78, drivers:[
        { id:"ma_d3", name:"M. Mercuri", pace:0.82, racecraft:0.79, consistency:0.77, fitness:0.80, age:30, nationality:"ITA" },
        { id:"ma_d4", name:"A. Costa Jr.", pace:0.79, racecraft:0.76, consistency:0.74, fitness:0.77, age:23, nationality:"ITA" },
    ]},
    { id:"ma_fiat", name:"Fiat 500 Trophy", color:"#059669", carModel:"Fiat 500 Abarth", power:0.80, reliability:0.77, drivers:[
        { id:"ma_d5", name:"L. Giordano", pace:0.80, racecraft:0.77, consistency:0.75, fitness:0.78, age:27, nationality:"ITA" },
        { id:"ma_d6", name:"D. Esposito", pace:0.77, racecraft:0.74, consistency:0.72, fitness:0.75, age:22, nationality:"ITA" },
    ]},
    { id:"ma_mini", name:"Mini Challenge", color:"#7C3AED", carModel:"Mini Cooper S JCW", power:0.79, reliability:0.76, drivers:[
        { id:"ma_d7", name:"G. Romano", pace:0.78, racecraft:0.75, consistency:0.73, fitness:0.76, age:25, nationality:"ITA" },
        { id:"ma_d8", name:"F. Ferri", pace:0.75, racecraft:0.72, consistency:0.70, fitness:0.73, age:21, nationality:"ITA" },
    ]},
];

/* --- MONOMARCA MOTO (Campionati Monomarca Moto — Yamaha R3, R1, KTM RC390) --- */
const MONOMARCA_MOTO_TEAMS = [
    { id:"mm_r3", name:"Yamaha R3 Cup", color:"#1E40AF", carModel:"Yamaha YZF-R3", power:0.78, reliability:0.75, drivers:[
        { id:"mm_d1", name:"L. Torzi", pace:0.78, racecraft:0.75, consistency:0.73, fitness:0.76, age:16, nationality:"ITA" },
        { id:"mm_d2", name:"M. Signorelli", pace:0.75, racecraft:0.72, consistency:0.70, fitness:0.73, age:15, nationality:"ITA" },
    ]},
    { id:"mm_r1", name:"Yamaha R1 Cup", color:"#DC2626", carModel:"Yamaha YZF-R1", power:0.82, reliability:0.79, drivers:[
        { id:"mm_d3", name:"D. Rossi Jr.", pace:0.82, racecraft:0.79, consistency:0.77, fitness:0.80, age:22, nationality:"ITA" },
        { id:"mm_d4", name:"S. Mariani", pace:0.79, racecraft:0.76, consistency:0.74, fitness:0.77, age:20, nationality:"ITA" },
    ]},
    { id:"mm_rc390", name:"KTM RC390 Cup", color:"#F59E0B", carModel:"KTM RC390", power:0.76, reliability:0.73, drivers:[
        { id:"mm_d5", name:"A. Conti", pace:0.76, racecraft:0.73, consistency:0.71, fitness:0.74, age:17, nationality:"ITA" },
        { id:"mm_d6", name:"F. Greco", pace:0.73, racecraft:0.70, consistency:0.68, fitness:0.71, age:16, nationality:"ITA" },
    ]},
    { id:"mm_ducati", name:"Ducati Panigale Cup", color:"#7C3AED", carModel:"Ducati Panigale V2", power:0.80, reliability:0.77, drivers:[
        { id:"mm_d7", name:"G. Ferrari", pace:0.80, racecraft:0.77, consistency:0.75, fitness:0.78, age:24, nationality:"ITA" },
        { id:"mm_d8", name:"M. Bellucci", pace:0.77, racecraft:0.74, consistency:0.72, fitness:0.75, age:21, nationality:"ITA" },
    ]},
];

const SPECIAL_DATA = {
    truck: TRUCK_TEAMS,
    drag: DRAG_TEAMS,
    hillclimb: HILLCLIMB_TEAMS,
    monomarca_auto: MONOMARCA_AUTO_TEAMS,
    monomarca_moto: MONOMARCA_MOTO_TEAMS,
};

if (typeof window !== "undefined") {
    window.TRUCK_TEAMS = TRUCK_TEAMS;
    window.DRAG_TEAMS = DRAG_TEAMS;
    window.HILLCLIMB_TEAMS = HILLCLIMB_TEAMS;
    window.MONOMARCA_AUTO_TEAMS = MONOMARCA_AUTO_TEAMS;
    window.MONOMARCA_MOTO_TEAMS = MONOMARCA_MOTO_TEAMS;
    window.SPECIAL_DATA = SPECIAL_DATA;
    if (window.ALL_TEAMS) {
        window.ALL_TEAMS.truck = TRUCK_TEAMS;
        window.ALL_TEAMS.drag = DRAG_TEAMS;
        window.ALL_TEAMS.hillclimb = HILLCLIMB_TEAMS;
        window.ALL_TEAMS.monomarca_auto = MONOMARCA_AUTO_TEAMS;
        window.ALL_TEAMS.monomarca_moto = MONOMARCA_MOTO_TEAMS;
    }
}
