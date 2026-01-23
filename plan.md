# Plan

## 🚀 Current Priorities

### Deployment & Cleanup (High Priority) - **START HERE**

These tasks address immediate deployment issues and code quality:

1. **Setup GitHub Actions Deployment** (`tasks/setup-github-actions-deployment.md`)
   - Replace manual `npm run deploy` with automated GitHub Actions workflow
   - Builds and deploys automatically on push to main
   - Eliminates manual branch management
   - **Why first**: Fixes deployment reliability issues

2. **Clean Unused Code** (`tasks/clean-unused-code.md`)
   - Remove commented imports in `main.ts` (testDeathAnimation)
   - Delete unused test files: `testDeathAnimation.ts`, `testSvgEnemy.ts`
   - Verify no other dead code exists
   - **Why second**: Quick cleanup that improves code quality

3. **Delete Unused Branches** (`tasks/delete-unused-branches.md`)
   - Clean up polluted `gh-pages` branch (has `.DS_Store`, `.cursor`, etc.)
   - Delete branch to let GitHub Actions recreate it cleanly
   - Verify GitHub Pages settings
   - **Why third**: Cleanup after automated deployment is set up

**Execution Order**: Complete tasks 1-3 in sequence. Task 1 enables automated deployment, task 2 cleans code, task 3 cleans up the old manual deployment artifacts.

---

## 📋 Development Tasks

- Phase 0: Scaffold + Verify PixiJS (`tasks/phase-0-scaffold-and-verify-pixijs.md`)
- Phase 1: Render One Icon (`tasks/phase-1-render-one-icon.md`)
- Phase 2: Wheel Strip Model (`tasks/phase-2-wheel-strip-model.md`)
- Phase 3: Render Strip View (`tasks/phase-3-render-strip-view.md`)
- Smooth 1s Wheel Spin (`tasks/smooth-1s-wheel-spin.md`)
- Wheel Window Mask + Spin Button (`tasks/wheel-window-mask-and-spin-button.md`)
- Opaque Wheel Window Occluder (`tasks/opaque-wheel-window-occluder.md`)
- Soft Top/Bottom Window Blocks (`tasks/soft-top-bottom-window-blocks.md`)
- Multi-Wheel Spin (5 Wheels) (`tasks/multi-wheel-spin-5-wheels.md`)
- Randomized Fair Spin + Per-Wheel Durations (`tasks/randomized-fair-spin-per-wheel-durations.md`)
- Payout Combos + Rewards (`tasks/payout-combos-and-rewards.md`)
- Basic Generated Icons (Replace Words) (`tasks/basic-generated-icons.md`)
- Post-Spin Value Reveal + Payout Add (`tasks/post-spin-value-reveal-and-payout-add.md`)
- Sequenced Value Reveal + Roll-Off (`tasks/sequenced-value-reveal-rolloff.md`)
- Combo Bonus Reveal After Base (`tasks/combo-bonus-reveal-after-base.md`)
- Per-Wheel Combo Bonus Labels (`tasks/per-wheel-combo-bonus-labels.md`)
- Horizontal Split Layout (Machine Bottom Half) (`tasks/horizontal-split-layout-machine-bottom.md`)
- Center Machine in Bottom Split (`tasks/center-machine-in-bottom-split.md`)
- Wheel Cover Opacity + Spin Clipping (`tasks/wheel-cover-opacity-and-clipping.md`)
- Top Half Side-Scroller Scene (`tasks/top-half-side-scroller-scene.md`)
- Fix Top Scene Viewport Positioning (`tasks/fix-top-scene-viewport-positioning.md`)
- Address Critical Issues (`tasks/address-critical-issues.md`)
- Browser-Based Rendering Tests (`tasks/browser-based-rendering-tests.md`)
- Convert WheelStripView Tests to Browser (`tasks/convert-wheelstripview-tests-to-browser.md`)
- Extract Configuration and Refactor Main (`tasks/extract-config-and-refactor-main.md`)

