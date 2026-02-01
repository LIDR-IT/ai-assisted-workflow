# Creando Skills

Guía completa para construir skills efectivos desde cero.

## Contenido

### 🎨 Diseño de Skills

- **[Principios de Diseño](design-principles.md)**
  Fundamentos para crear skills efectivos
  - Concisión y claridad
  - Grados de libertad
  - Revelación progresiva
  - Ejemplos concretos

### 📐 Patrones de Skills

- **[Patrones de Skills](skill-patterns.md)**
  5 patrones progresivos de básico a complejo
  - Pattern 1: Conocimiento Simple
  - Pattern 2: Instrucciones Estructuradas
  - Pattern 3: Workflow con Decisiones
  - Pattern 4: Templates y Ejemplos
  - Pattern 5: Metacognición

### 🔄 Proceso de Creación

- **[Flujo de Creación](workflow.md)**
  Guía paso a paso para crear un skill
  - Identificar la necesidad
  - Diseñar la estructura
  - Escribir el contenido
  - Probar y refinar
  - Publicar

### ✅ Calidad

- **[Mejores Prácticas](best-practices.md)**
  Qué hacer, qué evitar, resolución de problemas
  - Checklist de calidad
  - Errores comunes
  - Optimización
  - Mantenimiento

---

## Ruta de Desarrollo

### Fase 1: Planificación

**1. Identifica la necesidad**
- ¿Qué problema resuelve tu skill?
- ¿Quién lo usará?
- ¿Qué alternativas existen?

**2. Define el alcance**
- ¿Qué debe hacer el skill?
- ¿Qué NO debe hacer?
- ¿Qué casos de uso cubrirá?

**3. Elige el patrón**
- ¿Conocimiento simple o workflow complejo?
- ¿Necesitas ejemplos?
- ¿Requiere toma de decisiones?

Ver [Principios de Diseño](design-principles.md) para detalles.

### Fase 2: Estructura

**1. Crea el archivo**
```bash
mkdir -p .claude/skills/mi-skill
touch .claude/skills/mi-skill/skill.md
```

**2. Define el frontmatter**
```yaml
---
name: mi-skill
description: Breve descripción de cuándo usar este skill
---
```

**3. Estructura el contenido**
```markdown
# Título del Skill

## Sección 1
Contenido...

## Sección 2
Contenido...
```

Ver [Patrones de Skills](skill-patterns.md) para templates.

### Fase 3: Contenido

**1. Escribe con claridad**
- Usa lenguaje simple y directo
- Evita ambigüedades
- Sé específico con ejemplos

**2. Organiza lógicamente**
- Principios antes que detalles
- Ejemplos después de explicaciones
- Casos especiales al final

**3. Incluye ejemplos**
```markdown
## Ejemplos

### Caso 1: Básico
Input: ...
Output: ...

### Caso 2: Avanzado
Input: ...
Output: ...
```

Ver [Mejores Prácticas](best-practices.md) para guías.

### Fase 4: Testing

**1. Prueba localmente**
```bash
# Invoca el skill
/mi-skill

# Verifica que se cargue correctamente
```

**2. Prueba casos de uso**
- Caso básico
- Casos edge
- Errores esperados

**3. Refina basado en resultados**
- Ajusta descripciones
- Mejora ejemplos
- Aclara instrucciones

### Fase 5: Publicación

**1. Valida el skill**
```bash
skills validate ./mi-skill
```

**2. Publica en skills.sh**
```bash
skills publish ./mi-skill
```

**3. Documenta**
- README con ejemplos
- Casos de uso
- Instrucciones de instalación

Ver [Flujo de Creación](workflow.md) para guía completa.

---

## Los 5 Patrones de Skills

### Pattern 1: Conocimiento Simple

**Cuándo usar:** Información directa sin lógica compleja

```markdown
---
name: react-hooks-rules
description: Reglas para usar React Hooks correctamente
---

# Reglas de React Hooks

## Reglas Principales

1. Solo llama Hooks en el nivel superior
2. Solo llama Hooks desde funciones React
3. Los nombres de Hooks custom deben empezar con "use"

## Ejemplos

### ✅ Correcto
\`\`\`jsx
function MyComponent() {
  const [state, setState] = useState(0);
  return <div>{state}</div>;
}
\`\`\`

### ❌ Incorrecto
\`\`\`jsx
function MyComponent() {
  if (condition) {
    const [state, setState] = useState(0); // ❌ En condicional
  }
}
\`\`\`
```

### Pattern 2: Instrucciones Estructuradas

**Cuándo usar:** Workflows paso a paso

```markdown
---
name: code-review
description: Guía para hacer code reviews efectivos
---

# Code Review Workflow

## Proceso

### 1. Contexto
- Lee el PR description
- Entiende el objetivo
- Revisa archivos modificados

### 2. Revisión de Código
- Verifica lógica correcta
- Busca edge cases
- Chequea performance

### 3. Feedback
- Comenta específicamente
- Sugiere mejoras
- Aprecia lo bueno

## Checklist

- [ ] Código funciona correctamente
- [ ] Tests agregados
- [ ] Documentación actualizada
- [ ] Sin code smells
```

### Pattern 3: Workflow con Decisiones

**Cuándo usar:** Lógica condicional y decisiones

```markdown
---
name: git-workflow
description: Workflow de Git basado en el tipo de cambio
---

# Git Workflow

## Determinar el Tipo de Cambio

### Si es un feature:
1. `git checkout -b feature/nombre`
2. Desarrolla la feature
3. `git commit -m "feat: descripción"`
4. PR a develop

### Si es un bugfix:
1. `git checkout -b fix/nombre`
2. Arregla el bug
3. `git commit -m "fix: descripción"`
4. PR a develop o main (si hotfix)

### Si es documentación:
1. `git checkout -b docs/nombre`
2. Actualiza docs
3. `git commit -m "docs: descripción"`
4. PR directo a main
```

