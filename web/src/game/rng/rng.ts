export type Rng = {
  nextInt: (maxExclusive: number) => number
}

export function createSeededRng(seed: number): Rng {
  // Mulberry32 (fast, deterministic, good enough for gameplay/tests; not crypto-secure)
  let a = seed >>> 0
  const nextUint32 = () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return (t ^ (t >>> 14)) >>> 0
  }

  return {
    nextInt: (maxExclusive: number) => {
      if (!Number.isFinite(maxExclusive) || maxExclusive <= 0) {
        throw new Error('maxExclusive must be a finite number > 0')
      }

      // rejection sampling to avoid modulo bias
      const max = maxExclusive >>> 0
      const limit = 0x1_0000_0000 - (0x1_0000_0000 % max)

      while (true) {
        const x = nextUint32()
        if (x < limit) return x % max
      }
    },
  }
}

export function createCryptoRng(): Rng {
  if (!globalThis.crypto?.getRandomValues) {
    throw new Error('crypto.getRandomValues is required for createCryptoRng()')
  }

  const buf = new Uint32Array(1)

  return {
    nextInt: (maxExclusive: number) => {
      if (!Number.isFinite(maxExclusive) || maxExclusive <= 0) {
        throw new Error('maxExclusive must be a finite number > 0')
      }

      const max = maxExclusive >>> 0
      const limit = 0x1_0000_0000 - (0x1_0000_0000 % max)

      while (true) {
        globalThis.crypto.getRandomValues(buf)
        const x = buf[0]
        if (x < limit) return x % max
      }
    },
  }
}

export function createRuntimeRng(): Rng {
  // Browser builds target environments with `crypto.getRandomValues`.
  // Use a try/catch fallback to keep the function safe in non-browser runtimes.
  try {
    return createCryptoRng()
  } catch {
    return {
      nextInt: (maxExclusive: number) => {
        if (!Number.isFinite(maxExclusive) || maxExclusive <= 0) {
          throw new Error('maxExclusive must be a finite number > 0')
        }
        return Math.floor(Math.random() * maxExclusive)
      },
    }
  }
}

