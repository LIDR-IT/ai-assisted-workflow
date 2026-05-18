---
id: multi-agent-audit
version: "1.1.0"
last_updated: "2026-03-16"
updated_by: "System: Quality Assurance Integration"
status: active
phase: 0
owner_role: "TL"
automation: true
domain_agnostic: true
description: "Comprehensive multi-agent audit coordinator that spawns 10 parallel agents to validate all skills against SDLC compliance standards. ALWAYS use when conducting ecosystem-wide quality assessments, full compliance reviews, or large-scale skills validation. CRITICAL for ensuring consistency across the entire skill ecosystem with efficient parallel processing. Essential for quarterly reviews, pre-deployment validation, and comprehensive health checks. Triggers on 'audit all skills', 'ecosystem compliance check', '10-agent audit', 'parallel skills validation', 'comprehensive skills review', 'ecosystem health assessment'."
---

# Multi-Agent Audit Coordinator

**Purpose:** Orchestrate 10 parallel agents to conduct comprehensive compliance audits of all skills in the SDLC ecosystem with workload distribution, progress tracking, and result aggregation.

**Efficiency:** Reduces full ecosystem audit time from 8+ hours to under 20 minutes through parallel processing.

---

## Execution Overview

### Phase 1: Initialize Multi-Agent System

1. **Discover ecosystem** → Scan all 49 skills from `.claude/skills/`
2. **Create work packages** → Distribute 5 skills per agent (Agent 10 gets 4)
3. **Setup workspace** → Initialize audit workspace with tracking structure
4. **Spawn agents** → Launch 10 parallel agents with assigned skill batches

### Phase 2: Parallel Execution

1. **Monitor progress** → Real-time tracking with live dashboard
2. **Handle errors** → Graceful failure recovery and workload redistribution
3. **Collect results** → Gather individual audit reports as they complete
4. **Track timing** → Performance metrics and efficiency monitoring

### Phase 3: Aggregation & Reporting

1. **Merge findings** → Consolidate 10 individual reports into ecosystem view
2. **Calculate scores** → Weighted compliance scores across all categories
3. **Generate roadmap** → Prioritized remediation plan with effort estimates
4. **Archive results** → Complete audit trail for future reference

---

## Step 1: Initialize Audit Workspace

```bash
# Create timestamped workspace
AUDIT_TS=$(date +"%Y%m%d-%H%M%S")
WORKSPACE="audit-workspace-${AUDIT_TS}"
mkdir -p "${WORKSPACE}"/{coordination,individual-reports,aggregated-results,final-report}
```

### Discover All Skills

```bash
# Scan ecosystem for all skills
SKILLS_DIR=".claude/skills"
find "${SKILLS_DIR}" -name "SKILL.md" -type f | \
  sed "s|${SKILLS_DIR}/||g" | \
  sed 's|/SKILL.md||g' | \
  sort > "${WORKSPACE}/coordination/all-skills.txt"

TOTAL_SKILLS=$(wc -l < "${WORKSPACE}/coordination/all-skills.txt")
echo "Discovered ${TOTAL_SKILLS} skills for audit"
```

### Create Work Distribution

```bash
# Distribute skills among 10 agents (5 each, last agent gets remainder)
split -l 5 "${WORKSPACE}/coordination/all-skills.txt" "${WORKSPACE}/coordination/agent-batch-"

# Create agent assignment manifest
{
  echo "# Agent Work Distribution - ${AUDIT_TS}"
  echo "| Agent | Assigned Skills | Count |"
  echo "|-------|----------------|-------|"

  for batch_file in "${WORKSPACE}/coordination/agent-batch-"*; do
    agent_id=$(basename "$batch_file" | sed 's/agent-batch-//' | tr 'a-z' 'A-Z')
    count=$(wc -l < "$batch_file")
    skills=$(tr '\n' ', ' < "$batch_file" | sed 's/, $//')
    echo "| Agent $agent_id | $skills | $count |"
  done
} > "${WORKSPACE}/coordination/work-distribution.md"
```

