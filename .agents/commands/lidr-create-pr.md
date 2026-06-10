---
description: Create a PR with auto-generated description, SDLC tracking and automated dev→QA handoffs
argument-hint: [ticket-id]
allowed-tools: Read, Write, Bash(git:*), Bash(npm:*), Skill(lidr-sdlc-tracking), Skill(lidr-external-sync), Skill(lidr-dev-handoff-qa), AskUserQuestion
model: sonnet
version: "2.0.1"
phase: 4
stage: development
last_updated: "2026-06-10"
updated_by: "TL: Stale-ref migration"
---

<!--
COMMAND: create-pr
VERSION: 2.0.0
AUTHOR: SDLC Enhancement Team
LAST UPDATED: 2026-03-17

PURPOSE:
Enhanced Pull Request creation with SDLC tracking integration, external tool synchronization,
automated handoff generation, and comprehensive quality validation. Runs in Phase 4
Implementation (development stage) of the unified phase model.

FEATURES:
- SDLC tracking integration (PR links to story and epic)
- Automated handoff generation with context
- External tool synchronization (Jira, Linear, Notion)
- Enhanced DoD validation with security checklist
- Smart reviewer assignment based on project context
- Automated test execution and reporting
- Portfolio-scale context awareness

USAGE:
  /lidr-create-pr PROJ-123
  /lidr-create-pr PROJ-123 --handoff=auto
  /lidr-create-pr PROJ-123 --draft --security-review
  /lidr-create-pr PROJ-123 --project=PROJ-2026-001

ARGUMENTS:
  ticket-id: Jira/Linear ticket ID (required)
  --project: Override project detection (optional)
  --handoff: auto|manual|skip handoff generation (default: auto)
  --draft: Create as draft PR (default: false)
  --security-review: Request security review (default: auto-detect)
  --sync: Enable/disable external tool sync (default: true)
  --no-notify: Skip team notifications (default: false)

RELATED COMMANDS:
  /lidr-create-branch - Enhanced branch creation
  /lidr-implement-ticket - Full workflow including enhanced PR creation
  /lidr-advance-gate 4 - Sprint aggregator after all PRs merged

CHANGELOG:
  v2.0.1 (2026-06-10): Repointed Skill() refs + skill loads to lidr-* prefixes;
                        reframed Phase 5 → unified Phase 4 Implementation/development;
                        /help → /lidr-help.
  v2.0.0 (2026-03-17): SDLC tracking and automation enhancement (then "Phase 5")
  v1.0.0 (2025-03-05): Initial release
-->

# Create PR for $1

Load: @../rules/lidr-sdlc/tech-stack.md, @../rules/lidr-sdlc/project.md, @../rules/lidr-sdlc/org.md
Load: @../skills/lidr-sdlc-tracking/SKILL.md, @../skills/lidr-external-sync/SKILL.md

## Enhanced Workflow Features

🚀 **New in v2.0**: SDLC tracking integration, automated handoffs, security checklist, portfolio awareness

## Input Validation and Project Detection

If "$1" is empty:
❌ Usage: /lidr-create-pr [TICKET-ID] [flags]

Examples:
/lidr-create-pr PROJ-123
/lidr-create-pr PROJ-123 --handoff=auto --security-review
/lidr-create-pr PROJ-123 --draft --project=PROJ-2026-001
Exit.

Extract flags from arguments:

- --project={project-id}: Override automatic project detection
- --handoff={auto|manual|skip}: Handoff generation mode (default: auto)
- --draft: Create as draft PR for review
- --security-review: Force security review request
- --sync={true|false}: External tool synchronization (default: true)
- --no-notify: Skip team notifications

## Enhanced Project and Story Context Loading

### Automatic Project Detection

Use Skill: lidr-sdlc-tracking with action "detect-project" for ticket $1.

If project found, load comprehensive context:

- Project metadata and current phase
- Story details and epic relationship
- Team composition and roles
- Quality gates and requirements
- Security and compliance context

If no project found:
⚠️ Warning: No SDLC tracking project found for $1. Creating PR with basic functionality.
Continue with enhanced features disabled.

### Story Context Integration

Use Skill: lidr-sdlc-tracking with action "get-story" for derived story ID.

