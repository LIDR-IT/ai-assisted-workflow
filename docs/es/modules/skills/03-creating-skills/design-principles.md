# Principios de Diseño para Skills

## Descripción General

Los skills efectivos siguen tres principios de diseño fundamentales definidos por Anthropic: **Concisión**, **Grados de Libertad** y **Divulgación Progresiva**. Estos principios aseguran que los skills se mantengan eficientes, flexibles y preserven el contexto mientras proporcionan conocimiento especializado a los agentes de IA.

Comprender estos principios es esencial para crear skills que:
- Carguen rápida y eficientemente
- Proporcionen orientación apropiada sin restringir excesivamente
- Preserven espacio valioso en la ventana de contexto
- Escalen a través de múltiples skills en un proyecto

**Documentación Relacionada:**
- [Skill Anatomy](skill-anatomy.md) - Entendiendo la estructura de los skills
- [Workflow](workflow.md) - Proceso de creación paso a paso

---

## Los Tres Principios Fundamentales

### 1. Concisión

**Principio:** La ventana de contexto se comparte entre prompts del sistema, historial de conversación y otros skills. Solo incluye información que Claude no conocería ya.

#### Por Qué Importa la Concisión

Las ventanas de contexto tienen límites. Cada token consumido por un skill es un token no disponible para:
- Historial de conversación
- Otros skills cargados
- Código siendo analizado
- Generación de salida

Los skills deben ser **densos en conocimiento**, enfocándose exclusivamente en información específica del dominio que Claude no puede inferir de sus datos de entrenamiento.

#### Qué Incluir

**SÍ incluir:**
- Patrones y convenciones específicos del dominio
- Flujos de trabajo específicos del proyecto
- Casos extremos no obvios
- Mejores prácticas específicas del framework
- Limitaciones de plataforma y soluciones alternativas
- Estándares específicos del equipo

**Ejemplo:**
```markdown
✅ SÍ: Incluir conocimiento específico del dominio
Prefiere server components por defecto en Next.js 13+.
Usa la directiva 'use client' solo cuando:
- El componente usa hooks (useState, useEffect)
- El componente maneja eventos del navegador (onClick, onChange)
- El componente usa APIs solo del navegador (localStorage, window)
```

#### Qué Excluir

**NO incluir:**
- Conceptos generales de programación
- Sintaxis básica del lenguaje
- Patrones de diseño comunes que Claude conoce
- Explicaciones obvias
- Introducciones a frameworks

**Ejemplo:**
```markdown
❌ NO: Explicar conocimiento general
React es una biblioteca de JavaScript para construir interfaces de usuario.
Usa una arquitectura basada en componentes donde los componentes son
piezas reutilizables de UI que pueden mantener su propio estado.
```

#### Aplicación Práctica

**Antes (Verboso):**
```markdown
React es una popular biblioteca de JavaScript creada por Facebook para construir
interfaces de usuario. Usa un DOM virtual para actualizar eficientemente la UI.
Los componentes son los bloques de construcción de las aplicaciones React. Pueden ser
basados en clases o funcionales. Los Hooks se introdujeron en React 16.8 y permiten
usar estado en componentes funcionales.

Al crear componentes, debes seguir estas mejores prácticas:
- Usa componentes funcionales con hooks en lugar de componentes de clase
- Extrae lógica reutilizable en custom hooks
- Usa nombres significativos para componentes y props
```

**Después (Conciso):**
```markdown
Mejores Prácticas de Componentes:
- Prefiere componentes funcionales con hooks sobre componentes de clase
- Extrae lógica con estado reutilizable en custom hooks
- Nombra componentes como sustantivos en PascalCase (UserProfile, no userProfile)
- Nombra props descriptivamente (onUserSelect vs onClick)
```

**Ahorro de tokens:** ~80 tokens → ~30 tokens (62% de reducción)

#### Lista de Verificación de Concisión

Al revisar contenido de skills, pregunta:
- [ ] ¿Sabría Claude esto de sus datos de entrenamiento?
- [ ] ¿Esto está explicando CÓMO funciona el lenguaje/framework?
- [ ] ¿Podría esto inferirse de código bien escrito?
- [ ] ¿Estoy repitiendo documentación estándar?

Si la respuesta es sí a alguna, considera eliminar o condensar.

---

### 2. Grados de Libertad

**Principio:** Ajusta la especificidad a la fragilidad de la tarea. Proporciona orientación apropiada que va desde instrucciones flexibles hasta scripts determinísticos basándose en cuán crítica es la ejecución exacta.

#### El Espectro de Especificidad

Los skills pueden proporcionar orientación en tres niveles:

1. **Instrucciones de Texto** → Tareas flexibles donde el enfoque varía
2. **Pseudocódigo/Patrones** → Patrones preferidos con cierta flexibilidad
3. **Scripts Exactos** → Operaciones propensas a errores que requieren precisión

