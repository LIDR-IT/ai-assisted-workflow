---
name: lidr-run-parallel-tasks
id: run-parallel-tasks
version: "1.1.0"
last_updated: "2026-06-09"
updated_by: "TL: LIDR Spec Native"
status: active
phase: 4
stage: development
owner_role: "TL"
automation: true
domain_agnostic: true
integrations: [tracking]
model: claude-opus-4-7
effort: high
description: >
  Run N change-driven features in parallel, each in its own isolated git worktree,
  following the full LIDR spec lifecycle (enrich-ticket → spec-new → spec-ff →
  spec-apply → spec-verify). Stops after verify — no archive, no commit, no
  worktree cleanup. Use when the user says "run parallel-tasks.md", "run the
  parallel changes", "lanza los tasks en paralelo", "start the parallel tasks",
  or when a TL wants to execute multiple {{TRACKING_TOOL}} tickets concurrently without
  blocking the main checkout. Each task runs cold-start in a sub-agent with a
  self-contained prompt. Output is a summary table with per-task verify status
  and blockers. Requires Opus high reasoning for the planning sub-steps.
---

# Run Parallel Tasks Skill

Phase: 5 — Development | Author: LIDR Consultorias | Pipeline: enrich → new → ff → apply → verify → stop

Tools resolve via the central registry `_shared/lidr/integrations/tool-registry.yaml`; the active client binds concrete tools in `clients/<CODE>.yaml`.

Reads `parallel-tasks.md` from the project root (or from the path provided), spins up one isolated sub-agent per task, and runs each through the full LIDR change lifecycle without supervision.

**Pipeline per sub-agent**: worktree → enrich-ticket → /lidr-spec-new → /lidr-spec-ff → /lidr-spec-apply → /lidr-spec-verify → stop

## When to Invoke

- User says: "run parallel-tasks.md", "run the parallel changes", "lanza los tasks en paralelo", "start the parallel tasks"
- File `parallel-tasks.md` exists at repo root with one or more `### Task` blocks
- TL wants to execute multiple tickets concurrently during a dense sprint

## Pre-flight

1. Verify the user is in role TL (or higher) — paralelización is TL-authorized per `lidr-sdlc/workflows.md`
2. Verify the session is using Opus high reasoning. If not, self-correct per `lidr-sdlc/model-selection.md` (edit `.claude/settings.json` with `update-config` skill) before continuing
3. Verify `parallel-tasks.md` exists. If not: ask the user to point to the file or describe the tasks inline
4. Verify `.worktrees/` is gitignored (the `lidr-using-git-worktrees` skill will warn otherwise)
5. Verify base branch is clean enough — warn if `git status --porcelain` is non-empty

## Step 1 — Parse parallel-tasks.md

Read `parallel-tasks.md` from the project root (or the provided path).

Extract every uncommented task block. A task block starts with `### Task` and contains:

- `name:` — kebab-case change name (**required**)
- `us:` — source of the user story: `inline`, a file path, or a {{TRACKING_TOOL}} ticket ID (**required**)
- `description:` — inline US text (**required when `us: inline`**)

Skip any task block wrapped in `<!-- -->` HTML comments.

Announce:

```
Found N task(s): <name-1>, <name-2>, ...
Base branch: <current-branch>
Pipeline per task: enrich → spec-new → spec-ff → spec-apply → spec-verify
```

If N == 0: abort with a clear message.

## Step 2 — Enrich each US

For **every** task, regardless of source format, run the enrichment workflow before spawning the sub-agent. Enrichment is mandatory — it ensures the sub-agent has complete technical context to operate autonomously.

Resolve raw US text by source type:

- `us: inline` → use the `description:` field as raw US input
- `us: <file-path>` → read the file at that path as raw US input
- `us: <TICKET-ID>` → pass the {{TRACKING_TOOL}} ticket ID to the enrichment step; the enricher fetches and enriches in one pass

Invoke the enrichment using one of these (whichever is available):

- The `lidr-ticket-enricher` subagent (preferred when the {{TRACKING_TOOL}} MCP is configured)
- The `/lidr-enrich-ticket` slash command
- A direct delegation to the `lidr-enrich-us` skill if it exists