Extract story context:

- Epic title and business value
- User story acceptance criteria
- Requirements traceability (RF IDs)
- Test coverage requirements
- Security implications
- Performance requirements
- External tool references

## Enhanced Git and Build Validation

### Git State Analysis

Current branch: !`git branch --show-current`
Current branch validation: Ensure follows enhanced naming convention from create-branch.

Commits analysis: !`git log origin/develop..HEAD --oneline --grep="feat\|fix\|chore\|refactor"`
Conventional commits validation: Verify commit message format compliance.

If no commits ahead:
❌ No commits to create PR for. Complete implementation first.
Suggestions: 1. Make code changes for story $1 2. Commit with conventional format: "feat(PROJ-123): description" 3. Run /lidr-create-pr $1 again
Exit.

### Enhanced Diff Analysis

Detailed diff: !`git diff origin/develop...HEAD --stat --color=never`
Files changed: !`git diff origin/develop...HEAD --name-only`

Security-sensitive files check:

```bash
SECURITY_FILES=$(git diff origin/develop...HEAD --name-only | grep -E "(auth|security|crypto|password|secret|key|cert)" || echo "")
```

Generate change categorization:

- Core business logic changes
- API changes (breaking/non-breaking)
- Database schema changes
- Security-related changes
- Infrastructure/DevOps changes
- Documentation changes

## Comprehensive DoD Validation

### Enhanced Test Execution

```bash
# Unit tests with coverage
echo "🧪 Running unit tests with coverage..."
!`npm test -- --coverage --passWithNoTests 2>&1`

# Integration tests if available
echo "🔗 Running integration tests..."
!`npm run test:integration 2>&1 || echo "No integration tests configured"`

# Linting with security rules
echo "🔍 Running enhanced linting..."
!`npm run lint -- --report-unused-disable-directives 2>&1`

# Type checking
echo "📝 Type checking..."
!`npx tsc --noEmit 2>&1 || echo "No TypeScript configuration"`

# Build verification
echo "🏗️ Build verification..."
!`npm run build 2>&1`

# Security audit
echo "🔒 Security audit..."
!`npm audit --audit-level=moderate 2>&1 || echo "Security audit issues found"`
```

### Story-Specific Validation

If story context available:

- Verify acceptance criteria coverage in tests
- Check requirements traceability
- Validate security checklist items
- Confirm performance requirements met

### Quality Gate Integration

Load quality requirements from project:

```yaml
# From sdlc-tracking.yaml
quality_requirements:
  code_coverage: 0.80
  security_scan: true
  performance_test: false
  documentation: true
```

Validate against project-specific thresholds:

- Code coverage meets project minimum
- Security scan passes with zero high/critical
- Performance benchmarks maintained
- Documentation updated for API changes

### Validation Results Processing

Generate validation report:

```typescript
interface ValidationReport {
  overall: "pass" | "warning" | "fail";
  tests: { status: string; coverage?: number };
  security: { status: string; issues: string[] };
  build: { status: string; errors: string[] };
  story: { criteria_met: number; total_criteria: number };
}
```

If validation failures detected:
Use AskUserQuestion:

- question: "Quality validations failed. How to proceed?"
- header: "Enhanced DoD Validation"
- options:
  - "Create Draft PR (fix issues before review)"
  - "Fix Issues Now (cancel and resolve)"
  - "Override (create PR with warnings)"
  - "Request Help (get team guidance)"

## Smart Context-Aware PR Description Generation

### Enhanced Description Template

Using story context, requirements traceability, and change analysis:

