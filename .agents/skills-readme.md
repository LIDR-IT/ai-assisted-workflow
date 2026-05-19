# Skills System

Source-of-truth for Agent Skills across 5 AI platforms. Skills follow the [Agent Skills](https://agentskills.io) open standard, supported by Claude Code, Cursor, Gemini CLI, GitHub Copilot, and Antigravity.

**Source:** `.agents/skills/<skill-name>/SKILL.md` — 67 skills (62 LIDR SDLC + 5 generic meta-skills).

## How each platform discovers skills (verified against official docs, May 2026)

| Platform        | Path read                                                   | Method                         | Doc reference                                                                                    |
| --------------- | ----------------------------------------------------------- | ------------------------------ | ------------------------------------------------------------------------------------------------ |
| **Claude Code** | `.claude/skills/<name>/SKILL.md`                            | Symlink → `.agents/skills/`    | [docs](https://code.claude.com/docs/en/skills)                                                   |
| **Cursor**      | `.cursor/skills/<name>/SKILL.md`                            | Symlink → `.agents/skills/`    | Cursor 2.4+ (Jan 2026)                                                                           |
| **Gemini CLI**  | `.agents/skills/` (alias of `.gemini/skills/`)              | Native — official alias        | [docs](https://geminicli.com/docs/cli/skills/) — "alias takes precedence over `.gemini/skills/`" |
| **Copilot**     | `.agents/skills/` (or `.github/skills/`, `.claude/skills/`) | Native — all 3 paths supported | [docs](https://code.visualstudio.com/docs/copilot/customization/agent-skills)                    |
| **Antigravity** | `.agents/skills/`                                           | Native                         | Same Agent Skills standard                                                                       |

**Why this is optimal:** Claude/Cursor look in their own directories so we symlink; the other 3 read `.agents/skills/` natively per the open standard, so creating `.gemini/skills/` or `.github/skills/` would cause **duplicate skill detection**.

## Required SKILL.md frontmatter

Verified required fields per platform docs:

| Field         | Required by                                                 | Notes                                                                                |
| ------------- | ----------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| `name`        | Gemini (silent skip if absent), Copilot                     | Lowercase + hyphens, max 64 chars (Claude). Must match directory name (recommended). |
| `description` | All platforms (Claude recommended, Gemini/Copilot required) | Drives auto-invocation. Capped at 1,536 chars in Claude's listing (rendered string). |

Both must appear in YAML frontmatter delimited by `---` at the very start of `SKILL.md`. Per Gemini docs: _"A SKILL.md is silently skipped if either field is missing, if the delimiters are absent, or if any text appears before the opening `---`."_

## Claude-specific optional frontmatter (ignored by other platforms)

| Field                      | Purpose                                                               |
| -------------------------- | --------------------------------------------------------------------- |
| `disable-model-invocation` | `true` = only user can invoke via `/skill-name`. Default `false`.     |
| `user-invocable`           | `false` = hidden from `/` menu; only Claude can load. Default `true`. |
| `allowed-tools`            | Pre-approved tools when this skill is active                          |
| `model`                    | Override session model when skill is active                           |
| `effort`                   | Override effort level (`low`/`medium`/`high`/`xhigh`/`max`)           |
| `context: fork`            | Run skill in forked subagent context                                  |
| `agent`                    | Subagent type to use with `context: fork`                             |
| `paths`                    | Glob patterns to scope auto-loading                                   |
| `arguments`                | Named positional arguments for `$name` substitution                   |

Full reference: https://code.claude.com/docs/en/skills

## Progressive disclosure pattern

Skills can bundle supporting files that load only when needed:

```text
.agents/skills/<name>/
├── SKILL.md              # ← Required, always loaded when skill is invoked
├── references/           # ← On-demand: deep documentation
├── examples/             # ← On-demand: usage samples
├── assets/               # ← On-demand: templates
└── scripts/              # ← Executable utilities (run via Bash from skill)
```

Per Claude docs: _"Keep SKILL.md under 500 lines. Move detailed reference material to separate files."_

## Quick start

### Add a new skill

```bash
mkdir -p .agents/skills/my-skill
cat > .agents/skills/my-skill/SKILL.md <<'EOF'
---
name: my-skill
description: This skill should be used when the user asks to "trigger phrase 1", "trigger phrase 2". Brief context about what it provides.
---

# My Skill

Instructions here...
EOF

# Sync (creates symlinks for Claude/Cursor; Gemini/Copilot/Antigravity read .agents/ natively)
./.agents/sync.sh --only=skills
```

### Verify per platform

```bash
ls -la .claude/skills              # Should: symlink → ../.agents/skills
ls -la .cursor/skills              # Should: symlink → ../.agents/skills
ls .agents/skills/my-skill/        # Gemini, Copilot, Antigravity read here natively
```

### Invoke

- **Auto (description-driven):** describe the trigger naturally in chat
- **Manual:** `/my-skill` (works in all platforms if `user-invocable` is true)

## Description best practices

Per Claude docs and Gemini docs (both rely on description for auto-invocation):

- **Third-person, declarative:** "This skill should be used when..."
- **List trigger phrases in quotes:** specific phrases the user is likely to say
- **Lead with the use case:** the first chunk is the most likely to survive listing truncation
- **Keep under 1,000 chars when possible** (Claude cap is 1,536 for combined `description` + `when_to_use`)

Anti-patterns:

- "Create skills" (too vague — no trigger phrases)
- "I help with X" (first person — doesn't match how Claude/Gemini reason about skills)
- Multi-paragraph descriptions (most chars never reach Claude's listing budget)

## Inventory (66 skills)

### Generic meta-skills (4)

- `agents-architecture`, `command-development`, `commit-management`, `ticket-validation`

### LIDR SDLC skills (62)

Organized by SDLC phase, all prefixed `lidr-*`. Run `ls .agents/skills/ | grep ^lidr-` for the full list, or see the orchestrator AGENTS.md "LIDR SDLC Methodology" section for phase-by-phase mapping.

## Common pitfalls

| Symptom                            | Cause                                                                      | Fix                                                                  |
| ---------------------------------- | -------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| Skill doesn't appear in Gemini     | Missing `name:` or `description:`, or content before `---`                 | Add required fields; verify file starts with `---\n`                 |
| Claude lists name without desc     | Description budget overflow                                                | Trim descriptions; check `/doctor`; set `skillListingBudgetFraction` |
| Skill ignored after first response | Skill content is in context but model chose another approach               | Strengthen description; use hooks for hard enforcement               |
| Duplicate skills in Copilot/Gemini | Created `.github/skills/` or `.gemini/skills/` alongside `.agents/skills/` | Remove the extra dir; `.agents/skills/` is the canonical path        |

## Official references

- [Agent Skills open standard](https://agentskills.io)
- [Claude Code skills](https://code.claude.com/docs/en/skills)
- [Cursor agent skills](https://cursor.com/docs/context/skills) (Cursor 2.4+, Jan 2026)
- [Gemini CLI skills](https://geminicli.com/docs/cli/skills/)
- [VSCode Copilot agent skills](https://code.visualstudio.com/docs/copilot/customization/agent-skills)
- [GitHub Copilot agent skills](https://docs.github.com/en/copilot/concepts/agents/about-agent-skills)
