# Code Review: Death Animations Scope Error

## Issue Summary

**Error**: `ReferenceError: deathAnimations is not defined` at `heroAttack.ts:133`

**Root Cause**: The `triggerHeroAttack` function signature is missing the `deathAnimations` parameter, but the parameter is being used inside an async callback closure.

## Detailed Analysis

### Problem Location

**File**: `web/src/pixi/topScene/combat/heroAttack.ts`

**Line 75-84**: Function signature missing `deathAnimations` parameter:
```typescript
export async function triggerHeroAttack(
  targetEnemy: { sprite: Sprite } | null,
  damage: number,
  app: Application,
  hero: CharacterSprite,
  enemies: CharacterSprite[],
  charactersLayer: Container,
  frontLayer: Container,
  state: SceneState,
): Promise<void> {
```

**Line 133**: `deathAnimations` is referenced inside `animateBullet` callback:
```typescript
dealDamageToEnemy(
  { sprite: actualEnemy.sprite, hp: actualEnemy.hp },
  damage,
  enemies,
  charactersLayer,
  frontLayer,
  deathAnimations,  // ❌ Not in scope!
  app,
)
```

### Why This Happened

During the integration, the function signature update may have been incomplete or the parameter was not properly added to the function signature. The `deathAnimations` parameter needs to be:

1. Added to the function signature
2. Available in the closure scope for the `animateBullet` callback

### Impact

- Death animations will not be created when enemies are killed
- The game will crash with a ReferenceError when attempting to deal damage

### Solution

Add `deathAnimations: CssDeathAnimation[]` parameter to the `triggerHeroAttack` function signature after `state: SceneState,`.

## Verification Checklist

- [ ] `triggerHeroAttack` function signature includes `deathAnimations` parameter
- [ ] `mountTopScene.ts` passes `deathAnimations` to `triggerHeroAttack` call
- [ ] No other scope issues with `deathAnimations` in callbacks
