# Skills Multiplataforma con OpenSkills

## Descripción General

Tradicionalmente, los skills existían dentro de ecosistemas específicos de agentes de IA. **OpenSkills** cambia este paradigma al proporcionar un instalador y cargador universal para archivos SKILL.md que funciona en múltiples agentes de IA para programación, no solo en Claude Code.

Esta guía demuestra cómo crear, instalar y gestionar skills que funcionan sin problemas en Claude Code, Cursor, Windsurf, Aider, Codex y cualquier agente que pueda leer archivos AGENTS.md.

**Concepto Clave:** OpenSkills actúa como un puente, permitiendo que un único formato de skill (SKILL.md) funcione en diferentes agentes de IA mediante divulgación progresiva y metadatos estandarizados.

---

## ¿Qué es OpenSkills?

**OpenSkills** es una herramienta CLI universal que lleva el sistema de skills de Anthropic a cualquier agente de IA para programación. Es el instalador universal para archivos SKILL.md.

**Repositorio:** [github.com/numman-ali/openskills](https://github.com/numman-ali/openskills)
**Paquete:** `openskills`
**Licencia:** Apache 2.0
**Eslogan:** "El instalador universal para SKILL.md"

### Propósito Principal

OpenSkills elimina la necesidad de mantener formatos de skills separados para diferentes agentes de IA. En lugar de crear implementaciones específicas para cada plataforma, creas un archivo SKILL.md y lo usas en todas partes.

**Sin OpenSkills:**
```
project/
├── .cursor/skills/          # Skills específicos de Cursor
├── .windsurf/skills/        # Skills específicos de Windsurf
├── .aider/skills/           # Skills específicos de Aider
└── .claude/skills/          # Skills específicos de Claude
    # Todos en formatos diferentes, mantenimiento diferente
```

**Con OpenSkills:**
```
project/
├── .claude/skills/          # o .agent/skills/ (universal)
│   └── my-skill/
│       └── SKILL.md         # Formato único, funciona en todas partes
└── AGENTS.md                # Archivo de descubrimiento de skills generado
```

### Ventajas Clave

**1. Escribe Una Vez, Usa en Todas Partes**
- Crea un skill una vez en formato SKILL.md
- Instálalo en todos tus agentes de IA
- Sin reescrituras específicas de plataforma

**2. Divulgación Progresiva**
- Los skills cargan primero los metadatos (nombre, descripción)
- El contenido completo se carga solo cuando se activa
- Previene la saturación de la ventana de contexto

**3. Instalación Flexible**
- Nivel de proyecto: `.claude/skills/`
- Global: `~/.claude/skills/`
- Universal: `.agent/skills/`

**4. Soporte para Múltiples Fuentes**
- Repositorios de GitHub
- Rutas de archivos locales
- Repositorios git privados
- Marketplace de skills de Anthropic

**5. Compatible con Control de Versiones**
- Los skills son archivos locales en tu proyecto
- Rastreados por git
- Los miembros del equipo obtienen los skills al clonar

---

## Agentes de IA Soportados

OpenSkills proporciona niveles variables de soporte en agentes de IA para programación:

| Agente | Nivel de Soporte | Implementación | Notas |
|--------|------------------|----------------|-------|
| **Claude Code** | ✅ Nativo | Usa formato SKILL.md idéntico | Compatible con OpenSkills |
| **Cursor** | ✅ Completo | Lee AGENTS.md para descubrimiento | Divulgación progresiva |
| **Windsurf** | ✅ Completo | Lee AGENTS.md para descubrimiento | Divulgación progresiva |
| **Aider** | ✅ Completo | Lee AGENTS.md para descubrimiento | Divulgación progresiva |
| **Codex** | ✅ Completo | Lee AGENTS.md para descubrimiento | Divulgación progresiva |
| **Otros** | ⚠️ Parcial | Cualquier agente que lea AGENTS.md | Requiere soporte de AGENTS.md |

### Cómo Funciona

**1. Instalación de Skills**
OpenSkills copia archivos SKILL.md a un directorio local (`.claude/skills/` por defecto).

**2. Generación de AGENTS.md**
Ejecutar `openskills sync` genera un archivo AGENTS.md con metadatos XML:

```xml
<available_skills>
  <skill>
    <name>pdf</name>
    <description>Comprehensive PDF manipulation toolkit...</description>
    <location>project</location>
  </skill>
  <skill>
    <name>commit</name>
    <description>Git commit workflow automation</description>
    <location>project</location>
  </skill>
</available_skills>
```

**3. Descubrimiento de Skills**
Los agentes de IA leen AGENTS.md para descubrir skills disponibles sin cargar el contenido completo.

**4. Carga Progresiva**
Cuando se necesita un skill:
- El agente identifica el skill desde AGENTS.md
- El agente carga el SKILL.md específico
- El agente aplica el conocimiento del skill a la tarea

Esto previene cargar todos los skills en el contexto simultáneamente.

---

## Instalación

### Requisitos

- **Node.js:** Versión 20.6 o superior
- **Git:** Requerido para operaciones de repositorio

### Inicio Rápido

**Instalación global:**
```bash
npm i -g openskills
```

**O usa con npx (sin instalación):**
```bash
npx openskills
```

### Verificación

```bash
# Verificar versión
npx openskills --version

# Mostrar ayuda
npx openskills --help
```

---

## Referencia Completa de Comandos

### 1. Install Skills

Instala skills desde varias fuentes.

**Desde el marketplace de Anthropic:**
```bash
npx openskills install anthropics/skills
```

**Desde repositorio de GitHub:**
```bash
npx openskills install username/repo-name
```

**Desde ruta local:**
```bash
npx openskills install ./path/to/skill
npx openskills install ../shared-skills/my-skill
```

**Desde repositorio privado:**
```bash
npx openskills install git@github.com:company/private-skills.git
```

**Flags:**
- `--global` - Instalar en `~/.claude/skills/` (disponible para todos los proyectos)
- `--universal` - Instalar en `.agent/skills/` (compatible con multi-agentes)
- `-y, --yes` - Omitir confirmaciones

**Ejemplos:**

```bash
# Instalación local al proyecto (por defecto)
npx openskills install anthropics/skills

# Instalación global
npx openskills install anthropics/skills --global

# Instalación multi-agente universal
npx openskills install anthropics/skills --universal

# Repositorio privado con auto-confirmación
npx openskills install git@github.com:acme/dev-skills.git -y
```

---

### 2. Sync Skills

Actualiza AGENTS.md con metadatos de skills instalados.

**Sincronización básica:**
```bash
npx openskills sync
```

**Flags:**
- `--global` - Sincronizar skills globales
- `--universal` - Sincronizar desde `.agent/skills/`
- `-o, --output <path>` - Ruta de archivo de salida personalizada

**Ejemplos:**

```bash
# Sincronizar skills del proyecto
npx openskills sync

# Sincronizar skills globales
npx openskills sync --global

# Sincronizar skills universales
npx openskills sync --universal

# Ubicación de salida personalizada
npx openskills sync -o ./custom/AGENTS.md
```

**Cuándo ejecutar sync:**
- Después de instalar nuevos skills
- Después de eliminar skills
- Después de editar manualmente el frontmatter de SKILL.md
- Cuando AGENTS.md esté desincronizado

---

### 3. Read a Skill

Carga contenido del skill para que los agentes lo consuman.

**Uso básico:**
```bash
npx openskills read <skill-name>
```

**Ejemplos:**

```bash
# Leer skill específico
npx openskills read pdf

# Leer skill (salida a terminal)
npx openskills read commit

# Redireccionar a archivo
npx openskills read api-generator > skill-content.md
```

**Caso de uso:** Los agentes usan este comando internamente para cargar skills progresivamente, pero puedes ejecutarlo manualmente para inspeccionar el contenido del skill.

---

### 4. List Installed Skills

Muestra todos los skills instalados con metadatos.

**Uso básico:**
```bash
npx openskills list
```

**Flags:**
- `--global` - Listar skills globales
- `--universal` - Listar skills universales

**Ejemplo de salida:**
```
Installed Skills:

1. pdf
   Description: Comprehensive PDF manipulation toolkit
   Location: project (.claude/skills/pdf)

2. commit
   Description: Git commit workflow automation
   Location: project (.claude/skills/commit)

3. api-generator
   Description: Generate REST API endpoints with validation
   Location: project (.claude/skills/api-generator)

Total: 3 skills
```

**Ejemplos:**

```bash
# Listar skills del proyecto
npx openskills list

# Listar skills globales
npx openskills list --global

# Listar skills universales
npx openskills list --universal
```

---

### 5. Update Skills

Actualiza skills de fuentes git a la última versión.

**Uso básico:**
```bash
npx openskills update
```

**Flags:**
- `--global` - Actualizar skills globales
- `--universal` - Actualizar skills universales
- `-y, --yes` - Auto-confirmar actualizaciones

**Ejemplos:**

```bash
# Actualizar todos los skills del proyecto
npx openskills update

# Actualizar con auto-confirmación
npx openskills update -y

# Actualizar skills globales
npx openskills update --global
```

**Comportamiento:**
- Solo actualiza skills instalados desde repositorios git
- Extrae los últimos cambios del remoto
- Preserva modificaciones locales (estrategia git pull)
- Omite skills de rutas locales

---

### 6. Remove Skills

Elimina skills específicos de la instalación.

**Uso básico:**
```bash
npx openskills remove <skill-name>
```

**Flags:**
- `--global` - Eliminar de skills globales
- `--universal` - Eliminar de skills universales
- `-y, --yes` - Omitir confirmación

**Ejemplos:**

```bash
# Eliminar skill del proyecto
npx openskills remove api-generator

# Eliminar con confirmación
npx openskills remove pdf -y

# Eliminar skill global
npx openskills remove commit --global
```

**Importante:** Después de eliminar, ejecuta `npx openskills sync` para actualizar AGENTS.md.

---

## Modos de Instalación

OpenSkills soporta tres modos de instalación con diferentes casos de uso.

### Modo Local al Proyecto (Por Defecto)

**Ubicación:** `.claude/skills/`
**Alcance:** Solo proyecto actual
**Caso de uso:** Skills específicos del proyecto

**Estructura:**
```
your-project/
├── .claude/
│   └── skills/
│       ├── skill-1/
│       │   ├── SKILL.md
│       │   └── references/
│       └── skill-2/
│           └── SKILL.md
├── AGENTS.md
└── package.json
```

**Instalación:**
```bash
cd your-project
npx openskills install anthropics/skills
npx openskills sync
```

**Ventajas:**
- Skills rastreados en control de versiones
- Los miembros del equipo obtienen skills automáticamente
- Personalización específica del proyecto
- Sin contaminación del namespace global

**Cuándo usar:**
- Skills específicos de este proyecto
- Colaboración en equipo
- Skills en desarrollo activo

---

### Modo Global

**Ubicación:** `~/.claude/skills/`
**Alcance:** Todos los proyectos para el usuario actual
**Caso de uso:** Skills personales usados en múltiples proyectos

**Estructura:**
```
~/.claude/
└── skills/
    ├── my-personal-skill/
    │   └── SKILL.md
    └── common-utilities/
        └── SKILL.md
```

**Instalación:**
```bash
npx openskills install ./my-skill --global
npx openskills sync --global
```

**Ventajas:**
- Disponible para todos los proyectos
- Sin instalación por proyecto
- Optimización del flujo de trabajo personal
- Mantenimiento centralizado

**Cuándo usar:**
- Skills de productividad personal
- Skills que usas en todas partes
- Utilidades de desarrollo
- Skills de testing y debugging

---

### Modo Universal

**Ubicación:** `.agent/skills/`
**Alcance:** Proyecto, compatible con multi-agentes
**Caso de uso:** Proyectos multiplataforma

**Estructura:**
```
your-project/
├── .agent/
│   └── skills/
│       ├── skill-1/
│       │   └── SKILL.md
│       └── skill-2/
│           └── SKILL.md
├── AGENTS.md
└── package.json
```

**Instalación:**
```bash
cd your-project
npx openskills install anthropics/skills --universal
npx openskills sync --universal
```

**Ventajas:**
- Funciona con múltiples agentes de IA
- Ubicación independiente de plataforma
- Equipo usando diferentes agentes
- Estructura a prueba de futuro

**Cuándo usar:**
- Equipos usando diferentes agentes de IA
- Flujos de trabajo multi-agente
- Proyectos independientes de plataforma
- Integración con Antigravity

---

## Generación de AGENTS.md

OpenSkills genera archivos AGENTS.md que permiten el descubrimiento de skills sin cargar el contenido completo.

### Estructura

```xml
<available_skills>
  <skill>
    <name>skill-identifier</name>
    <description>When to use this skill with trigger phrases</description>
    <location>project|global</location>
  </skill>
  <!-- More skills... -->
</available_skills>
```

### Ejemplo de AGENTS.md

```xml
<available_skills>
  <skill>
    <name>pdf</name>
    <description>Comprehensive PDF manipulation toolkit. Use when working with PDF files, extracting text, merging documents, or generating reports from PDFs.</description>
    <location>project</location>
  </skill>

  <skill>
    <name>commit</name>
    <description>Git commit workflow automation with conventional commit format. Use when creating commits, following commit standards, or automating git workflows.</description>
    <location>project</location>
  </skill>

  <skill>
    <name>api-generator</name>
    <description>Generate REST API endpoints with validation, error handling, and tests when asked to create endpoints, add API routes, or scaffold REST handlers.</description>
    <location>project</location>
  </skill>
</available_skills>
```

### Extracción de Metadatos

OpenSkills extrae metadatos del frontmatter de SKILL.md:

```yaml
---
name: skill-name
description: Detailed description with trigger phrases
---
```

Se convierte en:

```xml
<skill>
  <name>skill-name</name>
  <description>Detailed description with trigger phrases</description>
  <location>project</location>
</skill>
```

### Flujo de Divulgación Progresiva

**1. El agente inicia la tarea**
```
Usuario: "Crear un reporte PDF desde datos"
```

**2. El agente lee AGENTS.md**
```xml
<skill>
  <name>pdf</name>
  <description>Comprehensive PDF manipulation toolkit...</description>
</skill>
```

**3. El agente identifica el skill relevante**
```
El agente reconoce que "PDF" en la descripción coincide con la tarea
```

**4. El agente carga el skill**
```bash
# El agente ejecuta internamente:
npx openskills read pdf
```

**5. El agente aplica el skill**
```
El agente usa la guía de SKILL.md para crear el reporte PDF
```

Este enfoque mantiene el contexto ligero, cargando solo lo necesario.

---

## Formato SKILL.md

OpenSkills usa el formato idéntico al de los skills nativos de Claude Code.

### Estructura Básica

```markdown
---
name: skill-identifier
description: Specific trigger phrases when this skill applies
---

# Skill Title

Brief overview of skill purpose.

## When to Use

Specific scenarios and trigger conditions.

## Instructions

Step-by-step guidance or core rules.

## Examples

Concrete examples of application.

## References

Links to scripts, references, or assets.
```

### Requisitos del Frontmatter

**Campos requeridos:**
```yaml
---
name: skill-name
description: This skill should be used when asking to "phrase 1", "phrase 2", or "phrase 3"
---
```

**Campos opcionales:**
```yaml
---
name: skill-name
description: Skill description
version: 1.0.0
author: Your Name
license: MIT
tags: [api, typescript, rest]
---
```

### Estructura de Directorio

Los skills pueden incluir recursos de apoyo:

```
skill-name/
├── SKILL.md              # Archivo principal del skill (requerido)
├── scripts/              # Scripts ejecutables
│   ├── generate.py
│   └── validate.sh
├── references/           # Documentación detallada
│   ├── patterns.md
│   └── api-docs.md
├── examples/             # Ejemplos de código funcional
│   ├── basic.ts
│   └── advanced.ts
└── assets/               # Plantillas y archivos
    └── template.js
```

**Ver:** [Skill Anatomy](../01-fundamentals/skill-anatomy.md) para especificación detallada del formato.

---

## Casos de Uso

### Colaboración en Equipo

**Escenario:** Compartir skills personalizados entre el equipo de desarrollo

**Flujo de trabajo:**
```bash
# Desarrollador A crea skill
mkdir -p .claude/skills/deploy-skill
vim .claude/skills/deploy-skill/SKILL.md

# Instalar y sincronizar
npx openskills install ./deploy-skill
npx openskills sync

# Hacer commit al repositorio
git add .claude/skills/ AGENTS.md
git commit -m "feat: add deployment skill"
git push

# Desarrollador B obtiene los cambios
git pull

# Skill disponible automáticamente
# Sin configuración adicional necesaria
```

**Beneficios:**
- Skills versionados con el proyecto
- Consistente entre el equipo
- Sin distribución manual
- Funciona en CI/CD

---

### Consistencia Multi-Proyecto

**Escenario:** Usar los mismos skills en múltiples proyectos

**Flujo de trabajo:**
```bash
# Instalar skills comunes globalmente
npx openskills install anthropics/skills --global
npx openskills install company/internal-skills --global

# Sincronizar skills globales
npx openskills sync --global

# Skills disponibles para todos los proyectos
cd ~/project-1
# Skills accesibles

cd ~/project-2
# Mismos skills accesibles
```

**Beneficios:**
- Instalar una vez, usar en todas partes
- Flujos de trabajo consistentes
- Actualizaciones centralizadas
- Productividad personal

---

### Skills Privados

**Escenario:** Skills internos de la empresa no para distribución pública

**Flujo de trabajo:**
```bash
# Instalar desde repositorio privado
npx openskills install git@github.com:company/private-skills.git

# O desde desarrollo local
npx openskills install ../company-skills/api-generator

# Sincronizar
npx openskills sync

# Skills disponibles pero no accesibles públicamente
```

**Consideraciones de seguridad:**
- Usar claves SSH para repos privados
- No hacer commit de credenciales
- Revisar contenido del skill antes de instalar
- Auditar skills de terceros

**Ver:** [Third-Party Security Guidelines](../../../../guidelines/team-conventions/third-party-security-guidelines.md)

---

### Flujos de Trabajo Multi-Agente

**Escenario:** Equipo usando diferentes agentes de IA (Claude, Cursor, Windsurf)

**Flujo de trabajo:**
```bash
# Usar modo universal
npx openskills install anthropics/skills --universal

# Sincronizar a .agent/skills/
npx openskills sync --universal

# Generar AGENTS.md
# Todos los agentes pueden leer AGENTS.md

# Miembro del equipo usando Claude Code
claude
"create a commit"  # Skill funciona

# Miembro del equipo usando Cursor
cursor
"create a commit"  # Mismo skill funciona

# Miembro del equipo usando Windsurf
windsurf
"create a commit"  # Mismo skill funciona
```

**Beneficios:**
- Fuente única de skills
- Sin versiones específicas de plataforma
- Flexibilidad del equipo
- A prueba de futuro

---

## Comparación: OpenSkills vs Skills Nativos de Claude Code

### Comparación de Características

| Característica | Claude Code Nativo | OpenSkills |
|----------------|-------------------|------------|
| **Formato de Skill** | SKILL.md | SKILL.md (idéntico) |
| **Instalación** | `/skills install` | `npx openskills install` |
| **Soporte de Agentes** | Solo Claude Code | Multi-agente |
| **Ubicación de Almacenamiento** | `.claude/skills/` | Configurable |
| **Sincronización Requerida** | Automática | Manual (comando `sync`) |
| **Descubrimiento** | Integrado | AGENTS.md |
| **Divulgación Progresiva** | ✅ Sí | ✅ Sí |
| **Soporte Offline** | ✅ Sí | ✅ Sí |
| **Control de Versiones** | ✅ Sí | ✅ Sí |
| **Skills Globales** | ✅ Sí | ✅ Sí |
| **Marketplace** | Anthropic Skills | Anthropic Skills |

### Cuándo Usar Cada Uno

**Usar Skills Nativos de Claude Code Cuando:**
- Solo usas Claude Code
- Quieres detección automática de skills
- Prefieres herramientas integradas
- Necesitas configuración cero

**Usar OpenSkills Cuando:**
- Usas múltiples agentes de IA
- Necesitas compatibilidad multiplataforma
- Quieres control explícito sobre la sincronización
- Trabajas con Antigravity
- El equipo usa diferentes agentes

### ¿Puedes Usar Ambos?

**Sí.** OpenSkills y los skills nativos de Claude Code son compatibles porque usan el mismo formato SKILL.md.

**Ejemplo:**
```bash
# Instalar con Claude Code
claude /skills install anthropics/skills

# También visible para OpenSkills
npx openskills list
# Muestra skills de .claude/skills/

# Generar AGENTS.md para otros agentes
npx openskills sync
```

---

## Mejores Prácticas

### 1. Versionar Skills en Control de Versiones

**Siempre hacer commit de `.claude/skills/` y `AGENTS.md`:**

```bash
# Agregar a git
git add .claude/skills/
git add AGENTS.md
git commit -m "feat: add API generator skill"
```

**Beneficios:**
- El equipo obtiene skills automáticamente
- Skills versionados con el código
- Cambios rastreados
- Capacidad de rollback

---

### 2. Sincronizar Después de Cambios

**Ejecutar sync después de modificaciones de skills:**

```bash
# Después de instalar skill
npx openskills install new-skill
npx openskills sync

# Después de eliminar skill
npx openskills remove old-skill
npx openskills sync

# Después de editar frontmatter de SKILL.md
vim .claude/skills/my-skill/SKILL.md
npx openskills sync
```

---

### 3. Usar Nombres Descriptivos

**Nomenclatura en frontmatter:**

```yaml
# Bien
---
name: api-endpoint-generator
description: Generate REST API endpoints with validation, error handling, and tests when user asks to "create an endpoint", "add API route", "generate REST handler"
---

# Mal
---
name: api
description: API stuff
---
```

---

### 4. Documentar Dependencias

**Incluir requisitos de configuración en SKILL.md:**

```markdown
## Requirements

- Python 3.8+
- Node.js 16+
- TypeScript
- PostgreSQL (for database skills)

## Setup

Install dependencies:
\`\`\`bash
pip install -r requirements.txt
npm install
\`\`\`
```

---

### 5. Probar Entre Agentes

**Verificar que los skills funcionen en plataformas objetivo:**

```bash
# Probar con Claude Code
claude
"trigger phrase for skill"

# Probar con Cursor
cursor
"same trigger phrase"

# Verificar que AGENTS.md sea legible
cat AGENTS.md
```

---

### 6. Actualizar Periódicamente

**Mantener skills de fuentes git actualizados:**

```bash
# Mensual o trimestralmente
npx openskills update

# Verificar cambios
npx openskills list

# Sincronizar después de actualizaciones
npx openskills sync
```

---

### 7. Elegir el Modo Apropiado

**Guía de selección:**

| Escenario | Modo Recomendado |
|-----------|------------------|
| Proyecto en equipo | Local al proyecto |
| Utilidades personales | Global |
| Equipo multi-agente | Universal |
| En desarrollo | Local al proyecto |
| Estable, reutilizable | Global |
| Multiplataforma | Universal |

---

## Solución de Problemas

### Skill No Aparece

**Síntomas:** Skill instalado pero no visible para el agente

**Soluciones:**

```bash
# 1. Verificar que el skill esté instalado
npx openskills list

# 2. Verificar que AGENTS.md exista
cat AGENTS.md

# 3. Re-sincronizar
npx openskills sync

# 4. Verificar contenido de AGENTS.md
grep "skill-name" AGENTS.md

# 5. Reiniciar agente de IA
```

---

### AGENTS.md No Generado

**Síntomas:** Comando `sync` completa pero no hay AGENTS.md

**Soluciones:**

```bash
# 1. Verificar ruta de salida
ls -la AGENTS.md

# 2. Verificar que existan skills
ls -la .claude/skills/

# 3. Ruta de salida explícita
npx openskills sync -o ./AGENTS.md

# 4. Verificar permisos
ls -ld .
```

---

### Problemas de Actualización

**Síntomas:** Comando `update` falla o no obtiene cambios

**Soluciones:**

```bash
# 1. Verificar fuente del skill
npx openskills list
# Buscar URLs de git vs rutas locales

# 2. Solo skills de fuentes git se actualizan
# Skills de rutas locales no se actualizarán

# 3. Forzar actualización con reinstalación
npx openskills remove skill-name
npx openskills install username/repo
npx openskills sync

# 4. Verificar acceso a git
git ls-remote https://github.com/username/repo
```

---

### Skills No se Cargan en el Agente

**Síntomas:** AGENTS.md existe pero el agente no usa skills

**Soluciones:**

**1. Verificar que el agente soporte AGENTS.md**
- Cursor: ✅ Sí
- Windsurf: ✅ Sí
- Claude Code: ✅ Sí (nativo)
- Consultar documentación del agente

**2. Verificar formato de AGENTS.md**
```bash
# Validar estructura XML
cat AGENTS.md
# Asegurar etiquetas XML apropiadas
```

**3. Probar skill manualmente**
```bash
# Cargar contenido del skill
npx openskills read skill-name

# Verificar que SKILL.md sea válido
cat .claude/skills/skill-name/SKILL.md
```

**4. Verificar triggers de descripción**
```yaml
# Asegurar frases específicas en la descripción
description: Use when asking to "specific phrase 1", "specific phrase 2"
```

---

### Errores de Permisos

**Síntomas:** No se pueden instalar o sincronizar skills

**Soluciones:**

```bash
# 1. Verificar permisos del directorio
ls -la .claude/

# 2. Crear directorio si falta
mkdir -p .claude/skills

# 3. Corregir permisos
chmod 755 .claude/skills

# 4. Usar modo global si el proyecto es solo lectura
npx openskills install skill --global
```

---

## Integración con Este Proyecto

Este proyecto usa un enfoque de configuración centralizada compatible con OpenSkills.

### Estructura del Proyecto

```
template-best-practices/
├── .agents/
│   └── skills/              # Fuente de verdad
│       └── my-skill/
│           └── SKILL.md
├── .claude/
│   └── skills -> ../.agents/skills  # Symlink
├── .cursor/
│   └── skills -> ../.agents/skills  # Symlink
├── .gemini/
│   └── skills -> ../.agents/skills  # Symlink
└── .agent/
    └── skills/              # Symlinks selectivos (Antigravity)
```

### Usar OpenSkills en Este Proyecto

**1. Instalar en ubicación centralizada:**
```bash
# Instalar en .agents/skills/
npx openskills install anthropics/skills -o .agents/skills/

# Los symlinks se propagan automáticamente
ls -la .claude/skills
ls -la .cursor/skills
```

**2. Generar AGENTS.md:**
```bash
# Sincronizar desde .agents/skills/
npx openskills sync
```

**3. Acceder desde cualquier agente:**
```bash
# Claude Code
claude

# Cursor
cursor

# Todos ven los mismos skills vía symlinks
```

**Ver:** [Skills Management Guidelines](../../../../guidelines/team-conventions/skills-management-guidelines.md) para convenciones específicas del proyecto.

---

## Documentación Relacionada

### Fundamentos de Skills
- [What Are Skills](../01-fundamentals/what-are-skills.md) - Conceptos básicos
- [Skill Anatomy](../01-fundamentals/skill-anatomy.md) - Formato SKILL.md

### Instalación y Uso
- [Installing Skills](../02-installation/installation.md) - Métodos de instalación
- [Creating Skills Workflow](../03-creating-skills/workflow.md) - Guía de desarrollo

### Guías Específicas de Plataforma
- [Claude Code Skills](./claude-code.md) - Implementación nativa
- [Cursor Skills](./cursor.md) - Integración con Cursor
- [Antigravity Skills](./antigravity.md) - Consideraciones de Antigravity

### Referencias
- [OpenSkills GitHub](https://github.com/numman-ali/openskills) - Repositorio oficial
- [Anthropic Skills Marketplace](https://github.com/anthropics/skills) - Skills oficiales
- [SKILL.md Specification](https://github.com/anthropics/skills/blob/main/SKILL_SPEC.md) - Especificación del formato

---

## Legal y Atribución

- **Licencia:** Apache 2.0
- **Atribución:** Implementa la especificación de Agent Skills de Anthropic
- **Descargo:** OpenSkills no está afiliado con Anthropic
- **Marcas Registradas:** Claude Code y Agent Skills son marcas registradas de Anthropic PBC

---

**Última Actualización:** Febrero 2026
**Versión:** 1.0.0
**Categoría:** Platform Integration
