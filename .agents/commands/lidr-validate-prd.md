---
id: validate-prd
version: "1.0.0"
last_updated: "2026-03-15"
updated_by: "Tech Lead: System"
status: active
description: Comprehensive PRD quality validation framework with automated quality gates and actionable recommendations
argument-hint: [project-name] [prd-type]
allowed-tools: Read, Write, Bash(git:*), mcp__jira, mcp__confluence, AskUserQuestion
model: sonnet
tier: 1
authorized_roles:
  - Product Owner
  - Tech Lead
  - QA Lead
  - PME
automation_target: 85%
roi_annual: 180
type: orchestrator
owner_role: "Product Owner"
---

<!--
COMMAND: validate-prd
VERSION: 1.0.0
AUTHOR: SDLC Team
LAST UPDATED: 2026-03-15

PURPOSE:
Implements LIDR SDLC Methodology comprehensive PRD validation framework with automated
quality gates, scoring, and actionable recommendations. Orchestrates validation
of PRD completeness, coherence, testability, and readiness for Gate 1 approval.

USAGE:
  /validate-prd my-project               # Validates both PRDs
  /validate-prd my-project funcional     # Validates only PRD-F
  /validate-prd my-project tecnico       # Validates only PRD-T

ARGUMENTS:
  project-name: Name of the project (matches docs/projects/{name}/)
  prd-type: Optional filter - "funcional", "tecnico", or both (default)

REQUIREMENTS:
  - Business Case approved (from Phase 1)
  - PRD drafts exist (functional and/or technical)
  - Stakeholder map and kickoff completed

RELATED COMMANDS:
  /advance-gate 0   - Must have passed before PRD creation
  /advance-gate 1   - Run after this command to evaluate Gate 1
  /validate-requirements - Next command after Gate 1 approval

RELATED SKILLS:
  bmad-prd              - Unified PRD generation (functional + technical sections)
  review-cruzado        - Gate 1 enforcer: validates F+T sections completeness on bmad-prd output
  business-case         - Context for PRD validation

ROI METRICS:
  Manual PRD review: 4-6 hours
  Automated validation: 45 minutes (85% automation)
  Annual savings: 180+ hours/year
  Quality improvement: 95% gate pass rate target

CHANGELOG:
  v1.0.0 (2026-03-15): Initial LIDR SDLC Methodology validation framework
-->

# Validate PRD Quality for $1

Load: @../rules/org.md and @../rules/project.md and @../rules/documentation.md

> **Relationship to BMad (de-duplication):** Base PRD structural and quality validation is owned by **`bmad-prd` (validate intent)** — invoke it first and consume its findings. Do **not** re-implement generic PRD completeness/consistency checks here. This command is the **LIDR governance layer on top**: it adds the scored Gate-1 readiness verdict, RACI/role gating, traceability to Business Case, and the `lidr-review-cruzado` F+T cross-check. (Note: the standalone `bmad-validate-prd` skill is deprecated and folds into `bmad-prd` validate in v7 — target `bmad-prd`, not the deprecated alias.)

## Validate Preconditions

If "$1" is empty:
❌ Project name required. Usage: /validate-prd [project-name] [prd-type]
Exit.

Set prd_type = "$2" or "both" if empty

Check for project context:

- Look for `docs/projects/$1/` directory or project documentation
- Verify business case exists and is approved

If project not found:
⚠️ Project "$1" not found in project registry.

Use AskUserQuestion:

- question: "Proyecto no encontrado. ¿Continuar con validación independiente?"
- header: "Contexto de Proyecto"
- options:
  - Sí, validar PRDs sin contexto de proyecto
  - No, necesito configurar el proyecto primero
  - Usar contexto de otro proyecto similar

## Phase 1: LIDR SDLC Methodology 13-Step Validation Framework

### Discovery & Context Analysis (Steps 1-3)

#### Step 1: Project Discovery

Using project context from `bmad-document-project`:

