# Creación de Skills: Flujo de Trabajo Completo

## Descripción General

Esta guía proporciona un flujo de trabajo comprehensivo y paso a paso para crear skills efectivos en todas las plataformas de agentes de IA. Los skills son paquetes de capacidades modulares que extienden a los agentes de IA con conocimiento especializado, flujos de trabajo y herramientas a través de divulgación progresiva.

**Principio Clave:** Los skills transforman asistentes de IA generales en expertos de dominio especializados proporcionando conocimiento justo a tiempo cuando se necesita, previniendo la saturación del contexto mientras habilitan expertise profundo.

---

## Prerrequisitos

Antes de crear un skill, asegúrate de entender:

- **Divulgación progresiva:** Los skills cargan metadatos primero, contenido completo solo cuando se activa
- **Mecanismo de activación:** El campo `description` determina cuándo los skills se activan
- **Tipos de recursos:** SKILL.md, scripts/, references/, examples/, assets/
- **Patrones de plataforma:** Dónde viven los skills y cómo se descubren

**Documentación Relacionada:**
- [Principios de Diseño](../03-creating-skills/design-principles.md) - Conceptos fundamentales de skills
- [Patrones de Skills](../03-creating-skills/skill-patterns.md) - Arquitecturas comunes de skills

---

## El Proceso de Creación en 10 Pasos

### Paso 1: Entender Primero los Casos de Uso

**Objetivo:** Recopilar ejemplos concretos antes de escribir nada.

**Por Qué Importa Esto:** Los skills fallan cuando se construyen alrededor de conceptos abstractos en lugar de patrones de uso real. Comenzar con ejemplos concretos asegura que tu skill resuelva problemas reales.

#### Preguntas a Responder

**Propósito Principal:**
- ¿Qué tareas específicas manejará este skill?
- ¿Qué frases exactas dirían los usuarios para activarlo?
- ¿Cuáles son las variaciones comunes de esas peticiones?

**Análisis de Entrada/Salida:**
- ¿Qué entradas proporcionarán los usuarios?
- ¿Qué salidas debe producir el skill?
- ¿Qué variaciones de formato existen?

**Casos Extremos:**
- ¿Qué entradas inusuales podrían ocurrir?
- ¿Qué condiciones de error necesitan manejarse?
- ¿Qué limitaciones específicas de plataforma existen?

#### Proceso de Análisis de Ejemplo

**Tarea:** Crear un skill para generar endpoints de API

**Ejemplos de Uso Concretos:**
```
1. "Crea un endpoint GET para obtener usuarios"
2. "Genera un endpoint POST con validación"
3. "Agrega un endpoint con autenticación"
4. "Crea endpoint con manejo de carga de archivos"
```

**Variaciones de Entrada:**
- Nombre del endpoint y método HTTP
- Schema de request/response
- Requisitos de autenticación
- Necesidades de rate limiting

**Salidas Esperadas:**
- Route handler de Express/FastAPI
- Schema de validación de entrada
- Middleware de manejo de errores
- Unit tests
- Documentación de API

**Casos Extremos:**
- Definiciones de schema faltantes
- Método HTTP inválido
- Rutas conflictivas
- Validación compleja anidada

#### Recopilar Ejemplos Reales

No comiences a escribir hasta que tengas:
- ✅ 3-5 escenarios de uso concretos
- ✅ Ejemplos de entrada reales
- ✅ Ejemplos de salida deseada
- ✅ Casos extremos conocidos

**Haz preguntas aclaratorias** (pero no abrumes):
- "¿Cuál es el caso de uso principal para este skill?"
- "¿Puedes mostrarme un ejemplo de lo que quieres?"
- "¿Hay tareas relacionadas que esto debería manejar?"
- "¿Qué debería pasar si [caso extremo]?"

---

### Paso 2: Planificar Contenidos Reutilizables

**Objetivo:** Decidir qué pertenece en cada directorio basándose en patrones de uso.

**Por Qué Importa Esto:** La organización apropiada de recursos habilita la divulgación progresiva, manteniendo la ventana de contexto ligera mientras proporciona conocimiento profundo cuando se necesita.

#### Marco de Análisis

Para cada caso de uso del Paso 1, pregunta:

**¿Es este código reescrito repetidamente de la misma manera?**
- SÍ → Crear script en `scripts/`
- NO → Escribir instrucciones en SKILL.md

**¿Es este contenido estático grande?**
- SÍ → Mover a `references/` o `assets/`
- NO → Incluir directamente en SKILL.md

**¿Se muestra mejor esto que se describe?**
- SÍ → Crear ejemplo funcional en `examples/`
- NO → Escribir explicación en SKILL.md

**¿Es esta lógica determinística?**
- SÍ → Implementar como script
- NO → Proporcionar orientación en SKILL.md

#### Guía de Distribución de Recursos

**SKILL.md (1,500-2,000 palabras):**
- Instrucciones centrales y guías de toma de decisiones
- Flujos de trabajo de procesos y procedimientos paso a paso
- Referencias a scripts, ejemplos y recursos
- Reglas y restricciones

**Directorio scripts/:**
- Automatización de deployment
- Utilidades de generación de archivos
- Transformación de datos
- Lógica de validación
- Interacciones con API

**Directorio references/:**
- Documentación de API
- Schemas de configuración
- Guías de mejores prácticas
- Guías de migración
- Documentación de troubleshooting

**Directorio examples/:**
- Ejemplos completos y ejecutables
- Pares de entrada/salida
- Demostraciones de diferentes casos de uso
- Implementaciones de template

**Directorio assets/:**
- Templates de código
- Templates de archivos de configuración
- Imágenes o íconos
- Archivos boilerplate

