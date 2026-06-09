---
name: lidr-dev-handoff-qa
id: dev-handoff-qa
version: "1.4.0"
last_updated: "2026-06-09"
updated_by: "TL: lang+tool agnostic"
status: active
phase: 5
owner_role: "TL"
automation: false
domain_agnostic: true
language_default: en
integrations: [tracking, chat, vcs]
description: >
  Generate comprehensive Dev-to-QA handoff documentation when tickets transition to "Ready for QA" status.
  Domain-agnostic — works for any software development, platform, or application type.
  Use for seamless development-to-testing transitions and QA preparation with complete implementation context.
  Essential at Gate 4: enables QA to test without asking developers questions.
  Always use when marking tickets ready for testing, always use after PR merge or approved code review when completing User Story implementation.
  Do NOT use for post-QA deployment handoffs (use change-request), for production incidents (use postmortem), or for test case creation (use create-test-cases).
  Triggers on "generate handoff", "ready for QA", "handoff to QA", "pass to testing", "development complete", "transition to testing".
  Output: English by default; artifact language follows the client `language` setting (see `_shared/lidr/integrations/`).
  Audience: QA (primary tester), QA Lead (validates completeness), Dev (reference for questions).
---

# Dev → QA Handoff Generator

Phase: 5 (Development) → 6 (QA) | Gate: **G4 evidence — Dev→QA, `required: true`** | Output: English by default; artifact language follows the client `language` setting (see `_shared/lidr/integrations/`).

Tools resolve via the central registry `_shared/lidr/integrations/tool-registry.yaml`; the active client binds concrete tools in `clients/<CODE>.yaml`.

**Principle:** If QA needs to ask "how do I test this?" after reading the handoff, the handoff failed.

## Relationship to BMad

This skill is a **LIDR extension on top of BMad** (BMad = source of truth; LIDR fills gaps BMad has no concept of). BMad's `bmad-dev-story` produces the _implemented story_ and `bmad-code-review` reviews it statically — but BMad has **no human-readable Dev→QA handoff** for a manual QA tester. That gap is this skill.

- **Consumes (base):** `bmad-dev-story` output (implemented-story context) + the merged diff.
- **Consumes (LIDR siblings, same G4):** `/lidr-spec-verify` → `test-report.md` + `reports/` (Step N+1/N+2/N+3 evidence); `lidr-playwright-cli` runtime/visual review (its screenshots feed §5 and §7).
- **Feeds (QA flow):** `bmad-testarch-test-design`, `bmad-testarch-trace` (traceability + gate decision), the `bmad-tea` Test Architect, and `lidr-create-test-cases`.

Wired into `_shared/lidr/gate-evidence.yaml` → **G4** as `required: true` at `{client_root}/handoffs/dev-qa-*.md`.

## Workflow

1. Read the BMad implemented story (`bmad-dev-story`) + {{TRACKING_TOOL}} ticket: US + BDD acceptance criteria + linked RF
2. Read PR diff to identify changes (endpoints, DB, config, components)
3. Read `/lidr-spec-verify` outputs: `test-report.md` + `reports/` (unit / curl / E2E evidence)
4. Generate handoff using template below; pull screenshots & runtime evidence from `lidr-playwright-cli` (§5, §7)
5. Identify regression areas from diff analysis
6. Save to `docs/projects/{client}/handoffs/dev-qa-{PROJ-XXX}.md`, attach to {{TRACKING_TOOL}}, transition to "Ready for QA"

## Input

| Input                                        | Required  | Source                             |
| -------------------------------------------- | --------- | ---------------------------------- |
| {{TRACKING_TOOL}} ticket (US + BDD criteria) | ✅        | Manual or script                   |
| PR with merged diff                          | ✅        | {{VCS_TOOL}}                       |
| DoD checklist completed                      | ✅        | PR description                     |
| Staging environment URL                      | ✅        | DevOps                             |
| Test data                                    | Desirable | Developer / QA shared folder       |
| `test-report.md` + `reports/`                | ✅        | `/lidr-spec-verify` (G4 sibling)   |
| Runtime/visual review + shots                | Desirable | `lidr-playwright-cli` (G4 sibling) |
| Implemented-story context                    | Desirable | `bmad-dev-story` (BMad base)       |

## Output Template

ALWAYS use this structure. Save to `docs/projects/{client}/handoffs/dev-qa-{PROJ-XXX}.md` — the exact path the G4 gate reads (`_shared/lidr/gate-evidence.yaml`).