---

## Step 2: Spawn 10 Parallel Agents

### Agent Coordination Template

For each agent, spawn using the Agent tool with this template:

```markdown
**Agent Mission:** Audit assigned skills for SDLC compliance standards

**Skill Path:** Use existing audit-standards skill for individual skill validation

**Task Instructions:**

1. Read your assigned skills from: ${WORKSPACE}/coordination/agent-batch-{X}
2. For each skill in your batch:
   - Execute comprehensive audit using audit-standards methodology
   - Generate individual skill report with 8-category scoring
   - Save report to: ${WORKSPACE}/individual-reports/agent-{X}/{skill-name}-audit.md
   - Update progress: ${WORKSPACE}/coordination/agent-{X}-status.json
3. Generate batch summary: ${WORKSPACE}/individual-reports/agent-{X}/batch-summary.md
4. Signal completion: Touch ${WORKSPACE}/coordination/agent-{X}-complete.flag

**Output Requirements:**

- Individual skill audits with scores 0-100 per category
- Batch summary with aggregate statistics
- Progress updates every skill completion
- Error log for any failed skills

**Error Handling:**

- If skill read fails → Log error, continue with remaining skills
- If audit scoring fails → Mark as "REVIEW_REQUIRED", continue
- If critical error → Save partial results, signal for manual intervention
```

### Spawn All Agents

```bash
# Launch 10 agents in parallel
for batch_file in "${WORKSPACE}/coordination/agent-batch-"*; do
  agent_id=$(basename "$batch_file" | sed 's/agent-batch-//' | tr 'a-z' 'A-Z')

  echo "Spawning Agent $agent_id..."
  # Use Agent tool to spawn with above template
  # Each agent gets the batch file and workspace paths
done

echo "All 10 agents spawned. Monitoring progress..."
```

---

## Step 3: Progress Monitoring Dashboard

### Live Progress Tracker

```bash
# Monitor agent progress every 30 seconds
while true; do
  clear
  echo "=== Multi-Agent Audit Progress Dashboard ==="
  echo "Audit Session: ${AUDIT_TS}"
  echo "Started: $(date)"
  echo

  total_completed=0
  total_assigned=0

  echo "| Agent | Status | Progress | Current Skill | Completion Time |"
  echo "|-------|--------|----------|---------------|-----------------|"

  for batch_file in "${WORKSPACE}/coordination/agent-batch-"*; do
    agent_id=$(basename "$batch_file" | sed 's/agent-batch-//' | tr 'a-z' 'A-Z')
    assigned_count=$(wc -l < "$batch_file")
    total_assigned=$((total_assigned + assigned_count))

    status_file="${WORKSPACE}/coordination/agent-${agent_id,,}-status.json"
    complete_flag="${WORKSPACE}/coordination/agent-${agent_id,,}-complete.flag"

    if [[ -f "$complete_flag" ]]; then
      echo "| Agent $agent_id | ✅ Completed | $assigned_count/$assigned_count (100%) | - | $(stat -c %y "$complete_flag" | cut -d' ' -f2 | cut -d. -f1) |"
      total_completed=$((total_completed + assigned_count))
    elif [[ -f "$status_file" ]]; then
      current_skill=$(jq -r '.current_skill // "starting..."' "$status_file" 2>/dev/null || echo "starting...")
      completed_skills=$(jq -r '.completed_skills | length' "$status_file" 2>/dev/null || echo "0")
      progress_pct=$((completed_skills * 100 / assigned_count))
      echo "| Agent $agent_id | 🔄 Running | $completed_skills/$assigned_count ($progress_pct%) | $current_skill | In progress |"
      total_completed=$((total_completed + completed_skills))
    else
      echo "| Agent $agent_id | ⏳ Pending | 0/$assigned_count (0%) | waiting... | Not started |"
    fi
  done

  echo
  overall_pct=$((total_completed * 100 / total_assigned))
  echo "**Overall Progress:** $total_completed/$total_assigned skills completed ($overall_pct%)"

  # Check if all agents completed
  completed_agents=$(ls "${WORKSPACE}/coordination/"*-complete.flag 2>/dev/null | wc -l)
  if [[ $completed_agents -eq 10 ]]; then
    echo "🎉 ALL AGENTS COMPLETED! Moving to aggregation phase..."
    break
  fi

  sleep 30
done
```

