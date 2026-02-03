# Design Patterns for Multi-Agent Development

Esta carpeta contiene patrones arquitectónicos reutilizables para desarrollo con múltiples agentes AI.

## Patrones Disponibles

### 1. Command → Agent → Skill Pattern

**Archivo:** [command-agent-skill-pattern.md](./command-agent-skill-pattern.md)

**Qué resuelve:**
Separación de responsabilidades entre interfaz de usuario (commands), lógica autónoma (agents), y conocimiento especializado (skills).

**Cuándo usarlo:**

- Workflows complejos multi-paso
- Tareas que requieren decisiones autónomas
- Necesidad de reutilizar lógica entre comandos
- Conocimiento profundo que se invoca on-demand

**Ejemplo implementado:**

```bash
/improve-docs docs/
  ↓
doc-improver agent
  ↓
Reads: documentation.md rule
Uses: doc-generator skill (si existe)
  ↓
Audit + Report + Implement
```

**Componentes:**

- **Command:** `.agents/commands/improve-docs.md`
- **Agent:** `.agents/agents/doc-improver.md`
- **Rules:** `.agents/rules/process/documentation.md`
- **Skills:** `.agents/skills/*` (opcionales)

**Ventajas:**

- ✅ Reutilización de lógica
- ✅ Separación de responsabilidades
- ✅ Mantenibilidad
- ✅ Transversal a cualquier proyecto

**Ejemplo de uso:**

```bash
# User invoca
/improve-docs docs/guides

# Command se ejecuta
# Agent doc-improver se activa
# Lee rules/process/documentation.md
# Analiza estructura
# Reporta hallazgos
# Pide aprobación
# Implementa cambios
```

## Arquitectura General

```
┌─────────────────────────────────────────────────────────┐
│ USER                                                     │
│   ↓                                                     │
│   /comando [argumentos]                                 │
└─────────────────────────────────────────────────────────┘
         │
         ↓
┌─────────────────────────────────────────────────────────┐
│ COMMAND (.agents/commands/)                             │
│ • Interfaz invocable                                    │
│ • Acepta argumentos                                     │
│ • Documenta uso                                         │
└─────────────────────────────────────────────────────────┘
         │
         ↓
┌─────────────────────────────────────────────────────────┐
│ AGENT (.agents/agents/)                                 │
│ • Workflow autónomo multi-paso                          │
│ • Lógica de negocio                                     │
│ • Usa tools (Read, Write, Grep, etc.)                   │
│ • Toma decisiones                                       │
└─────────────────────────────────────────────────────────┘
         │
         ↓
    ┌────────┴────────┐
    ↓                 ↓
┌─────────────┐  ┌──────────────┐
│ RULES       │  │ SKILLS       │
│ (.agents/   │  │ (.agents/    │
│  rules/)    │  │  skills/)    │
│             │  │              │
│ • Siempre   │  │ • On-demand  │
│   activas   │  │ • Profundas  │
│ • Restricc. │  │ • Reusables  │
│ • Estándares│  │ • Especial.  │
└─────────────┘  └──────────────┘
```

## Principios de Diseño

### 1. Separación de Responsabilidades

```
Command    → INTERFAZ    → Qué invocar
Agent      → LÓGICA      → Cómo ejecutar
Rules      → RESTRICCIÓN → Qué cumplir
Skills     → CONOCIMIENTO→ Cómo hacerlo bien
```

### 2. Source of Truth

```
.agents/                 ← Single source of truth
  ├── commands/          ← UI layer
  ├── agents/            ← Logic layer
  ├── rules/             ← Constraints (always-on)
  └── skills/            ← Knowledge (on-demand)
```

### 3. Reutilización

```
Múltiples Commands → Mismo Agent
Múltiples Agents   → Mismas Skills
Todos los Agents   → Mismas Rules
```

### 4. Transversalidad

Los patrones funcionan en **cualquier proyecto** porque:

- ✅ No dependen de tecnología específica
- ✅ Rules definen convenciones del proyecto
- ✅ Agents implementan workflows universales
- ✅ Skills proveen conocimiento especializado

## Cuándo Usar Cada Componente

### Command

**Crear cuando:**

- Necesitas interfaz invocable (`/nombre`)
- Quieres aceptar argumentos del usuario
- Deseas documentar uso para el equipo

**Ejemplos:**

