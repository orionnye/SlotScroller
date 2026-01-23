# Setup GitHub Actions Deployment Epic

**Status**: 📋 PLANNED  
**Goal**: Replace manual `npm run deploy` with automated GitHub Actions workflow that builds and deploys to GitHub Pages on every push to main.

## Overview

WHY: Manual deployment via `gh-pages` npm package is error-prone and requires manual steps. GitHub Actions provides automated, reliable deployment that runs on every push to main, eliminating the need for manual branch management and ensuring consistent deployments.

---

## Create GitHub Actions workflow file

Create a workflow file that builds the application and deploys to GitHub Pages.

**Requirements**:
- Given `.github/workflows/` directory exists, should create `deploy.yml` workflow file
- Given workflow file exists, should trigger on push to main branch
- Given workflow runs, should checkout code, setup Node.js, install dependencies, build, and deploy
- Given deployment completes, should use GitHub Pages deployment action

---

## Configure build step

Set up the build process in the workflow to match local build commands.

**Requirements**:
- Given workflow runs, should change directory to `web/`
- Given dependencies are installed, should run `npm ci` for reproducible builds
- Given build runs, should execute `npm run build` to create dist directory
- Given build completes, should produce `web/dist/` with all assets

---

## Configure GitHub Pages deployment

Set up automatic deployment to GitHub Pages using the official deployment action.

**Requirements**:
- Given build succeeds, should use `actions/deploy-pages@v4` action
- Given deployment runs, should deploy from `web/dist/` directory
- Given deployment completes, should automatically update GitHub Pages site
- Given workflow has permissions, should have `pages: write` and `id-token: write` permissions

---

## Update package.json scripts

Remove or update the manual deploy script since deployment will be automated.

**Requirements**:
- Given GitHub Actions handles deployment, should remove `deploy` script or rename to `deploy:manual`
- Given manual deployment may be needed, should keep script but mark as manual-only
- Given documentation exists, should update README.md to reflect automated deployment

---

## Test deployment workflow

Verify the GitHub Actions workflow works correctly on push to main.

**Requirements**:
- Given code is pushed to main, should trigger workflow automatically
- Given workflow runs, should complete build and deployment steps successfully
- Given deployment succeeds, should make site available at https://orionnye.github.io/SlotScroller/
- Given workflow fails, should provide clear error messages in Actions tab

---

## Update deployment documentation

Update README.md to reflect the new automated deployment process.

**Requirements**:
- Given documentation exists, should update deployment section to explain automated deployment
- Given manual deployment option exists, should document when and how to use it
- Given workflow is configured, should explain how to check deployment status in Actions tab
