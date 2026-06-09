---
id: tpl-adr
version: "1.1.0"
last_updated: "2026-06-09"
updated_by: "TL: lang+tool agnostic"
status: active
---

# ADR Template (MADR v3)

> **Usage**: Architecture Decision Record in MADR format. Used by the `adr` skill.
> **Gate**: Cross-cutting (mainly Phase 5 — Development)

---

## ADR-{NNNN}: {Decision Title}

### Status

{proposed | accepted | deprecated | superseded by ADR-NNNN}

### Date

{YYYY-MM-DD}

### Context

{Describe the technical and business context that motivates this decision. Include constraints, relevant requirements (RF/NFR) and current system state.}

### Problem

{State the architectural question or problem that needs resolution. Example: "We need to decide how to manage session state in a distributed system."}

### Decision Drivers

- {Driver 1: e.g. performance under load (NFR-003)}
- {Driver 2: e.g. team developer experience}
- {Driver 3: e.g. license cost}
- {Driver 4: e.g. compatibility with existing stack}

### Considered Options

#### Option 1: {name}

- **Pros**: {advantages}
- **Cons**: {disadvantages}

#### Option 2: {name}

- **Pros**: {advantages}
- **Cons**: {disadvantages}

#### Option 3: {name}

- **Pros**: {advantages}
- **Cons**: {disadvantages}

### Decision

We choose **Option {N}: {name}** because {justification tied to the decision drivers}.

### Consequences

#### Positive

- {positive consequence 1}
- {positive consequence 2}

#### Negative

- {negative consequence 1 + planned mitigation}

#### Neutral

- {neutral consequence / accepted trade-off}

### Links

- Related RF/NFR: {RF-NNN, NFR-NNN}
- Source PRD: {PRD-T section N / PRD-F section N}
- Related ADRs: {ADR-NNNN (if applicable)}
- {{TRACKING_TOOL}} ticket: {PROJ-NNN}
