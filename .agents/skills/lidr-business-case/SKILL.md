---
name: lidr-business-case
id: business-case
version: "1.2.1"
last_updated: "2026-06-09"
updated_by: "TL: BMad-coherence batch-fix"
status: active
phase: 1
stage: analysis
owner_role: "TL"
automation: false
domain_agnostic: true
language_default: en
integrations: []
description: >
  Generate a Business Case document from a business problem or initiative request. Use for any budget justification, project approval, or ROI analysis needs. Essential when requesting resources, teams, or timeline extensions. Trigger for strategic initiatives, cost-benefit analysis, or investment decisions. Use when receiving a new project request from Business, CTO, or R&D; when justifying budget, team, or timeline to a sponsor; when Gate 0 (Intake) requires a BC before proceeding. Triggers on phrases like "create business case", "justify this project", "new initiative", "we need approval for", "Gate 0 preparation", "budget request", "resource allocation", "investment proposal". Output: English by default; artifact language follows the client `language` setting (see `_shared/lidr/integrations/`). Audience: executive (Sponsor, CTO, PME). ALWAYS use at project initiation to justify investment and secure stakeholder approval.
---

# Business Case Generator

Phase: 1 — Origination | Gate: 0 (Intake) | Output: English by default; artifact language follows the client `language` setting (see `_shared/lidr/integrations/`).

Tools resolve via the central registry `_shared/lidr/integrations/tool-registry.yaml`; the active client binds concrete tools in `clients/<CODE>.yaml`.

## Relationship to BMad

BMad's `bmad-prfaq` and `bmad-product-brief` shape the product concept and value proposition. This skill is LIDR-unique: a formal Gate-0 financial/ROI Business Case (costs, NPV, payback, alternatives analysis, sponsor sign-off) — the governance artifact that secures investment approval before discovery begins.

## Workflow

1. Gather input (business problem description, quantitative data if available)
2. If input is poor (vague idea only) → generate discovery questions, mark all sections `[PENDING]`
3. Generate BC following the template below
4. Validate against the pre-delivery checklist
5. Present for Gate 0 approval

## Input Requirements

| Input                        | Required      | Notes                                     |
| ---------------------------- | ------------- | ----------------------------------------- |
| Business problem description | ✅            | Min 2-3 paragraphs with context           |
| Quantitative impact data     | Desirable     | Revenue, affected clients, SLA violations |
| Strategic alignment          | Desirable     | Which OKR or strategic pillar             |
| Regulatory context           | If applicable | Deadlines, fines, certifications          |

If input is insufficient: generate discovery questions FIRST. NEVER invent financial data, business metrics, or names. Use `[PENDING: real data — suggested source: X]`.

## Output Location

Generated documents should be saved to: **`docs/projects/{projectName}/business-case.md`**

Example: `docs/projects/identity-sdk-v3/business-case.md`

## Output Template

ALWAYS use this exact structure:

```markdown
# Business Case: [PROJECT NAME]

| Field             | Value           |
| ----------------- | --------------- |
| **ID**            | BC-[YYYY]-[NNN] |
| **Date**          | [YYYY-MM-DD]    |
| **Version**       | 1.0 — Draft     |
| **Requester**     | [Name] — [Role] |
| **Sponsor**       | [Name] — [Role] |
| **OKR Alignment** | [OKR-XX]        |

## 1. Executive Summary

> [2-3 paragraphs: problem, proposal, expected benefit. Executive must decide from this alone.]

## 2. Business Problem

### 2.1 Description (business terms, not technical)

### 2.2 Quantified Impact (Revenue, Clients, Operations, Regulatory, Reputation)

### 2.3 Cost of Doing Nothing (project at 6 and 12 months)

## 3. Proposed Solution

### 3.1 Description (the "what", not the technical "how")

### 3.2 Scope (includes / excludes)

### 3.3 Expected Benefits (quantitative + qualitative table)

## 4. Alternatives Analysis

> Minimum 3: (A) Do nothing, (B) Proposed solution, (C) Alternative
> Evaluation table: Cost, Timeline, Risk, Strategic alignment, Complexity → Recommendation

## 5. Financial Analysis

### 5.1 Costs (one-time + recurring, include 15-20% contingency)

### 5.2 Financial Benefits (Year 1-3)

### 5.3 ROI, Payback, NPV

## 6. Risks (min 5, categories: Technical, Resources, Timeline, Business, Regulatory, Security)

> Each with: probability, impact, severity, mitigation, owner

## 7. High-Level Timeline (phases with durations and dependencies)

## 8. Assumptions and Dependencies

## 9. Required Resources (roles, dedication, cost)

## 10. Success Criteria (SMART)

## 11. Approval — Gate 0 (Sponsor, CTO, PME signatures)

## Version History
```

