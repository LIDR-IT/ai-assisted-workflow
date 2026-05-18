# Regulatory Compliance BDD Scenarios

## GDPR (General Data Protection Regulation)

### Article 9: Special Category Data (Biometric Data)

**Lawful Basis and Explicit Consent:**

```gherkin
Scenario: Establish lawful basis for biometric data processing
  Given the system processes facial biometric templates
    And GDPR Article 9 classifies biometrics as special category data
    And explicit consent is required as lawful basis
  When the user begins identity verification process
  Then the system presents clear, plain language consent form
    And the consent form specifies exact biometric data to be processed
    And the consent form explains processing purposes and legal basis
    And the consent form indicates data retention period
    And the system requires active opt-in (no pre-ticked boxes)
    And the consent can be withdrawn at any time
    And the system records consent with timestamp and version
```

**Data Protection Impact Assessment (DPIA):**

```gherkin
Scenario: Conduct DPIA for high-risk biometric processing
  Given the system processes biometric data on a large scale
    And systematic monitoring of public areas is involved
    And processing likely results in high risk to individuals
  When implementing new biometric verification features
  Then a DPIA must be conducted before processing begins
    And the DPIA assesses necessity and proportionality
    And the DPIA identifies and mitigates privacy risks
    And data protection authority is consulted if high residual risk remains
    And DPIA conclusions are documented and regularly reviewed
```

**Right of Access (Article 15):**

```gherkin
Scenario: User exercises right of access to biometric data
  Given the user has provided biometric data for verification
    And the user requests information about their personal data
  When the user submits a valid access request
  Then the system confirms user identity before disclosing information
    And the system provides confirmation that biometric processing occurs
    And the system explains purposes of biometric processing
    And the system indicates retention period for biometric templates
    And the system lists recipients or categories of recipients
    And the system informs about automated decision-making if applicable
    And the response is provided within one month
```

**Right to Erasure (Article 17):**

```gherkin
Scenario: User exercises right to erasure of biometric data
  Given the user's biometric data is stored in the system
    And the user withdraws consent for processing
    And no other lawful basis for processing exists
  When the user requests deletion of their biometric data
  Then the system verifies user identity and request validity
    And the system deletes all biometric templates within 30 days
    And the system removes associated verification history
    And the system informs third parties if data was disclosed
    And the system provides confirmation of deletion
    And the system maintains deletion log for compliance audit
```

### Data Protection by Design and Default (Article 25)

**Privacy by Design Implementation:**

```gherkin
Scenario: Implement privacy by design in biometric system
  Given biometric verification system is being developed
    And privacy protection must be embedded from design phase
  When designing system architecture and processes
  Then biometric templates use irreversible transformation
    And raw biometric images are deleted after template extraction
    And minimal biometric data is collected for stated purpose
    And biometric matching occurs locally when technically feasible
    And access to biometric data is restricted to authorized personnel
    And encryption protects biometric data in transit and at rest
```

## PSD2 (Payment Services Directive 2)

### Strong Customer Authentication (SCA)

**Multi-Factor Authentication Requirements:**

```gherkin
Scenario: Implement PSD2-compliant strong customer authentication
  Given the customer initiates an electronic payment above €30
    And PSD2 SCA requirements apply to the transaction
  When the customer authorizes the payment
  Then the system requires knowledge factor (PIN, password, or passphrase)
    And the system requires possession factor (mobile device, card, or token)
    And the system requires inherence factor (biometric verification)
    And at least two factors must be from different categories
    And authentication elements must be independent
    And compromise of one element does not compromise others
    And authentication occurs within the payment session
```

**Dynamic Linking for Payment Authorization:**

```gherkin
Scenario: Implement dynamic linking for payment transactions
  Given the customer authorizes a payment transaction
    And PSD2 requires dynamic linking of authentication
  When biometric authentication is performed
  Then the authentication code is linked to payment amount
    And the authentication code is linked to beneficiary account
    And the customer can verify transaction details during authentication
    And any change to payment details invalidates authentication
    And the authentication cannot be reused for different transaction
```

