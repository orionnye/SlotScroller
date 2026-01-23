# Implement CSS/SVG Death Animation Epic

**Status**: 📋 PLANNED  
**Goal**: Replace the overlay app death animation system with a simple CSS/SVG-based approach that uses DOM elements with CSS animations for falling and rotation effects.

## Overview

The overlay app approach has proven problematic with coordinate systems. We'll replace it with a simpler CSS/SVG-based solution that:
- Uses DOM elements (SVG or div with background image) positioned at enemy viewport coordinates
- Animates with CSS transforms (translateY for fall, rotate for spin)
- Avoids PixiJS coordinate conversion issues
- Removes the need for the fullscreen overlay app

---

## Remove overlay app system

Remove the fullscreen overlay app and all related code.

**Status**: ✅ COMPLETED

**Detailed Requirements**:

### Remove overlay app from mountTopScene
- ✅ Given `mountTopScene.ts` creates overlay DOM element, should remove lines 47-56 (overlayEl creation and appendChild)
- ✅ Given `mountTopScene.ts` initializes overlayApp, should remove lines 58-65 (overlayApp creation and initialization)
- ✅ Given `mountTopScene.ts` tracks deathClones array, should remove line 108 (`const deathClones: DeathClone[] = []`)
- ✅ Given `mountTopScene.ts` passes overlayApp to createTickHandler, should remove `overlayApp` and `deathClones` parameters from line 200-201
- ✅ Given `mountTopScene.ts` resizes overlayApp in onResize, should remove line 212 (`overlayApp.renderer.resize(...)`)
- ✅ Given `mountTopScene.ts` destroys overlayApp in destroy, should remove lines 248-250 (overlayApp.destroy and overlayEl removal)
- ✅ Given `mountTopScene.ts` imports DeathClone, should remove import on line 14
- ✅ Given `mountTopScene.ts` passes overlayApp to dealDamageToEnemy, should remove `overlayApp` and `deathClones` parameters from line 240
- ✅ Given `mountTopScene.ts` passes overlayApp to triggerHeroAttack, should remove `overlayApp` and `deathClones` parameters from line 242

### Remove overlay app from tickHandler
- ✅ Given `tickHandler.ts` imports animateDeathClones, should remove import on line 4
- ✅ Given `tickHandler.ts` imports DeathClone type, should remove import on line 8
- ✅ Given `tickHandler.ts` accepts overlayApp parameter, should remove `overlayApp: Application` parameter from line 34
- ✅ Given `tickHandler.ts` accepts deathClones parameter, should remove `deathClones: DeathClone[]` parameter from line 35
- ✅ Given `tickHandler.ts` calls animateDeathClones, should remove line 51 (`animateDeathClones(deathClones, overlayApp, dt)`)

### Remove overlay app from enemyCombat
- ✅ Given `enemyCombat.ts` imports createDeathClone, should remove import on line 3
- ✅ Given `enemyCombat.ts` imports DeathClone type, should remove import on line 3
- ✅ Given `enemyCombat.ts` accepts overlayApp parameter, should remove `overlayApp: Application` parameter from line 57
- ✅ Given `enemyCombat.ts` accepts deathClones parameter, should remove `deathClones: DeathClone[]` parameter from line 58
- ✅ Given `enemyCombat.ts` returns DeathClone, should change return type from `DeathClone | null` to `void` (temporarily, will be replaced with CSS animation)
- ✅ Given `enemyCombat.ts` creates death clone, should remove lines 68-87 (death clone creation logic)
- ✅ Given `enemyCombat.ts` hides enemy sprite, should keep line 72 (`actualEnemy.sprite.visible = false`)
- ✅ Given `enemyCombat.ts` marks enemy as dying, should keep line 85 (`actualEnemy.isDying = true`)

### Remove overlay app from heroAttack
- ✅ Given `heroAttack.ts` imports DeathClone type, should remove import on line 7
- ✅ Given `heroAttack.ts` accepts overlayApp parameter, should remove `overlayApp: Application` parameter from line 83
- ✅ Given `heroAttack.ts` accepts deathClones parameter, should remove `deathClones: DeathClone[]` parameter from line 84
- ✅ Given `heroAttack.ts` passes overlayApp to dealDamageToEnemy, should remove `overlayApp` and `deathClones` parameters from lines 135-136

