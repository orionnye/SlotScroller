# Fix Remaining TypeScript Compilation Errors Epic

**Status**: 🔍 INVESTIGATING  
**Goal**: Fix all remaining TypeScript compilation errors that are causing the GitHub Actions build to fail.

## Investigation Notes

**Local Build Status**: ✅ Passes (`npm run build` succeeds, `tsc --noEmit` reports no errors)

**Errors Reported in CI**:
1. `getEnemyColor` - declared but never read
2. `bell` icon ID - type error  
3. `beforeEach` - declared but never read
4. `app: Application` - object literal error

**Search Results**:
- ❌ `getEnemyColor` - Not found in codebase (may have been removed or never implemented)
- ❌ `bell` - Not found in codebase
- ✅ `beforeEach` - All imports appear to be used correctly
- ⚠️ `app: Application` - Found in function signatures, not object literals

**Next Steps**: 
- Wait for CI build results after latest fixes to see if errors persist
- If errors persist, check CI logs for exact file paths and line numbers
- May be environment-specific or from cached build artifacts

## Overview

WHY: The GitHub Actions build is failing due to TypeScript compilation errors. These errors prevent successful deployment and need to be resolved to ensure the CI/CD pipeline works correctly. Fixing these errors will enable automated deployments to GitHub Pages.

---

## Fix getEnemyColor unused declaration

Find and fix the `getEnemyColor` function that is declared but never used.

**Requirements**:
- Given `getEnemyColor` is declared but never read, should locate the declaration
- Given the function is found, should either remove it or use it if it's needed
- Given the function is removed, should verify no other code depends on it
- Given the fix is applied, should verify TypeScript compilation passes

---

## Fix bell icon ID type error

Fix the type error where `"bell"` is not assignable to the `IconId` type.

**Requirements**:
- Given `"bell"` is used somewhere but not in `ICON_IDS`, should locate where it's used
- Given the usage is found, should either:
  - Add `"bell"` to `ICON_IDS` if it's a valid icon, OR
  - Replace `"bell"` with a valid `IconId` if it's incorrect
- Given the fix is applied, should verify TypeScript compilation passes
- Given the fix is applied, should verify the icon renders correctly if it's a valid icon

---

## Fix beforeEach unused import

Find and fix the test file where `beforeEach` is imported but never used.

**Requirements**:
- Given `beforeEach` is imported but never used, should locate the test file
- Given the file is found, should either:
  - Remove the unused import if `beforeEach` is not needed, OR
  - Use `beforeEach` if it should be used for test setup
- Given the fix is applied, should verify TypeScript compilation passes
- Given the fix is applied, should verify tests still run correctly

---

## Fix app: Application object literal error

Fix the error where an object literal includes `app: Application` but it's not a valid property.

**Requirements**:
- Given an object literal has `app: Application` that's not valid, should locate the error
- Given the error is found, should fix the object literal structure
- Given the fix is applied, should verify TypeScript compilation passes
- Given the fix is applied, should verify the code still functions correctly

---

## Verify all TypeScript errors are resolved

Run TypeScript compilation to ensure all errors are fixed.

**Requirements**:
- Given all fixes are applied, should run `npm run build` locally
- Given build succeeds locally, should verify no TypeScript errors remain
- Given build succeeds, should push changes and verify GitHub Actions build passes
- Given CI build passes, should confirm deployment to GitHub Pages works

---

## Success Criteria

- ✅ All TypeScript compilation errors are resolved
- ✅ Local build (`npm run build`) succeeds without errors
- ✅ GitHub Actions build job passes successfully
- ✅ No unused imports or declarations remain
- ✅ All type errors are fixed
- ✅ Code functionality is preserved after fixes
