import { Application, Container, Graphics } from 'pixi.js'

import { LAYOUT_CONFIG } from '../game/config/layoutConfig'
import { WHEEL_CONFIG } from '../game/config/wheelConfig'
import { ICON_IDS } from '../game/icons/iconIds'
import { computeCenteredGridLayout } from '../game/machine/gridLayout'
import { createRuntimeRng } from '../game/rng/rng'
import { createSpinPlan } from '../game/spin/spinPlan'
import type { SpinResult } from '../game/spin/spinResult'
import { iconValues } from '../game/payout/iconValues'
import { advanceCursor, createWheelStrip, removeIcon, type WheelStrip } from '../game/wheel/wheelStrip'
import { getSelectedIcon } from '../game/wheel/wheelStrip'
import { getUpperRightmostIconIndex } from '../game/wheel/iconTargeting'
import { WheelStripView } from './wheel/WheelStripView'

export type MountedPixi = {
  app: Application
  spin: () => void
  isSpinning: () => boolean
  getLastResult: () => SpinResult | null
  setLocked: (locked: boolean) => void
  showWheelValues: (values: readonly number[]) => void
  showWheelValue: (wheelIndex: number, value: number) => void
  showWheelBonus: (wheelIndex: number, value: number) => void
  rollOffWheelValue: (wheelIndex: number) => Promise<void>
  hideWheelValues: () => void
  removeIconFromWheel: (wheelIndex: number) => boolean
  getWheelCount: () => number
  isGameOver: () => boolean
  destroy: () => void
}

// Helper function to initialize PixiJS app with timeout and explicit dimensions
async function initPixiAppWithTimeout(
  app: Application,
  rootEl: HTMLElement,
  options: { background?: number; antialias?: boolean },
  timeoutMs = 5000,
): Promise<void> {
  const width = rootEl.offsetWidth || window.innerWidth
  const height = rootEl.offsetHeight || Math.floor(window.innerHeight * 0.6)

  console.log('[initPixiApp] Using explicit dimensions:', { width, height })

  const initPromise = app.init({
    width,
    height,
    background: options.background ?? 0x000000,
    antialias: options.antialias ?? false,
  })

  const timeoutPromise = new Promise<never>((_resolve, reject) => {
    setTimeout(() => {
      reject(new Error(`PixiJS app.init() timed out after ${timeoutMs}ms`))
    }, timeoutMs)
  })

  await Promise.race([initPromise, timeoutPromise])
}

