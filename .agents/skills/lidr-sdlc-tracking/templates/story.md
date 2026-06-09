---
id: us-{project-id}-{nnn}
title: "As a [role], I want [goal] so that [benefit]"
type: "user_story"
epic: "epic-{project-id}-{nnn}"
project_id: "{project-id}"
priority: "P1"
estimation: 8
status: "ready"
sprint: "Sprint 2026-{nn}"
assignee: "dev-name"
created: "{ISO-date}"

# Story classification
story_type: "Feature" # Feature | Bug | Technical | Chore
complexity: "Medium" # Low | Medium | High
business_value: "High" # Critical | High | Medium | Low

# Development tracking
branch: "feat/{PROJECT}-{NNN}-feature-name"
pr: null # Will be populated when PR is created
commits: 0
test_coverage: 0.0

# External references (ID mapping consistency)
# Illustrative multi-tool catalog — tools resolve via `_shared/lidr/integrations/tool-registry.yaml`;
# the active client binds concrete tracker/docs/VCS in `clients/<CODE>.yaml`. Keep only the bound tools' keys.
external_refs:
  jira: "{PROJECT}-{NNN}"
  linear: "LIN-{NNN}"
  notion: "story-page-id"
  github: null # Will be populated when PR is created

# Workflow state
workflow:
  created: "{ISO-date}"
  started: null
  in_review: null
  completed: null
  deployed: null

# Quality metrics
quality:
  acceptance_criteria_count: 3
  bdd_scenarios: 2
  test_cases_linked: 5
  code_review_approved: false
  qa_sign_off: false

# Dependencies
dependencies:
  depends_on: [] # Array of story IDs this story depends on
  blocks: [] # Array of story IDs this story blocks
  related: [] # Array of related story IDs

# Resource allocation
assignment:
  developer: "dev-name"
  reviewer: "tech-lead-name"
  tester: "qa-name"
  estimated_hours: 8
  actual_hours: 0

# Integration with SDLC tracking
sdlc_integration:
  tracking_file: "../../sdlc-tracking.yaml"
  epic_ref: "epic-{project-id}-{nnn}"
  sync_enabled: true
  last_sync: null

# Change log
change_log:
  - date: "{ISO-date}"
    change: "Story created"
    author: "Product Owner"
    version: "1.0.0"
---

# User Story: {Story Title}

## Story Description

**As a** [specific user role]
**I want** [specific functionality or goal]
**So that** [specific benefit or value]

### Context

Brief background information about why this story is needed and how it fits into the larger epic or feature set.

### User Persona

- **Primary user**: Description of the main user who will benefit
- **Secondary users**: Other users who might interact with this feature
- **User goals**: What the user is trying to achieve

## Acceptance Criteria

### Scenario 1: Happy Path

**Given** I am a [user role] with [specific context]
**When** I [specific action]
**Then** I should [expected result]
**And** [additional expected behavior]

### Scenario 2: Alternative Flow

**Given** I am in [specific state]
**When** I [alternative action]
**Then** I should [alternative expected result]
**And** [system behavior]

### Scenario 3: Error Handling

**Given** I am in [error condition]
**When** I [action that triggers error]
**Then** I should see [error message or behavior]
**And** [system recovery behavior]

## Definition of Ready (DoR) Checklist

- [ ] **Story format**: Follows "As a... I want... So that..." format
- [ ] **Acceptance criteria**: Clear, testable, and complete
- [ ] **Dependencies**: All dependencies identified and resolved
- [ ] **Design**: UI/UX mockups or wireframes available (if applicable)
- [ ] **Technical approach**: High-level implementation approach agreed
- [ ] **Estimation**: Story points or hours estimated by team
- [ ] **Priority**: Priority level assigned by Product Owner

## Definition of Done (DoD) Checklist

### Development

- [ ] **Code complete**: All functionality implemented
- [ ] **Unit tests**: Written and passing (>=80% coverage for new code)
- [ ] **Code review**: Peer review completed and approved
- [ ] **Integration tests**: Written and passing
- [ ] **Documentation**: Code documented (inline comments, README updates)

### Quality Assurance

- [ ] **Test cases**: All test cases executed and passing
- [ ] **Acceptance criteria**: All criteria verified and met
- [ ] **Regression testing**: No new bugs introduced
- [ ] **Cross-browser testing**: Tested in required browsers (if applicable)
- [ ] **Performance testing**: Meets performance requirements

### Deployment

- [ ] **Build**: Builds successfully in CI/CD pipeline
- [ ] **Security scan**: No new security vulnerabilities introduced
- [ ] **Deployment**: Successfully deployed to staging environment
- [ ] **Smoke tests**: Basic functionality verified in staging
- [ ] **Sign-off**: Product Owner acceptance received

## Technical Details

### Implementation Notes

- High-level technical approach
- Key components or services involved
- Database changes required (if any)
- API endpoints affected (if any)

### Architecture Considerations

- Impact on existing architecture
- New dependencies introduced
- Performance implications
- Security considerations

### Testing Strategy

- Unit testing approach
- Integration testing requirements
- E2E testing scenarios
- Performance testing needs

## UI/UX Requirements

### User Interface

- Mockups or wireframes (link to design files)
- User interaction patterns
- Responsive design requirements
- Accessibility requirements (WCAG 2.1 AA)

### User Experience

- User flow diagrams
- Expected user journey
- Error states and messaging
- Success states and feedback

## API Specification

### Endpoints (if applicable)

```
GET /api/v1/endpoint
POST /api/v1/endpoint
PUT /api/v1/endpoint/{id}
DELETE /api/v1/endpoint/{id}
```

### Data Models

```json
{
  "field1": "string",
  "field2": "number",
  "field3": "boolean"
}
```

### Error Responses

- Error codes and messages
- Validation error format
- HTTP status codes

## Test Cases

### Test Case 1: [Test Scenario Name]

**Preconditions**: Setup required before test
**Steps**:

1. Step 1
2. Step 2
3. Step 3

**Expected Result**: What should happen
**Status**: Not Started | In Progress | Passed | Failed

### Test Case 2: [Alternative Scenario]

**Preconditions**: Alternative setup
**Steps**:

1. Alternative step 1
2. Alternative step 2

**Expected Result**: Alternative expected outcome
**Status**: Not Started

## Risk Assessment

### Technical Risks

- **Risk 1**: Description and likelihood
- **Risk 2**: Description and mitigation plan

### Business Risks

- **Risk 1**: Business impact and mitigation
- **Risk 2**: Timeline or resource risk

## Related Work

### Dependencies

- **Dependency 1**: Description and status
- **Dependency 2**: Description and timeline

### Related Stories

- **US-{PROJECT}-{NNN}**: Brief description of relationship
- **US-{PROJECT}-{NNN}**: Brief description of relationship

## Notes and Comments

### Development Notes

- Technical decisions made during implementation
- Challenges encountered and solutions
- Future improvement opportunities

### Review Comments

- Code review feedback and resolutions
- Testing feedback and fixes
- Product Owner feedback and changes

## Appendices

### External Links

- [Design Mockups](design-link)
- [API Documentation](api-docs-link)
- [Related Epic](epic-link)
- Example ({{TRACKING_TOOL}}, e.g. Jira): [Tracking Ticket](tracking-link)
- Example ({{VCS_TOOL}}, e.g. GitHub): [Pull Request](pr-link)

### File Attachments

- Screenshots or diagrams
- Test data files
- Configuration examples
