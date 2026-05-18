---
id: client-discovery-interview-manual
version: '3.2.0'
last_updated: '2026-04-06'
updated_by: 'TL: Lead Engineer'
status: active
type: guide
review_cycle: 90
next_review: '2026-07-05'
owner_role: 'PME'
---

# Manual de Entrevista: Discovery de Clientes SDLC

> **Objetivo**: Evaluar la madurez de procesos SDLC, metodologías, herramientas, comunicación entre equipos y adopción de IA en la organización del cliente, y guiar hacia la selección de **un proyecto piloto** concreto para implementar LIDR.
>
> **Alcance**: Evaluamos **cómo trabajan** (procesos, herramientas, comunicación, IA en el SDLC), NO su producto, modelo de negocio ni usuarios finales. El contexto de negocio se recoge solo para calibrar tamaño, regulaciones y complejidad.
>
> **Principio clave**: La empresa puede tener 20 proyectos y 15 equipos. Necesitamos el panorama completo, pero **aterrizar en UN proyecto** con UN equipo para el piloto.

---

## 📋 Marco Metodológico y Preparación

### Frameworks que Guían Esta Entrevista

- **SPIN Selling** (Rackham) — Progresión: Situation → Problem → **Implication** → **Need-Payoff**. Las preguntas marcadas con [I] y [NP] son las que construyen urgencia y hacen que el cliente articule el valor de la solución.
- **Gap Analysis** (McKinsey) — Current State → Desired State → Gap. Cada sección incluye preguntas de "¿dónde quieren estar?" además de "¿dónde están?"
- **DORA + CMMI** — Métricas cuantitativas (DORA 4 key metrics) + niveles de madurez por proceso (1-5). La sección 3 incluye una tabla de scoring por fase SDLC.
- **IMPACT** (Land-and-Expand) — Criterios ponderados para selección de piloto en sección 8.
- **Técnica de Embudo** — Cada sección empieza con preguntas abiertas (Nivel 1) y va estrechando a específicas (Nivel 3-4). Nunca empezar interrogando.

### Secuencia Recomendada de Entrevistados

> Si hay múltiples sesiones, **nunca mezclar niveles jerárquicos** en la misma sesión.

| Orden | Quién                          | Por qué                                                      |
| ----- | ------------------------------ | ------------------------------------------------------------ |
| 1ro   | Champion/Coach interno         | Contexto político, historia, qué intentaron antes            |
| 2do   | Practitioners (devs, QA, ops)  | Ground truth — workflows reales, no los documentados         |
| 3ro   | Middle management (TL, EM, PM) | Visión de proceso, métricas, trade-offs                      |
| 4to   | Senior leadership (CTO, VP)    | Visión estratégica — ya armado con ground truth para validar |

### Checklist Pre-Entrevista

- [ ] **Investigar empresa**: Web, LinkedIn, sector, tamaño, productos principales
- [ ] **Mapear portfolio**: ¿Cuántos productos/proyectos? ¿Cuántos equipos?
- [ ] **Investigar adopción IA**: ¿Mencionan IA en web/blog/job postings?
- [ ] **Preparar hipótesis**: Basado en investigación, ¿cuáles son los 3 pain points más probables?
- [ ] **Identificar Buying Roles** (Miller Heiman): Economic Buyer (aprueba budget) / User Buyer (usará la solución) / Technical Buyer (puede vetar) / Coach (aliado interno)
- [ ] **Configurar grabación**: Obtener consentimiento para transcripción
- [ ] **Definir duración y participantes**: ¿Una sesión o dos? ¿Qué secuencia de entrevistados?

### Documentos Necesarios

- [ ] Este guión de entrevista
- [ ] Plantilla de notas (sección post-entrevista)
- [ ] Tabla de IA por fase SDLC (sección 2C) y tabla de métricas del piloto (sección 8C)

---

## 🎯 Estructura de la Entrevista (95-175 min) — Optimizada

### Tiempos Recomendados por Sección

| Sección                                              | Startup (<50p) | Scale-up (50-200p) | Enterprise (>200p) |
| ---------------------------------------------------- | -------------- | ------------------ | ------------------ |
| **1. Contexto Organizacional (portfolio + equipos)** | 10 min         | 15 min             | 20 min             |
| **2. Madurez y Estrategia de IA** ⭐                 | 20 min         | 25 min             | 30 min             |
| **3. Evaluación SDLC (procesos por fase)** ⭐        | 30 min         | 40 min             | 50 min             |
| **4. Dolores → Desired State → Gaps (SPIN)**         | 15 min         | 20 min             | 25 min             |
| **5. Herramientas & Integraciones**                  | 10 min         | 10 min             | 15 min             |
| **6. Stakeholders + Change Readiness**               | 5 min          | 10 min             | 10 min             |
| **7. Selección de Proyecto Piloto** ⭐               | 10 min         | 15 min             | 20 min             |
| **8. Cierre & Propuesta**                            | 5 min          | 5 min              | 5 min              |
| **Total estimado**                                   | ~95 min        | ~140 min           | ~175 min           |

### ⏰ **Timing Alerts & Checkpoints**

- **CHECKPOINT 30min**: ¿Portfolio mapeado + AI maturity baseline identificada?
- **CHECKPOINT 60min**: ¿Top 3 pain points SDLC identificados + implicaciones cuantificadas?
- **CHECKPOINT 90min**: ¿Piloto seleccionado + team identificado + métricas base definidas?
- **🚨 ESCAPE HATCH**: Si a los 60min no hay dolor claro → explorar timing/readiness

> **Estrategia por duración disponible:**
>
> - **Sesión única 90 min**: Secciones 1, 2, 4, 7 — panorama, IA, dolores, y aterrizar en piloto. Agendar follow-up técnico.
> - **Sesión única 120 min**: Secciones 1-4, 7, 8 — suficiente para propuesta con piloto.
> - **Dos sesiones**: S1 (90 min) = Secciones 1-4. S2 (60 min) = Secciones 5-8. Ideal para enterprise.
> - **Sesión completa 3h**: Todo el guión.

---

## 1️⃣ Contexto Organizacional (15-25 min)

### Objetivos de Esta Sección

- Calibrar: sector, regulaciones, tamaño, complejidad — solo para contextualizar el SDLC
- Mapear portfolio de proyectos y estructura de equipos
- Entender motivación y urgencia de la mejora

### Preguntas de Calibración

#### **A. Sector y Regulaciones** (solo contexto para el SDLC)

