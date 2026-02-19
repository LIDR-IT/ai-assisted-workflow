# Skills Installation & MCP Comparison

## Overview

Esta nota documenta cómo instalar Skills universalmente y explica por qué MCP no tiene un estándar similar de instalación centralizada.

**Estado del Proyecto:**

- ✅ **Skills configuradas** - 7 skills en `.agents/skills/`
- ✅ **MCP configuradas** - Context7 instalado en todos los agentes
- 🔧 **Agentes activos:** Antigravity (`.agent`), Claude Code (`.claude`), Cursor (`.cursor`), Gemini CLI (`.gemini`)

---

## Skills: Instalación Universal

### OpenSkills - Universal Skills Loader

**OpenSkills** es el instalador universal para Skills que funciona con todos los agentes de IA.

**Lanzamiento:** Enero 5, 2026

**Agentes Soportados:**

- Claude Code
- Cursor
- Windsurf
- Aider
- Codex
- Antigravity
- Gemini CLI
- Cualquier agente que lea `AGENTS.md`

**En este proyecto:**

- ✅ Antigravity (`.agents/skills/` → native detection)
- ✅ Claude Code (`.claude/skills/`)
- ✅ Cursor (`.cursor/skills/`)
- ✅ Gemini CLI (`.gemini/skills` → symlink)

### Comandos de Instalación

#### OpenSkills

**Instalar skill:**

```bash
npx openskills install <owner/repo>
```

**Ejemplos:**

```bash
# Instalación básica (project-local)
npx openskills install anthropics/skills

# Instalación universal (todos los agentes)
npx openskills install anthropics/skills --universal

# Instalación global (~/.claude/skills)
npx openskills install anthropics/skills --global
```

**Otros comandos:**

```bash
# Listar skills instaladas
npx openskills list

# Sincronizar AGENTS.md
npx openskills sync

# Actualizar skills
npx openskills update

# Remover skill
npx openskills remove <skill-name>
```

#### Vercel Labs Skills

**Comandos principales:**

```bash
# Agregar skill
npx skills add <owner/repo>

# Buscar skills
npx skills find <query>

# Gestionar skills
npx skills
```

### Ubicaciones de Instalación

**Por defecto (project-local):**

- `./.claude/skills`
- `./.agents/skills` (con `--universal`)

**Global (con flag):**

- `~/.claude/skills`

**En este proyecto:**

```
.agents/skills/                    # Source of truth
├── agent-development/
├── command-development/
├── find-skills/
├── hook-development/
├── mcp-integration/
├── skill-creator/
└── skill-development/

# Configuración por agente:
.agents/skills/        → Native .agents/ detection (Antigravity) ✅
.claude/skills/        → Symlink a ../.agents/skills ✅
.cursor/skills/        → Symlink a ../.agents/skills ✅
.gemini/skills         → Symlink a ../.agents/skills ✅
```

### Ventajas del Sistema Skills

✅ **Instalación universal** - Un comando funciona para todos los agentes
✅ **Formato estándar** - SKILL.md reconocido por todos
✅ **Sincronización automática** - Con symbolic links
✅ **Descubrimiento fácil** - `npx skills find <query>`
✅ **Version control** - Skills en repositorios Git

---

## MCP: Sin Estándar de Instalación Universal

### Estado Actual (2026)

**Hallazgo clave:** MCP NO tiene un instalador universal como OpenSkills.

Cada plataforma requiere su propio archivo de configuración:

| Plataforma      | Archivo de Configuración                | Formato | En Proyecto    |
| --------------- | --------------------------------------- | ------- | -------------- |
| **Cursor**      | `.cursor/mcp.json`                      | JSON    | ✅ Context7    |
| **Claude Code** | `.claude/mcp.json`                      | JSON    | ✅ Context7    |
| **Gemini CLI**  | `.gemini/settings.json`                 | JSON    | ✅ Context7    |
| **Antigravity** | `~/.gemini/antigravity/mcp_config.json` | JSON    | ⚠️ Solo global |

**Estado del proyecto:**

