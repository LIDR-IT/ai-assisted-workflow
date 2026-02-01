# Design Principles for Skills

## Overview

Effective skills follow three core design principles defined by Anthropic: **Conciseness**, **Degrees of Freedom**, and **Progressive Disclosure**. These principles ensure skills remain efficient, flexible, and context-preserving while providing specialized knowledge to AI agents.

Understanding these principles is essential for creating skills that:
- Load quickly and efficiently
- Provide appropriate guidance without over-constraining
- Preserve valuable context window space
- Scale across multiple skills in a project

**Related Documentation:**
- [Skill Anatomy](skill-anatomy.md) - Understanding skill structure
- [Workflow](workflow.md) - Step-by-step creation process

---

## The Three Core Principles

### 1. Conciseness

**Principle:** The context window is shared across system prompts, conversation history, and other skills. Only include information Claude wouldn't already know.

#### Why Conciseness Matters

Context windows have limits. Every token consumed by a skill is a token unavailable for:
- Conversation history
- Other loaded skills
- Code being analyzed
- Output generation

Skills should be **knowledge-dense**, focusing exclusively on domain-specific information that Claude cannot infer from its training data.

#### What to Include

**DO include:**
- Domain-specific patterns and conventions
- Project-specific workflows
- Non-obvious edge cases
- Framework-specific best practices
- Platform limitations and workarounds
- Team-specific standards

**Example:**
```markdown
✅ DO: Include domain-specific knowledge
Prefer server components by default in Next.js 13+.
Use 'use client' directive only when:
- Component uses hooks (useState, useEffect)
- Component handles browser events (onClick, onChange)
- Component uses browser-only APIs (localStorage, window)
```

#### What to Exclude

**DON'T include:**
- General programming concepts
- Basic language syntax
- Common design patterns Claude knows
- Obvious explanations
- Framework introductions

**Example:**
```markdown
❌ DON'T: Explain general knowledge
React is a JavaScript library for building user interfaces.
It uses a component-based architecture where components are
reusable pieces of UI that can maintain their own state.
```

#### Practical Application

**Before (Verbose):**
```markdown
React is a popular JavaScript library created by Facebook for building
user interfaces. It uses a virtual DOM to efficiently update the UI.
Components are the building blocks of React applications. They can be
class-based or functional. Hooks were introduced in React 16.8 and allow
you to use state in functional components.

When creating components, you should follow these best practices:
- Use functional components with hooks instead of class components
- Extract reusable logic into custom hooks
- Use meaningful component and prop names
```

**After (Concise):**
```markdown
Component Best Practices:
- Prefer functional components with hooks over class components
- Extract reusable stateful logic into custom hooks
- Name components as PascalCase nouns (UserProfile, not userProfile)
- Name props descriptively (onUserSelect vs onClick)
```

**Token savings:** ~80 tokens → ~30 tokens (62% reduction)

#### Conciseness Checklist

When reviewing skill content, ask:
- [ ] Would Claude know this from training data?
- [ ] Is this explaining HOW the language/framework works?
- [ ] Could this be inferred from well-written code?
- [ ] Am I repeating standard documentation?

If yes to any, consider removing or condensing.

---

### 2. Degrees of Freedom

**Principle:** Match specificity to task fragility. Provide appropriate guidance ranging from flexible instructions to deterministic scripts based on how critical exact execution is.

#### The Specificity Spectrum

Skills can provide guidance at three levels:

1. **Text Instructions** → Flexible tasks where approach varies
2. **Pseudocode/Patterns** → Preferred patterns with some flexibility
3. **Exact Scripts** → Error-prone operations requiring precision

#### When to Use Each Level

##### Level 1: Text Instructions

**Use when:**
- Task has multiple valid approaches
- Context determines best solution
- Creative problem-solving is valuable
- Exact implementation varies by use case

**Characteristics:**
- High-level guidance
- Principle-based direction
- Outcome-focused, not implementation-focused
- Room for agent judgment

**Example: Code Review Skill**
```markdown
Review code for performance issues:

## Performance Checklist
- Identify unnecessary re-renders in React components
- Check for expensive calculations without memoization
- Look for missing database indexes on frequently queried fields
- Flag synchronous operations that could be asynchronous
- Detect memory leaks (event listeners, intervals, subscriptions)

Provide specific line numbers and actionable recommendations.
```

