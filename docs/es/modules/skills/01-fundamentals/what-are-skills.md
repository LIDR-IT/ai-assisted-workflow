# ¿Qué son los Skills?

## Descripción General

Los **Skills** son paquetes de capacidades modulares que extienden a los agentes de IA con conocimiento especializado, flujos de trabajo y herramientas. Transforman a los agentes de IA de asistentes generales en especialistas de dominio.

## Concepto Central

### Definición

Los Skills son:
- **Paquetes modulares** - Unidades de experiencia autónomas.
- **Divulgación progresiva** - Se cargan solo cuando es necesario.
- **Activados por el agente** - Se activan automáticamente según la solicitud del usuario.
- **Conocimiento especializado** - Experiencia y flujos de trabajo específicos de un dominio.
- **Multiplataforma** - Funcionan en múltiples agentes de IA.

### El Problema que Resuelven

Sin skills:
- ❌ Explicar repetidamente los mismos patrones.
- ❌ Saturación del contexto al cargar todo el conocimiento por adelantado.
- ❌ Respuestas genéricas que carecen de experiencia en el dominio.
- ❌ Copia y pega manual de las mejores prácticas.

Con skills:
- ✅ Se instalan una vez, se usan para siempre.
- ✅ Activación automática cuando son relevantes.
- ✅ Experiencia de dominio especializada bajo demanda.
- ✅ Patrones consistentes en todos los proyectos.

## Cómo Funcionan los Skills

### Modelo de Divulgación Progresiva

Los skills utilizan un sistema de carga de tres niveles para preservar el contexto:

**Nivel 1: Metadatos (~100 palabras)**
- Siempre cargados.
- Nombre y descripción del skill.
- Utilizados para el descubrimiento y activación de skills.

**Nivel 2: Cuerpo del SKILL.md (<5,000 palabras)**
- Se carga cuando el skill se activa.
- Instrucciones y guía principales.
- Flujos de trabajo del proceso.

**Nivel 3: Recursos (Tamaño variable)**
- Se cargan según sea necesario.
- Documentación detallada.
- Scripts, plantillas, ejemplos.

### Flujo de Activación

```
Solicitud del Usuario
    ↓
El Agente escanea las descripciones de los skills
    ↓
Coincidencia encontrada → Cargar el skill completo
    ↓
El Agente ejecuta utilizando el conocimiento del skill
    ↓
El Skill se descarga después de completarse
```

**Ejemplo:**
```
Usuario: "Genera pruebas unitarias para este componente"
      ↓
Agente: Escanea descripciones de skills
      ↓
Agente: Coincide con "testing-skill"
      ↓
Agente: Carga el contenido completo de testing-skill
      ↓
Agente: Genera pruebas utilizando la experiencia
```

## Skills vs Otras Características

### Skills vs MCP (Model Context Protocol)

| Característica | Skills | MCP |
|:---------------|:-------|:----|
| **Propósito** | Definiciones de tareas ("cerebros") | Conexiones de infraestructura ("manos") |
| **Activación** | Activado por el agente | Siempre disponible |
| **Vida útil** | Efímero (se carga/descarga) | Persistente |
| **Contenido** | Instrucciones, scripts, plantillas | Servidores basados en protocolo |
| **Ejemplo** | "Generar pruebas de React" | "Consultar base de datos PostgreSQL" |

**Analogía:**
- **MCP:** Le da al agente manos para usar herramientas.
- **Skills:** Le da al agente cerebros para saber cuándo y cómo usar las herramientas.

### Skills vs Rules (Reglas)

| Característica | Skills | Reglas |
|:---------------|:-------|:-------|
| **Activación** | Bajo demanda (coincidencia de intención) | Siempre activo |
| **Visibilidad** | Divulgación progresiva | Siempre cargado |
| **Propósito** | Capacidades especializadas | Guías generales |
| **Complejidad** | Puede incluir scripts | Solo instrucciones |
| **Ejemplo** | "Flujo de trabajo de migración de base de datos" | "Usar el estilo PEP 8" |

