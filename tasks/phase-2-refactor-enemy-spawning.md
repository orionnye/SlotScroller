# Phase 2: Refactor Enemy Spawning

**Status**: ✅ COMPLETED  
**Epic**: Refactor Enemy Rendering System  
**Goal**: Update enemy spawning to use the `SlimeBlobEnemy` class instead of directly calling `createEnemyTexture`, and store the enemy unit in `CharacterSprite` for use in death animations.

## Overview

This phase integrates the `SlimeBlobEnemy` class created in Phase 1 into the enemy spawning system. It updates:
1. `CharacterSprite` type to include optional `enemyUnit` property
2. `spawnEnemy()` function to create and use `SlimeBlobEnemy` instances
3. Removes duplicate color calculation logic (now handled by `SlimeBlobEnemy`)

## Problem Statement

Currently, `spawnEnemy()` calls `createEnemyTexture()` directly and manually recreates the color calculation. This duplicates logic and prevents the death animation system from accessing the full enemy rendering information. By using `SlimeBlobEnemy`, we centralize all rendering logic and enable accurate SVG death animations.

## Detailed Requirements

### Step 1: Update CharacterSprite Type

#### Add enemyUnit property
- Given `BaseEnemyUnit` interface exists, should update `CharacterSprite` type in `web/src/pixi/topScene/types.ts`
- Given type is updated, should add `enemyUnit?: BaseEnemyUnit` property
- Given property exists, should be optional (heroes don't have enemy units)
- Given property exists, should be placed after existing properties for logical grouping
- Given property exists, should include JSDoc comment explaining its purpose

#### Import BaseEnemyUnit type
- Given type is updated, should import `BaseEnemyUnit` from `'./units'` or `'./units/BaseEnemyUnit'`
- Given import exists, should use type-only import: `import type { BaseEnemyUnit } from './units'`

### Step 2: Update spawnEnemy Function

#### Update imports
- Given `spawnEnemy` needs refactoring, should update imports in `web/src/pixi/topScene/sprites/spawn.ts`
- Given imports are updated, should:
  - Remove `createSeededRng` import (no longer needed for color calculation)
  - Remove `createEnemyTexture` import from `'../textures/enemy'`
  - Add `SlimeBlobEnemy` import from `'../units'` or `'../units/SlimeBlobEnemy'`

#### Replace texture creation logic
- Given `spawnEnemy` function exists, should update the texture creation section
- Given function is updated, should:
  1. Keep seed generation: `const seed = rng.nextInt(1000)`
  2. Create `SlimeBlobEnemy` instance: `const enemyUnit = new SlimeBlobEnemy(seed)`
  3. Generate texture from unit: `const tex = enemyUnit.renderToPixi(app)`
  4. Remove old texture creation: `const tex = createEnemyTexture(app, seed)`
  5. Remove color recreation logic (no longer needed, color is in `enemyUnit.color`)

#### Update sprite creation
- Given texture is created from `enemyUnit`, should keep existing sprite creation logic:
  - `const s = new Sprite(tex)`
  - `s.anchor.set(0.5, 1)`
  - `s.x = x`
  - `s.y = groundY`
  - `s.scale.set(1)`
  - `s.alpha = 1`
  - `charactersLayer.addChild(s)`

#### Update enemies array push
- Given sprite is created, should update the `enemies.push()` call
- Given push is updated, should:
  - Keep all existing properties (sprite, speed, kind, walkPhase, etc.)
  - Add `enemyUnit: enemyUnit` property
  - Keep `color: bodyColor` property for backward compatibility (or remove if confident)
  - Note: `bodyColor` can be replaced with `enemyUnit.color` if removing the color property

#### Handle color property (backward compatibility)
- Given `enemyUnit` contains color, should decide on color property:
  - **Option A (Recommended)**: Keep `color` property for backward compatibility
    - Use `color: enemyUnit.color` instead of recreating it
  - **Option B**: Remove `color` property entirely
    - Update all code that uses `enemy.color` to use `enemy.enemyUnit?.color` instead
    - More breaking but cleaner long-term
- Given decision is made, should implement chosen option consistently

### Step 3: Verify Integration

#### Check for other usages
- Given `spawnEnemy` is updated, should search codebase for other uses of `createEnemyTexture`
- Given other usages exist, should note them for Phase 4 (cleanup)
- Given no other usages exist, should proceed with confidence

#### Verify type safety
- Given changes are made, should verify TypeScript compilation succeeds
- Given types are correct, should ensure `enemyUnit` is properly typed as `BaseEnemyUnit | undefined`
- Given optional property exists, should handle cases where `enemyUnit` might be undefined

## Implementation Details

### Current spawnEnemy Implementation

```typescript
export function spawnEnemy(
  x: number,
  app: Application,
  rng: Rng,
  groundY: number,
  charactersLayer: Container,
  enemies: CharacterSprite[],
): void {
  const seed = rng.nextInt(1000)
  const tex = createEnemyTexture(app, seed)
  
  // Recreate color from seed (same logic as createEnemyTexture)
  const rngForColor = createSeededRng(seed)
  const slimeColors = [0x22c55e, 0x3b82f6, 0x8b5cf6]
  const bodyColor = slimeColors[rngForColor.nextInt(slimeColors.length)]
  
  const s = new Sprite(tex)
  // ... sprite setup ...
  enemies.push({
    sprite: s,
    // ... other properties ...
    color: bodyColor,
  })
}
```

### Updated spawnEnemy Implementation

```typescript
export function spawnEnemy(
  x: number,
  app: Application,
  rng: Rng,
  groundY: number,
  charactersLayer: Container,
  enemies: CharacterSprite[],
): void {
  const seed = rng.nextInt(1000)
  const enemyUnit = new SlimeBlobEnemy(seed)
  const tex = enemyUnit.renderToPixi(app)
  
  const s = new Sprite(tex)
  // ... sprite setup ...
  enemies.push({
    sprite: s,
    // ... other properties ...
    enemyUnit: enemyUnit,
    color: enemyUnit.color, // For backward compatibility
  })
}
```

### CharacterSprite Type Update

```typescript
export type CharacterSprite = {
  sprite: Sprite
  speed: number
  kind: 'hero' | 'enemy'
  walkPhase: number
  attackCooldownMs?: number
  lastAttackMs?: number
  isAtAttackRange?: boolean
  hp?: number
  maxHp?: number
  isDying?: boolean
  deathVelocityY?: number
  deathRotation?: number
  color?: number // Enemy body color (for backward compatibility)
  enemyUnit?: BaseEnemyUnit // Enemy unit with full rendering capabilities
}
```

## Migration Strategy

### Backward Compatibility

The `color` property is kept for backward compatibility because:
- `dealDamageToEnemy` and `createSvgDeathSquare` may still reference `enemy.color`
- Phase 3 will update these to use `enemyUnit`, but keeping `color` ensures no breaking changes
- Can be removed in Phase 4 cleanup if desired

### Type Safety

- `enemyUnit` is optional (`enemyUnit?: BaseEnemyUnit`) because heroes don't have enemy units
- Code that accesses `enemyUnit` should check for existence: `if (enemy.enemyUnit) { ... }`
- TypeScript will enforce this at compile time

## Testing Considerations

### Functional Testing
- Verify enemies spawn correctly with new system
- Verify enemy appearance matches previous implementation
- Verify `enemyUnit` property is populated for enemies
- Verify `enemyUnit` is undefined for heroes (if applicable)

### Visual Verification
- Compare enemy appearance before and after refactor
- Verify same seed produces same visual output
- Verify all color variations (green, blue, purple) still work

### Type Safety Testing
- Verify TypeScript compilation succeeds
- Verify optional `enemyUnit` property is handled correctly
- Verify no type errors in dependent code

## Files to Modify

1. `web/src/pixi/topScene/types.ts` - Add `enemyUnit?: BaseEnemyUnit` to `CharacterSprite`
2. `web/src/pixi/topScene/sprites/spawn.ts` - Update `spawnEnemy()` to use `SlimeBlobEnemy`

## Files That May Need Updates (Phase 3)

These files will be updated in Phase 3, but should be checked now:
- `web/src/pixi/topScene/combat/enemyCombat.ts` - May reference `enemy.color`
- `web/src/pixi/topScene/animation/svgDeathAnimation.ts` - Currently uses `enemyColor?: number`

## Success Criteria

- ✅ `CharacterSprite` type includes `enemyUnit?: BaseEnemyUnit` property
- ✅ `spawnEnemy()` creates `SlimeBlobEnemy` instance instead of calling `createEnemyTexture()`
- ✅ `spawnEnemy()` uses `enemyUnit.renderToPixi(app)` to generate texture
- ✅ `spawnEnemy()` stores `enemyUnit` in `CharacterSprite` when pushing to enemies array
- ✅ Color property is maintained for backward compatibility (or removed if confident)
- ✅ All existing functionality preserved (enemies spawn correctly, appear correctly)
- ✅ TypeScript compilation succeeds with no errors
- ✅ Code follows project conventions and passes linter checks

## Potential Issues and Solutions

### Issue: Other code references `enemy.color`
**Solution**: Keep `color` property for now, update references in Phase 3

### Issue: Type errors in dependent code
**Solution**: Ensure `enemyUnit` is properly typed as optional, add type guards where needed

### Issue: Performance concerns
**Solution**: `SlimeBlobEnemy` constructor is lightweight (just RNG calculations), no performance impact expected

## Next Steps

After completing Phase 2:
- Phase 3 will update SVG death animations to use `enemyUnit.renderToSvg()`
- Phase 4 will remove `createEnemyTexture()` function and update tests
