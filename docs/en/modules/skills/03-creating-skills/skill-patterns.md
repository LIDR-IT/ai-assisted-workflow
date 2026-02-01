# Skill Patterns: Five Progressive Design Approaches

## Overview

Skills in Antigravity can be structured using five progressive design patterns, each suited for different complexity levels and use cases. This guide provides complete examples and decision guidance for choosing the right pattern.

**Key Principle:** Start simple and add complexity only when needed. Most skills can be solved with patterns 1-3.

## Pattern Progression

```
1. Basic Router          → Pure instructions
2. Asset Utilization     → Instructions + static files
3. Few-Shot Learning     → Instructions + examples
4. Procedural Logic      → Instructions + scripts
5. Complex Orchestration → Full workflow with all elements
```

---

## Pattern 1: Basic Router (Instruction-Only)

### When to Use

Use the Basic Router pattern when:
- **Pure guidance is sufficient** - No external assets needed
- **Behavior is rule-based** - Clear, explicit instructions work
- **No deterministic logic** - No need for validation scripts
- **No heavy templates** - No large boilerplate to reference

**Examples:**
- Commit message formatting
- Code style enforcement
- Naming convention guidance
- Documentation structure rules

### Structure

```
skill-name/
└── SKILL.md              # Instructions only
```

### Benefits

- **Minimal overhead** - Fastest to create and maintain
- **Self-contained** - Everything in one file
- **Easy to understand** - Clear, linear instructions
- **No dependencies** - No scripts or external files

### Limitations

- **Token consumption** - Large templates inline increase tokens
- **No reusability** - Cannot share assets across skills
- **No deterministic checks** - Relies on LLM interpretation

### Complete Example: Git Commit Formatter

**Directory:** `git-commit-formatter/`

**File:** `SKILL.md`

```markdown
---
name: git-commit-formatter
description: Enforces Conventional Commits specification for git commit messages, ensuring consistent format with type, scope, and description
---

# Git Commit Formatter

## Goal

Ensure all commit messages follow Conventional Commits specification for consistent project history and automated changelog generation.

## Format

```
type(scope): description

[optional body]

[optional footer]
```

## Valid Types

- **feat:** New feature for the user
- **fix:** Bug fix for the user
- **docs:** Documentation changes only
- **style:** Formatting, missing semicolons, etc. (no code change)
- **refactor:** Code restructure without behavior change
- **test:** Adding or updating tests
- **chore:** Maintenance tasks, dependencies, config

## Rules

### Header (First Line)
- Type MUST be lowercase
- Scope is optional but recommended (e.g., `api`, `auth`, `ui`)
- Description MUST be lowercase
- Description MUST NOT end with a period
- First line MUST be 72 characters or less
- Use imperative mood ("add" not "added" or "adds")

### Body (Optional)
- Separated from header by blank line
- Explain WHAT changed and WHY
- Wrap at 72 characters
- Can include multiple paragraphs

### Footer (Optional)
- Separated from body by blank line
- Reference issues: `Refs: #123`
- Breaking changes: `BREAKING CHANGE: description`
- Co-authors: `Co-authored-by: Name <email>`

## Examples

### Simple Feature
```
feat(auth): add OAuth2 login support
```

### Bug Fix with Body
```
fix(api): resolve race condition in user update

The previous implementation had a race condition when multiple
requests updated the same user simultaneously. Added database
transaction isolation to prevent concurrent modifications.

Refs: #456
```

### Breaking Change
```
feat(api): migrate to REST from GraphQL

Complete API rewrite from GraphQL to REST for better caching
and simpler client integration.

BREAKING CHANGE: All GraphQL endpoints removed. Clients must
migrate to new REST endpoints documented in /docs/api.md

Refs: #789
```

### Documentation Update
```
docs(readme): update installation instructions
```

## Validation Checklist

When reviewing a commit message, verify:

- [ ] Type is one of the valid types
- [ ] Type is lowercase
- [ ] Scope (if present) is in parentheses
- [ ] Description is lowercase
- [ ] Description uses imperative mood
- [ ] Description does not end with period
- [ ] First line is 72 characters or less
- [ ] Body (if present) separated by blank line
- [ ] Footer (if present) separated by blank line

## Common Mistakes

**❌ Wrong:**
```
Added new feature        # Past tense, no type
Fix: bug in login       # Capitalized description
feat: Added OAuth.      # Past tense, period at end
feature(auth): update   # Wrong type name
```

**✅ Correct:**
```
feat: add new feature
fix: resolve bug in login
feat(auth): add OAuth support
feat(auth): update authentication flow
```

## Constraints

- Never use past tense ("added" → "add", "fixed" → "fix")
- Never capitalize description
- Never add trailing period to description
- Never exceed 72 characters in first line
- Never skip blank line between header and body
```

### Usage in Context

When a user says:
- "Create a commit message for these changes"
- "Format this commit message"
- "Is this commit message correct?"

The agent loads this skill and applies the formatting rules using only the instructions provided.

---

## Pattern 2: Asset Utilization (Template-Based)

### When to Use

Use Asset Utilization when:
- **Large static content needed** - Templates, licenses, boilerplate
- **Prevent token waste** - Reference files instead of inlining
- **Reusable assets** - Same content used in multiple contexts
- **Multiple variations** - Different templates for different cases

**Examples:**
- License header addition
- Code templates
- Configuration file generators
- Boilerplate scaffolding

### Structure

```
skill-name/
├── SKILL.md              # Instructions referencing assets
└── resources/            # Static files
    ├── template-1.txt
    ├── template-2.json
    └── config.yaml
```

### Benefits

- **Token efficiency** - Large content stored in files
- **Easy updates** - Change templates without touching instructions
- **Multiple variants** - Support different template types
- **Reusability** - Share assets across similar tasks

### Limitations

- **File management** - More files to maintain
- **Path dependencies** - Requires correct relative paths
- **No dynamic generation** - Static content only

### Complete Example: License Header Adder

**Directory:** `license-header-adder/`

**File:** `SKILL.md`

```markdown
---
name: license-header-adder
description: Adds appropriate license headers to source code files based on project license type, preventing legal issues and ensuring compliance
---

# License Header Adder

## Goal

Add legally correct license headers to source code files while preserving existing code and respecting language-specific comment syntax.

## Process

### 1. Identify License Type

Check project for license:
```bash
# Look for LICENSE file
cat LICENSE

# Check package.json
jq '.license' package.json

# Check pyproject.toml
grep "license" pyproject.toml
```

