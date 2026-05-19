#!/bin/bash
# Symlink (or copy) primitives — single implementation used by every adapter.
#
# Global state respected:
#   NO_SYMLINKS  — when "true", create_symlink copies recursively instead of
#                  symlinking. The destination becomes a standalone, independent
#                  tree (mutations there do NOT propagate back to .agents/).
#   DRY_RUN      — when "true", no filesystem changes are made.

# Resolve a relative symlink target (e.g. "../.agents/skills") to its absolute
# source path, given the symlink's would-be parent directory.
_resolve_target() {
  local target=$1 link_path=$2
  local link_parent
  link_parent=$(dirname "$link_path")
  # Absolute targets pass through; relative targets are resolved against the
  # parent directory the symlink would live in.
  case "$target" in
    /*) echo "$target" ;;
    *)  ( cd "$link_parent" 2>/dev/null && cd "$target" && pwd ) 2>/dev/null \
          || echo "$link_parent/$target" ;;
  esac
}

# Create a symlink, removing any existing target first.
# In NO_SYMLINKS mode, performs `cp -RL` (recursive copy, dereferencing symlinks)
# so the destination is fully self-contained.
#
# Usage: create_symlink "../.agents/skills" "$PROJECT_ROOT/.cursor/skills" "skills"
create_symlink() {
  local target=$1 link_path=$2 description=${3:-""}
  local desc_label="${description:+$description }"

  if [ "${NO_SYMLINKS:-false}" = true ]; then
    _create_copy "$target" "$link_path" "$desc_label"
    return $?
  fi

  if [ "$DRY_RUN" = true ]; then
    log_warn "[DRY RUN] Would create symlink: $link_path → $target"
    return 0
  fi

  # Remove existing file/directory/symlink (use -L to detect symlink first)
  if [ -L "$link_path" ] || [ -e "$link_path" ]; then
    rm -rf "$link_path"
  fi

  # Create parent directory if needed
  mkdir -p "$(dirname "$link_path")"

  # Create symlink
  ln -s "$target" "$link_path"

  if [ -L "$link_path" ]; then
    log_info "Created ${desc_label}symlink: $link_path → $target"
  else
    log_error "Failed to create symlink: $link_path"
    return 1
  fi
}

# Copy implementation used when NO_SYMLINKS=true.
# Resolves the relative target, then `cp -RL` (follow symlinks, recursive).
_create_copy() {
  local target=$1 link_path=$2 desc_label=$3
  local resolved
  resolved=$(_resolve_target "$target" "$link_path")

  if [ ! -e "$resolved" ]; then
    log_error "Cannot copy ${desc_label}: source not found ($resolved)"
    return 1
  fi

  if [ "$DRY_RUN" = true ]; then
    log_warn "[DRY RUN] Would copy: $resolved → $link_path"
    return 0
  fi

  # Remove existing file/directory/symlink at destination
  if [ -L "$link_path" ] || [ -e "$link_path" ]; then
    rm -rf "$link_path"
  fi

  mkdir -p "$(dirname "$link_path")"

  # -R: recursive, -L: dereference symlinks so the copy is fully independent
  if [ -d "$resolved" ]; then
    cp -RL "$resolved" "$link_path"
  else
    cp -L "$resolved" "$link_path"
  fi

  if [ -e "$link_path" ] && [ ! -L "$link_path" ]; then
    log_info "Copied ${desc_label}(standalone): $link_path"
  else
    log_error "Failed to copy: $link_path"
    return 1
  fi
}

# Verify a symlink (or copy in NO_SYMLINKS mode) exists where expected.
# Usage: verify_symlink "$link" "../.agents/skills"
verify_symlink() {
  local link=$1 expected=${2:-""}

  if [ "${NO_SYMLINKS:-false}" = true ]; then
    if [ -e "$link" ] && [ ! -L "$link" ]; then
      log_info "$link (standalone copy)"
      return 0
    fi
    log_error "$link missing or still a symlink (expected standalone copy)"
    return 1
  fi

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

# Mode-aware verifier used by every adapter's *_verify() function.
# In NO_SYMLINKS mode, expects a regular file/dir; otherwise expects a symlink.
# Usage: verify_link_or_copy "$path" "human description"
verify_link_or_copy() {
  local path=$1 description=${2:-"resource"}

  if [ "${NO_SYMLINKS:-false}" = true ]; then
    if [ -e "$path" ] && [ ! -L "$path" ]; then
      log_info "$description: $path (standalone)"
      return 0
    fi
    log_error "$description: $path (missing or still a symlink)"
    return 1
  fi

  if [ -L "$path" ]; then
    log_info "$description: $path → $(readlink "$path")"
    return 0
  fi
  log_error "$description: $path (not a symlink)"
  return 1
}
