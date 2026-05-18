---
name: lidr-test-plan
id: test-plan
version: "1.3.0"
last_updated: "2026-04-06"
updated_by: "System: Phase 4 Python Script Remediation"
status: active
phase: 6
owner_role: "QA Lead"
automation: true
domain_agnostic: true
description: "AUTOMATED test plan generation with risk-based approach using Python automation. Auto-analyzes project complexity, generates comprehensive test strategy with entry/exit criteria, and specialized test types. Essential when preparing testing for feature releases, API implementations, or compliance requirements. Use to transform 3+ hours of manual test planning into 5-minute automated workflow + 30-minute review. Mandatory for Gate 5 QA Sign-off preparation. ALWAYS use before QA execution to define scope, strategy, and risk-based test coverage."
---

# Test Plan Generator 🤖 AUTOMATED

Phase: 6 — QA | Gate: contributes to Gate 5 | Language: Spanish + English | Domain: Any
**ROI**: 60 hours/year (3+ hours manual → 5 minutes automated + 30 minutes review)

## 🚀 Automation Workflow (RECOMMENDED)

### Phase 1: Risk Analysis (2-3 minutes)

```bash
cd .claude/skills/test-plan/scripts
python risk-analyzer.py --project-dir . --output-dir test-analysis
```

**Auto-discovers and analyzes**:

- Project context from PRDs, RFs, NFRs, architecture files
- Domain-specific risks (data security, input validation, compliance requirements)
- Technical complexity factors (multi-modal, real-time, mobile integration)
- Regulatory requirements (industry standards, data protection, compliance frameworks)
- Team and process risks

**Generates**: `test-risk-analysis.json` + human-readable report + CSV for project management

### Phase 2: Test Strategy Generation (2-3 minutes)

```bash
python test-strategy-generator.py --input-dir test-analysis --output-dir test-plan
```

**Auto-generates comprehensive test plan**:

- Risk-based test phases with entry/exit criteria
- Domain-specific test environments and data strategy
- Automation strategy with coverage targets
- Resource requirements and timeline estimates
- Regulatory compliance testing approach

**Generates**: `test-plan-document.md` (complete test plan) + JSON data + CSV summary

### Phase 3: Human Review & Customization (30 minutes)

1. **Review generated test plan** for project-specific adjustments
2. **Validate risk assessment** against domain knowledge
3. **Customize test environments** for specific infrastructure
4. **Adjust resource estimates** based on team capacity
5. **Add manual test scenarios** not covered by automation
6. **Finalize and approve** for Gate 5 submission

### Expected Results

- **Comprehensive test plan** with risk-based prioritization
- **Domain-specific expertise** integrated throughout
- **Regulatory compliance** requirements mapped to test cases
- **Resource estimates** with timeline and effort breakdown
- **60 hours/year ROI** vs manual test planning process

---

## Manual Workflow (Legacy - use only if automation unavailable)

1. **Read approved RFs** with BDD scenarios for {{SYSTEM_FUNCTIONALITY}}
2. **Analyze system architecture**: {{CORE_COMPONENTS}}, API flows, data processing, security implementation
3. **Review domain-specific risks**: {{FUNCTIONAL_RISKS}}, {{COMPLIANCE_REQUIREMENTS}}, security vulnerabilities, performance issues
4. **Define testing approach**:
   - {{DOMAIN_SPECIFIC_TESTING}} with {{SPECIALIZED_DATASETS}}
   - {{COMPLIANCE_VALIDATION}} ({{REGULATION_REQUIREMENTS}})
   - Security testing ({{ENCRYPTION_VERIFICATION}}, API authentication, {{ATTACK_VECTORS}})
   - Performance testing under load with {{REALISTIC_DATA}}
   - Cross-platform compatibility ({{PLATFORM_COVERAGE}})
