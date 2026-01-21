/**
 * Wheel configuration constants used across the application.
 * Centralizes wheel dimensions and display settings.
 */
export const WHEEL_CONFIG = {
  /** Number of wheels in the machine */
  count: 5,
  /** Number of visible slots in the wheel window */
  visibleCount: 7,
  /** Vertical spacing between slot centers in pixels */
  slotSpacing: 92,
  /** Size of each icon sprite in pixels */
  iconSize: 74,
  /** Spin durations for each wheel in milliseconds (staggered for visual effect) */
  spinDurationsMs: [850, 950, 1050, 1150, 1250] as const,
  /** Minimum number of full rotations before stopping */
  minFullRotations: 2,
} as const
