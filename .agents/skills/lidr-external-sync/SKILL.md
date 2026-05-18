---
id: external-sync
version: "1.0.0"
last_updated: "2026-03-17"
updated_by: "System: SDLC Enhancement Plan Phase 4"
status: active
phase: 0
owner_role: "TL"
automation: false
domain_agnostic: true
description: >
  Synchronize project data bidirectionally across external tools (Jira, Linear, Notion)
  with conflict resolution. ALWAYS use when managing multi-tool SDLC workflows at scale.
---

# SKILL: External Tool Synchronization Engine

> **Phase 4 Enhancement**: Multi-tool orchestration with conflict resolution and health monitoring
> **Scope**: Bidirectional sync across Jira, Linear, Notion with portfolio-scale reliability
> **ROI**: Eliminates manual data entry, ensures consistency across 500+ projects

---

## Purpose

This skill orchestrates bidirectional synchronization between SDLC tracking (sdlc-tracking.yaml) and external tools (Jira, Linear, Notion). It provides conflict resolution, sync health monitoring, and automated sync scheduling for portfolio-scale operations.

### When to Use

- **Manual Sync**: `/track-sdlc sync [project-id]` - immediate synchronization
- **Scheduled Sync**: Automated every 2 hours during business hours
- **Event-Driven**: On PR merge, sprint completion, epic state changes
- **Health Check**: Weekly sync audit with drift detection and remediation

---

## Integration Architecture

### Sync Engine Components

| Component             | Purpose                 | Responsibility                                     |
| --------------------- | ----------------------- | -------------------------------------------------- |
| **Orchestrator**      | Multi-tool coordination | Schedule, batch operations, retry logic            |
| **Conflict Resolver** | Data consistency        | Last-modified-wins, manual resolution triggers     |
| **Health Monitor**    | Sync status tracking    | Success rates, error patterns, performance metrics |
| **Rate Manager**      | API limits compliance   | Jira: 300/min, Linear: 60/min, Notion: 3/sec       |

### Supported Tools and Capabilities

| Tool       | Connector           | Read                | Write             | Bidirectional    | Rate Limit  |
| ---------- | ------------------- | ------------------- | ----------------- | ---------------- | ----------- |
| **Jira**   | jira-connector.ts   | ✅ Epics, Stories   | ✅ Create, Update | ✅ Pull changes  | 300 req/min |
| **Linear** | linear-connector.ts | ✅ Projects, Issues | ✅ Create, Update | ✅ GraphQL sync  | 60 req/min  |
| **Notion** | notion-connector.ts | ✅ Database pages   | ✅ Create, Update | ✅ Query changes | 3 req/sec   |

---

## Core Operations

### 1. Sync Project to External Tools

**Input**: Project ID, tool list, sync mode
**Output**: Sync report with success/failure details

```typescript
// Example sync operation
const syncResult = await syncEngine.syncProject("PROJ-2026-001", {
  tools: ["jira", "linear", "notion"],
  mode: "bidirectional",
  conflictResolution: "last-modified-wins",
});
```

**Process Flow**:

1. Load project sdlc-tracking.yaml
2. Validate external tool connections
3. Determine sync direction (push, pull, bidirectional)
4. Execute sync operations with rate limiting
5. Apply conflict resolution rules
6. Generate comprehensive sync report

### 2. Pull Updates from External Tools

**Input**: Project ID, since timestamp
**Output**: Change summary and applied updates

**Conflict Resolution Strategy**:

- **Last Modified Wins**: Compare timestamps, apply most recent
- **Manual Resolution**: Flag conflicts requiring human decision
- **Field-Level Merging**: Merge non-conflicting fields, flag conflicts
- **Audit Trail**: Log all sync decisions for review

### 3. Health Monitoring and Reporting

**Metrics Tracked**:

- Sync success rates per tool
- Average sync duration
- Error patterns and remediation
- Data consistency scores
- API rate limit utilization

**Health Thresholds**:

- Success rate < 95% → Warning alert
- Sync duration > 5 minutes → Performance alert
- Consistency drift > 5% → Data quality alert

---

## Sync Scheduling Strategy

### Automatic Sync Triggers

