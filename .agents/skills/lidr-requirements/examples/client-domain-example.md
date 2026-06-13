---
id: lidr-requirements-{{CLIENT_CODE}}-examples
version: "1.0.0"
last_updated: "2026-03-25"
updated_by: "TL: tier3-remediation"
status: active
type: example
domain: biometric-identity
---

# {{CLIENT_NAME}} Domain RF Examples

> **Purpose**: Domain-specific RF examples for biometric identity verification systems.
> These examples are intentionally kept here as reference for {{CLIENT_NAME}}-context usage.
> The main SKILL.md uses generic, domain-agnostic examples for portability.

---

## Common domain-specific RF Patterns

- **Enrollment RFs**: Capture → Quality Check → Liveness → Template Generation → Secure Storage
- **Verification RFs**: Capture → Quality Check → Liveness → Template Match → Decision
- **Document RFs**: OCR → Field Extraction → Validation → Data Mapping
- **Integration RFs**: API calls, webhook notifications, audit logging (no PII)

## domain-specific RF Clusters

- **User Onboarding**: consent → document capture → face enrollment → verification test
- **Authentication Flow**: face capture → quality check → liveness → 1:1 match → access grant
- **Document Processing**: image capture → OCR → field extraction → validation → data mapping
- **Compliance & Security**: audit logging → data encryption → retention management → deletion

## domain-specific BDD Best Practices

- **Always specify quality thresholds**: liveness ≥0.95, similarity ≥0.82, image resolution ≥1080p
- **Concrete sensitive data**: template size (512 bytes), processing time (<2s), failure counts (3 max)
- **GDPR compliance**: Never log data templates, always specify encryption (AES-256)
- **Error recovery paths**: What user can do after liveness fail, low quality, no match
- **Security logging**: Event names without PII: ENROLLMENT_SUCCESS, VERIFICATION_FAIL

---

## Example 1: Facial Enrollment with Liveness

````markdown
# RF-BIO-001: Facial enrollment with liveness validation

| Field          | Value      |
| -------------- | ---------- |
| **ID**         | RF-BIO-001 |
| **Version**    | 1.0        |
| **Status**     | Draft      |
| **Priority**   | Must       |
| **Complexity** | High       |

## Description

**Actor(s)**: New user (primary), {{CLIENT_NAME}} SDK (secondary), Backend API (secondary)
**Preconditions**: User authenticated in the app, camera available, GDPR consent granted
**Functional Description**: The system MUST allow a user to capture their facial image, validate that
they are a real person (liveness ≥0.95), generate an encrypted biometric template and store it securely
for future verifications.

## Acceptance Criteria (BDD)

### CA-BIO-001-01: Successful enrollment

```gherkin
Scenario: Happy path — successful capture with good lighting
  Given the user "juan.perez@example.com" has no registered biometric template
    And the device camera is active and functional
    And ambient lighting is ≥300 lux
  When the user positions their face inside the guide oval for 3 seconds
    And the system runs authenticity detection
  Then the system detects a liveness score of 0.96 (≥0.95 threshold)
    And generates a unique 512-byte biometric template
    And stores the AES-256-GCM encrypted template in the database
    And shows message: "Facial registration completed successfully"
    And logs event: "ENROLLMENT_SUCCESS" without biometric data

Scenario: Error — authenticity detection fails due to a static image
  Given the user presents a photograph printed on paper
  When the system runs authenticity detection
  Then the system detects a liveness score of 0.23 (<0.95 threshold)
    And increments the failed-attempt counter (3 maximum)
    And shows message: "We could not verify that you are a real person. Try again with your live face."
    And logs event: "ENROLLMENT_LIVENESS_FAIL" with score but without image
    And the user can: retry or cancel the process
```
````

---

## Example 2: Document OCR with Field Validation

````markdown
# RF-DOC-005: OCR extraction of Spanish DNI with field validation

## Acceptance Criteria (BDD)

### CA-DOC-005-01: Successful DNI extraction

```gherkin
Scenario: Happy path — valid DNI with all fields
  Given the user has captured an image of the front of a Spanish DNI
    And the image has resolution ≥1080p and sharpness >80%
  When the system runs OCR on the image
  Then it extracts field "first_names": "JUAN CARLOS"
    And it extracts field "last_names": "GARCÍA LÓPEZ"
    And it extracts field "dni": "12345678Z"
    And it extracts field "date_of_birth": "15/03/1985"
    And it validates DNI checksum: 12345678Z → letter Z correct
    And shows message: "Document processed successfully"
    And stores the extracted data in the session temporarily (do not persist)

Scenario: Error — blurry or illegible image
  Given the user captures a DNI image with sharpness <60%
  When the system runs OCR
  Then it detects OCR confidence <80% on critical fields
    And shows message: "Image not clear. Capture again with better lighting"
    And suggests: "Hold the document steady and avoid glare"
    And the user can: retry the capture or cancel
```
````

---

## Example 3: 1:1 Facial Verification

````markdown
# RF-BIO-010: 1:1 facial verification against an existing template

## Acceptance Criteria (BDD)

### CA-BIO-010-01: Successful verification

```gherkin
Scenario: Happy path — successful match against an existing template
  Given the user "maria.gonzalez@corp.com" has a stored biometric template
    And the template was created <90 days ago (not expired)
  When the user captures a new facial image for verification
    And the system runs 1:1 matching against the stored template
  Then the system calculates a similarity score of 0.87 (≥0.82 threshold)
    And returns result: "MATCH_SUCCESS"
    And logs event: "VERIFICATION_SUCCESS" with user_id but without biometric data
    And grants access to the authenticated user
    And increments the successful-verification counter in metrics

Scenario: Error — no match against the existing template
  Given the user presents a face different from the stored template
  When the system runs 1:1 matching
  Then it calculates a similarity score of 0.45 (<0.82 threshold)
    And returns result: "MATCH_FAIL"
    And increments the failed-attempt counter (5 maximum)
    And logs event: "VERIFICATION_FAIL" with user_id and score
    And shows message: "Verification failed. Try again"
    And temporarily blocks access after 5 failed attempts
```
````

---

## Anti-Patterns in domain-specific RFs

| Anti-Pattern                           | Correct Approach                                             | Why                                      |
| -------------------------------------- | ------------------------------------------------------------ | ---------------------------------------- |
| "RF-001: Complete facial verification" | Split into: enrollment, liveness, matching, storage          | Too broad — needs decomposition          |
| "authenticity detection works well"    | "liveness score ≥0.95 (threshold)"                           | Vague — needs concrete threshold         |
| "stores facial image securely"         | "stores AES-256-GCM encrypted template"                      | Images ≠ templates; need encryption spec |
| "logs user verification"               | "logs VERIFICATION_SUCCESS with user_id (no sensitive data)" | GDPR violation — no PII in logs          |
| "face quality is good"                 | "image resolution ≥1080p, sharpness >80%"                    | Subjective — needs measurable criteria   |
| "handles verification errors"          | Separate RF for each error type                              | One RF per behavior rule                 |

## Changelog

| Version | Date       | Author                | Changes                                                  |
| ------- | ---------- | --------------------- | -------------------------------------------------------- |
| 1.0.0   | 2026-03-25 | TL: tier3-remediation | Extracted from SKILL.md during domain-agnostic migration |
