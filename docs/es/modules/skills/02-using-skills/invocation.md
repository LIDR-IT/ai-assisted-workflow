# Invocación de Skills

## Descripción General

Los skills pueden invocarse de dos maneras: **automáticamente** por el agente de IA cuando detecta una intención coincidente, o **manualmente** por el usuario a través de comandos explícitos. Comprender cómo funciona cada método de invocación es esencial para utilizar efectivamente los skills en tu flujo de trabajo.

Esta guía cubre la mecánica de invocación de skills, las sustituciones de cadenas para contenido dinámico, los mecanismos de control para determinar quién puede invocar skills y las mejores prácticas para una activación confiable de los mismos.

---

## Dos Métodos de Invocación

### Invocación Automática (Activada por el Agente)

**Cómo funciona:**
1. El agente monitorea la conversación en busca de solicitudes del usuario.
2. Compara la solicitud con las descripciones de los skills en el contexto.
3. Cuando una descripción coincide con la intención del usuario, carga el contenido completo del skill.
4. Aplica el conocimiento del skill para cumplir con la solicitud.

**Ejemplo:**

```yaml
---
name: explain-code
description: Explica código con diagramas visuales y analogías. Úsalo cuando expliques cómo funciona el código, enseñes sobre una base de código o cuando el usuario pregunte "¿cómo funciona esto?"
---
```

**Solicitud del usuario:** "¿Cómo funciona este sistema de autenticación?"

**Comportamiento del agente:**
1. Detecta palabras clave: "¿cómo", "funciona", "autenticación".
2. Coincide con la descripción de `explain-code`.
3. Carga el contenido completo del skill `explain-code`.
4. Aplica las instrucciones del skill para explicar la autenticación con diagramas y analogías.

**Cuándo ocurre la invocación automática:**
- La solicitud del usuario coincide semánticamente con la descripción del skill.
- `disable-model-invocation` NO está establecido en `true`.
- La descripción del skill está cargada en el contexto del agente.

**Beneficios:**
- Flujo de conversación natural (no se necesita sintaxis de comandos).
- El agente aplica su experiencia automáticamente.
- El usuario no necesita saber que el skill existe.
- La divulgación progresiva mantiene el contexto ligero.

**Limitaciones:**
- Requiere descripciones bien escritas y específicas.
- Puede que no se active si la redacción no coincide.
- El agente decide cuándo aplicarlo (no siempre es predecible).

### Invocación Manual (Activada por el Usuario)

**Cómo funciona:**
1. El usuario escribe `/nombre-del-skill` con argumentos opcionales.
2. El agente carga inmediatamente el contenido del skill.
3. Aplica el skill independientemente del contexto o de la coincidencia de la descripción.

**Ejemplo:**

```bash
# Invocación básica
/explain-code

# Con un argumento
/explain-code src/auth/login.ts

# Con múltiples argumentos
/migrate-component SearchBar React Vue
```

**Cuándo ocurre la invocación manual:**
- El usuario escribe explícitamente `/nombre-del-skill`.
- El skill tiene `user-invocable: true` (por defecto) o el campo se omite.
- El skill aparece en el menú de autocompletado al escribir `/`.

**Beneficios:**
- Activación garantizada (no se requiere coincidencia de descripción).
- Control preciso sobre cuándo se aplica el skill.
- Se pueden pasar argumentos para un comportamiento dinámico.
- Comportamiento predecible en todo momento.

**Limitaciones:**
- El usuario debe saber que el skill existe.
- Requiere escribir una sintaxis de comando.
- Rompe el flujo conversacional.
- Se oculta si `user-invocable: false`.

---

## Mecánica de Activación Automática

### Coincidencia de Descripción

El campo `description` determina cuándo ocurre la invocación automática:

```yaml
---
name: database-migration-validator
description: Valida las migraciones de esquemas de bases de datos para asegurar la consistencia, la seguridad y la capacidad de reversión antes del despliegue en producción.
---
```

