# CLAUDE.md

**Single orchestrator for all AI agents.** Root `CLAUDE.md`, `GEMINI.md`, `AGENTS.md` are
symlinks to `.agents/orchestrator/AGENTS.md` — **edit that file, never the symlinks.**
Claude Code & Cursor read `CLAUDE.md`; Gemini CLI / Antigravity read `GEMINI.md`; Copilot
reads `CLAUDE.md` + `AGENTS.md` + `.github/copilot-instructions.md`.

> This file loads into context **every session** — keep it lean (Claude Code targets
> <200 lines). Deep detail lives in the `.agents/*-readme.md` files; this is the index.
> Per Claude Code memory docs: facts-every-session → here; code standards → path-scoped
> rules; multi-step procedures → skills.

---

## What This Repository Is

**lidr-ecosystem** — a monorepo merging (2026-05-18):

1. **LIDR SDLC methodology** — the governance layer (gates, roles, RACI, compliance).
2. **ai-assisted-workflow** — the `.agents/` source-of-truth pattern, synced to 5 AI
   platforms (Cursor, Claude Code, Gemini CLI, Antigravity, GitHub Copilot).
3. **React docs app** (`app/`) — interactive visualization of the methodology with
   multi-client support (`base`, `docline`, `facephi`, `aramis`), React Flow + Router v7.

LIDR **wraps BMad** (the engine that produces artifacts). **LIDR is the governance /
nice-to-have layer over BMad — never a hard requirement; the requirements come from BMad.**

**Artifacts in `.agents/`** (single source of truth, synced via `./.agents/sync.sh`):

- **24 rules** in 10 categories (7 LIDR SDLC + 17 generic). **All path-scoped (`paths:`)**
  — none load at launch; each loads only when you touch matching files. → `rules-readme.md`