| Event               | Frequency     | Tools        | Conflict Handling   |
| ------------------- | ------------- | ------------ | ------------------- |
| **Sprint Planning** | Per sprint    | Jira, Linear | Push to external    |
| **Daily Standup**   | Daily 9 AM    | All tools    | Pull + push         |
| **PR Merge**        | Real-time     | Jira, Notion | Update story status |
| **Epic Completion** | Event-driven  | All tools    | Comprehensive sync  |
| **Health Check**    | Weekly Sunday | All tools    | Audit + remediation |

### Manual Sync Commands

```bash
# Sync specific project
/track-sdlc sync PROJ-2026-001

# Sync with specific tool
/track-sdlc sync PROJ-2026-001 --tools=jira

# Force sync (ignore timestamps)
/track-sdlc sync PROJ-2026-001 --force

# Health check for project
/track-sdlc health PROJ-2026-001 --detailed
```

---

## Portfolio-Scale Optimizations

### Batch Operations

- **Project Batching**: Sync 10 projects per batch to optimize API usage
- **Field Batching**: Sync only changed fields, not entire records
- **Time Windows**: Spread sync operations across business hours
- **Priority Queues**: Critical projects sync first

### Error Handling and Recovery

```typescript
interface SyncError {
  project: string;
  tool: string;
  error: string;
  retryCount: number;
  nextRetry: Date;
  severity: "low" | "medium" | "high" | "critical";
}
```

**Recovery Strategies**:

- **Transient Errors**: Auto-retry with exponential backoff
- **Rate Limit Errors**: Queue and retry after window
- **Authentication Errors**: Alert admin, pause sync
- **Data Conflicts**: Flag for manual resolution

### Performance Monitoring

```typescript
interface SyncMetrics {
  tool: string;
  operations: {
    total: number;
    successful: number;
    failed: number;
    duration_ms: number;
  };
  rateLimit: {
    used: number;
    limit: number;
    resetTime: Date;
  };
  dataConsistency: {
    score: number; // 0.0 - 1.0
    drifts: number;
    lastAudit: Date;
  };
}
```

---

## Templates and Configuration

### Sync Configuration Template

```yaml
# .claude/skills/external-sync/templates/sync-config.yaml
sync_config:
  project_id: "{project-id}"

  tools:
    jira:
      enabled: true
      sync_mode: "bidirectional"
      priority_fields: ["status", "assignee", "estimation"]
      conflict_resolution: "last-modified-wins"

    linear:
      enabled: true
      sync_mode: "bidirectional"
      priority_fields: ["state", "assignee", "estimate"]
      conflict_resolution: "manual"

    notion:
      enabled: false
      sync_mode: "push-only"
      priority_fields: ["status", "progress"]
      conflict_resolution: "source-wins"

  schedule:
    auto_sync: true
    frequency: "2h"
    business_hours_only: true

  health_monitoring:
    success_threshold: 0.95
    performance_threshold_ms: 300000
    consistency_threshold: 0.95

  notifications:
    success: false
    warnings: true
    errors: true
    channels: ["slack", "email"]
```

### Sync Report Template

```yaml
# .claude/skills/external-sync/templates/sync-report.yaml
sync_report:
  project_id: "{project-id}"
  timestamp: "{ISO-timestamp}"
  duration_ms: 45000

  summary:
    total_operations: 15
    successful: 14
    failed: 1
    skipped: 0

  tools:
    jira:
      status: "success"
      operations: 8
      duration_ms: 25000
      rate_limit_used: "45/300"

    linear:
      status: "warning"
      operations: 4
      duration_ms: 15000
      rate_limit_used: "25/60"
      warnings: ["Rate limit approaching"]

    notion:
      status: "error"
      operations: 0
      error: "Authentication failed"

  data_consistency:
    score: 0.93
    drifts_found: 2
    drifts_resolved: 1
    manual_review_required: 1

  recommendations:
    - "Review Notion API key configuration"
    - "Monitor Linear rate limit usage"
    - "Epic PROJ-001-005 requires manual conflict resolution"
```

---

## Error Handling Patterns

### Common Sync Errors

| Error Type          | Cause              | Resolution          | Prevention         |
| ------------------- | ------------------ | ------------------- | ------------------ |
| **Rate Limit**      | Too many API calls | Queue and retry     | Smart batching     |
| **Auth Failure**    | Expired tokens     | Refresh or alert    | Token rotation     |
| **Data Conflict**   | Simultaneous edits | Conflict resolution | Optimistic locking |
| **Field Mismatch**  | Schema differences | Field mapping       | Schema validation  |
| **Network Timeout** | API unavailable    | Exponential backoff | Health checks      |