### Clean up unused files (optional, can be done later)
- Given `deathClone.ts` exists, should consider removing file (or keep for reference)
- Given `deathCloneAnimation.ts` exists, should consider removing file (or keep for reference)

---

## Create CSS/SVG death animation system

Create a new system that uses DOM elements with CSS animations for death effects.

**Status**: ✅ COMPLETED

**Detailed Requirements**:

### Create death animation type and factory function
- Given death animation type is needed, should create `CssDeathAnimation` type in new file `animation/cssDeathAnimation.ts`
- Given death animation type exists, should include: `element: HTMLDivElement`, `velocityY: number`, `rotation: number`, `initialTop: number`, `initialLeft: number`
- Given factory function is needed, should create `createCssDeathAnimation` function
- Given factory function is called, should accept `enemySprite: Sprite` and `sourceCanvas: HTMLCanvasElement` parameters
- Given factory function is called, should get enemy sprite's global position using `getGlobalPosition()`
- Given factory function is called, should convert canvas coordinates to viewport coordinates using `sourceCanvas.getBoundingClientRect()`
- Given factory function is called, should calculate viewport position: `canvasRect.left + globalPos.x`, `canvasRect.top + globalPos.y`
- Given factory function is called, should get sprite texture and convert to data URL using `app.renderer.extract.base64()` or `texture.baseTexture.resource.source` (canvas element)
- Given factory function is called, should create `HTMLDivElement` or `HTMLImageElement` for death animation
- Given DOM element is created, should set `position: fixed`
- Given DOM element is created, should set `top` and `left` to viewport coordinates
- Given DOM element is created, should set `width` and `height` to sprite dimensions (from texture or sprite bounds)
- Given DOM element is created, should set `backgroundImage` to data URL or use `img.src` if using img element
- Given DOM element is created, should set `backgroundSize: 'contain'` or `object-fit: contain` for img
- Given DOM element is created, should set `zIndex: '10000'`
- Given DOM element is created, should set `pointerEvents: 'none'`
- Given DOM element is created, should set `transformOrigin: 'center center'` for proper rotation
- Given DOM element is created, should append to `document.body`
- Given factory function returns, should return `CssDeathAnimation` object with element and animation state

### Create animation update function
- Given animation function is needed, should create `animateCssDeath` function in `animation/cssDeathAnimation.ts`
- Given animation function is called, should accept `deathAnim: CssDeathAnimation` and `dt: number` parameters
- Given animation function is called, should apply gravity: `deathAnim.velocityY += 300 * dt`
- Given animation function is called, should update rotation: `deathAnim.rotation += 2 * dt`
- Given animation function is called, should calculate current translateY: `currentTop = parseFloat(deathAnim.element.style.top) || deathAnim.initialTop`
- Given animation function is called, should calculate new translateY: `newTop = currentTop + deathAnim.velocityY * dt`
- Given animation function is called, should update element style: `deathAnim.element.style.top = \`${newTop}px\``
- Given animation function is called, should update transform: `deathAnim.element.style.transform = \`translateY(${newTop - deathAnim.initialTop}px) rotate(${deathAnim.rotation}rad)\``
- Given animation function is called, should check if off-screen: `newTop > window.innerHeight + 100`
- Given animation function is called, should return `true` if animation is complete (off-screen), `false` otherwise

### Create animation batch update function
- Given batch animation function is needed, should create `animateCssDeaths` function in `animation/cssDeathAnimationAnimation.ts`
- Given batch function is called, should accept `deathAnimations: CssDeathAnimation[]` and `dt: number` parameters
- Given batch function is called, should iterate over copy of array to avoid modification during iteration
- Given batch function is called, should call `animateCssDeath` for each animation
- Given batch function is called, should remove completed animations from array (when `animateCssDeath` returns `true`)
- Given batch function is called, should remove DOM element from document.body when animation completes
- Given batch function is called, should handle cleanup gracefully (check if element exists before removing)

