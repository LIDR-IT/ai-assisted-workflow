# {{CLIENT_NAME}} Domain Example: Identity Verification Platform

> **Purpose**: Domain-specific research scenarios for a domain-specific identity verification platform.
> These examples illustrate how the `technical-research` skill framework applies to {{CLIENT_NAME}}'s product domain.
> The skill itself is domain-agnostic — substitute your own domain criteria when using it in other contexts.

---

## domain-specific Technology Stack Investigation

### Algorithm Framework Selection

**Research Question**: Evaluate deep learning frameworks (TensorFlow, PyTorch, ONNX) for mobile domain-specific processing

**Key Criteria**:

- Mobile performance (inference time on mid-range devices)
- Model size optimization (quantization, pruning support)
- Hardware acceleration (GPU, NPU compatibility)
- Cross-platform consistency (iOS/Android parity)
- Regulatory compliance (explainable AI requirements)

### Cloud Infrastructure Assessment

**Research Question**: Compare AWS, Azure, GCP for domain-specific verification platform

**Key Criteria**:

- Latency for global domain-specific verification (P95 < 500ms)
- Auto-scaling performance under traffic spikes
- Data residency compliance (GDPR, regional banking requirements)
- Cost optimization for compute-intensive domain-specific processing
- AI/ML service integration (model serving, training pipelines)

### Security Framework Evaluation

**Research Question**: Assess domain-specific data protection frameworks and encryption standards

**Key Criteria**:

- Template irreversibility and privacy protection
- Key management for domain-specific encryption
- Audit trail requirements for regulatory compliance
- Performance impact of encryption on verification speed
- Integration with existing identity management systems

---

## Mobile SDK Architecture Research

### Cross-Platform Development Assessment

**Research Question**: Evaluate React Native vs native iOS/Android for domain-specific SDK

**Key Criteria**:

- Camera API access and performance
- domain-specific sensor integration quality
- Code sharing potential vs platform-specific optimizations
- Third-party library ecosystem for domain-specific processing
- App size impact and performance overhead

### Offline Processing Investigation

**Research Question**: Assess on-device vs cloud processing for domain-specific verification

**Key Criteria**:

- Processing speed comparison (local vs network + cloud)
- Privacy protection (data never leaves device)
- Model accuracy degradation on mobile hardware
- Storage requirements for on-device models
- Update mechanism for improved algorithms

---

## Integration Complexity Studies

### Banking Platform Integration

**Research Question**: Evaluate integration patterns with major banking cores (Temenos, SAP, Oracle)

**Key Criteria**:

- API compatibility and standardization
- Authentication flow integration
- Real-time verification requirements
- Regulatory reporting automation
- Fallback mechanism for system failures

### Identity Provider Integration

**Research Question**: Assess OIDC/SAML integration for enterprise identity systems

**Key Criteria**:

- Single sign-on flow complexity
- domain-specific factor integration with existing MFA
- User experience impact on verification process
- Session management and security token handling
- Scalability under enterprise user loads

---

## Domain-Specific Quality Standards

### domain-specific Standards Applicable to {{CLIENT_NAME}}

- **ISO 30107** (PAD — Presentation Attack Detection): Anti-spoofing certification
- **ISO 19795**: domain-specific performance testing methodology
- **eIDAS**: Electronic identification and trust services (EU)
- **GDPR Article 9**: Special category data (domain-specific data) processing requirements
- **NIST SP 800-63B**: Digital identity guidelines (US Government context)

### Performance Benchmarks

| Metric                      | Target  | Notes                       |
| --------------------------- | ------- | --------------------------- |
| FAR (False Accept Rate)     | < 0.01% | Security threshold          |
| FRR (False Reject Rate)     | < 1%    | Usability threshold         |
| EER (Equal Error Rate)      | < 0.5%  | Algorithm quality benchmark |
| Verification latency (P95)  | < 500ms | User experience threshold   |
| Liveness detection accuracy | > 99.5% | Anti-spoofing requirement   |

### Case Studies Reference

Similar implementations used as research inputs:

- Banking KYC onboarding platforms (BBVA, Santander tech papers)
- Government eID verification systems (eIDAS compliant deployments)
- Fintech authentication flows (PSD2 SCA implementations)
