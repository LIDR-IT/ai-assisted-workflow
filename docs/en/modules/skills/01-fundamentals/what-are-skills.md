# What Are Skills?

## Overview

**Skills** are modular capability packages that extend AI agents with specialized knowledge, workflows, and tools. They transform AI agents from general assistants into domain specialists.

## Core Concept

### Definition

Skills are:
- **Modular packages** - Self-contained units of expertise
- **Progressive disclosure** - Load only when needed
- **Agent-triggered** - Automatically activated based on user request
- **Specialized knowledge** - Domain-specific expertise and workflows
- **Cross-platform** - Work across multiple AI agents

### The Problem They Solve

Without skills:
- ❌ Repeatedly explaining the same patterns
- ❌ Context saturation from loading all knowledge upfront
- ❌ Generic responses lacking domain expertise
- ❌ Manual copy-paste of best practices

With skills:
- ✅ Install once, use forever
- ✅ Automatic activation when relevant
- ✅ Specialized domain expertise on-demand
- ✅ Consistent patterns across projects

## How Skills Work

### Progressive Disclosure Model

Skills use a three-level loading system to preserve context:

**Level 1: Metadata (~100 words)**
- Always loaded
- Skill name and description
- Used for skill discovery and triggering

**Level 2: SKILL.md Body (<5,000 words)**
- Loaded when skill triggers
- Main instructions and guidance
- Process workflows

**Level 3: Resources (Variable size)**
- Loaded as needed
- Detailed documentation
- Scripts, templates, examples

### Activation Flow

```
User Request
    ↓
Agent scans skill descriptions
    ↓
Match found → Load full skill
    ↓
Agent executes using skill knowledge
    ↓
Skill unloads after completion
```

**Example:**
```
User: "Generate unit tests for this component"
      ↓
Agent: Scans skill descriptions
      ↓
Agent: Matches "testing-skill"
      ↓
Agent: Loads full testing-skill content
      ↓
Agent: Generates tests using expertise
```

## Skills vs Other Features

### Skills vs MCP (Model Context Protocol)

| Feature | Skills | MCP |
|:--------|:-------|:----|
| **Purpose** | Task definitions ("brains") | Infrastructure connections ("hands") |
| **Activation** | Agent-triggered | Always available |
| **Lifespan** | Ephemeral (load/unload) | Persistent |
| **Content** | Instructions, scripts, templates | Protocol-based servers |
| **Example** | "Generate React tests" | "Query PostgreSQL database" |

**Analogy:**
- **MCP:** Gives agent hands to use tools
- **Skills:** Gives agent brains to know when/how to use tools

### Skills vs Rules

| Feature | Skills | Rules |
|:--------|:-------|:------|
| **Activation** | On-demand (intent match) | Always active |
| **Visibility** | Progressive disclosure | Always loaded |
| **Purpose** | Specialized capabilities | General guidelines |
| **Complexity** | Can include scripts | Instructions only |
| **Example** | "Database migration workflow" | "Use PEP 8 style" |

**When to use:**
- **Skills:** Complex, conditional expertise
- **Rules:** Continuous, universal standards

### Skills vs Commands

| Feature | Skills | Commands |
|:--------|:-------|:---------|
| **Activation** | Automatic (description match) | Manual (`/command`) |
| **Discovery** | Agent determines | User invokes |
| **Structure** | Directory with resources | Single markdown file |
| **Complexity** | Scripts + templates + examples | Instructions only |
| **Example** | Auto-loads on "validate schema" | `/generate-tests` |

**Note:** In Claude Code, commands have been merged into skills. A skill can be both auto-invoked and manually called with `/skill-name`.

### Skills vs Workflows

| Feature | Skills | Workflows |
|:--------|:-------|:----------|
| **Invocation** | Agent-driven | User-driven |
| **Scope** | Task-specific knowledge | Multi-step procedures |
| **When** | Agent decides | User explicitly triggers |
| **Example** | "Review code for security" | "Deploy to production" |

## Types of Skills

### 1. Reference Skills

Provide knowledge that applies to current work.

**Characteristics:**
- Always relevant background information
- Code conventions and style guides
- Architecture patterns
- Domain knowledge

**Example: API Conventions**
```yaml
---
name: api-conventions
description: API design patterns for this codebase
---

When writing API endpoints:
- Use RESTful naming conventions
- Return consistent error formats
- Include request validation
```

### 2. Task Skills

Step-by-step instructions for specific actions.

**Characteristics:**
- Often manually invoked
- Side-effect operations
- Multi-step workflows
- Require timing control

