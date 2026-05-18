# BDD Anti-Pattern Corrections

## Common BDD Anti-Patterns and How to Fix Them

### Anti-Pattern 1: Implementation Details in Steps

#### ❌ Wrong: Exposing Technical Implementation

```gherkin
Scenario: User authentication via REST API
  Given the database table "users" contains record with ID 12345
    And the JWT token is stored in localStorage
    And the API endpoint "/auth/login" is available
  When a POST request is sent with username "john@example.com"
    And the password is hashed using bcrypt algorithm
    And the Content-Type header is set to "application/json"
  Then the server returns HTTP status 200
    And the response JSON contains property "access_token"
    And the token expiry is set to 3600 seconds
    And the user session is stored in Redis cache
```

**Problems:**

- Exposes database schema and implementation
- Specifies technical protocols and data formats
- Focuses on how system works, not what it achieves
- Tightly couples test to implementation choices

#### ✅ Correct: Business Behavior Focus

```gherkin
Scenario: User successfully logs into the system
  Given the user has a valid registered account
    And the user provides correct login credentials
  When the user attempts to log in
  Then the user is authenticated successfully
    And the user gains access to their personal dashboard
    And the user session remains active for the duration of their visit
```

**Improvements:**

- Focuses on business value and user outcomes
- Independent of implementation technology choices
- Readable by non-technical stakeholders
- Resilient to technical changes

### Anti-Pattern 2: UI-Specific Steps

#### ❌ Wrong: Coupling to User Interface Elements

```gherkin
Scenario: Biometric verification through mobile app
  Given the user is on the "Identity Verification" screen
    And the "Start Camera" button is visible
    And the camera permission modal is dismissed
  When the user taps the blue "Capture Document" button
    And the camera viewfinder shows the document outline
    And the user aligns the document within the green rectangular guide
    And the user taps the circular capture button at bottom center
  Then the "Processing..." spinner appears for 2-3 seconds
    And the screen transitions to "Document Analysis Results"
    And a green checkmark icon appears next to "Document Verified"
```

**Problems:**

- Tightly coupled to specific UI design and layout
- Brittle when UI changes (colors, positions, labels)
- Not reusable across different platforms (web, mobile, API)
- Focuses on interface mechanics rather than functionality

#### ✅ Correct: Platform-Agnostic Behavior

```gherkin
Scenario: User successfully verifies identity document
  Given the user needs to verify their identity
    And the user has a valid government-issued ID
    And the device camera is available and functioning
  When the user captures their identity document
    And the system processes the document image
  Then the document authenticity is verified
    And the document information is extracted accurately
    And the user receives confirmation of successful verification
    And the user can proceed to the next verification step
```

**Improvements:**

- Describes functionality independent of interface
- Works across web, mobile, and API implementations
- Focuses on user goals and system capabilities
- Remains valid even with UI redesigns

### Anti-Pattern 3: Vague or Non-Measurable Outcomes

#### ❌ Wrong: Subjective or Unmeasurable Results

```gherkin
Scenario: Biometric matching works well
  Given the user submits a selfie
  When the system compares it to their ID photo
  Then the match is good enough
    And the user is happy with the result
    And the system performs adequately
    And the verification is satisfactory
```

**Problems:**

- "Good enough" and "satisfactory" are subjective
- No clear pass/fail criteria for testing
- "User is happy" is not directly testable
- "Performs adequately" provides no measurable standard

#### ✅ Correct: Specific, Measurable Outcomes

```gherkin
Scenario: Facial biometric verification meets accuracy requirements
  Given the user submits a live selfie
    And the system has a reference facial template from ID document
  When the system performs facial comparison
  Then the biometric match score exceeds 90% confidence
    And the verification result is returned within 3 seconds
    And the false acceptance rate remains below 0.01%
    And the user receives clear confirmation of identity match
```

**Improvements:**

- Specific thresholds (90% confidence, 3 seconds, 0.01%)
- Objectively measurable outcomes
- Clear pass/fail criteria for automated testing
- Focuses on observable system behavior

