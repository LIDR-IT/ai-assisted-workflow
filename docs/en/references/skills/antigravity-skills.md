# Skills in Antigravity

## Overview

**Skills** in Antigravity are modular, discoverable capability packages that extend AI agent functionality with specialized knowledge and workflows through progressive disclosure.

**Official Documentation:**

- [antigravity.google/docs/knowledge](https://antigravity.google/docs/knowledge)
- [Authoring Antigravity Skills Codelab](https://codelabs.developers.google.com/getting-started-with-antigravity-skills)

**Key Innovation:** Progressive disclosure - Skills load only when needed, preventing context saturation.

---

## What Are Skills?

### Definition

Skills are:

- **Modular capability packages** - Self-contained units of expertise
- **Progressive disclosure** - Load only when intent matches
- **Agent-triggered** - Automatically activated based on user request
- **Specialized knowledge** - Domain-specific expertise and workflows

### Key Concept

Skills solve **context saturation** by implementing **progressive disclosure**: the agent initially sees only lightweight metadata, and detailed instructions/scripts load dynamically when relevant, keeping context lean and reducing latency and costs.

### Launch Date

**January 15, 2026** - Skills added as a newer feature in Antigravity

---

## Core Architecture

### Progressive Disclosure Model

**How it works:**

1. **At rest:** Agent sees only SKILL.md frontmatter (name + description)
2. **On match:** User request matches skill description
3. **On load:** Full skill content (instructions, scripts, resources) loads into context
4. **On execute:** Agent uses skill knowledge and tools
5. **On complete:** Skill unloads to free context

**Benefits:**

- ✅ Prevents context saturation
- ✅ Reduces token costs
- ✅ Lowers latency
- ✅ Enables specialization
- ✅ Scales to many skills

**Example:**

```
User: "Generate unit tests for this component"
      ↓
Agent: Scans skill descriptions
      ↓
Agent: Matches "testing-skill" description
      ↓
Agent: Loads full testing-skill content
      ↓
Agent: Executes using testing expertise
```

---

## Storage Locations

### Global Skills

**Location:** `~/.gemini/antigravity/skills/`

**Purpose:**

- Cross-project tools
- Personal utilities
- Universal workflows
- Reusable across all workspaces

**Example:**

```
~/.gemini/antigravity/skills/
├── json-formatter/
├── uuid-generator/
├── code-review/
└── performance-analyzer/
```

### Workspace Skills

**Location:** `<workspace-root>/.agent/skills/`

**Purpose:**

- Project-specific capabilities
- Framework-specific workflows
- Team-shared knowledge
- Codebase-specific automation

**Example structure:**

```
.agent/skills/
├── deployment-automation/
├── database-migration/
├── react-component-generator/
└── api-endpoint-creator/
```

**In This Project:**

```
.agents/skills/          # Source of truth
├── agent-development/
├── command-development/
├── find-skills/
├── hook-development/
├── mcp-integration/
├── skill-creator/
└── skill-development/

.agent/skills/           # Antigravity (enlaces selectivos)
```

---

## Directory Structure

### Skill Package Layout

```
my-skill/
├── SKILL.md              # Required: Definition file
├── scripts/              # Optional: Executables (Python, Bash, Node)
├── resources/            # Optional: Templates, static files
├── examples/             # Optional: Input/output pairs
└── assets/               # Optional: Images, data files
```

### Minimal Skill

```
git-commit-formatter/
└── SKILL.md              # Instructions only
```

### Complex Skill

```
adk-tool-scaffold/
├── SKILL.md              # Definition
├── scripts/
│   ├── generate.py       # Code generation
│   └── validate.sh       # Validation script
├── resources/
│   ├── tool-template.py  # Code template
│   └── config-template.json
├── examples/
│   ├── input-example.json
│   └── output-example.py
└── assets/
    └── architecture.png
```

---

## SKILL.md Format

### Two-Part Structure

**1. YAML Frontmatter** (indexed for semantic routing)

```yaml
---
name: skill-identifier
description: Detailed trigger phrase explaining when/why to use this skill
---
```

**2. Markdown Body** (loaded when skill activates)

```markdown
# Skill Name

## Goal

What this skill accomplishes

## Instructions

Step-by-step process

## Examples

Few-shot examples

## Constraints

Rules and limitations
```

### Critical: Description Field

The description determines when the skill loads. It must be specific, not vague.

**❌ Bad descriptions:**

```yaml
description: Database tools
description: Helps with code
description: General utilities
```

**✅ Good descriptions:**

```yaml
description: Executes read-only SQL queries against PostgreSQL databases for data analysis and debugging
description: Generates React functional components with TypeScript, hooks, and test files following project conventions
description: Enforces Conventional Commits specification for git commit messages with validation
```

---

## Five Skill Patterns

### 1. Basic Router (Instruction-Only)

**Purpose:** Guide agent behavior with pure instructions

**Structure:**

```
git-commit-formatter/
└── SKILL.md
```

**Example: Git Commit Formatter**

**File:** `git-commit-formatter/SKILL.md`

```yaml
---
name: git-commit-formatter
description: Enforces Conventional Commits specification for git commit messages, ensuring consistent format with type, scope, and description
---
# Git Commit Formatter

## Goal
Ensure all commit messages follow Conventional Commits specification.
## Format
```

type(scope): description

[optional body]

[optional footer]

```

## Types
- feat: New feature
- fix: Bug fix
- docs: Documentation
- style: Formatting
- refactor: Code restructure
- test: Testing
- chore: Maintenance

## Rules
- Type must be lowercase
- Scope is optional but recommended
- Description must be lowercase, no period
- First line max 72 characters
- Body and footer separated by blank line

## Examples
```

feat(auth): add OAuth2 login support
fix(api): resolve race condition in user update
docs(readme): update installation instructions

```

## Constraints
- Never use past tense ("added" → "add")
- No capital letters in description
- No trailing period
```

**Use when:** Pure instruction-based guidance is sufficient

### 2. Asset Utilization (Template-Based)

**Purpose:** Reference static files to prevent token waste

**Structure:**

```
license-header-adder/
├── SKILL.md
└── resources/
    ├── mit-header.txt
    ├── apache-header.txt
    └── proprietary-header.txt
```

**Example: License Header Adder**

**File:** `license-header-adder/SKILL.md`

```yaml
---
name: license-header-adder
description: Adds appropriate license headers to source code files based on project license type, preventing legal issues
---

# License Header Adder

## Goal
Add correct license header to source code files.

## Instructions
1. Identify project license type (check LICENSE file)
2. Read appropriate header from resources/
3. Detect programming language
4. Add header with correct comment syntax
5. Preserve existing file content

## License Templates
- MIT: resources/mit-header.txt
- Apache 2.0: resources/apache-header.txt
- Proprietary: resources/proprietary-header.txt

## Comment Syntax by Language
- Python: # prefix
- JavaScript/TypeScript: /* */ block
- Java/C++: /* */ block
- Shell: # prefix

## Constraints
- Never modify existing license headers
- Preserve shebang lines (#!/usr/bin/env)
- Don't add header to generated files
```

**File:** `resources/mit-header.txt`

```
Copyright (c) [YEAR] [COPYRIGHT HOLDER]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

[Full MIT license text...]
```

**Use when:** Skill needs static content (templates, licenses, boilerplate)

### 3. Few-Shot Learning (Example-Based)

**Purpose:** Demonstrate expected transformations with examples

**Structure:**

```
json-to-pydantic/
├── SKILL.md
└── examples/
    ├── input-1.json
    ├── output-1.py
    ├── input-2.json
    └── output-2.py
```

**Example: JSON to Pydantic**

**File:** `json-to-pydantic/SKILL.md`

```yaml
---
name: json-to-pydantic
description: Converts JSON schemas or sample JSON data into Pydantic model classes for Python data validation
---

# JSON to Pydantic Converter

## Goal
Generate Pydantic models from JSON schemas or sample data.

## Process
1. Analyze JSON structure
2. Infer Python types
3. Generate Pydantic model class
4. Add field validators if needed
5. Include docstrings

## Type Mapping
- string → str
- number → float
- integer → int
- boolean → bool
- array → List[T]
- object → nested model

## Examples in examples/ directory
Review examples/input-*.json and examples/output-*.py for patterns.

## Constraints
- Use Optional[] for nullable fields
- Add Field() for validation constraints
- Include __doc__ with field descriptions
- Use proper inheritance for nested objects
```

**File:** `examples/input-1.json`

```json
{
  "name": "John Doe",
  "age": 30,
  "email": "john@example.com",
  "tags": ["developer", "python"]
}
```

**File:** `examples/output-1.py`

```python
from pydantic import BaseModel, Field, EmailStr
from typing import List

class User(BaseModel):
    """User model from JSON schema"""
    name: str = Field(..., description="User's full name")
    age: int = Field(..., ge=0, le=150, description="User's age")
    email: EmailStr = Field(..., description="User's email address")
    tags: List[str] = Field(default_factory=list, description="User tags")
```

**Use when:** Transformation patterns are easier to show than describe

### 4. Procedural Logic (Script-Based)

**Purpose:** Deterministic validation/computation via scripts

**Structure:**

```
database-schema-validator/
├── SKILL.md
└── scripts/
    ├── validate.py
    └── check_migrations.sh
```

**Example: Database Schema Validator**

**File:** `database-schema-validator/SKILL.md`

````yaml
---
name: database-schema-validator
description: Validates database schema migrations for consistency, safety, and best practices before applying to production
---

# Database Schema Validator

## Goal
Ensure database migrations are safe and follow best practices.

## Instructions
1. User provides migration file path
2. Run validation script: `python scripts/validate.py <migration-file>`
3. Review script output for errors/warnings
4. Report validation results
5. Suggest fixes for any issues

## Validation Checks (in scripts/validate.py)
- No DROP TABLE without safety comment
- Foreign key constraints present
- Indexes on foreign keys
- No ALTER without default values
- Timestamp columns (created_at, updated_at)
- Migration reversibility

## Script Usage
```bash
python scripts/validate.py path/to/migration.sql
````

Exit codes:

- 0: Valid migration
- 1: Errors found
- 2: Warnings only

## Output Interpretation

Script returns JSON:

```json
{
  "valid": true,
  "errors": [],
  "warnings": ["Missing index on foreign key"],
  "suggestions": ["Add index on user_id column"]
}
```

## Constraints

- Never execute migrations, only validate
- Report all errors before suggesting fixes
- Explain why each check matters

````

**File:** `scripts/validate.py`

```python
#!/usr/bin/env python3
import sys
import json
import re

def validate_migration(filepath):
    """Validate SQL migration file"""
    with open(filepath) as f:
        sql = f.read()

    errors = []
    warnings = []
    suggestions = []

    # Check for unsafe DROP TABLE
    if re.search(r'DROP TABLE', sql, re.IGNORECASE):
        if '-- SAFE:' not in sql:
            errors.append("DROP TABLE without safety comment")

    # Check for foreign keys
    if re.search(r'REFERENCES', sql, re.IGNORECASE):
        # Check if index exists
        if not re.search(r'CREATE INDEX.*ON.*\(.*_id\)', sql, re.IGNORECASE):
            warnings.append("Foreign key without index")
            suggestions.append("Add index on foreign key column")

    # Check for timestamps
    if re.search(r'CREATE TABLE', sql, re.IGNORECASE):
        if 'created_at' not in sql.lower():
            warnings.append("Missing created_at timestamp")
        if 'updated_at' not in sql.lower():
            warnings.append("Missing updated_at timestamp")

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
        print("Usage: validate.py <migration-file>")
        sys.exit(2)

    sys.exit(validate_migration(sys.argv[1]))
````

**Use when:** Deterministic logic is better than LLM judgment

### 5. Complex Orchestration (Full-Featured)

**Purpose:** Multi-step workflows with scripts + templates + examples

**Structure:**

```
adk-tool-scaffold/
├── SKILL.md
├── scripts/
│   ├── generate.py
│   └── validate.sh
├── resources/
│   ├── tool-template.py
│   └── config-template.json
└── examples/
    ├── example-tool.py
    └── example-config.json
```

**Example: ADK Tool Scaffold**

**File:** `adk-tool-scaffold/SKILL.md`

````yaml
---
name: adk-tool-scaffold
description: Generates complete Agent Development Kit tool classes with validation, configuration, and tests for custom agent capabilities
---

# ADK Tool Scaffold Generator

## Goal
Generate complete, production-ready tool class for Agent Development Kit.

## Process
1. Gather tool requirements from user
2. Generate tool class from template
3. Generate configuration file
4. Generate unit tests
5. Validate generated code
6. Provide usage examples

## Generation Steps

### 1. Gather Requirements
Ask user:
- Tool name
- Tool purpose
- Input parameters
- Output format
- Error cases

### 2. Generate Tool Class
```bash
python scripts/generate.py \
  --name ToolName \
  --description "Tool description" \
  --params param1:str,param2:int
````

### 3. Generate Config

Creates config from resources/config-template.json

### 4. Validate

```bash
bash scripts/validate.sh ToolName
```

### 5. Generate Tests

Create test file with:

- Happy path tests
- Error case tests
- Edge case tests

## Templates

- resources/tool-template.py: Base tool class
- resources/config-template.json: Configuration structure

## Examples

See examples/ for complete tool implementations.

## Constraints

- Follow ADK best practices
- Include type hints
- Add docstrings
- Implement error handling
- Generate comprehensive tests

````

**Use when:** Complex workflows need orchestration of multiple steps and artifacts

---

## Script Execution

### How Scripts Work

Skills reference scripts via relative paths in markdown:

```markdown
Run validation:

\`\`\`bash
python scripts/validator.py --file $1
\`\`\`
````

Agent uses `run_command` tool to execute, then interprets:

- **stdout** - Script output
- **stderr** - Error messages
- **Exit code** - Success (0) or failure (non-zero)

### Script Best Practices

✅ **DO:**

- Return meaningful exit codes
- Output structured data (JSON)
- Write errors to stderr
- Include --help option
- Handle missing dependencies gracefully

❌ **DON'T:**

- Assume environment setup
- Use interactive prompts
- Modify files without confirmation
- Depend on specific tool versions without checking

**Example script structure:**

```python
#!/usr/bin/env python3
import sys
import json

def main(args):
    try:
        # Process
        result = {"status": "success", "data": "..."}
        print(json.dumps(result))
        return 0
    except Exception as e:
        error = {"status": "error", "message": str(e)}
        print(json.dumps(error), file=sys.stderr)
        return 1

if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
```

---

## Skills vs Other Features

### Skills vs MCP

| Feature        | Skills                      | MCP                                  |
| :------------- | :-------------------------- | :----------------------------------- |
| **Purpose**    | Task definitions ("brains") | Infrastructure connections ("hands") |
| **Activation** | Agent-triggered             | Always available                     |
| **Lifespan**   | Ephemeral (load/unload)     | Persistent                           |
| **Complexity** | Can include scripts         | Protocol-based servers               |
| **Example**    | "Generate tests"            | "Query database"                     |

**Analogy:**

- **MCP:** Gives agent hands to use tools
- **Skills:** Gives agent brains to know when/how to use tools

### Skills vs Rules

| Feature        | Skills                         | Rules              |
| :------------- | :----------------------------- | :----------------- |
| **Activation** | Agent-triggered (intent match) | Always active      |
| **Visibility** | Progressive disclosure         | Always loaded      |
| **Purpose**    | Specialized capabilities       | General guidelines |
| **Complexity** | Can include scripts            | Instructions only  |
| **Example**    | "Database migration"           | "Use PEP 8"        |

**Use Skills for:** Complex, conditional expertise
**Use Rules for:** Continuous, universal standards

### Skills vs Workflows

| Feature        | Skills                          | Workflows           |
| :------------- | :------------------------------ | :------------------ |
| **Activation** | Automatic (description match)   | Manual (`/command`) |
| **Discovery**  | Agent determines                | User invokes        |
| **Complexity** | Scripts + templates + examples  | Instructions only   |
| **Purpose**    | Agent-driven expertise          | User-driven tasks   |
| **Example**    | Auto-loads on "validate schema" | `/generate-tests`   |

**Use Skills for:** Agent should decide when to use
**Use Workflows for:** User explicitly wants to run

---

## Best Practices

### Writing Effective Skills

✅ **DO:**

- **Precise descriptions** - Concrete, specific trigger phrases
- **Offload heavy content** - Use resources/ for static text
- **Show, don't tell** - Use examples/ for patterns
- **Delegate to scripts** - Deterministic logic in code
- **Separate concerns** - Logic (scripts), instruction (SKILL.md), knowledge (resources)

❌ **DON'T:**

- Write vague descriptions ("Database tools")
- Inline large templates in SKILL.md
- Rely on English for patterns examples can show
- Use LLM judgment for binary checks
- Mix multiple responsibilities in one skill

### Description Writing

**Formula:** `[Action] [Target] [Method/Context] [Quality/Constraint]`

**Examples:**

```yaml
# Good
description: Executes read-only SQL queries against PostgreSQL databases for data analysis and debugging

# Better
description: Generates React functional components with TypeScript, hooks, styling, and comprehensive test coverage following project conventions

# Best
description: Validates database schema migrations for consistency, safety, and rollback capability before production deployment, checking for missing indexes, unsafe operations, and reversibility
```

### File Organization

```
my-skill/
├── SKILL.md                    # Keep under 500 lines
├── scripts/
│   ├── README.md              # Document each script
│   ├── main.py                # Primary script
│   └── helpers.py             # Shared utilities
├── resources/
│   ├── README.md              # Explain each resource
│   ├── template-1.txt
│   └── template-2.json
├── examples/
│   ├── README.md              # Explain examples
│   ├── input-1.json
│   └── output-1.py
└── tests/                      # Optional: test scripts
    └── test_main.py
```

### Testing Skills

**Test activation:**

```
# Should activate skill
User: "I need to validate this database migration"

# Should activate skill
User: "Generate a React component for the user dashboard"

# Should NOT activate skill (different intent)
User: "What is React?"
```

**Test execution:**

- Scripts run successfully
- Exit codes correct
- Output parseable
- Errors helpful

---

## Common Use Cases

### Development Tools

**Component Generator:**

```yaml
name: react-component-generator
description: Creates complete React functional components with TypeScript, styled-components, tests, and storybook stories following project architecture
```

**API Endpoint Creator:**

```yaml
name: api-endpoint-creator
description: Generates REST API endpoints with Express routes, validation middleware, error handling, and integration tests following OpenAPI spec
```

### Code Quality

**Linter Custom Rules:**

```yaml
name: eslint-rule-creator
description: Creates custom ESLint rules with AST manipulation, test cases, and documentation for enforcing team-specific code standards
```

**Code Review Automation:**

```yaml
name: code-review-checklist
description: Performs automated code review checking for security issues, performance problems, test coverage, and adherence to style guide
```

### Database Operations

**Migration Generator:**

```yaml
name: database-migration-generator
description: Creates safe database migrations with up/down scripts, data preservation, index creation, and rollback procedures for PostgreSQL
```

**Schema Documenter:**

```yaml
name: schema-documenter
description: Generates comprehensive database schema documentation with entity relationships, column descriptions, and index explanations from existing database
```

### Deployment & DevOps

**Docker Configuration:**

```yaml
name: docker-compose-generator
description: Creates production-ready docker-compose files with multi-stage builds, environment configuration, networking, and volume management
```

**CI/CD Pipeline:**

```yaml
name: github-actions-workflow
description: Generates GitHub Actions workflows with testing, building, deployment, and notifications following security best practices
```

---

## Advanced Patterns

### Skill Composition

Skills can reference other skills:

```markdown
# Complex Feature Generator

## Process

1. Use react-component-generator for UI
2. Use api-endpoint-creator for backend
3. Use database-migration-generator for schema
4. Use integration-test-generator for tests
```

### Conditional Skill Loading

```yaml
description: Generates Python Pydantic models from JSON schemas, but ONLY for Python projects (check for requirements.txt or pyproject.toml)
```

### Skill Versioning

```
skills/
├── react-component-generator-v1/
└── react-component-generator-v2/
```

Different descriptions ensure correct version loads.

---

## Troubleshooting

### Skill Not Activating

**Symptoms:**

- Request matches intent but skill doesn't load
- Agent doesn't use skill knowledge

**Solutions:**

- Review description specificity
- Test with exact phrasing
- Check skill location (global vs workspace)
- Verify SKILL.md frontmatter format
- Restart Antigravity

### Script Execution Fails

**Symptoms:**

- Script errors
- Exit code non-zero
- Missing dependencies

**Solutions:**

- Test script independently
- Check shebang line (#!/usr/bin/env python3)
- Verify file permissions (chmod +x)
- Add dependency checks in script
- Return helpful error messages

### Skill Conflicts

**Symptoms:**

- Wrong skill activates
- Multiple skills triggered

**Solutions:**

- Make descriptions more specific
- Differentiate similar skills clearly
- Consider merging overlapping skills
- Test with various phrasings

---

## Resources

### Official Documentation

- [Antigravity Knowledge](https://antigravity.google/docs/knowledge)
- [Authoring Antigravity Skills](https://codelabs.developers.google.com/getting-started-with-antigravity-skills)
- [Getting Started with Antigravity](https://codelabs.developers.google.com/getting-started-google-antigravity)
- [How to Build Custom Skills](https://medium.com/google-cloud/tutorial-getting-started-with-antigravity-skills-864041811e0d)

### In This Repository

- `docs/notes/antigravity-agent-modes-settings.md` - Agent modes configuration
- `docs/references/rules/antigravity-rules.md` - Rules documentation
- `docs/references/commands/antigravity-workflows.md` - Workflows documentation
- `docs/references/skills/openskills.md` - OpenSkills (universal loader)
- `.agents/skills/` - Source of truth for skills
- `.agent/skills/` - Antigravity skills directory

### Related

- [OpenSkills](https://github.com/numman-ali/openskills) - Universal skills installer
- [Vercel Labs Skills](https://github.com/vercel-labs/skills) - Skills ecosystem

---

**Last Updated:** January 2026
**Category:** Antigravity Skills
**Status:** Core Feature (Added January 15, 2026)
**Platform:** Google Antigravity

## Sources

- [Authoring Google Antigravity Skills | Google Codelabs](https://codelabs.developers.google.com/getting-started-with-antigravity-skills)
- [How to Build Custom Skills in Google Antigravity: 5 Practical Examples | Google Cloud - Community](https://medium.com/google-cloud/tutorial-getting-started-with-antigravity-skills-864041811e0d)
- [Getting Started with Google Antigravity | Google Codelabs](https://codelabs.developers.google.com/getting-started-google-antigravity)
- [Google Antigravity](https://antigravity.google/docs/knowledge)
