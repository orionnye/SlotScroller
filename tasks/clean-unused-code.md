# Clean Unused Code Epic

**Status**: 📋 PLANNED  
**Goal**: Remove dead code, commented imports, unused test files, and clean up the codebase to improve maintainability.

## Overview

WHY: Dead code and commented imports clutter the codebase, create confusion, and make it harder to understand what code is actually in use. Removing unused files and code improves code quality, reduces maintenance burden, and follows the principle of "simplicity is removing the obvious."

---

## Remove commented imports and code

Clean up commented code in main.ts that references unused functionality.

**Requirements**:
- Given `main.ts:12` has commented import for `testDeathAnimation`, should remove the commented line
- Given `main.ts:197-198` has commented test code, should remove commented test code
- Given commented code is removed, should not break any functionality

---

## Remove unused test files

Delete test files that are no longer used or referenced.

**Requirements**:
- Given `testDeathAnimation.ts` exists and is not imported, should delete the file
- Given `testSvgEnemy.ts` exists and is not imported, should delete the file
- Given test files are removed, should verify no other files reference them
- Given files are deleted, should not break any imports or functionality

---

## Verify no dead code remains

Run analysis to ensure no other unused code exists in the codebase.

**Requirements**:
- Given codebase is analyzed, should check for unused exports using tools like `ts-prune` or manual review
- Given unused exports are found, should remove them or document why they're kept
- Given dead code analysis completes, should confirm all remaining code is in use

---

## Update .gitignore if needed

Ensure test files and build artifacts are properly ignored.

**Requirements**:
- Given `.gitignore` exists, should verify `dist/` and build artifacts are ignored
- Given test files are removed, should ensure no test artifacts remain in git
- Given cleanup is complete, should verify git status is clean
