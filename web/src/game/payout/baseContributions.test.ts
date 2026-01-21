import { describe, expect, test } from 'vitest'

import { calcBaseContributions } from './baseContributions'

describe('calcBaseContributions', () => {
  test('returns per-wheel contributions and total', () => {
    const out = calcBaseContributions({ landedIcons: ['cherry', 'lemon', 'seven'] })
    expect(out.contributions).toEqual([5, 4, 12])
    expect(out.total).toBe(21)
  })
})

