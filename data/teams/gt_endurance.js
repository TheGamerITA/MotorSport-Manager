/* =============================================================================
 * ULTIMATE MOTORSPORT MANAGER
 * File: data/teams/gt_endurance.js
 * Squadre per GT & Endurance (ELMS, IMSA, GTWC, GT Open, GT2, Ferrari, Porsche, Lambo)
 * ========================================================================== */

/* --- ELMS (European Le Mans Series) — LMP2/LMP3 + LMGTE --- */
const ELMS_TEAMS = [
    { id:"elms_panis", name:"Panis Racing", color:"#1E40AF", carModel:"Oreca 07 Gibson", power:0.86, reliability:0.82, drivers:[
        { id:"elms_d1", name:"J. Canal", pace:0.85, racecraft:0.80, consistency:0.78, fitness:0.82, age:32, nationality:"FRA" },
        { id:"elms_d2", name:"L. Jamin", pace:0.83, racecraft:0.78, consistency:0.76, fitness:0.80, age:29, nationality:"FRA" },
        { id:"elms_d3", name:"A. Pla", pace:0.82, racecraft:0.76, consistency:0.74, fitness:0.78, age:34, nationality:"FRA" },
    ]},
    { id:"elms_almgvar", name:"Algarve Pro Racing", color:"#059669", carModel:"Oreca 07 Gibson", power:0.84, reliability:0.80, drivers:[
        { id:"elms_d4", name:"B. Hanley", pace:0.84, racecraft:0.78, consistency:0.76, fitness:0.80, age:36, nationality:"GBR" },
        { id:"elms_d5", name:"J. Allen", pace:0.81, racecraft:0.74, consistency:0.72, fitness:0.76, age:28, nationality:"AUS" },
        { id:"elms_d6", name:"A. Peroni", pace:0.79, racecraft:0.72, consistency:0.70, fitness:0.74, age:25, nationality:"AUS" },
    ]},
    { id:"elms_coole", name:"Cool Racing", color:"#0EA5E9", carModel:"Oreca 07 Gibson", power:0.83, reliability:0.79, drivers:[
        { id:"elms_d7", name:"N. Lapierre", pace:0.86, racecraft:0.82, consistency:0.80, fitness:0.83, age:40, nationality:"FRA" },
        { id:"elms_d8", name:"M. Vaxiviere", pace:0.83, racecraft:0.77, consistency:0.75, fitness:0.78, age:30, nationality:"FRA" },
        { id:"elms_d9", name:"S. Bracalente", pace:0.78, racecraft:0.70, consistency:0.68, fitness:0.72, age:27, nationality:"BRA" },
    ]},
    { id:"elms_irta", name:"IRL Racing", color:"#DC2626", carModel:"Oreca 07 Gibson", power:0.82, reliability:0.78, drivers:[
        { id:"elms_d10", name:"R. Kraihamer", pace:0.81, racecraft:0.74, consistency:0.72, fitness:0.76, age:34, nationality:"AUT" },
        { id:"elms_d11", name:"F. Castello", pace:0.78, racecraft:0.70, consistency:0.68, fitness:0.73, age:26, nationality:"ESP" },
        { id:"elms_d12", name:"D. Mason", pace:0.76, racecraft:0.68, consistency:0.66, fitness:0.71, age:29, nationality:"GBR" },
    ]},
];

