---
name: lidr-adr
id: adr
version: "1.4.1"
last_updated: "2026-06-09"
updated_by: "TL: BMad-coherence batch-fix"
status: active
phase: 4
stage: development
owner_role: "TL"
automation: false
domain_agnostic: true
language_default: en
integrations: [tracking, chat]
description: >
  Generate Architecture Decision Records (ADRs) in MADR format to document significant technical decisions with context, alternatives, trade-offs, and rationale. Domain-agnostic — works for any technology stack, architecture style, or industry vertical. Use for hard-to-reverse decisions, decisions affecting multiple teams, significant trade-off choices, extensively debated options. ALWAYS use when documenting significant architectural decisions that are costly to reverse.
  Essential when a technical decision needs to be preserved so future team members understand the why.
  Always use when choosing a database/framework/cloud provider, always use when a decision was debated and needs documentation to avoid re-debating.
  Do NOT use for trivial reversible decisions, decisions already in tech-stack rules, or temporary PoC decisions.
  Triggers on "architecture decision", "ADR", "technical decision record", "document decision", "why did we choose", "decision record", "technical trade-off".
  Content authored in English (MADR format); artifact language follows the client `language` setting (see `_shared/lidr/integrations/`).
  Audience: Tech Lead (creates ADRs), Developer (references decisions), new team members (understands context).
---

# Architecture Decision Record Generator

Phase: any (typically 5 — Development) | Content authored in English (MADR format); artifact language follows the client `language` setting (see `_shared/lidr/integrations/`) | Domain: Any

Tools resolve via the central registry `_shared/lidr/integrations/tool-registry.yaml` (`{{TRACKING_TOOL}}`, `{{CHAT_TOOL}}`); the active client binds concrete tools in `clients/<CODE>.yaml`.

## Relationship to BMad

`bmad-create-architecture` owns the broader architecture/solution-design document. This LIDR skill produces immutable, single-decision MADR records that annotate and feed that document — each ADR captures the why behind one hard-to-reverse choice so the architecture doc and future contributors can reference it without re-debating.

## Workflow

1. **Capture context** — Document the problem/need driving the decision and constraints in play
2. **Enumerate alternatives** — List minimum 2 options evaluated (research, PoCs, benchmarks)
3. **Apply decision drivers** — Map each driver (performance, cost, team expertise, NFRs) to options
4. **Record outcome** — State chosen option with 1-2 sentence rationale
5. **Document trade-offs** — List good, bad, and neutral consequences honestly
6. **Assign status** — Proposed (pending review) → Accepted (team agreed) or Superseded
7. **Store** — Save as `docs/adr/ADR-{NNN}-{decision-title}.md` with sequential number

## When to Create (at least 1 criterion met)

- Hard to reverse (DB choice, framework, cloud provider)
- Impacts multiple teams/components
- Has significant trade-offs (perf vs maintainability, consistency vs availability)
- Was extensively debated (document to avoid re-debating)
- Affects NFRs (security, performance, scalability)
- Involves money (buy vs build, licenses, SaaS contracts)
- Will be asked by newcomers ("Why did we use X instead of Y?")

## When NOT to Create

- Trivial reversible decisions (tabs vs spaces → linter config)
- Decisions already in `rules/tech-stack.md` (following existing rules)
- Temporary PoC decisions (document in PoC report instead)

## Input

| Input                          | Required  | Source                                |
| ------------------------------ | --------- | ------------------------------------- |
| Technical context / problem    | ✅        | Discussion, RFC, {{CHAT_TOOL}} thread |
| Alternatives evaluated (min 2) | ✅        | Research, PoC, team experience        |
| Decision (or proposal)         | ✅        | Team consensus / Tech Lead            |
| Supporting data                | Desirable | Benchmarks, PoC results, vendor docs  |
| Known constraints              | Desirable | PRD-T, rules/tech-stack.md, budget    |

## Output Location

