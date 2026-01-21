# Wheel Window Mask + Spin Button Epic

**Status**: 📋 PLANNED  
**Goal**: Hide icons outside the wheel’s visible window during spins and trigger spins from a dedicated button positioned to the right of the wheel.

## Overview

WHY: A real slot wheel only shows symbols inside a window; masking improves readability and makes motion feel physical, while a clear “Spin” button sets up multi-wheel control and better UX.

---

## Add a window mask and top overlay layer

Apply a viewport/mask so only the window area is visible, and render an overlay layer above the moving icons so the window frame remains crisp during motion.

**Requirements**:
- Given the wheel is rendered, should hide icons outside the defined window bounds.
- Given a spin is in progress, should keep the masking stable so icons are only visible inside the window while moving.
- Given the window frame/trim is rendered above the icons, should not visually clip or pop icons mid-spin beyond the intended window boundary.

---

## Export a spin trigger to a right-side button

Expose the spin trigger as a UI button placed to the right of the wheel, and remove direct click-to-spin from the wheel surface.

**Requirements**:
- Given the app is loaded, should show a “Spin” button to the right of the wheel and trigger a 1-second spin when clicked.
- Given a spin is already in progress, should prevent overlapping spins deterministically when the button is pressed.
- Given the wheel surface is clicked, should not start a spin (spin is controlled by the button).

---