**Exemptions Handling:**

```gherkin
Scenario: Apply low-risk transaction exemption
  Given transaction analysis indicates low fraud risk
    And transaction amount is below €500
    And customer's spending patterns are consistent with history
  When customer initiates payment
  Then SCA exemption may be applied based on risk analysis
    But the system maintains ability to require SCA if needed
    And exemption usage is monitored and reported to authorities
    And customer can still choose to use SCA voluntarily
```

## eIDAS (Electronic Identification and Trust Services)

### Identity Assurance Levels

**Level of Assurance: Substantial:**

```gherkin
Scenario: Achieve eIDAS substantial level of assurance
  Given the identity verification must meet substantial assurance level
    And eIDAS technical specifications apply
  When user completes identity verification process
  Then identity evidence includes valid government-issued document
    And document authenticity is verified through security features
    And facial biometric comparison achieves 95%+ match confidence
    And liveness detection confirms physical presence
    And identity proofing process is documented and auditable
    And electronic identity has appropriate cryptographic protection
```

**Cross-Border Recognition:**

```gherkin
Scenario: Enable cross-border identity recognition within EU
  Given an identity was verified in one EU member state
    And the identity meets eIDAS substantial assurance level
  When the user accesses services in another EU member state
  Then the identity is automatically recognized and accepted
    And no additional identity verification is required
    And service providers can rely on the identity assurance level
    And identity attributes are transmitted securely
```

### Qualified Electronic Signatures

**Biometric-Enhanced Digital Signatures:**

```gherkin
Scenario: Create qualified electronic signature with biometric component
  Given the user needs to create a legally binding digital signature
    And the signature must meet eIDAS qualified signature requirements
  When the user signs a document electronically
  Then qualified certificate authenticates the signatory
    And biometric verification confirms signatory's identity at time of signing
    And signature creation data is under sole control of signatory
    And signature is linked to signed data uniquely
    And any subsequent change to signed data is detectable
    And signature has legal equivalence to handwritten signature
```

## ISO/IEC 30107-3 (Presentation Attack Detection)

### PAD Testing and Certification

**Presentation Attack Detection Testing:**

```gherkin
Scenario: Conduct PAD testing according to ISO 30107-3
  Given the biometric system includes presentation attack detection
    And system requires ISO 30107-3 compliance certification
  When PAD testing is performed
  Then testing includes all relevant attack instrument species
    And testing covers 2D and 3D face spoofing attacks
    And testing includes various materials (photo, video, mask, model)
    And testing environment reflects deployment conditions
    And Attack Presentation Classification Error Rate (APCER) is measured
    And Bona Fide Presentation Classification Error Rate (BPCER) is measured
    And system achieves required PAD performance metrics
```

**PAD Performance Requirements:**

```gherkin
Scenario: Meet PAD performance requirements
  Given the biometric system operates in unsupervised environment
    And high security level is required
  When presentation attacks are attempted
  Then APCER (missed attack rate) is below 5% for all attack types
    And BPCER (false alarm rate) is below 10% for genuine attempts
    And system maintains these rates across demographic groups
    And performance is consistent across various lighting conditions
    And system detects attacks within maximum allowed time
```

## NIST SP 800-63B (Digital Identity Guidelines)

### Authenticator Assurance Levels

**AAL2 (Authenticator Assurance Level 2):**

```gherkin
Scenario: Implement AAL2 requirements for biometric authenticator
  Given the system provides AAL2 biometric authentication
    And NIST SP 800-63B guidelines apply
  When user authenticates using biometric factor
  Then biometric system achieves required accuracy metrics
    And False Match Rate (FMR) is 1 in 10,000 or better
    And False Non-Match Rate (FNMR) is 1 in 100 or better
    And biometric sensor has presentation attack detection
    And biometric template is protected against offline attacks
    And authentication requires cryptographic proof of possession
```

**AAL3 (Authenticator Assurance Level 3):**

