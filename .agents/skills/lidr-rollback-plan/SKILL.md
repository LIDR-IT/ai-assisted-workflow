---
name: lidr-rollback-plan
id: rollback-plan
version: "1.3.1"
last_updated: "2026-06-09"
updated_by: "TL: BMAD-coherence batch-fix"
status: active
phase: 8
owner_role: "DevOps"
automation: true
automation_status: "LIVE - 45h/year ROI"
domain_agnostic: true
language_default: en
integrations: [vcs, tracking, chat, ci]
description: "AUTOMATED rollback plan generation with deployment risk analysis using Python automation. Auto-analyzes PRs, database migrations, infrastructure changes, and feature flags to generate executable rollback procedures. Essential when preparing production deployments. Use to transform 4+ hours of manual deployment analysis into 5-minute automated workflow + 30-minute review. Orchestrated by /create-rollback-plan command. ALWAYS use before production deployments to ensure safe rollback capability."
---

# Rollback Plan Generator 🤖 AUTOMATED

Phase: 8 — Deployment | Gate: contributes to Gate 7
Output: English by default; artifact language follows the client `language` setting (see `_shared/lidr/integrations/`).
**ROI**: 45 hours/year (4+ hours manual → 5 minutes automated + 30 minutes review)

Tools resolve via the central registry `_shared/lidr/integrations/tool-registry.yaml`; the active client binds concrete tools in `clients/<CODE>.yaml`.

## Relationship to BMAD

No BMad equivalent: this is a LIDR-native deployment-safety artifact. It analyzes release diffs, migrations, and infra changes to produce an executable rollback runbook that feeds the Change Request at Gate 7 (`lidr-change-request`).

**Principle:** A rollback plan that can't be executed in <15 minutes under stress is not a rollback plan.

## 🚀 Automation Workflow (RECOMMENDED)

### Phase 1: Deployment Analysis (2-3 minutes)

```bash
cd .claude/skills/rollback-plan/scripts
python deployment-analyzer.py --project-dir . --output-dir rollback-analysis
```

**Auto-discovers and analyzes**:

- Git PRs merged since last release tag with breaking change detection
- Database migrations with reversibility assessment and data loss risk
- Infrastructure changes (K8s, Terraform, Docker) with rollback complexity
- Feature flags for instant rollback capabilities
- Domain-specific risks (algorithm changes, data storage, regulatory compliance)

**Generates**: `deployment-analysis.json` + human-readable report + CSV for {{TRACKING_TOOL}}

### Phase 2: Rollback Plan Generation (2-3 minutes)

```bash
python rollback-generator.py --analysis-dir rollback-analysis --output-dir rollback-plan --version 1.3.0
```

**Auto-generates comprehensive rollback plan**:

- Risk classification (Simple/Medium/Complex/Dangerous) with time estimates
- Step-by-step executable procedures with exact commands
- Component-specific rollback strategies (App/DB/Infrastructure/Flags)
- Communication plan and post-rollback verification checklist
- Domain-specific considerations (data compatibility, algorithm rollback, compliance requirements)

**Generates**: Executive rollback plan + step-by-step runbook + communication plan + CSV summary

### Phase 3: Human Review & Validation (30 minutes)

1. **Review risk classification** and estimated rollback time
2. **Validate rollback commands** for specific infrastructure
3. **Customize communication plan** for specific stakeholders
4. **Test rollback procedures** in staging environment (dry run)
5. **Attach to Change Request** for Gate 7 approval
6. **Archive for incident response** and future reference

### Expected Results

- **Executable rollback plan** with <15 minute execution target
- **Risk-based rollback criteria** with monitoring thresholds
- **Component-specific strategies** (Git, DB, Infrastructure, Feature Flags)
- **45 hours/year ROI** vs manual deployment risk analysis

---

## Manual Workflow (Legacy - use only if automation unavailable)

