---
name: lidr-sdlc-tracking
id: sdlc-tracking
version: "1.0.0"
last_updated: "2026-03-17"
updated_by: "SDLC Enhancement Team"
status: active
phase: 0
owner_role: "PME, PO, TL"
automation: false
domain_agnostic: true
description: >
  Centralized SDLC project tracking with phase visibility and portfolio management.
  ALWAYS use when managing active projects requiring lifecycle state tracking across gates.
---

# SKILL: SDLC Tracking System

> **Phase 2 Enhancement**: Centralized project state tracking with sdlc-tracking.yaml for all PME portfolio projects.

## Purpose

Create and maintain centralized SDLC tracking across the 500-project PME portfolio using standardized sdlc-tracking.yaml files for real-time project health, state management, and cross-project analytics.

## When to Use

- **Project Initialization**: When starting any new project in the portfolio
- **Phase Transitions**: When advancing through SDLC gates
- **Progress Monitoring**: Weekly project health checks
- **Portfolio Management**: PME dashboard updates and cross-project analytics
- **External Sync**: Before synchronizing with Jira/Linear/Notion

## Triggers

- "track project progress"
- "update SDLC state"
- "project health check"
- "portfolio dashboard"
- "sync project status"

## Prerequisites

- Project documented in `docs/projects/{project-id}/`
- Basic project structure established
- Gate 0 (Intake) completed

## Process

### Step 1: Initialize SDLC Tracking

Create `sdlc-tracking.yaml` in project root:

```yaml
# SDLC Tracking Configuration - Central Source of Truth
project:
  id: "PROJ-2026-{NNN}"
  name: "Project Name"
  type: "Enhancement" | "New Feature" | "Bug Fix" | "Technical Debt" | "Infrastructure"
  domain: "Authentication" | "Identity Verification" | "Platform Core" | "Security" | "Custom"

portfolio:
  pme_priority: "P1" | "P2" | "P3"
  business_value: "Critical" | "High" | "Medium" | "Low"
  effort_estimate: "S" | "M" | "L" | "XL"
  target_quarter: "Q1 2026" | "Q2 2026" | "Q3 2026" | "Q4 2026"

state:
  currentPhase: 0-8  # SDLC phase number
  currentGate: "G0" | "G1" | "G2" | "G3" | "G4" | "G5" | "G6" | "G7"
  overallProgress: 0.00-1.00  # Percentage as decimal
  health: "Green" | "Yellow" | "Red"

timeline:
  started: "2026-03-17"
  planned_completion: "2026-06-30"
  actual_completion: null | "2026-07-15"
  days_behind_schedule: 0

team:
  pme: "Name"
  po: "Name"
  tl: "Name"
  dev_count: 3
  qa_lead: "Name"

implementation:
  # Standardized folder structure for all projects
  folder: "docs/projects/{project-id}/implementation/"

  epics:
    - id: "EPIC-001"
      title: "Core Implementation"
      status: "in_progress" | "completed" | "blocked"
      external_refs:
        jira: "PROJ-123"
        linear: "LIN-456"
        notion: "page-id"

  stories:
    - id: "US-{PROJ}-{NNN}"
      title: "User Story Title"
      status: "ready" | "in_progress" | "in_review" | "done"
      sprint: "Sprint 2026-12"
      assignee: "dev-name"
      branch: "feat/PROJ-123-feature-name"
      pr: "https://github.com/org/repo/pull/456"
      external_refs:
        jira: "PROJ-124"
        linear: "LIN-457"

  tasks:
    - id: "TASK-{PROJ}-{NNN}"
      title: "Technical Task"
      type: "dev" | "qa" | "security" | "devops" | "docs"
      status: "todo" | "in_progress" | "done"
      owner: "role-name"

  handoffs:
    dev_to_qa: "docs/projects/{project-id}/implementation/handoffs/dev-to-qa/"
    qa_to_security: "docs/projects/{project-id}/implementation/handoffs/qa-to-security/"
    security_to_devops: "docs/projects/{project-id}/implementation/handoffs/security-to-devops/"

metrics:
  velocity: 23.5  # Story points per sprint
  quality:
    bugs_found: 3
    bugs_fixed: 2
    code_coverage: 0.87
    security_score: 0.95
  gates:
    g0_passed: "2026-03-17T09:30:00Z"
    g1_passed: null
    g2_passed: null
    g3_passed: null
    g4_passed: null
    g5_passed: null
    g6_passed: null
    g7_passed: null

risks:
  - id: "RISK-001"
    description: "Dependency on external API"
    probability: 0.3
    impact: 0.8
    mitigation: "Implement fallback mechanism"
    status: "active" | "mitigated" | "accepted"

external_sync:
  jira:
    project_key: "PROJ"
    epic_id: "PROJ-123"
    last_sync: "2026-03-17T14:30:00Z"
  linear:
    team_id: "team-abc"
    project_id: "proj-def"
    last_sync: "2026-03-17T14:30:00Z"
  notion:
    database_id: "abc123"
    page_id: "def456"
    last_sync: "2026-03-17T14:30:00Z"

automation:
  ci_cd_health: "green" | "yellow" | "red"
  test_automation_coverage: 0.78
  deployment_frequency: "2.3/week"
  lead_time_days: 4.2
  mttr_hours: 2.1
```

