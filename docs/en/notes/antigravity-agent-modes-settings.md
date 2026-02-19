# Antigravity Agent Modes & Settings

## Overview

Esta nota documenta los modos de agente y configuraciones disponibles en **Google Antigravity**, la plataforma de desarrollo agéntica de Google.

**Estado del Proyecto:**

- ✅ Antigravity instalado y configurado
- ✅ MCP configurado a nivel global (`~/.gemini/antigravity/mcp_config.json`)
- 📝 Skills sincronizadas con `.agents/skills/`

**Plataforma:** Google Antigravity
**Última Actualización:** Enero 2026
**Estado:** Public Preview (gratuito para individuos)

---

## Agent Modes (Modos de Ejecución)

Antigravity ofrece dos modos principales de ejecución que controlan cómo el agente aborda las tareas:

### Planning Mode (Modo de Planificación)

**Descripción:**

> "An Agent can plan before executing tasks. Use for deep research, complex tasks, or collaborative work."

**Comportamiento:**

- ✅ Planifica antes de actuar
- ✅ Organiza trabajo en grupos de tareas
- ✅ Produce **Artifacts** para revisión
- ✅ Documenta su razonamiento
- ✅ Permite feedback iterativo

**Cuándo usar:**

- ✅ Tareas complejas y multi-paso
- ✅ Investigación profunda
- ✅ Trabajo colaborativo
- ✅ Proyectos que requieren consideración cuidadosa
- ✅ Cuando la calidad > velocidad

**Ejemplo de uso:**

- Refactorizar arquitectura completa
- Implementar nueva feature con múltiples componentes
- Análisis de seguridad comprehensivo
- Diseño de sistema

### Fast Mode (Modo Rápido)

**Descripción:**

> "An Agent will execute tasks directly. Use for simple tasks that can be completed faster."

**Comportamiento:**

- ⚡ Ejecución directa sin planificación extensa
- ⚡ Mínima planificación
- ⚡ Resultados inmediatos
- ⚡ Sin artifacts preliminares

**Cuándo usar:**

- ✅ Tareas simples y directas
- ✅ Cambios localizados
- ✅ Renombrar variables
- ✅ Comandos bash básicos
- ✅ Cuando velocidad > deliberación

**Ejemplo de uso:**

- Renombrar variable
- Formatear código
- Ejecutar comando simple
- Cambio de una línea

---

## Configuration Presets (Perfiles de Configuración)

Antigravity combina **Terminal Execution** y **Review Policies** en cuatro perfiles predefinidos:

### 1. Agent-driven Development

**Características:**

- 🤖 **Autonomía máxima**
- 🤖 El agente **nunca** pide revisión
- 🤖 Auto-ejecuta todas las acciones
- 🤖 Velocidad máxima

**Cuándo usar:**

- ✅ Tareas repetitivas y bien definidas
- ✅ Prototipos rápidos
- ✅ Exploración inicial
- ⚠️ Solo cuando confías completamente en el agente

**Riesgos:**

- ❌ Cambios no revisados
- ❌ Potencial para errores no detectados
- ❌ Menor control

### 2. Review-driven Development

**Características:**

- 👤 **Control máximo del usuario**
- 👤 El agente **frecuentemente** pide revisión
- 👤 Aprobación manual necesaria
- 👤 Velocidad reducida, calidad aumentada

**Cuándo usar:**

- ✅ Código de producción
- ✅ Cambios críticos
- ✅ Proyectos nuevos
- ✅ Cuando aprendes a usar Antigravity

**Beneficios:**

- ✅ Control total
- ✅ Aprendizaje del proceso
- ✅ Prevención de errores
- ✅ Transparencia completa

### 3. Agent-assisted Development (Recomendado)

**Características:**

- ⚖️ **Balance equilibrado**
- ⚖️ Agente **decide** cuándo pedir revisión
- ⚖️ Autonomía con checkpoints
- ⚖️ Velocidad + Control

**Cuándo usar:**

