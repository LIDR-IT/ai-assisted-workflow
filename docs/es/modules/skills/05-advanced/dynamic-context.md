# Inyección de Contexto Dinámico

## Descripción General

La inyección de contexto dinámico permite que los skills ejecuten comandos de shell e inyecten su salida directamente en el contenido del skill **antes** de que Claude lo vea. Esta capacidad de preprocesamiento permite que los skills trabajen con datos en vivo, estado actual del sistema o APIs externas sin requerir que Claude ejecute comandos.

La sintaxis `` !`command` `` es una característica poderosa que transforma instrucciones de skills estáticas en prompts dinámicos conscientes del contexto.

## ¿Qué es la Inyección de Contexto Dinámico?

La inyección de contexto dinámico usa sintaxis especial para ejecutar comandos de shell durante la carga del skill:

```yaml
---
name: pr-summary
description: Summarize GitHub pull request
---

## Pull Request Context
- PR diff: !`gh pr diff`
- PR comments: !`gh pr view --comments`
- Changed files: !`gh pr diff --name-only`

## Your Task
Summarize the above pull request.
```

**Concepto clave:** La sintaxis `` !`command` `` es **preprocesamiento**, no ejecución. Claude nunca ejecuta estos comandos—se ejecutan antes de que Claude vea el contenido del skill.

## Cuándo Usar Contexto Dinámico

### Usar Contexto Dinámico Cuando:

- **Necesitas datos en vivo** que cambian entre invocaciones
- **Comandos externos proporcionan contexto** (GitHub API, git status, info del sistema)
- **El estado actual importa** (archivos abiertos, commits recientes, variables de entorno)
- **Los datos son demasiado grandes** para codificar en el contenido del skill
- **La información proviene de fuentes externas** (APIs, bases de datos, archivos)

**Ejemplos:**
- Resúmenes de pull requests (datos de PR en vivo)
- Asistencia para commits de git (diff actual, archivos staged)
- Diagnósticos de sistema (uso de recursos actual, logs)
- Documentación de API (estado de endpoints en vivo)
- Flujos de trabajo específicos del entorno (despliegue actual, servicios activos)

### No Usar Contexto Dinámico Cuando:

- **Guías estáticas** que no cambian (guías de estilo, convenciones)
- **Comandos tienen efectos secundarios** (despliegues, eliminaciones)
- **Comandos lentos o poco confiables** (podrían bloquear la carga del skill)
- **Operaciones sensibles a seguridad** (riesgo de exposición de credenciales)
- **Sustituciones de cadenas simples** (`$ARGUMENTS` es mejor)

## Cómo Funciona

### Flujo de Ejecución

1. **Invocación del Skill**: Usuario o Claude invoca el skill
2. **Fase de Preprocesamiento**: Cada `` !`command` `` se ejecuta inmediatamente
3. **Inyección de Salida**: La salida del comando reemplaza el marcador de posición
4. **Carga del Skill**: Claude recibe el contenido completamente renderizado
5. **Ejecución de Tarea**: Claude sigue las instrucciones con los datos inyectados

### Ejemplo de Transformación

**Antes del preprocesamiento (archivo del skill):**
```markdown
Current branch: !`git branch --show-current`
Recent commits: !`git log --oneline -5`

Review these commits for issues.
```

**Después del preprocesamiento (lo que Claude ve):**
```markdown
Current branch: feature/authentication
Recent commits:
a1b2c3d Add login endpoint
d4e5f6g Update user model
g7h8i9j Fix validation bug
j0k1l2m Add tests
m3n4o5p Update docs

Review these commits for issues.
```

## Referencia de Sintaxis

### Sintaxis Básica

```markdown
!`command`
```

**Ejemplos:**
```markdown
!`date`
!`whoami`
!`pwd`
!`git status --short`
```

### Con Argumentos

```markdown
!`command arg1 arg2`
```

**Ejemplos:**
```markdown
!`gh pr diff 123`
!`git log --oneline -n 10`
!`curl https://api.example.com/status`
```

### Combinando con Argumentos del Skill

```markdown
!`command $0`
!`command $ARGUMENTS`
```

**Ejemplos:**
```markdown
# Skill invocado con: /analyze-pr 456
!`gh pr view $0`  # Ejecuta: gh pr view 456