- **¿Podrían contarme brevemente a qué se dedica la empresa y en qué sector operan?**
  - _Follow-up_: ¿Hay regulaciones que les imponen procesos obligatorios? (GDPR, HIPAA, PCI-DSS, SOX)
  - _Profundizar_: ¿Compliance o certificaciones que afectan cómo desarrollan? (auditorías, sign-offs, data residency)

#### **B. Escala, Estructura y Portfolio de Proyectos**

> **Nota para el entrevistador**: Esta subsección es crítica. Necesitamos mapear el panorama completo de proyectos y equipos ANTES de profundizar. Muchas preguntas posteriores cambiarán según si hablamos de una empresa con 1 producto o 15.

- **¿Cuántas personas trabajan en la empresa actualmente?**
  - _Follow-up_: ¿Cuántas están en desarrollo/producto/tecnología?
  - _Follow-up_: ¿Cómo está organizado el equipo técnico? (por producto, por función, squads, tribus, etc.)

- **¿Cuántos productos/servicios digitales desarrollan internamente?**
  - _Follow-up_: ��Podrían listarlos brevemente? ¿Cuáles son los principales?
  - _Profundizar_: ¿Son productos independientes o hay dependencias entre ellos? (monorepo, shared libs, APIs internas)
  - _Profundizar_: ¿Qué tan críticos son para el negocio? (revenue impact por producto)

- **¿Cuántos equipos de desarrollo tienen y cómo se distribuyen?**
  - _Follow-up_: ¿Equipos dedicados por producto o recursos compartidos?
  - _Follow-up_: ¿Cuántas personas por equipo típicamente?
  - _Profundizar_: ¿Hay equipos de plataforma, infraestructura o servicios compartidos?
  - _Profundizar_: ¿Los equipos son autónomos o dependen mucho unos de otros?

- **¿Los procesos SDLC son uniformes en todos los equipos/proyectos o cada uno funciona diferente?**
  - _Follow-up_: ¿Hay un "equipo modelo" que funciona mejor que los demás? ¿Por qué?
  - _Follow-up_: ¿Hay algún proyecto que considerarían su mayor dolor de cabeza? ¿Por qué?
  - _Profundizar_: ¿Las herramientas son las mismas para todos o cada equipo elige las suyas?

#### **C. Motivación y Objetivos de Mejora**

- **¿Qué los motivó a buscar mejorar sus procesos de desarrollo?**
  - _Follow-up_: ¿Hubo algún incidente, auditoría o problema específico que lo disparó?
  - _Profundizar_: ¿Hay presión externa? (compliance, inversores, crecimiento acelerado, pérdida de talento)

- **¿Esperan escalar el equipo o los proyectos en los próximos 12-18 meses?**
  - _Follow-up_: ¿Cuánto? ¿Nuevos productos, equipos, expansión geográfica?
  - _Profundizar_: ¿Qué procesos creen que no aguantarán ese crecimiento?

### 🚨 **RED FLAGS (parar o repensar approach)**

- **"Todo funciona perfecto"** → No hay dolor, no hay urgencia
- **"No tenemos presupuesto"** → No hay Economic Buyer real
- **"Cada equipo es muy diferente"** → Resistencia a estandarización
- **"Ya intentamos esto antes"** → Skepticism alto, necesitan más evidence

### ✅ **GREEN SIGNALS (acelerar)**

- **Incidente reciente** que disparó la búsqueda → Urgencia real
- **Growth pressure** → Timeline claro para mejorar
- **Champion identificable** → Alguien empuja internamente
- **Budget allocated** → No es exploración, hay compromiso

---

## 2️⃣ Madurez y Estrategia de IA (20-30 min)

### Objetivos de Esta Sección

- Mapear herramientas, usuarios y fases SDLC donde usan IA
- Evaluar governance, resultados, y madurez de datos/analytics como prerequisito
- Descubrir oportunidades de alto impacto para AI-powered workflows

> **CORE del discovery**: LIDR es AI-powered — esta sección es la columna vertebral de la propuesta.

### Preguntas de IA

#### **A. Madurez de Datos y Analytics (prerequisito de IA)**

> **Forrester**: muchas empresas intentan saltar a IA sin dominar BI. Evaluar esta base primero.

**¿Qué tan data-driven son sus decisiones hoy?** `[S]`

- _Follow-up_: ¿Tienen dashboards de negocio? ¿Self-service BI? ¿Quién los usa?
- _Follow-up_: ¿Los datos están centralizados o en silos por equipo/producto?
- _Profundizar_: ¿Confían en la calidad de sus datos? ¿Tienen data governance formal?

#### **B. Adopción Actual y Resultados**

**¿Qué herramientas de IA están usando hoy?** `[S]`

- _Follow-up_: ¿Asistentes de código? (Copilot, Cursor, Codeium, Windsurf, Tabnine)
- _Follow-up_: ¿LLMs generales? (ChatGPT, Claude, Gemini) — ¿para qué tareas?
- _Follow-up_: ¿IA especializada o embebida? (testing AI, doc gen, Notion AI, Linear AI, etc.)

**¿Quién está usando IA, cómo, y qué resultados ven?** `[S→P]`

- _Recorrer por rol_: Developers · QA · PM · UX · DevOps · Management
- _Follow-up_: ¿Licencias corporativas o uso individual informal? ¿Qué % usa IA activamente?
- _Follow-up_: ¿Perciben mejora en velocidad/calidad? ¿Métricas concretas o percepción?
- **[I]** _Implicación_: ¿Qué pasa con los equipos que NO usan IA? ¿Se están quedando atrás en productividad?
- _Profundizar_: ¿Quiénes son los champions? ¿Quiénes los escépticos?

#### **C. Governance y Seguridad de IA**

**¿Tienen políticas sobre el uso de IA en desarrollo?** `[S→P]`

- _Follow-up_: ¿Guías sobre qué código/datos se puede pasar a un LLM? ¿Restricciones de IP/compliance?
- _Follow-up_: ¿Cómo validan el output de IA? ¿Code review específico o confianza ciega?
- **[I]** _Implicación_: ¿Qué riesgo corren si un dev pasa código propietario a un LLM público sin darse cuenta?
- _Profundizar_: ¿Principales preocupaciones? (seguridad, dependencia, pérdida de skills, resistencia)

#### **D. IA por Fase SDLC — Mapeo de Oportunidades**

**Para cada fase, preguntar: "¿Usan IA aquí? ¿Cómo? ¿Les gustaría?"**