### 2. Select Template

Based on detected license:
- **MIT:** `resources/mit-header.txt`
- **Apache 2.0:** `resources/apache-header.txt`
- **GPL 3.0:** `resources/gpl-header.txt`
- **Proprietary:** `resources/proprietary-header.txt`

### 3. Read Template

Load appropriate template from resources directory.

### 4. Detect Language

Determine programming language from file extension:
- `.py` → Python
- `.js`, `.ts`, `.jsx`, `.tsx` → JavaScript/TypeScript
- `.java` → Java
- `.cpp`, `.c`, `.h` → C/C++
- `.sh`, `.bash` → Shell
- `.rb` → Ruby
- `.go` → Go

### 5. Format Header

Apply language-specific comment syntax:

**Python, Shell, Ruby:**
```python
# Copyright (c) 2026 Your Company
#
# [License text here...]
```

**JavaScript, TypeScript, Java, C/C++:**
```javascript
/*
 * Copyright (c) 2026 Your Company
 *
 * [License text here...]
 */
```

**Go:**
```go
// Copyright (c) 2026 Your Company
//
// [License text here...]
```

### 6. Insert Header

Rules for insertion:
- **Shebang present:** Insert AFTER shebang line
- **Existing header:** Skip file (do not modify)
- **Generated file:** Skip (check for "Auto-generated" comment)
- **Normal file:** Insert at top

### 7. Preserve Existing Content

- Do NOT modify existing code
- Do NOT remove existing headers
- Maintain original file encoding
- Preserve line endings (LF vs CRLF)

## Comment Syntax Reference

| Language | Syntax | Example |
|----------|--------|---------|
| Python | `#` prefix | `# Copyright...` |
| JavaScript | `/* */` block | `/* Copyright... */` |
| TypeScript | `/* */` block | `/* Copyright... */` |
| Java | `/* */` block | `/* Copyright... */` |
| C/C++ | `/* */` block | `/* Copyright... */` |
| Shell | `#` prefix | `# Copyright...` |
| Ruby | `#` prefix | `# Copyright...` |
| Go | `//` prefix | `// Copyright...` |

## Template Variables

Templates support variable substitution:

- `{YEAR}` → Current year
- `{COPYRIGHT_HOLDER}` → Company/author name
- `{PROJECT_NAME}` → Project name

Ask user for values if not found in:
- `package.json` (name, author)
- `pyproject.toml` (name, authors)
- `LICENSE` file (copyright holder)
- `.git/config` (user name)

## Examples

### Python File (MIT)

**Before:**
```python
def hello():
    print("Hello, world!")
```

**After:**
```python
# Copyright (c) 2026 Acme Corporation
#
# Permission is hereby granted, free of charge, to any person obtaining a copy
# of this software and associated documentation files (the "Software"), to deal
# in the Software without restriction...

def hello():
    print("Hello, world!")
```

### JavaScript File with Shebang (Apache)

**Before:**
```javascript
#!/usr/bin/env node
console.log("Hello");
```

**After:**
```javascript
#!/usr/bin/env node
/*
 * Copyright (c) 2026 Acme Corporation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License...
 */
console.log("Hello");
```

## Constraints

- **Never modify existing license headers**
- **Never remove shebang lines**
- **Never add headers to:**
  - Generated files (check for auto-generated comments)
  - Binary files
  - Files in `.gitignore`
  - `node_modules/`, `dist/`, `build/` directories
- **Always preserve:**
  - File encoding
  - Line endings
  - Existing code
  - File permissions

## Validation

After adding header, verify:
- [ ] Header is at top (or after shebang)
- [ ] Correct comment syntax for language
- [ ] Variables replaced with actual values
- [ ] Existing code unchanged
- [ ] File still executes (if executable)
```

**File:** `resources/mit-header.txt`

```
Copyright (c) {YEAR} {COPYRIGHT_HOLDER}

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
Copyright (c) {YEAR} {COPYRIGHT_HOLDER}

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

**File:** `resources/proprietary-header.txt`

```
Copyright (c) {YEAR} {COPYRIGHT_HOLDER}. All rights reserved.

PROPRIETARY AND CONFIDENTIAL

This software is the confidential and proprietary information of
{COPYRIGHT_HOLDER}. You shall not disclose such confidential information
and shall use it only in accordance with the terms of the license agreement
you entered into with {COPYRIGHT_HOLDER}.
```

### Usage in Context

Agent references `resources/mit-header.txt` instead of including full text inline, saving tokens while maintaining full license text accuracy.

---

## Pattern 3: Few-Shot Learning (Example-Based)

### When to Use

Use Few-Shot Learning when:
- **Transformation is easier to show than describe** - Visual patterns
- **Multiple valid approaches** - Examples demonstrate preferred style
- **Complex output format** - Structure is clearer with examples
- **Edge cases matter** - Examples cover important variations

**Examples:**
- Schema conversions (JSON to Pydantic, OpenAPI to TypeScript)
- Code generation (SQL to ORM, REST to GraphQL)
- Format transformations (Markdown to HTML, YAML to JSON)
- Style application (code refactoring, API design)

### Structure

```
skill-name/
├── SKILL.md              # Instructions + reference to examples
└── examples/             # Input/output pairs
    ├── input-1.json
    ├── output-1.py
    ├── input-2.json
    └── output-2.py
```

### Benefits

- **Show, don't tell** - Examples clearer than descriptions
- **Cover edge cases** - Demonstrate handling of special situations
- **Consistent style** - LLM learns preferred patterns
- **Reduced ambiguity** - Less room for interpretation

### Limitations

- **Example maintenance** - Must keep examples current
- **Token usage** - Loading examples increases context
- **Coverage gaps** - May not cover all possible cases

### Complete Example: JSON to Pydantic

**Directory:** `json-to-pydantic/`

**File:** `SKILL.md`

