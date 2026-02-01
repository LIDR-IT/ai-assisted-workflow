# Referencia de Campos Frontmatter en SKILL.md

## Descripción General

Este documento proporciona una referencia completa de todos los campos frontmatter disponibles en archivos SKILL.md. El frontmatter es metadata YAML colocada entre marcadores `---` en la parte superior de un archivo SKILL.md que controla el comportamiento, invocación e integración de plataforma de la skill.

**Ejemplo Básico:**
```yaml
---
name: skill-name
description: Qué hace esta skill y cuándo usarla
version: 1.0.0
---
```

**Todos los campos frontmatter son opcionales**, aunque `name` y `description` son fuertemente recomendados para el descubrimiento apropiado y activación de skills.

---

## Referencia de Campos

### name

**Tipo:** `string`

**Requerido:** No (usa el nombre del directorio si se omite)

**Por Defecto:** Nombre del directorio que contiene SKILL.md

**Soporte de Plataforma:**
- Claude Code: ✅ Soporte completo
- Antigravity: ✅ Soporte completo
- Cross-platform: ✅ Recomendado

**Propósito:**

Nombre para mostrar e identificador para la skill. Se usa en menús de comandos slash, descubrimiento de skills y cuando Claude hace referencia a la skill.

**Formato:**
- Solo letras minúsculas, números y guiones
- Sin espacios o caracteres especiales (excepto guiones)
- Máximo 64 caracteres
- Usar convención kebab-case
- Guiones bajos no recomendados

**Ejemplos:**

✅ **Nombres válidos:**
```yaml
name: react-component-generator
name: api-security-audit
name: deploy-prod
name: fix-issue
name: pdf-editor
```

❌ **Nombres inválidos:**
```yaml
name: React Component Generator  # Espacios no permitidos
name: api_security_audit         # Guiones bajos no recomendados
name: DeployProd                 # Mayúsculas no permitidas
name: fix/issue                  # Barras no permitidas
name: skill-with-an-extremely-long-name-that-exceeds-the-sixty-four-character-limit  # Demasiado largo
```

**Errores Comunes:**
- Usar espacios en lugar de guiones
- Incluir letras mayúsculas
- Omitir name y depender del directorio (explícito es mejor)
- Usar guiones bajos (funciona pero es inconsistente)

**Mejores Prácticas:**

Siempre establecer `name` explícitamente aunque por defecto use el nombre del directorio. Esto hace que la skill sea autodocumentada y portable.

```yaml
# Bien - explícito y claro
name: code-review

# Funciona pero implícito
# (sin campo name, usa el directorio "code-review")
```

---

### description

**Tipo:** `string`

**Requerido:** No (usa el primer párrafo del contenido markdown si se omite)

**Por Defecto:** Primer párrafo del cuerpo de SKILL.md

**Soporte de Plataforma:**
- Claude Code: ✅ Crítico para auto-invocación
- Antigravity: ✅ Soporte completo
- Cross-platform: ✅ Esencial

**Propósito:**

**Campo más importante** para activación de skills. Claude usa esto para decidir cuándo invocar automáticamente la skill. Actúa como el algoritmo de coincidencia entre la intención del usuario y la activación de la skill.

**Formato:**
- Incluir 2-4 frases disparadoras concretas que los usuarios dirían naturalmente
- Ser específico, no genérico
- Usar voz en tercera persona: "Esta skill debe usarse cuando..."
- Incluir palabras clave y variaciones
- Longitud: 1-3 oraciones (priorizar claridad sobre brevedad)

**Fórmula:** `[Acción] [Objetivo] [Contexto] cuando [Condiciones de activación]`

**Ejemplos:**

✅ **Descripciones excelentes (disparadores específicos):**

```yaml
# Hooks skill - frases concretas
description: Esta skill debe usarse cuando el usuario pide "crear un hook", "añadir un hook PreToolUse", "validar uso de herramientas", o "implementar validación de hook"

# Generador de componentes - casos de uso claros
description: Genera componentes funcionales React con TypeScript, hooks y tests. Usar cuando se crean nuevos componentes React o se convierten componentes de clase.

# Migraciones de base de datos - condiciones específicas
description: Valida migraciones de esquema de base de datos para consistencia y seguridad. Usar cuando se revisan archivos de migración o antes de aplicar cambios a base de datos.

# Explicación de código - disparadores naturales
description: Explica código con diagramas visuales y analogías. Usar cuando se explica cómo funciona el código, se enseña sobre un codebase, o cuando el usuario pregunta "¿cómo funciona esto?"
```

❌ **Descripciones pobres (demasiado vagas):**

```yaml
# Demasiado genérico
description: Ayuda con código

# Sin disparadores
description: Herramientas de base de datos

# Sin contexto
description: Proporciona guía para hooks

# Demasiado amplio
description: Asistencia general de desarrollo
```

**Coincidencia de Disparadores:**

Claude compara la entrada del usuario con descripciones para decidir qué skills cargar. Incluye frases que los usuarios realmente escribirían o dirían:

```yaml
# Usuario dice: "crear un componente React"
# Coincide con: "creando nuevos componentes React"
description: Genera componentes funcionales React. Usar cuando se crean nuevos componentes React.

# Usuario dice: "¿cómo funciona la autenticación?"
# Coincide con: "cómo funciona esto"
description: Explica código. Usar cuando el usuario pregunta "¿cómo funciona esto?"
```

**Errores Comunes:**
- Ser demasiado vago o genérico
- No incluir frases disparadoras
- Escribir desde perspectiva incorrecta (primera/segunda persona)
- Olvidar incluir variaciones que los usuarios podrían decir

