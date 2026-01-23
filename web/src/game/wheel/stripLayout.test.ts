import { describe, expect, test } from 'vitest'

import { createWheelStrip } from './wheelStrip'
import { getStripLayout } from './stripLayout'

describe('getStripLayout', () => {
  test('centers the cursor icon in the middle slot', () => {
    const strip = createWheelStrip(['cherry', 'lemon', 'seven'], 1) // selected = lemon
    const layout = getStripLayout({ strip, visibleCount: 5, slotSpacing: 10 })

    expect(layout.selectedIndex).toBe(1) // With 3 icons, actualVisibleCount = 3, selectedIndex = 1
    expect(layout.iconIds[layout.selectedIndex]).toBe('lemon')
    expect(layout.iconIds).toEqual(['cherry', 'lemon', 'seven']) // No wrapping, shows actual icons
  })

  test('computes symmetric y positions around the selected index', () => {
    const strip = createWheelStrip(['cherry', 'lemon', 'seven'], 0)
    const layout = getStripLayout({ strip, visibleCount: 5, slotSpacing: 12 })

    // With 3 icons, actualVisibleCount = 3, selectedIndex = 1, positions: [-12, 0, 12]
    expect(layout.yPositions).toEqual([-12, 0, 12])
  })

  test('caps visible slots at actual icon count when fewer icons than visibleCount', () => {
    const strip = createWheelStrip(['cherry', 'lemon'], 0) // Only 2 icons, cursor at 0 (cherry)
    const layout = getStripLayout({ strip, visibleCount: 7, slotSpacing: 10 })

    expect(layout.iconIds.length).toBe(2) // Should cap at 2, not show 7
    // With 2 icons, selectedIndex = 1, showing offset -1 (lemon) and 0 (cherry)
    expect(layout.iconIds).toEqual(['lemon', 'cherry'])
    expect(layout.selectedIndex).toBe(1)
  })

  test('shows full visibleCount when more icons than visibleCount', () => {
    const strip = createWheelStrip(['cherry', 'lemon', 'seven', 'coin', 'diamond', 'star', 'bell', 'bar'], 0)
    const layout = getStripLayout({ strip, visibleCount: 5, slotSpacing: 10 })

    expect(layout.iconIds.length).toBe(5) // Should show 5 slots
    expect(layout.selectedIndex).toBe(2) // Middle of 5 slots
  })

  test('rejects invalid visibleCount and slotSpacing', () => {
    const strip = createWheelStrip(['cherry'], 0)
    expect(() => getStripLayout({ strip, visibleCount: 0, slotSpacing: 10 })).toThrow(/visibleCount/i)
    expect(() => getStripLayout({ strip, visibleCount: 3, slotSpacing: 0 })).toThrow(/slotSpacing/i)
  })
})

