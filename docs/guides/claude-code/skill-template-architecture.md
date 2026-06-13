---
id: skill-template-architecture
version: "1.0.0"
last_updated: "2026-03-25"
updated_by: "IA: sync-docs"
status: active
type: guide
review_cycle: 60
next_review: "2026-05-24"
owner_role: "Tech Lead"
---

# Skill Template Architecture Guide

> **Comprehensive guide to the autonomous skill template system implemented in the {{CLIENT_NAME}} SDLC ecosystem.**
>
> **Target Audience**: Skill developers, technical leads, and ecosystem maintainers
>
> **Prerequisites**: Basic understanding of Claude Code skills and SDLC concepts

---

## Architecture Overview

The skill template architecture provides **autonomous, self-contained skills** with embedded templates, following progressive disclosure principles while maintaining perfect portability.

### Design Philosophy

1. **Skills as autonomous units** — Each skill contains everything it needs to operate
2. **Progressive disclosure** — Templates loaded only when skill triggers
3. **Pattern-based consistency** — Shared patterns reduce duplication
4. **Version alignment** — Templates evolve with skill logic
5. **Perfect portability** — Skills work in any project without external dependencies

---

## Skill Structure

### Recommended Directory Structure

```
skill-name/
├── SKILL.md                      # ✅ Main skill logic + metadata
├── templates/                    # ✅ Autonomous templates
│   ├── main-template.md         # Primary template
│   ├── secondary-template.md    # Additional templates
│   ├── _patterns/               # Skill-specific patterns
│   │   └── custom-pattern.md
│   └── specs/                   # Subdirectories when needed
│       ├── api-spec.md
│       └── component-spec.md
├── references/                   # 📖 Progressive disclosure docs
│   ├── api-reference.md
│   └── domain-guide.md
├── examples/                     # 💡 Usage examples
│   ├── basic-example.md
│   └── advanced-example.md
├── scripts/                      # 🤖 Automation utilities
│   ├── helper.py
│   └── validator.ts
└── assets/                       # 🎨 Optional resources
    ├── icons/
    └── templates/
```

### Structure Benefits

