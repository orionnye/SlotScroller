import { describe, expect, test } from 'vitest'

import { FALLBACK_ICON_ID } from './iconIds'
import { getIconResourceKey, getIconResourceKeyFromAny, resolveIconId } from './iconRegistry'

describe('iconRegistry', () => {
  test('resolves unknown icon id to a deterministic fallback', () => {
    expect(resolveIconId('not-a-real-icon')).toBe(FALLBACK_ICON_ID)
    expect(getIconResourceKeyFromAny('not-a-real-icon')).toBe(getIconResourceKey(FALLBACK_ICON_ID))
  })

  test('resolves known icon ids to stable resource keys', () => {
    expect(resolveIconId('cherry')).toBe('cherry')
    expect(getIconResourceKeyFromAny('cherry')).toBe('icons/cherry')
  })
})

