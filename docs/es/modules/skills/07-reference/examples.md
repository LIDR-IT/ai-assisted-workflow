# Ejemplos de Skills: Patrones de Trabajo Completos

Este documento proporciona 10 ejemplos completos de skills listos para producción, demostrando diferentes patrones y niveles de complejidad. Cada ejemplo incluye la estructura completa de directorios, todos los archivos de soporte y explicación de cuándo usar ese patrón.

**Organización:** Simple → Estándar → Complejo

---

## Skills Simples (Solo Instrucciones)

### 1. Skill de Revisión de Código (Instrucción Simple)

**Caso de Uso:** Proporcionar guía sistemática de revisión de código sin scripts externos o plantillas.

**Cuándo Usar Este Patrón:**
- Guía basada en instrucciones puras es suficiente
- No se necesitan plantillas o scripts
- El conocimiento del dominio puede expresarse en texto

**Estructura de Directorios:**
```
code-review/
└── SKILL.md
```

**Archivo:** `.claude/skills/code-review/SKILL.md`

```markdown
---
name: code-review
description: Review code for bugs, performance, security, and best practices. Use when user asks to review code files or pull requests.
---

# Code Review

Systematically review code for quality issues.

## Security

Check for:
- SQL injection vulnerabilities (parameterized queries?)
- XSS attack vectors (input sanitization?)
- Authentication bypass risks (access control?)
- Sensitive data exposure (secrets in code?)
- CSRF protection (state-changing operations?)

## Performance

Check for:
- N+1 query problems (database calls in loops?)
- Missing database indexes (slow queries?)
- Inefficient algorithms (O(n²) where O(n) possible?)
- Memory leaks (event listeners cleaned up?)
- Unnecessary re-renders (React memoization?)

## Best Practices

Check for:
- Code organization (separation of concerns?)
- Error handling (edge cases covered?)
- Type safety (TypeScript strict mode?)
- Documentation (complex logic explained?)
- Test coverage (critical paths tested?)

## Output Format

Provide findings as:
- **File:Line** - Issue description
- **Severity:** Critical/High/Medium/Low
- **Recommendation:** Specific fix

Example:
```
src/api/users.js:45 - SQL injection risk
Severity: Critical
Recommendation: Use parameterized query: db.query('SELECT * FROM users WHERE id = ?', [userId])
```

## Focus

Prioritize:
1. Security issues (always highest priority)
2. Bugs and correctness
3. Performance problems
4. Best practice violations
```

**Por Qué Funciona:**
- Instrucciones concisas (~50 líneas)
- Estructura clara para revisión sistemática
- No se necesitan dependencias o scripts
- Fácilmente personalizable para codebases específicos

---

### 2. Skill de Formateador de Commits (Enforcer de Convenciones)

**Caso de Uso:** Hacer cumplir estándares de commits convencionales con validación basada en instrucciones.

**Cuándo Usar Este Patrón:**
- Hacer cumplir formatos estructurados
- Validar contra especificaciones
- Proporcionar reglas y ejemplos claros

**Estructura de Directorios:**
```
git-commit-formatter/
└── SKILL.md
```

**Archivo:** `.claude/skills/git-commit-formatter/SKILL.md`

```markdown
---
name: git-commit-formatter
description: Enforces Conventional Commits specification for git commit messages with type, scope, and description. Use when creating or validating commit messages.
---

# Git Commit Formatter

Ensure all commit messages follow Conventional Commits specification.

## Format

```
type(scope): description

[optional body]

[optional footer]
```

## Types

- **feat** - New feature
- **fix** - Bug fix
- **docs** - Documentation only
- **style** - Code formatting (no logic change)
- **refactor** - Code restructure (no behavior change)
- **test** - Adding/updating tests
- **chore** - Maintenance (dependencies, configs)
- **perf** - Performance improvement

## Rules

1. Type must be lowercase
2. Scope is optional but recommended (component/module name)
3. Description must be:
   - Lowercase after colon
   - Imperative mood ("add" not "added")
   - No period at end
   - Under 50 characters
4. Body explains WHY (not how)
5. Footer for breaking changes or issue references

## Examples

**Good:**
```
feat(auth): add OAuth2 login support
fix(api): resolve race condition in user update
docs(readme): update installation instructions
refactor(database): extract query builder logic
```

**Bad:**
```
Added new feature          ❌ No type, past tense
fix: Fixed stuff.          ❌ Vague, period at end
FEAT(API): Add Endpoint    ❌ Uppercase
fix(api): Fixed the bug that was causing issues with the user authentication flow
                          ❌ Too long (>50 chars)
