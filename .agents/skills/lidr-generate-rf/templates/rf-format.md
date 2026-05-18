# Formato Estándar: Requisito Funcional (RF)

> **Propósito**: Formato obligatorio que define la estructura de todo RF en el proyecto.
> **Referenciado por**: `.claude/rules/org.md` via `@../templates/rf-format.md`
> **Usado por**: `skills/generate-rf/SKILL.md` como formato de output obligatorio
> **Gate asociado**: Gate 2 — RF Completos
> **Política**: Todo RF debe seguir este formato exacto. RFs que no cumplan son rechazados en revisión.

---

## 1. Estructura Completa del RF

### 1.1 Encabezado (Obligatorio)

```markdown
---
id: RF-{PROY}-{NNN}
título: { Título descriptivo del requisito — máximo 15 palabras }
versión: { 1.0 }
estado: Borrador | En Revisión | Aprobado | Obsoleto
prd_origen: { Link al PRD Técnico y/o Funcional }
autor: { Nombre completo }
fecha_creación: { YYYY-MM-DD }
fecha_última_modificación: { YYYY-MM-DD }
prioridad: Must Have | Should Have | Could Have | Won't Have (MoSCoW)
complejidad: Baja | Media | Alta | Muy Alta
estimación_sprint: { Sprint N — estimación preliminar }
---
```

**Reglas del encabezado:**

- **ID**: Formato estricto `RF-{PROY}-{NNN}` donde PROY = código del proyecto (3-5 chars), NNN = secuencial sin gaps
- **Título**: Descriptivo, sin jerga, comprensible por PO y QA (no solo devs)
- **Estado**: Solo transiciones válidas: Borrador → En Revisión → Aprobado. Aprobado → Obsoleto si se reemplaza
- **Prioridad**: MoSCoW asignada por PO. "Must Have" = no se cierra el sprint sin esto

### 1.2 Objetivo (Obligatorio)

```markdown
## Objetivo

{Qué logra este requisito — 1-2 oraciones máximo. Responde: "¿Qué valor aporta al usuario/negocio?"}
```

**Reglas:**

- No técnico — escribir en lenguaje de negocio
- No describir HOW (implementación), solo WHAT (qué se logra) y WHY (para qué)
- Si no puedes explicar el objetivo en 2 oraciones, el RF es demasiado grande → dividir

### 1.3 Actores (Obligatorio)

```markdown
## Actores

| Actor              | Rol en este RF             | Permisos requeridos     |
| ------------------ | -------------------------- | ----------------------- |
| {Actor principal}  | {Qué hace en este RF}      | {Qué permisos necesita} |
| {Actor secundario} | {Qué hace}                 | {Qué permisos necesita} |
| {Sistema}          | {Qué hace automáticamente} | N/A                     |
```

**Reglas:**

- Los actores deben existir en el stakeholder map del proyecto
- Siempre distinguir entre actor humano y sistema/servicio
- Si un actor aparece en múltiples RFs, usar el mismo nombre consistentemente (ver `docs/checklists/rf-coherence.md`)

### 1.4 Alcance (Obligatorio)

```markdown
## Alcance

### Incluye

- {Funcionalidad 1 que SÍ cubre este RF}
- {Funcionalidad 2 que SÍ cubre}

### Excluye

- {Funcionalidad 1 que explícitamente NO cubre} → cubierta por RF-{PROY}-{XXX}
- {Funcionalidad 2 que NO cubre} → fuera de scope del proyecto
```

**Reglas:**

- Las exclusiones son tan importantes como las inclusiones
- Cada exclusión debe referenciar dónde se cubre (otro RF o "fuera de scope")
- Si no hay exclusiones, escribir "Sin exclusiones explícitas — todo lo descrito en Objetivo está en scope"

### 1.5 Prerrequisitos (Obligatorio si existen)

```markdown
## Prerrequisitos

| Prerrequisito                  | Tipo    | Estado                             |
| ------------------------------ | ------- | ---------------------------------- |
| RF-{PROY}-{XXX}: {descripción} | RF      | Aprobado / En Revisión / Pendiente |
| {Condición técnica}            | Técnico | Cumplido / Pendiente               |
| {Condición de negocio}         | Negocio | Cumplido / Pendiente               |
```

**Reglas:**

