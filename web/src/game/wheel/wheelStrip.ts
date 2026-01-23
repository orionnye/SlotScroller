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

export function removeIcon(strip: WheelStrip, index: number): WheelStrip {
  if (strip.icons.length <= 1) {
    throw new Error('WheelStrip requires at least 1 icon')
  }
  if (index < 0 || index >= strip.icons.length) {
    throw new Error(`Index ${index} is out of bounds for strip with ${strip.icons.length} icons`)
  }

  const newIcons = strip.icons.filter((_, i) => i !== index)
  let newCursor = strip.cursor

  // Adjust cursor if the removed icon was before or at the cursor position
  if (index < strip.cursor) {
    // Icon removed before cursor: shift cursor left by 1
    newCursor = strip.cursor - 1
  } else if (index === strip.cursor) {
    // Icon at cursor removed: cursor stays at same index (now points to next icon)
    // If cursor was at the last icon, wrap to 0
    newCursor = strip.cursor >= newIcons.length ? 0 : strip.cursor
  }
  // If index > cursor, cursor doesn't need adjustment

  return {
    icons: newIcons,
    cursor: normalizeCursor(newCursor, newIcons.length),
  }
}

