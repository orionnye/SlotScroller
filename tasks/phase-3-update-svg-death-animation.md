# Phase 3: Update SVG Death Animation

**Status**: ✅ COMPLETED  
**Epic**: Refactor Enemy Rendering System  
**Goal**: Update SVG death animations to use `enemyUnit.renderToSvg()` instead of manually creating SVG elements, enabling accurate visual recreation of enemy appearance.

## Overview

This phase updates the SVG death animation system to leverage the `enemyUnit.renderToSvg()` method created in Phase 1. This ensures death animations accurately match the enemy's visual appearance (color, shape, size, bulge, highlight, eyes, outline) instead of using a simplified approximation.

## Problem Statement

Currently, `createSvgDeathSquare()` manually creates a simplified SVG representation using only the enemy's color and sprite dimensions. This doesn't match the actual enemy appearance (missing bulge, highlight, accurate proportions). By using `enemyUnit.renderToSvg()`, we get a pixel-perfect SVG representation that matches the PixiJS rendering exactly.

## Detailed Requirements

### Step 1: Update createSvgDeathSquare Function

#### Update function signature
- Given `BaseEnemyUnit` exists, should update `createSvgDeathSquare()` in `web/src/pixi/topScene/animation/svgDeathAnimation.ts`
- Given function is updated, should change parameter from `enemyColor?: number` to `enemyUnit?: BaseEnemyUnit`
- Given signature changes, should import `BaseEnemyUnit` type: `import type { BaseEnemyUnit } from '../units'`

#### Implement enemyUnit path
- Given `enemyUnit` is provided, should:
  1. Call `enemyUnit.renderToSvg()` to get the complete SVG element
  2. Get enemy sprite's global position: `const globalPos = enemySprite.getGlobalPosition()`
  3. Convert canvas coordinates to viewport coordinates:
     - `const canvasRect = sourceCanvas.getBoundingClientRect()`
     - `const viewportX = canvasRect.left + globalPos.x`
     - `const viewportY = canvasRect.top + globalPos.y`
  4. Position the SVG element:
     - `svg.style.position = 'fixed'`
     - `svg.style.left = `${viewportX}px``
     - `svg.style.top = `${viewportY}px``
     - `svg.style.zIndex = '10000'`
     - `svg.style.pointerEvents = 'none'`
     - `svg.style.transformOrigin = 'center center'`
  5. Append to document body: `document.body.appendChild(svg)`
  6. Return `SvgDeathAnimation` with the positioned SVG element

#### Implement fallback path
- Given `enemyUnit` is not provided, should fall back to existing simple green rounded rectangle logic
- Given fallback is used, should:
  - Keep existing `getEnemyColor()` function for backward compatibility
  - Use existing manual SVG creation logic (rounded rectangle with eyes)
  - This ensures backward compatibility if `enemyUnit` is missing

#### Remove unused code (optional)
- Given `enemyUnit` path is implemented, should consider removing manual SVG creation code
- Given code is removed, should ensure fallback path still works
- **Note**: Keep fallback for now to maintain backward compatibility

### Step 2: Update dealDamageToEnemy Function

#### Update function call
- Given `createSvgDeathSquare` signature changes, should update `dealDamageToEnemy()` in `web/src/pixi/topScene/combat/enemyCombat.ts`
- Given function is updated, should change call from:
  - `createSvgDeathSquare(actualEnemy.sprite, app.canvas, actualEnemy.color)`
- To:
  - `createSvgDeathSquare(actualEnemy.sprite, app.canvas, actualEnemy.enemyUnit)`

#### Verify enemyUnit availability
- Given `enemyUnit` is passed, should ensure it's available from `CharacterSprite`
- Given `enemyUnit` might be undefined, should rely on `createSvgDeathSquare` fallback logic
- Given TypeScript types are correct, should handle optional property correctly

## Implementation Details

### Current createSvgDeathSquare Implementation

```typescript
export function createSvgDeathSquare(
  enemySprite: Sprite,
  sourceCanvas: HTMLCanvasElement,
  enemyColor?: number,
): SvgDeathAnimation {
  // Get position
  const globalPos = enemySprite.getGlobalPosition()
  const canvasRect = sourceCanvas.getBoundingClientRect()
  const viewportX = canvasRect.left + globalPos.x
  const viewportY = canvasRect.top + globalPos.y
  
  // Extract sprite properties
  const spriteWidth = enemySprite.width
  const spriteHeight = enemySprite.height
  
  // Get color
  const fillColor = getEnemyColor(enemyColor)
  
  // Manually create simplified SVG (rounded rectangle + eyes)
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  // ... manual SVG creation ...
  
  return { element: svg, ... }
}
```

### Updated createSvgDeathSquare Implementation

