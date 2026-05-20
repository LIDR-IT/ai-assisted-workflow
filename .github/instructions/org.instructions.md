---
description: LIDR SDLC: Organizational standards — values, methodology (Scrum + SDD), 8 SDLC phases with gates, RACI by role, quality and security policy. Tier-1 rule, always loaded.
applyTo: "**"
---

# Rule: Estándares de Organización

> **Nivel**: Organizacional (Nivel 1)
> **Carga**: SIEMPRE — este fichero se inyecta en cada sesión de IA sin excepción.
> **Propósito**: Define cómo trabaja la empresa, qué valores rigen las decisiones, y qué estándares no son negociables.
> **Fuente de verdad extendida**: docs/standards/org.md


## 1. Identidad Organizacional

### 1.1 Quiénes Somos

La organización se especializa en desarrollo de software y soluciones tecnológicas. [Descripción específica del cliente se define en la configuración del cliente activo]

### 1.2 Mercados y Regulación

| Mercado         | Regulación Aplicable                                 | Implicación para Desarrollo                                        |
| --------------- | ---------------------------------------------------- | ------------------------------------------------------------------ |
| Banca / Fintech | PSD2, AML/KYC, regulación bancaria local             | Auditoría exhaustiva, logs inmutables, cifrado obligatorio         |
| Gobierno / eID  | eIDAS (EU), regulación nacional de identidad         | Certificación formal, interoperabilidad, accesibilidad WCAG 2.1 AA |
| Seguros / Salud | GDPR Art. 9 (datos biométricos = categoría especial) | Consentimiento explícito, DPIA obligatoria, minimización de datos  |
| Global          | GDPR, CCPA, LGPD                                     | Privacy by Design, derecho al olvido, portabilidad de datos        |

### 1.3 Criticidad de los Datos

Los datos biométricos son **datos de categoría especial** bajo GDPR Art. 9. Esto implica:

- **NUNCA** almacenar templates biométricos en texto plano
- **NUNCA** loguear datos biométricos ni PII en logs de aplicación
- **SIEMPRE** cifrar en tránsito (TLS 1.2+) y en reposo (AES-256 mínimo)
- **SIEMPRE** implementar mecanismo de revocación/eliminación de datos
- La IA **NUNCA** debe generar código que exponga, loguee, o transmita datos biométricos sin cifrado


## 2. Filosofía de Desarrollo: Spec-Driven Development (SDD)

### 2.1 Principio Central

> "Si no tiene spec, no tiene código. Si no tiene gate, no avanza. Si no tiene trazabilidad, no existe."

Toda implementación parte de una **especificación aprobada**. Las specs no son documentación retroactiva — son el **input** que impulsa la generación de código, tests, y documentación.

### 2.2 Cadena de Trazabilidad

```
Business Case → PRD (Técnico + Funcional) → RF con BDD → User Story → Código → Test Case → Release
```

Cada eslabón referencia al anterior. La IA debe **mantener esta trazabilidad** en todo artefacto que genere:

- Todo PR referencia un ticket Jira
- Todo ticket Jira referencia un RF
- Todo RF referencia un PRD
- Todo test case referencia criterios de aceptación del RF

### 2.3 La IA como Copiloto, no como Piloto

| La IA HACE                               | El Humano HACE                      |
| ---------------------------------------- | ----------------------------------- |
| Genera borradores estructurados          | Aporta juicio y contexto de negocio |
| Valida contra checklists automáticamente | Toma decisiones sobre excepciones   |
| Sugiere basándose en patrones            | Firma y se responsabiliza           |
| Detecta inconsistencias                  | Prioriza y negocia trade-offs       |
| Automatiza lo repetitivo                 | Diseña la estrategia                |

**Regla de oro**: Todo output de IA que impacte producción requiere **validación humana explícita**.

### 2.4 Automation-First Pattern (2026+)

Para tareas repetitivas con alto volumen (> 2h/sprint), priorizamos **automatización completa**:

| Skill Automatizado         | Antes            | Ahora              | Ahorro/Ciclo | ROI Anual  |
| -------------------------- | ---------------- | ------------------ | ------------ | ---------- |
| 🤖 `project-classifier`    | 2h análisis      | 5min detection     | 1.9h         | 50+ horas  |
| 🤖 `validate-requirements` | 6h manual        | 5min script        | 5.9h         | 150+ horas |
| 🤖 `tech-debt`             | 6h análisis      | 5min SonarQube     | 5.9h         | 120+ horas |
| 🤖 `user-stories`          | 3h escritura     | 15min slicing      | 2.75h        | 80+ horas  |
| 🤖 `regression-suite`      | 8h selección     | 30min impact       | 7.5h         | 120+ horas |
| 🤖 `security-checklist`    | 4h compliance    | 5min analysis      | 3.9h         | 80+ horas  |
| 🤖 `test-plan`             | 3h planning      | 5min risk analysis | 2.9h         | 60+ horas  |
| 🤖 `release-notes`         | 2h manual        | 5min git analysis  | 1.9h         | 50+ horas  |
| 🤖 `rollback-plan`         | 4h risk analysis | 5min automation    | 3.9h         | 45+ horas  |

**Total ROI**: 775+ horas/año liberadas para trabajo de valor estratégico.

**Principio**: Scripts Python + domain knowledge → transforma tareas de 3-8h en workflows de 5-30min con output consistente y trazabilidad completa.


## 3. Metodología

### 3.1 Framework

- **Scrum** con sprints de **2 semanas** (10 días laborables)
- Cada sprint tiene: Planning (día 1), Daily (diario), Review (día 9), Retro (día 10)
- Los refinements son sesiones separadas del sprint planning (mínimo 1 por sprint)

### 3.2 Estimación

- En **horas**, no en story points
- Rango aceptable por US: **2h – 40h** (si > 40h, descomponer)
- Incluir estimación de testing en la US (dev + QA)
- La IA puede sugerir estimaciones pero el equipo tiene la última palabra

### 3.3 Capacidad y Commitment

- **Buffer obligatorio**: 15–20% de la capacidad bruta se reserva para imprevistos
- **Ratio de commitment**: 80–90% de capacidad neta (nunca 100%)
- **Trabajo arrastrado máximo tolerable**: 10% del sprint anterior
- Si trabajo arrastrado > 10% → alerta automática a Governance
- Formato de commitment: docs/standards/sprint-commitment.md

### 3.4 Definiciones Clave

#### Definition of Ready (DoR)

Una US entra al sprint SOLO si cumple DoR: skills/refinement-notes/checklists/dor.md

- Formato Actor/Acción/Valor correcto
- Criterios de aceptación BDD (Given/When/Then)
- Estimación en horas completada
- Dependencias resueltas o con plan de mitigación
- RF vinculado

#### Definition of Done (DoD)

Una US se cierra SOLO si cumple DoD: skills/pr-description/checklists/dod.md

- Code review aprobado (mínimo 1 peer + TL)
- Tests unitarios pasan (cobertura ≥ 80% en lógica de negocio)
- SAST/SCA limpio (0 vulnerabilidades Críticas/Altas)
- PR description completa
- Handoff dev→QA generado y adjunto al ticket


## 4. Flujo SDLC con Gates Formales

### 4.1 Las 8 Fases

| #   | Fase                | Gate de Salida            | Criterios de Salida                                            | Aprueba           |
| --- | ------------------- | ------------------------- | -------------------------------------------------------------- | ----------------- |
| 1   | **Originación**     | Gate 0: Intake            | BC aprobado, sponsor, presupuesto, alineación estratégica      | PME + Sponsor     |
| 2   | **Discovery & PRD** | Gate 1: PRD Aprobado      | PRD-T + PRD-F completos, review cruzado, riesgos identificados | Producto + R&D    |
| 3   | **Especificación**  | Gate 2: RF Completos      | RFs con BDD, dependencias mapeadas, coherencia validada        | Producto + QA     |
| 4   | **Sprint Planning** | Gate 3: Sprint Committed  | DoR cumplida, capacidad confirmada, commitment firmado         | PO + TL           |
| 5   | **Desarrollo**      | Gate 4: Code Quality      | 0 vuln Críticas/Altas, code review, tests pasan                | Dev + Seguridad   |
| 6   | **QA & Testing**    | Gate 5: QA Sign-off       | All test cases PASS, 0 bugs bloqueantes, regresión limpia      | QA Lead           |
| 7   | **Seguridad**       | Gate 6: Security Sign-off | DAST limpio, pen test completado, vulnerabilidades remediadas  | CISO              |
| 8   | **Despliegue**      | Gate Final: Release       | CR aprobado, rollback plan, post-deploy checklist              | Comité de Cambios |

### 4.2 Regla de Gates

> **Ningún artefacto avanza sin pasar su gate.** No hay excepciones. Si un gate no se pasa, el artefacto vuelve a la fase anterior para re-trabajo.

Excepciones de emergencia (hotfix):

