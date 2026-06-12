---
id: hook-development
version: "1.0.0"
last_updated: "2026-06-12"
updated_by: "TL: meta-tooling consolidation"
status: active
type: reference
review_cycle: 90
next_review: "2026-09-12"
owner_role: "Tech Lead"
---

# Hook Development — Event-Driven Automation

Design and implement hooks for event-driven workflow automation: quality gates,
security guards, session context loading, and DTC validation. Domain-agnostic — works
for any SDLC workflow regardless of industry or tech stack.

> Trigger phrases this reference covers: "create a hook", "hooks", "PreToolUse",
> "PostToolUse", "Stop", "SessionStart", "DTC validation", "security scanning",
> "workflow automation", "write guard", "session hook". Hooks are **how a quality or
> security check is enforced automatically on every relevant AI action.** Do NOT use
> hooks for slash-command creation (`command-development.md`) or one-time checks.

In the LIDR ecosystem, hook **source of truth** is `.agents/hooks/hooks.json` +
`.agents/hooks/scripts/`. Sync distributes per-platform (Claude full, Cursor/Copilot
partial, Antigravity global-only). See the project `CLAUDE.md` "Git Hooks System" for
the per-platform config schemas and the live 6-hook inventory.

## Why hooks matter

Hooks are **automated quality gates** — essential for sensitive-data protection,
compliance enforcement, and security-first development. Manual validation is
error-prone; hooks ensure consistent enforcement across all workflows. Core use cases:
block PII/secret logging (PreToolUse), enforce compliance, run security checklists
before stop (Stop), DTC validation (write guards), and context loading (SessionStart).

## Hook types

- **Prompt-based hooks** — LLM reasoning detects complex policy violations regex cannot
  catch (semantic understanding, contextual privacy, regulatory rules, fewer false
  positives). Supported on PreToolUse, Stop, SubagentStop, UserPromptSubmit.

  ```json
  {
    "type": "prompt",
    "prompt": "CRITICAL: Evaluate if this operation violates the data protection policy. Check for sensitive data in logs, PII exposure, missing consent. BLOCK if any violation. $TOOL_INPUT",
    "timeout": 30
  }
  ```

- **Command hooks** — fast, deterministic checks (<100ms): secret detection, path
  validation, dependency scanning, build-artifact checks.

  ```json
  {
    "type": "command",
    "command": "bash ${CLAUDE_PLUGIN_ROOT}/scripts/security-scan.sh",
    "timeout": 10
  }
  ```

## Configuration formats

**Plugin `hooks/hooks.json`** uses a wrapper (`description` optional, `hooks` required):

```json
{ "description": "Validation hooks", "hooks": { "PreToolUse": [ ... ], "Stop": [ ... ] } }
```

**User settings** (`.claude/settings.json`) use the direct format — events at top level,
no wrapper, no description. The event structures below go inside either format.

## Hook events

| Event              | When           | Use for                                    |
| ------------------ | -------------- | ------------------------------------------ |
| `PreToolUse`       | Before tool    | Validation, modification, approve/deny/ask |
| `PostToolUse`      | After tool     | Feedback, logging, DTC validation          |
| `UserPromptSubmit` | User input     | Context injection, validation              |
| `Stop`             | Agent stopping | Completeness / security-gate check         |
| `SubagentStop`     | Subagent done  | Task validation                            |
| `SessionStart`     | Session begins | Context loading, env var injection         |
| `SessionEnd`       | Session ends   | Cleanup, logging, state preservation       |
| `PreCompact`       | Before compact | Preserve critical context                  |
| `Notification`     | User notified  | Logging, reactions                         |

**PreToolUse output** (approve/deny/ask + optional input rewrite):

```json
{
  "hookSpecificOutput": {
    "permissionDecision": "allow|deny|ask",
    "updatedInput": { "field": "new" }
  },
  "systemMessage": "Explanation for the agent"
}
```

**Stop/SubagentStop output** (`{"decision": "approve|block", "reason": "..."}`).
**Standard output** for all hooks: `{"continue": true, "suppressOutput": false,
"systemMessage": "..."}`. **Exit codes:** `0` success (stdout in transcript), `2`
blocking error (stderr fed back to the agent), other = non-blocking error.

**SessionStart** can persist env vars by appending to `$CLAUDE_ENV_FILE` — used to
inject project context (`PROJECT_TYPE`, compliance flags, DTC mode) into every session.

## Hook input & environment

All hooks receive JSON on stdin with common fields (`session_id`, `transcript_path`,
`cwd`, `permission_mode`, `hook_event_name`). Event-specific: `tool_name`/`tool_input`/
`tool_result` (Pre/PostToolUse), `user_prompt` (UserPromptSubmit), `reason` (Stop).
Access in prompts via `$TOOL_INPUT`, `$TOOL_RESULT`, `$USER_PROMPT`, `$REASON`.

Environment variables in command hooks: `$CLAUDE_PROJECT_DIR` (project root),
`$CLAUDE_PLUGIN_ROOT` (plugin dir — **always use for portable paths**), `$CLAUDE_ENV_FILE`
(SessionStart only), `$CLAUDE_CODE_REMOTE`.

## Matchers

Match tool names: exact `"Write"`, multiple `"Read|Write|Edit"`, wildcard `"*"`, regex
`"mcp__.*__delete.*"`. Matchers are **case-sensitive**. Common: `"mcp__.*"` (all MCP
tools), `"mcp__plugin_asana_.*"` (one plugin's MCP), `"Bash"` (bash only).

## Security best practices

- **Validate inputs** in command hooks (parse via `jq`, reject malformed tool names).
- **Quote all bash variables** (`"$file_path"`, not `$file_path`) — injection risk.
- **Set timeouts** (command default 60s, prompt 30s; keep hooks fast).
- **Block credential/PII patterns** and writes to `*/secrets/`, `*/credentials/`.
- **Production vs development strictness** — gate zero-tolerance checks behind a
  `.production-mode` flag or `project-config.json` strictness setting.

DO: prompt hooks for complex logic, `${CLAUDE_PLUGIN_ROOT}` for portability, structured
JSON output, thorough testing. DON'T: hardcoded paths, trust unvalidated input,
long-running hooks (>60s), rely on execution order (all matching hooks run **in
parallel** — design for independence), log sensitive data, skip security hooks.

## Lifecycle & debugging

Hooks **load at session start** — editing `hooks.json` or scripts has no effect on the
current session; restart the agent to reload. Invalid JSON fails loading; missing
scripts warn. Use `/hooks` to review loaded hooks, `claude --debug` for execution logs.

Test a command hook directly:

```bash
echo '{"tool_name": "Write", "tool_input": {"file_path": "/test"}}' | bash ./hook.sh
echo "Exit: $?"
# Validate JSON output:
./hook.sh < test-input.json | jq .
```

## Example scripts

Working examples in `../examples/hook-scripts/`:

- `validate-write.sh` — PreToolUse file-write validation (path traversal, system dirs,
  sensitive files).
- `validate-bash.sh` — PreToolUse bash-command validation (destructive ops, privilege
  escalation).
- `load-context.sh` — SessionStart project-type detection + env var injection.

For LIDR's live hooks (security guard, DTC frontmatter guard, context loader, ecosystem
counts), see `.agents/hooks/scripts/` and the `CLAUDE.md` hooks inventory.
