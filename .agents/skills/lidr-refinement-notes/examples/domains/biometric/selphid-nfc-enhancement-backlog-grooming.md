# Backlog Grooming: SelphID NFC Enhancement for European eID

**Session Date**: March 12, 2025, 10:00-12:00 CET
**Sprint**: Sprint 25 Mid-Point Refinement
**Product Owner**: Miguel Santos (R&D Lead)
**Scrum Master**: Patricia Ruiz
**Participants**: 7/9 team members (Carlos and Isabel on client meeting)

---

## Session Context

### Epic Overview

**SELPHID-EPIC-003**: "Enhanced NFC Reading for European eID Compliance"

- **Business Driver**: eIDAS regulation compliance for Level 2 authentication
- **Market Value**: €3.8M potential revenue from government contracts
- **Timeline**: Q2 2025 (June 30 deadline for public tender submissions)
- **Compliance**: eIDAS Level 2, ISO 14443, Common Criteria EAL4+

### Current State Assessment

- **SelphID v5.1**: Basic NFC reading with 98.2% success rate
- **Supported Documents**: Spanish DNIe 3.0, some EU passports
- **Gap Analysis**: Missing support for 12 European eID formats
- **Performance Issue**: NFC reading takes 6-8 seconds (target: <4 seconds)

### Regulatory Pressure

- **Public Tender Deadline**: June 15, 2025 (3 months)
- **Certification Required**: Common Criteria evaluation by Q2 end
- **Compliance Gap**: PACE v2 protocol implementation missing

---

## User Stories Refined

### SELPHID-2501: PACE v2 Protocol Implementation

#### Story Description

"As a European citizen with an eID card using PACE v2, I want to authenticate using NFC so that I can access government services with the highest security level"

#### Biometric Context & Discussion

- **Elena (Backend)**: "PACE v2 requires cryptographic handshake before biometric template access. Current implementation only supports Basic Access Control."
- **David (iOS)**: "iOS Core NFC has PACE support since iOS 13, but implementation requires careful key management."
- **Fernando (Security)**: "PACE v2 is mandatory for eIDAS Level 2. Without it, we can't bid for government contracts."

#### Technical Requirements Deep Dive

- **PACE Protocol**: Password Authenticated Connection Establishment
- **Cryptographic Implementation**: Elliptic Curve Diffie-Hellman key agreement
- **Security Standards**: BSI TR-03110, ICAO 9303 compliance
- **Performance Target**: Complete PACE handshake in <2 seconds

#### Refined Acceptance Criteria

```gherkin
Given a European eID card with PACE v2 protection
And the user has provided the CAN (Card Access Number) or PIN
When the NFC reading process initiates PACE authentication
Then the cryptographic handshake should complete within 2 seconds
And the secure channel should be established with 256-bit encryption
And biometric template extraction should proceed automatically
And the process should comply with BSI TR-03110 Part 3 specifications
And error handling should provide clear guidance for failed authentication
```

#### Advanced BDD Scenarios for Biometric Integration

```gherkin
Scenario: PACE v2 with biometric template extraction
  Given an Italian CIE (Carta d'Identità Elettronica) with PACE v2
  And the user enters the correct 8-digit CAN
  When NFC establishes PACE secure channel
  Then biometric template should be extracted within 3 seconds
  And facial template should match photo data from chip
  And template quality score should be ≥85/100
  And GDPR consent should be recorded for biometric processing

Scenario: PACE authentication failure handling
  Given a German ID card with PACE v2 enabled
  And the user provides incorrect PIN (3 attempts remaining)
  When PACE authentication fails
  Then the system should display remaining attempts
  And log the failed attempt for security audit
  And offer alternative authentication methods (if available)
  And prevent brute force attacks with progressive delays
```

#### Estimation Complexity

- **Story Points**: 42 SP (XXL - Epic level complexity)
- **Development Effort**:
  - Elena (Backend): 32h PACE protocol implementation
  - David (iOS): 24h Core NFC integration + Secure Enclave
  - Roberto (Web): 16h WebNFC API limitations workaround
  - Security review: 16h (Fernando + external cryptography expert)
- **Research Component**: 24h (BSI standard analysis, reference implementation study)

#### Risk Assessment

