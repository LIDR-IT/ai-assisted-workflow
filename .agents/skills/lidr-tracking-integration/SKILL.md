---
name: lidr-tracking-integration
id: tracking-integration
version: "1.0.0"
last_updated: "2026-04-06"
updated_by: "TL: adaptive-skills-architecture"
status: active
phase: 1
owner_role: "PME"
automation: false
domain_agnostic: true
description: >
  Create properly structured project tracking hierarchy for any tracking system (Jira, Linear, Notion, etc.).
  Adaptive skill that detects client's tracking tool and uses appropriate adapter for epic/project creation.
  Use for project setup, tracking initialization, project structure after business case approval.
  Essential when kickoff meeting is complete and development tracking must begin.
  Always use after Gate 0 approval, always use when project key is assigned and team is confirmed.
  Do NOT use for individual user stories (use user-stories), for sprint planning (use sprint-capacity), or for projects without formal tracking tools.
  Triggers on "create epic", "set up project tracking", "initialize tracking", "create master epic", "project setup", "post-kickoff actions".
  Output in Spanish (descriptions) + English (keys, labels).
  Audience: PME (creates structure), Dev (references tickets), QA (links test cases).
  Tracking pipeline: this is the CREATE step (one-time external structure); `lidr-sdlc-tracking` owns the internal state file, `lidr-external-sync` reconciles them — do NOT use this for ongoing state or sync.
---

# Tracking Integration — Adaptive Project Kickstart

**Always use immediately after business case approval and kickoff** — this skill is CRITICAL for project setup and must be executed before any development work begins. Automatically adapts to client's tracking tool ({{TRACKING_TOOL}}) while maintaining consistent workflow.

**Triggers**: "create epic", "set up project tracking", "initialize tracking", "create master epic", "project setup", "post-kickoff actions"

Phase: 1 — Origination | Post kick-off | Language: Spanish + English | Duration: 15-30min

## Related — tracking pipeline

This skill is the **CREATE** step. The three tracking skills form a pipeline, not duplicates:

- **`lidr-tracking-integration`** (this) — one-time CREATE of the external project/epic structure, post-Gate 0.
- **`lidr-sdlc-tracking`** — OWNS `sdlc-tracking.yaml`, the internal lifecycle/state source of truth.
- **`lidr-external-sync`** — RECONCILES `sdlc-tracking.yaml` ↔ external tools (optional, portfolio-scale).

## Adaptive Architecture

This skill **automatically detects** the client's tracking tool and uses the appropriate adapter:

| Tool             | Adapter             | Epic Format          | Integration              |
| ---------------- | ------------------- | -------------------- | ------------------------ |
| **Jira**         | `jira-adapter.py`   | Standard Epic        | Atlassian MCP / REST API |
| **Linear**       | `linear-adapter.py` | Project + Milestones | Linear API / GraphQL     |
| **Notion**       | `notion-adapter.py` | Database Entry       | Notion API               |
| **Azure DevOps** | `azure-adapter.py`  | Epic Work Item       | Azure DevOps REST API    |
| **GitHub**       | `github-adapter.py` | Project + Issues     | GitHub API               |

### Auto-Detection Logic

```python
def detect_tracking_tool(client_config):
    """Auto-detect tracking tool from client configuration"""
    if client_config.tracking_tool:
        return client_config.tracking_tool

    # Client-specific defaults
    if client_config.name == 'Docline':
        return 'linear'
    elif client_config.name == 'FacePhi':
        return 'jira'

    # Industry defaults
    if client_config.industry == 'Healthcare':
        return 'linear'
    elif client_config.industry == 'Biometric':
        return 'jira'

    return 'jira'  # Conservative default
```

## Critical Success Workflow

This workflow is MANDATORY for every project — no exceptions. Every project must have properly structured tracking before development begins.

### Prerequisites (Required)

