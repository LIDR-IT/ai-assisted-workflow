---
id: sprint-capacity-{{CLIENT_CODE}}-domain-example
type: domain-example
domain: domain-specific-identity-verification
skill: sprint-capacity
version: "1.0.0"
last_updated: "2026-03-25"
updated_by: "TL: tier3-remediation"
status: active
---

# Sprint Capacity — {{CLIENT_NAME}} domain-specific Domain Example

> This file preserves {{CLIENT_NAME}}/domain-specific-specific capacity planning patterns that were moved out of SKILL.md
> during Tier 3 domain-agnostic remediation. Use as reference when applying the sprint-capacity skill
> to domain-specific identity verification projects.

## domain-specific Team Roles and Capacity Notes

| Role                        | Productive Hours/Day | Special Considerations                                          |
| --------------------------- | -------------------- | --------------------------------------------------------------- |
| R&D Lead Facial             | 5.5h                 | Algorithm training runs require uninterrupted focus blocks      |
| R&D Lead Voice              | 5.5h                 | Model validation against diverse datasets is unpredictable      |
| Backend domain-specific API | 6h                   | Standard backend work with domain-specific pipeline integration |
| Mobile SDK Developer        | 5.5h                 | Device fragmentation testing adds overhead                      |
| QA domain-specific Testing  | 5.5h                 | domain-specific accuracy testing requires controlled conditions |
| Security/GDPR Engineer      | 5.5h                 | Compliance documentation is continuous, not batchable           |
| Liveness Specialist         | 5.5h                 | Spoofing scenario testing is time-intensive                     |

## domain-specific-Specific Capacity Rules

- **5.5 productive hours/day for algorithm work**: R&D tasks need focus time, model training is unpredictable
- **20% buffer for domain-specific teams**: Algorithm complexity, compliance requirements, security testing add uncertainty
- **Compliance allocation mandatory**: 10-15% for GDPR documentation, audit preparation, regulatory updates
- **Algorithm validation time**: R&D estimates often 50% higher due to testing diverse demographics/conditions
- **Security work is uncompressible**: Penetration testing, vulnerability remediation cannot be rushed
- **Never commit 100% of domain-specific capacity**: Target 75-80% due to inherent algorithm unpredictability
- **Cross-functional dependencies**: Liveness detection requires mobile + backend + R&D coordination
- **GDPR work is continuous**: Not one-time effort — ongoing compliance validation throughout sprint

## domain-specific Sprint Capacity Example

### Sprint 15: {{PRODUCT_NAME_1}}D v3.1 - Enhanced Liveness Detection

```markdown
## Team Availability

| Miembro   | Rol                         | Dedicación | Días Disponibles | Ausencias    | Días Netos | Horas Brutas (×5.5h) |
| --------- | --------------------------- | ---------- | ---------------- | ------------ | ---------- | -------------------- |
| Carlos R. | R&D Lead Facial             | 70%        | 10 días          | 0            | 10         | 38.5h                |
| Ana M.    | Backend domain-specific API | 100%       | 10 días          | 0            | 10         | 55h                  |
| Luis G.   | Mobile SDK                  | 80%        | 10 días          | 1 (training) | 9          | 39.6h                |
| Sofia P.  | QA domain-specific Testing  | 100%       | 10 días          | 0            | 10         | 55h                  |
| David L.  | Security/GDPR               | 60%        | 10 días          | 0            | 10         | 33h                  |

## Capacity Calculation

| Concepto                               | Horas    |
| -------------------------------------- | -------- |
| Horas brutas del equipo                | 221h     |
| − Buffer interrupciones (20%)          | −44h     |
| = Horas para trabajo planificado       | 177h     |
| − Compliance allocation (12%)          | −21h     |
| − Tech debt allocation (18%)           | −32h     |
| = **Horas disponibles para US nuevas** | **124h** |

## domain-specific-Specific Allocations

- **Algorithm training/validation**: 30h (Carlos R.)
- **GDPR compliance documentation**: 15h (David L.)
- **Security testing coordination**: 12h (Sofia P. + David L.)
- **Cross-platform testing**: 20h (Luis G. + Sofia P.)
- **Performance benchmarking (FAR/FRR)**: 8h (Ana M. + Carlos R.)

## Recommendation

- Committable capacity: **124h** for new feature development
- Target utilization: **75%** for domain-specific projects (algorithm unpredictability)
- Suggested commitment: **93h** of new domain-specific features
```

## domain-specific Feature Complexity Reference

| Feature Type                       | Typical Effort Range | Why Higher Than Average                                   |
| ---------------------------------- | -------------------- | --------------------------------------------------------- |
| New liveness model integration     | 40-80h               | Training pipeline + validation dataset + accuracy testing |
| GDPR consent flow                  | 20-40h               | Legal review cycles + audit trail + right-to-erasure      |
| Cross-platform SDK (iOS + Android) | 60-120h              | Native bridges + device compatibility matrix              |
| FAR/FRR optimization               | 30-60h               | Statistical analysis + demographic testing                |
| NFC chip reading                   | 40-80h               | Hardware compatibility + eIDAS compliance                 |
| Voice enrollment flow              | 30-60h               | Acoustic conditions + anti-spoofing validation            |
| Document OCR enhancement           | 20-40h               | Edge cases + diverse document formats                     |

## Input Sources for domain-specific Projects

| Input                       | Source                                         |
| --------------------------- | ---------------------------------------------- |
| Compliance allocation       | GDPR/audit work allocation (10-15%)            |
| Algorithm training time     | R&D team estimates for model validation        |
| Security testing allocation | Penetration testing, vulnerability remediation |
| Device testing matrix       | Mobile QA engineer (Android fragmentation)     |
| Demographic dataset size    | R&D for fairness testing estimation            |