| Fase SDLC                | Usa IA? | Herramienta | Interés |
| ------------------------ | ------- | ----------- | ------- |
| Ideación y brainstorming |         |             |         |
| Requisitos / PRD         |         |             |         |
| Diseño UX/UI             |         |             |         |
| Arquitectura             |         |             |         |
| Generación de código     |         |             |         |
| Code review              |         |             |         |
| Testing                  |         |             |         |
| Documentación            |         |             |         |
| CI/CD y DevOps           |         |             |         |
| Monitoring               |         |             |         |
| Onboarding               |         |             |         |

#### **E. Visión, Barreras y Valor Esperado**

**Si pudieran tener un "copilot" perfecto para su SDLC, ¿qué haría? ¿Qué tarea nunca delegarían a la IA?** `[NP]`

- _Follow-up_: ¿Esperan automatización pura, asistencia al humano, o drafts para review?
- _Follow-up_: ¿Prioridad: velocidad, calidad, consistencia, o reducción de costos?
- **[NP]** _Need-Payoff_: ¿Si lograran implementar IA en las 2-3 fases más dolorosas, qué impacto tendría en el negocio? ¿En horas? ¿En calidad? ¿En time-to-market?
- _Follow-up_: ¿Tienen budget asignado o previsto para herramientas de IA?
- _Profundizar_: ¿Qué barreras ven? (técnicas, culturales, organizacionales) ¿Qué necesitarían para convencer a los escépticos?

### 🚨 **RED FLAGS IA**

- **"IA es una moda"** → Falta de vision estratégica
- **"Prohibido por seguridad"** → Hard blockers organizacionales
- **"Solo algunos devs usan Copilot"** → Adoption muy limitada
- **"No vemos resultados concretos"** → Falta measurement/ROI

### ✅ **GREEN SIGNALS IA**

- **Champions activos** → Adoption organic + results visible
- **Corporate licenses** → Commitment organizacional
- **Governance defined** → Mature approach
- **Metrics tracking** → Data-driven sobre IA impact

---

## 3️⃣ Evaluación de Procesos SDLC Actuales (25-45 min)

### Objetivos de Esta Sección

- Mapear estado actual de cada fase SDLC y asignar nivel de madurez (1-5)
- Identificar qué funciona vs qué está roto — workflows reales, no los documentados

> **Escala de Madurez (CMMI/Gartner)** — Para cada fase, asignar mentalmente un nivel:
>
> 1. **Ad Hoc** — no hay proceso, cada quien hace lo suyo
> 2. **Managed** — proceso existe a nivel de proyecto, pero varía entre equipos
> 3. **Defined** — estandarizado a nivel organizacional, documentado
> 4. **Measured** — proceso medido con métricas, decisiones data-driven
> 5. **Optimizing** — mejora continua basada en datos, innovación constante

| Fase SDLC                 | Nivel (1-5) | Notas |
| ------------------------- | ----------- | ----- |
| Originación & Discovery   |             |       |
| Especificación & Planning |             |       |
| Desarrollo & Code Quality |             |       |
| QA & Testing              |             |       |
| Seguridad & Deploy        |             |       |
| Monitoring & Ops          |             |       |

### Contexto Técnico que Afecta el SDLC

> Solo lo necesario para entender qué condiciona sus procesos — no estamos evaluando su producto.

**¿Qué factores técnicos condicionan cómo trabajan?**

- _Follow-up_: ¿Regulaciones que imponen procesos obligatorios? (compliance gates, auditorías, sign-offs)
- _Follow-up_: ¿Escala que afecta el deploy? (usuarios concurrentes, latencia crítica, multi-región)
- _Profundizar_: ¿Han tenido incidentes de producción que cambiaron cómo trabajan?

---

### Framework de Evaluación LIDR SDLC

#### **Fase 0-1: Originación, Discovery & UX**

**¿Cómo deciden qué desarrollar?**

- _Follow-up_: ¿Tienen un proceso formal de priorización? ¿Quién toma las decisiones?
- _Profundizar_: ¿Documentan business cases o es más informal?

**¿Cómo capturan y documentan los requisitos?**

- _Follow-up_: ¿Hacen PRDs? ¿Hay separación entre requisitos funcionales y técnicos?
- _Profundizar_: ¿Qué tan detallados son antes de empezar a desarrollar?

**¿Tienen proceso de diseño UX/UI? ¿Cómo es el handoff diseño→desarrollo?**

- _Follow-up_: ¿Diseñadores dedicados o devs hacen diseño? ¿Figma, design system?
- _Profundizar_: ¿Se pierde fidelidad en el handoff? ¿Hacen user research o feedback loops?

#### **Fase 2-3: Especificación & Planning**

**¿Cómo transforman una idea de negocio en especificaciones técnicas?**

- _Follow-up_: ¿Quién participa en esa transformación?
- _Follow-up_: ¿Hay revisiones cruzadas entre producto y tecnología?
- _Profundizar_: ¿Se sienten cómodos con el nivel de detalle antes de implementar?

**¿Cómo planifican los sprints/iteraciones?**

- _Follow-up_: ¿Scrum, Kanban, híbrido? ¿Duración de iteraciones?
- _Follow-up_: ¿Cómo estiman? (story points, T-shirt, planning poker) ¿Miden velocity?
- _Profundizar_: ¿Qué tan predecible es su entrega? ¿Estimaciones vs realidad?

**¿Tienen Definition of Done/Ready? ¿Hacen retrospectivas?**

- _Follow-up_: ¿Qué incluye su DoD? ¿Se respeta o es aspiracional?
- _Follow-up_: ¿Retros cada cuánto? ¿Se implementan los action items?
- _Profundizar_: ¿Cuánto dedican a deuda técnica vs features nuevas?

**¿Cómo manejan dependencias entre equipos?**

- _Follow-up_: ¿Coordinación formal (Scrum of Scrums, PI Planning)?
- _Profundizar_: ¿Frecuencia de bloqueos por dependencias?

#### **Fase 4-5: Desarrollo & Code Quality**

**¿Cómo organizan el trabajo de desarrollo?**

- _Follow-up_: ¿Usan branches? ¿Qué estrategia de git?
- _Follow-up_: ¿Hay code review obligatorio?
- _Profundizar_: ¿Qué tan consistentes son los estándares de código?

**¿Cómo manejan la calidad del código durante desarrollo?**

- _Follow-up_: ¿Tienen linting, formatters automáticos?
- _Follow-up_: ¿Usan herramientas de análisis estático (SonarQube, etc.)?
- _Profundizar_: ¿Qué pasa cuando encuentra issues? ¿Se bloquea o se ignora?

#### **Fase 6: QA & Testing**

**¿Cómo prueban lo que desarrollan?**

