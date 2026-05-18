# Template: Epic Review

> **Propósito**: Cierre formal de épica con análisis plan vs actual, lecciones aprendidas, y propuestas de follow-up.
> **Cuándo se crea**: Post-deploy o cuando la épica se considera completa/cerrada
> **Quién lo llena**: PME + TL con skill `epic-review`
> **Complementa a**: `retrospective` (nivel sprint), `postmortem` (nivel incidente)
> **Instancias**: `docs/projects/{proyecto}/epic-reviews/EP-{NNN}-review.md`

---

## Secciones del Documento

### 1. Ficha de la Épica

```markdown
## Ficha

| Campo                  | Valor                             |
| ---------------------- | --------------------------------- |
| **Epic ID**            | {PROJ-NNN}                        |
| **Nombre**             | {nombre de la épica}              |
| **Fecha de Review**    | {YYYY-MM-DD}                      |
| **Sprints ejecutados** | Sprint {N} — Sprint {M} ({total}) |
| **Equipo**             | {roles/personas}                  |
| **Autor del Review**   | {PME/TL}                          |
```

### 2. Scope: Plan vs Actual

```markdown
## Scope

### RFs Entregados vs Planificados

| RF ID      | Planificado | Entregado | Estado       | Notas              |
| ---------- | ----------- | --------- | ------------ | ------------------ |
| RF-XXX-001 | Sprint 1    | Sprint 1  | ✅ A tiempo  |                    |
| RF-XXX-002 | Sprint 2    | Sprint 3  | ⚠️ Retrasado | {razón}            |
| RF-XXX-005 | Sprint 3    | —         | ❌ Diferido  | Movido a follow-up |

### Resumen

| Métrica              | Plan | Real | Delta |
| -------------------- | ---- | ---- | ----- |
| RFs totales          | N    | N    | +/-N  |
| Sprints              | N    | N    | +/-N  |
| Horas estimadas      | N    | N    | +/-N% |
| % entregado a tiempo | —    | N%   | —     |
```

### 3. NFR Achievement

```markdown
## Logro de NFRs

| NFR ID       | Categoría   | Target     | Real         | ¿Cumple? |
| ------------ | ----------- | ---------- | ------------ | -------- |
| NFR-PERF-001 | Performance | P95 <500ms | P95 = Nms    | ✅/⚠️/❌ |
| NFR-SEC-001  | Security    | AES-256    | Implementado | ✅/⚠️/❌ |
```

### 4. Calidad

```markdown
## Métricas de Calidad

| Métrica                     | Valor | Benchmark | Evaluación |
| --------------------------- | ----- | --------- | ---------- |
| Densidad de bugs (bugs/RF)  | N     | <2        | ✅/⚠️/❌   |
| Cobertura de tests          | N%    | ≥80%      | ✅/⚠️/❌   |
| Bugs críticos en producción | N     | 0         | ✅/⚠️/❌   |
```

### 5. Deuda Técnica

```markdown
## Deuda Técnica

| ID     | Descripción   | Impacto         | Prioridad     | Resolución propuesta |
| ------ | ------------- | --------------- | ------------- | -------------------- |
| TD-001 | {descripción} | {Alto/Med/Bajo} | {Must/Should} | {follow-up epic}     |

| Métrica                         | Valor   |
| ------------------------------- | ------- |
| Deuda creada durante la épica   | N items |
| Deuda resuelta durante la épica | N items |
| Deuda neta                      | +/-N    |
```

### 6. Lecciones Aprendidas

```markdown
## Lecciones

### Mantener (fue bien)

| #   | Aprendizaje | Evidencia | Aplicable a |
| --- | ----------- | --------- | ----------- |

### Mejorar (no fue bien)

| #   | Problema | Causa raíz | Acción | Owner |
| --- | -------- | ---------- | ------ | ----- |

### Experimentar (probar en futuro)

| #   | Propuesta | Beneficio esperado | Riesgo |
| --- | --------- | ------------------ | ------ |
```

### 7. Next Steps

```markdown
## Propuestas de Follow-up

| Épica                   | Alcance                   | Prioridad | Sprints Est. | Dependencias |
| ----------------------- | ------------------------- | --------- | ------------ | ------------ |
| EP-A: {scope diferido}  | RF-XXX-005 + relacionados | Must      | 1-2          | Ninguna      |
| EP-B: {nuevos features} | {descripción}             | Should    | 2-3          | EP-A         |
| EP-C: {tech debt}       | TD-001, TD-003            | Must      | 1            | Ninguna      |
```

### 8. Sign-off

```markdown
## Firma

| Rol | Nombre | Firma | Fecha |
| --- | ------ | ----- | ----- |
| PME |        |       |       |
| PO  |        |       |       |
| TL  |        |       |       |
```

---

## Criterios de Completitud

| Criterio                                | Obligatorio                        |
| --------------------------------------- | ---------------------------------- |
| Scope plan vs actual documentado        | Sí                                 |
| NFR achievement verificado con datos    | Sí                                 |
| Lecciones con ≥1 item en cada categoría | Sí                                 |
| Next steps con propuestas concretas     | Sí (si hay scope diferido o deuda) |
| Sign-off de PME + PO + TL               | Sí                                 |

---

## Skills que Asisten

- **Retrospectivas**: `skills/retrospective/SKILL.md` (fuente de datos)
- **Tech debt**: `skills/tech-debt/SKILL.md` (items acumulados)
- **Release notes**: `skills/release-notes/SKILL.md` (scope entregado)
- **Siguiente**: Propuestas de follow-up alimentan nuevo ciclo `epic-breakdown`

---

_Template — cada proyecto crea instancias en `docs/projects/{proyecto}/epic-reviews/`_