5. **Map test types** to {{BUSINESS_FUNCTIONALITIES}} with {{INDUSTRY_REQUIREMENTS}}
6. **Define entry/exit criteria** with {{QUALITY_THRESHOLDS}}, performance SLAs, compliance validation
7. **Estimate effort** considering {{SYSTEM_COMPLEXITY}}, {{COMPLIANCE_SCOPE}}, specialized testing needs

## Input

### 🤖 Automated Processing (Scripts Handle Discovery)

| Input           | Required | Auto-Discovered From                   | Processing                                  |
| --------------- | -------- | -------------------------------------- | ------------------------------------------- |
| Project context | ✅       | PRDs, architecture files, package.json | **risk-analyzer.py** parses and extracts    |
| Requirements    | ✅       | RFs, NFRs, requirements.md files       | **risk-analyzer.py** discovers and analyzes |
| Tech stack      | ✅       | package.json, file extensions, deps    | **risk-analyzer.py** identifies complexity  |
| Regulatory reqs | ✅       | Content analysis of PRDs/RFs           | **risk-analyzer.py** detects patterns       |
| Risk factors    | ✅       | Domain analysis + complexity scoring   | **risk-analyzer.py** generates assessment   |

### 📋 Manual Input (Legacy - if automation not available)

| Input                               | Required      | Source                 |
| ----------------------------------- | ------------- | ---------------------- |
| Approved RFs with BDD               | ✅            | skill `generate-rf/`   |
| PRD Técnico (architecture + NFRs)   | ✅            | skill `prd-tecnico/`   |
| PRD Funcional (journeys + personas) | ✅            | skill `prd-funcional/` |
| Risk Log                            | ✅            | skill `risk-log/`      |
| RF dependency map                   | ✅            | skill `generate-rf/`   |
| Existing regression suite           | If applicable | TestRail/repo          |

## Output Location

Generated documents should be saved to: **`docs/projects/{projectName}/test-plan.md`**

Contains comprehensive test plan with risk-based approach and specialized test types.

Example: `docs/projects/user-management-v3/test-plan.md`

## Output Template

```markdown
# Test Plan: [PROJECT / RELEASE]

| Campo       | Valor                                       |
| ----------- | ------------------------------------------- |
| **ID**      | TP-[YYYY]-[NNN]                             |
| **Release** | [vX.Y]                                      |
| **QA Lead** | [Name]                                      |
| **Estado**  | Draft / Approved / In Execution / Completed |

## 1. Alcance

### In Scope (table: Functionality, RFs, Test Types, Priority)

### Out of Scope (table: Exclusion, Reason, When)

### Assumptions

### Testing Risks (table: Risk, Probability, Impact, Mitigation)

## 2. Test Strategy

### Testing Levels (Pyramid: Unit → Integration → Contract → E2E → Manual)

(table: Level, Responsible, Tool, Automated?, Coverage Target)

### Test Types per Functionality (matrix)

### Risk-Based Approach (table: Area, Risk Level, Testing Effort %, Justification)

## 3. Entry/Exit Criteria

### Entry Criteria (table: Criterion, Verified by, Status)

### Exit Criteria (table: Criterion, Threshold, Negotiable?)

### Suspension Criteria (table: Trigger, Action)

## 4. Test Cases Summary (table: RF, US, # TCs by type)

## 5. Test Environments (table: Env, URL, Purpose, Data, Availability)

## 6. Test Data Strategy

### Data Types (table: Type, Source, Management, Refresh)

### Sensitive Data Handling

## 7. Schedule (table: Phase, Duration, Start, End, Dependency)

### Effort Estimation (table: Activity, QA Lead, QA Eng, Dev Support, Total)

## 8. Roles and Responsibilities

## 9. Testing Metrics (table: Metric, Formula, Target, Frequency)

## 10. Approval (QA Lead, PO, Tech Lead)
```

## Key Rules

