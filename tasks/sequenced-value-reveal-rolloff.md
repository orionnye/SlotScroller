# Sequenced Value Reveal + Roll-Off Epic

**Status**: 📋 PLANNED  
**Goal**: Reveal wheel values above the windows sequentially (one wheel at a time) and roll each value label off (hide) in order, while keeping payout addition sequencing consistent.

## Overview

WHY: Staggered reveals create suspense and improve readability by letting the player process each wheel’s contribution before totals and combo rewards are applied.

---

## Sequential value reveal timing

Change the post-spin reveal so each wheel’s value label appears with a short stagger rather than all at once.

**Requirements**:
- Given all wheels have stopped, should reveal wheel value labels one-by-one in a deterministic order (e.g., left-to-right).
- Given the reveal sequence is in progress, should keep Spin disabled/locked until the full reveal + payout sequence completes.
- Given a wheel’s value is revealed, should match the canonical icon value mapping.

---

## Roll-off animation per wheel label

Animate each revealed value label off the wheel (e.g., slide up + fade) before revealing the next wheel’s label.

**Requirements**:
- Given a wheel value label is visible, should animate it off smoothly (position/alpha) without affecting the wheel icons.
- Given the roll-off completes, should hide the label fully before the next wheel reveals.
- Given reduced motion is added later, should allow replacing the animation with an instant hide without breaking sequencing.

---

## Keep payout add sequencing aligned with reveals

Align payout panel updates with the per-wheel reveal order so the right panel “adds” in the same sequence as the on-wheel labels.

**Requirements**:
- Given wheel values are revealed sequentially, should add the corresponding value line to the payout panel in the same order.
- Given combo bonuses apply, should append combo lines only after all base wheel values have been added.
- Given the sequence completes, should display the final payout total consistent with payout computation.

---

