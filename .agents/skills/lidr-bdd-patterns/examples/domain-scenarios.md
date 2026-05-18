# Domain-Specific BDD Scenarios

## Biometric Identity Verification Scenarios

### Facial Recognition System

```gherkin
Feature: Advanced Facial Recognition with Anti-Spoofing

Background:
  Given the facial recognition system is configured for high security
    And anti-spoofing detection is enabled
    And the system maintains 99.5% accuracy in production

Scenario: Legitimate user verification in optimal conditions
  Given a registered user needs to authenticate
    And the user is in well-lit environment (>500 lux)
    And the user looks directly at the camera
  When the user presents their face for recognition
  Then facial landmarks are detected within 200ms
    And biometric template is extracted with high confidence (>95%)
    And template comparison achieves match score above 92%
    And liveness detection confirms physical presence
    And authentication is completed successfully within 2 seconds

Scenario: Detection of photo-based presentation attack
  Given an attacker attempts to use a high-resolution printed photo
    And the photo shows the legitimate user's face clearly
  When the photo is presented to the facial recognition camera
  Then the system detects lack of three-dimensional facial features
    And liveness detection identifies absence of micro-movements
    And infrared analysis reveals paper material characteristics
    And the presentation attack is rejected immediately
    And security event is logged with attack details

Scenario: Handling of identical twins or close family resemblance
  Given two users with high facial similarity (identical twins)
    And both users are enrolled in the system
  When one twin attempts to authenticate as the other
  Then the system performs detailed facial geometry analysis
    And minute distinguishing features are examined
    And confidence score reflects uncertainty due to similarity
    And additional authentication factors are requested
    And final decision maintains security standards

Scenario: Graceful degradation with partial facial occlusion
  Given a legitimate user is wearing a medical mask covering nose and mouth
    And only eyes and forehead area are visible
  When the user attempts facial authentication
  Then the system analyzes available facial features in visible region
    And confidence scoring accounts for reduced feature set
    And match threshold is dynamically adjusted for occlusion
    And additional verification may be requested if confidence is insufficient
    And user receives guidance about optimal positioning
```

### Voice Biometric Authentication

```gherkin
Feature: Voice Biometric Authentication for Financial Transactions

Background:
  Given the voice biometric system supports multiple languages
    And the system compensates for natural voice variations
    And anti-spoofing detects synthetic and recorded voice attacks

Scenario: Multi-language voice authentication
  Given a user has enrolled voice biometric in Spanish
    And the user later needs to authenticate in English
  When the user speaks the required passphrase in English
  Then the system analyzes language-independent voice characteristics
    And vocal tract features are extracted regardless of language
    And voice template matching accounts for language differences
    And authentication succeeds if core vocal characteristics match
    And confidence score reflects cross-language analysis

Scenario: Voice authentication during illness
  Given a user has enrolled voice biometric when healthy
    And the user has a cold affecting their voice
  When the user attempts voice authentication while ill
  Then the system detects voice variations due to illness
    And core vocal characteristics are analyzed for underlying patterns
    And temporary voice changes are distinguished from identity mismatch
    And authentication adapts to accommodate illness-related variations
    And user may be offered alternative authentication if voice too altered

Scenario: Detection of deep fake voice attack
  Given an attacker uses AI-generated voice mimicking legitimate user
    And the synthetic voice quality is very high
  When the synthetic voice is used for authentication attempt
  Then the system analyzes temporal voice patterns and naturalness
    And acoustic analysis detects artificial generation artifacts
    And speaking pattern analysis identifies non-human characteristics
    And the deep fake attack is detected and rejected
    And incident is escalated to security team for investigation
```

### Document Verification (SelphID)

