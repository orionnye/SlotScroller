# Post-Spin Value Reveal + Payout Add Animation Epic

**Status**: 📋 PLANNED  
**Goal**: After a multi-wheel spin completes, reveal each wheel’s contributing value above its final icon, pause briefly, then add those values into the payout panel on the right before showing combo bonuses/total.

## Overview

WHY: A short “reveal” beat helps players understand what each wheel contributed and makes the payout feel earned and satisfying rather than instantly appearing as a single number.

---

## Define a post-spin reveal phase

Introduce a deterministic “reveal” phase that begins only after all wheels stop, lasts a short fixed duration, and drives the UI sequencing.

**Requirements**:
- Given all wheels have completed a spin, should enter a reveal phase before final payout is committed to the payout panel.
- Given a reveal phase is active, should prevent starting a new spin until the reveal phase completes.
- Given the reveal phase completes, should transition to the final payout state deterministically.

---

## Render per-wheel values above final icons

Render a value label above each wheel showing the icon’s contributing value.

**Requirements**:
- Given a spin completes, should display each wheel’s contributing numeric value above the final icon.
- Given icon values are defined in game logic, should derive the displayed values from the canonical value mapping.
- Given the reveal phase ends, should hide or de-emphasize the per-wheel value labels.

---

## Add revealed values into the payout panel

After the reveal pause, add the wheel values into the right-side payout panel in a readable progression (e.g., one-by-one or aggregated), then show combo bonuses and total.

**Requirements**:
- Given the reveal phase finishes, should add wheel value contributions to the payout panel on the right in a deterministic order.
- Given combo bonuses apply, should display combo bonus lines after base contributions are added.
- Given the payout panel is updated, should show a final total that matches the payout computation.

---