/* --- IMSA — DPi/LMP2/LMP3/GT --- */
const IMSA_TEAMS = [
    { id:"imsa_cadillac", name:"Cadillac Racing", color:"#1E293B", carModel:"Cadillac DPi-V.R", power:0.88, reliability:0.85, drivers:[
        { id:"imsa_d1", name:"S. van der Poel", pace:0.88, racecraft:0.84, consistency:0.82, fitness:0.85, age:38, nationality:"NLD" },
        { id:"imsa_d2", name:"R. Westbrook", pace:0.86, racecraft:0.82, consistency:0.80, fitness:0.83, age:43, nationality:"GBR" },
        { id:"imsa_d3", name:"L. Duval", pace:0.84, racecraft:0.80, consistency:0.78, fitness:0.81, age:40, nationality:"FRA" },
    ]},
    { id:"imsa_acura", name:"Acura ARX-05", color:"#FFFFFF", carModel:"Acura ARX-05", power:0.87, reliability:0.84, drivers:[
        { id:"imsa_d4", name:"R. Taylor", pace:0.86, racecraft:0.82, consistency:0.80, fitness:0.82, age:36, nationality:"USA" },
        { id:"imsa_d5", name:"H. Fraga", pace:0.84, racecraft:0.80, consistency:0.78, fitness:0.80, age:35, nationality:"BRA" },
        { id:"imsa_d6", name:"A. Simpson", pace:0.82, racecraft:0.78, consistency:0.76, fitness:0.78, age:32, nationality:"USA" },
    ]},
    { id:"imsa_mazda", name:"Mazda Motorsports", color:"#F59E0B", carModel:"Mazda RT24-P", power:0.86, reliability:0.83, drivers:[
        { id:"imsa_d7", name:"O. Pla", pace:0.84, racecraft:0.80, consistency:0.78, fitness:0.81, age:38, nationality:"FRA" },
        { id:"imsa_d8", name:"T. Bomarito", pace:0.83, racecraft:0.78, consistency:0.76, fitness:0.79, age:37, nationality:"USA" },
        { id:"imsa_d9", name:"J. Nunez", pace:0.81, racecraft:0.76, consistency:0.74, fitness:0.77, age:30, nationality:"USA" },
    ]},
    { id:"imsa_nissan", name:"Nissan Onroak", color:"#DC2626", carModel:"Nissan Onroak DPi", power:0.85, reliability:0.82, drivers:[
        { id:"imsa_d10", name:"P. Barbosa", pace:0.83, racecraft:0.78, consistency:0.76, fitness:0.79, age:41, nationality:"PRT" },
        { id:"imsa_d11", name:"J. Goossens", pace:0.82, racecraft:0.77, consistency:0.75, fitness:0.78, age:44, nationality:"BEL" },
        { id:"imsa_d12", name:"R. Derani", pace:0.85, racecraft:0.81, consistency:0.79, fitness:0.82, age:29, nationality:"BRA" },
    ]},
];

