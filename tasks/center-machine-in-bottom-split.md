# Center Machine in Bottom Split Epic

**Status**: 📋 PLANNED  
**Goal**: Ensure the wheel windows are fully visible and centered within the bottom split area (not clipped/sunk), while preserving the horizontal split layout.

## Overview

WHY: The machine must be fully visible to feel playable; if wheels are clipped by the bottom region, spins and reveals lose clarity and polish.

---

## Allocate sufficient bottom area height

Adjust the horizontal split sizing rules so the bottom region provides enough vertical space for the machine to render fully without clipping.

**Requirements**:
- Given the app is displayed in the split layout, should allocate enough height to the bottom region so all wheel windows are fully visible.
- Given smaller viewports, should preserve usability by prioritizing bottom region height over the top placeholder (top can shrink).

---

## Center machine within bottom canvas bounds

Ensure the Pixi machine container is centered within the Pixi canvas inside the bottom region and does not render below the visible canvas.

**Requirements**:
- Given the bottom region is resized, should recenter the machine in the visible Pixi canvas.
- Given the machine’s computed bounds exceed available height, should reduce wheel size/spacing (or scale the machine) deterministically so it fits without clipping.

---

