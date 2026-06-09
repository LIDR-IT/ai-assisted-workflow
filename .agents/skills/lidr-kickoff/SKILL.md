---
name: lidr-kickoff
id: kickoff
version: "1.5.1"
last_updated: "2026-06-09"
updated_by: "TL: BMad-coherence batch-fix"
status: active
phase: 1
owner_role: "SM"
automation: false
domain_agnostic: true
language_default: en
integrations: [tracking, docs, chat, vcs, code_quality]
description: >-
  Generate comprehensive project kickoff meeting documentation: agenda, stakeholder roles, timeline, constraints, risks, decisions, and action items. Domain-agnostic — works for any project type, technology stack, or industry vertical. Use for project initiation, stakeholder alignment, and discovery phase preparation. ALWAYS use at project start to align team on objectives before work begins.
  Essential when Gate 0 has passed and Business Case is approved.
  Always use when starting a new project formally, always use when sponsor requests project initiation documentation.
  Do NOT use for ongoing projects past Origination phase, for sprint ceremonies (use sprint-capacity), or for incident reports (use postmortem).
  Triggers on "prepare kick-off", "generate kick-off agenda", "meeting minutes", "project kick-off", "Gate 0 passed now what", "start project", "begin discovery prep", "stakeholder alignment meeting", "project initiation documents".
  Output: English by default; artifact language follows the client `language` setting (see `_shared/lidr/integrations/`).
  Audience: Scrum Master (facilitates), PME (governance), Tech Lead (technical commitments).
---

# Skill: Project Kickoff Meeting Orchestrator

**🎯 ESSENTIAL FOR PROJECT INITIATION — ALWAYS USE AFTER GATE 0 APPROVAL**

**Critical for stakeholder alignment and project launch success. Must be executed before Discovery phase begins.**

> **Phase**: 1 (Origination) — Post Gate 0 | **Language**: English by default; artifact language follows the client `language` setting (see `_shared/lidr/integrations/`) | **Owner**: Scrum Master
> **Triggers on**: "prepare kick-off", "generate kick-off agenda", "meeting minutes", "project kick-off", "Gate 0 passed now what", "start project", "begin discovery prep", "stakeholder alignment meeting"

> Tools resolve via the central registry `_shared/lidr/integrations/tool-registry.yaml`; the active client binds concrete tools in `clients/<CODE>.yaml`.

## Purpose

This skill generates comprehensive kickoff meeting documentation for any project after Gate 0 approval, ensuring proper project initiation, team alignment, and clear success criteria before Discovery phase begins.

## Relationship to BMad

LIDR-unique Phase-1 / post-Gate-0 governance artifact — BMad has no kickoff-meeting equivalent. Consumes the approved `lidr-business-case` output and feeds the Discovery phase (`bmad-prd`) by seeding stakeholders, scope, and initial risks.

## Workflow

### Pre-Meeting Phase (AI-Generated)

1. **Load Business Case data** — Extract objective, scope, team, timeline from approved BC
2. **Verify Gate 0 status** — Confirm approval and any conditions
3. **Generate pre-filled agenda** — Structure meeting with all essential topics
4. **Identify stakeholders** — Map roles and responsibilities from project context
5. **Prepare compliance context** — Include applicable regulatory or compliance considerations

### During/Post-Meeting Phase (Human-Completed)

6. **Facilitate discussion** — Guide team through agenda systematically
7. **Capture decisions** — Document all project decisions with rationale
8. **Record action items** — SMART goals with owners and deadlines
9. **Identify risks** — Project-specific risks (regulatory, technical, market, organizational)
10. **Generate final minutes** — Ready for knowledge-base publication and team distribution

## Input

| Input                      | Required | Source                       | Context                                                    |
| -------------------------- | -------- | ---------------------------- | ---------------------------------------------------------- |
| **Approved Business Case** | ✅       | skill `business-case` output | Complete BC with all sections                              |
| **Gate 0 Resolution**      | ✅       | `/advance-gate 0` output     | Approval status + conditions                               |
| **Participant List**       | ✅       | PME / SM                     | Names, roles, dedication %, expertise areas                |
| **Meeting Date/Time**      | ✅       | Calendar invite              | Include timezone for distributed teams                     |
| **Project Code**           | ✅       | PME ({{TRACKING_TOOL}})      | Format: {PRODUCT}-{NUMBER} (e.g., PROJ-2024)               |
| **Known Constraints**      | Optional | Sponsor / PME                | Budget, timeline, resource limitations                     |
| **Regulatory Context**     | Optional | Legal / Compliance           | Applicable data protection regulations, industry standards |

> **Domain note**: When executing for regulated industries ({{APPLICABLE_DOMAINS}}), the regulatory context becomes required input. Replace placeholders in the output template with your project's actual regulatory framework.

