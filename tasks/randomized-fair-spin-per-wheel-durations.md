# Randomized Fair Spin + Per-Wheel Durations Epic

**Status**: 📋 PLANNED  
**Goal**: Make wheel outcomes randomized with roughly uniform landing odds per icon and support different spin durations per wheel.

## Overview

WHY: Predictable spins break the lottery-machine fantasy; true randomness with fair landing odds and per-wheel timing variance makes outcomes feel authentic and sets up payouts and upgrades.

---

## Add RNG abstraction for spins

Introduce an RNG interface used by spin planning so outcomes can be truly random in the browser while remaining testable in isolation.

**Requirements**:
- Given a spin is requested, should select a landing outcome using an RNG source rather than deterministic arithmetic.
- Given unit tests run, should be able to inject a deterministic RNG to reproduce outcomes.
- Given the browser runtime is available, should use a high-quality RNG source for non-deterministic play.

---

## Plan fair landing outcomes

Update spin planning to choose a final landing index with roughly equal probability for all icons on the strip.

**Requirements**:
- Given a wheel strip with \(N\) icons, should choose the final landing index uniformly from \([0..N-1]\) (within RNG quality limits).
- Given a spin plan is created, should resolve to a valid final cursor and final icon on the strip.
- Given the wheel performs at least a minimum number of full rotations, should still land on the selected final outcome.

---

## Support per-wheel durations

Allow each wheel to have its own fixed spin duration (e.g., 850ms–1300ms) while keeping the animation smooth and ending aligned on an icon.

**Requirements**:
- Given five wheels exist, should be able to configure a distinct duration per wheel.
- Given a multi-wheel spin starts, should animate each wheel for its configured duration and stop aligned on an icon.
- Given wheels finish at different times, should keep completed wheels stable while remaining wheels continue spinning.

---

## Machine-level overlap prevention

Ensure the Spin button cannot start overlapping spins while any wheel is still active.

**Requirements**:
- Given the Spin button is clicked while any wheel is spinning, should deterministically ignore the request.
- Given all wheels have completed their spins, should allow the next Spin button click to start a new multi-wheel spin.

---

