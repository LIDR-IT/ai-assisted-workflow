#!/bin/bash
# Platform adapter: Antigravity
# Antigravity reads natively from .agents/ — only needs workflows symlink

antigravity_rules() {
  log_info "Antigravity reads rules natively from .agents/rules/"

  # Clean up legacy .agent/rules symlink if present
  if [ -e "$PROJECT_ROOT/.agent/rules" ] || [ -L "$PROJECT_ROOT/.agent/rules" ]; then
    if run_or_dry "remove legacy .agent/rules symlink"; then
      return 0
    fi
    rm -rf "$PROJECT_ROOT/.agent/rules"
    log_info "Removed legacy .agent/rules symlink"
  fi
}

antigravity_skills() {
  log_info "Antigravity reads skills natively from .agents/skills/"

  # Clean up legacy .agent/skills symlink if present
  if [ -e "$PROJECT_ROOT/.agent/skills" ] || [ -L "$PROJECT_ROOT/.agent/skills" ]; then
    if run_or_dry "remove legacy .agent/skills symlink"; then
      return 0
    fi
    rm -rf "$PROJECT_ROOT/.agent/skills"
    log_info "Removed legacy .agent/skills symlink"
  fi
}

antigravity_commands() {
  # Create .agents/workflows → commands symlink for native detection
  local workflows_link="$PROJECT_ROOT/.agents/workflows"

  if run_or_dry "ensure .agents/workflows → commands symlink"; then
    return 0
  fi

  if [ ! -L "$workflows_link" ]; then
    # Remove if exists as file/directory
    [ -e "$workflows_link" ] && rm -rf "$workflows_link"
    # Create relative symlink inside .agents/
    (cd "$PROJECT_ROOT/.agents" && ln -s commands workflows)
    log_info "Created .agents/workflows → commands symlink"
  else
    log_info ".agents/workflows → commands symlink already exists"
  fi

  # Clean up legacy .agent/workflows symlink if present
  if [ -e "$PROJECT_ROOT/.agent/workflows" ] || [ -L "$PROJECT_ROOT/.agent/workflows" ]; then
    rm -rf "$PROJECT_ROOT/.agent/workflows"
    log_info "Removed legacy .agent/workflows symlink"
  fi
}

antigravity_verify() {
  local errors=0

  # Rules native
  if [ -d "$AGENTS_DIR/rules" ]; then
    log_info "antigravity rules: native .agents/ detection"
  else
    log_error "antigravity rules: .agents/rules/ not found"
    ((errors++))
  fi

  # Skills native
  if [ -d "$AGENTS_DIR/skills" ]; then
    log_info "antigravity skills: native .agents/ detection"
  else
    log_error "antigravity skills: .agents/skills/ not found"
    ((errors++))
  fi

  # Workflows symlink
  local workflows_link="$PROJECT_ROOT/.agents/workflows"
  if [ -L "$workflows_link" ]; then
    log_info "antigravity workflows: .agents/workflows → $(readlink "$workflows_link")"
  else
    log_error "antigravity workflows: .agents/workflows symlink not found"
    ((errors++))
  fi

  return $errors
}
