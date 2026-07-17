/* =============================================================================
 * ULTIMATE MOTORSPORT MANAGER
 * File: data/teams/moto2Teams.js
 * -----------------------------------------------------------------------------
 * DATABASE MOTO2 (Stagione 2026)
 * ========================================================================== */

const MOTO2_TEAMS = [
    Team({ id:"boscoloa-moto2", name:"Red Bull KTM Ajo", nationality:"FIN", color:"#FF6600", budget:9000, prestige:88, staff:{aero:78,engine:82,mechanics:80},
        drivers:[
            Driver({id:"gonzalez-m2",name:"Manuel Gonzalez",nationality:"ESP",number:18,age:24,pace:0.90,consistency:0.85,racecraft:0.86,wetPerformance:0.82,fuelTyreMgmt:0.83,qualifying:0.88,morale:87,salary:900,contractYears:2, hiddenPotential:0.93}),
            Driver({id:"holgado-m2",name:"Daniel Holgado",nationality:"ESP",number:96,age:21,pace:0.87,consistency:0.80,racecraft:0.81,wetPerformance:0.79,fuelTyreMgmt:0.80,qualifying:0.85,morale:83,salary:600,contractYears:2, hiddenPotential:0.91})
        ]}),
    Team({ id:"italtrans-moto2", name:"Italtrans Racing", nationality:"ITA", color:"#0055A4", budget:7500, prestige:80, staff:{aero:74,engine:79,mechanics:78},
        drivers:[
            Driver({id:"moreira-m2",name:"Diogo Moreira",nationality:"BRA",number:10,age:22,pace:0.89,consistency:0.83,racecraft:0.84,wetPerformance:0.83,fuelTyreMgmt:0.81,qualifying:0.87,morale:85,salary:700,contractYears:2, hiddenPotential:0.92}),
            Driver({id:"vietti-m2",name:"Celestino Vietti",nationality:"ITA",number:13,age:24,pace:0.86,consistency:0.81,racecraft:0.82,wetPerformance:0.80,fuelTyreMgmt:0.80,qualifying:0.84,morale:80,salary:600,contractYears:1})
        ]}),
    Team({ id:"marcvds-moto2", name:"Elf Marc VDS Racing", nationality:"BEL", color:"#003DA5", budget:8200, prestige:84, staff:{aero:76,engine:80,mechanics:79},
        drivers:[
            Driver({id:"agius-m2",name:"Senna Agius",nationality:"AUS",number:81,age:20,pace:0.88,consistency:0.81,racecraft:0.82,wetPerformance:0.81,fuelTyreMgmt:0.80,qualifying:0.86,morale:84,salary:650,contractYears:2, hiddenPotential:0.93}),
            Driver({id:"gonzalez2-m2",name:"David Alonso",nationality:"COL",number:80,age:20,pace:0.89,consistency:0.82,racecraft:0.83,wetPerformance:0.81,fuelTyreMgmt:0.81,qualifying:0.87,morale:86,salary:700,contractYears:2, hiddenPotential:0.95})
        ]}),
    Team({ id:"fantic-moto2", name:"Fantic Racing", nationality:"ITA", color:"#E30613", budget:6800, prestige:76, staff:{aero:72,engine:77,mechanics:76},
        drivers:[
            Driver({id:"dixon-m2",name:"Jake Dixon",nationality:"GBR",number:96,age:30,pace:0.87,consistency:0.83,racecraft:0.85,wetPerformance:0.83,fuelTyreMgmt:0.82,qualifying:0.85,morale:81,salary:550,contractYears:1}),
            Driver({id:"baltus-m2",name:"Barry Baltus",nationality:"BEL",number:7,age:23,pace:0.85,consistency:0.79,racecraft:0.80,wetPerformance:0.79,fuelTyreMgmt:0.79,qualifying:0.83,morale:79,salary:450,contractYears:1})
        ]}),
    Team({ id:"aspar-moto2", name:"Aspar Team", nationality:"ESP", color:"#EE2E24", budget:6500, prestige:74, staff:{aero:71,engine:76,mechanics:75},
        drivers:[
            Driver({id:"canet-m2",name:"Aron Canet",nationality:"ESP",number:44,age:26,pace:0.87,consistency:0.80,racecraft:0.82,wetPerformance:0.80,fuelTyreMgmt:0.80,qualifying:0.88,morale:80,salary:600,contractYears:1}),
            Driver({id:"munoz-m2",name:"David Munoz",nationality:"ESP",number:64,age:20,pace:0.84,consistency:0.77,racecraft:0.78,wetPerformance:0.78,fuelTyreMgmt:0.77,qualifying:0.83,morale:78,salary:400,contractYears:2, hiddenPotential:0.88})
        ]}),
    Team({ id:"gresini-moto2", name:"QJMOTOR Gresini Moto2", nationality:"ITA", color:"#5FBFF9", budget:6600, prestige:75, staff:{aero:72,engine:77,mechanics:75},
        drivers:[
            Driver({id:"arbolino-m2",name:"Tony Arbolino",nationality:"ITA",number:14,age:25,pace:0.86,consistency:0.80,racecraft:0.82,wetPerformance:0.80,fuelTyreMgmt:0.80,qualifying:0.84,morale:79,salary:500,contractYears:1}),
            Driver({id:"salac-m2",name:"Filip Salac",nationality:"CZE",number:12,age:24,pace:0.85,consistency:0.79,racecraft:0.80,wetPerformance:0.79,fuelTyreMgmt:0.79,qualifying:0.83,morale:78,salary:450,contractYears:1})
        ]}),
    Team({ id:"kalex-moto2", name:"Pertamina Mandalika SAG", nationality:"IDN", color:"#D50032", budget:6000, prestige:70, staff:{aero:70,engine:75,mechanics:74},
        drivers:[
            Driver({id:"aldeguer2-m2",name:"Alonso Lopez",nationality:"ESP",number:21,age:24,pace:0.86,consistency:0.79,racecraft:0.82,wetPerformance:0.80,fuelTyreMgmt:0.79,qualifying:0.85,morale:79,salary:500,contractYears:1}),
            Driver({id:"ogura2-m2",name:"Marcos Ramirez",nationality:"ESP",number:24,age:28,pace:0.83,consistency:0.78,racecraft:0.79,wetPerformance:0.78,fuelTyreMgmt:0.78,qualifying:0.81,morale:75,salary:400,contractYears:1})
        ]}),
    Team({ id:"forward-moto2", name:"Forward Racing Team", nationality:"CHE", color:"#111111", budget:5600, prestige:64, staff:{aero:67,engine:72,mechanics:71},
        drivers:[
            Driver({id:"gonzalez3-m2",name:"Zonta van den Goorbergh",nationality:"NED",number:84,age:20,pace:0.82,consistency:0.76,racecraft:0.77,wetPerformance:0.77,fuelTyreMgmt:0.76,qualifying:0.80,morale:75,salary:350,contractYears:2, hiddenPotential:0.86}),
            Driver({id:"darryn-m2",name:"Darryn Binder",nationality:"RSA",number:15,age:28,pace:0.82,consistency:0.76,racecraft:0.79,wetPerformance:0.77,fuelTyreMgmt:0.77,qualifying:0.80,morale:74,salary:350,contractYears:1})
        ]}),
    Team({ id:"amg-moto2", name:"American Racing Team", nationality:"USA", color:"#0A3161", budget:5400, prestige:60, staff:{aero:66,engine:71,mechanics:70},
        drivers:[
            Driver({id:"roberts-m2",name:"Joe Roberts",nationality:"USA",number:16,age:29,pace:0.85,consistency:0.80,racecraft:0.81,wetPerformance:0.79,fuelTyreMgmt:0.80,qualifying:0.86,morale:78,salary:450,contractYears:1}),
            Driver({id:"perez-m2",name:"Sergio Garcia",nationality:"ESP",number:3,age:23,pace:0.84,consistency:0.78,racecraft:0.79,wetPerformance:0.78,fuelTyreMgmt:0.78,qualifying:0.82,morale:77,salary:400,contractYears:1})
        ]}),
    Team({ id:"ogp-moto2", name:"OnlyFans American Racing", nationality:"USA", color:"#00AEEF", budget:5200, prestige:58, staff:{aero:65,engine:70,mechanics:69},
        drivers:[
            Driver({id:"guevara-m2",name:"Izan Guevara",nationality:"ESP",number:28,age:22,pace:0.84,consistency:0.77,racecraft:0.78,wetPerformance:0.78,fuelTyreMgmt:0.77,qualifying:0.82,morale:76,salary:400,contractYears:1, hiddenPotential:0.87}),
            Driver({id:"aji-m2",name:"Mario Aji",nationality:"IDN",number:51,age:21,pace:0.80,consistency:0.74,racecraft:0.75,wetPerformance:0.75,fuelTyreMgmt:0.74,qualifying:0.78,morale:73,salary:300,contractYears:1})
        ]}),
];

if (typeof window !== "undefined" && window.ALL_TEAMS) {
    window.ALL_TEAMS.moto2 = MOTO2_TEAMS;
}
