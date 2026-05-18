---
id: create-test-cases
version: "2.2.0"
last_updated: "2026-03-25"
updated_by: "TL: tier3-remediation"
status: active
phase: 6
owner_role: "QA Lead"
automation: false
domain_agnostic: true
description: >
  Generate executable BDD test cases with concrete data from tickets in "Ready for QA".
  Domain-agnostic — works for any software system, platform, or application type.
  Use for QA preparation, test coverage analysis, and BDD scenario expansion into detailed test cases.
  Essential for test execution planning when transitioning tickets to QA.
  Always use before test execution, always use when tickets move to "Ready for QA" status.
  Do NOT use for requirements generation (use generate-rf), for test planning strategy (use test-plan), or for bug reporting (use bug-report).
  Triggers on "create test cases", "generate TCs", "write test cases", "BDD test cases", "prepare test execution", "Ready for QA test cases".
  Output in English (Gherkin BDD), Spanish (functional descriptions), CSV-ready for Xray import.
  Audience: QA (executes tests), Dev (understands test scope), QA Lead (validates coverage).
---

# BDD Test Case Generator

Phase: 6 — QA | Gate: contributes to Gate 5 | Language: English (Gherkin) + Spanish (notes)

## Workflow

1. Read Jira ticket: US + BDD acceptance criteria
2. Read Dev→QA handoff: technical changes, test data, error scenarios
3. Read linked RF: detailed BDD scenarios, business rules, data specs
4. Expand each BDD scenario into executable test case with concrete data
5. Add edge cases and regression candidates from impact analysis
6. Output in CSV format ready for import-to-xray.sh script or markdown

## Input

| Input                                     | Required  | Source                  |
| ----------------------------------------- | --------- | ----------------------- |
| Jira ticket (US + BDD)                    | ✅        | Manual or script        |
| Dev→QA handoff                            | ✅        | skill `dev-handoff-qa/` |
| Linked RF (BDD scenarios, business rules) | ✅        | skill `generate-rf/`    |
| Available test data                       | ✅        | Test data repo          |
| Test Plan (risk priority)                 | Desirable | skill `test-plan/`      |

## Output Template — Per Test Case

```markdown
# TC-{PROJ}-{NNN}: {Descriptive scenario title}

## Metadata

| Field              | Value                                                                |
| ------------------ | -------------------------------------------------------------------- |
| **ID**             | TC-{PROJ}-{NNN}                                                      |
| **US**             | US-{PROJ}-{XXX}                                                      |
| **RF**             | RF-{PROJ}-{XXX}                                                      |
| **Type**           | Functional / Edge Case / Error / Regression / Performance / Security |
| **Priority**       | Critical / High / Medium / Low                                       |
| **Automated**      | Yes (Playwright) / No (Manual) / Planned                             |
| **Execution Time** | ~[X] min                                                             |

## Preconditions

1. [Verifiable precondition with concrete values]

## Test Steps

| Step | Action            | Test Data       | Expected Result     |
| ---- | ----------------- | --------------- | ------------------- |
| 1    | [concrete action] | [specific data] | [observable result] |

## Postconditions

[System state after execution]

## BDD (Gherkin)

{gherkin scenario with concrete data}
```

## Coverage Requirements Per Ticket

For each BDD criterion from the RF/US, generate:

1. **Happy path** test case (min 1)
2. **Alternative path** test cases (valid but different paths)
3. **Error cases** (invalid data, unauthorized, timeout, etc.)
4. **Edge cases** (boundary values, empty inputs, max values, concurrent access)
5. **Regression candidates** (related functionality that might break)

## Key Rules

- **Concrete data always**: "valid input" → `test-data/input-valid-001.json`. QA must execute without interpreting.
- **Each step = one action**: Don't combine "fill form and submit" → separate steps.
- **Expected results are observable**: "system processes correctly" → "system returns 200 with `{verified: true}`"
- **Priority from risk**: Critical = core business flow. High = important error handling. Medium = alternative paths. Low = edge cases.
- **Automation flag**: Mark Critical/High as automation candidates. Tag with Playwright selector hints if possible.
- **Independence**: Each TC must be executable without running other TCs first.

## Test Case Summary Table

After all TCs, generate summary:

```markdown
| RF        | US     | Total TCs | Functional | Edge | Error | Regression | Priority    |
| --------- | ------ | --------- | ---------- | ---- | ----- | ---------- | ----------- |
| RF-001    | US-001 | {N}       | {N}        | {N}  | {N}   | {N}        | {breakdown} |
| **Total** |        | **{N}**   |            |      |       |            |             |
```

## CSV Export Format

Output ready for import-to-xray.sh script:

```csv
Test ID,Test Summary,Test Type,Priority,Component,Given,When,Then,Expected Result
TC-PROJ-001,User login with valid credentials,Functional,High,Authentication,"User has valid account","User enters correct email and password","User clicks login button","User is redirected to dashboard"
```

## Example Output

### Complete BDD Scenario to Test Case

**Input BDD from RF:**

```gherkin
Given user has valid account credentials
When user submits login form with correct username and password
Then system authenticates the user and grants access
```

**Generated Test Case:**

````markdown
# TC-PROJ-001: User Login - Valid Credentials

## Metadata

| Field              | Value            |
| ------------------ | ---------------- |
| **ID**             | TC-PROJ-001      |
| **US**             | US-PROJ-123      |
| **RF**             | RF-PROJ-007      |
| **Type**           | Functional       |
| **Priority**       | Critical         |
| **Automated**      | Yes (Playwright) |
| **Execution Time** | ~3 min           |

## Preconditions

1. User account `test-user@example.com` exists in the system
2. Test data `test-data/users/user-valid-001.json` is available
3. Authentication service is running and healthy

## Test Steps

| Step | Action                         | Test Data                                       | Expected Result              |
| ---- | ------------------------------ | ----------------------------------------------- | ---------------------------- |
| 1    | Navigate to login page         | URL: `/auth/login`                              | Page loads with login form   |
| 2    | Enter username                 | Email: `test-user@example.com`                  | Username field populated     |
| 3    | Enter password                 | Password: `test-data/users/user-valid-001.json` | Password field populated     |
| 4    | Click "Login" button           | -                                               | Processing indicator appears |
| 5    | Wait for authentication result | Timeout: 30s                                    | Dashboard page displays      |

## Expected Final Result

- HTTP 200 response
- JSON contains: `{authenticated: true, userId: "usr-001", role: "standard"}`
- User is redirected to dashboard
- Session token is set in cookie

## Postconditions

- Session record saved in database
- Audit log entry created
- User can access protected resources

## BDD (Gherkin)

```gherkin
Given user "test-user@example.com" has a valid account
  And authentication service is available
When user enters valid credentials and clicks "Login"
Then system responds with HTTP 200
  And response contains "authenticated: true"
  And user is redirected to "/dashboard"
  And session token is present in response
```
````

````

### Negative Test Case Example

```markdown
# TC-PROJ-002: User Login - Invalid Credentials

## Metadata
| Field | Value |
|-------|-------|
| **ID** | TC-PROJ-002 |
| **US** | US-PROJ-123 |
| **RF** | RF-PROJ-007 |
| **Type** | Error Case |
| **Priority** | High |
| **Automated** | Yes (Playwright) |
| **Execution Time** | ~2 min |

## Preconditions
1. User account `test-user@example.com` exists in the system
2. Invalid credentials `test-data/users/user-invalid-001.json` are available

## Test Steps
| Step | Action | Test Data | Expected Result |
|------|--------|-----------|-----------------|
| 1 | Navigate to login page | URL: `/auth/login` | Page loads successfully |
| 2 | Enter username | Email: `test-user@example.com` | Username field populated |
| 3 | Enter incorrect password | Password: `wrong-password-123` | Password field populated |
| 4 | Click "Login" button | - | Processing starts |
| 5 | Wait for error response | Timeout: 10s | Error message appears |

## Expected Final Result
- HTTP 401 response
- Error message: "Invalid credentials"
- Error code: `AUTHENTICATION_FAILED`
- No session record created

## BDD (Gherkin)
```gherkin
Given user "test-user@example.com" exists in the system
When user submits login form with incorrect password "wrong-password-123"
Then system responds with HTTP 401
  And error message contains "Invalid credentials"
  And no session record is saved
````

````

### CSV Export Format Example