```markdown
## $1: {story.title}

### 📋 Story Context

**Epic**: {epic.title}
**Business Value**: {story.business_value}
**Story Points**: {story.estimation}
**Sprint**: {story.sprint}

### 🎯 What Changed

{2-3 sentences describing changes in business language, derived from story acceptance criteria and code changes}

### 🔗 Traceability

- **Story**: [{story.id}]({link-to-story-file})
- **Epic**: [{epic.id}]({link-to-epic-file})
- **Requirements**: {linked-RF-IDs}
- **External Tools**:
  - Jira: [$1]({jira-link})
  - Linear: [{linear.id}]({linear-link}) _(if applicable)_
  - Notion: [{notion.id}]({notion-link}) _(if applicable)_

### 🔧 Technical Implementation

#### Changed Components

| Component | Type | Impact | Security Risk |
| --------- | ---- | ------ | ------------- |

{for each significant change}
| {component} | {type} | {impact-level} | {security-assessment} |

#### Architecture Changes

{detected architecture changes from ADR references or significant structural changes}

#### Breaking Changes

{auto-detected API changes, database schema changes, etc.}

- [ ] Migration guide included
- [ ] Versioning strategy documented
- [ ] Stakeholders notified

### 🧪 Testing Strategy

#### Acceptance Criteria Coverage

{map each acceptance criterion to test coverage}

- [ ] **AC1**: {criterion-1} → Test: {test-file}
- [ ] **AC2**: {criterion-2} → Test: {test-file}

#### Test Execution Results

- **Unit Tests**: ✅ {passed}/{total} | Coverage: {coverage}%
- **Integration Tests**: ✅ {status}
- **Security Tests**: {security-scan-results}
- **Performance Tests**: {performance-test-results}

#### Manual Testing Guide

1. **Setup**: {environment-specific-setup}
2. **Test Scenarios**:
   {generated from BDD acceptance criteria}
3. **Expected Outcomes**: {derived from story definition}

### 🔒 Security Review

#### Security Checklist

{auto-generated based on changed files and story context}

- [ ] Authentication/authorization changes reviewed
- [ ] Input validation implemented
- [ ] Sensitive data handling compliant
- [ ] OWASP Top 10 considerations addressed
- [ ] GDPR/privacy requirements met

#### Security Impact Assessment

**Risk Level**: {Low|Medium|High}
**Sensitive Areas**: {identified-sensitive-components}
**Reviewer Required**: {auto-assigned-security-reviewer}

### 📊 Performance Impact

#### Performance Metrics

{if performance monitoring available}

- **Build Time**: {build-duration-change}
- **Bundle Size**: {bundle-size-impact}
- **Runtime Performance**: {performance-test-results}

### 📚 Documentation Updates

#### Required Documentation

- [ ] API documentation updated (if API changes)
- [ ] Architecture diagrams updated (if structural changes)
- [ ] User guides updated (if UX changes)
- [ ] Deployment notes updated (if infrastructure changes)

### ✅ Definition of Done

#### Code Quality

- [x] Code complete and tested
- [x] Code review ready
- [x] Tests passing ({test-pass-rate})
- [x] Security scan clean
- [x] Build successful

#### Story Requirements

- [ ] All acceptance criteria met
- [ ] Requirements traceability maintained
- [ ] External tool references updated
- [ ] Team review completed

#### Deployment Readiness

- [ ] Change request prepared (if needed)
- [ ] Rollback plan available
- [ ] Monitoring alerts configured
- [ ] Documentation complete

### 🚀 Deployment Plan

#### Deployment Strategy

{derived from story context and change impact}
**Type**: {blue-green|rolling|hotfix}
**Risk Level**: {risk-assessment}
**Rollback Time**: {estimated-rollback-duration}

#### Post-Deployment Verification

1. **Health Checks**: {service-health-endpoints}
2. **Feature Verification**: {key-feature-tests}
3. **Performance Monitoring**: {performance-dashboards}
4. **Error Monitoring**: {error-tracking-setup}

---

**Generated by Enhanced SDLC Workflow v2.0**
Last updated: {timestamp}
Project: {project.name} | Phase: {current-phase} | Gate: {current-gate}
```

## Enhanced PR Configuration

### Smart Reviewer Assignment

#### Project-Based Assignment

From project context and changed files:

- **Mandatory**: Tech Lead from project team
- **Code Owners**: Based on CODEOWNERS file
- **Component Experts**: Based on file patterns and team expertise
- **Security Review**: Auto-assigned if security-sensitive changes
- **Performance Review**: Auto-assigned if performance-critical changes

#### Domain-Specific Reviewers

