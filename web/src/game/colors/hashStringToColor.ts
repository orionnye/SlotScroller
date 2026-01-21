export function hashStringToColor(value: string): number {
  // FNV-1a-ish, compact and deterministic
  let hash = 2166136261
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i)
    hash = Math.imul(hash, 16777619)
  }

  // Fit into 24-bit RGB (0x000000..0xFFFFFF)
  return hash >>> 8
}