- **System accuracy is measurable**: Error rate ≤0.01%, false positive rate ≤3%, precision ≥95% — not "good enough"
- **Diverse input testing mandatory**: Edge cases, boundary conditions, accessibility needs must be represented in test data
- **Compliance is testable**: Consent flows, data deletion SLAs, access requests, audit trails
- **Security testing includes attack simulation**: injection attacks, replay attacks, data correlation attempts
- **Performance testing uses realistic load**: testing with actual data volumes, not mock responses
- **Cross-platform reality**: Same service may behave differently across iOS, Android, Web, and desktop environments
- **Risk-based effort allocation**: Critical data processing gets 40% effort, consumer-facing features get 25%, internal tools get 20%
- **Regulatory exit criteria**: Compliance requirements 100%, security vulnerabilities 0 Critical/High, accuracy thresholds met
- **Sensitive test data governance**: Synthetic datasets preferred, real data requires consent + encryption + deletion schedule

## Test Plan Example

### Test Plan: User Management API v3.1 - Enhanced access control + compliance

```markdown
# Test Plan: User Management API v3.1 Platform Release

## 1. Alcance

### In Scope

| Functionality                      | RFs             | Test Types                                       | Priority |
| ---------------------------------- | --------------- | ------------------------------------------------ | -------- |
| Enhanced role-based access control | RF-PROJ-001-003 | Functional, Security, Performance, Compatibility | Critical |
| Granular consent management        | RF-PROJ-010-012 | Functional, Compliance, Integration              | Critical |
| Multi-language support             | RF-PROJ-020-022 | Localization, UI, Accessibility                  | High     |
| Cross-platform API                 | RF-PROJ-030-035 | Integration, Performance, Security               | High     |

### Testing Risks

| Risk                                                | Probability | Impact   | Mitigation                                       |
| --------------------------------------------------- | ----------- | -------- | ------------------------------------------------ |
| Access control regression                           | Medium      | Critical | Baseline testing with representative dataset     |
| Compliance gap                                      | Low         | Critical | Legal review + automated compliance tests        |
| Performance degradation on constrained environments | High        | High     | Environment matrix testing + fallback validation |

## 2. Test Strategy

### Testing Pyramid

| Level              | Responsible | Tool           | Automated? | Coverage Target | Focus Area                        |
| ------------------ | ----------- | -------------- | ---------- | --------------- | --------------------------------- |
| Unit               | Dev Team    | Jest/PyTest    | 95%        | >90%            | Business logic, edge cases        |
| API Integration    | QA Team     | Jest/Supertest | 90%        | >85%            | Data processing, encryption       |
| E2E Workflows      | QA Team     | Playwright     | 70%        | >80%            | User journeys, error paths        |
| Manual Exploratory | QA Team     | Device Lab     | 0%         | 100%            | Real environments, edge scenarios |

### Risk-Based Testing Effort

| Area                    | Risk Level | Testing Effort % | Justification                                  |
| ----------------------- | ---------- | ---------------- | ---------------------------------------------- |
| Access Control Logic    | Critical   | 35%              | Security compliance, authorization enforcement |
| Compliance Requirements | Critical   | 25%              | Regulatory requirement, audit readiness        |
| API Security            | High       | 20%              | Data protection, authentication                |
| Platform Compatibility  | Medium     | 15%              | User experience, environment fragmentation     |
| Performance             | Medium     | 5%               | SLA compliance, user satisfaction              |

## 3. Entry/Exit Criteria

### Entry Criteria

| Criterion                                         | Verified by   | Status |
| ------------------------------------------------- | ------------- | ------ |
| All RF-PROJ-001-035 implemented and code-complete | Tech Lead     | ✅     |
| Unit tests pass rate ≥95%                         | CI Pipeline   | ✅     |
| SAST/SCA scans show 0 Critical/High               | Security Team | ⚠️     |
| Test environments provisioned with test data      | DevOps        | ✅     |
| Representative dataset available for validation   | Dev Team      | ✅     |

### Exit Criteria

| Criterion                    | Threshold                                             | Negotiable?   |
| ---------------------------- | ----------------------------------------------------- | ------------- |
| Access control accuracy      | False positive rate ≤0.005%, false rejection rate ≤2% | NO            |
| Compliance tests             | 100% pass rate                                        | NO            |
| Security vulnerability scan  | 0 Critical, 0 High                                    | NO            |
| Performance SLA              | P95 <500ms for primary operations                     | NO            |
| Cross-platform compatibility | 95% success rate across target platforms              | YES (90% min) |
| Regression test suite        | 100% pass rate                                        | NO            |

## 4. Test Environments

| Env          | URL                         | Purpose                   | Data                      | Availability   |
| ------------ | --------------------------- | ------------------------- | ------------------------- | -------------- |
| QA-INT       | qa-user-mgmt.internal       | Integration testing       | Synthetic test data       | 24/7           |
| QA-STAGE     | stage-user-mgmt.example.com | E2E + performance         | Anonymized real data      | Business hours |
| QA-PROD-LIKE | prod-test.example.com       | Pre-production validation | Production-like synthetic | On demand      |

## 5. Test Data Strategy

### Sensitive Data Types

| Type              | Source                                   | Management                       | Refresh   | Privacy                            |
| ----------------- | ---------------------------------------- | -------------------------------- | --------- | ---------------------------------- |
| User records      | Synthetic generation + anonymized export | Encrypted storage, 30d retention | Weekly    | Consent required, auto-deletion    |
| Session tokens    | Test token generator                     | Encrypted, audit trail           | Bi-weekly | Compliance controls, access logged |
| Document payloads | Public domain + synthetic generation     | Encrypted, watermarked           | Monthly   | No PII, synthetic only             |

### Security Simulation Data

- Input injection payloads (SQL, XSS, command injection)
- Session replay attack scenarios
- Privilege escalation test cases
- Data exfiltration attempt vectors

## 6. Testing Metrics

| Metric               | Formula                                | Target  | Frequency   |
| -------------------- | -------------------------------------- | ------- | ----------- |
| System Accuracy      | (TP+TN)/(TP+TN+FP+FN)                  | ≥98%    | Daily       |
| False Positive Rate  | FP/(FP+TN)                             | ≤0.005% | Daily       |
| False Rejection Rate | FN/(FN+TP)                             | ≤2%     | Daily       |
| Response Time P95    | 95th percentile latency                | <500ms  | Continuous  |
| Test Coverage        | Lines covered/Total lines              | ≥85%    | Per build   |
| Compliance Pass Rate | Compliant tests/Total compliance tests | 100%    | Per release |

## 7. Specialized Testing Approaches

### Fairness and Consistency Testing

- Consistent behavior across user roles and permission levels
- Input validation under varied data formats and encodings
- Boundary condition testing for data size and type limits
- Accessibility testing across assistive technologies and devices

### Security and Resilience Testing

- Input validation attack detection using OWASP testing protocols
- Data correlation analysis (privacy protection validation)
- API fuzzing for data processing endpoints
- Encryption validation for sensitive data storage and transmission
```

