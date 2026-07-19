/* =============================================================================
 * ULTIMATE MOTORSPORT MANAGER
 * File: data/sponsors.js
 * -----------------------------------------------------------------------------
 * SPONSOR SYSTEM — declarative data for contracts and bonuses.
 *
 * Sponsors are divided into 3 tiers:
 *  - Title Sponsor (main): pays the most, has ambitious objectives
 *  - Technical Sponsor: pays medium, bonuses tied to performance
 *  - Partner Sponsor (minor): pays little, simple objectives
 *
 * Each sponsor defines:
 *  - basePerRace: fixed payment per race
 *  - bonusPodium: bonus per podium
 *  - bonusWin: bonus per win
 *  - bonusPoints: bonus per point scored
 *  - prestigeReq: minimum team prestige to sign
 *  - objective: {type, threshold} — seasonal objective
 * ========================================================================== */

const SPONSOR_TIERS = {
    title:    { label: "Title Sponsor",    maxSlots: 1 },
    technical:{ label: "Technical Sponsor",maxSlots: 2 },
    partner:  { label: "Partner",          maxSlots: 3 },
};

const SPONSOR_POOL = [
    /* --- TITLE SPONSORS --- */
    { id:"aurora_energy", name:"Aurora Energy", tier:"title", color:"#00d4ff",
      basePerRace: 800, bonusWin: 500, bonusPodium: 250, bonusPoints: 8,
      prestigeReq: 60,
      objective:{ type:"championshipPosition", threshold:3, reward: 5000, label:"Finish in the top 3 of the championship" } },

    { id:"redcorp_tech", name:"RedCorp Technologies", tier:"title", color:"#ff4444",
      basePerRace: 750, bonusWin: 600, bonusPodium: 200, bonusPoints: 6,
      prestigeReq: 50,
      objective:{ type:"wins", threshold:3, reward: 4000, label:"Win 3 races in the season" } },

    { id:"stellar_motors", name:"Stellar Motors Group", tier:"title", color:"#9b59b6",
      basePerRace: 900, bonusWin: 400, bonusPodium: 300, bonusPoints: 7,
      prestigeReq: 70,
      objective:{ type:"podiums", threshold:8, reward: 6000, label:"Achieve 8 podiums in the season" } },

    /* --- TECHNICAL SPONSORS --- */
    { id:"brembo_brakes", name:"Brembo Brakes", tier:"technical", color:"#e74c3c",
      basePerRace: 350, bonusWin: 150, bonusPodium: 80, bonusPoints: 3,
      prestigeReq: 40,
      objective:{ type:"pointsFinish", threshold:10, reward: 2000, label:"Points in 10 races" } },

    { id:"oakley_optics", name:"Oakley Optics", tier:"technical", color:"#2ecc71",
      basePerRace: 300, bonusWin: 100, bonusPodium: 60, bonusPoints: 2,
      prestigeReq: 30,
      objective:{ type:"qualifyingPosition", topN:5, racesCount:5, threshold:5, reward: 1500, label:"Qualify in the top 5 for 5 races" } },

    { id:"elf_fuels", name:"Elf Racing Fuels", tier:"technical", color:"#f39c12",
      basePerRace: 400, bonusWin: 200, bonusPodium: 100, bonusPoints: 4,
      prestigeReq: 50,
      objective:{ type:"wins", threshold:1, reward: 1000, label:"Win at least 1 race" } },

    { id:"pirelli_perf", name:"Pirelli Performance", tier:"technical", color:"#f1c40f",
      basePerRace: 320, bonusWin: 120, bonusPodium: 70, bonusPoints: 3,
      prestigeReq: 35,
      objective:{ type:"podiums", threshold:3, reward: 1500, label:"3 podiums in the season" } },

    /* --- PARTNER SPONSORS --- */
    { id:"coca_cola", name:"Coca-Cola", tier:"partner", color:"#c0392b",
      basePerRace: 150, bonusWin: 50, bonusPodium: 30, bonusPoints: 1,
      prestigeReq: 10,
      objective:{ type:"pointsFinish", threshold:5, reward: 800, label:"Points in 5 races" } },

    { id:"rolex_time", name:"Rolex Time", tier:"partner", color:"#d4af37",
      basePerRace: 200, bonusWin: 80, bonusPodium: 40, bonusPoints: 1,
      prestigeReq: 20,
      objective:{ type:"finishRate", threshold:0.8, reward: 1000, label:"Finish 80% of the races" } },

    { id:"fedex_log", name:"FedEx Logistics", tier:"partner", color:"#8e44ad",
      basePerRace: 120, bonusWin: 40, bonusPodium: 25, bonusPoints: 1,
      prestigeReq: 5,
      objective:{ type:"pointsFinish", threshold:3, reward: 500, label:"Points in 3 races" } },

    { id:"monster_energy", name:"Monster Energy", tier:"partner", color:"#27ae60",
      basePerRace: 180, bonusWin: 60, bonusPodium: 35, bonusPoints: 1,
      prestigeReq: 15,
      objective:{ type:"podiums", threshold:1, reward: 600, label:"At least 1 podium" } },

    { id:"tag_heuer", name:"TAG Heuer", tier:"partner", color:"#16a085",
      basePerRace: 160, bonusWin: 70, bonusPodium: 30, bonusPoints: 1,
      prestigeReq: 25,
      objective:{ type:"qualifyingPosition", topN:10, racesCount:3, threshold:10, reward: 700, label:"Qualify in the top 10 for 3 races" } },
];

/* Returns available sponsors (not yet signed) for the player,
    filtered by team prestige. */
function getAvailableSponsors(teamPrestige) {
    return SPONSOR_POOL.filter(s => (s.prestigeReq || 0) <= teamPrestige);
}

if (typeof window !== "undefined") {
    window.SPONSOR_TIERS = SPONSOR_TIERS;
    window.SPONSOR_POOL = SPONSOR_POOL;
    window.getAvailableSponsors = getAvailableSponsors;
}
if (typeof module !== "undefined" && module.exports) {
    module.exports = { SPONSOR_TIERS, SPONSOR_POOL, getAvailableSponsors };
}