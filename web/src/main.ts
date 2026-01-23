import './style.css'

import { ANIMATION_CONFIG } from './game/config/animationConfig'
import { calcPayout } from './game/payout/calcPayout'
import { mountPixi } from './pixi/mountPixi'
import {
  revealBaseContributions,
  revealComboBonuses,
  type PayoutPanel,
} from './pixi/payoutRevealSequence'
import { mountTopScene } from './pixi/topScene/mountTopScene'
// import { createDeathAnimationTest } from './pixi/topScene/testDeathAnimation' // Disabled - using real death animations now

function createAppStructure(root: HTMLDivElement): {
  pixiRoot: HTMLDivElement
  topPixiRoot: HTMLDivElement
  spinBtn: HTMLButtonElement
  payoutTotal: HTMLDivElement
  payoutLines: HTMLDivElement
} {
  const appShell = document.createElement('div')
  appShell.className = 'appShell'

  const topBar = document.createElement('header')
  topBar.className = 'topBar'

  const title = document.createElement('div')
  title.className = 'title'
  title.textContent = 'Lottery Machine'

  const subtitle = document.createElement('div')
  subtitle.className = 'subtitle'
  subtitle.textContent = '5 wheels spin together'

  topBar.appendChild(title)
  topBar.appendChild(subtitle)

  const stageWrap = document.createElement('main')
  stageWrap.className = 'stageWrap'

  const splitLayout = document.createElement('div')
  splitLayout.className = 'splitLayout'

  const topHalf = document.createElement('section')
  topHalf.className = 'topHalf'

  const topPixiRoot = document.createElement('div')
  topPixiRoot.id = 'topPixiRoot'
  topPixiRoot.className = 'topPixiRoot'

  topHalf.appendChild(topPixiRoot)

  const bottomHalf = document.createElement('section')
  bottomHalf.className = 'bottomHalf'

  const gameLayout = document.createElement('div')
  gameLayout.className = 'gameLayout'

  const pixiRoot = document.createElement('div')
  pixiRoot.id = 'pixiRoot'
  pixiRoot.className = 'pixiRoot'

  const sidePanel = document.createElement('aside')
  sidePanel.className = 'sidePanel'

  const spinBtn = document.createElement('button')
  spinBtn.id = 'spinBtn'
  spinBtn.className = 'spinBtn'
  spinBtn.type = 'button'
  spinBtn.textContent = 'Spin'

  const payoutPanel = document.createElement('div')
  payoutPanel.id = 'payoutPanel'
  payoutPanel.className = 'payoutPanel'

  const payoutTitle = document.createElement('div')
  payoutTitle.className = 'payoutTitle'
  payoutTitle.textContent = 'Payout'

  const payoutTotal = document.createElement('div')
  payoutTotal.className = 'payoutTotal'
  payoutTotal.textContent = '—'

  const payoutLines = document.createElement('div')
  payoutLines.className = 'payoutLines'

  payoutPanel.appendChild(payoutTitle)
  payoutPanel.appendChild(payoutTotal)
  payoutPanel.appendChild(payoutLines)

  sidePanel.appendChild(spinBtn)
  sidePanel.appendChild(payoutPanel)

  gameLayout.appendChild(pixiRoot)
  gameLayout.appendChild(sidePanel)

  bottomHalf.appendChild(gameLayout)

  splitLayout.appendChild(topHalf)
  splitLayout.appendChild(bottomHalf)

  stageWrap.appendChild(splitLayout)

  appShell.appendChild(topBar)
  appShell.appendChild(stageWrap)

  root.appendChild(appShell)

  return { pixiRoot, topPixiRoot, spinBtn, payoutTotal, payoutLines }
}

function createPayoutLine(label: string, amount: number): HTMLDivElement {
  const line = document.createElement('div')
  line.className = 'payoutLine'

  const labelSpan = document.createElement('span')
  labelSpan.textContent = label

  const amountSpan = document.createElement('span')
  amountSpan.textContent = `+${amount}`

  line.appendChild(labelSpan)
  line.appendChild(amountSpan)

  return line
}

console.log('[main] Starting application initialization...')

const appEl = document.querySelector<HTMLDivElement>('#app')
if (!appEl) {
  const error = new Error('Missing #app element')
  console.error('[main] FATAL:', error)
  throw error
}

console.log('[main] #app element found, creating app structure...')
const { pixiRoot, topPixiRoot, spinBtn, payoutTotal, payoutLines } =
  createAppStructure(appEl)

// Verify root elements exist and have dimensions
console.log('[main] Verifying root elements...')
const pixiRootWidth = pixiRoot.offsetWidth
const pixiRootHeight = pixiRoot.offsetHeight
const topPixiRootWidth = topPixiRoot.offsetWidth
const topPixiRootHeight = topPixiRoot.offsetHeight

console.log('[main] pixiRoot:', {
  exists: !!pixiRoot,
  id: pixiRoot.id,
  width: pixiRootWidth,
  height: pixiRootHeight,
  computed: window.getComputedStyle(pixiRoot).display,
})

console.log('[main] topPixiRoot:', {
  exists: !!topPixiRoot,
  id: topPixiRoot.id,
  width: topPixiRootWidth,
  height: topPixiRootHeight,
  computed: window.getComputedStyle(topPixiRoot).display,
})

