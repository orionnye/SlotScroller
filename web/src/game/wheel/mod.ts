export function mod(n: number, m: number): number {
  // Deterministic wraparound modulo for negative and positive n.
  return ((n % m) + m) % m
}

