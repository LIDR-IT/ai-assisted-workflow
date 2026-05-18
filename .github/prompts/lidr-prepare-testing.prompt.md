---
description: Generate complete test suite from ticket
agent: 'agent'
---

<!--
COMMAND: prepare-testing
VERSION: 2.0.0
AUTHOR: SDLC Team
LAST UPDATED: 2025-03-05

PURPOSE:
QA workflow: reads ticket + dev handoff + code diff, generates test plan,
test cases (BDD), regression candidates, and exports CSV for Xray import.

USAGE:
  /prepare-testing PROJ-123

ARGUMENTS:
  ticket-id: Jira ticket ID (required)

REQUIREMENTS:
  - Ticket must be in "Ready for QA" status
  - Dev→QA handoff attached to ticket
  - Manual ticket access or scripts
  - CSV export scripts for Xray integration

RELATED COMMANDS:
  /implement-ticket - Dev workflow that generates the handoff this command reads
  /advance-gate 5   - QA sign-off after testing complete

CHANGELOG:
  v2.0.0 (2025-03-05): Rewritten to official command format
  v1.0.0 (2025-02-15): Initial version
-->

# Prepare Testing for $1

Load: @../rules/org.md and @../rules/project.md

## Validate

If "$1" is empty:
❌ Ticket ID required. Usage: /prepare-testing [TICKET-ID]
Exit.

Read ticket from manual or script: ticket $1
If status != "Ready for QA":
⚠️ Ticket $1 is "{status}", not "Ready for QA".

Use AskUserQuestion:

- question: "Ticket no está en Ready for QA. ¿Continuar?"
- header: "Estado"
- options:
  - Sí (Preparar testing de todas formas)
  - No (Esperar a que Dev termine)

## Gather Context

From Jira ticket:

- BDD acceptance criteria (Given/When/Then)
- Linked User Story and RF
- Dev→QA handoff document (attachment)

From Git (if available):

- PR diff: read changed files to understand what was implemented
- !`git diff origin/develop...HEAD --stat`

From handoff document:

- What was implemented (functional description)
- Endpoints, DB changes, config changes
- How to test (dev's suggestions)
- Known limitations and edge cases

## Generate Test Plan

Using test-plan skill, generate test plan:

- Scope: what to test based on changes
- Strategy: functional + BDD + regression + edge cases
- Entry criteria: staging deployed, data available
- Exit criteria: all cases executed, 0 critical bugs
- Risk areas: based on complexity and change scope

## Generate Test Cases

Using create-test-cases skill, generate test cases for each BDD criterion:

For each acceptance criterion:

1. **Happy path** test case (Given/When/Then as specified)
2. **Edge cases** (boundary values, empty inputs, max values)
3. **Error cases** (invalid data, unauthorized, timeout)
4. **Regression candidates** (related functionality that might break)

Format each test case:

```
TC-{number}: {title}
Preconditions: {setup needed}
Steps:
  1. Given {context}
  2. When {action}
  3. Then {expected result}
Data: {test data needed}
Priority: Critical / High / Medium / Low
```

## Suggest Regression Suite

Using regression-suite skill:

- Analyze changed files to determine impact radius
- Suggest existing test cases that should be re-executed
- Flag areas of risk based on coupling analysis

## Write to Test Management

Generate CSV export for Xray import:

- Create test plan and test cases in CSV format
- Save to `.claude/testing/$1-test-suite.csv`
- Ready for import-to-xray.sh script execution
- Also generate markdown document for review
- Save to `.claude/testing/$1-test-suite.local.md`

## Transition

Add comment to $1 with test plan summary (manual or script)
Transition $1 to "In Testing" (manual or script)

## Report

```
/prepare-testing $1 ✅

Test Plan: Generated ({N} test cases)
  - Happy path: {N}
  - Edge cases: {N}
  - Error cases: {N}
  - Regression: {N} candidates

Written to: {CSV export + local file}
Ticket: $1 → "In Testing"

Next: Execute tests → /advance-gate 5 for QA sign-off
```
