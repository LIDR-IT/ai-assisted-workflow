# Patrones de Skills: Cinco Enfoques de Diseño Progresivos

## Resumen

Los skills en Antigravity pueden estructurarse usando cinco patrones de diseño progresivos, cada uno adecuado para diferentes niveles de complejidad y casos de uso. Esta guía proporciona ejemplos completos y orientación para elegir el patrón correcto.

**Principio Clave:** Comience simple y agregue complejidad solo cuando sea necesario. La mayoría de los skills pueden resolverse con los patrones 1-3.

## Progresión de Patrones

```
1. Basic Router          → Instrucciones puras
2. Asset Utilization     → Instrucciones + archivos estáticos
3. Few-Shot Learning     → Instrucciones + ejemplos
4. Procedural Logic      → Instrucciones + scripts
5. Complex Orchestration → Flujo de trabajo completo con todos los elementos
```

---

## Patrón 1: Basic Router (Solo Instrucciones)

### Cuándo Usar

Use el patrón Basic Router cuando:
- **La orientación pura es suficiente** - No se necesitan recursos externos
- **El comportamiento está basado en reglas** - Las instrucciones claras y explícitas funcionan
- **No hay lógica determinista** - No se necesitan scripts de validación
- **No hay plantillas pesadas** - No hay boilerplate grande para referenciar

**Ejemplos:**
- Formato de mensajes de commit
- Aplicación de estilo de código
- Orientación de convenciones de nomenclatura
- Reglas de estructura de documentación

### Estructura

```
skill-name/
└── SKILL.md              # Solo instrucciones
```

### Beneficios

- **Sobrecarga mínima** - Más rápido de crear y mantener
- **Autocontenido** - Todo en un archivo
- **Fácil de entender** - Instrucciones claras y lineales
- **Sin dependencias** - Sin scripts o archivos externos

### Limitaciones

- **Consumo de tokens** - Plantillas grandes inline aumentan tokens
- **No reusabilidad** - No se pueden compartir recursos entre skills
- **Sin validaciones deterministas** - Depende de la interpretación del LLM

### Ejemplo Completo: Git Commit Formatter

**Directorio:** `git-commit-formatter/`

**Archivo:** `SKILL.md`

```markdown
---
name: git-commit-formatter
description: Enforces Conventional Commits specification for git commit messages, ensuring consistent format with type, scope, and description
---

# Git Commit Formatter

## Objetivo

Asegurar que todos los mensajes de commit sigan la especificación Conventional Commits para un historial de proyecto consistente y generación automatizada de changelog.

## Formato

```
type(scope): description

[optional body]

[optional footer]
```

## Tipos Válidos

- **feat:** Nueva funcionalidad para el usuario
- **fix:** Corrección de bug para el usuario
- **docs:** Cambios solo en documentación
- **style:** Formato, punto y coma faltantes, etc. (sin cambio de código)
- **refactor:** Reestructuración de código sin cambio de comportamiento
- **test:** Agregar o actualizar tests
- **chore:** Tareas de mantenimiento, dependencias, configuración

## Reglas

### Encabezado (Primera Línea)
- El tipo DEBE estar en minúsculas
- El scope es opcional pero recomendado (ej., `api`, `auth`, `ui`)
- La descripción DEBE estar en minúsculas
- La descripción NO DEBE terminar con un punto
- La primera línea DEBE ser de 72 caracteres o menos
- Usar modo imperativo ("add" no "added" o "adds")

### Cuerpo (Opcional)
- Separado del encabezado por una línea en blanco
- Explicar QUÉ cambió y POR QUÉ
- Envolver a 72 caracteres
- Puede incluir múltiples párrafos

### Pie (Opcional)
- Separado del cuerpo por una línea en blanco
- Referencias a issues: `Refs: #123`
- Breaking changes: `BREAKING CHANGE: description`
- Co-autores: `Co-authored-by: Name <email>`

## Ejemplos

### Funcionalidad Simple
```
feat(auth): add OAuth2 login support
```

### Corrección de Bug con Cuerpo
```
fix(api): resolve race condition in user update

The previous implementation had a race condition when multiple
requests updated the same user simultaneously. Added database
transaction isolation to prevent concurrent modifications.

Refs: #456
```

### Breaking Change
```
feat(api): migrate to REST from GraphQL

Complete API rewrite from GraphQL to REST for better caching
and simpler client integration.

BREAKING CHANGE: All GraphQL endpoints removed. Clients must
migrate to new REST endpoints documented in /docs/api.md

Refs: #789
```

### Actualización de Documentación
```
docs(readme): update installation instructions
```

## Checklist de Validación

Al revisar un mensaje de commit, verificar:

- [ ] El tipo es uno de los tipos válidos
- [ ] El tipo está en minúsculas
- [ ] El scope (si está presente) está entre paréntesis
- [ ] La descripción está en minúsculas
- [ ] La descripción usa modo imperativo
- [ ] La descripción no termina con punto
- [ ] La primera línea tiene 72 caracteres o menos
- [ ] El cuerpo (si está presente) separado por línea en blanco
- [ ] El pie (si está presente) separado por línea en blanco

## Errores Comunes

**❌ Incorrecto:**
```
Added new feature        # Pasado, sin tipo
Fix: bug in login       # Descripción capitalizada
feat: Added OAuth.      # Pasado, punto al final
feature(auth): update   # Nombre de tipo incorrecto
```

**✅ Correcto:**
```
feat: add new feature
fix: resolve bug in login
feat(auth): add OAuth support
feat(auth): update authentication flow
```

## Restricciones

- Nunca usar tiempo pasado ("added" → "add", "fixed" → "fix")
- Nunca capitalizar la descripción
- Nunca agregar punto final a la descripción
- Nunca exceder 72 caracteres en la primera línea
- Nunca omitir línea en blanco entre encabezado y cuerpo
```

### Uso en Contexto

Cuando un usuario dice:
- "Create a commit message for these changes"
- "Format this commit message"
- "Is this commit message correct?"

El agente carga este skill y aplica las reglas de formato usando solo las instrucciones proporcionadas.

---

## Patrón 2: Asset Utilization (Basado en Plantillas)

### Cuándo Usar

Use Asset Utilization cuando:
- **Se necesita contenido estático grande** - Plantillas, licencias, código base (boilerplate)
- **Para prevenir el desperdicio de tokens** - Referencie archivos en lugar de incluirlos inline
- **Recursos reutilizables** - El mismo contenido usado en múltiples contextos
- **Múltiples variaciones** - Diferentes plantillas para diferentes casos

**Ejemplos:**
- Adición de encabezados de licencia
- Plantillas de código
- Generadores de archivos de configuración
- Scaffolding de código base

### Estructura

```
skill-name/
├── SKILL.md              # Instrucciones que referencian recursos
└── resources/            # Archivos estáticos
    ├── template-1.txt
    ├── template-2.json
    └── config.yaml
