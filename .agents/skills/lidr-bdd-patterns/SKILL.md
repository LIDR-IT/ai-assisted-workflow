---
name: lidr-bdd-patterns
id: bdd-patterns
version: "1.1.1"
last_updated: "2026-03-25"
updated_by: "TL: Domain-Agnostic Normalization"
status: active
phase: 0
owner_role: "QA Lead"
automation: false
domain_agnostic: true
description: 'This skill should be used when the user asks to "validate Given-When-Then", "write BDD scenarios", "check Gherkin syntax", "create acceptance criteria", "format BDD patterns", "validate acceptance tests", or mentions BDD, Gherkin, or Given-When-Then structure. Provides comprehensive BDD syntax validation and patterns for functional requirements. ALWAYS use when writing or validating BDD scenarios and acceptance criteria.'
---

# BDD Patterns & Gherkin Syntax

Comprehensive BDD (Behavior-Driven Development) patterns and Gherkin syntax guidance for creating well-structured Given-When-Then acceptance criteria in functional requirements.

## Purpose

Provide structured patterns, templates, and validation rules for writing high-quality BDD scenarios in Gherkin syntax. Ensure functional requirements include testable, unambiguous acceptance criteria that follow BDD best practices and domain-specific patterns for any software application domain.

## When to Use This Skill

Use this skill when:

- Validating Given-When-Then acceptance criteria in functional requirements
- Creating BDD scenarios for user stories or functional requirements
- Reviewing Gherkin syntax for correctness and clarity
- Teaching teams proper BDD pattern usage
- Integrating with `generate-rf` and `validate-requirements` skills
- Identifying anti-patterns in existing BDD scenarios

## Core BDD Principles

### Given-When-Then Structure

Every BDD scenario follows the three-part pattern:

- **Given** - Preconditions and initial state
- **When** - The action or event that triggers the behavior
- **Then** - Expected outcomes and verification points

### SMART Acceptance Criteria

BDD scenarios should be:

- **Specific** - Clear, unambiguous statements
- **Measurable** - Observable and verifiable outcomes
- **Achievable** - Technically implementable
- **Relevant** - Business value aligned
- **Testable** - Automatable validation

## Essential BDD Patterns

### Pattern 1: Basic Scenario

```gherkin
Scenario: [Brief description of the behavior]
  Given [initial context or precondition]
  When [action is performed]
  Then [expected outcome]
```

### Pattern 2: Multiple Preconditions

```gherkin
Scenario: [Description]
  Given [first precondition]
    And [second precondition]
    And [third precondition]
  When [action]
  Then [outcome]
```

### Pattern 3: Multiple Outcomes

```gherkin
Scenario: [Description]
  Given [precondition]
  When [action]
  Then [primary outcome]
    And [secondary outcome]
    And [tertiary outcome]
```

### Pattern 4: Background Context

```gherkin
Background:
  Given [common precondition for all scenarios]

Scenario: [First scenario]
  Given [specific precondition]
  When [action]
  Then [outcome]

Scenario: [Second scenario]
  Given [different specific precondition]
  When [action]
  Then [outcome]
```

## Domain-Specific Patterns

### Authentication Patterns

**User Authentication:**

```gherkin
Given the user has valid credentials
  And the user has access to the authentication channel
When the user initiates authentication
Then the system validates the provided credentials
  And the system returns an authentication result
  And the system grants access when validation succeeds
```

**Multi-Factor Verification:**

```gherkin
Given the system is configured for multi-factor authentication
When the user completes the primary authentication step
Then the system prompts for the secondary verification factor
  And the system confirms the user's identity when all factors pass
  And the system rejects authentication when any factor fails
```

### Compliance & Data Privacy Patterns

**Consent Management:**

```gherkin
Given the user is starting an onboarding process
  And regulatory compliance is required
When the user provides explicit consent for data processing
Then the system records consent with timestamp
  And the system enables the requested features
  And the system stores consent evidence for audit purposes
```

**Data Deletion (Right to Erasure):**

```gherkin
Given the system holds user personal data subject to deletion rights
When a user requests data deletion
Then the system removes all personal data within the regulatory deadline
  And the system maintains deletion audit logs
  And the system confirms deletion to the user
```

For domain-specific scenarios in {{INDUSTRY_TYPE}} applications ({{DOMAIN_SPECIFIC_FEATURES}}), see:

**[{{DOMAIN_TYPE}} Platform Example](examples/{{DOMAIN_TYPE}}-platform-example.md)** — {{DOMAIN_TYPE}} platform BDD patterns with domain-specific scenarios.

## Gherkin Syntax Rules

### Keywords and Structure

**Primary Keywords:**

- `Feature:` - High-level description
- `Background:` - Common preconditions
- `Scenario:` - Individual test case
- `Scenario Outline:` - Template with examples
- `Given` - Preconditions
- `When` - Actions
- `Then` - Outcomes
- `And` - Additional steps
- `But` - Contrasting steps

**Data Keywords:**

- `Examples:` - Data tables for scenario outlines
- `|` - Table delimiters

### Syntax Validation Rules

1. **Keyword Capitalization**: All Gherkin keywords must be properly capitalized
2. **Indentation**: Consistent spacing (2 or 4 spaces)
3. **Line Structure**: One step per line
4. **Punctuation**: No trailing punctuation on steps
5. **Tense**: Present tense for Given/When, future tense for Then

