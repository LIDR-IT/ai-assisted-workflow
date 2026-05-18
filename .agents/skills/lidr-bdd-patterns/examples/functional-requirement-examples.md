# Functional Requirement Examples with BDD

## Complete Functional Requirements with BDD Acceptance Criteria

### FR-001: Document Verification with OCR

**Requirement Statement:**
As a user completing identity verification, I want to upload a government ID document so that the system can verify my identity automatically using document authentication.

**Business Value:** Streamlines onboarding process, reduces manual verification costs, improves user experience.

**Acceptance Criteria:**

```gherkin
Scenario: Successfully verify authentic government ID
  Given the user has a valid, undamaged government-issued photo ID
    And the document contains machine-readable text and security features
    And the camera environment has adequate lighting (>300 lux)
  When the user captures the document using the mobile camera
  Then the system extracts personal information using OCR with 95%+ accuracy
    And the system validates document security features (holograms, watermarks)
    And the system confirms document has not expired
    And the system returns verification result within 5 seconds
    And the extracted data includes full name, date of birth, and document number

Scenario: Handle poor quality document image
  Given the user captures a document image with insufficient quality
    And the image is blurry, poorly lit, or partially obscured
  When the system processes the image
  Then the system detects poor image quality
    And the system provides specific guidance to improve capture quality
    And the system requests the user to recapture the document
    And the system allows up to 3 retry attempts
    And the system guides the user through optimal positioning

Scenario: Detect potentially fraudulent document
  Given the fraud detection system is active
    And the user submits a document with suspicious characteristics
  When the system analyzes the document for authenticity
  Then the system detects potential fraud indicators
    And the system flags document manipulation or alteration
    And the system assigns fraud risk score above threshold (>0.7)
    And the verification is rejected with appropriate messaging
    And the incident is logged for security review
```

### FR-002: Facial Recognition with Liveness Detection

**Requirement Statement:**
As a user who has verified their document, I want to take a live selfie that matches my document photo so that the system can confirm I am the legitimate document holder.

**Business Value:** Prevents identity fraud, ensures person presenting document is legitimate holder, meets regulatory requirements.

**Acceptance Criteria:**

```gherkin
Scenario: Successful facial verification with liveness
  Given the user has completed document verification
    And a facial biometric template exists from document photo
    And the user has access to a front-facing camera with adequate resolution (2MP+)
  When the user captures a live selfie
  Then the system performs real-time liveness detection
    And the system detects natural facial movements and micro-expressions
    And the system extracts facial biometric features from the live image
    And the system compares live features against document template
    And the biometric match score exceeds 90% similarity threshold
    And the verification completes within 3 seconds

Scenario: Detect presentation attack with photo
  Given an attacker attempts to use a printed photo of the legitimate user
    And the liveness detection system is configured for photo attack prevention
  When the photo is presented to the camera
  Then the system detects lack of three-dimensional facial features
    And the system identifies absence of natural micro-movements
    And the system recognizes flat, static image characteristics
    And the system rejects the attempt as presentation attack
    And the system requires live facial interaction for progression

Scenario: Handle poor lighting conditions
  Given the user attempts facial capture in insufficient lighting
    And the environment lighting is below 100 lux
  When the system analyzes the captured image
  Then the system detects poor lighting conditions
    And the system provides real-time lighting guidance
    And the system adjusts camera settings automatically when possible
    And the system requests user to move to better lighting
    And the system maintains security standards despite lighting challenges
```

### FR-003: Voice Biometric Authentication

**Requirement Statement:**
As a user performing sensitive transactions, I want to authenticate using my voice biometric so that I can securely access services with convenient hands-free verification.

**Business Value:** Enhances security for high-value transactions, provides convenient authentication method, supports accessibility requirements.

**Acceptance Criteria:**

```gherkin
Scenario: Successful voice authentication for enrolled user
  Given the user has an enrolled voice biometric template
    And the user is performing a transaction requiring voice authentication
    And the environment has acceptable noise levels (<60dB background)
  When the user speaks the required passphrase
  Then the system analyzes voice characteristics (pitch, tone, cadence)
    And the system extracts voice biometric features
    And the system compares features against enrolled template
    And the voice match score exceeds 85% similarity threshold
    And the system accounts for natural voice variations (illness, aging)
    And the authentication completes within 4 seconds

Scenario: Detect voice replay attack
  Given an attacker attempts to use a recorded voice sample
    And the voice anti-spoofing system is enabled
  When the recorded audio is played to the microphone
  Then the system detects artificial audio characteristics
    And the system identifies lack of natural speech variability
    And the system recognizes compressed audio artifacts
    And the system rejects authentication as potential spoofing
    And the system requests fresh voice sample with random challenge

Scenario: Handle voice enrollment for new user
  Given a new user wants to enroll their voice biometric
    And the user has completed identity verification
  When the user records required voice samples (minimum 3 samples)
  Then the system guides user through clear pronunciation instructions
    And the system analyzes voice sample quality and completeness
    And the system extracts stable voice characteristics
    And the system creates voice template with sufficient enrollment confidence
    And the system stores template securely with encryption
    And the enrollment process completes within 2 minutes
```

