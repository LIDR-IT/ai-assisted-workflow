---
id: deployment-template
version: "1.0.0"
last_updated: "2026-03-16"
updated_by: "System: Template Migration"
status: active
type: template
review_cycle: 60
next_review: "2026-05-15"
owner_role: "DevOps"
---

# Template: Deployment Guide

> **Purpose**: Complete deployment guide — environments, variables, pipeline, verification, and rollback.
> **When it's created**: Phase 5 — Development (first iteration), updated before each deploy
> **Who fills it in**: DevOps + Tech Lead with skills `rollback-plan` + `change-request`
> **Associated Gate**: Final Gate — Release to PROD
> **Instances**: `docs/projects/{project}/deployment.md`

---

## Document Sections

### 1. Environments

```markdown
## Environments

| Environment    | URL          | Purpose                | Who accesses      | Deploy trigger      |
| -------------- | ------------ | ---------------------- | ----------------- | ------------------- |
| Development    | dev.{domain} | Active development     | Devs              | Push to develop     |
| Staging        | stg.{domain} | QA testing             | QA + Devs         | PR merge to staging |
| UAT            | uat.{domain} | User Acceptance        | PO + Stakeholders | Manual / Scheduled  |
| Pre-production | pre.{domain} | Security + Performance | Security + DevOps | Manual              |
| Production     | {domain}     | End users              | Everyone          | Manual + Approval   |

### Differences Between Environments

| Aspect         | Dev       | Staging     | UAT             | Pre-prod          | Prod              |
| -------------- | --------- | ----------- | --------------- | ----------------- | ----------------- |
| Data           | Seed/mock | Seed + test | Anonymized prod | Anonymized prod   | Real              |
| 3rd party APIs | Sandbox   | Sandbox     | Sandbox         | Real              | Real              |
| Feature flags  | All ON    | Selective   | Selective       | Production config | Production config |
| Logging level  | DEBUG     | INFO        | INFO            | WARN              | WARN              |
| Scale          | Min       | Min         | Min             | Prod-like         | Full              |
```

### 2. Environment Variables

```markdown
## Environment Variables

### Required (app won't start without them)

| Variable     | Type   | Example              | Secret | Description         |
| ------------ | ------ | -------------------- | ------ | ------------------- |
| DATABASE_URL | String | postgres://...       | Yes    | DB connection       |
| JWT_SECRET   | String | {256-bit key}        | Yes    | JWT token signing   |
| NODE_ENV     | Enum   | production           | No     | Runtime environment |
| PORT         | Number | 3000                 | No     | App port            |
| API_BASE_URL | URL    | https://api.{domain} | No     | API base URL        |

### Optional (have safe defaults)

| Variable       | Type   | Default | Secret | Description             |
| -------------- | ------ | ------- | ------ | ----------------------- |
| LOG_LEVEL      | Enum   | info    | No     | Logging level           |
| CACHE_TTL      | Number | 3600    | No     | Cache TTL in seconds    |
| RATE_LIMIT_MAX | Number | 100     | No     | Max requests per window |

### Secrets Management

| Secret               | Location                    | Rotation     | Owner  |
| -------------------- | --------------------------- | ------------ | ------ |
| DATABASE_URL         | AWS Secrets Manager / Vault | 90 days      | DevOps |
| JWT_SECRET           | AWS Secrets Manager / Vault | 90 days      | DevOps |
| API_KEYS (3rd party) | AWS Secrets Manager / Vault | Per provider | DevOps |

### Env Var Validation

{Script or mechanism that validates the presence of required vars at startup}
```

### 3. Pipeline CI/CD

```markdown
## Pipeline

### Stages

| Stage             | Trigger             | Actions                            | Blocking              |
| ----------------- | ------------------- | ---------------------------------- | --------------------- |
| Lint              | Push                | ESLint, Prettier, TypeScript check | Yes                   |
| Test              | Push                | Unit tests, coverage ≥80%          | Yes                   |
| Build             | Push                | Build artifact                     | Yes                   |
| SAST              | Push                | {{CODE_QUALITY_TOOL}} scan         | Yes (0 Critical/High) |
| SCA               | Push                | Dependency check                   | Yes (0 Critical/High) |
| Deploy staging    | Merge to staging    | Automatic deploy                   | No                    |
| DAST              | Post-deploy staging | OWASP ZAP scan                     | Yes for release       |
| Deploy production | Manual + Approval   | Deploy with approval gate          | Yes                   |

### Artifacts

| Artifact     | Format       | Registry              | Retention |
| ------------ | ------------ | --------------------- | --------- |
| Docker image | OCI          | ECR / GCR / DockerHub | 90 days   |
| Build output | ZIP / tar.gz | S3 / GCS              | 30 days   |
```

