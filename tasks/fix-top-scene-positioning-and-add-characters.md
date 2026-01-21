# Fix Top Scene Positioning and Add Characters Epic

**Status**: ✅ COMPLETED  
**Goal**: Fix tree and grass positioning to sit on the green ground bar, and add Hero and enemy sprites with walking animations.

## Overview

WHY: The current top scene has trees and grass floating above the ground, which looks unnatural. Additionally, we need Hero and enemy characters to establish the combat gameplay. Proper positioning creates visual coherence, and character sprites are essential for the combat system.

---

## Fix tree and grass ground alignment

Position trees and grass tufts so they sit directly on top of the green ground bar instead of hovering above it.

**Requirements**:
- Given trees are rendered, should be positioned with their base at the top edge of the green ground bar
- Given grass tufts are rendered, should be positioned with their base at the top edge of the green ground bar
- Given items are positioned, should not hover or float above the ground
- Given ground position changes (viewport resize), should maintain proper alignment

---

## Create Hero sprite with walking animation

Add a Hero character sprite that walks continuously toward the right side of the screen.

**Requirements**:
- Given top scene is rendered, should display a Hero sprite character
- Given Hero exists, should be a simple placeholder sprite (can be upgraded later)
- Given Hero moves, should walk continuously toward the right side of the screen
- Given Hero walks, should use simple walking animation (sprite animation or movement pattern)
- Given Hero position updates, should move at a constant speed across the screen

---

## Create enemy sprites with walking animation

Add enemy sprites that walk toward the left (toward the Hero) on the top screen.

**Requirements**:
- Given top scene is rendered, should display enemy sprites
- Given enemies exist, should be simple placeholder sprites (can be upgraded later)
- Given enemies move, should walk continuously toward the left side of the screen (toward Hero)
- Given enemies walk, should use simple walking animation (sprite animation or movement pattern)
- Given enemy position updates, should move at a constant speed across the screen
- Given multiple enemies exist, should be positioned at different initial locations

---

## Position characters on ground

Ensure Hero and enemies are positioned on top of the green ground bar, aligned with trees and grass.

**Requirements**:
- Given Hero is rendered, should be positioned with feet/base at the top edge of the green ground bar
- Given enemies are rendered, should be positioned with feet/base at the top edge of the green ground bar
- Given characters are positioned, should align with tree and grass positioning (same ground level)
- Given ground position changes, should maintain character alignment with ground

---
