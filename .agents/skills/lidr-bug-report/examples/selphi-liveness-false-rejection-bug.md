# Bug Report: Selphi Liveness False Rejection for Users with Glasses

**Bug ID**: BUG-2024-03-001
**Reporter**: Ana Martinez (QA Engineer)
**Assignee**: Carlos Vega (Algorithm Engineer)
**Created**: 2024-03-15 14:32 CET
**Priority**: High
**Severity**: Major

---

## Executive Summary

Selphi liveness detection algorithm v2.8.3 demonstrates significant false rejection rates (>12%) for users wearing glasses, particularly those with reflective or thick-framed eyewear. This affects approximately 35% of our user base and has led to 247 customer support tickets in the past week.

### Impact Assessment

- **Users Affected**: ~35% of user base (glass wearers)
- **False Rejection Rate**: 12.3% (target: <2.5%)
- **Business Impact**: $47K estimated revenue impact from failed verifications
- **Customer Satisfaction**: NPS dropped 1.2 points in affected segment

---

## Bug Classification

```yaml
Category: Algorithm Accuracy Issue
Type: False Negative (Genuine User Rejected)
Component: Selphi Liveness Detection Engine
Version: v2.8.3 (released 2024-03-01)
Environment: Production + Staging
Reproducibility: Consistent (87% reproduction rate)
```

---

## Detailed Description

### Problem Statement

The Selphi liveness detection algorithm incorrectly classifies genuine users wearing glasses as potential presentation attacks, resulting in verification failures. The issue manifests particularly with:

1. **Reflective glasses**: Sunglasses, anti-glare coated lenses
2. **Thick frames**: Heavy-rimmed glasses that partially occlude facial features
3. **Progressive lenses**: Multi-focal lenses with varying optical properties
4. **Safety glasses**: Industrial or sports eyewear with wraparound designs

### Root Cause Hypothesis

The algorithm's texture analysis module appears to interpret lens reflections and frame shadows as indicators of photo/screen presentation attacks, leading to incorrect liveness rejection.

---

## Reproduction Steps

### Environment Setup

```yaml
Device: iPhone 14 Pro (iOS 17.3.1)
SDK Version: Selphi iOS SDK v2.8.3
Network: WiFi 100 Mbps
Lighting: Office fluorescent (500 lux, measured)
Camera Settings: Default auto-exposure
```

### Step-by-Step Reproduction

#### Scenario 1: Anti-glare Coated Glasses

```
Prerequisites:
- User wearing anti-glare coated prescription glasses
- Standard office lighting (fluorescent, 400-600 lux)
- Front-facing camera in portrait orientation

Steps:
1. Launch Selphi verification flow
2. Position user's face within the capture frame
3. Ensure glasses are clearly visible and reflecting light
4. Follow standard liveness capture instructions
5. Wait for algorithm processing

Expected Result:
- Liveness verification should succeed (confidence >0.7)
- User should be verified as genuine

Actual Result:
- Liveness verification fails (confidence 0.23)
- Error message: "Liveness verification failed - please try again"
- User experiences verification failure

Reproduction Rate: 87% (26 out of 30 attempts)
```

#### Scenario 2: Heavy-Framed Glasses

```
Prerequisites:
- User wearing thick, dark-framed glasses
- Glasses partially occlude eyebrow area
- Standard indoor lighting

Steps:
1. Initiate Selphi liveness verification
2. Capture face with glasses prominent in frame
3. Complete liveness gesture sequence
4. Process through algorithm

Expected Result:
- Algorithm should detect facial features despite frame occlusion
- Liveness should be verified successfully

Actual Result:
- Facial landmark detection partially fails
- Confidence score below threshold (0.41)
- Verification rejected with "insufficient facial features" error

Reproduction Rate: 73% (22 out of 30 attempts)
```

### Minimal Reproduction Case

```javascript
// Minimal test case for reproduction
const testCase = {
  userId: "test-glasses-user-001",
  imageData: "base64_image_with_reflective_glasses",
  lighting: {
    type: "fluorescent",
    intensity: 500, // lux
    direction: "overhead",
  },
  expectedResult: {
    liveness: true,
    confidence: ">0.7",
  },
  actualResult: {
    liveness: false,
    confidence: 0.23,
    errorCode: "LIVENESS_FAILED",
    details: "Potential presentation attack detected",
  },
};
```

