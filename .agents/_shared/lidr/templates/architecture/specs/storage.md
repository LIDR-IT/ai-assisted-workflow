# Template: Storage Specification

> **Propósito**: Documentación de estrategia de almacenamiento — archivos, cache, state management, y persistencia.
> **Quién lo llena**: Tech Lead / Backend Lead con skill `architecture-doc`
> **Instancias**: `docs/projects/{proyecto}/specs/storage.md`
> **Complementa**: `db-schema.md` (datos relacionales), `architecture.md` (visión general)

---

## 1. File Storage

```markdown
## File Storage

### Estrategia

| Tipo de archivo         | Storage                     | Acceso              | Retención              | Límites  |
| ----------------------- | --------------------------- | ------------------- | ---------------------- | -------- |
| User uploads (imágenes) | S3 / GCS / Azure Blob       | Signed URLs (15min) | Mientras cuenta activa | 10MB max |
| Documentos generados    | S3 / GCS                    | Signed URLs         | 90 días                | 50MB max |
| Assets estáticos        | CDN (CloudFront/CloudFlare) | Público             | Indefinido             | —        |
| Backups DB              | S3 (encrypted)              | Interno             | 30 días rotación       | —        |
| Logs                    | CloudWatch / ELK / S3       | Interno             | 90 días                | —        |

### Convenciones de Naming

| Tipo           | Patrón                                  | Ejemplo                               |
| -------------- | --------------------------------------- | ------------------------------------- |
| User uploads   | `{userId}/{type}/{uuid}.{ext}`          | `abc123/avatar/550e8400.jpg`          |
| Generated docs | `{projectId}/reports/{date}/{name}.pdf` | `proj1/reports/2025-03/qa-report.pdf` |

### Seguridad

| Aspecto             | Implementación                           |
| ------------------- | ---------------------------------------- |
| Cifrado en reposo   | SSE-S3 / SSE-KMS                         |
| Cifrado en tránsito | HTTPS obligatorio                        |
| Control de acceso   | IAM policies + signed URLs               |
| Antivirus           | Scan on upload (ClamAV / AWS GuardDuty)  |
| Datos sensibles     | Bucket separado, encryption key separada |
```

## 2. Cache Strategy

```markdown
## Cache

### Capas de Cache

| Capa        | Tecnología            | TTL Default | Invalidación          | Uso                     |
| ----------- | --------------------- | ----------- | --------------------- | ----------------------- |
| CDN         | CloudFront/CloudFlare | 24h         | Purge on deploy       | Assets estáticos        |
| Application | Redis / Memcached     | 1h          | Explicit invalidation | API responses, sessions |
| Database    | Query cache (PG)      | —           | Automatic             | Queries frecuentes      |
| Browser     | Cache-Control headers | Varies      | Versioned URLs        | Assets, API responses   |

### Cache Keys

| Recurso      | Key Pattern                     | TTL   | Invalidate when      |
| ------------ | ------------------------------- | ----- | -------------------- |
| User profile | `user:{userId}:profile`         | 15min | User updates profile |
| List results | `{resource}:list:{hash(query)}` | 5min  | Any CRUD on resource |
| Config       | `config:{key}`                  | 1h    | Admin changes config |

### Cache-Control Headers

| Recurso        | Header                                | Motivo                      |
| -------------- | ------------------------------------- | --------------------------- |
| HTML pages     | `no-cache`                            | Siempre fresh               |
| API responses  | `private, max-age=0`                  | No cachear en shared caches |
| Static assets  | `public, max-age=31536000, immutable` | Versionados por hash        |
| Sensitive data | `no-store`                            | Nunca cachear               |
```

## 3. State Management (Frontend)

```markdown
## State Management

### Estrategia

| Tipo de Estado | Herramienta                   | Persistencia         | Ejemplo                   |
| -------------- | ----------------------------- | -------------------- | ------------------------- |
| Server state   | React Query / SWR / tRPC      | Cache + Revalidation | Datos de API              |
| Client state   | Zustand / Context / useState  | Memoria (session)    | UI state, modals          |
| Form state     | React Hook Form / Formik      | Memoria              | Formularios               |
| URL state      | React Router                  | URL params           | Filtros, paginación, tabs |
| Persistent     | localStorage / sessionStorage | Browser              | Theme, preferences        |
| Auth           | httpOnly cookies + memory     | Cookie + memory      | Session token             |

### Convenciones

| Regla                                  | Detalle                                   |
| -------------------------------------- | ----------------------------------------- |
| Server state → siempre React Query/SWR | No guardar API responses en estado global |
| UI state → local primero               | useState antes que Zustand/Context        |
| URL state para filtros/paginación      | Compartible y bookmarkeable               |
| No PII en localStorage                 | Tokens solo en httpOnly cookies           |
```

## 4. Queues / Background Jobs (si aplica)

```markdown
## Background Processing

| Queue/Job            | Tecnología   | Trigger            | Retries        | Timeout | Dead Letter          |
| -------------------- | ------------ | ------------------ | -------------- | ------- | -------------------- |
| Email sending        | SQS / BullMQ | User action        | 3x exp backoff | 30s     | DLQ → alert          |
| Report generation    | SQS / BullMQ | Scheduled / Manual | 2x             | 5min    | DLQ → alert          |
| Biometric processing | SQS / BullMQ | API call           | 3x             | 60s     | DLQ → alert + manual |
```

---

## Criterios de Completitud

| Criterio                                | Obligatorio         |
| --------------------------------------- | ------------------- |
| File storage strategy definida          | Sí (si hay uploads) |
| Cache strategy con capas y TTLs         | Sí                  |
| State management definido (frontend)    | Sí                  |
| Datos sensibles con cifrado documentado | Sí                  |
| Cache invalidation strategy             | Sí                  |

---

_Template — instancia en `docs/projects/{proyecto}/specs/storage.md`_
