import { Application, Container, Sprite } from 'pixi.js'

import type { CharacterSprite } from '../types'
import type { SvgDeathAnimation } from '../animation/svgDeathAnimation'
import { createSvgDeathSquare } from '../animation/svgDeathAnimation'

export function findNearestEnemy(
  enemies: CharacterSprite[],
  hero: CharacterSprite,
): CharacterSprite | null {
  if (enemies.length === 0) return null

  let nearest: CharacterSprite | null = null
  let minDistance = Infinity

  for (const enemy of enemies) {
    if (enemy.kind !== 'enemy') continue
    const distance = Math.abs(enemy.sprite.x - hero.sprite.x)
    if (distance < minDistance) {
      minDistance = distance
      nearest = enemy
    }
  }

  return nearest
}

export function removeEnemy(
  enemy: CharacterSprite,
  charactersLayer: Container,
  frontLayer: Container,
  enemies: CharacterSprite[],
): void {
  // Remove sprite from scene (could be in charactersLayer or frontLayer)
  if (charactersLayer.children.includes(enemy.sprite)) {
    charactersLayer.removeChild(enemy.sprite)
  }
  if (frontLayer.children.includes(enemy.sprite)) {
    frontLayer.removeChild(enemy.sprite)
  }
  
  // Destroy sprite resources
  enemy.sprite.destroy()
  
  // Remove from enemies array
  const index = enemies.indexOf(enemy)
  if (index !== -1) {
    enemies.splice(index, 1)
  }
}

export function dealDamageToEnemy(
  enemy: { sprite: Sprite; hp?: number },
  damage: number,
  enemies: CharacterSprite[],
  charactersLayer: Container,
  frontLayer: Container,
  deathAnimations: SvgDeathAnimation[],
  app: Application,
): boolean {
  // Find the actual enemy object to update HP
  const actualEnemy = enemies.find((e) => e.sprite === enemy.sprite)
  if (!actualEnemy || actualEnemy.kind !== 'enemy' || !actualEnemy.hp) return false

  actualEnemy.hp = Math.max(0, actualEnemy.hp - damage)
  
  // If enemy HP reaches 0, hide original sprite and create SVG death square
  if (actualEnemy.hp <= 0) {
    // Hide original enemy sprite
    actualEnemy.sprite.visible = false
    
    // Mark enemy as dying to prevent further updates
    actualEnemy.isDying = true
    
    // Create SVG death square (synchronous, simple)
    const svgDeath = createSvgDeathSquare(actualEnemy.sprite, app.canvas, actualEnemy.enemyUnit)
    deathAnimations.push(svgDeath)
    
    return true // Enemy was killed
  }
  
  return false // Enemy still alive
}