export async function mountPixi(
  root: HTMLElement,
  options: { onSpinComplete?: (result: SpinResult) => void } = {},
): Promise<MountedPixi> {
  console.log('[mountPixi] Starting initialization...')
  const rootWidth = root.offsetWidth
  const rootHeight = root.offsetHeight
  console.log('[mountPixi] Root element:', {
    id: root.id,
    tagName: root.tagName,
    width: rootWidth,
    height: rootHeight,
  })

  // Check WebGL availability
  const canvas = document.createElement('canvas')
  const gl = canvas.getContext('webgl') || canvas.getContext('webgl2')
  if (!gl) {
    const error = new Error('WebGL is not available in this browser')
    console.error('[mountPixi] WebGL check failed:', error)
    throw error
  }
  console.log('[mountPixi] WebGL available')

  const app = new Application()

  try {
    await initPixiAppWithTimeout(
      app,
      root,
      { background: 0x0b1020, antialias: true },
      5000,
    )
    console.log('[mountPixi] Application initialized successfully')
    console.log('[mountPixi] Canvas:', {
      exists: !!app.canvas,
      width: app.canvas.width,
      height: app.canvas.height,
    })
  } catch (error) {
    console.error('[mountPixi] Failed to initialize application:', error)
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.error('[mountPixi] Error details:', {
      message: errorMessage,
      rootDimensions: { width: rootWidth, height: rootHeight },
      webglAvailable: !!gl,
    })
    throw error
  }

  root.appendChild(app.canvas)
  console.log('[mountPixi] Canvas appended to root element')

  const { count: WHEEL_COUNT, visibleCount, slotSpacing, iconSize } = WHEEL_CONFIG

  const wheelWidth = iconSize + 36
  // Use maximum possible height for layout spacing - individual wheels may be smaller
  // when icons are removed, but layout spacing accommodates the largest wheel
  const wheelHeight = (visibleCount - 1) * slotSpacing + iconSize + 36

  const machine = new Container()
  app.stage.addChild(machine)

  const rng = createRuntimeRng()
  let spinIndex = 0
  let lastResult: SpinResult | null = null
  let locked = false
  let gameOver = false

  const wheels = Array.from({ length: WHEEL_COUNT }, (_, wheelIdx) => {
    const strip: WheelStrip = createWheelStrip(ICON_IDS, wheelIdx)
    const view = new WheelStripView(app, strip, { visibleCount, slotSpacing, iconSize })
    machine.addChild(view)
    return { strip, view, wheelIdx }
  })

  // State variables (declared before functions that use them)
  let activeSpin:
    | null
    | {
        readonly startMs: number
        readonly wheelStates: readonly {
          readonly plan: ReturnType<typeof createSpinPlan>
          readonly startStrip: WheelStrip
          done: boolean
        }[]
      } = null

  // Drag and drop state
  let draggedWheel: (typeof wheels)[number] | null = null
  let draggedWheelOriginalIndex: number | null = null
  let dropZoneIndicator: Graphics | null = null
  
  // Drag performance optimization state
  let pendingDragMove: { globalX: number } | null = null
  let dragAnimationFrameId: number | null = null
  let cachedLayoutPoints: { x: number; y: number }[] | null = null
  let cachedWheelCount: number | null = null
  let lastDropZoneIndex: number | null = null

  // Setup drag and drop handlers
  const setupDragAndDrop = () => {
    // Remove all existing event listeners from all wheels
    for (const wheel of wheels) {
      wheel.view.removeAllListeners('dragstart')
      wheel.view.removeAllListeners('dragmove')
      wheel.view.removeAllListeners('dragend')
    }

    // Add fresh event listeners
    for (let i = 0; i < wheels.length; i += 1) {
      const wheel = wheels[i]
      wheel.view.on('dragstart', (_event: { wheel: WheelStripView; originalX: number }) => {
        if (activeSpin || locked || gameOver) return
        draggedWheel = wheel
        draggedWheelOriginalIndex = i
        updateDragState()
        
        // Cache layout points for the entire drag operation
        const actualWheelCount = wheels.length
        const w = app.renderer.width
        cachedLayoutPoints = computeCenteredGridLayout({
          count: actualWheelCount,
          containerWidth: w,
          wheelWidth,
          wheelHeight,
          gapX: LAYOUT_CONFIG.wheelGapX,
          gapY: LAYOUT_CONFIG.wheelGapY,
          maxCols: LAYOUT_CONFIG.maxWheelCols,
        })
        cachedWheelCount = actualWheelCount
        lastDropZoneIndex = null
      })

      wheel.view.on('dragmove', (event: { wheel: WheelStripView; x: number; globalX: number }) => {
        if (draggedWheel === null) return
        
        // Queue the latest drag position for next animation frame
        pendingDragMove = { globalX: event.globalX }
        
        // Schedule update if not already scheduled
        if (dragAnimationFrameId === null) {
          dragAnimationFrameId = requestAnimationFrame(() => {
            if (pendingDragMove) {
              showDropZone(pendingDragMove.globalX)
              pendingDragMove = null
            }
            dragAnimationFrameId = null
          })
        }
      })

      wheel.view.on('dragend', ({ globalX }: { wheel: WheelStripView; x: number; globalX: number }) => {
        if (draggedWheel === null) return
        
        // Cancel any pending animation frame
        if (dragAnimationFrameId !== null) {
          cancelAnimationFrame(dragAnimationFrameId)
          dragAnimationFrameId = null
        }
        pendingDragMove = null
        
        handleWheelDrop(globalX)
        draggedWheel = null
        draggedWheelOriginalIndex = null
        hideDropZone()
        
        // Clear cached layout points
        cachedLayoutPoints = null
        cachedWheelCount = null
        lastDropZoneIndex = null
        
        updateDragState()
      })
    }
  }

  const updateDragState = () => {
    const canDrag = !activeSpin && !locked
    for (const wheel of wheels) {
      wheel.view.setDraggable(canDrag)
    }
  }

  const showDropZone = (globalX: number) => {
    if (!dropZoneIndicator) {
      dropZoneIndicator = new Graphics()
      machine.addChild(dropZoneIndicator)
    }

    // Use cached layout points if available, otherwise calculate
    const points = cachedLayoutPoints ?? computeCenteredGridLayout({
      count: cachedWheelCount ?? wheels.length,
      containerWidth: app.renderer.width,
      wheelWidth,
      wheelHeight,
      gapX: LAYOUT_CONFIG.wheelGapX,
      gapY: LAYOUT_CONFIG.wheelGapY,
      maxCols: LAYOUT_CONFIG.maxWheelCols,
    })

    // Convert global screen coordinates to machine-local coordinates (cached during drag)
    const screenPoint = { x: globalX, y: 0 }
    const localPoint = machine.toLocal(screenPoint)

    // Find nearest drop position
    let nearestIndex = 0
    let minDistance = Infinity
    for (let i = 0; i < points.length; i += 1) {
      const distance = Math.abs(points[i].x - localPoint.x)
      if (distance < minDistance) {
        minDistance = distance
        nearestIndex = i
      }
    }

    // Only redraw if the target index has changed
    if (lastDropZoneIndex === nearestIndex) {
      return
    }
    lastDropZoneIndex = nearestIndex

    // Draw drop zone indicator
    dropZoneIndicator.clear()
    const targetX = points[nearestIndex].x
    dropZoneIndicator
      .rect(targetX - wheelWidth / 2 - 2, -wheelHeight / 2 - 2, wheelWidth + 4, wheelHeight + 4)
      .stroke({ color: 0x60a5fa, alpha: 0.6, width: 3 })
  }

  const hideDropZone = () => {
    if (dropZoneIndicator) {
      dropZoneIndicator.clear()
    }
  }

  const destroyWheel = (wheelIndex: number) => {
    const wheel = wheels[wheelIndex]
    if (!wheel) return

    // Remove wheel view from machine container
    machine.removeChild(wheel.view)
    
    // Clean up wheel view
    wheel.view.destroy({ children: true })

    // If this wheel was being dragged, clear drag state
    if (draggedWheel === wheel) {
      draggedWheel = null
      draggedWheelOriginalIndex = null
      hideDropZone()
    }

    // Remove wheel from wheels array
    wheels.splice(wheelIndex, 1)

    // Recalculate layout to fill gap
    layout()

    // Update drag and drop handlers for remaining wheels
    setupDragAndDrop()
    updateDragState()

    // Check for game over
    if (wheels.length === 0) {
      triggerGameOver()
    }
  }

  const triggerGameOver = () => {
    // Mark game as over
    gameOver = true
    
    // Stop all game loops by setting locked state
    locked = true
    updateDragState()

    // Show game over message (simple alert for now, can be improved later)
    alert('Game Over! All wheels have been destroyed.')
  }

  const handleWheelDrop = (globalX: number) => {
    if (draggedWheel === null || draggedWheelOriginalIndex === null) return

    // Convert global screen coordinates to machine-local coordinates
    const screenPoint = { x: globalX, y: 0 }
    const localPoint = machine.toLocal(screenPoint)

    // Calculate target wheel index using the same layout calculation as layout()
    const w = app.renderer.width
    const points = computeCenteredGridLayout({
      count: WHEEL_COUNT,
      containerWidth: w,
      wheelWidth,
      wheelHeight,
      gapX: LAYOUT_CONFIG.wheelGapX,
      gapY: LAYOUT_CONFIG.wheelGapY,
      maxCols: LAYOUT_CONFIG.maxWheelCols,
    })

    let targetIndex = 0
    let minDistance = Infinity
    for (let i = 0; i < points.length; i += 1) {
      const distance = Math.abs(points[i].x - localPoint.x)
      if (distance < minDistance) {
        minDistance = distance
        targetIndex = i
      }
    }

    // Find current index of dragged wheel in array (by reference, not by original index)
    const currentSourceIndex = wheels.findIndex((w) => w === draggedWheel)
    if (currentSourceIndex === -1) return

    // Reorder wheels array with minimal position changes
    // Only reorder if target is different from current position
    if (targetIndex !== currentSourceIndex) {
      // Remove wheel from current position
      const [movedWheel] = wheels.splice(currentSourceIndex, 1)

      // Adjust targetIndex: if we removed from before the target, target shifts left by 1
      const adjustedTargetIndex = currentSourceIndex < targetIndex ? targetIndex - 1 : targetIndex

      // Insert at target position
      wheels.splice(adjustedTargetIndex, 0, movedWheel)

      // Visual feedback: briefly highlight the moved wheel
      movedWheel.view.alpha = 0.9
      setTimeout(() => {
        movedWheel.view.alpha = 1
      }, 200)
    }

    // Update layout to reflect new order - this will reset all wheel positions correctly
    layout()
  }

  const layout = () => {
    const w = app.renderer.width
    const h = app.renderer.height

    machine.position.set(Math.round(w / 2), Math.round(h / 2))

    // Use actual wheel count instead of WHEEL_COUNT constant
    const actualWheelCount = wheels.length

    const points = computeCenteredGridLayout({
      count: actualWheelCount,
      containerWidth: w,
      wheelWidth,
      wheelHeight,
      gapX: LAYOUT_CONFIG.wheelGapX,
      gapY: LAYOUT_CONFIG.wheelGapY,
      maxCols: LAYOUT_CONFIG.maxWheelCols,
    })

    for (let i = 0; i < wheels.length; i += 1) {
      wheels[i].view.position.set(points[i].x, points[i].y)
    }

    // Fit machine into available canvas bounds so wheels are never clipped.
    let minX = Infinity
    let maxX = -Infinity
    let minY = Infinity
    let maxY = -Infinity

    for (const p of points) {
      minX = Math.min(minX, p.x - wheelWidth / 2)
      maxX = Math.max(maxX, p.x + wheelWidth / 2)
      minY = Math.min(minY, p.y - wheelHeight / 2)
      maxY = Math.max(maxY, p.y + wheelHeight / 2)
    }

    const contentW = Math.max(1, maxX - minX)
    const contentH = Math.max(1, maxY - minY)

    const scale = Math.min(
      1,
      (w * LAYOUT_CONFIG.viewportPadding) / contentW,
      (h * LAYOUT_CONFIG.viewportPadding) / contentH,
    )
    machine.scale.set(scale)
  }

  const startSpin = () => {
    if (activeSpin || locked || gameOver) return

    const wheelStates = wheels.map((w, i) => ({
      plan: createSpinPlan({
        strip: w.strip,
        rng,
        durationMs: WHEEL_CONFIG.spinDurationsMs[i] ?? 1000,
        minFullRotations: WHEEL_CONFIG.minFullRotations,
      }),
      startStrip: w.strip,
      done: false,
    }))
    spinIndex += 1

    activeSpin = { startMs: performance.now(), wheelStates }
    updateDragState()
  }

  const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)

  app.ticker.add(() => {
    if (!activeSpin) return

    const elapsedMs = performance.now() - activeSpin.startMs

    for (let i = 0; i < wheels.length; i += 1) {
      const ws = activeSpin.wheelStates[i]
      if (ws.done) continue

      const plan = ws.plan
      const startStrip = ws.startStrip

      const tRaw = elapsedMs / plan.durationMs
      const t = Math.max(0, Math.min(1, tRaw))
      const eased = easeOutCubic(t)

      const totalSteps = plan.steps
      const progressedSteps = totalSteps * eased
      const wholeSteps = Math.floor(progressedSteps)
      const frac = progressedSteps - wholeSteps

      const tempStrip = wholeSteps === 0 ? startStrip : advanceCursor(startStrip, wholeSteps)
      const scrollOffsetY = -frac * wheels[i].view.slotSpacing
      wheels[i].view.update(tempStrip, scrollOffsetY)

      if (t >= 1) {
        const finalStrip = advanceCursor(startStrip, totalSteps)
        wheels[i].strip = finalStrip
        wheels[i].view.update(finalStrip, 0)
        ws.done = true
      }
    }

    if (activeSpin.wheelStates.every((s) => s.done)) {
      lastResult = { landedIcons: wheels.map((w) => getSelectedIcon(w.strip)) }
      options.onSpinComplete?.(lastResult)
      activeSpin = null
    }
  })

  window.addEventListener('resize', layout)

  // Setup drag and drop after layout is defined
  setupDragAndDrop()
  updateDragState()

  // Initial layout call
  layout()

  return {
    app,
    spin: startSpin,
    isSpinning: () => activeSpin !== null,
    getLastResult: () => lastResult,
    setLocked: (v: boolean) => {
      locked = v
      updateDragState()
    },
    showWheelValues: (values: readonly number[]) => {
      for (let i = 0; i < wheels.length; i += 1) {
        wheels[i].view.showValue(values[i] ?? iconValues[getSelectedIcon(wheels[i].strip)])
      }
    },
    showWheelValue: (wheelIndex: number, value: number) => {
      const w = wheels[wheelIndex]
      if (!w) return
      w.view.showValue(value)
    },
    showWheelBonus: (wheelIndex: number, value: number) => {
      const w = wheels[wheelIndex]
      if (!w) return
      w.view.showBonus(value)
    },
    rollOffWheelValue: async (wheelIndex: number) => {
      const w = wheels[wheelIndex]
      if (!w) return
      await w.view.rollOffValue()
    },
    hideWheelValues: () => {
      for (const w of wheels) w.view.hideValue()
    },
    removeIconFromWheel: (wheelIndex: number) => {
      const wheel = wheels[wheelIndex]
      if (!wheel) return false

      // Check if this is the last icon - if so, destroy the wheel
      if (wheel.strip.icons.length <= 1) {
        // Destroy the wheel
        destroyWheel(wheelIndex)
        return true
      }

      try {
        // Get the upper-rightmost icon index
        const iconIndex = getUpperRightmostIconIndex(wheel.strip, visibleCount)
        // Remove the icon
        const newStrip = removeIcon(wheel.strip, iconIndex)
        wheel.strip = newStrip
        // Update the view to reflect the change
        wheel.view.update(newStrip)
        // Visual feedback: briefly flash the wheel to indicate icon removal
        wheel.view.alpha = 0.7
        setTimeout(() => {
          wheel.view.alpha = 1
        }, 150)
        return true
      } catch (error) {
        // Icon removal failed - should not happen now, but handle gracefully
        return false
      }
    },
    getWheelCount: () => wheels.length,
    isGameOver: () => gameOver,
    destroy: () => {
      window.removeEventListener('resize', layout)
      app.destroy(true)
    },
  }
}

