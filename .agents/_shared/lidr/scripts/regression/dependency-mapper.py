#!/usr/bin/env python3
"""
Component Dependency Mapper
Analyzes a codebase to automatically build component dependency graphs for
regression testing.

This script is DOMAIN-AGNOSTIC by default: the built-in component, test and
risk patterns describe generic application layers (api gateway, authentication,
core domain, database, configuration, ...) and contain no industry-specific
terminology.

To analyze a domain-specific codebase, override the defaults by either:
  - editing the `DEFAULT_COMPONENT_CONFIG` / `DEFAULT_TEST_PATTERNS` /
    `DEFAULT_COMPONENT_KEYWORDS` constants below, or
  - passing a `--config <file>.json` with the same shape, or
  - using one of the labelled example overrides shipped with this module.

A biometric-identity override is preserved as an EXAMPLE (not the active
default) in the `BIOMETRIC_EXAMPLE_*` constants below, and mirrored as a
sibling file `dependency-mapper.biometric-example.json` for `--config` use.
"""

import json
import os
import re
import subprocess
from pathlib import Path
from typing import Dict, List, Set, Tuple
from collections import defaultdict, deque
from dataclasses import dataclass, asdict
import argparse

# ---------------------------------------------------------------------------
# Generic (domain-agnostic) DEFAULT configuration — the active default.
# ---------------------------------------------------------------------------

# Components identified by directory-structure glob patterns. Generic layers
# common to most applications; no industry-specific concepts.
DEFAULT_COMPONENT_CONFIG = {
    'api_gateway': {
        'patterns': ['**/api/**', '**/gateway/**', '**/middleware/**', '**/routes/**'],
        'entry_points': ['app.py', 'main.py', 'server.py', 'gateway.py'],
        'base_risk': 0.7
    },
    'authentication': {
        'patterns': ['**/auth/**', '**/jwt/**', '**/oauth/**', '**/security/**'],
        'entry_points': ['auth_service.py', 'jwt_handler.py', 'oauth_provider.py'],
        'base_risk': 0.95
    },
    'core_domain': {
        'patterns': ['**/core/**', '**/domain/**', '**/services/**', '**/lib/**'],
        'entry_points': ['domain_engine.py', 'service_manager.py', 'core_utils.py'],
        'base_risk': 1.0
    },
    'business_logic': {
        'patterns': ['**/logic/**', '**/handlers/**', '**/use_cases/**', '**/workflows/**'],
        'entry_points': ['handler.py', 'use_case.py', 'workflow.py'],
        'base_risk': 0.85
    },
    'integration': {
        'patterns': ['**/integration/**', '**/clients/**', '**/adapters/**', '**/connectors/**'],
        'entry_points': ['client.py', 'adapter.py', 'connector.py'],
        'base_risk': 0.8
    },
    'database': {
        'patterns': ['**/db/**', '**/models/**', '**/repository/**', '**/dao/**'],
        'entry_points': ['database.py', 'models.py', 'repository.py'],
        'base_risk': 0.75
    },
    'configuration': {
        'patterns': ['**/config/**', '**/settings/**', '**/env/**'],
        'entry_points': ['config.py', 'settings.py', 'environment.py'],
        'base_risk': 0.6
    }
}

# Keyword → component mapping used to resolve a raw dependency string (import
# path, api route, table name, ...) back to one of the components above.
DEFAULT_COMPONENT_KEYWORDS = {
    'api_gateway': ['api', 'gateway', 'route', 'middleware'],
    'authentication': ['auth', 'jwt', 'oauth', 'security', 'login'],
    'core_domain': ['domain', 'core', 'service', 'lib'],
    'business_logic': ['logic', 'handler', 'use_case', 'workflow'],
    'integration': ['integration', 'client', 'adapter', 'connector'],
    'database': ['db', 'models', 'repository', 'dao', 'table:'],
    'configuration': ['config', 'settings', 'env', 'environment']
}

