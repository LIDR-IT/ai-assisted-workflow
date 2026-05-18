---
name: lidr-domain-research
id: domain-research
version: "1.2.0"
last_updated: "2026-03-25"
updated_by: "TL: tier3-remediation"
status: active
phase: 0
owner_role: "PO"
automation: true
domain_agnostic: true
description: 'This skill should be used when the user asks to "research the domain", "analyze market patterns", "investigate competitors", "study industry best practices", "explore domain knowledge", or "conduct competitive analysis". Provides systematic domain exploration for Discovery phase projects. ALWAYS use when investigating domain patterns or industry practices before design decisions.'
---

# Skill: Domain Research

Systematic domain knowledge research and exploration framework based on LIDR SDLC Methodology's domain-research pattern. This skill transforms superficial market awareness into deep domain intelligence through structured investigation methodologies.

## Purpose

Enable comprehensive domain exploration that uncovers market dynamics, competitive landscapes, regulatory requirements, and emerging patterns essential for informed product decisions. Goes beyond basic competitive analysis to build foundational domain expertise for Discovery phase work.

## When to Use

Apply this skill during Discovery phase (Phase 2) when:

- Starting a new product or market entry
- Expanding into adjacent domains
- Validating business case assumptions
- Preparing PRD foundation with market intelligence
- Investigating regulatory or compliance landscapes
- Understanding user behavior patterns in the domain
- Benchmarking against industry standards

## Core Research Framework

### 1. Domain Landscape Mapping

#### Market Structure Analysis

Define the domain boundaries and key players:

```
Market Segments:
├── Primary segment (core focus)
├── Adjacent segments (expansion opportunities)
├── Upstream segments (suppliers/enablers)
└── Downstream segments (distribution/consumption)

Key Players:
├── Direct competitors (same solution, same market)
├── Indirect competitors (different solution, same problem)
├── Adjacent players (same solution, different market)
├── Disruptors (new model/technology)
└── Ecosystem partners (complementary solutions)
```

#### Value Chain Decomposition

Map how value flows through the domain:

- Raw inputs → Processing → Distribution → End consumption
- Identify bottlenecks, inefficiencies, and control points
- Spot opportunities for disintermediation or optimization

### 2. Competitive Intelligence

#### Multi-Dimensional Competitor Analysis

Go beyond feature comparison to understand strategic positioning:

| Analysis Dimension   | Investigation Focus                                  |
| -------------------- | ---------------------------------------------------- |
| **Product Strategy** | Feature depth vs breadth, platform vs point solution |
| **Go-to-Market**     | Sales model, pricing strategy, customer acquisition  |
| **Technology Stack** | Architecture choices, technical differentiation      |
| **Business Model**   | Revenue streams, unit economics, scale dynamics      |
| **Market Position**  | Brand perception, customer loyalty, switching costs  |

#### Pattern Recognition

Identify recurring patterns across successful players:

- Common architectural decisions
- Shared regulatory compliance approaches
- Typical customer acquisition funnels
- Standard pricing model evolution
- Technology adoption sequences

### 3. Domain Expertise Development

#### Knowledge Source Triangulation

Build comprehensive understanding from multiple authoritative sources:

**Primary Sources:**

- Industry practitioner interviews
- Customer discovery sessions
- Domain expert consultations
- Regulatory body documentation

**Secondary Sources:**

- Market research reports (Gartner, Forrester, etc.)
- Academic papers and conference proceedings
- Industry association publications
- Technical standards documentation

**Observational Sources:**

- Product trial and testing
- Community forum analysis
- Patent landscape review
- Technology blog and thought leadership content

#### Domain Vocabulary Mastery

Develop fluency in domain-specific terminology:

- Core concepts and their precise definitions
- Technical jargon and acronyms
- Regulatory and compliance terminology
- Customer language and pain point descriptions

### 4. Trend Analysis and Future Mapping

#### Emerging Pattern Detection

