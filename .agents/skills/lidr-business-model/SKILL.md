---
name: lidr-business-model
id: business-model
version: "1.0.0"
last_updated: "2026-03-26"
updated_by: "TL: ecosystem-integration"
status: active
phase: 1
owner_role: "PO"
automation: false
domain_agnostic: true
description: >
  Generate a Business Model section for any software system, including system description,
  competitive advantages, feature inventory, and Lean Canvas diagram. Domain-agnostic --
  works for any industry and tech stack. Use when creating product documentation, startup
  pitches, or business model analysis. Complements business-case (ROI/financial) with
  strategic model (Lean Canvas/value proposition). Trigger phrases: "generate business model",
  "write the business model section", "create lean canvas", "document competitive advantages",
  "business model canvas". ALWAYS use this skill -- do not produce a business model without
  reading it first.
---

# Business Model Generator

Phase: 1 -- Origination | Gate: 0 (with Business Case) | Language: English | Domain: Any

## Workflow

1. **Gather System Context**: Collect system name, description, target market, actors, and key features
2. **Analyze Value Proposition**: Identify unique differentiators and competitive advantages
3. **Map Feature Inventory**: Document all major features with descriptions
4. **Generate Lean Canvas**: Create Mermaid diagram with all 9 Lean Canvas cells
5. **Quality Validation**: Verify completeness against quality bar checklist
6. **Output Generation**: Produce complete Business Model section using template

## Input Contract

Before generating anything, confirm the following from the user or conversation context:

| Field               | Required | Notes                                                  |
| ------------------- | -------- | ------------------------------------------------------ |
| System name         | Yes      | The product or platform name                           |
| What it does        | Yes      | One paragraph description of the system                |
| Target market       | Yes      | Who buys or uses the system (buyer + end-user persona) |
| Main actors / users | Yes      | Roles interacting with the system                      |
| Key features        | Yes      | At least 5 feature areas                               |
| Deployment model    | No       | Default: B2B SaaS, API-first, multitenant              |
| Competitive context | No       | Known alternatives or differentiators                  |

If required fields are missing, ask for them before proceeding.

## Output Location

Generated documents should be saved to: **`docs/projects/{projectName}/business-model.md`**

Example: `docs/projects/identity-sdk-v3/business-model.md`

## Output Structure

Produce the following sections in order using the template at `templates/business-model.md`:

### 1. System Description

Two to three paragraphs covering:

- What the system is and what problem it solves
- Target market (buyer persona and end-user persona)
- Deployment model (B2B SaaS, API-first, multitenant, etc.)

### 2. Added Value and Competitive Advantages

A bullet list of at least five distinct, specific advantages. Each bullet must be one concrete differentiator -- not a generic claim. Examples of expected specificity:

- "API-first design lets platform teams embed features without owning pipeline logic"
- "Compliance-native architecture built into the data model, not bolted on"

### 3. Main Features

A markdown table with columns: `Feature`, `Description`.
Minimum coverage: all major workflow stages, RBAC, SSO/federation, event streaming, multitenancy, audit/compliance.

### 4. Lean Canvas

Render as a Mermaid `graph TB` diagram using one labeled subgraph per Lean Canvas cell.
The nine cells are:

1. Problem
2. Customer Segments
3. Unique Value Proposition
4. Solution
5. Channels
6. Revenue Streams
7. Cost Structure
8. Key Metrics
9. Unfair Advantage

Rules:

- Every cell must contain 2-4 bullet points of real, system-specific content
- No generic placeholders ("insert value here", "TBD")
- Use plain hyphens only -- no em-dashes, no special Unicode characters
- The diagram must be inside a fenced ```mermaid block

## Output Template

All generated documents MUST include proper YAML frontmatter:

```yaml
---
id: {project-name}-business-model
version: "1.0.0"
last_updated: "YYYY-MM-DD"
updated_by: "PO: {Name}"
status: active
type: project
review_cycle: 60
next_review: "YYYY-MM-DD"
owner_role: "PO"
---
```

## Key Rules

- **Specificity over genericity**: Every advantage and feature must be concrete and system-specific
- **Lean Canvas completeness**: All 9 cells with 2-4 real bullet points each
- **Mermaid syntax**: No em-dashes, no trailing whitespace on class lines, valid graph TB
- **No placeholders**: Zero instances of "TBD", "insert here", or generic filler
- **Domain-agnostic language**: Use `{{VARIABLE}}` placeholders for domain-specific terms in templates
- **Complements business-case**: Business model = strategic positioning; business-case = financial justification

## Quality Bar

Before outputting, verify:

- [ ] All four sub-sections are present and complete
- [ ] Lean Canvas has all 9 cells with real content
- [ ] No placeholder text anywhere
- [ ] Mermaid block is syntactically valid
- [ ] Language is direct and professional -- no filler phrases
- [ ] At least 5 competitive advantages listed
- [ ] Feature table covers all major system capabilities

## Quality Assurance

### Validation Script

This skill includes automated validation via `scripts/validate-examples.ts`:

```bash
# Validate skill examples and structure
npx tsx scripts/validate-examples.ts
```

**Validation includes:**

- Example completeness and correctness
- Business model section compliance (4 sections)
- Lean Canvas completeness (9 cells)
- Mermaid syntax validation

**Integration with ecosystem:**

- Used by `/multi-agent-audit` for ecosystem validation
- Supports quality gates in SDLC workflow

## Resources

- **Template**: `templates/business-model.md`
- **Related skill**: `business-case/` (financial justification, ROI analysis)
- **Downstream**: `use-cases/` (use case analysis from business model context)
