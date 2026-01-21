import { Container, Graphics, Text, type Application, type Texture } from 'pixi.js'

import type { IconId } from '../../game/icons/iconIds'

export function createPlaceholderIconTexture(
  app: Application,
  iconId: IconId,
  size = 128,
): Texture {
  const root = new Container()

  const r = Math.round(size * 0.18)
  const bg = new Graphics()
    .roundRect(0, 0, size, size, r)
    .fill({ color: 0x0b1228, alpha: 1 })
    .stroke({ color: 0xffffff, alpha: 0.12, width: Math.max(2, Math.round(size * 0.02)) })

  root.addChild(bg)

  const cx = size / 2
  const cy = size / 2

  const iconLayer = new Container()
  iconLayer.position.set(cx, cy)
  root.addChild(iconLayer)

  const strokeW = Math.max(2, Math.round(size * 0.02))
  const outline = { color: 0x000000, alpha: 0.22, width: strokeW }

  const addTextIcon = (text: string) => {
    const t = new Text({
      text,
      style: {
        fill: 0xffffff,
        fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif',
        fontSize: Math.round(size * 0.52),
        fontWeight: '900',
        align: 'center',
        stroke: { color: 0x000000, width: Math.max(3, Math.round(size * 0.04)) },
      },
    })
    t.anchor.set(0.5)
    iconLayer.addChild(t)
  }

  switch (iconId) {
    case 'cherry': {
      const cherry = new Graphics()
        .circle(-size * 0.06, size * 0.08, size * 0.22)
        .fill({ color: 0xe11d48, alpha: 1 })
        .stroke(outline)
        .circle(-size * 0.12, size * 0.02, size * 0.09)
        .fill({ color: 0xffffff, alpha: 0.18 })

      const stem = new Graphics()
        .roundRect(-size * 0.02, -size * 0.30, size * 0.06, size * 0.22, size * 0.03)
        .fill({ color: 0x22c55e, alpha: 1 })
        .stroke({ color: 0x000000, alpha: 0.18, width: strokeW })
      stem.rotation = -0.55
      stem.position.set(size * 0.12, -size * 0.02)

      const leaf = new Graphics()
        .ellipse(0, 0, size * 0.14, size * 0.08)
        .fill({ color: 0x16a34a, alpha: 1 })
        .stroke({ color: 0x000000, alpha: 0.18, width: strokeW })
      leaf.rotation = -0.3
      leaf.position.set(size * 0.18, -size * 0.18)

      iconLayer.addChild(cherry, stem, leaf)
      break
    }
    case 'lemon': {
      const lemon = new Graphics()
        .ellipse(0, 0, size * 0.30, size * 0.22)
        .fill({ color: 0xfacc15, alpha: 1 })
        .stroke({ color: 0x000000, alpha: 0.18, width: strokeW })
        .ellipse(-size * 0.10, -size * 0.06, size * 0.12, size * 0.08)
        .fill({ color: 0xffffff, alpha: 0.16 })

      const tip1 = new Graphics()
        .circle(-size * 0.30, 0, size * 0.05)
        .fill({ color: 0xfacc15, alpha: 1 })
      const tip2 = new Graphics()
        .circle(size * 0.30, 0, size * 0.05)
        .fill({ color: 0xfacc15, alpha: 1 })

      iconLayer.addChild(lemon, tip1, tip2)
      break
    }
    case 'seven': {
      addTextIcon('7')
      break
    }
    case 'star': {
      const star = new Graphics()
        .star(0, 0, 5, size * 0.30, size * 0.14, -Math.PI / 2)
        .fill({ color: 0xfbbf24, alpha: 1 })
        .stroke(outline)

      const shine = new Graphics()
        .circle(-size * 0.08, -size * 0.10, size * 0.06)
        .fill({ color: 0xffffff, alpha: 0.16 })

      iconLayer.addChild(star, shine)
      break
    }
    case 'diamond': {
      const d = size * 0.30
      const diamond = new Graphics()
        .poly(
          [
            0,
            -d,
            d,
            0,
            0,
            d,
            -d,
            0,
          ],
          true,
        )
        .fill({ color: 0x38bdf8, alpha: 1 })
        .stroke(outline)

      const facet = new Graphics()
        .poly([0, -d, d * 0.35, 0, 0, d * 0.15, -d * 0.35, 0], true)
        .fill({ color: 0xffffff, alpha: 0.14 })

      iconLayer.addChild(diamond, facet)
      break
    }
    case 'coin': {
      const coin = new Graphics()
        .circle(0, 0, size * 0.28)
        .fill({ color: 0xf59e0b, alpha: 1 })
        .stroke(outline)
        .circle(0, 0, size * 0.20)
        .stroke({ color: 0x000000, alpha: 0.18, width: strokeW })
        .circle(-size * 0.08, -size * 0.10, size * 0.08)
        .fill({ color: 0xffffff, alpha: 0.16 })

      iconLayer.addChild(coin)
      break
    }
    case 'clover': {
      const leafR = size * 0.12
      const clover = new Graphics()
        .circle(-leafR, -leafR, leafR)
        .fill({ color: 0x22c55e, alpha: 1 })
        .circle(leafR, -leafR, leafR)
        .fill({ color: 0x22c55e, alpha: 1 })
        .circle(-leafR, leafR, leafR)
        .fill({ color: 0x22c55e, alpha: 1 })
        .circle(leafR, leafR, leafR)
        .fill({ color: 0x22c55e, alpha: 1 })
        .stroke({ color: 0x000000, alpha: 0.18, width: strokeW })

      const stem = new Graphics()
        .roundRect(-size * 0.03, leafR * 1.6, size * 0.06, size * 0.22, size * 0.03)
        .fill({ color: 0x16a34a, alpha: 1 })

      iconLayer.addChild(clover, stem)
      break
    }
    case 'bar': {
      const plate = new Graphics()
        .roundRect(-size * 0.34, -size * 0.18, size * 0.68, size * 0.36, size * 0.10)
        .fill({ color: 0x111827, alpha: 1 })
        .stroke({ color: 0xffffff, alpha: 0.12, width: strokeW })

      const label = new Text({
        text: 'BAR',
        style: {
          fill: 0xffffff,
          fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif',
          fontSize: Math.round(size * 0.22),
          fontWeight: '900',
          letterSpacing: 2,
        },
      })
      label.anchor.set(0.5)

      iconLayer.addChild(plate, label)
      break
    }
  }

  // Generate a standalone texture; no need to add `root` to stage.
  return app.renderer.generateTexture(root)
}

