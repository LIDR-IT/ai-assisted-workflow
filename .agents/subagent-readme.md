# Subagents System

Source-of-truth for autonomous subagents across 4 of 5 platforms (Antigravity does not support subagents).

**Source:** `.agents/subagents/<name>.md` — 23 subagents (10 LIDR `lidr-*` + 13 BMad `bmad-*-agent`).

## Terminology and paths per platform (verified May 2026)

| Platform           | Feature name           | Project path                     | File format               | Method                            |
| ------------------ | ---------------------- | -------------------------------- | ------------------------- | --------------------------------- |
| **Claude Code**    | "Subagents"            | `.claude/agents/<name>.md`       | MD + YAML                 | Symlink → `.agents/subagents/`    |
| **Cursor**         | "Subagents" (2.4+)     | `.cursor/agents/<name>.md`       | MD + YAML                 | Symlink → `.agents/subagents/`    |
| **Gemini CLI**     | "Subagents" (Apr 2026) | `.gemini/agents/<name>.md`       | MD + YAML                 | Symlink → `.agents/subagents/`    |
| **Copilot/VSCode** | "Custom agents"        | `.github/agents/<name>.agent.md` | MD + YAML (max 30KB body) | Copy + rename `.md` → `.agent.md` |
| **Antigravity**    | — (not supported)      | n/a                              | n/a                       | n/a                               |

**No alias for subagents.** Unlike skills (where `.agents/skills/` is a Gemini alias) or rules, the official Gemini docs do NOT recognize `.agents/subagents/` as an alias for `.gemini/agents/`. Each platform requires its own path → we use symlinks.

## Required frontmatter

Universal minimum (verified across all platforms):

```yaml
---
name: agent-name # lowercase + hyphens; should match filename
description: When to invoke this agent (triggers auto-delegation)
model: inherit # optional — Claude/Cursor; Gemini also supports
tools: # optional — restrict tool access
  - Read
  - Grep
---
# Agent system prompt body (markdown)
```

**Per-platform field details:**

- **Claude:** `name`, `description`, `model`, `tools` — see [docs](https://code.claude.com/docs/en/sub-agents)
- **Cursor:** `name` (required), `description`, `model`, `readonly`, `is_background` — see [docs](https://cursor.com/docs/agent/subagents)
- **Gemini:** `name` (required), `description` (required), `tools`, `model`, `temperature`, `max_turns`, `timeout_mins` — see [docs](https://geminicli.com/docs/core/subagents/)
- **Copilot:** `name`, `description`, `model`, `tools` (e.g. `web/fetch`, `search/codebase`); adapter auto-injects `tools: [codebase, editFiles, terminalLastCommand]` if absent — see [docs](https://code.visualstudio.com/docs/copilot/customization/custom-agents)

## Invocation per platform

| Platform | Auto-delegation         | Manual invocation                        |
| -------- | ----------------------- | ---------------------------------------- |
| Claude   | ✅ (description-driven) | Via Task tool or `/agents` menu          |
| Cursor   | ✅                      | `/agent-name` or "Use the X subagent..." |
| Gemini   | ✅                      | `@agent-name` prefix                     |
| Copilot  | ✅                      | Selected from agent picker in chat UI    |

## Available subagents (23)

### LIDR (10) — `lidr-*`

- `lidr-doc-improver` — Audit and improve documentation
- `lidr-docs-agent` — Documentation maintenance
- `lidr-metrics-agent` — Sprint + DORA metrics collection
- `lidr-onboarding-agent` — New team-member onboarding
- `lidr-pr-validator` — Validate PRs against standards before opening
- `lidr-qa-agent` — Testing suite preparation
- `lidr-release-agent` — Release notes + change requests
- `lidr-security-agent` — Vulnerability triage + remediation tickets
- `lidr-spec-orchestrator` — End-to-end LIDR Spec Lifecycle (new → ff → apply → verify → archive)
- `lidr-ticket-enricher` — Enrich tickets with missing details

### BMad (13) — `bmad-*-agent` (file suffix `.agent.md`)

Agent personas from the BMad module:

- `bmad-agent-analyst`, `bmad-agent-architect`, `bmad-agent-dev`, `bmad-agent-pm`, `bmad-agent-tech-writer`, `bmad-agent-ux-designer`, `bmad-tea`
- Creative/innovation (`cis`): `bmad-cis-agent-brainstorming-coach`, `bmad-cis-agent-creative-problem-solver`, `bmad-cis-agent-design-thinking-coach`, `bmad-cis-agent-innovation-strategist`, `bmad-cis-agent-presentation-master`, `bmad-cis-agent-storyteller`

> The ex-generic subagents (`doc-improver`, `pr-validator`, `ticket-enricher`) were renamed with the `lidr-` prefix.

## Add a new subagent

```bash
# 1. Write source
cat > .agents/subagents/my-agent.md <<'EOF'
---
name: my-agent
description: Use when the user asks to "trigger phrase 1", "trigger phrase 2".
tools:
  - Read
  - Grep
model: inherit
---

You are a specialized agent for ...
EOF

# 2. Sync (creates symlinks for Claude/Cursor/Gemini; copies to Copilot)
./.agents/sync.sh --only=agents

# 3. Verify
ls -la .claude/agents/my-agent.md       # symlink resolves
ls -la .cursor/agents/my-agent.md       # symlink resolves
ls -la .gemini/agents/my-agent.md       # symlink resolves
ls .github/agents/my-agent.agent.md     # copy with .agent.md suffix
```

## Common pitfalls

| Symptom                              | Cause                                                  | Fix                                                |
| ------------------------------------ | ------------------------------------------------------ | -------------------------------------------------- |
| Gemini doesn't see the subagent      | Missing `.gemini/agents/` symlink (pre-Apr-2026 setup) | Run `./.agents/sync.sh --only=agents`              |
| Copilot agent body truncated         | Body over 30KB cap                                     | Shorten or split into multiple agents              |
| `@name` doesn't match expected agent | Frontmatter `name:` differs from filename              | Align `name:` to filename (predictable invocation) |
| Antigravity user asks for subagent   | Antigravity has no subagent concept                    | Use a workflow (`.agents/workflows/`) instead      |
| Cursor invocation fails              | `name:` missing or has uppercase/spaces                | Use lowercase + hyphens only                       |

## Official references

- [Claude Code subagents](https://code.claude.com/docs/en/sub-agents)
- [Cursor subagents (2.4+)](https://cursor.com/docs/agent/subagents)
- [Gemini CLI subagents (Apr 2026)](https://geminicli.com/docs/core/subagents/)
- [VSCode Copilot custom agents](https://code.visualstudio.com/docs/copilot/customization/custom-agents)
- [GitHub Copilot custom agents (cloud)](https://docs.github.com/en/copilot/concepts/agents/cloud-agent/about-custom-agents)
