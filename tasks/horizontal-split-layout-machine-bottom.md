# Horizontal Split Layout (Machine Bottom Half) Epic

**Status**: 📋 PLANNED  
**Goal**: Change the app layout to a horizontal split where the slot machine UI (Pixi canvas + controls/payout) occupies the bottom half of the screen.

## Overview

WHY: Reserving the top half for progression/upgrade UI while keeping the machine in the bottom half creates a clear “build above, play below” structure and scales well as features expand.

---

## Add top/bottom split container

Introduce a two-row layout with a top region (reserved) and a bottom region that contains the existing machine UI.

**Requirements**:
- Given the app loads, should render a top region and a bottom region in a stable 50/50 (or configurable) split.
- Given the viewport changes size, should keep the bottom region large enough to comfortably display all wheels and the right-side panel without overlap.
- Given no top content exists yet, should display a minimal placeholder in the top region without affecting bottom layout.

---

## Move machine UI into the bottom half

Relayout the machine area so the Pixi canvas and side panel (Spin + payout) live in the bottom region.

**Requirements**:
- Given the machine renders, should be constrained to the bottom region’s bounds.
- Given the payout/reveal sequences run, should remain fully visible and readable in the bottom region.
- Given the Spin button is clicked, should behave exactly as before (no behavior regressions caused by layout changes).

---