### Anti-Pattern 4: Testing Multiple Behaviors in One Scenario

#### ❌ Wrong: Complex, Multi-Purpose Scenarios

```gherkin
Scenario: Complete user onboarding with document verification, facial matching, voice enrollment, and account setup
  Given a new user wants to create an account
  When they enter personal information in the registration form
    And they upload a government ID document
    And the system verifies document authenticity
    And they capture a live selfie for facial verification
    And the system confirms facial match with ID photo
    And they record voice samples for voice biometric enrollment
    And the system creates their voice template
    And they set up account security preferences
    And they accept terms and conditions
  Then their account is created successfully
    And they receive email confirmation
    And they can log in to their dashboard
    And all biometric templates are stored securely
    And their risk profile is assessed and assigned
```

**Problems:**

- Tests multiple features simultaneously
- Difficult to isolate failures
- Changes in one area break tests for other areas
- Hard to maintain and debug

#### ✅ Correct: Focused, Single-Purpose Scenarios

```gherkin
Feature: Document Verification

Scenario: Valid government ID document is verified successfully
  Given the user has a valid, undamaged government ID
    And the document contains readable text and security features
  When the user captures the document image
  Then the system extracts personal information accurately
    And the document authenticity is confirmed
    And the verification is completed within 5 seconds

Feature: Facial Verification

Scenario: Live selfie matches ID document photo
  Given the user has completed document verification
    And facial reference template is available from ID photo
  When the user captures a live selfie with liveness detection
  Then the facial match score exceeds 90% threshold
    And liveness detection confirms physical presence
    And identity verification is completed successfully

Feature: Voice Biometric Enrollment

Scenario: User successfully enrolls voice biometric template
  Given the user has completed identity verification
    And the user consents to voice biometric enrollment
  When the user records required voice samples
  Then voice template is created with sufficient confidence
    And template is stored securely with encryption
    And voice enrollment is completed successfully
```

**Improvements:**

- Each scenario tests one specific feature
- Failures are easily isolated and debugged
- Scenarios can be run independently
- Easier to maintain and update

### Anti-Pattern 5: Generic, Non-Domain-Specific Language

#### ❌ Wrong: Generic System Language

```gherkin
Scenario: System processes user input successfully
  Given the user provides required data
  When the system analyzes the information
  Then the system returns a positive result
    And the user can continue to the next step
```

**Problems:**

- Too generic to provide meaningful specification
- Doesn't reflect domain expertise or requirements
- Provides no guidance for implementation
- Not useful for stakeholder communication

#### ✅ Correct: Domain-Specific, Meaningful Language

```gherkin
Scenario: Biometric template matching achieves regulatory compliance threshold
  Given the user's live facial capture contains sufficient biometric features
    And the reference template from identity document meets quality standards
  When the biometric matching algorithm compares facial geometries
  Then the match score exceeds 90% as required by financial regulation
    And the false acceptance rate remains below 0.01%
    And the matching process completes within regulatory time limits
    And audit trail is created for compliance verification
```

**Improvements:**

- Uses domain-specific terminology (biometric templates, facial geometries)
- References regulatory requirements and compliance needs
- Provides specific business context
- Meaningful to domain experts and stakeholders

### Anti-Pattern 6: Imperative Instead of Declarative Steps

#### ❌ Wrong: Imperative, Step-by-Step Instructions

```gherkin
Scenario: User takes a selfie for verification
  Given the user opens the verification app
  When they tap on "Verify Identity" button
    And they tap on "Continue" on the instruction screen
    And they tap "Allow" when camera permission is requested
    And they position their face in the oval guide
    And they wait for the countdown timer to reach zero
    And they hold still during the 3-second capture
    And they tap "Use This Photo" on the review screen
  Then the photo is uploaded to the server
```

**Problems:**

- Describes specific user interface workflow
- Focuses on "how" rather than "what"
- Brittle when UI flow changes
- Too much procedural detail

