---
id: generate-rf-{{CLIENT_CODE}}-examples
version: "1.0.0"
last_updated: "2026-03-25"
updated_by: "TL: tier3-remediation"
status: active
type: example
domain: domain-specific-identity
---

# {{CLIENT_NAME}} Domain RF Examples

> **Purpose**: Domain-specific RF examples for domain-specific identity verification systems.
> These examples are intentionally kept here as reference for {{CLIENT_NAME}}-context usage.
> The main SKILL.md uses generic, domain-agnostic examples for portability.

---

## Common domain-specific RF Patterns

- **Enrollment RFs**: Capture → Quality Check → Liveness → Template Generation → Secure Storage
- **Verification RFs**: Capture → Quality Check → Liveness → Template Match → Decision
- **Document RFs**: OCR → Field Extraction → Validation → Data Mapping
- **Integration RFs**: API calls, webhook notifications, audit logging (no PII)

## domain-specific RF Clusters

- **User Onboarding**: consent → document capture → face enrollment → verification test
- **Authentication Flow**: face capture → quality check → liveness → 1:1 match → access grant
- **Document Processing**: image capture → OCR → field extraction → validation → data mapping
- **Compliance & Security**: audit logging → data encryption → retention management → deletion

## domain-specific BDD Best Practices

- **Always specify quality thresholds**: liveness ≥0.95, similarity ≥0.82, image resolution ≥1080p
- **Concrete sensitive data**: template size (512 bytes), processing time (<2s), failure counts (3 max)
- **GDPR compliance**: Never log data templates, always specify encryption (AES-256)
- **Error recovery paths**: What user can do after liveness fail, low quality, no match
- **Security logging**: Event names without PII: ENROLLMENT_SUCCESS, VERIFICATION_FAIL

---

## Example 1: Facial Enrollment with Liveness

````markdown
# RF-BIO-001: Enrolamiento facial con validación de liveness

| Campo           | Valor      |
| --------------- | ---------- |
| **ID**          | RF-BIO-001 |
| **Versión**     | 1.0        |
| **Estado**      | Borrador   |
| **Prioridad**   | Must       |
| **Complejidad** | Alta       |

## Descripción

**Actor(es)**: Usuario nuevo (primary), {{CLIENT_NAME}} SDK (secondary), Backend API (secondary)
**Precondiciones**: Usuario autenticado en la app, cámara disponible, consentimiento GDPR otorgado
**Descripción Funcional**: El sistema DEBE permitir a un usuario capturar su imagen facial, validar que
es una persona real (liveness ≥0.95), generar template biométrico cifrado y almacenarlo de forma segura
para futuras verificaciones.

## Criterios de Aceptación (BDD)

### CA-BIO-001-01: Enrolamiento exitoso

```gherkin
Scenario: Happy path — captura exitosa con buena iluminación
  Given el usuario "juan.perez@example.com" no tiene template biométrico registrado
    And la cámara del dispositivo está activa y funcional
    And la iluminación ambiental es ≥300 lux
  When el usuario posiciona su rostro dentro del óvalo guía durante 3 segundos
    And el sistema ejecuta authenticity detection
  Then el sistema detecta liveness score 0.96 (≥0.95 threshold)
    And genera template biométrico único de 512 bytes
    And almacena template cifrado AES-256-GCM en base de datos
    And muestra mensaje: "Registro facial completado exitosamente"
    And loggea evento: "ENROLLMENT_SUCCESS" sin datos biométricos

Scenario: Error — authenticity detection falla por imagen estática
  Given el usuario presenta una fotografía impresa en papel
  When el sistema ejecuta authenticity detection
  Then el sistema detecta liveness score 0.23 (<0.95 threshold)
    And incrementa contador de intentos fallidos (3 máximo)
    And muestra mensaje: "No pudimos verificar que es una persona real. Intente con su rostro en vivo."
    And loggea evento: "ENROLLMENT_LIVENESS_FAIL" con score pero sin imagen
    And el usuario puede: reintentar o cancelar proceso
```
````

