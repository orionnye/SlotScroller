# Vision: PixiJS Slot Machine Combat Game

## Product statement

Build a **web-based, single-player game** rendered with **PixiJS** that combines **Peglin-style roguelike combat** with **slot machine mechanics**. The player controls a Hero character that automatically moves across a side-scrolling top screen, encountering enemies. The Hero attacks enemies using a slot machine on the bottom screen—spinning wheels to generate damage values that deal damage to the closest enemy. Enemies fight back by "knocking" icons off the leftmost wheel, reducing the player's available options and creating strategic tension around wheel positioning.

This is an arcade-action game (not real-money gambling).

## Why this exists

Players enjoy the strategic tension of managing a slot machine under pressure: **position wheels → spin → deal damage → defend your machine**. The combination of automatic movement, real-time combat, and tactical wheel management creates a unique gameplay loop where every spin matters and wheel positioning becomes a critical strategic decision.

## Audience

- Players who enjoy roguelike action games with strategic elements.
- Players who like slot machine mechanics but want more active gameplay.
- Players who enjoy optimizing builds and managing resources under pressure.

## Non‑negotiables (constraints)

- **Web-based** experience (desktop-first, mobile-friendly where possible).
- **PixiJS** is the primary renderer for the game view.
- **No real money** wagering or payouts; all currency is fictional and stays in-game.
- **Clear odds and outcomes** (no hidden "gotchas").
- **Performance**: smooth animation and input responsiveness on mid-range devices.
- **Wheel drag-and-drop** must be responsive and feel tactile.

## Core fantasy

"I'm a Hero fighting through a dangerous world, using my magical slot machine as both weapon and shield. Every spin deals damage, but enemies can break my machine—I must strategically position my wheels to protect the most valuable ones."

## Core gameplay loop

- Hero **automatically moves** across the top screen (side-scroller).
- Hero **encounters enemies** with HP bars.
- Player **spins the slot machine** to generate damage values and **attack the closest enemy**.
- **Total points from spin deal damage** to the closest enemy.
- Enemy attacks **"knock" icons off the upper-rightmost icon** of wheels, reducing available options.
- If **all icons are removed from a wheel**, that wheel is **dropped from the slot machine**.
- If the **slot machine runs out of wheels**, the player **dies and the game ends**.
- Player can **drag wheels to reorder** them, strategically positioning wheels to protect valuable icons.
- Player must **balance offense** (high-value wheels for damage) with **defense** (protecting wheels from being destroyed).

## The machine (mental model)

The slot machine is composed of **wheels** arranged in a horizontal row. Each wheel contains **slots** (segments) that each carry an **icon** with an associated **value**.

- **Wheel**: one spinning ring with \(N\) slots, each containing an icon.
- **Slot**: one segment on a wheel; has an icon (e.g., cherry, diamond, star) with a value.
- **Wheel position**: wheels can be dragged left/right to change their order.
- **Spin result**: one selected icon per wheel (e.g., Wheel A=cherry, B=diamond, C=star).
- **Damage calculation**: sum of icon values across all wheels, plus combo bonuses.
- **Icon removal**: When an enemy attacks, it removes the **upper-rightmost icon** from a wheel (randomly selected wheel or specific targeting rules).
- **Wheel destruction**: If all icons are removed from a wheel, that wheel is permanently dropped from the machine.
- **Game over condition**: If the slot machine runs out of wheels (all wheels destroyed), the player dies and the game ends.

## Combat system

### Hero mechanics

- **Automatic movement**: Hero continuously moves right across the side-scrolling top screen.
- **Attack trigger**: Hero attacks the closest enemy when the player **spins the slot machine**.
- **Attack damage**: Damage dealt equals the total points from the spin (sum of icon values + combo bonuses).
- **Attack animation**: Visual feedback when Hero attacks (brief animation/effect, triggered by spin).

### Enemy mechanics

- **HP system**: Each enemy has a health bar that decreases when damaged by spins.
- **Attack behavior**: Enemies attack the Hero's slot machine, targeting wheels.
- **Icon removal**: When an enemy attacks, it "knocks off" the **upper-rightmost icon** from a wheel (may target specific wheels or random selection).
- **Attack frequency**: Enemies attack on a timer or after taking damage.
- **Wheel destruction**: If all icons are removed from a wheel, that wheel is permanently dropped from the machine.
- **Defeat**: When enemy HP reaches 0, enemy is defeated and may drop rewards.
- **Game over**: If all wheels are destroyed (slot machine has no wheels remaining), the player dies and the game ends.

### Damage system

- **Spin damage**: Total points from a spin (sum of icon values + combo bonuses) deal that amount of damage to the closest enemy.
- **Combo bonuses**: Matching icons across wheels provide bonus damage (e.g., 3x cherry = +30 bonus damage).
- **Damage display**: Show damage numbers above the enemy when hit.

## Wheel management

### Drag and drop

- **Wheel reordering**: Player can drag wheels left/right to change their position in the machine.
- **Visual feedback**: Wheels highlight when draggable, show drop zones when dragging.
- **Snap positions**: Wheels snap into discrete positions (no free-floating).
- **Leftmost protection**: The leftmost wheel is visually indicated as "vulnerable" to enemy attacks.

