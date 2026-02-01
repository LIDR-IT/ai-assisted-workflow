# Herramientas del Ecosistema - Skills

Herramientas y plataformas para gestionar y distribuir skills.

## Contenido

### 📦 CLI y Gestión

- **[Paquete NPM](npm-package.md)**
  CLI oficial para gestión de skills
  - Instalación y comandos
  - Publicación de skills
  - Gestión local vs global
  - Configuración

### 🌐 Plataforma

- **[Skills.sh Platform](skills-sh-platform.md)**
  Mercado y plataforma de skills
  - Descubrimiento de skills
  - Rankings y métricas
  - Publicación
  - Comunidad

---

## CLI de Skills

### Instalación

```bash
# Instalar globalmente
npm install -g skills

# Verificar instalación
skills --version
```

### Comandos Principales

#### Descubrimiento
```bash
# Buscar skills
skills search "react"

# Listar por categoría
skills list --category development

# Ver detalles
skills info @user/skill-name

# Explorar trending
skills trending
```

#### Instalación
```bash
# Instalar skill
skills install @user/skill-name

# Instalar múltiples
skills install @user/skill1 @user/skill2

# Instalar versión específica
skills install @user/skill-name@1.2.0

# Instalar local (solo proyecto)
skills install @user/skill-name --local

# Desde archivo
skills install ./mi-skill/
```

#### Gestión
```bash
# Listar instalados
skills list
skills list --global
skills list --local

# Actualizar
skills update @user/skill-name
skills update --all

# Desinstalar
skills remove @user/skill-name

# Limpiar no usados
skills prune
```

#### Desarrollo
```bash
# Crear nuevo skill
skills init mi-skill
skills init --template workflow mi-skill

# Validar skill
skills validate ./mi-skill

# Probar localmente
skills test ./mi-skill

# Lint
skills lint ./mi-skill
```

#### Publicación
```bash
# Login
skills login

# Publicar
skills publish ./mi-skill

# Actualizar versión
skills version patch
skills version minor
skills version major

# Despublicar
skills unpublish @user/skill-name@1.0.0
```

Ver [NPM Package](npm-package.md) para referencia completa.

---

## Skills.sh Platform

### Características

**Para Usuarios:**
- 🔍 Búsqueda avanzada de skills
- ⭐ Ratings y reviews
- 📊 Estadísticas de uso
- 📚 Documentación integrada
- 🏆 Leaderboard

**Para Creadores:**
- 📤 Publicación fácil
- 📈 Analytics de uso
- 💬 Feedback de usuarios
- 🔔 Notificaciones
- 💰 Monetización (próximamente)

### Navegando Skills.sh

**Homepage:**
```
https://skills.sh
├── Trending Skills
├── Categories
│   ├── Development
│   ├── Design
│   ├── DevOps
│   ├── Data
│   └── Documentation
├── Top Contributors
└── Featured Skills
```

**Página de Skill:**
```
https://skills.sh/@user/skill-name
├── README
├── Installation
├── Usage Examples
├── Reviews
├── Stats
│   ├── Downloads
│   ├── Stars
│   └── Forks
└── Versions
```

### Búsqueda Avanzada

```
Filtros:
- Categoría
- Plataforma (Claude Code, Antigravity, Universal)
- Rating (⭐⭐⭐⭐⭐)
- Fecha de actualización
- Número de descargas
- Idioma

Ordenar por:
- Relevancia
- Popularidad
- Reciente
- Mejor valorado
```

### Rankings

**Leaderboard Global:**
1. Más descargados (30 días)
2. Mejor valorados
3. Más usados
4. Trending (subiendo rápido)

**Leaderboard por Categoría:**
- Development
- Design
- DevOps
- Data
- Documentation
- Automation
- Testing

Ver [Skills.sh Platform](skills-sh-platform.md) para detalles.

---

## Publicando un Skill

### Proceso Completo

#### 1. Preparar el Skill

```bash
# Estructura requerida
mi-skill/
├── skill.md          # Contenido principal (requerido)
├── README.md         # Documentación (requerido)
├── package.json      # Metadata (requerido)
└── examples/         # Ejemplos (opcional)
    └── basic.md
```

#### 2. package.json

