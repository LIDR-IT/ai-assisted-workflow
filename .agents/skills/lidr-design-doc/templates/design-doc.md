---
id: design-doc-template
version: "1.0.0"
last_updated: "2026-03-26"
updated_by: "System: Migration"
status: active
type: template
review_cycle: 60
next_review: "2026-05-25"
owner_role: "Tech Lead"
---

# Template: Software Design Document

## Proposito

Documento de diseno de software completo que integra business model, use cases, data model y system design en un unico artefacto autocontenido.

- **Cuando se crea**: Fase 2 (Discovery) como entregable integral
- **Quien lo llena**: TL con input de PO y R&D (orquestado por skill design-doc)
- **Quien lo valida**: PO + TL + R&D Lead
- **Gate asociado**: Gate 1 (PRD Aprobado)
- **Instancias por proyecto**: 1 por producto/sistema

---

## Estructura del Documento

```markdown
---
id: {project-name}-design-doc
version: "1.0.0"
last_updated: "YYYY-MM-DD"
updated_by: "TL: {Name}"
status: active
type: project
review_cycle: 60
next_review: "YYYY-MM-DD"
owner_role: "TL"
---

# {System Name} -- Software Design Document

> Version 1.0 | Generated YYYY-MM-DD

---

## 1. Business Model

[Output from skill business-model]

### 1.1 System Description

[2-3 paragraphs: problem, market, deployment]

### 1.2 Added Value and Competitive Advantages

[5+ concrete differentiators]

### 1.3 Main Features

[Feature table: Feature | Description]

### 1.4 Lean Canvas

[Mermaid graph TB with 9 cells]

---

## 2. Use Cases

[Output from skill use-cases]

### 2.1 [UC-1: Primary Happy Path]

[Description + Mermaid flowchart TD]

### 2.2 [UC-2: Complex Interaction]

[Description + Mermaid flowchart TD]

### 2.3 [UC-3: Compliance/Security]

[Description + Mermaid flowchart TD]

---

## 3. Data Model

[Output from skill architecture-doc data-model template]

### 3.1 Entity Analysis

[For each entity: purpose, fields table, relationships, design decisions]

### 3.2 Entity Relationship Diagram

[Mermaid erDiagram with all entities]

---

## 4. System Design

[Output from skill prd-tecnico system-design template]

### 4.1 Architecture Overview

[2 paragraphs: decomposition, integration, identity]

### 4.2 Service Inventory

[Table: Service | Responsibility | Database | Publishes Events]

### 4.3 High-Level Architecture Diagram

[Mermaid flowchart TB with layered architecture]

---

## Changelog

| Version | Date       | Author     | Changes            |
| ------- | ---------- | ---------- | ------------------ |
| 1.0.0   | YYYY-MM-DD | TL: {Name} | Initial generation |
```

## Assembly Rules

1. Each section produced by its specialist skill
2. No content duplication between sections
3. Every Mermaid diagram in its own fenced block
4. Sections separated by `---` horizontal rules
5. Document must be self-contained -- readable without prior context
6. All class assignments on one line with no padding
