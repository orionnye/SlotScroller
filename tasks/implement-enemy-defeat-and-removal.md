# Implement Enemy Defeat and Removal Epic

**Status**: ✅ COMPLETED  
**Goal**: Remove enemies from the scene when their HP reaches 0 after taking damage from Hero attacks.

## Overview

WHY: Enemies should be defeated and removed when their HP reaches zero. Currently, enemies take damage but remain in the scene even when dead. Implementing enemy defeat and removal completes the combat loop and makes Hero attacks meaningful - players can clear enemies by dealing enough damage.

---

## Detect enemy defeat condition

When enemy HP reaches 0 after taking damage, mark the enemy for removal.

**Requirements**:
- Given enemy takes damage, should check if HP reaches 0
- Given enemy HP is 0, should mark enemy as defeated
- Given enemy is defeated, should prevent further damage application
- Given enemy is defeated, should trigger removal process

---

## Remove defeated enemy from scene

When an enemy is defeated, remove it from the enemies array and destroy its sprite.

**Requirements**:
- Given enemy is defeated, should remove enemy from enemies array
- Given enemy is removed, should remove enemy sprite from charactersLayer
- Given enemy sprite is removed, should destroy sprite resources properly
- Given enemy is removed, should maintain valid enemies array state

---

## Update damage dealing to trigger removal

Modify damage dealing logic to automatically remove enemies when HP reaches 0.

**Requirements**:
- Given damage is applied, should check if enemy HP reaches 0
- Given enemy HP reaches 0, should immediately trigger removal
- Given enemy is removed, should handle gracefully if enemy was being tracked for attacks
- Given enemy is removed, should maintain game state consistency

---

## Handle edge cases for enemy removal

Ensure enemy removal works correctly in all scenarios (during attacks, movement, etc.).

**Requirements**:
- Given enemy is removed during attack cooldown, should not cause errors
- Given enemy is removed while at attack range, should clean up attack state
- Given enemy is removed, should not interfere with other enemies' behavior
- Given all enemies are removed, should handle empty enemies array gracefully

---
