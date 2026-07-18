/* =============================================================================
 * ULTIMATE MOTORSPORT MANAGER
 * File: data/teams/bike_senior_junior.js
 * Squadre per Moto Senior & Junior (WSBK, Supersport, EWC, Moto Junior)
 * ========================================================================== */

/* --- WSBK (World Superbike Championship) --- */
const WSBK_TEAMS = [
    { id:"wsbk_ducati", name:"Aruba.it Racing", color:"#DC2626", carModel:"Ducati Panigale V4 R", power:0.90, reliability:0.87, drivers:[
        { id:"wsbk_d1", name:"A. Bautista", pace:0.90, racecraft:0.87, consistency:0.85, fitness:0.88, age:39, nationality:"ESP" },
        { id:"wsbk_d2", name:"N. Bulega", pace:0.86, racecraft:0.83, consistency:0.81, fitness:0.84, age:25, nationality:"ITA" },
    ]},
    { id:"wsbk_kawasaki", name:"KRT Kawasaki", color:"#059669", carModel:"Kawasaki ZX-10RR", power:0.88, reliability:0.85, drivers:[
        { id:"wsbk_d3", name:"J. Rea", pace:0.91, racecraft:0.89, consistency:0.87, fitness:0.89, age:37, nationality:"GBR" },
        { id:"wsbk_d4", name:"A. Lowes", pace:0.84, racecraft:0.81, consistency:0.79, fitness:0.82, age:33, nationality:"GBR" },
    ]},
    { id:"wsbk_yamaha", name:"Pata Yamaha", color:"#1E40AF", carModel:"Yamaha R1", power:0.87, reliability:0.84, drivers:[
        { id:"wsbk_d5", name:"T. Razgatlioglu", pace:0.92, racecraft:0.90, consistency:0.88, fitness:0.90, age:27, nationality:"TUR" },
        { id:"wsbk_d6", name:"A. Locatelli", pace:0.83, racecraft:0.80, consistency:0.78, fitness:0.81, age:28, nationality:"ITA" },
    ]},
    { id:"wsbk_honda", name:"HRC Honda", color:"#FFFFFF", carModel:"Honda CBR1000RR-R", power:0.86, reliability:0.83, drivers:[
        { id:"wsbk_d7", name:"X. Vierge", pace:0.84, racecraft:0.81, consistency:0.79, fitness:0.82, age:27, nationality:"ESP" },
        { id:"wsbk_d8", name:"I. Lecuona", pace:0.82, racecraft:0.79, consistency:0.77, fitness:0.80, age:24, nationality:"ESP" },
    ]},
    { id:"wsbk_bmw", name:"BMW Motorrad", color:"#7C3AED", carModel:"BMW M1000RR", power:0.85, reliability:0.82, drivers:[
        { id:"wsbk_d9", name:"T. Sykes", pace:0.85, racecraft:0.82, consistency:0.80, fitness:0.83, age:39, nationality:"GBR" },
        { id:"wsbk_d10", name:"M. van der Mark", pace:0.83, racecraft:0.80, consistency:0.78, fitness:0.81, age:32, nationality:"NLD" },
    ]},
];

