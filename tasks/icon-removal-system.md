# Icon Removal System Epic

**Status**: 📋 PLANNED  
**Goal**: Implement enemy attacks removing icons from wheels, starting with upper-rightmost icon removal.

## Overview

WHY: Icon removal is the core threat mechanic that makes wheel management strategic. When enemies attack, they must remove icons from wheels, reducing the player's options and creating risk of wheel destruction. This mechanic creates meaningful choices about wheel positioning.

---

## Add icon removal to wheel strip model

Extend WheelStrip model to support removing individual icons from the strip.

**Requirements**:
- Given a wheel strip exists, should support removing a specific icon by index or position
- Given an icon is removed, should update the strip to exclude that icon from future spins
- Given icon removal occurs, should maintain valid strip state (at least one icon remains, or mark wheel as empty)
- Given icon is removed, should be a pure function returning a new strip state

---

## Implement upper-rightmost icon targeting

When enemy attacks, identify and remove the upper-rightmost icon from the selected wheel.

**Requirements**:
- Given enemy attack targets a wheel, should identify the upper-rightmost icon in that wheel
- Given upper-rightmost icon is identified, should be based on wheel's visual layout (top-right position)
- Given icon position is determined, should map visual position to strip index correctly
- Given icon is targeted, should remove that specific icon from the wheel strip

---

## Visual feedback for icon removal

Show visual effects when icons are removed from wheels during enemy attacks.

**Requirements**:
- Given enemy attack removes an icon, should show visual feedback (icon fade out, particle effect, etc.)
- Given icon is removed, should update wheel rendering to reflect missing icon
- Given icon removal occurs, should be clearly visible to player (not subtle)
- Given multiple icons are removed, should sequence removals clearly

---

## Update wheel rendering for dynamic icons

Modify WheelStripView to handle wheels with variable icon counts (after removals).

**Requirements**:
- Given wheel has icons removed, should render only remaining icons
- Given wheel strip updates, should re-render wheel view to reflect current icon set
- Given wheel has few icons remaining, should visually indicate risk (color change, warning indicator)
- Given wheel rendering updates, should maintain smooth transitions (no jarring layout shifts)

---
