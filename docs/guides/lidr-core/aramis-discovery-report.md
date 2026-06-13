---
id: aramis-discovery-report
version: "1.4.0"
last_updated: "2026-05-14"
updated_by: "PME: Luis Urdaneta"
status: active
type: project
review_cycle: 30
next_review: "2026-06-14"
owner_role: "PME"
---

# Informe de Discovery: Grupo Aramis

> **Tipo**: Informe de diagnóstico AS-IS + propuesta TO-BE  
> **Sesión**: Discovery interview — duración ~2 horas  
> **Metodología aplicada**: LIDR SDLC Methodology v1.0  
> **Estado**: Borrador post-sesión — pendiente validación con Álvaro y David

---

## Resumen Ejecutivo

Aramis Group es una organización con madurez técnica real: equipos estructurados en Tribes/Squads, herramientas modernas, adopción activa de IA generativa, y perfiles senior con iniciativa propia. Luis Marco (PM) opera con un flujo ~70% automatizado mediante un orquestador de agentes propio; Pedro (Product Lead de Ventas) también tiene un orquestador con múltiples agentes y está construyendo el **Polaris Knowledge Agent** (servidor MCP de conocimiento sobre Polaris, conectado a Redmine, GitLab y Notion); el equipo de plataforma creó un MCP proxy para Redmine+GitLab que usan varios miembros del equipo (Ramón, Reme, Dídac entre otros). Sin embargo, **la brecha no es de talento ni de tecnología — es de estandarización**.

Cada persona está haciendo cosas brillantes en su rincón. El reto de LIDR no es introducir conceptos nuevos, sino **crear el lenguaje común, los puntos de control formales y los workflows reproducibles** que conviertan el caos individual en una cadencia predecible de equipo.

**Hallazgos clave:**

- ✅ Gherkin/BDD en tickets, pero sin gate de enforcement pre-desarrollo
- ✅ OpenAPI auto-generada, PHP Stan, Grafana — fundamentos sólidos
- ✅ Luis Marco (PM, Ventas) con orquestador de agentes (~70% flujo automatizado); Pedro (Product Lead, Ventas) con orquestador propio + Polaris Knowledge Agent (MCP); MCP Redmine+GitLab del equipo de plataforma usado colectivamente; Dídac usando Claude Code en code review (~2 semanas)
- ⚠️ Uso de IA no estandarizado — cada perfil hace cosas brillantes en su rincón, sin CLAUDE.md ni framework compartido
- ⚠️ Doble dimensión de code review (técnico vs. funcional) sin protocolo unificado
- ⚠️ Frontend con deuda de testing severa; Cypress se rompe frecuentemente
- ❌ Sin DoD formal: Gherkin existe pero no se valida antes de "ready for dev"
- ❌ Bridge como bomba de tiempo: cambios en Polaris rompen la sincronización sin alertas
- ❌ Release notes inexistentes en Polaris (solo parcialmente en una librería)

**Propuesta de piloto** (tentativa, pendiente de confirmar por Álvaro y David): driver propuesto **Adrián Louro** (Tech Lead de Tribu Compras). Polaris es brownfield; Álvaro mencionó que "lo más parecido a greenfield es un nuevo módulo" — la naturaleza exacta de la iniciativa piloto requiere definición.

---

## 1. Contexto de la Sesión

### 1.1 Participantes

| Nombre           | Rol                                           | Tribe/Squad/Área           | Destacado                                                                                                                                                |
| ---------------- | --------------------------------------------- | -------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Álvaro**       | Director / Liderazgo                          | Liderazgo general          | Sponsor ejecutivo de la iniciativa                                                                                                                       |
| **David**        | Liderazgo técnico                             | Liderazgo general          | Co-responsable de arquitectura                                                                                                                           |
| **Pedro**        | Product Lead de Ventas                        | Tribu Ventas               | Tiene orquestador propio con múltiples agentes; construye el Polaris Knowledge Agent (servidor MCP de conocimiento conectado a Redmine, GitLab y Notion) |
| **Luis Marco**   | Product Manager                               | Tribu Ventas               | ~70% del flujo de definición de iniciativas → historias → criterios automatizado con sistema agéntico propio; usa Antigravity como IDE                   |
| **Reme**         | Engineering Manager                           | Tribu Ventas               | Identificó el pain point de no estandarización de IA (PP-01) y la dualidad técnico/funcional del code review (PP-02)                                     |
| **Ramón**        | Engineering Manager / Developer (rol mixto)   | Tribu Ventas               | Usa el MCP del equipo de plataforma para leer tickets de Redmine y acceder al código en GitLab desde Claude Code                                         |
| **Dídac**        | Software Engineer                             | Tribu Ventas — Backend     | ~2 semanas usando Claude Code para code review dual (técnico + criterios de aceptación); mencionó la falta de guidelines/CLAUDE.md en frontend           |
| **Adrián Louro** | Tech Lead                                     | Tribu Compras              | Propuesto como driver tentativo del piloto LIDR; designado "maestro de VMAT" en esta iniciativa                                                          |
| **Alberto**      | Rol no determinado con precisión en la sesión | Tribu Ventas               | Compartió pantalla mostrando flujo de tickets en Redmine durante la sesión                                                                               |
| **Sheila**       | QA Engineer                                   | Squad (Ventas)             | Responsable de los test plans, identificados como "bastante normalizados" — el tipo de documentación más estructurado de los tres                        |
| **Alejandro**    | Lead Product Designer                         | Diseño / UX (Tribu Ventas) | Usa Google AI Studio (tokens prácticamente ilimitados vía licencia de Google) para prototipos de ideación; integra con Figma y Figma Make                |
| Luis Urdaneta    | Consultor LIDR                                | —                          | Facilitador de la sesión                                                                                                                                 |

> **Nota sobre referencias en la transcripción**:
>
> - **"Marco" = Luis Marco**: confirmado (VTT ≈52:00 Reme: _"Marco, por lo que contaba"_ y ≈1:43:00 Pedro: _"lo que dice Don Marco"_). Es un nickname coloquial de Luis Marco, no un participante adicional.
> - **"Manuel"**: única mención puntual sin contexto suficiente para identificarlo (VTT ≈52:08 Reme: _"Excepto lo que hace Manuel"_). Se ignora como participante no determinado — no se considera adicional al cuadro.
>
> **Equipos organizacionales adyacentes no presentes en la sesión** (mencionados pero sin representación directa):
>
> - **Equipo de Ciberseguridad Aramis Group** (con VP de seguridad): responsable de alertas de vulnerabilidades, escala vía Slack, planea un hook de validación de prompts IA contra datos GDPR (no implementado aún). Fuente: VTT ≈1:39:30, ≈51:00.
> - **Equipo de Plataforma** (representado por Ramón en la sesión): creador del MCP Redmine+GitLab y co-líder de un proyecto de skills con DevOps y Tech Leads. Ramón tiene un **rol dual** confirmado: EM/Dev mixto en Tribu Ventas + representante de Plataforma.
> - **Equipo DevOps**: mencionado como co-participante en el proyecto de skills. No presente en la sesión de discovery — pain points como CI lento (PP-09) requieren su involucramiento.
> - **Departamento de Data Aramis Group**: separado del equipo Polaris, expone APIs internas que Polaris consume (VTT ≈1:16:30 Reme).

### 1.2 Objetivo de la Sesión

Realizar un diagnóstico honesto del estado actual de los procesos de desarrollo: qué funciona, qué falla, dónde están los dolores reales. La sesión sirvió también como primera presentación de la LIDR SDLC Methodology y validación de fit.

---

## 2. Análisis AS-IS

### 2.1 Estructura Organizacional

