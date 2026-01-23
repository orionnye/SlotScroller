import { Application } from 'pixi.js'

import type { DeathClone } from './deathClone'

export function animateDeathClones(
  deathClones: DeathClone[],
  overlayApp: Application,
  dt: number,
): void {
  // Use a copy of the array to avoid issues when clones are removed during iteration
  const clonesToUpdate = [...deathClones]

  for (const clone of clonesToUpdate) {
    // Skip if clone was removed (no longer in main clones array)
    if (!deathClones.includes(clone)) continue

    // Apply gravity-like acceleration
    clone.deathVelocityY += 300 * dt // Gravity acceleration
    clone.sprite.y += clone.deathVelocityY * dt
    // Rotate slightly for dynamic effect
    clone.deathRotation += 2 * dt
    clone.sprite.rotation = clone.deathRotation

    // Remove clone if it falls well past the entire screen height (including bottom half)
    // Use full screen height since clone is in overlay app covering entire viewport
    const screenHeight = overlayApp.renderer.height
    if (clone.sprite.y > screenHeight + 100) {
      // Remove from overlay app stage
      overlayApp.stage.removeChild(clone.sprite)
      // Destroy sprite resources
      clone.sprite.destroy()
      // Remove from array
      const index = deathClones.indexOf(clone)
      if (index !== -1) {
        deathClones.splice(index, 1)
      }
    }
  }
}