#### Planificación de Ejemplo

**Skill:** Generador de Endpoints de API

**Contenido de SKILL.md:**
- Cuándo usar este skill (criterios de activación)
- Proceso general de creación de endpoints
- Árbol de decisión para elegir patrones
- Referencias a scripts y templates

**Contenido de scripts/:**
- `generate_endpoint.py` - Script de generación de código
- `validate_schema.py` - Validación de schema
- `create_tests.py` - Generación de archivos de test

**Contenido de references/:**
- `rest_patterns.md` - Mejores prácticas de API REST
- `validation_schemas.md` - Patrones comunes de validación
- `error_handling.md` - Estándares de respuesta de error

**Contenido de examples/:**
- `basic_get.js` - Endpoint GET simple
- `post_with_validation.js` - POST con schema
- `authenticated_endpoint.js` - Con auth
- `file_upload.js` - Manejo de archivos

**Contenido de assets/:**
- `endpoint_template.js` - Template base
- `test_template.js` - Boilerplate de test
- `openapi_template.yaml` - Template de docs de API

---

### Paso 3: Inicializar la Estructura

**Objetivo:** Crear la estructura de directorios solo con los archivos que realmente usarás.

**Por Qué Importa Esto:** Los directorios vacíos desordenan el skill y desperdician espacio. Comience con lo mínimo y añada según sea necesario.

#### Estructura Básica

```bash
# Para un skill específico del proyecto
mkdir -p .agents/skills/nombre-del-skill
touch .agents/skills/nombre-del-skill/SKILL.md

# Para un skill global (uso personal)
mkdir -p ~/.claude/skills/nombre-del-skill
touch ~/.claude/skills/nombre-del-skill/SKILL.md
```

#### Añadir Directorios según sea Necesario

**Solo cree directorios que realmente vaya a usar:**

```bash
# Añadir scripts (si planeó scripts en el Paso 2)
mkdir .agents/skills/nombre-del-skill/scripts

# Añadir referencias (si tiene documentación detallada)
mkdir .agents/skills/nombre-del-skill/references

# Añadir ejemplos (si va a mostrar patrones)
mkdir .agents/skills/nombre-del-skill/examples

# Añadir assets (si va a generar plantillas)
mkdir .agents/skills/nombre-del-skill/assets
```

**Importante:** Elimine los directorios no utilizados. No mantenga carpetas vacías.

#### Plantilla Inicial de SKILL.md

Cree con un frontmatter y una estructura mínimos:

```markdown
---
name: nombre-del-skill
description: [Acción específica] cuando [frases de activación concretas]
---

# Título del Skill

[Breve resumen de un párrafo sobre lo que hace este skill]

## Cuándo Usar

[Criterios de activación claros y específicos con ejemplos]

## Instrucciones

[Guía paso a paso o reglas centrales]

## Ejemplos

[Ejemplos concretos de aplicación]

## Referencias

[Enlaces a scripts, referencias o assets]
```

#### Ejemplo: Estructura Inicial para Generador de API

```bash
# Crear estructura
mkdir -p .agents/skills/api-generator/{scripts,references,examples,assets}

# Crear archivo principal
cat > .agents/skills/api-generator/SKILL.md << 'EOF'
---
name: api-generator
description: Genera endpoints de API REST con validación y pruebas cuando el usuario pide "crear un endpoint", "añadir una ruta de API" o "generar API REST"
---

# Generador de Endpoints de API

Genera endpoints de API REST seguros siguiendo las mejores prácticas.

## Cuándo Usar

Activar cuando los usuarios necesiten:
- Crear nuevos endpoints de API
- Generar rutas REST
- Añadir controladores de API con validación
- Realizar scaffolding de endpoints con pruebas

## Instrucciones

[Se completará en el Paso 4]

## Referencias

[Se añadirán en el Paso 5]
EOF
```

---

### Paso 4: Escribir el SKILL.md

**Objetivo:** Crear instrucciones claras y accionables que guíen al agente de IA de manera efectiva.

**Por Qué Importa Esto:** El SKILL.md es el documento de guía principal. Las instrucciones bien escritas aseguran una ejecución del skill consistente y de alta calidad.

#### Requisitos del Frontmatter

**Campos Requeridos:**

```yaml
---
name: identificador-del-skill
description: Este skill debe usarse cuando se pide "frase 1", "frase 2" o "frase 3"
---
```

**Guía de Campos:**

**`name`**
- Use kebab-case: `api-generator`, `code-review`, `database-validator`
- Manténgalo corto y descriptivo
- Debe coincidir con el nombre del directorio
- Se usa para referencias de skills

**`description` (CRÍTICO PARA LA ACTIVACIÓN)**
- Incluya 2-4 frases de activación específicas que los usuarios dirían realmente
- Use el formato en tercera persona: "Este skill debe usarse cuando..."
- Sea concreto, no vago
- Incluya contexto sobre cuándo usarlo

**Buenas Descripciones:**
```yaml
description: Este skill debe usarse cuando se pide "crear un hook", "añadir un hook PreToolUse", "implementar validación de hooks" o "configurar el comportamiento de un hook"

description: Genera componentes funcionales de React con TypeScript, hooks y pruebas cuando el usuario pide "crear un componente", "añadir un componente React" o "realizar scaffolding de un componente"

description: Valida las migraciones de esquemas de bases de datos para seguridad y consistencia cuando el usuario pide "validar migración", "comprobar cambios de esquema" o "revisar migración de base de datos"
```

**Malas Descripciones:**
```yaml
description: Proporciona orientación para trabajar con hooks
description: Generador de componentes
description: Herramientas de bases de datos
```