**Mejores Prácticas:**

Prueba tu descripción preguntando "¿Diría un usuario naturalmente estas frases exactas?" Incluye las variaciones más comunes.

```yaml
# Incluir múltiples variaciones de disparadores
description: Esta skill debe usarse cuando el usuario pide "arreglar un bug", "depurar un problema", "resolver un problema", o "solucionar errores"
```

---

### version

**Tipo:** `string`

**Requerido:** No

**Por Defecto:** Sin seguimiento de versión

**Soporte de Plataforma:**
- Claude Code: ✅ Soportado
- Antigravity: ✅ Soportado
- Cross-platform: ✅ Recomendado

**Propósito:**

Rastrear versiones de skills usando versionado semántico. Ayuda a mantener compatibilidad, documentar cambios y gestionar evolución de skills.

**Formato:**

Versionado semántico: `MAJOR.MINOR.PATCH`
- `MAJOR`: Cambios incompatibles, actualizaciones que rompen compatibilidad
- `MINOR`: Nuevas características, compatible hacia atrás
- `PATCH`: Correcciones de bugs, mejoras menores

**Ejemplos:**

```yaml
# Desarrollo inicial
version: 0.1.0
version: 0.2.1
version: 0.9.5

# Releases estables
version: 1.0.0
version: 1.2.3
version: 2.0.0
```

**Ejemplo de Evolución de Versión:**

```yaml
# Release inicial
version: 1.0.0

# Añadir nueva característica (compatible hacia atrás)
version: 1.1.0

# Corrección de bug
version: 1.1.1

# Cambio incompatible (nuevo API)
version: 2.0.0
```

**Errores Comunes:**
- Usar versiones no semánticas (v1, 1.0, 1.x)
- No actualizar versión al hacer cambios
- Saltar números de versión sin razón

**Mejores Prácticas:**

Comenzar en `0.1.0` para desarrollo inicial, mover a `1.0.0` cuando esté estable. Actualizar versión con cada cambio significativo.

```yaml
# Desarrollo
version: 0.1.0  # Primera versión funcional
version: 0.2.0  # Añadidas nuevas capacidades
version: 1.0.0  # Listo para producción

# Producción
version: 1.1.0  # Añadidos ejemplos
version: 1.1.1  # Corregidos errores tipográficos
version: 2.0.0  # Cambiada estructura de skill
```

---

### argument-hint

**Tipo:** `string`

**Requerido:** No

**Por Defecto:** Sin pista mostrada

**Soporte de Plataforma:**
- Claude Code: ✅ Soporte completo (muestra en autocompletado)
- Antigravity: ⚠️ Soporte limitado
- Cross-platform: ⚠️ Específico de Claude Code

**Propósito:**

Texto de pista mostrado durante el autocompletado de comandos slash. Ayuda a los usuarios a entender qué argumentos espera la skill.

**Formato:**
- Texto de placeholder breve
- Usar ángulos `<>` para argumentos requeridos
- Usar corchetes `[]` para argumentos opcionales
- Separar múltiples argumentos con espacios
- Mantener conciso (se muestra en UI)

**Ejemplos:**

```yaml
# Argumento único requerido
argument-hint: <issue-number>
argument-hint: <component-name>
argument-hint: <file-path>

# Argumentos opcionales
argument-hint: [filename]
argument-hint: [environment]

# Múltiples argumentos
argument-hint: <source> <target>
argument-hint: [filename] [format]
argument-hint: <component-name> [variant]

# Patrones complejos
argument-hint: <issue-number> [branch-name]
argument-hint: <from-framework> <to-framework>
```

**Integración UI:**

Cuando el usuario escribe `/skill-name`, Claude Code muestra:
```
/skill-name <issue-number>
            ^^^^^^^^^^^^^^
            argument-hint aparece aquí
```

**Errores Comunes:**
- Ser demasiado verboso (usar placeholders cortos)
- No indicar requerido vs opcional
- Faltar pistas para skills que toman argumentos

**Mejores Prácticas:**

Siempre proporcionar pistas para skills que esperan argumentos. Usar placeholders descriptivos pero concisos.

```yaml
# Bien - claro y conciso
argument-hint: <issue-number>

# Demasiado verboso
argument-hint: <el número de issue de GitHub a arreglar>

# Demasiado críptico
argument-hint: <num>
```

**Ejemplo Completo:**

```yaml
---
name: fix-issue
description: Arreglar un issue de GitHub por número
argument-hint: <issue-number>
---

Arreglar issue de GitHub $0 siguiendo estándares de código.
```

**Invocación:** `/fix-issue 123`

---

### disable-model-invocation

**Tipo:** `boolean`

**Requerido:** No

**Por Defecto:** `false` (Claude puede auto-invocar)

**Soporte de Plataforma:**
- Claude Code: ✅ Soporte completo
- Antigravity: ⚠️ Soporte limitado
- Cross-platform: ⚠️ Específico de Claude Code

**Propósito:**

Prevenir que Claude cargue automáticamente la skill. Cuando es `true`, la skill **solo** puede invocarse manualmente vía comando `/skill-name`. Crítico para operaciones con efectos secundarios o que requieren control de tiempo preciso.

**Casos de Uso:**

**Establecer a `true` para:**
- Operaciones de deployment
- Commits y pushes de Git
- Envío de emails/notificaciones
- Migraciones de base de datos
- Transacciones financieras
- Cualquier operación destructiva
- Flujos de trabajo que requieren confirmación del usuario
- Operaciones sensibles al tiempo

**Dejar como `false` para:**
- Guías de revisión de código
- Patrones de arquitectura
- Referencia de conocimiento
- Generación de código (no destructiva)
- Análisis y exploración

