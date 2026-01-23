# Phase 4: Cleanup and Spawn Location Fix

**Status**: ✅ COMPLETED  
**Epic**: Refactor Enemy Rendering System  
**Goal**: Clean up deprecated code, update tests, and fix SVG death animation spawn location to appear one enemy height higher.

## Overview

This phase completes the enemy rendering refactor by:
1. Removing or deprecating the old `createEnemyTexture()` function
2. Updating tests to use `SlimeBlobEnemy` instead
3. Fixing SVG death animation spawn location (currently spawns directly beneath enemy, should be one enemy height higher)

## Problem Statement

1. **Deprecated Function**: `createEnemyTexture()` is no longer used in production code but still exists and is used in tests. It should be removed or deprecated.
2. **Outdated Tests**: Tests still use `createEnemyTexture()` instead of the new `SlimeBlobEnemy` class.
3. **Spawn Location**: SVG death animations currently spawn directly beneath the enemy sprite, but should spawn one enemy height higher to better align with the visual position.

## Detailed Requirements

### Step 1: Fix SVG Spawn Location

#### Update viewportY calculation
- Given SVG death animation spawns beneath enemy, should update `createSvgDeathSquare()` in `web/src/pixi/topScene/animation/svgDeathAnimation.ts`
- Given function is updated, should adjust `viewportY` calculation to move SVG one enemy height higher
- Given calculation is updated, should:
  1. Get enemy height: `const enemyHeight = enemyUnit?.height ?? enemySprite.height`
  2. Adjust viewportY: `const viewportY = canvasRect.top + globalPos.y - enemyHeight`
  3. This moves the SVG up by one enemy height, making it appear at the enemy's visual position

#### Verify positioning
- Given spawn location is fixed, should verify SVG appears at correct position
- Given positioning is correct, should ensure SVG aligns with enemy sprite visually
- Given alignment is correct, should ensure animation still falls correctly

### Step 2: Update Tests

#### Update enemy.browser.test.ts
- Given tests exist, should update `web/src/pixi/topScene/textures/enemy.browser.test.ts`
- Given tests are updated, should:
  - Change test suite name from `'createEnemyTexture'` to `'SlimeBlobEnemy'`
  - Import `SlimeBlobEnemy` instead of `createEnemyTexture`
  - Update all test cases to use `SlimeBlobEnemy` class:
    - Create instance: `const enemyUnit = new SlimeBlobEnemy(seed)`
    - Generate texture: `const texture = enemyUnit.renderToPixi(setup.app)`
  - Update test descriptions to reflect new class usage
  - Keep same test logic (same seed produces same output, etc.)

#### Add renderToSvg tests
- Given tests are updated, should add new test cases for `renderToSvg()` method:
  - Test that `renderToSvg()` returns valid SVG element
  - Test that SVG has correct dimensions
  - Test that SVG matches PixiJS rendering (visual comparison or structure comparison)
  - Test that same seed produces same SVG

#### Update testDeathAnimation.ts (if needed)
- Given `testDeathAnimation.ts` uses `createEnemyTexture`, should update it to use `SlimeBlobEnemy`
- Given file is updated, should:
  - Import `SlimeBlobEnemy` instead of `createEnemyTexture`
  - Create `SlimeBlobEnemy` instance and call `renderToPixi()`
  - Verify functionality still works

### Step 3: Remove or Deprecate createEnemyTexture

#### Check for remaining usages
- Given cleanup is needed, should search codebase for all usages of `createEnemyTexture`
- Given usages are found, should:
  - Update production code to use `SlimeBlobEnemy` (should already be done)
  - Update test code to use `SlimeBlobEnemy` (Step 2)
  - Verify no other code depends on `createEnemyTexture`

#### Remove function
- Given all usages are updated, should remove `createEnemyTexture()` function from `web/src/pixi/topScene/textures/enemy.ts`
- Given function is removed, should verify:
  - No import errors
  - All tests pass
  - TypeScript compilation succeeds

#### Alternative: Deprecate function
- If removal is too risky, should mark function as deprecated:
  - Add `@deprecated` JSDoc comment
  - Add warning message in function body
  - Document migration path to `SlimeBlobEnemy`

