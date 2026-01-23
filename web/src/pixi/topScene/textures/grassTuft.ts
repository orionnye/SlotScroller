import { Application, Graphics, type Texture } from 'pixi.js'
import { createSeededRng } from '../../../game/rng/rng'

export function createGrassTuftTexture(app: Application, seed: number): Texture {
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
