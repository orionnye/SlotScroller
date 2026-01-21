# Combat Visual Polish Epic

**Status**: 📋 PLANNED  
**Goal**: Add visual polish to combat system including damage numbers, attack effects, and game state indicators.

## Overview

WHY: Visual feedback makes combat feel satisfying and provides critical information. Players need to see damage numbers, understand attack effects, and know the state of their wheels. Polish transforms functional combat into engaging gameplay.

---

## Display damage numbers

Show damage numbers above enemies when they take damage from spins.

**Requirements**:
- Given enemy takes damage, should display damage number above enemy sprite
- Given damage number is shown, should animate upward and fade out
- Given damage number displays, should be large and readable
- Given combo bonuses apply, should show breakdown (base damage + bonus)

---

## Hero attack visual effects

Enhance Hero attack animations with particles and screen effects.

**Requirements**:
- Given Hero attacks, should show enhanced attack effect (particle burst, weapon trail, etc.)
- Given big damage is dealt, should add screen shake or camera effect
- Given attack effect plays, should be synchronized with spin completion
- Given attack effect exists, should not obscure enemy or damage numbers

---

## Wheel state indicators

Show visual indicators for wheel health (number of icons remaining, risk of destruction).

**Requirements**:
- Given wheel has few icons remaining, should show warning indicator (color change, border, etc.)
- Given wheel is at risk, should make risk level clearly visible
- Given wheel state changes, should update indicators immediately
- Given indicators exist, should not clutter wheel display

---

## Game over warning system

Show warnings when player is at risk of losing all wheels.

**Requirements**:
- Given player has few wheels remaining, should show warning indicator
- Given player is at high risk, should display clear warning message
- Given warning is shown, should be attention-grabbing but not panic-inducing
- Given risk level changes, should update warning appropriately

---

## Damage display in slot machine

Show total damage calculation clearly in the slot machine area when spin completes.

**Requirements**:
- Given spin completes, should display total damage in slot machine area (replace payout display)
- Given damage is shown, should break down base damage and combo bonuses
- Given damage displays, should be large and clear
- Given damage is applied, should visually connect damage number to enemy being hit

---