```
Aramis Group
├── Liderazgo general
│   ├── Álvaro (Director / Sponsor)
│   └── David (Liderazgo técnico)
│
├── Tribu Compras
│   ├── Product Lead (no identificado nominalmente en la sesión)
│   ├── Adrián Louro (Tech Lead)  ← propuesto como driver del piloto LIDR
│   └── 2 Squads (cada uno: 1 PM, 1 EM, 1 QA, 3–4 Software Engineers)
│
└── Tribu Ventas (más madura, más volumen de lógica)
    ├── Pedro (Product Lead de Ventas — innovador IA, Polaris Knowledge Agent)
    ├── Tech Lead de Ventas (no identificado nominalmente en la sesión)
    ├── Luis Marco (PM — usuario IA más avanzado)
    ├── Reme (Engineering Manager)
    ├── Ramón (EM / Developer — rol mixto)
    ├── Alberto (mencionado, rol no precisado)
    ├── Dídac (Software Engineer — backend, refrente técnico de Claude Code)
    ├── Sheila (QA Engineer)
    ├── Alejandro (Lead Product Designer)
    └── 2 Squads (cada uno: 1 PM, 1 EM, 1 QA, 3–4 Software Engineers)
       — equipo "Bravo" identificado como uno de ellos
```

**Observaciones relevantes:**

- Hay **dos tribus diferenciadas**: Compras y Ventas, con Tech Leads independientes
- **Cada tribu se compone de 2 squads** (no uno), más dos roles transversales por tribu: Product Lead y Tech Lead (fuente: VTT)
- A futuro se prevén más tribus (posventa, logística, servicios)
- Los Engineering Managers a veces hacen doble función: gestión + desarrollo (Ramón como ejemplo)
- Los QA Engineers están dentro del Squad (un QA por squad); no son un equipo centralizado
- Pedro y Luis Marco (ambos en Tribu Ventas) son los perfiles con mayor madurez de IA, ambos con orquestadores agénticos propios
- En la sesión, casi todos los participantes pertenecían a Tribu Ventas, excepto Adrián Louro (Tribu Compras)

### 2.2 Ecosistema de Producto

#### Polaris — El producto principal (3 años, brownfield)

El corazón del sistema: un **CRM+ERP interno** desarrollado a medida para las operaciones de Aramis.

> **Modelo de "brand"**: en Polaris cada **brand = un país** integrado en el CRM. Las funcionalidades pueden ser **globales** (aplican a todas las brands) o **específicas de un brand** (drivers locales por país). Este concepto es central para entender los pain points PP-05 (Bridge) y PP-06 (cross-country): una iniciativa nace típicamente de la necesidad de un brand y debe evaluarse contra el resto. Fuente: VTT ≈1:18:00 (Reme).

```
Polaris
├── Backend (PHP, arquitectura hexagonal)
│   ├── PHP Stan (análisis estático)
│   ├── Validadores custom de arquitectura hexagonal en CI
│   ├── OpenAPI auto-generada (code-first, no contract-first)
│   └── Tests unitarios e integración (cobertura razonable)
├── Frontend (framework moderno)
│   ├── Cypress en repo separado (E2E)
│   └── Cobertura de tests débil — especialmente pantallas complejas con lógica condicional
└── Herramientas transversales
    ├── Grafana (monitoring)
    ├── Metabase / Qlik (data analytics, conectadas a algunos flujos IA)
    ├── Figma + Google AI Studio (diseño y prototipos)
    └── Notion (documentación de iniciativas de producto — antes de que lleguen a Redmine)

Bridge (PHP — repositorio independiente)
└── Sincronización Polaris ↔ Sistemas locales por país
    ⚠️ Dependencia oculta: cambios en Polaris pueden romper Bridge silenciosamente
```

#### Stack tecnológico (Polaris)

| Capa                      | Tecnología                                                                       |
| ------------------------- | -------------------------------------------------------------------------------- |
| Backend                   | PHP + **Symfony**                                                                |
| Frontend                  | **Angular** (proyecto principal), **Nuxt** (secundario)                          |
| Base de Datos             | **MySQL + MongoDB**                                                              |
| Cloud / Infra             | **GKE (Google Kubernetes Engine)**, Cloud SQL (Google Cloud)                     |
| Contenedores              | Docker en Kubernetes                                                             |
| E2E Testing               | Cypress (repo separado, no bloqueante en CI)                                     |
| Static Analysis           | PHPStan (integrado en CI — fortaleza)                                            |
| API Docs                  | OpenAPI (auto-generada, code-first)                                              |
| CI/CD                     | **GitLab Pipelines**                                                             |
| Repositorio               | **GitLab**                                                                       |
| DevOps/Infra              | **ArgoCD, Helm, Terraform, Grafana Cloud, Vault, Keycloak, Cloudflare, Ansible** |
| Monitoring                | Grafana                                                                          |
| Analytics                 | Metabase / Qlik                                                                  |
| Project Management        | Redmine                                                                          |
| Product Docs (pre-ticket) | Notion (no mantenida activamente)                                                |
| Design                    | Figma / Figma Make                                                               |
| AI                        | **Claude Code + JetBrains** (frecuente, sin estructura); antes Junie             |

### 2.3 Flujo de Desarrollo Actual

```
[Business Need]
      │
      ▼
[Ticket en Redmine] ◄── PM/EM define requisitos
      │               ◄── Criterios de aceptación en Gherkin (BDD)
      │
      ▼
[Ready for Dev] ◄── Sin gate formal de validación
      │               ⚠️ Gherkin existe pero no se revisa antes de asignar
      │
      ▼
[Desarrollo en feature branch]
      │   ◄── Cada dev usa AI como puede (no estandarizado)
      │   ◄── Branch desde dev, merge a dev
      │
      ▼
[Pull Request / Code Review]
      │   ◄── Revisión inconsistente: técnico vs. funcional (ver Pain Point 2)
      │   ◄── Algunos usan Claude Code para dual review (iniciativa individual)
      │
      ▼
[Merge a dev] ──► [main (producción)]
      │               ⚠️ Sin release notes en Polaris
      │               ⚠️ Sin changelog estandarizado
      │
      ▼
[QA / Testing]
      ◄── Cypress: se rompe cuando se rediseña UI
      ◄── Frontend: baja cobertura en pantallas complejas
```

#### Cadencia de Sprints (confirmada en pre-kickoff survey, 2026-04-07)

| Dato                             | Valor                                                                    |
| -------------------------------- | ------------------------------------------------------------------------ |
| Metodología                      | Scrumban híbrido                                                         |
| Duración                         | 2 semanas                                                                |
| Inicio de sprint                 | **Lunes**                                                                |
| Sprints activos                  | Sprint 1: 13/4, Sprint 2: 27/4, Sprint 3: 11/5/2026                      |
| Completion ratio                 | **70–90%** del backlog comprometido                                      |
| Planning                         | Siempre formal, **1–2 horas** (algunos equipos llegan a 3h — pain point) |
| Participantes planning           | PO, Developers, QA/Testing, Scrum Master                                 |
| Refinement                       | A veces, cuando hay tiempo — **gap confirmado**                          |
| Criterios aceptación al planning | La mayoría de las veces (no siempre — **gap confirmado**)                |
| Capacidad en planning            | Siempre se considera                                                     |
| Ceremonies                       | Daily Standup, Sprint Planning, Retrospectiva — **sin Sprint Review ⚠️** |
| Retrospectivas                   | Cada sprint; action items implementados "la mayoría de veces"            |
| Satisfacción global con planning | Neutral (no positiva)                                                    |

