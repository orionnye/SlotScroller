import { describe, expect, test } from 'vitest'

import { mod } from './mod'

describe('mod', () => {
  test('wraps negative numbers into the [0..m-1] range', () => {
    expect(mod(-1, 3)).toBe(2)
    expect(mod(-4, 3)).toBe(2)
  })

  test('wraps positive numbers into the [0..m-1] range', () => {
    expect(mod(0, 3)).toBe(0)
    expect(mod(3, 3)).toBe(0)
    expect(mod(4, 3)).toBe(1)
  })
})