- **108 skills** (39 LIDR `lidr-*` + 69 BMad `bmad-*`), [Agent Skills](https://agentskills.io)
  open standard; load on invocation. → `skills-readme.md`
- **30 commands** (28 LIDR `lidr-*` — 21 SDLC + 7 `lidr-spec-*` lifecycle — + 2 generic:
  `sync-setup`, `test-hooks`). → `commands-readme.md`
- **10 subagents** (LIDR `lidr-*` workers only; BMad personas are skills, ADR-0008).
  → `subagent-readme.md`
- **6 hooks** (3 generic + 3 LIDR, Claude-only) in `.agents/hooks/hooks.json`. → `hooks-readme.md`
- MCP: Context7 (`.agents/mcp/mcp-servers.json`). → `mcp-readme.md`

**Naming:** LIDR-inherited artifacts are prefixed `lidr-` (rules live in `lidr-sdlc/`);
generic artifacts have no prefix.

---

## Essential Commands

```bash
# After ANY change in .agents/ — sync to all 5 platforms
./.agents/sync.sh                    # all; or --only=rules|mcp|hooks ; --platform=… ; --dry-run

# React app (in app/)
cd app && npm run dev                # Vite dev server (http://localhost:5173)
cd app && npm run build              # production build
cd app && npm run test:ecosystem     # coherence guard — run after .agents/ edits (MUST stay green)
cd app && npm run test               # Vitest unit tests
cd app && npm run validate:coherence # LIDR coherence checks
cd app && npm run client:list        # registered clients

# Formatting (root)
npm run format
```

**Git hooks** (Husky at **repo root**, one git dir): pre-commit (secrets guard + lint-staged),
commit-msg (conventional commits via `app/commitlint.config.js`), pre-push (branch naming +
fast ecosystem-counts guard).

---

## Architecture: Source-of-Truth Pattern

**Edit once in `.agents/` → synced to all platforms.** Never edit `.cursor/`, `.claude/`,
`.github/`, `.vscode/` directly — sync scripts own those.

```
.agents/
├── rules/          24 path-scoped rules (lidr-sdlc/, code/, design/, process/, quality/, …)
├── skills/         108 skills (lidr-*, bmad-*)
├── commands/       30 commands
├── subagents/      10 lidr-* workers
├── hooks/          hooks.json + scripts/
├── mcp/            mcp-servers.json
├── _shared/lidr/   validators + UNIFIED-PHASES.md
├── context-manifest.yaml   docs loaded at SessionStart (lidr-load-context hook)
├── adapters/ sync/ lib/    per-platform transforms + unified CLI (sync.sh)
└── orchestrator/AGENTS.md  ← THIS file
```

**Sync strategy per component:** symlinks (skills, commands, subagents — instant);
symlink+copy (rules: Claude symlink, Cursor `.mdc` / Copilot `.instructions.md` copy,
Gemini/Copilot index); generated per-platform JSON (MCP, hooks). Full platform matrix +
per-platform limitations: `.agents/orchestrator-readme.md` and `rules/code/principles.md`.

**Commit patterns:** symlinked resources → commit **source only**; generated configs
(MCP/hooks) → commit **source AND generated**. Conventional Commits; see
`rules/process/git-workflow.md`.

---

## Key Principles

1. **Single source of truth** — edit only `.agents/`; sync handles distribution.
2. **Sync after every change** — `./.agents/sync.sh` (or `--only=…`).
3. **Keep this file lean** — only facts needed every session here; detail → `*-readme.md`,
   procedures → skills, code standards → path-scoped rules (per Claude Code memory docs).
4. **Test on platforms** — `readlink .claude/rules`, `claude mcp list`,
   `ls .github/instructions/*.instructions.md`.
5. **Regression guard** — `app/src/__tests__/ecosystem-coherence.test.ts` fails on
   count / dead-reference / gate-evidence drift. Run `cd app && npm run test:ecosystem`
   after `.agents/` changes (CI-blocking + husky pre-push).

---

## LIDR Spec Lifecycle (Phase 4 · development)

Each change lives in `docs/projects/<CLIENT>/changes/<name>/` with auditable artifacts:
`proposal.md`, `design.md`, `spec.md`, `tasks.md`, `test-report.md`, `reports/`. Archived →
`changes/archive/YYYY-MM-DD-<name>/`.

| Command                                            | Purpose                                                   | Model                     |
| -------------------------------------------------- | --------------------------------------------------------- | ------------------------- |
| `/lidr-spec-new`                                   | scaffold the change container                             | Sonnet                    |
| `/lidr-spec-ff`                                    | fast-forward: generate all 4 artifacts                    | **Opus high**             |
| `/lidr-spec-apply`                                 | implement; **agent runs unit + curl + Playwright itself** | Sonnet                    |
| `/lidr-spec-verify`                                | final verification + `test-report.md`                     | Sonnet → Opus on CRITICAL |
| `/lidr-spec-archive` · `continue` · `bulk-archive` | lifecycle ops                                             | Sonnet                    |

Governed by `rules/lidr-sdlc/spec-execution.md` (mandatory steps: Step 0 branch + unit +
curl + Playwright + docs; **"AGENT MUST EXECUTE"**) and `model-selection.md` (Opus high for
planning, Sonnet medium for implementation). Subagent `lidr-spec-orchestrator` runs
`new → ff → apply → verify → archive` end-to-end. Tracking ticket = unit of work; the change
= versioned repo artifact (N:1).

---

## LIDR SDLC Methodology (quick map)

BMad + LIDR share **one** phase taxonomy since 2026-06-10 (canonical:
`.agents/_shared/lidr/UNIFIED-PHASES.md`). BMad = engine (artifacts); LIDR = governance
(gates, roles). When the user references "fase X" / "gate Y" / a LIDR artifact, use this map.

**5 phases (0-4):** 0 Context & Anytime · 1 Analysis · 2 Planning · 3 Solutioning
(specification + sprint-planning) · 4 Implementation (development + qa + security + release).

**8 gates (G0→G7)** — stage-exit checkpoints; never advance without evaluating via
`/lidr-advance-gate`:
G0 Intake (PME+Sponsor) · G1 PRD (Product+R&D) · G2 Specs (Product+QA) ·
G3 Ready-to-implement (PO+TL) · G4 DoD (Dev+Sec) · G5 QA sign-off (QA Lead) ·
G6 Security (CISO) · G7 CR/Prod (Change Committee).

**Roles:** PME, PO, TL, Dev, QA/QA Lead, Sec/CISO, DevOps, SM. Full RACI + role×command
matrix: `rules/lidr-sdlc/workflows.md`.

**React app:** multi-client; per-client config in `app/src/data/clients/{id}/`; routes
`/{clientId}/{page}` (e.g. `/facephi/prd`). See `app/CLAUDE.md` for React/TS guidance.

---

## Where to find detail

| Topic                                       | File                                                      |
| ------------------------------------------- | --------------------------------------------------------- |
| Rules system, frontmatter, add-a-rule       | `.agents/rules-readme.md`                                 |
| Skills, progressive disclosure, add-a-skill | `.agents/skills-readme.md`                                |
| Commands, per-platform formats              | `.agents/commands-readme.md`                              |
| Subagents                                   | `.agents/subagent-readme.md`                              |
| MCP servers                                 | `.agents/mcp-readme.md`                                   |
| Hooks, per-platform schemas                 | `.agents/hooks-readme.md`                                 |
| Platform matrix, sync internals             | `.agents/orchestrator-readme.md`, `.agents/lib-readme.md` |
| Methodology, RACI, security policy          | `rules/lidr-sdlc/org.md`                                  |
| Active project context                      | `rules/lidr-sdlc/project.md`                              |
| Authoring skills/commands/hooks/MCP/rules   | skill `lidr-agents-architecture`                          |

**Commit format:** Conventional Commits (`feat:`/`fix:`/`docs:`/`refactor:`/`test:`/`chore:`/
`perf:`/`style:`). Subject ≤50 chars, body wrapped at 72, explain WHAT + WHY.
