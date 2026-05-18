---
id: hook-validate-ecosystem-counts
version: '1.0.0'
last_updated: '2026-04-07'
updated_by: 'System: drift-elimination'
status: active
type: hook
review_cycle: 90
next_review: '2026-07-06'
category: command-based
event: Stop
matcher: '*'
owner_role: 'Tech Lead'
---

# Hook: validate-ecosystem-counts

> **Categoria**: Command-based (Ecosystem Validation)
> **Evento**: `Stop` — se ejecuta cuando Claude quiere terminar la sesión
> **Matcher**: `*` — se activa en todas las sesiones
> **Script**: `.claude/hooks/validate-ecosystem-counts.sh`
> **Reemplaza**: Hook prompt-based Stop que falló por limitaciones de transcript access

---

## Proposito

Este hook proporciona **validación determinística final** del ecosistema antes de cerrar la sesión. Actúa como el **último checkpoint** para detectar drift entre filesystem reality y tracked counts.

### Validaciones críticas:

1. **Count Verification**: Skills, Commands, Rules, Agents, Hooks vs CLAUDE.md
2. **Domain Compliance**: Detecta residuos BMAD y skills no domain-agnostic
3. **Staleness Check**: Docs > 90 días sin actualizar
4. **Exit Code**: 0=healthy, 1=drift detected (puede bloquear workflows)

---

## Arquitectura de Validación

### Filesystem Scanning

```bash
ACTUAL_SKILLS=$(find ".claude/skills" -name "SKILL.md" | wc -l)
ACTUAL_COMMANDS=$(find ".claude/commands" -name "*.md" | wc -l)
ACTUAL_RULES=$(find ".claude/rules" -name "*.md" | wc -l)
ACTUAL_AGENTS=$(find ".claude/agents" -name "*.md" | wc -l)
ACTUAL_HOOKS=$(find ".claude/hooks" -name "*.sh" | wc -l)
```

### CLAUDE.md Parsing

```bash
EXPECTED_SKILLS=$(grep 'Skills |' .claude/CLAUDE.md | sed 's/.*Skills | *\([0-9]*\).*/\1/')
EXPECTED_COMMANDS=$(grep 'Commands |' .claude/CLAUDE.md | sed 's/.*Commands | *\([0-9]*\).*/\1/')
# Similar for Rules...
```

### Compliance Checks

```bash
# BMAD residuals (domain-specific content)
BMAD_TOTAL=$(grep -rl "BMAD" .claude/skills/*/SKILL.md | wc -l)

# Non-agnostic skills
NON_AGNOSTIC=$(grep -rl "domain_agnostic: false" .claude/skills/*/SKILL.md | wc -l)

# Stale docs (>90 days)
STALE_DOCS=$(docs with last_updated > 90 days ago)
```

---

## Matriz de Decisiones

| Condición                                 | Status  | Exit Code | Action                                 |
| ----------------------------------------- | ------- | --------- | -------------------------------------- |
| **Counts match** + 0 BMAD + 100% agnostic | `OK`    | 0         | Session termina normalmente            |
| **Count drift** detected                  | `DRIFT` | 1         | Session bloqueada, requiere corrección |
| **BMAD residuals** found                  | `DRIFT` | 1         | Domain compliance violated             |
| **Non-agnostic skills** found             | `DRIFT` | 1         | Domain compliance violated             |
| **Parse errors** en CLAUDE.md             | `DRIFT` | 1         | Metadata corruption detected           |

---

## Output Format

### Success Case

```
ECOSYSTEM: skills=61 commands=23 rules=5 agents=6 hooks=4 | BMAD=0 non-agnostic=0 stale=3
OK: Counts match CLAUDE.md. 0 BMAD. 100% domain-agnostic. 3 stale docs.
```

### Drift Detected

```
ECOSYSTEM: skills=61 commands=23 rules=5 agents=6 hooks=4 | BMAD=2 non-agnostic=1 stale=8
DRIFT: Skills: CLAUDE.md=60 filesystem=61. BMAD residuals: 2 core files. domain_agnostic:false in 1 skills.
```