## Validation Checklist

Before delivering, verify:

- [ ] Executive summary is self-sufficient for decision-making
- [ ] Problem described in BUSINESS impact terms
- [ ] ≥3 alternatives evaluated with consistent criteria
- [ ] Costs include 15-20% contingency
- [ ] Each risk has owner and concrete mitigation
- [ ] Success criteria are SMART
- [ ] All invented data marked as `[PENDING]`
- [ ] Approval section has correct roles for Gate 0

## Key Rules

- Write for executives, not engineers. No technical jargon in body.
- Quantify whenever possible: "~40 hours/sprint saved" > "significant time savings"
- Every estimate is based on assumptions — declare them explicitly.
- Alternatives analysis must be honest: evaluate objectively, don't bias toward the "obvious" option.
- Risks must be specific to the domain, technology, and team — not generic.

## Example Sections

### Example Executive Summary

```markdown
## 1. Executive Summary

The company needs to modernize its API platform to support the projected 150% growth in the number of integrations that enterprise clients demand. The current system cannot scale beyond 50 concurrent integrations, limiting our growth in the enterprise segment and putting €1.8M of commercial pipeline at risk.

The proposed solution will implement a new microservices-based API architecture with capacity for 500+ concurrent integrations, with an investment of €185K and a 240% ROI in 12 months. The project will last 5 months and requires 2 senior developers + 1 systems architect.

This project is critical to capture the 60% of the available enterprise market and maintain our technological leadership against the competition.
```

### Example Problem Description

```markdown
## 2. Business Problem

### 2.1 Description

Our enterprise clients require complex integrations that our current API system cannot support efficiently. The current architectural limits (50 concurrent connections, latency >2s) are causing contract losses and degradation of the customer experience in the most profitable segment.

### 2.2 Quantified Impact

- **Revenue**: Projected loss of €1.8M annually (enterprise pipeline blocked)
- **Clients**: 12 enterprise clients under evaluation requiring >50 integrations
- **Operations**: 35% of API calls fail during load peaks
- **Competitiveness**: Competitors offer 10x superior capabilities
- **Reputation**: Enterprise NPS dropped 15 points due to integration problems

### 2.3 Cost of Doing Nothing

- **6 months**: €900K lost + 6 enterprise clients not signed + technical degradation
- **12 months**: €1.8M lost + market position loss + accumulated technical debt
```

### Example Financial Analysis

```markdown
## 5. Financial Analysis

### 5.1 Costs

| Concept                         | One-time (€) | Annual (€) | Notes                    |
| ------------------------------- | ------------ | ---------- | ------------------------ |
| Development (2 devs × 5 months) | 100,000      | -          | €50K/dev/month           |
| Systems architect               | 30,000       | -          | 5 months consulting      |
| Infrastructure upgrade          | 25,000       | 12,000     | Cloud + CDN + monitoring |
| Migration and testing           | 15,000       | -          | Data migration + QA      |
| Contingency (15%)               | 25,500       | 1,800      |                          |
| **TOTAL**                       | **195,500**  | **13,800** |                          |

### 5.2 Financial Benefits

| Year | New contracts (€) | Retained revenue (€) | Avoided costs (€) | Total (€) |
| ---- | ----------------- | -------------------- | ----------------- | --------- |
| 2025 | 800,000           | 600,000              | 100,000           | 1,500,000 |
| 2026 | 1,200,000         | 900,000              | 150,000           | 2,250,000 |
| 2027 | 1,500,000         | 900,000              | 200,000           | 2,600,000 |

### 5.3 ROI

- **Payback period**: 4.1 months
- **ROI 12 months**: 240%
- **NPV (3 years, 10% discount)**: €1.6M
```

