# Phase 1: Create Base Enemy Unit Class

**Status**: ✅ COMPLETED  
**Epic**: Refactor Enemy Rendering System  
**Goal**: Create a base enemy unit class system with reusable render functions that can generate both PixiJS textures and SVG elements.

## Overview

This phase establishes the foundation for the enemy rendering refactor by:
1. Creating a `BaseEnemyUnit` interface that defines the contract for enemy units
2. Implementing `SlimeBlobEnemy` class that encapsulates all rendering logic
3. Migrating existing `createEnemyTexture` logic into `renderToPixi` method
4. Creating new `renderToSvg` method that produces visually identical SVG output

## Problem Statement

Currently, enemy rendering logic is embedded in `createEnemyTexture()`, making it impossible to reuse the same logic for SVG death animations. This phase extracts that logic into a reusable class structure.

## Detailed Requirements

### Step 1: Create BaseEnemyUnit Interface

#### Create interface file
- Given enemy rendering needs refactoring, should create `web/src/pixi/topScene/units/BaseEnemyUnit.ts`
- Given file is created, should export `BaseEnemyUnit` interface
- Given interface exists, should define core properties:
  - `readonly seed: number` - Seed for deterministic generation
  - `readonly color: number` - Body color (hex value, e.g., 0x22c55e)
  - `readonly width: number` - Unit width in pixels
  - `readonly height: number` - Unit height in pixels

#### Define render methods
- Given interface exists, should define `renderToPixi(app: Application): Texture` method
  - Method signature: accepts PixiJS Application, returns Texture
  - Purpose: Render enemy to PixiJS texture for use in sprites
- Given interface exists, should define `renderToSvg(): SVGSVGElement` method
  - Method signature: no parameters, returns SVG element
  - Purpose: Render enemy to SVG element for death animations
- Given interface exists, should import required types:
  - `Application`, `Texture` from `'pixi.js'`
  - `SVGSVGElement` from DOM types (available globally in TypeScript)

### Step 2: Create SlimeBlobEnemy Class

#### Create class file
- Given base interface exists, should create `web/src/pixi/topScene/units/SlimeBlobEnemy.ts`
- Given file is created, should import:
  - `BaseEnemyUnit` from `'./BaseEnemyUnit'`
  - `Application`, `Graphics`, `Texture` from `'pixi.js'`
  - `createSeededRng` from `'../../../game/rng/rng'`

#### Define class structure
- Given class exists, should implement `BaseEnemyUnit` interface
- Given class exists, should define constant dimensions:
  - `readonly width: number = 40`
  - `readonly height: number = 36`
- Given class exists, should define readonly properties:
  - `readonly seed: number`
  - `readonly color: number`
  - `readonly baseWidth: number` - Main body width (28-35px)
  - `readonly baseHeight: number` - Main body height (30-35px)
  - `readonly cornerRadius: number` - Rounded rectangle corner radius (8-11px)
  - `readonly bulgeOffsetX: number` - Bulge horizontal offset (-4 to +4)
  - `readonly bulgeOffsetY: number` - Bulge vertical offset (-4 to +4)
  - `readonly bulgeRadius: number` - Bulge circle radius (6-8px)
  - `readonly highlightRadius: number` - Highlight circle radius (4-5px)
  - `readonly eyeY: number` - Eye vertical position
  - `readonly eye1X: number` - Left eye horizontal position (centerX - 4)
  - `readonly eye2X: number` - Right eye horizontal position (centerX + 4)

#### Implement constructor
- Given class exists, should have constructor that accepts `seed: number`
- Given constructor is called, should:
  1. Store `this.seed = seed`
  2. Create RNG: `const rng = createSeededRng(seed)`
  3. Determine color: `const slimeColors = [0x22c55e, 0x3b82f6, 0x8b5cf6]` and `this.color = slimeColors[rng.nextInt(slimeColors.length)]`
  4. Calculate dimensions: `this.baseWidth = 28 + rng.nextInt(8)` and `this.baseHeight = 30 + rng.nextInt(6)`
  5. Calculate corner radius: `this.cornerRadius = 8 + rng.nextInt(4)`
  6. Calculate bulge properties: `this.bulgeOffsetX = (rng.nextInt(5) - 2) * 2`, `this.bulgeOffsetY = (rng.nextInt(5) - 2) * 2`, `this.bulgeRadius = 6 + rng.nextInt(3)`
  7. Calculate highlight: `this.highlightRadius = 4 + rng.nextInt(2)`
  8. Calculate eye positions:
     - `const centerX = this.width / 2`
     - `const centerY = this.height - this.baseHeight / 2`
     - `this.eyeY = centerY - this.baseHeight / 4`
     - `this.eye1X = centerX - 4`
     - `this.eye2X = centerX + 4`

### Step 3: Implement renderToPixi Method