#### Cuándo Usar Cada Nivel

##### Nivel 1: Instrucciones de Texto

**Usar cuando:**
- La tarea tiene múltiples enfoques válidos
- El contexto determina la mejor solución
- La resolución creativa de problemas es valiosa
- La implementación exacta varía según el caso de uso

**Características:**
- Orientación de alto nivel
- Dirección basada en principios
- Enfocado en resultados, no en implementación
- Espacio para juicio del agente

**Ejemplo: Skill de Revisión de Código**
```markdown
Revisar código para problemas de rendimiento:

## Lista de Verificación de Rendimiento
- Identificar re-renders innecesarios en componentes React
- Verificar cálculos costosos sin memoización
- Buscar índices de base de datos faltantes en campos consultados frecuentemente
- Señalar operaciones síncronas que podrían ser asíncronas
- Detectar memory leaks (event listeners, intervals, subscriptions)

Proporciona números de línea específicos y recomendaciones accionables.
```

**Por qué instrucciones de texto:** La revisión de código requiere juicio sobre contexto, severidad y compromisos. Diferentes bases de código tienen diferentes requisitos de rendimiento.

##### Nivel 2: Pseudocódigo/Patrones

**Usar cuando:**
- Los patrones establecidos deben seguirse
- La estructura es importante pero los detalles varían
- La consistencia entre implementaciones importa
- Cierta flexibilidad es apropiada

**Características:**
- Orientación estructural
- Patrones preferidos
- Pasos clave definidos
- Detalles de implementación flexibles

**Ejemplo: Generador de Endpoint API**
```markdown
Crea endpoint REST API siguiendo este patrón:

## Estructura del Endpoint

\`\`\`typescript
// 1. Define esquema de validación de request
const schema = z.object({
  // Define campos de entrada esperados con tipos y restricciones
});

// 2. Crea handler del endpoint
export async function POST(request: Request) {
  // 2a. Parsea y valida entrada
  const body = await request.json();
  const validated = schema.parse(body);

  // 2b. Verifica autenticación/autorización
  const user = await authenticate(request);
  if (!authorized(user, 'resource:action')) {
    return new Response('Forbidden', { status: 403 });
  }

  // 2c. Ejecuta lógica de negocio
  const result = await processRequest(validated);

  // 2d. Retorna respuesta estandarizada
  return Response.json({
    success: true,
    data: result
  });
}
\`\`\`

## Puntos Clave
- Siempre valida entrada primero
- Verifica auth antes de lógica de negocio
- Usa formato de respuesta consistente
- Maneja errores con códigos de estado apropiados
```

**Por qué pseudocódigo:** Los endpoints API deben seguir patrones consistentes para mantenibilidad, pero la implementación exacta depende del propósito específico del endpoint.

##### Nivel 3: Scripts Exactos

**Usar cuando:**
- La secuencia exacta importa
- Los errores tienen consecuencias serias
- La operación es propensa a errores
- Se requiere ejecución determinística
- La tarea es repetitiva e invariable

**Características:**
- Código ejecutable
- No se necesita interpretación
- Un solo camino de ejecución correcto
- Operaciones críticas para la seguridad

**Ejemplo: Skill de Deployment a Producción**
```markdown
## Proceso de Deployment

Ejecuta el script de deployment exactamente como se proporciona:

\`\`\`bash
#!/bin/bash
# scripts/deploy-production.sh
# CRÍTICO: No modificar esta secuencia

set -e  # Salir en cualquier error

echo "Iniciando deployment a producción..."

# 1. Ejecutar suite completa de tests
echo "Ejecutando tests..."
npm run test:all
if [ $? -ne 0 ]; then
  echo "❌ Tests fallaron. Deployment abortado."
  exit 1
fi

# 2. Construir bundle de producción
echo "Construyendo bundle de producción..."
npm run build:production

# 3. Ejecutar auditoría de seguridad
echo "Ejecutando auditoría de seguridad..."
npm audit --production --audit-level=moderate
if [ $? -ne 0 ]; then
  echo "❌ Vulnerabilidades de seguridad encontradas. Deployment abortado."
  exit 1
fi

# 4. Crear backup de base de datos
echo "Creando backup de base de datos..."
./scripts/backup-db.sh production
if [ $? -ne 0 ]; then
  echo "❌ Backup falló. Deployment abortado."
  exit 1
fi

# 5. Deploy a producción
echo "Desplegando a producción..."
aws s3 sync ./dist s3://production-bucket --delete
aws cloudfront create-invalidation \
  --distribution-id E1234567890ABC \
  --paths "/*"

# 6. Ejecutar smoke tests
echo "Ejecutando smoke tests..."
npm run test:smoke:production

echo "✅ Deployment completo"
\`\`\`

Ejecuta este script desde la raíz del proyecto:
\`\`\`bash
./scripts/deploy-production.sh
\`\`\`
```

