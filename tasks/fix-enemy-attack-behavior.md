# Fix Enemy Attack Behavior Epic

**Status**: ✅ COMPLETED  
**Goal**: Fix enemy attack behavior to stop enemies at range, target correct wheel, verify icon removal, and add attack animations.

## Overview

WHY: Current enemy attack behavior has several issues: enemies move past the hero, wheel size doesn't reflect icon removal, targeting may be incorrect, and there's no visual feedback for attacks. Fixing these issues will make the combat system feel correct and provide clear feedback to the player.

---

## Fix enemy movement to stop at attack range

Enemies should stop moving when they reach attack range and remain there to attack, not continue past the hero.

**Requirements**:
- Given enemy reaches attack range, should stop moving toward hero
- Given enemy is at attack range, should remain stationary while attacking
- Given enemy is out of range, should continue moving toward hero
- Given enemy is defeated or hero dies, should stop all movement

---

## Fix wheel targeting to use rightmost wheel

Enemy attacks should target the rightmost wheel (not leftmost) as specified in the vision.

**Requirements**:
- Given enemy attack occurs, should target the rightmost wheel (highest index)
- Given wheel array is reordered, should always target the wheel at the highest index
- Given no wheels exist, should handle gracefully without errors

---

## Verify upper-rightmost icon removal

Ensure that when removing icons, we're correctly identifying and removing the uppermost icon from the target wheel.

**Requirements**:
- Given enemy attack targets a wheel, should identify the uppermost icon in visible window
- Given uppermost icon is identified, should map to correct strip index
- Given icon is removed, should update wheel strip and view correctly
- Given icon removal occurs, should be visible in wheel rendering

---

## Fix wheel rendering to reflect icon count

Wheel visual size should decrease or show fewer icons when icons are removed, making the threat visible.

**Requirements**:
- Given icons are removed from wheel, should update wheel rendering to show fewer icons
- Given wheel has fewer icons, should maintain proper visual layout
- Given wheel rendering updates, should be immediately visible to player
- Given wheel has one icon remaining, should still render correctly

---

## Add enemy attack animation

Provide visual feedback when enemies attack so players can see when attacks occur.

**Requirements**:
- Given enemy attacks, should show brief attack animation (e.g., sprite flash, scale pulse, color change)
- Given attack animation occurs, should be clearly visible but not disruptive
- Given multiple enemies attack, should sequence animations appropriately
- Given attack animation completes, should return to normal state

---
