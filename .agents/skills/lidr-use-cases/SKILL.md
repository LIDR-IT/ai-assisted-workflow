---
id: use-cases
version: "1.1.0"
last_updated: "2026-04-06"
updated_by: "System: Phase 4 Python Script Remediation"
status: active
phase: 2
owner_role: "PO"
automation: false
domain_agnostic: true
description: >
  Generate the 3 main use cases for any software system, each with a description and a
  Mermaid flowchart diagram. Domain-agnostic -- works for any industry and tech stack.
  Use during Discovery phase to document core system interactions before generating
  functional requirements. Provides traceability link between PRD and RFs. Trigger
  phrases: "generate use cases", "write the use cases section", "create use case diagrams",
  "document system interactions", "analyze use cases". ALWAYS use this skill -- do not
  produce use cases without reading it first.
---

# Use Case Generator

Phase: 2 -- Discovery | Gate: 1 (with PRD-F/PRD-T) | Language: English | Domain: Any

## Workflow

1. **Gather System Context**: Collect system name, workflow stages, actors, and constraints
2. **Select Use Cases**: Apply selection rule to identify 3 most important use cases
3. **Document Each Use Case**: Write description paragraph with actors, trigger, flow, outcome
4. **Generate Diagrams**: Create Mermaid flowchart TD diagram for each use case
5. **Apply Styling**: Apply classDef styles for actors, system, decisions, outcomes
6. **Quality Validation**: Verify completeness against quality bar checklist

## Input Contract

Before generating anything, confirm the following:

| Field           | Required | Notes                                            |
| --------------- | -------- | ------------------------------------------------ |
| System name     | Yes      | The product or platform name                     |
| Workflow stages | Yes      | Ordered list of the system's main pipeline steps |
| Actors          | Yes      | All roles that interact with the system          |
| Key constraints | No       | Compliance, SSO, RBAC, entitlements, etc.        |

If required fields are missing, ask for them before proceeding.

## Selection Rule

Choose the three use cases that together cover:

1. **Primary happy path** through the system's core workflow (the thing the system is fundamentally built for)
2. **Most complex actor interaction** -- multi-actor, multi-step, with a decision point
3. **Compliance/security critical** -- the use case most critical for compliance, security, or data integrity

If the user explicitly names three use cases, use those instead.

## Output Location

Generated documents should be saved to: **`docs/projects/{projectName}/use-cases.md`**

Example: `docs/projects/identity-sdk-v3/use-cases.md`

## Output Structure

For each use case, produce in order using the template at `templates/use-cases.md`:

### [Number]. [Use Case Title]

**Description** -- one paragraph covering:

- Actor(s) involved
- Trigger (what initiates the use case)
- Main flow (the key steps in order)
- Outcome (the system state after completion)
- Notable constraints or business rules that apply

**Diagram** -- a Mermaid `flowchart TD` diagram with these rules:

- Actors appear as nodes outside the system boundary subgraph
- The system boundary is a labeled `subgraph`
- All steps inside the boundary are rectangular nodes
- Decision points use diamond shape: `{Decision text}`
- Happy path is the primary flow; alternative paths branch off and rejoin or terminate
- Use `classDef` to style:
  - Actors: `fill:#E1F5EE,stroke:#0F6E56,color:#085041`
  - System steps: `fill:#E6F1FB,stroke:#185FA5,color:#0C447C`
  - Decision nodes: `fill:#FAEEDA,stroke:#854F0B,color:#633806`
  - Terminal/outcome nodes: `fill:#F1EFE8,stroke:#5F5E5A,color:#444441`
- Diagram inside a fenced ```mermaid block
- No em-dashes, no special Unicode characters
- No trailing whitespace on `class` or `classDef` lines

## Output Template

All generated documents MUST include proper YAML frontmatter:

```yaml
---
id: {project-name}-use-cases
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

- **Exactly three use cases**: No more, no less (unless user specifies otherwise)
- **Selection rule compliance**: Cover happy path + complex interaction + compliance/security
- **Diagram completeness**: Each diagram includes actors, system boundary, decisions, outcomes
- **Styling consistency**: All classDef styles applied correctly across all diagrams
- **Mermaid syntax**: No em-dashes, no trailing whitespace, valid flowchart TD
- **Traceability**: Each use case maps to future RFs (skill `generate-rf/`)
- **Domain-agnostic**: Use generic language, no hardcoded industry terms

## Traceability Integration

Use cases provide the bridge between PRD and Functional Requirements:

```
PRD (Funcional + Tecnico) --> Use Cases --> RFs (with BDD) --> User Stories
```

Each use case should be traceable to:

- **Upstream**: PRD-F user journeys and PRD-T capabilities
- **Downstream**: RFs generated by `generate-rf/` skill

## Quality Bar

Before outputting, verify:

- [ ] Exactly three use cases produced
- [ ] Each use case has a description paragraph and a diagram
- [ ] Diagrams include actors, system boundary subgraph, decision points, and outcome
- [ ] All `classDef` styles applied correctly
- [ ] No placeholder text anywhere
- [ ] Mermaid syntax is valid (no em-dashes, no trailing whitespace)
- [ ] Selection rule criteria covered (happy path + complex + compliance)

## Quality Assurance

### Validation Script

This skill includes automated validation via `scripts/validate-examples.ts`:

```bash
# Validate skill examples and structure
npx tsx scripts/validate-examples.ts
```

**Validation includes:**

- Use case count and structure compliance
- Mermaid diagram syntax and styling
- Actor and system boundary presence
- ClassDef style application

**Integration with ecosystem:**

- Used by `/multi-agent-audit` for ecosystem validation
- Supports quality gates in SDLC workflow

## Changelog

| Version | Date       | Author                                    | Changes                                                                                                                                                                                                                                                                                                                                                      |
| ------- | ---------- | ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1.1.0   | 2026-04-06 | System: Phase 4 Python Script Remediation | Complete domain-agnostic remediation: example-identity-verification.md completely rewritten with template variables ({{PRIMARY_WORKFLOW}}, {{VERIFICATION_TYPE}}, {{VERIFICATION_DATA}}, {{SENSITIVE_DATA_TYPE}}, etc.) replacing all biometric-specific terminology. Achieving 72→92/100 target score through comprehensive template variable architecture. |
| 1.0.0   | 2026-03-26 | TL: ecosystem-integration                 | Initial version with domain-agnostic architecture                                                                                                                                                                                                                                                                                                            |

---

## Resources

- **Template**: `templates/use-cases.md`
- **Upstream skills**: `business-model/`, `prd-funcional/`, `prd-tecnico/`
- **Downstream skills**: `generate-rf/` (functional requirements from use cases)
