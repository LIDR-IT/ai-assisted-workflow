# MCP Sync Validation Guide

Este documento describe cómo validar que el sistema de sincronización MCP funciona correctamente.

## Pre-requisitos

1. **jq instalado:**
```bash
brew install jq
```

2. **Context7 API Key configurada:**
```bash
# Agregar a ~/.zshrc o ~/.bashrc
export CONTEXT7_API_KEY="tu-api-key"

# O usar archivo .env local (no commitear)
echo 'CONTEXT7_API_KEY="tu-api-key"' > .agents/mcp/.env
source .agents/mcp/.env
```

## Validación del Source of Truth

### 1. Verificar mcp-servers.json

```bash
# Verificar que es JSON válido
jq . .agents/mcp/mcp-servers.json

# Listar servers configurados
jq '.servers | keys' .agents/mcp/mcp-servers.json

# Ver configuración de Context7
jq '.servers.context7' .agents/mcp/mcp-servers.json
```

**Expected output:**
```json
{
  "type": "stdio",
  "command": "npx",
  "args": ["-y", "@upstash/context7-mcp"],
  "env": {"CONTEXT7_API_KEY": "${env:CONTEXT7_API_KEY}"},
  "platforms": ["cursor", "claude", "gemini", "antigravity"],
  "description": "Context7 - Up-to-date documentation for popular frameworks and libraries"
}
```

## Validación del Script de Sync

### 2. Ejecutar Sincronización

```bash
# Ejecutar script
./.agents/mcp/sync-mcp.sh

# Verificar que no hay errores
echo $?  # Debe mostrar 0
```

**Expected output:**
```
🔄 Sincronizando configuración MCP desde .agents/mcp/mcp-servers.json...

Generando configuraciones por plataforma...

  📝 Generando .cursor/mcp.json...
  📝 Generando .claude/mcp.json...
  📝 Generando .gemini/settings.json...
  📝 Generando .agent/settings.json (Antigravity)...

✅ Sincronización completada
```

### 3. Verificar Configs Generados

```bash
# Verificar que todos los archivos existen
ls -la .cursor/mcp.json .claude/mcp.json .gemini/settings.json .agent/settings.json

# Verificar contenido de cada uno
echo "=== Cursor ==="
jq . .cursor/mcp.json

echo "=== Claude Code ==="
jq . .claude/mcp.json

echo "=== Gemini CLI ==="
jq . .gemini/settings.json

echo "=== Antigravity ==="
jq . .agent/settings.json
```

**Expected:** Todos deben tener la misma estructura:
```json
{
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp"],
      "env": {"CONTEXT7_API_KEY": "${env:CONTEXT7_API_KEY}"}
    }
  }
}
```

## Validación por Plataforma

### 4. Cursor

```bash
# Verificar config
cat .cursor/mcp.json | jq .

# Abrir Cursor y verificar visualmente
# 1. Abrir proyecto en Cursor
# 2. Ir a Settings > MCP Servers
# 3. Verificar que "context7" aparece
```

**Test funcional:**
- En Cursor chat: `@context7 What is React?`
- Debe responder con documentación de React

### 5. Claude Code

```bash
# Listar MCP servers
claude mcp list

# Verificar que context7 aparece
```

**Expected output:**
```
context7 - enabled
```

**Test funcional:**
```bash
# Usar en chat
claude chat
# Luego: @context7 What is Next.js?
```

### 6. Gemini CLI

```bash
# Verificar configuración
cat .gemini/settings.json | jq .

# En Gemini CLI
gemini /mcp
```

**Expected:** Context7 debe aparecer en la lista de servers

### 7. Antigravity

```bash
# Verificar configuración
cat .agent/settings.json | jq .

# Abrir Antigravity
# 1. Ir a MCP Servers settings
# 2. Verificar que context7 aparece
```

## Validación de Sincronización

### 8. Test de Modificación

