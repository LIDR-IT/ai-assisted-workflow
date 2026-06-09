---
name: lidr-security-checklist
id: security-checklist
version: "1.1.0"
last_updated: "2026-06-09"
updated_by: "TL: lang+tool agnostic"
status: active
phase: 7
owner_role: "Sec Lead"
automation: true
domain_agnostic: true
language_default: en
integrations: [code_quality, tracking]
description: "🤖 Essential for platform security validation - ALWAYS use before Gate 6 approval for deployments, algorithm releases, authentication systems, or data processing APIs. CRITICAL for evaluating data encryption, regulatory compliance, attack prevention, API authentication for service endpoints, and cross-border data transfer security. Use for any sensitive-data processing workflow in regulated or high-assurance domains (specifics resolve via the client `domain` setting). Mandatory for production security sign-off."
---

# Security Checklist Evaluator

Phase: 7 — Security | Gate: 6 (Security Sign-off) | Content authored in English; artifact language follows the client `language` setting (see `_shared/lidr/integrations/`).

Tools resolve via the central registry `_shared/lidr/integrations/tool-registry.yaml`; the active client binds concrete tools in `clients/<CODE>.yaml`.

**Principle:** Security is not a gate you pass — it's a property you continuously verify.

## Relationship to BMad

This skill is a **LIDR extension on top of BMad** (BMad = source of truth; LIDR fills gaps BMad has no concept of). It owns the **Gate-6 security sign-off**: an OWASP Top 10 + regulatory compliance checklist that gates production deployment — a governance artifact BMad has no equivalent for. It complements `bmad-testarch-nfr` (which audits NFR evidence including security) by producing the formal CISO sign-off record.

## Automated Workflow (NEW)

### Phase 1: Security Analysis (Automated)

1. **Execute Security Analyzer**: `scripts/compliance-analyzer.py` processes SAST/SCA/DAST results automatically
2. **Domain Classification**: Auto-categorizes findings with domain-specific relevance and applicable regulatory context (e.g., GDPR Article 9 for sensitive data)
3. **Generate Security Analysis**: Structured security findings with business impact and remediation priority
4. **Apply Industry Standards**: Automated assessment against {{INDUSTRY_TIER_1}}/{{INDUSTRY_TIER_2}}/{{INDUSTRY_TIER_3}} security requirements (resolved per client `domain`)

### Phase 2: Checklist Generation (Automated)

1. **Execute Checklist Generator**: `scripts/checklist-generator.py` creates comprehensive security checklist reports
2. **Industry-Specific Assessment**: Generates {{INDUSTRY_TIER_1}}-grade vs {{INDUSTRY_TIER_2}}-grade vs {{INDUSTRY_TIER_3}}-grade compliance reports
3. **Gate 6 Evaluation**: Automated PASS/CONDITIONAL/FAIL assessment with specific remediation actions
4. **CSV Export**: Project management integration for seamless remediation tracking

### Phase 3: Security Review (Human)

1. **Review Automation Results**: Validate automated security analysis and domain-specific assessments
2. **Gate 6 Decision**: Human judgment on automated recommendations, especially for domain-specific risks
3. **Sign-off Generation**: Final security sign-off using automated analysis as evidence base

### Legacy Manual Workflow (Fallback)

If automation fails, use original manual process:

1. Manual SAST/SCA/DAST report analysis (4+ hours)
2. Manual sensitive-data security evaluation (2+ hours)
3. Manual data protection regulation compliance verification (1+ hour)
4. Manual industry-specific requirements assessment (1+ hour)
5. Manual Gate 6 recommendation generation (1+ hour)

### Decision Point

- If automated scripts succeed → Continue with automated results + 30-minute human review
- If automated scripts fail → Fallback to manual process
- Either path leads to: If PASS → Security Sign-off and Gate 6 approval

## Legacy Workflow (Manual)

