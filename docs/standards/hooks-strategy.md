---
id: hooks-strategy
version: "1.0.0"
last_updated: "2026-03-07"
updated_by: "TL: Lead Engineer"
status: active
type: standard
review_cycle: 90
next_review: "2026-06-05"
owner_role: "Tech Lead"
---

# Estrategia de Hooks — Claude Code + Git (Husky)

> **Proposito**: Mapa completo de automatizaciones event-driven del ecosistema SDLC {{CLIENT_NAME}}. Define QUE hooks existen, DONDE se ejecutan, y POR QUE.
> **Principio**: Dos capas complementarias que no se solapan — Claude Code hooks (capa IA) + Git hooks (capa CI/developer machine).

---

## Arquitectura de 2 Capas

```
┌──────────────────────────────────────────────────────────────┐
│                    CAPA 1: CLAUDE CODE HOOKS                  │
│            (IA razona sobre contexto semantico)               │
│                                                               │
│  PreToolUse ──► dtc-write-guard    (DTC + secrets)           │
│  Stop ────────► dtc-session-check  (sincronizacion 8 SoT)   │
│  Notification ► notify-desktop     (alertas desktop)         │
│  SessionStart ► context-loader     (contexto proyecto)       │
│                                                               │
│  ✅ Analisis semantico, reglas de negocio, DTC enforcement   │
│  ❌ NO validan sintaxis, formato, o convenciones mecanicas   │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│                  CAPA 2: GIT HOOKS (HUSKY)                    │
│          (scripts deterministas, rapidos, bloqueantes)         │
│                                                               │
│  pre-commit ──► lint + format + type-check                   │
│  commit-msg ──► conventional commits validation              │
│  pre-push ────► tests + branch naming                        │
│  post-merge ──► auto-install deps                            │
│                                                               │
│  ✅ Validaciones mecanicas, rapidas, reproducibles            │
│  ❌ NO entienden contexto de negocio ni reglas DTC           │
└──────────────────────────────────────────────────────────────┘
```

**Regla de diseno**: Si la validacion puede resolverse con un regex/linter → Git hook. Si requiere razonamiento sobre contexto → Claude Code hook.

---

## CAPA 1: Claude Code Hooks (4 activos)

### Resumen

| #   | Hook              | Evento                  | Tipo    | Estado                                                 | Doc                             |
| --- | ----------------- | ----------------------- | ------- | ------------------------------------------------------ | ------------------------------- |
| 1   | dtc-write-guard   | PreToolUse: Write\|Edit | prompt  | ✅ IMPLEMENTADO — settings.json + prompt completo      | docs/hooks/dtc-write-guard.md   |
| 2   | dtc-session-check | Stop                    | prompt  | ✅ IMPLEMENTADO — settings.json + prompt completo      | docs/hooks/dtc-session-check.md |
| 3   | notify-desktop    | Notification            | command | ✅ IMPLEMENTADO — .claude/hooks/notify.sh creado       | docs/hooks/notify-desktop.md    |
| 4   | context-loader    | SessionStart            | command | ✅ IMPLEMENTADO — .claude/hooks/load-context.sh creado | docs/hooks/context-loader.md    |

> **Nota sobre carga de contexto**: Desde ADR-0001 (`docs/adr/ADR-0001-context-loading-strategy.md`), las rules adoptan un modelo "lean" donde NO cargan docs via `@`. Solo las rules Tier 1 (org, project, documentation) se cargan siempre, y las Tier 2 (tech-stack, workflows) se cargan bajo demanda. Los hooks como `dtc-write-guard` y `dtc-session-check` son ahora los principales responsables de cargar checklists criticos (DoD, DTC) via `@` en sus prompts, ya que las rules no los pre-cargan. El hook `context-loader` sigue cargando variables de entorno del proyecto (PROJECT_TYPE, DTC_ACTIVE) pero no carga documentos de `docs/`.

### Eventos NO usados y justificacion

| Evento           | Estado      | Justificacion                                                                 |
| ---------------- | ----------- | ----------------------------------------------------------------------------- |
| PostToolUse      | ❌ No usado | No hay caso de uso que no cubran los Git hooks o dtc-write-guard              |
| SubagentStop     | ❌ No usado | No usamos subagentes actualmente                                              |
| UserPromptSubmit | ❌ No usado | La deteccion de rol se hace por contexto en rules, no por interceptar prompts |
| SessionEnd       | ❌ No usado | dtc-session-check (Stop) ya cubre el cierre; SessionEnd no permite bloquear   |
| PreCompact       | ⏳ Futuro   | Podria salvar resumen de estado antes de compactar contexto largo             |

