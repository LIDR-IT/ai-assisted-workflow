# Referencias - Skills

Documentación técnica completa y recursos de referencia para skills.

## Contenido

### 📋 Especificaciones

- **[Campos del Frontmatter](frontmatter-fields.md)**
  Referencia completa de todos los campos YAML
  - Campos requeridos
  - Campos opcionales
  - Tipos de datos
  - Validación

### 💡 Ejemplos

- **[Ejemplos Completos](examples.md)**
  Colección de skills de ejemplo
  - Por patrón (1-5)
  - Por categoría
  - Por caso de uso
  - Mejores prácticas

---

## Frontmatter Reference

### Campos Requeridos

```yaml
---
name: nombre-del-skill        # string, kebab-case
description: Descripción       # string, cuándo usar el skill
---
```

### Campos Opcionales Comunes

```yaml
---
# Metadata
author: Tu Nombre             # string
version: 1.0.0                # semver
tags: [tag1, tag2]           # array de strings

# Comportamiento
autoActivate: true            # boolean, default: true
priority: high                # low | medium | high

# Plataforma
platforms:                    # array
  - claude-code
  - antigravity

# Integración
subagents: [agent1, agent2]  # array de strings
tools: [Read, Write]         # array de strings permitidas
---
```

### Campos Avanzados

```yaml
---
# Contexto dinámico
dynamicContext:
  enabled: true
  commands:
    - git status
    - tree -L 2

# Restricciones
restrictions:
  allowedTools: [Read, Grep]
  blockedTools: [Bash, Write]
  allowedPaths: ["src/"]
  blockedPaths: [".env"]

# Performance
cache:
  enabled: true
  ttl: 3600

# Debugging
debug: true
verbose: true

# Modo de pensamiento
thinkingMode: extended        # normal | extended | ultrathink
---
```

Ver [Frontmatter Fields](frontmatter-fields.md) para detalles completos.

---

## Ejemplos por Patrón

### Pattern 1: Conocimiento Simple

```yaml
---
name: git-basics
description: Comandos básicos de Git
---

# Git Basics

## Comandos Esenciales

### Clone
\`\`\`bash
git clone <url>
\`\`\`

### Commit
\`\`\`bash
git add .
git commit -m "mensaje"
\`\`\`

### Push/Pull
\`\`\`bash
git push origin main
git pull origin main
\`\`\`

## Comandos Útiles

- `git status` - Ver estado
- `git log` - Ver historial
- `git diff` - Ver cambios
```

### Pattern 2: Instrucciones Estructuradas

```yaml
---
name: api-design
description: Diseña APIs REST siguiendo mejores prácticas
---

# API Design Workflow

## 1. Define Resources

Identifica las entidades principales:
- ¿Qué recursos expones?
- ¿Qué relaciones existen?

## 2. Design Endpoints

Para cada recurso:
- `GET /resources` - Listar
- `GET /resources/:id` - Obtener uno
- `POST /resources` - Crear
- `PUT /resources/:id` - Actualizar completo
- `PATCH /resources/:id` - Actualizar parcial
- `DELETE /resources/:id` - Eliminar

## 3. Define Schemas

Usa JSON Schema para validación:
\`\`\`json
{
  "type": "object",
  "properties": { ... }
}
\`\`\`

## 4. Document

Para cada endpoint documenta:
- Descripción
- Parámetros
- Request body
- Response examples
- Error codes
```

### Pattern 3: Workflow con Decisiones

```yaml
---
name: deployment-guide
description: Guía de deployment basada en el ambiente
---

# Deployment Guide

## Determinar Ambiente

### Staging
Si es staging:
1. `npm run build:staging`
2. `npm run test:e2e`
3. `npm run deploy:staging`
4. Verificar health checks

### Production
Si es producción:
1. ⚠️ Verificar que staging esté OK
2. `npm run build:production`
3. `npm run test:e2e`
4. Crear backup de DB
5. `npm run deploy:production`
6. Monitorear métricas por 30 min
7. Si hay errores: rollback inmediato

### Rollback
Si necesitas rollback:
1. `npm run deploy:rollback`
2. Verificar versión anterior
3. Investigar causa del fallo
4. Documentar incident
```

### Pattern 4: Templates y Ejemplos

```yaml
---
name: readme-template
description: Template para crear README.md profesionales
---

# README Template

\`\`\`markdown
# Nombre del Proyecto

Descripción breve y clara del proyecto.

## Features

- Feature 1
- Feature 2
- Feature 3

## Installation

\\\`\\\`\\\`bash
npm install proyecto
\\\`\\\`\\\`

## Usage

\\\`\\\`\\\`javascript
import { funcion } from 'proyecto';

funcion();
\\\`\\\`\\\`

## API Reference

### funcion(param)

Descripción de la función.

**Parameters:**
- `param` (type): Descripción

**Returns:** Tipo de retorno

**Example:**
\\\`\\\`\\\`javascript
const resultado = funcion('valor');
\\\`\\\`\\\`

## Contributing

Ver [CONTRIBUTING.md](CONTRIBUTING.md)

## License

MIT
\`\`\`
```

### Pattern 5: Metacognición

