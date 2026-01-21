# Soft Top/Bottom Window Blocks Epic

**Status**: 📋 PLANNED  
**Goal**: Add two semi-transparent overlay blocks above and below the wheel window to visually cover icons outside the window while leaving the window area clear.

## Overview

WHY: Dimming/covering off-window symbols reduces visual noise and improves readability during spins while preserving the satisfying motion inside the window.

---

## Add top/bottom overlay blocks

Add two semi-transparent rectangles (top and bottom) rendered above the icon sprites to cover the regions outside the window.

**Requirements**:
- Given a wheel strip is rendered, should draw a semi-transparent top block that covers icons above the window.
- Given a wheel strip is rendered, should draw a semi-transparent bottom block that covers icons below the window.
- Given a spin is in progress, should keep the blocks stationary while icons scroll behind them.

---

