# Combo Bonus Reveal After Base Epic

**Status**: 📋 PLANNED  
**Goal**: After individual wheel values roll off, reveal combo bonus values above the relevant matching icons, synchronized with the timing of combo lines being displayed in the payout panel.

## Overview

WHY: Showing combo bonuses directly over the icons that caused them makes payouts legible and satisfying, and reinforces learning (“this match created that bonus”).

---

## Identify combo participants

Extend payout computation (or add a helper) to identify which wheel indices participate in each combo so the renderer can place combo bonus labels above the correct icons.

**Requirements**:
- Given a spin result and combo payout line, should identify the wheel indices that contributed to that combo deterministically.
- Given multiple combos exist, should produce a deterministic ordering for combo reveals that matches payout panel ordering.

---

## Reveal combo bonus labels above relevant icons

After all base value labels have rolled off, display combo bonus labels above the participating wheels, then roll them off.

**Requirements**:
- Given a combo applies, should display the combo bonus value above each participating wheel’s window after base reveals complete.
- Given combo reveals are shown, should roll them off before proceeding to the next combo reveal.
- Given a wheel is not part of a combo, should not display a combo bonus label above it.

---

## Synchronize payout panel timing with combo reveals

Align the payout panel’s combo line insertion with the combo reveal timing (reveal → roll off → append payout line).

**Requirements**:
- Given a combo reveal is shown, should append the corresponding combo line to the payout panel in the same sequence.
- Given all combo reveals finish, should then display the final payout total consistent with payout computation.

---

