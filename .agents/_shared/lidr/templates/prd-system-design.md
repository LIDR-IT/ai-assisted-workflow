---
id: system-design-template
version: "1.0.0"
last_updated: "2026-03-26"
updated_by: "System: Migration"
status: active
type: template
review_cycle: 60
next_review: "2026-05-25"
owner_role: "Tech Lead"
---

# Template: System Design

## Proposito

Documenta el diseno de sistema de un software: overview de arquitectura, inventario de microservicios, y diagrama de arquitectura de alto nivel en Mermaid.

- **Cuando se crea**: Fase 2 (Discovery) como parte del PRD Tecnico
- **Quien lo llena**: TL / R&D Lead
- **Quien lo valida**: TL + CTO
- **Gate asociado**: Gate 1 (PRD Aprobado)
- **Instancias por proyecto**: 1 por producto/sistema (integrado en prd-tecnico)

---

## Estructura del Documento

````markdown
---
id: {project-name}-system-design
version: "1.0.0"
last_updated: "YYYY-MM-DD"
updated_by: "TL: {Name}"
status: active
type: project
review_cycle: 60
next_review: "YYYY-MM-DD"
owner_role: "TL"
---

# {System Name} -- System Design

## 1. Architecture Overview

[Two paragraphs covering:]

**Paragraph 1 - Decomposition and Data Ownership:**

- Microservices decomposition rationale: how domain boundaries map to services
- Database-per-service pattern: why each service owns its data
- Event-driven integration: transactional outbox pattern, event publishing

**Paragraph 2 - Integration and Identity:**

- Integration model: event schema standard, downstream subscriber pattern
- Identity layer: IdP selection, SSO protocols (OIDC/SAML), multitenancy approach
- Cross-cutting concerns: observability, rate limiting, circuit breakers

## 2. Service Inventory

| Service              | Responsibility                               | Database      | Publishes Events                   |
| -------------------- | -------------------------------------------- | ------------- | ---------------------------------- |
| [service-1]          | [Core workflow domain 1]                     | PostgreSQL    | [event.created, event.updated]     |
| [service-2]          | [Core workflow domain 2]                     | PostgreSQL    | [event.submitted, event.completed] |
| [service-3]          | [Supporting domain]                          | PostgreSQL    | [event.processed]                  |
| event-relay          | Transactional outbox reader, event publisher | Shared outbox | N/A (reads outbox)                 |
| notification-service | Email, SMS, push notifications               | PostgreSQL    | [notification.sent]                |

[Derive one service per major domain boundary. Always include event-relay and notification-service.]

## 3. High-Level Architecture Diagram

```mermaid
flowchart TB
    subgraph ExternalActors[External Actors]
        Users([End Users])
        Staff([Authenticated Staff])
        Integrations([External Systems])
        Subscribers([Event Subscribers])
    end

    subgraph Edge[Edge Layer]
        CDN[CDN / WAF]
        DNS[DNS]
    end

    subgraph Region[Cloud Region]
        subgraph VPC[VPC - Private Subnets]
            subgraph Cluster[Container Orchestration Cluster]
                Mesh[Service Mesh]
                Ingress[Ingress Controller + Auth Proxy]

                subgraph Services[Microservices]
                    SVC1[Service 1]
                    SVC2[Service 2]
                    SVC3[Service 3]
                end

                subgraph Platform[Platform Services]
                    IdP[Identity Provider]
                    Relay[Event Relay]
                end

                subgraph Databases[Databases]
                    DB1[(DB 1)]
                    DB2[(DB 2)]
                    DB3[(DB 3)]
                end
            end
        end

        subgraph Managed[Managed Services]
            EventBus[Event Bus]
            Secrets[Secrets Manager]
            Registry[Container Registry]
            Monitoring[Monitoring]
        end
    end

    Users --> CDN
    Staff --> CDN
    CDN --> Ingress
    Ingress --> Services
    Services --> Databases
    Services -.-> Relay
    Relay -.-> EventBus
    EventBus -.-> Subscribers
    Integrations --> Ingress

    classDef edge fill:#E6F1FB,stroke:#185FA5,color:#0C447C
    classDef svc fill:#E1F5EE,stroke:#0F6E56,color:#085041
    classDef idp fill:#EEEDFE,stroke:#534AB7,color:#3C3489
    classDef managed fill:#FAEEDA,stroke:#854F0B,color:#633806
    classDef db fill:#F1EFE8,stroke:#5F5E5A,color:#444441
    classDef neutral fill:#F1EFE8,stroke:#5F5E5A,color:#444441

    class CDN,DNS edge
    class SVC1,SVC2,SVC3 svc
    class IdP idp
    class EventBus,Secrets,Registry,Monitoring managed
    class DB1,DB2,DB3 db
    class Users,Staff,Integrations,Subscribers neutral
```
````

[Diagram rules:]

- [No em-dashes or en-dashes -- use plain hyphens]
- [No Unicode box-drawing characters]
- [No trailing whitespace on class or classDef lines]
- [All class assignments on one line]
- [Use -.-> for side-channel/dependency arrows, --> for primary data flow]

## Changelog

| Version | Date       | Author     | Changes         |
| ------- | ---------- | ---------- | --------------- |
| 1.0.0   | YYYY-MM-DD | TL: {Name} | Initial version |

```

## Styling Reference

Standard classDef values for system design diagrams:

| Class | Fill | Stroke | Color | Use |
|-------|------|--------|-------|-----|
| edge | #E6F1FB | #185FA5 | #0C447C | Edge/CDN/WAF components |
| svc | #E1F5EE | #0F6E56 | #085041 | Microservice nodes |
| idp | #EEEDFE | #534AB7 | #3C3489 | Identity provider |
| managed | #FAEEDA | #854F0B | #633806 | Cloud managed services |
| db | #F1EFE8 | #5F5E5A | #444441 | Database nodes |
| neutral | #F1EFE8 | #5F5E5A | #444441 | External actors, info nodes |
```
