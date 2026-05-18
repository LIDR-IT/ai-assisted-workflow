---
name: lidr-automated-handoffs
id: automated-handoffs
version: "1.0.0"
last_updated: "2026-03-17"
updated_by: "System: Phase 5 Enhancement"
status: active
phase: 0
owner_role: "TL"
automation: false
domain_agnostic: true
description: >
  Automatically generate phase transition handoffs (Dev→QA, QA→Security, Security→DevOps).
  ALWAYS use when advancing gates to ensure zero information loss between phases.
---

# SKILL: Automated Handoff Generation

> **Phase 5 Enhancement**: Automated creation of phase transition handoffs
> **Scope**: Dev→QA, QA→Security, Security→DevOps handoff generation
> **Trigger**: PR merge, gate advancement, manual invocation

---

## Purpose

This skill automates the creation of comprehensive handoff documentation between development phases. It eliminates manual handoff creation, ensures consistent information transfer, and maintains traceability throughout the SDLC process.

### When to Use

- **PR Merge Trigger**: Automatically create Dev→QA handoff on PR merge
- **Gate Advancement**: Generate handoffs when advancing through quality gates
- **Manual Generation**: Create handoffs for specific stories or epics
- **Portfolio Reporting**: Generate handoff summaries across projects

---

## Handoff Types

### Dev to QA Handoff

**Trigger**: PR merged to develop branch
**Content**:

- Implementation summary with business context
- Test coverage analysis and test execution guide
- Known issues and limitations
- Environment setup and data requirements
- Acceptance criteria mapping to test scenarios

### QA to Security Handoff

**Trigger**: QA sign-off completed
**Content**:

- QA test results and coverage report
- Security test requirements and focus areas
- Vulnerability assessment checklist
- Compliance verification requirements
- Performance and load testing results

### Security to DevOps Handoff

**Trigger**: Security review completed
**Content**:

- Security assessment results
- Deployment requirements and constraints
- Monitoring and alerting requirements
- Rollback procedures and emergency contacts
- Infrastructure and configuration changes

---

## Core Operations

### 1. Automated Handoff Generation

**Input**: PR context, story context, project context
**Output**: Comprehensive handoff document in standardized format

```typescript
interface HandoffGenerationRequest {
  projectId: string;
  storyId: string;
  prNumber?: number;
  handoffType: "dev-to-qa" | "qa-to-security" | "security-to-devops";
  triggerEvent: "pr-merge" | "gate-advance" | "manual";
  context: {
    story: StoryContext;
    epic: EpicContext;
    project: ProjectContext;
    implementation: ImplementationContext;
    testing: TestingContext;
    security: SecurityContext;
  };
}
```

**Process Flow**:

1. Load story and project context from SDLC tracking
2. Analyze PR changes and implementation details
3. Generate context-aware handoff content
4. Create handoff document in project structure
5. Update external tools with handoff links
6. Notify receiving team

### 2. Context-Aware Content Generation

**Story Context Integration**:

```typescript
const generateHandoffContent = (context: HandoffContext) => {
  const {
    businessContext: extractBusinessValue(context.story, context.epic),
    technicalSummary: analyzeImplementation(context.pr, context.story),
    testingGuidance: generateTestingStrategy(context.story.acceptanceCriteria),
    securityAssessment: evaluateSecurityImplications(context.changes),
    deploymentNotes: generateDeploymentGuidance(context.changes)
  };

  return formatHandoffDocument(handoffData, context.handoffType);
};
```

**Template Selection**:

- Load handoff template based on type and project context
- Populate with story-specific information
- Include cross-references to related documentation
- Generate actionable test scenarios and checklists

### 3. Multi-Tool Integration

**External Tool Updates**:

```typescript
const updateExternalTools = async (handoff: HandoffDocument) => {
  // Update Jira ticket with handoff link
  await updateJiraTicket(handoff.storyId, {
    comment: `Handoff generated: ${handoff.documentPath}`,
    transition: handoff.type === "dev-to-qa" ? "Ready for QA" : "In Progress",
  });

  // Update Linear issue
  await updateLinearIssue(handoff.linearId, {
    description: addHandoffReference(handoff.documentPath),
    state: mapHandoffToLinearState(handoff.type),
  });

  // Update Notion page
  await updateNotionPage(handoff.notionId, {
    properties: {
      "Handoff Status": handoff.type,
      "Handoff Document": handoff.documentPath,
      Updated: new Date().toISOString(),
    },
  });
};
```

---

## Handoff Document Structure

### Dev to QA Handoff Template

````markdown
---
id: handoff-{project-id}-dev-to-qa-{story-id}-{date}
type: dev-to-qa
project_id: { project-id }
story_id: { story-id }
epic_id: { epic-id }
generated: { ISO-timestamp }
pr_number: { pr-number }
---

# Dev to QA Handoff: {Story Title}

## Executive Summary

