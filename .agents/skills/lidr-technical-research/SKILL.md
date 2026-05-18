---
name: lidr-technical-research
id: technical-research
version: "1.0.2"
last_updated: "2026-03-25"
updated_by: "TL: Domain-Agnostic Normalization"
status: active
phase: 0
owner_role: "TL"
automation: false
domain_agnostic: true
description: "Systematic technical feasibility investigation for complex engineering decisions. Use when evaluating architecture patterns, performance analysis, integration complexity, technology stack decisions, or platform migrations. Complements poc-report with systematic research methodology. Triggers on 'technical research', 'feasibility study', 'architecture evaluation', 'technology assessment', 'integration analysis', 'performance investigation', 'platform comparison', 'technical due diligence'. Essential before major technical decisions or when multiple solution paths exist. Output in English. ALWAYS use when evaluating complex technical decisions requiring systematic investigation."
---

# Technical Research Framework

**Systematic technical feasibility investigation for complex engineering decisions before implementation.**

Phase: 2 — Discovery (or any phase requiring technical investigation) | Language: English

> **When to use**: Before making major technical decisions, evaluating architecture patterns, comparing technology options, assessing integration complexity, or investigating performance requirements. Essential for technology stack decisions, integration assessments, and regulatory compliance validation.

## Workflow

1. **Research Scope Definition**: Define specific technical questions, constraints, and success criteria
2. **Multi-Source Investigation**: Gather evidence from documentation, benchmarks, expert analysis, and comparative studies
3. **Framework Analysis**: Apply systematic evaluation criteria including performance, scalability, security, maintainability
4. **Risk Assessment**: Identify technical risks, dependencies, and mitigation strategies
5. **Comparative Analysis**: Compare multiple approaches with weighted criteria
6. **Evidence Synthesis**: Compile findings with actionable recommendations
7. **Decision Documentation**: Create structured technical research report with clear recommendations
8. **Follow-up Actions**: Define next steps, PoCs needed, or implementation recommendations

## Research Framework

### Investigation Domains

#### 1. Architecture Patterns Research

- **Microservices vs Monolith**: Evaluate for specific domain and team structure
- **Event-Driven vs Request-Response**: Assess for domain-specific processing pipelines
- **CQRS vs CRUD**: Analyze for read-heavy domain verification systems
- **Serverless vs Container-based**: Compare for scalable system workloads
- **Edge vs Cloud Processing**: Evaluate for mobile and distributed applications

#### 2. Performance Analysis

- **Benchmark Comparison**: Industry standards vs actual measurements
- **Scalability Assessment**: Load testing patterns and capacity planning
- **Latency Analysis**: Network, processing, and storage bottlenecks
- **Resource Utilization**: CPU, memory, and storage optimization
- **Cost-Performance Trade-offs**: Infrastructure cost modeling

#### 3. Integration Complexity Assessment

- **API Compatibility**: RESTful, GraphQL, gRPC evaluation
- **Authentication Standards**: OAuth 2.0, OIDC, SAML compatibility
- **Data Format Analysis**: JSON, Protocol Buffers, MessagePack comparison
- **Real-time Communication**: WebSockets, SSE, polling patterns
- **Third-party Integration**: SDK quality, documentation, support assessment

#### 4. Technology Stack Evaluation

- **Framework Comparison**: React vs Vue, Express vs Fastify, PostgreSQL vs MongoDB
- **Library Assessment**: Security, performance, community support, license compatibility
- **Platform Analysis**: AWS vs Azure vs GCP for specific workloads
- **Tool Evaluation**: CI/CD, monitoring, testing framework selection
- **Language/Runtime**: Node.js vs Java vs .NET for specific requirements

#### 5. Security & Compliance Investigation

- **Regulatory Compliance**: GDPR, eIDAS, banking regulation technical requirements
- **Security Framework**: OWASP compliance, encryption standards, audit requirements
- **Domain Standards**: Industry-specific standards and certification requirements applicable to the domain
- **Data Protection**: Encryption at rest/transit, key management, data residency
- **Vulnerability Assessment**: Known CVEs, security audit requirements

## Input Requirements

