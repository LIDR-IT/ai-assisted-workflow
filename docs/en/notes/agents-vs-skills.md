# Agentes vs Skills: Diferencias Fundamentales

En el ecosistema actual de inteligencia artificial, la distinción entre Agentes y Skills (Habilidades) es fundamental, ya que definen dos componentes distintos de la "IA Agéntica": **el cerebro (orquestador)** y **la mano (ejecutor)**.

## Definiciones

### Agentes (Agents)

Son los **"cerebros" autónomos** que orquestan tareas, toman decisiones y planifican cómo lograr un objetivo de principio a fin.

### Skills (Habilidades)

Son **herramientas modulares, reutilizables y empaquetadas** que el agente utiliza para ejecutar tareas específicas (ej. analizar un archivo, enviar un correo).

## Tabla Comparativa: Skills vs Agentes

| Característica    | Agentes (Agents)                        | Skills (Habilidades)                      |
| :---------------- | :-------------------------------------- | :---------------------------------------- |
| **Rol**           | "El trabajador/Orquestador"             | "La herramienta/Procedimiento"            |
| **Función**       | Piensa, planifica, toma decisiones      | Ejecuta acciones concretas                |
| **Autonomía**     | Alta; opera autónomamente               | Nula; necesita ser invocada por un agente |
| **Contexto**      | Gestiona el objetivo general            | Proporciona conocimiento específico       |
| **Estructura**    | Perfil, prompt de sistema, herramientas | Carpetas con SKILL.md, scripts, etc.      |
| **Uso principal** | Lograr un objetivo final                | Reutilizar procedimientos de trabajo      |

## Detalles Principales

### 1. ¿Qué es un Agente de IA?

Un agente es un sistema **proactivo, no solo reactivo**. A diferencia de un chatbot simple, un agente puede:

- Tomar decisiones sobre qué herramientas usar
- Planificar pasos intermedios
- Adaptarse para alcanzar un objetivo sin supervisión constante

Se les considera **"empleados" digitales** que pueden conectarse entre sí.

### 2. ¿Qué es una Skill (Habilidad)?

Una "skill" o habilidad de agente es un formato ligero y abierto (a menudo basado en estándares como `SKILL.md`) que le enseña al agente cómo hacer algo específico.

**Contenido:**

- Instrucciones
- Ejemplos
- Recursos
- Plantillas

**Ventaja:** Permite al agente ejecutar tareas repetitivas o complejas sin saturar su memoria de trabajo.

### 3. Diferencias Clave (Ejemplos)

**Agente:**

- Un "Asistente de Ventas" (IA) que busca aumentar ventas en un 20%

**Skills:**

- Una habilidad para "analizar la transcripción de una llamada"
- Una habilidad para "enriquecer datos de una empresa"

El agente utiliza estas skills para lograr su objetivo.

### 4. Relación: ¿Cuándo usar cuál?

La tendencia actual es **"Agentes equipados con habilidades"** (Agents with a license to skill).

**Usa un Agente:**

- Cuando necesites orquestación compleja
- Toma de decisiones en varios pasos
- Gestión de estado (estado del trabajo)

**Usa una Skill:**

- Cuando tengas un procedimiento repetitivo (ej. rellenar un PDF)
- Debe ser portátil y reutilizable entre diferentes agentes

## Resumen

**Agentes** son la Inteligencia Artificial que actúa (el trabajador).

**Skills** son el "arsenal personalizado" o conocimiento procedimental que hace al agente más eficiente.

---

**Analogía:** El agente es el chef que decide qué cocinar y cómo prepararlo. Las skills son las recetas específicas que el chef consulta para ejecutar cada plato perfectamente.