# Skill invocado con: /check-file src/auth.ts
!`cat $ARGUMENTS`  # Ejecuta: cat src/auth.ts
```

### Múltiples Comandos

```markdown
- First: !`command1`
- Second: !`command2`
- Third: !`command3`
```

**Ejemplo:**
```markdown
## Repository Status
- Branch: !`git branch --show-current`
- Status: !`git status --short`
- Last commit: !`git log -1 --oneline`
```

## Ejemplos Completos

### Ejemplo 1: Resumidor de Pull Requests

Inyecta datos de PR en vivo para resúmenes completos.

**.claude/skills/pr-summary/SKILL.md:**
```yaml
---
name: pr-summary
description: Summarize pull request with current data
argument-hint: [pr-number]
context: fork
agent: Explore
allowed-tools: Bash(gh *)
---

# Pull Request Summary Task

## PR Context

### Metadata
- PR Number: $0
- Title: !`gh pr view $0 --json title -q .title`
- Author: !`gh pr view $0 --json author -q .author.login`
- Status: !`gh pr view $0 --json state -q .state`
- Created: !`gh pr view $0 --json createdAt -q .createdAt`

### Changes
!`gh pr diff $0`

### Files Changed
!`gh pr diff $0 --name-only`

### Comments
!`gh pr view $0 --comments`

### Checks Status
!`gh pr checks $0`

## Your Task

Analyze this pull request and provide:

1. **Summary**: What does this PR do? (2-3 sentences)
2. **Key Changes**: Bullet list of main modifications
3. **Potential Issues**: Security, performance, or logic concerns
4. **Testing Recommendations**: What should reviewers test?
5. **Review Comments**: Specific suggestions with file/line references

Be thorough but concise. Focus on actionable feedback.
```

**Uso:**
```
/pr-summary 123
```

**Resultado:** Claude recibe datos de PR completamente poblados y genera un resumen completo.

### Ejemplo 2: Asistente de Commits Inteligente

Inyecta el estado actual de git para sugerir mensajes de commit.

**.claude/skills/smart-commit/SKILL.md:**
```yaml
---
name: smart-commit
description: Generate conventional commit message from staged changes
disable-model-invocation: true
---

# Commit Message Generation

## Current Repository State

### Branch
!`git branch --show-current`

### Staged Changes
!`git diff --cached --stat`

### Full Diff
!`git diff --cached`

### Recent Commits (for style reference)
!`git log --oneline -10`

## Your Task

Based on the staged changes above, generate a conventional commit message:

**Format:**
```
type(scope): Brief description (max 50 chars)

Detailed explanation if needed (wrap at 72 chars).

- Bullet points for multiple changes
- Each on its own line

Refs: #issue-number (if applicable)
```

**Types:** feat, fix, docs, refactor, test, chore, perf, style

**Guidelines:**
1. Use imperative mood ("Add feature" not "Added feature")
2. Be specific about WHAT changed and WHY
3. Reference issue numbers if applicable
4. Match the style of recent commits

Generate the commit message now.
```

**Uso:**
```
/smart-commit
```

**Resultado:** Claude ve los cambios staged reales y genera un mensaje de commit apropiado.

### Ejemplo 3: Diagnósticos de Sistema

Inyecta el estado del sistema para resolución de problemas.

**.claude/skills/diagnose-system/SKILL.md:**
```yaml
---
name: diagnose-system
description: Diagnose system performance issues
context: fork
agent: Explore
---

# System Diagnostics

## Current System State

### Resource Usage
**Memory:**
!`free -h`

**Disk:**
!`df -h`

**CPU:**
!`top -bn1 | head -15`

### Active Services
!`systemctl --type=service --state=running`

### Recent Errors
**System logs (last 50 lines):**
!`journalctl -n 50 --no-pager`

**Application logs:**
!`tail -50 /var/log/application.log`

### Network Status
!`netstat -tulpn | grep LISTEN`

## Your Task

Analyze the system state above and:

1. **Identify Issues**: What's causing problems?
2. **Resource Analysis**: Any bottlenecks (CPU, memory, disk)?
3. **Service Status**: Are all expected services running?
4. **Error Patterns**: Any recurring errors in logs?
5. **Recommendations**: Specific actions to resolve issues

Prioritize by severity (Critical, High, Medium, Low).
```

**Uso:**
```
/diagnose-system
```

**Resultado:** Diagnósticos de sistema en tiempo real analizados por Claude.

### Ejemplo 4: Dashboard de Estado de API

Inyecta datos de salud de API en vivo.

**.claude/skills/api-status/SKILL.md:**
```yaml
---
name: api-status
description: Check API health and generate status report
context: fork
---

# API Health Check

## Endpoint Status

### Authentication Service
!`curl -s -o /dev/null -w "%{http_code}" https://api.example.com/health/auth`

