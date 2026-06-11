# LIDR Ecosystem

> Unified monorepo combining the **LIDR SDLC Methodology** framework with a
> multi-platform AI configuration source-of-truth and a React documentation app.

[![Platforms](https://img.shields.io/badge/platforms-Cursor%20%7C%20Claude%20%7C%20Gemini%20%7C%20Antigravity%20%7C%20Copilot-green.svg)](#sync-strategies-per-platform)
[![Skills](<https://img.shields.io/badge/skills-113%20(44%20LIDR%20%2B%2069%20BMAD)-blue.svg>)](#repository-structure)
[![Commands](https://img.shields.io/badge/commands-30-blue.svg)](#repository-structure)
[![Agents](https://img.shields.io/badge/subagents-23-blue.svg)](#repository-structure)
[![MCP](https://img.shields.io/badge/MCP-Context7-purple.svg)](https://context7.com)

This repository is the result of merging two projects:

- **LIDR SDLC Methodology** — a comprehensive software development lifecycle
  framework with 62 specialized skills for every SDLC phase, 23 orchestrator
  commands, 5 governance rules, and 6 autonomous agents. Authored by LIDR
  Consultorias for multi-client SDLC implementation.
- **ai-assisted-workflow** — a source-of-truth pattern (`.agents/`) with
  automated synchronization to 5 AI platforms (Cursor, Claude Code, Gemini CLI,
  Antigravity, GitHub Copilot).

The merge happened on **2026-05-18**. Pre-merge originals remain available
outside this repo (`../LIDR - AI powered workflow 2026/` and
`../ai-assisted-workflow/`); git history covers everything that was
overwritten or replaced.

---

## Repository structure

```
lidr-ecosystem/
├── .agents/                       ← SOURCE OF TRUTH
│   ├── rules/                     # 24 rules total
│   │   ├── lidr-sdlc/             # 7 LIDR rules (org, project, tech-stack, workflows, documentation, spec-execution, model-selection)
│   │   ├── code/, design/, ...    # 17 generic rules in 9 categories
│   ├── skills/                    # 113 skills (Agent Skills open standard — read natively by Gemini/Copilot/Antigravity)
│   │   ├── lidr-*/                # 44 LIDR SDLC skills (prefixed to avoid collisions)
│   │   └── *                      # 69 BMAD skills (bmad-* — base flow + agent personas + utilities)
│   ├── commands/                  # 30 commands
│   │   ├── lidr-*.md              # 28 LIDR commands (21 SDLC + 7 spec-lifecycle: lidr-advance-gate, lidr-spec-*, ...)
│   │   └── *.md                   # 2 generic commands (sync-setup, test-hooks)
│   ├── subagents/                 # 23 subagents
│   │   ├── lidr-*.md              # 10 LIDR subagents (qa, release, security, spec-orchestrator, ...)
│   │   └── *.md                   # 13 BMAD subagents (bmad-*-agent personas)
│   ├── hooks/                     # 6 hooks registered in hooks.json
│   │   ├── lidr/                  # 3 LIDR bash hooks (frontmatter-guard, load-context, validate-ecosystem-counts)
│   │   ├── scripts/               # 3 generic hooks (notify, auto-format, protect-secrets)
│   │   └── hooks.json             # Cross-platform hook registry (5 events: PreToolUse, PostToolUse, Notification, SessionStart, Stop)
│   ├── mcp/                       # MCP server configs (Context7)
│   ├── _shared/lidr/              # LIDR shared validators
│   ├── memory/lidr/               # LIDR persistent memory (docs-agent)
│   ├── adapters/                  # Platform-specific transformations (cursor, claude, gemini, ...)
│   ├── sync/                      # Component orchestrators
│   ├── lib/                       # Shared bash libraries
│   └── sync.sh                    # ← Unified sync CLI
│
├── app/                           ← React app: LIDR SDLC documentation UI
│   ├── src/                       # React 18 + TypeScript + Vite + React Flow
│   ├── public/, scripts/, tests/
│   ├── package.json               # npm install + npm run dev
│   └── .gitignore
│
├── .cursor/                       ← Generated/symlinked per platform
├── .claude/                       ←   (do NOT edit directly — edit .agents/)
├── .gemini/                       ←
├── .github/                       ←
├── .vscode/                       ←
│
├── .husky/                        ← Git hooks (pre-commit, commit-msg, pre-push)
├── docs/                          ← VitePress documentation site
├── lidr-and-bmad-method/          ← Reference documentation
└── README.md                      ← This file
```

The originals are **untouched** in their respective directories one level up
(`LIDR - AI powered workflow 2026/` and `ai-assisted-workflow/`).

---

## Quick start

### 1. Initial setup

```bash
# Install root + app dependencies
npm install
cd app && npm install && cd ..

# Sync .agents/ source-of-truth to all 5 platform directories
./.agents/sync.sh
```

### 2. Launch the documentation app

```bash
cd app
npm run dev                       # http://localhost:5173 (or 5174 if 5173 busy)
```

The app loads the **FacePhi** client by default. Switch via the "Cambiar
Cliente" button in the sidebar to view documentation for any registered client.

### 3. Verify multi-client documentation

```bash
cd app
node scripts/multi-client-smoke.mjs    # Playwright headless tests all 4 clients
```

Expected: `55/56 pages passed` (the 1 not-passing is `docline/seguridad` which
is intentionally hidden in Docline's nav config).

---

## Registered clients

| Client    | Type            | Routes OK | Notes                                                                    |
| --------- | --------------- | --------- | ------------------------------------------------------------------------ |
| `base`    | Template        | 14/14     | Generic starter — use as scaffold for new clients                        |
| `docline` | Pilot           | 13/14     | Healthcare; `seguridad`, `gobernanza`, `portafolio` intentionally hidden |
| `facephi` | Pilot (default) | 14/14     | Biometric identity verification                                          |
| `aramis`  | Pilot           | 14/14     | Banking domain                                                           |

Client configurations live in `app/src/data/clients/{clientId}/` and are
registered in `app/src/data/client-registry.ts`.

---

## Working with the ecosystem

### Edit a skill, command, or rule

**Edit only inside `.agents/`** — never touch `.cursor/`, `.claude/`, etc.
directly (those are generated/symlinked).

```bash
# Edit a LIDR skill
vim .agents/skills/lidr-business-case/SKILL.md

# Re-sync to all platforms (symlinks are instant; Cursor/Copilot require sync)
./.agents/sync.sh --only=skills
```

### Add a new MCP server

```bash
vim .agents/mcp/mcp-servers.json
./.agents/sync.sh --only=mcp
```

### Add a new git hook

```bash
vim .agents/hooks/hooks.json              # Register the hook
vim .agents/hooks/scripts/my-hook.sh      # (or .agents/hooks/lidr/...)
./.agents/sync.sh --only=hooks
```

### Switch active client in the app

Click "Cambiar Cliente" in the sidebar, or navigate to `/{clientId}/` directly
(e.g. `/aramis/prd`, `/docline/sprint`).

---

## Sync strategies per platform

| Component | Cursor        | Claude          | Gemini              | Antigravity    | Copilot                   |
| --------- | ------------- | --------------- | ------------------- | -------------- | ------------------------- |
| Rules     | Copy (`.mdc`) | Symlink         | Index (`GEMINI.md`) | Native         | Copy (`.instructions.md`) |
| Skills    | Symlink       | Symlink         | Native              | Native         | Native                    |
| Commands  | Symlink       | Symlink         | Generate (`.toml`)  | Native         | Copy (`.prompt.md`)       |
| Subagents | Symlink       | Symlink         | Native              | ❌             | Copy (`.agent.md`)        |
| MCP       | Generated     | Generated       | Generated           | ❌ Global only | Generated (`.vscode/`)    |
| Hooks     | Partial       | Full (5 events) | Full                | ❌ Global only | Partial                   |

Run `./.agents/sync.sh --help` for filtering by component or platform.

---

## Git hooks (root husky)

- **pre-commit**: blocks sensitive files (`.env`, `.pem`, `.key`, `secrets/`,
  `credentials/`), runs root `lint-staged` + `app/` lint-staged when app files
  are staged.
- **commit-msg**: validates conventional commits via `commitlint` (config in
  `app/commitlint.config.js`).
- **pre-push**: enforces branch naming convention (`feature/PROJ-123-desc`,
  `release/vX.Y.Z`, `hotfix/PROJ-123-desc`, etc.).

The original `app/.husky/` is no longer present in the repo — only the root
husky is effective, since only one `.git/` exists in this monorepo. Git history
preserves the inert hooks if they're ever needed for reference.

---

## Documentation

- **Methodology**: `.agents/rules/lidr-sdlc/` — org standards, project context,
  tech stack conventions, workflow orchestration map
- **Skills catalog**: Each skill has a `SKILL.md` with frontmatter (`name`, `id`,
  `description`, triggers, phase)
- **Pre-merge originals**: `../LIDR - AI powered workflow 2026/` (LIDR repo) and
  `../ai-assisted-workflow/` (template). Git history covers everything removed
  during the unification.

---

## Useful npm scripts (in `app/`)

```bash
npm run dev                       # Vite dev server
npm run build                     # Production build
npm run test                      # Vitest unit tests
npm run validate:coherence        # Detect hardcoded values
npm run perf:all                  # Full performance suite (bundle, web-vitals, ...)
npm run visual:test               # Playwright visual regression
npm run client:list               # List registered clients
```

---

## Where things live

| Looking for...                           | Look in...                                                        |
| ---------------------------------------- | ----------------------------------------------------------------- |
| A LIDR skill (PRD, RF, ADR, sprint, ...) | `.agents/skills/lidr-{name}/SKILL.md`                             |
| A LIDR slash command                     | `.agents/commands/lidr-{name}.md`                                 |
| A LIDR autonomous agent                  | `.agents/subagents/lidr-{name}.md`                                |
| The 8 SDLC phases and gates              | `.agents/rules/lidr-sdlc/org.md` (§4)                             |
| Project-specific context                 | `.agents/rules/lidr-sdlc/project.md`                              |
| Client configurations                    | `app/src/data/clients/{clientId}/`                                |
| Client registry                          | `app/src/data/client-registry.ts`                                 |
| The unified sync logic                   | `.agents/sync.sh` + `.agents/sync/*.sh`                           |
| Pre-merge originals (read-only)          | `../LIDR - AI powered workflow 2026/`, `../ai-assisted-workflow/` |

---

## License

ISC (inherited from the ai-assisted-workflow template). Skills, rules,
methodology and React app are property of LIDR Consultorias.
