# Antigravity Rules & Workflows - Sistema de Contexto en Google Antigravity

Este documento explica el sistema de reglas (Rules) y flujos de trabajo (Workflows) en Google Antigravity, un IDE agentic que evoluciona el concepto de editor de código hacia la era de agentes autónomos.

## Vista General

Google Antigravity es una plataforma de desarrollo agentic que funciona como "Mission Control" para gestionar agentes autónomos que pueden planificar, codificar e incluso navegar la web para ayudarte a construir aplicaciones.

El sistema de personalización de Antigravity se basa en dos componentes clave:

- **Rules (Reglas)**: Guías persistentes que moldean el comportamiento del agente
- **Workflows (Flujos de trabajo)**: Prompts guardados que se activan bajo demanda

## ¿Qué es Antigravity?

Antigravity IDE es la evolución del IDE tradicional hacia un entorno agent-first, proporcionando:

- 🤖 **Agentes autónomos** que pueden planificar y ejecutar tareas
- 🌐 **Capacidades de navegación web** para investigación
- 📋 **Mission Control** para gestionar múltiples agentes
- 🧠 **Gemini 3 Deep Think** para razonamiento profundo
- 🎯 **Artifact-First Philosophy** para documentación estructurada

## Diferencia Clave: Rules vs Workflows

| Aspecto | Rules | Workflows |
|---------|-------|-----------|
| **Naturaleza** | Instrucciones del sistema | Prompts guardados |
| **Aplicación** | Pasiva, siempre activa | Activa, bajo demanda del usuario |
| **Activación** | Automática en cada interacción | Manual con `/` en el chat |
| **Propósito** | Constitución inmutable del agente | Comandos reutilizables |
| **Analogía** | System instructions | Saved prompts |

### Analogía Oficial

**Rules** son como "system instructions" - la constitución inmutable para el agente.

**Workflows** son como "saved prompts" - comandos que puedes elegir bajo demanda.

## Ubicaciones de Archivos

Antigravity soporta configuración tanto **global** como **por workspace**:

### Configuración Global

| Tipo | Ubicación |
|------|-----------|
| **Global Rules** | `~/.gemini/GEMINI.md` |
| **Global Workflows** | `~/.gemini/antigravity/global_workflows/global-workflow.md` |

### Configuración por Workspace

| Tipo | Ubicación |
|------|-----------|
| **Workspace Rules** | `your-workspace/.agent/rules/` |
| **Workspace Workflows** | `your-workspace/.agent/workflows/` |

### Estructura de Proyecto Típica

```
my-project/
├── .agent/
│   ├── rules/
│   │   ├── code-style.md
│   │   ├── testing.md
│   │   └── security.md
│   └── workflows/
│       ├── generate-tests.md
│       ├── document-code.md
│       └── refactor.md
├── .antigravity/
│   └── rules.md                    # Directivas del agente
├── mission.md                      # Objetivos de alto nivel
├── artifacts/
│   ├── plan_*.md                   # Documentos de planificación
│   └── logs/                       # Logs de tests
└── src/
```

## Acceder a Rules y Workflows

### Interfaz de Usuario

1. Click en el menú `...` (tres puntos) en la esquina superior derecha
2. Seleccionar **Customizations**
3. Verás dos secciones:
   - **Rules**: Para definir guías persistentes
   - **Workflows**: Para crear prompts guardados

### Archivos de Configuración

Alternativamente, edita directamente los archivos markdown en:
- `.agent/rules/` para reglas del workspace
- `.agent/workflows/` para workflows del workspace
- `~/.gemini/GEMINI.md` para reglas globales

## Rules (Reglas)

### Propósito

Las reglas sirven como **instrucciones del sistema** que el agente debe considerar antes de generar cualquier código o plan. Son guías persistentes y pasivas.

### Características

- ✅ **Siempre activas**: Se aplican en cada interacción del agente
- ✅ **Persistentes**: Permanecen activas durante toda la sesión
- ✅ **Inmutables**: Actúan como constitución del agente
- ✅ **Guías de comportamiento**: Definen cómo el agente debe trabajar