Identify trends that will shape the domain:

- Technology evolution trajectories
- Regulatory change signals
- Customer behavior shifts
- New entrant strategies
- Market consolidation patterns

#### Scenario Planning

Develop multiple future scenarios:

- **Base case:** Continuation of current trends
- **Optimistic case:** Accelerated positive changes
- **Pessimistic case:** Market contraction or disruption
- **Wild card:** Unexpected events or breakthroughs

## Research Execution Process

### Phase 1: Domain Scoping (2-4 hours)

#### Define Research Boundaries

Create clear research scope:

```markdown
## Domain Research Scope

**Primary Domain:** [Core market/technology area]
**Geographic Scope:** [Regions to investigate]
**Time Horizon:** [Historical lookback + future projection]
**Customer Segments:** [Target user groups]
**Technology Stack:** [Relevant technologies]
**Regulatory Context:** [Applicable regulations]

**Research Questions:**

1. [Primary research question]
2. [Secondary research question]
3. [Additional specific questions]
```

#### Initial Hypothesis Formation

Document assumptions to validate/refute:

- Market size and growth projections
- Customer pain point intensity
- Competitive differentiation opportunities
- Technology readiness levels
- Regulatory compliance requirements

### Phase 2: Desk Research (8-12 hours)

#### Systematic Information Gathering

Follow structured research protocol:

**Market Intelligence Collection:**

1. Industry reports and analyst coverage
2. Public company financial disclosures
3. Patent filings and technical publications
4. Regulatory submissions and compliance guides
5. Academic research and conference papers

**Competitive Analysis Execution:**

1. Product feature auditing and comparison
2. Pricing strategy analysis
3. Marketing message and positioning review
4. Customer review and feedback analysis
5. Technology architecture investigation

**Documentation Standards:**

- Source all information with URLs and access dates
- Distinguish between facts, opinions, and speculation
- Note confidence levels and information quality
- Track conflicting information for further investigation

### Phase 3: Primary Research (4-8 hours)

#### Expert Interview Protocol

Structure conversations for maximum insight:

**Preparation:**

- Research interviewee background
- Prepare open-ended questions
- Plan for 45-60 minute sessions
- Create comfortable interview environment

**Interview Structure:**

1. **Context Setting** (5 min): Role, experience, current focus
2. **Domain Landscape** (15 min): Market evolution, key changes
3. **Pain Points** (15 min): Biggest challenges, unmet needs
4. **Solutions** (10 min): Current approaches, effectiveness
5. **Future Outlook** (10 min): Trends, predictions, disruptions

**Post-Interview Process:**

- Immediate note synthesis (within 2 hours)
- Key insight extraction
- Quote attribution and permission
- Follow-up question identification

### Phase 4: Synthesis and Analysis (4-6 hours)

#### Pattern Recognition and Insight Development

Transform raw research into actionable intelligence:

**Data Triangulation:**

- Cross-reference findings from multiple sources
- Identify convergent vs. divergent perspectives
- Resolve conflicting information through additional research
- Assign confidence levels to key findings

**Competitive Positioning Map:**
Create visual representation of competitive landscape:

```
   High Performance
        │
        │  [Competitor A]
        │      │
        │      │  [Our Opportunity?]
Low Cost ──────┼────────── High Cost
        │      │
        │  [Competitor B]
        │
   Low Performance
```

**Market Gap Analysis:**
Identify underserved segments or unmet needs:

- Customer segments with poor solutions
- Price points without adequate offerings
- Use cases requiring better technology
- Geographic markets with limited competition

## Adaptable Research Frameworks by Domain Type

### For Highly Regulated Industries (Healthcare, Finance, Government)

#### Regulatory Landscape Mapping

