---
id: dev-handoff-qa
version: "1.2.0"
last_updated: "2026-03-16"
updated_by: "Tech Lead: System"
status: active
phase: 5
owner_role: "TL"
automation: false
domain_agnostic: true
description: >
  Generate comprehensive Dev-to-QA handoff documentation when tickets transition to "Ready for QA" status.
  Domain-agnostic — works for any software development, platform, or application type.
  Use for seamless development-to-testing transitions and QA preparation with complete implementation context.
  Essential at Gate 4: enables QA to test without asking developers questions.
  Always use when marking tickets ready for testing, always use after PR merge or approved code review when completing User Story implementation.
  Do NOT use for post-QA deployment handoffs (use change-request), for production incidents (use postmortem), or for test case creation (use create-test-cases).
  Triggers on "generate handoff", "ready for QA", "handoff to QA", "pass to testing", "development complete", "transition to testing".
  Output in Spanish (functional description for QA), English (technical implementation details).
  Audience: QA (primary tester), QA Lead (validates completeness), Dev (reference for questions).
---

# Dev → QA Handoff Generator

Phase: 5→6 transition | Gate: contributes to Gate 5 | Language: Spanish (functional, not technical)

**Principle:** If QA needs to ask "how do I test this?" after reading the handoff, the handoff failed.

## Workflow

1. Read Jira ticket: US + BDD acceptance criteria + linked RF
2. Read PR diff to identify changes (endpoints, DB, config, components)
3. Generate handoff using template below
4. Identify regression areas from diff analysis
5. Attach to Jira ticket and transition to "Ready for QA"

## Input

| Input                           | Required  | Source                       |
| ------------------------------- | --------- | ---------------------------- |
| Jira ticket (US + BDD criteria) | ✅        | Manual or script             |
| PR with merged diff             | ✅        | Git CLI                      |
| DoD checklist completed         | ✅        | PR description               |
| Staging environment URL         | ✅        | DevOps                       |
| Test data                       | Desirable | Developer / QA shared folder |

## Output Template

ALWAYS use this structure:

```markdown
# Handoff Dev → QA: {PROJ-XXX} — {US Title}

| Campo            | Valor                               |
| ---------------- | ----------------------------------- |
| **Ticket**       | [{PROJ-XXX}]({url})                 |
| **RF Origen**    | RF-{PROJ}-{NNN}                     |
| **PR**           | [#{number}]({url}) — merged {date}  |
| **Entorno**      | [Staging URL] — deployed {datetime} |
| **Feature Flag** | {flag name = ON/OFF} or "Sin flag"  |

## 1. ¿Qué se Implementó?

### Descripción Funcional (USER language, not developer)

### Cambios Visibles (table: change, where, screenshot)

### Lo que NO se Implementó (explicit exclusions to avoid false bugs)

## 2. Cambios Técnicos Relevantes para QA

### Endpoints (Method, Path, Description, New/Modified)

### Base de Datos (Table, Change, Migration, QA Impact)

### Configuración (Variable, Staging Value, Notes)

### Dependencias Externas (Service, Status, Impact if down)

## 3. Cómo Probarlo

### Prerequisitos (verifiable checklist: env, user, data, flags, services)

### Flujo Principal — Happy Path (table: Step, Action, Data, Expected Result)

### Escenarios de Error (table: #, Scenario, How to Reproduce, Expected)

### Edge Cases (table: #, Case, How to Reproduce, Expected)

## 4. Datos de Prueba

### Test Documents/Files (table: File, Type, Purpose, Expected Result)

### Test Users (table: User, Password, Role, Status, Notes)

## 5. Áreas de Regresión

### Impact areas (table: Area, Why affected, Regression priority)

### Suggested Smoke Test (top 5 tests to run FIRST)

## 6. Riesgos y Limitaciones (table: Risk, Testing Impact, Workaround)

## 7. Screenshots / Demo (visual evidence of each key screen)
```

## Key Rules

- Write in USER language: "Se añadió POST /verify" → "Ahora el usuario puede subir un documento para verificar su identidad"
- Concrete data, not generic: "Subir una imagen válida" → "Subir `test-data/dni-valid-001.jpg`"
- Errors are first-class citizens: same detail level as happy path
- Explicit exclusions prevent false bug reports
- Prerequisites must be a verifiable checklist
- Analyze diff to suggest regression areas automatically