```

### Beneficios

- **Eficiencia de tokens** - El contenido grande se almacena en archivos
- **Actualizaciones fáciles** - Cambie las plantillas sin tocar las instrucciones
- **Múltiples variantes** - Soporte para diferentes tipos de plantillas
- **Reusabilidad** - Comparta recursos entre tareas similares

### Limitaciones

- **Gestión de archivos** - Más archivos que mantener
- **Dependencias de ruta** - Requiere rutas relativas correctas
- **Sin generación dinámica** - Solo contenido estático

### Ejemplo Completo: Agregador de Encabezados de Licencia

**Directorio:** `license-header-adder/`

**Archivo:** `SKILL.md`

```markdown
---
name: license-header-adder
description: Adds appropriate license headers to source code files based on project license type, preventing legal issues and ensuring compliance
---

# Agregador de Encabezados de Licencia

## Objetivo

Añadir encabezados de licencia legalmente correctos a los archivos de código fuente preservando el código existente y respetando la sintaxis de comentarios específica del lenguaje.

## Proceso

### 1. Identificar el Tipo de Licencia

Comprobar la licencia en el proyecto:
```bash
# Buscar el archivo LICENSE
cat LICENSE

# Comprobar package.json
jq '.license' package.json

# Comprobar pyproject.toml
grep "license" pyproject.toml
```

### 2. Seleccionar la Plantilla

Basado en la licencia detectada:
- **MIT:** `resources/mit-header.txt`
- **Apache 2.0:** `resources/apache-header.txt`
- **GPL 3.0:** `resources/gpl-header.txt`
- **Proprietaria:** `resources/proprietary-header.txt`

### 3. Leer la Plantilla

Cargar la plantilla apropiada del directorio de recursos.

### 4. Detectar el Lenguaje

Determinar el lenguaje de programación a partir de la extensión del archivo:
- `.py` → Python
- `.js`, `.ts`, `.jsx`, `.tsx` → JavaScript/TypeScript
- `.java` → Java
- `.cpp`, `.c`, `.h` → C/C++
- `.sh`, `.bash` → Shell
- `.rb` → Ruby
- `.go` → Go

### 5. Formatear el Encabezado

Aplicar la sintaxis de comentarios específica del lenguaje:

**Python, Shell, Ruby:**
```python
# Copyright (c) 2026 Your Company
#
# [Texto de la licencia aquí...]
```

**JavaScript, TypeScript, Java, C/C++:**
```javascript
/*
 * Copyright (c) 2026 Your Company
 *
 * [Texto de la licencia aquí...]
 */
```

**Go:**
```go
// Copyright (c) 2026 Your Company
//
// [Texto de la licencia aquí...]
```

### 6. Insertar el Encabezado

Reglas para la inserción:
- **Shebang presente:** Insertar DESPUÉS de la línea shebang
- **Encabezado existente:** Omitir archivo (no modificar)
- **Archivo generado:** Omitir (comprobar el comentario "Auto-generated")
- **Archivo normal:** Insertar al principio

### 7. Preservar el Contenido Existente

- NO modificar el código existente
- NO eliminar los encabezados existentes
- Mantener la codificación original del archivo
- Preservar los finales de línea (LF vs CRLF)

## Referencia de Sintaxis de Comentarios

| Lenguaje | Sintaxis | Ejemplo |
|:---------|:---------|:--------|
| Python | Prefijo `#` | `# Copyright...` |
| JavaScript | Bloque `/* */` | `/* Copyright... */` |
| TypeScript | Bloque `/* */` | `/* Copyright... */` |
| Java | Bloque `/* */` | `/* Copyright... */` |
| C/C++ | Bloque `/* */` | `/* Copyright... */` |
| Shell | Prefijo `#` | `# Copyright...` |
| Ruby | Prefijo `#` | `# Copyright...` |
| Go | Prefijo `//` | `// Copyright...` |

## Variables de Plantilla

Las plantillas soportan la sustitución de variables:

- `{YEAR}` → Año actual
- `{COPYRIGHT_HOLDER}` → Nombre de la empresa/autor
- `{PROJECT_NAME}` → Nombre del proyecto

Pida los valores al usuario si no se encuentran en:
- `package.json` (name, author)
- `pyproject.toml` (name, authors)
- archivo `LICENSE` (titular del copyright)
- `.git/config` (user name)

## Ejemplos

### Archivo Python (MIT)

**Antes:**
```python
def hello():
    print("Hello, world!")
```

**Después:**
```python
# Copyright (c) 2026 Acme Corporation
#
# Permission is hereby granted, free of charge, to any person obtaining a copy
# of this software and associated documentation files (the "Software"), to deal
# in the Software without restriction...

def hello():
    print("Hello, world!")
```

### Archivo JavaScript con Shebang (Apache)

**Antes:**
```javascript
#!/usr/bin/env node
console.log("Hello");
```

**Después:**
```javascript
#!/usr/bin/env node
/*
 * Copyright (c) 2026 Acme Corporation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License...
 */
console.log("Hello");
```

## Restricciones

- **Nunca modificar encabezados de licencia existentes**
- **Nunca eliminar líneas shebang**
- **Nunca añadir encabezados a:**
  - Archivos generados (comprobar comentarios de generación automática)
  - Archivos binarios
  - Archivos en `.gitignore`
  - Directorios `node_modules/`, `dist/`, `build/`
- **Siempre preservar:**
  - Codificación del archivo
  - Finales de línea
  - Código existente
  - Permisos del archivo

## Validación

Después de añadir el encabezado, verificar:
- [ ] El encabezado está al principio (o después del shebang)
- [ ] Sintaxis de comentarios correcta para el lenguaje
- [ ] Variables reemplazadas por valores reales
- [ ] Código existente sin cambios
- [ ] El archivo sigue ejecutándose (si es ejecutable)
```

**Archivo:** `resources/mit-header.txt`

```
Copyright (c) {YEAR} {COPYRIGHT_HOLDER}

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

**Archivo:** `resources/apache-header.txt`

```
Copyright (c) {YEAR} {COPYRIGHT_HOLDER}

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
```

**Archivo:** `resources/proprietary-header.txt`

```
Copyright (c) {YEAR} {COPYRIGHT_HOLDER}. All rights reserved.

PROPRIETARY AND CONFIDENTIAL

This software is the confidential and proprietary information of
{COPYRIGHT_HOLDER}. You shall not disclose such confidential information
and shall use it only in accordance with the terms of the license agreement
you entered into with {COPYRIGHT_HOLDER}.
```

### Uso en Contexto

El agente referencia `resources/mit-header.txt` en lugar de incluir el texto completo inline, ahorrando tokens mientras mantiene la precisión del texto completo de la licencia.

---

## Patrón 3: Few-Shot Learning (Basado en Ejemplos)

### Cuándo Usar

Use Few-Shot Learning cuando:
- **La transformación es más fácil de mostrar que de describir** - Patrones visuales
- **Múltiples enfoques válidos** - Los ejemplos demuestran el estilo preferido
- **Formato de salida complejo** - La estructura es más clara con ejemplos
- **Los casos límite importan** - Los ejemplos cubren variaciones importantes

**Ejemplos:**
- Conversiones de esquemas (JSON a Pydantic, OpenAPI a TypeScript)
- Generación de código (SQL a ORM, REST a GraphQL)
- Transformaciones de formato (Markdown a HTML, YAML a JSON)
- Aplicación de estilo (refactorización de código, diseño de API)