- Solo para incidentes P1 en producción
- Requieren aprobación verbal del CTO + documentación retroactiva en < 24h
- Post-mortem obligatorio en la siguiente retro


## 5. Roles y Responsabilidades (RACI por Fase)

### 5.1 Roles del Equipo

| Rol                    | Responsabilidad Principal                           | Artefactos Clave                                |
| ---------------------- | --------------------------------------------------- | ----------------------------------------------- |
| **PME**                | Governance, portafolio, métricas, change management | Business Case, Change Request, Retro report     |
| **Product Owner (PO)** | Visión funcional, priorización, sign-off funcional  | PRD Funcional, User Stories, backlog            |
| **R&D / Core**         | Viabilidad técnica, algoritmos, arquitectura        | PRD Técnico, PoC Report, ADR                    |
| **TL**                 | Estándares técnicos, code review, mentoring         | Rules técnicas, DoD enforcement, ADR            |
| **Developer**          | Implementación, PR, handoff QA                      | Código, PR description, handoff doc             |
| **QA Lead**            | Estrategia de testing, sign-off QA                  | Test Plan, QA Sign-off                          |
| **QA Engineer**        | Ejecución de tests, bug reporting                   | Test Cases, Bug Reports, Test Execution Report  |
| **Seguridad / CISO**   | Evaluación de seguridad, compliance, sign-off       | Vuln Assessment, DAST Report, Security Sign-off |
| **DevOps**             | CI/CD, entornos, deploy, monitoreo                  | Pipeline config, Rollback Plan, Deploy scripts  |
| **SM**                 | Facilitación, impedimentos, métricas de equipo      | Capacity, Refinement Notes, Retro facilitation  |

### 5.2 RACI por Fase

| Fase            | R (Responsable) | A (Aprueba)               | C (Consultado)    | I (Informado)   |
| --------------- | --------------- | ------------------------- | ----------------- | --------------- |
| Originación     | PME             | Sponsor/CTO               | PO, R&D           | Equipo completo |
| Discovery       | PO + R&D        | PO + R&D (review cruzado) | QA, Seguridad     | PME, SM         |
| Especificación  | PO + IA         | PO + QA                   | R&D, Dev          | PME             |
| Sprint Planning | SM + PO         | PO + TL                   | Dev, QA           | PME             |
| Desarrollo      | Dev             | TL                        | QA (shift-left)   | PO, SM          |
| QA & Testing    | QA              | QA Lead                   | Dev (fix bugs)    | PO, SM          |
| Seguridad       | Seguridad       | CISO                      | Dev (remediación) | PO, PME         |
| Despliegue      | DevOps          | Comité de Cambios         | Dev, QA, Seg      | Todos           |


## 6. Política de Calidad

### 6.1 Estándares de Código

- Ver detalle completo en: `.claude/rules/tech-stack.md`
- **Cobertura mínima**: 80% en lógica de negocio, 60% global
- **Complejidad ciclomática**: máximo 15 por función
- **Duplicación**: máximo 3% de código duplicado
- **Deuda técnica**: se revisa cada sprint, máximo 2 sprints sin abordarla

### 6.2 Estándares de Documentación

| Tipo                     | Ubicación           | Formato              | Idioma         |
| ------------------------ | ------------------- | -------------------- | -------------- |
| Documentación de negocio | Confluence          | Templates estándar   | Español        |
| Documentación técnica    | Confluence + código | Markdown / JSDoc     | Inglés         |
| Tickets y tracking       | Jira                | Campos estándar      | Español        |
| Código fuente + PRs      | GitHub              | Conventional Commits | Inglés         |
| Test management          | TestRail / Xray     | Gherkin (BDD)        | Inglés         |
| Comunicación             | Slack               | Libre                | Español/Inglés |

### 6.3 Versionado de Documentos

- Todo documento versionado con historial de cambios
- Versión semántica para releases: `MAJOR.MINOR.PATCH`
- Conventional Commits para mensajes: `type(scope): description`


## 7. Política de Seguridad

### 7.1 Principio Zero Tolerance

> **0 vulnerabilidades Críticas o Altas en producción.** Sin excepciones.

### 7.2 Pipeline de Seguridad

| Herramienta               | Cuándo                              | Bloquea        | Responsable        |
| ------------------------- | ----------------------------------- | -------------- | ------------------ |
| **SAST** (SonarQube)      | Cada PR                             | Sí (Gate 4)    | Automático + Dev   |
| **SCA** (Snyk/Dependabot) | Cada PR                             | Sí (Gate 4)    | Automático + Dev   |
| **DAST** (OWASP ZAP)      | Pre-release por entorno             | Sí (Gate 6)    | Seguridad          |
| **Pen Testing Manual**    | Funcionalidades con datos sensibles | Sí (Gate 6)    | CISO / externo     |
| **Post-deploy Scan**      | Post-deploy a PROD                  | No (monitoreo) | DevOps + Seguridad |

