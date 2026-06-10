# Skills System

Source-of-truth for Agent Skills across 5 AI platforms. Skills follow the [Agent Skills](https://agentskills.io) open standard, supported by Claude Code, Cursor, Gemini CLI, GitHub Copilot, and Antigravity.

**Source:** `.agents/skills/<skill-name>/SKILL.md` — 113 skills (44 LIDR `lidr-*` + 69 BMad `bmad-*`).

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

## Same-name command + skill (collision resolution)

A command and a skill MAY intentionally share a name when the command is the **verb/orchestrator** and the skill is the **reusable engine** it delegates to (the `command → skill` pattern). Both would otherwise register under the same `/<name>` slash, causing ambiguous invocation.

**Rule:** the skill-engine declares `user-invocable: false`. The command owns `/<name>`; the skill is reached only by delegation (the command calls it) or by the model's auto-load — never from the `/` menu. This resolves the collision with one frontmatter line and **zero churn** (no rename of refs, `gate-evidence.yaml`, validators, or script paths).

Canonical example (the only collision in the ecosystem): command `lidr-validate-requirements` (Phase-3 orchestrator) + skill `lidr-validate-requirements` (RTM / 5-pass engine, `user-invocable: false`). Full rationale and the rejected rename option: `docs/adr/ADR-0007-command-skill-name-resolution.md`.

Do NOT introduce a new same-name pair without applying this flag. Prefer distinct names for genuinely independent artifacts; reserve the shared name for true verb↔engine pairs.

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

## Inventory (113 skills)

All artifacts inherited from the LIDR SDLC methodology are prefixed `lidr-*`;
BMad skills (base flow + agents + utilities) keep the `bmad-*` prefix. LIDR
wraps BMad outputs rather than duplicating them — see
`.agents/_shared/lidr/MIGRATION.md`.

### LIDR skills (44) — `lidr-*`

SDLC phases 0–4 (unified BMad numbering) plus the spec-lifecycle and the
meta-tooling skills. Run `ls .agents/skills/ | grep ^lidr-` for the live list,
or see the orchestrator AGENTS.md "LIDR SDLC Methodology" section for the
phase-by-phase mapping. Includes:

- **Meta-tooling (5):** `lidr-agents-architecture`, `lidr-command-development`,
  `lidr-hook-development`, `lidr-mcp-integration`, `lidr-generate-rule`
- **SDLC + spec-lifecycle (39):** `lidr-business-case`, `lidr-kickoff`,
  `lidr-stakeholder-map`, `lidr-risk-log`, `lidr-review-cruzado`,
  `lidr-generate-rf`, `lidr-generate-nfr`, `lidr-validate-requirements`,
  `lidr-user-stories`, `lidr-refinement-notes`, `lidr-sprint-capacity`,
  `lidr-adr`, `lidr-pr-description`, `lidr-tech-debt`, `lidr-dev-handoff-qa`,
  `lidr-using-git-worktrees`, `lidr-run-parallel-tasks`,
  `lidr-create-test-cases`, `lidr-bug-report`, `lidr-test-execution-report`,
  `lidr-vuln-assessment`, `lidr-dast-interpretation`, `lidr-pentest-report`,
  `lidr-security-checklist`, `lidr-change-request`, `lidr-rollback-plan`,
  `lidr-release-notes`, `lidr-postmortem`, `lidr-gate-evaluation`,
  `lidr-impact-analysis`, `lidr-audit-standards`, `lidr-commit-management`,
  `lidr-ticket-validation`, `lidr-tracking-integration`, `lidr-sdlc-tracking`,
  `lidr-external-sync`, `lidr-playwright-cli`, `lidr-propuesta-builder`,
  `lidr-help`

### BMad skills (69) — `bmad-*`

The full BMad set: base flow (`bmad-prd`, `bmad-create-architecture`,
`bmad-create-epics-and-stories`, `bmad-document-project`, `bmad-dev-story`,
`bmad-create-story`, `bmad-sprint-planning`, `bmad-retrospective`, …),
test-architecture (`bmad-testarch-*`, `bmad-tea`), creative/innovation
(`bmad-cis-*`, `bmad-brainstorming`), agent personas (`bmad-agent-*`), and
utilities (`bmad-spec`, `bmad-shard-doc`, `bmad-index-docs`, …). Run
`ls .agents/skills/ | grep ^bmad-` for the live list.

## Common pitfalls

| Symptom                                          | Cause                                                                       | Fix                                                                              |
| ------------------------------------------------ | --------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| Skill doesn't appear in Gemini                   | Missing `name:` or `description:`, or content before `---`                  | Add required fields; verify file starts with `---\n`                             |
| Claude lists name without desc                   | Description budget overflow                                                 | Trim descriptions; check `/doctor`; set `skillListingBudgetFraction`             |
| Skill ignored after first response               | Skill content is in context but model chose another approach                | Strengthen description; use hooks for hard enforcement                           |
| Duplicate skills in Copilot/Gemini               | Created `.github/skills/` or `.gemini/skills/` alongside `.agents/skills/`  | Remove the extra dir; `.agents/skills/` is the canonical path                    |
| `/<name>` ambiguous (command + skill share name) | Skill-engine still `user-invocable` while a command of the same name exists | Set `user-invocable: false` on the skill (see ADR-0007); command keeps the slash |

## Official references

- [Agent Skills open standard](https://agentskills.io)
- [Claude Code skills](https://code.claude.com/docs/en/skills)
- [Cursor agent skills](https://cursor.com/docs/context/skills) (Cursor 2.4+, Jan 2026)
- [Gemini CLI skills](https://geminicli.com/docs/cli/skills/)
- [VSCode Copilot agent skills](https://code.visualstudio.com/docs/copilot/customization/agent-skills)
- [GitHub Copilot agent skills](https://docs.github.com/en/copilot/concepts/agents/about-agent-skills)