**Por qué script exacto:** El deployment a producción requiere secuencia exacta, manejo de errores y capacidad de rollback. Cualquier desviación arriesga la estabilidad de producción.

#### Eligiendo el Nivel Correcto

| Factor | Instrucciones de Texto | Pseudocódigo | Scripts Exactos |
|--------|------------------|------------|---------------|
| **Consecuencias de error** | Bajo | Medio | Alto |
| **Flexibilidad de enfoque** | Alto | Medio | Ninguno |
| **Dependencia de contexto** | Alto | Medio | Bajo |
| **Necesidades de repetibilidad** | Bajo | Medio | Alto |
| **Juicio requerido** | Alto | Medio | Ninguno |

**Marco de Decisión:**

1. **Comienza con la pregunta:** "¿Qué pasa si esto se hace mal?"
   - Inconveniente menor → Instrucciones de texto
   - Retrabajo requerido → Pseudocódigo
   - Pérdida de datos/downtime → Script exacto

2. **Pregunta:** "¿Cuántos enfoques válidos existen?"
   - Muchos → Instrucciones de texto
   - Pocos patrones preferidos → Pseudocódigo
   - Una forma correcta → Script exacto

3. **Considera:** "¿El contexto cambia el enfoque?"
   - Frecuentemente → Instrucciones de texto
   - A veces → Pseudocódigo
   - Raramente → Script exacto

#### Ejemplos Prácticos

**Ejemplo 1: Auditoría de Accesibilidad (Instrucciones de Texto)**
```markdown
Auditar página web para cumplimiento WCAG:

## Nivel A (Crítico)
- Todas las imágenes tienen texto alt descriptivo
- Todos los inputs de formulario tienen labels asociados
- La navegación por teclado funciona para todos los elementos interactivos
- No existen trampas de teclado
- El color no es el único medio para transmitir información

## Nivel AA (Importante)
- Las proporciones de contraste de color cumplen 4.5:1 para texto normal, 3:1 para grande
- Indicadores de foco visibles en todos los elementos interactivos
- Labels ARIA presentes donde la semántica HTML es insuficiente
- La página es responsive y funcional al 200% de zoom

Reporta hallazgos con rutas de archivo y números de línea.
```

**Ejemplo 2: Migración de Base de Datos (Pseudocódigo)**
```markdown
Crea migración de base de datos siguiendo este patrón:

\`\`\`typescript
// migrations/YYYYMMDDHHMMSS_description.ts

export async function up(db: Database) {
  // 1. Crear nuevas tablas/columnas
  await db.schema.createTable('table_name', (table) => {
    table.increments('id').primary();
    table.string('column_name').notNullable();
    table.timestamps(true, true); // created_at, updated_at
  });

  // 2. Agregar índices
  await db.schema.alterTable('table_name', (table) => {
    table.index('column_name');
  });

  // 3. Migrar datos (si es necesario)
  // Usar transacciones por seguridad
}

export async function down(db: Database) {
  // Revertir todos los cambios de up()
  await db.schema.dropTable('table_name');
}
\`\`\`

Requisitos clave:
- Siempre implementa tanto up() como down()
- Usa transacciones para migraciones de datos
- Agrega índices para foreign keys
- Incluye timestamps en todas las tablas
```

**Ejemplo 3: Validación de Git Commit (Script Exacto)**
```markdown
Valida mensajes de commit usando el script proporcionado:

\`\`\`bash
#!/bin/bash
# scripts/validate-commit.sh

COMMIT_MSG_FILE=$1
COMMIT_MSG=$(cat "$COMMIT_MSG_FILE")

# Patrón Conventional Commits
PATTERN="^(feat|fix|docs|style|refactor|test|chore)(\(.+\))?: .{1,72}"

if ! echo "$COMMIT_MSG" | grep -qE "$PATTERN"; then
  echo "❌ Formato de mensaje de commit inválido"
  echo ""
  echo "Formato requerido:"
  echo "  type(scope): description"
  echo ""
  echo "Tipos válidos: feat, fix, docs, style, refactor, test, chore"
  echo "Ejemplo: feat(auth): add OAuth2 login support"
  exit 1
fi

echo "✅ Mensaje de commit válido"
exit 0
\`\`\`

Instala como hook de pre-commit:
\`\`\`bash
ln -s ../../scripts/validate-commit.sh .git/hooks/commit-msg
chmod +x .git/hooks/commit-msg
\`\`\`
```

---

### 3. Divulgación Progresiva

**Principio:** Carga información solo cuando se necesita para preservar espacio en la ventana de contexto. Los skills usan un sistema de carga de tres niveles para proporcionar metadatos inicialmente, contenido detallado cuando se activa, y recursos profundos según se requiera.

