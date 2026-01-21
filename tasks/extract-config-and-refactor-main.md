# Extract Configuration and Refactor Main Epic

**Status**: ✅ COMPLETED  
**Goal**: Improve code maintainability by extracting magic numbers to named constants, refactoring the complex payout sequence in main.ts, and removing dead code.

## Overview

WHY: Magic numbers scattered throughout the codebase make it difficult to understand intent, adjust values, and maintain consistency. The payout sequence in main.ts is a complex 55-line callback that handles multiple concerns, making it hard to test and modify. Removing dead code reduces confusion and maintenance burden.

---

## Remove dead code

Delete unused scaffold code from the math module.

**Requirements**:
- Given the codebase contains unused `add.ts` and `add.test.ts` files, should remove both files completely

---

## Extract wheel configuration constants

Create a centralized configuration file for wheel-related constants used across mountPixi and WheelStripView.

**Requirements**:
- Given wheel configuration values are hardcoded in mountPixi.ts, should extract WHEEL_COUNT, visibleCount, slotSpacing, and iconSize to a named config module
- Given wheel configuration is duplicated between mountPixi.ts and WheelStripView defaults, should reference the same config constants to maintain consistency

---

## Extract animation timing constants

Centralize animation timing values used in main.ts payout sequence.

**Requirements**:
- Given sleep durations are hardcoded in main.ts payout callback, should extract timing values (160ms, 120ms, 450ms) to named animation timing constants

---

## Extract spin duration configuration

Move spin duration array to configuration module for easier adjustment.

**Requirements**:
- Given wheel spin durations are hardcoded as an array in mountPixi.ts, should extract durations array to config with meaningful names

---

## Extract layout and scene constants

Move magic numbers from mountPixi layout and mountTopScene to configuration.

**Requirements**:
- Given layout calculations use hardcoded values (gapX: 24, gapY: 24, maxCols: 5, pad: 0.94), should extract to layout configuration constants
- Given mountTopScene uses hardcoded speed and positioning values, should extract to scene configuration constants

---

## Refactor payout reveal sequence

Extract the complex payout sequence callback into smaller, testable functions.

**Requirements**:
- Given the onSpinComplete callback is 55 lines handling multiple concerns, should extract base wheel reveal sequence into a separate function
- Given combo bonus reveal logic is embedded in the callback, should extract combo reveal sequence into a separate function
- Given payout panel updates are scattered throughout the callback, should consolidate payout panel manipulation into helper functions

---