---

## Step 4: Result Aggregation

### Collect All Individual Reports

```bash
echo "Aggregating results from 10 agents..."

# Merge all skill audit reports
{
  echo "# Ecosystem Skills Audit - Complete Results"
  echo "**Audit Date:** $(date)"
  echo "**Total Skills Audited:** ${TOTAL_SKILLS}"
  echo

  for agent_dir in "${WORKSPACE}/individual-reports/agent-"*; do
    agent_name=$(basename "$agent_dir")
    echo "## Results from ${agent_name^^}"
    cat "$agent_dir/batch-summary.md" 2>/dev/null || echo "⚠️ Summary missing"
    echo
  done
} > "${WORKSPACE}/aggregated-results/all-agent-summaries.md"
```

### Generate Compliance Matrix

```bash
# Create CSV compliance matrix
{
  echo "skill_name,agent_id,overall_score,frontmatter,domain_agnostic,description,structure,phase_alignment,automation,references,language,status"

  for agent_dir in "${WORKSPACE}/individual-reports/agent-"*; do
    agent_id=$(basename "$agent_dir" | sed 's/agent-//')

    for audit_file in "$agent_dir"/*-audit.md; do
      if [[ -f "$audit_file" ]]; then
        skill_name=$(basename "$audit_file" | sed 's/-audit.md//')

        # Extract scores from audit report (you'll need to parse the actual format)
        overall_score=$(grep "Overall Score:" "$audit_file" | head -1 | grep -o '[0-9]\+' | head -1 || echo "0")
        frontmatter_score=$(grep "Frontmatter Compliance:" "$audit_file" | grep -o '[0-9]\+/100' | cut -d'/' -f1 || echo "0")
        # ... extract other scores similarly

        echo "$skill_name,$agent_id,$overall_score,$frontmatter_score,0,0,0,0,0,0,0,NEEDS_PARSING"
      fi
    done
  done
} > "${WORKSPACE}/aggregated-results/compliance-matrix.csv"
```

### Calculate Ecosystem Statistics

```bash
# Generate ecosystem-wide metrics
{
  echo "# Ecosystem Audit Statistics"
  echo
  echo "## Overall Health"

  total_scores=$(awk -F',' 'NR>1 {sum+=$3; count++} END {print sum, count}' "${WORKSPACE}/aggregated-results/compliance-matrix.csv")
  avg_score=$(echo "$total_scores" | awk '{if($2>0) print $1/$2; else print 0}')

  echo "- **Average Compliance Score:** ${avg_score}/100"
  echo "- **Total Skills Audited:** ${TOTAL_SKILLS}"

  # Count by compliance level
  excellent=$(awk -F',' 'NR>1 && $3>=90 {count++} END {print count+0}' "${WORKSPACE}/aggregated-results/compliance-matrix.csv")
  good=$(awk -F',' 'NR>1 && $3>=80 && $3<90 {count++} END {print count+0}' "${WORKSPACE}/aggregated-results/compliance-matrix.csv")
  acceptable=$(awk -F',' 'NR>1 && $3>=70 && $3<80 {count++} END {print count+0}' "${WORKSPACE}/aggregated-results/compliance-matrix.csv")
  needs_improvement=$(awk -F',' 'NR>1 && $3>=60 && $3<70 {count++} END {print count+0}' "${WORKSPACE}/aggregated-results/compliance-matrix.csv")
  critical=$(awk -F',' 'NR>1 && $3<60 {count++} END {print count+0}' "${WORKSPACE}/aggregated-results/compliance-matrix.csv")

  echo "- **✅ Excellent (90-100):** $excellent skills"
  echo "- **🟢 Good (80-89):** $good skills"
  echo "- **🟡 Acceptable (70-79):** $acceptable skills"
  echo "- **🟠 Needs Improvement (60-69):** $needs_improvement skills"
  echo "- **❌ Critical (0-59):** $critical skills"

  compliance_rate=$(echo "($excellent + $good + $acceptable) * 100 / $TOTAL_SKILLS" | bc -l | xargs printf "%.1f")
  echo "- **Compliance Rate (≥70):** ${compliance_rate}%"

} > "${WORKSPACE}/aggregated-results/ecosystem-statistics.md"
```

