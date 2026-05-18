---
name: "document-project"
description: "LIDR SDLC standard workflow orchestration for complete project documentation with step-by-step guidance and validation integration"
tier: 1
model: sonnet
authorized_roles:
  - Tech Lead
  - Product Owner
  - Project Manager
version: "2.0.0"
last_updated: "2026-03-15"
orchestrates:
  - project-classifier
  - document-discovery
  - prd-funcional
  - prd-tecnico
  - architecture-doc
  - generate-rf
  - generate-nfr
  - epic-breakdown
  - validate-requirements
---

# Command: Enhanced Document Project (LIDR SDLC Standard)

> **LIDR SDLC Methodology**: Complete documentation workflow orchestration
> **Enhancement**: Adds intelligent project classification + domain-specific domain expertise
> **Automation Level**: Guided workflow con validación integrada

## Purpose

Orquesta el workflow completo de documentación de proyecto siguiendo la LIDR SDLC Methodology usando nuestro ecosistema de skills de Claude Code. Incluye detección automática de tipo de proyecto, inventario de documentos, y generación guiada paso-a-paso.

## When to Use

- **New project setup**: Crear documentación completa desde cero
- **Brownfield documentation**: Documentar proyectos existentes sin docs formales
- **Documentation audit**: Evaluar y mejorar documentación existente
- **Compliance preparation**: Preparar docs para auditoría o evaluación

## Workflow Overview

### Phase 1: Discovery & Classification (LIDR SDLC Step 1-2)

1. 🔍 **Auto-detect project type** → `project-classifier`
2. 📋 **Inventory existing docs** → `document-discovery`
3. ⚠️ **Resolve conflicts** → Manual resolution required
4. ✅ **Confirm readiness** → Gate validation

### Phase 2: Context Gathering (LIDR SDLC Step 3-4)

5. 📝 **Gather business context** → `business-case` (if missing)
6. 👥 **Map stakeholders** → `stakeholder-map` (if missing)
7. ⚖️ **Assess risks** → `risk-log` (if needed)

### Phase 3: Requirements Documentation (LIDR SDLC Step 5-8)

8. 🎯 **Generate PRD Funcional** → `prd-funcional`
9. ⚙️ **Generate PRD Técnico** → `prd-tecnico`
10. 🔍 **Cross-validation review** → `review-cruzado`
11. ✅ **Validate PRDs** → Built-in validation

### Phase 4: Specifications (LIDR SDLC Step 9-11)

12. 📋 **Generate Functional Requirements** → `generate-rf`
13. ⚡ **Generate Non-Functional Requirements** → `generate-nfr`
14. 🔗 **Validate requirements** → `validate-requirements`
15. 🏗️ **Architecture documentation** → `architecture-doc`

### Phase 5: Planning & Breakdown (LIDR SDLC Step 12+)

16. 🎪 **Epic breakdown** → `epic-breakdown`
17. 📖 **User stories generation** → `user-stories`
18. ✅ **Final validation** → Complete workflow validation

## Command Execution

```yaml
# Enhanced frontmatter tracking (LIDR SDLC standard)
stepsCompleted: []
workflowType: "complete-documentation"
inputDocuments: []
classification:
  projectType: ""
  domain: ""
  complexity: ""
  techStack: []
documentCounts:
  existing: 0
  generated: 0
  validated: 0
lastStep: ""
validation:
  overall_score: 0.0
  step_scores: {}
  issues: []
```

### Step 1: Project Classification

```bash
/document-project [project-path]
```

**Auto-executes:**

1. 🤖 **project-classifier** → Detect project type, tech stack, complexity
2. 📊 Update frontmatter with classification results
3. 🎯 Generate documentation requirements matrix
4. ✅ Present classification for confirmation

**Output:**

