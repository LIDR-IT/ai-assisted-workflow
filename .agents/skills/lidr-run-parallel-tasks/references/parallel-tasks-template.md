# parallel-tasks.md — Template

> Save this file as `parallel-tasks.md` in the project root, fill in one or more `### Task` blocks, then invoke the `lidr-run-parallel-tasks` skill ("run parallel-tasks.md").
>
> Each task block becomes one sub-agent running the full LIDR change lifecycle in its own git worktree.
> Comment out (`<!-- ... -->`) any task block you want to skip on a given run.

## How to fill a task block

```
### Task: <human-readable-title>

- name: <kebab-case-change-name>   (required, used for worktree and change folder)
- us: inline | <file-path> | <TICKET-ID>   (required, source of the user story; <TICKET-ID> is a {{TRACKING_TOOL}} ticket reference)
- description: <multi-line US text>   (required only when us: inline)
```

Examples:

### Task: Add item soft-delete

- name: item-soft-delete
- us: inline
- description: |
  As an admin, I want to soft-delete catalog items so deleted items can be restored
  within 30 days. Items should be hidden from list/search endpoints but remain in
  the database. Admins need a "restore" action and a "purge after 30 days" job.

### Task: Implement fulltext search on items

- name: item-search-fulltext
- us: PROJ-456

### Task: Migrate user table to UUID primary key

- name: users-uuid-migration
- us: docs/projects/example-client/user-stories/uuid-migration.md

<!--
### Task: Skipped example

- name: skipped-feature
- us: inline
- description: |
    This task is wrapped in HTML comments and will be skipped by the skill.
-->

## Pipeline executed per task

```
1. lidr-using-git-worktrees      → creates .worktrees/<name>/
2. enrich-ticket (LIDR)          → enriches the US with technical detail
3. /lidr-spec-new <name>         → scaffolds docs/projects/<client>/changes/<name>/
4. /lidr-spec-ff <name>          → generates proposal.md, design.md, tasks.md, spec.md
5. /lidr-spec-apply <name>       → implements every task in tasks.md
6. /lidr-spec-verify <name>      → runs unit + curl + Playwright + docs drift, writes test-report.md
7. STOP                          → no archive, no commit, no worktree cleanup
```

The user inspects each worktree after the skill completes and decides whether to archive, commit, push, or discard.

## Concurrency guardrails

- Default max parallel: 5 sub-agents
- Higher concurrency: ask the user explicitly (LLM budget)
- Each sub-agent runs Opus high reasoning per `lidr-sdlc/model-selection.md`
