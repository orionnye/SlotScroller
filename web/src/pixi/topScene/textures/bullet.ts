import { Application, Graphics, type Texture } from 'pixi.js'

export function createBulletTexture(app: Application): Texture {
  const w = 8
  const h = 4
  const g = new Graphics()

  // Simple bullet: small rounded rectangle
  g.roundRect(0, 0, w, h, 1)
    .fill({ color: 0xffd700, alpha: 1 }) // Gold bullet
  
  // Bullet tip (slightly lighter)
  g.roundRect(0, 0, 3, h, 1)
    .fill({ color: 0xffed4e, alpha: 1 })
  
  // Outline
  g.roundRect(0, 0, w, h, 1)
    .stroke({ color: 0x000000, alpha: 0.4, width: 1 })

  return app.renderer.generateTexture(g)
}
