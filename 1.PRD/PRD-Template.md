# [Nombre del Producto] - Product Requirements Document

**Created by:** [Tu nombre], **last modified:** [fecha]

> **Nota importante:** Un PRD debe actualizarse continuamente a lo largo del ciclo de vida del desarrollo a medida que se descubre nueva información. Esta plantilla ayudará a mantener alineados a los equipos de producto, diseño e ingeniería, facilitar la colaboración a largo plazo y comunicar prioridades.

---

## 🚀 Principios Ágiles de este PRD

> **Este PRD sigue la metodología ágil:** Se centra en la comprensión compartida del cliente y evita especificaciones ultradetalladas. Está diseñado para ser flexible, actualizable y colaborativo.

### ✅ Este documento ES:

- **Una página, una fuente:** Todo el contexto del proyecto en un solo lugar
- **Vivo y actualizable:** Cambia según aprendamos y recibamos feedback
- **Centrado en el "por qué":** Explica el problema, deja el "cómo" al equipo
- **Colaborativo:** Creado y mantenido por producto, diseño y desarrollo juntos
- **Conciso:** Enlaces a detalles adicionales en lugar de textos extensos

### ❌ Este documento NO ES:

- Un documento de especificación técnica detallada
- Un contrato rígido e inmutable
- Algo escrito solo por el Product Manager
- Una lista exhaustiva de todos los detalles de implementación

---

## ⚠️ Antipatrones a evitar

Alerta si detectas estos antipatrones mientras trabajas con este PRD:

- ❌ **Especificaciones detalladas antes de empezar:** No intentes especificar todo por adelantado
- ❌ **Aprobaciones rigurosas y lentas:** El PRD debe facilitar el trabajo, no bloquearlo
- ❌ **Actualizaciones invisibles:** Si cambias algo, notifica al equipo (@menciones)
- ❌ **Nunca actualizar:** Este documento debe evolucionar con el proyecto
- ❌ **Escribir solo:** Siempre involucra a desarrolladores y diseñadores desde el inicio

---

## 📚 ¿Cuándo usar este PRD?

> **Contexto importa:** El nivel de detalle de tu PRD debe adaptarse al nivel de incertidumbre de tu proyecto y la metodología de tu equipo.

### ✅ Este template COMPLETO es ideal para:

- **Proyectos con baja incertidumbre:** Ya conoces bien el problema y la solución
- **Productos nuevos complejos:** Requieren alineación total entre múltiples equipos
- **Equipos distribuidos:** Necesitan documentación clara y accesible
- **Contextos híbridos:** Combinación de cascada + agile
- **Productos regulados:** Necesitan documentación exhaustiva para compliance
- **Handoffs importantes:** Cuando necesitas transferir conocimiento a otros equipos

### 🔹 Versiones simplificadas para contextos ágiles

Si tu proyecto tiene **alta incertidumbre**, considera versiones más ligeras:

#### **Nivel 1: PRD Básico (Solo obligatorias)**

Ideal para MVPs y experimentos rápidos:

- Overview + Goals + Features Included/Excluded + Timeline básico
- ⏱️ Tiempo de creación: 1-2 horas
- 🔄 Actualización: Cada sprint

#### **Nivel 2: Epic + User Stories**

Alternativa ágil pura, sin PRD tradicional:

- **Epic** = Overview + Goals + Background
- **User Stories** = Features con acceptance criteria
- **Product Backlog** = Requirements table priorizada
- ⏱️ Tiempo de creación: Iterativo, evoluciona continuamente
- 🔄 Actualización: Cada sprint planning

#### **Nivel 3: PRD Completo (Este template)**

Para proyectos establecidos con claridad de requisitos:

- Todas las secciones de este template
- ⏱️ Tiempo de creación: 1-2 días
- 🔄 Actualización: Mensual o por milestone

### 🎚️ Guía rápida: ¿Qué nivel necesito?

| Situación del proyecto       | Nivel recomendado | Secciones a usar                 |
| ---------------------------- | ----------------- | -------------------------------- |
| 🚀 **MVP / Prototipo**       | Básico            | Solo obligatorias                |
| 🔄 **Alta incertidumbre**    | Epic + Stories    | Sin PRD, usa backlog ágil        |
| ⚖️ **Proyecto establecido**  | Intermedio        | Obligatorias + FAQ + Risks       |
| 📐 **Producto complejo**     | Completo          | Todas las secciones              |
| 📋 **Regulado / Compliance** | Completo          | Todas + Release Criteria extenso |

### 💡 Regla de oro

> **"Usa el mínimo de documentación necesaria para alinear al equipo y reducir riesgos."**
>
> - Más incertidumbre = Menos documentación, más experimentación
> - Menos incertidumbre = Más documentación, más planificación

### 🔗 Relación con artefactos ágiles

Este PRD puede coexistir con metodologías ágiles:

- **Epic (JIRA/ClickUp)** = Resumen de Overview + Goals + Features
- **User Stories** = Cada feature de "Features Included"
- **Acceptance Criteria** = Los Gherkin scenarios de cada feature
- **Product Backlog** = La tabla de requirements con prioridades
- **Sprint Goals** = Subconjunto de success metrics

