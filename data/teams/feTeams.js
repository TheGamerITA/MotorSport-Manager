/* =============================================================================
 * ULTIMATE MOTORSPORT MANAGER
 * File: data/teams/feTeams.js
 * -----------------------------------------------------------------------------
 * DATABASE FORMULA E (Season 2025/2026)
 * ========================================================================== */

const FE_TEAMS = [
    Team({
        id: "porsche-fe", name: "TAG Heuer Porsche FE", nationality: "DEU", color: "#000000", budget: 80000, prestige: 90, staff: { aero: 70, engine: 85, mechanics: 82 },
        drivers: [
            Driver({ id: "wehrlein-fe", name: "Pascal Wehrlein", nationality: "DEU", number: 1, age: 31, pace: 0.90, consistency: 0.88, racecraft: 0.87, wetPerformance: 0.85, fuelTyreMgmt: 0.92, qualifying: 0.89, morale: 88, salary: 4000, contractYears: 2 }),
            Driver({ id: "dacosta-fe", name: "Antonio Félix da Costa", nationality: "POR", number: 13, age: 33, pace: 0.89, consistency: 0.86, racecraft: 0.90, wetPerformance: 0.84, fuelTyreMgmt: 0.88, qualifying: 0.87, morale: 85, salary: 3500, contractYears: 1 })
        ]
    }),
    Team({
        id: "jaguar-fe", name: "Jaguar TCS Racing", nationality: "GBR", color: "#00A3E0", budget: 78000, prestige: 88, staff: { aero: 72, engine: 86, mechanics: 81 },
        drivers: [
            Driver({ id: "evans-fe", name: "Mitch Evans", nationality: "NZL", number: 9, age: 31, pace: 0.89, consistency: 0.87, racecraft: 0.88, wetPerformance: 0.85, fuelTyreMgmt: 0.90, qualifying: 0.88, morale: 85, salary: 3500, contractYears: 2 }),
            Driver({ id: "cassidy-fe", name: "Nick Cassidy", nationality: "NZL", number: 37, age: 30, pace: 0.90, consistency: 0.85, racecraft: 0.86, wetPerformance: 0.83, fuelTyreMgmt: 0.91, qualifying: 0.90, morale: 87, salary: 3800, contractYears: 2 })
        ]
    }),
    Team({
        id: "dspenske-fe", name: "DS Penske", nationality: "FRA", color: "#D4AF37", budget: 75000, prestige: 85, staff: { aero: 68, engine: 84, mechanics: 80 },
        drivers: [
            Driver({ id: "vergne-fe", name: "Jean-Éric Vergne", nationality: "FRA", number: 25, age: 35, pace: 0.88, consistency: 0.89, racecraft: 0.89, wetPerformance: 0.86, fuelTyreMgmt: 0.89, qualifying: 0.86, morale: 82, salary: 3200, contractYears: 1 }),
            Driver({ id: "vandoorne-fe", name: "Stoffel Vandoorne", nationality: "BEL", number: 2, age: 32, pace: 0.87, consistency: 0.86, racecraft: 0.85, wetPerformance: 0.84, fuelTyreMgmt: 0.88, qualifying: 0.85, morale: 78, salary: 3000, contractYears: 2 })
        ]
    }),
    Team({
        id: "nissan-fe", name: "Nissan Formula E Team", nationality: "JPN", color: "#C3002F", budget: 72000, prestige: 80, staff: { aero: 69, engine: 83, mechanics: 78 },
        drivers: [
            Driver({ id: "rowland-fe", name: "Oliver Rowland", nationality: "GBR", number: 30, age: 32, pace: 0.88, consistency: 0.84, racecraft: 0.86, wetPerformance: 0.82, fuelTyreMgmt: 0.89, qualifying: 0.88, morale: 84, salary: 2800, contractYears: 2 }),
            Driver({ id: "frijns-fe", name: "Robin Frijns", nationality: "NED", number: 4, age: 33, pace: 0.85, consistency: 0.83, racecraft: 0.84, wetPerformance: 0.83, fuelTyreMgmt: 0.86, qualifying: 0.84, morale: 75, salary: 2500, contractYears: 1 })
        ]
    }),
    Team({
        id: "mclaren-fe", name: "NEOM McLaren FE", nationality: "GBR", color: "#FF8000", budget: 74000, prestige: 82, staff: { aero: 71, engine: 82, mechanics: 79 },
        drivers: [
            Driver({ id: "hughes-fe", name: "Jake Hughes", nationality: "GBR", number: 5, age: 30, pace: 0.86, consistency: 0.85, racecraft: 0.82, wetPerformance: 0.80, fuelTyreMgmt: 0.87, qualifying: 0.89, morale: 80, salary: 2600, contractYears: 2 }),
            Driver({ id: "bird-fe", name: "Sam Bird", nationality: "GBR", number: 6, age: 37, pace: 0.84, consistency: 0.82, racecraft: 0.88, wetPerformance: 0.85, fuelTyreMgmt: 0.85, qualifying: 0.83, morale: 76, salary: 2400, contractYears: 1 })
        ]
    }),
    Team({
        id: "mahindra-fe", name: "Mahindra Racing", nationality: "IND", color: "#E6002D", budget: 68000, prestige: 72, staff: { aero: 65, engine: 78, mechanics: 75 },
        drivers: [
            Driver({ id: "deVries-fe", name: "Nyck de Vries", nationality: "NED", number: 17, age: 29, pace: 0.87, consistency: 0.84, racecraft: 0.85, wetPerformance: 0.83, fuelTyreMgmt: 0.88, qualifying: 0.86, morale: 78, salary: 2700, contractYears: 2 }),
            Driver({ id: "mortara-fe", name: "Edoardo Mortara", nationality: "SUI", number: 48, age: 37, pace: 0.83, consistency: 0.81, racecraft: 0.85, wetPerformance: 0.82, fuelTyreMgmt: 0.84, qualifying: 0.82, morale: 74, salary: 2200, contractYears: 1 })
        ]
    })
];

// Hook FE teams to the global database if it already exists
if (typeof window !== "undefined" && window.ALL_TEAMS) {
    window.ALL_TEAMS.fe = FE_TEAMS;
}