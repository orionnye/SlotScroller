import { Application, Sprite } from 'pixi.js'

import { COMBAT_CONFIG } from '../../../game/config/combatConfig'
import type { CharacterSprite } from '../types'

type Rng = {
  nextInt: (max: number) => number
}

type SceneState = {
  groundY: number
}

type EnemyAttackCallback = (enemy: { sprite: Sprite }) => void

export function animateEnemies(
  enemies: CharacterSprite[],
  hero: CharacterSprite,
  rng: Rng,
  state: SceneState,
  app: Application,
  dt: number,
  onEnemyAttack?: EnemyAttackCallback,
): void {
  const w = app.renderer.width
  const currentTimeMs = performance.now()
  // Use a copy of the array to avoid issues when enemies are removed during iteration
  const enemiesToUpdate = [...enemies]

  for (const enemy of enemiesToUpdate) {
    // Skip if enemy was removed (no longer in main enemies array)
    if (!enemies.includes(enemy)) continue

    // Attack range detection and movement control
    if (enemy.kind === 'enemy') {
      const distanceToHero = Math.abs(enemy.sprite.x - hero.sprite.x)
      const timeSinceLastAttack = currentTimeMs - (enemy.lastAttackMs ?? 0)
      const isInRange = distanceToHero <= COMBAT_CONFIG.enemyAttackRangePx
      const isOffCooldown = timeSinceLastAttack >= (enemy.attackCooldownMs ?? COMBAT_CONFIG.enemyAttackCooldownMs)

      // Stop movement when at attack range
      enemy.isAtAttackRange = isInRange

      // Only move if not at attack range
      if (!isInRange) {
        enemy.sprite.x += enemy.speed * dt
      }

      // Attack when in range and off cooldown
      if (isInRange && isOffCooldown && onEnemyAttack) {
        enemy.lastAttackMs = currentTimeMs
        
        // Attack animation: brief scale pulse and color flash
        const originalScale = enemy.sprite.scale.x
        const originalTint = enemy.sprite.tint
        
        // Scale pulse
        enemy.sprite.scale.set(originalScale * 1.15)
        // Color flash (red tint)
        enemy.sprite.tint = 0xff6666
        
        // Reset after animation
        setTimeout(() => {
          enemy.sprite.scale.set(originalScale)
          enemy.sprite.tint = originalTint
        }, 200)
        
        onEnemyAttack(enemy)
      }
    } else {
      // Non-enemies (shouldn't happen, but handle gracefully)
      enemy.sprite.x += enemy.speed * dt
    }

    enemy.walkPhase += dt * 8 // Animation phase for walking
    // Simple walking animation: slight vertical bob
    enemy.sprite.y = state.groundY + Math.sin(enemy.walkPhase) * 2

    // Respawn enemy if goes off screen left
    if (enemy.sprite.x < -50) {
      enemy.sprite.x = w + 50 + rng.nextInt(200)
      // Reset attack cooldown and range state on respawn
      if (enemy.kind === 'enemy') {
        enemy.lastAttackMs = 0
        enemy.isAtAttackRange = false
      }
    }
  }
}