### Strategic positioning

- **High-value wheels**: Wheels with rare/high-value icons should be positioned strategically to protect them from icon removal.
- **Sacrificial wheels**: Wheels with common/low-value icons can be positioned to absorb enemy attacks.
- **Combo optimization**: Positioning wheels to maximize combo potential while protecting valuable icons.
- **Survival priority**: Players must balance maximizing damage output with protecting wheels from destruction to avoid game over.

## Payout model → Damage model

The slot machine now generates **damage** instead of currency:

- **Base damage**: sum of selected icon values across all wheels.
- **Combo bonuses**:
  - **Match bonus**: if 2+ wheels land the same icon, apply a damage multiplier (e.g., 2x = +10, 3x = +30, 4x = +80, 5x = +250).
  - **High-value bonus**: if all icons exceed a value threshold, add flat bonus damage.
- **Damage display**: Show total damage clearly before it's applied to the enemy.

The UI must show why damage happened (e.g., "Base: 25", "3x Cherry: +30", "Total: 55").

## Upgrade system (future consideration)

Upgrades may be added later but are not part of the initial vision. Potential upgrade categories:

- **Wheel repair**: Restore removed icons to wheels.
- **Icon protection**: Reduce chance of icon removal.
- **Damage multipliers**: Increase base damage or combo bonuses.
- **Attack speed**: Reduce Hero attack cooldown.
- **Wheel count**: Add additional wheels to the machine.

## Economy & progression (simplified)

### Currency (if added)

- May include currency earned from defeating enemies.
- Used for repairs, upgrades, or new wheels.

### Progression pacing

- **Early**: Learn wheel positioning and basic combat.
- **Mid**: Encounter stronger enemies requiring strategic wheel management.
- **Late**: Master combo optimization and wheel positioning under pressure.

## Player goals (short → long)

- **Short**: Understand wheel positioning and basic combat flow.
- **Mid**: Strategically position wheels to protect valuable icons while maximizing damage.
- **Long**: Master combo optimization and wheel management to defeat challenging enemies.

## UX principles

- **Satisfying motion**: Weighty spins, clean easing, clear damage feedback.
- **Clarity**: Always show why damage happened and which wheel is vulnerable.
- **Fast iteration**: Wheel dragging should feel responsive and immediate.
- **Respect attention**: Allow reduced motion, skip/fast-forward animations, and sound controls.
- **Visual feedback**: Clear indicators for attack cooldowns, enemy HP, and wheel vulnerability.

## Visual direction (PixiJS-friendly)

### Top screen (side-scroller)

- **Hero sprite**: Animated character that moves automatically across the screen.
- **Enemy sprites**: Various enemy types with HP bars above them.
- **Background**: Scrolling parallax background (trees, sky, ground).
- **Attack effects**: Visual feedback when Hero attacks (particles, screen shake on big hits).

### Bottom screen (slot machine)

- A central, large "machine" with layered sprites:
  - glass, frame, wheels, highlights, particles.
- Each wheel is a Pixi Container with:
  - slot segments with icons,
  - tick marks,
  - a pointer/selector,
  - **drag handle** (visual indicator that wheel can be dragged).
- **Wheel state indicators**: Visual feedback showing which wheels have few icons remaining (at risk of destruction).
- **Game over warning**: Clear visual indication when the player is at risk of losing all wheels.
- **Damage display**: Large, clear damage number when spin completes.
- Big-hit moments add:
  - particle bursts,
  - color grading overlay,
  - optional short vignette animation.

## Technical architecture (high-level)

### Separation of concerns (non-negotiable engineering constraint)

- **Pure game logic** is separate from **rendering** and from **persistence**.
- Rendering reads state and plays animations; logic does not depend on Pixi APIs.

### Proposed modules

- `game-state/`: types + reducers/pure update functions (combat outcomes, wheel state, enemy HP)
- `combat/`: Hero attack logic, enemy behavior, damage calculation
- `wheel/`: Wheel strip model, icon management, wheel ordering/positioning
- `rng/`: seedable RNG helpers used for spins and enemy attacks
- `pixi/`: scene graph, assets, animations, input bindings (drag-and-drop)
- `save/`: versioned save/load, migrations, export/import

### Persistence

- Default: local persistence (e.g., localStorage or IndexedDB) with versioning.
- Must support:
  - **autosave** on major events (enemy defeat, wheel state changes),
  - **reset**,
  - optional **export/import** for debugging and sharing builds.

### Performance targets

- Stable 60fps (or close) on typical hardware.
- Asset loading uses atlases where possible; avoid excessive overdraw.
- Smooth drag-and-drop interactions (60fps during drag operations).

## Out of scope (for v1)

- Multiplayer, trading between players, or server-authoritative economy.
- Real money, ads, or gambling integrations.
- Large narrative campaign (focus on systems first).
- Complex upgrade systems (may be added later).
- Multiple enemy types with unique behaviors (start with simple HP-based enemies).

## Success criteria

- A new player can understand wheel positioning and basic combat within 2 minutes.
- The first "meaningful strategic decision" (positioning a valuable wheel) occurs within 5 minutes.
- Wheel dragging feels responsive and intuitive.
- The combat loop feels satisfying and creates tension around wheel management.
