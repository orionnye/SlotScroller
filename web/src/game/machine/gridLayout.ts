export type GridLayoutItem = {
  readonly x: number
  readonly y: number
}

export function computeCenteredGridLayout(args: {
  count: number
  containerWidth: number
  wheelWidth: number
  wheelHeight: number
  gapX: number
  gapY: number
  maxCols: number
}): GridLayoutItem[] {
  const { count, containerWidth, wheelWidth, wheelHeight, gapX, gapY, maxCols } = args

  if (count <= 0) return []

  const availableCols = Math.floor((containerWidth + gapX) / (wheelWidth + gapX))
  const cols = Math.max(1, Math.min(maxCols, availableCols, count))
  const rows = Math.ceil(count / cols)

  const totalW = cols * wheelWidth + (cols - 1) * gapX
  const totalH = rows * wheelHeight + (rows - 1) * gapY

  const startX = -totalW / 2 + wheelWidth / 2
  const startY = -totalH / 2 + wheelHeight / 2

  const out: GridLayoutItem[] = []
  for (let i = 0; i < count; i += 1) {
    const col = i % cols
    const row = Math.floor(i / cols)
    out.push({
      x: startX + col * (wheelWidth + gapX),
      y: startY + row * (wheelHeight + gapY),
    })
  }

  return out
}

