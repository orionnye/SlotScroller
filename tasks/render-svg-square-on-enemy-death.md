# Render SVG Square on Enemy Death

**Status**: ✅ COMPLETED  
**Epic**: SVG Death Animation - Incremental Implementation (Step 3)  
**Goal**: Create a simple SVG square that appears when an enemy dies, replacing the complex texture extraction with a basic shape.

## Overview

This step integrates SVG creation into the actual game flow. When an enemy dies, we'll create a simple green SVG square at the enemy's position instead of using the complex texture extraction system. This verifies that:
- SVG elements can be created at the correct viewport position
- Coordinate conversion from PixiJS to viewport works
- SVG appears when enemy dies
- SVG is properly tracked in the death animations array

## Detailed Requirements

### Create SVG death animation type
- Given new type is needed, should create `SvgDeathAnimation` type in new file `web/src/pixi/topScene/animation/svgDeathAnimation.ts`
- Given type exists, should include:
  - `element: SVGSVGElement`
  - `velocityY: number` (initialized to 0, will be used in Step 4)
  - `rotation: number` (initialized to 0, will be used in Step 4)
  - `translateY: number` (initialized to 0, will be used in Step 4)
  - `initialTop: number` (viewport Y position)
  - `initialLeft: number` (viewport X position)

### Create SVG square factory function
- Given factory function is needed, should create `createSvgDeathSquare` function in `svgDeathAnimation.ts`
- Given factory function is called, should accept parameters:
  - `enemySprite: Sprite`
  - `sourceCanvas: HTMLCanvasElement`
- Given factory function is called, should get enemy sprite's global position: `enemySprite.getGlobalPosition()`
- Given factory function is called, should convert canvas coordinates to viewport: `sourceCanvas.getBoundingClientRect()`
- Given factory function is called, should calculate viewport position:
  - `viewportX = canvasRect.left + globalPos.x`
  - `viewportY = canvasRect.top + globalPos.y`
- Given factory function is called, should create SVG element: `document.createElementNS('http://www.w3.org/2000/svg', 'svg')`
- Given SVG element is created, should set attributes:
  - `width: '40'`
  - `height: '36'`
  - `viewBox: '0 0 40 36'`
- Given SVG element is created, should set style properties:
  - `position: 'fixed'`
  - `left: \`${viewportX}px\``
  - `top: \`${viewportY}px\``
  - `width: '40px'`
  - `height: '36px'`
  - `zIndex: '10000'`
  - `pointerEvents: 'none'`
  - `transformOrigin: 'center center'`
- Given SVG element is created, should create rounded rectangle: `document.createElementNS('http://www.w3.org/2000/svg', 'rect')`
- Given rectangle is created, should set attributes:
  - `x: '0'`
  - `y: '0'`
  - `width: '40'`
  - `height: '36'`
  - `rx: '8'`
  - `fill: '#22c55e'` (green, matching slime blob)
- Given rectangle is created, should append to SVG element
- Given SVG element is complete, should append to `document.body`
- Given factory function returns, should return `SvgDeathAnimation` object

### Update dealDamageToEnemy to create SVG square
- Given `enemyCombat.ts` has `dealDamageToEnemy` function, should import: `import { createSvgDeathSquare } from '../animation/svgDeathAnimation'`
- Given `enemyCombat.ts` has `dealDamageToEnemy` function, should import type: `import type { SvgDeathAnimation } from '../animation/svgDeathAnimation'`
- Given `enemyCombat.ts` has `dealDamageToEnemy` function, should change `deathAnimations` parameter type from `CssDeathAnimation[]` to `SvgDeathAnimation[]`
- Given enemy HP reaches 0, should call `createSvgDeathSquare(actualEnemy.sprite, app.canvas)`
- Given SVG square is created, should push result to `deathAnimations` array
- Given SVG square is created, should keep existing behavior: hide sprite and set `isDying = true`

### Update mountTopScene to use SVG type
- Given `mountTopScene.ts` tracks death animations, should change type from `CssDeathAnimation[]` to `SvgDeathAnimation[]`
- Given `mountTopScene.ts` imports type, should change import: `import type { SvgDeathAnimation } from './animation/svgDeathAnimation'`
- Given `mountTopScene.ts` destroy function exists, should keep cleanup logic (iterate over `deathAnimations` and remove elements)

