---
id: guide-rule-development
version: '1.0.1'
last_updated: '2026-05-15'
updated_by: 'audit-standards skill'
status: active
type: standard
owner_role: 'TL'
review_cycle: 90
next_review: '2026-08-13'
---

# Rule Development for Claude Code

This guide provides the definitive reference for creating, maintaining, and validating **rules** in the Claude Code ecosystem. Rules are context files that define "who we are" before any action is taken. Rules are split into two tiers: **Tier 1** (always loaded) and **Tier 2** (loaded on demand based on globs or description matching).

> **ADR**: La decision de adoptar el modelo de dos tiers esta documentada en `docs/adr/ADR-0001-context-loading-strategy.md`.

## About Rules

Rules are the **identity layer** of the ecosystem. Unlike skills (loaded on demand) or commands (invoked explicitly), rules are persistent context that shapes every AI interaction. They answer the question: **"What must the AI know BEFORE doing anything?"**

### What Rules Provide

1. **Organizational identity** — company values, regulatory constraints, non-negotiable policies
2. **Technical conventions** — stack, patterns, naming, testing standards
3. **Project context** — domain, team, architecture, current state
4. **Documentation governance** — frontmatter, versioning, staleness, DTC enforcement
5. **Workflow orchestration** — who can do what, in what order, with what preconditions

### Rules vs Other Artifacts

| Artifact           | Loading                        | Purpose                                      | Mutability                               |
| ------------------ | ------------------------------ | -------------------------------------------- | ---------------------------------------- |
| **Rules (Tier 1)** | ALWAYS (every session)         | Define identity and constraints              | Low — change when org/project changes    |
| **Rules (Tier 2)** | On-demand (globs/description)  | Provide conventions when relevant            | Low — change when stack/workflows change |
| **Skills**         | On-demand (when task requires) | Provide domain expertise + load docs via `@` | Medium — evolve with practice            |
| **Commands**       | Explicit invocation (`/slash`) | Orchestrate workflows + load docs via `@`    | Medium — expand with new flows           |
| **Hooks**          | Event-driven (automatic)       | Guard and validate                           | Low — change when policies change        |

### The 5 Rule Types (Two Tiers)

Every ecosystem should have these 5 rules. Each type has a distinct responsibility and loading tier:

| Type              | Filename           | Tier   | Carga                        | Answers                            | Reference Pattern                              |
| ----------------- | ------------------ | ------ | ---------------------------- | ---------------------------------- | ---------------------------------------------- |
| **Organization**  | `org.md`           | Tier 1 | SIEMPRE (`alwaysApply`)      | Who are we? What are our policies? | Lean: ruta textual a docs, SIN `@`             |
| **Project**       | `project.md`       | Tier 1 | SIEMPRE (`alwaysApply`)      | What are we building?              | Lean: ruta textual a docs, SIN `@`             |
| **Documentation** | `documentation.md` | Tier 1 | SIEMPRE (`alwaysApply`)      | How do we maintain docs?           | Lean: autocontenida                            |
| **Tech Stack**    | `tech-stack.md`    | Tier 2 | Bajo demanda (`globs`)       | How do we write code?              | Autocontenida, activada por archivos de codigo |
| **Workflows**     | `workflows.md`     | Tier 2 | Bajo demanda (`description`) | Who executes what, when?           | Autocontenida, activada por contexto de tarea  |

#### Tier 1 vs Tier 2