**Gap crítico detectado**: El equipo **no hace Sprint Review** como ceremonia formal. Solo realizan Daily, Planning y Retrospectiva. La validación funcional con stakeholders no tiene un punto de control establecido.

**Principales obstáculos en planning** (survey):

1. Poor estimation (estimaciones poco fiables)
2. Interruptions / urgent requests (trabajo no planificado)
3. Unplanned tech debt (deuda técnica que emerge inesperadamente)

#### Branching Strategy

- `main` = producción
- `dev` = integración continua
- Feature branches por ticket Redmine
- **Flujo de soporte (paralelo)**: en hotfixes de producción, el fix se ramifica **directamente desde `main`** y se mergea de vuelta a `main` sin pasar por `dev`. Cadencia: cuanto antes; el sprint flow es 1 deploy/día acumulado. Fuente: VTT ≈1:02:30 (Dídac).

#### Pre-Code-Review CI Gate (fortaleza confirmada)

Antes de que una PR pase a code review humano, ejecuta una **batería de checks de calidad** en GitLab Pipelines:

| Check                             | Detalle                                                               |
| --------------------------------- | --------------------------------------------------------------------- |
| Unit tests                        | "Highly Effective" (survey)                                           |
| Integration tests                 | Existen aunque cobertura "Weak" (survey)                              |
| **Acceptance tests**              | Explícitamente distintos de E2E — los E2E los gestiona QA con Cypress |
| PHPStan (SAST)                    | Análisis estático del código PHP                                      |
| **Reglas arquitectura hexagonal** | Validadores custom que aseguran cumplimiento de patrones internos     |
| Comandos custom                   | Aseguran que no falten tests, etc.                                    |

Fuente: VTT ≈1:03:00 (Adrián). Esto es un punto de fortaleza relevante que el discovery report inicial no destacaba con claridad.

#### Tooling de IA actual

| Persona                               | Herramienta / Proyecto                                  | Uso                                                                                                                                                                                                                     |
| ------------------------------------- | ------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Luis Marco** (PM)                   | Orquestador de agentes propio (en Antigravity)          | ~70% del flujo (definición de iniciativa → partición en historias → criterios de aceptación) automatizado. Sistema con trazas evaluables; mantiene la primera etapa de definición manualmente por preferencia           |
| **Pedro** (Product Lead)              | Orquestador propio + Polaris Knowledge Agent (MCP)      | Sistemas agénticos: analiza datos, Redmine, tickets, iniciativas de Notion. El Polaris Knowledge Agent es un servidor MCP conectado a Redmine + GitLab + Notion. Objetivo: desplegarlo como servidor con feedback loops |
| **Equipo (vía Ramón, Dídac y otros)** | MCP Redmine+GitLab (creado por el equipo de plataforma) | Servidor MCP del equipo, en realidad un "proxy" con dos conectores (Redmine y GitLab). Permite leer tickets de Redmine y acceder al código en GitLab desde Claude Code. Uso colectivo, no individual                    |
| **Dídac**                             | Claude Code                                             | Code review dual (técnico + criterios de aceptación); ~2 semanas de práctica (desde que tuvo la licencia). Mejor resultado en backend por mejores guías; frontend sin guidelines/CLAUDE.md                              |
| **Alejandro**                         | Google AI Studio                                        | Prototipos de ideación para diseño UX; tokens prácticamente ilimitados vía licencia de Google. Flujo: AI Studio → Figma → código (manual)                                                                               |
| **Todos**                             | Ad hoc                                                  | Cada perfil usa IA a su manera; sin CLAUDE.md compartido, sin skills estandarizados                                                                                                                                     |

### 2.4 Integración con Herramientas

- **MCP Redmine+GitLab** (creado por el equipo de plataforma, uso colectivo): es un "proxy" con dos conectores (Redmine y GitLab). Permite leer tickets directamente desde Claude Code y acceder al código en GitLab. Mencionado por Ramón y Dídac (Reme presente en sesión pero no confirmó uso directo). Se evalúa si reemplazarlo por skills específicos.
- **Polaris Knowledge Agent** (construido por Pedro — en desarrollo): servidor MCP de conocimiento sobre Polaris, conectado a Redmine + GitLab + Notion. Pedro lo monta como anclaje a sus otros agentes; objetivo: desplegarlo como servidor (no solo uso local) con feedback loops.
- **MCP de Grafana** (evaluado, no adoptado): Ramón mencionó que el MCP oficial de Grafana también puede configurarse. Está en la lista de opciones a evaluar pero no se ha integrado al flujo. Fuente: VTT ≈19:50.
- **Proyecto de skills colectivo (en marcha)**: DevOps + Tech Leads + Plataforma están iniciando un proyecto para tener las skills "centralizadas en un sitio", balanceando entre el MCP existente y skills específicas. Fuente: VTT ≈33:00 (Ramón).
- **Canal Slack #Cloud Coders**: canal informal donde el equipo comparte tips, trucos y novedades sobre Claude Code y herramientas IA. Práctica positiva pre-existente de knowledge sharing. Fuente: VTT ≈16:34 (Ramón).
- **Notebook LM (intento fallido)**: el equipo intentó pasar la documentación a Notebook LM de Google y "salió mal" — quedó como aprendizaje, no como solución activa. Fuente: VTT ≈47:00 (Adrián).
- **Figma Make**: bueno para prototipos rápidos con design system existente; limitado para layouts complejos. Webflow Studio se considera mejor para prototipos con mucha interacción (Alejandro).
- **Figma Connect (bloqueado)**: lo han evaluado pero el plan actual de Figma no les da acceso — requiere upgrade. Fuente: VTT ≈32:00 (Alejandro).
- **OpenAPI**: auto-generada (code-first), no es contract-first — el código genera la spec, no al revés.

### 2.5 Estado de la Documentación

El equipo identificó tres categorías de documentación con niveles de madurez muy distintos:

| Categoría                            | Responsable principal | Estado                                                | Observación                                                                                                                  |
| ------------------------------------ | --------------------- | ----------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| **Documentación de producto**        | PM / Notion           | ❌ "Uno de nuestros grandes fracasos"                 | Iniciativas en Notion antes de llegar a Redmine; falta de estandarización; no se mantiene actualizada tras la implementación |
| **Documentación de QA / test plans** | Sheila (QA Engineer)  | ✅ "Bastante normalizado"                             | El único tipo de documentación con estructura consistente en el equipo                                                       |
| **Documentación técnica**            | Equipo de desarrollo  | ⚠️ "Bastante completa pero sin formato estandarizado" | Existe pero cada persona documenta a su manera; no hay template ni convención compartida                                     |

**Implicación para LIDR**: La deuda documental no es uniforme — el primer foco debe ser la documentación de producto (el gap más crítico) y la estandarización técnica. La documentación de QA de Sheila es el modelo a seguir y escalar.

---

## 3. Pain Points Identificados

### PP-01: Uso de IA sin estandarización [PRIORIDAD CRÍTICA]

> _"No tenemos un determinismo a la hora de utilizar la IA. El resultado depende del desarrollador."_ — Reme

**Estado actual:** Cada desarrollador y Engineering Manager usa AI de manera diferente. No hay prompts estándar, no hay CLAUDE.md ni instrucciones compartidas para Claude Code. El resultado de la misma tarea varía según quién la ejecuta.

**Impacto:** Pérdida del ROI de la inversión en licencias. La IA amplifica las diferencias individuales en lugar de nivelarlas. El conocimiento de cómo usar bien la IA es individual y no transferible.

**Análogo en otros clientes:** Patrón universal en la primera implementación. La IA sin framework = herramienta de productividad individual. La IA con framework = ventaja competitiva de equipo.

---

### PP-02: Code Review inconsistente [PRIORIDAD ALTA]