- ✅ Business Case approved and documented
- ✅ Kickoff meeting completed with minutes
- ✅ Project key/identifier assigned
- ✅ Team members confirmed and roles assigned
- ✅ Client tracking tool configuration verified

### Execution Steps

1. **Detect Tool** — Auto-detect client's {{TRACKING_TOOL}} from configuration
2. **Load Adapter** — Initialize appropriate tracking tool adapter
3. **Load Context** — Read approved Business Case + Kickoff minutes
4. **Validate Prerequisites** — Ensure all required inputs are available
5. **Generate Structure** — Create comprehensive project structure with all metadata
6. **Execute Creation** — Direct tool creation (with MCP/API) or structured output
7. **Setup Sub-Projects** — For projects >3 sprints, create phase-based sub-projects
8. **Link Dependencies** — Attach Business Case, link to documentation

## Input

| Input                    | Required      | Source                 |
| ------------------------ | ------------- | ---------------------- |
| Client Configuration     | ✅            | `src/data/client.ts`   |
| Approved Business Case   | ✅            | skill `business-case/` |
| Kick-off minutes         | ✅            | skill `kickoff/`       |
| Project identifier       | ✅            | SM / PME               |
| Tool field schema        | Desirable     | Tool admin             |
| Existing board/workspace | If applicable | SM                     |

## Universal Project Structure Template

This template adapts to any tracking tool while maintaining consistent business context:

```markdown
## Project Creation Template

### Core Information

| Field           | Value                                | Jira Mapping | Linear Mapping | Notion Mapping |
| --------------- | ------------------------------------ | ------------ | -------------- | -------------- |
| **Project**     | {PROJECT_KEY}                        | Project Key  | Team           | Database       |
| **Type**        | Epic/Project                         | Epic         | Project        | Project        |
| **Title**       | {Product} {Version} - {Objective}    | Summary      | Name           | Title          |
| **Description** | {Objective + Business Value + Scope} | Description  | Description    | Description    |
| **Priority**    | {Critical/High/Medium}               | Priority     | Priority       | Priority       |
| **Status**      | Planning                             | Status       | Workflow State | Status         |
| **Start Date**  | {Kickoff date}                       | Start Date   | Start Date     | Start Date     |
| **Target Date** | {Target completion}                  | Due Date     | Target Date    | Target Date    |
| **Owner**       | {Project Manager}                    | Assignee     | Lead           | Owner          |
| **Reporter**    | {Product Owner}                      | Reporter     | Creator        | Creator        |

### Business Context

| Field                   | Value                 | Tool Adaptation           |
| ----------------------- | --------------------- | ------------------------- |
| **Business Case**       | {Confluence/Doc URL}  | Link field / Custom field |
| **Sponsor**             | {Executive sponsor}   | Custom field / Label      |
| **Strategic Alignment** | {OKR/Initiative}      | Label / Tag               |
| **Budget**              | {Development cost}    | Custom field              |
| **Expected ROI**        | {Business projection} | Custom field              |

### Technical Metadata

| Field           | Value                                               | Tool Adaptation         |
| --------------- | --------------------------------------------------- | ----------------------- |
| **Components**  | {System components}                                 | Components / Labels     |
| **Labels/Tags** | phase:origination, type:product, priority:strategic | Labels / Tags           |
| **Version**     | {vX.Y.Z}                                            | Fix Version / Milestone |
| **Team**        | {Team members}                                      | Assignees / Team        |
```

## Tool-Specific Examples

### Example 1: Jira Epic (FacePhi Client)

```json
{
  "projectKey": "BIOM",
  "issueType": "Epic",
  "summary": "Identity Verification v3.0 - Enhanced Liveness Detection",
  "description": "Enhanced liveness detection with new ML models and improved user experience. Strategic objective: increase verification accuracy to 99.7% while reducing false positives by 40%.",
  "priority": "High",
  "labels": ["phase:origination", "type:product-feature", "priority:strategic", "domain:biometric"],
  "components": ["Liveness-Engine", "ML-Models", "Mobile-SDK", "API-Gateway"],
  "fixVersion": "v3.0.0",
  "epicName": "Liveness v3.0 Accuracy",
  "customFields": {
    "businessCase": "https://confluence.facephi.com/bc-liveness-v3",
    "sponsor": "VP Product",
    "budget": "€180K",
    "expectedROI": "280% in 18 months"
  }
}
```

