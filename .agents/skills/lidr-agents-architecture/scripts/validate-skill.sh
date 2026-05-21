#!/bin/bash

# validate-skill.sh
# Validates the structure and content of a skill in .agents/skills/

set -e

SKILL_NAME=$1
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../../.." && pwd)"
SKILL_DIR="$PROJECT_ROOT/.agents/skills/$SKILL_NAME"

if [ -z "$SKILL_NAME" ]; then
  echo "Usage: ./validate-skill.sh <skill-name>"
  echo ""
  echo "Example:"
  echo "  ./validate-skill.sh react-testing"
  exit 1
fi

echo "🔍 Validating skill: $SKILL_NAME"
echo ""

ERRORS=0

# Check 1: Skill directory exists
if [ ! -d "$SKILL_DIR" ]; then
  echo "❌ Skill directory not found: $SKILL_DIR"
  exit 1
else
  echo "✅ Skill directory exists"
fi

# Check 2: SKILL.md exists
if [ ! -f "$SKILL_DIR/SKILL.md" ]; then
  echo "❌ SKILL.md not found in $SKILL_DIR"
  ((ERRORS++))
else
  echo "✅ SKILL.md found"
fi

# Check 3: YAML frontmatter exists
if [ -f "$SKILL_DIR/SKILL.md" ]; then
  if ! head -1 "$SKILL_DIR/SKILL.md" | grep -q "^---$"; then
    echo "❌ Missing YAML frontmatter (should start with ---)"
    ((ERRORS++))
  else
    echo "✅ YAML frontmatter present"
  fi
fi

# Check 4: Required field 'name' exists
if [ -f "$SKILL_DIR/SKILL.md" ]; then
  if ! grep -q "^name:" "$SKILL_DIR/SKILL.md"; then
    echo "❌ Missing required field: 'name' in frontmatter"
    ((ERRORS++))
  else
    echo "✅ Field 'name' present"
  fi
fi

# Check 5: Required field 'description' exists
if [ -f "$SKILL_DIR/SKILL.md" ]; then
  if ! grep -q "^description:" "$SKILL_DIR/SKILL.md"; then
    echo "❌ Missing required field: 'description' in frontmatter"
    ((ERRORS++))
  else
    echo "✅ Field 'description' present"
  fi
fi

# Check 6: Description uses third person
if [ -f "$SKILL_DIR/SKILL.md" ]; then
  description=$(sed -n '/^description:/,/^[a-z]/p' "$SKILL_DIR/SKILL.md" | grep -v "^[a-z]" | tail -n +2)
  if echo "$description" | grep -iq "This skill should be used when"; then
    echo "✅ Description uses third person"
  else
    echo "⚠️  Description should use third person: 'This skill should be used when...'"
    # Not counted as error, just warning
  fi
fi

echo ""
echo "═══════════════════════════════"

if [ $ERRORS -eq 0 ]; then
  echo "✅ Skill validation passed!"
  echo "═══════════════════════════════"
  exit 0
else
  echo "❌ Found $ERRORS error(s)"
  echo "═══════════════════════════════"
  exit 1
fi