## Validation Checklist

- [ ] Functional description understandable without reading code?
- [ ] Test steps have concrete data (not "a valid value")?
- [ ] Each error scenario has reproduction steps + expected result?
- [ ] Prerequisites are a verifiable checklist?
- [ ] Regression areas identified from diff analysis?
- [ ] "Not implemented" section present?
- [ ] Config changes (env vars, flags) declared?

## Example Handoff: Document Verification with Authenticity Detection

### Realistic Complete Handoff Document

```markdown
# Handoff Dev → QA: FACE-456 — Implementar verificación de documentos con liveness

| Campo            | Valor                                                                                  |
| ---------------- | -------------------------------------------------------------------------------------- |
| **Ticket**       | [FACE-456](https://jira.example.com/browse/FACE-456)                                   |
| **RF Origen**    | RF-FACE-012                                                                            |
| **PR**           | [#1247](https://github.com/example-org/platform/pull/1247) — merged 2026-03-08 14:30   |
| **Entorno**      | [https://staging.example.com](https://staging.example.com) — deployed 2026-03-08 15:45 |
| **Feature Flag** | `LIVENESS_DETECTION_V2 = ON`                                                           |

## 1. ¿Qué se Implementó?

### Descripción Funcional

- **Nuevo flujo**: El usuario puede ahora verificar documentos de identidad con detección de vida automática
- **Validación mejorada**: El sistema detecta si el documento es real y si la persona está presente físicamente
- **Feedback visual**: Indicadores en tiempo real durante la captura (marcos verdes/rojos)
- **Resultados inmediatos**: Score de confianza y decisión accept/reject al finalizar

### Cambios Visibles

| Cambio                         | Dónde                            | Screenshot                                   |
| ------------------------------ | -------------------------------- | -------------------------------------------- |
| Botón "Verificar con Liveness" | Página principal de verificación | `test-screenshots/main-page-new-button.png`  |
| Cámara con overlay de guías    | Modal de captura                 | `test-screenshots/camera-overlay-guides.png` |
| Pantalla de resultados         | Al finalizar verificación        | `test-screenshots/results-screen.png`        |
| Indicador de progreso          | Durante procesamiento            | `test-screenshots/progress-indicator.png`    |

### Lo que NO se Implementó

- ❌ Soporte para documentos extranjeros (solo DNI/NIE español)
- ❌ Modo offline (requiere conexión a internet)
- ❌ Guardado automático de imágenes capturadas
- ❌ Integración con servicios de terceros (solo algoritmos propios)

## 2. Cambios Técnicos Relevantes para QA

### Endpoints

| Método | Path                                               | Descripción                                | Estado     |
| ------ | -------------------------------------------------- | ------------------------------------------ | ---------- |
| POST   | `/api/v1/verification/liveness`                    | Inicia sesión de verificación con liveness | Nuevo      |
| GET    | `/api/v1/verification/liveness/{sessionId}`        | Estado de la verificación                  | Nuevo      |
| POST   | `/api/v1/verification/liveness/{sessionId}/upload` | Sube imagen de documento                   | Modificado |

### Base de Datos

| Tabla                   | Cambio                                        | Migración                         | Impacto QA                                  |
| ----------------------- | --------------------------------------------- | --------------------------------- | ------------------------------------------- |
| `verification_sessions` | Añadida columna `liveness_score` DECIMAL(5,4) | `20260308_add_liveness_score.sql` | Verificar que score se guarda correctamente |
| `document_captures`     | Añadida columna `quality_metrics` JSONB       | Misma migración                   | Probar con diferentes calidades de imagen   |

### Configuración

| Variable                | Valor en Staging | Notas                        |
| ----------------------- | ---------------- | ---------------------------- |
| `LIVENESS_THRESHOLD`    | `0.75`           | Score mínimo para aceptar    |
| `MAX_CAPTURE_ATTEMPTS`  | `3`              | Máximo 3 intentos por sesión |
| `LIVENESS_DETECTION_V2` | `true`           | Feature flag activa          |

### Dependencias Externas

| Servicio                  | Estado    | Impacto si no disponible         |
| ------------------------- | --------- | -------------------------------- |
| Identity Verification API | ✅ Activo | No funciona la detección de vida |
| Document OCR Service      | ✅ Activo | No extrae datos del documento    |
| Redis Cache               | ✅ Activo | Sesiones expiran inmediatamente  |

## 3. Cómo Probarlo

### Prerequisitos

- [ ] Feature flag `LIVENESS_DETECTION_V2 = ON` verificada en `/admin/flags`
- [ ] Usuario test: `qa.tester@example.com` / `TestPass2024!` (rol: verified_user)
- [ ] Browser con soporte para cámara (Chrome/Firefox últimas versiones)
- [ ] Documentos de prueba en carpeta `test-data/documents/`
- [ ] Permisos de cámara concedidos al dominio staging

### Flujo Principal — Happy Path

| Paso | Acción                           | Datos                                   | Resultado Esperado                       |
| ---- | -------------------------------- | --------------------------------------- | ---------------------------------------- |
| 1    | Hacer login                      | qa.tester@example.com                   | Dashboard principal visible              |
| 2    | Clic en "Verificar con Liveness" | -                                       | Modal de cámara se abre                  |
| 3    | Permitir acceso a cámara         | -                                       | Vista previa de cámara activa            |
| 4    | Colocar DNI en marco             | `test-data/documents/dni-valid-001.jpg` | Marco verde, botón "Capturar" habilitado |
| 5    | Clic "Capturar"                  | -                                       | Progreso de procesamiento visible        |
| 6    | Esperar análisis                 | ~10-15 segundos                         | Pantalla de resultados aparece           |
| 7    | Verificar resultado              | -                                       | Score > 0.75, estado "ACEPTADO"          |

### Escenarios de Error

| #   | Escenario           | Reproducir                                       | Resultado Esperado                                         |
| --- | ------------------- | ------------------------------------------------ | ---------------------------------------------------------- |
| 1   | Archivo corrupto    | Usar `test-data/files/profile-corrupted-001.jpg` | Error "Archivo dañado, por favor seleccione otro"          |
| 2   | Sin selección       | Hacer clic en "Enviar" sin seleccionar archivo   | Error "Debe seleccionar al menos un archivo"               |
| 3   | Formato no válido   | Usar `test-data/files/document-invalid-001.txt`  | Error "Formato de archivo no permitido"                    |
| 4   | Tamaño excedido     | Subir archivo >5MB                               | Error "El archivo excede el tamaño máximo permitido"       |
| 5   | 3 intentos fallidos | Fallar 3 veces consecutivas                      | Error "Límite de intentos alcanzado. Contacte con soporte" |

### Edge Cases

| #   | Caso               | Reproducir                  | Resultado Esperado                              |
| --- | ------------------ | --------------------------- | ----------------------------------------------- |
| 1   | Red lenta          | Throttle conexión a 3G      | Timeout después de 30s con mensaje apropiado    |
| 2   | Sesión expirada    | Esperar 15 minutos inactivo | Redirigir a login con mensaje "Sesión expirada" |
| 3   | Múltiples pestañas | Abrir 2 pestañas del flujo  | Solo una sesión activa, la otra muestra error   |

## 4. Datos de Prueba

### Test Files/Data

| Archivo                     | Tipo                    | Propósito                   | Resultado Esperado                   |
| --------------------------- | ----------------------- | --------------------------- | ------------------------------------ |
| `profile-valid-001.jpg`     | Imagen de perfil válida | Happy path básico           | Validación exitosa, estado ACEPTADO  |
| `profile-valid-002.jpg`     | Imagen de perfil válida | Happy path alternativo      | Validación exitosa, estado ACEPTADO  |
| `profile-large-001.jpg`     | Imagen >5MB             | Validación de tamaño        | Error "Archivo demasiado grande"     |
| `profile-corrupted-001.jpg` | Archivo corrupto        | Error de formato            | Error "Formato de archivo inválido"  |
| `invoice-valid-001.pdf`     | Factura válida          | Procesamiento de documentos | Procesado correctamente              |
| `invoice-invalid-001.txt`   | Archivo de texto        | Formato no soportado        | Error "Tipo de archivo no permitido" |

### Test Users

| Usuario                | Password      | Rol           | Estado    | Notas                               |
| ---------------------- | ------------- | ------------- | --------- | ----------------------------------- |
| qa.tester@example.com  | TestPass2024! | verified_user | Activo    | Usuario principal de testing        |
| qa.premium@example.com | TestPass2024! | premium_user  | Activo    | Usuario con límites extendidos      |
| qa.blocked@example.com | TestPass2024! | verified_user | Bloqueado | Para testing de usuarios bloqueados |

## 5. Áreas de Regresión

### Impact Areas

| Área                      | Por qué Afectada                | Prioridad Regresión |
| ------------------------- | ------------------------------- | ------------------- |
| Procesamiento de archivos | Misma base de código modificada | 🔴 Alta             |
| Sistema de sesiones       | Nueva gestión de estado         | 🟡 Media            |
| Dashboard principal       | Nuevo botón añadido             | 🟡 Media            |
| API de uploads            | Endpoint modificado             | 🔴 Alta             |
| Base de datos             | Nueva columna añadida           | 🟡 Media            |

### Suggested Smoke Test

1. **Subida de archivos** estándar sigue funcionando
2. **Login/logout** funcionan normalmente
3. **Dashboard** carga sin errores
4. **API health** responde OK en `/health`
5. **Feature flag** se puede activar/desactivar correctamente

## 6. Riesgos y Limitaciones

| Riesgo                                     | Impacto en Testing                           | Workaround                                           |
| ------------------------------------------ | -------------------------------------------- | ---------------------------------------------------- |
| Procesamiento sensible a tamaño de archivo | Tests pueden fallar con archivos muy grandes | Usar archivos de prueba optimizados                  |
| Dependencia de servicios externos          | Tests intermitentes si servicios caen        | Verificar estado en `/admin/health` antes de testing |
| Feature flag puede cambiar                 | Tests fallan si flag se desactiva            | Verificar flag al inicio de cada sesión              |
| Límite de 3 intentos por sesión            | No se pueden probar múltiples errores        | Usar sesiones diferentes para cada test de error     |

## 7. Screenshots / Demo

- **Pantalla principal**: `test-screenshots/main-page-new-feature.png`
- **Modal de subida**: `test-screenshots/upload-modal-active.png`
- **Archivo seleccionado**: `test-screenshots/file-selected-preview.png`
- **Procesando**: `test-screenshots/upload-progress-animation.png`
- **Resultado exitoso**: `test-screenshots/upload-success-message.png`
- **Error de formato**: `test-screenshots/format-error-message.png`

**Video demo completo**: `test-videos/file-upload-complete-flow.mp4`
```

