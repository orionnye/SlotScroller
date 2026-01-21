import type { IconId } from '../icons/iconIds'

import { getIconAtOffset, type WheelStrip } from './wheelStrip'

export type StripLayout = {
  readonly iconIds: readonly IconId[]
  readonly yPositions: readonly number[]
  readonly selectedIndex: number
}

export function getStripLayout(args: {
  strip: WheelStrip
  visibleCount: number
  slotSpacing: number
}): StripLayout {
  const { strip, visibleCount, slotSpacing } = args

  if (visibleCount <= 0) {
    throw new Error('visibleCount must be > 0')
  }
  if (slotSpacing <= 0) {
    throw new Error('slotSpacing must be > 0')
  }

  const selectedIndex = Math.floor(visibleCount / 2)

  const iconIds: IconId[] = []
  const yPositions: number[] = []

  for (let i = 0; i < visibleCount; i += 1) {
    const offset = i - selectedIndex
    iconIds.push(getIconAtOffset(strip, offset))
    yPositions.push(offset * slotSpacing)
  }

  return { iconIds, yPositions, selectedIndex }
}

