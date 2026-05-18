---
id: nfr-compliance-checklist
version: "1.0.0"
last_updated: "2026-03-16"
updated_by: "System: Checklist Migration"
status: active
type: checklist
review_cycle: 30
next_review: "2026-04-15"
owner_role: "Tech Lead"
---

# NFR Compliance Checklist

> **Purpose**: Verify Non-Functional Requirements are met before deploy.
> **When Evaluated**: Pre-deploy, between Gate 5 (QA) and Gate 6 (Security)
> **Who Evaluates**: TL + DevOps + QA (performance/load test data)
> **Associated Skill**: `generate-nfr`
> **Complements**: Security checklist (security-specific validations)

---

## Performance

- [ ] **P95 Latency Meets Target** — Latency P95 meets target defined in NFR (Load test report)
- [ ] **Throughput Meets Target** — Throughput meets target under expected load (Load test report)
- [ ] **No Progressive Degradation** — No degradation under sustained load (soak test ≥2h)
- [ ] **Acceptable Response Time Under Peak Load** — Response time acceptable under peak load (Stress test report)
- [ ] **Critical Operations Latency** — Critical operations latency ≤ threshold (Benchmark)

---

## Scalability

- [ ] **Supports Projected Concurrent Users** — System supports projected concurrent users (Load test with N concurrent users)
- [ ] **Auto-scaling Responds Timely** — Auto-scaling responds within configured time (Scaling test)
- [ ] **Database Supports Projected Data Volume** — Database supports projected data volume (Query performance test)

---

## Availability

- [ ] **Defined and Measurable SLA** — SLA uptime defined and measurable (Monitoring configuration)
- [ ] **Failover Works Within RTO** — Failover works within RTO (Chaos test / failover drill)
- [ ] **Health Checks Configured** — Health checks configured and responding (Endpoint /health verified)
- [ ] **Backups Configured per RPO** — Backups configured according to RPO (Backup verified and restorable)

---

## Security (complements security checklist)

- [ ] **Encryption in Transit (TLS 1.2+)** — SSL test verified
- [ ] **Encryption at Rest (AES-256)** — Config verified - DB encryption settings
- [ ] **No PII/Biometric in Logs** — Log audit completed
- [ ] **Biometric Data with Revocation Mechanism** — Deletion test verified

---

## Compliance

- [ ] **DPIA Completed for Biometric Data** — Signed document available
- [ ] **Explicit Consent Implemented** — UI test verified
- [ ] **Right to be Forgotten Functional (<72h)** — Deletion test verified
- [ ] **Retention Policy Configured** — Config verified

---

## Observability

- [ ] **APM Configured with Custom Metrics** — Dashboard verified
- [ ] **Alerts Configured for NFR Thresholds** — Alert rules reviewed
- [ ] **Structured Logs without PII** — Log sample review completed
- [ ] **Distributed Tracing Enabled** — Trace sample verified

---

## Accessibility (if applicable)

- [ ] **WCAG 2.1 AA Compliant** — Accessibility audit completed
- [ ] **Keyboard Navigation Functional** — Manual test verified
- [ ] **Screen Reader Compatible** — Screen reader test verified

---

## Evaluation Results

| Result          | Criteria                                                    |
| --------------- | ----------------------------------------------------------- |
| **PASS**        | All mandatory items (Must NFRs) verified and compliant      |
| **CONDITIONAL** | Should/Could items pending with documented remediation plan |
| **FAIL**        | Any Must item not compliant — blocks deploy                 |

---

## Changelog

| Version | Date       | Author                      | Changes                                                  |
| ------- | ---------- | --------------------------- | -------------------------------------------------------- |
| 1.0.0   | 2026-03-16 | System: Checklist Migration | Initial migration from docs/checklists/nfr-compliance.md |