## Quality Validation Checklist

Use this checklist to validate handoff quality before sending to QA:

### Completeness Assessment

- [ ] **Functional description** clear without technical jargon?
- [ ] **Visual changes** documented with specific locations?
- [ ] **What's NOT implemented** explicitly stated?
- [ ] **Technical changes** relevant for QA testing identified?
- [ ] **Prerequisites** are a verifiable checklist?
- [ ] **Test data** includes specific files/users/credentials?
- [ ] **Error scenarios** have concrete reproduction steps?
- [ ] **Regression areas** identified based on code changes?

### Clarity Verification

- [ ] QA can execute tests without asking follow-up questions?
- [ ] User language used instead of developer terminology?
- [ ] Concrete data provided (not "valid values" or "test user")?
- [ ] Expected results clearly defined for each test case?
- [ ] Screenshots/videos referenced for visual verification?

### Testability Check

- [ ] Each acceptance criterion has corresponding test steps?
- [ ] Error paths tested with same detail as happy path?
- [ ] Edge cases identified and documented?
- [ ] Performance expectations defined where relevant?
- [ ] Configuration dependencies clearly stated?

### Missing Information Detection

- [ ] Test environment URLs and access provided?
- [ ] Feature flags and their states documented?
- [ ] External service dependencies and their status?
- [ ] Database migration impact on testing explained?
- [ ] Recovery steps for failed test scenarios?

