# Fix Drag and Drop Initialization and Layout Epic

**Status**: ✅ COMPLETED  
**Goal**: Fix ReferenceError from accessing activeSpin before initialization and restore proper machine centering after drag-and-drop implementation.

## Overview

WHY: The drag-and-drop implementation introduced a temporal dead zone error where `updateDragState()` is called before `activeSpin` is declared, causing a ReferenceError. Additionally, the machine layout may have been affected by coordinate conversion issues in the drag system, causing wheels to appear off-screen. These issues prevent the application from functioning correctly.

---

## Fix activeSpin temporal dead zone error

Move activeSpin declaration before functions that reference it to resolve ReferenceError.

**Requirements**:
- Given activeSpin is referenced in updateDragState, should be declared before updateDragState is defined
- Given setupDragAndDrop calls updateDragState, should ensure activeSpin exists before setupDragAndDrop is called
- Given activeSpin is used, should maintain proper initialization order to avoid temporal dead zone errors

---

## Fix machine centering and layout

Ensure machine container is properly centered and wheels are positioned correctly after drag-and-drop changes.

**Requirements**:
- Given layout function is called, should center machine container at viewport center
- Given wheels are positioned, should use correct coordinate system relative to machine container
- Given drag coordinate conversion occurs, should not affect machine container position
- Given machine is rendered, should be fully visible and centered on screen

---

## Verify drag coordinate conversion

Ensure coordinate conversion between global screen coordinates and machine-local coordinates is correct.

**Requirements**:
- Given global coordinates are converted, should properly account for machine position and scale
- Given drag movement occurs, should use correct coordinate system for wheel positioning
- Given drop zone calculation occurs, should use correct local coordinates relative to machine
- Given coordinate conversion is performed, should maintain wheel positions within visible bounds

---
