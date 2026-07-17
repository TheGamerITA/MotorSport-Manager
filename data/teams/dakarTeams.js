/* =============================================================================
 * ULTIMATE MOTORSPORT MANAGER
 * File: data/teams/dakarTeams.js
 * -----------------------------------------------------------------------------
 * DATABASE DAKAR RALLY — CATEGORIA AUTO/ULTIMATE (Stagione 2026)
 * Raid marathon: il motore (_runMarathonRaid) legge le stat speciali:
 *   navigationSkill (evita errori di rotta, il fattore #1 del Dakar),
 *   desertExperience (riduce le penalità di navigazione) e
 *   carControl (guida su dune/sabbia/pietraie).
 * Passate via specialStats e fuse nel driver dal factory.
 * ========================================================================== */

const DAKAR_TEAMS = [
    Team({ id:"dacia-dakar", name:"Dacia Sandriders", nationality:"ROU", color:"#646B52", budget:70000, prestige:90, staff:{aero:82,engine:88,mechanics:90},
        drivers:[
            Driver({id:"loeb-dakar",name:"Sebastien Loeb",nationality:"FRA",number:200,age:52,pace:0.95,consistency:0.88,racecraft:0.85,wetPerformance:0.80,fuelTyreMgmt:0.88,qualifying:0.90,morale:86,salary:2500,contractYears:2, specialStats:{navigationSkill:0.86,desertExperience:0.90,carControl:0.95}}),
            Driver({id:"alattiyah-dakar",name:"Nasser Al-Attiyah",nationality:"QAT",number:201,age:55,pace:0.92,consistency:0.90,racecraft:0.84,wetPerformance:0.78,fuelTyreMgmt:0.90,qualifying:0.88,morale:87,salary:2400,contractYears:2, specialStats:{navigationSkill:0.94,desertExperience:0.98,carControl:0.92}}),
            Driver({id:"gutierrez-dakar",name:"Cristina Gutierrez",nationality:"ESP",number:202,age:34,pace:0.86,consistency:0.88,racecraft:0.82,wetPerformance:0.79,fuelTyreMgmt:0.87,qualifying:0.82,morale:84,salary:1400,contractYears:2, specialStats:{navigationSkill:0.88,desertExperience:0.85,carControl:0.85}})
        ]}),
    Team({ id:"ford-dakar", name:"Ford M-Sport Raptor", nationality:"USA", color:"#003478", budget:72000, prestige:88, staff:{aero:83,engine:89,mechanics:88},
        drivers:[
            Driver({id:"sainz-dakar",name:"Carlos Sainz Sr",nationality:"ESP",number:203,age:64,pace:0.91,consistency:0.90,racecraft:0.83,wetPerformance:0.79,fuelTyreMgmt:0.89,qualifying:0.87,morale:85,salary:2200,contractYears:2, specialStats:{navigationSkill:0.90,desertExperience:0.96,carControl:0.91}}),
            Driver({id:"ekstrom-dakar",name:"Mattias Ekstrom",nationality:"SWE",number:204,age:47,pace:0.90,consistency:0.85,racecraft:0.84,wetPerformance:0.80,fuelTyreMgmt:0.85,qualifying:0.88,morale:82,salary:1800,contractYears:2, specialStats:{navigationSkill:0.82,desertExperience:0.80,carControl:0.90}}),
            Driver({id:"roma-dakar",name:"Nani Roma",nationality:"ESP",number:205,age:53,pace:0.86,consistency:0.86,racecraft:0.82,wetPerformance:0.78,fuelTyreMgmt:0.86,qualifying:0.83,morale:80,salary:1400,contractYears:1, specialStats:{navigationSkill:0.89,desertExperience:0.93,carControl:0.86}})
        ]}),
    Team({ id:"toyota-dakar", name:"Toyota Gazoo Racing", nationality:"JPN", color:"#EB0A1E", budget:74000, prestige:89, staff:{aero:84,engine:90,mechanics:89},
        drivers:[
            Driver({id:"lategan-dakar",name:"Henk Lategan",nationality:"RSA",number:206,age:31,pace:0.90,consistency:0.87,racecraft:0.83,wetPerformance:0.79,fuelTyreMgmt:0.86,qualifying:0.87,morale:83,salary:1600,contractYears:2, specialStats:{navigationSkill:0.85,desertExperience:0.82,carControl:0.90}, hiddenPotential:0.93}),
            Driver({id:"alrajhi-dakar",name:"Yazeed Al-Rajhi",nationality:"SAU",number:207,age:44,pace:0.89,consistency:0.86,racecraft:0.83,wetPerformance:0.78,fuelTyreMgmt:0.86,qualifying:0.86,morale:82,salary:1500,contractYears:2, specialStats:{navigationSkill:0.87,desertExperience:0.94,carControl:0.88}}),
            Driver({id:"moraes-dakar",name:"Lucas Moraes",nationality:"BRA",number:208,age:31,pace:0.88,consistency:0.85,racecraft:0.82,wetPerformance:0.78,fuelTyreMgmt:0.85,qualifying:0.85,morale:82,salary:1400,contractYears:2, specialStats:{navigationSkill:0.84,desertExperience:0.83,carControl:0.87}, hiddenPotential:0.90})
        ]}),
    Team({ id:"prodrive-dakar", name:"Prodrive Hunter (Bahrain Raid Xtreme)", nationality:"BHR", color:"#E4002B", budget:62000, prestige:80, staff:{aero:79,engine:85,mechanics:84},
        drivers:[
            Driver({id:"baumel-dakar",name:"Sebastien Baumel",nationality:"FRA",number:209,age:44,pace:0.86,consistency:0.84,racecraft:0.81,wetPerformance:0.78,fuelTyreMgmt:0.84,qualifying:0.83,morale:79,salary:1200,contractYears:1, specialStats:{navigationSkill:0.86,desertExperience:0.85,carControl:0.85}}),
            Driver({id:"chicherit-dakar",name:"Guerlain Chicherit",nationality:"FRA",number:210,age:47,pace:0.85,consistency:0.80,racecraft:0.80,wetPerformance:0.77,fuelTyreMgmt:0.82,qualifying:0.83,morale:77,salary:1100,contractYears:1, specialStats:{navigationSkill:0.80,desertExperience:0.84,carControl:0.87}})
        ]}),
    Team({ id:"mini-dakar", name:"X-raid Mini JCW Team", nationality:"DEU", color:"#333333", budget:55000, prestige:74, staff:{aero:76,engine:82,mechanics:82},
        drivers:[
            Driver({id:"vanbeveren-dakar",name:"Adrien Van Beveren",nationality:"FRA",number:211,age:35,pace:0.86,consistency:0.83,racecraft:0.81,wetPerformance:0.78,fuelTyreMgmt:0.83,qualifying:0.84,morale:78,salary:1100,contractYears:1, specialStats:{navigationSkill:0.83,desertExperience:0.86,carControl:0.85}}),
            Driver({id:"przygonski-dakar",name:"Jakub Przygonski",nationality:"POL",number:212,age:41,pace:0.84,consistency:0.82,racecraft:0.79,wetPerformance:0.77,fuelTyreMgmt:0.82,qualifying:0.82,morale:76,salary:1000,contractYears:1, specialStats:{navigationSkill:0.82,desertExperience:0.85,carControl:0.83}})
        ]}),
];

if (typeof window !== "undefined" && window.ALL_TEAMS) {
    window.ALL_TEAMS.dakar = DAKAR_TEAMS;
}
