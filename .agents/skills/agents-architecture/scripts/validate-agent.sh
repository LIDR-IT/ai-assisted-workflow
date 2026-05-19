#!/bin/bash

# validate-agent.sh
# Validates the structure and content of an agent in .claude/agents/

set -e

AGENT_NAME=$1
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../../.." && pwd)"
AGENT_FILE="$PROJECT_ROOT/.claude/agents/$AGENT_NAME.md"

if [ -z "$AGENT_NAME" ]; then
  echo "Usage: ./validate-agent.sh <agent-name>"
  echo ""
  echo "Example:"
  echo "  ./validate-agent.sh code-reviewer"
  exit 1
fi

echo "🔍 Validating agent: $AGENT_NAME"
echo ""

ERRORS=0

# Check 1: Agent file exists
if [ ! -f "$AGENT_FILE" ]; then
  echo "❌ Agent file not found: $AGENT_FILE"
  echo "   Note: Agents should be in .claude/agents/ (not .agents/)"
  exit 1
else
  echo "✅ Agent file exists"
fi

# Check 2: YAML frontmatter exists
if ! head -1 "$AGENT_FILE" | grep -q "^---$"; then
  echo "❌ Missing YAML frontmatter (should start with ---)"
  ((ERRORS++))
else
  echo "✅ YAML frontmatter present"
fi

# Check 3: Required field 'name' exists
if ! grep -q "^name:" "$AGENT_FILE"; then
  echo "❌ Missing required field: 'name' in frontmatter"
  ((ERRORS++))
else
  echo "✅ Field 'name' present"
fi

# Check 4: Required field 'description' exists
if ! grep -q "^description:" "$AGENT_FILE"; then
  echo "❌ Missing required field: 'description' in frontmatter"
  ((ERRORS++))
else
  echo "✅ Field 'description' present"
fi

# Check 5: Optional field 'tools' is valid (if present)
if grep -q "^tools:" "$AGENT_FILE"; then
  echo "ℹ️  Field 'tools' present"

  # Check if it's an array format
  tools_line=$(grep "^tools:" "$AGENT_FILE")
  if echo "$tools_line" | grep -q "\["; then
    echo "✅ Tools field appears to be array format"
  else
    echo "⚠️  Tools field should be array format: [Read, Edit, Bash]"
  fi
fi

# Check 6: Optional field 'model' is valid (if present)
if grep -q "^model:" "$AGENT_FILE"; then
  model=$(grep "^model:" "$AGENT_FILE" | awk '{print $2}')
  if [[ "$model" == "sonnet" || "$model" == "opus" || "$model" == "haiku" ]]; then
    echo "✅ Model field valid: $model"
  else
    echo "⚠️  Model should be one of: sonnet, opus, haiku (found: $model)"
  fi
fi

# Check 7: Optional field 'color' is valid (if present)
if grep -q "^color:" "$AGENT_FILE"; then
  color=$(grep "^color:" "$AGENT_FILE" | awk '{print $2}')
  if [[ "$color" =~ ^(red|orange|yellow|green|blue|purple|pink)$ ]]; then
    echo "✅ Color field valid: $color"
  else
    echo "⚠️  Color should be one of: red, orange, yellow, green, blue, purple, pink (found: $color)"
  fi
fi

# Check 8: File has content beyond frontmatter
line_count=$(wc -l < "$AGENT_FILE")
if [ $line_count -lt 10 ]; then
  echo "⚠️  Agent file seems short (<10 lines). Consider adding system prompt content."
fi

echo ""
echo "═══════════════════════════════"

if [ $ERRORS -eq 0 ]; then
  echo "✅ Agent validation passed!"
  echo "═══════════════════════════════"
  echo ""
  echo "Note: This validates structure only."
  echo "Test agent behavior in Claude Code to verify functionality."
  exit 0
else
  echo "❌ Found $ERRORS error(s)"
  echo "═══════════════════════════════"
  exit 1
fi
