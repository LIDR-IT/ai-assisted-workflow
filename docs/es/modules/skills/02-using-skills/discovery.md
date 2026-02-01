# Descubriendo Skills

## Descripción General

El descubrimiento de skills es el primer paso para extender las capacidades de tu agente de IA. Con miles de skills contribuidos por la comunidad disponibles, encontrar el skill adecuado para tu necesidad específica es esencial. Esta guía cubre todos los métodos y herramientas disponibles para descubrir skills en el ecosistema.

**Métodos de Descubrimiento Clave:**
- Navegar por la plataforma skills.sh.
- Usar la herramienta find-skills.
- Buscar a través de la CLI de Skills.
- Explorar por categoría.
- Revisar los skills populares y que son tendencia.

## La Plataforma skills.sh

### ¿Qué es skills.sh?

[skills.sh](https://skills.sh) es el registro oficial y la plataforma de descubrimiento para el ecosistema abierto de skills de agentes. Sirve como el centro neurálgico donde los desarrolladores pueden navegar, buscar y explorar skills en todos los dominios.

**Características de la Plataforma:**
- **Repositorio Central:** Skills oficiales y de la comunidad en un solo lugar.
- **Funcionalidad de Búsqueda:** Encuentra skills por palabra clave o caso de uso.
- **Navegación por Categorías:** Explora skills organizados por dominio.
- **Métricas de Instalación:** Mira las estadísticas de popularidad y adopción.
- **Centro de Documentación:** Descripciones detalladas de los skills y ejemplos de uso.
- **Gestión de Versiones:** Rastrea las versiones y actualizaciones de los skills.
- **Indicadores de Calidad:** Etiquetas de "Tendencia", "Hot" y conteo de instalaciones.

### Estructura de la URL

Los skills se organizan utilizando un patrón de URL consistente:

```
https://skills.sh/<propietario>/<repo>/<nombre-del-skill>
```

**Ejemplos:**
```
https://skills.sh/vercel-labs/skills/find-skills
https://skills.sh/vercel-labs/skills/vercel-react-best-practices
https://skills.sh/vercel-labs/skills/web-design-guidelines
```

### Navegación por Categoría

La plataforma skills.sh organiza los skills en categorías principales, lo que facilita la exploración de capacidades específicas de cada dominio:

#### 1. Desarrollo (Development)

**Enfoque:** Lenguajes de programación, frameworks y mejores prácticas de desarrollo.

**Skills Populares:**
- **vercel-react-best-practices** (72.7K instalaciones)
  - Patrones de optimización de React.
  - Mejores prácticas de rendimiento.
  - Patrones modernos de React.
- **Next.js patterns** — App Router, Server Components, despliegue.
- **Vue expertise** — Vue 3 Composition API, reactividad, componentes.
- **TypeScript patterns** — Seguridad de tipos, tipos avanzados, genéricos.

#### 2. Diseño (Design)

**Enfoque:** UI/UX, diseño visual, accesibilidad, experiencia de usuario.

**Skills Populares:**
- **web-design-guidelines** (55.1K instalaciones)
  - Estándares de accesibilidad.
  - Patrones de diseño responsivo.
  - Implementación de sistemas de diseño.
- **UI/UX patterns** — Librerías de componentes, tokens de diseño, flujos de usuario.
- **Frontend design** — Técnicas de layout, animaciones, arquitectura CSS.

#### 3. Infraestructura (Infrastructure)

**Enfoque:** DevOps, despliegue, plataformas en la nube, contenedores.

**Skills Populares:**
- **Supabase integration** — Configuración de base de datos, autenticación, tiempo real.
- **Deployment pipelines** — Flujos de trabajo de CI/CD, pruebas automatizadas, lanzamientos.
- **Kubernetes patterns** — Orquestación de contenedores, escalado, service mesh.

#### 4. Marketing

**Enfoque:** SEO, estrategia de contenido, redacción publicitaria, analítica.

**Skills Populares:**
- **SEO audits** — SEO técnico, optimización de contenido, rendimiento.
- **copywriting** (48.2K instalaciones) — Optimización de conversión, voz de marca, CTAs.
- **Content strategy** — Planificación de contenido, distribución, analítica.

#### 5. Negocios (Business)

**Enfoque:** Estrategia, planificación, análisis, precios.

**Skills Populares:**
- **Pricing strategy** — Modelos de precios, precios basados en valor, análisis competitivo.
- **Launch planning** — Estrategia de salida al mercado, listas de verificación de lanzamiento, métricas.
- **Market analysis** — Investigación de competidores, dimensionamiento del mercado, tendencias.

#### 6. Herramientas Especializadas (Specialized Tools)

**Enfoque:** Manejo de archivos, automatización, integraciones.

**Skills Populares:**
- **Manejo de PDF/PPTX/XLSX** — Generación de documentos, extracción de datos, conversión.
- **Automatización del navegador** — Web scraping, pruebas, automatización de flujos de trabajo.
- **Flujos de trabajo de correo electrónico** — Plantillas de correo, reglas de automatización, integraciones.

### Indicadores de Calidad

Entender las métricas de calidad te ayuda a elegir los skills adecuados:

#### Conteo de Instalaciones

**Instalaciones altas (>50K):**
- Validados por la comunidad.
- Listos para producción.
- Bien documentados.
- Mantenidos activamente.

**Instalaciones medias (10K-50K):**
- Adopción creciente.
- Casos de uso especializados.
- Experiencia en un nicho.
- Patrones emergentes.

**Instalaciones bajas (<10K):**
- Nuevos lanzamientos.
- Características experimentales.
- Altamente especializado.
- Fase beta/pruebas.

#### Métricas basadas en el Tiempo

**Histórico (All Time):**
- Instalaciones totales de por vida.
- Indicador de valor a largo plazo.
- Utilidad sostenida.

**Tendencia (24h):**
- Pico reciente de popularidad.
- Nuevos descubrimientos.
- Adopción rápida.
- Necesidades emergentes.

**Hot:**
- Crecimiento de alta velocidad.
- Adopción consistente.
- Relevancia actual.
- Capacidades esenciales.

## La Herramienta de Descubrimiento find-skills

### Descripción General

**find-skills** es un skill especializado que actúa como una capa de descubrimiento para todo el ecosistema. Con 56.5K instalaciones, es una de las herramientas más populares en el registro de skills.

**Propósito:** Ayudar a los usuarios a descubrir e instalar skills a través de un sistema inteligente de búsqueda y recomendaciones.

**Fuente:** [skills.sh/vercel-labs/skills/find-skills](https://skills.sh/vercel-labs/skills/find-skills)

### Cuándo usar find-skills

Utiliza find-skills cuando:
- Preguntes **"¿cómo hago X?"** donde X es una tarea común con skills existentes.
- Solicites el descubrimiento de skills: **"encuentra un skill para X"**.
- Preguntes sobre capacidades especializadas: **"¿hay algún skill que pueda...?"**.
- Quieras extender la funcionalidad del agente.
- Busques herramientas, plantillas o flujos de trabajo específicos de un dominio.
- Necesites capacidades más allá del agente base.

### Instalando find-skills

```bash
npx skills add vercel-labs/skills@find-skills -g -y
```

**Parámetros:**
- `-g` — Instalación global (disponible en todos los proyectos).
- `-y` — Aceptación automática (omite el mensaje de confirmación).

### Usando find-skills

Una vez instalado, find-skills se integra con tu agente de IA y se activa automáticamente cuando expresas necesidades de descubrimiento:

**Consultas en lenguaje natural:**
```
"Encuentra un skill para la optimización del rendimiento en React"
"¿Hay algún skill para el despliegue con Docker?"
"Ayúdame a encontrar skills de pruebas E2E"
"¿Qué skills hay disponibles para SEO?"
```

**Invocación directa:**
```bash
npx skills find react performance
npx skills find docker deployment
npx skills find testing e2e
```

La herramienta busca en el ecosistema y presenta resultados relevantes con:
- Nombre del skill y descripción.
- Comando de instalación listo para copiar.
- Enlace a la página de skills.sh para más detalles.

## Comandos de la CLI de Skills

### Descripción General

La **CLI de Skills** es el gestor de paquetes centralizado para los skills del agente, operando de manera similar a npm pero diseñado específicamente para capacidades de agentes de IA.

**Paquete:** `skills` (npm)
**Última Versión:** 1.0.6
**Instalación:** `npm i skills`

### Comandos Principales

#### 1. Buscar Skills (Find)

Busca skills de forma interactiva o por palabra clave:

```bash
npx skills find [consulta]
```

**Ejemplos:**

```bash
# Búsqueda interactiva (abre el navegador)
npx skills find

# Búsqueda por palabra clave
npx skills find react performance
npx skills find docker deployment
npx skills find testing e2e
npx skills find copywriting
```

**Qué hace:**
- Busca en el registro de skills por palabra clave.
- Muestra los skills coincidentes con sus descripciones.
- Muestra los conteos de instalación.
- Proporciona comandos de instalación.

#### 2. Agregar Skills (Add)

Instala skills desde el registro:

```bash
npx skills add <propietario/repo>
npx skills add <propietario/repo>@<nombre-del-skill>
```

**Ejemplos:**

```bash
# Instalar un skill específico
npx skills add vercel-labs/skills@vercel-react-best-practices

# Instalar con parámetros
npx skills add vercel-labs/skills@react-performance -g -y

# Instalar desde un repo personalizado
npx skills add username/custom-skills
```

**Parámetros Comunes:**
- `-g` — Instalar globalmente (disponible en todos los proyectos).
- `-y` — Aceptación automática (omite la confirmación).
- `--skill` — Especificar el nombre del skill.

#### 3. Comprobar Actualizaciones (Check)

Comprueba si hay actualizaciones para los skills instalados:

```bash
npx skills check
```

**Ejemplo de salida:**
```
Comprobando actualizaciones de los skills...
✓ vercel-react-best-practices (actual: 2.1.0, más reciente: 2.2.0)
✓ web-design-guidelines (actual: 1.5.0, más reciente: 1.5.0)
✓ find-skills (actual: 1.3.0, más reciente: 1.4.0)
```

#### 4. Actualizar Skills (Update)

Actualiza todos los skills instalados:

```bash
npx skills update
```

**Actualizar un skill específico:**
```bash
npx skills update <nombre-del-skill>
```

**Ejemplo:**
```bash
npx skills update vercel-react-best-practices
```

## Flujo de Trabajo de Descubrimiento

### Proceso de Descubrimiento Paso a Paso

#### Paso 1: Identifica tus Necesidades

Determina:
- **Dominio:** ¿En qué área estás trabajando? (desarrollo web, DevOps, diseño, etc.)
- **Tarea específica:** ¿Qué quieres lograr?
- **Probabilidad del skill:** ¿Es esta una necesidad común con soluciones existentes?

**Ejemplos:**
- "Necesito patrones de rendimiento de React" → Dominio de desarrollo, tarea de optimización.
- "Quiero mejorar el texto de mi página de aterrizaje" → Dominio de marketing, tarea de redacción.
- "Necesito configurar el despliegue con Docker" → Dominio de infraestructura, tarea de despliegue.

#### Paso 2: Elige el Método de Descubrimiento

**Navegar en skills.sh:**
- Ideal para: Explorar opciones, descubrir nuevos skills.
- Úsalo cuando: No estés seguro de qué necesitas exactamente.
- Estrategia: Empieza por categoría, filtra por popularidad.

**Usar find-skills:**
- Ideal para: Búsquedas dirigidas, necesidades específicas.
- Úsalo cuando: Sepas lo que estás buscando.
- Estrategia: Búsqueda en lenguaje natural o por palabra clave.

**Búsqueda en la CLI:**
- Ideal para: Flujo de trabajo en la línea de comandos, instalación rápida.
- Úsalo cuando: Prefieras el descubrimiento basado en la terminal.
- Estrategia: `npx skills find` con palabras clave específicas.

#### Paso 3: Busca con Consultas Dirigidas

**Buenas consultas de búsqueda:**
```bash
# Específicas y enfocadas
npx skills find react performance
npx skills find docker deployment
npx skills find playwright e2e
npx skills find seo audit

# Dominio + tarea
npx skills find frontend design
npx skills find backend api
npx skills find devops automation
```

**Consultas de búsqueda deficientes:**
```bash
# Muy vagos
npx skills find help
npx skills find coding
npx skills find web
```

#### Paso 4: Evalúa los Resultados

Compara los skills basándote en:
- **Relevancia:** ¿Se ajusta exactamente a tu necesidad?
- **Conteo de instalaciones:** Más alto = más validado.
- **Descripción:** ¿Explicación clara de las capacidades?
- **Fuente:** ¿Editor de confianza o contribuyente de la comunidad?
- **Reciente:** ¿Actualizado recientemente o antiguo?

#### Paso 5: Revisa la Documentación

Antes de instalar, visita la página del skill en skills.sh:

```
https://skills.sh/<propietario>/<repo>/<nombre-del-skill>
```

Comprueba:
- Descripción detallada.
- Casos de uso y ejemplos.
- Requisitos previos.
- Skills relacionados.
- Comentarios de la comunidad.

#### Paso 6: Instala y Prueba

Instala el skill:

```bash
npx skills add <propietario/repo>@<nombre-del-skill> -g -y
```

**Verificación:**
1. Confirma que la instalación fue exitosa.
2. Comprueba que el skill esté disponible para el agente.
3. Prueba con una consulta relevante.
4. Verifica el comportamiento esperado.

## Estrategias de Descubrimiento

### Estrategia 1: Exploración de Arriba hacia Abajo (Top-Down)

**Ideal para:** Aprender sobre el ecosistema, encontrar skills de propósito general.

**Proceso:**
1. Navega por skills.sh por categoría.
2. Revisa los mejores skills de todos los tiempos ("All Time").
3. Instala los skills con mayor calificación en tu dominio.
4. Explora skills relacionados.
5. Construye un conjunto de skills fundamental.

**Ejemplo:**
```
Categoría Desarrollo → React → vercel-react-best-practices
Categoría Diseño → Diseño Web → web-design-guidelines
Categoría Marketing → Redacción Publicitaria → copywriting
```

### Estrategia 2: Búsqueda basada en la Necesidad

**Ideal para:** Resolver problemas específicos, descubrimiento dirigido.

**Proceso:**
1. Identifica la tarea específica.
2. Busca con palabras clave enfocadas.
3. Compara los primeros 3-5 resultados.
4. Revisa la documentación.
5. Instala la mejor opción.

**Ejemplo:**
```
Necesidad: Optimización del rendimiento en React
Búsqueda: "react performance"
Resultados: react-performance, react-rendering-patterns, react-profiling
Elegir: react-performance (más instalaciones + mejor descripción)
Instalar: npx skills add vercel-labs/skills@react-performance
```

### Estrategia 3: Seguir las Tendencias

**Ideal para:** Mantenerse actualizado, descubrir patrones emergentes.

**Proceso:**
1. Revisa las tendencias de las últimas 24h ("Trending 24h") en skills.sh.
2. Revisa los skills "Hot".
3. Investiga los que tengan un crecimiento rápido.
4. Lee las descripciones.
5. Instala los skills prometedores.

**Ejemplo:**
```
Tendencia: new-framework-skill (pico de 100 → 5K instalaciones)
Investigar: Mira qué problema resuelve.
Probar: Instalar en un proyecto de prueba.
Adoptar: Agregar a los proyectos principales si es valioso.
```

### Estrategia 4: Skills Complementarios

**Ideal para:** Construir conjuntos de capacidades integrales.

**Proceso:**
1. Instala un skill central.
2. Revisa la sección de "Skills Relacionados".
3. Identifica capacidades complementarias.
4. Instala combinaciones de skills.

**Ejemplo:**
```
Principal: react-best-practices
Relacionados: typescript-patterns, testing-strategies, performance-optimization
Resultado: Conjunto completo de skills para el desarrollo en React.
```

## Mejores Prácticas

### Mejores Prácticas de Descubrimiento

1. **Busca antes de construir**
   - Siempre comprueba si existe un skill antes de crear una solución personalizada.
   - Usa múltiples términos de búsqueda si el primer intento falla.
   - Navega por la categoría incluso si la búsqueda no da resultados.

2. **Usa consultas específicas**
   - Incluye palabras clave del dominio (react, docker, seo).
   - Agrega el tipo de tarea (rendimiento, despliegue, pruebas).
   - Combina términos relacionados (optimizacion rendimiento react).

3. **Revisa la documentación del skill**
   - Lee la descripción completa en skills.sh.
   - Revisa los ejemplos y casos de uso.
   - Verifica los requisitos previos.
   - Busca actualizaciones recientes.

4. **Comprueba los indicadores de calidad**
   - Más instalaciones = más validado.
   - Actualizaciones recientes = mantenido activamente.
   - Estado de tendencia = valor emergente.
   - Etiqueta "Hot" = crecimiento sostenido.

5. **Prueba antes de comprometer**
   - Pruébalo en un proyecto de prueba primero.
   - Verifica el comportamiento esperado.
   - Comprueba si hay conflictos.
   - Evalúa el valor real.

### Mejores Prácticas de Instalación

1. **Global vs. Local**
   ```bash
   # Global: Para skills de propósito general usados en varios proyectos
   npx skills add vercel-labs/skills@react-best-practices -g

   # Local: Para skills específicos de un proyecto
   npx skills add empresa/estandares-internos
   ```

2. **Fijación de Versiones (Version Pinning)**
   ```bash
   # Producción: Fijar a una versión específica
   npx skills add skill@1.2.3

   # Desarrollo: Usar la más reciente
   npx skills add skill
   ```

3. **Instalación por Lotes**
   ```bash
   # Instalar múltiples skills a la vez
   npx skills add vercel-labs/skills@react -g -y
   npx skills add vercel-labs/skills@typescript -g -y
   npx skills add vercel-labs/skills@testing -g -y
   ```

4. **Documentación**
   - Documenta los skills instalados en el README del proyecto.
   - Rastrea los números de versión.
   - Anota por qué se eligió cada skill.
   - Lista las dependencias del skill.

### Mejores Prácticas de Mantenimiento

1. **Actualizaciones regulares**
   ```bash
   # Semanal o mensualmente
   npx skills check
   npx skills update
   ```

2. **Auditoría de skills**
   - Revisa los skills instalados trimestralmente.
   - Elimina los skills que no uses.
   - Busca mejores alternativas.
   - Actualiza la documentación.

3. **Mantente informado**
   - Sigue las tendencias en skills.sh.
   - Comprueba si hay nuevos lanzamientos.
   - Monitorea las discusiones de la comunidad.
   - Suscríbete a las actualizaciones de los skills.

## Patrones de Descubrimiento Comunes

### Patrón 1: Descubrimiento de Skills para un Framework

**Escenario:** Empezando un nuevo proyecto de React.

**Flujo de descubrimiento:**
```bash
# 1. Buscar skills para React
npx skills find react

# 2. Instalar el skill central del framework
npx skills add vercel-labs/skills@vercel-react-best-practices -g

# 3. Encontrar skills relacionados
npx skills find react performance
npx skills find react testing

# 4. Construir el conjunto de skills
npx skills add react-performance -g
npx skills add react-testing -g
npx skills add typescript-react -g
```

### Patrón 2: Descubrimiento para la Resolución de Problemas

**Escenario:** El rendimiento de la aplicación es lento.

**Flujo de descubrimiento:**
```bash
# 1. Identificar el dominio del problema
# Problema: App React lenta → Optimización de rendimiento

# 2. Buscar la solución
npx skills find react performance optimization

# 3. Revisar los mejores resultados
# - react-performance-patterns
# - react-rendering-optimization
# - performance-profiling

# 4. Instalar la mejor coincidencia
npx skills add react-performance-patterns -g
```

### Patrón 3: Descubrimiento para el Aprendizaje

**Escenario:** Quieres aprender las mejores prácticas de Docker.

**Flujo de descubrimiento:**
```bash
# 1. Navegar por la categoría de infraestructura en skills.sh
Categoría: Infraestructura → Contenedores

# 2. Revisar los mejores skills de Docker
# - docker-best-practices (muchas instalaciones)
# - docker-deployment (tendencia)
# - kubernetes-docker (relacionado)

# 3. Instalar la ruta de aprendizaje
npx skills add docker-best-practices -g
npx skills add docker-deployment -g
```

## Solución de Problemas de Descubrimiento

### Skill No Encontrado

**Problema:** La búsqueda no devuelve resultados.

**Soluciones:**
1. **Prueba palabras clave alternativas**
   ```bash
   # En lugar de:
   npx skills find autenticación

   # Prueba:
   npx skills find auth
   npx skills find login
   npx skills find user security
   ```

2. **Navega por las categorías en skills.sh**
   - Visita [skills.sh](https://skills.sh).
   - Navega a la categoría relevante.
   - Explora manualmente los skills disponibles.

3. **Busca con términos más amplios**
   ```bash
   # Muy específico:
   npx skills find react hooks optimization patterns

   # Mejor:
   npx skills find react performance
   ```

### Demasiados Resultados

**Problema:** La búsqueda devuelve un número abrumador de skills.

**Soluciones:**
1. **Agrega palabras clave más específicas**
   ```bash
   # Muy amplio:
   npx skills find testing

   # Más específico:
   npx skills find react testing jest
   npx skills find e2e playwright
   ```

2. **Filtra por conteo de instalaciones**
   - Revisa la plataforma skills.sh.
   - Ordena por instalaciones históricas ("All Time").
   - Enfócate en los primeros 3-5 resultados.

3. **Usa los filtros de categoría**
   - Navega a una categoría específica.
   - Aplica filtros de dominio.
   - Refina por subcategoría.

### El Propósito del Skill no está Claro

**Problema:** La descripción del skill es vaga.

**Soluciones:**
1. **Visita la página de skills.sh**
   ```
   https://skills.sh/<propietario>/<repo>/<nombre-del-skill>
   ```

2. **Revisa el repositorio fuente**
   - Busca el enlace de GitHub.
   - Lee el README detallado.
   - Revisa ejemplos y casos de uso.

3. **Revisa las métricas de instalación**
   - Muchas instalaciones = probablemente valioso.
   - En tendencia = ganando tracción.
   - Pocas instalaciones = podría ser experimental.

## Recursos de Descubrimiento

### Recursos Oficiales

- **Plataforma Skills.sh:** [https://skills.sh](https://skills.sh)
  - Explora todos los skills.
  - Busca por palabra clave.
  - Filtra por categoría.
  - Revisa las métricas de popularidad.

- **Documentación de la CLI de Skills:** [paquete npm: skills](https://www.npmjs.com/package/skills)
  - Referencia de comandos CLI.
  - Instrucciones de instalación.
  - Ejemplos de uso.

- **Herramienta find-skills:** [skills.sh/vercel-labs/skills/find-skills](https://skills.sh/vercel-labs/skills/find-skills)
  - Descubrimiento interactivo.
  - Recomendaciones inteligentes.
  - Patrones de uso.

### Documentación Relacionada

**En Este Módulo:**
- [Guía de Instalación](./installation.md) — Cómo instalar los skills descubiertos.
- [Guía de Uso](./usage.md) — Cómo usar los skills instalados de forma efectiva.
- [Guía de Gestión](./management.md) — Cómo gestionar tu colección de skills.

**Referencias:**
- [Descripción General del Ecosistema de Skills](../../references/skills/skills-ecosystem-overview.md) — Guía completa del ecosistema.
- [Referencia de find-skills](../../references/skills/find-skills-vercel.md) — Documentación detallada de find-skills.
- [Referencia de la CLI de Skills](../../references/skills/npm-skills-package.md) — Documentación completa de la CLI.

## Resumen

El descubrimiento efectivo de skills es esencial para maximizar las capacidades de tu agente de IA:

**Puntos Clave:**
- Navega por skills.sh para la exploración y el aprendizaje.
- Usa find-skills para un descubrimiento inteligente.
- Busca a través de la CLI para un flujo de trabajo rápido en la terminal.
- Filtra por indicadores de calidad (conteos de instalación, tendencia, hot).
- Revisa la documentación antes de instalar.
- Prueba los skills antes de comprometerte para producción.
- Mantén los skills actualizados y bien documentados.

**Flujo de Descubrimiento:**
1. Identificar necesidad → 2. Buscar con palabras clave específicas → 3. Evaluar resultados → 4. Revisa la documentación → 5. Instala y prueba → 6. Integra y mantén.

Con más de 56K instalaciones semanales solo de find-skills y más de 72K instalaciones de los mejores skills, el ecosistema está maduro, activo y en continuo crecimiento. Aprovecha el conocimiento colectivo de la comunidad descubriendo e instalando los skills que se ajusten a tus necesidades específicas.

---

**Siguientes Pasos:**
- [Aprende cómo instalar skills](./installation.md)
- [Entiende los patrones de uso de los skills](./usage.md)
- [Domina la gestión de skills](./management.md)
