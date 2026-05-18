---
id: testing-standards-index
version: '1.0.0'
last_updated: '2026-04-06'
updated_by: 'TL: docs-reorganization'
status: active
type: standard
review_cycle: 60
next_review: '2026-06-05'
owner_role: 'Tech Lead'
---

# Testing Standards — LIDR SDLC Framework

## Overview

This directory contains testing infrastructure standards specific to the LIDR SDLC Framework project. These are **project-specific technical standards**, not general methodology skills.

## Standards Documentation

| Standard                                                       | Purpose                                            | Scope                                                                 |
| -------------------------------------------------------------- | -------------------------------------------------- | --------------------------------------------------------------------- |
| [unit-testing-guide.md](./unit-testing-guide.md)               | Unit testing infrastructure for the SDLC ecosystem | Component tests, hooks tests, data layer tests, coverage requirements |
| [visual-regression-testing.md](./visual-regression-testing.md) | Visual regression testing for safe refactoring     | Playwright setup, screenshot comparison, UI validation                |

## Distinction from Skills

These documents are **standards**, not **skills**:

- **Skills** (`/.claude/skills/`): General methodology + reusable templates
- **Standards** (`/docs/standards/`): Project-specific technical requirements
- **Skills cover** → `test-plan`, `create-test-cases`, `playwright-cli` (for product testing)
- **Standards cover** → Framework quality infrastructure (for framework development)

## Usage Context

### Unit Testing Guide

- **When**: Developing/maintaining the SDLC framework itself
- **Audience**: Framework developers, contributors
- **Integration**: CI/CD pipeline, development workflow

### Visual Regression Testing

- **When**: Refactoring large components (HelpCenter, PropuestaMejora, etc.)
- **Audience**: Frontend developers working on framework
- **Integration**: Pre-merge validation, refactoring safety nets

## Integration Points

- **CI/CD**: Referenced by GitHub Actions workflows
- **Development**: Referenced by package.json scripts
- **Quality Gates**: Enforced by coverage gates and visual tests
- **Documentation**: Referenced by contributor guidelines

## Maintenance

- **Review Cycle**: 60 days
- **Owner**: Tech Lead
- **Updates**: When framework testing requirements change
- **Dependencies**: Vitest, Playwright, React Testing Library

---

_These standards ensure the LIDR SDLC Framework maintains high quality while enabling safe refactoring and confident development practices._
