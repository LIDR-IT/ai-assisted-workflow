#!/usr/bin/env python3
"""
Jira Adapter for Tracking Integration Skill

Handles epic creation and management in Jira with full SDLC metadata.
Supports both cloud and server instances with MCP integration.
"""

import json
import requests
from typing import Dict, Any, List, Optional
from dataclasses import dataclass
from abc import ABC, abstractmethod

@dataclass
class JiraConfig:
    server: str
    username: str
    api_token: str
    project_key: str

class TrackingToolAdapter(ABC):
    """Base interface for all tracking tool adapters"""

    @abstractmethod
    def create_project(self, project_data: Dict[str, Any]) -> Dict[str, Any]:
        pass

    @abstractmethod
    def create_sub_projects(self, parent_id: str, sub_projects: List[Dict]) -> List[Dict]:
        pass

    @abstractmethod
    def link_business_case(self, project_id: str, bc_url: str) -> bool:
        pass

class JiraAdapter(TrackingToolAdapter):
    """Jira-specific adapter for epic and sub-epic management"""

    def __init__(self, config: JiraConfig):
        self.config = config
        self.session = requests.Session()
        self.session.auth = (config.username, config.api_token)
        self.session.headers.update({
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        })

    def create_project(self, project_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Create Jira epic with comprehensive SDLC metadata

        Args:
            project_data: Standardized project data from business case

        Returns:
            Dict with epic_key, epic_url, and creation_status
        """
        try:
            # Map universal project data to Jira epic fields
            epic_fields = self._map_to_jira_fields(project_data)

            # Create epic via Jira REST API
            url = f"{self.config.server}/rest/api/3/issue"
            response = self.session.post(url, json={'fields': epic_fields})

            if response.status_code == 201:
                epic_data = response.json()
                epic_key = epic_data['key']

                # Add business case link as comment
                if project_data.get('business_case_url'):
                    self._add_business_case_link(epic_key, project_data['business_case_url'])

                return {
                    'success': True,
                    'epic_key': epic_key,
                    'epic_url': f"{self.config.server}/browse/{epic_key}",
                    'epic_id': epic_data['id']
                }
            else:
                return {
                    'success': False,
                    'error': f"Failed to create epic: {response.text}",
                    'status_code': response.status_code
                }

        except Exception as e:
            return {
                'success': False,
                'error': f"Exception creating epic: {str(e)}"
            }

    def create_sub_projects(self, parent_epic_key: str, sub_projects: List[Dict]) -> List[Dict]:
        """
        Create sub-epics for phase-based project breakdown

        Args:
            parent_epic_key: Key of parent epic
            sub_projects: List of sub-project definitions

        Returns:
            List of created sub-epic details
        """
        created_sub_epics = []

        for sub_project in sub_projects:
            try:
                # Create sub-epic
                sub_epic_data = {
                    'project': {'key': self.config.project_key},
                    'summary': sub_project['title'],
                    'description': sub_project['description'],
                    'issuetype': {'name': 'Epic'},
                    'priority': {'name': sub_project.get('priority', 'Medium')},
                    'labels': sub_project.get('labels', []),
                    'customfield_10014': parent_epic_key,  # Epic Link to parent
                }

                # Add epic name if provided
                if 'epic_name' in sub_project:
                    sub_epic_data['customfield_10011'] = sub_project['epic_name']

                url = f"{self.config.server}/rest/api/3/issue"
                response = self.session.post(url, json={'fields': sub_epic_data})

                if response.status_code == 201:
                    result = response.json()
                    created_sub_epics.append({
                        'phase': sub_project['phase'],
                        'epic_key': result['key'],
                        'epic_url': f"{self.config.server}/browse/{result['key']}",
                        'success': True
                    })
                else:
                    created_sub_epics.append({
                        'phase': sub_project['phase'],
                        'success': False,
                        'error': response.text
                    })

            except Exception as e:
                created_sub_epics.append({
                    'phase': sub_project.get('phase', 'Unknown'),
                    'success': False,
                    'error': str(e)
                })

        return created_sub_epics

    def link_business_case(self, epic_key: str, bc_url: str) -> bool:
        """Add business case link to epic"""
        try:
            return self._add_business_case_link(epic_key, bc_url)
        except Exception as e:
            print(f"Failed to link business case: {str(e)}")
            return False

    def _map_to_jira_fields(self, project_data: Dict[str, Any]) -> Dict[str, Any]:
        """Map universal project data to Jira-specific field format"""

        fields = {
            'project': {'key': self.config.project_key},
            'summary': project_data['title'],
            'description': self._format_epic_description(project_data),
            'issuetype': {'name': 'Epic'},
            'priority': {'name': project_data.get('priority', 'Medium')},
            'labels': project_data.get('labels', []),
        }

        # Epic Name (custom field)
        if 'epic_name' in project_data:
            fields['customfield_10011'] = project_data['epic_name']

        # Components
        if 'components' in project_data:
            fields['components'] = [{'name': comp} for comp in project_data['components']]

        # Fix Version
        if 'version' in project_data:
            fields['fixVersions'] = [{'name': project_data['version']}]

        # Assignee
        if 'assignee' in project_data:
            fields['assignee'] = {'name': project_data['assignee']}

        # Reporter
        if 'reporter' in project_data:
            fields['reporter'] = {'name': project_data['reporter']}

        # Due date
        if 'due_date' in project_data:
            fields['duedate'] = project_data['due_date']

        return fields

    def _format_epic_description(self, project_data: Dict[str, Any]) -> str:
        """Format comprehensive epic description with business context"""

        description_parts = [
            project_data.get('description', ''),
            "",
            "## Business Context",
        ]

        if 'sponsor' in project_data:
            description_parts.append(f"**Sponsor:** {project_data['sponsor']}")

        if 'strategic_alignment' in project_data:
            description_parts.append(f"**Strategic Alignment:** {project_data['strategic_alignment']}")

        if 'budget' in project_data:
            description_parts.append(f"**Budget:** {project_data['budget']}")

        if 'expected_roi' in project_data:
            description_parts.append(f"**Expected ROI:** {project_data['expected_roi']}")

        if 'business_case_url' in project_data:
            description_parts.extend([
                "",
                "## References",
                f"[Business Case]({project_data['business_case_url']})"
            ])

        return "\n".join(description_parts)

    def _add_business_case_link(self, epic_key: str, bc_url: str) -> bool:
        """Add business case link as comment"""
        try:
            comment_data = {
                'body': f"📋 **Business Case Reference**\n\nApproved Business Case: {bc_url}\n\nThis epic implements the requirements and scope defined in the linked business case."
            }

            url = f"{self.config.server}/rest/api/3/issue/{epic_key}/comment"
            response = self.session.post(url, json=comment_data)

            return response.status_code == 201

        except Exception as e:
            print(f"Failed to add business case comment: {str(e)}")
            return False


def create_project_structure(business_case_data: Dict[str, Any], client_config: Dict[str, Any]) -> Dict[str, Any]:
    """
    Main entry point for creating Jira project structure

    Args:
        business_case_data: Data from approved business case
        client_config: Client configuration including Jira details

    Returns:
        Complete project creation results
    """

    # Initialize Jira adapter
    jira_config = JiraConfig(
        server=client_config['jira']['server'],
        username=client_config['jira']['username'],
        api_token=client_config['jira']['api_token'],
        project_key=client_config['jira']['project_key']
    )

    adapter = JiraAdapter(jira_config)

    # Create main epic
    project_result = adapter.create_project(business_case_data)

    if not project_result['success']:
        return {
            'success': False,
            'error': 'Failed to create main epic',
            'details': project_result
        }

    # Create sub-epics for large projects
    sub_epics_result = []
    if business_case_data.get('complexity') in ['High', 'Very High']:
        sub_projects = generate_phase_sub_projects(business_case_data)
        sub_epics_result = adapter.create_sub_projects(
            project_result['epic_key'],
            sub_projects
        )

    return {
        'success': True,
        'tracking_tool': 'jira',
        'main_epic': project_result,
        'sub_epics': sub_epics_result,
        'project_url': project_result['epic_url'],
        'created_at': business_case_data.get('created_at'),
        'total_sub_epics': len(sub_epics_result)
    }


def generate_phase_sub_projects(business_case_data: Dict[str, Any]) -> List[Dict[str, Any]]:
    """Generate standard SDLC phase-based sub-projects"""

    project_name = business_case_data.get('title', 'Project')

    return [
        {
            'title': f"{project_name} - Discovery & PRD",
            'phase': 'Phase 2 - Discovery',
            'description': 'PRD Technical + PRD Functional + Cross-review + Risk Log + Architecture documentation',
            'priority': 'High',
            'labels': ['phase:discovery', 'type:documentation', 'gate:gate-1'],
            'epic_name': f"{project_name} Discovery"
        },
        {
            'title': f"{project_name} - Requirements Specification",
            'phase': 'Phase 3 - Specification',
            'description': 'Functional Requirements with BDD + Non-Functional Requirements + Requirements Traceability Matrix',
            'priority': 'High',
            'labels': ['phase:specification', 'type:requirements', 'gate:gate-2'],
            'epic_name': f"{project_name} Requirements"
        },
        {
            'title': f"{project_name} - Core Development",
            'phase': 'Phase 5 - Development',
            'description': 'Core algorithms, APIs, database schema, and main system components',
            'priority': 'High',
            'labels': ['phase:development', 'type:implementation', 'gate:gate-4'],
            'epic_name': f"{project_name} Core Dev"
        },
        {
            'title': f"{project_name} - Testing & QA",
            'phase': 'Phase 6 - Testing',
            'description': 'Test automation, performance testing, regression suite, and quality assurance',
            'priority': 'Medium',
            'labels': ['phase:testing', 'type:quality', 'gate:gate-5'],
            'epic_name': f"{project_name} QA"
        },
        {
            'title': f"{project_name} - Security & Compliance",
            'phase': 'Phase 7 - Security',
            'description': 'DAST scanning, penetration testing, compliance certification, security review',
            'priority': 'Medium',
            'labels': ['phase:security', 'type:compliance', 'gate:gate-6'],
            'epic_name': f"{project_name} Security"
        },
        {
            'title': f"{project_name} - Release & Deployment",
            'phase': 'Phase 8 - Deployment',
            'description': 'Production deployment, documentation finalization, stakeholder communication',
            'priority': 'Medium',
            'labels': ['phase:deployment', 'type:release', 'gate:gate-7'],
            'epic_name': f"{project_name} Release"
        }
    ]


if __name__ == "__main__":
    print("🔧 Jira Adapter - Configuration Required")
    print("📖 See: docs/security/credential-management.md")
    print("✅ Set environment variables: JIRA_SERVER, JIRA_USERNAME, JIRA_API_TOKEN, JIRA_PROJECT_KEY")
    print("🎯 Example business case structure available in docstrings")

    # Validate environment configuration
    import os
    required_env = ['JIRA_SERVER', 'JIRA_USERNAME', 'JIRA_API_TOKEN', 'JIRA_PROJECT_KEY']
    missing = [var for var in required_env if not os.getenv(var)]

    if missing:
        print(f"❌ Missing environment variables: {', '.join(missing)}")
    else:
        print("✅ Environment configuration complete")
        print("🚀 Ready to create Jira epics")