**Why text instructions:** Code review requires judgment about context, severity, and trade-offs. Different codebases have different performance requirements.

##### Level 2: Pseudocode/Patterns

**Use when:**
- Established patterns should be followed
- Structure is important but details vary
- Consistency across implementations matters
- Some flexibility is appropriate

**Characteristics:**
- Structural guidance
- Preferred patterns
- Key steps defined
- Implementation details flexible

**Example: API Endpoint Generator**
```markdown
Create REST API endpoint following this pattern:

## Endpoint Structure

\`\`\`typescript
// 1. Define request validation schema
const schema = z.object({
  // Define expected input fields with types and constraints
});

// 2. Create endpoint handler
export async function POST(request: Request) {
  // 2a. Parse and validate input
  const body = await request.json();
  const validated = schema.parse(body);

  // 2b. Check authentication/authorization
  const user = await authenticate(request);
  if (!authorized(user, 'resource:action')) {
    return new Response('Forbidden', { status: 403 });
  }

  // 2c. Execute business logic
  const result = await processRequest(validated);

  // 2d. Return standardized response
  return Response.json({
    success: true,
    data: result
  });
}
\`\`\`

## Key Points
- Always validate input first
- Check auth before business logic
- Use consistent response format
- Handle errors with appropriate status codes
```

**Why pseudocode:** API endpoints should follow consistent patterns for maintainability, but exact implementation depends on the specific endpoint's purpose.

##### Level 3: Exact Scripts

**Use when:**
- Exact sequence matters
- Mistakes have serious consequences
- Operation is error-prone
- Deterministic execution required
- Task is repetitive and unchanging

**Characteristics:**
- Executable code
- No interpretation needed
- Single correct execution path
- Safety-critical operations

**Example: Production Deployment Skill**
```markdown
## Deployment Process

Execute the deployment script exactly as provided:

\`\`\`bash
#!/bin/bash
# scripts/deploy-production.sh
# CRITICAL: Do not modify this sequence

set -e  # Exit on any error

echo "Starting production deployment..."

# 1. Run full test suite
echo "Running tests..."
npm run test:all
if [ $? -ne 0 ]; then
  echo "❌ Tests failed. Deployment aborted."
  exit 1
fi

# 2. Build production bundle
echo "Building production bundle..."
npm run build:production

# 3. Run security audit
echo "Running security audit..."
npm audit --production --audit-level=moderate
if [ $? -ne 0 ]; then
  echo "❌ Security vulnerabilities found. Deployment aborted."
  exit 1
fi

# 4. Create database backup
echo "Creating database backup..."
./scripts/backup-db.sh production
if [ $? -ne 0 ]; then
  echo "❌ Backup failed. Deployment aborted."
  exit 1
fi

# 5. Deploy to production
echo "Deploying to production..."
aws s3 sync ./dist s3://production-bucket --delete
aws cloudfront create-invalidation \
  --distribution-id E1234567890ABC \
  --paths "/*"

# 6. Run smoke tests
echo "Running smoke tests..."
npm run test:smoke:production

echo "✅ Deployment complete"
\`\`\`

Run this script from project root:
\`\`\`bash
./scripts/deploy-production.sh
\`\`\`
```

**Why exact script:** Production deployment requires exact sequencing, error handling, and rollback capability. Any deviation risks production stability.

#### Choosing the Right Level

| Factor | Text Instructions | Pseudocode | Exact Scripts |
|--------|------------------|------------|---------------|
| **Consequences of error** | Low | Medium | High |
| **Approach flexibility** | High | Medium | None |
| **Context dependence** | High | Medium | Low |
| **Repeatability needs** | Low | Medium | High |
| **Judgment required** | High | Medium | None |

**Decision Framework:**

1. **Start with question:** "What happens if this is done wrong?"
   - Minor inconvenience → Text instructions
   - Rework required → Pseudocode
   - Data loss/downtime → Exact script

2. **Ask:** "How many valid approaches exist?"
   - Many → Text instructions
   - Few preferred patterns → Pseudocode
   - One correct way → Exact script

3. **Consider:** "Does context change the approach?"
   - Frequently → Text instructions
   - Sometimes → Pseudocode
   - Rarely → Exact script

#### Practical Examples

