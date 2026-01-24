# Extend Bullet to Screen Edge Epic

**Status**: 📋 PLANNED  
**Goal**: Make the gun bullet extend all the way to the right edge of the side scroller screen instead of stopping at the enemy position.

## Overview

WHY: Currently, the bullet animation stops at the enemy's position, making it look like the bullet doesn't travel the full distance. Extending the bullet to the screen edge will make the attack animation feel more complete and visually satisfying, showing the bullet traveling the full width of the screen.

---

## Update bullet animation end position

Change the bullet animation to travel to the right edge of the screen instead of stopping at the enemy.

**Requirements**:
- Given bullet is fired, should calculate the right edge of the screen (viewport width)
- Given bullet animation starts, should use screen edge as endX instead of enemy position
- Given bullet reaches screen edge, should then trigger impact effect on enemy
- Given fix is applied, should maintain bullet rotation toward the target direction
- Given fix is applied, should ensure bullet travels full screen width

---

## Calculate screen edge position

Determine the correct right edge position for the bullet animation.

**Requirements**:
- Given app renderer exists, should use `app.renderer.width` for screen width
- Given screen width is available, should use it as the endX position
- Given enemy might be closer than screen edge, should still travel to screen edge
- Given fix is applied, should work correctly regardless of enemy position

---

## Update impact timing

Adjust when the impact effect and damage are applied relative to bullet reaching screen edge.

**Requirements**:
- Given bullet reaches screen edge, should trigger impact effect on enemy
- Given impact occurs, should apply damage to enemy
- Given timing is correct, should feel natural (bullet hits enemy as it passes through)
- Given fix is applied, should maintain current damage and visual feedback timing

---

## Verify bullet visual appearance

Ensure the bullet is visible throughout its full travel to the screen edge.

**Requirements**:
- Given bullet travels full distance, should remain visible throughout animation
- Given bullet reaches screen edge, should be visible until impact
- Given fix is applied, should not disappear prematurely
- Given fix is applied, should maintain current bullet appearance and rotation

---

## Success Criteria

- ✅ Bullet travels from hero position to right edge of screen
- ✅ Bullet remains visible throughout full travel distance
- ✅ Impact effect and damage still trigger correctly
- ✅ Bullet rotation points toward target direction
- ✅ Animation feels complete and satisfying
- ✅ Works correctly regardless of enemy position

---

## Related Files

- `web/src/pixi/topScene/combat/heroAttack.ts` - Bullet animation logic
- `web/src/pixi/topScene/mountTopScene.ts` - Scene setup, has access to app renderer
