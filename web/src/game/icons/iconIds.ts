export const ICON_IDS = [
  'cherry',
  'lemon',
  'seven',
  'star',
  'diamond',
  'coin',
  'clover',
  'bar',
] as const

export type IconId = (typeof ICON_IDS)[number]

export const FALLBACK_ICON_ID: IconId = 'coin'

