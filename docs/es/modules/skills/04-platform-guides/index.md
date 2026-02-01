# Guías de Plataforma - Skills

Documentación específica para skills en cada plataforma.

## Contenido

### 🤖 [Claude Code](claude-code.md)
Skills en Claude Code CLI
- Ubicaciones de archivos
- Comandos CLI
- Plugin system
- Skills nativos vs instalados

### 🌀 [Antigravity](antigravity.md)
Skills en Google Antigravity
- Knowledge system
- Configuración en UI
- Limitaciones
- Sincronización

### 🌐 [Multi-Plataforma](cross-platform.md)
OpenSkills loader universal
- Formato universal
- Compatibilidad
- Migración entre plataformas
- Sincronización

---

## Comparativa Rápida

| Característica | Claude Code | Antigravity | OpenSkills |
|----------------|-------------|-------------|------------|
| **Formato** | Markdown + YAML | Markdown + YAML | Markdown + YAML |
| **Ubicación** | `.claude/skills/` | `.agent/skills/` | `.skills/` |
| **CLI** | ✅ `skills` | ❌ | ✅ Manual |
| **UI** | ❌ | ✅ Settings | ❌ |
| **Sync** | Manual | Manual | Automático |
| **Namespace** | ✅ @user/skill | ❌ | ✅ @user/skill |
| **Marketplace** | ✅ skills.sh | ❌ | ✅ skills.sh |

---

## Instalación por Plataforma

### Claude Code

```bash
# Global
skills install @user/skill-name

# Por proyecto
cd proyecto
skills install @user/skill-name --local

# Verificar
ls -la .claude/skills/
```

**Ubicaciones:**
- Global: `~/.claude/skills/`
- Proyecto: `.claude/skills/`

### Antigravity

```bash
# Método 1: UI
# Settings > Knowledge > Add Skill

# Método 2: Manual
mkdir -p .agent/skills/mi-skill
cat > .agent/skills/mi-skill/skill.md << 'EOF'
---
name: mi-skill
description: Descripción
---
Contenido...
EOF
```

**Ubicaciones:**
- Global: `~/.gemini/antigravity/skills/`
- Proyecto: `.agent/skills/`

### OpenSkills (Universal)

```bash
# Crear estructura
mkdir -p .skills/mi-skill
cat > .skills/mi-skill/skill.md << 'EOF'
---
name: mi-skill
description: Descripción
---
Contenido...
EOF

# Funciona automáticamente en todas las plataformas
```

---

## Sincronización Multi-Plataforma

### Problema

Cada plataforma usa diferentes ubicaciones:
- Claude Code: `.claude/skills/`
- Antigravity: `.agent/skills/`
- OpenSkills: `.skills/`

### Solución 1: Symlinks

```bash
# Fuente de verdad en .skills/
mkdir -p .skills

# Symlink para Claude Code
ln -s ../.skills .claude/skills

# Symlink para Antigravity
ln -s ../.skills .agent/skills
```

### Solución 2: OpenSkills Loader

```bash
# Instalar OpenSkills
npm install -g openskills

# Configurar
openskills init

# Sincronizar automáticamente
openskills sync
```

Ver [Multi-Plataforma](cross-platform.md) para detalles.

---

## Características Específicas

### Claude Code: Plugin System

```yaml
---
name: my-skill
description: Skill con integración de plugin
plugin:
  hooks:
    - PreToolUse
  tools:
    - Read
    - Write
---
```

### Antigravity: Knowledge UI

```
Settings > Knowledge > Skills
├── Installed Skills
├── Add Skill (Manual)
└── Import from URL
```

### OpenSkills: Universal Format

```
.skills/
├── skill1/
│   ├── skill.md          # Contenido principal
│   ├── README.md         # Documentación
│   └── examples/         # Ejemplos opcionales
└── skill2/
    └── skill.md
```

---

## Mejores Prácticas por Plataforma

### Claude Code

**✅ HACER:**
- Usa el CLI para instalación
- Publica en skills.sh
- Usa namespaces (@user/skill)
- Versiona tus skills

**❌ EVITAR:**
- Editar skills instalados directamente
- Duplicar skills en global y local
- Nombres sin namespace

### Antigravity

**✅ HACER:**
- Usa la UI para gestión
- Mantén skills en `.agent/skills/`
- Documenta bien cada skill

**❌ EVITAR:**
- Configurar en múltiples lugares
- Nombres muy largos
- Skills sin descripción clara

### OpenSkills

**✅ HACER:**
- Usa `.skills/` como fuente única
- Estructura consistente
- README para cada skill

**❌ EVITAR:**
- Modificar skills fuera de `.skills/`
- Estructuras inconsistentes
- Skills sin metadata

---

## Migración Entre Plataformas

### De Claude Code a Antigravity

```bash
# Copiar skills
cp -r .claude/skills/* .agent/skills/

# O usar symlink
ln -s .claude/skills .agent/skills
```

### De Antigravity a Claude Code

```bash
# Copiar skills
cp -r .agent/skills/* .claude/skills/

# Instalar con CLI (recomendado)
cd .agent/skills/mi-skill
skills publish .
skills install @user/mi-skill
```

### A OpenSkills (Universal)

```bash
# Mover a .skills/
mkdir -p .skills
cp -r .claude/skills/* .skills/

# Crear symlinks
ln -s ../.skills .claude/skills
ln -s ../.skills .agent/skills
```

---

## Troubleshooting por Plataforma

### Claude Code

**Skill no aparece:**
```bash
# Verificar instalación
skills list

# Reinstalar
skills remove @user/skill
skills install @user/skill

# Verificar ubicación
ls -la .claude/skills/
```

### Antigravity

**Skill no se carga:**
1. Verifica en Settings > Knowledge
2. Revisa que el archivo exista
3. Confirma formato YAML válido

### OpenSkills

**Sincronización falla:**
```bash
# Re-sincronizar
openskills sync --force

# Verificar configuración
openskills config
```

---

## Siguiente Paso

Selecciona tu plataforma y sigue la guía correspondiente:
- [Claude Code →](claude-code.md)
- [Antigravity →](antigravity.md)
- [Multi-Plataforma →](cross-platform.md)

O explora:
- [Temas Avanzados](../05-advanced/) - Funcionalidades avanzadas
- [Herramientas](../06-ecosystem-tools/) - npm y skills.sh

---

**Navegación:** [← Crear Skills](../03-creating-skills/) | [Volver a Skills](../index.md) | [Temas Avanzados →](../05-advanced/)
