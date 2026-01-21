# Wheel Drag and Drop Epic

**Status**: 📋 PLANNED  
**Goal**: Implement drag-and-drop functionality to allow players to reorder wheels in the slot machine.

## Overview

WHY: Wheel positioning is a core strategic mechanic. Players must be able to rearrange wheels to protect valuable ones from enemy attacks. Drag-and-drop provides intuitive, tactile control over wheel positioning, making strategic decisions feel active and engaging.

---

## Add drag handles to wheel views

Add visual drag handles to wheels indicating they can be dragged to reorder.

**Requirements**:
- Given wheel is rendered, should display a drag handle (visual indicator) on the wheel
- Given wheel is draggable, should highlight wheel when hovered/selected
- Given drag handle exists, should be clearly visible but not obtrusive
- Given wheel has drag handle, should only be active during non-spin states (can't drag while spinning)

---

## Implement wheel drag interaction

Enable dragging wheels horizontally to change their position in the machine.

**Requirements**:
- Given player clicks/touches wheel drag handle, should initiate drag mode
- Given wheel is being dragged, should follow mouse/touch cursor horizontally
- Given wheel is dragged, should show visual feedback (highlight, shadow, etc.)
- Given wheel is dragged, should constrain movement to horizontal axis only

---

## Implement wheel drop and reordering

When wheel is dropped, snap it into position and reorder wheels accordingly.

**Requirements**:
- Given wheel is dropped, should snap to nearest valid wheel position
- Given wheel position changes, should reorder other wheels to make room
- Given wheels are reordered, should update wheel order in game state
- Given wheel order updates, should maintain valid machine layout (no overlaps, proper spacing)

---

## Update game state for wheel order

Track wheel order in game state and persist wheel positioning.

**Requirements**:
- Given wheel order changes, should update wheel order in game state module
- Given wheel order is tracked, should be used for icon removal targeting (if order affects targeting)
- Given wheel order exists, should persist across spins and enemy attacks
- Given wheel order updates, should trigger re-render of machine layout

---

## Visual feedback during drag

Provide clear visual feedback during drag operations (drop zones, highlights, etc.).

**Requirements**:
- Given wheel is dragged, should show drop zones indicating valid drop positions
- Given wheel hovers over drop zone, should highlight that position
- Given wheel is dragged, should show preview of wheel in new position
- Given drag operation completes, should provide subtle feedback (sound, animation)

---
