---
id: tool-integrations
version: '1.0.0'
last_updated: '2026-03-09'
updated_by: 'TL: Lead Engineer'
status: active
type: standard
review_cycle: 90
next_review: '2026-06-07'
owner_role: 'Tech Lead'
---

# Tool Integration Standards

> **Propósito**: Define métodos de integración con herramientas externas del SDLC cuando no hay MCPs disponibles.
> **Alcance**: Alternativas prácticas a MCPs — CSV/scripts/CLI para mantener workflows IA optimizados.
> **Referenciado por**: Commands que requieren integraciones externas

---

## 1. Filosofía de Integración

### 1.1 Principio

> **Mantener workflows IA-optimizados sin depender de MCPs no disponibles**

La IA debe poder orquestar el SDLC completo, pero no todas las herramientas tienen MCPs. Preferimos:

1. **CSV + API scripts** para test management
2. **CLI tools** para herramientas con good CLI (GitHub)
3. **Manual handoffs** documentados cuando no hay alternativa

### 1.2 Criterios de Selección

| Método             | Cuándo usar                                    | Ejemplo                     |
| ------------------ | ---------------------------------------------- | --------------------------- |
| **MCP**            | Disponible y confiable                         | filesystem, memory, fetch   |
| **CLI + scripts**  | CLI oficial de calidad                         | GitHub CLI (gh), Docker CLI |
| **CSV + API**      | API disponible, estructura de datos predecible | Xray REST API + CSV         |
| **Manual handoff** | API compleja o autenticación problemática      | Confluence (manual publish) |

---

## 2. Test Management (Xray)

### 2.1 Método: CSV Export/Import + Scripts

**Razón**: No hay MCP disponible para Xray/TestRail; CSV mantiene el workflow

### 2.2 Scripts

| Script                         | Función                            | Input                       | Output                     |
| ------------------------------ | ---------------------------------- | --------------------------- | -------------------------- |
| `scripts/import-to-xray.sh`    | Sube test cases generados por IA   | CSV con casos BDD           | Test cases en Xray project |
| `scripts/export-from-xray.sh`  | Descarga resultados de ejecución   | Project ID + Test Execution | CSV con results            |
| `scripts/validate-xray-csv.js` | Valida formato CSV antes de subida | CSV file                    | Validation report          |

### 2.3 Workflow

```
1. IA genera test cases → CSV format (BDD scenarios + data)
2. QA valida CSV → ejecuta import-to-xray.sh
3. QA ejecuta tests en Xray (manual)
4. QA ejecuta export-from-xray.sh
5. IA procesa CSV results → genera test-execution-report
```

### 2.4 CSV Format (Xray Compatible)

```csv
Test Name,Test Type,Gherkin,Priority,Labels,Test Set
Login Happy Path,Cucumber,"""Given user has valid credentials\nWhen user submits login form\nThen user is redirected to dashboard""",High,auth;smoke,Sprint-14-Login
Login Invalid Password,Cucumber,"""Given user has valid username\nAnd user has invalid password\nWhen user submits login form\nThen error message is displayed""",Medium,auth;negative,Sprint-14-Login
```

---

## 3. GitHub Integration

### 3.1 Método: GitHub CLI (gh)

**Razón**: Token efficiency + CLI es más estable que el approach MCP

### 3.2 Commands

| CLI Command                                              | Función                  | Usado por             |
| -------------------------------------------------------- | ------------------------ | --------------------- |
| `gh pr create --title "..." --body "..."`                | Crear PR con descripción | /create-pr            |
| `gh pr list --state merged --json title,number,mergedAt` | Listar PRs mergeados     | /create-release-notes |
| `gh issue list --assignee @me --json number,title,state` | Listar issues asignados  | /implement-ticket     |
| `gh repo clone {owner}/{repo}`                           | Clonar repositorio       | Scripts de setup      |
| `gh workflow run {workflow}`                             | Triggear CI/CD           | Scripts de deployment |

### 3.3 Scripts

| Script                     | Función                                    |
| -------------------------- | ------------------------------------------ |
| `scripts/create-pr.sh`     | Wrapper para gh pr create con validaciones |
| `scripts/sync-issues.sh`   | Sincroniza estado Jira ↔ GitHub issues     |
| `scripts/release-notes.sh` | Extrae PRs mergeados para release notes    |

### 3.4 Autenticación

```bash
# Setup inicial (por developer)
gh auth login

# En scripts
export GITHUB_TOKEN=${GH_TOKEN}
gh api repos/{owner}/{repo}/pulls --method POST --input pr.json
```

---

## 4. Jira Integration

### 4.1 Método: Manual + API Scripts (futuro)

**Estado actual**: Manual handoffs documentados
**Roadmap**: API scripts para operaciones repetitivas

### 4.2 Manual Handoffs