- `/improve-docs [path]`
- `/review-code [file]`
- `/generate-tests [module]`

### Agent

**Crear cuando:**

- Workflow multi-paso autónomo
- Lógica compleja con decisiones
- Necesita múltiples tools
- Proceso que toma tiempo

**Ejemplos:**

- `doc-improver` - Audita documentación
- `code-reviewer` - Revisa código
- `test-generator` - Genera tests

### Rule

**Crear cuando:**

- Debe estar SIEMPRE disponible
- Define convenciones del proyecto
- Restricciones arquitectónicas
- Estándares de código/docs

**Ejemplos:**

- `documentation.md` - Estándares docs
- `code-style.md` - Estilo código
- `git-workflow.md` - Flujo Git

### Skill

**Crear cuando:**

- Conocimiento especializado profundo
- Muy grande para estar siempre en contexto
- Reutilizable en múltiples agents
- Incluye ejemplos/templates/scripts

**Ejemplos:**

- `doc-generator` - Generación de docs
- `test-patterns` - Patrones de testing
- `security-audit` - Auditoría seguridad

## Flujo de Trabajo Típico

### 1. Planificación

```markdown
Usuario necesita: Auditar documentación

1. ¿Ya existe comando? → No
2. ¿Necesita agent? → Sí (multi-paso)
3. ¿Necesita skill? → Tal vez (si muy complejo)
4. ¿Qué rules lee? → documentation.md
```

### 2. Implementación

```bash
# Paso 1: Crear command
touch .agents/commands/improve-docs.md
# Documentar interfaz, argumentos, uso

# Paso 2: Crear agent
touch .agents/agents/doc-improver.md
# Workflow, lógica, process

# Paso 3: Verificar rules existen
ls .agents/rules/process/documentation.md

# Paso 4: Crear skill (si necesario)
# mkdir .agents/skills/doc-generator
# Solo si conocimiento muy profundo

# Paso 5: Test
/improve-docs
```

### 3. Testing

```bash
# Test invocación
/improve-docs

# Test con argumentos
/improve-docs docs/

# Verificar lee rules
# Output debe mencionar estándares del proyecto

# Verificar usa tools
# Agent debe Read, Glob, Grep apropiadamente
```

### 4. Sincronización

```bash
# Sincronizar todo
/sync-setup

# O individualmente
./.agents/rules/sync-rules.sh
./.agents/skills/sync-skills.sh
```

## Casos de Uso Transversales

### 1. Code Review

```
/review-code → code-reviewer → reads code-style.md
```

### 2. Test Generation

```
/generate-tests → test-generator → reads testing.md → uses test-patterns skill
```

### 3. API Documentation

```
/document-api → api-documenter → reads documentation.md → uses api-doc-generator skill
```

### 4. Dependency Audit

```
/audit-deps → dependency-auditor → reads security.md → uses vulnerability-scanner skill
```

### 5. Refactoring Assistant

```
/refactor → refactoring-agent → reads code-style.md + principles.md
```

## Plantilla Rápida

### Nuevo Patrón Completo

```bash
# 1. Command
cat > .agents/commands/tu-comando.md << 'EOF'
---
name: tu-comando
description: Brief description
args:
  - name: arg1
    required: false
---

# Tu Comando

Usage, examples, documentation.
EOF

# 2. Agent
cat > .agents/agents/tu-agente.md << 'EOF'
---
name: tu-agente
description: Use when [conditions]. Examples: [...]
tools: ["Read", "Write", "Skill"]
---

You are [role]...

## Process:
1. Read rules
2. Execute workflow
3. Report results
EOF

# 3. Test
/tu-comando
```

## Referencias

- [Command → Agent → Skill Pattern](./command-agent-skill-pattern.md) - Patrón completo detallado
- [Commands README](../../../.agents/commands/README.md) - Guía de commands
- [Agents README](../../../.agents/agents/README.md) - Guía de agents
- [Skills README](../../../.agents/skills/README.md) - Guía de skills
- [Rules README](../../../.agents/rules/README.md) - Guía de rules

## Próximos Patrones (TODO)

- **Observer Pattern** - Hooks que reaccionan a eventos
- **Pipeline Pattern** - Secuencia de agents encadenados
- **Factory Pattern** - Generación dinámica de agents
- **Strategy Pattern** - Múltiples estrategias seleccionables
