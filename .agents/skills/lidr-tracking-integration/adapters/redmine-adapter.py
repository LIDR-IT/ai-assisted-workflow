#!/usr/bin/env python3
"""
Redmine Adapter for Tracking Integration Skill

Proves tool-agnosticism: a client that does NOT use Jira can bind `tracking:
redmine` in its client config and the same skills work unchanged. Implements
the shared TrackingToolAdapter interface (create_project / create_sub_projects /
link_business_case) and the create_project_structure() entry point, mirroring
the Jira and Linear adapters.

Redmine has no native "epic": the parent SDLC container is modeled as a parent
issue (tracker "Epic" if configured, else the default tracker) inside the target
project, and phase sub-epics as child issues via parent_issue_id.

Auth: X-Redmine-API-Key header. REST API reference: <redmine>/projects.json,
<redmine>/issues.json.
"""

import requests
from typing import Dict, Any, List, Optional
from dataclasses import dataclass
from abc import ABC, abstractmethod


@dataclass
class RedmineConfig:
    url: str  # e.g. https://redmine.client.com
    api_key: str
    project_id: str  # project identifier or numeric id
    epic_tracker_id: Optional[int] = None  # tracker mapped to "Epic"; None = default


class TrackingToolAdapter(ABC):
    """Base interface for all tracking tool adapters (identical across adapters)."""

    @abstractmethod
    def create_project(self, project_data: Dict[str, Any]) -> Dict[str, Any]:
        pass

    @abstractmethod
    def create_sub_projects(self, parent_id: str, sub_projects: List[Dict]) -> List[Dict]:
        pass

    @abstractmethod
    def link_business_case(self, project_id: str, bc_url: str) -> bool:
        pass


