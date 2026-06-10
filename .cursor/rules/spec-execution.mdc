---
id: spec-execution
version: "1.0.0"
last_updated: "2026-05-20"
updated_by: "TL: LIDR Spec Native"
status: active
scope: workflow
description: "Mandatory steps and per-step report rule for LIDR change execution (Step 0 branch, unit tests, manual curl, Playwright E2E, docs update). The agent MUST execute all tests itself, never delegate."
alwaysApply: true
---

# Rule: Spec Execution — Mandatory Steps for LIDR Changes

> **Nivel**: Rule (workflow, alwaysApply: true)
> **Carga**: SIEMPRE durante la Phase 4 Implementation · stage development (ex-Fase 5) y cuando se invocan los commands `/lidr-spec-apply` o `/lidr-spec-verify`
> **Propósito**: Imponer los pasos obligatorios y la generación de reportes auditables por cada change LIDR, garantizando que la IA EJECUTE los tests en lugar de delegarlos al usuario.
> **Origen**: Adaptación nativa LIDR del patrón mandatory-steps. Pertenece al ecosistema LIDR, no a una dependencia externa.

---

## 1. Cuándo aplica esta rule

Esta rule aplica cuando:

- Se crea o actualiza un `tasks.md` dentro de `docs/projects/{{CLIENT_CODE}}/changes/<change-name>/`
- Se ejecuta `/lidr-spec-ff <name>` (genera tasks.md por primera vez)
- Se ejecuta `/lidr-spec-apply <name>` (implementa tareas — debe ejecutar los tests manuales)
- Se ejecuta `/lidr-spec-verify <name>` (genera test-report.md final)
- Se ejecuta `/lidr-spec-continue <name>` (retoma un change pausado)
- Cualquier task creation o execution que involucre cambios en código del backend o frontend

---

## 2. Pasos obligatorios — orden estricto

Todo `tasks.md` de un change LIDR DEBE incluir estos pasos, en este orden:

### Step 0 — Create Feature Branch (DEBE SER EL PRIMERO)

- **Posición**: primer paso del `tasks.md` (Step 0)
- **Branch naming**: `feature/<change-name>` o `feature/<ticket-id>-<short-slug>` según `lidr-sdlc/tech-stack.md` §9
- **Acción**: crear y cambiar a la feature branch ANTES de cualquier cambio de código

### Pasos obligatorios subsiguientes (cada uno con report)

- **Step N**: Review and Update Existing Unit Tests (MANDATORY)
- **Step N+1**: Run Unit Tests and Verify Database State (MANDATORY) — AGENT MUST EXECUTE
- **Step N+2**: Manual Endpoint Testing with curl (MANDATORY) — AGENT MUST EXECUTE
- **Step N+3**: E2E Testing with Playwright MCP (MANDATORY if applicable) — AGENT MUST EXECUTE
- **Step N+4**: Update Technical Documentation (MANDATORY) — DTC compliance per `lidr-sdlc/documentation.md`

---

## 3. Reportes por step — auditoría obligatoria

Cada step ejecutable genera un report en:

```
docs/projects/{{CLIENT_CODE}}/changes/<change-name>/reports/YYYY-MM-DD-step-N+M-<short-name>.md
```

Ejemplos de nombres:

- `2026-05-20-step-N+1-unit-test-and-db-verification.md`
- `2026-05-20-step-N+2-curl-endpoint-testing.md`
- `2026-05-20-step-N+3-playwright-e2e.md`
- `2026-05-20-step-N+4-docs-update.md`

**Una task no puede marcarse `[x]` en `tasks.md` hasta que su report exista.**

---

## 4. AGENT MUST EXECUTE — testing manual obligatorio

**CRÍTICO**: La IA (coding agent) DEBE realizar todos los pasos de testing manual por sí misma. **NUNCA delegar al usuario**. Estos tests deben ejecutarse por la IA para poder marcar las tareas como completadas en `tasks.md`.

### Step N+1 — Run Unit Tests and Verify Database State

**Responsabilidad del agente**: ejecutar unit tests, validar integridad de DB antes/después, producir reporte.

**Pasos** (la IA los ejecuta):