```markdown
---
name: json-to-pydantic
description: Converts JSON schemas or sample JSON data into Pydantic model classes for Python data validation with proper type hints and field validators
---

# JSON to Pydantic Converter

## Goal

Generate production-ready Pydantic model classes from JSON schemas or sample JSON data, including proper type hints, field validation, and documentation.

## Process

### 1. Analyze Input

Determine input type:
- **JSON Schema:** Formal schema with types and constraints
- **Sample JSON:** Example data to infer types from

### 2. Infer Python Types

Map JSON types to Python types:

| JSON Type | Python Type | Pydantic Field |
|-----------|-------------|----------------|
| `string` | `str` | `str` |
| `number` | `float` | `float` |
| `integer` | `int` | `int` |
| `boolean` | `bool` | `bool` |
| `null` | `None` | `Optional[T]` |
| `array` | `list` | `List[T]` |
| `object` | nested class | Nested model |

### 3. Handle Special Cases

**Email strings:**
```python
from pydantic import EmailStr
email: EmailStr
```

**URLs:**
```python
from pydantic import HttpUrl
url: HttpUrl
```

**Dates/Times:**
```python
from datetime import datetime
created_at: datetime
```

**UUIDs:**
```python
from uuid import UUID
id: UUID
```

### 4. Add Validation

Use `Field()` for constraints:

```python
from pydantic import Field

age: int = Field(..., ge=0, le=150)
username: str = Field(..., min_length=3, max_length=50)
score: float = Field(..., gt=0.0, le=100.0)
tags: List[str] = Field(default_factory=list)
```

### 5. Generate Docstrings

Add class and field documentation:

```python
class User(BaseModel):
    """User account model from JSON schema"""

    name: str = Field(..., description="User's full name")
    age: int = Field(..., description="User's age in years")
```

### 6. Handle Nesting

Create nested models for objects:

```python
class Address(BaseModel):
    """Address model"""
    street: str
    city: str

class User(BaseModel):
    """User model"""
    name: str
    address: Address  # Nested model
```

## Type Inference Rules

### From JSON Schema

```json
{
  "type": "object",
  "properties": {
    "name": {"type": "string"},
    "age": {"type": "integer", "minimum": 0}
  },
  "required": ["name"]
}
```

Becomes:

```python
class Model(BaseModel):
    name: str
    age: Optional[int] = Field(None, ge=0)
```

### From Sample Data

```json
{
  "name": "John",
  "age": 30,
  "email": "john@example.com"
}
```

Infer:
- `"John"` → `str`
- `30` → `int`
- `"john@example.com"` → `EmailStr` (if valid email format)

## Examples Directory

The `examples/` directory contains input/output pairs demonstrating:
1. Simple flat objects
2. Nested objects
3. Arrays and lists
4. Optional fields
5. Complex validation

Study these examples to understand the expected transformation patterns.

## Imports Template

Always include necessary imports:

```python
from pydantic import BaseModel, Field, EmailStr, HttpUrl
from typing import List, Optional, Dict, Any
from datetime import datetime
from uuid import UUID
```

## Validation Best Practices

- **Required fields:** Use `...` as default
- **Optional fields:** Use `Optional[T]` with `None` default
- **Lists:** Use `default_factory=list` not `[]`
- **Numeric constraints:** Use `ge`, `gt`, `le`, `lt` in Field()
- **String length:** Use `min_length`, `max_length` in Field()
- **Regex patterns:** Use `regex` in Field()

## Constraints

- Use Pydantic V2 syntax (if project uses V2)
- Follow project's import style (absolute vs relative)
- Match existing model structure if extending
- Include type hints for all fields
- Add docstrings for classes and complex fields
- Use `Field()` for validation, not custom validators (unless complex logic)
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
    age: int = Field(..., ge=0, le=150, description="User's age in years")
    email: EmailStr = Field(..., description="User's email address")
    tags: List[str] = Field(default_factory=list, description="User tags")
```

**File:** `examples/input-2.json`

```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "title": "Sample Post",
  "content": "This is a blog post",
  "published": true,
  "created_at": "2026-01-15T10:30:00Z",
  "author": {
    "name": "Jane Smith",
    "email": "jane@example.com"
  },
  "comments": [
    {
      "author": "Bob",
      "text": "Great post!"
    }
  ],
  "metadata": {
    "views": 1500,
    "likes": 42
  }
}
```

**File:** `examples/output-2.py`

```python
from pydantic import BaseModel, Field, EmailStr
from typing import List, Dict, Any, Optional
from datetime import datetime
from uuid import UUID

class Author(BaseModel):
    """Author information"""

    name: str = Field(..., description="Author's name")
    email: EmailStr = Field(..., description="Author's email")

class Comment(BaseModel):
    """Comment on a post"""

    author: str = Field(..., description="Comment author name")
    text: str = Field(..., min_length=1, description="Comment text")

class BlogPost(BaseModel):
    """Blog post model from JSON schema"""

    id: UUID = Field(..., description="Unique post identifier")
    title: str = Field(..., min_length=1, max_length=200, description="Post title")
    content: str = Field(..., description="Post content")
    published: bool = Field(default=False, description="Publication status")
    created_at: datetime = Field(..., description="Creation timestamp")
    author: Author = Field(..., description="Post author")
    comments: List[Comment] = Field(default_factory=list, description="Post comments")
    metadata: Dict[str, Any] = Field(default_factory=dict, description="Additional metadata")
```

### Usage in Context

Agent studies the examples to understand:
- How to handle nested objects (Author, Comment)
- How to use special types (UUID, datetime, EmailStr)
- How to apply validation (min_length, max_length, ge, le)
- How to structure docstrings
- How to handle collections (List, Dict)

---

## Pattern 4: Procedural Logic (Script-Based)

### When to Use

Use Procedural Logic when:
- **Deterministic validation needed** - Binary yes/no checks
- **Complex computation required** - Math, parsing, analysis
- **LLM judgment insufficient** - Objective criteria exist
- **Performance matters** - Script faster than LLM reasoning

**Examples:**
- Schema validation (database migrations, API specs)
- Code linting (custom rules)
- Security scanning (dependency checks)
- Performance analysis (benchmark parsing)

### Structure

```
skill-name/
├── SKILL.md              # Instructions + script usage
└── scripts/              # Executable scripts
    ├── validate.py
    ├── check.sh
    └── helpers.py
```

### Benefits

- **Deterministic** - Consistent, reliable results
- **Fast** - Faster than LLM processing
- **Precise** - Exact checks, no interpretation
- **Testable** - Scripts can have unit tests

### Limitations

- **Requires execution environment** - Python, Node, etc.
- **Maintenance overhead** - Scripts need updates
- **Security concerns** - Code execution risks
- **Platform dependencies** - May not work everywhere

### Complete Example: Database Schema Validator

**Directory:** `database-schema-validator/`

**File:** `SKILL.md`