## BDD Anti-Pattern Corrections

### Before: Implementation-Focused (❌)

```gherkin
Scenario: API call returns success
  Given the database contains user ID 12345
  When the POST request is sent to /api/verify endpoint
  Then the response status is 200
    And the JSON contains "status": "success"
```

### After: Business-Focused (✅)

```gherkin
Scenario: User identity verification succeeds
  Given the user exists in the system
  When the user completes identity verification
  Then the verification is successful
    And the user gains access to protected services
```

### Before: UI-Specific Steps (❌)

```gherkin
Scenario: User clicks verification button
  Given the user is on the verification page
  When the user clicks the "Start Verification" button
  Then the camera modal opens
    And the "Capture Photo" button appears
```

### After: Behavior-Focused (✅)

```gherkin
Scenario: User initiates identity verification
  Given the user needs to verify their identity
  When the user starts the verification process
  Then the camera interface is presented
    And the user can capture their document
```

### Before: Technical Details Exposed (❌)

```gherkin
Scenario: Biometric template comparison
  Given the system has facial feature vector [0.234, 0.567, 0.891]
  When comparing against stored template using cosine similarity
  Then the similarity score is calculated as 0.923
    And the threshold of 0.9 is exceeded
```

### After: Business Logic Focus (✅)

```gherkin
Scenario: Facial recognition confirms identity match
  Given the user's facial features have been captured
    And the system has a reference facial template from identity document
  When the system compares the live capture against the reference
  Then the facial match confidence exceeds security threshold
    And the user's identity is confirmed
```

## Domain-Specific Pattern Applications

### Banking/Fintech Context

```gherkin
Feature: Customer Onboarding with Regulatory Compliance

Scenario: Complete KYC verification with biometric evidence
  Given a prospective customer wants to open a bank account
    And regulatory KYC requirements apply
    And the customer consents to biometric data processing under GDPR
  When the customer completes digital onboarding
  Then identity document authenticity is verified
    And facial biometric match confirms document holder identity
    And customer identity is checked against sanction lists
    And biometric evidence is stored for audit trail
    And customer onboarding is approved for account opening
```

### Healthcare Identity Management

```gherkin
Feature: Patient Identity Management with HIPAA Compliance

Scenario: Secure patient identification at point of care
  Given a patient arrives for medical treatment
    And the healthcare system requires positive patient identification
    And HIPAA privacy protections apply to patient data
  When the patient uses biometric identification
  Then patient identity is confirmed with high confidence (>99%)
    And access to patient medical records is granted
    And biometric access is logged for HIPAA audit trail
    And patient privacy is protected throughout identification process
```

### Government Identity Services

```gherkin
Feature: Citizen Digital Identity with eIDAS Compliance

Scenario: Issue digital identity credential with substantial assurance
  Given a citizen applies for digital identity credential
    And eIDAS substantial level of assurance is required
  When the citizen completes identity proofing process
  Then government-issued document authenticity is verified
    And facial biometric confirms document holder presence
    And identity meets eIDAS substantial assurance requirements
    And digital identity credential is issued with appropriate certification
```

## Integration Examples with Requirements Skills

### Example: generate-rf Integration

When `generate-rf` creates functional requirements, it uses these BDD patterns:

**Input:** PRD Functional requirement for facial verification
**Process:** Apply biometric BDD patterns from this skill
**Output:** Structured functional requirement with complete acceptance criteria

```gherkin
# Generated by generate-rf using bdd-patterns

RF-015: Facial Verification with Liveness Detection

Scenario: Verify user identity through live facial capture
  Given the user has submitted valid identity documentation
    And facial reference template is available from document
  When the user captures live facial image
  Then liveness detection confirms physical presence
    And facial match score exceeds 90% threshold
    And identity verification is completed successfully
```

### Example: validate-requirements Integration

When `validate-requirements` checks functional requirements, it uses these validation rules:

**Validation Checklist from bdd-patterns:**

- [ ] Given-When-Then structure complete
- [ ] Steps use business language, not technical implementation
- [ ] Outcomes are observable and measurable
- [ ] Domain compliance considerations included
- [ ] Anti-patterns avoided (no UI coupling, no API details)

**Validation Report:**

```
RF-015 Analysis:
✅ Complete Given-When-Then structure
✅ Business-focused language
✅ Measurable outcomes (90% threshold)
⚠️  Consider adding error handling scenario
✅ Follows biometric domain patterns
```
