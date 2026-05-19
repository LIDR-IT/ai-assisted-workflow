# Guía PRD para Estudiantes: Todo lo que necesitas saber

**Tiempo de lectura:** 15 minutos

---

## 📚 ¿Qué es un PRD?

Un **Product Requirements Document (PRD)** es un documento que describe:

- **QUÉ** vas a construir
- **POR QUÉ** es importante
- **PARA QUIÉN** lo construyes
- **CÓMO** sabrás que funcionó

> **En palabras simples:** Es el manual de instrucciones de tu producto ANTES de construirlo.

### Función del PRD

El PRD actúa como un **puente entre la idea y la implementación**. Define claramente:

- El propósito del producto
- Sus características y funcionalidades
- Los criterios bajo los cuales se considerará exitoso

Este documento es crucial para asegurar que todos los involucrados en el desarrollo del producto estén alineados con los objetivos y expectativas.

---

## 🎯 ¿Por qué necesitas un PRD?

### Problema sin PRD:

Tu equipo tiene una idea, pero:

- El diseñador imagina una cosa
- El developer entiende otra
- QA no sabe qué testear
- Nadie sabe cuándo "está listo"

**Resultado:** 😵 Caos, retrabajos, frustración.

### Ventajas de usar un PRD:

**1. Una página, una fuente**
Todo el contexto del proyecto en un solo lugar. No más información dispersa en Slack, email, Google Drive, etc.

**2. Alinea la visión del equipo**
Todos comprenden las metas del producto. Esto evita malentendidos que podrían descarrilar el desarrollo.

**3. Mejora la colaboración**
El PRD recopila feedback de varios departamentos, fomentando sentido de propiedad.

**4. Reduce ambigüedad**
Detalla exactamente lo que hay que construir, ayudando a la gestión general del producto.

**5. Rápida comercialización**
Reduce la necesidad de revisiones y evita desviaciones del alcance.

---

## 🚀 Principios ágiles del PRD moderno

> **Los PRD tradicionales:** 50 páginas que nadie lee
>
> **Los PRD ágiles:** Concisos, vivos, colaborativos

### ✅ Un PRD ágil ES:

**Vivo y actualizable**
Cambia según aprendes y recibes feedback. No es un contrato rígido.

**Centrado en el "por qué"**
Explica el problema que resuelves. Deja el "cómo" al equipo técnico.

**Colaborativo**
Creado CON tu equipo (desarrolladores, diseñadores), no PARA tu equipo.

**Conciso con enlaces**
Los enlaces ayudan a sintetizar la complejidad y revelar información progresivamente.

### ❌ Un PRD ágil NO ES:

**Especificaciones técnicas detalladas**
No incluye código, arquitectura de bases de datos, o diagramas técnicos.

**Un contrato inmutable**
Puede cambiar. Agile significa adaptabilidad.

**Algo que escribes solo**
Nunca escribas el PRD en solitario. Siempre involucra al equipo.

---

## ⚠️ 5 Antipatrones a evitar

Estos son los errores más comunes al crear PRDs:

**1. Especificarlo TODO antes de empezar**
❌ Escribir 100 páginas de especificaciones antes de tocar código
✅ Documentar lo esencial, iterar según aprendas

**2. Aprobaciones rigurosas y lentas**
❌ 7 niveles de aprobación antes de empezar a trabajar
✅ Revisión rápida con stakeholders clave

**3. Actualizaciones invisibles**
❌ Cambiar el PRD sin avisar a nadie
✅ Notificar al equipo cuando cambias algo importante

**4. Nunca actualizar**
❌ Escribir el PRD una vez y olvidarlo
✅ Actualizar cada sprint con nuevos aprendizajes

**5. Escribir solo**
❌ Product Manager escribe todo en su cueva
✅ Workshops con diseñadores y developers desde el inicio

---

## 📋 Estructura básica de un PRD

### Secciones OBLIGATORIAS (mínimo viable):

#### 1. **Overview** 🔑

**Qué incluir:**

- Nombre del producto
- Fecha de lanzamiento objetivo
- Roles (PM, Designer, Tech Lead, QA)
- Descripción breve (2-3 oraciones): ¿Qué es? ¿Por qué importa?