#### Estructura del Contenido del Cuerpo

**Manténgalo por debajo de las 500 líneas en total** - Mueva el contenido más largo a `references/`

**Estructura Recomendada:**

```markdown
# Título del Skill

[Resumen de 1-2 párrafos del propósito y capacidades]

## Cuándo Usar

[Escenarios de activación específicos con ejemplos]

## Descripción General del Proceso

[Pasos de alto nivel del flujo de trabajo]

## Instrucciones Detalladas

[Orientación paso a paso o reglas organizadas por categoría]

## Uso de Scripts

[Cómo usar los scripts incluidos, si los hay]

## Ejemplos

[Ejemplos concretos de aplicación del skill]

## Referencias

[Enlaces a resources/, examples/, scripts/, assets/]

## Restricciones

[Reglas, limitaciones y cosas a evitar]
```

#### Guía de Estilo de Escritura

**Use la forma imperativa/infinitiva:**
```markdown
✅ Comprobar errores de tipo
✅ Validar la entrada del usuario
✅ Generar endpoint a partir de una plantilla

❌ Deberías comprobar errores de tipo
❌ El skill valida la entrada del usuario
❌ Generarás un endpoint
```

**Sea específico y accionable:**
```markdown
✅ Ejecutar `python scripts/validate.py <archivo>` para validar el esquema

❌ Valide el esquema usando el script de validación
```

**Referencie los recursos incluidos explícitamente:**
```markdown
✅ Consulte **`references/patterns.md`** para patrones REST detallados
✅ Use **`scripts/generate.py`** para crear el código del endpoint
✅ Revise **`examples/authenticated.js`** para la implementación de auth

❌ Compruebe la documentación de patrones
❌ Use el script de generación
❌ Mire los ejemplos
```

#### Ejemplo: SKILL.md Completo

```markdown
---
name: api-endpoint-generator
description: Genera endpoints de API REST con validación, manejo de errores y pruebas cuando el usuario pide "crear un endpoint", "añadir ruta de API", "generar controlador REST" o "realizar scaffolding de endpoint de API"
version: 1.0.0
---

# Generador de Endpoints de API

Genera endpoints de API REST listos para producción con TypeScript, esquemas de validación, manejo de errores y pruebas exhaustivas siguiendo las mejores prácticas.

## Cuándo Usar

Active este skill cuando los usuarios necesiten:
- Crear nuevos endpoints de API REST
- Generar controladores de ruta con validación
- Añadir endpoints con autenticación
- Realizar scaffolding de rutas de API con pruebas

## Descripción General del Proceso

1. Recaudar requisitos del endpoint del usuario
2. Generar el controlador de ruta a partir de una plantilla
3. Crear el esquema de validación
4. Implementar el manejo de errores
5. Generar pruebas unitarias y de integración
6. Añadir documentación de la API

## Instrucciones Detalladas

### 1. Recaudar Requisitos

Pregunte al usuario por:
- **Método HTTP:** GET, POST, PUT, PATCH, DELETE
- **Ruta:** `/api/users/:id`
- **Esquema de solicitud:** Parámetros de consulta, cuerpo, encabezados
- **Esquema de respuesta:** Respuestas de éxito y error
- **Autenticación:** Endpoint requerido o público
- **Autorización:** Necesidades de control de acceso basado en roles

### 2. Generar Controlador

Use **`assets/endpoint-template.ts`** como base:

```bash
# Generar a partir de la plantilla
cp assets/endpoint-template.ts src/routes/nombre-del-endpoint.ts
```

Personalice con los requisitos recaudados.

### 3. Crear Esquema de Validación

Siga los patrones en **`references/validation-schemas.md`** para crear:
- Validación de entrada con Zod/Joi
- Tipos de solicitud/respuesta seguros
- Definiciones de mensajes de error

### 4. Implementar el Manejo de Errores

Respuestas de error estándar (consulte **`references/error-handling.md`**):
- 400 Bad Request - Entrada inválida
- 401 Unauthorized - Falta autenticación
- 403 Forbidden - Permisos insuficientes
- 404 Not Found - El recurso no existe
- 500 Internal Server Error - Errores del servidor

### 5. Generar Pruebas

Cree el archivo de prueba con:
```bash
# Usar generador de pruebas
python scripts/generate_tests.py --endpoint nombre-del-endpoint
```

Incluya:
- Pruebas de "happy path"
- Pruebas de error de validación
- Pruebas de autenticación
- Pruebas de casos límite

### 6. Añadir Documentación

Generar especificación OpenAPI:
```bash
# Generar documentación de API
python scripts/generate_openapi.py --endpoint nombre-del-endpoint
```

## Uso de Scripts

**Generar endpoint completo:**
```bash
python scripts/generate_endpoint.py \
  --name UserProfile \
  --method GET \
  --path "/api/users/:id" \
  --auth required
```

**Validar código generado:**
```bash
bash scripts/validate_endpoint.sh src/routes/user-profile.ts
```

## Ejemplos

Consulte el directorio **`examples/`** para implementaciones completas:

- **`examples/basic-get.ts`** - Endpoint GET simple
- **`examples/post-with-validation.ts`** - POST con validación de esquema
- **`examples/authenticated.ts`** - Endpoint con middleware de autenticación
- **`examples/file-upload.ts`** - Manejo de carga de archivos

## Referencias

- **Patrones REST:** `references/rest-patterns.md`
- **Esquemas de Validación:** `references/validation-schemas.md`
- **Manejo de Errores:** `references/error-handling.md`
- **Guía de Pruebas:** `references/testing-guide.md`

## Restricciones

- Nunca omitir la validación de entrada
- Siempre incluir el manejo de errores
- Generar pruebas para todos los endpoints
- Seguir las convenciones RESTful
- Usar TypeScript para la seguridad de tipos
- Incluir documentación de la API
```

