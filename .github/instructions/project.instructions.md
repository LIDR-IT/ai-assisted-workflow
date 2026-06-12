---
description: LIDR SDLC: Active project context — domain, team, architecture, project-specific rules and current state. The rule that changes most between projects. Tier-1, always loaded.
applyTo: "**"
---

# Rule: Contexto del Proyecto Activo

> **Nivel**: Proyecto (Nivel 1)
> **Carga**: SIEMPRE — la IA necesita este contexto para entender en qué proyecto trabaja.
> **Propósito**: Define el dominio, el equipo, la arquitectura, las reglas específicas y el estado actual del proyecto. Es el rule que más cambia entre proyectos.
> **Metodología**: LIDR SDLC Methodology aplicada al cliente {{CLIENT_NAME}}
> **Fuente de verdad extendida**: docs/projects/sdlc-{{CLIENT_CODE}}.md


## 1. Ficha del Proyecto

| Campo              | Valor                                                                                                                                                         |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Nombre**         | LIDR SDLC Methodology Framework — First Implementation                                                                                                        |
| **Código**         | LIDR-FRAMEWORK-IMPL                                                                                                                                           |
| **Objetivo**       | Validate the LIDR SDLC Methodology framework through real implementation with {{CLIENT_NAME}} team, documenting patterns for scalable multi-client deployment |
| **Sponsor**        | LIDR Consultorias Leadership                                                                                                                                  |
| **Product Owner**  | LIDR Methodology Lead                                                                                                                                         |
| **Tech Lead**      | Lead Engineer — Framework Implementation                                                                                                                      |
| **Estado**         | Framework Development Complete — Client Implementation In Progress                                                                                            |
| **Inicio**         | Q1 2025                                                                                                                                                       |
| **Metodología**    | LIDR SDLC Methodology v1.0.0 — developed by LIDR Consultorias                                                                                                 |
| **Cliente Piloto** | {{CLIENT_NAME}} (configured via client registry)                                                                                                              |
| **Naturaleza**     | **First Implementation** of completed LIDR SDLC Methodology framework to validate with real client and establish patterns for multi-client scaling            |


## 2. Proyecto Context — Multi-Client Framework Implementation

### 2.1 Framework Overview

This project implements the LIDR SDLC Methodology as a portable framework that can be configured for any client industry through the client registry system.

### 2.2 Current Client Configuration

The active client configuration is managed through `src/data/client.ts`. Use `{{CLIENT_NAME}}` variables for client-specific content. Domain-specific terminology, products, and regulatory requirements are defined in client-specific configuration files.

### 2.3 Industry Adaptability

The framework supports multiple industries through Industry Packs:

- **Biometric Identity**: Identity verification, document processing, biometric authentication
- **Healthcare & Life Sciences**: Medical devices, patient data, clinical trials
- **Financial Services & Fintech**: Banking regulations, payment processing, risk assessment
- **Government & Public Sector**: Citizen services, compliance, digital transformation
- **E-commerce & Retail**: Customer experience, inventory management, digital commerce

Each Industry Pack provides:

- Domain-specific glossary and terminology
- Regulatory compliance frameworks
- Industry-standard workflows and patterns
- Specialized skill templates and examples

### 2.4 Client Registry System

Client-specific content is isolated from framework rules through:

- `src/data/clients/{{CLIENT_CODE}}/` - Client configuration directory
- `src/data/client.ts` - Active client management
- Template variables (`{{CLIENT_NAME}}`, `{{CLIENT_CODE}}`) for dynamic content
- Industry Pack selection and configuration


## 3. Equipo del Proyecto

### 3.1 Composición

| Rol                 | Personas | Dedicación | Responsabilidad Principal                               |
| ------------------- | -------- | ---------- | ------------------------------------------------------- |
| **PME**             | 1        | 30%        | Governance, métricas, portafolio, sponsor liaison       |
| **Product Owner**   | 1        | 50%        | PRD Funcional, User Stories, priorización, stakeholders |
| **R&D / Core Lead** | 1        | 40%        | PRD Técnico, arquitectura, PoCs, tech decisions         |
| **Tech Lead**       | 1        | 70%        | Code review, estándares, mentoring, DoD enforcement     |
| **Developers**      | 3-4      | 100%       | Implementación, PRs, handoffs QA                        |
| **QA Lead**         | 1        | 60%        | Test strategy, sign-off, regression                     |
| **QA Engineers**    | 1-2      | 100%       | Test cases, ejecución, bug reports                      |
| **Security (CISO)** | 1        | 20%        | Vuln assessment, DAST, pen test, sign-off               |
| **DevOps**          | 1        | 30%        | CI/CD, entornos, deploy, monitoreo                      |
| **Scrum Master**    | 1        | 40%        | Facilitación, impedimentos, métricas de equipo          |

