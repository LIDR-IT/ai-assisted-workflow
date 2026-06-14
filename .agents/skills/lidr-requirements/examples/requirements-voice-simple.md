# Functional Requirements: Voice Verification Call Center

**Project**: Telefónica Voice Authentication
**Generated from**: unified PRD v1.0 (functional scope)
**Date**: 2026-03-15
**Complexity**: Simple (5 core RFs)

## RF-001: Voice Enrollment by Phone

**As** a customer calling the call center for the first time
**I want** to register my voice simply and securely
**So that** I avoid answering personal questions on future calls

### Acceptance Criteria

**Scenario 1: Successful enrollment**

```gherkin
Given I am a new customer for voice verification
  And I call 1004 customer service
When the IVR detects that I have no voice profile
  And it offers to "set up voice verification"
  And I accept by saying "YES"
Then it must explain the process in simple language
  And it must ask me to say "My voice is my password for Telefónica"
  And it must repeat 3 times to create a robust profile
  And it must confirm "You now have voice verification set up"
```

**Scenario 2: Customer declines enrollment**

```gherkin
Given the IVR offers to set up voice verification
When I respond "NO" or do not respond at all
Then it must continue with traditional verification
  And it must allow setting up voice verification in the future
  And it must not insist again during this call
```

**Scenario 3: Problem during enrollment**

```gherkin
Given I am in the enrollment process
When there is background noise or a poor-quality line
Then it must automatically detect the poor quality
  And it must suggest "Can you call from a quieter place?"
  And it must allow retrying or continuing without voice verification
```

---

## RF-002: Voice Verification for Registered Customers

**As** a customer who already has voice verification set up
**I want** to authenticate by saying my phrase
**So that** I can access the service quickly without questions

### Acceptance Criteria

**Scenario 1: Successful verification**

```gherkin
Given I am a customer with voice verification set up
  And I call from my registered number
When the IVR asks me to "Say your voice phrase"
  And I say "My voice is my password for Telefónica"
Then it must verify my identity in less than 10 seconds
  And it must respond "Verified. Connecting you with an agent"
  And it must connect me directly without further questions
```

**Scenario 2: Failed verification**

```gherkin
Given I try to verify with my voice
When the system cannot confirm my identity (different voice due to a cold)
Then it must say "We could not verify you by voice"
  And it must automatically continue with traditional verification
  And it must ask the usual security questions
```

**Scenario 3: Multiple failed attempts**

```gherkin
Given I fail voice verification 2 times in a row
When I try a third time
Then it must temporarily block voice verification
  And it must switch to traditional verification
  And it must suggest re-enrollment after the call
```

---

## RF-003: Consent and Privacy

**As** a privacy-conscious customer
**I want** to understand and control how my voice is used
**So that** I can give informed consent

### Acceptance Criteria

**Scenario 1: Clear explanation before enrollment**

```gherkin
Given the IVR offers to set up voice verification
When I accept to learn more information
Then it must clearly explain:
  - "Your voice becomes a unique digital fingerprint"
  - "It is stored securely in Spain"
  - "It is automatically deleted if you do not call within 2 years"
  - "You can disable it whenever you want"
  And it must ask "Do you authorize this use of your voice?"
```

**Scenario 2: Consent revocation**

```gherkin
Given I have voice verification active
When I call and ask to speak with an agent
  And I request "I want to disable voice verification"
Then the agent must:
  - Verify my identity by traditional methods
  - Immediately delete my voice profile
  - Confirm "Your voice profile has been deleted"
  And on future calls it must use traditional verification
```

---

## RF-004: Fallback to Traditional Verification

**As** the call center system
**I want** to always have a verification alternative
**So that** no customer is left without service

### Acceptance Criteria

**Scenario 1: Automatic fallback**

```gherkin
Given voice verification is unavailable due to:
  - System technical failure
  - Insufficient line quality
  - Customer with no voice profile
When the IVR detects this situation
Then it must automatically switch to verification questions:
  - "Tell me your date of birth"
  - "What was the amount of your last bill?"
  - "What is your mailing address?"
```

**Scenario 2: Manual escalation**

```gherkin
Given a customer cannot verify by voice or by questions
When the agent detects it
Then they must be able to perform additional manual verification:
  - Questions about service history
  - SMS verification to the registered mobile
  - Document verification if necessary
```

---

## RF-005: Integration with Existing System

**As** a customer service agent
**I want** to see the verification result on my screen
**So that** I immediately know whether the customer is verified

### Acceptance Criteria

**Scenario 1: Clear information for the agent**

```gherkin
Given a customer is verifying by voice
When the call reaches my workstation
Then my screen must show:
  - Status: "VERIFIED BY VOICE" in green
  - Confidence: Matching score (e.g.: 92%)
  - Method: "Voice Verification"
  - Timestamp: Exact time of the verification
  And I must be able to proceed directly to assist the customer
```

**Scenario 2: Manual verification pending**

```gherkin
Given a customer requires additional verification
When the call reaches me
Then my screen must show:
  - Status: "MANUAL VERIFICATION REQUIRED" in yellow
  - Reason: "Voice verification inconclusive"
  - Actions: List of suggested verification questions
  And I must complete the verification before providing service
```

**Scenario 3: Unverified customer**

```gherkin
Given a customer has not passed any verification
When I receive the call
Then my screen must show:
  - Status: "NOT VERIFIED" in red
  - Instruction: "Complete identity verification"
  - Blocker: I cannot access the customer's sensitive data
```

---

## Global Quality Criteria

### Performance

- **Enrollment**: <60 seconds for the complete process
- **Verification**: <10 seconds from phrase to result
- **Fallback**: <5 seconds to switch to the traditional method

### Accuracy

- **False Accept Rate**: <0.01% (very hard for an impostor to pass)
- **False Reject Rate**: <5% (95% of legitimate users pass)
- **System Availability**: >99.9% (less than 9 hours down/year)

### User Experience

- **Adoption Rate**: >70% of eligible customers complete enrollment
- **Satisfaction**: >80% prefer voice over traditional questions
- **Support Impact**: <10 calls/month about voice verification problems

---

**Traceability**:

- Epic: VOICE-100
- Features: VOICE-101 (Enrollment), VOICE-102 (Verification), VOICE-103 (Privacy)
- NFRs: Pending generation with the lidr-requirements skill (nfr mode)
