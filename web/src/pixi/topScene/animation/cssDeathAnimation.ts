import { Application, Sprite } from 'pixi.js'

export type CssDeathAnimation = {
  element: HTMLDivElement
  velocityY: number
  rotation: number
  translateY: number
  initialTop: number
  initialLeft: number
}

export async function createCssDeathAnimation(
  enemySprite: Sprite,
  sourceCanvas: HTMLCanvasElement,
  app: Application,
): Promise<CssDeathAnimation> {
  // Get enemy sprite's global position (relative to PixiJS canvas)
  const globalPos = enemySprite.getGlobalPosition()
  
  // Convert canvas coordinates to viewport coordinates
  const canvasRect = sourceCanvas.getBoundingClientRect()
  const viewportX = canvasRect.left + globalPos.x
  const viewportY = canvasRect.top + globalPos.y
  
  // Extract texture as base64 data URL
  const base64 = await app.renderer.extract.base64(enemySprite)
  
  // Get sprite dimensions
  const spriteWidth = enemySprite.width
  const spriteHeight = enemySprite.height
  
  // Create DOM element for death animation
  const element = document.createElement('div')
  element.style.position = 'fixed'
  element.style.left = `${viewportX}px`
  element.style.top = `${viewportY}px`
  element.style.width = `${spriteWidth}px`
  element.style.height = `${spriteHeight}px`
  element.style.backgroundImage = `url(${base64})`
  element.style.backgroundSize = 'contain'
  element.style.backgroundRepeat = 'no-repeat'
  element.style.backgroundPosition = 'center'
  element.style.zIndex = '10000'
  element.style.pointerEvents = 'none'
  element.style.transformOrigin = 'center center'
  
  // Append to document body
  document.body.appendChild(element)
  
  return {
    element,
    velocityY: 0,
    rotation: enemySprite.rotation,
    translateY: 0,
    initialTop: viewportY,
    initialLeft: viewportX,
  }
}

export function animateCssDeath(
  deathAnim: CssDeathAnimation,
  dt: number,
): boolean {
  // Apply gravity acceleration
  deathAnim.velocityY += 300 * dt
  
  // Update rotation
  deathAnim.rotation += 2 * dt
  
  // Calculate new translateY
  deathAnim.translateY += deathAnim.velocityY * dt
  
  // Calculate absolute position for off-screen check
  const absoluteTop = deathAnim.initialTop + deathAnim.translateY
  
  // Update transform with translateY and rotate (keep top/left fixed)
  deathAnim.element.style.transform = `translateY(${deathAnim.translateY}px) rotate(${deathAnim.rotation}rad)`
  
  // Check if off-screen (below viewport + 100px buffer)
  if (absoluteTop > window.innerHeight + 100) {
    return true // Animation complete
  }
  
  return false // Animation still running
}
