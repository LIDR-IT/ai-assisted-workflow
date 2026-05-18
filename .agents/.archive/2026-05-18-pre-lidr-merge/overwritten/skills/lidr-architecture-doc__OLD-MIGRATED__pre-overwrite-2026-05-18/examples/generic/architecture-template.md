# {{PROJECT_NAME}} System Architecture

| Field            | Value            |
| ---------------- | ---------------- |
| **Version**      | {{VERSION}}      |
| **Last Updated** | {{LAST_UPDATED}} |
| **Status**       | {{STATUS}}       |
| **Owner**        | {{TEAM_NAME}}    |

## Technology Stack

### Core Technologies

- **Frontend**: {{FRONTEND_FRAMEWORK}} + {{FRONTEND_LANG}} + {{STYLING_FRAMEWORK}}
- **Backend**: {{BACKEND_RUNTIME}} + {{BACKEND_FRAMEWORK}} + {{BACKEND_LANG}}
- **Database**: {{DATABASE_ENGINE}} {{DATABASE_VERSION}} + {{ORM_FRAMEWORK}}
- **Cache**: {{CACHE_SYSTEM}} {{CACHE_VERSION}}
- **Infrastructure**: {{CONTAINER_PLATFORM}} + {{ORCHESTRATION_PLATFORM}}

### Supporting Services

- **Monitoring**: {{MONITORING_STACK}} + {{LOGGING_STACK}}
- **Security**: {{SECURITY_TOOLS}}
- **CI/CD**: {{CICD_PLATFORM}}
- **Message Queue**: {{MESSAGE_QUEUE_SYSTEM}}

## High-Level Architecture

```mermaid
graph TB
    subgraph "{{CLIENT_LAYER}}"
        A[{{CLIENT_APP}}] --> B[{{API_GATEWAY}}]
    end

    subgraph "{{APPLICATION_LAYER}}"
        B --> C[{{SERVICE_TYPE}} Service]
        C --> D[{{BUSINESS_LOGIC}} Module]
        D --> E[{{DATA_ACCESS}} Layer]
    end

    subgraph "{{DATA_LAYER}}"
        E --> F[{{DATABASE_ENGINE}}]
        E --> G[{{CACHE_SYSTEM}}]
    end

    subgraph "{{EXTERNAL_SERVICES}}"
        D --> H[{{EXTERNAL_API}}]
        D --> I[{{MESSAGE_QUEUE}}]
    end
```

## System Boundaries

### Internal Components

| Component     | Responsibility       | Technology |
| ------------- | -------------------- | ---------- |
| {{SERVICE_A}} | {{RESPONSIBILITY_A}} | {{TECH_A}} |
| {{SERVICE_B}} | {{RESPONSIBILITY_B}} | {{TECH_B}} |
| {{SERVICE_C}} | {{RESPONSIBILITY_C}} | {{TECH_C}} |

### External Dependencies

| Service                | Purpose       | SLA       | Fallback       |
| ---------------------- | ------------- | --------- | -------------- |
| {{EXTERNAL_SERVICE_A}} | {{PURPOSE_A}} | {{SLA_A}} | {{FALLBACK_A}} |
| {{EXTERNAL_SERVICE_B}} | {{PURPOSE_B}} | {{SLA_B}} | {{FALLBACK_B}} |

## Security Architecture

### Authentication & Authorization

- **Authentication Method**: {{AUTH_METHOD}}
- **Token Management**: {{TOKEN_STRATEGY}}
- **Authorization Model**: {{AUTHZ_MODEL}}
- **Session Management**: {{SESSION_STRATEGY}}

### Data Protection

- **Encryption at Rest**: {{REST_ENCRYPTION}} for {{SENSITIVE_DATA_TYPE}}
- **Encryption in Transit**: {{TRANSIT_ENCRYPTION}}
- **Data Classification**: {{DATA_CLASSIFICATION_LEVELS}}
- **Key Management**: {{KEY_MANAGEMENT_SYSTEM}}

### Security Controls

| Control Type           | Implementation       | Monitoring       |
| ---------------------- | -------------------- | ---------------- |
| {{SECURITY_CONTROL_A}} | {{IMPLEMENTATION_A}} | {{MONITORING_A}} |
| {{SECURITY_CONTROL_B}} | {{IMPLEMENTATION_B}} | {{MONITORING_B}} |

## Performance Architecture