Generated documents should be saved to: **`docs/adr/ADR-{NNN}-{decision-title}.md`**

Uses sequential numbering and follows MADR format for architecture decisions.

Example: `docs/adr/ADR-005-database-migration-strategy.md`

## Output Template

```markdown
---
id: ADR-{NNN}-{decision-slug}
version: "1.0.0"
last_updated: "YYYY-MM-DD"
updated_by: "Tech Lead: {Name}"
status: active
type: standard
review_cycle: 90
next_review: "YYYY-MM-DD"
owner_role: "Tech Lead"
---

# ADR-{NNN}: {Decision title — descriptive phrase}

## Metadata

| Field              | Value                                                              |
| ------------------ | ------------------------------------------------------------------ |
| **ID**             | ADR-{NNN}                                                          |
| **Date**           | YYYY-MM-DD                                                         |
| **Status**         | Proposed / Accepted / Deprecated / Superseded by ADR-{XXX}         |
| **Deciders**       | [Names and roles]                                                  |
| **Technical Area** | [Architecture / Infrastructure / Security / Data / API / Frontend] |

## Context

[Why we need to make this decision. What forces are at play. What constraints exist.]

## Decision Drivers

- [Driver 1 — e.g., "Need to support 10K concurrent users"]
- [Driver 2 — e.g., "Team has experience with React"]
- [Driver 3 — e.g., "Budget limited to $X/month"]

## Considered Options

1. **[Option A]** — {brief description}
2. **[Option B]** — {brief description}
3. **[Option C]** — {brief description}

## Decision Outcome

**Chosen option: "[Option B]"** because {1-2 sentence justification}.

### Consequences

**Good:**

- [Positive consequence 1]
- [Positive consequence 2]

**Bad:**

- [Negative consequence / trade-off 1]
- [Accepted risk]

**Neutral:**

- [Implication that is neither positive nor negative]

## Pros and Cons of Options

### Option A: {name}

- ✅ {pro 1}
- ✅ {pro 2}
- ❌ {con 1}
- ❌ {con 2}

### Option B: {name} (chosen)

- ✅ {pro 1}
- ✅ {pro 2}
- ❌ {con 1}

### Option C: {name}

- ✅ {pro 1}
- ❌ {con 1}
- ❌ {con 2}

## Links

- [Related ADR-XXX]({link})
- [PRD-T reference]({link})
- [PoC results]({link})
```

## Example Output