**El PRD sirve como "documentación madre"** que alimenta estos artefactos ágiles, manteniendo la visión completa mientras el equipo itera en sprints.

---

## 🔑 Overview

Proporciona los detalles clave en la tabla siguiente:

| Campo                            | Valor                                                     |
| -------------------------------- | --------------------------------------------------------- |
| **Product Name**                 | [Ej: User Account Management]                             |
| 🎯 **Target release**            | [1.0 / Q1 2024 / March 1, 2024]                           |
| 📌 **ClickUp Project/Epic**      | [EPIC-XXX] - [Nombre del Epic] [[Ver en ClickUp](#)]      |
| 💬 **Team Channel**              | [Slack: #product-team / Teams: Product Channel]           |
| 🟡 **Document status**           | DRAFT / IN REVIEW / APPROVED / IN DEVELOPMENT / COMPLETED |
| 👤 **Product Manager**           | @[Nombre del PM]                                          |
| 🎨 **Designer**                  | @[Nombre del Diseñador]                                   |
| 💻 **Engineer (Lead)**           | @[Nombre del Tech Lead]                                   |
| 🧪 **QA Engineer**               | @[Nombre del QA]                                          |
| ✍️ **Technical Writer**          | @[Nombre del Technical Writer]                            |
| 📢 **Product Marketing Manager** | @[Nombre del PMM]                                         |

### Descripción breve

[Proporciona una descripción breve de qué es el producto y por qué es importante]

**Ejemplo:**

> User Account Management proporciona a los administradores la capacidad de gestionar todas las cuentas de usuario en su Workspace. Podrán ver, editar, buscar y auditar cuentas de usuario y detalles de cuentas desde la aplicación. Este es un componente crítico porque permite a nuestros clientes autogestionar sus cuentas, lo que (1) reducirá el costo de nuestros equipos de soporte atendiendo este tipo de preguntas, y (2) aumentará la satisfacción del cliente.

### Métricas de investigación que respaldan la prioridad

[Incluye métricas de investigación que respalden por qué este producto debe ser priorizado]

**Ejemplo:**

> Después de lanzar la aplicación hace un año, hemos encontrado que el 50% de los tickets de soporte al cliente están relacionados con la gestión de cuentas de usuario. En un plazo de 6 meses, el 65% de las respuestas de la encuesta de producto in-app destacan la necesidad de una forma de administrar sus propias cuentas de manera autoservicio.

---

## 🔗 Enlaces rápidos

> **Usa enlaces en lugar de texto largo:** Los enlaces ayudan a sintetizar la complejidad y revelar información progresivamente.

| Enlace                         | URL                                                   |
| ------------------------------ | ----------------------------------------------------- |
| 🎨 **Diseños**                 | [Figma - [Product Name] Designs](#)                   |
| 👨‍💻 **Demostración Loom**       | [Loom Demo Video](#)                                  |
| 📊 **Rastreador ClickUp/JIRA** | [ClickUp Epic - [EPIC-XXX]](#) - **[6 tasks linked]** |
| 📈 **Dashboard Analytics**     | [Analytics Dashboard](#)                              |
| 📋 **Roadmap**                 | [Product Roadmap](#)                                  |

---

## 🎯 Goals & Success Metrics

> **Define claramente qué queremos lograr y por qué.** Ve directo al grano. Informa, no aburras.

### Nuestros objetivos:

¿Cuáles son las metas u objetivos de este producto? ¿Qué métricas de éxito indican que las metas se han alcanzado?

**Ejemplo:**

> Reducir nuestros costos operativos y mejorar la adopción del cliente de nuestra aplicación habilitando autoservicio de gestión de cuentas de usuario.

**Lista de objetivos específicos:**

- [Objetivo 1]: [Ej: Crear una versión móvil del sitio web para que usuarios puedan acceder desde notificaciones de email]
- [Objetivo 2]: [Ej: Lograr paridad de funciones con la mayoría de características - excepto creación de eventos]
- [Objetivo 3]: [Ej: Reducir costos de soporte en un 30%]

### Success Metrics

> **Define el éxito de forma medible.** ¿Cómo sabrás que este proyecto funcionó?

| Métrica                                        | Baseline actual | Target / Meta   | Método de medición | Plazo   |
| ---------------------------------------------- | --------------- | --------------- | ------------------ | ------- |
| p. ej., "Customer support tickets por mes"     | 200 tickets/mes | 100 tickets/mes | Zendesk Analytics  | 3 meses |
| p. ej., "Customer experience score (CSAT)"     | 75/100          | 85/100          | Encuesta post-uso  | 6 meses |
| p. ej., "Bugs filed contra el producto"        | N/A             | < 50 bugs       | JIRA Bug Tracker   | 3 meses |
| p. ej., "Tasa de adopción de la funcionalidad" | N/A             | 60%             | Product Analytics  | 6 meses |

### Métricas de éxito del negocio:

- **Revenue impact:** [Ej: Reducir costos de soporte en $100K/año]
- **User growth:** [Ej: 5K usuarios adicionales usando la funcionalidad]
- **Engagement:** [Ej: 40% de admins usando la funcionalidad semanalmente]
- **Customer satisfaction:** [Ej: NPS aumenta de 30 a 50]

---

## 📖 Background and strategic fit

> **¿Por qué hacemos esto?** Proporciona el contexto y explica cómo encaja en las metas estratégicas.

### El problema / La oportunidad:

[Describe el problema del usuario o la oportunidad de mercado]

### Datos que lo respaldan:

[Incluye datos, investigación, o insights que justifican este proyecto]

**Ejemplo completo:**

> Todos sabemos que el móvil está en auge. Una [encuesta reciente](#) a clientes mostró que el **85% de los usuarios usan su móvil a diario**. La mayoría de nuestros clientes también usan aplicaciones de la competencia, así que esto es algo que necesitamos tener. Podremos medir nuestro éxito a través de analytics y podemos usar el sitio web actual como línea base.

### Cómo encaja estratégicamente:

- **Alineación con OKRs:** [Ej: OKR Q1 - Mejorar eficiencia operacional en 25%]
- **Ventaja competitiva:** [Ej: Nuestros competidores principales no ofrecen autoservicio]
- **Impacto en el negocio:** [Ej: Permite escalar sin aumentar equipo de soporte]
- **Visión a largo plazo:** [Ej: Primer paso hacia plataforma self-service completa]

---

## 🔬 Customer research

> **Investigación de usuarios:** Enlaces a entrevistas, encuestas, y hallazgos de investigación que informan este PRD.

### Entrevistas de clientes:

- [Customer interview - Netflix](#)
- [Customer interview - Homeaway](#)
- [Customer interview - Bitbucket](#)
- [Customer interview - [Cliente 4]](#)

### Otros recursos de investigación:

- **Encuestas de usuarios:** [URL a resultados de encuesta]
- **Análisis de competencia:** [URL a análisis competitivo]
- **Datos de analytics:** [URL a dashboard]
- **User personas:** [URL a documentos de personas]
- **Customer journey maps:** [URL a journey maps]

### Insights clave de la investigación:

1. **[Insight 1]:** [Ej: 50% de tickets de soporte relacionados con gestión de cuentas]
2. **[Insight 2]:** [Ej: 65% de usuarios solicitan funcionalidad de autoservicio]
3. **[Insight 3]:** [Ej: Tiempo promedio de resolución de tickets es 2 días, impacta satisfacción]

---

## 🤔 Assumptions

> **Lista las suposiciones que tienes.** Es mejor hacerlas explícitas y validarlas que descubrirlas tarde.

### Supuestos sobre usuarios:

- [Ej: Los administradores tienen permisos específicos habilitados]
- [Ej: Los usuarios están familiarizados con interfaces de administración similares]
- [Ej: Los administradores revisarán la funcionalidad semanalmente]

### Supuestos técnicos:

- [Ej: La infraestructura actual puede manejar 1M de cuentas de usuario]
- [Ej: Podemos reutilizar componentes de autenticación existentes]
- [Ej: La API REST puede exponer la funcionalidad necesaria]

### Supuestos empresariales:

- [Ej: El equipo de soporte será capacitado 1 mes antes del lanzamiento]
- [Ej: El presupuesto de marketing está aprobado]
- [Ej: Legal ha revisado y aprobado el manejo de datos de usuario]

---

## 👥 Personas & User Scenarios

> **¿Quiénes son las personas objetivo para este producto?** ¿En qué contexto usarán el producto? ¿Cómo lo usarán?

### Persona 1: [Nombre de la Persona]

**Descripción:**
[Describe quién es esta persona, su rol, contexto de uso]

**Ejemplo:**

> **Admin**
> Un usuario que administra la aplicación para un equipo o empresa completo. Su tipo de cuenta es Admin y tiene permisos específicos.

**User Scenario:**

[Describe el escenario de uso específico]

**Ejemplo:**

> Los usuarios a menudo contactan a los Admins para hacer preguntas sobre sus cuentas, cambiar detalles de cuenta, o resetear su contraseña. Para atender estas consultas, un Admin navegará a la vista de User Account Management para buscar el usuario específico, ver los detalles de la cuenta, y luego hacer ediciones o resetear la contraseña según sea necesario. Después, el Admin guardará la información.
>
> Para propósitos de cumplimiento de seguridad, el Admin a veces es solicitado por el Equipo de Seguridad para extraer un log de auditoría de cambios hechos en un día específico para un usuario específico. El Admin navegará a la vista de User Account Management para exportar un log de auditoría en texto plano para proporcionar al Equipo de Seguridad.

---

### Persona 2: [Nombre de la Persona]

**Descripción:**
[Entra descripción de la persona]

**User Scenario:**
[Entra el escenario de uso]

---

## ❓ FAQ & Considerations

> **Preguntas frecuentes** que serían útiles para los lectores y cualquier decisión clave o consideración que se ha tomado.

### Frequently Asked Questions

- **[Pregunta 1]**
  [Ej: ¿Todos los Admins podrán editar cuentas de usuario?]

  [Respuesta: No, solo Admins con permisos específicos habilitados podrán editar cuentas de usuario.]

- **[Pregunta 2]**
  [Ej: ¿Hay un límite en el número de Admins con permisos de edición?]

  [Respuesta: Sí, habrá un límite basado en su suscripción. Ver los planes de suscripción para más detalles.]

- **[Pregunta 3]**
  [Ej: ¿Se entregará capacitación a los equipos de ventas y soporte?]

  [Respuesta: Sí, habrá material de habilitación interna y capacitación que se entregará 1 mes antes del lanzamiento. También habrá materiales de habilitación para clientes enviados automáticamente por email a todos los admins.]

### Key Decisions & Considerations

- **[Decisión 1]:** [Ej: Los Admins no podrán fusionar cuentas de usuario. En nuestra investigación, menos del 1% de las solicitudes de soporte fueron para fusionar cuentas. Hay actualmente un workaround viable y seguirá el mismo proceso de ticketing.]

- **[Decisión 2]:** [Ej: Los Admins no podrán editar múltiples cuentas a la vez. En la investigación inicial, ninguno de los admins solicitó tener esta funcionalidad.]

---

## 🗓️ Timeline

> **Indica la fecha de lanzamiento deseada y los hitos para el producto.** Estos detalles pueden no conocerse de entrada y pueden desarrollarse durante el ciclo de vida del desarrollo.

### Release Schedule

**Target launch date:** [March 1, 2024]

- **Pre-launch marketing:** [February 15 - March 1]
- **Post-launch marketing:** [March 2 - March 10]
- **Internal enablement:** [Entrenamiento 1 mes antes del launch]

### Milestones

¿Cuáles son los hitos que mantendrán la entrega del producto en marcha?

| Milestone                                        | Due Date          | Owner          | Status         | Bloqueadores                 |
| ------------------------------------------------ | ----------------- | -------------- | -------------- | ---------------------------- |
| User stories & requirements definition completed | November 20, 2024 | @Product       | ✅ Completado  | -                            |
| Initial designs completed                        | December 5, 2024  | @Designer      | ✅ Completado  | -                            |
| Initial build completed                          | January 15, 2025  | @Tech Lead     | 🔄 En progreso | Dependency on API updates    |
| QA completed                                     | February 1, 2025  | @QA            | ⏳ Pendiente   | Waiting for build completion |
| Usability testing completed                      | February 15, 2025 | @Product + @UX | ⏳ Pendiente   | -                            |
| Start pre-launch marketing campaign              | February 15, 2025 | @PMM           | ⏳ Pendiente   | -                            |
| Customer enablement content ready                | February 20, 2025 | @Tech Writer   | ⏳ Pendiente   | -                            |
| Product readiness completed                      | February 25, 2025 | @Product       | ⏳ Pendiente   | -                            |
| Product launch                                   | March 1, 2025     | @Todos         | ⏳ Pendiente   | -                            |

---

## 📋 Features & Requirements

> **Documenta las características y requisitos clave** que se incluirán en el producto, así como las características que NO se incluirán.

### Features Included

¿Qué características se incluyen en esta ronda de desarrollo de producto? ¿Por qué son importantes? ¿Cuáles son los requisitos clave? ¿Cómo usará y se beneficiará el usuario de ellas?

---

#### **Feature 1:** [Nombre de la Característica]

[Ej: Search for a user account]

**Requirements:**

- [Ej: Must have specific permissions]
- [Ej: Be able to search by username or email]
- [Ej: Realtime search]

**User Story:**

> Como [tipo de usuario], quiero [objetivo] para [beneficio]

**Ejemplo:**

> Como admin, quiero poder buscar y encontrar un usuario específico para que pueda atender preguntas o cambios para un usuario en particular.

**Acceptance Criteria (Gherkin/BDD):**

```gherkin
Scenario: Admin searches by username or email
  GIVEN that I am on the Account Management Page
  WHEN I type in the search box
  THEN the list of accounts change in real-time to show results of the search by attempting to match by username or email

Scenario: Admin does NOT find a user account when searching
  GIVEN that I am on the Account Management Page
  WHEN there are no accounts showing in the list because of the search criteria
  THEN the system shows text on the page indicating that there are "No accounts found"
```

**Priority:** 🔴 **MUST HAVE**

**ClickUp Task:** 📎 [TASK-123](#)

**Notes:**

- We will need to talk to @Designer about search UX patterns
- Research done on search patterns: [Link to research](#)

---

#### **Feature 2:** [Nombre de la Característica]

[Ej: View account details]

**Requirements:**

- [Ej: Must have specific permissions]
- [Ej: Read-only mode]
- [Ej: Mask the password]

**User Story:**

> Como admin, quiero poder ver los detalles de cuenta de un usuario específico en modo read-only para poder responder preguntas o auditar detalles.

**Acceptance Criteria (Gherkin/BDD):**

```gherkin
Scenario: Admin views a specific user's account details
  GIVEN that I am on the Account Management Page
  WHEN I click on a specific user
  THEN I am taken to the Account Details Page in read-only mode where I can see the user's username, first name, last name, masked password, email, and address

Scenario: Admin exits from the user's account details
  GIVEN that I am on the Account Details Page
  WHEN I click the Close button
  THEN I am taken back to the Account Management Page in the same state (i.e. filters/search criteria) that it was in last
```

**Priority:** 🔴 **MUST HAVE**

**ClickUp Task:** 📎 [TASK-124](#)

---

#### **Feature 3:** [Nombre de la Característica]

[Descripción y detalles similar al formato anterior]

---

### Tabla resumen de Requirements

| #   | Feature/User story title | Description                                                                          | Priority           | ClickUp Task | Notes                                 |
| --- | ------------------------ | ------------------------------------------------------------------------------------ | ------------------ | ------------ | ------------------------------------- |
| 1   | Search user account      | Admin wants to search and find specific user to field questions                      | 🔴 **MUST HAVE**   | TASK-123     | @Designer review search patterns      |
| 2   | View account details     | Admin wants to view user's account details in read-only to answer questions or audit | 🔴 **MUST HAVE**   | TASK-124     | Ensure password is masked             |
| 3   | Edit account details     | Admin wants to edit user account details to make changes for particular user         | 🔴 **MUST HAVE**   | TASK-125     | Reset password functionality included |
| 4   | Export audit log         | Admin wants to export audit log for compliance purposes                              | 🟡 **SHOULD HAVE** | TASK-126     | Plain text format sufficient for v1   |

### Niveles de prioridad

- **🔴 MUST HAVE:** Crítico para el lanzamiento, sin esto no se puede publicar
- **🟡 SHOULD HAVE:** Importante pero no bloqueante, se puede incluir en una versión posterior si es necesario
- **🟢 COULD HAVE:** Nice-to-have, mejora la experiencia pero no es esencial
- **⚪ WON'T HAVE:** Explícitamente fuera de alcance para esta versión

---

### Features Excluded (Not Doing)

> **Es tan importante definir lo que NO haremos como lo que SÍ haremos.** Mantén al equipo enfocado.

¿Qué características NO están incluidas en esta ronda de desarrollo? ¿Por qué no están incluidas? ¿Hay planes de incluirlas en un lanzamiento futuro?

| Funcionalidad                  | Razón                                                                     | ¿Versión futura? | Prioridad si se incluye |
| ------------------------------ | ------------------------------------------------------------------------- | ---------------- | ----------------------- |
| Export in Excel format         | Se incluirá en el segundo release. No es crítico para el 80% de clientes  | Sí - v2.0        | Media                   |
| Merge user accounts            | Menos del 1% de solicitudes de soporte. Hay workaround viable actualmente | Tal vez - v3.0   | Baja                    |
| Edit multiple accounts at once | En investigación inicial, ningún admin solicitó esta funcionalidad        | No               | Baja                    |
| Native mobile app              | Empezando con mobile web primero para validar demanda                     | Sí - v2.0        | Alta (si validado)      |

---

## 🎨 User interaction and design

> **Mockups, wireframes, y prototipos:** Ayudan al equipo a visualizar la solución antes de construirla.

Incluye diseños enlazando a diseños almacenados en otras herramientas o copiando imágenes en esta página. Actualiza continuamente esta página a medida que se crean o actualizan diseños.

| Area/Feature         | Design/Link                           | Status         |
| -------------------- | ------------------------------------- | -------------- |
| Navigation menu      | [Link to Figma design](#)             | ✅ Aprobado    |
| View account details | [Link to Figma design](#)             | ✅ Aprobado    |
| Edit account details | [Link to Figma design](#)             | 🔄 En revisión |
| Update password      | [Link to Figma design](#)             | ⏳ Pendiente   |
| Search interface     | [Link to Figma design](#)             | ✅ Aprobado    |
| Notifications        | ![Notification mockup placeholder](#) | ✅ Aprobado    |

### Enlaces de diseño:

- **Diseños de alta fidelidad:** [Figma - [Product Name] v1.0](#)
- **Prototipo interactivo:** [InVision prototype](#)
- **Sistema de diseño:** [Design system documentation](#)
- **User flows:** [[Product Name] user flows](#)

### Consideraciones de diseño:

- **UX:** [Ej: Interfaz debe ser intuitiva para admins sin training extenso]
- **Accesibilidad:** [Ej: WCAG 2.1 AA compliance, soporte para lectores de pantalla, contrast ratio 4.5:1]
- **Performance:** [Ej: Page load time <= 2 segundos para cada página]
- **Responsive:** [Ej: Funcional en desktop (primary) y tablet]

---

## ❓ Questions & Open Items

> **Preguntas que surgieron durante el proceso.** Documenta las decisiones tomadas y el razonamiento.

Below is a list of questions to be addressed as a result of this requirements document:

| Question                                     | Outcome                                                                                                                                                                                                              | Owner      | Status          | Date Resolved |
| -------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | --------------- | ------------- |
| What about Google Apps integration?          | • We think this is important, but not for version one.<br>• We can look at this at a later stage.<br>• 💡 It might be worth someone looking into a shared notification library to do this.                           | @Product   | ✅ Resuelto     | 2024-11-15    |
| Are we supporting Blackberry?                | • Again, not for initial version - but we haven't had much demand for this.<br>• Can re-evaluate based on customer requests post-launch.                                                                             | @Product   | ✅ Resuelto     | 2024-11-18    |
| Should we have an offline mode?              | • We've talked about the pros and cons. In brief:<br> ➕ Seamless experience for customers<br> ➕ Most competitors don't have this<br> ➖ Could be expensive to build<br> ❓ Should we spike this at a later sprint? | @Tech Lead | 🔄 En discusión | TBD           |
| Performance requirements for large accounts? | [Outcome pendiente]                                                                                                                                                                                                  | @Engineer  | ⏳ Pendiente    | TBD           |

### 💡 Consejo: Documenta las decisiones

Cuando una pregunta se responda, documenta:

- **Qué se decidió:** La decisión final
- **Por qué se decidió:** El razonamiento y trade-offs considerados
- **Quién participó:** Los stakeholders involucrados en la decisión
- **Cuándo se decidió:** La fecha
- **Próximos pasos:** Si requiere acción adicional

**Usa emojis para claridad visual:**

- 💡 Ideas o sugerencias
- ➕ Pros / Ventajas
- ➖ Cons / Desventajas
- ❓ Preguntas pendientes
- ✅ Decisión tomada / Resuelto
- 🔄 En discusión
- ⏳ Pendiente
- 🚧 En investigación

---

## ✅ Release Criteria

> **¿Qué criterios son necesarios para que el producto esté listo para el lanzamiento?** Considera requisitos para cada una de las secciones siguientes.

### Functionality

¿Qué criterios deben cumplirse para validar que el producto funciona como debe?

- [ ] User debe poder ver detalles de cuenta
- [ ] User debe poder cambiar su contraseña
- [ ] User debe poder cambiar métodos de pago de suscripción
- [ ] Admin debe poder buscar usuarios por username o email
- [ ] Admin debe poder editar detalles de cuenta de usuario
- [ ] [Criterio adicional]

### Usability

¿Qué benchmarks deben cumplirse para confirmar que el usuario puede usar el producto efectivamente?

- [ ] Pop-up instructivo se mostrará la primera vez que el usuario navega a la nueva pantalla
- [ ] Completar prueba de usabilidad con al menos 5 usuarios
- [ ] Resultados de prueba de usabilidad deben mostrar que el usuario puede navegar y completar funciones sin guía adicional y sin errores
- [ ] Tasa de éxito en tareas clave >= 90%
- [ ] [Criterio adicional]

### Performance & Reliability

¿Cuáles son benchmarks específicos de rendimiento y confiabilidad que deben cumplirse?

- [ ] Page load time <= 2 segundos para cada página
- [ ] Debe manejar hasta 1 millón de cuentas de usuario
- [ ] 99.99% uptime
- [ ] Response time de API <= 500ms para el 95% de requests
- [ ] [Criterio adicional]

### Security

¿Qué estándares de seguridad y cumplimiento deben cumplirse? Considera mantenimiento o mejora en certificaciones de seguridad y cumplimiento.

- [ ] ISO 27001:2013
- [ ] ISO 27017:2015
- [ ] ISO 27018:2019
- [ ] SOC 2 Type 2 certification
- [ ] PCI DSS certification (si aplica)
- [ ] GDPR compliance
- [ ] CCPA/CPRA compliance
- [ ] Password hashing con bcrypt/Argon2
- [ ] Audit logging de todas las acciones de admin
- [ ] [Criterio adicional]

### Supportability

¿Qué requisitos deben cumplirse para asegurar que el producto puede ser mantenido eficientemente durante todo su ciclo de vida? Considera testing, deployment, adaptabilidad, localización, etc.

- [ ] Customer Support debe ser capacitado en nuevas funciones del producto
- [ ] Nuevo producto debe agregarse a la lista de productos soportados en el formulario de ticket de soporte
- [ ] Logs deben incluir:
  - [ ] Warnings y errores
  - [ ] Fecha, hora, cuenta de usuario, y detalles de cada acción
- [ ] Documentación de usuario completa y publicada
- [ ] Documentación técnica para el equipo de soporte
- [ ] Runbooks para incidentes comunes
- [ ] [Criterio adicional]

---

## 🔗 Dependencies and timeline

> **Dependencias técnicas y de negocio** que podrían impactar el proyecto.

### Dependencias técnicas:

- **API de autenticación:** Requiere actualización de OAuth library v2.0 → v3.0
- **CDN para assets:** Necesitamos configurar CloudFront antes del launch
- **Database migration:** Migración de esquema debe completarse 2 semanas antes del launch
- **[Dependencia 4]:** [Descripción]

### Dependencias de equipos:

- **Equipo de Platform:** Necesita exponer nuevos endpoints REST (fecha requerida: [fecha])
- **Equipo de Design System:** Componentes de admin UI deben estar listos antes de desarrollo (fecha requerida: [fecha])
- **Legal:** Revisión de términos y manejo de datos de usuario (aprobación requerida antes de beta)
- **Marketing:** Materiales de campaña pre-launch (fecha requerida: [fecha])

### Dependencias externas:

- **Third-party service:** [Ej: Integración con servicio de email]
- **Vendor approval:** [Ej: Aprobación de partnership con proveedor X]

---

## 🚨 Risks and mitigations

> **Riesgos conocidos** y cómo los mitigaremos.

| Riesgo                                                   | Probabilidad | Impacto | Mitigación                                                                                 | Owner      |
| -------------------------------------------------------- | ------------ | ------- | ------------------------------------------------------------------------------------------ | ---------- |
| La base de datos no soporta 1M de cuentas eficientemente | Media        | Alto    | Hacer load testing 1 mes antes del launch, optimizar queries, considerar sharding          | @Tech Lead |
| Usuarios no adoptan la funcionalidad de autoservicio     | Baja         | Alto    | Campaign de marketing agresivo, in-app tooltips, email outreach, training webinars         | @PMM       |
| Retraso en desarrollo por complejidad no anticipada      | Alta         | Medio   | Reducir scope a features MUST HAVE únicamente, mover SHOULD HAVE a v1.1                    | @Product   |
| Problemas de seguridad con manejo de datos de usuario    | Baja         | Crítico | Security review exhaustivo, penetration testing, audit logging completo                    | @Tech Lead |
| Equipo de soporte no capacitado a tiempo                 | Media        | Medio   | Iniciar capacitación 1 mes antes, crear documentación y videos de training anticipadamente | @Product   |

---

## 📚 Enlaces de referencia

> **El poder de los enlaces:** En lugar de copiar contenido largo, enlaza a documentos detallados.

### Documentación del proyecto:

- **Project brief:** [Link to project brief](#)
- **Technical specs:** [Link to technical architecture doc](#)
- **API documentation:** [Link to API docs](#)
- **Security review:** [Link to security assessment](#)

### Investigación y datos:

- **User research findings:** [Link to research repo](#)
- **Competitive analysis:** [Link to competitor analysis](#)
- **Analytics dashboard:** [Link to analytics](#)
- **Market research:** [Link to market research report](#)
- **Usability testing results:** [Link to testing summary](#)

### Diseño:

- **Design mockups:** [Figma - [Product Name] v1.0](#)
- **Prototype:** [InVision prototype](#)
- **Design system:** [Link to design system](#)
- **User flows:** [Link to user flows](#)

### Materiales de habilitación:

- **Customer enablement materials:** [Link to customer docs](#)
- **Internal training materials:** [Link to training deck](#)
- **Sales enablement:** [Link to sales materials](#)
- **Support documentation:** [Link to support KB articles](#)

---

## 📝 Change log

> **Mantén este documento actualizado.** Documenta cambios significativos para que el equipo sepa qué ha evolucionado.

| Fecha      | Versión | Autor      | Cambios                                                             | Notificado a          |
| ---------- | ------- | ---------- | ------------------------------------------------------------------- | --------------------- |
| 2024-11-01 | 1.0     | @Product   | Creación inicial del documento                                      | @equipo               |
| 2024-11-15 | 1.1     | @Product   | Añadidas métricas de éxito basadas en feedback de stakeholders      | @stakeholders         |
| 2024-11-20 | 1.2     | @Tech Lead | Actualizadas dependencias técnicas después de tech review           | @engineering @product |
| 2024-12-01 | 2.0     | @Product   | Alcance refinado: removido merge accounts, añadido export audit log | @todos @leadership    |
| 2024-12-15 | 2.1     | @Designer  | Añadidos enlaces a diseños finales aprobados                        | @engineering @product |

### 💡 Consejo: ¿Cuándo actualizar?

Actualiza el PRD cuando:

- Cambien los requisitos basado en aprendizajes
- Se descubran nuevas restricciones técnicas
- El feedback de usuarios indique un pivote
- Se resuelvan preguntas abiertas importantes
- Cambien las fechas de los hitos
- Se redefinan prioridades (MUST HAVE ↔ SHOULD HAVE)
- Se completen hitos importantes (diseños aprobados, build completado, etc.)

**No te preocupes por actualizaciones menores** de implementación que no afecten el propósito o alcance general.

---

## ✅ Aprobaciones y sign-off

> **En metodología ágil, las aprobaciones no deben ser barreras.** Busca consenso y alineación continua.

| Rol                       | Nombre    | Fecha      | Status       | Comentarios                                      |
| ------------------------- | --------- | ---------- | ------------ | ------------------------------------------------ |
| Product Manager           | @[Nombre] | 2024-11-20 | ✅ Aprobado  | Ready to proceed, scope is clear                 |
| Tech Lead                 | @[Nombre] | 2024-11-22 | ✅ Aprobado  | Technical dependencies noted, timeline realistic |
| Designer                  | @[Nombre] | 2024-11-21 | ✅ Aprobado  | Designs aligned with requirements                |
| QA Lead                   | @[Nombre] | 2024-11-23 | ✅ Aprobado  | Test strategy defined, release criteria clear    |
| Engineering Manager       | @[Nombre] | 2024-11-25 | ✅ Aprobado  | Team capacity confirmed                          |
| Technical Writer          | @[Nombre] | [Fecha]    | ⏳ Pendiente | Awaiting design finalization                     |
| Product Marketing Manager | @[Nombre] | [Fecha]    | ⏳ Pendiente | Reviewing messaging strategy                     |
| Security Lead             | @[Nombre] | [Fecha]    | ⏳ Pendiente | Security review scheduled                        |

---

## 📖 Guía de uso de esta plantilla

### 🎯 Filosofía de este PRD

Este PRD combina lo mejor de tres enfoques:

1. **Atlassian/Agile approach:** Principios ágiles, comprensión compartida, flexibilidad
2. **ClickUp practical approach:** Estructura detallada, release criteria, gherkin scenarios
3. **Best practices:** FAQ, personas detalladas, comprehensive checklist

### 🤝 Cómo usar esta plantilla

#### **Secciones obligatorias (siempre completa):**

- ✅ Overview (con todos los roles asignados)
- ✅ Goals & Success Metrics
- ✅ Background and strategic fit
- ✅ Features Included (con al menos user stories)
- ✅ Features Excluded (Not Doing)
- ✅ Timeline con milestones
- ✅ Release Criteria (al menos Functionality y Usability)

#### **Secciones opcionales (completa según necesidad):**

- 📝 Customer research (si hay investigación disponible)
- 📝 Personas & User Scenarios (para productos complejos)
- 📝 FAQ & Considerations (si hay preguntas frecuentes)
- 📝 Gherkin scenarios (para equipos que usan BDD)
- 📝 Release Criteria completo (todas las secciones)
- 📝 Dependencies (si hay dependencias críticas)
- 📝 Risks (si hay riesgos significativos)

### ✅ Checklist de completitud

Antes de mover el estado a "IN DEVELOPMENT", verifica:

**Básico:**

- [ ] Todos los roles están asignados (@menciones)
- [ ] Target release date está definido
- [ ] Goals y success metrics son específicos y medibles
- [ ] Background explica claramente el "por qué"
- [ ] Al menos 3-5 features están definidos con user stories
- [ ] Prioridades están asignadas (MUST/SHOULD/COULD)
- [ ] "Not Doing" está explícito
- [ ] Timeline tiene al menos 5 milestones clave

**Intermedio:**

- [ ] Success metrics tienen baseline y target
- [ ] Customer research está enlazada o resumida
- [ ] Cada feature tiene acceptance criteria
- [ ] Enlaces a ClickUp/JIRA están incluidos
- [ ] Diseños están enlazados o incluidos
- [ ] Release criteria tiene al menos Functionality y Usability
- [ ] FAQ tiene al menos 3 preguntas comunes

**Avanzado (para productos complejos):**

- [ ] Personas detalladas con scenarios específicos
- [ ] Gherkin scenarios para features MUST HAVE
- [ ] Release criteria completo (6 secciones)
- [ ] Dependencies mapeadas con owners
- [ ] Risks identificados con mitigations
- [ ] Materiales de habilitación planificados

### 🎓 Recursos adicionales

- **Manifiesto Ágil:** https://agilemanifesto.org/
- **Gherkin/BDD Guide:** https://cucumber.io/docs/gherkin/
- **Product Management Templates:** ClickUp, Atlassian, Productboard
- **User Story Mapping:** Libro de Jeff Patton

---

## 💡 Consejos finales

### Para Product Managers:

- **Empieza simple:** No necesitas completar todas las secciones el primer día
- **Itera continuamente:** El PRD debe evolucionar con el producto
- **Involucra al equipo:** Nunca escribas el PRD solo
- **Usa Gherkin si tu equipo lo practica:** Es excelente para claridad, pero opcional
- **Prioriza ruthlessly:** No todo puede ser MUST HAVE

### Para Diseñadores:

- **Participa desde el inicio:** No esperes a que el PRD esté "terminado"
- **Usa la sección de Personas:** Es tu oportunidad de influir con research de UX
- **Actualiza diseños continuamente:** Mantén la sección de designs actualizada
- **Contribuye a acceptance criteria:** Tus insights de UX son valiosos

### Para Developers:

- **Lee las Personas y Scenarios:** Te ayudan a entender el contexto real de uso
- **Usa Gherkin scenarios:** Son tus acceptance tests automatizados
- **Valida Release Criteria:** Asegúrate de que son técnicamente feasibles
- **Actualiza Dependencies:** Si descubres nuevas dependencias técnicas, añádelas

### Para QA Engineers:

- **Los Gherkin scenarios son tus test cases:** Úsalos para planear testing
- **Contribuye a Release Criteria:** Especialmente Functionality y Usability
- **Valida acceptance criteria:** Asegúrate de que son testables
- **Define performance benchmarks:** Sé específico en Performance & Reliability

---

**Última actualización:** [Fecha]
**Versión de la plantilla:** 4.1 (Híbrido Atlassian + ClickUp + Best Practices + Guía Educativa)
**Basado en:** Atlassian PRD best practices, ClickUp PRD template, Gherkin/BDD standards, LIDR educational content
**Changelog v4.1:** Agregada sección educativa "¿Cuándo usar este PRD?" con niveles de detalle según incertidumbre del proyecto