---

## Error Analysis

### Algorithm Response Details

```json
{
  "requestId": "req_2024031514321234567",
  "timestamp": "2024-03-15T14:32:45.123Z",
  "result": {
    "liveness": false,
    "confidence": 0.23,
    "details": {
      "faceDetection": {
        "detected": true,
        "confidence": 0.91,
        "landmarks": 68
      },
      "textureAnalysis": {
        "naturalSkinTexture": 0.34,
        "artificialIndicators": 0.78,
        "reflectionAnomalies": 0.89
      },
      "motionAnalysis": {
        "eyeMovement": 0.67,
        "facialMicromovements": 0.45,
        "inconsistentMotion": 0.82
      },
      "qualityMetrics": {
        "imageSharpness": 0.87,
        "illumination": 0.76,
        "occlusion": 0.58
      }
    }
  },
  "errorCode": "LIVENESS_VERIFICATION_FAILED",
  "errorMessage": "Liveness verification failed due to potential presentation attack indicators"
}
```

### Key Indicators Analysis

| Metric                 | Normal Range | Glasses User | Issue Identified                            |
| ---------------------- | ------------ | ------------ | ------------------------------------------- |
| `naturalSkinTexture`   | 0.7-0.95     | 0.34         | ❌ Too low due to reflection interference   |
| `artificialIndicators` | 0.0-0.3      | 0.78         | ❌ False positive from lens reflections     |
| `reflectionAnomalies`  | 0.0-0.4      | 0.89         | ❌ High due to expected glass reflections   |
| `occlusion`            | 0.8-1.0      | 0.58         | ❌ Frame interference with facial landmarks |

---

## Supporting Evidence

### Test Data Collection

```yaml
Sample Size: 150 users (50 with glasses, 50 without glasses, 50 control group)
Testing Period: 2024-03-10 to 2024-03-15
Environments: Production, Staging, Local Development

Results Summary:
  Users without glasses:
    - Success rate: 97.2%
    - Average confidence: 0.84
    - False rejection rate: 2.8%

  Users with glasses:
    - Success rate: 87.7%
    - Average confidence: 0.61
    - False rejection rate: 12.3%

  Statistical significance: p < 0.001 (Chi-square test)
```

### Device and Environment Matrix

| Device             | OS Version | Glasses Success Rate | Normal Success Rate | Delta  |
| ------------------ | ---------- | -------------------- | ------------------- | ------ |
| iPhone 14 Pro      | iOS 17.3   | 82.4%                | 97.8%               | -15.4% |
| iPhone 13          | iOS 17.2   | 89.1%                | 96.2%               | -7.1%  |
| Samsung Galaxy S24 | Android 14 | 85.6%                | 98.4%               | -12.8% |
| Google Pixel 8     | Android 14 | 91.2%                | 97.1%               | -5.9%  |

### Performance Degradation Timeline

```
2024-02-28: Algorithm v2.8.2 - Normal performance (FRR: 2.1%)
2024-03-01: Algorithm v2.8.3 deployment
2024-03-03: First customer complaints about glasses-related failures
2024-03-05: Customer support tickets spike (15 → 67 daily)
2024-03-10: Performance analysis initiated
2024-03-12: Pattern identified - glasses correlation
2024-03-15: Bug report filed
```

---

## System Information

### Environment Details

```yaml
Production Environment:
  Cloud Provider: AWS EU-West-1
  Instance Type: c5.4xlarge (GPU-enabled)
  SDK Version: Selphi iOS SDK v2.8.3, Android SDK v2.8.3
  Algorithm Model: liveness_detection_v2.8.3.onnx
  Model Size: 47.2 MB
  Inference Runtime: ONNX Runtime 1.16.3

Configuration:
  Confidence Threshold: 0.7
  Texture Analysis Weight: 0.35
  Motion Analysis Weight: 0.4
  Quality Analysis Weight: 0.25
  Reflection Tolerance: 0.3 (current), 0.6 (proposed fix)
```

### Log Samples

