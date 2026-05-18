---
id: task-{project-id}-{nnn}
title: "Technical Task Title"
type: "task"
task_type: "dev" # dev | qa | security | devops | docs
project_id: "{project-id}"
epic: "epic-{project-id}-{nnn}"
story: "us-{project-id}-{nnn}"
priority: "P2"
status: "todo"
owner: "role-name"
estimation: 4
created: "{ISO-date}"

# Task classification
complexity: "Medium" # Low | Medium | High
technical_area: "Backend" # Frontend | Backend | Database | Infrastructure | Testing | Security
skills_required: # Array of required skills
  - "Node.js"
  - "PostgreSQL"
  - "Docker"

# Dependencies
depends_on: [] # Array of task IDs this task depends on
blocks: [] # Array of task IDs this task blocks
prerequisites: # Text description of prerequisites
  - "Development environment setup"
  - "Database schema updated"

# Timeline
planned_start: "{ISO-date}"
planned_completion: "{ISO-date}"
actual_start: null
actual_completion: null
deadline: null # ISO date if hard deadline exists

# Resource allocation
assignment:
  primary_owner: "role-name"
  secondary_owner: null # For pair programming or review
  reviewer: "tech-lead-name"
  estimated_hours: 4
  actual_hours: 0

# External references
external_refs:
  jira: "{PROJECT}-{NNN}"
  linear: "LIN-{NNN}"
  github_issue: null # Will be populated if GitHub issue created
  confluence: null # Link to any related documentation

# Technical details
technical:
  components_affected: # Array of system components
    - "user-service"
    - "authentication-module"
  apis_modified: [] # Array of API endpoints affected
  database_changes: false # true if database changes required
  breaking_changes: false # true if breaking changes introduced
  security_impact: false # true if security review needed

# Quality requirements
quality:
  code_review_required: true
  testing_required: true
  documentation_required: true
  security_review_required: false
  performance_review_required: false

# Progress tracking
progress:
  completion_percentage: 0
  milestones:
    - name: "Analysis complete"
      planned: "{ISO-date}"
      actual: null
    - name: "Implementation complete"
      planned: "{ISO-date}"
      actual: null
    - name: "Testing complete"
      planned: "{ISO-date}"
      actual: null

# Integration with SDLC tracking
sdlc_integration:
  tracking_file: "../../sdlc-tracking.yaml"
  epic_ref: "epic-{project-id}-{nnn}"
  story_ref: "us-{project-id}-{nnn}"
  sync_enabled: true
  last_sync: null

# Change log
change_log:
  - date: "{ISO-date}"
    change: "Task created"
    author: "System"
    version: "1.0.0"
---

# Task: {Task Title}

## Task Description

Clear, concise description of what needs to be accomplished in this task.

### Scope

- **In scope**: What this task includes
- **Out of scope**: What this task explicitly does not include
- **Deliverables**: Specific outputs expected

### Context

Background information about why this task is needed and how it relates to the parent story or epic.

## Technical Approach

### Implementation Strategy

High-level approach for implementing this task.

### Key Components

- **Component 1**: Description and modifications needed
- **Component 2**: Description and modifications needed
- **Component 3**: Description and modifications needed

### Architecture Considerations

- **Existing patterns**: How this fits with current architecture
- **New patterns**: Any new patterns being introduced
- **Impact assessment**: Effects on other system components

## Detailed Requirements

### Functional Requirements

1. **Requirement 1**: Specific functional requirement
2. **Requirement 2**: Specific functional requirement
3. **Requirement 3**: Specific functional requirement

### Non-Functional Requirements

1. **Performance**: Specific performance requirements
2. **Security**: Security considerations and requirements
3. **Reliability**: Reliability and error handling requirements
4. **Maintainability**: Code quality and documentation requirements

### Acceptance Criteria

- [ ] **Criteria 1**: Specific, testable acceptance condition
- [ ] **Criteria 2**: Specific, testable acceptance condition
- [ ] **Criteria 3**: Specific, testable acceptance condition

## Implementation Plan

### Phase 1: Analysis and Design

- [ ] **Analyze requirements**: Detailed analysis of requirements
- [ ] **Design solution**: Technical design and approach
- [ ] **Review design**: Design review with tech lead

### Phase 2: Implementation

- [ ] **Core implementation**: Main functionality implementation
- [ ] **Unit tests**: Write and execute unit tests
- [ ] **Code review**: Submit for peer review

### Phase 3: Integration and Testing

- [ ] **Integration**: Integrate with existing system
- [ ] **Integration tests**: Write and execute integration tests
- [ ] **Documentation**: Update relevant documentation

## Testing Strategy

### Unit Testing

- **Scope**: What will be unit tested
- **Framework**: Testing framework to use
- **Coverage**: Expected coverage percentage

### Integration Testing

- **Scope**: Integration points to test
- **Test environment**: Where integration tests will run
- **Data requirements**: Test data needs

### Manual Testing

- **Test scenarios**: Manual test cases
- **Test environment**: Where manual testing will occur
- **Sign-off**: Who will approve manual testing

## Risk Assessment

### Technical Risks

- **Risk 1**: Description, likelihood, and mitigation
- **Risk 2**: Description, likelihood, and mitigation

### Dependencies

- **Internal dependencies**: Other tasks or components this depends on
- **External dependencies**: Third-party services or APIs
- **Timeline risks**: Factors that could affect delivery timeline

## Definition of Done

### Code Quality

- [ ] **Code complete**: All functionality implemented according to requirements
- [ ] **Code review**: Peer review completed and approved
- [ ] **Unit tests**: All unit tests written and passing
- [ ] **Integration tests**: All integration tests written and passing
- [ ] **Code coverage**: Meets required coverage threshold

### Documentation

- [ ] **Code documentation**: Inline comments and documentation complete
- [ ] **API documentation**: API changes documented (if applicable)
- [ ] **User documentation**: End-user documentation updated (if applicable)
- [ ] **Technical documentation**: Technical design documents updated

### Quality Assurance

- [ ] **Manual testing**: All manual test cases executed and passed
- [ ] **Regression testing**: No regression issues identified
- [ ] **Performance testing**: Performance requirements verified (if applicable)
- [ ] **Security testing**: Security requirements verified (if applicable)

### Deployment

- [ ] **Build success**: Code builds successfully in CI/CD pipeline
- [ ] **Static analysis**: All static analysis checks passed
- [ ] **Deployment**: Successfully deployed to development environment
- [ ] **Smoke tests**: Basic functionality verified in development

## Notes and Comments

### Development Notes

- Implementation decisions and rationale
- Challenges encountered and solutions
- Performance considerations
- Security considerations

### Review Feedback

- Code review comments and resolutions
- Design review feedback and changes
- Testing feedback and fixes

## Related Work

### Related Tasks

- **TASK-{PROJECT}-{NNN}**: Description of relationship
- **TASK-{PROJECT}-{NNN}**: Description of relationship

### Related Stories

- **US-{PROJECT}-{NNN}**: Parent or related user story
- **US-{PROJECT}-{NNN}**: Dependent or blocking user story

### Related Documentation

- [Technical Specification](link-to-tech-spec)
- [API Documentation](link-to-api-docs)
- [Design Document](link-to-design)

## Appendices

### Code Snippets

```javascript
// Example code or pseudo-code
function exampleFunction() {
  // Implementation details
}
```

### Configuration Examples

```yaml
# Example configuration
setting1: value1
setting2: value2
```

### External References

- [External API Documentation](external-link)
- [Framework Documentation](framework-link)
- [Best Practices Guide](best-practices-link)