# Generic regression test-case patterns per component.
DEFAULT_TEST_PATTERNS = {
    'api_gateway': [
        'TC_API_AUTHENTICATION', 'TC_RATE_LIMITING', 'TC_API_PERFORMANCE',
        'TC_ERROR_HANDLING', 'TC_REQUEST_VALIDATION', 'TC_RESPONSE_FORMAT'
    ],
    'authentication': [
        'TC_LOGIN_FLOW', 'TC_JWT_VALIDATION', 'TC_OAUTH_INTEGRATION',
        'TC_SESSION_MANAGEMENT', 'TC_PASSWORD_SECURITY', 'TC_MFA'
    ],
    'core_domain': [
        'TC_DOMAIN_LOGIC', 'TC_DOMAIN_VALIDATION', 'TC_DOMAIN_STATE',
        'TC_DOMAIN_STORAGE', 'TC_DOMAIN_QUALITY', 'TC_PERFORMANCE'
    ],
    'business_logic': [
        'TC_WORKFLOW_EXECUTION', 'TC_USE_CASE_HAPPY_PATH', 'TC_USE_CASE_EDGE_CASES',
        'TC_INPUT_VALIDATION', 'TC_ERROR_RECOVERY', 'TC_IDEMPOTENCY'
    ],
    'integration': [
        'TC_CLIENT_CONNECTION', 'TC_RETRY_LOGIC', 'TC_TIMEOUT_HANDLING',
        'TC_PAYLOAD_MAPPING', 'TC_CIRCUIT_BREAKER', 'TC_FALLBACK'
    ],
    'database': [
        'TC_DATA_INTEGRITY', 'TC_QUERY_PERFORMANCE', 'TC_BACKUP_RESTORE',
        'TC_CONCURRENT_ACCESS', 'TC_DATA_MIGRATION', 'TC_INDEX_EFFICIENCY'
    ],
    'configuration': [
        'TC_CONFIG_LOADING', 'TC_ENVIRONMENT_SWITCHING', 'TC_DEFAULT_VALUES',
        'TC_CONFIG_VALIDATION', 'TC_RUNTIME_UPDATES'
    ]
}

# ---------------------------------------------------------------------------
# Biometric-identity EXAMPLE override (NOT the active default).
# Provided as a clearly-labelled, overridable reference. To use it, pass it via
# --config or assign it into a DependencyMapper instance. Mirrored as the
# sibling file `dependency-mapper.biometric-example.json`.
# ---------------------------------------------------------------------------

BIOMETRIC_EXAMPLE_COMPONENT_CONFIG = {
    'facial_recognition': {
        'patterns': ['**/face_*', '**/facial/**', '**/liveness/**', '**/ml/face/**'],
        'entry_points': ['face_detection.py', 'liveness_detector.py', 'face_verification.py'],
        'base_risk': 0.9
    },
    'document_ocr': {
        'patterns': ['**/ocr/**', '**/document/**', '**/tesseract/**', '**/image_processing/**'],
        'entry_points': ['ocr_engine.py', 'document_processor.py', 'field_extractor.py'],
        'base_risk': 0.8
    },
    'voice_verification': {
        'patterns': ['**/voice/**', '**/audio/**', '**/voice_ml/**', '**/speech/**'],
        'entry_points': ['voice_enrollment.py', 'voice_verification.py', 'audio_processor.py'],
        'base_risk': 0.85
    },
    'api_gateway': {
        'patterns': ['**/api/**', '**/gateway/**', '**/middleware/**', '**/routes/**'],
        'entry_points': ['app.py', 'main.py', 'server.py', 'gateway.py'],
        'base_risk': 0.7
    },
    'authentication': {
        'patterns': ['**/auth/**', '**/jwt/**', '**/oauth/**', '**/security/**'],
        'entry_points': ['auth_service.py', 'jwt_handler.py', 'oauth_provider.py'],
        'base_risk': 0.95
    },
    'core_biometric': {
        'patterns': ['**/core/**', '**/biometric/**', '**/template/**', '**/crypto/**'],
        'entry_points': ['biometric_engine.py', 'template_manager.py', 'crypto_utils.py'],
        'base_risk': 1.0
    },
    'database': {
        'patterns': ['**/db/**', '**/models/**', '**/repository/**', '**/dao/**'],
        'entry_points': ['database.py', 'models.py', 'repository.py'],
        'base_risk': 0.75
    },
    'configuration': {
        'patterns': ['**/config/**', '**/settings/**', '**/env/**'],
        'entry_points': ['config.py', 'settings.py', 'environment.py'],
        'base_risk': 0.6
    }
}

