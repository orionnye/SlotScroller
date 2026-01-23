import { Application, Container } from 'pixi.js'

import type { CharacterSprite } from '../types'

type RemoveEnemyCallback = (enemy: CharacterSprite, charactersLayer: Container, frontLayer: Container, enemies: CharacterSprite[]) => void

export function animateDeath(
  enemy: CharacterSprite,
  app: Application,
  dt: number,
  removeEnemy: RemoveEnemyCallback,
  charactersLayer: Container,
  frontLayer: Container,
  enemies: CharacterSprite[],
): void {
  // Apply gravity-like acceleration
  enemy.deathVelocityY = (enemy.deathVelocityY ?? 0) + 300 * dt // Gravity acceleration
  enemy.sprite.y += enemy.deathVelocityY * dt
  // Rotate slightly for dynamic effect
  enemy.deathRotation = (enemy.deathRotation ?? 0) + 2 * dt
  enemy.sprite.rotation = enemy.deathRotation
  
  // Remove enemy if it falls well past the entire screen height (including bottom half)
  // Use a larger threshold to ensure it falls past the full viewport
  const screenHeight = app.renderer.height
  if (enemy.sprite.y > screenHeight + 100) {
    removeEnemy(enemy, charactersLayer, frontLayer, enemies)
  }
}
