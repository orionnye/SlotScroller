import { FALLBACK_ICON_ID, ICON_IDS, type IconId } from './iconIds'

export type IconResourceKey = `icons/${string}`

const ICON_RESOURCE_KEYS: Record<IconId, IconResourceKey> = {
  cherry: 'icons/cherry',
  lemon: 'icons/lemon',
  seven: 'icons/seven',
  star: 'icons/star',
  diamond: 'icons/diamond',
  coin: 'icons/coin',
  clover: 'icons/clover',
  bar: 'icons/bar',
}

export function resolveIconId(value: string): IconId {
  return (ICON_IDS as readonly string[]).includes(value) ? (value as IconId) : FALLBACK_ICON_ID
}

export function getIconResourceKey(iconId: IconId): IconResourceKey {
  return ICON_RESOURCE_KEYS[iconId]
}

export function getIconResourceKeyFromAny(value: string): IconResourceKey {
  return getIconResourceKey(resolveIconId(value))
}

