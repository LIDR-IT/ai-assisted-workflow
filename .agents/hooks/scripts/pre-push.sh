#!/bin/bash
set -euo pipefail

# Pre-push hook - Validates before push to remote
# Checks: manual test confirmation, Playwright MCP, docs, linting

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

echo "🚀 Pre-push validation running..."
echo ""

VALIDATION_FAILED=false

# 1. Manual test confirmation
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 Manual Testing Confirmation"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Did you run all relevant tests?"
echo "  • Manual testing (if applicable)"
echo "  • Playwright MCP E2E tests (if configured)"
echo "  • Unit tests (if available)"
echo ""
read -p "Confirm all tests passed? (y/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo "❌ Testing not confirmed"
  echo ""
  echo "Please run tests before pushing:"
  echo "  • Manual: Test your changes locally"
  echo "  • Playwright MCP: Use /mcp playwright or similar"
  echo "  • Unit tests: npm test (when available)"
  echo ""
  echo "Note: Automated testing suite coming in TICK-005"
  VALIDATION_FAILED=true
else
  echo "✅ Testing confirmed"
fi

echo ""

# 2. Playwright MCP check (if configured)
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎭 Playwright MCP E2E Tests"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check if Playwright MCP is configured
if command -v playwright &> /dev/null || [ -f "$PROJECT_ROOT/playwright.config.ts" ]; then
  echo "Playwright detected - E2E tests available"
  read -p "Run Playwright E2E tests now? (y/n) " -n 1 -r
  echo ""
  
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    if cd "$PROJECT_ROOT" && npx playwright test --reporter=line 2>&1; then
      echo "✅ Playwright tests passed"
    else
      echo "❌ Playwright tests failed"
      VALIDATION_FAILED=true
    fi
  else
    echo "⚠️  Playwright tests skipped"
  fi
else
  echo "ℹ️  Playwright not configured (optional)"
  echo "   Install: npm i -D @playwright/test"
fi

echo ""

# 3. Documentation check
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📚 Documentation Validation"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check if code files changed
CODE_CHANGED=$(git diff --name-only origin/$(git rev-parse --abbrev-ref HEAD) HEAD | grep -E '\.(ts|js|tsx|jsx|py|go|rs)$' || true)

if [ -n "$CODE_CHANGED" ]; then
  # Check if docs changed
  DOCS_CHANGED=$(git diff --name-only origin/$(git rev-parse --abbrev-ref HEAD) HEAD | grep -E '\.(md|mdx)$|^docs/' || true)
  
  if [ -z "$DOCS_CHANGED" ]; then
    echo "⚠️  Code changed but no documentation updates detected"
    echo ""
    read -p "Confirm documentation is up to date or not needed? (y/n) " -n 1 -r
    echo ""
    
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
      echo "❌ Documentation validation failed"
      echo "   Update: README.md, docs/, or inline comments"
      VALIDATION_FAILED=true
    else
      echo "✅ Documentation confirmed up to date"
    fi
  else
    echo "✅ Documentation updated"
  fi
else
  echo "ℹ️  No code changes detected"
fi

echo ""

# 4. Linting check
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔍 Linting Check"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check if linting tools are configured
if [ -f "$PROJECT_ROOT/package.json" ] && grep -q "\"lint\"" "$PROJECT_ROOT/package.json"; then
  echo "Running linter..."
  if cd "$PROJECT_ROOT" && npm run lint 2>&1; then
    echo "✅ No linting errors"
  else
    echo "❌ Linting errors found"
    echo "   Fix with: npm run lint --fix"
    VALIDATION_FAILED=true
  fi
elif [ -f "$PROJECT_ROOT/.eslintrc.js" ] || [ -f "$PROJECT_ROOT/.eslintrc.json" ]; then
  echo "ESLint configured - running..."
  if cd "$PROJECT_ROOT" && npx eslint . 2>&1; then
    echo "✅ No linting errors"
  else
    echo "❌ Linting errors found"
    VALIDATION_FAILED=true
  fi
else
  echo "ℹ️  No linter configured (optional)"
fi

echo ""

# 5. Security scan (optional)
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔒 Security Scan"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if command -v npm &> /dev/null && [ -f "$PROJECT_ROOT/package-lock.json" ]; then
  echo "Running npm audit..."
  AUDIT_RESULT=$(cd "$PROJECT_ROOT" && npm audit --audit-level=high 2>&1 || true)
  
  if echo "$AUDIT_RESULT" | grep -q "found 0 vulnerabilities"; then
    echo "✅ No high-severity vulnerabilities"
  else
    echo "⚠️  Security vulnerabilities detected:"
    echo "$AUDIT_RESULT" | head -10
    echo ""
    read -p "Proceed with push despite vulnerabilities? (y/n) " -n 1 -r
    echo ""
    
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
      echo "❌ Push blocked due to security concerns"
      VALIDATION_FAILED=true
    fi
  fi
else
  echo "ℹ️  Security scan not available"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Final result
if [ "$VALIDATION_FAILED" = true ]; then
  echo ""
  echo "❌ Pre-push validation FAILED"
  echo ""
  echo "Fix the issues above before pushing."
  echo "Or bypass with: git push --no-verify (not recommended)"
  exit 1
else
  echo ""
  echo "✅ All pre-push validations passed"
  echo ""
  echo "Pushing to remote..."
  exit 0
fi