- ✅ **Default recomendado** para la mayoría de casos
- ✅ Desarrollo general
- ✅ Features estándar
- ✅ Cuando confías en el agente pero quieres supervisión

**Beneficios:**

- ✅ Mejor de ambos mundos
- ✅ Agente trabaja de forma autónoma en pasos simples
- ✅ Regresa al usuario para decisiones importantes
- ✅ Productividad alta con seguridad

### 4. Custom Configuration

**Características:**

- 🎛️ **Control total granular**
- 🎛️ Usuario configura cada política individualmente
- 🎛️ Máxima flexibilidad
- 🎛️ Para usuarios avanzados

**Cuándo usar:**

- ✅ Necesidades específicas del equipo
- ✅ Políticas de seguridad estrictas
- ✅ Workflows especializados
- ✅ Experimentación con configuraciones

---

## Execution Policies (Políticas de Ejecución)

### Terminal Execution Policy

Controla cómo el agente ejecuta comandos de terminal:

#### Always Proceed (Turbo Mode)

**Comportamiento:**

- Auto-ejecuta **todos** los comandos
- Excepto los de la **Deny List**
- Velocidad máxima
- Riesgo aumentado

**Configuración:**

```
Terminal Auto Execution: Always Proceed
Deny List: rm, sudo, curl, wget, npm install
```

**Cuándo usar:**

- Comandos git (status, diff, log)
- Comandos de lectura (ls, cat, grep)
- Comandos de desarrollo (npm run, pytest)

#### Request Review

**Comportamiento:**

- Requiere aprobación manual para **cada** comando
- Usuario ve comando antes de ejecución
- Control máximo
- Velocidad reducida

**Cuándo usar:**

- Comandos destructivos (rm, mv)
- Comandos de sistema (sudo, apt)
- Comandos de red (curl, wget)
- Producción o entornos sensibles

#### Off (Allow List Only)

**Comportamiento:**

- **Solo** ejecuta comandos de la Allow List
- Todo lo demás requiere revisión
- Seguridad máxima
- Whitelist approach

**Configuración:**

```
Terminal Auto Execution: Off
Allow List:
  - git status
  - git diff
  - git log
  - npm test
  - pytest
```

**Cuándo usar:**

- Entornos de producción
- Proyectos críticos
- Compliance estricto
- Máxima seguridad

### Review Policies for Artifacts

Controla cuándo el agente pide revisión de planes, código y resultados:

#### Always Proceed

**Comportamiento:**

- Agente **nunca** pide revisión
- Implementa directamente
- Sin artifacts intermedios
- Velocidad máxima

**Resultado:**

- No hay oportunidad de feedback antes de implementación

#### Agent Decides (Recomendado)

**Comportamiento:**

- Agente **determina** cuándo es necesaria revisión
- Usa juicio basado en complejidad
- Pide revisión para cambios significativos
- Auto-procede en cambios simples

**Resultado:**

- Balance automático entre velocidad y control

#### Request Review

**Comportamiento:**

- Agente **siempre** pide aprobación
- Genera artifacts para cada cambio
- Usuario aprueba cada paso
- Control total

**Resultado:**

- Feedback en cada etapa
- Iteración frecuente

### JavaScript Execution Policy (Browser Subagent)

Controla cómo el browser subagent ejecuta JavaScript:

#### Always Proceed

**Comportamiento:**

- Máxima autonomía del browser
- Auto-ejecuta JavaScript
- **Mayor exposición de seguridad**

**Riesgos:**

- Potencial ejecución de código malicioso
- Prompt injection desde sitios comprometidos

#### Request Review

**Comportamiento:**

- Requiere permiso para cada ejecución JavaScript
- Usuario ve código antes de ejecución
- Control fino

#### Disabled

**Comportamiento:**

- Browser JavaScript **nunca** se ejecuta
- Máxima seguridad
- Funcionalidad limitada del browser subagent

---

## Security Controls (Controles de Seguridad)

### Secure Mode

**Descripción:**

- Restricciones mejoradas de seguridad
- Limita acceso a recursos externos
- Bloquea operaciones sensibles
- Perfil de seguridad máxima

