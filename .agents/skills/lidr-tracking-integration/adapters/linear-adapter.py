#!/usr/bin/env python3
"""
Linear Adapter for Tracking Integration Skill

Handles project creation and management in Linear with full SDLC metadata.
Supports projects, milestones, and issue hierarchies.
"""

import json
import requests
from typing import Dict, Any, List, Optional
from dataclasses import dataclass
from abc import ABC, abstractmethod

@dataclass
class LinearConfig:
    api_key: str
    team_id: str
    workspace_id: Optional[str] = None

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

class LinearAdapter(TrackingToolAdapter):
    """Linear-specific adapter for project and milestone management"""

    def __init__(self, config: LinearConfig):
        self.config = config
        self.api_url = "https://api.linear.app/graphql"
        self.session = requests.Session()
        self.session.headers.update({
            'Authorization': f'Bearer {config.api_key}',
            'Content-Type': 'application/json'
        })

    def create_project(self, project_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Create Linear project with comprehensive SDLC metadata

        Args:
            project_data: Standardized project data from business case

        Returns:
            Dict with project_id, project_url, and creation_status
        """
        try:
            # Map universal project data to Linear project fields
            project_fields = self._map_to_linear_fields(project_data)

            # Create project via Linear GraphQL API
            mutation = """
                mutation CreateProject($input: ProjectCreateInput!) {
                    projectCreate(input: $input) {
                        success
                        project {
                            id
                            name
                            url
                            slugId
                        }
                    }
                }
            """

            variables = {'input': project_fields}
            response = self.session.post(
                self.api_url,
                json={'query': mutation, 'variables': variables}
            )

            if response.status_code == 200:
                data = response.json()
                if data.get('data', {}).get('projectCreate', {}).get('success'):
                    project = data['data']['projectCreate']['project']

                    # Add business case link as project description update
                    if project_data.get('business_case_url'):
                        self._add_business_case_link(project['id'], project_data['business_case_url'])

                    return {
                        'success': True,
                        'project_id': project['id'],
                        'project_url': project['url'],
                        'project_slug': project['slugId']
                    }
                else:
                    return {
                        'success': False,
                        'error': f"Linear API error: {data}",
                        'response': data
                    }
            else:
                return {
                    'success': False,
                    'error': f"HTTP error: {response.status_code}",
                    'response': response.text
                }

        except Exception as e:
            return {
                'success': False,
                'error': f"Exception creating project: {str(e)}"
            }

    def create_sub_projects(self, parent_project_id: str, sub_projects: List[Dict]) -> List[Dict]:
        """
        Create milestones for phase-based project breakdown in Linear

        Args:
            parent_project_id: ID of parent project
            sub_projects: List of sub-project definitions

        Returns:
            List of created milestone details
        """
        created_milestones = []

        for sub_project in sub_projects:
            try:
                # Create milestone for each sub-project
                milestone_data = {
                    'name': sub_project['title'],
                    'description': sub_project['description'],
                    'targetDate': sub_project.get('target_date'),
                    'projectId': parent_project_id
                }

                mutation = """
                    mutation CreateMilestone($input: MilestoneCreateInput!) {
                        milestoneCreate(input: $input) {
                            success
                            milestone {
                                id
                                name
                                url
                                targetDate
                            }
                        }
                    }
                """

                variables = {'input': milestone_data}
                response = self.session.post(
                    self.api_url,
                    json={'query': mutation, 'variables': variables}
                )

                if response.status_code == 200:
                    data = response.json()
                    if data.get('data', {}).get('milestoneCreate', {}).get('success'):
                        milestone = data['data']['milestoneCreate']['milestone']
                        created_milestones.append({
                            'phase': sub_project['phase'],
                            'milestone_id': milestone['id'],
                            'milestone_url': milestone['url'],
                            'success': True
                        })
                    else:
                        created_milestones.append({
                            'phase': sub_project['phase'],
                            'success': False,
                            'error': f"Linear API error: {data}"
                        })
                else:
                    created_milestones.append({
                        'phase': sub_project['phase'],
                        'success': False,
                        'error': f"HTTP error: {response.status_code}"
                    })

            except Exception as e:
                created_milestones.append({
                    'phase': sub_project.get('phase', 'Unknown'),
                    'success': False,
                    'error': str(e)
                })

        return created_milestones

    def link_business_case(self, project_id: str, bc_url: str) -> bool:
        """Update project description to include business case link"""
        try:
            return self._add_business_case_link(project_id, bc_url)
        except Exception as e:
            print(f"Failed to link business case: {str(e)}")
            return False

    def _map_to_linear_fields(self, project_data: Dict[str, Any]) -> Dict[str, Any]:
        """Map universal project data to Linear-specific field format"""

        fields = {
            'name': project_data['title'],
            'description': self._format_project_description(project_data),
            'teamIds': [self.config.team_id],
            'state': 'planned'
        }

        # Target date
        if 'target_date' in project_data:
            fields['targetDate'] = project_data['target_date']

        # Lead assignment
        if 'assignee' in project_data:
            fields['leadId'] = project_data['assignee']

        # Priority mapping (Linear uses 1-4 scale)
        priority_map = {
            'Critical': 1,
            'High': 2,
            'Medium': 3,
            'Low': 4
        }
        fields['priority'] = priority_map.get(project_data.get('priority'), 3)

        return fields

    def _format_project_description(self, project_data: Dict[str, Any]) -> str:
        """Format comprehensive project description with business context"""

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

    def _add_business_case_link(self, project_id: str, bc_url: str) -> bool:
        """Update project to include business case reference"""
        try:
            # Get current project description
            query = """
                query GetProject($id: String!) {
                    project(id: $id) {
                        id
                        description
                    }
                }
            """

            response = self.session.post(
                self.api_url,
                json={'query': query, 'variables': {'id': project_id}}
            )

            if response.status_code == 200:
                data = response.json()
                project = data.get('data', {}).get('project', {})
                current_description = project.get('description', '')

                # Add business case link if not already present
                bc_section = f"\n\n## Business Case\n[Approved Business Case]({bc_url})"
                if bc_url not in current_description:
                    new_description = current_description + bc_section

                    # Update project description
                    update_mutation = """
                        mutation UpdateProject($id: String!, $input: ProjectUpdateInput!) {
                            projectUpdate(id: $id, input: $input) {
                                success
                            }
                        }
                    """

                    update_variables = {
                        'id': project_id,
                        'input': {'description': new_description}
                    }

                    update_response = self.session.post(
                        self.api_url,
                        json={'query': update_mutation, 'variables': update_variables}
                    )

                    return update_response.status_code == 200

            return False

        except Exception as e:
            print(f"Failed to add business case link: {str(e)}")
            return False


def create_project_structure(business_case_data: Dict[str, Any], client_config: Dict[str, Any]) -> Dict[str, Any]:
    """
    Main entry point for creating Linear project structure

    Args:
        business_case_data: Data from approved business case
        client_config: Client configuration including Linear details

    Returns:
        Complete project creation results
    """

    # Initialize Linear adapter
    linear_config = LinearConfig(
        api_key=client_config['linear']['api_key'],
        team_id=client_config['linear']['team_id'],
        workspace_id=client_config['linear'].get('workspace_id')
    )

    adapter = LinearAdapter(linear_config)

    # Create main project
    project_result = adapter.create_project(business_case_data)

    if not project_result['success']:
        return {
            'success': False,
            'error': 'Failed to create main project',
            'details': project_result
        }

    # Create milestones for large projects
    milestones_result = []
    if business_case_data.get('complexity') in ['High', 'Very High']:
        sub_projects = generate_phase_milestones(business_case_data)
        milestones_result = adapter.create_sub_projects(
            project_result['project_id'],
            sub_projects
        )

    return {
        'success': True,
        'tracking_tool': 'linear',
        'main_project': project_result,
        'milestones': milestones_result,
        'project_url': project_result['project_url'],
        'created_at': business_case_data.get('created_at'),
        'total_milestones': len(milestones_result)
    }


def generate_phase_milestones(business_case_data: Dict[str, Any]) -> List[Dict[str, Any]]:
    """Generate standard SDLC phase-based milestones for Linear"""

    project_name = business_case_data.get('title', 'Project')

    return [
        {
            'title': f"{project_name} - Discovery Complete",
            'phase': 'Phase 2 - Discovery',
            'description': 'PRD Technical + PRD Functional + Cross-review + Risk Log completed and approved',
            'target_date': business_case_data.get('discovery_target'),
        },
        {
            'title': f"{project_name} - Requirements Finalized",
            'phase': 'Phase 3 - Specification',
            'description': 'All Functional Requirements + Non-Functional Requirements + RTM completed and validated',
            'target_date': business_case_data.get('requirements_target'),
        },
        {
            'title': f"{project_name} - Core Development Complete",
            'phase': 'Phase 5 - Development',
            'description': 'Main features implemented, APIs functional, core algorithms deployed',
            'target_date': business_case_data.get('development_target'),
        },
        {
            'title': f"{project_name} - QA Sign-off",
            'phase': 'Phase 6 - Testing',
            'description': 'All test cases executed, regression complete, QA approval obtained',
            'target_date': business_case_data.get('qa_target'),
        },
        {
            'title': f"{project_name} - Security Cleared",
            'phase': 'Phase 7 - Security',
            'description': 'Security review complete, compliance verified, pen testing passed',
            'target_date': business_case_data.get('security_target'),
        },
        {
            'title': f"{project_name} - Production Ready",
            'phase': 'Phase 8 - Deployment',
            'description': 'Deployment complete, monitoring active, stakeholder communication sent',
            'target_date': business_case_data.get('release_target'),
        }
    ]


if __name__ == "__main__":
    print("🔧 Linear Adapter - Configuration Required")
    print("📖 See: docs/security/credential-management.md")
    print("✅ Set environment variables: LINEAR_API_KEY, LINEAR_TEAM_ID")
    print("🎯 Example business case structure available in docstrings")

    # Validate environment configuration
    import os
    required_env = ['LINEAR_API_KEY', 'LINEAR_TEAM_ID']
    missing = [var for var in required_env if not os.getenv(var)]

    if missing:
        print(f"❌ Missing environment variables: {', '.join(missing)}")
    else:
        print("✅ Environment configuration complete")
        print("🚀 Ready to create Linear projects")