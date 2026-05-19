---
id: hooks-overview
version: "1.0.0"
last_updated: "2026-03-07"
updated_by: "TL: Lead Engineer"
status: active
type: standard
review_cycle: 90
next_review: "2026-06-05"
owner_role: "Tech Lead"
---

# Hooks del Ecosistema — Overview

> **Proposito**: Indice y referencia general de los 4 hooks Claude Code del ecosistema SDLC {{CLIENT_NAME}}.
> **Hooks individuales**: Ver cada `docs/hooks/{nombre}.md` para configuracion detallada.
> **Configuracion central**: `.claude/settings.json` (ver `docs/settings-reference.md`)

---

## Arquitectura

Los hooks son **automatizaciones event-driven** que Claude Code ejecuta en momentos clave. Se dividen en 2 categorias por tipo de ejecucion:

### Categoria 1 — Prompt-based (LLM razona)

| Hook                  | Evento     | Matcher       | Proposito                                                  |
| --------------------- | ---------- | ------------- | ---------------------------------------------------------- |
| **dtc-write-guard**   | PreToolUse | `Write\|Edit` | Valida regla DTC + detecta secrets antes de escribir       |
| **dtc-session-check** | Stop       | `*`           | Verifica sincronizacion de 8 fuentes de verdad al terminar |

> Los hooks prompt-based usan el LLM para analizar contexto. Son mas lentos pero manejan logica compleja y edge cases.
> **CRITICO**: Para hooks que requieren JSON estructurado, usar "Return ONLY the following JSON" + prohibir explicitamente texto antes/despues del JSON.

### Categoria 2 — Command (bash determinista)

| Hook               | Evento       | Matcher | Script            | Proposito                            |
| ------------------ | ------------ | ------- | ----------------- | ------------------------------------ |
| **notify-desktop** | Notification | `*`     | `notify.sh`       | Alertas desktop macOS/Linux          |
| **context-loader** | SessionStart | `*`     | `load-context.sh` | Carga contexto proyecto + DTC status |

> Los hooks command ejecutan scripts bash. Son rapidos, deterministas, y sirven para integraciones externas y file I/O.

---

## Eventos Disponibles en Claude Code

| Evento               | Cuando se dispara                   | Tipos soportados |
| -------------------- | ----------------------------------- | ---------------- |
| **PreToolUse**       | Antes de ejecutar una herramienta   | prompt, command  |
| **PostToolUse**      | Despues de ejecutar una herramienta | prompt, command  |
| **Stop**             | Cuando el agente quiere parar       | prompt, command  |
| **SubagentStop**     | Cuando un subagente quiere parar    | prompt, command  |
| **UserPromptSubmit** | Al enviar un prompt                 | prompt, command  |
| **SessionStart**     | Al iniciar sesion                   | command          |
| **SessionEnd**       | Al cerrar sesion                    | command          |
| **PreCompact**       | Antes de compactar contexto         | command          |
| **Notification**     | Al generar notificacion             | command          |

> Solo usamos 4 de los 9 eventos. Los demas quedan disponibles para expansion futura.

---

## settings.json — Configuracion Completa

Para activar los 4 hooks, esta es la seccion de hooks en `.claude/settings.json`:

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
      "mcp__jira__*",
      "mcp__github__*"
    ],
    "deny": ["Bash(rm -rf *)", "Bash(sudo *)"]
  },

  "PreToolUse": [
    {
      "matcher": "Write|Edit",
      "hooks": [{ "type": "prompt", "prompt": "...", "timeout": 15 }]
    }
  ],
  "Stop": [
    {
      "matcher": "*",
      "hooks": [{ "type": "prompt", "prompt": "...", "timeout": 60 }]
    }
  ],
  "Notification": [
    {
      "matcher": "*",
      "hooks": [{ "type": "command", "command": "bash .claude/hooks/notify.sh", "timeout": 5 }]
    }
  ],
  "SessionStart": [
    {
      "matcher": "*",
      "hooks": [
        { "type": "command", "command": "bash .claude/hooks/load-context.sh", "timeout": 10 }
      ]
    }
  ]
}
```

> Ver cada hook individual para el prompt/script completo.

---

## Estructura Real en Filesystem

```
.claude/
  settings.json              ← Hooks registrados aqui
  hooks/
    notify.sh                ← Script: notify-desktop
    load-context.sh          ← Script: context-loader
```

> Los hooks prompt-based NO tienen scripts — su logica vive en el campo `"prompt"` de settings.json.
> Los hooks command SI tienen scripts bash referenciados por path.

---

## Variables de Entorno

| Variable              | Disponibilidad           | Descripcion                                       |
| --------------------- | ------------------------ | ------------------------------------------------- |
| `$CLAUDE_PROJECT_DIR` | Todos los hooks command  | Raiz del proyecto                                 |
| `$CLAUDE_PLUGIN_ROOT` | Todos los hooks command  | Directorio del plugin                             |
| `$CLAUDE_ENV_FILE`    | Solo SessionStart        | Archivo para persistir env vars durante la sesion |
| `$TOOL_INPUT`         | PreToolUse prompt hooks  | JSON con los inputs de la herramienta             |
| `$TOOL_RESULT`        | PostToolUse prompt hooks | Resultado de la herramienta                       |

---

## Reglas de Ejecucion

1. Los hooks se cargan al **inicio de sesion** — cambios requieren reiniciar Claude Code
2. Todos los hooks matching se ejecutan **en paralelo** — disenar para independencia
3. Exit code `0` = aprobado, exit code `2` = bloqueado (stderr se pasa a Claude)
4. Timeout: si un hook excede su timeout, se cancela silenciosamente
5. Un hook `deny` en PreToolUse **bloquea** la herramienta completamente
6. Un hook `block` en Stop **impide** que Claude termine la sesion

---

## Debugging

```bash
# Ver hooks cargados al iniciar
claude --debug

# En sesion activa
/hooks

# Test manual de script
echo '{"title":"Test","message":"Hello"}' | bash .claude/hooks/notify.sh
```

---

## Changelog

| Version | Fecha      | Cambios                                             |
| ------- | ---------- | --------------------------------------------------- |
| 1.0.0   | 2026-03-07 | Estructura inicial — 4 hooks (2 prompt + 2 command) |
