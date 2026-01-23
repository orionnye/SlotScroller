# Refactor Enemy Rendering System

**Status**: 📋 PLANNED  
**Goal**: Refactor enemy rendering to use a base unit class with polymorphic render functions that can be passed to SVG death animations, enabling accurate visual recreation without pixel extraction.

## Overview

Currently, enemy rendering is split between:
- `createEnemyTexture()` - Creates PixiJS texture from Graphics
- `spawnEnemy()` - Creates sprite from texture
- `createSvgDeathSquare()` - Attempts to recreate enemy appearance in SVG (currently using stored color only)

The problem: SVG death animations can't accurately recreate the enemy's visual appearance because the rendering logic is embedded in texture creation and not reusable.

## Solution: Base Unit Class with Render Functions

Create a base enemy unit class system where:
1. **Base Unit Class**: Defines common enemy properties and a render interface
2. **Enemy-Specific Render Functions**: Each enemy type implements its own render function
3. **Reusable Render Logic**: Render functions can be used for both PixiJS textures and SVG elements
4. **Death Animation Integration**: SVG death animations can use the same render function to accurately recreate the enemy

## Architecture

### Base Unit Class Structure

```typescript
// Base unit interface
interface BaseEnemyUnit {
  // Core properties
  seed: number
  color: number
  width: number
  height: number
  
  // Render function signature
  renderToPixi(app: Application): Texture
  renderToSvg(): SVGSVGElement
  renderToCanvas(canvas: HTMLCanvasElement): void
}

// Enemy-specific implementation
class SlimeBlobEnemy implements BaseEnemyUnit {
  seed: number
  color: number
  width: number = 40
  height: number = 36
  
  // Store render parameters
  baseWidth: number
  baseHeight: number
  cornerRadius: number
  bulgeOffsetX: number
  bulgeOffsetY: number
  bulgeRadius: number
  highlightRadius: number
  eyeY: number
  eye1X: number
  eye2X: number
  
  constructor(seed: number) {
    this.seed = seed
    // Initialize all render parameters from seed
    this.initializeFromSeed(seed)
  }
  
  renderToPixi(app: Application): Texture {
    // Current createEnemyTexture logic
  }
  
  renderToSvg(): SVGSVGElement {
    // SVG version of same rendering logic
  }
}
```

## Detailed Requirements

### Phase 1: Create Base Enemy Unit Class

#### Create base unit interface
- Given enemy rendering needs refactoring, should create `BaseEnemyUnit` interface in `web/src/pixi/topScene/units/BaseEnemyUnit.ts`
- Given interface exists, should define common properties:
  - `seed: number` - Seed for deterministic generation
  - `color: number` - Body color (hex)
  - `width: number` - Unit width
  - `height: number` - Unit height
- Given interface exists, should define render methods:
  - `renderToPixi(app: Application): Texture` - Render to PixiJS texture
  - `renderToSvg(): SVGSVGElement` - Render to SVG element
  - `renderToCanvas(canvas: HTMLCanvasElement): void` - Optional canvas rendering

#### Create SlimeBlobEnemy class
- Given base interface exists, should create `SlimeBlobEnemy` class in `web/src/pixi/topScene/units/SlimeBlobEnemy.ts`
- Given class exists, should implement `BaseEnemyUnit` interface
- Given class exists, should store all render parameters as instance properties:
  - `baseWidth: number`
  - `baseHeight: number`
  - `cornerRadius: number`
  - `bulgeOffsetX: number`
  - `bulgeOffsetY: number`
  - `bulgeRadius: number`
  - `highlightRadius: number`
  - `eyeY: number`
  - `eye1X: number`
  - `eye2X: number`
- Given class exists, should have constructor that accepts `seed: number`
- Given constructor is called, should initialize all render parameters from seed using `createSeededRng(seed)`
- Given parameters are initialized, should match current `createEnemyTexture` logic exactly

#### Implement renderToPixi method
- Given `SlimeBlobEnemy` class exists, should implement `renderToPixi(app: Application): Texture`
- Given method is called, should use stored render parameters to create PixiJS Graphics
- Given Graphics is created, should match current `createEnemyTexture` output exactly
- Given Graphics is created, should return `app.renderer.generateTexture(g)`

#### Implement renderToSvg method
- Given `SlimeBlobEnemy` class exists, should implement `renderToSvg(): SVGSVGElement`
- Given method is called, should use stored render parameters to create SVG element
- Given SVG is created, should match PixiJS rendering visually:
  - Same body shape (rounded rectangle with same dimensions)
  - Same color
  - Same bulge position and size
  - Same highlight position and size
  - Same eye positions
  - Same outline
- Given SVG is created, should return fully constructed `SVGSVGElement`

### Phase 2: Refactor Enemy Spawning

#### Update spawnEnemy function
- Given `SlimeBlobEnemy` class exists, should update `spawnEnemy()` in `web/src/pixi/topScene/sprites/spawn.ts`
- Given function is updated, should create `SlimeBlobEnemy` instance instead of calling `createEnemyTexture` directly
- Given instance is created, should call `enemyUnit.renderToPixi(app)` to get texture
- Given texture is created, should create sprite from texture (existing logic)
- Given sprite is created, should store `enemyUnit` in `CharacterSprite`:
  - Add `enemyUnit?: BaseEnemyUnit` to `CharacterSprite` type
  - Store `enemyUnit` when pushing to enemies array

