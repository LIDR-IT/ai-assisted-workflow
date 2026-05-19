# Template: Architecture Document

> **Propósito**: Documentación completa de la arquitectura técnica del proyecto.
> **Cuándo se crea**: Fase 2 — Discovery (después del PRD Técnico) y se mantiene vivo durante todo el proyecto.
> **Quién lo llena**: Tech Lead / R&D con asistencia de skill `architecture-doc`
> **Quién lo valida**: R&D Lead + Security (compliance) + DevOps (infra)
> **Gate asociado**: Gate 1 (versión inicial) → actualizado en cada Gate
> **Instancias**: `docs/projects/{proyecto}/architecture.md`
> **Complementa**: `db-schema.md`, `specs/routes.md`, `specs/components.md`, `specs/storage.md`

---

## Secciones del Documento

### 1. Resumen de Arquitectura

```markdown
## Resumen de Arquitectura

**Patrón arquitectónico**: {Monolito / Microservicios / Modular monolith / Serverless / Híbrido}
**Estilo de comunicación**: {REST / GraphQL / gRPC / Event-driven / Mixto}
**Estrategia de despliegue**: {Containers / Serverless / VMs / Hybrid}

### Diagrama de Alto Nivel

{Diagrama C4 Level 1 — Context Diagram}
{Descripción textual si no hay diagrama visual}

### Principios Arquitectónicos

| #   | Principio                    | Justificación                    |
| --- | ---------------------------- | -------------------------------- |
| 1   | {ej: Separation of concerns} | {por qué aplica a este proyecto} |
| 2   | {ej: API-first}              |                                  |
| 3   | {ej: Security by design}     |                                  |
```

### 2. Tech Stack

```markdown
## Tech Stack

### Core

| Categoría     | Tecnología | Versión | Justificación | Alternativa Descartada |
| ------------- | ---------- | ------- | ------------- | ---------------------- |
| Lenguaje      |            |         |               |                        |
| Framework     |            |         |               |                        |
| Base de datos |            |         |               |                        |
| Cache         |            |         |               |                        |
| Message Queue |            |         |               |                        |

### Frontend

| Tecnología | Versión | Uso |
| ---------- | ------- | --- |
|            |         |     |

### Backend

| Tecnología | Versión | Uso |
| ---------- | ------- | --- |
|            |         |     |

### Infraestructura

| Servicio | Proveedor             | Tier/Config | Uso |
| -------- | --------------------- | ----------- | --- |
|          | AWS/GCP/Azure/On-prem |             |     |

### DevOps / CI-CD

| Herramienta | Uso              |
| ----------- | ---------------- |
|             | Pipeline CI/CD   |
|             | Containerización |
|             | Orquestación     |
|             | Monitoreo        |
|             | Log management   |
```

### 3. Estructura del Proyecto

```markdown
## Estructura del Proyecto

### Directorios Principales

{Árbol de directorios con descripción de cada carpeta clave}

### Convenciones de Código

| Convención            | Estándar | Ejemplo                     |
| --------------------- | -------- | --------------------------- |
| Naming (archivos)     |          | `user-service.ts`           |
| Naming (clases)       |          | `UserService`               |
| Naming (funciones)    |          | `getUserById`               |
| Naming (DB tables)    |          | `user_sessions`             |
| Exports               |          | Named vs default            |
| Estructura de módulos |          | Feature-based / Layer-based |

### Patrones de Diseño Usados

| Patrón     | Dónde se usa   | Por qué                |
| ---------- | -------------- | ---------------------- |
| Repository | Data layer     | Abstracción de DB      |
| Service    | Business logic | Separación de concerns |
|            |                |                        |
```

### 4. Dependencias Externas

```markdown
## Dependencias

### Servicios Externos (APIs de terceros)

| Servicio | Proveedor | Uso | SLA   | Fallback          |
| -------- | --------- | --- | ----- | ----------------- |
|          |           |     | 99.X% | {qué pasa si cae} |

### Paquetes Clave (npm/pip/etc)

| Paquete | Versión | Licencia       | Uso | Riesgo          |
| ------- | ------- | -------------- | --- | --------------- |
|         |         | MIT/Apache/etc |     | Bajo/Medio/Alto |

### Dependencias Internas (otros equipos/servicios)

| Equipo/Servicio | Interfaz         | Contrato         | Estado                |
| --------------- | ---------------- | ---------------- | --------------------- |
|                 | API/SDK/SharedDB | OpenAPI spec ref | Estable/En desarrollo |
```