```
[2024-03-15 14:32:45.123] INFO - Starting liveness verification for session: sess_abc123def456
[2024-03-15 14:32:45.234] DEBUG - Face detection completed: confidence=0.91, landmarks=68
[2024-03-15 14:32:45.456] DEBUG - Texture analysis: natural=0.34, artificial=0.78, reflection=0.89
[2024-03-15 14:32:45.567] WARN - High reflection anomaly detected: 0.89 (threshold: 0.4)
[2024-03-15 14:32:45.678] DEBUG - Motion analysis: eye=0.67, micro=0.45, inconsistent=0.82
[2024-03-15 14:32:45.789] ERROR - Liveness verification failed: confidence=0.23 < threshold=0.7
[2024-03-15 14:32:45.890] INFO - Response sent: LIVENESS_VERIFICATION_FAILED
```

---

## Business Impact Analysis

### Financial Impact

```yaml
Direct Costs:
  - Customer support overhead: ~€2,100/week
  - Failed transaction revenue: ~€47,000 estimated loss
  - Engineering investigation time: 64 person-hours
  - QA validation effort: 32 person-hours

Indirect Costs:
  - Customer satisfaction decline: NPS -1.2 points
  - Potential customer churn: 8 enterprise clients expressing concerns
  - Market reputation risk: 3 negative reviews citing verification issues
  - Support documentation updates required
```

### Customer Feedback Samples

```yaml
Ticket #CS-2024-003456:
  Customer: "Banco Nacional España"
  Issue: "25% of our customers with glasses cannot complete onboarding"
  Urgency: High
  Revenue Impact: €180K annual contract

Ticket #CS-2024-003489:
  Customer: "FinTech Solutions GmbH"
  Issue: "Elderly customers with glasses experiencing high failure rates"
  Urgency: Medium
  Revenue Impact: €95K annual contract

Ticket #CS-2024-003512:
  Customer: "Insurance Corp Italy"
  Issue: "Progressive lens wearers cannot authenticate"
  Urgency: High
  Revenue Impact: €220K annual contract
```

---

## Investigation Findings

### Algorithm Analysis

```python
# Analysis of texture analysis module for glasses detection
def analyze_texture_module():
    """
    Investigation shows the texture analysis module weights reflections
    too heavily in determining artificial presentation attacks.
    """
    current_weights = {
        'skin_texture_consistency': 0.4,
        'reflection_anomalies': 0.35,  # Too high for glasses scenario
        'shadow_patterns': 0.15,
        'surface_uniformity': 0.1
    }

    proposed_weights = {
        'skin_texture_consistency': 0.45,
        'reflection_anomalies': 0.2,   # Reduced for glasses tolerance
        'shadow_patterns': 0.2,
        'surface_uniformity': 0.15
    }

    return current_weights, proposed_weights
```

### Model Behavior Analysis

1. **Reflection Detection Sensitivity**: The current model treats any significant reflection as a strong indicator of screen/photo presentation attacks
2. **Feature Occlusion Handling**: Frame occlusion of facial landmarks reduces confidence disproportionately
3. **Lighting Interaction**: Fluorescent lighting + anti-glare coating creates false positive patterns
4. **Motion Analysis Impact**: Glasses-related artifacts interfere with micro-movement detection

---

## Proposed Solutions

### Short-term Fix (Hot-fix Release)

```yaml
Solution: Configuration Parameter Adjustment
Timeline: 1-2 days
Risk: Low
Implementation:
  - Increase reflection tolerance threshold from 0.3 to 0.6
  - Reduce texture analysis weight from 0.35 to 0.25
  - Add glasses-specific preprocessing filter

Validation Required:
  - Regression testing with 100+ samples
  - Performance validation against existing benchmarks
  - A/B testing with affected customer segment
```

### Medium-term Solution (Algorithm Improvement)

```yaml
Solution: Glasses-Aware Liveness Model
Timeline: 4-6 weeks
Risk: Medium
Implementation:
  - Retrain model with glasses-specific dataset (10K+ samples)
  - Implement glasses detection preprocessing
  - Add glasses-specific evaluation criteria
  - Update confidence scoring algorithm

Benefits:
  - Addresses root cause systematically
  - Improves overall algorithm robustness
  - Reduces future regression risk
```

### Long-term Enhancement (Next Generation)

```yaml
Solution: Multi-Modal Liveness Detection
Timeline: 3-6 months
Risk: Medium-High
Implementation:
  - Incorporate depth sensing for supported devices
  - Add voice-based liveness validation
  - Implement behavioral biometrics
  - Advanced lighting-independent algorithms

Strategic Value:
  - Competitive differentiation
  - Reduced dependency on visual features
  - Enhanced security against presentation attacks
```

