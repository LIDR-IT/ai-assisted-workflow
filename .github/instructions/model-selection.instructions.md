---
description: Self-correct rule: auto-promote to Opus high reasoning for planning workflows, revert to Sonnet medium for implementation. The agent edits .claude/settings.json directly — never stops to ask the user.
applyTo: "**"
---

# Rule: Model Selection — Self-correct per Workflow

> **Nivel**: Rule (workflow, alwaysApply: true)
> **Carga**: SIEMPRE antes de iniciar cualquier slash command o skill que esta rule liste explícitamente
> **Propósito**: Garantizar que los workflows de planning corren con Opus high reasoning y los de implementación con Sonnet medium, sin que el usuario tenga que cambiar el modelo manualmente.


## 1. Por qué esta rule

Distintos workflows del SDLC tienen perfiles de razonamiento muy distintos:

- **Planning** (PRD, RFs, design docs, fast-forward de change): necesita razonamiento profundo, exploración de trade-offs, búsqueda de inconsistencias. → **Opus high reasoning** (`claude-opus-4-7`, effort: high)
- **Implementación** (escribir código según un tasks.md ya generado): necesita velocidad, throughput, ejecución determinista. → **Sonnet medium** (`claude-sonnet-4-6`, effort: medium)
- **Verificación / análisis cruzado** (validate-requirements, validate-prd, spec-verify): puede subir a Opus si encuentra problemas estructurales. → **Opus high** condicional

Si la sesión está en el modelo equivocado, el agente DEBE auto-corregir editando `.claude/settings.json` (vía el skill `update-config` o edición directa) — **no detenerse a preguntar al usuario**.


## 2. Mapa de modelos por workflow

### 2.1 Workflows que requieren Opus high reasoning

| Workflow / Skill / Command | Por qué Opus high |
|---|---|
| `lidr-business-case` | Razonamiento de negocio, ROI, alineación estratégica |
| `lidr-prd-tecnico` | Diseño técnico inicial — alto nivel de exploración |
| `lidr-prd-funcional` | Análisis funcional + edge cases |
| `lidr-design-doc` | Arquitectura, decisiones estructurales |
| `lidr-generate-rf` | RFs con BDD — requiere comprensión completa del PRD |
| `lidr-generate-nfr` | NFRs medibles — necesita conectar negocio ↔ medición |
| `lidr-validate-requirements` | Detección de gaps, coherencia cruzada, RTM |
| `lidr-validate-prd` | Scoring + recomendaciones |
| `lidr-user-stories` | Slicing + BDD |
| `lidr-epic-breakdown` | Descomposición de épica master |
| `lidr-test-plan` | Estrategia de testing risk-based |
| `lidr-security-checklist` | Compliance + threat modeling |
| `/lidr-spec-ff` | Fast-forward genera proposal + design + tasks + spec — planning intensivo |
| `lidr-run-parallel-tasks` | Coordinación + planning interno por sub-agente |
| `lidr-spec-orchestrator` (subagent, fase planning) | Decisiones de coordinación cross-change |

### 2.2 Workflows que vuelven a Sonnet medium

| Workflow / Skill / Command | Por qué Sonnet medium |
|---|---|
| `/lidr-spec-apply` | Implementación task-by-task según tasks.md ya generado |
| `/lidr-implement-ticket` | Implementación de un ticket existente |
| `/lidr-spec-archive` | Operación de filesystem + actualización de índices |
| `/lidr-create-branch` | Operación git determinista |
| `/lidr-create-pr` | Generación de PR description desde commits |
| `/sync-docs` | Sincronización determinista de docs |
| `/lidr-commit` | Generación de commit messages |
| Skills de generación de docs simples (release-notes, changelog) | Output estructurado, baja exploración |

### 2.3 Workflows condicionales (suben a Opus si encuentran problemas)

