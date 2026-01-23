import { Application, Container, Graphics, type Texture } from 'pixi.js'
import { createSeededRng } from '../../../game/rng/rng'

export function createTreeTexture(app: Application, seed: number): Texture {
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
