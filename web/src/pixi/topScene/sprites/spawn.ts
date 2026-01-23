import { Application, Container, Sprite, type Texture } from 'pixi.js'

import { COMBAT_CONFIG } from '../../../game/config/combatConfig'
import { SlimeBlobEnemy } from '../units'
import type { CharacterSprite, ScrollerSprite } from '../types'

type Rng = {
  nextInt: (max: number) => number
}

export function spawnTuft(
  x: number,
  tuftTextures: Texture[],
  rng: Rng,
  groundY: number,
  tuftsLayer: Container,
  tufts: ScrollerSprite[],
): void {
  const tex = tuftTextures[rng.nextInt(tuftTextures.length)]
  const s = new Sprite(tex)
  s.anchor.set(0.5, 1)
  s.x = x
  s.y = groundY + 3 // Slightly beneath ground for natural look
  s.scale.set(0.6 + rng.nextInt(60) / 100)
  s.alpha = 0.9
  tuftsLayer.addChild(s)
  tufts.push({ sprite: s, speed: 1, kind: 'tuft' })
}

export function spawnTree(
  x: number,
  treeTextures: Texture[],
  rng: Rng,
  groundY: number,
  treeScale: number,
  treesLayer: Container,
  trees: ScrollerSprite[],
): void {
  const tex = treeTextures[rng.nextInt(treeTextures.length)]
  const s = new Sprite(tex)
  s.anchor.set(0.5, 1)
  s.x = x
  s.y = groundY + 2 // Slightly beneath ground for natural look
  s.scale.set(treeScale * (0.55 + rng.nextInt(40) / 100))
  s.alpha = 1
  treesLayer.addChild(s)
  trees.push({ sprite: s, speed: 0.55, kind: 'tree' })
}

export function spawnEnemy(
  x: number,
  app: Application,
  rng: Rng,
  groundY: number,
  charactersLayer: Container,
  enemies: CharacterSprite[],
): void {
  const seed = rng.nextInt(1000)
  const enemyUnit = new SlimeBlobEnemy(seed)
  const tex = enemyUnit.renderToPixi(app)
  
  const s = new Sprite(tex)
  s.anchor.set(0.5, 1)
  s.x = x
  s.y = groundY
  s.scale.set(1)
  s.alpha = 1
  charactersLayer.addChild(s)
  enemies.push({
    sprite: s,
    speed: -40,
    kind: 'enemy',
    walkPhase: 0,
    attackCooldownMs: COMBAT_CONFIG.enemyAttackCooldownMs,
    lastAttackMs: 0,
    hp: COMBAT_CONFIG.defaultEnemyHP,
    maxHp: COMBAT_CONFIG.defaultEnemyHP,
    color: enemyUnit.color, // Store color for backward compatibility
    enemyUnit: enemyUnit, // Store enemy unit for death animations
  })
}