```csv
Test ID,Test Summary,Test Type,Priority,Component,Preconditions,Test Steps,Test Data,Expected Result
TC-PROJ-001,User login with valid credentials,Functional,Critical,Authentication,"User account exists, auth service available","1. Navigate to login page 2. Enter credentials 3. Click login","user-valid-001.json","HTTP 200, authenticated:true, redirect to dashboard"
TC-PROJ-002,User login with invalid credentials,Error,High,Authentication,"User account exists","1. Navigate to login page 2. Enter wrong password 3. Click login","user-invalid-001.json","HTTP 401, error message displayed"
````

## Troubleshooting

### Incomplete BDD Scenarios

**Problem**: BDD scenarios lack concrete details

```gherkin
Given user has data
When user submits it
Then system processes
```

**Solution**:

1. Reference the linked RF for complete scenario details
2. Check Dev→QA handoff for technical specifications
3. Add concrete test data from test data catalog
4. If details missing, flag as `⚠️ REQUIRES CLARIFICATION` and note what's needed

**Enhanced version**:

```gherkin
Given user "test@example.com" has valid input data "input-valid-001.json"
When user submits data via /api/v1/process endpoint
Then system returns HTTP 200 with status:success and result present
```

### Missing Test Data Identification

**Common missing elements**:

- Specific file names and paths
- API endpoints and parameters
- Expected response formats
- Boundary values (min/max lengths, dates)
- User credentials and roles
- Environment configuration

**Resolution steps**:

1. Check `references/test-data-catalog.md` for available test assets
2. Cross-reference with Dev→QA handoff for new test data needs
3. For sensitive data, ensure GDPR compliance (synthetic data only)
4. Flag missing data with specific requirements: `⚠️ REQUIRES: Valid input data file matching expected schema`

### Edge Case Identification Techniques

**Systematic approach**:

1. **Boundary Value Analysis**:
   - Min/max file sizes (0 bytes, 10MB limit)
   - Date boundaries (today, expired documents, future dates)
   - String lengths (empty, max character limits)
   - Numeric ranges (confidence scores 0.0-1.0)

2. **Input Processing Edge Cases**:
   - Poor data quality (malformed, truncated, encoding issues)
   - Partial data (incomplete records, missing required fields)
   - Duplicate submissions (same data submitted multiple times)
   - No matching data found scenarios
   - Tampered or corrupted data attempts

3. **System-Level Edge Cases**:
   - Network timeouts during upload
   - Concurrent user verification attempts
   - Service unavailable scenarios
   - Database connection failures
   - Rate limiting triggers

### Common Test Case Quality Issues

**Anti-patterns to avoid**:

❌ **Vague assertions**: "System works correctly"
✅ **Specific assertions**: "HTTP 200 with JSON containing verified:true"

❌ **Combined actions**: "Fill form and submit"
✅ **Atomic steps**: "Step 1: Fill name field, Step 2: Click submit"

❌ **Magic data**: "Use valid document"
✅ **Concrete data**: "Upload dni-valid-madrid-001.jpg"

❌ **Missing cleanup**: Test leaves system in modified state
✅ **Clean postconditions**: Database state documented, cleanup steps if needed

## Regression Guidance

### Identifying Regression Candidates

**From code changes** (analyze Dev→QA handoff):

1. **Direct Impact**: Components/modules modified
   - API endpoint changes → test all related endpoints
   - Database schema updates → test data integrity scenarios
   - Authentication changes → test all auth-related flows

2. **Indirect Impact**: Dependent functionality
   - Shared library updates → test all consuming services
   - Configuration changes → test environment-specific scenarios
   - Third-party SDK upgrades → test integration points

3. **Risk-based Selection**:
   - Critical business flows (user registration, payment processing)
   - Previously buggy areas (check historical bug reports)
   - Complex integration points (external APIs, file processing)

### Risk-Based Test Case Prioritization

**Priority Matrix**:

| Business Impact | Technical Risk | Priority | Action                              |
| --------------- | -------------- | -------- | ----------------------------------- |
| High            | High           | P1       | Execute first, automate if possible |
| High            | Low            | P2       | Execute in first test cycle         |
| Low             | High           | P3       | Execute in second test cycle        |
| Low             | Low            | P4       | Execute if time permits             |

**Business Impact factors**:

- Revenue impact (payment flows, subscription management)
- Regulatory compliance (GDPR, PSD2, eIDAS)
- User experience (onboarding, core verification flows)
- Security implications (authentication, data protection)

**Technical Risk factors**:

- Code complexity (cyclomatic complexity > 10)
- External dependencies (third-party APIs, cloud services)
- Data transformation logic (parsing, validation, formatting)
- Concurrency handling (file uploads, batch processing)

### Impact Analysis for Test Case Selection

**Step-by-step process**:

1. **Map code changes** to functional areas

   ```
   File: /src/ocr/document-parser.ts
   → Functional area: Document verification
   → Related TCs: TC-*-OCR-*, TC-*-DOC-*
   ```

2. **Identify data flow impact**

   ```
   Database schema change: users.verification_status
   → Downstream impact: reporting, user dashboard, admin panel
   → Related TCs: TC-*-STATUS-*, TC-*-DASHBOARD-*
   ```

3. **Check integration touchpoints**
   ```
   API contract change: /api/v1/verify response format
   → Client impact: mobile app, web portal, third-party integrations
   → Related TCs: TC-*-API-*, TC-*-INTEGRATION-*
   ```

## Test Data Management

### Sensitive Data Compliance Considerations

**Data Privacy for Test Data**:

1. **Synthetic Data Only**:
   - Use generated/synthetic records for testing — never real user data
   - Create synthetic datasets with realistic but fictitious values
   - Generate representative sample data for all test scenarios
   - Never use real user personal data in testing environments

2. **Data Catalog Structure**:

   ```
   test-data/
   ├── users/
   │   ├── valid/          # Active accounts, correct roles
   │   ├── expired/        # Expired accounts, past-due subscriptions
   │   ├── edge-cases/     # Boundary values, special characters
   │   └── invalid/        # Malformed records, missing fields
   ├── payloads/
   │   ├── api-requests/
   │   │   ├── valid/      # Well-formed requests
   │   │   ├── partial/    # Missing optional fields
   │   │   └── invalid/    # Schema violations
   │   └── file-uploads/
   │       ├── valid/      # Acceptable formats and sizes
   │       ├── oversized/  # Exceeds size limits
   │       └── wrong-type/ # Unsupported MIME types
   ```

3. **Test Data Versioning**:
   - Tag test data versions with test execution cycles
   - Maintain backwards compatibility for automated tests
   - Document test data provenance and characteristics

### Data Management Best Practices

**File Naming Convention**:

```
{type}-{quality}-{variant}-{sequence}.{ext}
Examples:
- user-valid-standard-001.json
- user-expired-premium-005.json
- payload-valid-minimal-012.json
- upload-valid-image-007.png
```

**Metadata Documentation**:

```yaml
# test-data/users/valid/user-valid-standard-001.yml
file: user-valid-standard-001.json
type: user
role: standard
status: active
expiry_date: "2030-12-15"
record_data:
  username: "test-user-001"
  email: "test-user-001@example.com"
  account_id: "acc-00001"