| Operación                | Método actual              | Automatización futura              |
| ------------------------ | -------------------------- | ---------------------------------- |
| Crear épica              | Manual desde Business Case | API script                         |
| Transicionar tickets     | Manual                     | API script con workflow validation |
| Crear subtareas          | Manual                     | API script desde IA breakdown      |
| Actualizar campos custom | Manual                     | API script                         |

### 4.3 Scripts Planeados

- `scripts/create-epic.sh` — Crear épica desde Business Case
- `scripts/transition-ticket.sh` — Transicionar ticket con validaciones
- `scripts/sync-rf-tickets.sh` — Sincronizar RFs → tickets Jira

---

## 5. Confluence Integration

### 5.1 Método: Manual Publish

**Razón**: API de Confluence complejo para autenticación + formato

### 5.2 Workflow

```
1. IA genera documento → formato Markdown
2. Tech Lead revisa documento
3. Manual copy/paste a Confluence
4. Vinculación cruzada manual
```

### 5.3 Templates Pre-formateados

La IA genera documentos con **frontmatter de Confluence**:

```markdown
---
confluence:
  space: 'ENG'
  parent: 'Architecture'
  labels: ['sdlc', 'architecture', 'project']
---

# Architecture Document

...
```

Facilitando copy/paste manual con metadata preservada.

---

## 6. Standards de Scripts

### 6.1 Ubicación

```
scripts/
├── import-to-xray.sh          # Xray test cases upload
├── export-from-xray.sh        # Xray results download
├── validate-xray-csv.js       # CSV validation
├── create-pr.sh               # GitHub PR creation
├── sync-issues.sh             # GitHub ↔ Jira sync
├── release-notes.sh           # GitHub PR extraction
└── utils/
    ├── api-helpers.js         # Common API utilities
    └── csv-parser.js          # CSV processing utilities
```

### 6.2 Convenciones

| Aspecto        | Estándar                           |
| -------------- | ---------------------------------- |
| **Naming**     | `{verb}-{tool}-{entity}.sh`        |
| **Exit codes** | 0=success, 1=error, 2=warning      |
| **Logging**    | stderr para logs, stdout para data |
| **Config**     | `.env` file + env vars             |
| **Validation** | Validate inputs, fail fast         |
| **Idempotent** | Safe to re-run                     |

### 6.3 Error Handling

```bash
# Template para scripts
set -euo pipefail  # Exit on error, undefined vars, pipe failures

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*" >&2
}

error() {
    log "ERROR: $*"
    exit 1
}

validate_input() {
    [[ $# -eq 0 ]] && error "Usage: $0 <required-param>"
    [[ ! -f "$1" ]] && error "File not found: $1"
}
```

---

## 7. Beneficios vs Trade-offs

### 7.1 Beneficios

| Beneficio          | CSV/CLI              | vs MCP                        |
| ------------------ | -------------------- | ----------------------------- |
| **Disponibilidad** | Inmediata            | Depende de disponibilidad MCP |
| **Mantenimiento**  | Bajo (CLI estable)   | Medio (MCP updates)           |
| **Debugging**      | Fácil (shell + curl) | Medio (debug MCP)             |
| **Autenticación**  | Estándar (token/CLI) | Variable                      |

### 7.2 Trade-offs

| Aspecto                  | Pérdida vs MCP      | Mitigación                    |
| ------------------------ | ------------------- | ----------------------------- |
| **Seamless integration** | Más steps manuales  | Scripts + documentación clara |
| **Real-time sync**       | Periodic sync       | Scheduled scripts             |
| **Rich metadata**        | Limited by CSV/CLI  | Pre/post-processing           |
| **Error recovery**       | Manual intervention | Robust error handling + logs  |

---

## 8. Evolution Path

### 8.1 Graduación a MCP

Un tool integration **se gradúa a MCP** cuando:

1. MCP become disponible y estable
2. API complexity justifica MCP vs scripts
3. Team ha validado el workflow con scripts
4. Cost/benefit de maintenance MCP < scripts

### 8.2 Roadmap

| Timeline    | Integration            | Method        | Status     |
| ----------- | ---------------------- | ------------- | ---------- |
| **Q1 2026** | Xray, GitHub CLI       | CSV + scripts | ✅ Active  |
| **Q2 2026** | Jira API scripts       | API + scripts | 📋 Planned |
| **Q3 2026** | Confluence API         | API + scripts | 📋 Planned |
| **Q4 2026** | Evaluate MCP migration | MCP           | ⚡ Future  |

---

## Changelog

| Versión | Fecha      | Autor             | Cambios                                                 |
| ------- | ---------- | ----------------- | ------------------------------------------------------- |
| 1.0.0   | 2026-03-09 | TL: Lead Engineer | Documento inicial para reemplazo MCP → CSV/CLI workflow |

---

_Este estándar define métodos prácticos de integración cuando MCPs no están disponibles, manteniendo workflows IA-optimizados con herramientas externas del SDLC._