## Combat System Implementation

- Fix Top Scene Positioning and Add Characters (`tasks/fix-top-scene-positioning-and-add-characters.md`)
- Adjust Top Scene Positioning and Hero Behavior (`tasks/adjust-top-scene-positioning-and-hero-behavior.md`)
- Combat Foundation (`tasks/combat-foundation.md`)
- Hero System (`tasks/hero-system.md`)
- Enemy System (`tasks/enemy-system.md`)
- Icon Removal System (`tasks/icon-removal-system.md`)
- Wheel Destruction and Game Over (`tasks/wheel-destruction-and-game-over.md`)
- Implement Wheel Drag and Drop (`tasks/implement-wheel-drag-and-drop.md`)
- Fix Drag and Drop Initialization and Layout (`tasks/fix-drag-drop-initialization-and-layout.md`)
- Improve Wheel Reordering Logic (`tasks/improve-wheel-reordering-logic.md`)
- Wheel Drag and Drop (`tasks/wheel-drag-and-drop.md`)
- Combat Visual Polish (`tasks/combat-visual-polish.md`)
- Enemy Attack Icon Removal (`tasks/enemy-attack-icon-removal.md`)
- Fix Enemy Attack Behavior (`tasks/fix-enemy-attack-behavior.md`)
- Dynamic Wheel Size Rendering (`tasks/dynamic-wheel-size-rendering.md`)
- Fix Wheel Visual Alignment (`tasks/fix-wheel-visual-alignment.md`)
- Implement Wheel Destruction (`tasks/implement-wheel-destruction.md`)
- Implement Damage and Attack Animation (`tasks/implement-damage-and-attack-animation.md`)
- Implement Enemy Defeat and Removal (`tasks/implement-enemy-defeat-and-removal.md`)
- Optimize Drag Performance and Icon Removal (`tasks/optimize-drag-performance-and-icon-removal.md`)
- Redesign Character Visuals (`tasks/redesign-character-visuals.md`)
- Pause Animations and Death Effects (`tasks/pause-animations-and-death-effects.md`)
- Bring Dying Enemies to Front (`tasks/bring-dying-enemies-to-front.md`)
- Clone Dying Enemies for Fullscreen Fall (`tasks/clone-dying-enemies-for-fullscreen-fall.md`)
- Extract Texture Creation Functions (`tasks/extract-texture-creation-functions.md`)
- Extract Types and Sprite Management (`tasks/extract-types-and-sprite-management.md`)
- Extract Combat System (`tasks/extract-combat-system.md`)
- Extract Animation System (`tasks/extract-animation-system.md`)
- Clone Dying Enemies for Fullscreen Fall (`tasks/clone-dying-enemies-for-fullscreen-fall.md`)
- Create Fullscreen Death Overlay (`tasks/create-fullscreen-death-overlay.md`)
- Create Death Animation Test View (`tasks/create-death-animation-test-view.md`)
- Modify Death Animation Test View (`tasks/modify-death-animation-test-view.md`)
- Implement DOM-Based Death Animation (`tasks/implement-dom-based-death-animation.md`)
- Fix Death Animation Visibility and Ticker Destruction (`tasks/fix-pixijs-ticker-destruction.md`)
- Revert to Overlay Death Animation System (`tasks/revert-to-overlay-death-animation.md`)
- Implement CSS/SVG Death Animation (`tasks/implement-css-svg-death-animation.md`)
- SVG Death Animation - Incremental Implementation (`tasks/svg-death-animation-incremental.md`)
- Match SVG Death Animation to Enemy Render (`tasks/match-svg-death-to-enemy-render.md`)
- Extract Enemy Color for SVG Death Animation (`tasks/extract-enemy-color-for-svg-death.md`)
- Refactor Enemy Rendering System (`tasks/refactor-enemy-rendering-system.md`)