1. Read release PRs to understand what changed
2. Analyze DB migrations: are they reversible?
3. Analyze infra changes: Terraform/K8s manifests
4. Analyze feature flags: can changes be disabled without rollback?
5. Determine rollback strategy per component
6. Generate step-by-step runbook with exact commands
7. Define rollback criteria (when to trigger)

## Input

### 🤖 Automated Processing (Scripts Handle Discovery)

| Input                  | Required | Auto-Discovered From                              | Processing                                             |
| ---------------------- | -------- | ------------------------------------------------- | ------------------------------------------------------ |
| Release PRs            | ✅       | Git log, merge commits, {{VCS_TOOL}} CLI          | **deployment-analyzer.py** parses and extracts         |
| Database migrations    | ✅       | Migration directories (migrations/, db/, prisma/) | **deployment-analyzer.py** analyzes reversibility      |
| Infrastructure changes | ✅       | K8s manifests, Terraform files, Docker configs    | **deployment-analyzer.py** assesses complexity         |
| Feature flags          | ✅       | Config files (_.json, _.env, \*.yaml)             | **deployment-analyzer.py** identifies instant rollback |
| Risk assessment        | ✅       | Code analysis, domain-specific patterns           | **rollback-generator.py** classifies deployment risk   |

### 📋 Manual Input (Legacy - if automation not available)

| Input                     | Required  | Source                                |
| ------------------------- | --------- | ------------------------------------- |
| Release PRs               | ✅        | Git: `git log --merges v{prev}..HEAD` |
| Database migrations       | ✅        | Migration files                       |
| Infrastructure changes    | ✅        | Terraform / K8s manifests             |
| Feature flags             | ✅        | Config management                     |
| Architecture diagram      | Desirable | PRD-T                                 |
| Previous rollback history | Desirable | Incident reports                      |

## 🤖 Automation Scripts

### `scripts/deployment-analyzer.py` (400+ lines)

**Purpose**: Deployment analysis and risk assessment with domain-aware patterns

**Key Features**:

- **Git Analysis**: Auto-discovery of PRs, commits, and changes since last release
- **Migration Assessment**: Database migration reversibility and data loss risk analysis
- **Infrastructure Analysis**: K8s, Terraform, Docker configuration change assessment
- **Feature Flag Discovery**: Auto-discovery of instant rollback capabilities
- **Risk Classification**: Domain-specific risk patterns (algorithms, data storage, regulatory compliance)

**Output**:

- `deployment-analysis.json` (machine processing)
- `deployment-analysis-report.md` (human review)
- `deployment-analysis-summary.csv` ({{TRACKING_TOOL}} integration)

### `scripts/rollback-generator.py` (600+ lines)

**Purpose**: Transform deployment analysis into executable rollback procedures

**Key Features**:

- **Risk-Based Classification**: Simple/Medium/Complex/Dangerous with time estimates
- **Step-by-Step Procedures**: Exact commands with verification steps and timing
- **Component-Specific Strategies**: Application, Database, Infrastructure, Feature Flag rollback
- **Communication Plan**: Stakeholder notification via {{CHAT_TOOL}} and {{TRACKING_TOOL}} incident workflow
- **Domain Considerations**: Data compatibility, algorithm rollback, compliance requirements

**Output**:

- `rollback-plan-{version}.md` (executive plan)
- `rollback-plan-{version}-summary.csv` ({{TRACKING_TOOL}} incident management)
- `rollback-plan-{version}-structure.json` (programmatic access)

### Integration Pattern

```bash
# Full automation workflow
cd .claude/skills/rollback-plan/scripts

# Phase 1: Deployment Analysis (2-3 minutes)
python deployment-analyzer.py --project-dir . --output-dir rollback-analysis

# Phase 2: Rollback Plan Generation (2-3 minutes)
python rollback-generator.py --analysis-dir rollback-analysis --output-dir rollback-plan --version 1.3.0

# Result: Complete rollback plan ready for review and Change Request attachment
```

### ROI Achievement