## 🤖 Automation Scripts

### `scripts/risk-analyzer.py` (400+ lines)

**Purpose**: Auto-discovery and risk analysis of project testing factors

**Key Features**:

- **Project Context Discovery**: Auto-parses PRDs, RFs, package.json for project classification
- **Domain Risk Patterns**: Domain-specific risk detection (data security, input validation, compliance requirements)
- **Technical Complexity Analysis**: Multi-modal, real-time, mobile integration assessment
- **Regulatory Detection**: Auto-identifies applicable compliance frameworks and data protection requirements
- **Team Risk Assessment**: Process and coordination risk factors based on team size and complexity

**Output**:

- `test-risk-analysis.json` (machine processing)
- `test-risk-analysis-report.md` (human review)
- `test-risks.csv` (project management integration)

### `scripts/test-strategy-generator.py` (500+ lines)

**Purpose**: Transform risk analysis into comprehensive test plan documentation

**Key Features**:

- **Risk-Based Test Phases**: Generate test phases with risk-appropriate coverage targets
- **Domain Test Templates**: Domain-specific test environments and data strategies
- **Automation Strategy**: Coverage targets and automation ratio based on complexity
- **Resource Estimation**: Team composition and effort estimates with risk multipliers
- **Regulatory Compliance**: Test requirements mapped to applicable compliance frameworks