```yaml
# Classification results added to workflow tracking
classification:
  projectType: "Web Application"
  subType: "React SPA + Node.js API"
  domain: "domain-specific Identity Verification"
  complexity: "High"
  techStack: ["React", "Node.js", "PostgreSQL", "Docker"]
documentationRequirements:
  critical: ["prd-funcional", "prd-tecnico", "architecture-doc", "security-checklist"]
  recommended: ["test-plan", "ux-design-spec", "vuln-assessment"]
  domain-specific: ["gdpr-compliance", "domain-specific-template-security"]
```

### Step 2: Document Discovery

**Auto-executes:** 2. 📋 **document-discovery** → Inventory existing documents 3. ⚠️ Detect duplicates and conflicts 4. 📝 Present organized inventory 5. 🚫 **BLOCK if critical conflicts** → Must be resolved manually

**Example Conflict:**

```
⚠️ CRITICAL CONFLICT DETECTED:
- PRD exists as both whole.md AND prd/ folder
- Architecture document is stale (60+ days)
- Epic breakdown missing (critical for planning)

REQUIRED ACTIONS:
1. Choose PRD format: Remove duplicate version
2. Update or confirm stale architecture
3. Confirm readiness to generate missing docs

Cannot proceed until conflicts resolved.
[R] Resolve conflicts manually
[C] Continue after resolution
```

### Step 3-18: Guided Workflow Execution

**For each remaining step:**

1. ✅ **Check prerequisites** → Previous steps completed
2. 📋 **Load appropriate skill** → Context-aware based on project type
3. 🎯 **Execute with project context** → Pass classification + existing docs
4. ✅ **Validate output** → Built-in quality validation
5. 📝 **Update frontmatter** → Track step completion + validation scores
6. ➡️ **Present results** → Show generated content + next step

**Example Step Execution:**

```
Step 8/18: Generate PRD Funcional

Using project context:
- Type: Web Application (React SPA + Node.js API)
- Domain: domain-specific Identity Verification
- Existing docs: business-case.md, stakeholder-map.md

Executing skill: prd-funcional
✅ Generated: prd-funcional-domain-specific-platform.md (4.2KB)
✅ Validation: 4.1/5.0 (Good - minor improvements needed)
✅ Step completion tracked in frontmatter

[C] Continue to Step 9: Generate PRD Técnico
[V] View generated document
[E] Edit/improve current document
```

## Enhanced Frontmatter (LIDR SDLC Standard)

```yaml
---
# Original fields
id: documentation-workflow-project-alpha
version: "1.0.0"
last_updated: "2026-03-15"
status: active

# LIDR SDLC Methodology enhancements
stepsCompleted: ["project-classification", "document-discovery", "prd-funcional", "prd-tecnico"]
workflowType: "complete-documentation"
inputDocuments: ["business-case.md", "stakeholder-map.md"]

# Project classification
classification:
  projectType: "Web Application"
  subType: "React SPA + Node.js API"
  domain: "domain-specific Identity Verification"
  complexity: "High"
  techStack: ["React", "Node.js", "PostgreSQL", "Docker"]
  confidence: 0.92

# Document tracking
documentCounts:
  existing: 3
  generated: 8
  validated: 8
  total_documents: 11

# Edit history (semantic changes)
editHistory:
  - date: "2026-03-15"
    step: "project-classification"
    changes: "Auto-detected domain-specific web application with high complexity"
  - date: "2026-03-15"
    step: "document-discovery"
    changes: "Found 3 existing docs, resolved PRD format conflict"
  - date: "2026-03-15"
    step: "prd-funcional"
    changes: "Generated PRD Funcional with domain-specific compliance requirements"

# Validation integration
validationResults:
  overall_score: 4.2
  overall_status: "Good"
  step_scores:
    prd_funcional: 4.1
    prd_tecnico: 4.3
    architecture_doc: 4.0
  validation_engine: "{{CLIENT_NAME}} SDLC Validation Engine v1.0"

# Document relationships
relationships:
  dependsOn: ["business-case.md", "stakeholder-map.md"]
  generates: ["prd-funcional.md", "prd-tecnico.md", "architecture.md"]
  feedsInto: ["epic-breakdown.md", "user-stories.md"]

# Workflow state
currentStep: 4
totalSteps: 18
nextStep: "review-cruzado"
estimatedTimeRemaining: "45 minutes"
---
```

