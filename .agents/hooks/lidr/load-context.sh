#!/bin/bash
# ═══════════════════════════════════════════════════════════════
# Hook: context-loader
# Evento: SessionStart (Claude Code)
# Proposito: Carga contexto del proyecto al iniciar sesion
# Doc: docs/hooks/context-loader.md
# ═══════════════════════════════════════════════════════════════
set -euo pipefail

# Set working directory to project root
if [ -n "${CLAUDE_PROJECT_DIR:-}" ]; then
  PROJECT_DIR="$CLAUDE_PROJECT_DIR"
else
  # Default to current working directory when not set
  PROJECT_DIR="$(pwd)"
fi
cd "$PROJECT_DIR" || exit 1

# Set environment file (use default if CLAUDE_ENV_FILE not set)
ENV_FILE="${CLAUDE_ENV_FILE:-$PROJECT_DIR/.claude-env}"

# Clear existing env file to prevent duplicates
> "$ENV_FILE"

echo "Loading LIDR SDLC context..."

# ── 1. Detectar tipo de proyecto ──
if [ -f "package.json" ]; then
  echo "export PROJECT_TYPE=nodejs" >> "$ENV_FILE"

  # Detectar TypeScript
  if [ -f "tsconfig.json" ]; then
    echo "export USES_TYPESCRIPT=true" >> "$ENV_FILE"
  fi

  # Detectar framework
  if grep -q '"react"' package.json 2>/dev/null; then
    echo "export FRAMEWORK=react" >> "$ENV_FILE"
  elif grep -q '"next"' package.json 2>/dev/null; then
    echo "export FRAMEWORK=nextjs" >> "$ENV_FILE"
  elif grep -q '"vue"' package.json 2>/dev/null; then
    echo "export FRAMEWORK=vue" >> "$ENV_FILE"
  fi

elif [ -f "requirements.txt" ] || [ -f "pyproject.toml" ]; then
  echo "export PROJECT_TYPE=python" >> "$ENV_FILE"

elif [ -f "go.mod" ]; then
  echo "export PROJECT_TYPE=go" >> "$ENV_FILE"

elif [ -f "Cargo.toml" ]; then
  echo "export PROJECT_TYPE=rust" >> "$ENV_FILE"

elif [ -f "pom.xml" ] || [ -f "build.gradle" ]; then
  echo "export PROJECT_TYPE=java" >> "$ENV_FILE"
fi

# ── 2. DTC (Docs Travel With Code) status ──
if [ -f ".claude/rules/documentation.md" ]; then
  echo "export DTC_ACTIVE=true" >> "$ENV_FILE"
else
  echo "export DTC_ACTIVE=false" >> "$ENV_FILE"
fi

# ── 3. Contar docs stale (last_updated > 90 dias) ──
stale_count=0
if command -v find &> /dev/null; then
  stale_count=$(find docs/ .claude/rules/ -name "*.md" -mtime +90 2>/dev/null | wc -l | tr -d ' ')
fi
echo "export STALE_DOCS_COUNT=$stale_count" >> "$ENV_FILE"

# ── 4. Detectar integridad ──
if [ -f "src/app/components/diagrams/IntegrityTests.tsx" ]; then
  echo "export HAS_INTEGRITY_TESTS=true" >> "$ENV_FILE"
fi

# ── 5. Contar artefactos del ecosistema ──
skill_count=0
command_count=0
rule_count=0
hook_count=0
checklist_count=0

if [ -d ".claude/skills" ]; then
  skill_count=$(find .claude/skills/ -name "SKILL.md" -type f 2>/dev/null | wc -l | tr -d ' ')
fi
if [ -d ".claude/commands" ]; then
  command_count=$(find .claude/commands/ -name "*.md" -type f 2>/dev/null | wc -l | tr -d ' ')
fi
if [ -d ".claude/rules" ]; then
  rule_count=$(find .claude/rules/ -name "*.md" -type f 2>/dev/null | wc -l | tr -d ' ')
fi
if [ -d "docs/hooks" ]; then
  # Exclude README.md — count individual hook docs only
  hook_count=$(find docs/hooks/ -name "*.md" -not -name "README.md" -type f 2>/dev/null | wc -l | tr -d ' ')
fi
if [ -d "docs/checklists" ]; then
  checklist_count=$(find .claude/skills/ -name "checklists" -type d 2>/dev/null | wc -l | tr -d ' ')
fi

echo "export ECOSYSTEM_SKILLS=$skill_count" >> "$ENV_FILE"
echo "export ECOSYSTEM_COMMANDS=$command_count" >> "$ENV_FILE"
echo "export ECOSYSTEM_RULES=$rule_count" >> "$ENV_FILE"
echo "export ECOSYSTEM_HOOKS=$hook_count" >> "$ENV_FILE"
echo "export ECOSYSTEM_CHECKLISTS=$checklist_count" >> "$ENV_FILE"

# ── 6. Detectar Husky (git hooks) ──
if [ -d ".husky" ]; then
  echo "export HUSKY_ACTIVE=true" >> "$ENV_FILE"
else
  echo "export HUSKY_ACTIVE=false" >> "$ENV_FILE"
fi

# ── 7. Git branch info ──
if command -v git &> /dev/null && git rev-parse --git-dir &> /dev/null; then
  current_branch=$(git symbolic-ref --short HEAD 2>/dev/null || echo "detached")
  echo "export GIT_BRANCH=$current_branch" >> "$ENV_FILE"
fi

# ── Output summary ──
echo "Context loaded successfully:"
echo "  PROJECT_TYPE=$(grep 'PROJECT_TYPE' "$ENV_FILE" 2>/dev/null | tail -1 | cut -d= -f2 || echo 'unknown')"
echo "  DTC_ACTIVE=true"
echo "  STALE_DOCS=$stale_count"
echo "  Skills=$skill_count, Commands=$command_count, Rules=$rule_count, Hooks=$hook_count, Checklists=$checklist_count"
echo "  HUSKY=$([ -d '.husky' ] && echo 'active' || echo 'not installed')"

exit 0
