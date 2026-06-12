---
id: rule-development
version: "1.0.0"
last_updated: "2026-06-12"
updated_by: "TL: meta-tooling consolidation"
status: active
type: reference
review_cycle: 90
next_review: "2026-09-12"
owner_role: "Tech Lead"
---

# Rule Development — Author Behavioral Rules

Generate rule files (`.md`) with correct frontmatter, scope, and content structure to
guide AI behavior in a project. Domain-agnostic — works for any project type, tech stack,
or industry.

> Trigger phrases this reference covers: "generate rule", "create rule file", "create a
> behavioral rule", "claude rule", "ai behavioral guideline", "project rule", "tech-stack
> rule", "org rule", "documentation rule". Use this **when a new project needs behavioral
> guidelines, or when existing rules need updating.** Do NOT use for skill creation
> (`skill-creation-guide.md`), command creation (`command-development.md`), or
> documentation that is not a rule file.

Rules are the **identity layer** of the agent ecosystem — they are loaded (always or
path-scoped) and define the persistent context that shapes every interaction. Source of
truth: `.agents/rules/{category}/{name}.md`. Sync distributes per-platform (Claude
symlink, Cursor `.mdc` copy, Copilot `.instructions.md`, Gemini index, Antigravity
native). See the project `CLAUDE.md` "Rules System Deep Dive" for the per-platform
frontmatter matrix and character target (12,000).

`/lidr-init-project-docs` invokes this skill to scaffold the 5 core SDLC rules; it
produces the rule body and `@`-references, not the inventory bookkeeping in `CLAUDE.md`.

## The 5 standard rule types

| Type            | Required input                          | Optional input                                         |
| --------------- | --------------------------------------- | ------------------------------------------------------ |
| `org`           | Company description, regulatory context | Existing `docs/standards/org.md`, checklists, signoffs |
| `tech-stack`    | Languages, frameworks, DB, CI/CD        | Coding conventions doc, ADRs                           |
| `project`       | Project name, objective, team, domain   | Existing `docs/projects/*.md`, tracking-tool epic      |
| `documentation` | DTC policy decision (yes/no)            | Existing doc governance rules, frontmatter standard    |
| `workflows`     | Commands catalog, roles                 | Existing `rules/workflows.md` from another project     |

## Process

1. **Gather context** in priority order: existing rule (if updating) → `@`-referenced
   docs → project/standards docs → user input. For a new project with no docs, ask for
   company/team description (`org`), tech stack (`tech-stack`), objectives/team
   (`project`).
2. **Generate structure** from `../templates/rule.md`. Every rule needs a header block:

   ```markdown
   # Rule: {Title} — {Context}

   > **Nivel**: {Type} (Nivel 1)
   > **Carga**: SIEMPRE — {why this loads every session}
   > **Propósito**: {one sentence}
   > **Fuente de verdad extendida**: @../../../docs/{path} (if applicable)
   ```

3. **Apply type-specific logic:**
   - `org` — regulatory constraints → bold NEVER/ALWAYS statements; map roles to gates
     and commands; reference checklists/signoffs; classify data sensitivity.
   - `tech-stack` — stack as a technology table; coding conventions per language; naming
     table; testing standards with coverage minimums; Git conventions.
   - `project` — project card (Ficha); domain glossary if specialized; reference
     `docs/projects/{name}.md`; current state (sprint, phase, blockers).
   - `documentation` — DTC policy + enforcement chain; frontmatter requirements; impact
     matrix (change → affected docs); staleness TTLs per artifact type.
   - `workflows` — catalog commands by tier; map roles → authorized commands;
     preconditions per command; command chaining (after X → run Y).
4. **Add `@` references.** Rules are **thin wrappers** — reference `docs/` for extended
   content, never copy-paste full checklists.
   - DO: `> **Fuente de verdad extendida**: @../../../docs/standards/org.md`
   - DON'T: inline the full checklist body into the rule.
5. **Validate** (checklist below) before delivering.

## Validation checklist

- [ ] Header block present (Nivel, Carga, Propósito)
- [ ] `@` references point to files that exist (or will be created)
- [ ] No content duplicated from `docs/`
- [ ] NEVER/ALWAYS constraints are bold uppercase
- [ ] Sections numbered (`## N. Title`)
- [ ] Under the character target (most types; `tech-stack` may be larger — governance
      rules are an intentional exception, see `CLAUDE.md`)
- [ ] No secrets, PII, or credentials
- [ ] Rule type matches one of the 5 standard types

## Output

Deliver: (1) the complete rule `.md` ready to save under `.agents/rules/{category}/`;
(2) a referenced-docs checklist (each `@` reference + whether the target exists); (3) a
note that the `CLAUDE.md` inventory must be updated if this is a new rule (not an update).

## Interaction with commands

| Command                       | How it uses rule authoring                                        |
| ----------------------------- | ----------------------------------------------------------------- |
| `/lidr-init-project-docs`     | Scaffolds the 5 core SDLC rules from project context              |
| `/lidr-validate-project-docs` | Validates existing rules: `@` references valid, content not stale |
| `/lidr-sync-docs`             | Checks rules for drift against their `@`-referenced docs          |

## Anti-patterns

- **Over-long rules** — keep under budget; move detail to `docs/`, reference via `@`.
- **Duplicating `docs/`** — the rule interprets and contextualizes; it does not copy.
- **Missing references** — every rule should reference at least one `docs/` file.
- **Project-specific content in `org.md`** — org is company-wide; project-specific goes
  in `project.md`.
- **Stale rules** — rules have a TTL; flag if approaching expiration.

For the full template (all 5 types), see `../templates/rule.md`. For the per-platform
rule frontmatter and the universal YAML schema, see `architecture-overview.md` and the
project `CLAUDE.md`.
