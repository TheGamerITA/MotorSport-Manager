/* =============================================================================
 * ULTIMATE MOTORSPORT MANAGER
 * File: data/teams/rallycross_offroad.js
 * Teams for Rallycross & Offroad (WRX, Autocross)
 * ========================================================================== */

/* --- WORLD RALLYCROSS CHAMPIONSHIP (WRX) --- */
const WRX_TEAMS = [
    { id:"wrx_hansen", name:"Hansen World RX", color:"#DC2626", carModel:"Peugeot 208 WRX", power:0.88, reliability:0.85, drivers:[
        { id:"wrx_d1", name:"T. Hansen", pace:0.88, racecraft:0.86, consistency:0.84, fitness:0.86, age:30, nationality:"SWE" },
        { id:"wrx_d2", name:"K. Hansen", pace:0.86, racecraft:0.84, consistency:0.82, fitness:0.84, age:33, nationality:"SWE" },
    ]},
    { id:"wrx_kristoff", name:"Kristofferson Motorsport", color:"#1E40AF", carModel:"Volkswagen Polo WRX", power:0.87, reliability:0.84, drivers:[
        { id:"wrx_d3", name:"J. Kristoffersson", pace:0.89, racecraft:0.87, consistency:0.85, fitness:0.87, age:34, nationality:"SWE" },
        { id:"wrx_d4", name:"O. Solberg", pace:0.84, racecraft:0.82, consistency:0.80, fitness:0.82, age:27, nationality:"NOR" },
    ]},
    { id:"wrx_gronholm", name:"GRX SET", color:"#059669", carModel:"Hyundai i20 WRX", power:0.86, reliability:0.83, drivers:[
        { id:"wrx_d5", name:"N. Grönholm", pace:0.87, racecraft:0.85, consistency:0.83, fitness:0.85, age:31, nationality:"FIN" },
        { id:"wrx_d6", name:"T. Timer", pace:0.83, racecraft:0.81, consistency:0.79, fitness:0.81, age:28, nationality:"EST" },
    ]},
    { id:"wrx_ekstrom", name:"EKS Audi Sport", color:"#7C3AED", carModel:"Audi S1 WRX", power:0.85, reliability:0.82, drivers:[
        { id:"wrx_d7", name:"M. Ekström", pace:0.86, racecraft:0.84, consistency:0.82, fitness:0.84, age:44, nationality:"SWE" },
        { id:"wrx_d8", name:"A. Marklund", pace:0.83, racecraft:0.81, consistency:0.79, fitness:0.81, age:30, nationality:"SWE" },
    ]},
    { id:"wrx_bakkerud", name:"Bakkerud RX", color:"#F59E0B", carModel:"Ford Fiesta WRX", power:0.84, reliability:0.81, drivers:[
        { id:"wrx_d9", name:"A. Bakkerud", pace:0.85, racecraft:0.83, consistency:0.81, fitness:0.83, age:31, nationality:"NOR" },
        { id:"wrx_d10", name:"L. Dorjee", pace:0.81, racecraft:0.79, consistency:0.77, fitness:0.79, age:26, nationality:"FRA" },
    ]},
];