### 7.3 Gestión de Vulnerabilidades

| Severidad   | SLA de Remediación | Acción                                 |
| ----------- | ------------------ | -------------------------------------- |
| **Crítica** | 24 horas           | Hotfix inmediato, notificación al CISO |
| **Alta**    | 72 horas           | Fix en el sprint actual                |
| **Media**   | Sprint siguiente   | Planificar en backlog                  |
| **Baja**    | 2 sprints          | Backlog técnico                        |

### 7.4 Datos Sensibles

- **PII**: Minimización, cifrado, acceso controlado (RBAC)
- **Biométricos**: GDPR Art. 9, DPIA obligatoria, consentimiento explícito
- **Secrets**: Vault/Secret Manager, rotación periódica, nunca en código
- **Logs**: NUNCA loguear PII, passwords, tokens, datos biométricos


## 8. Política de Comunicación

### 8.1 Canales

| Canal                     | Uso                                      | Frecuencia          |
| ------------------------- | ---------------------------------------- | ------------------- |
| **Slack #project-{name}** | Comunicación diaria del equipo           | Continuo            |
| **Slack #releases**       | Notificaciones de deploy y release notes | Por release         |
| **Slack #incidents**      | Incidentes P1/P2 en producción           | Según ocurrencia    |
| **Jira**                  | Tracking formal de trabajo               | Siempre actualizado |
| **Confluence**            | Documentación duradera                   | Por entregable      |
| **Email**                 | Comunicación con stakeholders externos   | Según necesidad     |

### 8.2 Escalamiento

| Nivel | Condición               | Escala a      | SLA       |
| ----- | ----------------------- | ------------- | --------- |
| L1    | Impedimento técnico     | TL            | 4h        |
| L2    | Bloqueo entre equipos   | SM → PME      | 8h        |
| L3    | Riesgo de timeline      | PME → Sponsor | 24h       |
| L4    | Incidente de producción | CTO + CISO    | Inmediato |


## 9. Herramientas del Ecosistema

| Herramienta          | Propósito                         | Integración IA                                          |
| -------------------- | --------------------------------- | ------------------------------------------------------- |
| **Filesystem**       | Operaciones de archivos locales   | filesystem MCP: lectura, escritura, búsqueda            |
| **Memory**           | Grafo de conocimiento persistente | memory MCP: almacena y recupera contexto entre sesiones |
| **Fetch**            | Obtención de contenido web        | fetch MCP: descarga URLs, extrae contenido              |
| **Jira**             | Tracking, backlog, sprints        | CSV + API scripts (docs/standards/tool-integrations.md) |
| **Xray**             | Test management, casos de prueba  | CSV export/import + scripts                             |
| **GitHub**           | Código fuente, PRs, CI/CD         | GitHub CLI (gh) + scripts                               |
| **Confluence**       | Documentación técnica y funcional | Manual publish con frontmatter preparado                |
| **SonarQube**        | SAST/SCA, calidad de código       | Reportes parseados por skill                            |
| **OWASP ZAP**        | DAST, security scanning           | Reportes parseados por skill                            |
| **Slack**            | Comunicación, notificaciones      | Integración manual (alertas)                            |
| **Docker/K8s**       | Contenedores, orquestación        | N/A (infra)                                             |
| **Datadog/NewRelic** | APM, monitoreo, alertas           | N/A (observabilidad)                                    |


## 10. Checklists y Sign-offs Obligatorios

### 10.1 Checklists (evaluados por IA automáticamente)

La IA DEBE verificar estos checklists en los puntos indicados:

| Checklist           | Cuándo evaluar                                                                      | Referencia                                            |
| ------------------- | ----------------------------------------------------------------------------------- | ----------------------------------------------------- |
| Definition of Ready | Antes de aceptar US en sprint                                                       | skills/refinement-notes/checklists/dor.md             |
| Definition of Done  | Al escribir/editar archivos (hook dtc-write-guard, PreToolUse: Write\|Edit)         | skills/pr-description/checklists/dod.md               |
| Coherencia RF       | Al generar o validar RFs                                                            | skills/{skill-name}/checklists/rf-coherence.md        |
| Review Cruzado PRD  | Al revisar PRD-T vs PRD-F                                                           | skills/{skill-name}/checklists/review-cruzado.md      |
| Security Compliance | Pre-deploy (skill security-checklist, manual)                                       | skills/{skill-name}/checklists/security-compliance.md |
| Post-Deploy         | Post-deploy a producción (DevOps manual + /advance-gate 7)                          | skills/{skill-name}/checklists/post-deploy.md         |
| NFR Compliance      | Pre-deploy: verificación de NFRs (performance, scalability, availability, security) | skills/{skill-name}/checklists/nfr-compliance.md      |
| Repo Structure      | Al crear repositorio: governance, CI/CD, API contracts, architecture, tooling       | skills/{skill-name}/checklists/repo-structure.md      |
| Spec Execution      | Al ejecutar `/lidr-spec-apply` o `/lidr-spec-verify`: Step 0 branch + unit + curl + Playwright + docs + reports por step (AGENT MUST EXECUTE) | `.agents/rules/lidr-sdlc/spec-execution.md` §5        |
| Model Selection     | Al iniciar workflows planning (Opus high) vs implementación (Sonnet medium); self-correct sin pedir confirmación | `.agents/rules/lidr-sdlc/model-selection.md`          |

### 10.2 Sign-offs (requieren firma humana)

| Sign-off          | Gate   | Firmante | Formato                                                |
| ----------------- | ------ | -------- | ------------------------------------------------------ |
| QA Sign-off       | Gate 5 | QA Lead  | skills/test-execution-report/signoffs/qa-signoff.md    |
| Security Sign-off | Gate 6 | CISO     | skills/security-checklist/signoffs/security-signoff.md |

### 10.3 Templates Estándar

| Template          | Uso                                  | Formato                                   |
| ----------------- | ------------------------------------ | ----------------------------------------- |
| Formato RF        | Generación de requisitos funcionales | skills/generate-rf/templates/rf-format.md |
| Sprint Commitment | Compromiso formal de sprint          | docs/standards/sprint-commitment.md       |


## 11. Métricas y Governance

### 11.1 KPIs del Equipo

| Métrica              | Target                     | Frecuencia  | Fuente               |
| -------------------- | -------------------------- | ----------- | -------------------- |
| Velocity             | Estable ±10% entre sprints | Por sprint  | Jira                 |
| % Trabajo arrastrado | < 10%                      | Por sprint  | Jira                 |
| Bug escape rate      | < 5% a producción          | Por release | TestRail + PROD bugs |
| Gate pass rate       | > 85% primer intento       | Por sprint  | Manual / reportes    |
| DoD compliance       | 100%                       | Continuo    | Hooks automáticos    |

### 11.2 DORA Metrics (objetivo medio plazo)

| Métrica                     | Target         | Estado            |
| --------------------------- | -------------- | ----------------- |
| Lead Time for Changes       | < 4 semanas    | En medición       |
| Deployment Frequency        | ≥ 1 por sprint | En implementación |
| Mean Time to Restore (MTTR) | < 4 horas      | En definición     |
| Change Failure Rate         | < 15%          | En definición     |

### 11.3 Governance

- **Revisión de portafolio**: Mensual por PME
- **Health check de proyecto**: Quincenal (métricas de sprint)
- **Escalamiento automático**: Si trabajo arrastrado > 10% o velocity cae > 20%
- **Retrospectiva data-driven**: Con métricas automatizadas del sprint


## 12. Instrucciones para la IA

### 12.1 Comportamiento Esperado

Cuando la IA trabaje en este proyecto, DEBE:

1. **Respetar la cadena de trazabilidad** en todo artefacto generado
2. **Evaluar checklists automáticamente** cuando el contexto lo requiera
3. **Marcar con `[REQUIERE VALIDACIÓN HUMANA]`** toda decisión que implique juicio de negocio
4. **Marcar con `[DATO PENDIENTE]`** toda información que necesite input real del equipo
5. **Nunca inventar datos de negocio** — usar placeholders claros
6. **Seguir los formatos estándar** definidos en skills/{skill-name}/templates/
7. **Referenciar el gate correspondiente** al generar artefactos de cada fase

### 12.2 Prohibiciones

La IA NUNCA debe:

- Generar código que loguee datos biométricos o PII
- Saltarse un gate (sugerir "avanzar sin aprobar")
- Generar estimaciones como hechos (siempre como "sugerencia")
- Tomar decisiones de seguridad sin marcar para revisión del CISO
- Asumir aprobaciones que no se han dado explícitamente
