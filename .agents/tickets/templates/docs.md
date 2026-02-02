---
id: TICK-000
title: [Docs title - what documentation is being created/updated]
status: backlog
priority: medium
assignee: [department|person|agent-name]
type: docs
provider: none
external_link: null
created_at: YYYY-MM-DD
updated_at: YYYY-MM-DD
---

# [Documentation Title]

## Description

[What documentation is being created or updated, and why]

**Motivation:**
- Knowledge gap to fill
- New feature needs documentation
- Existing docs outdated
- User feedback/confusion

**Impact:**
- Who will benefit from this documentation
- What problems it solves

## Documentation Scope

**Included:**
- Topic 1
- Topic 2
- Topic 3

**Excluded:**
- Out-of-scope topic 1
- Out-of-scope topic 2

## Target Audience

**Primary audience:**
- [Developer, User, Admin, etc.]
- [Experience level: Beginner, Intermediate, Advanced]

**Assumed knowledge:**
- Prerequisite 1
- Prerequisite 2

## Content Outline

### Section 1: [Section name]
- Subsection 1.1
- Subsection 1.2

### Section 2: [Section name]
- Subsection 2.1
- Subsection 2.2

### Section 3: [Section name]
- Subsection 3.1
- Subsection 3.2

<!--
Follow documentation standards:
- Guidelines: .agents/rules/process/documentation.md
- Structure: docs/guidelines/ (for guidelines), docs/guides/ (for how-tos), docs/references/ (for technical specs)
-->

## Examples to Include

- [ ] Example 1: [Brief description]
- [ ] Example 2: [Brief description]
- [ ] Example 3: [Brief description]

<!--
Every doc should include concrete examples.
Code examples should be tested and working.
-->

## Acceptance Criteria

- [ ] All sections from outline complete
- [ ] At least 3 working examples included
- [ ] All links verified (no 404s)
- [ ] Code samples tested and correct
- [ ] Screenshots/diagrams included (if applicable)
- [ ] Reviewed for clarity by target audience member

## Definition of Done

**Standard checklist:**
- [ ] All acceptance criteria met
- [ ] Documentation reviewed for clarity and accuracy
- [ ] Code reviewed and approved
- [ ] No linting errors or warnings (markdown)
- [ ] Conventional commit created with TICK-ID
- [ ] PR created with proper template

**Docs-specific:**
- [ ] Examples included and tested
- [ ] Links verified (no broken links)
- [ ] Screenshots up-to-date (if applicable)
- [ ] Cross-references added (related docs linked)
- [ ] Index/table of contents updated

## BDD Scenarios

```gherkin
Feature: [Documentation feature]

  Scenario: User finds information
    Given a user looking for "[topic]"
    When they search documentation
    Then they find "[specific doc]"
    And the doc contains working examples
```

<!--
For documentation tickets, BDD scenarios describe user navigation and findability.
-->

## Tasks

- [ ] Research existing documentation and gaps - Assigned to: [developer-name]
- [ ] Create outline and structure - Assigned to: [developer-name]
- [ ] Write content sections - Assigned to: [doc-improver agent or developer]
- [ ] Add code examples and test them - Assigned to: [developer-name]
- [ ] Create screenshots/diagrams - Assigned to: [developer-name]
- [ ] Review for clarity - Assigned to: [reviewer from target audience]
- [ ] Update cross-references and index - Assigned to: [doc-improver agent]

## Style Guidelines

**Follow project standards:**
- Documentation Standards: `.agents/rules/process/documentation.md`
- Markdown style: Use proper headers, code blocks with language tags
- Tone: Clear, concise, professional
- Active voice: "Run the command" not "The command should be run"

**Document type:**
- [ ] Guideline (prescriptive rules)
- [ ] Guide (step-by-step tutorial)
- [ ] Reference (technical specification)
- [ ] Note (research or comparison)

**Location:**
```
docs/
├── guidelines/    # Prescriptive standards
├── guides/        # Task-oriented tutorials
├── notes/         # Research and explorations
└── references/    # Technical documentation
```

## Cross-References

**Related documentation:**
- [Link to related doc 1]
- [Link to related doc 2]

**Referenced from:**
- [Where this doc should be linked]
- [Navigation breadcrumbs]

## Notes

**Research findings:**
[Document any research done]

**Decision log:**
[Key decisions about structure or content]

**Feedback incorporated:**
[User feedback or requests addressed]