```

## Breaking Changes

```
feat(api): change authentication endpoint

BREAKING CHANGE: Auth endpoint now requires POST instead of GET.
Update all API clients to use POST /auth/login.

Refs: #234
```

## Validation Checklist

Before committing:
- [ ] Type is valid (feat, fix, docs, etc.)
- [ ] Subject under 50 characters
- [ ] Imperative mood ("add" not "added")
- [ ] Lowercase after type(scope):
- [ ] No period at end of subject
- [ ] Body explains WHY (if present)
- [ ] Breaking changes documented
```

**Por Qué Funciona:**
- Especificación clara con ejemplos
- Ejemplos buenos/malos ayudan al aprendizaje
- Checklist de validación para auto-verificación
- No se necesitan scripts para validación simple

---

## Skills Estándar (Con Archivos de Soporte)

### 3. Generador de API Endpoints (Basado en Plantillas)

**Caso de Uso:** Generar endpoints de API consistentes con validación, manejo de errores y tests.

**Cuándo Usar Este Patrón:**
- Generación de código desde plantillas
- Se necesita estructura de archivos consistente
- Múltiples archivos relacionados creados juntos

**Estructura de Directorios:**
```
api-generator/
├── SKILL.md
├── assets/
│   ├── endpoint-template.ts
│   ├── validation-schema.ts
│   └── test-template.spec.ts
└── references/
    └── rest-patterns.md
```

**Archivo:** `.claude/skills/api-generator/SKILL.md`

```markdown
---
name: api-generator
description: Generate REST API endpoints with TypeScript, Zod validation, error handling, and tests. Use when creating new API routes.
---

# API Endpoint Generator

Generate production-ready API endpoints following REST best practices.

## Process

1. Identify HTTP method (GET, POST, PUT, DELETE)
2. Define input schema with Zod
3. Generate endpoint from template
4. Add error handling
5. Create tests

## Endpoint Structure

Every endpoint should include:

1. **Input validation** - Zod schema
2. **Authentication** - Check user permissions
3. **Business logic** - Core functionality
4. **Error handling** - Try/catch with typed errors
5. **Response formatting** - Consistent structure

## Templates

Use these templates as starting points:

- `assets/endpoint-template.ts` - Base endpoint structure
- `assets/validation-schema.ts` - Zod validation patterns
- `assets/test-template.spec.ts` - Test file structure

## Example Generation

**User request:** "Create endpoint to fetch user by ID"

**Generated files:**

1. **`src/api/users/get-user.ts`** (from endpoint-template.ts)
2. **`src/api/users/schemas.ts`** (from validation-schema.ts)
3. **`tests/api/users/get-user.spec.ts`** (from test-template.spec.ts)

## Best Practices

See `references/rest-patterns.md` for:
- RESTful URL design
- Status code selection
- Error response format
- Pagination patterns
- Rate limiting

## Output

Present generated code with explanations:
- What each section does
- Why this structure is used
- How to customize for specific needs
```

**Archivo:** `assets/endpoint-template.ts`

```typescript
import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { db } from '@/lib/database';
import { AppError } from '@/lib/errors';

// Define input validation schema
const QuerySchema = z.object({
  id: z.string().uuid(),
});

/**
 * [ENDPOINT_DESCRIPTION]
 *
 * @route [HTTP_METHOD] /api/[RESOURCE]
 * @access [Public/Private]
 */
export async function [HANDLER_NAME](
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // 1. Validate input
    const { id } = QuerySchema.parse(req.params);

    // 2. Check authentication/authorization
    if (!req.user) {
      throw new AppError('Unauthorized', 401);
    }

    // 3. Execute business logic
    const result = await db.[TABLE].findUnique({
      where: { id },
    });

    if (!result) {
      throw new AppError('[RESOURCE] not found', 404);
    }

    // 4. Return success response
    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    // 5. Handle errors
    next(error);
  }
}
```

**Por Qué Funciona:**
- Las plantillas previenen escritura repetitiva
- Estructura consistente en todo el codebase
- Placeholders como `[RESOURCE]` son fáciles de reemplazar
- Cubre patrones comunes (validación, auth, manejo de errores)

---

