import { Container, Graphics, Sprite, Text, type Application } from 'pixi.js'

import { WHEEL_CONFIG } from '../../game/config/wheelConfig'
import type { IconId } from '../../game/icons/iconIds'
import type { WheelStrip } from '../../game/wheel/wheelStrip'
import { getStripLayout } from '../../game/wheel/stripLayout'
import { createPlaceholderIconTexture } from '../icons/createPlaceholderIconTexture'

export type WheelStripViewOptions = {
  visibleCount?: number
  slotSpacing?: number
  iconSize?: number
}

export class WheelStripView extends Container {
  private readonly app: Application
  private readonly iconSize: number
  private readonly visibleCount: number
  public readonly slotSpacing: number

  private readonly iconsLayer: Container
  private readonly clipMask: Graphics

  private readonly sprites: Sprite[] = []
  private readonly textureCache = new Map<IconId, Sprite['texture']>()

  private readonly overlayLayer: Container
  private readonly topBlock: Graphics
  private readonly bottomBlock: Graphics
  private readonly frame: Graphics
  private readonly selector: Graphics
  private readonly valueLabel: Text
  private valueBaseY = 0
  private isDragging = false
  private dragStartX = 0
  private originalX = 0
  private isDraggable = true

  constructor(app: Application, strip: WheelStrip, options: WheelStripViewOptions = {}) {
    super()
    this.app = app

    this.visibleCount = options.visibleCount ?? WHEEL_CONFIG.visibleCount
    this.slotSpacing = options.slotSpacing ?? WHEEL_CONFIG.slotSpacing
    this.iconSize = options.iconSize ?? WHEEL_CONFIG.iconSize

    this.iconsLayer = new Container()
    this.clipMask = new Graphics()
    this.clipMask.alpha = 0

    this.overlayLayer = new Container()
    this.topBlock = new Graphics()
    this.bottomBlock = new Graphics()
    this.frame = new Graphics()
    this.selector = new Graphics()
    this.valueLabel = new Text({
      text: '',
      style: {
        fill: 0xffffff,
        fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif',
        fontSize: Math.round(this.iconSize * 0.42),
        fontWeight: '900',
        align: 'center',
        stroke: { color: 0x000000, width: Math.max(3, Math.round(this.iconSize * 0.08)) },
      },
    })
    this.valueLabel.anchor.set(0.5)
    this.valueLabel.visible = false
    this.valueLabel.alpha = 1

    for (let i = 0; i < this.visibleCount; i += 1) {
      const sprite = new Sprite(this.getTextureForIconId('coin'))
      sprite.anchor.set(0.5)
      this.sprites.push(sprite)
      this.iconsLayer.addChild(sprite)
    }

    // Clip only the icon sprites to the wheel frame bounds.
    // Pixi requires the mask to be in the subtree of the masked object's parent.
    this.addChild(this.clipMask)
    this.addChild(this.iconsLayer)
    this.iconsLayer.mask = this.clipMask

    this.overlayLayer.addChild(this.topBlock)
    this.overlayLayer.addChild(this.bottomBlock)
    this.overlayLayer.addChild(this.frame)
    this.overlayLayer.addChild(this.selector)
    this.overlayLayer.addChild(this.valueLabel)
    this.addChild(this.overlayLayer)

    this.renderSoftBlocks()
    this.renderFrame()
    this.renderClipMask()
    this.update(strip)
    this.setupDragInteraction()
  }

  setDraggable(draggable: boolean): void {
    this.isDraggable = draggable
    this.eventMode = draggable ? 'static' : 'auto'
    this.cursor = draggable ? 'grab' : 'default'
    if (!draggable && this.isDragging) {
      this.endDrag()
    }
  }

  private setupDragInteraction(): void {
    this.eventMode = 'static'
    this.cursor = 'grab'

    this.on('pointerdown', this.onDragStart.bind(this))
    this.on('pointermove', this.onDragMove.bind(this))
    this.on('pointerup', this.onDragEnd.bind(this))
    this.on('pointerupoutside', this.onDragEnd.bind(this))
  }

  private onDragStart(event: { globalX: number; globalY: number }): void {
    if (!this.isDraggable || this.isDragging) return

    this.isDragging = true
    this.dragStartX = event.globalX
    this.originalX = this.x
    this.cursor = 'grabbing'
    this.alpha = 0.8
    this.zIndex = 1000 // Bring to front while dragging

    // Emit custom event for mountPixi to handle
    this.emit('dragstart', { wheel: this, originalX: this.originalX })
  }

  private onDragMove(event: { globalX: number; globalY: number }): void {
    if (!this.isDragging) return

    // Convert global coordinates to local coordinates relative to parent (machine container)
    const globalPoint = { x: event.globalX, y: event.globalY }
    const localPoint = this.parent?.toLocal(globalPoint) ?? globalPoint
    const startLocalPoint = this.parent?.toLocal({ x: this.dragStartX, y: 0 }) ?? { x: this.dragStartX, y: 0 }

    const dx = localPoint.x - startLocalPoint.x
    // Constrain to horizontal movement only
    this.x = this.originalX + dx

    // Emit custom event for mountPixi to handle drop zone calculation
    this.emit('dragmove', { wheel: this, x: this.x, globalX: event.globalX })
  }

