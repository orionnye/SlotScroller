import type { SvgDeathAnimation } from './svgDeathAnimation'
import { animateSvgDeath } from './svgDeathAnimation'

export function animateSvgDeaths(
  deathAnimations: SvgDeathAnimation[],
  dt: number,
): void {
  // Iterate over copy of array to avoid modification during iteration
  const animations = [...deathAnimations]
  
  for (const deathAnim of animations) {
    const isComplete = animateSvgDeath(deathAnim, dt)
    
    if (isComplete) {
      // Remove from tracking array
      const index = deathAnimations.indexOf(deathAnim)
      if (index !== -1) {
        deathAnimations.splice(index, 1)
      }
      
      // Remove DOM element from document.body
      if (deathAnim.element.parentNode) {
        deathAnim.element.parentNode.removeChild(deathAnim.element)
      }
    }
  }
}
