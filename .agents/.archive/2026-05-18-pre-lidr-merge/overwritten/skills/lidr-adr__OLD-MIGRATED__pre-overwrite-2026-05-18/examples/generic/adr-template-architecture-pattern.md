# ADR-{NNN}: {{ARCHITECTURE_PATTERN}} for {{SYSTEM_COMPONENT}}

## Metadata

| Field              | Value                                            |
| ------------------ | ------------------------------------------------ |
| **ID**             | ADR-{NNN}                                        |
| **Date**           | {{YYYY-MM-DD}}                                   |
| **Status**         | {{Proposed/Accepted/Deprecated/Superseded}}      |
| **Deciders**       | {{ARCHITECT}}: {{NAME}}, {{TEAM_LEAD}}: {{NAME}} |
| **Technical Area** | Architecture                                     |

## Context and Problem Statement

{{SYSTEM_DESCRIPTION}} currently {{CURRENT_ARCHITECTURE_STATE}}. However, we face the following architectural challenges:

1. **{{CHALLENGE_1}}**: {{CHALLENGE_DESCRIPTION_1}}
2. **{{CHALLENGE_2}}**: {{CHALLENGE_DESCRIPTION_2}}
3. **{{CHALLENGE_3}}**: {{CHALLENGE_DESCRIPTION_3}}

The core architectural question: {{ARCHITECTURAL_QUESTION}}?

## Decision Drivers

### Quality Attributes

| Attribute          | Priority       | Current State | Target State |
| ------------------ | -------------- | ------------- | ------------ |
| {{QUALITY_ATTR_1}} | {{PRIORITY_1}} | {{CURRENT_1}} | {{TARGET_1}} |
| {{QUALITY_ATTR_2}} | {{PRIORITY_2}} | {{CURRENT_2}} | {{TARGET_2}} |
| {{QUALITY_ATTR_3}} | {{PRIORITY_3}} | {{CURRENT_3}} | {{TARGET_3}} |

### Business Drivers

- **{{BUSINESS_DRIVER_1}}**: {{BUSINESS_DESCRIPTION_1}}
- **{{BUSINESS_DRIVER_2}}**: {{BUSINESS_DESCRIPTION_2}}
- **{{BUSINESS_DRIVER_3}}**: {{BUSINESS_DESCRIPTION_3}}

### Technical Constraints

- **{{CONSTRAINT_1}}**: {{CONSTRAINT_DETAIL_1}}
- **{{CONSTRAINT_2}}**: {{CONSTRAINT_DETAIL_2}}
- **{{CONSTRAINT_3}}**: {{CONSTRAINT_DETAIL_3}}

## Considered Options

### Option 1: {{PATTERN_OPTION_1}}

**Description**: {{PATTERN_DESCRIPTION_1}}

**Architecture Diagram**:

```mermaid
graph TD
    A[{{COMPONENT_A}}] --> B[{{COMPONENT_B}}]
    B --> C[{{COMPONENT_C}}]
    C --> D[{{COMPONENT_D}}]
```

**Key Characteristics**:

- {{CHARACTERISTIC_1_1}}
- {{CHARACTERISTIC_1_2}}
- {{CHARACTERISTIC_1_3}}

### Option 2: {{PATTERN_OPTION_2}}

**Description**: {{PATTERN_DESCRIPTION_2}}

**Architecture Diagram**:

```mermaid
graph LR
    E[{{COMPONENT_E}}] --> F[{{COMPONENT_F}}]
    F --> G[{{COMPONENT_G}}]
    G --> H[{{COMPONENT_H}}]
```

**Key Characteristics**:

- {{CHARACTERISTIC_2_1}}
- {{CHARACTERISTIC_2_2}}
- {{CHARACTERISTIC_2_3}}

### Option 3: {{PATTERN_OPTION_3}}

**Description**: {{PATTERN_DESCRIPTION_3}}

**Architecture Diagram**:

```mermaid
graph TB
    I[{{COMPONENT_I}}] --> J[{{COMPONENT_J}}]
    I --> K[{{COMPONENT_K}}]
    J --> L[{{COMPONENT_L}}]
    K --> L
```

**Key Characteristics**:

- {{CHARACTERISTIC_3_1}}
- {{CHARACTERISTIC_3_2}}
- {{CHARACTERISTIC_3_3}}

## Decision Outcome

**Chosen option: "{{SELECTED_PATTERN}}"** because {{PATTERN_RATIONALE}}.

### Architectural Impact

**System Structure Changes**:

- {{STRUCTURE_CHANGE_1}}
- {{STRUCTURE_CHANGE_2}}
- {{STRUCTURE_CHANGE_3}}

**Component Responsibilities**:
| Component | Responsibility | Technology |
|-----------|---------------|------------|
| {{COMPONENT_A}} | {{RESPONSIBILITY_A}} | {{TECH_A}} |
| {{COMPONENT_B}} | {{RESPONSIBILITY_B}} | {{TECH_B}} |
| {{COMPONENT_C}} | {{RESPONSIBILITY_C}} | {{TECH_C}} |

**Communication Patterns**:

- {{COMMUNICATION_1}}: {{PATTERN_1}}
- {{COMMUNICATION_2}}: {{PATTERN_2}}
- {{COMMUNICATION_3}}: {{PATTERN_3}}

## Quality Attribute Analysis

### {{PATTERN_OPTION_1}} {{SELECTED_INDICATOR}}

