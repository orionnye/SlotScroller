import { Application, Container, Sprite } from 'pixi.js'

import { createBulletTexture } from '../textures/bullet'
import { createGunTexture } from '../textures/gun'
import type { CharacterSprite } from '../types'
import type { SvgDeathAnimation } from '../animation/svgDeathAnimation'
import { dealDamageToEnemy } from './enemyCombat'

type SceneState = {
  isPaused: boolean
}

function createGunSprite(
  app: Application,
  heroX: number,
  heroY: number,
  targetX: number,
  targetY: number,
): Sprite {
  const gun = createGunTexture(app)
  const gunSprite = new Sprite(gun)
  gunSprite.anchor.set(0.5, 0.5)
  gunSprite.x = heroX + 10 // Slightly to the right of hero
  gunSprite.y = heroY - 10 // Slightly above hero
  gunSprite.scale.set(1.0) // Full size now that gun is bigger
  // Rotate gun to point toward target
  const angleToTarget = Math.atan2(targetY - heroY, targetX - heroX)
  gunSprite.rotation = angleToTarget
  return gunSprite
}

function createBulletSprite(app: Application, heroX: number, heroY: number): Sprite {
  const bullet = createBulletTexture(app)
  const bulletSprite = new Sprite(bullet)
  bulletSprite.anchor.set(0.5, 0.5)
  bulletSprite.x = heroX + 10
  bulletSprite.y = heroY - 10
  bulletSprite.scale.set(1.2)
  return bulletSprite
}

function animateBullet(
  bulletSprite: Sprite,
  startX: number,
  startY: number,
  endX: number,
  endY: number,
  duration: number,
  onComplete: () => void,
): void {
  const startTime = performance.now()

  const animate = () => {
    const elapsed = performance.now() - startTime
    const progress = Math.min(1, elapsed / duration)

    if (progress < 1) {
      bulletSprite.x = startX + (endX - startX) * progress
      bulletSprite.y = startY + (endY - startY) * progress
      // Rotate bullet to point toward target
      const angle = Math.atan2(endY - startY, endX - startX)
      bulletSprite.rotation = angle
      requestAnimationFrame(animate)
    } else {
      // Bullet reached target
      bulletSprite.x = endX
      bulletSprite.y = endY
      onComplete()
    }
  }

  animate()
}

export async function triggerHeroAttack(
  targetEnemy: { sprite: Sprite } | null,
  damage: number,
  app: Application,
  hero: CharacterSprite,
  enemies: CharacterSprite[],
  charactersLayer: Container,
  frontLayer: Container,
  state: SceneState,
  deathAnimations: SvgDeathAnimation[],
): Promise<void> {
  if (!targetEnemy) return
  
  // Find the actual enemy object for animation and damage
  const actualEnemy = enemies.find((e) => e.sprite === targetEnemy.sprite)
  if (!actualEnemy || actualEnemy.kind !== 'enemy') return

  // Create gun sprite
  const gunSprite = createGunSprite(
    app,
    hero.sprite.x,
    hero.sprite.y,
    actualEnemy.sprite.x,
    actualEnemy.sprite.y,
  )
  charactersLayer.addChild(gunSprite)

  // Create bullet sprite
  const bulletSprite = createBulletSprite(app, hero.sprite.x, hero.sprite.y)
  charactersLayer.addChild(bulletSprite)

  // Pause all scene animations during gun fire
  state.isPaused = true

  // Animation: aim gun (brief pause)
  await new Promise((resolve) => setTimeout(resolve, 100))

  // Animation: fire bullet (travel from hero to enemy)
  const startX = hero.sprite.x + 10
  const startY = hero.sprite.y - 10
  const endX = actualEnemy.sprite.x
  const endY = actualEnemy.sprite.y - 10
  const duration = 50 // 0.05 seconds (50ms) - very fast bullet

  animateBullet(bulletSprite, startX, startY, endX, endY, duration, async () => {
    // Impact effect: brief flash on enemy
    const originalTint = actualEnemy.sprite.tint
    actualEnemy.sprite.tint = 0xffffff
    setTimeout(() => {
      actualEnemy.sprite.tint = originalTint
    }, 100)

    // Apply damage (death animation will be handled by CSS/SVG system)
    dealDamageToEnemy(
      { sprite: actualEnemy.sprite, hp: actualEnemy.hp },
      damage,
      enemies,
      charactersLayer,
      frontLayer,
      deathAnimations,
      app,
    )

    // Clean up sprites and resume animations
    setTimeout(() => {
      charactersLayer.removeChild(gunSprite)
      charactersLayer.removeChild(bulletSprite)
      gunSprite.destroy()
      bulletSprite.destroy()
      
      // Resume scene animations after gun fire completes
      state.isPaused = false
    }, 100)
  })

  await new Promise((resolve) => setTimeout(resolve, duration + 100))
}