### 3.2 Capacidad por Sprint (2 semanas)

- **Total bruto**: ~480–560 horas (dependiendo del sprint)
- **Buffer 15%**: ~72–84 horas reservadas
- **Capacidad neta**: ~408–476 horas
- **Commitment target**: 80–90% de capacidad neta
- Ajustar según vacaciones, festivos, y deuda técnica planificada


## 4. Arquitectura del Proyecto

### 4.1 Contexto del Proyecto SDLC-360

Este proyecto específico (la aplicación web de documentación SDLC) usa:

| Capa          | Tecnología                  | Detalle                              |
| ------------- | --------------------------- | ------------------------------------ |
| **Frontend**  | React 18 + TypeScript       | SPA con React Router (data mode)     |
| **Estilos**   | Tailwind CSS v4             | Design tokens en `theme.css`         |
| **Diagramas** | @xyflow/react (React Flow)  | 17+ flujos interactivos              |
| **Build**     | Vite                        | Fast build, HMR                      |
| **Routing**   | React Router v7 (data mode) | `createBrowserRouter` con layouts    |
| **Export**    | html-to-image + jsPDF       | Exportar diagramas como imágenes/PDF |

### 4.2 Estructura de Directorios del Proyecto

```
src/
├── app/
│   ├── App.tsx                           → Entry point con RouterProvider
│   ├── routes.ts                         → Configuración de rutas (17 rutas: 16 named + doc/*)
│   └── components/
│       ├── Layout.tsx                    → Layout con sidebar colapsable
│       ├── WorkflowDiagram.tsx           → Flujo general SDLC (ruta index /)
│       ├── shared/
│       │   ├── FlowComponents.tsx        → Componentes compartidos (Legend, DiagramCard, etc.)
│       │   └── ReactFlowDiagram.tsx      → Wrapper React Flow con helpers n(), e()
│       ├── diagrams/                     → 20 archivos (17 page components + 3 utilidades)
│       │   ├── FaseRequisitos.tsx        → /requisitos
│       │   ├── ProcesoPRD.tsx           → /prd
│       │   ├── RequisitosFuncionales.tsx → /requisitos-funcionales
│       │   ├── PlanificacionSprint.tsx  → /sprint
│       │   ├── ProcesoDesarrollo.tsx    → /desarrollo
│       │   ├── TestingQA.tsx            → /testing
│       │   ├── SeguridadSDLC.tsx        → /seguridad
│       │   ├── EntornosDespliegue.tsx   → /despliegue
│       │   ├── GestionPortafolio.tsx    → /portafolio
│       │   ├── GobernanzaWorkflow.tsx   → /gobernanza · 3 flujos de governance
│       │   ├── PropuestaMejora.tsx      → /propuesta · 6 tabs: flujo, diagnóstico, mejoras, IA, SDD, roadmap
│       │   ├── HandoffsTemplates.tsx    → /handoffs · 35 templates + handoffs, gates, DoR/DoD por fase
│       │   ├── SitemapView.tsx          → /sitemap · Sitemap + árbol de ficheros
│       │   ├── HelpCenter.tsx           → /help · 137 artefactos buscables + 17 workflows
│       │   ├── IntegrityTests.tsx       → /integrity · 36 tests (T1-T36)
│       │   ├── AgentsArchitecture.tsx   → /agents · 6 subagentes + FAQs
│       │   ├── MetricsDashboard.tsx     → Embebido en PropuestaMejora (tab métricas)
│       │   ├── MarkdownViewer.tsx       → /doc/* · Renderizador de .md con DiagramBlock
│       │   ├── DiagramBlock.tsx         → Utilidad: detección y render de diagramas en .md
│       │   └── YamlBlock.tsx            → Utilidad: render de frontmatter YAML
│       ├── ui/                           → Componentes base (shadcn/ui)
│       └── figma/
│           └── ImageWithFallback.tsx
├── imports/                              → Documentos fuente .md y assets
└── styles/
    ├── fonts.css
    ├── index.css
    ├── tailwind.css
    └── theme.css
```

### 4.3 Patrones Específicos del Proyecto

- **Helpers `n()` y `e()`**: Funciones factory para crear nodos y edges de React Flow con estilo consistente
- **Colores por fase**: Cada fase SDLC tiene color asignado (purple=originación, blue=discovery, cyan=especificación, etc.)
- **Named exports**: Todos los componentes de diagrama usan named export
- **Datos como constantes**: Nodos, edges, y datos de tablas definidos como constantes fuera del componente
- **Componentes compartidos**: `Legend`, `DiagramCard`, `PageHeader`, `SectionBox` para consistencia visual