## Common Anti-Patterns

### Anti-Pattern 1: Implementation Details

❌ **Avoid:**

```gherkin
Given the database contains user record with ID 12345
When the API endpoint /users/verify is called with POST request
Then the JSON response contains status: "success"
```

✅ **Better:**

```gherkin
Given the user exists in the system
When the user attempts identity verification
Then the verification is successful
```

### Anti-Pattern 2: UI-Specific Steps

❌ **Avoid:**

```gherkin
When the user clicks the "Submit" button
Then the modal dialog appears
```

✅ **Better:**

```gherkin
When the user submits their information
Then the system displays confirmation
```

### Anti-Pattern 3: Vague Outcomes

❌ **Avoid:**

```gherkin
Then the system works correctly
Then the user is happy
```

✅ **Better:**

```gherkin
Then the match score exceeds the configured threshold
Then the user receives verification confirmation within 3 seconds
```

## Scenario Templates

### Template 1: Happy Path

```gherkin
Scenario: [Feature] - Successful [Action]
  Given [user/system state]
    And [required conditions are met]
  When [user performs action]
  Then [primary success outcome]
    And [secondary confirmation]
    And [system state change]
```

### Template 2: Error Handling

```gherkin
Scenario: [Feature] - [Error Condition]
  Given [normal preconditions]
    And [error trigger condition]
  When [user attempts action]
  Then [appropriate error message is shown]
    And [system remains in safe state]
    And [user can recover]
```

### Template 3: Edge Cases

```gherkin
Scenario: [Feature] - [Boundary Condition]
  Given [boundary or limit condition]
  When [action at boundary]
  Then [defined boundary behavior]
    And [no system failure]
```

## Integration with Requirements Skills

### generate-rf Integration

When generating functional requirements, this skill provides:

- Template BDD scenarios for each requirement type
- Domain-specific Given-When-Then patterns
- Validation rules for acceptance criteria quality

### validate-requirements Integration

During requirements validation, this skill checks:

- Gherkin syntax correctness
- Scenario completeness (Given-When-Then present)
- Testability of acceptance criteria
- Anti-pattern detection

## Quality Checklist

**BDD Scenario Quality:**

- [ ] Follows Given-When-Then structure
- [ ] Uses present tense consistently
- [ ] Avoids implementation details
- [ ] Describes observable outcomes
- [ ] Is independently executable
- [ ] Uses business language, not technical jargon
- [ ] Has clear pass/fail criteria

**Gherkin Syntax:**

- [ ] Proper keyword capitalization
- [ ] Consistent indentation
- [ ] No trailing punctuation
- [ ] One logical step per line
- [ ] Appropriate use of And/But

**Domain Alignment:**

- [ ] Follows domain-specific patterns where applicable
- [ ] Includes compliance considerations
- [ ] Uses domain-appropriate terminology
- [ ] Addresses security and privacy requirements

## Additional Resources

### Reference Files

For comprehensive patterns and advanced techniques:

- **`references/gherkin-specification.md`** - Complete Gherkin language specification
- **`references/domain-patterns.md`** - Domain-specific BDD patterns for various application types
- **`references/compliance-scenarios.md`** - Regulatory compliance BDD patterns

### Example Files

Working examples in `examples/`:

- **`functional-requirement-examples.md`** - Complete functional requirements with BDD
- **`anti-pattern-corrections.md`** - Common mistakes and corrections
- **`domain-scenarios.md`** - Industry-specific scenario collections

## Usage Examples

### Validating Acceptance Criteria

```
Input: "Verify this acceptance criteria follows BDD patterns"
Process: Check Given-When-Then structure, syntax, testability
Output: Validation report with improvement suggestions
```

### Generating BDD Scenarios

```
Input: "Create BDD scenarios for user authentication feature"
Process: Apply domain-specific patterns, ensure compliance considerations
Output: Structured scenarios with domain-appropriate language
```

### Anti-Pattern Detection

```
Input: "Review these scenarios for anti-patterns"
Process: Check for implementation details, UI coupling, vague outcomes
Output: Identified issues with corrected examples
```

## Quality Assurance

### Validation Script

This skill includes automated validation via `scripts/validate-examples.ts`:

```bash
# Validate skill examples and structure
npx tsx scripts/validate-examples.ts
```

**Validation includes:**

- Example completeness and correctness
- BDD pattern and Gherkin syntax compliance patterns
- Progressive disclosure adherence
- Resource organization standards

**When to use:**

- Before skill release/packaging
- In CI/CD pipeline (quality gates)
- After major example updates
- During skill maintenance cycles

**Integration with ecosystem:**

- Used by `/multi-agent-audit` for ecosystem validation
- Supports quality gates in SDLC workflow
- Provides consistent validation across all skills

## Integration Workflow

1. **Requirements Generation**: Apply BDD patterns during functional requirement creation
2. **Syntax Validation**: Check Gherkin syntax and structure compliance
3. **Domain Alignment**: Ensure scenarios follow domain-specific best practices
4. **Quality Assessment**: Validate testability and completeness
5. **Anti-Pattern Detection**: Identify and correct common mistakes
6. **Integration Check**: Verify compatibility with testing frameworks

Focus on creating testable, business-readable scenarios that serve both as specification and test automation foundation.