#### Por Qué Importa la Divulgación Progresiva

**El Problema de Saturación de Contexto:**

Imagina un proyecto con 20 skills. Si cada skill cargara su contenido completo (2,000-5,000 palabras) inmediatamente:
- **Sin divulgación progresiva:** 40,000-100,000 tokens constantemente cargados
- **Resultado:** Contexto lleno de información irrelevante, desplazando:
  - Conversación actual
  - Código activo siendo editado
  - Otros skills relevantes
  - Salida generada

**Con divulgación progresiva:** Solo 2,000 tokens (~100 palabras × 20 skills) cargados inicialmente, con contenido completo cargándose solo cuando se necesita.

#### El Sistema de Tres Niveles

##### Nivel 1: Metadatos (~100 palabras)

**Siempre cargado** - Presente en cada contexto

**Contenidos:**
```yaml
---
name: skill-identifier
description: Descripción detallada de cuándo y por qué usar este skill
version: 1.0.0
---
```

**Propósito:**
- Descubrimiento de skills
- Mecanismo de activación
- Presencia ligera

**Costo de tokens:** ~50-100 tokens por skill

**Ejemplo:**
```yaml
---
name: react-performance-audit
description: Este skill debe usarse cuando se solicite "auditar rendimiento de React",
"encontrar problemas de rendimiento", "optimizar componentes React", o "reducir re-renders"
version: 1.0.0
---
```

##### Nivel 2: Cuerpo de SKILL.md (<5,000 palabras)

**Cargado cuando el skill se activa** - Activado por coincidencia de intención

**Contenidos:**
- Instrucciones principales
- Flujos de trabajo de procesos
- Guías de decisión
- Referencias a recursos

**Propósito:**
- Orientación principal para ejecución de tareas
- Suficiente para la mayoría de casos de uso
- Aún lo suficientemente conciso para preservar contexto

**Costo de tokens:** ~1,000-3,000 tokens por skill activo

**Guía de tamaño:** 1,500-2,000 palabras ideal, 5,000 máximo

**Estructura de ejemplo:**
```markdown
# React Performance Audit

## Propósito
Identificar y resolver problemas de rendimiento de componentes React.

## Proceso de Auditoría

### 1. Identificar Re-renders Costosos
Verificar componentes que re-renderizan innecesariamente:
- Usar React DevTools Profiler
- Buscar componentes renderizando en cada actualización del padre
- Verificar dependencias faltantes en useEffect

### 2. Verificar Memoización
Identificar oportunidades de optimización faltantes:
- Cálculos costosos sin useMemo
- Funciones callback sin useCallback
- Componentes sin React.memo

### 3. Revisar Uso de Context
Auditar React Context para problemas de rendimiento:
- Objetos de contexto grandes causando re-renders amplios
- Actualizaciones de contexto disparando renders innecesarios
- Falta de división de contextos

## Patrones Detallados

Ver **`references/performance-patterns.md`** para técnicas de optimización comprehensivas.

## Ejemplos

Ejemplos funcionales en directorio **`examples/`**:
- `examples/memo-optimization.tsx`
- `examples/context-splitting.tsx`
```

##### Nivel 3: Recursos (Tamaño variable)

**Cargado según Claude determine necesario** - Profundizaciones bajo demanda

**Contenidos:**
- Documentación detallada (`references/`)
- Ejemplos de código funcionales (`examples/`)
- Scripts de utilidad (`scripts/`)
- Templates y assets (`assets/`)

**Propósito:**
- Información de profundización
- Ejemplos comprehensivos
- Herramientas de ejecución determinística

**Costo de tokens:** Variable, solo cuando se referencia explícitamente

**Guía de tamaño:** 2,000-10,000+ palabras por archivo de recurso

**Estructura de ejemplo de recursos:**
```
react-performance-audit/
├── SKILL.md (2,000 palabras - Nivel 2)
├── references/
│   ├── performance-patterns.md (8,000 palabras - Nivel 3)
│   ├── profiler-guide.md (4,000 palabras - Nivel 3)
│   └── common-mistakes.md (3,000 palabras - Nivel 3)
├── examples/
│   ├── memo-optimization.tsx (200 líneas - Nivel 3)
│   ├── context-splitting.tsx (150 líneas - Nivel 3)
│   └── virtual-scrolling.tsx (300 líneas - Nivel 3)
└── scripts/
    └── analyze-bundle.js (100 líneas - Nivel 3)
```

#### Flujo de Divulgación Progresiva

**Solicitud del Usuario:** "Este componente React es lento, ¿puedes optimizarlo?"

**Paso 1: Escaneo de Metadatos (Nivel 1)**
```
Agente escanea todos los metadatos de skills → Coincide "react-performance-audit"
description incluye "optimizar componentes React"
```