```typescript
const getReviewers = (changedFiles: string[], storyContext: any) => {
  const reviewers = ["tech-lead"]; // Always required

  // Security reviewers
  if (hasSecurityChanges(changedFiles) || storyContext.security_impact) {
    reviewers.push("security-lead");
  }

  // API reviewers
  if (hasApiChanges(changedFiles)) {
    reviewers.push("api-architect");
  }

  // Database reviewers
  if (hasDatabaseChanges(changedFiles)) {
    reviewers.push("database-lead");
  }

  return reviewers;
};
```

### Intelligent Labeling System

#### Automated Label Generation

```typescript
const generateLabels = (changes: ChangeAnalysis, story: Story) => {
  const labels = [];

  // Type labels
  labels.push(`type:${detectChangeType(changes)}`); // feat, fix, refactor, etc.

  // Size labels
  const size = calculatePRSize(changes);
  labels.push(`size:${size}`); // xs, s, m, l, xl

  // Component labels
  const components = detectComponents(changes.files);
  labels.push(...components.map((c) => `component:${c}`));

  // Priority labels
  labels.push(`priority:${story.priority}`);

  // Security labels
  if (hasSecurityImplications(changes)) {
    labels.push("security-review-required");
  }

  // Performance labels
  if (hasPerformanceImplications(changes)) {
    labels.push("performance-review-required");
  }

  return labels;
};
```

### External Tool Synchronization

If --sync=true (default):
Use Skill: lidr-external-sync with comprehensive PR context:

#### Jira Integration

- Transition ticket to "In Review"
- Add PR link to ticket comments
- Update development completion timestamp
- Link to handoff documentation
- Add test execution summary

#### Linear Integration

- Update issue state to "In Review"
- Add PR reference to issue
- Update completion percentage
- Cross-reference to SDLC tracking

#### Notion Integration

- Update page status to "In Review"
- Add PR URL to page properties
- Update progress tracking
- Link to implementation documentation

## Automated Handoff Generation

### Enhanced Handoff Creation

If --handoff=auto (default) or --handoff=manual:
Use Skill: lidr-dev-handoff-qa with enhanced context:

```typescript
const handoffContext = {
  story: storyContext,
  epic: epicContext,
  project: projectContext,
  pr: prContext,
  validation: validationReport,
  security: securityAssessment,
  testing: testingStrategy,
};
```

#### Comprehensive Handoff Document

Generated handoff includes:

- **Story Context**: Full traceability chain
- **Implementation Summary**: What was built and how
- **Quality Metrics**: Test coverage, security scan, performance
- **Testing Guide**: Detailed test scenarios with environment setup
- **Known Issues**: Identified limitations or technical debt
- **Deployment Notes**: Special deployment considerations
- **Rollback Plan**: How to revert if issues arise

#### Handoff Integration

- Save to: `docs/projects/{project-id}/implementation/handoffs/dev-to-qa/`
- Link in PR description
- Attach to Jira ticket
- Notify QA team automatically
- Update story status tracking

## Enhanced PR Creation and Notification

### GitHub PR Creation

```bash
# Enhanced gh pr create with comprehensive context
gh pr create \
  --title "$1: {story.title}" \
  --body-file pr-description.md \
  --head {current-branch} \
  --base {determined-base-branch} \
  --label "{auto-generated-labels}" \
  --reviewer "{smart-reviewer-list}" \
  --assignee "{story.assignee}" \
  $(if draft_mode; then echo "--draft"; fi)
```

### Team Notification Strategy

If --no-notify flag not set:

#### Notification Recipients

```typescript
const getNotificationRecipients = (project: Project, story: Story, pr: PR) => {
  return [
    ...pr.reviewers,
    story.assignee,
    project.tech_lead,
    ...(story.sprint ? [`sprint-${story.sprint}-team`] : []),
    ...(hasSecurityChanges ? ["security-team"] : []),
    "qa-team", // Always notify for handoff
  ];
};
```

#### Multi-Channel Notifications

- **Slack**: Project channel + reviewer DMs
- **Email**: Stakeholder summary (if configured)
- **Jira**: Ticket comments with PR link
- **Dashboard**: Project health dashboard update

## Comprehensive Success Reporting

### Enhanced Success Report