- _Follow-up_: ¿QA dedicado o devs hacen testing? ¿Balance manual vs automatizado?
- _Follow-up_: ¿Qué tipos de tests? (unit, integration, E2E, perf, security) ¿Target de cobertura?
- _Profundizar_: ¿Qué tan confiados se sienten al desplegar a producción?

**¿Cuál es su proceso de validación antes de release?**

- _Follow-up_: ¿Sign-offs formales? ¿Entornos similares a producción? (dev, staging, pre-prod)
- _Profundizar_: ¿Con qué frecuencia encuentran bugs en producción? ¿Feature flags? ¿Rollback rápido?

**¿Cómo priorizan bugs y gestionan datos de prueba?**

- _Follow-up_: ¿SLAs por severidad? ¿Quién escribe acceptance criteria?
- _Follow-up_: ¿Datos sintéticos, snapshots anonimizados? ¿Son cuello de botella?

#### **Fase 7-8: Seguridad & Deploy**

**¿Cómo manejan la seguridad en el desarrollo?**

- _Follow-up_: ¿Hay revisiones de seguridad regulares?
- _Follow-up_: ¿Usan herramientas de security scanning?
- _Profundizar_: ¿Quién es responsable de la seguridad? ¿Hay un CISO?

**¿Cómo despliegan a producción?**

- _Follow-up_: ¿Es automático, manual, o híbrido?
- _Follow-up_: ¿Qué tan frecuente son los deploys?
- _Profundizar_: ¿Qué pasa cuando algo sale mal en producción?

---

## 4️⃣ Dolores, Desired State y Gaps (20-30 min)

### Objetivos de Esta Sección

- Descubrir frustraciones (Problem), explorar consecuencias (Implication), y que el cliente articule el valor de resolverlas (Need-Payoff)
- Mapear: **dónde están → dónde quieren estar → qué gap hay** (McKinsey Gap Analysis)
- Cubrir los 3 ejes MECE: **People/Culture**, **Process**, **Technology**

### Preguntas: Problems → Implications → Desired State

#### **A. People & Culture** `[P→I]`

**¿Qué tan alineados se sienten producto y desarrollo?**

- _Profundizar_: ¿Dónde ocurren más malentendidos? ¿Hay "telephone game"?
- _Ejemplo_: "Cuénteme la última vez que tuvieron que rehacer algo porque no estaba claro el requisito"
- **[I]** _Implicación_: ¿Cuántas horas/sprint se pierden en re-trabajo por malentendidos? ¿Qué impacto tiene en la moral del equipo?

**¿Cómo se sienten los equipos respecto a su forma de trabajar?**

- _Follow-up_: ¿Hay presión por fechas no realistas? ¿Pueden pushback?
- _Follow-up_: ¿Sienten ownership del producto o solo "cumplen tickets"?
- _Profundizar_: ¿Hay burnout? ¿Rotación alta? ¿Onboarding de nuevos devs es doloroso?

#### **B. Process & Governance** `[P→I]`

**¿Qué tan consistentes son entre diferentes proyectos o equipos?**

- _Follow-up_: ¿Un dev nuevo puede moverse entre proyectos fácilmente? ¿Hay "tribalismo"?
- **[I]** _Implicación_: ¿La falta de estandarización les ha costado tiempo concreto? ¿Cuánto?

**¿Qué procesos se sienten más caóticos o impredecibles?**

- _Profundizar_: ¿Dónde pierden más tiempo en re-trabajo? ¿Qué les gustaría automatizar?
- _Ejemplo_: "Si pudieran eliminar una frustración diaria, ¿cuál sería?"

#### **C. Technology & Scalability** `[P→I]`

**¿Qué funcionaba cuando eran más pequeños pero ya no escala?**

- _Follow-up_: ¿Procesos informales que necesitan estructura? ¿Herramientas insuficientes?
- **[I]** _Implicación_: ¿Van más lentos conforme crecen? ¿Cuánto más lento vs hace 1 año?

**¿Qué les preocupa más del crecimiento futuro?**

- _Follow-up_: ¿Onboarding, calidad con velocidad, compliance?

#### **D. Desired State y Need-Payoff** `[NP]`

> **Transición**: "Hemos hablado de los desafíos. Ahora quiero entender adónde quieren llegar."

**¿Cómo se ve "excelente" para su equipo de ingeniería en 12-18 meses?**

- _Follow-up_: ¿Qué cambiaría si pudieran resolver los 3 problemas que mencionaron?
- **[NP]** _Need-Payoff_: ¿Qué impacto tendría en el negocio? (más releases, menos bugs, más revenue, menos churn)
- **[NP]** _Need-Payoff_: ¿Qué valor le ponen a eso? (horas ahorradas, incidentes evitados, time-to-market)

**¿Qué han intentado antes para mejorar? ¿Qué funcionó y qué no?**

- _Profundizar_: ¿Por qué fallaron los intentos anteriores? (esto revela constraints reales)

---

## 5️⃣ Herramientas & Integraciones (10-15 min) — Streamlined

### Objetivos de Esta Sección

- Mapear herramientas core que afectan workflow SDLC
- Evaluar readiness para adopción de nuevas herramientas
- Identificar integration gaps que frenan el trabajo

### Preguntas de Herramientas (solo workflow impact)

#### **A. Ecosystem Actual**

**¿Qué herramientas principales usan día a día para trabajar?**

- _Core tools_: Project mgmt, Comunicación, Code/Git, CI/CD, Docs
- _Follow-up_: ¿Están integradas o son silos? ¿SSO? ¿Datos flow entre ellas?
- _Profundizar_: ¿Hay herramientas que aman vs que toleran? ¿Por qué?

**¿Qué tan fácil es onboardear a alguien nuevo en sus herramientas?**

- _Follow-up_: ¿Cuántos logins diferentes? ¿Setup automático o manual?
- _Profundizar_: ¿Hay herramientas que son "cuellos de botella" para nuevos?

#### **B. Change & Adoption Readiness**

**¿Cuál es el proceso para probar/adoptar herramientas nuevas?**

- _Follow-up_: ¿IT/Security approval? ¿POC process? ¿Budget approval?
- _Follow-up_: ¿Ejemplo reciente de herramienta nueva exitosa vs fallida?
- _Profundizar_: ¿Qué necesitan para convencer al team de cambiar una herramienta?

**¿Hay alguna herramienta que necesitan cambiar pero no pueden?**

- _Follow-up_: ¿Por qué no pueden? (contractual, técnico, resistencia)
- _Profundizar_: ¿Qué herramienta resolvería su mayor gap hoy?

