---
name: lidr-architecture-doc
id: architecture-doc
version: "1.2.0"
last_updated: "2026-03-26"
updated_by: "TL: ecosystem-integration"
status: active
phase: 0
owner_role: "TL"
automation: false
domain_agnostic: true
description: "Generate and maintain comprehensive technical architecture documentation at 5 levels using project templates (architecture.md, db-schema.md, specs/routes.md, specs/components.md, specs/storage.md). Domain-agnostic — works for any tech stack and industry. Use when setting up new projects, after major architectural changes, or when documentation is outdated. Use at project initialization from PRD-T, post-ADR to update affected sections, at sprint reviews if stack/DB/structure changed, and pre-release to verify docs match code. Trigger for any architecture, database, API, or component documentation needs. Supports both greenfield projects and legacy codebase documentation. ALWAYS use when creating or updating technical architecture documentation."
---

# Architecture Document Generator

Phase: 2 — Discovery → maintained throughout project | Language: English | Domain: Any

## Workflow

1. **Context Gathering**: Read PRD-T, existing ADRs, and understand project scope
2. **Code Analysis**: Analyze package.json, tsconfig, directory structure, and dependencies
3. **Schema Discovery**: Read ORM schemas, migrations, and database configurations
4. **Route Mapping**: Map frontend routes and API endpoints from route definitions
5. **Component Inventory**: Identify UI components, props, and state patterns
6. **Documentation Generation**: Generate all 5 levels using project templates
7. **Validation**: Cross-check against repo structure checklist and identify gaps
8. **Quality Assurance**: Verify consistency and completeness across all levels

## 5 Documentation Levels

| Level         | Template              | What it Documents                                   |
| ------------- | --------------------- | --------------------------------------------------- |
| 1. Overview   | `architecture.md`     | Stack, structure, principles, security, performance |
| 2. Data       | `db-schema.md`        | Tables, relationships, migrations, sensitive data   |
| 3. Routes     | `specs/routes.md`     | Frontend pages + API endpoints                      |
| 4. Components | `specs/components.md` | UI components, props, states, a11y                  |
| 5. Storage    | `specs/storage.md`    | Files, cache, state management, queues              |

## Input

| Input                              | Required      | Source                                     |
| ---------------------------------- | ------------- | ------------------------------------------ |
| PRD-T                              | ✅            | skill `prd-tecnico/`                       |
| Codebase (package.json, structure) | ✅            | Repository                                 |
| ORM schemas                        | If applicable | Prisma/TypeORM files                       |
| Route definitions                  | ✅            | React Router / Express                     |
| ADRs                               | Desirable     | skill `adr/`                               |
| Architecture template              | ✅            | `templates/architecture.md`                |
| Repo structure checklist           | ✅            | `@../kickoff/checklists/repo-structure.md` |

## Output Location

Generated documents should be saved to:

- **Main architecture**: `docs/projects/{projectName}/architecture.md`
- **Database schema**: `docs/projects/{projectName}/db-schema.md`
- **API routes**: `docs/projects/{projectName}/specs/routes.md`
- **UI components**: `docs/projects/{projectName}/specs/components.md`
- **Storage layer**: `docs/projects/{projectName}/specs/storage.md`

Example: `docs/projects/identity-sdk-v3/architecture.md`

## Key Rules

- **Code is truth**: If docs and code disagree, code wins — update docs.
- **Each level is independent**: A reader should understand Level 1 without reading Levels 2-5.
- **Sensitive data flagged**: Mark PII, credentials, and regulated data in db-schema.md.
- **Diagrams as code**: Use Mermaid for diagrams when possible (version-controlled).
- **Staleness check**: Compare doc version date with last code change. Flag if >2 sprints old.

## Detailed Process

### Level 1: Architecture Overview (architecture.md)

**Step 1**: Analyze tech stack from package.json and create technology inventory

- Document frontend framework (React, Vue, Angular)
- Document backend framework (Node.js, Express, Fastify)
- Document database technology (PostgreSQL, MongoDB, Redis)
- Document key dependencies and their purposes

**Step 2**: Map system boundaries and integrations

- Identify external APIs and services
- Document authentication/authorization approach
- Map data flows between components
- Identify critical performance requirements from PRD-T

**Step 3**: Generate architecture.md using template with specific focus on:

- High-level system diagram (Mermaid)
- Technology decisions and rationale
- Security principles and implementation
- Performance targets and monitoring approach

### Level 2: Database Schema (db-schema.md)

**Step 1**: Analyze ORM files and migrations

- Parse Prisma schema.prisma or TypeORM entities
- Map table relationships and foreign keys
- Identify indexes and constraints
- Document migration history patterns

