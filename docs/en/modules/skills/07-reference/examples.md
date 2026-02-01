# Skill Examples: Complete Working Patterns

This document provides 10 complete, production-ready skill examples demonstrating different patterns and complexity levels. Each example includes the full directory structure, all supporting files, and explanation of when to use that pattern.

**Organization:** Simple → Standard → Complex

---

## Simple Skills (Instructions Only)

### 1. Code Review Skill (Simple Instruction)

**Use Case:** Provide systematic code review guidance without external scripts or templates.

**When to Use This Pattern:**
- Pure instruction-based guidance is sufficient
- No need for templates or scripts
- Domain knowledge can be expressed in text

**Directory Structure:**
```
code-review/
└── SKILL.md
```

**File:** `.claude/skills/code-review/SKILL.md`

```markdown
---
name: code-review
description: Review code for bugs, performance, security, and best practices. Use when user asks to review code files or pull requests.
---

# Code Review

Systematically review code for quality issues.

## Security

Check for:
- SQL injection vulnerabilities (parameterized queries?)
- XSS attack vectors (input sanitization?)
- Authentication bypass risks (access control?)
- Sensitive data exposure (secrets in code?)
- CSRF protection (state-changing operations?)

## Performance

Check for:
- N+1 query problems (database calls in loops?)
- Missing database indexes (slow queries?)
- Inefficient algorithms (O(n²) where O(n) possible?)
- Memory leaks (event listeners cleaned up?)
- Unnecessary re-renders (React memoization?)

## Best Practices

Check for:
- Code organization (separation of concerns?)
- Error handling (edge cases covered?)
- Type safety (TypeScript strict mode?)
- Documentation (complex logic explained?)
- Test coverage (critical paths tested?)

## Output Format

Provide findings as:
- **File:Line** - Issue description
- **Severity:** Critical/High/Medium/Low
- **Recommendation:** Specific fix

Example:
```
src/api/users.js:45 - SQL injection risk
Severity: Critical
Recommendation: Use parameterized query: db.query('SELECT * FROM users WHERE id = ?', [userId])
```

## Focus

Prioritize:
1. Security issues (always highest priority)
2. Bugs and correctness
3. Performance problems
4. Best practice violations
```

**Why This Works:**
- Concise instructions (~50 lines)
- Clear structure for systematic review
- No dependencies or scripts needed
- Easily customizable for specific codebases

---

### 2. Commit Formatter Skill (Convention Enforcer)

**Use Case:** Enforce conventional commit standards with instruction-based validation.

**When to Use This Pattern:**
- Enforcing structured formats
- Validating against specifications
- Providing clear rules and examples

**Directory Structure:**
```
git-commit-formatter/
└── SKILL.md
```

**File:** `.claude/skills/git-commit-formatter/SKILL.md`

```markdown
---
name: git-commit-formatter
description: Enforces Conventional Commits specification for git commit messages with type, scope, and description. Use when creating or validating commit messages.
---

# Git Commit Formatter

Ensure all commit messages follow Conventional Commits specification.

## Format

```
type(scope): description

[optional body]

[optional footer]
```

## Types

- **feat** - New feature
- **fix** - Bug fix
- **docs** - Documentation only
- **style** - Code formatting (no logic change)
- **refactor** - Code restructure (no behavior change)
- **test** - Adding/updating tests
- **chore** - Maintenance (dependencies, configs)
- **perf** - Performance improvement

## Rules

1. Type must be lowercase
2. Scope is optional but recommended (component/module name)
3. Description must be:
   - Lowercase after colon
   - Imperative mood ("add" not "added")
   - No period at end
   - Under 50 characters
4. Body explains WHY (not how)
5. Footer for breaking changes or issue references

## Examples

**Good:**
```
feat(auth): add OAuth2 login support
fix(api): resolve race condition in user update
docs(readme): update installation instructions
refactor(database): extract query builder logic
```

**Bad:**
```
Added new feature          ❌ No type, past tense
fix: Fixed stuff.          ❌ Vague, period at end
FEAT(API): Add Endpoint    ❌ Uppercase
fix(api): Fixed the bug that was causing issues with the user authentication flow
                          ❌ Too long (>50 chars)
```

## Breaking Changes

```
feat(api): change authentication endpoint

BREAKING CHANGE: Auth endpoint now requires POST instead of GET.
Update all API clients to use POST /auth/login.

Refs: #234
```

## Validation Checklist

Before committing:
- [ ] Type is valid (feat, fix, docs, etc.)
- [ ] Subject under 50 characters
- [ ] Imperative mood ("add" not "added")
- [ ] Lowercase after type(scope):
- [ ] No period at end of subject
- [ ] Body explains WHY (if present)
- [ ] Breaking changes documented
```

**Why This Works:**
- Clear specification with examples
- Good/bad examples aid learning
- Validation checklist for self-checking
- No scripts needed for simple validation

---

## Standard Skills (With Supporting Files)

### 3. API Endpoint Generator (Template-Based)

**Use Case:** Generate consistent API endpoints with validation, error handling, and tests.

**When to Use This Pattern:**
- Code generation from templates
- Consistent file structure needed
- Multiple related files created together

**Directory Structure:**
```
api-generator/
├── SKILL.md
├── assets/
│   ├── endpoint-template.ts
│   ├── validation-schema.ts
│   └── test-template.spec.ts
└── references/
    └── rest-patterns.md
```

**File:** `.claude/skills/api-generator/SKILL.md`

```markdown
---
name: api-generator
description: Generate REST API endpoints with TypeScript, Zod validation, error handling, and tests. Use when creating new API routes.
---

# API Endpoint Generator

Generate production-ready API endpoints following REST best practices.

## Process

1. Identify HTTP method (GET, POST, PUT, DELETE)
2. Define input schema with Zod
3. Generate endpoint from template
4. Add error handling
5. Create tests

## Endpoint Structure

Every endpoint should include:

1. **Input validation** - Zod schema
2. **Authentication** - Check user permissions
3. **Business logic** - Core functionality
4. **Error handling** - Try/catch with typed errors
5. **Response formatting** - Consistent structure

## Templates

Use these templates as starting points:

- `assets/endpoint-template.ts` - Base endpoint structure
- `assets/validation-schema.ts` - Zod validation patterns
- `assets/test-template.spec.ts` - Test file structure

## Example Generation

**User request:** "Create endpoint to fetch user by ID"

**Generated files:**

1. **`src/api/users/get-user.ts`** (from endpoint-template.ts)
2. **`src/api/users/schemas.ts`** (from validation-schema.ts)
3. **`tests/api/users/get-user.spec.ts`** (from test-template.spec.ts)

## Best Practices

See `references/rest-patterns.md` for:
- RESTful URL design
- Status code selection
- Error response format
- Pagination patterns
- Rate limiting

## Output

Present generated code with explanations:
- What each section does
- Why this structure is used
- How to customize for specific needs
```

