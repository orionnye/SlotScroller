# Render SVG Enemy with Rotation

**Status**: ✅ COMPLETED  
**Epic**: SVG Death Animation - Incremental Implementation (Step 2)  
**Goal**: Add rotation animation to the static SVG enemy to verify CSS transform functionality works correctly.

## Overview

This step builds on Step 1 by adding a continuous rotation animation to the static SVG enemy. This verifies that:
- CSS transforms work on SVG elements
- Rotation animations are smooth
- Transform origin is correctly set
- Animation loop doesn't cause performance issues

## Detailed Requirements

### Update test function to add rotation
- Given `testSvgEnemy.ts` exists from Step 1, should modify `testSvgEnemyRender` function to add rotation animation
- Given rotation animation is added, should use `requestAnimationFrame` loop for smooth animation
- Given rotation animation exists, should track rotation angle: `let rotation = 0`
- Given rotation animation exists, should increment rotation each frame: `rotation += 0.02` (radians per frame)
- Given rotation animation exists, should update SVG transform: `svg.style.transform = \`rotate(${rotation}rad)\``
- Given rotation animation exists, should set `transformOrigin: 'center center'` (already set in Step 1)
- Given rotation animation exists, should continue indefinitely (for testing purposes)
- Given rotation animation exists, should call `requestAnimationFrame` recursively to create animation loop

### Animation loop structure
- Given animation loop is needed, should create `animate` function inside `testSvgEnemyRender`
- Given animate function exists, should update rotation angle
- Given animate function exists, should apply transform to SVG element
- Given animate function exists, should call `requestAnimationFrame(animate)` to continue loop
- Given cleanup function is called, should stop animation loop (store animation frame ID and cancel it)

### Cleanup enhancement
- Given cleanup function exists, should store animation frame ID: `let animationFrameId: number | null = null`
- Given animation frame ID is stored, should cancel animation on cleanup: `if (animationFrameId !== null) cancelAnimationFrame(animationFrameId)`
- Given cleanup function is called, should remove SVG element from DOM (existing behavior)

## Implementation Example

```typescript
export function testSvgEnemyRender(): () => void {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  svg.setAttribute('width', '40')
  svg.setAttribute('height', '36')
  svg.setAttribute('viewBox', '0 0 40 36')
  
  svg.style.position = 'fixed'
  svg.style.left = '100px'
  svg.style.top = '100px'
  svg.style.width = '40px'
  svg.style.height = '36px'
  svg.style.zIndex = '10000'
  svg.style.pointerEvents = 'none'
  svg.style.transformOrigin = 'center center'
  
  const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
  rect.setAttribute('x', '0')
  rect.setAttribute('y', '0')
  rect.setAttribute('width', '40')
  rect.setAttribute('height', '36')
  rect.setAttribute('rx', '8')
  rect.setAttribute('fill', '#22c55e')
  svg.appendChild(rect)
  
  // Add eyes
  const eye1 = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
  eye1.setAttribute('cx', '14')
  eye1.setAttribute('cy', '12')
  eye1.setAttribute('r', '2')
  eye1.setAttribute('fill', '#000000')
  eye1.setAttribute('fill-opacity', '0.8')
  svg.appendChild(eye1)
  
  const eye2 = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
  eye2.setAttribute('cx', '26')
  eye2.setAttribute('cy', '12')
  eye2.setAttribute('r', '2')
  eye2.setAttribute('fill', '#000000')
  eye2.setAttribute('fill-opacity', '0.8')
  svg.appendChild(eye2)
  
  document.body.appendChild(svg)
  
  // Rotation animation
  let rotation = 0
  let animationFrameId: number | null = null
  
  const animate = () => {
    rotation += 0.02 // Increment rotation (radians per frame)
    svg.style.transform = `rotate(${rotation}rad)`
    animationFrameId = requestAnimationFrame(animate)
  }
  
  // Start animation
  animationFrameId = requestAnimationFrame(animate)
  
  return () => {
    // Stop animation
    if (animationFrameId !== null) {
      cancelAnimationFrame(animationFrameId)
      animationFrameId = null
    }
    // Remove SVG element
    if (svg.parentNode) {
      svg.parentNode.removeChild(svg)
    }
  }
}
```

## Testing

### Manual Testing
- Given test function is called, should see SVG enemy rotating continuously
- Given rotation is visible, should rotate smoothly without jitter
- Given rotation is visible, should rotate around center point (transform origin)
- Given cleanup function is called, should stop rotation and remove element

### Success Criteria
- ✅ SVG enemy rotates continuously
- ✅ Rotation is smooth (60fps via requestAnimationFrame)
- ✅ Rotation is centered (transform origin works correctly)
- ✅ No performance issues (check FPS in DevTools)
- ✅ Cleanup stops animation and removes element
- ✅ No console errors

## Notes

- Rotation speed: `0.02` radians per frame ≈ 1.15 degrees per frame ≈ 69 degrees per second at 60fps
- This is a test/verification step - rotation will be continuous and indefinite
- Next step (Step 3) will create SVG on enemy death (no animation yet)
- Step 4 will add falling animation with rotation
- The rotation speed can be adjusted if needed for testing

## Performance Considerations

- `requestAnimationFrame` automatically syncs with display refresh rate (typically 60fps)
- Single SVG element with simple transform should have minimal performance impact
- If performance issues occur, consider using CSS animations instead (but requestAnimationFrame gives more control)
