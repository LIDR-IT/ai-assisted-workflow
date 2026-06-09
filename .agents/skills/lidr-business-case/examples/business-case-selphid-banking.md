# Business Case: {{PRODUCT_NAME_1}}D For Banking Digital Onboarding

**Client**: Banco Nacional de España (example)
**Product**: {{PRODUCT_NAME_1}}D + {{PRODUCT_NAME_1}}
**Estimated Budget**: €180K
**Timeline**: 6 months
**Type**: New enterprise client

## 1. Business Problem

### Current Situation

- **Manual onboarding**: 45 minutes average per client at the branch
- **Digital abandonment**: 67% of users abandon the online process
- **Operational costs**: €25 per completed onboarding
- **Compliance**: Must comply with PSD2 SCA + AML + GDPR Art. 9
- **Fraud**: 3.2% of fraudulent attempts in current onboarding

### Business Impact

- **Client loss**: 2,300 clients/month abandon the process
- **Branch costs**: €1.2M annually in onboarding personnel
- **Regulatory fines**: €450K in 2024 for AML non-compliance
- **Reputation**: Onboarding NPS: 23 (detractors)

## 2. Proposed Solution

### Technological Components

| {{CLIENT_NAME}} Product | Function                          | Regulatory Compliance            |
| ----------------------- | --------------------------------- | -------------------------------- |
| **{{PRODUCT_NAME_1}}D** | Document verification (OCR + NFC) | eIDAS qualified, ISO 19092       |
| **{{PRODUCT_NAME_1}}**  | Facial verification + liveness    | ISO 30107-1 PAD Level 2          |
| **Platform**            | Orchestration + dashboard         | GDPR Art. 25 (privacy by design) |

### Improved Onboarding Flow

1. **Document capture** → OCR + NFC of the ID/Passport
2. **Data extraction** → Name, date of birth, document number
3. **Biometric verification** → Selfie + liveness detection
4. **Matching 1:1** → Document photo vs selfie (score > 0.85)
5. **External validation** → Query official databases
6. **Automatic decision** → Auto-approval or manual escalation

### GDPR Art. 9 Compliance

- **Legal basis**: Explicit user consent
- **Minimization**: Only data strictly necessary for identification
- **Retention**: Biometric templates deleted after 30 days
- **Portability**: User data export in standard format
- **DPIA**: Impact assessment completed before go-live

## 3. Quantifiable Benefits

### Cost Reduction

| Concept           | Current | With {{CLIENT_NAME}} | Annual Savings |
| ----------------- | ------- | -------------------- | -------------- |
| Onboarding time   | 45 min  | 3 min                | €850K          |
| Branch personnel  | 12 FTE  | 4 FTE                | €640K          |
| Manual processing | 100%    | 15%                  | €320K          |
| **Total savings** |         |                      | **€1.81M**     |

### Conversion Increase

- **Abandonment rate**: 67% → 15% (target)
- **Additional clients**: +1,800/month
- **Additional revenue**: €4.2M annually (€195 ARPU)

### Compliance and Security

- **Fraud reduction**: 3.2% → 0.8% (target)
- **Fraud savings**: €280K annually
- **Fines avoided**: €450K (automatic AML compliance)

## 4. Investment and ROI

### Total Investment

| Concept                           | Cost      | Notes                   |
| --------------------------------- | --------- | ----------------------- |
| {{CLIENT_NAME}} licenses (year 1) | €120K     | 50K transactions/month  |
| Integration and development       | €45K      | 3 months, internal team |
| Compliance consulting             | €15K      | DPIA + certifications   |
| **Total investment**              | **€180K** |                         |

### Return

- **Direct savings**: €1.81M (cost reduction)
- **Incremental revenue**: €4.2M (new clients)
- **ROI year 1**: 3,240% ((6.01M - 0.18M) / 0.18M \* 100)
- **Payback period**: 1.1 months

## 5. Risks and Mitigations

### Technical Risks

| Risk                        | Probability | Impact | Mitigation                      |
| --------------------------- | ----------- | ------ | ------------------------------- |
| Complex integration         | Medium      | High   | 2-week PoC before commitment    |
| Performance on old mobiles  | High        | Medium | Fallback to manual verification |
| False rejections (high FRR) | Low         | High   | Threshold tuning in pilot       |

### Regulatory Risks

| Risk                           | Probability | Impact | Mitigation                         |
| ------------------------------ | ----------- | ------ | ---------------------------------- |
| Changes in GDPR interpretation | Low         | High   | Adaptation clauses in the contract |
| Regulatory audit               | Medium      | Medium | Exhaustive documentation + logs    |
| Consent rejection              | Medium      | Low    | Alternative onboarding process     |

### Business Risks

- **Slow adoption**: Communication + incentives
- **Competition**: Accelerated time-to-market
- **Hidden costs**: 15% contingency included

## 6. Schedule

### Phase 1: Discovery and PoC (4 weeks)

- Technical integration analysis
- PoC with 500 real transactions
- Preliminary DPIA
- **Go/No-go decision**

### Phase 2: Development (8 weeks)

- Backend integration {{PRODUCT_NAME_1}}D + {{PRODUCT_NAME_1}}
- Mobile + web frontend
- Testing + certification

### Phase 3: Pilot (4 weeks)

- 10,000 real onboardings
- Threshold tuning
- Support team training

### Phase 4: Go-Live (2 weeks)

- Gradual migration 10% → 50% → 100%
- 24/7 monitoring
- Intensive support

## 7. Success Metrics

### Primary KPIs

| Metric              | Baseline | Target Month 3 | Target Month 6 |
| ------------------- | -------- | -------------- | -------------- |
| Onboarding time     | 45 min   | 5 min          | 3 min          |
| Abandonment rate    | 67%      | 25%            | 15%            |
| Complete conversion | 33%      | 75%            | 85%            |
| Cost per onboarding | €25      | €8             | €5             |

### Secondary KPIs

- **Customer satisfaction**: NPS > 70
- **Biometric accuracy**: FAR < 0.1%, FRR < 2%
- **System availability**: > 99.9%
- **Regulatory compliance**: 0 incidents

## 8. Critical Success Factors

### Technical

- API response time < 2 seconds
- Compatibility with 95% of mobile devices
- Robust fallback for edge cases

### Regulatory

- DPIA approved by DPO before go-live
- Complete audit trail of all transactions
- Granular and revocable consent

### Organizational

- CEO and CTO sponsorship
- Change management for branch teams
- Intensive call center training

---

**Approval Required**: Executive Committee
**Next Steps**: If approved → start procurement + PoC
**Decision Deadline**: 15 business days