**Output**:

- `test-plan-document.md` (comprehensive test plan with domain expertise)
- `test-plan.json` (structured data)
- `test-plan-summary.csv` (project management summary)

### Integration Pattern

```bash
# Full automation workflow
cd .claude/skills/test-plan/scripts

# Phase 1: Risk Analysis (2-3 minutes)
python risk-analyzer.py --project-dir ../../../.. --output-dir test-analysis

# Phase 2: Test Plan Generation (2-3 minutes)
python test-strategy-generator.py --input-dir test-analysis --output-dir test-plan

# Result: Complete test plan ready for review and customization
```

### ROI Achievement

- **Before**: 3-4 hours manual test plan creation
- **After**: 5 minutes automation + 30 minutes review
- **Savings**: 2.5-3.5 hours per test plan
- **Annual ROI**: 60+ hours/year (based on project frequency)
- **Quality**: Consistent domain expertise + regulatory compliance

## Quality Assurance

### Validation Script

This skill includes automated validation via `scripts/validate-examples.ts`:

```bash
# Validate skill examples and structure
npx tsx scripts/validate-examples.ts
```

**Validation includes:**

- Example completeness and correctness
- Domain testing compliance patterns
- Progressive disclosure adherence
- Resource organization standards

**When to use:**

- Before skill release/packaging
- In CI/CD pipeline (quality gates)
- After major example updates
- During skill maintenance cycles

**Integration with ecosystem:**

- Used by `/multi-agent-audit` for ecosystem validation
- Supports quality gates in SDLC workflow
- Provides consistent validation across all skills

## Validation Checklist

### 🤖 Automated Validation (via scripts)

- [ ] Project complexity and risk factors automatically assessed?
- [ ] Domain-specific patterns detected and incorporated?
- [ ] Regulatory requirements mapped to test strategies?
- [ ] Resource estimates include timeline multipliers?
- [ ] Test environments configured for data sensitivity level?

### 📋 Manual Validation (human review)

- [ ] Scope maps directly to approved RFs?
- [ ] Strategy is risk-based (not uniform)?
- [ ] Exit criteria are numeric and non-negotiable for P1/P2?
- [ ] Environments and data defined with availability?
- [ ] Schedule has buffer?
- [ ] Metrics are measurable and actionable?

## Resources

- **Test strategy patterns**: `references/test-strategy-patterns.md`
- **Risk-based testing guide**: `references/risk-based-testing.md`
- **Entry/exit criteria catalog**: `references/entry-exit-criteria.md`
- **Metrics guide with benchmarks**: `references/test-metrics-guide.md`
- **Example**: `references/test-plan-onboarding.md`

---

## Changelog

| Version | Date       | Author                                    | Changes                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| ------- | ---------- | ----------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1.3.0   | 2026-04-06 | System: Phase 4 Python Script Remediation | Comprehensive domain-agnostic remediation: risk-analyzer.py script replaced all biometric-specific patterns with template variables (class {{INDUSTRY_TIER_1}}RiskPatterns, {{SENSITIVE_DATA_TYPE}} terminology, {{PRIMARY_VERIFICATION_METHOD}} patterns). Added 2 new generic examples (system-verification-v3-test-plan.md, document-verification-enhanced-test-plan.md) replacing biometric-specific examples. Achieving 78→95/100 target score through complete template variable architecture. |
| 1.2.0   | 2026-03-25 | TL: tier3-remediation                     | Previous improvements                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
