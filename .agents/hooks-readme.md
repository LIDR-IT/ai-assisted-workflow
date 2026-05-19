# Hooks System

Source-of-truth for event-driven hooks across 4 AI platforms.

**Source:** `.agents/hooks/hooks.json` → adapters generate platform-specific configs via `./.agents/sync.sh --only=hooks`.

## Registered hooks (6)

### Generic (3)

| Hook              | Event          | Platforms                       | Purpose                                         |
| ----------------- | -------------- | ------------------------------- | ----------------------------------------------- |
| `notify`          | `Notification` | claude, gemini                  | Desktop notification when AI needs user input   |
| `auto-format`     | `PostToolUse`  | claude, gemini, cursor, copilot | Run prettier on edited files                    |
| `protect-secrets` | `PreToolUse`   | claude, gemini, copilot         | Block edits to `.env`, `.key`, `.pem`, secrets/ |

### LIDR SDLC (3, Claude-only)

| Hook                             | Event          | Purpose                                                           |
| -------------------------------- | -------------- | ----------------------------------------------------------------- |
| `lidr-frontmatter-guard`         | `PreToolUse`   | Block .md writes in docs/agents missing required YAML frontmatter |
| `lidr-load-context`              | `SessionStart` | Load project context (PROJECT_TYPE, DTC_ACTIVE, stale-docs count) |
| `lidr-validate-ecosystem-counts` | `Stop`         | Sync 8 sources of truth at session end, block on count drift      |

## Platform support matrix

| Capability         | Claude Code | Gemini CLI        | Cursor                 | Copilot/VSCode             |
| ------------------ | ----------- | ----------------- | ---------------------- | -------------------------- |
| `PreToolUse`       | ✅          | ✅ (`BeforeTool`) | ✅ + blocking variants | ✅                         |
| `PostToolUse`      | ✅          | ✅ (`AfterTool`)  | ✅ (`afterFileEdit`)   | ✅                         |
| `Notification`     | ✅          | ✅                | ❌                     | ❌                         |
| `SessionStart`     | ✅          | ✅                | ✅ (`sessionStart`)    | ✅                         |
| `Stop`             | ✅          | ✅                | ✅                     | ✅                         |
| Matcher applied?   | ✅          | ✅                | partial                | ❌ parsed but not enforced |
| Timeout unit       | seconds     | **ms**            | seconds                | seconds                    |
| Blocking exit code | `2`         | `2`               | requires JSON output   | `2`                        |

## Generated configs by platform

### Claude Code — `.claude/settings.json`

