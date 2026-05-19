#!/bin/bash
# validate-ecosystem-counts.sh — Stop hook
#
# At session end, counts actual artifacts under .agents/ and compares them
# against the totals declared in CLAUDE.md / AGENTS.md (they're symlinks to
# the same file). Surfaces drift so docs stay honest about the ecosystem.
#
# Counts always come from the source-of-truth tree (.agents/), not from the
# platform-specific output dirs.

set -uo pipefail

# Resolve project root: prefer the platform's hook env var, fall back to
# walking up from the script location.
if [ -n "${CLAUDE_PROJECT_DIR:-}" ]; then
  BASE_DIR="$CLAUDE_PROJECT_DIR"
elif [ -n "${GEMINI_PROJECT_DIR:-}" ]; then
  BASE_DIR="$GEMINI_PROJECT_DIR"
else
  BASE_DIR="$(cd "$(dirname "$0")/../../.." && pwd)"
fi

ORCHESTRATOR="$BASE_DIR/CLAUDE.md"
[ -f "$ORCHESTRATOR" ] || ORCHESTRATOR="$BASE_DIR/.agents/orchestrator/AGENTS.md"

# --- Count actual artifacts (source-of-truth, never the per-platform copies) ---
ACTUAL_SKILLS=$(find "$BASE_DIR/.agents/skills" -maxdepth 2 -name "SKILL.md" 2>/dev/null | wc -l | tr -d ' ')
ACTUAL_COMMANDS=$(find "$BASE_DIR/.agents/commands" -maxdepth 1 -name "*.md" 2>/dev/null | wc -l | tr -d ' ')
ACTUAL_RULES=$(find "$BASE_DIR/.agents/rules" -type f -name "*.md" ! -name "README.md" 2>/dev/null | wc -l | tr -d ' ')
ACTUAL_AGENTS=$(find "$BASE_DIR/.agents/subagents" -maxdepth 1 -name "*.md" 2>/dev/null | wc -l | tr -d ' ')
ACTUAL_HOOKS=$(find "$BASE_DIR/.agents/hooks/scripts" -maxdepth 1 -name "*.sh" 2>/dev/null | wc -l | tr -d ' ')

# --- Extract expected counts from the orchestrator markdown ---
# Matches the current bullet format used by AGENTS.md:
#   "- **22 rules** in 10 categories ..."
#   "- **67 skills** (61 LIDR ...)"
#   "- **30 commands** (23 LIDR ...)"
#   "- **9 subagents** (6 LIDR ...)"
#   "- **6 hooks** (3 LIDR ...)"
extract_count() {
  local label=$1
  grep -m1 -oE "\*\*[0-9]+ ${label}\*\*" "$ORCHESTRATOR" 2>/dev/null \
    | grep -oE "[0-9]+" \
    | head -1
}

EXPECTED_SKILLS=$(extract_count "skills")
EXPECTED_COMMANDS=$(extract_count "commands")
EXPECTED_RULES=$(extract_count "rules")
EXPECTED_AGENTS=$(extract_count "subagents")
EXPECTED_HOOKS=$(extract_count "hooks")

# --- Compare ---
DRIFT_FOUND=false
DRIFT_DETAILS=""

compare() {
  local label=$1 actual=$2 expected=$3
  if [ -n "$expected" ] && [ "$actual" != "$expected" ]; then
    DRIFT_FOUND=true
    DRIFT_DETAILS="${DRIFT_DETAILS}${label}: CLAUDE.md=${expected} filesystem=${actual}. "
  fi
}

compare "Skills"    "$ACTUAL_SKILLS"   "$EXPECTED_SKILLS"
compare "Commands"  "$ACTUAL_COMMANDS" "$EXPECTED_COMMANDS"
compare "Rules"     "$ACTUAL_RULES"    "$EXPECTED_RULES"
compare "Subagents" "$ACTUAL_AGENTS"   "$EXPECTED_AGENTS"
compare "Hooks"     "$ACTUAL_HOOKS"    "$EXPECTED_HOOKS"

# --- Check for BMAD residuals in source-of-truth ---
BMAD_IN_SKILLS=$(grep -rl "BMAD" "$BASE_DIR/.agents/skills/"*/SKILL.md 2>/dev/null | wc -l | tr -d ' ')
BMAD_IN_COMMANDS=$(grep -rl "BMAD" "$BASE_DIR/.agents/commands/"*.md 2>/dev/null | wc -l | tr -d ' ')
BMAD_IN_RULES=$(grep -rl "BMAD" "$BASE_DIR/.agents/rules/"*/*.md 2>/dev/null | wc -l | tr -d ' ')
BMAD_TOTAL=$((BMAD_IN_SKILLS + BMAD_IN_COMMANDS + BMAD_IN_RULES))

if [ "$BMAD_TOTAL" -gt 0 ]; then
  DRIFT_DETAILS="${DRIFT_DETAILS}BMAD residuals: ${BMAD_TOTAL} core files. "
fi

# --- Check domain_agnostic compliance ---
NON_AGNOSTIC=$(grep -rl "domain_agnostic: false" "$BASE_DIR/.agents/skills/"*/SKILL.md 2>/dev/null | wc -l | tr -d ' ')
if [ "$NON_AGNOSTIC" -gt 0 ]; then
  DRIFT_DETAILS="${DRIFT_DETAILS}domain_agnostic:false in ${NON_AGNOSTIC} skills. "
fi

# --- Check for stale project docs (>90 days) ---
TODAY_EPOCH=$(date +%s 2>/dev/null || echo "0")
STALE_DOCS=0
if [ "$TODAY_EPOCH" != "0" ]; then
  for doc in "$BASE_DIR/docs/projects/"*.md "$BASE_DIR/docs/projects/"*/*.md "$BASE_DIR/docs/projects/"*/*/*.md; do
    [ -f "$doc" ] 2>/dev/null || continue
    LAST_UPDATED=$(grep -m1 "last_updated:" "$doc" 2>/dev/null | sed "s/.*: *['\"]*//" | sed "s/['\"].*//" | tr -d ' ')
    if [ -n "$LAST_UPDATED" ]; then
      DOC_EPOCH=$(date -j -f "%Y-%m-%d" "$LAST_UPDATED" +%s 2>/dev/null || echo "0")
      if [ "$DOC_EPOCH" != "0" ]; then
        DIFF_DAYS=$(( (TODAY_EPOCH - DOC_EPOCH) / 86400 ))
        [ "$DIFF_DAYS" -gt 90 ] && STALE_DOCS=$((STALE_DOCS + 1))
      fi
    fi
  done
fi

# --- Output summary ---
echo "ECOSYSTEM: skills=${ACTUAL_SKILLS} commands=${ACTUAL_COMMANDS} rules=${ACTUAL_RULES} agents=${ACTUAL_AGENTS} hooks=${ACTUAL_HOOKS} | BMAD=${BMAD_TOTAL} non-agnostic=${NON_AGNOSTIC} stale=${STALE_DOCS}"

if [ "$DRIFT_FOUND" = true ] || [ "$BMAD_TOTAL" -gt 0 ] || [ "$NON_AGNOSTIC" -gt 0 ]; then
  echo "DRIFT: $DRIFT_DETAILS"
  exit 1
else
  echo "OK: Counts match CLAUDE.md. 0 BMAD. 100% domain-agnostic. ${STALE_DOCS} stale docs."
  exit 0
fi