BIOMETRIC_EXAMPLE_COMPONENT_KEYWORDS = {
    'facial_recognition': ['face', 'facial', 'liveness', 'biometric_face'],
    'document_ocr': ['ocr', 'document', 'tesseract', 'extraction'],
    'voice_verification': ['voice', 'audio', 'speech', 'voice_ml'],
    'api_gateway': ['api', 'gateway', 'route', 'middleware'],
    'authentication': ['auth', 'jwt', 'oauth', 'security', 'login'],
    'core_biometric': ['biometric', 'template', 'crypto', 'core'],
    'database': ['db', 'models', 'repository', 'dao', 'table:'],
    'configuration': ['config', 'settings', 'env', 'environment']
}

BIOMETRIC_EXAMPLE_TEST_PATTERNS = {
    'facial_recognition': [
        'TC_FACE_ACCURACY', 'TC_LIVENESS_DETECTION', 'TC_FACE_ENROLLMENT',
        'TC_FACE_VERIFICATION', 'TC_ANTI_SPOOFING', 'TC_FACE_QUALITY'
    ],
    'document_ocr': [
        'TC_DNI_EXTRACTION', 'TC_PASSPORT_OCR', 'TC_LICENSE_PROCESSING',
        'TC_DOCUMENT_VALIDATION', 'TC_FIELD_ACCURACY', 'TC_IMAGE_QUALITY'
    ],
    'voice_verification': [
        'TC_VOICE_ENROLLMENT', 'TC_VOICE_VERIFICATION', 'TC_VOICE_QUALITY',
        'TC_NOISE_HANDLING', 'TC_ACCENT_ROBUSTNESS', 'TC_VOICE_ANTI_SPOOFING'
    ],
    'api_gateway': [
        'TC_API_AUTHENTICATION', 'TC_RATE_LIMITING', 'TC_API_PERFORMANCE',
        'TC_ERROR_HANDLING', 'TC_REQUEST_VALIDATION', 'TC_RESPONSE_FORMAT'
    ],
    'authentication': [
        'TC_LOGIN_FLOW', 'TC_JWT_VALIDATION', 'TC_OAUTH_INTEGRATION',
        'TC_SESSION_MANAGEMENT', 'TC_PASSWORD_SECURITY', 'TC_MFA'
    ],
    'core_biometric': [
        'TC_TEMPLATE_GENERATION', 'TC_TEMPLATE_MATCHING', 'TC_ENCRYPTION',
        'TC_BIOMETRIC_STORAGE', 'TC_TEMPLATE_QUALITY', 'TC_PERFORMANCE'
    ],
    'database': [
        'TC_DATA_INTEGRITY', 'TC_QUERY_PERFORMANCE', 'TC_BACKUP_RESTORE',
        'TC_CONCURRENT_ACCESS', 'TC_DATA_MIGRATION', 'TC_INDEX_EFFICIENCY'
    ],
    'configuration': [
        'TC_CONFIG_LOADING', 'TC_ENVIRONMENT_SWITCHING', 'TC_DEFAULT_VALUES',
        'TC_CONFIG_VALIDATION', 'TC_RUNTIME_UPDATES'
    ]
}


@dataclass
class ComponentDependency:
    component: str
    depends_on: str
    dependency_type: str  # import, api_call, config, database
    confidence: float
    evidence: List[str]

@dataclass
class ComponentInfo:
    name: str
    file_patterns: List[str]
    entry_points: List[str]
    dependencies: List[str]
    dependents: List[str]
    risk_weight: float
    test_coverage: float

