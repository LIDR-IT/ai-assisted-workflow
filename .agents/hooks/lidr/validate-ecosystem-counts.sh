#!/bin/bash
# validate-ecosystem-counts.sh
# Deterministic ecosystem artifact count validation
# Replaces the broken prompt-based Stop hook that couldn't access transcripts
#
# Counts actual files in the filesystem and compares against CLAUDE.md expected counts.
# Outputs a summary line for Claude Code hook consumption.

BASE_DIR="$(cd "$(dirname "$0")/../.." && pwd)"
CLAUDE_MD="$BASE_DIR/.claude/CLAUDE.md"

# --- Count actual artifacts ---
ACTUAL_SKILLS=$(find "$BASE_DIR/.claude/skills" -maxdepth 2 -name "SKILL.md" 2>/dev/null | wc -l | tr -d ' ')
ACTUAL_COMMANDS=$(find "$BASE_DIR/.claude/commands" -maxdepth 1 -name "*.md" 2>/dev/null | wc -l | tr -d ' ')
ACTUAL_RULES=$(find "$BASE_DIR/.claude/rules" -maxdepth 1 -name "*.md" 2>/dev/null | wc -l | tr -d ' ')
ACTUAL_AGENTS=$(find "$BASE_DIR/.claude/agents" -maxdepth 1 -name "*.md" 2>/dev/null | wc -l | tr -d ' ')
ACTUAL_HOOKS=$(find "$BASE_DIR/.claude/hooks" -maxdepth 1 -name "*.sh" 2>/dev/null | wc -l | tr -d ' ')

# --- Extract expected counts from CLAUDE.md (macOS-compatible) ---
EXPECTED_SKILLS=$(grep 'Skills |' "$CLAUDE_MD" 2>/dev/null | head -1 | sed 's/.*Skills | *\([0-9]*\).*/\1/' || echo "0")
EXPECTED_COMMANDS=$(grep 'Commands |' "$CLAUDE_MD" 2>/dev/null | head -1 | sed 's/.*Commands | *\([0-9]*\).*/\1/' || echo "0")
EXPECTED_RULES=$(grep 'Rules |' "$CLAUDE_MD" 2>/dev/null | head -1 | sed 's/.*Rules | *\([0-9]*\).*/\1/' || echo "0")

# --- Compare ---
DRIFT_FOUND=false
DRIFT_DETAILS=""

if [ "$ACTUAL_SKILLS" != "$EXPECTED_SKILLS" ] && [ -n "$EXPECTED_SKILLS" ] && [ "$EXPECTED_SKILLS" != "0" ]; then
  DRIFT_FOUND=true
  DRIFT_DETAILS="${DRIFT_DETAILS}Skills: CLAUDE.md=${EXPECTED_SKILLS} filesystem=${ACTUAL_SKILLS}. "
fi

if [ "$ACTUAL_COMMANDS" != "$EXPECTED_COMMANDS" ] && [ -n "$EXPECTED_COMMANDS" ] && [ "$EXPECTED_COMMANDS" != "0" ]; then
  DRIFT_FOUND=true
  DRIFT_DETAILS="${DRIFT_DETAILS}Commands: CLAUDE.md=${EXPECTED_COMMANDS} filesystem=${ACTUAL_COMMANDS}. "
fi

if [ "$ACTUAL_RULES" != "$EXPECTED_RULES" ] && [ -n "$EXPECTED_RULES" ] && [ "$EXPECTED_RULES" != "0" ]; then
  DRIFT_FOUND=true
  DRIFT_DETAILS="${DRIFT_DETAILS}Rules: CLAUDE.md=${EXPECTED_RULES} filesystem=${ACTUAL_RULES}. "
fi

# --- Check for BMAD residuals in core files ---
BMAD_IN_SKILLS=$(grep -rl "BMAD" "$BASE_DIR/.claude/skills/"*/SKILL.md 2>/dev/null | wc -l | tr -d ' ')
BMAD_IN_COMMANDS=$(grep -rl "BMAD" "$BASE_DIR/.claude/commands/"*.md 2>/dev/null | wc -l | tr -d ' ')
BMAD_IN_RULES=$(grep -rl "BMAD" "$BASE_DIR/.claude/rules/"*.md 2>/dev/null | wc -l | tr -d ' ')
BMAD_TOTAL=$((BMAD_IN_SKILLS + BMAD_IN_COMMANDS + BMAD_IN_RULES))

if [ "$BMAD_TOTAL" -gt 0 ]; then
  DRIFT_DETAILS="${DRIFT_DETAILS}BMAD residuals: ${BMAD_TOTAL} core files. "
fi

# --- Check domain_agnostic compliance ---
NON_AGNOSTIC=$(grep -rl "domain_agnostic: false" "$BASE_DIR/.claude/skills/"*/SKILL.md 2>/dev/null | wc -l | tr -d ' ')
if [ "$NON_AGNOSTIC" -gt 0 ]; then
  DRIFT_DETAILS="${DRIFT_DETAILS}domain_agnostic:false in ${NON_AGNOSTIC} skills. "
fi

# --- Check for stale project docs (>90 days) ---
TODAY_EPOCH=$(date +%s)
STALE_DOCS=0
for doc in "$BASE_DIR/docs/projects/"*.md "$BASE_DIR/docs/projects/"*/*.md "$BASE_DIR/docs/projects/"*/*/*.md; do
  [ -f "$doc" ] 2>/dev/null || continue
  LAST_UPDATED=$(grep -m1 "last_updated:" "$doc" 2>/dev/null | sed "s/.*: *['\"]*//" | sed "s/['\"].*//" | tr -d ' ')
  if [ -n "$LAST_UPDATED" ]; then
    DOC_EPOCH=$(date -j -f "%Y-%m-%d" "$LAST_UPDATED" +%s 2>/dev/null || echo "0")
    if [ "$DOC_EPOCH" != "0" ]; then
      DIFF_DAYS=$(( (TODAY_EPOCH - DOC_EPOCH) / 86400 ))
      if [ "$DIFF_DAYS" -gt 90 ]; then
        STALE_DOCS=$((STALE_DOCS + 1))
      fi
    fi
  fi
done

# --- Output summary ---
echo "ECOSYSTEM: skills=${ACTUAL_SKILLS} commands=${ACTUAL_COMMANDS} rules=${ACTUAL_RULES} agents=${ACTUAL_AGENTS} hooks=${ACTUAL_HOOKS} | BMAD=${BMAD_TOTAL} non-agnostic=${NON_AGNOSTIC} stale=${STALE_DOCS}"

if [ "$DRIFT_FOUND" = true ] || [ "$BMAD_TOTAL" -gt 0 ] || [ "$NON_AGNOSTIC" -gt 0 ]; then
  echo "DRIFT: $DRIFT_DETAILS"
  exit 1
else
  echo "OK: Counts match CLAUDE.md. 0 BMAD. 100% domain-agnostic. ${STALE_DOCS} stale docs."
  exit 0
fi