1. **Domain Context Analysis**:
   - Load business case for domain understanding
   - Identify industry vertical (banking, government, healthcare, fintech)
   - Classify domain-specific complexity level (facial-only, multi-modal, behavioral)
   - Map regulatory requirements (GDPR, PSD2, eIDAS, local compliance)

2. **Project Classification**:
   - Project type: Web app, mobile app, SDK, platform integration
   - Technical complexity: Low, Medium, High, Very High
   - Team maturity: Junior, Mixed, Senior, Expert
   - Timeline pressure: Standard, Accelerated, Critical

Output: Context score (0-100%), domain classification, complexity assessment

#### Step 2: Format Detection & Template Compliance

Load: bmad-prd output document (unified F+T sections)

1. **Structural Validation**:
   - Verify frontmatter YAML presence and completeness
   - Check required section presence and hierarchy
   - Validate cross-references and internal linking
   - Assess CommonMark compliance (LIDR SDLC Rule 1)

2. **{{CLIENT_NAME}} PRD Standards**:
   - PRD-F: Executive Summary, Personas, Journeys, Features, Success Metrics
   - PRD-T: Architecture, NFRs, Data Model, Security, Risk Analysis
   - Cross-references between PRDs for alignment

Output: Template compliance score (0-100%), missing sections list

#### Step 3: Information Density & Anti-Fluff Analysis

1. **Content Quality Assessment**:
   - Meaningful content vs filler ratio analysis
   - Technical precision in domain-specific domain terms
   - Specific vs generic requirement statements
   - Quantified vs qualitative assertions

2. **LIDR Anti-Fluff Detection**:
   - Remove marketing language and buzzwords
   - Flag vague terms without measurable criteria
   - Detect copy-paste boilerplate sections
   - Ensure task-oriented language (LIDR SDLC Principle)

Output: Information density score (0-100%), fluff detection report

### Requirements Analysis (Steps 4-7)

#### Step 4: Scope Coverage & Alignment

Load: @../skills/business-case/SKILL.md for reference

1. **Business Case Alignment**:
   - Verify all business objectives mapped to PRD features
   - Check scope boundaries match business case constraints
   - Validate success metrics align with business KPIs
   - Detect scope creep or missing critical features

2. **Stakeholder Requirements Coverage**:
   - Cross-reference with stakeholder map requirements
   - Ensure regulatory compliance requirements addressed
   - Validate user persona needs fully covered

Output: Coverage score (0-100%), scope gaps analysis

#### Step 5: Measurability & Testability

Load: skills/generate-rf/checklists/rf-coherence.md

1. **Acceptance Criteria Analysis**:
   - Every feature has measurable success criteria
   - BDD-ready scenarios identifiable
   - Performance criteria quantified (latency, accuracy, throughput)
   - Error handling scenarios specified

2. **domain-specific-Specific Measurability**:
   - FAR/FRR thresholds specified where applicable
   - Liveness detection accuracy requirements
   - Response time requirements for domain-specific operations
   - User experience metrics (completion rates, attempts)

Output: Measurability score (0-100%), untestable requirements list

#### Step 6: Traceability & Cross-References

1. **Internal Traceability**:
   - Business objectives → Features → Requirements
   - Personas → User journeys → Feature requirements
   - Risk items → Mitigation requirements
   - Compliance needs → Security requirements

2. **External Traceability**:
   - Business case references
   - Stakeholder input references
   - Regulatory requirement sources
   - Technical constraint origins

Output: Traceability matrix completeness (0-100%), orphan requirements

#### Step 7: Implementation Independence

1. **Technology Abstraction Level**:
   - Functional requirements free of implementation details
   - UI/UX requirements separated from technical implementation
   - Business rules independent of system architecture
   - Integration requirements vs specific technology choices

2. **domain-specific Implementation Independence**:
   - Algorithm-agnostic accuracy requirements
   - Platform-independent user experience definitions
   - Security requirements without specific encryption methods
   - Compliance requirements without technology assumptions

Output: Abstraction score (0-100%), implementation leakage detection

### Compliance & Quality Assessment (Steps 8-11)

