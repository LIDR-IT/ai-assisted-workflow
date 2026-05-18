# Technical Research Methodologies

## Overview

This document provides detailed methodologies for conducting systematic technical research in domain-specific and fintech domains.

## BMAD-Inspired Research Framework

### 1. Multi-Source Evidence Gathering

#### Primary Sources

- **Official Documentation**: Framework specifications, API references, security standards
- **Academic Papers**: Peer-reviewed research on domain-specific algorithms, performance benchmarks
- **Regulatory Guidelines**: GDPR Art. 9, eIDAS technical specifications, banking regulations
- **Industry Standards**: ISO 30107 (PAD), ISO 19795 (domain-specific performance testing)

#### Secondary Sources

- **Case Studies**: Implementation experiences from similar organizations
- **Community Insights**: Stack Overflow, GitHub discussions, technical forums
- **Vendor Analysis**: Technology provider documentation and support quality
- **Market Research**: Gartner, Forrester, IDC technology assessments

### 2. Empirical Validation Methods

#### Performance Benchmarking

```methodology
1. Define baseline metrics (current system performance)
2. Establish test environment (hardware, network, data volume)
3. Create realistic test scenarios (domain-specific verification load patterns)
4. Execute controlled tests (multiple runs, statistical significance)
5. Analyze results (P50, P95, P99 latencies, error rates)
6. Document findings (methodology, environment, results, limitations)
```

#### Security Assessment Protocol

```methodology
1. Threat modeling (identify attack vectors specific to domain-specific systems)
2. Vulnerability scanning (SAST, DAST, dependency analysis)
3. Penetration testing (authentication bypass, data extraction attempts)
4. Compliance validation (GDPR, eIDAS, banking regulation requirements)
5. Risk scoring (CVSS methodology for identified vulnerabilities)
6. Mitigation planning (cost-benefit analysis of security controls)
```

### 3. Comparative Analysis Framework

#### Technology Scoring Matrix

| Criteria            | Weight | Scoring Method           | {{CLIENT_NAME}} Context                             |
| ------------------- | ------ | ------------------------ | --------------------------------------------------- |
| **Performance**     | 25%    | Benchmark testing        | Verification latency < 2s P95                       |
| **Scalability**     | 20%    | Load testing + modeling  | Support 10K concurrent verifications                |
| **Security**        | 25%    | Vulnerability assessment | Zero critical CVEs, domain-specific data protection |
| **Compliance**      | 15%    | Regulatory mapping       | GDPR Art. 9, eIDAS substantial/high                 |
| **Integration**     | 10%    | API compatibility        | Banking core integration complexity                 |
| **Maintainability** | 5%     | Code quality metrics     | Long-term support and updates                       |

#### Weighted Decision Framework

```methodology
1. Define evaluation criteria with business justification
2. Assign weights based on project priorities
3. Establish scoring scale (1-10 with clear definitions)
4. Score each option against all criteria
5. Calculate weighted scores and rank alternatives
6. Perform sensitivity analysis (what if weights change?)
7. Document assumptions and limitations
```

## Domain-Specific Research Patterns

### domain-specific Algorithm Research

#### Performance Validation Protocol

```methodology
Research Question: "Does Algorithm X achieve target accuracy for {{CLIENT_NAME}} use cases?"

1. Dataset Preparation
   - Diverse demographic representation
   - Real-world lighting conditions
   - Attack scenario datasets (photos, videos, masks)
   - Minimum 10K samples for statistical significance

2. Metrics Collection
   - False Acceptance Rate (FAR)
   - False Rejection Rate (FRR)
   - Equal Error Rate (EER)
   - Processing time per verification
   - Resource utilization (CPU, memory, battery)

3. Comparative Analysis
   - Current algorithm baseline
   - Industry benchmark comparison
   - Competitive algorithm assessment
   - Cost-performance trade-off analysis

4. Decision Criteria
   - FAR < 0.01% (regulatory requirement)
   - FRR < 3% (usability threshold)
   - Processing < 2s P95 (user experience)
   - Mobile compatibility (mid-range devices)
```

#### Integration Complexity Assessment

```methodology
Research Question: "What is the integration effort for Technology Y?"

1. API Analysis
   - Documentation quality and completeness
   - SDK availability and platform support
   - Authentication and security model
   - Rate limiting and error handling

2. Technical Compatibility
   - Data format compatibility (JSON, Protocol Buffers)
   - Communication protocol support (REST, GraphQL, gRPC)
   - Real-time capability (WebSockets, SSE)
   - Existing system integration points

3. Implementation Effort Estimation
   - Development time (person-days)
   - Testing requirements (integration, performance, security)
   - Infrastructure changes needed
   - Training and documentation requirements

4. Risk Assessment
   - Vendor dependency risk
   - Technology obsolescence risk
   - Support and maintenance risk
   - Regulatory compliance risk
```