## Implementation Details

### SVG Spawn Location Fix

**Current Implementation:**
```typescript
const viewportY = canvasRect.top + globalPos.y
```

**Updated Implementation:**
```typescript
const enemyHeight = enemyUnit?.height ?? enemySprite.height
const viewportY = canvasRect.top + globalPos.y - enemyHeight
```

This moves the SVG up by one enemy height, so it appears at the enemy's visual center rather than beneath it.

### Test Updates

**Before:**
```typescript
describe('createEnemyTexture', () => {
  test('given app and seed, should return a Texture', () => {
    const texture = createEnemyTexture(setup.app, 1)
    // ...
  })
})
```

**After:**
```typescript
describe('SlimeBlobEnemy', () => {
  test('given app and seed, should return a Texture from renderToPixi', () => {
    const enemyUnit = new SlimeBlobEnemy(1)
    const texture = enemyUnit.renderToPixi(setup.app)
    // ...
  })
  
  test('given seed, should return valid SVG from renderToSvg', () => {
    const enemyUnit = new SlimeBlobEnemy(1)
    const svg = enemyUnit.renderToSvg()
    expect(svg).toBeDefined()
    expect(svg.tagName).toBe('svg')
    // ...
  })
})
```

## Files to Modify

1. `web/src/pixi/topScene/animation/svgDeathAnimation.ts` - Fix spawn location
2. `web/src/pixi/topScene/textures/enemy.browser.test.ts` - Update tests to use `SlimeBlobEnemy`
3. `web/src/pixi/topScene/testDeathAnimation.ts` - Update to use `SlimeBlobEnemy` (if needed)
4. `web/src/pixi/topScene/textures/enemy.ts` - Remove or deprecate `createEnemyTexture()`

## Success Criteria

- ✅ SVG death animations spawn one enemy height higher (aligned with enemy visual position)
- ✅ All tests updated to use `SlimeBlobEnemy` class
- ✅ Tests verify both `renderToPixi()` and `renderToSvg()` methods
- ✅ `createEnemyTexture()` function removed or deprecated
- ✅ No remaining usages of `createEnemyTexture()` in production code
- ✅ All tests pass
- ✅ TypeScript compilation succeeds with no errors
- ✅ Code follows project conventions and passes linter checks

## Testing Considerations

### Visual Verification
- Verify SVG death animation appears at correct position (one enemy height higher)
- Verify animation still falls and rotates correctly
- Verify alignment looks natural and matches enemy sprite position

### Functional Testing
- Verify all existing tests pass with new `SlimeBlobEnemy` implementation
- Verify new `renderToSvg()` tests pass
- Verify no regressions in enemy spawning or death animations

### Edge Cases
- Test spawn location with different enemy sizes (if applicable)
- Test spawn location at screen edges
- Test spawn location with different canvas positions

## Potential Issues and Solutions

### Issue: SVG spawn location calculation is incorrect
**Solution**: Verify enemy height calculation and coordinate system. Ensure we're subtracting the correct value.

### Issue: Tests fail after migration
**Solution**: Ensure test setup creates `SlimeBlobEnemy` instances correctly and uses `renderToPixi()` method.

### Issue: Other code depends on `createEnemyTexture`
**Solution**: Search codebase thoroughly and update all dependencies before removing function.

### Issue: Visual alignment looks off
**Solution**: May need to adjust offset (e.g., `-enemyHeight / 2` instead of `-enemyHeight`) based on visual testing.

## Benefits

1. **Accurate Spawn Position**: Death animations appear at the correct visual position
2. **Clean Codebase**: Removed deprecated code reduces maintenance burden
3. **Better Tests**: Tests now verify the actual implementation (`SlimeBlobEnemy`) instead of deprecated function
4. **Complete Migration**: Full transition from old system to new unit-based system

## Next Steps

After completing Phase 4:
- The enemy rendering refactor is complete
- All code uses the new `SlimeBlobEnemy` system
- Death animations are accurate and properly positioned
- The `color` property can be removed if desired (no longer needed)
