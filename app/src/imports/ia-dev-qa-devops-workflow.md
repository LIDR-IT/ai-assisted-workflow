### 2.2 — Desarrollo: asistencia contextualizada para implementación

**Problema que resuelve:** Los devs usan herramientas de IA de forma desorganizada (cada uno con sus propios prompts, sin contexto compartido) o directamente no las usan. No hay consistencia en cómo se aprovecha la IA para escribir código, ni en cómo se estructura el output.

**Intervención:** Definir un conjunto de prompts system y flujos de trabajo con IA adaptados al stack tecnológico, convenciones y arquitectura del equipo.

**Artefactos para el equipo de desarrollo:**

**a) Sistema de contexto y rules a nivel de organización**

**b) Sistema de contexto y rules a nivel de tecnología**

**c) Sistema de contexto y rules a nivel de proyecto**

**Estos sistemas de contexto base deben estar disponibles para cualquier dev** para su uso durante la ejecución del proyecto. Contienen datos como: stack tecnológico, convenciones de código, patrones arquitectónicos del proyecto, estructura de directorios, convenciones de naming, y cualquier regla específica del equipo.

**Se debe definir con la empresa donde residirán estas rules**, si en el repositorio del proyecto o en sistema de documentación tipo confluence.

**d) Flujo estándar de implementación de un ticket**
Se define un proceso paso a paso para abordar un ticket con asistencia de IA:

1. **Análisis del ticket:** El dev alimenta el ticket completo (estructura de 2.1) a la herramienta de IA junto con el contexto del proyecto para obtener un plan de implementación antes de escribir código.
2. **Desglose en subtareas:** La IA propone un breakdown técnico del ticket en subtareas ordenadas. El dev valida, ajusta y confirma.
3. **Implementación asistida:** El dev implementa cada subtarea con asistencia de IA, usando el contexto del proyecto para mantener consistencia con el código existente.
4. **Auto-revisión previa al PR:** Antes de abrir pull request, el dev pasa su código por una revisión asistida con IA que verifica adherencia a las convenciones del equipo, posibles bugs, y cobertura de los criterios de aceptación del ticket.

**e) Convenciones de commit y PR estandarizadas**
Se define un formato estándar de mensaje de commit y de descripción de pull request, con un prompt que genera automáticamente la descripción del PR a partir del diff y el ticket asociado. Se puede hacer con algo tan simple como la implementación de un command estándar para todos los devs.

**Criterio de estandarización:** Todos los devs trabajan con el mismo prompt system de contexto, el mismo flujo de implementación y las mismas convenciones de commit/PR. Un code reviewer que abre cualquier PR encuentra siempre la misma estructura descriptiva.

---

### 2.3 — QA: generación estandarizada de casos de prueba y reporting

**Problema que resuelve:** QA recibe la funcionalidad sin contexto suficiente para testear de forma completa, o invierte demasiado tiempo diseñando casos de prueba que podrían derivarse automáticamente de los criterios de aceptación.

**Intervención:** Definir un flujo en el que QA recibe un artefacto estandarizado del dev al completar un ticket, y utiliza IA para generar y complementar los casos de prueba.

**Artefactos para el equipo de QA:**

**a) Handoff estándar dev → QA**
Cuando un dev completa un ticket, además del PR produce (asistido por IA) un documento de entrega breve:

```
## Ticket referencia
[ID y enlace al ticket]

## Qué se ha implementado
[Resumen funcional de lo desarrollado, en lenguaje que QA pueda entender sin leer código.]

## Cambios relevantes
[Endpoints nuevos o modificados, cambios en base de datos, configuración nueva, etc.]

## Cómo probarlo
[Pasos concretos para verificar la funcionalidad en el entorno de staging. Datos de prueba si aplica.]

## Riesgos conocidos
[Áreas que podrían verse afectadas por los cambios y que conviene testear como regresión.]
```

**b) Prompt system para generación de casos de prueba**
QA alimenta a la herramienta de IA el ticket original (con criterios de aceptación) + el documento de handoff del dev, y obtiene una propuesta de casos de prueba que incluye: happy path, casos límite, escenarios de error y pruebas de regresión sugeridas. QA revisa, ajusta y ejecuta.

**c) Reporting estandarizado de bugs**
Plantilla + prompt para que los bugs reportados por QA sigan siempre la misma estructura: pasos para reproducir, resultado esperado vs. obtenido, entorno, evidencia (captura/log), severidad. Esto reduce las idas y vueltas entre QA y dev al reportar defectos.

**Criterio de estandarización:** Todo handoff dev→QA sigue la misma estructura. Todo bug reportado sigue la misma plantilla. Cualquier miembro de QA puede testear cualquier ticket sin depender de contexto verbal del dev que lo implementó.

---

### 2.4 — DevOps / despliegue: documentación automatizada de releases

**Problema que resuelve:** Los despliegues no llevan documentación clara de qué incluyen, lo que dificulta el diagnóstico de problemas y la comunicación con stakeholders.

**Intervención:** Generación asistida de release notes a partir de los PRs mergeados en la release, usando IA para producir un resumen funcional (para stakeholders) y técnico (para el equipo).

**Artefacto:**
Prompt system que toma como input la lista de PRs incluidos en una release (con sus descripciones estandarizadas, ver 2.2c) y genera un changelog con dos niveles: resumen ejecutivo para negocio y detalle técnico para el equipo.

**Criterio de estandarización:** Todas las releases siguen el mismo formato de documentación. Cualquier persona del equipo o de negocio puede entender qué se ha desplegado.

---

### 2.5 — Consolidación: catálogo de artefactos y prompts del equipo

Una vez definidos todos los artefactos, se consolidan en un documento único (o espacio en la herramienta del equipo: Notion, Confluence, etc.) que funciona como referencia centralizada:

- **Catálogo de plantillas:** Todas las plantillas de ticket, handoff, bug report, PR, release notes.
- **Biblioteca de prompts:** Todos los prompts system organizados por rol y caso de uso, con instrucciones de uso y ejemplos.
- **Guía de herramientas:** Qué herramienta de IA se usa para qué (si el equipo usa más de una).
- **Convenciones:** Todas las convenciones acordadas (commits, branches, naming, etc.).

Este catálogo es propiedad del equipo y debe mantenerse como documento vivo.

### Entregable de la Fase 2

Documento completo con la metodología adaptada, todos los artefactos, plantillas y prompts listos para usar, y el catálogo consolidado. Este documento es el material de la sesión de presentación (fase 3).
