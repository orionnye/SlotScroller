# Improve Wheel Reordering Logic Epic

**Status**: ✅ COMPLETED  
**Goal**: Improve wheel reordering algorithm to preserve as many wheels in their current index positions as possible when one wheel is moved.

## Overview

WHY: The current reordering logic when a wheel is dragged and dropped can cause all wheels to shift positions, making it difficult for players to understand how their wheel arrangement changed. A smarter reordering algorithm that preserves the relative positions of unaffected wheels will provide better visual feedback and make drag-and-drop feel more predictable.

---

## Analyze current reordering algorithm

Review how wheels are currently reordered and identify issues with preserving wheel positions.

**Requirements**:
- Given a wheel is moved, should document the current reordering behavior
- Given wheels are reordered, should identify which wheels unnecessarily change positions
- Given reordering occurs, should understand the splice/index calculation logic

---

## Implement minimal-position-change reordering

When a wheel is dropped at a target index, reorder the array while preserving as many other wheels' positions as possible.

**Requirements**:
- Given a wheel is moved from sourceIndex to targetIndex, should move only that wheel
- Given other wheels exist, should preserve their relative order and positions as much as possible
- Given a wheel moves left, should shift wheels to fill the gap without unnecessary repositioning
- Given a wheel moves right, should insert wheel at target without shifting more than necessary

---

## Add visual feedback for wheel movement

Show clear visual indication of which wheel moved and how other wheels adjusted.

**Requirements**:
- Given a wheel is dropped, should provide visual feedback showing the moved wheel
- Given wheels are reordered, should briefly highlight wheels that changed position
- Given reordering completes, should clearly show final wheel arrangement

---
