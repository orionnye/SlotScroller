# Enemy Attack Icon Removal Epic

**Status**: ✅ COMPLETED  
**Goal**: Implement enemy attack behavior that removes the upper-rightmost icon from wheels when enemies attack in range.

## Overview

WHY: Enemy attacks are the core threat mechanic that creates strategic tension. Enemies must attack when in range, wait at range after attacking (cooldown), and remove icons from wheels to create meaningful risk. This mechanic makes wheel positioning strategic and creates pressure on the player.

---

## Add icon removal to wheel strip model

Extend WheelStrip model to support removing icons by index, maintaining valid state after removal.

**Requirements**:
- Given a wheel strip exists, should support removing an icon by index
- Given an icon is removed, should return a new strip with that icon excluded
- Given icon removal occurs, should maintain at least one icon (or mark wheel as empty)
- Given icon is removed, should be a pure function that doesn't mutate the original strip

---

## Implement enemy attack range detection

Detect when enemies are in attack range of the Hero and trigger attack behavior.

**Requirements**:
- Given enemy exists, should track distance to Hero position
- Given enemy is within attack range, should trigger attack behavior
- Given enemy is out of range, should not attack
- Given attack range is configurable, should use a reasonable default (e.g., 150-200px)

---

## Implement enemy attack cooldown system

Enemies attack when in range, then wait at range before attacking again.

**Requirements**:
- Given enemy attacks, should start attack cooldown timer
- Given enemy is on cooldown, should not attack even if in range
- Given cooldown expires, should allow enemy to attack again
- Given attack cooldown is configurable, should use reasonable default (e.g., 2-3 seconds)
- Given enemy attacks, should show visual feedback (attack animation/effect)

---

## Implement upper-rightmost icon targeting

When enemy attacks, identify and remove the upper-rightmost icon from a target wheel.

**Requirements**:
- Given enemy attack targets a wheel, should identify upper-rightmost icon position
- Given upper-rightmost icon is identified, should map visual position to strip index correctly
- Given icon position is determined, should account for wheel's current rotation/cursor state
- Given icon is targeted, should remove that specific icon from the wheel strip

---

## Connect enemy attacks to wheel icon removal

Link enemy attack events to removing icons from wheels in the slot machine.

**Requirements**:
- Given enemy attack occurs, should select target wheel (e.g., leftmost or random)
- Given target wheel is selected, should remove upper-rightmost icon from that wheel
- Given icon is removed, should update wheel strip model and trigger re-render
- Given icon removal occurs, should provide visual feedback (icon fade out, particle effect)
- Given wheel has no icons remaining, should mark wheel for destruction (handled in separate epic)

---
