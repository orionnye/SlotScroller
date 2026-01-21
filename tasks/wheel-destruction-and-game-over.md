# Wheel Destruction and Game Over Epic

**Status**: 📋 PLANNED  
**Goal**: Implement wheel destruction when all icons are removed, and game over when slot machine has no wheels remaining.

## Overview

WHY: Wheel destruction creates high stakes and strategic tension. If players don't protect their wheels, they can lose them permanently. Game over when all wheels are destroyed creates a clear failure state and makes every enemy attack meaningful.

---

## Detect wheel destruction condition

When all icons are removed from a wheel, mark that wheel as destroyed and remove it from the machine.

**Requirements**:
- Given all icons are removed from a wheel, should detect empty wheel state
- Given wheel is empty, should mark wheel as destroyed in game state
- Given wheel is destroyed, should remove wheel from active machine (not just hide it)
- Given wheel is removed, should update machine layout to fill gap left by destroyed wheel

---

## Visual feedback for wheel destruction

Show clear visual feedback when a wheel is destroyed and removed from the machine.

**Requirements**:
- Given wheel is destroyed, should show destruction animation (explosion, fade out, etc.)
- Given wheel is removed, should animate wheel removal from machine layout
- Given wheel is destroyed, should provide clear audio/visual feedback (screen shake, sound effect)
- Given wheel destruction occurs, should be clearly noticeable (not subtle)

---

## Implement game over condition

When slot machine has no wheels remaining, trigger game over state and end the game.

**Requirements**:
- Given all wheels are destroyed, should detect game over condition
- Given game over occurs, should stop all game loops (spins, enemy attacks, hero movement)
- Given game over occurs, should display game over screen/UI
- Given game over occurs, should allow player to restart or return to menu

---

## Game over UI

Create game over screen that displays when player loses all wheels.

**Requirements**:
- Given game over occurs, should display game over message/UI overlay
- Given game over screen is shown, should be clearly visible and readable
- Given game over screen exists, should provide restart option
- Given restart is selected, should reset game to initial state

---
