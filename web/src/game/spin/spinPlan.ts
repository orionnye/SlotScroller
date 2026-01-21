import type { IconId } from '../icons/iconIds'
import type { Rng } from '../rng/rng'
import { mod } from '../wheel/mod'
import { normalizeCursor, type WheelStrip } from '../wheel/wheelStrip'

export type SpinPlan = {
  readonly durationMs: number
  readonly steps: number
  readonly finalCursor: number
  readonly finalIconId: IconId
}

export function createSpinPlan(args: {
  strip: WheelStrip
  rng: Rng
  durationMs: number
  minFullRotations?: number
}): SpinPlan {
  const { strip, rng, durationMs, minFullRotations = 2 } = args
  const len = strip.icons.length

  if (!Number.isFinite(durationMs) || durationMs <= 0) {
    throw new Error('durationMs must be a finite number > 0')
  }
  if (!Number.isFinite(minFullRotations) || minFullRotations < 0) {
    throw new Error('minFullRotations must be a finite number >= 0')
  }

  // Choose final landing uniformly from [0..len-1]
  const targetCursor = rng.nextInt(len)
  const delta = mod(targetCursor - strip.cursor, len)

  const steps = Math.floor(minFullRotations) * len + delta
  const finalCursor = normalizeCursor(strip.cursor + steps, len)
  const finalIconId = strip.icons[finalCursor]

  return {
    durationMs,
    steps,
    finalCursor,
    finalIconId,
  }
}

