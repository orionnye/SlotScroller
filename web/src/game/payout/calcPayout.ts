import type { SpinResult } from '../spin/spinResult'

import { iconValues } from './iconValues'
import { calcComboEvents } from './comboEvents'

export type PayoutLine = {
  readonly label: string
  readonly amount: number
}

export type PayoutBreakdown = {
  readonly total: number
  readonly lines: readonly PayoutLine[]
}

export function calcPayout(result: SpinResult): PayoutBreakdown {
  const { landedIcons } = result

  const base = landedIcons.reduce((sum, icon) => sum + iconValues[icon], 0)
  const lines: PayoutLine[] = [{ label: 'Base', amount: base }]

  for (const ev of calcComboEvents(result)) {
    lines.push({ label: ev.label, amount: ev.amount })
  }

  const total = lines.reduce((sum, l) => sum + l.amount, 0)
  return { total, lines }
}