### 🚨 **RED FLAGS Herramientas**

- **"No podemos instalar nada"** → Hard constraints organizacionales
- **"Cada equipo usa lo suyo"** → Falta estandarización severe
- **"Los devs odian nuestras herramientas"** → Resistance interna alta

### ✅ **GREEN SIGNALS Herramientas**

- **Proceso POC definido** → Change management maduro
- **Integration-friendly** → APIs, webhooks, SSO disponibles
- **Recent successful adoptions** → Culture openness

---

## 6️⃣ Stakeholders, Documentación y Change Management (10-20 min)

### Mapeo de Roles — Técnicos + Buying Influences (Miller Heiman)

#### **Roles Presentes en la Entrevista**

- [ ] **CTO/VP Eng** · [ ] **Product Owner/PM** · [ ] **Eng Manager/TL** · [ ] **QA Lead** · [ ] **DevOps/SRE** · [ ] **CISO/Security**

#### **Buying Influences (completar durante/después de la entrevista)**

| Rol                                                      | Persona | Posición (a favor/neutral/resistente) |
| -------------------------------------------------------- | ------- | ------------------------------------- |
| **Economic Buyer** (aprueba budget)                      |         |                                       |
| **User Buyer** (usará la solución diariamente)           |         |                                       |
| **Technical Buyer** (puede vetar por criterios técnicos) |         |                                       |
| **Coach** (aliado interno que nos guía)                  |         |                                       |

#### **A. Validación de Roles y Decisiones**

**¿Quién toma las decisiones técnicas importantes? ¿Quién define qué se construye y cuándo?**

- _Follow-up_: ¿Cómo priorizan bugs vs features vs infrastructure? ¿Hay conflicto business vs tech debt?
- _Profundizar_: ¿Quién aprueba inversiones en herramientas/procesos nuevos? ¿Qué evidence necesita?

#### **B. Documentación y Knowledge**

**¿Dónde vive la documentación técnica? ¿Está actualizada? ¿Es fácil de encontrar?**

- _Follow-up_: ¿Confluence, Notion, Wiki, READMEs? ¿API docs (OpenAPI, Postman)?
- _Follow-up_: ¿Changelogs/release notes automatizados o manuales?
- _Profundizar_: ¿Cuánto tarda un dev nuevo en ser productivo? ¿Hay guías de onboarding?

#### **C. Change Management y Cultura**

**¿Cómo han respondido históricamente a cambios de proceso?**

- _Follow-up_: ¿El último cambio grande fue exitoso? ¿Hay champions internos?
- _Follow-up_: ¿Hacen postmortems? ¿Se implementan las mejoras? ¿Hackathons o innovation days?
- _Profundizar_: ¿Dónde esperan más resistencia al cambio? ¿Cultura top-down o bottom-up?

---

## 7️⃣ Selección de Proyecto Piloto (15-20 min)

### Objetivos de Esta Sección

- Guiar al cliente a elegir UN proyecto concreto para implementar LIDR
- Definir el equipo que participará en el piloto
- Establecer métricas base (before) para demostrar valor (after)
- Alinear expectativas sobre alcance y timeline del piloto

> **Nota para el entrevistador**: Esta es la sección de "aterrizaje". Toda la conversación anterior fue panorámica. Ahora necesitamos que el cliente se comprometa con UN proyecto específico. Sin esto, la propuesta queda abstracta y no se puede medir.

### Preguntas de Selección

#### **A. Identificación del Proyecto Candidato**

**De todos los proyectos/productos que mencionaron, ¿cuál creen que sería el mejor candidato para un piloto?**

- _Follow-up_: ¿Por qué ese y no otro?
- _Follow-up_: ¿Es un proyecto nuevo (greenfield) o existente (brownfield)?
- _Profundizar_: ¿Cuál tiene más dolor hoy? ¿Cuál tiene más visibilidad interna?

> **Simplified Pilot Selection** — Evaluar cada candidato en 3 dimensiones core:
>
> | Criterio                                   | Proyecto A      | Proyecto B      | Proyecto C      |
> | ------------------------------------------ | --------------- | --------------- | --------------- |
> | **Dolor** (¿problema visible, no trivial?) | Alto/Medio/Bajo | Alto/Medio/Bajo | Alto/Medio/Bajo |
> | **Autonomía** (¿mínimas dependencias?)     | Sí/Parcial/No   | Sí/Parcial/No   | Sí/Parcial/No   |
> | **Champion** (¿sponsor comprometido?)      | Sí/Débil/No     | Sí/Débil/No     | Sí/Débil/No     |
> | **SELECCIÓN**                              | ✅❌            | ✅❌            | ✅❌            |
>
> **Heurística**: Priorizar **Alto Dolor + Sí Autonomía + Sí Champion**

**¿Están a punto de arrancar algo nuevo o hay un proyecto en curso que se beneficiaría de mejores procesos?**

- _Follow-up_: Si es brownfield — ¿en qué fase está? ¿Están en un buen momento para introducir cambios?
- _Follow-up_: Si es greenfield — ¿cuándo arranca? ¿Hay margen para empezar con el framework desde cero?
- _Profundizar_: ¿Hay un release o milestone importante próximo que podemos usar como hito de medición?

#### **B. Equipo del Piloto**

**¿Quiénes formarían el equipo del proyecto piloto?**

- _Follow-up_: ¿Cuántas personas? ¿Qué roles? (dev, QA, PM, diseño, DevOps)
- _Follow-up_: ¿Están dedicados a este proyecto o comparten tiempo con otros?
- _Profundizar_: ¿Hay un tech lead o PM que pueda ser nuestro punto de contacto principal?

**¿Cómo describirían la actitud de este equipo hacia cambios de proceso?**

- _Follow-up_: ¿Son early adopters o necesitan convencimiento?
- _Follow-up_: ¿Hay alguien en el equipo que ya sea champion de mejora de procesos o IA?
- _Profundizar_: ¿Qué ha funcionado/fallado cuando les introdujeron cambios anteriormente?

#### **C. Métricas Base (Before)**

> **Nota para el entrevistador**: Estas métricas son las que mediremos "antes" y "después" del piloto. Son la evidencia de valor para el rollout.

**Para el proyecto piloto que eligieron, ¿pueden darnos estos datos actuales?**

