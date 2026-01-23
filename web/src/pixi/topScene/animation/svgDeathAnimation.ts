import type { Sprite } from 'pixi.js'

import type { BaseEnemyUnit } from '../units'

export type SvgDeathAnimation = {
  element: SVGSVGElement
  velocityY: number
  rotation: number
  translateY: number
  initialTop: number
  initialLeft: number
}

export function createSvgDeathSquare(
  enemySprite: Sprite,
  sourceCanvas: HTMLCanvasElement,
  enemyUnit?: BaseEnemyUnit,
): SvgDeathAnimation {
  // Get enemy sprite's global position (relative to PixiJS canvas)
  const globalPos = enemySprite.getGlobalPosition()
  
  // Convert canvas coordinates to viewport coordinates
  const canvasRect = sourceCanvas.getBoundingClientRect()
  const viewportX = canvasRect.left + globalPos.x
  
  // Get enemy height and adjust spawn location one enemy height higher
  const enemyHeight = enemyUnit?.height ?? enemySprite.height
  const viewportY = canvasRect.top + globalPos.y - enemyHeight
  
  let svg: SVGSVGElement
  
  if (enemyUnit) {
    // Use enemyUnit.renderToSvg() for accurate representation
    svg = enemyUnit.renderToSvg()
  } else {
    // Fallback to simple green rounded rectangle for backward compatibility
    const spriteWidth = enemySprite.width
    const spriteHeight = enemySprite.height
    const fillColor = '#22c55e' // Default green
    
    // Calculate proportional values
    const cornerRadius = Math.max(4, spriteWidth * 0.2) // 20% of width, min 4px
    const eyeRadius = Math.max(1, spriteWidth * 0.05) // 5% of width, min 1px
    const eyeY = spriteHeight * 0.33 // 33% from top
    const eye1X = spriteWidth * 0.35 // 35% from left
    const eye2X = spriteWidth * 0.65 // 65% from left
    
    // Create SVG element
    svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    svg.setAttribute('width', String(spriteWidth))
    svg.setAttribute('height', String(spriteHeight))
    svg.setAttribute('viewBox', `0 0 ${spriteWidth} ${spriteHeight}`)
    
    // Create rounded rectangle (enemy body) with default color
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
    rect.setAttribute('x', '0')
    rect.setAttribute('y', '0')
    rect.setAttribute('width', String(spriteWidth))
    rect.setAttribute('height', String(spriteHeight))
    rect.setAttribute('rx', String(cornerRadius))
    rect.setAttribute('fill', fillColor)
    svg.appendChild(rect)
    
    // Add eyes (proportionally positioned)
    const eye1 = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
    eye1.setAttribute('cx', String(eye1X))
    eye1.setAttribute('cy', String(eyeY))
    eye1.setAttribute('r', String(eyeRadius))
    eye1.setAttribute('fill', '#000000')
    eye1.setAttribute('fill-opacity', '0.8')
    svg.appendChild(eye1)
    
    const eye2 = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
    eye2.setAttribute('cx', String(eye2X))
    eye2.setAttribute('cy', String(eyeY))
    eye2.setAttribute('r', String(eyeRadius))
    eye2.setAttribute('fill', '#000000')
    eye2.setAttribute('fill-opacity', '0.8')
    svg.appendChild(eye2)
  }
  
  // Position SVG element (same for both paths)
  svg.style.position = 'fixed'
  svg.style.left = `${viewportX}px`
  svg.style.top = `${viewportY}px`
  svg.style.width = `${enemyUnit?.width ?? enemySprite.width}px`
  svg.style.height = `${enemyUnit?.height ?? enemySprite.height}px`
  svg.style.zIndex = '10000'
  svg.style.pointerEvents = 'none'
  svg.style.transformOrigin = 'center center'
  
  // Append to document body
  document.body.appendChild(svg)
  
  return {
    element: svg,
    velocityY: 0,
    rotation: 0,
    translateY: 0,
    initialTop: viewportY,
    initialLeft: viewportX,
  }
}

export function animateSvgDeath(
  deathAnim: SvgDeathAnimation,
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
