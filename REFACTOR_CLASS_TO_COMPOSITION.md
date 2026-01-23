# Refactoring Classes to Composition

**Goal**: Refactor `WheelStripView` and `SlimeBlobEnemy` from classes to functional composition per `javascript.mdc` guidelines.

---

## Analysis

### Current State

1. **WheelStripView** (368 lines)
   - Extends PixiJS `Container` (required for scene graph integration)
   - Contains rendering logic, drag handling, state management
   - Used in: `mountPixi.ts`, tests

2. **SlimeBlobEnemy** (182 lines)
   - Implements `BaseEnemyUnit` interface
   - Pure data structure with render methods
   - Used in: `spawn.ts`, `enemy.ts`, tests

### Constraints

- **WheelStripView**: Must be a PixiJS `Container` to be added to scene graph
- **SlimeBlobEnemy**: No constraints - pure refactor possible

---

## Recommendation 1: SlimeBlobEnemy (EASY - Pure Refactor)

### Current Implementation
```typescript
export class SlimeBlobEnemy implements BaseEnemyUnit {
  readonly seed: number
  readonly color: number
  // ... properties
  
  constructor(seed: number) { /* ... */ }
  renderToPixi(app: Application): Texture { /* ... */ }
  renderToSvg(): SVGSVGElement { /* ... */ }
}
```

### Refactored Implementation

**Step 1**: Convert to factory function with internal state

```typescript
// web/src/pixi/topScene/units/slimeBlobEnemy.ts

export type SlimeBlobEnemy = {
  readonly seed: number
  readonly color: number
  readonly width: number
  readonly height: number
  readonly baseWidth: number
  readonly baseHeight: number
  readonly cornerRadius: number
  readonly bulgeOffsetX: number
  readonly bulgeOffsetY: number
  readonly bulgeRadius: number
  readonly highlightRadius: number
  readonly eyeY: number
  readonly eye1X: number
  readonly eye2X: number
  readonly renderToPixi: (app: Application) => Texture
  readonly renderToSvg: () => SVGSVGElement
}

export function createSlimeBlobEnemy(seed: number): SlimeBlobEnemy {
  // Initialize render parameters from seed
  const rng = createSeededRng(seed)
  
  const slimeColors = [0x22c55e, 0x3b82f6, 0x8b5cf6]
  const color = slimeColors[rng.nextInt(slimeColors.length)]
  
  const baseWidth = 28 + rng.nextInt(8)
  const baseHeight = 30 + rng.nextInt(6)
  const cornerRadius = 8 + rng.nextInt(4)
  const bulgeOffsetX = (rng.nextInt(5) - 2) * 2
  const bulgeOffsetY = (rng.nextInt(5) - 2) * 2
  const bulgeRadius = 6 + rng.nextInt(3)
  const highlightRadius = 4 + rng.nextInt(2)
  
  const width = 40
  const height = 36
  const centerX = width / 2
  const centerY = height - baseHeight / 2
  const eyeY = centerY - baseHeight / 4
  const eye1X = centerX - 4
  const eye2X = centerX + 4
  
  // Render functions (closures over computed values)
  const renderToPixi = (app: Application): Texture => {
    const g = new Graphics()
    
    g.roundRect(
      centerX - baseWidth / 2,
      centerY - baseHeight / 2,
      baseWidth,
      baseHeight,
      cornerRadius
    ).fill({ color, alpha: 0.85 })
    
    g.circle(
      centerX + bulgeOffsetX,
      centerY - baseHeight / 4 + bulgeOffsetY,
      bulgeRadius
    ).fill({ color, alpha: 0.6 })
    
    g.circle(
      centerX - baseWidth / 4,
      centerY - baseHeight / 3,
      highlightRadius
    ).fill({ color: 0xffffff, alpha: 0.3 })
    
    g.circle(eye1X, eyeY, 2).fill({ color: 0x000000, alpha: 0.8 })
    g.circle(eye2X, eyeY, 2).fill({ color: 0x000000, alpha: 0.8 })
    
    g.roundRect(
      centerX - baseWidth / 2,
      centerY - baseHeight / 2,
      baseWidth,
      baseHeight,
      cornerRadius
    ).stroke({ color: 0x000000, alpha: 0.2, width: 1 })
    
    return app.renderer.generateTexture(g)
  }
  
  const renderToSvg = (): SVGSVGElement => {
    const colorToCss = (hex: number): string => '#' + hex.toString(16).padStart(6, '0')
    
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    svg.setAttribute('width', String(width))
    svg.setAttribute('height', String(height))
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`)
    
    // ... rest of SVG creation logic (same as current implementation)
    
    return svg
  }
  
  return {
    seed,
    color,
    width,
    height,
    baseWidth,
    baseHeight,
    cornerRadius,
    bulgeOffsetX,
    bulgeOffsetY,
    bulgeRadius,
    highlightRadius,
    eyeY,
    eye1X,
    eye2X,
    renderToPixi,
    renderToSvg,
  }
}
```

**Step 2**: Update `BaseEnemyUnit` interface (or remove if not needed)

```typescript
// Keep interface for type checking, but make it a type alias
export type BaseEnemyUnit = {
  readonly seed: number
  readonly color: number
  readonly width: number
  readonly height: number
  readonly renderToPixi: (app: Application) => Texture
  readonly renderToSvg: () => SVGSVGElement
}
```

**Step 3**: Update usage in `spawn.ts`

```typescript
// Before:
const enemyUnit = new SlimeBlobEnemy(seed)