/* --- SUPERSPORT (World Supersport) --- */
const SUPERSPORT_TEAMS = [
    { id:"ss_ducati", name:"Barnard Racing", color:"#DC2626", carModel:"Ducati Panigale V2", power:0.84, reliability:0.81, drivers:[
        { id:"ss_d1", name:"N. Bulega Jr.", pace:0.84, racecraft:0.81, consistency:0.79, fitness:0.82, age:22, nationality:"ITA" },
        { id:"ss_d2", name:"F. Caricasole", pace:0.81, racecraft:0.78, consistency:0.76, fitness:0.79, age:21, nationality:"ITA" },
    ]},
    { id:"ss_yamaha", name:"Ten Kate Yamaha", color:"#1E40AF", carModel:"Yamaha R6", power:0.83, reliability:0.80, drivers:[
        { id:"ss_d3", name:"V. Debise", pace:0.82, racecraft:0.79, consistency:0.77, fitness:0.80, age:28, nationality:"FRA" },
        { id:"ss_d4", name:"M. Schrotter", pace:0.80, racecraft:0.77, consistency:0.75, fitness:0.78, age:26, nationality:"DEU" },
    ]},
    { id:"ss_kawasaki", name:"Kawasaki Puccetti", color:"#059669", carModel:"Kawasaki ZX-6R", power:0.82, reliability:0.79, drivers:[
        { id:"ss_d5", name:"T. Booth-Amos", pace:0.81, racecraft:0.78, consistency:0.76, fitness:0.79, age:27, nationality:"GBR" },
        { id:"ss_d6", name:"A. Bastianelli", pace:0.78, racecraft:0.75, consistency:0.73, fitness:0.76, age:24, nationality:"ITA" },
    ]},
    { id:"ss_mv", name:"MV Agusta Reparto", color:"#F59E0B", carModel:"MV Agusta F3 675", power:0.81, reliability:0.78, drivers:[
        { id:"ss_d7", name:"M. Pons", pace:0.80, racecraft:0.77, consistency:0.75, fitness:0.78, age:25, nationality:"ESP" },
        { id:"ss_d8", name:"L. Bernardi", pace:0.77, racecraft:0.74, consistency:0.72, fitness:0.75, age:23, nationality:"FRA" },
    ]},
];

/* --- EWC (Endurance World Championship — Moto) --- */
const EWC_TEAMS = [
    { id:"ewc_yart", name:"YART Yamaha", color:"#1E40AF", carModel:"Yamaha R1 EWC", power:0.86, reliability:0.84, drivers:[
        { id:"ewc_d1", name:"M. Fritz", pace:0.85, racecraft:0.82, consistency:0.80, fitness:0.83, age:35, nationality:"AUT" },
        { id:"ewc_d2", name:"K. Foray", pace:0.83, racecraft:0.80, consistency:0.78, fitness:0.81, age:34, nationality:"FRA" },
        { id:"ewc_d3", name:"N. Prutti", pace:0.81, racecraft:0.78, consistency:0.76, fitness:0.79, age:30, nationality:"ITA" },
    ]},
    { id:"ewc_yoshimura", name:"Yoshimura SERT", color:"#DC2626", carModel:"Suzuki GSX-R1000 EWC", power:0.85, reliability:0.83, drivers:[
        { id:"ewc_d4", name:"G. Marmaverk", pace:0.84, racecraft:0.81, consistency:0.79, fitness:0.82, age:33, nationality:"SWE" },
        { id:"ewc_d5", name:"C. Vincent", pace:0.82, racecraft:0.79, consistency:0.77, fitness:0.80, age:31, nationality:"FRA" },
        { id:"ewc_d6", name:"S. Watanabe", pace:0.80, racecraft:0.77, consistency:0.75, fitness:0.78, age:29, nationality:"JPN" },
    ]},
    { id:"ewc_bmw", name:"BMW Motorrad World EWC", color:"#7C3AED", carModel:"BMW M1000RR EWC", power:0.84, reliability:0.82, drivers:[
        { id:"ewc_d7", name:"M. Reiterberger", pace:0.83, racecraft:0.80, consistency:0.78, fitness:0.81, age:30, nationality:"DEU" },
        { id:"ewc_d8", name:"I. Moro", pace:0.81, racecraft:0.78, consistency:0.76, fitness:0.79, age:36, nationality:"ITA" },
        { id:"ewc_d9", name:"T. Zaire", pace:0.79, racecraft:0.76, consistency:0.74, fitness:0.77, age:27, nationality:"FRA" },
    ]},
    { id:"ewc_webike", name:"Webike Trickstar", color:"#059669", carModel:"Kawasaki ZX-10RR EWC", power:0.83, reliability:0.81, drivers:[
        { id:"ewc_d10", name:"R. Hikawa", pace:0.82, racecraft:0.79, consistency:0.77, fitness:0.80, age:34, nationality:"JPN" },
        { id:"ewc_d11", name:"T. Ikegami", pace:0.80, racecraft:0.77, consistency:0.75, fitness:0.78, age:30, nationality:"JPN" },
        { id:"ewc_d12", name:"C. Smith", pace:0.78, racecraft:0.75, consistency:0.73, fitness:0.76, age:28, nationality:"GBR" },
    ]},
];

