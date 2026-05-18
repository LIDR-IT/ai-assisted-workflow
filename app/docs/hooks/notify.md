---
id: hook-notify-desktop
version: '1.0.0'
last_updated: '2026-03-07'
updated_by: 'TL: Lead Engineer'
status: active
type: hook
review_cycle: 90
next_review: '2026-06-05'
category: command
event: Notification
matcher: '*'
script: '.claude/hooks/notify.sh'
owner_role: 'Tech Lead'
---

# Hook: notify-desktop

> **Categoria**: Command (bash script)
> **Evento**: `Notification` — se ejecuta cuando Claude genera una notificacion
> **Matcher**: `*` — captura todas las notificaciones
> **Script**: `.claude/hooks/notify.sh`

---

## Proposito

Genera notificaciones nativas del sistema operativo (macOS/Linux) cuando Claude Code emite eventos relevantes. Util para sesiones largas donde el desarrollador puede estar en otra ventana.

---

## Configuracion en settings.json

```json
{
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
  ]
}
```

---

## Script: notify.sh

Ubicacion real: `.claude/hooks/notify.sh`

```bash
#!/bin/bash
# ═══════════════════════════════════════════
# Hook: notify-desktop
# Evento: Notification
# Proposito: Alertas desktop para eventos Claude Code
# ═══════════════════════════════════════════
set -euo pipefail

# Lee el JSON de stdin (Claude Code pasa el payload asi)
input=$(cat)

# Extrae titulo y mensaje con fallbacks
title=$(echo "$input" | jq -r '.title // "Claude Code"')
message=$(echo "$input" | jq -r '.message // "Task completed"')

# ── macOS ──
if command -v osascript &> /dev/null; then
  osascript -e "display notification \"$message\" with title \"$title\" sound name \"Glass\""

# ── Linux (freedesktop) ──
elif command -v notify-send &> /dev/null; then
  notify-send "$title" "$message" --urgency=normal --expire-time=5000

# ── Windows WSL ──
elif command -v powershell.exe &> /dev/null; then
  powershell.exe -Command "[System.Reflection.Assembly]::LoadWithPartialName('System.Windows.Forms'); [System.Windows.Forms.MessageBox]::Show('$message','$title')" &>/dev/null

# ── Fallback: terminal bell ──
else
  echo -ne '\a'
fi

exit 0
```

### Dependencias

- `jq` — para parsear JSON de stdin (disponible en la mayoria de sistemas)
- `osascript` (macOS) o `notify-send` (Linux) para notificaciones nativas

### Instalacion de jq

```bash
# macOS
brew install jq

# Ubuntu/Debian
sudo apt-get install jq

# Alpine
apk add jq
```

---

## Input Format

Claude Code pasa un JSON por stdin con esta estructura:

```json
{
  "title": "Build Complete",
  "message": "All tests passed (142/142)",
  "type": "info"
}
```

| Campo     | Tipo   | Descripcion                      |
| --------- | ------ | -------------------------------- |
| `title`   | string | Titulo de la notificacion        |
| `message` | string | Cuerpo del mensaje               |
| `type`    | string | Tipo: `info`, `warning`, `error` |

---

## Testing Manual

```bash
# Test basico
echo '{"title":"Test","message":"Hello from hook"}' | bash .claude/hooks/notify.sh

# Test sin jq (debe fallar gracefully)
echo 'invalid json' | bash .claude/hooks/notify.sh

# Verificar exit code
echo '{"title":"CI","message":"Build passed"}' | bash .claude/hooks/notify.sh
echo "Exit: $?"
```

---

## Compatibilidad

| Plataforma        | Soportada | Metodo                         |
| ----------------- | --------- | ------------------------------ |
| macOS             | Si        | `osascript` (native)           |
| Linux (GNOME/KDE) | Si        | `notify-send` (freedesktop)    |
| Windows WSL       | Parcial   | `powershell.exe` (fallback)    |
| **Cursor**        | **No**    | No soporta evento Notification |
| **Gemini CLI**    | Si        | Compatible con hooks command   |

---

## Changelog

| Version | Fecha      | Cambios                                       |
| ------- | ---------- | --------------------------------------------- |
| 1.0.0   | 2026-03-07 | Script inicial — macOS + Linux + WSL fallback |
