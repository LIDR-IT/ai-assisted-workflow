# Instalación y Gestión de Skills

## Descripción General

Los Skills extienden a los agentes de codificación de IA con capacidades especializadas a través de archivos markdown simples. Esta guía cubre el ciclo de vida completo de la instalación y gestión de skills, desde la configuración inicial hasta las actualizaciones y la eliminación.

Los Skills se pueden instalar en diferentes alcances (global, local del proyecto, empresarial), utilizando diversas herramientas (CLI de Skills, OpenSkills, paquetes npm), y funcionan en múltiples plataformas de agentes de IA.

## Ubicaciones de Instalación

El lugar donde instales un skill determina su disponibilidad y alcance:

### 1. Instalación Local en el Proyecto (Project-Local)

**Ubicación:** `.claude/skills/<nombre-del-skill>/SKILL.md`

**Alcance:** Disponible solo dentro del proyecto actual.

**Úsalo cuando:**
- El skill sea específico para el dominio o el stack tecnológico del proyecto.
- La colaboración en equipo requiera flujos de trabajo consistentes específicos del proyecto.
- Quieras que los skills tengan control de versiones junto con tu código base.

**Instalación:**
```bash
# Usando la CLI de Skills (por defecto en el proyecto)
npx skills add <paquete>

# Usando OpenSkills (por defecto en el proyecto)
npx openskills install <fuente>
```

**Estructura del directorio:**
```
tu-proyecto/
├── .claude/
│   └── skills/
│       ├── skill-1/
│       │   ├── SKILL.md
│       │   └── references/
│       └── skill-2/
│           └── SKILL.md
└── AGENTS.md
```

### 2. Instalación Global (Global Installation)

**Ubicación:** `~/.claude/skills/<nombre-del-skill>/SKILL.md`

**Alcance:** Disponible en todos tus proyectos.

**Úsalo cuando:**
- El skill se aplique universalmente (explicación de código, formateo, etc.).
- Quieras un comportamiento consistente en todos los proyectos.
- Los skills sean herramientas de propósito general que uses con frecuencia.

**Instalación:**
```bash
# Usando la CLI de Skills
npx skills add <paquete> -g

# Usando OpenSkills
npx openskills install <fuente> --global
```

**Estructura del directorio:**
```
~/.claude/
└── skills/
    ├── explain-code/
    │   └── SKILL.md
    ├── code-review/
    │   └── SKILL.md
    └── refactor-guide/
        └── SKILL.md
```

### 3. Instalación Universal Multi-Agente (Universal Multi-Agent)

**Ubicación:** `.agent/skills/<nombre-del-skill>/SKILL.md`

**Alcance:** Disponible para múltiples agentes de IA (no solo Claude Code).

**Úsalo cuando:**
- Trabajes con múltiples agentes de codificación de IA (Cursor, Windsurf, Aider, etc.).
- Quieras compatibilidad de skills entre plataformas.
- El equipo utilice diferentes agentes de IA.

**Instalación:**
```bash
# Usando OpenSkills con la etiqueta universal
npx openskills install <fuente> --universal
```

**Estructura del directorio:**
```
tu-proyecto/
├── .agent/
│   └── skills/
│       ├── skill-1/
│       └── skill-2/
└── AGENTS.md
```

### 4. Instalación Empresarial (Enterprise Installation)

**Ubicación:** Gestionada a través de la configuración de la organización.

**Alcance:** Todos los usuarios de la organización.

**Úsalo cuando:**
- Se necesiten aplicar estándares y mejores prácticas en toda la empresa.
- Se distribuyan flujos de trabajo propietarios.
- Sea necesaria una gestión centralizada de los skills.

**Configuración:** Contacta al administrador de tu organización o consulta la documentación sobre IAM y Ajustes Gestionados.

### Prioridad de Instalación

Cuando existen skills con el mismo nombre en varios niveles:

**Orden de resolución:** Empresarial > Personal (Global) > Proyecto > Plugin

El skill con mayor prioridad tiene precedencia.

## Comandos de la CLI de Skills

La CLI de Skills (`npx skills`) es el gestor de paquetes principal para los skills de los agentes de IA.

### Encontrar Skills (Find)

Busca en el ecosistema de skills de forma interactiva o por palabra clave:

