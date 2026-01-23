# Code Review: PixiJS Test Issues

**Date**: 2024-12-19  
**Focus**: PixiJS test reliability and ticker lifecycle management

---

## 🎯 Restate

Reviewing why PixiJS tests have been "weird" - focusing on:
- `WheelStripView.test.ts` - Mocked Application tests
- `WheelStripView.browser.test.ts` - Browser-based tests  
- `browser-test-utils.ts` - Test utilities for PixiJS cleanup
- Ticker lifecycle management in tests

---

## 💡 Ideate - Issues Identified

1. **Mock Application creates real Ticker that isn't stopped** - Mock uses `new Ticker()` but doesn't stop it
2. **Tests don't stop tickers before destroying apps** - Same issue that was fixed in production code
3. **browser-test-utils.ts doesn't stop tickers** - Cleanup function should stop ticker first
4. **Fake timers conflict with real ticker updates** - Animation test mixes fake timers with real ticker
5. **Mock ticker may continue running** - Ticker could be active after test cleanup

---

## 🪞 Reflect Critically

### Issue 1: Mock Application Ticker Lifecycle

**Location**: `WheelStripView.test.ts:38`

```typescript
ticker = new Ticker()
```

**Problem**: The mock creates a real `Ticker` instance. Even though the mock app doesn't render, the ticker can still be active and cause issues:
- Ticker callbacks may still fire
- Resources may be accessed after destruction
- Tests may interfere with each other

**Impact**: Medium - Can cause flaky tests and resource leaks

---

### Issue 2: Missing ticker.stop() Before Destroy

**Location**: `WheelStripView.test.ts:63`, `browser-test-utils.ts:83`

```typescript
// Current code
app.destroy()  // or app.destroy(true)
```

**Problem**: This is the exact same pattern as the production bug that was fixed. The task `fix-pixijs-ticker-destruction.md` shows this was fixed in production code, but tests weren't updated.

**Expected Pattern** (from production fix):
```typescript
app.ticker.stop()  // Stop ticker first
app.destroy(true)   // Then destroy
```

**Impact**: High - Can cause "Cannot read properties of null" errors in tests

---

### Issue 3: Fake Timers + Real Ticker Conflict

**Location**: `WheelStripView.test.ts:149-186`

```typescript
vi.useFakeTimers()
// ...
app.ticker.update()  // Manual ticker update
vi.advanceTimersByTime(50)
```

**Problem**: Mixing fake timers with manual `ticker.update()`:
- `rollOffValue()` uses `performance.now()` (not affected by fake timers)
- Manual `ticker.update()` may not align with fake timer advances
- Animation timing can be inconsistent

**Impact**: Medium - Tests may be unreliable or timing-dependent

---

### Issue 4: Mock Ticker Not Properly Isolated

**Location**: `WheelStripView.test.ts:21-49`

The mock Application doesn't:
- Stop the ticker in `destroy()`
- Prevent the ticker from running
- Clean up ticker listeners

**Impact**: Low-Medium - Potential test interference

---

## 🔭 Expand Orthogonally

### Related Issues

1. **No ticker.stop() in production cleanup**: `browser-test-utils.ts` should stop tickers before destroy (used by browser tests)
2. **Inconsistent cleanup patterns**: Production code stops tickers (`mountTopScene.ts:223`), but test utilities don't
3. **Mock vs real behavior**: Mock should mirror real Application cleanup behavior

### Security

No security issues identified.

### Performance

- Resource leaks from unstopped tickers
- Test interference from active tickers

### Architecture

- Test utilities should enforce proper cleanup patterns
- Mocks should mirror real behavior

---

## ⚖️ Score & Rank

### Priority 1 (Critical)
1. Add `app.ticker.stop()` before `app.destroy()` in `WheelStripView.test.ts:63`
2. Add `app.ticker.stop()` in `browser-test-utils.ts:cleanupPixiApp()`

### Priority 2 (High)
3. Fix mock Application to stop ticker in `destroy()` method
4. Resolve fake timers + real ticker conflict in animation test

### Priority 3 (Medium)
5. Ensure mock ticker is properly isolated between tests
6. Align test cleanup patterns with production code

---

## 💬 Respond - Actionable Feedback

### Immediate Fixes Required

#### 1. Fix `WheelStripView.test.ts` cleanup:

```typescript
afterEach(() => {
  if (app) {
    app.ticker.stop()  // ADD THIS
    app.destroy()
  }
})
```

#### 2. Fix `browser-test-utils.ts` cleanup:

```typescript
export async function cleanupPixiApp(
  app: Application,
  container: HTMLElement,
): Promise<void> {
  try {
    if (app.canvas && container.contains(app.canvas)) {
      container.removeChild(app.canvas)
    }
  } catch (error) {
    // Ignore errors if canvas was already removed
  }

  try {
    app.ticker.stop()  // ADD THIS - stop ticker before destroy
    await app.destroy(true)
  } catch (error) {
    // Ignore errors if app was already destroyed
  }
  // ... rest of cleanup
}
```

#### 3. Fix mock Application destroy:

```typescript
Application: class MockApplication {
  // ... existing code ...
  ticker = new Ticker()
  // ... existing code ...
  destroy() {
    this.ticker.stop()  // ADD THIS
    // Mock destroy
  }
}
```

### Test Reliability Fixes

#### 4. Fix fake timers test:

The `rollOffValue` test mixes fake timers with `performance.now()`. Options:
- **Option A**: Use real timers and wait for animation
- **Option B**: Mock `performance.now()` to work with fake timers  
- **Option C**: Use browser test pattern (like `.browser.test.ts`)

**Recommendation**: Use Option C - the browser test already handles this correctly.

### Code Quality Improvements

5. **Consistency**: Test cleanup should match production patterns. Production code stops tickers before destroy; tests should too.

6. **Mock Fidelity**: Mock Application should mirror real Application cleanup behavior.

---

## Summary

**Root Cause**: Tests don't stop PixiJS tickers before destroying applications - the same bug pattern that was fixed in production code. This can cause:
- "Cannot read properties of null" errors
- Resource leaks
- Flaky tests
- Test interference

**Fix**: Stop tickers before destroying apps in all test cleanup code, matching the production fix pattern.
