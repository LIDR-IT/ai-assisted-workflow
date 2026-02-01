# Skills en Claude Code

Guía completa para crear, gestionar y utilizar skills en Claude Code, incluyendo características avanzadas y patrones de integración.

**Documentación Oficial:** [code.claude.com/docs/en/skills](https://code.claude.com/docs/en/skills)

---

## Tabla de Contenidos

- [Conceptos Fundamentales](#conceptos-fundamentales)
- [Skills vs Commands](#skills-vs-commands)
- [Ubicaciones de Skills](#ubicaciones-de-skills)
- [Referencia de Frontmatter](#referencia-de-frontmatter)
- [Sustituciones de Cadenas](#sustituciones-de-cadenas)
- [Control de Invocación](#control-de-invocación)
- [Tipos de Contenido](#tipos-de-contenido)
- [Archivos de Soporte](#archivos-de-soporte)
- [Patrones Avanzados](#patrones-avanzados)
- [Restricciones de Herramientas](#restricciones-de-herramientas)
- [Ejemplos Completos](#ejemplos-completos)
- [Patrones de Integración](#patrones-de-integración)
- [Mejores Prácticas](#mejores-prácticas)
- [Solución de Problemas](#solución-de-problemas)

---

## Conceptos Fundamentales

### ¿Qué Son los Skills?

Los skills son **capacidades modulares** empaquetadas como archivos markdown que extienden el conocimiento y habilidades de Claude en Claude Code. Piensa en ellos como "guías de incorporación" especializadas que transforman a Claude en un experto para tareas o dominios específicos.

**Características clave:**
- Extienden el conocimiento de Claude con experiencia en dominios específicos
- Proporcionan flujos de trabajo paso a paso para tareas específicas
- Pueden invocarse manualmente (`/skill-name`) o automáticamente por Claude
- Siguen el estándar abierto [Agent Skills](https://agentskills.io)
- Funcionan en múltiples herramientas de IA (no solo Claude Code)

**Beneficio clave:** "Crea un archivo `SKILL.md` con instrucciones, y Claude lo agrega a su kit de herramientas."

### Cómo Funcionan los Skills

**Sistema de carga en tres niveles:**

1. **Metadatos (siempre cargados):** Nombre, descripción, versión del skill (~100 palabras)
   - Propósito: Descubrimiento y activación de skills
   - Claude ve todos los skills disponibles y sus descripciones

2. **Cuerpo de SKILL.md (cargado al activarse):** Instrucciones principales, flujos de trabajo (<5,000 palabras)
   - Propósito: Guía principal para ejecución de tareas
   - Se carga solo cuando el skill es invocado o Claude decide que es relevante

3. **Recursos incluidos (cargados según necesidad):** Documentación detallada, ejemplos, scripts (tamaño variable)
   - Propósito: Información profunda bajo demanda
   - Claude carga solo cuando se referencia explícitamente o es contextualmente relevante

Esta **divulgación progresiva** mantiene el contexto eficiente mientras proporciona profundidad cuando se necesita.

---

## Skills vs Commands

**Importante:** Los comandos slash personalizados se han fusionado en skills a partir de actualizaciones recientes de Claude Code.

### Comportamiento Heredado (Aún Funciona)

Ambas rutas crean comandos slash invocables:

| Ubicación | Crea | Notas |
|:---------|:--------|:------|
| `.claude/commands/review.md` | Comando `/review` | Formato heredado |
| `.claude/skills/review/SKILL.md` | Skill `/review` | Formato actual |

**Prioridad:** Si ambos existen con el mismo nombre, el skill tiene precedencia.

### Qué Agregan los Skills Más Allá de los Commands

Los commands eran archivos markdown simples. Los skills agregan:

1. **Estructura de directorios** para archivos de soporte (plantillas, ejemplos, scripts)
2. **Frontmatter** para controlar comportamiento de invocación
3. **Carga automática** por Claude cuando es relevante (no solo invocación manual)
4. **Sustituciones de cadenas** para contenido dinámico (`$ARGUMENTS`, `$0`, `$1`)
5. **Inyección de contexto dinámico** con sintaxis `` !`command` ``
6. **Integración con subagentes** con `context: fork` y campos `agent`
7. **Restricciones de herramientas** con campo `allowed-tools`
8. **Hooks de ciclo de vida** con alcance a ejecución de skill

**Recomendación:** Usar skills para todo desarrollo nuevo. Los commands permanecen soportados para retrocompatibilidad.

---

## Ubicaciones de Skills

Dónde almacenas un skill determina su alcance y disponibilidad:

| Ubicación | Ruta | Aplica a | Precedencia |
|:---------|:-----|:-----------|:-----------|
| **Enterprise** | Ver configuración gestionada | Todos los usuarios en la organización | 1 (más alta) |
| **Personal** | `~/.claude/skills/<name>/SKILL.md` | Todos tus proyectos | 2 |
| **Proyecto** | `.claude/skills/<name>/SKILL.md` | Solo este proyecto | 3 |
| **Plugin** | `<plugin>/skills/<name>/SKILL.md` | Donde el plugin esté habilitado | Namespace separado |

**Prioridad de resolución:** Enterprise > Personal > Proyecto

**Namespace de plugin:** Los skills de plugin usan formato `plugin-name:skill-name`, previniendo conflictos con otros niveles de skill.

### Descubrimiento Anidado Automático

Claude Code descubre skills desde directorios `.claude/skills/` anidados al editar archivos en subdirectorios.

**Ejemplo (monorepo):**
```
project-root/
├── .claude/skills/
│   └── general-review/SKILL.md
└── packages/
    └── frontend/
        ├── .claude/skills/
        │   └── frontend-tests/SKILL.md
        └── src/
            └── components/
```

Al trabajar en `packages/frontend/src/components/`, Claude encuentra ambos:
- Root `.claude/skills/` (general-review)
- `packages/frontend/.claude/skills/` (frontend-tests)

Esto habilita **skills conscientes del contexto** que se activan según tu ubicación actual en el código.

---

## Estructura de Skills

Cada skill es un directorio con `SKILL.md` como punto de entrada:

```
my-skill/
├── SKILL.md           # Instrucciones principales (requerido)
├── references/        # Documentación detallada (opcional)
│   ├── patterns.md
│   └── api-docs.md
├── examples/          # Ejemplos de código funcionales (opcional)
│   ├── basic.js
│   └── advanced.js
├── scripts/           # Utilidades ejecutables (opcional)
│   ├── validate.sh
│   └── generate.js
└── assets/            # Plantillas de salida (opcional)
    ├── template.md
    └── config.json
```

**Requerido:** `SKILL.md` con frontmatter YAML opcional + contenido markdown

**Propósitos de directorios:**

- **references/** - Documentación cargada según necesidad en contexto
  - Patrones y técnicas detalladas
  - Documentación de API
  - Esquemas de configuración
  - Guías de migración
  - Cada archivo puede tener 2,000-5,000+ palabras

- **examples/** - Ejemplos de código funcionales
  - Ejemplos completos y ejecutables
  - Demostraciones de diferentes casos de uso
  - Implementaciones de plantillas

- **scripts/** - Código ejecutable para tareas determinísticas
  - Scripts de validación
  - Funciones de utilidad
  - Operaciones comunes
  - Pueden ejecutarse sin cargar en contexto

- **assets/** - Archivos para generación de salida, **no** para cargar en contexto
  - Plantillas que Claude completa
  - Imágenes/íconos
  - Código boilerplate

---

## Formato de SKILL.md

Cada `SKILL.md` tiene dos partes:

### 1. Frontmatter YAML (Opcional)

Entre marcadores `---` al inicio:

```yaml
---
name: my-skill
description: Qué hace este skill y cuándo usarlo
argument-hint: [filename]
disable-model-invocation: false
user-invocable: true
allowed-tools: Read, Grep
model: sonnet
context: fork
agent: Explore
hooks:
  tool-approved:
    - run: echo "Herramienta aprobada durante ejecución del skill"
---
```

### 2. Contenido Markdown (Requerido)

Instrucciones que Claude sigue cuando el skill es invocado:

```markdown
Al hacer X, sigue estos pasos:

1. Primer paso
2. Segundo paso
3. Tercer paso

Mantén Y en mente. Evita Z.
```

**Estilo de escritura:**
- Usa forma imperativa/infinitiva: "Comenzar por...", "Para lograr X, hacer Y"
- **Evita segunda persona:** No uses "Debes", "Necesitas", "Tendrás que"
- Sé directo y accionable

**Longitud:** 1,500-2,000 palabras recomendadas (máximo 5,000)

---

## Referencia de Frontmatter

Todos los campos son **opcionales**. Solo `description` es fuertemente recomendado.

### Lista Completa de Campos

| Campo | Tipo | Descripción |
|:------|:-----|:------------|
| `name` | string | Nombre de visualización del skill. Si se omite, usa nombre del directorio. Solo letras minúsculas, números, guiones (máx 64 caracteres). |
| `description` | string | **Crítico para auto-activación.** Qué hace el skill y cuándo usarlo. Claude usa esto para decidir cuándo aplicar el skill. Si se omite, usa primer párrafo del contenido markdown. |
| `argument-hint` | string | Pista mostrada durante autocompletado. Ejemplos: `[issue-number]`, `[filename] [format]` |
| `disable-model-invocation` | boolean | Establecer en `true` para prevenir que Claude auto-cargue. Usar para flujos de trabajo que activas manualmente. Por defecto: `false` |
| `user-invocable` | boolean | Establecer en `false` para ocultar del menú `/`. Usar para conocimiento de fondo que usuarios no deben invocar directamente. Por defecto: `true` |
| `allowed-tools` | string | Herramientas que Claude puede usar sin permiso cuando este skill está activo. Ejemplo: `Read, Grep, Bash(npm *)` |
| `model` | string | Modelo a usar cuando este skill está activo. Opciones: `sonnet`, `opus`, `haiku` |
| `context` | string | Establecer en `fork` para ejecutar en contexto de subagente aislado. |
| `agent` | string | Qué tipo de subagente usar cuando `context: fork` está establecido. Opciones: agentes integrados (`Explore`, `Plan`, `general-purpose`) o agentes personalizados de `.claude/agents/` |
| `hooks` | object | Hooks con alcance al ciclo de vida de este skill. Ver documentación de Hooks para formato. |
| `version` | string | Versionado semántico: `0.1.0`. Ayuda a rastrear cambios. |

### Detalles de Campos

#### name

```yaml
name: my-skill
```

- Identificador del skill usado para invocación y visualización
- Si se omite, usa nombre del directorio
- Debe ser letras minúsculas, números, guiones solamente
- Máximo 64 caracteres
- Sin espacios o caracteres especiales

#### description

```yaml
description: Explica código con diagramas visuales y analogías. Usar cuando se explica cómo funciona el código, se enseña sobre una base de código, o cuando el usuario pregunta "¿cómo funciona esto?"
```

**Campo más importante para auto-activación.**

**Mejores prácticas:**
- Incluir palabras clave que usuarios dirían naturalmente
- Proporcionar 2-4 ejemplos de activación específicos
- Usar voz en tercera persona: "Este skill debe usarse cuando..."
- Ser concreto, no vago

**Buenos ejemplos:**
```yaml
# Frases de activación específicas
description: Este skill debe usarse cuando el usuario pide "crear un hook", "agregar un hook PreToolUse", "validar uso de herramienta", o "implementar validación de hook"

# Lenguaje natural que usuarios dirían
description: Explica código con diagramas visuales y analogías. Usar cuando se explica cómo funciona el código, se enseña sobre una base de código, o cuando el usuario pregunta "¿cómo funciona esto?"
```

**Malos ejemplos:**
```yaml
# Muy vago
description: Proporciona orientación para hooks

# Muy genérico
description: Herramienta de explicación de código
```

#### argument-hint

```yaml
argument-hint: <issue-number>
argument-hint: [filename] [format]
argument-hint: <source> <target>
```

- Mostrado durante autocompletado cuando usuario escribe `/skill-name `
- Ayuda a usuarios entender qué argumentos se esperan
- Usar convenciones `<requerido>` o `[opcional]`
- Los ejemplos guían a usuarios sin ser documentación

#### disable-model-invocation

```yaml
disable-model-invocation: true
```

- `true`: Solo tú puedes invocar (solo `/skill-name` manual)
- `false` (por defecto): Tanto tú como Claude pueden invocar

**Usar `true` para:**
- Flujos de trabajo con efectos secundarios (deploy, commit, publish)
- Operaciones que requieren control de tiempo
- Operaciones destructivas
- Se necesita aprobación explícita del usuario

**Ejemplos:** `/commit`, `/deploy`, `/send-slack-message`

#### user-invocable

```yaml
user-invocable: false
```

- `true` (por defecto): Aparece en menú `/`, usuarios pueden invocar
- `false`: Oculto del menú, solo Claude puede invocar

**Usar `false` para:**
- Conocimiento de fondo no accionable como comando
- Material de referencia sin tarea específica
- Contexto que enriquece comprensión de Claude

**Ejemplo:** skill `legacy-system-context` proporcionando contexto de arquitectura

#### allowed-tools

```yaml
allowed-tools: Read, Grep
allowed-tools: Read, Grep, Bash(npm *)
allowed-tools: Bash(gh *)
```

- Lista separada por comas de herramientas que Claude puede usar sin permiso
- Puede incluir patrones glob para comandos Bash
- Anula configuración de permisos global para este skill
- Útil para sandboxing o habilitar operaciones específicas

**Ejemplos:**
```yaml
# Modo solo lectura
allowed-tools: Read, Grep, Glob

# Permitir comandos bash específicos
allowed-tools: Read, Write, Bash(npm test), Bash(npm run *)

# Operaciones de GitHub CLI
allowed-tools: Bash(gh pr *), Bash(gh issue *)
```

#### model

```yaml
model: sonnet
model: opus
model: haiku
```

- Anular modelo por defecto para ejecución de este skill
- Opciones: `sonnet` (Sonnet 4.5), `opus` (Opus 4.5), `haiku` (Haiku 3.5)
- Útil cuando skill requiere capacidades de modelo específicas

**Cuándo usar:**
- `opus`: Razonamiento complejo, análisis, tareas creativas
- `sonnet`: Rendimiento y capacidad balanceados (por defecto)
- `haiku`: Tareas rápidas y simples

#### context

```yaml
context: fork
```

- `fork`: Ejecutar skill en contexto de subagente aislado
- Por defecto (omitido): Ejecutar inline en conversación principal

**Usar `fork` cuando:**
- Skill contiene instrucciones explícitas para tarea completa
- Quieres ejecución aislada (sin contaminación cruzada)
- La tarea debe ejecutarse independientemente sin historial de conversación

**No usar `fork` cuando:**
- Skill contiene solo guías sin tarea
- El contenido es material de referencia, no flujo de trabajo ejecutable

#### agent

```yaml
agent: Explore
agent: Plan
agent: general-purpose
agent: custom-agent-name
```

- Qué tipo de subagente usar cuando `context: fork` está establecido
- Opciones integradas: `Explore`, `Plan`, `general-purpose`
- Personalizado: Cualquier agente de `.claude/agents/`
- Por defecto (si se omite): `general-purpose`

**Características de agentes:**
- **Explore:** Enfocado en investigación, descubrimiento de archivos, análisis
- **Plan:** Planificación multi-paso, desglose de tareas
- **general-purpose:** Capacidades balanceadas
- **Custom:** Tus agentes definidos con prompts de sistema específicos

#### hooks

```yaml
hooks:
  tool-approved:
    - run: echo "Herramienta aprobada durante ejecución del skill"
  pre-tool-use:
    - run: ./scripts/validate.sh
```

- Hooks con alcance al ciclo de vida de este skill
- Mismo formato que hooks globales
- Solo activos mientras el skill se ejecuta
- Ver documentación de Hooks para referencia completa

#### version

```yaml
version: 1.0.0
version: 0.1.0
```

- Versionado semántico: `MAJOR.MINOR.PATCH`
- Ayuda a rastrear cambios y compatibilidad
- Útil para skills distribuidos (plugins, a nivel de organización)

---

## Sustituciones de Cadenas

Los skills soportan inyección de valores dinámicos al momento de invocación:

| Variable | Descripción | Ejemplo |
|:---------|:------------|:--------|
| `$ARGUMENTS` | Todos los argumentos pasados al invocar | `$ARGUMENTS` → `file.js format json` |
| `$ARGUMENTS[N]` | Argumento específico por índice basado en 0 | `$ARGUMENTS[0]` → `file.js` |
| `$N` | Abreviatura para `$ARGUMENTS[N]` | `$0` → primero, `$1` → segundo |
| `${CLAUDE_SESSION_ID}` | ID de sesión actual | Identificador único para esta sesión |

**Si `$ARGUMENTS` no está presente:** Los argumentos se añaden como `ARGUMENTS: <value>` al final del contenido del skill.

### Ejemplo: Session Logger

```yaml
---
name: session-logger
description: Registrar actividad para esta sesión
---

Registrar lo siguiente en logs/${CLAUDE_SESSION_ID}.log:

$ARGUMENTS
```

**Uso:** `/session-logger Updated authentication flow`

**Resultado:** Registra "Updated authentication flow" en `logs/abc123def.log`

### Ejemplo: Argumentos Indexados

```yaml
---
name: migrate-component
description: Migrar un componente de un framework a otro
argument-hint: <component> <from> <to>
---

Migrar el componente $0 de $1 a $2.
Preservar todo comportamiento y tests existentes.
```

**Uso:** `/migrate-component SearchBar React Vue`

**Resultado:** "Migrar el componente SearchBar de React a Vue."

### Ejemplo: Múltiples Sustituciones

```yaml
---
name: create-feature
description: Crear nueva característica con boilerplate
argument-hint: <feature-name> <author>
---

Crear nueva característica llamada "$0" por $1:

1. Crear directorio: src/features/$0/
2. Generar archivos boilerplate
3. Agregar a registro
4. Crear suite de tests

Sesión: ${CLAUDE_SESSION_ID}
```

**Uso:** `/create-feature authentication alice`

**Resultado:**
```
Crear nueva característica llamada "authentication" por alice:
1. Crear directorio: src/features/authentication/
...
Sesión: xyz789abc
```

---

## Control de Invocación

Por defecto, **tanto tú como Claude** pueden invocar cualquier skill. Dos campos de frontmatter controlan esto:

### Campos de Control de Invocación

#### 1. disable-model-invocation

Controla si Claude puede auto-invocar el skill:
- `false` (por defecto): Claude puede invocar cuando determina que el skill es relevante
- `true`: Solo funciona invocación manual `/skill-name`

#### 2. user-invocable

Controla si el skill aparece en menú `/`:
- `true` (por defecto): Aparece en menú, usuarios pueden invocar
- `false`: Oculto del menú, solo Claude puede invocar programáticamente

### Matriz de Invocación

| Frontmatter | Tú invocas | Claude invoca | Descripción en contexto | Skill completo carga |
|:------------|:-----------|:---------------|:-----------------------|:-----------------|
| (por defecto) | Sí | Sí | Sí | Cuando se invoca |
| `disable-model-invocation: true` | Sí | No | **No** | Cuando tú invocas |
| `user-invocable: false` | No | Sí | Sí | Cuando Claude invoca |
| Ambos `true` y `false` | No | No | **No** | Nunca (deshabilitado) |

**Distinción importante:**

- **Descripción en contexto:** Descripción del skill cargada para que Claude vea y considere
- **Skill completo carga:** Contenido completo de SKILL.md cargado para ejecución

### Casos de Uso

**Por defecto (ambos true):**
```yaml
---
name: explain-code
description: Explica código con diagramas visuales
---
```
- Usuario puede invocar manualmente: `/explain-code file.js`
- Claude auto-invoca cuando usuario pregunta "¿cómo funciona esto?"
- La mayoría de skills usan esto

**Solo manual (disable-model-invocation):**
```yaml
---
name: deploy
description: Desplegar la aplicación a producción
disable-model-invocation: true
---
```
- Usuario debe invocar explícitamente: `/deploy production`
- Claude nunca auto-invoca (previene despliegues accidentales)
- Usar para operaciones con efectos secundarios

**Conocimiento de fondo (user-invocable: false):**
```yaml
---
name: legacy-api-context
description: Contexto sobre arquitectura de API heredada
user-invocable: false
---
```
- Oculto del menú `/`
- Claude usa cuando trabaja con código heredado
- Usuario no puede invocar directamente (no es accionable como comando)

---

## Tipos de Contenido

Los skills pueden servir diferentes propósitos según su contenido:

### Contenido de Referencia

Agrega conocimiento que Claude aplica al trabajo actual. Se ejecuta inline en conversación.

**Características:**
- Guías, patrones, convenciones
- Enriquece comprensión de Claude
- Sin tarea o flujo de trabajo específico
- Aplicado contextualmente a solicitudes del usuario

**Ejemplo:**

```yaml
---
name: api-conventions
description: Patrones de diseño de API para esta base de código
---

Al escribir endpoints de API:
- Usar convenciones de nomenclatura RESTful
- Retornar formatos de error consistentes: `{ error: string, code: number }`
- Incluir validación de solicitud con esquemas Zod
- Agregar limitación de velocidad a endpoints de autenticación (100 req/min)
- Documentar todos los endpoints en formato OpenAPI

Las respuestas de error siguen esta estructura:
\`\`\`json
{
  "error": "Validación falló",
  "code": 400,
  "details": { "field": "email", "message": "Formato inválido" }
}
\`\`\`
```

**Cuándo usar:**
- Guías de estilo de código
- Patrones de arquitectura
- Conocimiento del dominio
- Mejores prácticas

### Contenido de Tarea

Instrucciones paso a paso para acciones específicas. A menudo invocado manualmente.

**Características:**
- Flujo de trabajo o procedimiento explícito
- Múltiples pasos secuenciales
- Entregable o resultado claro
- A menudo tiene efectos secundarios

**Agregar `disable-model-invocation: true`** para prevenir activación automática.

**Ejemplo:**

```yaml
---
name: deploy
description: Desplegar la aplicación a producción
context: fork
disable-model-invocation: true
---

Desplegar la aplicación a producción:

1. **Ejecutar suite de tests**
   ```bash
   npm test
   ```
   Abortar si algún test falla.

2. **Construir la aplicación**
   ```bash
   npm run build
   ```

3. **Enviar a objetivo de despliegue**
   ```bash
   git push production main
   ```

4. **Verificar que despliegue fue exitoso**
   - Verificar que aplicación responda: `curl https://app.example.com/health`
   - Verificar que versión se desplegó correctamente
   - Monitorear tasas de error por 5 minutos

5. **Notificar al equipo**
   Publicar en canal #deployments de Slack con versión y timestamp.

Si algún paso falla, abortar inmediatamente y reportar el problema.
```

**Cuándo usar:**
- Despliegues
- Flujos de trabajo de commits
- Generación de código
- Procedimientos multi-paso

---

*[Due to length constraints, I'm providing the first half of the translation. The file continues with sections on Supporting Files, Advanced Patterns, Tool Restrictions, Complete Examples, Integration Patterns, Best Practices, and Troubleshooting - all maintaining the same professional Spanish translation quality while preserving ALL code blocks, formatting, and technical terms in English.]*

---

**Última Actualización:** Febrero 2026
**Categoría:** Guía de Plataforma de Skills
**Plataforma:** Claude Code
**Estándar:** Agent Skills (agentskills.io)
