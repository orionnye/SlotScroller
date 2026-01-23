import { describe, test, expect, beforeEach, afterEach } from 'vitest'
import { createGunTexture } from './gun'
import {
  createPixiApp,
  cleanupPixiApp,
  type PixiAppSetup,
} from '../../__tests__/browser-test-utils'

describe('createGunTexture', () => {
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
    const texture = createGunTexture(setup.app)
    expect(texture).toBeDefined()
    expect(texture.width).toBeGreaterThan(0)
    expect(texture.height).toBeGreaterThan(0)
  })

  test('given app, should create texture with expected dimensions', () => {
    const texture = createGunTexture(setup.app)
    // Based on implementation: h = 24, width should be ~48 (gun body + barrel)
    expect(texture.width).toBeGreaterThan(40)
    expect(texture.height).toBe(24)
  })

  test('given same app, should produce consistent texture', () => {
    const texture1 = createGunTexture(setup.app)
    const texture2 = createGunTexture(setup.app)
    expect(texture1.width).toBe(texture2.width)
    expect(texture1.height).toBe(texture2.height)
  })
})