| Aspecto                 | Tier 1 (alwaysApply)                                             | Tier 2 (bajo demanda)                                |
| ----------------------- | ---------------------------------------------------------------- | ---------------------------------------------------- |
| **Formato**             | Markdown plano, sin frontmatter YAML                             | Markdown con frontmatter YAML (description/globs)    |
| **Carga**               | En TODA sesion, sin excepcion                                    | Solo cuando globs/description coinciden con la tarea |
| **Tamano**              | Lo mas lean posible (<200 lineas)                                | Puede ser mas detallada (hasta 400 lineas)           |
| **Referencias a docs/** | Por ruta textual (ej: `docs/checklists/dod.md`), SIN prefijo `@` | Por ruta textual, SIN prefijo `@`                    |
| **Costo**               | Permanente — tokens consumidos SIEMPRE                           | Condicional — solo cuando es relevante               |

**Regla critica**: Las rules de AMBOS tiers NO deben usar `@` para referenciar archivos de `docs/`. El prefijo `@` auto-carga el archivo en contexto, anulando el beneficio del modelo lean. Los skills y commands son responsables de cargar docs via `@`.

## Anatomy of a Rule File

### Required Structure

#### Tier 1 (alwaysApply — sin frontmatter)

```markdown
# Rule: {Title} — {Context}

> **Nivel**: {Organizacional | Tecnico | Proyecto | Rule} (Nivel 1)
> **Carga**: SIEMPRE — {description of when/why this loads}
> **Proposito**: {One sentence: what the AI gains from this rule}

---

## 1. {First major section}

{Content: tables, lists, constraints, policies}
{Referencia a docs por ruta textual: docs/checklists/dod.md (SIN @)}

---

## N. {Final section}

{Content}
```

#### Tier 2 (bajo demanda — con frontmatter YAML)

```markdown
---
description: 'Convenciones de tech stack. Activa cuando se trabaja con codigo TypeScript, React, Node.js.'
globs:
  - '**/*.ts'
  - '**/*.tsx'
---

# Rule: {Title} — {Context}

> **Nivel**: {Tecnico | Workflow} (Nivel 1)
> **Carga**: Bajo demanda — {description of when/why this loads}
> **Proposito**: {One sentence: what the AI gains from this rule}

---

## 1. {First major section}