Schema verified against [docs.claude.com](https://code.claude.com/docs/en/hooks). Events in PascalCase, nested `matcher` + `hooks[]`, timeout in **seconds**, env var `${CLAUDE_PROJECT_DIR}`.

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

### Gemini CLI — `.gemini/settings.json`

Schema verified against [geminicli.com/docs/hooks](https://geminicli.com/docs/hooks). Events `BeforeTool`/`AfterTool`/`Notification`/`SessionStart`/`Stop`, `name` required, timeout in **milliseconds** (default 60000), env var `${GEMINI_PROJECT_DIR}` (also accepts `CLAUDE_PROJECT_DIR` alias).

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

### Cursor — `.cursor/hooks.json`

Schema verified against [cursor.com/docs/agent/hooks](https://cursor.com/docs/agent/hooks). `version: 1` required, field is `command` (NOT `scriptPath`), timeout in **seconds**. Current setup deploys auto-format only via `afterFileEdit` + `afterTabFileEdit`. Cursor **also** supports blocking via `preToolUse`/`beforeShellExecution`/`beforeReadFile`/`beforeMCPExecution` with `failClosed: true` — not currently used (Husky pre-commit handles secret-guarding for Cursor flow).

```json
{
  "version": 1,
  "hooks": {
    "afterFileEdit": [{ "command": "bash .cursor/hooks/scripts/auto-format.sh", "timeout": 30 }],
    "afterTabFileEdit": [{ "command": "bash .cursor/hooks/scripts/auto-format.sh", "timeout": 30 }]
  }
}
```

### Copilot/VSCode — `.github/hooks/hooks.json`

Schema verified against [code.visualstudio.com/docs/copilot/customization/hooks](https://code.visualstudio.com/docs/copilot/customization/hooks) and [docs.github.com/en/copilot/reference/hooks-configuration](https://docs.github.com/en/copilot/reference/hooks-configuration). `version: 1`, events in PascalCase, **`type: "command"` is required** by VSCode, timeout in **seconds**. VSCode parses `matcher` but **does not enforce it** (hooks fire on every tool use regardless of matcher). Tool names differ from Claude (e.g. `create_file`, `replace_string_in_file`), so matchers matching Claude tool names are effectively no-ops in VSCode — kept for Copilot CLI compatibility.

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

## Directory layout

```
.agents/hooks/
├── hooks.json                          # ← Source of truth
├── scripts/                            # Generic, cross-platform
│   ├── auto-format.sh
│   ├── notify.sh
│   ├── protect-secrets.sh
│   └── lib/
└── lidr/                               # LIDR SDLC, Claude-only
    ├── frontmatter-guard.sh
    ├── load-context.sh
    └── validate-ecosystem-counts.sh
```

After sync, each platform gets a symlink or copy:

- Claude: `.claude/hooks/` → `.agents/hooks/` (full symlink)
- Gemini: `.gemini/hooks/` → `.agents/hooks/` (full symlink)
- Cursor: `.cursor/hooks/scripts/` → `.agents/hooks/scripts/` (symlink)
- Copilot: `.github/hooks/scripts/` → `.agents/hooks/scripts/` (symlink)

## Quick start

```bash
# Sync only hooks
./.agents/sync.sh --only=hooks

# Verify per platform
jq .hooks .claude/settings.json
jq .hooks .gemini/settings.json
cat .cursor/hooks.json
cat .github/hooks/hooks.json
```

## Add a new hook

1. Write script in `.agents/hooks/scripts/<name>.sh` (or `.agents/hooks/lidr/` for SDLC-specific).
2. `chmod +x` it.
3. Register in `.agents/hooks/hooks.json`:

   ```json
   "<name>": {
     "event": "PreToolUse | PostToolUse | Notification | SessionStart | Stop",
     "matcher": "Edit|Write",
     "command": "bash \"${PLUGIN_ROOT}/hooks/scripts/<name>.sh\"",
     "timeout": 10,
     "platforms": ["claude", "gemini", "cursor", "copilot"],
     "description": "What it does"
   }
   ```

   Note: source uses `${PLUGIN_ROOT}` placeholder + `timeout` in **seconds**. Adapters rewrite to platform-specific paths and convert timeout for Gemini (× 1000).

4. Re-sync: `./.agents/sync.sh --only=hooks`.

## Exit codes (cross-platform convention)

| Code | Meaning                                                                       |
| ---- | ----------------------------------------------------------------------------- |
| `0`  | Success, action proceeds                                                      |
| `1`  | Non-blocking error, stderr shown, action proceeds                             |
| `2`  | Blocking (PreToolUse only) — stderr shown, action denied. Claude/Gemini both. |

For VSCode-specific blocking semantics, return JSON with `decision: "block"`.

## Limitations summary (per platform docs)

- **Claude:** `command` hooks run without controlling tty since v2.1.139; use `terminalSequence` for terminal effects.
- **Gemini:** No documented matcher unification with Claude; relies on tool-name regex.
- **Cursor:** Hooks fail-open by default — set `"failClosed": true` for security-critical blocking.
- **Copilot/VSCode:** Matchers ignored; tool names differ from Claude (`create_file`, `replace_string_in_file`); cross-platform commands need `windows`/`linux`/`osx` overrides.

## Troubleshooting

**Hook not firing on Claude:**

```bash
jq '.hooks' .claude/settings.json    # confirm registration
ls -la .claude/hooks/scripts/        # confirm script exists + executable
```

**Hook not firing on Copilot:**

- Confirm `type: "command"` is present (was a bug fixed May 2026).
- Restart VSCode (it caches hook config at startup).

**Path errors at runtime:**

- Source uses `${PLUGIN_ROOT}` (template). Adapters convert to:
  - Claude: `${CLAUDE_PROJECT_DIR}/.claude`
  - Gemini: `${GEMINI_PROJECT_DIR}/.gemini`
  - Cursor: relative `.cursor/hooks/scripts/...`
  - Copilot: relative `.github/hooks/scripts/...`

## Official references

- [Claude Code hooks](https://code.claude.com/docs/en/hooks)
- [Cursor agent hooks](https://cursor.com/docs/agent/hooks)
- [Gemini CLI hooks](https://geminicli.com/docs/hooks)
- [VSCode Copilot hooks](https://code.visualstudio.com/docs/copilot/customization/hooks)
- [GitHub Copilot hooks reference](https://docs.github.com/en/copilot/reference/hooks-configuration)
