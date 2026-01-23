# Match SVG Death Animation to Enemy Render

**Status**: ✅ COMPLETED  
**Goal**: Make the SVG death animation match each enemy's actual visual appearance (color, size, shape variations) instead of using a generic green square.

## Overview

Currently, the SVG death animation uses a generic green rounded rectangle with eyes. However, enemies are rendered with variations:
- Different colors (green, blue, purple)
- Different sizes (baseWidth: 28-35px, baseHeight: 30-35px)
- Different corner radius (8-11px)
- Bulge variations
- Highlights

We need to extract the enemy's visual properties and recreate them in the SVG death animation so each enemy's death animation matches its appearance.

## Detailed Requirements

### Extract enemy visual properties
- Given enemy sprite exists, should extract visual properties from sprite or texture
- Given enemy texture is created, should note that `createEnemyTexture` uses seed-based RNG for variations
- Given enemy sprite exists, should identify properties to extract:
  - Color (from texture or sprite tint)
  - Size (width, height from sprite bounds)
  - Shape variations (if possible to extract)

### Options for property extraction

**Option 1: Extract from sprite texture (if texture has color info)**
- Given sprite has texture, should check if texture contains color information
- Given texture has color, should extract dominant color or use texture's base color
- Given texture exists, should get dimensions from sprite bounds

**Option 2: Use sprite tint as color indicator**
- Given sprite has tint property, should use `sprite.tint` to determine color
- Given tint exists, should convert hex color to CSS color string
- Given tint is 0xffffff (white), should use default green color

**Option 3: Recreate from seed (if seed is stored)**
- Given enemy has seed stored, should recreate texture properties from seed
- Given seed exists, should use same RNG to determine color, size, etc.
- Given seed approach, should match original enemy creation logic

**Option 4: Use sprite dimensions and default styling**
- Given sprite has dimensions, should use `sprite.width` and `sprite.height` for SVG size
- Given sprite dimensions exist, should use default green color with variations
- Given dimensions exist, should scale SVG to match sprite size