| Component       | Purpose                 | Loading Strategy              | Benefits                                |
| --------------- | ----------------------- | ----------------------------- | --------------------------------------- |
| **SKILL.md**    | Core logic + navigation | Always loaded                 | Entry point, skill metadata             |
| **templates/**  | Document generation     | On-demand via references      | Autonomous operation, version alignment |
| **references/** | Detailed documentation  | Progressive (when referenced) | Performance, scalability                |
| **examples/**   | Usage demonstrations    | Progressive (when needed)     | Learning, onboarding                    |
| **scripts/**    | Automation utilities    | Executed (not loaded)         | Deterministic tasks, validation         |
| **assets/**     | Visual resources        | Output inclusion              | Branding, visual consistency            |

---

## Template System

### Template Types

#### 1. **Primary Templates**

Main document templates that skills generate:

```
templates/
├── requirement-format.md         # Main output template (note: skill should define its own local templates/)
├── test-plan-format.md          # Secondary output
└── review-checklist.md          # Validation template
```

#### 2. **Pattern-Based Templates**

Templates that inherit from shared patterns:

```markdown
<!-- In templates/enhanced-requirement.md -->

# Enhanced Requirement Template

{@patterns/base-document-header}

## Custom Section

{Skill-specific content}

{@patterns/domain-specific-context}

## Additional Requirements

{Extended functionality}
```

#### 3. **Composite Templates**

Templates that combine multiple patterns:

```markdown
<!-- In templates/complete-prd.md -->

# Complete PRD Template

{@patterns/document-header}
{@patterns/stakeholder-section}
{@patterns/requirements-section}
{@patterns/domain-specific-context}
{@patterns/compliance-section}

## Skill-Specific Sections

{Custom content for this skill}
```

### Template Reference Syntax

#### Local Templates

```markdown
<!-- In SKILL.md -->

Use template `templates/requirement-format.md` for generating requirements.
Load validation checklist from `templates/validation-checklist.md`.
```

#### Pattern References

```markdown
<!-- In templates/*.md -->

{@patterns/base-document-header} # Exact import
{@patterns/domain-specific-context:merge} # Merge with existing
{@patterns/test-coverage} # Import test patterns
```

#### Conditional Templates

```markdown
<!-- In SKILL.md -->

If domain-specific project: use `templates/domain-specific-requirements.md`
If standard project: use `templates/standard-requirements.md`
For compliance needs: also include `templates/gdpr-checklist.md`
```

---

## Pattern System

### Shared Patterns

Located in `.claude/skills/_shared/template-patterns.md`:

#### Core Patterns Available

| Pattern                     | Purpose                                  | Usage                             |
| --------------------------- | ---------------------------------------- | --------------------------------- |
| **base-document-header**    | Standard YAML frontmatter                | All generated documents           |
| **domain-specific-context** | {{CLIENT_NAME}} domain-specific sections | Identity/domain-specific projects |
| **requirements-section**    | Standard requirements format             | Requirement documents             |
| **test-coverage**           | Testing strategy framework               | QA-related skills                 |
| **compliance-section**      | GDPR/eIDAS compliance checks             | Data processing skills            |
| **gate-evaluation**         | Quality gate assessment format           | Gate transition skills            |

#### Pattern Benefits

1. **Consistency** — Same structure across skills
2. **Maintenance** — Update patterns to affect all skills
3. **Domain Expertise** — {{CLIENT_NAME}}-specific patterns encode best practices
4. **Flexibility** — Skills can extend or customize patterns

### Custom Patterns

Skills can define their own patterns in `templates/_patterns/`:

```
epic-breakdown/
├── templates/
│   ├── _patterns/
│   │   ├── epic-structure.md      # Custom pattern
│   │   └── story-mapping.md       # Specialized pattern
│   ├── epic-template.md           # Uses custom patterns
│   └── breakdown-format.md
```

---

## Implementation Patterns

### Skill Development Workflow

#### 1. **Structure Setup**

```bash
# Create autonomous skill structure
mkdir .claude/skills/my-skill
cd .claude/skills/my-skill

# Create core directories
mkdir templates references examples scripts

# Create SKILL.md with frontmatter
touch SKILL.md
```

#### 2. **Template Creation**

```bash
# Create primary template
touch templates/main-template.md

# Add pattern references
echo '{@patterns/base-document-header}' > templates/main-template.md
echo '## Skill-Specific Content' >> templates/main-template.md
```

#### 3. **Reference Updates**

```markdown
<!-- In SKILL.md -->

Generate documents using `templates/main-template.md`.
```

#### 4. **Validation**

```bash
# Validate template structure
npm run validate:templates

# Check skill health
npm run skills:health
```

### Migration from Legacy Structure

#### Before (Legacy)

```markdown
<!-- In SKILL.md -->

Use template `templates/requirement-format.md` (self-contained).
```

#### After (Autonomous)

```markdown
<!-- In SKILL.md -->

Use template `templates/requirement-format.md`.
```

Migration steps:

1. **Create templates** locally in skill/templates/
2. **Update references** in SKILL.md to use local paths
3. **Add patterns** to reduce duplication
4. **Test functionality** with validation scripts

---

## Advanced Features

### Dynamic Template Generation

Skills can generate templates dynamically:

```typescript
// In scripts/generate-template.ts
interface TemplateConfig {
  projectType: "domain-specific" | "standard";
  complexity: "low" | "medium" | "high";
  compliance: string[];
}

function generateTemplate(config: TemplateConfig): string {
  let template = "{@patterns/base-document-header}\n\n";

  if (config.projectType === "domain-specific") {
    template += "{@patterns/domain-specific-context}\n\n";
  }

  if (config.compliance.includes("gdpr")) {
    template += "{@patterns/gdpr-compliance}\n\n";
  }

  return template;
}
```

### Template Inheritance

```markdown
<!-- Base template: templates/base-requirement.md -->

{@patterns/document-header}

## Basic Requirements

{Basic requirement structure}

<!-- Extended template: templates/domain-specific-requirement.md -->

{@templates/base-requirement}

## domain-specific-Specific Requirements

{Additional domain-specific sections}
```

### Conditional Pattern Loading

```markdown
<!-- In templates/adaptive-template.md -->

{@patterns/document-header}

<!-- @if project.domain === 'domain-specific' -->

{@patterns/domain-specific-context}
{@patterns/gdpr-compliance}

<!-- @endif -->

<!-- @if project.criticality === 'high' -->

{@patterns/security-review}

<!-- @endif -->
```

---

## Quality Assurance

### Validation Framework

#### Automated Validation

```bash
# Template structure validation
npm run validate:templates

# Reference integrity check
npm run validate:templates --check-references

# Pattern consistency validation
npm run validate:templates --check-patterns

# Overall skill health assessment
npm run skills:health --export
```

#### Validation Criteria

| Aspect          | Validation Rule                   | Impact |
| --------------- | --------------------------------- | ------ |
| **Structure**   | Required directories exist        | HIGH   |
| **References**  | All template references resolve   | HIGH   |
| **Patterns**    | Pattern syntax is valid           | MEDIUM |
| **Naming**      | Template names follow conventions | LOW    |
| **Maintenance** | Last updated within 90 days       | MEDIUM |

#### Health Metrics

- **Autonomy Score** (0-100%): Measures self-sufficiency
- **Reference Integrity** (0-100%): Template reference accuracy
- **Pattern Usage** (0-100%): Shared pattern adoption
- **Maintenance Status**: Freshness of skill content

### Testing Strategy

#### Unit Testing

```typescript
// Test template generation
describe("TemplateGenerator", () => {
  it("should generate valid templates", () => {
    const template = generateFromPattern("requirements");
    expect(template).toContain("## Requirements");
    expect(template).toHaveValidFrontmatter();
  });
});
```

#### Integration Testing

```bash
# Test skill end-to-end
./scripts/test-skill.sh lidr-requirements
./scripts/test-skill.sh epic-breakdown
```

#### Performance Testing

```bash
# Measure template loading performance
npm run test:performance -- --skills all
```

---

## Migration Guide

### For New Skills

#### Checklist for New Skill Creation

- [ ] Create autonomous directory structure
- [ ] Define primary templates with patterns
- [ ] Add progressive disclosure references
- [ ] Include usage examples
- [ ] Write automation scripts if needed
- [ ] Update SKILL.md with local references
- [ ] Validate with `npm run validate:templates`
- [ ] Test with realistic input data

### For Existing Skills

#### Migration Priority

**High Priority** (migrate first):

- Skills with multiple template references
- Frequently used skills (lidr-requirements, epic-breakdown)
- Skills with complex template dependencies

**Medium Priority**:

- Skills with single template reference
- Domain-specific skills (domain-specific workflows)

**Low Priority** (keep as-is):

- Skills without templates
- Utility skills that reference shared docs

#### Migration Steps

1. **Assessment**

   ```bash
   npm run skills:health --skill target-skill
   ```

2. **Structure Creation**

   ```bash
   mkdir .claude/skills/target-skill/templates
   ```

3. **Template Migration**

   ```bash
   # Note: Central templates/ no longer exists - each skill should define its own local templates/
   # Copy from any existing skill template as reference if needed
   ```

4. **Reference Updates**
   - Edit SKILL.md
   - Replace `@docs/templates/` with `templates/`
   - Add pattern references where appropriate

5. **Validation**

   ```bash
   npm run validate:templates --skill target-skill
   ```

6. **Testing**
   - Test template generation
   - Verify skill functionality
   - Check for broken references

---

## Best Practices

### Template Design

#### ✅ **Good Practices**

```markdown
<!-- Clear structure with patterns -->

{@patterns/document-header}

## Purpose

Clear explanation of template purpose and usage.

## Structure

{Well-defined sections with clear headings}

{@patterns/relevant-domain-pattern}

## Validation

{Built-in validation criteria}
```

#### ❌ **Anti-Patterns**

```markdown
<!-- Avoid -->

- Hardcoded values that should be dynamic
- Deep external dependencies
- Circular pattern references
- Missing validation criteria
- Unclear section purposes
```

### Skill Organization

#### Directory Naming

- Use kebab-case: `epic-breakdown` not `EpicBreakdown`
- Be descriptive: `generate-requirements` not `gen-req`
- Match skill purpose: `architecture-doc` for architecture documentation

#### Template Naming

- Primary template matches skill: `lidr-requirements` → `rf-format.md`
- Descriptive names: `test-plan-template.md` not `template1.md`
- Consistent patterns: `*-template.md`, `*-format.md`, `*-checklist.md`

#### Pattern Usage

- Import shared patterns when available
- Create custom patterns for repeated skill-specific content
- Document pattern dependencies in SKILL.md
- Keep patterns focused and single-purpose

### Performance Optimization

#### Loading Strategy

- Use progressive disclosure for large reference documents
- Keep SKILL.md under 500 lines
- Load templates only when referenced
- Cache pattern resolutions

#### Resource Management

- Minimize template file size
- Use pattern references instead of duplication
- Optimize image assets in assets/ directory
- Clean unused templates regularly

---

## Troubleshooting

### Common Issues

#### "Template not found"

```bash
# Check template exists
ls .claude/skills/my-skill/templates/

# Validate references
npm run validate:templates --skill my-skill

# Check SKILL.md syntax
grep "templates/" .claude/skills/my-skill/SKILL.md
```

#### "Pattern resolution failed"

```bash
# Verify pattern exists
cat .claude/skills/_shared/template-patterns.md

# Check pattern syntax
grep -n "{@patterns/" .claude/skills/my-skill/templates/*.md
```

#### "Low autonomy score"

```bash
# Check health report
npm run skills:health --skill my-skill

# Add missing directories
mkdir references examples scripts

# Add templates (create locally or copy from similar skills)
touch templates/relevant.md
```

### Debug Commands

```bash
# Full skill analysis
npm run skills:health --verbose --skill my-skill

# Template validation with details
npm run validate:templates --verbose --skill my-skill

# Pattern dependency analysis
npm run validate:templates --check-patterns --skill my-skill
```

---

## Performance Metrics

### Ecosystem Health Targets

| Metric                     | Target | Current      | Status   |
| -------------------------- | ------ | ------------ | -------- |
| **Average Autonomy Score** | >80%   | {calculated} | {status} |
| **Skills with Templates**  | >70%   | {calculated} | {status} |
| **Reference Integrity**    | 100%   | {calculated} | {status} |
| **Pattern Adoption**       | >60%   | {calculated} | {status} |

### Individual Skill Targets

| Skill Type              | Autonomy Target | Template Count | Pattern Usage |
| ----------------------- | --------------- | -------------- | ------------- |
| **Document Generators** | 90%+            | 2-5 templates  | High          |
| **Validation Skills**   | 80%+            | 1-3 templates  | Medium        |
| **Utility Skills**      | 60%+            | 0-1 templates  | Low           |

---

## Resources

### Documentation

- [Skill Development Guide](skill-dev.md)
- [Pattern Reference](_shared/template-patterns.md)
- [Validation Framework](../standards/validation-framework.md)

### Tools

- Template validator: `npm run validate:templates`
- Health analyzer: `npm run skills:health`
- Migration helper: `scripts/migrate-skill.ts`

### Examples

- [Complete skill example](../examples/autonomous-skill-example/)
- [Pattern usage examples](../examples/pattern-usage/)
- [Migration examples](../examples/skill-migration/)

---

_The skill template architecture provides the foundation for a scalable, maintainable, and autonomous skill ecosystem that evolves with the {{CLIENT_NAME}} SDLC needs._