**Algoritmo de coincidencia:**
1. El agente ve inicialmente solo las **descripciones** de los skills (no el contenido completo).
2. Se analiza la intención semántica de la solicitud del usuario.
3. El agente compara la intención con todas las descripciones de skills disponibles.
4. Los skills que mejor coinciden cargan su contenido completo.
5. El agente aplica el conocimiento del skill cargado.

**Qué hace que una descripción de activación sea buena:**

✅ **Verbos de acción específicos:**
```yaml
description: Genera componentes funcionales de React con TypeScript, hooks y pruebas siguiendo las convenciones del proyecto.
```

✅ **Contexto y restricciones claros:**
```yaml
description: Valida las migraciones de esquemas de bases de datos para asegurar la consistencia, la seguridad y la capacidad de reversión antes del despliegue en producción, verificando la falta de índices, operaciones inseguras y la reversibilidad.
```

✅ **Lenguaje natural que los usuarios dirían:**
```yaml
description: Explica código con diagramas visuales y analogías. Úsalo cuando expliques cómo funciona el código, enseñes sobre una base de código o cuando el usuario pregunte "¿cómo funciona esto?"
```

❌ **Vago o genérico:**
```yaml
description: Herramientas de base de datos  # Demasiado vago, no se activará de forma fiable
description: Ayudante de código       # Genérico, coincide con demasiadas solicitudes
```

### Presupuesto de Contexto y Carga de Skills

**Estrategia de carga de contexto (Claude Code):**
- **En reposo:** Solo se cargan las descripciones de los skills (presupuesto por defecto: 15,000 caracteres).
- **Al invocar:** El contenido completo del skill se carga cuando se activa.
- **Después del uso:** El contenido completo puede descargarse para liberar espacio en el contexto.

**Si los skills se excluyen debido al presupuesto:**

```bash
# Comprobar el contexto actual
/context

# Aumentar el presupuesto si es necesario (variable de entorno)
export SLASH_COMMAND_TOOL_CHAR_BUDGET=30000
```

**Divulgación progresiva (Antigravity):**
- **En reposo:** El agente ve solo el frontmatter del SKILL.md (nombre + descripción).
- **Al coincidir:** El contenido completo del skill se carga dinámicamente.
- **Al completar:** El skill se descarga para liberar el contexto.

Esto evita la saturación del contexto y permite escalar a muchos skills.

### Flujo de Activación (Antigravity)

**Activación paso a paso:**

1. **Solicitud del usuario:** "Genera pruebas unitarias para este componente".
2. **Escaneo del agente:** Revisa todas las descripciones de skills en el contexto.
3. **Coincidencia de intención:** Encuentra el `testing-skill` con la descripción "Genera pruebas unitarias para componentes con una cobertura completa y casos de borde".
4. **Carga de contenido:** Se carga el cuerpo completo del SKILL.md, los scripts, las plantillas y los ejemplos.
5. **Ejecución:** El agente aplica su experiencia en pruebas utilizando el conocimiento cargado.
6. **Descarga:** El contenido del skill se descarga después de completar la tarea.

**Representación visual:**

```
Solicitud del Usuario
     ↓
[Escaneo de Descripciones] ← Todas las descripciones de skills en contexto
     ↓
[Coincidencia de Intención] → testing-skill coincide con "generar pruebas unitarias"
     ↓
[Carga de Contenido] ← Cuerpo del SKILL.md + scripts/ + examples/
     ↓
[Ejecución] → El agente aplica la experiencia en pruebas
     ↓
[Descarga] ← Se elimina el contenido del skill para liberar el contexto
```

---

## Invocación Manual con Argumentos

### Sintaxis Básica

```bash
/nombre-del-skill [arg1] [arg2] [arg3]
```

**Ejemplos:**

```bash
# Sin argumentos
/deploy

# Un solo argumento
/fix-issue 123

# Múltiples argumentos
/migrate-component SearchBar React Vue
```

### Variables de Sustitución de Cadenas

Los skills admiten la inyección de valores dinámicos a través de sustituciones de cadenas:

