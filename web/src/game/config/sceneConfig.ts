/**
 * Scene configuration constants for top scene animations and positioning.
 */
export const SCENE_CONFIG = {
  /** Horizontal scroll speed in pixels per second */
  scrollSpeedPxPerSec: 90,
  /** Ground position as fraction of viewport height (0.88 = 88% from top) */
  groundPositionRatio: 0.88,
  /** Minimum ground height in pixels */
  minGroundHeight: 40,
  /** Tree scale factor relative to available height (0.85 = 85% of available space) */
  treeScaleRatio: 0.85,
  /** Base tree height in pixels at scale 1.0 */
  treeBaseHeight: 220,
} as const
