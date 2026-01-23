# Modify Death Animation Test View Epic

**Status**: ✅ COMPLETED  
**Goal**: Modify the death animation test view to move the DOM element position instead of sprite render position, ensure rotation is applied, and set background alpha to 0.

## Overview

The current test view animates the death by moving the sprite's y position within the PixiJS canvas. We need to change this to move the entire DOM container element down instead, while maintaining the rotation animation on the sprite. Additionally, the background should be fully transparent.

---

## Modify death animation to use DOM positioning

Update the test view animation to move the container element's absolute position instead of the sprite's render position, apply rotation to the sprite, and set background alpha to 0.

**Status**: ✅ COMPLETED

**Requirements**:
- ✅ Given death animation is active, should rotate the sprite continuously (deathRotation += 2 * dt)
- ✅ Given death animation is active, should move the testContainer DOM element's position down instead of sprite.y
- ✅ Given death animation is active, should use CSS top positioning to move container
- ✅ Given test view is initialized, should set PixiJS app backgroundAlpha to 0 (fully transparent)
- ✅ Given test view is initialized, should set testContainer backgroundColor to transparent
- ✅ Given death animation resets, should reset testContainer position to original location
- ✅ Given sprite is created, should keep sprite at fixed position within canvas (center, top area)
- ✅ Given animation loop runs, should apply gravity acceleration to velocity (300 * dt)
- ✅ Given animation loop runs, should update container position based on accumulated velocity

---