### Pattern 4: Templates y Ejemplos

**Cuándo usar:** Generación de contenido estructurado

```markdown
---
name: api-documentation
description: Template para documentar APIs REST
---

# API Documentation Template

## Endpoint

\`\`\`
METHOD /api/resource
\`\`\`

## Description
Breve descripción del endpoint

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | string | Yes | Resource ID |
| filter | string | No | Filter criteria |

## Request Example

\`\`\`json
{
  "id": "123",
  "filter": "active"
}
\`\`\`

## Response Example

\`\`\`json
{
  "status": "success",
  "data": { ... }
}
\`\`\`

## Errores

- 400: Bad Request
- 401: Unauthorized
- 404: Not Found
```

### Pattern 5: Metacognición

**Cuándo usar:** Guiar el proceso de pensamiento

```markdown
---
name: architecture-thinking
description: Framework para tomar decisiones de arquitectura
---

# Architecture Decision Framework

## Antes de decidir, considera:

### 1. Contexto
- ¿Cuál es el problema exacto?
- ¿Qué restricciones tenemos?
- ¿Cuáles son los requisitos no funcionales?

### 2. Opciones
Lista al menos 3 alternativas:
1. Opción A: ...
2. Opción B: ...
3. Opción C: ...

### 3. Trade-offs
Para cada opción evalúa:
- ✅ Ventajas
- ❌ Desventajas
- 💰 Costo
- ⚡ Performance
- 🔧 Mantenibilidad

### 4. Decisión
Elige basándote en:
- Prioridades del proyecto
- Constraints técnicos
- Capacidades del equipo

### 5. Documentación
Registra:
- Decisión tomada
- Rationale
- Trade-offs aceptados
- Fecha y contexto
```

Ver [Patrones de Skills](skill-patterns.md) para más detalles.

---

## Principios Fundamentales

### 1. Concisión y Claridad

**✅ HACER:**
```markdown
# Usa React Hooks solo en el nivel superior
No llames Hooks dentro de loops, condiciones o funciones anidadas.
```

**❌ EVITAR:**
```markdown
# React Hooks Usage Guidelines and Best Practices
When utilizing React Hooks in your functional components, it is
imperative that you adhere to certain fundamental principles...
```

### 2. Grados de Libertad

**✅ HACER:**
```markdown
# Genera un componente de formulario
Incluye validación y manejo de errores.
Usa la librería de UI del proyecto.
```

**❌ EVITAR:**
```markdown
# Genera exactamente este código:
\`\`\`jsx
function Form() {
  return <form>...</form>;
}
\`\`\`
```

### 3. Revelación Progresiva

**✅ HACER:**
```markdown
# Git Commit

## Básico
`git commit -m "tipo: mensaje"`

## Tipos comunes
- feat: nueva funcionalidad
- fix: corrección de bugs

## Avanzado: Breaking Changes
Para cambios incompatibles, agrega `!` y BREAKING CHANGE en el body.
```

**❌ EVITAR:**
```markdown
# Git Commit
[Todo junto sin organización]
```

Ver [Principios de Diseño](design-principles.md) para guía completa.

---

## Checklist de Calidad

### Frontmatter
- [ ] `name` único y descriptivo
- [ ] `description` clara y específica
- [ ] Sin campos innecesarios

### Contenido
- [ ] Estructura clara con headers
- [ ] Ejemplos concretos
- [ ] Instrucciones específicas
- [ ] Sin ambigüedades

### Formato
- [ ] Markdown válido
- [ ] Code blocks con lenguaje
- [ ] Tablas bien formateadas
- [ ] Links funcionan

### Testing
- [ ] Probado en caso básico
- [ ] Probado en casos edge
- [ ] Funciona como se espera
- [ ] Descripción activa correctamente

Ver [Mejores Prácticas](best-practices.md) para checklist completo.

---

## Errores Comunes

### 1. Descripción muy específica

```yaml
# ❌ Muy específica
description: "Cuando el usuario dice exactamente 'ayúdame con React'"

# ✅ Apropiada
description: "Ayuda con desarrollo y mejores prácticas de React"
```

### 2. Contenido muy largo

```markdown
# ❌ Demasiado contenido
[50 páginas de documentación de React]

# ✅ Conciso y relevante
[Principios clave y ejemplos prácticos]
```

### 3. Falta de ejemplos

```markdown
# ❌ Solo teoría
Usa destructuring para extraer props.

# ✅ Con ejemplos
Usa destructuring para extraer props:
\`\`\`jsx
const MyComponent = ({ name, age }) => { ... }
\`\`\`
```

Ver [Mejores Prácticas](best-practices.md) para más errores comunes.

---

## Recursos y Plantillas

### Templates Iniciales

```bash
# Skill básico
skills init --template basic my-skill

# Skill con workflow
skills init --template workflow my-skill

# Skill con ejemplos
skills init --template examples my-skill
```

### Skills de Referencia

Revisa estos skills como ejemplos:
- `@anthropic/code-review` - Pattern 2
- `@github/conventional-commits` - Pattern 4
- `@vercel/architecture-decisions` - Pattern 5

---

## Siguiente Paso

Después de crear tu skill:
- Consulta [Guías de Plataforma](../04-platform-guides/) para publicación
- Revisa [Temas Avanzados](../05-advanced/) para funcionalidades avanzadas
- Explora [Ejemplos](../07-reference/examples.md) de la comunidad

---

**Navegación:** [← Usando Skills](../02-using-skills/) | [Volver a Skills](../index.md) | [Guías de Plataforma →](../04-platform-guides/)
