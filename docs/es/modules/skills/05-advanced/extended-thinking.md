# Extended Thinking (Modo Ultrathink)

## Descripción General

Extended thinking, activado por la palabra clave **"ultrathink"**, permite a Claude involucrarse en un razonamiento más profundo y exhaustivo al ejecutar skills. Esta característica activa el proceso de pensamiento interno de Claude, permitiéndole trabajar problemas complejos paso a paso antes de proporcionar una respuesta.

Extended thinking es particularmente valioso para tareas que requieren análisis cuidadoso, razonamiento en múltiples pasos o consideración de múltiples enfoques.

## ¿Qué es Extended Thinking?

Extended thinking (también conocido como "thinking mode" o "ultrathink") es un modo especial donde Claude:

1. **Piensa a través de los problemas** en un bloque de pensamiento explícito y visible
2. **Explora múltiples enfoques** antes de establecerse en una solución
3. **Considera casos extremos** y problemas potenciales de manera proactiva
4. **Muestra su proceso de razonamiento** de forma transparente
5. **Toma más tiempo** para llegar a mejores conclusiones

**Concepto clave:** Incluir "ultrathink" en cualquier parte del contenido de tu skill activa este modo.

## Cuándo Usar Extended Thinking

### Usar Extended Thinking Para:

- **Tareas de análisis complejas** que requieren consideración cuidadosa
- **Razonamiento en múltiples pasos** con dependencias
- **Decisiones de diseño** con compromisos a evaluar
- **Revisiones de seguridad** donde perder problemas es costoso
- **Planificación de arquitectura** que requiere pensamiento holístico
- **Depuración de problemas difíciles** con múltiples causas potenciales
- **Refactorización de código** con muchos cambios interdependientes
- **Optimización de rendimiento** que requiere análisis de compromisos

**Ejemplos:**
- Revisiones de diseño arquitectónico
- Análisis de vulnerabilidades de seguridad
- Diseño de algoritmos complejos
- Propuestas de diseño de sistemas
- Depuración de múltiples servicios
- Optimización de esquemas de base de datos
- Diseño de API con compatibilidad hacia atrás

### No Usar Extended Thinking Para:

- **Tareas simples y directas** (sobrecarga innecesaria)
- **Recuperación rápida de información** (ralentiza la respuesta)
- **Correcciones de formato o estilo** (tareas claras y mecánicas)
- **Operaciones sensibles al tiempo** (agrega latencia)
- **Tareas con soluciones obvias** (el pensamiento no agrega valor)

## Cómo Funciona

### Activación

Incluye la palabra **"ultrathink"** en cualquier parte del contenido de tu skill:

```yaml
---
name: complex-analysis
description: Deep analysis requiring extended thinking
---

Ultrathink through this problem carefully...
```

**Formulaciones alternativas:**
- "Ultrathink through..."
- "Use ultrathink mode..."
- "Think carefully (ultrathink)..."
- "Apply ultrathink to..."

### Flujo de Ejecución

1. **Invocación de Skill**: Usuario o Claude invoca skill con ultrathink
2. **Activación de Modo**: Claude entra en modo extended thinking
3. **Bloque de Pensamiento**: Claude muestra proceso de razonamiento explícito
4. **Análisis**: Exploración profunda del espacio del problema
5. **Solución**: Respuesta final basada en pensamiento exhaustivo
6. **Presentación**: Respuesta clara y bien razonada

### Lo Que Verás

**Sin ultrathink:**
```
Analyzing the code...

The issue is in the authentication function. Here's the fix:
[code]
```