**Step 2**: Identify sensitive data and compliance requirements

- Flag PII fields (email, name, address)
- Flag regulated data (data templates, financial data)
- Document encryption requirements
- Map GDPR compliance fields (consent, deletion)

**Step 3**: Generate comprehensive schema documentation

- Entity-relationship diagrams
- Table definitions with field descriptions
- Relationship mapping and cardinalities
- Data sensitivity classification

### Level 3: Routes Documentation (specs/routes.md)

**Step 1**: Map frontend routes

- Parse React Router configuration
- Document page components and their purposes
- Map route parameters and query strings
- Identify protected routes and auth requirements

**Step 2**: Map API endpoints

- Parse Express/Fastify route definitions
- Document request/response schemas
- Map authentication and authorization requirements
- Identify rate limiting and validation rules

**Step 3**: Generate unified routes documentation

- Frontend route table with descriptions
- API endpoint documentation with examples
- Authentication flow diagrams
- Error response patterns

### Level 4: Components Documentation (specs/components.md)

**Step 1**: Inventory UI components

- Scan for exported React components
- Document component props and types
- Map component relationships and composition patterns
- Identify shared/reusable components

**Step 2**: Document component behavior

- Map state management patterns (useState, Context, Zustand)
- Document event handlers and side effects
- Identify accessibility implementations
- Map styling approaches and theme usage

**Step 3**: Generate component reference

- Component catalog with usage examples
- Props documentation with types
- State management patterns
- Accessibility compliance notes

### Level 5: Storage Documentation (specs/storage.md)

**Step 1**: Map storage layers

- Document database connections and pooling
- Identify cache layers (Redis, in-memory)
- Map file storage (local, S3, CDN)
- Document state management architecture

**Step 2**: Document data patterns

- Map CRUD operations and repositories
- Document caching strategies
- Identify background job patterns
- Map data validation and sanitization

**Step 3**: Generate storage architecture guide

- Storage layer diagram
- Data flow patterns
- Performance considerations
- Backup and recovery procedures

## Output Template

All generated documents MUST include proper YAML frontmatter following documentation governance standards:

```yaml
---
id: {project-name}-architecture        # or -db-schema, -routes, -components, -storage
version: "1.0.0"                      # semver
last_updated: "YYYY-MM-DD"            # date of generation
updated_by: "TL: {Name}"              # role and name
status: active
type: project
review_cycle: 60                      # days between reviews (project documentation)
next_review: "YYYY-MM-DD"             # calculated: last_updated + review_cycle
owner_role: "TL"                      # Tech Lead maintains architecture docs
---
```

Generated documents locations and their frontmatter IDs:

- **Main architecture**: `docs/projects/{projectName}/architecture.md` → `id: {project-name}-architecture`
- **Database schema**: `docs/projects/{projectName}/db-schema.md` → `id: {project-name}-db-schema`
- **API routes**: `docs/projects/{projectName}/specs/routes.md` → `id: {project-name}-routes`
- **UI components**: `docs/projects/{projectName}/specs/components.md` → `id: {project-name}-components`
- **Storage layer**: `docs/projects/{projectName}/specs/storage.md` → `id: {project-name}-storage`

## Example Output Snippets

### Architecture.md Example

```markdown
# {{PROJECT_NAME}} System Architecture

## Technology Stack

- Frontend: {{FRONTEND_FRAMEWORK}} + TypeScript + {{CSS_FRAMEWORK}}
- Backend: {{BACKEND_RUNTIME}} + {{BACKEND_FRAMEWORK}} + TypeScript
- Database: {{DATABASE_ENGINE}} + {{ORM_FRAMEWORK}}
- Cache: {{CACHE_SYSTEM}}
- Infrastructure: {{CONTAINER_PLATFORM}} + {{ORCHESTRATION_PLATFORM}}

## High-Level Architecture

[Mermaid diagram showing {{SERVICE_TYPE}} and {{DATA_FLOW_PATTERN}}]

## Security Architecture

- Authentication: {{AUTH_METHOD}} with {{TOKEN_STRATEGY}}
- Authorization: {{AUTHZ_MODEL}} with {{PERMISSION_PATTERN}}
- Data Protection: {{ENCRYPTION_STANDARD}} encryption for {{SENSITIVE_DATA_TYPE}}
```

### db-schema.md Example

