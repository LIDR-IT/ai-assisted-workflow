---
id: hook-context-loader
version: '1.0.0'
last_updated: '2026-03-07'
updated_by: 'TL: Lead Engineer'
status: active
type: hook
review_cycle: 90
next_review: '2026-06-05'
category: command
event: SessionStart
matcher: '*'
script: '.claude/hooks/load-context.sh'
owner_role: 'Tech Lead'
---

# Hook: context-loader

> **Categoria**: Command (bash script)
> **Evento**: `SessionStart` — se ejecuta al INICIAR una sesion de Claude Code
> **Matcher**: `*` — se activa siempre
> **Script**: `.claude/hooks/load-context.sh`

---

## Proposito

Detecta automaticamente el tipo de proyecto y carga variables de entorno que persisten durante toda la sesion via `$CLAUDE_ENV_FILE`. Esto permite que Claude tenga contexto inmediato sin necesidad de leer archivos al inicio.

---

## Configuracion en settings.json

```json
{
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

## Script: load-context.sh

Ubicacion real: `.claude/hooks/load-context.sh`

```bash
#!/bin/bash
# ═══════════════════════════════════════════
# Hook: context-loader
# Evento: SessionStart
# Proposito: Carga contexto del proyecto al iniciar sesion
# ═══════════════════════════════════════════
set -euo pipefail

cd "$CLAUDE_PROJECT_DIR" || exit 1

echo "Loading {{CLIENT_NAME}} SDLC context..."

# ── 1. Detectar tipo de proyecto ──
if [ -f "package.json" ]; then
  echo "export PROJECT_TYPE=nodejs" >> "$CLAUDE_ENV_FILE"

  # Detectar TypeScript
  if [ -f "tsconfig.json" ]; then
    echo "export USES_TYPESCRIPT=true" >> "$CLAUDE_ENV_FILE"
  fi

  # Detectar framework
  if grep -q '"react"' package.json 2>/dev/null; then
    echo "export FRAMEWORK=react" >> "$CLAUDE_ENV_FILE"
  elif grep -q '"next"' package.json 2>/dev/null; then
    echo "export FRAMEWORK=nextjs" >> "$CLAUDE_ENV_FILE"
  fi

elif [ -f "requirements.txt" ] || [ -f "pyproject.toml" ]; then
  echo "export PROJECT_TYPE=python" >> "$CLAUDE_ENV_FILE"

elif [ -f "go.mod" ]; then
  echo "export PROJECT_TYPE=go" >> "$CLAUDE_ENV_FILE"

elif [ -f "Cargo.toml" ]; then
  echo "export PROJECT_TYPE=rust" >> "$CLAUDE_ENV_FILE"
fi

# ── 2. DTC status ──
if [ -f "rules/documentation.md" ]; then
  echo "export DTC_ACTIVE=true" >> "$CLAUDE_ENV_FILE"
else
  echo "export DTC_ACTIVE=false" >> "$CLAUDE_ENV_FILE"
fi

# ── 3. Contar docs stale (last_updated > 90 dias) ──
stale_count=0
if command -v find &> /dev/null; then
  stale_count=$(find docs/ rules/ -name "*.md" -mtime +90 2>/dev/null | wc -l | tr -d ' ')
fi
echo "export STALE_DOCS_COUNT=$stale_count" >> "$CLAUDE_ENV_FILE"

# ── 4. Detectar integridad ──
if [ -f "src/app/components/diagrams/IntegrityTests.tsx" ]; then
  echo "export HAS_INTEGRITY_TESTS=true" >> "$CLAUDE_ENV_FILE"
fi

# ── 5. Contar artefactos del ecosistema ──
skill_count=0
command_count=0
rule_count=0

if [ -d "skills" ]; then
  skill_count=$(find skills/ -name "SKILL.md" -type f 2>/dev/null | wc -l | tr -d ' ')
fi
if [ -d "commands" ]; then
  command_count=$(find commands/ -name "*.md" -type f 2>/dev/null | wc -l | tr -d ' ')
fi
if [ -d "rules" ]; then
  rule_count=$(find rules/ -name "*.md" -type f 2>/dev/null | wc -l | tr -d ' ')
fi

echo "export ECOSYSTEM_SKILLS=$skill_count" >> "$CLAUDE_ENV_FILE"
echo "export ECOSYSTEM_COMMANDS=$command_count" >> "$CLAUDE_ENV_FILE"
echo "export ECOSYSTEM_RULES=$rule_count" >> "$CLAUDE_ENV_FILE"

# ── Output summary ──
echo "Context loaded successfully:"
echo "  PROJECT_TYPE=$(grep PROJECT_TYPE "$CLAUDE_ENV_FILE" 2>/dev/null | tail -1 | cut -d= -f2)"
echo "  DTC_ACTIVE=true"
echo "  STALE_DOCS=$stale_count"
echo "  Skills=$skill_count, Commands=$command_count, Rules=$rule_count"

exit 0
```

---

## Variables Exportadas

| Variable              | Tipo   | Ejemplo  | Descripcion                            |
| --------------------- | ------ | -------- | -------------------------------------- |
| `PROJECT_TYPE`        | string | `nodejs` | Tipo de proyecto detectado             |
| `USES_TYPESCRIPT`     | bool   | `true`   | Si tiene tsconfig.json                 |
| `FRAMEWORK`           | string | `react`  | Framework detectado                    |
| `DTC_ACTIVE`          | bool   | `true`   | Si la regla DTC esta activa            |
| `STALE_DOCS_COUNT`    | number | `3`      | Docs con mas de 90 dias sin actualizar |
| `HAS_INTEGRITY_TESTS` | bool   | `true`   | Si existe IntegrityTests.tsx           |
| `ECOSYSTEM_SKILLS`    | number | `38`     | Skills SKILL.md encontrados            |
| `ECOSYSTEM_COMMANDS`  | number | `12`     | Commands .md encontrados               |
| `ECOSYSTEM_RULES`     | number | `5`      | Rules .md encontrados                  |

---

## Como Claude Usa el Contexto

Una vez cargadas, las variables estan disponibles durante toda la sesion. Claude puede:

```
Si $DTC_ACTIVE == true:
  → Aplicar regla DTC automaticamente
  → Recordar sincronizar fuentes de verdad

Si $STALE_DOCS_COUNT > 0:
  → Avisar al usuario de docs que necesitan review

Si $PROJECT_TYPE == "nodejs" && $USES_TYPESCRIPT == true:
  → Aplicar convenciones TypeScript strict del ecosistema
```

---

## Testing Manual

```bash
# Simular SessionStart
export CLAUDE_PROJECT_DIR=$(pwd)
export CLAUDE_ENV_FILE=$(mktemp)
bash .claude/hooks/load-context.sh

# Ver variables cargadas
cat "$CLAUDE_ENV_FILE"

# Cleanup
rm "$CLAUDE_ENV_FILE"
```

---

## Compatibilidad

| Plataforma     | Soportada | Notas                          |
| -------------- | --------- | ------------------------------ |
| Claude Code    | Si        | Soporte nativo SessionStart    |
| **Cursor**     | **No**    | No soporta evento SessionStart |
| **Gemini CLI** | Si        | Compatible via hooks command   |

---

## Changelog

| Version | Fecha      | Cambios                                                         |
| ------- | ---------- | --------------------------------------------------------------- |
| 1.0.0   | 2026-03-07 | Script inicial — deteccion proyecto + DTC + staleness + conteos |