**Con ultrathink:**
```
<thinking>
Let me analyze this authentication issue carefully.

First, I need to understand the current flow:
1. User submits credentials
2. System validates against database
3. Token is generated
4. Token is returned to client

Potential issues:
- SQL injection in validation?
- Timing attacks in password comparison?
- Token generation not cryptographically secure?
- Missing rate limiting?

Let me check each file:
- auth.ts: Uses parameterized queries ✓
- password.ts: Uses bcrypt.compare (timing-safe) ✓
- token.ts: Uses crypto.randomBytes - good ✓
- routes.ts: No rate limiting! ✗

Found the issue: Missing rate limiting allows brute force attacks.

Now considering solutions:
1. Add rate limiting middleware
2. Implement account lockout
3. Add CAPTCHA after failures

Best approach: Rate limiting + account lockout
- Rate limiting prevents rapid attempts
- Account lockout prevents persistent attacks
- Both together provide defense in depth
</thinking>

The authentication issue is missing rate limiting. Here's the fix:
[code with rate limiting middleware]

I also recommend adding account lockout after 5 failed attempts.
```

## Ejemplos Completos

### Ejemplo 1: Auditoría de Seguridad

Análisis de seguridad profundo con extended thinking.

**.claude/skills/security-audit/SKILL.md:**
```yaml
---
name: security-audit
description: Comprehensive security audit of codebase
context: fork
agent: Explore
allowed-tools: Read, Grep, Glob
---

# Security Audit Task

Ultrathink through a comprehensive security audit of the codebase.

## Analysis Areas

### 1. Input Validation
- Check all user input handling
- Look for injection vulnerabilities (SQL, XSS, command)
- Verify input sanitization

### 2. Authentication & Authorization
- Review authentication mechanisms
- Check session management
- Verify authorization checks
- Look for privilege escalation paths

### 3. Cryptography
- Check password storage (hashing, salting)
- Verify token generation
- Review encryption implementation
- Check for hardcoded secrets

### 4. API Security
- Review endpoint security
- Check rate limiting
- Verify CORS configuration
- Look for information disclosure

### 5. Data Protection
- Check sensitive data handling
- Verify data encryption at rest
- Review logging (no sensitive data logged)
- Check for secure deletion

## Thinking Process

For each area:
1. **Identify**: What could go wrong?
2. **Explore**: Check implementation
3. **Evaluate**: Assess severity
4. **Recommend**: Specific fixes

## Output Format

```
# Security Audit Report

## Critical Issues
[List with file:line, description, fix]

## High Priority Issues
[List with file:line, description, fix]

## Medium Priority Issues
[List with file:line, description, fix]

## Best Practice Improvements
[List with descriptions]

## Summary
[Overall security posture assessment]
```

Take your time. Missing a security issue is worse than taking longer to find all issues.
```

**Uso:**
```
/security-audit
```

**Resultado:** Análisis de seguridad exhaustivo con razonamiento visible.

### Ejemplo 2: Diseño de Arquitectura

Diseño de sistemas complejos con análisis de compromisos.

**.claude/skills/design-architecture/SKILL.md:**
```yaml
---
name: design-architecture
description: Design system architecture for new feature
argument-hint: [feature-description]
context: fork
agent: Plan
---

# Architecture Design Task

Ultrathink through the architecture design for: $ARGUMENTS

## Design Process

### 1. Requirements Analysis
- Understand functional requirements
- Identify non-functional requirements (performance, scalability, reliability)
- Consider constraints (budget, timeline, existing systems)

### 2. Option Exploration
Generate at least 3 different architectural approaches:

**For each approach:**
- Describe the design
- List pros and cons
- Estimate complexity
- Assess risks

### 3. Tradeoff Analysis
Compare approaches across dimensions:
- Performance
- Scalability
- Maintainability
- Cost
- Time to implement
- Risk level

### 4. Recommendation
Select best approach with clear justification.

### 5. Implementation Plan
- Components to build
- Integration points
- Migration strategy (if applicable)
- Testing approach
- Rollout plan

## Output Format

```
# Architecture Design: [Feature]

## Requirements
[Functional and non-functional]

## Design Options

### Option 1: [Name]
**Description:** [Overview]
**Pros:** [List]
**Cons:** [List]
**Complexity:** [Low/Medium/High]
**Risks:** [List]

### Option 2: [Name]
[Same format]

### Option 3: [Name]
[Same format]

## Tradeoff Analysis
[Comparison table or detailed discussion]

## Recommended Approach
**Choice:** Option X
**Justification:** [Why this option is best]