### Estructura

```
skill-name/
├── SKILL.md              # Instrucciones + referencia a ejemplos
└── examples/             # Pares de entrada/salida
    ├── input-1.json
    ├── output-1.py
    ├── input-2.json
    └── output-2.py
```

### Beneficios

- **Mostrar, no explicar** - Ejemplos más claros que las descripciones
- **Cubrir casos límite** - Demostrar el manejo de situaciones especiales
- **Estilo consistente** - El LLM aprende los patrones preferidos
- **Ambigüedad reducida** - Menos margen de interpretación

### Limitaciones

- **Mantenimiento de ejemplos** - Debe mantener los ejemplos actualizados
- **Uso de tokens** - Cargar ejemplos aumenta el contexto
- **Brechas de cobertura** - Podrían no cubrirse todos los casos posibles

### Ejemplo Completo: Conversor de JSON a Pydantic

**Directorio:** `json-to-pydantic/`

**Archivo:** `SKILL.md`

```markdown
---
name: json-to-pydantic
description: Converts JSON schemas or sample JSON data into Pydantic model classes for Python data validation with proper type hints and field validators
---

# Conversor de JSON a Pydantic

## Objetivo

Generar clases de modelo de Pydantic listas para producción a partir de esquemas JSON o datos JSON de muestra, incluyendo anotaciones de tipo adecuadas, validación de campos y documentación.

## Proceso

### 1. Analizar la Entrada

Determinar el tipo de entrada:
- **Esquema JSON:** Esquema formal con tipos y restricciones
- **JSON de Muestra:** Datos de ejemplo de los cuales inferir los tipos

### 2. Inferir Tipos de Python

Mapear los tipos JSON a tipos de Python:

| Tipo JSON | Tipo Python | Campo Pydantic |
|:----------|:------------|:---------------|
| `string` | `str` | `str` |
| `number` | `float` | `float` |
| `integer` | `int` | `int` |
| `boolean` | `bool` | `bool` |
| `null` | `None` | `Optional[T]` |
| `array` | `list` | `List[T]` |
| `object` | clase anidada | Modelo anidado |

### 3. Manejar Casos Especiales

**Strings de correo electrónico:**
```python
from pydantic import EmailStr
email: EmailStr
```

**URLs:**
```python
from pydantic import HttpUrl
url: HttpUrl
```

**Fechas/Horas:**
```python
from datetime import datetime
created_at: datetime
```

**UUIDs:**
```python
from uuid import UUID
id: UUID
```

### 4. Añadir Validación

Usar `Field()` para las restricciones:

```python
from pydantic import Field

age: int = Field(..., ge=0, le=150)
username: str = Field(..., min_length=3, max_length=50)
score: float = Field(..., gt=0.0, le=100.0)
tags: List[str] = Field(default_factory=list)
```

### 5. Generar Docstrings

Añadir documentación de la clase y de los campos:

```python
class User(BaseModel):
    """Modelo de cuenta de usuario a partir del esquema JSON"""

    name: str = Field(..., description="Nombre completo del usuario")
    age: int = Field(..., description="Edad del usuario en años")
```

### 6. Manejar el Anidamiento

Crear modelos anidados para objetos:

```python
class Address(BaseModel):
    """Modelo de dirección"""
    street: str
    city: str

class User(BaseModel):
    """Modelo de usuario"""
    name: str
    address: Address  # Modelo anidado
```

## Reglas de Inferencia de Tipos

### Desde un Esquema JSON

```json
{
  "type": "object",
  "properties": {
    "name": {"type": "string"},
    "age": {"type": "integer", "minimum": 0}
  },
  "required": ["name"]
}
```

Se convierte en:

```python
class Model(BaseModel):
    name: str
    age: Optional[int] = Field(None, ge=0)
```

### Desde Datos de Muestra

```json
{
  "name": "John",
  "age": 30,
  "email": "john@example.com"
}
```

Infiere:
- `"John"` → `str`
- `30` → `int`
- `"john@example.com"` → `EmailStr` (si el formato de correo es válido)

## Directorio de Ejemplos

El directorio `examples/` contiene pares de entrada/salida que demuestran:
1. Objetos planos simples
2. Objetos anidados
3. Arreglos y listas
4. Campos opcionales
5. Validación compleja

Estudie estos ejemplos para entender los patrones de transformación esperados.

## Plantilla de Importaciones

Incluya siempre las importaciones necesarias:

```python
from pydantic import BaseModel, Field, EmailStr, HttpUrl
from typing import List, Optional, Dict, Any
from datetime import datetime
from uuid import UUID
```

## Mejores Prácticas de Validación

- **Campos requeridos:** Use `...` como valor por defecto
- **Campos opcionales:** Use `Optional[T]` con `None` por defecto
- **Listas:** Use `default_factory=list` no `[]`
- **Restricciones numéricas:** Use `ge`, `gt`, `le`, `lt` en Field()
- **Longitud de strings:** Use `min_length`, `max_length` en Field()
- **Patrones regex:** Use `regex` en Field()

## Restricciones

- Use la sintaxis de Pydantic V2 (si el proyecto usa V2)
- Siga el estilo de importación del proyecto (absolutas vs. relativas)
- Coincida con la estructura de modelos existente si está extendiendo
- Incluya anotaciones de tipo para todos los campos
- Añada docstrings para las clases y los campos complejos
- Use `Field()` para la validación, no validadores personalizados (a menos que sea lógica compleja)
```

**Archivo:** `examples/input-1.json`

```json
{
  "name": "John Doe",
  "age": 30,
  "email": "john@example.com",
  "tags": ["developer", "python"]
}
```

**Archivo:** `examples/output-1.py`

```python
from pydantic import BaseModel, Field, EmailStr
from typing import List

class User(BaseModel):
    """Modelo de usuario a partir del esquema JSON"""

    name: str = Field(..., description="Nombre completo del usuario")
    age: int = Field(..., ge=0, le=150, description="Edad del usuario en años")
    email: EmailStr = Field(..., description="Dirección de correo electrónico del usuario")
    tags: List[str] = Field(default_factory=list, description="Etiquetas del usuario")
```

**Archivo:** `examples/input-2.json`

```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "title": "Sample Post",
  "content": "This is a blog post",
  "published": true,
  "created_at": "2026-01-15T10:30:00Z",
  "author": {
    "name": "Jane Smith",
    "email": "jane@example.com"
  },
  "comments": [
    {
      "author": "Bob",
      "text": "Great post!"
    }
  ],
  "metadata": {
    "views": 1500,
    "likes": 42
  }
}
```

**Archivo:** `examples/output-2.py`

