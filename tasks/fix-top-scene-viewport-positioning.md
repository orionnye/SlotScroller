# Fix Top Scene Viewport Positioning Epic

**Status**: 📋 PLANNED  
**Goal**: Ensure all scene elements (ground, trees, tufts) render within the visible viewport bounds of the top half, not cut off below or above.

## Overview

WHY: Currently the ground is positioned too low (72% of viewport height) and trees are 220px tall, causing most of the scene to render outside the visible area. Only tree tips are visible. We need to adjust positioning and scaling so everything fits within the top half's viewport.

---

## Adjust ground and element positioning

Reposition the ground higher in the viewport and ensure all sprites (trees, tufts) are positioned relative to the visible area.

**Requirements**:
- Given the top scene renders, should position ground at 85-90% of viewport height (instead of 72%) so it's clearly visible.
- Given trees are spawned, should be positioned so their full height fits within the viewport (accounting for their 220px texture height).
- Given tufts are spawned, should sit on the ground surface within visible bounds.
- Given the viewport resizes, should recalculate positions to keep everything visible.

---

## Scale trees to fit viewport

Scale trees dynamically based on available vertical space to ensure they're fully visible.

**Requirements**:
- Given the viewport height is calculated, should scale trees so their full height (including canopy) fits within the visible area above the ground.
- Given trees are scaled, should maintain aspect ratio and visual quality.
- Given trees are recycled/respawned, should use the same scale calculation.

---

## Verify all elements are visible

Test that ground, trees, and tufts are all visible within the top half viewport at various screen sizes.

**Requirements**:
- Given the scene renders at minimum viewport height (160px), should show ground, tufts, and at least partial trees.
- Given the scene renders at typical viewport heights (200-300px), should show full trees with proper scaling.
- Given the scene scrolls, should maintain visibility of all elements as they recycle.