Capture the **full enriched US** (with endpoints, files to modify, test cases, NFRs) and store in memory keyed by `name`. The sub-agent will receive this as its primary source of truth.

## Step 3 — Spawn one sub-agent per task in parallel

Launch all sub-agents simultaneously using the `Agent` tool with `run_in_background: true`. Each sub-agent receives a **fully self-contained prompt** — sub-agents start cold with no session memory.

Use the template in `references/parallel-tasks-agent-prompt.md` (substitute variables before passing the prompt).

Variables to substitute:

- `{{CHANGE_NAME}}` — task `name` field
- `{{ENRICHED_US}}` — full enriched US from Step 2
- `{{PROJECT_ROOT}}` — absolute path to the repo root
- `{{BASE_BRANCH}}` — current git branch (from `git branch --show-current`)
- `{{CLIENT_CODE}}` — from `src/data/client.ts` or equivalent (see `lidr-sdlc/project.md`)

## Step 4 — Wait and report

When all background sub-agents complete, print a summary table:

```
| Task | Worktree | Tasks | Verify | Blockers |
|------|----------|-------|--------|----------|
| <name> | .worktrees/<name> | N/N | PASSED / WARNINGS / CRITICAL | none / <description> |
```

If any sub-agent reported CRITICAL issues or blockers, flag them clearly to the user with the specific worktree path so they can inspect manually.

## Output

Final report includes:

1. Summary table (above)
2. Per-task verification summary (one paragraph each)
3. List of worktrees left in place (the skill does NOT remove them)
4. Next-step suggestions per task:
   - PASSED → `/lidr-spec-archive <name>` from inside the worktree, then `/lidr-create-pr <ticket-id>`
   - WARNINGS → review warnings inside the worktree, then re-run `/lidr-spec-verify <name>`
   - CRITICAL → inspect blockers, fix, re-run pipeline

## Guardrails

- ❌ NEVER skip enrichment (Step 2) — sub-agents need full context
- ❌ NEVER archive, commit, push, or remove worktrees automatically — the user inspects and decides
- ❌ NEVER spawn more than 5 sub-agents concurrently without explicit user confirmation (LLM budget guardrail)
- ❌ NEVER fall back to Sonnet for the planning sub-steps — Opus high reasoning is mandatory (see `lidr-sdlc/model-selection.md`)
- ✅ Always report cold-start sub-agent prompts truthfully — they're self-contained and reproducible
- ✅ Always preserve the main checkout — sub-agents work exclusively inside their worktree

## Common Failure Modes

| Failure                                                         | Resolution                                                                                                                   |
| --------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `parallel-tasks.md` missing                                     | Ask user to create it; provide template path: `.agents/skills/lidr-run-parallel-tasks/references/parallel-tasks-template.md` |
| One sub-agent fails to create worktree                          | The task is marked BLOCKED; other sub-agents continue. Report the failure                                                    |
| Enrichment fails ({{TRACKING_TOOL}} MCP down, ticket not found) | The task is marked BLOCKED; the user must enrich manually or provide inline US                                               |
| Sub-agent runs out of context                                   | Sub-agent reports CRITICAL with "context exhausted"; user must run that task standalone                                      |

## References

- `references/parallel-tasks-template.md` — template for the input `parallel-tasks.md` file
- `references/parallel-tasks-agent-prompt.md` — self-contained prompt template for sub-agents
- Related skill: `lidr-using-git-worktrees`
- Related rule: `lidr-sdlc/model-selection.md` (Opus high reasoning enforcement)
- Related rule: `lidr-sdlc/spec-execution.md` (mandatory steps inside `/lidr-spec-apply` and `/lidr-spec-verify`)

## Changelog

| Version | Date       | Author                 | Changes                                                                     |
| ------- | ---------- | ---------------------- | --------------------------------------------------------------------------- |
| 1.1.0   | 2026-06-09 | TL: lang+tool agnostic | Language to English-default-configurable; abstracted Jira via tool-registry |
