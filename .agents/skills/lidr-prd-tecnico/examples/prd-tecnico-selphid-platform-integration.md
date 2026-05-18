# PRD Técnico: Integración SelphID + Selphi para Platform Empresarial

**Proyecto**: Enterprise Biometric Platform Integration
**Cliente**: Banco Santander España (ejemplo)
**Fecha**: 2026-03-15
**Versión**: 1.0
**Owner**: Lead Architect - R&D Core
**Reviewers**: CTO, Security Lead, DevOps Lead, Integration Team

## 1. Executive Summary

### 1.1 Objetivo Técnico

Integrar SelphID (verificación documental) + Selphi (biometría facial) en la plataforma empresarial existente del cliente, cumpliendo NFRs de alta disponibilidad (99.95%), baja latencia (<2s), y compliance PCI DSS + GDPR.

### 1.2 Scope Técnico

- **APIs**: REST endpoints para verificación de identidad end-to-end
- **Performance**: 10,000 verifications/día peak, 500 concurrent users
- **Security**: End-to-end encryption, biometric templates in HSM
- **Integration**: SSO integration con AD, audit logging en SIEM
- **Deployment**: Kubernetes on-premises + AWS hybrid cloud

### 1.3 Complejidad y Riesgos

- **High**: Integración con 8 sistemas legacy del banco
- **Medium**: Cumplimiento PCI DSS Level 1 + GDPR Art. 9
- **Low**: Performance requirements (well within platform capabilities)

## 2. Arquitectura del Sistema

### 2.1 Architecture Overview

```
[Frontend Apps] → [API Gateway] → [Platform Core] → [SelphID + Selphi Engines] → [Storage Layer]
                       ↓               ↓                    ↓                        ↓
                   [Auth/SSO]    [Orchestrator]      [Biometric Processing]    [HSM + Database]
```

### 2.2 Component Architecture

#### 2.2.1 API Gateway Layer

```yaml
Technology: Kong Enterprise
Purpose: Rate limiting, authentication, request/response transformation
Features:
  - OAuth 2.0 + JWT token validation
  - Rate limiting: 100 req/min per user, 10,000 req/min global
  - Request routing based on endpoint
  - Response caching for non-sensitive data
  - API versioning (v1, v2 parallel support)
```

#### 2.2.2 Platform Core Services

```yaml
Orchestrator Service:
  Technology: Node.js + Express + TypeScript
  Purpose: Business logic orchestration for identity verification flow
  Endpoints:
    - POST /api/v1/identity/verify
    - GET /api/v1/identity/status/{transactionId}
    - DELETE /api/v1/identity/{transactionId}
  Dependencies: SelphID Service, Selphi Service, Database, HSM

Document Service (SelphID):
  Technology: Python + FastAPI
  Purpose: Document capture, OCR, NFC reading, fraud detection
  Models: Trained CNNs for Spanish ID documents (DNI, NIE, Passport)
  Performance: <800ms P95 for full document processing

Face Service (Selphi):
  Technology: C++ core + Python API wrapper
  Purpose: Face detection, liveness, template extraction, 1:1 matching
  Models: Deep learning facial recognition + anti-spoofing
  Performance: <400ms P95 for face verification
```

#### 2.2.3 Data Layer

```yaml
Database: PostgreSQL 15 (primary) + Redis 7 (cache)
Schemas:
  - transactions: Verification sessions metadata
  - audit_logs: Immutable compliance trail
  - user_profiles: Customer linkage (no biometric data)

HSM Integration: Thales Luna Network HSM
Purpose:
  - Biometric template encryption at rest
  - Cryptographic key management
  - Template comparison in secure enclave
  - FIPS 140-2 Level 3 compliance
```

### 2.3 Security Architecture

#### 2.3.1 Data Flow Security

```
1. Frontend → API Gateway: TLS 1.3 + mTLS client certificates
2. API Gateway → Core: Internal VPN + JWT tokens
3. Core → HSM: Dedicated PKCS#11 connection
4. Biometric templates: AES-256-GCM encrypted, HSM-managed keys
5. Audit trail: Write-only database + cryptographic signatures
```