| Variable | Descripción | Ejemplo |
|:---------|:------------|:--------|
| `$ARGUMENTS` | Todos los argumentos como una sola cadena | `/deploy staging` → `$ARGUMENTS` = "staging" |
| `$ARGUMENTS[N]` | Argumento específico por índice basado en 0 | `$ARGUMENTS[0]` = primer argumento |
| `$N` | Abreviatura de `$ARGUMENTS[N]` | `$0` = primero, `$1` = segundo |
| `${CLAUDE_SESSION_ID}` | ID de la sesión actual | ID único para esta sesión |

### Uso de $ARGUMENTS

**Si `$ARGUMENTS` está presente en el skill:**

```yaml
---
name: session-logger
description: Registrar la actividad de esta sesión
---

Registrar lo siguiente en logs/${CLAUDE_SESSION_ID}.log:

$ARGUMENTS
```

**Uso:** `/session-logger El usuario completó el flujo de autenticación`

**Resultado:** El contenido "El usuario completó el flujo de autenticación" se inyecta donde aparece `$ARGUMENTS`.

**Si `$ARGUMENTS` NO está presente en el skill:**

Los argumentos se añaden automáticamente como:

```
ARGUMENTS: <valor>
```

**Ejemplo:**

```yaml
---
name: deploy
description: Desplegar la aplicación a producción
---

Desplegar a producción:
1. Ejecutar pruebas
2. Construir la aplicación
3. Empujar al objetivo de despliegue
```

**Uso:** `/deploy staging`

**El agente ve:**

```
Desplegar a producción:
1. Ejecutar pruebas
2. Construir la aplicación
3. Empujar al objetivo de despliegue

ARGUMENTS: staging
```

### Uso de Argumentos Indexados ($N)

**Definición del skill:**

```yaml
---
name: migrate-component
description: Migrar un componente de un framework a otro
argument-hint: <nombre-del-componente> <framework-origen> <framework-destino>
---

Migrar el componente $0 de $1 a $2.
Preservar todo el comportamiento y las pruebas existentes.

## Proceso
1. Analizar la estructura del componente $0.
2. Identificar patrones específicos de $1.
3. Convertir a sus equivalentes en $2.
4. Mantener la funcionalidad.
```

**Uso:** `/migrate-component SearchBar React Vue`

**El agente ve:**

```
Migrar el componente SearchBar de React a Vue.
Preservar todo el comportamiento y las pruebas existentes.

## Proceso
1. Analizar la estructura del componente SearchBar.
2. Identificar patrones específicos de React.
3. Convertir a sus equivalentes en Vue.
4. Mantener la funcionalidad.
```

**Beneficios:**
- Manejo de argumentos estructurado y predecible.
- Autodocumentado con `argument-hint`.
- Plantilla de skill reutilizable para diferentes entradas.
- Posiciones de parámetros claras.

### Uso del ID de Sesión

**Definición del skill:**

```yaml
---
name: debug-logger
description: Registrar información de depuración con seguimiento de sesión
---

Crear log de depuración en: `logs/debug-${CLAUDE_SESSION_ID}.log`

Incluir:
- Marca de tiempo
- ID de Sesión: ${CLAUDE_SESSION_ID}
- Información de depuración: $ARGUMENTS

Formatear las entradas del log para facilitar el análisis y la correlación entre sesiones.
```

**Uso:** `/debug-logger Intento de autenticación fallido para user@example.com`

**El agente ve:**

```
Crear log de depuración en: `logs/debug-a1b2c3d4-e5f6-7890-abcd-ef1234567890.log`

Incluir:
- Marca de tiempo
- ID de Sesión: a1b2c3d4-e5f6-7890-abcd-ef1234567890
- Información de depuración: Intento de autenticación fallido para user@example.com
```

**Casos de uso para el ID de sesión:**
- Registro de logs específicos de la sesión.
- Nombramiento de archivos temporales.
- Correlación de la salida entre múltiples skills.
- Depuración y rastreo.

### Sugerencias de Argumentos (Argument Hints)

El campo `argument-hint` proporciona una guía de autocompletado:

```yaml
---
name: fix-issue
description: Corregir un problema de GitHub por número
argument-hint: <numero-de-problema>
---
```

**Visualización del autocompletado:**

```
/fix-issue <numero-de-problema>
```

**Múltiples argumentos:**

