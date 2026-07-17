function Driver(d) {
    const base = Object.assign({
        id: "unknown", name: "Unknown", nationality: "???", number: 0, age: 25,
        pace: 0.5, consistency: 0.5, racecraft: 0.5, wetPerformance: 0.5, fuelTyreMgmt: 0.5, qualifying: 0.5,
        morale: 75, salary: 0, contractYears: 1, hiddenPotential: null,
    }, d);
    if (d && d.specialStats) Object.assign(base, d.specialStats);
    base.rating = +(base.pace*0.30 + base.consistency*0.20 + base.racecraft*0.20 + base.qualifying*0.15 + base.wetPerformance*0.10 + base.fuelTyreMgmt*0.05).toFixed(3);
    return base;
}

function Team(t) {
    return Object.assign({
        id: "unknown", name: "Unknown Team", nationality: "???", color: "#888",
        budget: 0, prestige: 50, staff: { aero:50, engine:50, mechanics:50 }, drivers: [],
    }, t);
}

const ALL_TEAMS = {};

if (typeof window !== "undefined") {
    window.Driver = Driver; window.Team = Team; window.ALL_TEAMS = ALL_TEAMS;
    window.getTeamById = (c, t) => (ALL_TEAMS[c]||[]).find(x => x.id === t);
    window.getDriverById = (c, d) => { for (const t of ALL_TEAMS[c]||[]) { const drv = t.drivers.find(x => x.id === d); if (drv) return drv; } return null; };
}