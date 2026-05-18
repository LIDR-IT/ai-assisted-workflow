#!/bin/bash
# frontmatter-guard.sh — Command hook for PreToolUse (Write|Edit)
# Enforces YAML frontmatter compliance on .md files
#
# Checks:
#   1. New .md files MUST have YAML frontmatter (---) → BLOCK if missing
#   2. Edited .md files SHOULD update last_updated → WARN if not updated
#
# Monitored paths: docs/, .claude/rules/, .claude/skills/
# Input: JSON via stdin per Claude Code hook spec
# Output: JSON with hookSpecificOutput.permissionDecision
#
# Version: 1.2.0 | 2026-03-25

set -euo pipefail

# Save stdin to variable first (hook input JSON)
INPUT=$(cat)

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

# Only check monitored paths
monitored = ["docs/", ".claude/rules/", ".claude/skills/"]
in_scope = any(m in file_path for m in monitored)
if not in_scope:
    print("SKIP")
    sys.exit(0)

# Determine if this is a NEW file (Write with content) or EDIT
is_new_file = bool(content) and not old_string
is_edit = bool(old_string)

if is_new_file:
    # Check 1: New .md must have frontmatter
    has_frontmatter = content.strip().startswith("---")
    if not has_frontmatter:
        print("BLOCK_NO_FRONTMATTER")
        print(file_path)
    else:
        # Check if frontmatter has last_updated
        if "last_updated" not in content[:500]:
            print("WARN_MISSING_LAST_UPDATED")
            print(file_path)
        else:
            print("SKIP")
elif is_edit:
    # Check 2: Edit to .md should include last_updated bump
    try:
        if os.path.exists(file_path):
            with open(file_path) as f:
                existing = f.read()
            has_frontmatter = existing.strip().startswith("---")
            if has_frontmatter and "last_updated" in existing[:500]:
                # File has frontmatter — check if edit touches metadata
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

# Parse the result
ACTION=$(echo "$RESULT" | head -1)
FILE=$(echo "$RESULT" | tail -1)

case "$ACTION" in
    BLOCK_NO_FRONTMATTER)
        echo "{\"hookSpecificOutput\":{\"hookEventName\":\"PreToolUse\",\"permissionDecision\":\"deny\",\"permissionDecisionReason\":\"New .md file '${FILE}' is missing YAML frontmatter (--- block at top). Per rules/documentation.md, ALL .md files require frontmatter with: id, version, last_updated, updated_by, status. Use the appropriate skill template or add frontmatter manually.\"}}"
        ;;
    WARN_MISSING_LAST_UPDATED)
        echo "{\"hookSpecificOutput\":{\"hookEventName\":\"PreToolUse\",\"permissionDecision\":\"allow\",\"permissionDecisionReason\":\"New .md file '${FILE}' has frontmatter but is missing last_updated field.\"}}"
        ;;
    WARN_FRONTMATTER_NOT_UPDATED)
        echo "{\"hookSpecificOutput\":{\"hookEventName\":\"PreToolUse\",\"permissionDecision\":\"allow\",\"permissionDecisionReason\":\"Editing '${FILE}' but frontmatter (last_updated/version) was not updated.\"}}"
        ;;
    *)
        echo "{\"hookSpecificOutput\":{\"hookEventName\":\"PreToolUse\",\"permissionDecision\":\"allow\"}}"
        ;;
esac
