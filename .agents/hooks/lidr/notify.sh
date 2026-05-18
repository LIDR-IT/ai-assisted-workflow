#!/bin/bash
# ═══════════════════════════════════════════════════════════════
# Hook: notify-desktop
# Evento: Notification (Claude Code)
# Proposito: Alertas desktop nativas para eventos Claude Code
# Doc: docs/hooks/notify-desktop.md
# ═══════════════════════════════════════════════════════════════
set -euo pipefail

# Lee el JSON de stdin (Claude Code pasa el payload asi)
input=$(cat)

# Extrae titulo y mensaje con fallbacks
# Si jq no esta disponible, usa defaults
if command -v jq &> /dev/null; then
  title=$(echo "$input" | jq -r '.title // "Claude Code"' 2>/dev/null || echo "Claude Code")
  message=$(echo "$input" | jq -r '.message // "Task completed"' 2>/dev/null || echo "Task completed")
else
  title="Claude Code"
  message="Task completed"
fi

# ── macOS (osascript) ──
if command -v osascript &> /dev/null; then
  osascript -e "display notification \"$message\" with title \"$title\" sound name \"Glass\"" 2>/dev/null || true

# ── Linux (freedesktop: notify-send) ──
elif command -v notify-send &> /dev/null; then
  notify-send "$title" "$message" --urgency=normal --expire-time=5000 2>/dev/null || true

# ── Windows WSL (powershell) ──
elif command -v powershell.exe &> /dev/null; then
  powershell.exe -Command "[void][System.Reflection.Assembly]::LoadWithPartialName('System.Windows.Forms'); [System.Windows.Forms.MessageBox]::Show('$message','$title')" &>/dev/null || true

# ── Fallback: terminal bell ──
else
  echo -ne '\a'
fi

exit 0
