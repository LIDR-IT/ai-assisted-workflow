#!/usr/bin/env python3
"""
Tracking Integration - Main Orchestrator Script

Auto-detects client's tracking tool and creates appropriate project structure.
Handles Jira, Linear, Notion, Azure DevOps, and GitHub Projects seamlessly.
"""

import os
import sys
import json
import importlib.util
from typing import Dict, Any, Optional
from pathlib import Path

# Add adapters directory to Python path
ADAPTERS_DIR = Path(__file__).parent.parent / "adapters"
sys.path.insert(0, str(ADAPTERS_DIR))

def detect_tracking_tool(client_config: Dict[str, Any]) -> str:
    """
    Auto-detect tracking tool from client configuration

    Args:
        client_config: Client configuration data

    Returns:
        Tool name (jira, linear, notion, azure, github)
    """
    # Direct configuration takes precedence
    if client_config.get('tracking_tool'):
        return client_config['tracking_tool'].lower()

    # Check for tool-specific configuration sections
    if 'jira' in client_config and client_config['jira'].get('server'):
        return 'jira'
    if 'linear' in client_config and client_config['linear'].get('api_key'):
        return 'linear'
    if 'notion' in client_config and client_config['notion'].get('token'):
        return 'notion'
    if 'azure' in client_config and client_config['azure'].get('organization'):
        return 'azure'
    if 'github' in client_config and client_config['github'].get('token'):
        return 'github'

    # Client-specific defaults (evidence-based)
    client_name = client_config.get('name', '').lower()
    if 'docline' in client_name:
        return 'linear'
    if 'facephi' in client_name or 'acme' in client_name:
        return 'jira'

    # Industry defaults
    industry = client_config.get('industry', '').lower()
    if 'healthcare' in industry:
        return 'linear'
    if 'biometric' in industry or 'identity' in industry:
        return 'jira'
    if 'startup' in industry or 'saas' in industry:
        return 'linear'
    if 'enterprise' in industry or 'finance' in industry:
        return 'jira'

    # Conservative default
    return 'jira'

def load_adapter(tool_name: str):
    """
    Dynamically load the appropriate tracking tool adapter

    Args:
        tool_name: Name of the tracking tool

    Returns:
        Adapter module with create_project_structure function
    """
    adapter_file = ADAPTERS_DIR / f"{tool_name}-adapter.py"

    if not adapter_file.exists():
        raise FileNotFoundError(f"Adapter not found: {adapter_file}")

    # Load adapter module dynamically
    spec = importlib.util.spec_from_file_location(f"{tool_name}_adapter", adapter_file)
    adapter_module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(adapter_module)

    # Validate adapter has required function
    if not hasattr(adapter_module, 'create_project_structure'):
        raise AttributeError(f"Adapter {tool_name} missing create_project_structure function")

    return adapter_module

def validate_configuration(tool_name: str, client_config: Dict[str, Any]) -> bool:
    """
    Validate that client configuration has required fields for the detected tool

    Args:
        tool_name: Detected tracking tool name
        client_config: Client configuration

    Returns:
        True if configuration is valid
    """
    required_configs = {
        'jira': ['server', 'username', 'api_token', 'project_key'],
        'linear': ['api_key', 'team_id'],
        'notion': ['token', 'database_id'],
        'azure': ['organization', 'project', 'personal_access_token'],
        'github': ['token', 'owner', 'repo']
    }

    if tool_name not in required_configs:
        return False

    tool_config = client_config.get(tool_name, {})
    required_fields = required_configs[tool_name]

    missing_fields = [field for field in required_fields if not tool_config.get(field)]

    if missing_fields:
        print(f"❌ Missing {tool_name} configuration: {', '.join(missing_fields)}")
        print(f"📖 See: docs/security/credential-management.md")
        return False

    return True