// After:
const enemyUnit = createSlimeBlobEnemy(seed)
```

**Benefits**:
- ✅ No class inheritance
- ✅ Functional composition
- ✅ Same API, easier to test
- ✅ Aligns with `javascript.mdc`

---

## Recommendation 2: WheelStripView (COMPLEX - Hybrid Approach)

### Challenge

`WheelStripView` must extend PixiJS `Container` to be part of the scene graph. However, we can minimize the class to just PixiJS integration and extract logic to composed functions.

### Strategy: "Thin Class Wrapper"

Keep a minimal class for PixiJS integration, but extract all logic to pure functions that are composed.

### Refactored Implementation

**Step 1**: Extract state and logic to separate modules

```typescript
// web/src/pixi/wheel/wheelStripViewState.ts

export type WheelStripViewState = {
  readonly app: Application
  readonly iconSize: number
  readonly visibleCount: number
  readonly slotSpacing: number
  readonly iconsLayer: Container
  readonly clipMask: Graphics
  readonly sprites: Sprite[]
  readonly textureCache: Map<IconId, Texture>
  readonly overlayLayer: Container
  readonly topBlock: Graphics
  readonly bottomBlock: Graphics
  readonly frame: Graphics
  readonly selector: Graphics
  readonly valueLabel: Text
  valueBaseY: number
  isDragging: boolean
  dragStartX: number
  originalX: number
  isDraggable: boolean
  lastActualVisibleCount: number | null
  lastIsDamaged: boolean | null
}