```markdown
---
name: database-schema-validator
description: Validates database schema migrations for consistency, safety, and best practices before applying to production databases
---

# Database Schema Validator

## Goal

Ensure database migrations are safe, reversible, and follow best practices before production deployment.

## Process

### 1. User Provides Migration

User provides path to migration file:
```
Please validate this migration: migrations/001_add_users_table.sql
```

### 2. Run Validation Script

Execute validation script:
```bash
python scripts/validate.py migrations/001_add_users_table.sql
```

### 3. Parse Script Output

Script returns JSON with validation results:
```json
{
  "valid": true,
  "errors": [],
  "warnings": ["Missing index on foreign key: user_id"],
  "suggestions": ["Add index on posts.user_id for performance"]
}
```

### 4. Report Results

Present results to user:
- **Errors:** Must be fixed before deployment
- **Warnings:** Should be addressed
- **Suggestions:** Optional improvements

### 5. Provide Fixes

For each error/warning, suggest specific fix with example.

## Validation Checks

The validation script (`scripts/validate.py`) checks:

### Safety Checks (Errors)
- ❌ `DROP TABLE` without safety comment
- ❌ `DROP COLUMN` without safety comment
- ❌ `ALTER COLUMN` changing type without migration path
- ❌ Missing `NOT NULL` default for new columns
- ❌ No transaction wrapper for data migrations

### Best Practice Checks (Warnings)
- ⚠️ Missing indexes on foreign keys
- ⚠️ Missing `created_at`/`updated_at` timestamps
- ⚠️ No `ON DELETE` behavior specified
- ⚠️ No `ON UPDATE` behavior specified
- ⚠️ Long table/column names (>63 chars for PostgreSQL)

### Reversibility Checks (Warnings)
- ⚠️ No corresponding down migration
- ⚠️ Destructive operations without backup plan

## Script Usage

### Basic Validation

```bash
python scripts/validate.py <migration-file>
```

### Exit Codes

- `0` - Valid migration (no errors)
- `1` - Invalid migration (errors found)
- `2` - Warnings only (valid but not ideal)

### Output Format

Script outputs JSON to stdout:
```json
{
  "valid": boolean,
  "errors": ["error message", ...],
  "warnings": ["warning message", ...],
  "suggestions": ["suggestion text", ...]
}
```

## Examples

### Valid Migration

**Input:** `migrations/001_create_users.sql`
```sql
-- Up Migration
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
```

**Validation Result:**
```json
{
  "valid": true,
  "errors": [],
  "warnings": [],
  "suggestions": []
}
```

### Invalid Migration

**Input:** `migrations/002_drop_users.sql`
```sql
DROP TABLE users;
```

**Validation Result:**
```json
{
  "valid": false,
  "errors": [
    "DROP TABLE without safety comment (add -- SAFE: <reason>)"
  ],
  "warnings": [],
  "suggestions": [
    "Add safety comment explaining why this drop is safe",
    "Consider soft-delete instead of DROP TABLE"
  ]
}
```

### Migration with Warnings

**Input:** `migrations/003_add_posts.sql`
```sql
CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  user_id INTEGER REFERENCES users(id)
);
```

**Validation Result:**
```json
{
  "valid": true,
  "errors": [],
  "warnings": [
    "Missing index on foreign key: user_id",
    "Missing created_at timestamp column",
    "Missing updated_at timestamp column",
    "No ON DELETE behavior specified for foreign key"
  ],
  "suggestions": [
    "Add: CREATE INDEX idx_posts_user_id ON posts(user_id);",
    "Add: created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
    "Add: updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
    "Specify: ON DELETE CASCADE or ON DELETE SET NULL"
  ]
}
```

## Reporting Format

When presenting results to user:

### All Clear
```
✅ Migration validation passed

No errors or warnings found. Migration is safe to apply.
```

### Warnings Only
```
⚠️ Migration validation passed with warnings

The migration is valid but has some recommendations:

Warnings:
• Missing index on foreign key: user_id
• Missing created_at timestamp column

Suggestions:
• Add: CREATE INDEX idx_posts_user_id ON posts(user_id);
• Add: created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
```

### Errors Found
```
❌ Migration validation failed

Critical errors must be fixed before deployment:

Errors:
• DROP TABLE without safety comment

Suggested fixes:
• Add safety comment: -- SAFE: Table is deprecated and unused
• Or consider soft-delete instead of DROP TABLE
```

## Constraints

- **Never execute migrations** - Only validate, never run
- **Report all issues** - Don't stop at first error
- **Explain why** - Each check should explain the reasoning
- **Provide fixes** - Always suggest specific corrections
- **Be conservative** - Err on side of caution for safety
```

**File:** `scripts/validate.py`

