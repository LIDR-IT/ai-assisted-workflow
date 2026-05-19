---
id: prd-tecnico-template
version: "1.0.0"
last_updated: "2026-03-16"
updated_by: "System: Template Migration"
status: active
type: template
review_cycle: 60
next_review: "2026-05-15"
owner_role: "Tech Lead"
---

# Template: PRD Técnico

> **Propósito**: Especificación técnica del producto desde perspectiva de arquitectura y implementación.
> **Cuándo se crea**: Fase 2 — Discovery, después del Product Brief aprobado
> **Quién lo llena**: Tech Lead / R&D Lead con skill `prd-tecnico`
> **Gate asociado**: Gate 1 — PRD Aprobado (junto con PRD Funcional)

---

## Estructura del Documento

### 1. Encabezado

```markdown
---
proyecto: { nombre }
version: { 1.0 }
estado: Borrador | En Revisión | Aprobado
autor_tecnico: { Tech Lead nombre }
fecha_creacion: { YYYY-MM-DD }
prd_funcional_ref: { link al prd-funcional }
---
```

### 2. Arquitectura Propuesta

```markdown
## Arquitectura Propuesta

### Diagrama de Alto Nivel

{Diagrama o descripción de la arquitectura del sistema}

### Patrones Arquitectónicos

{Microservicios, monolito modular, serverless, etc.}

### Justificación

{Por qué esta arquitectura es adecuada para los requisitos funcionales}
```

### 3. Capacidades Técnicas

```markdown
## Capacidades Técnicas

| ID    | Capacidad           | Tecnología              | Madurez                | Riesgo          |
| ----- | ------------------- | ----------------------- | ---------------------- | --------------- |
| C-001 | {capacidad técnica} | {tecnología específica} | PoC/Probada/Producción | Alto/Medio/Bajo |
```

### 4. Limitaciones Técnicas

```markdown
## Limitaciones Técnicas

| #   | Limitación              | Impacto en Funcional              | Mitigación                |
| --- | ----------------------- | --------------------------------- | ------------------------- |
| 1   | {limitación específica} | {cómo afecta las funcionalidades} | {estrategia para mitigar} |
```

### 5. Resultados de PoC

```markdown
## Resultados de PoC (si aplica)

### PoC Realizados

{Lista de PoCs ejecutados con skill `poc-report`}

### Conclusiones

{Viabilidad técnica, performance, limitaciones encontradas}

### Recomendaciones

{Decisiones técnicas basadas en los PoCs}
```

### 6. Dependencias Técnicas

```markdown
## Dependencias Técnicas

| Dependencia | Tipo                 | Proveedor   | Estado               | Riesgo            |
| ----------- | -------------------- | ----------- | -------------------- | ----------------- |
| {nombre}    | API/SDK/Infra/Equipo | {proveedor} | Disponible/Pendiente | {nivel de riesgo} |
```

### 7. Estimación Técnica de Alto Nivel

```markdown
## Estimación Técnica de Alto Nivel

| Componente           | Complejidad     | Estimación (sprints) | Equipo               |
| -------------------- | --------------- | -------------------- | -------------------- |
| {componente técnico} | Baja/Media/Alta | {número de sprints}  | {equipo responsable} |

### Supuestos

{Lista de supuestos en los que se basa la estimación}
```

### 8. NFRs Técnicos

```markdown
## Non-Functional Requirements

| NFR          | Métrica          | Target | Medición     |
| ------------ | ---------------- | ------ | ------------ |
| Performance  | Latencia P95     | ≤200ms | APM          |
| Scalability  | Concurrent users | 1000   | Load testing |
| Availability | Uptime           | 99.9%  | Monitoring   |
```

---

## Criterios de Completitud

| Criterio                  | Obligatorio | Validación                     |
| ------------------------- | ----------- | ------------------------------ |
| Arquitectura propuesta    | Sí          | Diagrama o descripción clara   |
| Capacidades técnicas      | Sí          | Con tecnología y madurez       |
| Limitaciones documentadas | Sí          | Impacto en funcional explícito |
| Dependencias técnicas     | Sí          | Estado y riesgo evaluado       |
| Estimación de alto nivel  | Sí          | Por componente con supuestos   |

---

## Skills que Asisten

- **Generación**: Skill `prd-tecnico` genera borrador completo
- **PoCs**: Skill `poc-report` para validar viabilidad técnica
- **NFRs**: Skill `generate-nfr` para requisitos no funcionales
- **Arquitectura**: Skill `architecture-doc` para documentación detallada
- **Review Cruzado**: Skill `review-cruzado` alinea con PRD Funcional

---

_Template — instancia en `docs/projects/{proyecto}/prd-tecnico.md`_
