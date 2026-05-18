# Proceso de PRD (Product Requirements Document)

## Definicion

El PRD (Product Requirements Document) es el documento maestro que contiene todos los requisitos funcionales para un producto o solucion. Es el artefacto central que conecta las necesidades de negocio con la ejecucion tecnica, sirviendo como la fuente de verdad para lo que debe construirse.

---

## Estructura del PRD Funcional

El PRD Funcional sigue una estructura definida que permite organizar la informacion de forma coherente y accionable:

### Secciones Principales

| Seccion                         | Descripcion                                                               | Proposito                                                        |
| ------------------------------- | ------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| **Overview del proyecto**       | Vision general del producto, contexto de negocio, objetivos estrategicos  | Alinear a todos los involucrados sobre el "por que" del proyecto |
| **Alcance**                     | Limites del proyecto, que esta incluido y que queda fuera de esta version | Evitar scope creep y establecer expectativas claras              |
| **Funcionalidades principales** | Lista de las capacidades clave que el producto debe ofrecer               | Dar una vista de alto nivel antes de entrar en detalle           |
| **Requisitos Funcionales (RF)** | Especificaciones detalladas de cada funcionalidad individual              | Proveer el detalle necesario para desarrollo y QA                |
| **Roadmap / Planificacion**     | Cronograma de entregas, fases, hitos                                      | Gestionar tiempos y expectativas de entrega                      |
| **Dependencias entre modulos**  | Relaciones y dependencias entre diferentes RFs y modulos                  | Planificar el orden de desarrollo y mitigar riesgos              |

---

## Ciclo de Vida del PRD

El PRD pasa por un ciclo de vida definido desde la captura inicial de necesidades hasta la ejecucion en sprints:

### Paso 1: Captura de Requisitos de Alto Nivel

El negocio proporciona los requisitos de alto nivel a traves de reuniones, documentacion estrategica y comunicacion directa con el equipo de Producto. En esta fase, los requisitos son generales y orientados a resultados de negocio.

### Paso 2: Asimilacion por el Equipo de Producto

El equipo de Producto (PO, Product Lead) asiste a las reuniones con stakeholders, recopila informacion, hace preguntas de clarificacion y comienza a formar un entendimiento profundo de lo que se necesita. El ejercicio clave es "escuchar, entender lo que realmente se quiere, y aterrizarlo."

### Paso 3: Creacion del PRD en Confluence

El PRD se crea y se mantiene en Confluence como documento vivo. Se estructura segun las secciones definidas anteriormente y se va completando de forma iterativa a medida que se clarifica la vision del producto.

### Paso 4: Generacion de Requisitos Funcionales (RF)

Los RFs se generan dentro del PRD utilizando asistencia de IA (Robo/RoboFlow integrado con Confluence, ChatGPT). El equipo de Producto proporciona contexto detallado (pantallas, acciones esperadas, filtros, comportamiento deseado) y la IA genera un borrador estructurado del RF que luego se revisa manualmente.

### Paso 5: Revision de Coherencia

Cada RF generado se revisa para asegurar:

- Coherencia interna (el RF no se contradice a si mismo).
- Coherencia con otros RFs del mismo modulo.
- Coherencia con el PRD Tecnico de R&D (lo solicitado es tecnicamentente viable).
- Completitud de los criterios de aceptacion.

### Paso 6: Mapeo de Dependencias

Una vez que se tienen todos los RFs de un modulo, se mapean las dependencias entre ellos:

- Que RF depende de otro para funcionar.
- Que modulos tienen dependencias cruzadas.
- Que orden de implementacion es el mas eficiente.

Este mapeo se realiza despues de tener la vision completa de los RFs, no durante la generacion individual.

### Paso 7: Derivacion de User Stories

De cada RF se derivan una o mas User Stories que representan unidades de trabajo implementables. Las User Stories heredan los criterios de aceptacion del RF y se dimensionan para caber dentro de un sprint.

### Paso 8: Sprint Planning

Las User Stories entran al backlog de Jira y se priorizan para su inclusion en los sprints segun la planificacion definida por la Product Owner y el equipo de Governance.

---

## Herramientas Utilizadas

### Confluence

- **Rol**: Plataforma principal de documentacion.
- **Uso**: Creacion, edicion y mantenimiento de PRDs, RFs y playbooks.
- **Ventaja**: Centralizacion de la documentacion, colaboracion en tiempo real, versionado de documentos.

### Robo (RoboFlow)

- **Rol**: Asistente de IA integrado con Confluence.
- **Uso**: Generacion asistida de Requisitos Funcionales a partir de contexto proporcionado por el equipo de Producto.
- **Flujo**: El usuario proporciona contexto (pantalla, acciones, comportamiento) y Robo genera un borrador estructurado del RF.
- **Limitacion identificada**: El mismo prompt puede dar resultados distintos a diferentes personas (problema de consistencia).

### ChatGPT

- **Rol**: Herramienta complementaria de IA.
- **Uso**: Generacion y refinamiento de contenido de requisitos cuando se necesita una perspectiva adicional o complementar lo generado por Robo.

---

## Organizacion: El Playbook

Todos los Requisitos Funcionales del Proyecto 360 estan organizados en un "playbook" dentro de Confluence. El playbook actua como:

- **Indice centralizado**: Permite navegar todos los RFs del proyecto en un solo lugar.
- **Mapa de relaciones**: Muestra las dependencias y conexiones entre RFs.
- **Estado de progreso**: Indica el nivel de completitud de cada RF.
- **Referencia rapida**: Facilita la busqueda y consulta de requisitos especificos.

---

## Relacion Jerarquica: PRD -> RF -> User Story

```
PRD Funcional
├── RF-360-001: Pantalla de Login Biometrico
│   ├── US-001: Como usuario quiero autenticarme con facial
│   ├── US-002: Como usuario quiero ver feedback de la captura
│   └── US-003: Como admin quiero configurar umbral de confianza
├── RF-360-002: Dashboard de Administracion
│   ├── US-004: Como admin quiero ver metricas en tiempo real
│   └── US-005: Como admin quiero exportar reportes
├── RF-360-003: Gestion de Usuarios
│   ├── US-006: Como admin quiero crear usuarios
│   ├── US-007: Como admin quiero asignar roles
│   └── US-008: Como admin quiero desactivar usuarios
└── ... (multiples RFs componen el PRD)
```

### Reglas de la Relacion

- Un **RF es PARTE DE** un PRD. No existe un RF sin un PRD padre.
- **Multiples RFs** componen un PRD completo.
- Cada **RF puede generar multiples User Stories**, dependiendo de la complejidad del requisito.
- Las **User Stories** son la unidad minima que entra en un sprint.
- Las **dependencias** entre RFs se documentan despues de tener todos los RFs del modulo.

---

## Consideraciones Importantes

1. **El PRD es un documento vivo**: Se actualiza conforme avanza el proyecto y se descubren nuevos requisitos o cambios.
2. **La generacion con IA requiere supervision**: Aunque la IA acelera la creacion de RFs, la revision humana es imprescindible para garantizar calidad y coherencia.
3. **Documentacion retroactiva**: Algunas funcionalidades se desarrollaron antes de tener documentacion formal, lo que requiere un esfuerzo adicional para documentar retroactivamente.
4. **Estandarizacion de prompts**: Se ha identificado la necesidad de estandarizar los prompts de IA para garantizar resultados consistentes independientemente de quien los ejecute.