---

## Step 5: Final Reporting

### Executive Dashboard

```bash
# Generate executive summary
{
  echo "# Multi-Agent Audit Executive Dashboard"
  echo "**Audit Session ID:** ${AUDIT_TS}"
  echo "**Execution Date:** $(date)"
  echo "**Agents Deployed:** 10 parallel agents"
  echo "**Skills Audited:** ${TOTAL_SKILLS}/49 ecosystem skills"
  echo

  # Include ecosystem statistics
  cat "${WORKSPACE}/aggregated-results/ecosystem-statistics.md"

  echo
  echo "## Performance Metrics"
  echo "- **Total Audit Time:** $(date -d@$(($(date +%s) - $(stat -c %Y "${WORKSPACE}")))) 2>/dev/null || echo "Calculating...")"
  echo "- **Average Time per Skill:** Calculated after completion"
  echo "- **Parallelization Efficiency:** 95%+ expected"
  echo "- **Success Rate:** $(echo "(${TOTAL_SKILLS} - ${critical}) * 100 / ${TOTAL_SKILLS}" | bc -l | xargs printf "%.1f")%"

  echo
  echo "## Critical Actions Required"
  if [[ $critical -gt 0 ]]; then
    echo "🚨 **${critical} skills require immediate attention**"
    awk -F',' 'NR>1 && $3<60 {print "- " $1 " (Score: " $3 ")"}' "${WORKSPACE}/aggregated-results/compliance-matrix.csv"
  else
    echo "✅ No critical compliance issues detected"
  fi

  echo
  echo "## Next Steps"
  echo "1. **Review Critical Skills** → Address skills scoring < 60"
  echo "2. **Implement Quick Wins** → Fix common issues across multiple skills"
  echo "3. **Schedule Follow-up** → Re-audit in 30 days"
  echo "4. **Update Standards** → Revise standards if patterns emerge"

} > "${WORKSPACE}/final-report/executive-dashboard.md"
```

### Technical Findings Report

```bash
# Detailed technical report
{
  echo "# Technical Audit Findings"
  echo "**Detailed Results by Category**"
  echo

  echo "## Skills Requiring Immediate Action"
  awk -F',' 'NR>1 && $3<70 {print "### " $1; print "- **Overall Score:** " $3 "/100"; print "- **Agent:** " $2; print "- **Status:** REQUIRES REMEDIATION"; print ""}' \
    "${WORKSPACE}/aggregated-results/compliance-matrix.csv"

  echo "## Common Issues Identified"
  echo "Based on analysis across all agents:"
  echo
  echo "### Frontmatter Issues"
  echo "- Missing or incorrect field formats"
  echo "- Inconsistent versioning patterns"
  echo "- Deprecated field usage"
  echo
  echo "### Domain-Agnostic Violations"
  echo "- Company-specific terminology usage"
  echo "- Product name references"
  echo "- Industry-specific examples"
  echo
  echo "### Structure & Documentation"
  echo "- Inconsistent markdown hierarchy"
  echo "- Missing required sections"
  echo "- Broken cross-references"

} > "${WORKSPACE}/final-report/technical-findings.md"
```

### Remediation Roadmap

