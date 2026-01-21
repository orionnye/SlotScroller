# Phase 0: Scaffold + Verify PixiJS Epic

**Status**: 📋 PLANNED  
**Goal**: Establish the project scaffold, install PixiJS, and prove the rendering loop works end-to-end in the browser.

## Overview

WHY: Without a working scaffold and a verified Pixi render loop, every later wheel/icon/upgrade feature is speculative and harder to debug; this phase creates a reliable foundation for fast TDD iterations.

---

## Scaffold project

Create a minimal web app scaffold with TypeScript and a test runner suitable for TDD on pure game logic.

**Requirements**:
- Given a fresh clone of the repo, should be able to install dependencies in one step and run the dev server.
- Given the dev server is running, should serve a single-page app without runtime errors.
- Given the test runner is configured, should be able to run unit tests locally for pure (non-rendering) modules.

---

## Install PixiJS and render a placeholder

Install PixiJS and render a simple placeholder scene to verify assets, timing, and input plumbing.

**Requirements**:
- Given the app loads in a browser, should render a Pixi canvas and display a visible placeholder element.
- Given the placeholder scene is visible, should keep rendering without console errors while the page is open.
- Given a user interaction (e.g., click/tap) on a Pixi interactive element, should trigger a visible or logged acknowledgement to confirm input wiring.

---

