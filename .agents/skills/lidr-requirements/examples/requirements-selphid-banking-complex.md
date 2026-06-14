# Functional Requirements: SelphID Banking Onboarding

**Project**: BBVA Digital Onboarding
**Generated from**: unified PRD v1.0 (functional + technical/NFR scope)
**Date**: 2026-03-15
**Approved by**: Product Owner + QA Lead
**Traceability**: Epic BANK-123 → Features BANK-124, BANK-125, BANK-126

## RF-001: Identity Document Capture

**As** a customer who wants to open a bank account
**I want** to be able to photograph my DNI/NIE with my mobile
**So that** I can verify my identity without going to the branch

### Acceptance Criteria

**Scenario 1: Successful capture of DNI front**

```gherkin
Given the customer has started the onboarding process
  And has a valid Spanish DNI
  And is using a smartphone with a >5MP camera
When they select "Photograph the front of the DNI"
  And point the camera at the front of the document
  And the system automatically detects the document edges
Then it must show a preview with the document framed correctly
  And it must enable the "Capture" button
  And it must show visual guides for optimal alignment
```

**Scenario 2: Successful capture of DNI back**

```gherkin
Given the customer has successfully captured the front
When they select "Photograph the back of the DNI"
  And turn the document to show the back
Then it must follow the same automatic detection process
  And it must verify that both images belong to the same document
  And it must allow proceeding to the next step
```

**Scenario 3: Insufficient image quality**

```gherkin
Given the customer attempts to capture the document
When the image is blurry, too dark, or has glare
Then it must show the message "Image not clear. Try again"
  And it must offer specific tips:
    - "Find good lighting without glare"
    - "Keep the mobile steady"
    - "Make sure the document is fully visible"
  And it must allow retrying the capture
```

**Scenario 4: Document not recognized**

```gherkin
Given the customer presents an invalid document (foreign passport, driver's license)
When the system analyzes the captured image
Then it must show "This document is not valid. You need a Spanish DNI or NIE"
  And it must allow returning to the capture
  And it must offer contact with customer service if they have questions
```

### Quality Criteria

- **Performance**: Document detection in <2 seconds
- **Accuracy**: 95% correct detection under normal conditions
- **Usability**: Maximum 3 attempts for a successful capture
- **Accessibility**: Compatible with screen readers

---

## RF-002: Automatic Data Extraction (OCR)

**As** the banking onboarding system
**I want** to automatically extract the data from the photographed document
**So that** I avoid manual data entry and reduce errors

### Acceptance Criteria

**Scenario 1: Successful OCR of a standard DNI**

```gherkin
Given the customer has captured images of sufficient quality
  And the DNI is a standard Spanish format (post-2006)
When the system processes the images with OCR
Then it must correctly extract:
  - Full name
  - DNI number (8 digits + letter)
  - Date of birth (DD/MM/YYYY)
  - Date of issue
  - Date of validity
  And it must show the extracted data for confirmation
  And it must allow manual correction if it detects uncertainty
```

**Scenario 2: OCR of a NIE (Foreigner Identity Number)**

```gherkin
Given the customer presents a valid Spanish NIE
When the system processes the document
Then it must correctly extract:
  - Full name
  - NIE number (X/Y/Z + 7 digits + letter)
  - Nationality
  - Date of birth
  And it must validate the specific NIE format
  And it must verify that the document is not expired
```

**Scenario 3: Partially illegible data**

```gherkin
Given the document has some poorly legible areas
When OCR cannot extract a field with confidence >80%
Then it must mark the uncertain fields as "Verify manually"
  And it must allow the customer to enter the data manually
  And it must keep the fields that were extracted correctly
  And it must proceed only when all fields are complete
```

**Scenario 4: Detection of a fake or manipulated document**

```gherkin
Given the customer presents a potentially forged document
When the system analyzes security patterns and consistency
Then it must detect inconsistencies such as:
  - Incorrect typefaces
  - Missing security elements
  - Digital modifications
  And it must flag the transaction for manual review
  And it must allow continuing with additional verification
```

### Quality Criteria

- **Accuracy**: 98% for standard fields in valid documents
- **Performance**: OCR processing in <3 seconds
- **Robustness**: Works with slightly worn documents
- **Security**: Detection of >90% of obvious forgeries

---

## RF-003: Facial Verification with Liveness Detection

**As** a customer who has provided my document
**I want** the system to verify that I am really me
**So that** I can prove that the person opening the account is the document holder

### Acceptance Criteria

**Scenario 1: Simple selfie with passive liveness**

```gherkin
Given the customer has completed the document capture
When they access facial verification
  And take a selfie looking directly at the camera
Then the system must:
  - Detect a real human face (not a photo or screen)
  - Verify that the eyes are open and looking at the camera
  - Confirm that there are natural micro-facial movements
  And it must proceed to 1:1 matching with the document photo
```

