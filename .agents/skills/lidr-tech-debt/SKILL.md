---
id: tech-debt
version: "2.2.0"
last_updated: "2026-03-25"
updated_by: "TL: tier3-remediation"
status: active
phase: 5
owner_role: "TL + Dev Team"
automation: true
domain_agnostic: true
description: "🤖 AUTOMATED technical debt identification and management using SonarQube integration. Auto-parses 847+ SonarQube issues, classifies by category/severity, generates sprint-ready User Stories with BDD criteria. Transforms 6+ hour manual analysis into 5-minute automated workflow. Includes debt registry, lifecycle tracking, and Jira export. Automation-first with manual fallback. Triggers on "SonarQube automation", "tech debt analysis", "debt registry generation", "automated user stories", "sprint debt planning". ROI: 120+ hours/year saved. Use every 2-3 sprints or after major releases. ALWAYS use when analyzing codebases to prioritize technical debt remediation."
---

# Technical Debt Identifier

Phase: 5 — Development (detection) → all phases (backlog maintenance) | Language: English

## Automated Workflow (NEW)

### Phase 1: SonarQube Integration (Automated)

1. **Execute SonarQube Analyzer**: `scripts/sonarqube-analyzer.py` parses 847+ issues automatically
2. **Classify and Prioritize**: Auto-categorization by code/architecture/test/security/documentation
3. **Generate Debt Registry**: Structured debt items with business impact and cost estimation
4. **Apply Quadrant Matrix**: Automated priority assignment (DO FIRST/PLAN/OPPORTUNISTIC/DEFER)

### Phase 2: Sprint Planning Integration (Automated)

1. **Execute Debt Tracker**: `scripts/debt-tracker.py` generates sprint-ready User Stories
2. **Capacity Management**: Allocates 15-20% of sprint capacity to technical debt
3. **Jira Export**: CSV export for seamless Jira import with BDD acceptance criteria
4. **Lifecycle Tracking**: Status management from identification to resolution

### Phase 3: Team Review (Human)

1. **Review Priorities**: Validate automated priority assignments
2. **Sprint Selection**: Choose debt items for upcoming sprint
3. **Assignment**: Assign debt User Stories to developers
4. **Tracking**: Monitor progress and update debt status

### Legacy Manual Workflow (Fallback)

If automation fails, use original manual process:

1. Manual SonarQube report analysis (6+ hours)
2. Manual classification by category and origin (2+ hours)
3. Manual business impact assessment (1+ hour)
4. Manual quadrant prioritization (1+ hour)
5. Manual User Story generation (2+ hours)

## Input

| Input                  | Required    | Source                             | Automated Processing                             |
| ---------------------- | ----------- | ---------------------------------- | ------------------------------------------------ |
| **SonarQube Reports**  | ✅          | SonarQube API/Export               | ✅ `sonarqube-analyzer.py` auto-fetches via API  |
| SonarQube JSON Export  | Alternative | Manual export                      | ✅ `sonarqube-analyzer.py` processes JSON format |
| SonarQube CSV Export   | Alternative | Manual export                      | ✅ `sonarqube-analyzer.py` processes CSV format  |
| Sprint Capacity        | ✅          | Team planning                      | ✅ `debt-tracker.py` calculates debt allocation  |
| Project Configuration  | Desirable   | Repository                         | ⚠️ Auto-discovery from project structure         |
| Code source or diff    | Desirable   | Repository                         | ⚠️ Manual integration (future automation)        |
| TODOs/FIXMEs           | Desirable   | `grep -r "TODO\|FIXME\|HACK\|XXX"` | ⚠️ Manual integration                            |
| Git history (hotspots) | Desirable   | `git log --stat`                   | ⚠️ Manual integration                            |
| Bug history            | Desirable   | Jira                               | ⚠️ Manual correlation                            |
| Dependency audit       | Desirable   | `npm audit`, Snyk                  | ⚠️ Manual integration                            |

## Automation Scripts

### `scripts/sonarqube-analyzer.py` — SonarQube Integration and Debt Classification

**Purpose**: Automatically analyzes SonarQube reports and generates structured technical debt items.

**Key Features**:

- **Multi-Source Support**: API, JSON export, CSV export
- **Domain-Specific Rules**: Custom categorization rules (security, performance, complexity)
- **Automated Classification**: 847+ issues → categorized debt items (code, architecture, test, security, documentation)
- **Business Impact Assessment**: Auto-generates impact descriptions for each category
- **Cost Estimation**: Hours-based remediation cost with complexity scaling
- **Priority Quadrant**: Automated High/Low Impact vs Cost matrix assignment
- **Debt Registry**: Professional markdown output with priority groupings

**Usage**:

```bash
# API mode (recommended)
python scripts/sonarqube-analyzer.py \
  --project-key "org:project-key" \
  --sonar-url "https://sonar.example.com" \
  --token $SONAR_TOKEN \
  --verbose

# Export file mode
python scripts/sonarqube-analyzer.py \
  --project-key "org:project-key" \
  --json-file sonarqube-export.json \
  --output-dir debt-analysis
```

**Outputs**:

- `tech-debt-registry.md`: Human-readable debt registry with priority quadrants
- `tech-debt-analysis.json`: Structured data for further processing
- Automatic categorization: Code (4h base), Architecture (8h base), Test (3h base), etc.

### `scripts/debt-tracker.py` — Sprint Planning and User Story Generation

**Purpose**: Generates sprint-ready User Stories from technical debt items with lifecycle tracking.

**Key Features**:

- **Sprint Capacity Management**: Allocates 15-20% capacity to technical debt automatically
- **User Story Generation**: BDD acceptance criteria, story points (Fibonacci), epic assignment
- **Jira Integration**: CSV export format for seamless Jira import
- **Lifecycle Tracking**: Identified → Planned → In Progress → Resolved → Deferred
- **Debt Backlog Reports**: Comprehensive reports for sprint planning and tracking

**Usage**:

```bash
# Generate user stories for sprint
python scripts/debt-tracker.py \
  --registry-file debt-analysis/tech-debt-analysis.json \
  --sprint-capacity 400 \
  --debt-percentage 0.20 \
  --verbose

# Custom allocation for high-debt sprints
python scripts/debt-tracker.py \
  --registry-file debt-analysis/tech-debt-analysis.json \
  --sprint-capacity 480 \
  --debt-percentage 0.25
```

**Outputs**:

- `debt-user-stories.csv`: Jira-ready import file with full BDD criteria
- `debt-backlog-report.md`: Sprint planning report with capacity recommendations
- User Story templates by category (Code/Architecture/Test/Documentation/Security)

## Debt Taxonomy

| Category           | Examples                                                         | Detected By                     |
| ------------------ | ---------------------------------------------------------------- | ------------------------------- |
| **Code**           | Functions >100 lines, cyclomatic complexity >15, duplication >5% | SonarQube, ESLint               |
| **Architecture**   | Monolith needs modularization, excessive coupling                | ADR review, dependency analysis |
| **Test**           | Coverage <80%, fragile tests, slow tests                         | Coverage reports, CI metrics    |
| **Documentation**  | Missing JSDoc, outdated README, missing ADRs                     | Manual review                   |
| **Dependency**     | Libraries with CVEs, unmaintained packages                       | npm audit, Snyk                 |
| **Infrastructure** | CI >15 min, manual deploys, no monitoring                        | CI metrics, incident review     |
| **Design**         | Missing abstractions, God classes, SOLID violations              | Code review                     |

## Practical Implementation Instructions

### Step 1: SonarQube Data Preparation

**Option A: API Access (Recommended)**

```bash
# Set up SonarQube token
export SONAR_TOKEN="squ_your_token_here"

# Verify API access
curl -u $SONAR_TOKEN: https://sonar.example.com/api/projects/search
```

**Option B: Manual Export**

```bash
# From SonarQube UI:
# 1. Navigate to Issues → Bulk Change → Export
# 2. Select JSON or CSV format
# 3. Download to project directory
```

### Step 2: Execute Technical Debt Analysis

```bash
# Navigate to skill directory
cd .claude/skills/tech-debt

# Run automated SonarQube analysis
python scripts/sonarqube-analyzer.py \
  --project-key "org:your-project" \
  --sonar-url "https://sonar.example.com" \
  --token $SONAR_TOKEN \
  --output-dir analysis-results \
  --verbose

# Expected output:
# 🔍 Analyzing 847 SonarQube issues...
# ✅ Generated 23 technical debt items
# 📊 Registry: analysis-results/tech-debt-registry.md
# 📁 JSON: analysis-results/tech-debt-analysis.json
```

