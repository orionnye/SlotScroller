# Fix Death Animations Scope Error

**Status**: ✅ COMPLETED  
**Priority**: 🔴 HIGH (Blocks death animations from working)

## Issue

`ReferenceError: deathAnimations is not defined` at `heroAttack.ts:133`

The `triggerHeroAttack` function signature is missing the `deathAnimations` parameter, but it's being used inside the `animateBullet` callback closure.

## Root Cause

During integration, the function signature update was incomplete. The `deathAnimations` parameter was added to the function call in `mountTopScene.ts` but not to the function signature in `heroAttack.ts`.

## Detailed Requirements

### Fix triggerHeroAttack function signature
- Given `heroAttack.ts` has `triggerHeroAttack` function, should add parameter: `deathAnimations: CssDeathAnimation[]` after `state: SceneState,` parameter (line 83)
- Given function signature is updated, should ensure `deathAnimations` is available in closure scope for `animateBullet` callback (line 118-147)

## Files to Modify

1. `web/src/pixi/topScene/combat/heroAttack.ts`
   - Add `deathAnimations: CssDeathAnimation[]` parameter to function signature

## Verification

- [ ] Function signature includes `deathAnimations` parameter
- [ ] No ReferenceError when dealing damage to enemies
- [ ] Death animations are created when enemies die