#### 2.3.2 Biometric Data Protection (GDPR Art. 9)

```yaml
Template Storage:
  - Encryption: AES-256-GCM with HSM-generated keys
  - Location: On-premises HSM (no cloud storage)
  - Retention: 30 days automatic deletion
  - Access: Role-based, audit-logged, HSM-authenticated

Data Minimization:
  - Original images: Deleted after template extraction (<5 minutes)
  - OCR data: Masked in logs, encrypted in database
  - Audit trail: Pseudonymized customer IDs
  - Template revocation: Immediate + irrecoverable deletion
```

### 2.4 Integration Points

#### 2.4.1 Existing Bank Systems

| Sistema              | Protocolo        | Datos                   | SLA    |
| -------------------- | ---------------- | ----------------------- | ------ |
| **Core Banking**     | SOAP/XML over MQ | Customer validation     | <500ms |
| **Active Directory** | LDAP/SAML 2.0    | Employee authentication | <200ms |
| **Fraud Detection**  | REST/JSON        | Risk scoring input      | <1s    |
| **AML Platform**     | REST/JSON        | Transaction reporting   | <2s    |
| **SIEM**             | Syslog/CEF       | Security events         | <100ms |
| **Document Archive** | REST/JSON        | Compliance storage      | <3s    |

#### 2.4.2 External Services

| Servicio    | Propósito                  | SLA | Failover              |
| ----------- | -------------------------- | --- | --------------------- |
| **FNMT**    | Spanish ID validation      | <2s | Cached results 24h    |
| **DGT**     | Driving license validation | <3s | Manual override       |
| **AEAT**    | Tax ID verification        | <5s | Queue for retry       |
| **Equifax** | Credit bureau checks       | <2s | Alternative providers |

## 3. Non-Functional Requirements

### 3.1 Performance Requirements

#### 3.1.1 Throughput

| Métrica                      | Requirement          | Peak Load       | Capacity Planning      |
| ---------------------------- | -------------------- | --------------- | ---------------------- |
| **Concurrent verifications** | 500 simultaneous     | 750 peak        | Auto-scaling to 1000   |
| **Daily volume**             | 10,000 verifications | 15,000 peak day | 25,000 design capacity |
| **Response time P95**        | <2s end-to-end       | <3s under peak  | <5s degraded mode      |
| **Document processing**      | <800ms               | <1.2s peak      | <2s max acceptable     |
| **Face verification**        | <400ms               | <600ms peak     | <1s max acceptable     |

#### 3.1.2 Scalability

```yaml
Horizontal Scaling:
  - Orchestrator: 2-8 pods (Kubernetes HPA)
  - SelphID service: 3-12 pods (GPU-optimized nodes)
  - Selphi service: 3-15 pods (CPU-optimized)
  - Database: PostgreSQL read replicas (2-6 nodes)
  - Cache: Redis Cluster (3-9 nodes)

Auto-scaling Triggers:
  - CPU > 70% for 2 minutes
  - Memory > 80% for 5 minutes
  - Queue depth > 100 requests
  - Response time P95 > 1.5s for 3 minutes
```

### 3.2 Availability Requirements

#### 3.2.1 Uptime SLAs

- **Overall system**: 99.95% (21.9 minutes downtime/month)
- **Business hours** (8:00-20:00): 99.99% (4.3 minutes/month)
- **Planned maintenance**: Max 4 hours/month, weekend only
- **Disaster recovery**: RTO 1 hour, RPO 15 minutes

#### 3.2.2 High Availability Design

```yaml
Multi-AZ Deployment:
  - Primary: On-premises data center (Madrid)
  - Secondary: AWS eu-west-1 (Ireland)
  - Failover: Automatic for stateless services, manual for HSM

Load Balancing:
  - Layer 7: NGINX Ingress Controller (Kubernetes)
  - Layer 4: Hardware load balancer (F5)
  - Health checks: /health endpoint every 10s
  - Circuit breaker: 5 failures → open for 60s

Backup Strategy:
  - Database: Continuous WAL-E to S3, daily full backup
  - HSM: Key backup to offline hardware security module
  - Configuration: GitOps with Argo CD
  - Monitoring: Prometheus metrics retained 90 days
```