**File:** `assets/endpoint-template.ts`

```typescript
import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { db } from '@/lib/database';
import { AppError } from '@/lib/errors';

// Define input validation schema
const QuerySchema = z.object({
  id: z.string().uuid(),
});

/**
 * [ENDPOINT_DESCRIPTION]
 *
 * @route [HTTP_METHOD] /api/[RESOURCE]
 * @access [Public/Private]
 */
export async function [HANDLER_NAME](
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // 1. Validate input
    const { id } = QuerySchema.parse(req.params);

    // 2. Check authentication/authorization
    if (!req.user) {
      throw new AppError('Unauthorized', 401);
    }

    // 3. Execute business logic
    const result = await db.[TABLE].findUnique({
      where: { id },
    });

    if (!result) {
      throw new AppError('[RESOURCE] not found', 404);
    }

    // 4. Return success response
    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    // 5. Handle errors
    next(error);
  }
}
```

**File:** `assets/validation-schema.ts`

```typescript
import { z } from 'zod';

// Common patterns for validation

export const IdSchema = z.object({
  id: z.string().uuid('Invalid ID format'),
});

export const PaginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export const SearchSchema = z.object({
  query: z.string().min(1).max(100),
  filters: z.record(z.string()).optional(),
});

// [CUSTOM_SCHEMA_NAME]
export const [RESOURCE]Schema = z.object({
  // Add fields here
  name: z.string().min(1).max(255),
  email: z.string().email(),
  age: z.number().int().min(0).max(150).optional(),
});
```

**File:** `assets/test-template.spec.ts`

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { app } from '@/app';
import { db } from '@/lib/database';

describe('[ENDPOINT_PATH]', () => {
  beforeEach(async () => {
    // Setup test data
    await db.[TABLE].deleteMany();
  });

  describe('[HTTP_METHOD] /api/[RESOURCE]', () => {
    it('should return [RESOURCE] successfully', async () => {
      // Arrange
      const test[Resource] = await db.[TABLE].create({
        data: { /* test data */ },
      });

      // Act
      const response = await request(app)
        .[METHOD](`/api/[RESOURCE]/${test[Resource].id}`)
        .set('Authorization', `Bearer ${testToken}`);

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toMatchObject({
        id: test[Resource].id,
      });
    });

    it('should return 404 when [RESOURCE] not found', async () => {
      const response = await request(app)
        .[METHOD]('/api/[RESOURCE]/non-existent-id')
        .set('Authorization', `Bearer ${testToken}`);

      expect(response.status).toBe(404);
    });

    it('should return 401 when unauthorized', async () => {
      const response = await request(app)
        .[METHOD]('/api/[RESOURCE]/some-id');

      expect(response.status).toBe(401);
    });
  });
});
```

**Why This Works:**
- Templates prevent repetitive typing
- Consistent structure across codebase
- Placeholders like `[RESOURCE]` are easy to replace
- Covers common patterns (validation, auth, error handling)

---

### 4. License Header Adder (Asset-Based)

**Use Case:** Add license headers to source files without duplicating license text in SKILL.md.

**When to Use This Pattern:**
- Static content that shouldn't be in SKILL.md
- Multiple variants of the same content
- Legal text or boilerplate

**Directory Structure:**
```
license-header-adder/
├── SKILL.md
└── resources/
    ├── mit-header.txt
    ├── apache-header.txt
    └── proprietary-header.txt
```

**File:** `.claude/skills/license-header-adder/SKILL.md`

```markdown
---
name: license-header-adder
description: Adds appropriate license headers to source code files based on project license type. Use when adding license headers to new files.
---

# License Header Adder

Add correct license headers to source code files.

## Process

1. Identify project license type (check LICENSE file in repo root)
2. Read appropriate header template from `resources/`
3. Detect file's programming language
4. Add header with correct comment syntax
5. Preserve existing content and special lines (shebang, encoding)

## License Templates

Available in `resources/`:
- `mit-header.txt` - MIT License
- `apache-header.txt` - Apache 2.0
- `proprietary-header.txt` - Proprietary/Commercial

## Comment Syntax by Language

Apply headers using language-appropriate syntax:

**Block comments (/* */)**:
- JavaScript, TypeScript, Java, C, C++, CSS, Go

