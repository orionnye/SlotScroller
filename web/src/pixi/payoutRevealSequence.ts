import type { SpinResult } from '../game/spin/spinResult'
import { calcBaseContributions } from '../game/payout/baseContributions'
import { calcComboEvents } from '../game/payout/comboEvents'
import { splitBonusAcrossWheels } from '../game/payout/splitBonusAcrossWheels'
import type { MountedPixi } from './mountPixi'

export type PayoutPanel = {
  total: HTMLElement
  lines: HTMLElement
}

export type PayoutLineFactory = (label: string, amount: number) => HTMLElement

/**
 * Reveals base wheel contributions sequentially and updates the payout panel.
 */
export async function revealBaseContributions(
  result: SpinResult,
  pixi: MountedPixi,
  payoutPanel: PayoutPanel,
  createPayoutLine: PayoutLineFactory,
  sleep: (ms: number) => Promise<void>,
  animationConfig: { revealDelayMs: number; payoutLineDelayMs: number },
): Promise<number> {
  const base = calcBaseContributions(result)
  let runningTotal = 0

  for (let i = 0; i < base.contributions.length; i += 1) {
    const v = base.contributions[i]
    // Reveal this wheel's value above the window
    pixi.showWheelValue(i, v)
    await sleep(animationConfig.revealDelayMs)

    // Roll it off (slide/fade), then commit into payout panel
    await pixi.rollOffWheelValue(i)

    runningTotal += v
    payoutPanel.lines.appendChild(createPayoutLine(`Wheel ${i + 1}`, v))
    payoutPanel.total.textContent = String(runningTotal)
    await sleep(animationConfig.payoutLineDelayMs)
  }

  return runningTotal
}

/**
 * Reveals combo bonus events sequentially and updates the payout panel.
 */
export async function revealComboBonuses(
  result: SpinResult,
  pixi: MountedPixi,
  payoutPanel: PayoutPanel,
  createPayoutLine: PayoutLineFactory,
  sleep: (ms: number) => Promise<void>,
  animationConfig: { revealDelayMs: number; payoutLineDelayMs: number },
): Promise<void> {
  const comboEvents = calcComboEvents(result)

  // Reveal combo bonuses above relevant wheels, then append corresponding payout line
  for (const ev of comboEvents) {
    const portions = splitBonusAcrossWheels({
      totalBonus: ev.amount,
      wheelIndices: ev.wheelIndices,
    })

    for (const p of portions) {
      pixi.showWheelBonus(p.wheelIndex, p.amount)
    }
    await sleep(animationConfig.revealDelayMs)

    await Promise.all(portions.map((p) => pixi.rollOffWheelValue(p.wheelIndex)))

    payoutPanel.lines.appendChild(createPayoutLine(ev.label, ev.amount))
    await sleep(animationConfig.payoutLineDelayMs)
  }
}
