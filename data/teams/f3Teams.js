/* =============================================================================
 * ULTIMATE MOTORSPORT MANAGER
 * File: data/teams/f3Teams.js
 * -----------------------------------------------------------------------------
 * DATABASE FIA FORMULA 3 (Stagione 2026)
 * Categoria entry-level: piloti giovani, stat più basse, tanti rookie ad alto
 * potenziale nascosto.
 * ========================================================================== */

const F3_TEAMS = [
    Team({ id:"prema-f3", name:"Prema Racing", nationality:"ITA", color:"#1E3A8A", budget:6000, prestige:82, staff:{aero:68,engine:64,mechanics:70},
        drivers:[
            Driver({id:"tsolov-f3",name:"Nikola Tsolov",nationality:"BUL",number:8,age:19,pace:0.82,consistency:0.74,racecraft:0.72,wetPerformance:0.75,fuelTyreMgmt:0.73,qualifying:0.82,morale:84,salary:400,contractYears:1, hiddenPotential:0.94}),
            Driver({id:"camara-f3",name:"Rafael Camara",nationality:"BRA",number:4,age:20,pace:0.81,consistency:0.75,racecraft:0.72,wetPerformance:0.73,fuelTyreMgmt:0.73,qualifying:0.80,morale:83,salary:350,contractYears:1, hiddenPotential:0.92})
        ]}),
    Team({ id:"trident-f3", name:"Trident", nationality:"ITA", color:"#7B1FA2", budget:5200, prestige:76, staff:{aero:64,engine:61,mechanics:66},
        drivers:[
            Driver({id:"badoer-f3",name:"Brando Badoer",nationality:"ITA",number:2,age:19,pace:0.80,consistency:0.73,racecraft:0.71,wetPerformance:0.72,fuelTyreMgmt:0.72,qualifying:0.79,morale:80,salary:300,contractYears:1, hiddenPotential:0.90}),
            Driver({id:"fornaroli-f3",name:"Leonardo Fornaroli",nationality:"ITA",number:14,age:21,pace:0.81,consistency:0.76,racecraft:0.73,wetPerformance:0.73,fuelTyreMgmt:0.74,qualifying:0.79,morale:82,salary:320,contractYears:1, hiddenPotential:0.89})
        ]}),
    Team({ id:"artgp-f3", name:"ART Grand Prix", nationality:"FRA", color:"#0288D1", budget:5000, prestige:74, staff:{aero:63,engine:60,mechanics:65},
        drivers:[
            Driver({id:"goethe-f3",name:"Laurens van Hoepen",nationality:"NED",number:6,age:19,pace:0.79,consistency:0.72,racecraft:0.70,wetPerformance:0.71,fuelTyreMgmt:0.71,qualifying:0.78,morale:78,salary:280,contractYears:1, hiddenPotential:0.88}),
            Driver({id:"mini2-f3",name:"Nikita Bedrin",nationality:"ITA",number:9,age:19,pace:0.79,consistency:0.71,racecraft:0.70,wetPerformance:0.71,fuelTyreMgmt:0.70,qualifying:0.77,morale:77,salary:260,contractYears:1, hiddenPotential:0.87})
        ]}),
    Team({ id:"campos-f3", name:"Campos Racing", nationality:"ESP", color:"#D32F2F", budget:4600, prestige:70, staff:{aero:61,engine:58,mechanics:63},
        drivers:[
            Driver({id:"mansell-f3",name:"Mari Boya",nationality:"ESP",number:20,age:20,pace:0.79,consistency:0.72,racecraft:0.70,wetPerformance:0.71,fuelTyreMgmt:0.71,qualifying:0.78,morale:77,salary:250,contractYears:1, hiddenPotential:0.86}),
            Driver({id:"stenshorne-f3",name:"Martinius Stenshorne",nationality:"NOR",number:21,age:19,pace:0.80,consistency:0.72,racecraft:0.71,wetPerformance:0.72,fuelTyreMgmt:0.71,qualifying:0.79,morale:79,salary:270,contractYears:1, hiddenPotential:0.90})
        ]}),
    Team({ id:"mp-f3", name:"MP Motorsport", nationality:"NED", color:"#FBC02D", budget:4400, prestige:68, staff:{aero:60,engine:57,mechanics:62},
        drivers:[
            Driver({id:"obrien-f3",name:"Kacper Sztuka",nationality:"POL",number:24,age:19,pace:0.79,consistency:0.71,racecraft:0.70,wetPerformance:0.70,fuelTyreMgmt:0.70,qualifying:0.78,morale:76,salary:230,contractYears:1, hiddenPotential:0.87}),
            Driver({id:"inthraphuvasak-f3",name:"Tasanapol Inthraphuvasak",nationality:"THA",number:25,age:19,pace:0.77,consistency:0.69,racecraft:0.68,wetPerformance:0.69,fuelTyreMgmt:0.68,qualifying:0.76,morale:74,salary:200,contractYears:1})
        ]}),
    Team({ id:"hitech-f3", name:"Hitech TGR", nationality:"GBR", color:"#C0C0C0", budget:4500, prestige:69, staff:{aero:60,engine:58,mechanics:62},
        drivers:[
            Driver({id:"wharton-f3",name:"Christian Mansell",nationality:"AUS",number:5,age:20,pace:0.78,consistency:0.71,racecraft:0.70,wetPerformance:0.70,fuelTyreMgmt:0.70,qualifying:0.77,morale:75,salary:220,contractYears:1}),
            Driver({id:"dufek-f3",name:"Roman Bilinski",nationality:"POL",number:12,age:20,pace:0.77,consistency:0.70,racecraft:0.69,wetPerformance:0.69,fuelTyreMgmt:0.69,qualifying:0.76,morale:74,salary:200,contractYears:1})
        ]}),
    Team({ id:"rodin-f3", name:"Rodin Motorsport", nationality:"GBR", color:"#1A1A1A", budget:4300, prestige:66, staff:{aero:59,engine:56,mechanics:61},
        drivers:[
            Driver({id:"lindblad2-f3",name:"Callum Voisin",nationality:"GBR",number:7,age:19,pace:0.78,consistency:0.70,racecraft:0.69,wetPerformance:0.70,fuelTyreMgmt:0.69,qualifying:0.77,morale:75,salary:220,contractYears:1, hiddenPotential:0.86}),
            Driver({id:"aron2-f3",name:"Piotr Wisnicki",nationality:"POL",number:15,age:20,pace:0.76,consistency:0.69,racecraft:0.68,wetPerformance:0.68,fuelTyreMgmt:0.68,qualifying:0.75,morale:73,salary:190,contractYears:1})
        ]}),
    Team({ id:"vanamersfoort-f3", name:"Van Amersfoort Racing", nationality:"NED", color:"#004D99", budget:4100, prestige:64, staff:{aero:58,engine:55,mechanics:60},
        drivers:[
            Driver({id:"gray-f3",name:"Santiago Ramos",nationality:"MEX",number:22,age:20,pace:0.77,consistency:0.69,racecraft:0.68,wetPerformance:0.69,fuelTyreMgmt:0.68,qualifying:0.76,morale:74,salary:190,contractYears:1}),
            Driver({id:"stromsted-f3",name:"Cenyu Han",nationality:"CHN",number:23,age:19,pace:0.75,consistency:0.68,racecraft:0.67,wetPerformance:0.67,fuelTyreMgmt:0.67,qualifying:0.74,morale:72,salary:170,contractYears:1})
        ]}),
    Team({ id:"jenzer-f3", name:"Jenzer Motorsport", nationality:"CHE", color:"#009639", budget:3900, prestige:60, staff:{aero:56,engine:54,mechanics:58},
        drivers:[
            Driver({id:"barnard-f3",name:"Taylor Barnard",nationality:"GBR",number:30,age:20,pace:0.77,consistency:0.70,racecraft:0.69,wetPerformance:0.69,fuelTyreMgmt:0.69,qualifying:0.76,morale:74,salary:190,contractYears:1, hiddenPotential:0.88}),
            Driver({id:"aziz-f3",name:"Matias Zagazeta",nationality:"PER",number:31,age:20,pace:0.74,consistency:0.67,racecraft:0.66,wetPerformance:0.66,fuelTyreMgmt:0.66,qualifying:0.73,morale:71,salary:160,contractYears:1})
        ]}),
    Team({ id:"aixf3-f3", name:"AIX Racing", nationality:"GBR", color:"#00BCD4", budget:3800, prestige:58, staff:{aero:55,engine:53,mechanics:57},
        drivers:[
            Driver({id:"beganovic2-f3",name:"Nicola Marinangeli",nationality:"ITA",number:16,age:21,pace:0.75,consistency:0.68,racecraft:0.67,wetPerformance:0.67,fuelTyreMgmt:0.67,qualifying:0.74,morale:72,salary:160,contractYears:1}),
            Driver({id:"browning2-f3",name:"Joshua Dufek",nationality:"CHE",number:17,age:19,pace:0.74,consistency:0.66,racecraft:0.65,wetPerformance:0.66,fuelTyreMgmt:0.65,qualifying:0.73,morale:71,salary:150,contractYears:1})
        ]}),
];

if (typeof window !== "undefined" && window.ALL_TEAMS) {
    window.ALL_TEAMS.f3 = F3_TEAMS;
}
