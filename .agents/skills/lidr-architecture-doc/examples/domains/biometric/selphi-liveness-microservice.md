# Selphi Liveness Detection Microservice - Architecture

> **Proyecto**: BIOM-2024-03-LIV
> **Versión**: 2.1.0
> **Fecha**: 2024-03-15
> **Arquitecto**: R&D Lead - María González

## 1. Introducción y Metas

### 1.1 Requerimientos

El servicio Selphi Liveness debe procesar verificaciones de liveness detection con:

- **Latencia**: < 2 segundos P95
- **Throughput**: 1000 verificaciones/minuto
- **Disponibilidad**: 99.9% uptime
- **Compliance**: GDPR, ISO 30107 (PAD)

### 1.2 Arquitectura de Calidad

- **Performance**: Procesamiento en paralelo, cache L2
- **Security**: Templates cifrados, audit trail completo
- **Scalability**: Auto-scaling basado en CPU y cola
- **Observability**: Métricas por algoritmo, distributed tracing

## 2. Restricciones Arquitectónicas

### 2.1 Restricciones Técnicas

- **Runtime**: Python 3.11+ para algoritmos ML
- **Hardware**: GPUs NVIDIA requeridas para deep learning
- **Memoria**: 16GB RAM mínimo por instancia
- **Storage**: Redis para cache, PostgreSQL para audit

### 2.2 Restricciones de Negocio

- **Datos biométricos**: NUNCA persistir imágenes originales
- **Templates**: AES-256 encryption at rest
- **Logs**: Sin PII, solo IDs de sesión y métricas
- **Compliance**: DPIA para nuevos algoritmos

## 3. Vista de Contexto (C4 Nivel 1)

```
[Cliente App] --> [API Gateway] --> [Selphi Service]
                                      |
                                      v
[Liveness Engine] <--> [Template Store] <--> [Audit DB]
    |                      |                     |
    v                      v                     v
[GPU Cluster]         [Redis Cache]        [PostgreSQL]
```

### 3.1 Actores Externos

- **Cliente Móvil**: Apps iOS/Android con cámara
- **Web Apps**: Progressive Web Apps con WebRTC
- **Partner APIs**: Integraciones bancarias vía REST

### 3.2 Sistemas Externos

- **Identity Provider**: Keycloak para autenticación
- **Monitoring**: Datadog APM y custom metrics
- **Notification**: Webhook callbacks a clientes

## 4. Vista de Contenedores (C4 Nivel 2)

### 4.1 Selphi Liveness Service

```yaml
Technology: Python FastAPI + Docker
Responsibility:
  - Recibir request de liveness detection
  - Coordinar procesamiento ML
  - Devolver resultado + confidence score
Dependencies:
  - Liveness Engine (internal)
  - Template Cache (Redis)
  - Audit Service (async)
```

### 4.2 Liveness Engine

```yaml
Technology: Python + PyTorch + CUDA
Responsibility:
  - Ejecutar algoritmos 3D liveness
  - Detectar presentation attacks (fotos, videos, máscaras)
  - Generar confidence scores
Dependencies:
  - GPU Hardware
  - ML Model Store
```

### 4.3 Template Cache

```yaml
Technology: Redis Cluster
Responsibility:
  - Cache de templates frecuentemente consultados
  - Session state temporal
  - Rate limiting por usuario
TTL: 30 minutos para templates, 5 minutos para sessions
```

## 5. Vista de Componentes (C4 Nivel 3)

### 5.1 API Layer

```python
# Componentes principales
ControllerLiveness
├── BiometricValidator (input sanitization)
├── SessionManager (tracking, rate limiting)
├── LivenessOrchestrator (workflow coordination)
└── ResponseFormatter (output standardization)
```

### 5.2 Business Logic

```python
LivenessOrchestrator
├── FaceDetector (localizar rostro en imagen)
├── QualityAnalyzer (blur, lighting, resolution)
├── LivenessAnalyzer (3D detection, eye movement, texture)
├── SpoofDetector (presentation attack detection)
└── ConfidenceScorer (combine scores, thresholds)
```