class DependencyMapper:
    def __init__(self, source_dir: str, config: dict = None):
        self.source_dir = Path(source_dir)
        self.components = {}
        self.dependencies = []

        # Overridable configuration. Defaults are domain-agnostic; callers may
        # supply a `config` dict with keys: component_config, component_keywords,
        # test_patterns.
        config = config or {}
        self.component_config = config.get('component_config', DEFAULT_COMPONENT_CONFIG)
        self.component_keywords = config.get('component_keywords', DEFAULT_COMPONENT_KEYWORDS)
        self.test_patterns = config.get('test_patterns', DEFAULT_TEST_PATTERNS)

        self.import_patterns = {
            'python': r'(?:from|import)\s+([a-zA-Z_][a-zA-Z0-9_\.]*)',
            'javascript': r'(?:import.*from\s+["\']([^"\']+)["\']|require\(["\']([^"\']+)["\']\))',
            'typescript': r'(?:import.*from\s+["\']([^"\']+)["\']|import\(["\']([^"\']+)["\']\))',
            'java': r'import\s+([a-zA-Z_][a-zA-Z0-9_\.]*)',
            'go': r'import\s+(?:\(([^)]+)\)|"([^"]+)")'
        }
        self.api_call_patterns = {
            'rest_api': r'(?:fetch|axios|requests?)\s*\(\s*["\']([^"\']+)["\']',
            'internal_api': r'(?:call|invoke|request)\s*\(\s*["\']([^"\']+)["\']'
        }

    def scan_codebase(self) -> Dict[str, ComponentInfo]:
        """Scan entire codebase to identify components and dependencies"""
        print("🔍 Scanning codebase for components...")

        # Identify components based on directory structure
        self._identify_components()

        # Analyze dependencies
        for component_name in self.components.keys():
            print(f"  Analyzing {component_name}...")
            self._analyze_component_dependencies(component_name)

        # Build dependency graph
        self._build_dependency_graph()

        return self.components

    def _identify_components(self):
        """Identify components based on the configured codebase structure"""
        domain_components = self.component_config

        for comp_name, comp_config in domain_components.items():
            matching_files = self._find_matching_files(comp_config['patterns'])
            if matching_files:
                self.components[comp_name] = ComponentInfo(
                    name=comp_name,
                    file_patterns=comp_config['patterns'],
                    entry_points=comp_config['entry_points'],
                    dependencies=[],
                    dependents=[],
                    risk_weight=comp_config['base_risk'],
                    test_coverage=0.0  # Will be calculated later
                )

    def _find_matching_files(self, patterns: List[str]) -> List[str]:
        """Find files matching the given patterns"""
        matching_files = []
        for pattern in patterns:
            try:
                result = subprocess.run(
                    ['find', str(self.source_dir), '-path', pattern, '-type', 'f'],
                    capture_output=True, text=True
                )
                if result.returncode == 0:
                    files = [f.strip() for f in result.stdout.split('\n') if f.strip()]
                    matching_files.extend(files)
            except subprocess.CalledProcessError:
                pass  # Pattern didn't match any files
        return matching_files

    def _analyze_component_dependencies(self, component_name: str):
        """Analyze dependencies for a specific component"""
        component = self.components[component_name]

        # Get all files for this component
        component_files = []
        for pattern in component.file_patterns:
            component_files.extend(self._find_matching_files([pattern]))

        dependencies = set()

        for file_path in component_files:
            file_path_obj = Path(file_path)
            if file_path_obj.suffix in ['.py', '.js', '.ts', '.java', '.go']:
                file_deps = self._analyze_file_dependencies(file_path, component_name)
                dependencies.update(file_deps)

        # Convert to other component names
        component_dependencies = []
        for dep_string in dependencies:
            target_component = self._map_dependency_to_component(dep_string, component_name)
            if target_component and target_component != component_name:
                component_dependencies.append(target_component)

        component.dependencies = list(set(component_dependencies))

    def _analyze_file_dependencies(self, file_path: str, source_component: str) -> Set[str]:
        """Analyze dependencies in a single file"""
        dependencies = set()

        try:
            with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read()

            # Detect file type and use appropriate patterns
            file_ext = Path(file_path).suffix.lower()

            # Import dependencies
            if file_ext == '.py':
                dependencies.update(self._extract_patterns(content, self.import_patterns['python']))
            elif file_ext in ['.js', '.jsx']:
                dependencies.update(self._extract_patterns(content, self.import_patterns['javascript']))
            elif file_ext in ['.ts', '.tsx']:
                dependencies.update(self._extract_patterns(content, self.import_patterns['typescript']))
            elif file_ext == '.java':
                dependencies.update(self._extract_patterns(content, self.import_patterns['java']))
            elif file_ext == '.go':
                dependencies.update(self._extract_patterns(content, self.import_patterns['go']))

            # API call dependencies
            for pattern_name, pattern in self.api_call_patterns.items():
                dependencies.update(self._extract_patterns(content, pattern))

            # Database dependencies
            db_patterns = [
                r'SELECT\s+.*\s+FROM\s+([a-zA-Z_][a-zA-Z0-9_]*)',
                r'INSERT\s+INTO\s+([a-zA-Z_][a-zA-Z0-9_]*)',
                r'UPDATE\s+([a-zA-Z_][a-zA-Z0-9_]*)',
                r'DELETE\s+FROM\s+([a-zA-Z_][a-zA-Z0-9_]*)'
            ]
            for pattern in db_patterns:
                matches = re.finditer(pattern, content, re.IGNORECASE | re.MULTILINE)
                for match in matches:
                    dependencies.add(f"table:{match.group(1)}")

        except (IOError, UnicodeDecodeError):
            pass  # Skip files that can't be read

        return dependencies

    def _extract_patterns(self, content: str, pattern: str) -> Set[str]:
        """Extract matches from content using regex pattern"""
        matches = set()
        for match in re.finditer(pattern, content, re.MULTILINE):
            for group in match.groups():
                if group and group.strip():
                    matches.add(group.strip())
        return matches

    def _map_dependency_to_component(self, dependency: str, source_component: str) -> str:
        """Map a dependency string to a component name"""
        # Direct component name mapping
        component_keywords = self.component_keywords

        dependency_lower = dependency.lower()

        for component, keywords in component_keywords.items():
            if component != source_component:  # Don't self-reference
                for keyword in keywords:
                    if keyword in dependency_lower:
                        return component

        return None

    def _build_dependency_graph(self):
        """Build bidirectional dependency graph"""
        # Build dependents list
        for component_name, component in self.components.items():
            for dependency in component.dependencies:
                if dependency in self.components:
                    self.components[dependency].dependents.append(component_name)

    def calculate_impact_scores(self) -> Dict[str, float]:
        """Calculate impact scores based on dependency complexity and risk"""
        impact_scores = {}

        for component_name, component in self.components.items():
            # Base score from risk weight
            base_score = component.risk_weight

            # Dependency complexity multiplier
            dependency_count = len(component.dependencies)
            dependent_count = len(component.dependents)

            # Components with many dependents are more critical
            dependency_multiplier = 1.0 + (dependent_count * 0.1)

            # Components with many dependencies are more fragile
            fragility_multiplier = 1.0 + (dependency_count * 0.05)

            impact_scores[component_name] = base_score * dependency_multiplier * fragility_multiplier

        return impact_scores

    def generate_test_mapping(self) -> Dict[str, List[str]]:
        """Generate test case mapping for each component"""
        test_mapping = {}

        # Configured test patterns (domain-agnostic by default)
        test_patterns = self.test_patterns

        for component_name in self.components.keys():
            test_mapping[component_name] = test_patterns.get(component_name, [f'TC_{component_name.upper()}_BASIC'])

        return test_mapping

    def export_configuration(self, output_file: str = "regression-config.json"):
        """Export component configuration for use by impact analyzer"""
        impact_scores = self.calculate_impact_scores()
        test_mapping = self.generate_test_mapping()

        config = {
            "metadata": {
                "generated_at": subprocess.run(["date", "-Iseconds"], capture_output=True, text=True).stdout.strip(),
                "source_directory": str(self.source_dir),
                "components_found": len(self.components)
            },
            "components": [],
            "test_cases": []
        }

        # Export component configurations
        for component_name, component in self.components.items():
            config["components"].append({
                "component": component_name,
                "file_patterns": component.file_patterns,
                "dependencies": component.dependencies,
                "test_cases": test_mapping.get(component_name, []),
                "risk_weight": impact_scores.get(component_name, component.risk_weight)
            })

        # Generate test case definitions
        test_id_counter = 1
        for component_name, test_ids in test_mapping.items():
            for test_id in test_ids:
                config["test_cases"].append({
                    "id": test_id,
                    "name": test_id.replace('_', ' ').title(),
                    "component": component_name,
                    "tier": "critical",  # Default tier
                    "automated": True,   # Assume automated
                    "execution_time_min": 5  # Default time
                })

        with open(output_file, 'w') as f:
            json.dump(config, f, indent=2)

        return config

    def generate_dependency_report(self, output_file: str = "dependency-report.md"):
        """Generate human-readable dependency report"""
        impact_scores = self.calculate_impact_scores()

        report = f"""# Component Dependency Analysis

Generated: {subprocess.run(["date"], capture_output=True, text=True).stdout.strip()}
Source Directory: {self.source_dir}

## Component Overview

| Component | Dependencies | Dependents | Risk Weight | Impact Score |
|-----------|--------------|------------|-------------|--------------|
"""

        for component_name, component in sorted(self.components.items(),
                                               key=lambda x: impact_scores.get(x[0], 0),
                                               reverse=True):
            impact_score = impact_scores.get(component_name, 0)
            report += f"| {component_name} | {len(component.dependencies)} | {len(component.dependents)} | {component.risk_weight:.2f} | {impact_score:.2f} |\n"

        report += "\n## Dependency Graph\n\n"
        for component_name, component in self.components.items():
            report += f"### {component_name}\n"
            if component.dependencies:
                report += f"**Depends on:** {', '.join(component.dependencies)}\n"
            if component.dependents:
                report += f"**Used by:** {', '.join(component.dependents)}\n"
            report += "\n"

        with open(output_file, 'w') as f:
            f.write(report)

        return report

