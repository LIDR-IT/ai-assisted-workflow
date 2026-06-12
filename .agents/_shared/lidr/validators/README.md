# SDLC Validation Framework

Automated quality validators for LIDR SDLC artifacts: skills, requirements, BDD scenarios, domain-agnosticism, and full-ecosystem coherence.

**Location:** `.agents/_shared/lidr/validators/` (5 master validators + orchestrator + MCP audit + types)

## Files (3,482 LOC total)

| File                              | LOC | Purpose                                                              |
| --------------------------------- | --- | -------------------------------------------------------------------- |
| `index.ts`                        | 460 | Validation orchestrator + `runValidationSuite()` + CLI               |
| `types.ts`                        | 85  | Shared TypeScript types: `ValidationResult`, `ValidationIssue`, etc. |
| `validate-bdd-patterns.ts`        | 247 | Given/When/Then format compliance                                    |
| `validate-acceptance-criteria.ts` | 361 | SMART criteria + measurability + testability                         |
| `validate-skill-completeness.ts`  | 471 | Skill structure (8 mandatory sections + frontmatter + references)    |
| `validate-domain-agnostic.ts`     | 453 | Detects hardcoded domain terms (biometric, company names, regs)      |
| `validate-ecosystem-coherence.ts` | 626 | Cross-artifact consistency (naming, versions, refs, orphans)         |
| `ecosystem-validation.ts`         | 414 | Pre-write + gate-advancement validators (used by hooks)              |
| `mcp-stability-audit.ts`          | 365 | MCP server health audit                                              |

## Architecture

```
.agents/_shared/lidr/validators/
├── index.ts                          # Orchestrator + CLI
├── types.ts                          # Shared types
├── validate-*.ts                     # 5 master validators
├── ecosystem-validation.ts           # Hook-callable validators
└── mcp-stability-audit.ts            # MCP infrastructure check
```

Each validator returns a `ValidationResult`:

```typescript
interface ValidationResult {
  success: boolean; // Overall pass/fail
  score: number; // 0-5 quality score
  issues: ValidationIssue[];
  metadata?: { validator: string; timestamp: string; fileCount?: number };
}

interface ValidationIssue {
  severity: "error" | "warning" | "info";
  message: string;
  context?: string;
  lineNumber?: number;
  suggestion?: string; // Actionable next step
  ruleId: string; // Unique rule identifier
}
```

## Scoring (consistent across all validators)

| Score | Meaning                                       |
| ----- | --------------------------------------------- |
| 5.0   | Excellent — exceeds standards                 |
| 4.0   | Good — meets standards with minor issues      |
| 3.0   | Satisfactory — meets basic standards          |
| 2.0   | Needs improvement — major issues              |
| 1.0   | Poor — critical issues, major rework needed   |
| 0.0   | Failure — cannot be validated or fully broken |

## CLI usage (via npm scripts in `app/package.json`)

All scripts run from the `app/` directory and reference `../.agents/...`:

```bash
cd app/

# Cross-cutting validators
npm run validate:bdd-patterns           # Given/When/Then compliance
npm run validate:acceptance-criteria    # SMART criteria + measurability
npm run validate:skill-completeness     # Skill structure compliance
npm run validate:domain-agnostic        # Portability check
npm run validate:ecosystem-coherence    # Full ecosystem consistency

# Skill-specific validators (some skills bundle their own)
npm run validate:epic-breakdown          # Sub-epic sizing + dependencies
npm run validate:user-stories            # INVEST + BDD + slicing patterns
npm run validate:sprint-capacity         # Buffer + commitment + sustainability

# App-level validators (coherence with React UI)
npm run validate:coherence               # Detects hardcoded values vs centralized data
npm run validate:templates               # Skill template integrity
npm run validate:examples                # All skill examples
```

## Direct tsx invocation (from repo root)

```bash
# Validate a single skill
tsx .agents/_shared/lidr/validators/index.ts .agents/skills/lidr-user-stories skill

# Validate BDD patterns in a document
tsx .agents/_shared/lidr/validators/index.ts path/to/document.md bdd

# Validate domain-agnostic portability
tsx .agents/_shared/lidr/validators/index.ts .agents/skills/lidr-user-stories domain

# Full suite on a target
tsx .agents/_shared/lidr/validators/index.ts .agents/ all
```

## Programmatic usage

```typescript
import { runValidationSuite } from "./.agents/_shared/lidr/validators/index.js";

const result = await runValidationSuite(".agents/skills/lidr-user-stories", {
  skillValidation: true,
  domainAgnosticValidation: true,
  bddCompliance: true,
  acceptanceCriteriaQuality: true,
});

console.log(`Score: ${result.averageScore}, Pass: ${result.overallSuccess}`);
```

