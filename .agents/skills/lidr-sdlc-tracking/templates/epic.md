---
id: epic-{project-id}-{nnn}
title: "Epic Title"
type: "epic"
project_id: "{project-id}"
priority: "P1"
status: "planning"
estimation_sp: 50
created: "{ISO-date}"
owner: "Product Owner"

# Epic classification
category: "Feature" # Feature | Enhancement | Bug Fix | Technical | Infrastructure
complexity: "Medium" # Low | Medium | High | Very High
business_impact: "High" # Critical | High | Medium | Low

# Timeline
planned_start: "{ISO-date}"
planned_completion: "{ISO-date}"
actual_start: null
actual_completion: null

# External references (ID mapping consistency)
external_refs:
  jira: "PROJ-{nnn}"
  linear: "LIN-{nnn}"
  notion: "epic-page-id"
  confluence: "page-id"

# Stakeholder information
stakeholders:
  sponsor: "Executive Name"
  product_owner: "PO Name"
  tech_lead: "TL Name"
  qa_lead: "QA Name"

# Success criteria
acceptance_criteria:
  - "Criterion 1 with measurable outcome"
  - "Criterion 2 with specific acceptance test"
  - "Criterion 3 with performance requirement"

# Dependencies
depends_on: [] # Array of epic IDs this epic depends on
blocks: [] # Array of epic IDs this epic blocks

# Risk assessment
risks:
  - description: "Technical risk description"
    probability: 0.3 # 0.0-1.0
    impact: 0.8 # 0.0-1.0
    mitigation: "Mitigation strategy"

# Quality gates
quality_requirements:
  code_coverage: 0.80 # Minimum code coverage required
  security_scan: true # Security scanning required
  performance_test: true # Performance testing required
  documentation: true # Documentation required

# Resource allocation
resources:
  developers: 2
  qa_engineers: 1
  designers: 0
  specialists: [] # Array of specialist roles needed

# Progress tracking
progress:
  stories_total: 0
  stories_completed: 0
  story_points_total: 0
  story_points_completed: 0
  completion_percentage: 0.0

# Metrics and KPIs
metrics:
  planned_velocity: 20 # Story points per sprint
  actual_velocity: 0
  defect_density: 0.0 # Defects per story point
  cycle_time_days: 0.0 # Average time from start to completion

# Change log
change_log:
  - date: "{ISO-date}"
    change: "Epic created"
    author: "System"
    version: "1.0.0"

# Integration with SDLC tracking
sdlc_integration:
  tracking_file: "../../sdlc-tracking.yaml"
  sync_enabled: true
  last_sync: null
---

# Epic: {Epic Title}

## Executive Summary

Brief description of what this epic delivers and why it's important to the business.

## Business Context

### Problem Statement

Clear description of the problem this epic solves.

### Business Value

- **Primary benefit**: Quantifiable business impact
- **Secondary benefits**: Additional value delivered
- **Success metrics**: How we measure success

### User Impact

Description of how end users will benefit from this epic.

## Technical Overview

### Architecture Impact

High-level description of architectural changes or additions.

### Integration Points

- **External systems**: Systems this epic integrates with
- **Internal dependencies**: Other epics or systems this depends on
- **APIs**: New or modified API endpoints

### Technical Risks

- **Risk 1**: Description and mitigation strategy
- **Risk 2**: Description and mitigation strategy

## Implementation Approach

### Phase 1: Foundation

- Core functionality implementation
- Basic user flows
- Essential integrations

### Phase 2: Enhancement

- Advanced features
- Performance optimization
- Extended functionality

### Phase 3: Polish

- UI/UX improvements
- Documentation completion
- Final testing and validation

## User Stories Breakdown

### Core Stories

- **US-{PROJECT}-001**: Core functionality story
- **US-{PROJECT}-002**: Essential integration story
- **US-{PROJECT}-003**: Basic user experience story

### Enhancement Stories

- **US-{PROJECT}-004**: Advanced feature story
- **US-{PROJECT}-005**: Performance optimization story

### Polish Stories

- **US-{PROJECT}-006**: UI improvements story
- **US-{PROJECT}-007**: Documentation story

## Acceptance Criteria

### Functional Requirements

1. **Criterion 1**: Specific, measurable acceptance condition
2. **Criterion 2**: Specific, measurable acceptance condition
3. **Criterion 3**: Specific, measurable acceptance condition

### Non-Functional Requirements

1. **Performance**: System must handle X requests/second
2. **Security**: Must pass security scan with zero high/critical issues
3. **Usability**: Task completion time < X seconds

### Quality Gates

- [ ] All user stories completed and tested
- [ ] Code coverage >= 80%
- [ ] Security scan passed
- [ ] Performance requirements met
- [ ] Documentation updated
- [ ] Stakeholder sign-off received

## Testing Strategy

### Test Scope

- **Unit testing**: Component-level testing approach
- **Integration testing**: System integration validation
- **E2E testing**: End-to-end user journey testing
- **Performance testing**: Load and stress testing plan

### Test Environment

- **Development**: Local testing environment
- **Staging**: Pre-production validation environment
- **Production**: Live system testing approach

## Release Plan

### Release Criteria

- All acceptance criteria met
- Quality gates passed
- Stakeholder approval received
- Documentation completed

### Release Timeline

- **Beta release**: Target date and scope
- **Production release**: Target date and rollout plan
- **Post-release monitoring**: Success metrics tracking

## Success Metrics

### Business Metrics

- **Metric 1**: Target value and measurement method
- **Metric 2**: Target value and measurement method

### Technical Metrics

- **Performance**: Response time, throughput targets
- **Quality**: Defect density, reliability metrics
- **User adoption**: Usage statistics and engagement

## Appendices

### Related Documentation

- [PRD Document](link-to-prd)
- [Technical Specification](link-to-tech-spec)
- [API Documentation](link-to-api-docs)

### External References

- [Jira Epic](jira-link)
- [Linear Project](linear-link)
- [Notion Page](notion-link)
