---
id: TICK-005
title: Define and implement automated testing stack
status: backlog
priority: medium
assignee: architecture-team
type: feature
provider: none
external_link: null
created_at: 2026-02-02
updated_at: 2026-02-02
---

# Define and Implement Automated Testing Stack

## Description

Research, select, and implement a comprehensive automated testing stack to replace manual testing and integrate with pre-push hooks.

**Context:** Currently testing is manual with Playwright MCP for E2E. As the codebase grows, automated testing becomes critical for velocity and confidence. Need to select stack that balances: ease of use, performance, multi-platform support, and ecosystem maturity.

**Scope:**
- Included: Stack selection (Jest/Vitest/other), unit test setup, integration test setup, E2E test setup (Playwright integration), CI/CD integration
- Excluded: Writing tests for existing code (separate tickets), performance testing tools, load testing

**Impact:** Enables confident refactoring, reduces regression bugs by 80-90%, speeds up PR validation from 5-10 min (manual) to 1-2 min (automated), enables TDD workflows.

## Acceptance Criteria

- [ ] Testing stack selected with documented rationale (comparison matrix)
- [ ] Unit testing framework configured (Jest, Vitest, or chosen alternative)
- [ ] Integration testing setup configured
- [ ] E2E testing integrated with Playwright MCP
- [ ] Test runner scripts added to package.json (test, test:unit, test:integration, test:e2e)
- [ ] Code coverage reporting configured (target: >80%)
- [ ] CI/CD pipeline integration (GitHub Actions, GitLab CI, or chosen platform)
- [ ] pre-push hook updated to run automated tests (replace manual confirmation)
- [ ] Developer documentation: "Writing Your First Test"
- [ ] Example tests provided for each type (unit, integration, e2e)

## Definition of Done

**Standard checklist:**
- [ ] All acceptance criteria met
- [ ] Tests written and passing (unit, integration, e2e as needed)
- [ ] Documentation updated (README, API reference, guides)
- [ ] Code reviewed and approved
- [ ] No linting errors or warnings
- [ ] Conventional commit created with TICK-ID
- [ ] PR created with proper template

**Feature-specific:**
- [ ] Testing stack runs on all 4 platforms (Cursor, Claude, Gemini, Antigravity)
- [ ] CI/CD pipeline passing with automated tests
- [ ] Team trained on new testing workflow (workshop or video)

## BDD Scenarios

```gherkin
Feature: Automated Testing Stack

  Scenario: Developer runs unit tests
    Given code changes in src/services/auth.ts
    When developer runs "npm test:unit"
    Then all unit tests execute
    And results show in under 5 seconds
    And coverage report generated
    And developer sees "✅ 42 tests passed"

  Scenario: CI/CD runs full test suite
    Given developer pushes to remote branch
    When CI/CD pipeline triggers
    Then unit tests run first (fast feedback)
    And integration tests run second
    And E2E tests run last (if branch is main or PR)
    And pipeline passes or fails with clear error messages

  Scenario: Pre-push hook runs automated tests
    Given developer completed feature implementation
    When developer runs "git push"
    Then pre-push hook runs "npm test"
    And tests complete in under 2 minutes
    And hook blocks push if any test fails
    And shows failing test with file:line reference

  Scenario: Test coverage validation
    Given new code added without tests
    When tests run with coverage
    Then coverage report shows percentage drop
    And developer sees "⚠️  Coverage dropped from 85% to 78%"
    And developer is prompted to add tests
```

## Tasks

- [ ] Research testing stacks (Jest vs Vitest vs alternatives) - Assigned to: tech-lead
- [ ] Create comparison matrix with pros/cons - Assigned to: tech-lead
- [ ] Present options to team for decision - Assigned to: tech-lead
- [ ] Configure selected testing framework - Assigned to: developer-name
- [ ] Set up unit test structure and conventions - Assigned to: developer-name
- [ ] Set up integration test structure - Assigned to: developer-name
- [ ] Integrate Playwright MCP for E2E - Assigned to: developer-name
- [ ] Configure code coverage reporting - Assigned to: developer-name
- [ ] Set up CI/CD pipeline integration - Assigned to: devops-team
- [ ] Write example tests (unit, integration, e2e) - Assigned to: developer-name
- [ ] Update pre-push hook to run automated tests - Assigned to: developer-name
- [ ] Write developer testing guide - Assigned to: doc-improver agent
- [ ] Conduct team training workshop - Assigned to: tech-lead

## Notes

**Decision log:**
- Decision pending: Jest vs Vitest (research in progress)
- Decision 1: Prioritize TypeScript support (better IDE integration)
- Decision 2: Playwright MCP already available - integrate rather than replace
- Decision 3: Start with unit tests (fastest ROI), then integration, then E2E

**Stack Considerations:**

**Option 1: Vitest**
- Pros: Fast (uses Vite), native TypeScript/ESM, compatible with Jest API, modern
- Cons: Newer (smaller ecosystem), potential compatibility issues with older packages
- Best for: Modern TypeScript projects with Vite/ESM

**Option 2: Jest**
- Pros: Mature ecosystem, extensive plugins, widely adopted, stable
- Cons: Slower than Vitest, ESM support still improving, complex configuration
- Best for: Projects prioritizing stability and ecosystem

**Option 3: Node Test Runner (built-in)**
- Pros: Zero dependencies, native to Node.js, fast
- Cons: Limited features, smaller ecosystem, less tooling
- Best for: Minimalist setups, no external dependencies

**Recommendation (pending research):** Vitest for speed + modern DX, fallback to Jest if compatibility issues arise

**Testing Pyramid Strategy:**
```
       /\      E2E (10%)
      /  \     - Playwright MCP
     /    \    - Critical user flows only
    /------\   
   /        \  Integration (30%)
  /          \ - API endpoints
 /            \- Service interactions
/              \
/________________\
    Unit (60%)
    - Pure functions
    - Business logic
    - Edge cases
```

**Performance Targets:**
- Unit tests: <10 seconds total (should be near-instant for quick feedback)
- Integration tests: <30 seconds
- E2E tests: <2 minutes (only on main/PR, not local dev)
- Full suite: <3 minutes (enables fast pre-push validation)

**CI/CD Integration:**
```yaml
# Example GitHub Actions workflow
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm test:unit
      - run: npm test:integration
      - run: npm test:e2e  # Only on main branch
      - run: npm run coverage
      - uses: codecov/codecov-action@v3  # Upload coverage
```

**References:**
- Playwright MCP: (already configured in .agents/mcp/)
- Pre-push hook: `.agents/hooks/scripts/pre-push.sh` (to be updated)
- Testing guidelines: `.agents/rules/quality/testing.md`
- TICK-003: Git hooks (depends on this ticket for automated testing)

**Migration Path:**
1. Week 1: Research and decision (Jest vs Vitest)
2. Week 1-2: Setup framework and write example tests
3. Week 2: Integrate with pre-push hook and CI/CD
4. Week 3: Team training and gradual adoption
5. Ongoing: Write tests for existing code (separate tickets per module)
