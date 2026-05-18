---
id: repo-structure-checklist
version: "1.0.0"
last_updated: "2026-03-16"
updated_by: "System: Checklist Migration"
status: active
type: checklist
review_cycle: 90
next_review: "2026-06-15"
owner_role: "Tech Lead"
---

# Repository Structure Checklist

> **Purpose**: Verify that a new or existing repository contains all structural artifacts necessary to operate within the SDLC.
> **Evaluator**: `/init-project-docs` (when creating) and `/validate-project-docs` (when auditing)
> **Gate**: Gate 0 (Intake) — evaluated when initializing project repository
> **Note**: Many items are **stack-dependent**. This checklist defines WHAT should exist and WHY, not HOW to implement it.

---

## Obligation Levels

| Level        | Meaning                                          |
| ------------ | ------------------------------------------------ |
| **MUST**     | Mandatory. Blocks Gate 0 if missing              |
| **SHOULD**   | Recommended. Doesn't block but generates warning |
| **CONSIDER** | Conditional to stack or project context          |

---

## 1. Governance Files (repository root)

- [ ] **README.md** (MUST) — Project description, quickstart, summarized architecture, how to contribute, license
- [ ] **CONTRIBUTING.md** (MUST) — Code conventions, branching strategy, PR process, testing requirements, code review
- [ ] **SECURITY.md** (MUST) — Responsible disclosure policy, vulnerability reporting channels, response SLA
- [ ] **CHANGELOG.md** (MUST) — Version history following Keep a Changelog + Conventional Commits
- [ ] **LICENSE** (MUST) — Legal license contract
- [ ] **NOTICE** (SHOULD) — OSS dependencies attribution
- [ ] **.editorconfig** (SHOULD) — Cross-IDE standardization
- [ ] **.gitignore** (MUST) — Stack-appropriate exclusions

---

## 2. CI/CD Pipeline

- [ ] **CI Pipeline** (MUST) — Lint + format check, unit tests, integration tests, SAST scan, build/compile, coverage report
- [ ] **CD Pipeline** (SHOULD) — Automatic deploy to staging, manual deploy to production with approval, post-deploy smoke tests
- [ ] **Secrets Management** (MUST) — Secrets in Vault or equivalent, NEVER hardcoded
- [ ] **Doc Site Deploy** (CONSIDER) — Auto-deploy of documentation as static site on each merge to main

---

## 3. API Contracts

- [ ] **REST API Spec** (MUST if REST) — Contract-first spec (OpenAPI 3.1 recommended), reusable components, error schemas
- [ ] **Async API Spec** (MUST if messaging) — Event contract spec: channels, payloads, routing, headers
- [ ] **API Orchestration** (CONSIDER) — Formal spec of multi-step workflows if orchestrating API sequences

---

## 4. Architecture

- [ ] **Architecture Doc** (MUST) — Architecture document following standard framework (Arc42 or C4 Model recommended)
- [ ] **ADRs** (MUST) — Architecture Decision Records directory with sequential numbering
- [ ] **C4 Diagrams** (SHOULD) — C4 diagrams in Mermaid: Context, Container, Component
- [ ] **DB Schema** (MUST if DB) — Declarative schema representation: tables, relationships, indexes, constraints

---

## 5. Documentation (Diataxis)

- [ ] **docs/guides/** (SHOULD) — Operational how-to guides
- [ ] **docs/tutorials/** (SHOULD) — Learning-oriented tutorials
- [ ] **docs/reference/** (SHOULD) — Information-oriented reference
- [ ] **docs/explanation/** (SHOULD) — Understanding-oriented explanation
- [ ] **docs/adr/** (MUST) — Architecture Decision Records

---

## 6. Testing Infrastructure

- [ ] **Unit Test Framework** (MUST) — Stack-appropriate unit testing setup
- [ ] **Integration Test Suite** (SHOULD) — API/service integration tests
- [ ] **E2E Test Framework** (SHOULD) — End-to-end testing setup
- [ ] **Test Data Management** (SHOULD) — Fixtures, factories, or test data strategy
- [ ] **Coverage Reporting** (SHOULD) — Code coverage measurement and reporting

---

## 7. Tooling Configuration

- [ ] **Linter Configuration** (MUST) — ESLint, Pylint, RuboCop, or equivalent
- [ ] **Formatter Configuration** (MUST) — Prettier, Black, gofmt, or equivalent
- [ ] **Package Manager Files** (MUST) — package.json, requirements.txt, or equivalent
- [ ] **IDE Configuration** (SHOULD) — VSCode settings, IntelliJ configuration
- [ ] **Git Hooks** (CONSIDER) — Pre-commit hooks for linting/formatting

---

## 8. Monitoring & Observability

- [ ] **Logging Configuration** (SHOULD) — Structured logging setup
- [ ] **Metrics Configuration** (SHOULD) — Application metrics instrumentation
- [ ] **Health Check Endpoint** (MUST) — Basic health check endpoint
- [ ] **Readiness Probe** (SHOULD) — Readiness check for dependencies

---

## Evaluation

| Result          | Criteria                                    |
| --------------- | ------------------------------------------- |
| **PASS**        | All MUST items present, SHOULD items >80%   |
| **CONDITIONAL** | All MUST items present, SHOULD items 50-79% |
| **FAIL**        | Any MUST item missing — blocks Gate 0       |

---

## Changelog

| Version | Date       | Author                      | Changes                                                  |
| ------- | ---------- | --------------------------- | -------------------------------------------------------- |
| 1.0.0   | 2026-03-16 | System: Checklist Migration | Initial migration from docs/checklists/repo-structure.md |