{Content}
```

### Key Structural Rules

1. **Header block is mandatory** — Nivel, Carga, Proposito
2. **Sections numbered** — Use `## N. Title` for major sections
3. **Tables for structured data** — Policies, roles, conventions use tables
4. **"NEVER/ALWAYS" for non-negotiables** — Use bold uppercase for absolute constraints
5. **Tier 1: No frontmatter YAML** — Rules are plain markdown. The header block with `>` quotes serves as metadata
6. **Tier 2: YAML frontmatter required** — Must include `description` and/or `globs` for on-demand activation
7. **NO `@` references to docs/** — Rules referencian docs por ruta textual (ej: `docs/checklists/dod.md`) pero NUNCA con prefijo `@`. Los skills y commands son responsables de cargar docs via `@`
8. **`@` reservado para rules** — El unico uso valido de `@` en una rule es referenciar OTRA rule del mismo directorio (ej: `@rules/org.md`)

### Referencia a Docs: Ruta Textual (NO `@`)

Rules son **lean** — referencian `docs/` por ruta textual para que la IA sepa donde buscar, pero NO usan `@` que auto-cargaria el archivo en contexto:

```markdown
## Checklists Evaluados por Hooks

La IA evalua automaticamente estos checklists cuando los skills/hooks los cargan:

- docs/checklists/dod.md — cargado por hook dtc-write-guard y skill dev-handoff-qa
- docs/checklists/security-compliance.md — cargado por skill security-checklist
```

**Por que NO usar `@` en rules?** Porque `@` auto-carga el archivo referenciado en CADA sesion que carga esa rule. Con 5 rules referenciando 14 docs, esto consumia ~80k tokens (40% del contexto). Al mover las `@` references a skills/commands, los docs solo se cargan cuando son relevantes para la tarea actual.

**Donde se usan `@` references ahora?**

- En **skills** (`SKILL.md`): cada skill declara `@` a los docs que necesita
- En **commands** (`commands/*.md`): cada command declara `@` a los docs que orquesta
- En **hooks** (prompts): hooks como `dtc-write-guard` cargan checklists via `@`

**Por que `docs/` sigue siendo la fuente de verdad?** Porque skills y commands referencian los mismos archivos `docs/`. Si un checklist cambia, los skills lo cargaran actualizado la proxima vez que se activen.

### Size Guidelines

| Rule Type          | Tier   | Typical Size  | Notes                                            |
| ------------------ | ------ | ------------- | ------------------------------------------------ |
| `org.md`           | Tier 1 | 100-200 lines | Lean — directrices sin `@` a docs                |
| `project.md`       | Tier 1 | 80-150 lines  | Lean — contexto esencial del proyecto            |
| `documentation.md` | Tier 1 | 80-150 lines  | Lean — governance DTC                            |
| `tech-stack.md`    | Tier 2 | 200-400 lines | Detallada — solo se carga con archivos de codigo |
| `workflows.md`     | Tier 2 | 80-150 lines  | Solo se carga cuando se necesita orquestar       |

**Presupuesto de contexto permanente (Tier 1)**: Maximo ~500 lineas entre las 3 rules Tier 1. Esto equivale a ~20k tokens (~10% del contexto).
**Presupuesto Tier 2**: Mas flexible ya que no se cargan siempre, pero mantener bajo 550 lineas combinadas.

## Rule Creation Process

### For New Projects

When starting a new project, use the `/init-project-docs` command which invokes the `generate-rule` skill to create the initial 5 rules:

```
/init-project-docs {project-name}
  -> Step: Generate rules/ from project context
     -> Skill: generate-rule (type=org)
     -> Skill: generate-rule (type=tech-stack)
     -> Skill: generate-rule (type=project)
     -> Skill: generate-rule (type=documentation)
     -> Skill: generate-rule (type=workflows)
```

### For Existing Projects

To add rules to a project that started without them:

1. Run `generate-rule` skill for each of the 5 types
2. Provide project context: tech stack, team structure, domain, existing docs
3. Review generated rules — the AI generates drafts, the human validates
4. Place rules in `.claude/rules/` directory

### Manual Creation (7 Steps)

1. **Identify the type** — Which of the 5 rule types are you creating?
2. **Determine the tier** — Tier 1 (alwaysApply, critical identity) or Tier 2 (on-demand, conditional context)?
3. **Gather sources** — What `docs/` files are relevant? Note their paths for textual references
4. **Write header block** — Nivel, Carga, Proposito. For Tier 2, add YAML frontmatter with `description`/`globs`
5. **Write content** — Use the template (`docs/templates/rule.md`) as starting point. Keep lean.
6. **Add path references** — Reference `docs/` by textual path (ej: `docs/checklists/dod.md`), NEVER with `@` prefix. Ensure corresponding skills/commands declare `@` to those docs.
7. **Validate** — Run `/validate-project-docs` to check references and completeness

## Rule Maintenance

### Staleness Detection

Rules have a **180-day TTL** (defined in `rules/documentation.md`). After 180 days without update:

| Action                | Who        | How                                                         |
| --------------------- | ---------- | ----------------------------------------------------------- |
| Review content        | TL (owner) | Manual review + `/validate-project-docs`                    |
| Check `@` references  | docs-agent | Verify referenced `docs/` files still exist and are current |
| Update `last_updated` | TL         | After review, even if no changes needed                     |

### When to Update Rules

| Trigger                   | Rule(s) Affected      | Who Updates |
| ------------------------- | --------------------- | ----------- |
| New team member role      | `org.md`              | PME         |
| Tech stack change         | `tech-stack.md`       | TL          |
| New project phase         | `project.md`          | TL / PO     |
| New doc governance policy | `documentation.md`    | TL          |
| New command or workflow   | `workflows.md`        | TL          |
| New checklist or signoff  | `org.md` (references) | QA / Sec    |
| Regulatory change         | `org.md`              | Sec / PME   |

### DTC Rule: Rules Are Docs Too

Per the DTC (Docs Travel with Code) policy:

- When a rule changes, **CLAUDE.md must be updated** in the same PR
- When a `docs/` file referenced by a rule changes, verify the rule still makes sense
- The `dtc-write-guard` hook monitors rule files in `.claude/rules/`

## Validation Checklist

Use this checklist when creating or reviewing a rule:

- [ ] Header block present: Nivel, Carga, Proposito
- [ ] Tier correctly assigned: Tier 1 (alwaysApply, sin frontmatter) o Tier 2 (description/globs, con frontmatter YAML)
- [ ] NO `@` references to `docs/` files — only textual path references
- [ ] `@` references (if any) only point to other rules in the same directory
- [ ] No content duplicated from `docs/` — uses path references instead
- [ ] Corresponding skills/commands declare `@` to the docs this rule references by path
- [ ] NEVER/ALWAYS constraints are bold and uppercase
- [ ] Sections are numbered (`## N. Title`)
- [ ] Total size reasonable (Tier 1: under 200 lines, Tier 2: under 400 lines)
- [ ] No secrets, PII, or credentials in rule content
- [ ] Rule type is one of the 5 standard types
- [ ] Referenced checklists/signoffs exist in `docs/`

## Common Anti-Patterns

| Anti-Pattern                          | Problem                                                     | Fix                                                                             |
| ------------------------------------- | ----------------------------------------------------------- | ------------------------------------------------------------------------------- |
| Duplicating `docs/` content           | Drift when source changes                                   | Reference by path text, let skills load via `@`                                 |
| Rule over 400 lines                   | Eats context window                                         | Move details to `docs/`, reference by path text                                 |
| Mixing rule types                     | Confusing ownership                                         | One responsibility per rule file                                                |
| Hardcoded project details in `org.md` | Breaks when project changes                                 | Project-specific content goes in `project.md`                                   |
| Using YAML frontmatter in Tier 1      | Inconsistent with convention                                | Tier 1 rules use `>` header blocks, not YAML                                    |
| Missing YAML frontmatter in Tier 2    | Rule loads always instead of on-demand                      | Tier 2 rules MUST have `description` and/or `globs` in YAML frontmatter         |
| **Using `@docs/` in rules**           | **Eats context on every session (~80k tokens for 14 docs)** | **Reference by path text without `@`, let skills/commands load docs on demand** |
| No path references at all             | Rule becomes stale island, AI cannot find docs              | Always include textual path references to relevant `docs/` files                |

## Relation to Other Artifacts

| When creating a rule... | Also update...                                       |
| ----------------------- | ---------------------------------------------------- |
| Any rule                | `CLAUDE.md` (inventario)                             |
| `org.md`                | `docs/standards/org.md` (source of truth)            |
| `workflows.md`          | `rules/workflows.md` reflects commands catalog       |
| New rule type (rare)    | `CLAUDE.md`, HelpCenter, SitemapView, IntegrityTests |

## Example: Tier 1 Rule (alwaysApply)

```markdown
# Rule: Contexto del Proyecto — Mi Proyecto

> **Nivel**: Proyecto (Nivel 1)
> **Carga**: SIEMPRE — la IA necesita este contexto para entender en que proyecto trabaja.
> **Proposito**: Define el dominio, equipo y estado actual del proyecto.

---

## 1. Ficha del Proyecto

| Campo           | Valor                    |
| --------------- | ------------------------ |
| **Nombre**      | Mi Proyecto              |
| **Codigo Jira** | PROJ-100                 |
| **Objetivo**    | Descripcion del objetivo |
| **Tech Lead**   | Lead Engineer            |
| **Estado**      | En ejecucion             |

---

## 2. Stack Tecnico

Convenciones detalladas en: docs/standards/tech-stack.md (cargado por rule tech-stack.md cuando se trabaja con codigo)

| Capa     | Tecnologia         |
| -------- | ------------------ |
| Frontend | React + TypeScript |
| Backend  | Node.js + Express  |
| DB       | PostgreSQL         |

---

## 3. Reglas del Proyecto

- Todo PR requiere 1 reviewer minimo
- Deploy a produccion requiere Gate 7 PASS
- Datos biometricos: ver docs/checklists/security-compliance.md (cargado por skill security-checklist)
```

## Example: Tier 2 Rule (bajo demanda con globs)

```markdown
---
description: 'Convenciones de tech stack para TypeScript, React, Node.js. Activa cuando se trabaja con codigo.'
globs:
  - '**/*.ts'
  - '**/*.tsx'
  - '**/*.js'
  - '**/*.jsx'
---

# Rule: Tech Stack — Convenciones de Codigo

> **Nivel**: Tecnico (Nivel 1)
> **Carga**: Bajo demanda — se activa al trabajar con archivos de codigo.
> **Proposito**: Define convenciones de codigo que la IA debe seguir.

---

## 1. TypeScript

- Strict mode siempre habilitado
- ESM imports, no CommonJS
- Interfaces sobre types para objetos publicos

---

## 2. React

- Functional components con hooks
- Server Components por defecto (Next.js App Router)
```