## Output Template

Uses: templates/kickoff.md

```markdown
# Kick-off Minutes: [PROJECT NAME]

| Field                | Value                                  |
| -------------------- | -------------------------------------- |
| **Project**          | [{{TRACKING_TOOL}} code] — [Full Name] |
| **Product Line**     | [product line or component name]       |
| **Date**             | [YYYY-MM-DD HH:MM Timezone]            |
| **Duration**         | [HH:MM] (target: max 90 minutes)       |
| **Facilitator**      | [SM name]                              |
| **Attendees**        | [Name — Role — Area — % Dedication]    |
| **Excused Absences** | [Name — Role — Area]                   |

## 1. Project Context and Objective

**Business problem**: [from BC §2 Problem Statement]
**Opportunity**: [from BC §4 Market Opportunity]
**Objective**: [from BC §1 Executive Summary]
**Strategic alignment**: [from BC §5 Strategic Alignment]

## 2. Confirmed Scope and Deliverables

### ✅ In Scope (from BC §3 Proposed Solution)

- [Deliverable 1 — Success criterion]
- [Deliverable 2 — Success criterion]

### ❌ Out of Scope (Explicit Exclusions)

- [Exclusion 1 — Reason]
- [Exclusion 2 — Reason]

### 🔮 Future Scope (Post-MVP Considerations)

- [Future capability 1]
- [Future capability 2]

## 3. Project Team and Responsibilities

| Role              | Name    | Area    | Dedication | Primary Responsibility                   |
| ----------------- | ------- | ------- | ---------- | ---------------------------------------- |
| **PME**           | [Name]  | PME     | [%]        | Governance, gates, stakeholders          |
| **Product Owner** | [Name]  | Product | [%]        | PRD, prioritization, functional sign-off |
| **R&D/Core Lead** | [Name]  | R&D     | [%]        | Architecture, PoCs, technical decisions  |
| **Tech Lead**     | [Name]  | Dev     | [%]        | Code quality, mentoring, DoD             |
| **Developers**    | [Names] | Dev     | [%]        | Implementation, PRs, handoffs            |
| **QA Lead**       | [Name]  | QA      | [%]        | Test strategy, sign-off                  |
| **Security Lead** | [Name]  | Sec     | [%]        | Vuln assessment, compliance              |
| **DevOps**        | [Name]  | Ops     | [%]        | CI/CD, deploy, monitoring                |
| **Scrum Master**  | [Name]  | PME     | [%]        | Facilitation, impediments                |

## 4. Timeline and Critical Milestones

**Total duration**: [N weeks/months] — [Start date] to [End date]
**Sprints**: [N sprints of 2 weeks]

| Milestone              | Target Date  | Owner    | Gate   |
| ---------------------- | ------------ | -------- | ------ |
| Discovery complete     | [YYYY-MM-DD] | PO + R&D | Gate 1 |
| Specification approved | [YYYY-MM-DD] | PO + QA  | Gate 2 |
| First sprint committed | [YYYY-MM-DD] | SM       | Gate 3 |
| Development complete   | [YYYY-MM-DD] | TL       | Gate 4 |
| QA Sign-off            | [YYYY-MM-DD] | QA Lead  | Gate 5 |
| Security Sign-off      | [YYYY-MM-DD] | Security | Gate 6 |
| Release to Production  | [YYYY-MM-DD] | DevOps   | Gate 7 |

## 5. Constraints and Critical Dependencies

### Constraints (Non-Negotiable)

- **Budget**: [€ amount] — approved by [Sponsor]
- **Timeline**: [Maximum date] — reason: [business driver]
- **Resources**: [Team or technology limitations]
- **Compliance**: [Applicable regulations: {{APPLICABLE_REGULATIONS}}]

### External Dependencies

| Dependency            | Owner              | Critical Date | Risk if It Fails    |
| --------------------- | ------------------ | ------------- | ------------------- |
| [External system/API] | [Area/Vendor]      | [YYYY-MM-DD]  | [Impact assessment] |
| [Regulatory approval] | [Legal/Compliance] | [YYYY-MM-DD]  | [Impact assessment] |

## 6. Initial Identified Risks (Top 5 from BC)

| ID    | Risk                              | Probability       | Impact            | Proposed Mitigation | Owner  |
| ----- | --------------------------------- | ----------------- | ----------------- | ------------------- | ------ |
| R-001 | [Project-specific technical risk] | [High/Medium/Low] | [High/Medium/Low] | [Mitigation plan]   | [Role] |
| R-002 | [Regulatory/compliance risk]      | [High/Medium/Low] | [High/Medium/Low] | [Mitigation plan]   | [Role] |
| R-003 | [Market/competition risk]         | [High/Medium/Low] | [High/Medium/Low] | [Mitigation plan]   | [Role] |

## 7. Decisions Made in the Meeting

| #     | Decision                 | Context/Alternatives | Owner | Rationale                   |
| ----- | ------------------------ | -------------------- | ----- | --------------------------- |
| D-001 | [Architectural decision] | [Options considered] | [TL]  | [Technical/business reason] |
| D-002 | [Process decision]       | [Alternatives]       | [SM]  | [Rationale]                 |

## 8. Open Questions / Escalation Required

| #     | Question                      | Context             | Escalate To     | Deadline     |
| ----- | ----------------------------- | ------------------- | --------------- | ------------ |
| Q-001 | [Specific technical question] | [Why it matters]    | [Tech Lead/R&D] | [YYYY-MM-DD] |
| Q-002 | [Regulatory question]         | [Impact on project] | [Legal/CISO]    | [YYYY-MM-DD] |

## 9. Action Items (SMART)

| #      | Action                                                 | Owner      | Deadline     | Completion Criterion                       | Status |
| ------ | ------------------------------------------------------ | ---------- | ------------ | ------------------------------------------ | ------ |
| AI-001 | Create master epic in {{TRACKING_TOOL}} with sub-epics | [PME]      | [YYYY-MM-DD] | {{TRACKING_TOOL}} epic visible to the team | 📝     |
| AI-002 | Start Technical PRD (skill bmad-prd)                   | [R&D Lead] | [YYYY-MM-DD] | PRD-T v0.1 draft in {{DOCS_TOOL}}          | 📝     |
| AI-003 | Start Functional PRD (skill bmad-prd)                  | [PO]       | [YYYY-MM-DD] | PRD-F v0.1 draft in {{DOCS_TOOL}}          | 📝     |
| AI-004 | Set up project in tooling                              | [DevOps]   | [YYYY-MM-DD] | Repo, CI/CD, DEV/STG environments          | 📝     |
| AI-005 | Initial compliance analysis                            | [Security] | [YYYY-MM-DD] | Privacy impact assessment if applicable    | 📝     |

## 10. Next Steps and Gate 1 Preparation

**Immediate (this week)**:

1. Complete action items AI-001 to AI-005
2. Schedule Discovery sessions (PO + R&D)
3. Identify key stakeholders for interviews

**Sprint 1 (next 2 weeks)**:

1. Run skill `bmad-prd` with PO
2. Run skill `bmad-prd` with R&D Lead
3. Identify critical technical PoCs

**Gate 1 Objective** (in [N] weeks):

- Functional and Technical PRD complete
- Cross-review approved (skill `review-cruzado`)
- Risk log updated (skill `risk-log`)
- Technical feasibility PoC reports (if applicable)

## 11. Project Success Criteria

### Business Metrics

- [ ] [Specific KPI 1 — target numeric value]
- [ ] [Specific KPI 2 — target numeric value]
- [ ] [Specific KPI 3 — target numeric value]

### Technical Metrics

- [ ] Performance: [specific metric]
- [ ] Availability: [target SLA]
- [ ] Security: 0 critical/high vulnerabilities
- [ ] Compliance: Certifications obtained

### Process Metrics

- [ ] Timeline: ±5% of target date
- [ ] Budget: ±5% of approved budget
- [ ] Quality: >85% gate pass rate on first attempt

## 12. Signatures and Commitments

| Role              | Name   | Signature | Date         | Commitment                                 |
| ----------------- | ------ | --------- | ------------ | ------------------------------------------ |
| **Sponsor**       | [Name] | ⭐        | [YYYY-MM-DD] | Budget and escalation guaranteed           |
| **Product Owner** | [Name] | ⭐        | [YYYY-MM-DD] | PRDs and prioritization committed          |
| **Tech Lead**     | [Name] | ⭐        | [YYYY-MM-DD] | Technical quality and mentoring guaranteed |
| **Scrum Master**  | [Name] | ⭐        | [YYYY-MM-DD] | Facilitation and metrics committed         |

---

**Document generated by**: skill `kickoff` v1.5.0
**Next review**: Post Gate 1 or in 30 days
**Storage**: {{DOCS_TOOL}} → [URL to complete post-meeting]
```

