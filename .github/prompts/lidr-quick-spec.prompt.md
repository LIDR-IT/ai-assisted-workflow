---
description: Especificación ligera para features pequeñas (≤40h)
agent: 'agent'
---

# Command: Quick Spec

> **Pattern**: LIDR SDLC quick-spec adaptation
> **ROI**: 150+ hours/year through 70% automation of lightweight requirements
> **Context**: Small to medium features that don't need full PRD process

```yaml
id: quick-spec
version: "1.0.0"
last_updated: "2026-03-15"
updated_by: "TL: Claude"
status: active
tier: 2
authorized_roles:
  - PO
  - Tech Lead
  - Dev
```

## Purpose

Rapidly generate lightweight requirements specification for small features (≤ 40h effort) without full PRD overhead. Based on LIDR SDLC Methodology's quick specification pattern adapted for biometric/identity domain.

## When to Use

### ✅ Use `/quick-spec` for:
- Feature enhancements (< 40h development effort)
- Bug fixes with functional impact
- API endpoint additions
- UI component modifications
- Integration features
- Technical improvements with user impact

### ❌ Don't use for:
- New products or major features (use full PRD process)
- Architectural changes (use `adr` skill)
- Security-critical features (require full security review)
- Compliance features (need detailed documentation)

## Usage

```bash
/quick-spec [feature-name] [--type=enhancement|bugfix|integration|api] [--effort=hours]
```

### Examples
```bash
/quick-spec user-avatar-upload --type=enhancement --effort=24
/quick-spec biometric-timeout-fix --type=bugfix --effort=8
/quick-spec webhook-notifications --type=integration --effort=32
```

## Command Flow

### Phase 1: Context Gathering (5 minutes)
1. **Load project context** from `rules/project.md`
2. **Identify stakeholders** and affected systems
3. **Estimate complexity** (Simple/Medium/Complex)
4. **Check prerequisites** (dependencies, blockers)

### Phase 2: Rapid Specification (15-20 minutes)
1. **Generate User Story** with acceptance criteria
2. **Create Functional Requirements** (3-8 RFs max)
3. **Define API contract** (if applicable)
4. **Identify test scenarios** (happy path + edge cases)
5. **Risk assessment** (technical/business risks)

### Phase 3: Validation & Output (5-10 minutes)
1. **Validate against DoR** checklist
2. **Generate implementation guidance**
3. **Create Jira-ready output**
4. **Estimate validation** scores

## Templates Used

### Quick Spec Document Template
```markdown
# Quick Spec: {Feature Name}

## Overview
**Feature**: {Brief description}
**Type**: Enhancement/Bugfix/Integration/API
**Effort**: {X} hours
**Priority**: High/Medium/Low
**Sprint Target**: {Sprint number}

## User Story
**As a** {user type}
**I want** {functionality}
**So that** {business value}

### Acceptance Criteria
- [ ] {Criterion 1 with measurable outcome}
- [ ] {Criterion 2 with measurable outcome}
- [ ] {Criterion 3 with measurable outcome}

## Functional Requirements

### RF-QS-01: {Main Function}
**Given** {precondition}
**When** {user action}
**Then** {system response}

**Priority**: Must/Should/Could
**Complexity**: Simple/Medium/Complex

### RF-QS-02: {Validation/Error Handling}
**Given** {error condition}
**When** {user action}
**Then** {error handling}

**Priority**: Must/Should/Could
**Complexity**: Simple/Medium/Complex

## Technical Specification

### API Changes (if applicable)
```json
{
  "endpoint": "POST /api/v1/feature",
  "request": { "field": "type" },
  "response": { "result": "success" }
}
```

### UI Changes (if applicable)
- **Components**: List affected components
- **Wireframes**: Link to designs or describe layout
- **Responsive**: Mobile/tablet considerations

### Database Changes (if applicable)
- **Tables**: New/modified tables
- **Migrations**: Required schema changes

## Test Scenarios

### Happy Path
1. {Step 1 - normal flow}
2. {Step 2 - expected result}

### Edge Cases
1. {Edge case 1 - boundary conditions}
2. {Edge case 2 - error conditions}

### Biometric-Specific Tests (if applicable)
1. **Liveness detection**: Test with various attack vectors
2. **Performance**: Response time under load
3. **Accuracy**: FAR/FRR metrics validation

## Dependencies & Risks

### Dependencies
- [ ] {External system/team dependency}
- [ ] {Technical prerequisite}

### Technical Risks
- **Risk**: {Description}
  **Mitigation**: {Strategy}

### Business Risks
- **Risk**: {Impact on users/business}
  **Mitigation**: {Strategy}

## Implementation Guidance

### Development Approach
1. {Step 1 - implementation order}
2. {Step 2 - key considerations}

### Testing Strategy
- **Unit tests**: {Coverage expectations}
- **Integration tests**: {Key scenarios}
- **Manual testing**: {Verification steps}

## Definition of Done
- [ ] Code review completed by Tech Lead
- [ ] Unit tests written and passing (≥80% coverage)
- [ ] Integration tests covering happy path
- [ ] Security review completed (if handling sensitive data)
- [ ] Performance tested (if applicable)
- [ ] Documentation updated
- [ ] Feature flag implemented (if needed)
- [ ] Stakeholder sign-off

## Regulatory Compliance (if applicable)
- [ ] GDPR Art. 9 compliance (biometric data)
- [ ] PSD2 SCA requirements
- [ ] ISO 30107 PAD testing
- [ ] Accessibility (WCAG 2.1 AA)


*Generated by Quick Spec v1.0 | Validation required by: {PO/Tech Lead}*
```

