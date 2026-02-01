# Guía de Plataforma de Skills de Antigravity

## Resumen

Los **Skills** en Antigravity son paquetes de capacidades modulares y descubribles que extienden la funcionalidad del agente de IA con conocimiento especializado y flujos de trabajo a través de divulgación progresiva. Representan una característica más reciente añadida a Antigravity el **15 de enero de 2026**.

**Innovación Clave:** Modelo de divulgación progresiva - los skills se cargan solo cuando se necesitan, previniendo saturación de contexto y habilitando capacidades escalables del agente.

**Recursos Oficiales:**
- [Antigravity Knowledge](https://antigravity.google/docs/knowledge)
- [Authoring Antigravity Skills Codelab](https://codelabs.developers.google.com/getting-started-with-antigravity-skills)
- [Building Custom Skills Tutorial](https://medium.com/google-cloud/tutorial-getting-started-with-antigravity-skills-864041811e0d)

## Qué Hace Únicos a los Skills de Antigravity

### Modelo de Divulgación Progresiva

A diferencia de otras plataformas donde todos los skills se cargan en contexto inmediatamente, Antigravity implementa un patrón de divulgación progresiva:

**Cómo funciona:**

1. **En reposo:** El agente ve solo frontmatter de SKILL.md (nombre + descripción)
2. **Al coincidir:** La solicitud del usuario coincide semánticamente con descripción del skill
3. **Al cargar:** El contenido completo del skill (instrucciones, scripts, recursos) se carga en contexto
4. **Al ejecutar:** El agente usa conocimiento y herramientas del skill
5. **Al completar:** El skill se descarga para liberar contexto

**Beneficios:**
- ✅ Previene saturación de contexto
- ✅ Reduce costos de tokens
- ✅ Disminuye latencia
- ✅ Habilita especialización a escala
- ✅ Soporta cientos de skills simultáneamente

**Flujo de trabajo de ejemplo:**
```
Usuario: "Generar tests unitarios para este componente"
      ↓
Agente: Escanea todas las descripciones de skills
      ↓
Agente: Coincide con descripción de "testing-skill"
      ↓
Agente: Carga contenido completo de testing-skill
      ↓
Agente: Ejecuta usando experiencia en testing
      ↓
Agente: Descarga skill después de completar
```

## Ubicaciones de Almacenamiento

### Skills Globales

**Ubicación:** `~/.gemini/antigravity/skills/`

**Propósito:**
- Herramientas multi-proyecto
- Utilidades personales
- Flujos de trabajo universales
- Reutilizables en todos los espacios de trabajo

**Estructura de ejemplo:**
```
~/.gemini/antigravity/skills/
├── json-formatter/
│   └── SKILL.md
├── uuid-generator/
│   └── SKILL.md
├── code-review/
│   ├── SKILL.md
│   └── scripts/
│       └── analyze.py
└── performance-analyzer/
    ├── SKILL.md
    ├── scripts/
    └── resources/
```

### Skills de Workspace

**Ubicación:** `<workspace-root>/.agent/skills/`

**Propósito:**
- Capacidades específicas del proyecto
- Flujos de trabajo específicos de framework
- Conocimiento compartido del equipo
- Automatización específica de la base de código

**Estructura de ejemplo:**
```
.agent/skills/
├── deployment-automation/
│   ├── SKILL.md
│   └── scripts/
│       ├── deploy.sh
│       └── validate.py
├── database-migration/
│   ├── SKILL.md
│   └── resources/
│       └── migration-template.sql
├── react-component-generator/
│   ├── SKILL.md
│   ├── scripts/
│   │   └── generate.py
│   ├── resources/
│   │   └── component-template.tsx
│   └── examples/
│       ├── input-example.json
│       └── output-example.tsx
└── api-endpoint-creator/
    ├── SKILL.md
    └── scripts/
        └── scaffold.py
```

**En este proyecto:**
```
.agents/skills/          # Fuente de verdad (centralizado)
├── agent-development/
├── command-development/
├── find-skills/
├── hook-development/
├── mcp-integration/
├── skill-creator/
└── skill-development/

.agent/skills/           # Workspace de Antigravity (symlinks selectivos)
```

## Estructura de Directorios

### Diseño de Paquete de Skill

```
my-skill/
├── SKILL.md              # Requerido: Archivo de definición
├── scripts/              # Opcional: Ejecutables (Python, Bash, Node)
│   ├── README.md
│   ├── main.py
│   └── helpers.py
├── resources/            # Opcional: Plantillas, archivos estáticos
│   ├── README.md
│   ├── template-1.txt
│   └── template-2.json
├── examples/             # Opcional: Pares input/output
│   ├── README.md
│   ├── input-1.json
│   └── output-1.py
└── assets/               # Opcional: Imágenes, archivos de datos
    └── diagram.png
```

### Skill Mínimo

Para skills simples solo con instrucciones:

```
git-commit-formatter/
└── SKILL.md              # Solo instrucciones
```

### Skill Complejo

Para flujos de trabajo orquestados:

```
adk-tool-scaffold/
├── SKILL.md              # Definición y lógica de orquestación
├── scripts/
│   ├── generate.py       # Generación de código
│   ├── validate.sh       # Script de validación
│   └── test.py          # Script de testing
├── resources/
│   ├── tool-template.py  # Plantilla de código
│   ├── config-template.json
│   └── readme-template.md
├── examples/
│   ├── input-example.json
│   ├── output-example.py
│   └── test-example.py
└── assets/
    └── architecture.png
```

## Formato de SKILL.md

### Estructura de Dos Partes

Cada archivo SKILL.md tiene dos partes:

**1. Frontmatter YAML** (indexado para enrutamiento semántico)

```yaml
---
name: skill-identifier
description: Frase de activación detallada explicando cuándo/por qué usar este skill
---
```

**2. Cuerpo Markdown** (cargado cuando el skill se activa)

```markdown
# Nombre del Skill

## Objetivo
Qué logra este skill

## Instrucciones
Proceso paso a paso

## Ejemplos
Ejemplos few-shot

## Restricciones
Reglas y limitaciones
```

### Crítico: El Campo Description

La descripción determina cuándo se carga el skill. Debe ser **específica y concreta**, no vaga.

**❌ Malas descripciones (muy vagas):**
```yaml
description: Herramientas de base de datos
description: Ayuda con código
description: Utilidades generales
description: Helper de testing
```

**✅ Buenas descripciones (específicas y accionables):**
```yaml
description: Ejecuta consultas SQL de solo lectura contra bases de datos PostgreSQL para análisis de datos y debugging
description: Genera componentes funcionales de React con TypeScript, hooks y archivos de test siguiendo convenciones del proyecto
description: Aplica especificación Conventional Commits para mensajes de commit de git con validación
description: Valida migraciones de esquema de base de datos para consistencia, seguridad y mejores prácticas antes de aplicar a producción
```

### Fórmula para Escribir Description

**Fórmula:** `[Acción] [Objetivo] [Método/Contexto] [Calidad/Restricción]`

**Ejemplos:**

**Buena:**
```yaml
description: Ejecuta consultas SQL de solo lectura contra bases de datos PostgreSQL para análisis de datos y debugging
```

**Mejor:**
```yaml
description: Genera componentes funcionales de React con TypeScript, hooks, estilos y cobertura completa de tests siguiendo convenciones del proyecto
```

**Óptima:**
```yaml
description: Valida migraciones de esquema de base de datos para consistencia, seguridad y capacidad de rollback antes de despliegue a producción, verificando índices faltantes, operaciones inseguras y reversibilidad
```

## Los 5 Patrones de Skills

Los skills de Antigravity siguen cinco patrones distintos, cada uno adecuado para diferentes casos de uso.

### Patrón 1: Basic Router (Solo Instrucciones)

**Propósito:** Guiar comportamiento del agente con instrucciones puras, sin recursos externos.

**Cuándo usar:** Guía simple que no necesita plantillas, ejemplos o scripts.

**Estructura:**
```
git-commit-formatter/
└── SKILL.md
```

**Ejemplo Completo:**

**Archivo:** `git-commit-formatter/SKILL.md`

```yaml
---
name: git-commit-formatter
description: Aplica especificación Conventional Commits para mensajes de commit de git, asegurando formato consistente con tipo, alcance y descripción
---

# Git Commit Formatter

## Objetivo
Asegurar que todos los mensajes de commit sigan especificación Conventional Commits.

## Formato
```
type(scope): description

[optional body]

[optional footer]
```

## Tipos
- **feat:** Nueva característica
- **fix:** Corrección de bug
- **docs:** Documentación
- **style:** Formateo
- **refactor:** Reestructuración de código
- **test:** Testing
- **chore:** Mantenimiento

## Reglas
- Tipo debe estar en minúsculas
- Alcance es opcional pero recomendado
- Descripción debe estar en minúsculas, sin punto
- Primera línea máximo 72 caracteres
- Cuerpo y pie separados por línea en blanco

## Ejemplos
```
feat(auth): add OAuth2 login support
fix(api): resolve race condition in user update
docs(readme): update installation instructions
chore(deps): upgrade react to 18.2.0
```

## Restricciones
- Nunca usar tiempo pasado ("added" → "add")
- Sin letras mayúsculas en descripción
- Sin punto final
- Alcance debe ser sustantivo, no verbo
```

**Usar cuando:** Guía basada en instrucciones puras es suficiente.

### Patrón 2: Asset Utilization (Basado en Plantillas)

**Propósito:** Referenciar archivos estáticos para prevenir desperdicio de tokens por inlining de contenido grande.

**Cuándo usar:** El skill necesita código boilerplate, licencias o plantillas.

**Estructura:**
```
license-header-adder/
├── SKILL.md
└── resources/
    ├── mit-header.txt
    ├── apache-header.txt
    └── proprietary-header.txt
```

**Usar cuando:** El skill necesita contenido estático (plantillas, licencias, boilerplate).

### Patrón 3: Few-Shot Learning (Basado en Ejemplos)

**Propósito:** Demostrar transformaciones esperadas a través de ejemplos en lugar de descripciones.

**Cuándo usar:** El patrón es más fácil mostrar que describir, especialmente para transformaciones de código.

**Estructura:**
```
json-to-pydantic/
├── SKILL.md
└── examples/
    ├── input-1.json
    ├── output-1.py
    ├── input-2.json
    └── output-2.py
```

**Usar cuando:** Los patrones de transformación son más fáciles mostrar que describir.

### Patrón 4: Procedural Logic (Basado en Scripts)

**Propósito:** Validación o cómputo determinístico vía scripts en lugar de juicio del LLM.

**Cuándo usar:** Decisiones binarias, cálculos o validaciones que deben ser consistentes.

**Estructura:**
```
database-schema-validator/
├── SKILL.md
└── scripts/
    ├── README.md
    ├── validate.py
    └── check_migrations.sh
```

**Usar cuando:** Lógica determinística es mejor que juicio del LLM (validación, cálculo, parsing).

### Patrón 5: Complex Orchestration (Completo)

**Propósito:** Flujos de trabajo multi-paso combinando scripts, plantillas y ejemplos.

**Cuándo usar:** Generación de características complejas que requiere pasos coordinados.

**Estructura:**
```
adk-tool-scaffold/
├── SKILL.md
├── scripts/
│   ├── generate.py
│   └── validate.sh
├── resources/
│   ├── tool-template.py
│   └── config-template.json
└── examples/
    ├── example-tool.py
    └── example-config.json
```

**Usar cuando:** Flujos de trabajo complejos necesitan orquestación de múltiples pasos y artefactos.

## Ejecución de Scripts en Antigravity

### Cómo Funcionan los Scripts

Los skills referencian scripts vía rutas relativas en markdown. El agente usa la herramienta `run_command` para ejecutarlos.

**En SKILL.md:**
```markdown
Ejecutar validación:

```bash
python scripts/validator.py --file $1
```
```

**El agente interpreta:**
- **stdout** - Salida del script (capturar y parsear)
- **stderr** - Mensajes de error (reportar al usuario)
- **Código de salida** - Éxito (0) o falla (no-cero)

### Mejores Prácticas para Scripts

**✅ SÍ:**
- Retornar códigos de salida significativos (0=éxito, 1=error, 2=error de uso)
- Salida de datos estructurados (JSON preferido)
- Escribir errores a stderr
- Incluir opción `--help`
- Manejar dependencias faltantes con gracia
- Hacer scripts ejecutables (`chmod +x`)
- Usar línea shebang (`#!/usr/bin/env python3`)

**❌ NO:**
- Asumir configuración de entorno sin verificar
- Usar prompts interactivos (no soportado)
- Modificar archivos sin confirmación
- Depender de versiones específicas de herramientas sin verificar
- Imprimir info de debugging a stdout (usar stderr o logging)

### Ejemplo de Estructura de Script

**Python:**
```python
#!/usr/bin/env python3
import sys
import json
import argparse

def main(args):
    """Lógica principal"""
    parser = argparse.ArgumentParser(description='Descripción de herramienta')
    parser.add_argument('--input', required=True, help='Archivo de entrada')
    parsed_args = parser.parse_args(args)

    try:
        # Procesar
        result = {"status": "success", "data": "..."}
        print(json.dumps(result, indent=2))
        return 0
    except Exception as e:
        error = {"status": "error", "message": str(e)}
        print(json.dumps(error, indent=2), file=sys.stderr)
        return 1

if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
```

**Bash:**
```bash
#!/usr/bin/env bash
set -e  # Salir en error

# Parsear argumentos
INPUT_FILE="$1"

if [ -z "$INPUT_FILE" ]; then
  echo '{"status":"error","message":"Uso: script.sh <input-file>"}' >&2
  exit 2
fi

# Procesar
if [ -f "$INPUT_FILE" ]; then
  echo '{"status":"success","data":"processed"}'
  exit 0
else
  echo '{"status":"error","message":"Archivo no encontrado"}' >&2
  exit 1
fi
```

## Skills vs Otras Características

Entender cuándo usar skills versus otras características de Antigravity.

### Skills vs MCP

| Característica | Skills | MCP |
|---------|--------|-----|
| **Propósito** | Definiciones de tareas ("cerebros") | Conexiones de infraestructura ("manos") |
| **Activación** | Activado por agente por intención | Siempre disponible |
| **Vida útil** | Efímero (cargar/descargar) | Persistente |
| **Contexto** | Solo cuando se necesita | Siempre en contexto |
| **Complejidad** | Instrucciones + scripts + plantillas | Servidores basados en protocolo |
| **Ejemplo** | "Generar tests unitarios" | "Consultar base de datos PostgreSQL" |

**Analogía:**
- **MCP:** Da al agente manos para usar herramientas (acceso a base de datos, llamadas API, operaciones de archivos)
- **Skills:** Da al agente cerebros para saber cuándo y cómo usar esas herramientas

**Usar juntos:** Skill proporciona experiencia en testing, MCP proporciona acceso a base de datos para datos de test.

### Skills vs Rules

| Característica | Skills | Rules |
|---------|--------|-------|
| **Activación** | Activado por agente (coincidencia de intención) | Siempre activo |
| **Visibilidad** | Divulgación progresiva | Siempre cargado |
| **Propósito** | Capacidades especializadas | Guías generales |
| **Complejidad** | Puede incluir scripts | Solo instrucciones |
| **Alcance** | Tareas específicas | Principios amplios |
| **Ejemplo** | "Validador de migración de base de datos" | "Usar estilo PEP 8" |

**Usar Skills para:** Experiencia compleja y condicional que no debe estar siempre en contexto
**Usar Rules para:** Estándares continuos y universales que aplican a todo el trabajo

### Skills vs Workflows

| Característica | Skills | Workflows |
|---------|--------|-----------|
| **Activación** | Automática (coincidencia de descripción) | Manual (`/command`) |
| **Descubrimiento** | Agente determina relevancia | Usuario invoca explícitamente |
| **Complejidad** | Scripts + plantillas + ejemplos | Solo instrucciones |
| **Propósito** | Experiencia dirigida por agente | Tareas dirigidas por usuario |
| **Visibilidad** | Oculto hasta que se necesita | Descubrible vía `/` |
| **Ejemplo** | Auto-carga en "validar esquema" | Comando `/generate-tests` |

**Usar Skills para:** El agente debe decidir cuándo usar basado en solicitud del usuario
**Usar Workflows para:** El usuario explícitamente quiere ejecutar un proceso específico

## Mejores Prácticas para Antigravity

### Escribir Skills Efectivos

**✅ SÍ:**
- **Escribir descripciones precisas** - Frases de activación concretas y específicas
- **Descargar contenido pesado** - Usar `resources/` para texto estático y plantillas
- **Mostrar, no contar** - Usar `examples/` para patrones de transformación
- **Delegar a scripts** - Lógica determinística en código, no LLM
- **Separar preocupaciones** - Lógica (scripts), instrucción (SKILL.md), conocimiento (resources)
- **Mantener SKILL.md bajo 500 líneas** - Mover contenido a resources/examples
- **Documentar cada subdirectorio** - Agregar README.md a scripts/, resources/, examples/
- **Probar scripts independientemente** - Asegurar que funcionen standalone

**❌ NO:**
- Escribir descripciones vagas ("Herramientas de base de datos", "Helper de código")
- Inline de plantillas grandes en SKILL.md (desperdiciar tokens)
- Depender de inglés para patrones que ejemplos pueden mostrar
- Usar juicio del LLM para verificaciones binarias (usar scripts)
- Mezclar múltiples responsabilidades en un skill (dividirlos)
- Asumir entornos específicos (verificar dependencias)
- Usar scripts interactivos (no soportado)

### Organización de Archivos

**Estructura recomendada:**
```
my-skill/
├── SKILL.md                    # Mantener bajo 500 líneas
├── README.md                   # Opcional: documentación para usuario
├── scripts/
│   ├── README.md              # Documentar cada script
│   ├── main.py                # Script principal
│   ├── helpers.py             # Utilidades compartidas
│   └── tests/                 # Tests de scripts
│       └── test_main.py
├── resources/
│   ├── README.md              # Explicar cada recurso
│   ├── template-1.txt
│   └── template-2.json
├── examples/
│   ├── README.md              # Explicar ejemplos
│   ├── input-1.json
│   ├── output-1.py
│   ├── input-2.json
│   └── output-2.py
└── assets/                     # Opcional: diagramas, datos
    └── architecture.png
```

### Probar Skills

#### Probar Activación

Verificar que el skill se carga para solicitudes apropiadas:

**Debe activarse:**
```
Usuario: "Necesito validar esta migración de base de datos"
Usuario: "Verificar si este SQL es seguro para desplegar"
Usuario: "Revisar este cambio de esquema"
```

**NO debe activarse:**
```
Usuario: "¿Qué es SQL?"
Usuario: "¿Cómo funcionan las bases de datos?"
Usuario: "Cuéntame sobre PostgreSQL"
```

#### Probar Ejecución

- Scripts se ejecutan exitosamente
- Códigos de salida son correctos
- Salida es parseable (JSON válido)
- Errores son útiles y accionables
- Recursos se cargan correctamente
- Ejemplos se siguen con precisión

#### Probar Scripts Independientemente

```bash
# Probar fuera de contexto de skill
cd ~/.gemini/antigravity/skills/my-skill
python scripts/validate.py test-input.sql

# Verificar código de salida
echo $?

# Verificar formato de salida
python scripts/validate.py test-input.sql | jq .
```

## Solución de Problemas

### Skill No Se Activa

**Síntomas:**
- Solicitud de usuario coincide con intención pero skill no se carga
- Agente no usa conocimiento del skill
- Skill nunca aparece en contexto

**Soluciones:**

1. **Revisar especificidad de descripción**
   ```yaml
   # Muy vago
   description: Herramientas de base de datos

   # Suficientemente específico
   description: Valida migraciones de base de datos PostgreSQL para seguridad y mejores prácticas
   ```

2. **Probar con fraseo exacto**
   - Intentar usar palabras de la descripción
   - Ser más explícito en solicitud

3. **Verificar ubicación del skill**
   ```bash
   # Skills globales
   ls -la ~/.gemini/antigravity/skills/my-skill/

   # Skills de workspace
   ls -la .agent/skills/my-skill/
   ```

4. **Verificar formato de SKILL.md**
   - Verificar que frontmatter YAML tenga estructura correcta
   - Asegurar que no haya errores de sintaxis en frontmatter
   - Descripción debe estar en frontmatter, no en cuerpo

5. **Reiniciar Antigravity**
   - Los skills se indexan al inicio
   - Los cambios requieren reinicio

### Ejecución de Script Falla

**Síntomas:**
- Errores de script
- Código de salida no-cero
- Dependencias faltantes
- Permiso denegado

**Soluciones:**

1. **Probar script independientemente**
   ```bash
   cd skill-directory
   python scripts/script.py --help
   ```

2. **Verificar línea shebang**
   ```python
   #!/usr/bin/env python3
   # No: #!/usr/bin/python3 (muy específico)
   ```

3. **Verificar permisos de archivo**
   ```bash
   chmod +x scripts/script.py
   ls -la scripts/
   ```

4. **Agregar verificaciones de dependencias**
   ```python
   try:
       import required_package
   except ImportError:
       print(json.dumps({
           "status": "error",
           "message": "Paquete requerido no instalado: pip install required_package"
       }), file=sys.stderr)
       sys.exit(1)
   ```

5. **Retornar mensajes de error útiles**
   ```python
   except FileNotFoundError as e:
       error = {
           "status": "error",
           "message": f"Archivo no encontrado: {e.filename}",
           "suggestion": "Verificar la ruta del archivo e intentar nuevamente"
       }
       print(json.dumps(error), file=sys.stderr)
   ```

### Conflictos de Skills

**Síntomas:**
- Skill incorrecto se activa
- Múltiples skills activados para misma solicitud
- Comportamiento inesperado del skill

**Soluciones:**

1. **Hacer descripciones más específicas**
   ```yaml
   # Conflicto con otros skills de React
   description: Genera componentes React

   # Más específico
   description: Genera componentes funcionales React con TypeScript, hooks, tests y historias de storybook para UI de dashboard
   ```

2. **Diferenciar skills similares**
   - Agregar contexto (tecnología, framework, propósito)
   - Incluir restricciones en descripción

3. **Considerar fusionar skills superpuestos**
   - Si dos skills a menudo entran en conflicto, quizás deban ser un solo skill

4. **Probar con varias formulaciones**
   - Intentar diferentes formas de preguntar
   - Asegurar que skill se active correctamente cada vez

### Recursos No Encontrados

**Síntomas:**
- Errores de archivo no encontrado para plantillas/ejemplos
- Scripts no pueden leer recursos

**Soluciones:**

1. **Usar rutas relativas desde raíz del skill**
   ```markdown
   Plantilla: resources/template.txt
   Ejemplo: examples/input-1.json
   ```

2. **Verificar que archivo existe**
   ```bash
   ls -la my-skill/resources/template.txt
   ```

3. **Verificar que ruta en SKILL.md coincida con sistema de archivos**
   - Sensible a mayúsculas
   - Verificar errores tipográficos

## Referencias Cruzadas

### Fundamentos

Para conceptos fundamentales de skills aplicables en todas las plataformas:
- [Conceptos Fundamentales](../01-fundamentals/core-concepts.md) - Qué son los skills y cómo funcionan
- [Divulgación Progresiva](../01-fundamentals/progressive-disclosure.md) - Patrones de carga
- [Estructura de Directorios](../01-fundamentals/directory-structure.md) - Diseño de paquete de skill

### Patrones de Skills

Para guía detallada de patrones:
- [Resumen de Patrones de Skills](../03-skill-patterns/README.md) - Los cinco patrones explicados
- [Patrón Basic Router](../03-skill-patterns/basic-router.md) - Skills solo con instrucciones
- [Patrón Asset Utilization](../03-skill-patterns/asset-utilization.md) - Skills basados en plantillas
- [Patrón Few-Shot Learning](../03-skill-patterns/few-shot-learning.md) - Skills basados en ejemplos
- [Patrón Procedural Logic](../03-skill-patterns/procedural-logic.md) - Skills basados en scripts
- [Patrón Complex Orchestration](../03-skill-patterns/complex-orchestration.md) - Skills completos

### Características Relacionadas

- **MCP:** Ver documentación de MCP de Antigravity para integración de herramientas
- **Rules:** Ver documentación de Rules de Antigravity para guías siempre activas
- **Workflows:** Ver documentación de Workflows de Antigravity para comandos slash

## Recursos

### Documentación Oficial

- [Antigravity Knowledge](https://antigravity.google/docs/knowledge) - Documentación oficial
- [Authoring Antigravity Skills](https://codelabs.developers.google.com/getting-started-with-antigravity-skills) - Google Codelab
- [Building Custom Skills Tutorial](https://medium.com/google-cloud/tutorial-getting-started-with-antigravity-skills-864041811e0d) - Artículo de Medium
- [Getting Started with Antigravity](https://codelabs.developers.google.com/getting-started-google-antigravity) - Guía de introducción

### En Este Repositorio

- `.agents/skills/` - Fuente de verdad para skills
- `.agent/skills/` - Skills de workspace de Antigravity
- `docs/es/references/skills/antigravity-skills.md` - Documentación en español
- `docs/es/references/rules/antigravity-rules.md` - Rules de Antigravity
- `docs/es/references/commands/antigravity-workflows.md` - Workflows de Antigravity
- `docs/es/notes/antigravity-agent-modes-settings.md` - Configuración de agente

### Recursos Externos

- [OpenSkills](https://github.com/numman-ali/openskills) - Instalador universal de skills
- [Vercel Labs Skills](https://github.com/vercel-labs/skills) - Ecosistema de skills

---

**Última Actualización:** Febrero 2026
**Plataforma:** Google Antigravity
**Estado de Característica:** Característica Principal (Añadida 15 de enero de 2026)
**Versión del Documento:** 1.0
