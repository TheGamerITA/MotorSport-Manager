/* =============================================================================
 * ULTIMATE MOTORSPORT MANAGER
 * File: data/teams/wecTeams.js
 * -----------------------------------------------------------------------------
 * DATABASE FIA WEC — HYPERCAR (Stagione 2026)
 * Endurance: ogni vettura ha 3 piloti (equipaggio). Il motore legge le stat
 * speciali:  stamina (tenuta nei lunghi stint) e nightConsistency (guida notturna),
 * passate via specialStats e fuse nel driver dal factory Driver().
 * ========================================================================== */

const WEC_TEAMS = [
    Team({ id:"ferrari-wec", name:"Ferrari AF Corse #50", nationality:"ITA", color:"#E8002D", budget:120000, prestige:96, staff:{aero:93,engine:94,mechanics:93},
        drivers:[
            Driver({id:"fuoco-wec",name:"Antonio Fuoco",nationality:"ITA",number:50,age:30,pace:0.93,consistency:0.90,racecraft:0.88,wetPerformance:0.86,fuelTyreMgmt:0.91,qualifying:0.90,morale:86,salary:2500,contractYears:2, specialStats:{stamina:0.90,nightConsistency:0.88}}),
            Driver({id:"molina-wec",name:"Miguel Molina",nationality:"ESP",number:50,age:37,pace:0.90,consistency:0.91,racecraft:0.88,wetPerformance:0.86,fuelTyreMgmt:0.92,qualifying:0.87,morale:84,salary:2200,contractYears:2, specialStats:{stamina:0.88,nightConsistency:0.90}}),
            Driver({id:"nielsen-wec",name:"Nicklas Nielsen",nationality:"DNK",number:50,age:29,pace:0.91,consistency:0.89,racecraft:0.87,wetPerformance:0.87,fuelTyreMgmt:0.90,qualifying:0.89,morale:85,salary:2100,contractYears:2, specialStats:{stamina:0.91,nightConsistency:0.87}})
        ]}),
    Team({ id:"toyota-wec", name:"Toyota Gazoo Racing #8", nationality:"JPN", color:"#EB0A1E", budget:125000, prestige:95, staff:{aero:94,engine:95,mechanics:92},
        drivers:[
            Driver({id:"hartley-wec",name:"Brendon Hartley",nationality:"NZL",number:8,age:36,pace:0.92,consistency:0.92,racecraft:0.90,wetPerformance:0.88,fuelTyreMgmt:0.93,qualifying:0.89,morale:87,salary:2600,contractYears:2, specialStats:{stamina:0.92,nightConsistency:0.92}}),
            Driver({id:"buemi-wec",name:"Sebastien Buemi",nationality:"CHE",number:8,age:37,pace:0.91,consistency:0.93,racecraft:0.90,wetPerformance:0.88,fuelTyreMgmt:0.94,qualifying:0.88,morale:86,salary:2600,contractYears:2, specialStats:{stamina:0.90,nightConsistency:0.93}}),
            Driver({id:"hirakawa-wec",name:"Ryo Hirakawa",nationality:"JPN",number:8,age:32,pace:0.92,consistency:0.89,racecraft:0.88,wetPerformance:0.86,fuelTyreMgmt:0.91,qualifying:0.91,morale:85,salary:2400,contractYears:2, specialStats:{stamina:0.89,nightConsistency:0.88}})
        ]}),
    Team({ id:"porsche-wec", name:"Porsche Penske Motorsport #6", nationality:"DEU", color:"#D5001C", budget:122000, prestige:94, staff:{aero:92,engine:93,mechanics:93},
        drivers:[
            Driver({id:"estre-wec",name:"Kevin Estre",nationality:"FRA",number:6,age:38,pace:0.92,consistency:0.90,racecraft:0.90,wetPerformance:0.87,fuelTyreMgmt:0.91,qualifying:0.90,morale:85,salary:2500,contractYears:2, specialStats:{stamina:0.90,nightConsistency:0.89}}),
            Driver({id:"vanthoor-wec",name:"Laurens Vanthoor",nationality:"BEL",number:6,age:35,pace:0.90,consistency:0.90,racecraft:0.89,wetPerformance:0.86,fuelTyreMgmt:0.90,qualifying:0.88,morale:84,salary:2300,contractYears:2, specialStats:{stamina:0.89,nightConsistency:0.90}}),
            Driver({id:"lotterer-wec",name:"Andre Lotterer",nationality:"DEU",number:6,age:44,pace:0.88,consistency:0.92,racecraft:0.91,wetPerformance:0.88,fuelTyreMgmt:0.93,qualifying:0.85,morale:82,salary:2200,contractYears:1, specialStats:{stamina:0.87,nightConsistency:0.93}})
        ]}),
    Team({ id:"cadillac-wec", name:"Cadillac Hertz Team JOTA #12", nationality:"USA", color:"#B99653", budget:110000, prestige:88, staff:{aero:89,engine:91,mechanics:88},
        drivers:[
            Driver({id:"lynn-wec",name:"Alex Lynn",nationality:"GBR",number:12,age:32,pace:0.90,consistency:0.88,racecraft:0.87,wetPerformance:0.86,fuelTyreMgmt:0.89,qualifying:0.88,morale:82,salary:2000,contractYears:2, specialStats:{stamina:0.88,nightConsistency:0.86}}),
            Driver({id:"stevens-wec",name:"Will Stevens",nationality:"GBR",number:12,age:34,pace:0.89,consistency:0.87,racecraft:0.86,wetPerformance:0.85,fuelTyreMgmt:0.88,qualifying:0.87,morale:81,salary:1900,contractYears:2, specialStats:{stamina:0.87,nightConsistency:0.85}}),
            Driver({id:"nato-wec",name:"Norman Nato",nationality:"FRA",number:12,age:34,pace:0.89,consistency:0.86,racecraft:0.86,wetPerformance:0.85,fuelTyreMgmt:0.88,qualifying:0.88,morale:80,salary:1900,contractYears:1, specialStats:{stamina:0.86,nightConsistency:0.86}})
        ]}),
    Team({ id:"peugeot-wec", name:"Peugeot TotalEnergies #93", nationality:"FRA", color:"#00A3E0", budget:100000, prestige:80, staff:{aero:86,engine:87,mechanics:85},
        drivers:[
            Driver({id:"vergne-wec",name:"Jean-Eric Vergne",nationality:"FRA",number:93,age:35,pace:0.89,consistency:0.86,racecraft:0.88,wetPerformance:0.85,fuelTyreMgmt:0.87,qualifying:0.87,morale:78,salary:2000,contractYears:2, specialStats:{stamina:0.85,nightConsistency:0.84}}),
            Driver({id:"dicresto-wec",name:"Paul di Resta",nationality:"GBR",number:93,age:40,pace:0.87,consistency:0.88,racecraft:0.87,wetPerformance:0.85,fuelTyreMgmt:0.88,qualifying:0.85,morale:76,salary:1800,contractYears:1, specialStats:{stamina:0.84,nightConsistency:0.86}}),
            Driver({id:"jensen-wec",name:"Mikkel Jensen",nationality:"DNK",number:93,age:31,pace:0.88,consistency:0.85,racecraft:0.85,wetPerformance:0.84,fuelTyreMgmt:0.86,qualifying:0.86,morale:77,salary:1700,contractYears:2, specialStats:{stamina:0.85,nightConsistency:0.83}})
        ]}),
    Team({ id:"bmw-wec", name:"BMW M Team WRT #15", nationality:"DEU", color:"#0166B1", budget:105000, prestige:83, staff:{aero:87,engine:88,mechanics:87},
        drivers:[
            Driver({id:"vandoorne-wec",name:"Stoffel Vandoorne",nationality:"BEL",number:15,age:34,pace:0.90,consistency:0.87,racecraft:0.86,wetPerformance:0.85,fuelTyreMgmt:0.88,qualifying:0.89,morale:80,salary:2100,contractYears:2, specialStats:{stamina:0.86,nightConsistency:0.85}}),
            Driver({id:"vanderlinde-wec",name:"Kelvin van der Linde",nationality:"RSA",number:15,age:30,pace:0.88,consistency:0.85,racecraft:0.86,wetPerformance:0.84,fuelTyreMgmt:0.86,qualifying:0.87,morale:79,salary:1800,contractYears:2, specialStats:{stamina:0.87,nightConsistency:0.84}}),
            Driver({id:"wittmann-wec",name:"Marco Wittmann",nationality:"DEU",number:15,age:36,pace:0.87,consistency:0.86,racecraft:0.85,wetPerformance:0.83,fuelTyreMgmt:0.86,qualifying:0.85,morale:78,salary:1700,contractYears:1, specialStats:{stamina:0.85,nightConsistency:0.85}})
        ]}),
    Team({ id:"alpine-wec", name:"Alpine Endurance Team #35", nationality:"FRA", color:"#0093CC", budget:98000, prestige:78, staff:{aero:85,engine:85,mechanics:84},
        drivers:[
            Driver({id:"gounon-wec",name:"Jules Gounon",nationality:"FRA",number:35,age:31,pace:0.88,consistency:0.85,racecraft:0.85,wetPerformance:0.84,fuelTyreMgmt:0.86,qualifying:0.86,morale:78,salary:1700,contractYears:2, specialStats:{stamina:0.86,nightConsistency:0.83}}),
            Driver({id:"schumacher-wec",name:"Mick Schumacher",nationality:"DEU",number:36,age:27,pace:0.89,consistency:0.84,racecraft:0.84,wetPerformance:0.84,fuelTyreMgmt:0.85,qualifying:0.87,morale:82,salary:1900,contractYears:2, specialStats:{stamina:0.87,nightConsistency:0.82}}),
            Driver({id:"lapierre-wec",name:"Nicolas Lapierre",nationality:"FRA",number:36,age:42,pace:0.85,consistency:0.88,racecraft:0.87,wetPerformance:0.85,fuelTyreMgmt:0.88,qualifying:0.83,morale:76,salary:1500,contractYears:1, specialStats:{stamina:0.83,nightConsistency:0.87}})
        ]}),
    Team({ id:"astonmartin-wec", name:"Aston Martin THOR Team #007", nationality:"GBR", color:"#037A68", budget:95000, prestige:76, staff:{aero:84,engine:83,mechanics:83},
        drivers:[
            Driver({id:"gunn-wec",name:"Ross Gunn",nationality:"GBR",number:7,age:29,pace:0.87,consistency:0.84,racecraft:0.84,wetPerformance:0.83,fuelTyreMgmt:0.85,qualifying:0.85,morale:77,salary:1500,contractYears:2, specialStats:{stamina:0.86,nightConsistency:0.83}}),
            Driver({id:"riberas-wec",name:"Alex Riberas",nationality:"ESP",number:7,age:31,pace:0.86,consistency:0.84,racecraft:0.83,wetPerformance:0.82,fuelTyreMgmt:0.84,qualifying:0.84,morale:76,salary:1400,contractYears:2, specialStats:{stamina:0.85,nightConsistency:0.82}}),
            Driver({id:"sorensen-wec",name:"Marco Sorensen",nationality:"DNK",number:7,age:35,pace:0.86,consistency:0.85,racecraft:0.84,wetPerformance:0.83,fuelTyreMgmt:0.85,qualifying:0.84,morale:75,salary:1400,contractYears:1, specialStats:{stamina:0.84,nightConsistency:0.85}})
        ]}),
];

if (typeof window !== "undefined" && window.ALL_TEAMS) {
    window.ALL_TEAMS.wec = WEC_TEAMS;
}