```yaml
argument-hint: <nombre-del-componente> <framework-origen> <framework-destino>
```

**Visualización del autocompletado:**

```
/migrate-component <nombre-del-componente> <framework-origen> <framework-destino>
```

**Mejores prácticas:**
- Usar paréntesis angulares para los obligatorios: `<arg>`.
- Usar corchetes para los opcionales: `[arg]`.
- Ser descriptivo pero conciso.
- Coincidir con las posiciones de los argumentos indexados.

---

## Controlando la Invocación

### Dos Campos de Control

Los skills proporcionan dos campos de frontmatter para controlar la invocación:

**1. `disable-model-invocation`** - Controla la invocación automática (agente).

**2. `user-invocable`** - Controla la invocación manual (usuario).

### disable-model-invocation

**Propósito:** Evitar que el agente invoque automáticamente el skill.

**Por defecto:** `false` (el agente puede auto-invocarlo).

**Establecer en `true` cuando:**
- El skill tenga efectos secundarios (despliegues, commits, cambios de base de datos).
- El tiempo sea importante (el usuario debe activarlo en el momento adecuado).
- Se requiera el juicio del usuario para invocarlo.
- Solo deba ejecutarse cuando se solicite explícitamente.

**Ejemplo: Skill de Despliegue**

```yaml
---
name: deploy
description: Desplegar la aplicación a producción
disable-model-invocation: true
context: fork
---

Desplegar $ARGUMENTS a producción:
1. Ejecutar la suite de pruebas.
2. Construir la aplicación.
3. Empujar al objetivo de despliegue.
4. Verificar que el despliegue fue exitoso.
5. Monitorear errores.
```

**Comportamiento:**
- ✅ El usuario puede invocar: `/deploy staging`.
- ❌ El agente NO PUEDE auto-invocarlo (incluso si el usuario dice "desplegar en staging").
- 📋 La descripción NO se carga en el contexto del agente (ahorra presupuesto).
- 🔒 El skill completo se carga SOLO cuando el usuario lo invoca manualmente.

**Por qué usar esto:**
- Evita despliegues accidentales.
- Asegura la aprobación del usuario para operaciones destructivas.
- El usuario controla el tiempo de las operaciones con efectos secundarios.
- Protege contra la mala interpretación de la intención del usuario.

### user-invocable

**Propósito:** Ocultar el skill del menú `/` del usuario.

**Por defecto:** `true` (el skill aparece en el menú).

**Establecer en `false` cuando:**
- El skill proporcione conocimiento de fondo (no un comando accionable).
- El agente deba auto-aplicarlo pero los usuarios no deban invocarlo directamente.
- El skill sea intermedio o auxiliar (no orientado al usuario).
- Se quiera reducir el desorden del menú.

**Ejemplo: Contexto de Sistema Heredado**

```yaml
---
name: legacy-system-context
description: Contexto sobre la arquitectura y restricciones del sistema de autenticación heredado. Úsalo cuando trabajes en el directorio auth/legacy/ o discutas la migración del sistema heredado.
user-invocable: false
---

# Sistema de Autenticación Heredado

## Arquitectura
[Documentación detallada del sistema heredado...]

## Restricciones
[Restricciones de migración y puntos a tener en cuenta...]

## Puntos de Integración
[Cómo se conecta el sistema heredado con el nuevo sistema...]
```

**Comportamiento:**
- ✅ El agente puede auto-invocarlo (al trabajar en auth/legacy/).
- ❌ El usuario NO PUEDE invocarlo (está oculto del menú `/`).
- 📋 La descripción se carga en el contexto del agente.
- 📚 El skill completo se carga cuando el agente detecta un trabajo relevante.

**Por qué usar esto:**
- Conocimiento de fondo que no es un "comando".
- Mantiene el menú `/` enfocado en skills accionables.
- Experiencia y contexto solo para el agente.
- Reduce la carga cognitiva del usuario.

**Distinción importante:**

`user-invocable: false` solo controla la **visibilidad del menú**, NO el acceso del agente. Para bloquear completamente la invocación programática, usa `disable-model-invocation: true`.