```python
from pydantic import BaseModel, Field, EmailStr
from typing import List, Dict, Any, Optional
from datetime import datetime
from uuid import UUID

class Author(BaseModel):
    """Información del autor"""

    name: str = Field(..., description="Nombre del autor")
    email: EmailStr = Field(..., description="Correo electrónico del autor")

class Comment(BaseModel):
    """Comentario en una publicación"""

    author: str = Field(..., description="Nombre del autor del comentario")
    text: str = Field(..., min_length=1, description="Texto del comentario")

class BlogPost(BaseModel):
    """Modelo de publicación de blog a partir del esquema JSON"""
    id: UUID = Field(..., description="Identificador único de la publicación")
    title: str = Field(..., min_length=1, max_length=200, description="Título de la publicación")
    content: str = Field(..., description="Contenido de la publicación")
    published: bool = Field(default=False, description="Estado de publicación")
    created_at: datetime = Field(..., description="Timestamp de creación")
    author: Author = Field(..., description="Autor de la publicación")
    comments: List[Comment] = Field(default_factory=list, description="Comentarios de la publicación")
    metadata: Dict[str, Any] = Field(default_factory=dict, description="Metadatos adicionales")
```

### Uso en Contexto

El agente estudia los ejemplos para entender:
- Cómo manejar objetos anidados (Author, Comment)
- Cómo usar tipos especiales (UUID, datetime, EmailStr)
- Cómo aplicar validación (min_length, max_length, ge, le)
- Cómo estructurar docstrings
- Cómo manejar colecciones (List, Dict)

---

## Patrón 4: Procedural Logic (Basado en Scripts)

### Cuándo Usar

Use Procedural Logic cuando:
- **Se necesita validación determinística** - Comprobaciones binarias sí/no
- **Se requiere computación compleja** - Matemáticas, análisis sintáctico (parsing), análisis
- **El juicio del LLM es insuficiente** - Existen criterios objetivos
- **El rendimiento importa** - El script es más rápido que el razonamiento del LLM

**Ejemplos:**
- Validación de esquemas (migraciones de bases de datos, especificaciones de API)
- Linting de código (reglas personalizadas)
- Escaneo de seguridad (comprobación de dependencias)
- Análisis de rendimiento (análisis de benchmarks)

### Estructura

```
skill-name/
├── SKILL.md              # Instrucciones + uso de scripts
└── scripts/              # Scripts ejecutables
    ├── validate.py
    ├── check.sh
    └── helpers.py
```

### Beneficios

- **Determinístico** - Resultados consistentes y confiables
- **Rápido** - Más rápido que el procesamiento del LLM
- **Preciso** - Comprobaciones exactas, sin interpretación
- **Testeable** - Los scripts pueden tener pruebas unitarias

### Limitaciones

- **Requiere entorno de ejecución** - Python, Node, etc.
- **Sobrecarga de mantenimiento** - Los scripts necesitan actualizaciones
- **Preocupaciones de seguridad** - Riesgos de ejecución de código
- **Dependencias de plataforma** - Podría no funcionar en todas partes

### Ejemplo Completo: Validador de esquemas de bases de datos

**Directorio:** `database-schema-validator/`

**Archivo:** `SKILL.md`

```markdown
---
name: database-schema-validator
description: Validates database schema migrations for consistency, safety, and best practices before applying to production databases
---

# Validador de Esquemas de Bases de Datos

## Objetivo

Asegurar que las migraciones de bases de datos sean seguras, reversibles y sigan las mejores prácticas antes del despliegue en producción.

## Proceso

### 1. El Usuario Proporciona la Migración

El usuario proporciona la ruta al archivo de migración:
```
Por favor, valida esta migración: migrations/001_add_users_table.sql
```

### 2. Ejecutar el Script de Validación

Ejecutar el script de validación:
```bash
python scripts/validate.py migrations/001_add_users_table.sql
```

### 3. Analizar la Salida del Script

El script retorna un JSON con los resultados de la validación:
```json
{
  "valid": true,
  "errors": [],
  "warnings": ["Falta índice en la clave foránea: user_id"],
  "suggestions": ["Añadir índice en posts.user_id para mejorar el rendimiento"]
}
```

### 4. Reportar los Resultados

Presentar los resultados al usuario:
- **Errores:** Deben corregirse antes del despliegue
- **Advertencias (Warnings):** Deberían abordarse
- **Sugerencias:** Mejoras opcionales

### 5. Proporcionar Correcciones

Para cada error/advertencia, sugerir una corrección específica con un ejemplo.

## Comprobaciones de Validación

El script de validación (`scripts/validate.py`) comprueba:

### Comprobaciones de Seguridad (Errores)
- ❌ `DROP TABLE` sin comentario de seguridad
- ❌ `DROP COLUMN` sin comentario de seguridad
- ❌ `ALTER COLUMN` cambiando el tipo sin ruta de migración
- ❌ Falta de valor por defecto `NOT NULL` para nuevas columnas
- ❌ Sin envoltura de transacción para migraciones de datos

### Comprobaciones de Mejores Prácticas (Advertencias)
- ⚠️ Falta de índices en claves foráneas
- ⚠️ Falta de timestamps `created_at`/`updated_at`
- ⚠️ Comportamiento `ON DELETE` no especificado
- ⚠️ Comportamiento `ON UPDATE` no especificado
- ⚠️ Nombres de tablas/columnas largos (>63 caracteres para PostgreSQL)

### Comprobaciones de Reversibilidad (Advertencias)
- ⚠️ Sin migración "down" correspondiente
- ⚠️ Operaciones destructivas sin plan de respaldo

## Uso de Scripts

### Validación Básica

```bash
python scripts/validate.py <archivo-de-migración>
```

### Códigos de Salida

- `0` - Migración válida (sin errores)
- `1` - Migración inválida (errores encontrados)
- `2` - Solo advertencias (válido pero no ideal)

### Formato de Salida

El script emite un JSON por la salida estándar:
```json
{
  "valid": boolean,
  "errors": ["mensaje de error", ...],
  "warnings": ["mensaje de advertencia", ...],
  "suggestions": ["texto de sugerencia", ...]
}
```

## Ejemplos

### Migración Válida

**Entrada:** `migrations/001_create_users.sql`
```sql
-- Up Migration
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
```

**Resultado de la Validación:**
```json
{
  "valid": true,
  "errors": [],
  "warnings": [],
  "suggestions": []
}
```

### Migración Inválida

**Entrada:** `migrations/002_drop_users.sql`
```sql
DROP TABLE users;
```

**Resultado de la Validación:**
```json
{
  "valid": false,
  "errors": [
    "DROP TABLE sin comentario de seguridad (añada -- SAFE: <razón>)"
  ],
  "warnings": [],
  "suggestions": [
    "Añada un comentario de seguridad explicando por qué este borrado es seguro",
    "Considere usar borrado lógico (soft-delete) en lugar de DROP TABLE"
  ]
}
```

### Migración con Advertencias

**Entrada:** `migrations/003_add_posts.sql`
```sql
CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  user_id INTEGER REFERENCES users(id)
);
```

**Resultado de la Validación:**
```json
{
  "valid": true,
  "errors": [],
  "warnings": [
    "Falta índice en la clave foránea: user_id",
    "Falta la columna timestamp created_at",
    "Falta la columna timestamp updated_at",
    "Comportamiento ON DELETE no especificado para la clave foránea"
  ],
  "suggestions": [
    "Añadir: CREATE INDEX idx_posts_user_id ON posts(user_id);",
    "Añadir: created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
    "Añadir: updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
    "Especificar: ON DELETE CASCADE o ON DELETE SET NULL"
  ]
}
```

## Formato de Reporte

Al presentar los resultados al usuario:

### Todo Despejado
```
✅ Validación de la migración superada