#### Update CharacterSprite type
- Given enemy units exist, should update `CharacterSprite` type in `web/src/pixi/topScene/types.ts`
- Given type is updated, should add `enemyUnit?: BaseEnemyUnit` property
- Given property exists, should be optional (heroes don't have enemy units)

### Phase 3: Update SVG Death Animation

#### Refactor createSvgDeathSquare
- Given `BaseEnemyUnit` exists, should update `createSvgDeathSquare()` in `web/src/pixi/topScene/animation/svgDeathAnimation.ts`
- Given function is updated, should accept `enemyUnit?: BaseEnemyUnit` parameter instead of `enemyColor?: number`
- Given `enemyUnit` is provided, should call `enemyUnit.renderToSvg()` to get SVG element
- Given SVG element is created, should position it using sprite's global position (existing logic)
- Given SVG element is positioned, should return `SvgDeathAnimation` with the SVG element
- Given `enemyUnit` is not provided, should fall back to simple green rounded rectangle (backward compatibility)

#### Update dealDamageToEnemy
- Given `createSvgDeathSquare` signature changes, should update `dealDamageToEnemy()` in `web/src/pixi/topScene/combat/enemyCombat.ts`
- Given function is updated, should pass `actualEnemy.enemyUnit` to `createSvgDeathSquare`
- Given `enemyUnit` is passed, should ensure it's available from `CharacterSprite`

### Phase 4: Cleanup and Testing

#### Remove old texture creation function
- Given `SlimeBlobEnemy.renderToPixi()` replaces `createEnemyTexture()`, should mark `createEnemyTexture()` as deprecated
- Given function is deprecated, should update all call sites to use `SlimeBlobEnemy` instead
- Given all call sites are updated, should remove `createEnemyTexture()` function

#### Update tests
- Given enemy rendering is refactored, should update `enemy.browser.test.ts`
- Given tests are updated, should test `SlimeBlobEnemy` class instead of `createEnemyTexture` function
- Given tests are updated, should verify:
  - Same seed produces same visual output
  - `renderToPixi()` produces valid texture
  - `renderToSvg()` produces valid SVG
  - SVG matches PixiJS rendering visually

## Implementation Details

### Render Parameter Extraction

The current `createEnemyTexture` function uses:
```typescript
const rng = createSeededRng(seed)
const bodyColor = slimeColors[rng.nextInt(slimeColors.length)]
const baseWidth = 28 + rng.nextInt(8)
const baseHeight = 30 + rng.nextInt(6)
const cornerRadius = 8 + rng.nextInt(4)
const bulgeOffsetX = (rng.nextInt(5) - 2) * 2
const bulgeOffsetY = (rng.nextInt(5) - 2) * 2
const bulgeRadius = 6 + rng.nextInt(3)
const highlightRadius = 4 + rng.nextInt(2)
```

All these values should be stored in the `SlimeBlobEnemy` instance so they can be reused for SVG rendering.

### SVG Rendering Equivalents

PixiJS Graphics → SVG equivalents:
- `g.roundRect(...).fill({ color, alpha })` → `<rect fill="..." fill-opacity="..."/>`
- `g.circle(...).fill({ color, alpha })` → `<circle fill="..." fill-opacity="..."/>`
- `g.roundRect(...).stroke(...)` → `<rect stroke="..." stroke-opacity="..." stroke-width="..."/>`

### Coordinate System

PixiJS uses:
- `centerX = w / 2`
- `centerY = h - baseHeight / 2`

SVG should use the same coordinate system with `viewBox="0 0 40 36"` to match.

## Benefits

1. **Accurate Death Animations**: SVG death animations will match enemy appearance exactly
2. **Extensibility**: Easy to add new enemy types by implementing `BaseEnemyUnit`
3. **Maintainability**: Single source of truth for enemy rendering logic
4. **Testability**: Can test rendering logic independently of PixiJS
5. **Reusability**: Render functions can be used for previews, tooltips, etc.

## Migration Path

1. Create `BaseEnemyUnit` interface and `SlimeBlobEnemy` class (non-breaking)
2. Update `spawnEnemy` to use `SlimeBlobEnemy` (non-breaking, old texture function still works)
3. Update `createSvgDeathSquare` to use `enemyUnit.renderToSvg()` (non-breaking, fallback exists)
4. Remove `createEnemyTexture` function (breaking, but all call sites updated)

## Files to Create/Modify

### New Files
- `web/src/pixi/topScene/units/BaseEnemyUnit.ts` - Base interface
- `web/src/pixi/topScene/units/SlimeBlobEnemy.ts` - Slime blob implementation

### Modified Files
- `web/src/pixi/topScene/types.ts` - Add `enemyUnit?: BaseEnemyUnit` to `CharacterSprite`
- `web/src/pixi/topScene/sprites/spawn.ts` - Use `SlimeBlobEnemy` instead of `createEnemyTexture`
- `web/src/pixi/topScene/animation/svgDeathAnimation.ts` - Use `enemyUnit.renderToSvg()`
- `web/src/pixi/topScene/combat/enemyCombat.ts` - Pass `enemyUnit` to `createSvgDeathSquare`
- `web/src/pixi/topScene/textures/enemy.ts` - Mark `createEnemyTexture` as deprecated or remove

### Test Files
- `web/src/pixi/topScene/units/SlimeBlobEnemy.test.ts` - New test file
- `web/src/pixi/topScene/textures/enemy.browser.test.ts` - Update to test `SlimeBlobEnemy`

## Success Criteria

- ✅ SVG death animations match enemy appearance exactly (color, shape, size, features)
- ✅ New enemy types can be added by implementing `BaseEnemyUnit`
- ✅ Render functions are reusable for both PixiJS and SVG
- ✅ All existing functionality preserved
- ✅ Tests pass and verify visual matching between PixiJS and SVG