1. **Prepare Test Environment**:
   - Asegurar que los servicios requeridos están corriendo (DB, cache, dependencias)
   - Capturar el estado pre-test de la DB relevante al change (counts, registros clave, checksums, snapshots)
   - Documentar el(los) comando(s) exactos a ejecutar

2. **Run Targeted Unit Tests First**:
   - Ejecutar tests focalizados en el módulo(s) modificado(s)
   - Confirmar que los failures se resuelven y no hay regresiones en el scope objetivo
   - Capturar resumen de salida (passed/failed/skipped)

3. **Run Broader Unit Test Suite**:
   - Ejecutar la suite del proyecto requerida por `lidr-sdlc/tech-stack.md` §7 (o subset justificado si está configurado)
   - Registrar totales de tests, failures, runtime, flakies

4. **Verify Post-Test Database State**:
   - Re-chequear los mismos indicadores de DB capturados antes
   - Confirmar que no quedan mutaciones no deseadas
   - Si hubo mutación, restaurar el estado y documentar la restauración

5. **Create Unit Test Verification Report**:
   - Guardar en `docs/projects/{{CLIENT_CODE}}/changes/<change-name>/reports/`
   - Nombre: `YYYY-MM-DD-step-N+1-unit-test-and-db-verification.md`
   - Incluye: comandos ejecutados, resultados resumidos, comparación DB pre/post, acciones de cleanup

6. **Mark Task as Completed**: solo después de que los unit tests pasen (o las excepciones aprobadas estén documentadas), el estado de DB esté verificado/restaurado, y el report exista, marcar Step N+1 como completado en `tasks.md`.

**Plantilla del reporte**:

```markdown
# Step N+1 Report — Unit Tests and Database Verification

- Date: YYYY-MM-DD
- Change: <change-name>
- Agent: <agent-name>

## Commands Executed

- `<command 1>`
- `<command 2>`

## Unit Test Results

- Targeted tests: X passed, Y failed, Z skipped
- Full/required suite: X passed, Y failed, Z skipped
- Runtime: <duration>
- Notes: <flaky tests, retries, exceptions>

## Database State Verification

- Pre-test baseline:
  - <metric/table/check>: <value>
- Post-test validation:
  - <metric/table/check>: <value>
- State restored: Yes/No
- Restoration actions (if any): <actions>

## Outcome

- Step N+1 status: PASS/FAIL
- Blocking issues: <none or list>
```

**Dependencies**: test runner instalado, acceso a DB, permiso para crear reports.

**Notas**:

- La IA DEBE ejecutar los tests — nunca pedir al usuario que los corra
- Este paso es obligatorio incluso si los cambios parecen pequeños
- El nombre del report debe seguir el patrón exacto para trazabilidad
- La task solo se marca completa después de crear el report

### Step N+2 — Manual Endpoint Testing with curl

**Responsabilidad del agente**: ejecutar TODOS los comandos curl y verificar respuestas. No delegable.

**Pasos** (la IA los ejecuta):

1. **Prepare Test Environment**: asegurar backend running, DB activa, capturar estado para endpoints CREATE/UPDATE/DELETE
2. **Test GET Endpoints**: `curl -X GET <url> <headers>` → verificar status code y body
3. **Test POST Endpoints**: `curl -X POST <url> -H "Content-Type: application/json" -d '<json>'` → verificar 201/400/422, **restaurar estado** borrando el registro creado
4. **Test PUT/PATCH Endpoints**: verificar update + **restaurar valores originales**
5. **Test DELETE Endpoints**: verificar deleción + **recrear el registro con valores originales**
6. **Test Error Cases**: invalid data (422), recursos no existentes (404), unauthorized (401/403) según la API spec
7. **Mark Task as Completed**: solo cuando todos los curl pasen y el estado de DB esté restaurado

**Notas**:

- MANDATORY para todos los endpoints nuevos o modificados
- La IA DEBE ejecutar todos los curl
- Toda operación CREATE/UPDATE/DELETE debe restaurar estado
- Documentar comandos y respuestas en reporte con nombre `YYYY-MM-DD-step-N+2-curl-endpoint-testing.md`

### Step N+3 — E2E Testing with Playwright MCP (MANDATORY if applicable)