### Matriz de Invocación

| Frontmatter | Invocación Usuario `/` | Auto-invocación Agente | Descripción en contexto | Carga de contenido completo |
|:------------|:-----------------------|:-----------------------|:------------------------|:----------------------------|
| (por defecto) | ✅ Sí | ✅ Sí | ✅ Sí | Al invocar |
| `disable-model-invocation: true` | ✅ Sí | ❌ No | ❌ No | Cuando usuario invoca |
| `user-invocable: false` | ❌ No (oculto) | ✅ Sí | ✅ Sí | Al invocar |
| Ambos `true` y `false` | ❌ No | ❌ No | ❌ No | Nunca (config. errónea) |

### Matriz de Casos de Uso

| Caso de Uso | disable-model-invocation | user-invocable | Ejemplo |
|:------------|:-------------------------|:---------------|:--------|
| **Skill general** | `false` | `true` | `/explain-code` - Tanto manual como auto |
| **Operación peligrosa** | `true` | `true` | `/deploy` - Solo usuario, explícito |
| **Conocimiento de fondo** | `false` | `false` | `legacy-system-context` - Solo agente |
| **Workflow manual** | `true` | `true` | `/commit` - Usuario controla el tiempo |
| **Guía de auto-aplicación** | `false` | `false` | `api-conventions` - El agente aplica auto. |

### Restricciones a Nivel de Sistema

Más allá de los controles a nivel de skill, puedes restringir la invocación de skills a través de los ajustes de permisos:

**Deshabilitar todos los skills:**

```
# En /permissions, agrega a las reglas de denegación (deny):
Skill
```

**Permitir solo skills específicos:**

```
# Permitir solo estos skills
Skill(commit)
Skill(review-pr *)
```

**Denegar skills específicos:**

```
# Bloquear estos skills
Skill(deploy *)
```

**Sintaxis de permisos:**
- `Skill(nombre)` - Coincidencia exacta.
- `Skill(nombre *)` - Coincidencia de prefijo con cualquier argumento.

---

## Mejores Prácticas para la Invocación

### Escribiendo Descripciones de Activación

**Incluye palabras clave naturales:**

✅ **Bien:**
```yaml
description: Explica código con diagramas visuales y analogías. Úsalo cuando expliques cómo funciona el código, enseñes sobre una base de código o cuando el usuario pregunte "¿cómo funciona esto?"
```

Se activa con: "¿cómo funciona esto?", "explica este código", "enséñame sobre".

❌ **Mal:**
```yaml
description: Explicador de código
```

Demasiado genérico, no coincidirá de forma fiable con la intención del usuario.

**Sé específico sobre el contexto:**

✅ **Bien:**
```yaml
description: Valida las migraciones de esquemas de bases de datos para asegurar la consistencia, la seguridad y la capacidad de reversión antes del despliegue en producción, verificando la falta de índices, operaciones inseguras y la reversibilidad.
```

Se activa con: "validar migración", "comprobar seguridad del esquema", "revisión de migración".

❌ **Mal:**
```yaml
description: Herramientas de base de datos
```

Demasiado vago, podría coincidir con muchas solicitudes no relacionadas.

**Incluye verbos de acción:**

✅ **Bien:**
```yaml
description: Genera componentes funcionales de React con TypeScript, hooks, styled-components y una cobertura de pruebas exhaustiva siguiendo las convenciones del proyecto.
```

Se activa con: "generar componente", "crear componente React", "scaffold component".

**Prueba ambas redacciones:**

Prueba la activación del skill con diferentes solicitudes de usuario:
- "Genera un componente de perfil de usuario" ✅
- "Necesito un nuevo componente para los perfiles de usuario" ✅
- "¿Cómo creo componentes?" ❌ (demasiado general, podría no coincidir)

### Eligiendo el Método de Invocación

**Uso de la automática (por defecto) cuando:**
- El skill proporcione conocimiento general o guías.
- El usuario solicitaría naturalmente la capacidad en una conversación.
- No haya efectos secundarios u operaciones destructivas.
- Quieras una integración fluida sin sintaxis de comandos.

