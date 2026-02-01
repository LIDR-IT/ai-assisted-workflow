# Integración de Subagents

## Descripción General

Los skills y subagents son dos características poderosas en Claude Code que pueden combinarse de diferentes maneras para crear flujos de trabajo sofisticados. Comprender cómo interactúan permite construir entornos de ejecución complejos y aislados mientras se mantiene una separación clara de responsabilidades.

Esta guía cubre los dos patrones principales de integración: **skills que se ejecutan en subagents** (usando `context: fork`) y **subagents que precargan skills** (usando el campo `skills` en definiciones de agents).

## ¿Qué es la Integración de Subagents?

La integración de subagents se refiere a cómo los skills y subagents trabajan juntos:

1. **Enfoque Skill-First**: Un skill usa `context: fork` para ejecutarse en un subagent aislado
2. **Enfoque Agent-First**: Una definición de subagent precarga skills como material de referencia

Ambos enfoques crean contextos de ejecución aislados, pero difieren en cómo se define la tarea y qué rol juegan los skills.

## Cuándo Usar Cada Enfoque

### Usar Skill con `context: fork` Cuando:

- Tienes una **tarea completa y explícita** definida en el skill
- El skill contiene instrucciones paso a paso
- Quieres activar la tarea desde la conversación principal
- La tarea debe ejecutarse independientemente sin historial de conversación
- Necesitas especificar qué tipo de agent maneja la tarea

**Ejemplos:**
- Investigación profunda sobre una característica del codebase
- Generar una suite de pruebas integral
- Analizar vulnerabilidades de seguridad
- Crear documentación a partir del código

### Usar Subagent con Skills Precargados Cuando:

- Estás definiendo un **tipo de agent personalizado** con capacidades específicas
- Los skills proporcionan **material de referencia y guías** (no la tarea en sí)
- Claude delega trabajo al subagent (la tarea viene de Claude)
- El subagent necesita conocimiento de dominio o convenciones
- Quieres configuraciones de agents reutilizables

**Ejemplos:**
- Agent de revisión de código con guías de estilo
- Agent de despliegue con conocimiento de infraestructura
- Agent de generación de pruebas con convenciones de testing
- Agent de refactorización con patrones de arquitectura

## Cómo Funciona la Integración Skill-First

### El Patrón `context: fork`

Cuando un skill incluye `context: fork`, se ejecuta en un entorno completamente aislado:

```yaml
---
name: deep-research
description: Research a topic thoroughly
context: fork
agent: Explore
---

Research $ARGUMENTS thoroughly:

1. Find relevant files using Glob and Grep
2. Read and analyze the code
3. Identify patterns and conventions
4. Summarize findings with specific file references

Focus on understanding the overall architecture and key design decisions.
```

### Flujo de Ejecución

1. **Invocación**: Usuario o Claude invoca `/deep-research authentication`
2. **Creación de Fork**: Se crea un nuevo contexto aislado (sin historial de conversación)
3. **Carga de Contenido**: El contenido del skill se convierte en el prompt de tarea del subagent
4. **Selección de Agent**: `agent: Explore` determina qué agent maneja la tarea
5. **Ejecución**: El subagent ejecuta con herramientas y permisos apropiados
6. **Retorno**: Los resultados se resumen y regresan a la conversación principal

### Qué se Carga

Cuando un skill se ejecuta con `context: fork`:

| Contenido | ¿Se carga? | Propósito |
|-----------|------------|-----------|
| Contenido del skill | ✅ Sí | Se convierte en el prompt de tarea |
| CLAUDE.md | ✅ Sí | Memoria del proyecto/personal |
| Historial de conversación | ❌ No | Ejecución aislada |
| Otros skills | ❌ No | Solo el skill invocado |
| System prompt del agent | ✅ Sí | Del campo `agent` |

### Tipos de Agents

El campo `agent` determina el entorno de ejecución:

**Agents incorporados:**
- `Explore` - Enfocado en investigación y análisis
- `Plan` - Enfocado en planificación y estrategia
- `general-purpose` - Agent balanceado predeterminado

**Agents personalizados:**
- Cualquier agent del directorio `.claude/agents/`
- Usar nombre del agent: `agent: my-custom-agent`

**Ejemplo con agent personalizado:**