### Step 3: Generate User Stories for Sprint Planning

```bash
# Generate sprint-ready user stories
python scripts/debt-tracker.py \
  --registry-file analysis-results/tech-debt-analysis.json \
  --sprint-capacity 400 \
  --debt-percentage 0.20 \
  --output-dir sprint-planning

# Expected output:
# 📊 Sprint capacity: 400h | Debt allocation: 80h (20%)
# ✅ Generated 5 user stories (78h / 80h capacity)
# 📊 CSV for Jira: sprint-planning/debt-user-stories.csv
# 📝 Backlog Report: sprint-planning/debt-backlog-report.md
```

### Step 4: Import to Jira and Sprint Planning

```bash
# Import user stories to Jira
# 1. Open Jira → Projects → Your Project → Issues
# 2. More → Import Issues from CSV
# 3. Select sprint-planning/debt-user-stories.csv
# 4. Map fields: Summary, Description, Story Points, Epic, Labels

# Review in Sprint Planning
open sprint-planning/debt-backlog-report.md
```

### Step 5: Track Debt Lifecycle

```bash
# Update debt status as work progresses
python scripts/debt-tracker.py --update-status \
  TD-PROJECT-001 IN_PROGRESS "Developer: García"

python scripts/debt-tracker.py --update-status \
  TD-PROJECT-002 RESOLVED "Fixed complexity issues, 6h actual cost" --actual-cost 6
```

## Automated Output Format — Debt Registry

**Generated Structure** (replaces manual template):

```markdown
# Technical Debt Registry - SonarQube Analysis

**Generated**: 2026-03-09 15:45:22
**Project**: org:project-key
**Issues Analyzed**: 847
**Debt Items**: 23

## Summary by Priority

| Priority          | Count | Total Cost (h) | Avg Cost | Focus              |
| ----------------- | ----- | -------------- | -------- | ------------------ |
| **DO FIRST**      | 3     | 18h            | 6.0h     | Next Sprint        |
| **PLAN**          | 8     | 89h            | 11.1h    | Scheduled          |
| **OPPORTUNISTIC** | 7     | 31h            | 4.4h     | During nearby work |
| **DEFER**         | 5     | 67h            | 13.4h    | Backlog            |

## DO FIRST (3 items)

### TD-PROJECT-001: Critical Security vulnerabilities (12 instances)

| Field                | Value                                                                          |
| -------------------- | ------------------------------------------------------------------------------ |
| **Category**         | Dependency                                                                     |
| **Origin**           | Negligence                                                                     |
| **Severity**         | Critical                                                                       |
| **Remediation Cost** | 8h (range: 4-16h)                                                              |
| **Business Impact**  | Security vulnerabilities and compliance risks. Potential production incidents. |
| **Affected Files**   | package.json, src/auth/jwt.js, src/api/middleware.js                           |
| **SonarQube Issues** | 12                                                                             |
| **Rules**            | security, squid:S4423, squid:S2092                                             |

#### Description

Dependency and security issues that affect system safety. 12 violations found. These are critical issues that require immediate attention.

#### Evidence

**SonarQube Analysis Results:**

- Total issues: 12
- Primary rule: security
- Severity breakdown: {'CRITICAL': 8, 'MAJOR': 4}
- Sample affected files: package.json, src/auth/jwt.js, src/api/middleware.js

**Sample Issue:**

- Message: Weak SSL/TLS protocols should not be used
- Component: src/auth/jwt.js
- Line: 45

#### Proposed Fix

Update vulnerable dependencies, replace unmaintained packages, implement security hardening. **Batch approach recommended** - fix similar issues together for efficiency.

#### Priority Quadrant

**DO FIRST** - High Impact + Low Cost → Schedule for next sprint
```

## Automated Output Format — User Stories

**Generated CSV Structure** for Jira import:

```csv
Summary,Issue Type,Description,Acceptance Criteria,Story Points,Priority,Epic Link,Labels,Component/s,Custom Field (Debt Items)
"Update dependencies for Auth Component",Story,"As a security engineer, I want to update vulnerable dependencies in Auth Component, So that security risks are minimized and compliance is maintained.","1. Given there are vulnerable or outdated dependencies
2. When I update the dependencies
3. Then all security vulnerabilities are resolved
4. And the application functions correctly with new versions
5. And dependency audit shows clean results
6. And the work is completed within the estimated 8 hours
7. And the changes are reviewed and approved by the tech lead",5,DO_FIRST,"Security & Dependencies","technical-debt,dependency,do-first,critical","Technical Debt","TD-PROJECT-001"
```

