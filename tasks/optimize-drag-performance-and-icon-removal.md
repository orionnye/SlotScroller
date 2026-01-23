# Optimize Drag Performance and Icon Removal Epic

**Status**: 📋 PLANNED  
**Goal**: Fix drag lag and add smooth animations for icon removal to improve responsiveness and visual feedback.

## Overview

WHY: Current drag-and-drop recalculates layouts 60+ times per second and icon removal is instant with no animation, causing lag and poor visual feedback. Optimizing drag performance and adding smooth icon removal animations will make the game feel responsive and provide clear visual feedback when icons are removed.

---

## Throttle drag events and optimize drop zone rendering

Reduce drag lag by throttling events and caching drop zone calculations.

**Status**: ✅ COMPLETED

**Requirements**:
- ✅ Given drag events fire, should throttle to ~30fps (33ms intervals) using requestAnimationFrame
- ✅ Given dragmove event occurs, should queue update for next animation frame instead of processing immediately
- ✅ Given multiple dragmove events queue, should process only the latest position per frame
- ✅ Given drop zone is calculated, should cache layout points during entire drag operation (from dragstart to dragend)
- ✅ Given layout points are cached, should reuse cached points instead of recalculating on every dragmove
- ✅ Given drop zone renders, should only redraw when target drop index changes (not on every dragmove)
- ✅ Given drop zone position changes, should update indicator smoothly without flicker
- ✅ Given drag events are throttled, should maintain smooth visual feedback (wheel follows cursor smoothly)
- ✅ Given drag ends, should clear cached layout points to free memory
- ✅ Given drop zone calculation occurs, should use cached wheel count instead of recalculating
- ✅ Given coordinate conversion happens, should minimize toLocal() calls by caching converted positions

---

## Optimize wheel graphics rendering

Only redraw graphics (frame, clip mask, soft blocks) when dimensions actually change.

**Status**: ✅ COMPLETED

**Requirements**:
- ✅ Given wheel updates, should track previous actualVisibleCount and isDamaged state to detect changes
- ✅ Given wheel dimensions haven't changed, should skip renderFrame(), renderClipMask(), and renderSoftBlocks() calls
- ✅ Given actualVisibleCount changes, should redraw frame, clip mask, and soft blocks with new dimensions
- ✅ Given isDamaged state changes, should redraw frame with appropriate border style
- ✅ Given graphics update, should maintain visual consistency
- ✅ Given wheel is created, should initialize tracked dimensions to current state
- ✅ Given wheel updates with same dimensions, should avoid expensive graphics.clear() and redraw operations
- ✅ Given dimensions change, should update tracked dimensions after redrawing
- ✅ Given graphics are optimized, should maintain correct visual appearance in all states

---

## Add smooth icon removal animation

Create animated fade-out and visual feedback when icons are removed.

**Requirements**:
- Given icon is removed, should fade out removed icon over 200-300ms
- Given icon fades out, should use PixiJS ticker for smooth animation
- Given icon is removed, should highlight which icon was removed before fade
- Given animation completes, should update wheel rendering smoothly

---

## Add smooth wheel size transition

Animate wheel size changes when icons are removed instead of instant resize.

**Requirements**:
- Given wheel size changes, should animate height transition over 200-300ms
- Given size animates, should use interpolation for smooth transition
- Given size changes, should update frame, clip mask, and soft blocks smoothly
- Given transition completes, should maintain proper visual alignment

---

## Cache layout calculations

Cache expensive layout calculations to avoid redundant work.

**Requirements**:
- Given layout is calculated, should cache result when inputs haven't changed
- Given strip layout is computed, should only recalculate when strip or visibleCount changes
- Given drop zone layout is computed, should cache during drag operations
- Given cache is used, should invalidate when inputs change

---