## Implementation Plan
[Detailed plan]
```

Think deeply about tradeoffs. Consider both immediate and long-term implications.
```

**Uso:**
```
/design-architecture real-time collaboration feature
```

**Resultado:** Propuesta de arquitectura bien razonada con pensamiento visible.

### Ejemplo 3: Depuración Compleja

Depuración de múltiples servicios con prueba de hipótesis.

**.claude/skills/debug-system/SKILL.md:**
```yaml
---
name: debug-system
description: Debug complex multi-service issues
argument-hint: [issue-description]
context: fork
agent: Explore
---

# System Debugging Task

Ultrathink through debugging this issue: $ARGUMENTS

## Investigation Process

### 1. Symptom Analysis
- What is the reported issue?
- What is the expected behavior?
- What is the actual behavior?
- When did it start?
- Is it consistent or intermittent?

### 2. Hypothesis Generation
Generate multiple hypotheses:
- Service A issue
- Service B issue
- Network issue
- Database issue
- Configuration issue
- Race condition
- Resource exhaustion

### 3. Evidence Gathering
For each hypothesis:
- What evidence would support it?
- What evidence would refute it?
- How can we test it?

### 4. Systematic Testing
Test hypotheses in order of likelihood:
- Check logs
- Review metrics
- Trace requests
- Examine configuration
- Test components in isolation

### 5. Root Cause Identification
- What is the underlying cause?
- Why did it happen?
- What allowed it to happen?

### 6. Solution Design
- Immediate fix (stop the bleeding)
- Root cause fix (prevent recurrence)
- Monitoring improvements (detect earlier next time)

## Thinking Guidelines

- Consider cascading failures
- Don't assume single root cause
- Check recent changes (code, config, infrastructure)
- Look for correlation vs causation
- Verify fixes don't introduce new issues

## Output Format

```
# Debug Report: [Issue]

## Symptoms
[Detailed description]

## Hypotheses Considered
1. [Hypothesis 1] - [Evidence for/against]
2. [Hypothesis 2] - [Evidence for/against]
...

## Investigation
[What was checked, what was found]

## Root Cause
[Detailed explanation]

## Solution
**Immediate fix:** [Quick mitigation]
**Root cause fix:** [Permanent solution]
**Prevention:** [How to avoid in future]

## Testing
[How to verify fix works]
```

Take time to think through all possibilities. A wrong diagnosis leads to wasted effort.
```

**Uso:**
```
/debug-system payment processing failures in production
```

**Resultado:** Depuración sistemática con prueba de hipótesis y razonamiento.

### Ejemplo 4: Optimización de Rendimiento

Análisis de rendimiento complejo con medición.

**.claude/skills/optimize-performance/SKILL.md:**
```yaml
---
name: optimize-performance
description: Analyze and optimize system performance
argument-hint: [component-or-operation]
context: fork
agent: Explore
---

# Performance Optimization Task

Ultrathink through optimizing: $ARGUMENTS

## Optimization Process

### 1. Baseline Measurement
- Current performance metrics
- Bottleneck identification
- Resource utilization
- User impact

### 2. Analysis
Investigate potential issues:
- Algorithm complexity
- Database queries (N+1, missing indexes)
- Network calls (too many, too large)
- Memory usage (leaks, excessive allocation)
- CPU usage (expensive operations)
- I/O operations (disk, network)

### 3. Optimization Strategies
Consider multiple approaches:

**Code-level:**
- Algorithm improvements
- Caching
- Lazy loading
- Batch operations

**Database-level:**
- Query optimization
- Index creation
- Denormalization
- Read replicas

**Architecture-level:**
- Async processing
- CDN for static assets
- Microservices splitting
- Horizontal scaling

### 4. Tradeoff Analysis
For each strategy:
- Performance improvement (estimated)
- Implementation complexity
- Maintenance burden
- Cost implications
- Risk assessment

### 5. Implementation Plan
- Priority order
- Expected improvements
- Measurement approach
- Rollback plan

## Thinking Guidelines

- Measure first, optimize second
- Focus on biggest bottlenecks
- Consider diminishing returns
- Balance complexity vs benefit
- Plan for measurement and validation

## Output Format

```
# Performance Optimization: [Component]

