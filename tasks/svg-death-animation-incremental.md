# SVG Death Animation - Incremental Implementation

**Status**: ✅ COMPLETED  
**Goal**: Create a working SVG-based death animation system by building incrementally, starting with simple static rendering and progressing to full falling animation.

## Overview

This epic breaks down the death animation implementation into small, testable steps. Each step builds on the previous one, ensuring we can verify functionality at each stage before moving forward.

---

## Step 1: Render Static SVG Enemy

Create a simple test to render a static SVG representation of an enemy at a fixed position.

**Status**: ✅ COMPLETED  
**Task File**: `tasks/render-static-svg-enemy.md`

**Requirements**:
- Given test function exists, should create `testSvgEnemyRender` function in new file `web/src/pixi/topScene/testSvgEnemy.ts`
- Given test function is called, should create an SVG element with basic enemy shape (rounded rectangle or circle)
- Given SVG element is created, should set `position: fixed`
- Given SVG element is created, should set `left: 100px` and `top: 100px` (fixed test position)
- Given SVG element is created, should set `width: 40px` and `height: 36px` (enemy dimensions)
- Given SVG element is created, should set `zIndex: '10000'`
- Given SVG element is created, should append to `document.body`
- Given test function exists, should be callable from `main.ts` or console for manual testing
- Given SVG renders, should be visible on screen at fixed position

**Success Criteria**:
- SVG enemy shape is visible on screen at position (100, 100)
- No console errors
- Element can be inspected in DevTools

---

## Step 2: Render SVG Enemy with Rotation

Add rotation animation to the static SVG enemy to verify transform functionality.

**Status**: ✅ COMPLETED  
**Task File**: `tasks/render-svg-enemy-with-rotation.md`

**Requirements**:
- Given SVG enemy exists from Step 1, should add rotation animation
- Given rotation animation exists, should use `requestAnimationFrame` loop
- Given rotation animation runs, should update `transform: rotate()` CSS property
- Given rotation animation runs, should increment rotation angle: `rotation += 0.02` per frame
- Given rotation animation runs, should apply transform: `element.style.transform = \`rotate(${rotation}rad)\``
- Given rotation animation runs, should set `transformOrigin: 'center center'`
- Given rotation animation runs, should continue indefinitely (for testing)

**Success Criteria**:
- SVG enemy rotates continuously
- Rotation is smooth and centered
- No performance issues

---

## Step 3: Render SVG Square on Enemy Death

Create a simple SVG square that appears when an enemy dies, replacing the complex texture extraction.

**Status**: ✅ COMPLETED  
**Task File**: `tasks/render-svg-square-on-enemy-death.md`

**Requirements**:
- Given enemy dies in `dealDamageToEnemy`, should create simple SVG square element
- Given SVG square is created, should be created at enemy's viewport position
- Given SVG square is created, should use `position: fixed`
- Given SVG square is created, should calculate viewport position from enemy sprite: `getGlobalPosition()` + `getBoundingClientRect()`
- Given SVG square is created, should have dimensions: `width: 40px`, `height: 36px`
- Given SVG square is created, should have fill color: `#22c55e` (green, like slime blob)
- Given SVG square is created, should set `zIndex: '10000'`
- Given SVG square is created, should append to `document.body`
- Given SVG square is created, should track in `deathAnimations` array (simplified type)
- Given enemy dies, should hide original enemy sprite (keep existing behavior)

**Success Criteria**:
- When enemy is killed, green square appears at enemy position
- Square is visible on screen
- Square position matches enemy position
- No console errors

---

## Step 4: Render SVG Square Falling Across Page

Add falling animation to the SVG square, making it fall down the screen with rotation.

**Status**: ✅ COMPLETED  
**Task File**: `tasks/render-svg-square-falling.md`

**Requirements**:
- Given SVG square exists from Step 3, should add falling animation
- Given falling animation exists, should update position each frame in tick handler
- Given falling animation exists, should apply gravity: `velocityY += 300 * dt`
- Given falling animation exists, should update translateY: `translateY += velocityY * dt`
- Given falling animation exists, should update rotation: `rotation += 2 * dt`
- Given falling animation exists, should combine transforms: `translateY(${translateY}px) rotate(${rotation}rad)`
- Given falling animation exists, should keep initial `top` and `left` fixed, only use `translateY` in transform
- Given falling animation exists, should remove element when `translateY` exceeds `window.innerHeight + 100`
- Given falling animation exists, should update in `animateCssDeaths` function (or new `animateSvgDeaths`)
- Given animation completes, should remove DOM element and clean up from array

**Success Criteria**:
- Square falls down the screen when enemy dies
- Square rotates while falling
- Square falls past bottom of viewport
- Square is removed when off-screen
- Animation is smooth

---

## Implementation Notes

### SVG Element Structure

For Steps 1-2 (test):
```html
<svg style="position: fixed; left: 100px; top: 100px; width: 40px; height: 36px; z-index: 10000;">
  <rect x="0" y="0" width="40" height="36" rx="8" fill="#22c55e"/>
</svg>
```

For Steps 3-4 (production):
- Use same structure but with dynamic positioning
- Can add more complex shapes later (eyes, highlights, etc.)

### Type Definition

Simplified type for Steps 3-4:
```typescript
type SvgDeathAnimation = {
  element: SVGSVGElement
  velocityY: number
  rotation: number
  translateY: number
  initialTop: number
  initialLeft: number
}
```

### Integration Points

- Step 3: Modify `dealDamageToEnemy` to create SVG square instead of calling `createCssDeathAnimation`
- Step 4: Add animation update in `tickHandler` or create new `animateSvgDeaths` function

---

## Testing Strategy

Each step should be manually testable:
1. **Step 1**: Call test function, verify SVG appears
2. **Step 2**: Verify rotation animation
3. **Step 3**: Kill an enemy, verify square appears
4. **Step 4**: Kill an enemy, verify square falls and rotates
