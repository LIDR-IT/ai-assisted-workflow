# Creating Skills: Complete Workflow

## Overview

This guide provides a comprehensive, step-by-step workflow for creating effective skills across all AI agent platforms. Skills are modular capability packages that extend AI agents with specialized knowledge, workflows, and tools through progressive disclosure.

**Key Principle:** Skills transform general AI assistants into specialized domain experts by providing just-in-time knowledge when needed, preventing context saturation while enabling deep expertise.

---

## Prerequisites

Before creating a skill, ensure you understand:

- **Progressive disclosure:** Skills load metadata first, full content only when triggered
- **Triggering mechanism:** The `description` field determines when skills activate
- **Resource types:** SKILL.md, scripts/, references/, examples/, assets/
- **Platform patterns:** Where skills live and how they're discovered

**Related Documentation:**
- [Design Principles](../01-core-concepts/design-principles.md) - Foundational skill concepts
- [Skill Patterns](../02-skill-anatomy/skill-patterns.md) - Common skill architectures

---

## The 10-Step Creation Process

### Step 1: Understand Use Cases First

**Goal:** Gather concrete examples before writing anything.

**Why This Matters:** Skills fail when built around abstract concepts instead of real usage patterns. Starting with concrete examples ensures your skill solves actual problems.

#### Questions to Answer

**Primary Purpose:**
- What specific tasks will this skill handle?
- What exact phrases would users say to trigger it?
- What are common variations of those requests?

**Input/Output Analysis:**
- What inputs will users provide?
- What outputs should the skill produce?
- What format variations exist?

**Edge Cases:**
- What unusual inputs might occur?
- What error conditions need handling?
- What platform-specific limitations exist?

#### Example Analysis Process

**Task:** Create a skill for generating API endpoints

**Concrete Usage Examples:**
```
1. "Create a GET endpoint for fetching users"
2. "Generate a POST endpoint with validation"
3. "Add an endpoint with authentication"
4. "Create endpoint with file upload handling"
```

**Input Variations:**
- Endpoint name and HTTP method
- Request/response schema
- Authentication requirements
- Rate limiting needs

**Expected Outputs:**
- Express/FastAPI route handler
- Input validation schema
- Error handling middleware
- Unit tests
- API documentation

**Edge Cases:**
- Missing schema definitions
- Invalid HTTP method
- Conflicting route paths
- Complex nested validation

#### Gather Real Examples

Don't start writing until you have:
- ✅ 3-5 concrete usage scenarios
- ✅ Actual input examples
- ✅ Desired output examples
- ✅ Known edge cases

