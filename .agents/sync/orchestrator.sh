#!/bin/bash
# Component orchestrator: Root symlinks (AGENTS.md, CLAUDE.md, GEMINI.md)

sync_orchestrator() {
  local platforms=("$@")

  log_section "ORCHESTRATOR"

  require_file "$AGENTS_DIR/orchestrator/AGENTS.md" "Orchestrator source"

  echo "Creating root-level symlinks..."

  if run_or_dry "create root symlinks (AGENTS.md, CLAUDE.md, GEMINI.md)"; then
    return 0
  fi

  create_symlink ".agents/orchestrator/AGENTS.md" "$PROJECT_ROOT/AGENTS.md" "AGENTS.md"
  create_symlink ".agents/orchestrator/AGENTS.md" "$PROJECT_ROOT/CLAUDE.md" "CLAUDE.md"
  create_symlink ".agents/orchestrator/AGENTS.md" "$PROJECT_ROOT/GEMINI.md" "GEMINI.md"

  echo ""
  echo "Verifying..."

  local errors=0
  for file in AGENTS.md CLAUDE.md GEMINI.md; do
    if [ -L "$PROJECT_ROOT/$file" ]; then
      log_info "$file → $(readlink "$PROJECT_ROOT/$file")"
    else
      log_error "$file: NOT a symlink"
      ((errors++))
    fi
  done

  if [ $errors -gt 0 ]; then
    log_error "Orchestrator verification failed with $errors error(s)"
    return 1
  fi
}
