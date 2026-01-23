import { Application, Container, Graphics, Sprite } from 'pixi.js'

import { SCENE_CONFIG } from '../../game/config/sceneConfig'
import { createSeededRng } from '../../game/rng/rng'
import { createGrassTuftTexture } from './textures/grassTuft'
import { createTreeTexture } from './textures/tree'
import { createHeroTexture } from './textures/hero'
import type { ScrollerSprite, CharacterSprite } from './types'
import type { SvgDeathAnimation } from './animation/svgDeathAnimation'
import { spawnTuft, spawnTree, spawnEnemy } from './sprites/spawn'
import { populateScene } from './sprites/populate'
import { findNearestEnemy, dealDamageToEnemy } from './combat/enemyCombat'
import { triggerHeroAttack } from './combat/heroAttack'
import { createTickHandler } from './animation/tickHandler'

type EnemyAttackCallback = (enemy: { sprite: Sprite }) => void

type MountedTopScene = {
  app: Application
  findNearestEnemy: () => { sprite: Sprite; hp?: number } | null
  dealDamageToEnemy: (enemy: { sprite: Sprite; hp?: number }, damage: number) => boolean
  triggerHeroAttack: (targetEnemy: { sprite: Sprite } | null, damage: number) => Promise<void>
  destroy: () => void
}