### Ejemplos de Rules

#### 1. Estilo de Código (code-style.md)

```markdown
# Code Style Rules

## Python Standards
- Use type hints for all function parameters and return values
- Follow PEP 8 style guide strictly
- Maximum line length: 100 characters
- Use Google-style docstrings

## Code Organization
- One class per file (unless closely related)
- Import order: standard library, third-party, local
- Use absolute imports, not relative

## Naming Conventions
- Classes: PascalCase
- Functions/variables: snake_case
- Constants: UPPER_SNAKE_CASE
- Private methods: prefix with _
```

#### 2. Documentación (documentation.md)

```markdown
# Documentation Rules

## Required Documentation

All public functions and classes must include:

\`\`\`python
def process_data(input_data: list[dict]) -> pd.DataFrame:
    """Process raw data into structured DataFrame.

    Args:
        input_data: List of dictionaries containing raw data

    Returns:
        Processed DataFrame with standardized columns

    Raises:
        ValueError: If input_data is empty or malformed
    """
\`\`\`

## Artifact Generation

Before writing code, create planning artifacts:
- Generate `artifacts/plan_[task_id].md` for complex tasks
- Document UI changes with "Generates Artifact: Screenshot"
- Save test logs to `artifacts/logs/`
```

#### 3. Testing (testing.md)

```markdown
# Testing Rules

## Test Requirements
- Minimum 80% code coverage for new code
- Unit tests for all business logic
- Integration tests for API endpoints
- Run `pytest` after any logic modification

## Test Structure
- Use pytest fixtures for setup/teardown
- One test file per source file: `test_module.py`
- Descriptive test names: `test_function_behavior_condition()`

## Test Data
- Use factories for test data (factory_boy)
- Avoid hardcoded test data
- Clean up test data after each test
```

#### 4. Seguridad (security.md)

```markdown
# Security Rules

## Data Validation
- Validate all external inputs with Pydantic models
- Sanitize user-provided data before database queries
- Use parameterized queries (no string concatenation)

## Secrets Management
- Never commit secrets to repository
- Use environment variables for sensitive data
- Store secrets in `.env` (add to `.gitignore`)

## API Security
- Wrap external API calls in dedicated `tools/` functions
- Implement rate limiting for public endpoints
- Use OAuth 2.0 for authentication
```

## Workflows (Flujos de Trabajo)

### Propósito

Los workflows son **prompts guardados** que el usuario puede activar bajo demanda durante la interacción con el agente.

### Características

- 🎯 **On-demand**: Solo se ejecutan cuando el usuario los invoca
- 🎯 **Reutilizables**: Guardan prompts comunes para uso repetido
- 🎯 **Activación con `/`**: Se activan escribiendo `/workflow-name`
- 🎯 **Específicos de tarea**: Optimizados para tareas particulares

### Ejemplos de Workflows

#### 1. Generar Tests (/generate-tests)

**`.agent/workflows/generate-tests.md`**

```markdown
# Generate Unit Tests Workflow

Generate comprehensive unit tests for the current file.

## Requirements
- Create test file: `test_{filename}.py`
- Test all public methods
- Include edge cases and error conditions
- Use pytest fixtures for setup
- Aim for 90%+ code coverage

## Test Template

\`\`\`python
import pytest
from module import ClassName

@pytest.fixture
def instance():
    return ClassName()

def test_method_success_case(instance):
    # Arrange
    input_data = {...}
    expected = {...}

    # Act
    result = instance.method(input_data)

    # Assert
    assert result == expected

def test_method_error_case(instance):
    with pytest.raises(ValueError):
        instance.method(invalid_data)
\`\`\`
```

**Uso en chat:**
```
/generate-tests
```

#### 2. Documentar Código (/document)

**`.agent/workflows/document.md`**

