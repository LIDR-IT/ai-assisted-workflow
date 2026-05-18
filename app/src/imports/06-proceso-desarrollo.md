# Proceso de Desarrollo

## Estrategia de Branching

El equipo de desarrollo trabaja con un flujo basado en **Git/GitHub**. Se utilizan **feature branches** (ramas por funcionalidad) y un flujo de trabajo basado en **Pull Requests (PRs)**.

## Flujo de Pull Requests

1. El desarrollador crea un **Pull Request**
2. Se ejecuta un escaneo automatizado de **SAST/SCA** (seguridad)
3. Se realiza la **revisión de código** (code review) por parte de otro miembro del equipo
4. Se aprueba y se hace **merge** a la rama principal

## Asignacion de Tareas

- El **Tech Lead** asigna las tareas a partir de las **User Stories**
- El equipo de desarrollo genera sus propias sub-tareas: _"les damos potestad para que generen sus tareas"_ y definan la profundidad tecnica necesaria
- Los desarrolladores tienen **autonomia** para descomponer el trabajo tecnico como consideren apropiado

## Revision de Codigo

La revision de codigo es parte integral del proceso de PR. Todo cambio debe pasar por revision antes de ser integrado.

## Comunicacion con el Product Owner

- Las **User Stories** funcionan como el **contrato** entre el PO y el equipo de desarrollo
- El PO define los **criterios de aceptacion**
- El equipo de desarrollo implementa en base a esos criterios

## Uso de IA por parte del equipo de desarrollo

El estado actual del uso de herramientas de IA por parte del equipo de desarrollo es **desconocido/no claro**:

- **QA (equipo QA)**: Si utiliza IA
- **Producto**: Si utiliza IA
- **Desarrollo**: No se tiene certeza de si usan herramientas de IA

## Flujo de Trabajo en Jira

Las tareas se mueven a traves de los siguientes estados:

```
To Do -> In Progress -> Ready for QA -> Done
```

### Mejora en curso

Se esta agregando el estado **"Ready for QA"** al flujo de trabajo de las tareas, para que el equipo de QA sepa exactamente cuando puede comenzar a validar.

## Definition of Done

Se esta implementando por **primera vez** una Definition of Done formal:

- La User Story **no se cierra** hasta que QA la valide completamente
- Esto asegura que ninguna funcionalidad se da por terminada sin la verificacion del equipo de calidad
