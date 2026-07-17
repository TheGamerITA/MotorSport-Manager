/* =============================================================================
 * ULTIMATE MOTORSPORT MANAGER
 * File: data/teams/moto3Teams.js
 * -----------------------------------------------------------------------------
 * DATABASE MOTO3 (Stagione 2026)
 * ========================================================================== */

const MOTO3_TEAMS = [
    Team({ id:"aspar-moto3", name:"Aspar Team GASGAS", nationality:"ESP", color:"#FF6600", budget:4200, prestige:82, staff:{aero:65,engine:78,mechanics:74},
        drivers:[
            Driver({id:"rueda-m3",name:"Jose Antonio Rueda",nationality:"ESP",number:99,age:20,pace:0.90,consistency:0.83,racecraft:0.85,wetPerformance:0.80,fuelTyreMgmt:0.79,qualifying:0.89,morale:88,salary:300,contractYears:2, hiddenPotential:0.95}),
            Driver({id:"perez-m3",name:"David Almansa",nationality:"ESP",number:22,age:19,pace:0.86,consistency:0.79,racecraft:0.80,wetPerformance:0.78,fuelTyreMgmt:0.77,qualifying:0.85,morale:83,salary:200,contractYears:2, hiddenPotential:0.90})
        ]}),
    Team({ id:"leopard-moto3", name:"Leopard Racing", nationality:"LUX", color:"#00A651", budget:4000, prestige:80, staff:{aero:64,engine:77,mechanics:73},
        drivers:[
            Driver({id:"piqueras-m3",name:"Angel Piqueras",nationality:"ESP",number:36,age:18,pace:0.88,consistency:0.80,racecraft:0.82,wetPerformance:0.78,fuelTyreMgmt:0.78,qualifying:0.87,morale:85,salary:250,contractYears:2, hiddenPotential:0.94}),
            Driver({id:"kelso-m3",name:"Joel Kelso",nationality:"AUS",number:66,age:22,pace:0.85,consistency:0.79,racecraft:0.81,wetPerformance:0.79,fuelTyreMgmt:0.78,qualifying:0.84,morale:81,salary:200,contractYears:1})
        ]}),
    Team({ id:"boe-moto3", name:"BOE Motorsports", nationality:"ESP", color:"#0033A0", budget:3600, prestige:74, staff:{aero:61,engine:74,mechanics:71},
        drivers:[
            Driver({id:"furusato-m3",name:"Taiyo Furusato",nationality:"JPN",number:72,age:19,pace:0.86,consistency:0.79,racecraft:0.80,wetPerformance:0.78,fuelTyreMgmt:0.77,qualifying:0.84,morale:82,salary:200,contractYears:2, hiddenPotential:0.91}),
            Driver({id:"bertelle-m3",name:"Matteo Bertelle",nationality:"ITA",number:18,age:20,pace:0.83,consistency:0.76,racecraft:0.77,wetPerformance:0.76,fuelTyreMgmt:0.75,qualifying:0.81,morale:78,salary:150,contractYears:1})
        ]}),
    Team({ id:"snipers-moto3", name:"MTA Team", nationality:"ITA", color:"#E4002B", budget:3400, prestige:70, staff:{aero:60,engine:73,mechanics:70},
        drivers:[
            Driver({id:"fernandez-m3",name:"Adrian Fernandez",nationality:"ESP",number:31,age:20,pace:0.85,consistency:0.78,racecraft:0.79,wetPerformance:0.77,fuelTyreMgmt:0.77,qualifying:0.83,morale:80,salary:180,contractYears:1}),
            Driver({id:"lunetta-m3",name:"Luca Lunetta",nationality:"ITA",number:58,age:19,pace:0.83,consistency:0.75,racecraft:0.76,wetPerformance:0.76,fuelTyreMgmt:0.75,qualifying:0.81,morale:78,salary:150,contractYears:2, hiddenPotential:0.88})
        ]}),
    Team({ id:"tech3-moto3", name:"Red Bull KTM Tech3", nationality:"FRA", color:"#001E62", budget:3800, prestige:76, staff:{aero:62,engine:76,mechanics:72},
        drivers:[
            Driver({id:"yamanaka-m3",name:"Ryusei Yamanaka",nationality:"JPN",number:6,age:24,pace:0.84,consistency:0.78,racecraft:0.80,wetPerformance:0.78,fuelTyreMgmt:0.78,qualifying:0.82,morale:79,salary:180,contractYears:1}),
            Driver({id:"rossi-m3",name:"Valentin Perrone",nationality:"ARG",number:73,age:18,pace:0.83,consistency:0.75,racecraft:0.76,wetPerformance:0.75,fuelTyreMgmt:0.75,qualifying:0.81,morale:79,salary:150,contractYears:2, hiddenPotential:0.89})
        ]}),
    Team({ id:"cformoto-moto3", name:"CFMOTO Aspar", nationality:"CHN", color:"#C8102E", budget:3300, prestige:68, staff:{aero:59,engine:72,mechanics:69},
        drivers:[
            Driver({id:"munoz-m3",name:"David Munoz",nationality:"ESP",number:10,age:20,pace:0.84,consistency:0.76,racecraft:0.78,wetPerformance:0.76,fuelTyreMgmt:0.76,qualifying:0.83,morale:78,salary:170,contractYears:1}),
            Driver({id:"esteban-m3",name:"Maximo Quiles",nationality:"ESP",number:28,age:17,pace:0.82,consistency:0.73,racecraft:0.74,wetPerformance:0.74,fuelTyreMgmt:0.73,qualifying:0.80,morale:80,salary:120,contractYears:2, hiddenPotential:0.92})
        ]}),
    Team({ id:"honda-moto3", name:"Honda Team Asia", nationality:"THA", color:"#E30613", budget:3100, prestige:64, staff:{aero:57,engine:70,mechanics:67},
        drivers:[
            Driver({id:"veijer-m3",name:"Collin Veijer",nationality:"NED",number:95,age:20,pace:0.86,consistency:0.79,racecraft:0.80,wetPerformance:0.78,fuelTyreMgmt:0.78,qualifying:0.85,morale:81,salary:180,contractYears:1, hiddenPotential:0.90}),
            Driver({id:"tatchakorn-m3",name:"Tatchakorn Buasri",nationality:"THA",number:71,age:19,pace:0.79,consistency:0.72,racecraft:0.73,wetPerformance:0.73,fuelTyreMgmt:0.72,qualifying:0.77,morale:74,salary:100,contractYears:1})
        ]}),
    Team({ id:"kopron-moto3", name:"Rivacold Snipers", nationality:"ITA", color:"#F7941E", budget:3000, prestige:62, staff:{aero:56,engine:69,mechanics:66},
        drivers:[
            Driver({id:"nepa-m3",name:"Stefano Nepa",nationality:"ITA",number:82,age:24,pace:0.80,consistency:0.74,racecraft:0.75,wetPerformance:0.74,fuelTyreMgmt:0.74,qualifying:0.78,morale:73,salary:120,contractYears:1}),
            Driver({id:"whatever-m3",name:"Nicola Carraro",nationality:"ITA",number:81,age:18,pace:0.79,consistency:0.71,racecraft:0.72,wetPerformance:0.72,fuelTyreMgmt:0.71,qualifying:0.77,morale:74,salary:90,contractYears:2, hiddenPotential:0.85})
        ]}),
];

if (typeof window !== "undefined" && window.ALL_TEAMS) {
    window.ALL_TEAMS.moto3 = MOTO3_TEAMS;
}