```bash
# Búsqueda interactiva
npx skills find

# Búsqueda por palabra clave
npx skills find react performance

# Búsqueda por dominio específico
npx skills find docker deployment
npx skills find testing e2e
```

**Salida:** Lista de skills coincidentes con descripciones y comandos de instalación.

### Agregar Skills (Add)

Instala skills desde varias fuentes:

```bash
# Desde el registro de skills.sh
npx skills add vercel-labs/skills@nombre-del-skill

# Instalación global
npx skills add vercel-labs/skills@nombre-del-skill -g

# Aceptación automática (omite la confirmación)
npx skills add vercel-labs/skills@nombre-del-skill -y

# Global con aceptación automática
npx skills add vercel-labs/skills@nombre-del-skill -g -y

# Desde un repositorio de GitHub personalizado
npx skills add usuario/repo-personalizado@nombre-del-skill

# Desde un directorio local
npx skills add ./ruta/al/skill

# Desde un repositorio privado
npx skills add git@github.com:org/private-skills.git@nombre-del-skill
```

**Etiquetas (Flags):**
- `-g` — Instalar globalmente (`~/.claude/skills/`).
- `-y` — Aceptación automática de la instalación (omite las preguntas de confirmación).
- `--verbose` — Muestra el progreso detallado de la instalación.

### Comprobar Actualizaciones (Check)

Verifica si los skills instalados tienen actualizaciones disponibles:

```bash
# Comprobar todos los skills instalados
npx skills check

# Comprobar un skill específico
npx skills check <nombre-del-skill>
```

**Salida:** Lista de skills con actualizaciones disponibles.

### Actualizar Skills (Update)

Actualiza los skills instalados a sus versiones más recientes:

```bash
# Actualizar todos los skills
npx skills update

# Actualizar un skill específico
npx skills update <nombre-del-skill>

# Aceptar actualizaciones automáticamente
npx skills update -y
```

### Listar Skills Instalados (List)

Visualiza todos los skills instalados actualmente:

```bash
# Listar skills locales del proyecto
npx skills list

# Listar skills globales
npx skills list -g
```

### Eliminar Skills (Remove)

Desinstala los skills que ya no necesites:

```bash
# Eliminar un skill local del proyecto
npx skills remove <nombre-del-skill>

# Eliminar un skill global
npx skills remove <nombre-del-skill> -g
```

## OpenSkills: Instalación Multiplataforma Universal

**OpenSkills** es una herramienta CLI universal que lleva los skills a cualquier agente de codificación de IA, no solo a Claude Code.

### ¿Por qué OpenSkills?

- **Soporte multi-agente:** Funciona con Claude Code, Cursor, Windsurf, Aider, Codex.
- **Formato idéntico:** Utiliza el mismo formato SKILL.md que Claude Code.
- **Instalación flexible:** Modos local de proyecto, global o universal.
- **Múltiples fuentes:** GitHub, rutas locales, repositorios privados.

### Instalando OpenSkills

```bash
# Instalar globalmente
npm i -g openskills

# O úsalo directamente con npx
npx openskills
```

**Requisitos:**
- Node.js 20.6 o superior.
- Git (para operaciones con repositorios).

### Comandos de OpenSkills

#### Instalar Skills

```bash
# Desde el mercado de Anthropic
npx openskills install anthropics/skills

# Desde un repositorio de GitHub
npx openskills install usuario/repo

# Desde una ruta local
npx openskills install ./ruta/al/skill

# Instalación global
npx openskills install anthropics/skills --global

# Instalación universal multi-agente
npx openskills install anthropics/skills --universal

# Aceptación automática
npx openskills install anthropics/skills -y
```

#### Sincronizar Skills (Sync)

Actualiza `AGENTS.md` con los metadatos de los skills (requerido después de la instalación):

```bash
# Sincronización local del proyecto
npx openskills sync

# Sincronización global
npx openskills sync --global

# Sincronización universal
npx openskills sync --universal
```

**Importante:** Siempre ejecuta `sync` después de instalar o eliminar skills. Esto genera/actualiza el archivo `AGENTS.md` que los agentes leen para el descubrimiento de skills.

#### Leer Skills (Read)

Carga el contenido del skill para los agentes:

```bash
npx openskills read <nombre-del-skill>
```

#### Listar Skills (List)

Muestra todos los skills instalados:

```bash
npx openskills list
```

#### Actualizar Skills (Update)

Refresca los skills provenientes de git:

