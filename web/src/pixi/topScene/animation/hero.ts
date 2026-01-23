import { Application } from 'pixi.js'

import type { CharacterSprite } from '../types'

type SceneState = {
  groundY: number
}

export function animateHero(
  hero: CharacterSprite,
  state: SceneState,
  app: Application,
  dt: number,
): void {
  const w = app.renderer.width

  // Update hero - fixed position in back third of screen with walking animation
  hero.sprite.x = w * 0.33 // Keep fixed at back third position
  hero.walkPhase += dt * 8 // Animation phase for walking
  // Simple walking animation: slight vertical bob
  hero.sprite.y = state.groundY + Math.sin(hero.walkPhase) * 2
}