### Update tickHandler (optional, for Step 4 preparation)
- Given `tickHandler.ts` will need to animate SVG deaths in Step 4, should keep `deathAnimations` parameter but type will change later
- Given `tickHandler.ts` exists, should not call animation yet (Step 4 will add this)

## Implementation Example

### svgDeathAnimation.ts
```typescript
export type SvgDeathAnimation = {
  element: SVGSVGElement
  velocityY: number
  rotation: number
  translateY: number
  initialTop: number
  initialLeft: number
}

export function createSvgDeathSquare(
  enemySprite: Sprite,
  sourceCanvas: HTMLCanvasElement,
): SvgDeathAnimation {
  // Get enemy sprite's global position (relative to PixiJS canvas)
  const globalPos = enemySprite.getGlobalPosition()
  
  // Convert canvas coordinates to viewport coordinates
  const canvasRect = sourceCanvas.getBoundingClientRect()
  const viewportX = canvasRect.left + globalPos.x
  const viewportY = canvasRect.top + globalPos.y
  
  // Create SVG element
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  svg.setAttribute('width', '40')
  svg.setAttribute('height', '36')
  svg.setAttribute('viewBox', '0 0 40 36')
  
  svg.style.position = 'fixed'
  svg.style.left = `${viewportX}px`
  svg.style.top = `${viewportY}px`
  svg.style.width = '40px'
  svg.style.height = '36px'
  svg.style.zIndex = '10000'
  svg.style.pointerEvents = 'none'
  svg.style.transformOrigin = 'center center'
  
  // Create rounded rectangle
  const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
  rect.setAttribute('x', '0')
  rect.setAttribute('y', '0')
  rect.setAttribute('width', '40')
  rect.setAttribute('height', '36')
  rect.setAttribute('rx', '8')
  rect.setAttribute('fill', '#22c55e')
  svg.appendChild(rect)
  
  // Append to document body
  document.body.appendChild(svg)
  
  return {
    element: svg,
    velocityY: 0,
    rotation: 0,
    translateY: 0,
    initialTop: viewportY,
    initialLeft: viewportX,
  }
}
```

### enemyCombat.ts changes
```typescript
// Change import
import type { SvgDeathAnimation } from '../animation/svgDeathAnimation'
import { createSvgDeathSquare } from '../animation/svgDeathAnimation'

// Change parameter type
export function dealDamageToEnemy(
  // ... other parameters ...
  deathAnimations: SvgDeathAnimation[],  // Changed from CssDeathAnimation[]
  app: Application,
): boolean {
  // ... existing code ...
  
  if (actualEnemy.hp <= 0) {
    actualEnemy.sprite.visible = false
    actualEnemy.isDying = true
    
    // Create SVG square instead of CSS animation
    const svgDeath = createSvgDeathSquare(actualEnemy.sprite, app.canvas)
    deathAnimations.push(svgDeath)
    
    return true
  }
  
  return false
}
```

## Testing

### Manual Testing
- Given enemy is killed (hero attacks), should see green SVG square appear at enemy position
- Given SVG square appears, should be positioned correctly (matches enemy location)
- Given SVG square appears, should be visible on screen
- Given SVG square appears, should remain static (no animation yet - that's Step 4)
- Given multiple enemies die, should see multiple SVG squares appear

### Success Criteria
- ✅ When enemy dies, green SVG square appears at enemy position
- ✅ Square position matches enemy position accurately
- ✅ Square is visible on screen
- ✅ Square is tracked in `deathAnimations` array
- ✅ Multiple squares can appear (one per dead enemy)
- ✅ No console errors
- ✅ Square remains static (no falling/rotation yet)

## Notes

- This step creates the SVG but doesn't animate it yet
- The square will remain at the enemy's death position until Step 4 adds falling animation
- We're replacing the complex `createCssDeathAnimation` (texture extraction) with simple SVG creation
- The `SvgDeathAnimation` type includes animation properties (`velocityY`, `rotation`, `translateY`) that will be used in Step 4
- Coordinate conversion is critical - must convert from PixiJS canvas coordinates to viewport coordinates

## Cleanup

- SVG elements will be cleaned up in `mountTopScene.destroy()` (existing cleanup logic)
- No animation cleanup needed yet (Step 4 will add animation that needs cleanup)