- **High Risk**: Cryptographic implementation complexity
- **Medium Risk**: Device compatibility across EU countries
- **Low Risk**: UI/UX changes required

#### Dependencies

- **External**: BSI reference implementation access (2-week approval)
- **Internal**: Security framework update (SELPHID-2490, Sprint 24)
- **Certification**: Common Criteria lab engagement (€25,000 budget)

---

### SELPHID-2502: Multi-Country eID Support Matrix

#### Story Description

"As a citizen of any EU member state, I want SelphID to read my national eID card so that I can use the same verification process across borders"

#### Document Support Matrix Discussion

- **María (QA)**: "We need test cards from 27 EU countries. That's a logistics nightmare and significant cost."
- **David (iOS)**: "Each country has slightly different NFC implementations. We need a compatibility layer."
- **Miguel (PO)**: "Priority order: Germany, France, Italy, Netherlands first - they represent 60% of market volume."

#### European eID Landscape Analysis

| Country         | Card Type      | NFC Standard | PACE Version | Priority | Estimated Users |
| --------------- | -------------- | ------------ | ------------ | -------- | --------------- |
| **Germany**     | eAusweise      | ISO 14443-B  | PACE v2      | P0       | 65M             |
| **France**      | CNI            | ISO 14443-A  | PACE v1/v2   | P0       | 55M             |
| **Italy**       | CIE 3.0        | ISO 14443-A  | PACE v2      | P0       | 50M             |
| **Netherlands** | Nederlandse ID | ISO 14443-A  | Basic AC     | P1       | 15M             |
| **Spain**       | DNIe 3.0       | ISO 14443-B  | PACE v2      | P1       | 40M             |
| **Poland**      | dowód osobisty | ISO 14443-A  | Basic AC     | P2       | 35M             |
| **Belgium**     | eID            | ISO 14443-A  | PACE v1      | P2       | 10M             |

#### Refined Acceptance Criteria by Priority

```gherkin
# Priority 0 Countries (Must Have for Q2)
Given a German eAusweise with PACE v2 protection
When NFC reading is initiated with valid PIN/CAN
Then document data should be extracted with ≥98% success rate
And processing time should be ≤4 seconds including PACE handshake
And all mandatory eIDAS attributes should be available
And signature verification should confirm document authenticity

# Priority 1 Countries (Should Have for Q2)
Given a Dutch ID card with Basic Access Control
When NFC reading proceeds with MRZ data
Then document verification should complete within 5 seconds
And facial image extraction should maintain quality ≥80/100
And compatibility with older card versions should be maintained

# Priority 2 Countries (Could Have for Q3)
Given a Polish ID card with varying NFC implementations
When document reading encounters compatibility issues
Then graceful fallback to visual OCR should occur
And user should receive clear guidance about limitations
And success rate should be ≥85% across card versions
```

#### Country-Specific Technical Challenges

| Country         | Technical Challenge             | Solution Approach              | Effort (hours) |
| --------------- | ------------------------------- | ------------------------------ | -------------- |
| **Germany**     | PACE v2 + complex PIN handling  | Reference implementation study | 40h            |
| **France**      | CNI format variations (old/new) | Version detection algorithm    | 24h            |
| **Italy**       | CIE 3.0 specific certificates   | Certificate chain validation   | 32h            |
| **Netherlands** | Legacy BAC implementation       | Compatibility layer            | 16h            |
| **Spain**       | Already supported               | Testing optimization           | 8h             |

#### Test Strategy for Multi-Country Support

- **Real Cards**: Acquire 3-5 test cards per priority country (budget: €15,000)
- **Simulators**: Use government-provided card simulators where available
- **Field Testing**: Partner with EU offices for real-world validation
- **Regression**: Ensure existing Spanish DNIe support remains stable

#### Estimation

- **Story Points**: 89 SP (Epic - break into smaller stories)
- **Suggested Breakdown**:
  - SELPHID-2502-DE: German eAusweise support (21 SP)
  - SELPHID-2502-FR: French CNI support (18 SP)
  - SELPHID-2502-IT: Italian CIE support (16 SP)
  - SELPHID-2502-NL: Dutch ID support (12 SP)
  - SELPHID-2502-TEST: Multi-country testing framework (22 SP)

