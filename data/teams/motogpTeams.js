/* =============================================================================
 * ULTIMATE MOTORSPORT MANAGER
 * File: data/teams/motogpTeams.js
 * -----------------------------------------------------------------------------
 * DATABASE MOTOGP (Season 2026)
 * Note: in the engine for the "Bike" family the base stats + crashRiskFactor
 * matter (defined in the config). riderWeightImpact is handled at category level.
 * ========================================================================== */

const MOTOGP_TEAMS = [
    Team({ id:"ducati-motogp", name:"Ducati Lenovo Team", nationality:"ITA", color:"#CC0000", budget:60000, prestige:98, staff:{aero:95,engine:97,mechanics:94},
        drivers:[
            Driver({id:"bagnaia",name:"Francesco Bagnaia",nationality:"ITA",number:63,age:29,pace:0.97,consistency:0.94,racecraft:0.93,wetPerformance:0.88,fuelTyreMgmt:0.92,qualifying:0.95,morale:88,salary:12000,contractYears:2}),
            Driver({id:"marc-marquez",name:"Marc Marquez",nationality:"ESP",number:93,age:33,pace:0.99,consistency:0.90,racecraft:0.99,wetPerformance:0.96,fuelTyreMgmt:0.90,qualifying:0.97,morale:95,salary:14000,contractYears:2})
        ]}),
    Team({ id:"aprilia-motogp", name:"Aprilia Racing", nationality:"ITA", color:"#00A0A0", budget:52000, prestige:90, staff:{aero:92,engine:91,mechanics:90},
        drivers:[
            Driver({id:"jorge-martin",name:"Jorge Martin",nationality:"ESP",number:1,age:28,pace:0.96,consistency:0.89,racecraft:0.92,wetPerformance:0.87,fuelTyreMgmt:0.88,qualifying:0.96,morale:90,salary:11000,contractYears:2}),
            Driver({id:"bezzecchi",name:"Marco Bezzecchi",nationality:"ITA",number:72,age:27,pace:0.93,consistency:0.86,racecraft:0.90,wetPerformance:0.90,fuelTyreMgmt:0.85,qualifying:0.91,morale:85,salary:6000,contractYears:2})
        ]}),
    Team({ id:"ktm-motogp", name:"Red Bull KTM Factory", nationality:"AUT", color:"#FF6600", budget:50000, prestige:88, staff:{aero:88,engine:90,mechanics:89},
        drivers:[
            Driver({id:"acosta",name:"Pedro Acosta",nationality:"ESP",number:37,age:21,pace:0.95,consistency:0.85,racecraft:0.91,wetPerformance:0.86,fuelTyreMgmt:0.84,qualifying:0.92,morale:90,salary:7000,contractYears:3, hiddenPotential:0.99}),
            Driver({id:"binder",name:"Brad Binder",nationality:"RSA",number:33,age:31,pace:0.92,consistency:0.88,racecraft:0.93,wetPerformance:0.85,fuelTyreMgmt:0.87,qualifying:0.88,morale:82,salary:8000,contractYears:2})
        ]}),
    Team({ id:"yamaha-motogp", name:"Monster Energy Yamaha", nationality:"JPN", color:"#0033A0", budget:54000, prestige:86, staff:{aero:85,engine:86,mechanics:90},
        drivers:[
            Driver({id:"quartararo",name:"Fabio Quartararo",nationality:"FRA",number:20,age:27,pace:0.95,consistency:0.90,racecraft:0.91,wetPerformance:0.87,fuelTyreMgmt:0.89,qualifying:0.94,morale:80,salary:12000,contractYears:2}),
            Driver({id:"rins",name:"Alex Rins",nationality:"ESP",number:42,age:30,pace:0.89,consistency:0.84,racecraft:0.88,wetPerformance:0.85,fuelTyreMgmt:0.86,qualifying:0.87,morale:76,salary:5000,contractYears:1})
        ]}),
    Team({ id:"gresini-motogp", name:"Gresini Racing MotoGP", nationality:"ITA", color:"#5FBFF9", budget:34000, prestige:78, staff:{aero:88,engine:90,mechanics:84},
        drivers:[
            Driver({id:"alex-marquez",name:"Alex Marquez",nationality:"ESP",number:73,age:30,pace:0.93,consistency:0.88,racecraft:0.89,wetPerformance:0.86,fuelTyreMgmt:0.88,qualifying:0.90,morale:85,salary:4500,contractYears:2}),
            Driver({id:"aldeguer",name:"Fermin Aldeguer",nationality:"ESP",number:54,age:21,pace:0.90,consistency:0.82,racecraft:0.84,wetPerformance:0.82,fuelTyreMgmt:0.81,qualifying:0.88,morale:83,salary:2500,contractYears:2, hiddenPotential:0.94})
        ]}),
    Team({ id:"vr46-motogp", name:"Pertamina VR46 Racing", nationality:"ITA", color:"#FFD500", budget:33000, prestige:76, staff:{aero:87,engine:90,mechanics:83},
        drivers:[
            Driver({id:"digiannantonio",name:"Fabio Di Giannantonio",nationality:"ITA",number:49,age:27,pace:0.92,consistency:0.86,racecraft:0.87,wetPerformance:0.84,fuelTyreMgmt:0.86,qualifying:0.89,morale:84,salary:4000,contractYears:2}),
            Driver({id:"morbidelli",name:"Franco Morbidelli",nationality:"ITA",number:21,age:31,pace:0.89,consistency:0.85,racecraft:0.87,wetPerformance:0.84,fuelTyreMgmt:0.85,qualifying:0.86,morale:80,salary:3500,contractYears:1})
        ]}),
    Team({ id:"honda-motogp", name:"Honda HRC Castrol", nationality:"JPN", color:"#E4002B", budget:48000, prestige:82, staff:{aero:82,engine:84,mechanics:88},
        drivers:[
            Driver({id:"luca-marini",name:"Luca Marini",nationality:"ITA",number:10,age:28,pace:0.88,consistency:0.85,racecraft:0.86,wetPerformance:0.83,fuelTyreMgmt:0.86,qualifying:0.85,morale:75,salary:5000,contractYears:2}),
            Driver({id:"mir",name:"Joan Mir",nationality:"ESP",number:36,age:28,pace:0.89,consistency:0.84,racecraft:0.88,wetPerformance:0.85,fuelTyreMgmt:0.85,qualifying:0.85,morale:74,salary:6000,contractYears:2})
        ]}),
    Team({ id:"trackhouse-motogp", name:"Trackhouse Aprilia", nationality:"USA", color:"#9B26B6", budget:30000, prestige:72, staff:{aero:90,engine:91,mechanics:81},
        drivers:[
            Driver({id:"raul-fernandez",name:"Raul Fernandez",nationality:"ESP",number:25,age:25,pace:0.90,consistency:0.84,racecraft:0.85,wetPerformance:0.83,fuelTyreMgmt:0.84,qualifying:0.88,morale:81,salary:3000,contractYears:2}),
            Driver({id:"ogura",name:"Ai Ogura",nationality:"JPN",number:79,age:25,pace:0.89,consistency:0.82,racecraft:0.83,wetPerformance:0.82,fuelTyreMgmt:0.82,qualifying:0.86,morale:82,salary:2500,contractYears:2, hiddenPotential:0.90})
        ]}),
    Team({ id:"tech3-motogp", name:"Red Bull KTM Tech3", nationality:"FRA", color:"#001E62", budget:28000, prestige:68, staff:{aero:86,engine:89,mechanics:80},
        drivers:[
            Driver({id:"bastianini",name:"Enea Bastianini",nationality:"ITA",number:23,age:28,pace:0.91,consistency:0.83,racecraft:0.89,wetPerformance:0.84,fuelTyreMgmt:0.85,qualifying:0.87,morale:78,salary:4000,contractYears:1}),
            Driver({id:"vinales",name:"Maverick Viñales",nationality:"ESP",number:12,age:31,pace:0.91,consistency:0.82,racecraft:0.87,wetPerformance:0.83,fuelTyreMgmt:0.84,qualifying:0.90,morale:77,salary:5000,contractYears:1})
        ]}),
    Team({ id:"pramac-motogp", name:"Prima Pramac Yamaha", nationality:"ITA", color:"#6A0DAD", budget:29000, prestige:70, staff:{aero:84,engine:85,mechanics:82},
        drivers:[
            Driver({id:"oliveira",name:"Miguel Oliveira",nationality:"POR",number:88,age:31,pace:0.89,consistency:0.83,racecraft:0.87,wetPerformance:0.86,fuelTyreMgmt:0.85,qualifying:0.86,morale:76,salary:3500,contractYears:1}),
            Driver({id:"miller",name:"Jack Miller",nationality:"AUS",number:43,age:31,pace:0.88,consistency:0.80,racecraft:0.88,wetPerformance:0.87,fuelTyreMgmt:0.82,qualifying:0.85,morale:78,salary:3000,contractYears:1})
        ]}),
    Team({ id:"lcr-motogp", name:"LCR Honda", nationality:"MON", color:"#F58220", budget:26000, prestige:64, staff:{aero:81,engine:83,mechanics:80},
        drivers:[
            Driver({id:"zarco",name:"Johann Zarco",nationality:"FRA",number:5,age:35,pace:0.89,consistency:0.85,racecraft:0.88,wetPerformance:0.90,fuelTyreMgmt:0.86,qualifying:0.87,morale:79,salary:3500,contractYears:1}),
            Driver({id:"chantra",name:"Somkiat Chantra",nationality:"THA",number:35,age:27,pace:0.83,consistency:0.78,racecraft:0.79,wetPerformance:0.79,fuelTyreMgmt:0.79,qualifying:0.81,morale:72,salary:1500,contractYears:1})
        ]}),
];

if (typeof window !== "undefined" && window.ALL_TEAMS) {
    window.ALL_TEAMS.motogp = MOTOGP_TEAMS;
}
