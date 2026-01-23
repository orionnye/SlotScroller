import type { Sprite } from 'pixi.js'

import type { BaseEnemyUnit } from './units'

export type ScrollerSprite = {
  sprite: Sprite
  speed: number
  kind: 'tuft' | 'tree'
}

export type CharacterSprite = {
  sprite: Sprite
  speed: number
  kind: 'hero' | 'enemy'
  walkPhase: number
  attackCooldownMs?: number
  lastAttackMs?: number
  isAtAttackRange?: boolean
  hp?: number
  maxHp?: number
  isDying?: boolean // Track if enemy is in death animation
  deathVelocityY?: number // Vertical velocity for death fall
  deathRotation?: number // Rotation speed for death animation
  color?: number // Enemy body color (hex value, e.g., 0x22c55e) - kept for backward compatibility
  enemyUnit?: BaseEnemyUnit // Enemy unit with full rendering capabilities (for death animations)
}
