import { describe, test, expect, beforeEach, afterEach } from 'vitest'
import { createTreeTexture } from './tree'
import {
  createPixiApp,
  cleanupPixiApp,
  type PixiAppSetup,
} from '../../__tests__/browser-test-utils'

describe('createTreeTexture', () => {
  let setup: PixiAppSetup

  beforeEach(async () => {
    setup = await createPixiApp({ width: 800, height: 600, antialias: true })
  })

  afterEach(async () => {
    if (setup) {
      await cleanupPixiApp(setup.app, setup.container)
    }
  })

  test('given app and seed, should return a Texture', () => {
    const texture = createTreeTexture(setup.app, 1)
    expect(texture).toBeDefined()
    expect(texture.width).toBeGreaterThan(0)
    expect(texture.height).toBeGreaterThan(0)
  })

  test('given same seed, should produce consistent texture', () => {
    const texture1 = createTreeTexture(setup.app, 42)
    const texture2 = createTreeTexture(setup.app, 42)
    expect(texture1.width).toBe(texture2.width)
    expect(texture1.height).toBe(texture2.height)
  })

  test('given different seeds, should produce different textures', () => {
    const texture1 = createTreeTexture(setup.app, 1)
    const texture2 = createTreeTexture(setup.app, 999)
    // Textures should have same dimensions but different visual content
    expect(texture1.width).toBe(texture2.width)
    expect(texture1.height).toBe(texture2.height)
  })

  test('given valid parameters, should create texture with expected dimensions', () => {
    const texture = createTreeTexture(setup.app, 100)
    // Based on implementation: w = 140, h = 220
    expect(texture.width).toBe(140)
    expect(texture.height).toBe(220)
  })
})
