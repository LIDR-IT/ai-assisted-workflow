# Planificacion de Sprint

## Configuracion del Sprint

| Parametro                  | Valor Actual | Futuro Previsto                                |
| -------------------------- | ------------ | ---------------------------------------------- |
| **Duracion**               | 2 semanas    | 3 semanas (cuando el producto este mas maduro) |
| **Metodologia**            | Scrum        | Scrum                                          |
| **Unidad de estimacion**   | Horas        | Horas                                          |
| **Herramienta de gestion** | Jira         | Jira                                           |

---

## Estimacion por Horas (No Story Points)

La decision de estimar en horas en lugar de story points es deliberada y responde a una necesidad operativa concreta:

### Justificacion

- **Calculo de capacidad real**: Las horas permiten calcular con precision cuanto trabajo puede absorber el equipo, considerando que algunos miembros tienen dedicacion parcial y otros dedicacion total.
- **Transparencia**: Las horas son una unidad de medida universal que todos los stakeholders entienden sin necesidad de calibracion previa.
- **Dedicacion variable**: Con miembros del equipo que tienen diferentes porcentajes de dedicacion (100% vs parcial), las horas permiten un calculo mas preciso de la capacidad disponible por sprint.

### Calculo de Capacidad

La capacidad de cada sprint se calcula en funcion de:

- Numero de miembros del equipo disponibles.
- Porcentaje de dedicacion de cada persona (100% dedicacion completa vs parcial).
- Horas efectivas disponibles por persona (descontando reuniones, ceremonias, imprevistos).
- Total de horas disponibles = capacidad del sprint.

---

## Roles en la Planificacion

### Product Owner (PO)

- **Responsabilidad principal**: Define QUE entra en el sprint y prioriza el backlog.
- **Nivel de gestion**: Trabaja a nivel de Historia de Usuario y Tarea.
- **Limite**: No interviene en las sub-tareas tecnicas, que son "papel de trabajo" del desarrollador.
- **Participacion**: Presente en refinamiento, cotizacion y Sprint Planning.

### Equipo de Governance (Gov Lead + PO)

- **Responsabilidad principal**: Define el alcance y los objetivos del sprint.
- **Funciones**:
  - Facilitar la ejecucion del sprint.
  - Eliminar blockers que impidan el avance del equipo.
  - Asegurar que el equipo tiene las condiciones necesarias para cumplir los compromisos.
  - Gestionar riesgos y dependencias entre sprints.

### Tech Leads

- **Responsabilidad principal**: Estiman el COMO (como implementar cada funcionalidad).
- **Funciones**:
  - Cotizar las historias de usuario en horas.
  - Proponer la solucion tecnica para cada requisito.
  - Identificar riesgos tecnicos y dependencias de implementacion.
  - Participar en sesiones de refinamiento y cotizacion.

### Equipo de Desarrollo

- **Responsabilidad principal**: Generar sus propias sub-tareas tecnicas a partir de las historias asignadas.
- **Autonomia**: Las sub-tareas son su "papel de trabajo", diseñadas segun su criterio tecnico.
- **Compromiso**: Se comprometen con las estimaciones realizadas durante el planning.

---

## Proceso de Planificacion

### Paso 1: Definicion de Funcionalidades por la Product Owner

La PO revisa el backlog y selecciona los RFs y funcionalidades que quiere incluir en el proximo sprint. La seleccion se basa en:

- Prioridad de negocio.
- Dependencias tecnicas (que se necesita primero).
- Valor aportado al usuario (increment).
- Capacidad disponible del equipo.

### Paso 2: Agrupacion de Funcionalidades

Se agrupan funcionalidades que estan relacionadas entre si o que tienen efectos colaterales. Esto busca:

- Minimizar el cambio de contexto del equipo de desarrollo.
- Asegurar que las funcionalidades dependientes se entregan juntas.
- Optimizar el esfuerzo de testing al probar funcionalidades relacionadas en conjunto.

### Paso 3: Busqueda de Valor en Cada Sprint

Cada sprint debe aportar un incremento de valor tangible. No se trata solo de completar tareas, sino de entregar funcionalidad que pueda ser demostrada, validada o incluso utilizada.

### Paso 4: Refinamiento del Backlog

Las sesiones de refinamiento son consideradas clave en el proceso:

- La PO presenta las historias de usuario candidatas para el sprint.
- Los Tech Leads revisan la viabilidad tecnica y hacen preguntas de clarificacion.
- Se discuten los criterios de aceptacion y se afinan si es necesario.
- Se identifican dependencias que podrian bloquear el avance.

### Paso 5: Cotizacion en Conjunto

La cotizacion se realiza de forma colaborativa entre:

- **PO**: Aporta el contexto funcional y la prioridad de negocio.
- **Product Lead**: Aporta perspectiva de producto y requisitos.
- **Tech Leads**: Aportan la estimacion tecnica en horas.