**Ask clarifying questions** (but don't overwhelm):
- "What's the primary use case for this skill?"
- "Can you show me an example of what you want?"
- "Are there related tasks this should handle?"
- "What should happen if [edge case]?"

---

### Step 2: Plan Reusable Contents

**Goal:** Decide what belongs in each directory based on usage patterns.

**Why This Matters:** Proper resource organization enables progressive disclosure, keeping the context window lean while providing deep knowledge when needed.

#### Analysis Framework

For each use case from Step 1, ask:

**Is this code repeatedly rewritten the same way?**
- YES → Create script in `scripts/`
- NO → Write instructions in SKILL.md

**Is this large static content?**
- YES → Move to `resources/` or `assets/`
- NO → Include directly in SKILL.md

**Is this better shown than described?**
- YES → Create working example in `examples/`
- NO → Write explanation in SKILL.md

**Is this deterministic logic?**
- YES → Implement as script
- NO → Provide guidance in SKILL.md

#### Resource Distribution Guide

**SKILL.md (1,500-2,000 words):**
- Core instructions and decision-making guidelines
- Process workflows and step-by-step procedures
- References to scripts, examples, and resources
- Rules and constraints

**scripts/ Directory:**
- Deployment automation
- File generation utilities
- Data transformation
- Validation logic
- API interactions

**references/ Directory:**
- API documentation
- Configuration schemas
- Best practices guides
- Migration guides
- Troubleshooting docs

**examples/ Directory:**
- Complete, runnable examples
- Input/output pairs
- Different use case demonstrations
- Template implementations

**assets/ Directory:**
- Code templates
- Configuration file templates
- Images or icons
- Boilerplate files

#### Example Planning

**Skill:** API Endpoint Generator

**SKILL.md Content:**
- When to use this skill (triggering criteria)
- Overall endpoint creation process
- Decision tree for choosing patterns
- References to scripts and templates

**scripts/ Content:**
- `generate_endpoint.py` - Code generation script
- `validate_schema.py` - Schema validation
- `create_tests.py` - Test file generation

**references/ Content:**
- `rest_patterns.md` - REST API best practices
- `validation_schemas.md` - Common validation patterns
- `error_handling.md` - Error response standards

**examples/ Content:**
- `basic_get.js` - Simple GET endpoint
- `post_with_validation.js` - POST with schema
- `authenticated_endpoint.js` - With auth
- `file_upload.js` - File handling

**assets/ Content:**
- `endpoint_template.js` - Base template
- `test_template.js` - Test boilerplate
- `openapi_template.yaml` - API docs template

---

### Step 3: Initialize Skill Structure

**Goal:** Create the directory structure with only the files you'll actually use.

**Why This Matters:** Empty directories clutter the skill and waste space. Start minimal, add as needed.

#### Basic Structure

```bash
# For project-specific skill
mkdir -p .agents/skills/skill-name
touch .agents/skills/skill-name/SKILL.md

# For global skill (personal use)
mkdir -p ~/.claude/skills/skill-name
touch ~/.claude/skills/skill-name/SKILL.md
```

#### Add Directories as Needed

**Only create directories you'll actually use:**

```bash
# Add scripts (if you planned scripts in Step 2)
mkdir .agents/skills/skill-name/scripts

# Add references (if you have detailed docs)
mkdir .agents/skills/skill-name/references

# Add examples (if showing patterns)
mkdir .agents/skills/skill-name/examples

# Add assets (if outputting templates)
mkdir .agents/skills/skill-name/assets
```

**Important:** Delete unused directories. Don't keep empty folders.

#### Initial SKILL.md Template

Create with minimal frontmatter and structure:

```markdown
---
name: skill-name
description: [Specific action] when [concrete trigger phrases]
---

# Skill Title

[Brief one-paragraph overview of what this skill does]

## When to Use

[Clear, specific triggering criteria with examples]

## Instructions

[Step-by-step guidance or core rules]

## Examples

[Concrete examples of application]

## References

[Links to scripts, references, or assets]
```

#### Example: Initial Structure for API Generator

```bash
# Create structure
mkdir -p .agents/skills/api-generator/{scripts,references,examples,assets}

# Create main file
cat > .agents/skills/api-generator/SKILL.md << 'EOF'
---
name: api-generator
description: Generate REST API endpoints with validation and tests when user asks to "create an endpoint", "add an API route", or "generate REST API"
---

# API Endpoint Generator

Generate type-safe REST API endpoints following best practices.

## When to Use

Activate when users need to:
- Create new API endpoints
- Generate REST routes
- Add API handlers with validation
- Scaffold endpoint with tests

## Instructions

[To be filled in Step 4]

## References

[To be added in Step 5]
EOF
```

---

### Step 4: Write SKILL.md

**Goal:** Create clear, actionable instructions that guide the AI agent effectively.

**Why This Matters:** SKILL.md is the primary guidance document. Well-written instructions ensure consistent, high-quality skill execution.

#### Frontmatter Requirements

**Required Fields:**

```yaml
---
name: skill-identifier
description: This skill should be used when asking to "phrase 1", "phrase 2", or "phrase 3"
---
```

**Field Guidelines:**

**`name`**
- Use kebab-case: `api-generator`, `code-review`, `database-validator`
- Keep short and descriptive
- Should match directory name
- Used for skill references

**`description` (CRITICAL FOR TRIGGERING)**
- Include 2-4 specific trigger phrases users would actually say
- Use third-person format: "This skill should be used when..."
- Be concrete, not vague
- Include context about when to use

**Good Descriptions:**
```yaml
description: This skill should be used when asking to "create a hook", "add a PreToolUse hook", "implement hook validation", or "configure hook behavior"

description: Generate React functional components with TypeScript, hooks, and tests when user asks to "create a component", "add a React component", or "scaffold component"

description: Validate database schema migrations for safety and consistency when user asks to "validate migration", "check schema changes", or "review database migration"
```

**Bad Descriptions:**
```yaml
description: Provides guidance for working with hooks
description: Component generator
description: Database tools
```

#### Body Content Structure

**Keep under 500 lines total** - Move longer content to references/

**Recommended Structure:**

```markdown
# Skill Title

[1-2 paragraph overview of purpose and capabilities]

## When to Use

[Specific triggering scenarios with examples]

## Process Overview

[High-level workflow steps]

## Detailed Instructions

[Step-by-step guidance or rules organized by category]

## Script Usage

[How to use bundled scripts, if any]

## Examples

[Concrete examples of skill application]

## References

[Links to resources/, examples/, scripts/, assets/]

## Constraints

[Rules, limitations, and things to avoid]
```

#### Writing Style Guidelines

**Use imperative/infinitive form:**
```markdown
✅ Check for type errors
✅ Validate user input
✅ Generate endpoint from template

❌ You should check for type errors
❌ The skill validates user input
❌ You will generate an endpoint
```

**Be specific and actionable:**
```markdown
✅ Run `python scripts/validate.py <file>` to validate schema

❌ Validate the schema using the validation script
```

**Reference bundled resources explicitly:**
```markdown
✅ See **`references/patterns.md`** for detailed REST patterns
✅ Use **`scripts/generate.py`** to create endpoint code
✅ Review **`examples/authenticated.js`** for auth implementation

❌ Check the patterns documentation
❌ Use the generation script
❌ Look at the examples
```

#### Example: Complete SKILL.md

```markdown
---
name: api-endpoint-generator
description: Generate REST API endpoints with validation, error handling, and tests when user asks to "create an endpoint", "add API route", "generate REST handler", or "scaffold API endpoint"
version: 1.0.0
---

# API Endpoint Generator

Generate production-ready REST API endpoints with TypeScript, validation schemas, error handling, and comprehensive tests following best practices.

## When to Use

Activate this skill when users need to:
- Create new REST API endpoints
- Generate route handlers with validation
- Add endpoints with authentication
- Scaffold API routes with tests

## Process Overview

1. Gather endpoint requirements from user
2. Generate route handler from template
3. Create validation schema
4. Implement error handling
5. Generate unit and integration tests
6. Add API documentation

## Detailed Instructions

### 1. Gather Requirements

Ask user for:
- **HTTP method:** GET, POST, PUT, PATCH, DELETE
- **Route path:** `/api/users/:id`
- **Request schema:** Query params, body, headers
- **Response schema:** Success and error responses
- **Authentication:** Required or public endpoint
- **Authorization:** Role-based access control needs

### 2. Generate Handler

Use **`assets/endpoint-template.ts`** as base:

```bash
# Generate from template
cp assets/endpoint-template.ts src/routes/endpoint-name.ts
```

Customize with gathered requirements.

### 3. Create Validation Schema

Follow patterns in **`references/validation-schemas.md`** to create:
- Input validation with Zod/Joi
- Type-safe request/response types
- Error message definitions

### 4. Implement Error Handling

Standard error responses (see **`references/error-handling.md`**):
- 400 Bad Request - Invalid input
- 401 Unauthorized - Missing authentication
- 403 Forbidden - Insufficient permissions
- 404 Not Found - Resource doesn't exist
- 500 Internal Server Error - Server errors

### 5. Generate Tests

Create test file with:
```bash
# Use test generator
python scripts/generate_tests.py --endpoint endpoint-name
```

Include:
- Happy path tests
- Validation error tests
- Authentication tests
- Edge case tests

### 6. Add Documentation

Generate OpenAPI spec:
```bash
# Generate API docs
python scripts/generate_openapi.py --endpoint endpoint-name
```

## Script Usage

**Generate complete endpoint:**
```bash
python scripts/generate_endpoint.py \
  --name UserProfile \
  --method GET \
  --path "/api/users/:id" \
  --auth required
```

**Validate generated code:**
```bash
bash scripts/validate_endpoint.sh src/routes/user-profile.ts
```

## Examples

See **`examples/`** directory for complete implementations:

- **`examples/basic-get.ts`** - Simple GET endpoint
- **`examples/post-with-validation.ts`** - POST with schema validation
- **`examples/authenticated.ts`** - Endpoint with auth middleware
- **`examples/file-upload.ts`** - File upload handling

## References

- **REST Patterns:** `references/rest-patterns.md`
- **Validation Schemas:** `references/validation-schemas.md`
- **Error Handling:** `references/error-handling.md`
- **Testing Guide:** `references/testing-guide.md`

## Constraints

- Never skip input validation
- Always include error handling
- Generate tests for all endpoints
- Follow RESTful conventions
- Use TypeScript for type safety
- Include API documentation
```

---

### Step 5: Add Resources (Scripts, References, Examples, Assets)

**Goal:** Create the supporting files referenced in SKILL.md.

**Why This Matters:** Resources enable progressive disclosure and provide concrete implementations that SKILL.md references.

#### Creating Scripts

**Purpose:** Deterministic, repeatable operations

**Best Practices:**
- Make executable: `chmod +x script.sh`
- Include shebang: `#!/usr/bin/env python3`
- Return meaningful exit codes
- Output structured data (JSON)
- Include `--help` option
- Handle missing dependencies gracefully

**Example Script Template:**

```python
#!/usr/bin/env python3
"""
Generate API endpoint from template

Usage:
    python generate_endpoint.py --name EndpointName --method GET --path "/api/path"

Exit codes:
    0 - Success
    1 - Error (validation failed, generation failed)
    2 - Missing arguments
"""

import sys
import json
import argparse
from pathlib import Path

def generate_endpoint(name, method, path, auth=False):
    """Generate endpoint files"""
    try:
        # Read template
        template_path = Path(__file__).parent.parent / "assets" / "endpoint-template.ts"
        with open(template_path) as f:
            template = f.read()

        # Substitute variables
        code = template.replace("{{NAME}}", name)
        code = code.replace("{{METHOD}}", method)
        code = code.replace("{{PATH}}", path)

        # Write output
        output_path = Path(f"src/routes/{name.lower()}.ts")
        output_path.parent.mkdir(parents=True, exist_ok=True)
        output_path.write_text(code)

        result = {
            "status": "success",
            "file": str(output_path),
            "message": f"Generated {name} endpoint"
        }
        print(json.dumps(result, indent=2))
        return 0

    except Exception as e:
        error = {
            "status": "error",
            "message": str(e)
        }
        print(json.dumps(error, indent=2), file=sys.stderr)
        return 1

def main():
    parser = argparse.ArgumentParser(description="Generate API endpoint")
    parser.add_argument("--name", required=True, help="Endpoint name")
    parser.add_argument("--method", required=True, choices=["GET", "POST", "PUT", "DELETE"])
    parser.add_argument("--path", required=True, help="Route path")
    parser.add_argument("--auth", action="store_true", help="Require authentication")

    args = parser.parse_args()
    return generate_endpoint(args.name, args.method, args.path, args.auth)

if __name__ == "__main__":
    sys.exit(main())
```

#### Creating References

**Purpose:** Detailed documentation loaded as-needed

**Size:** Each file can be 2,000-5,000+ words

**Content Types:**
- API documentation
- Configuration schemas
- Best practices guides
- Migration guides
- Troubleshooting docs
- Pattern catalogs

**Example Reference File:**

```markdown
# REST API Patterns

## Endpoint Structure

All endpoints should follow this structure:

1. **Input validation** - Validate request data
2. **Authentication** - Verify user identity
3. **Authorization** - Check permissions
4. **Business logic** - Execute core functionality
5. **Response formatting** - Return standardized response

## Standard Response Format

### Success Response

\`\`\`json
{
  "success": true,
  "data": { ... },
  "meta": {
    "timestamp": "2026-02-01T12:00:00Z",
    "requestId": "req_abc123"
  }
}
\`\`\`

### Error Response

\`\`\`json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input",
    "details": [
      {"field": "email", "message": "Invalid email format"}
    ]
  },
  "meta": {
    "timestamp": "2026-02-01T12:00:00Z",
    "requestId": "req_abc123"
  }
}
\`\`\`

[... continue with detailed patterns ...]
```

#### Creating Examples

**Purpose:** Working code demonstrations

**Guidelines:**
- Complete, runnable examples
- Include comments explaining key parts
- Cover different use cases
- Show both input and output

**Example File:**

```typescript
// examples/authenticated-endpoint.ts
// Example: GET endpoint with JWT authentication

import { Request, Response } from 'express';
import { z } from 'zod';
import { authenticate } from '../middleware/auth';

// Request validation schema
const GetUserSchema = z.object({
  params: z.object({
    id: z.string().uuid()
  })
});

// Route handler
export async function getUser(req: Request, res: Response) {
  try {
    // Validate input
    const { params } = GetUserSchema.parse(req);

    // Check authentication (middleware)
    // authenticate() adds req.user

    // Check authorization
    if (req.user.id !== params.id && !req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'Insufficient permissions'
        }
      });
    }

    // Fetch user
    const user = await db.users.findById(params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'User not found'
        }
      });
    }

    // Return response
    return res.status(200).json({
      success: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid request',
          details: error.errors
        }
      });
    }

    console.error('Error fetching user:', error);
    return res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An error occurred'
      }
    });
  }
}

// Route registration
export default {
  method: 'GET',
  path: '/api/users/:id',
  middleware: [authenticate],
  handler: getUser
};
```

#### Creating Assets

**Purpose:** Templates and files for output generation

**Content:**
- Code templates with placeholders
- Configuration templates
- Boilerplate files

**Example Template:**

```typescript
// assets/endpoint-template.ts
// Template for generating API endpoints

import { Request, Response } from 'express';
import { z } from 'zod';

// Request validation schema
const {{NAME}}Schema = z.object({
  // TODO: Add validation schema
});

// Route handler
export async function {{NAME_LOWER}}(req: Request, res: Response) {
  try {
    // Validate input
    const data = {{NAME}}Schema.parse(req);

    // TODO: Implement business logic

    // Return response
    return res.status(200).json({
      success: true,
      data: { ... }
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid request',
          details: error.errors
        }
      });
    }

    console.error('Error in {{NAME}}:', error);
    return res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An error occurred'
      }
    });
  }
}

// Route registration
export default {
  method: '{{METHOD}}',
  path: '{{PATH}}',
  handler: {{NAME_LOWER}}
};
```

---

### Step 6: Validation Checklist

**Goal:** Verify skill structure and content before testing.

**Why This Matters:** Catching issues early prevents debugging during actual usage.

#### Structure Validation

- [ ] Skill in correct location (`.agents/skills/` or `~/.claude/skills/`)
- [ ] SKILL.md exists with required frontmatter
- [ ] Only directories with content exist (no empty folders)
- [ ] Scripts are executable (`chmod +x scripts/*.sh`)
- [ ] All referenced files actually exist

#### Frontmatter Validation

- [ ] `name` field present and uses kebab-case
- [ ] `description` field includes 2-4 specific trigger phrases
- [ ] Description uses third-person format
- [ ] Description is concrete, not vague

#### Content Validation

- [ ] SKILL.md body under 500 lines
- [ ] Writing uses imperative form, not second person
- [ ] Resources explicitly referenced in SKILL.md
- [ ] Examples are complete and runnable
- [ ] Scripts have error handling and helpful output

#### Quality Validation

- [ ] Clear when to use the skill
- [ ] Step-by-step instructions provided
- [ ] Examples demonstrate key patterns
- [ ] Scripts solve deterministic problems
- [ ] No general knowledge Claude already has

**Validation Command:**

```bash
# Check SKILL.md exists and has frontmatter
head -5 .agents/skills/skill-name/SKILL.md | grep -E "^(name|description):"

# Check line count under 500
wc -l .agents/skills/skill-name/SKILL.md

# Check scripts are executable
ls -la .agents/skills/skill-name/scripts/

# Check all referenced files exist
grep -o 'references/[^)]*' .agents/skills/skill-name/SKILL.md | while read file; do
  [ -f ".agents/skills/skill-name/$file" ] && echo "✓ $file" || echo "✗ Missing: $file"
done
```

---

### Step 7: Testing the Skill

**Goal:** Verify skill triggers correctly and executes as expected.

**Why This Matters:** Testing reveals issues with triggering, execution, or resource loading before real usage.

#### Test Triggering

**Test with trigger phrases from description:**

```bash
# Start Claude Code
claude

# Try exact phrases from description
User: "create an API endpoint for users"
User: "add a REST route"
User: "generate endpoint with validation"

# Verify:
# - Skill activates
# - Correct skill loads (check skill name in response)
# - Skill knowledge applied
```

**Test edge cases:**

```bash
# Should NOT trigger (different intent)
User: "what is REST?"
User: "explain API endpoints"

# Should trigger (variation of phrase)
User: "I need to create a new endpoint"
User: "help me add an API route"
```

#### Test Execution

**Verify skill performs correctly:**

1. **Instructions followed:** Check output matches SKILL.md guidance
2. **Resources loaded:** Confirm references, examples, scripts used
3. **Scripts execute:** Verify scripts run without errors
4. **Output quality:** Ensure output meets requirements

**Example Test Session:**

```
User: Create a GET endpoint for fetching user profiles by ID

Expected behavior:
1. Skill activates (api-endpoint-generator)
2. Agent asks for requirements (path, auth, etc.)
3. Agent uses generate_endpoint.py script
4. Agent references validation patterns from references/
5. Agent provides complete implementation based on examples/
6. Output includes validation, error handling, tests
```

#### Test Resources

**Verify scripts work:**

```bash
# Test script independently
cd .agents/skills/api-generator
python scripts/generate_endpoint.py --help
python scripts/generate_endpoint.py --name TestEndpoint --method GET --path "/test"

# Check output
cat src/routes/testendpoint.ts

# Verify exit codes
echo $?  # Should be 0 for success
```

**Verify examples run:**

```bash
# Test example code
cd .agents/skills/api-generator
node examples/authenticated-endpoint.js  # If standalone

# Or verify example is valid syntax
npx tsc --noEmit examples/authenticated-endpoint.ts
```

#### Common Issues

**Skill doesn't trigger:**
- Description too vague → Add specific trigger phrases
- Wrong trigger phrases → Use phrases users actually say
- Frontmatter format wrong → Check YAML syntax

**Skill triggers but fails:**
- Missing resources → Check all referenced files exist
- Script errors → Test scripts independently
- Broken examples → Validate example code

**Wrong output produced:**
- Instructions unclear → Clarify steps in SKILL.md
- Missing examples → Add concrete examples
- Need script → Move deterministic logic to script

---

### Step 8: Iteration Based on Usage

**Goal:** Improve skill based on real-world usage patterns.

**Why This Matters:** Skills improve over time as you discover what works and what doesn't in actual usage.

#### Monitor Usage Patterns

**Track when skill works well:**
- Trigger phrases that activate skill correctly
- Instructions that produce good results
- Helpful scripts and examples
- Effective resource organization

**Track when skill struggles:**
- Missed activations (should have triggered but didn't)
- Wrong activations (triggered when it shouldn't)
- Unclear instructions leading to poor output
- Missing resources or examples

#### Common Iteration Types

**1. Refine Description for Better Triggering**

```yaml
# Before
description: Generate API endpoints with validation

# After
description: Generate REST API endpoints with TypeScript, validation, error handling, and tests when user asks to "create an endpoint", "add API route", "generate REST handler", or "scaffold endpoint"
```

**2. Add Missing Edge Cases**

```markdown
## Instructions

### Error Handling

[Original content...]

### New: File Upload Handling

When endpoint accepts file uploads:
1. Add multipart/form-data middleware
2. Validate file size and type
3. Store files securely
4. Return file metadata

See **`examples/file-upload.ts`** for implementation.
```

**3. Create Scripts for Repetitive Tasks**

```markdown
# Before: All in SKILL.md instructions
Generate endpoint code following this pattern...

# After: Script + reference
Generate endpoint:
```bash
python scripts/generate_endpoint.py --name Name --method METHOD --path PATH
```

See **`references/generation-patterns.md`** for customization options.
```

**4. Move Large Sections to References**

```markdown
# Before: Everything in SKILL.md (600 lines)
## Validation Patterns
[50 lines of validation examples...]

## Error Handling
[40 lines of error patterns...]

# After: Lean SKILL.md (200 lines) + references
## Validation

Follow patterns in **`references/validation-patterns.md`**.

## Error Handling

See **`references/error-handling.md`** for standard error responses.
```

**5. Add Examples for Clarity**

```markdown
# Before: Text description
Create endpoint with authentication using JWT middleware...

# After: Example + reference
Create endpoint with authentication:

See **`examples/authenticated-endpoint.ts`** for complete implementation.
```

#### Iteration Workflow

```bash
# 1. Use skill in real scenarios
# 2. Note issues and improvements
# 3. Update skill
vim .agents/skills/skill-name/SKILL.md

# 4. Add new resources
vim .agents/skills/skill-name/references/new-pattern.md

# 5. Test changes
claude
"create an endpoint"  # Test with real trigger

# 6. Verify improvement
# Compare before/after results

# 7. Commit changes
git add .agents/skills/skill-name/
git commit -m "refactor(skill): improve api-generator triggering and examples"
```

---

### Step 9: Packaging and Distribution

**Goal:** Prepare skill for sharing with team or community.

**Why This Matters:** Proper packaging ensures skill works for others and integrates into their workflows.

#### Pre-Package Checklist

- [ ] SKILL.md under 500 lines
- [ ] All references one level deep (not nested)
- [ ] Scripts are executable and tested
- [ ] Examples are complete and runnable
- [ ] No extraneous files (README, CHANGELOG, LICENSE)
- [ ] No empty directories
- [ ] Frontmatter valid and complete

#### Local Distribution (Project Skill)

**For project-specific skills:**

```bash
# Skill already in .agents/skills/
# Sync to agent platforms
./.agents/rules/sync-rules.sh  # Handles skills too

# Commit to version control
git add .agents/skills/skill-name/
git commit -m "feat(skill): add api-endpoint-generator skill"
git push

# Team members get it automatically on pull
```

#### Global Distribution (Personal Skill)

**For personal skills to share:**

```bash
# Package skill
cd ~/.claude/skills/
tar -czf skill-name.tar.gz skill-name/

# Share archive
# Recipients extract to ~/.claude/skills/
tar -xzf skill-name.tar.gz -C ~/.claude/skills/
```

#### Publishing to Skills Marketplace

**For public skills:**

1. **Prepare metadata:**
   ```yaml
   ---
   name: skill-name
   description: Clear description with trigger phrases
   version: 1.0.0
   author: Your Name
   license: MIT
   tags: [api, typescript, rest]
   ---
   ```

2. **Add documentation:**
   ```bash
   # Create usage examples
   cat > .agents/skills/skill-name/USAGE.md << 'EOF'
   # Skill Name Usage

   ## Installation
   [Installation instructions]

   ## Usage
   [Usage examples]

   ## Examples
   [Common scenarios]
   EOF
   ```

3. **Test thoroughly:**
   - Test on clean installation
   - Verify all scripts work
   - Check examples run
   - Validate documentation

4. **Submit to marketplace:**
   ```bash
   # Using npx skills (if applicable)
   npx skills publish .agents/skills/skill-name
   ```

#### Documentation for Distribution

**Include in USAGE.md or README.md:**

```markdown
# Skill Name

Brief description of what this skill does.

## Installation

### Project Skill
\`\`\`bash
# Copy to project
cp -r skill-name .agents/skills/
./agents/rules/sync-rules.sh
\`\`\`

### Global Skill
\`\`\`bash
# Copy to user directory
cp -r skill-name ~/.claude/skills/
\`\`\`

## Usage

Trigger phrases:
- "create an endpoint"
- "add API route"
- "generate REST handler"

Example usage:
\`\`\`
User: Create a GET endpoint for fetching users
Agent: [Uses skill to generate endpoint]
\`\`\`

## Features

- Feature 1
- Feature 2
- Feature 3

## Requirements

- Python 3.8+
- Node.js 16+
- TypeScript

## Configuration

[Any configuration needed]

## Examples

See `examples/` directory for complete examples.

## License

MIT
```

---

### Step 10: Maintenance and Updates

**Goal:** Keep skill current and effective over time.

**Why This Matters:** Technologies evolve, patterns change, and skills need updates to remain useful.

#### When to Update

**Trigger updates when:**
- Framework or library versions change
- Best practices evolve
- New patterns emerge
- Users report issues
- New features requested
- Platform capabilities expand

#### Maintenance Workflow

**Monthly review:**
```bash
# Check skill usage
# Review recent invocations
# Note any failures or confusion

# Update documentation
vim .agents/skills/skill-name/references/patterns.md

# Update examples for new versions
vim .agents/skills/skill-name/examples/

# Test with current tools
python scripts/validate.py

# Update version
# Edit SKILL.md frontmatter
version: 1.1.0
```

**Versioning:**
- **Patch (1.0.0 → 1.0.1):** Bug fixes, typo corrections
- **Minor (1.0.0 → 1.1.0):** New features, additional examples
- **Major (1.0.0 → 2.0.0):** Breaking changes, restructuring

**Changelog tracking:**
```bash
# Document changes
cat >> .agents/skills/skill-name/CHANGELOG.md << 'EOF'
## v1.1.0 - 2026-02-15

### Added
- New examples for file upload handling
- Validation script for migration files

### Changed
- Updated TypeScript to v5 syntax
- Improved error handling patterns

### Fixed
- Script exit code handling
- Missing reference file
EOF
```

---

## Best Practices Summary

### DO ✅

- **Start with concrete usage examples**
- **Write specific trigger phrases in description**
- **Use imperative form** ("Create endpoint" not "You should create")
- **Keep SKILL.md lean** (under 500 lines)
- **Explicitly reference resources** in SKILL.md
- **Provide working examples**
- **Create utility scripts** for deterministic tasks
- **Delete unused directories**
- **Test thoroughly before distributing**
- **Iterate based on real usage**

### DON'T ❌

- **Don't write vague descriptions** ("API tools")
- **Don't use second person** ("You should...")
- **Don't put everything in SKILL.md** (use references/)
- **Don't include general knowledge** Claude already has
- **Don't create unreferenced resources**
- **Don't leave broken examples**
- **Don't keep empty directories**
- **Don't skip testing**
- **Don't forget to version**

---

## Complete Example: From Idea to Skill

**Scenario:** Create a skill for generating database migrations

### Step 1: Understand Use Cases

**Concrete examples:**
1. "Create a migration to add users table"
2. "Generate migration for adding email column"
3. "Create migration to add index on user_id"

**Input variations:**
- Table creation
- Column addition/modification
- Index creation
- Foreign key constraints

**Expected outputs:**
- Up migration SQL
- Down migration SQL
- Timestamp-named file
- Validation checks

### Step 2: Plan Resources

**SKILL.md:** Migration process, safety checks, naming conventions
**scripts/:** `generate_migration.py`, `validate_migration.py`
**references/:** `sql-patterns.md`, `safety-checklist.md`
**examples/:** `create-table.sql`, `add-column.sql`, `add-index.sql`
**assets/:** `migration-template.sql`

### Step 3: Initialize Structure

```bash
mkdir -p .agents/skills/db-migration/{scripts,references,examples,assets}
touch .agents/skills/db-migration/SKILL.md
```

### Step 4: Write SKILL.md

```yaml
---
name: database-migration-generator
description: Generate safe database migrations with up/down SQL, validation, and rollback when user asks to "create a migration", "generate migration", or "add database migration"
version: 1.0.0
---

# Database Migration Generator

Generate production-safe database migrations with validation and rollback capabilities.

## When to Use

Activate when users need to:
- Create database migrations
- Add tables, columns, or indexes
- Modify schema safely
- Generate reversible migrations

## Process

1. Gather migration requirements
2. Generate timestamped migration file
3. Create up and down SQL
4. Validate for safety
5. Check reversibility

## Instructions

[Detailed steps...]

## Script Usage

Generate migration:
\`\`\`bash
python scripts/generate_migration.py --name add_users_table --type table
\`\`\`

Validate migration:
\`\`\`bash
python scripts/validate_migration.py migrations/20260201_add_users_table.sql
\`\`\`

## References

- **SQL Patterns:** `references/sql-patterns.md`
- **Safety Checklist:** `references/safety-checklist.md`

## Examples

- `examples/create-table.sql`
- `examples/add-column.sql`
- `examples/add-index.sql`
```

### Steps 5-10

[Follow same pattern as detailed above]

**Result:** Complete, tested, documented skill ready for use and distribution.

---

## Troubleshooting

### Skill Not Triggering

**Symptoms:** Request matches intent but skill doesn't load

**Solutions:**
- Review description specificity - add concrete trigger phrases
- Test with exact phrasing from description
- Check skill location (correct directory)
- Verify frontmatter YAML syntax
- Restart AI agent

### Skill Executes Incorrectly

**Symptoms:** Skill triggers but produces wrong output

**Solutions:**
- Clarify instructions in SKILL.md
- Add concrete examples showing expected patterns
- Move complex logic to scripts
- Add decision trees for complex cases
- Update references with missing information

### Resources Not Loading

**Symptoms:** References or scripts not found

**Solutions:**
- Check file paths (case-sensitive)
- Verify explicit references in SKILL.md
- Ensure files exist: `ls -la skill-name/references/`
- Check directory structure (one level deep)
- Verify skill packaging included all files

---

## Related Documentation

- [Design Principles](../01-core-concepts/design-principles.md) - Core skill concepts
- [Skill Patterns](../02-skill-anatomy/skill-patterns.md) - Common architectures
- [SKILL.md Format](../02-skill-anatomy/skill-md-format.md) - Detailed frontmatter guide
- [Progressive Disclosure](../01-core-concepts/progressive-disclosure.md) - Loading strategy

---

## References

- **Anthropic Skill Creator:** [skills.sh/anthropics/skills/skill-creator](https://skills.sh/anthropics/skills/skill-creator)
- **Claude Code Skills:** [skills.sh/anthropics/claude-code/skill-development](https://skills.sh/anthropics/claude-code/skill-development)
- **Antigravity Skills:** [antigravity.google/docs/knowledge](https://antigravity.google/docs/knowledge)
- **Skills Marketplace:** [skills.sh](https://skills.sh)

---

**Last Updated:** February 2026
**Version:** 1.0.0
**Category:** Skill Development
