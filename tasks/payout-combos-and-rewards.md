# Payout Combos + Rewards Epic

**Status**: 📋 PLANNED  
**Goal**: Add reward rules for wheel result pairings/combos and compute a clear payout breakdown per spin.

## Overview

WHY: Combo rewards create excitement and strategy by turning raw symbol outcomes into meaningful payouts the player can understand and optimize.

---

## Define spin result shape

Represent a completed multi-wheel spin outcome in pure game logic so payout rules can be computed without Pixi dependencies.

**Requirements**:
- Given five wheels finish spinning, should represent the outcome as an ordered list of landed `IconId`s.
- Given a spin result is recorded, should be stable and serializable for later save/replay.

---

## Compute payout + breakdown (base + combos)

Create pure payout logic that returns both the final payout and an itemized breakdown of which combo rules applied.

**Requirements**:
- Given a spin result, should compute a base payout deterministically from the landed icons.
- Given a spin result contains a qualifying pairing/combo, should apply the corresponding reward rule deterministically.
- Given multiple reward rules apply, should return a breakdown showing each applied rule and its contribution to the final payout.
- Given no reward rules apply, should return a breakdown indicating base payout only.

---

## Display payout outcome

Show the player the final payout and the breakdown after each spin completes.

**Requirements**:
- Given a spin completes, should display the final payout value.
- Given a payout includes combo rewards, should display the list of applied combo rewards in a readable format.

---