Esta cotizacion conjunta asegura que las estimaciones consideran tanto la complejidad funcional como la tecnica.

### Paso 6: Separacion del QUE y el COMO

Esta separacion de responsabilidades se describe como un hito en la madurez del proceso:

> "Es la primera vez que separamos estos roles."

- **PO define el QUE**: Que funcionalidades construir, que valor aportar, que priorizar.
- **Desarrollo define el COMO**: Como implementar tecnicamente, que arquitectura usar, que sub-tareas crear.

Esta separacion evita que la PO prescriba soluciones tecnicas y permite que el equipo de desarrollo use su expertise para proponer la mejor implementacion.

### Paso 7: Sprint Planning Formal

En la ceremonia de Sprint Planning se:

- Verifica el acuerdo entre todos los participantes sobre el contenido del sprint.
- Identifican dependencias que podrian generar bloqueos.
- Evaluan riesgos conocidos y se definen mitigaciones.
- Confirma la capacidad disponible y se ajusta el scope si es necesario.
- Formaliza el compromiso del equipo con el sprint backlog.

### Paso 8: Ejecucion con Soporte de Governance

Durante la ejecucion del sprint:

- El equipo de Governance facilita el trabajo diario.
- Se eliminan blockers de forma proactiva.
- Se monitorea el progreso contra las estimaciones.
- Se gestionan los impedimentos que surgen durante el sprint.

---

## Niveles de Detalle en la Gestion

```
Product Owner gestiona:
├── Epicas (agrupacion de funcionalidades)
├── Historias de Usuario (unidad de valor)
└── Tareas (trabajo visible para la PO)

Equipo de Desarrollo gestiona:
└── Sub-tareas (papel de trabajo del desarrollador)
    ├── Sub-tarea tecnica 1
    ├── Sub-tarea tecnica 2
    └── Sub-tarea tecnica 3
```

La PO tiene visibilidad hasta el nivel de Tarea, pero no interviene en como el desarrollador descompone su trabajo en sub-tareas. Esta frontera clara evita la micro-gestion y respeta la autonomia tecnica del equipo.

---

## El Problema del Carryover

### Diagnostico

El Gov Lead denomina al carryover como **"el gran cancer"** del proceso. El carryover ocurre cuando historias o tareas comprometidas en un sprint no se completan y se arrastran al siguiente.

### Impacto

- Reduce la capacidad efectiva del siguiente sprint.
- Genera incertidumbre sobre la velocidad real del equipo.
- Acumula deuda tecnica y funcional.
- Pone en riesgo las fechas de entrega comprometidas.

### Contexto Critico

- Existe una **fecha de entrega en abril que es inamovible**.
- El equipo trabaja "de la fecha para atras", ajustando el scope al tiempo disponible.
- Cada sprint con carryover reduce el margen disponible para cumplir la fecha.

### Estrategias de Mitigacion

- Estimacion conservadora para reducir sobre-compromiso.
- Identificacion temprana de bloqueos durante el sprint.
- Governance activa para eliminar impedimentos.
- Ajuste del scope del sprint cuando se detecta riesgo de carryover.

---

## Innovaciones del Proceso Actual

El proceso actual de planificacion de sprint representa varios hitos para {{CLIENT_NAME}}:

### 1. Recursos Dedicados al 100%

Por primera vez, el equipo cuenta con miembros dedicados exclusivamente al proyecto, lo que permite:

- Mayor predictibilidad en la capacidad.
- Menor cambio de contexto.
- Mayor velocidad de desarrollo.

### 2. Roles Bien Definidos

La separacion clara entre PO (QUE) y Desarrollo (COMO) es una innovacion que mejora:

- La calidad de las decisiones de producto.
- La autonomia tecnica del equipo.
- La eficiencia en la planificacion.

### 3. Governance Formal

La existencia de un equipo de Governance (Gov Lead + PO) que facilita y elimina blockers es un avance significativo en la madurez del proceso. Proporciona:

- Estructura para la toma de decisiones.
- Canal claro para la escalacion de problemas.
- Seguimiento activo del progreso y los riesgos.

---

## Flujo Resumido de la Planificacion

```
Backlog (RFs + User Stories)
    |
    v
PO selecciona y prioriza funcionalidades
    |
    v
Agrupacion de funcionalidades relacionadas
    |
    v
Sesiones de Refinamiento (PO presenta, Tech Leads estiman)
    |
    v
Cotizacion conjunta (PO + Product Lead + Tech Leads) en HORAS
    |
    v
Sprint Planning (acuerdo, dependencias, riesgos)
    |
    v
Ejecucion del Sprint (2 semanas)
    |
    v
Governance facilita y elimina blockers
    |
    v
Review + Retrospectiva
    |
    v
Siguiente Sprint (gestion del carryover)
```
