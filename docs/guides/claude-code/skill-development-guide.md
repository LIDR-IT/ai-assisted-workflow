---
id: guide-skill-development
version: "1.0.0"
last_updated: "2026-03-17"
updated_by: "TL: Self-Contained Architecture Migration"
status: active
type: guide
review_cycle: 60
next_review: "2026-05-16"
owner_role: "Tech Lead"
---

# Skill Development for Claude Code Plugins

This skill provides guidance for creating effective skills for Claude Code plugins.

## About Skills

Skills are modular, self-contained packages that extend Claude's capabilities by providing specialized knowledge, workflows, and tools. Think of them as "onboarding guides" for specific domains or tasks.

### What Skills Provide

1. Specialized workflows - Multi-step procedures for specific domains
2. Tool integrations - Instructions for working with specific file formats or APIs
3. Domain expertise - Company-specific knowledge, schemas, business logic
4. Bundled resources - Scripts, references, and assets for complex and repetitive tasks

### Anatomy of a Skill

```
skill-name/
├── SKILL.md (required)
│   ├── YAML frontmatter metadata (required)
│   │   ├── name: (required)
│   │   └── description: (required)
│   └── Markdown instructions (required)
└── Bundled Resources (optional)
    ├── scripts/          - Executable code (Python/Bash/etc.)
    ├── references/       - Documentation loaded into context as needed
    └── assets/           - Files used in output (templates, icons, fonts, etc.)
```

### Progressive Disclosure (3 niveles)

1. **Metadata (name + description)** - Always in context (~100 words)
2. **SKILL.md body** - When skill triggers (<5k words)
3. **Bundled resources** - As needed by Claude (unlimited)

## Skill Creation Process (6 Steps)

1. **Understand** — Identify concrete examples of skill usage
2. **Plan** — Determine what scripts/references/examples needed
3. **Create** — `mkdir -p skills/skill-name/{references,examples,scripts}`
4. **Write SKILL.md** — Frontmatter (3rd person) + lean body (1500-2000 words, imperative form)
5. **Validate** — Check description quality, writing style, progressive disclosure
6. **Iterate** — Improve based on real usage

## Template Strategy: SELF-CONTAINED ⭐

> **ADR**: `docs/adr/ADR-0001-context-loading-strategy.md`
> **Migration**: Templates (28→skills), Checklists (8→skills), Signoffs (2→skills)

### Principio de Inmutabilidad de Templates

Los skills ahora incluyen sus propios templates **INMUTABLES** — no referencian `docs/templates/` externamente.

```
✅ CORRECTO: skills/adr/templates/adr.md (template local inmutable)
❌ INCORRECTO: @../../../docs/templates/adr.md (central templates/ no longer exists)
```

### Estructura Self-Contained

```
skills/business-case/
├── SKILL.md                    # Instrucciones del skill
├── templates/                  # Templates INMUTABLES (nunca cambiar)
│   ├── business-case.md        # Formato estándar del Business Case
│   └── business-justification.md
├── checklists/                 # Checklists INMUTABLES
│   ├── business-validation.md  # Criterios de validación
│   └── stakeholder-approval.md
├── examples/                   # Ejemplos para context
│   └── fintech-example.md
└── validators/                 # Scripts de validación
    └── business_case_validator.py
```

### Output Locations: docs/projects/{proyecto}/

Los skills generan documentos específicos del proyecto en:

```
docs/projects/mi-proyecto/
├── business-case.md            # Generado desde skills/business-case/templates/
├── architecture.md             # Generado desde skills/architecture-doc/templates/
├── requirements/               # Generado desde skills/generate-rf/
│   ├── functional-requirements.md
│   └── non-functional-requirements.md
└── testing/                    # Generado desde skills/test-plan/
    ├── test-plan.md
    └── test-cases.md
```

### Separación Clara: Inmutable vs Mutable

| Ubicación                   | Tipo                       | Propósito                   | Modificable |
| --------------------------- | -------------------------- | --------------------------- | ----------- |
| `skills/*/templates/`       | **Template INMUTABLE**     | Formato estándar, esqueleto | ❌ NUNCA    |
| `skills/*/checklists/`      | **Checklist INMUTABLE**    | Criterios estándar          | ❌ NUNCA    |
| `docs/projects/{proyecto}/` | **Documento del proyecto** | Contenido real específico   | ✅ SÍ       |

### Beneficios del Patrón Self-Contained

1. **Portabilidad**: Copiar `.claude/` → ecosistema completo funcional
2. **Inmutabilidad**: Templates nunca cambian, garantizan consistencia
3. **Separación**: Templates (esqueleto) vs documentos (contenido)
4. **Sin dependencias**: Cada skill es autónomo
5. **Escalabilidad**: Fácil distribución entre equipos/proyectos

## Key Rules

- **Description**: Third-person with specific trigger phrases
- **Body**: Imperative/infinitive form, NOT second person
- **Size**: 1,500-2,000 words ideal, details in references/
- **References**: Use local templates/ and checklists/ within skill, output to docs/projects/{proyecto}/

## Validation Checklist

- [ ] SKILL.md has valid YAML frontmatter with name + description
- [ ] Description uses third person with trigger phrases
- [ ] Body uses imperative form (<3,000 words)
- [ ] Detailed content in references/
- [ ] Examples are complete and working
- [ ] Scripts are executable
- [ ] Local templates/ and checklists/ included within skill (no external dependencies)
- [ ] Output targets docs/projects/{proyecto}/ path correctly
- [ ] Templates are immutable formats (skeleton only, no project-specific content)

---

## Changelog

| Versión | Fecha      | Autor                                     | Cambios                                                                                          |
| ------- | ---------- | ----------------------------------------- | ------------------------------------------------------------------------------------------------ |
| 1.0.0   | 2026-03-17 | TL: Self-Contained Architecture Migration | Reemplazado patrón @ dependencies con self-contained templates, documentado estructura inmutable |
| 0.1.0   | 2026-03-07 | TL: Lead Engineer                         | Versión inicial del skill development guide                                                      |