**Ejemplos:**

```yaml
# Deployment - solo manual
---
name: deploy
description: Desplegar aplicación a producción
disable-model-invocation: true
---

# Git commit - solo manual
---
name: commit
description: Crear y hacer push de commit Git
disable-model-invocation: true
---

# Enviar notificación - solo manual
---
name: notify-team
description: Enviar mensaje de Slack al equipo
disable-model-invocation: true
---

# Revisión de código - puede auto-invocar
---
name: code-review
description: Revisar código para bugs y mejores prácticas
disable-model-invocation: false  # o omitir (por defecto)
---
```

**Comportamiento:**

| Valor | Usuario Puede Invocar | Claude Puede Invocar | Descripción en Contexto |
|:------|:---------------------|:--------------------|:----------------------|
| `false` (defecto) | ✅ Sí (`/skill-name`) | ✅ Sí (auto) | ✅ Cargado |
| `true` | ✅ Sí (`/skill-name`) | ❌ No | ❌ No cargado |

**Importante:** Cuando `disable-model-invocation: true`, la descripción de la skill **NO** se carga en el contexto de Claude. Claude no tiene conocimiento de que la skill existe a menos que la invoques manualmente.

**Errores Comunes:**
- Permitir auto-invocación de operaciones destructivas
- Establecer `true` para skills de referencia de solo lectura (deberían auto-cargarse)
- Confundir con `user-invocable` (propósito diferente)

**Mejores Prácticas:**

Siempre establecer `disable-model-invocation: true` para operaciones con efectos secundarios. Mejor requerir invocación explícita que arriesgar ejecución accidental.

```yaml
# Cualquier cosa que cambie estado fuera de la conversación
---
name: deploy-prod
disable-model-invocation: true
---

# Cualquier cosa que envíe mensajes externos
---
name: send-email
disable-model-invocation: true
---

# Cualquier cosa que haga commits o pushes de código
---
name: git-push
disable-model-invocation: true
---
```

---

### user-invocable

**Tipo:** `boolean`

**Requerido:** No

**Por Defecto:** `true` (aparece en menú `/`)

**Soporte de Plataforma:**
- Claude Code: ✅ Soporte completo
- Antigravity: ⚠️ Soporte limitado
- Cross-platform: ⚠️ Específico de Claude Code

**Propósito:**

Controlar visibilidad en el menú de comandos slash. Cuando es `false`, la skill se oculta del autocompletado `/` pero Claude aún puede invocarla automáticamente. Usar para conocimiento de fondo o contexto que los usuarios no deberían invocar directamente.

**Casos de Uso:**

**Establecer a `false` para:**
- Conocimiento de fondo (estándares de código, documentación de arquitectura)
- Contexto cargado automáticamente por otras skills
- Material de referencia no accionable como comando
- Documentación de sistemas legacy
- Skills deprecadas (transición de usuarios)

**Dejar como `true` para:**
- Comandos accionables que los usuarios invocarían
- Flujos de trabajo que los usuarios disparan directamente
- Cualquier skill que los usuarios deberían conocer

**Ejemplos:**

```yaml
# Conocimiento de fondo - oculto del menú
---
name: legacy-system-context
description: Documentación para sistema legacy
user-invocable: false
---

# Patrones de arquitectura - oculto
---
name: internal-architecture
description: Guías de arquitectura interna
user-invocable: false
---

# Comando accionable - visible en menú
---
name: generate-component
description: Generar componente React
user-invocable: true  # o omitir (por defecto)
---
```

**Comportamiento:**

| Valor | En Menú `/` | Claude Puede Auto-Invocar | Descripción en Contexto |
|:------|:-----------|:--------------------------|:----------------------|
| `true` (defecto) | ✅ Visible | ✅ Sí | ✅ Cargado |
| `false` | ❌ Oculto | ✅ Sí | ✅ Cargado |

**Interacción con disable-model-invocation:**

| user-invocable | disable-model-invocation | Usuario Invoca | Claude Invoca | En Menú |
|:---------------|:-------------------------|:---------------|:--------------|:--------|
| `true` (defecto) | `false` (defecto) | ✅ | ✅ | ✅ |
| `true` | `true` | ✅ | ❌ | ✅ |
| `false` | `false` | ❌ | ✅ | ❌ |
| `false` | `true` | ❌ | ❌ | ❌ |

**Errores Comunes:**
- Ocultar skills que los usuarios querrían invocar directamente
- Establecer `false` para todas las skills (derrota la descubribilidad)
- Confundir con `disable-model-invocation`

**Mejores Prácticas:**

Solo establecer `user-invocable: false` para skills que son conocimiento puramente contextual. Si los usuarios podrían querer invocarla, mantenerla visible.

```yaml
# Bien - contexto de fondo
---
name: codebase-conventions
description: Convenciones de código internas
user-invocable: false
---

# Mal - los usuarios podrían querer esto
---
name: explain-code
description: Explicar código con diagramas
user-invocable: false  # ¡Debería ser true - los usuarios quieren esto!
---
```

---

### allowed-tools

**Tipo:** `string` (nombres de herramientas separados por comas)

**Requerido:** No

**Por Defecto:** Sin aprobaciones automáticas (todas las herramientas requieren permiso)

**Soporte de Plataforma:**
- Claude Code: ✅ Soporte completo
- Antigravity: ❌ No soportado
- Cross-platform: ❌ Solo Claude Code

**Propósito:**

Pre-aprobar herramientas específicas que Claude puede usar sin pedir permiso cuando esta skill está activa. Reduce fricción para operaciones seguras y esperadas mientras mantiene seguridad para otras.

