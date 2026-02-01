# Temas Avanzados - Skills

Funcionalidades avanzadas y patrones complejos para skills.

## Contenido

### 🤝 Integración

- **[Integración con Subagentes](subagents-integration.md)**
  Combinar skills con subagentes para workflows complejos
  - Skills como activadores de subagentes
  - Pasar contexto entre skills y agentes
  - Orquestación de múltiples agentes

### 🔄 Contexto Dinámico

- **[Contexto Dinámico](dynamic-context.md)**
  Preprocesamiento con comandos !`command`
  - Ejecutar comandos al cargar
  - Inyectar resultados en contexto
  - Casos de uso avanzados

### 🔒 Seguridad

- **[Restricciones de Herramientas](tool-restrictions.md)**
  Control de permisos y seguridad
  - Restringir herramientas disponibles
  - Sandboxing
  - Auditoría de acciones

### 🧠 Pensamiento Avanzado

- **[Pensamiento Extendido](extended-thinking.md)**
  Modo Ultrathink para razonamiento profundo
  - Activar modo de pensamiento extendido
  - Casos de uso
  - Mejores prácticas

---

## Patrones Avanzados

### 1. Skills + Subagentes

**Caso de uso:** Workflow complejo que requiere múltiples pasos especializados

```yaml
---
name: full-stack-dev
description: Desarrollo full-stack con agentes especializados
subagents:
  - frontend-agent
  - backend-agent
  - testing-agent
---

# Full Stack Development Workflow

## Paso 1: Análisis
Usa el contexto actual para determinar qué agentes activar.

## Paso 2: Frontend
Si se necesita UI:
> Activa @frontend-agent con estas instrucciones:
> - Diseña componentes React
> - Usa Tailwind CSS
> - Sigue atomic design

## Paso 3: Backend
Si se necesita API:
> Activa @backend-agent con estas instrucciones:
> - Implementa endpoints REST
> - Usa Express.js
> - Valida inputs

## Paso 4: Testing
Siempre:
> Activa @testing-agent para crear tests
```

Ver [Integración con Subagentes](subagents-integration.md).

### 2. Contexto Dinámico

**Caso de uso:** Incluir información del sistema en el skill

```yaml
---
name: project-context
description: Agrega contexto del proyecto actual
---

# Contexto del Proyecto

## Estructura
!`tree -L 2 -I 'node_modules|dist'`

## Git Status
!`git status --short`

## Dependencias
!`cat package.json | jq .dependencies`

## Últimos Commits
!`git log --oneline -5`

Usa esta información para entender el proyecto actual.
```

Ver [Contexto Dinámico](dynamic-context.md).

### 3. Restricción de Herramientas

**Caso de uso:** Skill que solo debe leer, no escribir

```yaml
---
name: code-review
description: Revisa código sin modificarlo
restrictions:
  allowedTools:
    - Read
    - Grep
    - Glob
  blockedTools:
    - Write
    - Edit
    - Bash
---

# Code Review

Revisa el código usando solo herramientas de lectura.

## Proceso
1. Lee archivos relevantes
2. Identifica issues
3. Sugiere mejoras (sin aplicarlas)

⚠️ NO modifiques archivos, solo analiza y reporta.
```

Ver [Restricciones de Herramientas](tool-restrictions.md).

### 4. Pensamiento Extendido

**Caso de uso:** Decisiones arquitectónicas complejas

```yaml
---
name: architecture-decision
description: Toma decisiones arquitectónicas con razonamiento profundo
mode: ultrathink
---

# Architecture Decision

<ultrathink>
Para esta decisión, necesitas considerar:

1. **Análisis del Problema**
   - ¿Cuál es el problema exacto?
   - ¿Qué limitaciones existen?
   - ¿Cuáles son los requisitos?

2. **Opciones Disponibles**
   - Lista al menos 3 alternativas
   - Para cada una, evalúa:
     - Ventajas
     - Desventajas
     - Trade-offs
     - Costo de implementación
     - Costo de mantenimiento

3. **Evaluación Profunda**
   - Impacto a corto plazo
   - Impacto a largo plazo
   - Escalabilidad
   - Performance
   - Complejidad

4. **Decisión Justificada**
   - Selecciona la mejor opción
   - Explica el razonamiento
   - Documenta trade-offs aceptados
</ultrathink>

Presenta tu decisión final con:
- Opción elegida
- Justificación clara
- Próximos pasos
- Riesgos identificados
```

Ver [Pensamiento Extendido](extended-thinking.md).

---

## Escenarios Complejos

### Orquestación Multi-Agente