**Example 1: Accessibility Audit (Text Instructions)**
```markdown
Audit web page for WCAG compliance:

## Level A (Critical)
- All images have descriptive alt text
- All form inputs have associated labels
- Keyboard navigation works for all interactive elements
- No keyboard traps exist
- Color is not the only means of conveying information

## Level AA (Important)
- Color contrast ratios meet 4.5:1 for normal text, 3:1 for large
- Focus indicators visible on all interactive elements
- ARIA labels present where HTML semantics insufficient
- Page is responsive and functional at 200% zoom

Report findings with file paths and line numbers.
```

**Example 2: Database Migration (Pseudocode)**
```markdown
Create database migration following this pattern:

\`\`\`typescript
// migrations/YYYYMMDDHHMMSS_description.ts

export async function up(db: Database) {
  // 1. Create new tables/columns
  await db.schema.createTable('table_name', (table) => {
    table.increments('id').primary();
    table.string('column_name').notNullable();
    table.timestamps(true, true); // created_at, updated_at
  });

  // 2. Add indexes
  await db.schema.alterTable('table_name', (table) => {
    table.index('column_name');
  });

  // 3. Migrate data (if needed)
  // Use transactions for safety
}

export async function down(db: Database) {
  // Reverse all changes from up()
  await db.schema.dropTable('table_name');
}
\`\`\`

Key requirements:
- Always implement both up() and down()
- Use transactions for data migrations
- Add indexes for foreign keys
- Include timestamps on all tables
```

**Example 3: Git Commit Validation (Exact Script)**
```markdown
Validate commit messages using the provided script:

\`\`\`bash
#!/bin/bash
# scripts/validate-commit.sh

COMMIT_MSG_FILE=$1
COMMIT_MSG=$(cat "$COMMIT_MSG_FILE")

# Conventional Commits pattern
PATTERN="^(feat|fix|docs|style|refactor|test|chore)(\(.+\))?: .{1,72}"

if ! echo "$COMMIT_MSG" | grep -qE "$PATTERN"; then
  echo "❌ Invalid commit message format"
  echo ""
  echo "Required format:"
  echo "  type(scope): description"
  echo ""
  echo "Valid types: feat, fix, docs, style, refactor, test, chore"
  echo "Example: feat(auth): add OAuth2 login support"
  exit 1
fi

echo "✅ Commit message valid"
exit 0
\`\`\`

Install as pre-commit hook:
\`\`\`bash
ln -s ../../scripts/validate-commit.sh .git/hooks/commit-msg
chmod +x .git/hooks/commit-msg
\`\`\`
```

---

### 3. Progressive Disclosure

**Principle:** Load information only when needed to preserve context window space. Skills use a three-level loading system to provide metadata initially, detailed content when activated, and deep resources as required.

#### Why Progressive Disclosure Matters

**The Context Saturation Problem:**

Imagine a project with 20 skills. If each skill loaded its full content (2,000-5,000 words) immediately:
- **Without progressive disclosure:** 40,000-100,000 tokens constantly loaded
- **Result:** Context filled with irrelevant information, crowding out:
  - Current conversation
  - Active code being edited
  - Other relevant skills
  - Generated output

**With progressive disclosure:** Only 2,000 tokens (~100 words × 20 skills) loaded initially, with full content loading only when needed.

#### The Three-Level System

##### Level 1: Metadata (~100 words)

**Always loaded** - Present in every context

**Contents:**
```yaml
---
name: skill-identifier
description: Detailed description of when and why to use this skill
version: 1.0.0
---
```

**Purpose:**
- Skill discovery
- Triggering mechanism
- Lightweight presence

**Token cost:** ~50-100 tokens per skill

**Example:**
```yaml
---
name: react-performance-audit
description: This skill should be used when asked to "audit React performance",
"find performance issues", "optimize React components", or "reduce re-renders"
version: 1.0.0
---
```

##### Level 2: SKILL.md Body (<5,000 words)

**Loaded when skill triggers** - Activated by intent match

**Contents:**
- Main instructions
- Process workflows
- Decision guidelines
- References to resources

**Purpose:**
- Primary guidance for task execution
- Sufficient for most use cases
- Still concise enough to preserve context

**Token cost:** ~1,000-3,000 tokens per active skill

**Size guideline:** 1,500-2,000 words ideal, 5,000 maximum

