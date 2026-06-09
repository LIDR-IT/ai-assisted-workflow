# Business Case: Digital eID for Municipal Government

**Client**: Ayuntamiento de Valencia (example)
**Product**: {{PRODUCT_NAME_1}}D + {{PRODUCT_NAME_1}} (basic module)
**Estimated Budget**: €45K
**Timeline**: 3 months
**Type**: Local government, first implementation

## 1. Business Problem

### Current Situation

- **In-person procedures**: 100% require a physical visit
- **Limited hours**: Offices 8:00-14:00, 2-hour queues
- **Saturated personnel**: 12 civil servants for 45,000 citizens
- **Paperwork**: 85% of procedures require physical documentation
- **Citizen satisfaction**: 34% (2025 municipal survey)

### Target Procedures (Phase 1)

1. **Residence certificates** (3,200/month)
2. **Employment history certificates** (1,800/month)
3. **Medical appointment requests** (4,500/month)
4. **Fines and tax payments** (2,100/month)
5. **Sports activity registration** (800/month)

### Regulatory Framework

- **eIDAS Level Substantial**: Required for official procedures
- **GDPR Art. 6**: Legal basis for public service
- **GDPR Art. 9**: Biometric data requires DPIA
- **Law 39/2015**: Mandatory digital administration

## 2. Proposed Solution

### Technical Components

| Product                 | Function                 | Compliance              |
| ----------------------- | ------------------------ | ----------------------- |
| **{{PRODUCT_NAME_1}}D** | ID/NIE verification      | eIDAS Substantial level |
| **{{PRODUCT_NAME_1}}**  | Facial recognition       | ISO 30107-1 PAD         |
| **Citizen portal**      | Responsive web interface | WCAG 2.1 AA             |

### Digital Identification Flow

1. **Portal access** → www.valencia.es/tramites
2. **Procedure selection** → Residence certificate
3. **Digital identification**:
   - ID/NIE photo (OCR)
   - Selfie with liveness detection
   - Matching 1:1 (threshold: 0.88)
4. **Automatic process** → Generation of signed PDF certificate
5. **Digital delivery** → Email + immediate download

### GDPR Compliance (Simplified)

- **Legal basis**: Art. 6.1.e - Public interest (municipal services)
- **Biometric data**: Art. 9.2.g - Essential public interest
- **Retention**: Templates deleted after completing the procedure (max 48h)
- **DPIA**: Basic assessment for local government
- **Municipal DPO**: Process supervision

## 3. Expected Benefits

### Administrative Load Reduction

| Procedure             | Current Time | Digital Time | Savings |
| --------------------- | ------------ | ------------ | ------- |
| Residence certificate | 45 min       | 3 min        | 42 min  |
| Employment history    | 30 min       | 2 min        | 28 min  |
| Medical appointment   | 25 min       | 1 min        | 24 min  |
| Fines payment         | 20 min       | 2 min        | 18 min  |

### Operational Savings (Annual)

- **Civil servant hours freed**: 2,400 hours/year
- **Administrative costs**: €72K → €45K (savings €27K)
- **Paper and printing costs**: €8K → €2K (savings €6K)
- **Total direct savings**: €33K annually

### Service Improvement

- **Availability**: 24/7 vs 8:00-14:00
- **Waiting time**: 0 vs 120 minutes average
- **Trips avoided**: 12,400 trips/year to the Town Hall
- **Expected satisfaction**: 75% (vs 34% current)

## 4. Investment

### Implementation Costs

| Concept                           | Cost     | Justification                  |
| --------------------------------- | -------- | ------------------------------ |
| {{CLIENT_NAME}} licenses (year 1) | €25K     | 15K verifications/month        |
| Portal development                | €12K     | Frontend + backend integration |
| Municipal systems integration     | €5K      | API connection with database   |
| DPIA + compliance                 | €3K      | Minimal legal consulting       |
| **Total**                         | **€45K** |                                |

### Simplified ROI

- **Annual savings**: €33K
- **Investment**: €45K
- **Payback period**: 16.4 months
- **ROI 3 years**: 120% (not counting satisfaction improvements)

## 5. Implementation (Simple)

### Phase 1: Basic Setup (4 weeks)

- Installation of {{PRODUCT_NAME_1}}D + {{PRODUCT_NAME_1}}
- Basic responsive web portal
- Integration with 1 pilot procedure (residence)
- Basic DPIA + approval

### Phase 2: Expansion (4 weeks)

- Integration of 4 remaining procedures
- Testing with volunteer citizens (100 people)
- Municipal personnel training
- Soft go-live (20% of citizens)

### Phase 3: Full Launch (2 weeks)

- Citizen communication (web, social media, local press)
- On-site support during the first week
- Monitoring and adjustments

## 6. Risks (Low Complexity)

### Technical Risks

| Risk                          | Probability | Mitigation                                 |
| ----------------------------- | ----------- | ------------------------------------------ |
| Slow adoption by citizens 65+ | High        | Phone support + parallel in-person support |
| Problems with old IDs         | Medium      | Documented manual fallback                 |
| Server overload               | Low         | Cloud hosting auto-scaling                 |

### Regulatory Risks

- **GDPR compliance**: Mandatory municipal DPO review
- **eIDAS certification**: {{PRODUCT_NAME_1}}D already certified (no risk)
- **WCAG accessibility**: Mandatory testing before launch

### Organizational Risks

- **Civil servant resistance**: Training + involvement in design
- **Budget approval**: Defined political sponsor
- **Electoral timeline**: Avoid launching 2 months pre-elections

## 7. Success Metrics

### Operational KPIs (3 months)

| Metric                 | Target      |
| ---------------------- | ----------- |
| % digital procedures   | > 40%       |
| Average procedure time | < 5 minutes |
| Citizen satisfaction   | > 70%       |
| Support calls/day      | < 15        |

### Technical KPIs

- **Portal availability**: > 99%
- **False accept rate**: < 0.1%
- **False reject rate**: < 5%
- **Mobile compatibility**: 95% of devices

## 8. Long-Term Benefits

### Scalability (Year 2)

- Expansion to all 47 municipal procedures
- Integration with Generalitat Valenciana
- API for third parties (agencies)
- Native mobile app

### Smart City Integration

- Municipal single sign-on
- Integration with public transport
- Sports and cultural services
- Digital citizen participation

---

**Sponsor**: Councillor for Modernization + Mayor
**Approval**: Municipal plenary
**Contact DPO**: Municipal secretary (legal compliance)
**Decision Timeline**: 6 weeks (standard municipal process)
