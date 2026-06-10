# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

**Note:** This file is the single orchestrator for all AI agents. Root-level files (`CLAUDE.md`, `GEMINI.md`, `AGENTS.md`) are symlinks to this orchestrator file. Each platform reads from its preferred file:

- **Claude Code:** Read `CLAUDE.md`
- **Cursor:** Read `CLAUDE.md` + `AGENTS.md`
- **Gemini CLI / Antigravity:** Read `GEMINI.md` (shared, no duplicates)
- **Copilot (VSCode):** Reads `CLAUDE.md` + `AGENTS.md` + `copilot-instructions.md` — no separate orchestrator needed

---

## What This Repository Is

This is **lidr-ecosystem** — a unified monorepo that merges (2026-05-18):

1. **LIDR SDLC Methodology** — a complete software development lifecycle
   framework with 62 specialized skills (one per SDLC artifact), 23
   orchestrator commands, 5 governance rules, 6 autonomous agents.
   Authored by LIDR Consultorias for multi-client SDLC implementation.
2. **ai-assisted-workflow** — a source-of-truth pattern (`.agents/`) with
   automated synchronization to 5 AI platforms (Cursor, Claude Code, Gemini
   CLI, Antigravity, GitHub Copilot).
3. **React documentation app** (`app/`) — interactive visualization of the
   LIDR SDLC Methodology with multi-client support (FacePhi, Docline, Aramis,
   base template) using React Flow + React Router v7.

**Core Architecture:** Source-of-truth pattern with automated synchronization