```python
#!/usr/bin/env python3
"""
Database migration validator

Checks SQL migration files for safety, best practices, and reversibility.
"""

import sys
import json
import re
from typing import Dict, List, Any
from pathlib import Path


class MigrationValidator:
    """Validates database migration files"""

    def __init__(self, filepath: str):
        self.filepath = Path(filepath)
        self.sql = self.filepath.read_text()
        self.errors: List[str] = []
        self.warnings: List[str] = []
        self.suggestions: List[str] = []

    def validate(self) -> Dict[str, Any]:
        """Run all validation checks"""
        self.check_dangerous_operations()
        self.check_foreign_key_indexes()
        self.check_timestamps()
        self.check_foreign_key_behavior()
        self.check_name_lengths()

        return {
            "valid": len(self.errors) == 0,
            "errors": self.errors,
            "warnings": self.warnings,
            "suggestions": self.suggestions
        }

    def check_dangerous_operations(self):
        """Check for unsafe DROP/ALTER operations"""
        # Check for DROP TABLE without safety comment
        drop_tables = re.finditer(r'DROP TABLE\s+(\w+)', self.sql, re.IGNORECASE)
        for match in drop_tables:
            table = match.group(1)
            # Look for safety comment before DROP
            safe_pattern = f'--\\s*SAFE:.*{table}'
            if not re.search(safe_pattern, self.sql, re.IGNORECASE):
                self.errors.append(f"DROP TABLE {table} without safety comment")
                self.suggestions.append(f"Add comment: -- SAFE: Explanation for dropping {table}")

        # Check for DROP COLUMN without safety comment
        drop_columns = re.finditer(r'DROP COLUMN\s+(\w+)', self.sql, re.IGNORECASE)
        for match in drop_columns:
            column = match.group(1)
            safe_pattern = f'--\\s*SAFE:.*{column}'
            if not re.search(safe_pattern, self.sql, re.IGNORECASE):
                self.errors.append(f"DROP COLUMN {column} without safety comment")
                self.suggestions.append(f"Add comment: -- SAFE: Explanation for dropping {column}")

        # Check for ALTER COLUMN changing type
        alter_type = re.finditer(
            r'ALTER COLUMN\s+(\w+)\s+TYPE\s+(\w+)',
            self.sql,
            re.IGNORECASE
        )
        for match in alter_type:
            column = match.group(1)
            new_type = match.group(2)
            # Check for USING clause (data migration path)
            using_pattern = f'ALTER COLUMN\\s+{column}.*USING'
            if not re.search(using_pattern, self.sql, re.IGNORECASE):
                self.errors.append(
                    f"ALTER COLUMN {column} TYPE {new_type} without USING clause"
                )
                self.suggestions.append(
                    f"Add USING clause to specify data conversion: USING {column}::{new_type}"
                )

    def check_foreign_key_indexes(self):
        """Check that foreign keys have indexes"""
        # Find foreign key columns
        fk_pattern = r'(\w+)\s+.*REFERENCES\s+(\w+)\((\w+)\)'
        foreign_keys = re.finditer(fk_pattern, self.sql, re.IGNORECASE)

        for match in foreign_keys:
            fk_column = match.group(1)
            # Check if index exists for this column
            index_pattern = f'CREATE INDEX.*ON.*\\({fk_column}\\)'
            if not re.search(index_pattern, self.sql, re.IGNORECASE):
                self.warnings.append(f"Missing index on foreign key: {fk_column}")
                self.suggestions.append(
                    f"Add: CREATE INDEX idx_tablename_{fk_column} ON tablename({fk_column});"
                )

    def check_timestamps(self):
        """Check for timestamp columns in CREATE TABLE"""
        create_tables = re.finditer(
            r'CREATE TABLE\s+(\w+)\s*\((.*?)\)',
            self.sql,
            re.IGNORECASE | re.DOTALL
        )

        for match in create_tables:
            table_name = match.group(1)
            table_def = match.group(2)

            if 'created_at' not in table_def.lower():
                self.warnings.append(f"Missing created_at in table {table_name}")
                self.suggestions.append(
                    "Add: created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP"
                )

            if 'updated_at' not in table_def.lower():
                self.warnings.append(f"Missing updated_at in table {table_name}")
                self.suggestions.append(
                    "Add: updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP"
                )

    def check_foreign_key_behavior(self):
        """Check ON DELETE/UPDATE behavior specified"""
        # Find REFERENCES without ON DELETE or ON UPDATE
        fk_refs = re.finditer(r'REFERENCES\s+\w+\(\w+\)', self.sql, re.IGNORECASE)

        for match in fk_refs:
            ref_text = match.group(0)
            # Get context around REFERENCES
            start = max(0, match.start() - 100)
            end = min(len(self.sql), match.end() + 100)
            context = self.sql[start:end]

            if 'ON DELETE' not in context.upper():
                self.warnings.append(f"No ON DELETE behavior for foreign key")
                self.suggestions.append(
                    "Add: ON DELETE CASCADE or ON DELETE SET NULL or ON DELETE RESTRICT"
                )

    def check_name_lengths(self):
        """Check for overly long identifiers (PostgreSQL 63 char limit)"""
        MAX_LENGTH = 63

        # Check table names
        table_names = re.finditer(r'CREATE TABLE\s+(\w+)', self.sql, re.IGNORECASE)
        for match in table_names:
            name = match.group(1)
            if len(name) > MAX_LENGTH:
                self.warnings.append(f"Table name too long: {name} ({len(name)} chars)")
                self.suggestions.append(f"Shorten table name to {MAX_LENGTH} characters or less")

        # Check column names
        column_names = re.finditer(r'\s+(\w+)\s+(?:INTEGER|VARCHAR|TEXT|TIMESTAMP|BOOLEAN)', self.sql, re.IGNORECASE)
        for match in column_names:
            name = match.group(1)
            if len(name) > MAX_LENGTH:
                self.warnings.append(f"Column name too long: {name} ({len(name)} chars)")
                self.suggestions.append(f"Shorten column name to {MAX_LENGTH} characters or less")


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

    filepath = sys.argv[1]

    # Check file exists
    if not Path(filepath).exists():
        print(json.dumps({
            "valid": False,
            "errors": [f"File not found: {filepath}"],
            "warnings": [],
            "suggestions": []
        }), file=sys.stderr)
        return 2

    # Validate migration
    validator = MigrationValidator(filepath)
    result = validator.validate()

    # Output result
    print(json.dumps(result, indent=2))

    # Return appropriate exit code
    if not result["valid"]:
        return 1  # Errors found
    elif result["warnings"]:
        return 2  # Warnings only
    else:
        return 0  # All clear


if __name__ == "__main__":
    sys.exit(main())
```

### Usage in Context

Agent executes the script and interprets structured JSON output, providing deterministic validation that's faster and more reliable than LLM-based analysis.

---

## Pattern 5: Complex Orchestration (Full-Featured)

### When to Use

Use Complex Orchestration when:
- **Multi-step workflow** - Multiple sequential/conditional steps
- **Multiple artifact types** - Code + config + tests + docs
- **Requires coordination** - Scripts + templates + examples all used
- **High complexity** - Simpler patterns insufficient

**Examples:**
- Code scaffolding (full project structure)
- Multi-file generators (API + client + tests + docs)
- Migration tools (transform + validate + test + document)
- Build systems (compile + test + package + deploy)

### Structure

```
skill-name/
├── SKILL.md              # Orchestration instructions
├── scripts/              # Generation & validation scripts
│   ├── generate.py
│   ├── validate.sh
│   └── helpers.py
├── resources/            # Templates
│   ├── code-template.py
│   └── config-template.json
└── examples/             # Complete examples
    ├── example-1/
    └── example-2/
```

### Benefits

- **Complete automation** - End-to-end workflow
- **Consistency** - All artifacts follow patterns
- **Scalability** - Handle complex scenarios
- **Extensibility** - Easy to add new capabilities

### Limitations

- **High complexity** - Most difficult to maintain
- **Most dependencies** - Requires all components working
- **Highest token usage** - Loads multiple resources
- **Steepest learning curve** - Complex for users to understand

### Complete Example: ADK Tool Scaffold

**Directory:** `adk-tool-scaffold/`

