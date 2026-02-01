# Mejores Prácticas para la Creación de Skills

Una guía exhaustiva para crear skills efectivos y mantenibles que funcionen de manera confiable en todas las plataformas.

---

## Tabla de Contenidos

- [Mejores Prácticas para la Escritura de Descripciones](#mejores-practicas-para-la-escritura-de-descripciones)
- [Organización de Contenidos](#organizacion-de-contenidos)
- [Desarrollo de Scripts](#desarrollo-de-scripts)
- [Prueba de Skills](#prueba-de-skills)
- [Errores Comunes a Evitar](#errores-comunes-a-evitar)
- [Lista de Verificación de Calidad](#lista-de-verificacion-de-calidad)
- [Mejores Prácticas de Mantenimiento](#mejores-practicas-de-mantenimiento)

---

## Mejores Prácticas para la Escritura de Descripciones

### El Rol Crítico de las Descripciones

El campo `description` es **la parte más importante de tu skill**. Determina cuándo se activa tu skill a través de la coincidencia semántica.

**Por qué es importante:**
- Claude y Gemini usan las descripciones para la coincidencia de intención.
- Descripciones vagas = el skill nunca se activa.
- Descripciones específicas = activación confiable.

### Fórmula para una Buena Descripción

```
[Acción] [Objetivo] [Método/Contexto] [Calidad/Restricción]
```

**Componentes:**
1. **Acción**: Qué hace el skill (valida, genera, crea, analiza).
2. **Objetivo**: Sobre qué opera (componentes React, migraciones de base de datos, endpoints de API).
3. **Método/Contexto**: Cómo o dónde (con TypeScript, para PostgreSQL, siguiendo OpenAPI).
4. **Calidad/Restricción**: Estándares o limitaciones (listo para producción, solo lectura, con reversión).

### Patrones Específicos por Plataforma

**Claude Code** (Frases de activación en tercera persona):
```yaml
description: Este skill debe usarse cuando el usuario pida "crear un hook",
"añadir un hook PreToolUse", "implementar validación de hooks" o "configurar hooks"
```

**Antigravity** (Especificación técnica detallada):
```yaml
description: Valida las migraciones de esquemas de bases de datos para asegurar la consistencia, la seguridad y la capacidad de reversión antes del despliegue en producción, verificando la falta de índices, operaciones inseguras y la reversibilidad.
```

### Ejemplos: Vaga vs. Específica

**❌ Vaga (NO se activará de forma confiable):**
```yaml
description: Herramientas de base de datos
description: Ayuda con el código
description: Utilidades generales
description: Proporciona guía para hooks
description: Componentes React
```

**✅ Específica (Se activará de forma confiable):**
```yaml
# Bien
description: Ejecuta consultas SQL de solo lectura contra bases de datos PostgreSQL para análisis de datos y depuración.

# Mejor
description: Genera componentes funcionales de React con TypeScript, hooks, estilos y una cobertura de pruebas exhaustiva siguiendo las convenciones del proyecto.

# Excelente
description: Valida las migraciones de esquemas de bases de datos para asegurar la consistencia, la seguridad y la capacidad de reversión antes del despliegue en producción, verificando la falta de índices, operaciones inseguras y la reversibilidad.
```

### Estrategias de Frases de Activación

**Incluye múltiples variaciones de frases:**
```yaml
description: Este skill debe usarse cuando el usuario pida "validar migraciones",
"comprobar el esquema de la base de datos", "revisar la seguridad de la migración" o "analizar cambios en el esquema"
```

**Incluye palabras clave del dominio:**
```yaml
description: Crea endpoints de API REST con rutas Express, middleware de validación, manejo de errores y pruebas de integración siguiendo la especificación OpenAPI.
```

**Especifica exclusiones cuando sea necesario:**
```yaml
description: Genera modelos Pydantic de Python a partir de esquemas JSON, pero SOLO para proyectos de Python (comprueba la existencia de requirements.txt o pyproject.toml).
```

---

## Organización de Contenidos

### Guías de Longitud para SKILL.md

**Objetivo:** 1,500-2,000 palabras
**Máximo:** 5,000 palabras (~500 líneas)

**¿Por qué?**
- Se carga por completo cuando el skill se activa.
- Consume la ventana de contexto.
- Más largo = más lento y más costoso.
- Es mejor dividirlo en múltiples skills enfocados.

### Cuándo Dividir en Recursos

**Mantén en SKILL.md:**
- Instrucciones centrales (cómo usar el skill).
- Guías para la toma de decisiones.
- Flujos de trabajo de procesos.
- Información de referencia rápida.

**Mueve a `references/`:**
- Documentación detallada de la API.
- Librerías de patrones exhaustivas.
- Guías de migración.
- Documentación de solución de problemas.
- Esquemas de configuración grandes.

**Mueve a `scripts/`:**
- Lógica de validación.
- Utilidades de generación de código.
- Transformación de datos.
- Automatización de despliegue.

**Mueve a `examples/`:**
- Ejemplos de funcionamiento completos.
- Pares de entrada/salida para el aprendizaje few-shot.
- Implementaciones de plantillas.

**Mueve a `assets/`:**
- Plantillas para la generación de salida.
- Código base (boilerplate).
- Imágenes, iconos.
- Plantillas de archivos de configuración.

### Patrones de Organización de Archivos

**✅ Bien - Un Nivel de Profundidad:**
```
mi-skill/
├── SKILL.md
├── scripts/
│   ├── validate.py
│   └── generate.sh
├── references/
│   ├── api-docs.md
│   └── patterns.md
├── examples/
│   ├── uso-basico.js
│   └── uso-avanzado.js
└── assets/
    └── plantilla.tsx
```

**❌ Mal - Demasiada Profundidad:**
```
mi-skill/
├── SKILL.md
└── references/
    └── docs/
        └── api/
            └── v1/
                └── endpoints.md  # ¡Demasiado anidado!
```

**✅ Bien - Referenciado en SKILL.md:**
```markdown
## Patrones Detallados

Consulta **`references/api-patterns.md`** para obtener patrones de API exhaustivos.

## Validación

Usa **`scripts/validate.sh`** para verificar las implementaciones:

\`\`\`bash
./scripts/validate.sh ruta/al/archivo
\`\`\`
```

**❌ Mal - Sin Referencia:**
```markdown
# ¡No se menciona references/api-patterns.md!
# ¡Claude no sabrá que existe!
```

### Estrategia de Divulgación Progresiva

**Nivel 1: Metadatos (~100 palabras)**
- Siempre cargado.
- Nombre + descripción.
- Usado para el descubrimiento.

**Nivel 2: Cuerpo de SKILL.md (1,500-2,000 palabras)**
- Cargado cuando el skill se activa.
- Instrucciones centrales.
- Referencias a recursos más profundos.

**Nivel 3: Recursos (variable)**
- Cargado según sea necesario.
- Documentación detallada.
- Ejemplos complejos.
- Scripts de utilidad.

---

## Desarrollo de Scripts

### Cuándo Usar Scripts

**✅ SÍ usa scripts para:**
- Validación determinística (comprobación de esquemas, linting).
- Generación de código repetitivo (boilerplate, plantillas).
- Cálculos complejos (procesamiento de datos, transformaciones).
- Integración con herramientas externas (llamadas a API, operaciones de archivos).
- Operaciones propensas a errores que requieren precisión.

**❌ NO uses scripts para:**
- Transformaciones de texto simples (el LLM puede hacerlo).
- Decisiones subjetivas (juicio de calidad del código).
- Tareas que requieren comprensión del contexto.
- Operaciones únicas.

### Mejores Prácticas de Scripts

**✅ SÍ:**

1. **Retorna códigos de salida significativos**
   ```python
   # 0 = éxito, 1 = errores, 2 = advertencias
   sys.exit(0 if valid else 1)
   ```

2. **Salida de datos estructurados (JSON)**
   ```python
   result = {
       "status": "success",
       "data": processed_data,
       "warnings": warnings_list
   }
   print(json.dumps(result, indent=2))
   ```

3. **Escribe los errores en stderr**
   ```python
   print(f"Error: {error_message}", file=sys.stderr)
   ```

4. **Incluye la opción --help**
   ```python
   if "--help" in sys.argv:
       print("Uso: script.py <archivo-de-entrada>")
       sys.exit(0)
   ```

5. **Maneja las dependencias faltantes con elegancia**
   ```python
   try:
       import required_module
   except ImportError:
       print("Error: módulo requerido no instalado", file=sys.stderr)
       print("Instalación: pip install required_module", file=sys.stderr)
       sys.exit(1)
   ```

**❌ NO:**

1. **Asumas la configuración del entorno**
   ```python
   # Mal - asume que jq existe
   os.system("cat file.json | jq .")

   # Bien - compruébalo primero
   if not shutil.which("jq"):
       print("Error: jq no encontrado", file=sys.stderr)
       sys.exit(1)
   ```

2. **Uses prompts interactivos**
   ```python
   # Mal - no funciona en el contexto del agente
   answer = input("¿Continuar? (s/n): ")

   # Bien - usa flags de la CLI
   if "--force" not in sys.argv:
       print("Error: se requiere --force para operaciones destructivas")
       sys.exit(1)
   ```

3. **Modifiques archivos sin confirmación**
   ```python
   # Mal - modificación silenciosa
   with open(file, 'w') as f:
       f.write(new_content)

   # Bien - soporte para ejecución de prueba (dry run)
   if "--dry-run" in sys.argv:
       print(f"Modificaría: {file}")
   else:
       with open(file, 'w') as f:
           f.write(new_content)
   ```

4. **Dependas de versiones específicas sin comprobarlas**
   ```python
   # Mal - asume Python 3.10+
   match value:
       case 1: return "one"

   # Bien - comprobación de versión
   if sys.version_info < (3, 10):
       print("Error: se requiere Python 3.10+", file=sys.stderr)
       sys.exit(1)
   ```

### Códigos de Salida y Manejo de Errores

**Códigos de salida estándar:**
```python
#!/usr/bin/env python3
import sys

EXIT_SUCCESS = 0      # Todo funcionó
EXIT_ERROR = 1        # Ocurrió un error fatal
EXIT_WARNING = 2      # Completado con advertencias
EXIT_USAGE = 2        # Uso/argumentos inválidos
```

**Patrón completo de manejo de errores:**
```python
#!/usr/bin/env python3
import sys
import json

def main(args):
    try:
        # Validar argumentos
        if len(args) != 1:
            print("Uso: script.py <archivo-de-entrada>", file=sys.stderr)
            return EXIT_USAGE

        # Comprobar dependencias
        if not check_dependencies():
            return EXIT_ERROR

        # Procesar
        result = process_file(args[0])

        # Salida JSON
        print(json.dumps(result, indent=2))

        # Retornar el código apropiado
        if result["errors"]:
            return EXIT_ERROR
        elif result["warnings"]:
            return EXIT_WARNING
        else:
            return EXIT_SUCCESS

    except FileNotFoundError as e:
        error = {"status": "error", "message": f"Archivo no encontrado: {e}"}
        print(json.dumps(error), file=sys.stderr)
        return EXIT_ERROR
    except Exception as e:
        error = {"status": "error", "message": str(e)}
        print(json.dumps(error), file=sys.stderr)
        return EXIT_ERROR

if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
```

### Patrones de Salida JSON

**Resultado de validación:**
```json
{
  "valid": true,
  "errors": [],
  "warnings": ["Falta índice en la clave foránea"],
  "suggestions": ["Añadir índice en la columna user_id"]
}
```

**Resultado de procesamiento:**
```json
{
  "status": "success",
  "processed": 42,
  "skipped": 3,
  "data": {
    "output_file": "resultado.json",
    "summary": "Procesados 42 elementos"
  }
}
```

**Resultado de error:**
```json
{
  "status": "error",
  "message": "Esquema inválido: falta el campo requerido 'id'",
  "context": {
    "file": "esquema.json",
    "line": 15
  }
}
```

### Gestión de Dependencias

**Comprobar dependencias en tiempo de ejecución:**
```python
def check_dependencies():
    """Verificar que todas las herramientas requeridas estén instaladas"""
    required = {
        "jq": "brew install jq",
        "git": "Instala git",
        "node": "Instala Node.js"
    }

    missing = []
    for tool, install_cmd in required.items():
        if not shutil.which(tool):
            missing.append(f"{tool}: {install_cmd}")

    if missing:
        print("Faltan dependencias:", file=sys.stderr)
        for dep in missing:
            print(f"  - {dep}", file=sys.stderr)
        return False

    return True
```

**Documentar dependencias en el script:**
```python
#!/usr/bin/env python3
"""
Validador de Esquemas de Bases de Datos

Dependencias:
  - Python 3.8+
  - sqlparse: pip install sqlparse
  - psycopg2: pip install psycopg2-binary

Uso:
  python validate.py esquema.sql
"""
```

---

## Prueba de Skills

### Prueba de Activación (Frases de Activación)

**Crear matriz de prueba:**
```markdown
| Frase | ¿Debería activarse? | Notas |
|:------|:--------------------|:------|
| "validar esta migración" | ✅ Sí | Activador principal |
| "comprobar esquema de base de datos" | ✅ Sí | Frase alternativa |
| "¿qué es una migración?" | ❌ No | Consulta informativa |
| "crear una tabla" | ❌ No | Intención diferente |
```

**Prueba con variaciones:**
```
# Activadores directos
"validar migración de base de datos"
"comprobar seguridad de la migración de esquema"
"revisar migración antes del despliegue"

# Casos límite
"migración" (demasiado vago - no debería activarse)
"validar migración en MongoDB" (si el skill es específico de PostgreSQL)
```

### Prueba de Ejecución

**1. Los scripts se ejecutan correctamente:**
```bash
# Probar el script de forma independiente
python scripts/validate.py archivo-de-prueba.sql

# Verificar el código de salida
echo $?  # Debería ser 0, 1 o 2

# Comprobar el formato de salida
python scripts/validate.py prueba.sql | jq .  # Debería ser un JSON válido
```

**2. La salida es correcta:**
```bash
# Crear casos de prueba
mkdir -p tests/fixtures

# Migración válida
cat > tests/fixtures/migracion-valida.sql <<EOF
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_users_name ON users(name);
EOF

# Migración inválida
cat > tests/fixtures/migracion-invalida.sql <<EOF
DROP TABLE users;  -- Falta el comentario de seguridad
EOF

# Probar ambas
python scripts/validate.py tests/fixtures/migracion-valida.sql
python scripts/validate.py tests/fixtures/migracion-invalida.sql
```

**3. El manejo de errores funciona:**
```bash
# Archivo faltante
python scripts/validate.py inexistente.sql
# Debería: Salir con 1, imprimir el error en stderr

# Formato inválido
echo "not sql" > invalido.txt
python scripts/validate.py invalido.txt
# Debería: Salir con 1, explicar el problema

# Dependencias faltantes
# Renombra temporalmente una dependencia, verifica el fallo elegante
```

### Prueba en Diferentes Plataformas

**Claude Code:**
```bash
# Cargar skill
cc

# Probar frases de activación
> "crear una migración de base de datos para la tabla users"

# Verificar:
# - El skill se activa
# - Los scripts se ejecutan
# - Las referencias se cargan cuando se mencionan
```

**Antigravity:**
```bash
# Probar en un espacio de trabajo con el skill
cd proyecto-con-skill

# Probar activador
antigravity "validar esta migración de base de datos"

# Verificar:
# - La descripción coincide con la intención
# - El skill se carga
# - Los scripts tienen los permisos correctos (chmod +x)
```

**Consideraciones multiplataforma:**
```bash
# Probar que el shebang funciona en múltiples sistemas
#!/usr/bin/env python3  # ✅ Funciona en todas partes
#!/usr/bin/python3      # ❌ Puede fallar en algunos sistemas

# Probar separadores de ruta
os.path.join("dir", "archivo")  # ✅ Multiplataforma
"dir/archivo"                    # ❌ No funcionará en Windows
```

### Iteración basada en la retroalimentación

**Seguimiento de problemas:**
```markdown
## Registro de Pruebas

### 15-01-2024
- ❌ El skill no se activó para "comprobar migración"
- **Solución:** Se añadió "comprobar" a las frases de activación de la descripción.
- ✅ Ahora se activa correctamente.

### 16-01-2024
- ❌ El script falló al faltar jq.
- **Solución:** Se añadió una comprobación de dependencias con un error útil.
- ✅ Fallo elegante con instrucciones de instalación.
```

**Necesidades comunes de iteración:**
1. **Mejoras de los activadores**: Expandir las palabras clave de la descripción.
2. **Mensajes de error**: Hacer que los fallos sean más útiles.
3. **Ejemplos**: Añadir casos de uso faltantes.
4. **Documentación**: Aclarar instrucciones ambiguas.
5. **Rendimiento**: Optimizar operaciones lentas.

---

## Errores Comunes a Evitar

### 1. Descripciones Vagas

**❌ Error:**
```yaml
description: Herramientas de base de datos
description: Ayuda con React
description: Utilidades de código
```

**✅ Solución:**
```yaml
description: Valida las migraciones de esquemas de PostgreSQL para la seguridad en producción, comprobando índices, restricciones y procedimientos de reversión.
description: Genera componentes funcionales de React con TypeScript, hooks, pruebas y stories siguiendo las convenciones del equipo.
description: Formatea y valida mensajes de commit de git usando la especificación Conventional Commits.
```

### 2. Uso de la Segunda Persona

**❌ Error:**
```markdown
Deberías validar el esquema de entrada.
Necesitas comprobar si hay errores.
Generarás el archivo de salida.
```

**✅ Solución:**
```markdown
Valida el esquema de entrada contra el formato esperado.
Comprueba si hay errores de tipo y violaciones de restricciones.
Genera el archivo de salida con los resultados procesados.
```

### 3. Todo en SKILL.md

**❌ Error:**
```markdown
# Mi Skill (7,000 palabras)

## Documentación de la API
[5,000 palabras de documentación de API incrustadas]

## Ejemplos
[30 ejemplos de código incrustados]

## Configuración
[2,000 palabras de opciones de configuración]
```

**✅ Solución:**
```markdown
# Mi Skill (2,000 palabras)

## Documentación de la API
Consulta **`references/api-docs.md`** para obtener la referencia completa de la API.

## Ejemplos
Ejemplos de funcionamiento en el directorio **`examples/`**:
- `uso-basico.js` - Caso de uso simple
- `uso-avanzado.js` - Escenarios complejos

## Configuración
Guía de configuración en **`references/configuration.md`**.
```

### 4. Recursos sin Referencia

**❌ Error:**
```
mi-skill/
├── SKILL.md          # ¡No se menciona patterns.md!
└── references/
    └── patterns.md   # Nunca se cargará
```

**✅ Solución:**
```markdown
# En SKILL.md

## Patrones Avanzados

Para patrones y técnicas exhaustivas, consulta **`references/patterns.md`**.
```

### 5. Anidamiento Profundo de Directorios

**❌ Error:**
```
mi-skill/
└── references/
    └── docs/
        └── api/
            └── v1/
                └── endpoints/
                    └── users.md
```

**✅ Solución:**
```
mi-skill/
└── references/
    ├── api-v1-endpoints.md
    └── api-v1-users.md
```

### 6. Directorios Vacíos

**❌ Error:**
```
mi-skill/
├── SKILL.md
├── scripts/        # ¡Vacío!
├── references/     # ¡Vacío!
└── examples/       # ¡Vacío!
```

**✅ Solución:**
```
mi-skill/
└── SKILL.md        # Solo incluye los directorios que realmente uses
```

---

## Lista de Verificación de Calidad

### Lista de Verificación Pre-Lanzamiento

**Estructura:**
- [ ] Skill en la ubicación correcta (`.agents/skills/`, `~/.claude/skills/` o `.agent/skills/`).
- [ ] SKILL.md tiene el frontmatter requerido (nombre, descripción).
- [ ] La descripción incluye frases de activación específicas.
- [ ] No hay directorios vacíos.
- [ ] Todos los archivos referenciados existen.
- [ ] La estructura de directorios tiene un máximo de 1 nivel de profundidad.

**Contenido:**
- [ ] SKILL.md tiene entre 1,500 y 2,000 palabras (máximo 5,000).
- [ ] La redacción usa la forma imperativa, no la segunda persona.
- [ ] El contenido grande se ha movido a `references/`.
- [ ] Todos los recursos están referenciados explícitamente en SKILL.md.
- [ ] Los ejemplos están completos y funcionan.
- [ ] La documentación es clara y accionable.

**Scripts:**
- [ ] Los scripts son ejecutables (`chmod +x`).
- [ ] Los scripts tienen el shebang adecuado (`#!/usr/bin/env python3`).
- [ ] Los scripts retornan códigos de salida significativos.
- [ ] Los scripts emiten datos estructurados (JSON).
- [ ] Los scripts manejan las dependencias faltantes.
- [ ] Los scripts incluyen la opción --help.
- [ ] Los mensajes de error se envían a stderr.

**Pruebas:**
- [ ] El skill se activa con las frases esperadas.
- [ ] El skill no se activa con frases no relacionadas.
- [ ] Los scripts se ejecutan con éxito.
- [ ] La salida del script es analizable.
- [ ] El manejo de errores funciona correctamente.
- [ ] Compatibilidad multiplataforma verificada.

### Pasos de Validación

**1. Validación de la estructura:**
```bash
# Comprobar que el archivo existe
test -f mi-skill/SKILL.md && echo "✅ SKILL.md existe"

# Comprobar el frontmatter
head -n 5 mi-skill/SKILL.md | grep "^name:" && echo "✅ Tiene nombre"
head -n 5 mi-skill/SKILL.md | grep "^description:" && echo "✅ Tiene descripción"

# Comprobar directorios vacíos
for dir in scripts references examples assets; do
    if [ -d "mi-skill/$dir" ] && [ -z "$(ls -A mi-skill/$dir)" ]; then
        echo "⚠️  Directorio vacío: $dir"
    fi
done
```

**2. Validación de scripts:**
```bash
# Comprobar ejecutabilidad
find mi-skill/scripts -type f -not -perm +111 -print

# Comprobar shebang
for script in mi-skill/scripts/*; do
    head -n 1 "$script" | grep "^#!/usr/bin/env" || echo "⚠️  No tiene un shebang adecuado: $script"
done

# Probar ejecución
for script in mi-skill/scripts/*.py; do
    python3 "$script" --help > /dev/null && echo "✅ $script soporta --help"
done
```

---

## Mejores Prácticas de Mantenimiento

### Control de Versiones

- Usa **Semantic Versioning** (v1.0.0).
- Incrementa la versión mayor (MAJOR) para cambios incompatibles.
- Incrementa la versión menor (MINOR) para nuevas funciones compatibles.
- Incrementa el parche (PATCH) para correcciones de errores compatibles.
- Mantén un `CHANGELOG.md` claro si el skill es complejo.

### Monitorización y Retroalimentación

- Realiza un seguimiento de las frases de activación que fallan.
- Recopila ejemplos de salidas incorrectas de los agentes.
- Pide retroalimentación a los usuarios finales periódicamente.
- Comprueba si hay cambios en la plataforma de los agentes (Claude, Antigravity) que afecten a la ejecución de los skills.

### Actualizaciones Periódicas

- Actualiza las dependencias de los scripts.
- Refina las descripciones para mejorar la tasa de activación.
- Revisa los ejemplos para asegurar que siguen las últimas mejores prácticas.
- Elimina documentación obsoleta.

---

**Última Actualización:** Febrero 2026
**Categoría:** Creación de Skills
**Estado de Calidad:** Guía Maestra
**Relacionado:** Principios de diseño, anatomía del skill, flujo de trabajo
