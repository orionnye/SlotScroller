# Bring Dying Enemies to Front Epic

**Status**: ✅ COMPLETED  
**Goal**: Ensure dying enemies fall in front of all other scene elements by moving them to the highest z-index layer.

## Overview

To create a more dramatic and visible death effect, dying enemies should fall in front of all other scene elements (background, trees, grass, hero, and other enemies) and continue falling all the way down past the entire screen, including over the bottom half where the slot machine is located. This ensures the death animation is clearly visible across the entire viewport and creates a satisfying visual effect where defeated enemies tumble forward as they fall.

---

## Move dying enemies to front layer

When an enemy starts dying, move its sprite to a dedicated front layer that renders above all other scene elements, allowing it to fall all the way down past the entire screen.

**Status**: ✅ COMPLETED

**Requirements**:
- ✅ Given enemy HP reaches zero, should move enemy sprite to a front layer before starting death animation
- ✅ Given enemy sprite is moved, should use a dedicated front layer container that renders above all other layers
- ✅ Given enemy is in front layer, should fall in front of background, trees, grass, hero, and other enemies
- ✅ Given enemy is falling, should continue falling past the entire screen height, including over the bottom half of the screen
- ✅ Given enemy falls off screen bottom, should remove sprite from front layer and clean up resources
- ✅ Given multiple enemies die, should move each to front layer independently
- ✅ Given enemy is moved to front layer, should preserve sprite position and visual state exactly

---
