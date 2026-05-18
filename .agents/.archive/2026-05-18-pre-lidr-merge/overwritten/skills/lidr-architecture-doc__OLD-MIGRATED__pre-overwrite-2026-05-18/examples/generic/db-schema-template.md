# {{PROJECT_NAME}} Database Schema

| Field               | Value                           |
| ------------------- | ------------------------------- |
| **Version**         | {{SCHEMA_VERSION}}              |
| **Database Engine** | {{DATABASE_ENGINE}} {{VERSION}} |
| **ORM**             | {{ORM_FRAMEWORK}}               |
| **Last Updated**    | {{LAST_UPDATED}}                |

## Schema Overview

### Entity Relationship Diagram

```mermaid
erDiagram
    {{ENTITY_A}} ||--o{ {{ENTITY_B}} : {{RELATIONSHIP_A}}
    {{ENTITY_B}} }|..|{ {{ENTITY_C}} : {{RELATIONSHIP_B}}
    {{ENTITY_C}} ||--|| {{ENTITY_D}} : {{RELATIONSHIP_C}}
```

## Table Definitions

### {{PRIMARY_ENTITY}} Table

**Purpose**: {{ENTITY_PURPOSE}}

| Field                 | Type                 | Constraints                 | Index                 | Sensitive               | Description                 |
| --------------------- | -------------------- | --------------------------- | --------------------- | ----------------------- | --------------------------- |
| id                    | {{ID_TYPE}}          | PRIMARY KEY                 | Yes                   | No                      | {{ID_DESCRIPTION}}          |
| {{FIELD_A}}           | {{TYPE_A}}           | {{CONSTRAINTS_A}}           | {{INDEX_A}}           | {{SENSITIVE_A}}         | {{DESCRIPTION_A}}           |
| {{FIELD_B}}           | {{TYPE_B}}           | {{CONSTRAINTS_B}}           | {{INDEX_B}}           | {{SENSITIVE_B}}         | {{DESCRIPTION_B}}           |
| {{SPECIALIZED_FIELD}} | {{SPECIALIZED_TYPE}} | {{SPECIALIZED_CONSTRAINTS}} | {{SPECIALIZED_INDEX}} | {{DATA_CLASSIFICATION}} | {{SPECIALIZED_DESCRIPTION}} |
| created_at            | TIMESTAMP            | NOT NULL                    | Yes                   | No                      | Record creation timestamp   |
| updated_at            | TIMESTAMP            | NOT NULL                    | Yes                   | No                      | Last modification timestamp |

### {{SECONDARY_ENTITY}} Table

**Purpose**: {{SECONDARY_PURPOSE}}

| Field                 | Type              | Constraints                                   | Index              | Sensitive              | Description                  |
| --------------------- | ----------------- | --------------------------------------------- | ------------------ | ---------------------- | ---------------------------- |
| id                    | {{ID_TYPE}}       | PRIMARY KEY                                   | Yes                | No                     | {{SECONDARY_ID_DESCRIPTION}} |
| {{FOREIGN_KEY_FIELD}} | {{ID_TYPE}}       | FOREIGN KEY REFERENCES {{PRIMARY_ENTITY}}(id) | Yes                | No                     | {{FK_DESCRIPTION}}           |
| {{BUSINESS_FIELD}}    | {{BUSINESS_TYPE}} | {{BUSINESS_CONSTRAINTS}}                      | {{BUSINESS_INDEX}} | {{BUSINESS_SENSITIVE}} | {{BUSINESS_DESCRIPTION}}     |
| status                | {{STATUS_TYPE}}   | NOT NULL                                      | Yes                | No                     | {{STATUS_DESCRIPTION}}       |
| created_at            | TIMESTAMP         | NOT NULL                                      | Yes                | No                     | Record creation timestamp    |
| updated_at            | TIMESTAMP         | NOT NULL                                      | Yes                | No                     | Last modification timestamp  |

