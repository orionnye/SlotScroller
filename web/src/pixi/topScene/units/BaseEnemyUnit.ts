import type { Application, Texture } from 'pixi.js'

/**
 * Base interface for enemy units that can render to multiple formats.
 * 
 * Enemy units encapsulate all rendering logic and can produce:
 * - PixiJS textures for use in sprites
 * - SVG elements for death animations and other uses
 */
export interface BaseEnemyUnit {
  /** Seed for deterministic generation */
  readonly seed: number
  
  /** Body color (hex value, e.g., 0x22c55e) */
  readonly color: number
  
  /** Unit width in pixels */
  readonly width: number
  
  /** Unit height in pixels */
  readonly height: number
  
  /**
   * Render enemy to PixiJS texture for use in sprites.
   * 
   * @param app - PixiJS Application instance
   * @returns Generated texture
   */
  renderToPixi(app: Application): Texture
  
  /**
   * Render enemy to SVG element for death animations and other uses.
   * 
   * @returns Fully constructed SVG element
   */
  renderToSvg(): SVGSVGElement
}
