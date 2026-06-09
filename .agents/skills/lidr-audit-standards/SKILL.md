---
name: lidr-audit-standards
id: audit-standards
version: "2.0.0"
last_updated: "2026-03-25"
updated_by: "TL: ecosystem-audit-expansion"
status: active
phase: 0
owner_role: "TL"
automation: false
domain_agnostic: true
description: "ECOSYSTEM-SCOPE WRAPPER complementing `bmad-review-adversarial-general` (which reviews content quality). This audits the `.agents/` ecosystem STRUCTURE itself: frontmatter consistency, domain-agnostic content, methodology uniformity, staleness detection, path correctness, drift between sources of truth. Use for periodic ecosystem health checks, not content reviews. Triggers on 'audit skills', 'audit ecosystem', 'audit rules', 'audit docs', 'validate standards', 'compliance check', 'frontmatter audit', 'staleness check'."
---

# Audit Standards Validator

**Purpose:** Comprehensive validation of all ecosystem artifacts — skills, rules, docs, ADRs, standards, and guides — against established SDLC ecosystem standards for quality, consistency, and compliance.

**Scope:** Validates skills (57) against 8 critical categories of standards, PLUS validates non-skill documents (rules, ADRs, standards, guides, audits) against frontmatter compliance, staleness, and reference integrity standards defined in `rules/documentation.md`.

---

## Standards Categories

### 1. Frontmatter Compliance

**Required Fields (9 total):**

- `id`: Skill identifier (string)
- `version`: Semantic version (string with quotes)
- `last_updated`: ISO date format (YYYY-MM-DD)
- `updated_by`: Author attribution (string with quotes)
- `status`: Lifecycle status (active|draft|deprecated)
- `phase`: SDLC phase alignment (0-8)
- `owner_role`: Responsibility assignment (string with quotes)
- `automation`: Automation capability (true|false)
- `domain_agnostic`: Universality confirmation (true)
- `description`: Trigger and usage description (string with quotes)

**Validation Criteria:**

- All 9 fields present and correctly formatted
- No extra or deprecated fields (e.g., old `name` field)
- Proper YAML syntax and data types
- Date format compliance (YYYY-MM-DD)
- Boolean values as literals (not strings)

### 2. Domain-Agnostic Content

**Prohibited Terms (domain-specific):**

- Company product names (e.g., proprietary SDK names, platform-specific identifiers)
- Domain-specific technology terms → should use generic equivalents (e.g., `recognition`, `audio verification`, `authenticity detection`)
- Proprietary data template names → should be `data template`
- Organization-specific terminology not universally applicable

**Validation Criteria:**

- Content uses generic, universally applicable language
- No hardcoded product or company references
- Industry-agnostic examples and use cases
- `domain_agnostic: true` field present and accurate

### 3. Description Quality

**Trigger Optimization:**

- Clear indication of WHEN to use the skill
- Specific trigger phrases included
- Context scenarios provided
- Not too generic or too specific

**Validation Criteria:**

- Description contains trigger phrases in quotes
- Includes usage contexts and scenarios
- Follows "Essential for X - ALWAYS use when Y" pattern
- Balances specificity with broad applicability

### 4. Content Structure

**Required Elements:**

- Consistent header structure
- Clear workflow/process sections
- Input/output specifications
- Examples where applicable
- Proper markdown formatting

**Validation Criteria:**

- Uses standard markdown hierarchy (H1 → H6)
- Consistent section naming patterns
- Tables properly formatted
- Code blocks with language specification
- Logical information flow

### 5. Phase Alignment

**SDLC Phase Mapping (0-8):**

