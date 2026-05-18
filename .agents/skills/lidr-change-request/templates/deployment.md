---
id: deployment-template
version: "1.0.0"
last_updated: "2026-03-16"
updated_by: "System: Template Migration"
status: active
type: template
review_cycle: 60
next_review: "2026-05-15"
owner_role: "DevOps"
---

# Template: Deployment Guide

> **Propósito**: Guía completa de despliegue — entornos, variables, pipeline, verificación, y rollback.
> **Cuándo se crea**: Fase 5 — Desarrollo (primera iteración), actualizado antes de cada deploy
> **Quién lo llena**: DevOps + Tech Lead con skills `rollback-plan` + `change-request`
> **Gate asociado**: Gate Final — Release a PROD
> **Instancias**: `docs/projects/{proyecto}/deployment.md`

---

## Secciones del Documento

### 1. Entornos

```markdown
## Entornos

| Entorno        | URL          | Propósito              | Quién accede      | Deploy trigger      |
| -------------- | ------------ | ---------------------- | ----------------- | ------------------- |
| Development    | dev.{domain} | Desarrollo activo      | Devs              | Push to develop     |
| Staging        | stg.{domain} | Testing QA             | QA + Devs         | PR merge to staging |
| UAT            | uat.{domain} | User Acceptance        | PO + Stakeholders | Manual / Scheduled  |
| Pre-production | pre.{domain} | Security + Performance | Security + DevOps | Manual              |
| Production     | {domain}     | Usuarios finales       | Todos             | Manual + Approval   |

### Diferencias entre Entornos

| Aspecto        | Dev       | Staging     | UAT             | Pre-prod          | Prod              |
| -------------- | --------- | ----------- | --------------- | ----------------- | ----------------- |
| Data           | Seed/mock | Seed + test | Anonymized prod | Anonymized prod   | Real              |
| 3rd party APIs | Sandbox   | Sandbox     | Sandbox         | Real              | Real              |
| Feature flags  | All ON    | Selective   | Selective       | Production config | Production config |
| Logging level  | DEBUG     | INFO        | INFO            | WARN              | WARN              |
| Scale          | Min       | Min         | Min             | Prod-like         | Full              |
```

### 2. Variables de Entorno

```markdown
## Variables de Entorno

### Obligatorias (app no arranca sin ellas)

| Variable     | Tipo   | Ejemplo              | Secret | Descripción          |
| ------------ | ------ | -------------------- | ------ | -------------------- |
| DATABASE_URL | String | postgres://...       | Sí     | Conexión a DB        |
| JWT_SECRET   | String | {256-bit key}        | Sí     | Firma de JWT tokens  |
| NODE_ENV     | Enum   | production           | No     | Entorno de ejecución |
| PORT         | Number | 3000                 | No     | Puerto de la app     |
| API_BASE_URL | URL    | https://api.{domain} | No     | Base URL de la API   |

### Opcionales (tienen defaults seguros)

| Variable       | Tipo   | Default | Secret | Descripción              |
| -------------- | ------ | ------- | ------ | ------------------------ |
| LOG_LEVEL      | Enum   | info    | No     | Nivel de logging         |
| CACHE_TTL      | Number | 3600    | No     | TTL de cache en segundos |
| RATE_LIMIT_MAX | Number | 100     | No     | Max requests por ventana |

### Secrets Management

| Secret               | Ubicación                   | Rotación      | Responsable |
| -------------------- | --------------------------- | ------------- | ----------- |
| DATABASE_URL         | AWS Secrets Manager / Vault | 90 días       | DevOps      |
| JWT_SECRET           | AWS Secrets Manager / Vault | 90 días       | DevOps      |
| API_KEYS (3rd party) | AWS Secrets Manager / Vault | Por proveedor | DevOps      |

### Validación de Env Vars

{Script o mecanismo que valida presencia de vars obligatorias al arranque}
```

### 3. Pipeline CI/CD

```markdown
## Pipeline

### Stages

| Stage             | Trigger             | Acciones                           | Bloqueante           |
| ----------------- | ------------------- | ---------------------------------- | -------------------- |
| Lint              | Push                | ESLint, Prettier, TypeScript check | Sí                   |
| Test              | Push                | Unit tests, coverage ≥80%          | Sí                   |
| Build             | Push                | Build artefacto                    | Sí                   |
| SAST              | Push                | SonarQube scan                     | Sí (0 Critical/High) |
| SCA               | Push                | Dependency check                   | Sí (0 Critical/High) |
| Deploy staging    | Merge to staging    | Deploy automático                  | No                   |
| DAST              | Post-deploy staging | OWASP ZAP scan                     | Sí para release      |
| Deploy production | Manual + Approval   | Deploy con approval gate           | Sí                   |

### Artefactos

| Artefacto    | Formato      | Registry              | Retención |
| ------------ | ------------ | --------------------- | --------- |
| Docker image | OCI          | ECR / GCR / DockerHub | 90 días   |
| Build output | ZIP / tar.gz | S3 / GCS              | 30 días   |
```