> _"Dependiendo del reviewer, algunos se enfocan más en la parte técnica y otros en si se cumplen los criterios de aceptación."_ — Reme

**Estado actual:** Existen dos dimensiones del code review que no siempre se realizan juntas:

1. **Review técnico**: calidad de código, patrones de arquitectura, no degradar el proyecto
2. **Review funcional**: ¿cumple lo que pedía el ticket? ¿Están todos los criterios de aceptación implementados?

Didac ya está usando Claude Code para hacer ambas dimensiones, pero es iniciativa individual (2 semanas de práctica) y no funciona igual de bien en backend que en frontend (no hay CLAUDE.md para el frontend).

**Impacto:** PRs aprobadas con funcionalidad incompleta; bugs que llegan a QA o a soporte por criterios no implementados.

---

### PP-03: Sin DoD formal — Gherkin sin gate de validación [PRIORIDAD ALTA]

**Estado actual:** El equipo ya escribe criterios de aceptación en Gherkin (buena práctica). Sin embargo, no existe un punto de control formal (gate) que valide estos criterios _antes_ de que el ticket entre en desarrollo. Es posible que un ticket pase a "ready for dev" con criterios ambiguos, incompletos o contradictorios.

**Impacto:** Los defectos de especificación se descubren en desarrollo o en QA — el momento más caro. ATDD (Acceptance Test-Driven Development) propuesto como solución.

**Referencia LIDR:** Gate 2 (Especificación → Sprint Planning) + DoR enforcement.

---

### PP-04: Deuda de testing en frontend [PRIORIDAD MEDIA-ALTA]

> _"La política de testing en el frontend no es tan exhaustiva como la hemos tenido en el backend."_ — Didac

**Estado actual:**

- Pantallas complejas con lógica condicional sin cobertura adecuada
- Tests de Cypress en **repositorio separado** del frontend → desincronización habitual
- Cuando un equipo rediseña una pantalla que desarrolló otro equipo, rompe los tests sin saberlo
- El fallo llega como bug de soporte, no como fallo de CI

**Impacto:** Regresiones invisibles. Pérdida de confianza en la suite de tests (si siempre está rota, nadie la arregla).

---

### PP-05: Bridge — bomba de tiempo silenciosa [PRIORIDAD ALTA]

> _"A veces, cuando desarrollamos dentro de Polaris, estamos rompiendo lo que hay establecido en Bridge para mapeo, lo típico de que te cargas un enum."_ — **David** (Liderazgo técnico), ampliando el comentario previo de Reme sobre sincronización (VTT ≈1:49:14, contexto técnico: "Tenemos Polaris, que tiene estos dos repositorios, backend y frontend...")

**Estado actual:** Bridge es un proyecto PHP independiente que sincroniza Polaris con los sistemas locales de cada brand/país (legacy). Los desarrolladores que trabajan en Polaris no tienen visibilidad sobre qué campos, enums o contratos usa Bridge. Un cambio aparentemente inocente en Polaris (renombrar un enum, cambiar un tipo) puede romper la sincronización sin que los tests de Polaris fallen. **El daño se introduce en tiempo de desarrollo, no en deploy** — esto es relevante porque la solución debe interceptar en code review / pre-CI, no en runtime.

**Impacto:** Incidentes de producción de difícil diagnóstico. El equipo de Polaris no puede estimar el impacto de sus cambios sobre Bridge.

**Oportunidad de automatización:** Un skill/agente que analice los cambios de un PR contra los puntos de integración documentados de Bridge — "Este cambio afecta a Bridge en los siguientes contratos".

---

### PP-06: Incompatibilidad cross-country en features [PRIORIDAD MEDIA]

> _"Que automáticamente podamos hacer ver que esa idea choca con lo que tenemos implementado para otro país o que no es una solución global."_ — Reme

**Estado actual:** Polaris opera en múltiples países con configuraciones locales diferentes. Cuando Producto define una nueva funcionalidad para un país, puede romper o ser incompatible con lo ya implementado para otro. Este análisis de impacto lo hacen manualmente los Engineering Managers en sesiones de challenge con Producto — depende del conocimiento individual de quién esté presente.

**Impacto:** Features que no se pueden desplegar globalmente; retrabajo costoso; decisiones de diseño incorrectas que se descubren tarde.

---

### PP-07: Sin release notes ni changelog en Polaris [PRIORIDAD MEDIA]

**Estado actual:** Un proyecto de librería compartida intenta usar releases "a medias". Polaris no tiene ningún proceso de changelog o release notes. La historia de qué cambió entre versiones no existe formalmente.

**Impacto:** Soporte difícil (¿cuándo se introdujo este comportamiento?), onboarding de nuevos miembros más costoso, comunicación con stakeholders interna sin soporte documental.

**Referencia LIDR:** Skill `release-notes` + command `/create-release-notes` + `/update-changelog`.

---

### PP-08: Claude Code sin contexto estructurado [PRIORIDAD ALTA]

> _"No se comporta tan bien porque no tenemos bien organizado lo de las guidelines y las instrucciones específicas para Claude."_ — Didac

**Estado actual:** El equipo migró de Junie a Claude Code hace ~2 semanas. Claude Code funciona mejor en backend porque hay más documentación existente. En frontend no tiene las mismas guías. No existe CLAUDE.md en ninguno de los repositorios (backend, frontend, Bridge).

**Impacto directo:** El mismo modelo con diferente contexto produce resultados completamente distintos. Sin CLAUDE.md, cada sesión de Claude empieza desde cero sin conocimiento del stack, los patrones del proyecto, ni las decisiones arquitectónicas tomadas.

---

### PP-09: CI pipelines muy lentos — developer experience comprometida [PRIORIDAD ALTA]

> _"CI feedback time: Very slow — breaks developer flow"_ — Pre-kickoff survey

**Estado actual:** El feedback del CI es muy lento, hasta el punto de interrumpir el flujo de trabajo del desarrollador. La calidad percibida del CI/CD como herramienta de enforcement de calidad es **3/5** (survey). Los pipelines lentos son el principal pain en developer experience (survey: "What currently hurts developer experience the most: Slow pipelines").

**Impacto:** Los desarrolladores no esperan el CI para continuar trabajando. Si el feedback tarda mucho, el contexto se pierde y el coste de corregir problemas sube. Reduce la confianza en el CI como gate de calidad.

**Contexto adicional:** En la sesión de discovery se mencionó que el equipo de plataforma tiene ownership sobre los jobs de CI/CD. El DevOps no participó en la sesión de discovery — este pain point requiere involucrar a ese equipo.

**Referencia LIDR:** Gate 4 (Code Quality) requiere CI confiable y rápido. Un CI lento es un gate que se saltea por fricción, no por decisión.

---

## 4. Análisis de Gaps vs. LIDR SDLC Methodology

| Capacidad LIDR                                     | Estado Aramis                  | Gap           |
| -------------------------------------------------- | ------------------------------ | ------------- |
| PRD Funcional + Técnico con review cruzado         | No existe formalmente          | ❌ Crítico    |
| Criterios de aceptación BDD con gate de validación | BDD existe, gate no            | ⚠️ Parcial    |
| Definition of Done formal y enforcement            | Sin DoD                        | ❌ Crítico    |
| Definición de Ready (DoR) antes de sprint          | Sin DoR                        | ❌ Crítico    |
| AI estandarizada con skills/commands               | Uso ad hoc individual          | ❌ Crítico    |
| CLAUDE.md en todos los repos                       | Ninguno                        | ❌ Crítico    |
| Code review dual automatizable                     | Iniciativa individual (Didac)  | ⚠️ Parcial    |
| Release notes y changelog                          | Solo librería, parcial         | ⚠️ Parcial    |
| Análisis de impacto cross-sistema                  | Manual (EM en challenge)       | ⚠️ Parcial    |
| Frontend testing coverage                          | Cobertura débil                | ❌ Alta deuda |
| Contract-first API (spec antes de código)          | Code-first (API auto-generada) | ⚠️ Parcial    |
| Arquitectura documentada (Arc42/C4)                | No documentado                 | ❌ Falta      |
| ADRs para decisiones técnicas                      | No existen                     | ❌ Falta      |
| Análisis de impacto en Bridge                      | No existe                      | ❌ Crítico    |