### Performance Requirements

| Metric                   | Target       | Measurement              |
| ------------------------ | ------------ | ------------------------ |
| {{PERFORMANCE_METRIC_A}} | {{TARGET_A}} | {{MEASUREMENT_METHOD_A}} |
| {{PERFORMANCE_METRIC_B}} | {{TARGET_B}} | {{MEASUREMENT_METHOD_B}} |

### Scalability Strategy

- **Horizontal Scaling**: {{HORIZONTAL_APPROACH}}
- **Vertical Scaling**: {{VERTICAL_APPROACH}}
- **Caching Strategy**: {{CACHING_LAYERS}}
- **Load Balancing**: {{LOAD_BALANCER_TYPE}}

## Deployment Architecture

### Environments

| Environment     | Purpose             | URL             | Data                  |
| --------------- | ------------------- | --------------- | --------------------- |
| {{ENV_DEV}}     | {{PURPOSE_DEV}}     | {{URL_DEV}}     | {{DATA_TYPE_DEV}}     |
| {{ENV_STAGING}} | {{PURPOSE_STAGING}} | {{URL_STAGING}} | {{DATA_TYPE_STAGING}} |
| {{ENV_PROD}}    | {{PURPOSE_PROD}}    | {{URL_PROD}}    | {{DATA_TYPE_PROD}}    |

### Infrastructure

- **Cloud Provider**: {{CLOUD_PROVIDER}}
- **Regions**: {{DEPLOYMENT_REGIONS}}
- **Container Orchestration**: {{ORCHESTRATION_DETAILS}}
- **Networking**: {{NETWORK_ARCHITECTURE}}

## Data Architecture

### Data Flow

```mermaid
flowchart LR
    A[{{DATA_SOURCE}}] --> B[{{INGESTION_LAYER}}]
    B --> C[{{PROCESSING_LAYER}}]
    C --> D[{{STORAGE_LAYER}}]
    D --> E[{{APPLICATION_LAYER}}]
    E --> F[{{PRESENTATION_LAYER}}]
```

### Storage Strategy

- **Primary Storage**: {{PRIMARY_STORAGE}}
- **Backup Strategy**: {{BACKUP_APPROACH}}
- **Archival Policy**: {{ARCHIVAL_STRATEGY}}
- **Disaster Recovery**: {{DR_APPROACH}}

## Monitoring & Observability

### Monitoring Stack

- **Application Performance**: {{APM_TOOL}}
- **Infrastructure**: {{INFRASTRUCTURE_MONITORING}}
- **Logs**: {{LOG_AGGREGATION}}
- **Security**: {{SECURITY_MONITORING}}

### Key Metrics

| Type              | Metrics       | Alerting             |
| ----------------- | ------------- | -------------------- |
| {{METRIC_TYPE_A}} | {{METRICS_A}} | {{ALERT_CRITERIA_A}} |
| {{METRIC_TYPE_B}} | {{METRICS_B}} | {{ALERT_CRITERIA_B}} |

## Technical Debt & Evolution

### Known Technical Debt

| Item            | Impact       | Priority       | Resolution Plan  |
| --------------- | ------------ | -------------- | ---------------- |
| {{DEBT_ITEM_A}} | {{IMPACT_A}} | {{PRIORITY_A}} | {{RESOLUTION_A}} |
| {{DEBT_ITEM_B}} | {{IMPACT_B}} | {{PRIORITY_B}} | {{RESOLUTION_B}} |

### Evolution Roadmap

- **Q{{QUARTER_1}}**: {{EVOLUTION_PLAN_Q1}}
- **Q{{QUARTER_2}}**: {{EVOLUTION_PLAN_Q2}}
- **Q{{QUARTER_3}}**: {{EVOLUTION_PLAN_Q3}}

## Decision Log

### Recent Architecture Decisions

| Date                | Decision       | Rationale       | Status       |
| ------------------- | -------------- | --------------- | ------------ |
| {{DECISION_DATE_A}} | {{DECISION_A}} | {{RATIONALE_A}} | {{STATUS_A}} |
| {{DECISION_DATE_B}} | {{DECISION_B}} | {{RATIONALE_B}} | {{STATUS_B}} |

---

**Legend:**

- {{VARIABLE_NAME}} = Placeholder to be replaced with actual values
- Sections can be customized based on specific domain requirements
- Diagrams should be updated to reflect actual system topology