### Recommended approach: Extract from sprite properties
- Given sprite exists, should use `sprite.width` and `sprite.height` for SVG dimensions
- Given sprite exists, should check `sprite.tint` for color (if not white, use that color)
- Given sprite exists, should use default green (#22c55e) if tint is white/default
- Given sprite dimensions exist, should scale eyes proportionally
- Given sprite dimensions exist, should adjust corner radius proportionally

### Update createSvgDeathSquare function
- Given `createSvgDeathSquare` function exists, should accept `enemySprite: Sprite` parameter (already has this)
- Given function is called, should get sprite dimensions: `sprite.width`, `sprite.height`
- Given function is called, should get sprite color from `sprite.tint` or use default
- Given function is called, should convert hex color to CSS color string: `#${tint.toString(16).padStart(6, '0')}`
- Given function is called, should use sprite dimensions for SVG: `width: sprite.width`, `height: sprite.height`
- Given function is called, should use sprite dimensions for viewBox: `viewBox: \`0 0 ${sprite.width} ${sprite.height}\``
- Given function is called, should scale rectangle to match sprite: `width: sprite.width`, `height: sprite.height`
- Given function is called, should calculate corner radius proportionally: `rx: Math.max(4, sprite.width * 0.2)` (20% of width, min 4px)
- Given function is called, should position eyes proportionally:
  - `eye1.cx: sprite.width * 0.35` (35% from left)
  - `eye1.cy: sprite.height * 0.33` (33% from top)
  - `eye2.cx: sprite.width * 0.65` (65% from left)
  - `eye2.cy: sprite.height * 0.33` (33% from top)
- Given function is called, should scale eye radius: `r: Math.max(1, sprite.width * 0.05)` (5% of width, min 1px)

### Handle color extraction
- Given sprite.tint exists, should check if tint is not white (0xffffff)
- Given tint is not white, should convert to CSS color: `#${tint.toString(16).padStart(6, '0')}`
- Given tint is white or default, should use default green: `#22c55e`
- Given color is extracted, should use for rectangle fill

### Update SVG element creation
- Given SVG element is created, should use dynamic dimensions from sprite
- Given SVG element is created, should set style width/height to match sprite dimensions
- Given SVG element is created, should keep all other styling (position, zIndex, etc.)

## Implementation Example

```typescript
export function createSvgDeathSquare(
  enemySprite: Sprite,
  sourceCanvas: HTMLCanvasElement,
): SvgDeathAnimation {
  // Get enemy sprite's global position
  const globalPos = enemySprite.getGlobalPosition()
  
  // Convert canvas coordinates to viewport coordinates
  const canvasRect = sourceCanvas.getBoundingClientRect()
  const viewportX = canvasRect.left + globalPos.x
  const viewportY = canvasRect.top + globalPos.y
  
  // Extract sprite properties
  const spriteWidth = enemySprite.width
  const spriteHeight = enemySprite.height
  
  // Extract color from sprite tint (or use default green)
  const defaultColor = '#22c55e'
  let fillColor = defaultColor
  if (enemySprite.tint !== 0xffffff && enemySprite.tint !== undefined) {
    // Convert hex tint to CSS color string
    fillColor = `#${enemySprite.tint.toString(16).padStart(6, '0')}`
  }
  
  // Calculate proportional values
  const cornerRadius = Math.max(4, spriteWidth * 0.2) // 20% of width, min 4px
  const eyeRadius = Math.max(1, spriteWidth * 0.05) // 5% of width, min 1px
  const eyeY = spriteHeight * 0.33 // 33% from top
  const eye1X = spriteWidth * 0.35 // 35% from left
  const eye2X = spriteWidth * 0.65 // 65% from left
  
  // Create SVG element
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  svg.setAttribute('width', String(spriteWidth))
  svg.setAttribute('height', String(spriteHeight))
  svg.setAttribute('viewBox', `0 0 ${spriteWidth} ${spriteHeight}`)
  
  svg.style.position = 'fixed'
  svg.style.left = `${viewportX}px`
  svg.style.top = `${viewportY}px`
  svg.style.width = `${spriteWidth}px`
  svg.style.height = `${spriteHeight}px`
  svg.style.zIndex = '10000'
  svg.style.pointerEvents = 'none'
  svg.style.transformOrigin = 'center center'
  
  // Create rounded rectangle (enemy body) with extracted color
  const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
  rect.setAttribute('x', '0')
  rect.setAttribute('y', '0')
  rect.setAttribute('width', String(spriteWidth))
  rect.setAttribute('height', String(spriteHeight))
  rect.setAttribute('rx', String(cornerRadius))
  rect.setAttribute('fill', fillColor)
  svg.appendChild(rect)
  
  // Add eyes (proportionally positioned)
  const eye1 = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
  eye1.setAttribute('cx', String(eye1X))
  eye1.setAttribute('cy', String(eyeY))
  eye1.setAttribute('r', String(eyeRadius))
  eye1.setAttribute('fill', '#000000')
  eye1.setAttribute('fill-opacity', '0.8')
  svg.appendChild(eye1)
  
  const eye2 = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
  eye2.setAttribute('cx', String(eye2X))
  eye2.setAttribute('cy', String(eyeY))
  eye2.setAttribute('r', String(eyeRadius))
  eye2.setAttribute('fill', '#000000')
  eye2.setAttribute('fill-opacity', '0.8')
  svg.appendChild(eye2)
  
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

## Testing

### Manual Testing
- Given enemy with default appearance dies, should see green SVG matching enemy size
- Given enemy with different size dies, should see SVG matching that size
- Given enemy with tint dies, should see SVG with matching color (if tint is applied)
- Given multiple enemies die, should see each with its own size/color
- Given SVG is created, should match enemy's visual appearance closely

### Success Criteria
- ✅ SVG death animation matches enemy's width and height
- ✅ SVG death animation uses enemy's color (if tint is set) or default green
- ✅ Eyes are proportionally positioned based on enemy size
- ✅ Corner radius is proportional to enemy size
- ✅ Multiple enemies show different sizes/colors in death animations
- ✅ No console errors
- ✅ Animation still works correctly (falling, rotation)

## Notes

- This approach uses sprite dimensions and tint to match appearance
- More complex variations (bulges, highlights) may not be perfectly recreated, but basic shape and color will match
- If enemies don't have tint set, they'll all use default green color
- Eye positioning and size scale proportionally to maintain visual consistency
- Corner radius scales to maintain rounded appearance at different sizes

## Future Enhancements (Optional)

- Could extract more visual properties if texture data is accessible
- Could add bulge variations if sprite has additional visual data
- Could add highlights if sprite has highlight information
- For now, matching size and color is the primary goal
