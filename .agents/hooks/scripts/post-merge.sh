#!/bin/bash

# Post-Merge Hook
# Automatically runs after git pull or git merge
# - Syncs configs if .agents/ changed
# - Updates dependencies if package files changed
# - Cleans up stale branches

set -e

# Source progress utilities
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/lib/progress.sh"

# Configuration
TIMEOUT_SYNC=120
TIMEOUT_DEPS=180
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

log_separator
log_step "Running post-merge checks..."
start_timer

# Function: Check if files changed in directory
files_changed() {
  local dir="$1"
  git diff-tree -r --name-only --no-commit-id ORIG_HEAD HEAD | grep -q "^$dir/" && return 0 || return 1
}

# Function: Detect and sync configs
sync_configs() {
  log_info "Checking for config changes in .agents/..."

  if files_changed ".agents/rules" || files_changed ".agents/skills" || files_changed ".agents/commands" || files_changed ".agents/mcp"; then
    log_step "Config changes detected, running sync-all.sh..."

    if timeout "$TIMEOUT_SYNC" bash "$PROJECT_ROOT/.agents/sync-all.sh"; then
      log_success "Configs synchronized"
      return 0
    else
      log_error "Sync timed out after ${TIMEOUT_SYNC}s or failed"
      log_warning "Run manually: ./.agents/sync-all.sh"
      return 1
    fi
  else
    log_info "No config changes detected"
    return 0
  fi
}

# Function: Update dependencies
update_dependencies() {
  log_info "Checking for dependency changes..."

  if files_changed "package.json" || files_changed "package-lock.json"; then
    log_step "Package files changed, updating dependencies..."

    if [ -f "$PROJECT_ROOT/package.json" ]; then
      if timeout "$TIMEOUT_DEPS" npm install; then
        log_success "Dependencies updated"
        return 0
      else
        log_error "npm install timed out after ${TIMEOUT_DEPS}s or failed"
        log_warning "Run manually: npm install"
        return 1
      fi
    else
      log_warning "No package.json found, skipping dependency update"
      return 0
    fi
  else
    log_info "No dependency changes detected"
    return 0
  fi
}

# Function: Cleanup stale branches
cleanup_stale_branches() {
  log_info "Checking for stale local branches..."

  # Get list of branches deleted on remote
  git fetch --prune &>/dev/null || true

  # Find local branches that don't exist on remote
  local stale_branches=$(git for-each-ref --format '%(refname:short) %(upstream:track)' refs/heads | grep '\[gone\]' | awk '{print $1}')

  if [ -z "$stale_branches" ]; then
    log_info "No stale branches found"
    return 0
  fi

  log_warning "Found stale local branches:"
  echo "$stale_branches" | while read branch; do
    echo "  - $branch"
  done

  response=$(prompt_with_timeout "Delete all stale branches? (y/n)" 10 "n")

  if [[ "$response" =~ ^[Yy]$ ]]; then
    echo "$stale_branches" | while read branch; do
      if git branch -D "$branch" &>/dev/null; then
        log_success "Deleted: $branch"
      else
        log_error "Failed to delete: $branch"
      fi
    done
  else
    log_info "Skipped branch cleanup"
  fi
}

# Main execution
main() {
  local exit_code=0

  # Run all checks
  sync_configs || exit_code=1
  update_dependencies || exit_code=1
  cleanup_stale_branches || true  # Don't fail on cleanup

  log_separator
  if [ $exit_code -eq 0 ]; then
    log_success "Post-merge completed successfully"
  else
    log_warning "Post-merge completed with warnings"
  fi

  end_timer
  log_separator

  return $exit_code
}

main "$@"