**Example structure:**
```markdown
# React Performance Audit

## Purpose
Identify and resolve React component performance issues.

## Audit Process

### 1. Identify Expensive Re-renders
Check for components re-rendering unnecessarily:
- Use React DevTools Profiler
- Look for components rendering on every parent update
- Check for missing dependencies in useEffect

### 2. Check Memoization
Identify missing optimization opportunities:
- Expensive calculations without useMemo
- Callback functions without useCallback
- Components without React.memo

### 3. Review Context Usage
Audit React Context for performance issues:
- Large context objects causing wide re-renders
- Context updates triggering unnecessary renders
- Missing context splitting

## Detailed Patterns

See **`references/performance-patterns.md`** for comprehensive optimization techniques.

## Examples

Working examples in **`examples/`** directory:
- `examples/memo-optimization.tsx`
- `examples/context-splitting.tsx`
```

##### Level 3: Resources (Variable size)

**Loaded as Claude determines necessary** - On-demand deep dives

**Contents:**
- Detailed documentation (`references/`)
- Working code examples (`examples/`)
- Utility scripts (`scripts/`)
- Templates and assets (`assets/`)

**Purpose:**
- Deep dive information
- Comprehensive examples
- Deterministic execution tools

**Token cost:** Variable, only when explicitly referenced

**Size guideline:** 2,000-10,000+ words per resource file

**Example resource structure:**
```
react-performance-audit/
├── SKILL.md (2,000 words - Level 2)
├── references/
│   ├── performance-patterns.md (8,000 words - Level 3)
│   ├── profiler-guide.md (4,000 words - Level 3)
│   └── common-mistakes.md (3,000 words - Level 3)
├── examples/
│   ├── memo-optimization.tsx (200 lines - Level 3)
│   ├── context-splitting.tsx (150 lines - Level 3)
│   └── virtual-scrolling.tsx (300 lines - Level 3)
└── scripts/
    └── analyze-bundle.js (100 lines - Level 3)
```

#### Progressive Disclosure Flow

**User Request:** "This React component is slow, can you optimize it?"

**Step 1: Metadata Scan (Level 1)**
```
Agent scans all skill metadata → Matches "react-performance-audit"
description includes "optimize React components"
```

**Step 2: Load SKILL.md (Level 2)**
```
Agent loads SKILL.md body (2,000 words)
Reads audit process and main instructions
Sees references to references/performance-patterns.md
```

**Step 3: Load Resources as Needed (Level 3)**
```
Agent determines it needs detailed memoization patterns
Loads references/performance-patterns.md (8,000 words)
Also loads examples/memo-optimization.tsx
```

**Total context used:** ~10,000 words (instead of 17,000 if everything loaded immediately)

#### How to Structure for Progressive Disclosure