/* --- GT WORLD CHALLENGE (GTWC) — GT3 --- */
const GTWC_TEAMS = [
    { id:"gtwc_wrt", name:"Team WRT", color:"#1E40AF", carModel:"Audi R8 LMS GT3", power:0.86, reliability:0.83, drivers:[
        { id:"gtwc_d1", name:"D. Vervisch", pace:0.85, racecraft:0.82, consistency:0.80, fitness:0.82, age:38, nationality:"BEL" },
        { id:"gtwc_d2", name:"C. Mies", pace:0.84, racecraft:0.81, consistency:0.79, fitness:0.81, age:34, nationality:"DEU" },
        { id:"gtwc_d3", name:"R. Feller", pace:0.82, racecraft:0.78, consistency:0.76, fitness:0.78, age:24, nationality:"CHE" },
    ]},
    { id:"gtwc_akkodis", name:"Akkodis ASP", color:"#059669", carModel:"Mercedes-AMG GT3", power:0.85, reliability:0.82, drivers:[
        { id:"gtwc_d4", name:"R. Marciello", pace:0.86, racecraft:0.83, consistency:0.81, fitness:0.83, age:29, nationality:"SUI" },
        { id:"gtwc_d5", name:"J. Juncadella", pace:0.84, racecraft:0.81, consistency:0.79, fitness:0.81, age:32, nationality:"ESP" },
        { id:"gtwc_d6", name:"M. Mapelli", pace:0.82, racecraft:0.78, consistency:0.76, fitness:0.78, age:35, nationality:"ITA" },
    ]},
    { id:"gtwc_iron", name:"Iron Lynx", color:"#DC2626", carModel:"Ferrari 296 GT3", power:0.84, reliability:0.81, drivers:[
        { id:"gtwc_d7", name:"A. Pier Guidi", pace:0.86, racecraft:0.83, consistency:0.81, fitness:0.83, age:40, nationality:"ITA" },
        { id:"gtwc_d8", name:"M. Calado", pace:0.85, racecraft:0.82, consistency:0.80, fitness:0.82, age:34, nationality:"GBR" },
        { id:"gtwc_d9", name:"A. Fuoco", pace:0.82, racecraft:0.78, consistency:0.76, fitness:0.78, age:30, nationality:"ITA" },
    ]},
    { id:"gtwc_rnr", name:"RN Racing", color:"#F59E0B", carModel:"BMW M4 GT3", power:0.83, reliability:0.80, drivers:[
        { id:"gtwc_d10", name:"P. Eng", pace:0.84, racecraft:0.81, consistency:0.79, fitness:0.81, age:36, nationality:"CAN" },
        { id:"gtwc_d11", name:"M. Farfus", pace:0.83, racecraft:0.80, consistency:0.78, fitness:0.80, age:39, nationality:"BRA" },
        { id:"gtwc_d12", name:"S. Eder", pace:0.80, racecraft:0.76, consistency:0.74, fitness:0.76, age:27, nationality:"AUT" },
    ]},
    { id:"gtwc_grass", name:"Grasshtal Motorsport", color:"#7C3AED", carModel:"Porsche 911 GT3-R", power:0.82, reliability:0.79, drivers:[
        { id:"gtwc_d13", name:"K. Estre", pace:0.85, racecraft:0.82, consistency:0.80, fitness:0.82, age:34, nationality:"FRA" },
        { id:"gtwc_d14", name:"M. Christensen", pace:0.83, racecraft:0.80, consistency:0.78, fitness:0.80, age:35, nationality:"DEU" },
        { id:"gtwc_d15", name:"L. Vanthoor", pace:0.82, racecraft:0.79, consistency:0.77, fitness:0.79, age:32, nationality:"BEL" },
    ]},
    { id:"gtwc_comtoyou", name:"Comtoyou Racing", color:"#0EA5E9", carModel:"Aston Martin Vantage GT3", power:0.81, reliability:0.78, drivers:[
        { id:"gtwc_d16", name:"N. Varrone", pace:0.81, racecraft:0.78, consistency:0.76, fitness:0.78, age:29, nationality:"BEL" },
        { id:"gtwc_d17", name:"M. Sørensen", pace:0.80, racecraft:0.77, consistency:0.75, fitness:0.77, age:34, nationality:"DNK" },
        { id:"gtwc_d18", name:"T. Smeets", pace:0.77, racecraft:0.73, consistency:0.71, fitness:0.74, age:25, nationality:"NLD" },
    ]},
];

/* --- GT OPEN (International GT Open) --- */
const GTOPEN_TEAMS = [
    { id:"gto_era", name:"ERA Motorsport", color:"#1E40AF", carModel:"Ferrari 296 GT3", power:0.84, reliability:0.81, drivers:[
        { id:"gto_d1", name:"E. Planelli", pace:0.83, racecraft:0.80, consistency:0.78, fitness:0.80, age:35, nationality:"ITA" },
        { id:"gto_d2", name:"G. Taverna", pace:0.80, racecraft:0.76, consistency:0.74, fitness:0.76, age:30, nationality:"ITA" },
    ]},
    { id:"gto_rex", name:"REX Racing", color:"#DC2626", carModel:"Lamborghini Huracán GT3", power:0.83, reliability:0.80, drivers:[
        { id:"gto_d3", name:"D. Kujala", pace:0.82, racecraft:0.78, consistency:0.76, fitness:0.78, age:33, nationality:"FIN" },
        { id:"gto_d4", name:"M. Padovani", pace:0.79, racecraft:0.74, consistency:0.72, fitness:0.75, age:28, nationality:"ITA" },
    ]},
    { id:"gto_optimum", name:"Optimum Motorsport", color:"#059669", carModel:"McLaren 720S GT3", power:0.82, reliability:0.79, drivers:[
        { id:"gto_d5", name:"B. Smith", pace:0.81, racecraft:0.77, consistency:0.75, fitness:0.77, age:32, nationality:"GBR" },
        { id:"gto_d6", name:"M. Macdonald", pace:0.78, racecraft:0.73, consistency:0.71, fitness:0.74, age:26, nationality:"GBR" },
    ]},
    { id:"gto_century", name:"Century Motorsport", color:"#F59E0B", carModel:"BMW M4 GT3", power:0.81, reliability:0.78, drivers:[
        { id:"gto_d7", name:"J. Mason", pace:0.80, racecraft:0.76, consistency:0.74, fitness:0.76, age:30, nationality:"GBR" },
        { id:"gto_d8", name:"T. Potts", pace:0.77, racecraft:0.72, consistency:0.70, fitness:0.73, age:28, nationality:"GBR" },
    ]},
];