---

## Update function signatures

Update all function signatures to use CSS/SVG death animations instead of overlay app.

**Status**: ✅ COMPLETED

**Detailed Requirements**:

### Add death animations array to mountTopScene
- Given `mountTopScene.ts` initializes scene, should create `const deathAnimations: CssDeathAnimation[] = []` after line 86 (after enemies array)
- Given `mountTopScene.ts` imports types, should add import: `import type { CssDeathAnimation } from './animation/cssDeathAnimation'` at top of file

### Update dealDamageToEnemy function
- Given `enemyCombat.ts` has `dealDamageToEnemy` function, should add parameter: `deathAnimations: CssDeathAnimation[]` after `frontLayer` parameter
- Given `enemyCombat.ts` has `dealDamageToEnemy` function, should add parameter: `app: Application` after `deathAnimations` parameter
- Given `enemyCombat.ts` imports types, should add import: `import { Application } from 'pixi.js'` (if not already present)
- Given `enemyCombat.ts` imports CSS death animation, should add import: `import { createCssDeathAnimation } from '../animation/cssDeathAnimation'`
- Given enemy HP reaches 0, should call `createCssDeathAnimation(actualEnemy.sprite, app.canvas, app)` and await result
- Given CSS death animation is created, should push result to `deathAnimations` array
- Given CSS death animation is created, should handle async creation (use `.then()` or make function async)
- Given `dealDamageToEnemy` completes, should return `true` if enemy was killed (hp <= 0), `false` otherwise

### Update createTickHandler function
- Given `tickHandler.ts` has `createTickHandler` function, should add parameter: `deathAnimations: CssDeathAnimation[]` after `onEnemyAttack` parameter
- Given `tickHandler.ts` imports CSS death animation, should add import: `import { animateCssDeaths } from './cssDeathAnimationAnimation'`
- Given `tickHandler.ts` tick function runs, should call `animateCssDeaths(deathAnimations, dt)` after line 49 (after animateEnemies call)
- Given `tickHandler.ts` tick function runs, should call `animateCssDeaths` even when `state.isPaused` is true (death animations should continue during gun fire)

### Update triggerHeroAttack function
- Given `heroAttack.ts` has `triggerHeroAttack` function, should add parameter: `deathAnimations: CssDeathAnimation[]` after `state` parameter
- Given `heroAttack.ts` calls `dealDamageToEnemy`, should pass `deathAnimations` and `app` parameters to `dealDamageToEnemy` call (lines 126-132)

### Update mountTopScene function
- Given `mountTopScene.ts` calls `createTickHandler`, should pass `deathAnimations` array as parameter (line 168-179)
- Given `mountTopScene.ts` calls `dealDamageToEnemy` in return object, should pass `deathAnimations` and `app` to `dealDamageToEnemy` call (line 213-214)
- Given `mountTopScene.ts` calls `triggerHeroAttack` in return object, should pass `deathAnimations` to `triggerHeroAttack` call (line 218-219)
- Given `mountTopScene.ts` destroy function exists, should clean up all death animations: iterate over `deathAnimations` and remove DOM elements from `document.body` before `app.destroy(true)` (line 220-224)
- Given `mountTopScene.ts` dealDamageToEnemy wrapper returns, should return result from `dealDamageToEnemy` call (update line 216 to return actual result)

---

## Implement CSS animation logic

Create functions to animate CSS/SVG death elements using JavaScript to update CSS transforms.

**Requirements**:
- Given death animation exists, should update `transform: translateY()` based on accumulated velocity
- Given death animation exists, should update `transform: rotate()` based on rotation speed
- Given death animation exists, should combine transforms: `translateY(${y}px) rotate(${rotation}rad)`
- Given death animation exists, should apply gravity acceleration to velocity (300 * dt)
- Given death animation exists, should increment rotation speed (2 * dt)
- Given death animation exists, should remove element when `translateY` exceeds screen height + 100px
- Given animation loop runs, should update all active death animations each frame
- Given animation completes, should remove DOM element and clean up from tracking array

---
