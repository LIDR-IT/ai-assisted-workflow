#!/bin/bash
# Component orchestrator: Root symlinks (AGENTS.md, CLAUDE.md, GEMINI.md)

sync_orchestrator() {
  local platforms=("$@")

  log_section "ORCHESTRATOR"

  require_file "$AGENTS_DIR/orchestrator/AGENTS.md" "Orchestrator source"

  if [ "${NO_SYMLINKS:-false}" = true ]; then
    echo "Copying root-level orchestrator (standalone)..."
  else
    echo "Creating root-level symlinks..."
  fi

  # Let create_symlink emit per-file dry-run messages — it knows the mode.
  create_symlink ".agents/orchestrator/AGENTS.md" "$PROJECT_ROOT/AGENTS.md" "AGENTS.md"
  create_symlink ".agents/orchestrator/AGENTS.md" "$PROJECT_ROOT/CLAUDE.md" "CLAUDE.md"
  create_symlink ".agents/orchestrator/AGENTS.md" "$PROJECT_ROOT/GEMINI.md" "GEMINI.md"

  [ "$DRY_RUN" = true ] && return 0

  echo ""
  echo "Verifying..."

  local errors=0
  for file in AGENTS.md CLAUDE.md GEMINI.md; do
    verify_link_or_copy "$PROJECT_ROOT/$file" "$file" || ((errors++))
  done

  if [ $errors -gt 0 ]; then
    log_error "Orchestrator verification failed with $errors error(s)"
    return 1
  fi
}
