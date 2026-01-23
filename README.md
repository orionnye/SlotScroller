# SlotScroller

A web-based, single-player game that combines **Peglin-style roguelike combat** with **slot machine mechanics**. Built with PixiJS, TypeScript, and Vite.

## 🎮 Game Overview

You control a Hero character that automatically moves across a side-scrolling top screen, encountering enemies. The Hero attacks enemies using a slot machine on the bottom screen—spinning wheels to generate damage values. Enemies fight back by "knocking" icons off your wheels, creating strategic tension around wheel positioning.

**Core Gameplay Loop:**
- Hero automatically moves across the top screen (side-scroller)
- Hero encounters enemies with HP bars
- Player spins the slot machine to generate damage values
- Total points from spin deal damage to the closest enemy
- Enemies attack by removing icons from wheels
- If all icons are removed from a wheel, that wheel is destroyed
- If all wheels are destroyed, the game ends
- Player can drag wheels to reorder them strategically

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ and npm
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/orionnye/SlotScroller.git
   cd SlotScroller
   ```

2. **Install dependencies:**
   ```bash
   cd web
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to the URL shown in the terminal (typically `http://localhost:5173`)

### Building for Production

```bash
cd web
npm run build
```

The production build will be in `web/dist/`. You can preview it with:

```bash
npm run preview
```

## 🚀 Deployment

### Automated Deployment (GitHub Actions)

The application is automatically deployed to GitHub Pages at `https://orionnye.github.io/SlotScroller/` on every push to the `main` branch.

**How it works:**
- GitHub Actions workflow (`.github/workflows/deploy.yml`) builds and deploys automatically
- No manual steps required - just push to `main`
- Deployment typically completes within 2-3 minutes

**Check deployment status:**
- Go to the [Actions tab](https://github.com/orionnye/SlotScroller/actions) in your repository
- View the latest workflow run to see build and deployment progress
- Once complete, your site will be available at: `https://orionnye.github.io/SlotScroller/`

**First-time setup:**
1. Go to repository settings: `https://github.com/orionnye/SlotScroller/settings/pages`
2. Under "Source", select **"GitHub Actions"**
3. The workflow will automatically deploy on the next push to `main`

### Manual Deployment (Fallback)

If you need to deploy manually (e.g., for testing or if Actions are disabled):

```bash
cd web
npm run deploy:manual
```

This will build the application and push it to the `gh-pages` branch using the `gh-pages` npm package.

**Troubleshooting:**

- **404 Error**: Ensure GitHub Pages is enabled in repository settings and configured to use GitHub Actions
- **Assets not loading**: Verify `vite.config.ts` has `base: '/SlotScroller/'` configured
- **Build errors**: Check the Actions tab for detailed error messages
- **Workflow not running**: Ensure GitHub Actions are enabled in repository settings

## 🧪 Testing

### Run All Tests

```bash
cd web
npm run test:run
```

### Run Unit Tests Only

```bash
npm run test:unit
```

### Run Browser Tests

```bash
npm run test:browser
```

### Run Tests in Watch Mode

```bash
npm test
```

### Run Browser Tests with UI

```bash
npm run test:browser:ui
```

## 📁 Project Structure

```
GameDemos/
├── web/                    # Main application
│   ├── src/
│   │   ├── game/          # Pure game logic (no PixiJS dependencies)
│   │   │   ├── config/    # Configuration constants
│   │   │   ├── icons/     # Icon registry and IDs
│   │   │   ├── machine/   # Machine layout calculations
│   │   │   ├── payout/    # Payout and combo calculations
│   │   │   ├── rng/       # Random number generation
│   │   │   ├── spin/      # Spin planning and results
│   │   │   └── wheel/     # Wheel strip model and logic
│   │   ├── pixi/          # PixiJS rendering layer
│   │   │   ├── icons/     # Icon texture creation
│   │   │   ├── topScene/  # Top screen side-scroller scene
│   │   │   └── wheel/     # Wheel rendering components
│   │   └── main.ts        # Application entry point
│   ├── package.json
│   └── vitest.config.ts   # Test configuration
├── vision.md              # Project vision and requirements
├── plan.md                # Development roadmap
├── tasks/                 # Task specifications
└── ai/                    # AI agent guidelines and rules
```

## 🏗️ Architecture

### Separation of Concerns

The project follows a strict separation between **pure game logic** and **rendering**:

- **`game/`**: Pure TypeScript functions with no dependencies on PixiJS or DOM APIs. All game logic (payouts, wheel strips, RNG, spins) is testable in isolation.

- **`pixi/`**: Rendering layer that reads game state and displays it. Uses PixiJS for all visual rendering.

### Key Modules

- **Wheel System**: `game/wheel/` contains the wheel strip model and logic. Wheels are arrays of icons with a cursor position.

- **Payout System**: `game/payout/` calculates base damage and combo bonuses from spin results.

- **RNG**: `game/rng/` provides both seeded (for tests) and crypto-secure random number generation.

- **Rendering**: `pixi/wheel/WheelStripView.ts` renders individual wheels with drag-and-drop support.

## 🎯 Development Status

### ✅ Completed

- [x] PixiJS scaffold and rendering pipeline
- [x] Multi-wheel slot machine (5 wheels)
- [x] Smooth wheel spinning with staggered durations
- [x] Payout calculation (base + combo bonuses)
- [x] Wheel drag-and-drop reordering
- [x] Top scene side-scroller foundation
- [x] Value reveal animations
- [x] Comprehensive unit tests for game logic

### 🚧 In Progress

- [ ] Combat system (enemy attacks, icon removal, wheel destruction)
- [ ] Persistence layer (save/load game state)

### 📋 Planned

- [ ] Hero attack animations
- [ ] Enemy variety and behaviors
- [ ] Upgrade system
- [ ] Sound effects and music
- [ ] Accessibility features

## 🛠️ Technology Stack

- **PixiJS 8.15.0**: 2D WebGL renderer for game graphics
- **TypeScript 5.9**: Type-safe JavaScript
- **Vite 7.2**: Fast build tool and dev server
- **Vitest 4.0**: Unit and browser testing framework
- **Playwright**: Browser automation for rendering tests

## 📝 Code Style

The project follows functional programming principles:

- Prefer pure functions and immutability
- Use `map`, `filter`, `reduce` over manual loops
- Functions should be verbs (`calcPayout`, `advanceCursor`)
- Predicates should read like questions (`isSpinning`, `hasPermission`)
- Keep functions small and composable
- Separate mapping from I/O

See `ai/rules/javascript/javascript.mdc` for detailed guidelines.

## 🧩 Configuration

Key configuration files:

- **`web/src/game/config/wheelConfig.ts`**: Wheel dimensions, spin durations, visible slots
- **`web/src/game/config/layoutConfig.ts`**: Machine layout, spacing, viewport settings
- **`web/src/game/config/animationConfig.ts`**: Animation timing and delays
- **`web/src/game/config/sceneConfig.ts`**: Top scene configuration

## 🤝 Contributing

This project uses AI-assisted development with structured guidance. See `AGENTS.md` for information about the AI agent system.

Before contributing:
1. Read `vision.md` to understand project goals
2. Review `plan.md` for current priorities
3. Check `tasks/` for specific task specifications

## 📄 License

[Add your license here]

## 🙏 Acknowledgments

Built with [PixiJS](https://pixijs.com/) and inspired by roguelike slot machine games.

---

**Note**: This is an arcade-action game (not real-money gambling). All currency is fictional and stays in-game.