---

### Paso 5: Añadir Recursos (Scripts, Referencias, Ejemplos, Assets)

**Objetivo:** Crear los archivos de soporte referenciados en el SKILL.md.

**Por Qué Importa Esto:** Los recursos habilitan la divulgación progresiva y proporcionan implementaciones concretas que referencia el SKILL.md.

#### Creación de Scripts

**Propósito:** Operaciones determinísticas y repetibles.

**Mejores Prácticas:**
- Hacerlo ejecutable: `chmod +x script.sh`
- Incluir shebang: `#!/usr/bin/env python3`
- Retornar códigos de salida significativos
- Emitir datos estructurados (JSON)
- Incluir la opción `--help`
- Manejar las dependencias faltantes con elegancia

**Ejemplo de Plantilla de Script:**

```python
#!/usr/bin/env python3
"""
Generar endpoint de API a partir de una plantilla

Uso:
    python generate_endpoint.py --name NombreEndpoint --method GET --path "/api/ruta"

Códigos de salida:
    0 - Éxito
    1 - Error (falló la validación o la generación)
    2 - Faltan argumentos
"""

import sys
import json
import argparse
from pathlib import Path

def generate_endpoint(name, method, path, auth=False):
    """Generar archivos de endpoint"""
    try:
        # Leer plantilla
        template_path = Path(__file__).parent.parent / "assets" / "endpoint-template.ts"
        with open(template_path) as f:
            template = f.read()

        # Sustituir variables
        code = template.replace("{{NAME}}", name)
        code = code.replace("{{METHOD}}", method)
        code = code.replace("{{PATH}}", path)

        # Escribir salida
        output_path = Path(f"src/routes/{name.lower()}.ts")
        output_path.parent.mkdir(parents=True, exist_ok=True)
        output_path.write_text(code)

        result = {
            "status": "success",
            "file": str(output_path),
            "message": f"Generado endpoint {name}"
        }
        print(json.dumps(result, indent=2))
        return 0

    except Exception as e:
        error = {
            "status": "error",
            "message": str(e)
        }
        print(json.dumps(error, indent=2), file=sys.stderr)
        return 1

def main():
    parser = argparse.ArgumentParser(description="Generar endpoint de API")
    parser.add_argument("--name", required=True, help="Nombre del endpoint")
    parser.add_argument("--method", required=True, choices=["GET", "POST", "PUT", "DELETE"])
    parser.add_argument("--path", required=True, help="Ruta del endpoint")
    parser.add_argument("--auth", action="store_true", help="Requiere autenticación")

    args = parser.parse_args()
    return generate_endpoint(args.name, args.method, args.path, args.auth)

if __name__ == "__main__":
    sys.exit(main())
```

#### Creación de Referencias

**Propósito:** Documentación detallada cargada según sea necesario.

**Tamaño:** Cada archivo puede tener entre 2,000 y 5,000+ palabras.

**Tipos de Contenido:**
- Documentación de API
- Esquemas de configuración
- Guías de mejores prácticas
- Guías de migración
- Documentos de resolución de problemas (troubleshooting)
- Catálogos de patrones

**Ejemplo de Archivo de Referencia:**

```markdown
# Patrones de API REST

## Estructura del Endpoint

Todos los endpoints deben seguir esta estructura:

1. **Validación de entrada** - Validar los datos de la solicitud
2. **Autenticación** - Verificar la identidad del usuario
3. **Autorización** - Comprobar los permisos
4. **Lógica de negocio** - Ejecutar la funcionalidad central
5. **Formateo de respuesta** - Retornar una respuesta estandarizada

## Formato de Respuesta Estándar

### Respuesta de Éxito

```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "timestamp": "2026-02-01T12:00:00Z",
    "requestId": "req_abc123"
  }
}
```

### Respuesta de Error

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Entrada inválida",
    "details": [
      {"field": "email", "message": "Formato de correo inválido"}
    ]
  },
  "meta": {
    "timestamp": "2026-02-01T12:00:00Z",
    "requestId": "req_abc123"
  }
}
```

[... continúe con patrones detallados ...]
```

#### Creación de Ejemplos

**Propósito:** Demostraciones de código funcionales.

**Guías:**
- Ejemplos completos y ejecutables
- Incluir comentarios explicando las partes clave
- Cubrir diferentes casos de uso
- Mostrar tanto la entrada como la salida

**Archivo de Ejemplo:**

```typescript
// examples/authenticated-endpoint.ts
// Ejemplo: Endpoint GET con autenticación JWT

import { Request, Response } from 'express';
import { z } from 'zod';
import { authenticate } from '../middleware/auth';

// Esquema de validación de solicitud
const GetUserSchema = z.object({
  params: z.object({
    id: z.string().uuid()
  })
});

// Controlador de ruta
export async function getUser(req: Request, res: Response) {
  try {
    // Validar entrada
    const { params } = GetUserSchema.parse(req);

    // Ccomprobar autenticación (middleware)
    // authenticate() añade req.user

    // Comprobar autorización
    if (req.user.id !== params.id && !req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'Permisos insuficientes'
        }
      });
    }

    // Buscar usuario
    const user = await db.users.findById(params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Usuario no encontrado'
        }
      });
    }

    // Retornar respuesta
    return res.status(200).json({
      success: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Solicitud inválida',
          details: error.errors
        }
      });
    }

    console.error('Error al obtener usuario:', error);
    return res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Ocurrió un error'
      }
    });
  }
}