### Eventos candidatos para expansion futura

| Evento                            | Caso de uso potencial                                                                 | Prioridad | Cuando activar                                                                 |
| --------------------------------- | ------------------------------------------------------------------------------------- | --------- | ------------------------------------------------------------------------------ |
| **PreCompact**                    | Guardar resumen de artefactos modificados en la sesion antes de perder contexto largo | Media     | Cuando las sesiones sean consistentemente largas (>50 tool uses)               |
| **PostToolUse: Bash(git commit)** | Verificar que el commit message sigue conventional commits despues de un `git commit` | Baja      | Solo si Husky commit-msg no esta activo (redundante si Husky esta configurado) |

---

## CAPA 2: Git Hooks (Husky) — 4 recomendados

### Dependencias a instalar

```bash
# Instalar Husky + herramientas
npm install --save-dev husky lint-staged @commitlint/cli @commitlint/config-conventional

# Inicializar Husky
npx husky init
```

### Configuracion package.json

```json
{
  "scripts": {
    "prepare": "husky"
  },
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix --max-warnings 0", "prettier --write"],
    "*.{json,md,css}": ["prettier --write"]
  }
}
```

### commitlint.config.js

```javascript
export default {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [
      2,
      "always",
      [
        "feat",
        "fix",
        "docs",
        "refactor",
        "test",
        "chore",
        "style",
        "perf",
        "ci",
        "build",
        "revert",
      ],
    ],
    "scope-case": [2, "always", "kebab-case"],
    "subject-max-length": [2, "always", 100],
    "body-max-line-length": [2, "always", 200],
  },
};
```

---

### Hook 1: pre-commit

**Archivo**: `.husky/pre-commit`

```bash
#!/bin/sh
# ═══════════════════════════════════════════
# Git Hook: pre-commit
# Proposito: Lint + format + type-check en staged files
# Referencia: DoD DD-09 (lint/format clean), DD-12 (no console.log)
# ═══════════════════════════════════════════

# lint-staged ejecuta ESLint + Prettier solo en archivos staged
npx lint-staged

# TypeScript type-check (todo el proyecto, no solo staged)
npx tsc --noEmit --pretty 2>&1 | head -50
if [ ${PIPESTATUS[0]} -ne 0 ]; then
  echo "❌ TypeScript errors detected. Fix before committing."
  exit 1
fi

# Verificar console.log en archivos staged (excepto en utils/logger)
CONSOLE_FILES=$(git diff --cached --name-only --diff-filter=ACM | \
  grep -E '\.(ts|tsx)$' | \
  grep -v 'utils/logger' | \
  xargs grep -l 'console\.\(log\|debug\)' 2>/dev/null || true)

if [ -n "$CONSOLE_FILES" ]; then
  echo "⚠️  WARNING: console.log/debug found in staged files:"
  echo "$CONSOLE_FILES"
  echo "Remove or replace with logger utility. (DoD DD-12)"
  # WARN, no BLOCK — para no romper flow de desarrollo
fi

# Verificar TODOs sin ticket
TODO_FILES=$(git diff --cached --name-only --diff-filter=ACM | \
  grep -E '\.(ts|tsx)$' | \
  xargs grep -n 'TODO\b' 2>/dev/null | \
  grep -v 'TODO \[' || true)

if [ -n "$TODO_FILES" ]; then
  echo "⚠️  WARNING: TODOs without ticket reference found:"
  echo "$TODO_FILES"
  echo "Format: // TODO [PROJ-123]: description (DoD DD-11)"
fi
```

**Criterios DoD cubiertos**: DD-09 (lint/format), DD-11 (TODOs), DD-12 (console.log)

---

### Hook 2: commit-msg

**Archivo**: `.husky/commit-msg`

```bash
#!/bin/sh
# ═══════════════════════════════════════════
# Git Hook: commit-msg
# Proposito: Validar Conventional Commits
# Referencia: Guidelines.md §2.5 Git, tech-stack.md §8.3
# ═══════════════════════════════════════════

npx --no -- commitlint --edit "$1"
```

