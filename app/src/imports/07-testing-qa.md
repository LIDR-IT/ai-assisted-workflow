# Testing y QA

## Equipo

El equipo de QA esta liderado por el **QA Lead** y se le conoce internamente como el **equipo QA**.

## Metodologia

Se esta adoptando **BDD (Behavior-Driven Development)** como metodologia de testing, con escenarios en formato **Given/When/Then**.

## Herramienta Principal

**TestRail** se utiliza para la gestion de casos de prueba:

- Los casos de prueba se generan a partir de las **User Stories**
- Se vinculan mediante el **numero de US de Jira** como campo en TestRail
- Los RFs del PO incluyen criterios de aceptacion disenados para convertirse en escenarios BDD
- **Objetivo**: que los criterios sean lo suficientemente maduros para generar casos de prueba casi directamente

## Tipos de Testing

| Tipo                     | Descripcion                                                 |
| ------------------------ | ----------------------------------------------------------- |
| **Testing funcional**    | Basado en los criterios de aceptacion de las User Stories   |
| **Escenarios BDD**       | Formato Given/When/Then derivados de los criterios          |
| **Testing de regresion** | Verificacion de que funcionalidades existentes no se rompan |
| **Testing de seguridad** | Coordinado con el equipo de ciberseguridad del Sec Lead     |

## Flujo de Trabajo Actual

1. El **PO** crea User Stories con criterios de aceptacion
2. **QA** genera casos de prueba en TestRail (vinculados al numero de US)
3. QA tiene las pruebas preparadas **ANTES** de que comience el desarrollo (aspiracion, no siempre es la realidad)
4. El desarrollo **completa** la tarea
5. QA recibe la tarea mediante el **cambio de estado** en el flujo de trabajo
6. QA **ejecuta** las pruebas
7. Los **bugs** se reportan con su propio ciclo de vida por entorno
8. La **User Story no se cierra** hasta que QA valida completamente

## Punto de Dolor Principal

> _"Nos encontramos con sorpresas"_

- Los desarrolladores **no ven** los casos de prueba
- El desarrollo **no respeta** lo que QA espera
- Las pruebas y el desarrollo ocurren en paralelo pero **desconectados**

## Mejora Deseada

Compartir los casos de prueba con los desarrolladores **desde el principio** (enfoque shift-left):

> _"Seria buenisimo que esos test cases fueran aprovechados desde el primer momento"_

Esto permitiria que los desarrolladores conozcan exactamente que se va a validar antes de escribir la primera linea de codigo.

## Ciclo de Vida de Bugs

Los bugs tienen su propio **flujo de trabajo** y **ciclo de vida por entorno** gestionado en Jira. Cada bug se rastrea de forma independiente segun el entorno donde fue detectado.