No se han encontrado errores ni advertencias. La migración es segura de aplicar.
```

### Solo Advertencias
```
⚠️ Validación de la migración superada con advertencias

La migración es válida pero tiene algunas recomendaciones:

Advertencias:
• Falta índice en la clave foránea: user_id
• Falta la columna timestamp created_at

Sugerencias:
• Añadir: CREATE INDEX idx_posts_user_id ON posts(user_id);
• Añadir: created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
```

### Errores Encontrados
```
❌ Validación de la migración fallida

Se deben corregir los errores críticos antes del despliegue:

Errores:
• DROP TABLE sin comentario de seguridad

Correcciones sugeridas:
• Añada comentario de seguridad: -- SAFE: La tabla está obsoleta y sin uso
• O considere el borrado lógico en lugar de DROP TABLE
```

## Restricciones

- **Nunca ejecutar migraciones** - Solo validar, nunca ejecutar
- **Reportar todos los problemas** - No se detenga en el primer error
- **Explicar el porqué** - Cada comprobación debe explicar el razonamiento
- **Proporcionar correcciones** - Sugiera siempre correcciones específicas
- **Ser conservador** - Erre por el lado de la precaución para mayor seguridad
```

**Archivo:** `scripts/validate.py`

```python
#!/usr/bin/env python3
"""
Validador de migraciones de bases de datos

Comprueba los archivos de migración SQL en busca de seguridad, mejores prácticas y reversibilidad.
"""

import sys
import json
import re
from typing import Dict, List, Any
from pathlib import Path


class MigrationValidator:
    """Valida los archivos de migración de bases de datos"""

    def __init__(self, filepath: str):
        self.filepath = Path(filepath)
        self.sql = self.filepath.read_text()
        self.errors: List[str] = []
        self.warnings: List[str] = []
        self.suggestions: List[str] = []

    def validate(self) -> Dict[str, Any]:
        """Ejecutar todas las comprobaciones de validación"""
        self.check_dangerous_operations()
        self.check_foreign_key_indexes()
        self.check_timestamps()
        self.check_foreign_key_behavior()
        self.check_name_lengths()

        return {
            "valid": len(self.errors) == 0,
            "errors": self.errors,
            "warnings": self.warnings,
            "suggestions": self.suggestions
        }

    def check_dangerous_operations(self):
        """Comprobar operaciones DROP/ALTER inseguras"""
        # Comprobar DROP TABLE sin comentario de seguridad
        drop_tables = re.finditer(r'DROP TABLE\s+(\w+)', self.sql, re.IGNORECASE)
        for match in drop_tables:
            table = match.group(1)
            # Buscar comentario de seguridad antes del DROP
            safe_pattern = f'--\\s*SAFE:.*{table}'
            if not re.search(safe_pattern, self.sql, re.IGNORECASE):
                self.errors.append(f"DROP TABLE {table} sin comentario de seguridad")
                self.suggestions.append(f"Añada un comentario: -- SAFE: Explicación para borrar {table}")

        # Comprobar DROP COLUMN sin comentario de seguridad
        drop_columns = re.finditer(r'DROP COLUMN\s+(\w+)', self.sql, re.IGNORECASE)
        for match in drop_columns:
            column = match.group(1)
            safe_pattern = f'--\\s*SAFE:.*{column}'
            if not re.search(safe_pattern, self.sql, re.IGNORECASE):
                self.errors.append(f"DROP COLUMN {column} sin comentario de seguridad")
                self.suggestions.append(f"Añada un comentario: -- SAFE: Explicación para borrar {column}")

        # Comprobar ALTER COLUMN cambiando el tipo
        alter_type = re.finditer(
            r'ALTER COLUMN\s+(\w+)\s+TYPE\s+(\w+)',
            self.sql,
            re.IGNORECASE
        )
        for match in alter_type:
            column = match.group(1)
            new_type = match.group(2)
            # Comprobar la cláusula USING (ruta de migración de datos)
            using_pattern = f'ALTER COLUMN\\s+{column}.*USING'
            if not re.search(using_pattern, self.sql, re.IGNORECASE):
                self.errors.append(
                    f"ALTER COLUMN {column} TYPE {new_type} sin cláusula USING"
                )
                self.suggestions.append(
                    f"Añada la cláusula USING para especificar la conversión de datos: USING {column}::{new_type}"
                )

    def check_foreign_key_indexes(self):
        """Comprobar que las claves foráneas tengan índices"""
        # Buscar columnas de claves foráneas
        fk_pattern = r'(\w+)\s+.*REFERENCES\s+(\w+)\((\w+)\)'
        foreign_keys = re.finditer(fk_pattern, self.sql, re.IGNORECASE)

        for match in foreign_keys:
            fk_column = match.group(1)
            # Comprobar si existe un índice para esta columna
            index_pattern = f'CREATE INDEX.*ON.*\\({fk_column}\\)'
            if not re.search(index_pattern, self.sql, re.IGNORECASE):
                self.warnings.append(f"Falta índice en la clave foránea: {fk_column}")
                self.suggestions.append(
                    f"Añadir: CREATE INDEX idx_tablename_{fk_column} ON tablename({fk_column});"
                )

    def check_timestamps(self):
        """Comprobar columnas de timestamp en CREATE TABLE"""
        create_tables = re.finditer(
            r'CREATE TABLE\s+(\w+)\s*\((.*?)\)',
            self.sql,
            re.IGNORECASE | re.DOTALL
        )

        for match in create_tables:
            table_name = match.group(1)
            table_def = match.group(2)

            if 'created_at' not in table_def.lower():
                self.warnings.append(f"Falta created_at en la tabla {table_name}")
                self.suggestions.append(
                    "Añadir: created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP"
                )

            if 'updated_at' not in table_def.lower():
                self.warnings.append(f"Falta updated_at en la tabla {table_name}")
                self.suggestions.append(
                    "Añadir: updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP"
                )

    def check_foreign_key_behavior(self):
        """Comprobar si se ha especificado el comportamiento ON DELETE/UPDATE"""
        # Buscar REFERENCES sin ON DELETE u ON UPDATE
        fk_refs = re.finditer(r'REFERENCES\s+\w+\(\w+\)', self.sql, re.IGNORECASE)

        for match in fk_refs:
            # ref_text = match.group(0)
            # Obtener el contexto alrededor del REFERENCES
            start = max(0, match.start() - 100)
            end = min(len(self.sql), match.end() + 100)
            context = self.sql[start:end]

            if 'ON DELETE' not in context.upper():
                self.warnings.append(f"Sin comportamiento ON DELETE para la clave foránea")
                self.suggestions.append(
                    "Añadir: ON DELETE CASCADE o ON DELETE SET NULL o ON DELETE RESTRICT"
                )

    def check_name_lengths(self):
        """Comprobar identificadores excesivamente largos (límite de 63 caracteres en PostgreSQL)"""
        MAX_LENGTH = 63

        # Comprobar nombres de tablas
        table_names = re.finditer(r'CREATE TABLE\s+(\w+)', self.sql, re.IGNORECASE)
        for match in table_names:
            name = match.group(1)
            if len(name) > MAX_LENGTH:
                self.warnings.append(f"Nombre de tabla demasiado largo: {name} ({len(name)} caracteres)")
                self.suggestions.append(f"Acorte el nombre de la tabla a {MAX_LENGTH} caracteres o menos")

        # Comprobar nombres de columnas
        column_names = re.finditer(r'\s+(\w+)\s+(?:INTEGER|VARCHAR|TEXT|TIMESTAMP|BOOLEAN)', self.sql, re.IGNORECASE)
        for match in column_names:
            name = match.group(1)
            if len(name) > MAX_LENGTH:
                self.warnings.append(f"Nombre de columna demasiado largo: {name} ({len(name)} caracteres)")
                self.suggestions.append(f"Acorte el nombre de la columna a {MAX_LENGTH} caracteres o menos")


def main():
    """Punto de entrada principal"""
    if len(sys.argv) != 2:
        print(json.dumps({
            "valid": False,
            "errors": ["Uso: validate.py <archivo-de-migración>"],
            "warnings": [],
            "suggestions": []
        }), file=sys.stderr)
        return 2

    filepath = sys.argv[1]

    # Comprobar que el archivo existe
    if not Path(filepath).exists():
        print(json.dumps({
            "valid": False,
            "errors": [f"Archivo no encontrado: {filepath}"],
            "warnings": [],
            "suggestions": []
        }), file=sys.stderr)
        return 2

    # Validar la migración
    validator = MigrationValidator(filepath)
    result = validator.validate()

    # Salida del resultado
    print(json.dumps(result, indent=2))

    # Retornar el código de salida apropiado
    if not result["valid"]:
        return 1  # Errores encontrados
    elif result["warnings"]:
        return 2  # Solo advertencias
    else:
        return 0  # Todo despejado


if __name__ == "__main__":
    sys.exit(main())
```