### 3.3 Security Requirements

#### 3.3.1 Authentication & Authorization

```yaml
Multi-factor Authentication:
  - Employee access: AD + RSA SecurID tokens
  - API access: OAuth 2.0 + mTLS certificates
  - Administrative access: Privileged access management (CyberArk)

Role-Based Access Control:
  - Customer Service: Read-only verification status
  - Compliance Officer: Full audit trail access
  - Operations: Service monitoring and restart
  - Developer: Read-only logs, no customer data
  - DBA: Database access logged and approved
```

#### 3.3.2 Compliance Requirements

```yaml
PCI DSS Level 1:
  - Quarterly vulnerability scans (ASV approved)
  - Annual penetration testing
  - Network segmentation (dedicated VLAN)
  - Encrypted cardholder data (if applicable)
  - Secure coding practices + code reviews

GDPR Article 9 (Biometric Data):
  - Data Protection Impact Assessment (DPIA) completed
  - Privacy by design implementation
  - Explicit consent capture and management
  - Data subject rights automation (access, deletion)
  - Cross-border transfer restrictions (EU only)
  - Breach notification procedures (<72 hours)

ISO 27001:
  - Information security management system
  - Risk assessment and treatment
  - Incident response procedures
  - Business continuity planning
  - Supplier security assessments
```

### 3.4 Monitoring and Observability

#### 3.4.1 Metrics Collection

```yaml
Application Metrics (Prometheus):
  - Request rate, response time, error rate
  - Biometric accuracy (FAR, FRR, verification success)
  - Queue depth and processing time
  - Business metrics (verifications/hour, success rate)

Infrastructure Metrics:
  - CPU, Memory, Disk, Network utilization
  - Kubernetes pod health and resource usage
  - Database connections, query performance
  - HSM connectivity and cryptographic operations

Security Metrics:
  - Failed authentication attempts
  - Unusual access patterns
  - Certificate expiration monitoring
  - Vulnerability scan results
```

#### 3.4.2 Alerting Strategy

```yaml
Critical Alerts (PagerDuty):
  - System downtime > 2 minutes
  - Response time P95 > 5s for 5 minutes
  - Error rate > 5% for 3 minutes
  - HSM connectivity loss
  - Security incidents (failed auth > 10/min)

Warning Alerts (Slack):
  - CPU > 80% for 10 minutes
  - Memory > 85% for 15 minutes
  - Queue depth > 50 for 5 minutes
  - Certificate expiration < 30 days
  - Biometric accuracy degradation > 5%
```

## 4. Technology Stack

### 4.1 Programming Languages & Frameworks

```yaml
Backend Services:
  - Orchestrator: Node.js 20 LTS + Express + TypeScript 5.0
  - SelphID: Python 3.11 + FastAPI + OpenCV + TensorFlow
  - Selphi: C++17 + Python bindings + PyTorch
  - Gateway: Kong Enterprise 3.x

Frontend Integration:
  - React 18 + TypeScript (client portal)
  - Swift/Kotlin (mobile SDKs)
  - JavaScript SDK (web integration)

Database:
  - PostgreSQL 15 (primary data)
  - Redis 7 (caching, session storage)
  - Elasticsearch 8 (audit logs, search)
```

### 4.2 Infrastructure & DevOps

```yaml
Containerization:
  - Docker 24+ (multi-stage builds)
  - Kubernetes 1.28 (on-premises + EKS)
  - Helm 3.x (package management)

CI/CD:
  - GitHub Enterprise (source control)
  - GitHub Actions (CI/CD pipelines)
  - Argo CD (GitOps deployment)
  - SonarQube (code quality)
  - Trivy (container vulnerability scanning)

Monitoring:
  - Prometheus + Grafana (metrics)
  - ELK Stack (centralized logging)
  - Jaeger (distributed tracing)
  - PagerDuty (incident management)
```

### 4.3 Security Tools

