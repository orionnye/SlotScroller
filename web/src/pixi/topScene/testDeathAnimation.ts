import { Application, Sprite } from 'pixi.js'

import { SlimeBlobEnemy } from './units/SlimeBlobEnemy'
import type { DeathClone } from './animation/deathClone'

export async function createDeathAnimationTest(): Promise<() => void> {
  // Create test container div
  const testContainer = document.createElement('div')
  testContainer.style.position = 'fixed'
  const initialTop = 20
  const initialRight = 20
  testContainer.style.top = `${initialTop}px`
  testContainer.style.right = `${initialRight}px`
  testContainer.style.width = '300px'
  testContainer.style.height = '400px'
  testContainer.style.border = '2px solid #ff0000'
  testContainer.style.backgroundColor = 'transparent'
  testContainer.style.zIndex = '10000'
  document.body.appendChild(testContainer)

  // Create PixiJS app for test
  const testApp = new Application()
  await testApp.init({
    resizeTo: testContainer,
    backgroundAlpha: 0, // Fully transparent background
    antialias: true,
  })
  testContainer.appendChild(testApp.canvas)

  // Create enemy sprite using SlimeBlobEnemy
  const enemyUnit = new SlimeBlobEnemy(1)
  const enemyTexture = enemyUnit.renderToPixi(testApp)
  const enemySprite = new Sprite(enemyTexture)
  enemySprite.anchor.set(0.5, 0.5)
  const spriteX = 150 // Center of 300px wide canvas
  const spriteY = 50 // Start near top
  enemySprite.x = spriteX
  enemySprite.y = spriteY
  enemySprite.scale.set(1)
  testApp.stage.addChild(enemySprite)

  // Death clone state
  let deathClone: DeathClone | null = null
  let lastSpawnTime = 0
  let containerPositionY = 0 // Track container's vertical position offset

  // Animation loop
  const tick = (time: { deltaTime: number }) => {
    const dt = time.deltaTime / 60
    const currentTime = performance.now()

    if (deathClone) {
      // Apply gravity acceleration to velocity
      deathClone.deathVelocityY += 300 * dt
      
      // Update container position based on accumulated velocity
      containerPositionY += deathClone.deathVelocityY * dt
      testContainer.style.top = `${initialTop + containerPositionY}px`
      
      // Rotate the sprite continuously
      deathClone.deathRotation += 2 * dt
      deathClone.sprite.rotation = deathClone.deathRotation

      // Reset when container has moved well past screen height
      const screenHeight = window.innerHeight
      if (containerPositionY > screenHeight + 100) {
        testApp.stage.removeChild(deathClone.sprite)
        deathClone.sprite.destroy()
        deathClone = null
        // Reset container position to original location
        containerPositionY = 0
        testContainer.style.top = `${initialTop}px`
        // Reset enemy sprite position for next loop
        enemySprite.visible = true
        enemySprite.x = spriteX
        enemySprite.y = spriteY
        lastSpawnTime = currentTime
      }
    } else {
      // Create new death clone immediately if enough time has passed (continuous loop)
      if (currentTime - lastSpawnTime > 500) {
        // Create clone at fixed sprite position
        const cloneSprite = new Sprite(enemyTexture)
        cloneSprite.anchor.set(0.5, 0.5)
        cloneSprite.x = spriteX // Fixed position
        cloneSprite.y = spriteY // Fixed position
        cloneSprite.scale.copyFrom(enemySprite.scale)
        cloneSprite.tint = enemySprite.tint
        cloneSprite.rotation = enemySprite.rotation
        cloneSprite.alpha = enemySprite.alpha
        testApp.stage.addChild(cloneSprite)

        deathClone = {
          sprite: cloneSprite,
          deathVelocityY: 0,
          deathRotation: enemySprite.rotation,
        }

        // Reset container position for new animation
        containerPositionY = 0
        testContainer.style.top = `${initialTop}px`

        // Hide original
        enemySprite.visible = false
      }
    }
  }

  testApp.ticker.add(tick)

  // Return cleanup function
  return () => {
    testApp.ticker.remove(tick)
    testApp.destroy(true)
    if (testContainer.parentNode) {
      testContainer.parentNode.removeChild(testContainer)
    }
  }
}
