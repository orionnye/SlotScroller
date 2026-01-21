import { describe, expect, test } from 'vitest'

import { computeCenteredGridLayout } from './gridLayout'

describe('computeCenteredGridLayout', () => {
  test('returns empty array when count is 0', () => {
    expect(
      computeCenteredGridLayout({
        count: 0,
        containerWidth: 800,
        wheelWidth: 100,
        wheelHeight: 200,
        gapX: 10,
        gapY: 10,
        maxCols: 5,
      }),
    ).toEqual([])
  })

  test('centers a single wheel at origin', () => {
    const [p] = computeCenteredGridLayout({
      count: 1,
      containerWidth: 800,
      wheelWidth: 100,
      wheelHeight: 200,
      gapX: 10,
      gapY: 10,
      maxCols: 5,
    })
    expect(p).toEqual({ x: 0, y: 0 })
  })

  test('uses multiple rows when container is narrow', () => {
    const points = computeCenteredGridLayout({
      count: 5,
      containerWidth: 260, // enough for 2 columns of 120 + gap
      wheelWidth: 120,
      wheelHeight: 200,
      gapX: 20,
      gapY: 30,
      maxCols: 5,
    })
    expect(points).toHaveLength(5)
    // first row should have 2 items
    expect(points[0].y).toBe(points[1].y)
    // second row y should differ
    expect(points[2].y).not.toBe(points[0].y)
  })
})

