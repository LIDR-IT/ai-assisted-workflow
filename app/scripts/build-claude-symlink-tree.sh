#!/bin/bash
# ═══════════════════════════════════════════════════════════════════════════
# build-claude-symlink-tree.sh
# ═══════════════════════════════════════════════════════════════════════════
# Creates app/.claude/ as a directory of symlinks reproducing the original
# LIDR layout — without the lidr- prefix and without the lidr-sdlc/ subdir —
# pointing to the real files inside ../.agents/.
#
# Why: data files in src/data/features/ (helpCenter.ts, sitemapView.ts,
# integrityTests.ts) reference paths like `.claude/rules/org.md`. After the
# 2026-05-18 merge those files actually live at `.agents/rules/lidr-sdlc/org.md`
# and similar. This script preserves the data-file semantics by providing the
# old logical view via symlinks. Zero code changes.
#
# Run from app/ directory (after sync.sh has set up ../.agents/).
# Idempotent: rm -rf .claude before regenerating.
# ═══════════════════════════════════════════════════════════════════════════

set -euo pipefail

cd "$(dirname "$0")/.."  # → app/

APP_ABS="$(pwd)"
AGENTS_ABS="$(cd ../.agents && pwd)"

if [ ! -d "$AGENTS_ABS" ]; then
  echo "❌ $AGENTS_ABS not found. Run from app/ inside lidr-ecosystem/."
  exit 1
fi

echo "🔧 Building app/.claude/ symlink tree..."
echo "    app:    $APP_ABS"
echo "    agents: $AGENTS_ABS"

rm -rf .claude
mkdir -p .claude/{rules,agents,commands,hooks,skills}

# Helper: create a symlink at `linkname` (relative to app/) whose target
# (relative to the linkname's parent directory) points at the absolute path.
# Verifies the absolute target exists first.
link() {
  local abs_target="$1"      # absolute path to real file
  local linkname="$2"        # path relative to app/ where the symlink goes
  local rel_target="$3"      # symlink contents (relative path from linkname's parent)
  if [ ! -e "$abs_target" ]; then
    echo "  ⚠️  target missing: $abs_target → skipping $linkname"
    return
  fi
  ln -s "$rel_target" "$linkname"
}

# ─── Top-level: CLAUDE.md, settings.json ──────────────────────────────────
# Active orchestrator (root symlink → .agents/orchestrator/AGENTS.md)
link "$APP_ABS/../CLAUDE.md" \
     ".claude/CLAUDE.md" \
     "../../CLAUDE.md"

link "$APP_ABS/../.claude/settings.json" \
     ".claude/settings.json" \
     "../../.claude/settings.json"

# ─── Rules ─────────────────────────────────────────────────────────────────
# .claude/rules/X.md → ../../.agents/rules/lidr-sdlc/X.md
for f in "$AGENTS_ABS"/rules/lidr-sdlc/*.md; do
  [ -f "$f" ] || continue
  bn=$(basename "$f")
  link "$f" ".claude/rules/$bn" "../../../.agents/rules/lidr-sdlc/$bn"
done

# ─── Agents (stripping lidr- prefix in the link name) ─────────────────────
for f in "$AGENTS_ABS"/subagents/lidr-*.md; do
  [ -f "$f" ] || continue
  bn=$(basename "$f")
  stripped="${bn#lidr-}"
  link "$f" ".claude/agents/$stripped" "../../../.agents/subagents/$bn"
done

# ─── Commands (stripping lidr- prefix) ────────────────────────────────────
for f in "$AGENTS_ABS"/commands/lidr-*.md; do
  [ -f "$f" ] || continue
  bn=$(basename "$f")
  stripped="${bn#lidr-}"
  link "$f" ".claude/commands/$stripped" "../../../.agents/commands/$bn"
done

# ─── Hooks ────────────────────────────────────────────────────────────────
for f in "$AGENTS_ABS"/hooks/lidr/*.sh; do
  [ -f "$f" ] || continue
  bn=$(basename "$f")
  link "$f" ".claude/hooks/$bn" "../../../.agents/hooks/lidr/$bn"
done

# ─── Skills (stripping lidr- prefix) ──────────────────────────────────────
for d in "$AGENTS_ABS"/skills/lidr-*/; do
  [ -d "$d" ] || continue
  bn=$(basename "$d")
  stripped="${bn#lidr-}"
  link "$d" ".claude/skills/$stripped" "../../../.agents/skills/$bn"
done

# ─── Skills (generic, no lidr- counterpart): expose under original name ───
# After the 2026-05-19 skills dedup, some generic skills (e.g. command-development,
# team-skill-creator) only exist without the lidr- prefix. The legacy LIDR
# data files still reference them under their original names.
for d in "$AGENTS_ABS"/skills/*/; do
  [ -d "$d" ] || continue
  bn=$(basename "$d")
  case "$bn" in lidr-*|_shared) continue ;; esac
  if [ ! -e ".claude/skills/$bn" ]; then
    link "$d" ".claude/skills/$bn" "../../../.agents/skills/$bn"
  fi
done

# ─── Special-case: .claude/commands/lidr-help.md ──────────────────────────
# The commands loop above strips the lidr- prefix, but legacy data references
# the original /lidr-help slash command. Keep both names available.
if [ -f "$AGENTS_ABS/commands/lidr-help.md" ]; then
  link "$AGENTS_ABS/commands/lidr-help.md" ".claude/commands/lidr-help.md" \
       "../../../.agents/commands/lidr-help.md"
fi

# ─── Shared validators (replace pre-created empty dir with symlink) ───────
link "$AGENTS_ABS/_shared/lidr" ".claude/_shared" "../../.agents/_shared/lidr"

# ─── Summary ──────────────────────────────────────────────────────────────
echo ""
echo "✅ Built app/.claude/ tree:"
echo "    rules:    $(ls .claude/rules/ 2>/dev/null | wc -l | tr -d ' ') symlinks"
echo "    agents:   $(ls .claude/agents/ 2>/dev/null | wc -l | tr -d ' ') symlinks"
echo "    commands: $(ls .claude/commands/ 2>/dev/null | wc -l | tr -d ' ') symlinks"
echo "    hooks:    $(ls .claude/hooks/ 2>/dev/null | wc -l | tr -d ' ') symlinks"
echo "    skills:   $(ls .claude/skills/ 2>/dev/null | wc -l | tr -d ' ') symlinks"
[ -L .claude/CLAUDE.md ] && echo "    CLAUDE.md: ✓"
[ -L .claude/settings.json ] && echo "    settings.json: ✓"
[ -L .claude/_shared ] && echo "    _shared: ✓ → $(readlink .claude/_shared)"
