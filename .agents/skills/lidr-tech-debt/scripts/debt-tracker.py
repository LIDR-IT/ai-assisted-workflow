#!/usr/bin/env python3
"""
{{CLIENT_NAME}} Technical Debt Tracker and User Story Generator
Manages technical debt lifecycle and generates Sprint-ready User Stories.
"""

import json
import argparse
import os
import sys
from pathlib import Path
from typing import Dict, List, Optional, Tuple
from dataclasses import dataclass, asdict
from datetime import datetime, timedelta
from enum import Enum

# Tool names used as output labels / format identifiers. Defaults preserve the
# current behavior byte-for-byte; override via environment variables to retarget
# the generated artifacts at a different toolchain.
TRACKING_TOOL = os.getenv("LIDR_TRACKING_TOOL", "Jira")
CODE_ANALYSIS_TOOL = os.getenv("LIDR_CODE_ANALYSIS_TOOL", "SonarQube")

class DebtStatus(Enum):
    IDENTIFIED = "Identified"
    PLANNED = "Planned"
    IN_PROGRESS = "In Progress"
    RESOLVED = "Resolved"
    DEFERRED = "Deferred"

@dataclass
class UserStory:
    id: str
    title: str
    description: str
    acceptance_criteria: List[str]
    story_points: int
    priority: str
    epic: str
    labels: List[str]
    debt_items: List[str]  # Related debt item IDs

@dataclass
class DebtTracker:
    id: str
    status: DebtStatus
    created_date: str
    planned_sprint: Optional[str] = None
    assigned_developer: Optional[str] = None
    resolved_date: Optional[str] = None
    resolution_notes: Optional[str] = None
    actual_cost_hours: Optional[int] = None
    related_user_stories: List[str] = None
    last_updated: Optional[str] = None

    def __post_init__(self):
        if self.related_user_stories is None:
            self.related_user_stories = []
        if self.last_updated is None:
            self.last_updated = datetime.now().isoformat()

