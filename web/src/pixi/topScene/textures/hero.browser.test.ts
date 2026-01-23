import { describe, test, expect, beforeEach, afterEach } from 'vitest'
import { createHeroTexture } from './hero'
import {
  createPixiApp,
  cleanupPixiApp,
  type PixiAppSetup,
} from '../../__tests__/browser-test-utils'

describe('createHeroTexture', () => {
  let setup: PixiAppSetup

  beforeEach(async () => {
    setup = await createPixiApp({ width: 800, height: 600, antialias: true })
  })

  afterEach(async () => {
    if (setup) {
      await cleanupPixiApp(setup.app, setup.container)
    }
  })

  test('given app, should return a Texture', () => {
    const texture = createHeroTexture(setup.app)
    expect(texture).toBeDefined()
    expect(texture.width).toBeGreaterThan(0)
    expect(texture.height).toBeGreaterThan(0)
  })

  test('given app, should create texture with expected dimensions', () => {
    const texture = createHeroTexture(setup.app)
    // Based on implementation: w = 28, h = 32
    expect(texture.width).toBe(28)
    expect(texture.height).toBe(32)
  })

  test('given same app, should produce consistent texture', () => {
    const texture1 = createHeroTexture(setup.app)
    const texture2 = createHeroTexture(setup.app)
    expect(texture1.width).toBe(texture2.width)
    expect(texture1.height).toBe(texture2.height)
  })
})