| Métrica                                                   | Valor Actual | Fuente |
| --------------------------------------------------------- | ------------ | ------ |
| **Lead time** (idea → producción)                         |              |        |
| **Cycle time** (ticket abierto → cerrado)                 |              |        |
| **Frecuencia de deploy**                                  |              |        |
| **Tasa de bugs en producción** (por release o por sprint) |              |        |
| **Tiempo medio de resolución de incidentes (MTTR)**       |              |        |
| **Tiempo de onboarding** (días hasta primer PR)           |              |        |
| **Cobertura de tests** (%)                                |              |        |
| **Tiempo en re-trabajo** (% de sprints dedicado a rework) |              |        |
| **Satisfacción del equipo** (si lo miden)                 |              |        |

- _Follow-up_: ¿Cuáles de estas métricas ya miden? ¿Cuáles pueden estimar?
- _Profundizar_: ¿Hay métricas de negocio específicas del proyecto que quieran mejorar?

**¿Qué definirían como "éxito" del piloto?**

- _Follow-up_: ¿Qué necesitan ver para decidir extender LIDR a más equipos?
- _Follow-up_: ¿En qué timeframe? (4 semanas? 8 semanas? 3 meses?)
- _Profundizar_: ¿Quién decide si el piloto fue exitoso? ¿Qué evidence necesita esa persona?

#### **D. Alcance y Restricciones del Piloto**

**¿Hay restricciones técnicas o de seguridad que debamos considerar?**

- _Follow-up_: ¿Pueden instalar herramientas nuevas? ¿Necesitan aprobación de seguridad/IT?
- _Follow-up_: ¿Podemos integrar con sus herramientas actuales (Jira, GitHub, CI/CD)?
- _Profundizar_: ¿Hay datos sensibles en el proyecto piloto que limiten qué herramientas de IA usar?

**¿Qué fases del SDLC quieren priorizar en el piloto?**

- _Follow-up_: ¿Empezar por lo que más duele o por lo más fácil de mejorar?
- _Follow-up_: ¿Prefieren deep en 2-3 fases o cobertura light en todas?
- _Profundizar_: ¿Hay fases que son intocables por ahora? (regulatorias, legacy, políticas internas)

---

## 8️⃣ Cierre y Propuesta (15-25 min)

### Resumen de Hallazgos (5 min)

**Template de Síntesis:**
"Basado en nuestra conversación, veo que su organización tiene [N] proyectos activos con [N] equipos. Sus fortalezas están en [X, Y, Z], enfrentan desafíos principalmente en [A, B, C], y su madurez de IA está en nivel [básico/intermedio/avanzado]. Para el piloto, hemos identificado [nombre del proyecto] con el equipo de [nombre/líder] como el mejor candidato."

### Propuesta de Valor LIDR AI-Powered SDLC (5-10 min)

**Para Startups/Scale-ups** — "Framework ágil con IA que crece con ustedes": piloto incremental, AI workflows desde el día 1, templates que multiplican al equipo.

**Para Enterprises** — "Estandarización AI-powered sin rigidez": piloto controlado con métricas before/after, compliance-ready, escalamiento data-driven.

### Next Steps (5 min)

**Propuesta de Engagement:**

1. **Baseline & Audit (1-2 semanas)** — Métricas baseline del piloto, gap analysis LIDR, assessment de madurez IA
2. **Pilot (4-8 semanas)** — Implementación LIDR + AI workflows en el proyecto piloto, training del equipo, tracking semanal vs baseline
3. **Evaluation (1-2 semanas)** — Métricas after vs baseline, retrospectiva con equipo, presentación a liderazgo
4. **Rollout (3-6 meses)** — Escalamiento gradual proyecto por proyecto, adaptación por contexto, optimización continua

---

## 🚨 **Escape Hatches & Contingencies**

### **Qué hacer si...**

#### **"No tenemos budget"**

- **Pivotear**: ¿Hay initiatives internas que podrían beneficiarse? (quality, velocity, onboarding)
- **Explorar timing**: ¿Cuándo sería el momento? ¿Qué trigger los haría asignar budget?
- **ROI approach**: ¿Si pudiéramos demostrar X horas ahorradas, cambiaría la perspectiva?

#### **"No vemos dolor real"**

- **Dig deeper**: Preguntas de contraste, escenarios "¿Qué pasaría si...?"
- **Future-facing**: ¿Qué les preocupa conforme crecen?
- **Competencia**: ¿Cómo se comparan con otros en tiempo de release?

#### **"Ya intentamos esto antes"**

- **Root cause**: ¿Qué falló específicamente? ¿Adoption? ¿Tools? ¿Change mgmt?
- **Diferenciación**: Explicar qué hace LIDR diferente a consultorías tradicionales
- **Evidence**: Ofrecer quick assessment para demostrar approach diferente

#### **"Cada equipo es muy diferente"**

- **Validation**: ¿Es diversidad buena (innovación) o caótica (esfuerzo duplicado)?
- **Pilot approach**: Empezar con UN equipo que sea modelo para escalar
- **Common ground**: ¿Qué procesos SÍ comparten? (deployment, security, code review)

#### **"Todo funciona perfecto"**

- **Challenge gently**: Preguntas de escalabilidad y crecimiento futuro
- **Benchmark**: ¿Cómo se comparan con industry leaders?
- **Future state**: ¿Si tuvieran que 2x el equipo mañana, todo seguiría igual?

---

## Apéndice A: Técnicas de Profundización

### Progresión SPIN (Rackham)

Las preguntas marcadas con `[S]` `[P]` `[I]` `[NP]` en el guión siguen esta secuencia:

- **`[S]` Situation** — hechos y contexto (minimizar — investigar antes)
- **`[P]` Problem** — dificultades, frustraciones, lo que está roto
- **`[I]` Implication** — consecuencias del problema (construye urgencia): "¿Cuánto les cuesta esto?"
- **`[NP]` Need-Payoff** — el cliente articula el valor: "¿Qué significaría resolver esto?"

### La Regla de los "5 Por Qués"

**Ejemplo**: "Releases se retrasan" → ¿Por qué? "Bugs al final" → ¿Por qué? "No hay tiempo de testing" → ¿Por qué? "Estimaciones optimistas" → ¿Por qué? "No incluyen testing/docs" → ¿Por qué? "Nadie enseñó a estimar el ciclo completo" → **Root cause encontrado.**

### Preguntas de Contraste

**Estructura**: "¿Qué funciona bien vs qué no funciona?"

- **"¿Cuál fue su último release exitoso? ¿Qué hicieron diferente?"**
- **"¿Cuál fue el peor incidente de producción? ¿Qué falló en el proceso?"**
- **"¿Qué admiran de cómo trabajan otros equipos/empresas?"**
- **"¿Qué nunca volverían a hacer igual?"**