def create_project_structure(business_case_path: str, client_config_path: str) -> Dict[str, Any]:
    """
    Main entry point for creating project structure in any tracking tool

    Args:
        business_case_path: Path to approved business case JSON/YAML
        client_config_path: Path to client configuration

    Returns:
        Project creation results with tool-agnostic format
    """
    try:
        # Load business case data
        with open(business_case_path, 'r') as f:
            if business_case_path.endswith('.json'):
                business_case_data = json.load(f)
            else:
                import yaml
                business_case_data = yaml.safe_load(f)

        # Load client configuration
        with open(client_config_path, 'r') as f:
            if client_config_path.endswith('.json'):
                client_config = json.load(f)
            else:
                import yaml
                client_config = yaml.safe_load(f)

        # Auto-detect tracking tool
        tool_name = detect_tracking_tool(client_config)
        print(f"🔍 Detected tracking tool: {tool_name}")

        # Validate configuration
        if not validate_configuration(tool_name, client_config):
            return {
                'success': False,
                'error': 'Invalid configuration',
                'tool': tool_name,
                'help': 'Check configuration and credential setup'
            }

        # Load appropriate adapter
        try:
            adapter = load_adapter(tool_name)
            print(f"✅ Loaded {tool_name} adapter")
        except Exception as e:
            return {
                'success': False,
                'error': f'Failed to load adapter: {str(e)}',
                'tool': tool_name
            }

        # Create project structure using adapter
        result = adapter.create_project_structure(business_case_data, client_config)

        # Add metadata about the operation
        result.update({
            'tool_detected': tool_name,
            'business_case_source': business_case_path,
            'client_config_source': client_config_path,
            'adapter_version': getattr(adapter, '__version__', '1.0.0')
        })

        return result

    except FileNotFoundError as e:
        return {
            'success': False,
            'error': f'File not found: {str(e)}',
            'help': 'Check that business case and client config files exist'
        }
    except Exception as e:
        return {
            'success': False,
            'error': f'Unexpected error: {str(e)}',
            'help': 'Check logs and configuration'
        }

def generate_sample_business_case() -> Dict[str, Any]:
    """Generate a sample business case structure for testing"""
    return {
        'title': 'Sample Project - Feature Enhancement',
        'description': 'Sample project for testing tracking integration functionality',
        'priority': 'Medium',
        'complexity': 'Medium',
        'sponsor': 'Product Manager',
        'strategic_alignment': 'Q2-2026: Platform Enhancement',
        'budget': '€50K',
        'expected_roi': '150% ROI in 12 months',
        'business_case_url': 'https://confluence.company.com/bc-sample',
        'target_date': '2026-08-31',
        'components': ['Backend-API', 'Frontend-UI', 'Database'],
        'labels': ['phase:origination', 'type:feature', 'priority:medium'],
        'version': 'v1.1.0',
        'assignee': 'project.manager',
        'reporter': 'product.owner'
    }

def print_usage():
    """Print usage instructions"""
    print("""
🚀 Tracking Integration - Adaptive Project Creator

Usage:
    python create-tracking.py <business_case_file> <client_config_file>

Examples:
    python create-tracking.py bc-project-alpha.json client-docline.yaml
    python create-tracking.py bc-biometric-v3.yaml client-facephi.json

Supported Tools:
    • Jira (Atlassian Cloud/Server)
    • Linear (API v1)
    • Notion (Database API)
    • Azure DevOps (REST API)
    • GitHub Projects (GraphQL)

Configuration:
    📖 See: docs/security/credential-management.md
    🔧 Set environment variables for secure credential management

Sample Files:
    python create-tracking.py --generate-samples
    """)

if __name__ == "__main__":
    if len(sys.argv) == 1 or '--help' in sys.argv:
        print_usage()
        sys.exit(0)

    if '--generate-samples' in sys.argv:
        # Generate sample files for testing
        sample_bc = generate_sample_business_case()

        with open('sample-business-case.json', 'w') as f:
            json.dump(sample_bc, f, indent=2)

        sample_config = {
            'name': 'Sample Client',
            'industry': 'Software Development',
            'tracking_tool': 'jira',
            'jira': {
                'server': 'https://your-instance.atlassian.net',
                'project_key': 'SAMPLE'
            }
        }

        with open('sample-client-config.json', 'w') as f:
            json.dump(sample_config, f, indent=2)

        print("✅ Generated sample files:")
        print("   • sample-business-case.json")
        print("   • sample-client-config.json")
        print("🔧 Configure credentials before running")
        sys.exit(0)

    if len(sys.argv) != 3:
        print("❌ Error: Two arguments required")
        print_usage()
        sys.exit(1)

    business_case_path = sys.argv[1]
    client_config_path = sys.argv[2]

    print(f"🎯 Creating project structure...")
    print(f"📋 Business Case: {business_case_path}")
    print(f"⚙️ Client Config: {client_config_path}")
    print()

    result = create_project_structure(business_case_path, client_config_path)

    # Output results
    if result['success']:
        print("✅ Project created successfully!")
        print(f"🔧 Tool: {result['tool_detected']}")
        print(f"🌐 URL: {result.get('project_url', 'N/A')}")
        if 'sub_epics' in result or 'milestones' in result:
            sub_count = len(result.get('sub_epics', result.get('milestones', [])))
            print(f"📊 Sub-projects: {sub_count}")
    else:
        print("❌ Project creation failed!")
        print(f"Error: {result['error']}")
        if 'help' in result:
            print(f"Help: {result['help']}")

    # Save detailed results
    with open('tracking-integration-result.json', 'w') as f:
        json.dump(result, f, indent=2)

    print(f"\n📄 Detailed results saved to: tracking-integration-result.json")