**Formato:**
- Nombres de herramientas separados por comas
- Patrones opcionales con paréntesis
- Nombres de herramientas sensibles a mayúsculas
- Sin comillas alrededor de nombres de herramientas

**Herramientas Disponibles:**
- `Read` - Leer archivos
- `Write` - Escribir archivos
- `Edit` - Editar archivos
- `Grep` - Buscar contenidos de archivos
- `Glob` - Encontrar archivos por patrón
- `Bash` - Ejecutar comandos bash (con restricciones de patrón)

**Ejemplos:**

```yaml
# Herramientas de solo lectura
allowed-tools: Read, Grep, Glob

# Con patrones bash
allowed-tools: Bash(npm *), Bash(git status)

# Múltiples herramientas con patrones
allowed-tools: Read, Write, Bash(python scripts/*)

# Todas las operaciones de lectura
allowed-tools: Read, Grep, Glob, Bash(cat *), Bash(ls *)

# Herramientas de desarrollo
allowed-tools: Bash(npm test), Bash(npm run build)
```

**Sintaxis de Patrones:**

```yaml
# Comando exacto
allowed-tools: Bash(git status)

# Wildcard prefijo
allowed-tools: Bash(npm *)

# Wildcard sufijo
allowed-tools: Bash(* --dry-run)

# Restricciones de ruta
allowed-tools: Bash(python scripts/*)
```

**Consideraciones de Seguridad:**

**Pre-aprobaciones seguras:**
```yaml
# Operaciones de solo lectura
allowed-tools: Read, Grep, Glob

# Operaciones git seguras
allowed-tools: Bash(git status), Bash(git diff), Bash(git log)

# npm no destructivo
allowed-tools: Bash(npm list), Bash(npm outdated)
```

**Pre-aprobaciones riesgosas:**
```yaml
# DEMASIADO AMPLIO - no hacer esto
allowed-tools: Bash(*)

# PELIGROSO - escritura sin restricción
allowed-tools: Write

# INSEGURO - bash sin restricción
allowed-tools: Bash
```

**Errores Comunes:**
- Aprobar `Bash(*)` (demasiado amplio)
- No restringir operaciones de escritura
- Permitir comandos destructivos sin patrones
- Olvidar implicaciones de seguridad

**Mejores Prácticas:**

Solo pre-aprobar herramientas que estarías cómodo que Claude use sin preguntar. En caso de duda, no pre-aprobar.

```yaml
# Bien - operaciones específicas y seguras
---
name: codebase-explorer
allowed-tools: Read, Grep, Glob, Bash(git log)
---

# Bien - patrones restringidos
---
name: test-runner
allowed-tools: Bash(npm test), Bash(npm run test:*)
---

# Mal - demasiado permisivo
---
name: general-helper
allowed-tools: Bash(*), Write, Edit  # ¡No hacer esto!
---
```

**Ejemplo Completo:**

```yaml
---
name: safe-analyzer
description: Analizar codebase sin hacer cambios
allowed-tools: Read, Grep, Glob
---

Explorar el codebase para responder preguntas. No puedes modificar archivos.
```

---

### model

**Tipo:** `string`

**Requerido:** No

**Por Defecto:** Selección de modelo actual del usuario

**Soporte de Plataforma:**
- Claude Code: ✅ Soporte completo
- Antigravity: ❌ No soportado
- Cross-platform: ❌ Solo Claude Code

**Propósito:**

Sobrescribir selección de modelo cuando esta skill está activa. Usar modelos más rápidos para tareas simples o modelos más capaces para análisis complejos.

**Opciones:**
- `sonnet` - Claude 3.5 Sonnet (balanceado, recomendado)
- `opus` - Claude Opus 4.5 (más capaz, más lento, costoso)
- `haiku` - Claude 3.5 Haiku (más rápido, más barato, menos capaz)

**Casos de Uso:**

**Usar `haiku` para:**
- Formateo simple de código
- Validación de sintaxis
- Verificaciones rápidas
- Llenado de plantillas
- Tareas determinísticas

**Usar `sonnet` para:**
- La mayoría de tareas de desarrollo (por defecto)
- Rendimiento/capacidad balanceado
- Trabajo de propósito general

**Usar `opus` para:**
- Decisiones arquitectónicas complejas
- Análisis profundo de código
- Resolución de problemas novedosos
- Investigación y exploración
- Revisiones de seguridad críticas

**Ejemplos:**

```yaml
# Validación simple - usar modelo rápido
---
name: format-check
description: Verificar formateo de código
model: haiku
---

# Análisis complejo - usar el más capaz
---
name: architecture-review
description: Revisar arquitectura del sistema
model: opus
---

# Tarea balanceada - por defecto está bien
---
name: generate-component
description: Generar componente React
# model: sonnet  # Por defecto, puede omitir
---
```

**Rendimiento vs Costo:**

| Modelo | Velocidad | Costo | Capacidad | Usar Para |
|:-------|:---------|:------|:----------|:----------|
| `haiku` | Más rápido | Más bajo | Bueno | Tareas simples y determinísticas |
| `sonnet` | Rápido | Medio | Excelente | La mayoría del trabajo de desarrollo |
| `opus` | Más lento | Más alto | Mejor | Problemas complejos y novedosos |

**Errores Comunes:**
- Usar `opus` para tareas simples (costoso)
- Usar `haiku` para razonamiento complejo (insuficiente)
- No considerar implicaciones de costo
- Sobrescribir modelo innecesariamente

**Mejores Prácticas:**