### Step 2: Implementation Folder Structure

Create standardized folder structure:

```
docs/projects/{project-id}/implementation/
├── epics/
│   ├── epic-001.md
│   └── epic-002.md
├── stories/
│   ├── us-proj-001.md
│   ├── us-proj-002.md
│   └── us-proj-003.md
├── tasks/
│   ├── task-proj-001.md
│   └── task-proj-002.md
└── handoffs/
    ├── dev-to-qa/
    │   ├── sprint-12.md
    │   └── sprint-13.md
    ├── qa-to-security/
    │   └── release-1.2.md
    └── security-to-devops/
        └── release-1.2.md
```

### Step 3: Story Frontmatter Template

Each story file uses rich frontmatter:

```yaml
---
id: us-proj-001
title: "User can authenticate with their credentials"
type: "user_story"
epic: "epic-001"
priority: "P1"
estimation: 8
status: "in_progress"
sprint: "Sprint 2026-12"
assignee: "dev-garcia"

# Development tracking
branch: "feat/PROJ-001-user-auth"
pr: "https://github.com/org/project/pull/123"
commits: 7
test_coverage: 0.89

# External references (ID mapping)
external_refs:
  jira: "PROJ-124"
  linear: "LIN-457"
  notion: "story-page-id"

# Workflow state
created: "2026-03-15"
started: "2026-03-16"
in_review: null
completed: null

# Quality metrics
acceptance_criteria_count: 4
bdd_scenarios: 3
test_cases_linked: 7

# Dependencies
depends_on: ["us-proj-002"]
blocks: []
---
```

### Step 4: Cross-Project Analytics

Enable portfolio-wide analytics:

```yaml
# analytics.yaml (PME dashboard)
portfolio_health:
  total_projects: 500
  active_projects: 127
  projects_on_track: 98
  projects_at_risk: 23
  projects_blocked: 6

phase_distribution:
  phase_0: 15
  phase_1: 23
  phase_2: 19
  phase_3: 17
  phase_4: 28
  phase_5: 12
  phase_6: 8
  phase_7: 5

health_distribution:
  green: 98
  yellow: 23
  red: 6

velocity_trends:
  avg_story_points_per_sprint: 24.7
  avg_lead_time_days: 5.2
  avg_cycle_time_days: 3.1
```

## Benefits

1. **Real-Time Visibility**: Live project health across entire portfolio
2. **Predictive Analytics**: Early risk detection and mitigation
3. **Resource Optimization**: Better sprint planning and capacity management
4. **Compliance**: Audit trail for all SDLC gates and decisions
5. **Cross-Project Learning**: Best practices identification and sharing

## Integration Points

- **Command**: `/track-sdlc` - Update project state
- **Dashboard**: IntegrityTests.tsx integration for health visualization
- **External Tools**: Bidirectional sync with Jira/Linear/Notion
- **Automation**: CI/CD pipeline updates tracking state
- **Reporting**: Automated PME dashboard generation

## Success Metrics

- Portfolio health visibility increased by 90%
- Project risk detection time reduced by 70%
- Cross-project resource allocation improved by 40%
- SDLC compliance tracking at 100% accuracy
- Executive reporting automated (weekly → daily)

## Validation

1. All 500 projects have sdlc-tracking.yaml
2. Cross-project analytics dashboard functional
3. External tool synchronization working
4. Historical data preserved during migration
5. Performance acceptable (< 2s dashboard load)

## Related Skills

- `project-classifier` - Auto-classify project types
- `epic-breakdown` - Decompose projects into epics
- `user-stories` - Generate stories with external refs
- `sprint-capacity` - Calculate team capacity
- `advance-gate` - Update gate status in tracking

## Templates

This skill includes self-contained templates:

- `templates/sdlc-tracking.yaml` - Main tracking configuration
- `templates/epic.md` - Epic frontmatter template
- `templates/story.md` - Story frontmatter template
- `templates/task.md` - Task frontmatter template
- `templates/handoff.md` - Handoff document template

---

**Phase 2 Status**: Ready for implementation after Phase 1 critical fixes complete.