```gherkin
Feature: Government Document Verification with Global Support

Background:
  Given the system supports 150+ document types from 50+ countries
    And optical character recognition achieves 99.8% accuracy
    And document authenticity validation uses multiple security features

Scenario: US Driver's License verification with security features
  Given a user presents a valid US driver's license
    And the document contains standard security features (hologram, RFID, barcode)
  When the document is captured and analyzed
  Then OCR extracts personal information with >99% accuracy
    And hologram authenticity is verified using angle-specific imaging
    And barcode data is decoded and cross-validated with OCR text
    And document template matching confirms state-specific design elements
    And extracted data includes name, address, date of birth, and restrictions

Scenario: European passport with NFC chip verification
  Given a user presents an EU e-passport with NFC capability
    And the mobile device supports NFC communication
  When the passport NFC chip is read
  Then chip authentication confirms document has not been cloned
    And digital signature validates issuing authority authenticity
    And biometric data is extracted from chip securely
    And chip data is cross-validated with OCR results from passport image
    And facial biometric template is obtained for comparison

Scenario: Detection of sophisticated document forgery
  Given an attacker presents a high-quality forged identity document
    And the forgery includes replicated security features
  When the document undergoes comprehensive authenticity analysis
  Then multiple security features are analyzed simultaneously
    And micro-text clarity is examined under magnification
    And security ink response to different light spectrums is tested
    And document material properties are validated
    And inconsistencies in security features trigger forgery detection
    And document is flagged for manual expert review
```

## Financial Services Integration Scenarios

### Banking Onboarding with KYC Compliance

```gherkin
Feature: Digital Banking Onboarding with Regulatory Compliance

Background:
  Given the bank operates under multiple regulatory jurisdictions
    And KYC/AML compliance is mandatory for all new accounts
    And customer due diligence must be completed before account activation

Scenario: Standard customer onboarding with biometric KYC
  Given a prospective customer wants to open a personal bank account
    And the customer provides consent for biometric data processing
    And the customer has valid government-issued identification
  When the customer completes digital onboarding process
  Then identity document authenticity is verified using multiple security checks
    And facial biometric confirms customer is legitimate document holder
    And customer information is validated against government databases
    And sanction list screening is performed and cleared
    And risk assessment categorizes customer as standard risk
    And account is approved and activated within 24 hours

Scenario: Enhanced due diligence for high-risk customer
  Given a customer triggers enhanced due diligence requirements
    And the customer is classified as politically exposed person (PEP)
    And additional verification measures are mandatory
  When the customer undergoes enhanced onboarding
  Then standard biometric verification is supplemented with additional checks
    And source of funds documentation is collected and verified
    And additional identity verification through secondary sources
    And enhanced monitoring protocols are automatically applied
    And senior management approval is required for account opening
    And all enhanced due diligence evidence is documented for audit

Scenario: Cross-border customer with multiple jurisdictions
  Given a customer is citizen of one country but resident in another
    And the customer provides foreign identity documents
    And international compliance requirements apply
  When the customer completes onboarding
  Then identity documents are verified using international standards
    And cross-border identity validation is performed
    And tax compliance requirements for multiple jurisdictions are addressed
    And appropriate reporting obligations are identified and implemented
    And account features are configured for international compliance
```

### Credit Card Application with Fraud Prevention

```gherkin
Feature: Credit Card Application with Biometric Fraud Prevention

Scenario: Legitimate customer applies for credit card
  Given a customer with good credit history applies for a credit card
    And the customer has no fraud indicators in their profile
  When the customer completes biometric identity verification
  Then facial recognition confirms identity matches application data
    And voice verification adds additional authentication layer
    And identity verification score exceeds approval threshold
    And credit assessment proceeds based on verified identity
    And card approval decision is made with confidence in customer identity

Scenario: Detection of identity theft in credit application
  Given an identity thief attempts to apply for credit using stolen information
    And the thief has access to victim's personal and financial information
  When the thief attempts biometric verification during application
  Then facial recognition fails to match legitimate account holder
    And voice verification does not match enrolled voice patterns
    And behavioral patterns differ from legitimate account holder
    And fraud detection systems flag application as suspicious
    And application is rejected and fraud investigation is initiated
```

## Healthcare Identity Management Scenarios

### Patient Identity Verification with HIPAA Compliance