```markdown
# Handoff Dev → QA: {PROJ-XXX} — {US Title}

| Field                     | Value                               |
| ------------------------- | ----------------------------------- |
| **Ticket**                | [{PROJ-XXX}]({url})                 |
| **Source RF (RF Origen)** | RF-{PROJ}-{NNN}                     |
| **PR**                    | [#{number}]({url}) — merged {date}  |
| **Environment**           | [Staging URL] — deployed {datetime} |
| **Feature Flag**          | {flag name = ON/OFF} or "No flag"   |

## 1. What Was Implemented?

### Functional Description (USER language, not developer)

### Visible Changes (table: change, where, screenshot)

### What Was NOT Implemented (explicit exclusions to avoid false bugs)

## 2. Technical Changes Relevant for QA

### Endpoints (Method, Path, Description, New/Modified)

### Database (Table, Change, Migration, QA Impact)

### Configuration (Variable, Staging Value, Notes)

### External Dependencies (Service, Status, Impact if down)

## 3. How to Test It

### Prerequisites (verifiable checklist: env, user, data, flags, services)

### Main Flow — Happy Path (table: Step, Action, Data, Expected Result)

### Error Scenarios (table: #, Scenario, How to Reproduce, Expected)

### Edge Cases (table: #, Case, How to Reproduce, Expected)

## 4. Test Data

### Test Documents/Files (table: File, Type, Purpose, Expected Result)

### Test Users (table: User, Password, Role, Status, Notes)

## 5. Regression Areas

### Impact areas (table: Area, Why affected, Regression priority)

### Suggested Smoke Test (top 5 tests to run FIRST)

## 6. Risks and Limitations (table: Risk, Testing Impact, Workaround)

## 7. Screenshots / Demo (visual evidence of each key screen)
```

## Key Rules

- Write in USER language: "Added POST /verify" → "The user can now upload a document to verify their identity"
- Concrete data, not generic: "Upload a valid image" → "Upload `test-data/dni-valid-001.jpg`"
- Errors are first-class citizens: same detail level as happy path
- Explicit exclusions prevent false bug reports
- Prerequisites must be a verifiable checklist
- Analyze diff to suggest regression areas automatically

## Validation Checklist

- [ ] Functional description understandable without reading code?
- [ ] Test steps have concrete data (not "a valid value")?
- [ ] Each error scenario has reproduction steps + expected result?
- [ ] Prerequisites are a verifiable checklist?
- [ ] Regression areas identified from diff analysis?
- [ ] "Not implemented" section present?
- [ ] Config changes (env vars, flags) declared?

## Example Handoff: Document Verification with Authenticity Detection

### Realistic Complete Handoff Document

Example (Jira tracking + GitHub PRs — illustrative, not canonical; concrete tools resolve via the registry):

