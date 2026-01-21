# Phase 3: Render Strip View Epic

**Status**: 📋 PLANNED  
**Goal**: Render a static “wheel strip” view in PixiJS that displays a loop of icons from a `WheelStrip` (no spin animation yet).

## Overview

WHY: Seeing a wheel strip on screen unlocks rapid iteration on layout and readability; it also proves the `WheelStrip` model can drive Pixi rendering before we add time-based spin behavior.

---

## Define strip layout math

Create pure helpers that determine which icons should be visible for a given `WheelStrip` cursor and how they should be positioned in the strip view.

**Requirements**:
- Given a `WheelStrip` and a visible slot count, should compute the ordered visible `IconId`s centered on the cursor deterministically.
- Given a `WheelStrip` and a slot spacing, should compute deterministic positions for each visible icon.
- Given different cursor values, should update visible icons without off-by-one or wraparound errors.

---

## Render a static strip view in Pixi

Render multiple icon sprites (loop) based on the `WheelStrip` and layout helpers.

**Requirements**:
- Given the app loads, should render a strip view showing multiple icons from the `WheelStrip`.
- Given the `WheelStrip` cursor is changed in code, should update the rendered strip consistently with the model.
- Given no real icon textures are provided yet, should still display visible placeholder icons for the strip.

---

