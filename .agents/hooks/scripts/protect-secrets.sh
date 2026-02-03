#!/bin/bash
# protect-secrets.sh - Block edits to sensitive files

set -e

# Read JSON input
INPUT=$(cat)
# Support both Cursor (.file_path) and Claude Code (.tool_input.file_path) formats
FILE_PATH=$(echo "$INPUT" | jq -r '.file_path // .tool_input.file_path // empty')

# Protected patterns
PROTECTED_PATTERNS=(
  ".env"
  ".pem"
  ".key"
  "secrets/"
  "credentials/"
  ".git/config"
  "package-lock.json"
)

# Check if file matches protected pattern
for pattern in "${PROTECTED_PATTERNS[@]}"; do
  if [[ "$FILE_PATH" == *"$pattern"* ]]; then
    # Block the edit
    echo "Blocked: Cannot edit sensitive file '$FILE_PATH' (pattern: '$pattern')" >&2
    exit 2  # Exit 2 = block the action
  fi
done

# Allow the edit - output required JSON
cat <<JSON
{
  "systemMessage": "File protection check passed"
}
JSON

exit 0
