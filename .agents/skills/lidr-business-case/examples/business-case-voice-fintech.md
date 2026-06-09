# Business Case: Voice Verification for Argentine Fintech

**Client**: Mercado Pago / Ualá (fintech example)
**Product**: {{CLIENT_NAME}} Voice + Platform
**Estimated Budget**: €95K
**Timeline**: 4 months
**Type**: Expansion of an existing client

## 1. Business Problem

### Current Situation

- **Phone authentication**: 8 minutes average per call
- **Saturated call center**: 45% of calls abandon after 4 min in queue
- **Operational costs**: €4.50 per authenticated phone transaction
- **Phone fraud**: 1.8% of phone transactions are fraudulent
- **Compliance**: Must comply with PCI DSS + BCRA Argentine regulation

### Regional Context

- **Argentina**: 89% of financial transactions via mobile/web
- **Strong phone culture**: 67% of users prefer phone for support
- **Argentine Spanish**: Regional variants (Rioplatense, Cordobés, Norteño)
- **BCRA regulation**: Requires strong authentication for transfers > $50K ARS

### Business Impact

- **Volume**: 180K authentication calls/month
- **Call center cost**: €810K annually
- **Lost revenue**: €1.2M from abandoned transactions
- **Fraud losses**: €45K annually in fraudulent phone transactions

## 2. Proposed Solution

### Technological Components

| {{CLIENT_NAME}} Product   | Function                              | Compliance                   |
| ------------------------- | ------------------------------------- | ---------------------------- |
| **Voice Verification**    | Voice authentication (1:1 matching)   | ISO 19794-13 voice templates |
| **Anti-spoofing**         | Detection of synthetic/replay attacks | ISO 30107-1 PAD              |
| **Platform**              | Orchestration + analytics             | PCI DSS Level 1 compliance   |
| **Spanish Language Pack** | Optimized for Argentine Spanish       | Regional dialects trained    |

### Improved Authentication Flow

1. **Incoming call** → IVR detects number + intent
2. **Voice enrollment** (first time) → Records passphrase "My voice is my password"
3. **Authentication** → Says passphrase + anti-spoofing verification
4. **Voice matching 1:1** → Stored template vs voice sample (score > 0.8)
5. **Risk scoring** → Combines voice + behavioral patterns
6. **Decision** → Auto-approval or escalation to a human agent

### GDPR + BCRA Compliance

- **Biometric data**: Irreversible template stored 60 days max
- **Cross-border**: Data does not leave Argentina (Example (AWS): São Paulo region)
- **Audit trail**: Immutable log of all authentications
- **User rights**: Enrollment/un-enrollment via web self-service
- **BCRA Article 5**: Strong customer authentication compliance

## 3. Quantifiable Benefits

### Call Center Cost Reduction

| Concept                       | Current | With Voice  | Annual Savings |
| ----------------------------- | ------- | ----------- | -------------- |
| Time per authentication       | 8 min   | 45 sec      | €650K          |
| Agents needed                 | 85 FTE  | 35 FTE      | €420K          |
| Call abandonment              | 45%     | 8% (target) | €380K          |
| **Total operational savings** |         |             | **€1.45M**     |

### Fraud Reduction

- **Phone fraud rate**: 1.8% → 0.3% (target)
- **Fraud savings**: €32K annually
- **False accept rate**: < 0.01% (vs 2.1% current)

### UX Improvement

- **Phone NPS**: 12 → 65 (target)
- **Customer effort score**: 7.2 → 3.1 (target)
- **Retention impact**: +2.3% from a better experience

## 4. Investment and ROI

### Total Investment

| Concept                   | Cost     | Notes                            |
| ------------------------- | -------- | -------------------------------- |
| Voice platform licenses   | €60K     | 200K authentications/month       |
| Spanish language training | €15K     | Argentinian dialect optimization |
| API integration           | €12K     | 6 weeks development              |
| PCI DSS compliance audit  | €8K      | Required for financial services  |
| **Total investment**      | **€95K** |                                  |

### Financial Return

- **Direct savings**: €1.45M (call center reduction)
- **Revenue protection**: €380K (reduced abandonment)
- **Total benefits**: €1.83M
- **ROI year 1**: 1,826% ((1.83M - 0.095M) / 0.095M \* 100)
- **Payback period**: 0.6 months