**Convenciones validadas**:

- Formato: `type(scope): description` (ej: `feat(auth): add domain-specific login`)
- Types permitidos: feat, fix, docs, refactor, test, chore, style, perf, ci, build, revert
- Subject max 100 chars, body max 200 chars/linea

---

### Hook 3: pre-push

**Archivo**: `.husky/pre-push`

```bash
#!/bin/sh
# ═══════════════════════════════════════════
# Git Hook: pre-push
# Proposito: Tests + branch naming convention
# Referencia: DoD DD-07 (tests pass), Guidelines.md §2.5 Git
# ═══════════════════════════════════════════

# 1. Verificar nombre de branch
BRANCH=$(git symbolic-ref --short HEAD 2>/dev/null)
VALID_PATTERN="^(main|develop|feature\/[A-Z]+-[0-9]+-[a-z0-9-]+|release\/v[0-9]+\.[0-9]+\.[0-9]+|hotfix\/[A-Z]+-[0-9]+-[a-z0-9-]+)$"

if ! echo "$BRANCH" | grep -qE "$VALID_PATTERN"; then
  echo "❌ Branch name '$BRANCH' does not follow convention."
  echo "   Expected: feature/PROJ-123-description, release/vX.Y.Z, or hotfix/PROJ-123-description"
  echo "   (Guidelines.md §2.4 Naming)"
  exit 1
fi

# 2. Ejecutar tests
echo "Running tests before push..."
npm test -- --passWithNoTests 2>&1
if [ $? -ne 0 ]; then
  echo "❌ Tests failed. Fix before pushing. (DoD DD-07)"
  exit 1
fi

echo "✅ Pre-push checks passed."
```

**Criterios DoD cubiertos**: DD-07 (tests pass)  
**Convenciones validadas**: Branch naming (Git Flow)

---

### Hook 4: post-merge

**Archivo**: `.husky/post-merge`

```bash
#!/bin/sh
# ═══════════════════════════════════════════
# Git Hook: post-merge
# Proposito: Auto-install deps si package.json cambio
# Referencia: DX (Developer Experience)
# ═══════════════════════════════════════════

# Detectar si package.json cambio en el merge
CHANGED_FILES=$(git diff-tree -r --name-only --no-commit-id ORIG_HEAD HEAD 2>/dev/null)

if echo "$CHANGED_FILES" | grep -q "package.json"; then
  echo "📦 package.json changed — running npm install..."
  npm install
fi

if echo "$CHANGED_FILES" | grep -q "package-lock.json\|pnpm-lock.yaml"; then
  echo "📦 Lock file changed — running npm ci..."
  npm ci
fi
```

---

## Mapa: Gaps del Workflow → Hooks que los cubren

| Gap identificado                                   | Fuente del gap                   | Hook que lo cubre                                                 | Capa        |
| -------------------------------------------------- | -------------------------------- | ----------------------------------------------------------------- | ----------- |
| Lint/format no validado antes de commit            | DoD DD-09                        | **pre-commit** (Husky + lint-staged)                              | Git         |
| console.log en codigo de produccion                | DoD DD-12                        | **pre-commit** (grep check)                                       | Git         |
| TODOs sin ticket Jira                              | DoD DD-11                        | **pre-commit** (grep check)                                       | Git         |
| Conventional Commits no enforced                   | Guidelines §2.5, tech-stack §8.3 | **commit-msg** (commitlint)                                       | Git         |
| Branch naming no validado                          | Guidelines §2.4                  | **pre-push** (regex check)                                        | Git         |
| Tests no ejecutados antes de push                  | DoD DD-07                        | **pre-push** (npm test)                                           | Git         |
| Deps desactualizadas tras merge                    | DX improvement                   | **post-merge** (auto npm install)                                 | Git         |
| DTC no evaluado al escribir                        | documentation.md DTC chain       | **dtc-write-guard** (PreToolUse)                                  | Claude Code |
| 8 SoT no sincronizadas                             | DTC chain eslabon 3              | **dtc-session-check** (Stop)                                      | Claude Code |
| Docs criticos no pre-cargados por rules (ADR-0001) | Rules lean strategy              | **dtc-write-guard** + **skills** cargan docs via `@` bajo demanda | Claude Code |
| Sin alertas desktop en sesiones largas             | DX improvement                   | **notify-desktop** (Notification)                                 | Claude Code |
| Sin contexto automatico al inicio                  | DX improvement                   | **context-loader** (SessionStart)                                 | Claude Code |
| Secrets hardcoded en codigo                        | DoD DD-13, Security §3.1         | **dtc-write-guard** (secrets detection)                           | Claude Code |