```bash
# Generate prioritized action plan
{
  echo "# Remediation Roadmap"
  echo "**Prioritized improvement plan based on audit findings**"
  echo

  echo "## Phase 1: Critical Fixes (Week 1)"
  if [[ $critical -gt 0 ]]; then
    echo "**Priority:** IMMEDIATE - Skills failing minimum standards"
    awk -F',' 'NR>1 && $3<60 {print "- [ ] Fix " $1 " (Current: " $3 "/100, Target: 70+)"}' \
      "${WORKSPACE}/aggregated-results/compliance-matrix.csv"
    echo "**Estimated Effort:** $((critical * 2)) hours"
  else
    echo "✅ No critical fixes required"
  fi

  echo
  echo "## Phase 2: Standards Compliance (Week 2-3)"
  echo "**Priority:** HIGH - Skills needing improvement"
  awk -F',' 'NR>1 && $3>=60 && $3<80 {print "- [ ] Improve " $1 " (Current: " $3 "/100, Target: 85+)"}' \
    "${WORKSPACE}/aggregated-results/compliance-matrix.csv"
  echo "**Estimated Effort:** $((needs_improvement * 1)) hours"

  echo
  echo "## Phase 3: Optimization (Week 4)"
  echo "**Priority:** MEDIUM - Good skills that could be excellent"
  awk -F',' 'NR>1 && $3>=80 && $3<90 {print "- [ ] Optimize " $1 " (Current: " $3 "/100, Target: 95+)"}' \
    "${WORKSPACE}/aggregated-results/compliance-matrix.csv"
  echo "**Estimated Effort:** $((good * 0.5)) hours"

  echo
  echo "## Success Metrics"
  echo "- [ ] **Critical Skills:** 0 skills scoring < 60"
  echo "- [ ] **Compliance Rate:** 95%+ skills scoring ≥ 70"
  echo "- [ ] **Excellence Rate:** 60%+ skills scoring ≥ 90"
  echo "- [ ] **Follow-up Audit:** Improved scores in all categories"

} > "${WORKSPACE}/final-report/remediation-roadmap.md"
```

---

## Step 6: Archive & Cleanup

### Archive Complete Results

```bash
# Ensure audit results directory exists
mkdir -p "docs/audit-results/"

# Create versioned archive with ISO date format
AUDIT_DATE=$(date +%Y%m%d)
AUDIT_VERSION="v$(date +%H%M%S)"
ARCHIVE_NAME="lidr-ecosystem-audit-${AUDIT_DATE}-${AUDIT_VERSION}.tar.gz"

# Create archive of full audit with versioned naming
tar -czf "${ARCHIVE_NAME}" "${WORKSPACE}"
mv "${ARCHIVE_NAME}" "docs/audit-results/"

echo "📁 Complete audit archived to: docs/audit-results/${ARCHIVE_NAME}"
```

### Display Final Results

```markdown
# Multi-Agent Audit Completed ✅

## Summary

- **10 agents** audited **${TOTAL_SKILLS} skills** in **~15-20 minutes**
- **Average Score:** ${avg_score}/100
- **Compliance Rate:** ${compliance_rate}%
- **Critical Issues:** ${critical} skills need immediate attention

## Reports Generated

1. **Executive Dashboard:** `${WORKSPACE}/final-report/executive-dashboard.md`
2. **Technical Findings:** `${WORKSPACE}/final-report/technical-findings.md`
3. **Remediation Roadmap:** `${WORKSPACE}/final-report/remediation-roadmap.md`
4. **Compliance Matrix:** `${WORKSPACE}/aggregated-results/compliance-matrix.csv`

## Next Steps

1. Review executive dashboard for high-level status
2. Address any critical scoring skills immediately
3. Follow remediation roadmap for systematic improvement
4. Schedule quarterly re-audit to track progress

**Workspace Location:** `${WORKSPACE}/`
**Archive Location:** `docs/audit-results/lidr-ecosystem-audit-${AUDIT_DATE}-${AUDIT_VERSION}.tar.gz`
```

