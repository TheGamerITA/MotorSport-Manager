/* =============================================================================
 * ULTIMATE MOTORSPORT MANAGER
 * File: data/teams/f1Teams.js
 * -----------------------------------------------------------------------------
 * DATABASE FORMULA 1 (Stagione 2026)
 * ========================================================================== */

const F1_TEAMS = [
    Team({ id:"mclaren-f1", name:"McLaren F1 Team", nationality:"GBR", color:"#FF8000", budget:180000, prestige:95, staff:{aero:94,engine:88,mechanics:90},
        drivers:[
            Driver({id:"norris",name:"Lando Norris",nationality:"GBR",number:4,age:26,pace:0.96,consistency:0.92,racecraft:0.89,wetPerformance:0.90,fuelTyreMgmt:0.88,qualifying:0.93,morale:90,salary:30000,contractYears:3}),
            Driver({id:"piastri",name:"Oscar Piastri",nationality:"AUS",number:81,age:24,pace:0.94,consistency:0.90,racecraft:0.86,wetPerformance:0.87,fuelTyreMgmt:0.88,qualifying:0.92,morale:88,salary:15000,contractYears:3})
        ]}),
    Team({ id:"ferrari-f1", name:"Scuderia Ferrari", nationality:"ITA", color:"#E8002D", budget:200000, prestige:99, staff:{aero:92,engine:95,mechanics:91},
        drivers:[
            Driver({id:"lecerc",name:"Charles Leclerc",nationality:"MON",number:16,age:28,pace:0.95,consistency:0.89,racecraft:0.87,wetPerformance:0.86,fuelTyreMgmt:0.85,qualifying:0.98,morale:85,salary:40000,contractYears:4}),
            Driver({id:"hamilton",name:"Lewis Hamilton",nationality:"GBR",number:44,age:41,pace:0.93,consistency:0.91,racecraft:0.97,wetPerformance:0.98,fuelTyreMgmt:0.93,qualifying:0.92,morale:80,salary:50000,contractYears:2})
        ]}),
    Team({ id:"redbull-f1", name:"Oracle Red Bull Racing", nationality:"AUT", color:"#3671C6", budget:185000, prestige:96, staff:{aero:97,engine:93,mechanics:89},
        drivers:[
            Driver({id:"verstappen",name:"Max Verstappen",nationality:"NED",number:1,age:28,pace:0.99,consistency:0.98,racecraft:0.96,wetPerformance:0.99,fuelTyreMgmt:0.94,qualifying:0.99,morale:95,salary:60000,contractYears:4}),
            Driver({id:"lawson",name:"Liam Lawson",nationality:"NZL",number:30,age:24,pace:0.89,consistency:0.84,racecraft:0.85,wetPerformance:0.81,fuelTyreMgmt:0.84,qualifying:0.87,morale:78,salary:5000,contractYears:2})
        ]}),
    Team({ id:"mercedes-f1", name:"Mercedes-AMG Petronas", nationality:"DEU", color:"#27F4D2", budget:190000, prestige:94, staff:{aero:91,engine:96,mechanics:92},
        drivers:[
            Driver({id:"russell",name:"George Russell",nationality:"GBR",number:63,age:27,pace:0.92,consistency:0.91,racecraft:0.88,wetPerformance:0.89,fuelTyreMgmt:0.90,qualifying:0.91,morale:85,salary:20000,contractYears:3}),
            Driver({id:"antonelli",name:"Andrea Kimi Antonelli",nationality:"ITA",number:12,age:19,pace:0.93,consistency:0.82,racecraft:0.80,wetPerformance:0.86,fuelTyreMgmt:0.82,qualifying:0.94,morale:85,salary:8000,contractYears:3, hiddenPotential:0.98})
        ]}),
    Team({ id:"astonmartin-f1", name:"Aston Martin Aramco", nationality:"GBR", color:"#229971", budget:160000, prestige:82, staff:{aero:89,engine:85,mechanics:86},
        drivers:[
            Driver({id:"alonso",name:"Fernando Alonso",nationality:"ESP",number:14,age:44,pace:0.91,consistency:0.90,racecraft:0.98,wetPerformance:0.95,fuelTyreMgmt:0.92,qualifying:0.90,morale:85,salary:20000,contractYears:1}),
            Driver({id:"stroll",name:"Lance Stroll",nationality:"CAN",number:18,age:26,pace:0.85,consistency:0.80,racecraft:0.82,wetPerformance:0.83,fuelTyreMgmt:0.85,qualifying:0.84,morale:70,salary:10000,contractYears:3})
        ]}),
    Team({ id:"alpine-f1", name:"BWT Alpine F1 Team", nationality:"FRA", color:"#0093CC", budget:140000, prestige:70, staff:{aero:84,engine:86,mechanics:83},
        drivers:[
            Driver({id:"gasly",name:"Pierre Gasly",nationality:"FRA",number:10,age:29,pace:0.89,consistency:0.86,racecraft:0.85,wetPerformance:0.87,fuelTyreMgmt:0.86,qualifying:0.88,morale:75,salary:12000,contractYears:2}),
            Driver({id:"doohan",name:"Jack Doohan",nationality:"AUS",number:7,age:23,pace:0.87,consistency:0.81,racecraft:0.81,wetPerformance:0.83,fuelTyreMgmt:0.84,qualifying:0.86,morale:78,salary:4000,contractYears:2, hiddenPotential:0.90})
        ]}),
    Team({ id:"williams-f1", name:"Atlassian Williams Racing", nationality:"GBR", color:"#64C4FF", budget:130000, prestige:75, staff:{aero:86,engine:80,mechanics:84},
        drivers:[
            Driver({id:"sainz",name:"Carlos Sainz Jr",nationality:"ESP",number:55,age:31,pace:0.92,consistency:0.90,racecraft:0.89,wetPerformance:0.88,fuelTyreMgmt:0.91,qualifying:0.89,morale:85,salary:18000,contractYears:2}),
            Driver({id:"albon",name:"Alexander Albon",nationality:"THA",number:23,age:29,pace:0.89,consistency:0.87,racecraft:0.86,wetPerformance:0.85,fuelTyreMgmt:0.87,qualifying:0.88,morale:80,salary:10000,contractYears:2})
        ]}),
    Team({ id:"rb-f1", name:"Visa Cash App RB", nationality:"ITA", color:"#6692FF", budget:120000, prestige:65, staff:{aero:88,engine:84,mechanics:85},
        drivers:[
            Driver({id:"tsunoda",name:"Yuki Tsunoda",nationality:"JPN",number:22,age:25,pace:0.88,consistency:0.83,racecraft:0.84,wetPerformance:0.85,fuelTyreMgmt:0.84,qualifying:0.87,morale:75,salary:6000,contractYears:1}),
            Driver({id:"hadjar",name:"Isack Hadjar",nationality:"FRA",number:6,age:21,pace:0.86,consistency:0.79,racecraft:0.79,wetPerformance:0.81,fuelTyreMgmt:0.82,qualifying:0.85,morale:75,salary:3000,contractYears:2, hiddenPotential:0.89})
        ]}),
    Team({ id:"sauber-f1", name:"Stake F1 Team Kick Sauber", nationality:"SUI", color:"#52E252", budget:110000, prestige:60, staff:{aero:82,engine:83,mechanics:82},
        drivers:[
            Driver({id:"hulkenberg",name:"Nico Hulkenberg",nationality:"DEU",number:27,age:38,pace:0.89,consistency:0.91,racecraft:0.88,wetPerformance:0.90,fuelTyreMgmt:0.89,qualifying:0.89,morale:80,salary:10000,contractYears:2}),
            Driver({id:"bortoleto",name:"Gabriel Bortoleto",nationality:"BRA",number:5,age:21,pace:0.87,consistency:0.81,racecraft:0.81,wetPerformance:0.82,fuelTyreMgmt:0.83,qualifying:0.86,morale:80,salary:3500,contractYears:3, hiddenPotential:0.91})
        ]}),
    Team({ id:"audi-f1", name:"Audi F1 Team", nationality:"DEU", color:"#000000", budget:115000, prestige:62, staff:{aero:83,engine:84,mechanics:83},
        drivers:[
            Driver({id:"audi-hulkenberg",name:"Nico Hulkenberg",nationality:"DEU",number:27,age:38,pace:0.89,consistency:0.91,racecraft:0.88,wetPerformance:0.90,fuelTyreMgmt:0.89,qualifying:0.89,morale:80,salary:10000,contractYears:2}),
            Driver({id:"audi-bortoleto",name:"Gabriel Bortoleto",nationality:"BRA",number:5,age:21,pace:0.87,consistency:0.81,racecraft:0.81,wetPerformance:0.82,fuelTyreMgmt:0.83,qualifying:0.86,morale:80,salary:3500,contractYears:3, hiddenPotential:0.91})
        ]}),
    Team({ id:"haas-f1", name:"MoneyGram Haas F1 Team", nationality:"USA", color:"#B6BABD", budget:100000, prestige:55, staff:{aero:80,engine:82,mechanics:80},
        drivers:[
            Driver({id:"ocon",name:"Esteban Ocon",nationality:"FRA",number:31,age:29,pace:0.88,consistency:0.85,racecraft:0.84,wetPerformance:0.86,fuelTyreMgmt:0.86,qualifying:0.87,morale:75,salary:10000,contractYears:2}),
            Driver({id:"bearman",name:"Oliver Bearman",nationality:"GBR",number:87,age:20,pace:0.88,consistency:0.81,racecraft:0.82,wetPerformance:0.84,fuelTyreMgmt:0.83,qualifying:0.87,morale:82,salary:4000,contractYears:3, hiddenPotential:0.92})
        ]}),
];

if (typeof window !== "undefined" && window.ALL_TEAMS) {
    window.ALL_TEAMS.f1 = F1_TEAMS;
}