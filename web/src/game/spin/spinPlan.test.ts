import { describe, expect, test } from 'vitest'

import { createSeededRng } from '../rng/rng'
import { createWheelStrip } from '../wheel/wheelStrip'

import { createSpinPlan } from './spinPlan'

describe('createSpinPlan', () => {
  test('returns a plan that lands on a valid icon', () => {
    const strip = createWheelStrip(['cherry', 'lemon', 'seven'], 0)
    const rng = createSeededRng(42)
    const plan = createSpinPlan({ strip, rng, durationMs: 1000 })

    expect(plan.durationMs).toBe(1000)
    expect(plan.steps).toBeGreaterThanOrEqual(6) // 2 full rotations (2*3)
    expect(plan.finalCursor).toBeGreaterThanOrEqual(0)
    expect(plan.finalCursor).toBeLessThanOrEqual(2)
    expect(strip.icons).toContain(plan.finalIconId)
    expect(plan.finalIconId).toBe(strip.icons[plan.finalCursor])
  })

  test('is deterministic given a deterministic RNG', () => {
    const strip = createWheelStrip(['cherry', 'lemon', 'seven'], 1)
    const a = createSpinPlan({ strip, rng: createSeededRng(7), durationMs: 900 })
    const b = createSpinPlan({ strip, rng: createSeededRng(7), durationMs: 900 })
    expect(a).toEqual(b)
  })
})