Solo especificar `model` cuando tengas una razón clara. Dejar que los usuarios elijan para la mayoría de skills.

```yaml
# Bien - tarea simple se beneficia de velocidad
---
name: quick-validator
model: haiku
---

# Bien - tarea compleja necesita capacidad
---
name: deep-analyzer
model: opus
---

# Innecesario - dejar que el usuario decida
---
name: general-task
model: sonnet  # Puede omitir esto
---
```

---

### context

**Tipo:** `string`

**Requerido:** No

**Por Defecto:** Se ejecuta en línea en conversación actual

**Soporte de Plataforma:**
- Claude Code: ✅ Soporte completo
- Antigravity: ❌ No soportado
- Cross-platform: ❌ Solo Claude Code

**Propósito:**

Ejecutar skill en contexto de subagente aislado (conversación bifurcada). Cuando se establece a `fork`, crea nueva conversación sin historial, ejecuta la skill y devuelve resultados a la conversación principal.

**Opciones:**
- (omitir) - Por defecto, ejecución en línea
- `fork` - Ejecución de subagente aislado

**Casos de Uso:**

**Usar `context: fork` para:**
- Tareas autocontenidas con instrucciones explícitas
- Investigación y exploración (mantiene conversación principal limpia)
- Operaciones pesadas (mucha lectura de archivos)
- Tareas que requieren contexto fresco
- Flujos de trabajo que deben ejecutarse independientemente

**NO usar `context: fork` para:**
- Skills que contienen solo guías (sin tarea accionable)
- Skills que requieren contexto de conversación
- Operaciones rápidas en línea
- Skills que asisten trabajo actual

**Ejemplos:**

```yaml
# Skill de investigación - ejecución aislada
---
name: deep-research
description: Investigar un tema exhaustivamente
context: fork
agent: Explore
---

Investigar $ARGUMENTS exhaustivamente:
1. Encontrar archivos relevantes usando Glob y Grep
2. Leer y analizar el código
3. Identificar patrones y convenciones
4. Resumir hallazgos

# Deployment - flujo de trabajo aislado
---
name: deploy
description: Desplegar a producción
context: fork
disable-model-invocation: true
---

Desplegar $ARGUMENTS:
1. Ejecutar suite de tests
2. Construir aplicación
3. Push a deployment
4. Verificar éxito

# Revisión de código - en línea (sin fork)
---
name: code-review
description: Revisar código para problemas
# Sin campo context - ejecuta en línea
---

Revisar para:
- Problemas de seguridad
- Problemas de rendimiento
- Mejores prácticas
```

**Flujo de Ejecución:**

**Sin `context: fork` (en línea):**
```
Usuario: "Revisar este código"
 ↓
Contenido de skill añadido a conversación
 ↓
Claude responde en misma conversación
```

**Con `context: fork` (subagente):**
```
Usuario: "/deep-research autenticación"
 ↓
Nuevo contexto aislado creado
 ↓
Contenido de skill se convierte en tarea del subagente
 ↓
Subagente ejecuta independientemente
 ↓
Resultados resumidos de vuelta a conversación principal
```

**Errores Comunes:**
- Usar fork para guías (subagente no tiene tarea)
- Usar fork para operaciones rápidas (overhead no vale la pena)
- No proporcionar tarea explícita en cuerpo de skill
- Esperar que subagente tenga contexto de conversación

**Mejores Prácticas:**

Solo usar `context: fork` cuando el cuerpo de la skill contiene una tarea completa y accionable. Si la skill es guía para trabajo actual, no hacer fork.

```yaml
# Bien - tarea completa para subagente
---
context: fork
---

Investigar el sistema de autenticación:
1. Encontrar todos los archivos relacionados con auth
2. Mapear el flujo de autenticación
3. Identificar mecanismos de seguridad
4. Documentar hallazgos

# Mal - solo guías
---
context: fork  # ¡No hacer fork!
---

Al revisar código, verificar:
- Problemas de seguridad
- Problemas de rendimiento
```

---

### agent

**Tipo:** `string`

**Requerido:** No (solo relevante con `context: fork`)

**Por Defecto:** `general-purpose`

**Soporte de Plataforma:**
- Claude Code: ✅ Soporte completo
- Antigravity: ❌ No soportado
- Cross-platform: ❌ Solo Claude Code

**Propósito:**

Especificar qué tipo de subagente usar cuando `context: fork` está establecido. Diferentes agentes tienen diferentes capacidades, herramientas y prompts de sistema optimizados para tareas específicas.

**Agentes Incorporados:**
- `general-purpose` - Por defecto, capacidades balanceadas
- `Explore` - Optimizado para exploración de codebase
- `Plan` - Optimizado para planificación y desglose de tareas

**Agentes Personalizados:**
- Cualquier agente del directorio `.claude/agents/`
- Usar nombre de archivo sin extensión `.md`

**Ejemplos:**

```yaml
# Usar agente Explore para investigación
---
name: deep-research
context: fork
agent: Explore
---

# Usar agente Plan para desglose de tareas
---
name: plan-feature
context: fork
agent: Plan
---

# Usar agente personalizado
---
name: security-audit
context: fork
agent: security-auditor  # De .claude/agents/security-auditor.md
---

# Agente por defecto (puede omitir)
---
name: general-task
context: fork
# agent: general-purpose  # Por defecto, puede omitir
---
```

**Capacidades de Agentes:**

| Agente | Mejor Para | Herramientas | Características |
|:-------|:-----------|:-------------|:----------------|
| `general-purpose` | Tareas generales | Todas las herramientas estándar | Enfoque balanceado |
| `Explore` | Navegación de codebase | Herramientas enfocadas en lectura | Exploración exhaustiva |
| `Plan` | Flujos de trabajo de planificación | Herramientas de análisis | Pensamiento estratégico |
| Personalizado | Tareas especializadas | Configurado por agente | Específico de dominio |

