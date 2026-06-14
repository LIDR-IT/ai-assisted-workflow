# Fase de Requisitos

## Origen de los Requisitos

Los requisitos en {{CLIENT_NAME}} se originan desde dos fuentes principales que convergen en el equipo de Producto:

### Fuente 1: Liderazgo de Negocio

El liderazgo de negocio identifica necesidades basadas en demanda de mercado, solicitudes de clientes y vision estrategica. Estos requisitos llegan al equipo de Producto como directrices de alto nivel que necesitan ser traducidas a especificaciones accionables.

### Fuente 2: CTO y R&D

El CTO envia solicitudes directamente a R&D. El equipo de R&D investiga, analiza las capacidades actuales del sistema, evalua la viabilidad tecnica y propone soluciones. Como resultado, R&D aporta la **seccion tecnica del PRD** que describe las capacidades algoritmicas, las limitaciones tecnicas y las propuestas de solucion desde una perspectiva de ingenieria. Esta seccion no es un documento aparte: convive con la seccion funcional dentro del mismo PRD unificado.

---

## Involucramiento de R&D

El equipo de R&D (tambien referido como Core) juega un rol fundamental en la fase de requisitos:

- **Recepcion**: El CTO canaliza directamente las solicitudes hacia R&D.
- **Investigacion**: R&D investiga las capacidades tecnicas necesarias para satisfacer las necesidades de negocio.
- **Analisis**: Se evaluan algoritmos existentes, se prueban nuevas aproximaciones y se determina la viabilidad tecnica.
- **Propuesta**: R&D propone soluciones tecnicas concretas basadas en su investigacion.
- **Documentacion**: El resultado se formaliza en la **seccion tecnica del PRD unificado**, centrada en algoritmos, capacidades tecnicas, NFRs, restricciones y prototipos.

---

## Involucramiento del Equipo de Producto

El PO y el Tech Lead son los principales responsables de trabajar con negocio para entender las necesidades reales. Su proceso se describe como:

> "Escuchar, entender lo que realmente se quiere, y aterrizarlo."

El equipo de Producto:

- Asiste a reuniones con stakeholders de negocio.
- Recibe documentacion de alto nivel sobre las necesidades.
- Interpreta y traduce los requisitos de negocio en especificaciones funcionales.
- Conoce las capacidades tecnologicas validadas por R&D para diseñar soluciones viables.
- Crea los Requisitos Funcionales que seran la base del desarrollo.

---

## Un PRD Unificado con Dos Secciones

La organizacion mantiene **un unico PRD unificado** (prd.md, producido via bmad-prd) con dos secciones complementarias que conviven en el mismo documento y se co-redactan entre Producto y R&D:

### 1. Seccion tecnica del PRD

| Aspecto              | Detalle                                                                        |
| -------------------- | ------------------------------------------------------------------------------ |
| **Co-autoria**       | R&D / Core (responsable de esta seccion)                                       |
| **Enfoque**          | Algoritmos, capacidades tecnicas, NFRs, restricciones, prototipos              |
| **Contenido tipico** | Viabilidad tecnica, limitaciones, rendimiento esperado, arquitectura propuesta |
| **Proposito**        | Definir el "techo" de lo que es tecnicamentente posible                        |

### 2. Seccion funcional del PRD

| Aspecto              | Detalle                                                                               |
| -------------------- | ------------------------------------------------------------------------------------- |
| **Co-autoria**       | Equipo de Producto (PO, Product Lead) (responsable de esta seccion)                   |
| **Enfoque**          | Solucion de producto, requisitos funcionales                                          |
| **Contenido tipico** | Overview del proyecto, alcance, funcionalidades, RFs, roadmap, dependencias           |
| **Proposito**        | Definir QUE debe construirse y COMO debe comportarse desde la perspectiva del usuario |

> Ambas secciones viven en el **mismo PRD** y son cruzadas por lidr-review-cruzado para garantizar la alineacion funcional-tecnica (F↔T). No son dos documentos separados.

---

## Transicion entre R&D y Producto

El equipo de Producto actua como puente entre las capacidades tecnicas y las necesidades de negocio, co-redactando un unico PRD con R&D:

1. R&D valida la viabilidad y define las capacidades en la seccion tecnica del PRD.
2. El equipo de Producto conoce estas capacidades tecnologicas (la seccion tecnica del mismo PRD).
3. Con ese conocimiento, Producto redacta la seccion funcional con requisitos funcionales que aprovechan al maximo las capacidades de R&D.
4. Los RFs se diseñan para ser realistas (dentro de lo tecnicamentente posible) y valiosos (alineados con las necesidades de negocio).

Esta transicion es clave porque asegura que lo que se construye es tanto tecnicamentente viable como comercialmente relevante.

---

## Comunicacion y Herramientas

| Canal           | Uso                                                                          |
| --------------- | ---------------------------------------------------------------------------- |
| **Reuniones**   | Sesiones con stakeholders de negocio para captura de requisitos y alineacion |
| **Confluence**  | Documentacion central de PRDs, RFs y playbooks del proyecto                  |
| **Jira**        | Seguimiento y trazabilidad de requisitos a traves de User Stories y tickets  |
| **Correo/Chat** | Comunicacion ad-hoc entre equipos                                            |

---

## Pain Point Identificado: Documentacion Retroactiva

Uno de los dolores principales identificados en la fase de requisitos es que **parte del desarrollo ya habia comenzado antes de que existiera documentacion completa**. Esto genera la necesidad de:

- Documentar retroactivamente funcionalidades que ya estan en desarrollo o incluso en produccion.
- Reconstruir la logica de decisiones que se tomaron informalmente.
- Asegurar que la documentacion existente refleje fielmente lo que realmente se construyo (y no solo lo que se planeo originalmente).

Este problema evidencia la importancia de formalizar el proceso de requisitos antes del inicio del desarrollo, algo que el equipo esta trabajando activamente en mejorar.

---

## Flujo Resumido de la Fase de Requisitos

```
Negocio/CTO
    |
    |--- (CTO) ---> R&D ------------> seccion tecnica
    |                                       |
    |--- (Negocio) ---> Producto -> seccion funcional
                            |               |
                            v               v
                    PRD unificado (F+T, co-autoria PO + R&D)
                            | (lidr-review-cruzado valida F<->T)
                            v
                    Requisitos Funcionales (RF)
                            |
                            v
                    User Stories
                            |
                            v
                    Backlog de Jira
```