// Wait for layout calculation if dimensions are zero (with timeout)
const waitForDimensions = async (
  element: HTMLElement,
  elementName: string,
  timeoutMs = 5000,
): Promise<{ width: number; height: number }> => {
  if (element.offsetWidth > 0 && element.offsetHeight > 0) {
    return { width: element.offsetWidth, height: element.offsetHeight }
  }

  console.warn(`[main] ${elementName} has zero dimensions, waiting for layout...`)
  
  return new Promise<{ width: number; height: number }>((resolve) => {
    const startTime = Date.now()
    const checkDimensions = () => {
      const elapsed = Date.now() - startTime
      const width = element.offsetWidth
      const height = element.offsetHeight

      if (width > 0 && height > 0) {
        console.log(`[main] ${elementName} dimensions resolved:`, { width, height })
        resolve({ width, height })
      } else if (elapsed >= timeoutMs) {
        // Timeout reached - use fallback dimensions or window size
        const fallbackWidth = width || window.innerWidth
        const fallbackHeight = height || Math.floor(window.innerHeight * 0.4)
        console.warn(`[main] ${elementName} dimensions timeout, using fallback:`, {
          width: fallbackWidth,
          height: fallbackHeight,
        })
        resolve({ width: fallbackWidth, height: fallbackHeight })
      } else {
        requestAnimationFrame(checkDimensions)
      }
    }
    requestAnimationFrame(checkDimensions)
  })
}

// Wrap in async IIFE to avoid PixiJS v8 + Vite top-level await issue
// See: https://github.com/pixijs/pixijs/issues/10456
;(async () => {
  const pixiRootDims = await waitForDimensions(pixiRoot, 'pixiRoot')
  const topPixiRootDims = await waitForDimensions(topPixiRoot, 'topPixiRoot')

  console.log('[main] Final dimensions:', {
    pixiRoot: pixiRootDims,
    topPixiRoot: topPixiRootDims,
  })

  const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms))

  let topScene: Awaited<ReturnType<typeof mountTopScene>>
  let pixi: Awaited<ReturnType<typeof mountPixi>>

  // Initialize top scene with error handling
  console.log('[main] Initializing top scene...')
  try {
    topScene = await mountTopScene(topPixiRoot, {
      onEnemyAttack: () => {
        // Check if game is over
        if (pixi?.isGameOver()) return
        
        // Target the rightmost wheel (highest index)
        // Get the number of wheels from the mounted pixi instance
        const wheelCount = pixi?.getWheelCount?.() ?? 5
        if (wheelCount === 0) return // No wheels left, game over should already be triggered
        
        const rightmostIndex = wheelCount > 0 ? wheelCount - 1 : 0
        pixi?.removeIconFromWheel(rightmostIndex)
      },
    })
    console.log('[main] Top scene initialized successfully')
  } catch (error) {
    console.error('[main] Failed to initialize top scene:', error)
    const errorDiv = document.createElement('div')
    errorDiv.style.cssText = 'color: red; padding: 20px; background: rgba(255,0,0,0.1); margin: 20px;'
    errorDiv.textContent = `Failed to initialize top scene: ${error instanceof Error ? error.message : String(error)}`
    topPixiRoot.appendChild(errorDiv)
    throw error
  }

  // Initialize main PixiJS app with error handling
  console.log('[main] Initializing main PixiJS app...')
  try {
    pixi = await mountPixi(pixiRoot, {
      onSpinComplete: async (result) => {
        // Lock input during reveal + add sequence
        spinBtn.disabled = true
        pixi.setLocked(true)

        const payout = calcPayout(result)
        const payoutPanel: PayoutPanel = {
          total: payoutTotal,
          lines: payoutLines,
        }

        // Animate adding wheel values into payout panel
        payoutPanel.lines.replaceChildren()
        payoutPanel.total.textContent = '0'

        await revealBaseContributions(
          result,
          pixi,
          payoutPanel,
          createPayoutLine,
          sleep,
          ANIMATION_CONFIG,
        )

        await revealComboBonuses(result, pixi, payoutPanel, createPayoutLine, sleep, ANIMATION_CONFIG)

        payoutPanel.total.textContent = String(payout.total)
        await sleep(ANIMATION_CONFIG.finalPayoutDelayMs)
        pixi.hideWheelValues()

        // Trigger Hero attack animation and deal damage to nearest enemy
        const nearestEnemy = topScene.findNearestEnemy()
        if (nearestEnemy) {
          await topScene.triggerHeroAttack(nearestEnemy, payout.total)
        }

        pixi.setLocked(false)
        spinBtn.disabled = false
      },
    })
    console.log('[main] Main PixiJS app initialized successfully')
  } catch (error) {
    console.error('[main] Failed to initialize main PixiJS app:', error)
    const errorDiv = document.createElement('div')
    errorDiv.style.cssText = 'color: red; padding: 20px; background: rgba(255,0,0,0.1); margin: 20px;'
    errorDiv.textContent = `Failed to initialize game: ${error instanceof Error ? error.message : String(error)}`
    pixiRoot.appendChild(errorDiv)
    throw error
  }

  spinBtn.addEventListener('click', () => {
    pixi.spin()
  })

  console.log('[main] Application initialization complete!')
})().catch((error) => {
  console.error('[main] Fatal error during initialization:', error)
  const errorDiv = document.createElement('div')
  errorDiv.style.cssText = 'color: red; padding: 20px; background: rgba(255,0,0,0.2); margin: 20px; font-weight: bold;'
  errorDiv.textContent = `Fatal initialization error: ${error instanceof Error ? error.message : String(error)}`
  document.body.appendChild(errorDiv)
})

// Test death animation disabled - using real DOM-based death animations now
// void createDeathAnimationTest()
