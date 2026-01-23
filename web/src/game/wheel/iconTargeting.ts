import type { WheelStrip } from './wheelStrip'
import { getIconAtOffset, normalizeCursor } from './wheelStrip'
import { getStripLayout } from './stripLayout'

/**
 * Gets the index of the upper-rightmost icon in a wheel strip's visual layout.
 * The "upper-rightmost" icon is the icon at the top of the visible window
 * (smallest Y position). Since wheels are vertical, this is the uppermost icon
 * in the visible window.
 *
 * @param strip - The wheel strip to analyze
 * @param visibleCount - Number of visible slots in the wheel window
 * @returns The index in the strip.icons array of the upper-rightmost (uppermost) icon
 */
export function getUpperRightmostIconIndex(
  strip: WheelStrip,
  visibleCount: number,
): number {
  const layout = getStripLayout({ strip, visibleCount, slotSpacing: 1 })
  // The top icon in the visible window is at index 0 in the layout.iconIds array
  // The selectedIndex is the middle of the visible window (e.g., 3 for visibleCount 7)
  // The top visible icon is at offset -selectedIndex from the cursor
  // So if selectedIndex is 3, the top icon is at offset -3
  const topOffset = -layout.selectedIndex
  
  // Get the icon at that offset to verify we're getting the right one
  const topIconId = getIconAtOffset(strip, topOffset)
  
  // Now find the actual index in strip.icons array that corresponds to this icon
  // We need to handle the fact that the cursor might wrap
  const stripIndex = normalizeCursor(strip.cursor + topOffset, strip.icons.length)
  
  // Verify the icon matches (defensive check)
  if (strip.icons[stripIndex] !== topIconId) {
    // If there's a mismatch, find the correct index
    const correctIndex = strip.icons.indexOf(topIconId)
    if (correctIndex !== -1) {
      return correctIndex
    }
  }
  
  return stripIndex
}