```
/lidr-create-pr $1 ✅

📋 Story Integration:
   Project:     {project.name} ({project.id})
   Epic:        {epic.title} ({epic.id})
   Story:       {story.title} ({story.id})
   Sprint:      {story.sprint}
   Phase:       {project.current_phase} - {phase_name}

🚀 PR Created:
   Number:      #{pr.number}
   Title:       {pr.title}
   URL:         {pr.url}
   Status:      {Ready for Review | Draft}
   Base:        {base_branch} ← {current_branch}

👥 Review Process:
   Reviewers:   {reviewer.list.with.expertise}
   Labels:      {auto.generated.labels}
   Size:        {pr.size} ({files.changed} files, +{lines.added}/-{lines.removed})

🔒 Security Assessment:
   Risk Level:  {security.risk.level}
   Scan Results: {security.scan.summary}
   Review Req.: {security.reviewer.assigned}

🧪 Quality Validation:
   Tests:       ✅ {tests.passed}/{tests.total} | Coverage: {coverage}%
   Build:       ✅ {build.status} | Duration: {build.time}s
   Lint:        ✅ {lint.status} | Issues: {lint.issues}
   Security:    ✅ {security.scan} | Vulnerabilities: {vuln.count}

📋 Requirements Traceability:
   Acceptance:  {criteria.met}/{criteria.total} criteria covered
   RFs Linked:  {rf.count} functional requirements
   Tests Link:  {test.coverage.by.requirement}

🔄 External Sync:
   Jira:        $1 → "In Review" ✅
   Linear:      {linear.id} → "In Review" ✅ (if applicable)
   Notion:      {notion.id} → Updated ✅ (if applicable)
   SDLC Track:  {story.file} → Updated ✅

📦 Handoff Generated:
   Document:    {handoff.file.path}
   QA Team:     Notified ✅
   Test Guide:  {test.scenarios} scenarios ready
   Environment: {test.environment.setup}

📊 Project Impact:
   Phase Progress: {phase.completion}%
   Epic Progress:  {epic.completion}%
   Sprint Health:  {sprint.health.score}

🎯 Next Steps:
   1. Await code review from: {reviewer.list}
   2. Address review feedback
   3. Monitor CI/CD pipeline: {ci.pipeline.url}
   4. QA testing begins after merge
   5. Track progress: /lidr-track-sdlc update {project.id}

📈 Developer Metrics:
   Story Lead Time: {story.lead.time}
   Implementation Time: {implementation.duration}
   Review Readiness Score: {review.readiness.score}/10
```

### Error Recovery and Guidance

If any step fails:

```
❌ Enhanced PR creation failed at: {failure.step}

🔧 Diagnosis:
   Issue:       {error.description}
   Likely Cause: {error.analysis}
   Impact:      {impact.assessment}

🛠️ Recovery Options:
   1. Auto-fix:    /lidr-create-pr $1 --fix-{specific.issue}
   2. Manual fix:  {specific.manual.steps}
   3. Skip sync:   /lidr-create-pr $1 --sync=false
   4. Get help:    /lidr-help pr-creation-issues

📞 Escalation:
   - Check project health: /lidr-track-sdlc health {project.id}
   - Validate setup: /lidr-validate-project-docs {project.id}
   - Team support: {team.support.channels}

🔄 Partial Success Recovery:
   {what.was.completed.successfully}
   {what.needs.manual.completion}
```

## Portfolio Integration and Analytics

### Portfolio-Scale Features

- **Cross-project learning**: Apply successful patterns from similar PRs
- **Team velocity tracking**: Measure PR creation → merge time across portfolio
- **Quality trend analysis**: Track quality metrics across all projects
- **Risk pattern detection**: Identify recurring security/performance risks

### Integration with SDLC Dashboard

- Real-time PR status across portfolio
- Quality gate progression tracking
- Team workload visualization
- Bottleneck identification and resolution

---

## Migration and Compatibility

### Backward Compatibility

- `/lidr-create-pr` command remains unchanged
- `/lidr-create-pr` provides all new functionality
- Gradual migration path for existing projects
- Feature flags for progressive enhancement

### Training and Adoption

- Enhanced error messages guide users to new features
- Context-aware help suggestions
- Automated onboarding for new team members
- Success pattern sharing across teams