**Global Compliance Matrix Template:**
| Region | Primary Regulation | {{INDUSTRY_TYPE}} Implications | Compliance Complexity |
|--------|-------------------|----------------------------|---------------------|
| {{REGION_1}} | {{PRIMARY_REG}} | {{DATA_PROTECTION_REQUIREMENTS}} | {{COMPLEXITY_LEVEL}} |
| {{REGION_2}} | {{SECONDARY_REG}} | {{INTEROPERABILITY_REQUIREMENTS}} | {{COMPLEXITY_LEVEL}} |
| {{REGION_3}} | {{REGIONAL_LAWS}} | {{TRANSPARENCY_REQUIREMENTS}} | {{COMPLEXITY_LEVEL}} |
| {{REGION_4}} | {{LOCAL_REGULATIONS}} | {{LOCALIZATION_REQUIREMENTS}} | {{COMPLEXITY_LEVEL}} |

**Technology Evolution Tracking Framework:**

- {{CORE_TECHNOLOGY}} advancement curves and maturity cycles
- {{PRIMARY_ALGORITHM}} accuracy/performance improvement rates
- {{HARDWARE_COMPONENT}} capability progression patterns
- {{DEPLOYMENT_MODEL}} adoption trends and implementation patterns

### For Technology-Driven Markets (SaaS, Platform, API)

#### Market Structure Analysis

**Value Chain Evolution Template:**

```
Traditional: Customer → {{INTERMEDIARY_1}} → {{INTERMEDIARY_2}} → Service Provider
Platform 1.0: Customer → {{PLATFORM_LAYER}} → {{INTERMEDIARY_1}} → Service Provider
Platform 2.0: Customer → {{PLATFORM_LAYER}} (direct) → Service Provider
Next Gen: Customer → {{AUTOMATION_LAYER}} → Service Provider
```

**{{INDUSTRY_TYPE}} Progression Patterns:**

- {{PILOT_PHASE}} → {{LIMITED_DEPLOYMENT}} → {{FULL_AUTHORIZATION}}
- {{MANDATE_PHASE}} → {{STANDARDIZATION_PHASE}} → {{INTEGRATION_PHASE}}
- {{BASIC_COMPLIANCE}} → {{ENHANCED_REQUIREMENTS}} → {{REAL_TIME_MONITORING}}

### For {{DOMAIN_TYPE}} Industries (Regulated B2B)

#### Evidence and Approval Requirements

**Regulatory Pathway Framework:**

- {{PRESUBMISSION_PROCESS}} meetings and guidance documents
- {{VALIDATION_STUDY}} design requirements and protocols
- {{REAL_WORLD_EVIDENCE}} acceptance criteria and standards
- {{POST_DEPLOYMENT}} surveillance and monitoring obligations

**Market Adoption Analysis Framework:**

- {{STAKEHOLDER_WORKFLOW}} integration challenges and solutions
- {{ENTERPRISE_PROCUREMENT}} cycles and decision factors
- {{END_USER_ACCEPTANCE}} and engagement patterns
- {{VALUE_PATHWAY}} development and monetization models

## Output Deliverables

### Executive Research Summary

**Format:** 2-page executive brief
**Content:**

- Market opportunity quantification
- Competitive landscape overview
- Key success factors identification
- Strategic recommendations

### Detailed Research Report

**Format:** 15-25 page comprehensive analysis
**Sections:**

1. **Executive Summary** (2 pages)
2. **Domain Overview** (3-4 pages)
3. **Competitive Analysis** (4-6 pages)
4. **Market Dynamics** (3-4 pages)
5. **Technology Landscape** (2-3 pages)
6. **Regulatory Environment** (2-3 pages)
7. **Strategic Implications** (2-3 pages)
8. **Appendices** (sources, interview summaries)

### Research Database

**Format:** Structured knowledge repository
**Components:**

- Company profiles with key metrics
- Technology trend tracking database
- Regulatory change monitoring system
- Expert contact database with interaction history

## Integration with Existing Skills

### Business Case Enhancement

Feeds research insights into business case development:

- Market size validation and refinement
- Competitive differentiation support
- Risk factor identification and mitigation
- Revenue model validation

### PRD Foundation

Provides domain expertise for PRD creation:

- User workflow understanding
- Industry standard compliance requirements
- Technology architecture guidance
- Feature prioritization frameworks

### Risk Assessment

Informs risk identification and evaluation:

- Regulatory change probabilities
- Competitive response scenarios
- Technology obsolescence risks
- Market timing considerations

## Quality Criteria

### Research Depth Indicators

- **Source Diversity:** Minimum 3 source types (primary, secondary, observational)
- **Expert Validation:** At least 2 domain expert interviews
- **Competitive Coverage:** Analysis of top 5 direct competitors
- **Temporal Scope:** 2-year historical + 3-year forward view

### Insight Quality Standards

- **Actionability:** Each insight suggests specific strategic decisions
- **Specificity:** Quantified where possible with confidence intervals
- **Differentiation:** Identifies non-obvious opportunities or threats
- **Validation:** Triangulated across multiple independent sources

### Documentation Standards

- **Traceability:** All claims linked to specific sources
- **Reproducibility:** Method documented for future updates
- **Accessibility:** Findings usable by non-domain experts
- **Timeliness:** Research reflects current market conditions

## Common Anti-Patterns

### Surface-Level Competitive Analysis

**Problem:** Feature comparison without strategic context
**Solution:** Focus on business model, go-to-market, and customer acquisition strategies

### Analysis Paralysis

**Problem:** Endless research without decision points
**Solution:** Time-box research phases and define decision criteria upfront

### Confirmation Bias

**Problem:** Seeking information that confirms pre-existing beliefs
**Solution:** Actively seek disconfirming evidence and alternative perspectives

### Outdated Information Reliance

**Problem:** Using stale market research in fast-moving domains
**Solution:** Prioritize recent primary sources and real-time indicators

## Success Metrics

### Research Process Efficiency

- Time from research initiation to executive summary: < 3 weeks
- Expert interview scheduling success rate: > 80%
- Source quality score (authority, recency, relevance): > 4.0/5.0

### Business Impact

- PRD quality improvement (measured by stakeholder feedback)
- Business case accuracy (validated against 12-month outcomes)
- Strategic decision confidence level increase
- Market entry success rate improvement

## Additional Resources

### Reference Files

For comprehensive domain research methodologies:

- **`references/research-methodologies.md`** - Detailed research frameworks and techniques
- **`references/source-evaluation.md`** - Criteria for assessing information quality and reliability
- **`references/interview-guides.md`** - Expert interview scripts by domain type

### Example Files

Working examples in `examples/`:

- **`domain-market-research.md`** - Complete domain-specific market analysis example
- **`fintech-competitive-analysis.md`** - FinTech competitive intelligence example
- **`research-synthesis-template.md`** - Report structure template

### Scripts

Automation utilities in `scripts/`:

- **`source_tracker.py`** - Bibliography and source management
- **`competitor_monitor.py`** - Automated competitive intelligence gathering
- **`trend_analyzer.py`** - Social media and news trend analysis

## Quality Assurance

### Validation Script

This skill includes automated validation via `scripts/validate-examples.ts`:

```bash
# Validate skill examples and structure
npx tsx scripts/validate-examples.ts
```

**Validation includes:**

- Example completeness and correctness
- Domain research methodology compliance patterns
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

## Changelog

| Version | Date       | Author                 | Changes                                                                                                                                                        |
| ------- | ---------- | ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1.2.0   | 2026-03-25 | TL: tier3-remediation  | Domain-agnostic normalization: removed domain-specific terminology from section headers and examples list; generalized identity verification framework section |
| 1.1.0   | 2026-03-16 | System: QA Enhancement | Quality assurance integration                                                                                                                                  |
| 1.0.0   | 2026-03-15 | TL: Claude             | Initial version with LIDR SDLC framework integration                                                                                                           |