export function createWheelStripViewState(
  app: Application,
  options: WheelStripViewOptions,
): WheelStripViewState {
  const visibleCount = options.visibleCount ?? WHEEL_CONFIG.visibleCount
  const slotSpacing = options.slotSpacing ?? WHEEL_CONFIG.slotSpacing
  const iconSize = options.iconSize ?? WHEEL_CONFIG.iconSize
  
  const iconsLayer = new Container()
  const clipMask = new Graphics()
  clipMask.alpha = 0
  
  const overlayLayer = new Container()
  const topBlock = new Graphics()
  const bottomBlock = new Graphics()
  const frame = new Graphics()
  const selector = new Graphics()
  const valueLabel = new Text({
    text: '',
    style: {
      fill: 0xffffff,
      fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif',
      fontSize: Math.round(iconSize * 0.42),
      fontWeight: '900',
      align: 'center',
      stroke: { color: 0x000000, width: Math.max(3, Math.round(iconSize * 0.08)) },
    },
  })
  valueLabel.anchor.set(0.5)
  valueLabel.visible = false
  valueLabel.alpha = 1
  
  const sprites: Sprite[] = []
  for (let i = 0; i < visibleCount; i += 1) {
    const sprite = new Sprite(createPlaceholderIconTexture(app, 'coin', 128))
    sprite.anchor.set(0.5)
    sprites.push(sprite)
    iconsLayer.addChild(sprite)
  }
  
  overlayLayer.addChild(topBlock)
  overlayLayer.addChild(bottomBlock)
  overlayLayer.addChild(frame)
  overlayLayer.addChild(selector)
  overlayLayer.addChild(valueLabel)
  
  return {
    app,
    iconSize,
    visibleCount,
    slotSpacing,
    iconsLayer,
    clipMask,
    sprites,
    textureCache: new Map(),
    overlayLayer,
    topBlock,
    bottomBlock,
    frame,
    selector,
    valueLabel,
    valueBaseY: 0,
    isDragging: false,
    dragStartX: 0,
    originalX: 0,
    isDraggable: true,
    lastActualVisibleCount: null,
    lastIsDamaged: null,
  }
}
```

**Step 2**: Extract rendering functions

```typescript
// web/src/pixi/wheel/wheelStripViewRendering.ts

import type { WheelStripViewState } from './wheelStripViewState'
import type { WheelStrip } from '../../game/wheel/wheelStrip'
import { getStripLayout } from '../../game/wheel/stripLayout'

export function renderWheelStripView(
  state: WheelStripViewState,
  strip: WheelStrip,
  scrollOffsetY: number,
): void {
  const layout = getStripLayout({
    strip,
    visibleCount: state.visibleCount,
    slotSpacing: state.slotSpacing,
  })
  
  const actualVisibleCount = layout.iconIds.length
  const isDamaged = strip.icons.length <= 3
  
  // Update sprites
  for (let i = 0; i < actualVisibleCount; i += 1) {
    const sprite = state.sprites[i]
    sprite.texture = getTextureForIconId(state, layout.iconIds[i])
    sprite.width = state.iconSize
    sprite.height = state.iconSize
    sprite.position.set(0, layout.yPositions[i] + scrollOffsetY)
    sprite.alpha = i === layout.selectedIndex ? 1 : 0.72
    sprite.visible = true
  }
  
  for (let i = actualVisibleCount; i < state.visibleCount; i += 1) {
    state.sprites[i].visible = false
  }
  
  // Only redraw when dimensions change
  const dimensionsChanged = state.lastActualVisibleCount !== actualVisibleCount
  const damageStateChanged = state.lastIsDamaged !== isDamaged
  
  if (dimensionsChanged || damageStateChanged) {
    renderFrame(state, actualVisibleCount, isDamaged)
    renderClipMask(state, actualVisibleCount)
    renderSoftBlocks(state, layout, actualVisibleCount)
    state.lastActualVisibleCount = actualVisibleCount
    state.lastIsDamaged = isDamaged
  }
  
  renderSelector(state, layout.selectedIndex)
}

function getTextureForIconId(state: WheelStripViewState, iconId: IconId): Texture {
  const cached = state.textureCache.get(iconId)
  if (cached) return cached
  
  const texture = createPlaceholderIconTexture(state.app, iconId, 128)
  state.textureCache.set(iconId, texture)
  return texture
}

function renderFrame(state: WheelStripViewState, actualVisibleCount: number, isDamaged: boolean): void {
  // ... rendering logic
}

function renderClipMask(state: WheelStripViewState, actualVisibleCount: number): void {
  // ... rendering logic
}

function renderSoftBlocks(state: WheelStripViewState, layout: StripLayout, actualVisibleCount: number): void {
  // ... rendering logic
}

function renderSelector(state: WheelStripViewState, selectedIndex: number): void {
  // ... rendering logic
}
```

**Step 3**: Extract drag handling functions

```typescript
// web/src/pixi/wheel/wheelStripViewDrag.ts

import type { WheelStripViewState } from './wheelStripViewState'