## 5. Technical Risks and Mitigations

### Accuracy Risks

| Risk                        | Probability | Impact | Mitigation                               |
| --------------------------- | ----------- | ------ | ---------------------------------------- |
| Unrecognized dialects       | Medium      | High   | Additional training with regional corpus |
| Phone line quality          | High        | Medium | Fallback to automatic SMS OTP            |
| Illnesses that change voice | Low         | High   | Automatic re-enrollment after 3 failures |

### Regulatory Risks

- **BCRA changes**: Regulatory adaptation clauses
- **Data residency**: Exclusive hosting in the Example (AWS): São Paulo region
- **Cross-border**: Technical restriction of no transfer

### Adoption Risks

- **Phone resistance**: Communication + enrollment incentives
- **Age demographics**: Fallback to a human agent for 65+
- **Technical literacy**: Gradual onboarding 20% → 80%

## 6. Implementation

### Phase 1: PoC (3 weeks)

- Basic technical integration
- Testing with 1,000 employee voices
- Accuracy validation with dialects
- **Go/No-go decision point**

### Phase 2: Development (8 weeks)

- Complete API + anti-spoofing
- Example (Twilio/Asterisk): IVR integration
- PCI DSS compliance implementation
- Security testing + penetration testing

### Phase 3: Soft-Launch Pilot (3 weeks)

- 5% of incoming calls
- 15,000 real authentications
- Threshold tuning by region
- Call center training

### Phase 4: Full Rollout (2 weeks)

- Graduation 25% → 75% → 100%
- Monitoring 24/7 + alerting
- Performance optimization

## 7. Success Metrics

### Operational KPIs

| Metric              | Baseline | Target Month 2 | Target Month 4 |
| ------------------- | -------- | -------------- | -------------- |
| Authentication time | 8:00 min | 2:00 min       | 0:45 min       |
| Call abandonment    | 45%      | 15%            | 8%             |
| Agents needed       | 85 FTE   | 55 FTE         | 35 FTE         |
| Cost per auth       | €4.50    | €1.50          | €0.85          |

### Security KPIs

- **False Accept Rate**: < 0.01%
- **False Reject Rate**: < 3%
- **Fraud detection**: > 99.7% of synthetic attempts detected
- **Attack resistance**: 0 bypasses confirmed

### UX KPIs

- **Enrollment rate**: > 85% on first call
- **User satisfaction**: NPS > 60
- **Effort score**: < 4.0 (1-10 scale)

## 8. Argentine Cultural Considerations

### Dialects and Varieties

- **Rioplatense** (Buenos Aires, Uruguay): 65% of users
- **Cordobés**: 15% of users
- **Norteño** (Salta, Tucumán): 12% of users
- **Cuyo** (Mendoza): 8% of users

### Usage Patterns

- **Peak hours**: 09:00-11:00 and 15:00-18:00 ART
- **Working days**: Monday heavier, Friday lighter
- **Seasonality**: January 40% less volume (vacations)

### Local Compliance

- **BCRA A5374**: Strong authentication for high-value transfers
- **Law 25.326**: Personal data protection (pre-GDPR Argentine)
- **UIF**: Mandatory Financial Information Unit reporting

## 9. Integration Architecture

### Technical Stack

```
Example (Twilio SIP): [Telephony SIP] → [Voice API Gateway] → [{{CLIENT_NAME}} Voice Engine] → [Platform] → [Fintech Backend]
```

### Performance Requirements

- **Voice processing**: < 2 seconds
- **API response time**: < 500ms P95
- **Concurrent users**: 500 simultaneous authentications
- **Availability**: 99.95% (4.5h downtime/year max)

### Security Architecture

- **Voice templates**: Encrypted AES-256, stored 60 days max
- **Network**: Dedicated VPN + TLS 1.3
- **Monitoring**: SOC 24/7 + SIEM integration
- **Incident response**: < 15 min for security events

---

**Business Sponsor**: VP Operations + CTO
**Regulatory Approval**: Compliance team + Legal
**Next Steps**: Technical PoC + regulatory review (parallel)
**Decision Timeline**: 3 weeks for final approval
