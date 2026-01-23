import { Application, Graphics, type Texture } from 'pixi.js'

export function createGunTexture(app: Application): Texture {
  const h = 24
  const g = new Graphics()

  // Larger, more detailed pistol shape
  // Gun body (main rectangle - larger)
  g.roundRect(0, h / 2 - 6, 28, 12, 3)
    .fill({ color: 0x2d3748, alpha: 1 }) // Dark gray body
  
  // Body detail: side panels
  g.roundRect(2, h / 2 - 5, 24, 10, 2)
    .fill({ color: 0x1a202c, alpha: 1 }) // Darker inner panel
  
  // Gun barrel (extended rectangle - longer)
  g.roundRect(26, h / 2 - 4, 18, 8, 2)
    .fill({ color: 0x1a202c, alpha: 1 }) // Darker barrel
  
  // Barrel details: rifling lines
  for (let i = 0; i < 3; i += 1) {
    g.rect(28 + i * 5, h / 2 - 3, 1, 6).fill({ color: 0x0f1419, alpha: 0.6 })
  }
  
  // Gun grip (larger rectangle at bottom)
  g.roundRect(6, h / 2 + 6, 12, 10, 2)
    .fill({ color: 0x4a5568, alpha: 1 }) // Medium gray grip
  
  // Grip texture: horizontal lines
  for (let i = 0; i < 4; i += 1) {
    g.rect(7, h / 2 + 7 + i * 2, 10, 1).fill({ color: 0x2d3748, alpha: 0.5 })
  }
  
  // Trigger guard (larger arc)
  g.moveTo(8, h / 2 + 2)
  g.quadraticCurveTo(12, h / 2 + 10, 16, h / 2 + 2)
  g.stroke({ color: 0x1a202c, alpha: 1, width: 2 })
  
  // Trigger (small rectangle inside guard)
  g.roundRect(10, h / 2 + 4, 4, 6, 1)
    .fill({ color: 0x0f1419, alpha: 1 })
  
  // Hammer (small rectangle at back)
  g.roundRect(2, h / 2 - 8, 6, 4, 1)
    .fill({ color: 0x1a202c, alpha: 1 })
  
  // Barrel tip highlight (brighter)
  g.rect(42, h / 2 - 3, 2, 6).fill({ color: 0x9ca3af, alpha: 0.7 })
  
  // Muzzle flash port (small circle at tip)
  g.circle(44, h / 2, 2).fill({ color: 0x000000, alpha: 0.8 })
  
  // Main outline for definition
  g.roundRect(0, h / 2 - 6, 28, 12, 3)
    .stroke({ color: 0x000000, alpha: 0.4, width: 2 })
  g.roundRect(26, h / 2 - 4, 18, 8, 2)
    .stroke({ color: 0x000000, alpha: 0.4, width: 2 })

  return app.renderer.generateTexture(g)
}
