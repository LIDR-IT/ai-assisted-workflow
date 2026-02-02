---
id: TICK-002
title: Expand orchestrator documentation with coordination patterns
status: backlog
priority: high
assignee: development-team
type: docs
provider: none
external_link: null
created_at: 2026-02-02
updated_at: 2026-02-02
---

# Expand Orchestrator Documentation

## Description

Expand AGENTS.md orchestrator documentation with comprehensive agent coordination patterns, decision trees, and performance benchmarks.

**Context:** Current AGENTS.md provides basic structure but lacks detailed patterns for when to use subagents vs direct implementation, how agents coordinate, and performance implications. Teams need clear guidance for complex workflows.

**Scope:**
- Included: Coordination patterns, decision trees, performance benchmarks, multi-agent workflows
- Excluded: Platform-specific implementation details (keep platform-agnostic)

**Impact:** Development teams gain clarity on agent usage, reducing trial-and-error time and improving workflow efficiency. Estimated 2-3 hours saved per developer per week on agent selection decisions.

## Acceptance Criteria

- [ ] Document 5+ agent coordination patterns with examples
- [ ] Create decision tree for "when to use subagent vs direct implementation"
- [ ] Add performance benchmarks for agent overhead (baseline, 1 agent, 3 agents, 5 agents)
- [ ] Include 3-5 complete workflow examples (simple, medium, complex)
- [ ] Document agent-to-agent communication patterns
- [ ] Add troubleshooting section for common orchestration issues

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
- [ ] Cross-references added (related docs linked)
- [ ] Index/table of contents updated

## BDD Scenarios

```gherkin
Feature: Orchestrator Documentation

  Scenario: Developer needs to decide on agent usage
    Given a developer planning a complex feature
    And uncertain whether to use subagents
    When they consult the orchestrator documentation
    Then they find a clear decision tree
    And see examples matching their use case
    And understand performance trade-offs

  Scenario: Developer debugging agent coordination
    Given agents not coordinating as expected
    When developer checks troubleshooting section
    Then they find common coordination issues
    And see solutions with code examples

  Scenario: Team reviewing agent performance
    Given team concerned about agent overhead
    When they check performance benchmarks
    Then they see baseline vs multi-agent metrics
    And understand when overhead is acceptable
```

## Tasks

- [ ] Research existing agent coordination patterns - Assigned to: tech-lead
- [ ] Create decision tree diagram - Assigned to: tech-lead
- [ ] Run performance benchmarks (1, 3, 5 agents) - Assigned to: developer-name
- [ ] Document coordination patterns with examples - Assigned to: doc-improver agent
- [ ] Write 3-5 complete workflow examples - Assigned to: developer-name
- [ ] Create troubleshooting section - Assigned to: developer-name
- [ ] Add cross-references to related docs - Assigned to: doc-improver agent
- [ ] Review for technical accuracy - Assigned to: tech-lead

## Notes

**Decision log:**
- Decision 1: Focus on platform-agnostic patterns (not Cursor-specific, Claude-specific, etc.)
- Decision 2: Include real performance numbers from benchmarks (not hypothetical)
- Decision 3: Use mermaid diagrams for decision trees and workflow visualizations

**Trade-offs:**
- Comprehensive vs concise: Prioritized comprehensive with ToC for navigation
- Generic vs specific: Balanced with 70% generic patterns, 30% specific examples

**References:**
- Current AGENTS.md: `.agents/orchestrator/AGENTS.md`
- Agent development skill: `.agents/skills/agent-development/`
- Existing subagents: `.agents/subagents/`

**Content Structure:**
```markdown
# AGENTS.md Expansion

## Agent Coordination Patterns
1. Sequential execution
2. Parallel execution
3. Conditional branching
4. Error handling and recovery
5. Resource sharing

## Decision Tree: When to Use Subagents
[Mermaid diagram]

## Performance Benchmarks
[Table with metrics]

## Complete Workflow Examples
1. Simple: Single agent task
2. Medium: 2-3 coordinated agents
3. Complex: 5+ agents with error handling

## Troubleshooting
[Common issues and solutions]
```
