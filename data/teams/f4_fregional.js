/* =============================================================================
 * ULTIMATE MOTORSPORT MANAGER
 * File: data/teams/f4_fregional.js
 * Squadre per Formula 4 e Formula Regional (Open Wheel Junior)
 * ========================================================================== */

const F4_TEAMS = [
    { id:"f4_prema", name:"Prema Racing", color:"#D50000", carModel:"Tatuus F4-T421", power:0.85, reliability:0.80, drivers:[
        { id:"f4_d1", name:"K. Antonelli", pace:0.90, racecraft:0.75, consistency:0.70, fitness:0.80, age:17, nationality:"ITA" },
        { id:"f4_d2", name:"J. Crawford", pace:0.82, racecraft:0.70, consistency:0.68, fitness:0.75, age:18, nationality:"USA" },
        { id:"f4_d3", name:"U. Ugochukwu", pace:0.78, racecraft:0.65, consistency:0.60, fitness:0.72, age:16, nationality:"USA" },
    ]},
    { id:"f4_vanamers", name:"Van Amersfoort Racing", color:"#1E40AF", carModel:"Tatuus F4-T421", power:0.80, reliability:0.78, drivers:[
        { id:"f4_d4", name:"M.Boyega", pace:0.80, racecraft:0.68, consistency:0.65, fitness:0.74, age:17, nationality:"GBR" },
        { id:"f4_d5", name:"L. Browning", pace:0.79, racecraft:0.66, consistency:0.62, fitness:0.72, age:17, nationality:"AUS" },
        { id:"f4_d6", name:"T. Babo", pace:0.75, racecraft:0.60, consistency:0.58, fitness:0.70, age:16, nationality:"BRA" },
    ]},
    { id:"f4_phm", name:"PHM Racing", color:"#F59E0B", carModel:"Tatuus F4-T421", power:0.75, reliability:0.75, drivers:[
        { id:"f4_d7", name:"N. Rasmussen", pace:0.77, racecraft:0.64, consistency:0.60, fitness:0.72, age:17, nationality:"DNK" },
        { id:"f4_d8", name:"A. Powell", pace:0.73, racecraft:0.58, consistency:0.55, fitness:0.68, age:16, nationality:"GBR" },
        { id:"f4_d9", name:"R. Honda", pace:0.71, racecraft:0.56, consistency:0.52, fitness:0.66, age:15, nationality:"JPN" },
    ]},
    { id:"f4_mucke", name:"Mücke Motorsport", color:"#059669", carModel:"Tatuus F4-T421", power:0.78, reliability:0.76, drivers:[
        { id:"f4_d10", name:"F. Hiltgen", pace:0.76, racecraft:0.62, consistency:0.58, fitness:0.70, age:17, nationality:"DEU" },
        { id:"f4_d11", name:"M. Bisset", pace:0.74, racecraft:0.60, consistency:0.56, fitness:0.68, age:16, nationality:"GBR" },
        { id:"f4_d12", name:"L. Pellegrini", pace:0.72, racecraft:0.58, consistency:0.54, fitness:0.67, age:16, nationality:"ITA" },
    ]},
    { id:"f4_rpm", name:"R-ace GP", color:"#DC2626", carModel:"Tatuus F4-T421", power:0.82, reliability:0.79, drivers:[
        { id:"f4_d13", name:"T. Malsen", pace:0.81, racecraft:0.69, consistency:0.66, fitness:0.74, age:17, nationality:"NLD" },
        { id:"f4_d14", name:"S. Barde", pace:0.78, racecraft:0.64, consistency:0.60, fitness:0.72, age:16, nationality:"FRA" },
        { id:"f4_d15", name:"A. Garcia", pace:0.75, racecraft:0.60, consistency:0.58, fitness:0.69, age:16, nationality:"ESP" },
    ]},
];

