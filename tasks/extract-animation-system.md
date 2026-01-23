# Extract Animation System Epic

**Status**: ✅ COMPLETED  
**Goal**: Extract animation logic from mountTopScene.ts into dedicated animation modules to reduce file size from 327 lines and improve separation of concerns.

## Overview

To complete the refactoring of mountTopScene.ts and achieve full separation of concerns, we're extracting the animation system (tick function) into dedicated animation modules. The tick function currently handles background scrolling, hero animation, enemy movement/attack, death animations, and respawn logic. This extraction will reduce the main file by ~115 lines and make animation logic independently testable and maintainable.

---

## Extract background animation

Move tuft and tree scrolling logic to dedicated background animation module.

**Status**: ✅ COMPLETED

**Requirements**:
- ✅ Given background animation is extracted, should create `web/src/pixi/topScene/animation/background.ts` module
- ✅ Given tuft scrolling is extracted, should accept tufts array, rng, state, app, and dt as parameters
- ✅ Given tree scrolling is extracted, should accept trees array, rng, state, app, and dt as parameters
- ✅ Given scrolling is extracted, should handle sprite repositioning when sprites go off-screen left
- ✅ Given scrolling is extracted, should preserve exact scroll speeds (tufts: 1, trees: 0.55) and respawn logic
- ✅ Given scrolling is extracted, should update mountTopScene.ts to import and call with dependencies

---

## Extract hero animation

Move hero walking animation logic to dedicated hero animation module.

**Status**: ✅ COMPLETED

**Requirements**:
- ✅ Given hero animation is extracted, should create `web/src/pixi/topScene/animation/hero.ts` module
- ✅ Given hero animation is extracted, should accept hero, state, app, and dt as parameters
- ✅ Given hero animation is extracted, should maintain fixed position at back third of screen (w * 0.33)
- ✅ Given hero animation is extracted, should preserve walking animation (vertical bob with sin wave, phase increment dt * 8)
- ✅ Given hero animation is extracted, should update mountTopScene.ts to import and call with dependencies

---

## Extract enemy animation and behavior

Move enemy movement, attack detection, and respawn logic to dedicated enemy animation module.

**Status**: ✅ COMPLETED

**Requirements**:
- ✅ Given enemy animation is extracted, should create `web/src/pixi/topScene/animation/enemy.ts` module
- ✅ Given enemy movement is extracted, should accept enemies array, hero, rng, state, app, dt, and onEnemyAttack callback as parameters
- ✅ Given enemy movement is extracted, should handle attack range detection and stop movement when in range
- ✅ Given enemy attack is extracted, should trigger onEnemyAttack callback when in range and off cooldown
- ✅ Given enemy attack animation is extracted, should preserve scale pulse (1.15x) and color flash (0xff6666) effects
- ✅ Given enemy respawn is extracted, should reposition enemies that go off-screen left with proper spacing
- ✅ Given enemy walking animation is extracted, should preserve vertical bob animation (sin wave, phase increment dt * 8)
- ✅ Given enemy animation is extracted, should update mountTopScene.ts to import and call with dependencies

---

## Extract death animation

Move enemy death fall animation logic to dedicated death animation module.

**Status**: ✅ COMPLETED

**Requirements**:
- ✅ Given death animation is extracted, should create `web/src/pixi/topScene/animation/death.ts` module
- ✅ Given death animation is extracted, should accept enemy, app, dt, and removeEnemy callback as parameters
- ✅ Given death animation is extracted, should apply gravity-like acceleration (300 * dt) to deathVelocityY
- ✅ Given death animation is extracted, should apply rotation increment (2 * dt) to deathRotation
- ✅ Given death animation is extracted, should remove enemy when sprite.y exceeds screenHeight + 100
- ✅ Given death animation is extracted, should update mountTopScene.ts to import and call with dependencies

---

## Create animation coordinator

Create main animation coordinator that orchestrates all animation modules and replaces tick function.

**Status**: ✅ COMPLETED

**Requirements**:
- ✅ Given animation coordinator is created, should create `web/src/pixi/topScene/animation/tickHandler.ts` module
- ✅ Given coordinator is created, should accept all animation functions, state, arrays, and dependencies as parameters
- ✅ Given coordinator is created, should check state.isPaused and return early if paused
- ✅ Given coordinator is created, should call background, hero, enemy, and death animation functions in sequence
- ✅ Given coordinator is created, should update mountTopScene.ts to import and use instead of inline tick function
- ✅ Given coordinator is created, should preserve exact animation order and timing

---
