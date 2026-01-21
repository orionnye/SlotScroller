import { describe, expect, test } from 'vitest'

import { createSeededRng } from './rng'

describe('rng', () => {
  test('createSeededRng is deterministic for the same seed', () => {
    const a = createSeededRng(123)
    const b = createSeededRng(123)

    const seqA = Array.from({ length: 10 }, () => a.nextInt(1000))
    const seqB = Array.from({ length: 10 }, () => b.nextInt(1000))

    expect(seqA).toEqual(seqB)
  })

  test('nextInt returns values in [0..maxExclusive-1]', () => {
    const rng = createSeededRng(1)
    for (let i = 0; i < 100; i += 1) {
      const x = rng.nextInt(7)
      expect(x).toBeGreaterThanOrEqual(0)
      expect(x).toBeLessThan(7)
    }
  })
})

