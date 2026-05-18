# SDLC Validation Framework

Sophisticated validation scripts for critical SDLC phases and quality gates. This framework provides automated quality checks with actionable feedback for skills, documents, and processes.

## Overview

The validation framework consists of:

- **5 Shared Master Validators** - Core validation logic for cross-cutting concerns
- **12+ Skill-Specific Validators** - Deep domain validation for critical SDLC skills
- **Validation Orchestrator** - Unified interface for running validation suites

## Shared Master Validators

### 1. BDD Patterns Validator (`validate-bdd-patterns.ts`)

Validates Given/When/Then format compliance in acceptance criteria.

**Key Features:**

- Context, action, and outcome clause validation
- Multi-language support (English/Spanish)
- Quality scoring (0-5 scale)
- Specific suggestions for improvement

**Usage:**

```bash
npm run validate:bdd-patterns path/to/document.md
```

### 2. Acceptance Criteria Validator (`validate-acceptance-criteria.ts`)

Validates SMART criteria compliance and testability.

**Key Features:**

- SMART criteria assessment (Specific, Measurable, Achievable, Relevant, Testable)
- Vague language detection
- Measurability validation
- BDD format compliance

**Usage:**

```bash
npm run validate:acceptance-criteria path/to/requirements.md
```

### 3. Skill Completeness Validator (`validate-skill-completeness.ts`)

Validates that each skill has all required sections and follows ecosystem standards.

**Key Features:**

- Required section validation (8 mandatory sections)
- Frontmatter YAML validation
- File structure validation (examples/, reference/, scripts/)
- Cross-reference validation
- Automation indicator validation

**Usage:**

```bash
npm run validate:skill-completeness path/to/skill/directory
```

### 4. Domain Agnostic Validator (`validate-domain-agnostic.ts`)

Ensures skills and documents are portable across organizations and domains.

**Key Features:**

- Domain-specific term detection (biometric, company, regulation)
- Hardcoded value detection (emails, URLs, paths)
- Portability scoring
- Generic alternative suggestions

**Usage:**

```bash
npm run validate:domain-agnostic path/to/document.md
```

### 5. Ecosystem Coherence Validator (`validate-ecosystem-coherence.ts`)

Validates consistency across skills, commands, templates, and documentation.

**Key Features:**

- Cross-reference validation across entire ecosystem
- Naming convention consistency
- Version alignment validation
- Template standardization
- Orphaned artifact detection

**Usage:**

```bash
npm run validate:ecosystem-coherence .claude/
```

## Skill-Specific Validators

### Epic Breakdown Validator (`skills/epic-breakdown/scripts/validate-epics.ts`)

Validates epic decomposition quality for Phase 3→4 transition.

**Key Features:**

- Epic sizing validation (story points)
- Dependency chain validation (circular dependency detection)
- Requirements traceability validation
- Acceptance criteria quality assessment
- SMART epic validation

**Usage:**

```bash
npm run validate:epic-breakdown path/to/epic-breakdown.md [requirements.md]
```

**Epic Structure Expected:**

```markdown
# Master Epic Title

## Description

Epic overview and business value...

## Sub-Epic 1: Feature Implementation

### Criterios de Aceptación

- AC1: Clear, testable criteria
- AC2: Measurable success conditions

Tamaño: 13
Prioridad: Alta
Epic: master-epic
RF: RF-001, RF-002

## Sub-Epic 2: Integration Phase

...
```

### User Stories Validator (`skills/user-stories/scripts/validate-user-stories.ts`)

Validates BDD format, INVEST criteria, and traceability for user stories.

**Key Features:**

- Actor/Action/Value format validation
- INVEST criteria compliance (Independent, Negotiable, Valuable, Estimable, Small, Testable)
- BDD acceptance criteria validation
- Story sizing validation (Fibonacci scale)
- Slicing pattern validation (8 proven patterns)

**Usage:**

```bash
npm run validate:user-stories path/to/stories.md [epic.md] [requirements.md]
```

**Story Structure Expected:**

```markdown
## Historia de Usuario 1:

Como usuario, quiero autenticarme biométricamente para acceder de forma segura a mi cuenta.

### Criterios de Aceptación

- Dado que el usuario tiene perfil biométrico registrado
- Cuando presenta su rostro al dispositivo
- Entonces el sistema valida la identidad y concede acceso

Tamaño: 5
Prioridad: Alta
Epic: authentication-epic
RF: RF-015
Slicing Pattern: happy-sad-paths
```

### Sprint Capacity Validator (`skills/sprint-capacity/scripts/validate-sprint-commitment.ts`)

Validates capacity vs commitment alignment and team sustainability.

**Key Features:**

- Team composition validation
- Capacity calculation verification
- Buffer validation (15-25% recommended)
- Commitment vs historical velocity analysis
- Sustainability assessment
- Role coverage and specialization balance

**Usage:**

```bash
npm run validate:sprint-capacity path/to/capacity.md [velocity-history.json]
```

**Capacity Structure Expected:**

```markdown
# Sprint Capacity Plan

Sprint Length: 10 days

## Team

| Name       | Role      | Hours | Efficiency | Unavailable | Specializations     |
| ---------- | --------- | ----- | ---------- | ----------- | ------------------- |
| Ana García | Developer | 70    | 0.85       | 10          | React, Node.js      |
| Luis López | QA        | 60    | 0.80       | 5           | Testing, Automation |

Buffer: 25 hours
Commitment: 180 hours
```

## Validation Orchestrator

The central orchestrator (`index.ts`) provides a unified interface for running validation suites.

### Usage Patterns

**Single Validation:**

