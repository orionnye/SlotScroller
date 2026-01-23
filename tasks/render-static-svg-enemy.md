# Render Static SVG Enemy

**Status**: ✅ COMPLETED  
**Epic**: SVG Death Animation - Incremental Implementation (Step 1)  
**Goal**: Create a simple test function that renders a static SVG representation of an enemy at a fixed position to verify basic SVG rendering works.

## Overview

This is the first step in building the SVG death animation system incrementally. We'll create a simple test function that renders a static SVG enemy shape at a fixed position, allowing us to verify that:
- SVG elements can be created and added to the DOM
- SVG elements are visible on screen
- Basic styling and positioning works

## Detailed Requirements

### Create test function file
- Given test file is needed, should create new file: `web/src/pixi/topScene/testSvgEnemy.ts`
- Given test file exists, should export function: `export function testSvgEnemyRender(): void`

### Create SVG element
- Given test function is called, should create SVG element: `const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')`
- Given SVG element is created, should set attributes:
  - `width: '40'`
  - `height: '36'`
  - `viewBox: '0 0 40 36'`

### Style SVG element
- Given SVG element is created, should set style properties:
  - `position: 'fixed'`
  - `left: '100px'`
  - `top: '100px'`
  - `width: '40px'`
  - `height: '36px'`
  - `zIndex: '10000'`
  - `pointerEvents: 'none'`

### Create enemy shape
- Given SVG element exists, should create rounded rectangle shape: `const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect')`
- Given rectangle is created, should set attributes:
  - `x: '0'`
  - `y: '0'`
  - `width: '40'`
  - `height: '36'`
  - `rx: '8'` (rounded corners)
  - `fill: '#22c55e'` (green, matching slime blob color)
- Given rectangle is created, should append to SVG element: `svg.appendChild(rect)`

### Add optional eyes for visual clarity
- Given SVG element exists, should create first eye circle: `const eye1 = document.createElementNS('http://www.w3.org/2000/svg', 'circle')`
- Given first eye is created, should set attributes:
  - `cx: '14'` (left eye x position)
  - `cy: '12'` (eye y position)
  - `r: '2'`
  - `fill: '#000000'`
  - `fillOpacity: '0.8'`
- Given first eye is created, should append to SVG element
- Given SVG element exists, should create second eye circle: `const eye2 = document.createElementNS('http://www.w3.org/2000/svg', 'circle')`
- Given second eye is created, should set attributes:
  - `cx: '26'` (right eye x position)
  - `cy: '12'`
  - `r: '2'`
  - `fill: '#000000'`
  - `fillOpacity: '0.8'`
- Given second eye is created, should append to SVG element

### Append to DOM
- Given SVG element is complete, should append to `document.body`: `document.body.appendChild(svg)`

### Add cleanup function (optional)
- Given test function exists, should return cleanup function: `export function testSvgEnemyRender(): () => void`
- Given cleanup function is returned, should remove SVG element from DOM when called
- Given cleanup function is called, should check if element exists before removing

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
  
  return () => {
    if (svg.parentNode) {
      svg.parentNode.removeChild(svg)
    }
  }
}
```

## Testing

### Manual Testing
- Given test function exists, should be callable from browser console: `testSvgEnemyRender()`
- Given test function is called, should see green rounded rectangle with eyes at position (100, 100)
- Given SVG is visible, should be inspectable in DevTools
- Given cleanup function is called, should remove SVG from DOM

### Success Criteria
- ✅ SVG enemy shape is visible on screen at position (100, 100)
- ✅ Shape is green rounded rectangle with two black eyes
- ✅ No console errors
- ✅ Element can be inspected in DevTools
- ✅ Cleanup function removes element when called

## Notes

- This is a test/verification step - the SVG will be static and not animated
- Position is hardcoded for simplicity
- Next step (Step 2) will add rotation animation
- This function can be called manually for testing, or integrated into main.ts temporarily
