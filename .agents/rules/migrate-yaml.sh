#!/bin/bash

# migrate-yaml.sh - Migrate rule YAML frontmatter to universal format
# This script helps update existing rules to use the universal YAML format
# that works across all platforms (Cursor, Claude, Gemini, Antigravity)

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
RULES_DIR="$SCRIPT_DIR"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo "🔄 YAML Frontmatter Migration Tool"
echo ""
echo "This script will analyze your rules and suggest YAML frontmatter updates"
echo "for cross-platform compatibility (Cursor, Claude, Gemini, Antigravity)."
echo ""

# Function to extract YAML frontmatter
extract_yaml() {
  local file=$1
  awk '/^---$/{if(++n==2) exit} n==1{print}' "$file" | grep -v "^---$"
}

# Function to check if file has YAML frontmatter
has_yaml() {
  local file=$1
  head -1 "$file" | grep -q "^---$"
}

# Function to analyze YAML fields
analyze_yaml() {
  local file=$1
  local yaml=$(extract_yaml "$file")

  local has_name=$(echo "$yaml" | grep -c "^name:" || true)
  local has_description=$(echo "$yaml" | grep -c "^description:" || true)
  local has_always_apply=$(echo "$yaml" | grep -c "^alwaysApply:" || true)
  local has_globs=$(echo "$yaml" | grep -c "^globs:" || true)
  local has_argument_hint=$(echo "$yaml" | grep -c "^argument-hint:" || true)
  local has_paths=$(echo "$yaml" | grep -c "^paths:" || true)
  local has_trigger=$(echo "$yaml" | grep -c "^trigger:" || true)

  # Score based on platform support
  local score=0
  [ $has_name -gt 0 ] && ((score++))
  [ $has_description -gt 0 ] && ((score++))
  [ $has_always_apply -gt 0 ] && ((score++))
  [ $has_globs -gt 0 ] && ((score++))
  [ $has_argument_hint -gt 0 ] && ((score++))
  [ $has_paths -gt 0 ] && ((score++))
  [ $has_trigger -gt 0 ] && ((score++))

  echo "$score"
}

# Function to suggest improvements
suggest_improvements() {
  local file=$1
  local yaml=$(extract_yaml "$file")
  local filename=$(basename "$file" .md)

  echo -e "${BLUE}File: $file${NC}"

  if ! has_yaml "$file"; then
    echo -e "${YELLOW}  ⚠️  No YAML frontmatter found${NC}"
    echo "  Suggested addition:"
    echo "  ---"
    echo "  name: $filename"
    echo "  description: Brief description here"
    echo "  alwaysApply: false"
    echo "  trigger: always_on"
    echo "  ---"
    return
  fi

  local suggestions=()

  # Check for missing fields
  echo "$yaml" | grep -q "^name:" || suggestions+=("name: $filename")
  echo "$yaml" | grep -q "^description:" || suggestions+=("description: Brief description")
  echo "$yaml" | grep -q "^alwaysApply:" || suggestions+=("alwaysApply: false")
  echo "$yaml" | grep -q "^trigger:" || suggestions+=("trigger: always_on")

  if [ ${#suggestions[@]} -eq 0 ]; then
    echo -e "${GREEN}  ✅ YAML looks good (has all recommended fields)${NC}"
  else
    echo -e "${YELLOW}  ⚠️  Missing recommended fields:${NC}"
    for suggestion in "${suggestions[@]}"; do
      echo "    + $suggestion"
    done
  fi

  echo ""
}

# Main analysis
echo "📋 Analyzing rules in $RULES_DIR..."
echo ""

total=0
with_yaml=0
needs_update=0

# Find all .md files (excluding this script and other scripts)
while IFS= read -r -d '' rule_file; do
  ((total++))

  if has_yaml "$rule_file"; then
    ((with_yaml++))

    score=$(analyze_yaml "$rule_file")
    if [ "$score" -lt 4 ]; then
      ((needs_update++))
      suggest_improvements "$rule_file"
    fi
  else
    ((needs_update++))
    suggest_improvements "$rule_file"
  fi
done < <(find "$RULES_DIR" -type f -name "*.md" ! -name "README.md" ! -name "*.sh" -print0)

# Summary
echo "════════════════════════════════════════════════════════════"
echo "📊 Summary:"
echo "  Total rules: $total"
echo "  With YAML frontmatter: $with_yaml"
echo "  Need updates: $needs_update"
echo "════════════════════════════════════════════════════════════"
echo ""

if [ $needs_update -gt 0 ]; then
  echo "💡 Next steps:"
  echo "  1. Review suggestions above"
  echo "  2. Update rule files with missing YAML fields"
  echo "  3. See README.md (YAML Frontmatter section) for complete field reference"
  echo "  4. Run sync-rules.sh to propagate changes"
else
  echo -e "${GREEN}✅ All rules have good YAML frontmatter!${NC}"
fi