**Scenario 2: Active liveness with challenges**

```gherkin
Given the system requires additional liveness verification
When it asks the customer to perform specific actions:
  - "Smile naturally"
  - "Blink slowly"
  - "Turn your head slightly to the right"
Then the customer must complete each action within the indicated time
  And the system must validate that the actions are natural
  And it must reject robotic or pre-recorded responses
```

**Scenario 3: Spoofing detection (photo or video)**

```gherkin
Given an attempt to deceive the system with a printed photo
When the customer presents the photo to the camera
Then the system must detect:
  - Lack of 3D depth
  - Absence of natural eye movements
  - Anomalous reflections or paper textures
  And it must reject the verification
  And it must request a retry with anti-spoofing instructions
```

**Scenario 4: Difficult lighting conditions**

```gherkin
Given the customer is in a low-light or backlit environment
When they attempt to perform facial verification
Then the system must:
  - Automatically detect suboptimal conditions
  - Provide real-time feedback ("Find better light")
  - Adjust confidence thresholds according to conditions
  And it must allow completing the verification if technically feasible
  Or it must suggest changing location for better lighting
```

### Quality Criteria

- **False Accept Rate (FAR)**: <0.01% (1 in 10,000)
- **False Reject Rate (FRR)**: <2% (98% of legitimate users pass)
- **Spoofing Detection**: >99% detection of photos/videos
- **Performance**: Verification in <5 seconds

---

## RF-004: 1:1 Matching Document vs Selfie

**As** the identity verification system
**I want** to compare the document photo with the customer's selfie
**So that** I confirm that both images correspond to the same person

### Acceptance Criteria

**Scenario 1: Successful match with high confidence**

```gherkin
Given the customer has provided a valid document and a selfie with liveness
When the system compares both images biometrically
  And extracts and compares the unique facial features
Then it must calculate a similarity score
  And if the score is >0.88 (high-confidence threshold)
Then it must mark the verification as "SUCCESSFUL"
  And it must allow continuing with the next onboarding step
```

**Scenario 2: Match with medium confidence (manual review)**

```gherkin
Given the biometric comparison gives a score between 0.70 and 0.87
When the result is in the uncertainty zone
Then it must mark the verification as "MANUAL REVIEW REQUIRED"
  And it must send the case to a specialized agent
  And it must inform the customer that there will be additional verification
  And it must provide an estimated response time (24-48h)
```

**Scenario 3: No match - different people**

```gherkin
Given the images clearly correspond to different people
When the matching score is <0.70
Then it must mark the verification as "FAILED"
  And it must allow the customer to repeat the whole process once
  And it must suggest verifying that they are using their own document
  And if the second attempt fails, it must escalate to human support
```

**Scenario 4: Factors affecting matching**

```gherkin
Given there are minor explainable differences between the images:
  - Natural aging (document from years ago)
  - Facial weight changes
  - Differences in lighting or angle
  - Use of glasses (if not worn in the document or vice versa)
When the system detects these variations
Then it must apply compensation algorithms
  And it must dynamically adjust the confidence thresholds
  And it must prioritize the most stable facial features
```

### Quality Criteria

- **Accuracy**: 99.5% for obvious cases (very similar or very different)
- **Consistency**: Same result for the same images
- **Bias Mitigation**: Equitable performance regardless of age, gender, ethnicity
- **Performance**: Matching in <2 seconds

---

## RF-005: GDPR Consent Management

**As** a natural person whose biometric data is going to be processed
**I want** to give my explicit and granular consent
**So that** I comply with GDPR Art. 9 and keep control over my data

### Acceptance Criteria

**Scenario 1: Clear presentation of consent**

```gherkin
Given the customer is about to start biometric verification
When they access the process for the first time
Then it must show a clear explanation that includes:
  - "We are going to process your facial image to verify your identity"
  - "This includes creating a 'digital fingerprint' of your face"
  - "The data will be automatically deleted in 30 days"
  - "You can withdraw your consent at any time"
  And it must present "I ACCEPT" and "I DO NOT ACCEPT" options clearly differentiated
  And it must not allow continuing without an explicit selection
```

**Scenario 2: Granular consent by processing type**

```gherkin
Given the customer decides to give their consent
When they review the specific options
Then they must be able to authorize separately:
  ☑ Processing of the document image (OCR)
  ☑ Processing of the facial image (biometrics)
  ☑ Temporary storage for verification (30 days)
  ☐ Personalized marketing based on verification (optional)
  And they must be able to proceed even if they reject optional elements
  And it must be recorded exactly what they authorized
```

**Scenario 3: Information about the user's rights**

```gherkin
Given the customer wants to understand their rights
When they access "More information about data processing"
Then it must show clear information about:
  - Right of access: "You can see what data we have"
  - Right of rectification: "You can correct incorrect data"
  - Right of erasure: "You can request to delete your data"
  - Right of portability: "You can take your data with you"
  And it must include contact channels to exercise these rights
```

