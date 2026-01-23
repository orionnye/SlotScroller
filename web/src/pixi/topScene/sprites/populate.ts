import { Application, Container, type Texture } from 'pixi.js'

import type { CharacterSprite, ScrollerSprite } from '../types'
import { spawnTuft, spawnTree, spawnEnemy } from './spawn'

type Rng = {
  nextInt: (max: number) => number
}

type SceneState = {
  groundY: number
  treeScale: number
}

export function populateScene(
  app: Application,
  tuftsLayer: Container,
  treesLayer: Container,
  charactersLayer: Container,
  tuftTextures: Texture[],
  treeTextures: Texture[],
  rng: Rng,
  state: SceneState,
  spawnTuftFn: typeof spawnTuft,
  spawnTreeFn: typeof spawnTree,
  spawnEnemyFn: typeof spawnEnemy,
  tufts: ScrollerSprite[],
  trees: ScrollerSprite[],
  enemies: CharacterSprite[],
  hero: CharacterSprite,
): void {
  const w = app.renderer.width

  tuftsLayer.removeChildren()
  treesLayer.removeChildren()
  tufts.length = 0
  trees.length = 0

  let x = 0
  while (x < w + 200) {
    spawnTuftFn(x + rng.nextInt(120), tuftTextures, rng, state.groundY, tuftsLayer, tufts)
    x += 120
  }

  let tx = 120
  while (tx < w + 400) {
    spawnTreeFn(tx + rng.nextInt(260), treeTextures, rng, state.groundY, state.treeScale, treesLayer, trees)
    tx += 420 + rng.nextInt(220)
  }

  // Spawn initial enemies
  charactersLayer.removeChildren()
  enemies.length = 0
  charactersLayer.addChild(hero.sprite) // Re-add hero
  let ex = w + 100
  for (let i = 0; i < 3; i += 1) {
    spawnEnemyFn(ex, app, rng, state.groundY, charactersLayer, enemies)
    ex += 200 + rng.nextInt(200)
  }
}