## Current Performance
[Metrics and bottlenecks]

## Analysis
[Detailed investigation findings]

## Optimization Strategies

### Strategy 1: [Name]
**Improvement:** [Estimated % or time reduction]
**Complexity:** [Low/Medium/High]
**Tradeoffs:** [List]
**Recommendation:** [Yes/No/Maybe]

[More strategies...]

## Recommended Approach
**Priority 1:** [Strategy] - [Justification]
**Priority 2:** [Strategy] - [Justification]
...

## Implementation Plan
[Detailed steps with measurement points]

## Success Criteria
[How to measure success]
```

Think carefully about tradeoffs. Premature optimization is wasteful, but late optimization is painful.
```

**Uso:**
```
/optimize-performance user dashboard loading
```

**Resultado:** Plan de optimización basado en datos con análisis exhaustivo.

### Ejemplo 5: Plan de Refactorización

Refactorización a gran escala con gestión de riesgos.

**.claude/skills/plan-refactor/SKILL.md:**
```yaml
---
name: plan-refactor
description: Plan complex code refactoring
argument-hint: [target-code-area]
context: fork
---

# Refactoring Plan

Ultrathink through refactoring: $ARGUMENTS

## Planning Process

### 1. Current State Analysis
- What is the current code structure?
- What are the problems?
- Why was it designed this way?
- What has changed since then?

### 2. Goal Definition
- What should the refactored code achieve?
- What problems must be solved?
- What constraints must be respected?
- What risks must be avoided?

### 3. Approach Options
Generate multiple refactoring approaches:

**For each approach:**
- Describe the changes
- Estimate scope
- Identify dependencies
- Assess risks

### 4. Risk Analysis
- What could go wrong?
- How likely is each risk?
- How severe would impact be?
- How can we mitigate?

### 5. Step-by-Step Plan
Break refactoring into safe, incremental steps:
- Each step should be independently testable
- Each step should be reversible
- Each step should maintain functionality

### 6. Testing Strategy
- What tests are needed?
- How to verify behavior unchanged?
- How to validate improvements?

## Thinking Guidelines

- Refactor or rewrite? (usually refactor)
- Can it be done incrementally? (usually yes)
- What's the worst that could happen? (plan for it)
- How to ensure no regressions? (comprehensive tests)

## Output Format

```
# Refactoring Plan: [Target]

## Current State
[Description and problems]

## Goals
[What we want to achieve]

## Approach Options
[Multiple approaches with pros/cons]

## Recommended Approach
[Selected approach with justification]

## Risk Analysis
[Risks and mitigation strategies]

## Step-by-Step Plan

### Phase 1: [Name]
**Steps:**
1. [Step]
2. [Step]
**Tests:** [What to test]
**Rollback:** [How to undo if needed]

[More phases...]

## Testing Strategy
[Comprehensive testing approach]

## Success Criteria
[How to know refactoring succeeded]
```

Think through the entire journey. A bad refactoring plan creates more problems than it solves.
```

**Uso:**
```
/plan-refactor authentication module
```

**Resultado:** Plan de refactorización integral con mitigación de riesgos.

## Mejores Prácticas

### 1. Usar Solo para Tareas Complejas

✅ **SÍ:** Usar ultrathink para análisis complejos:

```yaml
Ultrathink through the security implications of this API design.
```

❌ **NO:** Usar para tareas simples:

```yaml
Ultrathink through formatting this file.
```

### 2. Proporcionar Contexto Claro

✅ **SÍ:** Dar a Claude contexto sobre qué pensar:

```yaml
Ultrathink through debugging this issue. Consider:
- Recent code changes
- System architecture
- Error patterns
- Resource constraints
```

❌ **NO:** Esperar que ultrathink compense la falta de contexto.

### 3. Combinar con Context Fork

✅ **SÍ:** Usar en subagent aislado para pensamiento enfocado:

```yaml
---
context: fork
agent: Explore
---

Ultrathink through this complex problem...
```

