# Skill Template

This is a copy-paste template for creating new skills within the `.agents/` system.

## How to Use This Template

1. Copy the template below
2. Replace all `[PLACEHOLDERS]` with your specific content
3. Create your skill directory: `.agents/skills/[skill-name]/`
4. Save as `SKILL.md` in your skill directory
5. Add bundled resources (scripts/, references/, assets/) as needed
6. Run sync: `./.agents/sync-all.sh`

---

## Template Content

```markdown
---
name: [skill-name]
description: This skill should be used when the user asks to "[trigger phrase 1]", "[trigger phrase 2]", "[trigger phrase 3]". [Add context about what the skill provides and when to use it].
version: 0.1.0
---

# [Skill Title]

[Brief introduction explaining what this skill does and why it's useful]

## Overview

[Detailed description of the skill's purpose and capabilities]

## Quick Start

[Minimal example to get started]

```[language]
# Example code or command
[code example]
```

## Usage Patterns

### [Pattern 1 Name]

[Description of first usage pattern]

**Example:**
```[language]
[code example]
```

### [Pattern 2 Name]

[Description of second usage pattern]

**Example:**
```[language]
[code example]
```

## Bundled Resources

### Scripts

- **`scripts/[script-name].sh`** - [Description of what script does]
- **`scripts/[another-script].py`** - [Description]

Usage:
```bash
[how to use the script]
```

### References

- **`references/[reference-name].md`** - [Description of reference doc]
- **`references/[another-reference].md`** - [Description]

When to read:
- Read [reference-name].md when [specific condition]
- Read [another-reference].md when [another condition]

### Assets

- **`assets/[template-name].tsx`** - [Description of template]
- **`assets/[another-asset].png`** - [Description]

How to use:
- Copy `assets/[template-name].tsx` and modify for [purpose]
- Use `assets/[another-asset].png` in [context]

## Examples

### Example 1: [Example Title]

[Description of example scenario]

**Setup:**
```[language]
[setup code]
```

**Usage:**
```[language]
[usage code]
```

**Result:**
[What the result should be]

### Example 2: [Another Example Title]

[Description of second example]

**Setup:**
```[language]
[setup code]
```

**Usage:**
```[language]
[usage code]
```

**Result:**
[Expected result]

## Advanced Features

### [Advanced Feature 1]

[Description of advanced feature]

For detailed information, see `references/[detailed-guide].md`

### [Advanced Feature 2]

[Description of another advanced feature]

For implementation details, see `references/[implementation-guide].md`

## Common Patterns

### Pattern: [Pattern Name]

[When to use this pattern]

**Implementation:**
```[language]
[code example showing pattern]
```

### Pattern: [Another Pattern Name]

[When to use this second pattern]

**Implementation:**
```[language]
[code example]
```

## Troubleshooting

### Issue: [Common Problem 1]

**Symptoms:** [How to recognize this issue]

**Solution:**
```[language]
[solution code or steps]
```

### Issue: [Common Problem 2]

**Symptoms:** [How to identify]

**Solution:**
```[language]
[solution]
```

## Best Practices

- ✅ [Best practice 1]
- ✅ [Best practice 2]
- ✅ [Best practice 3]
- ❌ [Anti-pattern to avoid 1]
- ❌ [Anti-pattern to avoid 2]

## References

**Detailed guides:**
- `references/[guide-name].md` - [Description]
- `references/[another-guide].md` - [Description]

**Templates:**
- `assets/[template-name]` - [Description]
- `assets/[another-template]` - [Description]

**Scripts:**
- `scripts/[script-name]` - [Description]
- `scripts/[another-script]` - [Description]

## Related

**See also:**
- [Related skill name] - [Why it's related]
- [Another related skill] - [Connection]

**External resources:**
- [External doc/tool name](URL) - [Why it's useful]
- [Another external resource](URL) - [Purpose]
```

---

## Customization Tips

### Frontmatter

**name:**
- Use lowercase, hyphens
- Be descriptive: `react-testing`, not `rt`
- Example: `database-queries`, `api-integration`

**description:**
- MUST use third person: "This skill should be used when..."
- MUST include trigger phrases: Exact words users would say
- Include 3-5 trigger phrases minimum
- Add context about skill capabilities
- Length: 1-3 sentences, ~50-150 words

**Example good description:**
```yaml
description: This skill should be used when the user needs to "test React components", "write React tests", "test hooks", "test async components", or "set up testing environment". Provides testing patterns, Jest/RTL templates, and test boilerplate generation for React component and hook testing.
```

### Body Structure

**Keep SKILL.md lean:**
- Target: 400-700 lines
- Maximum: 5,000 lines (but split earlier)

**Move details to references:**
- Detailed docs → `references/`
- Complex examples → `examples/`
- Executable code → `scripts/`
- Templates/assets → `assets/`

**Reference from SKILL.md:**
```markdown
For detailed schema documentation, see `references/schema.md`
For complete examples, see `examples/advanced-usage.md`
```

### Bundled Resources

**Only include what's necessary:**
- ✅ Scripts that would be rewritten repeatedly
- ✅ References needed while working
- ✅ Templates/assets used in output
- ❌ General documentation (already in training data)
- ❌ One-time use files

**Organize clearly:**
```
skill-name/
├── SKILL.md
├── scripts/          (if needed)
│   └── utility.sh
├── references/       (if needed)
│   └── detailed-guide.md
├── assets/           (if needed)
│   └── template.tsx
└── examples/         (if needed)
    └── usage-examples.md
```

## Minimal Skill Example

For simple skills, you can use a minimal structure:

```markdown
---
name: simple-skill
description: This skill should be used when the user asks to "do simple task". Provides simple functionality.
version: 0.1.0
---

# Simple Skill

Brief explanation of what this skill does.

## Usage

[Quick usage example]

## Example

[Single concrete example]
```

**No bundled resources needed** if skill is purely instructional.

## Complete Real Example

See `.agents/skills/team-skill-creator/` for a complete, real implementation of this template with:
- ✅ Comprehensive SKILL.md (~680 lines)
- ✅ 5 reference files in `references/`
- ✅ 3 example templates in `examples/`
- ✅ 3 validation scripts in `scripts/`

Study that skill to understand how to structure a full-featured skill.