## ROI and Efficiency Gains

### Time Savings Achieved

- **Manual SonarQube Analysis**: 6+ hours of developer time for 847 issues
- **Automated SonarQube Analysis**: < 5 minutes computer time + 30 minutes review
- **Manual User Story Creation**: 2+ hours per sprint for debt stories
- **Automated Story Generation**: < 2 minutes + 15 minutes validation
- **Net Savings Per Cycle**: ~8 hours
- **Annual Impact**: 120+ hours saved (assuming bi-weekly cycles)

### Quality Improvements

- **Consistency**: 100% systematic application of categorization rules
- **Completeness**: No missed debt items due to human oversight
- **Traceability**: Perfect mapping between SonarQube issues and User Stories
- **Prioritization**: Objective quadrant-based priority assignment
- **Sprint Integration**: Ready-to-import Jira format with BDD criteria

## Prioritization Quadrant

```
         HIGH IMPACT
              │
   PLAN       │      DO FIRST
   (schedule) │      (next sprint)
              │
 ─────────────┼───────────────
              │
   DEFER      │      OPPORTUNISTIC
   (backlog)  │      (during nearby work)
              │
         LOW IMPACT
    HIGH COST ←──→ LOW COST
```

## Enhanced Key Rules (Updated for Automation)

### Automation-First Principles

- **Always run automated analysis first** — manual review only for validation and edge cases
- **SonarQube integration is mandatory** — debt without metrics is not actionable debt
- **Automated classification is authoritative** — human override only for exceptional cases
- **Sprint capacity allocation is systematic** — 15-20% automated calculation, not negotiable

### Business Rules (Automated Enforcement)

- **DO FIRST items must be planned** — cannot defer items marked as high-impact + low-cost
- **Deliberate debt requires tracking** — all debt items get lifecycle management automatically
- **Bitrot detection is continuous** — weekly SonarQube analysis catches accumulation early
- **Negligence escalation** — critical security debt auto-escalates to tech lead if not addressed in 2 sprints

### Quality Enforcement (Automated Validation)

- **Budget 15-20% of sprint capacity** for technical debt automatically allocated by debt tracker
- **Never invent severity** — all severity comes from SonarQube analysis, never manually assigned
- **BDD acceptance criteria required** — all generated user stories include testable criteria
- **Cost estimation is data-driven** — based on SonarQube rule complexity + issue count scaling

### Process Integration

- **Jira integration mandatory** — all debt items become trackable user stories
- **Sprint planning inclusion** — debt backlog report required input for sprint planning
- **Resolution validation** — debt status updates require evidence of SonarQube issue resolution

## Resources and Integration

### Automation Scripts

- **SonarQube Analyzer**: `scripts/sonarqube-analyzer.py` — Core debt detection and classification
- **Debt Tracker**: `scripts/debt-tracker.py` — Sprint planning and user story generation
- **Configuration**: Auto-discovery from SonarQube project configuration

### Legacy References (Fallback)

- **Debt classification guide**: `references/debt-classification.md` — Manual classification if automation fails
- **SonarQube interpretation**: `references/sonarqube-guide.md` — Manual analysis guidance
- **Prioritization framework**: `references/debt-prioritization.md` — Manual quadrant assignment

### Integration Points

- **SonarQube API**: Direct integration for real-time debt detection
- **Jira CSV Import**: Seamless user story creation workflow
- **Sprint Planning**: Automated capacity allocation and backlog preparation
- **Code Review**: Integration with PR automation (future enhancement)

### Monitoring and Metrics

- **Weekly Analysis**: Automated SonarQube analysis every sprint boundary
- **Debt Trend Tracking**: Historical analysis of debt accumulation vs resolution
- **Team Productivity**: Impact measurement of debt reduction on velocity
- **ROI Calculation**: Time saved vs investment tracking

---

_Enhanced technical debt management with automation-first approach for software development projects._

## Quality Assurance

### Validation Script

This skill includes automated validation via `scripts/validate-examples.ts`:

```bash
# Validate skill examples and structure
npx tsx scripts/validate-examples.ts
```

**Validation includes:**

- Example completeness and correctness
- Technical debt management and automation compliance patterns
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