const FREGIONAL_TEAMS = [
    { id:"fr_prema", name:"Prema Racing", color:"#D50000", carModel:"Ligier JS F3", power:0.85, reliability:0.82, drivers:[
        { id:"fr_d1", name:"K. Antonelli", pace:0.88, racecraft:0.78, consistency:0.72, fitness:0.82, age:17, nationality:"ITA" },
        { id:"fr_d2", name:"R. Ugran", pace:0.82, racecraft:0.72, consistency:0.68, fitness:0.76, age:19, nationality:"ROU" },
        { id:"fr_d3", name:"T. Rasmussen", pace:0.80, racecraft:0.70, consistency:0.66, fitness:0.74, age:18, nationality:"DNK" },
    ]},
    { id:"fr_m2", name:"MP Motorsport", color:"#1E40AF", carModel:"Ligier JS F3", power:0.82, reliability:0.80, drivers:[
        { id:"fr_d4", name:"S. Smith", pace:0.81, racecraft:0.70, consistency:0.66, fitness:0.74, age:18, nationality:"GBR" },
        { id:"fr_d5", name:"F. Brando", pace:0.79, racecraft:0.68, consistency:0.64, fitness:0.72, age:18, nationality:"BRA" },
        { id:"fr_d6", name:"M. Esterson", pace:0.76, racecraft:0.64, consistency:0.60, fitness:0.70, age:18, nationality:"GBR" },
    ]},
    { id:"fr_rpm", name:"R-ace GP", color:"#DC2626", carModel:"Ligier JS F3", power:0.84, reliability:0.81, drivers:[
        { id:"fr_d7", name:"M. Goethe", pace:0.83, racecraft:0.72, consistency:0.68, fitness:0.76, age:18, nationality:"DEU" },
        { id:"fr_d8", name:"T. Pasmussen", pace:0.80, racecraft:0.68, consistency:0.64, fitness:0.73, age:18, nationality:"DNK" },
        { id:"fr_d9", name:"L. Suteja", pace:0.77, racecraft:0.64, consistency:0.60, fitness:0.70, age:17, nationality:"IDN" },
    ]},
    { id:"fr_art", name:"ART Grand Prix", color:"#FFFFFF", carModel:"Ligier JS F3", power:0.83, reliability:0.82, drivers:[
        { id:"fr_d10", name:"L. Hamilton Jr.", pace:0.82, racecraft:0.70, consistency:0.66, fitness:0.74, age:18, nationality:"GBR" },
        { id:"fr_d11", name:"V. Martins", pace:0.80, racecraft:0.68, consistency:0.64, fitness:0.72, age:19, nationality:"FRA" },
        { id:"fr_d12", name:"G. Bortoleto", pace:0.79, racecraft:0.66, consistency:0.62, fitness:0.71, age:18, nationality:"BRA" },
    ]},
    { id:"fr_hitech", name:"Hitech Pulse-Eight", color:"#7C3AED", carModel:"Ligier JS F3", power:0.81, reliability:0.79, drivers:[
        { id:"fr_d13", name:"A. Dunne", pace:0.80, racecraft:0.68, consistency:0.64, fitness:0.72, age:18, nationality:"IRL" },
        { id:"fr_d14", name:"M. Twigg", pace:0.77, racecraft:0.64, consistency:0.60, fitness:0.70, age:17, nationality:"AUS" },
        { id:"fr_d15", name:"P. Kaczor", pace:0.75, racecraft:0.62, consistency:0.58, fitness:0.68, age:17, nationality:"POL" },
    ]},
    { id:"fr_vdoline", name:"Van Dolen Motorsport", color:"#059669", carModel:"Ligier JS F3", power:0.78, reliability:0.77, drivers:[
        { id:"fr_d16", name:"N. Beganovic", pace:0.78, racecraft:0.66, consistency:0.62, fitness:0.71, age:17, nationality:"SWE" },
        { id:"fr_d17", name:"A. Lomko", pace:0.76, racecraft:0.62, consistency:0.58, fitness:0.69, age:18, nationality:"FRA" },
        { id:"fr_d18", name:"S. Xiao", pace:0.73, racecraft:0.58, consistency:0.54, fitness:0.67, age:17, nationality:"CHN" },
    ]},
];

const F4_FREGIONAL_DATA = {
    f4: F4_TEAMS,
    fregional: FREGIONAL_TEAMS,
};

if (typeof window !== "undefined") {
    window.F4_TEAMS = F4_TEAMS;
    window.FREGIONAL_TEAMS = FREGIONAL_TEAMS;
    window.F4_FREGIONAL_DATA = F4_FREGIONAL_DATA;
    if (window.ALL_TEAMS) {
        window.ALL_TEAMS.f4 = F4_TEAMS;
        window.ALL_TEAMS.fregional = FREGIONAL_TEAMS;
    }
}
