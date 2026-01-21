import { describe, expect, test } from 'vitest'

import { splitBonusAcrossWheels } from './splitBonusAcrossWheels'

describe('splitBonusAcrossWheels', () => {
  test('splits evenly when divisible', () => {
    expect(splitBonusAcrossWheels({ totalBonus: 10, wheelIndices: [3, 1] })).toEqual([
      { wheelIndex: 1, amount: 5 },
      { wheelIndex: 3, amount: 5 },
    ])
  })

  test('distributes remainder deterministically by wheel index order', () => {
    expect(splitBonusAcrossWheels({ totalBonus: 10, wheelIndices: [2, 0, 4] })).toEqual([
      { wheelIndex: 0, amount: 4 },
      { wheelIndex: 2, amount: 3 },
      { wheelIndex: 4, amount: 3 },
    ])
  })
})