**Cuándo usar cada uno:**
- **Skills:** Experiencia compleja y condicional.
- **Reglas:** Estándares universales y continuos.

### Skills vs Commands (Comandos)

| Característica | Skills | Comandos |
|:---------------|:-------|:---------|
| **Activación** | Automática (coincidencia de descripción) | Manual (`/comando`) |
| **Descubrimiento** | El agente determina | El usuario invoca |
| **Estructura** | Directorio con recursos | Archivo markdown individual |
| **Complejidad** | Scripts + plantillas + ejemplos | Solo instrucciones |
| **Ejemplo** | Se carga auto. en "validar esquema" | `/generate-tests` |

**Nota:** En Claude Code, los comandos se han fusionado con los skills. Un skill puede ser invocado automáticamente y llamado manualmente con `/nombre-del-skill`.

### Skills vs Workflows (Flujos de trabajo)

| Característica | Skills | Flujos de trabajo |
|:---------------|:-------|:------------------|
| **Invocación** | Impulsado por el agente | Impulsado por el usuario |
| **Alcance** | Conocimiento específico de la tarea | Procedimientos de varios pasos |
| **Cuándo** | El agente decide | El usuario lo activa explícitamente |
| **Ejemplo** | "Revisar código por seguridad" | "Desplegar a producción" |

## Tipos de Skills

### 1. Skills de Referencia

Proporcionan conocimiento que se aplica al trabajo actual.

**Características:**
- Información de fondo siempre relevante.
- Convenciones de código y guías de estilo.
- Patrones de arquitectura.
- Conocimiento del dominio.

**Ejemplo: API Conventions**
```yaml
---
name: api-conventions
description: Patrones de diseño de API para esta base de código
---

Al escribir endpoints de API:
- Usar convenciones de nomenclatura RESTful.
- Devolver formatos de error consistentes.
- Incluir validación de solicitudes.
```

### 2. Skills de Tarea

Instrucciones paso a paso para acciones específicas.

**Características:**
- A menudo se invocan manualmente.
- Operaciones con efectos secundarios.
- Flujos de trabajo de varios pasos.
- Requieren control del tiempo.

**Ejemplo: Deployment**
```yaml
---
name: deploy
description: Desplegar la aplicación a producción
disable-model-invocation: true
---

1. Ejecutar suite de pruebas.
2. Construir la aplicación.
3. Empujar al objetivo de despliegue.
4. Verificar el despliegue.
```

### 3. Skills Generadores

Crean código, archivos o artefactos.

**Características:**
- Plantillas y código base.
- Generación de código.
- Creación de archivos.
- Seguimiento de convenciones.

**Ejemplo: Component Generator**
```yaml
---
name: react-component
description: Generar componentes de React con TypeScript y pruebas
---

Crear componente con:
1. Interfaz de TypeScript.
2. Implementación del componente.
3. Pruebas unitarias.
4. Documentación.
```

### 4. Skills de Revisión/Auditoría

Analizan el código en busca de calidad, seguridad y rendimiento.

**Características:**
- Análisis de código.
- Detección de patrones.
- Comprobaciones de mejores prácticas.
- Informe de hallazgos.

**Ejemplo: Security Audit**
```yaml
---
name: security-audit
description: Auditar el código en busca de vulnerabilidades de seguridad
---

Comprobar:
- Riesgos de inyección SQL.
- Vulnerabilidades XSS.
- Problemas de autenticación.
- Exposición de datos sensibles.
```

## Niveles de Complejidad de Skills

### Mínimo (Solo Instrucciones)

```
nombre-del-skill/
└── SKILL.md
```

**Cuándo usar:** Guía o conocimiento simple.

### Estándar (Más Común)

```
nombre-del-skill/
├── SKILL.md
├── references/
│   └── guia-detallada.md
└── examples/
    └── ejemplo-funcional.js
```

**Cuándo usar:** La mayoría de los casos de uso.

### Completo (Funcionalidad Total)