### Uso en Contexto

El agente ejecuta el script e interpreta la salida estructurada en JSON, proporcionando una validación determinística que es más rápida y confiable que el análisis basado en LLM.

---

## Patrón 5: Complex Orchestration (Completo)

### Cuándo Usar

Use Complex Orchestration cuando:
- **Flujo de trabajo de varios pasos** - Múltiples pasos secuenciales/condicionales
- **Múltiples tipos de artefactos** - Código + configuración + pruebas + documentación
- **Requiere coordinación** - Se usan scripts + plantillas + ejemplos conjuntamente
- **Alta complejidad** - Los patrones más simples son insuficientes

**Ejemplos:**
- Scaffolding de código (estructura completa del proyecto)
- Generadores de múltiples archivos (API + cliente + pruebas + documentación)
- Herramientas de migración (transformación + validación + pruebas + documentación)
- Sistemas de construcción (compilación + pruebas + empaquetado + despliegue)

### Estructura

```
skill-name/
├── SKILL.md              # Instrucciones de orquestación
├── scripts/              # Scripts de generación y validación
│   ├── generate.py
│   ├── validate.sh
│   └── helpers.py
├── resources/            # Plantillas
│   ├── code-template.py
│   └── config-template.json
└── examples/             # Ejemplos completos
    ├── example-1/
    └── example-2/
```

### Beneficios

- **Automatización completa** - Flujo de trabajo de principio a fin
- **Consistencia** - Todos los artefactos siguen patrones
- **Escalabilidad** - Maneja escenarios complejos
- **Extensibilidad** - Fácil de añadir nuevas capacidades

### Limitaciones

- **Alta complejidad** - Más difícil de mantener
- **Mayoría de dependencias** - Requiere que todos los componentes funcionen
- **Mayor uso de tokens** - Carga múltiples recursos
- **Curva de aprendizaje más pronunciada** - Complejo de entender para los usuarios

### Ejemplo Completo: Scaffold de Herramienta ADK

**Directorio:** `adk-tool-scaffold/`

**Archivo:** `SKILL.md`

```markdown
---
name: adk-tool-scaffold
description: Generates complete Agent Development Kit tool classes with schema validation, configuration files, unit tests, and documentation for custom agent capabilities
---

# Generador de Scaffold para Herramientas ADK

## Objetivo

Generar una clase de herramienta lista para producción y completamente probada para el Agent Development Kit (ADK) que incluya:
- Clase de herramienta con anotaciones de tipo y validación
- Archivo de configuración
- Pruebas unitarias exhaustivas
- Documentación de uso

## Descripción General del Flujo de Trabajo

```
1. Recaudar Requisitos → 2. Generar Herramienta → 3. Generar Configuración
                                                         ↓
5. Crear Documentación ← 4. Generar Pruebas ← 3. Validar Código
```

## Paso 1: Recaudar Requisitos

### Preguntas Interactivas

Pregunte al usuario:

1. **Nombre de la herramienta** (PascalCase)
   - Ejemplo: `WebSearchTool`, `DatabaseQueryTool`

2. **Descripción de la herramienta**
   - Ejemplo: "Busca en la web información usando la API de Google Custom Search"

3. **Parámetros de entrada**
   - Formato: `nombre:tipo:descripción:requerido`
   - Ejemplo: `query:str:Consulta de búsqueda:true`, `max_results:int:Máximo de resultados:false`

4. **Formato de salida**
   - Ejemplo: `List[Dict[str, str]]` → `[{"title": "...", "url": "..."}]`

5. **Casos de error**
   - Ejemplo: "Límite de tasa de la API excedido", "Formato de consulta inválido"

6. **Dependencias**
   - Ejemplo: `requests`, `beautifulsoup4`

### Ejemplo de Interacción

```
Usuario: Crea una herramienta para buscar en Wikipedia

Agente: Te ayudaré a crear una herramienta de búsqueda en Wikipedia. Permíteme recaudar los requisitos:

1. Nombre de la herramienta: WikipediaSearchTool
2. Descripción: Busca artículos en Wikipedia y retorna resúmenes
3. Parámetros de entrada:
   - query (str, requerido): Consulta de búsqueda
   - language (str, opcional): Código de lenguaje de Wikipedia (por defecto: "en")
   - max_results (int, opcional): Máximo de resultados a retornar (por defecto: 5)
4. Salida: List[Dict] con title, summary, url
5. Casos de error:
   - No se encontraron resultados
   - Código de lenguaje inválido
   - Error de red
6. Dependencias: wikipedia-api
```

## Paso 2: Generar la Clase de la Herramienta

### Ejecutar el Script de Generación

```bash
python scripts/generate.py \
  --name WikipediaSearchTool \
  --description "Busca artículos en Wikipedia y retorna resúmenes" \
  --params "query:str:Consulta de búsqueda:true,language:str:Código de lenguaje:false,max_results:int:Máximo de resultados:false" \
  --output List[Dict[str,str]]