**Configuración incluye:**

- Terminal Execution: Off (Allow List only)
- Review Policies: Request Review
- JavaScript Execution: Disabled
- Browser URL Allowlist activado

### Allow List Configuration (Whitelist)

**Approach:** Seguridad positiva - solo lo permitido se ejecuta

**Configuración:**

```
Terminal Auto Execution: Off

~/.gemini/antigravity/allowList.txt:
git status
git diff
git log
npm test
pytest
ls
cat
```

**Beneficios:**

- ✅ Seguridad máxima
- ✅ Control explícito
- ✅ Compliance-friendly
- ✅ Auditoría clara

**Desventajas:**

- ❌ Requiere mantenimiento
- ❌ Puede bloquear comandos legítimos
- ❌ Menor flexibilidad

### Deny List Configuration (Blacklist)

**Approach:** Seguridad negativa - todo permitido excepto lo bloqueado

**Configuración:**

```
Terminal Auto Execution: Always Proceed (Turbo)

~/.gemini/antigravity/denyList.txt:
rm
sudo
curl
wget
npm install
pip install
apt-get
```

**Beneficios:**

- ✅ Mayor flexibilidad
- ✅ Menor mantenimiento
- ✅ Velocidad de desarrollo

**Desventajas:**

- ❌ Posible ejecución de comandos no previstos
- ❌ Requiere conocer amenazas de antemano
- ❌ Menor seguridad

### Browser URL Allowlist

**Ubicación:** `~/.gemini/antigravity/browserAllowlist.txt`

**Propósito:**

- Restringe dominios que el agente puede visitar
- Previene prompt injection desde sitios comprometidos
- Protege contra ataques web

**Ejemplo:**

```
# browserAllowlist.txt
github.com
stackoverflow.com
developer.mozilla.org
npmjs.com
pypi.org
```

**Beneficios:**

- ✅ Previene prompt injection attacks
- ✅ Control de información externa
- ✅ Compliance con políticas corporativas

---

## Artifacts (Artefactos)

El agente genera evidencia de su trabajo para facilitar revisión y colaboración:

### Tipos de Artifacts

#### 1. Pre-Coding Artifacts

**Task Lists:**

- Lista de tareas a completar
- Organización del trabajo
- Prioridades y dependencias

**Implementation Plans:**

- Estrategia de implementación
- Decisiones arquitectónicas
- Trade-offs y justificaciones

#### 2. Coding Artifacts

**Code Diffs:**

- Cambios propuestos vs código actual
- Estilo Google Docs con comentarios
- Review interactivo
- Capacidad de comentar líneas específicas

**Features:**

- ✅ Comentar líneas específicas
- ✅ Sugerir cambios alternativos
- ✅ Aprobar o rechazar secciones
- ✅ Iteración en base a feedback

#### 3. Post-Coding Artifacts

**Walkthroughs:**

- Screenshots de la aplicación
- Grabaciones de browser
- Demostraciones visuales
- Evidencia de funcionalidad

**Architecture Diagrams:**

- Visualización de sistemas
- Flujos de datos
- Dependencias

**Images:**

- Resultados visuales
- UI/UX generado
- Gráficos y charts

### Workflow con Artifacts

```
1. Usuario hace request
   ↓
2. Agente genera Implementation Plan (artifact)
   ↓
3. Usuario revisa y comenta plan
   ↓
4. Agente itera en base a feedback
   ↓
5. Agente genera Code Diff (artifact)
   ↓
6. Usuario comenta código específico
   ↓
7. Agente ajusta basado en comentarios
   ↓
8. Agente implementa cambios
   ↓
9. Agente genera Walkthrough (artifact)
   ↓
10. Usuario verifica funcionalidad
```

---

## Rules vs Workflows

### Rules (Reglas)

**Descripción:**

- Guías a nivel de sistema
- Aplicación continua
- Contexto siempre presente

**Scope:**

- **Global:** `~/.gemini/antigravity/rules/`
- **Workspace:** `.agents/rules/`

