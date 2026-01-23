# Clone Dying Enemies for Fullscreen Fall Epic

**Status**: ✅ COMPLETED  
**Goal**: Create cloned sprites for dying enemies that can fall past the entire screen, including the bottom half, since the top scene canvas is clipped to the upper half.

## Overview

The top scene canvas is clipped to the upper half of the screen, causing dying enemies to disappear when they fall below the canvas bounds. To fix this, we need to create a separate cloned sprite when an enemy dies that can fall past the entire viewport. This clone will be positioned in a way that allows it to animate across the full screen height, including over the bottom half where the slot machine is located.

---

## Add fullscreen container to mountTopScene

Create a container that renders over the entire screen for death clone sprites.

**Status**: ✅ COMPLETED

**Requirements**:
- ✅ Given fullscreen container is created, should add container to app.stage (not world container) to render over everything
- ✅ Given fullscreen container is created, should position container to cover entire viewport (0, 0, width, height)
- ✅ Given fullscreen container is created, should ensure container renders above both top scene world container and bottom slot machine
- ✅ Given fullscreen container is created, should pass container reference to death animation and combat functions

---

## Create death clone sprite system

Create a system to manage death clone sprites that can animate across the full screen height.

**Status**: ✅ COMPLETED

**Requirements**:
- ✅ Given death clone system is created, should create `web/src/pixi/topScene/animation/deathClone.ts` module
- ✅ Given clone type is defined, should create DeathClone type with sprite, deathVelocityY, and deathRotation properties
- ✅ Given clone creation function is created, should accept enemy sprite and return a new sprite with cloned visual properties
- ✅ Given clone is created, should copy texture, position, scale, tint, rotation, and anchor from original enemy sprite
- ✅ Given clone tracking is implemented, should maintain array of active death clones separate from enemies array

---

## Integrate clone creation into death flow

Modify dealDamageToEnemy to create clone sprite when enemy HP reaches zero.

**Status**: ✅ COMPLETED

**Requirements**:
- ✅ Given enemy HP reaches zero, should create death clone sprite using clone creation function
- ✅ Given clone is created, should hide original enemy sprite (set visible to false) instead of moving to frontLayer
- ✅ Given clone is created, should add clone to fullscreen container for death animation
- ✅ Given clone is created, should initialize clone with death animation properties (deathVelocityY: 0, deathRotation: current rotation)
- ✅ Given clone is created, should preserve exact visual appearance of enemy at moment of death
- ✅ Given clone is created, should add clone to death clones array for tracking
- ✅ Given clone is created, should return clone object from dealDamageToEnemy or store in accessible array

---

## Update death animation to use clones

Modify death animation to animate clone sprites instead of original enemy sprites.

**Requirements**:
- ✅ Given death animation is updated, should create `animateDeathClones` function that accepts death clones array
- ✅ Given death animation is updated, should apply gravity-like acceleration (300 * dt) to clone's deathVelocityY
- ✅ Given death animation is updated, should apply rotation increment (2 * dt) to clone's deathRotation
- ✅ Given death animation is updated, should update clone sprite position and rotation each frame
- ✅ Given clone falls off screen, should remove clone from array and destroy sprite resources
- ✅ Given clone is removed, should use full screen height (app.renderer.height) for removal threshold
- ✅ Given death animation is updated, should integrate into tickHandler to animate clones each frame

---
