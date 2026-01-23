# Code Review: AIDD Framework - How to Proceed with mountTopScene Refactoring

## 🎯 Restate

Review the AI-Assisted Development (AIDD) framework guidelines to determine the proper approach for refactoring `mountTopScene.ts` (764 lines) into smaller, maintainable modules.

## 💡 Ideate

### Framework Components Identified

1. **AGENTS.md** - Core AI agent guidelines
2. **task-creator.mdc** - Task/epic planning and execution
3. **review.mdc** - Code review process
4. **tdd.mdc** - Test-driven development approach
5. **vision.md** - Project vision and constraints
6. **agent-orchestrator.mdc** - Agent coordination

### Key Framework Principles

1. **Progressive Discovery**: Only read what's needed for the task
2. **Vision Document First**: Always read `vision.md` before tasks
3. **Task-Based Workflow**: Use `/task` to create epics, `/execute` to implement
4. **TDD Process**: Write tests first when implementing code changes
5. **Separation of Concerns**: Non-negotiable constraint from vision

## 🪞 Reflect Critically

### Framework Alignment Check

**✅ Vision Document Compliance**:
- Vision states: "Separation of concerns (non-negotiable engineering constraint)"
- Vision states: "Pure game logic is separate from rendering"
- Current `mountTopScene.ts` mixes rendering, logic, and state management
- **Verdict**: Refactoring aligns with vision requirements

**✅ Task Creator Guidelines**:
- Framework requires breaking complex tasks into manageable epics
- Each task should be ~50 lines of code or less
- Tasks should be independent and testable
- **Verdict**: Refactoring should be split into multiple sequential tasks

**✅ TDD Requirements**:
- Framework requires TDD process for code changes
- Tests should be written first
- Tests should be isolated and focused
- **Verdict**: Each extracted module needs tests before implementation

**✅ Review Process**:
- Framework requires thorough code review
- Review should check adherence to standards
- Review should provide actionable feedback
- **Verdict**: Current review completed, ready for task creation

## 🔭 Expand Orthogonally

### Framework-Compliant Refactoring Plan

#### Phase 1: Extract Texture Creation (Framework-Aligned)
**Why First**: Pure functions, no dependencies, easiest to test
**Framework Compliance**:
- ✅ Single responsibility (texture generation only)
- ✅ No breaking changes (internal refactor)
- ✅ Testable in isolation
- ✅ ~50 lines per file target

**Task Structure**:
1. Create `/task` epic: "Extract Texture Creation Functions"
2. Sub-tasks:
   - Extract `createGrassTuftTexture` → `textures/grassTuft.ts`
   - Extract `createTreeTexture` → `textures/tree.ts`
   - Extract `createHeroTexture` → `textures/hero.ts`
   - Extract `createGunTexture` → `textures/gun.ts`
   - Extract `createBulletTexture` → `textures/bullet.ts`
   - Extract `createEnemyTexture` → `textures/enemy.ts`
3. Each extraction should:
   - Write tests first (TDD)
   - Verify no breaking changes
   - Update imports in `mountTopScene.ts`

#### Phase 2: Extract Type Definitions
**Why Second**: Low risk, improves type safety
**Framework Compliance**:
- ✅ No logic changes
- ✅ Improves maintainability
- ✅ Enables better type checking

**Task Structure**:
1. Create `/task` epic: "Extract Type Definitions"
2. Extract `ScrollerSprite` and `CharacterSprite` to `types.ts`
3. Update imports

#### Phase 3: Extract Sprite Management
**Why Third**: Medium complexity, clear boundaries
**Framework Compliance**:
- ✅ Single responsibility (sprite lifecycle)
- ✅ Testable with mock dependencies
- ✅ ~50 lines per function target

**Task Structure**:
1. Create `/task` epic: "Extract Sprite Management"
2. Sub-tasks:
   - Extract spawn functions → `sprites/spawn.ts`
   - Extract populate logic → `sprites/populate.ts`
   - Create sprite manager class or module

#### Phase 4: Extract Combat System
**Why Fourth**: Most complex, requires dependency injection
**Framework Compliance**:
- ✅ Separation of concerns (combat logic separate from rendering)
- ✅ Testable with injected dependencies
- ✅ Aligns with vision's separation principle

**Task Structure**:
1. Create `/task` epic: "Extract Combat System"
2. Sub-tasks:
   - Extract `dealDamageToEnemy` → `combat/damage.ts`
   - Extract `findNearestEnemy` → `combat/targeting.ts`
   - Extract `removeEnemy` → `combat/removal.ts`
   - Refactor `triggerHeroAttack` → `combat/heroAttack.ts` (break into smaller functions)
