import { Application, Container, Graphics, Sprite, type Texture } from 'pixi.js'

import { SCENE_CONFIG } from '../../game/config/sceneConfig'
import { createSeededRng } from '../../game/rng/rng'

type MountedTopScene = {
  app: Application
  destroy: () => void
}

function createGrassTuftTexture(app: Application, seed: number): Texture {
  const rng = createSeededRng(seed)
  const w = 64
  const h = 48

  const g = new Graphics()
  const baseColor = 0x22c55e
  const dark = 0x16a34a

  const bladeCount = 8 + rng.nextInt(8)
  for (let i = 0; i < bladeCount; i += 1) {
    const x = 8 + rng.nextInt(48)
    const height = 18 + rng.nextInt(20)
    const width = 2 + rng.nextInt(2)
    const tilt = (rng.nextInt(21) - 10) / 25

    g.moveTo(x, h - 6)
    g.lineTo(x + tilt * height, h - 6 - height)
    g.stroke({ color: i % 3 === 0 ? dark : baseColor, alpha: 0.95, width })
  }

  // small ground shadow
  g.ellipse(w / 2, h - 6, 18, 5).fill({ color: 0x000000, alpha: 0.12 })

  return app.renderer.generateTexture(g)
}

function createTreeTexture(app: Application, seed: number): Texture {
  const rng = createSeededRng(seed)
  const w = 140
  const h = 220

  const trunk = new Graphics()
    .roundRect(w / 2 - 10, h - 70, 20, 70, 8)
    .fill({ color: 0x7c4a2d, alpha: 1 })
    .stroke({ color: 0x000000, alpha: 0.12, width: 3 })

  // canopy as a few circles
  const canopy = new Graphics()
  const greens = [0x16a34a, 0x22c55e, 0x15803d]
  const baseR = 46 + rng.nextInt(10)

  for (let i = 0; i < 5; i += 1) {
    const cx = w / 2 + (rng.nextInt(41) - 20)
    const cy = h - 110 + (rng.nextInt(31) - 15)
    const r = baseR - rng.nextInt(10)
    canopy.circle(cx, cy, r).fill({ color: greens[i % greens.length], alpha: 1 })
  }

  canopy.stroke({ color: 0x000000, alpha: 0.10, width: 3 })

  // highlight
  canopy.circle(w / 2 - 18, h - 140, 20).fill({ color: 0xffffff, alpha: 0.08 })

  const root = new Container()
  root.addChild(trunk)
  root.addChild(canopy)

  return app.renderer.generateTexture(root)
}

function createHeroTexture(app: Application): Texture {
  const g = new Graphics()
  const w = 32
  const h = 48

  // Simple placeholder hero: body (circle) + head (circle) + legs (rectangles)
  // Body
  g.circle(w / 2, h - 20, 12).fill({ color: 0x4a90e2, alpha: 1 })
  // Head
  g.circle(w / 2, h - 40, 8).fill({ color: 0xffdbac, alpha: 1 })
  // Legs (simple rectangles for walking animation base)
  g.rect(w / 2 - 4, h - 8, 3, 8).fill({ color: 0x2c3e50, alpha: 1 })
  g.rect(w / 2 + 1, h - 8, 3, 8).fill({ color: 0x2c3e50, alpha: 1 })
  // Arms
  g.rect(w / 2 - 10, h - 25, 4, 10).fill({ color: 0x4a90e2, alpha: 1 })
  g.rect(w / 2 + 6, h - 25, 4, 10).fill({ color: 0x4a90e2, alpha: 1 })

  return app.renderer.generateTexture(g)
}

function createEnemyTexture(app: Application, seed: number): Texture {
  const rng = createSeededRng(seed)
  const g = new Graphics()
  const w = 32
  const h = 48

  // Simple placeholder enemy: similar to hero but different color
  const bodyColor = rng.nextInt(2) === 0 ? 0xe74c3c : 0x9b59b6
  // Body
  g.circle(w / 2, h - 20, 12).fill({ color: bodyColor, alpha: 1 })
  // Head
  g.circle(w / 2, h - 40, 8).fill({ color: 0xffdbac, alpha: 1 })
  // Legs
  g.rect(w / 2 - 4, h - 8, 3, 8).fill({ color: 0x2c3e50, alpha: 1 })
  g.rect(w / 2 + 1, h - 8, 3, 8).fill({ color: 0x2c3e50, alpha: 1 })
  // Arms
  g.rect(w / 2 - 10, h - 25, 4, 10).fill({ color: bodyColor, alpha: 1 })
  g.rect(w / 2 + 6, h - 25, 4, 10).fill({ color: bodyColor, alpha: 1 })

  return app.renderer.generateTexture(g)
}

