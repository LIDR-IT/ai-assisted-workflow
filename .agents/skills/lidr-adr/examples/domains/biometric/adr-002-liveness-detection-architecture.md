# ADR-002: Liveness Detection Architecture - Edge vs Cloud Processing

**Status**: Accepted
**Date**: 2024-03-15
**Decision Makers**: R&D Lead, Platform Lead, Mobile Lead
**Consulted**: Algorithm Team, DevOps Team, Product Manager
**Informed**: Customer Success, Sales Engineering

## Context and Problem Statement

{{CLIENT_NAME}}'s {{PRODUCT_NAME_1}} liveness detection currently processes all verification requests in the cloud, requiring full image upload. As we expand into markets with poor connectivity and stricter data residency requirements, we need to evaluate alternative architectures:

**Current Issues:**

- **Latency**: 3-5 seconds in regions with poor connectivity
- **Data Privacy**: Customer concerns about biometric data leaving device
- **Bandwidth**: High data usage in mobile-first markets
- **Compliance**: New regulations requiring on-device processing
- **Offline Capability**: Zero functionality without internet connection

**Core Decision**: Should liveness detection processing move to the edge (on-device), remain in cloud, or adopt a hybrid approach?

## Decision Drivers

### Technical Drivers

- **Performance**: Target <1 second for liveness determination
- **Accuracy**: Maintain current EER (Equal Error Rate) <0.5%
- **Device Constraints**: Support devices with 2GB RAM, mid-tier CPU
- **Model Size**: Mobile app size impact <50MB additional
- **Battery Life**: Minimal impact on device battery consumption

### Business Drivers

- **Market Access**: Enable deployment in data-sensitive regions
- **Competitive Advantage**: Sub-second liveness detection
- **Cost Optimization**: Reduce cloud computing costs
- **Customer Satisfaction**: Better UX in low-connectivity scenarios
- **Regulatory Compliance**: On-device processing for privacy

### Risk Factors

- **Security**: Model theft and reverse engineering
- **Algorithm Updates**: Deploying model updates to devices
- **Device Fragmentation**: Android/iOS performance variations
- **Quality Assurance**: Ensuring consistent results across devices

## Considered Options

### Option 1: Full Cloud Processing (Status Quo)

**Description**: All liveness detection processed on cloud infrastructure

```yaml
Architecture:
  - Mobile captures image/video
  - Upload to cloud for processing
  - ML inference on GPU clusters
  - Return liveness score + confidence

Pros: + Maximum algorithm accuracy
  + Easy model updates and A/B testing
  + Centralized logging and monitoring
  + No device resource constraints

Cons:
  - High latency (3-5s in poor network)
  - Privacy concerns with biometric upload
  - Requires internet connectivity
  - High bandwidth usage (2-5MB per verification)
  - Scaling costs with usage volume
```

### Option 2: Full Edge Processing

**Description**: Complete liveness detection on mobile device

```yaml
Architecture:
  - Lightweight ML model embedded in SDK
  - Real-time processing during capture
  - No network dependency for core function
  - Optional telemetry upload

Pros: + Sub-second processing (<500ms)
  + Complete data privacy
  + Offline functionality
  + No per-usage cloud costs
  + Better user experience

Cons:
  - Model size constraints (target <20MB)
  - Device performance variations
  - Difficult model updates
  - Limited telemetry for improvements
  - Security risk of model exposure
```

### Option 3: Hybrid Edge-First with Cloud Fallback

**Description**: Primary processing on device, cloud for complex cases

```yaml
Architecture:
  - Lightweight model handles 80% of cases on-device
  - Complex/ambiguous cases sent to cloud
  - Confidence thresholds determine routing
  - Gradual learning improves edge model

Pros: + Fast for common cases (80%+ <500ms)
  + High accuracy for edge cases
  + Reduced cloud costs
  + Privacy for most verifications
  + Graceful degradation

Cons:
  - Complex architecture to maintain
  - Edge case detection logic needed
  - Potential consistency issues
  - More complex testing scenarios
```

### Option 4: Adaptive Processing

**Description**: Dynamic selection based on device capability and network