```markdown
# Document Code Workflow

Add comprehensive documentation to the current code.

## Documentation Standards
- Google-style docstrings for all public functions/classes
- Include Args, Returns, Raises sections
- Add usage examples for complex functions
- Update README.md if public API changed

## Example Format

\`\`\`python
def complex_function(param1: str, param2: int = 10) -> dict:
    """Brief one-line summary.

    Detailed explanation of what the function does,
    including any important behavioral notes.

    Args:
        param1: Description of param1
        param2: Description of param2 (default: 10)

    Returns:
        Dictionary containing results with keys:
        - 'status': Success/failure indicator
        - 'data': Processed data

    Raises:
        ValueError: When param1 is empty
        TypeError: When param2 is not an integer

    Examples:
        >>> complex_function("test", 20)
        {'status': 'success', 'data': [...]}
    """
\`\`\`
```

#### 3. Refactorizar (/refactor)

**`.agent/workflows/refactor.md`**

```markdown
# Refactor Code Workflow

Refactor the selected code following best practices.

## Refactoring Goals
- Improve readability and maintainability
- Reduce complexity (McCabe < 10)
- Extract reusable functions
- Apply SOLID principles
- Maintain backward compatibility

## Steps
1. Analyze current code complexity
2. Identify code smells
3. Extract methods/classes as needed
4. Add type hints if missing
5. Update tests to match changes
6. Verify all tests pass

## Before/After Documentation
Document refactoring in `artifacts/refactor_[date].md`:
- Original code complexity metrics
- Identified issues
- Changes made
- New complexity metrics
```

#### 4. Review Code (/review)

**`.agent/workflows/review.md`**

```markdown
# Code Review Workflow

Perform comprehensive code review of current changes.

## Review Checklist

### Code Quality
- [ ] Follows project code style
- [ ] No code duplication
- [ ] Functions are small and focused
- [ ] Descriptive variable/function names

### Testing
- [ ] Tests cover new functionality
- [ ] Tests cover edge cases
- [ ] All tests passing
- [ ] Coverage maintained/improved

### Security
- [ ] No hardcoded secrets
- [ ] Input validation present
- [ ] SQL injection prevented
- [ ] XSS vulnerabilities addressed

### Performance
- [ ] No N+1 queries
- [ ] Efficient algorithms used
- [ ] No unnecessary computations
- [ ] Database indexes appropriate

### Documentation
- [ ] Docstrings updated
- [ ] README updated if needed
- [ ] Breaking changes documented
- [ ] Migration guide if needed

## Output Format
Provide review as structured markdown with:
- 🟢 Approved items
- 🟡 Suggestions for improvement
- 🔴 Required changes
```

## Directivas de Antigravity (.antigravity/rules.md)

El archivo `.antigravity/rules.md` define la configuración de persona del agente, estableciendo cómo debe operar el asistente de IA.

### Componentes Core

#### 1. Artifact-First Philosophy

El agente debe crear artifacts antes de escribir código:

```markdown
# Artifact-First Philosophy

## Before Coding
- Generate planning document: `artifacts/plan_[task_id].md`
- Document UI changes with "Generates Artifact: Screenshot"
- Save test logs to `artifacts/logs/`

## Artifact Structure
\`\`\`
artifacts/
├── plan_[task_id].md       # Documentos de planificación
├── logs/                    # Logs de tests
│   └── pytest_[date].log
└── screenshots/             # Capturas de UI
    └── feature_[name].png
\`\`\`
```

#### 2. Mission-Driven Approach

El agente debe leer `mission.md` antes de iniciar tareas:

```markdown
# Mission-Driven Approach

Before starting any task:
1. Read `mission.md` to understand high-level objectives
2. Ensure work aligns with project goals
3. Don't execute isolated requests without context

## Mission File Format
\`\`\`markdown
# Project Mission

## Objective
[High-level project goal]

## Current Phase
[What we're working on now]

## Success Criteria
- [ ] Criterion 1
- [ ] Criterion 2
\`\`\`
```

#### 3. Deep Thinking Protocol

Para decisiones complejas, usar bloques `<thought>`:

```markdown
# Deep Thinking Protocol

For complex decisions, use Gemini 3 Deep Think reasoning:

\`\`\`
<thought>
Evaluating implementation approach...

Edge cases to consider:
- Empty input handling
- Concurrent requests
- Rate limiting

Security implications:
- SQL injection risk via raw queries
- XSS vulnerability in templates

Scalability concerns:
- Database query efficiency
- Memory usage with large datasets

Recommendation: Use parameterized queries + pagination
</thought>
\`\`\`
```

