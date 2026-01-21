import { Application, Container, Graphics } from 'pixi.js'

import { LAYOUT_CONFIG } from '../game/config/layoutConfig'
import { WHEEL_CONFIG } from '../game/config/wheelConfig'
import { ICON_IDS } from '../game/icons/iconIds'
import { computeCenteredGridLayout } from '../game/machine/gridLayout'
import { createRuntimeRng } from '../game/rng/rng'
import { createSpinPlan } from '../game/spin/spinPlan'
import type { SpinResult } from '../game/spin/spinResult'
import { iconValues } from '../game/payout/iconValues'
import { advanceCursor, createWheelStrip, type WheelStrip } from '../game/wheel/wheelStrip'
import { getSelectedIcon } from '../game/wheel/wheelStrip'
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
  destroy: () => void
}

export async function mountPixi(
  root: HTMLElement,
  options: { onSpinComplete?: (result: SpinResult) => void } = {},
): Promise<MountedPixi> {
  const app = new Application()

  await app.init({
    resizeTo: root,
    background: 0x0b1020,
    antialias: true,
  })

  root.appendChild(app.canvas)

  const { count: WHEEL_COUNT, visibleCount, slotSpacing, iconSize } = WHEEL_CONFIG

  const wheelWidth = iconSize + 36
  const wheelHeight = (visibleCount - 1) * slotSpacing + iconSize + 36

  const machine = new Container()
  app.stage.addChild(machine)

  const rng = createRuntimeRng()
  let spinIndex = 0
  let lastResult: SpinResult | null = null
  let locked = false

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

  // Setup drag and drop handlers
  const setupDragAndDrop = () => {
    for (let i = 0; i < wheels.length; i += 1) {
      const wheel = wheels[i]
      wheel.view.on('dragstart', (event: { wheel: WheelStripView; originalX: number }) => {
        if (activeSpin || locked) return
        draggedWheel = wheel
        draggedWheelOriginalIndex = i
        updateDragState()
      })

      wheel.view.on('dragmove', (event: { wheel: WheelStripView; x: number; globalX: number }) => {
        if (draggedWheel === null) return
        showDropZone(event.globalX)
      })

      wheel.view.on('dragend', (event: { wheel: WheelStripView; x: number; globalX: number }) => {
        if (draggedWheel === null) return
        handleWheelDrop(event.globalX)
        draggedWheel = null
        draggedWheelOriginalIndex = null
        hideDropZone()
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

    // Convert global screen coordinates to machine-local coordinates
    const screenPoint = { x: globalX, y: 0 }
    const localPoint = machine.toLocal(screenPoint)

    // Calculate which wheel position this corresponds to using the same layout calculation
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

    const points = computeCenteredGridLayout({
      count: WHEEL_COUNT,
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
    if (activeSpin || locked) return

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
    destroy: () => {
      window.removeEventListener('resize', layout)
      app.destroy(true)
    },
  }
}

