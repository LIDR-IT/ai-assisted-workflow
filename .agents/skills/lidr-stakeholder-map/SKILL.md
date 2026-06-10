---
name: lidr-stakeholder-map
id: stakeholder-map
version: "1.3.0"
last_updated: "2026-06-10"
updated_by: "TL: Gate-evidence contract fix"
status: active
phase: 1
stage: analysis
owner_role: "PME"
automation: false
domain_agnostic: true
language_default: en
integrations: [chat]
description: "Generate a stakeholder map with power/interest matrix and communication plan for a project. Use at project start to identify ALL stakeholders, define engagement strategy, and prevent late-appearing stakeholders changing scope. Triggers on create stakeholder map, who are the stakeholders, communication plan, identify stakeholders, who do we need to involve. Informs Discovery sessions (who to interview) and ongoing project communication. Content authored in English; artifact language follows the client `language` setting (see `_shared/lidr/integrations/`). ALWAYS use at project start to identify all stakeholders and define engagement strategies."
---

# Stakeholder Map Generator

Phase: 1 — Origination | Content authored in English; artifact language follows the client `language` setting (see `_shared/lidr/integrations/`). The headings in the output template below are illustrative — the bound client `language` drives the emitted artifact.

Tools resolve via the central registry `_shared/lidr/integrations/tool-registry.yaml`; the active client binds concrete tools in `clients/<CODE>.yaml`.

## Relationship to BMad

This skill is a **LIDR-unique artifact** (no BMad equivalent). BMad has no concept of a power/interest stakeholder matrix or communication plan. This skill feeds Discovery — its stakeholder list informs who to interview and supplies the stakeholder context that `bmad-prd` references when capturing requirements.

## Output Location

The stakeholder map is published to the per-client path Gate 0 reads (`gate-evidence.yaml` G0 `lidr-stakeholder-map` glob `{client_root}/stakeholder-map.md`, `required: false`):

**`docs/projects/{CLIENT_CODE}/stakeholder-map.md`**

`{CLIENT_CODE}` is the active client (see `rules/lidr-sdlc/project.md`).

Example: `docs/projects/docline/stakeholder-map.md`

> **Gate 0 contract**: `stakeholder-map.md` at the per-client root is optional evidence for G0. Publish it here so `/lidr-advance-gate 0` and `lidr-gate-evaluation` resolve it.

## Workflow

1. Read Business Case (sponsor, beneficiaries, team)
2. Read Kick-off attendees (if available)
3. Identify ALL stakeholders by category (internal + external)
4. Classify using Power × Interest matrix
5. Define communication strategy per quadrant
6. Output map + communication plan

## Input

| Input                  | Required  | Source                                        |
| ---------------------- | --------- | --------------------------------------------- |
| Business Case          | ✅        | skill `business-case/`                        |
| Kick-off attendees     | Desirable | skill `kickoff/`                              |
| Organizational context | Desirable | PME (org chart, internal politics)            |
| Project type           | Desirable | BC (new product, migration, regulatory, etc.) |

## Output Template

```markdown
# Stakeholder Map: [PROJECT NAME]

## 1. Identified Stakeholders

| #   | Name | Role/Title | Department | Type | Power | Interest |
| --- | ---- | ---------- | ---------- | ---- | ----- | -------- |

## 2. Power × Interest Matrix
```

          HIGH INTEREST
               │

KEEP │ MANAGE
SATISFIED │ ACTIVELY
(inform) │ (collaborate)
│
─────────────┼───────────────
│
MONITOR │ KEEP
(minimal) │ INFORMED
│
LOW INTEREST
HIGH POWER ←──→ LOW POWER

```

## 3. Communication Plan
| Stakeholder/Group | Quadrant | Frequency | Channel | Content | Owner |
|-------------------|----------|-----------|---------|---------|-------|

## 4. Stakeholder Risks
| Risk | Stakeholder | Impact | Mitigation |
|------|-------------|--------|-----------|

## 5. Unconfirmed Potential Stakeholders
[People who MIGHT need to be involved — flag for validation]
```

## Key Rules

- **Exhaustive identification**: Better to list too many than miss one who appears late.
- **Classify honestly**: Not everyone is "high power, high interest." Be realistic.
- **Communication plan is actionable**: Channel + frequency + content + owner for each group.
- **Update periodically**: Stakeholder dynamics change — review each phase transition.
- **External stakeholders**: Don't forget regulators, partners, vendors, end users.

## Quality Assurance

### Validation Script

This skill includes automated validation via `scripts/validate-examples.ts`:

```bash
# Validate skill examples and structure
npx tsx scripts/validate-examples.ts
```

**Validation includes:**

- Example completeness and correctness
- Stakeholder mapping and project governance compliance patterns
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

| Version | Date       | Author                         | Changes                                                                                                                    |
| ------- | ---------- | ------------------------------ | -------------------------------------------------------------------------------------------------------------------------- |
| 1.3.0   | 2026-06-10 | TL: Gate-evidence contract fix | Added "## Output Location": publishes to `docs/projects/{CLIENT_CODE}/stakeholder-map.md` (G0 optional gate-evidence path) |
| 1.2.0   | 2026-06-09 | TL: lang+tool agnostic         | Language to English-default-configurable; abstracted chat (Slack) via tool-registry                                        |
