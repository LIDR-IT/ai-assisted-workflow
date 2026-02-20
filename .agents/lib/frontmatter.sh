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