def _load_config_file(config_path: str) -> dict:
    """Load an optional override config (component_config / component_keywords /
    test_patterns) from a JSON file."""
    with open(config_path, 'r') as f:
        return json.load(f)

def main():
    parser = argparse.ArgumentParser(description="Component Dependency Mapper")
    parser.add_argument("source_dir", help="Source code directory to analyze")
    parser.add_argument("--config", default=None,
                       help="Optional JSON override config (component_config, "
                            "component_keywords, test_patterns). Defaults are "
                            "domain-agnostic; see the BIOMETRIC_EXAMPLE_* "
                            "constants / *.biometric-example.json for an example.")
    parser.add_argument("--output-config", default="regression-config.json",
                       help="Output configuration file")
    parser.add_argument("--output-report", default="dependency-report.md",
                       help="Output dependency report file")
    parser.add_argument("--verbose", "-v", action="store_true", help="Verbose output")

    args = parser.parse_args()

    if not os.path.exists(args.source_dir):
        print(f"Error: Source directory '{args.source_dir}' does not exist")
        return 1

    config = None
    if args.config:
        if not os.path.exists(args.config):
            print(f"Error: Config file '{args.config}' does not exist")
            return 1
        config = _load_config_file(args.config)

    mapper = DependencyMapper(args.source_dir, config=config)

    # Scan codebase and build dependency graph
    components = mapper.scan_codebase()

    if args.verbose:
        print(f"\nFound {len(components)} components:")
        for name in components.keys():
            print(f"  - {name}")

    # Generate outputs
    config = mapper.export_configuration(args.output_config)
    report = mapper.generate_dependency_report(args.output_report)

    print(f"\n✅ Configuration exported to: {args.output_config}")
    print(f"✅ Dependency report exported to: {args.output_report}")

    return 0

if __name__ == "__main__":
    exit(main())
