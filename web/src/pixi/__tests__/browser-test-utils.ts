import { Application } from 'pixi.js'

export type PixiAppSetup = {
  app: Application
  container: HTMLElement
}

export type CreatePixiAppOptions = {
  width?: number
  height?: number
  background?: number
  antialias?: boolean
}

/**
 * Creates an isolated DOM container for testing.
 * Each call returns a fresh container that can be cleaned up independently.
 */
export function createTestContainer(): HTMLElement {
  const container = document.createElement('div')
  container.style.position = 'absolute'
  container.style.top = '0'
  container.style.left = '0'
  container.style.width = '100px'
  container.style.height = '100px'
  container.style.overflow = 'hidden'
  document.body.appendChild(container)
  return container
}

/**
 * Creates and initializes a PixiJS Application in the browser.
 * Returns both the Application instance and the container element.
 *
 * @param options - Optional configuration for the Application
 * @returns Promise resolving to Application and container
 */
export async function createPixiApp(
  options: CreatePixiAppOptions = {},
): Promise<PixiAppSetup> {
  const {
    width = 100,
    height = 100,
    background = 0x000000,
    antialias = false,
  } = options

  const container = createTestContainer()
  const app = new Application()

  await app.init({
    width,
    height,
    background,
    antialias,
  })

  container.appendChild(app.canvas)

  return { app, container }
}

/**
 * Cleans up a PixiJS Application and its associated DOM elements.
 * Destroys the Application instance and removes the container from the DOM.
 *
 * @param app - The Application instance to destroy
 * @param container - The container element to remove
 */
export async function cleanupPixiApp(
  app: Application,
  container: HTMLElement,
): Promise<void> {
  try {
    if (app.canvas && container.contains(app.canvas)) {
      container.removeChild(app.canvas)
    }
  } catch (error) {
    // Ignore errors if canvas was already removed
  }

  try {
    await app.destroy(true)
  } catch (error) {
    // Ignore errors if app was already destroyed
  }

  try {
    if (container.parentNode) {
      container.parentNode.removeChild(container)
    }
  } catch (error) {
    // Ignore errors if container was already removed
  }
}
