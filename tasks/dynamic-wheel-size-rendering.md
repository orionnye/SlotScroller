# Dynamic Wheel Size Rendering Epic

**Status**: ✅ COMPLETED  
**Goal**: Redesign wheel rendering to visually shrink when icons are removed, showing fewer slots instead of cycling through remaining icons.

## Overview

WHY: Currently, wheels always show the same number of visible slots (7) regardless of how many icons remain. When icons are removed, the wheel cycles through remaining icons to fill all slots, making it appear full. This breaks visual feedback and reduces strategic tension. Players need to see wheels shrink as they're damaged to understand the threat of wheel destruction.

---

## Refactor strip layout to respect actual icon count

Modify `getStripLayout()` to cap visible slots at the actual icon count instead of always showing the maximum.

**Requirements**:
- Given strip has fewer icons than visibleCount, should return only as many slots as icons exist
- Given strip has more icons than visibleCount, should return visibleCount slots (existing behavior)
- Given layout is calculated, should use `Math.min(visibleCount, strip.icons.length)` for actual slot count
- Given fewer slots are returned, should maintain proper spacing and positioning

---

## Update wheel view to hide unused slots

Modify `WheelStripView.update()` to hide sprites beyond the actual icon count instead of showing duplicate icons.

**Requirements**:
- Given wheel has fewer icons than visibleCount, should hide sprites beyond actual icon count
- Given sprites are hidden, should set `visible = false` or `alpha = 0` for unused slots
- Given wheel updates, should show/hide sprites dynamically based on icon count
- Given sprites are hidden, should maintain proper layout for visible sprites

---

## Dynamically resize wheel frame and clip mask

Adjust wheel frame and clip mask dimensions based on actual visible slots to visually shrink the wheel.

**Requirements**:
- Given wheel has fewer icons, should reduce clip mask height to match visible slots
- Given clip mask resizes, should maintain proper masking of visible icons
- Given wheel frame resizes, should adjust frame graphics to match new dimensions
- Given wheel resizes, should maintain visual consistency (centering, proportions)

---

## Update wheel height calculations

Modify wheel height calculations in `mountPixi.ts` to account for dynamic sizing when icons are removed.

**Requirements**:
- Given wheel height is calculated, should use actual visible slot count instead of fixed visibleCount
- Given wheel height changes, should update layout calculations for wheel positioning
- Given wheel resizes, should maintain proper spacing between wheels
- Given wheel height updates, should trigger layout recalculation

---

## Add visual feedback for damaged wheels

Provide additional visual cues (color changes, size indicators) when wheels have few icons remaining.

**Requirements**:
- Given wheel has few icons remaining (e.g., <= 3), should show visual warning (color tint, border)
- Given wheel is damaged, should provide clear visual distinction from healthy wheels
- Given visual feedback is shown, should be clearly visible but not disruptive
- Given wheel recovers (if repair is added later), should remove visual warnings

---