```markdown
# Handoff Dev → QA: FACE-456 — Implement document verification with liveness

| Field                     | Value                                                                                  |
| ------------------------- | -------------------------------------------------------------------------------------- |
| **Ticket**                | [FACE-456](https://jira.example.com/browse/FACE-456)                                   |
| **Source RF (RF Origen)** | RF-FACE-012                                                                            |
| **PR**                    | [#1247](https://github.com/example-org/platform/pull/1247) — merged 2026-03-08 14:30   |
| **Environment**           | [https://staging.example.com](https://staging.example.com) — deployed 2026-03-08 15:45 |
| **Feature Flag**          | `LIVENESS_DETECTION_V2 = ON`                                                           |

## 1. What Was Implemented?

### Functional Description

- **New flow**: The user can now verify identity documents with automatic liveness detection
- **Improved validation**: The system detects whether the document is real and whether the person is physically present
- **Visual feedback**: Real-time indicators during capture (green/red frames)
- **Immediate results**: Confidence score and accept/reject decision on completion

### Visible Changes

| Change                        | Where                      | Screenshot                                   |
| ----------------------------- | -------------------------- | -------------------------------------------- |
| "Verify with Liveness" button | Main verification page     | `test-screenshots/main-page-new-button.png`  |
| Camera with guide overlay     | Capture modal              | `test-screenshots/camera-overlay-guides.png` |
| Results screen                | On verification completion | `test-screenshots/results-screen.png`        |
| Progress indicator            | During processing          | `test-screenshots/progress-indicator.png`    |

### What Was NOT Implemented

- ❌ Support for foreign documents (Spanish DNI/NIE only)
- ❌ Offline mode (requires an internet connection)
- ❌ Automatic saving of captured images
- ❌ Third-party service integration (proprietary algorithms only)

## 2. Technical Changes Relevant for QA

### Endpoints

| Method | Path                                               | Description                            | Status   |
| ------ | -------------------------------------------------- | -------------------------------------- | -------- |
| POST   | `/api/v1/verification/liveness`                    | Starts a liveness verification session | New      |
| GET    | `/api/v1/verification/liveness/{sessionId}`        | Verification status                    | New      |
| POST   | `/api/v1/verification/liveness/{sessionId}/upload` | Uploads document image                 | Modified |

### Database

| Table                   | Change                                     | Migration                         | QA Impact                            |
| ----------------------- | ------------------------------------------ | --------------------------------- | ------------------------------------ |
| `verification_sessions` | Added column `liveness_score` DECIMAL(5,4) | `20260308_add_liveness_score.sql` | Verify the score is stored correctly |
| `document_captures`     | Added column `quality_metrics` JSONB       | Same migration                    | Test with different image qualities  |

### Configuration

| Variable                | Staging Value | Notes                          |
| ----------------------- | ------------- | ------------------------------ |
| `LIVENESS_THRESHOLD`    | `0.75`        | Minimum score to accept        |
| `MAX_CAPTURE_ATTEMPTS`  | `3`           | Maximum 3 attempts per session |
| `LIVENESS_DETECTION_V2` | `true`        | Feature flag active            |

### External Dependencies

| Service                   | Status    | Impact if down                   |
| ------------------------- | --------- | -------------------------------- |
| Identity Verification API | ✅ Active | Liveness detection does not work |
| Document OCR Service      | ✅ Active | Does not extract document data   |
| Redis Cache               | ✅ Active | Sessions expire immediately      |

## 3. How to Test It

### Prerequisites

- [ ] Feature flag `LIVENESS_DETECTION_V2 = ON` verified at `/admin/flags`
- [ ] Test user: `qa.tester@example.com` / `TestPass2024!` (role: verified_user)
- [ ] Browser with camera support (latest Chrome/Firefox versions)
- [ ] Test documents in folder `test-data/documents/`
- [ ] Camera permissions granted to the staging domain

### Main Flow — Happy Path

| Step | Action                       | Data                                    | Expected Result                       |
| ---- | ---------------------------- | --------------------------------------- | ------------------------------------- |
| 1    | Log in                       | qa.tester@example.com                   | Main dashboard visible                |
| 2    | Click "Verify with Liveness" | -                                       | Camera modal opens                    |
| 3    | Allow camera access          | -                                       | Active camera preview                 |
| 4    | Place DNI in frame           | `test-data/documents/dni-valid-001.jpg` | Green frame, "Capture" button enabled |
| 5    | Click "Capture"              | -                                       | Processing progress visible           |
| 6    | Wait for analysis            | ~10-15 seconds                          | Results screen appears                |
| 7    | Verify result                | -                                       | Score > 0.75, status "ACCEPTED"       |

### Error Scenarios

| #   | Scenario          | How to Reproduce                                | Expected Result                                   |
| --- | ----------------- | ----------------------------------------------- | ------------------------------------------------- |
| 1   | Corrupted file    | Use `test-data/files/profile-corrupted-001.jpg` | Error "File damaged, please select another"       |
| 2   | No selection      | Click "Submit" without selecting a file         | Error "You must select at least one file"         |
| 3   | Invalid format    | Use `test-data/files/document-invalid-001.txt`  | Error "File format not allowed"                   |
| 4   | Size exceeded     | Upload a file >5MB                              | Error "The file exceeds the maximum allowed size" |
| 5   | 3 failed attempts | Fail 3 times in a row                           | Error "Attempt limit reached. Contact support"    |

### Edge Cases

| #   | Case            | How to Reproduce          | Expected Result                                   |
| --- | --------------- | ------------------------- | ------------------------------------------------- |
| 1   | Slow network    | Throttle connection to 3G | Timeout after 30s with an appropriate message     |
| 2   | Expired session | Wait 15 minutes inactive  | Redirect to login with message "Session expired"  |
| 3   | Multiple tabs   | Open 2 tabs of the flow   | Only one active session, the other shows an error |

## 4. Test Data

### Test Files/Data

| File                        | Type                | Purpose                | Expected Result                        |
| --------------------------- | ------------------- | ---------------------- | -------------------------------------- |
| `profile-valid-001.jpg`     | Valid profile image | Basic happy path       | Successful validation, status ACCEPTED |
| `profile-valid-002.jpg`     | Valid profile image | Alternative happy path | Successful validation, status ACCEPTED |
| `profile-large-001.jpg`     | Image >5MB          | Size validation        | Error "File too large"                 |
| `profile-corrupted-001.jpg` | Corrupted file      | Format error           | Error "Invalid file format"            |
| `invoice-valid-001.pdf`     | Valid invoice       | Document processing    | Processed correctly                    |
| `invoice-invalid-001.txt`   | Text file           | Unsupported format     | Error "File type not allowed"          |

### Test Users

| User                   | Password      | Role          | Status  | Notes                     |
| ---------------------- | ------------- | ------------- | ------- | ------------------------- |
| qa.tester@example.com  | TestPass2024! | verified_user | Active  | Main testing user         |
| qa.premium@example.com | TestPass2024! | premium_user  | Active  | User with extended limits |
| qa.blocked@example.com | TestPass2024! | verified_user | Blocked | For testing blocked users |

## 5. Regression Areas

### Impact Areas

| Area            | Why Affected            | Regression Priority |
| --------------- | ----------------------- | ------------------- |
| File processing | Same code base modified | 🔴 High             |
| Session system  | New state management    | 🟡 Medium           |
| Main dashboard  | New button added        | 🟡 Medium           |
| Uploads API     | Endpoint modified       | 🔴 High             |
| Database        | New column added        | 🟡 Medium           |

### Suggested Smoke Test

1. **File upload** standard still works
2. **Login/logout** work normally
3. **Dashboard** loads without errors
4. **API health** responds OK at `/health`
5. **Feature flag** can be enabled/disabled correctly

## 6. Risks and Limitations

| Risk                              | Testing Impact                         | Workaround                                     |
| --------------------------------- | -------------------------------------- | ---------------------------------------------- |
| Processing sensitive to file size | Tests may fail with very large files   | Use optimized test files                       |
| Dependency on external services   | Intermittent tests if services go down | Check status at `/admin/health` before testing |
| Feature flag may change           | Tests fail if the flag is disabled     | Verify the flag at the start of each session   |
| 3-attempt limit per session       | Cannot test multiple errors            | Use different sessions for each error test     |

## 7. Screenshots / Demo

- **Main screen**: `test-screenshots/main-page-new-feature.png`
- **Upload modal**: `test-screenshots/upload-modal-active.png`
- **File selected**: `test-screenshots/file-selected-preview.png`
- **Processing**: `test-screenshots/upload-progress-animation.png`
- **Success result**: `test-screenshots/upload-success-message.png`
- **Format error**: `test-screenshots/format-error-message.png`

**Full demo video**: `test-videos/file-upload-complete-flow.mp4`
```

