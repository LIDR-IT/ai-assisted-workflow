---
id: post-deploy-checklist
version: "1.0.0"
last_updated: "2026-03-16"
updated_by: "System: Checklist Migration"
status: active
type: checklist
review_cycle: 30
next_review: "2026-04-15"
owner_role: "DevOps"
---

# Post-Deploy Checklist

> **Purpose**: Mandatory post-deployment verifications to production or pre-production.
> **Evaluated by**: DevOps manual + /advance-gate 7
> **Associated Gate**: Final Gate — Release to PROD (post-validation)
> **Trigger**: Automatically executed after each successful deploy
> **Evaluation Window**: First 30 minutes (smoke) + 24 hours (stability)

---

## 1. Smoke Tests — Immediate Verification (0-5 min post-deploy)

### 1.1 Health & Connectivity

- [ ] **Health Check Endpoint** — `/health` or `/api/health` responds HTTP 200 with `{"status":"ok"}`
- [ ] **Readiness Probe** — `/ready` confirms all subsystems operational (DB, cache, queues)
- [ ] **Database Connection** — Active connection, healthy pool, migrations applied without errors
- [ ] **Cache Layer** — Redis/Memcached operational, successful ping-pong
- [ ] **Message Queue** — If applicable: RabbitMQ/Kafka/SQS connected and consuming
- [ ] **External Services** — Third-party APIs accessible (verify critical endpoints)

### 1.2 Core Functionality

- [ ] **Authentication Flow** — Login → token → protected endpoint → OK. End-to-end auth works
- [ ] **Critical API Endpoints** — Top 5 endpoints by traffic respond correctly (status 2XX with valid payload)
- [ ] **Static Assets** — CSS, JS, images served correctly with cache headers
- [ ] **Critical Business Endpoints** — If applicable: enrollment and verification endpoints respond
- [ ] **Database Reads** — Main queries execute correctly (SELECT on critical tables)
- [ ] **Database Writes** — Write path works (create test record → verify → delete)

### 1.3 Configuration

- [ ] **Environment Variables** — Correct environment variables for production (not staging/dev values)
- [ ] **Feature Flags** — New features with flag in correct state (enabled/disabled per plan)
- [ ] **Secrets Accessible** — Vault/Secrets Manager connected, secrets resolved correctly
- [ ] **SSL/TLS** — Valid certificates, forced HTTPS, HSTS active

---

## 2. Monitoring and Observability (5-15 min post-deploy)

### 2.1 Instrumentation

- [ ] **APM Active** — APM tool reporting metrics from new deployment
- [ ] **Error Tracking** — Error tracking service capturing exceptions. Release tag configured
- [ ] **Logs Flowing** — Application logs visible in centralized tool
- [ ] **Traces Active** — Distributed tracing operational (trace IDs propagated between services)
- [ ] **Custom Metrics** — Release-specific business metrics reporting correctly

### 2.2 Alerts

- [ ] **Error Rate Alert** — Alert configured: error rate >1% in 5 min → notify; >5% → page
- [ ] **Latency Alert** — Alert configured: P95 >2x baseline → notify; >5x → page
- [ ] **CPU/Memory Alert** — Alert configured: CPU >80% or memory >85% sustained 5 min → notify
- [ ] **Disk Space Alert** — Alert configured: disk >90% → page
- [ ] **Custom Business Alerts** — Business-specific alerts activated
- [ ] **On-call Acknowledged** — On-call person has confirmed awareness of deploy

### 2.3 Dashboards

- [ ] **Deploy Dashboard Visible** — Release dashboard shows pre/post deploy metrics for comparison
- [ ] **Release Marker** — Deploy marker visible in APM and log dashboards
- [ ] **SLA Dashboard** — SLA tracking updated with new version

---

## 3. Functionality Validation (15-30 min post-deploy)

