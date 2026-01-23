# 🔬 Code Review: PixiJS Not Rendering on GitHub Pages

**Date**: 2026-01-23  
**Focus**: Investigation of why PixiJS content is not rendering on deployed GitHub Pages site  
**Status**: Review Only - No Fixes Applied

---

## 🎯 Restate

The application is successfully deployed to GitHub Pages at `https://orionnye.github.io/SlotScroller/`, but nothing from PixiJS is rendering. The page loads, but the game canvas and all PixiJS content is blank or missing.

---

## 💡 Ideate

### Current Configuration

**Build Configuration:**
- ✅ `vite.config.ts` has `base: '/SlotScroller/'` configured correctly
- ✅ Build outputs to `web/dist/` directory
- ✅ GitHub Actions workflow builds and deploys successfully
- ✅ Deployment completes without errors

**Application Structure:**
- ✅ `index.html` references `/src/main.ts` (Vite handles this in dev, but build should transform it)
- ✅ `main.ts` creates DOM structure and mounts PixiJS applications
- ✅ Two PixiJS applications: `mountPixi()` for wheels, `mountTopScene()` for top scene
- ✅ Both use `app.init()` with `resizeTo: root` configuration

**Potential Issues:**

1. **Asset Path Resolution**
   - Vite should handle base path transformation during build
   - But if assets are referenced incorrectly, they might fail to load
   - Check if any hardcoded paths exist

2. **Canvas Initialization**
   - PixiJS canvas might not be appending to DOM correctly
   - Root elements might not exist when mounting
   - `resizeTo` might fail if root element has zero dimensions

3. **JavaScript Errors**
   - Uncaught errors might prevent rendering
   - Module loading errors might stop execution
   - CORS or CSP issues might block execution

4. **Base Path Issues**
   - If base path isn't respected, module imports might fail
   - Asset loading might use wrong paths
   - Vite's base path transformation might not be working

5. **Async Initialization**
   - `await mountPixi()` and `await mountTopScene()` are async
   - If these fail silently, nothing renders
   - No error handling visible in main.ts

---

## 🪞 Reflect Critically

### Critical Issues Identified

**1. No Error Handling in main.ts**
```typescript
// Line 128-129: Only checks for #app element, but no try-catch for async operations
const appEl = document.querySelector<HTMLDivElement>('#app')
if (!appEl) throw new Error('Missing #app element')

// Lines 136-191: All async operations have no error handling
const topScene = await mountTopScene(...)
const pixi = await mountPixi(...)
```
**Problem**: If `mountTopScene()` or `mountPixi()` throw errors, they're uncaught and execution stops silently. No console errors visible to user.

**2. Root Element Dimensions**
```typescript
// mountPixi.ts line 40: resizeTo: root
await app.init({
  resizeTo: root,
  background: 0x0b1020,
  antialias: true,
})
```
**Problem**: If `root` element has zero width/height when `app.init()` is called, the canvas might be created but not visible. CSS might not be loaded yet, or layout might not be calculated.

**3. Module Path Resolution**
```html
<!-- index.html line 11 -->
<script type="module" src="/src/main.ts"></script>
```
**Problem**: In production build, this should be transformed to `/SlotScroller/assets/index-{hash}.js`, but if the base path isn't applied correctly, the script might not load.

**4. No Console Logging for Debugging**
- No console.log statements to verify initialization
- No error boundaries
- Silent failures are hard to diagnose

**5. Canvas Append Timing**
```typescript
// mountPixi.ts line 45
root.appendChild(app.canvas)
```
**Problem**: Canvas is appended immediately after `app.init()`, but if the root element isn't properly sized or visible, the canvas might be created but not render.

---

## 🔭 Expand Orthogonally

### Potential Root Causes

**Scenario 1: JavaScript Not Loading**
- **Symptom**: Page loads but nothing happens, no console errors
- **Cause**: Module script path incorrect, base path not applied
- **Check**: Browser DevTools Network tab - is `index-{hash}.js` loading?
- **Check**: Browser DevTools Console - any module loading errors?

**Scenario 2: Canvas Created But Not Visible**
- **Symptom**: Canvas exists in DOM but has zero dimensions
- **Cause**: Root element has zero dimensions when `resizeTo` is called
- **Check**: Inspect `#pixiRoot` and `#topPixiRoot` elements - do they have dimensions?
- **Check**: CSS might not be loaded or applied correctly

**Scenario 3: Async Initialization Failure**
- **Symptom**: Page loads, DOM structure exists, but no canvas
- **Cause**: `mountPixi()` or `mountTopScene()` throws error during initialization
- **Check**: Browser DevTools Console - any uncaught promise rejections?
- **Check**: Add try-catch around async calls to see errors

**Scenario 4: Asset Loading Failure**
- **Symptom**: Canvas exists but nothing renders
- **Cause**: Textures or assets fail to load due to incorrect paths
- **Check**: Browser DevTools Network tab - are assets loading?
- **Check**: All assets use relative paths or Vite's asset handling

**Scenario 5: CORS or CSP Issues**
- **Symptom**: Scripts load but execution is blocked
- **Cause**: Content Security Policy or CORS blocking module execution
- **Check**: Browser DevTools Console - any CSP violations?
- **Check**: GitHub Pages might have different security headers

---

## ⚖️ Score Rank Evaluate

### Most Likely Issues (Ranked)

