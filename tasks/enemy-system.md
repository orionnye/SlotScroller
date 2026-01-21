# Enemy System Epic

**Status**: 📋 PLANNED  
**Goal**: Create enemies with HP bars that attack the slot machine and can be defeated.

## Overview

WHY: Enemies are the core threat that creates tension. They need HP bars, attack behavior, and must be able to damage the player's wheels. This creates the strategic pressure that makes wheel management meaningful.

---

## Create enemy sprites with HP bars

Add enemy sprites to the top scene with visible HP bars above them.

**Requirements**:
- Given combat encounter starts, should spawn enemy sprites in the top scene
- Given enemies exist, should display HP bars above each enemy showing current/max HP
- Given enemy HP changes, should update HP bar display immediately
- Given enemy HP reaches 0, should show enemy defeat animation/effect

---

## Implement enemy attack behavior

Enemies attack on timers, targeting the slot machine and removing icons from wheels.

**Requirements**:
- Given enemy is active, should attack the slot machine on a timer (e.g., every 2-3 seconds)
- Given enemy attacks, should trigger icon removal from a wheel (targeting logic TBD)
- Given enemy takes damage, should potentially trigger counter-attack or adjust attack timing
- Given enemy attack completes, should show visual feedback (attack animation toward bottom screen)

---

## Implement enemy defeat logic

When enemy HP reaches 0, mark enemy as defeated and handle cleanup.

**Requirements**:
- Given enemy HP reaches 0, should mark enemy as defeated in game state
- Given enemy is defeated, should remove enemy sprite and HP bar from top scene
- Given enemy is defeated, should stop enemy attack timers
- Given all enemies are defeated, should transition to next encounter or victory state

---
