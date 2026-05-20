# Setup LIDR Ecosystem — Portable Initiator

**Purpose**: tell any coding agent how to install and configure the LIDR ecosystem (rules, skills, commands, subagents, hooks, MCP, sync infrastructure) into a target project. Native to the LIDR framework — **zero external CLI dependencies** (no `npm install -g` of third-party schemas).

Source: this repository (`lidr-ecosystem`). When this file is deployed alongside `.agents/`, any coding agent can run it on a target repo to bootstrap the framework.

---

## What the coding agent must do

Execute these steps in order on the **target** project root. Perform setup directly; do not ask the user to run commands unless a manual approval is required.

### 1) Preflight validation

Verify all of the following in the target project root:

1. It is a git repository (`git rev-parse --is-inside-work-tree`)
2. The user has write permissions on the directory
3. `node` is available and version is `>= 20.19.0` (for the React app + scripts)
4. `bash` is available
5. `jq` is available (the sync.sh script requires it)

If any check fails, stop and report exactly what is missing.

### 2) Resolve the LIDR source

The LIDR ecosystem source is THIS repository. Identify it via one of:

- Local clone path provided by the user (e.g., `/path/to/lidr-ecosystem`)
- Git URL: clone with `git clone --depth 1 <repo-url> /tmp/lidr-source`
- Already vendored inside the target repo at `.lidr-source/` (if a previous setup did so)

Store the path in `LIDR_SOURCE` for the rest of the script.

### 3) Import the `.agents/` source of truth

Copy `.agents/` from `LIDR_SOURCE` into the target project root **without overwriting existing files**:

```bash
cp -rn "$LIDR_SOURCE/.agents" .
```

Use `cp -rn` exactly:

- `-r` recursive
- `-n` no-clobber (preserves anything the target already has)

If the target already has a `.agents/`, the agent must **merge carefully**:

- Add new files (skills, commands, rules, subagents) that are not yet present
- Never overwrite existing user customizations
- Report which files were skipped because they already existed

### 4) Import the orchestrator symlinks

Create the root-level orchestrator symlinks so each AI platform finds its config file:

```bash
ln -sfn .agents/orchestrator/AGENTS.md AGENTS.md
ln -sfn .agents/orchestrator/AGENTS.md CLAUDE.md
ln -sfn .agents/orchestrator/AGENTS.md GEMINI.md
```

(`-f` to overwrite if a symlink already exists, `-n` to treat the target as a file not as a directory traversal.)

If the target already has a non-symlink `CLAUDE.md` / `AGENTS.md` / `GEMINI.md`, **do not overwrite**. Report the conflict and let the user resolve.

### 5) Run the unified sync

The LIDR ecosystem distributes its artifacts to 5 platforms via a single script:

```bash
./.agents/sync.sh
```

This generates / updates:

- `.cursor/rules/`, `.cursor/skills/` (symlinks), `.cursor/commands/` (symlinks), `.cursor/mcp.json` (generated)
- `.claude/rules/` (symlink), `.claude/skills/` (symlink), `.claude/commands/` (symlink), `.claude/subagents/` (symlink)
- `.gemini/settings.json`, `.gemini/commands/*.toml` (generated from `.md`)
- `.github/instructions/*.instructions.md` (Copilot), `.github/prompts/*.prompt.md` (Copilot), `.github/agents/*.agent.md` (Copilot), `.vscode/mcp.json` (generated)
- `.agents/workflows` → symlink to `.agents/commands` (for Antigravity)
- `.mcp.json` at the repo root (Claude Code MCP config)

If the sync fails, capture the exact error and stop. Common causes:

- Missing `jq`
- Broken symlinks pre-existing in the target

### 6) Verify ecosystem integrity

Run the LIDR counts validator:

```bash
# If the hook is available as a standalone script:
bash .agents/hooks/lidr/validate-ecosystem-counts.sh

# Or via the SessionStart hook flow (just open a Claude session in the target)
```

Expected (after this version): skills ~68, commands ~37, subagents ~10, rules ~24, hooks ~6.

If counts mismatch the expected values, the validator reports drift. The agent updates the expected values in the script if the drift is intentional, or re-syncs if it's a transient inconsistency.

Verify symlinks:

```bash
readlink AGENTS.md          # → .agents/orchestrator/AGENTS.md
readlink CLAUDE.md          # → .agents/orchestrator/AGENTS.md
readlink .cursor/skills     # → ../.agents/skills
readlink .claude/skills     # → ../.agents/skills
ls -la .agents/workflows    # symlink → commands
```

### 7) Configure the active client

The LIDR ecosystem supports multi-client deployment. Configure the active client:

1. Identify which client this target repo represents (e.g., `docline`, `facephi`, `aramis`, `base`)
2. Create or update `src/data/client.ts` (or equivalent for the project type) to set the active client code
3. Verify `docs/projects/<CLIENT_CODE>/` exists and contains at least:
   - `project-overview.md`
   - `architecture.md`
   - `team.md`
   - The `changes/` and `changes/archive/` subdirectories (created on demand by `/lidr-spec-new`)

If `docs/projects/<CLIENT_CODE>/` doesn't exist, use `/lidr-init-project-docs <client-code>` (LIDR command) to scaffold it from templates.

### 8) Configure MCP servers (Context7 + Playwright)

The LIDR ecosystem uses Context7 (library docs) and Playwright (browser automation) by default.

```bash
# Set environment variables for API keys:
echo "CONTEXT7_API_KEY=<your-key>" >> .agents/mcp/.env
```

Re-run `./.agents/sync.sh --only=mcp` to propagate to all platforms.

Verify (Claude Code):

```bash
claude mcp list
# should show: context7, playwright, chrome-devtools
```