export function setupDragInteraction(
  container: Container,
  state: WheelStripViewState,
  onDragStart: (event: { globalX: number; globalY: number }) => void,
  onDragMove: (event: { globalX: number; globalY: number }) => void,
  onDragEnd: (event: { globalX: number; globalY: number }) => void,
): void {
  container.eventMode = 'static'
  container.cursor = 'grab'
  
  container.on('pointerdown', onDragStart)
  container.on('pointermove', onDragMove)
  container.on('pointerup', onDragEnd)
  container.on('pointerupoutside', onDragEnd)
}

export function handleDragStart(
  container: Container,
  state: WheelStripViewState,
  event: { globalX: number; globalY: number },
): void {
  if (!state.isDraggable || state.isDragging) return
  
  state.isDragging = true
  state.dragStartX = event.globalX
  state.originalX = container.x
  container.cursor = 'grabbing'
  container.alpha = 0.8
  container.zIndex = 1000
}

export function handleDragMove(
  container: Container,
  state: WheelStripViewState,
  event: { globalX: number; globalY: number },
): void {
  if (!state.isDragging) return
  
  const globalPoint = { x: event.globalX, y: event.globalY }
  const localPoint = container.parent?.toLocal(globalPoint) ?? globalPoint
  const startLocalPoint = container.parent?.toLocal({ x: state.dragStartX, y: 0 }) ?? { x: state.dragStartX, y: 0 }
  
  const dx = localPoint.x - startLocalPoint.x
  container.x = state.originalX + dx
}

export function handleDragEnd(
  container: Container,
  state: WheelStripViewState,
): void {
  if (!state.isDragging) return
  
  state.isDragging = false
  container.cursor = 'grab'
  container.alpha = 1
  container.zIndex = 0
}
```

**Step 4**: Create thin class wrapper

```typescript
// web/src/pixi/wheel/WheelStripView.ts

import { Container } from 'pixi.js'
import type { Application } from 'pixi.js'
import type { WheelStrip } from '../../game/wheel/wheelStrip'
import { createWheelStripViewState, type WheelStripViewState } from './wheelStripViewState'
import { renderWheelStripView } from './wheelStripViewRendering'
import { setupDragInteraction, handleDragStart, handleDragMove, handleDragEnd } from './wheelStripViewDrag'

export type WheelStripViewOptions = {
  visibleCount?: number
  slotSpacing?: number
  iconSize?: number
}

export type WheelStripViewAPI = {
  readonly container: Container
  setDraggable: (draggable: boolean) => void
  setDragPosition: (x: number) => void
  showValue: (value: number) => void
  showBonus: (value: number) => void
  hideValue: () => void
  rollOffValue: (options?: { distancePx?: number; durationMs?: number }) => Promise<void>
  update: (strip: WheelStrip, scrollOffsetY?: number) => void
}

/**
 * Creates a wheel strip view using functional composition.
 * Returns a Container (for PixiJS scene graph) and API methods.
 */
