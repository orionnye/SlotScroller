# Delete Unused Branches Epic

**Status**: 📋 PLANNED  
**Goal**: Clean up the gh-pages branch by removing it and letting GitHub Actions manage deployment, or clean it if keeping manual deployment.

## Overview

WHY: The gh-pages branch is polluted with extra files (`.DS_Store`, `.cursor`, `.github/workflows/`, `web/`) that shouldn't be there. With GitHub Actions handling deployment automatically, we can either clean the branch or delete it entirely and let Actions recreate it cleanly.

---

## Assess branch status

Check what branches exist and their current state.

**Requirements**:
- Given git repository exists, should list all local and remote branches
- Given gh-pages branch exists, should check its contents and commit history
- Given branch status is known, should determine if branch should be cleaned or deleted

---

## Clean or delete gh-pages branch

Remove the polluted gh-pages branch to allow GitHub Actions to create a clean one.

**Requirements**:
- Given GitHub Actions will handle deployment, should delete remote gh-pages branch
- Given branch is deleted, should verify it's removed from remote repository
- Given branch is deleted, should allow GitHub Actions to create fresh branch on first deployment
- Given manual deployment is preferred, should clean branch using `gh-pages --clean` instead

---

## Verify GitHub Pages settings

Ensure GitHub Pages is configured correctly after branch cleanup.

**Requirements**:
- Given branch is cleaned or deleted, should verify GitHub Pages settings still point to gh-pages branch
- Given settings are correct, should confirm GitHub Pages will work after Actions deployment
- Given deployment succeeds, should verify site is accessible at https://orionnye.github.io/SlotScroller/

---

## Document branch management

Update documentation to explain branch management strategy.

**Requirements**:
- Given deployment strategy is automated, should document that gh-pages branch is managed by GitHub Actions
- Given manual deployment exists, should document when and how to use it
- Given branch cleanup is complete, should note in README or deployment docs