### User Service
!`curl -s -o /dev/null -w "%{http_code}" https://api.example.com/health/users`

### Payment Service
!`curl -s -o /dev/null -w "%{http_code}" https://api.example.com/health/payments`

## Response Times
!`curl -s -w "\nTime: %{time_total}s\n" https://api.example.com/health`

## Database Status
!`curl -s https://api.example.com/health/database`

## Recent Error Logs
!`tail -100 logs/api-errors.log | grep ERROR`

## Your Task

Generate a status report:

1. **Overall Health**: All services operational?
2. **Performance**: Are response times acceptable?
3. **Database**: Any connection issues?
4. **Recent Errors**: Patterns or critical issues?
5. **Recommendations**: Immediate actions needed?

Use this format:
- 🟢 Healthy
- 🟡 Degraded
- 🔴 Down
```

**Uso:**
```
/api-status
```

**Resultado:** Reporte de salud de API en vivo con datos actuales.

### Ejemplo 5: Configuración de Entorno

Inyecta configuraciones específicas del entorno.

**.claude/skills/deploy-config/SKILL.md:**
```yaml
---
name: deploy-config
description: Generate deployment configuration
argument-hint: [environment]
disable-model-invocation: true
---

# Deployment Configuration

## Environment: $0

### Current Configuration
!`cat config/$0.env`

### Infrastructure State
!`terraform workspace select $0 && terraform show`

### Active Services
!`kubectl get pods -n $0`

### Recent Deployments
!`kubectl rollout history deployment -n $0`

## Your Task

Validate the deployment configuration for **$0**:

1. **Configuration Check**: Are all required variables set?
2. **Infrastructure**: Is infrastructure in expected state?
3. **Services**: Are all required services running?
4. **Recent Changes**: Any recent failed deployments?
5. **Readiness**: Is environment ready for deployment?

Provide a GO/NO-GO decision with specific reasons.
```

**Uso:**
```
/deploy-config staging
```

**Resultado:** Verificación de preparación de despliegue específica del entorno.

## Mejores Prácticas

### 1. Solo Comandos Rápidos

✅ **SÍ:** Usar comandos rápidos (< 2 segundos):

```markdown
!`git status --short`
!`gh pr view $0 --json title`
!`cat config.json`
```

❌ **NO:** Usar comandos lentos (bloquea la carga del skill):

```markdown
!`npm install`  # Demasiado lento
!`docker build .`  # Demasiado lento
!`pytest`  # Demasiado lento
```

### 2. Comandos Idempotentes

✅ **SÍ:** Usar comandos de solo lectura, sin efectos secundarios:

```markdown
!`git log -5`
!`curl -s https://api.example.com/status`
!`cat file.txt`
```

❌ **NO:** Usar comandos con efectos secundarios:

```markdown
!`git commit -m "Auto commit"`  # Modifica estado
!`rm -rf temp/`  # Destructivo
!`curl -X POST https://api.example.com/deploy`  # Efectos secundarios
```

### 3. Manejo de Errores

✅ **SÍ:** Proporcionar contexto alternativo si el comando falla:

```markdown
## PR Status
!`gh pr view $0 2>/dev/null || echo "PR not found or gh not authenticated"`
```

✅ **SÍ:** Usar comandos que fallen con gracia:

```markdown
!`git log -5 2>/dev/null || echo "No git repository"`
```

### 4. Consideraciones de Seguridad

✅ **SÍ:** Evitar exponer secretos:

```markdown
# Bien - solo muestra si la variable existe
!`echo "API configured: ${API_KEY:+YES}"`

# Mal - expone secreto
!`echo $API_KEY`
```

✅ **SÍ:** Sanitizar entrada del usuario:

```markdown
# Validar que el argumento es un número
!`[[ "$0" =~ ^[0-9]+$ ]] && gh pr view $0 || echo "Invalid PR number"`
```

### 5. Formato de Salida

✅ **SÍ:** Formatear salida para legibilidad:

```markdown
!`git log --oneline --graph -10`  # Log formateado
!`jq '.' config.json`  # JSON bonito
!`df -h`  # Tamaños legibles para humanos
```

### 6. Combinar con Restricciones de Herramientas

✅ **SÍ:** Restringir herramientas al usar contexto dinámico:

```yaml
---
allowed-tools: Bash(gh *), Bash(git *)
---

