---
id: ux-design-spec
version: "1.0.1"
last_updated: "2026-03-16"
updated_by: "System: Quality Assurance Integration"
status: active
phase: 0
owner_role: "UX"
automation: false
domain_agnostic: true
description: "Generate a UX Design Specification from PRD Funcional (personas, journeys) and wireframes/mockups. Covers user flows with decision points and error states, interaction patterns, responsive behavior, accessibility (WCAG), and design tokens. Use post-PRD Funcional for initial spec, post-wireframe to enrich with screen detail, pre-Sprint Planning to ensure US have design reference, or when design evolves mid-project. Triggers on create UX spec, design specification, document user flows, UX documentation, screen states, interaction patterns. ALWAYS use when designing user interfaces to align product, design, and engineering teams."
---

# UX Design Specification Generator

Phase: 2-3 — Parallel with PRD Funcional | Language: Spanish

## Workflow

1. Read PRD Funcional: personas, journeys, functionalities
2. Read wireframes/mockups if available (Figma)
3. Define UX design principles for the product domain
4. Generate user flows with decision points, error states, empty states
5. Document interaction patterns, responsive behavior, accessibility
6. Fill template `templates/ux-design-spec.md`

## Input

| Input                              | Required      | Source                        |
| ---------------------------------- | ------------- | ----------------------------- |
| PRD Funcional (personas, journeys) | ✅            | skill `prd-funcional/`        |
| Wireframes / mockups               | Desirable     | Figma                         |
| Existing design system             | If applicable | Design team                   |
| Accessibility requirements         | Desirable     | PRD-T NFRs                    |
| Brand guidelines                   | Desirable     | Marketing / Design            |
| UX design spec template            | ✅            | `templates/ux-design-spec.md` |

## Output Sections

```markdown
# UX Design Specification: [PROJECT]

## 1. Design Principles (3-5 principles for this product)

## 2. Design Tokens (colors, typography, spacing, if no design system)

## 3. User Flows

### Per flow: steps, screens, decision points, error states, empty states

## 4. Screen Inventory (table: screen, URL, components, states)

## 5. Interaction Patterns

### Forms (validation, inline errors, submit behavior)

### Navigation (breadcrumbs, tabs, back behavior)

### Feedback (loading, success, error, empty)

### Data Display (tables, lists, pagination, search, filter)

## 6. Responsive Behavior (breakpoints, layout shifts, touch targets)

## 7. Accessibility (WCAG level, keyboard nav, screen reader, focus management)

## 8. Animation & Motion (purposeful only — loading, transitions, feedback)
```

## Key Rules

- **Every screen has 4+ states**: Default, loading, empty, error (minimum). Plus: partial, success, disabled.
- **Error states are designed**: Not an afterthought. Each form field needs inline validation messaging.
- **Responsive is planned**: Not "it shrinks." Define what changes at each breakpoint.
- **Accessibility is not optional**: WCAG 2.1 AA minimum. Document keyboard nav, focus order, aria labels.
- **Design tokens before screens**: Establish the system first, then apply to screens.
- **Cross-reference journeys**: Each flow maps to a PRD-F journey. Don't invent flows without requirements.

## Resources

- **Template**: `templates/ux-design-spec.md`

## Quality Assurance

### Validation Script

This skill includes automated validation via `scripts/validate-examples.ts`:

```bash
# Validate skill examples and structure
npx tsx scripts/validate-examples.ts
```

**Validation includes:**

- Example completeness and correctness
- UX design specification compliance patterns
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
