#!/bin/bash

# Progress Message Formatter for Git Hooks
# Provides colored, emoji-enhanced output for better UX

# Colors
BLUE='\033[0;34m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
GRAY='\033[0;90m'
NC='\033[0m' # No Color

# Log functions
log_info() {
  echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
  echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
  echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
  echo -e "${RED}❌ $1${NC}"
}

log_step() {
  echo -e "${GRAY}🔄 $1${NC}"
}

log_separator() {
  echo -e "${GRAY}────────────────────────────────────────${NC}"
}

# Timer functions
start_timer() {
  TIMER_START=$(date +%s)
}

end_timer() {
  TIMER_END=$(date +%s)
  ELAPSED=$((TIMER_END - TIMER_START))
  echo -e "${GRAY}⏱️  Completed in ${ELAPSED}s${NC}"
}

# Prompt with timeout
prompt_with_timeout() {
  local prompt="$1"
  local timeout="${2:-30}"
  local default="${3:-n}"

  echo -e "${YELLOW}❓ $prompt${NC}"

  if read -t "$timeout" -p "   > " response; then
    echo "$response"
  else
    echo ""
    log_warning "Timeout after ${timeout}s, using default: $default"
    echo "$default"
  fi
}

# Export functions for use in other scripts
export -f log_info
export -f log_success
export -f log_warning
export -f log_error
export -f log_step
export -f log_separator
export -f start_timer
export -f end_timer
export -f prompt_with_timeout