## Context-Aware Template Selection

```python
# Intelligent template selection based on project classification
def select_templates(classification, step):
    base_path = f"skills/{step}/examples/"

    # Primary selection by project type
    project_templates = base_path + f"{classification.project_type.lower()}/"

    # Fallback to domain-specific
    domain_templates = base_path + f"domains/{classification.domain.lower()}/"

    # Final fallback to generic
    generic_templates = base_path + "generic/"

    # Load in priority order
    for template_path in [project_templates, domain_templates, generic_templates]:
        if exists(template_path):
            return load_templates(template_path, classification)

    return generic_fallback()
```

## Menu-Driven Navigation (LIDR SDLC Standard)

```
**Step 8/18 Complete: PRD Funcional Generated**

Generated document: prd-funcional-domain-specific-platform.md
Validation score: 4.1/5.0 (Good)
Estimated time remaining: 45 minutes

**Select Next Action:**
[C] Continue to Step 9: Generate PRD Técnico
[V] View generated document
[E] Edit/improve current document
[S] Skip to specific step
[P] Pause workflow (save progress)
[Q] Quit workflow (save state)
[H] Help with current step

**Progress:** ████████░░░░░░░░░░ 8/18 steps (44%)
```

## Validation Integration

### Continuous Validation

```python
# After each step, run validation
def validate_step_output(step_name, document_path):
    validation_result = run_validation_engine(document_path)

    # Update frontmatter with scores
    update_frontmatter(document_path, {
        'validationResults': {
            'step_scores': {step_name: validation_result.score},
            'last_validation': datetime.now().isoformat(),
            'issues': validation_result.issues
        }
    })

    # Block workflow if critical issues
    if validation_result.has_critical_issues():
        return {
            'can_proceed': False,
            'reason': 'Critical validation issues must be fixed',
            'issues': validation_result.critical_issues
        }

    return {'can_proceed': True, 'result': validation_result}
```

## Error Handling & Recovery

### Conflict Resolution

```yaml
conflict_resolution:
  duplicate_documents:
    action: "manual_selection"
    block_workflow: true
    message: "Choose one version and remove/rename other"

  stale_documents:
    action: "confirm_or_update"
    block_workflow: false
    message: "Document is 60+ days old. Update or confirm still valid?"

  missing_critical:
    action: "generate_or_provide"
    block_workflow: true
    message: "Critical document required for workflow"
```

### Workflow Recovery

```python
def resume_workflow(workflow_state):
    """Resume interrupted workflow from saved state"""
    last_step = workflow_state['lastStep']
    completed_steps = workflow_state['stepsCompleted']

    # Validate completed steps still valid
    for step in completed_steps:
        if not validate_step_output(step):
            # Re-run invalid step
            return resume_from_step(step)

    # Continue from next step
    return continue_from_step(last_step + 1)
```

## Success Metrics

| Metric                       | Target   | Measurement                                |
| ---------------------------- | -------- | ------------------------------------------ |
| **Workflow Completion Rate** | >90%     | Projects that complete all 18 steps        |
| **Average Validation Score** | >4.0/5.0 | Quality of generated documents             |
| **Time to Complete**         | <2 hours | For high-complexity projects               |
| **Manual Intervention Rate** | <15%     | Steps requiring human correction           |
| **Template Accuracy**        | >95%     | Correct template selection by project type |

## Integration Points

- **Triggers**: `/document-project`, project onboarding workflows
- **Dependencies**: All skill ecosystem (project-classifier, document-discovery, etc.)
- **Outputs**: Complete documentation set, validation reports, workflow state
- **Feeds Into**: Project management systems, quality gates, compliance audits

---

**ROI**: 8-16 horas de documentación manual → 1-2 horas workflow guiado
**LIDR SDLC Level**: Advanced workflow sophistication with domain intelligence
**Advantage**: + Intelligent project classification + domain-specific domain expertise + Automated validation