### 5.3 Infrastructure Layer

```python
Infrastructure
├── TemplateRepository (encrypted storage interface)
├── AuditLogger (compliance logging)
├── MetricsCollector (Prometheus metrics)
├── GPUResourceManager (allocation, monitoring)
└── CacheManager (Redis operations)
```

## 6. Vista de Despliegue

### 6.1 Entornos

```yaml
Development:
  - Docker Compose local
  - CPU-only inference (dev models)
  - SQLite for quick testing

Staging:
  - Kubernetes cluster
  - 1x GPU node (NVIDIA T4)
  - Redis single instance
  - PostgreSQL managed service

Production:
  - Kubernetes cluster multi-AZ
  - 3x GPU nodes (NVIDIA V100) + auto-scaling
  - Redis cluster (3 masters, 3 replicas)
  - PostgreSQL managed HA cluster
```

### 6.2 Networking

```
Internet --> ALB --> K8s Ingress --> Selphi Service
                                        |
GPU Nodes <-- Internal LB <-- Service Mesh (Istio)
   |
   v
Storage: EBS encrypted volumes + Redis Cluster
```

## 7. Decisiones Arquitectónicas Clave

### ADR-001: PyTorch sobre TensorFlow

- **Decision**: Usar PyTorch para modelos de liveness
- **Rationale**: Mejor support para dynamic graphs, comunidad más activa para face analysis
- **Consequences**: Team necesita upskilling, pero mayor flexibilidad para research

### ADR-002: Sync vs Async Processing

- **Decision**: API síncrona para liveness (< 2s), async para training
- **Rationale**: UX requiere feedback inmediato, training puede ser batch
- **Consequences**: Necesidad de GPU dimensioning para peak load

### ADR-003: Template Encryption Strategy

- **Decision**: AES-256 + key rotation cada 90 días
- **Rationale**: GDPR compliance, SOC2 requirements
- **Consequences**: Overhead computacional 5-8%, worth the compliance

## 8. Riesgos y Deuda Técnica

### 8.1 Riesgos Técnicos

| Riesgo               | Probabilidad | Impacto | Mitigación                        |
| -------------------- | ------------ | ------- | --------------------------------- |
| GPU shortage en peak | Alto         | Alto    | Auto-scaling + cloud bursting     |
| Model accuracy drift | Medio        | Alto    | A/B testing + monitoring contínuo |
| Cache failures       | Bajo         | Medio   | Fallback a DB + circuit breaker   |

### 8.2 Deuda Técnica

- **Legacy model format**: Migrar de .pth a .onnx (Q2 2024)
- **Monolithic inference**: Separar en face detection + liveness (Q3 2024)
- **Manual GPU allocation**: Implementar dynamic resource allocation (Q4 2024)

## 9. Métricas de Arquitectura

### 9.1 Métricas Técnicas

```python
# Latency
liveness_processing_duration_ms
face_detection_duration_ms
gpu_inference_duration_ms

# Throughput
liveness_requests_per_minute
gpu_utilization_percent
cache_hit_ratio

# Quality
false_accept_rate (FAR)
false_reject_rate (FRR)
presentation_attack_detection_rate
```

### 9.2 Métricas de Negocio

```python
# Business Impact
successful_verifications_per_hour
client_integration_errors
compliance_audit_findings
cost_per_verification_usd
```

## 10. Plan de Evolución

### 10.1 Q2 2024: Performance Optimization

- Migrar a ONNX Runtime para inferencia
- Implementar model quantization (FP16)
- Cache warming inteligente

### 10.2 Q3 2024: Multi-Modal Fusion

- Integrar voice biometrics con liveness
- Behavioral analytics durante captura
- Cross-modal confidence scoring

### 10.3 Q4 2024: Edge Computing

- Deploy modelos lightweight en mobile
- Hybrid cloud-edge processing
- Offline liveness capability

---

**Aprobado por**: R&D Lead, Security Lead, DevOps Lead
**Fecha de revisión**: 2024-09-15
**Next review**: 2024-12-15
