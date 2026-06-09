---
id: readme-template
version: "1.1.0"
last_updated: "2026-06-09"
updated_by: "TL: lang+tool agnostic"
status: active
type: template
review_cycle: 90
next_review: "2026-06-14"
owner_role: "Tech Lead"
---

# README Template

> **Purpose**: Base template to generate the README.md of any project in the ecosystem.
> **Used by**: `/init-project-docs` when creating a project scaffold.
> **Format**: Markdown with standard sections. Adapt to the concrete stack.
> **Output**: English by default; artifact language follows the client `language` setting (see `_shared/lidr/integrations/`).

---

## Recommended Structure

````markdown
# {Project Name}

> Brief description in 1-2 lines: what it does, for whom, why it exists.

## Quick Start

### Prerequisites

- Node.js >= 20 LTS (or the project runtime)
- {DB if applicable}
- {Other system dependencies}

### Installation

\```bash
git clone {url}
cd {project}
{install command: npm install / pnpm install / etc.}
cp .env.example .env
{setup command: migrations, seeds, etc.}
\```

### Run

\```bash
{dev command: npm run dev / etc.}
\```

## Architecture

High-level diagram or summary (1 paragraph + link to docs/architecture/).

## Technology Stack

| Layer    | Technology                        |
| -------- | --------------------------------- |
| Frontend | {React, Vue, etc.}                |
| Backend  | {Node.js, Go, etc.}               |
| Database | {PostgreSQL, MongoDB, etc.}       |
| CI/CD    | {GitHub Actions, GitLab CI, etc.} |

## Project Structure

\```
src/
api/ # Controllers and routes
core/ # Domain logic
components/ # UI components (if frontend)
utils/ # Cross-cutting utilities
tests/ # Tests
docs/ # Documentation
\```

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for code conventions, branching, PRs, and testing.

## Security

See [SECURITY.md](./SECURITY.md) for the vulnerability reporting policy.

## License

See [LICENSE](./LICENSE).

## Links

- [Detailed architecture](./docs/architecture/)
- [ADRs](./docs/adrs/)
- [Changelog](./CHANGELOG.md)
- {Link to {{TRACKING_TOOL}}/{{DOCS_TOOL}} if applicable}
````

---

## README Principles

1. **Entry point**: A new dev should be able to clone, install, and run in <15 min reading only the README
2. **Concise**: Do not duplicate documentation — link to docs/ for details
3. **Up to date**: Review on every major release. The `/sync-docs` command detects drift
4. **Badges**: Optional but recommended — CI status, coverage, version, license