---

### SELPHID-2503: NFC Performance Optimization

#### Story Description

"As a user with any supported eID card, I want NFC reading to complete quickly so that the verification process is efficient and user-friendly"

#### Performance Analysis & Requirements

- **Current Baseline**: 6-8 seconds total (unacceptable for user experience)
- **Target Performance**: <4 seconds total, <2 seconds for PACE handshake
- **Benchmark**: Banking apps typically achieve 3-5 seconds for NFC payments

#### Performance Bottleneck Analysis

```
Current SelphID NFC Timeline:
- NFC Detection: 0.5s (acceptable)
- PACE Handshake: 3.2s (too slow - target: <2s)
- Document Reading: 2.1s (acceptable)
- Biometric Extraction: 1.8s (acceptable)
- Verification: 0.8s (acceptable)
Total: 8.4s → Target: <4s
```

#### Optimization Opportunities

| Component                | Current | Target | Optimization Strategy                   |
| ------------------------ | ------- | ------ | --------------------------------------- |
| **PACE Handshake**       | 3.2s    | <2.0s  | Cryptographic acceleration, key caching |
| **Document Reading**     | 2.1s    | <1.5s  | Optimized APDU command sequencing       |
| **Biometric Extraction** | 1.8s    | <1.0s  | Edge processing, compressed algorithms  |
| **NFC Detection**        | 0.5s    | <0.3s  | Improved antenna detection algorithms   |

#### Technical Implementation Strategy

- **Hardware Acceleration**: Use device crypto chips when available
- **Protocol Optimization**: Reduce APDU roundtrips by batching commands
- **Caching Strategy**: Cache PACE parameters for repeated card reads
- **Algorithm Optimization**: Biometric template extraction on device

#### Refined Acceptance Criteria

```gherkin
Given any supported European eID card
When the user initiates NFC verification
Then the complete process should finish within 4 seconds
And PACE handshake should complete within 2 seconds
And biometric template extraction should finish within 1 second
And user should see progress indicators throughout the process
And performance should be consistent across different device types
And battery consumption should increase by no more than 5%
```

#### Device Performance Matrix

| Device Category       | Current Performance | Target | Optimization Focus          |
| --------------------- | ------------------- | ------ | --------------------------- |
| **iPhone 13+**        | 6.2s                | 3.5s   | Secure Enclave optimization |
| **iPhone 11-12**      | 7.1s                | 4.0s   | A-series chip acceleration  |
| **iPhone XS/XR**      | 8.8s                | 5.0s   | Legacy iOS compatibility    |
| **Android High-end**  | 6.8s                | 3.8s   | Hardware security module    |
| **Android Mid-range** | 9.2s                | 4.5s   | Software optimization       |
| **Android Budget**    | 12.1s               | 6.0s   | Graceful degradation        |

#### Estimation

- **Story Points**: 28 SP (Large)
- **Development Effort**:
  - Elena: 32h backend optimization
  - David: 24h iOS Core NFC optimization
  - Laura: 24h Android NFC optimization
  - Performance testing: 16h (María + external lab)

---

## Biometric Integration Considerations

### Template Extraction from NFC Data

- **Facial Template**: Extract from chip photo, convert to verification template
- **Quality Assessment**: Ensure chip photo quality ≥85/100 for reliable verification
- **Template Matching**: Match extracted template against live capture
- **GDPR Compliance**: Process biometric data only with explicit consent

### Security Requirements for Biometric Data

- **Template Encryption**: AES-256 for templates extracted from NFC
- **Secure Channel**: All biometric data transmitted over PACE secure channel
- **Audit Logging**: Complete audit trail for biometric processing
- **Data Minimization**: Extract only necessary biometric attributes

### Cross-Modal Verification Strategy

```gherkin
Scenario: NFC photo to live face verification
  Given a user's eID card contains a facial photograph
  And NFC reading successfully extracts the photo
  When the user performs live facial verification
  Then the system should create templates from both sources
  And compare templates with ≥95% confidence threshold
  And handle lighting/aging variations gracefully
  And complete verification within 6 seconds total
```

---

## Compliance & Certification Requirements

### eIDAS Level 2 Authentication Requirements

