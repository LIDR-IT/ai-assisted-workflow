# Template: Database Schema

> **Propósito**: Documentación del modelo de datos, relaciones, migraciones, y políticas de acceso.
> **Cuándo se crea**: Fase 2-3 — Después del PRD Técnico, antes de Sprint Planning
> **Quién lo llena**: Tech Lead / Backend Dev con skill `architecture-doc`
> **Quién lo valida**: R&D Lead + Security (datos sensibles)
> **Instancias**: `docs/projects/{proyecto}/db-schema.md`
> **Complementa**: `architecture.md` (sección DB)

---

## Secciones del Documento

### 1. Overview

```markdown
## Overview

**Motor de base de datos**: {PostgreSQL / MySQL / MongoDB / DynamoDB / etc}
**Versión**: {ej: PostgreSQL 15.4}
**ORM/Query builder**: {ej: Prisma / TypeORM / Drizzle / raw SQL}
**Estrategia de migraciones**: {ej: Prisma Migrate / Flyway / manual}
**Naming convention**: {snake_case / camelCase / PascalCase}
```

### 2. Diagrama Entidad-Relación

```markdown
## ER Diagram

{Diagrama ER — herramienta recomendada: dbdiagram.io, Mermaid, o DrawSQL}
{Si no hay diagrama visual, tabla de relaciones abajo}

### Relaciones Principales

| Entidad A | Relación | Entidad B          | Cardinalidad | FK                          |
| --------- | -------- | ------------------ | ------------ | --------------------------- |
| users     | has_many | sessions           | 1:N          | sessions.user_id            |
| users     | has_one  | biometric_template | 1:1          | biometric_templates.user_id |
|           |          |                    |              |                             |
```

### 3. Tablas / Colecciones

```markdown
## Tablas

### {nombre_tabla}

**Propósito**: {qué almacena y por qué existe}
**Estimación de volumen**: {N registros/mes, crecimiento esperado}

| Columna    | Tipo          | Nullable | Default           | Índice               | Descripción         |
| ---------- | ------------- | -------- | ----------------- | -------------------- | ------------------- |
| id         | UUID / SERIAL | No       | gen_random_uuid() | PK                   | Identificador único |
| created_at | TIMESTAMP     | No       | NOW()             | IDX                  | Fecha de creación   |
| updated_at | TIMESTAMP     | No       | NOW()             | —                    | Última modificación |
| deleted_at | TIMESTAMP     | Sí       | NULL              | IDX                  | Soft delete         |
| {campo}    | {tipo}        | {sí/no}  | {default}         | {PK/FK/IDX/UNIQUE/—} | {descripción}       |

**Constraints**:

- UNIQUE: {campos}
- CHECK: {condiciones}
- FK: {campo} → {tabla.campo} ON DELETE {CASCADE/SET NULL/RESTRICT}

**Índices**:
| Nombre | Columnas | Tipo | Justificación |
|--------|---------|------|---------------|
| idx*{tabla}*{campo} | {campos} | BTREE/GIN/GIST | {query que optimiza} |
```

### 4. Migraciones

```markdown
## Estrategia de Migraciones

### Convenciones

| Aspecto             | Estándar                                           |
| ------------------- | -------------------------------------------------- |
| Formato de nombre   | {YYYYMMDD*HHMMSS}*{descripcion}                    |
| Backward compatible | Obligatorio — nunca romper versión anterior        |
| Rollback            | Toda migración tiene down() / rollback             |
| Data migrations     | Separadas de schema migrations                     |
| Ejecución           | Automática en CI/CD pipeline, manual en emergencia |

### Historial de Migraciones

| #   | Fecha      | Migración | Descripción | Reversible |
| --- | ---------- | --------- | ----------- | ---------- |
| 1   | YYYY-MM-DD | {nombre}  | {qué hace}  | Sí/No      |
```

### 5. Datos Sensibles y Compliance

```markdown
## Datos Sensibles

### Clasificación de Datos

| Categoría   | Tablas/Campos           | Nivel de Sensibilidad | Tratamiento                           |
| ----------- | ----------------------- | --------------------- | ------------------------------------- |
| PII         | users.email, users.name | Alto                  | Cifrado en reposo, masking en logs    |
| Biométricos | biometric_templates.\*  | Muy Alto              | AES-256-GCM, key rotation, GDPR Art.9 |
| Financieros | transactions.\*         | Alto                  | Cifrado, audit trail                  |
| Técnicos    | sessions.token          | Medio                 | Hashing, TTL                          |

### Políticas de Retención

| Dato             | Retención              | Política de Eliminación         |
| ---------------- | ---------------------- | ------------------------------- |
| Datos de usuario | Mientras cuenta activa | Hard delete tras solicitud GDPR |
| Logs de acceso   | 90 días                | Auto-purge                      |
| Backups          | 30 días                | Rotación automática             |

### Acceso a Datos

| Rol         | Tablas Accesibles      | Operaciones | Justificación      |
| ----------- | ---------------------- | ----------- | ------------------ |
| App service | Todas                  | CRUD        | Operación normal   |
| Analytics   | users (masked), events | SELECT      | Reporting          |
| Support     | users, tickets         | SELECT      | Soporte al cliente |
```

### 6. Seeding y Datos de Prueba

```markdown
## Seed Data

### Datos de Desarrollo

| Tabla | Registros de seed     | Notas                           |
| ----- | --------------------- | ------------------------------- |
| users | 10 usuarios de prueba | Roles variados, datos ficticios |
|       |                       |                                 |

### Datos de Testing

| Escenario  | Datos necesarios                | Cómo generarlos |
| ---------- | ------------------------------- | --------------- |
| Happy path | Usuario con template biométrico | Seed + fixture  |
| Edge case  | Usuario sin email verificado    | Seed especial   |
```

---

## Criterios de Completitud

| Criterio                           | Obligatorio | Validación        |
| ---------------------------------- | ----------- | ----------------- |
| Motor y versión definidos          | Sí          | Automática        |
| Todas las tablas documentadas      | Sí          | Cruzar con código |
| Relaciones con cardinalidad        | Sí          | Automática        |
| Datos sensibles clasificados       | Sí          | Manual (Security) |
| Política de retención para PII     | Sí          | Manual (Legal)    |
| Estrategia de migraciones definida | Sí          | Automática        |
| Índices justificados por queries   | Sí          | Semi-auto         |
| Seed data para dev/test            | Sí          | Automática        |

---

## Skills que Asisten

- **Generación**: Skill `architecture-doc` (subfaceta DB) genera desde código + ORM
- **Validación**: `/validate-project-docs` verifica completitud
- **Complementa**: `docs/templates/architecture.md`, `docs/templates/specs/storage.md`

---

_Template — instancia en `docs/projects/{proyecto}/db-schema.md`_
