# Implement Wheel Drag and Drop Epic

**Status**: ✅ COMPLETED  
**Goal**: Implement interactive drag-and-drop functionality allowing players to reorder wheels in the slot machine for strategic positioning.

## Overview

WHY: Wheel positioning is a core strategic mechanic where players must protect valuable wheels from enemy attacks. Drag-and-drop provides intuitive, tactile control over wheel positioning, making strategic decisions feel active and engaging. This implementation focuses on getting basic drag-and-drop working with proper visual feedback.

---

## Add drag interaction to WheelStripView

Enable mouse/touch drag interaction on wheel views to allow horizontal dragging.

**Requirements**:
- Given wheel is not spinning and not locked, should enable drag interaction
- Given player presses mouse/touch on wheel, should initiate drag mode
- Given wheel is being dragged, should follow cursor horizontally
- Given wheel is dragged, should constrain movement to horizontal axis only
- Given drag starts, should disable wheel interaction during spin or locked states

---

## Implement wheel reordering logic

When wheel is dropped, reorder wheels array and update positions in the machine.

**Requirements**:
- Given wheel is dropped at a position, should calculate target wheel index based on drop location
- Given wheel order changes, should reorder wheels array to reflect new positions
- Given wheels are reordered, should update wheel positions using existing layout function
- Given wheel order updates, should maintain valid machine layout (no overlaps, proper spacing)

---

## Add visual drag feedback

Provide clear visual feedback during drag operations including highlights and drop zones.

**Requirements**:
- Given wheel is being dragged, should show visual highlight on dragged wheel (increased alpha, shadow, etc.)
- Given wheel is dragged, should show drop zone indicators at valid drop positions
- Given wheel hovers over valid drop position, should highlight that position
- Given drag completes, should provide subtle feedback (brief animation or color pulse)

---

## Prevent dragging during spin and locked states

Disable drag functionality when wheels are spinning or the machine is locked.

**Requirements**:
- Given spin is active, should disable all drag interactions
- Given machine is locked, should disable all drag interactions
- Given drag is disabled, should show visual indication (grayscale, reduced opacity, etc.)
- Given drag state changes, should update interactivity immediately

---
