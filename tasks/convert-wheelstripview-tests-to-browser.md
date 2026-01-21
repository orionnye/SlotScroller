# Convert WheelStripView Tests to Browser Environment

**Status**: 📋 PLANNED  
**Goal**: Migrate existing WheelStripView test cases from mocked unit test environment to real browser environment using Playwright, enabling proper WebGL rendering tests.

## Overview

WHY: The current WheelStripView tests use mocks that fail in headless Node.js because PixiJS requires real WebGL and canvas contexts. Converting these tests to run in a real browser environment will allow them to test actual rendering behavior, texture generation, and animations with full WebGL support, completing the test coverage for this critical rendering component.

---

## Create browser test file for WheelStripView

Create a new browser test file using the .browser.test.ts naming convention and browser test utilities.

**Requirements**:
- Given a new test file is created, should be named WheelStripView.browser.test.ts
- Given test file uses browser utilities, should import createPixiApp and cleanupPixiApp from browser-test-utils
- Given test file is created, should be placed alongside existing WheelStripView.test.ts
- Given test file exists, should be excluded from unit test runs and included in browser test runs

---

## Remove mocks and use real browser Application

Replace mocked Application and texture creation with real PixiJS instances using browser test utilities.

**Requirements**:
- Given mocks are removed, should delete vi.mock calls for Application and createPlaceholderIconTexture
- Given real Application is used, should use createPixiApp utility to create Application instances
- Given tests run in browser, should have access to real WebGL context for texture generation
- Given Application is created, should properly initialize with correct dimensions and settings

---

## Migrate instantiation and sprite rendering test

Convert the first test case to verify WheelStripView renders correct number of icon sprites in browser.

**Requirements**:
- Given WheelStripView is instantiated with a WheelStrip, should render visibleCount icon sprites in browser
- Given test uses browser utilities, should create Application using createPixiApp in beforeEach
- Given test completes, should cleanup using cleanupPixiApp in afterEach
- Given sprites are rendered, should verify all sprites exist and are properly initialized

---

## Migrate update and position tests

Convert tests that verify sprite position updates when strip changes or scrollOffset is applied.

**Requirements**:
- Given update is called with a new strip, should update sprite positions correctly in browser
- Given update is called with scrollOffset, should offset sprite positions correctly in browser
- Given positions are tested, should verify sprite positions change as expected
- Given tests run in browser, should work with real texture rendering

---

## Migrate value label display tests

Convert tests for showValue, showBonus, and hideValue to verify label display behavior in browser.

**Requirements**:
- Given showValue is called, should display value label with correct text and color in browser
- Given showBonus is called, should display bonus label with gold color in browser
- Given hideValue is called, should hide the value label in browser
- Given labels are tested, should verify text content, color, and visibility state

---

## Migrate animation test for rollOffValue

Convert the rollOffValue animation test to work with real browser timing and ticker updates.

**Requirements**:
- Given rollOffValue is called when label is not visible, should return immediately without error
- Given rollOffValue is called, should animate label upward and fade out over specified duration in browser
- Given animation is tested, should use real browser timing instead of fake timers
- Given animation completes, should verify label position and alpha changes correctly

---

## Verify all tests pass in browser environment

Run the converted tests in browser environment and verify all 8 test cases pass without errors.

**Requirements**:
- Given all tests are converted, should have 8 test cases matching original test suite
- Given tests run in browser, should pass without texture initialization errors
- Given tests complete, should properly cleanup all Application instances and DOM elements
- Given test suite runs, should demonstrate full rendering functionality works correctly
