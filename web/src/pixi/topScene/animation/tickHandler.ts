import { Application, Container, Sprite } from 'pixi.js'

import { animateBackground } from './background'
import { animateEnemies } from './enemy'
import { animateHero } from './hero'
import { animateSvgDeaths } from './svgDeathAnimationAnimation'
import type { CharacterSprite, ScrollerSprite } from '../types'
import type { SvgDeathAnimation } from './svgDeathAnimation'

type Rng = {
  nextInt: (max: number) => number
}

type SceneState = {
  speedPxPerSec: number
  groundY: number
  treeScale: number
  isPaused: boolean
}

type EnemyAttackCallback = (enemy: { sprite: Sprite }) => void


export function createTickHandler(
  tufts: ScrollerSprite[],
  trees: ScrollerSprite[],
  hero: CharacterSprite,
  enemies: CharacterSprite[],
  rng: Rng,
  state: SceneState,
  app: Application,
  _charactersLayer: Container,
  _frontLayer: Container,
  onEnemyAttack?: EnemyAttackCallback,
  deathAnimations?: SvgDeathAnimation[],
) {
  // Mark unused parameters as intentionally unused
  void _charactersLayer
  void _frontLayer
  
  return (time: { deltaTime: number }) => {
    const dt = time.deltaTime / 60

    // Update SVG death animations (continue even when paused)
    if (deathAnimations) {
      animateSvgDeaths(deathAnimations, dt)
    }

    // Skip all other updates if paused (during gun fire)
    if (state.isPaused) return

    // Update background elements (scroll left)
    animateBackground(tufts, trees, rng, state, app, dt)

    // Update hero - fixed position in back third of screen with walking animation
    animateHero(hero, state, app, dt)

    // Update enemies (move left toward hero)
    // Skip enemies that are dying (they're hidden)
    const activeEnemies = enemies.filter((enemy) => !enemy.isDying)
    animateEnemies(activeEnemies, hero, rng, state, app, dt, onEnemyAttack)
  }
}
