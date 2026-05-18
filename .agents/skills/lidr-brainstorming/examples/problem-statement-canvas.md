# Problem Statement Canvas — Biometric Domain

## Template for Structured Problem Definition

### Project Information

- **Date**: [YYYY-MM-DD]
- **Facilitator**: [ROLE: NAME]
- **Participants**: [LIST OF ROLES/NAMES]
- **Domain**: [Facial Recognition / Voice Verification / Document Processing / Behavioral Biometrics]

---

## 1. Current Situation Analysis

### What's Happening Now?

```
Describe the current state without solutions or judgment.
Focus on observable facts and measurable impacts.

Example:
"Our facial recognition SDK has a 3% False Rejection Rate (FRR)
for users wearing masks, compared to 0.8% without masks. This
affects 40% of authentication attempts during pandemic conditions."
```

**Current State**:
[DETAILED DESCRIPTION]

**Affected Stakeholders**:

- **Primary**: [Who directly experiences the problem]
- **Secondary**: [Who is impacted by the consequences]
- **Tertiary**: [Who might be affected indirectly]

**Quantitative Impact** (if available):

- **Business Metrics**: Revenue, users, conversions, etc.
- **Technical Metrics**: Performance, accuracy, availability, etc.
- **User Experience**: Friction, completion rates, satisfaction, etc.

---

## 2. Biometric Context Assessment

### Domain-Specific Factors

| Factor                    | Current State                                | Impact Level         | Notes                       |
| ------------------------- | -------------------------------------------- | -------------------- | --------------------------- |
| **Biometric Modality**    | [Facial/Voice/Document/Behavioral]           | High/Medium/Low      | [Specific characteristics]  |
| **Data Sensitivity**      | [PII/Biometric templates/Raw images]         | Critical/High/Medium | [GDPR Art. 9 implications]  |
| **Accuracy Requirements** | FAR: [x%], FRR: [y%]                         | Critical/High/Medium | [Current vs required]       |
| **Regulatory Scope**      | [GDPR/eIDAS/PSD2/Local]                      | Critical/High/Medium | [Specific compliance needs] |
| **Security Level**        | [Authentication/Identification/Surveillance] | Critical/High/Medium | [Attack surface analysis]   |

### Compliance Requirements

- **GDPR Article 9**: [Explicit consent status, DPIA required?]
- **eIDAS**: [Assurance level required: low/substantial/high]
- **PSD2**: [SCA requirements, exemptions applicable?]
- **ISO 30107**: [PAD requirements, attack scenarios]
- **Local Regulations**: [Specific regional requirements]

---

## 3. Root Cause Analysis — 5 Whys

**Problem Statement**: [One-sentence description of the core problem]

### Why Analysis

1. **Why does this problem occur?**
   - Answer: [First level cause]

2. **Why does [first level cause] happen?**
   - Answer: [Second level cause]

3. **Why does [second level cause] happen?**
   - Answer: [Third level cause]

4. **Why does [third level cause] happen?**
   - Answer: [Fourth level cause]

5. **Why does [fourth level cause] happen?**
   - Answer: [Root cause identified]

### Root Cause Summary

**Primary Root Cause**: [The fundamental issue]

**Contributing Factors**:

- [Factor 1]: [Description and weight]
- [Factor 2]: [Description and weight]
- [Factor 3]: [Description and weight]

---

## 4. Pain Points Mapping

### User Journey Pain Points

| Stage                  | Current Experience | Pain Level   | Impact            | Frequency   |
| ---------------------- | ------------------ | ------------ | ----------------- | ----------- |
| **Onboarding**         | [Description]      | High/Med/Low | [Business impact] | [How often] |
| **Authentication**     | [Description]      | High/Med/Low | [Business impact] | [How often] |
| **Verification**       | [Description]      | High/Med/Low | [Business impact] | [How often] |
| **Error Recovery**     | [Description]      | High/Med/Low | [Business impact] | [How often] |
| **Account Management** | [Description]      | High/Med/Low | [Business impact] | [How often] |

### Technical Pain Points

| Component          | Issue                        | Severity          | Complexity to Fix | Dependencies |
| ------------------ | ---------------------------- | ----------------- | ----------------- | ------------ |
| **Algorithm**      | [Performance/Accuracy issue] | Critical/High/Med | High/Med/Low      | [List]       |
| **Data Pipeline**  | [Processing bottleneck]      | Critical/High/Med | High/Med/Low      | [List]       |
| **Security Layer** | [Vulnerability/Compliance]   | Critical/High/Med | High/Med/Low      | [List]       |
| **Integration**    | [API/SDK limitations]        | Critical/High/Med | High/Med/Low      | [List]       |
| **Infrastructure** | [Scaling/Reliability]        | Critical/High/Med | High/Med/Low      | [List]       |

---

## 5. Success Criteria Definition

### Functional Success Criteria

**Primary Outcomes** (Must Have):

1. [Specific, measurable outcome]
2. [Specific, measurable outcome]
3. [Specific, measurable outcome]

**Secondary Outcomes** (Should Have):

1. [Additional desired outcome]
2. [Additional desired outcome]

### Non-Functional Success Criteria