```yaml
Static Analysis:
  - SonarQube (code quality + security)
  - Snyk (dependency vulnerability scanning)
  - Semgrep (custom security rules)

Runtime Security:
  - Falco (runtime threat detection)
  - OPA Gatekeeper (policy enforcement)
  - Cert-manager (certificate lifecycle)

Penetration Testing:
  - OWASP ZAP (automated DAST)
  - Burp Suite Professional (manual testing)
  - Nessus (vulnerability assessment)
```

## 5. Data Architecture

### 5.1 Database Design

#### 5.1.1 Logical Data Model

```sql
-- Verification transactions
CREATE TABLE verification_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id VARCHAR(50) NOT NULL,
    session_id VARCHAR(100) NOT NULL,
    status verification_status NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    metadata JSONB
);

-- Document verification results
CREATE TABLE document_verifications (
    transaction_id UUID REFERENCES verification_transactions(id),
    document_type document_type_enum NOT NULL,
    ocr_confidence DECIMAL(5,4),
    fraud_score DECIMAL(5,4),
    nfc_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Face verification results (no biometric data stored)
CREATE TABLE face_verifications (
    transaction_id UUID REFERENCES verification_transactions(id),
    liveness_score DECIMAL(5,4),
    matching_score DECIMAL(5,4),
    anti_spoofing_result BOOLEAN,
    template_id VARCHAR(64), -- HSM reference only
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Audit trail (immutable)
CREATE TABLE audit_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type VARCHAR(50) NOT NULL,
    actor_id VARCHAR(50), -- employee or system ID
    resource_id VARCHAR(100), -- transaction or customer ID
    action VARCHAR(50) NOT NULL,
    outcome VARCHAR(20) NOT NULL,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    signature VARCHAR(512) -- cryptographic integrity
);
```

#### 5.1.2 Data Retention Policies

```yaml
Operational Data:
  - verification_transactions: 7 years (regulatory requirement)
  - document_verifications: 7 years (encrypted sensitive fields)
  - face_verifications: 7 years (no biometric templates)

Biometric Data (HSM):
  - Face templates: 30 days automatic deletion
  - Document images: <5 minutes (processing only)
  - OCR extracted data: Masked after 24 hours

Audit Data:
  - audit_events: 10 years (legal compliance)
  - Security logs: 2 years active, 7 years archived
  - Performance metrics: 90 days Prometheus, 2 years long-term
```

### 5.2 API Design

#### 5.2.1 REST API Specification

```yaml
Identity Verification API v1:
  base_url: https://api-gateway.banco.es/identity/v1

  POST /verification:
    purpose: Start new identity verification
    input:
      customer_id: string (required)
      verification_type: enum [full, document_only, face_only]
      callback_url: string (optional)
    output:
      transaction_id: UUID
      session_token: JWT (expires 30 min)
      next_steps: array of required actions

  POST /verification/{transaction_id}/document:
    purpose: Submit document images for verification
    input:
      front_image: base64 encoded image
      back_image: base64 encoded image (optional)
      document_type: enum [dni, nie, passport]
    output:
      document_verification_id: UUID
      ocr_results: extracted data object
      fraud_assessment: risk score + details

  POST /verification/{transaction_id}/face:
    purpose: Submit face image for biometric verification
    input:
      face_image: base64 encoded image
      liveness_challenge: base64 encoded video (optional)
    output:
      face_verification_id: UUID
      liveness_result: pass/fail + confidence
      matching_result: score + decision

  GET /verification/{transaction_id}/status:
    purpose: Check verification progress and results
    output:
      status: enum [pending, in_progress, completed, failed]
      steps_completed: array of verification steps
      overall_result: pass/fail/partial
      confidence_scores: object with detailed metrics
```

#### 5.2.2 Error Handling

```yaml
HTTP Status Codes:
  200: Success
  202: Accepted (async processing)
  400: Bad Request (validation error)
  401: Unauthorized (invalid token)
  403: Forbidden (insufficient permissions)
  404: Resource Not Found
  429: Too Many Requests (rate limited)
  500: Internal Server Error
  503: Service Unavailable

Error Response Format:
  error_code: string (application-specific)
  message: string (human-readable)
  details: object (validation errors, etc.)
  trace_id: string (for debugging)
  timestamp: ISO 8601 datetime
```

## 6. Integration & Deployment

