/* =============================================================================
 * ULTIMATE MOTORSPORT MANAGER
 * File: data/teams/f2Teams.js
 * -----------------------------------------------------------------------------
 * DATABASE FORMULA 2 (Season 2026)
 * ========================================================================== */

const F2_TEAMS = [
    Team({ id: "prema-f2", name: "Prema Racing", nationality: "ITA", color: "#1E3A8A", budget: 15000, prestige: 85, staff: { aero: 75, engine: 72, mechanics: 78 },
        drivers: [
            Driver({ id: "mini-f2", name: "Gabriele Mini", nationality: "ITA", number: 8, age: 20, pace: 0.86, consistency: 0.80, racecraft: 0.77, wetPerformance: 0.82, fuelTyreMgmt: 0.80, qualifying: 0.85, morale: 85, salary: 1500, contractYears: 2, hiddenPotential: 0.93 }),
            Driver({ id: "beganovic-f2", name: "Dino Beganovic", nationality: "SWE", number: 5, age: 21, pace: 0.85, consistency: 0.81, racecraft: 0.78, wetPerformance: 0.79, fuelTyreMgmt: 0.80, qualifying: 0.83, morale: 84, salary: 1200, contractYears: 1, hiddenPotential: 0.89 })
        ]
    }),
    Team({ id: "hitech-f2", name: "Hitech Pulse-Eight", nationality: "GBR", color: "#C0C0C0", budget: 14000, prestige: 80, staff: { aero: 73, engine: 71, mechanics: 74 },
        drivers: [
            Driver({ id: "browning-f2", name: "Luke Browning", nationality: "GBR", number: 1, age: 23, pace: 0.85, consistency: 0.80, racecraft: 0.78, wetPerformance: 0.80, fuelTyreMgmt: 0.79, qualifying: 0.84, morale: 82, salary: 1000, contractYears: 2, hiddenPotential: 0.88 }),
            Driver({ id: "aron-f2", name: "Paul Aron", nationality: "EST", number: 17, age: 22, pace: 0.84, consistency: 0.79, racecraft: 0.77, wetPerformance: 0.78, fuelTyreMgmt: 0.78, qualifying: 0.83, morale: 80, salary: 900, contractYears: 1, hiddenPotential: 0.86 })
        ]
    }),
    Team({ id: "campos-f2", name: "Campos Racing", nationality: "ESP", color: "#D32F2F", budget: 12000, prestige: 70, staff: { aero: 70, engine: 68, mechanics: 72 },
        drivers: [
            Driver({ id: "montoya-f2", name: "Sebastián Montoya", nationality: "COL", number: 11, age: 20, pace: 0.83, consistency: 0.77, racecraft: 0.75, wetPerformance: 0.76, fuelTyreMgmt: 0.76, qualifying: 0.82, morale: 78, salary: 700, contractYears: 2, hiddenPotential: 0.87 }),
            Driver({ id: "verschoor-f2", name: "Richard Verschoor", nationality: "NED", number: 21, age: 25, pace: 0.82, consistency: 0.81, racecraft: 0.83, wetPerformance: 0.80, fuelTyreMgmt: 0.82, qualifying: 0.79, morale: 80, salary: 800, contractYears: 1 })
        ]
    }),
    Team({ id: "artgp-f2", name: "ART Grand Prix", nationality: "FRA", color: "#0288D1", budget: 13500, prestige: 78, staff: { aero: 72, engine: 70, mechanics: 73 },
        drivers: [
            Driver({ id: "fittipaldi-f2", name: "Enzo Fittipaldi", nationality: "BRA", number: 14, age: 24, pace: 0.83, consistency: 0.78, racecraft: 0.79, wetPerformance: 0.77, fuelTyreMgmt: 0.79, qualifying: 0.80, morale: 78, salary: 850, contractYears: 1 }),
            Driver({ id: "maloney-f2", name: "Zane Maloney", nationality: "BAR", number: 5, age: 22, pace: 0.84, consistency: 0.79, racecraft: 0.78, wetPerformance: 0.81, fuelTyreMgmt: 0.80, qualifying: 0.84, morale: 82, salary: 900, contractYears: 1, hiddenPotential: 0.88 })
        ]
    }),
    Team({ id: "mp-f2", name: "MP Motorsport", nationality: "NED", color: "#FBC02D", budget: 11000, prestige: 65, staff: { aero: 68, engine: 66, mechanics: 70 },
        drivers: [
            Driver({ id: "dunne-f2", name: "Alex Dunne", nationality: "IRL", number: 2, age: 19, pace: 0.81, consistency: 0.74, racecraft: 0.72, wetPerformance: 0.75, fuelTyreMgmt: 0.74, qualifying: 0.80, morale: 76, salary: 500, contractYears: 2, hiddenPotential: 0.89 }),
            Driver({ id: "hauger-f2", name: "Dennis Hauger", nationality: "NOR", number: 1, age: 23, pace: 0.82, consistency: 0.78, racecraft: 0.79, wetPerformance: 0.76, fuelTyreMgmt: 0.77, qualifying: 0.80, morale: 76, salary: 650, contractYears: 1 })
        ]
    }),
    Team({ id: "invicta-f2", name: "Invicta Racing", nationality: "GBR", color: "#FFB300", budget: 12500, prestige: 72, staff: { aero: 69, engine: 67, mechanics: 71 },
        drivers: [
            Driver({ id: "lindblad-f2", name: "Arvid Lindblad", nationality: "GBR", number: 7, age: 18, pace: 0.84, consistency: 0.78, racecraft: 0.76, wetPerformance: 0.79, fuelTyreMgmt: 0.78, qualifying: 0.83, morale: 79, salary: 800, contractYears: 2, hiddenPotential: 0.95 }),
            Driver({ id: "stanek-f2", name: "Roman Staněk", nationality: "CZE", number: 24, age: 21, pace: 0.82, consistency: 0.77, racecraft: 0.74, wetPerformance: 0.76, fuelTyreMgmt: 0.76, qualifying: 0.80, morale: 77, salary: 700, contractYears: 1 })
        ]
    }),
    Team({ id: "rodin-f2", name: "Rodin Motorsport", nationality: "GBR", color: "#1A1A1A", budget: 11800, prestige: 68, staff: { aero: 67, engine: 65, mechanics: 69 },
        drivers: [
            Driver({ id: "mansell-f2", name: "Christian Mansell", nationality: "AUS", number: 4, age: 22, pace: 0.81, consistency: 0.76, racecraft: 0.75, wetPerformance: 0.77, fuelTyreMgmt: 0.75, qualifying: 0.79, morale: 75, salary: 650, contractYears: 1 }),
            Driver({ id: "voisin-f2", name: "Callum Voisin", nationality: "GBR", number: 12, age: 20, pace: 0.80, consistency: 0.74, racecraft: 0.73, wetPerformance: 0.76, fuelTyreMgmt: 0.74, qualifying: 0.78, morale: 74, salary: 600, contractYears: 1 })
        ]
    }),
    Team({ id: "vanamersfoort-f2", name: "Van Amersfoort Racing", nationality: "NED", color: "#004D99", budget: 10800, prestige: 64, staff: { aero: 66, engine: 64, mechanics: 68 },
        drivers: [
            Driver({ id: "villagomez-f2", name: "Rafael Villagómez", nationality: "MEX", number: 9, age: 20, pace: 0.80, consistency: 0.75, racecraft: 0.73, wetPerformance: 0.74, fuelTyreMgmt: 0.75, qualifying: 0.78, morale: 74, salary: 550, contractYears: 2, hiddenPotential: 0.87 }),
            Driver({ id: "kucharczyk-f2", name: "Tymek Kucharczyk", nationality: "POL", number: 22, age: 19, pace: 0.79, consistency: 0.74, racecraft: 0.72, wetPerformance: 0.73, fuelTyreMgmt: 0.74, qualifying: 0.77, morale: 73, salary: 500, contractYears: 1 })
        ]
    }),
    Team({ id: "aix-f2", name: "AIX Racing", nationality: "GBR", color: "#00BCD4", budget: 10500, prestige: 62, staff: { aero: 65, engine: 63, mechanics: 67 },
        drivers: [
            Driver({ id: "durksen-f2", name: "Joshua Durksen", nationality: "AUS", number: 16, age: 24, pace: 0.79, consistency: 0.74, racecraft: 0.73, wetPerformance: 0.74, fuelTyreMgmt: 0.74, qualifying: 0.77, morale: 73, salary: 480, contractYears: 1 }),
            Driver({ id: "ye-f2", name: "Yifei Ye", nationality: "CHN", number: 20, age: 19, pace: 0.80, consistency: 0.75, racecraft: 0.74, wetPerformance: 0.75, fuelTyreMgmt: 0.75, qualifying: 0.78, morale: 74, salary: 500, contractYears: 2, hiddenPotential: 0.86 })
        ]
    }),
    Team({ id: "trident-f2", name: "Trident", nationality: "ITA", color: "#7B1FA2", budget: 9800, prestige: 58, staff: { aero: 63, engine: 61, mechanics: 64 },
        drivers: [
            Driver({ id: "meguetounif-f2", name: "Sami Meguetounif", nationality: "ALG", number: 10, age: 22, pace: 0.78, consistency: 0.73, racecraft: 0.72, wetPerformance: 0.73, fuelTyreMgmt: 0.73, qualifying: 0.76, morale: 72, salary: 450, contractYears: 1 }),
            Driver({ id: "miyata-f2", name: "Ritomo Miyata", nationality: "JPN", number: 6, age: 23, pace: 0.80, consistency: 0.74, racecraft: 0.73, wetPerformance: 0.74, fuelTyreMgmt: 0.74, qualifying: 0.78, morale: 73, salary: 500, contractYears: 1, hiddenPotential: 0.84 })
        ]
    }),
    Team({ id: "dams-f2", name: "DAMS Lucas", nationality: "FRA", color: "#E91E63", budget: 10000, prestige: 60, staff: { aero: 64, engine: 62, mechanics: 66 },
        drivers: [
            Driver({ id: "martins-f2", name: "Victor Martins", nationality: "FRA", number: 3, age: 24, pace: 0.81, consistency: 0.75, racecraft: 0.74, wetPerformance: 0.75, fuelTyreMgmt: 0.75, qualifying: 0.79, morale: 74, salary: 600, contractYears: 1 }),
            Driver({ id: "kumar-f2", name: "Ryuji Kumita", nationality: "JPN", number: 15, age: 24, pace: 0.79, consistency: 0.73, racecraft: 0.72, wetPerformance: 0.73, fuelTyreMgmt: 0.73, qualifying: 0.77, morale: 72, salary: 450, contractYears: 1 })
        ]
    })
];

if (typeof window !== "undefined" && window.ALL_TEAMS) {
    window.ALL_TEAMS.f2 = F2_TEAMS;
}