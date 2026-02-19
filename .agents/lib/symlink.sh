#!/bin/bash
# Single symlink implementation (replaces 4 duplicates across old scripts)

# Create a symlink, removing any existing target first
# Usage: create_symlink "../.agents/skills" "$PROJECT_ROOT/.cursor/skills" "skills"
create_symlink() {
  local target=$1 link_path=$2 description=${3:-""}

  if [ "$DRY_RUN" = true ]; then
    log_warn "[DRY RUN] Would create symlink: $link_path → $target"
    return 0
  fi

  # Remove existing file/directory/symlink
  [ -e "$link_path" ] || [ -L "$link_path" ] && rm -rf "$link_path"

  # Create parent directory if needed
  mkdir -p "$(dirname "$link_path")"

  # Create symlink
  ln -s "$target" "$link_path"

  if [ -L "$link_path" ]; then
    log_info "Created ${description:+$description }symlink: $link_path → $target"
  else
    log_error "Failed to create symlink: $link_path"
    return 1
  fi
}

# Verify a symlink exists and optionally points to expected target
# Usage: verify_symlink "$link" "../.agents/skills"
verify_symlink() {
  local link=$1 expected=${2:-""}
  if [ -L "$link" ]; then
    local actual
    actual=$(readlink "$link")
    if [ -n "$expected" ] && [ "$actual" != "$expected" ]; then
      log_error "$link → $actual (expected $expected)"
      return 1
    fi
    log_info "$link → $actual"
  else
    log_error "$link is not a symlink"
    return 1
  fi
}
