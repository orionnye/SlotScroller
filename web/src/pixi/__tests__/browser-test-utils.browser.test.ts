import { describe, expect, test, afterEach } from 'vitest'

import {
  createPixiApp,
  createTestContainer,
  cleanupPixiApp,
  type PixiAppSetup,
} from './browser-test-utils'

describe('browser-test-utils', () => {
  let setups: PixiAppSetup[] = []

  afterEach(async () => {
    // Cleanup all created apps
    for (const setup of setups) {
      await cleanupPixiApp(setup.app, setup.container)
    }
    setups = []
  })

  test('given createTestContainer is called, should create and append container to DOM', () => {
    const container = createTestContainer()
    expect(container).toBeInstanceOf(HTMLElement)
    expect(container.parentNode).toBe(document.body)
    expect(container.style.position).toBe('absolute')
    // Cleanup test container
    if (container.parentNode) {
      container.parentNode.removeChild(container)
    }
  })

  test('given createPixiApp is called, should create and initialize Application in browser', async () => {
    const setup = await createPixiApp({ width: 200, height: 150 })
    setups.push(setup)

    expect(setup.app).toBeDefined()
    expect(setup.app.renderer).toBeDefined()
    expect(setup.app.renderer.width).toBe(200)
    expect(setup.app.renderer.height).toBe(150)
    expect(setup.container).toBeInstanceOf(HTMLElement)
    expect(setup.container.contains(setup.app.canvas)).toBe(true)
  })

  test('given createPixiApp is called multiple times, should create isolated instances', async () => {
    const setup1 = await createPixiApp({ width: 100, height: 100 })
    const setup2 = await createPixiApp({ width: 200, height: 200 })
    setups.push(setup1, setup2)

    expect(setup1.app).not.toBe(setup2.app)
    expect(setup1.container).not.toBe(setup2.container)
    expect(setup1.app.renderer.width).toBe(100)
    expect(setup2.app.renderer.width).toBe(200)
  })

  test('given cleanupPixiApp is called, should remove Application and container from DOM', async () => {
    const setup = await createPixiApp()
    const { app, container } = setup

    expect(container.parentNode).toBe(document.body)
    expect(container.contains(app.canvas)).toBe(true)

    await cleanupPixiApp(app, container)

    expect(container.parentNode).toBeNull()
    expect(container.contains(app.canvas)).toBe(false)
  })

  test('given cleanupPixiApp is called multiple times, should handle gracefully', async () => {
    const setup = await createPixiApp()
    const { app, container } = setup

    await cleanupPixiApp(app, container)
    // Should not throw on second cleanup
    await cleanupPixiApp(app, container)
    await cleanupPixiApp(app, container)

    expect(container.parentNode).toBeNull()
  })
})
