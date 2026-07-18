/* =============================================================================
 * ULTIMATE MOTORSPORT MANAGER
 * File: data/teams/rally_regional.js
 * Teams for Regional Rally (ERC, ARC, APRC, CODASUR, MERC, NACAM, Regional)
 * ========================================================================== */

/* --- ERC (European Rally Championship) --- */
const ERC_TEAMS = [
    { id:"erc_hyundai", name:"Hyundai Motorsport N", color:"#059669", carModel:"Hyundai i20 N Rally2", power:0.85, reliability:0.82, drivers:[
        { id:"erc_d1", name:"H. Pajari", pace:0.85, racecraft:0.80, consistency:0.78, fitness:0.82, age:24, nationality:"FIN" },
        { id:"erc_d2", name:"L. Lille", pace:0.82, racecraft:0.77, consistency:0.75, fitness:0.78, age:26, nationality:"EST" },
    ]},
    { id:"erc_skoda", name:"Škoda Motorsport", color:"#1E40AF", carModel:"Škoda Fabia RS Rally2", power:0.84, reliability:0.83, drivers:[
        { id:"erc_d3", name:"M. Loubet", pace:0.84, racecraft:0.79, consistency:0.77, fitness:0.80, age:25, nationality:"FRA" },
        { id:"erc_d4", name:"J. Cerný", pace:0.81, racecraft:0.76, consistency:0.74, fitness:0.77, age:27, nationality:"CZE" },
    ]},
    { id:"erc_toyota", name:"Toyota Gazoo Racing", color:"#DC2626", carModel:"Toyota GR Yaris Rally2", power:0.83, reliability:0.81, drivers:[
        { id:"erc_d5", name:"S. Pardo", pace:0.83, racecraft:0.78, consistency:0.76, fitness:0.79, age:28, nationality:"ESP" },
        { id:"erc_d6", name:"J. Huttunen", pace:0.80, racecraft:0.75, consistency:0.73, fitness:0.76, age:25, nationality:"FIN" },
    ]},
    { id:"erc_msport", name:"M-Sport Ford", color:"#F59E0B", carModel:"Ford Fiesta Rally2", power:0.82, reliability:0.80, drivers:[
        { id:"erc_d7", name:"A. Mabellini", pace:0.82, racecraft:0.77, consistency:0.75, fitness:0.78, age:29, nationality:"ITA" },
        { id:"erc_d8", name:"K. Kajetanowicz", pace:0.80, racecraft:0.75, consistency:0.73, fitness:0.76, age:34, nationality:"POL" },
    ]},
    { id:"erc_citroen", name:"DG Sport", color:"#7C3AED", carModel:"Citroën C3 Rally2", power:0.81, reliability:0.79, drivers:[
        { id:"erc_d9", name:"B. Scandola", pace:0.81, racecraft:0.76, consistency:0.74, fitness:0.77, age:35, nationality:"ITA" },
        { id:"erc_d10", name:"C. Torn", pace:0.78, racecraft:0.73, consistency:0.71, fitness:0.74, age:28, nationality:"BEL" },
    ]},
];