## Execution Rules

### Pre-Meeting (AI Automation)

- **Sections 1-6**: Auto-populated from approved Business Case data
- **Regulatory context**: Automatically identify compliance requirements based on product line
- **Stakeholder mapping**: Include all critical roles for project success
- **Risk seeding**: Pre-populate with typical project risks from knowledge base

### During Meeting (Human Facilitation)

- **Max 90 minutes**: Structure prevents scope creep and ensures focus
- **Decision recording**: Every decision must have rationale and responsible party
- **SMART action items**: Specific, Measurable, Achievable, Relevant, Time-bound
- **Regulatory awareness**: Address compliance early, especially for sensitive data

### Post-Meeting (Documentation)

- **Immediate distribution**: Share within 24h of meeting
- **{{DOCS_TOOL}} storage**: Centralized knowledge management
- **{{TRACKING_TOOL}} epic creation**: Link meeting outcomes to trackable work
- **Gate 1 preparation**: Clear next steps toward Discovery phase completion

## Examples

See `examples/` directory for domain-specific kickoff examples:

- `examples/project-kickoff-output.md` — Generic kickoff output example
- `examples/domains/` — Domain-specific examples (e.g., {{DOMAIN_EXAMPLES}})
- `examples/domain-example.md` — Domain-specific examples for {{DOMAIN_TYPE}} projects

