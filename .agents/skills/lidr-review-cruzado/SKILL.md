---
name: lidr-review-cruzado
id: review-cruzado
version: "1.3.0"
last_updated: "2026-06-14"
updated_by: "TL: unified-PRD coherence"
status: active
phase: 2
stage: planning
owner_role: "TL"
automation: false
domain_agnostic: true
language_default: en
description: "Gate 1 enforcer: validates that the single unified bmad-prd output is internally aligned — that its Functional scope (user journeys, personas, FRs) and its Technical scope (architecture references, feature + cross-cutting NFRs, compliance) are both complete and mutually consistent. Acts as the LIDR wrapper after bmad-prd in the LIDR-on-BMad architecture. Detects misalignments between business intent and technical feasibility WITHIN the one PRD. Recommended after bmad-prd produces the unified PRD, before invoking lidr-gate-evaluation for Gate 1."
---

# PRD Cross-Review Facilitator

Phase: 2 — Planning | Gate: 1 (optional evidence) | Content authored in English; artifact language follows the client `language` setting (see `_shared/lidr/integrations/`).

## Relationship to BMad

LIDR Gate-1 enforcer (no BMad equivalent). `bmad-prd` produces **one unified PRD** (`prd.md`) where Functional content (Target User §2, User Journeys §2.3, Features/FRs §4) and Technical content (feature-specific NFRs in §4, Cross-Cutting NFRs / Constraints & Guardrails / Compliance & Regulatory in the Adapt-In sections, plus the separate Architecture doc referenced in §0) coexist by feature. BMad validates the PRD's **quality** (the `bmad-prd` Validate-intent rubric), but no BMad step checks that the Functional and Technical halves are mutually **aligned** before the PRD is accepted. This skill is that check: it consumes the `bmad-prd` output and validates **F↔T coherence within the single PRD** (journeys/personas ↔ architecture/NFRs/compliance), publishing the cross-review as **Gate 1** evidence (consumed by `lidr-gate-evaluation`). On APPROVE the flow proceeds to `lidr-requirements` (per-rf mode for Gate 2 requirements authoring); on REWORK it returns to `bmad-prd`.

## Output Location

The cross-review report is published to the per-client path Gate 1 reads (`gate-evidence.yaml` G1 `lidr-review-cruzado` glob `{client_root}/review-cruzado*.md`, `required: false`):

**`docs/projects/{CLIENT_CODE}/review-cruzado.md`** (or `review-cruzado-{date}.md` per review)

`{CLIENT_CODE}` is the active client (see `rules/lidr-sdlc/project.md`).

Example: `docs/projects/docline/review-cruzado.md`

> **Gate 1 contract**: `review-cruzado*.md` at the per-client root is optional evidence for G1 (F↔T alignment enforcement). Publish it here so `/lidr-advance-gate 1` and `lidr-gate-evaluation` resolve it.

## Workflow

1. **Read the unified PRD** (`prd.md`, complete draft) — read it ONCE, holding both lenses:
   - _Functional lens_: Target User (§2), User Journeys (§2.3), Features & FRs (§4)
   - _Technical lens_: feature-specific NFRs (§4), Cross-Cutting NFRs / Constraints & Guardrails / Compliance & Regulatory (Adapt-In sections), and the Architecture doc referenced in §0
2. **Read cross-review checklist** for application-specific alignment criteria
3. **Execute automated alignment check** (each pair is two parts of the SAME PRD):
   - User consent flows ↔ Data protection / compliance sections
   - Performance expectations (§7 metrics) ↔ NFRs / system capabilities
   - User-journey error paths (§2.3) ↔ technical failover described in the features / Architecture doc
   - Business requirements (§4 FRs) ↔ infrastructure scaling (Cross-Cutting NFRs)
4. **Validate compliance alignment**: data protection, industry-specific requirements stated functionally vs. covered technically — both within `prd.md`
5. **Generate findings report** with severity classification and application context
6. **Present to team**: PO + R&D Lead + QA Lead + Security (when handling sensitive data)

## Input

| Input                       | Required  | Source                                                   |
| --------------------------- | --------- | -------------------------------------------------------- |
| Unified PRD (`prd.md`)      | ✅        | skill `bmad-prd/`                                        |
| Architecture doc (if split) | Reference | skill `bmad-create-architecture/` (referenced in PRD §0) |
| Cross-review checklist      | ✅        | @checklists/review-cruzado.md                            |
| Business Case               | Reference | For alignment verification                               |

## Cross-Review Dimensions

Check alignment across these cross-cutting dimensions — both the **Functional anchor** and the **Technical anchor** are sections of the SAME `prd.md` (Technical capability may also live in the separate Architecture doc referenced in §0):

| Dimension                                             | Functional anchor (prd.md) | Technical anchor (prd.md / Architecture)        | What to Compare                                                               |
| ----------------------------------------------------- | -------------------------- | ----------------------------------------------- | ----------------------------------------------------------------------------- |
| **Functionalities ↔ Capabilities**                    | §4 Features / FRs          | §4 feature descriptions / Architecture doc      | Core features (processing, integrations, workflows) are technically supported |
| **User Journeys ↔ API/Processing Flow**               | §2.3 User Journeys         | §4 feature capabilities / Architecture doc      | Each user step maps to API calls and processing capabilities                  |
| **Compliance Requirements ↔ Compliance Architecture** | §4 consent/feature flows   | Compliance & Regulatory (Adapt-In) / NFRs       | User rights (deletion, access) have technical implementation                  |
| **Accuracy Expectations ↔ System Performance**        | §7 Success Metrics         | §4 feature NFRs / Cross-Cutting NFRs (Adapt-In) | Expected quality metrics align with system capabilities                       |
| **Error Handling ↔ Failover Design**                  | §2.3 journey edge cases    | §4 feature descriptions / Architecture doc      | User-friendly errors map to technical exception handling                      |
| **Performance Expectations ↔ Infrastructure**         | §7 KPIs (speed)            | Cross-Cutting NFRs / Performance Budgets        | User expectation (<3s) matches technical capacity                             |
| **Data Retention ↔ Storage Design**                   | §4 business rules          | Data Governance (Adapt-In) / Architecture doc   | Regulatory retention periods match database architecture                      |
| **Accessibility ↔ Technical Support**                 | §2 User personas           | §4 feature NFRs / Cross-Cutting NFRs            | Special user needs and accessibility support in technical design              |
| **Compliance Scope ↔ Risk Scope**                     | §5 Non-Goals / Compliance  | Risk & Mitigations (Adapt-In)                   | Industry/regulatory requirements covered technically                          |