/* --- ARC (Australian Rally Championship) --- */
const ARC_TEAMS = [
    { id:"arc_toyota", name:"Toyota Gazoo Australia", color:"#DC2626", carModel:"Toyota GR Yaris Rally2", power:0.83, reliability:0.81, drivers:[
        { id:"arc_d1", name:"H. Bates", pace:0.83, racecraft:0.78, consistency:0.76, fitness:0.79, age:28, nationality:"AUS" },
        { id:"arc_d2", name:"L. Sondhy", pace:0.80, racecraft:0.75, consistency:0.73, fitness:0.76, age:30, nationality:"AUS" },
    ]},
    { id:"arc_skoda", name:"Skoda Australia", color:"#1E40AF", carModel:"Škoda Fabia Rally2", power:0.82, reliability:0.80, drivers:[
        { id:"arc_d3", name:"M. Pedder", pace:0.82, racecraft:0.77, consistency:0.75, fitness:0.78, age:35, nationality:"AUS" },
        { id:"arc_d4", name:"H. Bates Jr.", pace:0.79, racecraft:0.74, consistency:0.72, fitness:0.75, age:24, nationality:"AUS" },
    ]},
    { id:"arc_subaru", name:"Subaru Motorsport", color:"#059669", carModel:"Subaru WRX STI Rally2", power:0.81, reliability:0.79, drivers:[
        { id:"arc_d5", name:"B. Scales", pace:0.81, racecraft:0.76, consistency:0.74, fitness:0.77, age:38, nationality:"AUS" },
        { id:"arc_d6", name:"C. Chapel", pace:0.78, racecraft:0.73, consistency:0.71, fitness:0.74, age:27, nationality:"AUS" },
    ]},
];

/* --- APRC (Asia-Pacific Rally Championship) --- */
const APRC_TEAMS = [
    { id:"aprc_mitsu", name:"Mitsubishi Ralliart", color:"#DC2626", carModel:"Mitsubishi Lancer Evo X Rally2", power:0.82, reliability:0.80, drivers:[
        { id:"aprc_d1", name:"G. Pilcher", pace:0.82, racecraft:0.77, consistency:0.75, fitness:0.78, age:30, nationality:"JPN" },
        { id:"aprc_d2", name:"S. Taguchi", pace:0.79, racecraft:0.74, consistency:0.72, fitness:0.75, age:32, nationality:"JPN" },
    ]},
    { id:"aprc_subaru", name:"Subaru Asia", color:"#059669", carModel:"Subaru WRX STI Rally2", power:0.81, reliability:0.79, drivers:[
        { id:"aprc_d3", name:"M. Driver", pace:0.80, racecraft:0.75, consistency:0.73, fitness:0.76, age:28, nationality:"NZL" },
        { id:"aprc_d4", name:"B. Mcclean", pace:0.77, racecraft:0.72, consistency:0.70, fitness:0.73, age:25, nationality:"AUS" },
    ]},
    { id:"aprc_toyota", name:"Toyota Asia", color:"#1E40AF", carModel:"Toyota GR Yaris Rally2", power:0.80, reliability:0.78, drivers:[
        { id:"aprc_d5", name:"V. Pongpipat", pace:0.79, racecraft:0.74, consistency:0.72, fitness:0.75, age:29, nationality:"THA" },
        { id:"aprc_d6", name:"L. Yanto", pace:0.76, racecraft:0.71, consistency:0.69, fitness:0.72, age:24, nationality:"IDN" },
    ]},
];

/* --- CODASUR (South American Rally) --- */
const CODASUR_TEAMS = [
    { id:"cod_toyota", name:"Toyota Gazoo Argentina", color:"#DC2626", carModel:"Toyota GR Yaris Rally2", power:0.82, reliability:0.80, drivers:[
        { id:"cod_d1", name:"M. Pérez Companc", pace:0.82, racecraft:0.77, consistency:0.75, fitness:0.78, age:29, nationality:"ARG" },
        { id:"cod_d2", name:"F. Alonso", pace:0.79, racecraft:0.74, consistency:0.72, fitness:0.75, age:31, nationality:"URY" },
    ]},
    { id:"cod_mitsu", name:"Mitsu Argentina", color:"#1E40AF", carModel:"Mitsubishi Lancer Evo Rally2", power:0.81, reliability:0.79, drivers:[
        { id:"cod_d3", name:"D. Carboncini", pace:0.80, racecraft:0.75, consistency:0.73, fitness:0.76, age:33, nationality:"ARG" },
        { id:"cod_d4", name:"R. Galanti", pace:0.77, racecraft:0.72, consistency:0.70, fitness:0.73, age:27, nationality:"CHL" },
    ]},
    { id:"cod_ford", name:"Ford Racing Sudam", color:"#F59E0B", carModel:"Ford Fiesta Rally2", power:0.80, reliability:0.78, drivers:[
        { id:"cod_d5", name:"G. Gonzalez", pace:0.79, racecraft:0.74, consistency:0.72, fitness:0.75, age:30, nationality:"BOL" },
        { id:"cod_d6", name:"P. Bustamante", pace:0.76, racecraft:0.71, consistency:0.69, fitness:0.72, age:25, nationality:"PER" },
    ]},
];