### 9) First-draft project context (if missing)

If the target project has generic or missing technical documentation under `docs/projects/<CLIENT_CODE>/`, the agent generates a first draft:

1. Use `/lidr-document-project <CLIENT_CODE>` (LIDR command) — analyzes the repo and drafts:
   - `business-case.md`, `prd-tecnico.md`, `prd-funcional.md`
   - `architecture.md`, `data-model.md`
   - `tech-stack.md` overrides if any
2. Mark every section with `[REQUIERE VALIDACIÓN HUMANA]` where assumptions were made
3. Ask the user to review before promoting drafts to `status: active`

**Hard requirements**:

- Perform deep repository research before writing anything
- Analyze package manifests, lockfiles, source tree, tests, CI workflows, lint/format configs, current docs
- Infer real stack from evidence — do NOT invent
- Keep technical artifacts in English; business documents in Spanish (per `lidr-sdlc/org.md` §6.2)

### 10) Completion output

When done, report:

```
✅ LIDR Ecosystem installed

Source:           <path or repo>
Target:           <pwd>
Platforms synced: cursor, claude, gemini, copilot, antigravity
Active client:    <CLIENT_CODE>

Counts (post-install):
  rules:      24
  skills:     68
  commands:   37
  subagents:  10
  hooks:      6
  MCP servers: 3 (context7, playwright, chrome-devtools)

Symlinks verified:
  CLAUDE.md  → .agents/orchestrator/AGENTS.md
  AGENTS.md  → .agents/orchestrator/AGENTS.md
  GEMINI.md  → .agents/orchestrator/AGENTS.md
  .cursor/skills, .claude/skills → ../.agents/skills

Next steps:
  Open the project in your AI agent of choice. The LIDR ecosystem will load
  the manifest (.agents/context-manifest.yaml) on SessionStart via the
  lidr-load-context hook.

  Try:
    /lidr-help                     → explore the ecosystem
    /lidr-init-project-docs <X>    → scaffold docs/projects/<X>/ if missing
    /lidr-spec-new <change-name>   → create your first LIDR change container
```

---

## Post-installation quick reference

### LIDR change lifecycle (Fase 5 — Desarrollo)

```bash
/lidr-spec-new <name>        # scaffold docs/projects/<client>/changes/<name>/
/lidr-spec-ff <name>         # fast-forward planning (Opus high)
/lidr-spec-apply <name>      # implement tasks (Sonnet medium, AGENT MUST EXECUTE tests)
/lidr-spec-verify <name>     # final verification + test-report.md
/lidr-spec-archive <name>    # move to changes/archive/YYYY-MM-DD-<name>/
```

Or end-to-end via subagent: invoke `lidr-spec-orchestrator` with an enriched US.

### Parallel work

```bash
# Fill parallel-tasks.md at repo root with task blocks
# Then say: "run parallel-tasks.md"
# The lidr-run-parallel-tasks skill spawns N sub-agents in worktrees
```

See `.agents/skills/lidr-run-parallel-tasks/references/parallel-tasks-template.md`.

### Phase-gate workflow (LIDR SDLC)

```bash
/lidr-advance-gate 0..7      # formal gate transitions
/lidr-validate-prd           # PRD quality validation
/lidr-validate-requirements  # RF/NFR coherence + RTM
/lidr-implement-ticket <id>  # ticket-driven dev workflow
/lidr-prepare-testing <id>   # QA suite generation
```

Full role × command matrix: `.agents/rules/lidr-sdlc/workflows.md`.

---

## Troubleshooting

| Symptom                                      | Resolution                                                                                                 |
| -------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `jq: command not found`                      | Install: `brew install jq` (macOS) or `apt install jq` (Linux)                                             |
| Symlinks not created on Windows              | Enable Developer Mode (Settings → Update & Security → For Developers) or run as Administrator              |
| `validate-ecosystem-counts` blocks Stop hook | Update expected values in the script if drift is intentional, or re-run sync                               |
| Claude `mcp list` shows no servers           | Verify `CONTEXT7_API_KEY` in `.agents/mcp/.env`; re-run `./.agents/sync.sh --only=mcp`; restart Claude     |
| Cursor doesn't show skills                   | Verify `.cursor/skills` is a symlink (`readlink .cursor/skills` → `../.agents/skills`); re-run sync if not |

---

## Design principles (why this is portable)

1. **Source of truth in `.agents/`** — every rule, skill, command, subagent, hook, MCP config lives in one directory. Edit once, sync everywhere.
2. **No external CLI** — the LIDR ecosystem does not require any `npm install -g`. All logic is in bash + LIDR markdown artifacts.
3. **Multi-platform native** — `./.agents/sync.sh` distributes to Cursor, Claude Code, Gemini CLI, GitHub Copilot, and Antigravity using each platform's official path conventions.
4. **Multi-client by design** — the active client is configured via `src/data/client.ts` (or env var). All project docs live under `docs/projects/<CLIENT_CODE>/`.
5. **Change containers in repo, not Jira** — the `/lidr-spec-*` lifecycle produces versionable artifacts in `docs/projects/<CLIENT_CODE>/changes/`. Jira tickets reference these; the repo is the audit trail.

---

## References

- Orchestrator: `.agents/orchestrator/AGENTS.md`
- Standards: `.agents/rules/lidr-sdlc/{org,project,tech-stack,workflows,documentation,spec-execution,model-selection}.md`
- Sync infrastructure: `.agents/sync.sh`, `.agents/lib/`, `.agents/adapters/`
- Manifest: `.agents/context-manifest.yaml`
- LIDR SDLC methodology: `.agents/rules/lidr-sdlc/org.md`
