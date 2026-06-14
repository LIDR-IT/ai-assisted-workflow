---
id: requirements-workflow-nfr
version: "1.0.0"
last_updated: "2026-06-13"
updated_by: "TL: requirements fusion"
status: active
---

# Workflow — Mode: NFR (Non-Functional Requirements)

**When:** the unified PRD's NFR scope exists (cross-cutting NFRs + any feature-specific NFRs — same document as the FRs; BMad has no separate "Technical PRD") and you need measurable, testable NFRs (performance, security, scalability, availability, compliance) before Sprint Planning. **Owner: TL.** Output = one file per NFR (G2 evidence, optional) + a summary matrix. NFRs share the `requirements/` directory with RFs so the RTM builds from one location.

> NFRs are MEASURABLE (metric + threshold + method — never "good performance"), affect architecture (state implications), and are testable. One NFR = one measurable quality. Stop and resume freely.

## Phase 0 — Activate

1. Read `customize.toml` → resolve `{CLIENT_CODE}` + the NFR output path.
2. **Resume check:** scan `docs/projects/{CLIENT_CODE}/requirements/` for `NFR-*.md` whose `status` is not `final`; offer to resume.

## Phase 1 — Input collection

Read the unified PRD's NFR scope (cross-cutting + feature-specific NFR sections), its success metrics, `rules/lidr-sdlc/tech-stack.md` (infra constraints), `rules/lidr-sdlc/org.md` §1.3 (data criticality). Identify the workflows/data flows that drive quality constraints.

## Phase 2 — Domain analysis & regulatory mapping

Map business requirements to compliance mandates (GDPR / HIPAA / PCI-DSS / SOC2…). Derive domain-specific NFR patterns where they apply.

## Phase 3 — Generate per category

Mandatory categories: **Performance · Security · Scalability · Availability · Compliance**. Conditional: Accessibility · Observability · Interoperability · Maintainability · Portability · Accuracy. Use `templates/nfr-format.md` per NFR — each with **baseline, target, max-acceptable** thresholds + measurement method. Write each file (`status: draft`).

## Phase 4 — Performance modeling & cross-reference

Model expected throughput under peak load. Cross-reference each NFR to the RFs it constrains (`NFR → RF` impact). Document validation scenarios (normal / stress / failure). Update `status: in-progress`.

## Phase 5 — Security & architecture implications

Define encryption, access control, audit for sensitive data. Document architectural implications (caching, CDN, DB tuning, replication) + dependencies (infra, third parties, team).

## Phase 6 — Summary & validate

Generate `nfr-summary-matrix.md` (NFR↔RF + risk). Run `checklists/nfr-compliance.md`. Set every NFR + matrix `status: final`. Output: `docs/projects/{CLIENT_CODE}/requirements/NFR-{PROJ}-{CAT}-{NNN}.md` + `nfr-summary-matrix.md`. Audited by `bmad-testarch-nfr`; feeds the **validate** mode (RTM).
