# Opaque Wheel Window Occluder Epic

**Status**: 📋 PLANNED  
**Goal**: Make the area outside the wheel window fully opaque while keeping the window itself clear, without breaking smooth spin animation.

## Overview

WHY: The wheel window is the focal point; fully occluding outside symbols removes visual noise, makes spins read cleanly, and prevents the window frame from tinting/covering the symbols in the window.

---

## Replace translucent frame fill with an opaque occluder (2-rect fallback)

Render an overlay layer above the icons that is fully opaque outside the window while keeping the window itself clear. Avoid relying on `cut()`/hole APIs; use two opaque rectangles (top + bottom) to cover the areas outside the window for a vertically-scrolling strip.

**Requirements**:
- Given the wheel is rendered, should fully obscure icons outside the window (no transparency showing through).
- Given the wheel window is rendered, should not tint or cover icons inside the window area.
- Given a spin is in progress, should keep the occluder stable so icons smoothly enter/exit the window without popping.

---

## Keep masking responsibilities clear

Ensure the mask is used only for clipping the icon layer, and the occluder is used only for visual obstruction/trim.

**Requirements**:
- Given the icon layer is masked, should clip only the icon sprites (not the overlay/trim).
- Given the overlay/occluder exists, should not rely on mask alpha/visibility to achieve opacity.

---

