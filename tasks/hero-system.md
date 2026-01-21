# Hero System Epic

**Status**: 📋 PLANNED  
**Goal**: Create Hero character that automatically moves across the top screen and attacks enemies when player spins.

## Overview

WHY: The Hero is the player's avatar in the combat world. The Hero needs to automatically move, visually represent the player, and attack enemies when spins occur. This creates the connection between the slot machine (bottom) and the combat world (top).

---

## Create Hero sprite and auto-movement

Add a Hero character sprite to the top scene that automatically moves right across the screen.

**Requirements**:
- Given the top scene is mounted, should display a Hero sprite that moves automatically rightward
- Given Hero movement is active, should move continuously at a constant speed
- Given Hero reaches screen edge, should wrap or continue into new areas (based on side-scroller design)
- Given Hero sprite exists, should be a simple placeholder sprite initially (can be upgraded later)

---

## Link spin to Hero attack animation

When player spins, trigger Hero attack animation and visual effect on the top screen.

**Requirements**:
- Given a spin is initiated, should trigger Hero attack animation in top scene
- Given Hero attacks, should show brief attack animation/effect (particle burst, weapon swing, etc.)
- Given attack completes, should visually indicate damage was dealt (if enemy was hit)
- Given Hero attack is triggered, should be synchronized with spin completion

---

## Position Hero relative to enemies

Track Hero position and determine closest enemy for damage targeting.

**Requirements**:
- Given Hero position is tracked, should be used to determine closest enemy
- Given multiple enemies exist, should select closest enemy for damage application
- Given closest enemy is determined, should be passed to damage calculation system
- Given enemy positioning changes, should recalculate closest enemy dynamically

---