```yaml
Architecture:
  - Device capability detection at runtime
  - Network quality assessment
  - Adaptive model selection (3 model sizes)
  - Intelligent cloud/edge routing

Pros: + Optimized for each device/scenario
  + Best possible performance everywhere
  + Future-proof architecture
  + Personalized user experience

Cons:
  - Highest complexity to implement
  - Multiple model variants to maintain
  - Complex device profiling logic
  - Difficult to test all combinations
```

## Decision Outcome

**Chosen Option**: Option 3 - Hybrid Edge-First with Cloud Fallback

### Rationale

After extensive prototyping and analysis, the hybrid approach provides the optimal balance:

1. **Performance**: 85% of verifications complete in <500ms on-device
2. **Accuracy**: Maintains cloud-level accuracy through intelligent fallback
3. **Privacy**: Most sensitive data never leaves the device
4. **Cost**: 70% reduction in cloud processing costs
5. **Market Access**: Enables deployment in privacy-conscious markets

### Technical Implementation

```yaml
Edge Model Characteristics:
  - Size: 15MB compressed model
  - Architecture: MobileNetV3 + custom liveness head
  - Inference Time: 200-400ms on mid-tier devices
  - Accuracy: 98.5% correlation with cloud model
  - Coverage: Handles 85% of standard use cases

Cloud Fallback Triggers:
  - Edge confidence < 0.7
  - Poor image quality detected
  - Unusual lighting conditions
  - Device performance < threshold
  - Suspected presentation attack

Routing Logic:
  def should_use_cloud(edge_result, device_metrics, image_quality):
      if edge_result.confidence < 0.7:
          return True
      if image_quality.blur_score > 0.8:
          return True
      if device_metrics.inference_time > 1000:  # ms
          return True
      if edge_result.presentation_attack_probability > 0.3:
          return True
      return False
```

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    Mobile Device                            │
├─────────────────────────────────────────────────────────────┤
│  Camera Capture                                             │
│       │                                                     │
│       ▼                                                     │
│  Image Quality Check ──────┐                                │
│       │                    │                                │
│       ▼                    ▼                                │
│  Edge Liveness Model   Low Quality?                         │
│       │                    │                                │
│       ▼                    │                                │
│  Confidence Check          │                                │
│       │                    │                                │
│  High Confidence?          │                                │
│       │                    │                                │
│       ▼                    ▼                                │
│  ┌─Return Result──────┐   Upload to Cloud                   │
│  │  (85% of cases)    │        │                           │
│  └────────────────────┘        ▼                           │
│                           Cloud Processing                   │
│                                │                            │
│                                ▼                            │
│                           Return Result                      │
│                          (15% of cases)                     │
└─────────────────────────────────────────────────────────────┘
```

## Implementation Strategy

### Phase 1: Edge Model Development (Q2 2024)

```yaml
Objectives:
  - Develop lightweight liveness model
  - Achieve <20MB model size
  - Validate accuracy on 10K+ test images
  - Optimize for mobile inference

Deliverables:
  - MobileNetV3-based liveness model
  - iOS/Android SDK integration
  - Performance benchmarking report
  - Security assessment of model protection

Success Criteria:
  - Model size < 20MB
  - Inference time < 500ms on mid-tier devices
  - Accuracy correlation > 98% with cloud model
  - False accept rate < 0.1%
```

### Phase 2: Hybrid Architecture (Q3 2024)

```yaml
Objectives:
  - Implement cloud fallback logic
  - Develop confidence scoring system
  - Build telemetry and monitoring
  - A/B testing framework

Deliverables:
  - Hybrid processing SDK
  - Cloud routing logic
  - Real-time monitoring dashboard
  - Customer opt-in preferences

Success Criteria:
  - 85%+ edge processing rate
  - 70%+ cloud cost reduction
  - <1% accuracy degradation
  - Customer satisfaction improvement
```

### Phase 3: Production Rollout (Q4 2024)

```yaml
Objectives:
  - Gradual customer migration
  - Performance optimization
  - Model update mechanism
  - Global deployment

Deliverables:
  - Production-ready hybrid SDK
  - Over-the-air model updates
  - Customer migration tools
  - Global performance monitoring