**Objetivo:** Que cualquiera entienda QUÉ es el producto en 30 segundos.

---

#### 2. **Goals & Success Metrics** 🎯

**Qué incluir:**

- Objetivos (3-5 metas cualitativas)
- Métricas medibles (tabla con baseline, target, método, plazo)

**Ejemplo de métrica:**

- Usuarios activos semanales: Baseline 0 → Target 500 → Medición: Google Analytics → Plazo: 3 meses

**Pro tip:** Incluye métricas de adquisición (cuántos usuarios nuevos), engagement (cuánto lo usan), y calidad (qué tan bueno es).

---

#### 3. **Features Included** 📋

**Qué incluir para cada feature:**

- Nombre de la feature
- User Story: "Como [usuario], quiero [acción] para [beneficio]"
- Prioridad: MUST HAVE / SHOULD HAVE / COULD HAVE / WON'T HAVE

**Niveles de prioridad:**

- 🔴 **MUST HAVE:** Crítico para el lanzamiento
- 🟡 **SHOULD HAVE:** Importante pero no bloqueante
- 🟢 **COULD HAVE:** Nice-to-have
- ⚪ **WON'T HAVE:** Explícitamente fuera de alcance

---

#### 4. **Features Excluded (Not Doing)** 🚫

**Por qué es importante:**
Es TAN importante definir lo que NO harás como lo que SÍ harás.

**Qué incluir:**

- Funcionalidad que NO se incluye
- Razón de exclusión
- ¿Se incluirá en versión futura?

---

#### 5. **Timeline** 🗓️

**Qué incluir:**

- Target launch date
- Milestones principales (tabla con fecha, owner, status)

---

### Secciones OPCIONALES (para PRDs completos):

#### 6. **Background & Strategic Fit** 📖

- El problema u oportunidad
- Datos que lo respaldan
- Cómo encaja en la estrategia general

#### 7. **Assumptions** 🤔

- Supuestos sobre usuarios
- Supuestos técnicos
- Supuestos empresariales

#### 8. **Personas & User Scenarios** 👥

- Descripción de cada persona (quién es, su rol, contexto)
- Escenario de uso específico (historia de cómo usa el producto)

#### 9. **FAQ & Considerations** ❓

- Preguntas frecuentes con respuestas
- Decisiones clave tomadas

#### 10. **Release Criteria** ✅

Cuándo el producto está "listo" para lanzar:

- Functionality: ¿Funciona?
- Usability: ¿Es fácil de usar?
- Performance: ¿Es rápido?
- Security: ¿Es seguro?

---

## 🎚️ ¿Cuándo usar cada nivel de PRD?

### Nivel 1: PRD Básico (1-2 horas)

**Cuándo usarlo:**

- MVPs y prototipos
- Experimentos rápidos
- Hackathons

**Qué incluir:**
Solo las 5 secciones obligatorias (Overview, Goals, Features, Not Doing, Timeline)

**Actualización:** Cada sprint (1-2 semanas)

---

### Nivel 2: Epic + User Stories (Agile puro)

**Cuándo usarlo:**

- Equipos 100% ágiles que NO usan PRDs tradicionales
- Proyectos con alta incertidumbre

**Qué incluir:**

- **Epic** en JIRA/ClickUp = Resumen de objetivo + contexto
- **User Stories** = Cada feature como "Como [usuario], quiero [acción] para [beneficio]"
- **Product Backlog** = Lista priorizada de todas las stories

**Actualización:** Cada sprint planning

---

### Nivel 3: PRD Completo (1-2 días)

**Cuándo usarlo:**

- Productos complejos con múltiples equipos
- Proyectos con baja incertidumbre
- Productos regulados (salud, finanzas)

**Qué incluir:**
Todas las 10 secciones (obligatorias + opcionales)

**Actualización:** Mensual o por milestone

---

### 🗺️ Tabla de decisión rápida

| Tu situación            | Nivel recomendado         | Tiempo    |
| ----------------------- | ------------------------- | --------- |
| 🚀 MVP/Prototipo        | Básico                    | 1-2 horas |
| 🔄 Alta incertidumbre   | Epic + Stories            | Iterativo |
| ⚖️ Proyecto establecido | Intermedio (Básico + FAQ) | 4-6 horas |
| 📐 Producto complejo    | Completo                  | 1-2 días  |

