---
id: refinement-notes
version: "1.1.0"
last_updated: "2026-03-25"
updated_by: "System: Domain-Agnostic Normalization"
status: active
phase: 4
owner_role: "TL"
automation: false
domain_agnostic: true
description: "Essential for user story refinement - ALWAYS use during backlog grooming sessions for any sprint-ready assessment. CRITICAL for capturing domain-specific decisions including accuracy requirements, compliance clarifications, performance thresholds, and cross-platform compatibility needs. Use when refining user stories, verifying acceptance criteria, or capturing technical decisions in refinement sessions. Domain-agnostic — works for any project type, technology stack, or industry vertical."
---

# Refinement Notes Structurer

Phase: 4 — Sprint Planning | Language: Spanish

## Workflow

1. **Read US** discussed in session (Jira backlog, prioritized by PO)
2. **Capture domain-specific decisions**:
   - Accuracy or quality thresholds (precision, performance targets)
   - Performance targets (response time, throughput)
   - Compliance requirements and data handling specifics
   - Cross-platform compatibility needs (iOS/Android/Web/Desktop)
   - System support and fallback mechanisms
3. **Record per US**: estimate considering domain complexity, DoR status, technical blockers
4. **Clarify acceptance criteria**: BDD scenarios for domain workflows with concrete test data
5. **Validate compliance requirements**: Consent flows, data retention, deletion workflows (if applicable)
6. **Generate action items**: Validation tasks, security review, compliance documentation
7. **Flag readiness**: "sprint-ready" vs "needs further investigation" vs "compliance review pending"

## Input

| Input                       | Required  | Source                   |
| --------------------------- | --------- | ------------------------ |
| US discussed (IDs + titles) | ✅        | Jira backlog             |
| Session notes or transcript | ✅        | Facilitator / recording  |
| Participants                | ✅        | Attendance               |
| Sprint capacity             | Desirable | skill `sprint-capacity/` |
| DoR checklist               | Desirable | checklists/dor.md        |

## Output Template

```markdown
# Refinement Notes — [DD/MM/YYYY]

| Campo           | Valor                        |
| --------------- | ---------------------------- |
| **Sesión**      | Refinement #{N} — Sprint {N} |
| **Fecha**       | [YYYY-MM-DD HH:MM]           |
| **Facilitador** | [SM]                         |
| **Asistentes**  | [Names + roles]              |
| **Duración**    | [Xh Xmin]                    |

## US Discutidas

### US-{PROJ}-{NNN}: {Title}

| Campo          | Valor                                   |
| -------------- | --------------------------------------- |
| **Estimación** | [X]h (rango: [min]-[max]h)              |
| **Prioridad**  | Must / Should / Could                   |
| **DoR Status** | ✅ Ready / ⚠️ Needs work / ❌ Not ready |
| **Blockers**   | [None / description]                    |

**Decisiones:**

- [Decision 1 — what was agreed]
- [Decision 2]

**Dudas resueltas:**

- Q: [question] → A: [answer, who answered]

**Preguntas abiertas:**

- [Open question — owner to resolve by date]

**Cambios al scope/criteria:**

- [What changed from original US]

---

[Repeat for each US]

## Resumen de Sesión

| US       | Estimación | DoR      | Sprint-Ready? |
| -------- | ---------- | -------- | ------------- |
| US-{NNN} | {X}h       | ✅/⚠️/❌ | Yes/No        |

## Action Items

| #   | Acción | Responsable | Fecha Límite |
| --- | ------ | ----------- | ------------ |

## Próxima Sesión

- **Fecha**: [next refinement date]
- **US a discutir**: [backlog items for next session]
```

## Key Rules

- **Domain estimates have wider ranges**: Complex domain work has higher uncertainty (2x-3x factor common)
- **Performance thresholds are mandatory**: Every US with performance requirements needs concrete latency/accuracy targets
- **Compliance is non-negotiable**: Every US handling sensitive data needs compliance validation
- **Testing scope defined**: Which devices/OS versions, platforms, or environments are in scope vs. out of scope
- **Fallback mechanisms clarified**: What happens when a primary path fails or a dependency is unavailable
- **Cross-functional dependencies explicit**: Research/algorithm work, security review, compliance validation
- **Test data requirements**: Diverse datasets, edge cases, and negative scenario needs defined
- **Regulatory context documented**: Which compliance frameworks apply (e.g., GDPR, PSD2, HIPAA, SOC2)

## Domain Example

See `examples/domain-example.md` for a detailed refinement session example from an identity verification project (featuring complex workflow features and regulatory compliance workflows).

## Quality Assurance

### Validation Script

This skill includes automated validation via `scripts/validate-examples.ts`:

```bash
# Validate skill examples and structure
npx tsx scripts/validate-examples.ts
```

**Validation includes:**

- Example completeness and correctness
- Refinement compliance patterns
- Progressive disclosure adherence
- Resource organization standards

**When to use:**

- Before skill release/packaging
- In CI/CD pipeline (quality gates)
- After major example updates
- During skill maintenance cycles

**Integration with ecosystem:**

- Used by `/multi-agent-audit` for ecosystem validation
- Supports quality gates in SDLC workflow
- Provides consistent validation across all skills