### 6.1 Deployment Architecture

#### 6.1.1 Environment Strategy

```yaml
Development:
  purpose: Feature development and testing
  infrastructure: Kubernetes namespace (shared cluster)
  data: Synthetic test data only
  external_integrations: Mocked services

Staging:
  purpose: Pre-production validation and performance testing
  infrastructure: Dedicated Kubernetes cluster (smaller)
  data: Anonymized production subset
  external_integrations: Test endpoints where available

Production:
  purpose: Live customer transactions
  infrastructure: Dedicated Kubernetes cluster (HA)
  data: Real customer data (encrypted)
  external_integrations: Live banking systems
  backup: Full disaster recovery capability
```

#### 6.1.2 CI/CD Pipeline

```yaml
Source Control → Build → Test → Security Scan → Deploy → Monitor

Build Stage:
  - Multi-stage Docker builds
  - Dependency vulnerability scanning
  - Unit test execution (>80% coverage required)
  - Static code analysis (SonarQube quality gates)

Security Stage:
  - Container image scanning (Trivy)
  - Infrastructure as Code validation (Checkov)
  - Secret detection (git-secrets)
  - Compliance policy checks

Deploy Stage:
  - Blue-green deployment strategy
  - Database migration automation (Flyway)
  - Configuration management (Helm + sealed-secrets)
  - Smoke tests and health checks
```

### 6.2 Operational Procedures

#### 6.2.1 Incident Response

```yaml
Severity Levels:
  S1 (Critical): System down, customer impact, <15 min response
  S2 (High): Major functionality affected, <1 hour response
  S3 (Medium): Minor functionality affected, <4 hour response
  S4 (Low): No customer impact, next business day

Escalation Matrix:
  Primary: On-call engineer (automated PagerDuty)
  Secondary: Team lead + operations manager
  Executive: CTO notification for S1 incidents >30 min

Post-Incident:
  - Root cause analysis (Five Whys)
  - Postmortem report within 48 hours
  - Action items tracked to completion
  - Runbook updates to prevent recurrence
```

#### 6.2.2 Maintenance Procedures

```yaml
Regular Maintenance:
  - Security patches: Monthly, automated where possible
  - Database maintenance: Weekly during low-usage windows
  - Certificate renewal: Automated 30 days before expiry
  - Backup verification: Daily automated tests

Change Management:
  - All changes through GitOps (Argo CD)
  - Database changes require DBA approval
  - Security changes require InfoSec review
  - Emergency changes documented within 24 hours
```

## 7. Risk Analysis

### 7.1 Technical Risks

#### 7.1.1 High Impact Risks

| Risk                       | Probability | Impact   | Mitigation                             |
| -------------------------- | ----------- | -------- | -------------------------------------- |
| **HSM failure**            | Low         | Critical | Redundant HSM + offline backup         |
| **Database corruption**    | Low         | High     | PITR backups + read replicas           |
| **Network partition**      | Medium      | High     | Multi-AZ deployment + circuit breakers |
| **Third-party API outage** | High        | Medium   | Circuit breaker + cached responses     |

#### 7.1.2 Security Risks

| Risk                    | Probability | Impact   | Mitigation                                  |
| ----------------------- | ----------- | -------- | ------------------------------------------- |
| **Data breach**         | Low         | Critical | Encryption + access controls + monitoring   |
| **API abuse**           | Medium      | Medium   | Rate limiting + authentication + monitoring |
| **Insider threat**      | Low         | High     | Privileged access management + audit trail  |
| **Supply chain attack** | Low         | High     | Dependency scanning + vendor assessment     |

### 7.2 Business Risks

- **Regulatory changes**: GDPR interpretation evolution
- **Compliance audit failure**: Quarterly self-assessment + external annual audit
- **Customer adoption**: User education + gradual rollout strategy
- **Competitive pressure**: Continuous feature development + performance optimization

---

**Technical Sign-off Required**:

- Chief Technology Officer (overall architecture)
- Security Architect (security design)
- Database Administrator (data architecture)
- DevOps Lead (deployment strategy)
- Infrastructure Manager (capacity planning)

**Next Phase**: Detailed implementation planning + PoC development
