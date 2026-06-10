# MCP Configuration

Source of truth para configuración de MCP servers del proyecto.

## Quick Start

```bash
# 1. Exportar variables de entorno en tu shell (NO en un .env del repo)
#    Añádelo a ~/.zshrc / ~/.bashrc para que persista entre sesiones
export CONTEXT7_API_KEY="your-api-key"

# 2. Sincronizar configuración
./.agents/sync.sh --only=mcp

# 3. Verificar (reiniciar la herramienta para que cargue el nuevo MCP)
claude mcp list
```

## Variables de entorno (cómo funciona)

**`sync.sh` NO carga `.env` files.** Genera JSONs con placeholders que cada
cliente MCP resuelve **en runtime** desde el entorno del proceso padre.

Flujo:

1. `mcp-servers.json` declara el placeholder:
   ```json
   "env": { "CONTEXT7_API_KEY": "${CONTEXT7_API_KEY}" }
   ```
2. `sync.sh` genera 5 JSONs (uno por plataforma). Cada cliente MCP
   resuelve el placeholder leyendo del shell del que se lanzó.
3. El usuario debe `export CONTEXT7_API_KEY=...` antes de abrir Claude
   Code / Cursor / VSCode / etc.

**Por qué no `.env`:** los JSONs generados (`.mcp.json`, `.cursor/mcp.json`,
`.vscode/mcp.json`) se commitean al repo. Resolver el placeholder en
build-time dejaría secretos en plano en git.

**Sintaxis por plataforma (auto-convertida por los adapters):**

| Plataforma  | Sintaxis generada         |
| ----------- | ------------------------- |
| Claude      | `${CONTEXT7_API_KEY}`     |
| Cursor      | `${CONTEXT7_API_KEY}`     |
| Gemini      | `${CONTEXT7_API_KEY}`     |
| Antigravity | `${CONTEXT7_API_KEY}`     |
| Copilot     | `${env:CONTEXT7_API_KEY}` |

## Archivos

- **`mcp-servers.json`** - Source of truth de MCP servers
- **`sync.sh --only=mcp`** - Genera 5 JSONs específicos por plataforma
- **`.env.example`** - Lista de env vars que el usuario debe exportar

## Servers Configurados

### Context7

Documentación actualizada para frameworks y librerías populares.

**Comando:** `npx -y @upstash/context7-mcp`
**Env vars:** `CONTEXT7_API_KEY` (opcional, sube rate limits)
**Plataformas:** Cursor, Claude Code, Gemini CLI, Antigravity, Copilot

### Playwright

Browser automation para testing.

**Comando:** `npx @playwright/mcp@latest`
**Env vars:** ninguna
**Plataformas:** Cursor, Claude Code, Gemini CLI, Copilot

### Chrome DevTools

Browser debugging e inspección.

**Comando:** `npx -y chrome-devtools-mcp`
**Env vars:** ninguna
**Plataformas:** Cursor, Claude Code, Gemini CLI, Copilot

## Agregar Nuevo Server

1. Edita `mcp-servers.json` con la entrada del server
2. Si requiere env vars, declara placeholders POSIX: `"env": {"FOO": "${FOO}"}`
3. Ejecuta `./.agents/sync.sh --only=mcp`
4. Documenta la env var nueva en `.env.example`
5. Commit cambios (los JSON generados van al repo, los placeholders NO son secretos)

## Plataformas Soportadas

| Plataforma      | Config generada                                                 | Soporte Proyecto                              |
| --------------- | --------------------------------------------------------------- | --------------------------------------------- |
| **Claude Code** | `.mcp.json` (raíz del repo)                                     | ✅                                            |
| **Cursor**      | `.cursor/mcp.json`                                              | ✅                                            |
| **Copilot**     | `.vscode/mcp.json`                                              | ✅                                            |
| **Gemini CLI**  | `.gemini/settings.json` + `mcp_config.json`                     | ✅                                            |
| **Antigravity** | `.gemini/mcp_config.json` (referencia); también necesita global | ⚠️ Project-level es referencia, global manual |

## Documentación

- **Integración MCP (setup + troubleshooting):** `docs/guides/claude-code/mcp-integration.md`
- **Skill de integración MCP:** `.agents/skills/lidr-mcp-integration/`

## Troubleshooting

**Server no aparece:**

```bash
# Re-sincronizar
./.agents/sync.sh --only=mcp

# Verificar JSON válido
jq '.' .agents/mcp/mcp-servers.json
```

Ver `docs/guides/claude-code/mcp-integration.md` para troubleshooting detallado.
