---
id: hook-dtc-write-guard
version: '1.1.0'
last_updated: '2026-03-25'
updated_by: 'TL: Lead Engineer'
status: active
type: hook
review_cycle: 90
next_review: '2026-06-23'
category: prompt-based
event: PreToolUse
matcher: 'Write|Edit'
owner_role: 'Tech Lead'
---

# Hook: dtc-write-guard

> **Categoria**: Prompt-based (DTC Enforcement)
> **Evento**: `PreToolUse` — se ejecuta ANTES de que Claude escriba o edite un archivo
> **Matcher**: `Write|Edit` — solo se activa en operaciones de escritura
> **Regla asociada**: `@../../.claude/rules/documentation.md` (DTC — Docs Travel With Code)

---

## Proposito

Este hook es el **primer eslabon** de la cadena DTC. Intercepta cada operacion de escritura y:

1. **Evalua impacto documental** — si el archivo cambiado deberia disparar actualizacion de docs
2. **Detecta secrets hardcoded** — API keys, passwords, tokens en el contenido
3. **Valida paths** — evita escritura en directorios protegidos o path traversal
4. **Verifica frontmatter en .md nuevos** — si se crea un `.md` en `docs/`, `.claude/rules/`, o `.claude/skills/`, verifica que incluya YAML frontmatter (`---` block). Solo WARN, no bloquea

---

## Matriz de Impacto DTC

El hook usa esta matriz para determinar que docs pueden necesitar actualizacion:

| Si cambias...                      | Deberias actualizar...                         |
| ---------------------------------- | ---------------------------------------------- |
| Esquema DB / migraciones           | `docs/templates/db-schema.md`                  |
| Rutas API / endpoints              | `docs/templates/specs/routes.md`               |
| Componentes UI principales         | `docs/templates/specs/components.md`           |
| Nuevas dependencias (package.json) | `docs/templates/architecture.md`               |
| CI/CD pipelines                    | `docs/templates/deployment.md`                 |
| Skills / commands / rules nuevos   | `CLAUDE.md` + `HelpCenter.tsx` + 6 fuentes mas |
| Storage / uploads / CDN            | `docs/templates/specs/storage.md`              |

---

## Configuracion en settings.json

```json
{
  "PreToolUse": [
    {
      "matcher": "Write|Edit",
      "hooks": [
        {
          "type": "prompt",
          "prompt": "Analyze this file write operation. Check:\n1) If writing to source code files (.ts, .tsx, .sql, schema, API routes, CI/CD configs), identify which documentation files should also be updated per the DTC (Docs Travel With Code) rule. Impact matrix:\n   - DB changes → db-schema.md\n   - API changes → specs/routes.md\n   - UI component changes → specs/components.md\n   - New dependencies → architecture.md\n   - CI/CD changes → deployment.md\n   - Ecosystem artifacts (skills/commands/rules/hooks) → CLAUDE.md + HelpCenter.tsx + SitemapView.tsx + IntegrityTests.tsx + audit-catalog.md + Guidelines.md + help.md + org.md\n2) Check content for hardcoded secrets (API keys, passwords, tokens, private keys). Patterns: 'sk-', 'pk_', 'AKIA', 'ghp_', 'Bearer ', base64 long strings, 'password=', 'secret=', private key headers.\n3) Verify path is not a system directory (/etc, /usr, /var) and has no path traversal (..).\n4) FRONTMATTER CHECK: If this is a .md file being CREATED (not edited) inside docs/, .claude/rules/, or .claude/skills/, verify that the content starts with YAML frontmatter (a '---' block at the very top). If the new .md file lacks frontmatter, include this warning in the systemMessage: 'New .md file missing YAML frontmatter. Per rules/documentation.md, all .md files require frontmatter with at minimum: id, version, last_updated, updated_by, status.' This is a WARN only — do NOT deny.\n\nReturn:\n- 'deny' with reason if secrets detected or path invalid\n- 'approve' with systemMessage listing docs that may need updating if DTC impact detected, and/or frontmatter warning if applicable\n- 'approve' silently if no impact",
          "timeout": 15
        }
      ]
    }
  ]
}
```

---

## Comportamiento

| Resultado                   | Cuando                                    | Efecto                                                    |
| --------------------------- | ----------------------------------------- | --------------------------------------------------------- |
| `approve` (silencioso)      | Archivo sin impacto documental ni secrets | Claude escribe normalmente                                |
| `approve` + `systemMessage` | Archivo con impacto DTC                   | Claude recibe recordatorio de que docs deben actualizarse |
| `approve` + `systemMessage` | Nuevo `.md` sin frontmatter YAML          | Claude recibe WARN de frontmatter faltante (no bloquea)   |
| `deny`                      | Secrets detectados o path invalido        | **Bloquea la escritura** — Claude debe corregir           |

---

## Ejemplos

### Ejemplo 1: Escritura normal (approve silencioso)

```
Tool: Write
File: /src/utils/formatCurrency.ts
Content: export function formatCurrency(amount: number) { ... }
→ APPROVE (no DTC impact, no secrets)
```

### Ejemplo 2: Cambio de API (approve con reminder)

```
Tool: Write
File: /src/routes/api/users.ts
Content: router.post('/users/bulk-import', ...)
→ APPROVE + systemMessage: "DTC: update docs/templates/specs/routes.md with new POST /users/bulk-import endpoint"
```

### Ejemplo 3: Secret detectado (deny)

```
Tool: Write
File: /src/config/api.ts
Content: const API_KEY = "sk-proj-abc123..."
→ DENY: "Hardcoded secret detected (pattern: sk-). Use environment variable or Vault reference instead."
```

### Ejemplo 4: Nuevo .md sin frontmatter (approve con warn)

```
Tool: Write
File: /docs/projects/sdlc-{{CLIENT_CODE}}/new-guide.md
Content: # New Guide\n\nThis guide explains...
→ APPROVE + systemMessage: "New .md file missing YAML frontmatter. Per rules/documentation.md, all .md files require frontmatter with at minimum: id, version, last_updated, updated_by, status."
```

---

## Relacion con Otros Hooks

```
dtc-write-guard (PreToolUse)     ← ESTE: intercepta escrituras individuales
        ↓
    ... sesion de trabajo ...
        ↓
dtc-session-check (Stop)          ← Verifica que TODO se sincronizo al final
```

Los dos hooks DTC trabajan en tandem: el write-guard da **feedback inmediato** por archivo, el session-check hace **verificacion global** al cerrar.

---

## Changelog

| Version | Fecha      | Cambios                                                                                             |
| ------- | ---------- | --------------------------------------------------------------------------------------------------- |
| 1.1.0   | 2026-03-25 | Added frontmatter presence check (WARN) for new .md files in docs/, .claude/rules/, .claude/skills/ |
| 1.0.0   | 2026-03-07 | Version inicial — prompt completo con matriz DTC + secrets detection                                |
