# Basic Generated Icons (Replace Words) Epic

**Status**: 📋 PLANNED  
**Goal**: Replace the current text-on-rectangle placeholder icon textures with simple, readable generated icons for each `IconId` (e.g., cherry as a red circle + green stem), without requiring external art assets.

## Overview

WHY: Visual icons are essential for a slot/lottery feel; replacing label text with simple shapes improves readability, polish, and makes combos feel meaningful even before final art is supplied.

---

## Define an icon renderer API

Create a renderer-agnostic API to request an icon texture by `IconId` so the rest of the app does not care whether icons come from generated shapes, emoji, or real assets later.

**Requirements**:
- Given an `IconId`, should resolve to a renderable texture without callers needing to know how it is produced.
- Given an unknown/unsupported `IconId`, should render a deterministic fallback icon.
- Given an icon texture was generated once, should reuse/cached textures to avoid regenerating every frame.

---

## Implement basic generated icons per `IconId`

Implement simple vector-drawn icons (Pixi `Graphics`) for each id using minimal shapes and strong silhouette.

**Requirements**:
- Given `IconId = cherry`, should render a red circle with a small green stem/leaf (simple semicircle/sliver).
- Given `IconId = lemon`, should render a yellow oval/lemon shape with subtle highlight.
- Given `IconId = seven`, should render a bold “7” glyph or seven-like mark (shape-based or fallback to text if needed).
- Given `IconId = star`, should render a 5-point star shape.
- Given `IconId = diamond`, should render a diamond/rhombus shape.
- Given `IconId = coin`, should render a coin (circle with inner ring).
- Given `IconId = clover`, should render a simple 3- or 4-leaf clover.
- Given `IconId = bar`, should render a rounded rectangle “BAR” mark (shape-based, minimal text allowed if necessary).

---

## Optional emoji fallback (if available)

Where reasonable, allow an emoji-based icon path (e.g., 🍒 🍋 ⭐️ 💎 🪙 🍀) if it renders cleanly across platforms; otherwise use the generated vector icon.

**Requirements**:
- Given the runtime can render emoji consistently, should allow emoji icons for improved legibility at small sizes.
- Given emoji rendering is inconsistent or missing, should fall back to generated vector icons deterministically.

---

