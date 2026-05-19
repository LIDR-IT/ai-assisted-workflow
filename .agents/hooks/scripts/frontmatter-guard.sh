#!/bin/bash
# frontmatter-guard.sh — PreToolUse hook (Write|Edit) for .md files
#
# Enforces the YAML frontmatter convention described in
# .agents/rules/lidr-sdlc/documentation.md:
#   - new .md files under docs/, .agents/rules/, or .agents/skills/ MUST
#     start with a `---` frontmatter block → block if missing
#   - edits to existing .md files SHOULD bump last_updated → warn if not
#
# Cross-platform behavior:
#   - Claude / Gemini parse the hookSpecificOutput JSON for nice deny messages
#   - Other platforms (Copilot, etc.) honor the non-zero exit on block
#
# Version: 1.3.0 | 2026-05-19

set -uo pipefail

# Read stdin once (hook input JSON)
INPUT=$(cat)

# Bail out cleanly if python3 isn't available (don't block the agent).
if ! command -v python3 >/dev/null 2>&1; then
  echo '{"hookSpecificOutput":{"hookEventName":"PreToolUse","permissionDecision":"allow"}}'
  exit 0
fi

# Pipe saved input to python3 for safe JSON parsing
RESULT=$(echo "$INPUT" | python3 -c '
import json, sys, os

try:
    data = json.loads(sys.stdin.read())
except Exception:
    print("SKIP")
    sys.exit(0)

# Extract tool_input (nested per Claude Code hook spec)
tool_input = data.get("tool_input", {})
if isinstance(tool_input, str):
    try:
        tool_input = json.loads(tool_input)
    except Exception:
        print("SKIP")
        sys.exit(0)

file_path = tool_input.get("file_path", "")
content = tool_input.get("content", "")
old_string = tool_input.get("old_string", "")
new_string = tool_input.get("new_string", "")

# Only check .md files
if not file_path.endswith(".md"):
    print("SKIP")
    sys.exit(0)

# Only enforce inside the source-of-truth tree and docs/
monitored = ["docs/", ".agents/rules/", ".agents/skills/"]
in_scope = any(m in file_path for m in monitored)
if not in_scope:
    print("SKIP")
    sys.exit(0)

# Determine if this is a NEW file (Write with content) or EDIT
is_new_file = bool(content) and not old_string
is_edit = bool(old_string)

if is_new_file:
    has_frontmatter = content.strip().startswith("---")
    if not has_frontmatter:
        print("BLOCK_NO_FRONTMATTER")
        print(file_path)
    elif "last_updated" not in content[:500]:
        print("WARN_MISSING_LAST_UPDATED")
        print(file_path)
    else:
        print("SKIP")
elif is_edit:
    try:
        if os.path.exists(file_path):
            with open(file_path) as f:
                existing = f.read()
            has_frontmatter = existing.strip().startswith("---")
            if has_frontmatter and "last_updated" in existing[:500]:
                edits_frontmatter = "last_updated" in new_string or "version" in new_string
                if not edits_frontmatter:
                    print("WARN_FRONTMATTER_NOT_UPDATED")
                    print(file_path)
                else:
                    print("SKIP")
            else:
                print("SKIP")
        else:
            print("SKIP")
    except Exception:
        print("SKIP")
else:
    print("SKIP")
')

ACTION=$(echo "$RESULT" | head -1)
FILE=$(echo "$RESULT" | tail -1)

case "$ACTION" in
    BLOCK_NO_FRONTMATTER)
        echo "{\"hookSpecificOutput\":{\"hookEventName\":\"PreToolUse\",\"permissionDecision\":\"deny\",\"permissionDecisionReason\":\"New .md file '${FILE}' is missing YAML frontmatter (--- block at top). Per .agents/rules/lidr-sdlc/documentation.md, ALL .md files in monitored paths require frontmatter with: id, version, last_updated, updated_by, status. Use the appropriate skill template or add frontmatter manually.\"}}"
        # Non-zero exit gives platforms without JSON-decision support a portable block.
        exit 2
        ;;
    WARN_MISSING_LAST_UPDATED)
        echo "{\"hookSpecificOutput\":{\"hookEventName\":\"PreToolUse\",\"permissionDecision\":\"allow\",\"permissionDecisionReason\":\"New .md file '${FILE}' has frontmatter but is missing last_updated field.\"}}"
        exit 0
        ;;
    WARN_FRONTMATTER_NOT_UPDATED)
        echo "{\"hookSpecificOutput\":{\"hookEventName\":\"PreToolUse\",\"permissionDecision\":\"allow\",\"permissionDecisionReason\":\"Editing '${FILE}' but frontmatter (last_updated/version) was not updated.\"}}"
        exit 0
        ;;
    *)
        echo '{"hookSpecificOutput":{"hookEventName":"PreToolUse","permissionDecision":"allow"}}'
        exit 0
        ;;
esac