#### Create PixiJS Graphics rendering
- Given `SlimeBlobEnemy` class exists, should implement `renderToPixi(app: Application): Texture`
- Given method is called, should:
  1. Create Graphics object: `const g = new Graphics()`
  2. Calculate center positions:
     - `const centerX = this.width / 2`
     - `const centerY = this.height - this.baseHeight / 2`
  3. Draw main blob body:
     - `g.roundRect(centerX - this.baseWidth / 2, centerY - this.baseHeight / 2, this.baseWidth, this.baseHeight, this.cornerRadius).fill({ color: this.color, alpha: 0.85 })`
  4. Draw bulge variation:
     - `g.circle(centerX + this.bulgeOffsetX, centerY - this.baseHeight / 4 + this.bulgeOffsetY, this.bulgeRadius).fill({ color: this.color, alpha: 0.6 })`
  5. Draw highlight:
     - `g.circle(centerX - this.baseWidth / 4, centerY - this.baseHeight / 3, this.highlightRadius).fill({ color: 0xffffff, alpha: 0.3 })`
  6. Draw eyes:
     - `g.circle(this.eye1X, this.eyeY, 2).fill({ color: 0x000000, alpha: 0.8 })`
     - `g.circle(this.eye2X, this.eyeY, 2).fill({ color: 0x000000, alpha: 0.8 })`
  7. Draw outline:
     - `g.roundRect(centerX - this.baseWidth / 2, centerY - this.baseHeight / 2, this.baseWidth, this.baseHeight, this.cornerRadius).stroke({ color: 0x000000, alpha: 0.2, width: 1 })`
  8. Generate and return texture: `return app.renderer.generateTexture(g)`

#### Verify output matches existing function
- Given method is implemented, should produce identical output to `createEnemyTexture(app, seed)` for same seed
- Given same seed is used, should produce same color, dimensions, and visual appearance

### Step 4: Implement renderToSvg Method

#### Create SVG element structure
- Given `SlimeBlobEnemy` class exists, should implement `renderToSvg(): SVGSVGElement`
- Given method is called, should:
  1. Create SVG element: `const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')`
  2. Set SVG attributes:
     - `svg.setAttribute('width', String(this.width))`
     - `svg.setAttribute('height', String(this.height))`
     - `svg.setAttribute('viewBox', `0 0 ${this.width} ${this.height}`)`
  3. Calculate center positions (same as renderToPixi):
     - `const centerX = this.width / 2`
     - `const centerY = this.height - this.baseHeight / 2`

#### Convert color to CSS hex string
- Given method exists, should create helper function to convert hex to CSS:
  - `const colorToCss = (hex: number): string => '#' + hex.toString(16).padStart(6, '0')`
- Given color conversion exists, should use `colorToCss(this.color)` for fill colors

#### Draw main blob body (SVG)
- Given SVG element exists, should create rounded rectangle:
  - `const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect')`
  - `rect.setAttribute('x', String(centerX - this.baseWidth / 2))`
  - `rect.setAttribute('y', String(centerY - this.baseHeight / 2))`
  - `rect.setAttribute('width', String(this.baseWidth))`
  - `rect.setAttribute('height', String(this.baseHeight))`
  - `rect.setAttribute('rx', String(this.cornerRadius))`
  - `rect.setAttribute('fill', colorToCss(this.color))`
  - `rect.setAttribute('fill-opacity', '0.85')`
  - `svg.appendChild(rect)`

#### Draw bulge variation (SVG)
- Given SVG element exists, should create circle for bulge:
  - `const bulge = document.createElementNS('http://www.w3.org/2000/svg', 'circle')`
  - `bulge.setAttribute('cx', String(centerX + this.bulgeOffsetX))`
  - `bulge.setAttribute('cy', String(centerY - this.baseHeight / 4 + this.bulgeOffsetY))`
  - `bulge.setAttribute('r', String(this.bulgeRadius))`
  - `bulge.setAttribute('fill', colorToCss(this.color))`
  - `bulge.setAttribute('fill-opacity', '0.6')`
  - `svg.appendChild(bulge)`

#### Draw highlight (SVG)
- Given SVG element exists, should create circle for highlight:
  - `const highlight = document.createElementNS('http://www.w3.org/2000/svg', 'circle')`
  - `highlight.setAttribute('cx', String(centerX - this.baseWidth / 4))`
  - `highlight.setAttribute('cy', String(centerY - this.baseHeight / 3))`
  - `highlight.setAttribute('r', String(this.highlightRadius))`
  - `highlight.setAttribute('fill', '#ffffff')`
  - `highlight.setAttribute('fill-opacity', '0.3')`
  - `svg.appendChild(highlight)`

