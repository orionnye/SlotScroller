# Fix Wheel Visual Alignment Epic

**Status**: ✅ COMPLETED  
**Goal**: Fix soft blocks (blue window) drift and red frame window issues when icons are removed from wheels.

## Overview

WHY: When icons are removed from wheels, the soft blocks (blue window overlays) drift upward and a red window appears in the center. This breaks visual consistency and makes the wheel rendering look broken. The soft blocks should remain aligned with visible icons, and the frame should render correctly regardless of icon count.

---

## Fix soft block positioning for dynamic icon count

Soft blocks should be positioned relative to actual icon positions, not just frame dimensions.

**Requirements**:
- Given icons are removed, should maintain soft block alignment with visible icons
- Given soft blocks render, should cover areas outside visible icon range correctly
- Given frame shrinks, should reposition soft blocks to match new icon layout
- Given soft blocks update, should maintain proper top/bottom coverage

---

## Fix frame rendering for small icon counts

Ensure frame properly contains visible icons and renders correctly when icon count is small.

**Requirements**:
- Given few icons remain, should render frame that properly contains all visible icons
- Given frame renders, should maintain consistent appearance regardless of icon count
- Given damaged wheel frame, should show warning border without appearing as red window
- Given frame updates, should maintain proper visual boundaries

---

## Fix cover calculation for soft blocks

Recalculate cover block dimensions to properly mask areas outside visible icon range.

**Requirements**:
- Given cover blocks calculate, should account for actual visible icon positions
- Given frame shrinks, should recalculate cover height correctly
- Given cover height is negative or zero, should handle gracefully without rendering issues
- Given cover blocks render, should properly mask top and bottom areas

---

## Ensure visual element alignment

All visual elements (frame, soft blocks, icons, selector) should remain aligned when icon count changes.

**Requirements**:
- Given icons are removed, should maintain alignment between all visual elements
- Given wheel updates, should ensure icons remain centered in frame correctly
- Given soft blocks update, should align with icon positions, not just frame dimensions
- Given visual elements render, should maintain consistent appearance

---