## Per-validator details

### `validate-bdd-patterns.ts`

Validates Given/When/Then format in acceptance criteria.

- Context (Given), action (When), outcome (Then) clauses
- Multi-language (English/Spanish: Dado/Cuando/Entonces)
- Quality scoring with specific suggestions

### `validate-acceptance-criteria.ts`

SMART criteria assessment.

- Specific, Measurable, Achievable, Relevant, Testable
- Vague language detection ("should", "must", "various")
- Measurability validation (concrete units required)
- BDD format compliance

### `validate-skill-completeness.ts`

Validates each skill has required structure.

- 8 mandatory sections in `SKILL.md`
- YAML frontmatter validation (`name`, `description` required)
- File structure: `examples/`, `references/`, `scripts/`
- Cross-reference validation (referenced files exist)
- Automation indicator validation

### `validate-domain-agnostic.ts`

Ensures skills are portable across clients.

- Detects hardcoded domain terms (biometric, KYC, specific company names, regulations)
- Detects hardcoded paths/URLs/emails
- Suggests generic alternatives + portability score
- Critical for LIDR's multi-client architecture

### `validate-ecosystem-coherence.ts`

Validates consistency across the full ecosystem.

- Cross-reference validation (skill A references skill B → check B exists)
- Naming convention consistency (`lidr-*` prefix)
- Version alignment across artifacts
- Template standardization
- Orphaned artifact detection

### `ecosystem-validation.ts`

Hook-callable validators (used by `validate-ecosystem-counts.sh` Stop hook):

- `validateEcosystemHealth()` — counts vs source-of-truth claims
- `validateBeforeWrite()` — pre-write content check (PreToolUse hook)
- `validateForGateAdvancement()` — gate-pass evaluation

## Integration points

### Hook integration

- **`validate-ecosystem-counts.sh`** (Stop hook) calls `ecosystem-validation.ts` to check ecosystem counts at session end
- **`frontmatter-guard.sh`** (PreToolUse hook) — independent bash; could be replaced by `validateBeforeWrite()` for richer checks

### Command integration

Commands that orchestrate validators:

- `/lidr-advance-gate` — gate-pass evaluation
- `/lidr-validate-requirements` — RFs + NFRs + RTM coherence (delegates to the `lidr-requirements` validate mode)
- `/lidr-validate-prd` — PRD scoring + recommendations
- `/lidr-prepare-testing` — test plan quality

## Adding a new validator

1. Create `.agents/_shared/lidr/validators/validate-<name>.ts`:

   ```typescript
   import { ValidationResult, ValidationSeverity } from "./types.js";

   export async function validateCustomLogic(input: string): Promise<ValidationResult> {
     const issues = [];
     // ... validation logic ...
     return {
       success: issues.filter((i) => i.severity === "error").length === 0,
       score: 4.5,
       issues,
       metadata: { validator: "custom-logic", timestamp: new Date().toISOString() },
     };
   }
   ```

2. Re-export from `index.ts`:

   ```typescript
   export * from "./validate-<name>.js";
   ```

3. Add npm script to `app/package.json`:

   ```json
   "validate:custom-logic": "tsx ../.agents/_shared/lidr/validators/validate-<name>.ts"
   ```

4. (Optional) Integrate with `runValidationSuite()` by adding a `customLogicValidation` flag to `ValidationSuite`.

## Best practices

- **For skill authors:** aim for score ≥ 4.0 before merging
- **For CI:** integrate as a quality gate (`npm run validate:ecosystem-coherence`)
- **For maintenance:** run `npm run validate:domain-agnostic` quarterly to catch hardcoded client terms

## Troubleshooting

| Symptom                               | Cause                                     | Fix                                                           |
| ------------------------------------- | ----------------------------------------- | ------------------------------------------------------------- |
| `Cannot find module` on `.js` import  | TS source imports `.js` paths (ESM)       | Keep `.js` extension; tsx resolves correctly                  |
| `tsx: command not found`              | Not installed in `app/`                   | `cd app && npm install`                                       |
| Wrong path in npm script              | Was `.claude/_shared/validators/...`      | Now `../.agents/_shared/lidr/validators/...` (fixed May 2026) |
| Skill validator can't find `SKILL.md` | Wrong skill name (missing `lidr-` prefix) | All LIDR skills use `lidr-*` prefix                           |

## References

- Master validators: this directory
- Per-skill validators: `.agents/skills/<name>/scripts/validate-*.ts`
- App-level validators: `app/scripts/validate-*.ts`
- Hook validators: `.agents/hooks/scripts/validate-ecosystem-counts.sh`