3. Use dependency injection pattern:
   - Pass enemies array, layers, state as parameters
   - Return new state/effects instead of mutating closure

#### Phase 5: Extract Animation System
**Why Last**: Most tightly coupled, requires careful extraction
**Framework Compliance**:
- ✅ Separation of animation from game logic
- ✅ Testable with mock ticker
- ✅ Maintains rendering separation

**Task Structure**:
1. Create `/task` epic: "Extract Animation System"
2. Sub-tasks:
   - Extract background animation → `animation/background.ts`
   - Extract hero animation → `animation/hero.ts`
   - Extract enemy animation → `animation/enemy.ts`
   - Extract death animation → `animation/death.ts`
3. Create animation manager to coordinate

### Framework Workflow

```
1. Read vision.md ✅ (Already done)
2. Create /task epic for Phase 1
3. User approves epic
4. /execute Phase 1, Task 1 (with TDD)
5. User approves completion
6. /execute Phase 1, Task 2 (with TDD)
7. Repeat until Phase 1 complete
8. Move to Phase 2
```

## ⚖️ ScoreRankEvaluate

### Framework Adherence Score: 9/10

**Strengths**:
- ✅ Follows task-based workflow
- ✅ Respects separation of concerns (vision requirement)
- ✅ Plans incremental, testable changes
- ✅ Each phase is independent and approvable
- ✅ Maintains backward compatibility

**Potential Issues**:
- ⚠️ Phase 4 (Combat) may require more complex dependency injection
- ⚠️ Need to ensure tests are written first (TDD requirement)
- ⚠️ Must verify no breaking changes after each phase

### Risk Assessment

| Phase | Risk Level | Framework Compliance | Priority |
|-------|-----------|---------------------|----------|
| Phase 1: Textures | Low | High | 1 |
| Phase 2: Types | Low | High | 2 |
| Phase 3: Sprites | Medium | High | 3 |
| Phase 4: Combat | High | Medium | 4 |
| Phase 5: Animation | High | Medium | 5 |

## 💬 Respond

### Recommended Approach Per Framework

**Immediate Next Steps**:

1. **Create Task Epic** (Following `task-creator.mdc`):
   ```
   /task Extract Texture Creation Functions from mountTopScene
   ```
   - Epic should break into 6 sub-tasks (one per texture function)
   - Each sub-task: ~50 lines target
   - Requirements: TDD, no breaking changes, testable

2. **Execute with TDD** (Following `tdd.mdc`):
   - For each texture extraction:
     - Write test first
     - Extract function
     - Verify test passes
     - Update imports
     - Verify no regressions

3. **Review After Each Phase** (Following `review.mdc`):
   - Verify framework compliance
   - Check separation of concerns
   - Validate test coverage
   - Ensure no breaking changes

### Framework-Compliant Task Structure

**Epic Template** (per `task-creator.mdc`):
```markdown
# Extract Texture Creation Functions Epic

**Status**: 📋 PLANNED
**Goal**: Extract texture creation functions to improve maintainability and testability.

## Overview

To improve code organization and align with separation of concerns, we're extracting texture creation functions from mountTopScene.ts into dedicated texture modules. This reduces file size and makes textures reusable and testable.

---

## Extract createGrassTuftTexture

Move grass tuft texture creation to dedicated module.

**Requirements**:
- Given texture function is extracted, should maintain exact same visual output
- Given function is moved, should be importable from textures/grassTuft.ts
- Given function is extracted, should have unit tests written first (TDD)
- Given tests pass, should update mountTopScene.ts imports
```

### Key Framework Constraints

1. **Never break backward compatibility** without explicit approval
2. **Write tests first** (TDD requirement)
3. **One task at a time** - get approval before proceeding
4. **Respect vision.md** - separation of concerns is non-negotiable
5. **Keep tasks small** - ~50 lines per task target

### Framework Benefits

- ✅ Incremental, low-risk refactoring
- ✅ Testable at each step
- ✅ User approval gates prevent breaking changes
- ✅ Clear progress tracking
- ✅ Aligns with project vision

### Conclusion

The framework provides clear guidance:
1. **Start with easiest extractions** (textures)
2. **Use TDD** for all code changes
3. **Create task epics** for each phase
4. **Get approval** before proceeding
5. **Maintain separation** of concerns throughout

The refactoring plan aligns perfectly with framework principles and can proceed immediately with Phase 1.
