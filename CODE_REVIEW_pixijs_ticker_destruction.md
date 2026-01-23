# Code Review: PixiJS Ticker Destruction Issue

## Critical Issue: Ticker Still Rendering After App Destruction

**Error**: `Cannot read properties of null (reading 'geometry')`  
**Location**: `_BatcherPipe2.execute` → `RenderGroupSystem.render` → `WebGLRenderer.render`

**Root Cause**: Each death animation creates a PixiJS Application with its own ticker that automatically renders. When the app is destroyed, the ticker may still be queued to render, causing it to access destroyed renderer/geometry resources.

---

## Problem Analysis

### Current Implementation

1. **App Creation** (`domDeathAnimation.ts:76-83`):
   ```typescript
   const app = new Application()
   await app.init({ ... })
   ```
   - Creates an app that **automatically starts rendering** via its internal ticker
   - The ticker is active and will continue rendering until stopped

2. **App Destruction** (`domDeathAnimation.ts:149-154`):
   ```typescript
   deathAnim.app.destroy(true)
   ```
   - Destroys the app but **does NOT stop the ticker first**
   - The ticker may still have pending render calls queued
   - When the ticker tries to render, the renderer/geometry is already destroyed → error

### The Problem

PixiJS Applications have an internal ticker that automatically renders each frame. When you call `app.destroy()`, it destroys the renderer and resources, but if the ticker is still active and has a pending render call, it will try to access those destroyed resources.

**Timeline of the bug**:
1. Death animation app is created → ticker starts auto-rendering
2. Animation completes → `animateDomDeath()` is called
3. Cleanup begins → canvas removed, app destroyed
4. **BUT**: Ticker still has a pending render call queued
5. Ticker tries to render → accesses destroyed renderer → `geometry` is null → error

---

## Solution Required

### Option 1: Stop Ticker Before Destruction (Recommended)

Stop the app's ticker before destroying the app:

```typescript
// Stop the ticker first
deathAnim.app.ticker.stop()
// Then destroy
deathAnim.app.destroy(true)
```

### Option 2: Disable Auto-Start

Create apps with `autoStart: false` and manually control rendering:

```typescript
const app = new Application()
await app.init({
  autoStart: false, // Don't auto-start ticker
  // ... other options
})
// Manually render when needed (or use a custom ticker)
```

### Option 3: Remove from Shared Ticker

If using a shared ticker, ensure the app is removed from it before destruction.

---

## Additional Issues Found

### 1. Race Condition in Array Removal

**Location**: `domDeathAnimationAnimation.ts:15-28`

The code iterates over a copy of the array but checks if items are still in the original array. However, there's a potential race condition:

```typescript
const animationsToUpdate = [...deathAnimations]
for (const deathAnim of animationsToUpdate) {
  if (!deathAnimations.includes(deathAnim)) continue // This check is redundant
  const isComplete = animateDomDeath(deathAnim, dt)
  if (isComplete) {
    const index = deathAnimations.indexOf(deathAnim) // Could be -1 if removed elsewhere
    if (index !== -1) {
      deathAnimations.splice(index, 1)
    }
  }
}
```

**Issue**: If an animation is removed from `deathAnimations` between the copy and the check, `indexOf` could return -1, but we'd still try to animate it.

**Fix**: The current approach is actually fine, but could be simplified by iterating backwards or using `filter`.

### 2. No Ticker Cleanup in mountTopScene

**Location**: `mountTopScene.ts:227-252`

When cleaning up death animations in `destroy()`, we don't stop their tickers. This is the same issue as above.

---

## Recommended Fix Priority

1. **CRITICAL**: Stop ticker before destroying app in `animateDomDeath()`
2. **CRITICAL**: Stop ticker before destroying app in `mountTopScene.destroy()`
3. **MEDIUM**: Consider using `autoStart: false` for death animation apps to have more control
4. **LOW**: Simplify array iteration logic in `animateDomDeaths()`

---

## Code Pattern to Follow

Based on how other parts of the codebase handle app destruction (e.g., `mountTopScene.ts:224`), we should:

1. Stop/remove ticker listeners first
2. Then destroy the app
3. Then clean up DOM elements

Example:
```typescript
// Stop ticker
app.ticker.stop()
// Or if using custom ticker: app.ticker.remove(listener)

// Destroy app
await app.destroy(true)

// Remove DOM
container.removeChild(app.canvas)
container.parentNode.removeChild(container)
```