### Example 2: Linear Project (Docline Client)

```json
{
  "teamId": "healthcare-platform",
  "name": "Patient Portal v2.1 - Telehealth Integration",
  "description": "Integrate telehealth capabilities with video consultations, appointment scheduling, and medical records sharing. Target: enable remote consultations for 80% of routine appointments.",
  "state": "planned",
  "priority": "high",
  "targetDate": "2026-09-30",
  "leadId": "dr-garcia",
  "milestones": [
    {
      "name": "Discovery & Requirements",
      "description": "PRD + technical specification + compliance review",
      "targetDate": "2026-05-15"
    },
    {
      "name": "Core Development",
      "description": "Video integration + scheduling + GDPR compliance",
      "targetDate": "2026-08-15"
    }
  ],
  "labels": [
    "phase:origination",
    "type:platform-feature",
    "priority:strategic",
    "domain:healthcare"
  ]
}
```

### Example 3: Notion Project Database

```json
{
  "parent": "healthcare-projects-db",
  "properties": {
    "Name": "Patient Portal v2.1 - Telehealth Integration",
    "Status": "Planning",
    "Priority": "High",
    "Start Date": "2026-04-01",
    "Target Date": "2026-09-30",
    "Owner": "Dr. García",
    "Sponsor": "Head of Digital Health",
    "Business Case": "https://notion.docline.com/bc-telehealth",
    "Budget": "€95K",
    "Team": ["Frontend Team", "Backend Team", "Compliance Team"],
    "Phase": "Origination",
    "Type": "Platform Feature"
  }
}
```

## Sub-Projects for Large Initiatives (>3 Sprints)

Essential for complex projects spanning multiple phases:

| Sub-project                       | Phase    | Owner         | Duration    | Key Deliverables                                          |
| --------------------------------- | -------- | ------------- | ----------- | --------------------------------------------------------- |
| **{Project}-Discovery**           | Phase 2  | PO + R&D Lead | 2-3 sprints | PRD-Technical, PRD-Functional, Cross-review, Risk Log     |
| **{Project}-Specification**       | Phase 3  | PO + QA Lead  | 2-3 sprints | RFs with BDD, NFRs, Requirements Traceability Matrix      |
| **{Project}-Core-Development**    | Phase 5a | Tech Lead     | 4-8 sprints | Core algorithms, APIs, database schema                    |
| **{Project}-Integration**         | Phase 5b | Tech Lead     | 2-4 sprints | Tool integration, mobile components, UI                   |
| **{Project}-Testing**             | Phase 6  | QA Lead       | 2-3 sprints | Test automation, performance testing, security validation |
| **{Project}-Security-Compliance** | Phase 7  | Security Lead | 1-2 sprints | Security testing, compliance certification                |
| **{Project}-Release**             | Phase 8  | DevOps Lead   | 1 sprint    | Production deployment, documentation, communication       |

## Adapter Implementation

### Core Adapter Interface

```python
from abc import ABC, abstractmethod
from typing import Dict, Any, List

class TrackingToolAdapter(ABC):
    """Base interface for all tracking tool adapters"""

    @abstractmethod
    def create_project(self, project_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create main project/epic in the tracking tool"""
        pass

    @abstractmethod
    def create_sub_projects(self, parent_id: str, sub_projects: List[Dict]) -> List[Dict]:
        """Create phase-based sub-projects"""
        pass

    @abstractmethod
    def link_business_case(self, project_id: str, bc_url: str) -> bool:
        """Link business case to the project"""
        pass

    @abstractmethod
    def setup_team_access(self, project_id: str, team_members: List[str]) -> bool:
        """Setup team access and permissions"""
        pass
```

