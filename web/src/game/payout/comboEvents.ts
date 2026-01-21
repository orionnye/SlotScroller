import type { IconId } from '../icons/iconIds'
import type { SpinResult } from '../spin/spinResult'

export type ComboEvent = {
  readonly iconId: IconId
  readonly count: number
  readonly amount: number
  readonly wheelIndices: readonly number[]
  readonly label: string
}

function bonusForCount(count: number): number {
  return count === 2 ? 10 : count === 3 ? 30 : count === 4 ? 80 : /* count >= 5 */ 250
}

export function calcComboEvents(result: SpinResult): readonly ComboEvent[] {
  const { landedIcons } = result

  const counts = new Map<IconId, number>()
  for (const icon of landedIcons) {
    counts.set(icon, (counts.get(icon) ?? 0) + 1)
  }

  const entries = [...counts.entries()]
    .filter(([, count]) => count >= 2)
    .sort((a, b) => (b[1] - a[1]) || a[0].localeCompare(b[0]))

  return entries.map(([iconId, count]) => {
    const wheelIndices = landedIcons
      .map((icon, idx) => ({ icon, idx }))
      .filter((x) => x.icon === iconId)
      .map((x) => x.idx)

    return {
      iconId,
      count,
      amount: bonusForCount(count),
      wheelIndices,
      label: `${count}x ${iconId}`,
    }
  })
}

