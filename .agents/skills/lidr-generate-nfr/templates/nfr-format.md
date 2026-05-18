# Formato Estándar: Requisito No Funcional (NFR)

> **Propósito**: Formato obligatorio para NFRs standalone, medibles y testables.
> **Referenciado por**: `skills/generate-nfr/SKILL.md` como formato de output
> **Gate asociado**: Gate 2 — Requisitos Completos
> **Complementa a**: `docs/templates/rf-format.md` (requisitos funcionales)
> **Instancias**: `docs/projects/{proyecto}/nfrs/NFR-{PROJ}-{CAT}-{NNN}.md`

---

## Estructura del NFR

### 1. Encabezado (Obligatorio)

```markdown
---
id: NFR-{PROJ}-{CAT}-{NNN}
título: { Título descriptivo — máximo 15 palabras }
categoría: Performance | Security | Scalability | Availability | Compliance | Accessibility | Observability
versión: { 1.0 }
estado: Borrador | En Revisión | Aprobado | Obsoleto
prd_origen: { PRD-T §5.X }
autor: { Nombre completo }
fecha_creación: { YYYY-MM-DD }
prioridad: Must Have | Should Have | Could Have
criticidad: Bloqueante | Alta | Media | Baja
---
```

**Convención de IDs:**

- `{CAT}` = Código de categoría: `PERF`, `SEC`, `SCAL`, `AVAIL`, `COMP`, `ACC`, `OBS`
- `{NNN}` = Secuencial por categoría
- Ejemplo: `NFR-SDLC-PERF-001`, `NFR-SDLC-SEC-003`

### 2. Definición (Obligatorio)

```markdown
## Definición

{Qué calidad se requiere — 1-2 oraciones. Sin ambigüedad.}
```

**Regla**: Si no puedes definirlo en 2 oraciones, el NFR es demasiado amplio → dividir.

### 3. Métrica y Umbral (Obligatorio)

```markdown
## Métrica y Umbral

| Métrica  | Baseline | Target     | Máx. Aceptable | Método de Medición   | Frecuencia    |
| -------- | -------- | ---------- | -------------- | -------------------- | ------------- |
| {nombre} | {actual} | {objetivo} | {límite}       | {herramienta/método} | {cada cuánto} |
```

**Reglas:**

- **Baseline** = valor actual medido (o "N/A — sistema nuevo")
- **Target** = objetivo de diseño
- **Máx. Aceptable** = umbral que si se excede, se considera fallo
- **Método** = cómo se mide (herramienta específica, no "testing")

### 4. Escenarios de Validación (Obligatorio)

```markdown
## Escenarios de Validación

### Normal (carga esperada)

- Condiciones: {perfil de carga}
- Resultado esperado: {cumple target}

### Estrés (carga pico)

- Condiciones: {perfil pico}
- Resultado esperado: {degradación aceptable dentro de máx.}

### Fallo (modo de error)

- Condiciones: {escenario de fallo}
- Resultado esperado: {degradación grácil / failover}
```

### 5. Trazabilidad (Obligatorio)

```markdown
## Trazabilidad

| Referencia        | Valor                               |
| ----------------- | ----------------------------------- |
| PRD-T origen      | PRD-T §5.X                          |
| PRD-F métricas    | PRD-F §2.5 (si aplica)              |
| RFs afectados     | RF-{PROJ}-{NNN}, RF-{PROJ}-{NNN}    |
| Riesgos asociados | RISK-{NNN} (del risk-log)           |
| Regulación        | {GDPR Art. X, OWASP A-XX, eIDAS §X} |
```

### 6. Implicaciones de Arquitectura (Obligatorio)

```markdown
## Implicaciones de Arquitectura

{Qué decisiones arquitectónicas requiere — caching, CDN, replicación, cifrado, etc.}
{Referencia a ADRs existentes si aplica}
```

### 7. Dependencias (Si aplica)

```markdown
## Dependencias

| Tipo            | Recurso               | Estado               | Responsable |
| --------------- | --------------------- | -------------------- | ----------- |
| Infraestructura | {e.g., Redis cluster} | Disponible/Pendiente | DevOps      |
| Terceros        | {e.g., CDN provider}  | Contratado/Pendiente | PME         |
```

---

## Categorías por Dominio {{CLIENT_NAME}}

### Performance (Biometría)

- Latencia matching facial 1:1: P95 <500ms
- Latencia matching 1:N: P95 <2s para N=10K
- Throughput enrollment: >100 transacciones/segundo
- Liveness detection: <200ms

### Security (Datos Biométricos)

- Cifrado templates biométricos: AES-256 en reposo
- Transmisión: TLS 1.2+ obligatorio
- No PII en logs: NUNCA (GDPR Art. 9)
- Revocación de datos: mecanismo implementado

### Compliance (Regulatorio)

- GDPR Art. 9: DPIA completado
- eIDAS: Nivel de confianza documentado
- Derecho al olvido: Tiempo de respuesta <72h
- Retención de datos: Política documentada y automatizada

---

_Template — cada proyecto crea instancias en `docs/projects/{proyecto}/nfrs/`_