**Uso:**

- Estilo de código (indentación, naming)
- Estándares de documentación
- Principios de modularidad
- Convenciones del equipo

**Ejemplo:**

```markdown
# .agents/rules/code-style.md

## TypeScript Style Guide

- Use 2-space indentation
- Prefer const over let
- Always use explicit return types
- Use PascalCase for components
- Use camelCase for functions
```

**Características:**

- ✅ Siempre activas
- ✅ Guían todo el trabajo del agente
- ✅ Compartibles en equipo (via git)
- ✅ Configurables por proyecto

### Workflows (Flujos de Trabajo)

**Descripción:**

- Prompts guardados
- Activación bajo demanda
- Ejecutados con comando `/`

**Scope:**

- **Global:** `~/.gemini/antigravity/workflows/`
- **Workspace:** `.agents/workflows/`

**Uso:**

- Generación de tests unitarios
- Code review checklist
- Feature setup
- Deploy procedures

**Ejemplo:**

```markdown
# .agents/workflows/review-security.md

Review this code for security vulnerabilities:

1. SQL injection risks
2. XSS attack vectors
3. Authentication bypass
4. Sensitive data exposure

Provide specific line numbers and fixes.
```

**Invocación:**

```
/review-security
```

**Características:**

- ✅ Activación manual
- ✅ Reusables
- ✅ Parametrizables
- ✅ Compartibles en equipo

### Rules vs Workflows: Comparación

| Característica | Rules                    | Workflows             |
| :------------- | :----------------------- | :-------------------- |
| **Activación** | Automática (siempre)     | Manual (comando `/`)  |
| **Scope**      | Global (todo el trabajo) | Específico (tarea)    |
| **Propósito**  | Guías continuas          | Tareas on-demand      |
| **Ubicación**  | `.agents/rules/`         | `.agents/workflows/`  |
| **Ejemplo**    | "Usar 2 spaces"          | "Generar tests"       |
| **Frecuencia** | Siempre aplicada         | Solo cuando se invoca |

---

## Skills System

### Descripción

Skills son paquetes especializados que:

- Se cargan solo cuando se necesitan (**progressive disclosure**)
- Proveen conocimiento especializado
- Extienden capacidades del agente

### Scope

**Global:**

```
~/.gemini/antigravity/skills/
```

**Workspace:**

```
<root>/.agents/skills/
```

**En este proyecto:**

```
.agents/skills/          # Source of truth (native .agents/ detection)
```

### Tipos de Skills

#### 1. Instruction-only Skills

**Contenido:**

- Solo `SKILL.md` con metadata y guidelines
- Sin archivos adicionales
- Conocimiento puro

**Ejemplo:**

```
testing-best-practices/
└── SKILL.md
```

**Uso:**

- Guías de estilo
- Best practices
- Metodologías

#### 2. Template-based Skills

**Contenido:**

- `SKILL.md` con metadata
- `resources/` con templates
- Bloques de contenido reutilizables

**Ejemplo:**

```
component-generator/
├── SKILL.md
└── resources/
    ├── component.tsx
    ├── component.test.tsx
    └── styles.module.css
```

**Uso:**

- Generación de código boilerplate
- Estructuras estándar
- Templates de proyecto

#### 3. Script-based Skills

**Contenido:**

- `SKILL.md` con metadata
- `scripts/` con ejecutables Python/Bash
- Automatización compleja

**Ejemplo:**

```
deployment-automation/
├── SKILL.md
└── scripts/
    ├── build.sh
    ├── test.py
    └── deploy.sh
```

**Uso:**

- CI/CD automation
- Build processes
- Testing pipelines
- Deployment procedures

### Progressive Disclosure

**Concepto:**

- Skills solo se cargan cuando request coincide con su descripción
- Evita cluttering del contexto
- Performance mejorado
- Especialización bajo demanda

**Ejemplo:**

```
User: "Generate unit tests for this component"
       ↓
Antigravity: Carga skill "testing-skill"
             (solo cuando se necesita testing)
```

---