### 4. Añadidor de Encabezado de Licencia (Basado en Assets)

**Caso de Uso:** Añadir encabezados de licencia a archivos fuente sin duplicar texto de licencia en SKILL.md.

**Cuándo Usar Este Patrón:**
- Contenido estático que no debería estar en SKILL.md
- Múltiples variantes del mismo contenido
- Texto legal o boilerplate

**Estructura de Directorios:**
```
license-header-adder/
├── SKILL.md
└── resources/
    ├── mit-header.txt
    ├── apache-header.txt
    └── proprietary-header.txt
```

**Por Qué Funciona:**
- Previene inflar SKILL.md con texto de licencia
- Fácil añadir nuevos tipos de licencia
- Separación clara de instrucciones vs contenido

---

### 5. Conversor de JSON a Pydantic (Basado en Ejemplos)

**Caso de Uso:** Transformar JSON a modelos Pydantic usando few-shot learning.

**Cuándo Usar Este Patrón:**
- Patrones de transformación más fáciles de mostrar que describir
- Múltiples pares de ejemplos demuestran casos extremos
- El aprendizaje visual ayuda a la comprensión

**Estructura de Directorios:**
```
json-to-pydantic/
├── SKILL.md
└── examples/
    ├── basic-input.json
    ├── basic-output.py
    ├── nested-input.json
    ├── nested-output.py
    ├── array-input.json
    └── array-output.py
```

**Por Qué Funciona:**
- Los ejemplos muestran patrones mejor que el texto
- Múltiples ejemplos cubren casos extremos
- Los usuarios pueden referenciar estructuras similares
- Complejidad progresiva (básico → anidado → arrays)

---

## Skills Avanzados (Basados en Scripts)

### 6. Validador de Esquema de Base de Datos (Basado en Scripts)

**Caso de Uso:** Validar migraciones SQL con verificaciones determinísticas que requieren lógica precisa.

**Cuándo Usar Este Patrón:**
- Validación determinística mejor en código
- Lógica compleja difícil de describir en texto
- Se necesitan verificaciones repetibles

**Estructura de Directorios:**
```
database-schema-validator/
├── SKILL.md
└── scripts/
    ├── validate.py
    └── check_migrations.sh
```

**Por Qué Funciona:**
- Verificaciones determinísticas más confiables que juicio de LLM
- El script proporciona validación consistente y repetible
- Salida JSON fácil de analizar y presentar
- Puede integrarse en pipeline CI/CD

---

### 7. Generador de Componentes React (Orquestación Compleja)

**Caso de Uso:** Generar componente React completo con TypeScript, estilos, tests y story de Storybook.

**Cuándo Usar Este Patrón:**
- Generación multi-archivo con relaciones
- Orquestación de múltiples pasos
- Transformaciones y validaciones complejas

**Estructura de Directorios:**
```
react-component-generator/
├── SKILL.md
├── scripts/
│   ├── generate.py
│   └── validate-component.sh
├── assets/
│   ├── component.tsx.template
│   ├── styles.module.css.template
│   ├── test.spec.tsx.template
│   └── story.stories.tsx.template
└── references/
    └── component-patterns.md
```

**Por Qué Funciona:**
- Orquesta generación de múltiples archivos relacionados
- El script maneja manipulación compleja de strings
- Las plantillas aseguran consistencia
- La validación detecta errores comunes
- Todas las convenciones aplicadas automáticamente

---

## Skills Complejos (Full-Featured)

### 8. Flujo de Trabajo de Deployment (Completo)

**Caso de Uso:** Orquestar deployment completo con verificaciones previas, deployment y monitoreo.

**Cuándo Usar Este Patrón:**
- Flujos de trabajo multi-paso con dependencias
- Operaciones críticas que requieren verificaciones de seguridad
- Combinación de scripts, plantillas y documentación

**Estructura de Directorios:**
```
deployment/
├── SKILL.md
├── scripts/
│   ├── pre-deploy-check.sh
│   ├── deploy.sh
│   └── rollback.sh
├── references/
│   ├── deployment-checklist.md
│   ├── rollback-procedures.md
│   └── monitoring.md
└── assets/
    ├── deploy-config.template.yml
    └── nginx.conf.template
```

**Por Qué Funciona:**
- Verificaciones de seguridad completas
- Automatizado donde sea posible, manual donde sea necesario
- Procedimientos claros de rollback
- Documentación para casos extremos
- Combina scripts (automatización) con checklists (verificación)