**Cuándo Elegir:**

**Elegir `Explore` para:**
```yaml
# Investigación de codebase
agent: Explore

# Encontrar patrones a través de archivos
agent: Explore

# Entender arquitectura
agent: Explore
```

**Elegir `Plan` para:**
```yaml
# Desglosar tareas complejas
agent: Plan

# Crear hojas de ruta de implementación
agent: Plan

# Planificación estratégica
agent: Plan
```

**Elegir agente personalizado para:**
```yaml
# Trabajo específico de dominio
agent: database-expert

# Flujos de trabajo especializados
agent: deployment-manager

# Herramientas personalizadas
agent: api-generator
```

**Errores Comunes:**
- Establecer `agent` sin `context: fork` (ignorado)
- Usar agente incorrecto para tipo de tarea
- No entender capacidades de agentes
- Crear agente personalizado cuando uno incorporado funcionaría

**Mejores Prácticas:**

Hacer coincidir agente con tipo de tarea. Usar `Explore` para investigación, `Plan` para planificación, personalizado para necesidades especializadas.

```yaml
# Bien - tarea de investigación usa Explore
---
context: fork
agent: Explore
---
Investigar patrones de autenticación en codebase.

# Bien - planificación usa Plan
---
context: fork
agent: Plan
---
Desglosar implementación de característica en pasos.

# Mal - agente incorrecto para tarea
---
context: fork
agent: Plan  # Debería usar Explore
---
Encontrar todos los archivos relacionados con autenticación.
```

**Ejemplo Completo:**

```yaml
---
name: analyze-architecture
description: Análisis arquitectónico profundo
context: fork
agent: Explore
allowed-tools: Read, Grep, Glob
---

Analizar la arquitectura del sistema:

1. Identificar todos los componentes principales
2. Mapear dependencias entre componentes
3. Encontrar patrones arquitectónicos usados
4. Documentar decisiones de diseño
5. Destacar mejoras potenciales
```

---

### hooks

**Tipo:** `object` (objeto YAML)

**Requerido:** No

**Por Defecto:** Sin hooks con alcance de skill

**Soporte de Plataforma:**
- Claude Code: ✅ Soporte completo
- Antigravity: ❌ No soportado
- Cross-platform: ❌ Solo Claude Code

**Propósito:**

Definir hooks que tienen **alcance al ciclo de vida de esta skill**. Estos hooks solo se ejecutan cuando la skill está activa, a diferencia de los hooks globales que se ejecutan para todas las operaciones.

**Formato:**

```yaml
hooks:
  event-name:
    - run: comando a ejecutar
    - run: otro comando
```

**Eventos Disponibles:**
- `tool-approved` - Después de que se aprueba uso de herramienta
- `tool-rejected` - Después de que se rechaza uso de herramienta
- Otros eventos de hooks (ver documentación de Hooks)

**Ejemplos:**

```yaml
# Registrar cuando se aprueban herramientas durante skill
---
name: audited-workflow
hooks:
  tool-approved:
    - run: echo "Herramienta aprobada: $TOOL_NAME"
---

# Validar después de operaciones de archivo
---
name: validated-editor
hooks:
  tool-approved:
    - run: npm run lint
    - run: npm test
---

# Hooks de múltiples eventos
---
name: comprehensive-tracking
hooks:
  tool-approved:
    - run: echo "Aprobado: $TOOL_NAME"
  tool-rejected:
    - run: echo "Rechazado: $TOOL_NAME"
---
```

**Alcance de Hook:**

**Hooks con alcance de skill (en frontmatter):**
- Solo se ejecutan cuando esta skill está activa
- Aislados al ciclo de vida de la skill
- No afectan otras skills u operaciones

**Hooks globales (en `.claude/hooks/`):**
- Se ejecutan para todas las operaciones
- Comportamiento en todo el sistema
- Afectan todas las operaciones de Claude

**Errores Comunes:**
- Definir hooks sin probar
- Crear hooks con efectos secundarios
- No entender alcance de hooks
- Olvidar que hooks se ejecutan en cada evento coincidente

**Mejores Prácticas:**

Usar hooks con alcance de skill para validaciones o registro específicos de la skill. Mantener hooks ligeros y enfocados.

```yaml
# Bien - validación específica de skill
---
name: safe-editor
hooks:
  tool-approved:
    - run: ./scripts/validate.sh
---

# Mal - demasiado amplio
---
name: my-skill
hooks:
  tool-approved:
    - run: rm -rf node_modules  # ¡Peligroso!
---
```

**Ver También:** Documentación de Hooks para referencia completa de eventos y patrones de hooks.

---

## Matriz de Compatibilidad de Plataforma

| Campo | Claude Code | Antigravity | Cross-Platform | Notas |
|:------|:------------|:------------|:---------------|:------|
| `name` | ✅ Completo | ✅ Completo | ✅ Esencial | Usar kebab-case, máx 64 caracteres |
| `description` | ✅ Completo | ✅ Completo | ✅ Esencial | Crítico para activación |
| `version` | ✅ Completo | ✅ Completo | ✅ Recomendado | Usar versionado semántico |
| `argument-hint` | ✅ Completo | ⚠️ Limitado | ⚠️ Opcional | Muestra en autocompletado Claude Code |
| `disable-model-invocation` | ✅ Completo | ⚠️ Limitado | ⚠️ Opcional | Previene auto-carga |
| `user-invocable` | ✅ Completo | ⚠️ Limitado | ⚠️ Opcional | Controla visibilidad de menú |
| `allowed-tools` | ✅ Completo | ❌ Ninguno | ❌ Solo CC | Pre-aprobar herramientas específicas |
| `model` | ✅ Completo | ❌ Ninguno | ❌ Solo CC | Sobrescribir selección de modelo |
| `context` | ✅ Completo | ❌ Ninguno | ❌ Solo CC | Fork a subagente |
| `agent` | ✅ Completo | ❌ Ninguno | ❌ Solo CC | Especificar tipo de subagente |
| `hooks` | ✅ Completo | ❌ Ninguno | ❌ Solo CC | Hooks con alcance de skill |