**File:** `SKILL.md`

```markdown
---
name: adk-tool-scaffold
description: Generates complete Agent Development Kit tool classes with schema validation, configuration files, unit tests, and documentation for custom agent capabilities
---

# ADK Tool Scaffold Generator

## Goal

Generate production-ready, fully-tested tool class for Agent Development Kit (ADK) including:
- Tool class with type hints and validation
- Configuration file
- Comprehensive unit tests
- Usage documentation

## Workflow Overview

```
1. Gather Requirements → 2. Generate Tool → 3. Generate Config
                                                ↓
5. Create Docs ← 4. Generate Tests ← 3. Validate Code
```

## Step 1: Gather Requirements

### Interactive Questions

Ask user:

1. **Tool name** (PascalCase)
   - Example: `WebSearchTool`, `DatabaseQueryTool`

2. **Tool description**
   - Example: "Searches the web for information using Google Custom Search API"

3. **Input parameters**
   - Format: `name:type:description:required`
   - Example: `query:str:Search query:true`, `max_results:int:Maximum results:false`

4. **Output format**
   - Example: `List[Dict[str, str]]` → `[{"title": "...", "url": "..."}]`

5. **Error cases**
   - Example: "API rate limit exceeded", "Invalid query format"

6. **Dependencies**
   - Example: `requests`, `beautifulsoup4`

### Example Interaction

```
User: Create a tool to search Wikipedia

Agent: I'll help you create a Wikipedia search tool. Let me gather the requirements:

1. Tool name: WikipediaSearchTool
2. Description: Searches Wikipedia for articles and returns summaries
3. Input parameters:
   - query (str, required): Search query
   - language (str, optional): Wikipedia language code (default: "en")
   - max_results (int, optional): Max results to return (default: 5)
4. Output: List[Dict] with title, summary, url
5. Error cases:
   - No results found
   - Invalid language code
   - Network error
6. Dependencies: wikipedia-api
```

## Step 2: Generate Tool Class

### Run Generation Script

```bash
python scripts/generate.py \
  --name WikipediaSearchTool \
  --description "Searches Wikipedia for articles and returns summaries" \
  --params "query:str:Search query:true,language:str:Language code:false,max_results:int:Max results:false" \
  --output List[Dict[str,str]]
```

### Script Actions

1. Load template from `resources/tool-template.py`
2. Replace placeholders with user inputs
3. Generate parameter validation
4. Add error handling
5. Include type hints
6. Write to `output/wikipedia_search_tool.py`

## Step 3: Generate Configuration

### Config Generation

From `resources/config-template.json`:

```json
{
  "tool_name": "WikipediaSearchTool",
  "version": "1.0.0",
  "description": "Searches Wikipedia for articles and returns summaries",
  "parameters": {
    "query": {
      "type": "string",
      "required": true,
      "description": "Search query"
    },
    "language": {
      "type": "string",
      "required": false,
      "default": "en",
      "description": "Wikipedia language code"
    },
    "max_results": {
      "type": "integer",
      "required": false,
      "default": 5,
      "description": "Maximum results to return"
    }
  },
  "dependencies": ["wikipedia-api"]
}
```

## Step 4: Validate Generated Code

### Run Validation

```bash
bash scripts/validate.sh output/wikipedia_search_tool.py
```

### Validation Checks

- ✅ Python syntax valid
- ✅ Type hints present
- ✅ Docstrings complete
- ✅ Error handling implemented
- ✅ All parameters validated
- ✅ Return type matches spec

## Step 5: Generate Unit Tests

### Test Generation

Create `output/test_wikipedia_search_tool.py`:

```python
import pytest
from wikipedia_search_tool import WikipediaSearchTool

def test_basic_search():
    """Test basic Wikipedia search"""
    tool = WikipediaSearchTool()
    results = tool.execute(query="Python programming")
    assert len(results) > 0
    assert "title" in results[0]
    assert "summary" in results[0]

def test_max_results():
    """Test max_results parameter"""
    tool = WikipediaSearchTool()
    results = tool.execute(query="Python", max_results=3)
    assert len(results) <= 3

def test_invalid_language():
    """Test invalid language code handling"""
    tool = WikipediaSearchTool()
    with pytest.raises(ValueError):
        tool.execute(query="Python", language="invalid")

def test_no_results():
    """Test handling of no results"""
    tool = WikipediaSearchTool()
    results = tool.execute(query="xyzabc123notexist")
    assert results == []
```

## Step 6: Create Documentation

Generate `output/README.md`:

```markdown
# WikipediaSearchTool

Searches Wikipedia for articles and returns summaries.

## Installation

```bash
pip install wikipedia-api
```

## Usage

```python
from wikipedia_search_tool import WikipediaSearchTool

tool = WikipediaSearchTool()
results = tool.execute(query="Python programming", max_results=3)

for result in results:
    print(f"{result['title']}: {result['summary']}")
```

## Parameters

- `query` (str, required): Search query
- `language` (str, optional): Wikipedia language code (default: "en")
- `max_results` (int, optional): Maximum results (default: 5)

## Error Handling

- Raises `ValueError` for invalid language codes
- Returns empty list when no results found
- Handles network errors gracefully
```

## Resources Referenced

### Tool Template

**File:** `resources/tool-template.py`

```python
"""
{TOOL_NAME}

{DESCRIPTION}
"""

from typing import {OUTPUT_TYPE}
from dataclasses import dataclass


@dataclass
class {TOOL_NAME}Config:
    """Configuration for {TOOL_NAME}"""
    {CONFIG_FIELDS}


class {TOOL_NAME}:
    """
    {DESCRIPTION}

    Parameters:
        {PARAMETERS_DOC}
    """

    def __init__(self, config: {TOOL_NAME}Config = None):
        """Initialize the tool"""
        self.config = config or {TOOL_NAME}Config()

    def execute(self, {PARAMETERS}) -> {OUTPUT_TYPE}:
        """
        Execute the tool

        Args:
            {ARGS_DOC}

        Returns:
            {RETURNS_DOC}

        Raises:
            {RAISES_DOC}
        """
        # Validate inputs
        {VALIDATION_CODE}

        try:
            # Main logic
            {MAIN_LOGIC}

        except Exception as e:
            # Error handling
            {ERROR_HANDLING}

        return result