## Quality Validation Checklist

Use this checklist to validate handoff quality before sending to QA:

### Completeness Assessment

- [ ] **Functional description** clear without technical jargon?
- [ ] **Visual changes** documented with specific locations?
- [ ] **What's NOT implemented** explicitly stated?
- [ ] **Technical changes** relevant for QA testing identified?
- [ ] **Prerequisites** are a verifiable checklist?
- [ ] **Test data** includes specific files/users/credentials?
- [ ] **Error scenarios** have concrete reproduction steps?
- [ ] **Regression areas** identified based on code changes?

### Clarity Verification

- [ ] QA can execute tests without asking follow-up questions?
- [ ] User language used instead of developer terminology?
- [ ] Concrete data provided (not "valid values" or "test user")?
- [ ] Expected results clearly defined for each test case?
- [ ] Screenshots/videos referenced for visual verification?

### Testability Check

- [ ] Each acceptance criterion has corresponding test steps?
- [ ] Error paths tested with same detail as happy path?
- [ ] Edge cases identified and documented?
- [ ] Performance expectations defined where relevant?
- [ ] Configuration dependencies clearly stated?

### Missing Information Detection

- [ ] Test environment URLs and access provided?
- [ ] Feature flags and their states documented?
- [ ] External service dependencies and their status?
- [ ] Database migration impact on testing explained?
- [ ] Recovery steps for failed test scenarios?

## Change Type Templates

### UI Component Changes

**Test Focus**: Visual and functional behavior

```markdown
### UI Component Testing Checklist

- [ ] Component renders correctly in different screen sizes
- [ ] All interactive elements (buttons, inputs) work as expected
- [ ] CSS styles apply correctly (colors, fonts, spacing)
- [ ] Component state changes reflect visually
- [ ] Accessibility: keyboard navigation, screen reader compatibility
- [ ] Cross-browser testing (Chrome, Firefox, Safari, Edge)
- [ ] Mobile responsiveness if applicable
```