```yaml
---
name: refactor-component
description: Refactor a component following our patterns
context: fork
agent: refactoring-expert  # Custom agent from .claude/agents/
---

Refactor the $0 component:

1. Read current implementation
2. Identify code smells
3. Apply refactoring patterns
4. Ensure tests still pass
5. Document changes
```

## Cómo Funciona la Integración Agent-First

### El Patrón Subagent con Skills

Los subagents pueden precargar skills como material de referencia:

**.claude/agents/code-reviewer.md:**
```yaml
---
name: code-reviewer
description: Reviews code for quality and style
skills:
  - style-guide
  - security-checklist
  - performance-patterns
---

You are an expert code reviewer. Review code changes thoroughly:

1. Check against style guide
2. Identify security issues
3. Evaluate performance implications
4. Suggest improvements

Be constructive and specific in feedback.
```

### Flujo de Ejecución

1. **Delegación**: Claude delega tarea al subagent code-reviewer
2. **Creación de Contexto**: Se crea un nuevo contexto aislado
3. **Carga de Skills**: Los skills precargados se cargan en el contexto
4. **Asignación de Tarea**: El mensaje de delegación de Claude se convierte en la tarea
5. **Ejecución**: El subagent ejecuta con skills como referencia
6. **Retorno**: Los resultados se retornan a la conversación principal

### Qué se Carga

Cuando un subagent se ejecuta con skills precargados:

| Contenido | ¿Se carga? | Propósito |
|-----------|------------|-----------|
| Cuerpo markdown del subagent | ✅ Sí | System prompt |
| Skills precargados (contenido completo) | ✅ Sí | Material de referencia |
| CLAUDE.md | ✅ Sí | Memoria del proyecto/personal |
| Historial de conversación | ❌ No | Ejecución aislada |
| Delegación de Claude | ✅ Sí | La tarea real |

### Formato de Skills Precargados

Los skills listados en el campo `skills` se **cargan completamente** (no solo descripciones):

```yaml
---
name: test-generator
skills:
  - testing-conventions    # Full skill content loaded
  - test-patterns         # Full skill content loaded
  - assertion-library     # Full skill content loaded
---

Generate comprehensive tests following our conventions.
```

**Importante:** Estos skills proporcionan **conocimiento y guías**, no tareas. La tarea viene del mensaje de delegación de Claude.

## Matriz de Comparación

| Aspecto | Skill con `context: fork` | Subagent con `skills` |
|---------|---------------------------|-----------------------|
| **Definición de tarea** | En contenido del skill | De la delegación de Claude |
| **System prompt** | Del tipo de agent | Cuerpo markdown del subagent |
| **Rol de skills** | La tarea en sí | Material de referencia |
| **Activado por** | Usuario o Claude invoca skill | Claude delega al agent |
| **Mejor para** | Tareas explícitas y completas | Tipos de agents específicos de dominio |
| **CLAUDE.md** | ✅ Se carga | ✅ Se carga |
| **Historial de conversación** | ❌ No se carga | ❌ No se carga |

## Ejemplos Completos

### Ejemplo 1: Skill de Investigación (Skill-First)

**Skill con tarea explícita:**

**.claude/skills/analyze-security/SKILL.md:**
```yaml
---
name: analyze-security
description: Analyze codebase for security vulnerabilities
context: fork
agent: Explore
allowed-tools: Read, Grep, Glob
---

Perform a comprehensive security analysis of the codebase:

## Phase 1: Input Validation
- Scan for user input handling
- Check for SQL injection vulnerabilities
- Identify XSS risks

## Phase 2: Authentication
- Review authentication logic
- Check session management
- Verify password handling

## Phase 3: Authorization
- Identify permission checks
- Look for privilege escalation risks
- Review access control

## Output
Provide a prioritized list of security issues with:
- Severity level (Critical, High, Medium, Low)
- File location and line numbers
- Specific recommendation
- Example fix if applicable
```

**Uso:**
```
/analyze-security
```

**Resultado:** Reporte de seguridad completo generado en aislamiento.

### Ejemplo 2: Agent Revisor de Código (Agent-First)

**Agent con skills precargados:**

**.claude/agents/code-reviewer.md:**
```yaml
---
name: code-reviewer
description: Expert code reviewer with knowledge of project standards
skills:
  - style-guide
  - security-checklist
  - testing-requirements
model: opus
---

You are an expert code reviewer for this project.

When reviewing code:

1. **Style & Conventions**
   - Follow the style-guide skill
   - Check naming consistency
   - Verify code organization

2. **Security**
   - Apply security-checklist
   - Identify vulnerabilities
   - Suggest secure alternatives

3. **Testing**
   - Verify testing-requirements met
   - Check test coverage
   - Validate edge cases

4. **Quality**
   - Assess code clarity
   - Identify potential bugs
   - Suggest improvements

Provide specific, actionable feedback with file/line references.
```