---

## Lo que NO necesita hook

| Proceso                       | Por que no                      | Como se cubre                       |
| ----------------------------- | ------------------------------- | ----------------------------------- |
| SAST/SCA (DD-08)              | Demasiado lento para hook local | CI pipeline (GitHub Actions)        |
| Build verification (DD-10)    | Demasiado lento para pre-commit | CI pipeline                         |
| PR description (DD-02, DD-18) | Requiere diff completo          | Skill pr-description (bajo demanda) |
| Code review (DD-03, DD-04)    | Requiere juicio humano          | GitHub PR review process            |
| Security compliance checklist | Requiere analisis profundo      | Skill security-checklist (manual)   |
| Post-deploy verification      | Requiere acceso a produccion    | DevOps manual + /advance-gate 7     |
| Handoff dev→QA (DD-24)        | Requiere contexto de ticket     | Skill dev-handoff-qa                |

---

## Prioridad de Implementacion

### Fase 1 — Inmediata (impacto alto, esfuerzo bajo)

| Hook                     | Tipo      | Esfuerzo | Impacto                             |
| ------------------------ | --------- | -------- | ----------------------------------- |
| pre-commit (lint-staged) | Git/Husky | 30 min   | Alto — elimina PRs con lint errors  |
| commit-msg (commitlint)  | Git/Husky | 15 min   | Alto — enforce conventional commits |

### Fase 2 — Corto plazo (siguiente sprint)

| Hook                           | Tipo      | Esfuerzo | Impacto                       |
| ------------------------------ | --------- | -------- | ----------------------------- |
| pre-push (tests + branch name) | Git/Husky | 30 min   | Medio — previene pushes rotos |
| post-merge (auto-install)      | Git/Husky | 10 min   | Medio — mejora DX             |

### Fase 3 — Ya implementados (Claude Code)

| Hook              | Estado                                                 | Doc                             |
| ----------------- | ------------------------------------------------------ | ------------------------------- |
| dtc-write-guard   | ✅ IMPLEMENTADO — settings.json + prompt completo      | docs/hooks/dtc-write-guard.md   |
| dtc-session-check | ✅ IMPLEMENTADO — settings.json + prompt completo      | docs/hooks/dtc-session-check.md |
| notify-desktop    | ✅ IMPLEMENTADO — .claude/hooks/notify.sh creado       | docs/hooks/notify-desktop.md    |
| context-loader    | ✅ IMPLEMENTADO — .claude/hooks/load-context.sh creado | docs/hooks/context-loader.md    |

### Fase 4 — Futuro (cuando haya evidencia de necesidad)

| Hook                      | Tipo        | Trigger                                       |
| ------------------------- | ----------- | --------------------------------------------- |
| PreCompact (save context) | Claude Code | Cuando sesiones >50 tool uses sean frecuentes |

---

## Relacion con settings.json

```
.claude/
  settings.json          ← 4 Claude Code hooks (PreToolUse, Stop, Notification, SessionStart)
  hooks/
    notify.sh            ← Script para notify-desktop
    load-context.sh      ← Script para context-loader

.husky/
  pre-commit             ← lint-staged + type-check + console.log + TODOs
  commit-msg             ← commitlint (conventional commits)
  pre-push               ← tests + branch naming
  post-merge             ← auto npm install

commitlint.config.js     ← Config de conventional commits
```

---

## Changelog

| Version | Fecha      | Cambios                                                                                                   |
| ------- | ---------- | --------------------------------------------------------------------------------------------------------- |
| 1.0.0   | 2026-03-07 | Documento inicial — arquitectura 2 capas, 4 Claude Code + 4 Git hooks                                     |
| 1.1.0   | 2026-03-09 | Nota sobre estrategia lean rules (ADR-0001): hooks asumen responsabilidad de cargar docs criticos via `@` |