class TechnicalDebtManager:
    def __init__(self, project_name: str = "{{CLIENT_NAME}}-SDLC"):
        self.project_name = project_name
        self.debt_registry: Dict[str, dict] = {}
        self.debt_tracking: Dict[str, DebtTracker] = {}
        self.user_stories: Dict[str, UserStory] = {}

        # User Story templates for different debt categories
        self.story_templates = {
            'code': {
                'title_template': "Refactor {component} to improve code quality",
                'description_template': """As a **developer**,
I want to refactor {component} to address code quality issues,
So that the codebase is more maintainable and future development is easier.

**Technical Context:**
{technical_context}

**Current Problem:**
{problem_description}""",
                'epic': 'Code Quality',
                'base_points': 5
            },
            'architecture': {
                'title_template': "Improve {component} architecture",
                'description_template': """As a **tech lead**,
I want to improve the architecture of {component},
So that the system is more scalable and maintainable.

**Architecture Issues:**
{technical_context}

**Impact:**
{problem_description}""",
                'epic': 'Technical Architecture',
                'base_points': 8
            },
            'test': {
                'title_template': "Increase test coverage for {component}",
                'description_template': """As a **QA engineer**,
I want to increase test coverage for {component},
So that we have better confidence in releases and catch bugs early.

**Current Coverage Issues:**
{technical_context}

**Testing Gaps:**
{problem_description}""",
                'epic': 'Test Quality',
                'base_points': 3
            },
            'documentation': {
                'title_template': "Improve documentation for {component}",
                'description_template': """As a **developer**,
I want comprehensive documentation for {component},
So that team members can understand and maintain the code efficiently.

**Documentation Gaps:**
{technical_context}

**Impact on Team:**
{problem_description}""",
                'epic': 'Documentation',
                'base_points': 2
            },
            'dependency': {
                'title_template': "Update dependencies for {component}",
                'description_template': """As a **security engineer**,
I want to update vulnerable dependencies in {component},
So that security risks are minimized and compliance is maintained.

**Security Issues:**
{technical_context}

**Compliance Impact:**
{problem_description}""",
                'epic': 'Security & Dependencies',
                'base_points': 5
            }
        }

    def load_debt_registry(self, registry_file: str) -> bool:
        """Load debt registry from the code analysis tool output"""
        try:
            registry_path = Path(registry_file)
            if registry_path.suffix == '.json':
                # Load from JSON
                with open(registry_path, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    self.debt_registry = data.get('debt_items', {})
            else:
                print(f"⚠️  Markdown registry detected. Please provide JSON output from sonarqube-analyzer.py")
                return False

            print(f"✅ Loaded {len(self.debt_registry)} debt items from registry")

            # Initialize tracking for new items
            for debt_id in self.debt_registry:
                if debt_id not in self.debt_tracking:
                    self.debt_tracking[debt_id] = DebtTracker(
                        id=debt_id,
                        status=DebtStatus.IDENTIFIED,
                        created_date=datetime.now().isoformat()
                    )

            return True

        except Exception as e:
            print(f"❌ Error loading debt registry: {e}")
            return False

    def generate_user_stories_for_sprint(self, sprint_capacity_hours: int = 400, debt_percentage: float = 0.20) -> List[UserStory]:
        """Generate User Stories for upcoming sprint based on capacity and debt priority"""

        # Calculate available debt capacity
        debt_capacity_hours = int(sprint_capacity_hours * debt_percentage)
        print(f"📊 Sprint capacity: {sprint_capacity_hours}h | Debt allocation: {debt_capacity_hours}h ({debt_percentage*100}%)")

        # Get prioritized debt items
        prioritized_items = self._get_debt_items_for_planning()

        # Generate user stories within capacity
        generated_stories = []
        current_capacity = 0

        for debt_id, debt_data in prioritized_items:
            if current_capacity >= debt_capacity_hours:
                break

            # Get tracking info
            tracker = self.debt_tracking.get(debt_id)
            if tracker and tracker.status in [DebtStatus.RESOLVED, DebtStatus.IN_PROGRESS]:
                continue  # Skip already handled items

            # Generate user story
            user_story = self._generate_user_story_from_debt(debt_id, debt_data)
            if user_story:
                # Estimate story points based on debt item cost
                story_hours = debt_data.get('remediation_cost_hours', 8)
                if current_capacity + story_hours <= debt_capacity_hours:
                    generated_stories.append(user_story)
                    current_capacity += story_hours

                    # Update tracking
                    if debt_id in self.debt_tracking:
                        self.debt_tracking[debt_id].status = DebtStatus.PLANNED
                        self.debt_tracking[debt_id].planned_sprint = f"Sprint-{datetime.now().strftime('%Y-%W')}"
                        self.debt_tracking[debt_id].last_updated = datetime.now().isoformat()

        print(f"✅ Generated {len(generated_stories)} user stories ({current_capacity}h / {debt_capacity_hours}h capacity)")
        return generated_stories

    def _get_debt_items_for_planning(self) -> List[Tuple[str, dict]]:
        """Get prioritized debt items ready for sprint planning"""
        items = []

        for debt_id, debt_data in self.debt_registry.items():
            # Convert priority from enum string back to comparable value
            priority_text = debt_data.get('priority', 'DEFER')
            priority_order = {'DO_FIRST': 1, 'PLAN': 2, 'OPPORTUNISTIC': 3, 'DEFER': 4}
            priority_value = priority_order.get(priority_text, 4)

            # Get severity value
            severity_text = debt_data.get('severity', 'MEDIUM')
            severity_order = {'CRITICAL': 1, 'HIGH': 2, 'MEDIUM': 3, 'LOW': 4}
            severity_value = severity_order.get(severity_text, 3)

            items.append((debt_id, debt_data, priority_value, severity_value))

        # Sort by priority first, then severity
        items.sort(key=lambda x: (x[2], x[3]))

        return [(item[0], item[1]) for item in items]

    def _generate_user_story_from_debt(self, debt_id: str, debt_data: dict) -> Optional[UserStory]:
        """Generate user story from debt item"""
        try:
            # Extract debt item information
            category = debt_data.get('category', 'Code').lower()
            title = debt_data.get('title', 'Technical debt item')
            description = debt_data.get('description', '')
            affected_files = debt_data.get('affected_files', [])
            cost_hours = debt_data.get('remediation_cost_hours', 8)
            evidence = debt_data.get('evidence', '')
            proposed_fix = debt_data.get('proposed_fix', '')

            # Get template for category
            template = self.story_templates.get(category, self.story_templates['code'])

            # Extract component name from affected files or title
            component = self._extract_component_name(affected_files, title)

            # Generate user story ID
            story_id = f"US-DEBT-{debt_id.split('-')[-1]}"

            # Generate title
            us_title = template['title_template'].format(component=component)

            # Generate description
            us_description = template['description_template'].format(
                component=component,
                technical_context=evidence[:300] + "..." if len(evidence) > 300 else evidence,
                problem_description=description[:300] + "..." if len(description) > 300 else description
            )

            # Generate acceptance criteria
            acceptance_criteria = self._generate_acceptance_criteria(debt_data, proposed_fix)

            # Calculate story points (Fibonacci scale: 1, 2, 3, 5, 8, 13)
            base_points = template['base_points']
            if cost_hours <= 2:
                story_points = 1
            elif cost_hours <= 4:
                story_points = 2
            elif cost_hours <= 8:
                story_points = 3
            elif cost_hours <= 16:
                story_points = 5
            elif cost_hours <= 24:
                story_points = 8
            else:
                story_points = 13

            # Adjust for complexity
            sonar_issues_count = debt_data.get('sonarqube_issues_count', 1)
            if sonar_issues_count > 20:
                story_points = min(13, story_points + 2)

            # Generate labels
            labels = [
                'technical-debt',
                category,
                debt_data.get('priority', 'PLAN').lower().replace('_', '-'),
                debt_data.get('severity', 'MEDIUM').lower()
            ]

            user_story = UserStory(
                id=story_id,
                title=us_title,
                description=us_description,
                acceptance_criteria=acceptance_criteria,
                story_points=story_points,
                priority=debt_data.get('priority', 'PLAN'),
                epic=template['epic'],
                labels=labels,
                debt_items=[debt_id]
            )

            self.user_stories[story_id] = user_story
            return user_story

        except Exception as e:
            print(f"⚠️  Error generating user story for {debt_id}: {e}")
            return None

    def _extract_component_name(self, affected_files: List[str], title: str) -> str:
        """Extract component name from files or title"""
        if not affected_files:
            # Try to extract from title
            words = title.lower().split()
            technical_words = ['complexity', 'duplication', 'coverage', 'security']
            for word in words:
                if word not in technical_words and len(word) > 3:
                    return word.title()
            return "Component"

        # Extract from file paths
        first_file = affected_files[0]
        path_parts = first_file.split('/')

        # Look for meaningful directory names
        meaningful_parts = []
        for part in path_parts:
            if part and part not in ['.', '..', 'src', 'lib', 'components', 'utils']:
                meaningful_parts.append(part)

        if meaningful_parts:
            # Take the most specific (last) meaningful part
            component = meaningful_parts[-1]
            # Remove file extension if present
            if '.' in component:
                component = component.split('.')[0]
            return component.title()

        return "Component"

    def _generate_acceptance_criteria(self, debt_data: dict, proposed_fix: str) -> List[str]:
        """Generate BDD-style acceptance criteria"""
        category = debt_data.get('category', 'Code').lower()
        sonar_issues = debt_data.get('sonarqube_issues_count', 1)
        cost_hours = debt_data.get('remediation_cost_hours', 8)

        criteria = []

        if category == 'code':
            criteria.extend([
                f"Given the codebase has {sonar_issues} code quality issues",
                "When I implement the refactoring changes",
                f"Then the {CODE_ANALYSIS_TOOL} issues for this component are reduced by at least 80%",
                "And the code complexity metrics improve",
                "And existing functionality remains intact (all tests pass)"
            ])
        elif category == 'test':
            criteria.extend([
                "Given the current test coverage is insufficient",
                "When I add comprehensive test cases",
                "Then test coverage for affected components increases to at least 80%",
                "And all new tests pass consistently",
                "And regression risks are minimized"
            ])
        elif category == 'architecture':
            criteria.extend([
                "Given the current architecture has design issues",
                "When I implement the architectural improvements",
                "Then component coupling is reduced",
                "And the system follows SOLID principles",
                "And performance is maintained or improved"
            ])
        elif category == 'documentation':
            criteria.extend([
                "Given the documentation is incomplete or outdated",
                "When I create comprehensive documentation",
                "Then all public APIs are documented",
                "And setup/usage instructions are clear",
                "And the documentation is easily discoverable"
            ])
        elif category == 'dependency':
            criteria.extend([
                "Given there are vulnerable or outdated dependencies",
                "When I update the dependencies",
                "Then all security vulnerabilities are resolved",
                "And the application functions correctly with new versions",
                "And dependency audit shows clean results"
            ])

        # Add effort estimation criteria
        criteria.append(f"And the work is completed within the estimated {cost_hours} hours")

        # Add validation criteria
        criteria.append("And the changes are reviewed and approved by the tech lead")

        return criteria

    def export_user_stories_to_csv(self, output_file: str = "debt-user-stories.csv") -> str:
        """Export user stories to CSV for tracking-tool import"""
        if not self.user_stories:
            print("❌ No user stories to export.")
            return ""

        output_path = Path(output_file)

        # Create CSV content
        import csv
        with open(output_path, 'w', newline='', encoding='utf-8') as f:
            writer = csv.writer(f)

            # Header (tracking-tool import format)
            writer.writerow([
                'Summary', 'Issue Type', 'Description', 'Acceptance Criteria',
                'Story Points', 'Priority', 'Epic Link', 'Labels',
                'Component/s', 'Custom Field (Debt Items)'
            ])

            for story in self.user_stories.values():
                # Format acceptance criteria as numbered list
                criteria_text = '\n'.join([f"{i+1}. {criterion}" for i, criterion in enumerate(story.acceptance_criteria)])

                writer.writerow([
                    story.title,
                    'Story',
                    story.description,
                    criteria_text,
                    story.story_points,
                    story.priority,
                    story.epic,
                    ', '.join(story.labels),
                    'Technical Debt',
                    ', '.join(story.debt_items)
                ])

        print(f"✅ User stories exported to CSV: {output_path}")
        return str(output_path)

    def generate_debt_backlog_report(self, output_file: str = "debt-backlog-report.md") -> str:
        """Generate comprehensive debt backlog report"""
        output_path = Path(output_file)

        # Calculate statistics
        total_items = len(self.debt_registry)
        total_stories = len(self.user_stories)
        total_cost = sum(item.get('remediation_cost_hours', 0) for item in self.debt_registry.values())

        # Status breakdown
        status_counts = {}
        for tracker in self.debt_tracking.values():
            status = tracker.status.value
            status_counts[status] = status_counts.get(status, 0) + 1

        content = f"""---
id: debt-backlog-report-{datetime.now().strftime('%Y%m%d')}
version: "1.0.0"
last_updated: "{datetime.now().strftime('%Y-%m-%d')}"
updated_by: "System: Debt Tracker"
status: active
type: report
owner_role: "TL + SM"
---

# Technical Debt Backlog Report

**Generated**: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
**Project**: {self.project_name}

## Executive Summary

| Metric | Value |
|--------|-------|
| **Total Debt Items** | {total_items} |
| **Generated User Stories** | {total_stories} |
| **Total Remediation Cost** | {total_cost} hours |
| **Estimated Sprints** | {total_cost // 80:.1f} sprints (@ 80h debt capacity) |

## Debt Status Breakdown

| Status | Count | Percentage |
|--------|-------|------------|
"""

        for status, count in status_counts.items():
            percentage = (count / total_items * 100) if total_items > 0 else 0
            content += f"| {status} | {count} | {percentage:.1f}% |\n"

        content += f"""
## Sprint Planning Recommendations

### Current Sprint Capacity Allocation
Based on standard 15-20% technical debt allocation:

| Sprint Capacity | Debt Hours | Stories Capacity | Estimated Stories |
|----------------|------------|------------------|-------------------|
| 320h (Small team) | 48-64h | 16-21 SP | 2-4 stories |
| 400h (Medium team) | 60-80h | 20-27 SP | 3-5 stories |
| 480h (Large team) | 72-96h | 24-32 SP | 4-6 stories |

### Next Sprint Ready Stories

"""

        # List ready stories
        ready_stories = [story for story in self.user_stories.values() if 'do-first' in story.labels or 'plan' in story.labels]
        ready_stories.sort(key=lambda x: (0 if 'do-first' in x.labels else 1, x.story_points))

        if ready_stories:
            content += "| Story ID | Title | Points | Priority | Epic |\n"
            content += "|----------|-------|--------|----------|------|\n"

            for story in ready_stories[:10]:  # Top 10 ready stories
                content += f"| {story.id} | {story.title} | {story.story_points} SP | {story.priority} | {story.epic} |\n"
        else:
            content += "*No stories currently ready for sprint planning.*\n"

        content += f"""
## Debt Categories Analysis

"""

        # Analyze by category
        category_stats = {}
        for item in self.debt_registry.values():
            category = item.get('category', 'Unknown')
            if category not in category_stats:
                category_stats[category] = {'count': 0, 'cost': 0}
            category_stats[category]['count'] += 1
            category_stats[category]['cost'] += item.get('remediation_cost_hours', 0)

        content += "| Category | Count | Total Cost | Avg Cost | Focus Area |\n"
        content += "|----------|-------|------------|----------|------------|\n"

        focus_areas = {
            'Code': 'Development velocity',
            'Architecture': 'System scalability',
            'Test': 'Release confidence',
            'Documentation': 'Team onboarding',
            'Dependency': 'Security & compliance'
        }

        for category, stats in sorted(category_stats.items(), key=lambda x: x[1]['cost'], reverse=True):
            avg_cost = stats['cost'] / stats['count'] if stats['count'] > 0 else 0
            focus = focus_areas.get(category, 'General maintenance')
            content += f"| {category} | {stats['count']} | {stats['cost']}h | {avg_cost:.1f}h | {focus} |\n"

        content += f"""
## Tracking and Lifecycle

### Status Definitions
- **Identified**: Detected by {CODE_ANALYSIS_TOOL} analysis, not yet planned
- **Planned**: Included in sprint backlog, user story created
- **In Progress**: Currently being worked on by development team
- **Resolved**: Completed and validated, technical debt eliminated
- **Deferred**: Consciously postponed, reviewed periodically

### Lifecycle Management
1. **Automated Detection**: {CODE_ANALYSIS_TOOL} analyzer runs weekly
2. **Story Generation**: Debt tracker generates sprint-ready user stories
3. **Sprint Planning**: Team prioritizes debt stories (15-20% capacity)
4. **Execution**: Developers complete debt stories with full DoD
5. **Validation**: Tech lead validates debt elimination

### Next Review Cycle
- **Weekly**: New {CODE_ANALYSIS_TOOL} analysis and debt detection
- **Sprint Planning**: Review and prioritize debt backlog
- **Monthly**: Assess debt trends and category focus areas
- **Quarterly**: Strategic debt reduction planning

---

*Generated by {{CLIENT_NAME}} Technical Debt Management System*
*Next analysis: {(datetime.now() + timedelta(days=7)).strftime('%Y-%m-%d')}*
"""

        # Write to file
        output_path.write_text(content, encoding='utf-8')
        print(f"✅ Debt backlog report generated: {output_path}")

        return str(output_path)

    def update_debt_status(self, debt_id: str, status: DebtStatus, notes: str = "", actual_cost: Optional[int] = None):
        """Update debt item status and tracking information"""
        if debt_id not in self.debt_tracking:
            print(f"❌ Debt item {debt_id} not found in tracking system")
            return

        tracker = self.debt_tracking[debt_id]
        old_status = tracker.status

        tracker.status = status
        tracker.last_updated = datetime.now().isoformat()

        if status == DebtStatus.RESOLVED:
            tracker.resolved_date = datetime.now().isoformat()
            tracker.resolution_notes = notes
            if actual_cost:
                tracker.actual_cost_hours = actual_cost

        elif status == DebtStatus.IN_PROGRESS and notes:
            tracker.assigned_developer = notes

        print(f"✅ Updated {debt_id}: {old_status.value} → {status.value}")

def main():
    parser = argparse.ArgumentParser(description="{{CLIENT_NAME}} Technical Debt Tracker and User Story Generator")
    parser.add_argument("--registry-file", required=True, help="Path to debt registry JSON from sonarqube-analyzer.py")
    parser.add_argument("--project-name", default="{{CLIENT_NAME}}-SDLC", help="Project name")
    parser.add_argument("--sprint-capacity", type=int, default=400, help="Sprint capacity in hours")
    parser.add_argument("--debt-percentage", type=float, default=0.20, help="Percentage of capacity for debt (0.15-0.20)")
    parser.add_argument("--output-dir", default=".", help="Output directory")
    parser.add_argument("--csv-output", default="debt-user-stories.csv", help="CSV output for tracking-tool import")
    parser.add_argument("--report-output", default="debt-backlog-report.md", help="Backlog report filename")
    parser.add_argument("--verbose", "-v", action="store_true", help="Verbose output")

    args = parser.parse_args()

    print("🚀 {{CLIENT_NAME}} Technical Debt Tracker")
    print("=" * 40)

    # Initialize debt manager
    manager = TechnicalDebtManager(args.project_name)

    # Load debt registry
    if not manager.load_debt_registry(args.registry_file):
        print("❌ Failed to load debt registry")
        sys.exit(1)

    # Generate user stories for sprint
    user_stories = manager.generate_user_stories_for_sprint(
        args.sprint_capacity,
        args.debt_percentage
    )

    if not user_stories:
        print("❌ No user stories generated")
        sys.exit(1)

    # Generate outputs
    output_dir = Path(args.output_dir)
    output_dir.mkdir(exist_ok=True)

    csv_path = manager.export_user_stories_to_csv(output_dir / args.csv_output)
    report_path = manager.generate_debt_backlog_report(output_dir / args.report_output)

    # Summary
    print(f"\n🎯 Generation Summary:")
    print(f"   Debt Items Processed: {len(manager.debt_registry)}")
    print(f"   User Stories Generated: {len(user_stories)}")

    total_points = sum(story.story_points for story in user_stories)
    total_hours = sum(manager.debt_registry[debt_id].get('remediation_cost_hours', 0)
                     for story in user_stories
                     for debt_id in story.debt_items)

    print(f"   Total Story Points: {total_points} SP")
    print(f"   Estimated Effort: {total_hours} hours")

    print(f"\n📄 Outputs Generated:")
    print(f"   📊 CSV for {TRACKING_TOOL}: {csv_path}")
    print(f"   📝 Backlog Report: {report_path}")

    print(f"\n💡 Next Steps:")
    print(f"   1. Import {args.csv_output} into {TRACKING_TOOL}")
    print(f"   2. Review and prioritize stories in Sprint Planning")
    print(f"   3. Assign stories to developers")
    print(f"   4. Track progress and update debt status")

if __name__ == "__main__":
    main()