**Puntos de fortaleza que LIDR debe preservar y amplificar:**

- ✅ Gherkin/BDD en tickets — base excelente para ATDD
- ✅ **Pre-Code-Review CI Gate**: Unit + Integration + Acceptance + PHPStan + validadores hexagonal — fortaleza relevante (VTT Adrián)
- ✅ **Challenge sessions informales** (EM ↔ PM ↔ Designer) — práctica existente que mitiga parcialmente cross-country y Bridge
- ✅ PHPStan + validadores custom de arquitectura hexagonal — SAST ya implementado
- ✅ **SCA parcial**: job CI que verifica vulnerabilidades de paquetes (no en todos los proyectos)
- ✅ **Detección de secretos en CI**: job que bloquea contraseñas en commits (parcial)
- ✅ **Equipo de Ciberseguridad Aramis Group** (con VP): escala alertas, planea hook GDPR sobre prompts IA
- ✅ OpenAPI — contrato de API existe aunque no es contract-first
- ✅ Grafana — monitoring operacional en marcha
- ✅ Luis Marco (PM, Ventas) con orquestador de agentes — flujo ~70% automatizado, caso a documentar y escalar a otras tribus
- ✅ Pedro (Product Lead Ventas) con orquestador propio + Polaris Knowledge Agent — fundamento técnico para consulta de reglas de negocio desde IA
- ✅ MCP proxy Redmine+GitLab del equipo de plataforma — fundamento ya disponible colectivamente para automatización avanzada de desarrollo
- ✅ **Proyecto de skills en marcha** (DevOps + Tech Leads + Plataforma) — iniciativa de estandarización ya activa
- ✅ **Canal Slack #Cloud Coders** — práctica positiva de knowledge sharing IA pre-existente
- ✅ Documentación QA de Sheila — el tipo de documentación más estructurado existente, modelo a escalar a producto y técnico

---

## 5. Propuesta TO-BE

### 5.1 Visión del Estado Deseado

```
[Business Need]
      │
      ▼
[PRD Funcional + Técnico] ◄── Skills: prd-funcional + prd-tecnico
      │               ◄── Review cruzado Producto ↔ Tech Lead
      │
      ▼
[Gate 1: PRD aprobado]
      │
      ▼
[RFs + NFRs con BDD] ◄── Skill: lidr-requirements (per-rf + nfr modes)
      │               ◄── Validación de trazabilidad requisito↔código
      │
      ▼
[Gate 2: Especificación completa]
      │
      ▼
[User Stories → Sprint] ◄── Skill: user-stories (desde RFs)
      │               ◄── DoR validado antes de commit
      │
      ▼
[Desarrollo] ◄── CLAUDE.md en cada repo (BE, FE, Bridge)
      │       ◄── Skill AI estandarizada: create-branch, implement-ticket
      │       ◄── Análisis impacto Bridge automatizado
      │
      ▼
[PR + Code Review dual] ◄── Skill: pr-description
      │                 ◄── Skill: code-review (técnico + criterios)
      │                 ◄── DoD enforcement en gate
      │
      ▼
[Gate 4: Code Quality] ◄── PHP Stan limpio + criterios AC validados
      │
      ▼
[QA] ◄── Test plan generado desde criterios BDD
      │   ◄── Cypress actualizado automáticamente al redesign
      │
      ▼
[Release] ◄── Changelog auto-generado desde PRs
          ◄── Release notes estandarizadas
```

### 5.2 Quick Wins (Sprint 1-2, implementables ahora)

#### QW-01: CLAUDE.md en repositorios backend y frontend de Polaris

**Qué:** Crear un CLAUDE.md en el repo de backend (PHP) y otro en el frontend, que documente:

- Stack tecnológico y versiones
- Patrones arquitectónicos (hexagonal architecture + validadores custom existentes en CI)
- Convenciones de código del proyecto
- Cómo conectarse a Redmine vía MCP para leer tickets
- Guía de code review dual (técnico + funcional)
- Puntos de integración con Bridge (lista de enums y contratos críticos)

**Quién:** Didac (primer driver, ya usa Claude Code) + soporte LIDR  
**Impacto inmediato:** Claude Code en frontend funciona tan bien como en backend; todos los devs parten del mismo contexto

---

#### QW-02: Skill de Code Review dual estandarizado

**Qué:** Formalizar lo que Dídac ya hace individualmente como skill compartida. El workflow propuesto:

1. Lee el ticket de Redmine (vía MCP — que ya usa Ramón)
2. Lee los criterios de aceptación en Gherkin
3. Revisa el diff del PR contra:
   - Estándares técnicos del proyecto (en CLAUDE.md)
   - Criterios de aceptación del ticket
   - Puntos de integración Bridge (si aplica)

**Nota sobre VMAT ≈ BMAD-METHOD**: En la sesión se mencionó repetidamente "VMAT" / "BiMAD" / "Vimad". Tras el análisis de la transcripción, **se concluye con alta confianza que se refieren al framework BMAD-METHOD** (BMAD-METHOD es un framework abierto de IA agéntica para SDLC). Las variantes "VMAT", "BiMAD" y "Vimad" son errores de auto-captioning de la misma palabra "BMAD" pronunciada. Adrián Louro fue designado "maestro de VMAT/BMAD" para el piloto. Esta interpretación queda pendiente de confirmación explícita con el cliente, pero la propuesta LIDR puede asumir compatibilidad con BMAD-METHOD desde ya.

**Quién:** Pedro (conectar Polaris Knowledge Agent) + Dídac (primer usuario del skill) + equipo de plataforma (mantenedor del MCP Redmine+GitLab existente)  
**Impacto:** Homogeniza el estándar de review; libera tiempo de Engineering Managers

---

#### QW-03: Release notes de Polaris — primero manual, luego automatizado

**Qué:** Implementar el proceso de release notes en Polaris desde el próximo sprint. Usar el skill `release-notes` de LIDR que analiza commits y PRs mergeados y genera el changelog automáticamente.

**Quién:** Álvaro / David definen el formato; equipo adopta el proceso  
**Impacto:** Trazabilidad histórica desde hoy; soporte y stakeholders informados

---

### 5.3 Cambios Estructurales (Sprint 3-6)

#### CE-01: Formalizar DoR y DoD en Redmine

**Qué:** Añadir dos checkpoints en el flujo de Redmine:

```
[Backlog] → [DoR Check] → [Ready for Dev] → [In Dev] → [DoD Check] → [Ready for QA] → [Done]
                │                                              │
         Criterios BDD             Criterios técnicos + AC implementados
         Estimación en horas       Code review aprobado
         Dependencias resueltas    Tests verdes
         Impacto Bridge evaluado   PR description completa
```

**Responsable:** Engineering Managers + Tech Leads  
**Acción LIDR:** Adaptar los templates de DoR/DoD de la metodología al contexto específico de Polaris

---

#### CE-02: ATDD — Validación de criterios antes de desarrollo

**Qué:** Antes de que un ticket pase a "Ready for Dev", los criterios de aceptación en Gherkin deben ser revisados por un QA Engineer o EM. Si hay ambigüedad, el ticket vuelve a refinamiento.

