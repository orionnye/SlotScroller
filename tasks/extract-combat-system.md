# Extract Combat System Epic

**Status**: ✅ COMPLETED  
**Goal**: Extract combat-related functions from mountTopScene.ts into a dedicated combat module to reduce file size from 471 lines and improve separation of concerns.

## Overview

To further reduce mountTopScene.ts complexity and improve maintainability, we're extracting combat system functions (findNearestEnemy, removeEnemy, dealDamageToEnemy, triggerHeroAttack) into a dedicated combat module. This extraction is more complex than previous phases as these functions access closure state, requiring careful dependency injection. This will reduce the main file by ~140 lines and make combat logic independently testable and reusable.

---

## Extract enemy combat functions

Move findNearestEnemy, removeEnemy, and dealDamageToEnemy to combat module with dependency injection.

**Status**: ✅ COMPLETED

**Requirements**:
- ✅ Given combat functions are extracted, should create `web/src/pixi/topScene/combat/enemyCombat.ts` module
- ✅ Given findNearestEnemy is extracted, should accept enemies array and hero as parameters and return CharacterSprite | null
- ✅ Given removeEnemy is extracted, should accept enemy, charactersLayer, frontLayer, and enemies array as parameters
- ✅ Given dealDamageToEnemy is extracted, should accept enemy sprite reference, damage, enemies array, charactersLayer, and frontLayer as parameters
- ✅ Given dealDamageToEnemy is extracted, should mutate enemy HP and trigger death animation by moving sprite to frontLayer when HP <= 0
- ✅ Given functions are extracted, should update mountTopScene.ts to import and call with all required dependencies
- ✅ Given functions are extracted, should preserve exact combat behavior including death animation initialization

---

## Extract hero attack function

Move and refactor triggerHeroAttack to combat module, breaking it into smaller focused helper functions.

**Status**: ✅ COMPLETED

**Requirements**:
- ✅ Given hero attack is extracted, should create `web/src/pixi/topScene/combat/heroAttack.ts` module
- ✅ Given function is moved, should accept app, hero, enemies array, charactersLayer, state object, and damage as parameters
- ✅ Given function is refactored, should extract gun sprite creation to helper function accepting app, hero position, and target position
- ✅ Given function is refactored, should extract bullet sprite creation to helper function accepting app and hero position
- ✅ Given function is refactored, should extract bullet animation to helper function accepting bullet sprite, start/end positions, duration, and callback
- ✅ Given function is extracted, should handle state.isPaused mutation through state parameter
- ✅ Given function is extracted, should call dealDamageToEnemy with proper dependencies after bullet reaches target
- ✅ Given function is extracted, should update mountTopScene.ts to import and call with all required dependencies
- ✅ Given function is extracted, should preserve exact attack animation timing (100ms aim, 50ms bullet travel, 100ms cleanup)

---