- **Multi-factor Authentication**: Something you have (card) + something you know (PIN/CAN)
- **Cryptographic Standards**: ECDSA signatures, SHA-256 hashing minimum
- **Audit Requirements**: Complete logging of authentication events
- **Cross-border Recognition**: Mutual recognition across EU member states

### Common Criteria Evaluation (EAL4+)

- **Protection Profile**: BSI PP-0063 for eID terminals
- **Security Targets**: Detailed threat model and countermeasures
- **Vulnerability Assessment**: Independent security evaluation
- **Timeline**: 6-month evaluation process (start immediately)

### Data Protection Impact Assessment (DPIA)

- **High-Risk Processing**: Biometric data from government documents
- **Legal Basis**: Public interest + explicit consent for biometric processing
- **Cross-border Transfers**: Within EU/EEA only for government data
- **Retention Policies**: Maximum 24 hours for verification sessions

---

## Testing & Quality Assurance Strategy

### NFC Testing Requirements

| Test Type               | Scope                   | Resources               | Timeline |
| ----------------------- | ----------------------- | ----------------------- | -------- |
| **Card Compatibility**  | 27 EU countries         | Test cards + simulators | 6 weeks  |
| **Performance Testing** | 6 device categories     | Device lab              | 2 weeks  |
| **Security Testing**    | PACE protocol + crypto  | External security firm  | 4 weeks  |
| **Interoperability**    | Government test systems | Partner coordination    | 3 weeks  |
| **User Acceptance**     | Real citizen testing    | Pilot program           | 2 weeks  |

### Compliance Testing Matrix

| Standard            | Test Scope              | Authority              | Cost    | Duration |
| ------------------- | ----------------------- | ---------------------- | ------- | -------- |
| **ISO 14443**       | NFC protocol compliance | Independent lab        | €12,000 | 3 weeks  |
| **BSI TR-03110**    | PACE implementation     | BSI or notified body   | €18,000 | 4 weeks  |
| **Common Criteria** | Security evaluation     | CCRA lab               | €85,000 | 6 months |
| **eIDAS Technical** | Interoperability        | Member state authority | €5,000  | 2 weeks  |

### Real-World Testing Strategy

- **Government Partnerships**: Collaborate with 5 EU government offices
- **Citizen Beta Program**: 500 real users across target countries
- **Edge Case Collection**: Document unusual card variations and failures
- **Performance Monitoring**: Real-world performance metrics collection

---

## Risk Assessment & Mitigation

### High-Risk Items

| Risk                               | Impact                      | Probability | Mitigation                                         |
| ---------------------------------- | --------------------------- | ----------- | -------------------------------------------------- |
| **Common Criteria delays**         | Project failure             | Medium      | Start evaluation immediately, parallel development |
| **Country-specific crypto issues** | Partial market loss         | High        | Priority-based approach, fallback strategies       |
| **Performance targets not met**    | User experience degradation | Medium      | Aggressive optimization, hardware acceleration     |
| **Test card acquisition delays**   | Testing delays              | High        | Multiple suppliers, simulator alternatives         |

### Technical Risks

- **Cryptographic Complexity**: PACE v2 implementation errors could cause security vulnerabilities
- **Device Fragmentation**: Android NFC variations may cause compatibility issues
- **Certificate Management**: Government certificate changes could break validation
- **Performance Regression**: New features might slow existing functionality

### Business Risks

- **Regulatory Changes**: eIDAS updates could change requirements mid-development
- **Competitive Pressure**: Other vendors may release similar solutions faster
- **Government Adoption**: Slow government adoption could delay ROI
- **Budget Overruns**: Certification costs may exceed allocated budget

---

## Sprint Assignment Strategy

### Sprint 25 (Current Sprint - Remaining Capacity)

- SELPHID-2510: PACE v2 research and architecture design (8h)
- SELPHID-2511: German eAusweise protocol analysis (12h)

### Sprint 26 (Next Sprint - Primary Focus)

**Theme: "PACE v2 Foundation"**

- SELPHID-2501: PACE v2 protocol implementation (42 SP)
- SELPHID-2512: Cryptographic framework setup (13 SP)
- SELPHID-2513: iOS Core NFC PACE integration (18 SP)

### Sprint 27 (Following Sprint)