### Cloud Infrastructure Research

#### Multi-Cloud Assessment Framework

```methodology
Research Question: "Which cloud platform best supports {{CLIENT_NAME}}'s domain-specific processing?"

1. Performance Analysis
   - Global latency measurements
   - Auto-scaling responsiveness
   - GPU/specialized hardware availability
   - Network throughput and reliability

2. Compliance Evaluation
   - Data residency capabilities
   - Regulatory certifications (SOC 2, ISO 27001)
   - GDPR compliance features
   - Banking regulation support

3. Cost Modeling
   - Compute cost for domain-specific processing
   - Storage cost for encrypted domain-specific templates
   - Network cost for global verification
   - Support and professional services cost

4. Vendor Assessment
   - Technical support quality
   - Roadmap alignment with domain-specific needs
   - Partnership and integration opportunities
   - Exit strategy and data portability
```

### Security Framework Research

#### domain-specific Data Protection Assessment

```methodology
Research Question: "How does Security Framework Z protect domain-specific templates?"

1. Cryptographic Analysis
   - Encryption algorithms and key lengths
   - Key management and rotation procedures
   - Template irreversibility validation
   - Quantum-resistance future-proofing

2. Privacy Protection Evaluation
   - Template-to-template comparison (no plaintext exposure)
   - domain-specific reference storage models
   - User consent and withdrawal mechanisms
   - Data minimization and purpose limitation

3. Compliance Validation
   - GDPR Article 9 compliance
   - ISO 30107 PAD standard alignment
   - eIDAS technical specification conformance
   - Banking regulation data protection requirements

4. Implementation Assessment
   - Integration complexity with existing systems
   - Performance impact on verification speed
   - Operational overhead and monitoring
   - Incident response and breach procedures
```

## Research Quality Standards

### Evidence Standards

- **Quantitative Data**: All performance claims backed by measurements
- **Statistical Significance**: Minimum sample sizes for reliable results
- **Reproducible Methods**: Documented procedures for validation
- **Multiple Sources**: Cross-validation from independent sources
- **Bias Recognition**: Acknowledge vendor bias and competing interests

### Documentation Standards

- **Methodology Transparency**: Clear description of research approach
- **Assumption Documentation**: Explicit statement of limitations
- **Version Control**: Track research evolution and updates
- **Peer Review**: Internal review by domain experts
- **Executive Summary**: Non-technical stakeholder communication

### Decision Traceability

- **Research to Recommendation**: Clear link between findings and conclusions
- **Risk Documentation**: Explicit risk assessment and mitigation strategies
- **Success Criteria**: Measurable criteria for technology selection
- **Fallback Options**: Alternative approaches if primary choice fails
- **Implementation Roadmap**: Next steps and resource requirements

## Common Research Anti-Patterns

### Avoid These Approaches

#### Insufficient Evidence

❌ **Single Source Reliance**: Basing decisions only on vendor documentation
❌ **Anecdotal Evidence**: Using isolated success stories without broader validation
❌ **Shallow Analysis**: Surface-level comparison without deep technical investigation
❌ **Confirmation Bias**: Only seeking evidence that supports predetermined choices

#### Weak Methodology

❌ **Undefined Success Criteria**: Researching without clear decision framework
❌ **Unweighted Comparison**: Treating all evaluation criteria as equally important
❌ **Static Analysis**: Ignoring technology evolution and roadmap considerations
❌ **Context Ignorance**: Failing to consider specific domain-specific domain requirements

#### Poor Documentation

❌ **Results Only**: Documenting conclusions without methodology or assumptions
❌ **Technical Jargon**: Using language that excludes business stakeholders
❌ **Missing Alternatives**: Only documenting the recommended approach
❌ **No Follow-up**: Failing to define validation or success measures

## Integration with {{CLIENT_NAME}} SDLC

### Relationship to Other Skills

- **Precedes**: `poc-report` (validates specific hypotheses from research)
- **Informs**: `architecture-doc` (research findings guide architecture decisions)
- **Generates**: `adr` (major decisions documented as Architecture Decision Records)
- **Supports**: `prd-tecnico` (technical feasibility validation for PRD-T)

### Quality Gates Integration

- **Gate 1**: Technical research validates PRD-T feasibility assumptions
- **Gate 2**: Research findings inform requirements and epic breakdown
- **Gate 4**: Implementation validates research predictions
- **Gate 6**: Security research findings validated in security assessment

### Success Metrics

- **Decision Quality**: Reduced architecture changes post-implementation
- **Risk Mitigation**: Earlier identification of technical risks
- **Time to Market**: Faster implementation due to better technology choices
- **Stakeholder Alignment**: Improved technical decision communication