- F0: Preparación (bmad-document-project)
- F1: Originación (business-case, kickoff, stakeholder-map, tracking-integration)
- F2: Discovery (prd-tecnico, prd-funcional, review-cruzado, risk-log, poc-report)
- F3: Especificación (generate-rf, generate-nfr, validate-requirements, epic-breakdown)
- F4: Planning (user-stories, sprint-capacity, refinement-notes)
- F5: Desarrollo (pr-description, adr, tech-debt, dev-handoff-qa)
- F6: QA (test-plan, create-test-cases, bug-report, test-execution-report, regression-suite)
- F7: Seguridad (vuln-assessment, dast-interpretation, pentest-report, security-checklist)
- F8: Despliegue (change-request, rollback-plan, release-notes, retrospective, postmortem)

**Validation Criteria:**

- Phase number matches skill's actual SDLC position
- Cross-cutting skills (phase 0) properly identified
- Development/tooling skills have appropriate phase assignment

### 6. Automation Detection

**Automation Flags:**

- `automation: true` for 7 automated skills:
  - validate-requirements, tech-debt
  - user-stories, regression-suite, test-plan
  - release-notes, security-checklist
- `automation: false` for all manual skills

**Validation Criteria:**

- Automation flag accurately reflects skill capability
- Automated skills have Python scripts or clear automation patterns
- Manual skills require human judgment/creativity
- No misclassified automation status

### 7. Reference Validation

**@ References:**

- Links to docs/ files use @ prefix
- Referenced files actually exist
- No broken or outdated references
- Consistent referencing style

**Validation Criteria:**

- All @docs/ references resolve to existing files
- No orphaned or deprecated references
- Consistent use of @ prefix for docs/
- References add value and context

### 8. Language Compliance

**Language Rules:**

- Functional content: Spanish
- Technical inline: English
- Code/commits: English
- Mixed context: Spanish primary with English technical terms

**Validation Criteria:**

- Appropriate language for content type
- Consistent terminology usage
- No unnecessary mixing of languages
- Clear communication in chosen language

---

## Audit Process

### Step 1: Initialize Audit

```markdown
# Skill Audit: {skill-name}

**Date:** {current-date}
**Auditor:** {auditor-name}
**Standards Version:** v1.0

## Skill Overview

- **Path:** skills/{skill-name}/SKILL.md
- **Current Version:** {version}
- **Last Updated:** {last_updated}
- **Owner Role:** {owner_role}
```

### Step 2: Category Assessment

For each of the 8 categories, assign a score 0-100:

**Scoring Scale:**

- 90-100: Excellent - Fully compliant, exceeds standards
- 80-89: Good - Compliant with minor improvements possible
- 70-79: Acceptable - Meets standards with some gaps
- 60-69: Needs Improvement - Major gaps, requires remediation
- 0-59: Critical - Does not meet standards, immediate action required

### Step 3: Detailed Findings

```markdown
## Detailed Assessment

### 1. Frontmatter Compliance: {score}/100

**Status:** {Excellent|Good|Acceptable|Needs Improvement|Critical}
**Findings:**

- ✅/❌ All 9 required fields present
- ✅/❌ Correct data types and formatting
- ✅/❌ No deprecated fields
  **Issues:** {list specific issues}
  **Recommendations:** {specific remediation steps}

### 2. Domain-Agnostic Content: {score}/100

**Status:** {status}
**Findings:**

- ✅/❌ No domain-specific or company-specific terminology
- ✅/❌ Generic, universally applicable language
- ✅/❌ domain_agnostic: true flag accurate
  **Issues:** {list specific terms that need replacement}
  **Recommendations:** {replacement suggestions}

[Continue for all 8 categories...]
```

### Step 4: Overall Assessment

```markdown
## Overall Assessment

**Overall Score:** {average-score}/100
**Overall Status:** {Excellent|Good|Acceptable|Needs Improvement|Critical}

**Summary:**

- **Strengths:** {key positive findings}
- **Critical Issues:** {must-fix items}
- **Recommendations:** {prioritized improvement suggestions}

**Compliance Status:** ✅ COMPLIANT / ⚠️ CONDITIONAL / ❌ NON-COMPLIANT

**Next Steps:**

1. {immediate action item}
2. {follow-up action item}
3. {optimization opportunity}
```

---

## Execution Instructions

### For Single Skill Audit

