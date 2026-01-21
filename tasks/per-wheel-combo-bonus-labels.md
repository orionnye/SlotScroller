# Per-Wheel Combo Bonus Labels Epic

**Status**: 📋 PLANNED  
**Goal**: When a combo occurs, display each participating wheel’s *portion* of the combo bonus above its icon (instead of repeating the full combo bonus on every wheel), while keeping payout totals unchanged.

## Overview

WHY: Showing the full combo bonus on every participating wheel reads like duplicated value; splitting the bonus across participants makes the UI truthful and easier to understand.

---

## Compute per-wheel combo bonus portions

Represent combo bonus reveals in a way that can be allocated per wheel index.

**Requirements**:
- Given a combo bonus applies to \(N\) matching wheels, should compute a per-wheel displayed bonus amount that sums to the combo bonus total.
- Given the combo bonus total does not divide evenly by \(N\), should deterministically distribute the remainder across wheel indices (stable ordering).
- Given payout totals are computed, should remain unchanged by the per-wheel display split.

---

## Render per-wheel combo labels

Update the combo reveal step to display the per-wheel bonus portion above each participating wheel.

**Requirements**:
- Given a combo event is being revealed, should display only the per-wheel portion above each participating wheel window.
- Given the combo reveal rolls off, should roll off each wheel’s portion label without changing wheel icon rendering.
- Given the payout panel appends the combo line, should still show the full combo bonus amount once (not per-wheel).

---

