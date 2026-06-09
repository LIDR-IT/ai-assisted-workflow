# Commands System

Source-of-truth for user-invocable slash commands across 5 platforms.

**Source:** `.agents/commands/<name>.md` — 30 commands (17 LIDR `lidr-*` SDLC + 7 LIDR `lidr-spec-*` lifecycle + 6 generic). `lidr-help` is now a skill (still invocable as `/lidr-help`); `lidr-product-brief` removed (use `bmad-product-brief`).

Each platform calls the feature by a different name and expects a different file format. The adapter generates / symlinks per platform.

## Terminology and file layout per platform (verified May 2026)

| Platform           | Feature name                          | Path                                                                                                        | Format            | Frontmatter                                                                                                            |
| ------------------ | ------------------------------------- | ----------------------------------------------------------------------------------------------------------- | ----------------- | ---------------------------------------------------------------------------------------------------------------------- |
| **Claude Code**    | "Custom commands"                     | `.claude/commands/<name>.md`                                                                                | Markdown          | YAML (`description`, `allowed-tools`, `model`, `argument-hint`) — see [docs](https://code.claude.com/docs/en/commands) |
| **Cursor**         | "Custom slash commands" (Cursor 1.6+) | `.cursor/commands/<name>.md`                                                                                | Plain Markdown    | **None** — plain prompt text                                                                                           |
| **Gemini CLI**     | "Custom commands"                     | `.gemini/commands/<name>.toml`                                                                              | **TOML required** | TOML: `prompt` (required), `description` (optional) — see [docs](https://geminicli.com/docs/cli/custom-commands)       |
| **Antigravity**    | "Workflows"                           | `.agents/workflows/<name>.md` (workspace) <br/> `~/.gemini/antigravity/global_workflows/<name>.md` (global) | Markdown          | YAML with `description` — see [docs](https://codelabs.developers.google.com/getting-started-google-antigravity)        |
| **Copilot/VSCode** | "Prompt files"                        | `.github/prompts/<name>.prompt.md`                                                                          | Markdown          | YAML (`description`, `agent`)                                                                                          |

**Important Antigravity note:** Newer Google docs use `.agents/workflows/` (plural). Earlier Mete Atamel docs (Nov 2025) used `.agent/workflows/` (singular). The plural form aligns with the Agent Skills cross-platform standard and is current. Our adapter creates the plural symlink and cleans up the singular form if present.

## How sync.sh handles each platform

| Platform    | Method                                                                                                                             |
| ----------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| Claude      | Symlink `.claude/commands` → `../.agents/commands`                                                                                 |
| Cursor      | Symlink `.cursor/commands` → `../.agents/commands` (frontmatter visible in prompt — Cursor ignores YAML keys it doesn't recognize) |
| Gemini      | Generate `.gemini/commands/<name>.toml` from `.md` source                                                                          |
| Antigravity | Symlink `.agents/workflows` → `commands` (inside `.agents/`)                                                                       |
| Copilot     | Generate `.github/prompts/<name>.prompt.md` from `.md` source (`$ARGUMENTS` → `{{{ input }}}`)                                     |

## Source frontmatter (universal — what each platform uses)

```yaml
---
description: Brief description of the command          # All platforms — Cursor ignores
allowed-tools: Bash(git:*) Read Grep                   # Claude only — pre-approves tools
model: sonnet                                          # Claude only — override model
argument-hint: [arg1] [arg2]                           # Claude/Gemini autocomplete hint
agent: 'agent'                                         # Copilot adapter injects automatically
---

# Command body

Markdown content here. Use $ARGUMENTS for user input.
```

**Per-platform field handling:**

- **Claude:** reads all fields documented in [Claude Code commands docs](https://code.claude.com/docs/en/commands)
- **Cursor:** ignores frontmatter; uses body as prompt
- **Gemini:** adapter converts MD → TOML, mapping `description` and body → `prompt`. Other fields are dropped (not in Gemini schema)
- **Antigravity:** reads markdown body; `description` shown in `/` dropdown
- **Copilot:** adapter injects `agent: 'agent'` + maps `$ARGUMENTS` → `{{{ input }}}`

## Available commands (30)

### Generic (6)

- `/commit` — Conventional commit from staged changes
- `/create-ticket` — Structured ticket creation
- `/enrich-ticket` — Validate ticket completeness
- `/improve-docs` — Documentation audit + improvement
- `/sync-setup` — Run `./.agents/sync.sh`
- `/test-hooks` — Test cross-platform hooks

### LIDR SDLC (17 — partial listing)

`lidr-advance-gate`, `lidr-course-correct`, `lidr-create-branch`, `lidr-create-pr`, `lidr-create-release-notes`, `lidr-implement-ticket`, `lidr-init-project-docs`, `lidr-prepare-testing`, `lidr-quick-dev`, `lidr-quick-spec`, `lidr-sprint-health`, `lidr-sync-docs`, `lidr-track-sdlc`, `lidr-update-changelog`, `lidr-validate-prd`, `lidr-validate-project-docs`, `lidr-validate-requirements`

> `/lidr-help` moved to a skill (`.agents/skills/lidr-help/`) — still invocable as `/lidr-help`. `lidr-product-brief` was removed; use the `bmad-product-brief` skill.

See `.agents/rules/lidr-sdlc/workflows.md` for the role × command matrix.

## Add a new command

```bash
# 1. Write the command source
cat > .agents/commands/my-command.md <<'EOF'
---
description: What this command does
allowed-tools: Bash(npm:*) Read
argument-hint: [option]
---

# My Command

Step 1: do X with $ARGUMENTS
Step 2: do Y
EOF

# 2. Sync (symlinks for Claude/Cursor/Antigravity, generates TOML for Gemini, .prompt.md for Copilot)
./.agents/sync.sh --only=commands

# 3. Verify
ls .claude/commands/my-command.md            # symlink resolves
cat .gemini/commands/my-command.toml          # TOML generated
cat .github/prompts/my-command.prompt.md      # prompt.md generated
ls .agents/workflows/my-command.md            # Antigravity reads via the symlink
```

## Command → Agent → Skill pattern

Commands are thin invocation wrappers. They typically delegate to a more detailed unit:

```
User types /improve-docs docs/guides
   ↓
Command (.agents/commands/improve-docs.md) — orchestrator with frontmatter
   ↓
Subagent (.agents/subagents/doc-improver.md) — autonomous workflow
   ↓
Skill (.agents/skills/lidr-audit-standards/SKILL.md) — domain expertise
   ↓
Rule (.agents/rules/process/documentation.md) — standards
```

Use a command when the user invokes by name. Use a skill when behavior should be loaded automatically based on context. See `.agents/skills-readme.md` for the command-vs-skill decision.

## Common pitfalls

| Symptom                                      | Cause                                     | Fix                                                                                |
| -------------------------------------------- | ----------------------------------------- | ---------------------------------------------------------------------------------- |
| Cursor shows YAML frontmatter as prompt text | Cursor expects plain markdown             | Tolerable; the prompt still works. Optionally strip in adapter.                    |
| Gemini command not appearing                 | TOML missing `prompt` field               | Verify `.gemini/commands/<name>.toml` exists and contains `prompt = """..."""`     |
| Antigravity workflow not appearing           | Wrong directory (`.agent/` vs `.agents/`) | Verify `.agents/workflows/` (plural) exists and contains the symlink               |
| Copilot prompt missing `agent:` field        | Source omitted it                         | Adapter auto-injects `agent: 'agent'` — re-run `./.agents/sync.sh --only=commands` |
| `$ARGUMENTS` shown literally in Copilot      | `$ARGUMENTS` not converted                | Adapter converts to `{{{ input }}}` automatically                                  |

## Official references

- [Claude Code commands](https://code.claude.com/docs/en/commands)
- [Cursor commands (1.6+)](https://cursor.com/docs/agent/chat/commands) — note: docs page mostly redirects to Skills; commands work as plain .md
- [Gemini CLI custom commands](https://geminicli.com/docs/cli/custom-commands)
- [Antigravity workflows (Google Codelabs)](https://codelabs.developers.google.com/getting-started-google-antigravity)
- [VSCode Copilot prompt files](https://code.visualstudio.com/docs/copilot/customization/prompt-files)
