# NFR: SelphID Banking Platform - Requisitos No Funcionales

**Proyecto**: BBVA Digital Onboarding Platform
**Generado desde**: PRD Técnico v1.0 § 5 Non-Functional Requirements
**Fecha**: 2026-03-15
**Owner**: Solution Architect + Performance Engineer
**Aprobado por**: CTO + Security Officer

---

## NFR-001: Performance y Throughput

### NFR-001.1: Latencia de Respuesta

**Requirement**: El sistema debe procesar verificaciones de identidad con latencias ultra-bajas
**Criterio de Medición**: Response time percentiles bajo carga normal y peak

| Componente                     | P50    | P95    | P99    | Peak Load P95 |
| ------------------------------ | ------ | ------ | ------ | ------------- |
| **API Gateway**                | <100ms | <200ms | <500ms | <300ms        |
| **Document OCR** (SelphID)     | <800ms | <1.2s  | <2s    | <1.8s         |
| **Face Verification** (Selphi) | <400ms | <600ms | <1s    | <800ms        |
| **End-to-end flow**            | <1.5s  | <2s    | <3s    | <2.5s         |

**Herramientas de Medición**:

- Prometheus + Grafana para métricas en tiempo real
- Load testing con k6 (500 concurrent users)
- APM con New Relic para tracing distribuido

### NFR-001.2: Throughput y Concurrencia

**Requirement**: Soportar volumen de onboarding bancario en horario pico
**Criterio de Medición**: Transacciones procesadas simultáneamente sin degradación

| Métrica                      | Normal | Peak   | Stress Test |
| ---------------------------- | ------ | ------ | ----------- |
| **Concurrent verifications** | 200    | 500    | 750         |
| **Daily volume**             | 8,000  | 15,000 | 25,000      |
| **Hourly peak**              | 2,000  | 3,500  | 5,000       |
| **Queue depth limit**        | <50    | <100   | <200        |

**Scaling Strategy**:

```yaml
Auto-scaling triggers:
  CPU: >70% for 2 minutes → scale up
  Memory: >80% for 5 minutes → scale up
  Queue depth: >50 requests → scale up
  Response time P95: >1.5s → scale up

Horizontal scaling limits:
  SelphID pods: 2-12 (GPU-optimized nodes)
  Selphi pods: 2-15 (CPU-optimized)
  API Gateway: 2-8 (memory-optimized)
```

---

## NFR-002: Disponibilidad y Confiabilidad

### NFR-002.1: Uptime y SLA

**Requirement**: Servicio bancario crítico con alta disponibilidad
**Criterio de Medición**: Uptime medido por monitoring externo (StatusCake)

| Período                     | Uptime Target | Downtime Máximo | Penalización SLA |
| --------------------------- | ------------- | --------------- | ---------------- |
| **Business hours** (8h-20h) | 99.99%        | 4.3 min/mes     | Crédito 10%      |
| **24x7 global**             | 99.95%        | 21.9 min/mes    | Crédito 5%       |
| **Planned maintenance**     | 4h/mes max    | Weekend only    | Notificación 48h |

**Downtime Categorization**:

- **S1 Critical**: Sistema completamente inaccesible > 5 minutos
- **S2 Major**: Funcionalidad core afectada > 15 minutos
- **S3 Minor**: Funcionalidad secundaria > 1 hora

### NFR-002.2: Disaster Recovery

**Requirement**: Recuperación rápida ante fallos catastróficos
**Criterio de Medición**: RTO y RPO medibles y testables

| Escenario          | RTO (Recovery Time) | RPO (Recovery Point) | Test Frequency    |
| ------------------ | ------------------- | -------------------- | ----------------- |
| **Pod failure**    | <30 segundos        | 0 (stateless)        | Automático        |
| **Node failure**   | <2 minutos          | 0 (stateless)        | Chaos engineering |
| **AZ failure**     | <5 minutos          | <1 minuto            | Monthly           |
| **Region failure** | <1 hora             | <15 minutos          | Quarterly         |

**Backup Strategy**:

```yaml
Database backups:
  - Continuous WAL-E to S3 (RPO: 1 minute)
  - Daily full backup + validation
  - Cross-region replication (Ireland)

Configuration backups:
  - GitOps with Argo CD
  - Infrastructure as Code (Terraform)
  - Secrets in Vault (replicated)

Biometric templates (HSM):
  - Hardware backup to offline HSM
  - No cloud backup (GDPR compliance)
  - Manual restore procedure documented
```

---

## NFR-003: Seguridad Biométrica

### NFR-003.1: Biometric Accuracy

**Requirement**: Precisión biométrica para cumplir estándares bancarios
**Criterio de Medición**: Métricas de accuracy medidas mensualmente con dataset real

| Métrica                      | Target | Measurement         | Industry Benchmark         |
| ---------------------------- | ------ | ------------------- | -------------------------- |
| **False Accept Rate** (FAR)  | <0.01% | 1 en 10,000         | Tier 1 banking             |
| **False Reject Rate** (FRR)  | <2%    | 98% legítimos pasan | User experience acceptable |
| **Liveness Detection**       | >99%   | Spoofing detection  | ISO 30107-1 Level 2        |
| **Document Fraud Detection** | >95%   | Falsified documents | Manual review fallback     |