**Cuándo aplica**: cambios frontend que afectan workflows de usuario, integración FE↔BE, features que requieren interacción browser.

**Cuándo NO aplica**: cambios de pure backend sin endpoint nuevo, refactor interno sin cambio funcional, scripts CLI.

**Si aplica, la IA ejecuta** (no delegar):

1. Asegurar FE y BE running; verificar DB en estado conocido; verificar Playwright MCP tools disponibles
2. `browser_navigate` a la URL de la app
3. Ejecutar el workflow completo: `browser_click`, `browser_type`, `browser_fill`, `browser_snapshot`, `browser_wait`
4. Test error scenarios (validation errors, error messages, recovery flows)
5. Verificar data persistence (DB state vs UI state)
6. Restaurar test environment (cleanup test data, cerrar browser)
7. Marcar task completa + crear reporte `YYYY-MM-DD-step-N+3-playwright-e2e.md`

**Notas**:

- La IA DEBE ejecutar los E2E
- Usar incremental waits (1-3s) con snapshot checks en vez de waits largos
- Restaurar DB después de tests que modifiquen datos

### Step N+4 — Update Technical Documentation (MANDATORY)

DTC compliance — ver `lidr-sdlc/documentation.md` §1 (matriz de impacto: cambio → docs afectados).

La IA actualiza, en el mismo cambio:

- `docs/projects/{{CLIENT_CODE}}/architecture.md` si hay schema/dependencia nuevos
- `docs/projects/{{CLIENT_CODE}}/specs/routes.md` y OpenAPI spec si hay endpoint nuevo/modificado
- `docs/projects/{{CLIENT_CODE}}/specs/components.md` si hay componente UI nuevo
- ADR en `docs/projects/{{CLIENT_CODE}}/adr/ADR-NNNN-*.md` si hay decisión arquitectónica
- Reporte: `YYYY-MM-DD-step-N+4-docs-update.md` listando archivos modificados

---

## 5. Verification Checklist (para `/lidr-spec-verify`)

Antes de finalizar cualquier `tasks.md`, verificar:

- [ ] Step 0 (Create Feature Branch) es el PRIMERO
- [ ] Todos los pasos mandatory de esta rule están incluidos
- [ ] Steps numerados secuencialmente
- [ ] Pasos mandatory marcados con `(MANDATORY)`
- [ ] Branch naming sigue convención (`feature/<change-name>` o `feature/<ticket-id>-<slug>`)
- [ ] Step N+1 incluye path del report y patrón de naming en `docs/projects/{{CLIENT_CODE}}/changes/<change-name>/reports/`
- [ ] Pasos de testing manual dicen explícitamente "AGENT MUST EXECUTE"
- [ ] Tasks incluyen pasos de restauración de DB
- [ ] Step N+3 (Playwright) incluido si hay cambios frontend
- [ ] Reportes existen para cada step antes de marcarlo `[x]`

---

## 6. Ejemplo de estructura de tasks.md