## Output Template

```markdown
# PRD Alignment Review: Functional ↔ Technical — [PROJECT]

| Status          | Result                                      |
| --------------- | ------------------------------------------- |
| **Overall**     | ✅ PASS / ⚠️ PASS WITH CONDITIONS / ❌ FAIL |
| **PRD version** | {version}                                   |
| **Date**        | {today}                                     |

## Findings

### 🔴 Blockers (must fix before Gate 1)

| #   | Finding | Functional ref (§) | Technical ref (§) | Action Required |
| --- | ------- | ------------------ | ----------------- | --------------- |

### 🟡 Warnings (should fix, may be conditions for Gate 1)

| # | Finding | Functional ref (§) | Technical ref (§) | Recommendation |

### 🟢 Observations (nice to fix, informational)

| # | Finding | Functional ref (§) | Technical ref (§) | Suggestion |

## Alignment Matrix

| Functional element (§) | Technical element (§) | Aligned? | Notes |
| ---------------------- | --------------------- | -------- | ----- |

## Checklist Results

[Results of @checklists/review-cruzado.md execution]

## Recommendation

[APPROVE / CONDITIONAL APPROVE (list conditions) / REJECT (list blockers)]

## Next Steps

[If APPROVE: proceed to lidr-requirements (per-rf mode) for Gate 2]
[If REJECT: specific actions per blocker with owner]
```

## Key Rules

- **Every functional requirement needs technical capability**: a §4 FR describes a feature → the same §4 feature NFRs / Architecture doc must show the corresponding capability or API
- **Compliance alignment is mandatory**: consent flows stated functionally (§4) must match the Compliance & Regulatory / data-protection sections
- **Performance expectations must be realistic**: a §7 quality/latency target → matching NFR (§4 / Cross-Cutting NFRs) must show the capability
- **Error paths need technical support**: §2.3 journey failure recovery → feature descriptions / Architecture must define fallback mechanisms
- **Compliance requirements consistent**: regulatory controls stated functionally → encryption/controls in the technical sections
- **AI detects patterns, humans validate context**: AI finds structural gaps; humans verify business-technical semantics
- **Be specific with context**: "Feature misaligned" → "§7 expects <2s processing for mobile users, but the Cross-Cutting NFRs show 4s average latency. Resolution: optimize the implementation or adjust user expectation."

## Cross-Review Example

### Project: Digital Banking - KYC Identity Verification

**🔴 Blocker Found**:

- **Finding**: `prd.md` §4 FR-2 requires "offline document verification for areas with poor connectivity"
- **Technical Gap**: the feature's NFRs / Architecture doc only support cloud-based OCR with online validation
- **Impact**: 30% of target users in rural areas cannot complete onboarding
- **Resolution**: add offline OCR capability to the architecture, or modify §4 FR-2 to online-only with progress saving

**🟡 Warning Found**:

- **Finding**: `prd.md` §7 Success Metrics promise "99% first-time facial verification success"
- **Technical Reality**: the feature NFRs show the current algorithm achieves 85% first-time success
- **Impact**: user-experience expectations vs. technical reality mismatch
- **Resolution**: lower expectation to 90% or enhance algorithm training dataset

**🟢 Observation**:

- **Finding**: §2 personas include 55+ users but the accessibility NFRs only cover basic WCAG
- **Enhancement**: add voice guidance, larger UI elements, simplified flows for senior personas

## Quality Assurance

### Validation Script

This skill includes automated validation via `scripts/validate-examples.ts`:

```bash
# Validate skill examples and structure
npx tsx scripts/validate-examples.ts
```

**Validation includes:**

- Example completeness and correctness
- PRD cross-validation compliance patterns
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

| Version | Date       | Author                         | Changes                                                                                                                                                                                                                                                                                                                                            |
| ------- | ---------- | ------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1.3.0   | 2026-06-14 | TL: unified-PRD coherence      | **Unified-PRD coherence**: removed the false PRD-T/PRD-F split — bmad-prd emits ONE `prd.md` with Functional (§2/§2.3/§4) and Technical (§4 NFRs + Adapt-In + Architecture doc) scopes. Reframed workflow/input/dimensions/template/examples to validate F↔T alignment WITHIN the single PRD. Skill purpose (Gate-1 alignment enforcer) unchanged. |
| 1.2.0   | 2026-06-11 | TL: BMad-seam visibility       | Added "## Relationship to BMad" (Gate-1 enforcer consuming `bmad-prd`, feeding `lidr-requirements` / `lidr-gate-evaluation`); introduced this Changelog section                                                                                                                                                                                    |
| 1.1.0   | 2026-06-10 | TL: Gate-evidence contract fix | Gate-evidence contract fix (pre-changelog; reconstructed entry)                                                                                                                                                                                                                                                                                    |
