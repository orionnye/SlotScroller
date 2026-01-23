/**
 * Combat configuration constants used across the application.
 * Centralizes combat-related settings like attack ranges and cooldowns.
 */
export const COMBAT_CONFIG = {
  /** Attack range in pixels - enemies attack when within this distance of Hero */
  enemyAttackRangePx: 180,
  /** Attack cooldown in milliseconds - enemies wait this long between attacks */
  enemyAttackCooldownMs: 2500,
  /** Default enemy HP - starting health for new enemies */
  defaultEnemyHP: 30,
} as const