### Conflict Resolution Examples

```typescript
// Epic title conflict
const conflict = {
  field: "title",
  localValue: "Enhanced User Authentication",
  remoteValue: "User Authentication Enhancement",
  lastModified: {
    local: "2026-03-17T14:30:00Z",
    remote: "2026-03-17T15:45:00Z",
  },
};

// Resolution: Remote wins (newer)
const resolved = await conflictResolver.resolve(conflict, "last-modified-wins");
```

---

## Integration with SDLC Commands

### Enhanced /track-sdlc Command

```bash
# Initialize project with external sync
/track-sdlc init my-project --sync=jira,linear

# Update project status and sync
/track-sdlc update my-project --phase=5 --sync

# Health dashboard for portfolio
/track-sdlc dashboard --sync-health

# Resolve sync conflicts
/track-sdlc resolve my-project --conflict-id=12345
```

### Integration with /advance-gate

```typescript
// Phase 4: Development → QA
// Auto-sync story status to external tools
await syncEngine.syncProject(projectId, {
  tools: ["jira", "linear"],
  trigger: "gate-advancement",
  fields: ["status", "qa_assignee"],
});
```

---

## Security and Compliance

### API Key Management

```yaml
# Environment variables (never in code)
JIRA_API_TOKEN="{encrypted-token}"
LINEAR_API_KEY="{encrypted-key}"
NOTION_API_KEY="{encrypted-key}"

# Rotation schedule
TOKEN_ROTATION_DAYS=90
ALERT_BEFORE_EXPIRY_DAYS=7
```

### Audit Trail

```typescript
interface SyncAuditEntry {
  timestamp: Date;
  project: string;
  tool: string;
  operation: "create" | "update" | "delete";
  field: string;
  oldValue: any;
  newValue: any;
  user: string;
  source: "manual" | "automated";
}
```

### Data Privacy

- **PII Masking**: Personal data masked in sync logs
- **Encryption**: All API communications use TLS 1.2+
- **Access Control**: Tool-specific permissions validated
- **Compliance**: GDPR-compliant data handling

---

## Performance Targets

### Sync Performance SLAs

| Metric                     | Target       | Measurement              |
| -------------------------- | ------------ | ------------------------ |
| **Single Project Sync**    | < 2 minutes  | P95 duration             |
| **Portfolio Health Check** | < 30 minutes | 100 projects             |
| **Real-time Event Sync**   | < 30 seconds | PR merge → status update |
| **Success Rate**           | > 99%        | Monthly uptime           |
| **Data Consistency**       | > 98%        | Weekly audit             |

### API Usage Optimization

- **Request Batching**: Combine related operations
- **Selective Sync**: Only sync changed fields
- **Intelligent Caching**: Cache static data for 1 hour
- **Parallel Processing**: Sync tools in parallel when possible

---

## Future Enhancements

### Roadmap Items

1. **Q2 2026**: GitHub integration for PR/commit sync
2. **Q3 2026**: Slack notifications for sync events
3. **Q4 2026**: AI-powered conflict resolution
4. **Q1 2027**: Real-time sync with webhooks

### Scaling Considerations

- **Multi-region**: Deploy sync engines in multiple regions
- **Event Streaming**: Move from polling to event-driven sync
- **Microservices**: Split sync engine into tool-specific services
- **Observability**: Enhanced monitoring with distributed tracing

---

## Validation and Quality

### Sync Validation Rules

```typescript
const validationRules = [
  "Epic must have valid external IDs",
  "Story estimation must be numeric",
  "Status transitions must be valid",
  "Assignee must exist in target system",
  "Required fields cannot be null",
  "External references must be reachable",
];
```

### Testing Strategy

- **Unit Tests**: Each connector independently tested
- **Integration Tests**: End-to-end sync scenarios
- **Load Tests**: 500-project portfolio simulation
- **Chaos Tests**: Network failures and recovery

---

## Changelog

| Version | Date       | Author                   | Changes                                                   |
| ------- | ---------- | ------------------------ | --------------------------------------------------------- |
| 1.0.0   | 2026-03-17 | System: Enhancement Plan | Initial implementation with three-tool sync orchestration |
