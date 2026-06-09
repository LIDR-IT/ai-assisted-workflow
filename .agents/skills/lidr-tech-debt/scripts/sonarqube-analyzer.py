#!/usr/bin/env python3
"""
{{CLIENT_NAME}} SonarQube Technical Debt Analyzer
Automatically parses SonarQube reports, classifies issues, and generates actionable technical debt items.
"""

import json
import csv
import argparse
import requests
import sys
import os
from pathlib import Path
from typing import Dict, List, Set, Optional, Tuple
from dataclasses import dataclass, asdict, field
from enum import Enum
from datetime import datetime
import base64
import xml.etree.ElementTree as ET

# Name of the static-analysis (SAST) tool, used only as an output label / format
# identifier in reports and CLI messages. Defaults to the current tool so existing
# output is preserved byte-for-byte; override via the LIDR_SAST_TOOL env var.
SAST_TOOL_LABEL = os.getenv("LIDR_SAST_TOOL", "SonarQube")

class DebtCategory(Enum):
    CODE = "Code"
    ARCHITECTURE = "Architecture"
    TEST = "Test"
    DOCUMENTATION = "Documentation"
    DEPENDENCY = "Dependency"
    INFRASTRUCTURE = "Infrastructure"
    DESIGN = "Design"

class DebtSeverity(Enum):
    CRITICAL = "Critical"
    HIGH = "High"
    MEDIUM = "Medium"
    LOW = "Low"
    INFO = "Info"

class DebtOrigin(Enum):
    DELIBERATE = "Deliberate"
    ACCIDENTAL = "Accidental"
    BITROT = "Bitrot"
    NEGLIGENCE = "Negligence"

class Priority(Enum):
    DO_FIRST = "DO FIRST"
    PLAN = "PLAN"
    OPPORTUNISTIC = "OPPORTUNISTIC"
    DEFER = "DEFER"