```markdown
# {{PROJECT_NAME}} Database Schema

## {{ENTITY_NAME}} Table

| Field                 | Type          | Constraints           | Sensitive               |
| --------------------- | ------------- | --------------------- | ----------------------- |
| id                    | {{ID_TYPE}}   | PRIMARY KEY           | No                      |
| email                 | VARCHAR(255)  | UNIQUE, NOT NULL      | PII                     |
| {{SPECIALIZED_FIELD}} | {{DATA_TYPE}} | {{ENCRYPTION_STATUS}} | {{DATA_CLASSIFICATION}} |

## Relationships

- {{ENTITY_A}} (1) → {{ENTITY_B}} (N)
- {{ENTITY_A}} (1) → {{ENTITY_C}} (N)
```

## Quality Criteria

### Completeness Checklist

- [ ] All 5 levels generated and cross-referenced
- [ ] All major technologies documented with versions
- [ ] All sensitive data fields flagged appropriately
- [ ] All external integrations mapped
- [ ] All authentication flows documented
- [ ] Mermaid diagrams render correctly
- [ ] Code examples are syntactically valid
- [ ] All templates filled with actual project data (no placeholders)

### Accuracy Validation

- **Code-Documentation Alignment**: Compare documented APIs with actual route definitions
- **Schema Consistency**: Verify database schema matches ORM definitions
- **Dependency Verification**: Ensure documented packages exist in package.json
- **Version Currency**: Check that documented versions match actual dependencies

### Usability Standards

- **Developer Onboarding**: New team member should understand system in <30 minutes
- **Search-Friendly**: Use consistent terminology and clear headings
- **Update-Friendly**: Each section should be independently maintainable

## Troubleshooting

### Missing Inputs

| Problem                 | Solution                                                    |
| ----------------------- | ----------------------------------------------------------- |
| No PRD-T available      | Use codebase analysis + interviews to infer architecture    |
| Incomplete package.json | Check for monorepo structure, multiple package files        |
| No ORM files            | Look for raw SQL files, database scripts, or manual schemas |
| No route definitions    | Parse manually from controller files or URL patterns        |

### Conflicting Information

| Scenario                 | Resolution                                       |
| ------------------------ | ------------------------------------------------ |
| PRD-T vs actual code     | Code wins - document reality, note discrepancies |
| Multiple ORMs in project | Document all, specify which is primary           |
| Legacy + modern patterns | Document both, create migration plan             |
| Outdated dependencies    | Flag in architecture.md as technical debt        |

### Legacy Codebase Issues

- **No TypeScript**: Document JavaScript patterns, suggest migration path
- **No ORM**: Reverse-engineer schema from SQL files or database introspection
- **Mixed Architectures**: Document each pattern separately with evolution plan
- **Missing Tests**: Note in quality section, don't assume behavior

## Edge Cases

### Microservices Architecture

- Generate separate architecture.md for each service
- Create system-level overview showing service interactions
- Document service boundaries and communication patterns
- Map shared databases and cross-service dependencies

### Monolith with Modules

- Document module boundaries within single architecture.md
- Use directory structure to infer module responsibilities
- Map internal APIs and data sharing patterns
- Identify extraction candidates for future microservices

### Hybrid Mobile/Web

- Document platform-specific components separately
- Map shared business logic and data models
- Document platform-specific storage and caching
- Identify cross-platform testing strategies

### Brownfield Projects

- Start with current state documentation
- Identify technical debt and migration needs
- Document both legacy and target architectures
- Create incremental modernization plan

## Quality Assurance

### Validation Script

This skill includes automated validation via `scripts/validate-examples.ts`:

```bash
# Validate skill examples and structure
npx tsx scripts/validate-examples.ts
```

**Validation includes:**

- Example completeness and correctness
- Architecture documentation compliance patterns
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

## Level 6: Data Model (data-model.md) -- NEW

**Step 1**: Gather entity context from PRD-T and codebase

- Identify core domain entities from system requirements
- Map actors/user types to identity entities
- Determine cross-cutting concerns (multitenancy, RBAC, audit, eventing)

**Step 2**: Analyze entity categories

- Apply required entity categories from template (Tenant, User, Role, Core Domain, Audit, Outbox)
- For each entity: document purpose, fields table, relationships, design decisions
- Use crow's-foot notation for cardinalities

**Step 3**: Generate ERD using Mermaid erDiagram

- Every entity with uuid PK, created/updated timestamps, FK markers
- Verb labels on all relationship lines
- Many-to-many resolved via junction entities

**Output**: `docs/projects/{projectName}/data-model.md`

## Resources

- **Templates**: `templates/architecture.md`, `templates/db-schema.md`, `templates/specs/routes.md`, `templates/specs/components.md`, `templates/specs/storage.md`, `templates/data-model.md`
- **Checklist**: `@../kickoff/checklists/repo-structure.md`
- **Related skills**: `design-doc/` (orchestrates data-model as part of full SDD)