/* --- GT2 EUROPEAN SERIES --- */
const GT2_TEAMS = [
    { id:"gt2_lp", name:"LP Racing", color:"#1E40AF", carModel:"Porsche 911 GT2 RS", power:0.83, reliability:0.80, drivers:[
        { id:"gt2_d1", name:"D. Rehfeld", pace:0.82, racecraft:0.78, consistency:0.76, fitness:0.78, age:38, nationality:"DEU" },
        { id:"gt2_d2", name:"G. Heria", pace:0.79, racecraft:0.74, consistency:0.72, fitness:0.75, age:33, nationality:"FRA" },
    ]},
    { id:"gt2_rinaldi", name:"Rinaldi Racing", color:"#DC2626", carModel:"Ferrari 488 GT2", power:0.82, reliability:0.79, drivers:[
        { id:"gt2_d3", name:"M. Biagi", pace:0.81, racecraft:0.77, consistency:0.75, fitness:0.77, age:40, nationality:"ITA" },
        { id:"gt2_d4", name:"A. Bertolini", pace:0.80, racecraft:0.76, consistency:0.74, fitness:0.76, age:43, nationality:"ITA" },
    ]},
    { id:"gt2_brk", name:"Brk Motorsport", color:"#059669", carModel:"Audi R8 LMS GT2", power:0.81, reliability:0.78, drivers:[
        { id:"gt2_d5", name:"H. Lethiers", pace:0.80, racecraft:0.75, consistency:0.73, fitness:0.75, age:35, nationality:"BEL" },
        { id:"gt2_d6", name:"P. Martin", pace:0.77, racecraft:0.72, consistency:0.70, fitness:0.73, age:30, nationality:"ESP" },
    ]},
    { id:"gt2_treg", name:"Tregt Racing", color:"#F59E0B", carModel:"KTM X-Bow GT2", power:0.80, reliability:0.77, drivers:[
        { id:"gt2_d7", name:"S. Koritus", pace:0.79, racecraft:0.74, consistency:0.72, fitness:0.74, age:34, nationality:"AUT" },
        { id:"gt2_d8", name:"R. Anger", pace:0.76, racecraft:0.70, consistency:0.68, fitness:0.71, age:28, nationality:"DEU" },
    ]},
];