!`gh pr diff`
!`git status`
```

**Previene:** Que Claude ejecute comandos bash arbitrarios después del preprocesamiento.

## Compatibilidad de Plataforma

### Claude Code

| Característica | Soporte |
|----------------|---------|
| Sintaxis `` !`command` `` | ✅ Soporte completo |
| Ejecución de comandos shell | ✅ Soporte completo |
| Sustituciones de cadenas | ✅ Soporte completo |
| Manejo de errores | ✅ Soporte completo |

### Otras Plataformas

**Cursor, Gemini CLI, Antigravity:**
- Consultar documentación específica de la plataforma
- El contexto dinámico puede no ser soportado
- La sintaxis puede diferir o no estar disponible
- Probar exhaustivamente en la plataforma objetivo

## Errores Comunes

### 1. Comandos Lentos

❌ **Problema:**

```markdown
!`npm test`  # Toma 30 segundos
```

**Problema:** Bloquea la carga del skill, mala experiencia del usuario.

✅ **Solución:** Usar comandos rápidos o ejecutar tests por separado.

### 2. Comandos con Efectos Secundarios

❌ **Problema:**

```markdown
!`git commit -m "Auto commit"`
```

**Problema:** Cada invocación del skill crea un commit.

✅ **Solución:** Usar solo comandos de solo lectura.

### 3. Argumentos Sin Comillas

❌ **Problema:**

```markdown
!`cat $ARGUMENTS`  # Si el argumento tiene espacios: cat my file.txt
```

**Problema:** Se rompe con argumentos que tienen espacios.

✅ **Solución:** Entrecomillar argumentos:

```markdown
!`cat "$ARGUMENTS"`
```

### 4. Falta de Manejo de Errores

❌ **Problema:**

```markdown
!`gh pr view $0`  # Falla si gh no está autenticado
```

**Problema:** El skill falla silenciosamente o muestra error confuso.

✅ **Solución:** Agregar fallback:

```markdown
!`gh pr view $0 2>/dev/null || echo "Error: gh not authenticated or PR not found"`
```

### 5. Exposición de Secretos

❌ **Problema:**

```markdown
!`echo $DATABASE_PASSWORD`
```

**Problema:** Secretos visibles en el contenido del skill.

✅ **Solución:** Nunca inyectar secretos. Usar verificaciones de existencia:

```markdown
!`echo "Database configured: ${DATABASE_PASSWORD:+YES}"`
```

## Solución de Problemas

### Comandos No se Ejecutan

**Problema:** `` !`command` `` aparece literalmente en la salida.

**Diagnóstico:**
1. Verificar que la sintaxis sea exactamente `` !`command` `` (backticks, no comillas)
2. Verificar que la plataforma soporte contexto dinámico
3. Buscar errores de sintaxis en el comando

**Solución:**
```markdown
# Incorrecto
!'command'  # Comillas simples
!`command'  # Comillas no coincidentes

# Correcto
!`command`
```

### Comando Falla Silenciosamente

**Problema:** Sin salida de `` !`command` ``.

**Diagnóstico:**
1. Ejecutar comando manualmente para verificar errores
2. Agregar redirección de salida de error: `2>&1`
3. Verificar que el comando esté en PATH

**Solución:**
```markdown
# Versión de debug
!`command 2>&1 || echo "Command failed"`
```

### Formato de Salida Inesperado

**Problema:** La salida del comando no se formatea bien.

**Diagnóstico:**
1. Verificar si la salida tiene saltos de línea o formato no deseados
2. Probar salida del comando manualmente
3. Agregar herramientas de formato (jq, awk, sed)

**Solución:**
```markdown
# Formatear JSON
!`curl -s https://api.example.com | jq '.'`

# Formatear líneas
!`git log --oneline -5`

# Eliminar espacios en blanco extra
!`command | tr -s ' '`
```

## Documentación Relacionada

- [Skills in Claude Code](../claude-code.md) - Referencia completa de skills
- [Subagent Integration](subagents-integration.md) - Skills con subagentes
- [Tool Restrictions](tool-restrictions.md) - Control de acceso a herramientas
- [String Substitutions](../02-fundamentals/arguments-substitutions.md) - Sintaxis `$ARGUMENTS`

## Lecturas Adicionales

- **Documentación Oficial:** [code.claude.com/docs/en/skills](https://code.claude.com/docs/en/skills)
- **Referencia de Comandos Shell:** [GNU Bash Manual](https://www.gnu.org/software/bash/manual/)
- **GitHub CLI:** [cli.github.com](https://cli.github.com/)

---

**Última Actualización:** Febrero 2026
**Categoría:** Skills - Advanced
**Plataforma:** Claude Code
