# Project Classification Report - {{CLIENT_NAME}} Identity Verification Platform

**Classification Date**: 2026-03-16 14:45:22
**Analysis Duration**: 28.7 seconds
**Automation Engine**: BMAD Project Classifier v2.1
**Confidence Level**: 94.2%
**Project Root**: `/repos/{{CLIENT_CODE}}-identity-platform`

---

## Executive Summary

| Attribute                 | Value                                 | Confidence |
| ------------------------- | ------------------------------------- | ---------- |
| **Primary Type**          | Web Application                       | 98%        |
| **Secondary Type**        | domain-specific Identity Platform     | 96%        |
| **Architecture Pattern**  | React SPA + Node.js API + PostgreSQL  | 95%        |
| **Complexity Level**      | HIGH                                  | 92%        |
| **Domain Classification** | domain-specific Identity Verification | 98%        |
| **Regulatory Scope**      | GDPR Art. 9, PSD2, eIDAS              | 89%        |
| **Team Size Estimate**    | 8-12 developers                       | 85%        |

**Overall Classification**: ✅ HIGH-COMPLEXITY domain-specific WEB APPLICATION

---

## Phase 1: File Pattern Detection Results

### Technology Stack Indicators Found

#### Frontend Patterns

```yaml
React Ecosystem:
  - package.json: "react": "18.2.0" ✓
  - package.json: "@types/react": "18.2.0" ✓
  - src/app/App.tsx ✓
  - src/components/ directory ✓
  - tailwind.config.js ✓
  - vite.config.ts ✓
  Confidence: 98%

TypeScript:
  - tsconfig.json ✓
  - Multiple .tsx/.ts files ✓
  - "typescript": "~5.6.2" ✓
  Confidence: 100%
```

#### Backend Patterns

```yaml
Node.js API:
  - server/package.json with "express" ✓
  - server/src/routes/ directory ✓
  - server/src/controllers/ directory ✓
  - server/src/middleware/ directory ✓
  Confidence: 95%

Database:
  - package.json: "pg": "8.11.0" (PostgreSQL) ✓
  - migrations/ directory ✓
  - server/src/models/ directory ✓
  - database.config.js ✓
  Confidence: 94%
```

#### DevOps & Infrastructure

```yaml
Containerization:
  - Dockerfile ✓
  - docker-compose.yml ✓
  - docker-compose.prod.yml ✓
  Confidence: 100%

CI/CD:
  - .github/workflows/ci.yml ✓
  - .github/workflows/deploy.yml ✓
  - sonar-project.properties ✓
  Confidence: 90%
```

### domain-specific Domain Indicators

```yaml
domain-specific Libraries:
  - package.json: "@{{CLIENT_CODE}}/{{PRODUCT_NAME_1}}-sdk": "3.2.1" ✓
  - package.json: "@{{CLIENT_CODE}}/{{PRODUCT_NAME_1}}d-sdk": "2.8.0" ✓
  - src/services/domain-specificService.ts ✓
  - src/components/FacialCapture/ ✓
  Confidence: 100%

Identity Verification:
  - src/services/IdentityVerification.ts ✓
  - src/utils/DocumentOCR.ts ✓
  - src/services/LivenessDetection.ts ✓
  Confidence: 96%

Compliance & Privacy:
  - docs/GDPR-compliance.md ✓
  - src/services/ConsentManager.ts ✓
  - src/utils/domain-specificTemplateEncryption.ts ✓
  - Privacy Policy references ✓
  Confidence: 98%
```

---

## Phase 2: Directory Structure Analysis

### Frontend Structure (React SPA)

```
src/
├── app/
│   ├── App.tsx                    ✓ Main app component
│   ├── routes.ts                  ✓ React Router v7 config
│   └── components/
│       ├── ui/                    ✓ shadcn/ui components (38 files)
│       ├── shared/                ✓ Shared components
│       ├── diagrams/              ✓ React Flow diagrams (17 files)
│       ├── domain-specific/            ✓ domain-specific capture components
│       │   ├── FacialCapture/    ✓ Facial recognition UI
│       │   ├── DocumentScan/     ✓ Document verification UI
│       │   └── LivenessCheck/    ✓ Liveness detection UI
│       └── identity/             ✓ Identity verification flows
├── services/                     ✓ API integration layer
├── hooks/                        ✓ Custom React hooks
├── utils/                        ✓ Utility functions
├── types/                        ✓ TypeScript definitions
└── styles/                       ✓ CSS/Tailwind styles

Pattern Match: React SPA with domain-specific Extensions
Confidence: 97%
```