| Quality Attribute | Assessment   | Justification         |
| ----------------- | ------------ | --------------------- |
| {{ATTRIBUTE_1}}   | {{RATING_1}} | {{JUSTIFICATION_1_1}} |
| {{ATTRIBUTE_2}}   | {{RATING_2}} | {{JUSTIFICATION_1_2}} |
| {{ATTRIBUTE_3}}   | {{RATING_3}} | {{JUSTIFICATION_1_3}} |
| {{ATTRIBUTE_4}}   | {{RATING_4}} | {{JUSTIFICATION_1_4}} |

### {{PATTERN_OPTION_2}}

| Quality Attribute | Assessment   | Justification         |
| ----------------- | ------------ | --------------------- |
| {{ATTRIBUTE_1}}   | {{RATING_1}} | {{JUSTIFICATION_2_1}} |
| {{ATTRIBUTE_2}}   | {{RATING_2}} | {{JUSTIFICATION_2_2}} |
| {{ATTRIBUTE_3}}   | {{RATING_3}} | {{JUSTIFICATION_2_3}} |
| {{ATTRIBUTE_4}}   | {{RATING_4}} | {{JUSTIFICATION_2_4}} |

### {{PATTERN_OPTION_3}}

| Quality Attribute | Assessment   | Justification         |
| ----------------- | ------------ | --------------------- |
| {{ATTRIBUTE_1}}   | {{RATING_1}} | {{JUSTIFICATION_3_1}} |
| {{ATTRIBUTE_2}}   | {{RATING_2}} | {{JUSTIFICATION_3_2}} |
| {{ATTRIBUTE_3}}   | {{RATING_3}} | {{JUSTIFICATION_3_3}} |
| {{ATTRIBUTE_4}}   | {{RATING_4}} | {{JUSTIFICATION_3_4}} |

## Trade-off Analysis

### Accepted Trade-offs

| Improvement       | Sacrifice       | Rationale                 |
| ----------------- | --------------- | ------------------------- |
| {{IMPROVEMENT_1}} | {{SACRIFICE_1}} | {{TRADE_OFF_RATIONALE_1}} |
| {{IMPROVEMENT_2}} | {{SACRIFICE_2}} | {{TRADE_OFF_RATIONALE_2}} |

### Risk Assessment

| Risk            | Probability | Impact       | Mitigation       |
| --------------- | ----------- | ------------ | ---------------- |
| {{ARCH_RISK_1}} | {{PROB_1}}  | {{IMPACT_1}} | {{MITIGATION_1}} |
| {{ARCH_RISK_2}} | {{PROB_2}}  | {{IMPACT_2}} | {{MITIGATION_2}} |

## Implementation Strategy

### Migration Approach

1. **Phase 1** - {{PHASE_1_DESCRIPTION}}
   - Duration: {{DURATION_1}}
   - Deliverables: {{DELIVERABLES_1}}
   - Dependencies: {{DEPENDENCIES_1}}

2. **Phase 2** - {{PHASE_2_DESCRIPTION}}
   - Duration: {{DURATION_2}}
   - Deliverables: {{DELIVERABLES_2}}
   - Dependencies: {{DEPENDENCIES_2}}

3. **Phase 3** - {{PHASE_3_DESCRIPTION}}
   - Duration: {{DURATION_3}}
   - Deliverables: {{DELIVERABLES_3}}
   - Dependencies: {{DEPENDENCIES_3}}

### Rollback Plan

- **Trigger Conditions**: {{ROLLBACK_TRIGGERS}}
- **Rollback Steps**: {{ROLLBACK_STEPS}}
- **Data Preservation**: {{DATA_STRATEGY}}

## Validation and Metrics

### Architecture Validation

- **{{VALIDATION_METHOD_1}}**: {{VALIDATION_DESCRIPTION_1}}
- **{{VALIDATION_METHOD_2}}**: {{VALIDATION_DESCRIPTION_2}}
- **{{VALIDATION_METHOD_3}}**: {{VALIDATION_DESCRIPTION_3}}

### Success Metrics

| Metric       | Baseline       | Target       | Measurement Method |
| ------------ | -------------- | ------------ | ------------------ |
| {{METRIC_1}} | {{BASELINE_1}} | {{TARGET_1}} | {{METHOD_1}}       |
| {{METRIC_2}} | {{BASELINE_2}} | {{TARGET_2}} | {{METHOD_2}}       |
| {{METRIC_3}} | {{BASELINE_3}} | {{TARGET_3}} | {{METHOD_3}}       |

## Related Decisions and Documentation

### Related ADRs

- [{{RELATED_ADR_1}}]({{ADR_LINK_1}}) - {{RELATIONSHIP_1}}
- [{{RELATED_ADR_2}}]({{ADR_LINK_2}}) - {{RELATIONSHIP_2}}

### Architecture Documentation

- [{{ARCH_DOC_1}}]({{DOC_LINK_1}})
- [{{ARCH_DOC_2}}]({{DOC_LINK_2}})

### Technical Specifications

- [{{SPEC_1}}]({{SPEC_LINK_1}})
- [{{SPEC_2}}]({{SPEC_LINK_2}})

---

**Rating Scale**: Excellent (5) | Good (4) | Acceptable (3) | Poor (2) | Unacceptable (1)
**Template Variables**: Replace {{VARIABLE_NAME}} with actual values for your specific decision context.
