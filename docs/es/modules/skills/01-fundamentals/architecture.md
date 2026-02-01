# Arquitectura de Agente + Skills + Computadora

## Descripción General

La arquitectura **Agente + Skills + Computadora** representa el modelo estándar de cómo los agentes de IA modernos integran skills y herramientas computacionales para ejecutar tareas de forma autónoma.

![Concepto de Arquitectura](https://via.placeholder.com/800x400?text=Agente+%2B+Skills+%2B+Computadora)

## Tres Componentes Principales

### 1. Configuración del Agente

El agente se configura con tres componentes clave:

#### Prompt de Sistema Central (Core System Prompt)
- Instrucciones fundamentales que definen el comportamiento del agente.
- Personalidad, objetivos y reglas operativas.
- Capacidades base y restricciones.

#### Skills Equipados
- Paquetes modulares de conocimiento procedimental.
- Ejemplos: `react-best-practices`, `security-audit`, `deployment`.
- Cada skill enseña la ejecución de una tarea específica.

#### Servidores MCP Equipados
- Servidores del Model Context Protocol que extienden las capacidades.
- Pueden ser locales o remotos (basados en Internet).
- Proporcionan acceso a sistemas externos, APIs y herramientas.

### 2. Máquina Virtual del Agente

El agente opera dentro de un entorno computacional:

#### Entornos de Ejecución (Runtimes)
- **Bash:** Scripting de shell y comandos del sistema.
- **Python:** Scripts y herramientas de Python.
- **Node.js:** Aplicaciones JavaScript/TypeScript.

#### Sistema de Archivos
- Los skills viven en el sistema de archivos del agente.
- Estructura organizada: `skills/nombre-del-skill/`.
- Cada skill contiene:
  - `SKILL.md` - Archivo de instrucciones principal.
  - Recursos adicionales: especificaciones, reglas, scripts.

**Ejemplo de estructura:**
```
skills/
├── react-best-practices/
│   ├── SKILL.md
│   ├── patterns.md
│   └── examples.md
│
├── security-audit/
│   ├── SKILL.md
│   ├── checklist.md
│   └── scripts/
│       └── scan.py
│
└── deployment/
    ├── SKILL.md
    ├── references/
    │   └── aws-setup.md
    └── scripts/
        ├── build.sh
        └── deploy.sh
```

### 3. Uso de la Computadora (Computer Use)

El agente puede:
- Ejecutar comandos bash.
- Ejecutar scripts de Python/Node.js.
- Leer archivos del sistema de archivos.
- Acceder a los skills a través del sistema de archivos.
- Conectarse a servidores MCP de forma remota.

## Flujo de Trabajo

### 1. Fase de Configuración

**Configuración:**
- Agente configurado con skills específicos.
- Servidores MCP conectados.
- Prompt de sistema cargado.

**Ejemplo:**
```yaml
Configuración del Agente:
  Skills:
    - react-best-practices
    - security-audit
    - deployment
  Servidores MCP:
    - database (PostgreSQL)
    - cloud-api (AWS)
  Prompt de Sistema:
    - "Eres un desarrollador full-stack senior"
```

### 2. Fase de Carga

**Almacenamiento de Skills:**
- Los directorios de skills se almacenan en el sistema de archivos.
- Los metadatos se indexan para su descubrimiento.
- El contenido completo está disponible bajo demanda.

**Divulgación Progresiva:**
- Nivel 1: Metadatos siempre cargados (~100 palabras).
- Nivel 2: SKILL.md cargado cuando se activa (<5,000 palabras).
- Nivel 3: Recursos cargados según sea necesario (tamaño variable).

### 3. Fase de Ejecución

**Solicitud del Usuario:**
```
Usuario: "Revisa este componente de React en busca de problemas de rendimiento"
```

**Proceso del Agente:**
1. Escanea los metadatos de los skills.
2. Coincide con el skill "react-best-practices".
3. Carga el contenido completo de SKILL.md.
4. Lee el archivo del componente.
5. Aplica patrones de revisión de rendimiento.
6. Informa de los hallazgos.

**Uso de Herramientas:**
- Bash: Ejecutar linters, analizadores.
- Python: Ejecutar scripts personalizados.
- Sistema de archivos: Leer recursos de skills.
- MCP: Consultar métricas de rendimiento.

### 4. Acceso a los Skills

**Patrón del Sistema de Archivos:**
```bash
# El agente lee el contenido del skill
cat ~/.claude/skills/react-best-practices/SKILL.md

# El agente ejecuta un script del skill
python ~/.claude/skills/security-audit/scripts/scan.py

# El agente referencia recursos del skill
cat ~/.claude/skills/deployment/references/aws-setup.md
```

**Carga Dinámica:**
- Los skills no saturan la memoria de trabajo.
- Se cargan del sistema de archivos bajo demanda.
- Múltiples skills pueden estar activos simultáneamente.

### 5. Integración con MCP

**Acceso a Sistemas Externos:**
```
Agente → Servidor MCP → Sistema Externo
   ↓
Cargar skill: "database-query"
   ↓
Usar el conocimiento del skill para construir la consulta
   ↓
Ejecutar a través del servidor de base de datos MCP
   ↓
Procesar resultados
```

## Beneficios de esta Arquitectura

### Modularidad

**Los skills son independientes:**
- Fáciles de agregar, actualizar o eliminar.
- Sin interferencias entre skills.
- Clara separación de preocupaciones.

**Ejemplo:**
```bash
# Agregar nuevo skill
npx skills add vercel-labs/skills --skill testing

# Eliminar skill
npx skills remove testing

# Actualizar skill
npx skills update testing
```

### Escalabilidad

**Escalado horizontal:**
- Los servidores MCP pueden estar en cualquier lugar (local o remoto).
- Agrega más skills sin impacto en el rendimiento.
- El agente puede acceder a recursos externos ilimitados.

**Ejemplo:**
```
Skills locales: 20 instalados
Servidores MCP remotos: 5 conectados
Rendimiento: Sin degradación
Contexto: Ligero y eficiente
```

### Portabilidad

**Compatibilidad multiplataforma:**
- Los skills son archivos estándar.
- Funcionan en cualquier agente que soporte el formato.
- Compartibles entre equipos y proyectos.

**Ejemplo:**
```bash
# Exportar directorio de skills
tar -czf my-skills.tar.gz ~/.claude/skills/

# Importar en otra máquina
tar -xzf my-skills.tar.gz -C ~/.claude/
```

### Eficiencia

**Uso de recursos optimizado:**
- Los skills no saturan la memoria.
- Se cargan del disco bajo demanda.
- Activación/desactivación rápida.

**Métricas:**
- Uso del contexto: Mínimo (solo metadatos).
- Tiempo de carga: Milisegundos.
- Huella de memoria: Baja.

### Extensibilidad

**Fácil de extender:**
- Servidores MCP para integraciones externas.
- Los skills pueden incluir código ejecutable.
- No es necesaria la modificación del agente.

**Ejemplo:**
```
Agregar Nueva Capacidad:
1. Crear skill o servidor MCP.
2. Instalar/configurar.
3. Disponible de inmediato.
```

## Ubicaciones de Almacenamiento

### Almacenamiento de Skills

**Skills Globales:**
```
~/.claude/skills/
├── skill-1/
├── skill-2/
└── skill-3/
```

**Skills de Proyecto:**
```
directorio-del-proyecto/.claude/skills/
├── proyecto-especifico-1/
└── proyecto-especifico-2/
```

**Específico de la Plataforma:**
- **Claude Code:** `.claude/skills/`
- **Antigravity:** `.agent/skills/`
- **Cursor:** `.cursor/skills/`

### Configuración de MCP

**MCP Global:**
```
~/.claude/mcp.json
```

**MCP de Proyecto:**
```
directorio-del-proyecto/.claude/mcp.json
```

## Ejemplo del Mundo Real

### Escenario: Desarrollo de Aplicación Web

**Configuración del Agente:**
```yaml
Skills:
  - react-best-practices
  - api-design
  - database-migrations
  - security-audit
  - deployment

Servidores MCP:
  - postgres (local)
  - aws-s3 (remoto)
  - github (remoto)

Prompt de Sistema:
  "Eres un desarrollador full-stack senior especializado en React y Node.js"
```

**Solicitud del Usuario:**
```
"Crea un nuevo endpoint de API para el registro de usuarios con verificación por correo electrónico"
```

**Ejecución del Agente:**

1. **Cargar Skills:**
   - `api-design` (patrones REST)
   - `database-migrations` (cambios de esquema)
   - `security-audit` (validación, cifrado)

2. **Usar Herramientas:**
   - **Bash:** Ejecutar pruebas, iniciar servidor de desarrollo.
   - **Node.js:** Ejecutar scripts de migración.
   - **Sistema de archivos:** Leer plantillas de skills.

3. **Acceder a MCP:**
   - **postgres:** Crear tabla de usuarios.
   - **aws-s3:** Almacenar avatares de usuarios.
   - **github:** Crear rama de característica.

4. **Generar:**
   - Código del endpoint de la API.
   - Migración de la base de datos.
   - Validaciones de seguridad.
   - Pruebas.
   - Documentación.

## Arquitecturas Específicas de la Plataforma

### Claude Code

```
Agente
  ↓
.claude/
├── skills/          # Directorio de skills
├── agents/          # Subagentes personalizados
├── commands/        # Comandos slash
└── mcp.json         # Configuración de MCP
```

### Antigravity

```
Agente
  ↓
.agent/
├── skills/          # Directorio de skills
└── rules/           # Reglas del proyecto

~/.gemini/antigravity/
├── skills/          # Skills globales
└── mcp_config.json  # MCP global (sin nivel de proyecto)
```

### Multiplataforma (OpenSkills)

```
Agente
  ↓
.agent/
└── skills/          # Directorio de skills universal

AGENTS.md            # Metadatos del skill (formato XML)
```

## Mejores Prácticas

### Organización de Skills

✅ **SÍ:**
- Mantén los skills enfocados y de un solo propósito.
- Usa nombres descriptivos.
- Incluye documentación exhaustiva.
- Organiza con subdirectorios.

❌ **NO:**
- Crees skills monolíticos que "hagan de todo".
- Uses nombres vagos.
- Te saltes la documentación.
- Pongas todos los archivos en un solo directorio.

### Gestión de Recursos

✅ **SÍ:**
- Usa la divulgación progresiva.
- Mantén SKILL.md por debajo de 500 líneas.
- Mueve el contenido grande a references/.
- Comprime los activos cuando sea posible.

❌ **NO:**
- Cargues todo por adelantado.
- Pongas documentos enteros en SKILL.md.
- Incluyas recursos sin usar.
- Ignores los tamaños de los archivos.

### Integración con MCP

✅ **SÍ:**
- Usa MCP para sistemas externos.
- Documenta los requisitos de MCP.
- Maneja los errores de conexión con elegancia.
- Proporciona alternativas (fallbacks).

❌ **NO:**
- Dupliques la funcionalidad de MCP en los skills.
- Asumas que MCP siempre está disponible.
- Ignores los estados de error.
- Te saltes las pruebas de conexión.

## Solución de Problemas

### El Skill no se Carga

**Problema:** El skill existe pero no se carga.

**Comprobar:**
1. Verificar la ubicación del archivo.
2. Comprobar el formato de SKILL.md.
3. Validar el frontmatter YAML.
4. Revisar los metadatos del skill.

**Solución:**
```bash
# Listar skills instalados
npx skills list

# Verificar estructura del skill
ls -la ~/.claude/skills/nombre-del-skill/

# Comprobar SKILL.md
cat ~/.claude/skills/nombre-del-skill/SKILL.md
```

### Fallo en la Conexión MCP

**Problema:** No se puede conectar al servidor MCP.

**Comprobar:**
1. Archivo de configuración de MCP.
2. Estado de ejecución del servidor.
3. Conectividad de red.
4. Credenciales.

**Solución:**
```bash
# Comprobar la configuración de MCP
cat ~/.claude/mcp.json

# Probar la conexión
curl http://localhost:3000/health

# Reiniciar el servidor MCP
npm run mcp:restart
```

## Siguientes Pasos

- **Entender la estructura del skill:** [Anatomía del Skill](skill-anatomy.md)
- **Aprender a usar los skills:** [Usando Skills](../02-using-skills/discovery.md)
- **Crear tu primer skill:** [Flujo de Trabajo de Creación](../03-creating-skills/workflow.md)

---

**Relacionado:**
- [¿Qué son los Skills?](what-are-skills.md) - Conceptos centrales.
- [Anatomía del Skill](skill-anatomy.md) - Estructura de SKILL.md.
- [Integración con MCP](../../mcp/) - Model Context Protocol.

**Externo:**
- [Agent Skills Standard](https://agentskills.io)
- [Model Context Protocol](https://modelcontextprotocol.io)