export async function mountTopScene(
  rootEl: HTMLElement,
  options: { onEnemyAttack?: EnemyAttackCallback } = {},
): Promise<MountedTopScene> {
  console.log('[mountTopScene] Starting initialization...')
  console.log('[mountTopScene] Root element:', {
    id: rootEl.id,
    tagName: rootEl.tagName,
    dimensions: { width: rootEl.offsetWidth, height: rootEl.offsetHeight },
  })

  const { onEnemyAttack } = options
  const app = new Application()

  try {
    await app.init({
      resizeTo: rootEl,
      background: 0x07101c,
      antialias: true,
    })
    console.log('[mountTopScene] Application initialized successfully')
    console.log('[mountTopScene] Canvas:', {
      exists: !!app.canvas,
      width: app.canvas.width,
      height: app.canvas.height,
    })
  } catch (error) {
    console.error('[mountTopScene] Failed to initialize application:', error)
    throw error
  }

  rootEl.appendChild(app.canvas)
  console.log('[mountTopScene] Canvas appended to root element')

  const world = new Container()
  app.stage.addChild(world)

  const sky = new Graphics()
  const ground = new Graphics()
  world.addChild(sky)
  world.addChild(ground)

  const tuftsLayer = new Container()
  const treesLayer = new Container()
  const charactersLayer = new Container()
  const frontLayer = new Container() // Front layer for dying enemies (renders above everything)
  world.addChild(treesLayer)
  world.addChild(tuftsLayer)
  world.addChild(charactersLayer)
  world.addChild(frontLayer) // Add last so it renders on top of everything

  const rng = createSeededRng(1337)

  const tuftTextures = [
    createGrassTuftTexture(app, 1),
    createGrassTuftTexture(app, 2),
    createGrassTuftTexture(app, 3),
  ]

  const treeTextures = [
    createTreeTexture(app, 10),
    createTreeTexture(app, 11),
    createTreeTexture(app, 12),
  ]

  const tufts: ScrollerSprite[] = []
  const trees: ScrollerSprite[] = []
  const heroTexture = createHeroTexture(app)
  const hero: CharacterSprite = {
    sprite: new Sprite(heroTexture),
    speed: 60, // pixels per second, moving right
    kind: 'hero',
    walkPhase: 0,
  }
  const enemies: CharacterSprite[] = []
  const deathAnimations: SvgDeathAnimation[] = []

  const state = {
    speedPxPerSec: SCENE_CONFIG.scrollSpeedPxPerSec,
    groundY: 0,
    groundH: 0,
    treeScale: 1,
    isPaused: false, // Track if animations are paused during gun fire
  }

  const layout = () => {
    const w = app.renderer.width
    const h = app.renderer.height

    // Position ground at configured ratio of viewport height
    state.groundY = Math.round(h * SCENE_CONFIG.groundPositionRatio)
    state.groundH = Math.max(SCENE_CONFIG.minGroundHeight, h - state.groundY)

    // Calculate tree scale to fit within available space above ground
    const availableHeight = state.groundY
    state.treeScale = Math.min(
      1,
      (availableHeight * SCENE_CONFIG.treeScaleRatio) / SCENE_CONFIG.treeBaseHeight,
    )

    sky.clear()
    sky.rect(0, 0, w, h).fill({ color: 0x0b2a4a, alpha: 1 })
    sky.rect(0, 0, w, state.groundY).fill({ color: 0x0b3b6a, alpha: 0.55 })

    ground.clear()
    ground
      .rect(0, state.groundY, w, state.groundH)
      .fill({ color: 0x0f3d22, alpha: 1 })
      .rect(0, state.groundY, w, 18)
      .fill({ color: 0x1f6b35, alpha: 1 })

    // Reposition existing sprites to match new layout
    // Position trees and grass slightly beneath ground (2-4 pixels) for natural look
    for (const t of tufts) {
      t.sprite.y = state.groundY + 3
    }
    for (const tr of trees) {
      tr.sprite.y = state.groundY + 2
      tr.sprite.scale.set(state.treeScale * (0.55 + rng.nextInt(40) / 100))
    }
    // Position hero in back third of screen (fixed position)
    hero.sprite.x = w * 0.33
    hero.sprite.y = state.groundY
    // Position enemies on ground
    for (const enemy of enemies) {
      enemy.sprite.y = state.groundY
    }
  }

  layout()

  // Initialize hero
  hero.sprite.anchor.set(0.5, 1)
  hero.sprite.x = 100
  hero.sprite.y = state.groundY
  hero.sprite.scale.set(1)
  charactersLayer.addChild(hero.sprite)

  // Initial population (enough to cover typical widths)
  populateScene(
    app,
    tuftsLayer,
    treesLayer,
    charactersLayer,
    tuftTextures,
    treeTextures,
    rng,
    state,
    spawnTuft,
    spawnTree,
    spawnEnemy,
    tufts,
    trees,
    enemies,
    hero,
  )

  const tick = createTickHandler(
    tufts,
    trees,
    hero,
    enemies,
    rng,
    state,
    app,
    charactersLayer,
    frontLayer,
    onEnemyAttack,
    deathAnimations,
  )

  app.ticker.add(tick)

  const onResize = () => {
    layout()
    // Update hero position for new screen width
    hero.sprite.x = app.renderer.width * 0.33
    // Repopulate to ensure proper spacing after resize
    populateScene(
      app,
      tuftsLayer,
      treesLayer,
      charactersLayer,
      tuftTextures,
      treeTextures,
      rng,
      state,
      spawnTuft,
      spawnTree,
      spawnEnemy,
      tufts,
      trees,
      enemies,
      hero,
    )
  }
  window.addEventListener('resize', onResize)



  return {
    app,
    findNearestEnemy: () => findNearestEnemy(enemies, hero),
    dealDamageToEnemy: (enemy: { sprite: Sprite; hp?: number }, damage: number) => {
      return dealDamageToEnemy(enemy, damage, enemies, charactersLayer, frontLayer, deathAnimations, app)
    },
    triggerHeroAttack: (targetEnemy: { sprite: Sprite } | null, damage: number) =>
      triggerHeroAttack(targetEnemy, damage, app, hero, enemies, charactersLayer, frontLayer, state, deathAnimations),
    destroy: () => {
      window.removeEventListener('resize', onResize)
      app.ticker.remove(tick)
      // Clean up all death animations
      for (const deathAnim of deathAnimations) {
        if (deathAnim.element.parentNode) {
          deathAnim.element.parentNode.removeChild(deathAnim.element)
        }
      }
      deathAnimations.length = 0
      app.destroy(true)
    },
  }
}