/* --- MERC (Middle East Rally Championship) --- */
const MERC_TEAMS = [
    { id:"merc_toyota", name:"Toyota Gazoo M.E.", color:"#DC2626", carModel:"Toyota GR Yaris Rally2", power:0.82, reliability:0.80, drivers:[
        { id:"merc_d1", name:"N. Al-Attiyah", pace:0.85, racecraft:0.82, consistency:0.80, fitness:0.83, age:52, nationality:"QAT" },
        { id:"merc_d2", name:"A. Al-Kuwari", pace:0.79, racecraft:0.74, consistency:0.72, fitness:0.75, age:35, nationality:"QAT" },
    ]},
    { id:"merc_ford", name:"Ford M-Sport M.E.", color:"#F59E0B", carModel:"Ford Fiesta Rally2", power:0.81, reliability:0.79, drivers:[
        { id:"merc_d3", name:"A. Hijazi", pace:0.79, racecraft:0.74, consistency:0.72, fitness:0.75, age:40, nationality:"JOR" },
        { id:"merc_d4", name:"S. Al-Rajhi", pace:0.76, racecraft:0.71, consistency:0.69, fitness:0.72, age:33, nationality:"SAU" },
    ]},
    { id:"merc_citroen", name:"Citroën M.E.", color:"#7C3AED", carModel:"Citroën C3 Rally2", power:0.80, reliability:0.78, drivers:[
        { id:"merc_d5", name:"M. Al-Suwaidi", pace:0.78, racecraft:0.73, consistency:0.71, fitness:0.74, age:38, nationality:"ARE" },
        { id:"merc_d6", name:"K. Al-Hashimi", pace:0.75, racecraft:0.70, consistency:0.68, fitness:0.71, age:29, nationality:"ARE" },
    ]},
];

/* --- NACAM (North & Central America Rally) --- */
const NACAM_TEAMS = [
    { id:"nac_mitsu", name:"Mitsubishi Mexico", color:"#DC2626", carModel:"Mitsubishi Lancer Evo Rally2", power:0.82, reliability:0.80, drivers:[
        { id:"nac_d1", name:"R. Troncoso", pace:0.82, racecraft:0.77, consistency:0.75, fitness:0.78, age:30, nationality:"MEX" },
        { id:"nac_d2", name:"A. Gil", pace:0.79, racecraft:0.74, consistency:0.72, fitness:0.75, age:28, nationality:"MEX" },
    ]},
    { id:"nac_skoda", name:"Škoda Mexico", color:"#1E40AF", carModel:"Škoda Fabia Rally2", power:0.81, reliability:0.79, drivers:[
        { id:"nac_d3", name:"E. Cuales", pace:0.80, racecraft:0.75, consistency:0.73, fitness:0.76, age:32, nationality:"GTM" },
        { id:"nac_d4", name:"J. Salas", pace:0.77, racecraft:0.72, consistency:0.70, fitness:0.73, age:26, nationality:"CRI" },
    ]},
    { id:"nac_ford", name:"Ford Mexico", color:"#F59E0B", carModel:"Ford Fiesta Rally2", power:0.80, reliability:0.78, drivers:[
        { id:"nac_d5", name:"F. Barrera", pace:0.79, racecraft:0.74, consistency:0.72, fitness:0.75, age:35, nationality:"MEX" },
        { id:"nac_d6", name:"O. Mejia", pace:0.76, racecraft:0.71, consistency:0.69, fitness:0.72, age:24, nationality:"MEX" },
    ]},
];