/* --- EUROPEAN RALLYCROSS (Euro RX) --- */
const EURORX_TEAMS = [
    { id:"eurorx_rx1", name:"Team FABCross", color:"#1E40AF", carModel:"Citroën DS3 RX1", power:0.82, reliability:0.80, drivers:[
        { id:"eurorx_d1", name:"P. Hedström", pace:0.82, racecraft:0.80, consistency:0.78, fitness:0.80, age:34, nationality:"SWE" },
        { id:"eurorx_d2", name:"D. Vasarov", pace:0.79, racecraft:0.77, consistency:0.75, fitness:0.77, age:29, nationality:"CZE" },
    ]},
    { id:"eurorx_rx2", name:"Volland Racing", color:"#DC2626", carModel:"Audi A1 RX1", power:0.81, reliability:0.79, drivers:[
        { id:"eurorx_d3", name:"M. Volland", pace:0.81, racecraft:0.79, consistency:0.77, fitness:0.79, age:38, nationality:"DEU" },
        { id:"eurorx_d4", name:"C. Kastner", pace:0.78, racecraft:0.76, consistency:0.74, fitness:0.76, age:26, nationality:"DEU" },
    ]},
    { id:"eurorx_rx3", name:"Stude Racing", color:"#059669", carModel:"Skoda Fabia RX3", power:0.80, reliability:0.78, drivers:[
        { id:"eurorx_d5", name:"J. Stude", pace:0.80, racecraft:0.78, consistency:0.76, fitness:0.78, age:33, nationality:"EST" },
        { id:"eurorx_d6", name:"A. Margas", pace:0.77, racecraft:0.75, consistency:0.73, fitness:0.75, age:25, nationality:"POL" },
    ]},
];

/* --- AUTOCROSS (FIA European Autocross) --- */
const AUTOCROSS_TEAMS = [
    { id:"ac_diver", name:"Diver Racing", color:"#DC2626", carModel:"Skoda Fabia Cross Special", power:0.82, reliability:0.80, drivers:[
        { id:"ac_d1", name:"M. Svihlik", pace:0.82, racecraft:0.80, consistency:0.78, fitness:0.80, age:35, nationality:"CZE" },
        { id:"ac_d2", name:"J. Hrabe", pace:0.79, racecraft:0.77, consistency:0.75, fitness:0.77, age:28, nationality:"CZE" },
    ]},
    { id:"ac_janssen", name:"Janssen Motorsport", color:"#1E40AF", carModel:"VW Golf Cross Special", power:0.81, reliability:0.79, drivers:[
        { id:"ac_d3", name:"M. Janssen", pace:0.81, racecraft:0.79, consistency:0.77, fitness:0.79, age:32, nationality:"NLD" },
        { id:"ac_d4", name:"R. Janssen", pace:0.78, racecraft:0.76, consistency:0.74, fitness:0.76, age:27, nationality:"NLD" },
    ]},
    { id:"ac_lagache", name:"Lagache Racing", color:"#059669", carModel:"Peugeot 206 Cross Special", power:0.80, reliability:0.78, drivers:[
        { id:"ac_d5", name:"B. Lagache", pace:0.80, racecraft:0.78, consistency:0.76, fitness:0.78, age:30, nationality:"FRA" },
        { id:"ac_d6", name:"P. Bertin", pace:0.77, racecraft:0.75, consistency:0.73, fitness:0.75, age:24, nationality:"FRA" },
    ]},
    { id:"ac_ziggo", name:"Ziggo Racing", color:"#F59E0B", carModel:"Citroën C2 Cross Special", power:0.79, reliability:0.77, drivers:[
        { id:"ac_d7", name:"A. Ziggo", pace:0.79, racecraft:0.77, consistency:0.75, fitness:0.77, age:29, nationality:"ITA" },
        { id:"ac_d8", name:"G. Bruschi", pace:0.76, racecraft:0.74, consistency:0.72, fitness:0.74, age:23, nationality:"ITA" },
    ]},
];

const RALLYCROSS_OFFROAD_DATA = {
    wrx: WRX_TEAMS,
    eurorx: EURORX_TEAMS,
    autocross: AUTOCROSS_TEAMS,
};

if (typeof window !== "undefined") {
    window.WRX_TEAMS = WRX_TEAMS;
    window.EURORX_TEAMS = EURORX_TEAMS;
    window.AUTOCROSS_TEAMS = AUTOCROSS_TEAMS;
    window.RALLYCROSS_OFFROAD_DATA = RALLYCROSS_OFFROAD_DATA;
    if (window.ALL_TEAMS) {
        window.ALL_TEAMS.wrx = WRX_TEAMS;
        window.ALL_TEAMS.autocross = AUTOCROSS_TEAMS;
    }
}