## Best Practices

### Selección de Modo

✅ **DO:**

- Usar **Planning Mode** para tareas complejas
- Usar **Fast Mode** para cambios simples
- Empezar con **Agent-assisted** (preset recomendado)
- Evaluar resultados y ajustar modo según sea necesario

❌ **DON'T:**

- Usar Fast Mode para refactoring complejo
- Usar Planning Mode para renombrar variables
- Saltar directamente a Agent-driven sin experiencia

### Configuración de Seguridad

✅ **DO:**

- Empezar con **Review-driven** o **Secure Mode**
- Implementar **Deny List** con comandos peligrosos
- Usar **Browser URL Allowlist** en producción
- Revisar y actualizar listas regularmente

❌ **DON'T:**

- Usar Agent-driven sin entender riesgos
- Permitir `rm -rf` en Turbo mode
- Deshabilitar todas las revisiones en código de producción

### Uso de Artifacts

✅ **DO:**

- Revisar Implementation Plans antes de aprobar
- Comentar específicamente en Code Diffs
- Solicitar Walkthroughs para features visuales
- Iterar basado en feedback

❌ **DON'T:**

- Aprobar sin revisar
- Dar feedback vago
- Saltar artifacts en cambios complejos

### Rules y Workflows

✅ **DO:**

- Crear Rules para estándares del equipo
- Compartir Rules vía git (`.agents/rules/`)
- Usar Workflows para tareas repetitivas
- Documentar claramente cada Rule/Workflow

❌ **DON'T:**

- Duplicar Rules en Workflows
- Crear Rules demasiado restrictivas
- Ignorar Rules existentes

### Skills

✅ **DO:**

- Instalar Skills relevantes para tu stack
- Usar `.agents/skills/` como source of truth
- Sincronizar con enlaces simbólicos
- Mantener Skills actualizadas

❌ **DON'T:**

- Instalar todas las Skills "por si acaso"
- Duplicar Skills entre directorios
- Ignorar Skills del equipo

---

## Ubicaciones de Archivos

### Configuración Global

```
~/.gemini/antigravity/
├── mcp_config.json           # MCP servers (global)
├── allowList.txt             # Terminal allow list
├── denyList.txt              # Terminal deny list
├── browserAllowlist.txt      # Browser URL allowlist
├── rules/                    # Global rules
├── workflows/                # Global workflows
└── skills/                   # Global skills
```

### Configuración de Workspace

```
<project-root>/
└── .agents/
    ├── rules/               # Project rules (native .agents/ detection)
    ├── workflows/           # Project workflows (native .agents/ detection)
    ├── skills/              # Project skills (native .agents/ detection)
    └── mcp/                 # Source of truth (MCP)
```

**Nota:** Antigravity **NO** soporta MCP a nivel de proyecto, solo global.

---

## Estado del Proyecto

### Configuración Actual

**Antigravity:**

- ✅ Instalado y funcionando
- ✅ MCP configurado globalmente
- ✅ Skills sincronizadas (approach mixto)

**MCP:**

- ✅ Context7 configurado en `~/.gemini/antigravity/mcp_config.json`
- ⚠️ Solo a nivel global (limitación de plataforma)
- ✅ Documentado en `docs/references/mcp/mcp-antigravity.md`

**Skills:**

- ✅ 7 skills en `.agents/skills/`
- ✅ Antigravity lee nativamente desde `.agents/skills/` (detección nativa)
- ✅ Funcionando correctamente

### Configuración Recomendada

**Modo de Agente:**

- ✅ **Agent-assisted Development** (default recomendado)
- ✅ Planning Mode para tareas complejas
- ✅ Fast Mode para cambios simples

**Seguridad:**

- ✅ Terminal Execution: Request Review o Deny List
- ✅ Review Policies: Agent Decides
- ✅ JavaScript Execution: Request Review
- ✅ Browser URL Allowlist configurado

**Listas de Control:**

```bash
# Deny List recomendada
~/.gemini/antigravity/denyList.txt:
rm -rf
sudo
apt-get
brew install
npm install -g
pip install
curl -sL
wget
```

