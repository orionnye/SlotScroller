# Redesign Character Visuals Epic

**Status**: ✅ COMPLETED  
**Goal**: Redesign hero, enemy, and attack visuals to create a more distinctive and cohesive visual style.

## Overview

To improve visual clarity and create a more memorable game aesthetic, we're redesigning the character sprites and attack animation. Enemies will be drawn as slime blobs (organic, fluid shapes), the hero will be a very short rectangular knight (compact, armored appearance), and the bow-and-arrow attack will be replaced with a gun animation. These changes will make characters more visually distinct and align the combat feel with a more modern weapon aesthetic.

---

## Redesign enemy sprites as slime blobs

Replace the current circular enemy sprites with organic, blob-like slime creatures that have a more fluid, gelatinous appearance.

**Status**: ✅ COMPLETED

**Requirements**:
- ✅ Given enemy texture is created, should draw as an organic blob shape using rounded rectangles and ellipses
- ✅ Given slime blob is rendered, should have a semi-transparent or translucent appearance with a distinct color (green, blue, or purple variants)
- ✅ Given slime blob has variations, should use seeded RNG to create slight size and shape variations per enemy
- ✅ Given slime blob is animated, should maintain the existing walking bob animation
- ✅ Given slime blob is created, should preserve existing enemy positioning and collision logic

---

## Redesign hero sprite as short rectangular knight

Replace the current circular hero sprite with a compact, rectangular knight character that appears armored and stout.

**Status**: ✅ COMPLETED

**Requirements**:
- ✅ Given hero texture is created, should draw as a short, rectangular body with clear armor/plate segments
- ✅ Given knight is rendered, should have a distinct silhouette (helmet, body armor, legs) using rectangular shapes
- ✅ Given knight is positioned, should maintain existing fixed position in back third of screen
- ✅ Given knight is animated, should preserve existing walking animation behavior
- ✅ Given knight sprite is created, should use appropriate colors for armor (metallic grays, blues, or silvers)

---

## Replace bow animation with gun animation

Replace the bow-and-arrow attack animation with a gun firing animation, including gun sprite creation and bullet/projectile animation.

**Status**: ✅ COMPLETED

**Requirements**:
- ✅ Given gun texture is created, should draw as a simple rectangular or pistol-shaped weapon
- ✅ Given gun animation triggers, should show gun sprite briefly at hero position before firing
- ✅ Given projectile is fired, should replace arrow sprite with bullet/projectile sprite (small circle or rectangle)
- ✅ Given bullet travels, should maintain existing travel animation from hero to enemy target
- ✅ Given bullet impacts, should preserve existing impact flash effect on enemy
- ✅ Given gun animation completes, should clean up gun and bullet sprites after animation
- ✅ Given gun is rendered, should position gun sprite appropriately relative to hero (slightly above or to the side)

---