**Leyenda:**
- ✅ Completo: Completamente soportado
- ⚠️ Limitado: Soporte parcial o comportamiento diferente
- ❌ Ninguno: No soportado

---

## Patrones de Combinación de Campos

### Patrón 1: Flujo de Trabajo Solo Manual

```yaml
---
name: deploy-prod
description: Desplegar aplicación a producción
argument-hint: <environment>
disable-model-invocation: true
context: fork
---
```

**Usar para:** Operaciones que requieren activación explícita del usuario (deployments, commits).

---

### Patrón 2: Referencia Auto-Invocada

```yaml
---
name: code-conventions
description: Estándares de código y mejores prácticas. Usar cuando se escribe código nuevo.
version: 1.0.0
---
```

**Usar para:** Conocimiento que debería auto-cargarse cuando sea relevante.

---

### Patrón 3: Contexto de Fondo Oculto

```yaml
---
name: legacy-system-docs
description: Documentación de sistema legacy
user-invocable: false
version: 2.1.0
---
```

**Usar para:** Contexto cargado automáticamente por otras skills, no de cara al usuario.

---

### Patrón 4: Tarea de Investigación Aislada

```yaml
---
name: deep-analysis
description: Análisis exhaustivo de codebase
argument-hint: <topic>
context: fork
agent: Explore
allowed-tools: Read, Grep, Glob
---
```

**Usar para:** Exploración pesada que debería ejecutarse independientemente.

---

### Patrón 5: Explorador Seguro de Solo Lectura

```yaml
---
name: code-explorer
description: Explorar código sin modificaciones. Usar cuando se aprende codebase.
allowed-tools: Read, Grep, Glob
model: haiku
---
```

**Usar para:** Exploración rápida y segura con operaciones de lectura pre-aprobadas.

---

### Patrón 6: Skill de Característica Completa

```yaml
---
name: component-generator
description: Generar componentes React con tests. Usar cuando se crean componentes.
version: 1.2.0
argument-hint: <component-name>
model: sonnet
hooks:
  tool-approved:
    - run: npm run lint
---
```

**Usar para:** Skills con todas las características con validación y verificaciones de calidad.

---

## Reglas de Validación

### Validación de Campos Requeridos

**Skill válida mínima:**
```yaml
---
# ¡Sin campos requeridos! Esto es válido:
---

# Contenido aquí
```

**Skill mínima recomendada:**
```yaml
---
name: skill-name
description: Cuándo usar esta skill
---
```

### Validación de Tipo de Campo

```yaml
# ✅ Tipos válidos
name: string-value
description: string-value
version: 1.0.0
argument-hint: <string>
disable-model-invocation: true
user-invocable: false
allowed-tools: Read, Write
model: sonnet
context: fork
agent: Explore
hooks:
  tool-approved:
    - run: echo "test"

# ❌ Tipos inválidos
name: 123  # Debería ser string
version: true  # Debería ser string
disable-model-invocation: yes  # Debería ser true/false
model: claude-3.5  # Debería ser sonnet/opus/haiku
context: isolated  # Debería ser fork
```

### Validación de Valores de Campo

```yaml
# ✅ Valores válidos
model: sonnet  # o opus, haiku
context: fork  # único valor válido
agent: Explore  # incorporado o personalizado

# ❌ Valores inválidos
model: gpt-4  # No es una opción válida
context: new  # Solo 'fork' soportado
agent: NonExistent  # Debe existir
```

---

## Errores Comunes

### Error 1: Descripción Vaga

❌ **Incorrecto:**
```yaml
description: Ayudante de código
```

✅ **Correcto:**
```yaml
description: Genera componentes React con TypeScript. Usar cuando se crean nuevos componentes o se convierten componentes de clase.
```

---

### Error 2: Control de Invocación Incorrecto

❌ **Incorrecto:**
```yaml
# ¡Deployment que puede auto-activarse!
name: deploy
description: Desplegar a producción
```

✅ **Correcto:**
```yaml
name: deploy
description: Desplegar a producción
disable-model-invocation: true  # ¡Solo manual!
```

---

### Error 3: Fork Sin Tarea

❌ **Incorrecto:**
```yaml
---
context: fork  # ¡Pero sin tarea abajo!
---

Al revisar código, verificar:
- Problemas de seguridad
- Problemas de rendimiento
```

✅ **Correcto:**
```yaml
---
context: fork
---

Revisar el codebase:
1. Encontrar todos los archivos
2. Analizar para problemas de seguridad
3. Documentar hallazgos
```

---

### Error 4: Herramientas Demasiado Permisivas

❌ **Incorrecto:**
```yaml
allowed-tools: Bash(*), Write, Edit
```

✅ **Correcto:**
```yaml
allowed-tools: Bash(npm test), Bash(git status), Read
```

---

### Error 5: Elección de Modelo Incorrecta

❌ **Incorrecto:**
```yaml
# Formateo simple usando modelo costoso
name: format-code
model: opus
```