| Input                    | Required      | Source                       | Purpose                                          |
| ------------------------ | ------------- | ---------------------------- | ------------------------------------------------ |
| Research Questions       | ✅            | Technical session / PRD-T    | Specific technical uncertainties to resolve      |
| Technical Context        | ✅            | PRD-T, existing architecture | Current system constraints and requirements      |
| Success Criteria         | ✅            | Business requirements        | Measurable criteria for technology selection     |
| Resource Constraints     | ✅            | PM / Budget                  | Time, budget, team skill limitations             |
| Regulatory Requirements  | If applicable | Legal / Security             | Compliance standards affecting technical choices |
| Performance Requirements | ✅            | PRD-T / NFRs                 | Latency, throughput, availability targets        |
| Integration Requirements | ✅            | System architecture          | Existing systems and planned integrations        |

## Research Methods

### 1. Documentation Analysis

- **Official Documentation**: Framework guides, API references, best practices
- **Architecture Decision Records**: Industry patterns and lessons learned
- **Case Studies**: Similar implementations in comparable industry domains
- **White Papers**: Academic research and industry analysis
- **Security Assessments**: Vulnerability reports, security audits

### 2. Empirical Investigation

- **Proof of Concept**: Small-scale implementation and testing
- **Benchmarking**: Performance testing with realistic datasets
- **Load Testing**: Stress testing under expected traffic patterns
- **Security Testing**: Penetration testing and vulnerability scanning
- **Integration Testing**: API compatibility and data flow validation

### 3. Expert Consultation

- **Internal Experts**: Senior developers, architects, domain specialists
- **Vendor Consultation**: Technology provider technical teams
- **Community Insights**: Stack Overflow, GitHub discussions, technical forums
- **Industry Analysis**: Gartner, RedMonk, ThoughtWorks Technology Radar
- **Academic Research**: Papers on system performance, security protocols, and domain-specific topics

### 4. Comparative Analysis Framework

| Criteria            | Weight | Evaluation Method         | Success Threshold           |
| ------------------- | ------ | ------------------------- | --------------------------- |
| **Performance**     | 25%    | Benchmark testing         | Meets NFR requirements      |
| **Scalability**     | 20%    | Load testing + modeling   | Handles expected growth 2x  |
| **Security**        | 25%    | Vulnerability assessment  | Zero critical/high CVEs     |
| **Maintainability** | 15%    | Code complexity analysis  | Low technical debt          |
| **Integration**     | 10%    | API compatibility testing | <2 weeks integration effort |
| **Cost**            | 5%     | TCO calculation           | Within budget constraints   |

## Output Template

```markdown
# Technical Research Report: {Title}

## Executive Summary

**Research Question**: [What technical uncertainty was investigated]
**Recommendation**: [Primary recommendation with confidence level]
**Impact**: [Effect on project timeline, budget, risk]
**Next Steps**: [Immediate actions required]

## Research Scope

### Primary Questions

1. [Question 1 with measurable criteria]
2. [Question 2 with measurable criteria]
3. [Question 3 with measurable criteria]

### Investigation Constraints

- Time: [research duration]
- Budget: [cost constraints]
- Resources: [team availability]
- Risk tolerance: [acceptable risk level]

## Methodology

### Research Approaches

- [ ] Documentation analysis
- [ ] Empirical testing (PoC)
- [ ] Expert consultation
- [ ] Benchmark comparison
- [ ] Security assessment

### Evaluation Framework

[Weighted criteria table with scoring method]

## Investigation Results

### Option 1: [Technology/Approach Name]

**Score**: [X/10]

#### Strengths

- [Strength 1 with evidence]
- [Strength 2 with evidence]

#### Weaknesses

- [Weakness 1 with impact assessment]
- [Weakness 2 with mitigation strategy]

#### Evidence

- [Benchmark data, documentation references, expert opinions]

### Option 2: [Technology/Approach Name]

**Score**: [X/10]

[Same structure as Option 1]

### Option 3: [Technology/Approach Name]

**Score**: [X/10]

[Same structure as Option 1]

## Comparative Analysis

| Criteria    | Option 1    | Option 2    | Option 3    | Winner     |
| ----------- | ----------- | ----------- | ----------- | ---------- |
| Performance | [Score]     | [Score]     | [Score]     | [Best]     |
| Scalability | [Score]     | [Score]     | [Score]     | [Best]     |
| Security    | [Score]     | [Score]     | [Score]     | [Best]     |
| **Total**   | **[Score]** | **[Score]** | **[Score]** | **[Best]** |

## Risk Assessment

### Technical Risks

| Risk     | Probability    | Impact         | Mitigation |
| -------- | -------------- | -------------- | ---------- |
| [Risk 1] | [Low/Med/High] | [Low/Med/High] | [Strategy] |

### Dependencies

- [External dependency 1 with contingency plan]
- [External dependency 2 with contingency plan]

## Recommendations

### Primary Recommendation: [Option X]

**Rationale**: [Why this option scores highest]
**Implementation Path**: [How to proceed]
**Timeline Impact**: [Effect on project schedule]
**Resource Requirements**: [Team skills, budget, time needed]

### Alternative Approaches

**Fallback Option**: [Option Y - when to consider]
**Future Evolution**: [Path for future improvements]

## Next Steps

1. [Immediate action 1 - who, when]
2. [Immediate action 2 - who, when]
3. [PoC requirements if needed]
4. [Architecture documentation updates]
5. [Team training/hiring needs]

## Appendix

### Detailed Benchmark Data

[Tables, charts, performance measurements]

### Reference Materials

- [Documentation links]
- [Expert consultation notes]
- [Academic papers]
- [Industry reports]

### Assumptions

- [Technical assumption 1]
- [Business assumption 2]
- [Resource assumption 3]
```