**Agregar nuevo server al source of truth:**

```bash
# Editar mcp-servers.json para agregar un nuevo server
jq '.servers.test = {
  "type": "stdio",
  "command": "echo",
  "args": ["test"],
  "platforms": ["cursor", "claude"]
}' .agents/mcp/mcp-servers.json > .agents/mcp/mcp-servers.json.tmp && mv .agents/mcp/mcp-servers.json.tmp .agents/mcp/mcp-servers.json

# Re-sincronizar
./.agents/mcp/sync-mcp.sh

# Verificar que el nuevo server aparece
jq '.mcpServers.test' .cursor/mcp.json
jq '.mcpServers.test' .claude/mcp.json

# Verificar que NO aparece en Gemini (no estaba en platforms)
jq '.mcpServers.test' .gemini/settings.json  # Debe ser null
```

**Limpiar después del test:**
```bash
# Remover server de prueba
jq 'del(.servers.test)' .agents/mcp/mcp-servers.json > .agents/mcp/mcp-servers.json.tmp && mv .agents/mcp/mcp-servers.json.tmp .agents/mcp/mcp-servers.json

# Re-sincronizar
./.agents/mcp/sync-mcp.sh
```

## Checklist de Validación Completa

- [ ] jq instalado y funcional
- [ ] CONTEXT7_API_KEY configurada en environment
- [ ] `mcp-servers.json` es JSON válido
- [ ] Script `sync-mcp.sh` es ejecutable
- [ ] Script ejecuta sin errores
- [ ] Genera `.cursor/mcp.json` correctamente
- [ ] Genera `.claude/mcp.json` correctamente
- [ ] Genera `.gemini/settings.json` correctamente
- [ ] Genera `.agent/settings.json` correctamente
- [ ] Context7 aparece en Cursor MCP settings
- [ ] Context7 aparece en `claude mcp list`
- [ ] Context7 funciona en Cursor (`@context7`)
- [ ] Modificar source → re-sync → configs actualizados
- [ ] `.env` en `.gitignore`
- [ ] Archivos de config pueden commitarse

## Troubleshooting

### Script falla con "jq: command not found"

```bash
brew install jq
```

### Context7 no aparece en platform

1. Verificar que la plataforma está en el array `platforms` en mcp-servers.json
2. Re-ejecutar sync: `./.agents/mcp/sync-mcp.sh`
3. Reiniciar la aplicación (Cursor, Claude Code, etc.)

### "CONTEXT7_API_KEY not found"

```bash
# Verificar variable
echo $CONTEXT7_API_KEY

# Si está vacía, configurar
export CONTEXT7_API_KEY="tu-api-key"

# O agregar a ~/.zshrc para persistencia
echo 'export CONTEXT7_API_KEY="tu-api-key"' >> ~/.zshrc
source ~/.zshrc
```

### Configs no se actualizan después de sync

```bash
# Verificar que script tiene permisos
chmod +x ./.agents/mcp/sync-mcp.sh

# Ejecutar con bash explícito
bash ./.agents/mcp/sync-mcp.sh

# Verificar que no hay errores de jq
jq . .agents/mcp/mcp-servers.json
```

## Success Criteria

✅ **Sistema validado cuando:**

1. Script ejecuta sin errores
2. Todos los archivos de config generados correctamente
3. Context7 visible en todas las plataformas configuradas
4. Context7 responde a queries en al menos una plataforma
5. Modificar source → sync → configs actualizados
6. Todo commitable a git (excepto .env)

## Próximos Pasos

Una vez validado:

1. Commit configuración a git:
```bash
git add .agents/mcp/ .cursor/mcp.json .claude/mcp.json .gemini/settings.json .agent/settings.json .gitignore
git commit -m "feat: add Context7 MCP with sync system"
```

2. Documentar en README del proyecto
3. Agregar más MCP servers según necesidad
4. Mantener source of truth actualizado
