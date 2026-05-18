---
id: design-doc
version: "1.0.0"
last_updated: "2026-03-26"
updated_by: "TL: ecosystem-integration"
status: active
phase: 2
owner_role: "TL"
automation: false
domain_agnostic: true
description: >
  Orchestrate the generation of a complete Software Design Document by running specialist
  skills in sequence and assembling their output into a single self-contained markdown file.
  Domain-agnostic -- works for any industry and tech stack. Use when a comprehensive design
  document is needed combining business model, use cases, data model, and system architecture.
  Trigger phrases: "generate full documentation", "create full design doc", "generate design
  document", "run all design skills", "generate everything", "complete software design",
  "SDD generation". ALWAYS use this skill -- do not orchestrate multi-skill document
  generation without reading it first.
---

# Software Design Document Orchestrator

Phase: 2 -- Discovery | Gate: 1 (comprehensive design documentation) | Language: English | Domain: Any

## Workflow

1. **Confirm Context**: Restate system context and get user confirmation
2. **Run Skills in Sequence**: Invoke each specialist skill with full context
3. **Assemble Document**: Combine all section outputs into single markdown file
4. **Quality Check**: Verify all sections present, no placeholders, valid Mermaid
5. **Deliver**: Output complete assembled document with summary

## Skills Invoked (in order)

| Order | Skill                           | Section        | Output                                                   |
| ----- | ------------------------------- | -------------- | -------------------------------------------------------- |
| 1     | `business-model`                | Business Model | System description, advantages, features, Lean Canvas    |
| 2     | `use-cases`                     | Use Cases      | 3 use cases with Mermaid flowchart diagrams              |
| 3     | `architecture-doc` (data-model) | Data Model     | Entity analysis + Mermaid ERD                            |
| 4     | `prd-tecnico` (system-design)   | System Design  | Architecture overview + microservice inventory + diagram |

## Input Contract

Before starting, confirm the following system context. If any required field is missing, ask for it once -- do not proceed with gaps.

| Field                  | Required | Notes                                              |
| ---------------------- | -------- | -------------------------------------------------- |
| System name            | Yes      | The product or platform name                       |
| What it does           | Yes      | One paragraph description                          |
| Workflow stages        | Yes      | Ordered list of pipeline steps                     |
| Actors                 | Yes      | All roles (staff + external users)                 |
| Downstream consumers   | Yes      | Who receives the system's events or API output     |
| Cross-cutting concerns | No       | Identity, RBAC, multitenancy, eventing, compliance |
| Constraints            | No       | Compliance, data residency, audit requirements     |
| Cloud target           | No       | Default: cloud-native, Kubernetes-based            |

## Output Location

Generated documents should be saved to: **`docs/projects/{projectName}/design-doc.md`**

Example: `docs/projects/identity-sdk-v3/design-doc.md`

## Execution Protocol

### Step 1 -- Confirm Context

Restate the system context back to the user in a brief summary. Ask for confirmation or corrections before generating anything. Do not skip this step.

### Step 2 -- Run Skills in Sequence

Invoke each skill in the order listed above. For each skill:

1. State which skill is running (e.g. "Running business-model...")
2. Pass the full system context to the skill
3. Collect the output
4. State completion (e.g. "Section 1 complete.")

Do not wait for user input between skills unless a skill's input contract is unsatisfied.

### Step 3 -- Assemble the Document

Combine all section outputs into a single markdown document using the template at `templates/design-doc.md`.

### Step 4 -- Quality Check

Before delivering the assembled document, verify:

- [ ] All four sections are present and non-empty
- [ ] No section contains placeholder text or "TODO"
- [ ] All Mermaid blocks are syntactically valid
- [ ] The document opens with the title and version header
- [ ] Sections are separated by `---` horizontal rules
- [ ] All `class` assignments are on one line with no padding

If any check fails, fix the issue before delivering.

### Step 5 -- Deliver

Output the complete assembled markdown document. After the document, add a one-paragraph summary noting any sections that may need human review.

## Output Template

All generated documents MUST include proper YAML frontmatter:

```yaml
---
id: {project-name}-design-doc
version: "1.0.0"
last_updated: "YYYY-MM-DD"
updated_by: "TL: {Name}"
status: active
type: project
review_cycle: 60
next_review: "YYYY-MM-DD"
owner_role: "TL"
---
```

## Re-generation Protocol

- **Single section**: If user asks to regenerate one section, invoke only the relevant skill, replace that section, re-run quality check, and deliver.
- **Different system**: If user asks to generate for a different system, ask for new system context using the input contract, then repeat Steps 1-5.

## Key Rules

- **Sequential execution**: Skills must run in order -- each builds on context from previous
- **Self-contained output**: The assembled document must be readable without prior context
- **No duplication**: Content from one section must not duplicate content from another
- **Mermaid isolation**: Every diagram in its own fenced ```mermaid block
- **Domain-agnostic**: No hardcoded industry terms -- use system context from input

## Quality Bar

Before outputting, verify:

- [ ] All four sections present and complete
- [ ] No placeholder text or TODOs
- [ ] All Mermaid blocks syntactically valid
- [ ] Document has title and version header
- [ ] Sections separated by horizontal rules
- [ ] Document is self-contained and readable standalone

## Quality Assurance

### Validation Script

This skill includes automated validation via `scripts/validate-examples.ts`:

```bash
# Validate skill examples and structure
npx tsx scripts/validate-examples.ts
```

**Validation includes:**

- Document structure completeness (4 sections)
- Mermaid block syntax validation
- Placeholder detection
- Self-containment verification

**Integration with ecosystem:**

- Used by `/multi-agent-audit` for ecosystem validation
- Supports quality gates in SDLC workflow

## Resources

- **Template**: `templates/design-doc.md`
- **Skills invoked**: `business-model/`, `use-cases/`, `architecture-doc/`, `prd-tecnico/`
- **Downstream**: `generate-rf/` (requirements from design doc), `epic-breakdown/` (epics from design)