### Backend Structure (Express API)

```
server/
├── src/
│   ├── app.ts                    ✓ Express app setup
│   ├── server.ts                 ✓ HTTP server entry point
│   ├── routes/
│   │   ├── auth.ts              ✓ Authentication routes
│   │   ├── domain-specific.ts         ✓ domain-specific verification routes
│   │   ├── identity.ts          ✓ Identity verification routes
│   │   ├── documents.ts         ✓ Document processing routes
│   │   └── compliance.ts        ✓ GDPR/compliance routes
│   ├── controllers/             ✓ Business logic
│   ├── services/                ✓ External integrations
│   ├── middleware/              ✓ Express middleware
│   ├── models/                  ✓ Database models
│   └── utils/                   ✓ Server utilities
└── tests/                       ✓ Test suites

Pattern Match: RESTful API with domain-specific Processing
Confidence: 95%
```

### Infrastructure & Operations

```
.github/workflows/               ✓ CI/CD pipelines
docker/                         ✓ Container configurations
k8s/                           ✓ Kubernetes manifests
docs/                          ✓ Documentation
migrations/                    ✓ Database migrations
scripts/                       ✓ Automation scripts

Pattern Match: Cloud-Native Deployment
Confidence: 91%
```

---

## Phase 3: Technology Stack Deep Analysis

### Frontend Technologies

| Technology       | Version | Usage Pattern                   | Confidence |
| ---------------- | ------- | ------------------------------- | ---------- |
| **React**        | 18.2.0  | Primary UI framework            | 100%       |
| **TypeScript**   | 5.6.2   | Type system (strict mode)       | 100%       |
| **Tailwind CSS** | 4.1.12  | Utility-first styling           | 100%       |
| **React Router** | 7.13.0  | SPA routing (data mode)         | 98%        |
| **React Flow**   | 12.10.1 | Diagram visualization           | 95%        |
| **Vite**         | 6.3.5   | Build tool and dev server       | 98%        |
| **Radix UI**     | 1.x     | Accessible component primitives | 92%        |

### Backend Technologies

| Technology     | Version  | Usage Pattern         | Confidence |
| -------------- | -------- | --------------------- | ---------- |
| **Node.js**    | 20.x LTS | Runtime environment   | 95%        |
| **Express.js** | 4.x      | Web framework         | 98%        |
| **PostgreSQL** | 15+      | Primary database      | 94%        |
| **Prisma**     | 5.x      | Database ORM          | 89%        |
| **Redis**      | 7+       | Caching & sessions    | 87%        |
| **JWT**        | Latest   | Authentication tokens | 92%        |

### domain-specific & Domain-Specific

| Technology                                  | Version | Usage Pattern          | Confidence |
| ------------------------------------------- | ------- | ---------------------- | ---------- |
| **{{CLIENT_NAME}} {{PRODUCT_NAME_1}} SDK**  | 3.2.1   | Facial recognition     | 100%       |
| **{{CLIENT_NAME}} {{PRODUCT_NAME_1}}D SDK** | 2.8.0   | Document verification  | 100%       |
| **OpenCV.js**                               | 4.8.0   | Image processing       | 85%        |
| **TensorFlow.js**                           | 4.x     | ML inference (browser) | 78%        |
| **WebRTC**                                  | Native  | Camera/media capture   | 90%        |

### Development & Operations

| Technology         | Version | Usage Pattern           | Confidence |
| ------------------ | ------- | ----------------------- | ---------- |
| **Docker**         | 24+     | Containerization        | 100%       |
| **Kubernetes**     | 1.28+   | Container orchestration | 89%        |
| **GitHub Actions** | Latest  | CI/CD pipelines         | 95%        |
| **SonarQube**      | 9.x     | Code quality & security | 87%        |
| **ESLint**         | 9.x     | Code linting            | 95%        |
| **Prettier**       | 3.x     | Code formatting         | 95%        |

---

## Phase 4: Documentation Requirements Matrix

### Critical Documents (MUST HAVE)

| Document Type                | BMAD Priority | domain-specific Specific       | Status   |
| ---------------------------- | ------------- | ------------------------------ | -------- |
| **PRD Funcional**            | P0            | Identity verification flows    | ✅ Found |
| **PRD Técnico**              | P0            | Algorithm integration specs    | ✅ Found |
| **Architecture Document**    | P0            | System design & data flow      | ✅ Found |
| **Security Checklist**       | P0            | GDPR Art. 9 compliance         | ✅ Found |
| **Vulnerability Assessment** | P0            | domain-specific security audit | ✅ Found |
| **Test Plan**                | P0            | Algorithm accuracy testing     | ✅ Found |