Propuesta de workflow en Redmine:

```
Nuevo estado: "Refinement QA" entre "Backlog" y "Ready for Dev"
← QA revisa criterios BDD ←
← AI valida coherencia y detecta ambigüedades ←
```

**Impacto:** Defectos de especificación detectados antes del desarrollo (10x más barato que detectarlos en QA)

---

#### CE-03: Documentación de arquitectura y ADRs (Polaris + Bridge)

**Qué:** Usar el skill `architecture-doc` de LIDR para generar la documentación de Polaris siguiendo Arc42/C4. Priorizar la documentación de los puntos de integración entre Polaris y Bridge.

**Por qué Bridge primero:** Es el mayor riesgo silencioso. Un catálogo documentado de los contratos entre Polaris y Bridge permite:

1. La IA analizar el impacto de un PR automáticamente
2. Los devs de Polaris conocer qué no pueden cambiar sin coordinación
3. La detección temprana de breaking changes

**Responsable:** David + Álvaro (arquitectura) + Didac (implementación técnica)

---

#### CE-04: Piloto LIDR — PRD completo en iniciativa de alcance acotado

**Qué:** Un squad (a definir por Álvaro/David; Adrián Louro propuesto como driver) ejecuta el flujo LIDR completo en una iniciativa lo más "greenfield" posible:

1. PRD Funcional + Técnico con review cruzado
2. RFs con BDD y validación de trazabilidad
3. Épicas → User Stories → Sprint Planning
4. Desarrollo con CLAUDE.md activo
5. PR description + code review dual
6. Release notes al merge

**Nota sobre "greenfield":** Polaris es un proyecto ya empezado (3 años, brownfield). Álvaro indicó que "lo más parecido a greenfield es un nuevo módulo". Algunos squads tendrán iniciativas con repositorio nuevo; otros (como el equipo "Bravo") trabajarán dentro de Polaris.  
**Por qué un alcance acotado:** Menor riesgo de romper Polaris. Permite demostrar el flujo completo sin presión.  
**Duración estimada:** 1 sprint completo para el flujo de especificación; 2-3 sprints para validar el flujo de desarrollo.

---

### 5.4 Automatización Avanzada (Sprint 7+)

#### AA-01: Bridge Impact Analyzer

**Qué:** Skill/agente que, dado un PR en Polaris, analiza qué cambios tienen el potencial de romper contratos con Bridge:

- Cambios en enums, types, o modelos compartidos
- Cambios en rutas API que Bridge consume
- Cambios en esquema de base de datos en tablas sincronizadas

**Output:** Comentario automático en el PR: "Este cambio afecta a Bridge. Contratos impactados: [lista]. Se requiere coordinación con equipo Bridge antes de merge."

---

#### AA-02: Cross-Country Feature Compatibility Check

**Qué:** Agente que, dado un nuevo requerimiento de Producto, analiza la base de código para detectar:

- Configuraciones de países que podrían ser incompatibles con la nueva feature
- Funcionalidades ya implementadas para otros países que podrían entrar en conflicto

**Output:** Informe de compatibilidad para el Engineering Manager antes de comenzar el design

---

#### AA-03: Cypress Auto-Update al redesign

**Qué:** Cuando se detecta un cambio significativo en la UI de Polaris (rediseño de componentes, cambio de estructura), un agente sugiere o genera automáticamente las actualizaciones necesarias en los tests de Cypress.

**Técnicamente:** Playwright MCP + análisis de diff de componentes + regeneración de selectores

---

#### AA-04: Integración de innovaciones internas en el framework LIDR

Aramis tiene tres proyectos de IA avanzados que deben integrarse con LIDR en lugar de operar en paralelo:

**Luis Marco — Orquestador de agentes (PM, Ventas)**

- Documentar el flujo (~70% automatizado: definición de iniciativa → partición en historias → criterios de aceptación) como LIDR skill formal
- Convertirlo en referencia para el equipo de PM de las otras tribus
- Extraer los prompts y patrones como templates LIDR

**Pedro — Orquestador propio + Polaris Knowledge Agent (Product Lead, Ventas)**

- Formalizar el Polaris Knowledge Agent como LIDR agent de dominio: permite a cualquier dev o PM consultar reglas de negocio de Polaris directamente
- Conectar con los skills de generación de requisitos (PRD, RFs) para que la IA tenga contexto de negocio real
- Documentar el protocolo de despliegue como servidor (objetivo declarado de Pedro)
- Coordinar los múltiples agentes especializados de Pedro (datos, Redmine, tickets, Notion, ideación)

**Equipo de plataforma — MCP Redmine+GitLab**

- Estandarizar como conexión oficial del ecosistema LIDR con Redmine y GitLab
- Convertir el workflow de "leer ticket → plan de desarrollo" en skill formal `implement-ticket`
- Evaluar si reemplazarlo por skills específicos (decisión que el equipo ya está balanceando)

**Impacto:** Las innovaciones se vuelven patrimonio del equipo. Ningún conocimiento queda atrapado en una persona.

---

## 6. Roadmap de Implementación

### Fase 0: Fundamentos (semana 1-2)

| Tarea                                                                   | Responsable                   | Dependencia       |
| ----------------------------------------------------------------------- | ----------------------------- | ----------------- |
| CLAUDE.md en repo backend (PHP/Polaris)                                 | Didac + LIDR                  | Ninguna           |
| CLAUDE.md en repo frontend (Polaris)                                    | Didac + LIDR                  | CLAUDE.md backend |
| Selección de iniciativa piloto y squad ejecutor (decisión Álvaro/David) | Adrián Louro + Álvaro + David | Ninguna           |
| Skill code review dual — primera versión                                | Pedro (VMAT)                  | CLAUDE.md         |

### Fase 1: Piloto (sprint 1-2)

| Tarea                                                | Responsable                | Dependencia    |
| ---------------------------------------------------- | -------------------------- | -------------- |
| PRD Funcional de la iniciativa piloto (alcance: TBD) | PM del squad piloto + LIDR | CLAUDE.md      |
| PRD Técnico + review cruzado                         | Adrián + PM                | PRD Funcional  |
| RFs con BDD + validación de trazabilidad             | LIDR guía                  | PRDs aprobados |
| Épicas → User Stories                                | PM + Adrián                | RFs            |
| Sprint Planning con DoR                              | Álvaro / SM                | User Stories   |

### Fase 2: Estructuración (sprint 3-4)

| Tarea                                      | Responsable           | Dependencia     |
| ------------------------------------------ | --------------------- | --------------- |
| Formalizar DoR en Redmine                  | EMs + David           | Piloto completo |
| Formalizar DoD con gate de code review     | TLs + LIDR            | Piloto completo |
| Release notes Polaris — primer ciclo       | Álvaro decide proceso | DoD aprobado    |
| Documentación arquitectura Polaris (Arc42) | David + Didac         | LIDR skill      |

### Fase 3: Escalado (sprint 5-8)

| Tarea                                                          | Responsable   | Dependencia       |
| -------------------------------------------------------------- | ------------- | ----------------- |
| Extender LIDR a segunda tribu (squad por confirmar con Álvaro) | Reme + LIDR   | Piloto exitoso    |
| Bridge Impact Analyzer — v1                                    | Pedro + Didac | Arq. documentada  |
| ATDD workflow en Redmine                                       | EMs + QA      | DoR/DoD activos   |
| Retrospectiva y ajuste del framework                           | Todos         | Sprint 4 completo |

---

## 7. Próximos Pasos Acordados en la Sesión

