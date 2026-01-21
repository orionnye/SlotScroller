/**
 * Layout configuration constants for machine positioning and spacing.
 */
export const LAYOUT_CONFIG = {
  /** Horizontal gap between wheels in pixels */
  wheelGapX: 24,
  /** Vertical gap between wheels in pixels */
  wheelGapY: 24,
  /** Maximum number of columns for wheel grid layout */
  maxWheelCols: 5,
  /** Padding factor for fitting machine into viewport (0.94 = 94% of available space) */
  viewportPadding: 0.94,
} as const
