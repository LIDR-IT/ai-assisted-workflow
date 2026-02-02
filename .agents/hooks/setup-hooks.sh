#!/bin/bash
set -euo pipefail

# Setup script for git hooks
# Installs pre-push hook to .git/hooks/

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

echo "╔═══════════════════════════════════════════════════════════════════╗"
echo "║  🔧 Git Hooks Setup                                               ║"
echo "╚═══════════════════════════════════════════════════════════════════╝"
echo ""

# Check if .git directory exists
if [ ! -d "$PROJECT_ROOT/.git" ]; then
  echo "❌ Error: .git directory not found"
  echo "   Run this script from within a git repository"
  exit 1
fi

echo "📋 Installing git hooks..."
echo ""

# 1. Pre-push hook (git native)
echo "1. Pre-push hook"
echo "   Source: .agents/hooks/scripts/pre-push.sh"
echo "   Target: .git/hooks/pre-push"

if [ -f "$PROJECT_ROOT/.git/hooks/pre-push" ]; then
  echo "   ⚠️  pre-push hook already exists"
  read -p "   Overwrite? (y/n) " -n 1 -r
  echo ""
  
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "   Skipped pre-push hook"
  else
    cp "$SCRIPT_DIR/scripts/pre-push.sh" "$PROJECT_ROOT/.git/hooks/pre-push"
    chmod +x "$PROJECT_ROOT/.git/hooks/pre-push"
    echo "   ✅ Installed pre-push hook"
  fi
else
  cp "$SCRIPT_DIR/scripts/pre-push.sh" "$PROJECT_ROOT/.git/hooks/pre-push"
  chmod +x "$PROJECT_ROOT/.git/hooks/pre-push"
  echo "   ✅ Installed pre-push hook"
fi

echo ""

# 2. Pre-commit and post-merge (Claude hooks - info only)
echo "2. Pre-commit hook (Claude)"
echo "   Configured in: .agents/hooks/hooks.json"
echo "   ℹ️  Automatic (no installation needed)"
echo ""

echo "3. Post-merge hook (Claude)"
echo "   Configured in: .agents/hooks/hooks.json"
echo "   ℹ️  Automatic (no installation needed)"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "✅ Setup complete!"
echo ""
echo "Installed hooks:"
echo "  • pre-push: .git/hooks/pre-push (manual validation)"
echo "  • pre-commit: Automatic via Claude (ticket validation)"
echo "  • post-merge: Automatic via Claude (sync + deps)"
echo ""
echo "Test pre-push hook:"
echo "  git push --dry-run"
echo ""
echo "Bypass hooks (not recommended):"
echo "  git commit --no-verify"
echo "  git push --no-verify"
echo ""
echo "Documentation:"
echo "  .agents/hooks/README.md"
echo ""