### 5. Seguridad

```markdown
## Seguridad Arquitectónica

### Modelo de Autenticación

{Descripción: JWT / OAuth2 / SAML / API Keys / Mixto}

### Modelo de Autorización

{RBAC / ABAC / Policy-based — roles y permisos}

### Cifrado

| Dato         | En Tránsito    | En Reposo     | Key Management |
| ------------ | -------------- | ------------- | -------------- |
| Credenciales | TLS 1.3        | bcrypt/argon2 | N/A            |
| PII          | TLS 1.3        | AES-256       | KMS            |
| Biométricos  | TLS 1.3 + mTLS | AES-256-GCM   | KMS + rotation |

### Superficie de Ataque

| Superficie      | Mitigación                               |
| --------------- | ---------------------------------------- |
| APIs públicas   | Rate limiting, input validation, CORS    |
| Admin endpoints | MFA, IP allowlist, audit log             |
| DB              | Network isolation, encrypted connections |
```

### 6. Performance y Escalabilidad

```markdown
## Performance

### SLAs/SLOs

| Métrica        | Target   | Medición       |
| -------------- | -------- | -------------- |
| Disponibilidad | 99.X%    | Uptime monitor |
| Latencia P50   | ≤Xms     | APM            |
| Latencia P95   | ≤Xms     | APM            |
| Throughput     | ≥X req/s | Load test      |

### Estrategia de Escalabilidad

{Horizontal / Vertical / Auto-scaling — descripción}

### Caching Strategy

| Nivel     | Tecnología | TTL | Invalidación |
| --------- | ---------- | --- | ------------ |
| CDN       |            |     |              |
| App cache | Redis      |     |              |
| DB cache  |            |     |              |
```

### 7. Observabilidad

```markdown
## Observabilidad

### Logging

| Nivel | Qué se loggea                       | Herramienta |
| ----- | ----------------------------------- | ----------- |
| ERROR | Excepciones, fallos de servicio     |             |
| WARN  | Degradación, retries, rate limits   |             |
| INFO  | Operaciones de negocio, auth events |             |
| DEBUG | Solo en dev/staging                 |             |

### Métricas

| Tipo     | Ejemplos                               | Herramienta |
| -------- | -------------------------------------- | ----------- |
| Infra    | CPU, memory, disk, network             |             |
| App      | Request rate, error rate, latency      |             |
| Business | Conversión, enrolamiento, auth success |             |

### Tracing

{Distributed tracing strategy — trace ID propagation}

### Alertas

| Alerta          | Condición        | Severidad | Acción       |
| --------------- | ---------------- | --------- | ------------ |
| High error rate | >5% in 5min      | P1        | Page on-call |
| High latency    | P95 >2x baseline | P2        | Notify team  |
```

---

## Criterios de Completitud

| Sección                        | Obligatorio | Criterio                              |
| ------------------------------ | ----------- | ------------------------------------- |
| Patrón arquitectónico definido | Sí          | Con justificación                     |
| Tech stack completo            | Sí          | Todas las categorías cubiertas        |
| Estructura de proyecto         | Sí          | Árbol + convenciones                  |
| Dependencias documentadas      | Sí          | Externas + internas con SLA/fallback  |
| Modelo de seguridad            | Sí          | Auth + cifrado + superficie de ataque |
| SLAs definidos                 | Sí          | ≥3 métricas con target                |
| Observabilidad configurada     | Sí          | Logs + métricas + alertas             |
| ADRs para decisiones clave     | Sí          | ≥1 ADR para elección de stack         |

---

## Skills que Asisten

- **Generación**: Skill `architecture-doc` genera borrador completo
- **ADRs**: Skill `adr` para decisiones específicas
- **Seguridad**: Skills `security-checklist`, `vuln-assessment`
- **Deployment**: Template `docs/templates/deployment.md` (complementario)
- **DB detalle**: Template `docs/templates/db-schema.md` (complementario)
- **Specs detalle**: Templates en `docs/templates/specs/` (complementarios)
- **Validación**: `/validate-project-docs`

---

_Template — instancia en `docs/projects/{proyecto}/architecture.md`. Se actualiza cada sprint si hay cambios arquitectónicos._
