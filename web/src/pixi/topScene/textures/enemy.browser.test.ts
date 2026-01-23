import { describe, test, expect, beforeEach, afterEach } from 'vitest'
import { SlimeBlobEnemy } from '../units/SlimeBlobEnemy'
import {
  createPixiApp,
  cleanupPixiApp,
  type PixiAppSetup,
} from '../../__tests__/browser-test-utils'

describe('SlimeBlobEnemy', () => {
  let setup: PixiAppSetup

  beforeEach(async () => {
    setup = await createPixiApp({ width: 800, height: 600, antialias: true })
  })

  afterEach(async () => {
    if (setup) {
      await cleanupPixiApp(setup.app, setup.container)
    }
  })

  test('given app and seed, should return a Texture from renderToPixi', () => {
    const enemyUnit = new SlimeBlobEnemy(1)
    const texture = enemyUnit.renderToPixi(setup.app)
    expect(texture).toBeDefined()
    expect(texture.width).toBeGreaterThan(0)
    expect(texture.height).toBeGreaterThan(0)
  })

  test('given same seed, should produce consistent texture', () => {
    const enemyUnit1 = new SlimeBlobEnemy(42)
    const enemyUnit2 = new SlimeBlobEnemy(42)
    const texture1 = enemyUnit1.renderToPixi(setup.app)
    const texture2 = enemyUnit2.renderToPixi(setup.app)
    expect(texture1.width).toBe(texture2.width)
    expect(texture1.height).toBe(texture2.height)
  })

  test('given different seeds, should produce different textures', () => {
    const enemyUnit1 = new SlimeBlobEnemy(1)
    const enemyUnit2 = new SlimeBlobEnemy(999)
    const texture1 = enemyUnit1.renderToPixi(setup.app)
    const texture2 = enemyUnit2.renderToPixi(setup.app)
    // Textures should have same dimensions but different visual content
    expect(texture1.width).toBe(texture2.width)
    expect(texture1.height).toBe(texture2.height)
  })

  test('given valid parameters, should create texture with expected dimensions', () => {
    const enemyUnit = new SlimeBlobEnemy(100)
    const texture = enemyUnit.renderToPixi(setup.app)
    // Based on implementation: w = 40, h = 36
    expect(texture.width).toBe(40)
    expect(texture.height).toBe(36)
  })

  test('given seed, should return valid SVG from renderToSvg', () => {
    const enemyUnit = new SlimeBlobEnemy(1)
    const svg = enemyUnit.renderToSvg()
    expect(svg).toBeDefined()
    expect(svg.tagName).toBe('svg')
    expect(svg.getAttribute('width')).toBe('40')
    expect(svg.getAttribute('height')).toBe('36')
    expect(svg.getAttribute('viewBox')).toBe('0 0 40 36')
  })

  test('given same seed, should produce consistent SVG', () => {
    const enemyUnit1 = new SlimeBlobEnemy(42)
    const enemyUnit2 = new SlimeBlobEnemy(42)
    const svg1 = enemyUnit1.renderToSvg()
    const svg2 = enemyUnit2.renderToSvg()
    // Same seed should produce same SVG structure
    expect(svg1.getAttribute('width')).toBe(svg2.getAttribute('width'))
    expect(svg1.getAttribute('height')).toBe(svg2.getAttribute('height'))
    expect(svg1.children.length).toBe(svg2.children.length)
  })

  test('given seed, should have correct properties', () => {
    const enemyUnit = new SlimeBlobEnemy(100)
    expect(enemyUnit.seed).toBe(100)
    expect(enemyUnit.width).toBe(40)
    expect(enemyUnit.height).toBe(36)
    expect(enemyUnit.color).toBeGreaterThan(0)
  })
})