**Theme: "Multi-Country Support Phase 1"**

- SELPHID-2502-DE: German eAusweise support (21 SP)
- SELPHID-2502-FR: French CNI support (18 SP)
- SELPHID-2514: Testing framework for multi-country (15 SP)

### Sprint 28 (Q2 Delivery Focus)

**Theme: "Performance & Italian Support"**

- SELPHID-2503: NFC performance optimization (28 SP)
- SELPHID-2502-IT: Italian CIE support (16 SP)
- SELPHID-2515: Security testing and certification prep (12 SP)

### Sprint 29 (Q2 Final)

**Theme: "Quality & Certification"**

- SELPHID-2516: Common Criteria documentation (20 SP)
- SELPHID-2517: End-to-end testing with real cards (25 SP)
- SELPHID-2518: Performance validation and optimization (15 SP)

---

## Budget & Resource Requirements

### Development Resources

- **Team Capacity**: 60% of team dedicated to NFC enhancement
- **External Expertise**: Cryptography consultant (€8,000/month × 3 months)
- **Test Equipment**: EU eID cards and test devices (€15,000)
- **Certification**: Common Criteria evaluation (€85,000)

### Timeline Constraints

- **Hard Deadline**: June 15, 2025 (public tender submission)
- **Certification Deadline**: May 31, 2025 (Common Criteria certificate)
- **Performance Validation**: April 30, 2025 (field testing completion)

### Success Criteria

- **Functional**: Support for top 5 EU countries (Germany, France, Italy, Netherlands, Spain)
- **Performance**: <4 second total verification time
- **Security**: Common Criteria EAL4+ certification achieved
- **Business**: Ready for government tender submissions by deadline

---

## Action Items & Next Steps

### Immediate Actions (This Week)

1. **Common Criteria Lab Engagement** (Miguel): Initiate evaluation process
2. **Test Card Procurement** (María): Order test cards from priority countries
3. **BSI Reference Access** (Elena): Apply for PACE reference implementation
4. **Cryptography Consultant** (Fernando): Engage external expert

### Sprint 26 Preparation

1. **Architecture Review** (Ana): PACE v2 implementation design
2. **Security Framework** (Elena): Update crypto libraries and dependencies
3. **Device Lab Setup** (Antonio): Configure NFC testing environment
4. **Stakeholder Alignment** (Miguel): Government partner coordination

### Long-term Planning

1. **Market Research**: Additional EU countries demand analysis
2. **Patent Review**: Freedom to operate analysis for PACE implementations
3. **Partnership Strategy**: Government relationships for testing and validation
4. **Competitive Analysis**: Monitor competitor eIDAS compliance efforts

---

## Next Refinement Session

**Date**: March 19, 2025 (Sprint 26 planning preparation)
**Focus**: Performance optimization stories and testing strategy refinement
**Preparation Required**:

- PACE v2 architecture design review
- Test card procurement status update
- Common Criteria evaluation timeline confirmation

---

## Refinement Session Assessment

### Session Quality

- **Technical Depth**: Appropriate for complex NFC/cryptographic features
- **Business Alignment**: Clear connection to government tender opportunities
- **Risk Identification**: Comprehensive risk assessment with mitigation strategies
- **Estimation Quality**: Conservative estimates reflecting cryptographic complexity

### Team Preparedness

- **Domain Knowledge**: Strong understanding of eIDAS and NFC requirements
- **Technical Confidence**: High confidence in implementation approach
- **Resource Awareness**: Clear understanding of external dependencies
- **Timeline Realism**: Realistic about certification and testing timelines

### Sprint Planning Readiness

- **Ready for Sprint 26**: PACE v2 implementation story fully defined
- **Research Required**: German and French specific requirements need deeper analysis
- **Dependencies Identified**: Test equipment and external expert engagement critical path

**Product Owner Notes**: Strong technical session with good focus on business objectives. Need to accelerate Common Criteria engagement to meet deadline. Team demonstrates good understanding of regulatory compliance requirements.

**Scrum Master Notes**: Team engagement excellent. Some concern about sprint capacity with complex cryptographic work. May need to adjust Sprint 26 commitment based on PACE implementation complexity. External dependencies well identified and tracked.