```

### Acciones del Script

1. Cargar la plantilla de `resources/tool-template.py`
2. Reemplazar los marcadores de posición con las entradas del usuario
3. Generar la validación de parámetros
4. Añadir el manejo de errores
5. Incluir anotaciones de tipo
6. Escribir en `output/wikipedia_search_tool.py`

## Paso 3: Generar la Configuración

### Generación de Configuración

A partir de `resources/config-template.json`:

```json
{
  "tool_name": "WikipediaSearchTool",
  "version": "1.0.0",
  "description": "Busca artículos en Wikipedia y retorna resúmenes",
  "parameters": {
    "query": {
      "type": "string",
      "required": true,
      "description": "Consulta de búsqueda"
    },
    "language": {
      "type": "string",
      "required": false,
      "default": "en",
      "description": "Código de lenguaje de Wikipedia"
    },
    "max_results": {
      "type": "integer",
      "required": false,
      "default": 5,
      "description": "Máximo de resultados a retornar"
    }
  },
  "dependencies": ["wikipedia-api"]
}
```

## Paso 4: Validar el Código Generado

### Ejecutar la Validación

```bash
bash scripts/validate.sh output/wikipedia_search_tool.py
```

### Comprobaciones de Validación

- ✅ Sintaxis de Python válida
- ✅ Anotaciones de tipo presentes
- ✅ Docstrings completos
- ✅ Manejo de errores implementado
- ✅ Todos los parámetros validados
- ✅ El tipo de retorno coincide con la especificación

## Paso 5: Generar Pruebas Unitarias

### Generación de Pruebas

Crear `output/test_wikipedia_search_tool.py`:

```python
import pytest
from wikipedia_search_tool import WikipediaSearchTool

def test_basic_search():
    """Prueba la búsqueda básica en Wikipedia"""
    tool = WikipediaSearchTool()
    results = tool.execute(query="Python programming")
    assert len(results) > 0
    assert "title" in results[0]
    assert "summary" in results[0]

def test_max_results():
    """Prueba el parámetro max_results"""
    tool = WikipediaSearchTool()
    results = tool.execute(query="Python", max_results=3)
    assert len(results) <= 3

def test_invalid_language():
    """Prueba el manejo de códigos de lenguaje inválidos"""
    tool = WikipediaSearchTool()
    with pytest.raises(ValueError):
        tool.execute(query="Python", language="invalid")

def test_no_results():
    """Prueba el manejo de falta de resultados"""
    tool = WikipediaSearchTool()
    results = tool.execute(query="xyzabc123notexist")
    assert results == []
```

## Paso 6: Crear la Documentación

Generar `output/README.md`:

```markdown
# WikipediaSearchTool

Busca artículos en Wikipedia y retorna resúmenes.

## Instalación

```bash
pip install wikipedia-api
```

## Uso

```python
from wikipedia_search_tool import WikipediaSearchTool

tool = WikipediaSearchTool()
results = tool.execute(query="Python programming", max_results=3)

for result in results:
    print(f"{result['title']}: {result['summary']}")
```

## Parámetros

- `query` (str, requerido): Consulta de búsqueda
- `language` (str, opcional): Código de lenguaje de Wikipedia (por defecto: "en")
- `max_results` (int, opcional): Máximo de resultados (por defecto: 5)

## Manejo de Errores

- Lanza `ValueError` para códigos de lenguaje inválidos
- Retorna una lista vacía cuando no se encuentran resultados
- Maneja los errores de red con elegancia
```

## Recursos Referenciados

### Plantilla de la Herramienta

**Archivo:** `resources/tool-template.py`

```python
"""
{TOOL_NAME}

{DESCRIPTION}
"""

from typing import {OUTPUT_TYPE}
from dataclasses import dataclass


@dataclass
class {TOOL_NAME}Config:
    """Configuración para {TOOL_NAME}"""
    {CONFIG_FIELDS}


class {TOOL_NAME}:
    """
    {DESCRIPTION}

    Parámetros:
        {PARAMETERS_DOC}
    """

    def __init__(self, config: {TOOL_NAME}Config = None):
        """Inicializa la herramienta"""
        self.config = config or {TOOL_NAME}Config()

    def execute(self, {PARAMETERS}) -> {OUTPUT_TYPE}:
        """
        Ejecuta la herramienta

        Argumentos:
            {ARGS_DOC}

        Retorna:
            {RETURNS_DOC}

        Lanza:
            {RAISES_DOC}
        """
        # Validar entradas
        {VALIDATION_CODE}

        try:
            # Lógica principal
            {MAIN_LOGIC}

        except Exception as e:
            # Manejo de errores
            {ERROR_HANDLING}

        return result
```

### Plantilla de Configuración

**Archivo:** `resources/config-template.json`

```json
{
  "tool_name": "{TOOL_NAME}",
  "version": "1.0.0",
  "description": "{DESCRIPTION}",
  "parameters": {
    "{PARAM_NAME}": {
      "type": "{PARAM_TYPE}",
      "required": true,
      "description": "{PARAM_DESC}"
    }
  },
  "dependencies": []
}
```

## Ejemplo: Herramienta Generada Completa

Consulte `examples/wikipedia-search-tool/` para obtener un ejemplo de funcionamiento completo con:
- `wikipedia_search_tool.py` - Clase de herramienta generada
- `config.json` - Configuración de la herramienta
- `test_wikipedia_search_tool.py` - Pruebas unitarias
- `README.md` - Documentación

## Restricciones

- **Seguir las convenciones de ADK** - Coincidir con los patrones de herramientas existentes
- **Anotaciones de tipo completas** - Todas las funciones completamente tipadas
- **Docstrings exhaustivos** - Docstrings estilo Google
- **Manejo de errores** - Manejar todos los casos de error especificados
- **Cobertura de pruebas unitarias** - Probar el "happy path" y los casos de error
- **Dependencias documentadas** - Listar todos los requisitos
```

### Uso en Contexto

Este patrón orquestó múltiples herramientas y plantillas para generar un paquete de herramientas completo y listo para producción con todos los componentes necesarios en un solo flujo de trabajo.

---

## Eligiendo el Patrón Correcto

### Árbol de Decisión

```
Inicio: ¿Qué necesita tu skill?

┌─ ¿Solo instrucciones? ────────────────────────→ Patrón 1: Basic Router

├─ ¿Contenido estático grande? ─────────────────→ Patrón 2: Asset Utilization

├─ ¿Mostrar ejemplos de transformación? ────────→ Patrón 3: Few-Shot Learning

├─ ¿Validación determinística? ─────────────────→ Patrón 4: Procedural Logic

└─ ¿Flujo de trabajo de varios pasos? ────────────→ Patrón 5: Complex Orchestration
```

### Guía de Selección de Patrones

| Necesidad | Patrón | Complejidad | Ejemplo |
|:----------|:-------|:------------|:--------|
| Guiar el comportamiento | Basic Router | ⭐ Baja | Formateo de commits |
| Referenciar plantillas | Asset Utilization | ⭐⭐ Media | Encabezados de licencias |
| Mostrar transformaciones | Few-Shot Learning | ⭐⭐ Media | JSON a código |
| Validar con precisión | Procedural Logic | ⭐⭐⭐ Alta | Validación de esquemas |
| Automatización total | Complex Orchestration | ⭐⭐⭐⭐ Muy Alta | Scaffolding de código |