---

## Example 2: Document OCR with Field Validation

````markdown
# RF-DOC-005: Extracción OCR de DNI español con validación de campos

## Criterios de Aceptación (BDD)

### CA-DOC-005-01: Extracción exitosa de DNI

```gherkin
Scenario: Happy path — DNI válido con todos los campos
  Given el usuario ha capturado imagen de DNI español frente
    And la imagen tiene resolución ≥1080p y nitidez >80%
  When el sistema ejecuta OCR sobre la imagen
  Then extrae campo "nombres": "JUAN CARLOS"
    And extrae campo "apellidos": "GARCÍA LÓPEZ"
    And extrae campo "dni": "12345678Z"
    And extrae campo "fecha_nacimiento": "15/03/1985"
    And valida checksum DNI: 12345678Z → dígito Z correcto
    And muestra mensaje: "Documento procesado correctamente"
    And almacena datos extraídos en session temporalmente (no persistir)

Scenario: Error — imagen borrosa o ilegible
  Given el usuario captura imagen de DNI con nitidez <60%
  When el sistema ejecuta OCR
  Then detecta confianza OCR <80% en campos críticos
    And muestra mensaje: "Imagen no clara. Capture nuevamente con mejor iluminación"
    And sugiere: "Sostenga el documento firme y evite reflejos"
    And el usuario puede: reintentar captura o cancelar
```
````

---

## Example 3: 1:1 Facial Verification

````markdown
# RF-BIO-010: Verificación facial 1:1 con template existente

## Criterios de Aceptación (BDD)

### CA-BIO-010-01: Verificación exitosa

```gherkin
Scenario: Happy path — match exitoso con template existente
  Given el usuario "maria.gonzalez@corp.com" tiene template biométrico almacenado
    And el template fue creado <90 días (no expirado)
  When el usuario captura nueva imagen facial para verificación
    And el sistema ejecuta matching 1:1 contra template almacenado
  Then el sistema calcula similarity score 0.87 (≥0.82 threshold)
    And retorna resultado: "MATCH_SUCCESS"
    And loggea evento: "VERIFICATION_SUCCESS" con user_id pero sin datos biométricos
    And permite acceso al usuario autenticado
    And incrementa contador de verificaciones exitosas en métricas

Scenario: Error — no match con template existente
  Given el usuario presenta rostro diferente al template almacenado
  When el sistema ejecuta matching 1:1
  Then calcula similarity score 0.45 (<0.82 threshold)
    And retorna resultado: "MATCH_FAIL"
    And incrementa contador de intentos fallidos (5 máximo)
    And loggea evento: "VERIFICATION_FAIL" con user_id y score
    And muestra mensaje: "Verificación fallida. Intente nuevamente"
    And bloquea acceso temporalmente tras 5 intentos fallidos
```
````

---

## Anti-Patterns in domain-specific RFs

| Anti-Pattern                           | Correct Approach                                             | Why                                      |
| -------------------------------------- | ------------------------------------------------------------ | ---------------------------------------- |
| "RF-001: Complete facial verification" | Split into: enrollment, liveness, matching, storage          | Too broad — needs decomposition          |
| "authenticity detection works well"    | "liveness score ≥0.95 (threshold)"                           | Vague — needs concrete threshold         |
| "stores facial image securely"         | "stores template cifrado AES-256-GCM"                        | Images ≠ templates; need encryption spec |
| "logs user verification"               | "logs VERIFICATION_SUCCESS with user_id (no sensitive data)" | GDPR violation — no PII in logs          |
| "face quality is good"                 | "image resolution ≥1080p, nitidez >80%"                      | Subjective — needs measurable criteria   |
| "handles verification errors"          | Separate RF for each error type                              | One RF per behavior rule                 |

## Changelog

| Versión | Fecha      | Autor                 | Cambios                                                  |
| ------- | ---------- | --------------------- | -------------------------------------------------------- |
| 1.0.0   | 2026-03-25 | TL: tier3-remediation | Extracted from SKILL.md during domain-agnostic migration |