### API Endpoint Changes

**Test Focus**: Request/response validation and integration

```markdown
### API Endpoint Testing Checklist

- [ ] Request format matches OpenAPI specification
- [ ] Response format matches expected schema
- [ ] HTTP status codes correct for different scenarios
- [ ] Error messages are user-friendly and informative
- [ ] Authentication/authorization working properly
- [ ] Rate limiting behavior as expected
- [ ] Integration with frontend components functional
- [ ] Database changes reflected in API responses
```

### Database Changes

**Test Focus**: Data integrity and migration verification

```markdown
### Database Changes Testing Checklist

- [ ] Migration applied successfully in test environment
- [ ] New columns accept expected data types and constraints
- [ ] Existing data preserved and accessible
- [ ] Foreign key relationships working correctly
- [ ] Indexes performing as expected (if performance-critical)
- [ ] Backup and restore processes still functional
- [ ] Application queries work with new schema
```

### Configuration Changes

**Test Focus**: Environment behavior verification

```markdown
### Configuration Testing Checklist

- [ ] New environment variables loaded correctly
- [ ] Feature flags toggle behavior as expected
- [ ] Application starts with new configuration
- [ ] Different environment configurations (dev/staging/prod) work
- [ ] Rollback to previous configuration possible
- [ ] Monitoring and alerting reflect configuration changes
- [ ] Performance impact of configuration changes measured
```

## Common Pitfalls and How to Avoid Them

### Missing Test Data or Credentials

**Pitfall**: Handoff says "use valid test user" without providing specific credentials.

**Solution**:

```markdown
### Correct Format:

| User                  | Password       | Role          | Notes                |
| --------------------- | -------------- | ------------- | -------------------- |
| qa.tester@example.com | TestPass2024!  | verified_user | Main user            |
| qa.admin@example.com  | AdminPass2024! | admin         | For permission tests |
```

### Unclear Acceptance Criteria

**Pitfall**: Vague descriptions like "system should work correctly"

**Solution**:

```markdown
### Specific Expected Results:

- ✅ "Score > 0.75 displayed with green indicator"
- ❌ "System shows success message"
```

### Incomplete Regression Analysis

**Pitfall**: Not identifying what existing functionality might be affected

**Solution**:

```markdown
### Regression Impact Analysis:

1. **Code Analysis**: Review modified files and their dependencies
2. **Functional Impact**: Map changes to user-facing features
3. **Technical Impact**: Identify shared components/services affected
4. **Priority Matrix**: High/Medium/Low based on user impact
```

### Technical Jargon for QA Audience

**Pitfall**: "Updated POST /api/v1/users endpoint to validate JWT tokens"

**Solution**: "Users must now be authenticated to update their profile. If they have not logged in, they will see an error asking them to sign in."

### Missing Environment Setup

**Pitfall**: Assuming QA knows how to configure test environment

**Solution**:

```markdown
### Environment Prerequisites:

- [ ] Feature flag `NEW_FEATURE = ON` in staging admin panel
- [ ] Test database seeded with script `scripts/seed-test-data.sql`
- [ ] External API mock server running on port 3001
- [ ] Browser cache cleared before testing
```

### Insufficient Error Scenario Coverage

**Pitfall**: Only documenting happy path testing

**Solution**: Document error scenarios with same detail level as success cases, including:

- Input validation errors
- Network/connectivity issues
- Service dependency failures
- Permission/authorization errors
- Resource limit exceeded scenarios

## Resources

- **Complete handoff example**: `examples/feature-handoff-example.md`
- **Validation script**: `scripts/validate-examples.ts` (see Quality Assurance below)

## Quality Assurance

### Validation Script

This skill includes automated validation via `scripts/validate-examples.ts`:

```bash
# Validate skill examples and structure
npx tsx scripts/validate-examples.ts
```

**Validation includes:**

- Example completeness and correctness
- Development-to-QA handoff and testing transition compliance patterns
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

| Version | Date       | Author                 | Changes                                                                                        |
| ------- | ---------- | ---------------------- | ---------------------------------------------------------------------------------------------- |
| 1.4.0   | 2026-06-09 | TL: lang+tool agnostic | Language to English-default-configurable; abstracted tracking/chat/vcs tools via tool-registry |
