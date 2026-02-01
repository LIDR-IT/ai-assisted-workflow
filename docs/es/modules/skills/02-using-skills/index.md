# Usando Skills

Guías prácticas para descubrir, instalar e invocar skills en tus proyectos.

## Contenido

### 🔍 Descubrimiento

- **[Descubrir Skills](discovery.md)**
  Cómo encontrar skills en el mercado de skills.sh
  - Búsqueda por categoría
  - Filtros y rankings
  - Valoraciones de la comunidad

### 📦 Instalación y Gestión

- **[Instalación](installation.md)**
  Instalar y gestionar skills con CLI
  - Comandos de instalación
  - Ubicaciones de archivos
  - Actualización de skills
  - Desinstalación

### 🎯 Invocación

- **[Invocar Skills](invocation.md)**
  Activación manual vs automática de skills
  - Invocación con slash command
  - Activación automática por descripción
  - Menciones de skills
  - Contexto de activación

### 🌐 Ecosistema

- **[Explorar el Ecosistema](ecosystem.md)**
  Top skills y categorías populares
  - Skills más usados
  - Categorías principales
  - Contribuciones de la comunidad
  - Tendencias

---

## Guía de Inicio Rápido

### 1. Descubrir Skills

**Opción A: Web (skills.sh)**
```
1. Visita https://skills.sh
2. Busca por categoría o nombre
3. Lee la descripción y ejemplos
4. Copia el comando de instalación
```

**Opción B: CLI**
```bash
# Buscar skills
skills search "react"

# Listar por categoría
skills list --category development

# Ver detalles
skills info @username/skill-name
```

### 2. Instalar Skills

```bash
# Instalar skill individual
skills install @username/skill-name

# Instalar múltiples skills
skills install @user/skill1 @user/skill2

# Instalar desde URL
skills install https://skills.sh/user/skill-name

# Instalar localmente
cd .claude/skills
git clone https://github.com/user/skill-repo
```

### 3. Verificar Instalación

```bash
# Listar skills instalados
skills list

# Ubicación de los skills
ls -la .claude/skills/
```

### 4. Usar un Skill

**Invocación manual:**
```
/nombre-del-skill
```

**Invocación automática:**
El agente invoca el skill automáticamente cuando la descripción coincide con la tarea.

---

## Ubicaciones de Skills

### Claude Code

```
proyecto/
├── .claude/
│   └── skills/           # Skills del proyecto
└── ~/.claude/
    └── skills/           # Skills globales
```

### Antigravity

```
proyecto/
├── .agent/
│   └── skills/           # Skills del proyecto (symlink)
└── ~/.gemini/
    └── antigravity/
        └── skills/       # Skills globales
```

### Multi-plataforma (OpenSkills)

```
proyecto/
├── .skills/              # Formato universal
│   ├── skill1/
│   │   └── skill.md
│   └── skill2/
│       └── skill.md
```

---

## Comandos CLI Esenciales

### Gestión de Skills

```bash
# Instalar
skills install @user/skill-name

# Actualizar
skills update @user/skill-name
skills update --all

# Desinstalar
skills remove @user/skill-name

# Listar instalados
skills list
skills list --global

# Buscar
skills search "keyword"
skills search --category web

# Info
skills info @user/skill-name
```

### Publicación (Creadores)

```bash
# Inicializar skill
skills init my-skill

# Validar
skills validate ./my-skill

# Publicar
skills publish ./my-skill

# Actualizar versión
skills publish ./my-skill --version 1.1.0
```

Ver [Instalación](installation.md) para detalles completos.

---

## Invocación de Skills

### Manual (Slash Command)

```
Usuario: /commit

Agente: [Carga el skill de commits y sigue sus instrucciones]
```

### Automática (Por Descripción)

```yaml
---
name: commit-helper
description: Ayuda al crear commits con conventional commits
---
```

Cuando el usuario dice "ayúdame a hacer un commit", el agente reconoce que coincide con la descripción y carga el skill automáticamente.

### Por Mención

```
Usuario: Usa @commit-helper para revisar mis cambios

Agente: [Carga commit-helper skill]
```

### Ejemplos de Activación

```markdown
# Skill: react-best-practices
description: Guía para seguir mejores prácticas en React

# Se activa cuando:
- "¿Cuáles son las mejores prácticas de React?"
- "Cómo debería estructurar mi componente React"
- /react-best-practices
```

Ver [Invocación](invocation.md) para patrones avanzados.

---

## Ecosistema de Skills

### Categorías Populares

**🛠️ Development**
- Code review
- Testing patterns
- Git workflows
- Architecture design

**📝 Documentation**
- README generation
- API documentation
- Code comments
- Architecture diagrams

**🎨 Design**
- UI/UX patterns
- Accessibility
- Design systems
- Component libraries

**🔧 DevOps**
- CI/CD pipelines
- Docker workflows
- Kubernetes configs
- Deployment strategies

**📊 Data**
- Data analysis
- SQL queries
- Data visualization
- ETL patterns

Ver [Ecosistema](ecosystem.md) para lista completa.

---

## Top Skills por Categoría

### Development

```bash
skills install @anthropic/code-review
skills install @github/conventional-commits
skills install @vercel/next-best-practices
skills install @react/hooks-patterns
```

### Documentation

```bash
skills install @docusaurus/docs-generator
skills install @readme/template
skills install @api/openapi-spec
```

### Design

```bash
skills install @tailwind/component-patterns
skills install @figma/design-tokens
skills install @accessibility/wcag-guide
```

Ver [Ecosistema](ecosystem.md) para más opciones.

---

## Gestión Multi-Proyecto

### Skills Globales vs Proyecto

**Globales:**
- Instalados en `~/.claude/skills/`
- Disponibles en todos los proyectos
- Útiles para skills genéricos

**Por Proyecto:**
- Instalados en `.claude/skills/`
- Específicos del proyecto
- Útiles para skills del dominio

### Compartir Skills en Equipo

**Opción 1: Commit en Git**
```bash
# Agregar skills al control de versiones
git add .claude/skills/
git commit -m "Add team skills"
git push
```

**Opción 2: skills.json**
```json
{
  "skills": [
    "@team/code-review",
    "@team/deployment",
    "@team/testing"
  ]
}
```

Luego:
```bash
skills install --from skills.json
```

---

## Solución de Problemas

### Skill no se activa

1. **Verifica la instalación**
   ```bash
   skills list
   ```

2. **Revisa la descripción**
   ```yaml
   # Descripción muy específica puede no coincidir
   description: "Exactamente esta frase"  # ❌

   # Descripción general es mejor
   description: "Ayuda con commits y mensajes de git"  # ✅
   ```

3. **Invoca manualmente**
   ```
   /nombre-del-skill
   ```

### Skill desactualizado

```bash
# Actualizar skill específico
skills update @user/skill-name

# Actualizar todos
skills update --all
```

### Conflictos de nombres

```bash
# Usar namespace completo
/username/skill-name

# O renombrar localmente
skills alias @user/skill-name my-custom-name
```

Ver [Troubleshooting](../07-reference/troubleshooting.md) para más soluciones.

---

## Siguiente Paso

Una vez que sepas usar skills:
- Aprende a [Crear tus Propios Skills](../03-creating-skills/)
- Explora [Guías Específicas de Plataforma](../04-platform-guides/)
- Revisa [Temas Avanzados](../05-advanced/) para patrones complejos

---

**Navegación:** [← Fundamentos](../01-fundamentals/) | [Volver a Skills](../index.md) | [Crear Skills →](../03-creating-skills/)