## 5. Entornos del Proyecto

### 5.1 Pipeline de Entornos (para proyectos de producto)

```
DEV → STG → UAT → PRE-PROD → PROD
 │      │     │       │          │
 │      │     │       │          └── Producción. Zero-downtime deploy.
 │      │     │       └────────────── Réplica de PROD. DAST + pen testing.
 │      │     └────────────────────── User Acceptance. PO + stakeholders.
 │      └──────────────────────────── Staging. Integración completa.
 └─────────────────────────────────── Desarrollo. Feature branches.
```

### 5.2 Reglas por Entorno

| Entorno  | Quién despliega            | Datos        | DAST        | Aprobación        |
| -------- | -------------------------- | ------------ | ----------- | ----------------- |
| DEV      | Automático (PR merge)      | Sintéticos   | No          | CI verde          |
| STG      | Automático (develop merge) | Sintéticos   | No          | CI verde          |
| UAT      | Manual (SM/DevOps)         | Anonimizados | No          | QA Lead           |
| PRE-PROD | Manual (DevOps)            | Anonimizados | Sí          | QA + Security     |
| PROD     | Manual (DevOps)            | Reales       | Post-deploy | Comité de Cambios |


## 6. ADRs Vigentes del Proyecto

### ADR-001: React Flow para diagramas SDLC

- **Decisión**: Usar @xyflow/react en lugar de D3.js o Mermaid
- **Razón**: Interactividad nativa (zoom, pan, drag), componentes React, export capabilities
- **Trade-off**: Bundle size mayor que Mermaid; justificado por la interactividad requerida

### ADR-002: Tailwind CSS v4 sin configuración custom

- **Decisión**: Usar design tokens en `theme.css` en lugar de `tailwind.config.js`
- **Razón**: Tailwind v4 usa CSS-first configuration; `theme.css` como fuente de verdad de estilos

### ADR-003: React Router data mode

- **Decisión**: Usar `createBrowserRouter` con data mode en lugar de JSX routes
- **Razón**: Mejor soporte para loaders, actions, y error boundaries; alineado con React Router v7

### ADR-004: Datos de diagramas como constantes

- **Decisión**: Definir nodos/edges como constantes fuera del componente
- **Razón**: Evita re-creación en cada render; facilita exportación y testing

### ADR-005: Sidebar colapsable en desktop

- **Decisión**: Handle clickeable en borde derecho (flechas `<<`/`>>`) que colapsa a 64px (solo iconos con tooltip)
- **Razón**: Maximiza espacio para diagramas manteniendo navegación accesible


## 7. Reglas Específicas del Proyecto

### 7.1 Reglas de Desarrollo

1. Todo RF DEBE tener criterios de aceptación BDD (Given/When/Then) — sin excepción
2. Todo PR DEBE incluir referencia al ticket Jira en título o descripción
3. Todo cambio en API REQUIERE actualización de la OpenAPI spec ANTES de implementar
4. Toda nueva funcionalidad REQUIERE test plan aprobado por QA Lead
5. Todo despliegue a producción REQUIERE Change Request aprobado por el Comité de Cambios

### 7.2 Reglas de IA

6. Todo artefacto generado por IA REQUIERE validación humana antes de considerarse "aprobado"
7. La IA NUNCA modifica datos de producción directamente — solo genera propuestas
8. Todo output de IA que incluya datos de negocio DEBE marcarse con `[REQUIERE VALIDACIÓN HUMANA]`
9. Las reglas de seguridad de org.md aplican sin modificación a este proyecto

### 7.3 Reglas de Documentación

10. Functional documentation language follows the client config (default English; Spanish when the client sets `language: es`) — see `_shared/lidr/integrations/`
11. Código y documentación técnica (inline) en **inglés**
12. PRs y commits en **inglés** (conventional commits)
13. Toda decisión arquitectónica significativa REQUIERE un ADR


## 8. Deuda Técnica Conocida

| ID     | Descripción                                                                                        | Severidad | Impacto        | Estado       | Sprint Objetivo |
| ------ | -------------------------------------------------------------------------------------------------- | --------- | -------------- | ------------ | --------------- |
| TD-001 | Algunos componentes de diagrama superan las 500 líneas                                             | Media     | Mantenibilidad | ⚠️ Pendiente | Q2 2026         |
| TD-002 | Datos mock hardcodeados en componentes (debería ser JSON externo)                                  | Baja      | Testabilidad   | ⚠️ Pendiente | Backlog         |
| TD-003 | Sin tests unitarios para componentes de diagrama                                                   | Alta      | Confiabilidad  | ⚠️ Pendiente | Q2 2026         |
| TD-004 | Tipado incompleto en algunos helpers de React Flow                                                 | Media     | Type safety    | ⚠️ Pendiente | Q2 2026         |
| TD-005 | Sin lazy loading para rutas pesadas                                                                | Media     | Performance    | ⚠️ Pendiente | Q2 2026         |
| TD-006 | ~~79.2% skills con terminología biométrica específica~~ → 100% domain-agnostic + variables cliente | Alta      | Escalabilidad  | ✅ Resuelto  | Q1 2026         |
| TD-007 | Sin tests E2E para la aplicación web                                                               | Media     | Confiabilidad  | ⚠️ Pendiente | Q3 2026         |