```yaml
---
name: deployment-orchestrator
description: Orquesta deployment completo con múltiples agentes
---

# Deployment Orchestration

## Fase 1: Pre-deployment
> @testing-agent: Ejecuta todos los tests
> Si fallan tests: STOP
> Si pasan: Continúa

## Fase 2: Build
> @build-agent: Construye para producción
> Verifica que no haya errores

## Fase 3: Deployment
> @devops-agent: Despliega a staging
> Espera confirmación de health checks

## Fase 4: Verificación
> @testing-agent: Ejecuta smoke tests en staging
> Si fallan: Rollback automático
> Si pasan: Listo para producción

## Fase 5: Producción
> @devops-agent: Despliega a producción
> @monitoring-agent: Activa monitoreo

## Fase 6: Post-deployment
> @docs-agent: Actualiza changelog
> @notification-agent: Notifica al equipo
```

### Context Injection Avanzado

```yaml
---
name: smart-context
description: Inyecta contexto inteligente basado en el proyecto
---

# Smart Context Injection

## Detectar Tipo de Proyecto

### Si es Node.js (!`test -f package.json && echo "true"`)
Package.json:
!`cat package.json | jq '{name, version, scripts, dependencies}'`

### Si es Python (!`test -f requirements.txt && echo "true"`)
Requirements:
!`cat requirements.txt`

### Si es Git (!`git rev-parse --git-dir 2>/dev/null && echo "true"`)
Branch actual:
!`git branch --show-current`

Archivos modificados:
!`git status --short`

## Variables de Entorno Disponibles
!`env | grep -E "(NODE_|PYTHON_|DJANGO_)" | cut -d= -f1`

Usa este contexto para adaptar tus respuestas al proyecto específico.
```

### Seguridad Granular

```yaml
---
name: safe-code-assistant
description: Asistente de código con restricciones de seguridad
restrictions:
  allowedTools:
    - Read
    - Grep
    - Glob
  blockedTools:
    - Bash
    - Write
    - Edit
  allowedPaths:
    - "src/"
    - "tests/"
  blockedPaths:
    - ".env"
    - "secrets/"
    - "*.key"
    - "*.pem"
---

# Safe Code Assistant

Puedo ayudarte a:
✅ Leer código en src/ y tests/
✅ Buscar patrones con grep
✅ Analizar estructuras
✅ Sugerir mejoras

NO puedo:
❌ Ejecutar comandos bash
❌ Modificar archivos
❌ Acceder a secretos
❌ Leer archivos de configuración sensibles

Esta restricción asegura que solo analizo código sin riesgos de seguridad.
```

---

## Optimización de Performance

### Lazy Loading de Skills

```yaml
---
name: conditional-skill
description: Carga contenido pesado solo cuando sea necesario
---

# Conditional Skill

## Evaluación Inicial
Si la tarea es simple: usa conocimiento básico

Si la tarea es compleja:
> Carga documentación completa: !`cat docs/full-guide.md`
```

### Caching de Comandos

```yaml
---
name: cached-context
description: Cachea resultados de comandos costosos
cache:
  ttl: 3600  # 1 hora
---

# Cached Context

## Estructura del Proyecto (cached)
!`tree -L 3 -I 'node_modules|dist' > .cache/tree.txt && cat .cache/tree.txt`

## Dependencias (cached)
!`npm ls --depth=0 > .cache/deps.txt && cat .cache/deps.txt`

Los resultados se cachean para evitar ejecuciones repetidas.
```

---

## Debugging de Skills Avanzados

### Skill con Logging

```yaml
---
name: debug-skill
description: Skill con logging para debugging
debug: true
---

# Debug Skill

[LOG] Skill activado en: !`date`
[LOG] Usuario: !`whoami`
[LOG] Directorio: !`pwd`

## Instrucciones

[LOG] Ejecutando paso 1...
1. Analiza el problema

[LOG] Ejecutando paso 2...
2. Genera solución

[LOG] Skill completado
```

### Validación de Pre-condiciones

```yaml
---
name: validated-skill
description: Skill que valida precondiciones antes de ejecutar
---

# Validated Skill

## Pre-flight Checks

### ✅ Node.js instalado
!`node --version || echo "❌ Node.js no está instalado"`

### ✅ Git disponible
!`git --version || echo "❌ Git no está disponible"`

### ✅ En directorio del proyecto
!`test -f package.json && echo "✅ En proyecto Node.js" || echo "❌ No es un proyecto Node.js"`

---

Si todas las validaciones pasan, procede con las instrucciones.
Si alguna falla, informa al usuario y DETÉN la ejecución.
```

---

## Siguiente Paso

- Explora [Herramientas](../06-ecosystem-tools/) para npm y skills.sh
- Revisa [Referencias](../07-reference/) para ejemplos completos
- Consulta [Guías de Plataforma](../04-platform-guides/) para implementación específica

---

**Navegación:** [← Guías de Plataforma](../04-platform-guides/) | [Volver a Skills](../index.md) | [Herramientas →](../06-ecosystem-tools/)