```gherkin
Scenario: Implement AAL3 requirements for high-security biometric authentication
  Given highest level of authentication assurance is required
    And system must meet AAL3 requirements
  When user authenticates for high-value transactions
  Then multi-factor authentication includes cryptographic token
    And biometric factor supplements cryptographic authentication
    And cryptographic keys are protected by hardware security module
    And authentication process is resistant to man-in-the-middle attacks
    And all authentication attempts are logged and monitored
    And system detects and prevents real-time attacks
```

## AML (Anti-Money Laundering) and KYC (Know Your Customer)

### Customer Due Diligence

**Enhanced Due Diligence with Biometrics:**

```gherkin
Scenario: Perform enhanced due diligence for high-risk customer
  Given a customer presents elevated money laundering risk
    And enhanced due diligence requirements apply
  When conducting customer onboarding
  Then standard identity verification is supplemented with additional checks
    And biometric verification provides non-repudiation evidence
    And customer's identity is verified against sanction lists
    And customer's identity is checked against PEP (Politically Exposed Persons) databases
    And source of funds documentation is collected and verified
    And enhanced monitoring is established for ongoing transactions
    And all EDD evidence is retained for regulatory examination
```

**Ongoing Monitoring and Re-verification:**

```gherkin
Scenario: Conduct periodic customer re-verification
  Given customer relationship has been established for 3 years
    And regulatory requirements mandate periodic re-verification
    And customer's risk profile may have changed
  When periodic review trigger occurs
  Then customer's current identity is re-verified using biometrics
    And customer's transaction patterns are analyzed for unusual activity
    And customer's risk assessment is updated based on current information
    And any changes in customer status are documented
    And re-verification results are stored for compliance audit
```

## CCPA (California Consumer Privacy Act) and CPRA

### Consumer Rights for Biometric Information

**Right to Know About Biometric Data Collection:**

```gherkin
Scenario: Provide transparency about biometric data practices
  Given the business collects biometric identifiers from California residents
    And CCPA/CPRA disclosure requirements apply
  When consumer requests information about data practices
  Then privacy notice clearly identifies biometric data collection
    And notice explains specific biometric identifiers collected
    And notice describes purposes for biometric data processing
    And notice lists categories of third parties receiving biometric data
    And notice specifies retention period for biometric information
    And notice explains consumer rights under CCPA/CPRA
```

**Right to Delete Biometric Information:**

```gherkin
Scenario: Honor consumer request to delete biometric data
  Given California consumer requests deletion of their biometric information
    And no exemption applies (legal obligation, legitimate interest)
  When deletion request is verified as valid
  Then business deletes biometric identifiers from all systems
    And business deletes biometric information from backup systems
    And business instructs service providers to delete biometric data
    And business provides confirmation of deletion to consumer
    And business maintains record of deletion request for compliance
```

## Sector-Specific Compliance

### Healthcare (HIPAA) with Biometric Patient Identification

**Minimum Necessary Standard:**

```gherkin
Scenario: Apply minimum necessary standard to biometric patient data
  Given healthcare provider uses biometric identification for patients
    And HIPAA minimum necessary standard applies
  When accessing patient biometric information
  Then access is limited to minimum necessary for treatment purpose
    And only authorized healthcare personnel can access biometric data
    And access controls prevent unnecessary disclosure
    And audit logs track all access to biometric patient information
    And biometric data is not used for purposes beyond patient identification
```

### Financial Services (SOX) with Biometric Access Controls

**Internal Controls and Biometric Authentication:**

```gherkin
Scenario: Implement SOX-compliant internal controls using biometrics
  Given financial reporting system requires SOX compliance
    And biometric authentication controls access to financial data
  When personnel access financial reporting systems
  Then biometric authentication ensures non-repudiation of access
    And access controls prevent unauthorized modification of financial data
    And audit trail includes biometric verification for all financial transactions
    And segregation of duties is enforced through biometric identity verification
    And management can demonstrate effectiveness of biometric controls
```
