# Restricciones de Herramientas y Permisos

## Descripción General

Las restricciones de herramientas controlan lo que Claude puede hacer al ejecutar skills. Al limitar las herramientas disponibles y establecer permisos apropiados, puedes crear entornos de ejecución seguros para tareas específicas, prevenir modificaciones no deseadas y aplicar políticas de seguridad.

Claude Code proporciona dos niveles de control de herramientas: **restricciones a nivel de skill** (mediante el frontmatter `allowed-tools`) y **permisos a nivel de sistema** (mediante el comando `/permissions`). Comprender ambos mecanismos permite un control detallado sobre las capacidades de Claude.

## ¿Qué Son las Restricciones de Herramientas?

Las restricciones de herramientas limitan qué herramientas puede usar Claude en contextos específicos:

**Restricciones a nivel de skill:**
- Definidas en el frontmatter del skill usando el campo `allowed-tools`
- Aplican solo cuando ese skill está activo
- Sobrescriben los permisos a nivel de sistema para las herramientas permitidas
- Habilitan flujos de trabajo sin fricción para operaciones confiables

**Permisos a nivel de sistema:**
- Configurados mediante el comando `/permissions`
- Aplican globalmente en todas las conversaciones
- Controlan qué skills pueden ser invocados
- Requieren aprobación del usuario para herramientas restringidas

## Cuándo Usar Restricciones de Herramientas

### Usar `allowed-tools` a Nivel de Skill Cuando:

- **Operaciones de solo lectura** no deben modificar archivos
- **Herramientas específicas requeridas** para la tarea (y ninguna otra)
- **Flujos de trabajo confiables** donde la fricción te ralentizaría
- **Tareas específicas de dominio** con requisitos de herramientas conocidos
- **Operaciones sensibles a la seguridad** necesitan contención

**Ejemplos:**
- Exploración de código (solo Read, Grep, Glob)
- Generación de documentación de API (Read, Bash(curl *))
- Análisis de Git (solo Bash(git *))
- Diagnósticos del sistema (Bash(systemctl *), Bash(journalctl *))

### Usar Permisos a Nivel de Sistema Cuando:

- **Bloquear skills específicos** completamente
- **Requerir aprobación** para operaciones peligrosas
- **Aplicar políticas de seguridad** entre proyectos
- **Limitar la autonomía de Claude** globalmente
- **Proteger contra ejecución accidental**

**Ejemplos:**
- Deshabilitar skills de despliegue en producción
- Requerir aprobación para todas las escrituras de archivos
- Bloquear herramientas MCP específicas
- Prevenir invocación de skills completamente

## Restricciones a Nivel de Skill

### El Campo `allowed-tools`

El campo frontmatter `allowed-tools` especifica qué herramientas puede usar Claude **sin pedir permiso** cuando el skill está activo.

**Sintaxis:**
```yaml
allowed-tools: Tool1, Tool2, Tool3(args)
```

**Efectos:**
- Herramientas listadas: Claude puede usar sin permiso
- Herramientas no listadas: Claude debe pedir permiso
- Vacío u omitido: Comportamiento predeterminado (todas las herramientas requieren permiso)

### Ejemplos Básicos

**Investigación de solo lectura:**
```yaml
---
name: code-explorer
description: Explore codebase without modifications
allowed-tools: Read, Grep, Glob
---

Explore the codebase to answer questions.
You can read files but cannot modify them.
```

**Solo operaciones de Git:**
```yaml
---
name: git-analyzer
description: Analyze git history
allowed-tools: Bash(git *)
---

Analyze the git repository history.
```

**Acceso a API web:**
```yaml
---
name: api-checker
description: Check API endpoint status
allowed-tools: Bash(curl *), Bash(jq *)
---

Check the health of all API endpoints.
```

### Referencia de Sintaxis de Herramientas

| Sintaxis | Significado | Ejemplo |
|--------|---------|---------|
| `ToolName` | Permitir herramienta con cualquier argumento | `Read` |
| `ToolName(arg)` | Permitir herramienta con argumento específico | `Bash(git status)` |
| `ToolName(prefix *)` | Permitir herramienta con argumentos que comienzan con prefijo | `Bash(gh *)` |
| `ToolName1, ToolName2` | Permitir múltiples herramientas | `Read, Grep, Glob` |

### Patrones Comunes de Herramientas

**Acceso de solo lectura a archivos:**
```yaml
allowed-tools: Read, Grep, Glob
```

**Operaciones de Git:**
```yaml
allowed-tools: Bash(git *)
```

**Operaciones de GitHub CLI:**
```yaml
allowed-tools: Bash(gh *)
```

**Peticiones web:**
```yaml
allowed-tools: Bash(curl *), Bash(wget *)
```

**Procesamiento de JSON:**
```yaml
allowed-tools: Bash(jq *), Bash(cat *)
```

**Operaciones de Docker:**
```yaml
allowed-tools: Bash(docker ps *), Bash(docker logs *)
```

**Operaciones de Kubernetes:**
```yaml
allowed-tools: Bash(kubectl get *), Bash(kubectl describe *)
```

**Monitoreo del sistema:**
```yaml
allowed-tools: Bash(top *), Bash(ps *), Bash(netstat *)
```

### Patrones Avanzados

**Múltiples categorías de herramientas:**
```yaml
allowed-tools: Read, Grep, Glob, Bash(git *), Bash(gh *)
```

**Solo comandos específicos:**
```yaml
allowed-tools: Bash(npm test), Bash(npm run lint)
```

**Combinaciones de herramientas:**
```yaml
allowed-tools: Read, Bash(grep *), Bash(awk *), Bash(sed *)
```

## Documentación Relacionada

- [Skills en Claude Code](../claude-code.md) - Referencia completa de skills
- [Integración de Subagentes](subagents-integration.md) - Skills con subagentes
- [Contexto Dinámico](dynamic-context.md) - Inyección de comandos
- [Mejores Prácticas de Seguridad](../../../guidelines/team-conventions/third-party-security-guidelines.md)

## Lectura Adicional

- **Documentación Oficial:** [code.claude.com/docs/en/skills](https://code.claude.com/docs/en/skills)
- **Guía de Permisos:** [code.claude.com/docs/en/permissions](https://code.claude.com/docs/en/permissions)
- **Mejores Prácticas de Seguridad:** [Principio de Mínimo Privilegio](https://en.wikipedia.org/wiki/Principle_of_least_privilege)

---

**Última Actualización:** Febrero 2026
**Categoría:** Skills - Avanzado
**Plataforma:** Claude Code