```

### Config Template

**File:** `resources/config-template.json`

```json
{
  "tool_name": "{TOOL_NAME}",
  "version": "1.0.0",
  "description": "{DESCRIPTION}",
  "parameters": {
    "{PARAM_NAME}": {
      "type": "{PARAM_TYPE}",
      "required": true,
      "description": "{PARAM_DESC}"
    }
  },
  "dependencies": []
}
```

## Example: Complete Generated Tool

See `examples/wikipedia-search-tool/` for complete working example with:
- `wikipedia_search_tool.py` - Generated tool class
- `config.json` - Tool configuration
- `test_wikipedia_search_tool.py` - Unit tests
- `README.md` - Documentation

## Constraints

- **Follow ADK conventions** - Match existing tool patterns
- **Complete type hints** - All functions fully typed
- **Comprehensive docstrings** - Google-style docstrings
- **Error handling** - Handle all specified error cases
- **Unit test coverage** - Test happy path and error cases
- **Dependencies documented** - List all requirements
```

**File:** `scripts/generate.py`

```python
#!/usr/bin/env python3
"""
Tool class generator for ADK

Generates complete tool classes from templates with validation.
"""

import argparse
import json
from pathlib import Path
from typing import List, Dict


class ToolGenerator:
    """Generates ADK tool classes from templates"""

    def __init__(self, template_dir: Path):
        self.template_dir = template_dir
        self.tool_template = (template_dir / "tool-template.py").read_text()
        self.config_template = (template_dir / "config-template.json").read_text()

    def generate_tool(
        self,
        name: str,
        description: str,
        params: List[Dict],
        output_type: str,
        output_dir: Path
    ):
        """Generate tool class file"""

        # Parse parameters
        param_defs = []
        param_docs = []
        for param in params:
            pname = param["name"]
            ptype = param["type"]
            pdesc = param["description"]
            required = param["required"]

            if required:
                param_defs.append(f"{pname}: {ptype}")
            else:
                param_defs.append(f"{pname}: {ptype} = None")

            param_docs.append(f"{pname} ({ptype}): {pdesc}")

        # Generate code
        tool_code = self.tool_template.format(
            TOOL_NAME=name,
            DESCRIPTION=description,
            OUTPUT_TYPE=output_type,
            PARAMETERS=", ".join(param_defs),
            PARAMETERS_DOC="\n        ".join(param_docs),
            CONFIG_FIELDS="",  # TODO: Generate config fields
            ARGS_DOC="",  # TODO: Generate args docs
            RETURNS_DOC=f"{output_type}",
            RAISES_DOC="ValueError: For invalid inputs",
            VALIDATION_CODE="pass  # TODO: Add validation",
            MAIN_LOGIC="pass  # TODO: Implement logic",
            ERROR_HANDLING="raise"
        )

        # Write file
        output_file = output_dir / f"{self._to_snake_case(name)}.py"
        output_file.write_text(tool_code)

        return output_file

    def generate_config(self, name: str, description: str, params: List[Dict], output_dir: Path):
        """Generate configuration file"""

        config = json.loads(self.config_template)
        config["tool_name"] = name
        config["description"] = description

        # Add parameters
        config["parameters"] = {}
        for param in params:
            config["parameters"][param["name"]] = {
                "type": param["type"],
                "required": param["required"],
                "description": param["description"]
            }

        # Write file
        output_file = output_dir / "config.json"
        output_file.write_text(json.dumps(config, indent=2))

        return output_file

    @staticmethod
    def _to_snake_case(name: str) -> str:
        """Convert PascalCase to snake_case"""
        import re
        s1 = re.sub('(.)([A-Z][a-z]+)', r'\1_\2', name)
        return re.sub('([a-z0-9])([A-Z])', r'\1_\2', s1).lower()


def parse_params(param_string: str) -> List[Dict]:
    """Parse parameter string into structured data"""
    params = []
    for param in param_string.split(","):
        parts = param.split(":")
        if len(parts) == 4:
            params.append({
                "name": parts[0].strip(),
                "type": parts[1].strip(),
                "description": parts[2].strip(),
                "required": parts[3].strip().lower() == "true"
            })
    return params


def main():
    parser = argparse.ArgumentParser(description="Generate ADK tool class")
    parser.add_argument("--name", required=True, help="Tool class name (PascalCase)")
    parser.add_argument("--description", required=True, help="Tool description")
    parser.add_argument("--params", required=True, help="Parameters (name:type:desc:required,...)")
    parser.add_argument("--output", required=True, help="Output type")
    parser.add_argument("--output-dir", default="output", help="Output directory")

    args = parser.parse_args()

    # Setup paths
    script_dir = Path(__file__).parent
    template_dir = script_dir.parent / "resources"
    output_dir = Path(args.output_dir)
    output_dir.mkdir(exist_ok=True)

    # Parse parameters
    params = parse_params(args.params)

    # Generate tool
    generator = ToolGenerator(template_dir)
    tool_file = generator.generate_tool(
        args.name,
        args.description,
        params,
        args.output,
        output_dir
    )
    config_file = generator.generate_config(
        args.name,
        args.description,
        params,
        output_dir
    )

    print(f"✅ Generated tool: {tool_file}")
    print(f"✅ Generated config: {config_file}")


if __name__ == "__main__":
    main()
```

**File:** `scripts/validate.sh`

```bash
#!/bin/bash
# Validate generated tool code

set -e

TOOL_FILE=$1

if [ -z "$TOOL_FILE" ]; then
  echo "Usage: validate.sh <tool-file>"
  exit 1
fi

echo "🔍 Validating $TOOL_FILE..."

# Check Python syntax
if python3 -m py_compile "$TOOL_FILE"; then
  echo "  ✅ Python syntax valid"
else
  echo "  ❌ Python syntax error"
  exit 1
fi

# Check for type hints
if grep -q "def.*->" "$TOOL_FILE"; then
  echo "  ✅ Type hints present"
else
  echo "  ⚠️  Missing type hints"
fi

# Check for docstrings
if grep -q '"""' "$TOOL_FILE"; then
  echo "  ✅ Docstrings present"
else
  echo "  ⚠️  Missing docstrings"
fi

# Check for error handling
if grep -q "try:" "$TOOL_FILE"; then
  echo "  ✅ Error handling implemented"
else
  echo "  ⚠️  No error handling found"
fi

echo "✅ Validation complete"
```

### Usage in Context

This pattern orchestrates multiple tools and templates to generate a complete, production-ready tool package with all necessary components in a single workflow.

---

## Choosing the Right Pattern