### {{LOOKUP_TABLE}} Table

**Purpose**: {{LOOKUP_PURPOSE}}

| Field       | Type                     | Constraints           | Index | Sensitive | Description               |
| ----------- | ------------------------ | --------------------- | ----- | --------- | ------------------------- |
| id          | {{ID_TYPE}}              | PRIMARY KEY           | Yes   | No        | {{LOOKUP_ID_DESCRIPTION}} |
| code        | VARCHAR({{CODE_LENGTH}}) | UNIQUE NOT NULL       | Yes   | No        | {{CODE_DESCRIPTION}}      |
| name        | VARCHAR({{NAME_LENGTH}}) | NOT NULL              | No    | No        | {{NAME_DESCRIPTION}}      |
| description | TEXT                     | NULL                  | No    | No        | {{LOOKUP_DESCRIPTION}}    |
| active      | BOOLEAN                  | NOT NULL DEFAULT TRUE | Yes   | No        | {{ACTIVE_DESCRIPTION}}    |

## Relationships

### {{PRIMARY_ENTITY}} Relationships

- **{{PRIMARY_ENTITY}}** (1) → **{{SECONDARY_ENTITY}}** (N): {{RELATIONSHIP_DESCRIPTION_A}}
- **{{PRIMARY_ENTITY}}** (N) → **{{LOOKUP_TABLE}}** (1): {{RELATIONSHIP_DESCRIPTION_B}}

### {{SECONDARY_ENTITY}} Relationships

- **{{SECONDARY_ENTITY}}** (N) → **{{THIRD_ENTITY}}** (N): {{MANY_TO_MANY_DESCRIPTION}}

## Data Classification

### Sensitive Data Fields

| Table.Field                     | Classification Level         | Regulation       | Encryption Required | Retention Policy |
| ------------------------------- | ---------------------------- | ---------------- | ------------------- | ---------------- |
| {{TABLE_A}}.{{FIELD_PII}}       | {{PII_CLASSIFICATION}}       | {{REGULATION_A}} | {{ENCRYPTION_A}}    | {{RETENTION_A}}  |
| {{TABLE_B}}.{{FIELD_SENSITIVE}} | {{SENSITIVE_CLASSIFICATION}} | {{REGULATION_B}} | {{ENCRYPTION_B}}    | {{RETENTION_B}}  |

### Data Classification Levels

- **Public**: {{PUBLIC_DEFINITION}}
- **Internal**: {{INTERNAL_DEFINITION}}
- **Confidential**: {{CONFIDENTIAL_DEFINITION}}
- **Restricted**: {{RESTRICTED_DEFINITION}}

## Indexes

### Performance-Critical Indexes

| Index Name       | Table       | Columns       | Type             | Purpose       |
| ---------------- | ----------- | ------------- | ---------------- | ------------- |
| idx\_{{INDEX_A}} | {{TABLE_A}} | {{COLUMNS_A}} | {{INDEX_TYPE_A}} | {{PURPOSE_A}} |
| idx\_{{INDEX_B}} | {{TABLE_B}} | {{COLUMNS_B}} | {{INDEX_TYPE_B}} | {{PURPOSE_B}} |

### Composite Indexes

| Index Name           | Table       | Columns              | Selectivity       | Usage Pattern |
| -------------------- | ----------- | -------------------- | ----------------- | ------------- |
| idx\_{{COMPOSITE_A}} | {{TABLE_A}} | {{COL_1}}, {{COL_2}} | {{SELECTIVITY_A}} | {{USAGE_A}}   |
| idx\_{{COMPOSITE_B}} | {{TABLE_B}} | {{COL_3}}, {{COL_4}} | {{SELECTIVITY_B}} | {{USAGE_B}}   |

## Migration History

### Schema Versions