**Line comments (#)**:
- Python, Ruby, Shell, YAML, Perl, R

**XML comments (<!-- -->)**:
- HTML, XML, Markdown

## Special Cases

1. **Shebang lines**: Preserve at top, header goes after
   ```python
   #!/usr/bin/env python3
   # Copyright (c) 2026...
   ```

2. **Encoding declarations**: Preserve, header goes after
   ```python
   # -*- coding: utf-8 -*-
   # Copyright (c) 2026...
   ```

3. **Generated files**: Skip files with `@generated` marker

## Rules

- Never modify existing license headers
- Preserve all existing code
- Use current year in copyright notice
- Replace `[YEAR]` and `[COPYRIGHT_HOLDER]` in templates
```

**File:** `resources/mit-header.txt`

```
Copyright (c) [YEAR] [COPYRIGHT_HOLDER]

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

**File:** `resources/apache-header.txt`

```
Copyright [YEAR] [COPYRIGHT_HOLDER]

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
```

**Why This Works:**
- Prevents bloating SKILL.md with license text
- Easy to add new license types
- Clear separation of instructions vs content

---

### 5. JSON to Pydantic Converter (Example-Based)

**Use Case:** Transform JSON to Pydantic models using few-shot learning.

**When to Use This Pattern:**
- Transformation patterns easier to show than describe
- Multiple example pairs demonstrate edge cases
- Visual learning aids understanding

**Directory Structure:**
```
json-to-pydantic/
├── SKILL.md
└── examples/
    ├── basic-input.json
    ├── basic-output.py
    ├── nested-input.json
    ├── nested-output.py
    ├── array-input.json
    └── array-output.py
```

**File:** `.claude/skills/json-to-pydantic/SKILL.md`

```markdown
---
name: json-to-pydantic
description: Converts JSON schemas or sample JSON data into Pydantic model classes for Python data validation. Use when generating Pydantic models.
---

# JSON to Pydantic Converter

Generate Pydantic models from JSON schemas or sample data.

## Process

1. Analyze JSON structure
2. Infer Python types from JSON types
3. Generate Pydantic BaseModel class
4. Add field validators if constraints present
5. Include docstrings and type hints

## Type Mapping

```
JSON          → Pydantic
string        → str
number        → float
integer       → int
boolean       → bool
array         → List[T]
object        → nested BaseModel
null/optional → Optional[T]
```

## Examples

Review `examples/` directory for transformation patterns:

- `basic-*.json|py` - Simple flat objects
- `nested-*.json|py` - Objects with nested structures
- `array-*.json|py` - Arrays and lists

## Field Constraints

When JSON includes constraints, map to Pydantic Field():

```python
# String constraints
name: str = Field(..., min_length=1, max_length=100)
email: str = Field(..., regex=r'^\S+@\S+\.\S+$')

# Numeric constraints
age: int = Field(..., ge=0, le=150)
price: float = Field(..., gt=0)

# Optional fields
nickname: Optional[str] = None
```

## Output Format

Generate:
1. Import statements (pydantic, typing)
2. Model class with docstring
3. Field definitions with types
4. Nested models if needed
5. Example usage in docstring
```

**File:** `examples/basic-input.json`

```json
{
  "name": "John Doe",
  "age": 30,
  "email": "john@example.com",
  "is_active": true
}
```

**File:** `examples/basic-output.py`

```python
from pydantic import BaseModel, Field, EmailStr

class User(BaseModel):
    """User model with basic fields"""
    name: str = Field(..., description="User's full name")
    age: int = Field(..., ge=0, le=150, description="User's age")
    email: EmailStr = Field(..., description="User's email address")
    is_active: bool = Field(default=True, description="Account active status")

# Example usage:
# user = User(name="John Doe", age=30, email="john@example.com", is_active=True)
```

**File:** `examples/nested-input.json`

```json
{
  "user": {
    "name": "Jane Doe",
    "email": "jane@example.com"
  },
  "address": {
    "street": "123 Main St",
    "city": "San Francisco",
    "zip_code": "94102"
  }
}
```

**File:** `examples/nested-output.py`

```python
from pydantic import BaseModel, Field, EmailStr

class UserInfo(BaseModel):
    """User information"""
    name: str = Field(..., description="User's name")
    email: EmailStr = Field(..., description="User's email")

class Address(BaseModel):
    """Physical address"""
    street: str = Field(..., description="Street address")
    city: str = Field(..., description="City name")
    zip_code: str = Field(..., regex=r'^\d{5}$', description="5-digit ZIP code")

class UserProfile(BaseModel):
    """Complete user profile with nested objects"""
    user: UserInfo = Field(..., description="User information")
    address: Address = Field(..., description="Physical address")
```

**File:** `examples/array-input.json`

```json
{
  "name": "Project",
  "tags": ["python", "api", "backend"],
  "contributors": [
    {"name": "Alice", "role": "Developer"},
    {"name": "Bob", "role": "Designer"}
  ]
}
```

**File:** `examples/array-output.py`

```python
from pydantic import BaseModel, Field
from typing import List

class Contributor(BaseModel):
    """Project contributor"""
    name: str = Field(..., description="Contributor name")
    role: str = Field(..., description="Contributor role")

class Project(BaseModel):
    """Project with lists of simple and complex items"""
    name: str = Field(..., description="Project name")
    tags: List[str] = Field(default_factory=list, description="Project tags")
    contributors: List[Contributor] = Field(
        default_factory=list,
        description="Project contributors"
    )
```

**Why This Works:**
- Examples show patterns better than text
- Multiple examples cover edge cases
- Users can reference similar structures
- Progressive complexity (basic → nested → arrays)

---

## Advanced Skills (Script-Based)

### 6. Database Schema Validator (Script-Based)

**Use Case:** Validate SQL migrations with deterministic checks that require precise logic.

**When to Use This Pattern:**
- Deterministic validation better in code
- Complex logic hard to describe in text
- Repeatable checks needed

**Directory Structure:**
```
database-schema-validator/
├── SKILL.md
└── scripts/
    ├── validate.py
    └── check_migrations.sh
```

**File:** `.claude/skills/database-schema-validator/SKILL.md`

```markdown
---
name: database-schema-validator
description: Validates database schema migrations for safety, consistency, and best practices before applying to production. Use when checking SQL migration files.
---

# Database Schema Validator

Ensure database migrations are safe and follow best practices.

## Process

1. User provides migration file path
2. Run validation script
3. Review script output
4. Report validation results with severity
5. Suggest fixes for any issues found

## Usage

```bash
python scripts/validate.py path/to/migration.sql
```

## Validation Checks

The script validates:

**Safety:**
- No DROP TABLE without safety comment
- No DROP COLUMN on populated tables
- Destructive operations clearly marked

**Performance:**
- Indexes on foreign keys
- No missing indexes on frequently queried columns
- Consider covering indexes

**Best Practices:**
- Timestamp columns (created_at, updated_at)
- Foreign key constraints present
- Default values on ALTER COLUMN
- Migration reversibility

**Consistency:**
- Naming conventions (snake_case)
- Data type consistency
- NULL/NOT NULL declarations

## Output Interpretation

Script returns JSON with:

```json
{
  "valid": false,
  "errors": [
    "DROP TABLE without safety comment"
  ],
  "warnings": [
    "Missing index on foreign key user_id"
  ],
  "suggestions": [
    "Add index: CREATE INDEX idx_user_id ON table(user_id)"
  ]
}
```

**Exit codes:**
- 0: Valid migration
- 1: Errors found (must fix)
- 2: Warnings only (review recommended)

## Your Role

After running script:
1. Explain what each error/warning means
2. Why it matters for production safety
3. How to fix each issue
4. Whether migration can proceed with warnings
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
from pathlib import Path
from typing import List, Dict

def validate_migration(filepath: str) -> Dict:
    """Validate SQL migration file"""
    with open(filepath) as f:
        sql = f.read().upper()  # Case-insensitive matching

    errors = []
    warnings = []
    suggestions = []

    # Check for unsafe DROP TABLE
    if 'DROP TABLE' in sql:
        if '-- SAFE:' not in sql:
            errors.append("DROP TABLE without safety comment")
            suggestions.append("Add comment: -- SAFE: Confirmed table no longer needed")

    # Check for foreign keys without indexes
    fk_matches = re.findall(r'FOREIGN KEY\s*\((\w+)\)', sql)
    for fk_column in fk_matches:
        index_pattern = f'INDEX.*{fk_column}'
        if not re.search(index_pattern, sql):
            warnings.append(f"Foreign key '{fk_column}' without index")
            suggestions.append(f"Add index: CREATE INDEX idx_{fk_column} ON table({fk_column})")

    # Check for timestamps
    if 'CREATE TABLE' in sql:
        if 'CREATED_AT' not in sql:
            warnings.append("Missing created_at timestamp column")
            suggestions.append("Add: created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP")

        if 'UPDATED_AT' not in sql:
            warnings.append("Missing updated_at timestamp column")
            suggestions.append("Add: updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP")

    # Check for ALTER without defaults
    if 'ALTER TABLE' in sql and 'ADD COLUMN' in sql:
        if 'DEFAULT' not in sql and 'NOT NULL' in sql:
            errors.append("ALTER TABLE ADD COLUMN NOT NULL without DEFAULT")
            suggestions.append("Add DEFAULT value or make column NULL")

    # Check for missing foreign key constraints
    if re.search(r'(\w+_id)\s+', sql):
        if 'FOREIGN KEY' not in sql:
            warnings.append("Column ending in _id without FOREIGN KEY constraint")
            suggestions.append("Add foreign key constraint if referencing another table")

    result = {
        "valid": len(errors) == 0,
        "errors": errors,
        "warnings": warnings,
        "suggestions": suggestions
    }

    return result


def main():
    if len(sys.argv) != 2:
        print("Usage: validate.py <migration-file>", file=sys.stderr)
        sys.exit(2)

    filepath = sys.argv[1]

    if not Path(filepath).exists():
        print(f"Error: File not found: {filepath}", file=sys.stderr)
        sys.exit(2)

    result = validate_migration(filepath)

    # Pretty print JSON
    print(json.dumps(result, indent=2))

    # Exit with appropriate code
    if not result["valid"]:
        sys.exit(1)  # Errors found
    elif result["warnings"]:
        sys.exit(2)  # Warnings only
    else:
        sys.exit(0)  # All good


if __name__ == "__main__":
    main()
```

**File:** `scripts/check_migrations.sh`

```bash
#!/bin/bash
# Check all migration files in a directory

set -e

MIGRATION_DIR="${1:-.}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "🔍 Checking migrations in: $MIGRATION_DIR"
echo ""

total=0
passed=0
warned=0
failed=0

for file in "$MIGRATION_DIR"/*.sql; do
    if [ ! -f "$file" ]; then
        continue
    fi

    total=$((total + 1))
    echo "Checking: $(basename "$file")"

    if python3 "$SCRIPT_DIR/validate.py" "$file"; then
        echo "  ✅ Passed"
        passed=$((passed + 1))
    else
        exit_code=$?
        if [ $exit_code -eq 1 ]; then
            echo "  ❌ Failed"
            failed=$((failed + 1))
        elif [ $exit_code -eq 2 ]; then
            echo "  ⚠️  Warnings"
            warned=$((warned + 1))
        fi
    fi
    echo ""
done

echo "=========================================="
echo "Total: $total"
echo "Passed: $passed"
echo "Warnings: $warned"
echo "Failed: $failed"
echo "=========================================="

if [ $failed -gt 0 ]; then
    exit 1
fi
```

**Why This Works:**
- Deterministic checks more reliable than LLM judgment
- Script provides consistent, repeatable validation
- JSON output easy to parse and present
- Can be integrated into CI/CD pipeline

---

### 7. React Component Generator (Complex Orchestration)

**Use Case:** Generate complete React component with TypeScript, styles, tests, and Storybook story.

**When to Use This Pattern:**
- Multi-file generation with relationships
- Orchestrating multiple steps
- Complex transformations and validations

**Directory Structure:**
```
react-component-generator/
├── SKILL.md
├── scripts/
│   ├── generate.py
│   └── validate-component.sh
├── assets/
│   ├── component.tsx.template
│   ├── styles.module.css.template
│   ├── test.spec.tsx.template
│   └── story.stories.tsx.template
└── references/
    └── component-patterns.md
```

**File:** `.claude/skills/react-component-generator/SKILL.md`

```markdown
---
name: react-component-generator
description: Generates complete React functional components with TypeScript, styled-components, tests, and Storybook stories. Use when creating new React components.
---

# React Component Generator

Generate production-ready React components following project conventions.

## Process

1. Gather requirements (component name, props, features)
2. Generate component file from template
3. Generate styles file
4. Generate test file
5. Generate Storybook story
6. Validate generated files
7. Present summary with usage example

## Generated Files

For component `Button`, generates:

```
src/components/Button/
├── Button.tsx           # Component implementation
├── Button.module.css    # Component styles
├── Button.spec.tsx      # Unit tests
└── Button.stories.tsx   # Storybook story
```

## Requirements Gathering

Ask user for:

**Required:**
- Component name (PascalCase)
- Basic purpose

**Optional:**
- Props and their types
- State requirements
- Event handlers needed
- Special features (accessibility, responsive, etc.)

## Generation

Use `scripts/generate.py`:

```bash
python scripts/generate.py \
  --name Button \
  --props "label:string,onClick:function,disabled:boolean" \
  --features "accessibility,responsive"
```

## Templates

Located in `assets/`:
- `component.tsx.template` - Functional component with TypeScript
- `styles.module.css.template` - CSS modules
- `test.spec.tsx.template` - Vitest tests
- `story.stories.tsx.template` - Storybook story

See `references/component-patterns.md` for architectural patterns.

## Validation

After generation, run:

```bash
bash scripts/validate-component.sh src/components/Button
```

Validates:
- TypeScript compilation
- No unused imports
- Props documented
- Tests present
- Story renders

## Best Practices Applied

Generated components follow:
- Functional components with hooks
- TypeScript strict mode
- CSS Modules for styling
- Comprehensive prop types
- Accessibility attributes
- Responsive design patterns
- Test coverage
```

**File:** `assets/component.tsx.template`

```typescript
import React from 'react';
import styles from './[COMPONENT_NAME].module.css';

interface [COMPONENT_NAME]Props {
  /**
   * [PROP_DESCRIPTION]
   */
  [PROP_NAME]: [PROP_TYPE];

  /**
   * Optional className for styling
   */
  className?: string;
}

/**
 * [COMPONENT_NAME] - [COMPONENT_DESCRIPTION]
 *
 * @example
 * ```tsx
 * <[COMPONENT_NAME] [EXAMPLE_PROPS] />
 * ```
 */
export const [COMPONENT_NAME]: React.FC<[COMPONENT_NAME]Props> = ({
  [PROP_NAME],
  className,
}) => {
  return (
    <div className={`${styles.container} ${className || ''}`}>
      {/* Component implementation */}
      [COMPONENT_CONTENT]
    </div>
  );
};

[COMPONENT_NAME].displayName = '[COMPONENT_NAME]';
```

**File:** `scripts/generate.py`

```python
#!/usr/bin/env python3
"""Generate React component with all supporting files"""
import argparse
import os
from pathlib import Path
from string import Template

def parse_props(props_string):
    """Parse props from 'name:type,name:type' format"""
    if not props_string:
        return []

    props = []
    for prop in props_string.split(','):
        name, type_ = prop.split(':')
        props.append({'name': name.strip(), 'type': type_.strip()})
    return props

def generate_component(name, props, features, output_dir):
    """Generate component files"""
    component_dir = Path(output_dir) / name
    component_dir.mkdir(parents=True, exist_ok=True)

    # Load templates
    templates_dir = Path(__file__).parent.parent / 'assets'

    # Generate component file
    with open(templates_dir / 'component.tsx.template') as f:
        template = Template(f.read())

    # Build props interface
    props_interface = '\n  '.join([
        f"{prop['name']}: {prop['type']};"
        for prop in props
    ])

    component_content = template.substitute(
        COMPONENT_NAME=name,
        COMPONENT_DESCRIPTION=f"TODO: Add description",
        PROP_NAME=props[0]['name'] if props else 'children',
        PROP_TYPE=props[0]['type'] if props else 'React.ReactNode',
        PROP_DESCRIPTION=f"TODO: Describe {props[0]['name'] if props else 'children'}",
        EXAMPLE_PROPS=' '.join([f'{p["name"]}={{}}' for p in props[:2]]),
        COMPONENT_CONTENT='<div>TODO: Implement component</div>',
    )

    with open(component_dir / f'{name}.tsx', 'w') as f:
        f.write(component_content)

    print(f"✅ Generated {name}.tsx")

    # Generate styles, tests, stories (abbreviated for brevity)
    # Similar template substitution for each file type

    return component_dir

def main():
    parser = argparse.ArgumentParser(description='Generate React component')
    parser.add_argument('--name', required=True, help='Component name (PascalCase)')
    parser.add_argument('--props', default='', help='Props as name:type,name:type')
    parser.add_argument('--features', default='', help='Comma-separated features')
    parser.add_argument('--output', default='src/components', help='Output directory')

    args = parser.parse_args()
    props = parse_props(args.props)
    features = [f.strip() for f in args.features.split(',') if f.strip()]

    component_dir = generate_component(args.name, props, features, args.output)

    print(f"\n✨ Component generated at: {component_dir}")
    print(f"\nNext steps:")
    print(f"1. Implement component logic in {args.name}.tsx")
    print(f"2. Add styles in {args.name}.module.css")
    print(f"3. Run tests: npm test {args.name}")
    print(f"4. View in Storybook: npm run storybook")

if __name__ == '__main__':
    main()
```

**Why This Works:**
- Orchestrates multiple related file generation
- Script handles complex string manipulation
- Templates ensure consistency
- Validation catches common mistakes
- All conventions applied automatically

---

## Complex Skills (Full-Featured)

### 8. Deployment Workflow (Comprehensive)

**Use Case:** Orchestrate complete deployment with pre-checks, deployment, and monitoring.

**When to Use This Pattern:**
- Multi-step workflows with dependencies
- Critical operations requiring safety checks
- Combining scripts, templates, and documentation

**Directory Structure:**
```
deployment/
├── SKILL.md
├── scripts/
│   ├── pre-deploy-check.sh
│   ├── deploy.sh
│   └── rollback.sh
├── references/
│   ├── deployment-checklist.md
│   ├── rollback-procedures.md
│   └── monitoring.md
└── assets/
    ├── deploy-config.template.yml
    └── nginx.conf.template
```

**File:** `.claude/skills/deployment/SKILL.md`

```markdown
---
name: deployment
description: Deploy applications to production with pre-deployment validation, deployment execution, and post-deployment monitoring. Use when deploying to staging or production environments.
---

# Deployment Workflow

Safe, validated deployment to production environments.

## Pre-Deployment

Before deploying, run comprehensive checks:

```bash
bash scripts/pre-deploy-check.sh
```

Validates:
- All tests passing
- No uncommitted changes
- Environment variables set
- Database migrations ready
- Build succeeds
- No security vulnerabilities

**Do not proceed if checks fail.**

## Deployment Process

### 1. Build

```bash
npm run build:production
```

### 2. Run Deployment Script

```bash
bash scripts/deploy.sh <environment>
```

Environments: `staging`, `production`

Script performs:
- Final test run
- Production build
- Asset upload to CDN
- Database migrations (if any)
- Server deployment
- Cache invalidation
- Health check verification

### 3. Monitor

First 10 minutes post-deployment:

```bash
# Check application health
curl https://app.example.com/health

# Monitor error logs
tail -f /var/log/app/error.log

# Check metrics dashboard
# See references/monitoring.md
```

## Rollback

If issues detected:

```bash
bash scripts/rollback.sh
```

See `references/rollback-procedures.md` for manual rollback steps.

## Checklist

Pre-deployment:
- [ ] All tests passing
- [ ] Code reviewed and approved
- [ ] Changelog updated
- [ ] Database migrations tested
- [ ] Environment variables verified
- [ ] Rollback plan prepared

Post-deployment:
- [ ] Health check passes
- [ ] No error spikes
- [ ] Performance metrics normal
- [ ] Key user flows tested
- [ ] Team notified

See `references/deployment-checklist.md` for complete checklist.
```

**File:** `scripts/deploy.sh`

```bash
#!/bin/bash
# Production deployment script

set -e  # Exit on error

ENVIRONMENT="${1:-staging}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

echo "🚀 Deploying to: $ENVIRONMENT"
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Step 1: Pre-deployment checks
echo "📋 Running pre-deployment checks..."
if ! bash "$SCRIPT_DIR/pre-deploy-check.sh"; then
    echo -e "${RED}❌ Pre-deployment checks failed${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Pre-deployment checks passed${NC}"
echo ""

# Step 2: Build
echo "🔨 Building application..."
cd "$PROJECT_ROOT"
npm run build:production
echo -e "${GREEN}✅ Build complete${NC}"
echo ""

# Step 3: Run tests
echo "🧪 Running test suite..."
npm run test:ci
echo -e "${GREEN}✅ Tests passed${NC}"
echo ""

# Step 4: Database migrations
if [ -d "prisma/migrations" ]; then
    echo "🗄️  Running database migrations..."
    npx prisma migrate deploy
    echo -e "${GREEN}✅ Migrations complete${NC}"
    echo ""
fi

# Step 5: Upload assets to CDN
echo "☁️  Uploading assets to CDN..."
aws s3 sync ./dist/assets s3://my-app-assets --delete
echo -e "${GREEN}✅ Assets uploaded${NC}"
echo ""

# Step 6: Deploy to servers
echo "🖥️  Deploying to servers..."
if [ "$ENVIRONMENT" = "production" ]; then
    # Production deployment
    ssh deploy@prod-server1 "cd /var/www/app && git pull && pm2 reload app"
    ssh deploy@prod-server2 "cd /var/www/app && git pull && pm2 reload app"
else
    # Staging deployment
    ssh deploy@staging-server "cd /var/www/app && git pull && pm2 reload app"
fi
echo -e "${GREEN}✅ Deployed to servers${NC}"
echo ""

# Step 7: Invalidate CDN cache
echo "♻️  Invalidating CDN cache..."
aws cloudfront create-invalidation \
    --distribution-id E1234567890ABC \
    --paths "/*"
echo -e "${GREEN}✅ Cache invalidated${NC}"
echo ""

# Step 8: Health check
echo "🏥 Running health check..."
sleep 5  # Wait for servers to start
HEALTH_URL="https://app.example.com/api/health"
if curl -f -s "$HEALTH_URL" > /dev/null; then
    echo -e "${GREEN}✅ Health check passed${NC}"
else
    echo -e "${RED}❌ Health check failed${NC}"
    echo -e "${YELLOW}⚠️  Consider rolling back${NC}"
    exit 1
fi
echo ""

echo "=========================================="
echo -e "${GREEN}🎉 Deployment complete!${NC}"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. Monitor error logs for 10 minutes"
echo "2. Test key user flows"
echo "3. Check metrics dashboard"
echo "4. Notify team in Slack"
echo ""
echo "If issues occur, rollback with:"
echo "  bash scripts/rollback.sh"
```

**File:** `scripts/rollback.sh`

```bash
#!/bin/bash
# Rollback to previous deployment

set -e

ENVIRONMENT="${1:-staging}"

echo "⏪ Rolling back $ENVIRONMENT to previous version..."

# Get previous git commit
PREVIOUS_COMMIT=$(git rev-parse HEAD~1)

echo "Previous commit: $PREVIOUS_COMMIT"
echo ""

read -p "Confirm rollback? (yes/no): " CONFIRM
if [ "$CONFIRM" != "yes" ]; then
    echo "Rollback cancelled"
    exit 0
fi

# Rollback steps
echo "1. Reverting git commit..."
git revert HEAD --no-edit

echo "2. Rebuilding..."
npm run build:production

echo "3. Deploying previous version..."
bash "$(dirname "${BASH_SOURCE[0]}")/deploy.sh" "$ENVIRONMENT"

echo "✅ Rollback complete"
```

**File:** `references/deployment-checklist.md`

```markdown
# Deployment Checklist

## Pre-Deployment

### Code Quality
- [ ] All tests passing (unit, integration, e2e)
- [ ] Code reviewed and approved by 2+ engineers
- [ ] No lint errors or warnings
- [ ] Type checking passes (TypeScript)
- [ ] Security scan clean (no vulnerabilities)

### Documentation
- [ ] CHANGELOG.md updated
- [ ] API documentation current
- [ ] Migration guide written (if breaking changes)
- [ ] Deployment notes prepared

### Infrastructure
- [ ] Environment variables set in production
- [ ] Secrets rotated if needed
- [ ] Database backups recent (< 24 hours)
- [ ] Sufficient server resources
- [ ] CDN configuration verified

### Database
- [ ] Migrations tested in staging
- [ ] Migrations are reversible
- [ ] Data backup completed
- [ ] Index performance validated

### Communication
- [ ] Team notified of deployment window
- [ ] Stakeholders informed
- [ ] Rollback plan communicated
- [ ] On-call engineer identified

## During Deployment

- [ ] Pre-deployment checks pass
- [ ] Build succeeds
- [ ] Tests pass
- [ ] Assets uploaded to CDN
- [ ] Database migrations run
- [ ] Servers deploy successfully
- [ ] Health checks pass

## Post-Deployment

### Immediate (0-10 minutes)
- [ ] Application loads
- [ ] Health endpoint responds
- [ ] No error spikes in logs
- [ ] Response times normal
- [ ] Key user flows work

### Short-term (10-60 minutes)
- [ ] Error rates stable
- [ ] Performance metrics normal
- [ ] Database queries performing well
- [ ] CDN cache hit rate good
- [ ] No user complaints

### Follow-up
- [ ] Team notified of completion
- [ ] Deployment documented
- [ ] Lessons learned captured
- [ ] Rollback plan updated
```

**Why This Works:**
- Comprehensive safety checks
- Automated where possible, manual where needed
- Clear rollback procedures
- Documentation for edge cases
- Combines scripts (automation) with checklists (verification)

---

### 9. Security Audit Skill (Review/Analysis)

**Use Case:** Comprehensive security audit with automated checks and manual review guidance.

**When to Use This Pattern:**
- Systematic review processes
- Combining automated tools with human judgment
- Security-critical operations
- Audit trail requirements

**Directory Structure:**
```
security-audit/
├── SKILL.md
├── scripts/
│   ├── scan-dependencies.sh
│   ├── check-secrets.py
│   └── analyze-permissions.sh
└── references/
    ├── owasp-top-10.md
    ├── common-vulnerabilities.md
    └── remediation-guide.md
```

**File:** `.claude/skills/security-audit/SKILL.md`

```markdown
---
name: security-audit
description: Perform comprehensive security audit covering dependencies, secrets, authentication, authorization, and OWASP Top 10 vulnerabilities. Use when reviewing code for security issues.
---

# Security Audit

Systematic security review following industry best practices.

## Audit Process

### 1. Automated Scans

Run all automated security checks:

```bash
# Scan dependencies for vulnerabilities
bash scripts/scan-dependencies.sh

# Check for exposed secrets
python scripts/check-secrets.py .

# Analyze file permissions
bash scripts/analyze-permissions.sh
```

### 2. Manual Review

#### Authentication & Authorization
- Session management secure?
- Password hashing using bcrypt/argon2?
- JWT tokens properly validated?
- OAuth flows implemented correctly?
- Role-based access control (RBAC) enforced?

#### Input Validation
- All user input validated?
- SQL injection prevention (parameterized queries)?
- XSS prevention (output encoding)?
- Command injection prevention?
- Path traversal prevention?

#### Data Protection
- Sensitive data encrypted at rest?
- TLS/HTTPS enforced?
- Secrets in environment variables (not code)?
- PII handling compliant with regulations?
- Database credentials secured?

#### API Security
- Rate limiting implemented?
- CORS configured correctly?
- CSRF tokens on state-changing operations?
- API keys rotated regularly?
- Input size limits enforced?

See `references/owasp-top-10.md` for detailed vulnerability checks.

## Severity Classification

**Critical** - Immediate fix required:
- SQL injection vulnerabilities
- Authentication bypass
- Sensitive data exposure
- Remote code execution

**High** - Fix before next release:
- XSS vulnerabilities
- Insecure deserialization
- Security misconfiguration
- Broken access control

**Medium** - Fix in near term:
- Insufficient logging
- Weak cryptography
- Components with known vulnerabilities

**Low** - Consider for future:
- Security headers missing
- Information disclosure
- Verbose error messages

## Output Format

Present findings as:

```
[SEVERITY] Category: Issue Description
File: path/to/file.js:42
Details: Explanation of vulnerability
Impact: What attacker could do
Recommendation: How to fix

Example:
[CRITICAL] SQL Injection: User input directly in query
File: src/api/users.js:45
Details: User ID from URL params used directly in SQL query
Impact: Attacker could read entire database or delete data
Recommendation: Use parameterized query: db.query('SELECT * FROM users WHERE id = ?', [userId])
```

## References

- `references/owasp-top-10.md` - OWASP Top 10 vulnerabilities
- `references/common-vulnerabilities.md` - Common security issues
- `references/remediation-guide.md` - How to fix vulnerabilities
```

**File:** `scripts/check-secrets.py`

```python
#!/usr/bin/env python3
"""
Check for exposed secrets in codebase
Detects API keys, tokens, passwords in code
"""
import re
import sys
from pathlib import Path
from typing import List, Dict

# Patterns for common secrets
SECRET_PATTERNS = {
    'AWS Key': r'AKIA[0-9A-Z]{16}',
    'Private Key': r'-----BEGIN (RSA|EC|OPENSSH) PRIVATE KEY-----',
    'GitHub Token': r'ghp_[0-9a-zA-Z]{36}',
    'Generic API Key': r'api[_-]?key["\']?\s*[:=]\s*["\'][0-9a-zA-Z]{20,}["\']',
    'Password in Code': r'password["\']?\s*[:=]\s*["\'][^"\']{8,}["\']',
    'JWT Token': r'eyJ[a-zA-Z0-9_-]*\.eyJ[a-zA-Z0-9_-]*\.[a-zA-Z0-9_-]*',
}

def scan_file(filepath: Path) -> List[Dict]:
    """Scan file for potential secrets"""
    findings = []

    try:
        with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()

        for secret_type, pattern in SECRET_PATTERNS.items():
            matches = re.finditer(pattern, content, re.IGNORECASE)
            for match in matches:
                # Get line number
                line_num = content[:match.start()].count('\n') + 1

                findings.append({
                    'file': str(filepath),
                    'line': line_num,
                    'type': secret_type,
                    'match': match.group(0)[:50] + '...',  # Truncate
                })
    except Exception as e:
        print(f"Error scanning {filepath}: {e}", file=sys.stderr)

    return findings

def scan_directory(root_dir: str, exclude_dirs=None) -> List[Dict]:
    """Scan directory recursively for secrets"""
    if exclude_dirs is None:
        exclude_dirs = {'.git', 'node_modules', '.venv', 'dist', 'build'}

    findings = []
    root = Path(root_dir)

    for filepath in root.rglob('*'):
        # Skip directories and excluded paths
        if filepath.is_dir():
            continue
        if any(excluded in filepath.parts for excluded in exclude_dirs):
            continue

        # Only scan text files
        if filepath.suffix in {'.py', '.js', '.ts', '.jsx', '.tsx', '.json',
                              '.yaml', '.yml', '.env', '.txt', '.md'}:
            findings.extend(scan_file(filepath))

    return findings

def main():
    if len(sys.argv) < 2:
        print("Usage: check-secrets.py <directory>", file=sys.stderr)
        sys.exit(1)

    directory = sys.argv[1]
    findings = scan_directory(directory)

    if findings:
        print(f"🔴 Found {len(findings)} potential secrets:\n")
        for finding in findings:
            print(f"{finding['type']}")
            print(f"  File: {finding['file']}:{finding['line']}")
            print(f"  Match: {finding['match']}")
            print()
        sys.exit(1)
    else:
        print("✅ No secrets detected")
        sys.exit(0)

if __name__ == '__main__':
    main()
```

**Why This Works:**
- Combines automated scanning with manual review
- Systematic coverage of security domains
- Clear severity classification
- Actionable remediation guidance
- Scripts catch obvious issues, human reviews nuanced risks

---

### 10. Full-Stack Feature Generator (Maximum Complexity)

**Use Case:** Generate complete feature across frontend, backend, database, and tests.

**When to Use This Pattern:**
- End-to-end feature implementation
- Multiple technologies involved
- Architectural consistency critical
- Large-scale code generation

**Directory Structure:**
```
feature-generator/
├── SKILL.md
├── scripts/
│   ├── generate-feature.py
│   ├── generate-frontend.py
│   ├── generate-backend.py
│   └── generate-tests.py
├── assets/
│   ├── frontend/
│   │   ├── component.tsx.template
│   │   ├── hook.ts.template
│   │   └── page.tsx.template
│   ├── backend/
│   │   ├── controller.ts.template
│   │   ├── service.ts.template
│   │   └── repository.ts.template
│   ├── database/
│   │   └── migration.sql.template
│   └── tests/
│       ├── unit.spec.ts.template
│       ├── integration.spec.ts.template
│       └── e2e.spec.ts.template
└── references/
    ├── architecture.md
    ├── conventions.md
    └── examples.md
```

**File:** `.claude/skills/feature-generator/SKILL.md`

```markdown
---
name: feature-generator
description: Generates complete full-stack features including frontend components, backend API, database schema, and comprehensive tests. Use when implementing new user-facing features.
---

# Full-Stack Feature Generator

Generate complete features across all layers of the stack.

## What This Generates

For a feature like "User Profile Management":

**Frontend (React + TypeScript):**
- Page component
- UI components
- Custom hooks
- Type definitions
- Styles

**Backend (Node.js + TypeScript):**
- API endpoints (controllers)
- Business logic (services)
- Data access (repositories)
- Validation schemas
- Error handling

**Database:**
- Schema migration
- Seed data
- Indexes

**Tests:**
- Unit tests (frontend & backend)
- Integration tests (API)
- E2E tests (user flows)

## Usage

```bash
python scripts/generate-feature.py \
  --name user-profile \
  --description "User profile management" \
  --entities User,Profile,Settings \
  --routes "GET /profile, PUT /profile, DELETE /profile"
```

## Process

### 1. Requirements Gathering

Ask user for:
- Feature name (kebab-case)
- Description
- Entities involved
- Required CRUD operations
- Special requirements (auth, permissions, validation)

### 2. Architecture Planning

Based on requirements, plan:
- Database schema changes
- API endpoints needed
- Frontend pages/components
- State management approach

See `references/architecture.md` for patterns.

### 3. Generation

Run generator script which:
1. Creates database migration
2. Generates backend layer (repository → service → controller)
3. Generates frontend layer (hooks → components → pages)
4. Creates test files
5. Updates routing configuration

### 4. Validation

Generator validates:
- TypeScript compilation
- No circular dependencies
- Naming conventions followed
- All imports resolve

### 5. Instructions

Present generated code with:
- File locations
- What each file does
- Next steps (implement business logic, add validations)
- How to run tests

## Generated Structure

```
feature/user-profile/
├── backend/
│   ├── migrations/
│   │   └── 001_create_profile_table.sql
│   ├── src/
│   │   ├── repositories/
│   │   │   └── ProfileRepository.ts
│   │   ├── services/
│   │   │   └── ProfileService.ts
│   │   └── controllers/
│   │       └── ProfileController.ts
│   └── tests/
│       ├── unit/
│       │   └── ProfileService.spec.ts
│       └── integration/
│           └── profile-api.spec.ts
└── frontend/
    ├── src/
    │   ├── pages/
    │   │   └── ProfilePage.tsx
    │   ├── components/
    │   │   ├── ProfileForm.tsx
    │   │   └── ProfileDisplay.tsx
    │   ├── hooks/
    │   │   └── useProfile.ts
    │   └── types/
    │       └── profile.ts
    └── tests/
        ├── unit/
        │   └── ProfileForm.spec.tsx
        └── e2e/
            └── profile-flow.spec.ts
```

## Customization

After generation:
1. Implement business logic in services
2. Add validation rules
3. Customize UI components
4. Add additional test cases
5. Update documentation

See `references/examples.md` for complete examples.

## Conventions

All generated code follows:
- TypeScript strict mode
- ESLint configuration
- Naming conventions (see `references/conventions.md`)
- Error handling patterns
- Logging standards
```

**File:** `scripts/generate-feature.py` (simplified)

```python
#!/usr/bin/env python3
"""
Full-stack feature generator
Generates frontend, backend, database, and tests
"""
import argparse
import subprocess
from pathlib import Path

def generate_feature(name, description, entities, routes):
    """Main generation orchestrator"""
    print(f"🚀 Generating feature: {name}")
    print(f"Description: {description}")
    print()

    # 1. Generate database migration
    print("📦 Generating database migration...")
    generate_migration(name, entities)

    # 2. Generate backend
    print("⚙️  Generating backend layer...")
    generate_backend(name, entities, routes)

    # 3. Generate frontend
    print("🎨 Generating frontend layer...")
    generate_frontend(name, entities)

    # 4. Generate tests
    print("🧪 Generating tests...")
    generate_tests(name, entities)

    # 5. Summary
    print()
    print("=" * 50)
    print("✨ Feature generation complete!")
    print("=" * 50)
    print()
    print("Generated files:")
    print_file_tree(name)
    print()
    print("Next steps:")
    print("1. Review generated code")
    print("2. Implement business logic in services")
    print("3. Run tests: npm test")
    print("4. Start development server: npm run dev")

def generate_migration(name, entities):
    """Generate database migration"""
    # Implementation details...
    pass

def generate_backend(name, entities, routes):
    """Generate backend layer"""
    subprocess.run([
        'python', 'scripts/generate-backend.py',
        '--name', name,
        '--entities', ','.join(entities),
        '--routes', routes
    ])

def generate_frontend(name, entities):
    """Generate frontend layer"""
    subprocess.run([
        'python', 'scripts/generate-frontend.py',
        '--name', name,
        '--entities', ','.join(entities)
    ])

def generate_tests(name, entities):
    """Generate test files"""
    subprocess.run([
        'python', 'scripts/generate-tests.py',
        '--name', name,
        '--entities', ','.join(entities)
    ])

def print_file_tree(name):
    """Print generated file tree"""
    # Implementation details...
    pass

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Generate full-stack feature')
    parser.add_argument('--name', required=True, help='Feature name (kebab-case)')
    parser.add_argument('--description', required=True, help='Feature description')
    parser.add_argument('--entities', required=True, help='Comma-separated entities')
    parser.add_argument('--routes', required=True, help='API routes')

    args = parser.parse_args()
    entities = [e.strip() for e in args.entities.split(',')]

    generate_feature(args.name, args.description, entities, args.routes)
```

**Why This Works:**
- Comprehensive end-to-end generation
- Maintains architectural consistency
- Reduces boilerplate significantly
- Enforces best practices automatically
- Scripts handle complex orchestration
- Templates ensure quality baseline

---

## Summary Table

| # | Skill | Complexity | Pattern | Use Case |
|---|-------|------------|---------|----------|
| 1 | Code Review | Simple | Instructions | Systematic review guidance |
| 2 | Commit Formatter | Simple | Instructions | Convention enforcement |
| 3 | API Generator | Standard | Templates | Consistent endpoint creation |
| 4 | License Header | Standard | Assets | Static content distribution |
| 5 | JSON to Pydantic | Standard | Examples | Transformation patterns |
| 6 | Schema Validator | Advanced | Scripts | Deterministic validation |
| 7 | React Generator | Advanced | Scripts + Templates | Multi-file generation |
| 8 | Deployment | Complex | Scripts + Docs | Critical workflows |
| 9 | Security Audit | Complex | Scripts + Manual | Comprehensive review |
| 10 | Feature Generator | Complex | Full Orchestration | End-to-end features |

---

## Choosing the Right Pattern

**Use Simple (Instructions Only) when:**
- Guidance is straightforward
- No templates or scripts needed
- Pure decision-making or review

**Use Standard (With Supporting Files) when:**
- Templates reduce repetition
- Examples clarify patterns
- Static assets needed

**Use Advanced (Script-Based) when:**
- Deterministic validation required
- Complex transformations needed
- Automated checking beneficial

**Use Complex (Full-Featured) when:**
- Multi-step orchestration required
- Critical operations need safety checks
- End-to-end generation valuable

---

**Last Updated:** February 2026
**Category:** Skills Development
**Completeness:** 10 production-ready examples with full code