1. **Álvaro y David** definen la iniciativa piloto y el squad que la ejecutará (Adrián Louro propuesto como driver, pendiente de confirmar); aclarar si será un módulo "casi-greenfield" dentro de Polaris o un repositorio nuevo
2. **Adrián Louro** confirmó en sesión su rol como "maestro de VMAT/BMAD" en el piloto — referente del framework LIDR para su tribu
3. **Pedro** continúa el desarrollo del Polaris Knowledge Agent; explorar integración con los skills LIDR de especificación
4. **Luis Marco** documenta su flujo de orquestador de agentes para convertirlo en referencia compartida (LIDR skill)
5. **Equipo de plataforma + DevOps + Tech Leads** comparte la configuración del MCP Redmine+GitLab existente y el proyecto de skills en marcha para alineamiento con LIDR
6. **Dídac** valida el CLAUDE.md de backend en una sesión de trabajo con LIDR
7. **Luis (LIDR)** prepara el template de CLAUDE.md adaptado a PHP + Symfony (arquitectura hexagonal) + integración con el MCP de Redmine
8. **Confirmar con el equipo que VMAT = BMAD-METHOD** (alta confianza tras análisis VTT, pero requiere validación explícita)
9. **Coordinar con el equipo de Ciberseguridad Aramis Group** para alinear el hook GDPR planeado sobre prompts IA con los skills LIDR de validación
10. **Evaluar el MCP de Grafana** como complemento al MCP Redmine+GitLab para observabilidad en flujos IA

---

## 8. Notas Adicionales para LIDR

### Sobre los Innovadores Internos — La Oportunidad más Grande de LIDR

Aramis tiene al menos tres perfiles construyendo soluciones de IA avanzadas de forma independiente:

**Luis Marco (PM, Tribu Ventas)** — Por explícito en la sesión, ~70% de su flujo (definición de iniciativa → partición en historias → criterios de aceptación) está automatizado con un orquestador de agentes propio en Antigravity. Usa sistema de trazas evaluables. Mantiene la primera etapa de definición manual por preferencia, para no perder destreza. Es el caso de uso a documentar primero y escalar al resto de PMs. Debe sentir que LIDR formaliza y amplifica lo que ya hace, no que lo reemplaza.

**Pedro (Product Lead de Ventas)** — Tiene un sistema agéntico completo con un orquestador y agentes especializados (datos, Redmine, tickets, Notion, ideación). Además construye el Polaris Knowledge Agent: un servidor MCP que permite consultar reglas de negocio de Polaris y datos de Redmine/GitLab/Notion desde Claude Code. Está en fase de despliegue como servidor (objetivo declarado: que no sea solo uso local, añadir feedback loops). Su alianza con LIDR es estratégica: si el Knowledge Agent se integra con los skills de especificación (PRD, RFs), la IA tendría contexto de negocio real al generar artefactos.

**Equipo de plataforma + usuarios (Ramón, Dídac, Reme, otros)** — El equipo de plataforma creó un MCP "proxy" con dos conectores (Redmine y GitLab). Permite leer tickets de Redmine y acceder al código en GitLab directamente desde Claude Code. Es un punto de partida para estandarizar el workflow `/implement-ticket`. El equipo ya está debatiendo si reemplazarlo por skills específicos.

**Mensaje para LIDR:** La propuesta no es "adopta LIDR y abandona lo que haces" sino "LIDR es el lenguaje común que conecta vuestras innovaciones individuales en una ventaja de equipo".

### Sobre Bridge

Este es el mayor riesgo técnico del cliente y el que menos atención recibe actualmente. Un incidente grave de sincronización en producción es inevitable si no se documenta y protege este contrato. La propuesta del Bridge Impact Analyzer tiene potencial de ser el "killer feature" que justifique por sí sola la inversión en LIDR para la parte técnica.

### Sobre la Dualidad de Code Review

La distinción que hace Reme (técnico vs. funcional) es exactamente la distinción entre DoD técnico y DoD de negocio en LIDR. El equipo ya piensa en estos términos — solo necesita el framework que lo haga explícito y automatable.

### Sobre Cypress en Repo Separado

Este es un antipatrón conocido. Los tests E2E en repo separado crean deuda estructural porque los devs no tienen friction inmediata cuando rompen un test. La solución correcta es traer los tests al mismo repo (o al menos crear CI que ejecute los tests de Cypress en el pipeline del frontend), pero es una decisión de mayor alcance que requiere consenso del equipo.

### Sobre Google AI Studio vs. Claude

El equipo de diseño usa Google AI Studio (tokens ilimitados via workspace). Hay una oportunidad de unificar el flujo de diseño (Figma → AI Studio) con el flujo de especificación (LIDR skills via Claude). Pedro podría ser el nexo técnico para esa integración.

### Sobre el Equipo de Ciberseguridad Aramis Group

Existe un equipo central de Ciberseguridad a nivel de Aramis Group con un VP de seguridad. Sus funciones detectadas en la sesión:

- Escala alertas de vulnerabilidades vía Slack al equipo de desarrollo
- Sugiere prácticas (e.g., `.gitignore` para archivos sensibles, AI ignore para algunas rutas)
- **Tiene planeado un hook de validación de prompts IA** contra datos GDPR antes de que lleguen a los LLMs — no implementado aún

Para LIDR esto es una **oportunidad estratégica**: el hook GDPR de Ciberseguridad puede integrarse como un PreToolUse hook en el ecosistema Claude Code, alineado con los skills LIDR de validación de prompts (`vuln-assessment`, `security-checklist`). Convertir una iniciativa pendiente del equipo de seguridad en una capacidad estándar del framework.

### Sobre el Pre-Code-Review CI Gate

El equipo ya tiene una **batería robusta de checks** que se ejecutan antes del code review humano: unit + integration + acceptance + PHPStan + validadores custom de arquitectura hexagonal. Esto está más cerca del estado deseado LIDR Gate 4 (Code Quality) de lo que la primera versión del discovery report reflejaba. La propuesta LIDR debe **preservar y extender** este gate, no reemplazarlo. Las extensiones lógicas:

- Verificación automática de criterios de aceptación (AC del ticket vs código)
- Análisis de impacto sobre Bridge (PP-05)
- Análisis cross-country (PP-06)
- Verificación de CLAUDE.md actualizado en cada repo

### Sobre el Proyecto de Skills Colectivo

El equipo de Plataforma + DevOps + Tech Leads ya está iniciando un proyecto interno para "tener las skills centralizadas en un sitio". Esto es paralelo y compatible con LIDR. La estrategia recomendada:

- LIDR aporta el **framework de organización** (taxonomía, gates, ciclo de validación)
- El equipo aporta las **skills específicas de su dominio** (Redmine, GitLab, Polaris, Bridge)
- Decisión pendiente del equipo: skills específicas vs MCP proxy — LIDR puede ayudar a balancear con criterios objetivos

### Sobre el Modelo "brand = país"

Cada brand en Polaris representa un país integrado en el CRM. Esta arquitectura multi-tenant por país explica:

- Por qué Bridge existe (sincronizar con sistemas legacy por brand)
- Por qué el riesgo cross-country (PP-06) es crítico
- Por qué la documentación de producto es difícil (varía por brand)
- Por qué las iniciativas frecuentemente nacen de un brand pero requieren validación global

Cualquier skill LIDR para PRD/RF debe considerar la dimensión "global vs. brand-specific" como atributo obligatorio.

---

## 9. Prioridades Confirmadas — Pre-Kickoff Survey (2026-04-07)

> Respuestas directas del equipo de Aramis antes del kick-off del programa AI4Devs.

### 9.1 Madurez de Ingeniería (self-assessment)