### Estándares Técnicos

#### Type Hints Obligatorios

```markdown
# Type Hints Standard

All Python code must include type hints:

\`\`\`python
# ❌ Bad
def process(data):
    return data.transform()

# ✅ Good
def process(data: pd.DataFrame) -> pd.DataFrame:
    return data.transform()
\`\`\`
```

#### Pydantic Models

```markdown
# Data Validation with Pydantic

All data structures must use Pydantic models:

\`\`\`python
from pydantic import BaseModel, Field

class UserInput(BaseModel):
    name: str = Field(min_length=2, max_length=100)
    email: str = Field(pattern=r'^[\w\.-]+@[\w\.-]+\.\w+$')
    age: int = Field(ge=0, le=150)
\`\`\`
```

#### Google-Style Docstrings

```markdown
# Documentation Standard

Use Google-style docstrings for all functions/classes:

\`\`\`python
def fetch_user_data(user_id: int) -> dict:
    """Fetch user data from database.

    Args:
        user_id: Unique identifier for user

    Returns:
        Dictionary containing user data with keys:
        - 'name': User's full name
        - 'email': User's email address

    Raises:
        ValueError: If user_id is negative
        UserNotFoundError: If user doesn't exist
    """
\`\`\`
```

### Límites de Capacidad

#### Control del Browser

```markdown
# Browser Control Rules

## Permitted
- ✅ Documentation verification
- ✅ Version checks (npm, pip packages)
- ✅ Public API documentation lookup

## Restricted (Require Approval)
- ❌ Form submissions
- ❌ External logins
- ❌ Downloading files
- ❌ Making purchases
```

#### Ejecución de Terminal

```markdown
# Terminal Execution Rules

## Encouraged
- ✅ `pip install` for dependencies
- ✅ `pytest` runs after logic modifications
- ✅ `git status` and `git diff`

## Prohibited
- ❌ `rm -rf` or destructive commands
- ❌ Modifying system files
- ❌ Installing system packages without approval
- ❌ Executing untrusted scripts
```

## Configuración Avanzada

### Estructura Completa de Workspace

```
my-antigravity-project/
├── .agent/
│   ├── rules/
│   │   ├── 01-code-style.md
│   │   ├── 02-testing.md
│   │   ├── 03-security.md
│   │   ├── 04-documentation.md
│   │   └── 05-performance.md
│   └── workflows/
│       ├── generate-tests.md
│       ├── document.md
│       ├── refactor.md
│       ├── review.md
│       └── deploy.md
├── .antigravity/
│   └── rules.md                    # Directivas del agente
├── mission.md                      # Objetivos de alto nivel
├── artifacts/
│   ├── plan_*.md
│   ├── logs/
│   └── screenshots/
├── tools/                          # API wrappers
│   ├── weather_api.py
│   └── database_client.py
└── src/
    └── main.py
```

### Ejemplo: mission.md

```markdown
# Project Mission: E-commerce Platform

## Objective
Build a scalable e-commerce platform with AI-powered product recommendations.

## Current Phase: MVP Development
Focus on core shopping cart and checkout functionality.

## Success Criteria
- [ ] User authentication implemented
- [ ] Product catalog with search
- [ ] Shopping cart functionality
- [ ] Checkout with Stripe integration
- [ ] Order tracking

## Technical Constraints
- Use FastAPI for backend
- PostgreSQL for database
- React for frontend
- Deploy on Google Cloud Run

## Next Phase
- Product recommendation engine
- Inventory management
- Admin dashboard
```

## Mejores Prácticas

### ✅ Rules

**1. Ser Específico y Accionable**

```markdown
# ❌ Mal
- Write good code
- Test everything

# ✅ Bien
- Use type hints for all function parameters and returns
- Achieve minimum 80% test coverage for new code
- Run pytest after any logic modification
```

**2. Organizar por Categoría**