## Domain-Specific Research Scenarios

This skill is domain-agnostic. The research methodology, evaluation framework, and output template apply to any technical domain.

For a worked example of how to apply this framework to an identity verification platform (algorithm selection, cloud infrastructure, mobile SDK architecture, integration complexity), see:

**[Identity Verification Platform Example](examples/identity-platform-example.md)** — Identity verification platform use case with domain-specific technology research scenarios.

## Quality Standards

### Research Rigor

- **Evidence-based**: All recommendations backed by quantitative data or expert analysis
- **Comparative**: Minimum 3 alternatives evaluated with consistent criteria
- **Measurable**: All success criteria have numeric thresholds
- **Risk-aware**: Technical, business, and compliance risks explicitly addressed
- **Actionable**: Clear next steps with resource requirements and timeline

### Domain Expertise

- **Regulatory Context**: Applicable regulations and compliance standards affecting technical decisions
- **Performance Standards**: Domain-specific performance metrics (latency, throughput, accuracy thresholds)
- **Security Requirements**: Data protection, access control, audit trail requirements
- **Usability Criteria**: Accessibility, device compatibility, user experience impact
- **Compliance Validation**: Audit trail, data residency, privacy by design

### Documentation Standards

- **Reproducible**: Methodology clearly documented for future reference
- **Version Controlled**: Research evolves with new findings and requirements
- **Cross-referenced**: Links to PRD-T, ADRs, and related technical documents
- **Executive Summary**: Non-technical stakeholder communication
- **Technical Detail**: Implementation team guidance and specifications

## Integration with Related Skills

### Relationship to poc-report

- **Technical Research**: Broad investigation of multiple approaches and alternatives
- **PoC Report**: Focused validation of specific hypothesis with measurable criteria
- **Sequence**: Technical research → selection → PoC validation → implementation

### Relationship to architecture-doc

- **Technical Research**: Investigates and recommends architecture patterns
- **Architecture Doc**: Documents selected architecture with implementation details
- **Sequence**: Technical research → architecture decisions → architecture documentation

### Relationship to adr (Architecture Decision Records)

- **Technical Research**: Provides evidence and analysis for architecture decisions
- **ADR**: Documents final decisions with rationale and consequences
- **Sequence**: Technical research → decision → ADR documentation → implementation

---

## Changelog

| Versión | Fecha      | Autor                             | Cambios                                                                                                                                                                                                             |
| ------- | ---------- | --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1.0.2   | 2026-03-25 | TL: Domain-Agnostic Normalization | Replaced domain-specific terminology in instructions/workflow sections with generic equivalents; moved identity-platform research scenarios to examples/identity-platform-example.md                                |
| 1.0.0   | 2026-03-15 | Tech Lead: System                 | Initial version with LIDR SDLC Methodology systematic technical research framework, domain examples, integration with existing skills (poc-report, architecture-doc, adr), and comprehensive evaluation methodology |

## Quality Assurance

### Validation Script

This skill includes automated validation via `scripts/validate-examples.ts`:

```bash
# Validate skill examples and structure
npx tsx scripts/validate-examples.ts
```

**Validation includes:**

- Example completeness and correctness
- Technical research compliance patterns
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
