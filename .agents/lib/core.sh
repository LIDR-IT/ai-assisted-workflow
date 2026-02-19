#!/bin/bash
# Shared logging, colors, dry-run guards, and validation utilities

# Colors (conditional on tty)
if [ -t 1 ]; then
  GREEN='\033[0;32m'; YELLOW='\033[1;33m'; RED='\033[0;31m'
  BLUE='\033[0;34m'; CYAN='\033[0;36m'; NC='\033[0m'
else
  GREEN=''; YELLOW=''; RED=''; BLUE=''; CYAN=''; NC=''
fi

# Global state (set by sync.sh CLI parser)
DRY_RUN="${DRY_RUN:-false}"
VERBOSE="${VERBOSE:-false}"

# Logging
log_info()    { echo -e "  ${GREEN}✅${NC} $1"; }
log_warn()    { echo -e "  ${YELLOW}⚠️${NC}  $1"; }
log_error()   { echo -e "  ${RED}❌${NC} $1" >&2; }
log_detail()  { echo -e "    ${GREEN}✅${NC} $1"; }
log_section() {
  echo ""
  echo "┌───────────────────────────────────────────────────────────────────┐"
  echo "│  $1"
  echo "└───────────────────────────────────────────────────────────────────┘"
  echo ""
}
log_verbose() { [ "$VERBOSE" = true ] && echo -e "  ${CYAN}[DEBUG]${NC} $1" || true; }

# Dry-run guard — returns 0 if dry run (caller should return), 1 otherwise
run_or_dry() {
  if [ "$DRY_RUN" = true ]; then
    log_warn "[DRY RUN] Would: $1"
    return 0
  fi
  return 1
}

# Validation helpers
require_dir() {
  local dir=$1 label=$2
  if [ ! -d "$dir" ]; then
    log_error "$label not found: $dir"
    exit 1
  fi
  log_info "$label: $dir"
}

require_file() {
  local file=$1 label=$2
  if [ ! -f "$file" ]; then
    log_error "$label not found: $file"
    exit 1
  fi
  log_info "$label: $file"
}

require_command() {
  if ! command -v "$1" &>/dev/null; then
    log_error "Required command not found: $1"
    exit 1
  fi
}
