/**
 * Animation timing configuration constants.
 * Centralizes timing values used in payout reveal sequences and other animations.
 */
export const ANIMATION_CONFIG = {
  /** Delay after revealing a wheel value before rolling it off (ms) */
  revealDelayMs: 160,
  /** Delay after adding a payout line before proceeding (ms) */
  payoutLineDelayMs: 120,
  /** Delay after final payout total is displayed before hiding values (ms) */
  finalPayoutDelayMs: 450,
} as const