- [ ] **New Features Operational** — New features from release work according to acceptance criteria
- [ ] **Rollback Plan Verified** — Rollback procedure tested or confirmed working
- [ ] **Data Migrations** — Data migrations completed without errors, data consistent
- [ ] **Performance Baseline** — Latency P50/P95/P99 within ±15% of pre-deploy baseline
- [ ] **Resource Utilization** — CPU, memory, connections within normal ranges
- [ ] **No Error Spike** — Error count doesn't exceed 2x baseline in first 30 min

---

## 4. Post-Deploy Communication

- [ ] **Team Notified** — Message in releases channel with: version, main changes, link to release notes
- [ ] **Release Notes Published** — Documentation updated with changelog
- [ ] **Stakeholders Informed** — Sponsors and relevant stakeholders notified of delivered features
- [ ] **Support Informed** — Support team knows changes, new features, and known issues
- [ ] **Documentation Updated** — API docs, user guides if applicable, knowledge base updated

---

## 5. Extended Monitoring — 24 Hours

### 5.1 Checkpoints

| Checkpoint | Time                 | Verifications                                     |
| ---------- | -------------------- | ------------------------------------------------- |
| **T+1h**   | 1 hour post-deploy   | Error rate, latency, no critical alerts           |
| **T+4h**   | 4 hours              | Stable metrics, user feedback, no support tickets |
| **T+8h**   | 8 hours (end of day) | Day summary, decision to maintain or revert       |
| **T+24h**  | 24 hours             | Final stability validation                        |

### 5.2 Stability Criteria (24h)

- [ ] **Stable Error Rate** — ≤baseline +0.5% - No significant sustained increase in errors
- [ ] **Stable Latency** — P95 ≤baseline +20% - No significant sustained degradation
- [ ] **Zero Critical Incidents** — 0 P1/P2 incidents attributable to deploy
- [ ] **User Feedback** — No critical reports - No mass complaints or functionality loss reports
- [ ] **Business Metrics** — ≤baseline -10% - Business metrics not significantly degraded

---

## 6. Rollback Criteria

### 6.1 Automatic Rollback (Immediate)

If **any** of these occur in first 30 minutes, execute immediate rollback:

| Trigger                    | Threshold                    | Action                                      |
| -------------------------- | ---------------------------- | ------------------------------------------- |
| **Error Rate Spike**       | >5% in 5 consecutive minutes | Automatic rollback + page on-call           |
| **Health Check Failure**   | 3 consecutive checks fail    | Automatic rollback + page on-call           |
| **Data Loss Detected**     | Any evidence                 | Immediate rollback + P1 incident            |
| **Security Vulnerability** | Exposure detected            | Immediate rollback + Security Lead notified |

### 6.2 Manual Rollback (Human Decision)

| Trigger                                  | Who Decides        | Process                                                  |
| ---------------------------------------- | ------------------ | -------------------------------------------------------- |
| **Performance Degradation** >3x baseline | Tech Lead + DevOps | Evaluate: optimizable without rollback? If no → rollback |
| **Critical Functionality Broken**        | PO + Tech Lead     | Evaluate business impact → rollback if ≥P2               |
| **Massive Negative Feedback**            | PO                 | Evaluate problem scope → rollback or hotfix              |
| **T+8h Without Stabilization**           | Tech Lead          | If metrics don't stabilize in 8h → rollback              |

---

## 7. Connection with SDLC Flow

```
Security Sign-off (Gate 6) → Deploy to production → Post-Deploy Check
    ↓                                                        ↓
If STABLE (24h) → Release confirmed → Retrospective
If ROLLBACK → Incident → Postmortem → Fix → Re-deploy
```

---

## Changelog

| Version | Date       | Author                      | Changes                                               |
| ------- | ---------- | --------------------------- | ----------------------------------------------------- |
| 1.0.0   | 2026-03-16 | System: Checklist Migration | Initial migration from docs/checklists/post-deploy.md |
