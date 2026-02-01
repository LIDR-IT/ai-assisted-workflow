# TODO

## Frontend

- [ ] Crear frontend con detección MDX
- [ ] Implementar i18n (ES/EN)
- [ ] Sintetizar toda la documentación en MDX

## Commands & Skills

- [x] Agregar comando `/commit` para git commits
- [ ] Agregar skill para gestión de commits
- [ ] Crear SETUP_SUBAGENTS.md

## Subagents

- [ ] Setup funcional de subagents (actualmente no funciona)
- [ ] Documentar cómo crear subagents
- [ ] Ejemplos de subagents working

## Rules Migration

- [ ] Migrar `docs/guidelines/` a `.agents/rules/`
  - [ ] copywriting-guidelines.md → .agents/rules/content/copywriting.md
  - [ ] react-native-guidelines.md → .agents/rules/frameworks/react-native.md
  - [ ] web-design-guidelines.md → .agents/rules/design/web-design.md
  - [ ] team-conventions/ → .agents/rules/team/

## Hooks Automation

- [ ] Implementar auto-format con Prettier (PostToolUse hook)
- [ ] Crear script de protección de archivos sensibles (PreToolUse hook)
  - [ ] Bloquear edits a `.env`, `package-lock.json`, `.git/`
  - [ ] Script en `.claude/hooks/protect-files.sh`
- [ ] Configurar re-injection de contexto después de compaction (SessionStart hook)
- [ ] Setup notificaciones desktop cuando Claude necesite input (Notification hook)
  - [ ] macOS: osascript
  - [ ] Linux: notify-send
- [ ] Agregar logging de comandos Bash ejecutados (PostToolUse hook)
- [ ] Implementar validación de tests antes de Stop (agent-based hook)
- [ ] Documentar hooks en `.claude/hooks/README.md`