// Registro de ruta
export default {
  method: 'GET',
  path: '/api/users/:id',
  middleware: [authenticate],
  handler: getUser
};
```

#### Creación de Assets

**Propósito:** Plantillas y archivos para la generación de salidas.

**Contenido:**
- Plantillas de código con marcadores de posición
- Plantillas de configuración
- Archivos boilerplate

**Ejemplo de Plantilla:**

```typescript
// assets/endpoint-template.ts
// Plantilla para generar endpoints de API

import { Request, Response } from 'express';
import { z } from 'zod';

// Esquema de validación de solicitud
const {{NAME}}Schema = z.object({
  // TODO: Añadir esquema de validación
});

// Controlador de ruta
export async function {{NAME_LOWER}}(req: Request, res: Response) {
  try {
    // Validar entrada
    const data = {{NAME}}Schema.parse(req);

    // TODO: Implementar lógica de negocio

    // Retornar respuesta
    return res.status(200).json({
      success: true,
      data: { ... }
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Solicitud inválida',
          details: error.errors
        }
      });
    }

    console.error('Error en {{NAME}}:', error);
    return res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Ocurrió un error'
      }
    });
  }
}

// Registro de ruta
export default {
  method: '{{METHOD}}',
  path: '{{PATH}}',
  handler: {{NAME_LOWER}}
};
```

---

### Paso 6: Lista de Verificación de Validación

**Objetivo:** Verificar la estructura y el contenido del skill antes de probarlo.

**Por Qué Importa Esto:** Detectar los problemas temprano previene la depuración durante el uso real.

#### Validación de Estructura

- [ ] Skill en la ubicación correcta (`.agents/skills/` o `~/.claude/skills/`)
- [ ] Existe el SKILL.md con el frontmatter requerido
- [ ] Solo existen directorios con contenido (sin carpetas vacías)
- [ ] Los scripts son ejecutables (`chmod +x scripts/*.sh`)
- [ ] Todos los archivos referenciados existen realmente

#### Validación del Frontmatter

- [ ] Campo `name` presente y usa kebab-case
- [ ] Campo `description` incluye 2-4 frases de activación específicas
- [ ] La descripción usa el formato en tercera persona
- [ ] La descripción es concreta, no vaga

#### Validación del Contenido

- [ ] Cuerpo del SKILL.md de menos de 500 líneas
- [ ] La escritura usa la forma imperativa, no la segunda persona
- [ ] Recursos referenciados explícitamente en el SKILL.md
- [ ] Los ejemplos son completos y ejecutables
- [ ] Los scripts tienen manejo de errores y salida útil

#### Validación de Calidad

- [ ] Está claro cuándo usar el skill
- [ ] Se proporcionan instrucciones paso a paso
- [ ] Los ejemplos demuestran los patrones clave
- [ ] Los scripts resuelven problemas determinísticos
- [ ] No contiene conocimiento general que Claude ya posee

**Comando de Validación:**

```bash
# Comprobar que existe el SKILL.md y tiene frontmatter
head -5 .agents/skills/nombre-del-skill/SKILL.md | grep -E "^(name|description):"

# Comprobar recuento de líneas inferior a 500
wc -l .agents/skills/nombre-del-skill/SKILL.md

# Comprobar que los scripts son ejecutables
ls -la .agents/skills/nombre-del-skill/scripts/

# Comprobar que todos los archivos referenciados existen
grep -o 'references/[^)]*' .agents/skills/nombre-del-skill/SKILL.md | while read file; do
  [ -f ".agents/skills/nombre-del-skill/$file" ] && echo "✓ $file" || echo "✗ Faltante: $file"
done
```

---

### Paso 7: Probando el Skill

**Objetivo:** Verificar que el skill se active correctamente y se ejecute según lo esperado.

**Por Qué Importa Esto:** Las pruebas revelan problemas con la activación, la ejecución o la carga de recursos antes del uso real.

#### Probar la Activación

**Probar con frases de activación de la descripción:**

```bash
# Iniciar Claude Code
claude

# Probar frases exactas de la descripción
Usuario: "crear un endpoint de API para usuarios"
Usuario: "añadir una ruta REST"
Usuario: "generar endpoint con validación"

# Verificar:
# - El skill se activa
# - Se carga el skill correcto (comprobar el nombre del skill en la respuesta)
# - Se aplica el conocimiento del skill
```

**Probar casos límite:**

```bash
# NO debería activarse (intención diferente)
Usuario: "¿qué es REST?"
Usuario: "explícame los endpoints de API"

# Debería activarse (variación de la frase)
Usuario: "Necesito crear un nuevo endpoint"
Usuario: "ayúdame a añadir una ruta de API"
```

#### Probar la Ejecución

**Verificar que el skill funcione correctamente:**

1. **Instrucciones seguidas:** Comprobar que la salida coincida con la guía del SKILL.md
2. **Recursos cargados:** Confirmar que se usaron las referencias, ejemplos y scripts
3. **Ejecución de scripts:** Verificar que los scripts se ejecuten sin errores
4. **Calidad de la salida:** Asegurar que la salida cumpla con los requisitos

**Ejemplo de Sesión de Prueba:**

```
Usuario: Crea un endpoint GET para obtener perfiles de usuario por ID

Comportamiento esperado:
1. El skill se activa (api-endpoint-generator)
2. El agente pide los requisitos (ruta, auth, etc.)
3. El agente usa el script generate_endpoint.py
4. El agente referencia los patrones de validación de references/
5. El agente proporciona la implementación completa basada en examples/
6. La salida incluye validación, manejo de errores y pruebas
```

#### Probar Recursos

**Verificar que los scripts funcionen:**

```bash
# Probar el script de forma independiente
cd .agents/skills/api-generator
python scripts/generate_endpoint.py --help
python scripts/generate_endpoint.py --name EndpointPrueba --method GET --path "/prueba"

# Comprobar la salida
cat src/routes/endpointprueba.ts

# Verificar códigos de salida
echo $?  # Debería ser 0 para el éxito
```

**Verificar que los ejemplos se ejecuten:**

```bash
# Probar código de ejemplo
cd .agents/skills/api-generator
node examples/authenticated-endpoint.js  # Si es independiente

# O verificar que el ejemplo tenga sintaxis válida
npx tsc --noEmit examples/authenticated-endpoint.ts
```

#### Problemas Comunes

**El skill no se activa:**
- Descripción demasiado vaga → Añadir frases de activación específicas
- Frases de activación incorrectas → Usar frases que los usuarios digan realmente
- Formato de frontmatter incorrecto → Comprobar la sintaxis YAML

**El skill se activa pero falla:**
- Recursos faltantes → Comprobar que todos los archivos referenciados existen
- Errores de script → Probar los scripts de forma independiente
- Ejemplos rotos → Validar el código de ejemplo

**Se produce una salida incorrecta:**
- Instrucciones poco claras → Aclarar los pasos en el SKILL.md
- Faltan ejemplos → Añadir ejemplos concretos
- Se necesita un script → Mover la lógica determinística a un script

---

### Paso 8: Iteración basada en el Uso

**Objetivo:** Mejorar el skill basándose en los patrones de uso del mundo real.

**Por Qué Importa Esto:** Los skills mejoran con el tiempo a medida que se descubre qué funciona y qué no en el uso real.

#### Monitorizar Patrones de Uso

**Rastrear cuándo el skill funciona bien:**
- Frases de activación que activan el skill correctamente
- Instrucciones que producen buenos resultados
- Scripts y ejemplos útiles
- Organización efectiva de recursos

**Rastrear cuándo el skill tiene dificultades:**
- Activaciones perdidas (debería haberse activado pero no lo hizo)
- Activaciones incorrectas (se activó cuando no debía)
- Instrucciones poco claras que conducen a una mala salida
- Recursos o ejemplos faltantes

#### Tipos de Iteración Comunes

**1. Refinar la Descripción para una Mejor Activación**

```yaml
# Antes
description: Genera endpoints de API con validación

# Después
description: Genera endpoints de API REST con TypeScript, validación, manejo de errores y pruebas cuando el usuario pide "crear un endpoint", "añadir ruta de API", "generar controlador REST" o "realizar scaffolding de endpoint"
```

**2. Añadir Casos Límite Faltantes**

```markdown
## Instrucciones

### Manejo de Errores

[Contenido original...]

### Nuevo: Manejo de Carga de Archivos

Cuando el endpoint acepta cargas de archivos:
1. Añadir middleware multipart/form-data
2. Validar el tamaño y tipo de archivo
3. Almacenar los archivos de forma segura
4. Retornar metadatos del archivo

Consulte **`examples/file-upload.ts`** para la implementación.
```

**3. Crear Scripts para Tareas Repetitivas**

```markdown
# Antes: Todo en las instrucciones del SKILL.md
Genere el código del endpoint siguiendo este patrón...

# Después: Script + referencia
Generar endpoint:
```bash
python scripts/generate_endpoint.py --name Nombre --method METODO --path RUTA
```

Consulte **`references/generation-patterns.md`** para opciones de personalización.
```

**4. Mover Secciones Grandes a Referencias**

```markdown
# Antes: Todo en el SKILL.md (600 líneas)
## Patrones de Validación
[50 líneas de ejemplos de validación...]

## Manejo de Errores
[40 líneas de patrones de errores...]

# Después: SKILL.md ligero (200 líneas) + referencias
## Validación

Siga los patrones en **`references/validation-patterns.md`**.

## Manejo de Errores

Consulte **`references/error-handling.md`** para respuestas de error estándar.
```

**5. Añadir Ejemplos para Mayor Claridad**

```markdown
# Antes: Descripción textual
Cree un endpoint con autenticación usando middleware JWT...

# Después: Ejemplo + referencia
Crear endpoint con autenticación:

Consulte **`examples/authenticated-endpoint.ts`** para la implementación completa.
```

#### Flujo de Trabajo de Iteración

```bash
# 1. Usar el skill en escenarios reales
# 2. Anotar problemas y mejoras
# 3. Actualizar el skill
vim .agents/skills/nombre-del-skill/SKILL.md

# 4. Añadir nuevos recursos
vim .agents/skills/nombre-del-skill/references/nuevo-patron.md

# 5. Probar cambios
claude
"crear un endpoint"  # Probar con frases de activación reales

# 6. Verificar la mejora
# Comparar los resultados antes y después

# 7. Confirmar cambios
git add .agents/skills/nombre-del-skill/
git commit -m "refactor(skill): mejorar activación y ejemplos de api-generator"
```

---

### Paso 9: Empaquetado y Distribución

**Objetivo:** Preparar el skill para compartirlo con el equipo o la comunidad.

**Por Qué Importa Esto:** El empaquetado adecuado asegura que el skill funcione para otros y se integre en sus flujos de trabajo.

#### Lista de Verificación Pre-Empaquetado

- [ ] SKILL.md de menos de 500 líneas
- [ ] Todas las referencias a un nivel de profundidad (no anidadas)
- [ ] Scripts ejecutables y probados
- [ ] Ejemplos completos y ejecutables
- [ ] Sin archivos extraños (README, CHANGELOG, LICENSE)
- [ ] Sin directorios vacíos
- [ ] Frontmatter válido y completo

#### Distribución Local (Skill del Proyecto)

**Para skills específicos del proyecto:**

```bash
# El skill ya está en .agents/skills/
# Sincronizar con las plataformas de agentes
./.agents/rules/sync-rules.sh  # También maneja skills

# Confirmar en el control de versiones
git add .agents/skills/nombre-del-skill/
git commit -m "feat(skill): añadir skill api-endpoint-generator"
git push

# Los miembros del equipo lo obtienen automáticamente al hacer pull
```

#### Distribución Global (Skill Personal)

**Para compartir skills personales:**

```bash
# Empaquetar el skill
cd ~/.claude/skills/
tar -czf nombre-del-skill.tar.gz nombre-del-skill/

# Compartir el archivo
# Los destinatarios lo extraen en ~/.claude/skills/
tar -xzf nombre-del-skill.tar.gz -C ~/.claude/skills/
```

#### Publicar en el Marketplace de Skills

**Para skills públicos:**

1. **Preparar metadatos:**
   ```yaml
   ---
   name: nombre-del-skill
   description: Descripción clara con frases de activación
   version: 1.0.0
   author: Tu Nombre
   license: MIT
   tags: [api, typescript, rest]
   ---
   ```

2. **Añadir documentación:**
   ```bash
   # Crear ejemplos de uso
   cat > .agents/skills/nombre-del-skill/USAGE.md << 'EOF'
   # Uso de Nombre del Skill

   ## Instalación
   [Instrucciones de instalación]

   ## Uso
   [Ejemplos de uso]

   ## Ejemplos
   [Escenarios comunes]
   EOF
   ```

3. **Probar exhaustivamente:**
   - Probar en una instalación limpia
   - Verificar que todos los scripts funcionen
   - Comprobar que los ejemplos se ejecuten
   - Validar la documentación

4. **Enviar al marketplace:**
   ```bash
   # Usando npx skills (si aplica)
   npx skills publish .agents/skills/nombre-del-skill
   ```

#### Documentación para Distribución

**Incluir en USAGE.md o README.md:**

```markdown
# Nombre del Skill

Breve descripción de lo que hace este skill.

## Instalación

### Skill del Proyecto
```bash
# Copiar al proyecto
cp -r nombre-del-skill .agents/skills/
./agents/rules/sync-rules.sh
```

### Skill Global
```bash
# Copiar al directorio del usuario
cp -r nombre-del-skill ~/.claude/skills/
```

## Uso

Frases de activación:
- "crear un endpoint"
- "añadir ruta de API"
- "generar controlador REST"

Ejemplo de uso:
```
Usuario: Crea un endpoint GET para obtener usuarios
Agente: [Usa el skill para generar el endpoint]
```

## Características

- Característica 1
- Característica 2
- Característica 3

## Requisitos

- Python 3.8+
- Node.js 16+
- TypeScript

## Configuración

[Cualquier configuración necesaria]

## Ejemplos

Consulte el directorio `examples/` para ejemplos completos.

## Licencia

MIT
```

---

### Paso 10: Mantenimiento y Actualizaciones

**Objetivo:** Mantener el skill actualizado y efectivo a lo largo del tiempo.

**Por Qué Importa Esto:** Las tecnologías evolucionan, los patrones cambian y los skills necesitan actualizaciones para seguir siendo útiles.

#### Cuándo Actualizar

**Actualice cuando:**
- Cambien las versiones de los frameworks o librerías
- Evolucionen las mejores prácticas
- Surjan nuevos patrones
- Los usuarios reporten problemas
- Se soliciten nuevas características
- Se expandan las capacidades de la plataforma

#### Flujo de Trabajo de Mantenimiento

**Revisión mensual:**
```bash
# Comprobar el uso del skill
# Revisar las invocaciones recientes
# Anotar cualquier fallo o confusión

# Actualizar la documentación
vim .agents/skills/nombre-del-skill/references/patterns.md

# Actualizar los ejemplos para las nuevas versiones
vim .agents/skills/nombre-del-skill/examples/

# Probar con las herramientas actuales
python scripts/validate.py

# Actualizar la versión
# Editar el frontmatter del SKILL.md
version: 1.1.0
```

**Versionado:**
- **Patch (1.0.0 → 1.0.1):** Corrección de bugs, corrección de erratas
- **Minor (1.0.0 → 1.1.0):** Nuevas características, ejemplos adicionales
- **Major (1.0.0 → 2.0.0):** Cambios disruptivos, reestructuración

**Rastreo del historial de cambios (Changelog):**
```bash
# Documentar los cambios
cat >> .agents/skills/nombre-del-skill/CHANGELOG.md << 'EOF'
## v1.1.0 - 2026-02-15

### Añadido
- Nuevos ejemplos para el manejo de carga de archivos
- Script de validación para archivos de migración

### Cambiado
- Actualizado TypeScript a la sintaxis v5
- Mejora de los patrones de manejo de errores

### Corregido
- Manejo de códigos de salida de scripts
- Archivo de referencia faltante
EOF
```

---

## Resumen de Mejores Prácticas

### HACER (SÍ) ✅

- **Comenzar con ejemplos de uso concretos**
- **Escribir frases de activación específicas en la descripción**
- **Usar la forma imperativa** ("Crear endpoint" no "Deberías crear")
- **Mantener el SKILL.md ligero** (menos de 500 líneas)
- **Referenciar explícitamente los recursos** en el SKILL.md
- **Proporcionar ejemplos de funcionamiento**
- **Crear scripts de utilidad** para tareas determinísticas
- **Eliminar directorios no utilizados**
- **Probar exhaustivamente antes de distribuir**
- **Iterar basándose en el uso real**

### NO HACER (NO) ❌

- **No escribir descripciones vagas** ("Herramientas de API")
- **No usar la segunda persona** ("Deberías...")
- **No poner todo en el SKILL.md** (use `references/`)
- **No incluir conocimiento general** que Claude ya posee
- **No crear recursos no referenciados**
- **No dejar ejemplos rotos**
- **No mantener directorios vacíos**
- **No omitir las pruebas**
- **No olvidar versionar**

---

## Ejemplo Completo: De la Idea al Skill

**Escenario:** Crear un skill para generar migraciones de bases de datos

### Paso 1: Entender los Casos de Uso

**Ejemplos concretos:**
1. "Crear una migración para añadir la tabla de usuarios"
2. "Generar migración para añadir la columna de correo electrónico"
3. "Crear migración para añadir un índice en user_id"

**Variaciones de entrada:**
- Creación de tabla
- Adición/modificación de columna
- Creación de índice
- Restricciones de clave foránea

**Salidas esperadas:**
- SQL de migración Up
- SQL de migración Down
- Archivo nombrado con timestamp
- Comprobaciones de validación

### Paso 2: Planificar Recursos

**SKILL.md:** Proceso de migración, comprobaciones de seguridad, convenciones de nomenclatura
**scripts/:** `generate_migration.py`, `validate_migration.py`
**references/:** `sql-patterns.md`, `safety-checklist.md`
**examples/:** `create-table.sql`, `add-column.sql`, `add-index.sql`
**assets/:** `migration-template.sql`

### Paso 3: Inicializar la Estructura

```bash
mkdir -p .agents/skills/db-migration/{scripts,references,examples,assets}
touch .agents/skills/db-migration/SKILL.md
```

### Paso 4: Escribir el SKILL.md

```yaml
---
name: database-migration-generator
description: Genera migraciones de bases de datos seguras con SQL up/down, validación y rollback cuando el usuario pide "crear una migración", "generar migración" o "añadir migración de base de datos"
version: 1.0.0
---

# Generador de Migraciones de Bases de Datos

Genera migraciones de bases de datos seguras para producción con capacidades de validación y rollback.

## Cuándo Usar

Activar cuando los usuarios necesiten:
- Crear migraciones de bases de datos
- Añadir tablas, columnas o índices
- Modificar el esquema de forma segura
- Generar migraciones reversibles

## Proceso

1. Recaudar requisitos de la migración
2. Generar el archivo de migración con timestamp
3. Crear el SQL de up y down
4. Validar la seguridad
5. Comprobar la reversibilidad

## Instrucciones

[Pasos detallados...]

## Uso de Scripts

Generar migración:
```bash
python scripts/generate_migration.py --name añadir_tabla_usuarios --type tabla
```

Validar migración:
```bash
python scripts/validate_migration.py migrations/20260201_añadir_tabla_usuarios.sql
```

## Referencias

- **Patrones SQL:** `references/sql-patterns.md`
- **Lista de Seguridad:** `references/safety-checklist.md`

## Ejemplos

- `examples/create-table.sql`
- `examples/add-column.sql`
- `examples/add-index.sql`
```

### Pasos 5-10

[Siga el mismo patrón detallado anteriormente]

**Resultado:** Skill completo, probado y documentado listo para su uso y distribución.

---

## Resolución de Problemas (Troubleshooting)

### El Skill No Se Activa

**Síntomas:** La solicitud coincide con la intención pero el skill no se carga

**Soluciones:**
- Revise la especificidad de la descripción - añada frases de activación concretas
- Pruebe con la frase exacta de la descripción
- Compruebe la ubicación del skill (directorio correcto)
- Verifique la sintaxis YAML del frontmatter
- Reinicie el agente de IA

### El Skill Se Ejecuta Incorrectamente

**Síntomas:** El skill se activa pero produce una salida incorrecta

**Soluciones:**
- Aclare las instrucciones en el SKILL.md
- Añada ejemplos concretos que muestren los patrones esperados
- Mueva la lógica compleja a scripts
- Añada árboles de decisión para casos complejos
- Actualice las referencias con la información que falte

### Los Recursos No Se Cargan

**Síntomas:** No se encuentran las referencias o los scripts

**Soluciones:**
- Compruebe las rutas de los archivos (sensible a mayúsculas y minúsculas)
- Verifique las referencias explícitas en el SKILL.md
- Asegúrese de que los archivos existan: `ls -la nombre-del-skill/references/`
- Compruebe la estructura de directorios (un nivel de profundidad)
- Verifique que el empaquetado del skill incluyó todos los archivos

---

## Documentación Relacionada

- [Principios de Diseño](../03-creating-skills/design-principles.md) - Conceptos centrales de los skills
- [Patrones de Skills](../03-creating-skills/skill-patterns.md) - Arquitecturas comunes
- [Formato SKILL.md](../02-skill-anatomy/skill-md-format.md) - Guía detallada del frontmatter
- [Divulgación Progresiva](../01-core-concepts/progressive-disclosure.md) - Estrategia de carga

---

## Referencias

- **Creador de Skills de Anthropic:** [skills.sh/anthropics/skills/skill-creator](https://skills.sh/anthropics/skills/skill-creator)
- **Skills de Claude Code:** [skills.sh/anthropics/claude-code/skill-development](https://skills.sh/anthropics/claude-code/skill-development)
- **Skills de Antigravity:** [antigravity.google/docs/knowledge](https://antigravity.google/docs/knowledge)
- **Marketplace de Skills:** [skills.sh](https://skills.sh)

---

**Última Actualización:** Febrero 2026
**Versión:** 1.0.0
**Categoría:** Desarrollo de Skills