test_scenarios:
  - happy_path_login
  - profile_retrieval
  - permission_check
privacy_compliant: true
synthetic: true
created: "2025-01-15"
```

**Test Environment Data Refresh**:

1. **Automated refresh triggers**:
   - Before each test cycle execution
   - After significant test data updates
   - When test failures indicate stale data

2. **Data consistency checks**:
   - Verify file integrity (checksums)
   - Validate metadata matches file content
   - Ensure required test data is available
   - Check for missing or corrupted files

3. **Cleanup procedures**:
   - Remove temporary test artifacts
   - Clear test user accounts and sessions
   - Reset database state to known baseline
   - Purge sensitive test logs

## Resources

- **TC template with examples**: `references/tc-template.md`
- **BDD anti-patterns**: see skill `generate-rf/` references
- **Test data catalog**: `references/test-data-catalog.md`

## Quality Assurance

### Validation Script

This skill includes automated validation via `scripts/validate-examples.ts`:

```bash
# Validate skill examples and structure
npx tsx scripts/validate-examples.ts
```

**Validation includes:**

- Example completeness and correctness
- BDD test case generation and QA preparation compliance patterns
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

## Changelog

| Versión | Fecha      | Autor             | Cambios                                                                                                    |
| ------- | ---------- | ----------------- | ---------------------------------------------------------------------------------------------------------- |
| 2.2.0   | 2026-03-16 | Tech Lead: System | Added Quality Assurance section with validation framework                                                  |
| 2.0.0   | 2026-03-09 | QA: Enhanced      | Added comprehensive examples, troubleshooting guide, regression guidance, and test data management section |
| 1.0.0   | 2025-02-01 | QA: Initial       | Versión inicial del skill                                                                                  |
