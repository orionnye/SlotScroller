/// <reference types="@vitest/browser/providers/playwright" />

import { defineConfig } from 'vitest/config'
import { playwright } from '@vitest/browser-playwright'

export default defineConfig({
  test: {
    setupFiles: ['./vitest.setup.ts'],
    deps: {
      inline: ['vitest-canvas-webgl-mock'],
    },
  },
  projects: [
    // Unit tests with happy-dom (for pure game logic)
    {
      name: 'unit',
      test: {
        include: ['src/**/*.test.ts'],
        exclude: ['src/**/*.browser.test.ts'],
        environment: 'happy-dom',
      },
    },
    // Browser tests with Playwright (for rendering components)
    {
      name: 'browser',
      test: {
        include: ['src/**/*.browser.test.ts'],
        browser: {
          enabled: true,
          provider: playwright({
            launchOptions: {
              headless: true,
            },
          }),
          instances: [
            {
              browser: 'chromium',
              context: {
                viewport: { width: 1024, height: 768 },
              },
            },
          ],
          headless: true,
          viewport: { width: 1024, height: 768 },
        },
      },
    },
  ],
})

