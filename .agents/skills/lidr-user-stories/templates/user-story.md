---
id: tpl-user-story
version: "1.0.0"
last_updated: "2026-03-16"
updated_by: "System: Template Migration"
status: active
type: template
review_cycle: 60
next_review: "2026-05-15"
owner_role: "Product Owner"
---

# User Story Template

> **Uso**: Formato estandar para User Stories con criterios BDD. Usado por el skill `user-stories`.
> **Gate**: Gate 3 (Sprint Planning)

---

## Identificacion

| Campo              | Valor                         |
| ------------------ | ----------------------------- |
| ID                 | US-{NNN}                      |
| Titulo             | {titulo_descriptivo}          |
| RF Origen          | RF-{NNN}                      |
| Epica              | PROJ-{NNN}                    |
| Prioridad (MoSCoW) | Must / Should / Could / Won't |
| Estimacion         | {N} horas / {N} story points  |
| Sprint target      | Sprint {N}                    |

---

## Narrativa

```
As a {rol/persona},
I want {accion/funcionalidad},
So that {beneficio/valor de negocio}.
```

---

## Criterios de Aceptacion (BDD / Gherkin)

### Scenario 1: {nombre_escenario_happy_path}

```gherkin
Given {contexto_inicial}
  And {condicion_adicional}
When {accion_del_usuario}
Then {resultado_esperado}
  And {resultado_adicional}
```

### Scenario 2: {nombre_escenario_alternativo}

```gherkin
Given {contexto_inicial}
When {accion_alternativa}
Then {resultado_alternativo}
```

### Scenario 3: {nombre_escenario_error}

```gherkin
Given {contexto_inicial}
When {accion_que_falla}
Then {mensaje_error_esperado}
  And {estado_sistema_post_error}
```

---

## Dependencias

| Tipo          | ID                    | Descripcion   |
| ------------- | --------------------- | ------------- |
| Bloqueada por | US-{NNN} / PROJ-{NNN} | {descripcion} |
| Bloquea a     | US-{NNN}              | {descripcion} |
| API externa   | {nombre_api}          | {descripcion} |

---

## DoR Checklist (Definition of Ready)

- [ ] Narrativa completa (As a / I want / So that)
- [ ] Minimo 2 criterios de aceptacion en Gherkin
- [ ] RF origen identificado y aprobado
- [ ] Dependencias mapeadas
- [ ] Estimacion acordada en refinement
- [ ] Mockups/wireframes adjuntos (si aplica)
- [ ] Datos de prueba definidos (si aplica)

---

## Notas de Refinement

| Fecha        | Participantes | Decisiones   | Dudas pendientes |
| ------------ | ------------- | ------------ | ---------------- |
| {YYYY-MM-DD} | {nombres}     | {decisiones} | {dudas}          |