### Decision Tree

```
Start: What does your skill need?

┌─ Just instructions? ─────────────────→ Pattern 1: Basic Router

├─ Large static content? ──────────────→ Pattern 2: Asset Utilization

├─ Show transformation examples? ──────→ Pattern 3: Few-Shot Learning

├─ Deterministic validation? ──────────→ Pattern 4: Procedural Logic

└─ Multi-step workflow? ───────────────→ Pattern 5: Complex Orchestration
```

### Pattern Selection Guide

| Need | Pattern | Complexity | Example |
|------|---------|------------|---------|
| Guide behavior | Basic Router | ⭐ Low | Commit formatting |
| Reference templates | Asset Utilization | ⭐⭐ Medium | License headers |
| Show transformations | Few-Shot Learning | ⭐⭐ Medium | JSON to code |
| Validate precisely | Procedural Logic | ⭐⭐⭐ High | Schema validation |
| Full automation | Complex Orchestration | ⭐⭐⭐⭐ Very High | Code scaffolding |

### Questions to Ask

**1. Can pure instructions solve this?**
- ✅ Yes → Use Pattern 1
- ❌ No → Continue

**2. Do I need to reference large static content?**
- ✅ Yes → Use Pattern 2
- ❌ No → Continue

**3. Is showing examples clearer than describing?**
- ✅ Yes → Use Pattern 3
- ❌ No → Continue

**4. Do I need deterministic, binary validation?**
- ✅ Yes → Use Pattern 4
- ❌ No → Continue

**5. Do I need multi-step orchestration?**
- ✅ Yes → Use Pattern 5
- ❌ No → Reconsider requirements

### Common Combinations

Patterns can be combined:

**Pattern 2 + 3:** Templates + Examples
```
license-header-adder/
├── SKILL.md
├── resources/          # Templates (Pattern 2)
│   └── headers/
└── examples/           # Examples (Pattern 3)
    └── sample-files/
```

**Pattern 3 + 4:** Examples + Scripts
```
code-formatter/
├── SKILL.md
├── examples/           # Show formatting (Pattern 3)
│   ├── before/
│   └── after/
└── scripts/            # Validate formatting (Pattern 4)
    └── validate.py
```

**Pattern 2 + 4 + 5:** Full orchestration with all elements
```
project-scaffolder/
├── SKILL.md
├── scripts/            # Generation (Pattern 4/5)
├── resources/          # Templates (Pattern 2)
└── examples/           # Complete projects (Pattern 3)
```

---

## Best Practices by Pattern

### Pattern 1: Basic Router

✅ **Do:**
- Keep instructions under 500 lines
- Use clear, numbered steps
- Include validation checklist
- Provide examples inline

❌ **Don't:**
- Inline large templates (use Pattern 2)
- Rely on complex logic (use Pattern 4)
- Create multi-file workflows (use Pattern 5)

### Pattern 2: Asset Utilization

✅ **Do:**
- Organize resources by type
- Document each resource file
- Use consistent naming
- Support variable substitution

❌ **Don't:**
- Store generated content
- Include multiple versions inline
- Forget to reference resources in SKILL.md

### Pattern 3: Few-Shot Learning

✅ **Do:**
- Provide 3-5 diverse examples
- Cover edge cases
- Show complete transformations
- Document example purpose

❌ **Don't:**
- Use only trivial examples
- Forget to explain what examples show
- Include outdated examples

### Pattern 4: Procedural Logic

✅ **Do:**
- Return structured output (JSON)
- Include helpful error messages
- Make scripts executable
- Document exit codes

❌ **Don't:**
- Use interactive prompts
- Assume dependencies installed
- Modify files without permission
- Skip error handling

### Pattern 5: Complex Orchestration

✅ **Do:**
- Break workflow into clear steps
- Validate at each stage
- Provide rollback on failure
- Document full process

❌ **Don't:**
- Skip validation steps
- Create tight coupling between scripts
- Forget to handle partial failures
- Over-complicate simple tasks

---

## Migration Between Patterns

### Upgrading Patterns

**Pattern 1 → Pattern 2:**
When instructions grow too large:
1. Extract large content to `resources/`
2. Update SKILL.md to reference files
3. Test that references work

**Pattern 2 → Pattern 3:**
When templates need context:
1. Create `examples/` directory
2. Add input/output pairs
3. Reference examples in SKILL.md

**Pattern 3 → Pattern 4:**
When validation needed:
1. Create `scripts/` directory
2. Add validation script
3. Update SKILL.md with script usage

**Pattern 4 → Pattern 5:**
When workflow expands:
1. Add generation scripts
2. Add configuration templates
3. Create orchestration documentation

### Downgrading Patterns

Sometimes simpler is better:

**Pattern 5 → Pattern 4:**
- Remove templates if not needed
- Consolidate scripts
- Simplify workflow

**Pattern 4 → Pattern 3:**
- Replace scripts with examples if deterministic logic not needed
- Remove script infrastructure

**Pattern 3 → Pattern 2:**
- Keep templates, remove examples if patterns are obvious

**Pattern 2 → Pattern 1:**
- Inline small templates
- Remove resources directory

---

## Summary

### Quick Reference

| Pattern | Files | Use Case | Complexity |
|---------|-------|----------|------------|
| 1. Basic Router | SKILL.md | Pure instructions | ⭐ |
| 2. Asset Utilization | +resources/ | Static content | ⭐⭐ |
| 3. Few-Shot Learning | +examples/ | Show transformations | ⭐⭐ |
| 4. Procedural Logic | +scripts/ | Deterministic checks | ⭐⭐⭐ |
| 5. Complex Orchestration | All of above | Full automation | ⭐⭐⭐⭐ |

### Key Principles

1. **Start simple** - Use Pattern 1 unless you have a specific need
2. **Add complexity incrementally** - Don't jump to Pattern 5
3. **Combine patterns** - Mix and match as needed
4. **Refactor as you learn** - Migrate between patterns
5. **Optimize for maintainability** - Simpler is usually better

### Related Documentation

- [Skill Best Practices](best-practices.md)
- [Skill Design Principles](design-principles.md)
- [Platform-Specific Guides](../04-platform-guides/)
- [Antigravity Skills Reference](../../../../references/skills/antigravity-skills.md)

---

**Last Updated:** February 2026
**Category:** Skill Creation
**Complexity:** Intermediate to Advanced
**Prerequisites:** Understanding of SKILL.md format and progressive disclosure