import { Application, Ticker } from 'pixi.js'
import { describe, expect, test, beforeEach, afterEach, vi } from 'vitest'

import { ICON_IDS } from '../../game/icons/iconIds'
import { createWheelStrip, type WheelStrip } from '../../game/wheel/wheelStrip'
import { WheelStripView } from './WheelStripView'

// Mock createPlaceholderIconTexture to return a valid texture
vi.mock('../icons/createPlaceholderIconTexture', () => ({
  createPlaceholderIconTexture: vi.fn(() => ({
    width: 128,
    height: 128,
    baseTexture: {
      width: 128,
      height: 128,
    },
  })),
}))

// Mock PixiJS Application to work in headless environment
vi.mock('pixi.js', async () => {
  const actual = await vi.importActual('pixi.js')
  return {
    ...actual,
    Application: class MockApplication {
      renderer = {
        width: 100,
        height: 100,
        generateTexture: vi.fn(() => ({
          width: 128,
          height: 128,
          baseTexture: {
            width: 128,
            height: 128,
          },
        })),
      }
      ticker = new Ticker()
      stage = { addChild: vi.fn() }
      canvas = document.createElement('canvas')
      async init() {
        return this
      }
      destroy() {
        // Mock destroy
      }
    },
  }
})

describe('WheelStripView', () => {
  let app: Application
  let strip: WheelStrip

  beforeEach(async () => {
    app = new Application()
    await app.init({ width: 100, height: 100, antialias: false })
    strip = createWheelStrip(ICON_IDS, 0)
  })

  afterEach(() => {
    if (app) {
      app.destroy()
    }
  })

  test('given WheelStripView is instantiated with a WheelStrip, should render visibleCount icon sprites', () => {
    const view = new WheelStripView(app, strip, { visibleCount: 5 })
    expect(view.children.length).toBeGreaterThan(0)
    // Access private sprites array for testing
    const sprites = (view as any).sprites as any[]
    expect(sprites.length).toBe(5)
    expect(sprites.every((s) => s !== undefined)).toBe(true)
  })

  test('given update is called with a new strip, should update sprite positions correctly', () => {
    const view = new WheelStripView(app, strip, { visibleCount: 7, slotSpacing: 88 })
    const initialStrip = createWheelStrip(ICON_IDS, 0)
    const updatedStrip = createWheelStrip(ICON_IDS, 1)

    view.update(initialStrip)
    const sprites = (view as any).sprites as any[]
    const initialPositions = sprites.map((s) => s.position.y)

    view.update(updatedStrip)
    const updatedPositions = sprites.map((s) => s.position.y)

    // Positions should change when strip cursor changes (different icons at different offsets)
    expect(updatedPositions).not.toEqual(initialPositions)
  })

  test('given update is called with scrollOffset, should offset sprite positions', () => {
    const view = new WheelStripView(app, strip, { visibleCount: 7, slotSpacing: 88 })
    const testStrip = createWheelStrip(ICON_IDS, 0)

    view.update(testStrip, 0)
    const sprites = (view as any).sprites as any[]
    const positionsNoOffset = sprites.map((s) => s.position.y)

    view.update(testStrip, 10)
    const positionsWithOffset = sprites.map((s) => s.position.y)

    // Positions with offset should be offset by 10
    expect(positionsWithOffset[0]).toBe(positionsNoOffset[0] + 10)
  })

  test('given showValue is called, should display value label with correct text and color', () => {
    const view = new WheelStripView(app, strip)
    view.showValue(42)

    // Access private valueLabel through type assertion for testing
    const valueLabel = (view as any).valueLabel
    expect(valueLabel.visible).toBe(true)
    expect(valueLabel.text).toBe('+42')
    expect(valueLabel.style.fill).toBe(0xffffff)
  })

  test('given showBonus is called, should display bonus label with gold color', () => {
    const view = new WheelStripView(app, strip)
    view.showBonus(100)

    const valueLabel = (view as any).valueLabel
    expect(valueLabel.visible).toBe(true)
    expect(valueLabel.text).toBe('+100')
    expect(valueLabel.style.fill).toBe(0xfbbf24)
  })

  test('given hideValue is called, should hide the value label', () => {
    const view = new WheelStripView(app, strip)
    view.showValue(50)
    const valueLabel = (view as any).valueLabel
    expect(valueLabel.visible).toBe(true)

    view.hideValue()
    expect(valueLabel.visible).toBe(false)
    expect(valueLabel.alpha).toBe(1)
  })

  test('given rollOffValue is called when label is not visible, should return immediately', async () => {
    const view = new WheelStripView(app, strip)
    // Don't show value first

    const result = await view.rollOffValue()

    // Should complete immediately without error
    expect(result).toBeUndefined()
  })

  test('given rollOffValue is called, should animate label upward and fade out', async () => {
    vi.useFakeTimers()
    const view = new WheelStripView(app, strip)
    view.showValue(25)

    const valueLabel = (view as any).valueLabel
    const startY = valueLabel.y
    const startAlpha = valueLabel.alpha

    const rollOffPromise = view.rollOffValue({ distancePx: 20, durationMs: 100 })

    // Manually trigger ticker updates to simulate animation
    const tick = () => {
      app.ticker.update()
    }

    // Advance time and trigger ticks
    vi.advanceTimersByTime(50)
    tick()
    await Promise.resolve()

    const midY = valueLabel.y
    const midAlpha = valueLabel.alpha

    // Should have moved upward and started fading
    expect(midY).toBeLessThan(startY)
    expect(midAlpha).toBeLessThan(startAlpha)

    // Complete animation
    vi.advanceTimersByTime(100)
    tick()
    await rollOffPromise

    // After animation, should be hidden
    expect(valueLabel.visible).toBe(false)

    vi.useRealTimers()
  })
})