---

## Comparación con Otras Plataformas

### Antigravity vs Cursor vs Claude Code

| Característica       | Antigravity                             | Cursor                         | Claude Code                    |
| :------------------- | :-------------------------------------- | :----------------------------- | :----------------------------- |
| **Agent Modes**      | Planning/Fast                           | N/A                            | N/A                            |
| **Review Policies**  | 3 niveles (Always/Agent/Request)        | Built-in                       | Via hooks                      |
| **Terminal Control** | 3 modos + Lists                         | Basic                          | Via hooks                      |
| **Artifacts**        | ✅ Nativos (Plans, Diffs, Walkthroughs) | Limited                        | Limited                        |
| **Rules**            | ✅ `.agents/rules/`                     | N/A                            | N/A                            |
| **Workflows**        | ✅ `.agents/workflows/`                 | Commands (`.cursor/commands/`) | Commands (`.claude/commands/`) |
| **Skills**           | ✅ `.agents/skills/`                    | Skills (`.cursor/skills/`)     | Skills (`.claude/skills/`)     |
| **MCP Support**      | ⚠️ Solo global                          | ✅ Project-level               | ✅ Project-level               |
| **Subagents**        | ✅ Built-in (Browser, Terminal)         | ✅ Custom                      | ✅ Custom                      |
| **Security**         | ✅ Allow/Deny Lists nativos             | Basic                          | Via hooks                      |

### Antigravity Strengths

✅ **Planning Mode** - Único en Antigravity
✅ **Artifacts nativos** - Plans, Diffs, Walkthroughs
✅ **Review Policies granulares** - 3 niveles de control
✅ **Rules system** - Guías continuas del agente
✅ **Security Controls** - Allow/Deny Lists nativos

### Antigravity Limitations

❌ **MCP solo global** - No project-level support
❌ **Less mature ecosystem** - Menos skills disponibles
❌ **Google-specific** - Menos portable que Skills estándar

---

## Troubleshooting

### Agente No Respeta Rules

**Síntomas:**

- Agente ignora estándares definidos
- Código no sigue convenciones

**Solución:**

```bash
# Verificar ubicación de rules
ls .agents/rules/

# Verificar contenido
cat .agents/rules/code-style.md

# Reiniciar Antigravity
# CMD+Q (Mac) / Alt+F4 (Windows)
```

### Comandos Bloqueados Incorrectamente

**Síntomas:**

- Comandos legítimos requieren revisión
- Workflow interrumpido frecuentemente

**Solución:**

```bash
# Revisar Allow List
cat ~/.gemini/antigravity/allowList.txt

# Agregar comandos necesarios
echo "npm test" >> ~/.gemini/antigravity/allowList.txt

# O cambiar a Deny List approach
# Settings → Terminal Execution → Always Proceed
# Agregar solo comandos peligrosos a denyList.txt
```

### Artifacts No Se Generan

**Síntomas:**

- No hay Implementation Plans
- Code Diffs no aparecen

**Solución:**

- Verificar Review Policy: debe ser "Request Review" o "Agent Decides"
- Cambiar a Planning Mode para tareas complejas
- Settings → Review Policies → Agent Decides

### MCP No Funciona

**Síntomas:**

- Context7 no responde
- MCP tools no disponibles

**Solución:**

```bash
# Verificar configuración global
cat ~/.gemini/antigravity/mcp_config.json

# Verificar API key
echo $CONTEXT7_API_KEY

# Reiniciar Antigravity
```

---

## Recursos

### Documentación Oficial