```
nombre-del-skill/
├── SKILL.md
├── references/
│   ├── patrones.md
│   └── api-docs.md
├── examples/
│   ├── basico.js
│   └── avanzado.js
└── scripts/
    ├── validar.sh
    └── generar.js
```

**Cuándo usar:** Dominios complejos que requieren validación y automatización.

## Beneficios

### Para Desarrolladores

✅ **Reducción de la repetición** - No expliques los mismos patrones repetidamente.
✅ **Experiencia instantánea** - Accede a conocimiento especializado de inmediato.
✅ **Validación de la comunidad** - Utiliza patrones probados y testeados.
✅ **Consistencia entre proyectos** - Mismos estándares en todas partes.
✅ **Ahorro de tiempo** - Omite las explicaciones de incorporación.

### Para Agentes de IA

✅ **Capacidades mejoradas** - Acceso a conocimiento especializado.
✅ **Experiencia de dominio** - Comprensión profunda de áreas específicas.
✅ **Conocimiento del flujo de trabajo** - Guía de procesos paso a paso.
✅ **Integración de herramientas** - Scripts y utilidades para tareas comunes.
✅ **Aprendizaje progresivo** - Los skills se cargan bajo demanda.

### Para Equipos

✅ **Estandarización** - Prácticas consistentes en todo el equipo.
✅ **Conocimiento compartido** - La experiencia del equipo codificada.
✅ **Incorporación** - Los nuevos miembros obtienen contexto instantáneo.
✅ **Mejores prácticas** - Estándares de la industria integrados.
✅ **Garantía de calidad** - Los patrones probados reducen los errores.

## Plataformas Compatibles

Los Skills funcionan en **más de 20 agentes de codificación de IA**, incluyendo:

### Plataformas Principales
- **Claude Code** (Anthropic)
- **GitHub Copilot** (GitHub/Microsoft)
- **Cursor** (Anysphere)
- **Cline** (Cline AI)
- **Gemini CLI / Antigravity** (Google)
- **OpenAI Codex** (OpenAI)

### Agentes Adicionales
- Windsurf
- Aider
- Continue
- Supermaven
- Y muchos más...

### Compatibilidad Universal

Los Skills siguen formatos estandarizados que funcionan en todas las plataformas:
- **Escribe una vez, úsalo en cualquier lugar.**
- **Compatibilidad multiplataforma.**
- **Intercambio comunitario.**
- **Sin dependencia excesiva de un proveedor.**

## Empezando

### Usando Skills

1. **Descubrir:** Navega por el mercado [skills.sh](https://skills.sh).
2. **Instalar:** `npx skills add <owner/repo>`.
3. **Usar:** Los Skills se activan automáticamente cuando son relevantes.

**Ver:** [Guía de Uso de Skills](../02-using-skills/discovery.md)

### Creando Skills

1. **Aprender:** Entender los [Principios de Diseño](../03-creating-skills/design-principles.md).
2. **Elegir:** Seleccionar el [Patrón de Skill](../03-creating-skills/skill-patterns.md) adecuado.
3. **Crear:** Seguir el [Flujo de Trabajo de Creación](../03-creating-skills/workflow.md).

**Ver:** [Guía de Creación de Skills](../03-creating-skills/workflow.md)

## Siguientes Pasos

- **Entender la arquitectura:** [Arquitectura](architecture.md)
- **Aprender la anatomía del skill:** [Anatomía del Skill](skill-anatomy.md)
- **Empezar a usar skills:** [Guía de Descubrimiento](../02-using-skills/discovery.md)
- **Crear tu primer skill:** [Flujo de Trabajo de Creación](../03-creating-skills/workflow.md)

---

**Relacionado:**
- [Arquitectura](architecture.md) - Cómo encajan los skills en el ecosistema de agentes de IA.
- [Anatomía del Skill](skill-anatomy.md) - Estructura de los archivos SKILL.md.
- [Principios de Diseño](../03-creating-skills/design-principles.md) - Filosofía de diseño central.

**Externo:**
- [skills.sh](https://skills.sh) - Mercado de skills.
- [Agent Skills Standard](https://agentskills.io) - Estándar abierto.