✅ **Correcto:**
```yaml
name: format-code
model: haiku  # Rápido, barato, suficiente
```

---

## Ejemplos Completos

### Ejemplo 1: Skill de Conocimiento Básica

```yaml
---
name: api-conventions
description: Patrones de diseño de API para este codebase. Usar cuando se diseñan o revisan endpoints de API.
version: 1.0.0
---

# Convenciones de API

Al diseñar endpoints de API:

1. **Nomenclatura RESTful:** Usar sustantivos de recursos, no verbos
2. **Errores Consistentes:** Retornar formato de error estándar
3. **Validación:** Validar toda entrada en punto de entrada del endpoint
4. **Rate Limiting:** Añadir rate limiting a endpoints de autenticación
5. **Versionado:** Usar versionado de URL (/v1/, /v2/)
```

---

### Ejemplo 2: Flujo de Trabajo de Deployment Manual

```yaml
---
name: deploy
description: Desplegar aplicación a entorno de producción
argument-hint: <environment>
disable-model-invocation: true
context: fork
agent: general-purpose
---

# Flujo de Trabajo de Deployment

Desplegar a entorno $ARGUMENTS:

1. **Ejecutar Tests:**
   ```bash
   npm run test:all
   ```

2. **Construir Aplicación:**
   ```bash
   npm run build:prod
   ```

3. **Desplegar:**
   ```bash
   ./scripts/deploy.sh $ARGUMENTS
   ```

4. **Verificar:**
   - Verificar endpoint de salud
   - Monitorear logs de errores
   - Confirmar éxito de deployment

Si cualquier paso falla, abortar y reportar el problema.
```

---

### Ejemplo 3: Explicador de Código Auto-Invocado

```yaml
---
name: explain-code
description: Explica código con diagramas visuales y analogías. Usar cuando se explica cómo funciona el código, se enseña sobre un codebase, o cuando el usuario pregunta "¿cómo funciona esto?"
version: 1.1.0
model: sonnet
allowed-tools: Read, Grep
---

# Explicador de Código

Al explicar código, siempre incluir:

1. **Analogía:** Comparar con algo de la vida cotidiana
2. **Diagrama:** Usar arte ASCII para mostrar flujo/estructura
3. **Recorrido:** Explicar paso a paso qué sucede
4. **Gotcha:** Destacar error común o concepto erróneo

Mantener explicaciones conversacionales. Para conceptos complejos, usar múltiples analogías.
```

---

### Ejemplo 4: Subagente de Investigación

```yaml
---
name: deep-research
description: Investigar un tema exhaustivamente a través de todo el codebase
argument-hint: <topic>
context: fork
agent: Explore
allowed-tools: Read, Grep, Glob
version: 1.0.0
---

# Investigación Profunda

Investigar "$ARGUMENTS" exhaustivamente:

## Fase 1: Descubrimiento
1. Encontrar todos los archivos relevantes usando patrones Glob
2. Buscar palabras clave usando Grep
3. Identificar puntos de entrada y archivos clave

## Fase 2: Análisis
1. Leer y analizar estructura de código
2. Mapear relaciones y dependencias
3. Identificar patrones y convenciones

## Fase 3: Documentación
1. Resumir arquitectura
2. Documentar decisiones de diseño clave
3. Destacar archivos importantes con números de línea

Enfocarse en entender la arquitectura general y decisiones clave.
```

---

## Resumen de Mejores Prácticas

### HACER ✅

1. **Siempre escribir descripciones específicas y concretas:**
   ```yaml
   description: Usar cuando usuario pide "crear un hook", "añadir validación", o "implementar PreToolUse"
   ```

2. **Establecer disable-model-invocation para efectos secundarios:**
   ```yaml
   disable-model-invocation: true  # Para deploy, commit, send-email, etc.
   ```

3. **Usar versionado semántico:**
   ```yaml
   version: 1.2.0
   ```

4. **Proporcionar pistas de argumentos:**
   ```yaml
   argument-hint: <issue-number>
   ```

5. **Restringir permisos de herramientas:**
   ```yaml
   allowed-tools: Read, Grep, Glob  # Solo lo necesario
   ```

### NO HACER ❌

1. **No escribir descripciones vagas:**
   ```yaml
   description: Ayudante de código  # ¡Demasiado vago!
   ```

2. **No permitir auto-invocación de operaciones destructivas:**
   ```yaml
   # Falta disable-model-invocation: true
   name: deploy
   ```

3. **No dar demasiados permisos de herramientas:**
   ```yaml
   allowed-tools: Bash(*), Write  # ¡Demasiado amplio!
   ```

4. **No hacer fork sin tarea explícita:**
   ```yaml
   context: fork
   # ¡Pero cuerpo de skill solo tiene guías, sin tarea!
   ```

5. **No usar modelo incorrecto:**
   ```yaml
   model: opus  # Para formateo simple (¡costoso!)
   ```

---

## Documentación Relacionada

- [Anatomía de Skill](../01-fundamentals/skill-anatomy.md) - Estructura completa de skill
- [Principios de Diseño](../03-creating-skills/design-principles.md) - Filosofía de diseño de skills
- [Flujo de Trabajo de Creación](../03-creating-skills/workflow.md) - Guía paso a paso de creación
- [Patrones de Skills](../03-creating-skills/skill-patterns.md) - Patrones comunes de skills

---

**Última Actualización:** Febrero 2026
**Categoría:** Referencia de Skills
**Audiencia:** Desarrolladores de skills
**Relacionado:** Formato SKILL.md, configuración de frontmatter, desarrollo de skills