## Integration with Skills

### Pre-requisite Skills
1. **project-classifier** (if needed to understand project context)
2. **document-discovery** (to find related existing specs)

### Called Skills During Execution
1. **generate-rf** (simplified mode - max 8 RFs)
2. **user-stories** (single story generation)
3. **validate-requirements** (lightweight validation)

### Post-execution Skills
1. **create-test-cases** (from generated RFs)
2. **epic-breakdown** (if feature needs sub-tasks)

## Automation Components

### Auto-generated Sections (70% automation target)
- [ ] **User Story structure** from feature description
- [ ] **Acceptance criteria** from requirements patterns
- [ ] **BDD scenarios** from user story analysis
- [ ] **API contract** from endpoint descriptions
- [ ] **Test scenarios** from RF analysis
- [ ] **DoR validation** from checklist
- [ ] **Effort estimation** from complexity analysis

### Human Validation Required (30%)
- [ ] **Business value** assessment
- [ ] **Priority** determination
- [ ] **Risk mitigation** strategies
- [ ] **Stakeholder approval**
- [ ] **Sprint assignment**

## Output Artifacts

### Primary Output
1. **Quick Spec Document** (`quick-spec-{feature-name}.md`)
   - Ready for Jira ticket creation
   - Contains all RFs in BDD format
   - Includes implementation guidance
   - Has validation checklist

### Secondary Outputs
1. **Jira Epic/Story** template (copy-paste ready)
2. **API documentation** snippet (if applicable)
3. **Test plan** outline
4. **Risk register** entry

## Validation Criteria

### Completeness Score (5-point scale)
- **5.0**: All sections complete, ready for implementation
- **4.0**: Minor gaps, needs brief review
- **3.0**: Some sections incomplete, needs refinement
- **2.0**: Major gaps, significant rework needed
- **1.0**: Incomplete, not ready for use

### Quality Indicators
- ✅ **User story** follows Actor/Action/Value format
- ✅ **Acceptance criteria** are testable and measurable
- ✅ **RFs** follow BDD Given/When/Then format
- ✅ **API contracts** include request/response examples
- ✅ **Test scenarios** cover happy path + edge cases
- ✅ **Dependencies** identified and tracked
- ✅ **Risks** assessed with mitigation plans

## Success Metrics

### Velocity Improvements
- **Time to spec**: 30-45 minutes (vs 4-6 hours full PRD)
- **Dev ready**: Immediate (vs days for full review cycle)
- **Change rate**: < 10% post-implementation changes

### Quality Metrics
- **Defect escape**: < 5% to production
- **Requirement changes**: < 20% during development
- **Stakeholder satisfaction**: ≥ 4.0/5.0

### ROI Calculation
```
Traditional small feature specification: 4-6 hours
Quick spec process: 30-45 minutes
Time saved per feature: 3.5-5.5 hours
Features per year: ~50 small features
Annual savings: 175-275 hours
Conservative ROI: 150+ hours/year
```

## Anti-patterns to Avoid

### ❌ Don't Use Quick Spec For
- Features requiring DPIA (Data Protection Impact Assessment)
- Multi-team coordination features
- Breaking API changes
- Features affecting core biometric algorithms
- Compliance-critical features

### ❌ Common Mistakes
- **Over-specifying**: Keep it lightweight
- **Under-estimating effort**: If > 40h, use full PRD
- **Skipping validation**: Always validate against DoR
- **Missing stakeholders**: Identify all affected parties

## Command Implementation

```typescript
// Pseudo-code for command logic
async function executeQuickSpec(featureName: string, options: QuickSpecOptions) {
  // Phase 1: Context
  const context = await loadProjectContext();
  const complexity = await assessComplexity(featureName, options.effort);

  // Phase 2: Generation
  const userStory = await generateUserStory(featureName, context);
  const requirements = await generateRequirements(userStory, { maxRFs: 8 });
  const apiContract = await generateAPIContract(requirements);
  const testScenarios = await generateTestScenarios(requirements);

  // Phase 3: Validation
  const dorValidation = await validateAgainstDOR(requirements);
  const completeness = await scoreCompleteness(quickSpec);

  // Output
  return {
    quickSpecDocument: formatQuickSpec({
      userStory,
      requirements,
      apiContract,
      testScenarios,
      validation: { dorValidation, completeness }
    }),
    jiraTemplate: generateJiraTemplate(quickSpec),
    implementationGuidance: generateGuidance(complexity)
  };
}
```

## Integration Points

### With Existing Commands
- **Pre**: `/validate-project-docs` to ensure project context is current
- **Post**: `/implement-ticket` can use quick spec as input
- **Chain**: `/quick-spec` → `/create-test-cases` → `/implement-ticket`

### With Skills
- Uses lightweight versions of `generate-rf` and `user-stories`
- Can trigger `validate-requirements` for consistency check
- Integrates with `create-test-cases` for automated test generation

### With Tools
- **Jira**: Direct ticket creation from output
- **Confluence**: Quick spec doc can be published
- **GitHub**: Issues can be created from template


*Command Tier: 2 (Tactical) | Model: Sonnet | Est. Duration: 30-45 minutes*