| Version       | Date       | Migration       | Breaking Changes | Rollback Plan  |
| ------------- | ---------- | --------------- | ---------------- | -------------- |
| {{VERSION_A}} | {{DATE_A}} | {{MIGRATION_A}} | {{BREAKING_A}}   | {{ROLLBACK_A}} |
| {{VERSION_B}} | {{DATE_B}} | {{MIGRATION_B}} | {{BREAKING_B}}   | {{ROLLBACK_B}} |

### Upcoming Migrations

| Version              | Planned Date      | Purpose              | Impact              | Prerequisites       |
| -------------------- | ----------------- | -------------------- | ------------------- | ------------------- |
| {{FUTURE_VERSION_A}} | {{FUTURE_DATE_A}} | {{FUTURE_PURPOSE_A}} | {{FUTURE_IMPACT_A}} | {{FUTURE_PREREQ_A}} |

## Performance Considerations

### Query Patterns

| Query Type       | Frequency       | Performance Target | Current Performance | Optimization       |
| ---------------- | --------------- | ------------------ | ------------------- | ------------------ |
| {{QUERY_TYPE_A}} | {{FREQUENCY_A}} | {{TARGET_A}}       | {{CURRENT_A}}       | {{OPTIMIZATION_A}} |
| {{QUERY_TYPE_B}} | {{FREQUENCY_B}} | {{TARGET_B}}       | {{CURRENT_B}}       | {{OPTIMIZATION_B}} |

### Growth Projections

| Table       | Current Size | Growth Rate  | 1-Year Projection | Scaling Plan  |
| ----------- | ------------ | ------------ | ----------------- | ------------- |
| {{TABLE_A}} | {{SIZE_A}}   | {{GROWTH_A}} | {{PROJECTION_A}}  | {{SCALING_A}} |
| {{TABLE_B}} | {{SIZE_B}}   | {{GROWTH_B}} | {{PROJECTION_B}}  | {{SCALING_B}} |

## Backup & Recovery

### Backup Strategy

- **Full Backup**: {{FULL_BACKUP_FREQUENCY}}
- **Incremental Backup**: {{INCREMENTAL_FREQUENCY}}
- **Transaction Log Backup**: {{LOG_BACKUP_FREQUENCY}}
- **Retention**: {{BACKUP_RETENTION}}

### Recovery Procedures

| Scenario       | RTO       | RPO       | Procedure       | Testing Frequency    |
| -------------- | --------- | --------- | --------------- | -------------------- |
| {{SCENARIO_A}} | {{RTO_A}} | {{RPO_A}} | {{PROCEDURE_A}} | {{TEST_FREQUENCY_A}} |
| {{SCENARIO_B}} | {{RTO_B}} | {{RPO_B}} | {{PROCEDURE_B}} | {{TEST_FREQUENCY_B}} |

## Compliance & Governance

### Regulatory Requirements

| Regulation       | Applicable Tables | Requirements       | Implementation       | Audit Frequency |
| ---------------- | ----------------- | ------------------ | -------------------- | --------------- |
| {{REGULATION_A}} | {{TABLES_A}}      | {{REQUIREMENTS_A}} | {{IMPLEMENTATION_A}} | {{AUDIT_A}}     |
| {{REGULATION_B}} | {{TABLES_B}}      | {{REQUIREMENTS_B}} | {{IMPLEMENTATION_B}} | {{AUDIT_B}}     |

### Data Governance

- **Data Owner**: {{DATA_OWNER}}
- **Data Steward**: {{DATA_STEWARD}}
- **Classification Review**: {{REVIEW_FREQUENCY}}
- **Access Review**: {{ACCESS_REVIEW_FREQUENCY}}

---

**Legend:**

- {{VARIABLE_NAME}} = Placeholder to be replaced with actual values
- Sensitive fields should be encrypted using {{ENCRYPTION_STANDARD}}
- All timestamps use {{TIMEZONE}} timezone
- Foreign key constraints enforce referential integrity