---

### 9. Skill de Auditoría de Seguridad (Revisión/Análisis)

**Caso de Uso:** Auditoría de seguridad completa con verificaciones automatizadas y guía de revisión manual.

**Cuándo Usar Este Patrón:**
- Procesos de revisión sistemática
- Combinar herramientas automatizadas con juicio humano
- Operaciones críticas de seguridad
- Requisitos de audit trail

**Estructura de Directorios:**
```
security-audit/
├── SKILL.md
├── scripts/
│   ├── scan-dependencies.sh
│   ├── check-secrets.py
│   └── analyze-permissions.sh
└── references/
    ├── owasp-top-10.md
    ├── common-vulnerabilities.md
    └── remediation-guide.md
```

**Por Qué Funciona:**
- Combina escaneo automatizado con revisión manual
- Cobertura sistemática de dominios de seguridad
- Clasificación clara de severidad
- Guía de remediación accionable
- Scripts detectan problemas obvios, humanos revisan riesgos matizados

---

### 10. Generador de Features Full-Stack (Máxima Complejidad)

**Caso de Uso:** Generar feature completo en frontend, backend, base de datos y tests.

**Cuándo Usar Este Patrón:**
- Implementación de feature end-to-end
- Múltiples tecnologías involucradas
- Consistencia arquitectónica crítica
- Generación de código a gran escala

**Estructura de Directorios:**
```
feature-generator/
├── SKILL.md
├── scripts/
│   ├── generate-feature.py
│   ├── generate-frontend.py
│   ├── generate-backend.py
│   └── generate-tests.py
├── assets/
│   ├── frontend/
│   │   ├── component.tsx.template
│   │   ├── hook.ts.template
│   │   └── page.tsx.template
│   ├── backend/
│   │   ├── controller.ts.template
│   │   ├── service.ts.template
│   │   └── repository.ts.template
│   ├── database/
│   │   └── migration.sql.template
│   └── tests/
│       ├── unit.spec.ts.template
│       ├── integration.spec.ts.template
│       └── e2e.spec.ts.template
└── references/
    ├── architecture.md
    ├── conventions.md
    └── examples.md
```

**Por Qué Funciona:**
- Generación end-to-end completa
- Mantiene consistencia arquitectónica
- Reduce boilerplate significativamente
- Hace cumplir mejores prácticas automáticamente
- Scripts manejan orquestación compleja
- Plantillas aseguran línea base de calidad

---

## Tabla Resumen

| # | Skill | Complejidad | Patrón | Caso de Uso |
|---|-------|------------|---------|----------|
| 1 | Code Review | Simple | Instrucciones | Guía de revisión sistemática |
| 2 | Commit Formatter | Simple | Instrucciones | Hacer cumplir convenciones |
| 3 | API Generator | Estándar | Plantillas | Creación consistente de endpoints |
| 4 | License Header | Estándar | Assets | Distribución de contenido estático |
| 5 | JSON to Pydantic | Estándar | Ejemplos | Patrones de transformación |
| 6 | Schema Validator | Avanzado | Scripts | Validación determinística |
| 7 | React Generator | Avanzado | Scripts + Plantillas | Generación multi-archivo |
| 8 | Deployment | Complejo | Scripts + Docs | Flujos de trabajo críticos |
| 9 | Security Audit | Complejo | Scripts + Manual | Revisión completa |
| 10 | Feature Generator | Complejo | Orquestación Completa | Features end-to-end |

---

## Elegir el Patrón Correcto

**Usar Simple (Solo Instrucciones) cuando:**
- La guía es directa
- No se necesitan plantillas o scripts
- Toma de decisiones pura o revisión

**Usar Estándar (Con Archivos de Soporte) cuando:**
- Las plantillas reducen repetición
- Los ejemplos clarifican patrones
- Se necesitan assets estáticos

**Usar Avanzado (Basado en Scripts) cuando:**
- Se requiere validación determinística
- Se necesitan transformaciones complejas
- La verificación automatizada es beneficiosa

**Usar Complejo (Full-Featured) cuando:**
- Se requiere orquestación multi-paso
- Operaciones críticas necesitan verificaciones de seguridad
- La generación end-to-end es valiosa

---

**Última Actualización:** Febrero 2026
**Categoría:** Desarrollo de Skills
**Completitud:** 10 ejemplos listos para producción con código completo