1. **Read security scan results**: SAST/SCA/DAST with focus on sensitive data handling, encryption, API security
2. **Evaluate sensitive data protection**: Data encryption (AES-256-GCM), secure storage (HSM), transmission security
3. **Validate data protection regulation compliance**: Consent mechanisms, data processing lawfulness, deletion workflows, audit trails
4. **Check spoofing and attack prevention**: Authentication security, attack mitigation, data correlation protection
5. **Assess API security for sensitive endpoints**: Authentication (OAuth2), authorization (RBAC), rate limiting, input validation
6. **Review cross-border compliance**: Data residency requirements, transfer mechanisms, encryption standards
7. **Evaluate each checklist item** with domain context: ✅ Pass / ❌ Fail / ⚠️ Partial / N/A
8. **Generate industry-specific remediation**: {{INDUSTRY_TIER_1}}-grade vs. {{INDUSTRY_TIER_2}}-grade vs. {{INDUSTRY_TIER_3}}-grade security requirements (per client `domain`)
9. **Determine Gate 6 readiness** with regulatory compliance attestation

## Automation Scripts

### `scripts/compliance-analyzer.py` — Security Analysis Engine

**Purpose**: Automatically analyzes SAST/SCA/DAST results with domain expertise and applicable data protection regulation compliance validation.

**Key Features**:

- **Multi-Source Integration**: Auto-discovers {{CODE_QUALITY_TOOL}} (SAST/SCA/DAST) reports in project directory
- **Domain Classification**: Specialized patterns for sensitive data encryption, authentication security, API security
- **Data Protection Regulation Validation**: Automated compliance assessment for sensitive data processing against the {{COMPLIANCE_STANDARD}} applicable to the client domain
- **Industry Standards Assessment**: {{INDUSTRY_TIER_1}}-grade vs {{INDUSTRY_TIER_2}}-grade vs {{INDUSTRY_TIER_3}}-grade security requirements
- **Remediation Prioritization**: Risk-based priority scoring with domain-specific relevance weighting
- **Gate 6 Assessment**: Automated PASS/CONDITIONAL/FAIL evaluation with blocking issues identification

**Usage**:

```bash
# Auto-discovery mode (recommended)
python scripts/compliance-analyzer.py --verbose

# Explicit directory mode
python scripts/compliance-analyzer.py \
  --project-dir /path/to/project \
  --output-dir security-analysis
```

**Outputs**:

- `security-analysis.json`: Structured analysis data for further processing
- Gate 6 readiness assessment with blocking issues
- Automated domain-specific risk categorization

### `scripts/checklist-generator.py` — Security Checklist Generator

**Purpose**: Generates comprehensive security checklists from analysis results with industry-specific compliance reports.

**Key Features**:

- **Automated Report Generation**: Transforms analysis JSON into actionable security checklists
- **Industry-Specific Assessment**: Industry-tiered security requirement validation (resolves to the client's applicable regulation)
- **Gate 6 Integration**: PASS/CONDITIONAL/FAIL determination with specific remediation actions
- **CSV Export Integration**: Project management tools integration for remediation tracking
- **GDPR Article 9 Reporting**: Special category data handling compliance assessment

**Usage**:

```bash
# Generate security checklist from analysis
python scripts/checklist-generator.py \
  --analysis-file security-analysis.json \
  --project-name "identity SDK v3.1 Banking" \
  --verbose

# Custom output directory
python scripts/checklist-generator.py \
  --analysis-file security-analysis.json \
  --project-name "identity-platform recognition SDK" \
  --output-dir custom-reports
```

**Outputs**:

- `security-checklist-YYYY-MM-DD.md`: Human-readable security checklist report
- `security-remediation-YYYYMMDD.csv`: CSV export for {{TRACKING_TOOL}} import
- Industry-specific compliance assessment reports

## Input

| Input                     | Required  | Source                          | Automated Processing                                        |
| ------------------------- | --------- | ------------------------------- | ----------------------------------------------------------- |
| SAST results              | ✅        | {{CODE_QUALITY_TOOL}} (SAST)    | ✅ `compliance-analyzer.py` auto-discovers JSON exports     |
| SCA results               | ✅        | {{CODE_QUALITY_TOOL}} (SCA)     | ✅ `compliance-analyzer.py` processes vulnerability reports |
| DAST results              | Desirable | {{CODE_QUALITY_TOOL}} (DAST)    | ✅ `compliance-analyzer.py` parses dynamic scan results     |
| Infrastructure config     | ✅        | Nginx, K8s, headers             | ⚠️ Manual configuration review                              |
| ADRs (security decisions) | Desirable | skill `adr/`                    | ⚠️ Manual context integration                               |
| PRD-T security NFRs       | Desirable | skill `bmad-prd/`               | ⚠️ Manual requirements mapping                              |
| Applicable regulations    | Desirable | Legal (GDPR, PCI-DSS, SOC2)     | ✅ Auto-detected from project context                       |
| Security Sign-off format  | ✅        | `@signoffs/security-signoff.md` | ✅ Automated sign-off generation                            |

## Output Template

```markdown
# Security Checklist Evaluation: [PROJECT] — [DATE]

## Overall Status: ✅ PASS / ⚠️ CONDITIONAL / ❌ FAIL

## Summary

| Category | Total | ✅ Pass | ❌ Fail | ⚠️ Partial | N/A |
| -------- | ----- | ------- | ------- | ---------- | --- |

## Detailed Evaluation

### 1. Authentication & Session Management

| #   | Check                                              | Status | Evidence | Notes |
| --- | -------------------------------------------------- | ------ | -------- | ----- |
| 1.1 | Passwords hashed with bcrypt/argon2 (not MD5/SHA1) | ✅/❌  | [source] |       |
| 1.2 | Session tokens are cryptographically random        |        |          |       |
| 1.3 | Session timeout configured                         |        |          |       |
| 1.4 | MFA available for sensitive operations             |        |          |       |

### 2. Authorization & Access Control

### 3. Input Validation & Output Encoding

### 4. Data Protection (encryption at rest + in transit)

### 5. Security Headers

| Header                    | Expected                        | Actual  | Status |
| ------------------------- | ------------------------------- | ------- | ------ |
| Content-Security-Policy   | [value]                         | [value] | ✅/❌  |
| X-Frame-Options           | DENY                            |         |        |
| X-Content-Type-Options    | nosniff                         |         |        |
| Strict-Transport-Security | max-age=31536000                |         |        |
| Referrer-Policy           | strict-origin-when-cross-origin |         |        |
| Permissions-Policy        | [value]                         |         |        |

### 6. Dependency Security (from SCA)

### 7. API Security

### 8. Infrastructure & Deployment

### 9. Logging & Monitoring

### 10. Compliance-specific (client's applicable regulations — e.g. GDPR/PCI-DSS/SOC2)

## Failures & Remediation

| #   | Check | Current State | Required Fix | Config/Code Change | Effort |
| --- | ----- | ------------- | ------------ | ------------------ | ------ |

## Gate 6 Recommendation

Use `@signoffs/security-signoff.md` format for formal sign-off.

- [ ] 0 Critical/High failures
- [ ] All security headers configured
- [ ] No dependencies with known exploited CVEs
- [ ] Authentication + authorization verified
- [ ] Data encryption at rest and in transit
      → **Recommendation:** [APPROVE / CONDITIONAL / REJECT]
```

## Key Rules

- **{{SENSITIVE_DATA_TYPE}} encryption is mandatory**: AES-256-GCM minimum, HSM preferred for {{INDUSTRY_TIER_1}}/{{INDUSTRY_TIER_3}} grade
- **Zero-tolerance for sensitive data exposure**: Any vulnerability affecting sensitive data storage/transmission is Critical
- **Data protection regulation compliance required**: Consent, processing lawfulness, deletion, data subject rights must be verified per the {{COMPLIANCE_STANDARD}} applicable to the client domain
- **API authentication enforced**: All sensitive-data endpoints require OAuth2 + API keys, no exceptions
- **Attack prevention validated**: Authentication and anti-abuse security tested against known attack vectors
- **Cross-border compliance verified**: Data residency, transfer agreements, encryption standards per jurisdiction
- **Industry standards apply**: {{INDUSTRY_TIER_1}}, {{INDUSTRY_TIER_2}}, and {{INDUSTRY_TIER_3}} assurance levels resolve to the concrete standard (e.g. PCI-DSS, FedRAMP, OWASP baseline) via the client `domain` setting
- **Audit trail immutability**: All sensitive operations logged with tamper-evident storage
- **Data isolation protection**: Technical measures prevent unauthorized linking of data records across services

## Domain Example: Security Checklist

> **Note**: The following example uses a sensitive-data platform deployment scenario. Adapt checklist categories and items to your project's domain and regulatory requirements.

### Security Checklist Evaluation: identity SDK v3.1 Banking Deployment — 2026-03-15

```markdown
## Overall Status: ⚠️ CONDITIONAL (2 items require remediation)

## Summary

| Category                           | Total | ✅ Pass | ❌ Fail | ⚠️ Partial | N/A |
| ---------------------------------- | ----- | ------- | ------- | ---------- | --- |
| Sensitive Data Protection          | 12    | 10      | 1       | 1          | 0   |
| GDPR Article 9 Compliance          | 8     | 8       | 0       | 0          | 0   |
| API Security (Sensitive Endpoints) | 15    | 13      | 2       | 0          | 0   |
| Infrastructure Security            | 10    | 10      | 0       | 0          | 0   |
| Attack Prevention                  | 6     | 5       | 1       | 0          | 0   |

## Detailed Evaluation

### 1. {{SENSITIVE_DATA_TYPE}} Security

| #   | Check                                                            | Status | Evidence                                          | Notes                                                   |
| --- | ---------------------------------------------------------------- | ------ | ------------------------------------------------- | ------------------------------------------------------- |
| 1.1 | {{SENSITIVE_DATA_TYPE}} encrypted at rest (AES-256-GCM)          | ✅     | HSM config: AES-256-GCM enabled                   | {{INDUSTRY_TIER_1}}-grade encryption                    |
| 1.2 | {{SENSITIVE_DATA_TYPE}} transmission uses TLS 1.3+               | ✅     | Nginx config: ssl_protocols TLSv1.3               | Certificate pinning enabled                             |
| 1.3 | {{SENSITIVE_DATA_TYPE}} never logged in plaintext                | ✅     | Log analysis: 0 {{SENSITIVE_DATA_TYPE}} exposures | Audit verified                                          |
| 1.4 | {{SENSITIVE_DATA_TYPE}} access requires dual authorization       | ❌     | Single API key auth only                          | **CRITICAL: {{INDUSTRY_TIER_1}} requirement violation** |
| 1.5 | {{SENSITIVE_DATA_TYPE}} deletion is cryptographically verifiable | ⚠️     | Soft delete implemented                           | Hard delete needed for GDPR                             |

### 2. GDPR Article 9 Compliance (sensitive data)

| #   | Check                                     | Status | Evidence                                   | Notes                      |
| --- | ----------------------------------------- | ------ | ------------------------------------------ | -------------------------- |
| 2.1 | Explicit consent for data processing      | ✅     | Consent UI flow tested                     | Multi-language support     |
| 2.2 | Data processing lawfulness documented     | ✅     | Legal basis: Consent + Legitimate Interest | DPIA completed             |
| 2.3 | Data retention periods configured         | ✅     | 30 days enrollment, 2 years templates      | Auto-deletion scheduled    |
| 2.4 | Data subject access rights implemented    | ✅     | REST API for data export                   | JSON format                |
| 2.5 | Right to deletion (right to be forgotten) | ✅     | Template deletion in <24h                  | Cryptographic verification |
| 2.6 | Cross-border transfer safeguards          | ✅     | EU adequacy decision compliance            | Regional data residency    |

### 3. API Security (Sensitive Endpoints)

| #   | Check                                        | Status | Evidence                              | Notes                        |
| --- | -------------------------------------------- | ------ | ------------------------------------- | ---------------------------- |
| 3.1 | OAuth2 + API key authentication              | ✅     | Both required for sensitive endpoints | Rate limiting: 100/min       |
| 3.2 | Input validation on sensitive data           | ✅     | Image: max 5MB, formats: JPG/PNG      | Virus scanning enabled       |
| 3.3 | Sensitive endpoint rate limiting             | ✅     | 10 verifications/min per user         | Sliding window               |
| 3.4 | API versioning and deprecation policy        | ✅     | v1 deprecated 2026-06-01              | 3-month notice               |
| 3.5 | CORS configured for sensitive endpoints      | ❌     | Wildcard \* origin configured         | **HIGH: XSS vulnerability**  |
| 3.6 | Request/response logging (no sensitive data) | ❌     | Sensitive data in debug logs          | **CRITICAL: GDPR violation** |

### 4. {{ATTACK_TYPE}} Detection

| #   | Check                                                    | Status | Evidence                                            | Notes                                   |
| --- | -------------------------------------------------------- | ------ | --------------------------------------------------- | --------------------------------------- |
| 4.1 | {{VERIFICATION_METHOD}} enabled for {{PRIMARY_WORKFLOW}} | ✅     | {{VERIFICATION_TECHNIQUE}}                          | {{ACCURACY_METRIC}}% accuracy validated |
| 4.2 | Anti-fraud for common attacks                            | ✅     | {{FRAUD_DETECTION_METHOD}}                          | {{COMPLIANCE_STANDARD}} compliant       |
| 4.3 | Attack attempt logging and monitoring                    | ✅     | Security events → SIEM                              | Alert threshold: 5/hour                 |
| 4.4 | {{SENSITIVE_DATA_TYPE}} correlation prevention           | ❌     | Same {{SENSITIVE_DATA_TYPE}} usable across services | **HIGH: Privacy violation**             |

## Failures & Remediation

| #   | Check                               | Current State                  | Required Fix                             | Config/Code Change                                                          | Effort  |
| --- | ----------------------------------- | ------------------------------ | ---------------------------------------- | --------------------------------------------------------------------------- | ------- |
| 1.4 | {{SENSITIVE_DATA_TYPE}} access auth | Single API key                 | Dual authorization (API key + JWT)       | Middleware: require both tokens                                             | 2 days  |
| 3.5 | CORS configuration                  | `*` wildcard                   | Specific origins only                    | `nginx.conf: add_header Access-Control-Allow-Origin "https://app.bank.com"` | 2 hours |
| 3.6 | sensitive data logging              | Sensitive data in logs         | Remove all sensitive PII                 | Logger config: exclude fields matching sensitive data patterns              | 4 hours |
| 4.4 | {{SENSITIVE_DATA_TYPE}} correlation | Shared {{SENSITIVE_DATA_TYPE}} | Service-specific {{SENSITIVE_DATA_TYPE}} | Generate unique {{SENSITIVE_DATA_TYPE}} per service context                 | 1 week  |

## Industry-Specific Requirements ({{INDUSTRY_TIER_1}})

### {{INDUSTRY_TIER_1}}/{{INDUSTRY_TYPE}} ({{COMPLIANCE_STANDARD}} Equivalent)

- **{{SENSITIVE_DATA_TYPE}} Encryption**: HSM-backed encryption ✅
- **Dual Authorization**: Required for {{SENSITIVE_DATA_TYPE}} access ❌
- **Audit Logging**: All operations immutably logged ✅
- **Incident Response**: 4-hour breach notification ✅
- **Network Segmentation**: {{SENSITIVE_DATA_TYPE}} processing isolated ✅

### Cross-Border Compliance

- **EU-US Data Transfer**: Adequacy decision basis ✅
- **GDPR Article 9**: Special category data protection ✅
- **Data Residency**: {{SENSITIVE_DATA_TYPE}} remains in origin country ✅

## Gate 6 Recommendation: ⚠️ CONDITIONAL APPROVAL

**Blocking Issues (must be fixed before production):**

1. **Template Access Authorization**: Implement dual authorization (API key + JWT) - 2 days
2. **CORS Configuration**: Remove wildcard, use specific origins - 2 hours
3. **Logging Sanitization**: Remove sensitive data from all logs - 4 hours

**High Priority (fix in next sprint):**

1. **Template Correlation**: Service-specific templates for privacy protection - 1 week

**Conditions for Production Deployment:**

- All blocking issues resolved with security team validation
- Penetration test re-run on authentication changes
- GDPR compliance audit refresh after logging changes

**Timeline**: Conditional approval expires 2026-03-20 (5 days)
**Owner**: Security Team + R&D Lead
**Final sign-off**: Require CISO approval after remediation
```

## Practical Implementation Instructions

### Step 1: Initial Setup and Security Report Preparation

```bash
# Ensure {{CODE_QUALITY_TOOL}} scan reports exist (file patterns below are
# Example globs for SonarQube/Snyk/OWASP ZAP — the active client's bound
# {{CODE_QUALITY_TOOL}} determines the actual export filenames)
ls **/sonarqube*.json    # Example (SonarQube): SAST results
ls **/snyk*.json         # Example (Snyk): SCA results
ls **/zap*.json          # Example (OWASP ZAP): DAST results (optional)

# Navigate to security checklist skill directory
cd .claude/skills/security-checklist
```

### Step 2: Execute Automated Security Analysis

```bash
# Run full security automation (recommended)
python scripts/compliance-analyzer.py \
  --verbose \
  --output-dir security-analysis-$(date +%Y%m%d) \
  --project-dir .

# Expected output:
# 🔍 Starting security compliance analysis...
# 📊 Found reports:
#   - SAST: 1 files
#   - SCA: 1 files
#   - DAST: 0 files
#   - INFRASTRUCTURE: 3 files
# ✅ Analysis complete:
#    Total findings: 47
#    Gate 6 status: CONDITIONAL
#    Critical issues: 2
#    Domain-specific critical: 5
# 📊 JSON output: security-analysis/security-analysis.json
#
# 🎯 Security Analysis Summary:
#    Status: CONDITIONAL
#    Message: 2 Critical severity issues, 5 domain-specific critical issues
#    Blocking issues:
#      - 2 Critical severity issues
#      - 5 Critical domain-specific security issues
# ⏱️  Estimated remediation time: 3.5 days
```

### Step 3: Generate Security Checklist Report

```bash
# Generate comprehensive security checklist
python scripts/checklist-generator.py \
  --analysis-file security-analysis/security-analysis.json \
  --project-name "identity SDK v3.1 Production" \
  --verbose

# Expected output:
# 📋 Generating security checklist report...
# ✅ Security checklist generated: security-analysis/security-checklist-2026-03-15.md
# 📊 CSV export generated: security-analysis/security-remediation-20260315.csv
#
# 📋 Security Checklist Report: security-analysis/security-checklist-2026-03-15.md
```

### Step 4: Review and Act on Results

```bash
# Review generated security checklist
open security-analysis/security-checklist-$(date +%Y-%m-%d).md

# Check automation results summary
cat security-analysis/security-analysis.json | python -m json.tool | head -30

# Import remediation items to project management
# Import security-analysis/security-remediation-YYYYMMDD.csv to {{TRACKING_TOOL}}
```

### Step 5: Address Critical Security Issues (if FAIL or CONDITIONAL status)

**For Security Team**:

- Review checklist report section "Blocking Issues" and "High Priority"
- Address GDPR Article 9 compliance violations immediately
- Fix data template encryption and logging issues
- Re-run security scans after remediation

**For Development Team**:

- Fix SAST/SCA findings marked as Critical or High
- Implement security headers and CORS configuration fixes
- Update dependencies with known vulnerabilities
- Address API security and authentication issues

### Step 6: Iterative Re-validation

```bash
# After fixes, re-run security analysis
python scripts/compliance-analyzer.py --verbose
python scripts/checklist-generator.py \
  --analysis-file security-analysis.json \
  --project-name "identity SDK v3.1 Production (Remediated)"

# Continue until status = PASS or CONDITIONAL (acceptable)
```

### Step 7: Gate 6 Transition

**If PASS or CONDITIONAL (acceptable)**:

```bash
# Ready for Gate 6 approval
# Generate formal security sign-off using checklist report as evidence
# Execute Gate 6 evaluation
/advance-gate 6
```

**Integration with Commands**:

- `/advance-gate 6` should verify this skill's PASS status before proceeding
- Security checklist automation integrates with existing Gate 6 workflow

## Enhanced Key Rules (Updated for Automation)

### Automation-First Principles

- **Always attempt automated analysis first** — manual checklist only for validation and edge cases
- **Security scan integration is mandatory** — checklist without scan data is incomplete assessment
- **Automated domain classification is authoritative** — human override only for exceptional domain cases
- **Gate 6 blocking criteria are non-negotiable** — automation enforces critical security requirements automatically

### Business Rules (Automated Enforcement)

- **Zero tolerance for Critical security findings** — automation blocks Gate 6 if Critical issues exist
- **Data protection regulation compliance required** — sensitive data processing violations auto-escalate to CISO
- **Sensitive data encryption mandatory** — any sensitive data storage/transmission vulnerability is Critical
- **Industry standards enforcement** — {{INDUSTRY_TIER_1}}/{{INDUSTRY_TIER_2}}/{{INDUSTRY_TIER_3}} requirements automatically assessed

### Quality Enforcement (Automated Validation)

- **Comprehensive security coverage** — all OWASP Top 10 categories automatically evaluated
- **Domain expertise applied** — specialized patterns for sensitive data handling, authentication security, API security
- **Evidence-based assessment** — all checklist items backed by automated scan results and analysis
- **Remediation guidance included** — specific fix suggestions with configuration examples automatically generated

### Process Integration

- **SAST/SCA/DAST integration mandatory** — all security scan types consumed and analyzed automatically
- **Gate 6 evaluation enhancement** — automated checklist results required input for gate approval
- **CSV export for tracking** — all remediation items become trackable issues in the bound {{TRACKING_TOOL}}
- **Industry compliance validation** — {{INDUSTRY_TIER_1}}/{{INDUSTRY_TIER_2}}/{{INDUSTRY_TIER_3}} requirements ({{COMPLIANCE_STANDARD}}) automatically assessed

## ROI and Efficiency Gains

### Time Savings Achieved

- **Manual Security Assessment**: 4+ hours security engineer time for comprehensive platform evaluation
- **Automated Security Assessment**: <5 minutes computer time + 30 minutes human review
- **Net Savings**: 3.5+ hours per security evaluation cycle
- **Annual Impact**: 80+ hours saved (assuming 26 releases per year requiring security evaluation)

### Quality Improvements

- **Consistency**: 100% systematic application of security checklist criteria vs human variation
- **Comprehensiveness**: No missed security categories due to time pressure or human oversight
- **Domain Expertise**: Specialized domain knowledge applied consistently to every evaluation
- **Industry Compliance**: Automated assessment against {{INDUSTRY_TIER_1}}/{{INDUSTRY_TIER_2}}/{{INDUSTRY_TIER_3}} requirements
- **Evidence Trail**: Perfect audit trail of security assessment decisions and remediation actions

### Team Productivity

- **Security Team Focus**: More time on remediation strategy, less on manual checklist completion
- **Development Team**: Faster feedback on security issues with specific fix recommendations
- **Compliance Team**: Automated GDPR Article 9 compliance validation for sensitive data processing
- **Release Team**: Faster Gate 6 evaluations with comprehensive automated security assessment

### Business Impact

- **Reduced Security Risk**: Comprehensive automated assessment reduces chance of security oversights
- **Faster Time-to-Market**: 3.5 hours saved per release × 26 releases = 91 hours annually
- **Compliance Confidence**: Automated validation against the client's applicable regulations
- **Audit Readiness**: Complete security assessment documentation and evidence for regulatory audits

---

_Enhanced security checklist with automation-first approach for software development projects._

## Quality Assurance

### Validation Script

This skill includes automated validation via `scripts/validate-examples.ts`:

```bash
# Validate skill examples and structure
npx tsx scripts/validate-examples.ts
```

**Validation includes:**

- Example completeness and correctness
- Security validation compliance patterns
- Progressive disclosure adherence
- Resource organization standards

**When to use:**

- Before skill release/packaging
- In CI/CD pipeline (quality gates)
- After major example updates
- During skill maintenance cycles

**Integration with ecosystem:**

- Used by `bmad-eval-runner` for ecosystem validation
- Supports quality gates in SDLC workflow
- Provides consistent validation across all skills

## Changelog

| Version | Date       | Author                 | Changes                                                                                                                   |
| ------- | ---------- | ---------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| 1.1.0   | 2026-06-09 | TL: lang+tool agnostic | Language to English-default-configurable; abstracted code-quality (SonarQube/Snyk/ZAP) + tracking tools via tool-registry |
