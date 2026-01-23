import { Application, Graphics, type Texture } from 'pixi.js'
import { createSeededRng } from '../../../game/rng/rng'
import type { BaseEnemyUnit } from './BaseEnemyUnit'

/**
 * Slime blob enemy unit implementation.
 * 
 * Represents a slime blob enemy with organic, fluid shape variations.
 * All rendering parameters are determined from a seed for deterministic generation.
 */
export class SlimeBlobEnemy implements BaseEnemyUnit {
  readonly seed: number
  readonly color: number
  readonly width: number = 40
  readonly height: number = 36
  
  // Render parameters
  readonly baseWidth: number
  readonly baseHeight: number
  readonly cornerRadius: number
  readonly bulgeOffsetX: number
  readonly bulgeOffsetY: number
  readonly bulgeRadius: number
  readonly highlightRadius: number
  readonly eyeY: number
  readonly eye1X: number
  readonly eye2X: number
  
  constructor(seed: number) {
    this.seed = seed
    
    // Initialize all render parameters from seed
    const rng = createSeededRng(seed)
    
    // Slime blob: organic, fluid shape with variations
    const slimeColors = [0x22c55e, 0x3b82f6, 0x8b5cf6] // Green, blue, purple
    this.color = slimeColors[rng.nextInt(slimeColors.length)]
    
    this.baseWidth = 28 + rng.nextInt(8) // 28-35 pixels wide
    this.baseHeight = 30 + rng.nextInt(6) // 30-35 pixels tall
    this.cornerRadius = 8 + rng.nextInt(4) // 8-11 pixels
    
    // Bulge variations for organic look
    this.bulgeOffsetX = (rng.nextInt(5) - 2) * 2 // -4 to +4
    this.bulgeOffsetY = (rng.nextInt(5) - 2) * 2
    this.bulgeRadius = 6 + rng.nextInt(3) // 6-8 pixels
    
    // Highlight for depth
    this.highlightRadius = 4 + rng.nextInt(2) // 4-5 pixels
    
    // Calculate eye positions
    const centerX = this.width / 2
    const centerY = this.height - this.baseHeight / 2
    this.eyeY = centerY - this.baseHeight / 4
    this.eye1X = centerX - 4
    this.eye2X = centerX + 4
  }
  
  renderToPixi(app: Application): Texture {
    const g = new Graphics()
    
    // Main blob body: rounded rectangle with slight variations
    const centerX = this.width / 2
    const centerY = this.height - this.baseHeight / 2
    
    // Main blob shape
    g.roundRect(
      centerX - this.baseWidth / 2,
      centerY - this.baseHeight / 2,
      this.baseWidth,
      this.baseHeight,
      this.cornerRadius
    ).fill({ color: this.color, alpha: 0.85 })
    
    // Add slight bulge variations for organic look
    g.circle(
      centerX + this.bulgeOffsetX,
      centerY - this.baseHeight / 4 + this.bulgeOffsetY,
      this.bulgeRadius
    ).fill({ color: this.color, alpha: 0.6 })
    
    // Highlight for depth
    g.circle(
      centerX - this.baseWidth / 4,
      centerY - this.baseHeight / 3,
      this.highlightRadius
    ).fill({ color: 0xffffff, alpha: 0.3 })
    
    // Simple eyes: two small circles
    g.circle(this.eye1X, this.eyeY, 2).fill({ color: 0x000000, alpha: 0.8 })
    g.circle(this.eye2X, this.eyeY, 2).fill({ color: 0x000000, alpha: 0.8 })
    
    // Subtle outline for definition
    g.roundRect(
      centerX - this.baseWidth / 2,
      centerY - this.baseHeight / 2,
      this.baseWidth,
      this.baseHeight,
      this.cornerRadius
    ).stroke({ color: 0x000000, alpha: 0.2, width: 1 })
    
    return app.renderer.generateTexture(g)
  }
  
  renderToSvg(): SVGSVGElement {
    // Helper function to convert hex color to CSS string
    const colorToCss = (hex: number): string => {
      return '#' + hex.toString(16).padStart(6, '0')
    }
    
    // Create SVG element
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    svg.setAttribute('width', String(this.width))
    svg.setAttribute('height', String(this.height))
    svg.setAttribute('viewBox', `0 0 ${this.width} ${this.height}`)
    
    // Calculate center positions (same as renderToPixi)
    const centerX = this.width / 2
    const centerY = this.height - this.baseHeight / 2
    
    // Main blob body (rounded rectangle)
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
    rect.setAttribute('x', String(centerX - this.baseWidth / 2))
    rect.setAttribute('y', String(centerY - this.baseHeight / 2))
    rect.setAttribute('width', String(this.baseWidth))
    rect.setAttribute('height', String(this.baseHeight))
    rect.setAttribute('rx', String(this.cornerRadius))
    rect.setAttribute('fill', colorToCss(this.color))
    rect.setAttribute('fill-opacity', '0.85')
    svg.appendChild(rect)
    
    // Bulge variation (circle)
    const bulge = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
    bulge.setAttribute('cx', String(centerX + this.bulgeOffsetX))
    bulge.setAttribute('cy', String(centerY - this.baseHeight / 4 + this.bulgeOffsetY))
    bulge.setAttribute('r', String(this.bulgeRadius))
    bulge.setAttribute('fill', colorToCss(this.color))
    bulge.setAttribute('fill-opacity', '0.6')
    svg.appendChild(bulge)
    
    // Highlight (circle)
    const highlight = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
    highlight.setAttribute('cx', String(centerX - this.baseWidth / 4))
    highlight.setAttribute('cy', String(centerY - this.baseHeight / 3))
    highlight.setAttribute('r', String(this.highlightRadius))
    highlight.setAttribute('fill', '#ffffff')
    highlight.setAttribute('fill-opacity', '0.3')
    svg.appendChild(highlight)
    
    // Eyes (two circles)
    const eye1 = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
    eye1.setAttribute('cx', String(this.eye1X))
    eye1.setAttribute('cy', String(this.eyeY))
    eye1.setAttribute('r', '2')
    eye1.setAttribute('fill', '#000000')
    eye1.setAttribute('fill-opacity', '0.8')
    svg.appendChild(eye1)
    
    const eye2 = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
    eye2.setAttribute('cx', String(this.eye2X))
    eye2.setAttribute('cy', String(this.eyeY))
    eye2.setAttribute('r', '2')
    eye2.setAttribute('fill', '#000000')
    eye2.setAttribute('fill-opacity', '0.8')
    svg.appendChild(eye2)
    
    // Outline (rounded rectangle stroke)
    const outline = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
    outline.setAttribute('x', String(centerX - this.baseWidth / 2))
    outline.setAttribute('y', String(centerY - this.baseHeight / 2))
    outline.setAttribute('width', String(this.baseWidth))
    outline.setAttribute('height', String(this.baseHeight))
    outline.setAttribute('rx', String(this.cornerRadius))
    outline.setAttribute('fill', 'none')
    outline.setAttribute('stroke', '#000000')
    outline.setAttribute('stroke-opacity', '0.2')
    outline.setAttribute('stroke-width', '1')
    svg.appendChild(outline)
    
    return svg
  }
}