**Skills de soporte:**

**.claude/skills/style-guide/SKILL.md:**
```yaml
---
name: style-guide
description: Project code style conventions
user-invocable: false
---

# Code Style Guide

## Naming Conventions
- Use camelCase for variables and functions
- Use PascalCase for classes and components
- Use UPPER_SNAKE_CASE for constants

## File Organization
- One component per file
- Group related utilities
- Co-locate tests with implementation
```

**.claude/skills/security-checklist/SKILL.md:**
```yaml
---
name: security-checklist
description: Security review checklist
user-invocable: false
---

# Security Checklist

## Input Validation
- [ ] All user input sanitized
- [ ] SQL queries use parameterization
- [ ] File paths validated

## Authentication
- [ ] Passwords hashed with bcrypt
- [ ] Session tokens properly secured
- [ ] MFA available for sensitive operations
```

**Uso:**

Claude automáticamente delega al code-reviewer al revisar código:

```
"Review the changes in src/auth/login.ts"
```

Claude invoca el subagent code-reviewer, que tiene acceso a style-guide y security-checklist como material de referencia.

### Ejemplo 3: Enfoque Combinado

Puedes usar ambos patrones juntos:

**.claude/skills/deep-test-generation/SKILL.md:**
```yaml
---
name: deep-test-generation
description: Generate comprehensive test suite
context: fork
agent: test-expert  # Custom agent with testing skills
---

Generate a comprehensive test suite for $ARGUMENTS:

1. Analyze the code structure
2. Identify all testable units
3. Create test cases covering:
   - Happy paths
   - Error conditions
   - Edge cases
   - Integration points
4. Follow project testing conventions
5. Ensure proper mocking and setup
```

**.claude/agents/test-expert.md:**
```yaml
---
name: test-expert
description: Testing specialist with framework knowledge
skills:
  - jest-patterns
  - mocking-conventions
  - assertion-best-practices
---

You are a testing expert. Write thorough, maintainable tests.
```

**Resultado:** El skill proporciona la tarea, el agent proporciona experiencia en testing.

## Mejores Prácticas

### 1. Elegir el Patrón Correcto

✅ **SÍ:** Usar skill-first para tareas completas y explícitas:

```yaml
---
name: generate-docs
context: fork
---

Generate API documentation for all endpoints in src/api/.
```

✅ **SÍ:** Usar agent-first para tipos de agents reutilizables:

```yaml
---
name: deployment-specialist
skills:
  - infrastructure-knowledge
  - deployment-checklist
---

You are a deployment expert. Execute deployments safely.
```

❌ **NO:** Usar skill-first solo con guías (subagent no tiene tarea):

```yaml
---
name: bad-example
context: fork
---

When writing code, follow these conventions:
- Use TypeScript
- Add JSDoc comments
```

### 2. Claridad en Definición de Tarea

✅ **SÍ:** Proporcionar tareas explícitas en contenido del skill:

```yaml
---
context: fork
---

Research the authentication flow:
1. Find auth-related files
2. Trace the login sequence
3. Identify security measures
4. Document the flow
```

❌ **NO:** Esperar que el subagent infiera la tarea solo de guías.

### 3. Estrategia de Carga de Skills

✅ **SÍ:** Usar `user-invocable: false` para skills de soporte de agent:

```yaml
---
name: testing-patterns
user-invocable: false  # Only for agent reference
---
```

✅ **SÍ:** Mantener skills de soporte enfocados en conocimiento, no en tareas.

### 4. Selección de Agent

✅ **SÍ:** Hacer coincidir tipo de agent con requisitos de tarea:

```yaml
# Research task -> Explore agent
agent: Explore

# Planning task -> Plan agent
agent: Plan

# Custom domain -> Custom agent
agent: refactoring-expert
```

### 5. Restricciones de Herramientas

✅ **SÍ:** Restringir herramientas apropiadamente para la tarea:

```yaml
---
context: fork
agent: Explore
allowed-tools: Read, Grep, Glob  # Read-only research
---
```

### 6. Selección de Modelo