```markdown
.agent/rules/
├── 01-code-style.md        # Estilo de código
├── 02-testing.md           # Testing standards
├── 03-security.md          # Security requirements
├── 04-documentation.md     # Documentation standards
└── 05-performance.md       # Performance guidelines
```

**3. Incluir Ejemplos**

Siempre proporcionar ejemplos de código correcto vs incorrecto.

### ✅ Workflows

**1. Nombres Descriptivos**

```markdown
# ❌ Mal
/test
/doc

# ✅ Bien
/generate-comprehensive-tests
/document-with-examples
```

**2. Incluir Template**

Cada workflow debe incluir un template o ejemplo de salida esperada.

**3. Definir Scope Claro**

```markdown
# Generate API Tests Workflow

Scope: API endpoint testing only
Not included: UI tests, integration tests

Generates:
- Unit tests for route handlers
- Tests for request validation
- Tests for response formatting
```

### ✅ Mission File

**1. Mantener Actualizado**

Revisar y actualizar `mission.md` al inicio de cada sprint o fase.

**2. Incluir Contexto**

```markdown
## Context
Previous attempts at recommendation engine failed due to:
- Insufficient training data
- Poor feature engineering
- Scalability issues with matrix factorization

New approach:
- Use collaborative filtering with implicit feedback
- Leverage BigQuery for data processing
- Deploy on Vertex AI for scalability
```

## Conflicto con Gemini CLI

⚠️ **Advertencia Importante**: Antigravity y Gemini CLI comparten el mismo archivo de configuración global.

### Problema

Ambas herramientas están hardcoded para usar:
```
~/.gemini/GEMINI.md
```

Si usas ambas herramientas en el mismo sistema, las configuraciones pueden entrar en conflicto.

### Soluciones

**Opción 1: Usar configuración por workspace**

Priorizar `.agent/rules/` en lugar de configuración global.

**Opción 2: Separar configuraciones**

```markdown
# ~/.gemini/GEMINI.md

## For Antigravity IDE
[Rules específicas de Antigravity]

---

## For Gemini CLI
[Rules específicas de Gemini CLI]
```

**Opción 3: Usar diferentes sistemas**

- Usar Antigravity para desarrollo con agentes
- Usar Gemini CLI solo para scripts rápidos

### Issue Tracking

Este conflicto está documentado en:
- GitHub Issue: google-gemini/gemini-cli#16058

## Recursos y Templates

### Templates Oficiales

**1. Antigravity Workspace Template**

```bash
git clone https://github.com/study8677/antigravity-workspace-template
```

Incluye:
- `.antigravity/rules.md` preconfigurado
- `.cursorrules` para compatibilidad
- Estructura de directorios optimizada
- Workflows de ejemplo

**2. Gemini Superpowers for Antigravity**

```bash
git clone https://github.com/anthonylee991/gemini-superpowers-antigravity
```

Framework completo con:
- Rules predefinidas
- Workflows avanzados
- Agent Skills integrados
- Patrones de ejemplo

## Comparación con Otros Sistemas

| Aspecto | Antigravity | Claude Code | Gemini CLI | Cursor |
|---------|-------------|-------------|------------|--------|
| **Tipo** | IDE Agentic | CLI | CLI | Editor/IDE |
| **Rules ubicación** | `.agent/rules/` | `.claude/rules/` | `GEMINI.md` | `.cursor/rules/` |
| **Workflows** | ✅ `.agent/workflows/` | ❌ No soportado | ❌ No soportado | ❌ No soportado |
| **Global rules** | `~/.gemini/GEMINI.md` | `~/.claude/CLAUDE.md` | `~/.gemini/GEMINI.md` | Cursor Settings |
| **Mission file** | ✅ `mission.md` | ❌ No soportado | ❌ No soportado | ❌ No soportado |
| **Artifacts** | ✅ `artifacts/` | ❌ No soportado | ❌ No soportado | ❌ No soportado |
| **Deep Think** | ✅ Gemini 3 Deep Think | ❌ No soportado | ❌ No soportado | ❌ No soportado |
| **Browser control** | ✅ Con límites | ❌ No soportado | ❌ No soportado | ❌ No soportado |
| **Activación workflows** | `/workflow-name` | N/A | N/A | `@rule-name` (rules) |