### 4. Establecer Expectativas

✅ **SÍ:** Explicar sobre qué pensar:

```yaml
Ultrathink through all possible failure modes and their mitigations.
```

### 5. Permitir Tiempo

✅ **SÍ:** Aceptar que el pensamiento toma tiempo para mejores resultados.

❌ **NO:** Usar ultrathink para operaciones sensibles al tiempo.

## Compatibilidad de Plataforma

### Claude Code

| Característica | Soporte |
|----------------|---------|
| Palabra clave "ultrathink" | ✅ Soporte completo |
| Bloques de pensamiento visibles | ✅ Soporte completo |
| Razonamiento extendido | ✅ Soporte completo |

### Otras Plataformas

**Cursor, Gemini CLI, Antigravity:**
- El soporte de extended thinking varía
- Algunas plataformas pueden no soportar bloques de pensamiento
- La palabra clave puede ser ignorada o funcionar de manera diferente
- Probar en la plataforma objetivo

## Errores Comunes

### 1. Uso Excesivo

❌ **Problema:** Usar ultrathink para cada skill.

**Problema:** Ralentiza tareas simples innecesariamente.

✅ **Solución:** Reservar para tareas genuinamente complejas.

### 2. Sin Directiva Clara

❌ **Problema:**

```yaml
Ultrathink through this.
```

**Problema:** Claude no sabe sobre qué pensar específicamente.

✅ **Solución:**

```yaml
Ultrathink through the security implications, considering:
- Input validation
- Authentication
- Authorization
- Data protection
```

### 3. Tareas Sensibles al Tiempo

❌ **Problema:**

```yaml
---
name: quick-fix
---

Ultrathink through fixing this typo.
```

**Problema:** El pensamiento agrega latencia innecesaria.

✅ **Solución:** No usar ultrathink para tareas simples y sensibles al tiempo.

## Solución de Problemas

### No Hay Bloque de Pensamiento Visible

**Problema:** Palabra clave ultrathink presente pero no se muestra pensamiento.

**Diagnóstico:**
1. Verificar que la plataforma soporte bloques de pensamiento
2. Verificar que "ultrathink" esté escrito correctamente
3. Verificar que la tarea sea lo suficientemente compleja para justificar pensamiento

**Solución:**
- Asegurar compatibilidad de plataforma
- Usar tarea más compleja que se beneficie del pensamiento
- Verificar errores tipográficos en la palabra clave

### Pensamiento Muy Superficial

**Problema:** Bloque de pensamiento presente pero no exhaustivo.

**Diagnóstico:**
1. ¿Es la tarea realmente compleja?
2. ¿Se proporciona suficiente contexto?
3. ¿Se mencionan áreas específicas de pensamiento?

**Solución:**
```yaml
Ultrathink through this security audit. Consider:
1. Input validation in all endpoints
2. Authentication token security
3. Authorization bypass possibilities
4. Data encryption at rest and in transit
5. Logging and monitoring gaps
```

### Demasiado Pensamiento

**Problema:** Bloque de pensamiento extremadamente largo.

**Diagnóstico:**
- La tarea puede ser demasiado amplia
- Demasiadas dimensiones a considerar
- Falta de enfoque

**Solución:**
```yaml
# Dividir en skills más pequeños
/security-audit-auth  # Solo autenticación
/security-audit-data  # Solo protección de datos
```

## Documentación Relacionada

- [Skills in Claude Code](../claude-code.md) - Referencia completa de skills
- [Subagent Integration](subagents-integration.md) - Skills con subagents
- [Dynamic Context](dynamic-context.md) - Command injection
- [Tool Restrictions](tool-restrictions.md) - Control de herramientas

## Lectura Adicional

- **Documentación Oficial:** [code.claude.com/docs/en/skills](https://code.claude.com/docs/en/skills)
- **Extended Thinking:** [anthropic.com/extended-thinking](https://www.anthropic.com)

---

**Última Actualización:** Febrero 2026
**Categoría:** Skills - Advanced
**Plataforma:** Claude Code