1. Read the skill's SKILL.md file completely
2. Extract and validate frontmatter fields
3. Analyze content for domain-agnostic compliance
4. Assess each of the 8 categories systematically
5. Generate detailed findings with specific evidence
6. Provide actionable recommendations
7. Calculate overall compliance score

### For Batch Audit (Multiple Skills)

1. Create audit workspace directory
2. For each skill in the batch:
   - Execute single skill audit process
   - Save individual audit report
   - Track category scores in summary matrix
3. Generate batch summary report
4. Identify common patterns across skills
5. Prioritize remediation efforts
6. Create consolidated action plan

### Output Format

- Individual skill reports: `audit-{skill-name}-{date}.md`
- Batch summary: `batch-audit-summary-{date}.md`
- Compliance matrix: `compliance-matrix-{date}.csv`
- Action plan: `remediation-plan-{date}.md`

---

## Quality Gates

### Pre-Deployment Gate

Before any skill release or ecosystem update:

- **Minimum Score:** 80/100 overall
- **Critical Categories:** Frontmatter + Domain-Agnostic must be ≥90/100
- **No Critical Issues:** No category below 60/100

### Periodic Review Gate

Quarterly ecosystem health check:

- **Target Average:** 85/100 across all skills
- **Compliance Rate:** ≥95% skills at "Acceptable" or better
- **Improvement Trend:** Consistent improvement over time

### Emergency Assessment Gate

When ecosystem integrity is questioned:

- **Full audit:** All 48 skills within 24 hours
- **Critical triage:** Immediate attention to sub-60 scores
- **Fast remediation:** 48-hour turnaround for critical fixes

---

## Automation Support

### Scripts Integration

While this skill requires human judgment for qualitative assessment, it can leverage automation for:

- Frontmatter field validation (Python script)
- Domain-specific term detection (regex patterns)
- Reference link validation (file existence checks)
- Scoring calculations and aggregations

### Batch Processing

For large-scale audits (10+ skills), use:

1. **Parallel execution:** Multiple agents with skill subsets
2. **Standardized reporting:** Consistent output formats
3. **Automated aggregation:** Summary generation
4. **Exception handling:** Graceful error management

### Multi-Agent Coordination Mode

#### Agent Batch Execution

When invoked by the multi-agent-audit coordinator:

```bash
# Accept batch input file
BATCH_FILE="${1:-batch-skills.txt}"
AGENT_ID="${2:-agent-unknown}"
WORKSPACE="${3:-audit-workspace}"

# Initialize agent workspace
AGENT_DIR="${WORKSPACE}/individual-reports/${AGENT_ID}"
mkdir -p "${AGENT_DIR}"

# Process each skill in batch
while IFS= read -r skill_name; do
  echo "Agent ${AGENT_ID}: Auditing skill ${skill_name}..."

  # Update progress tracking
  update_agent_progress "${skill_name}" "in_progress"

  # Execute individual skill audit
  audit_single_skill "${skill_name}" "${AGENT_DIR}/${skill_name}-audit.md"

  # Update completion status
  update_agent_progress "${skill_name}" "completed"

done < "${BATCH_FILE}"

# Generate agent batch summary
generate_agent_summary "${AGENT_ID}" "${AGENT_DIR}"
```

#### Standardized Output Format

Each agent produces reports in this exact structure:

```
individual-reports/agent-X/
├── {skill-name}-audit.md          # Individual skill audit reports
├── batch-summary.md               # Agent's batch summary
├── compliance-scores.json         # Machine-readable scores
├── error-log.md                   # Any errors encountered
└── timing-metrics.json            # Performance data
```

#### Progress Tracking Protocol

```json
// coordination/agent-{id}-status.json
{
  "agent_id": "agent-a",
  "assigned_skills": ["skill1", "skill2", "skill3"],
  "current_skill": "skill2",
  "completed_skills": ["skill1"],
  "failed_skills": [],
  "start_time": "2026-03-15T10:00:00Z",
  "last_update": "2026-03-15T10:15:00Z",
  "estimated_completion": "2026-03-15T10:45:00Z"
}
```