**Paso 2: Cargar SKILL.md (Nivel 2)**
```
Agente carga cuerpo de SKILL.md (2,000 palabras)
Lee proceso de auditoría e instrucciones principales
Ve referencias a references/performance-patterns.md
```

**Paso 3: Cargar Recursos Según Necesidad (Nivel 3)**
```
Agente determina que necesita patrones detallados de memoización
Carga references/performance-patterns.md (8,000 palabras)
También carga examples/memo-optimization.tsx
```

**Contexto total usado:** ~10,000 palabras (en lugar de 17,000 si todo se cargara inmediatamente)

#### Cómo Estructurar para Divulgación Progresiva

**Regla 1: Esencial en SKILL.md, Detalles en references/**

❌ **NO: Poner todo en SKILL.md**
```markdown
# API Testing Skill

## HTTP Methods

### GET Requests
Las peticiones GET obtienen datos del servidor. Deben ser idempotentes,
lo que significa que múltiples peticiones idénticas deben tener el mismo efecto que
una sola petición. Las peticiones GET no deben modificar el estado del servidor...

[15 párrafos más sobre GET]

### POST Requests
Las peticiones POST crean nuevos recursos en el servidor. No son
idempotentes, lo que significa que múltiples peticiones idénticas pueden crear múltiples
recursos...

[15 párrafos más sobre POST]

[Continúa para PUT, PATCH, DELETE... 8,000 palabras en total]
```

✅ **SÍ: Vista general en SKILL.md, detalles en references/**

**SKILL.md (500 palabras):**
```markdown
# API Testing Skill

## Proceso de Creación de Tests

1. Identificar endpoint y método (GET, POST, PUT, DELETE)
2. Definir casos de prueba (happy path, casos extremos, errores)
3. Crear request con headers y body apropiados
4. Verificar status, headers y body de respuesta
5. Verificar efectos secundarios (cambios en base de datos, llamadas externas)

## Vista General de Métodos HTTP

- **GET:** Obtener recursos (ver `references/http-methods.md#get`)
- **POST:** Crear recursos (ver `references/http-methods.md#post`)
- **PUT/PATCH:** Actualizar recursos (ver `references/http-methods.md#put-patch`)
- **DELETE:** Eliminar recursos (ver `references/http-methods.md#delete`)

## Información Detallada

Para especificaciones comprehensivas de métodos HTTP, mejores prácticas y ejemplos:
- Métodos HTTP: **`references/http-methods.md`**
- Autenticación: **`references/auth-patterns.md`**
- Ejemplos de Tests: directorio **`examples/`**
```

**references/http-methods.md (8,000 palabras):**
```markdown
# Referencia de Métodos HTTP

## Peticiones GET

### Especificación
Las peticiones GET obtienen datos del servidor sin modificar el estado...

[Detalles comprehensivos]

### Mejores Prácticas
[Guías detalladas]

### Patrones Comunes
[Múltiples ejemplos]

### Manejo de Errores
[Escenarios de error detallados]

## Peticiones POST
[Detalles comprehensivos para POST]

[etc.]
```

**Regla 2: Referencias Explícitas**

Cuando SKILL.md menciona un recurso, usa código en línea en negrita para hacerlo visualmente claro:

```markdown
## Patrones de Migración de Base de Datos

Para estrategias de migración seguras, ver **`references/migration-guide.md`**.

Usa **`scripts/validate-migration.sh`** para verificar la seguridad de la migración antes de aplicar.

Migraciones de ejemplo disponibles en directorio **`examples/`**.
```

Esto señala a Claude que estos recursos existen y pueden cargarse si es necesario.

**Regla 3: Ejemplos Sobre Explicaciones**

En lugar de explicar patrones en SKILL.md, referencia ejemplos funcionales:

❌ **NO:**
```markdown
Para crear un custom React hook, primero define una función que comience con "use".
Luego agrega cualquier estado que necesites con useState. Agrega efectos con useEffect si
es necesario. Asegúrate de retornar los valores o funciones que quieras exponer.
Maneja limpieza en funciones de retorno de useEffect. Considera memoización para
operaciones costosas...
```

✅ **SÍ:**
```markdown
Para crear custom hooks, ver ejemplos funcionales en **`examples/hooks/`**:
- `examples/hooks/use-fetch.ts` - Patrón de obtención de datos
- `examples/hooks/use-local-storage.ts` - Persistencia de estado
- `examples/hooks/use-debounce.ts` - Optimización de rendimiento
```

**Regla 4: Scripts para Tareas Determinísticas**

Cuando las operaciones deben realizarse exactamente de la misma manera cada vez, usa scripts en Nivel 3:

```markdown
## Validación de Migración

Validar migraciones antes de aplicar:

\`\`\`bash
./scripts/validate-migration.sh path/to/migration.sql
\`\`\`

Este script verifica:
- Operaciones inseguras (DROP sin comentarios)
- Índices faltantes en foreign keys
- Timestamps faltantes
- Reversibilidad
```

El script en sí (Nivel 3) contiene la lógica exacta de validación, mientras SKILL.md (Nivel 2) solo lo referencia.

#### Beneficios de la Divulgación Progresiva

**1. Eficiencia de Contexto**
- 20 skills @ 100 palabras cada uno = 2,000 palabras siempre cargadas
- vs. 20 skills @ 5,000 palabras cada uno = 100,000 palabras

**2. Activación Más Rápida**
- El agente escanea metadatos ligeros rápidamente
- Activa el skill correcto basándose en la descripción
- Carga solo contenido detallado relevante

**3. Latencia Reducida**
- Menos procesamiento de tokens
- Prompts más pequeños al LLM
- Generación de respuesta más rápida

**4. Reducción de Costos**
- Menos tokens de entrada por petición
- Solo pagas por contenido cargado
- Ahorros significativos a escala

**5. Escalabilidad**
- Puede tener 50+ skills en un proyecto
- El contexto permanece manejable
- Cada skill completamente detallado cuando se necesita

#### Errores Comunes

❌ **Error 1: Descripciones vagas (Nivel 1 pobre)**
```yaml
description: Ayuda con desarrollo React
```
Resultado: El skill nunca se activa porque la descripción es muy vaga.

✅ **Corrección:**
```yaml
description: Este skill debe usarse cuando se solicite "optimizar rendimiento React",
"reducir re-renders", "mejorar renderizado de componentes", o "arreglar componentes React lentos"
```

❌ **Error 2: Todo en SKILL.md (ignorando Nivel 3)**
```markdown
# Testing Skill (12,000 palabras)

[Filosofía completa de testing, todos los patrones, todos los ejemplos en línea]
```
Resultado: Consumo masivo de contexto incluso cuando la mayoría del contenido no se necesita.

✅ **Corrección:**
```markdown
# Testing Skill (1,500 palabras)

[Proceso central de testing y vista general]

Patrones detallados en references/:
- **`references/unit-testing.md`** - Patrones de unit tests
- **`references/integration-testing.md`** - Patrones de integración
- **`references/e2e-testing.md`** - Patrones E2E

Ejemplos en directorio **`examples/`**.
```

❌ **Error 3: Recursos sin referencias (Nivel 3 inaccesible)**
```
skill/
├── SKILL.md (nunca menciona references/)
└── references/
    └── detailed-guide.md (huérfano)
```
Resultado: Claude no sabe que el recurso existe, nunca lo carga.

✅ **Corrección:**
```markdown
# SKILL.md

Para patrones detallados de implementación, ver **`references/detailed-guide.md`**.
```

---

## Aplicando los Tres Principios Juntos

### Ejemplo: Skill de Validador de Schema de Base de Datos

Este ejemplo demuestra los tres principios trabajando juntos.

#### 1. Concisión (Qué incluir)

**Excluido (Claude sabe esto):**
- Básicos de SQL
- Qué son las bases de datos
- Conceptos genéricos de validación

**Incluido (Específico del dominio):**
- Reglas de seguridad específicas del proyecto
- Convenciones de nombres del equipo
- Columnas requeridas para este proyecto

#### 2. Grados de Libertad (Cuán específico ser)

**Instrucciones de texto:** Enfoque general de validación
**Pseudocódigo:** Patrón de estructura de archivo de migración
**Script exacto:** Lógica de validación de seguridad (demasiado crítico para variar)

#### 3. Divulgación Progresiva (Cuándo cargar)

**Nivel 1 - Metadatos (siempre cargado):**
```yaml
---
name: database-schema-validator
description: Este skill debe usarse cuando se solicite "validar migración de base de datos",
"verificar seguridad de migración", "revisar cambios de schema", o "verificar archivo de migración"
version: 2.0.0
---
```

**Nivel 2 - SKILL.md (cargado cuando se activa):**
```markdown
# Database Schema Validator

## Propósito
Validar migraciones de base de datos para seguridad y consistencia antes del deployment a producción.

## Proceso de Validación

### 1. El usuario proporciona ruta al archivo de migración

### 2. Ejecutar script de validación
\`\`\`bash
python scripts/validate-migration.py path/to/migration.sql
\`\`\`

### 3. Revisar salida del script

El script retorna JSON con errores, warnings y sugerencias:
\`\`\`json
{
  "valid": false,
  "errors": ["DROP TABLE sin comentario -- SAFE:"],
  "warnings": ["Falta índice en foreign key user_id"],
  "suggestions": ["Agregar índice: CREATE INDEX idx_user_id ON posts(user_id)"]
}
\`\`\`

### 4. Reportar resultados de validación

Lista todos los errores y warnings con explicaciones.

### 5. Sugerir correcciones

Proporciona SQL específico para resolver problemas.

## Reglas de Seguridad (en script de validación)

- No DROP TABLE sin comentario `-- SAFE: [razón]`
- Todas las foreign keys deben tener índices
- Todas las tablas deben tener timestamps `created_at` y `updated_at`
- ALTER TABLE debe incluir valores por defecto
- Las migraciones deben ser reversibles

## Patrones Detallados

Para mejores prácticas de migración y patrones comunes:
- **`references/migration-patterns.md`** - Técnicas de migración seguras
- **`references/rollback-procedures.md`** - Cómo manejar fallos

## Ejemplos

Ejemplos funcionales en **`examples/`**:
- `examples/add-column-safe.sql` - Adición segura de columna
- `examples/add-index.sql` - Patrón de creación de índice
- `examples/drop-table-safe.sql` - Eliminación segura de tabla
```

**Nivel 3 - Recursos (cargados según necesidad):**

**scripts/validate-migration.py:**
```python
#!/usr/bin/env python3
"""
Validar archivos de migración SQL para seguridad y mejores prácticas.
"""
import sys
import json
import re

def validate_migration(filepath):
    """Validar archivo de migración SQL"""
    with open(filepath) as f:
        sql = f.read()

    errors = []
    warnings = []
    suggestions = []

    # Verificación 1: DROP TABLE inseguro
    drop_tables = re.findall(r'DROP TABLE\s+(\w+)', sql, re.IGNORECASE)
    for table in drop_tables:
        # Buscar comentario de seguridad antes de DROP
        pattern = f'--\s*SAFE:.*\n.*DROP TABLE\s+{table}'
        if not re.search(pattern, sql, re.IGNORECASE):
            errors.append(f"DROP TABLE {table} sin comentario -- SAFE:")
            suggestions.append(
                f"Agregar comentario antes de DROP:\n"
                f"-- SAFE: Confirmado con equipo, datos respaldados\n"
                f"DROP TABLE {table};"
            )

    # Verificación 2: Foreign keys necesitan índices
    foreign_keys = re.findall(
        r'(\w+)\s+.*REFERENCES\s+\w+',
        sql,
        re.IGNORECASE
    )
    for fk_column in foreign_keys:
        # Verificar si existe índice para esta columna
        index_pattern = f'CREATE INDEX.*{fk_column}'
        if not re.search(index_pattern, sql, re.IGNORECASE):
            warnings.append(f"Foreign key {fk_column} falta índice")
            suggestions.append(
                f"CREATE INDEX idx_{fk_column} ON table_name({fk_column});"
            )

    # Verificación 3: Timestamps requeridos
    create_tables = re.findall(
        r'CREATE TABLE\s+(\w+)',
        sql,
        re.IGNORECASE
    )
    for table in create_tables:
        if 'created_at' not in sql.lower():
            warnings.append(f"Tabla {table} falta timestamp created_at")
        if 'updated_at' not in sql.lower():
            warnings.append(f"Tabla {table} falta timestamp updated_at")

    # Retornar resultados
    result = {
        "valid": len(errors) == 0,
        "errors": errors,
        "warnings": warnings,
        "suggestions": suggestions
    }

    print(json.dumps(result, indent=2))
    return 0 if result["valid"] else 1

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Uso: validate-migration.py <migration-file>")
        sys.exit(2)

    sys.exit(validate_migration(sys.argv[1]))
```

**references/migration-patterns.md:**
```markdown
# Patrones de Migración de Base de Datos

## Adición Segura de Columnas

Al agregar una columna a una tabla existente con datos:

\`\`\`sql
-- Bueno: Columna nullable (seguro para filas existentes)
ALTER TABLE users
ADD COLUMN phone_number VARCHAR(20);

-- Bueno: Columna con default (seguro para filas existentes)
ALTER TABLE users
ADD COLUMN notification_enabled BOOLEAN DEFAULT true;

-- Malo: Columna requerida sin default (rompe filas existentes)
ALTER TABLE users
ADD COLUMN email VARCHAR(255) NOT NULL;  -- ❌ Falla en datos existentes
\`\`\`

## Adición Segura de Índices

[8,000 palabras más de patrones detallados...]
```

**examples/add-column-safe.sql:**
```sql
-- Ejemplo: Adición segura de columna con migración y rollback

-- Migración Up
ALTER TABLE posts
ADD COLUMN view_count INTEGER DEFAULT 0 NOT NULL;

CREATE INDEX idx_posts_view_count ON posts(view_count);

-- Migración Down (rollback)
DROP INDEX idx_posts_view_count;
ALTER TABLE posts DROP COLUMN view_count;
```

#### Cómo Este Skill Demuestra Todos los Principios

**Concisión:**
- Excluye: Sintaxis básica de SQL, conceptos genéricos de validación
- Incluye: Reglas de seguridad específicas para este proyecto

**Grados de Libertad:**
- Instrucciones de texto: Cómo interpretar resultados de validación
- Pseudocódigo: Patrón de estructura de archivo de migración en SKILL.md
- Script exacto: Lógica de validación (crítico para seguridad, debe ser determinístico)

**Divulgación Progresiva:**
- Nivel 1: Metadatos siempre presentes (100 palabras)
- Nivel 2: SKILL.md cargado cuando se solicita validación (800 palabras)
- Nivel 3: Script, patrones, ejemplos cargados según necesidad (10,000+ palabras)

**Impacto total en contexto:**
- Sin skill: 0 palabras
- Skill activado pero recursos no necesarios: 900 palabras (metadatos + SKILL.md)
- Recursos completos cargados: 11,000 palabras (solo cuando se referencian realmente)

---

## Lista de Verificación de Diseño

Al crear o revisar un skill, verifica:

### Concisión
- [ ] Eliminado conocimiento general que Claude ya tiene
- [ ] Enfocado solo en información específica del dominio
- [ ] Excluidas explicaciones obvias
- [ ] Ejemplos concisos y relevantes
- [ ] Eliminado contenido redundante

### Grados de Libertad
- [ ] Identificado nivel de fragilidad de la tarea
- [ ] Elegida especificidad apropiada (texto/pseudocódigo/script)
- [ ] Usadas instrucciones de texto para tareas flexibles
- [ ] Usado pseudocódigo para patrones preferidos
- [ ] Usados scripts exactos para operaciones críticas de seguridad
- [ ] Orientación ajustada a consecuencias de error

### Divulgación Progresiva
- [ ] Creada descripción específica, rica en triggers (Nivel 1)
- [ ] Mantenido SKILL.md bajo 2,000 palabras idealmente, 5,000 máximo (Nivel 2)
- [ ] Movido contenido detallado a references/ (Nivel 3)
- [ ] Movidos ejemplos a examples/ (Nivel 3)
- [ ] Movidos scripts a scripts/ (Nivel 3)
- [ ] Referenciados explícitamente todos los recursos de Nivel 3 en SKILL.md
- [ ] Usado código en línea en negrita para referencias a recursos

---

## Anti-Patrones Comunes

### Anti-Patrón 1: Skill Enciclopedia

**Problema:** Incluir material de referencia comprehensivo en SKILL.md

```markdown
# API Testing Skill (15,000 palabras)

[Especificación HTTP completa]
[Todos los patrones REST]
[Cada código de estado posible con explicaciones]
[Todos los métodos de autenticación en detalle]
[etc.]
```

**Por qué falla:**
- Infla el contexto incluso cuando los detalles no se necesitan
- Ralentiza la activación
- La mayoría del contenido nunca se usa en petición típica

**Solución:** Mover a divulgación progresiva
- SKILL.md: Vista general del proceso y puntos de decisión clave
- references/: Detalles comprehensivos
- examples/: Muestras de código funcionales

### Anti-Patrón 2: Skill Sobre-Restringido

**Problema:** Proporcionar scripts exactos para tareas que necesitan flexibilidad

```markdown
# Code Review Skill

Ejecuta este comando exacto:
\`\`\`bash
eslint --fix --config .eslintrc.json src/**/*.ts
\`\`\`
```