- **Before**: 4-6 hours manual deployment risk analysis and rollback planning
- **After**: 5 minutes automation + 30 minutes review and customization
- **Savings**: 3.5-5.5 hours per deployment
- **Annual ROI**: 45+ hours/year (based on deployment frequency)
- **Quality**: Consistent risk assessment + executable procedures + domain-aware expertise

## Output Template

```markdown
# Rollback Plan: v{version} — [DATE]

## Rollback Classification

| Aspect                       | Assessment                             |
| ---------------------------- | -------------------------------------- |
| **Overall Complexity**       | Simple / Medium / Complex / Dangerous  |
| **Estimated Time**           | [X] minutes                            |
| **Data Loss Risk**           | None / Minimal / Significant           |
| **DB Migration Reversible?** | Yes / Partial / No                     |
| **Feature Flag Fallback?**   | Yes (instant) / No (requires rollback) |

## Rollback Decision Criteria

Trigger rollback if ANY of these occur within [X] minutes post-deploy:

- [ ] Error rate > [X]% (baseline: [Y]%)
- [ ] P95 latency > [X]ms (baseline: [Y]ms)
- [ ] [Critical user journey] fails
- [ ] [Monitoring alert] fires

## Strategy per Component

### Application Code

| Strategy | Command | Verification |
| -------- | ------- | ------------ |

### Database

| Migration | Reversible? | Rollback Command | Data Impact |
| --------- | ----------- | ---------------- | ----------- |

### Infrastructure

| Change | Rollback Command | Verification |
| ------ | ---------------- | ------------ |

### Feature Flags (instant rollback)

| Flag | Current | Rollback Value | Effect |
| ---- | ------- | -------------- | ------ |

## Step-by-Step Runbook

| Step | Action         | Command           | Verification    | Duration |
| ---- | -------------- | ----------------- | --------------- | -------- |
| 1    | [exact action] | `[exact command]` | [how to verify] | ~[X]min  |

## Communication During Rollback

| When | Who | Channel | Message |
| ---- | --- | ------- | ------- |

## Post-Rollback

- [ ] Verify all services healthy
- [ ] Verify data integrity
- [ ] Notify stakeholders
- [ ] Create incident ticket for investigation
```

## Key Rules

- **Exact commands, not descriptions**: `kubectl rollout undo deployment/app -n production` not "roll back the deployment"
- **Verification after each step**: Every rollback step needs a verification check.
- **Feature flags first**: If the change can be disabled via flag, that's the fastest rollback.
- **Irreversible migrations**: If DB migration is not reversible, flag as 🔴 HIGH RISK and require additional approval.
- **Dry run in staging**: Plan must be tested in staging before production deploy.
- **Time-boxed**: Total rollback must complete in <15 minutes. If longer, reconsider the deployment strategy.
- **Communication plan**: Who to notify during rollback, through which {{CHAT_TOOL}} channel.

## Quality Assurance

### Validation Script

This skill includes automated validation via `scripts/validate-examples.ts`:

```bash
# Validate skill examples and structure
npx tsx scripts/validate-examples.ts
```

**Validation includes:**

- Example completeness and correctness
- Deployment and rollback planning compliance patterns
- Progressive disclosure adherence
- Resource organization standards

**When to use:**

- Before skill release/packaging
- In CI/CD pipeline (quality gates)
- After major example updates
- During skill maintenance cycles

**Integration with ecosystem:**

- Used by `bmad-eval-runner` for ecosystem validation
- Supports quality gates in SDLC workflow
- Provides consistent validation across all skills

## Changelog

| Version | Date       | Author                       | Changes                                                                                                               |
| ------- | ---------- | ---------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| 1.3.1   | 2026-06-09 | TL: BMAD-coherence batch-fix | Added "Relationship to BMAD" note (LIDR-native); added `vcs` to integrations frontmatter                              |
| 1.3.0   | 2026-06-09 | TL: lang+tool agnostic       | Language to English-default-configurable; abstracted {{VCS_TOOL}}, {{TRACKING_TOOL}}, {{CHAT_TOOL}} via tool-registry |