```bash
# Actualizar todos los skills
npx openskills update

# Aceptación automática
npx openskills update -y
```

#### Eliminar Skills (Remove)

Elimina skills específicos:

```bash
npx openskills remove <nombre-del-skill>

# Recuerda sincronizar después de la eliminación
npx openskills sync
```

### Etiquetas de OpenSkills

| Etiqueta | Descripción |
|:---------|:------------|
| `--global` | Instalar skills en todo el sistema en lugar de local al proyecto. |
| `--universal` | Usar `.agent/skills/` en lugar de `.claude/skills/`. |
| `-y, --yes` | Omitir los mensajes de confirmación (aceptación automática). |
| `-o, --output` | Especificar una ruta de archivo de salida personalizada. |

## Paquete NPM de Skills

El paquete npm `skills` proporciona una forma optimizada de agregar skills:

```bash
# Instalar el paquete
npm i skills

# Agregar skills de forma interactiva
npx skills add
```

**Características:**
- Instalación agnóstica al framework.
- Selección interactiva de skills.
- Cobertura de dominios: front-end, back-end, DevOps, seguridad.
- Más de 10 años de mejores prácticas en React/Next.js.

## Mejores Prácticas de Instalación

### Cuándo usar Global vs. Local del Proyecto

**Instalar de forma global cuando:**
- El skill sea de aplicación universal (explicación de código, refactorización general).
- Quieras el mismo comportamiento en todos los proyectos.
- El skill contenga mejores prácticas generales de codificación.
- Ayude a reducir la duplicación en múltiples proyectos.

**Ejemplos de skills globales:**
- `explain-code` - Explicación de código con diagramas.
- `code-review` - Guías generales de revisión de código.
- `commit-conventions` - Estándares de mensajes de commit de git.

**Instalar de forma local en el proyecto cuando:**
- El skill sea específico para el stack tecnológico o el dominio del proyecto.
- La colaboración en equipo requiera flujos de trabajo compartidos.
- El skill contenga convenciones específicas del proyecto.
- Quieras el control de versiones de los skills junto con el código base.

**Ejemplos de skills locales del proyecto:**
- `deploy` - Flujo de trabajo de despliegue específico del proyecto.
- `api-conventions` - Patrones de diseño de la API del proyecto.
- `test-strategy` - Enfoques de prueba del proyecto.

### Flujo de Trabajo de Colaboración en Equipo

Para skills locales del proyecto en entornos de equipo:

```bash
# Desarrollador A: Crea e instala el skill
npx openskills install ./custom-skills/deploy-skill

# Hacer commit al repositorio
git add .claude/skills/ AGENTS.md
git commit -m "feat: Add deployment skill for staging/prod"
git push

# Desarrollador B: Trae los cambios
git pull
# El skill está disponible automáticamente (no es necesario reinstalar)
```

**Mejor práctica:** Siempre haz commit tanto de `.claude/skills/` como de `AGENTS.md` para asegurar que los miembros del equipo tengan acceso inmediato.

### Consistencia Multi-Agente

Para equipos que utilicen diferentes agentes de IA:

```bash
# Instalar con la etiqueta universal
npx openskills install anthropics/skills --universal

# Sincronizar en .agent/skills/
npx openskills sync --universal

# Hacer commit
git add .agent/skills/ AGENTS.md
git commit -m "feat: Add universal skills for all agents"
```

### Consideraciones de Seguridad

**Antes de instalar cualquier skill:**

1. **Verifica la fuente:** Comprueba la reputación del repositorio y del mantenedor.
2. **Revisa los permisos:** Entiende qué acceso requiere el skill.
3. **Inspecciona el contenido:** Lee `SKILL.md` para ver qué instrucciones proporciona.
4. **Busca comandos:** Busca la sintaxis `` !`comando` `` o la ejecución de scripts.
5. **Prueba de forma aislada:** Prueba los skills nuevos en un proyecto de prueba primero.

**Advertencia de seguridad:** Los skills de los agentes de IA pueden propagar comandos npx alucinados. Verifica siempre:
- Skills de fuentes confiables (Anthropic, Vercel Labs, mantenedores establecidos).
- Que no haya comandos de sistema inesperados en SKILL.md.
- Que no haya archivos de script sospechosos en el directorio del skill.

