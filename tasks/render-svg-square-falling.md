# Render SVG Square Falling Across Page

**Status**: ✅ COMPLETED  
**Epic**: SVG Death Animation - Incremental Implementation (Step 4)  
**Goal**: Add falling animation to the SVG square, making it fall down the screen with rotation, completing the death animation system.

## Overview

This is the final step that brings everything together. We'll add falling and rotation animation to the SVG squares that appear when enemies die. The squares will fall down the screen with gravity, rotate as they fall, and be removed when they go off-screen.

## Detailed Requirements

### Create animation update function
- Given animation function is needed, should create `animateSvgDeath` function in `svgDeathAnimation.ts`
- Given animation function is called, should accept parameters:
  - `deathAnim: SvgDeathAnimation`
  - `dt: number` (delta time in seconds)
- Given animation function is called, should apply gravity: `deathAnim.velocityY += 300 * dt`
- Given animation function is called, should update rotation: `deathAnim.rotation += 2 * dt`
- Given animation function is called, should update translateY: `deathAnim.translateY += deathAnim.velocityY * dt`
- Given animation function is called, should calculate absolute position: `absoluteTop = deathAnim.initialTop + deathAnim.translateY`
- Given animation function is called, should update CSS transform: `deathAnim.element.style.transform = \`translateY(${deathAnim.translateY}px) rotate(${deathAnim.rotation}rad)\``
- Given animation function is called, should check if off-screen: `absoluteTop > window.innerHeight + 100`
- Given animation function is called, should return `true` if animation is complete (off-screen), `false` otherwise

### Create batch animation function
- Given batch function is needed, should create `animateSvgDeaths` function in new file `svgDeathAnimationAnimation.ts`
- Given batch function is called, should accept parameters:
  - `deathAnimations: SvgDeathAnimation[]`
  - `dt: number`
- Given batch function is called, should iterate over copy of array: `const animations = [...deathAnimations]`
- Given batch function is called, should call `animateSvgDeath` for each animation
- Given batch function is called, should check if animation is complete (when `animateSvgDeath` returns `true`)
- Given animation is complete, should remove from array: `deathAnimations.splice(index, 1)`
- Given animation is complete, should remove DOM element: `deathAnim.element.parentNode.removeChild(deathAnim.element)`
- Given batch function is called, should handle cleanup gracefully (check if element exists before removing)

### Update tickHandler to animate SVG deaths
- Given `tickHandler.ts` has `createTickHandler` function, should import: `import { animateSvgDeaths } from './svgDeathAnimationAnimation'`
- Given `tickHandler.ts` tick function runs, should call `animateSvgDeaths(deathAnimations, dt)` after calculating `dt`
- Given `tickHandler.ts` tick function runs, should call `animateSvgDeaths` even when `state.isPaused` is true (death animations should continue during gun fire)
- Given `tickHandler.ts` tick function runs, should call `animateSvgDeaths` before the pause check

## Implementation Example

### svgDeathAnimation.ts additions
```typescript
export function animateSvgDeath(
  deathAnim: SvgDeathAnimation,
  dt: number,
): boolean {
  // Apply gravity acceleration
  deathAnim.velocityY += 300 * dt
  
  // Update rotation
  deathAnim.rotation += 2 * dt
  
  // Calculate new translateY
  deathAnim.translateY += deathAnim.velocityY * dt
  
  // Calculate absolute position for off-screen check
  const absoluteTop = deathAnim.initialTop + deathAnim.translateY
  
  // Update transform with translateY and rotate (keep top/left fixed)
  deathAnim.element.style.transform = `translateY(${deathAnim.translateY}px) rotate(${deathAnim.rotation}rad)`
  
  // Check if off-screen (below viewport + 100px buffer)
  if (absoluteTop > window.innerHeight + 100) {
    return true // Animation complete
  }
  
  return false // Animation still running
}
```

### svgDeathAnimationAnimation.ts (new file)
```typescript
import type { SvgDeathAnimation } from './svgDeathAnimation'
import { animateSvgDeath } from './svgDeathAnimation'

export function animateSvgDeaths(
  deathAnimations: SvgDeathAnimation[],
  dt: number,
): void {
  // Iterate over copy of array to avoid modification during iteration
  const animations = [...deathAnimations]
  
  for (const deathAnim of animations) {
    const isComplete = animateSvgDeath(deathAnim, dt)
    
    if (isComplete) {
      // Remove from tracking array
      const index = deathAnimations.indexOf(deathAnim)
      if (index !== -1) {
        deathAnimations.splice(index, 1)
      }
      
      // Remove DOM element from document.body
      if (deathAnim.element.parentNode) {
        deathAnim.element.parentNode.removeChild(deathAnim.element)
      }
    }
  }
}
```

### tickHandler.ts changes
```typescript
import { animateSvgDeaths } from './svgDeathAnimationAnimation'

export function createTickHandler(
  // ... parameters ...
  deathAnimations?: SvgDeathAnimation[],
) {
  return (time: { deltaTime: number }) => {
    const dt = time.deltaTime / 60

    // Update SVG death animations (continue even when paused)
    if (deathAnimations) {
      animateSvgDeaths(deathAnimations, dt)
    }

    // Skip all other updates if paused (during gun fire)
    if (state.isPaused) return
    
    // ... rest of tick handler ...
  }
}
```

## Testing

### Manual Testing
- Given enemy is killed, should see green SVG square appear
- Given SVG square appears, should immediately start falling down the screen
- Given SVG square falls, should rotate as it falls
- Given SVG square falls, should accelerate due to gravity
- Given SVG square falls, should disappear when it goes off-screen
- Given multiple enemies die, should see multiple squares falling independently

### Success Criteria
- ✅ SVG square falls down the screen when enemy dies
- ✅ Square rotates while falling
- ✅ Square accelerates due to gravity (gets faster as it falls)
- ✅ Square falls past bottom of viewport
- ✅ Square is removed when off-screen
- ✅ Animation is smooth (60fps)
- ✅ Multiple squares can fall simultaneously
- ✅ Animation continues even when game is paused (during gun fire)
- ✅ No console errors
- ✅ No memory leaks (elements are properly cleaned up)

## Animation Details

### Gravity
- Acceleration: `300 * dt` pixels per second squared
- This means velocity increases by 300 pixels/second every second
- At 60fps, velocity increases by `300 * (1/60) = 5` pixels per frame

### Rotation
- Speed: `2 * dt` radians per second
- At 60fps, rotation increases by `2 * (1/60) ≈ 0.033` radians per frame
- This equals approximately `1.9` degrees per frame, or `114` degrees per second

### Off-screen Detection
- Element is removed when `absoluteTop > window.innerHeight + 100`
- The 100px buffer ensures the element is fully off-screen before removal
- Uses `initialTop + translateY` to calculate absolute position

## Notes

- The animation uses CSS transforms (`translateY` and `rotate`) for smooth hardware-accelerated animation
- `initialTop` and `initialLeft` remain fixed - only `translateY` changes in the transform
- This approach avoids recalculating viewport positions each frame
- The animation continues even when `state.isPaused` is true, so death animations play during gun fire
- Multiple death animations can run simultaneously without interfering with each other

## Performance Considerations

- CSS transforms are hardware-accelerated, so performance should be excellent
- Array iteration uses a copy to avoid modification during iteration issues
- Elements are removed immediately when off-screen to prevent memory leaks
- Single SVG element per death animation is lightweight
