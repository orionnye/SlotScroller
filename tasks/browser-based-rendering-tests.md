# Browser-Based Rendering Tests Epic

**Status**: 📋 PLANNED  
**Goal**: Set up browser-based testing infrastructure to enable rendering layer tests for PixiJS components that cannot run in headless Node.js environment.

## Overview

WHY: PixiJS v8 requires WebGL and canvas rendering contexts that are not available in Node.js test environments. The current WheelStripView tests fail because texture and sprite initialization requires a real browser. Browser-based testing (Playwright/Puppeteer) will allow us to test rendering components in a real browser environment with full WebGL support, completing the test coverage gap identified in the critical issues review.

---

## Install Playwright and configure browser testing

Set up Playwright as the browser testing framework with Vitest integration for running rendering tests in real browsers.

**Requirements**:
- Given Playwright is installed, should add @playwright/test and vitest-playwright dependencies
- Given vitest config is updated, should configure browser environment for rendering test files
- Given browser tests are configured, should be able to run tests in Chromium, Firefox, and WebKit
- Given browser tests run, should automatically download browser binaries on first run

---

## Create browser test setup utilities

Create helper functions and fixtures for setting up PixiJS Application instances and test isolation in browser environment.

**Requirements**:
- Given a test needs a PixiJS Application, should provide a setup function that creates and initializes Application in browser
- Given multiple tests run, should isolate each test with fresh Application instances
- Given test completes, should properly cleanup Application and DOM elements
- Given setup utilities exist, should be reusable across all rendering component tests

---

## Convert WheelStripView tests to browser environment

Migrate existing WheelStripView test cases to run in browser environment using Playwright, verifying all rendering behaviors work correctly.

**Requirements**:
- Given WheelStripView is instantiated with a WheelStrip, should render visibleCount icon sprites in browser
- Given update is called with a new strip and scrollOffset, should update sprite positions and textures correctly in browser
- Given showValue is called, should display value label with correct text and color in browser
- Given showBonus is called, should display bonus label with gold color in browser
- Given rollOffValue is called, should animate label upward and fade out over specified duration in browser
- Given hideValue is called, should hide the value label in browser
- Given all tests run in browser, should pass without texture initialization errors

---

## Add browser tests for mountPixi integration

Create browser-based integration tests for mountPixi function to verify PixiJS application initialization and spin behavior in real browser.

**Requirements**:
- Given mountPixi is called with a root element, should create and mount a PixiJS Application in browser
- Given spin is called, should initiate wheel animation with randomized durations in browser
- Given spin completes, should call onSpinComplete callback with valid SpinResult
- Given setLocked is called with true, should prevent new spins from starting
- Given multiple wheels are configured, should render all wheels in a centered grid layout in browser
- Given resize event occurs, should recalculate layout and maintain wheel positions in browser

---

## Add browser tests for createPlaceholderIconTexture

Create browser-based tests for placeholder icon texture generation to verify all icon types render correctly with real WebGL context.

**Requirements**:
- Given createPlaceholderIconTexture is called with an iconId, should return a valid Texture in browser
- Given all iconIds from ICON_IDS are passed, should generate distinct textures for each type in browser
- Given same iconId is called multiple times, should generate consistent textures in browser
- Given texture is generated, should have correct dimensions matching size parameter in browser

---

## Update test scripts and documentation

Add npm scripts for running browser tests and update documentation to explain the dual testing approach (unit tests for logic, browser tests for rendering).

**Requirements**:
- Given test scripts are updated, should provide separate commands for unit tests and browser tests
- Given documentation exists, should explain when to use unit tests vs browser tests
- Given CI/CD is configured, should run both unit and browser tests in pipeline
- Given developers run tests, should have clear guidance on test execution strategy
