---
id: saas-system-design-example
version: "1.0.0"
last_updated: "2026-03-26"
updated_by: "TL: System Design Integration"
status: active
type: example
---

# SaaS Collaboration Platform -- System Design

## 1. Architecture Overview

The SaaS Collaboration Platform follows a microservices decomposition aligned with bounded contexts from domain-driven design. Each service owns its data exclusively through a database-per-service pattern, ensuring loose coupling and independent deployability. Inter-service communication uses an event-driven integration layer backed by a managed event bus, enabling asynchronous workflows such as notification dispatch, search indexing, and audit trail generation without introducing synchronous call chains between services.

The identity layer provides centralized authentication and authorization through an internal Identity Provider (IdP) that supports both OIDC and SAML federation. All inbound traffic passes through an API gateway responsible for TLS termination, rate limiting, and JWT validation before reaching service endpoints. This architecture allows each service team to develop, test, and deploy independently while maintaining strong consistency guarantees within service boundaries and eventual consistency across the broader system.

## 2. Service Inventory

| Service              | Responsibility                                                         | Database                    | Publishes Events                                                   |
| -------------------- | ---------------------------------------------------------------------- | --------------------------- | ------------------------------------------------------------------ |
| workspace-service    | Manages workspaces, memberships, permissions, and billing associations | PostgreSQL                  | workspace.created, workspace.updated, member.added, member.removed |
| user-service         | Handles user profiles, preferences, and account lifecycle management   | PostgreSQL                  | user.registered, user.updated, user.deactivated                    |
| content-service      | Stores and versions documents, files, and collaborative content        | PostgreSQL + Object Storage | content.created, content.updated, content.deleted, content.shared  |
| notification-service | Delivers notifications across channels (email, push, in-app, webhooks) | Redis + PostgreSQL          | notification.sent, notification.failed, notification.read          |
| event-relay          | Routes domain events between services via the managed event bus        | None (stateless)            | event.relayed, event.deadlettered                                  |
| search-service       | Provides full-text and faceted search across workspaces and content    | Elasticsearch               | index.updated, index.rebuilt                                       |

## 3. High-Level Architecture Diagram

```mermaid
flowchart TB
    subgraph External["External Actors"]
        Users["Users (Web/Mobile)"]
        Staff["Staff (Admin Console)"]
        Integrations["Third-Party Integrations"]
        Subscribers["Webhook Subscribers"]
    end

    subgraph Edge["Edge Layer"]
        CDN["CDN"]
        DNS["DNS"]
    end

    subgraph Region["Cloud Region"]
        subgraph VPC["VPC"]
            subgraph Cluster["Container Cluster"]
                subgraph Services["Services"]
                    WS["workspace-service"]
                    US["user-service"]
                    CS["content-service"]
                    NS["notification-service"]
                    SS["search-service"]
                end
                subgraph Platform["Platform"]
                    IdP["Identity Provider"]
                    ER["Event Relay"]
                end
            end
            subgraph Databases["Databases"]
                PG1["PostgreSQL - Workspaces"]
                PG2["PostgreSQL - Users"]
                PG3["PostgreSQL - Content"]
            end
        end
        subgraph Managed["Managed Services"]
            EB["Event Bus"]
            SEC["Secrets Manager"]
            REG["Container Registry"]
            MON["Monitoring"]
        end
    end

    Users --> CDN
    Staff --> CDN
    Integrations --> DNS
    CDN --> DNS
    DNS --> IdP
    IdP --> WS
    IdP --> US
    IdP --> CS
    IdP --> NS
    IdP --> SS
    WS --> PG1
    US --> PG2
    CS --> PG3
    WS --> ER
    US --> ER
    CS --> ER
    NS --> ER
    SS --> ER
    ER --> EB
    EB --> NS
    EB --> SS
    NS --> Subscribers
    Cluster --> SEC
    Cluster --> REG
    Cluster --> MON

    classDef edge fill:#dbeafe,stroke:#2563eb,color:#1e3a5f
    classDef svc fill:#dcfce7,stroke:#16a34a,color:#14532d
    classDef idp fill:#f3e8ff,stroke:#9333ea,color:#581c87
    classDef managed fill:#fef9c3,stroke:#ca8a04,color:#713f12
    classDef db fill:#f3f4f6,stroke:#6b7280,color:#1f2937
    classDef neutral fill:#f9fafb,stroke:#9ca3af,color:#374151

    class CDN,DNS edge
    class WS,US,CS,NS,SS svc
    class IdP,ER idp
    class EB,SEC,REG,MON managed
    class PG1,PG2,PG3 db
    class Users,Staff,Integrations,Subscribers neutral
```

## Changelog

| Version | Date       | Author                        | Changes         |
| ------- | ---------- | ----------------------------- | --------------- |
| 1.0.0   | 2026-03-26 | TL: System Design Integration | Initial version |
