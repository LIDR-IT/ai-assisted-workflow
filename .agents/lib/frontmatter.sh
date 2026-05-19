#!/bin/bash
# Single YAML frontmatter parser (replaces 4 different implementations)

# Check if file has YAML frontmatter (starts with ---)
has_frontmatter() {
  local file=$1
  head -1 "$file" | grep -q "^---$"
}

# Extract a single YAML field value (from first frontmatter block only)
# Usage: extract_field "file.md" "description"
extract_field() {
  local file=$1 field=$2
  # Use extract_yaml_block to only parse the FIRST --- block,
  # avoiding false matches from --- inside code examples in the body
  extract_yaml_block "$file" | grep "^${field}:" | head -1 | sed "s/^${field}: *//" | sed 's/^["'\'']//' | sed 's/["'\'']*$//'
}

# Extract document body (everything after frontmatter)
# Usage: extract_body "file.md"
extract_body() {
  local file=$1
  if has_frontmatter "$file"; then
    awk 'BEGIN{n=0} /^---$/{n++; next} n>=2{print}' "$file"
  else
    cat "$file"
  fi
}

# Extract full YAML block as text (without --- delimiters)
extract_yaml_block() {
  local file=$1
  awk '/^---$/{if(++n==2) exit} n==1 && !/^---$/{print}' "$file"
}

# Compute the flattened basename for a rule, prefixing with its subdirectory
# ONLY when another rule with the same basename exists elsewhere in the tree.
# This avoids silent overwrites on platforms that flatten the rule hierarchy
# (Cursor, Copilot) without renaming every rule unnecessarily.
#
# Usage: flat_rule_basename "$rule_file" "$rules_root"
#        → echoes the basename without extension (e.g. "lidr-sdlc-documentation")
flat_rule_basename() {
  local rule_file=$1 rules_root=$2
  local base
  base=$(basename "$rule_file" .md)

  # Count occurrences of this basename across the whole rules tree
  local dup_count
  dup_count=$(find "$rules_root" -type f -name "${base}.md" 2>/dev/null | wc -l | tr -d ' ')

  if [ "$dup_count" -le 1 ]; then
    echo "$base"
    return
  fi

  # Disambiguate by prefixing with the immediate subdirectory
  local subdir
  subdir=$(dirname "$rule_file" | sed "s|^$rules_root||" | sed 's|^/||')
  if [ -z "$subdir" ] || [ "$subdir" = "." ]; then
    echo "$base"
  else
    # Replace slashes with dashes for deeper nesting (defensive)
    echo "${subdir//\//-}-$base"
  fi
}