  private onDragEnd(event: { globalX: number; globalY: number }): void {
    if (!this.isDragging) return

    this.endDrag()

    // Emit custom event for mountPixi to handle drop
    this.emit('dragend', { wheel: this, x: this.x, globalX: event.globalX })
  }

  private endDrag(): void {
    this.isDragging = false
    this.cursor = 'grab'
    this.alpha = 1
    this.zIndex = 0
  }

  setDragPosition(x: number): void {
    this.x = x
  }

  private showLabel(args: { text: string; fill: number }): void {
    this.valueLabel.style.fill = args.fill
    this.valueLabel.text = args.text
    this.valueBaseY = -this.iconSize / 2 - 28
    this.valueLabel.position.set(0, this.valueBaseY)
    this.valueLabel.alpha = 1
    this.valueLabel.visible = true
  }

  showValue(value: number): void {
    this.showLabel({ text: `+${value}`, fill: 0xffffff })
  }

  showBonus(value: number): void {
    this.showLabel({ text: `+${value}`, fill: 0xfbbf24 })
  }

  hideValue(): void {
    this.valueLabel.visible = false
    this.valueLabel.alpha = 1
    this.valueLabel.position.set(0, this.valueBaseY)
  }

  async rollOffValue(options: { distancePx?: number; durationMs?: number } = {}): Promise<void> {
    if (!this.valueLabel.visible) return

    const { distancePx = 22, durationMs = 220 } = options
    const startY = this.valueLabel.y
    const endY = startY - distancePx

    const startMs = performance.now()

    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)

    await new Promise<void>((resolve) => {
      const tick = () => {
        const tRaw = (performance.now() - startMs) / durationMs
        const t = Math.max(0, Math.min(1, tRaw))
        const e = easeOutCubic(t)

        this.valueLabel.y = startY + (endY - startY) * e
        this.valueLabel.alpha = 1 - e

        if (t >= 1) {
          this.app.ticker.remove(tick)
          resolve()
        }
      }

      this.app.ticker.add(tick)
    })

    this.hideValue()
  }

  update(strip: WheelStrip, scrollOffsetY = 0): void {
    const layout = getStripLayout({
      strip,
      visibleCount: this.visibleCount,
      slotSpacing: this.slotSpacing,
    })

    for (let i = 0; i < this.visibleCount; i += 1) {
      const sprite = this.sprites[i]
      sprite.texture = this.getTextureForIconId(layout.iconIds[i])
      sprite.width = this.iconSize
      sprite.height = this.iconSize
      sprite.position.set(0, layout.yPositions[i] + scrollOffsetY)
      sprite.alpha = i === layout.selectedIndex ? 1 : 0.72
    }

    this.renderSelector(layout.selectedIndex)
  }

  private getTextureForIconId(iconId: IconId) {
    const cached = this.textureCache.get(iconId)
    if (cached) return cached

    const texture = createPlaceholderIconTexture(this.app, iconId, 128)
    this.textureCache.set(iconId, texture)
    return texture
  }

  private renderFrame(): void {
    const w = this.iconSize + 36
    const h = (this.visibleCount - 1) * this.slotSpacing + this.iconSize + 36

    this.frame.clear()
    this.frame
      .roundRect(-w / 2, -h / 2, w, h, 18)
      .stroke({ color: 0xffffff, alpha: 0.14, width: 2 })
  }

  private renderClipMask(): void {
    const w = this.iconSize + 36
    const h = (this.visibleCount - 1) * this.slotSpacing + this.iconSize + 36

    this.clipMask.clear()
    this.clipMask.roundRect(-w / 2, -h / 2, w, h, 18).fill({ color: 0xffffff, alpha: 1 })
  }

  private renderSoftBlocks(): void {
    const frameW = this.iconSize + 36
    const frameH = (this.visibleCount - 1) * this.slotSpacing + this.iconSize + 36

    // Treat the "window" as the selected slot area (same height as the selector box).
    const windowH = this.iconSize + 18
    const coverH = (frameH - windowH) / 2

    const coverColor = 0x0b1228
    const coverAlpha = 0.55

    this.topBlock.clear()
    this.topBlock
      .rect(-frameW / 2, -frameH / 2, frameW, coverH)
      .fill({ color: coverColor, alpha: coverAlpha })

    this.bottomBlock.clear()
    this.bottomBlock
      .rect(-frameW / 2, frameH / 2 - coverH, frameW, coverH)
      .fill({ color: coverColor, alpha: coverAlpha })
  }

  private renderSelector(selectedIndex: number): void {
    const y = (selectedIndex - Math.floor(this.visibleCount / 2)) * this.slotSpacing
    const w = this.iconSize + 26
    const h = this.iconSize + 18

    this.selector.clear()
    this.selector
      .roundRect(-w / 2, y - h / 2, w, h, 16)
      .stroke({ color: 0x60a5fa, alpha: 1, width: 3 })
  }
}

