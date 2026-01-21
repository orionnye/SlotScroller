# Phase 1: Render One Icon Epic

**Status**: 📋 PLANNED  
**Goal**: Render a single “icon” in PixiJS using an `IconId` abstraction so later phases can reuse the same icon pipeline for wheel strips.

## Overview

WHY: Before building wheel strips and spins, we need a stable, reusable way to represent and render an icon so the game can evolve from placeholders to real art without rewriting logic.

---

## Define icon identifiers

Introduce an `IconId` type (or enum) and a small registry that maps icon ids to renderable resources.

**Requirements**:
- Given an icon id is referenced by game logic, should be representable as a stable `IconId` value.
- Given an `IconId`, should resolve to a renderable resource key without depending on Pixi APIs.
- Given an unknown/unsupported icon id is requested, should resolve to a deterministic fallback icon.

---

## Render a single icon in Pixi

Render one icon on the Pixi stage using the `IconId` pipeline, starting with a placeholder-generated texture if no art assets are present yet.

**Requirements**:
- Given the app loads, should render exactly one icon sprite on the stage.
- Given no real icon textures are provided yet, should still display a visible placeholder icon.
- Given the icon id is changed in code, should render the corresponding icon without changing renderer wiring.

---