**Score global: 4/5** — El equipo se percibe con madurez técnica alta. Esto es consistente con los hallazgos del discovery (PHPStan, BDD, AI innovators).

### 9.2 Principales Restricciones Técnicas Actuales

El equipo identificó los siguientes pain points como sus restricciones técnicas más importantes:

1. **Development speed** — velocidad de entrega insuficiente
2. **Lack of reliable tests** — tests no confiables (flaky, cobertura débil en integración y E2E)
3. **High cognitive load / complexity** — alta complejidad en el codebase
4. **Inefficient use of AI** — uso ineficiente de IA (confirma la necesidad del programa)
5. **Code quality / production incidents** — calidad de código e incidentes en producción

### 9.3 Top 3 Prioridades del Programa (respuesta directa del equipo)

| Prioridad | Objetivo                                                                                                   |
| --------- | ---------------------------------------------------------------------------------------------------------- |
| **1**     | **Increase development speed and productivity** — velocidad y productividad como métrica principal         |
| **2**     | **Maintain high and consistent code quality standards** — estándares de calidad altos y consistentes       |
| **3**     | **Increase E2E test coverage and improve their maintainability** — cobertura E2E y mantenibilidad de tests |

**Implicación para LIDR**: El equipo es pragmático — quieren resultados medibles en velocidad y calidad, no adopción de metodología por el hecho de adoptarla. El programa debe demostrar ROI tangible en estas tres dimensiones desde los primeros sprints.

### 9.4 Criterios de Éxito / KPIs que el Equipo Medirá

> _"At the end of the program, what outcomes would make you consider it a success?"_

| KPI                        | Métrica objetivo                                                                                                                  |
| -------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| **Task lead time**         | Reducción en el tiempo de inicio a entrega de tareas                                                                              |
| **Features entregadas**    | Aumento en el número de features desarrolladas por sprint                                                                         |
| **Lead time de bug fixes** | Reducción en el tiempo de detección → resolución de bugs                                                                          |
| **Bugs AI vs. humanos**    | **"Fewer bugs introduced by AI than by humans"** — el equipo espera que la IA sea más precisa que el desarrollador sin asistencia |

**Nota crítica**: El KPI de "fewer bugs by AI than by humans" es una expectativa de alto nivel — implica que el equipo considera que la IA puede y debe ser más precisa que el dev no asistido. LIDR debe gestionar esta expectativa: la IA con framework reduce bugs, pero el objetivo es reducción relativa (AI-assisted vs. unassisted), no cero defectos.

### 9.5 Estado de Adopción IA (self-assessment del equipo)

| Dimensión                    | Score survey | Observación                                         |
| ---------------------------- | ------------ | --------------------------------------------------- |
| Calidad del output IA        | **Alto**     | El equipo ya percibe valor real                     |
| Integración en workflow      | **Medio**    | Frecuente pero no estructurada                      |
| Adecuación de herramientas   | **Bajo**     | Las herramientas actuales no cubren las necesidades |
| Seguridad y compliance       | **Medio**    | Conciencia del riesgo pero sin framework            |
| Compartición de conocimiento | **Bajo**     | Innovaciones individuales sin transferencia         |
| Guidelines claras de IA      | **No**       | Ausentes — confirma PP-01                           |

**Bloqueador de adopción identificado**: El equipo menciona explícitamente el riesgo de **"not seeing the value of AI adoption — not as a game changer"**. Esto significa que si el programa no demuestra valor tangible rápidamente, la adopción se perderá a pesar de los early adopters.

---

## Changelog

| Versión | Fecha      | Autor              | Cambios                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| ------- | ---------- | ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1.4.0   | 2026-05-14 | PME: Luis Urdaneta | Segunda auditoría de coherencia (diagramas Aramis ↔ VTT ↔ CSV ↔ report). Cambios principales: **(A1)** SCA y detección de secretos reclasificados de "ausente" a "parcial por proyecto" (existe job CI de vulnerabilidades y de secretos); **(A2)** añadido el equipo de **Ciberseguridad Aramis Group** con VP y plan de hook GDPR (no implementado); **(A3)** clarificado que **VMAT ≈ BMAD-METHOD** (transcripción auto-captioning errors: "BiMAD", "Vimad", "VMAT" son la misma palabra "BMAD"); **(A4)** re-atribuido quote PP-05 ("te cargas un enum") a **David** (Liderazgo técnico), no anónimo; **(B1)** añadido **flujo de soporte** paralelo (hotfix directo a `main`, sin pasar por `dev`); **(B2)** añadido **Pre-Code-Review CI Gate** explícito como fortaleza (Unit + Integration + Acceptance + PHPStan + validadores hexagonal); **(B3)** añadido proyecto de skills (DevOps + Tech Leads + Plataforma) y canal Slack #Cloud Coders; **(B4)** añadido MCP Grafana como opción evaluada; **(B5)** añadidas challenge sessions informales EM↔PM↔Designer; **(B6)** introducido el concepto **brand = país** como modelo arquitectónico crítico; **(C3)** removida Reme como usuario directo del MCP (presente pero no confirmó uso); **(C4)** clarificado que Ramón tiene rol **dual**: EM/Dev Ventas + representante Plataforma; **(C5)** corregido "segonal" → **"hexagonal architecture"** en 2 ocurrencias; **(C7)** confirmado "Marco" = Luis Marco (nickname); "Manuel" descartado como participante no identificable. Bump de versión y next_review a 2026-06-14. |
| 1.3.0   | 2026-05-11 | PME: Luis Urdaneta | Auditoría de veracidad contra fuentes (VTT + CSV survey): (1) Corregido rol Pedro: Product Lead de **Ventas** (no transversal); (2) Añadido que Pedro también tiene orquestador con múltiples agentes; (3) Re-atribuido MCP Redmine+GitLab al **equipo de plataforma** (no exclusivo de Ramón); (4) Corregida estructura org: cada tribu tiene **2 squads**, no 1; añadido equipo "Bravo"; (5) Re-atribuido quote de Bridge ("te cargas un enum") a "miembro del equipo" (no Álvaro/David); (6) Removidas filas inventadas de "Manuel" y "Marco - Developer" (rol no verificable en VTT) — nota aclaratoria pendiente; (7) Marcada propuesta de piloto como **tentativa** (Adrián como driver propuesto, no confirmado; greenfield no posible en Polaris brownfield); (8) Detalles añadidos: Antigravity como IDE de Luis Marco, agentes especializados de Pedro, MCP como proxy con dos conectores                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| 1.2.0   | 2026-05-07 | PME: Luis Urdaneta | Integración pre-kickoff survey (2026-04-07): stack tecnológico completo (Symfony, Angular/Nuxt, MongoDB, GKE, ArgoCD+Helm+Terraform+Vault+Keycloak+Cloudflare+Ansible, JetBrains); cadencia de sprints con métricas reales (70–90% completion, lunes, Scrumban); gap de Sprint Review; PP-09 CI lento; Sección 9 con prioridades del programa, KPIs del equipo y self-assessment de madurez IA                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| 1.1.0   | 2026-05-06 | PME: Luis Urdaneta | Auditoría profunda contra transcripción VTT: añadidos 6 participantes faltantes (Luis Marco, Alejandro, Ramón, Sheila, Alberto, Manuel); corregida estructura de dos tribes (Compras + Ventas); corregida atribución Pedro (Polaris Knowledge Agent, no orquestador); añadida sección documentación (3 categorías); corregida atribución MCP (Ramón); añadida Notion al toolset; expandidas notas sobre innovadores internos; aclarado VMAT                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| 1.0.0   | 2026-05-06 | PME: Luis Urdaneta | Versión inicial post-sesión de discovery                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
