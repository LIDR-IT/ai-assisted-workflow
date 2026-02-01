# Ecosistema NPM de Paquetes para Skills

## Descripción General

El paquete npm **skills** representa un avance en la extensibilidad de agentes de IA, sirviendo como un gestor de paquetes comprensivo para asistentes de codificación de IA. A menudo descrito como "npm para agentes de IA", proporciona una interfaz de línea de comandos estandarizada para instalar y gestionar conocimiento especializado, mejores prácticas y capacidades específicas de dominio a través de múltiples plataformas de IA.

**Paquete:** `skills`  
**Última Versión:** 1.0.6  
**Registro:** [npm](https://www.npmjs.com/package/skills)  
**Plataforma:** [skills.sh](https://skills.sh/)  
**Instalaciones Semanales:** 55.6K+ (solo el skill find-skills)

### El Concepto de "npm para Agentes de IA"

Así como npm revolucionó la gestión de paquetes de JavaScript al proporcionar un registro centralizado y un flujo de trabajo de instalación simple, el paquete skills trae el mismo paradigma a las capacidades de agentes de IA. En lugar de elaborar prompts manualmente o buscar mejores prácticas, los desarrolladores ahora pueden instalar skills probados en batalla y validados por la comunidad con un solo comando.

Este ecosistema habilita:
- **Transferencia instantánea de conocimiento** a agentes de IA
- **Mejores prácticas estandarizadas** entre equipos y proyectos
- **Desarrollo de skills impulsado por la comunidad** y compartición
- **Compatibilidad multiplataforma** entre diferentes asistentes de codificación de IA
- **Gestión versionada de skills** con mecanismos de actualización

## Instalación

### Instalación del Paquete

Instala el CLI de skills globalmente para acceso en todo el sistema:

```bash
npm i skills
```

O instala localmente dentro de un proyecto:

```bash
npm i --save-dev skills
```

### Usando npx (Sin Instalación)

Para uso único sin instalación:

```bash
npx skills [command]
```

Este enfoque es ideal para:
- Probar el CLI antes de comprometerse con la instalación
- Pipelines de CI/CD donde no quieres dependencias globales
- Asegurar que siempre estás usando la última versión

## Referencia Completa del CLI

El CLI de skills proporciona un conjunto comprensivo de comandos para descubrir, instalar, gestionar y actualizar skills de agentes.

### 1. Encontrar Skills: `npx skills find`

Busca el registro de skills interactivamente o por palabra clave para descubrir capacidades que coincidan con tus necesidades.

**Sintaxis:**
```bash
npx skills find [query]
```

**Ejemplos:**
```bash
# Encontrar skills de optimización de React
npx skills find react performance

# Buscar skills de DevOps
npx skills find kubernetes deployment
```

### 2. Agregar Skills: `npx skills add`

Instala skills desde GitHub, el registro de skills.sh o fuentes personalizadas.

**Sintaxis:**
```bash
npx skills add <package> [flags]
```

**Banderas:**
- `-g, --global` — Instalar globalmente (disponible en todos los proyectos)
- `-y, --yes` — Auto-aceptar instalación (saltar confirmación)
- `--verbose` — Mostrar logs de instalación detallados

**Ejemplos:**
```bash
# Instalar desde el registro skills.sh
npx skills add vercel-labs/skills@react-performance

# Instalación global con auto-confirmación
npx skills add vercel-labs/skills@react-performance -g -y
```

### 3. Verificar Actualizaciones: `npx skills check`

Verifica si los skills instalados tienen actualizaciones disponibles sin aplicarlas.

```bash
npx skills check
```

### 4. Actualizar Skills: `npx skills update`

Actualiza los skills instalados a sus últimas versiones.

```bash
npx skills update [skill-name] [flags]
```

### 5. Listar Skills Instalados: `npx skills list`

Muestra todos los skills actualmente instalados con sus versiones y ubicaciones.

```bash
npx skills list [--global | --local | --verbose]
```

### 6. Eliminar Skills: `npx skills remove`

Desinstala skills de tu sistema o proyecto.

```bash
npx skills remove <skill-name> [-g] [-y]
```

## Paquetes Relacionados en el Ecosistema

### OpenSkills: Cargador Universal de Skills

**Paquete:** `openskills`  
**Propósito:** Cargador universal de skills para agentes de codificación de IA  
**Repositorio:** [GitHub - numman-ali/openskills](https://github.com/numman-ali/openskills)  
**Instalación:** `npm i -g openskills`

OpenSkills trae el sistema de skills de Anthropic a múltiples agentes de codificación de IA más allá de Claude Code, incluyendo:

- **Claude Code** — CLI oficial de Anthropic
- **Cursor** — Editor de código potenciado por IA
- **Windsurf** — Entorno de desarrollo de IA
- **Aider** — Programación en pareja con IA en la terminal
- **Codex** — Modelo de generación de código de OpenAI

### npm-agentskills: Descubrimiento Agnóstico de Framework

**Paquete:** `npm-agentskills`  
**Propósito:** Descubrimiento y exportación de skills agnósticos de framework  
**Repositorio:** [GitHub - onmax/npm-agentskills](https://github.com/onmax/npm-agentskills)

Permite a los autores de paquetes npm empaquetar documentación de agentes de IA directamente con sus paquetes.

### agent-skill-npm-boilerplate: Plantilla de Creación de Skills

**Repositorio:** [GitHub - neovateai/agent-skill-npm-boilerplate](https://github.com/neovateai/agent-skill-npm-boilerplate)  
**Propósito:** Plantilla para crear y publicar skills de Claude Code como paquetes npm

Proporciona el andamiaje necesario para crear, probar y publicar skills de agentes profesionales.

## Consideraciones de Seguridad

### El Problema de Comandos npx Alucinados

**Aviso Crítico de Seguridad:**

Los skills de agentes de IA pueden propagar comandos npx alucinados, creando riesgos reales de seguridad y confiabilidad para desarrolladores y cadenas de suministro.

**Referencia:** [Agent Skills Are Spreading Hallucinated npx Commands](https://www.aikido.dev/blog/agent-skills-spreading-hallucinated-npx-commands)

### Mejores Prácticas de Verificación

**Antes de Instalar Cualquier Skill:**

1. **Verificar Existencia del Paquete:**
   ```bash
   npm view skills
   open https://github.com/vercel-labs/skills
   ```

2. **Revisar Metadata del Paquete:**
   ```bash
   npm info <package-name>
   ```

3. **Verificar Autenticidad del Repositorio:**
   - Verificar reputación de organización/usuario de GitHub
   - Verificar edad y actividad del repositorio
   - Revisar historial de commits y contribuidores
   - Buscar insignias de verificación oficial

4. **Examinar Código Fuente:**
   ```bash
   git clone https://github.com/owner/repo
   cd repo
   cat SKILL.md
   ```

5. **Usar Fuentes Explícitas:**
   ```bash
   # Bueno: Fuente de GitHub explícita
   npx skills add vercel-labs/skills@react-performance

   # Riesgoso: Resolución de paquete implícita
   npx random-package-name
   ```

### Guías de Uso Seguro

1. **Nunca Ejecutar Ciegamente Sugerencias de IA:**
   - Siempre verificar nombres de paquetes
   - Verificar múltiples fuentes (npm, GitHub, skills.sh)
   - Revisar qué hace el skill antes de la instalación

2. **Usar Instalación Local del Proyecto por Defecto:**
   ```bash
   # Local del proyecto (más seguro)
   npx skills add vercel-labs/skills@react-performance

   # Global (afecta todos los proyectos)
   npx skills add vercel-labs/skills@react-performance -g
   ```

3. **Fijar Versiones en Producción:**
   ```json
   {
     "skills": [
       "vercel-labs/skills@react-performance@1.3.0"
     ]
   }
   ```

4. **Revisar Skills en Code Review:**
   - Incluir `.claude/skills/` en control de versiones
   - Revisar adiciones de skills en pull requests
   - Documentar por qué se necesita cada skill

5. **Auditar Skills Instalados Regularmente:**
   ```bash
   npx skills list --verbose
   npx skills remove unused-skill
   ```

## Casos de Uso

### Proyectos Multi-Dominio

**Escenario:** Construir una aplicación full-stack requiriendo experiencia en múltiples dominios.

**Solución con Skills:**
```bash
# Skills de front-end
npx skills add vercel-labs/skills@react-performance -g -y
npx skills add vercel-labs/skills@nextjs-best-practices -g -y

# Skills de back-end
npx skills add vercel-labs/skills@nodejs-patterns -g -y
npx skills add vercel-labs/skills@api-security -g -y

# Skills de DevOps
npx skills add vercel-labs/skills@docker-best-practices -g -y
npx skills add vercel-labs/skills@kubernetes-deployment -g -y
```

**Beneficios:**
- El agente de IA gana experiencia en todos los dominios
- Mejores prácticas consistentes a lo largo del stack
- Desarrollo más rápido con orientación específica de dominio

### Estandarización de Equipo

**Escenario:** El equipo de desarrollo necesita prácticas y patrones de codificación estandarizados.

**Solución:** Crear repositorio de skills del equipo usando agent-skill-npm-boilerplate, definir estándares del equipo, y distribuir vía npm privado o GitHub.

**Beneficios:**
- Los agentes de IA aprenden patrones específicos del equipo
- Revisión automática de código contra estándares del equipo
- Experiencia de onboarding consistente

---

## Documentación Relacionada

### Documentación Core de Skills
- [Guía de Instalación](../02-installation/installation.md) — Instalar y configurar skills
- [Métodos de Descubrimiento](../05-discovery/discovery.md) — Encontrar los skills correctos
- [Desarrollo de Skills Locales](../03-creating-skills/local-skills.md) — Crear skills personalizados

### Integración de Plataforma
- [Skills en Claude Code](../../references/skills/README.md) — Ecosistema de skills de Claude Code
- [Integración de Skills MCP](../../guides/mcp/mcp-setup-guide.md) — Model Context Protocol para skills

### Seguridad
- [Guías de Seguridad de Terceros](../../guidelines/team-conventions/third-party-security-guidelines.md) — Mejores prácticas de seguridad
- [Guías de Gestión de Skills](../../guidelines/team-conventions/skills-management-guidelines.md) — Gobernanza de skills del equipo

---

**Última Actualización:** Febrero 2026  
**Estado:** Desarrollo Activo  
**Mantenedor:** Vercel Labs  
**Tamaño del Ecosistema:** 55.6K+ instalaciones semanales (creciendo)