- Prerrequisitos de tipo RF deben existir en el mismo proyecto
- Verificar que no se crean dependencias circulares (ver coherence checklist)
- Si un prerrequisito está "Pendiente", este RF no puede pasar a "Aprobado"

---

## 2. Comportamiento (Obligatorio)

### 2.1 Flujo Principal

```markdown
## Flujo Principal

### Precondiciones

- {Qué debe ser verdad antes de iniciar este flujo}
- {Estado del sistema/datos necesarios}

### Pasos

1. **{Actor}** {acción en presente indicativo — ej: "selecciona la opción X"}
2. **{Sistema}** {respuesta/acción automática — ej: "valida los datos ingresados"}
3. **{Actor}** {siguiente acción}
4. **{Sistema}** {resultado — ej: "muestra confirmación con mensaje: '{texto exacto}'"}

### Postcondiciones

- {Estado del sistema después del flujo exitoso}
- {Datos creados/modificados/eliminados}
- {Notificaciones enviadas}
```

**Reglas de los pasos:**

- Cada paso tiene un actor explícito (humano o sistema)
- Verbos en presente indicativo: "selecciona", "valida", "muestra" — no "seleccionará"
- Mensajes al usuario entre comillas con texto exacto
- Máximo 10 pasos en flujo principal. Si más → dividir RF

### 2.2 Flujos Alternativos

```markdown
## Flujos Alternativos

### FA-{N}: {Nombre descriptivo del flujo alternativo}

- **Punto de bifurcación**: Paso {N} del flujo principal
- **Condición de activación**: {Cuándo se toma este camino alternativo}
- **Pasos**:
  1. **{Actor}** {acción alternativa}
  2. **{Sistema}** {respuesta}
- **Punto de retorno**: Paso {M} del flujo principal | Fin del flujo
```

**Reglas:**

- Mínimo 1 flujo alternativo por RF (excepto RFs triviales con justificación)
- Cada alternativo debe indicar de dónde sale (punto de bifurcación) y a dónde vuelve (punto de retorno)
- Si hay más de 3 alternativas complejas, considerar si este RF debería dividirse

### 2.3 Flujos de Error

```markdown
## Flujos de Error

### FE-{N}: {Nombre del error}

- **Condición de activación**: {Cuándo ocurre este error — ser específico}
- **Comportamiento esperado**:
  1. **{Sistema}** {acción ante el error}
  2. **{Sistema}** muestra mensaje: "{Texto exacto del mensaje de error}"
- **Recuperación**: {Cómo puede el usuario recuperarse del error}
- **Logging**: {Qué se loggea — nivel, datos, sin PII}
```

**Reglas:**

- Mínimo 1 flujo de error por RF
- Mensajes de error con texto exacto (entre comillas)
- Siempre incluir camino de recuperación (¿qué puede hacer el usuario?)
- Nunca exponer detalles técnicos al usuario en el mensaje de error

### 2.4 Reglas de Negocio

```markdown
## Reglas de Negocio

| ID            | Regla                | Lógica                                           | Fuente                                           |
| ------------- | -------------------- | ------------------------------------------------ | ------------------------------------------------ |
| RN-{RF-ID}-01 | {Nombre de la regla} | {Lógica exacta: condiciones, fórmulas, umbrales} | {Quién definió esta regla: PO, regulación, etc.} |
| RN-{RF-ID}-02 |                      |                                                  |                                                  |
```

**Reglas:**

- Cada RN tiene ID único vinculado al RF
- La lógica debe ser precisa: no "aproximadamente X" sino "exactamente X"
- Incluir fuente para trazabilidad (quién definió la regla)
- RNs compartidas entre RFs se documentan en cada RF que las usa (con referencia cruzada)

---

## 3. Criterios de Aceptación — BDD (Obligatorio)

```gherkin
## Criterios de Aceptación

### CA-{RF-ID}-01: {Nombre descriptivo del criterio}

Scenario: Happy path — {descripción breve}
  Given {precondición con datos concretos}
    And {precondición adicional con datos concretos}
  When {acción del usuario — 1 acción atómica}
  Then {resultado esperado observable y verificable}
    And {resultado adicional}

Scenario: Alternativo — {descripción}
  Given {precondición diferente con datos concretos}
  When {acción del usuario}
  Then {resultado diferente}

Scenario: Error — {descripción del error}
  Given {precondición que causa el error}
  When {acción del usuario}
  Then {sistema muestra mensaje: "{texto exacto}"}
    And {sistema loggea evento de nivel WARN/ERROR}
    And {usuario puede: "{acción de recuperación}"}

### CA-{RF-ID}-02: {Otro criterio}
...
```

