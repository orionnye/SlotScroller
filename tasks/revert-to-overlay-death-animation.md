# Revert to Overlay Death Animation System Epic

**Status**: ✅ COMPLETED  
**Goal**: Remove all DOM-based death animation code and restore the original overlay app-based death animation system that was working.

## Overview

The DOM-based death animation approach has proven too complex and problematic. We need to revert to the simpler overlay app system that was previously implemented and working.

---

## Remove DOM-based death animation system

Delete all files and code related to the DOM-based death animation approach.

**Status**: ✅ COMPLETED

**Requirements**:
- ✅ Given DOM death animation files exist, should delete `domDeathAnimation.ts`
- ✅ Given DOM death animation animation file exists, should delete `domDeathAnimationAnimation.ts`
- ✅ Given DOM death animation is imported, should remove all imports of `DomDeathAnimation` type
- ✅ Given DOM death animation is used, should remove all references to `deathAnimations` array
- ✅ Given DOM death animation functions are called, should remove calls to `createDomDeathAnimation` and `animateDomDeaths`
- ✅ Given DOM death animation cleanup exists, should remove DOM container cleanup code from `mountTopScene.destroy()`

---

## Restore overlay app death animation system

Re-enable the original overlay app-based death animation system.

**Status**: ✅ COMPLETED

**Requirements**:
- ✅ Given overlay app was removed, should recreate fullscreen overlay DOM element in `mountTopScene`
- ✅ Given overlay app was removed, should recreate separate PixiJS Application for death overlay
- ✅ Given death clone system exists, should use `createDeathClone` from `deathClone.ts`
- ✅ Given death clone animation exists, should use `animateDeathClones` from `deathCloneAnimation.ts`
- ✅ Given `dealDamageToEnemy` is called, should create death clones using overlay app instead of DOM containers
- ✅ Given `createTickHandler` is called, should pass `overlayApp` and `deathClones` array instead of `deathAnimations`
- ✅ Given `triggerHeroAttack` is called, should pass `overlayApp` and `deathClones` instead of `deathAnimations`
- ✅ Given `mountTopScene` cleanup runs, should clean up overlay app and overlay DOM element
- ✅ Given window resize occurs, should resize overlay app to match viewport

---

## Update function signatures

Update all function signatures to use the overlay app system instead of DOM containers.

**Status**: ✅ COMPLETED

**Requirements**:
- ✅ Given `dealDamageToEnemy` function exists, should accept `overlayApp: Application` and `deathClones: DeathClone[]` parameters
- ✅ Given `triggerHeroAttack` function exists, should accept `overlayApp: Application` and `deathClones: DeathClone[]` parameters
- ✅ Given `createTickHandler` function exists, should accept `overlayApp: Application` and `deathClones: DeathClone[]` parameters
- ✅ Given `mountTopScene` return object exists, should pass `overlayApp` and `deathClones` to all functions
- ✅ Given function signatures are updated, should remove `sourceApp` or `sourceCanvas` parameters that were added for DOM system

---
