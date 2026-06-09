---
id: contributing-template
version: "1.1.0"
last_updated: "2026-06-09"
updated_by: "TL: lang+tool agnostic"
status: active
type: template
review_cycle: 90
next_review: "2026-06-14"
owner_role: "Tech Lead"
---

# CONTRIBUTING.md Template

> **Purpose**: Template to generate the CONTRIBUTING.md of any project.
> **Compiled from**: `rules/tech-stack.md` section 9 (Git), `rules/org.md`, `Guidelines.md` section 2 (Code Conventions).
> **Used by**: `/init-project-docs` when creating a project scaffold.
> **Output**: English by default; artifact language follows the client `language` setting (see `_shared/lidr/integrations/`).

---

## Recommended Structure

````markdown
# Contributing to {Project Name}

Thank you for your interest in contributing. This document describes the rules and processes
we follow to maintain code quality.

## Prerequisites

- Read [README.md](./README.md) and be able to run the project locally
- Access to {{TRACKING_TOOL}} for ticket tracking
- Access to {{VCS_TOOL}} for PRs

## Branching Strategy (Git Flow)

\```
main ───────────────────────────► (production)
|
├─ develop ───────────────────► (integration)
| |
| ├─ feat/PROJ-123-desc ──► merge to develop
| ├─ fix/PROJ-456-desc ───► merge to develop
| └─ refactor/PROJ-789 ───► merge to develop
|
├─ release/1.2.0 ────────────► merge to main + tag
|
└─ hotfix/PROJ-999-desc ─────► merge to main + develop
\```

### Branch Naming

- `feat/PROJ-{ID}-{short-description}`
- `fix/PROJ-{ID}-{short-description}`
- `refactor/PROJ-{ID}-{short-description}`
- `hotfix/PROJ-{ID}-{short-description}`

## Conventional Commits

All commits must follow the format:

\```
<type>(<scope>): <description>

[optional body]
[optional footer]
\```

| Type       | When                    |
| ---------- | ----------------------- |
| `feat`     | New functionality       |
| `fix`      | Bug fix                 |
| `docs`     | Documentation only      |
| `refactor` | No functional change    |
| `test`     | New or fixed tests      |
| `chore`    | Maintenance             |
| `perf`     | Performance improvement |
| `ci`       | CI/CD changes           |

## Pull Requests

### Process

1. Create a branch from `develop` (or `main` for hotfix)
2. Implement changes with conventional commits
3. Run tests locally: `npm test`
4. Create a PR to `develop`
5. The description is auto-generated with the skill `pr-description`
6. Minimum 1 reviewer (Tech Lead for core changes)
7. CI must pass: build + tests + lint + SAST
8. Squash merge to develop

### PR Checklist (DoD)

- [ ] Tests pass (unit + integration)
- [ ] Coverage >= 80%
- [ ] No linter warnings
- [ ] {{CODE_QUALITY_TOOL}} (SAST/SCA) clean
- [ ] Documentation updated if there is an API change
- [ ] No secrets in the code

## Code Conventions

### TypeScript

- `strict: true` always enabled
- `any` FORBIDDEN — use `unknown` + type guards
- Interfaces for public contracts, Types for unions
- Enums: NO — use `const` objects with `as const`

### React (if applicable)

- Functional components with hooks only
- Props: explicit interface, destructured
- Keys: always a stable ID, NEVER an array index

### Naming

| Element    | Convention           | Example             |
| ---------- | -------------------- | ------------------- |
| Components | PascalCase           | `UserProfile.tsx`   |
| Hooks      | camelCase with "use" | `useAuthStatus`     |
| Utilities  | camelCase            | `formatCurrency.ts` |
| Constants  | UPPER_SNAKE_CASE     | `MAX_RETRY_COUNT`   |

## Testing

- Tests are written BEFORE or ALONGSIDE the code
- Unit tests: 80% minimum coverage
- Integration tests: critical flows
- BDD: acceptance criteria define test cases

## Security

- NEVER log PII/sensitive data
- NEVER hardcode secrets
- See [SECURITY.md](./SECURITY.md) for vulnerability reporting
````

---

## Notes for the Generator

- The Git, TypeScript, React, and Naming conventions are extracted directly from `rules/tech-stack.md` and `Guidelines.md`
- If the project does not use React, omit the React section
- If the project uses a different stack (Go, Python, etc.), adapt the convention sections
- The PR checklist must align with the content of `docs/checklists/dod.md`
