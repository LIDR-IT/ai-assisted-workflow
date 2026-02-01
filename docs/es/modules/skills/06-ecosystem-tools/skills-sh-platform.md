# Plataforma de Mercado Skills.sh

## Descripción General

**Skills.sh** es el registro oficial y plataforma de descubrimiento para el ecosistema abierto de skills de agentes. Sirve como el mercado central donde los desarrolladores pueden explorar, buscar y descubrir miles de skills contribuidas por la comunidad, diseñadas para mejorar a los agentes de IA con conocimiento procedimental especializado.

**Sitio Oficial:** [https://skills.sh](https://skills.sh)

**Propósito de la Plataforma:**
- Directorio central de capacidades de agentes reutilizables
- Interfaz de descubrimiento para explorar y buscar skills
- Hub comunitario para compartir experiencia
- Métricas de calidad y validación a través de conteos de instalación
- Gestión y seguimiento de versiones

Con más de 72,000 instalaciones para las skills principales y crecimiento consistente en todas las categorías, skills.sh se ha convertido en el mercado principal para capacidades de agentes de IA, similar a cómo npm sirve al ecosistema JavaScript o PyPI sirve a Python.

## Vista General de la Plataforma

### ¿Qué es Skills.sh?

Skills.sh es una plataforma de ecosistema abierto que aloja capacidades reutilizables para agentes de IA. A diferencia de los registros de paquetes tradicionales que distribuyen bibliotecas de código, skills.sh distribuye conocimiento procedimental — las instrucciones "cómo hacer" que enseñan a los agentes de IA a realizar tareas específicas, seguir mejores prácticas específicas del dominio y ejecutar flujos de trabajo complejos.

**Concepto Central:**
En lugar de explicar los mismos patrones y procedimientos repetidamente a tu agente de IA, instalas un skill una vez y el agente tiene acceso permanente a ese conocimiento especializado.

### Concepto de Directorio Central

Skills.sh opera como un registro centralizado donde:

**Los Publicadores** pueden:
- Compartir experiencia con la comunidad
- Distribuir mejores prácticas entre equipos
- Construir reputación en dominios específicos
- Contribuir al ecosistema de agentes de IA

**Los Usuarios** pueden:
- Descubrir skills navegando categorías
- Buscar capacidades específicas
- Comparar skills similares
- Instalar con un solo comando
- Rastrear versiones y actualizaciones

**La Plataforma** proporciona:
- Formato de skill estandarizado (SKILL.md)
- Indicadores de calidad (conteos de instalación, estado de tendencia)
- Hub de documentación
- Control de versiones
- Validación comunitaria

### Interfaz de Descubrimiento

La interfaz de descubrimiento de skills.sh ofrece múltiples caminos para encontrar skills relevantes:

**Navegar por Categoría:**
- Organizado en dominios principales (Development, Design, Infrastructure, Marketing, Business, Tools)
- Subcategorías para áreas especializadas
- Colecciones curadas de skills relacionados

**Funcionalidad de Búsqueda:**
- Búsqueda basada en palabras clave
- Consultas multi-término
- Clasificación por relevancia
- Filtrado por conteo de instalación
- Ordenamiento por estado de tendencia

**Métricas de Calidad:**
- Conteos de instalación (All Time, 24h, Hot)
- Indicadores de tendencia
- Validación comunitaria
- Seguimiento de versiones

**Hub de Documentación:**
- Descripciones detalladas de skills
- Casos de uso y ejemplos
- Instrucciones de instalación
- Prerrequisitos y dependencias
- Skills relacionados

## Características de la Plataforma

### 1. Navegar por Categoría

Skills.sh organiza el ecosistema en seis categorías principales, haciendo el descubrimiento específico del dominio intuitivo y eficiente.

**Estructura de Categorías:**
```
Development/
├── Frameworks (React, Vue, Angular, Next.js)
├── Languages (TypeScript, JavaScript, Python)
├── Best Practices (Code quality, performance, testing)
└── Tools (Build systems, linters, formatters)

Design/
├── UI/UX (Component design, user flows)
├── Accessibility (WCAG compliance, a11y patterns)
├── Visual Design (Layout, typography, color)
└── Design Systems (Tokens, components, guidelines)

Infrastructure/
├── Cloud Platforms (AWS, Azure, GCP, Supabase)
├── DevOps (CI/CD, deployment, monitoring)
├── Containers (Docker, Kubernetes, orchestration)
└── Security (Auth, encryption, compliance)

Marketing/
├── SEO (Technical SEO, content optimization)
├── Copywriting (Conversion, brand voice, CTAs)
├── Content Strategy (Planning, distribution, analytics)
└── Analytics (Metrics, tracking, insights)

Business/
├── Strategy (Market analysis, competitive research)
├── Pricing (Models, value-based pricing)
├── Launch (Go-to-market, checklists, metrics)
└── Operations (Process optimization, workflows)

Specialized Tools/
├── File Handling (PDF, PPTX, XLSX, documents)
├── Automation (Browser, email, workflows)
├── Integrations (APIs, third-party services)
└── Data Processing (ETL, transformation, analysis)
```

### 2. Funcionalidad de Búsqueda

El motor de búsqueda de la plataforma permite el descubrimiento preciso de skills a través de coincidencia de palabras clave y clasificación por relevancia.

**Características de Búsqueda:**
- **Coincidencia de palabras clave:** Buscar por nombre de skill, descripción o etiquetas
- **Consultas multi-término:** Combinar palabras clave para precisión (ej., "react performance optimization")
- **Clasificación por relevancia:** Resultados ordenados por calidad de coincidencia y popularidad
- **Coincidencia difusa:** Encuentra skills incluso con ligeras variaciones ortográficas
- **Filtrado por categoría:** Reducir resultados a dominios específicos

**Ejemplos de Búsqueda:**
```bash
# Específico de framework
Search: "react performance"
Results: vercel-react-best-practices, react-rendering-patterns, react-profiling

# Orientado a tareas
Search: "docker deployment"
Results: docker-best-practices, kubernetes-deployment, container-optimization

# Enfocado en dominio
Search: "copywriting conversion"
Results: copywriting, landing-page-copy, email-marketing-copy
```

**Mejores Prácticas de Búsqueda:**
- Ser específico: "react hooks optimization" vs. "react"
- Incluir dominio: "frontend design" vs. "design"
- Combinar tarea + herramienta: "playwright e2e testing"
- Usar terminología común: "auth" puede funcionar mejor que "authentication"

### 3. Estadísticas e Indicadores de Instalación

Skills.sh proporciona transparencia a través de métricas de instalación, permitiendo la selección de skills basada en datos.

**Métricas Rastreadas:**

**Conteo de Instalación (All Time):**
- Total de instalaciones a lo largo de la vida
- Indicador de valor a largo plazo
- Señal de validación comunitaria
- Medidor de preparación para producción

**Trending (24h):**
- Velocidad de instalación reciente
- Picos repentinos de popularidad
- Nuevos descubrimientos
- Indicador de necesidades emergentes

**Hot:**
- Alto crecimiento sostenido
- Tasa de adopción consistente
- Relevancia actual
- Marcador de capacidad esencial

**Interpretación de Métricas:**

| Conteo de Instalación | Interpretación |
|---------------|----------------|
| >50K | Validado por la comunidad, listo para producción, bien documentado, mantenido activamente |
| 10K-50K | Adopción en crecimiento, casos de uso especializados, experiencia de nicho, patrones emergentes |
| <10K | Nuevos lanzamientos, experimental, altamente especializado, beta/prueba |

**Ejemplos de Métricas:**
```
vercel-react-best-practices: 72.7K installs (All Time)
  → Altamente validado, guía de React lista para producción

find-skills: 56.5K installs (All Time)
  → Herramienta de descubrimiento esencial, ampliamente adoptada

web-design-guidelines: 55.1K installs (All Time)
  → Estándares de diseño confiables, favorito de la comunidad

copywriting: 48.2K installs (All Time)
  → Patrones de copywriting probados, fuerte adopción

mcp-integration: 45.3K installs (All Time)
  → Skill de integración crítica, necesidad creciente
```

### 4. Gestión de Versiones

Skills.sh rastrea versiones de skills, permitiendo:
- Despliegues de producción estables
- Actualizaciones controladas
- Compatibilidad hacia atrás
- Seguimiento de cambios

**Características de Versiones:**
- **Versionado semántico:** Major.minor.patch (ej., 2.1.3)
- **Notificaciones de actualización:** Alertas cuando hay nuevas versiones disponibles
- **Seguimiento de changelog:** Ver qué cambió entre versiones
- **Soporte de fijación:** Bloquear a versión específica

**Comandos de Versiones:**
```bash
# Instalar última versión
npx skills add vercel-labs/skills@react-best-practices

# Instalar versión específica
npx skills add vercel-labs/skills@react-best-practices@2.1.0

# Verificar actualizaciones
npx skills check

# Actualizar a la última
npx skills update react-best-practices
```

### 5. Contribuciones de la Comunidad

Skills.sh prospera con la participación comunitaria, con miles de contribuidores compartiendo experiencia.

**Beneficios de Contribución:**
- Compartir conocimiento especializado
- Construir reputación profesional
- Ayudar a estandarizar mejores prácticas
- Recibir retroalimentación de la comunidad
- Iterar basado en patrones de uso

**Contribuidores Populares:**
- **vercel-labs:** Skills oficiales de Vercel (React, Next.js, web design)
- **Expertos de la comunidad:** Especialistas del dominio compartiendo conocimiento de nicho
- **Organizaciones:** Empresas compartiendo mejores prácticas internas
- **Mantenedores de código abierto:** Guía específica de frameworks

**Proceso de Contribución:**
1. Crear skill en formato SKILL.md
2. Probar con agentes de IA
3. Publicar en repositorio de GitHub
4. Enviar al directorio de skills.sh
5. Promover y mantener

### 6. Estructura de URL

Skills.sh usa un patrón de URL consistente y predecible que refleja la estructura del repositorio.

**Patrón:**
```
https://skills.sh/<owner>/<repo>/<skill-name>
```

**Componentes:**
- `owner`: Nombre de usuario u organización de GitHub
- `repo`: Nombre del repositorio
- `skill-name`: Identificador específico del skill

**Ejemplos:**
```
https://skills.sh/vercel-labs/skills/find-skills
https://skills.sh/vercel-labs/skills/vercel-react-best-practices
https://skills.sh/vercel-labs/skills/web-design-guidelines
https://skills.sh/vercel-labs/skills/copywriting
https://skills.sh/vercel-labs/skills/mcp-integration
```

**Beneficios de URL:**
- Enlaces directos a skills específicos
- Navegación de repositorio
- Compartir skills vía enlace
- Marcar skills favoritos
- Incrustar en documentación

## Categorías de Skills Populares

### 1. Development

**Enfoque:** Lenguajes de programación, frameworks, bibliotecas y mejores prácticas de desarrollo

**Descripción:**
La categoría Development abarca skills para el desarrollo moderno de software, incluyendo patrones específicos de frameworks, mejores prácticas de lenguajes, estrategias de testing y optimización de rendimiento. Estos skills ayudan a los desarrolladores a escribir mejor código, seguir estándares de la industria y evitar errores comunes.

**Skills Populares:**

**vercel-react-best-practices** (72.7K installs)
- Patrones de optimización de React
- Patrones modernos de React (hooks, context, suspense)
- Mejores prácticas de rendimiento
- Arquitectura de componentes
- Estrategias de gestión de estado
- Guía de Server Components

**Patrones de Next.js**
- Mejores prácticas de App Router
- Server Components vs. Client Components
- Optimización de despliegue
- Patrones de rutas de API
- Incremental Static Regeneration
- Uso de Edge runtime

**Experiencia en Vue**
- Vue 3 Composition API
- Patrones del sistema de reactividad
- Principios de diseño de componentes
- Gestión de estado con Pinia
- Navegación con Vue Router
- Integración con Nuxt.js

**Patrones de TypeScript**
- Estrategias de seguridad de tipos
- Técnicas avanzadas de tipos
- Genéricos y utilidades
- Configuración de modo estricto
- Tipado de bibliotecas de terceros
- Configuración de TypeScript en monorepo

**Ejemplos:**
```bash
# Instalar mejores prácticas de React
npx skills add vercel-labs/skills@vercel-react-best-practices -g

# Instalar patrones de TypeScript
npx skills add typescript-patterns -g

# Instalar estrategias de testing
npx skills add testing-best-practices -g
```

### 2. Design

**Enfoque:** Diseño UI/UX, diseño visual, accesibilidad, patrones de experiencia de usuario

**Descripción:**
Los skills de diseño proporcionan guía sobre la creación de interfaces de usuario accesibles, responsivas y visualmente atractivas. Cubren sistemas de diseño, bibliotecas de componentes, estándares de accesibilidad y principios de experiencia de usuario que aseguran que las aplicaciones sean tanto bellas como utilizables.

**Skills Populares:**

**web-design-guidelines** (55.1K installs)
- Estándares de accesibilidad (cumplimiento WCAG)
- Patrones de diseño responsivo
- Implementación de sistemas de diseño
- Mejores prácticas de tipografía
- Teoría y uso del color
- Técnicas de layout

**Patrones de UI/UX**
- Diseño de bibliotecas de componentes
- Tokens de diseño y tematización
- Optimización de flujos de usuario
- Patrones de interacción
- Micro-interacciones
- Procesos de handoff de diseño

**Diseño frontend**
- Técnicas modernas de layout (Grid, Flexbox)
- Arquitectura CSS (BEM, CSS Modules, Tailwind)
- Patrones de animación
- Diseño mobile-first
- Mejora progresiva
- Optimización de rendimiento

**Ejemplos:**
```bash
# Instalar guías de diseño web
npx skills add vercel-labs/skills@web-design-guidelines -g

# Instalar patrones de accesibilidad
npx skills add a11y-best-practices -g

# Instalar diseño de componentes
npx skills add component-library-design -g
```

### 3. Infrastructure

**Enfoque:** DevOps, despliegue, plataformas cloud, containerización, orquestación

**Descripción:**
Los skills de infraestructura cubren prácticas modernas de DevOps, integración de plataformas cloud, orquestación de contenedores y pipelines de despliegue. Ayudan a los equipos a construir infraestructura confiable, escalable y mantenible que soporta entrega continua.

**Skills Populares:**

**Integración con Supabase**
- Diseño de esquema de base de datos
- Patrones de Row-level security (RLS)
- Configuración de autenticación
- Suscripciones en tiempo real
- Despliegue de Edge Functions
- Configuración de buckets de almacenamiento

**Pipelines de despliegue**
- Diseño de flujos de trabajo CI/CD
- Integración de testing automatizado
- Estrategias de gestión de releases
- Despliegues blue-green
- Releases canary
- Procedimientos de rollback

**Patrones de Kubernetes**
- Orquestación de contenedores
- Implementación de service mesh
- Horizontal pod autoscaling
- Gestión de ConfigMap y Secret
- Configuración de Ingress
- Monitoreo y observabilidad

**Ejemplos:**
```bash
# Instalar patrones de Supabase
npx skills add supabase-integration -g

# Instalar mejores prácticas de Docker
npx skills add docker-best-practices -g

# Instalar patrones de Kubernetes
npx skills add kubernetes-patterns -g
```

### 4. Marketing

**Enfoque:** SEO, estrategia de contenido, copywriting, analytics, optimización de conversión

**Descripción:**
Los skills de marketing ayudan a los equipos a optimizar contenido para motores de búsqueda, escribir copy convincente que convierte y desarrollar estrategias de contenido basadas en datos. Combinan conocimiento técnico de SEO con técnicas persuasivas de escritura e insights de analytics.

**Skills Populares:**

**Auditorías de SEO**
- Optimización técnica de SEO
- Estrategias de optimización de contenido
- Métricas de rendimiento (Core Web Vitals)
- Implementación de schema markup
- Estrategias de link building
- Patrones de SEO local

**copywriting** (48.2K installs)
- Técnicas de optimización de conversión
- Desarrollo de voz de marca
- Patrones de call-to-action
- Fórmulas de titulares
- Frameworks de storytelling
- Copywriting de email

**Estrategia de contenido**
- Planificación de calendario de contenido
- Optimización de canales de distribución
- Reutilización de contenido
- Analytics y medición
- Targeting de audiencia
- Gestión del ciclo de vida del contenido

**Ejemplos:**
```bash
# Instalar patrones de copywriting
npx skills add vercel-labs/skills@copywriting -g

# Instalar mejores prácticas de SEO
npx skills add seo-optimization -g

# Instalar estrategia de contenido
npx skills add content-strategy -g
```

### 5. Business

**Enfoque:** Estrategia, planificación, análisis, pricing, go-to-market

**Descripción:**
Los skills de negocios proporcionan frameworks para la toma de decisiones estratégicas, análisis competitivo, estrategias de pricing y lanzamientos de productos. Ayudan a los equipos a tomar decisiones de negocio basadas en datos y ejecutar estrategias efectivas de go-to-market.

**Skills Populares:**

**Estrategia de pricing**
- Selección de modelo de pricing (suscripción, basado en uso, por niveles)
- Técnicas de pricing basado en valor
- Frameworks de análisis competitivo
- Optimización de precios
- Estrategias de descuento
- Psicología de pricing

**Planificación de lanzamiento**
- Desarrollo de estrategia go-to-market
- Creación de checklist de lanzamiento
- Definición de métricas de éxito
- Selección de canales
- Messaging y posicionamiento
- Optimización post-lanzamiento

**Análisis de mercado**
- Métodos de investigación de competidores
- Técnicas de dimensionamiento de mercado
- Frameworks de análisis de tendencias
- Segmentación de clientes
- Análisis SWOT
- Validación de product-market fit

**Ejemplos:**
```bash
# Instalar estrategia de pricing
npx skills add pricing-strategy -g

# Instalar planificación de lanzamiento
npx skills add product-launch -g

# Instalar análisis de mercado
npx skills add market-research -g
```

### 6. Specialized Tools

**Enfoque:** Manejo de archivos, automatización, integraciones, procesamiento de datos

**Descripción:**
Los skills de herramientas especializadas proporcionan capacidades para trabajar con formatos de archivo específicos, automatizar flujos de trabajo, integrar servicios de terceros y procesar datos. Estos skills extienden a los agentes de IA con utilidades prácticas para tareas comunes pero complejas.

**Skills Populares:**

**Manejo de PDF/PPTX/XLSX**
- Generación de documentos desde plantillas
- Extracción de datos de archivos
- Conversión de formatos (PDF a texto, Excel a JSON)
- Procesamiento por lotes
- Marcas de agua y seguridad
- Generación de reportes

**Automatización de browser**
- Técnicas de web scraping
- Automatización de testing end-to-end
- Automatización de flujos de trabajo (llenado de formularios, entrada de datos)
- Captura de screenshots
- Gestión de sesiones
- Manejo de errores

**Flujos de trabajo de email**
- Diseño de plantillas de email
- Creación de reglas de automatización
- Patrones de integración (SendGrid, Mailgun)
- Optimización de deliverability
- Seguimiento de analytics
- Patrones de email transaccional

**Ejemplos:**
```bash
# Instalar manejo de PDF
npx skills add pdf-generation -g

# Instalar automatización de browser
npx skills add playwright-automation -g

# Instalar flujos de trabajo de email
npx skills add email-automation -g
```

## Tabla de Clasificación de Skills Principales

### Más Instalados (All Time)

La tabla de clasificación de todos los tiempos muestra skills con valor comprobado a largo plazo y adopción comunitaria generalizada.

**Top 5 Skills:**

**1. vercel-react-best-practices** — 72.7K installs
- **Categoría:** Development
- **Enfoque:** Optimización de React y patrones modernos
- **Por qué es popular:** Guía completa de React de Vercel, cubriendo rendimiento, Server Components y mejores prácticas de producción
- **Características clave:** Patrones de hooks, arquitectura de componentes, optimización de rendering, gestión de estado
- **Caso de uso:** Esencial para cualquier proyecto de desarrollo React

**2. find-skills** — 56.5K installs
- **Categoría:** Ecosystem Tool
- **Enfoque:** Descubrimiento y recomendación de skills
- **Por qué es popular:** Hace que descubrir nuevos skills sea sin esfuerzo a través de búsqueda inteligente y recomendaciones
- **Características clave:** Búsqueda por palabras clave, filtrado por categoría, sugerencias inteligentes, instalación directa
- **Caso de uso:** Primer skill a instalar al comenzar con el ecosistema de skills

**3. web-design-guidelines** — 55.1K installs
- **Categoría:** Design
- **Enfoque:** Estándares de diseño de interfaces web
- **Por qué es popular:** Mejores prácticas completas de accesibilidad, diseño responsivo y diseño visual
- **Características clave:** Cumplimiento WCAG, sistemas de diseño, patrones de layout, tipografía
- **Caso de uso:** Construir interfaces web accesibles y hermosas

**4. copywriting** — 48.2K installs
- **Categoría:** Marketing
- **Enfoque:** Principios efectivos de copywriting
- **Por qué es popular:** Frameworks probados para copy enfocado en conversión en todos los formatos
- **Características clave:** Fórmulas de titulares, patrones de CTA, voz de marca, storytelling
- **Caso de uso:** Landing pages, contenido de marketing, copy de producto

**5. mcp-integration** — 45.3K installs
- **Categoría:** Infrastructure
- **Enfoque:** Integración de Model Context Protocol
- **Por qué es popular:** Crítico para extender agentes de IA con herramientas y recursos externos
- **Características clave:** Configuración de servidor MCP, integración de herramientas, gestión de recursos
- **Caso de uso:** Conectar agentes de IA a bases de datos, APIs, sistemas de archivos

### Skills en Tendencia (24h)

Los skills en tendencia muestran crecimiento rápido reciente, indicando necesidades emergentes, descubrimiento viral o nuevos lanzamientos ganando tracción.

**Indicadores de Tendencia:**
- **Patrón de pico:** Aumento repentino en tasa de instalación de 24h
- **Nuevos lanzamientos:** Skills publicados recientemente ganando atención
- **Descubrimiento viral:** Compartido en redes sociales o foros
- **Necesidades emergentes:** Nuevos problemas siendo resueltos
- **Validación comunitaria:** Prueba y adopción rápida

**Qué significa trending:**
- Alta velocidad en las últimas 24 horas
- Tasa de instalación significativamente por encima de la línea base
- Comunidad probando y evaluando activamente
- Potencial para convertirse en mainstream
- Oportunidad de adopción temprana

**Cómo usar trending:**
1. Revisar sección de tendencias diariamente
2. Investigar skills de alta velocidad
3. Leer descripciones y casos de uso
4. Probar en entorno de desarrollo
5. Adoptar si es valioso para tu flujo de trabajo

### Skills Hot

Los skills hot mantienen alta velocidad de instalación sostenida durante períodos extendidos, indicando capacidades esenciales y entrega consistente de valor.

**Indicadores de Hot:**
- **Crecimiento consistente:** Tasa de instalación alta constante durante semanas/meses
- **Adopción comunitaria:** Uso generalizado en proyectos
- **Capacidad esencial:** Resuelve problemas comunes y recurrentes
- **Implementación de calidad:** Bien documentado, mantenido, confiable
- **Fuerte retención:** Los usuarios continúan usando después de la instalación

**Hot vs. Trending:**
- **Trending:** Pico en 24h (puede ser temporal)
- **Hot:** Velocidad sostenida (poder de permanencia probado)

**Características de skills hot:**
- Consistentemente en el top 20 por velocidad de instalación
- Actualizaciones y mantenimiento regular
- Compromiso activo de la comunidad
- Alta satisfacción y retención
- Aplicabilidad entre dominios

### Indicadores de Calidad Explicados

Entender las métricas de calidad ayuda a tomar decisiones informadas de selección de skills.

**Significado del Conteo de Instalación:**

**>50K installs:**
- **Validado por la comunidad:** Miles de usuarios confían en este skill
- **Listo para producción:** Probado en proyectos del mundo real
- **Bien documentado:** Guías completas y ejemplos
- **Mantenido activamente:** Actualizaciones y mejoras regulares
- **Bajo riesgo:** Apuesta segura para proyectos críticos

**10K-50K installs:**
- **Adopción creciente:** Ganando tracción comunitaria
- **Casos de uso especializados:** Resuelve bien problemas específicos
- **Experiencia de nicho:** Conocimiento profundo específico del dominio
- **Patrones emergentes:** Nuevos enfoques siendo validados
- **Riesgo medio:** Probar antes de uso en producción

**<10K installs:**
- **Nuevos lanzamientos:** Publicados recientemente, etapa temprana
- **Experimental:** Probando nuevos enfoques
- **Altamente especializado:** Caso de uso muy específico
- **Beta/testing:** Aún no listo para producción
- **Mayor riesgo:** Se requiere prueba exhaustiva

**Métricas Basadas en Tiempo:**

**All Time:**
- Mide valor total a lo largo de la vida
- Indica utilidad sostenida
- Muestra confianza comunitaria a largo plazo
- Mejor para: Decisiones de producción

**Trending 24h:**
- Mide pico de popularidad reciente
- Indica necesidades emergentes
- Muestra descubrimiento viral
- Mejor para: Adopción temprana, innovación

**Hot:**
- Mide velocidad sostenida
- Indica capacidad esencial
- Muestra valor consistente
- Mejor para: Infraestructura crítica

## Agentes de IA Soportados

Skills.sh soporta más de 20 agentes de IA de codificación a través de un formato SKILL.md estandarizado, permitiendo compatibilidad de escribir una vez, usar en todas partes.

### Plataformas Principales

**Claude Code** (Anthropic)
- CLI oficial para Claude Sonnet
- Soporte completo de skills
- Integración de comandos y agentes
- Compatibilidad con MCP

**GitHub Copilot** (GitHub/Microsoft)
- Integración con VS Code
- Skills cargados vía workspace
- Sugerencias inline mejoradas por skills
- Soporte de interfaz de chat

**Cursor** (Anysphere)
- Agente de IA integrado en IDE
- Soporte de directorio de skills
- Integración con paleta de comandos
- Acceso completo al ecosistema de skills

**Cline** (Cline AI)
- Agente basado en terminal
- Herramientas de descubrimiento de skills
- Flujo de trabajo CLI-first
- Soporte multiplataforma

**Gemini** (Google)
- Plataforma de agente de IA de Google
- Soporte de integración de skills
- Compatibilidad con Android Studio
- Integración cloud

**OpenAI Codex** (OpenAI)
- Modelo subyacente para muchos agentes
- Formato de skills compatible
- Integración de API
- Soporte de clientes de terceros

### Lista Completa de Agentes (20+ Plataformas)

- Claude Code
- GitHub Copilot
- Cursor
- Cline
- Gemini
- OpenAI Codex
- Windsurf
- Aider
- Continue
- Supermaven
- Tabnine
- Codeium
- Amazon CodeWhisperer
- Replit AI
- SourceGraph Cody
- JetBrains AI
- Mintlify Writer
- Pieces for Developers
- CodeGPT
- Bito AI
- Y más...

### Compatibilidad Universal

El ecosistema de skills logra compatibilidad multiplataforma a través de:

**Formato Estandarizado:**
- Todos los skills usan formato markdown SKILL.md
- Estructura de frontmatter consistente
- Instrucciones independientes de plataforma
- Mecanismos de activación universales

**Beneficios:**
- **Escribir una vez, usar en todas partes:** Un solo skill funciona en todos los agentes
- **Sin vendor lock-in:** Cambiar agentes sin perder skills
- **Compartir en comunidad:** Skills benefician a todo el ecosistema
- **A prueba de futuro:** Nuevos agentes automáticamente compatibles

**Características de Compatibilidad:**
- Carga de skills independiente de plataforma
- Patrones de activación universales
- Transferencia de skills entre agentes
- Compatibilidad hacia atrás

## Usando la Plataforma

### Estrategias de Navegación

**Estrategia 1: Exploración Category-First**

Mejor para: Aprender el ecosistema, descubrir skills de propósito general

**Proceso:**
1. Visitar [skills.sh](https://skills.sh)
2. Seleccionar categoría relevante (Development, Design, etc.)
3. Navegar skills principales en categoría
4. Filtrar por conteo de instalación
5. Revisar descripciones de skills
6. Instalar skills más relevantes

**Ejemplo:**
```
1. Navegar a categoría Development
2. Ver subcategoría React
3. Encontrar vercel-react-best-practices (72.7K installs)
4. Leer descripción
5. Instalar: npx skills add vercel-labs/skills@vercel-react-best-practices -g
```

**Estrategia 2: Búsqueda de Resolución de Problemas**

Mejor para: Necesidades específicas, descubrimiento dirigido

**Proceso:**
1. Identificar problema específico
2. Buscar con palabras clave enfocadas
3. Comparar los 3-5 resultados principales
4. Revisar documentación
5. Instalar mejor coincidencia

**Ejemplo:**
```
Problema: Problemas de rendimiento en app React
Search: "react performance optimization"
Results:
  - react-performance-patterns (25K installs)
  - react-rendering-optimization (18K installs)
  - performance-profiling (12K installs)
Elegir: react-performance-patterns (instalaciones más altas + mejor descripción)
Install: npx skills add react-performance-patterns -g
```

**Estrategia 3: Descubrimiento de Tendencias**

Mejor para: Mantenerse actualizado, encontrar patrones emergentes

**Proceso:**
1. Revisar sección "Trending 24h"
2. Revisar skills "Hot"
3. Investigar patrones de crecimiento rápido
4. Leer descripciones de skills
5. Probar skills prometedores

**Ejemplo:**
```
Trending: new-framework-skill (pico de 500 → 8K installs)
Investigar: Leer qué problema resuelve
Probar: Instalar en proyecto de prueba
Evaluar: Determinar preparación para producción
Adoptar: Añadir a proyectos principales si es valioso
```

### Consejos de Búsqueda

**Consultas de Búsqueda Efectivas:**

**Ser Específico:**
```bash
# Bueno
npx skills find react performance optimization

# Muy vago
npx skills find react
```

**Incluir Dominio:**
```bash
# Bueno
npx skills find frontend design patterns

# Menos efectivo
npx skills find design
```

**Combinar Tarea + Herramienta:**
```bash
# Bueno
npx skills find playwright e2e testing

# Menos efectivo
npx skills find testing
```

**Usar Terminología Común:**
```bash
# Bueno
npx skills find auth security

# Menos efectivo
npx skills find authentication authorization
```

**Patrones de Consulta de Búsqueda:**

| Patrón | Ejemplo | Caso de Uso |
|---------|---------|----------|
| Framework + Tarea | "react performance" | Optimización específica de framework |
| Herramienta + Propósito | "docker deployment" | Configuración de infraestructura |
| Dominio + Acción | "frontend design" | Guía de diseño |
| Technology Stack | "next.js typescript" | Patrones multi-tecnología |
| Problema + Solución | "slow loading optimization" | Resolución de problemas |

### Filtrado y Descubrimiento

**Filtrar por Conteo de Instalación:**
1. Visitar skills.sh
2. Seleccionar categoría
3. Ordenar por instalaciones "All Time"
4. Enfocarse en los 10-20 resultados principales
5. Altas instalaciones = valor probado

**Filtrar por Recencia:**
1. Revisar pestaña "Trending 24h"
2. Encontrar skills recientemente populares
3. Investigar nuevas soluciones
4. Oportunidad de adopción temprana

**Filtrar por Dominio:**
1. Usar navegación de categoría
2. Seleccionar subcategoría específica
3. Reducir a dominio exacto
4. Navegar resultados enfocados

**Descubrimiento Avanzado:**
- Combinar filtros (categoría + conteo de instalación)
- Usar búsqueda dentro de categoría
- Revisar sección de skills relacionados
- Seguir publicador de skill para actualizaciones
- Marcar skills favoritos

**Flujo de Trabajo de Descubrimiento:**
```
1. Identificar Necesidad
   ↓
2. Elegir Método de Descubrimiento
   (Browse | Search | Trending)
   ↓
3. Aplicar Filtros
   (Category | Install Count | Recency)
   ↓
4. Revisar Resultados
   (Leer descripciones | Verificar métricas)
   ↓
5. Evaluar Calidad
   (Conteo de instalación | Documentación | Fuente)
   ↓
6. Instalar y Probar
   (Development | Staging | Production)
```

## Resumen

Skills.sh sirve como el mercado central para el ecosistema abierto de skills de agentes, proporcionando descubrimiento, validación y distribución para miles de capacidades contribuidas por la comunidad.

**Conclusiones Clave:**

**Fortalezas de la Plataforma:**
- Directorio central con más de 70K instalaciones para skills principales
- Seis categorías principales cubriendo todos los dominios
- Métodos de descubrimiento de búsqueda y navegación
- Indicadores de calidad a través de métricas de instalación
- Compatibilidad universal en más de 20 agentes

**Características de Descubrimiento:**
- Navegación basada en categorías
- Búsqueda por palabras clave con filtrado
- Seguimiento de skills trending y hot
- Métricas de instalación para validación
- Gestión de versiones y actualizaciones

**Categorías Populares:**
- Development: React, TypeScript, frameworks
- Design: Diseño web, accesibilidad, UI/UX
- Infrastructure: Docker, Kubernetes, Supabase
- Marketing: SEO, copywriting, contenido
- Business: Pricing, lanzamiento, análisis
- Tools: Manejo de PDF, automatización, integraciones

**Indicadores de Calidad:**
- >50K installs = listo para producción
- Trending 24h = valor emergente
- Hot = capacidad esencial sostenida
- Validación comunitaria a través de adopción

**Acceso Universal:**
- Funciona con Claude Code, Cursor, Copilot y más de 20 agentes
- Escribir una vez, usar en todas partes
- Sin vendor lock-in
- Inversión en skills a prueba de futuro

## Documentación Relacionada

**Descubrimiento:**
- [Guía de Descubrimiento](../../02-using-skills/discovery.md) — Métodos completos de descubrimiento
- [Herramienta find-skills](../../../references/skills/find-skills-vercel.md) — Referencia del skill de descubrimiento

**Ecosistema:**
- [Vista General del Ecosistema de Skills](../../../references/skills/skills-ecosystem-overview.md) — Guía completa del ecosistema
- [Paquete npm Skills](../../../references/skills/npm-skills-package.md) — Documentación del CLI de Skills
- [OpenSkills](../../../references/skills/openskills.md) — Cargador universal de skills

**Herramientas de Plataforma:**
- [CLI de Skills](../../../references/skills/npm-skills-package.md) — Interfaz de línea de comandos
- [Guía de Instalación](../../02-using-skills/installation.md) — Cómo instalar skills
- [Guía de Gestión](../../02-using-skills/management.md) — Gestión de skills instalados

---

**Última Actualización:** Febrero 2026
**Plataforma:** skills.sh
**Estado:** Activo y Creciendo
**Comunidad:** Más de 72K instalaciones en skills principales
