---
id: settings-reference
version: "1.0.0"
last_updated: "2026-03-07"
updated_by: "TL: Lead Engineer"
status: active
type: standard
review_cycle: 60
next_review: "2026-05-06"
owner_role: "Tech Lead"
---

# .claude/settings.json — Referencia Completa

> **Proposito**: Documentacion de la configuracion central de Claude Code para el ecosistema SDLC {{CLIENT_NAME}}.
> **Ubicacion real**: `settings.json` en la raiz del proyecto (tambien referenciado como `.claude/settings.json`).
> **Estado**: ✅ IMPLEMENTADO — archivo real con 4 hooks activos.
> **Referenciado por**: CLAUDE.md, docs/hooks/README.md, rules/workflows.md

---

## Estructura del Archivo

El archivo `settings.json` es el **centro de control** de Claude Code. Define:

1. **Modelo** — cual LLM usar
2. **Permisos** — que herramientas puede usar sin preguntar
3. **Hooks** — automatizaciones event-driven (PreToolUse, Stop, SessionStart, Notification)
4. **Allowed tools** — lista blanca de herramientas MCP

---

## Configuracion Actual del Ecosistema {{CLIENT_NAME}}

```json
{
  "model": "claude-sonnet-4-20250514",
  "permissions": {
    "allow": [
      "Read",
      "Write",
      "Edit",
      "Bash(git:*)",
      "Bash(npm:*)",
      "Bash(npx:*)",
      "mcp__jira__*",
      "mcp__github__*",
      "mcp__confluence__*",
      "mcp__xray__*",
      "mcp__slack__read_*"
    ],
    "deny": ["Bash(rm -rf *)", "Bash(sudo *)", "Bash(curl * | bash)", "mcp__slack__post_message"]
  },

  "PreToolUse": [
    {
      "matcher": "Write|Edit",
      "hooks": [
        {
          "type": "prompt",
          "prompt": "Analyze this file write. Check: 1) If source code changed, list docs that may need updating per DTC rule (db-schema.md for DB, specs/routes.md for API, specs/components.md for UI, architecture.md for deps, CLAUDE.md+HelpCenter for ecosystem changes). 2) Check content for hardcoded secrets. 3) Verify path is valid. Return 'approve' with docs reminder, or 'deny' if secrets detected.",
          "timeout": 15
        }
      ]
    }
  ],

  "Stop": [
    {
      "matcher": "*",
      "hooks": [
        {
          "type": "prompt",
          "prompt": "Review transcript. If ecosystem artifacts (skills/commands/rules/hooks/MCPs/checklists/signoffs/templates/agents) were modified, verify all 8 sources of truth have consistent counts: CLAUDE.md, HelpCenter.tsx, SitemapView.tsx, IntegrityTests.tsx, audit-catalog.md, Guidelines.md, help.md, org.md. Block if drift detected.",
          "timeout": 30
        }
      ]
    }
  ],

  "Notification": [
    {
      "matcher": "*",
      "hooks": [
        {
          "type": "command",
          "command": "bash .claude/hooks/notify.sh",
          "timeout": 5
        }
      ]
    }
  ],

  "SessionStart": [
    {
      "matcher": "*",
      "hooks": [
        {
          "type": "command",
          "command": "bash .claude/hooks/load-context.sh",
          "timeout": 10
        }
      ]
    }
  ]
}
```

---

## Seccion por Seccion

### model

```json
"model": "claude-sonnet-4-20250514"
```

Define el modelo LLM que Claude Code usa. Opciones comunes:

- `claude-sonnet-4-20250514` — equilibrio velocidad/calidad (recomendado para desarrollo)
- `claude-opus-4-20250514` — maximo razonamiento (para tareas complejas)

### permissions

```json
"permissions": {
  "allow": [...],
  "deny": [...]
}
```

| Campo   | Efecto                                                             |
| ------- | ------------------------------------------------------------------ |
| `allow` | Claude puede ejecutar estas herramientas **sin pedir permiso**     |
| `deny`  | Claude **nunca** ejecutara estas herramientas, ni pidiendo permiso |