### Características Únicas de Antigravity

**1. Workflows Nativos**

Único sistema con workflows como concepto de primera clase separado de rules.

**2. Mission-Driven**

Archivo `mission.md` para contexto de alto nivel del proyecto.

**3. Artifact-First Philosophy**

Énfasis en documentación estructurada antes de código.

**4. Deep Thinking Protocol**

Integración con Gemini 3 Deep Think para razonamiento complejo.

**5. Browser Control**

Agente puede navegar la web con límites definidos.

## Casos de Uso Completos

### Caso 1: API Backend con FastAPI

**mission.md:**
```markdown
# REST API for Mobile App

Build scalable REST API with FastAPI + PostgreSQL.

Current Phase: Core endpoints (auth, users, products)
Next: Payment integration with Stripe
```

**.agent/rules/api-standards.md:**
```markdown
# API Development Standards

- Use Pydantic for request/response models
- Implement OpenAPI documentation
- Use dependency injection for database
- Async/await for all database operations
- Rate limiting: 100 req/min per user
```

**.agent/workflows/generate-endpoint.md:**
```markdown
# Generate API Endpoint

Create complete endpoint with:
- Route handler in `routers/`
- Pydantic models in `models/`
- Database operations in `repositories/`
- Unit tests in `tests/`
- OpenAPI documentation
```

### Caso 2: Data Science Project

**mission.md:**
```markdown
# Customer Churn Prediction

ML model to predict customer churn.

Success: 85%+ accuracy on test set
Deployment: Vertex AI endpoint
```

**.agent/rules/ml-standards.md:**
```markdown
# ML Development Standards

- Jupyter notebooks in `notebooks/` for exploration
- Production code in `src/` with type hints
- Track experiments with MLflow
- Minimum 80% test coverage for preprocessing
- Use scikit-learn pipelines for transformations
```

**.agent/workflows/train-model.md:**
```markdown
# Train Model Workflow

1. Load data from BigQuery
2. Split train/val/test (70/15/15)
3. Preprocess with sklearn Pipeline
4. Train with cross-validation
5. Log to MLflow
6. Save best model to GCS
7. Generate artifacts/model_report.md
```

## Referencias

### Documentación Oficial
- [Antigravity Rules & Workflows](https://antigravity.google/docs/rules-workflows)
- [Getting Started with Google Antigravity - Codelabs](https://codelabs.developers.google.com/getting-started-google-antigravity)

### Tutoriales y Guías
- [Customize Antigravity with Rules and Workflows - Mete Atamel](https://atamel.dev/posts/2025/11-25_customize_antigravity_rules_workflows/)
- [Antigravity Rules & Workflows Guide](https://memo.jimmyliao.net/p/antigravity-rules-and-workflows-guide)
- [Google Antigravity: The 2026 Guide to the Best AI IDE](https://www.aifire.co/p/google-antigravity-the-2026-guide-to-the-best-ai-ide)

### Templates y Recursos
- [Antigravity Workspace Template - GitHub](https://github.com/study8677/antigravity-workspace-template)
- [Gemini Superpowers for Antigravity - GitHub](https://github.com/anthonylee991/gemini-superpowers-antigravity)

### Issues y Discusiones
- [Antigravity + Gemini CLI Configuration Conflict - Issue #16058](https://github.com/google-gemini/gemini-cli/issues/16058)

### Otros Sistemas de Contexto
- [Comparación con CLAUDE.md](./memory-and-rules.md)
- [Comparación con GEMINI.md](./gemini-md.md)
- [Comparación con Cursor Rules](./cursor-rules.md)

---

**Nota:** Antigravity representa la evolución del IDE hacia la era agentic, con características únicas como workflows nativos, mission-driven development, y artifact-first philosophy. El sistema de Rules + Workflows proporciona la combinación más completa de guías persistentes y comandos on-demand, haciendo de Antigravity una herramienta especialmente poderosa para desarrollo asistido por agentes autónomos.