```json
{
  "name": "@tuuser/mi-skill",
  "version": "1.0.0",
  "description": "Descripción breve del skill",
  "keywords": ["react", "development", "frontend"],
  "author": "Tu Nombre <email@example.com>",
  "license": "MIT",
  "skills": {
    "category": "development",
    "platforms": ["claude-code", "antigravity"],
    "tags": ["react", "hooks", "best-practices"]
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/tuuser/mi-skill"
  }
}
```

#### 3. README.md

```markdown
# Mi Skill

Descripción detallada del skill.

## Installation

\`\`\`bash
skills install @tuuser/mi-skill
\`\`\`

## Usage

\`\`\`
/mi-skill
\`\`\`

## Examples

### Ejemplo 1
...

### Ejemplo 2
...

## License

MIT
```

#### 4. Validar

```bash
skills validate ./mi-skill
```

**Output esperado:**
```
✅ skill.md existe
✅ README.md existe
✅ package.json válido
✅ Frontmatter correcto
✅ Sin errores de formato
✅ Keywords apropiados

Skill listo para publicar!
```

#### 5. Publicar

```bash
# Primera vez
skills login
skills publish ./mi-skill

# Actualizaciones
cd mi-skill
skills version patch  # 1.0.0 → 1.0.1
skills publish
```

---

## Métricas y Analytics

### Dashboard Personal

```
https://skills.sh/dashboard
├── Mis Skills
│   ├── Descargas totales
│   ├── Rating promedio
│   └── Feedback reciente
├── Analytics
│   ├── Descargas por día
│   ├── Plataformas más usadas
│   └── Tendencias
└── Engagement
    ├── Reviews nuevos
    ├── Issues reportados
    └── Preguntas
```

### Métricas por Skill

```
@tuuser/mi-skill
├── 📊 Stats
│   ├── 1,234 descargas totales
│   ├── 456 descargas (30 días)
│   ├── ⭐ 4.5/5.0 (23 reviews)
│   └── 89 stars
├── 📈 Crecimiento
│   ├── +15% vs mes anterior
│   └── Trending #5 en Development
├── 🌍 Plataformas
│   ├── Claude Code: 60%
│   ├── Antigravity: 30%
│   └── Universal: 10%
└── 🗣️ Feedback
    ├── 12 reviews positivos
    ├── 3 issues abiertos
    └── 5 feature requests
```

---

## Comunidad

### Contribuir

```bash
# Fork skill
skills fork @user/skill-name

# Hacer cambios
cd skill-name
# ... editar ...

# Publicar fork
skills publish --fork
```

### Colaboración

**Issues:**
```
https://skills.sh/@user/skill-name/issues
- Bug reports
- Feature requests
- Questions
```

**Pull Requests:**
```
https://skills.sh/@user/skill-name/pulls
- Mejoras de código
- Documentación
- Nuevos ejemplos
```

### Discusiones

```
https://skills.sh/community
├── General
├── Show & Tell
├── Q&A
├── Feature Requests
└── Platform Updates
```

---

## Monetización (Próximamente)

### Modelos Planeados

**Freemium:**
- Skills básicos gratuitos
- Skills premium de pago
- Suscripciones mensuales

**Sponsorship:**
- Usuarios pueden sponsorear creadores
- Badges de sponsors
- Beneficios exclusivos

**Enterprise:**
- Skills privados para equipos
- Soporte prioritario
- Analytics avanzados

---

## Herramientas Complementarias

### OpenSkills Loader

```bash
npm install -g openskills

# Sync automático entre plataformas
openskills sync

# Convertir formato
openskills convert ./claude-skill --to antigravity
```

### Skills Linter

```bash
npm install -g skills-lint

# Lint skill
skills-lint ./mi-skill

# Auto-fix issues
skills-lint ./mi-skill --fix
```

### Skills Template Generator

```bash
npm install -g create-skill

# Generar con wizard interactivo
create-skill

# Desde template
create-skill --template workflow my-skill
```

---

## Siguiente Paso

- Explora [Referencias](../07-reference/) para ejemplos completos
- Consulta [NPM Package](npm-package.md) para comandos detallados
- Visita [Skills.sh Platform](skills-sh-platform.md) para publicar

---

**Navegación:** [← Temas Avanzados](../05-advanced/) | [Volver a Skills](../index.md) | [Referencias →](../07-reference/)
