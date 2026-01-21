# Phase 2: Wheel Strip Model Epic

**Status**: 📋 PLANNED  
**Goal**: Introduce a pure, deterministic “wheel strip” model that stores a loop of `IconId`s and supports wraparound indexing and cursor advancement.

## Overview

WHY: The wheel is the core of the lottery machine; before we render strips or animate spins, we need a testable, renderer-agnostic data model that defines what a wheel contains and how it advances.

---

## Define `WheelStrip` model

Create a minimal `WheelStrip` structure representing a circular list of `IconId`s and a cursor position.

**Requirements**:
- Given a wheel is represented in game logic, should be modeled as a `WheelStrip` containing an ordered list of `IconId`s and a cursor.
- Given an empty icon list is provided, should reject creation of an invalid `WheelStrip`.
- Given a cursor is provided outside the icon list bounds, should normalize it deterministically.

---

## Wraparound indexing helpers

Add pure helpers for reading the icon at the cursor and at offsets from the cursor (both positive and negative) using wraparound behavior.

**Requirements**:
- Given a `WheelStrip`, should be able to read the currently selected icon at the cursor.
- Given a `WheelStrip` and an offset, should return the icon at that offset with correct wraparound behavior.
- Given large offsets (positive or negative), should still return a correct result deterministically.

---

## Cursor advancement

Add a pure helper to advance the cursor by a number of steps with wraparound behavior.

**Requirements**:
- Given a `WheelStrip` and a step count, should advance the cursor with wraparound behavior.
- Given negative steps, should support moving the cursor backward deterministically.
- Given a step count of zero, should return an unchanged cursor.

---

