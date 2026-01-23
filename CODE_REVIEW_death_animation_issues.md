# Code Review: Death Animation Issues

## Issues Identified

### 1. Test Death Animation Still Active ❌

**Location**: `web/src/main.ts:198`

**Problem**: The test death animation is still being called, creating an infinite loop test view that shouldn't be in production.

```typescript
// Create death animation test view (for debugging)
void createDeathAnimationTest()
```

**Impact**: 
- Creates unnecessary DOM elements and PixiJS applications
- May interfere with the actual death animation system
- Clutters the UI with test elements

**Fix**: Remove or comment out this line.

---

### 2. PixiJS Application Cleanup Issue ❌

**Location**: `web/src/pixi/topScene/animation/domDeathAnimation.ts:127-131`

**Problem**: The cleanup code destroys the PixiJS app but doesn't properly remove the canvas from the DOM before destruction. This can cause rendering errors when PixiJS tries to access destroyed resources.

**Current Code**:
```typescript
// Cleanup
deathAnim.app.destroy(true)
if (deathAnim.container.parentNode) {
  deathAnim.container.parentNode.removeChild(deathAnim.container)
}
```

**Issues**:
1. Canvas is not removed from container before app destruction
2. App destruction happens before DOM removal, which can cause race conditions
3. No error handling for cleanup operations

**Error Context**: The error "Cannot read properties of null (reading 'clear')" in `_DefaultBatcher2.break` suggests that PixiJS is trying to access renderer resources that have been destroyed or are in an invalid state. This commonly happens when:
- A canvas is still in the DOM but its app is destroyed
- Multiple apps are trying to render simultaneously
- Cleanup order is incorrect

**Fix**: Follow the pattern from `browser-test-utils.ts`:
```typescript
// Remove canvas from container first
if (deathAnim.app.canvas && deathAnim.container.contains(deathAnim.app.canvas)) {
  deathAnim.container.removeChild(deathAnim.app.canvas)
}
// Then destroy the app
await deathAnim.app.destroy(true)
// Finally remove container from DOM
if (deathAnim.container.parentNode) {
  deathAnim.container.parentNode.removeChild(deathAnim.container)
}
```

---

### 3. Sprite Bounds Calculation Timing ⚠️

**Location**: `web/src/pixi/topScene/animation/domDeathAnimation.ts:17-32`

**Problem**: `getBounds()` is called on a sprite that may not have been fully initialized or rendered yet. If the sprite hasn't been added to a display list or rendered, `getBounds()` might return incorrect values.

**Current Code**:
```typescript
function calculateContainerSize(sprite: Sprite): { width: number; height: number } {
  const bounds = sprite.getBounds()
  const spriteWidth = bounds.width
  const spriteHeight = bounds.height
  // ...
}
```

**Potential Issue**: If `getBounds()` returns invalid dimensions (0 or NaN), the container size calculation will be incorrect, potentially causing rendering issues.

**Fix**: Add validation and fallback:
```typescript
function calculateContainerSize(sprite: Sprite): { width: number; height: number } {
  const bounds = sprite.getBounds()
  const spriteWidth = bounds.width || sprite.texture.width
  const spriteHeight = bounds.height || sprite.texture.height
  
  if (spriteWidth <= 0 || spriteHeight <= 0) {
    // Fallback to texture dimensions
    return {
      width: sprite.texture.width + 8,
      height: sprite.texture.height + 8,
    }
  }
  // ... rest of calculation
}
```

---

### 4. Async Cleanup in Animation Loop ⚠️

**Location**: `web/src/pixi/topScene/animation/domDeathAnimation.ts:104-136`

**Problem**: The `animateDomDeath` function performs synchronous cleanup, but `app.destroy(true)` is actually async in newer PixiJS versions. This can cause issues if cleanup happens during active rendering.

**Current Code**:
```typescript
deathAnim.app.destroy(true)  // This may be async
```

**Fix**: Make cleanup async and handle it properly, or ensure it's called outside the animation loop.

---

### 5. Missing Error Handling ⚠️

**Location**: `web/src/pixi/topScene/animation/domDeathAnimation.ts:40-98`

**Problem**: The `createDomDeathAnimation` function has no error handling. If PixiJS app initialization fails, it will throw an unhandled error.

**Fix**: Add try-catch blocks around async operations:
```typescript
export async function createDomDeathAnimation(
  enemySprite: Sprite,
): Promise<DomDeathAnimation | null> {
  try {
    // ... existing code
  } catch (error) {
    console.error('Failed to create death animation:', error)
    return null
  }
}
```

---

## Recommended Fixes Priority

1. **HIGH**: Remove test death animation from `main.ts`
2. **HIGH**: Fix PixiJS app cleanup order (remove canvas before destroying app)
3. **MEDIUM**: Add error handling to `createDomDeathAnimation`
4. **MEDIUM**: Add validation to `calculateContainerSize`
5. **LOW**: Make cleanup properly async if needed

---

## Additional Observations

- The death animation system creates a new PixiJS Application for each dying enemy. This is fine for small numbers, but could be optimized if many enemies die simultaneously.
- The container uses `transform: translate(-50%, -50%)` to center on the position, which is good.
- The z-index of 10000 should ensure it appears above game elements.