Success Criteria:
  - 100% customer migration option
  - <0.1% edge model failures
  - Sub-second experience for 90%+ users
  - Regulatory compliance validation
```

## Consequences

### Positive Consequences

**Immediate (0-6 months)**

- Faster time-to-market in privacy-conscious regions
- Competitive differentiation with sub-second liveness
- Reduced cloud infrastructure scaling pressure

**Medium Term (6-18 months)**

- 70% reduction in cloud processing costs at scale
- Improved customer satisfaction scores (target: +15%)
- New market opportunities in offline-first scenarios

**Long Term (18+ months)**

- Technology foundation for next-generation biometrics
- Reduced dependency on cloud infrastructure
- Competitive moat through superior mobile performance

### Negative Consequences

**Technical Debt**

- Complex architecture requiring specialized expertise
- Multiple model variants to maintain and update
- Increased testing surface area across device types

**Operational Complexity**

- Model deployment pipeline for edge updates
- Monitoring and debugging hybrid flows
- Customer support for device-specific issues

**Security Considerations**

- Model protection against reverse engineering
- Secure update mechanism for edge models
- Audit trail for edge vs cloud processing decisions

## Risk Mitigation Strategies

### Model Security

```yaml
Protection Measures:
  - Model obfuscation and encryption
  - Runtime integrity verification
  - Anti-tampering detection
  - Secure enclave utilization (where available)

Monitoring:
  - Anomalous model behavior detection
  - Version integrity validation
  - Suspicious device pattern analysis
  - Regular security assessments
```

### Performance Risks

```yaml
Mitigation:
  - Extensive device testing matrix
  - Performance regression testing
  - Automatic fallback mechanisms
  - Real-time performance monitoring

Rollback Plan:
  - Instant disable of edge processing
  - Graceful fallback to cloud-only mode
  - Customer notification system
  - Emergency model updates
```

### Accuracy Risks

```yaml
Quality Assurance:
  - Continuous A/B testing against cloud
  - Real-world accuracy monitoring
  - Customer feedback integration
  - Regular model retraining

Validation:
  - ISO 30107 compliance testing
  - Cross-device accuracy validation
  - Attack resistance verification
  - Independent security audits
```

## Success Metrics

### Technical KPIs

- **Processing Time P95**: <500ms for edge cases, <2s for cloud fallback
- **Edge Processing Rate**: 85%+ of verifications handled on-device
- **Accuracy Correlation**: >98% consistency between edge and cloud
- **Model Size**: <20MB for edge model
- **Battery Impact**: <5% additional battery usage

### Business KPIs

- **Cost Reduction**: 70% decrease in cloud processing costs
- **Customer Satisfaction**: +15% improvement in UX surveys
- **Market Penetration**: 3x growth in privacy-conscious regions
- **Support Tickets**: 50% reduction in performance-related issues

### Security KPIs

- **Model Extraction Attempts**: <0.001% successful reverse engineering
- **Security Incidents**: Zero breaches related to edge processing
- **Compliance Audits**: 100% pass rate for privacy regulations

## Related Decisions and Dependencies

### Related ADRs

- ADR-001: [biometric Template Format](./adr-001-biometric-template-format.md)
- ADR-003: [Mobile SDK Security Architecture](./adr-003-mobile-sdk-security.md)
- ADR-004: [Model Update Infrastructure](./adr-004-model-update-infrastructure.md)

### Dependencies

- Mobile SDK architecture decisions
- Cloud infrastructure capacity planning
- Model compression research outcomes
- Regulatory approval in target markets

## Review and Evolution

### Next Review: 2024-09-15

### Evolution Triggers

- New mobile hardware capabilities
- Regulatory changes in key markets
- Competitive landscape shifts
- Customer feedback patterns

### Success/Failure Criteria

**Success**: 85%+ edge processing, 70%+ cost reduction, maintained accuracy
**Failure**: <70% edge processing, accuracy degradation >2%, security incidents

---

**Decision Record Owner**: R&D Lead - María González
**Technical Approval**: CTO - Roberto Silva
**Business Approval**: VP Product - Laura Fernández
**Security Approval**: CISO - David López
