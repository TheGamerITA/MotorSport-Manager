# 🏁 Ultimate Motorsport Manager

A **browser-based** motorsport management game, built entirely with HTML/CSS/vanilla JavaScript — no build tools, no dependencies, no frameworks. Just open `index.html` and play.

Manage a racing team through a 24-round calendar, simulating practice, qualifying, and race sessions. Develop R&D, sign sponsors, scout young talent, manage budgets and contracts, and lead your team from the back of the grid to glory.

---

## 🎮 How to Play

1. **Main Menu** — Create a new career or load an existing save.
2. **New Career** — Choose one of **48 championships** (filterable by family), then decide whether to:
   - **Create a custom team** (name, colors, livery, stat presets), or
   - **Take over an existing team** (real 2026 logos and rosters).
3. **Master Control Room** — The main dashboard with sidebar:
   - **Weekend** — Simulate the current session (Practice → Qualifying → Race) with canvas animation, event log, and results.
   - **Team** — Driver statistics (pace, consistency, racecraft, qualifying, wet performance, tyre/fuel management), morale, and contracts.
   - **R&D** — Invest in staff and unlock special projects that improve performance.
   - **Scouting** — Launch scouting (€50k) to discover new Academy talent.
   - **Finance** — Budget, race prize money, season bonuses.
   - **Sponsors** — Sign sponsors by tier (Title / Technical / Partner), with per-race payments, win/podium/points bonuses, and seasonal objectives.
   - **Standings** — Drivers' and constructors' championships updated in real time.
   - **Calendar** — Season view with 24 dynamically generated rounds.

4. **Season End** — Sponsor objective evaluation, driver stat progression/decline based on age, contract expiry, prestige updates, and budget bonus for the new season.

---

## 🏆 Available Championships (48)

**Data-driven** architecture: each championship is described by a `ChampionshipConfig` with flags, modifiers, and rules. The engine (`coreSimulation.js`) is fully generic — it contains no "if it's F1, do this" logic.

| Family | Championships |
|---|---|
| **OpenWheel** (6) | Formula 1, Formula 2, FIA Formula 3, Formula E, Formula 4, Formula Regional |
| **Bike** (8) | MotoGP, Moto2, Moto3, World Superbike, Supersport, FIM Endurance, Moto Junior, One-Make Bike |
| **Endurance** (3) | FIA WEC Hypercar, European Le Mans Series, IMSA WeatherTech |
| **GT** (7) | GT World Challenge, International GT Open, GT2 Europe, Ferrari Challenge, Porsche Cup, Lamborghini Trofeo, One-Make Car |
| **TouringCar** (2) | World Touring Car Cup (WTCR), Stock Car Pro Series |
| **Rally** (8) | WRC, ERC, ARC, APRC, CODASUR, MERC, NACAM, Rally Cup Regional |
| **Rallycross** (2) | World Rallycross, Autocross |
| **Raid** (3) | Dakar Rally, W2RC, World Baja Cup |
| **Motocross** (2) | MXGP, SuperEnduro |
| **Speedway** (1) | FIM Speedway Grand Prix |
| **Karting** (2) | FIA Karting World, Karting Cup Regional |
| **Truck** (1) | FIA European Truck Racing |
| **Drag** (1) | European Drag Racing |
| **HillClimb** (1) | FIA Hill Climb |
| **Trial** (1) | FIM Trial World Championship |

Each discipline has dedicated physics, tyre rules, surfaces, weather, and scoring systems (see `data/categoryConfigs.js`).

---

## 🧠 Architecture

```
MotorSport Manager/
├── index.html              # Entry point + screen structure
├── style.css               # Full styling (dark neon theme)
├── data/
│   ├── categoryConfigs.js  # ChampionshipConfig schema + 48 championships + scoring tables
│   ├── teamsDrivers.js     # Shared driver/team data
│   ├── sponsors.js         # Sponsor pool, tiers, objectives
│   ├── tracks.js           # Track pool by family
│   └── teams/              # Team rosters per championship (separate files)
├── engine/
│   ├── coreSimulation.js   # Generic race engine (Practice, Qualifying, Race)
│   ├── raceAnimator.js     # Canvas race animation
│   ├── careerManager.js    # Career state, calendar, sponsors, morale, seasons
│   ├── saveSystem.js       # Save/load (localStorage)
│   ├── screenManager.js    # Screen transition management
│   └── renderView.js       # Canvas rendering
├── ui/
│   ├── masterUI.js         # UI orchestration, sidebar navigation, refresh
│   └── screens/
│       ├── startScreen.js       # Main menu + save list
│       ├── newCareerScreen.js   # New career wizard (family filter)
│       └── createTeamScreen.js  # Custom team creation form
└── img/                    # Team logos (PNG)
```

### Key Principles

- **Data-driven**: The engine reads `ChampionshipConfig` objects and adapts. Adding a discipline = a new config, zero engine changes.
- **Persistent career**: Development state (staff, R&D, driver morale, AI driver progression) survives reloads via `playerTeamDev`.
- **Objective-based sponsor system**: Per-race payments + win/podium/points bonuses + seasonal objectives with rewards. Removal incurs a penalty.
- **Dynamic morale**: Drivers react to results (podium +, DNF -, back of grid -). Persisted across seasons for the player's team.
- **Driver progression**: Development window ages 16-23 (growth), 24-30 (stable), 31+ (decline). Influenced by morale and performance.
- **Contracts**: Annual expiry with automatic renewal chance if morale is high.
- **Dynamic weather**: Dry / Mixed / Wet with variable probabilities per discipline (offroad more adverse).

---

## 🚀 Quick Start

```bash
# No build step required. Double-click index.html, or:
start index.html
```

For local development server:
```bash
npx serve .
# or
python -m http.server 8000
```

---

## 💾 Saves

Saves use `localStorage`. You can:
- Create multiple parallel careers
- Load/delete saves from the main menu
- Return to menu with ⏏ (progress is saved automatically)

---

## 🛠️ Technologies

- **HTML5** + **CSS3** (dark neon theme, grid layout, animations)
- **Vanilla JavaScript** (ES6+), IIFE modules, no frameworks
- **Canvas 2D** for race animation
- **localStorage** for persistence

---

## 📜 License

Open-source project. See the repository on [GitHub](https://github.com/TheGamerITA/MotorSport-Manager).

---

## 🤝 Contributing

The codebase is designed to be extensible:

- **Add a championship**: Define a new `ChampionshipConfig` in `data/categoryConfigs.js` and add it to the `CHAMPIONSHIPS` registry. Create a team file in `data/teams/` and include it in `index.html`.
- **Add sponsors**: Extend `SPONSOR_POOL` in `data/sponsors.js`.
- **Add tracks**: Extend `TRACKS_BY_FAMILY` in `data/tracks.js`.

---

_Made with passion for motorsport. 🏁_