**Rule 1: Essential in SKILL.md, Details in references/**

❌ **DON'T: Put everything in SKILL.md**
```markdown
# API Testing Skill

## HTTP Methods

### GET Requests
GET requests retrieve data from the server. They should be idempotent,
meaning multiple identical requests should have the same effect as a
single request. GET requests should not modify server state...

[15 more paragraphs about GET]

### POST Requests
POST requests create new resources on the server. They are not
idempotent, meaning multiple identical requests may create multiple
resources...

[15 more paragraphs about POST]

[Continues for PUT, PATCH, DELETE... 8,000 words total]
```

✅ **DO: Overview in SKILL.md, details in references/**

**SKILL.md (500 words):**
```markdown
# API Testing Skill

## Test Creation Process

1. Identify endpoint and method (GET, POST, PUT, DELETE)
2. Define test cases (happy path, edge cases, errors)
3. Create request with appropriate headers and body
4. Assert response status, headers, and body
5. Verify side effects (database changes, external calls)

## HTTP Methods Overview

- **GET:** Retrieve resources (see `references/http-methods.md#get`)
- **POST:** Create resources (see `references/http-methods.md#post`)
- **PUT/PATCH:** Update resources (see `references/http-methods.md#put-patch`)
- **DELETE:** Remove resources (see `references/http-methods.md#delete`)

## Detailed Information

For comprehensive HTTP method specifications, best practices, and examples:
- HTTP Methods: **`references/http-methods.md`**
- Authentication: **`references/auth-patterns.md`**
- Test Examples: **`examples/`** directory
```

**references/http-methods.md (8,000 words):**
```markdown
# HTTP Methods Reference

## GET Requests

### Specification
GET requests retrieve data from the server without modifying state...

[Comprehensive details]

### Best Practices
[Detailed guidelines]

### Common Patterns
[Multiple examples]

### Error Handling
[Detailed error scenarios]

## POST Requests
[Comprehensive details for POST]

[etc.]
```

**Rule 2: Explicit References**

When SKILL.md mentions a resource, use bold inline code to make it visually clear:

```markdown
## Database Migration Patterns

For safe migration strategies, see **`references/migration-guide.md`**.

Use **`scripts/validate-migration.sh`** to check migration safety before applying.

Example migrations available in **`examples/`** directory.
```

This signals to Claude that these resources exist and can be loaded if needed.

**Rule 3: Examples Over Explanations**

Instead of explaining patterns in SKILL.md, reference working examples:

❌ **DON'T:**
```markdown
To create a custom React hook, first define a function starting with "use".
Then add any state you need with useState. Add effects with useEffect if
needed. Make sure to return the values or functions you want to expose.
Handle cleanup in useEffect return functions. Consider memoization for
expensive operations...
```

✅ **DO:**
```markdown
To create custom hooks, see working examples in **`examples/hooks/`**:
- `examples/hooks/use-fetch.ts` - Data fetching pattern
- `examples/hooks/use-local-storage.ts` - State persistence
- `examples/hooks/use-debounce.ts` - Performance optimization
```

**Rule 4: Scripts for Deterministic Tasks**

When operations should be performed exactly the same way every time, use scripts in Level 3:

```markdown
## Migration Validation

Validate migrations before applying:

\`\`\`bash
./scripts/validate-migration.sh path/to/migration.sql
\`\`\`

This script checks for:
- Unsafe operations (DROP without comments)
- Missing indexes on foreign keys
- Missing timestamps
- Reversibility
```

The script itself (Level 3) contains the exact validation logic, while SKILL.md (Level 2) just references it.

#### Benefits of Progressive Disclosure

**1. Context Efficiency**
- 20 skills @ 100 words each = 2,000 words always loaded
- vs. 20 skills @ 5,000 words each = 100,000 words

**2. Faster Activation**
- Agent scans lightweight metadata quickly
- Triggers correct skill based on description
- Loads only relevant detailed content

**3. Reduced Latency**
- Less token processing
- Smaller prompts to LLM
- Faster response generation

**4. Cost Reduction**
- Fewer input tokens per request
- Only pay for loaded content
- Significant savings at scale

**5. Scalability**
- Can have 50+ skills in a project
- Context remains manageable
- Each skill fully detailed when needed

#### Common Mistakes

❌ **Mistake 1: Vague descriptions (poor Level 1)**
```yaml
description: Helps with React development
```
Result: Skill never triggers because description too vague.

✅ **Fix:**
```yaml
description: This skill should be used when asked to "optimize React performance",
"reduce re-renders", "improve component rendering", or "fix slow React components"
```

❌ **Mistake 2: Everything in SKILL.md (ignoring Level 3)**
```markdown
# Testing Skill (12,000 words)

[Entire testing philosophy, all patterns, all examples inline]
```
Result: Massive context consumption even when most content not needed.

✅ **Fix:**
```markdown
# Testing Skill (1,500 words)

[Core testing process and overview]

Detailed patterns in references/:
- **`references/unit-testing.md`** - Unit test patterns
- **`references/integration-testing.md`** - Integration patterns
- **`references/e2e-testing.md`** - E2E patterns

Examples in **`examples/`** directory.
```

❌ **Mistake 3: Unreferenced resources (inaccessible Level 3)**
```
skill/
├── SKILL.md (never mentions references/)
└── references/
    └── detailed-guide.md (orphaned)
```
Result: Claude doesn't know the resource exists, never loads it.

✅ **Fix:**
```markdown
# SKILL.md

For detailed implementation patterns, see **`references/detailed-guide.md`**.
```

---

## Applying All Three Principles Together

### Example: Database Schema Validator Skill

This example demonstrates all three principles working together.

#### 1. Conciseness (What to include)

**Excluded (Claude knows this):**
- SQL basics
- What databases are
- Generic validation concepts

**Included (Domain-specific):**
- Project's specific safety rules
- Team's naming conventions
- Required columns for this project

#### 2. Degrees of Freedom (How specific to be)

**Text instructions:** General validation approach
**Pseudocode:** Migration file structure pattern
**Exact script:** Safety validation logic (too critical to vary)

#### 3. Progressive Disclosure (When to load)

**Level 1 - Metadata (always loaded):**
```yaml
---
name: database-schema-validator
description: This skill should be used when asked to "validate database migration",
"check migration safety", "review schema changes", or "verify migration file"
version: 2.0.0
---
```

**Level 2 - SKILL.md (loaded when triggered):**
```markdown
# Database Schema Validator

## Purpose
Validate database migrations for safety and consistency before production deployment.

## Validation Process

### 1. User provides migration file path

### 2. Run validation script
\`\`\`bash
python scripts/validate-migration.py path/to/migration.sql
\`\`\`

### 3. Review script output

Script returns JSON with errors, warnings, and suggestions:
\`\`\`json
{
  "valid": false,
  "errors": ["DROP TABLE without -- SAFE: comment"],
  "warnings": ["Missing index on foreign key user_id"],
  "suggestions": ["Add index: CREATE INDEX idx_user_id ON posts(user_id)"]
}
\`\`\`

### 4. Report validation results

List all errors and warnings with explanations.

### 5. Suggest fixes

Provide specific SQL to resolve issues.

## Safety Rules (in validation script)

- No DROP TABLE without `-- SAFE: [reason]` comment
- All foreign keys must have indexes
- All tables must have `created_at` and `updated_at` timestamps
- ALTER TABLE must include default values
- Migrations must be reversible

## Detailed Patterns

For migration best practices and common patterns:
- **`references/migration-patterns.md`** - Safe migration techniques
- **`references/rollback-procedures.md`** - How to handle failures

## Examples

Working examples in **`examples/`**:
- `examples/add-column-safe.sql` - Safe column addition
- `examples/add-index.sql` - Index creation pattern
- `examples/drop-table-safe.sql` - Safe table removal
```

**Level 3 - Resources (loaded as needed):**

**scripts/validate-migration.py:**
```python
#!/usr/bin/env python3
"""
Validate SQL migration files for safety and best practices.
"""
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

    # Check 1: Unsafe DROP TABLE
    drop_tables = re.findall(r'DROP TABLE\s+(\w+)', sql, re.IGNORECASE)
    for table in drop_tables:
        # Look for safety comment before DROP
        pattern = f'--\s*SAFE:.*\n.*DROP TABLE\s+{table}'
        if not re.search(pattern, sql, re.IGNORECASE):
            errors.append(f"DROP TABLE {table} without -- SAFE: comment")
            suggestions.append(
                f"Add comment before DROP:\n"
                f"-- SAFE: Confirmed with team, data backed up\n"
                f"DROP TABLE {table};"
            )

    # Check 2: Foreign keys need indexes
    foreign_keys = re.findall(
        r'(\w+)\s+.*REFERENCES\s+\w+',
        sql,
        re.IGNORECASE
    )
    for fk_column in foreign_keys:
        # Check if index exists for this column
        index_pattern = f'CREATE INDEX.*{fk_column}'
        if not re.search(index_pattern, sql, re.IGNORECASE):
            warnings.append(f"Foreign key {fk_column} missing index")
            suggestions.append(
                f"CREATE INDEX idx_{fk_column} ON table_name({fk_column});"
            )

    # Check 3: Timestamps required
    create_tables = re.findall(
        r'CREATE TABLE\s+(\w+)',
        sql,
        re.IGNORECASE
    )
    for table in create_tables:
        if 'created_at' not in sql.lower():
            warnings.append(f"Table {table} missing created_at timestamp")
        if 'updated_at' not in sql.lower():
            warnings.append(f"Table {table} missing updated_at timestamp")

    # Return results
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
        print("Usage: validate-migration.py <migration-file>")
        sys.exit(2)

    sys.exit(validate_migration(sys.argv[1]))
```

**references/migration-patterns.md:**
```markdown
# Database Migration Patterns

## Safe Column Addition

When adding a column to an existing table with data:

\`\`\`sql
-- Good: Nullable column (safe for existing rows)
ALTER TABLE users
ADD COLUMN phone_number VARCHAR(20);

-- Good: Column with default (safe for existing rows)
ALTER TABLE users
ADD COLUMN notification_enabled BOOLEAN DEFAULT true;

-- Bad: Required column without default (breaks existing rows)
ALTER TABLE users
ADD COLUMN email VARCHAR(255) NOT NULL;  -- ❌ Fails on existing data
\`\`\`

## Safe Index Addition

[8,000 more words of detailed patterns...]
```

**examples/add-column-safe.sql:**
```sql
-- Example: Safe column addition with migration and rollback

-- Up migration
ALTER TABLE posts
ADD COLUMN view_count INTEGER DEFAULT 0 NOT NULL;

CREATE INDEX idx_posts_view_count ON posts(view_count);

-- Down migration (rollback)
DROP INDEX idx_posts_view_count;
ALTER TABLE posts DROP COLUMN view_count;
```

#### How This Skill Demonstrates All Principles

**Conciseness:**
- Excludes: SQL syntax basics, generic validation concepts
- Includes: Specific safety rules for this project

**Degrees of Freedom:**
- Text instructions: How to interpret validation results
- Pseudocode: Migration file structure pattern in SKILL.md
- Exact script: Validation logic (safety-critical, must be deterministic)

**Progressive Disclosure:**
- Level 1: Metadata always present (100 words)
- Level 2: SKILL.md loaded when validation requested (800 words)
- Level 3: Script, patterns, examples loaded as needed (10,000+ words)

**Total context impact:**
- Without skill: 0 words
- Skill triggered but resources not needed: 900 words (metadata + SKILL.md)
- Full resources loaded: 11,000 words (only when actually referenced)

---

## Design Checklist

When creating or reviewing a skill, verify:

### Conciseness
- [ ] Removed general knowledge Claude already has
- [ ] Focused on domain-specific information only
- [ ] Excluded obvious explanations
- [ ] Kept examples concise and relevant
- [ ] Removed redundant content

### Degrees of Freedom
- [ ] Identified task fragility level
- [ ] Chose appropriate specificity (text/pseudocode/script)
- [ ] Used text instructions for flexible tasks
- [ ] Used pseudocode for preferred patterns
- [ ] Used exact scripts for safety-critical operations
- [ ] Matched guidance to consequences of error

### Progressive Disclosure
- [ ] Created specific, trigger-rich description (Level 1)
- [ ] Kept SKILL.md under 2,000 words ideally, 5,000 max (Level 2)
- [ ] Moved detailed content to references/ (Level 3)
- [ ] Moved examples to examples/ (Level 3)
- [ ] Moved scripts to scripts/ (Level 3)
- [ ] Explicitly referenced all Level 3 resources in SKILL.md
- [ ] Used bold inline code for resource references

---

## Common Anti-Patterns

### Anti-Pattern 1: Encyclopedia Skill

**Problem:** Including comprehensive reference material in SKILL.md

```markdown
# API Testing Skill (15,000 words)

[Complete HTTP specification]
[All REST patterns]
[Every possible status code with explanations]
[All authentication methods in detail]
[etc.]
```

**Why it fails:**
- Bloats context even when details not needed
- Slows activation
- Most content never used in typical request

**Solution:** Move to progressive disclosure
- SKILL.md: Process overview and key decision points
- references/: Comprehensive details
- examples/: Working code samples

### Anti-Pattern 2: Over-Constrained Skill

**Problem:** Providing exact scripts for tasks that need flexibility

```markdown
# Code Review Skill

Run this exact command:
\`\`\`bash
eslint --fix --config .eslintrc.json src/**/*.ts
\`\`\`
```

**Why it fails:**
- Different projects have different linters
- Configuration paths vary
- Removes agent's ability to adapt

**Solution:** Use appropriate degree of freedom
- Text instructions for what to review
- Examples of common issues
- Let agent determine how to run tools in context

### Anti-Pattern 3: Hidden Resources

**Problem:** Creating resources but not referencing them in SKILL.md

```
skill/
├── SKILL.md (no mention of references/)
└── references/
    └── comprehensive-guide.md
```

**Why it fails:**
- Claude doesn't know resource exists
- Resource never loads
- Wasted effort creating orphaned documentation

**Solution:** Explicitly reference all resources

```markdown
# SKILL.md

For detailed implementation patterns, see **`references/comprehensive-guide.md`**.
```

---

## Related Documentation

- **[Skill Anatomy](skill-anatomy.md)** - Understanding the components of a skill
- **[Workflow](workflow.md)** - Step-by-step creation process
- **[Frontmatter Guide](frontmatter.md)** - Crafting effective metadata
- **[Testing Skills](testing.md)** - Validating skill effectiveness

---

**Last Updated:** 2026-02-01
**Category:** Skill Development