## Iteration Process

### When Business Case is Rejected at Gate 0

**Common Rejection Reasons:**

1. **Insufficient quantification** - "Show me the numbers"
2. **Weak alternatives analysis** - "Have you considered other options?"
3. **Unrealistic timeline/budget** - "This seems too optimistic"
4. **Poor risk assessment** - "What could go wrong?"
5. **Unclear success criteria** - "How do we know it worked?"
6. **Missing stakeholder buy-in** - "Who else supports this?"

### Re-submission Process:

1. **Address feedback specifically** - Don't rewrite everything, focus on gaps identified
2. **Gather additional data** - Interview customers, benchmark competitors, get vendor quotes
3. **Involve stakeholders** - Get explicit support letters from affected departments
4. **Create fallback scenarios** - Show minimum viable version if budget is cut
5. **Add pilot/proof-of-concept option** - Reduce risk with phased approach

### Template for Addressing Feedback:

```markdown
## Response to Gate 0 Feedback

| Sponsor Comment                      | Action Taken                           | Evidence/Improvement                       |
| ------------------------------------ | -------------------------------------- | ------------------------------------------ |
| "The numbers seem optimistic"        | Review with CFO + competitor benchmark | Section 5.2 updated with conservative data |
| "What happens if the project fails?" | Detailed risk analysis                 | Section 6: 8 specific risks + mitigations  |
| "Timeline too aggressive"            | Re-estimation with technical team      | Section 7: Timeline extended 6→8 months    |

**Changes in this version**: [Specific list of what was modified]
```

## Tips for Success

### Before Writing

- **Get sponsor alignment first** - Understand their priorities and concerns
- **Interview affected users** - Get real pain points, not assumed ones
- **Gather competitive intelligence** - What are others doing?
- **Validate with Finance** - Are your cost categories and calculations realistic?

### Writing Excellence

- **Lead with impact, not features** - "Save €500K" not "Implement new algorithm"
- **Use analogies for technical concepts** - "Like upgrading from dial-up to fiber"
- **Show alternatives honestly** - Don't stack the deck, evaluate fairly
- **Be specific with risks** - "Developer shortage in Q2" not "resource constraints"
- **Include quick wins** - Show value delivery in first 30-60 days

### Executive Presentation

- **Start with the money** - Revenue impact, cost avoidance, competitive advantage
- **Use visual aids** - Charts for financials, timeline with milestones
- **Prepare for tough questions** - "What if budget is cut 30%?" "What if timeline doubles?"
- **Have a champion in the room** - Someone who benefits directly from the solution
- **End with clear ask** - "I need €165K and approval to start January 15th"

### Common Pitfalls to Avoid

- **Technology focus** - Executives care about business outcomes, not technical details
- **Sandbagging** - Unrealistically conservative estimates lose credibility
- **Feature creep** - Keep scope focused on core problem
- **Missing the political dimension** - Understand who wins/loses from this change
- **No follow-up plan** - How will you report progress and results?

## Resources

- **Standard templates**: Use the template structure above - it's proven effective across 50+ approved business cases
- **Financial validation**: Work with Finance team to validate cost categories and ROI calculations
- **Risk assessment**: Consult with domain experts (Security, Legal, Operations) for realistic risk scenarios
- **Industry benchmarks**: Research Gartner, Forrester reports for market data and best practices
- **Regulatory compliance**: Engage Legal/Compliance early for projects touching regulated areas

## Next Steps After Generation

## Quality Assurance

### Validation Script

This skill includes automated validation via `scripts/validate-examples.ts`:

```bash
# Validate skill examples and structure
npx tsx scripts/validate-examples.ts
```

**Validation includes:**

- Example completeness and correctness
- Business case and project justification compliance patterns
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

Gate 0 approved → skill `kickoff/` (kick-off meeting) + skill `tracking-integration/` (create project tracking)

## Changelog

| Version | Date       | Author                 | Changes                                                                                |
| ------- | ---------- | ---------------------- | -------------------------------------------------------------------------------------- |
| 1.2.0   | 2026-06-09 | TL: lang+tool agnostic | Language to English-default-configurable; abstracted tool references via tool-registry |