**Scenario 4: Consent revocation**

```gherkin
Given the customer has previously given consent
When they decide to revoke it through the app/web or by phone
Then the system must:
  - Immediately stop any future biometric processing
  - Irreversibly delete all stored facial digital fingerprints
  - Keep only the minimum data to comply with legal obligations
  And it must confirm the revocation in writing
  And it must explain the implications (e.g.: need for in-person verification)
```

### Quality Criteria

- **Legal Compliance**: 100% conformance with GDPR Art. 9
- **User Experience**: Understandable for users without legal knowledge
- **Audit Trail**: Immutable record of all consents
- **Performance**: Effective revocation in <24 hours

---

## RF-006: Integration with Banking Systems

**As** a bank employee who needs to verify the customer's identity
**I want** the biometric verification results to be integrated automatically
**So that** I complete the onboarding process without additional manual steps

### Acceptance Criteria

**Scenario 1: Successful verification and automatic profile creation**

```gherkin
Given a customer has successfully completed biometric verification
  And all compliance checks have passed
When the system processes the final result
Then it must automatically:
  - Create the customer profile in Core Banking
  - Assign a unique IBAN
  - Configure basic products (checking account)
  - Generate a virtual debit card
  And it must send a welcome notification by email
  And it must allow the customer to access the app immediately
```

**Scenario 2: Integration with the anti-fraud system**

```gherkin
Given biometric verification is in progress
When the system detects any risk indicator:
  - Matching score in the gray zone (0.70-0.87)
  - Multiple failed attempts
  - Anomalous behavior patterns
Then it must automatically query the fraud system
  And it must send relevant data: IP location, device fingerprint, timing
  And it must receive an additional risk score
  And it must combine both scores for the final decision
```

**Scenario 3: Automatic escalation for manual review**

```gherkin
Given the case requires human review (ambiguous score, potential fraud)
When the system determines it cannot auto-approve
Then it must automatically create a ticket in the management system
  And it must include all relevant information:
    - Captured images (masked for privacy)
    - Detailed confidence scores
    - Session context
  And it must assign it to the available specialized agent
  And it must notify the customer of the estimated review time
```

**Scenario 4: Automatic reporting and compliance**

```gherkin
Given verifications have been completed during the day
When the time for the daily regulatory report arrives
Then the system must automatically generate:
  - Volume and success rate statistics
  - Escalated cases and resolution time
  - Indicators of possible fraud attempts
  - Service quality metrics
  And it must send these reports to Compliance and Risk Management
  And it must archive all documentation for future audits
```

### Quality Criteria

- **Integration Reliability**: 99.9% of successful calls to banking systems
- **Data Consistency**: 0 discrepancies between systems
- **Performance**: Complete integration in <30 seconds
- **Error Handling**: Automatic recovery from temporary errors

---

## Traceability Matrix

| RF ID  | Epic     | Feature  | User Story  | Test Cases       | Related NFR           |
| ------ | -------- | -------- | ----------- | ---------------- | --------------------- |
| RF-001 | BANK-123 | BANK-124 | BANK-124-01 | TC-001 to TC-005 | NFR-001 (Performance) |
| RF-002 | BANK-123 | BANK-124 | BANK-124-02 | TC-006 to TC-012 | NFR-002 (Accuracy)    |
| RF-003 | BANK-123 | BANK-125 | BANK-125-01 | TC-013 to TC-020 | NFR-003 (Security)    |
| RF-004 | BANK-123 | BANK-125 | BANK-125-02 | TC-021 to TC-028 | NFR-003 (Security)    |
| RF-005 | BANK-123 | BANK-126 | BANK-126-01 | TC-029 to TC-036 | NFR-004 (Compliance)  |
| RF-006 | BANK-123 | BANK-126 | BANK-126-02 | TC-037 to TC-044 | NFR-005 (Integration) |

## Completeness Criteria

### Definition of Ready for Development

- [ ] All acceptance criteria are defined in BDD format
- [ ] Associated NFRs are documented and measurable
- [ ] Dependencies on external systems are identified
- [ ] Error and recovery cases are specified
- [ ] GDPR compliance criteria are validated by Legal

### Definition of Done for Testing

- [ ] All BDD scenarios have automated test cases
- [ ] Performance testing meets the specified NFRs
- [ ] Security testing includes spoofing and common attack cases
- [ ] Integration testing validates all connected systems
- [ ] Compliance testing verifies GDPR conformance

---

**Next Steps**:

1. Technical-product cross review (review-cruzado skill)
2. Generation of detailed NFRs (lidr-requirements nfr mode)
3. Breakdown into implementable user stories (user-stories skill)
4. Epic planning into sub-epics (epic-breakdown skill)
