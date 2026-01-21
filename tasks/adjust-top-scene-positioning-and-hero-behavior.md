# Adjust Top Scene Positioning and Hero Behavior Epic

**Status**: ✅ COMPLETED  
**Goal**: Position trees and grass slightly beneath the ground for a more grounded look, and fix Hero position in the back third of the screen with walking animation.

## Overview

WHY: Trees and grass sitting exactly on the ground line can look unnatural. Positioning them slightly beneath creates a more grounded, natural appearance. Additionally, the Hero should remain in a fixed position (back third of screen) rather than looping, creating a stable reference point while the world scrolls past.

---

## Position trees and grass beneath ground

Adjust tree and grass positioning so they appear slightly buried in the ground for a more natural look.

**Requirements**:
- Given trees are rendered, should be positioned slightly below the ground line (e.g., 2-4 pixels below groundY)
- Given grass tufts are rendered, should be positioned slightly below the ground line
- Given items are positioned, should appear partially buried in the ground for natural appearance
- Given ground position changes, should maintain proper relative positioning

---

## Fix Hero position in back third of screen

Position Hero in the back third of the screen and keep them fixed there (not looping around).

**Requirements**:
- Given Hero is rendered, should be positioned in the back third of the screen (approximately 33% from left edge)
- Given Hero position is set, should remain fixed at that position (not move horizontally)
- Given Hero is fixed, should maintain walking animation while stationary
- Given world scrolls, should Hero remain in fixed screen position while background moves

---