#### Draw eyes (SVG)
- Given SVG element exists, should create two circles for eyes:
  - Left eye: `const eye1 = document.createElementNS('http://www.w3.org/2000/svg', 'circle')`
    - `eye1.setAttribute('cx', String(this.eye1X))`
    - `eye1.setAttribute('cy', String(this.eyeY))`
    - `eye1.setAttribute('r', '2')`
    - `eye1.setAttribute('fill', '#000000')`
    - `eye1.setAttribute('fill-opacity', '0.8')`
    - `svg.appendChild(eye1)`
  - Right eye: `const eye2 = document.createElementNS('http://www.w3.org/2000/svg', 'circle')`
    - `eye2.setAttribute('cx', String(this.eye2X))`
    - `eye2.setAttribute('cy', String(this.eyeY))`
    - `eye2.setAttribute('r', '2')`
    - `eye2.setAttribute('fill', '#000000')`
    - `eye2.setAttribute('fill-opacity', '0.8')`
    - `svg.appendChild(eye2)`

#### Draw outline (SVG)
- Given SVG element exists, should create rounded rectangle for outline:
  - `const outline = document.createElementNS('http://www.w3.org/2000/svg', 'rect')`
  - `outline.setAttribute('x', String(centerX - this.baseWidth / 2))`
  - `outline.setAttribute('y', String(centerY - this.baseHeight / 2))`
  - `outline.setAttribute('width', String(this.baseWidth))`
  - `outline.setAttribute('height', String(this.baseHeight))`
  - `outline.setAttribute('rx', String(this.cornerRadius))`
  - `outline.setAttribute('fill', 'none')`
  - `outline.setAttribute('stroke', '#000000')`
  - `outline.setAttribute('stroke-opacity', '0.2')`
  - `outline.setAttribute('stroke-width', '1')`
  - `svg.appendChild(outline)`

#### Return SVG element
- Given SVG is fully constructed, should return `svg` element
- Given SVG is returned, should be ready for DOM insertion or further manipulation

### Step 5: Create Directory Structure

#### Create units directory
- Given units need organization, should create `web/src/pixi/topScene/units/` directory
- Given directory exists, should contain:
  - `BaseEnemyUnit.ts` - Interface definition
  - `SlimeBlobEnemy.ts` - Slime blob implementation

#### Export from index (optional)
- Given units directory exists, should consider creating `web/src/pixi/topScene/units/index.ts`
- Given index file exists, should export:
  - `export type { BaseEnemyUnit } from './BaseEnemyUnit'`
  - `export { SlimeBlobEnemy } from './SlimeBlobEnemy'`

## Implementation Notes

### Coordinate System Consistency

Both `renderToPixi` and `renderToSvg` must use the same coordinate calculations:
- `centerX = width / 2` (always 20 for width=40)
- `centerY = height - baseHeight / 2` (varies based on baseHeight)

### Color Conversion

PixiJS uses hex numbers (0x22c55e), while SVG uses CSS hex strings (#22c55e). The conversion function should handle this:
```typescript
function colorToCss(hex: number): string {
  return '#' + hex.toString(16).padStart(6, '0')
}
```

### Alpha/Opacity Mapping

- PixiJS: `alpha: 0.85` (0-1 range)
- SVG: `fill-opacity="0.85"` (0-1 range, as string)

Both use the same numeric range, so direct conversion is possible.

### Element Ordering

SVG elements should be appended in the same order as PixiJS Graphics drawing:
1. Main body (rounded rectangle)
2. Bulge (circle)
3. Highlight (circle)
4. Eyes (two circles)
5. Outline (rounded rectangle stroke)

This ensures proper layering matches PixiJS rendering.

## Testing Considerations

### Visual Verification
- Create `SlimeBlobEnemy` with known seed
- Call `renderToPixi()` and `renderToSvg()`
- Compare visual output side-by-side
- Verify colors, shapes, and positions match

### Deterministic Behavior
- Same seed should produce identical `SlimeBlobEnemy` instances
- Same seed should produce identical PixiJS textures
- Same seed should produce identical SVG elements

### Edge Cases
- Test with different seeds (0, 1, 42, 999)
- Verify all color variations (green, blue, purple) render correctly
- Verify size variations render correctly
- Verify bulge and highlight positions are within bounds

## Files to Create

1. `web/src/pixi/topScene/units/BaseEnemyUnit.ts` - Interface definition
2. `web/src/pixi/topScene/units/SlimeBlobEnemy.ts` - Slime blob implementation
3. `web/src/pixi/topScene/units/index.ts` (optional) - Barrel export

## Files to Modify

None in this phase. The existing `createEnemyTexture` function will remain unchanged until Phase 2.

## Success Criteria

- ✅ `BaseEnemyUnit` interface is defined with required properties and methods
- ✅ `SlimeBlobEnemy` class implements `BaseEnemyUnit` interface
- ✅ `SlimeBlobEnemy` constructor initializes all render parameters from seed
- ✅ `renderToPixi()` produces identical output to `createEnemyTexture()` for same seed
- ✅ `renderToSvg()` produces SVG element that visually matches PixiJS rendering
- ✅ All render parameters are stored as readonly instance properties
- ✅ Code follows project conventions and passes linter checks

## Next Steps

After completing Phase 1:
- Phase 2 will update `spawnEnemy()` to use `SlimeBlobEnemy` class
- Phase 3 will update SVG death animations to use `renderToSvg()` method