**Story**: {story.title}
**Epic**: {epic.title}
**Business Value**: {story.business_value}
**Implementation Date**: {completion-date}
**Developer**: {assignee}
**Estimated QA Effort**: {estimated-qa-hours}

## What Was Implemented

### Business Functionality

{2-3 sentences describing what the user can now do, written in business language}

### Technical Implementation

#### Components Modified

| Component | Type of Change | Impact Level | Notes |
| --------- | -------------- | ------------ | ----- |

{for each significant component change}

#### Database Changes

{database schema changes, migrations, data impacts}

#### API Changes

| Endpoint | Change Type | Breaking? | Documentation |
| -------- | ----------- | --------- | ------------- |

{for each API modification}

#### Dependencies and Configuration

- **New Dependencies**: {list of new libraries/services}
- **Configuration Changes**: {environment variables, feature flags}
- **Infrastructure**: {any infrastructure modifications}

## Quality Assurance Information

### Test Coverage Analysis

- **Unit Test Coverage**: {coverage-percentage}% ({new-tests} new tests)
- **Integration Test Coverage**: {integration-coverage}%
- **End-to-End Tests**: {e2e-test-count} scenarios
- **Uncovered Areas**: {areas-needing-manual-testing}

### Automated Test Execution

```bash
# Run all tests for this story
npm test -- --testNamePattern="{story-pattern}"

# Run integration tests
npm run test:integration -- --grep "{story-features}"

# Run specific test suites
{test-execution-commands}
```
````

### Code Quality Metrics

- **Linting**: ✅ All issues resolved
- **Type Coverage**: {type-coverage}%
- **Security Scan**: ✅ No high/critical vulnerabilities
- **Performance Impact**: {performance-analysis}

## Testing Strategy and Scenarios

### Acceptance Criteria Mapping

{for each acceptance criterion}
**AC{n}**: {acceptance-criterion}

- **Test Approach**: {manual|automated|hybrid}
- **Test Data Required**: {specific-test-data}
- **Expected Outcome**: {detailed-expected-result}
- **Success Criteria**: {measurable-success-conditions}

### Environment Setup

#### Prerequisites

1. **Database State**: {required-database-setup}
2. **Test Data**: {test-data-requirements}
3. **Service Dependencies**: {external-services-needed}
4. **Feature Flags**: {feature-flag-configuration}

#### Test Environment Configuration

```yaml
# Test environment setup
environment:
  database: { test-database-config }
  services: { dependent-services }
  feature_flags: { required-flags }
  test_users: { test-user-accounts }
```

### Critical Test Paths

#### Happy Path Testing

1. **Primary User Flow**:
   {step-by-step-primary-flow}

2. **Secondary Flows**:
   {alternative-user-flows}

#### Edge Case Testing

1. **Boundary Conditions**:
   {boundary-test-scenarios}

2. **Error Conditions**:
   {error-handling-test-scenarios}

3. **Performance Testing**:
   {performance-test-requirements}

### Security Testing Focus

#### Authentication and Authorization

- {auth-test-scenarios}

#### Input Validation

- {input-validation-tests}

#### Data Protection

- {data-privacy-test-scenarios}

## Known Issues and Limitations

### Known Issues

{for each known issue}
**Issue**: {issue-description}

- **Impact**: {user-impact}
- **Workaround**: {temporary-workaround}
- **Resolution Plan**: {planned-fix}
- **Timeline**: {expected-fix-date}

### Technical Limitations

- {limitation-1-description}
- {limitation-2-description}

### Out of Scope

- {explicitly-out-of-scope-functionality}

## Deployment and Environment Notes

### Deployment Requirements

- **Database Migrations**: {migration-requirements}
- **Configuration Changes**: {config-updates-needed}
- **Service Restarts**: {services-requiring-restart}
- **Cache Invalidation**: {cache-clearing-requirements}

### Environment-Specific Considerations

#### Development

{dev-environment-specific-notes}

#### Staging

{staging-environment-specific-notes}

#### Production

{production-deployment-considerations}

### Monitoring and Observability

#### Key Metrics to Monitor

- {metric-1}: {expected-values}
- {metric-2}: {expected-values}

#### Log Patterns to Watch

```
{relevant-log-patterns}
```

#### Dashboard Updates

- {dashboard-modifications}

## Rollback Plan

### Rollback Criteria

{conditions-that-trigger-rollback}

### Rollback Procedure

1. {rollback-step-1}
2. {rollback-step-2}
3. {rollback-verification}

### Recovery Time Estimate

**Estimated Rollback Time**: {rollback-duration}
**Data Recovery Impact**: {data-implications}

## Risk Assessment

### Technical Risks

| Risk | Probability | Impact | Mitigation |
| ---- | ----------- | ------ | ---------- |

{for each identified risk}

### Business Risks

- {business-risk-1}
- {business-risk-2}

## Documentation and References

### Updated Documentation

- [ ] API documentation updated
- [ ] User guides updated
- [ ] Technical documentation updated
- [ ] Runbooks updated