#### ✅ Correct: Declarative, Outcome-Focused

```gherkin
Scenario: User successfully completes facial verification
  Given the user needs to verify their identity using facial recognition
    And the device camera is available and functional
  When the user captures a live facial image
  Then the system obtains a high-quality facial biometric sample
    And the facial image meets liveness detection requirements
    And the user's identity verification can proceed
```

**Improvements:**

- Focuses on what needs to be achieved
- Independent of specific user interface flow
- Describes business outcomes, not procedural steps
- Resilient to implementation changes

### Anti-Pattern 7: Missing Error Handling and Edge Cases

#### ❌ Wrong: Only Happy Path Scenarios

```gherkin
Feature: Document Verification

Scenario: Document verification succeeds
  Given the user has a valid ID document
  When they capture the document
  Then the verification is successful
```

**Problems:**

- Only covers successful case
- Ignores error conditions and edge cases
- Provides incomplete specification
- Real-world systems need error handling

#### ✅ Correct: Comprehensive Scenario Coverage

```gherkin
Feature: Document Verification

Scenario: Valid document is verified successfully
  Given the user has a valid, unexpired government ID
    And the document is undamaged and clearly readable
  When the user captures the document image
  Then the document authenticity is confirmed
    And personal information is extracted accurately
    And verification is completed successfully

Scenario: Expired document is rejected appropriately
  Given the user has a government ID that expired 6 months ago
  When the user captures the expired document
  Then the system detects the expiration date
    And the verification is rejected with clear error message
    And the user is guided to provide a valid, current document

Scenario: Poor quality image triggers recapture guidance
  Given the user captures a document image that is blurry or poorly lit
  When the system analyzes the image quality
  Then the system detects insufficient quality for processing
    And the system provides specific guidance for improvement
    And the system requests the user to recapture the document

Scenario: Potentially fraudulent document is flagged for review
  Given the user submits a document with suspicious characteristics
  When the fraud detection system analyzes the document
  Then potential fraud indicators are identified
    And the verification is flagged for manual review
    And appropriate security measures are activated
```

**Improvements:**

- Covers success, error, and edge case scenarios
- Provides complete specification for all outcomes
- Guides implementation of proper error handling
- Reflects real-world system requirements

### Anti-Pattern 8: Non-Independent Scenarios

#### ❌ Wrong: Scenarios That Depend on Each Other

```gherkin
Scenario: User registers for biometric verification
  Given a new user visits the registration page
  When they complete registration with email "test@example.com"
  Then their account is created with user ID 12345

Scenario: User uploads identity document
  Given user ID 12345 exists in the system
  When they upload their driver's license
  Then the document is stored with verification status "pending"

Scenario: User completes facial verification
  Given user ID 12345 has uploaded a document
    And the document verification status is "pending"
  When they capture a live selfie
  Then facial matching is performed against the uploaded document
```

**Problems:**

- Scenarios must run in specific order
- Failure of one scenario breaks subsequent scenarios
- Hard to run individual scenarios for debugging
- Creates fragile test suite

#### ✅ Correct: Independent, Self-Contained Scenarios

```gherkin
Scenario: New user successfully completes registration
  Given a prospective user wants to create an account
  When they provide required registration information
  Then their account is created successfully
    And they receive account confirmation
    And they can begin identity verification process

Scenario: User successfully uploads valid identity document
  Given the user has a registered account
    And the user has a valid government-issued photo ID
  When they upload their identity document
  Then the document is accepted for processing
    And the document verification begins automatically
    And the user receives confirmation of successful upload

Scenario: User successfully completes facial verification
  Given the user has uploaded a valid identity document
    And facial reference template is available from document
  When the user captures a live facial image
  Then facial verification is performed successfully
    And the biometric match score exceeds required threshold
    And the user's identity verification is completed
```

**Improvements:**

- Each scenario is completely independent
- Can be run in any order or isolation
- Failures are contained to specific scenarios
- More maintainable and reliable test suite
