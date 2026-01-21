import { describe, expect, test } from 'vitest'

import { hashStringToColor } from './hashStringToColor'

describe('hashStringToColor', () => {
  test('is deterministic for the same input', () => {
    expect(hashStringToColor('cherry')).toBe(hashStringToColor('cherry'))
  })

  test('returns a 24-bit color value', () => {
    const c = hashStringToColor('any')
    expect(c).toBeGreaterThanOrEqual(0x000000)
    expect(c).toBeLessThanOrEqual(0xffffff)
  })
})

