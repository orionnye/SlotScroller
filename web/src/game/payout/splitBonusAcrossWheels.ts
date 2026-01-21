export type WheelBonusPortion = {
  readonly wheelIndex: number
  readonly amount: number
}

export function splitBonusAcrossWheels(args: {
  totalBonus: number
  wheelIndices: readonly number[]
}): readonly WheelBonusPortion[] {
  const { totalBonus, wheelIndices } = args

  if (!Number.isFinite(totalBonus) || totalBonus < 0) {
    throw new Error('totalBonus must be a finite number >= 0')
  }

  if (wheelIndices.length === 0) return []

  const sorted = [...wheelIndices].slice().sort((a, b) => a - b)
  const base = Math.floor(totalBonus / sorted.length)
  const remainder = totalBonus - base * sorted.length

  return sorted.map((wheelIndex, i) => ({
    wheelIndex,
    amount: base + (i < remainder ? 1 : 0),
  }))
}

