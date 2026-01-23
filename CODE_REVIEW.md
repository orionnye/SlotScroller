# Code Review: Performance and Animation Smoothness

## 🎯 Restate

User reports:
1. General lag when moving columns (wheels during drag-and-drop)
2. Icon removal doesn't appear smooth or intuitive

## 💡 Ideate

### Performance Analysis

**Drag and Drop Performance Issues:**

1. **Excessive Layout Recalculations:**
   - `showDropZone()` is called on every `dragmove` event
   - `showDropZone()` calls `computeCenteredGridLayout()` on every drag move
   - Layout calculation happens 60+ times per second during drag
   - No throttling or debouncing of drag events

2. **Coordinate Conversion Overhead:**
   - `onDragMove()` performs `toLocal()` conversions on every pointer move
   - Multiple coordinate conversions per drag event
   - `showDropZone()` also performs coordinate conversions

3. **Graphics Redrawing:**
   - Drop zone indicator is cleared and redrawn on every drag move
   - Graphics operations (`clear()`, `rect()`, `stroke()`) are expensive

**Icon Removal Performance Issues:**

1. **Excessive Rendering Operations:**
   - `update()` calls `renderFrame()`, `renderClipMask()`, `renderSoftBlocks()` on every update
   - These methods call `clear()` and redraw graphics on every update
   - Graphics clearing/redrawing is expensive, especially when done frequently

2. **No Animation/Transition:**
   - Icon removal is instant - no fade out, no smooth transition
   - Visual feedback is just a brief alpha flash (150ms)
   - Wheel size change is instant, not animated

3. **Layout Recalculation:**
   - `getStripLayout()` is called on every update
   - Layout calculation happens even when nothing visible changes

### Root Causes

1. **No Event Throttling:** Drag events fire at pointer move rate (potentially 100+ events/sec)
2. **Redundant Calculations:** Layout and graphics are recalculated even when unchanged
3. **No Caching:** Drop zone calculations aren't cached between drag moves
4. **Graphics Overhead:** Clearing and redrawing graphics on every update
5. **No Smooth Transitions:** Icon removal and wheel resizing are instant

## 🪞 Reflect Critically

### Critical Performance Issues

1. **Drag Lag:**
   - `showDropZone()` recalculates entire layout on every drag move
   - No throttling means 60-120+ layout calculations per second
   - Graphics redrawing on every drag move
   - Coordinate conversions on every event

2. **Icon Removal Not Smooth:**
   - Instant removal with no animation
   - Graphics redrawn immediately without transition
   - No visual feedback showing which icon was removed
   - Wheel size change is jarring (instant shrink)

3. **Redundant Operations:**
   - `renderFrame()`, `renderClipMask()`, `renderSoftBlocks()` called on every update
   - These should only be called when dimensions actually change
   - Layout calculations happen even when strip hasn't changed

### Code Quality Issues

1. **Missing Optimization:** No memoization or caching of expensive calculations
2. **No Throttling:** Events aren't throttled to reasonable rates
3. **Graphics Inefficiency:** Graphics cleared/redrawn unnecessarily
4. **Missing Animations:** No smooth transitions for state changes

## 🔭 Expand Orthogonally

### Potential Solutions

1. **Throttle Drag Events:**
   - Throttle `dragmove` events to ~30fps (33ms intervals)
   - Use `requestAnimationFrame` for smooth updates
   - Cache drop zone calculations between frames

2. **Optimize Drop Zone Rendering:**
   - Only recalculate layout when drag position changes significantly
   - Cache layout points during drag
   - Only redraw drop zone indicator when position changes

3. **Add Icon Removal Animation:**
   - Fade out removed icon over 200-300ms
   - Animate wheel size change smoothly
   - Show which icon was removed with visual highlight

4. **Optimize Wheel Updates:**
   - Only call `renderFrame()`/`renderClipMask()` when dimensions change
   - Cache layout calculations when strip hasn't changed
   - Batch graphics operations

5. **Use PixiJS Ticker:**
   - Leverage PixiJS ticker for smooth animations
   - Use interpolation for smooth transitions
   - Avoid setTimeout for animations

## ⚖️ ScoreRankEvaluate

### Critical Issues (Must Fix)

1. **Drag lag** - High priority, breaks user experience
2. **Icon removal not smooth** - High priority, breaks visual feedback
3. **Excessive layout recalculations** - High priority, performance bottleneck

### Performance Issues

1. **No event throttling** - Medium priority, causes lag
2. **Graphics redrawing** - Medium priority, expensive operations
3. **No animation system** - Medium priority, poor UX

### Code Quality Issues

1. **Missing optimizations** - Low priority, but should be addressed
2. **No caching** - Low priority, but would improve performance

## 💬 Respond

### Summary

The drag-and-drop system recalculates layouts and redraws graphics on every pointer move event (60-120+ times per second), causing lag. Icon removal is instant with no animation, making it feel abrupt and unintuitive. Graphics are redrawn unnecessarily on every update.

### Key Findings

**Drag Performance:**
- `showDropZone()` called on every `dragmove` event
- `computeCenteredGridLayout()` recalculated 60+ times per second
- Drop zone graphics cleared/redrawn on every drag move
- No throttling of drag events

**Icon Removal:**
- Instant removal with no animation
- Graphics redrawn immediately (frame, clip mask, soft blocks)
- No visual feedback showing which icon was removed
- Wheel size change is instant (jarring)

**Redundant Operations:**
- `renderFrame()`, `renderClipMask()`, `renderSoftBlocks()` called on every `update()`
- Layout recalculated even when strip hasn't changed
- No caching of expensive calculations

### Recommended Approach

1. **Throttle drag events** to ~30fps using `requestAnimationFrame`
2. **Cache drop zone calculations** during drag operations
3. **Add icon removal animation** (fade out, smooth transition)
4. **Optimize wheel updates** - only redraw graphics when dimensions change
5. **Add smooth transitions** for wheel size changes using PixiJS ticker

### Next Steps

Create a task epic to:
- Throttle drag events and optimize drop zone rendering
- Add smooth icon removal animations
- Optimize wheel update rendering
- Implement caching for expensive calculations