/* --- RALLY REGIONAL (Italian/Local Championships) --- */
const RALLY_REGIONAL_TEAMS = [
    { id:"rr_citroen", name:"Citroën Italia Rally", color:"#7C3AED", carModel:"Citroën C3 Rally2", power:0.81, reliability:0.79, drivers:[
        { id:"rr_d1", name:"G. Vercelli", pace:0.81, racecraft:0.76, consistency:0.74, fitness:0.77, age:32, nationality:"ITA" },
        { id:"rr_d2", name:"L. Bergamo", pace:0.78, racecraft:0.73, consistency:0.71, fitness:0.74, age:27, nationality:"ITA" },
    ]},
    { id:"rr_peugeot", name:"Peugeot Sport Italia", color:"#1E40AF", carModel:"Peugeot 208 Rally4", power:0.78, reliability:0.77, drivers:[
        { id:"rr_d3", name:"A. Tozzi", pace:0.78, racecraft:0.73, consistency:0.71, fitness:0.74, age:24, nationality:"ITA" },
        { id:"rr_d4", name:"M. Donati", pace:0.75, racecraft:0.70, consistency:0.68, fitness:0.71, age:22, nationality:"ITA" },
    ]},
    { id:"rr_renault", name:"Renault Sport Italia", color:"#FCD34D", carModel:"Renault Clio Rally4", power:0.76, reliability:0.75, drivers:[
        { id:"rr_d5", name:"S. Nuti", pace:0.75, racecraft:0.70, consistency:0.68, fitness:0.71, age:25, nationality:"ITA" },
        { id:"rr_d6", name:"G. Chiarenza", pace:0.72, racecraft:0.67, consistency:0.65, fitness:0.68, age:21, nationality:"ITA" },
    ]},
    { id:"rr_ford", name:"Ford Racing Club Italia", color:"#F59E0B", carModel:"Ford Fiesta Rally4", power:0.75, reliability:0.74, drivers:[
        { id:"rr_d7", name:"A. Costa", pace:0.74, racecraft:0.69, consistency:0.67, fitness:0.70, age:28, nationality:"ITA" },
        { id:"rr_d8", name:"M. Bellini", pace:0.71, racecraft:0.66, consistency:0.64, fitness:0.67, age:23, nationality:"ITA" },
    ]},
];

const RALLY_REGIONAL_DATA = {
    erc: ERC_TEAMS,
    arc: ARC_TEAMS,
    aprc: APRC_TEAMS,
    codasur: CODASUR_TEAMS,
    merc: MERC_TEAMS,
    nacam: NACAM_TEAMS,
    regional: RALLY_REGIONAL_TEAMS,
};

if (typeof window !== "undefined") {
    window.ERC_TEAMS = ERC_TEAMS;
    window.ARC_TEAMS = ARC_TEAMS;
    window.APRC_TEAMS = APRC_TEAMS;
    window.CODASUR_TEAMS = CODASUR_TEAMS;
    window.MERC_TEAMS = MERC_TEAMS;
    window.NACAM_TEAMS = NACAM_TEAMS;
    window.RALLY_REGIONAL_TEAMS = RALLY_REGIONAL_TEAMS;
    window.RALLY_REGIONAL_DATA = RALLY_REGIONAL_DATA;
    if (window.ALL_TEAMS) {
        window.ALL_TEAMS.erc = ERC_TEAMS;
        window.ALL_TEAMS.arc = ARC_TEAMS;
        window.ALL_TEAMS.aprc = APRC_TEAMS;
        window.ALL_TEAMS.codasur = CODASUR_TEAMS;
        window.ALL_TEAMS.merc = MERC_TEAMS;
        window.ALL_TEAMS.nacam = NACAM_TEAMS;
        window.ALL_TEAMS.rally_cup = RALLY_REGIONAL_TEAMS;
    }
}
