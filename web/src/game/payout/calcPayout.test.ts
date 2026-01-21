import { describe, expect, test } from 'vitest'

import { calcPayout } from './calcPayout'

describe('calcPayout', () => {
  test('computes base payout from icon values', () => {
    const payout = calcPayout({ landedIcons: ['cherry', 'lemon', 'seven', 'coin', 'bar'] })
    // 5 + 4 + 12 + 6 + 9 = 36
    expect(payout.lines[0]).toEqual({ label: 'Base', amount: 36 })
    expect(payout.total).toBeGreaterThanOrEqual(36)
  })

  test('adds a combo bonus for pairs', () => {
    const payout = calcPayout({ landedIcons: ['coin', 'coin', 'lemon', 'seven', 'bar'] })
    expect(payout.lines).toEqual(
      expect.arrayContaining([{ label: '2x coin', amount: 10 }]),
    )
    expect(payout.total).toBe(payout.lines.reduce((s, l) => s + l.amount, 0))
  })

  test('adds a combo bonus for five of a kind', () => {
    const payout = calcPayout({ landedIcons: ['seven', 'seven', 'seven', 'seven', 'seven'] })
    expect(payout.lines).toEqual(
      expect.arrayContaining([{ label: '5x seven', amount: 250 }]),
    )
  })
})

