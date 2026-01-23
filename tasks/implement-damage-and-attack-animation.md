# Implement Damage and Attack Animation Epic

**Status**: ✅ COMPLETED  
**Goal**: Deal damage to the nearest enemy based on payout calculation and create a bow and arrow firing animation that triggers after payout is summarized.

## Overview

WHY: The core combat mechanic requires the Hero to attack enemies when the player spins. The total payout from a spin should deal damage to the nearest enemy, and a visual bow and arrow animation will provide satisfying feedback that connects the slot machine (bottom) to the combat world (top). This creates the core gameplay loop where spins have immediate combat impact.

---

## Create damage dealing system

Implement logic to apply payout as damage to the nearest enemy in the top scene.

**Requirements**:
- Given a spin completes and payout is calculated, should find the nearest enemy to the Hero
- Given nearest enemy is found, should apply payout amount as damage to that enemy
- Given enemy takes damage, should reduce enemy HP by damage amount
- Given enemy HP reaches zero, should mark enemy as defeated (handled in separate epic)
- Given no enemies exist, should handle gracefully without errors

---

## Add enemy HP tracking

Extend enemy data structure to include HP values and track current health.

**Requirements**:
- Given enemy is created, should initialize with HP value (e.g., 100 HP)
- Given enemy HP is tracked, should be stored in enemy data structure
- Given enemy takes damage, should update HP value
- Given enemy HP changes, should be accessible for display and game logic

---

## Create bow and arrow sprite

Design and create a bow and arrow sprite/visual element for the Hero attack animation.

**Requirements**:
- Given bow sprite is created, should be a simple placeholder graphic (can be upgraded later)
- Given arrow sprite is created, should be a simple placeholder graphic
- Given sprites are created, should be appropriate size for the Hero character
- Given sprites are created, should be visually distinct and recognizable

---

## Implement bow and arrow firing animation

Create animation sequence where Hero fires an arrow at the nearest enemy after payout is summarized.

**Requirements**:
- Given payout is summarized, should trigger bow and arrow animation
- Given animation starts, should show Hero drawing bow
- Given arrow fires, should animate arrow traveling from Hero to nearest enemy
- Given arrow hits enemy, should show impact effect and apply damage
- Given animation completes, should return Hero to normal state
- Given animation occurs, should be synchronized with damage application

---

## Connect payout to damage application

Link the spin completion and payout calculation to the damage dealing system.

**Requirements**:
- Given spin completes, should calculate payout (existing logic)
- Given payout is calculated, should pass payout value to damage system
- Given payout is passed, should trigger attack animation and damage application
- Given damage is applied, should occur after payout reveal sequence completes

---