---

## 💡 Regla de oro

> **"Usa el mínimo de documentación necesaria para alinear al equipo y reducir riesgos."**
>
> - Más incertidumbre = Menos documentación
> - Menos incertidumbre = Más documentación

---

## 🔗 PRD y metodologías ágiles

**¿Se llevan bien?** ¡Sí!

El PRD puede coexistir con Agile. Piensa en el PRD como la **"documentación madre"** que alimenta tus artefactos ágiles:

- **Epic (JIRA/ClickUp)** = Resumen del PRD (Overview + Goals + Features)
- **User Stories** = Cada feature del PRD
- **Acceptance Criteria** = Condiciones de éxito de cada story
- **Product Backlog** = Tabla de requirements con prioridades
- **Sprint Goals** = Subconjunto de success metrics

**Workflow típico:**

1. Escribes el PRD (versión básica o completa)
2. Descompones el PRD en Epics
3. Descompones cada Epic en User Stories
4. Agregas Stories al Product Backlog
5. En Sprint Planning, seleccionas Stories del backlog
6. Actualizas el PRD según aprendizajes de cada sprint

---

## 📝 7 Pasos para crear tu PRD

### Paso 1: Documenta detalles esenciales del producto

- Propósito del producto
- Público objetivo
- Problema principal que resuelve

### Paso 2: Define claramente los objetivos

- Metas empresariales y técnicas
- Métricas de éxito medibles (KPIs)

### Paso 3: Nota supuestos y limitaciones

- Supuestos realizados durante planificación
- Restricciones (tecnológicas, presupuestarias, regulatorias)

### Paso 4: Añade antecedentes y estrategia

- Investigación de mercado
- Conocimientos sobre clientes
- Análisis de competencia

### Paso 5: Incluye historias y requisitos de usuarios

- Lo que el producto HARÁ
- Lo que el producto NO HARÁ

### Paso 6: Define funciones del producto

- Desglose de cada función individual
- Cómo se integra con otras partes
- Dependencias

### Paso 7: Establece métricas para medir éxito

- Niveles de compromiso de usuarios
- Puntos de referencia de rendimiento
- Objetivos de ventas
- Índices de satisfacción

---

## ✅ Qué hacer y ❌ Qué NO hacer

### ✅ Pendiente (Do's):

**1. Incorpora historias de usuarios**
Proporcionan contexto y hacen los requisitos más comprensibles.

**2. Define criterios de aceptación**
Establece expectativas explícitas para garantizar calidad.

**3. Actualízalo con regularidad**
Mantén el PRD actualizado según evolucione el proyecto.

**4. Establece hitos claros**
Divide el proyecto en fases con metas y plazos específicos.

**5. Facilita escalabilidad y flexibilidad**
Diseña el PRD para adaptarse a futuros ajustes.

---

### ❌ Qué NO hacer (Don'ts):

**1. Sobrecarga de información**
Evita incluir demasiados detalles. Puede abrumar al equipo.

**2. Ignora comentarios**
No descarte feedback de stakeholders. Pueden revelar oportunidades perdidas.

**3. Ser demasiado rígido**
Evita ser inflexible. Pueden ser necesarios ajustes basados en conocimientos técnicos.

**4. Omite validación**
Valida hipótesis y requisitos con estudios de mercado o prototipos.

**5. Descuida las métricas**
Evita omitir métricas y KPIs. Son cruciales para medir el éxito.

---

## 🎯 Componentes clave de un PRD (resumen completo)

Estos son los componentes que pueden incluirse en un PRD según el contexto:

### 📋 Introducción y Objetivos

Resumen del producto, incluyendo propósito, objetivos y metas.

### 👥 Stakeholders

Identifica todas las partes interesadas: usuarios, compradores, fabricantes, soporte, marketing, ventas, socios externos.

### 📖 Historias de Usuarios

Describe cómo los diferentes usuarios interactúan con el producto.

### 🗺️ Componentes Principales y Sitemaps

Detalla la estructura y organización del producto.