### Critical Values Tracked

- **skills**: SKILL.md files count
- **commands**: .md files in commands/
- **rules**: .md files in rules/
- **agents**: .md files in agents/
- **hooks**: .sh files in hooks/
- **BMAD**: Biometric/domain references
- **non-agnostic**: domain_agnostic: false skills
- **stale**: docs with last_updated > 90 days

---

## Configuracion en settings.json

```json
{
  "Stop": [
    {
      "matcher": "*",
      "hooks": [
        {
          "type": "command",
          "command": "bash .claude/hooks/validate-ecosystem-counts.sh",
          "timeout": 30
        }
      ]
    }
  ]
}
```

**Nota**: Este hook puede **bloquear session termination** si exit code = 1

---

## Integration Points

### Con dtc-session-check

```
validate-ecosystem-counts.sh (counts)      ← ESTE: Validación cuantitativa
        ↓
dtc-session-check (prompt-based)          ← Validación cualitativa de sync
        ↓
    Session termination
```

### Con ecosystem-validation.ts

- **Hook**: Real-time filesystem scanning durante Stop event
- **Validator**: Programmatic validation para commands/gates
- **Complementarios**: Hook para sessión; validator para workflows

### Con CLAUDE.md Updates

```bash
# Si el hook detecta drift, es señal de que CLAUDE.md necesita sync:
npm run sync:ecosystem-counts
# Actualiza CLAUDE.md con filesystem reality
```

---

## Debugging y Troubleshooting

### Test Manual

```bash
# Ejecutar directamente:
bash .claude/hooks/validate-ecosystem-counts.sh

# Verificar counts individuales:
find .claude/skills -name "SKILL.md" | wc -l
grep 'Skills |' .claude/CLAUDE.md | head -1
```

### Common Issues

**1. Parse Errors**

```bash
# Si CLAUDE.md format change breaks grep:
EXPECTED_SKILLS=$(grep 'Skills |' .claude/CLAUDE.md | sed 's/.*Skills | *\([0-9]*\).*/\1/')
# Verify con: echo $EXPECTED_SKILLS
```

**2. BMAD False Positives**

```bash
# Check specific BMAD references:
grep -r "BMAD" .claude/skills/*/SKILL.md
# Filter out legitimate historical references vs active content
```

**3. Stale Date Processing**

```bash
# macOS date command compatibility:
DOC_EPOCH=$(date -j -f "%Y-%m-%d" "$LAST_UPDATED" +%s 2>/dev/null)
# Requires LAST_UPDATED in YYYY-MM-DD format
```

### Performance Notes

- **Execution time**: ~2-5 seconds for 200+ artifacts
- **Memory usage**: Minimal (pure bash + grep)
- **Timeout**: 30s configured (generous for large repos)

---

## Historical Context

### Evolution

```
v1.0 → dtc-session-check prompt-based    (failed: no transcript access)
v2.0 → validate-ecosystem-counts.sh      (current: deterministic bash)
v3.0 → ecosystem-validation.ts integration (planned: unified engine)
```

### Design Choice: Command vs Prompt

- **Prompt-based**: Rich context, pero limitaciones de transcript access
- **Command-based**: Deterministic, acceso directo a filesystem, exit code control

---

## Metrics y Monitoring

### Success Metrics

- **False positive rate**: < 5% (legitimate drift vs false alarms)
- **Detection accuracy**: 100% for count drift
- **Session impact**: < 3s execution time

### Alert Thresholds

- **Critical**: Any count drift or BMAD residuals
- **Warning**: > 5 stale docs or non-agnostic skills
- **Info**: Successful validation with clean state

---

## Changelog

| Version | Fecha      | Cambios                                                                                  |
| ------- | ---------- | ---------------------------------------------------------------------------------------- |
| 1.0.0   | 2026-03-25 | Initial implementation — deterministic count validation, BMAD detection, staleness check |