**Example: Deployment**
```yaml
---
name: deploy
description: Deploy application to production
disable-model-invocation: true
---

1. Run test suite
2. Build application
3. Push to deployment target
4. Verify deployment
```

### 3. Generator Skills

Create code, files, or artifacts.

**Characteristics:**
- Templates and boilerplate
- Code generation
- File creation
- Following conventions

**Example: Component Generator**
```yaml
---
name: react-component
description: Generate React components with TypeScript and tests
---

Create component with:
1. TypeScript interface
2. Component implementation
3. Unit tests
4. Documentation
```

### 4. Review/Audit Skills

Analyze code for quality, security, performance.

**Characteristics:**
- Code analysis
- Pattern detection
- Best practice checks
- Reporting findings

**Example: Security Audit**
```yaml
---
name: security-audit
description: Audit code for security vulnerabilities
---

Check for:
- SQL injection risks
- XSS vulnerabilities
- Authentication issues
- Sensitive data exposure
```

## Skill Complexity Levels

### Minimal (Instructions Only)

```
skill-name/
└── SKILL.md
```

**When to use:** Simple guidance or knowledge

### Standard (Most Common)

```
skill-name/
├── SKILL.md
├── references/
│   └── detailed-guide.md
└── examples/
    └── working-example.js
```

**When to use:** Most use cases

### Complete (Full-Featured)

```
skill-name/
├── SKILL.md
├── references/
│   ├── patterns.md
│   └── api-docs.md
├── examples/
│   ├── basic.js
│   └── advanced.js
└── scripts/
    ├── validate.sh
    └── generate.js
```

**When to use:** Complex domains requiring validation and automation

## Benefits

### For Developers

✅ **Reduced repetition** - Don't explain same patterns repeatedly
✅ **Instant expertise** - Access specialized knowledge immediately
✅ **Community validation** - Use proven, tested patterns
✅ **Cross-project consistency** - Same standards everywhere
✅ **Time savings** - Skip onboarding explanations

### For AI Agents

✅ **Enhanced capabilities** - Access specialized knowledge
✅ **Domain expertise** - Deep understanding of specific areas
✅ **Workflow knowledge** - Step-by-step process guidance
✅ **Tool integration** - Scripts and utilities for common tasks
✅ **Progressive learning** - Skills load on-demand

### For Teams

✅ **Standardization** - Consistent practices across team
✅ **Knowledge sharing** - Team expertise codified
✅ **Onboarding** - New members get instant context
✅ **Best practices** - Industry standards built-in
✅ **Quality assurance** - Proven patterns reduce errors

## Supported Platforms

Skills work across **20+ AI coding agents**, including:

### Major Platforms
- **Claude Code** (Anthropic)
- **GitHub Copilot** (GitHub/Microsoft)
- **Cursor** (Anysphere)
- **Cline** (Cline AI)
- **Gemini CLI / Antigravity** (Google)
- **OpenAI Codex** (OpenAI)

### Additional Agents
- Windsurf
- Aider
- Continue
- Supermaven
- And many more...

### Universal Compatibility

Skills follow standardized formats that work across platforms:
- **Write once, use everywhere**
- **Cross-platform compatibility**
- **Community sharing**
- **No vendor lock-in**

## Getting Started

### Using Skills

1. **Discover:** Browse [skills.sh](https://skills.sh) marketplace
2. **Install:** `npx skills add <owner/repo>`
3. **Use:** Skills activate automatically when relevant

**See:** [Using Skills Guide](../02-using-skills/discovery.md)

### Creating Skills

1. **Learn:** Understand [Design Principles](../03-creating-skills/design-principles.md)
2. **Choose:** Pick appropriate [Skill Pattern](../03-creating-skills/skill-patterns.md)
3. **Create:** Follow [Creation Workflow](../03-creating-skills/workflow.md)

**See:** [Creating Skills Guide](../03-creating-skills/workflow.md)

## Next Steps

- **Understand the architecture:** [Architecture](architecture.md)
- **Learn skill structure:** [Skill Anatomy](skill-anatomy.md)
- **Start using skills:** [Discovery Guide](../02-using-skills/discovery.md)
- **Create your first skill:** [Creation Workflow](../03-creating-skills/workflow.md)

---

**Related:**
- [Architecture](architecture.md) - How skills fit into the AI agent ecosystem
- [Skill Anatomy](skill-anatomy.md) - Structure of SKILL.md files
- [Design Principles](../03-creating-skills/design-principles.md) - Core design philosophy

**External:**
- [skills.sh](https://skills.sh) - Skills marketplace
- [Agent Skills Standard](https://agentskills.io) - Open standard