**Por qué falla:**
- Diferentes proyectos tienen diferentes linters
- Las rutas de configuración varían
- Elimina la habilidad del agente de adaptarse

**Solución:** Usar grado de libertad apropiado
- Instrucciones de texto para qué revisar
- Ejemplos de problemas comunes
- Permitir que el agente determine cómo ejecutar herramientas en contexto

### Anti-Patrón 3: Recursos Ocultos

**Problema:** Crear recursos pero no referenciarlos en SKILL.md

```
skill/
├── SKILL.md (no menciona references/)
└── references/
    └── comprehensive-guide.md
```

**Por qué falla:**
- Claude no sabe que el recurso existe
- El recurso nunca se carga
- Esfuerzo desperdiciado creando documentación huérfana

**Solución:** Referenciar explícitamente todos los recursos

```markdown
# SKILL.md

Para patrones detallados de implementación, ver **`references/comprehensive-guide.md`**.
```

---

## Documentación Relacionada

- **[Skill Anatomy](skill-anatomy.md)** - Entendiendo los componentes de un skill
- **[Workflow](workflow.md)** - Proceso de creación paso a paso
- **[Frontmatter Guide](frontmatter.md)** - Crear metadatos efectivos
- **[Testing Skills](testing.md)** - Validar efectividad del skill

---

**Última Actualización:** 2026-02-01
**Categoría:** Desarrollo de Skills