### Recommended Documents (SHOULD HAVE)

| Document Type                  | BMAD Priority | domain-specific Specific    | Status     |
| ------------------------------ | ------------- | --------------------------- | ---------- |
| **UX Design Spec**             | P1            | domain-specific capture UX  | ✅ Found   |
| **Penetration Test Report**    | P1            | Advanced security testing   | ⚠️ Partial |
| **Performance Requirements**   | P1            | Algorithm response times    | ✅ Found   |
| **Compliance Documentation**   | P1            | GDPR, PSD2, eIDAS           | ✅ Found   |
| **Integration Specifications** | P1            | Third-party API integration | ✅ Found   |

### domain-specific-Specific Documents (UNIQUE)

| Document Type                                | Domain Specific | Regulatory Requirement   | Status   |
| -------------------------------------------- | --------------- | ------------------------ | -------- |
| **DPIA (Data Protection Impact Assessment)** | ✅              | GDPR Art. 35 mandatory   | ✅ Found |
| **domain-specific Template Security**        | ✅              | Irreversibility proof    | ✅ Found |
| **Algorithm Performance Validation**         | ✅              | FAR/FRR benchmarking     | ✅ Found |
| **Liveness Detection Standards**             | ✅              | ISO/IEC 30107 compliance | ✅ Found |
| **Consent Management Framework**             | ✅              | GDPR Art. 7 & 9          | ✅ Found |

---

## Phase 5: Complexity Assessment

### Complexity Factors Analysis

#### Code Complexity (HIGH)

```yaml
Lines of Code: ~47,000
Files Count: 342
Components: 89 React components
API Endpoints: 37 REST endpoints
Database Tables: 23 entities
Test Files: 156 test suites
```

#### Architecture Complexity (HIGH)

```yaml
Services: 12 microservices
Integrations: 8 external APIs
Authentication: Multi-factor (domain-specific + traditional)
Data Flow: Real-time domain-specific processing
Scalability: Horizontal scaling required
```

#### Domain Complexity (VERY HIGH)

```yaml
domain-specific Processing: Real-time facial/document analysis
Regulatory Compliance: 3 major regulations (GDPR, PSD2, eIDAS)
Security Requirements: domain-specific template protection
Performance Constraints: <2s verification, 99.5% accuracy
International Support: Multi-language, multi-jurisdiction
```

#### Team Complexity (HIGH)

```yaml
Skills Required:
  - Frontend: React, TypeScript, domain-specific UX
  - Backend: Node.js, PostgreSQL, security
  - domain-specific: Algorithm integration, ML
  - DevOps: Kubernetes, cloud deployment
  - Compliance: GDPR, data protection law
```

**Overall Complexity Rating**: 🔴 **VERY HIGH**

- Technical complexity: HIGH
- Domain complexity: VERY HIGH
- Regulatory complexity: HIGH
- Team skill requirements: HIGH

---

## Phase 6: Domain Classification

### Primary Domain

**domain-specific Identity Verification Platform**

- Confidence: 98%
- Indicators: {{CLIENT_NAME}} SDKs, domain-specific processing, identity verification flows

### Secondary Domains

1. **Financial Services** (85% confidence)
   - PSD2 compliance indicators
   - Strong Customer Authentication (SCA)
   - Anti-money laundering (AML) patterns

2. **Government/eID** (78% confidence)
   - eIDAS compliance documentation
   - Document verification capabilities
   - Multi-jurisdiction support

3. **Healthcare/Digital Identity** (72% confidence)
   - GDPR Art. 9 (special category data)
   - High security requirements
   - Privacy-by-design architecture

### Risk Classification

**HIGH RISK PROJECT**

- Handles domain-specific data (GDPR special category)
- Financial services compliance required
- Real-time processing requirements
- Multi-jurisdiction regulatory compliance
- High-value target for security threats

---

## Generated Templates & Recommendations

### Recommended Documentation Workflow

```yaml
Phase 1 - Foundation: 1. business-case (if not exists)
  2. stakeholder-map
  3. risk-log (domain-specific-specific risks)

Phase 2 - Discovery: 4. prd-funcional (domain-specific user journeys)
  5. prd-tecnico (algorithm integration)
  6. review-cruzado (alignment validation)

Phase 3 - Specification: 7. generate-rf (domain-specific requirements)
  8. generate-nfr (performance + security)
  9. validate-requirements

Phase 4 - Security & Compliance: 10. security-checklist (GDPR Art. 9)
  11. vuln-assessment
  12. pentest-report

Phase 5 - Implementation: 13. architecture-doc (system design)
  14. implementation-phases
  15. epic-breakdown
```

