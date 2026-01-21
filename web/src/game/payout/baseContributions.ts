import type { SpinResult } from '../spin/spinResult'

import { iconValues } from './iconValues'

export type BaseContributions = {
  readonly contributions: readonly number[]
  readonly total: number
}

export function calcBaseContributions(result: SpinResult): BaseContributions {
  const contributions = result.landedIcons.map((icon) => iconValues[icon])
  const total = contributions.reduce((s, v) => s + v, 0)
  return { contributions, total }
}