/* --- FERRARI CHALLENGE (Monomarca GT) --- */
const FERRARI_CHALLENGE_TEAMS = [
    { id:"fc_rossocorsa", name:"Rosso Corsa", color:"#DC2626", carModel:"Ferrari 296 Challenge", power:0.82, reliability:0.80, drivers:[
        { id:"fc_d1", name:"G. Bruni", pace:0.83, racecraft:0.79, consistency:0.77, fitness:0.79, age:42, nationality:"ITA" },
        { id:"fc_d2", name:"L. Romano", pace:0.78, racecraft:0.73, consistency:0.71, fitness:0.74, age:33, nationality:"ITA" },
    ]},
    { id:"fc_ferrari_uk", name:"Ferrari London", color:"#1E40AF", carModel:"Ferrari 296 Challenge", power:0.80, reliability:0.78, drivers:[
        { id:"fc_d3", name:"C. Hough", pace:0.79, racecraft:0.74, consistency:0.72, fitness:0.75, age:45, nationality:"GBR" },
        { id:"fc_d4", name:"R. Clarke", pace:0.76, racecraft:0.70, consistency:0.68, fitness:0.72, age:38, nationality:"GBR" },
    ]},
    { id:"fc_ht", name:"HT Motor Sport", color:"#F59E0B", carModel:"Ferrari 296 Challenge", power:0.79, reliability:0.77, drivers:[
        { id:"fc_d5", name:"F. Smargiasse", pace:0.78, racecraft:0.73, consistency:0.71, fitness:0.74, age:41, nationality:"FRA" },
        { id:"fc_d6", name:"M. Costabel", pace:0.75, racecraft:0.69, consistency:0.67, fitness:0.71, age:36, nationality:"FRA" },
    ]},
    { id:"fc_baron", name:"Baron Motorsport", color:"#059669", carModel:"Ferrari 296 Challenge", power:0.78, reliability:0.76, drivers:[
        { id:"fc_d7", name:"M. Malucelli", pace:0.77, racecraft:0.72, consistency:0.70, fitness:0.73, age:38, nationality:"ITA" },
        { id:"fc_d8", name:"S. Kessel", pace:0.74, racecraft:0.68, consistency:0.66, fitness:0.70, age:32, nationality:"CHE" },
    ]},
];

/* --- PORSCHE CARRERA CUP (Monomarca GT) --- */
const PORSCHE_CUP_TEAMS = [
    { id:"pc_bachata", name:"Bachata Racing", color:"#DC2626", carModel:"Porsche 911 GT3 Cup", power:0.82, reliability:0.80, drivers:[
        { id:"pc_d1", name:"L. Inthrapuvas", pace:0.83, racecraft:0.79, consistency:0.77, fitness:0.79, age:31, nationality:"THA" },
        { id:"pc_d2", name:"A. Bachour", pace:0.80, racecraft:0.75, consistency:0.73, fitness:0.76, age:28, nationality:"LBN" },
    ]},
    { id:"pc_fach", name:"Fach Auto Tech", color:"#1E40AF", carModel:"Porsche 911 GT3 Cup", power:0.81, reliability:0.79, drivers:[
        { id:"pc_d3", name:"T. Preining", pace:0.82, racecraft:0.78, consistency:0.76, fitness:0.78, age:30, nationality:"AUT" },
        { id:"pc_d4", name:"A. Rappange", pace:0.79, racecraft:0.74, consistency:0.72, fitness:0.75, age:27, nationality:"NLD" },
    ]},
    { id:"pc_schmidt", name:"Schmidt Motorsport", color:"#F59E0B", carModel:"Porsche 911 GT3 Cup", power:0.80, reliability:0.78, drivers:[
        { id:"pc_d5", name:"L. Schmidt", pace:0.80, racecraft:0.75, consistency:0.73, fitness:0.75, age:29, nationality:"DEU" },
        { id:"pc_d6", name:"M. Sattler", pace:0.77, racecraft:0.72, consistency:0.70, fitness:0.73, age:26, nationality:"DEU" },
    ]},
    { id:"pc_turk", name:"Türk Motorsport", color:"#059669", carModel:"Porsche 911 GT3 Cup", power:0.79, reliability:0.77, drivers:[
        { id:"pc_d7", name:"M. Yigit", pace:0.79, racecraft:0.74, consistency:0.72, fitness:0.74, age:30, nationality:"TUR" },
        { id:"pc_d8", name:"E. Ates", pace:0.76, racecraft:0.71, consistency:0.69, fitness:0.71, age:25, nationality:"TUR" },
    ]},
];

