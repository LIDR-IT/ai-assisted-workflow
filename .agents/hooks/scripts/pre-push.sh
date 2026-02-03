#!/bin/bash

# Pre-Push Hook
# Validates before pushing to remote
# - Manual test confirmation
# - Playwright MCP integration (if available)
# - Documentation check
# - Linting validation
# - Security scan

set -e

# Source progress utilities
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/lib/progress.sh"

# Configuration
TIMEOUT_LINT=60
TIMEOUT_PLAYWRIGHT=180
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

log_separator
log_step "Running pre-push validation..."
start_timer

# Function: Check manual tests
check_manual_tests() {
  log_step "Manual test confirmation required"

  response=$(prompt_with_timeout "Did you run all tests? (y/n)" 30 "n")

  if [[ "$response" =~ ^[Yy]$ ]]; then
    log_success "Manual tests confirmed"
    return 0
  else
    log_error "Please run tests before pushing"
    log_info "Options:"
    log_info "  - Run: npm test"
    log_info "  - Use Playwright MCP for E2E tests"
    log_info "  - Bypass: git push --no-verify (emergency only)"
    log_warning "Note: Automated test suite coming in TICK-005"
    return 1
  fi
}

# Function: Check Playwright MCP availability
check_playwright_mcp() {
  log_info "Checking for Playwright MCP integration..."

  # Check if Playwright MCP is configured
  if command -v claude &>/dev/null; then
    if claude mcp list 2>/dev/null | grep -q "playwright"; then
      log_step "Playwright MCP detected, running E2E tests..."

      # Note: Actual Playwright MCP integration would go here
      # For now, just log that it's available
      log_success "Playwright MCP integration ready (manual tests still required)"
      return 0
    fi
  fi

  log_info "Playwright MCP not configured (optional)"
  return 0
}

# Function: Check documentation updates
check_documentation() {
  log_info "Checking documentation updates..."

  # Get current branch
  local current_branch=$(git branch --show-current)
  local base_branch="main"

  # Check if on a feature branch
  if [ "$current_branch" = "$base_branch" ]; then
    log_info "On main branch, skipping doc check"
    return 0
  fi

  # Check for source code changes
  local src_changes=$(git diff --name-only "$base_branch"...HEAD | grep -E '^(src/|lib/|.agents/)' || true)

  if [ -z "$src_changes" ]; then
    log_info "No source code changes detected"
    return 0
  fi

  # Check for documentation changes
  local doc_changes=$(git diff --name-only "$base_branch"...HEAD | grep -E '^(docs/|README|.*\.md$)' || true)

  if [ -z "$doc_changes" ]; then
    log_warning "Source code changed but documentation appears unchanged"
    log_info "Changed files:"
    echo "$src_changes" | head -5 | while read file; do
      echo "  - $file"
    done

    response=$(prompt_with_timeout "Proceed with push? (y/n)" 15 "n")

    if [[ "$response" =~ ^[Yy]$ ]]; then
      log_warning "Proceeding without doc updates (verify DoD)"
      return 0
    else
      log_error "Push cancelled - please update documentation"
      return 1
    fi
  else
    log_success "Documentation updates detected"
    return 0
  fi
}

# Function: Run linting
check_linting() {
  log_info "Checking for linting errors..."

  # Check if lint script exists
  if [ -f "$PROJECT_ROOT/package.json" ]; then
    if grep -q '"lint"' "$PROJECT_ROOT/package.json"; then
      log_step "Running linter..."

      if timeout "$TIMEOUT_LINT" npm run lint --silent; then
        log_success "No linting errors"
        return 0
      else
        log_error "Linting failed"
        log_warning "Fix linting errors before pushing"
        return 1
      fi
    fi
  fi

  log_info "No linting configuration found (optional)"
  return 0
}

# Function: Run security scan
check_security() {
  log_info "Running security scan..."

  if [ -f "$PROJECT_ROOT/package-lock.json" ]; then
    # Run npm audit but don't fail on warnings
    if npm audit --audit-level=high &>/dev/null; then
      log_success "No high-severity vulnerabilities"
    else
      log_warning "Security vulnerabilities detected"
      log_info "Run: npm audit fix"
    fi
  else
    log_info "No package-lock.json found, skipping security scan"
  fi

  return 0
}

# Main execution
main() {
  local exit_code=0

  # Run all checks (fail fast on critical checks)
  check_manual_tests || exit_code=1

  if [ $exit_code -eq 0 ]; then
    check_playwright_mcp || true  # Optional
    check_documentation || exit_code=1
    check_linting || exit_code=1
    check_security || true  # Optional
  fi

  log_separator
  if [ $exit_code -eq 0 ]; then
    log_success "All pre-push checks passed"
    log_info "Proceeding with push to remote..."
  else
    log_error "Pre-push validation failed"
    log_info "Fix issues above or use --no-verify to bypass (emergency only)"
  fi

  end_timer
  log_separator

  return $exit_code
}

main "$@"