#### Step 8: Domain Compliance Validation

Load: @../rules/org.md for regulatory context

1. **domain-specific Industry Compliance**:
   - GDPR Art. 9 domain-specific data requirements
   - ISO 30107 presentation attack detection standards
   - Industry-specific regulations (banking, government)
   - Privacy by Design principles implementation

2. **Regulatory Pattern Detection**:
   - User consent mechanisms specified
   - Data retention and deletion procedures
   - Audit trail requirements
   - Cross-border data transfer compliance

Output: Compliance score (0-100%), missing regulatory requirements

#### Step 9: Project Type Infrastructure Alignment

1. **Technical Architecture Compatibility**:
   - PRD-T infrastructure matches project complexity
   - Scalability requirements align with user volume projections
   - Security architecture matches data sensitivity level
   - Integration capabilities match ecosystem requirements

2. **domain-specific Platform Requirements**:
   - SDK integration complexity assessment
   - Cloud vs on-premise deployment requirements
   - Real-time vs batch processing needs
   - Mobile vs web platform considerations

Output: Infrastructure alignment score (0-100%), architecture gaps

#### Step 10: Success Criteria & SMART Validation

1. **SMART Criteria Assessment**:
   - Specific: Clear, unambiguous requirements
   - Measurable: Quantifiable success metrics
   - Achievable: Realistic within constraints
   - Relevant: Aligned with business objectives
   - Time-bound: Clear delivery expectations

2. **domain-specific Success Metrics**:
   - Accuracy metrics (FAR, FRR, EER) specified
   - Performance metrics (latency, throughput) quantified
   - User experience metrics (completion rates) defined
   - Business impact metrics (conversion, satisfaction) included

Output: SMART compliance score (0-100%), vague criteria identification

#### Step 11: Internal Consistency & Contradiction Detection

1. **Cross-PRD Consistency**:
   - PRD-F user journey aligns with PRD-T architecture
   - Performance expectations match technical capabilities
   - Security requirements consistent between functional and technical
   - Data flow consistency between user experience and system design

2. **Enhanced Contradiction Detection**:
   - Conflicting technical requirements
   - Incompatible user experience expectations
   - Contradictory compliance requirements
   - Circular dependency identification

Output: Consistency score (0-100%), contradiction report

### Final Assessment (Steps 12-13)

#### Step 12: Completeness & Gap Analysis

1. **Comprehensive Gap Detection**:
   - Aggregate findings from all 11 validation steps
   - Cross-reference with {{CLIENT_NAME}} PRD checklist
   - Identify critical vs nice-to-have gaps
   - Prioritize gaps by impact on Gate 1 passage

2. **Readiness Assessment**:
   - Gate 1 blocking issues identification
   - Conditional approval criteria assessment
   - Risk assessment for proceeding with gaps
   - Effort estimation for gap remediation

Output: Completeness matrix, prioritized gap list, remediation effort

#### Step 13: Quantitative Scoring & Recommendations

1. **Weighted Scoring Algorithm**:

   ```
   Discovery (Steps 1-3): 15% weight
   Requirements (Steps 4-7): 40% weight (highest priority)
   Compliance (Steps 8-11): 30% weight
   Assessment (Steps 12): 15% weight
   ```

2. **Status Determination**:
   - PASS (85-100%): Ready for Gate 1, all critical criteria met
   - CONDITIONAL (70-84%): Gate 1 possible with documented risks
   - FAIL (0-69%): Gate 1 blocked, critical issues must be resolved

Output: Overall score (0-100%), status determination, action plan

## Phase 2: Cross-PRD Alignment Validation

If both PRD-F and PRD-T exist, execute cross-review using skill `review-cruzado`:

Use AskUserQuestion:

- question: "PRDs individuales validados. ¿Ejecutar validación cruzada PRD-F ↔ PRD-T?"
- header: "Cross-Review"
- options:
  - Sí, ejecutar cross-review ahora
  - No, saltear validación cruzada
  - Sí, pero mostrar resultados individuales primero