#### Error Boundary Handling

```bash
audit_single_skill() {
  local skill_name="$1"
  local output_file="$2"

  {
    # Attempt skill audit with timeout
    timeout 300s audit_skill_core "${skill_name}" > "${output_file}"
  } || {
    # Handle failures gracefully
    echo "# AUDIT FAILURE: ${skill_name}" > "${output_file}"
    echo "**Status:** REVIEW_REQUIRED" >> "${output_file}"
    echo "**Error:** Audit failed - requires manual review" >> "${output_file}"
    echo "**Overall Score:** 0/100" >> "${output_file}"

    # Log error for coordinator
    log_audit_error "${skill_name}" "Audit execution failed"

    # Continue with next skill
    return 1
  }
}

log_audit_error() {
  local skill_name="$1"
  local error_msg="$2"

  echo "$(date -Iseconds): ${skill_name}: ${error_msg}" >> "${AGENT_DIR}/error-log.md"
}
```

#### Machine-Readable Scoring

```json
// compliance-scores.json per agent
{
  "agent_id": "agent-a",
  "audit_timestamp": "2026-03-15T10:30:00Z",
  "skills_audited": [
    {
      "skill_name": "business-case",
      "overall_score": 85,
      "category_scores": {
        "frontmatter": 90,
        "domain_agnostic": 80,
        "description": 85,
        "structure": 85,
        "phase_alignment": 95,
        "automation": 70,
        "references": 90,
        "language": 95
      },
      "status": "GOOD",
      "critical_issues": [],
      "recommendations": ["Improve automation flag documentation"]
    }
  ],
  "batch_summary": {
    "skills_completed": 3,
    "skills_failed": 0,
    "average_score": 83.5,
    "compliance_rate": 100.0,
    "execution_time_seconds": 180
  }
}
```

---

## Integration Points

### With Existing Ecosystem

- **Validation Reports:** Links to existing validation-reports/ directory
- **Memory System:** Stores audit patterns and improvements
- **LIDR SDLC Methodology:** Aligns with 13-step validation framework
- **Quality Rules:** Enforces documentation.md standards

### With SDLC Gates

- **Gate 0-7:** Appropriate skill quality validation
- **Pre-merge:** Code review includes skill compliance
- **Release preparation:** Full ecosystem audit required
- **Continuous improvement:** Regular health assessments

---

## Success Metrics

### Immediate (Per Audit)

- **Completion Rate:** 100% of assigned skills audited
- **Issue Detection:** All non-compliance items identified
- **Actionability:** Specific, implementable recommendations
- **Consistency:** Uniform scoring across auditors

### Strategic (Ecosystem-wide)

- **Quality Improvement:** Upward trend in average scores
- **Standards Adoption:** Decreasing remediation requirements
- **Ecosystem Health:** Sustained high compliance rates
- **Efficiency Gains:** Reduced audit time as standards mature

---

---

## Multi-Agent Integration Instructions

### When Invoked by multi-agent-audit Coordinator

#### 1. Accept Coordination Parameters

```bash
# Standard coordination interface
SKILL_BATCH="$1"      # File containing assigned skills (one per line)
AGENT_ID="$2"         # Unique agent identifier (agent-a, agent-b, etc.)
WORKSPACE="$3"        # Shared workspace root directory
COORDINATOR_PID="$4"  # Coordinator process ID for heartbeat
```

#### 2. Initialize Agent Environment

- Create isolated working directory: `${WORKSPACE}/individual-reports/${AGENT_ID}/`
- Initialize progress tracking: `${WORKSPACE}/coordination/${AGENT_ID}-status.json`
- Setup error logging: `${WORKSPACE}/individual-reports/${AGENT_ID}/error-log.md`

#### 3. Process Skills in Sequence

For each skill in the batch file:

- Update progress tracker with current skill
- Execute full 8-category audit assessment
- Generate individual report in standardized format
- Extract machine-readable scores
- Handle errors with graceful degradation
- Report completion to coordinator

