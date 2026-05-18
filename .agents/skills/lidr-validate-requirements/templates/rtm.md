# Template: Requirements Traceability Matrix (RTM)

> **Propósito**: Trazabilidad bidireccional completa: Business Case → PRDs → RFs + NFRs → Épicas → US.
> **Cuándo se crea**: Fase 3 — Especificación, tras generar y validar RFs + NFRs
> **Quién lo llena**: PO + TL con skill `validate-requirements`
> **Gate asociado**: Gate 2 — Requisitos Completos y Coherentes
> **Instancias**: `docs/projects/{proyecto}/rtm.md`

---

## Secciones del Documento

### 1. Resumen de Cobertura

```markdown
## Resumen de Cobertura

| Fuente                | Total Items | Cubiertos | Gaps | Cobertura |
| --------------------- | ----------- | --------- | ---- | --------- |
| Funcionalidades PRD-F | N           | N         | N    | N%        |
| Categorías NFR PRD-T  | N           | N         | N    | N%        |
| RFs con BDD           | N           | N         | N    | N%        |
| NFRs con Métricas     | N           | N         | N    | N%        |

**Estado General**: ✅ PASS / ⚠️ CONDITIONAL / ❌ FAIL
```

### 2. Trazabilidad Forward (BC → PRD → RF/NFR)

```markdown
## Forward: Negocio → Requisitos

| Necesidad (BC)   | Funcionalidad PRD | RF(s)                | NFR(s)          | Estado      |
| ---------------- | ----------------- | -------------------- | --------------- | ----------- |
| {objetivo BC §X} | F-001: {nombre}   | RF-XX-001, RF-XX-002 | NFR-XX-PERF-001 | ✅ Cubierto |
| {objetivo BC §Y} | F-002: {nombre}   | —                    | —               | ❌ GAP      |
```

### 3. Trazabilidad Backward (RF/NFR → PRD → BC)

```markdown
## Backward: Requisitos → Negocio

| RF/NFR         | Referencia PRD   | Objetivo BC | Validado    |
| -------------- | ---------------- | ----------- | ----------- |
| RF-XX-001      | PRD-F §2.4 F-001 | {objetivo}  | ✅          |
| NFR-XX-SEC-001 | PRD-T §5.2       | {seguridad} | ✅          |
| RF-XX-015      | —                | —           | ❌ Huérfano |
```

### 4. Matriz de Impacto NFR → RF

```markdown
## Impacto NFR → RF

| NFR             | Aplica a RFs           | Tipo         | Notas               |
| --------------- | ---------------------- | ------------ | ------------------- |
| NFR-XX-PERF-001 | RF-001, RF-005, RF-010 | Específico   | Latencia crítica    |
| NFR-XX-SEC-001  | TODOS                  | Sistema-wide | Cifrado obligatorio |
| NFR-XX-ACC-001  | RF-020, RF-021         | Específico   | UI-facing RFs       |
```

### 5. Clusters de Implementación

```markdown
## Clusters para Sprint Planning

| Cluster         | RFs         | NFRs Aplicables          | Sprints Est. | Dependencias | Equipo   |
| --------------- | ----------- | ------------------------ | ------------ | ------------ | -------- |
| Auth & Security | RF-001..005 | NFR-SEC-\*, NFR-PERF-001 | 2-3          | Ninguna      | Backend  |
| Core Biometrics | RF-010..020 | NFR-PERF-\*, NFR-SEC-002 | 3-4          | Cluster 1    | Core     |
| UI/UX           | RF-030..035 | NFR-ACC-\*, NFR-PERF-003 | 2            | Cluster 1, 2 | Frontend |
```

### 6. Gap Report

```markdown
## Gaps Detectados

### Críticos (bloquean Gate 2)

| #   | Tipo      | Descripción  | Acción     | Owner | Deadline |
| --- | --------- | ------------ | ---------- | ----- | -------- |
| 1   | Funcional | F-XXX sin RF | Generar RF | PO    | {fecha}  |

### Advertencias (no bloquean)

| #   | Tipo           | Descripción           | Recomendación          |
| --- | -------------- | --------------------- | ---------------------- |
| 1   | Cobertura baja | F-XXX tiene solo 1 RF | Considerar descomponer |
```

---

## Criterios de Completitud

| Criterio                                        | Obligatorio | Gate     |
| ----------------------------------------------- | ----------- | -------- |
| 100% funcionalidades PRD cubiertas por ≥1 RF    | Sí          | Gate 2   |
| Todas las categorías NFR obligatorias presentes | Sí          | Gate 2   |
| 0 RFs huérfanos (sin traceability a PRD)        | Sí          | Gate 2   |
| 0 NFRs sin método de medición                   | Sí          | Gate 2   |
| Clusters identificados con estimaciones         | Sí          | Gate 2→3 |
| Gap report con 0 items críticos                 | Sí          | Gate 2   |

---

## Skills que Asisten

- **RFs**: `skills/generate-rf/SKILL.md`
- **NFRs**: `skills/generate-nfr/SKILL.md`
- **Validación**: `skills/validate-requirements/SKILL.md` (genera este documento)
- **Coherencia**: `docs/checklists/rf-coherence.md`
- **Siguiente**: `skills/epic-breakdown/SKILL.md` (usa clusters de este RTM)

---

_Template — cada proyecto crea instancia en `docs/projects/{proyecto}/rtm.md`_