```gherkin
Feature: Healthcare Patient Identity Management

Background:
  Given patient identity verification must comply with HIPAA
    And patient privacy and data protection are paramount
    And accurate patient identification is critical for safety

Scenario: Patient identification at point of care
  Given a patient arrives for medical treatment at healthcare facility
    And the patient has biometric identity enrolled in healthcare system
  When the patient uses biometric identification at check-in
  Then facial or palm print biometric confirms patient identity
    And patient medical record is accessed securely
    And healthcare provider confirms they are treating correct patient
    And all biometric access is logged for HIPAA audit trail
    And patient privacy is maintained throughout identification process

Scenario: Emergency patient identification when unconscious
  Given an unconscious patient arrives at emergency department
    And traditional identification methods are not possible
    And immediate medical treatment is required
  When emergency staff attempts biometric identification
  Then facial recognition attempts to match against enrolled patients
    And partial identity information guides emergency treatment decisions
    And family notification procedures begin based on identified patient
    And medical history access enables appropriate emergency care
    And identity confirmation is verified when patient regains consciousness

Scenario: Preventing medical identity fraud
  Given an individual attempts to use someone else's health insurance
    And the fraudster has access to victim's insurance information
  When biometric verification is required for healthcare service
  Then facial recognition fails to match legitimate insurance holder
    And healthcare provider is alerted to potential fraud
    And medical services are suspended pending identity verification
    And insurance fraud investigation procedures are initiated
    And legitimate patient is notified of attempted fraud
```

## Government and Citizen Services Scenarios

### Digital Identity for Government Services

```gherkin
Feature: Citizen Digital Identity for Government Services

Background:
  Given citizens require secure digital identity for government services
    And identity assurance must meet government security standards
    And services must be accessible to all eligible citizens

Scenario: Citizen enrollment for digital government identity
  Given a citizen wants to access government services digitally
    And the citizen provides required identity proofing documentation
  When the citizen completes biometric enrollment process
  Then identity documents are verified against government databases
    And facial biometric enrollment captures high-quality template
    And identity proofing meets required assurance level
    And digital identity credential is issued with appropriate certification
    And citizen can access government services using biometric authentication

Scenario: Secure access to sensitive government services
  Given a citizen needs to access high-security government services
    And the service requires high assurance level authentication
  When the citizen authenticates using biometric identity
  Then multi-factor biometric authentication is performed
    And facial recognition confirms citizen identity
    And additional biometric factor (voice or fingerprint) is verified
    And access is granted to sensitive government information
    And all access is logged for government audit requirements

Scenario: Identity verification for voting or civic participation
  Given a citizen wants to participate in digital voting or civic processes
    And voter identity verification is required by law
  When the citizen authenticates for civic participation
  Then biometric verification confirms eligible voter identity
    And citizenship and voting eligibility are validated
    And voter registration status is confirmed
    And access to voting system or civic platform is granted
    And voting privacy and ballot secrecy are maintained
```

## Insurance and Risk Assessment Scenarios

### Insurance Claim Processing with Identity Verification

```gherkin
Feature: Insurance Claim Processing with Biometric Verification

Scenario: Legitimate policyholder files insurance claim
  Given a policyholder needs to file a claim for covered incident
    And the policyholder's identity must be verified for claim processing
  When the policyholder initiates claim through digital channels
  Then biometric verification confirms policyholder identity
    And claim details are associated with verified policyholder
    And fraud risk assessment is performed based on verified identity
    And claim processing proceeds with confidence in claimant identity
    And claim adjuster has verified identity information for investigation

Scenario: Detection of fraudulent insurance claim
  Given an individual attempts to file false claim using stolen policy information
    And the fraudster has access to policyholder's personal information
  When biometric verification is required for claim filing
  Then facial recognition fails to match legitimate policyholder
    And insurance fraud detection systems flag suspicious claim
    And claim is referred to special investigation unit
    And legitimate policyholder is notified of fraudulent claim attempt
    And law enforcement may be contacted depending on fraud severity
```

## Retail and E-commerce Scenarios

### Age Verification for Restricted Products

```gherkin
Feature: Age Verification for Alcohol and Tobacco Sales

Scenario: Customer purchases age-restricted product online
  Given a customer wants to purchase alcohol through e-commerce platform
    And age verification is required by law for alcohol sales
  When the customer attempts to complete purchase
  Then facial age estimation confirms customer appears over 21
    And identity document verification confirms legal age
    And facial recognition matches customer to identity document
    And age verification is completed successfully
    And alcohol purchase is approved and processed

Scenario: Prevention of underage purchase attempt
  Given an underage individual attempts to purchase tobacco products
    And the individual uses false or borrowed identification
  When biometric age verification is performed
  Then facial age estimation indicates customer appears underage
    And facial recognition fails to match provided identification
    And sale is rejected due to failed age verification
    And incident is logged for compliance reporting
    And customer is informed about age verification requirements
```