**Referencia:** [Agent Skills Are Spreading Hallucinated npx Commands](https://www.aikido.dev/blog/agent-skills-spreading-hallucinated-npx-commands)

### Instalación por Lotes

Instala múltiples skills a la vez:

```bash
# Crear un archivo de configuración
cat > skills.json << EOF
{
  "skills": [
    "vercel-labs/skills@react-performance",
    "vercel-labs/skills@docker-best-practices",
    "vercel-labs/skills@playwright-e2e"
  ]
}
EOF

# Instalar desde la configuración
npx skills add --from-config skills.json
```

## Gestionando Skills

### Actualizar Skills

Mantén los skills actualizados para recibir correcciones de errores y mejoras:

```bash
# Comprobar qué necesita actualizarse
npx skills check

# Revisar las actualizaciones disponibles
# La salida muestra: nombre-del-skill (versión-actual -> nueva-versión)

# Actualizar todos los skills
npx skills update

# O actualizar selectivamente
npx skills update <nombre-del-skill>
```

**Mejor práctica:** Ejecuta `npx skills check` semanalmente para mantenerte al día.

**Para OpenSkills:**
```bash
# Actualizar skills provenientes de git
npx openskills update -y

# Luego vuelve a sincronizar
npx openskills sync
```

### Eliminar Skills

Limpia los skills que ya no uses:

```bash
# Usando la CLI de Skills
npx skills remove <nombre-del-skill>

# Eliminar un skill global
npx skills remove <nombre-del-skill> -g

# Usando OpenSkills
npx openskills remove <nombre-del-skill>

# No olvides sincronizar
npx openskills sync
```

**Para skills locales del proyecto:**
```bash
# Eliminar del sistema de archivos
rm -rf .claude/skills/<nombre-del-skill>

# Si usas OpenSkills, vuelve a sincronizar para actualizar AGENTS.md
npx openskills sync

# Hacer commit de los cambios
git add .claude/skills/ AGENTS.md
git commit -m "chore: Remove unused skill"
```

### Control de Versiones

**Haz siempre commit para instalaciones locales del proyecto:**

```bash
# Después de instalar skills
git add .claude/skills/
git add AGENTS.md
git commit -m "feat: Add React performance optimization skill"
```

**No hagas nunca commit para instalaciones globales:**
- Los skills globales viven en `~/.claude/skills/` (fuera del proyecto).
- No es necesario el control de versiones.
- Documenta los skills globales requeridos en el README del proyecto.

## Pasos de Verificación

### Verificar la Instalación

**Comprueba que los archivos del skill existan:**
```bash
# Local del proyecto
ls -la .claude/skills/<nombre-del-skill>/

# Global
ls -la ~/.claude/skills/<nombre-del-skill>/

# Universal
ls -la .agent/skills/<nombre-del-skill>/
```

**Comprueba el contenido de SKILL.md:**
```bash
cat .claude/skills/<nombre-del-skill>/SKILL.md
```

### Verificar AGENTS.md

Para instalaciones de OpenSkills, verifica que se haya generado `AGENTS.md`:

```bash
cat AGENTS.md
```

**Formato esperado:**
```xml
<available_skills>
  <skill>
    <name>nombre-del-skill</name>
    <description>Descripción del skill...</description>
    <location>project</location>
  </skill>
</available_skills>
```

### Verificar la Disponibilidad del Skill

**Pregunta a tu agente de IA:**
```
¿Qué skills hay disponibles?
```

El agente debería listar todos los skills instalados con sus descripciones.

**Comprobar un skill específico:**
```
¿Tienes el skill <nombre-del-skill>?
```

### Verificar la Invocación del Skill

**Probar la invocación manual:**
```
/nombre-del-skill
```

**Probar la invocación automática:**
Haz una pregunta que coincida con la descripción del skill para ver si se activa automáticamente.

## Instalación Específica por Plataforma

### Nativo de Claude Code

Claude Code tiene soporte integrado para skills:

```bash
# La instalación ocurre a través de la CLI de Skills
npx skills add <paquete>

# Los skills se descubren automáticamente desde:
# - ~/.claude/skills/ (personal/global)
# - .claude/skills/ (local del proyecto)
# - Skills empresariales (si están configurados)
```

**No se requiere AGENTS.md** - Claude Code descubre nativamente los archivos SKILL.md.

### Cursor, Windsurf, Aider (vía OpenSkills)

Estos agentes requieren OpenSkills para el soporte de skills:

```bash
# Instalar OpenSkills globalmente
npm i -g openskills

# Instalar skills
npx openskills install anthropics/skills

# Generar AGENTS.md (requerido)
npx openskills sync
```

**Se requiere AGENTS.md** - Estos agentes descubren los skills a través del archivo AGENTS.md.

### Configuración de Proyecto Multi-Agente

Para proyectos con miembros del equipo que utilicen diferentes agentes:

```bash
# Usar la instalación universal
npx openskills install anthropics/skills --universal

# Sincronizar para generar AGENTS.md
npx openskills sync --universal

# Hacer commit de ambos
git add .agent/skills/ AGENTS.md
git commit -m "feat: Add universal skills for multi-agent support"
```

**Resultado:**
- Usuarios de Claude Code: Funciona nativamente.
- Usuarios de Cursor/Windsurf/Aider: Funciona vía AGENTS.md.
- Una sola fuente de verdad para todos los agentes.

## Solución de Problemas de Instalación

### El Skill No Aparece

**Síntomas:** El skill instalado no aparece en la lista de skills disponibles.

**Soluciones:**

```bash
# 1. Verificar la instalación
npx openskills list  # o npx skills list

# 2. Comprobar que el archivo exista
ls -la .claude/skills/<nombre-del-skill>/SKILL.md

# 3. Para OpenSkills: Volver a sincronizar AGENTS.md
npx openskills sync

# 4. Verificar que AGENTS.md se haya generado
cat AGENTS.md

# 5. Reiniciar el agente/IDE
# Los skills pueden requerir una recarga
```

### La Instalación Falla

**Síntomas:** Error durante la instalación.

**Soluciones:**

```bash
# 1. Comprobar la versión de la CLI
npx skills --version

# 2. Limpiar la caché de npm
npm cache clean --force

# 3. Probar con la etiqueta verbose
npx skills add <paquete> --verbose

# 4. Comprobar la versión de Node.js (necesita 20.6+)
node --version

# 5. Comprobar que Git esté instalado (para skills basados en repositorios)
git --version

# 6. Probar una fuente alternativa
# En lugar de: npx skills add dueño/repo@skill
# Prueba: npx openskills install dueño/repo
```

### El Skill no se Carga

**Síntomas:** El skill existe pero el agente no lo utiliza.

**Soluciones:**

```bash
# 1. Comprobar que la descripción del skill coincida con el caso de uso
cat .claude/skills/<nombre-del-skill>/SKILL.md

# 2. Probar la invocación manual
# En el agente: /nombre-del-skill

# 3. Comprobar el presupuesto del contexto (Claude Code)
# En el agente: /context
# Buscar advertencias sobre skills excluidos

# 4. Aumentar el presupuesto del skill si es necesario
export SLASH_COMMAND_TOOL_CHAR_BUDGET=30000

# 5. Verificar los ajustes del frontmatter
# disable-model-invocation: true previene la carga automática
# user-invocable: false lo oculta del menú
```

### Problemas de Actualización

**Síntomas:** La actualización del skill falla o muestra una versión inesperada.

**Soluciones:**

```bash
# Forzar la actualización de skills provenientes de git
npx openskills update -y

# O reinstalar completamente
npx openskills remove <nombre-del-skill>
npx openskills install <fuente>
npx openskills sync

# Para la CLI de Skills
npx skills remove <nombre-del-skill>
npx skills add <paquete>
```

### Errores de Permisos

**Síntomas:** No se puede escribir en el directorio de instalación.

**Soluciones:**

```bash
# Comprobar los permisos del directorio
ls -la ~/.claude/

# Crear el directorio si falta
mkdir -p ~/.claude/skills

# Arreglar los permisos
chmod 755 ~/.claude/skills

# Para la instalación local del proyecto
mkdir -p .claude/skills
```

### AGENTS.md No Generado

**Síntomas:** OpenSkills instalado pero no hay AGENTS.md.

**Soluciones:**

```bash
# Ejecutar la sincronización explícitamente
npx openskills sync

# Comprobar si hay errores
npx openskills sync --verbose

# Verificar que el directorio de skills exista
ls -la .claude/skills/

# Sincronización manual para una ubicación específica
npx openskills sync --global     # para ~/.claude/skills
npx openskills sync --universal  # para .agent/skills
```

## Documentación Relacionada