**Reglas de los criterios BDD:**

| Regla                          | Detalle                                  | Ejemplo malo → bueno                                              |
| ------------------------------ | ---------------------------------------- | ----------------------------------------------------------------- |
| **Datos concretos**            | No usar abstractos                       | "un usuario" → "usuario admin con email admin@corp.com"           |
| **Acciones atómicas**          | 1 When = 1 acción                        | "When ingresa datos y hace clic" → Separar en 2 scenarios         |
| **Resultados observables**     | Verificable por QA                       | "funciona correctamente" → "muestra mensaje: 'Operación exitosa'" |
| **Sin ambigüedades**           | Prohibidos: debería, podría, normalmente | "debería mostrar" → "muestra"                                     |
| **Mínimos por RF**             | ≥1 happy + ≥1 error                      | Si solo hay happy path → agregar error                            |
| **Precondiciones alcanzables** | Given debe ser un estado reproducible    | "Given el sistema está en modo especial" → describir cómo llegar  |

---

## 4. Metadatos (Obligatorio)

### 4.1 Dependencias

```markdown
## Dependencias

| Tipo                   | RF              | Descripción                                        |
| ---------------------- | --------------- | -------------------------------------------------- |
| **Depende de**         | RF-{PROY}-{XXX} | {Por qué depende — qué necesita de ese RF}         |
| **Es prerequisito de** | RF-{PROY}-{YYY} | {Qué RF necesita que este esté listo}              |
| **Relacionado con**    | RF-{PROY}-{ZZZ} | {Relación no bloqueante — comparten entidad/flujo} |
```

### 4.2 Notas Técnicas (Opcional pero recomendado)

```markdown
## Notas Técnicas

{Consideraciones técnicas relevantes para implementación. No es especificación técnica,
sino contexto que ayuda al dev a entender restricciones o sugerencias.}

- {Restricción de API: endpoint X tiene rate limit de N/min}
- {Dato: tabla Y ya tiene campo Z que puede reutilizarse}
- {Consideración de performance: query sobre tabla con >1M registros}
```

### 4.3 Historial de Cambios (Obligatorio)

```markdown
## Historial de Cambios

| Versión | Fecha      | Autor    | Cambio                   | Aprobado por   |
| ------- | ---------- | -------- | ------------------------ | -------------- |
| 1.0     | YYYY-MM-DD | {Nombre} | Versión inicial          | —              |
| 1.1     | YYYY-MM-DD | {Nombre} | {Descripción del cambio} | {PO/Tech Lead} |
```

---

## 5. Reglas Globales del Formato

### 5.1 Reglas Estrictas (Violación = RF rechazado)

| #   | Regla                                                                       | Verificación |
| --- | --------------------------------------------------------------------------- | ------------ |
| 1   | **ID único**: RF-{PROY}-{NNN} secuencial sin gaps ni duplicados             | Automática   |
| 2   | **Criterios BDD obligatorios**: Mínimo 1 happy path + 1 error               | Automática   |
| 3   | **Sin ambigüedades**: Prohibidos "debería", "podría", "normalmente", "etc." | Automática   |
| 4   | **Datos concretos**: Criterios con datos de ejemplo reales, no abstractos   | Automática   |
| 5   | **Testable**: Cada criterio verificable por QA (automática o manualmente)   | Semi-auto    |
| 6   | **Actor explícito**: Cada paso tiene actor claro (humano o sistema)         | Automática   |
| 7   | **Mensajes exactos**: Mensajes al usuario con texto exacto entre comillas   | Automática   |
| 8   | **Flujo de error**: Mínimo 1 flujo de error con recuperación documentada    | Automática   |

### 5.2 Recomendaciones (No bloquean pero mejoran calidad)

| #   | Recomendación                    | Beneficio                               |
| --- | -------------------------------- | --------------------------------------- |
| 1   | ≤10 pasos en flujo principal     | RFs más granulares y mantenibles        |
| 2   | ≥3 escenarios BDD por RF         | Mayor cobertura de testing              |
| 3   | Notas técnicas incluidas         | Dev tiene más contexto para implementar |
| 4   | Flujos alternativos documentados | Reduce ambigüedad mid-sprint            |
| 5   | RN con fórmulas exactas          | No queda a interpretación del dev       |

