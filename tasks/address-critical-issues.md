# Address Critical Issues Epic

**Status**: 📋 PLANNED  
**Goal**: Remove dead code, eliminate XSS vulnerabilities from innerHTML usage, and add rendering layer test coverage.

## Overview

WHY: The code review identified critical security vulnerabilities (innerHTML XSS risks), dead code files cluttering the codebase, and missing test coverage for rendering components. Addressing these issues immediately improves security posture, codebase cleanliness, and maintainability before further feature development.

---

## Remove dead code files

Delete unused files that serve no purpose in the codebase.

**Requirements**:
- Given counter.ts exists in src/, should be removed as it has no imports or references
- Given typescript.svg exists in src/, should be removed as it has no references
- Given dead files are removed, should not break any existing functionality or imports

---

## Replace innerHTML with safe DOM APIs

Refactor main.ts to use safe DOM manipulation methods instead of innerHTML to eliminate XSS vulnerabilities.

**Requirements**:
- Given app initialization, should create DOM structure using createElement and appendChild instead of innerHTML
- Given payout line insertion, should use createElement and textContent instead of insertAdjacentHTML
- Given DOM manipulation uses safe APIs, should maintain identical visual output and behavior
- Given innerHTML is removed, should eliminate XSS attack surface while preserving functionality

---

## Add tests for WheelStripView

Create test suite for WheelStripView component to verify rendering and animation behavior.

**Requirements**:
- Given WheelStripView is instantiated with a WheelStrip, should render visibleCount icon sprites
- Given update is called with a new strip and scrollOffset, should update sprite positions and textures correctly
- Given showValue is called, should display value label with correct text and color
- Given showBonus is called, should display bonus label with gold color
- Given rollOffValue is called, should animate label upward and fade out over specified duration
- Given hideValue is called, should hide the value label

---

## Add tests for mountPixi integration

Create test suite for mountPixi function to verify PixiJS application initialization and spin behavior.

**Requirements**:
- Given mountPixi is called with a root element, should create and mount a PixiJS Application
- Given spin is called, should initiate wheel animation with randomized durations
- Given spin completes, should call onSpinComplete callback with valid SpinResult
- Given setLocked is called with true, should prevent new spins from starting
- Given multiple wheels are configured, should render all wheels in a centered grid layout
- Given resize event occurs, should recalculate layout and maintain wheel positions

---

## Add tests for createPlaceholderIconTexture

Create test suite for placeholder icon texture generation to verify all icon types render correctly.

**Requirements**:
- Given createPlaceholderIconTexture is called with an iconId, should return a valid Texture
- Given all iconIds from ICON_IDS are passed, should generate distinct textures for each type
- Given same iconId is called multiple times, should generate consistent textures
- Given texture is generated, should have correct dimensions matching size parameter
