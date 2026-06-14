# Flujo de Trabajo General - End to End

## Resumen Visual del Flujo

```
Business/Liderazgo -> Requisitos Alto Nivel
    -> R&D valida viabilidad tecnica (seccion tecnica del PRD)
    -> Product Owners definen alcance funcional (seccion funcional del PRD)
        -> PRD unificado (F+T, co-autoria PO + R&D)
        -> Requisitos Funcionales (RF)
            -> User Stories
                -> Tickets Jira
                    -> Sprint Planning (2 sem, horas)
                        -> Desarrollo (PR flow)
                            -> SAST -> DAST -> Pen Testing Manual
                                -> Comite de Cambios
                                    -> Dev -> Staging -> UAT -> Pre-prod -> Prod
                                        -> QA BDD (TestRail)
                                            -> Scanning automatizado post-deploy
```

---

## Fase 1: Originacion (Business / CTO)

| Aspecto                  | Detalle                                                                                                                                            |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Inputs**               | Necesidades de negocio, oportunidades de mercado, directrices estrategicas                                                                         |
| **Outputs**              | Requisitos de alto nivel, solicitudes formales a R&D y Producto                                                                                    |
| **Responsables**         | Liderazgo de negocio, CTO                                                                                                                          |
| **Herramientas**         | Reuniones presenciales/virtuales, correo electronico, documentacion interna                                                                        |
| **Mecanismo de handoff** | El CTO envia solicitudes directamente a R&D. El equipo de negocio comunica necesidades a Product Owners en reuniones y documentacion de alto nivel |

### Descripcion

El flujo comienza cuando el liderazgo de negocio o el CTO identifican una necesidad, ya sea por demanda del mercado, requisitos de clientes existentes o vision estrategica. En esta fase se definen los lineamientos generales de lo que se quiere lograr sin entrar en detalles tecnicos ni funcionales. El CTO tiene un canal directo con R&D para solicitudes que requieren investigacion o validacion de viabilidad tecnica. Paralelamente, los stakeholders de negocio comunican sus necesidades al equipo de Producto para que estas se traduzcan en soluciones concretas.

---

## Fase 2: Analisis de R&D (Viabilidad tecnica y prototipado)

| Aspecto                  | Detalle                                                                                                                 |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------------- |
| **Inputs**               | Solicitudes del CTO, requisitos de alto nivel del negocio                                                               |
| **Outputs**              | Seccion tecnica del PRD (viabilidad, algoritmos, NFRs, restricciones), prototipos, analisis de viabilidad               |
| **Responsables**         | Equipo de R&D / Core                                                                                                    |
| **Herramientas**         | Herramientas de prototipado, laboratorios internos, Confluence para documentacion                                       |
| **Mecanismo de handoff** | R&D valida la viabilidad tecnica y aporta la seccion tecnica del PRD unificado, en co-autoria con el equipo de Producto |

### Descripcion

Cuando el CTO envia una solicitud a R&D, el equipo investiga, analiza las capacidades actuales del sistema y propone soluciones tecnicas. Esta fase puede incluir la creacion de prototipos, pruebas de concepto y evaluacion de algoritmos (por ejemplo, algoritmos domain-specificos). El resultado principal es la **seccion tecnica del PRD unificado**, centrada en las capacidades tecnicas, los algoritmos involucrados y las limitaciones o posibilidades de la tecnologia. Esta seccion es fundamental porque define el "techo" de lo que es tecnicamente posible; no es un documento aparte, sino la parte tecnica del mismo PRD que el equipo de Producto co-redacta para definir la solucion funcional.

---

## Fase 3: Definicion de Producto (alcance funcional del PRD y Requisitos Funcionales)

| Aspecto                  | Detalle                                                                                                   |
| ------------------------ | --------------------------------------------------------------------------------------------------------- |
| **Inputs**               | Seccion tecnica del PRD validada por R&D, requisitos de alto nivel de negocio, reuniones con stakeholders |
| **Outputs**              | PRD unificado (secciones funcional + tecnica), Requisitos Funcionales (RF), User Stories                  |
| **Responsables**         | Product Owners (PO, Product Lead), Tech Lead, R&D (co-autoria de la seccion tecnica)                      |
| **Herramientas**         | Confluence (documentacion), Robo/RoboFlow (generacion asistida por IA), ChatGPT                           |
| **Mecanismo de handoff** | Los RFs documentados en Confluence se transforman en User Stories que se trasladan a Jira                 |

### Descripcion

El equipo de Producto asiste a reuniones con los stakeholders de negocio, recibe la documentacion de alto nivel y realiza el ejercicio de "escuchar, entender lo que realmente se quiere, y aterrizarlo". El PO y el Tech Lead son los principales responsables de traducir las necesidades de negocio en requisitos accionables. Conociendo las capacidades tecnicas que R&D ha validado, el equipo de Producto define la **seccion funcional del PRD** (vision completa del producto, alcance, funcionalidades principales y Requisitos Funcionales individuales, RF). Esta seccion funcional y la seccion tecnica que aporta R&D conviven en un **unico PRD unificado** co-redactado entre ambos equipos; lidr-review-cruzado valida la alineacion funcional-tecnica (F↔T).

