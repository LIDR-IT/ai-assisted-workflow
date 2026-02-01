# Agent + Skills + Computer Architecture

Este directorio contiene documentación de referencia sobre el ecosistema de Skills para agentes de IA, basado en la arquitectura de **Agent + Skills + Computer**.

## Arquitectura General

![Agent Skills Computer Architecture](agent-skills-computer.png)

La arquitectura se compone de tres elementos principales que trabajan juntos:

### 1. Agent Configuration (Configuración del Agente)

El agente se configura con tres componentes clave:

**Core System Prompt**
- Instrucciones fundamentales que definen el comportamiento del agente
- Personalidad, objetivos y reglas de operación

**Equipped Skills (Habilidades Equipadas)**
- Paquetes modulares de conocimiento procedimental
- Ejemplos: `bigquery`, `docx`, `nda-review`, `pdf`, `pptx`, `xlsx`
- Cada skill enseña al agente cómo ejecutar tareas específicas

**Equipped MCP Servers (Servidores MCP Equipados)**
- Model Context Protocol servers que extienden las capacidades del agente
- Pueden ser locales o remotos (en internet)
- Proporcionan acceso a sistemas externos, APIs y herramientas

### 2. Agent Virtual Machine (Máquina Virtual del Agente)

El agente opera dentro de un entorno computacional que incluye:

**Entornos de Ejecución**
- **Bash**: Shell scripting y comandos del sistema
- **Python**: Scripts y herramientas Python
- **Node.js**: Aplicaciones y scripts JavaScript/TypeScript

**File System (Sistema de Archivos)**
- Los directorios de skills viven en el sistema de archivos del agente
- Estructura organizada: `skills/skill-name/`
- Cada skill contiene:
  - `SKILL.md`: Archivo principal con instrucciones
  - Recursos adicionales: especificaciones, reglas, scripts
  - Ejemplos de estructura:
    ```
    skills/bigquery/
    ├── SKILL.md
    ├── datasources.md
    └── rules.md

    skills/docx/
    ├── SKILL.md
    ├── ooxml/
    ├── spec.md
    └── editing.md

    skills/pdf/
    ├── SKILL.md
    ├── forms.md
    ├── reference.md
    └── extract_fields.py
    ```

### 3. Use Computer (Uso de Herramientas Computacionales)

El agente puede:
- Ejecutar comandos bash
- Correr scripts Python/Node.js
- Leer archivos del sistema
- Acceder a skills mediante su sistema de archivos
- Conectarse a MCP servers remotos

## Flujo de Trabajo

1. **Configuración**: El agente se configura con skills y MCP servers específicos
2. **Carga**: Los contenidos de los directorios de skills se almacenan en el sistema de archivos del agente
3. **Ejecución**: El agente usa sus herramientas computacionales (Bash, Python, Node.js) para ejecutar tareas
4. **Skills**: Consulta archivos SKILL.md y recursos cuando necesita ejecutar procedimientos específicos
5. **MCP**: Se conecta a servidores MCP para acceder a sistemas externos

## Beneficios de esta Arquitectura

### Modularidad
- Skills son paquetes independientes y reutilizables
- Fácil agregar, actualizar o remover skills

### Escalabilidad
- MCP servers pueden estar en cualquier parte (local o remoto)
- El agente puede escalar horizontalmente con más skills

### Portabilidad
- Skills son archivos estándar que funcionan en cualquier agente compatible
- Compartibles entre equipos y proyectos

### Eficiencia
- Skills no saturan la memoria de trabajo del agente
- Se cargan bajo demanda desde el sistema de archivos

### Extensibilidad
- MCP servers permiten integración con sistemas externos sin modificar el agente
- Skills pueden incluir código ejecutable (Python, scripts)

## Contenido de este Directorio

Este directorio contiene documentación de referencia sobre:

- **antigravity-skills.md**: Sistema de skills en Antigravity con 5 patrones progresivos ✨
- **npm-skills-package.md**: Ecosistema npm de skills
- **openskills.md**: Loader universal de skills para múltiples agentes
- **find-skills-vercel.md**: Herramienta de descubrimiento de skills
- **skill-creator.md**: Guía oficial de Anthropic para crear skills
- **skills-claude-code.md**: Skills específicas de Claude Code
- **skill-development-claude-code.md**: Desarrollo de skills para Claude Code
- **skills-ecosystem-overview.md**: Vista general del ecosistema

## Referencias

- [agents.md](https://agents.md) - Estándar AGENTS.md
- [skills.sh](https://skills.sh) - Marketplace de skills
- [Model Context Protocol](https://modelcontextprotocol.io) - Protocolo MCP

---

**Nota:** Esta arquitectura representa el modelo estándar de cómo los agentes de IA modernos integran skills y herramientas computacionales para ejecutar tareas complejas de forma autónoma.
