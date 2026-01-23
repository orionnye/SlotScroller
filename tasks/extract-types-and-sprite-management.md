# Extract Types and Sprite Management Epic

**Status**: ✅ COMPLETED  
**Goal**: Extract type definitions and sprite management functions from mountTopScene.ts to reduce file size from 534 lines and improve code organization.

## Overview

To continue reducing mountTopScene.ts complexity and improve maintainability, we're extracting type definitions and sprite management functions. These extractions follow the incremental refactoring approach established in Phase 1, targeting self-contained code that can be moved with minimal risk. This will reduce the main file by ~95 lines and make sprite management reusable and independently testable.

---

## Extract type definitions

Move ScrollerSprite and CharacterSprite type definitions to dedicated types module.

**Status**: ✅ COMPLETED

**Requirements**:
- ✅ Given types are extracted, should create `web/src/pixi/topScene/types.ts` file
- ✅ Given types are moved, should export ScrollerSprite and CharacterSprite types with exact same definitions
- ✅ Given types are extracted, should update mountTopScene.ts to import from new location
- ✅ Given types are extracted, should not modify type definitions during extraction

---

## Extract sprite spawning functions

Move spawnTuft, spawnTree, and spawnEnemy functions to dedicated sprite management module with dependency injection.

**Status**: ✅ COMPLETED

**Requirements**:
- ✅ Given spawn functions are extracted, should create `web/src/pixi/topScene/sprites/spawn.ts` module
- ✅ Given spawn functions are moved, should accept all dependencies as parameters (layers, textures, rng, state, config, app)
- ✅ Given spawnTuft is extracted, should return ScrollerSprite object and add sprite to tuftsLayer
- ✅ Given spawnTree is extracted, should return ScrollerSprite object and add sprite to treesLayer
- ✅ Given spawnEnemy is extracted, should return CharacterSprite object with combat properties initialized
- ✅ Given spawn functions are extracted, should update mountTopScene.ts to import and call with dependencies
- ✅ Given spawn functions are extracted, should preserve exact sprite creation logic including anchor, position, scale, and alpha

---

## Extract scene population logic

Move populate function to dedicated sprite management module with dependency injection.

**Status**: ✅ COMPLETED

**Requirements**:
- ✅ Given populate function is extracted, should create `web/src/pixi/topScene/sprites/populate.ts` module
- ✅ Given populate function is moved, should accept dependencies as parameters (app, layers, spawn functions, arrays, rng, hero)
- ✅ Given populate function is extracted, should clear existing tufts and trees before repopulating
- ✅ Given populate function is extracted, should preserve exact spacing logic for tufts (120px intervals) and trees (420px+ intervals)
- ✅ Given populate function is extracted, should handle enemy spawning with proper spacing (200px+ intervals)
- ✅ Given populate function is extracted, should re-add hero sprite to charactersLayer after clearing
- ✅ Given populate function is extracted, should update mountTopScene.ts to import and call with dependencies

---
