import { Application } from 'pixi.js'

import type { ScrollerSprite } from '../types'

type Rng = {
  nextInt: (max: number) => number
}

type SceneState = {
  speedPxPerSec: number
  groundY: number
  treeScale: number
}

export function animateBackground(
  tufts: ScrollerSprite[],
  trees: ScrollerSprite[],
  rng: Rng,
  state: SceneState,
  app: Application,
  dt: number,
): void {
  const w = app.renderer.width
  const dx = state.speedPxPerSec * dt

  // Update background elements (scroll left)
  for (const t of tufts) {
    t.sprite.x -= dx * t.speed
    if (t.sprite.x < -80) {
      t.sprite.x = w + 80 + rng.nextInt(140)
      t.sprite.y = state.groundY + 3 // Slightly beneath ground
      t.sprite.scale.set(0.6 + rng.nextInt(60) / 100)
    }
  }

  for (const tr of trees) {
    tr.sprite.x -= dx * tr.speed
    if (tr.sprite.x < -140) {
      tr.sprite.x = w + 240 + rng.nextInt(420)
      tr.sprite.y = state.groundY + 2 // Slightly beneath ground
      tr.sprite.scale.set(state.treeScale * (0.55 + rng.nextInt(40) / 100))
    }
  }
}
