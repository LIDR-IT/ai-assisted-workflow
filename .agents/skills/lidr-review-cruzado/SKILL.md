---
name: lidr-review-cruzado
id: review-cruzado
version: "1.0.1"
last_updated: "2026-03-16"
updated_by: "System: Quality Assurance Integration"
status: active
phase: 2
owner_role: "TL"
automation: false
domain_agnostic: true
description: "Essential for PRD alignment validation in software projects - ALWAYS use before Gate 1 approval. CRITICAL for ensuring functional and technical PRDs are aligned on user workflows, data protection compliance, user journeys, and implementation feasibility. Use when validating API integrations, authentication requirements, data processing capabilities, or system architectures. Essential for catching misalignments between user experience and technical constraints in enterprise applications, web platforms, and mobile solutions. Mandatory prerequisite for Gate 1 passage."
---

# PRD Cross-Review Facilitator

Phase: 2 — Discovery | Gate: 1 (mandatory prerequisite) | Language: Spanish

## Workflow

1. **Read PRD-T** (complete draft) — focus on system architecture, NFRs, and compliance
2. **Read PRD-F** (complete draft) — focus on user journeys, personas, and business rules
3. **Read cross-review checklist** for application-specific alignment criteria
4. **Execute automated alignment check**:
   - User consent flows ↔ Data protection compliance architecture
   - Performance expectations ↔ system capabilities
   - User journey error paths ↔ technical failover mechanisms
   - Business requirements ↔ infrastructure scaling
5. **Validate compliance alignment**: Data protection, industry-specific requirements across both PRDs
6. **Generate findings report** with severity classification and application context
7. **Present to team**: PO + R&D Lead + QA Lead + Security (when handling sensitive data)

## Input

| Input                          | Required  | Source                        |
| ------------------------------ | --------- | ----------------------------- |
| PRD Técnico (complete draft)   | ✅        | skill `prd-tecnico/`          |
| PRD Funcional (complete draft) | ✅        | skill `prd-funcional/`        |
| Cross-review checklist         | ✅        | @checklists/review-cruzado.md |
| Business Case                  | Reference | For alignment verification    |

## Cross-Review Dimensions

Check alignment across these cross-cutting dimensions:

| Dimension                                             | PRD-F Section             | PRD-T Section    | What to Compare                                                                  |
| ----------------------------------------------------- | ------------------------- | ---------------- | -------------------------------------------------------------------------------- |
| **Functionalities ↔ Capabilities**                    | §4 Functionalities        | §3 Architecture  | Core features (verification, processing, integrations) are technically supported |
| **User Journeys ↔ API Flow**                          | §5 Journeys               | §3 Architecture  | Each user step maps to API calls and processing capabilities                     |
| **Compliance Requirements ↔ Compliance Architecture** | §4 Consent flows          | §5 Security      | User rights (deletion, access) have technical implementation                     |
| **Accuracy Expectations ↔ System Performance**        | §7 Success metrics        | §5 NFRs          | Expected quality metrics align with system capabilities                          |
| **Error Handling ↔ Failover Design**                  | §5 Journey error paths    | §3 Architecture  | User-friendly errors map to technical exception handling                         |
| **Performance Expectations ↔ Infrastructure**         | §7 KPIs (speed)           | §5 NFRs          | User expectation (<3s) matches technical capacity                                |
| **Data Retention ↔ Storage Design**                   | Business rules            | §7 Data model    | Regulatory retention periods match database architecture                         |
| **Accessibility ↔ Technical Support**                 | §5 User personas          | §5 NFRs          | Special user needs and accessibility support in technical design                 |
| **Compliance Scope ↔ Technical Scope**                | §8 Regulatory constraints | §8 Risk analysis | Industry/regulatory requirements covered technically                             |

## Output Template

```markdown
# Cross-Review: PRD-T ↔ PRD-F — [PROJECT]

| Status            | Result                                      |
| ----------------- | ------------------------------------------- |
| **Overall**       | ✅ PASS / ⚠️ PASS WITH CONDITIONS / ❌ FAIL |
| **PRD-T version** | {version}                                   |
| **PRD-F version** | {version}                                   |
| **Date**          | {today}                                     |

## Findings

### 🔴 Blockers (must fix before Gate 1)

| #   | Finding | PRD-F ref | PRD-T ref | Action Required |
| --- | ------- | --------- | --------- | --------------- |

### 🟡 Warnings (should fix, may be conditions for Gate 1)

| # | Finding | PRD-F ref | PRD-T ref | Recommendation |

### 🟢 Observations (nice to fix, informational)

| # | Finding | PRD-F ref | PRD-T ref | Suggestion |

## Alignment Matrix

| PRD-F Functionality | PRD-T Capability | Aligned? | Notes |
| ------------------- | ---------------- | -------- | ----- |

## Checklist Results

[Results of @checklists/review-cruzado.md execution]

## Recommendation

[APPROVE / CONDITIONAL APPROVE (list conditions) / REJECT (list blockers)]

## Next Steps

[If APPROVE: proceed to generate-rf skill for Gate 2]
[If REJECT: specific actions per blocker with owner]
```

## Key Rules

- **Every functional requirement needs technical capability**: PRD-F lists a core feature → PRD-T must have the corresponding architecture or API
- **Compliance alignment is mandatory**: User consent flows in PRD-F must match data protection architecture in PRD-T
- **Accuracy expectations must be realistic**: PRD-F promises "instant verification" → PRD-T must show sub-second capability
- **Error paths need technical support**: PRD-F describes failure recovery → PRD-T needs fallback mechanisms
- **Compliance requirements consistent**: Regulatory security in PRD-F → Enterprise encryption and controls in PRD-T
- **AI detects patterns, humans validate context**: AI finds structural gaps; humans verify business-technical semantics
- **Be specific with context**: "Verification misaligned" → "PRD-F expects <2s processing for mobile users, but PRD-T shows 4s average latency. Resolution: optimize algorithm or adjust user expectation."

## Cross-Review Example

### Project: Digital Banking - KYC Identity Verification

**🔴 Blocker Found**:

- **Finding**: PRD-F §4 F2 requires "offline document verification for areas with poor connectivity"
- **PRD-T Gap**: §3 Architecture only supports cloud-based OCR with online validation
- **Impact**: 30% of target users in rural areas cannot complete onboarding
- **Resolution**: Add offline OCR capability to PRD-T or modify PRD-F to online-only with progress saving

**🟡 Warning Found**:

- **Finding**: PRD-F §7 promises "99% first-time facial verification success"
- **PRD-T Reality**: §5 NFRs show current algorithm achieves 85% first-time success
- **Impact**: User experience expectations vs. technical reality mismatch
- **Resolution**: Lower expectation to 90% or enhance algorithm training dataset

**🟢 Observation**:

- **Finding**: PRD-F personas include 55+ users but PRD-T accessibility NFRs only cover basic WCAG
- **Enhancement**: Add voice guidance, larger UI elements, simplified flows for senior personas

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

- Used by `/multi-agent-audit` for ecosystem validation
- Supports quality gates in SDLC workflow
- Provides consistent validation across all skills