export function createWheelStripView(
  app: Application,
  strip: WheelStrip,
  options: WheelStripViewOptions = {},
): WheelStripViewAPI {
  const state = createWheelStripViewState(app, options)
  const container = new Container()
  
  // Setup container hierarchy
  container.addChild(state.clipMask)
  container.addChild(state.iconsLayer)
  state.iconsLayer.mask = state.clipMask
  container.addChild(state.overlayLayer)
  
  // Initial render
  const initialLayout = getStripLayout({
    strip,
    visibleCount: state.visibleCount,
    slotSpacing: state.slotSpacing,
  })
  const initialVisibleCount = initialLayout.iconIds.length
  const initialIsDamaged = strip.icons.length <= 3
  
  state.lastActualVisibleCount = initialVisibleCount
  state.lastIsDamaged = initialIsDamaged
  
  renderWheelStripView(state, strip, 0)
  
  // Setup drag interaction
  setupDragInteraction(
    container,
    state,
    (event) => {
      handleDragStart(container, state, event)
      container.emit('dragstart', { wheel: container, originalX: state.originalX })
    },
    (event) => {
      handleDragMove(container, state, event)
      container.emit('dragmove', { wheel: container, x: container.x, globalX: event.globalX })
    },
    (event) => {
      handleDragEnd(container, state)
      container.emit('dragend', { wheel: container, x: container.x, globalX: event.globalX })
    },
  )
  
  return {
    container,
    setDraggable: (draggable: boolean) => {
      state.isDraggable = draggable
      container.eventMode = draggable ? 'static' : 'auto'
      container.cursor = draggable ? 'grab' : 'default'
      if (!draggable && state.isDragging) {
        handleDragEnd(container, state)
      }
    },
    setDragPosition: (x: number) => {
      container.x = x
    },
    showValue: (value: number) => {
      showLabel(state, { text: `+${value}`, fill: 0xffffff })
    },
    showBonus: (value: number) => {
      showLabel(state, { text: `+${value}`, fill: 0xfbbf24 })
    },
    hideValue: () => {
      state.valueLabel.visible = false
      state.valueLabel.alpha = 1
      state.valueLabel.position.set(0, state.valueBaseY)
    },
    rollOffValue: async (options = {}) => {
      // ... animation logic
    },
    update: (strip: WheelStrip, scrollOffsetY = 0) => {
      renderWheelStripView(state, strip, scrollOffsetY)
    },
  }
}
```

**Step 5**: Update usage in `mountPixi.ts`

```typescript
// Before:
const view = new WheelStripView(app, strip, { visibleCount, slotSpacing, iconSize })
machine.addChild(view)

// After:
const view = createWheelStripView(app, strip, { visibleCount, slotSpacing, iconSize })
machine.addChild(view.container)

// Update method calls:
wheels[i].view.showValue(value)  // Still works (API methods)
wheels[i].view.update(newStrip)  // Still works
```

**Benefits**:
- ✅ Logic extracted to pure functions (testable)
- ✅ Minimal class usage (only Container for PixiJS)
- ✅ Functional composition pattern
- ✅ Easier to test individual functions
- ✅ Aligns with `javascript.mdc` principles

---

## Migration Plan

### Phase 1: SlimeBlobEnemy (Low Risk)
1. Create `createSlimeBlobEnemy` function
2. Update all usages (`spawn.ts`, tests)
3. Remove class
4. Run tests

**Estimated Effort**: 2-3 hours

### Phase 2: WheelStripView (Medium Risk)
1. Extract state creation function
2. Extract rendering functions
3. Extract drag handling functions
4. Create `createWheelStripView` factory
5. Update `mountPixi.ts` usage
6. Update tests
7. Remove class

**Estimated Effort**: 4-6 hours

---

## Testing Strategy

### For SlimeBlobEnemy
- ✅ Same tests work (just change `new` to function call)
- ✅ Test deterministic generation (same seed = same output)
- ✅ Test render methods return correct types

### For WheelStripView
- ✅ Test state creation
- ✅ Test rendering functions in isolation
- ✅ Test drag handling functions
- ✅ Integration test: factory creates working view
- ✅ Browser test: visual rendering still works

---

## Alternative: Accept PixiJS Constraint

If the refactor is too complex, consider:

1. **Document the exception**: Add comment explaining why `WheelStripView` extends Container
2. **Minimize class logic**: Extract as much as possible to functions
3. **Focus on SlimeBlobEnemy**: This is a pure refactor with no constraints

The `javascript.mdc` guideline says "avoid class and extends as much as possible" - it doesn't say "never". PixiJS integration is a valid exception.

---

## Recommendation Summary

**Priority 1**: Refactor `SlimeBlobEnemy` ✅
- Pure refactor, no constraints
- Easy win for functional programming alignment

**Priority 2**: Refactor `WheelStripView` (Optional)
- More complex due to PixiJS constraint
- Can accept as exception with documentation
- Or do hybrid approach (extract logic, keep thin wrapper)

**Decision**: Start with `SlimeBlobEnemy`, then evaluate if `WheelStripView` refactor is worth the effort.