| Category        | Current State        | Target State         | Measurement Method    |
| --------------- | -------------------- | -------------------- | --------------------- |
| **Accuracy**    | FAR: [x%], FRR: [y%] | FAR: [x%], FRR: [y%] | [Testing methodology] |
| **Performance** | [Current latency]    | [Target latency]     | [Measurement tools]   |
| **Security**    | [Current threats]    | [Target protection]  | [Security assessment] |
| **Compliance**  | [Current gaps]       | [Full compliance]    | [Audit criteria]      |
| **Usability**   | [Current UX score]   | [Target UX score]    | [User testing]        |
| **Scalability** | [Current capacity]   | [Target capacity]    | [Load testing]        |

### Business Success Criteria

- **ROI**: [Expected return on investment]
- **Timeline**: [Implementation timeline]
- **Adoption**: [User adoption targets]
- **Risk Reduction**: [Security/compliance improvements]

---

## 6. Constraints and Assumptions

### Technical Constraints

- **Platform**: [iOS/Android/Web/Backend limitations]
- **Algorithm**: [Accuracy/Performance trade-offs]
- **Infrastructure**: [Cloud/On-premise requirements]
- **Security**: [Encryption/Key management requirements]
- **Integration**: [Existing system dependencies]

### Regulatory Constraints

- **Data Residency**: [Geographic restrictions]
- **Certification**: [Required standards/audits]
- **Consent**: [Explicit consent requirements]
- **Retention**: [Data retention limits]
- **Transfer**: [Cross-border data transfer rules]

### Business Constraints

- **Budget**: [Available resources]
- **Timeline**: [Market deadlines]
- **Team**: [Available expertise]
- **Competition**: [Market pressures]
- **Partnership**: [Strategic alliances]

### Assumptions

- **Technology**: [Assumed capabilities/improvements]
- **Regulation**: [Stability of current laws]
- **Market**: [User behavior/adoption patterns]
- **Resources**: [Team availability/skills]
- **Integration**: [Third-party system stability]

---

## 7. Stakeholder Impact Analysis

### Impact Matrix

| Stakeholder        | Current Impact               | Desired Outcome          | Influence Level | Interest Level | Engagement Strategy       |
| ------------------ | ---------------------------- | ------------------------ | --------------- | -------------- | ------------------------- |
| **End Users**      | [Friction/Security concerns] | [Seamless experience]    | Low             | High           | [User research/feedback]  |
| **Business Users** | [Operational overhead]       | [Efficiency gains]       | Medium          | High           | [Business case/ROI]       |
| **Developers**     | [Integration complexity]     | [Simple APIs]            | High            | Medium         | [Technical documentation] |
| **Compliance**     | [Audit findings]             | [Full compliance]        | High            | High           | [Regular reviews]         |
| **Security**       | [Risk exposure]              | [Risk mitigation]        | High            | High           | [Security assessments]    |
| **Product**        | [Feature gaps]               | [Market differentiation] | High            | High           | [Product roadmap]         |

---

## 8. Problem Statement Summary

### Validated Problem Statement

```
For [target user group]
Who [current situation/pain]
The [product/solution category]
Is a [problem description]
That impacts [business/user metrics]
Unlike [current alternatives]
Our solution should [core value proposition]
```

**Example**:

```
For financial institutions implementing digital onboarding
Who need to verify customer identity while maintaining GDPR compliance
The current facial recognition systems
Are producing 3% false rejections with masked users
That impacts 40% of authentication attempts and user satisfaction
Unlike solutions that ignore compliance or sacrifice accuracy
Our solution should provide 99.2% accuracy with full GDPR compliance
```

### Key Problem Elements

- **WHO**: [Specific user/customer segment]
- **WHAT**: [Specific problem/pain point]
- **WHERE**: [Context/environment where problem occurs]
- **WHEN**: [Timing/frequency of problem]
- **WHY**: [Root cause identified]
- **HOW MUCH**: [Quantified impact/cost]

---

## 9. Validation and Next Steps

### Problem Validation Checklist

- [ ] Problem statement reviewed with primary stakeholders
- [ ] Quantitative data collected and validated
- [ ] Root cause analysis completed and verified
- [ ] Success criteria agreed upon by key stakeholders
- [ ] Constraints and assumptions documented and accepted
- [ ] Regulatory requirements identified and understood

### Transition to Solution Design

**Ready for Ideation When**:

- [ ] Problem is clearly defined and validated
- [ ] Success criteria are specific and measurable
- [ ] Stakeholders are aligned on problem priority
- [ ] Constraints and assumptions are documented
- [ ] Business case for solving is established

**Next Steps**:

1. **Ideation Session**: Schedule brainstorming with key stakeholders
2. **Solution Research**: Investigate existing solutions and patterns
3. **Technical Feasibility**: Assess technical approach options
4. **Regulatory Review**: Validate compliance requirements
5. **Resource Planning**: Estimate effort and timeline for solutions

---

## Document Control

| Field           | Value                   |
| --------------- | ----------------------- |
| **Version**     | 1.0                     |
| **Status**      | [Draft/Review/Approved] |
| **Owner**       | [ROLE: NAME]            |
| **Reviewed By** | [REVIEWERS]             |
| **Approved By** | [APPROVERS]             |
| **Next Review** | [DATE]                  |

## Related Documents

- Business Case: [LINK]
- PRD Funcional: [LINK]
- PRD Técnico: [LINK]
- Risk Log: [LINK]
- Architecture Documents: [LINK]