```markdown
## 0. Setup: Create Feature Branch (MANDATORY — FIRST STEP)

- [ ] 0.1 Create feature branch `feature/<change-name>` from `main` (or current base)
- [ ] 0.2 Verify branch creation and current branch status

## 1. Backend: Validator Tests (TDD)

- [ ] 1.1 ...

...

## 8. Backend: Review and Update Existing Unit Tests (MANDATORY)

- [ ] 8.1 ...

## 9. Backend: Run Unit Tests and Verify Database State (MANDATORY — AGENT MUST EXECUTE)

- [ ] 9.1 Capture pre-test database baseline for impacted entities
- [ ] 9.2 Run targeted unit tests for changed modules
- [ ] 9.3 Run required broader unit test suite
- [ ] 9.4 Verify post-test database state and restore if needed
- [ ] 9.5 Create report `docs/projects/{{CLIENT_CODE}}/changes/<name>/reports/YYYY-MM-DD-step-N+1-unit-test-and-db-verification.md`
- [ ] 9.6 Mark step complete only after tests pass and report exists

## 10. Backend: Manual Endpoint Testing with curl (MANDATORY — AGENT MUST EXECUTE)

- [ ] 10.1 Ensure backend server is running
- [ ] 10.2 Test GET endpoints with curl and verify responses
- [ ] 10.3 Test POST endpoints with curl, verify creation, then restore database state
- [ ] 10.4 Test PUT/PATCH endpoints with curl, verify updates, then restore database state
- [ ] 10.5 Test DELETE endpoints with curl, verify deletion, then restore database state
- [ ] 10.6 Test error cases (validation errors, 404, etc.)
- [ ] 10.7 Document all curl commands and responses in report
- [ ] 10.8 Verify database state matches pre-test state

## 11. Frontend: E2E Testing with Playwright MCP (MANDATORY if applicable — AGENT MUST EXECUTE)

- [ ] 11.1 Ensure frontend and backend servers are running
- [ ] 11.2 Navigate to application using Playwright MCP browser_navigate
- [ ] 11.3 Execute complete user workflow using Playwright MCP tools
- [ ] 11.4 Test error scenarios and validation
- [ ] 11.5 Verify data persistence and UI state
- [ ] 11.6 Restore test environment and database state
- [ ] 11.7 Document test scenarios and outcomes in report

## 16. Update Technical Documentation (MANDATORY)

- [ ] 16.1 Update docs per DTC matrix in `lidr-sdlc/documentation.md`
- [ ] 16.2 Create ADR if architectural decision involved
- [ ] 16.3 Create report listing modified docs
```

---

## 7. Agent Execution Requirements (no negociable)

**CRÍTICO**: cuando se implementan tasks vía `/lidr-spec-apply` o el subagent `lidr-spec-orchestrator`, la IA DEBE:

1. **Ejecutar TODOS los tests manuales**. Nunca pedir al usuario que corra curl o E2E. La IA debe:
   - Levantar servicios (backend, frontend) si hacen falta
   - Ejecutar todos los curl
   - Ejecutar todos los E2E con Playwright MCP
   - Verificar todas las respuestas y outcomes
   - Restaurar estado de DB tras tests

2. **Marcar tasks completas SOLO después de**:
   - Haber ejecutado los tests requeridos
   - Haber verificado los resultados
   - Haber restaurado el estado de DB (para CREATE/UPDATE/DELETE)
   - Haber documentado los outcomes en el report correspondiente

3. **Nunca delegar el testing**. La IA NUNCA:
   - Pide al usuario que corra curl
   - Pide al usuario que pruebe endpoints manualmente
   - Pide al usuario que corra E2E
   - Marca tasks completas sin ejecutar los tests
   - Salta pasos de testing manual

4. **Documentar la ejecución**. La IA documenta:
   - Todos los curl ejecutados
   - Todas las respuestas recibidas
   - Todos los escenarios E2E ejecutados
   - Acciones de restauración de DB
   - Issues encontrados y resoluciones

---

## 8. Failure to Follow

Si la IA crea `tasks.md` sin seguir estos pasos obligatorios, el usuario tendrá que arreglar el `tasks.md` manualmente. Siempre leer `tasks.md` y verificar pasos mandatory antes de marcar nada como completo.

**Si la IA implementa tasks sin ejecutar los tests manuales por sí misma, está violando esta rule. La IA DEBE ejecutar todos los tests para poder marcar tasks como completadas.**

---

## 9. Coherencia con otras rules

- `lidr-sdlc/org.md` §7 — Política de Calidad (zero-tolerance): esta rule operacionaliza el zero-tolerance en testing
- `lidr-sdlc/documentation.md` — DTC (Docs Travel with Code): Step N+4 cierra el lazo DTC
- `lidr-sdlc/tech-stack.md` §7 — Testing Strategy: define las herramientas (Vitest, Playwright) que esta rule asume
- `lidr-sdlc/model-selection.md` — `/lidr-spec-apply` corre Sonnet medium (implementación), `/lidr-spec-verify` puede subir a Opus high si encuentra bloqueos

---

## 10. Changelog

| Versión | Fecha      | Autor                | Cambios                                                              |
| ------- | ---------- | -------------------- | -------------------------------------------------------------------- |
| 1.0.0   | 2026-05-20 | TL: LIDR Spec Native | Creación inicial — paridad LIDR-nativa con el patrón mandatory-steps |
