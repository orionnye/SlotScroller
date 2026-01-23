import { describe, expect, test } from 'vitest'

import type { IconId } from '../icons/iconIds'

import {
  advanceCursor,
  createWheelStrip,
  getIconAtOffset,
  getSelectedIcon,
  normalizeCursor,
  removeIcon,
} from './wheelStrip'

const ICONS: readonly IconId[] = ['cherry', 'lemon', 'seven']

describe('wheelStrip', () => {
  test('rejects creation with an empty icon list', () => {
    expect(() => createWheelStrip([], 0)).toThrow(/requires at least 1 icon/i)
  })

  test('normalizes cursor deterministically when out of bounds', () => {
    expect(normalizeCursor(0, 3)).toBe(0)
    expect(normalizeCursor(3, 3)).toBe(0)
    expect(normalizeCursor(4, 3)).toBe(1)
    expect(normalizeCursor(-1, 3)).toBe(2)
  })

  test('returns the selected icon at the cursor', () => {
    const strip = createWheelStrip(ICONS, 0)
    expect(getSelectedIcon(strip)).toBe('cherry')
  })

  test('returns icons at offsets with wraparound behavior', () => {
    const strip = createWheelStrip(ICONS, 0)
    expect(getIconAtOffset(strip, 0)).toBe('cherry')
    expect(getIconAtOffset(strip, 1)).toBe('lemon')
    expect(getIconAtOffset(strip, 2)).toBe('seven')
    expect(getIconAtOffset(strip, 3)).toBe('cherry')
    expect(getIconAtOffset(strip, -1)).toBe('seven')
    expect(getIconAtOffset(strip, -4)).toBe('seven')
  })

  test('advances cursor forward and backward deterministically', () => {
    const strip0 = createWheelStrip(ICONS, 0)

    const strip1 = advanceCursor(strip0, 1)
    expect(strip1.cursor).toBe(1)
    expect(getSelectedIcon(strip1)).toBe('lemon')

    const strip2 = advanceCursor(strip1, -2)
    expect(strip2.cursor).toBe(2)
    expect(getSelectedIcon(strip2)).toBe('seven')
  })

  test('advanceCursor with zero steps returns the same object', () => {
    const strip0 = createWheelStrip(ICONS, 0)
    expect(advanceCursor(strip0, 0)).toBe(strip0)
  })

  test('removes icon by index and adjusts cursor', () => {
    const strip0 = createWheelStrip(ICONS, 0)
    const strip1 = removeIcon(strip0, 1)
    expect(strip1.icons).toEqual(['cherry', 'seven'])
    expect(strip1.cursor).toBe(0)
    expect(getSelectedIcon(strip1)).toBe('cherry')
  })

  test('removes icon at cursor and moves cursor to next valid position', () => {
    const strip0 = createWheelStrip(ICONS, 1)
    const strip1 = removeIcon(strip0, 1)
    expect(strip1.icons).toEqual(['cherry', 'seven'])
    expect(strip1.cursor).toBe(1)
    expect(getSelectedIcon(strip1)).toBe('seven')
  })

  test('removes icon before cursor and adjusts cursor', () => {
    const strip0 = createWheelStrip(ICONS, 2)
    const strip1 = removeIcon(strip0, 0)
    expect(strip1.icons).toEqual(['lemon', 'seven'])
    expect(strip1.cursor).toBe(1)
    expect(getSelectedIcon(strip1)).toBe('seven')
  })

  test('rejects removal when only one icon remains', () => {
    const strip = createWheelStrip(['cherry'], 0)
    expect(() => removeIcon(strip, 0)).toThrow(/at least 1 icon/i)
  })
})

