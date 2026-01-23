# Implement DOM-Based Death Animation Epic

**Status**: ✅ COMPLETED  
**Goal**: Replace the overlay app death clone system with a DOM-based death animation that uses a small container sized to fit the enemy sprite (accounting for rotation), moves the container down, and spawns once per enemy death.

## Overview

Currently, death animations use a fullscreen overlay app with sprite clones. We need to replace this with a more lightweight DOM-based approach where each dying enemy gets its own small DOM container that:
- Is sized to just contain the enemy sprite (accounting for rotation)
- Has no border
- Moves down the screen via CSS positioning
- Rotates the sprite within
- Spawns once per enemy death (single fall animation)

---

## Create DOM-based death animation system

Create a new system for enemy death animations using small DOM containers instead of overlay app clones.

**Status**: ✅ COMPLETED

**Requirements**:
- Given enemy dies, should create a small DOM container element sized to fit the sprite
- Given container is created, should calculate size accounting for sprite rotation (bounding box of rotated sprite)
- Given container is created, should have no border
- Given container is created, should have transparent background
- Given container is created, should be positioned at enemy's global screen position
- Given container is created, should contain a PixiJS Application with the enemy sprite
- Given container is created, should initialize sprite at center of container
- Given container is created, should set z-index high enough to appear above game elements
- Given container is created, should be added to document.body
- Given animation runs, should move container down via CSS top positioning (not sprite.y)
- Given animation runs, should rotate sprite continuously (deathRotation += 2 * dt)
- Given animation runs, should apply gravity to velocity (300 * dt)
- Given animation runs, should update container position based on accumulated velocity
- Given animation completes, should remove container and cleanup PixiJS app when off-screen
- Given enemy dies, should spawn only one death animation instance (not infinite loop)
- Given death animation is created, should hide original enemy sprite

---

## Replace overlay app death clones with DOM containers

Update the death system to use DOM containers instead of overlay app clones.

**Status**: ✅ COMPLETED

**Requirements**:
- ✅ Given dealDamageToEnemy is called, should create DOM-based death animation instead of overlay clone
- ✅ Given animateDomDeaths is called, should animate DOM containers instead of overlay sprites
- ✅ Given death animation system is updated, should remove dependency on overlayApp for death animations
- ✅ Given death animation system is updated, should track DOM containers instead of DeathClone sprites
- ✅ Given mountTopScene is updated, should pass DOM container tracking array instead of deathClones array

---
