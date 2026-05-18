---
id: project-structure-template
version: "1.0.0"
last_updated: "2026-03-17"
updated_by: "System: Phase 3 Enhancement"
status: active
type: template
review_cycle: 60
owner_role: "Tech Lead"
---

# Template: Standardized Project Implementation Structure

> **Phase 3 Enhancement**: Portfolio-scale project organization template
> **Scope**: 500+ projects with consistent structure, navigation, and automation
> **Purpose**: Self-organizing project documentation with automated validation

---

## Implementation Folder Structure

### Root Level Organization

```
docs/projects/{project-id}/
├── project-overview.md           # Executive summary, stakeholders, timeline
├── implementation/               # 📁 CORE: All implementation artifacts
│   ├── epics/                   # 📁 Epic definitions and tracking
│   ├── stories/                 # 📁 User story specifications
│   ├── tasks/                   # 📁 Technical tasks and subtasks
│   └── handoffs/                # 📁 Phase transition documentation
│       ├── dev-to-qa/           # Development → QA handoffs
│       ├── qa-to-security/      # QA → Security handoffs
│       └── security-to-devops/  # Security → DevOps handoffs
├── requirements/                 # 📁 Requirements and specifications
│   ├── functional/              # 📁 Functional requirements (RFs)
│   ├── non-functional/          # 📁 Non-functional requirements (NFRs)
│   └── traceability-matrix.md   # RTM: Requirements → Stories → Tests
├── architecture/                 # 📁 Technical architecture
│   ├── decisions/               # 📁 ADRs (Architecture Decision Records)
│   ├── diagrams/                # 📁 System diagrams and flowcharts
│   └── technical-stack.md       # Technology choices and rationale
├── testing/                      # 📁 QA and testing artifacts
│   ├── test-plans/              # 📁 Test strategies and plans
│   ├── test-cases/              # 📁 Detailed test scenarios
│   └── execution-reports/       # 📁 Test results and sign-offs
├── security/                     # 📁 Security and compliance
│   ├── assessments/             # 📁 Security assessments and audits
│   ├── vulnerability-reports/   # 📁 SAST/DAST/Pen test results
│   └── compliance-checks/       # 📁 GDPR, OWASP, ISO compliance
├── deployment/                   # 📁 Deployment and operations
│   ├── change-requests/         # 📁 Formal change requests
│   ├── rollback-plans/          # 📁 Deployment rollback procedures
│   └── runbooks/               # 📁 Operational procedures
└── metrics/                     # 📁 Project health and performance
    ├── sprint-reports/          # 📁 Sprint retrospectives and metrics
    ├── quality-metrics/         # 📁 Code quality, test coverage
    └── performance-reports/     # 📁 Performance testing results
```

---

## File Naming Conventions

### Epic Files

**Location**: `implementation/epics/`
**Format**: `epic-{project-id}-{nnn}-{short-name}.md`
**Example**: `epic-PROJ-001-biometric-authentication.md`

### Story Files

**Location**: `implementation/stories/`
**Format**: `story-{project-id}-{nnn}-{short-name}.md`
**Example**: `story-PROJ-001-user-login-flow.md`

### Task Files

**Location**: `implementation/tasks/`
**Format**: `task-{project-id}-{nnn}-{short-name}.md`
**Example**: `task-PROJ-001-setup-auth-service.md`

### Handoff Files

**Location**: `implementation/handoffs/{phase-transition}/`
**Format**: `handoff-{project-id}-{from}-to-{to}-{sprint}.md`
**Example**: `handoff-PROJ-001-dev-to-qa-sprint-2026-03.md`

---

## Automated Structure Creation

### Command Integration

```bash
# Initialize project structure
/track-sdlc init PROJECT-ID --create-structure

# Create epic with automatic folder placement
/track-sdlc create epic "Biometric Enhancement" --project=PROJECT-ID

# Generate handoff documentation
/track-sdlc handoff dev-to-qa --project=PROJECT-ID --sprint=current
```

### Template Population

When a new project is initialized, the following templates are automatically created:

1. **project-overview.md** - Populated from business case
2. **sdlc-tracking.yaml** - Initialized with project metadata
3. **Folder structure** - Created with README.md files
4. **Initial epic** - Created from project scope
5. **Traceability matrix** - Empty template ready for requirements

---

## Portfolio Navigation Aids

### Project Index Generation

Each project automatically generates:

```markdown
# docs/projects/{project-id}/INDEX.md

## Quick Navigation

- 📊 [Project Overview](project-overview.md)
- 🎯 [SDLC Tracking](sdlc-tracking.yaml)
- 🏗️ [Implementation](implementation/)
- 📋 [Requirements](requirements/)
- 🏛️ [Architecture](architecture/)
- 🧪 [Testing](testing/)
- 🔒 [Security](security/)
- 🚀 [Deployment](deployment/)
- 📈 [Metrics](metrics/)

## Project Health: {HEALTH_STATUS}

- Current Phase: {CURRENT_PHASE}
- Overall Progress: {PROGRESS}%
- Last Updated: {LAST_UPDATED}

## Recent Activity

{RECENT_COMMITS_OR_CHANGES}

## Quick Actions

- [Create Epic](../../../.claude/skills/sdlc-tracking/templates/epic.md)
- [Create Story](../../../.claude/skills/sdlc-tracking/templates/story.md)
- [Generate Handoff](../../../.claude/skills/sdlc-tracking/templates/handoff.md)
```

### Portfolio Dashboard Integration

Projects appear in portfolio dashboard with:

- Health status indicators (🟢 🟡 🔴)
- Phase progression visualization
- Resource allocation tracking
- Risk and blocker indicators
- External tool sync status

---

## Automation and Validation

### Structure Validation Rules

```typescript
interface StructureValidation {
  requiredFolders: string[];
  namingConventions: RegExp[];
  maxDepth: number;
  mandatoryFiles: string[];
}

const validationRules: StructureValidation = {
  requiredFolders: [
    "implementation/epics",
    "implementation/stories",
    "implementation/tasks",
    "implementation/handoffs",
    "requirements/functional",
    "testing/test-plans",
  ],
  namingConventions: [
    /^epic-[A-Z]+-\d+-[\w-]+\.md$/,
    /^story-[A-Z]+-\d+-[\w-]+\.md$/,
    /^task-[A-Z]+-\d+-[\w-]+\.md$/,
  ],
  maxDepth: 4,
  mandatoryFiles: ["project-overview.md", "sdlc-tracking.yaml", "INDEX.md"],
};
```

### Automated Maintenance

- **Weekly structure audit**: Validates folder organization
- **Orphan detection**: Finds files not linked to tracking system
- **Naming compliance**: Ensures consistent file naming
- **Cross-references**: Validates internal links and references
- **Template updates**: Propagates template changes to projects

---

## External Tool Integration

### File Mapping to External Systems

```yaml
# Automatic mapping for sync operations
external_mapping:
  jira:
    epics: "implementation/epics/*.md"
    stories: "implementation/stories/*.md"
    bugs: "implementation/tasks/*bug*.md"

  linear:
    projects: "implementation/epics/*.md"
    issues: "implementation/stories/*.md"

  notion:
    pages: "implementation/**/*.md"
    databases: "requirements/functional/*.md"

  confluence:
    documentation: "architecture/**/*.md"
    procedures: "deployment/runbooks/*.md"
```

### GitHub Integration

```yaml
github_integration:
  branch_naming: "feat/{PROJECT-ID}-{STORY-NUMBER}-{SHORT-NAME}"
  pr_templates: "Link to implementation/stories/{story-file}.md"
  commit_linking: "Auto-link commits to story IDs"
  release_notes: "Generate from implementation/handoffs/"
```

---

## Migration Guide

### Existing Project Migration

```bash
# Migrate existing project to new structure
/track-sdlc migrate PROJECT-ID --from-legacy

# Validation and gap analysis
/track-sdlc validate-structure PROJECT-ID --fix-issues

# Portfolio-wide migration
/track-sdlc migrate-portfolio --batch-size=10 --dry-run
```

