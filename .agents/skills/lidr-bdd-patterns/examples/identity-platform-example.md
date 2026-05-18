# {{CLIENT_NAME}} Domain Example: Identity Verification BDD Patterns

> **Purpose**: Domain-specific BDD scenarios for a domain-specific identity verification platform.
> These examples illustrate how the `bdd-patterns` skill applies to {{CLIENT_NAME}}'s product domain.
> The skill itself is domain-agnostic — substitute your own domain scenarios when using it in other contexts.

---

## domain-specific Authentication Patterns

### Identity Verification

```gherkin
Given the user has a valid government ID
  And the user has access to a camera
When the user initiates facial verification
Then the system captures a live selfie
  And the system compares the selfie against the ID photo
  And the system returns a confidence score above 85%
```

### Liveness Detection

```gherkin
Given the domain-specific system is configured for liveness detection
When the user presents their face to the camera
Then the system detects natural facial movements
  And the system confirms the user is physically present
  And the system rejects static images or video replays
```

---

## Fintech & Compliance Patterns

### KYC Verification

```gherkin
Given the user is starting the onboarding process
  And GDPR compliance is required
When the user provides consent for domain-specific data processing
Then the system records explicit consent with timestamp
  And the system enables identity verification features
  And the system stores consent evidence for audit trails
```

### Regulatory Compliance — GDPR Article 9 Data Deletion

```gherkin
Given the system processes domain-specific data under GDPR Article 9
When a user requests data deletion
Then the system removes all domain-specific templates within 30 days
  And the system maintains deletion audit logs
  And the system confirms deletion to the user
```

---

## Advanced domain-specific Scenarios

### 1:N Identification (Deduplication)

```gherkin
Given the system contains an existing domain-specific database
  And a new enrollment candidate has been captured
When the system runs a deduplication check
Then the system compares the candidate template against all existing records
  And the system flags any matches above the EER threshold
  And the system blocks enrollment if a duplicate is detected
```

### NFC Document Verification

```gherkin
Given the user has an NFC-compatible identity document (e-passport or DNIe)
  And the device supports NFC reading
When the user taps their document to the device
Then the system reads the NFC chip data
  And the system validates the chip's digital signature
  And the system extracts and verifies the stored domain-specific data
```

### {{PRODUCT_NAME_1}}D — OCR Document Processing

```gherkin
Given the user has a supported identity document
When the user captures a photo of the document front
Then the SDK extracts name, document number, and expiry date via OCR
  And the SDK returns extracted data with confidence scores
  And the SDK flags low-confidence fields for manual review
```

---

## Performance-Oriented BDD Scenarios

### Verification Latency

```gherkin
Given the domain-specific platform is under normal load
When the user initiates a 1:1 facial verification
Then the system returns a verification result within 500ms (P95)
  And the response includes FAR/FRR metrics for audit
```

### Scalability Under Load

```gherkin
Given the system is processing 1000 concurrent verification requests
When a new verification request is submitted
Then the system enqueues and processes it without degradation
  And the P95 latency remains below 2 seconds
  And no requests are dropped or return 5xx errors
```