/* --- MOTO JUNIOR (MotoE + FIM Enel — eMoto) --- */
const MOTO_JUNIOR_TEAMS = [
    { id:"mj_aspar", name:"Aspar Team", color:"#DC2626", carModel:"Energica Ego Corsa", power:0.84, reliability:0.82, drivers:[
        { id:"mj_d1", name:"J. Tuor", pace:0.84, racecraft:0.81, consistency:0.79, fitness:0.82, age:24, nationality:"SUI" },
        { id:"mj_d2", name:"M. Casadei", pace:0.81, racecraft:0.78, consistency:0.76, fitness:0.79, age:26, nationality:"ITA" },
    ]},
    { id:"mj_pons", name:"Pons Racing", color:"#1E40AF", carModel:"Energica Ego Corsa", power:0.83, reliability:0.81, drivers:[
        { id:"mj_d3", name:"E. Granado", pace:0.83, racecraft:0.80, consistency:0.78, fitness:0.81, age:25, nationality:"BRA" },
        { id:"mj_d4", name:"H. Aegerter", pace:0.80, racecraft:0.77, consistency:0.75, fitness:0.78, age:29, nationality:"SUI" },
    ]},
    { id:"mj_ongetta", name:"Ongetta Racing", color:"#059669", carModel:"Energica Ego Corsa", power:0.82, reliability:0.80, drivers:[
        { id:"mj_d5", name:"T. Manzi", pace:0.81, racecraft:0.78, consistency:0.76, fitness:0.79, age:26, nationality:"ITA" },
        { id:"mj_d6", name:"B. Odendaal", pace:0.78, racecraft:0.75, consistency:0.73, fitness:0.76, age:24, nationality:"ZAF" },
    ]},
    { id:"mj_prustel", name:"Prustrael GP", color:"#F59E0B", carModel:"Energica Ego Corsa", power:0.81, reliability:0.79, drivers:[
        { id:"mj_d7", name:"A. Ferrara", pace:0.79, racecraft:0.76, consistency:0.74, fitness:0.77, age:23, nationality:"ITA" },
        { id:"mj_d8", name:"L. Sponza", pace:0.76, racecraft:0.73, consistency:0.71, fitness:0.74, age:22, nationality:"ITA" },
    ]},
];

const BIKE_SENIOR_JUNIOR_DATA = {
    wsbk: WSBK_TEAMS,
    supersport: SUPERSPORT_TEAMS,
    ewc: EWC_TEAMS,
    moto_junior: MOTO_JUNIOR_TEAMS,
};

if (typeof window !== "undefined") {
    window.WSBK_TEAMS = WSBK_TEAMS;
    window.SUPERSPORT_TEAMS = SUPERSPORT_TEAMS;
    window.EWC_TEAMS = EWC_TEAMS;
    window.MOTO_JUNIOR_TEAMS = MOTO_JUNIOR_TEAMS;
    window.BIKE_SENIOR_JUNIOR_DATA = BIKE_SENIOR_JUNIOR_DATA;
    if (window.ALL_TEAMS) {
        window.ALL_TEAMS.wsbk = WSBK_TEAMS;
        window.ALL_TEAMS.supersport = SUPERSPORT_TEAMS;
        window.ALL_TEAMS.ewc = EWC_TEAMS;
        window.ALL_TEAMS.moto_junior = MOTO_JUNIOR_TEAMS;
    }
}