Cada RF se documenta con una estructura estandar que incluye descripcion, comportamiento esperado (flujos principales, alternativos y de error), criterios de aceptacion y dependencias. Se utiliza asistencia de IA (Robo integrado con Confluence) para acelerar la generacion de RFs, aunque se revisan manualmente para garantizar coherencia. De los RFs se derivan User Stories que alimentan el backlog de Jira.

---

## Fase 4: Planificacion (Sprint Planning y Estimacion)

| Aspecto                  | Detalle                                                                          |
| ------------------------ | -------------------------------------------------------------------------------- |
| **Inputs**               | User Stories en el backlog, capacidad del equipo, prioridades de negocio         |
| **Outputs**              | Sprint backlog comprometido, sub-tareas tecnicas estimadas en horas              |
| **Responsables**         | Product Owner (PO), Governance (Gov Lead + PO), Tech Leads, equipo de desarrollo |
| **Herramientas**         | Jira (gestion de backlog, sprints, tickets), reuniones de refinamiento           |
| **Mecanismo de handoff** | Las User Stories aprobadas y estimadas se asignan al sprint activo en Jira       |

### Descripcion

El sprint tiene una duracion de 2 semanas (con planes de ampliar a 3 semanas cuando el producto este mas maduro). La estimacion se realiza en horas, no en story points, lo que permite calcular la capacidad real del equipo considerando dedicaciones parciales y totales.

El proceso de planificacion sigue estos pasos:

1. La Product Owner define que RFs o funcionalidades quiere incluir en el sprint.
2. Se agrupan funcionalidades relacionadas o con dependencias colaterales.
3. Se busca aportar valor tangible en cada sprint (increment).
4. En sesiones de refinamiento, la PO presenta las historias y los Tech Leads estiman.
5. La cotizacion se realiza en conjunto: PO + Product Lead + Tech Leads.
6. La PO define el QUE (que construir) y el equipo de desarrollo define el COMO (como implementarlo). Esta separacion de roles se describe como "la primera vez que separamos estos roles".
7. En el Sprint Planning se verifica el acuerdo, se identifican dependencias y riesgos.
8. El equipo de Governance facilita la ejecucion y elimina blockers.

El carryover es el principal problema identificado. El Gov Lead lo denomina "el gran cancer". Existe una fecha limite inamovible (abril), por lo que se trabaja de la fecha hacia atras para asegurar la entrega.

---

## Fase 5: Desarrollo (Codigo, PRs y Code Review)

| Aspecto                  | Detalle                                                                |
| ------------------------ | ---------------------------------------------------------------------- |
| **Inputs**               | Tickets de Jira con User Stories y sub-tareas asignadas                |
| **Outputs**              | Codigo fuente, Pull Requests revisados y aprobados                     |
| **Responsables**         | Equipo de desarrollo, Tech Leads (revisores)                           |
| **Herramientas**         | Repositorios de codigo (Git), plataforma de PRs, Jira para seguimiento |
| **Mecanismo de handoff** | El codigo aprobado en PR pasa al pipeline de seguridad y despliegue    |

### Descripcion

Los desarrolladores trabajan sobre las sub-tareas tecnicas que ellos mismos generan a partir de las User Stories. Las sub-tareas son consideradas "papel de trabajo" del desarrollador; la PO no interviene en ese nivel de detalle. El flujo de desarrollo sigue un modelo de Pull Requests donde el codigo es revisado por pares y/o Tech Leads antes de ser integrado. Cada PR debe cumplir con los estandares de calidad y pasar las verificaciones automatizadas antes de avanzar.

---

## Fase 6: Seguridad (SAST, DAST, SCA, Pen Testing)

| Aspecto                  | Detalle                                                                                                                                         |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| **Inputs**               | Codigo fuente integrado, artefactos de build                                                                                                    |
| **Outputs**              | Reportes de vulnerabilidades, certificacion de seguridad, hallazgos remediados                                                                  |
| **Responsables**         | Equipo de seguridad, desarrolladores (remediacion)                                                                                              |
| **Herramientas**         | Herramientas SAST (analisis estatico), DAST (analisis dinamico), SCA (analisis de composicion de software), herramientas de penetration testing |
| **Mecanismo de handoff** | El codigo que pasa las validaciones de seguridad es candidato para avanzar al Comite de Cambios                                                 |

### Descripcion

El pipeline de seguridad es un componente critico del flujo. Se ejecutan multiples tipos de analisis:

- **SAST (Static Application Security Testing)**: Analisis estatico del codigo fuente para detectar vulnerabilidades sin ejecutar la aplicacion.
- **DAST (Dynamic Application Security Testing)**: Analisis dinamico que prueba la aplicacion en ejecucion para encontrar vulnerabilidades en tiempo de ejecucion.
- **SCA (Software Composition Analysis)**: Analisis de las dependencias y librerias de terceros para identificar vulnerabilidades conocidas.
- **Pen Testing Manual**: Pruebas de penetracion realizadas manualmente por especialistas de seguridad para descubrir vulnerabilidades que las herramientas automatizadas no detectan.

Los hallazgos deben ser remediados antes de que el codigo pueda avanzar en el pipeline. Los resultados alimentan al Comite de Cambios para la toma de decisiones sobre el despliegue.

---

## Fase 7: QA (Pruebas BDD y TestRail)

| Aspecto                  | Detalle                                                                              |
| ------------------------ | ------------------------------------------------------------------------------------ |
| **Inputs**               | Criterios de aceptacion de los RFs, codigo desplegado en entorno de pruebas          |
| **Outputs**              | Test cases ejecutados, reportes de resultados en TestRail, defectos registrados      |
| **Responsables**         | Equipo de QA                                                                         |
| **Herramientas**         | TestRail (gestion de test cases y resultados), framework BDD (Given/When/Then)       |
| **Mecanismo de handoff** | Las pruebas aprobadas validan que el codigo esta listo para promocion entre entornos |

### Descripcion

El equipo de QA utiliza una metodologia BDD (Behavior-Driven Development) donde los escenarios de prueba se derivan directamente de los criterios de aceptacion definidos en los Requisitos Funcionales. Los criterios de aceptacion se diseñan con suficiente madurez para que QA pueda generar test cases de forma directa, utilizando el formato Given/When/Then. TestRail se emplea como herramienta central para organizar, ejecutar y reportar las pruebas. Los defectos encontrados se registran y gestionan hasta su resolucion.

---

## Fase 8: Despliegue (Multiples Entornos)

| Aspecto                  | Detalle                                                                 |
| ------------------------ | ----------------------------------------------------------------------- |
| **Inputs**               | Codigo validado por seguridad y QA, aprobacion del Comite de Cambios    |
| **Outputs**              | Aplicacion desplegada en el entorno correspondiente                     |
| **Responsables**         | Equipo de DevOps/Infraestructura, Comite de Cambios (aprobacion)        |
| **Herramientas**         | Pipeline de CI/CD, herramientas de despliegue, Comite de Cambios        |
| **Mecanismo de handoff** | Promocion secuencial entre entornos tras validacion exitosa en cada uno |

### Descripcion

El despliegue sigue un modelo de promocion secuencial a traves de multiples entornos:

1. **Dev**: Entorno de desarrollo donde se integra el codigo inicialmente.
2. **Staging**: Entorno de preproduccion para pruebas integradas.
3. **UAT (User Acceptance Testing)**: Entorno donde los stakeholders de negocio validan la funcionalidad.
4. **Pre-prod**: Entorno espejo de produccion para validacion final.
5. **Prod**: Entorno de produccion accesible a usuarios finales.

El Comite de Cambios actua como puerta de control antes de la promocion a produccion, evaluando los riesgos, los resultados de seguridad y las pruebas de QA.

---

## Fase 9: Post-despliegue (Scanning Automatizado)

| Aspecto                  | Detalle                                                                                |
| ------------------------ | -------------------------------------------------------------------------------------- |
| **Inputs**               | Aplicacion desplegada en produccion                                                    |
| **Outputs**              | Reportes de scanning continuo, alertas de vulnerabilidades nuevas                      |
| **Responsables**         | Equipo de seguridad, equipo de operaciones                                             |
| **Herramientas**         | Herramientas de scanning automatizado, monitoreo de seguridad                          |
| **Mecanismo de handoff** | Los hallazgos post-despliegue alimentan el backlog para remediacion en futuros sprints |

### Descripcion

Una vez que la aplicacion esta en produccion, se ejecutan scannings automatizados de forma continua para detectar nuevas vulnerabilidades, cambios en la superficie de ataque o degradacion de la postura de seguridad. Este monitoreo continuo asegura que la aplicacion mantiene sus estandares de seguridad a lo largo del tiempo. Los hallazgos descubiertos post-despliegue se priorizan y se incorporan al backlog para ser remediados en futuros sprints, cerrando asi el ciclo completo del flujo de trabajo.

---

## Observaciones Generales

- **Innovacion del proceso**: Esta es la primera implementación formal del framework LIDR SDLC, con recursos dedicados al 100%, roles bien definidos y gobernanza estructurada sobre el proceso de desarrollo.
- **Dolor principal**: El carryover entre sprints es el problema mas significativo, agravado por fechas de entrega inamovibles.
- **Documentacion retroactiva**: Algunos desarrollos comenzaron antes de que existiera documentacion completa, lo que genera la necesidad de documentar retroactivamente.
- **Asistencia de IA**: Se utiliza IA (Robo/ChatGPT) para acelerar la generacion de requisitos funcionales, aunque se requiere revision manual para garantizar coherencia.