If yes, execute cross-review validation:

1. Load both PRDs for alignment analysis
2. Execute domain-specific-specific cross-validation
3. Check for contradictions and gaps between PRDs
4. Generate alignment matrix and findings report

## Gate 1 Readiness Assessment

Evaluate Gate 1 criteria using enhanced validation results:

| Criterion                         | Weight | Score    | Status   |
| --------------------------------- | ------ | -------- | -------- |
| **Format & Template Compliance**  | 10%    | {score}% | ✅/⚠️/❌ |
| **Content Quality & Density**     | 15%    | {score}% | ✅/⚠️/❌ |
| **Scope Coverage & Traceability** | 25%    | {score}% | ✅/⚠️/❌ |
| **Measurability & Testability**   | 20%    | {score}% | ✅/⚠️/❌ |
| **Domain Compliance**             | 15%    | {score}% | ✅/⚠️/❌ |
| **Internal Consistency**          | 10%    | {score}% | ✅/⚠️/❌ |
| **Cross-PRD Alignment**           | 5%     | {score}% | ✅/⚠️/❌ |

**Overall Gate 1 Score**: {weighted_score}%
**Status**: PASS / CONDITIONAL / FAIL

## Enhanced Report Generation

```markdown
# PRD Validation Report — $1

**Date**: {today}
**PRD Type**: {prd_type}
**Validation Engine**: {{CLIENT_NAME}} SDLC LIDR SDLC Enhanced v1.0
**Overall Score**: {overall_score}%
**Gate 1 Status**: {PASS/CONDITIONAL/FAIL}

## Executive Summary

### Quality Assessment

- **Validation Steps Completed**: 13/13
- **Pass Rate**: {pass_count}/{total_count} steps
- **Critical Issues**: {critical_count}
- **High Priority Issues**: {high_count}
- **Medium Priority Issues**: {medium_count}

### Domain Context

- **Project Type**: {project_type}
- **Domain**: {domain}
- **Complexity**: {complexity_level}
- **Regulatory Scope**: {compliance_requirements}

## Detailed Validation Results

### 🔴 Critical Issues (Gate Blocking)

[List of critical issues that prevent Gate 1 passage]

| Issue ID | Description | Impact | Owner | Deadline |
| -------- | ----------- | ------ | ----- | -------- |

### ⚠️ High Priority Issues

[Issues that should be resolved for optimal quality]

| Issue ID | Description | Recommendation | Owner | Deadline |
| -------- | ----------- | -------------- | ----- | -------- |

### 🟡 Medium Priority Issues

[Nice-to-have improvements]

| Issue ID | Description | Suggestion | Owner | Timeline |
| -------- | ----------- | ---------- | ----- | -------- |

## LIDR SDLC 13-Step Validation Breakdown

### Discovery & Context (Steps 1-3)

| Step                   | Score    | Status   | Key Findings |
| ---------------------- | -------- | -------- | ------------ |
| 1. Project Discovery   | {score}% | {status} | {findings}   |
| 2. Format Detection    | {score}% | {status} | {findings}   |
| 3. Information Density | {score}% | {status} | {findings}   |

### Requirements Analysis (Steps 4-7)

| Step                           | Score    | Status   | Key Findings |
| ------------------------------ | -------- | -------- | ------------ |
| 4. Scope Coverage              | {score}% | {status} | {findings}   |
| 5. Measurability               | {score}% | {status} | {findings}   |
| 6. Traceability                | {score}% | {status} | {findings}   |
| 7. Implementation Independence | {score}% | {status} | {findings}   |

### Compliance & Quality (Steps 8-11)

| Step                        | Score    | Status   | Key Findings |
| --------------------------- | -------- | -------- | ------------ |
| 8. Domain Compliance        | {score}% | {status} | {findings}   |
| 9. Infrastructure Alignment | {score}% | {status} | {findings}   |
| 10. Success Criteria        | {score}% | {status} | {findings}   |
| 11. Internal Consistency    | {score}% | {status} | {findings}   |

### Final Assessment (Steps 12-13)

| Step              | Score    | Status   | Key Findings |
| ----------------- | -------- | -------- | ------------ |
| 12. Completeness  | {score}% | {status} | {findings}   |
| 13. Final Scoring | {score}% | {status} | {findings}   |

## Cross-PRD Alignment (if applicable)

### Alignment Matrix

| PRD-F Section | PRD-T Section | Aligned | Issues |
| ------------- | ------------- | ------- | ------ |

### Cross-Validation Findings

[Results of review-cruzado execution]

## Gate 1 Transition Recommendation

**Decision**: APPROVE / CONDITIONAL APPROVE / REJECT

**Rationale**: [Based on validation results]

**Conditions** (if conditional):

- [Specific conditions that must be met]

**Next Steps**:

- If APPROVE: Proceed to `/advance-gate 1`
- If CONDITIONAL: Complete remediation actions, then re-validate
- If REJECT: Address critical issues, complete re-write if necessary

## Improvement Opportunities

### Quality Enhancements

[Specific suggestions for improving PRD quality]

### Process Improvements

[Recommendations for better PRD creation process]

### Template Updates

[Suggestions for improving PRD templates based on findings]

## Validation Artifacts

### Generated Documents

📄 `docs/projects/$1/validation/prd-validation-{timestamp}.md`
📄 `docs/projects/$1/validation/gate-1-readiness-{timestamp}.md`
📄 `docs/projects/$1/validation/cross-review-{timestamp}.md` (if applicable)

### Traceability Data

📊 `docs/projects/$1/validation/traceability-matrix-{timestamp}.csv`
📊 `docs/projects/$1/validation/gap-analysis-{timestamp}.csv`
📊 `docs/projects/$1/validation/scoring-breakdown-{timestamp}.json`

## Automation Metrics

- **Total Validation Time**: {duration} minutes
- **Manual Review Time Saved**: {time_saved} hours
- **Automation Coverage**: 85%
- **Quality Improvement**: {improvement}% over manual review
```

