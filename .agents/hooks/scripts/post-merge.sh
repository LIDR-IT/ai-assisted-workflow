#!/bin/bash
set -euo pipefail

# Post-merge hook - Runs after git pull/merge
# Automates: sync configs, update dependencies, cleanup stale branches

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

echo "🔄 Post-merge hook running..."

# 1. Check if .agents/ directory changed
if git diff --name-only HEAD@{1} HEAD | grep -q "^\.agents/"; then
  echo ""
  echo "📦 Detected changes in .agents/ directory"
  echo "   Running sync-all.sh..."
  
  if "$PROJECT_ROOT/.agents/sync-all.sh" > /dev/null 2>&1; then
    echo "   ✅ Configs synchronized across all platforms"
  else
    echo "   ⚠️  Sync completed with warnings (check output above)"
  fi
fi

# 2. Check if package files changed
PACKAGE_FILES_CHANGED=false
for file in package.json package-lock.json yarn.lock pnpm-lock.yaml; do
  if git diff --name-only HEAD@{1} HEAD | grep -q "^$file$"; then
    PACKAGE_FILES_CHANGED=true
    break
  fi
done

if [ "$PACKAGE_FILES_CHANGED" = true ]; then
  echo ""
  echo "📦 Detected package file changes"
  echo "   Updating dependencies..."
  
  # Detect package manager
  if [ -f "$PROJECT_ROOT/pnpm-lock.yaml" ]; then
    PM="pnpm install"
  elif [ -f "$PROJECT_ROOT/yarn.lock" ]; then
    PM="yarn install"
  else
    PM="npm install"
  fi
  
  if cd "$PROJECT_ROOT" && $PM > /dev/null 2>&1; then
    echo "   ✅ Dependencies updated"
  else
    echo "   ⚠️  Dependency update failed - run '$PM' manually"
  fi
fi

# 3. Check for stale local branches (deleted remotely)
echo ""
echo "🧹 Checking for stale branches..."

# Get list of remote branches
git fetch --prune > /dev/null 2>&1

# Find local branches that no longer exist on remote
STALE_BRANCHES=$(git branch -vv | grep ': gone]' | awk '{print $1}' || true)

if [ -n "$STALE_BRANCHES" ]; then
  echo "   Found stale branches (deleted remotely):"
  echo "$STALE_BRANCHES" | while read -r branch; do
    echo "     - $branch"
  done
  
  echo ""
  read -p "   Delete these branches locally? (y/n) " -n 1 -r
  echo ""
  
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "$STALE_BRANCHES" | while read -r branch; do
      git branch -D "$branch" 2>/dev/null && echo "     ✅ Deleted $branch" || true
    done
  else
    echo "     Skipped cleanup"
  fi
else
  echo "   ✅ No stale branches found"
fi

echo ""
echo "✅ Post-merge hook completed"
