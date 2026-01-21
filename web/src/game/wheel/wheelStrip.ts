import type { IconId } from '../icons/iconIds'

import { mod } from './mod'

export type WheelStrip = {
  readonly icons: readonly IconId[]
  readonly cursor: number
}

export function createWheelStrip(icons: readonly IconId[], cursor = 0): WheelStrip {
  if (icons.length === 0) {
    throw new Error('WheelStrip requires at least 1 icon')
  }

  return {
    icons: [...icons],
    cursor: normalizeCursor(cursor, icons.length),
  }
}

export function normalizeCursor(cursor: number, iconCount: number): number {
  if (iconCount <= 0) {
    throw new Error('iconCount must be > 0')
  }
  return mod(cursor, iconCount)
}

export function getSelectedIcon(strip: WheelStrip): IconId {
  return strip.icons[strip.cursor]
}

export function getIconAtOffset(strip: WheelStrip, offset: number): IconId {
  const idx = normalizeCursor(strip.cursor + offset, strip.icons.length)
  return strip.icons[idx]
}

export function advanceCursor(strip: WheelStrip, steps: number): WheelStrip {
  if (steps === 0) return strip
  return {
    ...strip,
    cursor: normalizeCursor(strip.cursor + steps, strip.icons.length),
  }
}