### Jira Adapter Sample

```python
class JiraAdapter(TrackingToolAdapter):
    def __init__(self, jira_config):
        self.jira = JIRA(server=jira_config.server, basic_auth=jira_config.auth)

    def create_project(self, project_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create Jira epic with full metadata"""
        epic_data = {
            'project': project_data['project_key'],
            'summary': project_data['title'],
            'description': project_data['description'],
            'issuetype': {'name': 'Epic'},
            'priority': {'name': project_data['priority']},
            'customfield_10011': project_data['epic_name'],  # Epic Name
            'labels': project_data['labels'],
            'components': [{'name': c} for c in project_data['components']]
        }

        epic = self.jira.create_issue(fields=epic_data)
        return {'id': epic.key, 'url': f"{self.jira._options['server']}/browse/{epic.key}"}
```

### Linear Adapter Sample

```python
class LinearAdapter(TrackingToolAdapter):
    def __init__(self, linear_config):
        self.linear = LinearClient(linear_config.api_key)

    def create_project(self, project_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create Linear project with milestones"""
        project = self.linear.projects.create(
            name=project_data['title'],
            description=project_data['description'],
            team_id=project_data['team_id'],
            state='planned',
            priority=project_data['priority'],
            target_date=project_data['target_date']
        )

        return {'id': project.id, 'url': project.url}
```

## Critical Success Rules — Non-Negotiable

### Tool-Agnostic Rules

- ✅ **Source of Truth**: ALL project data MUST come from approved Business Case and Kickoff minutes
- ✅ **No Invention**: Never create or assume project details — use `[PENDING: {specific info}]` for missing data
- ✅ **Traceability**: Every project MUST link back to its Business Case
- ✅ **Completeness**: Project cannot be created without all required fields populated

### Adaptive Integration Rules

- ✅ **Auto-Detection**: Tool detection from client configuration is mandatory
- ✅ **Fallback Strategy**: If tool detection fails, use conservative defaults with warning
- ✅ **Consistent Output**: Regardless of tool, business metadata must be preserved
- ✅ **API Validation**: Test tool connectivity before creation attempt

### Workflow Integration Rules

- ✅ **Immediate Creation**: Execute this skill within 24h of kickoff approval — no delays
- ✅ **Gate Dependency**: Project creation is prerequisite for Gate 0 → Gate 1 transition
- ✅ **Team Assignment**: Project owner becomes accountable for Gate compliance throughout SDLC
- ✅ **Sub-Project Strategy**: Projects >3 sprints automatically get phase-based sub-projects

## Success Metrics

| Metric                 | Target                         | Measurement                           |
| ---------------------- | ------------------------------ | ------------------------------------- |
| Project Creation Time  | <30 minutes post-kickoff       | Time from kickoff to project in tool  |
| Data Accuracy          | 100% fields from BC/Kickoff    | Manual validation against source docs |
| Link Integrity         | 100% projects link to BC       | Automated link checking               |
| Tool Adaptation        | 100% successful auto-detection | Adapter success rate                  |
| Cross-Tool Consistency | >95% metadata preservation     | Comparison across tool types          |

## References

- Business Case Template: `templates/product-brief.md`
- Kickoff Template: `templates/kickoff.md`
- Gate Evaluation: `templates/gate-evaluation.md`
- Tool Integrations Guide: `@docs/standards/tool-integrations.md`
- Client Configuration: `src/data/client.ts`

## Changelog

| Versión | Fecha      | Autor                            | Cambios                                                                          |
| ------- | ---------- | -------------------------------- | -------------------------------------------------------------------------------- |
| 1.0.0   | 2026-04-06 | TL: adaptive-skills-architecture | Initial adaptive skill creation — replaces epic-jira with tool-agnostic approach |
