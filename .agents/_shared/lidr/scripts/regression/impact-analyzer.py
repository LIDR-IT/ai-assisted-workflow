#!/usr/bin/env python3
"""
{{CLIENT_NAME}} Regression Suite Impact Analyzer
Automatically analyzes code changes and selects relevant test cases based on impact radius.
"""

import json
import subprocess
import argparse
import sys
from pathlib import Path
from typing import Dict, List, Set, Tuple
from dataclasses import dataclass
from enum import Enum

class ImpactLevel(Enum):
    SMOKE = "smoke"
    CRITICAL = "critical"
    EXTENDED = "extended"

@dataclass
class TestCase:
    id: str
    name: str
    component: str
    tier: ImpactLevel
    automated: bool
    execution_time_min: int
    last_failure_date: str = None
    failure_count_3months: int = 0

@dataclass
class ComponentMapping:
    component: str
    file_patterns: List[str]
    dependencies: List[str]
    test_cases: List[str]
    risk_weight: float

class ImpactAnalyzer:
    def __init__(self, config_file: str = "regression-config.json"):
        self.config_file = Path(config_file)
        self.components = {}
        self.test_cases = {}
        self.load_configuration()

    def load_configuration(self):
        """Load component mappings and test case definitions"""
        if not self.config_file.exists():
            self.create_default_config()

        with open(self.config_file) as f:
            config = json.load(f)

        # Load component mappings
        for comp_data in config['components']:
            comp = ComponentMapping(**comp_data)
            self.components[comp.component] = comp

        # Load test cases
        for tc_data in config['test_cases']:
            tc = TestCase(**tc_data)
            self.test_cases[tc.id] = tc

    def create_default_config(self):
        """Create default configuration for {{CLIENT_NAME}} components"""
        default_config = {
            "components": [
                {
                    "component": "facial_recognition",
                    "file_patterns": ["src/face_*", "src/algorithms/facial/*", "src/ml/face_detection/*"],
                    "dependencies": ["core_domain-specifics", "ml_pipeline"],
                    "test_cases": ["TC_FACE_001", "TC_FACE_002", "TC_FACE_010", "TC_LIVENESS_001"],
                    "risk_weight": 0.9
                },
                {
                    "component": "document_ocr",
                    "file_patterns": ["src/ocr/*", "src/document_processing/*", "src/tesseract_wrapper/*"],
                    "dependencies": ["image_preprocessing", "validation_engine"],
                    "test_cases": ["TC_OCR_001", "TC_OCR_005", "TC_DOC_VALIDATION_001"],
                    "risk_weight": 0.8
                },
                {
                    "component": "voice_verification",
                    "file_patterns": ["src/voice/*", "src/audio_processing/*", "src/voice_ml/*"],
                    "dependencies": ["audio_utils", "core_domain-specifics"],
                    "test_cases": ["TC_VOICE_001", "TC_VOICE_003", "TC_VOICE_ENROLLMENT"],
                    "risk_weight": 0.85
                },
                {
                    "component": "api_gateway",
                    "file_patterns": ["src/api/*", "src/gateway/*", "src/auth/*", "src/middleware/*"],
                    "dependencies": ["authentication", "rate_limiting"],
                    "test_cases": ["TC_API_001", "TC_AUTH_001", "TC_RATE_LIMIT_001"],
                    "risk_weight": 0.7
                },
                {
                    "component": "core_domain-specifics",
                    "file_patterns": ["src/core/*", "src/domain-specific_engine/*", "src/template_management/*"],
                    "dependencies": [],
                    "test_cases": ["TC_CORE_001", "TC_TEMPLATE_001", "TC_ENCRYPTION_001"],
                    "risk_weight": 1.0
                }
            ],
            "test_cases": [
                {"id": "TC_SMOKE_LOGIN", "name": "Basic login flow", "component": "api_gateway", "tier": "smoke", "automated": True, "execution_time_min": 2},
                {"id": "TC_FACE_001", "name": "Facial recognition accuracy", "component": "facial_recognition", "tier": "critical", "automated": True, "execution_time_min": 8},
                {"id": "TC_FACE_002", "name": "Liveness detection", "component": "facial_recognition", "tier": "critical", "automated": True, "execution_time_min": 12},
                {"id": "TC_OCR_001", "name": "DNI Spanish extraction", "component": "document_ocr", "tier": "critical", "automated": True, "execution_time_min": 6},
                {"id": "TC_VOICE_001", "name": "Voice enrollment flow", "component": "voice_verification", "tier": "critical", "automated": True, "execution_time_min": 15},
                {"id": "TC_API_001", "name": "API authentication", "component": "api_gateway", "tier": "critical", "automated": True, "execution_time_min": 3},
                {"id": "TC_PERF_001", "name": "Performance baseline", "component": "core_domain-specifics", "tier": "extended", "automated": True, "execution_time_min": 45}
            ]
        }

        with open(self.config_file, 'w') as f:
            json.dump(default_config, f, indent=2)

        print(f"Created default configuration: {self.config_file}")

    def analyze_git_diff(self, base_branch: str = "develop") -> Set[str]:
        """Analyze git diff to identify changed files"""
        try:
            result = subprocess.run(
                ["git", "diff", "--name-only", f"{base_branch}...HEAD"],
                capture_output=True, text=True, check=True
            )
            changed_files = set(result.stdout.strip().split('\n'))
            return {f for f in changed_files if f}  # Filter empty strings
        except subprocess.CalledProcessError as e:
            print(f"Error running git diff: {e}")
            return set()

    def map_files_to_components(self, changed_files: Set[str]) -> Dict[str, float]:
        """Map changed files to affected components with impact scores"""
        component_impacts = {}

        for file in changed_files:
            for comp_name, component in self.components.items():
                for pattern in component.file_patterns:
                    if self._matches_pattern(file, pattern):
                        impact_score = component.risk_weight
                        if comp_name not in component_impacts:
                            component_impacts[comp_name] = 0
                        component_impacts[comp_name] = max(component_impacts[comp_name], impact_score)
                        break

        return component_impacts

    def _matches_pattern(self, file_path: str, pattern: str) -> bool:
        """Simple pattern matching for file paths"""
        if '*' in pattern:
            pattern_parts = pattern.split('*')
            if len(pattern_parts) == 2:
                return file_path.startswith(pattern_parts[0]) and file_path.endswith(pattern_parts[1])
        return file_path.startswith(pattern)

    def calculate_dependency_impact(self, directly_impacted: Dict[str, float]) -> Dict[str, float]:
        """Calculate indirect impact through component dependencies"""
        all_impacts = directly_impacted.copy()

        # Propagate impact through dependencies
        for comp_name, impact in directly_impacted.items():
            if comp_name in self.components:
                for dependent in self.components.values():
                    if comp_name in dependent.dependencies:
                        indirect_impact = impact * 0.5  # 50% of direct impact
                        if dependent.component not in all_impacts:
                            all_impacts[dependent.component] = 0
                        all_impacts[dependent.component] = max(
                            all_impacts[dependent.component],
                            indirect_impact
                        )

        return all_impacts

    def select_test_cases(self, component_impacts: Dict[str, float], time_budget_hours: int = 8) -> Dict[str, List[TestCase]]:
        """Select test cases based on component impacts and time budget"""
        selected_tests = {
            "smoke": [],
            "critical": [],
            "extended": []
        }

        # Always include all smoke tests
        for tc in self.test_cases.values():
            if tc.tier == ImpactLevel.SMOKE:
                selected_tests["smoke"].append(tc)

        # Score and sort critical tests by relevance
        critical_candidates = []
        for tc in self.test_cases.values():
            if tc.tier == ImpactLevel.CRITICAL:
                if tc.component in component_impacts:
                    score = component_impacts[tc.component]
                    # Boost score for recent failures
                    if tc.failure_count_3months > 0:
                        score *= (1 + tc.failure_count_3months * 0.1)
                    critical_candidates.append((score, tc))

        # Sort by score descending
        critical_candidates.sort(reverse=True, key=lambda x: x[0])

        # Select critical tests within time budget
        total_time = sum(tc.execution_time_min for tc in selected_tests["smoke"])
        time_budget_min = time_budget_hours * 60

        for score, tc in critical_candidates:
            if total_time + tc.execution_time_min <= time_budget_min * 0.8:  # Reserve 20% for buffer
                selected_tests["critical"].append(tc)
                total_time += tc.execution_time_min

        # Fill remaining time with extended tests if available
        extended_candidates = [tc for tc in self.test_cases.values() if tc.tier == ImpactLevel.EXTENDED]
        for tc in extended_candidates:
            if total_time + tc.execution_time_min <= time_budget_min:
                selected_tests["extended"].append(tc)
                total_time += tc.execution_time_min

        return selected_tests

    def generate_execution_plan(self, selected_tests: Dict[str, List[TestCase]], output_file: str = "regression-plan.json"):
        """Generate detailed execution plan"""
        execution_plan = {
            "metadata": {
                "generated_at": subprocess.run(["date", "-Iseconds"], capture_output=True, text=True).stdout.strip(),
                "analyzer_version": "1.0.0",
                "git_commit": subprocess.run(["git", "rev-parse", "HEAD"], capture_output=True, text=True).stdout.strip()
            },
            "summary": {
                "total_tests": sum(len(tests) for tests in selected_tests.values()),
                "estimated_time_minutes": sum(tc.execution_time_min for tests in selected_tests.values() for tc in tests),
                "automation_rate": self._calculate_automation_rate(selected_tests)
            },
            "execution_tiers": {}
        }

        for tier, tests in selected_tests.items():
            execution_plan["execution_tiers"][tier] = {
                "test_count": len(tests),
                "estimated_time_min": sum(tc.execution_time_min for tc in tests),
                "tests": [
                    {
                        "id": tc.id,
                        "name": tc.name,
                        "component": tc.component,
                        "automated": tc.automated,
                        "execution_time_min": tc.execution_time_min
                    }
                    for tc in tests
                ]
            }

        with open(output_file, 'w') as f:
            json.dump(execution_plan, f, indent=2)

        return execution_plan

    def _calculate_automation_rate(self, selected_tests: Dict[str, List[TestCase]]) -> float:
        """Calculate percentage of automated tests"""
        total_tests = sum(len(tests) for tests in selected_tests.values())
        if total_tests == 0:
            return 0.0

        automated_tests = sum(
            len([tc for tc in tests if tc.automated])
            for tests in selected_tests.values()
        )
        return (automated_tests / total_tests) * 100

    def print_summary(self, component_impacts: Dict[str, float], selected_tests: Dict[str, List[TestCase]]):
        """Print human-readable summary"""
        print("\n" + "="*60)
        print("REGRESSION SUITE IMPACT ANALYSIS")
        print("="*60)

        print("\nImpacted Components:")
        for component, impact in sorted(component_impacts.items(), key=lambda x: x[1], reverse=True):
            impact_level = "🔴 HIGH" if impact > 0.7 else "🟡 MEDIUM" if impact > 0.4 else "🟢 LOW"
            print(f"  {impact_level} {component}: {impact:.2f}")

        print(f"\nSelected Test Cases:")
        total_time = 0
        for tier, tests in selected_tests.items():
            tier_time = sum(tc.execution_time_min for tc in tests)
            total_time += tier_time
            automated_count = len([tc for tc in tests if tc.automated])
            print(f"  {tier.upper()}: {len(tests)} tests, {tier_time}min, {automated_count} automated")

        print(f"\nTotal Execution Time: {total_time} minutes ({total_time/60:.1f} hours)")
        automation_rate = self._calculate_automation_rate(selected_tests)
        print(f"Automation Rate: {automation_rate:.1f}%")