**Continuous Improvement**:

```yaml
Monthly accuracy assessment:
  - Test dataset: 10,000 real verifications
  - Demographics analysis: age, gender, ethnicity
  - Environmental conditions: lighting, device quality
  - Model retraining triggers if degradation >1%

Error analysis:
  - False positives: Manual review + pattern analysis
  - False negatives: User feedback + retesting
  - Edge cases: Specialized dataset creation
```

### NFR-003.2: Anti-Spoofing y Fraud Prevention

**Requirement**: Protección contra ataques sofisticados de identity fraud
**Criterio de Medición**: Tasa de detección de ataques conocidos

| Attack Vector       | Detection Rate | Response Time | Mitigation                      |
| ------------------- | -------------- | ------------- | ------------------------------- |
| **Printed photos**  | >99.5%         | <1s           | Image texture analysis          |
| **Digital screens** | >99%           | <1s           | Moiré pattern detection         |
| **3D masks**        | >95%           | <2s           | Depth sensing + movement        |
| **Deepfakes**       | >90%           | <3s           | AI-generated artifact detection |
| **Replay attacks**  | >99.9%         | <1s           | Timestamp + liveness            |

**Security Monitoring**:

```yaml
Real-time threat detection:
  - Multiple failed attempts (>3) → temp block 15 min
  - Suspicious patterns → risk scoring elevation
  - Known fraud indicators → manual review queue
  - Geographic anomalies → additional verification

Fraud analytics:
  - Daily fraud attempt reports
  - Pattern analysis for emerging threats
  - Integration with bank's fraud detection systems
  - ML model updates based on new attack vectors
```

---

## NFR-004: Compliance y Privacidad

### NFR-004.1: GDPR Article 9 (Biometric Data)

**Requirement**: Cumplimiento estricto de normativa de datos biométricos
**Criterio de Medición**: Auditoría mensual de compliance + 0 infracciones

| Requirement            | Implementation                | Measurement              | Penalty Risk |
| ---------------------- | ----------------------------- | ------------------------ | ------------ |
| **Explicit consent**   | Granular UI + audit trail     | 100% consent captured    | High         |
| **Data minimization**  | Templates only, no raw images | <5MB per verification    | High         |
| **Purpose limitation** | Identity verification only    | Code review + monitoring | Medium       |
| **Data retention**     | 30-day auto-deletion          | Automated cleanup jobs   | High         |
| **Right to deletion**  | <24h response time            | Support ticket SLA       | Medium       |

**Data Handling**:

```yaml
Biometric data lifecycle:
  1. Image capture: Processed immediately, deleted <5 min
  2. Template extraction: AES-256 encrypted, HSM stored
  3. Verification: Template comparison, no storage
  4. Retention: 30 days max, automated deletion
  5. Deletion: Cryptographic erasure, irreversible

Audit trail:
  - Immutable log of all biometric processing
  - Consent capture and withdrawal events
  - Data access and deletion logs
  - Quarterly compliance reports to DPO
```

### NFR-004.2: Banking Compliance (PCI DSS, EBA)

**Requirement**: Cumplir regulaciones bancarias de identidad digital
**Criterio de Medición**: Auditorías trimestrales + certificaciones anuales

| Standard               | Requirement                     | Evidence                        | Audit Frequency |
| ---------------------- | ------------------------------- | ------------------------------- | --------------- |
| **PCI DSS Level 1**    | Secure payment data handling    | ASV scans + penetration testing | Quarterly       |
| **EBA RTS**            | Strong customer authentication  | SCA compliance documentation    | Annual          |
| **ISO 27001**          | Information security management | ISMS certification              | Annual          |
| **NIST Cybersecurity** | Security framework alignment    | Control assessments             | Biannual        |

---

## NFR-005: Integración y Interoperabilidad

### NFR-005.1: API Performance y Reliability

**Requirement**: Integración perfecta con ecosistema bancario existente
**Criterio de Medición**: SLA de APIs y tiempo de respuesta de integraciones

| Integration              | SLA   | Timeout | Circuit Breaker | Fallback            |
| ------------------------ | ----- | ------- | --------------- | ------------------- |
| **Core Banking**         | 99.9% | 5s      | 5 failures/min  | Queue for retry     |
| **Fraud Detection**      | 99.5% | 2s      | 10 failures/min | Default score       |
| **Document DB**          | 99.8% | 3s      | 5 failures/min  | Local cache         |
| **AEAT (Tax Authority)** | 95%   | 10s     | 3 failures/min  | Manual verification |
| **Credit Bureaus**       | 98%   | 5s      | 5 failures/min  | Delayed processing  |

**Integration Resilience**:

```yaml
Circuit breaker pattern:
  - Failure threshold: Configurable per service
  - Recovery time: Exponential backoff 30s → 5min
  - Health check: Automated service probe every 30s
  - Fallback: Graceful degradation, not failure

API versioning:
  - Backwards compatibility: 2 versions supported
  - Deprecation notice: 90 days minimum
  - Breaking changes: Major version bump
  - Documentation: OpenAPI 3.1 specification
```

