# Antigravity Skills Platform Guide

## Overview

**Skills** in Antigravity are modular, discoverable capability packages that extend AI agent functionality with specialized knowledge and workflows through progressive disclosure. They represent a newer feature added to Antigravity on **January 15, 2026**.

**Key Innovation:** Progressive disclosure model - skills load only when needed, preventing context saturation and enabling scalable agent capabilities.

**Official Resources:**
- [Antigravity Knowledge](https://antigravity.google/docs/knowledge)
- [Authoring Antigravity Skills Codelab](https://codelabs.developers.google.com/getting-started-with-antigravity-skills)
- [Building Custom Skills Tutorial](https://medium.com/google-cloud/tutorial-getting-started-with-antigravity-skills-864041811e0d)

## What Makes Antigravity Skills Unique

### Progressive Disclosure Model

Unlike other platforms where all skills are loaded into context immediately, Antigravity implements a progressive disclosure pattern:

**How it works:**

1. **At rest:** Agent sees only SKILL.md frontmatter (name + description)
2. **On match:** User request semantically matches skill description
3. **On load:** Full skill content (instructions, scripts, resources) loads into context
4. **On execute:** Agent uses skill knowledge and tools
5. **On complete:** Skill unloads to free context

**Benefits:**
- ✅ Prevents context saturation
- ✅ Reduces token costs
- ✅ Lowers latency
- ✅ Enables specialization at scale
- ✅ Supports hundreds of skills simultaneously

**Example workflow:**
```
User: "Generate unit tests for this component"
      ↓
Agent: Scans all skill descriptions
      ↓
Agent: Matches "testing-skill" description
      ↓
Agent: Loads full testing-skill content
      ↓
Agent: Executes using testing expertise
      ↓
Agent: Unloads skill after completion
```

## Storage Locations

### Global Skills

**Location:** `~/.gemini/antigravity/skills/`

**Purpose:**
- Cross-project tools
- Personal utilities
- Universal workflows
- Reusable across all workspaces

**Example structure:**
```
~/.gemini/antigravity/skills/
├── json-formatter/
│   └── SKILL.md
├── uuid-generator/
│   └── SKILL.md
├── code-review/
│   ├── SKILL.md
│   └── scripts/
│       └── analyze.py
└── performance-analyzer/
    ├── SKILL.md
    ├── scripts/
    └── resources/
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
│   ├── SKILL.md
│   └── scripts/
│       ├── deploy.sh
│       └── validate.py
├── database-migration/
│   ├── SKILL.md
│   └── resources/
│       └── migration-template.sql
├── react-component-generator/
│   ├── SKILL.md
│   ├── scripts/
│   │   └── generate.py
│   ├── resources/
│   │   └── component-template.tsx
│   └── examples/
│       ├── input-example.json
│       └── output-example.tsx
└── api-endpoint-creator/
    ├── SKILL.md
    └── scripts/
        └── scaffold.py
```

**In this project:**
```
.agents/skills/          # Source of truth (centralized)
├── agent-development/
├── command-development/
├── find-skills/
├── hook-development/
├── mcp-integration/
├── skill-creator/
└── skill-development/

.agent/skills/           # Antigravity workspace (selective symlinks)
```

## Directory Structure

### Skill Package Layout

```
my-skill/
├── SKILL.md              # Required: Definition file
├── scripts/              # Optional: Executables (Python, Bash, Node)
│   ├── README.md
│   ├── main.py
│   └── helpers.py
├── resources/            # Optional: Templates, static files
│   ├── README.md
│   ├── template-1.txt
│   └── template-2.json
├── examples/             # Optional: Input/output pairs
│   ├── README.md
│   ├── input-1.json
│   └── output-1.py
└── assets/               # Optional: Images, data files
    └── diagram.png
```

### Minimal Skill

For simple instruction-only skills:

```
git-commit-formatter/
└── SKILL.md              # Instructions only
```

### Complex Skill

For orchestrated workflows:

```
adk-tool-scaffold/
├── SKILL.md              # Definition and orchestration logic
├── scripts/
│   ├── generate.py       # Code generation
│   ├── validate.sh       # Validation script
│   └── test.py          # Testing script
├── resources/
│   ├── tool-template.py  # Code template
│   ├── config-template.json
│   └── readme-template.md
├── examples/
│   ├── input-example.json
│   ├── output-example.py
│   └── test-example.py
└── assets/
    └── architecture.png
```

## SKILL.md Format

### Two-Part Structure

Every SKILL.md file has two parts:

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

### Critical: The Description Field

The description determines when the skill loads. It must be **specific and concrete**, not vague.

**❌ Bad descriptions (too vague):**
```yaml
description: Database tools
description: Helps with code
description: General utilities
description: Testing helper
```

**✅ Good descriptions (specific and actionable):**
```yaml
description: Executes read-only SQL queries against PostgreSQL databases for data analysis and debugging
description: Generates React functional components with TypeScript, hooks, and test files following project conventions
description: Enforces Conventional Commits specification for git commit messages with validation
description: Validates database schema migrations for consistency, safety, and best practices before applying to production
```

### Description Writing Formula

**Formula:** `[Action] [Target] [Method/Context] [Quality/Constraint]`

**Examples:**

**Good:**
```yaml
description: Executes read-only SQL queries against PostgreSQL databases for data analysis and debugging
```

**Better:**
```yaml
description: Generates React functional components with TypeScript, hooks, styling, and comprehensive test coverage following project conventions
```

**Best:**
```yaml
description: Validates database schema migrations for consistency, safety, and rollback capability before production deployment, checking for missing indexes, unsafe operations, and reversibility
```

## The 5 Skill Patterns

Antigravity skills follow five distinct patterns, each suited for different use cases.

### Pattern 1: Basic Router (Instruction-Only)

**Purpose:** Guide agent behavior with pure instructions, no external resources.

**When to use:** Simple guidance that doesn't need templates, examples, or scripts.

**Structure:**
```
git-commit-formatter/
└── SKILL.md
```

**Complete Example:**

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
- **feat:** New feature
- **fix:** Bug fix
- **docs:** Documentation
- **style:** Formatting
- **refactor:** Code restructure
- **test:** Testing
- **chore:** Maintenance

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
chore(deps): upgrade react to 18.2.0
```

## Constraints
- Never use past tense ("added" → "add")
- No capital letters in description
- No trailing period
- Scope should be noun, not verb
```

**Use when:** Pure instruction-based guidance is sufficient.

### Pattern 2: Asset Utilization (Template-Based)

**Purpose:** Reference static files to prevent token waste from inlining large content.

**When to use:** Skill needs boilerplate code, licenses, or templates.

**Structure:**
```
license-header-adder/
├── SKILL.md
└── resources/
    ├── mit-header.txt
    ├── apache-header.txt
    └── proprietary-header.txt
```

**Complete Example:**

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

### Step 1: Identify License Type
Check for LICENSE or LICENSE.txt file in project root.

### Step 2: Read Appropriate Template
- MIT: `resources/mit-header.txt`
- Apache 2.0: `resources/apache-header.txt`
- Proprietary: `resources/proprietary-header.txt`

### Step 3: Detect Programming Language
Determine comment syntax:
- Python: `#` prefix
- JavaScript/TypeScript: `/* */` block
- Java/C++: `/* */` block
- Shell: `#` prefix
- Ruby: `#` prefix
- Go: `//` or `/* */`

### Step 4: Add Header
- Place header at top of file
- Preserve shebang lines (#!/usr/bin/env)
- Use appropriate comment syntax
- Add blank line after header

### Step 5: Replace Placeholders
- `[YEAR]` → Current year
- `[COPYRIGHT HOLDER]` → From LICENSE file or prompt user

## Constraints
- Never modify existing license headers
- Preserve shebang lines at absolute top
- Don't add header to generated files
- Don't add header to package manager files (package.json, requirements.txt)
- Don't add header to configuration files unless explicitly requested

## Example Output

**Python file:**
```python
#!/usr/bin/env python3
# Copyright (c) 2026 MyCompany Inc.
#
# Permission is hereby granted, free of charge...

import os
```

**TypeScript file:**
```typescript
/*
 * Copyright (c) 2026 MyCompany Inc.
 *
 * Permission is hereby granted, free of charge...
 */

import React from 'react';
```
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

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

**Use when:** Skill needs static content (templates, licenses, boilerplate).

### Pattern 3: Few-Shot Learning (Example-Based)

**Purpose:** Demonstrate expected transformations through examples rather than descriptions.

**When to use:** Pattern is easier to show than describe, especially for code transformations.

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

**Complete Example:**

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

### Step 1: Analyze JSON Structure
- Identify nested objects
- Determine field types
- Detect optional vs required fields
- Find array patterns

### Step 2: Infer Python Types
Use this mapping:
- `string` → `str`
- `number` → `float`
- `integer` → `int`
- `boolean` → `bool`
- `array` → `List[T]`
- `object` → Nested model class
- `null` allowed → `Optional[T]`

### Step 3: Generate Pydantic Model
- Create class inheriting from `BaseModel`
- Add type hints for all fields
- Use `Field()` for validation constraints
- Add descriptive docstrings

### Step 4: Handle Edge Cases
- Optional fields use `Optional[]`
- Arrays need `List[]` import
- Email strings use `EmailStr`
- URL strings use `HttpUrl`
- Dates use `datetime`

## Examples

Review `examples/` directory for complete input/output pairs demonstrating:
- Simple objects (example 1)
- Nested objects (example 2)
- Arrays and complex types (example 3)

## Constraints
- Always use Optional[] for nullable fields
- Add Field() with constraints when possible
- Include class and field docstrings
- Use proper type imports from typing
- Follow PEP 8 naming (PascalCase for classes)
```

**File:** `examples/input-1.json`

```json
{
  "name": "John Doe",
  "age": 30,
  "email": "john@example.com",
  "tags": ["developer", "python"],
  "is_active": true
}
```

**File:** `examples/output-1.py`

```python
from pydantic import BaseModel, Field, EmailStr
from typing import List

class User(BaseModel):
    """User model from JSON schema"""

    name: str = Field(..., description="User's full name")
    age: int = Field(..., ge=0, le=150, description="User's age in years")
    email: EmailStr = Field(..., description="User's email address")
    tags: List[str] = Field(default_factory=list, description="User tags")
    is_active: bool = Field(True, description="Whether user account is active")
```

**File:** `examples/input-2.json`

```json
{
  "user": {
    "id": 123,
    "profile": {
      "firstName": "Jane",
      "lastName": "Smith"
    }
  },
  "settings": {
    "theme": "dark",
    "notifications": true
  }
}
```

**File:** `examples/output-2.py`

```python
from pydantic import BaseModel, Field
from typing import Optional

class Profile(BaseModel):
    """User profile information"""

    firstName: str = Field(..., alias="firstName")
    lastName: str = Field(..., alias="lastName")

class UserDetails(BaseModel):
    """User account details"""

    id: int = Field(..., description="Unique user identifier")
    profile: Profile = Field(..., description="User profile data")

class Settings(BaseModel):
    """User settings"""

    theme: str = Field("light", description="UI theme preference")
    notifications: bool = Field(True, description="Enable notifications")

class RootModel(BaseModel):
    """Root data model"""

    user: UserDetails
    settings: Settings
```

**Use when:** Transformation patterns are easier to show than describe.

### Pattern 4: Procedural Logic (Script-Based)

**Purpose:** Deterministic validation or computation via scripts instead of LLM judgment.

**When to use:** Binary decisions, calculations, or validations that should be consistent.

**Structure:**
```
database-schema-validator/
├── SKILL.md
└── scripts/
    ├── README.md
    ├── validate.py
    └── check_migrations.sh
```

**Complete Example:**

**File:** `database-schema-validator/SKILL.md`

```yaml
---
name: database-schema-validator
description: Validates database schema migrations for consistency, safety, and best practices before applying to production
---

# Database Schema Validator

## Goal
Ensure database migrations are safe and follow best practices.

## Instructions

### Step 1: Receive Migration File
User provides path to migration file (SQL).

### Step 2: Run Validation Script
```bash
python scripts/validate.py <migration-file>
```

### Step 3: Review Script Output
Script returns JSON with:
- `valid` (boolean): Overall validation status
- `errors` (array): Blocking issues
- `warnings` (array): Non-blocking concerns
- `suggestions` (array): Improvement recommendations

### Step 4: Report Results
- If valid=true: Approve migration with any warnings
- If valid=false: Report errors and block migration
- Always include suggestions for improvement

### Step 5: Suggest Fixes
For each error, provide:
- Explanation of why it's a problem
- Suggested fix
- Example of corrected code

## Validation Checks

The script checks for:
- **DROP TABLE without safety comment** - Prevents accidental data loss
- **Foreign keys without indexes** - Prevents performance issues
- **Missing timestamps** - created_at, updated_at required
- **ALTER without defaults** - Prevents null values
- **Irreversible operations** - Must be explicitly marked

## Script Usage

```bash
python scripts/validate.py path/to/migration.sql
```

**Exit codes:**
- `0`: Valid migration
- `1`: Errors found (blocking)
- `2`: Script error (invalid input)

**Output format:**
```json
{
  "valid": true,
  "errors": [],
  "warnings": ["Missing index on foreign key"],
  "suggestions": ["Add index on user_id column"]
}
```

## Constraints
- **Never execute migrations** - Only validate
- Report ALL errors before suggesting fixes
- Explain why each check matters
- Provide actionable suggestions
```

**File:** `scripts/README.md`

```markdown
# Database Schema Validator Scripts

## validate.py

Validates SQL migration files for safety and best practices.

**Usage:**
```bash
python validate.py <migration-file.sql>
```

**Dependencies:**
- Python 3.7+
- No external packages required

**Checks:**
- Unsafe DROP operations
- Missing indexes on foreign keys
- Missing timestamp columns
- Irreversible ALTER operations
```

**File:** `scripts/validate.py`

```python
#!/usr/bin/env python3
"""
Database migration validator
Checks SQL migrations for safety and best practices
"""
import sys
import json
import re
from typing import Dict, List

def validate_migration(filepath: str) -> Dict:
    """Validate SQL migration file"""
    try:
        with open(filepath, 'r') as f:
            sql = f.read()
    except FileNotFoundError:
        return {
            "valid": False,
            "errors": [f"File not found: {filepath}"],
            "warnings": [],
            "suggestions": []
        }

    errors = []
    warnings = []
    suggestions = []

    # Check for unsafe DROP TABLE
    drop_matches = re.finditer(r'DROP TABLE\s+(\w+)', sql, re.IGNORECASE)
    for match in drop_matches:
        table_name = match.group(1)
        # Check for safety comment within 3 lines before
        position = match.start()
        context = sql[max(0, position-200):position]
        if '-- SAFE:' not in context and '/* SAFE:' not in context:
            errors.append(f"DROP TABLE {table_name} without safety comment")
            suggestions.append(f"Add comment: -- SAFE: Dropping {table_name} because...")

    # Check for foreign keys without indexes
    fk_matches = re.finditer(r'FOREIGN KEY\s*\((\w+)\)\s*REFERENCES', sql, re.IGNORECASE)
    for match in fk_matches:
        column_name = match.group(1)
        # Check if index exists on this column
        index_pattern = rf'CREATE\s+INDEX.*ON.*\(\s*{column_name}\s*\)'
        if not re.search(index_pattern, sql, re.IGNORECASE):
            warnings.append(f"Foreign key column {column_name} missing index")
            suggestions.append(f"Add: CREATE INDEX idx_{column_name} ON table_name({column_name});")

    # Check for CREATE TABLE without timestamps
    create_table_matches = re.finditer(r'CREATE TABLE\s+(\w+)', sql, re.IGNORECASE)
    for match in create_table_matches:
        table_name = match.group(1)
        # Get the table definition
        table_start = match.start()
        # Find the end of this CREATE TABLE statement
        table_end = sql.find(');', table_start)
        if table_end == -1:
            continue
        table_def = sql[table_start:table_end].lower()

        if 'created_at' not in table_def:
            warnings.append(f"Table {table_name} missing created_at timestamp")
            suggestions.append(f"Add: created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP")

        if 'updated_at' not in table_def:
            warnings.append(f"Table {table_name} missing updated_at timestamp")
            suggestions.append(f"Add: updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP")

    # Check for ALTER without DEFAULT
    alter_add_matches = re.finditer(r'ALTER TABLE.*ADD COLUMN\s+(\w+)\s+\w+(?!\s+DEFAULT)', sql, re.IGNORECASE)
    for match in alter_add_matches:
        column_name = match.group(1)
        if 'NOT NULL' in match.group(0):
            errors.append(f"ALTER TABLE adds NOT NULL column {column_name} without DEFAULT")
            suggestions.append(f"Add DEFAULT value or make column nullable")

    result = {
        "valid": len(errors) == 0,
        "errors": errors,
        "warnings": warnings,
        "suggestions": suggestions
    }

    print(json.dumps(result, indent=2))
    return result

def main():
    """Main entry point"""
    if len(sys.argv) != 2:
        print(json.dumps({
            "valid": False,
            "errors": ["Usage: validate.py <migration-file>"],
            "warnings": [],
            "suggestions": []
        }), file=sys.stderr)
        return 2

    result = validate_migration(sys.argv[1])
    return 0 if result["valid"] else 1

if __name__ == "__main__":
    sys.exit(main())
```

**Use when:** Deterministic logic is better than LLM judgment (validation, calculation, parsing).

### Pattern 5: Complex Orchestration (Full-Featured)

**Purpose:** Multi-step workflows combining scripts, templates, and examples.

**When to use:** Complex feature generation requiring coordinated steps.

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

**Complete Example:**

**File:** `adk-tool-scaffold/SKILL.md`

```yaml
---
name: adk-tool-scaffold
description: Generates complete Agent Development Kit tool classes with validation, configuration, and tests for custom agent capabilities
---

# ADK Tool Scaffold Generator

## Goal
Generate complete, production-ready tool class for Agent Development Kit.

## Process

### Step 1: Gather Requirements
Ask user for:
- **Tool name** (PascalCase, e.g., DatabaseQuery)
- **Tool purpose** (what capability it adds)
- **Input parameters** (name:type pairs)
- **Output format** (string, json, file path)
- **Error cases** (what can go wrong)

### Step 2: Generate Tool Class
Use script to create from template:

```bash
python scripts/generate.py \
  --name ToolName \
  --description "Tool description" \
  --params "param1:str,param2:int,param3:Optional[bool]"
```

Script creates:
- Tool class file
- Configuration file
- Test file

### Step 3: Generate Configuration
Creates `ToolName.config.json` from `resources/config-template.json`:
- Tool metadata
- Parameter schemas
- Validation rules
- Usage examples

### Step 4: Validate Generated Code
Run validation to check:

```bash
bash scripts/validate.sh ToolName
```

Validates:
- Syntax correctness
- Type hint completeness
- Docstring presence
- Error handling
- Test coverage

### Step 5: Present Results
Show user:
- Generated tool class
- Configuration file
- Test file
- Usage example
- Integration instructions

## Templates

**Tool class template:** `resources/tool-template.py`
- Base class structure
- Parameter handling
- Error handling
- Type hints
- Docstrings

**Config template:** `resources/config-template.json`
- Metadata fields
- Parameter schemas
- Validation rules

## Examples

See `examples/` for complete implementations:
- `example-tool.py` - Simple tool
- `example-config.json` - Configuration

## Constraints
- Follow ADK best practices
- Include comprehensive type hints
- Add detailed docstrings
- Implement proper error handling
- Generate complete test coverage
- Validate before presenting
```

**File:** `scripts/generate.py` (abbreviated for length)

```python
#!/usr/bin/env python3
"""Generate ADK tool class from template"""
import argparse
import json
from pathlib import Path
from typing import List, Tuple

def parse_params(params_str: str) -> List[Tuple[str, str]]:
    """Parse param1:str,param2:int into list of tuples"""
    params = []
    for param in params_str.split(','):
        name, type_hint = param.strip().split(':')
        params.append((name.strip(), type_hint.strip()))
    return params

def generate_tool(name: str, description: str, params: List[Tuple[str, str]]) -> str:
    """Generate tool class code from template"""
    template_path = Path(__file__).parent.parent / 'resources' / 'tool-template.py'
    with open(template_path) as f:
        template = f.read()

    # Replace placeholders
    code = template.replace('{{TOOL_NAME}}', name)
    code = code.replace('{{TOOL_DESCRIPTION}}', description)

    # Generate parameters
    param_lines = []
    for param_name, param_type in params:
        param_lines.append(f"    {param_name}: {param_type}")
    code = code.replace('{{PARAMETERS}}', ',\n'.join(param_lines))

    return code

def main():
    parser = argparse.ArgumentParser(description='Generate ADK tool class')
    parser.add_argument('--name', required=True, help='Tool class name')
    parser.add_argument('--description', required=True, help='Tool description')
    parser.add_argument('--params', required=True, help='Parameters as name:type,name:type')

    args = parser.parse_args()

    params = parse_params(args.params)
    code = generate_tool(args.name, args.description, params)

    # Write output
    output_path = Path(f"{args.name}.py")
    with open(output_path, 'w') as f:
        f.write(code)

    print(f"Generated {output_path}")

if __name__ == '__main__':
    main()
```

**Use when:** Complex workflows need orchestration of multiple steps and artifacts.

## Script Execution in Antigravity

### How Scripts Work

Skills reference scripts via relative paths in markdown. The agent uses the `run_command` tool to execute them.

**In SKILL.md:**
```markdown
Run validation:

```bash
python scripts/validator.py --file $1
```
```

**Agent interprets:**
- **stdout** - Script output (capture and parse)
- **stderr** - Error messages (report to user)
- **Exit code** - Success (0) or failure (non-zero)

### Script Best Practices

**✅ DO:**
- Return meaningful exit codes (0=success, 1=error, 2=usage error)
- Output structured data (JSON preferred)
- Write errors to stderr
- Include `--help` option
- Handle missing dependencies gracefully
- Make scripts executable (`chmod +x`)
- Use shebang line (`#!/usr/bin/env python3`)

**❌ DON'T:**
- Assume environment setup without checking
- Use interactive prompts (not supported)
- Modify files without confirmation
- Depend on specific tool versions without checking
- Print debugging info to stdout (use stderr or logging)

### Example Script Structure

**Python:**
```python
#!/usr/bin/env python3
import sys
import json
import argparse

def main(args):
    """Main logic"""
    parser = argparse.ArgumentParser(description='Tool description')
    parser.add_argument('--input', required=True, help='Input file')
    parsed_args = parser.parse_args(args)

    try:
        # Process
        result = {"status": "success", "data": "..."}
        print(json.dumps(result, indent=2))
        return 0
    except Exception as e:
        error = {"status": "error", "message": str(e)}
        print(json.dumps(error, indent=2), file=sys.stderr)
        return 1

if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
```

**Bash:**
```bash
#!/usr/bin/env bash
set -e  # Exit on error

# Parse arguments
INPUT_FILE="$1"

if [ -z "$INPUT_FILE" ]; then
  echo '{"status":"error","message":"Usage: script.sh <input-file>"}' >&2
  exit 2
fi

# Process
if [ -f "$INPUT_FILE" ]; then
  echo '{"status":"success","data":"processed"}'
  exit 0
else
  echo '{"status":"error","message":"File not found"}' >&2
  exit 1
fi
```

## Skills vs Other Features

Understanding when to use skills versus other Antigravity features.

### Skills vs MCP

| Feature | Skills | MCP |
|---------|--------|-----|
| **Purpose** | Task definitions ("brains") | Infrastructure connections ("hands") |
| **Activation** | Agent-triggered by intent | Always available |
| **Lifespan** | Ephemeral (load/unload) | Persistent |
| **Context** | Only when needed | Always in context |
| **Complexity** | Instructions + scripts + templates | Protocol-based servers |
| **Example** | "Generate unit tests" | "Query PostgreSQL database" |

**Analogy:**
- **MCP:** Gives agent hands to use tools (database access, API calls, file operations)
- **Skills:** Gives agent brains to know when and how to use those tools

**Use together:** Skill provides testing expertise, MCP provides database access for test data.

### Skills vs Rules

| Feature | Skills | Rules |
|---------|--------|-------|
| **Activation** | Agent-triggered (intent match) | Always active |
| **Visibility** | Progressive disclosure | Always loaded |
| **Purpose** | Specialized capabilities | General guidelines |
| **Complexity** | Can include scripts | Instructions only |
| **Scope** | Specific tasks | Broad principles |
| **Example** | "Database migration validator" | "Use PEP 8 style" |

**Use Skills for:** Complex, conditional expertise that shouldn't always be in context
**Use Rules for:** Continuous, universal standards that apply to all work

### Skills vs Workflows

| Feature | Skills | Workflows |
|---------|--------|-----------|
| **Activation** | Automatic (description match) | Manual (`/command`) |
| **Discovery** | Agent determines relevance | User explicitly invokes |
| **Complexity** | Scripts + templates + examples | Instructions only |
| **Purpose** | Agent-driven expertise | User-driven tasks |
| **Visibility** | Hidden until needed | Discoverable via `/` |
| **Example** | Auto-loads on "validate schema" | `/generate-tests` command |

**Use Skills for:** Agent should decide when to use based on user request
**Use Workflows for:** User explicitly wants to run a specific process

## Best Practices for Antigravity

### Writing Effective Skills

**✅ DO:**
- **Write precise descriptions** - Concrete, specific trigger phrases
- **Offload heavy content** - Use `resources/` for static text and templates
- **Show, don't tell** - Use `examples/` for transformation patterns
- **Delegate to scripts** - Deterministic logic in code, not LLM
- **Separate concerns** - Logic (scripts), instruction (SKILL.md), knowledge (resources)
- **Keep SKILL.md under 500 lines** - Move content to resources/examples
- **Document each subdirectory** - Add README.md to scripts/, resources/, examples/
- **Test scripts independently** - Ensure they work standalone

**❌ DON'T:**
- Write vague descriptions ("Database tools", "Code helper")
- Inline large templates in SKILL.md (waste tokens)
- Rely on English for patterns examples can show
- Use LLM judgment for binary checks (use scripts)
- Mix multiple responsibilities in one skill (split them)
- Assume specific environments (check dependencies)
- Use interactive scripts (not supported)

### File Organization

**Recommended structure:**
```
my-skill/
├── SKILL.md                    # Keep under 500 lines
├── README.md                   # Optional: user-facing docs
├── scripts/
│   ├── README.md              # Document each script
│   ├── main.py                # Primary script
│   ├── helpers.py             # Shared utilities
│   └── tests/                 # Script tests
│       └── test_main.py
├── resources/
│   ├── README.md              # Explain each resource
│   ├── template-1.txt
│   └── template-2.json
├── examples/
│   ├── README.md              # Explain examples
│   ├── input-1.json
│   ├── output-1.py
│   ├── input-2.json
│   └── output-2.py
└── assets/                     # Optional: diagrams, data
    └── architecture.png
```

### Testing Skills

#### Test Activation

Verify the skill loads for appropriate requests:

**Should activate:**
```
User: "I need to validate this database migration"
User: "Check if this SQL is safe to deploy"
User: "Review this schema change"
```

**Should NOT activate:**
```
User: "What is SQL?"
User: "How do databases work?"
User: "Tell me about PostgreSQL"
```

#### Test Execution

- Scripts run successfully
- Exit codes are correct
- Output is parseable (valid JSON)
- Errors are helpful and actionable
- Resources load correctly
- Examples are followed accurately

#### Test Scripts Independently

```bash
# Test outside skill context
cd ~/.gemini/antigravity/skills/my-skill
python scripts/validate.py test-input.sql

# Verify exit code
echo $?

# Verify output format
python scripts/validate.py test-input.sql | jq .
```

## Troubleshooting

### Skill Not Activating

**Symptoms:**
- User request matches intent but skill doesn't load
- Agent doesn't use skill knowledge
- Skill never appears in context

**Solutions:**

1. **Review description specificity**
   ```yaml
   # Too vague
   description: Database tools

   # Specific enough
   description: Validates PostgreSQL database migrations for safety and best practices
   ```

2. **Test with exact phrasing**
   - Try using words from the description
   - Be more explicit in request

3. **Check skill location**
   ```bash
   # Global skills
   ls -la ~/.gemini/antigravity/skills/my-skill/

   # Workspace skills
   ls -la .agent/skills/my-skill/
   ```

4. **Verify SKILL.md format**
   - Check YAML frontmatter has correct structure
   - Ensure no syntax errors in frontmatter
   - Description must be in frontmatter, not body

5. **Restart Antigravity**
   - Skills are indexed on startup
   - Changes require restart

### Script Execution Fails

**Symptoms:**
- Script errors
- Exit code non-zero
- Missing dependencies
- Permission denied

**Solutions:**

1. **Test script independently**
   ```bash
   cd skill-directory
   python scripts/script.py --help
   ```

2. **Check shebang line**
   ```python
   #!/usr/bin/env python3
   # Not: #!/usr/bin/python3 (too specific)
   ```

3. **Verify file permissions**
   ```bash
   chmod +x scripts/script.py
   ls -la scripts/
   ```

4. **Add dependency checks**
   ```python
   try:
       import required_package
   except ImportError:
       print(json.dumps({
           "status": "error",
           "message": "Required package not installed: pip install required_package"
       }), file=sys.stderr)
       sys.exit(1)
   ```

5. **Return helpful error messages**
   ```python
   except FileNotFoundError as e:
       error = {
           "status": "error",
           "message": f"File not found: {e.filename}",
           "suggestion": "Check the file path and try again"
       }
       print(json.dumps(error), file=sys.stderr)
   ```

### Skill Conflicts

**Symptoms:**
- Wrong skill activates
- Multiple skills triggered for same request
- Unexpected skill behavior

**Solutions:**

1. **Make descriptions more specific**
   ```yaml
   # Conflicts with other React skills
   description: Generates React components

   # More specific
   description: Generates React functional components with TypeScript, hooks, tests, and storybook stories for dashboard UI
   ```

2. **Differentiate similar skills**
   - Add context (technology, framework, purpose)
   - Include constraints in description

3. **Consider merging overlapping skills**
   - If two skills often conflict, maybe they should be one skill

4. **Test with various phrasings**
   - Try different ways of asking
   - Ensure skill activates correctly each time

### Resources Not Found

**Symptoms:**
- File not found errors for templates/examples
- Scripts can't read resources

**Solutions:**

1. **Use relative paths from skill root**
   ```markdown
   Template: resources/template.txt
   Example: examples/input-1.json
   ```

2. **Check file exists**
   ```bash
   ls -la my-skill/resources/template.txt
   ```

3. **Verify path in SKILL.md matches filesystem**
   - Case sensitive
   - Check for typos

## Cross-References

### Fundamentals

For foundational skill concepts applicable across all platforms:
- [Core Concepts](../01-fundamentals/core-concepts.md) - What skills are and how they work
- [Progressive Disclosure](../01-fundamentals/progressive-disclosure.md) - Loading patterns
- [Directory Structure](../01-fundamentals/directory-structure.md) - Skill package layout

### Skill Patterns

For detailed pattern guidance:
- [Skill Patterns Overview](../03-skill-patterns/README.md) - All five patterns explained
- [Basic Router Pattern](../03-skill-patterns/basic-router.md) - Instruction-only skills
- [Asset Utilization Pattern](../03-skill-patterns/asset-utilization.md) - Template-based skills
- [Few-Shot Learning Pattern](../03-skill-patterns/few-shot-learning.md) - Example-based skills
- [Procedural Logic Pattern](../03-skill-patterns/procedural-logic.md) - Script-based skills
- [Complex Orchestration Pattern](../03-skill-patterns/complex-orchestration.md) - Full-featured skills

### Related Features

- **MCP:** See Antigravity MCP documentation for tool integration
- **Rules:** See Antigravity Rules documentation for always-on guidelines
- **Workflows:** See Antigravity Workflows documentation for slash commands

## Resources

### Official Documentation

- [Antigravity Knowledge](https://antigravity.google/docs/knowledge) - Official docs
- [Authoring Antigravity Skills](https://codelabs.developers.google.com/getting-started-with-antigravity-skills) - Google Codelab
- [Building Custom Skills Tutorial](https://medium.com/google-cloud/tutorial-getting-started-with-antigravity-skills-864041811e0d) - Medium article
- [Getting Started with Antigravity](https://codelabs.developers.google.com/getting-started-google-antigravity) - Intro guide

### In This Repository

- `.agents/skills/` - Source of truth for skills
- `.agent/skills/` - Antigravity workspace skills
- `docs/es/references/skills/antigravity-skills.md` - Spanish documentation
- `docs/es/references/rules/antigravity-rules.md` - Antigravity rules
- `docs/es/references/commands/antigravity-workflows.md` - Antigravity workflows
- `docs/es/notes/antigravity-agent-modes-settings.md` - Agent configuration

### External Resources

- [OpenSkills](https://github.com/numman-ali/openskills) - Universal skills installer
- [Vercel Labs Skills](https://github.com/vercel-labs/skills) - Skills ecosystem

---

**Last Updated:** February 2026
**Platform:** Google Antigravity
**Feature Status:** Core Feature (Added January 15, 2026)
**Document Version:** 1.0
