#!/bin/bash

# validate-command.sh
# Validates the structure and content of a command in .agents/commands/

set -e

COMMAND_NAME=$1
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../../.." && pwd)"
COMMAND_FILE="$PROJECT_ROOT/.agents/commands/$COMMAND_NAME.md"

if [ -z "$COMMAND_NAME" ]; then
  echo "Usage: ./validate-command.sh <command-name>"
  echo ""
  echo "Example:"
  echo "  ./validate-command.sh security-review"
  exit 1
fi

echo "🔍 Validating command: $COMMAND_NAME"
echo ""

ERRORS=0

# Check 1: Command file exists
if [ ! -f "$COMMAND_FILE" ]; then
  echo "❌ Command file not found: $COMMAND_FILE"
  exit 1
else
  echo "✅ Command file exists"
fi

# Check 2: File is readable
if [ ! -r "$COMMAND_FILE" ]; then
  echo "❌ Command file is not readable"
  ((ERRORS++))
else
  echo "✅ File is readable"
fi

# Check 3: File has content
if [ ! -s "$COMMAND_FILE" ]; then
  echo "❌ Command file is empty"
  ((ERRORS++))
else
  echo "✅ File has content"
fi

# Check 4: File is valid markdown (basic check)
if [ -f "$COMMAND_FILE" ] && [ -s "$COMMAND_FILE" ]; then
  # Just check it doesn't have binary data
  if file "$COMMAND_FILE" | grep -q "text"; then
    echo "✅ File appears to be valid text/markdown"
  else
    echo "❌ File doesn't appear to be text"
    ((ERRORS++))
  fi
fi

# Check 5: If frontmatter exists, validate it
if [ -f "$COMMAND_FILE" ]; then
  if head -1 "$COMMAND_FILE" | grep -q "^---$"; then
    echo "ℹ️  Frontmatter detected"

    # Check frontmatter ends properly
    if tail -n +2 "$COMMAND_FILE" | grep -q "^---$"; then
      echo "✅ Frontmatter properly closed"
    else
      echo "❌ Frontmatter not properly closed (missing closing ---)"
      ((ERRORS++))
    fi
  else
    echo "ℹ️  No frontmatter (optional for commands)"
  fi
fi

echo ""
echo "═══════════════════════════════"

if [ $ERRORS -eq 0 ]; then
  echo "✅ Command validation passed!"
  echo "═══════════════════════════════"
  exit 0
else
  echo "❌ Found $ERRORS error(s)"
  echo "═══════════════════════════════"
  exit 1
fi