**1. ⚠️ HIGH PRIORITY: No Error Handling**
- **Impact**: Critical - Errors are silent, no debugging information
- **Evidence**: Code has no try-catch blocks around async operations
- **Fix Complexity**: Low - Add error handling and logging

**2. ⚠️ HIGH PRIORITY: Module Script Path**
- **Impact**: Critical - If script doesn't load, nothing works
- **Evidence**: `index.html` uses `/src/main.ts` which should be transformed
- **Fix Complexity**: Medium - Verify build output and base path application

**3. ⚠️ MEDIUM PRIORITY: Root Element Dimensions**
- **Impact**: High - Canvas might be created but invisible
- **Evidence**: `resizeTo: root` depends on element having dimensions
- **Fix Complexity**: Medium - Add dimension checks or explicit sizing

**4. ⚠️ MEDIUM PRIORITY: CSS Loading Timing**
- **Impact**: Medium - Layout might not be calculated when PixiJS initializes
- **Evidence**: CSS defines layout, but async initialization might happen before layout
- **Fix Complexity**: Low - Add explicit dimensions or wait for layout

**5. ⚠️ LOW PRIORITY: Asset Path Issues**
- **Impact**: Medium - Some content might not render
- **Evidence**: All assets appear to be generated programmatically (no external assets)
- **Fix Complexity**: Low - Verify no hardcoded paths exist

---

## 💬 Respond

### Critical Findings

**Primary Issue: Silent Failures**
The code has no error handling around async PixiJS initialization. If `mountPixi()` or `mountTopScene()` fail, the errors are uncaught and execution stops silently. This makes debugging impossible without browser DevTools.

**Secondary Issue: Module Loading**
The `index.html` references `/src/main.ts` which should be transformed during build to use the base path. If this transformation isn't working correctly, the JavaScript might not load at all.

**Tertiary Issue: Timing and Dimensions**
PixiJS initialization uses `resizeTo: root`, which requires the root element to have calculated dimensions. If CSS hasn't loaded or layout hasn't been calculated, the canvas might be created with zero dimensions.

### Recommended Investigation Steps

**1. Check Browser Console**
- Open deployed site in browser
- Open DevTools Console tab
- Look for:
  - Module loading errors
  - Uncaught promise rejections
  - PixiJS initialization errors
  - Any JavaScript errors

**2. Check Network Tab**
- Open DevTools Network tab
- Reload page
- Verify:
  - `index-{hash}.js` loads successfully (status 200)
  - CSS files load successfully
  - No 404 errors for assets
  - All requests use correct base path (`/SlotScroller/`)

**3. Check DOM Structure**
- Inspect page elements
- Verify:
  - `#app` element exists
  - `#pixiRoot` and `#topPixiRoot` elements exist
  - Canvas elements are appended to roots
  - Elements have non-zero dimensions

**4. Check Canvas Elements**
- Inspect canvas elements in DOM
- Verify:
  - Canvas elements exist
  - Canvas has width and height attributes
  - Canvas is visible (not hidden by CSS)
  - Canvas is in viewport

**5. Add Debugging Code**
- Add console.log statements to verify execution flow
- Add try-catch blocks to catch and log errors
- Add dimension logging to verify root element sizes

### Code Quality Issues

**1. Missing Error Handling**
- **Location**: `main.ts` lines 136-191
- **Issue**: No try-catch around async operations
- **Impact**: Silent failures, impossible to debug
- **Recommendation**: Wrap async calls in try-catch and log errors

**2. No Initialization Verification**
- **Location**: `mountPixi.ts` and `mountTopScene.ts`
- **Issue**: No verification that root element has dimensions
- **Impact**: Canvas might be created with zero size
- **Recommendation**: Check element dimensions before calling `app.init()`

**3. No Debug Logging**
- **Location**: Throughout initialization code
- **Issue**: No console logging to verify execution
- **Impact**: Cannot determine where execution stops
- **Recommendation**: Add strategic console.log statements

**4. Hardcoded Path Assumptions**
- **Location**: `index.html` line 11
- **Issue**: Uses `/src/main.ts` which should be transformed
- **Impact**: Might not work if base path transformation fails
- **Recommendation**: Verify build output uses correct paths

### Security Considerations

**No security issues identified** - This is a client-side rendering issue, not a security vulnerability.

### Performance Considerations

**No performance issues identified** - The issue is that nothing renders, not that rendering is slow.

---

## 📋 Action Items (For Future Fix)

1. **Add Error Handling**
   - Wrap `mountTopScene()` and `mountPixi()` calls in try-catch
   - Log errors to console with descriptive messages
   - Display user-friendly error message if initialization fails

2. **Add Debug Logging**
   - Log when initialization starts
   - Log when each step completes
   - Log root element dimensions
   - Log canvas creation and dimensions

3. **Verify Module Loading**
   - Check that built `index.html` references correct asset paths
   - Verify base path is applied to all asset references
   - Test that scripts load correctly

4. **Add Dimension Checks**
   - Verify root elements have dimensions before initialization
   - Add explicit fallback dimensions if needed
   - Wait for layout calculation if necessary

5. **Test in Production Environment**
   - Test locally with `npm run preview` to simulate production
   - Verify base path works correctly in preview
   - Compare preview behavior to deployed site

---

## 🎯 Summary

The most likely cause of PixiJS not rendering is **silent failures during async initialization** combined with **potential module loading or dimension calculation issues**. The code lacks error handling and debugging information, making it impossible to diagnose without browser DevTools.

**Next Steps**: Check browser console and network tab on the deployed site to identify the specific error preventing rendering.
