---
id: hook-frontmatter-guard
version: "1.2.0"
last_updated: "2026-04-07"
updated_by: "System: drift-elimination"
status: active
type: hook
review_cycle: 90
next_review: "2026-07-06"
category: command-based
event: PreToolUse
matcher: "Write|Edit"
owner_role: "Tech Lead"
---

# Hook: frontmatter-guard

> **Categoria**: Command-based (Frontmatter Enforcement)
> **Evento**: `PreToolUse` — se ejecuta ANTES de que Claude escriba o edite un archivo .md
> **Matcher**: `Write|Edit` — solo se activa en operaciones de escritura
> **Script**: `.claude/hooks/frontmatter-guard.sh`
> **Regla asociada**: `@../../.claude/rules/documentation.md` (YAML frontmatter obligatorio)

---

## Proposito

Este hook complementa el `dtc-write-guard` (prompt-based) con **validación determinística** de frontmatter YAML. Actúa como la segunda línea de defensa para garantizar compliance de metadatos.

### Funcionalidad específica:

1. **Bloquea archivos .md nuevos** sin frontmatter YAML (violación crítica)
2. **Advierte sobre ediciones** que no actualizan `last_updated` en frontmatter existente
3. **Scope limitado** a paths críticos: `docs/`, `.claude/rules/`, `.claude/skills/`

---

## Matriz de Decisiones

| Escenario                           | Condición                                | Acción                         | Permisión | Mensaje                                                                                                           |
| ----------------------------------- | ---------------------------------------- | ------------------------------ | --------- | ----------------------------------------------------------------------------------------------------------------- |
| **Nuevo .md sin frontmatter**       | `content.startsWith('---')` = false      | `BLOCK_NO_FRONTMATTER`         | `deny`    | "Missing YAML frontmatter. ALL .md files require frontmatter with: id, version, last_updated, updated_by, status" |
| **Nuevo .md sin last_updated**      | Tiene `---` pero no `last_updated`       | `WARN_MISSING_LAST_UPDATED`    | `allow`   | "Has frontmatter but missing last_updated field"                                                                  |
| **Edit sin actualizar frontmatter** | `old_string/new_string` no toca metadata | `WARN_FRONTMATTER_NOT_UPDATED` | `allow`   | "Frontmatter (last_updated/version) not updated"                                                                  |
| **Archivo fuera de scope**          | Path no contiene monitored directories   | `SKIP`                         | `allow`   | Sin mensaje                                                                                                       |
| **No .md**                          | No termina en `.md`                      | `SKIP`                         | `allow`   | Sin mensaje                                                                                                       |

---

## Paths Monitoreados

| Directorio        | Razón                           | Nivel de enforcement |
| ----------------- | ------------------------------- | -------------------- |
| `docs/`           | Documentación del framework     | **CRÍTICO**          |
| `.claude/rules/`  | Governance del ecosistema       | **CRÍTICO**          |
| `.claude/skills/` | Skills con templates inmutables | **CRÍTICO**          |

**No monitoreados**: `src/`, archivos de proyecto específicos, markdown en general

---

## Configuracion en settings.json

```json
{
  "PreToolUse": [
    {
      "matcher": "Write|Edit",
      "hooks": [
        {
          "type": "command",
          "command": "bash .claude/hooks/frontmatter-guard.sh",
          "timeout": 10
        }
      ]
    }
  ]
}
```

---

## Comportamiento Técnico

### Input Processing

```bash
# Recibe JSON por stdin (hook spec de Claude Code):
{
  "tool_input": {
    "file_path": "docs/example.md",
    "content": "# Example\nContent without frontmatter",
    "old_string": "",
    "new_string": ""
  }
}
```

### Python Logic

- Parse JSON seguro
- Extrae `file_path`, `content`, `old_string`, `new_string`
- Determina si es CREATE (content + no old_string) vs EDIT (old_string exists)
- Valida frontmatter presence: `content.strip().startswith("---")`

### Output JSON

```json
{
  "hookSpecificOutput": {
    "hookEventName": "PreToolUse",
    "permissionDecision": "deny|allow",
    "permissionDecisionReason": "Detailed explanation"
  }
}
```

---

## Ejemplos de Uso

### Ejemplo 1: Archivo nuevo sin frontmatter (BLOCKED)

**Input**:

```markdown
# New Documentation

This is content without frontmatter.
```

**Output**:

```json
{
  "permissionDecision": "deny",
  "permissionDecisionReason": "New .md file 'docs/example.md' is missing YAML frontmatter..."
}
```

### Ejemplo 2: Edit válido (ALLOWED)

**Old**:

```yaml
---
last_updated: "2026-04-06"
---
# Content
```

**New**:

```yaml
---
last_updated: "2026-04-07"
---
# Updated Content
```

**Output**: `{"permissionDecision": "allow"}`

### Ejemplo 3: Edit sin actualizar metadatos (WARNING)

**Old/New**: Content change pero frontmatter unchanged

**Output**:

```json
{
  "permissionDecision": "allow",
  "permissionDecisionReason": "Editing 'docs/example.md' but frontmatter not updated"
}
```

---

## Relacion con Otros Hooks

```
dtc-write-guard (prompt-based)        ← Validación semántica DTC
        ↓
frontmatter-guard (command-based)     ← ESTE: Validación técnica YAML
        ↓
    [Write operation proceeds]
        ↓
dtc-session-check (Stop)              ← Verificación global final
```

**División de responsabilidades**:

- **dtc-write-guard**: Valida impacto DTC, secrets, paths de sistema
- **frontmatter-guard**: Valida estructura YAML y metadatos
- **dtc-session-check**: Verifica sincronización de fuentes de verdad

---

## Debugging

### Test manual del script:

```bash
echo '{"tool_input":{"file_path":"docs/test.md","content":"# Test"}}' | \
  bash .claude/hooks/frontmatter-guard.sh
```

### Logs de ejecución:

```bash
# En sesión activa de Claude Code:
/hooks
```

### Validation manual de paths:

```bash
# Verificar que paths están en scope:
python3 -c "
paths = ['docs/example.md', '.claude/rules/test.md', 'src/code.md']
monitored = ['docs/', '.claude/rules/', '.claude/skills/']
for p in paths:
    in_scope = any(m in p for m in monitored)
    print(f'{p}: {in_scope}')
"
```

---

## Changelog

| Version | Fecha      | Cambios                                                  |
| ------- | ---------- | -------------------------------------------------------- |
| 1.2.0   | 2026-03-25 | Enhanced last_updated detection, improved error messages |
| 1.1.0   | 2026-03-20 | Added WARN_FRONTMATTER_NOT_UPDATED for edits             |
| 1.0.0   | 2026-03-15 | Initial implementation — YAML frontmatter enforcement    |