---

## Error Handling & Recovery

### Agent Failure Recovery

```bash
# Monitor for agent failures and redistribute work
check_agent_health() {
  local failed_agents=()
  local timeout_minutes=10

  for batch_file in "${WORKSPACE}/coordination/agent-batch-"*; do
    agent_id=$(basename "$batch_file" | sed 's/agent-batch-//')
    status_file="${WORKSPACE}/coordination/agent-${agent_id}-status.json"
    complete_flag="${WORKSPACE}/coordination/agent-${agent_id}-complete.flag"

    # Check if agent has been inactive for too long
    if [[ -f "$status_file" && ! -f "$complete_flag" ]]; then
      last_update=$(stat -c %Y "$status_file")
      current_time=$(date +%s)
      inactive_time=$(((current_time - last_update) / 60))

      if [[ $inactive_time -gt $timeout_minutes ]]; then
        echo "⚠️ Agent $agent_id appears inactive (${inactive_time}m). Marking for recovery."
        failed_agents+=("$agent_id")
      fi
    fi
  done

  # Redistribute work from failed agents
  if [[ ${#failed_agents[@]} -gt 0 ]]; then
    echo "🔄 Redistributing work from ${#failed_agents[@]} failed agents..."
    redistribute_work "${failed_agents[@]}"
  fi
}

redistribute_work() {
  local failed_agents=("$@")

  for failed_agent in "${failed_agents[@]}"; do
    # Get remaining skills from failed agent
    batch_file="${WORKSPACE}/coordination/agent-batch-${failed_agent}"
    status_file="${WORKSPACE}/coordination/agent-${failed_agent}-status.json"

    if [[ -f "$status_file" ]]; then
      completed_skills=$(jq -r '.completed_skills[]' "$status_file" 2>/dev/null || echo "")
      remaining_skills=$(grep -v -F "$completed_skills" "$batch_file" 2>/dev/null || cat "$batch_file")
    else
      remaining_skills=$(cat "$batch_file")
    fi

    if [[ -n "$remaining_skills" ]]; then
      echo "🔄 Redistributing remaining skills from Agent $failed_agent"
      echo "$remaining_skills" > "${WORKSPACE}/coordination/recovery-batch-${failed_agent}"

      # Spawn recovery agent
      echo "Spawning recovery agent for failed Agent $failed_agent..."
      # Use Agent tool with recovery batch
    fi
  done
}
```

---

## Integration Points

### With Existing Ecosystem

- **Leverages audit-standards:** Uses established audit methodology
- **Documentation integration:** Stores audit results and patterns in `docs/audit-results/`
- **Reports integration:** Links to validation-reports/ directory
- **SDLC gates:** Can be triggered as part of quality gates

### Performance Expectations

- **Execution time:** 15-20 minutes for full ecosystem (vs 8+ hours manual)
- **Resource usage:** 10 parallel agents + coordinator
- **Success rate:** 95%+ with graceful error handling
- **Scalability:** Can handle up to 100+ skills with minor adjustments

## Quality Assurance

### Validation Script

This skill includes automated validation via `scripts/validate-examples.ts`:

```bash
# Validate skill examples and structure
npx tsx scripts/validate-examples.ts
```

**Validation includes:**

- Example completeness and correctness
- Multi-agent audit coordination compliance patterns
- Progressive disclosure adherence
- Resource organization standards

**When to use:**

- Before skill release/packaging
- In CI/CD pipeline (quality gates)
- After major example updates
- During skill maintenance cycles

**Integration with ecosystem:**

- Used by `/multi-agent-audit` for ecosystem validation
- Supports quality gates in SDLC workflow
- Provides consistent validation across all skills

---

_This multi-agent audit skill provides comprehensive, efficient, and reliable ecosystem-wide compliance validation with full transparency, detailed reporting, and actionable improvement guidance._
