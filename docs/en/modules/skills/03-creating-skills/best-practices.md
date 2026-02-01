# Best Practices for Creating Skills

A comprehensive guide to creating effective, maintainable skills that work reliably across platforms.

---

## Table of Contents

- [Description Writing Best Practices](#description-writing-best-practices)
- [Content Organization](#content-organization)
- [Script Development](#script-development)
- [Testing Skills](#testing-skills)
- [Common Mistakes to Avoid](#common-mistakes-to-avoid)
- [Quality Checklist](#quality-checklist)
- [Maintenance Best Practices](#maintenance-best-practices)

---

## Description Writing Best Practices

### The Critical Role of Descriptions

The `description` field is **the most important part of your skill**. It determines when your skill activates through semantic matching.

**Why it matters:**
- Claude/Gemini use descriptions for intent matching
- Vague descriptions = skill never triggers
- Specific descriptions = reliable activation

### Formula for Good Descriptions

```
[Action] [Target] [Method/Context] [Quality/Constraint]
```

**Components:**
1. **Action**: What the skill does (validates, generates, creates, analyzes)
2. **Target**: What it operates on (React components, database migrations, API endpoints)
3. **Method/Context**: How or where (with TypeScript, for PostgreSQL, following OpenAPI)
4. **Quality/Constraint**: Standards or limitations (production-ready, read-only, with rollback)

### Platform-Specific Patterns

**Claude Code** (Third-person trigger phrases):
```yaml
description: This skill should be used when the user asks to "create a hook",
"add a PreToolUse hook", "implement hook validation", or "configure hooks"
```

**Antigravity** (Detailed technical specification):
```yaml
description: Validates database schema migrations for consistency, safety, and rollback capability before production deployment, checking for missing indexes, unsafe operations, and reversibility
```

### Examples: Vague vs Specific

**❌ Vague (Will NOT trigger reliably):**
```yaml
description: Database tools
description: Helps with code
description: General utilities
description: Provides guidance for hooks
description: React components
```

**✅ Specific (Will trigger reliably):**
```yaml
# Good
description: Executes read-only SQL queries against PostgreSQL databases for data analysis and debugging

# Better
description: Generates React functional components with TypeScript, hooks, styling, and comprehensive test coverage following project conventions

# Best
description: Validates database schema migrations for consistency, safety, and rollback capability before production deployment, checking for missing indexes, unsafe operations, and reversibility
```

### Trigger Phrase Strategies

**Include multiple trigger variations:**
```yaml
description: This skill should be used when asking to "validate migrations",
"check database schema", "review migration safety", or "analyze schema changes"
```

**Include domain keywords:**
```yaml
description: Creates REST API endpoints with Express routes, validation middleware, error handling, and integration tests following OpenAPI spec
```

**Specify exclusions when needed:**
```yaml
description: Generates Python Pydantic models from JSON schemas, but ONLY for Python projects (check for requirements.txt or pyproject.toml)
```

---

## Content Organization

### SKILL.md Length Guidelines

**Target:** 1,500-2,000 words
**Maximum:** 5,000 words (~500 lines)

**Why?**
- Loaded entirely when skill triggers
- Consumes context window
- Longer = slower, more expensive
- Better to split into multiple focused skills

### When to Split into Resources

**Keep in SKILL.md:**
- Core instructions (how to use the skill)
- Decision-making guidelines
- Process workflows
- Quick reference information

**Move to `references/`:**
- Detailed API documentation
- Comprehensive pattern libraries
- Migration guides
- Troubleshooting documentation
- Large configuration schemas

**Move to `scripts/`:**
- Validation logic
- Code generation utilities
- Data transformation
- Deployment automation

**Move to `examples/`:**
- Complete working examples
- Input/output pairs for few-shot learning
- Template implementations

**Move to `assets/`:**
- Templates for output generation
- Boilerplate code
- Images, icons
- Configuration file templates

### File Organization Patterns

**✅ Good - One Level Deep:**
```
my-skill/
├── SKILL.md
├── scripts/
│   ├── validate.py
│   └── generate.sh
├── references/
│   ├── api-docs.md
│   └── patterns.md
├── examples/
│   ├── basic-usage.js
│   └── advanced-usage.js
└── assets/
    └── template.tsx
```

**❌ Bad - Too Deep:**
```
my-skill/
├── SKILL.md
└── references/
    └── docs/
        └── api/
            └── v1/
                └── endpoints.md  # Too nested!
```

**✅ Good - Referenced in SKILL.md:**
```markdown
## Detailed Patterns

See **`references/api-patterns.md`** for comprehensive API patterns.

## Validation

Use **`scripts/validate.sh`** to verify implementations:

\`\`\`bash
./scripts/validate.sh path/to/file
\`\`\`
```

**❌ Bad - Unreferenced:**
```markdown
# No mention of references/api-patterns.md
# Claude won't know it exists!
```

### Progressive Disclosure Strategy

**Level 1: Metadata (~100 words)**
- Always loaded
- Name + description
- Used for discovery

**Level 2: SKILL.md Body (1,500-2,000 words)**
- Loaded when skill triggers
- Core instructions
- References to deeper resources

**Level 3: Resources (variable)**
- Loaded as needed
- Detailed documentation
- Complex examples
- Utility scripts

---

## Script Development

### When to Use Scripts

**✅ DO use scripts for:**
- Deterministic validation (schema checking, linting)
- Repetitive code generation (boilerplate, templates)
- Complex calculations (data processing, transformations)
- External tool integration (API calls, file operations)
- Error-prone operations requiring precision

**❌ DON'T use scripts for:**
- Simple text transformations (LLM can do this)
- Subjective decisions (code quality judgment)
- Tasks requiring context understanding
- One-off operations

### Script Best Practices

**✅ DO:**

1. **Return meaningful exit codes**
   ```python
   # 0 = success, 1 = errors, 2 = warnings
   sys.exit(0 if valid else 1)
   ```

2. **Output structured data (JSON)**
   ```python
   result = {
       "status": "success",
       "data": processed_data,
       "warnings": warnings_list
   }
   print(json.dumps(result, indent=2))
   ```

3. **Write errors to stderr**
   ```python
   print(f"Error: {error_message}", file=sys.stderr)
   ```

4. **Include --help option**
   ```python
   if "--help" in sys.argv:
       print("Usage: script.py <input-file>")
       sys.exit(0)
   ```

5. **Handle missing dependencies gracefully**
   ```python
   try:
       import required_module
   except ImportError:
       print("Error: required_module not installed", file=sys.stderr)
       print("Install: pip install required_module", file=sys.stderr)
       sys.exit(1)
   ```

**❌ DON'T:**

1. **Assume environment setup**
   ```python
   # Bad - assumes jq exists
   os.system("cat file.json | jq .")

   # Good - check first
   if not shutil.which("jq"):
       print("Error: jq not found", file=sys.stderr)
       sys.exit(1)
   ```

2. **Use interactive prompts**
   ```python
   # Bad - doesn't work in agent context
   answer = input("Continue? (y/n): ")

   # Good - use CLI flags
   if "--force" not in sys.argv:
       print("Error: --force required for destructive operation")
       sys.exit(1)
   ```

3. **Modify files without confirmation**
   ```python
   # Bad - silent modification
   with open(file, 'w') as f:
       f.write(new_content)

   # Good - dry run support
   if "--dry-run" in sys.argv:
       print(f"Would modify: {file}")
   else:
       with open(file, 'w') as f:
           f.write(new_content)
   ```

4. **Depend on specific versions without checking**
   ```python
   # Bad - assumes Python 3.10+
   match value:
       case 1: return "one"

   # Good - version check
   if sys.version_info < (3, 10):
       print("Error: Python 3.10+ required", file=sys.stderr)
       sys.exit(1)
   ```

### Exit Codes and Error Handling

**Standard exit codes:**
```python
#!/usr/bin/env python3
import sys

EXIT_SUCCESS = 0      # Everything worked
EXIT_ERROR = 1        # Fatal error occurred
EXIT_WARNING = 2      # Completed with warnings
EXIT_USAGE = 2        # Invalid usage/arguments
```

**Complete error handling pattern:**
```python
#!/usr/bin/env python3
import sys
import json

def main(args):
    try:
        # Validate arguments
        if len(args) != 1:
            print("Usage: script.py <input-file>", file=sys.stderr)
            return EXIT_USAGE

        # Check dependencies
        if not check_dependencies():
            return EXIT_ERROR

        # Process
        result = process_file(args[0])

        # Output JSON
        print(json.dumps(result, indent=2))

        # Return appropriate code
        if result["errors"]:
            return EXIT_ERROR
        elif result["warnings"]:
            return EXIT_WARNING
        else:
            return EXIT_SUCCESS

    except FileNotFoundError as e:
        error = {"status": "error", "message": f"File not found: {e}"}
        print(json.dumps(error), file=sys.stderr)
        return EXIT_ERROR
    except Exception as e:
        error = {"status": "error", "message": str(e)}
        print(json.dumps(error), file=sys.stderr)
        return EXIT_ERROR

if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
```

### JSON Output Patterns

**Validation result:**
```json
{
  "valid": true,
  "errors": [],
  "warnings": ["Missing index on foreign key"],
  "suggestions": ["Add index on user_id column"]
}
```

**Processing result:**
```json
{
  "status": "success",
  "processed": 42,
  "skipped": 3,
  "data": {
    "output_file": "result.json",
    "summary": "Processed 42 items"
  }
}
```

**Error result:**
```json
{
  "status": "error",
  "message": "Invalid schema: missing required field 'id'",
  "context": {
    "file": "schema.json",
    "line": 15
  }
}
```

### Dependency Management

**Check dependencies at runtime:**
```python
def check_dependencies():
    """Verify all required tools are installed"""
    required = {
        "jq": "brew install jq",
        "git": "Install git",
        "node": "Install Node.js"
    }

    missing = []
    for tool, install_cmd in required.items():
        if not shutil.which(tool):
            missing.append(f"{tool}: {install_cmd}")

    if missing:
        print("Missing dependencies:", file=sys.stderr)
        for dep in missing:
            print(f"  - {dep}", file=sys.stderr)
        return False

    return True
```

**Document dependencies in script:**
```python
#!/usr/bin/env python3
"""
Database Schema Validator

Dependencies:
  - Python 3.8+
  - sqlparse: pip install sqlparse
  - psycopg2: pip install psycopg2-binary

Usage:
  python validate.py schema.sql
"""
```

---

## Testing Skills

### Test Activation (Trigger Phrases)

**Create test matrix:**
```markdown
| Phrase | Should Trigger? | Notes |
|--------|-----------------|-------|
| "validate this migration" | ✅ Yes | Primary trigger |
| "check database schema" | ✅ Yes | Alternative phrase |
| "what is a migration?" | ❌ No | Informational query |
| "create a table" | ❌ No | Different intent |
```

**Test with variations:**
```
# Direct triggers
"validate database migration"
"check schema migration safety"
"review migration before deploy"

# Edge cases
"migration" (too vague - should not trigger)
"validate migration in MongoDB" (if skill is PostgreSQL-specific)
```

### Test Execution

**1. Scripts run correctly:**
```bash
# Test script independently
python scripts/validate.py test-input.sql

# Verify exit code
echo $?  # Should be 0, 1, or 2

# Check output format
python scripts/validate.py test.sql | jq .  # Should be valid JSON
```

**2. Output is correct:**
```bash
# Create test cases
mkdir -p tests/fixtures

# Valid migration
cat > tests/fixtures/valid-migration.sql <<EOF
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_users_name ON users(name);
EOF

# Invalid migration
cat > tests/fixtures/invalid-migration.sql <<EOF
DROP TABLE users;  -- Missing safety comment
EOF

# Test both
python scripts/validate.py tests/fixtures/valid-migration.sql
python scripts/validate.py tests/fixtures/invalid-migration.sql
```

**3. Error handling works:**
```bash
# Missing file
python scripts/validate.py nonexistent.sql
# Should: Exit 1, print error to stderr

# Invalid format
echo "not sql" > invalid.txt
python scripts/validate.py invalid.txt
# Should: Exit 1, explain problem

# Missing dependencies
# Temporarily rename dependency, verify graceful failure
```

### Test Across Platforms

**Claude Code:**
```bash
# Load skill
cc

# Test trigger phrases
> "create a database migration for users table"

# Verify:
# - Skill activates
# - Scripts execute
# - References load when mentioned
```

**Antigravity:**
```bash
# Test in workspace with skill
cd project-with-skill

# Test trigger
antigravity "validate this database migration"

# Verify:
# - Description matches intent
# - Skill loads
# - Scripts have correct permissions (chmod +x)
```

**Cross-platform considerations:**
```bash
# Test shebang works on multiple systems
#!/usr/bin/env python3  # ✅ Works everywhere
#!/usr/bin/python3      # ❌ May fail on some systems

# Test path separators
os.path.join("dir", "file")  # ✅ Cross-platform
"dir/file"                    # ❌ Won't work on Windows
```

### Iteration Based on Feedback

**Track issues:**
```markdown
## Testing Log

### 2024-01-15
- ❌ Skill didn't trigger for "check migration"
- **Fix:** Added "check" to description trigger phrases
- ✅ Now triggers correctly

### 2024-01-16
- ❌ Script failed with missing jq
- **Fix:** Added dependency check with helpful error
- ✅ Graceful failure with install instructions
```

**Common iteration needs:**
1. **Trigger improvements** - Expand description keywords
2. **Error messages** - Make failures more helpful
3. **Examples** - Add missing use cases
4. **Documentation** - Clarify ambiguous instructions
5. **Performance** - Optimize slow operations

---

## Common Mistakes to Avoid

### 1. Vague Descriptions

**❌ Mistake:**
```yaml
description: Database tools
description: Helps with React
description: Code utilities
```

**✅ Fix:**
```yaml
description: Validates PostgreSQL schema migrations for production safety, checking indexes, constraints, and rollback procedures
description: Generates React functional components with TypeScript, hooks, tests, and stories following team conventions
description: Formats and validates git commit messages using Conventional Commits specification
```

### 2. Second Person Usage

**❌ Mistake:**
```markdown
You should validate the input schema.
You need to check for errors.
You will generate the output file.
```

**✅ Fix:**
```markdown
Validate the input schema against expected format.
Check for type errors and constraint violations.
Generate output file with processed results.
```

### 3. Everything in SKILL.md

**❌ Mistake:**
```markdown
# My Skill (7,000 words)

## API Documentation
[5,000 words of API docs inline]

## Examples
[30 code examples inline]

## Configuration
[2,000 words of config options]
```

**✅ Fix:**
```markdown
# My Skill (2,000 words)

## API Documentation
See **`references/api-docs.md`** for complete API reference.

## Examples
Working examples in **`examples/`** directory:
- `basic-usage.js` - Simple use case
- `advanced-usage.js` - Complex scenarios

## Configuration
Configuration guide in **`references/configuration.md`**.
```

### 4. Unreferenced Resources

**❌ Mistake:**
```
my-skill/
├── SKILL.md          # No mention of patterns.md!
└── references/
    └── patterns.md   # Will never load
```

**✅ Fix:**
```markdown
# In SKILL.md

## Advanced Patterns

For comprehensive patterns and techniques, see **`references/patterns.md`**.
```

### 5. Deep Directory Nesting

**❌ Mistake:**
```
my-skill/
└── references/
    └── docs/
        └── api/
            └── v1/
                └── endpoints/
                    └── users.md
```

**✅ Fix:**
```
my-skill/
└── references/
    ├── api-v1-endpoints.md
    └── api-v1-users.md
```

### 6. Empty Directories

**❌ Mistake:**
```
my-skill/
├── SKILL.md
├── scripts/        # Empty!
├── references/     # Empty!
└── examples/       # Empty!
```

**✅ Fix:**
```
my-skill/
└── SKILL.md        # Only include directories you actually use
```

---

## Quality Checklist

### Pre-Release Checklist

**Structure:**
- [ ] Skill in correct location (`.agents/skills/`, `~/.claude/skills/`, or `.agent/skills/`)
- [ ] SKILL.md has required frontmatter (name, description)
- [ ] Description includes specific trigger phrases
- [ ] No empty directories
- [ ] All referenced files exist
- [ ] Directory structure max 1 level deep

**Content:**
- [ ] SKILL.md is 1,500-2,000 words (max 5,000)
- [ ] Writing uses imperative form, not second person
- [ ] Large content moved to `references/`
- [ ] All resources explicitly referenced in SKILL.md
- [ ] Examples are complete and working
- [ ] Documentation is clear and actionable

**Scripts:**
- [ ] Scripts are executable (`chmod +x`)
- [ ] Scripts have proper shebang (`#!/usr/bin/env python3`)
- [ ] Scripts return meaningful exit codes
- [ ] Scripts output structured data (JSON)
- [ ] Scripts handle missing dependencies
- [ ] Scripts include --help option
- [ ] Error messages go to stderr

**Testing:**
- [ ] Skill triggers on expected phrases
- [ ] Skill doesn't trigger on unrelated phrases
- [ ] Scripts execute successfully
- [ ] Script output is parseable
- [ ] Error handling works correctly
- [ ] Cross-platform compatibility verified

### Validation Steps

**1. Structure validation:**
```bash
# Check file exists
test -f my-skill/SKILL.md && echo "✅ SKILL.md exists"

# Check frontmatter
head -n 5 my-skill/SKILL.md | grep "^name:" && echo "✅ Has name"
head -n 5 my-skill/SKILL.md | grep "^description:" && echo "✅ Has description"

# Check for empty directories
for dir in scripts references examples assets; do
    if [ -d "my-skill/$dir" ] && [ -z "$(ls -A my-skill/$dir)" ]; then
        echo "⚠️  Empty directory: $dir"
    fi
done
```

**2. Script validation:**
```bash
# Check executability
find my-skill/scripts -type f -not -perm +111 -print

# Check shebang
for script in my-skill/scripts/*; do
    head -n 1 "$script" | grep "^#!/usr/bin/env" || echo "⚠️  No proper shebang: $script"
done

# Test execution
for script in my-skill/scripts/*.py; do
    python "$script" --help && echo "✅ $script has --help"
done
```

**3. Content validation:**
```bash
# Check length
wc -l my-skill/SKILL.md
# Should be < 500 lines

# Check for second person
grep -i "you should\|you need\|you will\|you can" my-skill/SKILL.md
# Should return nothing

# Check references exist
grep -o '\`references/[^`]*\`' my-skill/SKILL.md | while read ref; do
    ref=$(echo $ref | tr -d '`')
    test -f "my-skill/$ref" || echo "❌ Missing: $ref"
done
```

### Documentation Completeness

**Required documentation:**
- [ ] Clear purpose statement
- [ ] When to use criteria
- [ ] Step-by-step instructions
- [ ] Examples for common use cases
- [ ] Error handling guidance
- [ ] Dependencies listed

**Optional but recommended:**
- [ ] Troubleshooting section
- [ ] Advanced techniques
- [ ] Migration guide (if replacing old skill)
- [ ] Performance considerations
- [ ] Security best practices

---

## Maintenance Best Practices

### Versioning Strategies

**Semantic versioning:**
```yaml
version: 1.0.0  # Major.Minor.Patch
```

**Version guidelines:**
- **Patch (1.0.1):** Bug fixes, typo corrections, minor improvements
- **Minor (1.1.0):** New features, additional examples, enhanced documentation
- **Major (2.0.0):** Breaking changes, major restructure, API changes

**Version in SKILL.md:**
```yaml
---
name: my-skill
description: Detailed description
version: 1.2.0
---
```

### Changelog Tracking

**Keep changelog in git commits:**
```bash
# Good commit messages document changes
git commit -m "feat(my-skill): add support for TypeScript validation

- Added TypeScript schema validation
- Updated examples with TS usage
- Enhanced error messages

Version: 1.1.0"
```

**For major skills, consider CHANGELOG.md:**
```markdown
# Changelog

## [1.2.0] - 2024-01-20
### Added
- TypeScript validation support
- Advanced examples for complex schemas

### Fixed
- Error handling for missing dependencies
- Exit code consistency

## [1.1.0] - 2024-01-10
### Added
- JSON output format for scripts
- --dry-run flag for validation

### Changed
- Improved description trigger phrases
- Moved API docs to references/
```

### Updating Skills

**Safe update process:**

1. **Test changes in isolation:**
   ```bash
   # Create test workspace
   mkdir skill-test
   cp -r my-skill skill-test/

   # Test updated version
   cc --skills-dir skill-test
   ```

2. **Verify backward compatibility:**
   ```bash
   # Old trigger phrases still work?
   > "original trigger phrase"

   # Scripts still accept old arguments?
   scripts/validate.py old-format-input.json
   ```

3. **Update version number:**
   ```yaml
   version: 1.3.0  # Increment appropriately
   ```

4. **Document breaking changes:**
   ```markdown
   ## Breaking Changes in v2.0.0

   - Script argument order changed
   - Old: `validate.py <schema> <file>`
   - New: `validate.py <file> --schema <schema>`

   Migration: Update all references to use --schema flag
   ```

### Deprecation Handling

**Gradual deprecation:**

```yaml
# Version 1.x (old skill)
---
name: old-skill-name
description: [DEPRECATED] Use new-skill-name instead. Validates databases...
---

# Show deprecation warning
> **⚠️ DEPRECATED:** This skill is deprecated. Use `new-skill-name` instead.
>
> This skill will be removed in version 3.0.0.
```

**Migration period:**
1. Release new skill alongside old (v2.0)
2. Deprecate old skill with warning (v2.1)
3. Remove old skill after migration period (v3.0)

**Migration guide:**
```markdown
# Migrating from old-skill to new-skill

## Breaking Changes
- Different trigger phrases
- New script API
- Restructured output format

## Migration Steps
1. Update trigger phrases in workflows
2. Update script calls: `old-script.py` → `new-script.py --format json`
3. Update output parsing to handle new JSON structure

## Timeline
- v2.0: New skill available
- v2.1: Old skill deprecated (warning shown)
- v3.0: Old skill removed (6 months after v2.1)
```

### Monitoring Skill Usage

**Track issues:**
```markdown
## Known Issues

- [ ] Skill doesn't trigger for phrase "analyze schema" (#42)
- [x] Script fails on Windows due to path separator (#38) - Fixed in v1.2.1
- [ ] Performance slow for large files >100MB (#45)
```

**Gather feedback:**
```markdown
## User Feedback Log

### 2024-01-15 - @user1
- "Skill triggered when it shouldn't for simple 'what is' questions"
- **Action:** Made description more specific about validation context

### 2024-01-18 - @user2
- "Script error messages unclear"
- **Action:** Added detailed error messages with solutions
```

**Performance monitoring:**
```markdown
## Performance Benchmarks

| Version | SKILL.md Size | Avg Load Time | Trigger Accuracy |
|---------|---------------|---------------|------------------|
| 1.0.0   | 6,000 words   | 2.3s          | 70%              |
| 1.1.0   | 2,000 words   | 0.8s          | 85%              |
| 1.2.0   | 2,000 words   | 0.8s          | 92%              |
```

---

## Related Documentation

- [Skill Anatomy](../01-fundamentals/skill-anatomy.md) - Structure and components
- [Design Principles](design-principles.md) - Core design concepts
- [Workflow](workflow.md) - Step-by-step creation process
- [Skill Patterns](skill-patterns.md) - Common architectural patterns
- [Testing Guidelines](../../guidelines/quality/testing.md) - Comprehensive testing guide

---

**Last Updated:** February 2026