- ✅ **Context7** configurado en Cursor, Claude Code, Gemini CLI
- ⚠️ **Antigravity** - NO soporta MCP a nivel de proyecto (solo global)
- ✅ Sistema de sincronización centralizado (`.agents/sync.sh --only=mcp`)
- 📝 [Discusión sobre soporte per-workspace](https://discuss.ai.google.dev/t/support-for-per-workspace-mcp-config-on-antigravity/111952)
- Documentación disponible en `docs/references/mcp/` para:
  - mcp-antigravity.md
  - mcp-cursor.md
  - mcp-gemini-cli.md
  - mcp-integration-claude-code.md

### ¿Por Qué No Hay Estándar?

**Razones:**

1. **Formatos diferentes** - JSON vs TOML
2. **Campos específicos** - Algunas plataformas usan `url`, otras `serverUrl`
3. **Evolución temprana** - MCP es más nuevo que Skills
4. **Gestión descentralizada** - Cada IDE/CLI maneja MCP independientemente

### Futuro de MCP

**MCPaaS (MCP-as-a-Service):**

- Red Hat está desarrollando una capa de gestión centralizada
- Hosting, observación y auditoría de MCP servers
- Catálogo centralizado de servidores aprobados
- **Estado:** En desarrollo, no es estándar aún

**Gobernanza:**

- Diciembre 2025: MCP donado a **Agentic AI Foundation (AAIF)**
- Fundación bajo Linux Foundation
- Co-fundada por Anthropic, Block y OpenAI

### Solución Propuesta: Script de Sincronización

Dado que no existe estándar universal, la approach recomendada es:

1. **Source of truth:** `.agents/mcp/mcp-servers.json` (a crear)
2. **Script de sync:** `.agents/sync.sh --only=mcp` (a crear)
3. **Configs generados:** Por plataforma automáticamente

**Estado actual en proyecto:**

- ⚠️ Script de sincronización no implementado
- ⚠️ MCP solo configurado a nivel de usuario
- ✅ Documentación completa disponible en `docs/references/mcp/`

**Para implementar en proyecto:**

```bash
# 1. Crear estructura
mkdir -p .mcp

# 2. Crear source of truth
cat > .agents/mcp/mcp-servers.json << 'EOF'
{
  "version": "1.0",
  "servers": {
    "github": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@github/mcp-server"],
      "platforms": ["cursor", "claude", "gemini", "antigravity"]
    }
  }
}
EOF

# 3. Crear script de sincronización
# (Ver documentación MCP para script completo)
```

---

## Comparación: Skills vs MCP

| Característica            | Skills                      | MCP                   | Estado en Proyecto                    |
| :------------------------ | :-------------------------- | :-------------------- | :------------------------------------ |
| **Instalación Universal** | ✅ `npx openskills install` | ❌ Config manual      | ✅ Skills implementadas               |
| **Formato Estándar**      | ✅ SKILL.md                 | ⚠️ JSON/TOML variante | ✅ 7 skills en `.agents/skills/`      |
| **Sincronización**        | ✅ Symlinks automáticos     | ⚠️ Require scripts    | ⚠️ Parcial (solo .gemini usa symlink) |
| **Descubrimiento**        | ✅ `npx skills find`        | ❌ No hay búsqueda    | ✅ `find-skills` instalada            |
| **Cross-Platform**        | ✅ Todos los agentes        | ⚠️ Config específico  | ✅ 4 agentes configurados             |
| **Madurez**               | ✅ Estándar establecido     | ⚠️ En evolución       | ✅ Skills / ❌ MCP                    |
| **Gestión**               | ✅ CLI integrado            | ❌ Manual o scripts   | ✅ Skills / ❌ MCP no config          |
| **En Proyecto**           | ✅ Configurado              | ❌ No configurado     | -                                     |

---

## Best Practices

### Para Skills

**✅ Instalación:**

```bash
# Usar OpenSkills para instalación universal
npx openskills install anthropics/skills --universal
```

**✅ Descubrimiento:**

```bash
# Buscar skills por funcionalidad
npx skills find "code review"
npx skills find "testing"
```

**✅ Gestión:**

```bash
# Listar instaladas
npx openskills list

# Actualizar regularmente
npx openskills update
```

**✅ Version Control:**

- Commit `.agents/skills/` al repositorio
- Usar symlinks para sincronización entre agentes
- Documentar skills en README o AGENTS.md

### Para MCP

**✅ Configuración:**

- Usar source of truth centralizado (`.agents/mcp/mcp-servers.json`)
- Script de sincronización para generar configs por plataforma
- Version control de configs generados

**✅ Gestión:**

- Documentar cada MCP server
- Mantener sincronizados todos los archivos de config
- Ejecutar sync script después de cambios

**✅ Seguridad:**

- Solo instalar MCPs de proveedores oficiales
- Revisar código antes de instalar
- Variables de entorno para credenciales

---

## Recomendaciones por Caso de Uso

### Caso 1: Nuevo Proyecto

**Skills:**

```bash
# Instalar skills básicas universalmente
npx openskills install anthropics/skills --universal
npx openskills install vercel-labs/code-review --universal
```

**MCP:**

```bash
# Crear source of truth
mkdir -p .mcp
# Editar .agents/mcp/mcp-servers.json
# Ejecutar sync script
.agents/sync.sh --only=mcp
```

### Caso 2: Equipo Multi-Agente (Este Proyecto)

**Skills (Implementado):**

- ✅ Source of truth: `.agents/skills/`
- ✅ Approach unificado:
  - `.agents/skills/` → native .agents/ detection (Antigravity) ✅
  - `.gemini/skills`, `.claude/skills`, `.cursor/skills` → symlinks ✅
- ✅ 7 skills instaladas y funcionando
- ✅ Commiteado a git

**Estado actual de Skills:**

```bash
# Verificar symlinks y detección nativa
ls -la .agents/skills/        # Antigravity lee nativamente desde aquí
readlink .claude/skills        # → ../.agents/skills
readlink .cursor/skills        # → ../.agents/skills
readlink .gemini/skills        # → ../.agents/skills
```

**MCP (No implementado):**

- ❌ No hay configuración a nivel de proyecto
- ⚠️ Solo configurado a nivel de usuario
- 📋 Para implementar:
  - Crear `.agents/mcp/mcp-servers.json`
  - Implementar script de sincronización
  - Generar configs por plataforma

### Caso 3: Solo Un Agente

**Skills:**

- Instalar directamente en directorio del agente
- Ejemplo: `.claude/skills/` para Claude Code solamente

**MCP:**

- Configurar solo el archivo del agente usado
- Ejemplo: Solo `.cursor/mcp.json` para Cursor

---

## Roadmap y Futuro

### Skills

**Estado actual (2026):**

- ✅ Estándar maduro y ampliamente adoptado
- ✅ OpenSkills como instalador universal
- ✅ Gran ecosistema de skills disponibles

**Futuro:**

- Mayor adopción en nuevos agentes
- Más skills especializadas por industria
- Mejoras en descubrimiento y marketplace

### MCP

**Estado actual (2026):**

- ⚠️ Estándar en evolución
- ⚠️ Sin instalador universal
- ⚠️ Requiere configuración manual por plataforma

**Futuro:**

- MCPaaS para gestión centralizada (Red Hat)
- Posible estandarización bajo AAIF
- Registro centralizado de MCP servers
- Potencial integración con OpenSkills

---

## Estado Actual del Proyecto

### Skills: ✅ Configuradas y Funcionando

**7 Skills Instaladas:**

1. `agent-development` - Desarrollo de agentes
2. `command-development` - Desarrollo de comandos
3. `find-skills` - Búsqueda de skills
4. `hook-development` - Desarrollo de hooks
5. `mcp-integration` - Integración MCP
6. `skill-creator` - Creación de skills
7. `skill-development` - Desarrollo de skills

**Agentes Configurados:**

- ✅ Antigravity (`.agents/skills/` → native detection)
- ✅ Claude Code (`.claude/skills/`)
- ✅ Cursor (`.cursor/skills/`)
- ✅ Gemini CLI (`.gemini/skills` → symlink)

**Estado:**

- ✅ Antigravity usa native .agents/ detection (no requiere symlink separado)
- ✅ Claude Code, Cursor, Gemini CLI usan symlinks a `.agents/skills/`
- Documentar skills en README

### MCP: ❌ No Configuradas a Nivel de Proyecto

**Documentación Disponible:**

- ✅ `docs/references/mcp/mcp-antigravity.md`
- ✅ `docs/references/mcp/mcp-cursor.md`
- ✅ `docs/references/mcp/mcp-gemini-cli.md`
- ✅ `docs/references/mcp/mcp-integration-claude-code.md`
- ✅ `docs/references/mcp/mcp-openai-codex.md`

**Para Implementar:**

1. Crear estructura `.agents/mcp/`
2. Definir `mcp-servers.json`
3. Implementar script de sincronización
4. Generar configs por plataforma

**MCP Actualmente:**

- ✅ **Implementado** - Sistema de sincronización centralizado
- ✅ **Context7** configurado en todos los agentes
- Source of truth: `.agents/mcp/mcp-servers.json`
- Script de sync: `.agents/sync.sh --only=mcp`

---

## Conclusión

**Skills tienen ventaja significativa:**

- Instalación universal con OpenSkills
- Sincronización automática entre agentes
- Descubrimiento y gestión integrados

**MCP requiere approach manual:**

- Configuración específica por plataforma
- Scripts custom para sincronización
- Sin descubrimiento universal

**Estrategia del proyecto:**

- **Skills:** ✅ Implementadas — Antigravity usa native .agents/ detection, otros agentes usan symlinks
- **MCP:** ❌ Pendiente de implementar con script de sincronización centralizado

**Próximos pasos:**

1. Implementar configuración MCP a nivel de proyecto
2. Crear script de sincronización MCP

---

## Referencias

**OpenSkills:**

- [GitHub](https://github.com/numman-ali/openskills)
- [npm](https://www.npmjs.com/package/openskills)
- [Launch Article](https://www.vibesparking.com/en/blog/ai/openskills/2025-12-24-openskills-universal-skills-loader-ai-coding-agents/)

**Vercel Labs Skills:**

- [GitHub](https://github.com/vercel-labs/skills)

**MCP:**

- [MCP Specification](https://modelcontextprotocol.io/specification/2025-11-25)
- [Wikipedia](https://en.wikipedia.org/wiki/Model_Context_Protocol)
- [Anthropic Announcement](https://www.anthropic.com/news/model-context-protocol)
- [Red Hat MCP Article](https://developers.redhat.com/articles/2026/01/08/building-effective-ai-agents-mcp)

**Related Documentation:**

- `docs/notes/agents-vs-skills.md` - Conceptos fundamentales
- `docs/references/skills/openskills.md` - OpenSkills detallado
- `docs/references/mcp/*.md` - MCP por plataforma
- `docs/references/guidelines/team-conventions/skills-management-guidelines.md` - Gestión de skills

---

**Última actualización:** Enero 2026
**Estado:** Skills tienen estándar universal, MCP no
**Recomendación:** Usar OpenSkills para skills, scripts custom para MCP