---

## Risk Assessment

### Fix Implementation Risks

| Risk                                           | Probability | Impact   | Mitigation                               |
| ---------------------------------------------- | ----------- | -------- | ---------------------------------------- |
| **False positive increase for actual attacks** | Medium      | High     | Thorough testing with attack dataset     |
| **Performance regression on older devices**    | Low         | Medium   | Device-specific testing matrix           |
| **Customer integration disruption**            | Low         | High     | Backward compatibility validation        |
| **Regulatory compliance impact**               | Low         | Critical | Compliance team review before deployment |

### No-Fix Risks

| Risk                         | Probability | Impact | Business Consequence                  |
| ---------------------------- | ----------- | ------ | ------------------------------------- |
| **Customer churn**           | High        | High   | €500K+ potential revenue loss         |
| **Competitive disadvantage** | High        | Medium | Market share erosion                  |
| **Brand reputation damage**  | Medium      | High   | Long-term customer acquisition impact |
| **Regulatory scrutiny**      | Low         | High   | Potential compliance issues           |

---

## Testing Strategy for Fix Validation

### Test Plan Overview

```yaml
Phase 1: Regression Testing (2 days)
  - Existing test suite execution
  - Performance benchmarking
  - Security validation (presentation attack resistance)

Phase 2: Glasses-Specific Testing (3 days)
  - 200+ users with various glasses types
  - Different lighting conditions
  - Cross-device compatibility validation

Phase 3: Customer Validation (1 week)
  - Beta testing with affected customers
  - Real-world usage monitoring
  - Customer feedback integration

Success Criteria:
  - False rejection rate for glasses users: <3%
  - Overall algorithm performance maintained: >97%
  - No new security vulnerabilities introduced
  - Customer satisfaction improvement: >+0.5 NPS
```

### Monitoring and Rollback Plan

```yaml
Deployment Strategy:
  - Canary release: 5% of traffic for 24 hours
  - Gradual rollout: 25% → 50% → 100% over 1 week
  - Real-time monitoring of key metrics
  - Automatic rollback triggers defined

Monitoring Metrics:
  - False rejection rate by user segment
  - Overall verification success rate
  - Algorithm confidence score distribution
  - Customer support ticket volume

Rollback Triggers:
  - False rejection rate increase >1% for any segment
  - Overall success rate drop >0.5%
  - Critical security vulnerability detected
  - >10 customer escalations in 24 hours
```

---

## Communication Plan

### Internal Stakeholders

```yaml
Immediate (24 hours):
  - CTO and Engineering Leadership briefing
  - Customer Success team notification
  - Support team talking points update

Short-term (48-72 hours):
  - Customer advisory notification
  - Sales team competitive positioning update
  - Product marketing messaging adjustment

Ongoing:
  - Weekly progress reports during fix development
  - Post-deployment success metrics reporting
  - Lessons learned documentation
```

### Customer Communication

```yaml
Proactive Communication:
  - Affected customers notification of known issue
  - Timeline for fix deployment
  - Temporary workarounds and best practices

Reactive Support:
  - Updated support documentation
  - Escalation procedures for affected users
  - Compensation/credit consideration for enterprise clients

Post-Fix:
  - Success metrics sharing with key customers
  - Algorithm improvement roadmap communication
  - Commitment to enhanced testing procedures
```

---

## Appendices

### Appendix A: Test Data Samples

- 50+ anonymized user images demonstrating the issue
- Algorithm response logs for affected cases
- Performance comparison charts

### Appendix B: Customer Feedback Details

- Complete customer support ticket analysis
- Severity and impact categorization
- Regional and demographic impact patterns

### Appendix C: Technical Specifications

- Algorithm model architecture details
- Configuration parameter documentation
- Deployment environment specifications

### Appendix D: Competitive Analysis

- How competitors handle glasses-wearing users
- Industry benchmarks for liveness detection
- Market differentiation opportunities

---

**Report Status**: Active Investigation
**Next Update**: 2024-03-16 10:00 CET
**Escalation Contact**: Carlos Vega (Algorithm Engineer), Ana Martinez (QA Engineer)
**Executive Sponsor**: Roberto Silva (CTO)
