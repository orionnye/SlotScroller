import { Application, Graphics, type Texture } from 'pixi.js'

export function createHeroTexture(app: Application): Texture {
  const g = new Graphics()
  const w = 28
  const h = 32 // Very short knight

  // Short rectangular knight with armor
  const centerX = w / 2
  
  // Helmet (top rectangular piece)
  g.roundRect(centerX - 8, h - 32, 16, 10, 2)
    .fill({ color: 0x4a5568, alpha: 1 }) // Dark gray armor
    .stroke({ color: 0x2d3748, alpha: 1, width: 1 })
  
  // Helmet visor (small horizontal slit)
  g.rect(centerX - 6, h - 30, 12, 2).fill({ color: 0x1a202c, alpha: 1 })
  
  // Body armor (main rectangular torso)
  g.roundRect(centerX - 10, h - 22, 20, 14, 2)
    .fill({ color: 0x718096, alpha: 1 }) // Medium gray armor
    .stroke({ color: 0x4a5568, alpha: 1, width: 1 })
  
  // Armor plates (vertical segments for detail)
  g.rect(centerX - 8, h - 20, 2, 10).fill({ color: 0x4a5568, alpha: 1 })
  g.rect(centerX + 6, h - 20, 2, 10).fill({ color: 0x4a5568, alpha: 1 })
  
  // Shoulder pads (small rectangles on sides)
  g.roundRect(centerX - 12, h - 24, 4, 6, 1)
    .fill({ color: 0x4a5568, alpha: 1 })
  g.roundRect(centerX + 8, h - 24, 4, 6, 1)
    .fill({ color: 0x4a5568, alpha: 1 })
  
  // Legs (short rectangular legs)
  g.rect(centerX - 6, h - 8, 4, 8).fill({ color: 0x2d3748, alpha: 1 })
  g.rect(centerX + 2, h - 8, 4, 8).fill({ color: 0x2d3748, alpha: 1 })
  
  // Feet (small rectangles at bottom)
  g.rect(centerX - 7, h - 2, 5, 2).fill({ color: 0x1a202c, alpha: 1 })
  g.rect(centerX + 2, h - 2, 5, 2).fill({ color: 0x1a202c, alpha: 1 })

  return app.renderer.generateTexture(g)
}
