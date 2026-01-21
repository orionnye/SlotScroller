import { describe, expect, test } from 'vitest'

import { createWheelStrip } from './wheelStrip'
import { getStripLayout } from './stripLayout'

describe('getStripLayout', () => {
  test('centers the cursor icon in the middle slot', () => {
    const strip = createWheelStrip(['cherry', 'lemon', 'seven'], 1) // selected = lemon
    const layout = getStripLayout({ strip, visibleCount: 5, slotSpacing: 10 })

    expect(layout.selectedIndex).toBe(2)
    expect(layout.iconIds[layout.selectedIndex]).toBe('lemon')
    expect(layout.iconIds).toEqual(['seven', 'cherry', 'lemon', 'seven', 'cherry'])
  })

  test('computes symmetric y positions around the selected index', () => {
    const strip = createWheelStrip(['cherry', 'lemon', 'seven'], 0)
    const layout = getStripLayout({ strip, visibleCount: 5, slotSpacing: 12 })

    expect(layout.yPositions).toEqual([-24, -12, 0, 12, 24])
  })

  test('rejects invalid visibleCount and slotSpacing', () => {
    const strip = createWheelStrip(['cherry'], 0)
    expect(() => getStripLayout({ strip, visibleCount: 0, slotSpacing: 10 })).toThrow(/visibleCount/i)
    expect(() => getStripLayout({ strip, visibleCount: 3, slotSpacing: 0 })).toThrow(/slotSpacing/i)
  })
})