### 4. Proceso de Deploy a Producción

```markdown
## Deploy a Producción

### Pre-deploy Checklist

- [ ] QA Sign-off obtenido (Gate 5)
- [ ] Security Sign-off obtenido (Gate 6)
- [ ] Change Request aprobado por Comité de Cambios
- [ ] Release notes generadas (/create-release-notes)
- [ ] Rollback plan documentado
- [ ] On-call confirmado y disponible
- [ ] Ventana de deploy acordada

### Pasos de Deploy

1. **Tag release**: `git tag v{X.Y.Z}` + push
2. **Build**: Pipeline genera artefacto desde tag
3. **Deploy pre-prod**: Verificar en pre-producción
4. **Smoke tests pre-prod**: Ejecutar post-deploy checklist
5. **Approval gate**: Tech Lead + DevOps aprueban
6. **Deploy producción**: Pipeline ejecuta deploy
7. **Smoke tests prod**: Ejecutar post-deploy checklist
8. **Monitoreo 24h**: Seguimiento según post-deploy checklist

### Estrategia de Deploy

| Estrategia     | Descripción                                | Cuándo usar                 |
| -------------- | ------------------------------------------ | --------------------------- |
| Rolling update | Pods reemplazados gradualmente             | Default para la mayoría     |
| Blue/Green     | Nuevo entorno completo, switch de tráfico  | Cambios de DB o alto riesgo |
| Canary         | % de tráfico al nuevo, monitorear, escalar | Features de alto impacto    |
```

### 5. Rollback

```markdown
## Rollback

### Triggers de Rollback Automático

| Condición                          | Acción              |
| ---------------------------------- | ------------------- |
| Health check falla 3x consecutivas | Rollback automático |
| Error rate >5% en 5 min            | Rollback automático |
| Alerta P1 en primeros 30 min       | Rollback automático |

### Procedimiento de Rollback Manual

1. Confirmar necesidad de rollback (Tech Lead + DevOps)
2. Ejecutar: `{comando de rollback — ej: kubectl rollout undo}`
3. Verificar rollback exitoso (re-ejecutar smoke tests)
4. Si hay migración de DB: ejecutar rollback migration
5. Notificar equipo en #incidents
6. Crear incident ticket
7. Programar postmortem si aplica

### Rollback de Base de Datos

| Escenario                | Estrategia                                 |
| ------------------------ | ------------------------------------------ |
| Schema change (additive) | No requiere rollback — backward compatible |
| Schema change (breaking) | Run down migration → verify data integrity |
| Data migration           | Restore from backup punto de partida       |
| Seed data change         | Re-run previous seed                       |
```

### 6. Verificación Post-Deploy

```markdown
## Verificación

### Quick Verification (2 min)

1. Health endpoint: `curl https://{domain}/health`
2. Auth flow: Login → token → protected endpoint
3. Dashboards: APM muestra tráfico normal
4. Logs: No errores nuevos en últimos 5 min

### Automated Smoke Test Suite

{Referencia al script/suite de smoke tests — ej: `scripts/smoke-test.sh`}
```

---

## Criterios de Completitud

| Criterio                                 | Obligatorio | Validación        |
| ---------------------------------------- | ----------- | ----------------- |
| Todos los entornos documentados          | Sí          | Automática        |
| Todas las env vars obligatorias listadas | Sí          | Cruzar con código |
| Secrets en vault (no hardcoded)          | Sí          | Automática (SAST) |
| Pipeline stages definidos                | Sí          | Automática        |
| Proceso de deploy paso a paso            | Sí          | Manual            |
| Rollback documentado (auto + manual)     | Sí          | Manual            |
| Post-deploy verification definida        | Sí          | Automática        |

---

## Skills que Asisten

- **Rollback**: Skill `rollback-plan` genera plan de rollback detallado
- **Change Request**: Skill `change-request` genera CR para Comité
- **Release Notes**: Command `/create-release-notes`
- **Validación**: `/validate-project-docs`

---

_Template — instancia en `docs/projects/{proyecto}/deployment.md`_