**Patrones soportados**:

- `"Read"` — herramienta exacta
- `"Bash(git:*)"` — cualquier comando bash que empiece con `git`
- `"mcp__jira__*"` — cualquier herramienta MCP de Jira

### PreToolUse (Hook)

Se ejecuta **antes** de que Claude use una herramienta. Puede:

- `approve` — permitir la operacion
- `deny` — bloquear la operacion
- `ask` — pedir confirmacion al usuario

**Nuestro uso**: Validar regla DTC + detectar secrets antes de escribir archivos.

### Stop (Hook)

Se ejecuta cuando Claude **quiere terminar** la sesion. Puede:

- `approve` — permitir que termine
- `block` — forzar a Claude a seguir trabajando

**Nuestro uso**: Verificar que las 8 fuentes de verdad estan sincronizadas (DTC enforcement).

### Notification (Hook)

Se ejecuta cuando Claude genera una **notificacion**. Solo soporta hooks tipo `command`.

**Nuestro uso**: Notificacion desktop (macOS/Linux) para eventos relevantes.

### SessionStart (Hook)

Se ejecuta al **iniciar sesion**. Solo soporta hooks tipo `command`. Puede persistir variables via `$CLAUDE_ENV_FILE`.

**Nuestro uso**: Cargar contexto del proyecto (tipo, DTC activo, docs stale).

---

## MCPs Conectados

Las conexiones MCP se definen en `.mcp.json` (archivo separado):

```json
{
  "mcpServers": {
    "jira": {
      "command": "mcp-server-jira",
      "args": ["--project", "SDLC"],
      "env": { "JIRA_TOKEN": "${VAULT:jira/token}" }
    },
    "github": {
      "command": "mcp-server-github",
      "args": ["--repo", "{{CLIENT_CODE}}/sdlc"],
      "env": { "GITHUB_TOKEN": "${VAULT:github/token}" }
    },
    "confluence": {
      "command": "mcp-server-confluence",
      "env": { "CONFLUENCE_TOKEN": "${VAULT:confluence/token}" }
    },
    "xray": {
      "command": "mcp-server-xray",
      "env": { "XRAY_TOKEN": "${VAULT:xray/token}" }
    },
    "slack": {
      "command": "mcp-server-slack",
      "env": { "SLACK_TOKEN": "${VAULT:slack/token}" }
    }
  }
}
```

> **IMPORTANTE**: Los tokens nunca van hardcoded. Se referencian via Vault (`${VAULT:path/to/secret}`).

---

## Relacion con Otros Archivos

```
.claude/
  settings.json    ← ESTE ARCHIVO (modelo + permisos + hooks)
  mcp.json         ← Conexiones MCP (Jira, GitHub, Confluence, Xray, Slack)
  rules/           ← Contexto persistente (se cargan automaticamente)
  skills/          ← Prompts bajo demanda
  commands/        ← Workflows orquestadores
  hooks/           ← Scripts bash para hooks tipo "command"
    notify.sh
    load-context.sh
```

---

## Como Modificar

1. Editar `.claude/settings.json` con los cambios deseados
2. **Reiniciar Claude Code** — los hooks se cargan al inicio de sesion
3. Verificar con `claude --debug` que los hooks se registraron
4. Usar `/hooks` en sesion activa para ver hooks cargados

---

## Debugging

```bash
# Ver configuracion cargada
claude --debug

# En sesion activa, ver hooks registrados
/hooks

# Test manual de un hook script
echo '{"tool_name":"Write","tool_input":{"file_path":"/test.ts"}}' | \
  bash .claude/hooks/notify.sh
```

---

## Changelog

| Version | Fecha      | Cambios                                                |
| ------- | ---------- | ------------------------------------------------------ |
| 1.0.0   | 2026-03-07 | Documento inicial — configuracion completa con 4 hooks |