class RedmineAdapter(TrackingToolAdapter):
    """Redmine-specific adapter for SDLC epic/sub-epic management via parent/child issues."""

    def __init__(self, config: RedmineConfig):
        self.config = config
        self.session = requests.Session()
        self.session.headers.update({
            'X-Redmine-API-Key': config.api_key,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        })

    def create_project(self, project_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create the top-level SDLC tracking issue (acts as the 'epic')."""
        try:
            issue_fields = self._map_to_issue_fields(project_data)
            url = f"{self.config.url}/issues.json"
            response = self.session.post(url, json={'issue': issue_fields})

            if response.status_code == 201:
                issue = response.json()['issue']
                issue_id = issue['id']

                if project_data.get('business_case_url'):
                    self._add_note(issue_id, self._bc_note(project_data['business_case_url']))

                return {
                    'success': True,
                    'epic_key': str(issue_id),  # uniform handle name across adapters
                    'epic_id': issue_id,
                    'epic_url': f"{self.config.url}/issues/{issue_id}",
                }
            return {
                'success': False,
                'error': f"Failed to create epic issue: {response.text}",
                'status_code': response.status_code,
            }
        except Exception as e:
            return {'success': False, 'error': f"Exception creating epic: {str(e)}"}

    def create_sub_projects(self, parent_epic_key: str, sub_projects: List[Dict]) -> List[Dict]:
        """Create phase sub-epics as child issues linked via parent_issue_id."""
        created: List[Dict] = []
        for sub in sub_projects:
            try:
                fields = {
                    'project_id': self.config.project_id,
                    'subject': sub['title'],
                    'description': sub['description'],
                    'parent_issue_id': int(parent_epic_key),
                }
                if self.config.epic_tracker_id:
                    fields['tracker_id'] = self.config.epic_tracker_id

                url = f"{self.config.url}/issues.json"
                response = self.session.post(url, json={'issue': fields})

                if response.status_code == 201:
                    issue = response.json()['issue']
                    created.append({
                        'phase': sub['phase'],
                        'epic_key': str(issue['id']),
                        'epic_url': f"{self.config.url}/issues/{issue['id']}",
                        'success': True,
                    })
                else:
                    created.append({'phase': sub['phase'], 'success': False, 'error': response.text})
            except Exception as e:
                created.append({'phase': sub.get('phase', 'Unknown'), 'success': False, 'error': str(e)})
        return created

    def link_business_case(self, epic_key: str, bc_url: str) -> bool:
        try:
            return self._add_note(int(epic_key), self._bc_note(bc_url))
        except Exception as e:
            print(f"Failed to link business case: {str(e)}")
            return False

    # --- internal helpers -----------------------------------------------------

    def _map_to_issue_fields(self, project_data: Dict[str, Any]) -> Dict[str, Any]:
        fields: Dict[str, Any] = {
            'project_id': self.config.project_id,
            'subject': project_data['title'],
            'description': self._format_description(project_data),
        }
        if self.config.epic_tracker_id:
            fields['tracker_id'] = self.config.epic_tracker_id
        # Redmine priority is an id; clients map names->ids in their config if needed.
        if 'priority_id' in project_data:
            fields['priority_id'] = project_data['priority_id']
        if 'due_date' in project_data:
            fields['due_date'] = project_data['due_date']
        return fields

    def _format_description(self, project_data: Dict[str, Any]) -> str:
        parts = [project_data.get('description', ''), "", "h2. Business Context"]
        for key, label in (
            ('sponsor', 'Sponsor'),
            ('strategic_alignment', 'Strategic Alignment'),
            ('budget', 'Budget'),
            ('expected_roi', 'Expected ROI'),
        ):
            if key in project_data:
                parts.append(f"*{label}:* {project_data[key]}")
        if 'business_case_url' in project_data:
            parts += ["", "h2. References", f'"Business Case":{project_data["business_case_url"]}']
        return "\n".join(parts)

    def _bc_note(self, bc_url: str) -> str:
        return (
            "*Business Case Reference*\n\n"
            f'Approved Business Case: "{bc_url}":{bc_url}\n\n'
            "This issue implements the requirements and scope defined in the linked business case."
        )

    def _add_note(self, issue_id: int, note: str) -> bool:
        try:
            url = f"{self.config.url}/issues/{issue_id}.json"
            response = self.session.put(url, json={'issue': {'notes': note}})
            return response.status_code in (200, 204)
        except Exception as e:
            print(f"Failed to add note: {str(e)}")
            return False


def create_project_structure(business_case_data: Dict[str, Any], client_config: Dict[str, Any]) -> Dict[str, Any]:
    """Entry point — signature matches jira-adapter / linear-adapter."""
    rm = client_config['redmine']
    config = RedmineConfig(
        url=rm['url'],
        api_key=rm['api_key'],
        project_id=rm['project_id'],
        epic_tracker_id=rm.get('epic_tracker_id'),
    )
    adapter = RedmineAdapter(config)

    project_result = adapter.create_project(business_case_data)
    if not project_result['success']:
        return {'success': False, 'error': 'Failed to create main epic issue', 'details': project_result}

    sub_epics_result: List[Dict] = []
    if business_case_data.get('complexity') in ['High', 'Very High']:
        sub_projects = generate_phase_sub_projects(business_case_data)
        sub_epics_result = adapter.create_sub_projects(project_result['epic_key'], sub_projects)

    return {
        'success': True,
        'tracking_tool': 'redmine',
        'main_epic': project_result,
        'sub_epics': sub_epics_result,
        'project_url': project_result['epic_url'],
        'created_at': business_case_data.get('created_at'),
        'total_sub_epics': len(sub_epics_result),
    }


def generate_phase_sub_projects(business_case_data: Dict[str, Any]) -> List[Dict[str, Any]]:
    """Standard SDLC phase-based sub-epics (tool-neutral; mirrors jira/linear)."""
    project_name = business_case_data.get('title', 'Project')
    return [
        {'title': f"{project_name} - Discovery & PRD", 'phase': 'Phase 2 - Discovery',
         'description': 'PRD + Cross-review + Risk Log + Architecture documentation (Gate 1)'},
        {'title': f"{project_name} - Requirements Specification", 'phase': 'Phase 3 - Specification',
         'description': 'Functional Requirements with BDD + Non-Functional Requirements + RTM (Gate 2)'},
        {'title': f"{project_name} - Core Development", 'phase': 'Phase 5 - Development',
         'description': 'Core algorithms, APIs, database schema, main components (Gate 4)'},
        {'title': f"{project_name} - Testing & QA", 'phase': 'Phase 6 - Testing',
         'description': 'Test automation, performance testing, regression suite (Gate 5)'},
        {'title': f"{project_name} - Security & Compliance", 'phase': 'Phase 7 - Security',
         'description': 'DAST, penetration testing, compliance certification (Gate 6)'},
        {'title': f"{project_name} - Release & Deployment", 'phase': 'Phase 8 - Deployment',
         'description': 'Production deployment, documentation finalization, comms (Gate 7)'},
    ]


if __name__ == "__main__":
    import os
    print("🔧 Redmine Adapter - Configuration Required")
    print("✅ Set environment variables: REDMINE_URL, REDMINE_API_KEY, REDMINE_PROJECT_ID")
    required_env = ['REDMINE_URL', 'REDMINE_API_KEY', 'REDMINE_PROJECT_ID']
    missing = [var for var in required_env if not os.getenv(var)]
    if missing:
        print(f"❌ Missing environment variables: {', '.join(missing)}")
    else:
        print("✅ Environment configuration complete")
        print("🚀 Ready to create Redmine SDLC issue hierarchy")