## Error Handling & Graceful Degradation

### Missing Context Handling

If business case not available:
→ Generate validation with generic project assumptions
→ Flag missing context as medium priority issue
→ Provide recommendations for obtaining missing context

### Partial PRD Availability

If only PRD-F exists:
→ Complete functional validation only
→ Flag missing technical PRD as critical issue
→ Skip cross-validation steps

If only PRD-T exists:
→ Complete technical validation only
→ Flag missing functional PRD as critical issue
→ Focus on technical completeness and consistency

### Tool Unavailability

If Jira MCP unavailable:
→ Skip traceability to Jira tickets
→ Generate local validation report only
→ Provide instructions for manual Jira integration

If Confluence MCP unavailable:
→ Save all reports as local markdown
→ Provide instructions for manual Confluence upload
→ Include formatted content ready for copy-paste

## Success Metrics & Continuous Improvement

### Performance Targets

- **Validation Speed**: Complete 13-step validation in <45 minutes
- **Accuracy**: 95% correlation with manual expert review
- **Gate Pass Rate**: 95% first-time pass after addressing critical issues
- **Team Adoption**: 100% of PRDs validated before Gate 1

### Feedback Integration

- Capture validation accuracy vs actual Gate 1 outcomes
- Collect team feedback on recommendation quality
- Adjust scoring weights based on real project outcomes
- Continuously improve validation criteria based on lessons learned

### ROI Tracking

- **Time Savings**: Track actual vs estimated time savings
- **Quality Improvements**: Measure reduction in post-Gate 1 changes
- **Process Efficiency**: Monitor validation to Gate 1 passage time
- **Team Satisfaction**: Regular feedback on validation utility

## Validation Engine Integration

This command integrates with:

- **validate-requirements**: Enhanced with LIDR SDLC patterns for Phase 3
- **review-cruzado**: Cross-PRD validation engine
- **advance-gate**: Quantitative scoring for gate decisions
- **Memory System**: Persistent validation learning and improvement