| Workflow / Command | Promoción a Opus high |
|---|---|
| `/lidr-spec-verify` | Si encuentra CRITICAL findings o gaps de cobertura, sube a Opus para análisis |
| `lidr-bug-report` | Si el bug es complejo o multi-componente, sube a Opus |
| `lidr-postmortem` | Análisis de root cause profundo → Opus high |


## 3. Procedimiento de self-correct

**Antes de comenzar cualquier workflow listado arriba**, la IA verifica el modelo activo:

1. Leer `.claude/settings.json` (o equivalente por plataforma)
2. Comparar el modelo activo con el modelo requerido por el workflow
3. Si NO coincide:
   - Si existe el skill `update-config`, invocarlo con `model: <required>` y `effort: <required>`
   - Si NO existe, editar `.claude/settings.json` directamente añadiendo/actualizando las claves `"model"` y (cuando aplique) `"effort"`
   - Continuar con el workflow — **no parar para pedir confirmación al usuario**
4. Cuando el workflow termina, revertir al modelo por defecto si fue una promoción temporal (Opus → Sonnet)

**Mecanismo manual de fallback** (si `update-config` no está disponible):

```bash
# Edición directa de .claude/settings.json (preserva el JSON válido)
jq '.model = "claude-opus-4-7" | .effort = "high"' .claude/settings.json > .claude/settings.json.tmp \
  && mv .claude/settings.json.tmp .claude/settings.json
```

(Equivalentes para `.cursor/`, `.gemini/settings.json`, etc., generados por `./.agents/sync.sh`.)


## 4. Frontmatter de skills — campos relacionados

Los skills LIDR pueden declarar el modelo requerido directamente en frontmatter:

```yaml
name: lidr-prd-tecnico
model: claude-opus-4-7    # Claude-only field, ignorado por otras plataformas
effort: high              # Claude-only
```

Si un skill declara `model:` o `effort:`, esta rule lo respeta y se asegura de que la sesión cumpla esos requisitos antes de la primera ejecución del skill.

**Skills críticos a anotar con `model: claude-opus-4-7` + `effort: high`** (la lista de 2.1 arriba):
- Todos los listados en §2.1 deben tener estos campos en su SKILL.md
- El sync de Claude respeta los campos; otras plataformas los ignoran sin error


## 5. Anti-patrones

- ❌ NUNCA detenerse a preguntar "¿quieres que cambie el modelo?" — la rule autoriza el cambio implícitamente
- ❌ NUNCA dejar Opus activado tras un workflow que no lo requiere (gasto innecesario de tokens)
- ❌ NUNCA cambiar de modelo sin anotar el cambio (la IA reporta en su output: "Promoted to Opus high for planning step")
- ✅ Reportar promociones y reversiones de forma breve en la respuesta al usuario
- ✅ Si el usuario explícitamente pide otro modelo, respetar su elección sobre esta rule


## 6. Coherencia con otras rules

- `lidr-sdlc/spec-execution.md` — `/lidr-spec-apply` corre Sonnet medium; `/lidr-spec-verify` puede subir a Opus si hay bloqueos
- `lidr-sdlc/workflows.md` — los commands Tier 1 (orquestadores) que invocan planning ya implican Opus
- `lidr-sdlc/org.md` §12.1 — la IA debe reportar cambios significativos en su comportamiento, incluyendo cambios de modelo


## 7. Verificación

Tras invocar un workflow planning, la IA verifica:

```bash
# Verificar modelo activo (Claude)
jq -r '.model // "default"' .claude/settings.json
jq -r '.effort // "default"' .claude/settings.json
```

Espera: `claude-opus-4-7` y `high` para workflows §2.1; `claude-sonnet-4-6` y `medium` para §2.2.


## 8. Changelog

| Versión | Fecha | Autor | Cambios |
|---|---|---|---|
| 1.0.0 | 2026-05-20 | TL: LIDR Spec Native | Creación inicial — self-correct nativo LIDR del modelo por workflow |
