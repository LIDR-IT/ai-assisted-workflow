---
name: lidr-generate-rule
id: generate-rule
version: "1.3.0"
last_updated: "2026-06-09"
updated_by: "TL: BMad-coherence batch-fix"
status: active
phase: 0
owner_role: "TL"
automation: false
domain_agnostic: true
language_default: en
integrations: []
description: >
  Generate Claude Code rule files (.md) with correct frontmatter, scope, and content structure to guide AI behavior in a project.
  Domain-agnostic — works for any project type, technology stack, or industry.
  Use for creating organizational rules, project context rules, tech-stack conventions, workflow orchestration maps, and documentation governance rules.
  Essential when a new project needs Claude Code behavioral guidelines or when existing rules need updating.
  Always use when setting up a new .claude/ ecosystem, always use when defining how Claude should behave for a specific project or team.
  Do NOT use for skill creation (use bmad-workflow-builder), for command creation (use command-development), or for documentation that is not a rule file.
  Triggers on "generate rule", "create rule file", "claude rule", "ai behavioral guideline", "project rule", "tech-stack rule", "org rule", "documentation rule".
  Content authored in English; artifact language follows the client `language` setting (see `_shared/lidr/integrations/`).
  Audience: Tech Lead (creates and owns rules), Developer (follows rules automatically).
---

# Skill: generate-rule

## Purpose

Generate well-structured rule files for the `.claude/rules/` directory. Rules are the **identity layer** of the Claude Code ecosystem — they are ALWAYS loaded and define the persistent context that shapes every AI interaction.

## When to Use

- Setting up a new project with `/init-project-docs`
- Adding Claude Code to an existing project
- Updating rules after organizational changes (new policies, team restructuring)
- Updating rules after technical changes (stack migration, new conventions)
- Periodic rule review (180-day TTL staleness check)

## Inputs Required

### Mandatory

1. **Rule type** — One of: `org`, `tech-stack`, `project`, `documentation`, `workflows`
2. **Project name** — Identifier for the project

### Per Rule Type

| Type            | Required Input                                | Optional Input                                         |
| --------------- | --------------------------------------------- | ------------------------------------------------------ |
| `org`           | Company description, regulatory context       | Existing `docs/standards/org.md`, checklists, signoffs |
| `tech-stack`    | Tech stack (languages, frameworks, DB, CI/CD) | Coding conventions doc, ADRs                           |
| `project`       | Project name, objective, team, domain         | Existing `docs/projects/*.md`, Jira epic               |
| `documentation` | DTC policy decision (yes/no)                  | Existing doc governance rules, frontmatter standard    |
| `workflows`     | Commands catalog, roles                       | Existing `rules/workflows.md` from another project     |

## Process

### Step 1: Gather Context

Read available sources in this priority order:

1. **Existing rule** (if updating) — `.claude/rules/{type}.md`
2. **Referenced docs** — Files mentioned via `@` in existing rule
3. **Project docs** — `docs/projects/*.md`, `docs/standards/*.md`
4. **User input** — Direct answers to questions

If creating for a new project and no docs exist yet, ask the user for:

- Company/team description (for `org`)
- Tech stack details (for `tech-stack`)
- Project objectives and team (for `project`)

### Step 2: Generate Rule Structure

Use the template from `templates/rule.md` as the structural base.

Every rule MUST have:

```markdown
# Rule: {Title} — {Context}

> **Nivel**: {Type} (Nivel 1)
> **Carga**: SIEMPRE — {why this loads every session}
> **Proposito**: {one sentence}
> **Fuente de verdad extendida**: @../../../docs/{path} (if applicable)
```

### Step 3: Apply Type-Specific Logic

#### For `org` rules:

- Extract regulatory constraints → NEVER/ALWAYS statements
- Map roles to gates and commands
- Reference `@../skills/{skill-name}/checklists/*` and `@../skills/{skill-name}/signoffs/*`
- Include data sensitivity classification

#### For `tech-stack` rules:

- Map stack as technology table (Capa | Tecnologia | Version | Notas)
- Extract coding conventions per language/framework
- Define naming conventions table
- Define testing standards with coverage minimums
- Define Git conventions (branch strategy, commit format)

#### For `project` rules:

- Create project card (Ficha) with key fields
- Define domain glossary if specialized
- Reference `@../../../docs/projects/{name}.md` for extended context
- Include current state (sprint, phase, blockers)

#### For `documentation` rules:

- Define DTC policy and enforcement chain
- Specify frontmatter requirements
- Create impact matrix (change → affected docs)
- Define staleness TTLs per artifact type

#### For `workflows` rules:

- Catalog all commands by tier
- Map roles to authorized commands
- Define preconditions per command
- Document command chaining (after X → run Y)

### Step 4: Add `@` References

Rules are **thin wrappers** — they MUST reference `docs/` for extended content:

- **DO**: `> **Fuente de verdad extendida**: @../../../docs/standards/org.md`
- **DO**: `Ver @../../pr-description/checklists/dod.md para criterios detallados`
- **DON'T**: Copy-paste the full checklist content into the rule

Example updated references:

- **DO**: `Ver @../pr-description/checklists/dod.md para criterios detallados`
- **DO**: `Referencia: @../test-execution-report/signoffs/qa-signoff.md`

### Step 5: Validate

Run this checklist before delivering:

- [ ] Header block present (Nivel, Carga, Proposito)
- [ ] `@` references point to files that exist (or will be created)
- [ ] No content duplicated from `docs/`
- [ ] NEVER/ALWAYS constraints are bold uppercase
- [ ] Sections numbered (`## N. Title`)
- [ ] Under 300 lines (for most types; `tech-stack` may be up to 400)
- [ ] No secrets, PII, or credentials
- [ ] Rule type matches one of the 5 standard types

## Output Format

Deliver:

1. **The rule file** — Complete `.md` ready to save to `.claude/rules/{type}.md`
2. **Referenced docs checklist** — List of `@` references and whether the target doc exists
3. **CLAUDE.md update** — If this is a new rule (not an update), note that CLAUDE.md inventory must be updated

## Interaction with Commands

| Command                  | How it uses generate-rule                                           |
| ------------------------ | ------------------------------------------------------------------- |
| `/init-project-docs`     | Calls generate-rule 5 times (once per type) to create initial rules |
| `/validate-project-docs` | Validates existing rules: `@` references valid, content not stale   |
| `/sync-docs`             | Checks rules for drift against their `@` referenced docs            |

## Anti-Patterns to Avoid

- **Over-long rules**: Keep under budget. Move detail to `docs/`, reference via `@`
- **Duplicating docs/**: The rule interprets and contextualizes; it does not copy
- **Missing references**: Every rule should reference at least one `docs/` file
- **Project-specific content in org.md**: Org is company-wide; project-specific goes in project.md
- **Stale rules**: Rules have 180-day TTL. Flag if approaching expiration

## Quality Assurance

### Validation Script

This skill includes automated validation via `scripts/validate-examples.ts`:

```bash
# Validate skill examples and structure
npx tsx scripts/validate-examples.ts
```

**Validation includes:**

- Example completeness and correctness
- Claude Code rule structure compliance patterns
- Progressive disclosure adherence
- Resource organization standards

**When to use:**

- Before skill release/packaging
- In CI/CD pipeline (quality gates)
- After major example updates
- During skill maintenance cycles

**Integration with ecosystem:**

- Used by `bmad-eval-runner` for ecosystem validation
- Supports quality gates in SDLC workflow
- Provides consistent validation across all skills

## Changelog

| Version | Date       | Author                                | Changes                                                                                                       |
| ------- | ---------- | ------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| 1.3.0   | 2026-06-09 | TL: BMad-coherence batch-fix          | Added `language_default: en` + `integrations: []`; reframed language to English-authored, client-configurable |
| 1.2.0   | 2026-03-16 | System: Quality Assurance Integration | Quality assurance integration                                                                                 |