## Change Type Templates

### UI Component Changes

**Test Focus**: Visual and functional behavior

```markdown
### UI Component Testing Checklist

- [ ] Component renders correctly in different screen sizes
- [ ] All interactive elements (buttons, inputs) work as expected
- [ ] CSS styles apply correctly (colors, fonts, spacing)
- [ ] Component state changes reflect visually
- [ ] Accessibility: keyboard navigation, screen reader compatibility
- [ ] Cross-browser testing (Chrome, Firefox, Safari, Edge)
- [ ] Mobile responsiveness if applicable
```

### API Endpoint Changes

**Test Focus**: Request/response validation and integration

```markdown
### API Endpoint Testing Checklist

- [ ] Request format matches OpenAPI specification
- [ ] Response format matches expected schema
- [ ] HTTP status codes correct for different scenarios
- [ ] Error messages are user-friendly and informative
- [ ] Authentication/authorization working properly
- [ ] Rate limiting behavior as expected
- [ ] Integration with frontend components functional
- [ ] Database changes reflected in API responses
```

### Database Changes

**Test Focus**: Data integrity and migration verification

```markdown
### Database Changes Testing Checklist

- [ ] Migration applied successfully in test environment
- [ ] New columns accept expected data types and constraints
- [ ] Existing data preserved and accessible
- [ ] Foreign key relationships working correctly
- [ ] Indexes performing as expected (if performance-critical)
- [ ] Backup and restore processes still functional
- [ ] Application queries work with new schema
```

