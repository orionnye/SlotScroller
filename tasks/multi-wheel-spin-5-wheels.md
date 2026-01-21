# Multi-Wheel Spin (5 Wheels) Epic

**Status**: 📋 PLANNED  
**Goal**: Add four more wheels (five total) and trigger all wheel spins from the existing Spin button.

## Overview

WHY: Multiple wheels are the core lottery-machine fantasy; spinning them together enables meaningful combinations and sets up payouts, upgrades, and build variety.

---

## Render five wheels in the scene

Add a machine view that lays out five `WheelStripView` instances (1 existing + 4 new) with consistent spacing and sizing.

**Requirements**:
- Given the game view loads, should render five wheels on screen with consistent layout.
- Given the viewport size changes, should keep all wheels visible and reasonably spaced without overlapping.
- Given the wheel visuals update (cursor/scroll), should render each wheel independently without affecting others.

---

## Spin button triggers all wheels

Wire the existing Spin button so a single click starts a 1-second spin on each wheel, with overlap prevention.

**Requirements**:
- Given the Spin button is clicked, should start a spin on all five wheels at the same time.
- Given any wheel is already spinning, should prevent overlapping spins deterministically for the whole machine (ignore clicks until all wheels stop).
- Given the spin completes, should leave each wheel resting aligned on a valid icon and update each wheel’s model cursor accordingly.

---