```yaml
---
name: problem-solving
description: Framework de resolución de problemas
thinkingMode: extended
---

# Problem Solving Framework

<thinking>
Antes de proponer una solución, sigue este proceso:

## 1. Comprensión del Problema

### Preguntas Clave
- ¿Cuál es EXACTAMENTE el problema?
- ¿Qué síntomas observamos?
- ¿Qué se esperaba vs qué ocurrió?
- ¿Cuándo empezó?
- ¿Es reproducible?

### Recopilación de Datos
- Logs relevantes
- Configuración actual
- Estado del sistema
- Pasos para reproducir

## 2. Análisis de Causas

### Hipótesis
Lista al menos 3 posibles causas:
1. Hipótesis A: ...
2. Hipótesis B: ...
3. Hipótesis C: ...

### Validación
Para cada hipótesis:
- ¿Cómo la probamos?
- ¿Qué evidencia la soporta?
- ¿Qué evidencia la contradice?

## 3. Generación de Soluciones

### Opciones
Para cada causa validada, propón:
- Solución rápida (workaround)
- Solución permanente
- Prevención futura

### Evaluación
Para cada solución:
- ✅ Pros
- ❌ Contras
- ⏱️ Tiempo de implementación
- 🎯 Efectividad
- 🔄 Complejidad

## 4. Decisión

Selecciona la mejor solución basándote en:
- Urgencia del problema
- Recursos disponibles
- Impacto en usuarios
- Riesgo de la solución

## 5. Implementación

Plan de acción:
1. Paso 1
2. Paso 2
3. Paso 3

Rollback plan:
- Si falla X, hacer Y
</thinking>

## Presentación de Solución

[Presenta tu análisis y solución recomendada aquí]
```

Ver [Examples](examples.md) para más ejemplos completos.

---

## Quick Reference

### Sintaxis de Frontmatter

```yaml
---
# Comentarios con #
field: valor                  # String
number: 42                    # Number
boolean: true                 # Boolean
array: [item1, item2]        # Array inline
array:                       # Array multi-línea
  - item1
  - item2
object:                      # Object
  key1: value1
  key2: value2
multiline: |                 # String multi-línea (preserva \n)
  Línea 1
  Línea 2
folded: >                    # String plegado (convierte \n en espacio)
  Línea 1
  Línea 2
---
```

### Markdown Features

```markdown
# H1
## H2
### H3

**bold**
*italic*
`code`

- Lista
- Desordenada

1. Lista
2. Ordenada

[Link](url)

![Image](url)

> Quote

\`\`\`language
code block
\`\`\`

| Table | Header |
|-------|--------|
| Cell  | Cell   |
```

### Contexto Dinámico

```yaml
---
name: dynamic-example
---

# Dynamic Context

## Git Info
!`git branch --show-current`

## File Count
!`find src -name "*.js" | wc -l`

## Last Commit
!`git log -1 --oneline`
```

---

## Schema de Validación

### JSON Schema para package.json

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["name", "version", "description"],
  "properties": {
    "name": {
      "type": "string",
      "pattern": "^@[a-z0-9-]+/[a-z0-9-]+$"
    },
    "version": {
      "type": "string",
      "pattern": "^\\d+\\.\\d+\\.\\d+$"
    },
    "description": {
      "type": "string",
      "maxLength": 200
    },
    "keywords": {
      "type": "array",
      "items": { "type": "string" },
      "maxItems": 10
    },
    "skills": {
      "type": "object",
      "required": ["category"],
      "properties": {
        "category": {
          "enum": ["development", "design", "devops", "data", "documentation"]
        },
        "platforms": {
          "type": "array",
          "items": {
            "enum": ["claude-code", "antigravity", "universal"]
          }
        }
      }
    }
  }
}
```

---

## Glosario

**Skill:** Archivo Markdown con frontmatter que extiende capacidades del agente

**Frontmatter:** Metadata YAML al inicio del archivo entre `---`

**Pattern:** Estructura recomendada para organizar el contenido del skill

**Activation:** Proceso de cargar un skill en el contexto del agente

**Dynamic Context:** Ejecución de comandos durante la carga del skill

**Subagent:** Agente especializado que puede ser activado por un skill

**Tool Restriction:** Limitación de herramientas disponibles para un skill

---

## Troubleshooting Quick Reference

| Problema | Solución |
|----------|----------|
| Skill no se activa | Verificar `description` sea general |
| Frontmatter inválido | Validar sintaxis YAML |
| Comando dinámico falla | Verificar permisos y sintaxis |
| Conflicto de nombres | Usar namespace `@user/skill` |
| Skill muy lento | Reducir contexto dinámico |
| Herramienta bloqueada | Revisar `restrictions.allowedTools` |

---

## Recursos Adicionales

### Documentación Oficial
- [Claude Code Skills Docs](https://code.claude.com/docs/skills)
- [Antigravity Knowledge Docs](https://antigravity.google/docs/knowledge)
- [YAML Specification](https://yaml.org/spec/)
- [Markdown Guide](https://www.markdownguide.org/)

### Herramientas
- [Skills CLI](../06-ecosystem-tools/npm-package.md)
- [Skills.sh Platform](../06-ecosystem-tools/skills-sh-platform.md)
- [YAML Validator](https://www.yamllint.com/)
- [Markdown Preview](https://markdownlivepreview.com/)

### Comunidad
- [Skills.sh Community](https://skills.sh/community)
- [Discord](https://discord.gg/skills)
- [GitHub Discussions](https://github.com/skills-sh/discussions)

---

**Navegación:** [← Herramientas](../06-ecosystem-tools/) | [Volver a Skills](../index.md) | [Módulos ↑](../../)