- [Agent Modes / Settings](https://antigravity.google/docs/agent-modes-settings)
- [Getting Started with Google Antigravity](https://codelabs.developers.google.com/getting-started-google-antigravity)
- [Google Antigravity Docs](https://antigravity.google/docs/agent)
- [Build with Google Antigravity](https://developers.googleblog.com/build-with-google-antigravity-our-new-agentic-development-platform/)

### Tutoriales

- [How to Set Up and Use Google Antigravity - Codecademy](https://www.codecademy.com/article/how-to-set-up-and-use-google-antigravity)
- [Tutorial: Getting Started with Google Antigravity - Medium](https://medium.com/google-cloud/tutorial-getting-started-with-google-antigravity-b5cc74c103c2)
- [Google Antigravity: The Agentic IDE Changing Development Work](https://www.index.dev/blog/google-antigravity-agentic-ide)

### En Este Repositorio

- `docs/references/mcp/mcp-antigravity.md` - MCP en Antigravity
- `docs/notes/agents-vs-skills.md` - Conceptos fundamentales
- `docs/notes/skills-installation-and-mcp-comparison.md` - Skills vs MCP
- `.agents/mcp/README.md` - Sistema de sincronización MCP
- `.agents/skills/` - Skills instaladas

### Artículos y Blog Posts

- [Google Antigravity is an 'agent-first' coding tool - Altamira](https://www.altamira.ai/blog/antigravity-is-agent-first-coding-tool/)
- [Google Antigravity: agent‑first IDE & how to use it - Gend](https://www.gend.co/blog/google-antigravity)
- [My Experience with Google Antigravity - DEV Community](https://dev.to/this-is-learning/my-experience-with-google-antigravity-how-i-refactored-easy-kit-utils-with-ai-agents-2e54)

---

## Próximos Pasos

### Para Este Proyecto

1. **Revisar configuración actual:**
   - Evaluar si Agent-assisted es el modo apropiado
   - Configurar Deny List con comandos peligrosos
   - Implementar Browser URL Allowlist

2. **Crear Rules de equipo:**
   - `.agents/rules/code-style.md`
   - `.agents/rules/testing-standards.md`
   - `.agents/rules/documentation-requirements.md`

3. **Crear Workflows útiles:**
   - `.agents/workflows/review-security.md`
   - `.agents/workflows/generate-tests.md`
   - `.agents/workflows/create-pr.md`

4. **Optimizar Skills:**
   - Antigravity lee nativamente desde `.agents/skills/` (no requiere sincronización adicional)
   - Mantener `.agents/skills/` como fuente de verdad

### Recomendaciones Generales

**Empezar con:**

- ✅ Review-driven Development o Agent-assisted
- ✅ Planning Mode activado
- ✅ Terminal Execution: Request Review
- ✅ Review Policies: Agent Decides

**Gradualmente moverse a:**

- ✅ Agent-assisted Development
- ✅ Fast Mode para tareas simples
- ✅ Deny List approach (con lista comprehensiva)
- ✅ Custom configuration según necesidades

---

**Última actualización:** Enero 2026
**Estado:** Documentación completa basada en fuentes oficiales
**Plataforma:** Google Antigravity Public Preview

---

## Sources

- [Getting Started with Google Antigravity | Google Codelabs](https://codelabs.developers.google.com/getting-started-google-antigravity)
- [Agent Modes / Settings](https://antigravity.google/docs/agent-modes-settings)
- [Google Antigravity](https://antigravity.google/docs/agent)
- [How to Set Up and Use Google Antigravity | Codecademy](https://www.codecademy.com/article/how-to-set-up-and-use-google-antigravity)
- [Google Antigravity: The Agentic IDE Changing Development Work](https://www.index.dev/blog/google-antigravity-agentic-ide)
- [Google Antigravity is an 'agent-first' coding tool - Altamira](https://www.altamira.ai/blog/antigravity-is-agent-first-coding-tool/)
- [Google Antigravity: agent‑first IDE & how to use it](https://www.gend.co/blog/google-antigravity)
- [My Experience with Google Antigravity: How I Refactored Easy Kit Utils with AI Agents 🚀 - DEV Community](https://dev.to/this-is-learning/my-experience-with-google-antigravity-how-i-refactored-easy-kit-utils-with-ai-agents-2e54)
- [Build with Google Antigravity, our new agentic development platform - Google Developers Blog](https://developers.googleblog.com/build-with-google-antigravity-our-new-agentic-development-platform/)