### Preguntas de Escenario

**"¿Qué pasaría si...?"**

- **"¿Qué pasaría si mañana tienen que onboard 5 desarrolladores nuevos?"**
- **"¿Qué pasaría si necesitan hacer una release de emergencia el viernes?"**
- **"¿Qué pasaría si un cliente reporta un bug de seguridad crítico?"**
- **"¿Qué pasaría si quieren hacer 2x más releases por mes?"**

---

## Apéndice B: Señales de Alerta por Tamaño de Empresa

### 🚀 Startups (<50 personas)

#### Red Flags Típicos

- **"Todo está en la cabeza del founder"** → Falta documentación
- **"Nos movemos muy rápido para procesos"** → Technical debt acumulándose
- **"Somos muy pequeños para roles especializados"** → Quality gaps

#### Señales de Readiness

- **Menciones de "escalabilidad"** → Consciencia de crecimiento
- **"Necesitamos ser más profesionales"** → Motivación para estructura
- **Planes de funding/hiring** → Timing correcto para implementar

### 📈 Scale-ups (50-200 personas)

#### Red Flags Típicos

- **"Éramos más ágiles antes"** → Growing pains sin estructura
- **"Cada equipo hace las cosas diferente"** → Falta estandarización
- **"Los nuevos tardan meses en ser productivos"** → Onboarding chaos

#### Señales de Readiness

- **CTO/VP Eng recién contratado** → Mandate para mejora
- **Presión de compliance/auditorías** → External drivers
- **Multiple products/teams** → Complexity requiring structure

### 🏢 Enterprise (>200 personas)

#### Red Flags Típicos

- **"Tenemos procesos pero nadie los sigue"** → Implementation gaps
- **"Cada división usa herramientas diferentes"** → Silos organizacionales
- **"Los cambios toman 6 meses en aprobar"** → Rigidez excesiva

#### Señales de Readiness

- **Digital transformation initiatives** → Executive buy-in
- **DevOps/Platform teams** → Infrastructure for standardization
- **Compliance/audit findings** → Regulatory pressure

---

## 📝 Plantillas de Notas Post-Entrevista

### 🚀 **Executive Summary Template** (10 campos críticos)

```markdown
# Discovery Summary: [Company Name]

## 📊 **Quick Facts**

- **Industry**: [Sector] → **Industry Pack**: [Biometric/Fintech/Healthcare/etc]
- **Size**: [N] tech people, [N] teams, [N] projects → **Segment**: [Startup/Scale-up/Enterprise]
- **Champion**: [Nombre, rol] → **Decision Maker**: [Nombre, rol]

## 🎯 **AI Maturity & Tools**

- **Current AI**: [Tools siendo usados + % adoption]
- **Readiness**: [Alto/Medio/Bajo] → **Barriers**: [Top 2 blockers]
- **Champion IA**: [Quién empuja IA internamente]

## ⚠️ **SDLC Pain Points (Top 3)**

1. **[Pain Point 1]** → Cuesta: [horas/dinero/impact]
2. **[Pain Point 2]** → Cuesta: [horas/dinero/impact]
3. **[Pain Point 3]** → Cuesta: [horas/dinero/impact]

## 🎯 **PILOT SELECTED**

- **Project**: [Nombre] → **Type**: [Greenfield/Brownfield]
- **Team**: [N personas, roles] → **PoC**: [Nombre, rol]
- **Why this project**: [Dolor + Autonomía + Champion]
- **Success criteria**: [Qué necesitan ver para decidir rollout]
- **Timeline**: [Duración esperada del piloto]

## 🚥 **GO/NO-GO Signal**: [✅ GO / ⚠️ CONDITIONAL / ❌ NO-GO]

**Reason**: [Budget confirmed + Pain clear + Champion identified / Budget unclear / No real pain]
```

---

### 📋 **Complete Template** (para discovery detallado)

#### Información para Client Configuration

