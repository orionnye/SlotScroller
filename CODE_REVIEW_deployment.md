# 🔬 Code Review: Deployment Approach

**Date**: 2026-01-23  
**Focus**: Deployment strategy and GitHub Pages configuration

---

## 🎯 Restate

Review the deployment approach for GitHub Pages, identify why it's not working, and determine if we're overcomplicating the process.

---

## 💡 Ideate

### Current Deployment Approach

**What we have:**
- `package.json` deploy script: `"deploy": "npm run build && npx gh-pages -d dist"`
- `vite.config.ts` with `base: '/SlotScroller/'`
- Build outputs to `web/dist/`
- Deployment uses `gh-pages` npm package to push to `gh-pages` branch

**What's happening:**
- `gh-pages` branch exists and has files
- Branch contains extra files (`.DS_Store`, `.cursor`, `.github/workflows/`, `web/`)
- GitHub Pages returns 404 despite settings being configured correctly
- User has confirmed settings: `gh-pages` branch, `/ (root)` folder

---

## 🪞 Reflect Critically

### Issues Identified

**1. Extra Files in gh-pages Branch**
- ❌ `.DS_Store` - macOS system file (should be gitignored)
- ❌ `.cursor` - IDE directory (shouldn't be deployed)
- ❌ `.github/workflows/deploy.yml` - workflow file (shouldn't be in gh-pages)
- ❌ `web/` directory - entire web folder (should only be dist contents)

**Root Cause**: The `gh-pages` tool is deploying from the wrong context or including parent directory files.

**2. Deployment Script Location**
- Current: `cd web && npm run deploy` (runs from `web/` directory)
- Script: `npm run build && npx gh-pages -d dist`
- Issue: When run from `web/`, `-d dist` should work, but extra files are appearing

**3. Why Separate Branch?**
- User question: "Why must you have an additional branch?"
- Answer: GitHub Pages standard approach uses `gh-pages` branch OR a directory in main branch
- Alternative: Could use `/docs` directory in main branch, but requires different build output location

---

## 🔭 Expand Orthogonally

### Alternative Approaches

**Option 1: Fix Current Approach (gh-pages branch)**
- Clean the gh-pages branch completely
- Ensure only `dist/` contents are deployed
- Use `gh-pages -d dist` from `web/` directory (current approach)

**Option 2: Use GitHub Actions (Automated)**
- Build on push to main
- Deploy automatically via GitHub Actions
- No manual `npm run deploy` needed
- More reliable, less manual steps

**Option 3: Deploy from Main Branch Directory**
- Build to `docs/` directory in main branch
- Configure GitHub Pages to serve from `/docs` folder
- Simpler: no separate branch needed
- Requires changing build output or copying files

**Option 4: Use Vite's GitHub Pages Plugin**
- Official Vite plugin for GitHub Pages
- Handles base path and deployment automatically
- More integrated with Vite build process

---

## ⚖️ Score Rank Evaluate

### Current Approach Issues

**Problems:**
1. ❌ Extra files polluting gh-pages branch
2. ❌ Manual deployment step required
3. ❌ No automated deployment on push
4. ❌ `gh-pages` tool may be including wrong files

**What Should Work:**
- ✅ `gh-pages -d dist` from `web/` directory should only deploy `dist/` contents
- ✅ GitHub Pages should serve from `gh-pages` branch root
- ✅ Settings are correct (user confirmed)

**Why It's Not Working:**
- The `gh-pages` branch has extra files that shouldn't be there
- This suggests either:
  - Previous deployments included wrong files
  - `gh-pages` tool is running from wrong directory
  - Git worktree or cache issues

---

## 💬 Respond

### Critical Finding

**The Problem**: The `gh-pages` branch is polluted with files that shouldn't be there. The `gh-pages` npm package should only deploy the contents of `web/dist/`, but the branch contains:
- `.DS_Store`
- `.cursor/`
- `.github/workflows/deploy.yml`
- `web/` directory

**Why This Breaks Deployment**: GitHub Pages may be confused by these extra files, or the `index.html` might not be in the expected location.

### Recommended Solution

**Simplest Fix**: Clean the gh-pages branch and redeploy

```bash
# From web/ directory
cd web
npm run build
npx gh-pages -d dist --clean
```

The `--clean` flag should remove files not in the source directory.

**Better Long-term Solution**: Use GitHub Actions for automated deployment

This would:
- Build automatically on push to main
- Deploy to gh-pages branch automatically
- No manual steps required
- More reliable and standard approach

### Answer to User's Question

**"Why must you have an additional branch?"**

You're right - you don't HAVE to. Alternatives:
1. **GitHub Actions** (recommended) - automated, no manual branch management
2. **Main branch `/docs` folder** - simpler, but requires build output changes
3. **Current approach** - standard but requires clean branch management

The `gh-pages` branch approach is common but not required. GitHub Actions would be simpler and more reliable.

---

**Review Complete** ✅