```typescript
export function createSvgDeathSquare(
  enemySprite: Sprite,
  sourceCanvas: HTMLCanvasElement,
  enemyUnit?: BaseEnemyUnit,
): SvgDeathAnimation {
  // Get position
  const globalPos = enemySprite.getGlobalPosition()
  const canvasRect = sourceCanvas.getBoundingClientRect()
  const viewportX = canvasRect.left + globalPos.x
  const viewportY = canvasRect.top + globalPos.y
  
  let svg: SVGSVGElement
  
  if (enemyUnit) {
    // Use enemyUnit.renderToSvg() for accurate representation
    svg = enemyUnit.renderToSvg()
  } else {
    // Fallback to simple green rounded rectangle
    const spriteWidth = enemySprite.width
    const spriteHeight = enemySprite.height
    const fillColor = '#22c55e' // Default green
    
    svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    // ... existing manual SVG creation ...
  }
  
  // Position SVG element
  svg.style.position = 'fixed'
  svg.style.left = `${viewportX}px`
  svg.style.top = `${viewportY}px`
  svg.style.zIndex = '10000'
  svg.style.pointerEvents = 'none'
  svg.style.transformOrigin = 'center center'
  
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

### Key Implementation Notes

#### SVG Element from renderToSvg()
- `enemyUnit.renderToSvg()` returns a complete SVG element with:
  - Correct viewBox (`0 0 40 36`)
  - All visual elements (body, bulge, highlight, eyes, outline)
  - Correct colors and opacities
- The SVG element is already fully constructed, we just need to position it

#### Positioning Logic
- The positioning logic remains the same (convert PixiJS coordinates to viewport)
- Both paths (enemyUnit and fallback) use the same positioning code
- SVG element dimensions are already set by `renderToSvg()`, but we may need to ensure they match sprite dimensions

#### Fallback Compatibility
- The fallback path ensures backward compatibility
- If `enemyUnit` is undefined (e.g., old enemies or test code), fallback creates simple green rectangle
- This is important for gradual migration and testing

## Migration Strategy

### Backward Compatibility

The fallback path ensures:
- Existing code that doesn't provide `enemyUnit` still works
- Test code can continue using simplified approach
- Gradual migration is possible

### Type Safety

- `enemyUnit` is optional (`enemyUnit?: BaseEnemyUnit`)
- TypeScript will enforce proper handling
- Fallback logic handles undefined case gracefully

## Testing Considerations

### Visual Verification
- Verify death animations match enemy appearance exactly
- Compare death animation with original enemy sprite
- Verify all visual features are present (bulge, highlight, eyes, outline)
- Verify colors match (green, blue, purple enemies)

### Functional Testing
- Verify death animations trigger correctly
- Verify animations fall and rotate correctly
- Verify animations are cleaned up after completion
- Verify fallback works when `enemyUnit` is undefined

### Edge Cases
- Test with enemies that have different seeds (different sizes, colors)
- Test with missing `enemyUnit` (fallback path)
- Test positioning with different canvas positions
- Test with enemies at screen edges

## Files to Modify

1. `web/src/pixi/topScene/animation/svgDeathAnimation.ts` - Update `createSvgDeathSquare()` signature and implementation
2. `web/src/pixi/topScene/combat/enemyCombat.ts` - Update `dealDamageToEnemy()` to pass `enemyUnit`

## Files That May Need Updates

- Any test files that call `createSvgDeathSquare()` directly (should still work with fallback)

## Success Criteria

- ✅ `createSvgDeathSquare()` accepts `enemyUnit?: BaseEnemyUnit` parameter
- ✅ When `enemyUnit` is provided, uses `enemyUnit.renderToSvg()` to get SVG element
- ✅ SVG element is positioned correctly using sprite's global position
- ✅ Death animations visually match enemy appearance exactly (color, shape, size, features)
- ✅ Fallback path works when `enemyUnit` is not provided
- ✅ `dealDamageToEnemy()` passes `actualEnemy.enemyUnit` to `createSvgDeathSquare()`
- ✅ All existing functionality preserved (animations work correctly)
- ✅ TypeScript compilation succeeds with no errors
- ✅ Code follows project conventions and passes linter checks

## Potential Issues and Solutions

### Issue: SVG dimensions don't match sprite dimensions
**Solution**: `renderToSvg()` creates SVG with fixed dimensions (40x36), which should match sprite dimensions. If mismatch occurs, we may need to scale the SVG or adjust positioning.

### Issue: SVG positioning is off
**Solution**: Ensure coordinate conversion logic is correct. The positioning code is the same as before, so it should work correctly.

### Issue: Fallback doesn't work
**Solution**: Keep existing manual SVG creation code as fallback. Test with undefined `enemyUnit` to verify.

### Issue: Performance concerns
**Solution**: `renderToSvg()` is called once per enemy death, which is infrequent. Performance impact should be minimal.

## Benefits

1. **Accurate Visual Representation**: Death animations now match enemy appearance exactly
2. **Single Source of Truth**: All enemy rendering logic is in `SlimeBlobEnemy`
3. **Maintainability**: Changes to enemy appearance automatically reflect in death animations
4. **Extensibility**: New enemy types can implement `BaseEnemyUnit` and get accurate death animations automatically

## Next Steps

After completing Phase 3:
- Phase 4 will remove `createEnemyTexture()` function and update tests
- The `color` property can be removed if desired (no longer needed for death animations)