export async function mountTopScene(rootEl: HTMLElement): Promise<MountedTopScene> {
  const app = new Application()

  await app.init({
    resizeTo: rootEl,
    background: 0x07101c,
    antialias: true,
  })

  rootEl.appendChild(app.canvas)

  const world = new Container()
  app.stage.addChild(world)

  const sky = new Graphics()
  const ground = new Graphics()
  world.addChild(sky)
  world.addChild(ground)

  const tuftsLayer = new Container()
  const treesLayer = new Container()
  const charactersLayer = new Container()
  world.addChild(treesLayer)
  world.addChild(tuftsLayer)
  world.addChild(charactersLayer)

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

  type ScrollerSprite = {
    sprite: Sprite
    speed: number
    kind: 'tuft' | 'tree'
  }

  type CharacterSprite = {
    sprite: Sprite
    speed: number
    kind: 'hero' | 'enemy'
    walkPhase: number
  }

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

  const state = {
    speedPxPerSec: SCENE_CONFIG.scrollSpeedPxPerSec,
    groundY: 0,
    groundH: 0,
    treeScale: 1,
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

  const spawnTuft = (x: number) => {
    const tex = tuftTextures[rng.nextInt(tuftTextures.length)]
    const s = new Sprite(tex)
    s.anchor.set(0.5, 1)
    s.x = x
    s.y = state.groundY + 3 // Slightly beneath ground for natural look
    s.scale.set(0.6 + rng.nextInt(60) / 100)
    s.alpha = 0.9
    tuftsLayer.addChild(s)
    tufts.push({ sprite: s, speed: 1, kind: 'tuft' })
  }

  const spawnTree = (x: number) => {
    const tex = treeTextures[rng.nextInt(treeTextures.length)]
    const s = new Sprite(tex)
    s.anchor.set(0.5, 1)
    s.x = x
    s.y = state.groundY + 2 // Slightly beneath ground for natural look
    s.scale.set(0.55 + rng.nextInt(40) / 100)
    s.alpha = 1
    treesLayer.addChild(s)
    trees.push({ sprite: s, speed: 0.55, kind: 'tree' })
  }

  const spawnEnemy = (x: number) => {
    const tex = createEnemyTexture(app, rng.nextInt(1000))
    const s = new Sprite(tex)
    s.anchor.set(0.5, 1)
    s.x = x
    s.y = state.groundY
    s.scale.set(1)
    s.alpha = 1
    charactersLayer.addChild(s)
    enemies.push({ sprite: s, speed: -40, kind: 'enemy', walkPhase: 0 })
  }

  layout()

  // Initialize hero
  hero.sprite.anchor.set(0.5, 1)
  hero.sprite.x = 100
  hero.sprite.y = state.groundY
  hero.sprite.scale.set(1)
  charactersLayer.addChild(hero.sprite)

  // Initial population (enough to cover typical widths)
  const populate = () => {
    const w = app.renderer.width

    tuftsLayer.removeChildren()
    treesLayer.removeChildren()
    tufts.length = 0
    trees.length = 0

    let x = 0
    while (x < w + 200) {
      spawnTuft(x + rng.nextInt(120))
      x += 120
    }

    let tx = 120
    while (tx < w + 400) {
      spawnTree(tx + rng.nextInt(260))
      tx += 420 + rng.nextInt(220)
    }

    // Spawn initial enemies
    charactersLayer.removeChildren()
    enemies.length = 0
    charactersLayer.addChild(hero.sprite) // Re-add hero
    let ex = w + 100
    for (let i = 0; i < 3; i += 1) {
      spawnEnemy(ex)
      ex += 200 + rng.nextInt(200)
    }
  }

  populate()

  const tick = (time: { deltaTime: number }) => {
    const w = app.renderer.width
    const dt = time.deltaTime / 60
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

    // Update hero - fixed position in back third of screen with walking animation
    hero.sprite.x = w * 0.33 // Keep fixed at back third position
    hero.walkPhase += dt * 8 // Animation phase for walking
    // Simple walking animation: slight vertical bob
    hero.sprite.y = state.groundY + Math.sin(hero.walkPhase) * 2

    // Update enemies (move left toward hero)
    for (const enemy of enemies) {
      enemy.sprite.x += (enemy.speed * dt)
      enemy.walkPhase += dt * 8 // Animation phase for walking
      // Simple walking animation: slight vertical bob
      enemy.sprite.y = state.groundY + Math.sin(enemy.walkPhase) * 2

      // Respawn enemy if goes off screen left
      if (enemy.sprite.x < -50) {
        enemy.sprite.x = w + 50 + rng.nextInt(200)
      }
    }
  }

  app.ticker.add(tick)

  const onResize = () => {
    layout()
    // Update hero position for new screen width
    hero.sprite.x = app.renderer.width * 0.33
    // Repopulate to ensure proper spacing after resize
    populate()
  }
  window.addEventListener('resize', onResize)

  return {
    app,
    destroy: () => {
      window.removeEventListener('resize', onResize)
      app.ticker.remove(tick)
      app.destroy(true)
    },
  }
}

