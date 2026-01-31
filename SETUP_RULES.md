# Guía de Setup de Rules

Este proyecto usa un sistema de sincronización centralizado para reglas y skills compartidos entre múltiples plataformas (Cursor, Claude Code, Gemini CLI, Antigravity).

## Quick Start

### 1. Ejecutar Script de Sincronización

```bash
# Sincronizar rules y skills
./.agents/rules/sync-rules.sh
```

Esto crea symlinks para:
- ✅ Cursor (`.cursor/rules` → `../.agents/rules`)
- ✅ Claude Code (`.claude/rules` → `../.agents/rules`)
- ✅ Gemini CLI (`.gemini/rules` → `../.agents/rules`)
- ⚠️ Antigravity (`.agent/rules/` - copia archivos, no symlinks)

### 2. Verificar Symlinks

```bash
# Verificar symlinks creados
ls -la .cursor/rules .cursor/skills
ls -la .claude/rules .claude/skills
ls -la .gemini/rules .gemini/skills
```

**Salida esperada:**
```
lrwxr-xr-x  1 user  staff  16 Jan 31 12:00 .cursor/rules -> ../.agents/rules
lrwxr-xr-x  1 user  staff  17 Jan 31 12:00 .cursor/skills -> ../.agents/skills
```

### 3. Probar Acceso

```bash
# Leer regla a través de symlink
cat .cursor/rules/core-principles.md

# Listar skills disponibles
ls .claude/skills/

# Verificar Antigravity (archivos copiados)
ls .agent/rules/*.md
```

## Reglas Incluidas

El proyecto incluye 6 reglas core en `.agents/rules/`:

- **core-principles.md** - Arquitectura y decisiones de diseño
- **code-style.md** - Convenciones de código y formato
- **documentation.md** - Estándares de documentación
- **git-workflow.md** - Flujo de trabajo con Git
- **testing.md** - Prácticas de testing
- **use-context7.md** - Uso del MCP server Context7

## Agregar Nuevas Reglas

### 1. Crear en Source of Truth

```bash
# Crear nueva regla en .agents/rules/
cat > .agents/rules/security.md << 'EOF'
# Security Guidelines

## Best Practices
- Never commit secrets
- Use environment variables
- Validate all input
EOF
```

### 2. Sincronizar (solo para Antigravity)

```bash
# Cursor, Claude, Gemini ven cambios inmediatamente (symlinks)
# Antigravity necesita sync para copiar archivos
./.agents/rules/sync-rules.sh
```

### 3. Verificar Propagación

```bash
# Verificar en todas las plataformas
cat .cursor/rules/security.md   # Symlink
cat .claude/rules/security.md   # Symlink
cat .gemini/rules/security.md   # Symlink
cat .agent/rules/security.md    # Copia
```

## ⚡ Symlinks Bidireccionales

**IMPORTANTE:** Los symlinks funcionan en ambas direcciones para lectura Y escritura.

### ¿Dónde Crear Reglas Nuevas?

Puedes crear en **cualquiera** de estas ubicaciones, el resultado es el mismo:

```bash
# Opción 1: Crear en .agents/rules/ (RECOMENDADO)
cat > .agents/rules/security.md << 'EOF'
# Security Guidelines
...
EOF

# Opción 2: Crear en .cursor/rules/
cat > .cursor/rules/security.md << 'EOF'
# Security Guidelines
...
EOF

# Opción 3: Crear en .claude/rules/
cat > .claude/rules/security.md << 'EOF'
# Security Guidelines
...
EOF
```

**Todas estas opciones crean el archivo en `.agents/rules/`** porque los symlinks son bidireccionales.

### Mejor Práctica

✅ **SIEMPRE crear en `.agents/rules/`**

Razones:
- Es el source of truth explícito
- Claro para otros en el equipo
- Git history más limpio (commits en `.agents/`)
- Evita confusión sobre dónde está el "original"
- Funciona igual para todos los agentes

### Demo: Bidireccionalidad

```bash
# Crear en .gemini/rules/
echo "# New Rule" > .gemini/rules/new-rule.md

# Verificar que se creó en .agents/rules/
ls .agents/rules/new-rule.md  # ✅ Existe

# Y es visible en todos los demás
ls .cursor/rules/new-rule.md  # ✅ Existe
ls .claude/rules/new-rule.md  # ✅ Existe
```

Son **el mismo archivo**, solo rutas diferentes.

## Diferencias por Plataforma

### Cursor, Claude Code, Gemini CLI

- **Método:** Symlinks de directorio completo
- **Propagación:** Instantánea (cambios visibles inmediatamente)
- **Mantenimiento:** Cero - editar en `.agents/rules/` es suficiente
- **Bidireccional:** ✅ Crear en cualquier ubicación crea en `.agents/`

### Antigravity

- **Método:** Copia de archivos `.md` a `.agent/rules/`
- **Propagación:** Manual - requiere ejecutar `sync-rules.sh`
- **Razón:** Limitación de plataforma (no soporta symlinks de proyecto)

⚠️ **Nota:** Skills en Antigravity usan symlinks selectivos en `.agent/skills/`

## Troubleshooting

### Symlinks No Creados

```bash
# Verificar si es directorio en lugar de symlink
ls -la .cursor/rules

# Re-ejecutar sync
./.agents/rules/sync-rules.sh

# O crear manualmente
rm -rf .cursor/rules
ln -s ../.agents/rules .cursor/rules
```

### Cambios No Se Propagan

**Para Cursor/Claude/Gemini:**
```bash
# Verificar symlink existe y apunta correctamente
readlink .cursor/rules  # Debe ser: ../.agents/rules
ls .agents/rules/core-principles.md
```

**Para Antigravity:**
```bash
# Re-ejecutar sync para copiar cambios
./.agents/rules/sync-rules.sh

# Verificar archivos copiados
ls .agent/rules/
```

### Script Falla

```bash
# Verificar source existe
ls -la .agents/rules .agents/skills

# Dar permisos de ejecución
chmod +x .agents/rules/sync-rules.sh

# Ejecutar con dry-run primero
./.agents/rules/sync-rules.sh --dry-run
```

## Documentación

- **Source of Truth:** `.agents/rules/` (6 reglas)
- **Script:** `.agents/rules/sync-rules.sh`
- **Guía completa:** `docs/guides/rules/SYNC_SETUP.md`
- **Skills management:** `docs/guidelines/team-conventions/skills-management-guidelines.md`

## Referencias

- [Sync Setup Guide (Comprehensive)](docs/guides/rules/SYNC_SETUP.md)
- [Core Principles](.agents/rules/core-principles.md)
- [MCP Setup](SETUP_MCP.md)