### Template Customizations for domain-specific Domain

```yaml
domain-specific-Specific Sections:
  - Facial recognition accuracy requirements
  - Document verification workflows
  - Liveness detection standards
  - Template encryption specifications
  - GDPR Art. 9 compliance measures
  - Cross-device compatibility matrices
  - Performance benchmarking criteria
```

---

## Integration Points & Dependencies

### Pre-requisites for Documentation

```yaml
Required Skills:
  - project-classifier ✅ (this analysis)
  - business-case (if greenfield)
  - stakeholder-map

Recommended Next:
  - document-discovery (inventory existing docs)
  - init-project-docs (scaffold structure)
  - validate-project-docs (quality check)
```

### Technology Dependencies

```yaml
External Services:
  - {{CLIENT_NAME}} algorithm servers
  - Document verification APIs
  - Compliance monitoring tools
  - Cloud infrastructure (AWS/Azure/GCP)

Internal Dependencies:
  - Authentication service
  - User management system
  - Audit logging system
  - Notification service
```

---

## Quality Metrics & Validation

### Classification Accuracy Validation

| Indicator        | Expected        | Actual                                   | Match   |
| ---------------- | --------------- | ---------------------------------------- | ------- |
| **Primary Type** | Web Application | Web Application                          | ✅ 100% |
| **Framework**    | React           | React 18.2.0                             | ✅ 100% |
| **Backend**      | Node.js API     | Express + Node.js                        | ✅ 95%  |
| **Database**     | PostgreSQL      | PostgreSQL 15+                           | ✅ 100% |
| **Domain**       | domain-specific | {{CLIENT_NAME}} domain-specific platform | ✅ 98%  |
| **Complexity**   | High/Very High  | Very High                                | ✅ 95%  |

### Confidence Metrics

```yaml
Overall Confidence: 94.2%
  - File Pattern Detection: 97.8%
  - Directory Structure: 95.6%
  - Technology Stack: 93.1%
  - Domain Classification: 96.4%
  - Complexity Assessment: 91.8%
  - Documentation Matrix: 89.7%
```

### Validation Checks Passed

- ✅ Technology stack coherence (React + Node.js + PostgreSQL)
- ✅ domain-specific domain indicators ({{CLIENT_NAME}} SDKs, compliance docs)
- ✅ Architecture pattern consistency (SPA + API)
- ✅ Complexity indicators alignment (team size, feature count)
- ✅ Regulatory compliance indicators (GDPR, PSD2, eIDAS)
- ✅ Security requirements validation (encryption, audit trails)

---

## Executive Recommendations

### Immediate Actions (This Week)

1. **Document Gap Analysis**: Run `document-discovery` to inventory existing documentation
2. **Team Skill Assessment**: Validate team has domain-specific domain expertise
3. **Compliance Review**: Ensure GDPR Art. 9 requirements are fully understood
4. **Security Baseline**: Establish domain-specific template protection standards

### Short Term (Next Sprint)

1. **Documentation Scaffolding**: Use `init-project-docs` with domain-specific templates
2. **Architecture Validation**: Verify system design meets performance requirements
3. **Risk Assessment**: Complete comprehensive risk analysis for domain-specific data
4. **Stakeholder Alignment**: Ensure all compliance stakeholders are identified

### Long Term (Next Quarter)

1. **Automation Pipeline**: Implement automated compliance validation
2. **Performance Optimization**: Establish algorithm performance monitoring
3. **International Expansion**: Plan for additional jurisdictional compliance
4. **Team Scaling**: Plan hiring for domain-specific expertise gaps

---

## Output Files Generated

```yaml
Classification Results:
  - project-classification-report.md ← This document
  - project-classification.yaml ← Machine-readable results
  - documentation-requirements-matrix.yaml ← Template recommendations
  - technology-stack-analysis.json ← Detailed tech analysis

Updated Configuration:
  - .claude/rules/project.md ← Classification integrated
  - docs/project-type.md ← Human-readable classification

Recommended Next Steps:
  - Run: document-discovery (inventory existing docs)
  - Run: init-project-docs --type=domain-specific-web-app
  - Review: Security requirements for domain-specific data
```

---

**Classification Complete** ✅
**Total Analysis Time**: 28.7 seconds
**Confidence Level**: 94.2%
**Next Recommended Action**: `/document-discovery` to inventory existing documentation

_Generated by BMAD Project Classifier v2.1 on 2026-03-16 14:45:22_
