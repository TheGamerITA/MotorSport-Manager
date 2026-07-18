/* =============================================================================
 * ULTIMATE MOTORSPORT MANAGER
 * File: data/teams/wrcTeams.js
 * -----------------------------------------------------------------------------
 * FIA WRC DATABASE — RALLY1 (2026 Season)
 * Rally: timed event. The engine (_runStageRally) reads the special stats:
 *   paceNotesReading (reading the co-driver's notes) and carControl (control on
 *   gravel/dirt/snow). Passed via specialStats and fused into the driver.
 * Each manufacturer fields multiple crews (crew) = multiple drivers in the same Team.
 * ========================================================================== */

const WRC_TEAMS = [
    Team({ id:"toyota-wrc", name:"Toyota Gazoo Racing WRT", nationality:"JPN", color:"#EB0A1E", budget:90000, prestige:96, staff:{aero:88,engine:94,mechanics:95},
        drivers:[
            Driver({id:"rovanpera-wrc",name:"Kalle Rovanpera",nationality:"FIN",number:69,age:26,pace:0.96,consistency:0.90,racecraft:0.85,wetPerformance:0.88,fuelTyreMgmt:0.86,qualifying:0.90,morale:88,salary:3500,contractYears:2, specialStats:{paceNotesReading:0.93,carControl:0.96}}),
            Driver({id:"evans-wrc",name:"Elfyn Evans",nationality:"GBR",number:33,age:37,pace:0.93,consistency:0.94,racecraft:0.86,wetPerformance:0.90,fuelTyreMgmt:0.90,qualifying:0.88,morale:85,salary:3000,contractYears:2, specialStats:{paceNotesReading:0.95,carControl:0.92}}),
            Driver({id:"katsuta-wrc",name:"Takamoto Katsuta",nationality:"JPN",number:18,age:33,pace:0.88,consistency:0.85,racecraft:0.83,wetPerformance:0.85,fuelTyreMgmt:0.85,qualifying:0.84,morale:80,salary:1800,contractYears:2, specialStats:{paceNotesReading:0.86,carControl:0.87}}),
            Driver({id:"ogier-wrc",name:"Sebastien Ogier",nationality:"FRA",number:17,age:42,pace:0.95,consistency:0.95,racecraft:0.88,wetPerformance:0.92,fuelTyreMgmt:0.93,qualifying:0.91,morale:87,salary:3200,contractYears:1, specialStats:{paceNotesReading:0.97,carControl:0.95}})
        ]}),
    Team({ id:"hyundai-wrc", name:"Hyundai Shell Mobis WRT", nationality:"KOR", color:"#002C5F", budget:88000, prestige:94, staff:{aero:87,engine:93,mechanics:92},
        drivers:[
            Driver({id:"neuville-wrc",name:"Thierry Neuville",nationality:"BEL",number:11,age:38,pace:0.93,consistency:0.90,racecraft:0.87,wetPerformance:0.90,fuelTyreMgmt:0.89,qualifying:0.89,morale:85,salary:3000,contractYears:2, specialStats:{paceNotesReading:0.92,carControl:0.93}}),
            Driver({id:"tanak-wrc",name:"Ott Tanak",nationality:"EST",number:8,age:38,pace:0.95,consistency:0.88,racecraft:0.86,wetPerformance:0.89,fuelTyreMgmt:0.87,qualifying:0.91,morale:83,salary:3200,contractYears:2, specialStats:{paceNotesReading:0.90,carControl:0.95}}),
            Driver({id:"fourmaux-wrc",name:"Adrien Fourmaux",nationality:"FRA",number:16,age:31,pace:0.90,consistency:0.83,racecraft:0.83,wetPerformance:0.85,fuelTyreMgmt:0.84,qualifying:0.87,morale:81,salary:2000,contractYears:2, specialStats:{paceNotesReading:0.85,carControl:0.88}})
        ]}),
    Team({ id:"msport-wrc", name:"M-Sport Ford WRT", nationality:"GBR", color:"#0033A0", budget:60000, prestige:82, staff:{aero:80,engine:85,mechanics:84},
        drivers:[
            Driver({id:"munster-wrc",name:"Gregoire Munster",nationality:"LUX",number:4,age:27,pace:0.86,consistency:0.80,racecraft:0.80,wetPerformance:0.82,fuelTyreMgmt:0.81,qualifying:0.82,morale:78,salary:1200,contractYears:2, specialStats:{paceNotesReading:0.82,carControl:0.84}}),
            Driver({id:"mcerlean-wrc",name:"Josh McErlean",nationality:"IRL",number:19,age:26,pace:0.84,consistency:0.79,racecraft:0.78,wetPerformance:0.81,fuelTyreMgmt:0.80,qualifying:0.81,morale:77,salary:900,contractYears:2, specialStats:{paceNotesReading:0.80,carControl:0.83}}),
            Driver({id:"fourmaux2-wrc",name:"Martins Sesks",nationality:"LVA",number:44,age:26,pace:0.85,consistency:0.78,racecraft:0.78,wetPerformance:0.80,fuelTyreMgmt:0.79,qualifying:0.83,morale:79,salary:850,contractYears:1, specialStats:{paceNotesReading:0.79,carControl:0.86}})
        ]}),
    Team({ id:"privateer-wrc", name:"Privateer Rally1 Entries", nationality:"---", color:"#777777", budget:20000, prestige:60, staff:{aero:74,engine:78,mechanics:76},
        drivers:[
            Driver({id:"solberg-wrc",name:"Oliver Solberg",nationality:"SWE",number:2,age:24,pace:0.87,consistency:0.80,racecraft:0.79,wetPerformance:0.82,fuelTyreMgmt:0.80,qualifying:0.85,morale:80,salary:700,contractYears:1, specialStats:{paceNotesReading:0.81,carControl:0.88}, hiddenPotential:0.92}),
            Driver({id:"mikkelsen-wrc",name:"Andreas Mikkelsen",nationality:"NOR",number:21,age:36,pace:0.86,consistency:0.85,racecraft:0.82,wetPerformance:0.84,fuelTyreMgmt:0.84,qualifying:0.83,morale:78,salary:800,contractYears:1, specialStats:{paceNotesReading:0.87,carControl:0.86}})
        ]}),
];

if (typeof window !== "undefined" && window.ALL_TEAMS) {
    window.ALL_TEAMS.wrc = WRC_TEAMS;
}