### Configuration Changes

**Test Focus**: Environment behavior verification

```markdown
### Configuration Testing Checklist

- [ ] New environment variables loaded correctly
- [ ] Feature flags toggle behavior as expected
- [ ] Application starts with new configuration
- [ ] Different environment configurations (dev/staging/prod) work
- [ ] Rollback to previous configuration possible
- [ ] Monitoring and alerting reflect configuration changes
- [ ] Performance impact of configuration changes measured
```

## Common Pitfalls and How to Avoid Them

### Missing Test Data or Credentials

**Pitfall**: Handoff says "use valid test user" without providing specific credentials.

**Solution**:

```markdown
### Correct Format:

| Usuario               | Password       | Rol           | Notas                  |
| --------------------- | -------------- | ------------- | ---------------------- |
| qa.tester@example.com | TestPass2024!  | verified_user | Usuario principal      |
| qa.admin@example.com  | AdminPass2024! | admin         | Para tests de permisos |
```

### Unclear Acceptance Criteria

**Pitfall**: Vague descriptions like "system should work correctly"

**Solution**:

```markdown
### Specific Expected Results:

- ✅ "Score > 0.75 displayed with green indicator"
- ❌ "System shows success message"
```

### Incomplete Regression Analysis

**Pitfall**: Not identifying what existing functionality might be affected

**Solution**:

```markdown
### Regression Impact Analysis:

1. **Code Analysis**: Review modified files and their dependencies
2. **Functional Impact**: Map changes to user-facing features
3. **Technical Impact**: Identify shared components/services affected
4. **Priority Matrix**: High/Medium/Low based on user impact
```

### Technical Jargon for QA Audience

**Pitfall**: "Updated POST /api/v1/users endpoint to validate JWT tokens"

**Solution**: "Los usuarios ahora deben estar autenticados para actualizar su perfil. Si no han hecho login, verán un error pidiendo que inicien sesión."

### Missing Environment Setup

**Pitfall**: Assuming QA knows how to configure test environment

**Solution**:

```markdown
### Environment Prerequisites:

- [ ] Feature flag `NEW_FEATURE = ON` in staging admin panel
- [ ] Test database seeded with script `scripts/seed-test-data.sql`
- [ ] External API mock server running on port 3001
- [ ] Browser cache cleared before testing
```

### Insufficient Error Scenario Coverage

**Pitfall**: Only documenting happy path testing

**Solution**: Document error scenarios with same detail level as success cases, including:

- Input validation errors
- Network/connectivity issues
- Service dependency failures
- Permission/authorization errors
- Resource limit exceeded scenarios

## Resources

- **Handoff completeness checklist**: `references/handoff-checklist.md`
- **Test data management guide**: `references/test-data-management.md`
- **Staging environment guide**: `references/staging-environment-guide.md`
- **Examples**: `references/handoff-verification.md`, `references/handoff-dashboard-crud.md`

## Quality Assurance

### Validation Script

This skill includes automated validation via `scripts/validate-examples.ts`:

```bash
# Validate skill examples and structure
npx tsx scripts/validate-examples.ts
```

**Validation includes:**

- Example completeness and correctness
- Development-to-QA handoff and testing transition compliance patterns
- Progressive disclosure adherence
- Resource organization standards

**When to use:**

- Before skill release/packaging
- In CI/CD pipeline (quality gates)
- After major example updates
- During skill maintenance cycles

**Integration with ecosystem:**

- Used by `/multi-agent-audit` for ecosystem validation
- Supports quality gates in SDLC workflow
- Provides consistent validation across all skills