### 4. Production Deploy Process

```markdown
## Production Deploy

### Pre-deploy Checklist

- [ ] QA Sign-off obtained (Gate 5)
- [ ] Security Sign-off obtained (Gate 6)
- [ ] Change Request approved by Change Advisory Board
- [ ] Release notes generated (/create-release-notes)
- [ ] Rollback plan documented
- [ ] On-call confirmed and available
- [ ] Deploy window agreed

### Deploy Steps

1. **Tag release**: `git tag v{X.Y.Z}` + push
2. **Build**: Pipeline generates artifact from tag
3. **Deploy pre-prod**: Verify in pre-production
4. **Smoke tests pre-prod**: Run post-deploy checklist
5. **Approval gate**: Tech Lead + DevOps approve
6. **Production deploy**: Pipeline executes deploy
7. **Smoke tests prod**: Run post-deploy checklist
8. **24h monitoring**: Follow-up per post-deploy checklist

### Deploy Strategy

| Strategy       | Description                                     | When to use             |
| -------------- | ----------------------------------------------- | ----------------------- |
| Rolling update | Pods replaced gradually                         | Default for most cases  |
| Blue/Green     | Full new environment, traffic switch            | DB changes or high risk |
| Canary         | % of traffic to the new version, monitor, scale | High-impact features    |
```

### 5. Rollback

```markdown
## Rollback

### Automatic Rollback Triggers

| Condition                      | Action             |
| ------------------------------ | ------------------ |
| Health check fails 3x in a row | Automatic rollback |
| Error rate >5% in 5 min        | Automatic rollback |
| P1 alert in first 30 min       | Automatic rollback |

### Manual Rollback Procedure

1. Confirm rollback is needed (Tech Lead + DevOps)
2. Execute: `{rollback command — e.g. kubectl rollout undo}`
3. Verify successful rollback (re-run smoke tests)
4. If there's a DB migration: run rollback migration
5. Notify the team in the {{CHAT_TOOL}} #incidents channel
6. Create incident ticket
7. Schedule postmortem if applicable

### Database Rollback

| Scenario                 | Strategy                                   |
| ------------------------ | ------------------------------------------ |
| Schema change (additive) | No rollback required — backward compatible |
| Schema change (breaking) | Run down migration → verify data integrity |
| Data migration           | Restore from baseline backup               |
| Seed data change         | Re-run previous seed                       |
```

### 6. Post-Deploy Verification

```markdown
## Verification

### Quick Verification (2 min)

1. Health endpoint: `curl https://{domain}/health`
2. Auth flow: Login → token → protected endpoint
3. Dashboards: APM shows normal traffic
4. Logs: No new errors in the last 5 min

### Automated Smoke Test Suite

{Reference to the smoke test script/suite — e.g. `scripts/smoke-test.sh`}
```

---

## Completeness Criteria

| Criterion                           | Required | Validation       |
| ----------------------------------- | -------- | ---------------- |
| All environments documented         | Yes      | Automatic        |
| All required env vars listed        | Yes      | Cross-check code |
| Secrets in vault (not hardcoded)    | Yes      | Automatic (SAST) |
| Pipeline stages defined             | Yes      | Automatic        |
| Step-by-step deploy process         | Yes      | Manual           |
| Rollback documented (auto + manual) | Yes      | Manual           |
| Post-deploy verification defined    | Yes      | Automatic        |

---

## Assisting Skills

- **Rollback**: Skill `rollback-plan` generates a detailed rollback plan
- **Change Request**: Skill `change-request` generates the CR for the Board
- **Release Notes**: Command `/create-release-notes`
- **Validation**: `/validate-project-docs`

---

_Template — instance in `docs/projects/{project}/deployment.md`_
