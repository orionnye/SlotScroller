import { Application, Sprite } from 'pixi.js'

export type DeathClone = {
  sprite: Sprite
  deathVelocityY: number
  deathRotation: number
}

export function createDeathClone(
  enemySprite: Sprite,
  overlayApp: Application,
): DeathClone {
  // Create a new sprite with the same texture
  const cloneSprite = new Sprite(enemySprite.texture)
  
  // Get enemy sprite's global position (relative to viewport)
  const globalPos = enemySprite.getGlobalPosition()
  
  // Overlay app is in a fixed position overlay, so global position = local position
  // The overlay covers the entire viewport, so we can use global coordinates directly
  cloneSprite.x = globalPos.x
  cloneSprite.y = globalPos.y
  
  // Copy all visual properties from original sprite
  cloneSprite.scale.copyFrom(enemySprite.scale)
  cloneSprite.tint = enemySprite.tint
  cloneSprite.rotation = enemySprite.rotation
  cloneSprite.anchor.copyFrom(enemySprite.anchor)
  cloneSprite.alpha = enemySprite.alpha
  
  // Initialize death animation properties
  return {
    sprite: cloneSprite,
    deathVelocityY: 0,
    deathRotation: enemySprite.rotation,
  }
}