### Related Documents

- **Story Document**: {link-to-story-file}
- **Epic Document**: {link-to-epic-file}
- **PR**: {link-to-merged-pr}
- **Requirements**: {links-to-related-rfs}
- **Test Plans**: {links-to-test-plans}

## QA Team Action Items

### Pre-Testing Setup

- [ ] Review handoff document
- [ ] Set up test environment
- [ ] Prepare test data
- [ ] Configure monitoring

### Testing Execution

- [ ] Execute acceptance criteria tests
- [ ] Perform exploratory testing
- [ ] Security testing
- [ ] Performance testing
- [ ] Cross-browser/device testing
- [ ] Accessibility testing

### Sign-off Requirements

- [ ] All acceptance criteria verified
- [ ] No blocking bugs identified
- [ ] Performance acceptable
- [ ] Security requirements met
- [ ] Documentation verified

## Developer Support

### Availability for Questions

**Primary Contact**: {developer-name} ({contact-info})
**Backup Contact**: {tech-lead-name} ({contact-info})
**Availability**: {support-hours}

### Common Questions and Answers

{anticipated-qa-questions-and-answers}

## Appendices

### A. Test Data Samples

{sample-test-data}

### B. Configuration Examples

{configuration-file-examples}

### C. Troubleshooting Guide

{common-issues-and-solutions}

````

---

## Automation Triggers

### GitHub Actions Integration
```yaml
name: Auto-Generate Handoff
on:
  pull_request:
    types: [closed]
    branches: [develop]

jobs:
  generate-handoff:
    if: github.event.pull_request.merged == true
    runs-on: ubuntu-latest
    steps:
      - name: Extract ticket ID
        run: echo "TICKET_ID=$(echo '${{ github.event.pull_request.title }}' | grep -oE '[A-Z]+-[0-9]+')" >> $GITHUB_ENV

      - name: Generate handoff
        run: |
          claude-cli skill automated-handoffs \
            --project-id=${{ env.PROJECT_ID }} \
            --ticket-id=${{ env.TICKET_ID }} \
            --pr-number=${{ github.event.pull_request.number }} \
            --handoff-type=dev-to-qa
````

### Hook Integration

```typescript
// dtc-write-guard hook enhancement
export const generateHandoffOnMerge = async (context: HookContext) => {
  if (context.event === "pr-merged" && context.branch === "develop") {
    const ticketId = extractTicketId(context.prTitle);
    if (ticketId) {
      await invokeSkill("automated-handoffs", {
        ticketId,
        prNumber: context.prNumber,
        handoffType: "dev-to-qa",
      });
    }
  }
};
```

---

## Quality and Validation

### Handoff Quality Metrics

```typescript
interface HandoffQuality {
  completeness: number; // 0-1 score
  accuracy: number; // validation against story
  timeliness: number; // generation speed
  usability: number; // QA team feedback
}

const validateHandoff = (handoff: HandoffDocument): HandoffQuality => {
  return {
    completeness: checkRequiredSections(handoff),
    accuracy: validateAgainstStory(handoff),
    timeliness: measureGenerationTime(handoff),
    usability: getTeamFeedback(handoff),
  };
};
```

### Continuous Improvement

- **Feedback Loop**: Collect QA team feedback on handoff quality
- **Template Refinement**: Improve templates based on usage patterns
- **Automation Enhancement**: Reduce manual intervention requirements
- **Metrics Tracking**: Monitor handoff effectiveness and team satisfaction

---

## Portfolio Integration

### Cross-Project Learning

```typescript
const improveHandoffTemplates = (portfolioFeedback: FeedbackData[]) => {
  const patterns = analyzeSuccessfulHandoffs(portfolioFeedback);
  const improvements = identifyImprovementOpportunities(portfolioFeedback);

  return updateTemplatesWithBestPractices(patterns, improvements);
};
```

### Scaling Features

- **Batch Handoff Generation**: Generate handoffs for multiple stories
- **Portfolio Dashboards**: Track handoff status across all projects
- **Team Workload Balancing**: Distribute QA workload based on handoff complexity
- **Quality Trend Analysis**: Monitor handoff quality trends across portfolio

---

## Security and Compliance

### Data Privacy

- **PII Redaction**: Remove sensitive data from handoff documents
- **Access Control**: Limit handoff access to relevant team members
- **Audit Trail**: Track handoff generation and access
- **Retention Policy**: Manage handoff document lifecycle

### Compliance Integration

- **Regulatory Requirements**: Include compliance checkpoints in handoffs
- **Audit Support**: Generate audit-friendly documentation
- **Traceability**: Maintain complete handoff chain for compliance
- **Risk Assessment**: Include risk evaluation in each handoff

---

## Changelog

| Version | Date       | Author                      | Changes                                     |
| ------- | ---------- | --------------------------- | ------------------------------------------- |
| 1.0.0   | 2026-03-17 | System: Phase 5 Enhancement | Initial automated handoff generation system |