## 9. Roadmap del Proyecto

### 9.1 Fases de Entrega

| Fase                | Entregable                                                 | Estado         | Timeline        |
| ------------------- | ---------------------------------------------------------- | -------------- | --------------- |
| **Fase 1**          | Framework Design & Core Skills (60 skills, self-contained) | ✅ Completado  | Q1-Q2 2025      |
| **Fase 2**          | Multi-Client Architecture & Templates                      | ✅ Completado  | Q2-Q3 2025      |
| **Fase 3**          | Quality Enhancement & Domain-Agnostic (179 skills)         | ✅ Completado  | Q3-Q4 2025      |
| **Fase 4**          | Framework Documentation & Integration                      | ✅ Completado  | Q4 2025-Q1 2026 |
| **Fase 5 (actual)** | First Client Implementation & Validation                   | 🔄 En progreso | Q1-Q3 2026      |
| **Fase 6**          | Production Implementation with {{CLIENT_NAME}}             | 📋 Planificado | Q3-Q4 2026      |
| **Fase 7**          | Multi-Client Scaling & Commercial Package                  | 📋 Planificado | Q4 2026-Q1 2027 |

### 9.2 Estado Actual — Primera Implementación (Q1-Q3 2026)

**Objetivo**: Validate LIDR SDLC Methodology through real implementation with {{CLIENT_NAME}} team.

| Componente             | Estado         | Descripción                                           |
| ---------------------- | -------------- | ----------------------------------------------------- |
| Framework Core         | ✅ Completado  | 179 skills, 23 commands, multi-client architecture    |
| Client Configuration   | ✅ Completado  | {{CLIENT_NAME}} registry, domain context, variables   |
| Documentation Cleanup  | 🔄 En progreso | Removing client-specific content from framework rules |
| Production Integration | 📋 Siguiente   | CI/CD hooks, real team testing, production validation |

### 9.5 Fase 9: Escalado PME (Q4 2026 — Planificado)

**Objetivo**: Escalar a ~500 proyectos del portafolio PME con la LIDR SDLC Methodology.

| Tarea                         | Estado         | Descripción                                                          |
| ----------------------------- | -------------- | -------------------------------------------------------------------- |
| Despliegue 10 clientes piloto | 📋 Planificado | 3 Healthcare, 2 Fintech, 2 Government, 2 Insurance, 1 Retail         |
| Training Kit completo         | 📋 Planificado | Slides ejecutivo, workshop 4h, guías por rol, videos, certificación  |
| Productización comercial      | 📋 Planificado | Licenciamiento, pricing tiers, support levels, professional services |
| CLI avanzado                  | 📋 Planificado | Auto-detection de stack, industry inference, validation automática   |
| Métricas portafolio           | 📋 Planificado | Dashboard centralizado de adopción, ROI, quality scores por equipo   |


## 10. Instrucciones para la IA — Contexto de Proyecto

### 10.1 Al Trabajar en Este Proyecto

1. **Usar el glosario**: Los términos del dominio (sección 2.1) se usan con su significado preciso
2. **Respetar ADRs vigentes**: Las decisiones tomadas (sección 6) no se cuestionan sin razón nueva
3. **Conocer la estructura**: Los ficheros están organizados como se describe en sección 4.2
4. **Seguir los patrones**: Helpers `n()`/`e()`, named exports, datos como constantes
5. **Colores por fase**: Mantener la paleta asignada al generar o modificar componentes
6. **Estado del roadmap**: Saber qué está completado, en progreso, y planificado

### 10.2 Contexto Crítico

- Este es un proyecto **piloto** de la **LIDR SDLC Methodology** — escalará a ~500 proyectos del portafolio PME
- El cliente actual es **Docline** pero el ecosistema es **portable a cualquier industria** via client registry + Industry Packs
- La audiencia primaria son **PME, Producto, R&D, QA, Seguridad y DevOps** (de cualquier cliente configurado)
- La app documenta el proceso; no ES el proceso (el proceso vive en Jira, Confluence, GitHub)
- El objetivo final es que cada equipo use la estructura `.claude/` y `docs/` en sus propios repos, configurados con `npx tsx scripts/lidr-init.ts`
