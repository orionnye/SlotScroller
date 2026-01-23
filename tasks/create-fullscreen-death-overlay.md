# Create Fullscreen Death Overlay Epic

**Status**: ✅ COMPLETED  
**Goal**: Create a separate top-level DOM element with its own PixiJS application to render death animations over the entire screen, including the bottom slot machine.

## Overview

The death animation clones are currently in the top scene's PixiJS application, which cannot render over the bottom slot machine (separate PixiJS app). To achieve the desired effect of enemies falling over the entire screen, we need to create a separate DOM element positioned absolutely over everything, with its own PixiJS application dedicated to rendering death animations. This overlay will be at the highest z-index and render on top of both the top scene and bottom slot machine.

---

## Create fullscreen overlay DOM element

Create a separate DOM element that covers the entire viewport and is positioned above all other elements.

**Requirements**:
- ✅ Given overlay element is created, should create a div element with absolute positioning
- ✅ Given overlay element is created, should cover entire viewport (width: 100%, height: 100%, position: fixed)
- ✅ Given overlay element is created, should have highest z-index (9999) to render above all other elements
- ✅ Given overlay element is created, should have pointer-events: none to allow interaction with elements below
- ✅ Given overlay element is created, should be added to document.body
- ✅ Given overlay element is created, should be created within mountTopScene

---

## Create separate PixiJS app for death overlay

Create a dedicated PixiJS application in the overlay element for rendering death animations.

**Status**: ✅ COMPLETED

**Requirements**:
- ✅ Given overlay app is created, should initialize PixiJS Application in overlay DOM element
- ✅ Given overlay app is created, should resize to match overlay element dimensions (resizeTo: overlayEl)
- ✅ Given overlay app is created, should have transparent background (backgroundAlpha: 0)
- ✅ Given overlay app is created, should be stored and passed to death animation functions
- ✅ Given overlay app is created, should handle window resize events to maintain fullscreen coverage

---

## Migrate death clones to overlay app

Move death clone rendering from top scene app to overlay app.

**Status**: ✅ COMPLETED

**Requirements**:
- Given death clones are migrated, should add clones to overlay app.stage instead of fullscreenContainer
- Given death clones are migrated, should remove fullscreenContainer from top scene app
- Given death clones are migrated, should update createDeathClone to use overlay app for coordinate conversion
- Given death clones are migrated, should update animateDeathClones to use overlay app
- Given death clones are migrated, should ensure clones render at correct global screen positions

---

## Clean up and integrate overlay lifecycle

Manage overlay app lifecycle and cleanup.

**Status**: ✅ COMPLETED

**Requirements**:
- ✅ Given overlay is integrated, should create overlay app in mountTopScene
- ✅ Given overlay is integrated, should pass overlay app to dealDamageToEnemy and animation functions
- ✅ Given overlay is integrated, should destroy overlay app in mountTopScene destroy function
- ✅ Given overlay is integrated, should remove overlay DOM element on cleanup
- ✅ Given overlay is integrated, should handle overlay app resize on window resize events

---

## Reduce enemy health to 30

Update default enemy HP configuration to 30.

**Status**: ✅ COMPLETED

**Requirements**:
- ✅ Given enemy health is reduced, should update COMBAT_CONFIG.defaultEnemyHP to 30
- ✅ Given enemy health is reduced, should verify all enemies spawn with 30 HP
- ✅ Given enemy health is reduced, should ensure existing enemies are not affected (only new spawns)

---