#### 4. Generate Batch Summary

At completion, produce:

- **Batch Summary Report** with aggregate statistics
- **JSON Compliance Data** for coordinator aggregation
- **Performance Metrics** including timing and throughput
- **Error Summary** if any skills failed

#### 5. Signal Completion

- Touch completion flag: `${WORKSPACE}/coordination/${AGENT_ID}-complete.flag`
- Final status update with summary statistics
- Cleanup temporary files while preserving results

### Coordination Error Recovery

#### Timeout Handling

If agent doesn't respond within 10 minutes:

- Coordinator will mark agent as failed
- Remaining skills redistributed to available agents
- Partial results preserved for manual review

#### Skill Failure Protocol

If individual skill audit fails:

- Log specific error with context
- Mark skill as "REVIEW_REQUIRED"
- Continue with remaining skills in batch
- Include failure in final batch summary

#### Resource Management

- Limit memory usage per agent to 500MB
- Timeout individual skill audits at 5 minutes
- Cleanup temporary files after each skill
- Preserve only essential results and logs

---

## Quality Assurance

### Validation Script

This skill includes automated validation via `scripts/validate-examples.ts`:

```bash
# Validate skill examples and structure
npx tsx scripts/validate-examples.ts
```

**Validation includes:**

- Example completeness and correctness
- Audit standards compliance patterns
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

---

## Extended Ecosystem Audit — Non-Skill Documents

> **Added in v2.0.0**: Extends audit coverage beyond SKILL.md files to validate **all ecosystem documents** against the frontmatter and governance standards defined in `rules/documentation.md`.

### Scope of Extended Audit

| Document Type | Path Pattern          | Expected Count | Frontmatter Schema |
| ------------- | --------------------- | -------------- | ------------------ |
| **Rules**     | `.claude/rules/*.md`  | 5              | Rule schema        |
| **ADRs**      | `docs/adr/*.md`       | 4              | Doc schema         |
| **Standards** | `docs/standards/*.md` | 4              | Doc schema         |
| **Guides**    | `docs/guides/**/*.md` | 8+             | Doc schema         |
| **Audits**    | `docs/audits/*.md`    | 1              | Doc schema         |

---

### Required Frontmatter Fields by Document Type

#### Rules (`.claude/rules/*.md`)

| Field          | Type   | Required | Validation                                                     |
| -------------- | ------ | -------- | -------------------------------------------------------------- |
| `id`           | string | YES      | Must match filename without `.md` extension                    |
| `version`      | string | YES      | Semver format `"X.Y.Z"` (quoted)                               |
| `last_updated` | string | YES      | ISO date `YYYY-MM-DD`                                          |
| `updated_by`   | string | YES      | Format `"Role: Name"`                                          |
| `status`       | enum   | YES      | Must be `active` (rules are always active)                     |
| `scope`        | enum   | YES      | One of: `organization`, `project`, `documentation`, `workflow` |

**Example — Valid Rule Frontmatter:**

```yaml
---
id: documentation
version: "2.1.0"
last_updated: "2026-03-17"
updated_by: "TL: Lead Engineer"
status: active
scope: documentation
---
```

#### Docs — ADRs, Standards, Guides, Audits

| Field          | Type   | Required    | Validation                                                                                 |
| -------------- | ------ | ----------- | ------------------------------------------------------------------------------------------ |
| `id`           | string | YES         | Unique document identifier                                                                 |
| `version`      | string | YES         | Semver format `"X.Y.Z"` (quoted)                                                           |
| `last_updated` | string | YES         | ISO date `YYYY-MM-DD`                                                                      |
| `updated_by`   | string | YES         | Format `"Role: Name"`                                                                      |
| `status`       | enum   | YES         | One of: `draft`, `active`, `deprecated`                                                    |
| `type`         | enum   | YES         | One of: `checklist`, `signoff`, `template`, `standard`, `project`, `adr`, `guide`, `audit` |
| `owner_role`   | string | YES         | Role responsible for the document                                                          |
| `review_cycle` | number | RECOMMENDED | Days between mandatory reviews (30, 60, or 90)                                             |
| `next_review`  | string | RECOMMENDED | Computed: `last_updated` + `review_cycle` days                                             |