- Edit once in `.agents/` → automatically synced to all 5 platforms
- **24 rules** in 10 categories (7 LIDR SDLC + 17 generic) — new in this version: `spec-execution.md` and `model-selection.md` for the LIDR Spec Lifecycle
- **113 skills** (44 LIDR `lidr-*` — SDLC + spec-lifecycle + meta-tooling — + 69 BMAD `bmad-*`) — new in this version: `lidr-impact-analysis` (contract impact + variant compatibility against client-maintained registries; closes the PP-05/PP-06-class capability gaps), `lidr-help` (ecosystem-guide skill, ex-command; mirrors `bmad-help` with the LIDR SDLC governance layer on top), `lidr-using-git-worktrees`, `lidr-run-parallel-tasks`, plus 5 ex-`claude-*` meta-skills renamed to `lidr-*` (agents-architecture, command-development, generate-rule, hook-development, mcp-integration). Follow [Agent Skills](https://agentskills.io) open standard
- **30 commands** (21 LIDR `lidr-*` SDLC + 7 LIDR `lidr-spec-*` lifecycle + 2 generic: `sync-setup`, `test-hooks`) — the 7 `lidr-spec-*` change-lifecycle commands (`new`, `ff`, `apply`, `verify`, `archive`, `continue`, `bulk-archive`); `lidr-help` converted to a skill (still invocable as `/lidr-help`), `lidr-product-brief` removed (BMAD `bmad-product-brief` covers it); `document-project` and `check-readiness` removed (BMAD `bmad-document-project` + `bmad-check-implementation-readiness` cover them; readiness now lives in Gate 3)
- **23 subagents** (10 LIDR `lidr-*` + 13 BMAD `bmad-*-agent`) — new: `lidr-spec-orchestrator` for end-to-end change execution
- **6 hooks** (3 LIDR + 3 generic, registered in `.agents/hooks/hooks.json`)
- **Declarative context manifest**: `.agents/context-manifest.yaml` enumerates docs loaded at SessionStart (replaces hard-coded paths in `lidr-load-context` hook)
- MCP integration (Context7)
- Git hooks via husky at repo root (pre-commit, commit-msg, pre-push)
- React app in `app/` with Playwright validation

**Naming convention:** all artifacts inherited from the LIDR SDLC methodology
are prefixed with `lidr-` (skills, commands, subagents, hooks; rules live in
`lidr-sdlc/` subdirectory). Generic artifacts have no prefix.

**Pre-merge originals** live outside this repo (git history covers everything
that was deleted from `.agents/` during the merge):

- `../LIDR - AI powered workflow 2026/` — original LIDR repo
- `../ai-assisted-workflow/` — original template

---

## Essential Commands

### Development Workflow (root)

```bash
# Documentation site lives in app/ (React + Vite). See "React App (in app/)" below.

# Linting and Formatting (top-level files)
npm run format            # Format all files with Prettier
npm run format:check      # Check formatting without changes
```

### React App (in app/)

```bash
cd app
npm install               # Install app dependencies (once)
npm run dev               # Vite dev server (http://localhost:5173)
npm run build             # Production build
npm run test              # Vitest unit tests
npm run validate:coherence    # LIDR coherence checks
npm run client:list           # List registered clients (base, docline, facephi, aramis)
node scripts/multi-client-smoke.mjs    # Playwright smoke test: 4 clients × 14 routes
```

### Git Hooks (Husky at root, not in app/)

The unified repo has ONE git directory at root. `app/.husky/` was archived as
inert. Active hooks:

- **pre-commit**: sensitive-file guard + root lint-staged + app lint-staged
  (when app/ files are staged)
- **commit-msg**: validates conventional commits via `app/commitlint.config.js`
- **pre-push**: enforces branch naming convention

### Synchronization (Critical)

```bash
# Master sync - Run after ANY change in .agents/
./.agents/sync.sh

# Individual component syncs
./.agents/sync.sh --only=rules        # Rules only
./.agents/sync.sh --only=mcp          # MCP configurations only
./.agents/sync.sh --only=hooks        # Git hooks only

# Platform-specific sync
./.agents/sync.sh --platform=copilot            # Copilot only
./.agents/sync.sh --platform=cursor,claude       # Multiple platforms

# Combined
./.agents/sync.sh --platform=copilot --only=rules,mcp

# Dry run (preview changes)
./.agents/sync.sh --dry-run
./.agents/sync.sh --only=rules --dry-run
```

### Verification

```bash
# Verify symlinks point correctly
readlink .cursor/rules    # Should: ../.agents/rules
readlink .claude/rules    # Should: ../.agents/rules
ls -la .cursor/skills     # Should show: lrwxr-xr-x (symlink)

# Validate generated configs (Claude MCP lives at repo root .mcp.json, NOT .claude/mcp.json)
jq . .cursor/mcp.json
jq . .mcp.json
jq .servers .vscode/mcp.json
jq empty .agents/mcp/mcp-servers.json  # Validate source JSON

# Check hooks configuration
jq .hooks .claude/settings.json
jq . .github/hooks/hooks.json
ls -la .claude/hooks/

# Copilot-specific verification (official path is .github/instructions/, NOT .github/rules/)
ls .github/instructions/*.instructions.md
ls .github/prompts/*.prompt.md
ls .github/agents/*.agent.md
```

---

## Architecture Overview

### The Source-of-Truth Pattern

```
.agents/                      # ← SINGLE SOURCE OF TRUTH
├── rules/                    # 24 rules (7 LIDR SDLC + 17 generic)
│   ├── lidr-sdlc/            # ← LIDR: org, project, tech-stack, workflows, documentation, spec-execution, model-selection
│   ├── code/                 # principles.md, style.md
│   ├── content/              # copywriting.md
│   ├── design/               # web-design.md (800+ line accessibility)
│   ├── frameworks/           # react-native.md
│   ├── process/              # git-workflow.md, documentation.md
│   ├── product/, quality/, team/, tools/
│
├── skills/                   # 113 skills (44 lidr-* + 69 bmad-*) — Agent Skills open standard
│   ├── lidr-business-case/   # ← Unified Phase 1: Analysis
│   ├── lidr-generate-rf/     # ← Unified Phase 3: Solutioning/specification
│   ├── lidr-user-stories/    # ← Unified Phase 3: Solutioning/sprint-planning
│   ├── lidr-adr/             # ← Unified Phase 4: Implementation/development
│   ├── lidr-impact-analysis/ # ← Unified Phase 4: contract/variant impact vs client registries (G2/G4)
│   ├── lidr-using-git-worktrees/   # ← Unified Phase 4: dev parallel work
│   ├── lidr-run-parallel-tasks/    # ← Unified Phase 4: orchestrated parallelism
│   ├── lidr-test-execution-report/ # ← Unified Phase 4: Implementation/qa
│   ├── lidr-security-checklist/    # ← Unified Phase 4: Implementation/security
│   ├── lidr-release-notes/   # ← Unified Phase 4: Implementation/release
│   ├── lidr-agents-architecture/   # LIDR meta-skill (skill+command+agent scaffolding)
│   ├── lidr-command-development/   # LIDR meta-skill (command authoring)
│   ├── lidr-hook-development/      # LIDR meta-skill (hook authoring)
│   ├── lidr-mcp-integration/       # LIDR meta-skill (MCP server integration)
│   ├── lidr-generate-rule/         # LIDR meta-skill (rule generation)
│   ├── bmad-prd/, bmad-create-architecture/, ... # ← 69 BMAD skills (base flow + agents + utilities)
│   └── ...                   # See `ls .agents/skills/` for full list
│
├── commands/                 # 30 commands (28 LIDR `lidr-*` — 21 SDLC + 7 spec-lifecycle — + 2 generic)
│   ├── lidr-advance-gate.md  # ← LIDR orchestrator: gate evaluation + handoff
│   ├── lidr-implement-ticket.md    # ← LIDR: dev workflow
│   ├── lidr-prepare-testing.md     # ← LIDR: QA workflow
│   ├── lidr-spec-new.md            # ← LIDR Spec Lifecycle: create change container
│   ├── lidr-spec-ff.md             # ← LIDR Spec Lifecycle: fast-forward planning (Opus high)
│   ├── lidr-spec-apply.md          # ← LIDR Spec Lifecycle: implement tasks
│   ├── lidr-spec-verify.md         # ← LIDR Spec Lifecycle: final verification
│   ├── lidr-spec-archive.md        # ← LIDR Spec Lifecycle: archive change
│   ├── lidr-spec-continue.md       # ← LIDR Spec Lifecycle: resume paused change
│   ├── lidr-spec-bulk-archive.md   # ← LIDR Spec Lifecycle: bulk archive
│   ├── sync-setup.md         # Generic (lidr-help is now a skill, still /lidr-help)
│   ├── test-hooks.md         # Generic
│   └── ...
│
├── subagents/                # 23 subagents (10 LIDR `lidr-*` + 13 BMAD `bmad-*-agent`)
│   ├── lidr-qa-agent.md      # ← LIDR: QA automation
│   ├── lidr-security-agent.md
│   ├── lidr-release-agent.md
│   ├── lidr-onboarding-agent.md
│   ├── lidr-docs-agent.md
│   ├── lidr-metrics-agent.md
│   ├── lidr-doc-improver.md
│   ├── lidr-pr-validator.md
│   ├── lidr-ticket-enricher.md
│   ├── lidr-spec-orchestrator.md   # ← LIDR Spec Lifecycle: end-to-end orchestrator
│   ├── bmad-agent-analyst.agent.md, ... # ← 13 BMAD subagents
│   └── ...
│
├── mcp/                      # MCP server configs
│   └── mcp-servers.json      # ← Source (universal format)
│
├── hooks/                    # Git workflow automation
│   ├── hooks.json            # ← Source (6 hooks across 5 events: PreToolUse, PostToolUse, Notification, SessionStart, Stop)
│   └── scripts/              # ALL hook scripts live here:
│                             #   generic: notify.sh, auto-format.sh, protect-secrets.sh
│                             #   LIDR (Claude-only): frontmatter-guard.sh,
│                             #   load-context.sh, validate-ecosystem-counts.sh
│
├── _shared/lidr/             # ← LIDR shared validators (BDD, AC, coherence)
├── memory/lidr/              # ← LIDR persistent memory (docs-agent)
│
├── orchestrator/             # Orchestrator docs
│   └── AGENTS.md             # ← This file
│
├── platforms.json            # Platform registry (capabilities)
├── lib/                      # Shared libraries (DRY)
│   ├── core.sh               # Logging, colors, validation
│   ├── symlink.sh            # Symlink management
│   ├── frontmatter.sh        # YAML frontmatter parsing
│   └── registry.sh           # Platform registry queries
│
├── adapters/                 # Platform adapters (Open/Closed)
│   ├── cursor.sh             # Cursor transformations
│   ├── claude.sh             # Claude Code transformations
│   ├── gemini.sh             # Gemini CLI transformations
│   ├── copilot.sh            # Copilot/VSCode transformations
│   └── antigravity.sh        # Antigravity transformations
│
├── sync/                     # Component orchestrators (SRP)
│   ├── orchestrator.sh       # Root symlinks
│   ├── rules.sh              # Rules dispatch
│   ├── skills.sh             # Skills dispatch
│   ├── commands.sh           # Commands dispatch
│   ├── agents.sh             # Agents dispatch
│   ├── mcp.sh                # MCP dispatch
│   └── hooks.sh              # Hooks dispatch
│
└── sync.sh                   # ← Unified CLI entry point
```

### Synchronization Strategies by Component

**1. Symlinks (Instant Propagation)**

- **Used for:** Skills, Commands, Subagents, Orchestrator docs
- **How:** `ln -s ../.agents/skills .cursor/skills`
- **Why:** Zero duplication, instant updates, filesystem-native
- **Note:** Gemini CLI, Copilot, and Antigravity read `.agents/skills/` natively per [Agent Skills open standard](https://agentskills.io). Gemini docs: _"`.agents/skills/` alias takes precedence over `.gemini/skills/`"_. Copilot docs list `.agents/skills/` as one of 3 supported project paths (`.github/skills/`, `.claude/skills/`, `.agents/skills/`). Symlinks not needed for these platforms.

**2. Symlinks + Copy (Rules - Hybrid)**

- **Symlink:** Claude Code (supports nested structure)
- **Native:** Antigravity (reads `.agents/rules/` directly)
- **Copy:** Cursor (supports `.md` and `.mdc`; subdirectories allowed per [docs](https://cursor.com/docs/context/rules). Adapter flattens for simplicity but isn't required.)
- **Copy:** Copilot (location is `.github/instructions/` per [VSCode docs](https://code.visualstudio.com/docs/copilot/customization/custom-instructions); files must end in `.instructions.md`; recursive subdirectories supported)
- **Generated Index:** Gemini CLI (single `GEMINI.md` context file per [Gemini CLI docs](https://geminicli.com/docs/cli/gemini-md/); no rules directory pattern), Copilot (`copilot-instructions.md` always-on)

**3. Script Generation (MCP, Hooks)**

- **Why:** Each platform requires different JSON structure
- **Process:** Universal source → platform-specific JSONs
- **Commit:** Both source AND generated files

**4. Conversion (Gemini Commands, Copilot Prompts/Agents)**

- **Process:** `.md` → `.toml` (Gemini requirement)
- **Process:** `.md` → `.prompt.md` (Copilot commands)
- **Process:** `.md` → `.agent.md` (Copilot agents)
- **Auto-converts:** Every sync run

### Platform Support Matrix

| Component | Cursor                | Claude Code  | Gemini CLI                                | Antigravity                                   | **Copilot (VSCode)**                            |
| --------- | --------------------- | ------------ | ----------------------------------------- | --------------------------------------------- | ----------------------------------------------- |
| Rules     | ✅ Copy (.mdc)        | ✅ Symlink   | ❌ Index only                             | ✅ Native                                     | ✅ Copy (.instructions.md) + Index              |
| Skills    | ✅ Symlink            | ✅ Symlink   | ✅ Native                                 | ✅ Native                                     | ✅ Native                                       |
| Commands  | ✅ Symlink            | ✅ Symlink   | ✅ Gen (.toml)                            | ✅ "Workflows" — `.agents/workflows/` symlink | ✅ Copy (.prompt.md) → `.github/prompts/`       |
| Subagents | ✅ Symlink            | ✅ Symlink   | ✅ Symlink → `.gemini/agents/` (Apr 2026) | ❌ Not supported                              | ✅ Copy `.github/agents/<name>.agent.md`        |
| MCP       | ✅ Generated          | ✅ Generated | ✅ Generated                              | ❌ Global only                                | ✅ Generated (.vscode/)                         |
| Hooks     | ✅ Partial (no Notif) | ✅ Full      | ✅ Full                                   | ❌ Global only                                | ✅ Partial (no Notification)                    |
| Memory    | CLAUDE.md             | CLAUDE.md    | GEMINI.md                                 | GEMINI.md                                     | CLAUDE.md + AGENTS.md + copilot-instructions.md |

**Orchestrator Strategy (no duplicates):**

All three root files (`CLAUDE.md`, `GEMINI.md`, `AGENTS.md`) are **symlinks to the same file** (`.agents/orchestrator/AGENTS.md`). Each platform reads its preferred file:

- **Cursor / Claude Code** → `CLAUDE.md`
- **Gemini CLI / Antigravity** → `GEMINI.md` (both share the same file, no duplicates)
- **Copilot (VSCode)** → `CLAUDE.md` + `AGENTS.md` + `.github/copilot-instructions.md` (auto-generated index). No separate `COPILOT.md` needed.

**Verified limitations (against official docs, May 2026):**

- **Cursor:** Per [docs](https://cursor.com/docs/context/rules), schema fields are `description`, `alwaysApply`, `globs` (all optional, none required). Both `.md` and `.mdc` extensions supported. Subdirectories allowed. The `name` field is non-standard (harmlessly ignored). Recommendation: keep rules <500 lines.
- **Antigravity:** Per [Google Codelabs](https://codelabs.developers.google.com/getting-started-google-antigravity), workspace paths are `.agents/rules/`, `.agents/skills/`, `.agents/workflows/` (plural). Commands are called **"workflows"** — the adapter creates `.agents/workflows` → `commands` symlink so `.agents/commands/<x>.md` is exposed as a workflow. No project-level MCP (global only at `~/.gemini/antigravity/mcp_config.json`). No subagents. Requires reload after sync. The older `.agent/workflows/` (singular) form is deprecated; the adapter cleans it up.
- **Gemini:** Per [docs](https://geminicli.com/docs/cli/gemini-md/), uses a single context file (default `GEMINI.md`), configurable via `context.fileName` in `settings.json`. No native rules directory pattern. Commands need TOML format. Reads skills/agents natively from `.agents/`.
- **Copilot/VSCode:** Per [docs](https://code.visualstudio.com/docs/copilot/customization/custom-instructions), rules location is `.github/instructions/` (recursive), files must end in `.instructions.md`. Frontmatter field `applyTo` is required for GitHub Cloud Copilot, optional in VSCode (we always emit it). Subdirectories supported. Skills read natively from `.agents/`.

---

## Critical Workflows

### Adding a New Rule

```bash
# 1. Create rule file (categorized subdirectory)
cat > .agents/rules/team/api-standards.md << 'EOF'
---
name: api-standards                    # Cursor (non-standard, harmlessly ignored; kept for legacy)
description: API design standards      # All platforms — recommended
alwaysApply: false                     # Cursor (optional)
globs: ["src/api/**/*.ts"]             # Cursor (optional) — Copilot adapter converts to applyTo
paths: ["src/api/**/*.ts"]             # Claude (optional) — path-scoped loading
argument-hint: <api-file>              # Claude/Gemini (optional)
trigger: always_on                     # Antigravity (optional)
---

# API Standards

Review these files for compliance: $ARGUMENTS

## Rules
- REST endpoints use `/api/v1/{resource}` structure
- All endpoints validate input with Zod
- Error responses use standard format

## Output Format
Use `file:line` format (VS Code clickable).
EOF

# 2. Verify character count (must be < 12,000)
wc -c .agents/rules/team/api-standards.md

# 3. Sync to all platforms
./.agents/sync.sh --only=rules

# 4. Verify
ls .cursor/rules/api-standards.mdc              # Cursor (converted)
cat .claude/rules/team/api-standards.md         # Claude (symlink)
cat .gemini/GEMINI.md | grep api-standards      # Gemini (index)
ls .github/instructions/api-standards.instructions.md  # Copilot (converted)

# 5. Commit source only (symlinks auto-restore)
git add .agents/rules/team/api-standards.md
git commit -m "docs: Add API design standards rule"
```

### Adding an MCP Server

```bash
# 1. Edit source configuration
vim .agents/mcp/mcp-servers.json

# Add server entry (merge with existing JSON):
{
  "servers": {
    "my-server": {
      "platforms": ["cursor", "claude", "gemini", "copilot"],
      "description": "My documentation server",
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@scope/package-name"],
      "env": {
        "API_KEY": "${MY_SERVER_API_KEY}"
      }
    }
  }
}

# 2. Validate JSON syntax
jq empty .agents/mcp/mcp-servers.json

# 3. Generate platform-specific configs
./.agents/sync.sh --only=mcp

# 4. Commit BOTH source and generated files (Claude MCP is .mcp.json at repo root)
git add .agents/mcp/mcp-servers.json
git add .mcp.json .cursor/mcp.json .gemini/settings.json .gemini/mcp_config.json .vscode/mcp.json
git commit -m "feat: Add my-server MCP integration"

# 5. Restart Claude Code/Cursor to detect new server
# Verify: claude mcp list
```

### Creating a Skill

```bash
# Automated (Recommended) - Use agents-architecture skill
# In AI conversation:
"Create a skill for React component testing with test templates"

# Manual alternative:
mkdir -p .agents/skills/react-testing/{references,examples,assets,scripts}

cat > .agents/skills/react-testing/SKILL.md << 'EOF'
---
name: react-testing
description: This skill should be used when the user asks to "test React component", "write component tests". React component testing patterns and utilities.
version: 1.0.0
---

# React Testing Skill

Testing patterns for React components.

## Overview
- Jest + React Testing Library patterns
- Accessibility testing (jest-axe)
- Mocking patterns (MSW for API calls)

## References
See references/testing-patterns.md for deep dive.
EOF

# Sync
./.agents/sync.sh

# Verify
ls .cursor/skills/react-testing/
ls .claude/skills/react-testing/
ls .agents/skills/react-testing/   # Gemini/Antigravity/Copilot — native detection per Agent Skills open standard

# Commit
git add .agents/skills/react-testing/
git commit -m "feat: Add React testing skill with patterns and utilities"
```

---

## Rules System Deep Dive

### Universal YAML Frontmatter (verified May 2026)

```yaml
---
name: rule-name # Non-standard. Harmlessly ignored by all platforms; kept for legacy.
description: Brief description # Cursor + Copilot use this. Recommended.
alwaysApply: false # Cursor only (optional)
globs: ["**/*.ts", "**/*.tsx"] # Cursor field. Copilot adapter converts to applyTo; default "**" when absent.
paths: ["src/**/*.ts"] # Claude only — path-scoped loading. Rules without paths load at launch.
argument-hint: <file-pattern> # Claude/Gemini (optional)
trigger: always_on # Antigravity (optional)
---
```

**Per-platform schema sources:**

- Cursor: https://cursor.com/docs/context/rules — only `description`, `alwaysApply`, `globs` are documented (all optional)
- Claude Code: https://code.claude.com/docs/en/memory — `paths` for path-scoped rules
- Copilot/VSCode: https://code.visualstudio.com/docs/copilot/customization/custom-instructions — `applyTo` required for Cloud, optional for VSCode
- Gemini CLI: https://geminicli.com/docs/cli/gemini-md/ — single context file (no frontmatter schema)

**Critical warnings (verified against official docs, May 2026):**

- Cursor schema is `description`, `alwaysApply`, `globs` (all optional). The `name` field is non-standard — harmlessly ignored. Source files keep `name:` for legacy compatibility but Cursor does not require it.
- Claude Code uses `paths:` for path-scoped rules (NOT `globs:`). Rules without `paths:` load at launch unconditionally.
- Copilot/VSCode emits `applyTo:` (defaults to `"**"` when source has no `globs:`). Required by GitHub Cloud Copilot.
- Each platform ignores fields it doesn't recognize (safe to include all in one source file).
- Never create platform-specific files (one source with all fields → adapters transform).
- Test on target platforms after creating new rules.

### Rules Character Target: 12,000 (Cursor performance recommendation)

12,000 chars is a **Cursor performance recommendation**, not a hard limit — it is
**not enforced** by any hook or CI gate, and Claude Code / Gemini / Copilot load
larger rules without issue. Author **new** rules to stay under it; keep them
focused (split a generic rule only when it covers two genuinely separate topics).

**Intentional exceptions — comprehensive governance rules that exceed 12,000 by
design** (they ARE the methodology reference, and are loaded path-scoped/on-demand,
not eagerly, so the cost is bounded):

| Rule                          | Size  | Why it's large                                   |
| ----------------------------- | ----- | ------------------------------------------------ |
| `lidr-sdlc/workflows.md`      | ~36KB | Full command catalog + role matrix + flow chains |
| `lidr-sdlc/tech-stack.md`     | ~28KB | Complete stack conventions (TS/React/API/test)   |
| `lidr-sdlc/documentation.md`  | ~28KB | DTC governance + frontmatter + staleness rules   |
| `lidr-sdlc/org.md`            | ~25KB | Org standards, RACI, security policy             |
| `lidr-sdlc/project.md`        | ~21KB | Active-project context (team, arch, ADRs)        |
| `lidr-sdlc/spec-execution.md` | ~15KB | Mandatory test-execution steps per change        |
| `product/roadmap.md`          | ~12KB | Product roadmap reference                        |

Do NOT fragment these into multiple files — splitting a governance reference
multiplies `@`-references and (for always-loaded rules) does not even reduce
context cost. Trim redundancy instead if size becomes a real problem.

```bash
# Check rule size before committing a NEW rule
wc -c .agents/rules/design/web-design.md

# List any rules over the target (the lidr-sdlc set above is expected)
find .agents/rules -name "*.md" ! -name "README.md" -exec wc -c {} \; | awk '$1>12000'
```

### Rules Categories Explained

**`code/`** - Core programming principles

- `principles.md` - Architectural decisions, source-of-truth pattern
- `style.md` - Bash, Markdown, JSON conventions

**`content/`** - Writing standards

- `copywriting.md` - 800-line comprehensive copywriting guide

**`design/`** - UI/UX standards

- `web-design.md` - 800+ line accessibility checklist (Vercel guidelines)

**`frameworks/`** - Framework-specific

- `react-native.md` - React Native patterns

**`process/`** - Development workflows

- `git-workflow.md` - Branch naming, commit messages, PR process
- `documentation.md` - Markdown, README patterns

**`quality/`** - Testing standards

- `testing.md` - Testing philosophy, manual testing
- `testing-scripts.md` - Bash script testing patterns

**`team/`** - Team conventions

- `skills-management.md` - Skills lifecycle, progressive disclosure
- `third-party-security.md` - Dependency review process

**`tools/`** - Tool-specific

- `use-context7.md` - Proactive Context7 usage for library docs
- `claude-code-extensions.md` - Claude Code extensions guide

---

## Skills System Deep Dive

Skills follow the [Agent Skills](https://agentskills.io) **open standard**, supported by all 5 platforms in this monorepo (verified May 2026):

| Platform        | Discovery path                                                              | Method                      |
| --------------- | --------------------------------------------------------------------------- | --------------------------- |
| **Claude Code** | `.claude/skills/`                                                           | Symlink → `.agents/skills/` |
| **Cursor**      | `.cursor/skills/` (Cursor 2.4+, Jan 2026)                                   | Symlink → `.agents/skills/` |
| **Gemini CLI**  | `.agents/skills/` (official alias, takes precedence over `.gemini/skills/`) | Native                      |
| **Copilot**     | `.agents/skills/` (or `.github/skills/`, `.claude/skills/`)                 | Native                      |
| **Antigravity** | `.agents/skills/`                                                           | Native                      |

**Why no `.gemini/skills/` or `.github/skills/`?** `.agents/skills/` is the canonical cross-platform path per the Agent Skills standard. Creating per-platform directories would cause **duplicate skill detection** in Gemini/Copilot.

### Progressive Disclosure Pattern

```
.agents/skills/<skill-name>/
├── SKILL.md              # ← Required. Always loaded when skill is invoked.
├── references/           # ← On-demand: deep documentation
├── examples/             # ← On-demand: usage samples
├── assets/               # ← On-demand: templates, resources
└── scripts/              # ← Executable utilities (called via Bash from skill)
```

Per Claude docs: _"Keep `SKILL.md` under 500 lines. Move detailed reference material to separate files."_

### Skill Frontmatter (verified)

**Required fields (Gemini silently skips a skill if missing):**

```yaml
---
name: skill-name # Lowercase + hyphens, max 64 chars. Should match directory name.
description: This skill should be used when the user asks to "trigger phrase 1", "trigger phrase 2". Brief context.
---
```

**Claude-only optional fields** (ignored by other platforms — safe to include):

```yaml
---
name: skill-name
description: ...
disable-model-invocation: true # Only user can invoke via /skill-name (default false)
user-invocable: false # Hide from / menu — Claude can still load (default true)
allowed-tools: Read Grep # Pre-approved tools when active
model: claude-opus # Override session model
effort: high # low|medium|high|xhigh|max
context: fork # Run in forked subagent
agent: Explore # Subagent type for context:fork
paths: ["src/api/**/*.ts"] # Glob to scope auto-loading
arguments: [issue, branch] # Named positional args for $name substitution
---
```

**Description best practices:**

- Third-person, declarative: _"This skill should be used when..."_
- List 2–4 specific trigger phrases in quotes
- Lead with the use case (Claude truncates `description + when_to_use` at 1,536 chars in the listing)
- Keep under 1,000 chars in practice

**Anti-patterns:**

- ❌ `"Create skills"` (too vague — no trigger phrases)
- ❌ `"I help with X"` (first person — Claude/Gemini don't reason about skills that way)
- ❌ Multi-paragraph descriptions (most chars never reach Claude's listing budget)

**Reference:** see `.agents/skills-readme.md` for full inventory, troubleshooting, and per-platform doc links.

### Available Skills (113 total)

**LIDR meta-skills (5, prefixed `lidr-*`):**

- `lidr-agents-architecture` — Meta-skill: end-to-end scaffolding for skills, commands, and agents with auto-sync
- `lidr-command-development` — Deep-dive on command authoring patterns; complements `lidr-agents-architecture`
- `lidr-hook-development` — Hook authoring patterns
- `lidr-mcp-integration` — MCP server integration
- `lidr-generate-rule` — Rule generation

**LIDR skills (44 total, incl. the 5 meta-skills above):** unified phases 0–4 (BMad-aligned; stages context→release, see `.agents/_shared/lidr/UNIFIED-PHASES.md`) plus spec-lifecycle and meta-tooling, all prefixed `lidr-*`. Examples: `lidr-business-case`, `lidr-generate-rf`, `lidr-generate-nfr`, `lidr-user-stories`, `lidr-adr`, `lidr-create-test-cases`, `lidr-security-checklist`, `lidr-release-notes`, `lidr-gate-evaluation`. Run `ls .agents/skills/ | grep ^lidr-` for the full list; see the **LIDR SDLC Methodology** section below for phase-by-phase mapping.

**BMad skills (69, prefixed `bmad-*`):** base flow, agent personas, test-architecture, creative/innovation, utilities. PRD/design/epics/test-plan are owned by BMad (`bmad-prd`, `bmad-create-architecture`, `bmad-create-epics-and-stories`, `bmad-testarch-test-design`) — LIDR wraps those outputs, see `.agents/_shared/lidr/MIGRATION.md`. Run `ls .agents/skills/ | grep ^bmad-` for the full list.

---

## Commands System

Each platform calls commands by a **different name** and expects a **different file format**:

| Platform        | Feature name                      | Path                                      | Format          | Sync method                                                  |
| --------------- | --------------------------------- | ----------------------------------------- | --------------- | ------------------------------------------------------------ |
| **Claude Code** | "Custom commands"                 | `.claude/commands/<name>.md`              | Markdown + YAML | Symlink → `.agents/commands/`                                |
| **Cursor**      | "Custom slash commands" (1.6+)    | `.cursor/commands/<name>.md`              | Plain Markdown  | Symlink → `.agents/commands/` (YAML harmlessly visible)      |
| **Gemini CLI**  | "Custom commands"                 | `.gemini/commands/<name>.toml`            | **TOML**        | Generated from `.md` source                                  |
| **Antigravity** | **"Workflows"** (different name!) | `.agents/workflows/<name>.md` (workspace) | Markdown + YAML | Internal symlink `.agents/workflows` → `commands`            |
| **Copilot**     | "Prompt files"                    | `.github/prompts/<name>.prompt.md`        | Markdown + YAML | Generated from `.md` source (`$ARGUMENTS` → `{{{ input }}}`) |

Total: 30 commands (28 LIDR `lidr-*` — 21 SDLC + 7 spec-lifecycle — + 2 generic: `sync-setup`, `test-hooks`).

### Antigravity terminology note

Antigravity calls them **workflows**, not commands. The workspace path is `.agents/workflows/` (plural) per [Google Codelabs](https://codelabs.developers.google.com/getting-started-google-antigravity). The older `.agent/workflows/` (singular) form from Nov 2025 docs (Mete Atamel) is deprecated; our adapter cleans it up.

### Available commands (30)

**Generic (2):** `/sync-setup`, `/test-hooks`

**LIDR (28):** all prefixed `lidr-*` — 21 SDLC (`/lidr-advance-gate`, `/lidr-commit`, `/lidr-create-ticket`, `/lidr-enrich-ticket`, `/lidr-improve-docs`, `/lidr-implement-ticket`, `/lidr-prepare-testing`, `/lidr-validate-prd`, `/lidr-validate-project-docs`, `/lidr-validate-requirements`, …) + 7 spec-lifecycle (`/lidr-spec-new`, `/lidr-spec-ff`, `/lidr-spec-apply`, `/lidr-spec-verify`, `/lidr-spec-archive`, `/lidr-spec-continue`, `/lidr-spec-bulk-archive`). Run `ls .agents/commands/ | grep ^lidr-` for the full list. See `.agents/rules/lidr-sdlc/workflows.md` for the role × command matrix.

**Full reference, per-platform schemas, common pitfalls, and add-a-new-command flow:** see `.agents/commands-readme.md`.

### Command → Agent → Skill Pattern

```
User: /lidr-improve-docs docs/guides
    ↓
Command: lidr-improve-docs.md (slash command)
    ↓
Agent: lidr-doc-improver.md (autonomous workflow)
    ↓
Skill: lidr-audit-standards (domain expertise)
    ↓
Rule: process/documentation.md (standards)
    ↓
Result: Audit report with prioritized recommendations
```

Example workflow:

1. User runs `/lidr-improve-docs`
2. Command invokes `lidr-doc-improver` agent
3. Agent reads `process/documentation.md` rule for standards
4. Agent uses `lidr-audit-standards` skill for structure analysis
5. Agent outputs audit with high/medium/low priority issues
6. User approves fixes, agent implements changes

---

## MCP Integration

### Context7 Server (Currently Configured)

**Purpose:** Up-to-date library and framework documentation

**Supported libraries:** React, Next.js, TypeScript, Node.js, Vue, Angular, etc.

**Usage:** Automatically triggered by `use-context7.md` rule

- No need to explicitly request
- Proactively used for library questions
- Always prefer Context7 over outdated knowledge

**Configuration location:**

- Source: `.agents/mcp/mcp-servers.json`
- Generated: `.mcp.json` (Claude — at repo root), `.cursor/mcp.json`, `.gemini/settings.json`, `.gemini/mcp_config.json` (Antigravity reference), `.vscode/mcp.json` (Copilot)
- Antigravity: also `~/.gemini/antigravity/mcp_config.json` (global; needed for Antigravity to pick up MCP)

**API Key:** Set `CONTEXT7_API_KEY` in `.agents/mcp/.env`

### Adding New MCP Servers

See [Adding an MCP Server](#adding-an-mcp-server) section above.

**Platform-specific formats:**

- **Cursor:** `mcpServers` object, no metadata
- **Claude Code:** `mcpServers` object, with metadata
- **Gemini CLI:** Nested in `settings.json` `mcpServers`
- **Copilot (VSCode):** `servers` object in `.vscode/mcp.json`, env vars use `${env:VAR}`
- **Antigravity:** Global config only (not project-level)

---

## Git Hooks System

### Available Hooks (6 — verified against official docs)

**Generic (3):**

| Hook                 | Event          | Platforms                       | Purpose                                     |
| -------------------- | -------------- | ------------------------------- | ------------------------------------------- |
| `notify.sh`          | `Notification` | claude, gemini                  | Desktop notification when AI needs input    |
| `auto-format.sh`     | `PostToolUse`  | claude, gemini, cursor, copilot | Run prettier on edited files                |
| `protect-secrets.sh` | `PreToolUse`   | claude, gemini, copilot         | Block edits to `.env`, `.key`, `.pem`, etc. |

**LIDR (3, Claude-only):**

| Hook                             | Event          | Purpose                                                       |
| -------------------------------- | -------------- | ------------------------------------------------------------- |
| `lidr-frontmatter-guard`         | `PreToolUse`   | Block .md writes missing YAML frontmatter in docs/agents      |
| `lidr-load-context`              | `SessionStart` | Load project context (PROJECT_TYPE, DTC, stale-docs counters) |
| `lidr-validate-ecosystem-counts` | `Stop`         | Sync 8 sources of truth, block on count drift                 |

### Hook Configuration Locations (actual schemas, verified May 2026)

**Claude Code:** `.claude/settings.json` — events in PascalCase, field is `command`, timeout in seconds.

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "bash \"${CLAUDE_PROJECT_DIR}/.claude/hooks/scripts/protect-secrets.sh\"",
            "timeout": 10
          }
        ]
      }
    ]
  }
}
```

**Gemini CLI:** `.gemini/settings.json` — events `BeforeTool`/`AfterTool`/`Notification`, field `command`, **timeout in milliseconds**, `name` required.

```json
{
  "hooks": {
    "AfterTool": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "name": "auto-format",
            "type": "command",
            "command": "bash \"${GEMINI_PROJECT_DIR}/.gemini/hooks/scripts/auto-format.sh\"",
            "timeout": 30000
          }
        ]
      }
    ]
  }
}
```

**Cursor:** `.cursor/hooks.json` — `version: 1`, events `afterFileEdit`/`afterTabFileEdit` (for PostToolUse mapping), field `command`, timeout in seconds. Cursor **does** support blocking via `preToolUse`/`beforeShellExecution`/`beforeReadFile`/`beforeMCPExecution` (current setup doesn't use these; protect-secrets relies on Husky pre-commit).

```json
{
  "version": 1,
  "hooks": {
    "afterFileEdit": [{ "command": "bash .cursor/hooks/scripts/auto-format.sh", "timeout": 30 }],
    "afterTabFileEdit": [{ "command": "bash .cursor/hooks/scripts/auto-format.sh", "timeout": 30 }]
  }
}
```

**Copilot (VSCode):** `.github/hooks/hooks.json` — `version: 1`, events in PascalCase (`PreToolUse`/`PostToolUse`), field `type: "command"` **required**, timeout in seconds. VSCode parses `matcher` but **does not enforce it** (hooks run on every tool use). Notification event not supported.

```json
{
  "version": 1,
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Edit|Write",
        "type": "command",
        "command": "bash .github/hooks/scripts/protect-secrets.sh",
        "timeout": 10
      }
    ],
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "type": "command",
        "command": "bash .github/hooks/scripts/auto-format.sh",
        "timeout": 30
      }
    ]
  }
}
```

**Scripts:** All hook scripts (generic and LIDR-specific) live in `.agents/hooks/scripts/` and are symlinked per platform.

**Official references:**

- Claude Code hooks: https://code.claude.com/docs/en/hooks
- Cursor hooks: https://cursor.com/docs/agent/hooks
- Gemini CLI hooks: https://geminicli.com/docs/hooks
- VSCode Copilot hooks: https://code.visualstudio.com/docs/copilot/customization/hooks
- GitHub Copilot hooks reference: https://docs.github.com/en/copilot/reference/hooks-configuration

---

## Commit Message Format

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
type: Brief summary (50 chars or less)

Detailed explanation if needed. Wrap at 72 characters.
Explain WHAT changed and WHY, not HOW.

- Bullet points for multiple changes
- Focus on impact and rationale

Refs: #issue-number
Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
```

### Commit Types

- `feat:` New feature or functionality
- `fix:` Bug fix
- `docs:` Documentation only changes
- `refactor:` Code restructuring without behavior change
- `test:` Adding or updating tests
- `chore:` Maintenance tasks (dependencies, configs)
- `perf:` Performance improvements
- `style:` Code formatting (no logic change)

### Examples

```
feat: Add API conventions rule and patterns skill

Implemented comprehensive API standards:
- REST API conventions (error handling, pagination, versioning)
- GraphQL schema patterns
- Authentication/authorization patterns

Includes templates and validation scripts.

Refs: #45
Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
```

```
fix: Resolve symlink creation error on Windows

Fixed path resolution in sync.sh to work with
Windows Developer Mode symlinks. Added check for
elevated permissions.

Refs: #72
Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
```

---

## Common Pitfalls & Troubleshooting

### Rule Not Appearing in Cursor

**Symptom:** Rule file exists but doesn't show in Cursor settings

**Causes:**

1. Missing `name` field in YAML frontmatter ❌
2. File is `.md` instead of `.mdc` ❌
3. Rule in subdirectory (Cursor doesn't support) ❌
4. YAML frontmatter malformed ❌

**Solution:**

```bash
# Check .mdc files exist
ls .cursor/rules/*.md  # Should be empty

# Verify YAML has 'name' field
head -10 .agents/rules/my-rule.md

# Re-run sync
./.agents/sync.sh --only=rules

# Verify in Cursor: Settings → Rules → Check rule appears
```

### Changes Not Propagating

**Cursor rules (copied, not symlinked):**

```bash
./.agents/sync.sh --only=rules  # Must re-run after edits
```

**Claude/Gemini (symlinked):**

```bash
# Changes instant, just verify symlink exists
readlink .claude/rules  # Should: ../.agents/rules
```

**Copilot rules (copied, not symlinked):**

```bash
./.agents/sync.sh --only=rules  # Must re-run after edits
# Also regenerates .github/copilot-instructions.md index
```

**Gemini CLI / Copilot skills/agents (native .agents/ detection):**

```bash
# Gemini and Copilot read skills and agents natively from .agents/skills/ and .agents/subagents/
# No symlinks needed — changes propagate directly
ls .agents/skills/    # Verify skills exist
ls .agents/subagents/ # Verify agents exist
```

**Antigravity (native .agents/ detection):**

```bash
# Changes read directly from .agents/, but may be cached
# Close and reopen project to refresh cached rules
```

### MCP Server Not Loading

**All platforms:**

```bash
# 1. Restart AI platform
# 2. Verify environment variables
cat .agents/mcp/.env

# 3. Validate JSON
jq empty .agents/mcp/mcp-servers.json

# 4. Regenerate configs
./.agents/sync.sh --only=mcp

# 5. Check generated files
jq . .cursor/mcp.json
```

**Claude Code specific:**

```bash
# Verify server appears
claude mcp list  # Should show: context7

# Test server
# In conversation: "Show me React documentation for useEffect"
```

**Antigravity specific:**

```bash
# Check GLOBAL config (project-level not supported)
cat ~/.gemini/antigravity/mcp_config.json
```

### Symlink Issues

```bash
# Verify symlink (look for "l" prefix)
ls -ld .cursor/skills
# lrwxr-xr-x = symlink ✅
# drwxr-xr-x = directory ❌

# Check symlink target
readlink .cursor/skills  # Should: ../.agents/skills

# Verify source exists
ls -la .agents/skills

# Recreate manually if needed
rm -rf .cursor/skills
ln -s ../.agents/skills .cursor/skills
```

**Windows users:**

- Enable Developer Mode: Settings → Update & Security → For Developers
- Or run as Administrator

---

## Key Principles

### 1. Single Source of Truth

- Edit only in `.agents/`
- Never edit platform directories (`.cursor/`, `.claude/`, `.github/`, `.vscode/`, etc.) directly
- Sync scripts handle distribution

### 2. Commit Patterns

- **Symlinked resources:** Commit source only (`.agents/rules/`, `.agents/skills/`)
- **Generated configs:** Commit both source AND generated (`.agents/mcp/mcp-servers.json` + platform JSONs)
- Symlinks auto-restore on clone (Git handles them correctly)

### 3. Sync After Every Change

```bash
# Changed anything in .agents/? Run sync
./.agents/sync.sh

# Or individual component syncs
./.agents/sync.sh --only=rules
./.agents/sync.sh --only=mcp
```

### 4. Test on Target Platforms

- Cursor: Open Settings → Rules → Verify rule appears
- Claude Code: `claude mcp list` → Verify servers
- Copilot: `ls .github/instructions/*.instructions.md` → Verify rules
- VSCode: Open `.vscode/mcp.json` → Verify servers
- Verify symlinks: `ls -la .cursor/skills .claude/skills`

---

## Documentation System

Documentation lives in the **React app at `app/`** (Vite + React Router v7 + React Flow). The previous VitePress-based `docs/` site was removed on 2026-05-19; consult `app/CLAUDE.md` and the routes under `app/src/app/components/diagrams/` for the current docs surface.

---

## References

**Project Documentation:**

- Rules guide: `.agents/rules-readme.md`
- Core principles: `.agents/rules/code/principles.md`
- Skills management: `.agents/rules/team/skills-management.md`
- Git workflow: `.agents/rules/process/git-workflow.md`
- Testing guidelines: `.agents/rules/quality/testing.md`

**README Files:**

- Project root: `README.md` (comprehensive project overview)
- Rules: `.agents/rules-readme.md`
- Skills: Documented in individual SKILL.md files
- Commands: `.agents/commands-readme.md`
- MCP: `.agents/mcp-readme.md`
- Hooks: `.agents/hooks-readme.md`
- Orchestrator: `.agents/orchestrator-readme.md`
- Subagents: `.agents/subagent-readme.md`

**External Standards:**

- [agents.md](https://agents.md) - Universal agent configuration standard
- [skills.sh](https://skills.sh) - Skills ecosystem documentation
- [Context7](https://context7.com) - MCP documentation server
- [Conventional Commits](https://www.conventionalcommits.org/)

---

## LIDR Spec Lifecycle — change container model (Phase 4 Implementation · development, granular)

The LIDR ecosystem implements a **native change-lifecycle layer** (paridad con el patrón specboot, sin dependencias externas). Each feature lives in `docs/projects/<CLIENT_CODE>/changes/<change-name>/` as a versionable directory with auditable artifacts.

### Artifacts (per change)

```
docs/projects/<CLIENT_CODE>/changes/<change-name>/
├── proposal.md       # problem, solution outline, scope, risks
├── design.md         # architecture, data model, API/component changes, ADRs
├── spec.md           # functional + non-functional requirements with BDD
├── tasks.md          # implementation tasks with mandatory steps (Step 0 branch + tests)
├── test-report.md    # final verdict (PASSED / WARNINGS / CRITICAL) generated by /lidr-spec-verify
└── reports/          # one per mandatory step (unit, curl, Playwright, docs)
    └── YYYY-MM-DD-step-N+M-<name>.md
```

When archived, the directory moves to `docs/projects/<CLIENT_CODE>/changes/archive/YYYY-MM-DD-<change-name>/`.

### Lifecycle commands (`/lidr-spec-*`)

| Command                          | Purpose                                                                              | Model                                 | Reference                                    |
| -------------------------------- | ------------------------------------------------------------------------------------ | ------------------------------------- | -------------------------------------------- |
| `/lidr-spec-new <name>`          | Scaffold the change container                                                        | Sonnet medium                         | `.agents/commands/lidr-spec-new.md`          |
| `/lidr-spec-ff <name>`           | Fast-forward: generate all 4 artifacts in one pass                                   | **Opus high** (planning)              | `.agents/commands/lidr-spec-ff.md`           |
| `/lidr-spec-apply <name>`        | Implement task-by-task; **AGENT MUST EXECUTE** unit + curl + Playwright tests itself | Sonnet medium                         | `.agents/commands/lidr-spec-apply.md`        |
| `/lidr-spec-verify <name>`       | Final verification + `test-report.md`                                                | Sonnet (promotes to Opus on CRITICAL) | `.agents/commands/lidr-spec-verify.md`       |
| `/lidr-spec-archive <name>`      | Move to `changes/archive/YYYY-MM-DD-<name>/`                                         | Sonnet medium                         | `.agents/commands/lidr-spec-archive.md`      |
| `/lidr-spec-continue <name>`     | Diagnose state, dispatch to the right step                                           | Inherits                              | `.agents/commands/lidr-spec-continue.md`     |
| `/lidr-spec-bulk-archive [glob]` | Archive all changes with PASSED verdict                                              | Sonnet medium                         | `.agents/commands/lidr-spec-bulk-archive.md` |

### Skills supporting the lifecycle

- **`lidr-using-git-worktrees`** — create / use / clean up worktrees safely. Prerequisite for parallel work.
- **`lidr-run-parallel-tasks`** — launch N changes in parallel, each in its own worktree (`.worktrees/<name>/`), each sub-agent runs the full pipeline (enrich → new → ff → apply → verify → stop). Requires Opus high.

### Subagent: `lidr-spec-orchestrator`

End-to-end orchestration: takes an enriched user story and runs `new → ff → apply → verify → archive`, pausing only on CRITICAL blockers or WARNINGS verdict that needs human decision. Invoked when the user says "implement \<change\> end-to-end" or "ejecuta el ciclo completo de X".

### Governing rules

- **`lidr-sdlc/spec-execution.md`** — mandatory steps for every change: Step 0 (branch) + unit + curl + Playwright + docs, with per-step report. **Lenguaje binding: "AGENT MUST EXECUTE"** — la IA ejecuta los tests, no delega.
- **`lidr-sdlc/model-selection.md`** — self-correct del modelo según workflow: Opus high para planning (`lidr-spec-ff`, `lidr-prd-*`, `lidr-generate-rf`, ...), Sonnet medium para implementación (`lidr-spec-apply`, `lidr-implement-ticket`).

### How it interacts with Jira tickets

The Jira ticket is the **unit of work** in the backlog. The LIDR change is the **technical artifact** versionable in the repo. The relationship is N:1 (one ticket may have one change, occasionally more, occasionally none — for refactors that don't need a spec).

- PR description includes both: `Refs: PROJ-123` + `Change: add-item-soft-delete`
- `/lidr-implement-ticket` may invoke `/lidr-spec-apply` internally when the ticket has an associated change
- `/lidr-create-pr` references the archived change path

### Context manifest

The hook `lidr-load-context` reads `.agents/context-manifest.yaml` at SessionStart and loads the docs flagged `always_load: true`. Adding or removing context now requires only editing the YAML, not the bash hook.

---

## LIDR SDLC Methodology — quick context for the AI

The LIDR SDLC and BMad share ONE unified phase taxonomy (BMad numbering) since
2026-06-10. BMad is the ENGINE (produces artifacts); LIDR is the GOVERNANCE
(gates, roles, compliance). Canonical source: `.agents/_shared/lidr/UNIFIED-PHASES.md`
(includes old-phase mapping and greenfield/brownfield/feature flow audits).
When the user references "fase X", "gate Y", or any LIDR artifact, use this map.

### The 5 unified phases (0-4) and their stages

| Phase | Name              | Stages (ex-LIDR phases)                                                    | Primary skills (BMad engine + LIDR governance)                                                                                                                                                                                                                                                                                                                                                                                            |
| ----- | ----------------- | -------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0     | Context & Anytime | `context` (ex-F0 Preparación), `anytime` (cross-cutting)                   | `bmad-document-project`, `bmad-generate-project-context` (brownfield entry); `lidr-gate-evaluation`, `lidr-audit-standards`, `lidr-sdlc-tracking`, meta-tooling                                                                                                                                                                                                                                                                           |
| 1     | Analysis          | `analysis` (ex-F1 Originación)                                             | `bmad-brainstorming`/`*-research`, `bmad-product-brief` \| `bmad-prfaq`; `lidr-business-case`, `lidr-kickoff`, `lidr-stakeholder-map`, `lidr-tracking-integration`                                                                                                                                                                                                                                                                        |
| 2     | Planning          | `planning` (ex-F2 Discovery & PRD)                                         | `bmad-prd`, `bmad-ux`, `bmad-technical-research` (PoC); `lidr-review-cruzado` (Gate-1 F+T), `lidr-risk-log`, `/lidr-validate-prd`                                                                                                                                                                                                                                                                                                         |
| 3     | Solutioning       | `specification` (ex-F3), `sprint-planning` (ex-F4)                         | `bmad-create-architecture`, `bmad-create-epics-and-stories`, `bmad-testarch-test-design`; `lidr-generate-rf`, `lidr-generate-nfr`, `lidr-validate-requirements` (RTM) · then `lidr-user-stories`, `lidr-sprint-capacity`, `bmad-check-implementation-readiness`, `bmad-sprint-planning`                                                                                                                                                   |
| 4     | Implementation    | `development` (ex-F5), `qa` (ex-F6), `security` (ex-F7), `release` (ex-F8) | dev: `bmad-create-story`/`bmad-dev-story` or `/lidr-spec-*`, `lidr-adr`, `lidr-impact-analysis` (contract impact G4; variant compatibility consumed at G2), `lidr-dev-handoff-qa` · qa: `lidr-create-test-cases`, `lidr-test-execution-report`, `bmad-testarch-automate` · security: `lidr-vuln-assessment`, `lidr-security-checklist` · release: `lidr-change-request`, `lidr-rollback-plan`, `lidr-release-notes`, `bmad-retrospective` |

### The 8 gates (G0 → G7) — IDs unchanged, re-anchored to unified phases

Gates are stage-exit checkpoints. **Never advance without evaluating the
gate.** Use `lidr-advance-gate.md` command to transition formally. Mnemonic:
G0-G1 close phases 1-2; G2-G3 live inside Solutioning; G4-G7 are stage-gates
inside Implementation.

| Gate | Transition                                                        | Owner            |
| ---- | ----------------------------------------------------------------- | ---------------- |
| G0   | Phase 1 Analysis → Phase 2 Planning (Intake)                      | PME + Sponsor    |
| G1   | Phase 2 Planning → Phase 3 Solutioning (PRD approved)             | Product + R&D    |
| G2   | Solutioning: specification → sprint-planning (Specs complete)     | Product + QA     |
| G3   | Phase 3 Solutioning → Phase 4 Implementation (Ready to implement) | PO + TL          |
| G4   | Implementation: development → qa (DoD met)                        | Dev + Security   |
| G5   | Implementation: qa → security (QA sign-off)                       | QA Lead          |
| G6   | Implementation: security → release (Security sign-off)            | CISO             |
| G7   | Implementation: release → Producción (CR approved — Gate Final)   | Change Committee |

### Roles + permissions

See `.agents/rules/lidr-sdlc/workflows.md` for the full RACI matrix and which
roles can execute which commands. Quick reference:

- **PME** (Project Management Execution): Governance, gates, portfolio
- **PO** (Product Owner): PRDs, requirements, business value
- **TL** (Tech Lead): Architecture, code quality, ADRs
- **Dev**: Implementation, PRs, handoffs
- **QA / QA Lead**: Testing, sign-off
- **Sec / CISO**: Vulnerability assessment, security sign-off
- **DevOps**: CI/CD, deployment, rollback
- **SM** (Scrum Master): Facilitation, capacity, ceremonies

### React app: multi-client architecture

The `app/` directory hosts the React visualization. Each client has its own
configuration in `app/src/data/clients/{clientId}/` (currently registered:
`base`, `docline`, `facephi`, `aramis`). Routes follow `/{clientId}/{page}`
(e.g. `/facephi/prd`, `/aramis/sprint`).

When working with the app, see `app/CLAUDE.md` for the React/TypeScript-specific
guidance.

### Where to read more

- `.agents/rules/lidr-sdlc/org.md` — full methodology, RACI, security policy
- `.agents/rules/lidr-sdlc/project.md` — current project context (active client)
- `.agents/rules/lidr-sdlc/workflows.md` — workflow orchestration map
- `.agents/rules/lidr-sdlc/documentation.md` — DTC ("Docs Travel with Code") governance