```bash
# Validate a single skill
tsx .claude/_shared/validators/index.ts .claude/skills/epic-breakdown skill

# Validate BDD patterns in a document
tsx .claude/_shared/validators/index.ts path/to/document.md bdd

# Validate domain-agnostic patterns
tsx .claude/_shared/validators/index.ts .claude/skills/user-stories domain
```

**Full Suite:**

```bash
# Run all appropriate validations
tsx .claude/_shared/validators/index.ts .claude/ all
```

**Custom Suites:**

```typescript
import { runValidationSuite } from ".claude/_shared/validators/index.js";

const result = await runValidationSuite(".claude/skills/epic-breakdown", {
  skillValidation: true,
  domainAgnosticValidation: true,
  bddCompliance: true,
  acceptanceCriteriaQuality: true,
});
```

## Validation Results Format

All validators return standardized results:

```typescript
interface ValidationResult {
  success: boolean; // Overall pass/fail
  score: number; // 0-5 quality score
  issues: ValidationIssue[]; // Detailed issues with suggestions
  metadata: {
    validator: string;
    timestamp: string;
    fileCount?: number;
  };
}

interface ValidationIssue {
  severity: "error" | "warning" | "info";
  message: string;
  context?: string; // Additional context
  lineNumber?: number; // Line number if applicable
  suggestion?: string; // Actionable suggestion
  ruleId: string; // Unique rule identifier
}
```

## Scoring System

All validators use a consistent 0-5 scoring system:

- **5.0** - Excellent: Exceeds all standards
- **4.0** - Good: Meets all standards with minor issues
- **3.0** - Satisfactory: Meets basic standards
- **2.0** - Needs Improvement: Major issues present
- **1.0** - Poor: Critical issues, major rework needed
- **0.0** - Failure: Cannot be validated or completely broken

## Integration Points

### Commands Integration

Validators are integrated with commands for automated quality gates:

- `/advance-gate` - Uses validators for gate evaluation
- `/validate-requirements` - Orchestrates RF/NFR validation
- `/prepare-testing` - Validates test plan quality
- `/validate-prd` - Uses multiple validators for PRD assessment

### Hook Integration

Validators are used in hooks for automatic quality enforcement:

- `dtc-write-guard` - Validates content before writing
- `dtc-session-check` - Validates ecosystem coherence at session end

### NPM Scripts

All validators are exposed as npm scripts for easy CLI usage:

```json
{
  "validate:epic-breakdown": "tsx .claude/skills/epic-breakdown/scripts/validate-epics.ts",
  "validate:user-stories": "tsx .claude/skills/user-stories/scripts/validate-user-stories.ts",
  "validate:sprint-capacity": "tsx .claude/skills/sprint-capacity/scripts/validate-sprint-commitment.ts",
  "validate:bdd-patterns": "tsx .claude/_shared/validators/validate-bdd-patterns.ts",
  "validate:ecosystem-coherence": "tsx .claude/_shared/validators/validate-ecosystem-coherence.ts"
}
```

## Extension Points

### Adding New Validators

1. Create validator script in appropriate skill directory:

```typescript
export async function validateCustomLogic(
  inputPath: string,
  options: CustomOptions = {}
): Promise<ValidationResult> {
  // Validation logic here
}
```

2. Add to package.json scripts
3. Integrate with orchestrator if needed

### Custom Validation Rules

Validators support custom rules through configuration:

```typescript
const result = await validateUserStories(storiesPath, {
  maxStorySize: 21,           // Custom story size limit
  requireINVEST: true,        // Enforce INVEST criteria
  customSlicingPatterns: [...] // Additional slicing patterns
});
```

## Performance Considerations

- **Parallel Validation**: Multiple validators can run in parallel
- **Incremental Validation**: Only validate changed files
- **Caching**: Validation results are timestamped for caching
- **Memory Efficiency**: Large files are streamed, not loaded entirely

## Quality Metrics

The validation framework tracks quality metrics across the ecosystem:

- **Validation Coverage**: % of artifacts with validation
- **Score Distribution**: Average scores by validator type
- **Issue Trends**: Tracking improvement over time
- **Automation ROI**: Time saved through automated validation

## Best Practices

### For Skill Authors

1. Run skill-specific validators before committing
2. Aim for scores ≥ 4.0 for production skills
3. Address all ERROR severity issues
4. Use suggestions to improve quality

### For Teams

1. Integrate validators into CI/CD pipeline
2. Set quality gates based on validation scores
3. Track trends and celebrate improvements
4. Customize validators for domain-specific needs

### For Ecosystem Maintenance

1. Regularly update validation rules based on learnings
2. Add new validators for emerging quality concerns
3. Monitor validation performance and optimize
4. Collect feedback and iterate on validation logic

## Contributing

When adding new validators:

1. Follow the established patterns and interfaces
2. Include comprehensive documentation
3. Add npm scripts for CLI usage
4. Write examples for expected input formats
5. Test with real project data
6. Consider performance impact for large ecosystems

## Troubleshooting

### Common Issues

**Validation Fails to Run:**

- Check file paths are correct and accessible
- Verify TypeScript compilation works
- Check for missing dependencies

**Low Scores with Unclear Issues:**

- Review specific issue suggestions
- Check rule documentation for context
- Run validators individually for detailed output

**Performance Issues:**

- Use selective validation for large ecosystems
- Consider running validators in parallel
- Check for memory leaks in custom validators

**Integration Issues:**

- Verify npm script configuration
- Check TypeScript module resolution
- Test CLI usage independently

For additional support, check the validation logs and issue suggestions for actionable guidance.
