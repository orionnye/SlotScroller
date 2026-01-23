# Implement Wheel Destruction Epic

**Status**: ✅ COMPLETED  
**Goal**: Remove wheels from the slot machine when all icons are removed, and handle game over when no wheels remain.

## Overview

WHY: According to the vision, when all icons are removed from a wheel, that wheel should be dropped from the slot machine. If all wheels are destroyed, the game ends. Currently, wheels remain in the machine even when they have no icons, breaking the core gameplay mechanic and preventing game over conditions.

---

## Detect and handle wheel with no icons

When an icon removal would leave a wheel with zero icons, mark the wheel for destruction instead of attempting removal.

**Requirements**:
- Given a wheel has one icon remaining, should allow icon removal attempt
- Given icon removal occurs and wheel would have zero icons, should mark wheel for destruction
- Given wheel has zero icons, should detect empty wheel state
- Given empty wheel is detected, should prevent further icon removal attempts on that wheel

---

## Remove destroyed wheel from machine

When a wheel is destroyed (has no icons), remove it from the active wheels array and update the machine layout.

**Requirements**:
- Given wheel is destroyed, should remove wheel from wheels array in mountPixi
- Given wheel is removed, should remove wheel view from machine container
- Given wheel is removed, should trigger layout recalculation to fill gap
- Given wheel is removed, should handle drag-and-drop state if destroyed wheel was being dragged

---

## Update wheel removal logic

Modify removeIconFromWheel to detect when a wheel would be empty and trigger destruction instead of throwing an error.

**Requirements**:
- Given icon removal would leave zero icons, should trigger wheel destruction instead of error
- Given wheel destruction occurs, should return success indication
- Given wheel destruction occurs, should clean up wheel resources properly
- Given wheel destruction occurs, should maintain valid machine state

---

## Implement game over condition

When all wheels are destroyed (wheels array is empty), trigger game over state and end the game.

**Requirements**:
- Given all wheels are destroyed, should detect game over condition
- Given game over occurs, should stop all game loops (spins, enemy attacks, hero movement)
- Given game over occurs, should display game over UI/message
- Given game over occurs, should allow player to restart or return to menu (future)

---
