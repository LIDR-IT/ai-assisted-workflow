#!/bin/bash

echo "🔍 Checking for problematic import patterns..."

cd "$(dirname "$0")/.."

# Function to check and report imports
check_imports() {
  local pattern="$1"
  local description="$2"

  local count=$(grep -r "$pattern" src/ 2>/dev/null | wc -l | tr -d ' ')
  if [ "$count" -gt 0 ]; then
    echo "❌ Found $count $description imports:"
    grep -r "$pattern" src/ 2>/dev/null | head -5
    echo ""
  else
    echo "✅ No $description imports found"
  fi
}

echo "Checking import patterns..."
check_imports 'from.*\.\./\.\./\.\.' "deep relative (../../../)"
check_imports "from '@/features" "@/features"
check_imports "from '@/shared" "@/shared"
check_imports "from '@/diagrams" "@/diagrams"
check_imports "from '@/ui" "@/ui"
check_imports "from '@/computed" "@/computed"
check_imports "from '@/metrics-dashboard" "@/metrics-dashboard"
check_imports "from '@/simple-stats" "@/simple-stats"
check_imports "from '@/index" "@/index"
check_imports "from '@/phases" "@/phases"
check_imports "from '@/artifacts" "@/artifacts"
check_imports "from '@/utils" "@/utils"

echo "🔍 Done checking import patterns."