---

## 6. Ejemplo Completo — RF de Referencia

```markdown
---
id: RF-BIO-001
título: Enrolamiento facial con validación de liveness
versión: 1.0
estado: Aprobado
prd_origen: PRD-T-BIO §3.2, PRD-F-BIO §2.1
autor: María González
fecha_creación: 2025-11-15
fecha_última_modificación: 2025-11-20
prioridad: Must Have
complejidad: Alta
estimación_sprint: Sprint 3
---

## Objetivo

Permitir a un usuario nuevo registrar su identidad facial con verificación
de que es una persona real (liveness detection), almacenando el template
biométrico de forma segura para futuras autenticaciones.

## Actores

| Actor               | Rol                                      | Permisos                  |
| ------------------- | ---------------------------------------- | ------------------------- |
| Usuario nuevo       | Inicia enrolamiento, sigue instrucciones | Acceso público (pre-auth) |
| {{CLIENT_NAME}} SDK | Captura imagen, ejecuta liveness         | API key válida            |
| Backend API         | Procesa template, almacena cifrado       | Service account           |

## Alcance

### Incluye

- Captura de imagen facial via cámara
- Liveness detection (anti-spoofing)
- Generación y almacenamiento de template biométrico

### Excluye

- Verificación 1:1 contra template existente → RF-BIO-002
- Gestión de consentimiento GDPR → RF-BIO-005

## Criterios de Aceptación

### CA-BIO-001-01: Enrolamiento exitoso

Scenario: Happy path — usuario con buena iluminación
Given usuario "juan.perez@example.com" no tiene template biométrico
And la cámara del dispositivo está activa
And la iluminación es ≥300 lux (sensor)
When el usuario posiciona su rostro dentro del óvalo guía
And el sistema detecta liveness score ≥0.95
Then el sistema genera template biométrico
And almacena template cifrado (AES-256) vinculado al usuario
And muestra mensaje: "Registro facial completado exitosamente"
And loggea evento: ENROLLMENT_SUCCESS (sin PII)

Scenario: Error — liveness detection falla
Given usuario posiciona su rostro dentro del óvalo guía
And el sistema detecta liveness score <0.95
When el intento de liveness falla 3 veces consecutivas
Then el sistema muestra: "No pudimos verificar que es una persona real.
Intente en un lugar con mejor iluminación."
And loggea evento: ENROLLMENT_LIVENESS_FAIL (attempt_count, score, sin PII)
And el usuario puede: reintentar o cancelar

## Reglas de Negocio

| ID            | Regla              | Lógica                                        | Fuente               |
| ------------- | ------------------ | --------------------------------------------- | -------------------- |
| RN-BIO-001-01 | Liveness threshold | Score ≥0.95 para PASS                         | Security Policy v2.1 |
| RN-BIO-001-02 | Max intentos       | 3 intentos fallidos → bloqueo temporal 5 min  | UX Guidelines        |
| RN-BIO-001-03 | Cifrado template   | AES-256-GCM, key en KMS, key rotation 90 días | GDPR Art. 9          |

## Dependencias

| Tipo               | RF         | Descripción                              |
| ------------------ | ---------- | ---------------------------------------- |
| Es prerequisito de | RF-BIO-002 | Verificación requiere template existente |
| Relacionado con    | RF-BIO-005 | Consentimiento GDPR necesario antes      |
```

---

## 7. Conexión con el Flujo SDLC

```
PRD aprobado (Gate 1) → RFs generados (skill: generate-rf) → Coherence check → Gate 2
                            ↑                                        ↑
                     Este formato obligatorio              docs/checklists/rf-coherence.md
```

### Referencias Cruzadas

- **Generación de RFs**: `skills/generate-rf/SKILL.md` — usa este formato como output
- **Coherence Check**: `docs/checklists/rf-coherence.md` — valida RFs generados
- **User Stories (siguiente)**: `skills/user-stories/SKILL.md` — consume RFs como input
- **Review Cruzado**: `docs/checklists/review-cruzado.md` — PRDs → RFs
- **Org Standards**: `docs/standards/org.md` — Gate 2 criteria

---

_Formato de referencia para toda generación de RFs._
_El skill generate-rf DEBE producir RFs en este formato exacto. Desviaciones son rechazadas._
