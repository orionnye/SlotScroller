import { describe, test, expect, beforeEach, afterEach } from 'vitest'
import { createBulletTexture } from './bullet'
import {
  createPixiApp,
  cleanupPixiApp,
  type PixiAppSetup,
} from '../../__tests__/browser-test-utils'

describe('createBulletTexture', () => {
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
    const texture = createBulletTexture(setup.app)
    expect(texture).toBeDefined()
    expect(texture.width).toBeGreaterThan(0)
    expect(texture.height).toBeGreaterThan(0)
  })

  test('given app, should create texture with expected dimensions', () => {
    const texture = createBulletTexture(setup.app)
    // Based on implementation: w = 8, h = 4
    expect(texture.width).toBe(8)
    expect(texture.height).toBe(4)
  })

  test('given same app, should produce consistent texture', () => {
    const texture1 = createBulletTexture(setup.app)
    const texture2 = createBulletTexture(setup.app)
    expect(texture1.width).toBe(texture2.width)
    expect(texture1.height).toBe(texture2.height)
  })
})