@dataclass
class TechnicalDebtItem:
    id: str
    title: str
    category: DebtCategory
    origin: DebtOrigin
    severity: DebtSeverity
    remediation_cost_hours: int
    business_impact: str
    affected_files: List[str] = field(default_factory=list)
    related_bugs: List[str] = field(default_factory=list)
    sonarqube_rules: List[str] = field(default_factory=list)
    description: str = ""
    evidence: str = ""
    proposed_fix: str = ""
    priority: Priority = Priority.PLAN
    sonarqube_issues_count: int = 0
    min_cost_hours: int = 0
    max_cost_hours: int = 0

    def __post_init__(self):
        if self.min_cost_hours == 0:
            self.min_cost_hours = max(1, self.remediation_cost_hours // 2)
        if self.max_cost_hours == 0:
            self.max_cost_hours = self.remediation_cost_hours * 2

class SonarQubeAnalyzer:
    def __init__(self, project_key: str = "", sonarqube_url: str = "http://localhost:9000"):
        self.project_key = project_key
        self.sonarqube_url = sonarqube_url.rstrip('/')
        self.token = ""
        self.debt_items: Dict[str, TechnicalDebtItem] = {}
        self.raw_issues: List[Dict] = []

        # {{CLIENT_NAME}}-specific categorization rules
        self.categorization_rules = {
            # Code Quality Rules
            'code': {
                'rules': [
                    'squid:S138',  # Functions should not have too many lines
                    'squid:S1541', # Functions should not have too many lines (alternative)
                    'squid:S3776', # Cognitive Complexity
                    'squid:S1067', # Expressions should not be too complex
                    'javascript:S138', 'typescript:S138',  # JS/TS specific
                    'python:S1541', 'python:S3776',  # Python specific
                    'java:S138', 'java:S3776',  # Java specific
                    'duplicated_lines', 'duplicated_blocks'
                ],
                'keywords': ['complexity', 'duplicate', 'long', 'nested'],
                'cost_base': 4,  # hours
                'severity_multiplier': {'CRITICAL': 3, 'MAJOR': 2, 'MINOR': 1, 'INFO': 0.5}
            },

            # Security and Architecture
            'architecture': {
                'rules': [
                    'squid:S1452',  # Generic wildcard types should not be used
                    'squid:S1172',  # Unused method parameters
                    'squid:S2259',  # Null pointers
                    'javascript:S1854', 'typescript:S1854',  # Unused assignments
                    'python:S1542', 'java:S1172'
                ],
                'keywords': ['coupling', 'dependency', 'circular', 'architecture'],
                'cost_base': 8,
                'severity_multiplier': {'CRITICAL': 4, 'MAJOR': 3, 'MINOR': 2, 'INFO': 1}
            },

            # Test Related
            'test': {
                'rules': [
                    'common-java:InsufficientLineCoverage',
                    'common-js:InsufficientLineCoverage',
                    'python:InsufficientLineCoverage',
                    'coverage',
                    'squid:S2699',  # Tests should include assertions
                ],
                'keywords': ['coverage', 'test', 'assert', 'mock'],
                'cost_base': 3,
                'severity_multiplier': {'CRITICAL': 2, 'MAJOR': 1.5, 'MINOR': 1, 'INFO': 0.5}
            },

            # Documentation
            'documentation': {
                'rules': [
                    'squid:S1176',  # API should be documented
                    'javascript:S1176', 'typescript:S1176',
                    'python:S1176', 'java:S1176',
                    'missing-documentation'
                ],
                'keywords': ['documentation', 'comment', 'javadoc', 'jsdoc', 'docstring'],
                'cost_base': 2,
                'severity_multiplier': {'CRITICAL': 1, 'MAJOR': 1, 'MINOR': 0.5, 'INFO': 0.25}
            },

            # Dependencies and Security
            'dependency': {
                'rules': [
                    'security',
                    'squid:S4423',  # Weak SSL/TLS protocols
                    'squid:S2092',  # Cookies should be secure
                    'squid:S5122',  # CORS
                ],
                'keywords': ['vulnerability', 'cve', 'security', 'ssl', 'tls', 'cors', 'csrf'],
                'cost_base': 6,
                'severity_multiplier': {'CRITICAL': 5, 'MAJOR': 3, 'MINOR': 2, 'INFO': 1}
            }
        }

        # Business impact templates for {{CLIENT_NAME}}
        self.business_impact_templates = {
            'code': "Code maintainability and developer velocity decrease. Increased bug risk.",
            'architecture': "System scalability and reliability affected. Deployment complexity increases.",
            'test': "Release confidence decreases. Bug escape rate increases to production.",
            'documentation': "Team onboarding efficiency decreases. Knowledge transfer becomes difficult.",
            'dependency': "Security vulnerabilities and compliance risks. Potential production incidents.",
            'infrastructure': "Deployment reliability decreases. Operational overhead increases.",
            'design': "Code flexibility decreases. Feature development becomes more expensive."
        }

    def set_credentials(self, token: str):
        """Set SonarQube authentication token"""
        self.token = token

    def fetch_issues_from_api(self, pageSize: int = 500) -> List[Dict]:
        """Fetch issues directly from SonarQube API"""
        if not self.token:
            print(f"❌ {SAST_TOOL_LABEL} token not provided. Use --token or set environment variable SONAR_TOKEN")
            return []

        issues = []
        page = 1

        headers = {
            'Authorization': f'Bearer {self.token}'
        }

        while True:
            url = f"{self.sonarqube_url}/api/issues/search"
            params = {
                'componentKeys': self.project_key,
                'pageSize': pageSize,
                'p': page,
                'facets': 'severities,types,rules',
                'additionalFields': 'rules'
            }

            try:
                response = requests.get(url, headers=headers, params=params)
                response.raise_for_status()
                data = response.json()

                batch_issues = data.get('issues', [])
                issues.extend(batch_issues)

                if len(batch_issues) < pageSize:
                    break

                page += 1
                print(f"📥 Fetched page {page-1}: {len(batch_issues)} issues")

            except requests.RequestException as e:
                print(f"❌ API request failed: {e}")
                break

        print(f"✅ Total issues fetched: {len(issues)}")
        self.raw_issues = issues
        return issues

    def load_issues_from_json(self, file_path: str) -> List[Dict]:
        """Load issues from exported JSON file"""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                data = json.load(f)

            # Handle different JSON structures
            if 'issues' in data:
                issues = data['issues']
            elif isinstance(data, list):
                issues = data
            else:
                print(f"❌ Unexpected JSON structure in {file_path}")
                return []

            print(f"✅ Loaded {len(issues)} issues from {file_path}")
            self.raw_issues = issues
            return issues

        except Exception as e:
            print(f"❌ Error loading JSON file {file_path}: {e}")
            return []

    def load_issues_from_csv(self, file_path: str) -> List[Dict]:
        """Load issues from exported CSV file"""
        try:
            issues = []
            with open(file_path, 'r', encoding='utf-8') as f:
                reader = csv.DictReader(f)
                for row in reader:
                    # Map CSV columns to standard format
                    issue = {
                        'key': row.get('Key', ''),
                        'rule': row.get('Rule', ''),
                        'severity': row.get('Severity', ''),
                        'type': row.get('Type', ''),
                        'component': row.get('Component', ''),
                        'message': row.get('Message', ''),
                        'line': row.get('Line', ''),
                        'status': row.get('Status', ''),
                        'effort': row.get('Effort', ''),
                        'debt': row.get('Debt', ''),
                        'creationDate': row.get('Creation Date', ''),
                        'updateDate': row.get('Update Date', '')
                    }
                    issues.append(issue)

            print(f"✅ Loaded {len(issues)} issues from CSV: {file_path}")
            self.raw_issues = issues
            return issues

        except Exception as e:
            print(f"❌ Error loading CSV file {file_path}: {e}")
            return []

    def analyze_issues(self) -> Dict[str, TechnicalDebtItem]:
        """Analyze loaded issues and classify into technical debt items"""
        if not self.raw_issues:
            print("❌ No issues loaded. Use load_issues_* methods first.")
            return {}

        print(f"🔍 Analyzing {len(self.raw_issues)} {SAST_TOOL_LABEL} issues...")

        # Group issues by category and severity
        categorized_issues = self._categorize_issues()

        # Generate debt items from categorized issues
        debt_id_counter = 1

        for category, issues_by_severity in categorized_issues.items():
            for severity, issues in issues_by_severity.items():
                if not issues:
                    continue

                debt_item = self._create_debt_item_from_issues(
                    debt_id_counter, category, severity, issues
                )

                self.debt_items[debt_item.id] = debt_item
                debt_id_counter += 1

        print(f"✅ Generated {len(self.debt_items)} technical debt items")
        return self.debt_items

    def _categorize_issues(self) -> Dict[str, Dict[str, List[Dict]]]:
        """Categorize issues by debt category and severity"""
        categorized = {
            'code': {'CRITICAL': [], 'MAJOR': [], 'MINOR': [], 'INFO': []},
            'architecture': {'CRITICAL': [], 'MAJOR': [], 'MINOR': [], 'INFO': []},
            'test': {'CRITICAL': [], 'MAJOR': [], 'MINOR': [], 'INFO': []},
            'documentation': {'CRITICAL': [], 'MAJOR': [], 'MINOR': [], 'INFO': []},
            'dependency': {'CRITICAL': [], 'MAJOR': [], 'MINOR': [], 'INFO': []},
            'infrastructure': {'CRITICAL': [], 'MAJOR': [], 'MINOR': [], 'INFO': []},
            'design': {'CRITICAL': [], 'MAJOR': [], 'MINOR': [], 'INFO': []}
        }

        for issue in self.raw_issues:
            rule = issue.get('rule', '').lower()
            message = issue.get('message', '').lower()
            severity = issue.get('severity', 'MINOR').upper()

            # Normalize severity
            if severity not in ['CRITICAL', 'MAJOR', 'MINOR', 'INFO']:
                severity = 'MINOR'

            # Categorize by rules and keywords
            category = self._classify_issue_category(rule, message)

            if category in categorized and severity in categorized[category]:
                categorized[category][severity].append(issue)

        return categorized

    def _classify_issue_category(self, rule: str, message: str) -> str:
        """Classify individual issue into category"""
        for category, config in self.categorization_rules.items():
            # Check rule matches
            for rule_pattern in config['rules']:
                if rule_pattern.lower() in rule:
                    return category

            # Check keyword matches
            for keyword in config['keywords']:
                if keyword in message or keyword in rule:
                    return category

        # Default category
        return 'code'

    def _create_debt_item_from_issues(self, debt_id: int, category: str, severity: str, issues: List[Dict]) -> TechnicalDebtItem:
        """Create a technical debt item from grouped issues"""

        # Generate debt item ID
        project_prefix = self.project_key.replace(':', '-').upper() if self.project_key else "SDLC"
        debt_item_id = f"TD-{project_prefix}-{debt_id:03d}"

        # Aggregate information from issues
        affected_files = list(set([issue.get('component', '') for issue in issues if issue.get('component')]))
        sonar_rules = list(set([issue.get('rule', '') for issue in issues if issue.get('rule')]))

        # Generate title based on category and most common issue type
        rule_counts = {}
        for issue in issues:
            rule = issue.get('rule', '')
            rule_counts[rule] = rule_counts.get(rule, 0) + 1

        most_common_rule = max(rule_counts, key=rule_counts.get) if rule_counts else 'Unknown'
        title = self._generate_debt_title(category, severity, len(issues), most_common_rule)

        # Calculate remediation cost
        cost_config = self.categorization_rules.get(category, {'cost_base': 4, 'severity_multiplier': {'MAJOR': 2}})
        base_cost = cost_config['cost_base']
        severity_mult = cost_config['severity_multiplier'].get(severity, 1)

        # Scale cost by number of issues (with diminishing returns)
        import math
        issue_count = len(issues)
        complexity_factor = 1 + math.log10(max(1, issue_count))

        remediation_cost = int(base_cost * severity_mult * complexity_factor)

        # Generate description and evidence
        description = self._generate_description(category, severity, issues)
        evidence = self._generate_evidence(issues, most_common_rule)

        # Map to our enums
        debt_category = DebtCategory.CODE
        for cat_enum in DebtCategory:
            if cat_enum.value.lower() == category:
                debt_category = cat_enum
                break

        debt_severity = DebtSeverity.MEDIUM
        if severity == 'CRITICAL':
            debt_severity = DebtSeverity.CRITICAL
        elif severity == 'MAJOR':
            debt_severity = DebtSeverity.HIGH
        elif severity == 'MINOR':
            debt_severity = DebtSeverity.MEDIUM
        elif severity == 'INFO':
            debt_severity = DebtSeverity.LOW

        # Determine origin based on rule types and patterns
        origin = self._determine_debt_origin(issues)

        # Get business impact
        business_impact = self.business_impact_templates.get(category, "Impact assessment needed")

        # Generate proposed fix
        proposed_fix = self._generate_proposed_fix(category, severity, most_common_rule, issue_count)

        debt_item = TechnicalDebtItem(
            id=debt_item_id,
            title=title,
            category=debt_category,
            origin=origin,
            severity=debt_severity,
            remediation_cost_hours=remediation_cost,
            business_impact=business_impact,
            affected_files=affected_files[:10],  # Limit display
            sonarqube_rules=sonar_rules,
            description=description,
            evidence=evidence,
            proposed_fix=proposed_fix,
            sonarqube_issues_count=issue_count
        )

        # Calculate priority using quadrant
        debt_item.priority = self._calculate_priority(debt_item)

        return debt_item

    def _generate_debt_title(self, category: str, severity: str, count: int, rule: str) -> str:
        """Generate descriptive title for debt item"""
        rule_descriptions = {
            'squid:S138': 'Functions too long',
            'squid:S3776': 'High cognitive complexity',
            'squid:S1067': 'Complex expressions',
            'duplicated_lines': 'Code duplication',
            'coverage': 'Insufficient test coverage',
            'squid:S1176': 'Missing API documentation',
            'security': 'Security vulnerabilities'
        }

        rule_desc = rule_descriptions.get(rule, f'{category.title()} issues')

        if count == 1:
            return f"{severity.title()} {rule_desc}"
        else:
            return f"{severity.title()} {rule_desc} ({count} instances)"

    def _generate_description(self, category: str, severity: str, issues: List[Dict]) -> str:
        """Generate description based on issue analysis"""
        descriptions = {
            'code': f"Code quality issues detected that affect maintainability and readability. {len(issues)} violations found.",
            'architecture': f"Architectural problems that affect system design and scalability. {len(issues)} violations found.",
            'test': f"Testing-related issues that affect release confidence. {len(issues)} violations found.",
            'documentation': f"Documentation gaps that affect team knowledge sharing. {len(issues)} violations found.",
            'dependency': f"Dependency and security issues that affect system safety. {len(issues)} violations found.",
            'infrastructure': f"Infrastructure-related issues that affect operational efficiency. {len(issues)} violations found.",
            'design': f"Design quality issues that affect code flexibility. {len(issues)} violations found."
        }

        base_desc = descriptions.get(category, f"{category.title()} issues detected. {len(issues)} violations found.")

        # Add severity context
        if severity == 'CRITICAL':
            base_desc += " These are critical issues that require immediate attention."
        elif severity == 'MAJOR':
            base_desc += " These are significant issues that should be addressed in the current sprint."

        return base_desc

    def _generate_evidence(self, issues: List[Dict], most_common_rule: str) -> str:
        """Generate evidence section with SonarQube specifics"""
        evidence = f"**{SAST_TOOL_LABEL} Analysis Results:**\n"
        evidence += f"- Total issues: {len(issues)}\n"
        evidence += f"- Primary rule: {most_common_rule}\n"

        # Group by severity
        severity_counts = {}
        for issue in issues:
            sev = issue.get('severity', 'MINOR')
            severity_counts[sev] = severity_counts.get(sev, 0) + 1

        evidence += f"- Severity breakdown: {severity_counts}\n"

        # Show sample files
        files = set()
        for issue in issues:
            component = issue.get('component', '')
            if component:
                files.add(component)
            if len(files) >= 5:  # Limit sample
                break

        if files:
            evidence += f"- Sample affected files: {', '.join(list(files)[:5])}\n"

        # Add sample issue details
        if issues:
            sample_issue = issues[0]
            evidence += f"\n**Sample Issue:**\n"
            evidence += f"- Message: {sample_issue.get('message', 'N/A')}\n"
            evidence += f"- Component: {sample_issue.get('component', 'N/A')}\n"
            evidence += f"- Line: {sample_issue.get('line', 'N/A')}\n"

        return evidence

    def _generate_proposed_fix(self, category: str, severity: str, rule: str, count: int) -> str:
        """Generate proposed fix approach"""
        fix_approaches = {
            'code': "Refactor complex functions, extract methods, reduce duplication through common utilities.",
            'architecture': "Redesign modules to reduce coupling, implement proper dependency injection, refactor circular dependencies.",
            'test': "Increase test coverage, add missing unit tests, improve test reliability and performance.",
            'documentation': "Add comprehensive API documentation, update README files, create ADRs for architectural decisions.",
            'dependency': "Update vulnerable dependencies, replace unmaintained packages, implement security hardening.",
            'infrastructure': "Optimize CI/CD pipelines, implement automated deployment, add monitoring and alerting.",
            'design': "Apply SOLID principles, implement design patterns, reduce code complexity through abstraction."
        }

        base_fix = fix_approaches.get(category, f"Address {category} issues systematically.")

        if count > 10:
            base_fix += f" **Batch approach recommended** - fix similar issues together for efficiency."
        elif count == 1:
            base_fix += f" **Targeted fix** - address specific issue."

        return base_fix

    def _determine_debt_origin(self, issues: List[Dict]) -> DebtOrigin:
        """Determine debt origin based on issue patterns"""
        # Simple heuristic based on rule types
        security_rules = ['security', 'vulnerability', 'cve']
        complexity_rules = ['complexity', 'S3776', 'S1067']

        rules_text = ' '.join([issue.get('rule', '') for issue in issues]).lower()

        if any(sec_rule in rules_text for sec_rule in security_rules):
            return DebtOrigin.NEGLIGENCE  # Security issues often indicate negligence
        elif any(comp_rule in rules_text for comp_rule in complexity_rules):
            return DebtOrigin.ACCIDENTAL  # Complexity usually grows accidentally
        else:
            return DebtOrigin.BITROT  # Default assumption

    def _calculate_priority(self, debt_item: TechnicalDebtItem) -> Priority:
        """Calculate priority using impact vs cost quadrant"""
        # Business impact score (1-10)
        impact_score = 5  # Default medium

        if debt_item.severity == DebtSeverity.CRITICAL:
            impact_score = 9
        elif debt_item.severity == DebtSeverity.HIGH:
            impact_score = 7
        elif debt_item.severity == DebtSeverity.MEDIUM:
            impact_score = 5
        elif debt_item.severity == DebtSeverity.LOW:
            impact_score = 3

        # Adjust for category
        high_impact_categories = [DebtCategory.DEPENDENCY, DebtCategory.ARCHITECTURE]
        if debt_item.category in high_impact_categories:
            impact_score += 2

        # Cost score (1-10) - inverse, lower cost = higher score
        cost_hours = debt_item.remediation_cost_hours
        if cost_hours <= 4:
            cost_score = 8  # Low cost
        elif cost_hours <= 16:
            cost_score = 5  # Medium cost
        else:
            cost_score = 2  # High cost

        # Quadrant logic
        if impact_score >= 7 and cost_score >= 6:
            return Priority.DO_FIRST
        elif impact_score >= 7 and cost_score < 6:
            return Priority.PLAN
        elif impact_score < 7 and cost_score >= 6:
            return Priority.OPPORTUNISTIC
        else:
            return Priority.DEFER

    def generate_debt_registry(self, output_file: str = "tech-debt-registry.md") -> str:
        """Generate markdown debt registry report"""
        if not self.debt_items:
            print("❌ No debt items to export. Run analyze_issues() first.")
            return ""

        output_path = Path(output_file)

        # Sort items by priority and severity
        priority_order = [Priority.DO_FIRST, Priority.PLAN, Priority.OPPORTUNISTIC, Priority.DEFER]
        sorted_items = sorted(
            self.debt_items.values(),
            key=lambda x: (priority_order.index(x.priority), x.severity.name)
        )

        content = f"""---
id: tech-debt-registry-{datetime.now().strftime('%Y%m%d')}
version: "1.0.0"
last_updated: "{datetime.now().strftime('%Y-%m-%d')}"
updated_by: "System: {SAST_TOOL_LABEL} Analyzer"
status: active
type: registry
owner_role: "TL + Dev Team"
---

# Technical Debt Registry - {SAST_TOOL_LABEL} Analysis

**Generated**: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
**Project**: {self.project_key}
**Issues Analyzed**: {len(self.raw_issues)}
**Debt Items**: {len(self.debt_items)}

## Summary by Priority

| Priority | Count | Total Cost (h) | Avg Cost | Focus |
|----------|-------|----------------|----------|-------|
"""

        # Calculate summary statistics
        priority_stats = {}
        for priority in Priority:
            items = [item for item in self.debt_items.values() if item.priority == priority]
            total_cost = sum(item.remediation_cost_hours for item in items)
            avg_cost = total_cost / len(items) if items else 0
            priority_stats[priority] = {
                'count': len(items),
                'total_cost': total_cost,
                'avg_cost': avg_cost
            }

            focus_text = {
                Priority.DO_FIRST: "Next Sprint",
                Priority.PLAN: "Scheduled",
                Priority.OPPORTUNISTIC: "During nearby work",
                Priority.DEFER: "Backlog"
            }[priority]

            content += f"| **{priority.value}** | {len(items)} | {total_cost}h | {avg_cost:.1f}h | {focus_text} |\n"

        content += f"""
## Sprint Planning Recommendations

**Capacity Allocation (15-20% of sprint capacity)**:
- If 400h sprint capacity → Reserve 60-80h for tech debt
- **DO FIRST**: {priority_stats[Priority.DO_FIRST]['total_cost']}h (can fit in 1 sprint)
- **PLAN**: {priority_stats[Priority.PLAN]['total_cost']}h (schedule across 2-3 sprints)

---

"""

        # Generate detailed debt items
        for priority in priority_order:
            items_in_priority = [item for item in sorted_items if item.priority == priority]
            if not items_in_priority:
                continue

            content += f"## {priority.value} ({len(items_in_priority)} items)\n\n"

            for item in items_in_priority:
                content += self._generate_debt_item_markdown(item)
                content += "\n---\n\n"

        # Add appendix
        content += self._generate_appendix()

        # Write to file
        output_path.write_text(content, encoding='utf-8')
        print(f"✅ Tech debt registry generated: {output_path}")

        return str(output_path)

    def _generate_debt_item_markdown(self, item: TechnicalDebtItem) -> str:
        """Generate markdown for individual debt item"""
        files_display = ', '.join(item.affected_files[:5])
        if len(item.affected_files) > 5:
            files_display += f" ... (+{len(item.affected_files) - 5} more)"

        rules_display = ', '.join(item.sonarqube_rules[:3])
        if len(item.sonarqube_rules) > 3:
            rules_display += f" ... (+{len(item.sonarqube_rules) - 3} more)"

        return f"""### {item.id}: {item.title}

| Field | Value |
|-------|-------|
| **Category** | {item.category.value} |
| **Origin** | {item.origin.value} |
| **Severity** | {item.severity.value} |
| **Remediation Cost** | {item.remediation_cost_hours}h (range: {item.min_cost_hours}-{item.max_cost_hours}h) |
| **Business Impact** | {item.business_impact} |
| **Affected Files** | {files_display} |
| **{SAST_TOOL_LABEL} Issues** | {item.sonarqube_issues_count} |
| **Rules** | {rules_display} |

#### Description
{item.description}

#### Evidence
{item.evidence}

#### Proposed Fix
{item.proposed_fix}

#### Priority Quadrant
**{item.priority.value}** - {self._get_quadrant_explanation(item.priority)}
"""

    def _get_quadrant_explanation(self, priority: Priority) -> str:
        """Get explanation for quadrant assignment"""
        explanations = {
            Priority.DO_FIRST: "High Impact + Low Cost → Schedule for next sprint",
            Priority.PLAN: "High Impact + High Cost → Plan and schedule properly",
            Priority.OPPORTUNISTIC: "Low Impact + Low Cost → Fix during nearby work",
            Priority.DEFER: "Low Impact + High Cost → Consider deferring to backlog"
        }
        return explanations[priority]

    def _generate_appendix(self) -> str:
        """Generate appendix with methodology and rules"""
        return f"""
## Appendix: Analysis Methodology

### Categorization Rules
- **Code**: Complexity, duplication, code smells → Base cost: 4h
- **Architecture**: Design issues, coupling → Base cost: 8h
- **Test**: Coverage, test quality → Base cost: 3h
- **Documentation**: Missing docs, comments → Base cost: 2h
- **Dependency**: Security, vulnerabilities → Base cost: 6h

### Severity Mapping
- **Critical**: CRITICAL {SAST_TOOL_LABEL} issues (blocking)
- **High**: MAJOR {SAST_TOOL_LABEL} issues (significant)
- **Medium**: MINOR {SAST_TOOL_LABEL} issues (moderate)
- **Low**: INFO {SAST_TOOL_LABEL} issues (informational)

### Priority Calculation
Based on Business Impact vs Remediation Cost quadrant:
- **Impact Score**: Severity (1-9) + Category weight
- **Cost Score**: Inverse of remediation hours (1-10)
- **Quadrant Assignment**: Impact vs Cost matrix

### Next Steps
1. **Team Review**: Review and validate priority assignments
2. **Sprint Planning**: Include DO FIRST items in next sprint
3. **Roadmap**: Schedule PLAN items across upcoming sprints
4. **Monitoring**: Re-run analysis after debt remediation

---

*Generated by {{CLIENT_NAME}} {SAST_TOOL_LABEL} Technical Debt Analyzer*
*Data source: {self.sonarqube_url}/dashboard?id={self.project_key}*
"""

    def export_to_json(self, output_file: str = "tech-debt-analysis.json") -> str:
        """Export analysis results to JSON"""
        if not self.debt_items:
            print("❌ No debt items to export. Run analyze_issues() first.")
            return ""

        data = {
            "metadata": {
                "generated_at": datetime.now().isoformat(),
                "project_key": self.project_key,
                "sonarqube_url": self.sonarqube_url,
                "analyzer_version": "1.0.0",
                "total_sonar_issues": len(self.raw_issues),
                "total_debt_items": len(self.debt_items)
            },
            "summary": {
                "by_priority": {},
                "by_category": {},
                "by_severity": {},
                "total_cost_hours": sum(item.remediation_cost_hours for item in self.debt_items.values())
            },
            "debt_items": {item_id: asdict(item) for item_id, item in self.debt_items.items()},
            "raw_issues": self.raw_issues[:100]  # Sample for reference
        }

        # Calculate summary statistics
        for priority in Priority:
            items = [item for item in self.debt_items.values() if item.priority == priority]
            data["summary"]["by_priority"][priority.value] = {
                "count": len(items),
                "total_cost_hours": sum(item.remediation_cost_hours for item in items)
            }

        output_path = Path(output_file)
        output_path.write_text(json.dumps(data, indent=2, default=str, ensure_ascii=False), encoding='utf-8')
        print(f"✅ JSON analysis exported: {output_path}")

        return str(output_path)

def main():
    parser = argparse.ArgumentParser(description="{{CLIENT_NAME}} " + SAST_TOOL_LABEL + " Technical Debt Analyzer")
    parser.add_argument("--project-key", required=True, help="SonarQube project key")
    parser.add_argument("--sonar-url", default="http://localhost:9000", help="SonarQube server URL")
    parser.add_argument("--token", help="SonarQube auth token (or set SONAR_TOKEN env var)")
    parser.add_argument("--json-file", help="Path to SonarQube issues JSON export")
    parser.add_argument("--csv-file", help="Path to SonarQube issues CSV export")
    parser.add_argument("--output-dir", default=".", help="Output directory for reports")
    parser.add_argument("--registry-file", default="tech-debt-registry.md", help="Registry output filename")
    parser.add_argument("--json-output", default="tech-debt-analysis.json", help="JSON output filename")
    parser.add_argument("--verbose", "-v", action="store_true", help="Verbose output")

    args = parser.parse_args()

    # Get token from args or environment
    token = args.token or os.environ.get('SONAR_TOKEN', '')

    print("🚀 {{CLIENT_NAME}} " + SAST_TOOL_LABEL + " Technical Debt Analyzer")
    print("=" * 55)

    # Initialize analyzer
    analyzer = SonarQubeAnalyzer(args.project_key, args.sonar_url)
    if token:
        analyzer.set_credentials(token)

    # Load issues from specified source
    issues_loaded = False

    if args.json_file:
        analyzer.load_issues_from_json(args.json_file)
        issues_loaded = True
    elif args.csv_file:
        analyzer.load_issues_from_csv(args.csv_file)
        issues_loaded = True
    elif token:
        analyzer.fetch_issues_from_api()
        issues_loaded = True
    else:
        print("❌ No data source specified. Provide --json-file, --csv-file, or --token for API access.")
        sys.exit(1)

    if not issues_loaded or not analyzer.raw_issues:
        print("❌ No issues loaded. Check your data source.")
        sys.exit(1)

    # Analyze issues
    debt_items = analyzer.analyze_issues()

    if not debt_items:
        print("❌ No debt items generated from analysis.")
        sys.exit(1)

    # Generate outputs
    output_dir = Path(args.output_dir)
    output_dir.mkdir(exist_ok=True)

    registry_path = analyzer.generate_debt_registry(output_dir / args.registry_file)
    json_path = analyzer.export_to_json(output_dir / args.json_output)

    # Summary
    print(f"\n🎯 Analysis Summary:")
    print(f"   {SAST_TOOL_LABEL} Issues: {len(analyzer.raw_issues)}")
    print(f"   Debt Items: {len(debt_items)}")
    print(f"   Total Cost: {sum(item.remediation_cost_hours for item in debt_items.values())} hours")

    priority_counts = {}
    for priority in Priority:
        count = len([item for item in debt_items.values() if item.priority == priority])
        priority_counts[priority.value] = count

    print(f"   Priorities: {priority_counts}")

    print(f"\n📄 Reports Generated:")
    print(f"   📊 Registry: {registry_path}")
    print(f"   📁 JSON: {json_path}")

    print(f"\n💡 Next Steps:")
    do_first_items = [item for item in debt_items.values() if item.priority == Priority.DO_FIRST]
    if do_first_items:
        total_cost = sum(item.remediation_cost_hours for item in do_first_items)
        print(f"   ✅ {len(do_first_items)} items ready for next sprint ({total_cost}h total)")
        print(f"   📋 Review debt registry and include in Sprint Planning")
    else:
        print(f"   📝 All items are PLAN or lower priority")
        print(f"   📅 Schedule according to roadmap capacity")

if __name__ == "__main__":
    import os
    main()