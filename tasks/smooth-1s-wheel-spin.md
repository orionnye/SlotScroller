# Smooth 1s Wheel Spin Epic

**Status**: 📋 PLANNED  
**Goal**: Replace discrete cursor-jumps with a smooth, looping wheel animation that spins for a fixed 1.0s duration and stops cleanly on a valid icon.

## Overview

WHY: A wheel that scrolls icons past a selection window is the core tactile feedback of the game; smooth time-based motion makes spins feel real and sets up later work like multi-wheel synchronization and payout reveals.

---

## Define a spin plan (pure logic)

Create pure logic that, given a `WheelStrip` and a spin request, returns a deterministic spin plan describing how far to advance and where to land.

**Requirements**:
- Given a wheel strip and a spin request, should produce a plan that lands on exactly one valid icon in the strip.
- Given a plan is produced, should include a fixed duration of 1000ms and a deterministic final cursor.
- Given consecutive spins are requested while a spin is in progress, should prevent overlapping spins deterministically (ignore or queue) without corrupting the wheel state.

---

## Animate wheel scrolling (Pixi)

Use the spin plan to animate the strip view with smooth scrolling for exactly 1.0 seconds, looping icons seamlessly past the window and snapping precisely to the final icon at the end.

**Requirements**:
- Given a spin starts, should smoothly scroll icons past the selection window for 1000ms without visible popping/jumping.
- Given the spin completes, should stop with the selection window aligned to the final icon and the model cursor updated to match.
- Given different target icons (different final cursors), should still animate with identical duration and end in a stable resting state.

---