```markdown
## Client Profile

- **Company**: [Nombre] — **Industry**: [Sector] → Pack: [Healthcare/Fintech/etc]
- **Size**: [N personas] → [Startup/Scale-up/Enterprise] — **Tech Team**: [N personas]
- **Regulations**: [Compliance requirements]

## Buying Influences (Miller Heiman)

- **Economic Buyer**: [Nombre, rol, posición: a favor/neutral/resistente]
- **User Buyer**: [Nombre, rol, posición]
- **Technical Buyer**: [Nombre, rol, posición]
- **Coach**: [Nombre, rol]

## Portfolio & Teams

- **Projects**: [N total, lista principales] — **Teams**: [N, estructura]
- **Autonomy**: [Autónomos vs dependientes] — **Shared resources**: [Plataforma, infra]
- **SDLC Uniformity**: [Mismo proceso o cada equipo diferente]
- **Best Team**: [Cuál y por qué] — **Worst Pain**: [Cuál y por qué]

## Motivation & Growth Context

- **Why now**: [Qué disparó la búsqueda de mejora — incidente, auditoría, crecimiento, presión]
- **Growth plans**: [Escalar equipo? Nuevos productos? Expansión?]
- **Processes at risk**: [Qué procesos no aguantarán el crecimiento]

## AI Maturity (→ ver tabla completada en sección 2D)

- **Tools**: [Code assistants / General LLMs / Specialized / Embedded en stack]
- **Adoption**: [Individual informal / Team licensed / Org-wide] — [% activo] — Champions: [quiénes]
- **Impact**: [Datos concretos vs percepción] — Incidents: [bugs por IA?]
- **Governance**: [Políticas? Restricciones IP/datos? Validación de output?]
- **Vision & Barriers**: [Qué esperan / Técnicas, culturales, org / Budget]

## SDLC Maturity Scoring (→ ver escala sección 3)

| Fase                      | Nivel (1-5) | Current State | Desired State | Gap |
| ------------------------- | ----------- | ------------- | ------------- | --- |
| Originación & Discovery   |             |               |               |     |
| Especificación & Planning |             |               |               |     |
| Desarrollo & Code Quality |             |               |               |     |
| QA & Testing              |             |               |               |     |
| Seguridad & Deploy        |             |               |               |     |
| Monitoring & Ops          |             |               |               |     |

## Pain Points & Gap Analysis (SPIN)

- **Top 3 Pain Points**: [1. ... 2. ... 3. ...]
- **Implication**: [Cuánto les cuestan — horas, dinero, rotación, time-to-market]
- **Desired State**: [Cómo se ve "excelente" en 12-18 meses]
- **What they tried before**: [Intentos previos de mejora y por qué fallaron]

## Tech Context (solo lo que afecta al SDLC)

- **Regulatory constraints**: [Compliance gates que condicionan procesos]
- **Scale factors**: [Usuarios, latencia, multi-región — lo que impacta deploy]
- **Architecture**: [Mono/Micro/Serverless] — **Stack**: [FE, BE, DB, Cloud]

## QA, Docs & Change Management

- **Testing**: [Types, coverage %, automated %, framework, data mgmt]
- **Bug Triage**: [SLAs, environments, feature flags, rollback]
- **Docs**: [Tools, API docs, onboarding time, changelogs]
- **Change Readiness**: [Historial, champions, resistencia esperada, cultura]

## PILOT PROJECT (CRITICAL)

- **IMPACT Score**: [puntaje ponderado — ver matrix sección 8A]
- **Project**: [Nombre] — **Why**: [dolor, visibilidad, representatividad]
- **Type**: [Greenfield/Brownfield] — **Phase**: [Inicio/En curso/Mantenimiento]
- **Team**: [N personas] — Roles: [Dev, QA, PM, Design, DevOps]
- **Dedication**: [100% o compartido] — **PoC**: [Tech lead o PM]
- **Change Attitude**: [Early adopters/neutral/resistentes] — **AI Champion**: [quién]
- **Baseline Metrics**: (→ ver tabla completada en sección 8C)
- **Success Criteria**: [Qué necesitan ver] — **Timeframe**: [duración]
- **Decision Maker**: [Quién decide + qué evidence necesita]
- **Constraints**: [Seguridad, herramientas, datos sensibles]
- **Priority Phases**: [Fases SDLC a atacar primero] — **Next Milestone**: [hito]

---

## Changelog

| Versión | Fecha      | Cambios                                                                                                                                                                                                                                                 |
| ------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 3.2.0   | 2026-04-06 | **Optimización post-feedback**: Reducido tiempo total (95-175 min vs 105-185 min), rebalanceado focus (IA+SDLC=80min vs Tools=15min), añadidos guardrails/signals, simplificada matriz IMPACT, añadido executive template, escape hatches implementadas |
| 3.1.0   | 2026-04-06 | **Corrección de over-scoping**: Eliminada profundización en modelo de negocio, enfoque 100% en SDLC processes                                                                                                                                           |
| 3.0.0   | 2026-04-06 | Versión inicial completa                                                                                                                                                                                                                                |

## Readiness & Proposed Configuration

- **Score**: [1-5] — **Decision Makers**: [nombres y roles]
- **Budget**: [range] — **Timeline**: [cuándo empezar]
- **Priority Modules**: [qué primero] — **Integrations**: [herramientas]
- **AI Workflow Priorities**: [qué AI workflows en qué fases]
- **Rollout Strategy**: [piloto → N equipos → timeline]
```

### Follow-up Actions

- [ ] **Send recap email** con key takeaways + confirmación del proyecto piloto seleccionado (24h)
- [ ] **Completar tabla de IA por fase SDLC** si quedaron huecos durante la entrevista (48h)
- [ ] **Prepare detailed proposal** basado en gaps identificados + plan de piloto (1 semana)
- [ ] **Schedule sesión técnica** con equipo del piloto si no estuvieron presentes (1 semana)
- [ ] **Schedule demo** del framework LIDR configurado para su contexto (2 semanas)
- [ ] **Obtener métricas base** que no pudieron proveer en la entrevista (antes de arrancar piloto)

---

## 🎯 Indicadores de Éxito de la Entrevista

### ✅ Entrevista Exitosa Si:

- Lograste que hablen 70%+ del tiempo (tú solo facilitas/preguntas)
- Obtuviste ejemplos concretos (no solo generalizaciones)
- Identificaste al menos 3 pain points con sus **implications** cuantificadas (SPIN)
- El cliente articuló el **desired state** y el **valor de llegar ahí** (Need-Payoff)
- Completaste la **tabla de maturity scoring** (sección 3) y la **tabla de IA por fase** (sección 2D)
- Te mantuviste enfocado en **procesos SDLC** — no te desviaste a evaluar su producto o modelo de negocio
- **Tienen un proyecto piloto con IMPACT score** y métricas base
- Identificaste los 4 **buying roles** (Miller Heiman) y sus posiciones
- Cliente pregunta por next steps (engagement activo)

### ⚠️ Red Flags de Entrevista:

- Respuestas muy genéricas o "todo está bien"
- No pueden dar ejemplos específicos de problemas
- Solo está presente 1 persona (falta context diverso)
- Mucha defensiveness sobre procesos actuales
- No hay clarity sobre budget o decision making process
- **No logran comprometerse con un proyecto piloto concreto**
- **Resistencia total a herramientas de IA sin disposición a explorar**
- **Hablan solo de "la empresa" sin aterrizar en equipos/proyectos específicos**

---

**💡 Tip Final**: La mejor entrevista es cuando el cliente termina diciendo "nunca habíamos pensado en esto de esta manera" o "ahora entiendo por qué tenemos estos problemas recurrentes".

## Changelog

| Versión | Fecha      | Autor             | Cambios                                                                                                                                                                                                                                                                                                        |
| ------- | ---------- | ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1.0.0   | 2026-04-06 | TL: Lead Engineer | Manual inicial de entrevistas para discovery de clientes SDLC                                                                                                                                                                                                                                                  |
| 2.0.0   | 2026-04-06 | AI-Assisted       | Multi-proyecto/multi-equipo, sección IA completa, Selección de Proyecto Piloto con métricas, UX, FRs/NFRs, Arquitectura, QA, Documentación, plantilla ampliada                                                                                                                                                 |
| 2.1.0   | 2026-04-06 | AI-Assisted       | Compresión: eliminada sección duplicada Métricas, fusionadas Stakeholders+Docs, comprimidas IA/SDLC/UX/Plantilla                                                                                                                                                                                               |
| 3.0.0   | 2026-04-06 | AI-Assisted       | Alineación con estándares: SPIN, Gap Analysis, CMMI maturity scoring, IMPACT matrix, Miller Heiman, Forrester BI prerequisite, interview sequencing                                                                                                                                                            |
| 3.1.0   | 2026-04-06 | AI-Assisted       | Enfoque SDLC puro: eliminada sección Producto/Propuesta de Valor, eliminada sección UX completa (proceso de UX movido a Fase 0-1), eliminados FRs/NFRs/Datos (reemplazados por "Contexto Técnico que Afecta el SDLC"), limpiada plantilla de campos de producto. De 8 a 8 secciones pero enfocadas en procesos |
