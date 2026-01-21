# Combat Foundation Epic

**Status**: 📋 PLANNED  
**Goal**: Establish core combat game state and damage system, repurposing payout calculations for damage.

## Overview

WHY: The current codebase calculates payouts, but we need a damage-focused combat system. This epic creates the foundation for combat by establishing enemy HP, damage calculation from spins, and game state management for combat encounters.

---

## Create combat state module

Establish game state types and reducers for combat encounters, enemy HP, and active combat status.

**Requirements**:
- Given a combat encounter starts, should track active enemies with HP values
- Given an enemy takes damage, should reduce enemy HP and track remaining health
- Given an enemy HP reaches 0, should mark enemy as defeated
- Given combat state is managed, should be separate from rendering and persistence

---

## Repurpose payout calculation to damage calculation

Convert existing payout logic to calculate damage from spin results, maintaining combo bonus logic but changing terminology.

**Requirements**:
- Given a spin completes, should calculate total damage from icon values and combo bonuses
- Given damage is calculated, should use existing calcPayout logic but return damage instead of payout
- Given combo bonuses apply, should maintain existing combo bonus rules (match bonuses, etc.)
- Given damage is displayed, should show damage numbers instead of payout amounts

---

## Connect spin to damage application

Link spin completion to applying damage to the closest enemy in combat state.

**Requirements**:
- Given a spin completes and combat is active, should apply calculated damage to closest enemy
- Given damage is applied, should update enemy HP in game state
- Given enemy HP reaches 0, should trigger enemy defeat logic
- Given no enemies are present, should not apply damage

---