/* --- LAMBORGHINI SUPER TROFEO (Monomarca GT) --- */
const LAMBORGHINI_TROFEO_TEAMS = [
    { id:"lt_target", name:"Target Racing", color:"#1E40AF", carModel:"Lamborghini Huracán ST", power:0.83, reliability:0.80, drivers:[
        { id:"lt_d1", name:"A. Imperatori", pace:0.83, racecraft:0.79, consistency:0.77, fitness:0.79, age:35, nationality:"ITA" },
        { id:"lt_d2", name:"K. Mapelli", pace:0.80, racecraft:0.75, consistency:0.73, fitness:0.76, age:32, nationality:"ITA" },
    ]},
    { id:"lt_vision", name:"Vision Racing", color:"#DC2626", carModel:"Lamborghini Huracán ST", power:0.82, reliability:0.79, drivers:[
        { id:"lt_d3", name:"M. Bortolotti", pace:0.82, racecraft:0.78, consistency:0.76, fitness:0.78, age:31, nationality:"ITA" },
        { id:"lt_d4", name:"K. Varrone", pace:0.79, racecraft:0.74, consistency:0.72, fitness:0.75, age:27, nationality:"BEL" },
    ]},
    { id:"lt_dlp", name:"DLP Racing", color:"#F59E0B", carModel:"Lamborghini Huracán ST", power:0.81, reliability:0.78, drivers:[
        { id:"lt_d5", name:"J. Deneen", pace:0.80, racecraft:0.75, consistency:0.73, fitness:0.75, age:30, nationality:"USA" },
        { id:"lt_d6", name:"B. Lyng", pace:0.77, racecraft:0.72, consistency:0.70, fitness:0.72, age:26, nationality:"DNK" },
    ]},
    { id:"lt_oxygen", name:"Oxygen Racing", color:"#059669", carModel:"Lamborghini Huracán ST", power:0.80, reliability:0.77, drivers:[
        { id:"lt_d7", name:"L. Schaufele", pace:0.79, racecraft:0.74, consistency:0.72, fitness:0.74, age:33, nationality:"DEU" },
        { id:"lt_d8", name:"R. Fontana", pace:0.76, racecraft:0.70, consistency:0.68, fitness:0.71, age:28, nationality:"ITA" },
    ]},
];

const GT_ENDURANCE_DATA = {
    elms: ELMS_TEAMS,
    imsa: IMSA_TEAMS,
    gtwc: GTWC_TEAMS,
    gtopen: GTOPEN_TEAMS,
    gt2: GT2_TEAMS,
    ferrari_challenge: FERRARI_CHALLENGE_TEAMS,
    porsche_cup: PORSCHE_CUP_TEAMS,
    lamborghini_trofeo: LAMBORGHINI_TROFEO_TEAMS,
};

if (typeof window !== "undefined") {
    window.ELMS_TEAMS = ELMS_TEAMS;
    window.IMSA_TEAMS = IMSA_TEAMS;
    window.GTWC_TEAMS = GTWC_TEAMS;
    window.GTOPEN_TEAMS = GTOPEN_TEAMS;
    window.GT2_TEAMS = GT2_TEAMS;
    window.FERRARI_CHALLENGE_TEAMS = FERRARI_CHALLENGE_TEAMS;
    window.PORSCHE_CUP_TEAMS = PORSCHE_CUP_TEAMS;
    window.LAMBORGHINI_TROFEO_TEAMS = LAMBORGHINI_TROFEO_TEAMS;
    window.GT_ENDURANCE_DATA = GT_ENDURANCE_DATA;
    if (window.ALL_TEAMS) {
        window.ALL_TEAMS.elms = ELMS_TEAMS;
        window.ALL_TEAMS.imsa = IMSA_TEAMS;
        window.ALL_TEAMS.gtwc = GTWC_TEAMS;
        window.ALL_TEAMS.gtopen = GTOPEN_TEAMS;
        window.ALL_TEAMS.gt2 = GT2_TEAMS;
        window.ALL_TEAMS.ferrari_challenge = FERRARI_CHALLENGE_TEAMS;
        window.ALL_TEAMS.porsche_cup = PORSCHE_CUP_TEAMS;
        window.ALL_TEAMS.lamborghini_trofeo = LAMBORGHINI_TROFEO_TEAMS;
    }
}