### Legacy Structure Mapping

```
# Old Structure → New Structure
docs/PROJECT-ID.md → docs/projects/PROJECT-ID/project-overview.md
epics/epic-*.md → docs/projects/PROJECT-ID/implementation/epics/
stories/story-*.md → docs/projects/PROJECT-ID/implementation/stories/
requirements/RF-*.md → docs/projects/PROJECT-ID/requirements/functional/
```

---

## Quality Gates Integration

### Gate-Specific Structure Requirements

#### Gate 1 (Discovery → Specification)

**Required Files**:

- `project-overview.md` (complete)
- `requirements/functional/` (at least 5 RFs)
- `architecture/technical-stack.md` (draft)

#### Gate 2 (Specification → Planning)

**Required Files**:

- `requirements/traceability-matrix.md` (complete)
- `implementation/epics/` (epic breakdown complete)
- `testing/test-plans/` (test strategy defined)

#### Gate 3 (Planning → Development)

**Required Files**:

- `implementation/stories/` (sprint backlog)
- `implementation/tasks/` (technical decomposition)
- `deployment/change-requests/` (preliminary CR)

#### Gate 4 (Development → QA)

**Required Files**:

- `implementation/handoffs/dev-to-qa/` (dev handoff)
- `testing/test-cases/` (executable test cases)
- `metrics/quality-metrics/` (code quality report)

---

## Templates for Quick Creation

### Epic Template Integration

```markdown
---
# Auto-populated from project context
id: epic-{project-id}-{auto-increment}
project_id: "{project-id}"
created: "{auto-timestamp}"
folder: "implementation/epics/"
---

# Epic: {Title}

[Standard epic template content]
```

### Story Template Integration

```markdown
---
# Auto-populated with epic relationship
id: story-{project-id}-{auto-increment}
epic: "{parent-epic-id}"
project_id: "{project-id}"
folder: "implementation/stories/"
external_refs:
  jira: "{auto-generated-if-sync-enabled}"
---

# Story: {Title}

[Standard story template content]
```

---

## Benefits for 500-Project Portfolio

### Consistency and Findability

- **Uniform navigation**: Every project has same folder structure
- **Predictable locations**: Documents always in expected folders
- **Cross-project learning**: Teams can navigate any project easily
- **Automated discovery**: Tools know where to find specific artifacts

### Automation and Scaling

- **Template propagation**: Updates cascade to all projects
- **Batch operations**: Portfolio-wide operations become feasible
- **Quality assurance**: Automated validation across all projects
- **Reporting aggregation**: Consistent structure enables portfolio metrics

### Tool Integration

- **External sync**: Predictable file locations for API integrations
- **CI/CD automation**: Standardized paths for deployment automation
- **Documentation generation**: Automated docs from consistent structure
- **Search and analytics**: Portfolio-wide search and analysis capabilities

---

## Implementation Roadmap

### Phase 3.1: Structure Definition (Week 1)

- [ ] Finalize folder structure specification
- [ ] Create validation rules and tests
- [ ] Develop migration utilities
- [ ] Test with pilot projects

### Phase 3.2: Template Integration (Week 2)

- [ ] Enhance `/track-sdlc` command with structure creation
- [ ] Integrate templates with folder creation
- [ ] Add automatic INDEX.md generation
- [ ] Implement cross-reference validation

### Phase 3.3: Portfolio Migration (Week 3-4)

- [ ] Migration tool for existing projects
- [ ] Batch migration with validation
- [ ] Portfolio dashboard integration
- [ ] External tool mapping updates

### Phase 3.4: Validation and Refinement (Week 4)

- [ ] Automated structure validation
- [ ] Gate integration testing
- [ ] Performance optimization for 500 projects
- [ ] User training and documentation

---

## Changelog

| Version | Date       | Author                      | Changes                                                      |
| ------- | ---------- | --------------------------- | ------------------------------------------------------------ |
| 1.0.0   | 2026-03-17 | System: Phase 3 Enhancement | Initial standardized project structure for portfolio scaling |
