#!/bin/bash
# auto-format.sh - Auto-format edited files with prettier

set -e

# Read JSON input from stdin
INPUT=$(cat)

# Extract file path (support both Cursor and Claude Code formats)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // .file_path // empty')

# Skip if no file path
if [ -z "$FILE_PATH" ] || [ ! -f "$FILE_PATH" ]; then
  cat <<JSON
{
  "systemMessage": "Skipped: No valid file path"
}
JSON
  exit 0
fi

# Check for prettier and format
if command -v prettier &>/dev/null; then
  if prettier --write "$FILE_PATH" &>/dev/null; then
    cat <<JSON
{
  "systemMessage": "Formatted with Prettier"
}
JSON
  else
    cat <<JSON
{
  "systemMessage": "Prettier formatting skipped (not supported)"
}
JSON
  fi
else
  cat <<JSON
{
  "systemMessage": "Prettier not installed"
}
JSON
fi

exit 0