## Dependencies and References

### Required Skills

- **Prerequisite**: `business-case` — Must have approved BC before kickoff
- **Prerequisite**: `/advance-gate 0` — Gate 0 must pass before kickoff meeting
- **Follow-up**: `bmad-prd` — Action item for PO post-kickoff
- **Follow-up**: `bmad-prd` — Action item for R&D Lead post-kickoff
- **Follow-up**: `tracking-integration` — Create project structure in {{TRACKING_TOOL}}

### Templates and Documents

- **Main template**: templates/kickoff.md — Structured agenda format
- **README template**: templates/readme.md — Project setup documentation
- **Contributing template**: templates/contributing.md — Development guidelines

### Checklists and Standards

- **Team formation**: docs/checklists/repo-structure.md — Team setup requirements
- **Compliance validation**: docs/checklists/security-compliance.md — Regulatory requirements
- **Process adherence**: docs/standards/org.md — Organizational standards
- **Sprint structure**: docs/standards/sprint-commitment.md — Sprint commitment format

### Project-Specific References

- **Domain knowledge**: Client configuration and industry context (if available)
- **Project context**: docs/projects/ — Project-specific compliance and context
- **Technology standards**: rules/tech-stack.md — Technical constraints
- **Team structure**: rules/project.md — Role definitions and responsibilities

## Common Kickoff Scenarios

### When to Use This Skill

✅ **ALWAYS use when**: Gate 0 has passed approval
✅ **ALWAYS use when**: Business Case is approved and team is assigned
✅ **ALWAYS use when**: Starting any new technology project formally
✅ **ALWAYS use when**: Project sponsor requests formal project initiation
✅ **ALWAYS use when**: Regulatory compliance project requires formal documentation

### Triggering Phrases

- "Prepare kick-off meeting"
- "Generate kick-off agenda"
- "Project kick-off documentation"
- "Gate 0 passed, now what?"
- "Start project formally"
- "Begin discovery preparation"
- "Stakeholder alignment meeting"
- "Project initiation documents"
- "Team formation meeting"

### Integration with SDLC Workflow

```
Business Case → Gate 0 → KICKOFF SKILL → Discovery Phase
                ↑                        ↓
            (PME approval)        (PO + R&D start PRDs)
```

## Quality Criteria

### Meeting Success Metrics

- [ ] All key stakeholders present (attendance >90%)
- [ ] All sections 1-11 completed with real data
- [ ] Minimum 5 action items with SMART criteria
- [ ] Risk register seeded with 3+ identified risks
- [ ] Next steps clearly defined for Discovery phase
- [ ] Document published to {{DOCS_TOOL}} within 24h

### Handoff to Discovery Phase

- [ ] PRD initiation action items assigned
- [ ] {{TRACKING_TOOL}} epic created with proper structure
- [ ] Team roles and responsibilities confirmed
- [ ] Compliance requirements identified and documented
- [ ] Risk log initialized with monitoring plan

---

## Quality Assurance

### Validation Script

This skill includes automated validation via `scripts/validate-examples.ts`:

```bash
# Validate skill examples and structure
npx tsx scripts/validate-examples.ts
```

**Validation includes:**

- Example completeness and correctness
- Project kickoff orchestration compliance patterns
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

| Version | Date       | Author                       | Changes                                                                                      |
| ------- | ---------- | ---------------------------- | -------------------------------------------------------------------------------------------- |
| 1.5.1   | 2026-06-09 | TL: BMad-coherence batch-fix | Added "Relationship to BMad" note (LIDR-unique Phase-1 governance artifact)                  |
| 1.5.0   | 2026-06-09 | TL: lang+tool agnostic       | Language to English-default-configurable; abstracted Jira/Confluence/Slack via tool-registry |
| 1.1.0   | 2026-03-09 | TL: Lead Engineer            | Enhanced with domain examples, expanded template, regulatory context, comprehensive workflow |
| 1.0.0   | 2025-02-01 | SM: Scrum Master             | Initial basic version                                                                        |
