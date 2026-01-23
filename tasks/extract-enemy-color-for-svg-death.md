# Extract Enemy Color for SVG Death Animation

**Status**: ✅ COMPLETED  
**Goal**: Extract the actual color from the enemy sprite's texture so the SVG death animation matches the enemy's visual appearance (green, blue, or purple).

## Overview

Currently, the SVG death animation uses `sprite.tint` to determine color, but enemy colors are baked into the texture during creation, not applied as a tint. The `sprite.tint` is likely 0xffffff (white/default), so all death animations appear green.

We need to extract the actual color from the enemy's texture so each enemy's death animation matches its color (green #22c55e, blue #3b82f6, or purple #8b5cf6).

## Problem Analysis

### Current Issue
- Enemy textures are created with colors baked in: `bodyColor = slimeColors[rng.nextInt(slimeColors.length)]`
- Colors are: `[0x22c55e, 0x3b82f6, 0x8b5cf6]` (green, blue, purple)
- Sprite tint is not set, so `sprite.tint === 0xffffff` (white/default)
- SVG death animation always uses default green (#22c55e)

### Solution Options

**Option 1: Extract color from texture pixels (Recommended)**
- Sample pixels from the texture to determine dominant color
- Use PixiJS extract system to get pixel data
- Find the most common non-transparent color
- Convert to CSS color string

**Option 2: Store color when creating enemy**
- Add `color` property to `CharacterSprite` type
- Store color when enemy is spawned
- Pass color to `createSvgDeathSquare`

**Option 3: Recreate from seed (if seed is accessible)**
- If enemy seed is stored, recreate color using same RNG
- Use same logic as `createEnemyTexture`

## Detailed Requirements

### Option 1: Extract Color from Texture (Recommended)

#### Create color extraction function
- Given color extraction is needed, should create `extractEnemyColor` function in `svgDeathAnimation.ts`
- Given function is called, should accept `sprite: Sprite` and `app: Application` parameters
- Given function is called, should extract pixel data: `app.renderer.extract.pixels(sprite)`
- Given pixel data exists, should iterate through pixels (RGBA format, 4 values per pixel)
- Given pixel data exists, should skip transparent pixels (alpha < 128)
- Given pixel data exists, should count color occurrences (use Map or object)
- Given color occurrences exist, should find most common color
- Given color is found, should convert RGB to hex: `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
- Given color extraction fails, should fall back to default green: `#22c55e`

#### Update createSvgDeathSquare
- Given `createSvgDeathSquare` function exists, should accept `app: Application` parameter
- Given function is called, should call `extractEnemyColor(enemySprite, app)` to get color
- Given color is extracted, should use extracted color for rectangle fill
- Given color extraction fails, should use default green as fallback

#### Update function calls
- Given `dealDamageToEnemy` calls `createSvgDeathSquare`, should pass `app` parameter
- Given `createSvgDeathSquare` signature changes, should update all call sites

### Option 2: Store Color When Creating Enemy (Alternative)

#### Update CharacterSprite type
- Given `CharacterSprite` type exists, should add optional `color?: number` property
- Given color property exists, should store hex color value (e.g., 0x22c55e)

#### Update spawnEnemy function
- Given `spawnEnemy` function exists, should extract color from texture creation
- Given color is extracted, should store in `CharacterSprite.color` property
- Given color is stored, should pass to enemy object when creating

#### Update createSvgDeathSquare
- Given `createSvgDeathSquare` function exists, should accept `enemyColor?: number` parameter
- Given enemyColor exists, should convert to CSS: `#${enemyColor.toString(16).padStart(6, '0')}`
- Given enemyColor doesn't exist, should use default green

#### Update dealDamageToEnemy
- Given `dealDamageToEnemy` function exists, should get color from `actualEnemy.color`
- Given color exists, should pass to `createSvgDeathSquare`

## Implementation Example (Option 1 - Recommended)

```typescript
function extractEnemyColor(sprite: Sprite, app: Application): string {
  try {
    // Extract pixel data from sprite
    const pixels = app.renderer.extract.pixels(sprite)
    
    if (!pixels || pixels.length === 0) {
      return '#22c55e' // Default green
    }
    
    // Count color occurrences (skip transparent pixels)
    const colorCounts = new Map<string, number>()
    const width = sprite.width
    const height = sprite.height
    
    // Sample pixels (every 4th pixel for performance)
    for (let i = 0; i < pixels.length; i += 16) { // RGBA = 4 bytes, sample every 4th pixel
      const r = pixels[i]
      const g = pixels[i + 1]
      const b = pixels[i + 2]
      const a = pixels[i + 3]
      
      // Skip transparent or very transparent pixels
      if (a < 128) continue
      
      // Round colors to reduce noise (group similar colors)
      const roundedR = Math.round(r / 10) * 10
      const roundedG = Math.round(g / 10) * 10
      const roundedB = Math.round(b / 10) * 10
      
      const colorKey = `${roundedR},${roundedG},${roundedB}`
      colorCounts.set(colorKey, (colorCounts.get(colorKey) || 0) + 1)
    }
    
    // Find most common color
    let maxCount = 0
    let dominantColor = '#22c55e' // Default
    
    for (const [colorKey, count] of colorCounts.entries()) {
      if (count > maxCount) {
        maxCount = count
        const [r, g, b] = colorKey.split(',').map(Number)
        dominantColor = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
      }
    }
    
    return dominantColor
  } catch (error) {
    console.warn('Failed to extract enemy color:', error)
    return '#22c55e' // Default green on error
  }
}

export function createSvgDeathSquare(
  enemySprite: Sprite,
  sourceCanvas: HTMLCanvasElement,
  app: Application, // Add app parameter
): SvgDeathAnimation {
  // ... existing position code ...
  
  // Extract color from texture
  const fillColor = extractEnemyColor(enemySprite, app)
  
  // ... rest of implementation using fillColor ...
}
```

## Implementation Example (Option 2 - Alternative)

```typescript
// In spawn.ts
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
  
  // Extract color from texture creation (would need to modify createEnemyTexture to return color)
  // Or recreate color from seed
  const rngForColor = createSeededRng(seed)
  const slimeColors = [0x22c55e, 0x3b82f6, 0x8b5cf6]
  const bodyColor = slimeColors[rngForColor.nextInt(slimeColors.length)]
  
  const s = new Sprite(tex)
  // ... existing sprite setup ...
  
  enemies.push({
    sprite: s,
    color: bodyColor, // Store color
    // ... other properties ...
  })
}

// In svgDeathAnimation.ts
export function createSvgDeathSquare(
  enemySprite: Sprite,
  sourceCanvas: HTMLCanvasElement,
  enemyColor?: number, // Add optional color parameter
): SvgDeathAnimation {
  // ... existing code ...
  
  // Use stored color or default
  let fillColor = '#22c55e'
  if (enemyColor !== undefined) {
    fillColor = `#${enemyColor.toString(16).padStart(6, '0')}`
  }
  
  // ... rest of implementation ...
}
```

## Testing

### Manual Testing
- Given green enemy dies, should see green SVG death animation
- Given blue enemy dies, should see blue SVG death animation
- Given purple enemy dies, should see purple SVG death animation
- Given multiple enemies die, should see different colors matching each enemy
- Given color extraction fails, should fall back to green without errors

### Success Criteria
- ✅ Green enemies show green death animation
- ✅ Blue enemies show blue death animation
- ✅ Purple enemies show purple death animation
- ✅ Color extraction is reliable (works for all enemies)
- ✅ Fallback to green works if extraction fails
- ✅ No performance issues (extraction is fast)
- ✅ No console errors

## Recommendation

**Use Option 1 (Extract from Texture)** because:
- Works with existing enemies without modification
- No need to change enemy creation logic
- More robust (works even if color wasn't stored)
- Can handle any texture color, not just predefined ones

**Consider Option 2 (Store Color)** if:
- Performance is a concern (pixel extraction is slower)
- You want to ensure exact color matching
- You're willing to modify enemy creation logic

## Performance Considerations

- Pixel extraction may be slower than storing color
- Sampling every 4th pixel reduces processing time
- Color rounding reduces noise and improves accuracy
- Consider caching extracted colors if performance is an issue
