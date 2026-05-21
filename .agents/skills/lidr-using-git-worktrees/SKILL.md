---
name: lidr-using-git-worktrees
id: using-git-worktrees
version: "1.0.0"
last_updated: "2026-05-20"
updated_by: "TL: LIDR Spec Native"
status: active
phase: 5
owner_role: "Dev"
automation: false
domain_agnostic: true
description: >
  Create, use, and clean up isolated git worktrees so an agent can work on multiple
  features in parallel without contaminating the main checkout. Use this skill when the
  user asks to "use a worktree", "isolate this work in a worktree", "run the change in
  a worktree", or whenever the lidr-run-parallel-tasks skill spawns sub-agents that
  must operate on independent branches. Worktrees live under `.worktrees/<change-name>/`
  and are created from a base branch (defaults to current). The skill never deletes a
  worktree implicitly — cleanup is explicit and reported.
---

# Using Git Worktrees Skill

Phase: 5 — Development | Author: LIDR Consultorias

## When to Invoke

- User says: "use a worktree for this", "isolate this work", "run this in its own worktree"
- The `lidr-run-parallel-tasks` skill needs to spawn N agents on independent branches
- Any `lidr-spec-apply` call that must run alongside others without polluting the main checkout

## Pre-flight

Before creating a worktree:

1. Verify `git rev-parse --is-inside-work-tree` returns true
2. Capture base branch: run `git branch --show-current` (or accept explicit `BASE_BRANCH` arg)
3. Verify the working tree is clean enough — `git status --porcelain` should be empty in the main checkout, or warn the user
4. Verify `.worktrees/` is in `.gitignore` (add if missing — never commit worktrees)

## Create a Worktree

Inputs:

- `CHANGE_NAME` — kebab-case identifier for the work (required)
- `BRANCH_NAME` — branch to create (default: `feature/<change-name>`)
- `BASE_BRANCH` — base to fork from (default: current branch, fallback `main`)
- `WORKTREE_PATH` — defaults to `.worktrees/<change-name>` relative to repo root

Steps:

```bash
# From repo root
mkdir -p .worktrees
git fetch origin --quiet
git worktree add -b "$BRANCH_NAME" ".worktrees/$CHANGE_NAME" "$BASE_BRANCH"
```

If the branch already exists locally:

```bash
git worktree add ".worktrees/$CHANGE_NAME" "$BRANCH_NAME"
```

Verify:

```bash
git worktree list
ls .worktrees/$CHANGE_NAME
```

Report:

```
WORKTREE_CREATED: .worktrees/<change-name>
BRANCH: <branch-name>
BASE: <base-branch>
HEAD: <commit-sha-short>
```

## Work Inside the Worktree

- The agent MUST `cd` into the worktree path before running any modifying command (Edit/Write/Bash)
- The agent MUST NOT touch files in the main checkout while the worktree is active
- All git operations (commit, push) run from inside the worktree — they target the worktree's branch automatically

## Clean Up a Worktree

Cleanup is **explicit** — never implicit.

To remove (preserves the branch):

```bash
git worktree remove ".worktrees/$CHANGE_NAME"
```

To remove with uncommitted changes (only if user confirms):

```bash
git worktree remove --force ".worktrees/$CHANGE_NAME"
```

After remove, optionally delete the branch if no longer needed:

```bash
git branch -D "$BRANCH_NAME"   # only if local; never delete remote branches without explicit user request
```

Prune stale worktree entries (after manual deletion of the directory):

```bash
git worktree prune
```

## Guardrails

- ❌ NEVER `rm -rf .worktrees/<name>` directly — use `git worktree remove`
- ❌ NEVER delete a worktree that has uncommitted changes without explicit user confirmation
- ❌ NEVER delete remote branches as part of worktree cleanup
- ❌ NEVER create worktrees outside the repo root (e.g., in `/tmp`) — they belong under `.worktrees/`
- ✅ Always report the worktree path and branch back to the parent agent so it can chain operations
- ✅ When a worktree completes its pipeline, leave it in place by default; the parent agent decides when to clean up

## Common Failure Modes

| Failure                                                           | Resolution                                                                                       |
| ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| `fatal: '.worktrees/X' already exists`                            | The path is in use; either reuse it (`cd` into it) or pick a new name                            |
| `fatal: 'feature/X' is already checked out at '/path/Y'`          | Branch is checked out elsewhere — use a different branch name or remove the other worktree first |
| Worktree directory exists but `git worktree list` doesn't show it | Run `git worktree prune` to clean stale metadata                                                 |
| Main checkout is dirty                                            | Either stash changes (`git stash push -m worktree-prep`) or warn the user                        |

## Output Template

When the skill is invoked standalone, end with:

```
✅ Worktree ready
   Path:   .worktrees/<change-name>
   Branch: <branch-name>
   Base:   <base-branch>
   HEAD:   <commit-sha-short>

Next steps:
  cd .worktrees/<change-name>
  # run your work here
  # cleanup later with: git worktree remove .worktrees/<change-name>
```

## References

- Git docs: https://git-scm.com/docs/git-worktree
- Used by: `lidr-run-parallel-tasks` skill, `lidr-spec-apply` command when `--worktree` flag is present