def main():
    parser = argparse.ArgumentParser(description="{{CLIENT_NAME}} Regression Suite Impact Analyzer")
    parser.add_argument("--base-branch", default="develop", help="Base branch for git diff")
    parser.add_argument("--time-budget", type=int, default=8, help="Time budget in hours")
    parser.add_argument("--output", default="regression-plan.json", help="Output file for execution plan")
    parser.add_argument("--config", default="regression-config.json", help="Configuration file")
    parser.add_argument("--verbose", "-v", action="store_true", help="Verbose output")

    args = parser.parse_args()

    analyzer = ImpactAnalyzer(args.config)

    # Analyze changes
    changed_files = analyzer.analyze_git_diff(args.base_branch)
    if not changed_files:
        print("No changes detected. Exiting.")
        sys.exit(0)

    if args.verbose:
        print(f"Changed files: {', '.join(changed_files)}")

    # Calculate impacts
    direct_impacts = analyzer.map_files_to_components(changed_files)
    all_impacts = analyzer.calculate_dependency_impact(direct_impacts)

    # Select test cases
    selected_tests = analyzer.select_test_cases(all_impacts, args.time_budget)

    # Generate outputs
    execution_plan = analyzer.generate_execution_plan(selected_tests, args.output)
    analyzer.print_summary(all_impacts, selected_tests)

    print(f"\n✅ Execution plan saved to: {args.output}")

if __name__ == "__main__":
    main()