**Example — Valid Doc Frontmatter (ADR):**

```yaml
---
id: ADR-0001-context-loading-strategy
version: "1.0.0"
last_updated: "2025-10-15"
updated_by: "TL: Lead Engineer"
status: active
type: adr
owner_role: "TL"
review_cycle: 90
next_review: "2026-01-13"
---
```

**Example — Valid Doc Frontmatter (Standard):**

```yaml
---
id: org-standards
version: "1.2.0"
last_updated: "2026-02-01"
updated_by: "PME: Project Manager"
status: active
type: standard
owner_role: "PME"
review_cycle: 90
next_review: "2026-05-02"
---
```

---

### Staleness Detection

Based on `rules/documentation.md` staleness indicators, the audit checks each document's freshness:

| Indicator | Condition                                                        | Action                                          |
| --------- | ---------------------------------------------------------------- | ----------------------------------------------- |
| FRESH     | `last_updated` < `review_cycle / 2` ago                          | No action needed                                |
| DUE SOON  | `last_updated` between `review_cycle / 2` and `review_cycle` ago | Flag for upcoming review                        |
| STALE     | `last_updated` > `review_cycle` ago                              | Flag as overdue, requires immediate review      |
| CRITICAL  | `last_updated` > `review_cycle * 2` ago                          | Escalate — document may be dangerously outdated |

**Default Review Cycles (when `review_cycle` field is absent):**

| Document Type | Default Cycle | Reviewer            |
| ------------- | ------------- | ------------------- |
| Rules         | 90 days       | Tech Lead           |
| Standards     | 90 days       | PME + Tech Lead     |
| ADRs          | 90 days       | Tech Lead           |
| Guides        | 60 days       | Tech Lead           |
| Audits        | 60 days       | QA Lead + Tech Lead |

---

### Broken Reference Validation

The audit scans all non-skill documents for `@` references and verifies:

1. **File Existence**: Every `@path/to/file.md` reference resolves to an actual file in the repository
2. **Consistency**: References use the canonical path format (relative to `.claude/` or project root)
3. **No Orphans**: Documents referenced by others still exist and are not `deprecated`
4. **Bidirectional Integrity**: If doc A references doc B, doc B should be aware of doc A (where applicable)

**Validation Output Format:**

```markdown
### Reference Integrity Report

| Document             | Reference                              | Target                                | Status    |
| -------------------- | -------------------------------------- | ------------------------------------- | --------- |
| rules/org.md         | @docs/standards/org.md                 | docs/standards/org.md                 | ✅ Valid  |
| rules/project.md     | @docs/projects/sdlc-{{CLIENT_CODE}}.md | docs/projects/sdlc-{{CLIENT_CODE}}.md | ✅ Valid  |
| docs/adr/ADR-0001.md | @rules/nonexistent.md                  | —                                     | ❌ Broken |

**Summary:** {N}/{total} references valid ({percentage}%)
```

---

### Extended Audit Process

#### Step 1: Discover Non-Skill Documents

Scan these directories for `.md` files:

```
.claude/rules/*.md
docs/adr/*.md
docs/standards/*.md
docs/guides/**/*.md
docs/audits/*.md
```

#### Step 2: Validate Frontmatter Per Document

For each document:

1. **Parse YAML frontmatter** — verify it exists between `---` delimiters
2. **Check required fields** — per the schema for that document type (Rule vs Doc)
3. **Validate field formats** — dates as `YYYY-MM-DD`, versions as semver, enums within allowed values
4. **Detect extra/unknown fields** — warn on unexpected fields (not an error, but flagged)

#### Step 3: Check Staleness

For each document with a `last_updated` field:

1. Compute days since `last_updated`
2. Compare against `review_cycle` (or default for document type)
3. Classify as FRESH / DUE SOON / STALE / CRITICAL
4. Generate staleness summary

#### Step 4: Validate References

For each document:

1. Extract all `@path` references from content
2. Resolve each path relative to project root
3. Verify target file exists
4. Report broken references

#### Step 5: Generate Extended Audit Report

```markdown
# Extended Ecosystem Audit Report

**Date:** {current-date}
**Auditor:** {auditor}

## Document Inventory

| Type      | Count   | With Frontmatter | Compliant   | Stale   |
| --------- | ------- | ---------------- | ----------- | ------- |
| Rules     | {n}     | {n}/{n}          | {n}/{n}     | {n}     |
| ADRs      | {n}     | {n}/{n}          | {n}/{n}     | {n}     |
| Standards | {n}     | {n}/{n}          | {n}/{n}     | {n}     |
| Guides    | {n}     | {n}/{n}          | {n}/{n}     | {n}     |
| Audits    | {n}     | {n}/{n}          | {n}/{n}     | {n}     |
| **Total** | **{N}** | **{n}/{N}**      | **{n}/{N}** | **{n}** |

## Frontmatter Compliance Details

### Rules

| File   | id    | version | last_updated | status | scope | Compliant |
| ------ | ----- | ------- | ------------ | ------ | ----- | --------- |
| org.md | ✅/❌ | ✅/❌   | ✅/❌        | ✅/❌  | ✅/❌ | ✅/❌     |

[... one row per file ...]

### Docs (ADRs, Standards, Guides, Audits)

| File | id  | version | last_updated | status | type | owner_role | Compliant |
| ---- | --- | ------- | ------------ | ------ | ---- | ---------- | --------- |

[... one row per file ...]

## Staleness Summary

| Status      | Count | Documents |
| ----------- | ----- | --------- |
| 🟢 FRESH    | {n}   | {list}    |
| 🟡 DUE SOON | {n}   | {list}    |
| 🔴 STALE    | {n}   | {list}    |
| ⚫ CRITICAL | {n}   | {list}    |

## Reference Integrity

- **Total references scanned:** {N}
- **Valid:** {n} ({percentage}%)
- **Broken:** {n}
- **Broken references detail:** {list with file, reference, expected target}

## Overall Extended Audit Score

| Category               | Weight   | Score   | Weighted    |
| ---------------------- | -------- | ------- | ----------- |
| Frontmatter Compliance | 40%      | {n}/100 | {n}         |
| Staleness Health       | 30%      | {n}/100 | {n}         |
| Reference Integrity    | 30%      | {n}/100 | {n}         |
| **Extended Score**     | **100%** |         | **{n}/100** |

## Combined Ecosystem Score

- **Skills Audit Score:** {n}/100 (from standard 8-category audit)
- **Extended Audit Score:** {n}/100 (from this non-skill audit)
- **Combined Ecosystem Score:** {weighted-average}/100 (70% skills + 30% extended)
```

---

### Integration with Standard Audit

The Extended Ecosystem Audit complements the existing 8-category skill audit:

| Audit Type                        | Covers                                 | Weight in Combined Score |
| --------------------------------- | -------------------------------------- | ------------------------ |
| **Standard Audit** (8 categories) | 57 SKILL.md files                      | 70%                      |
| **Extended Audit** (3 categories) | Rules, ADRs, Standards, Guides, Audits | 30%                      |
| **Combined Ecosystem Score**      | Full ecosystem health                  | 100%                     |

**When to run the Extended Audit:**

- Alongside periodic skill audits (quarterly)
- Before major releases or gate transitions
- After bulk documentation updates (`/sync-docs`)
- When onboarding new teams to the ecosystem
- When `dtc-session-check` hook detects documentation drift

---

_This enhanced audit skill ensures reliable, efficient, and scalable ecosystem-wide compliance validation through coordinated multi-agent execution while maintaining the highest standards of quality assessment and reporting._