### ⚙️ Características y Funcionalidades

Enumera y describe características específicas del producto.

### 🎨 Diseño y Experiencia del Usuario

Especificaciones sobre diseño y experiencia del usuario.

### 💻 Requisitos Técnicos

Aspectos técnicos: hardware, software, interactividad, personalización, normativas.

### 📅 Planificación del Proyecto

Plazos, hitos y dependencias.

### ✅ Criterios de Aceptación

Estándares y condiciones bajo los cuales el producto será aceptado.

### 📚 Apéndices y Recursos Adicionales

Glosarios, explicaciones de términos, recursos externos, documentos de referencia.

---

## 📊 PRD vs BRD vs MRD

### ¿Cuál es la diferencia?

| Documento | Enfoque                           | Propósito                                       | Público                             |
| --------- | --------------------------------- | ----------------------------------------------- | ----------------------------------- |
| **PRD**   | Requisitos técnicos y de usuarios | Guiar al equipo de desarrollo                   | Developers, diseñadores             |
| **BRD**   | Necesidades de la empresa         | Alinear proyecto con estrategia empresarial     | Stakeholders, jefes de departamento |
| **MRD**   | Demandas del mercado              | Garantizar que el producto satisfaga el mercado | Marketing, product managers         |

**En resumen:**

- **PRD** = Cómo construir el producto
- **BRD** = Por qué construir el producto (negocio)
- **MRD** = Qué necesita el mercado

---

## 🎓 Importancia del PRD

El PRD es fundamental para **minimizar riesgos y malentendidos** durante el desarrollo. Asegura que todos los miembros del equipo comprendan completamente:

- Lo que se debe entregar
- Cuáles son las prioridades

### Contextos de uso:

**PRD tradicional (Cascada):**
Detallado, completo, planificación a largo plazo.

**PRD ágil:**
Ligero, dinámico, actualizable, corto plazo.

> **Conclusión clave:**
>
> "El PRD aglutina la información necesaria para implementar el producto, sea cual sea el contexto en el que se desarrolle."

Independientemente de la metodología (Cascada, Agile, híbrida), el PRD sirve para:

- 📌 Documentar la visión del producto
- 📌 Alinear al equipo
- 📌 Facilitar la comunicación
- 📌 Guiar la implementación

---

## 💼 Consejos finales por rol

### Para Product Managers:

- Empieza simple, no necesitas completar todo el primer día
- Itera continuamente
- Involucra al equipo desde el inicio
- Prioriza ruthlessly (no todo puede ser MUST HAVE)

### Para Diseñadores:

- Participa desde el día 1, no esperes a que el PRD esté "terminado"
- Usa la sección de Personas para influir con UX research
- Actualiza diseños continuamente

### Para Developers:

- Lee las Personas y Scenarios para entender contexto real
- Valida que Release Criteria son técnicamente feasibles
- Comunica limitaciones técnicas TEMPRANO

### Para QA Engineers:

- Contribuye a Release Criteria desde el inicio
- Valida que Acceptance Criteria son testables
- Identifica edge cases

---

## 🚀 Próximos pasos

**1. Practica inmediatamente**

❌ Leer 10 libros más antes de empezar
✅ Crea tu primer PRD ESTA SEMANA

**2. Empieza con nivel básico**

❌ "Mi primer PRD será perfecto"
✅ "Mi primer PRD será básico, lo mejoraré cada sprint"

**3. Involucra a tu equipo**

❌ Escribir solo
✅ Workshop de 2 horas con diseñadores y developers

**4. Itera y mejora**

❌ PRD como documento estático
✅ PRD como documento vivo que evoluciona

---

## ✨ Mensaje final

Crear PRDs no es solo "documentación aburrida". Es la diferencia entre:

❌ Equipos confundidos, retrabajos, lanzamientos fallidos
✅ Equipos alineados, desarrollo eficiente, productos exitosos

**Tu PRD es la brújula de tu producto.** Sin él, navegas a ciegas.

---

**Fuentes:**

- LIDR Educational Content
- Atlassian Agile PRD Best Practices
- ClickUp PRD Guide
- Template Best Practices (Atlassian + ClickUp)

**Última actualización:** Febrero 2024
