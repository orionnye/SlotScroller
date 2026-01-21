# Wheel Cover Opacity + Spin Clipping Epic

**Status**: 📋 PLANNED  
**Goal**: Reduce the opacity of the top/bottom cover blocks and ensure spinning icons never render outside the cover/frame bounds.

## Overview

WHY: When icons visibly travel beyond the wheel’s covered area, the machine feels visually broken; semi-transparent covers improve depth while proper clipping guarantees clean motion boundaries.

---

## Make top/bottom covers semi-transparent

Adjust the wheel’s top/bottom cover blocks so they dim icons outside the window instead of fully hiding them.

**Requirements**:
- Given the wheel is rendered, should dim icons outside the window with a semi-transparent cover.
- Given a spin is in progress, should keep covers stationary while icons move behind them.
- Given cover opacity is configured, should be adjustable via a single constant or option.

---

## Clip spinning icons to the wheel frame bounds

Prevent any icon sprite from rendering outside the wheel frame area during smooth scrolling.

**Requirements**:
- Given the wheel animates, should not render icons above the top cover boundary or below the bottom cover boundary.
- Given the wheel is scaled to fit the canvas, should preserve clipping behavior without visual gaps.
- Given clipping is implemented, should not affect overlay elements (frame, selector, value labels).

---

