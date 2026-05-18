---
id: security-policy-template
version: "1.0.0"
last_updated: "2026-03-16"
updated_by: "System: Template Migration"
status: active
type: template
review_cycle: 90
next_review: "2026-06-14"
owner_role: "Security Lead"
---

# SECURITY.md Template

> **Proposito**: Template para generar la politica de seguridad (SECURITY.md) de cualquier proyecto.
> **Criticidad**: ALTA — Manejo de datos sensibles requiere politicas claras.
> **Compilado desde**: Convenciones de seguridad, GDPR, OWASP guidelines.

---

## Estructura recomendada

```markdown
# Politica de Seguridad — {Nombre del Proyecto}

## Versiones soportadas

| Version | Soportada |
| ------- | --------- |
| x.y.z   | Si        |
| < x.0.0 | No        |

## Reportar una vulnerabilidad

Si descubres una vulnerabilidad de seguridad, por favor **NO abras un issue publico**.

### Canal de reporte

1. **Email**: security@{domain}.com
2. **Asunto**: `[SECURITY] {proyecto} — {breve descripcion}`
3. **PGP**: {Adjuntar PGP public key o enlace si aplica}

### Que incluir en el reporte

- Tipo de vulnerabilidad (ej: XSS, SQLi, IDOR, privilege escalation)
- Pasos para reproducir
- Impacto estimado (confidencialidad, integridad, disponibilidad)
- Version afectada
- Posible mitigacion (si la conoces)

### SLA de respuesta

| Accion                   | Tiempo           |
| ------------------------ | ---------------- |
| Acuse de recibo          | 24 horas habiles |
| Evaluacion inicial       | 72 horas habiles |
| Plan de remediacion      | 7 dias habiles   |
| Fix desplegado (critico) | 14 dias habiles  |
| Fix desplegado (alto)    | 30 dias habiles  |

### Reconocimiento

Agradecemos a los investigadores responsables. Si lo deseas, incluiremos tu nombre
en nuestro Hall of Fame de seguridad (salvo que prefieras anonimato).

## Practicas de seguridad del proyecto

### Datos sensibles

Este proyecto puede procesar datos sensibles. Aplicamos:

- **Cifrado en transito**: TLS 1.2+ minimo
- **Cifrado en reposo**: AES-256 minimo
- **Logging**: NUNCA se loguean datos PII/sensibles
- **Retencion**: Politica de retencion minima documentada

### OWASP Top 10

Evaluamos continuamente contra OWASP Top 10 (2021) via:

- SAST automatizado en cada PR
- SCA (dependency audit) en cada build
- DAST periodico en staging
- Pen testing antes de releases major

### Security headers

- Content-Security-Policy (CSP)
- Strict-Transport-Security (HSTS)
- X-Frame-Options
- X-Content-Type-Options

### Dependencias

- Audit automatico en CI/CD (`npm audit` / `snyk` / equivalente)
- Renovate/Dependabot para actualizaciones automaticas
- SCA scanning para vulnerabilidades conocidas
```

---

## Notas para el generador

- Los SLAs de respuesta deben alinearse con la politica corporativa
- El email de security debe ser validado con el equipo de seguridad
- Adaptar la seccion de datos sensibles segun el tipo de proyecto
- El skill `security-checklist` valida que estas practicas se cumplan pre-deploy