✅ **SÍ:** Especificar modelo para tareas complejas de agent:

```yaml
---
name: architecture-reviewer
skills:
  - design-patterns
  - best-practices
model: opus  # Use most capable model
---
```

## Compatibilidad de Plataforma

### Claude Code

| Característica | Soporte |
|----------------|---------|
| `context: fork` | ✅ Soporte completo |
| Agents personalizados | ✅ Soporte completo |
| Skills precargados | ✅ Soporte completo |
| Agents incorporados | ✅ Explore, Plan, general-purpose |

### Otras Plataformas

**Cursor, Gemini CLI, Antigravity:**
- Verificar documentación específica de plataforma
- `context: fork` puede no estar soportado
- Agents personalizados pueden no estar disponibles
- Skills pueden funcionar de manera diferente

## Errores Comunes

### 1. Guías Sin Tarea

❌ **Problema:**

```yaml
---
context: fork
---

Follow our coding standards:
- Use TypeScript
- Write tests
- Document functions
```

**Problema:** Subagent recibe guías pero no tarea accionable. Regresa sin hacer nada significativo.

✅ **Solución:** Agregar tarea explícita o eliminar `context: fork`.

### 2. Mezcla de Tarea y Guías

❌ **Problema:**

```yaml
---
context: fork
---

Our API conventions:
- REST endpoints use plural nouns
- Return 404 for missing resources

Create API endpoints for the user model.
```

**Problema:** No está claro si esto es una referencia de convención o una tarea.

✅ **Solución:** Separar convenciones (skill) de tarea (delegación de agent o skill diferente).

### 3. Anidamiento Excesivo

❌ **Problema:**

Skill A (context: fork) invoca Skill B (context: fork) que invoca Skill C (context: fork).

**Problema:** El anidamiento profundo dificulta la depuración y confunde el contexto.

✅ **Solución:** Mantener jerarquías de ejecución superficiales. Usar subagents para tareas discretas.

## Solución de Problemas

### Subagent Retorna Resultados Vacíos

**Problema:** Skill con `context: fork` retorna sin salida significativa.

**Diagnóstico:**
1. Verificar si el skill contiene tarea explícita (no solo guías)
2. Verificar que el tipo de agent sea apropiado para la tarea
3. Asegurar que allowed-tools incluyan capacidades necesarias

**Solución:**
```yaml
# Antes (solo guías)
---
context: fork
---
Follow these patterns when refactoring...

# Después (tarea explícita)
---
context: fork
---
Refactor $ARGUMENTS following these patterns:
1. Read the file
2. Identify improvements
3. Apply changes
4. Verify tests pass
```

### Skills No se Cargan en Subagent

**Problema:** Skills precargados no aparecen en contexto del subagent.

**Diagnóstico:**
1. Verificar que nombres de skills sean correctos
2. Verificar que skills existan en `.claude/skills/`
3. Buscar advertencias sobre carga de skills

**Solución:**
```yaml
# Asegurar que skills existan
---
skills:
  - existing-skill  # Must exist in .claude/skills/existing-skill/
---
```

### Tipo de Agent Incorrecto Usado

**Problema:** Tarea requiere capacidades diferentes a las que proporciona el agent.

**Diagnóstico:**
1. Verificar si el tipo de agent coincide con la tarea (Explore para investigación, custom para trabajo de dominio)
2. Verificar que el agent personalizado exista si se especifica

**Solución:**
```yaml
# Research task
agent: Explore

# Planning task
agent: Plan

# Domain-specific task
agent: my-custom-agent  # Must exist in .claude/agents/
```

## Documentación Relacionada

- [Sub-agents in Claude Code](../../agents/sub-agents-claude-code.md) - Guía completa de subagents
- [Skills in Claude Code](../claude-code.md) - Referencia completa de skills
- [Tool Restrictions](tool-restrictions.md) - Control de acceso a herramientas
- [Dynamic Context](dynamic-context.md) - Patrones de command injection

## Lectura Adicional

- **Documentación Oficial:** [code.claude.com/docs/en/skills](https://code.claude.com/docs/en/skills)
- **Subagents:** [code.claude.com/docs/en/subagents](https://code.claude.com/docs/en/subagents)
- **Agent Skills Standard:** [agentskills.io](https://agentskills.io)

---

**Última Actualización:** Febrero 2026
**Categoría:** Skills - Advanced
**Plataforma:** Claude Code
