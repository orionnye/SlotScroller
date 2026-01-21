# Top Half Side-Scroller Scene (Generated Grass + Trees) Epic

**Status**: 📋 PLANNED  
**Goal**: Render a simple PixiJS side-scrolling scene in the top half: grassy plain with occasional trees, using generated tufts of grass and tree sprites (no external art required).

## Overview

WHY: A lightweight ambient scene adds personality and progression context while the slot machine runs below, and it gives us a place to later visualize upgrades/world state.

---

## Add a Pixi scene for the top half

Create a dedicated Pixi canvas/scene mounted in the top half region, independent from the slot-machine canvas.

**Requirements**:
- Given the app loads, should render a top-half Pixi canvas without affecting the bottom machine canvas.
- Given the viewport resizes, should resize the top scene to its container deterministically.
- Given the scene is running, should maintain smooth scrolling without frame drops.

---

## Generate grassy plain + tufts

Generate a ground band and repeated tuft details using Pixi `Graphics` (or generated textures) to avoid external dependencies.

**Requirements**:
- Given the top scene renders, should show a grassy ground plane spanning the width.
- Given the scene scrolls, should tile/recycle tufts seamlessly so the world appears infinite.
- Given tufts are generated, should vary slightly (size/rotation/position) while remaining visually cohesive.

---

## Generate trees occasionally

Generate tree sprites (trunk + canopy) and spawn them occasionally along the scroll direction.

**Requirements**:
- Given the scene scrolls, should place trees at occasional intervals with mild variation.
- Given trees move off-screen, should recycle/destroy and respawn deterministically to avoid memory growth.
- Given trees are generated, should remain readable silhouettes at typical sizes.

---

