import { describe, expect, test } from 'vitest'

import { calcComboEvents } from './comboEvents'

describe('calcComboEvents', () => {
  test('returns combo events with participant wheel indices', () => {
    const events = calcComboEvents({ landedIcons: ['coin', 'coin', 'lemon', 'seven', 'bar'] })
    expect(events).toHaveLength(1)
    expect(events[0]).toEqual({
      iconId: 'coin',
      count: 2,
      amount: 10,
      wheelIndices: [0, 1],
      label: '2x coin',
    })
  })

  test('orders events by count desc, then icon name', () => {
    const events = calcComboEvents({ landedIcons: ['bar', 'bar', 'coin', 'coin', 'coin'] })
    expect(events.map((e) => e.label)).toEqual(['3x coin', '2x bar'])
  })
})

