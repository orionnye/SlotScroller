# Fix Death Animation Visibility and Ticker Destruction Epic

**Status**: ✅ COMPLETED  
**Goal**: Fix two critical issues: (1) Stop PixiJS tickers before destroying apps to prevent rendering errors, (2) Fix death animation visibility so animations actually appear on screen.

## Overview

The death animation system has two critical bugs:
1. **Ticker Destruction Error**: Apps are destroyed while tickers are still active, causing "Cannot read properties of null (reading 'geometry')" errors
2. **Animation Not Visible**: Death animations are created but never appear on screen, likely due to coordinate system or positioning issues

---

## Fix ticker destruction issue

Stop PixiJS app tickers before destroying applications to prevent rendering errors.

Update cleanup code to stop the app's ticker before destroying it.

**Status**: ✅ COMPLETED

**Requirements**:
- ✅ Given death animation completes, should stop app.ticker before calling app.destroy()
- ✅ Given death animation cleanup runs, should call app.ticker.stop() before app.destroy(true)
- ✅ Given mountTopScene.destroy() is called, should stop tickers for all remaining death animations before destroying apps
- ✅ Given app ticker is stopped, should prevent render calls from accessing destroyed resources
- ✅ Given cleanup is performed, should maintain existing cleanup order (canvas removal → ticker stop → app destroy → container removal)

---

## Fix death animation visibility

Investigate and fix why death animations are not appearing on screen.

**Status**: ✅ COMPLETED

**Requirements**:
- ✅ Given enemy dies, should create death animation container that is visible on screen
- ✅ Given container is created, should be positioned correctly relative to viewport (not PixiJS canvas coordinates)
- ✅ Given container is created, should account for top scene canvas position and scroll offset
- ✅ Given container is created, should use viewport coordinates (window-relative) not canvas-relative coordinates
- ✅ Given getGlobalPosition() is called, should convert PixiJS global coordinates to viewport coordinates
- ✅ Given container is positioned, should account for any parent container transforms or offsets
- ✅ Given PixiJS app is created, should ensure app is actually rendering (verify ticker is active)
- ✅ Given sprite is added to app, should verify sprite is visible and within canvas bounds
- ✅ Given container is added to DOM, should verify it's actually in document.body and visible
- ✅ Given animation runs, should verify container position updates are working correctly

**Investigation Points**:
1. `getGlobalPosition()` returns coordinates relative to the PixiJS app's canvas, not the viewport
2. Top scene canvas is inside `topPixiRoot` div which may have its own positioning
3. Container uses `transform: translate(-50%, -50%)` which centers on the position point
4. Need to convert PixiJS canvas coordinates to viewport coordinates by:
   - Getting the canvas element's bounding rect
   - Adding canvas position to global position
   - Accounting for any scroll offsets

---