### NFR-005.2: Data Synchronization

**Requirement**: Consistencia de datos entre sistemas críticos
**Criterio de Medición**: 0 discrepancias en reconciliación diaria

| Data Sync               | Frequency      | Latency | Consistency Check      |
| ----------------------- | -------------- | ------- | ---------------------- |
| **Customer profiles**   | Real-time      | <5s     | Nightly reconciliation |
| **Verification status** | Real-time      | <2s     | Hourly validation      |
| **Audit logs**          | Near real-time | <30s    | Weekly integrity check |
| **Compliance reports**  | Daily batch    | <1h     | Monthly audit          |

---

## NFR-006: Scalability y Capacity Planning

### NFR-006.1: Growth Accommodation

**Requirement**: Soportar crecimiento proyectado de 300% en 2 años
**Criterio de Medición**: Capacity planning vs actual usage

| Metric                  | Current | Year 1 | Year 2 | Architecture Impact   |
| ----------------------- | ------- | ------ | ------ | --------------------- |
| **Daily verifications** | 8K      | 25K    | 60K    | Horizontal scaling    |
| **Concurrent users**    | 200     | 800    | 1,500  | Load balancer upgrade |
| **Data storage**        | 100GB   | 500GB  | 1.5TB  | Database sharding     |
| **Network bandwidth**   | 1Gbps   | 5Gbps  | 10Gbps | CDN implementation    |

### NFR-006.2: Resource Optimization

**Requirement**: Eficiencia de recursos para control de costos
**Criterio de Medición**: Cost per verification trending down

```yaml
Resource efficiency targets:
  CPU utilization: 60-80% average (not >90% sustained)
  Memory utilization: 70-85% average
  Storage efficiency: >80% utilization
  Network efficiency: <50% peak bandwidth

Cost optimization:
  - Spot instances for non-critical workloads
  - Auto-scaling policies to minimize idle resources
  - Reserved instances for predictable baseline
  - Regular rightsizing based on metrics
```

---

## NFR-007: Monitoring y Observabilidad

### NFR-007.1: Comprehensive Monitoring

**Requirement**: Visibilidad completa del sistema para operaciones 24/7
**Criterio de Medición**: MTTD (Mean Time To Detection) < 2 minutes para issues críticos

| Monitoring Layer   | Tools                | Metrics              | Alerting       |
| ------------------ | -------------------- | -------------------- | -------------- |
| **Application**    | Prometheus + Grafana | Business KPIs + SLIs | PagerDuty      |
| **Infrastructure** | New Relic APM        | Resource utilization | Slack warnings |
| **Security**       | Splunk SIEM          | Security events      | SOC alerts     |
| **Business**       | Custom dashboard     | Conversion rates     | Email reports  |

**Key Monitoring Metrics**:

```yaml
Golden Signals:
  - Latency: Response time percentiles
  - Traffic: Requests per second
  - Errors: Error rate and types
  - Saturation: Resource utilization

Business Metrics:
  - Verification success rate
  - User abandonment rate
  - Cost per verification
  - Revenue impact of downtime

Security Metrics:
  - Failed authentication attempts
  - Suspicious activity patterns
  - Compliance violations
  - Certificate expiration alerts
```

### NFR-007.2: Troubleshooting y Debugging

**Requirement**: Capacidad de diagnóstico rápido para minimizar MTTR
**Criterio de Medición**: MTTR < 30 minutes para incidentes P1

| Capability                | Implementation    | Target                  | Tools         |
| ------------------------- | ----------------- | ----------------------- | ------------- |
| **Distributed tracing**   | Jaeger            | 100% request coverage   | OpenTelemetry |
| **Log aggregation**       | ELK Stack         | <5s search response     | Elasticsearch |
| **Error tracking**        | Sentry            | Real-time error capture | Source maps   |
| **Performance profiling** | pprof integration | On-demand profiling     | Grafana       |

---

## Validation y Testing NFRs

### Performance Testing Strategy

```yaml
Load Testing (k6):
  - Baseline: 200 concurrent users, 30 minutes
  - Stress: 750 concurrent users, 15 minutes
  - Spike: 0→500→0 users, 10 minutes
  - Volume: 24-hour endurance test

Security Testing:
  - Penetration testing: Quarterly by certified team
  - Vulnerability scanning: Weekly automated (OWASP ZAP)
  - Biometric spoofing tests: Monthly with new attack vectors
  - Compliance audit: Annual third-party assessment
```

### NFR Acceptance Criteria

- **Definition of Done**: All NFRs must pass acceptance testing
- **Performance gates**: No deployment if P95 > SLA thresholds
- **Security gates**: Zero Critical/High vulnerabilities in production
- **Compliance gates**: 100% audit checklist completion

---

**NFR Owner Matrix**:

- **Performance**: Platform Engineering Team
- **Security**: Information Security Officer
- **Compliance**: Data Protection Officer + Legal
- **Integration**: Enterprise Architecture Team
- **Monitoring**: Site Reliability Engineering

**Review Cycle**: Monthly NFR health check + quarterly deep review