### Preguntas a Realizar

**1. ¿Pueden las instrucciones puras resolver esto?**
- ✅ Sí → Use el Patrón 1
- ❌ No → Continúe

**2. ¿Necesito referenciar contenido estático grande?**
- ✅ Sí → Use el Patrón 2
- ❌ No → Continúe

**3. ¿Es mostrar ejemplos más claro que describirlos?**
- ✅ Sí → Use el Patrón 3
- ❌ No → Continúe

**4. ¿Necesito una validación binaria y determinística?**
- ✅ Sí → Use el Patrón 4
- ❌ No → Continúe

**5. ¿Necesito orquestación de varios pasos?**
- ✅ Sí → Use el Patrón 5
- ❌ No → Reconsidere los requisitos

### Combinaciones Comunes

Los patrones pueden combinarse:

**Patrón 2 + 3:** Plantillas + Ejemplos
```
license-header-adder/
├── SKILL.md
├── resources/          # Plantillas (Patrón 2)
│   └── headers/
└── examples/           # Ejemplos (Patrón 3)
    └── sample-files/
```

**Patrón 3 + 4:** Ejemplos + Scripts
```
code-formatter/
├── SKILL.md
├── examples/           # Mostrar formateo (Patrón 3)
│   ├── before/
│   └── after/
└── scripts/            # Validar formateo (Patrón 4)
    └── validate.py
```

**Patrón 2 + 4 + 5:** Orquestación completa con todos los elementos
```
project-scaffolder/
├── SKILL.md
├── scripts/            # Generación (Patrón 4/5)
├── resources/          # Plantillas (Patrón 2)
└── examples/           # Proyectos completos (Patrón 3)
```

---

## Mejores Prácticas por Patrón

### Patrón 1: Basic Router

✅ **Hacer (SÍ):**
- Mantener las instrucciones por debajo de las 500 líneas
- Usar pasos claros y numerados
- Incluir una lista de verificación (checklist) de validación
- Proporcionar ejemplos inline

❌ **No Hacer (NO):**
- Incluir plantillas grandes inline (use el Patrón 2)
- Confiar en lógica compleja (use el Patrón 4)
- Crear flujos de trabajo de múltiples archivos (use el Patrón 5)

### Patrón 2: Asset Utilization

✅ **Hacer (SÍ):**
- Organizar los recursos por tipo
- Documentar cada archivo de recurso
- Usar nombres consistentes
- Soportar la sustitución de variables

❌ **No Hacer (NO):**
- Almacenar contenido generado
- Incluir múltiples versiones inline
- Olvidar referenciar los recursos en el SKILL.md

### Patrón 3: Few-Shot Learning

✅ **Hacer (SÍ):**
- Proporcionar de 3 a 5 ejemplos diversos
- Cubrir casos límite
- Mostrar transformaciones completas
- Documentar el propósito del ejemplo

❌ **No Hacer (NO):**
- Usar solo ejemplos triviales
- Olvidar explicar qué muestran los ejemplos
- Incluir ejemplos obsoletos

### Patrón 4: Procedural Logic

✅ **Hacer (SÍ):**
- Retornar una salida estructurada (JSON)
- Incluir mensajes de error útiles
- Hacer los scripts ejecutables
- Documentar los códigos de salida

❌ **No Hacer (NO):**
- Usar prompts interactivos
- Asumir que las dependencias están instaladas
- Modificar archivos sin permiso
- Omitir el manejo de errores

### Patrón 5: Complex Orchestration

✅ **Hacer (SÍ):**
- Dividir el flujo de trabajo en pasos claros
- Validar en cada etapa
- Proporcionar reversión (rollback) en caso de fallo
- Documentar el proceso completo

❌ **No Hacer (NO):**
- Omitir pasos de validación
- Crear un acoplamiento estrecho entre scripts
- Olvidar manejar fallos parciales
- Complicar en exceso tareas simples

---

## Migración entre Patrones

### Elevando los Patrones

**Patrón 1 → Patrón 2:**
Cuando las instrucciones crecen demasiado:
1. Extraiga el contenido grande a `resources/`
2. Actualice el SKILL.md para referenciar los archivos
3. Pruebe que las referencias funcionen

**Patrón 2 → Patrón 3:**
Cuando las plantillas necesitan contexto:
1. Cree el directorio `examples/`
2. Añada pares de entrada/salida
3. Referencie los ejemplos en el SKILL.md

**Patrón 3 → Patrón 4:**
Cuando se necesita validación:
1. Cree el directorio `scripts/`
2. Añada el script de validación
3. Actualice el SKILL.md con el uso del script

**Patrón 4 → Patrón 5:**
Cuando el flujo de trabajo se expande:
1. Añada scripts de generación
2. Añada plantillas de configuración
3. Cree documentación de orquestación

### Bajando los Patrones

A veces, lo más simple es mejor:

**Patrón 5 → Patrón 4:**
- Elimine las plantillas si no son necesarias
- Consolide los scripts
- Simplifique el flujo de trabajo

**Patrón 4 → Patrón 3:**
- Reemplace los scripts por ejemplos si no se necesita lógica determinística
- Elimine la infraestructura de scripts

**Patrón 3 → Patrón 2:**
- Mantenga las plantillas, elimine los ejemplos si los patrones son obvios

**Patrón 2 → Patrón 1:**
- Incluya plantillas pequeñas inline
- Elimine el directorio de recursos

---

## Resumen

### Referencia Rápida

| Patrón | Archivos | Caso de Uso | Complejidad |
|:-------|:---------|:------------|:------------|
| 1. Basic Router | SKILL.md | Solo instrucciones | ⭐ |
| 2. Asset Utilization | +resources/ | Contenido estático | ⭐⭐ |
| 3. Few-Shot Learning | +examples/ | Mostrar transformaciones | ⭐⭐ |
| 4. Procedural Logic | +scripts/ | Comprobaciones determinísticas | ⭐⭐⭐ |
| 5. Complex Orchestration | Todos los anteriores | Automatización total | ⭐⭐⭐⭐ |

### Principios Clave

1. **Comience simple** - Use el Patrón 1 a menos que tenga una necesidad específica
2. **Añada complejidad incrementalmente** - No salte directamente al Patrón 5
3. **Combine patrones** - Mezcle y combine según sea necesario
4. **Refactorice a medida que aprenda** - Migre entre patrones
5. **Optimice para la mantenibilidad** - Lo más simple suele ser lo mejor

### Documentación Relacionada

- [Mejores Prácticas de Skills](best-practices.md)
- [Principios de Diseño de Skills](design-principles.md)
- [Guías Específicas de Plataforma](../04-platform-guides/)
- [Referencia de Skills de Antigravity](../../../../references/skills/antigravity-skills.md)

---

**Última Actualización:** Febrero 2026
**Categoría:** Creación de Skills
**Complejidad:** Intermedio a Avanzado
**Prerrequisitos:** Comprensión del formato SKILL.md y divulgación progresiva