**Uso de `disable-model-invocation: true` cuando:**
- El skill tenga efectos secundarios (commits, despliegues, llamadas a API).
- El tiempo sea importante (el usuario debe controlar cuándo).
- Requiera confirmación o aprobación.
- Sea potencialmente destructivo o irreversible.

**Uso de `user-invocable: false` cuando:**
- El conocimiento de fondo no sea accionable como comando.
- El agente deba aplicarlo pero los usuarios no deban invocarlo directamente.
- Se quiera reducir el desorden del menú.
- Sea un skill auxiliar para otros skills.

### Diseñando Patrones de Argumentos

**Uso de `$ARGUMENTS` para contenido de formato libre:**

```yaml
name: explain-concept
description: Explicar un concepto técnico con analogías
---
Explica $ARGUMENTS usando analogías y ejemplos cotidianos.
```

Uso: `/explain-concept inyección de dependencias en React`

**Uso de `$N` indexado para entradas estructuradas:**

```yaml
name: create-endpoint
argument-hint: <ruta> <metodo> <descripcion>
---
Crear endpoint $1 en $0: $2
```

Uso: `/create-endpoint /api/users POST Crear nueva cuenta de usuario`

**Proporcionar sugerencias de argumentos (argument hints):**

Incluye siempre `argument-hint` para los skills con parámetros:

```yaml
argument-hint: <numero-de-problema>              # Un solo arg
argument-hint: <componente> <framework>           # Múltiples args
argument-hint: [entorno]                         # Arg opcional
```

### Probando la Invocación

**Probar la invocación automática:**

1. Escribe una solicitud que coincida con las palabras clave de la descripción.
2. Verifica que el skill se active (comprueba que la respuesta del agente aplique el conocimiento del skill).
3. Prueba variaciones en la redacción.
4. Prueba casos de borde (intenciones similares pero diferentes).

**Probar la invocación manual:**

1. Escribe `/nombre-del-skill` en la conversación.
2. Verifica que aparezca el autocompletado.
3. Prueba con varias combinaciones de argumentos.
4. Verifica que las sustituciones de cadenas funcionen correctamente.

**Probar los controles:**

1. Establece `disable-model-invocation: true`, verifica que el agente no lo auto-invoque.
2. Establece `user-invocable: false`, verifica que esté oculto del menú.
3. Prueba las restricciones de permisos si están configuradas.

---

## Solución de Problemas

### El Skill no se Activa

**Síntomas:**
- La solicitud parece coincidir pero el skill no se activa.
- El agente no utiliza el conocimiento del skill.
- Solicitudes similares funcionan de forma inconsistente.

**Soluciones:**

**1. Comprobar la especificidad de la descripción:**

❌ **Demasiado vaga:**
```yaml
description: Herramientas de prueba
```

✅ **Específica:**
```yaml
description: Genera pruebas unitarias para componentes de React con Jest, React Testing Library y una cobertura exhaustiva que incluye casos de borde e interacciones de usuario.
```

**2. Verificar que el skill sea descubrible:**

```bash
# Claude Code
¿Qué skills hay disponibles?

# Comprueba si tu skill aparece en la lista
```

**3. Probar con la redacción exacta de la descripción:**

Si la descripción dice "Úsalo cuando expliques cómo funciona el código", prueba:
```
Explica cómo funciona este código
```

**4. Invocar manualmente para confirmar que funciona:**

```bash
/nombre-del-skill
```

Si la invocación manual funciona pero la automática no, es un problema de coincidencia de la descripción.

**5. Comprobar el presupuesto del contexto:**

```bash
/context  # Mira si los skills están excluidos
```

Aumenta si es necesario:
```bash
export SLASH_COMMAND_TOOL_CHAR_BUDGET=30000
```

**6. Reiniciar el agente:**

A veces, los problemas de caché impiden la detección:
```bash
# Claude Code
/restart
```

### Se Activó el Skill Equivocado

**Síntomas:**
- Se activa un skill diferente al esperado.
- Varios skills parecen competir.
- Selección de skill impredecible.

**Soluciones:**

**1. Hacer las descripciones más distintas:**

Si dos skills se solapan:

❌ **Solapados:**
```yaml
# Skill 1
description: Generar pruebas

# Skill 2
description: Crear archivos de prueba
```

✅ **Distintos:**
```yaml
# Skill 1
description: Genera pruebas unitarias para componentes de React con Jest y React Testing Library

# Skill 2
description: Crea pruebas de integración para endpoints de API con Supertest y fixtures de base de datos
```

**2. Agregar restricciones de contexto:**

```yaml
description: Genera pruebas de componentes React (SOLO para proyectos TypeScript con Jest configurado)
```

**3. Usar `disable-model-invocation: true`:**

Para los skills donde la precisión es crítica, deshabilita la invocación automática:

```yaml
disable-model-invocation: true
```

Fuerza la invocación manual: `/nombre-del-skill`

### El Skill se Activa con Demasiada Frecuencia

**Síntomas:**
- El skill se activa cuando no se desea.
- Interrumpe otro trabajo.
- La descripción es demasiado amplia.

**Soluciones:**

**1. Estrechar la descripción:**

❌ **Demasiado amplia:**
```yaml
description: Ayuda con el código
```

✅ **Estrecha:**
```yaml
description: Refactoriza código TypeScript para extraer funciones de utilidad reutilizables, pero SOLO cuando el usuario solicite explícitamente la refactorización o la extracción de código.
```

**2. Agregar `disable-model-invocation: true`:**

Requiere una invocación explícita:

```yaml
disable-model-invocation: true
```

**3. Agregar lenguaje condicional:**

```yaml
description: Genera migraciones de bases de datos, pero SOLO cuando el usuario mencione explícitamente la creación, modificación o migración del esquema de la base de datos.
```

### Los Argumentos no se Sustituyen

**Síntomas:**
- `$ARGUMENTS` aparece literalmente en la salida.
- `$0`, `$1` no se reemplazan.
- El ID de sesión no se sustituye.

**Soluciones:**

**1. Comprobar la sintaxis de las variables:**

✅ **Correcto:**
```markdown
Migrar $0 de $1 a $2
Sesión: ${CLAUDE_SESSION_ID}
Todos los args: $ARGUMENTS
```

❌ **Incorrecto:**
```markdown
Migrar %0 de %1 a %2        # Prefijo incorrecto
Sesión: $CLAUDE_SESSION_ID     # Faltan llaves para el ID de sesión
Todos los args: $ARGS                 # Nombre de variable incorrecto
```

**2. Verificar que la invocación incluya argumentos:**

```bash
# Con argumentos
/migrate-component SearchBar React Vue  ✅

# Sin argumentos (la sustitución falla)
/migrate-component  ❌
```

**3. Comprobar el conteo de argumentos:**

Si el skill espera `$0`, `$1`, `$2` pero solo se proporcionan 2 argumentos:
```bash
/nombre-del-skill arg1 arg2  # $2 estará vacío/indefinido
```

**4. Probar con la invocación manual:**

La invocación manual siempre funciona; si la invocación automática falla en la sustitución, podría ser un error de la plataforma.

---

## Documentación Relacionada

### Desarrollo de Skills
- [Anatomía del Skill](../01-fundamentals/skill-anatomy.md) - Estructura de SKILL.md y frontmatter
- [Descubrimiento de Skills](./discovery.md) - Cómo los agentes encuentran skills
- [Creación de Skills](../03-creating-skills/) - Construyendo tus propios skills

### Temas Avanzados
- **Skills + Subagentes:** Ejecución de skills en contextos aislados con `context: fork`
- **Skills + Hooks:** Ejecución de skills orientada a eventos
- **Restricciones de Herramientas:** Uso de `allowed-tools` para limitar las capacidades del skill

### Referencias de Plataforma
- `docs/es/references/skills/skills-claude-code.md` - Documentación de skills para Claude Code
- `docs/es/references/skills/antigravity-skills.md` - Documentación de skills para Antigravity

---

**Última Actualización:** Febrero 2026
**Aplica a:** Claude Code, Antigravity, Gemini CLI
**Relacionado:** Anatomía del skill, descubrimiento, creación