```markdown
# ADR-{NNN}: {{TECHNOLOGY_CHOICE}} for {{SYSTEM_COMPONENT}}

## Metadata

| Field              | Value                                                                  |
| ------------------ | ---------------------------------------------------------------------- |
| **ID**             | ADR-{NNN}                                                              |
| **Date**           | {{DATE}}                                                               |
| **Status**         | {{STATUS}}                                                             |
| **Deciders**       | {{ROLE_A}}: {{NAME_A}}, {{ROLE_B}}: {{NAME_B}}, {{ROLE_C}}: {{NAME_C}} |
| **Technical Area** | {{TECHNICAL_AREA}}                                                     |

## Context

We need to choose {{TECHNOLOGY_TYPE}} for the new {{SYSTEM_DESCRIPTION}} that will be used across {{PLATFORM_SCOPE}}. Current system uses {{CURRENT_TECHNOLOGY}}, but we need {{IMPROVEMENT_REQUIREMENTS}} for {{BUSINESS_DRIVER}}.

## Decision Drivers

- Need to support {{PERFORMANCE_REQUIREMENT}}
- Team has {{EXISTING_EXPERTISE}}
- Must integrate with {{EXISTING_SYSTEMS}}
- Timeline: {{PROJECT_TIMELINE}}
- Budget constraint: {{BUDGET_CONSTRAINTS}}
- Must meet {{COMPLIANCE_REQUIREMENTS}}

## Considered Options

1. **{{OPTION_A}}** — {{OPTION_A_DESCRIPTION}}
2. **{{OPTION_B}}** — {{OPTION_B_DESCRIPTION}}
3. **{{OPTION_C}}** — {{OPTION_C_DESCRIPTION}}

## Decision Outcome

**Chosen option: "{{CHOSEN_OPTION}}"** because {{DECISION_RATIONALE}}.

### Consequences

**Good:**

- {{POSITIVE_CONSEQUENCE_1}}
- {{POSITIVE_CONSEQUENCE_2}}
- {{POSITIVE_CONSEQUENCE_3}}

**Bad:**

- {{NEGATIVE_CONSEQUENCE_1}}
- {{NEGATIVE_CONSEQUENCE_2}}

**Neutral:**

- {{NEUTRAL_CONSEQUENCE_1}}
- {{NEUTRAL_CONSEQUENCE_2}}

## Pros and Cons of Options

### Option A: {{OPTION_A}} {{CHOSEN_INDICATOR}}

- ✅ {{OPTION_A_PRO_1}}
- ✅ {{OPTION_A_PRO_2}}
- ✅ {{OPTION_A_PRO_3}}
- ❌ {{OPTION_A_CON_1}}
- ❌ {{OPTION_A_CON_2}}

### Option B: {{OPTION_B}}

- ✅ {{OPTION_B_PRO_1}}
- ✅ {{OPTION_B_PRO_2}}
- ❌ {{OPTION_B_CON_1}}
- ❌ {{OPTION_B_CON_2}}
- ❌ {{OPTION_B_CON_3}}

### Option C: {{OPTION_C}}

- ✅ {{OPTION_C_PRO_1}}
- ✅ {{OPTION_C_PRO_2}}
- ❌ {{OPTION_C_CON_1}}
- ❌ {{OPTION_C_CON_2}}

## Links

- [{{REFERENCE_DOC_1}}]({{LINK_1}})
- [{{REFERENCE_DOC_2}}]({{LINK_2}})
- [{{REFERENCE_DOC_3}}]({{LINK_3}})
```

## Quality Assurance

### Validation Script

This skill includes automated validation via `scripts/validate-examples.ts`:

```bash
# Validate skill examples and structure
npx tsx scripts/validate-examples.ts
```

**Validation includes:**

- Example completeness and correctness
- Architecture decision documentation compliance patterns
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

## Key Rules

- **Arguments, not opinions**: "We chose X because benchmark showed 3x throughput" > "We chose X because it's better"
- **Honest trade-offs**: Every option has cons. Document them.
- **Status lifecycle**: Proposed → Accepted → (may become) Deprecated / Superseded
- **Numbering**: Sequential. Check existing ADRs in `docs/adr/` for next number.
- **Superseding**: When replacing an ADR, set old one to "Superseded by ADR-{NNN}" and reference in new one.

## Resources

- **Related Skills**: `bmad-create-architecture` (for broader architectural context), `tech-debt` (when decisions create technical debt)
- **Related Templates**: `docs/templates/adr.md` (empty ADR template for manual creation)
- **ADR Storage**: Store completed ADRs in `docs/adr/` directory with sequential numbering

## Changelog

| Version | Date       | Author                       | Changes                                                                                                                      |
| ------- | ---------- | ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| 1.4.1   | 2026-06-09 | TL: BMad-coherence batch-fix | Reconstructed entry — frontmatter was bumped to 1.4.1 without a changelog row (version↔changelog coherence sweep 2026-06-11) |
| 1.4.0   | 2026-06-09 | TL: lang+tool agnostic       | Language to English-default-configurable; abstracted Slack/Jira via tool-registry                                            |
| 1.1.0   | 2026-03-15 | Tech Lead: System            | Added complete frontmatter, ## Workflow section, ## Changelog; standardized to canonical template                            |
| 1.0.0   | 2025-02-01 | Tech Lead: Initial           | Initial version with MADR format template                                                                                    |
