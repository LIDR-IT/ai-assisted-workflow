#!/usr/bin/env python3
"""
Test Strategy Generator for Test Plan Automation
===============================================

Part of the SDLC Automation Suite
Transforms risk analysis into comprehensive test plan documentation

This script generates test plan documents from risk analysis results:
1. Loads risk analysis from risk-analyzer.py output
2. Applies domain test templates
3. Generates comprehensive test plan with entry/exit criteria
4. Exports structured test plan + CSV for tracking-tool integration

The in-code defaults are DOMAIN-AGNOSTIC. To specialize the generator for a
particular vertical (e.g. biometric identity verification), override the
class attributes of ``DomainTestTemplates`` with your own values. A worked
biometric override is bundled below as the clearly-labelled
``BIOMETRIC_EXAMPLE_*`` constants and is NOT the active default. A standalone
sibling override file is also provided at
``test-strategy-generator.biometric-example.json`` for data-driven loading.

Usage:
    python test-strategy-generator.py [--input-dir path] [--output-dir path]

Dependencies:
    - risk analysis results from risk-analyzer.py
    - test plan templates
    - domain test patterns
"""

import os
import sys
import json
import logging
import argparse
from pathlib import Path
from dataclasses import dataclass, asdict
from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta
import csv

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(levelname)s: %(message)s')
logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Optional domain marker
# ---------------------------------------------------------------------------
# When a project's risk analysis declares a specialized domain, set this
# constant (or the risk-analysis "domain" field) to that value and override
# the relevant DomainTestTemplates attributes. By default the generator stays
# fully domain-agnostic and this marker is unset.
SPECIALIZED_DOMAIN: Optional[str] = None


@dataclass
class TestPhase:
    """Test phase definition"""
    phase: str
    description: str
    entry_criteria: List[str]
    exit_criteria: List[str]
    test_types: List[str]
    coverage_target: int
    estimated_effort_hours: int
    dependencies: List[str]

@dataclass
class TestEnvironment:
    """Test environment specification"""
    name: str
    purpose: str
    data_characteristics: str
    access_requirements: List[str]
    special_configurations: List[str]

@dataclass
class TestDeliverable:
    """Test deliverable specification"""
    deliverable: str
    description: str
    owner: str
    template: str
    due_phase: str

@dataclass
class TestPlan:
    """Complete test plan structure"""
    project_name: str
    overall_strategy: str
    risk_level: str
    test_phases: List[TestPhase]
    test_environments: List[TestEnvironment]
    test_deliverables: List[TestDeliverable]
    automation_strategy: str
    resource_requirements: Dict[str, Any]
    timeline_estimate: Dict[str, int]
    special_considerations: List[str]

class DomainTestTemplates:
    """Domain-agnostic test templates for any software system.

    The class attributes below describe a neutral, reusable test strategy that
    works for any application type. To specialize for a particular vertical,
    subclass this template (or assign to its attributes) and supply your own
    phases, environments, and regulatory mappings. See the ``BIOMETRIC_EXAMPLE_*``
    constants in this module for a complete worked override.
    """

    domain_test_phases = {
        'unit_testing': {
            'description': 'Component-level function and module testing',
            'test_types': ['Function Unit Tests', 'Module Unit Tests', 'Validation Unit Tests'],
            'coverage_target': 90,
            'domain_specifics': ['Input format validation', 'Configuration handling', 'Core logic correctness']
        },
        'integration_testing': {
            'description': 'Cross-component and API integration testing',
            'test_types': ['API Integration Tests', 'Service Integration Tests', 'Database Integration Tests'],
            'coverage_target': 80,
            'domain_specifics': ['Data storage/retrieval', 'Processing pipeline', 'Multi-service integration']
        },
        'security_testing': {
            'description': 'Security-focused testing for data protection',
            'test_types': ['Penetration Testing', 'Vulnerability Scanning', 'Data Protection Testing'],
            'coverage_target': 100,
            'domain_specifics': ['Data encryption validation', 'Access-control verification', 'Privacy compliance testing']
        },
        'performance_testing': {
            'description': 'Performance and reliability testing under various conditions',
            'test_types': ['Load Testing', 'Stress Testing', 'Reliability Testing'],
            'coverage_target': 95,
            'domain_specifics': ['Throughput benchmarks', 'Response-time measurement', 'Concurrent user testing']
        },
        'user_acceptance_testing': {
            'description': 'End-user validation of core workflows',
            'test_types': ['Functional UAT', 'Usability Testing', 'Accessibility Testing'],
            'coverage_target': 90,
            'domain_specifics': ['Primary flow validation', 'User experience testing', 'Cross-device testing']
        }
    }

    domain_environments = {
        'synthetic_data_env': {
            'purpose': 'Development and basic testing with synthetic data',
            'data_characteristics': 'Generated synthetic records and test data',
            'configurations': ['Synthetic data generators', 'Mock external services', 'Test database']
        },
        'anonymized_data_env': {
            'purpose': 'Integration testing with anonymized production-like data',
            'data_characteristics': 'Production data with anonymized PII and synthetic records',
            'configurations': ['Data anonymization pipeline', 'Production-like volumes', 'Realistic scenario testing']
        },
        'security_testing_env': {
            'purpose': 'Isolated security testing and penetration testing',
            'data_characteristics': 'Minimal test data with focus on attack scenarios',
            'configurations': ['Isolated network', 'Security scanning tools', 'Attack simulation capabilities']
        },
        'performance_testing_env': {
            'purpose': 'Load and stress testing with realistic volumes',
            'data_characteristics': 'High-volume synthetic data for performance testing',
            'configurations': ['Load generation tools', 'Performance monitoring', 'Scalable infrastructure']
        }
    }

    REGULATORY_TEST_REQUIREMENTS: Dict[str, Dict[str, Any]] = {
        'GDPR': {
            'test_areas': ['Consent management', 'Data portability', 'Right to be forgotten', 'Data minimization'],
            'specific_tests': [
                'Consent withdrawal verification',
                'Personal data export functionality',
                'Data deletion confirmation',
                'Purpose limitation validation'
            ]
        }
    }

# ---------------------------------------------------------------------------
# OVERRIDABLE EXAMPLE — Biometric Identity Verification specialization
# ---------------------------------------------------------------------------
# The constants below are a worked, domain-SPECIFIC override and are NOT used
# by default. To activate them, subclass DomainTestTemplates (or assign these
# onto an instance) and set SPECIALIZED_DOMAIN = "Biometric Identity
# Verification". They are kept here purely as a reference example; the same
# values are mirrored in the sibling JSON override file.

BIOMETRIC_EXAMPLE_DOMAIN = "Biometric Identity Verification"

BIOMETRIC_EXAMPLE_TEST_PHASES = {
    'unit_testing': {
        'description': 'Component-level algorithm and function testing',
        'test_types': ['Algorithm Unit Tests', 'Template Generation Tests', 'Encryption Unit Tests'],
        'coverage_target': 90,
        'domain_specifics': ['Template format validation', 'Encryption key management', 'Algorithm accuracy benchmarks']
    },
    'integration_testing': {
        'description': 'Cross-component and API integration testing',
        'test_types': ['API Integration Tests', 'Service Integration Tests', 'Database Integration Tests'],
        'coverage_target': 80,
        'domain_specifics': ['Template storage/retrieval', 'Liveness detection pipeline', 'Multi-modal integration']
    },
    'security_testing': {
        'description': 'Security-focused testing for biometric data protection',
        'test_types': ['Penetration Testing', 'Vulnerability Scanning', 'Data Protection Testing'],
        'coverage_target': 100,
        'domain_specifics': ['Template encryption validation', 'Anti-spoofing verification', 'GDPR compliance testing']
    },
    'performance_testing': {
        'description': 'Performance and accuracy testing under various conditions',
        'test_types': ['Load Testing', 'Stress Testing', 'Accuracy Testing'],
        'coverage_target': 95,
        'domain_specifics': ['Algorithm performance benchmarks', 'Template matching speed', 'Concurrent user testing']
    },
    'user_acceptance_testing': {
        'description': 'End-user validation of biometric workflows',
        'test_types': ['Functional UAT', 'Usability Testing', 'Accessibility Testing'],
        'coverage_target': 90,
        'domain_specifics': ['Enrollment flow validation', 'Authentication UX testing', 'Edge device testing']
    }
}

BIOMETRIC_EXAMPLE_ENVIRONMENTS = {
    'synthetic_data_env': {
        'purpose': 'Development and basic testing with synthetic biometric data',
        'data_characteristics': 'Generated biometric templates and synthetic identity data',
        'configurations': ['Synthetic template generators', 'Mock liveness detection', 'Test identity database']
    },
    'anonymized_data_env': {
        'purpose': 'Integration testing with anonymized production-like data',
        'data_characteristics': 'Production data with anonymized PII and synthetic biometric templates',
        'configurations': ['Data anonymization pipeline', 'Production-like volumes', 'Realistic accuracy testing']
    },
    'security_testing_env': {
        'purpose': 'Isolated security testing and penetration testing',
        'data_characteristics': 'Minimal test data with focus on attack scenarios',
        'configurations': ['Isolated network', 'Security scanning tools', 'Attack simulation capabilities']
    },
    'performance_testing_env': {
        'purpose': 'Load and stress testing with realistic volumes',
        'data_characteristics': 'High-volume synthetic templates for performance testing',
        'configurations': ['Load generation tools', 'Performance monitoring', 'Scalable infrastructure']
    }
}

BIOMETRIC_EXAMPLE_REGULATORY_TEST_REQUIREMENTS = {
    'GDPR': {
        'test_areas': ['Consent management', 'Data portability', 'Right to be forgotten', 'Data minimization'],
        'specific_tests': [
            'Consent withdrawal verification',
            'Biometric data export functionality',
            'Template deletion confirmation',
            'Purpose limitation validation'
        ]
    },
    'eIDAS': {
        'test_areas': ['Digital identity interoperability', 'Security levels', 'Cross-border recognition'],
        'specific_tests': [
            'Level of Assurance (LoA) validation',
            'Cross-border identity verification',
            'Digital signature integration',
            'eID scheme compatibility'
        ]
    },
    'PSD2': {
        'test_areas': ['Strong Customer Authentication', 'Dynamic linking', 'Transaction security'],
        'specific_tests': [
            'Multi-factor authentication flows',
            'Transaction binding verification',
            'Inherence factor validation',
            'SCA exemption handling'
        ]
    },
    'ISO_30107': {
        'test_areas': ['Presentation Attack Detection', 'Biometric system evaluation'],
        'specific_tests': [
            'Photo attack detection',
            'Video attack detection',
            'Mask attack detection',
            'PAD performance metrics'
        ]
    }
}

class TestStrategyGenerator:
    """Main generator for test strategy and plans"""

    def __init__(self, input_dir: str = "test-analysis", output_dir: str = "test-plan"):
        self.input_dir = Path(input_dir)
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(exist_ok=True)

        self.templates = DomainTestTemplates()
        self.risk_analysis: Optional[Dict] = None

    def load_risk_analysis(self) -> Dict:
        """Load risk analysis from previous step"""
        logger.info("Loading risk analysis...")

        analysis_file = self.input_dir / "test-risk-analysis.json"
        if not analysis_file.exists():
            raise FileNotFoundError(f"Risk analysis not found: {analysis_file}")

        with open(analysis_file) as f:
            analysis = json.load(f)

        logger.info(f"Loaded analysis for project: {analysis['project_context']['name']}")
        return analysis

    def generate_test_phases(self) -> List[TestPhase]:
        """Generate test phases based on risk analysis"""
        logger.info("Generating test phases...")

        phases = []
        project_context = self.risk_analysis['project_context']
        test_strategy = self.risk_analysis['test_strategy']
        risks = self.risk_analysis['risk_analysis']

        # Base phases for all projects
        base_phases = ['unit_testing', 'integration_testing', 'security_testing', 'performance_testing']

        # Add UAT for customer-facing applications
        if project_context['type'] in ['Web Application', 'Mobile Application']:
            base_phases.append('user_acceptance_testing')

        for phase_key in base_phases:
            template = self.templates.domain_test_phases[phase_key]

            # Customize entry criteria based on project
            entry_criteria = self._generate_entry_criteria(phase_key, project_context, risks)

            # Customize exit criteria based on strategy
            exit_criteria = self._generate_exit_criteria(phase_key, test_strategy, risks)

            # Estimate effort based on complexity and risk
            effort = self._estimate_phase_effort(phase_key, project_context, test_strategy, risks)

            # Determine dependencies
            dependencies = self._determine_phase_dependencies(phase_key, base_phases)

            phases.append(TestPhase(
                phase=phase_key.replace('_', ' ').title(),
                description=template['description'],
                entry_criteria=entry_criteria,
                exit_criteria=exit_criteria,
                test_types=template['test_types'] + template['domain_specifics'],
                coverage_target=self._adjust_coverage_target(phase_key, template['coverage_target'], test_strategy),
                estimated_effort_hours=effort,
                dependencies=dependencies
            ))

        return phases

    def _is_specialized_domain(self, context: Dict) -> bool:
        """Return True when the project declares a specialized (non-generic) domain.

        A domain is considered specialized when the risk-analysis "domain" field
        is set to a non-empty, non-generic value. This keeps the default behavior
        domain-agnostic while still allowing domain-specific augmentation when a
        caller supplies a specialized domain (e.g. via SPECIALIZED_DOMAIN).
        """
        domain = (context.get('domain') or '').strip()
        if not domain:
            return False
        generic_markers = {'', 'general', 'generic', 'domain-agnostic', 'n/a', 'none'}
        if domain.lower() in generic_markers:
            return False
        return True

    def _generate_entry_criteria(self, phase: str, context: Dict, risks: List[Dict]) -> List[str]:
        """Generate entry criteria for a test phase"""
        criteria = []
        specialized = self._is_specialized_domain(context)

        if phase == 'unit_testing':
            criteria = [
                'Code development completed for sprint/increment',
                'Unit test framework configured',
                'Test data preparation completed'
            ]
            if specialized:
                criteria.append('Core component implementation completed')
                criteria.append('Data format specifications finalized')

        elif phase == 'integration_testing':
            criteria = [
                'Unit testing completed with >85% pass rate',
                'Integration test environment available',
                'API specifications finalized'
            ]
            if specialized:
                criteria.append('Pipeline components deployed')
                criteria.append('Test database populated')

        elif phase == 'security_testing':
            criteria = [
                'Security test environment configured',
                'Security requirements documented',
                'Penetration testing tools configured'
            ]
            if any(risk['category'] == 'Security' for risk in risks):
                criteria.append('High-risk security areas identified and prioritized')

        elif phase == 'performance_testing':
            criteria = [
                'Performance test environment available',
                'Performance benchmarks defined',
                'Load testing tools configured'
            ]
            if specialized:
                criteria.append('Performance baselines established')
                criteria.append('Database scaled for volume testing')

        elif phase == 'user_acceptance_testing':
            criteria = [
                'System testing completed',
                'UAT environment prepared with production-like data',
                'User acceptance criteria documented'
            ]
            if specialized:
                criteria.append('End-to-end core workflows validated')

        return criteria

    def _generate_exit_criteria(self, phase: str, strategy: Dict, risks: List[Dict]) -> List[str]:
        """Generate exit criteria for a test phase"""
        criteria = []

        coverage_targets = strategy['coverage_targets']
        risk_level = strategy['overall_risk_level']

        if phase == 'unit_testing':
            target = coverage_targets.get('unit', 80)
            criteria = [
                f'Unit test coverage ≥ {target}%',
                'All critical unit tests passing',
                '0 blocker defects in unit testing'
            ]

        elif phase == 'integration_testing':
            target = coverage_targets.get('integration', 65)
            criteria = [
                f'Integration test coverage ≥ {target}%',
                'All critical integration scenarios validated',
                'API contract testing completed'
            ]

        elif phase == 'security_testing':
            criteria = [
                '0 Critical and High severity vulnerabilities',
                'Security checklist 100% completed',
                'Penetration testing report approved'
            ]
            if any(risk['category'] == 'Security' and risk['risk_score'] > 0.5 for risk in risks):
                criteria.append('High-risk security scenarios specifically validated')

        elif phase == 'performance_testing':
            criteria = [
                'Performance benchmarks met or exceptions documented',
                'Load testing completed at target volumes',
                'Performance regression tests passing'
            ]

        elif phase == 'user_acceptance_testing':
            target = coverage_targets.get('e2e', 30)
            criteria = [
                f'End-to-end test coverage ≥ {target}%',
                'User acceptance criteria met',
                'Accessibility requirements validated'
            ]

        # Add risk-level specific criteria
        if risk_level in ['HIGH', 'CRITICAL']:
            criteria.append('Risk mitigation testing completed for all high-risk factors')

        return criteria

    def _estimate_phase_effort(self, phase: str, context: Dict, strategy: Dict, risks: List[Dict]) -> int:
        """Estimate effort hours for a test phase"""
        base_effort = {
            'unit_testing': 40,
            'integration_testing': 60,
            'security_testing': 30,
            'performance_testing': 25,
            'user_acceptance_testing': 35
        }

        effort = base_effort.get(phase, 30)

        # Adjust for complexity
        complexity_multiplier = 1.0 + context['complexity_score']
        effort = int(effort * complexity_multiplier)

        # Adjust for team size (larger teams need more coordination)
        if context['team_size'] > 8:
            effort = int(effort * 1.2)

        # Adjust for risk level
        if strategy['overall_risk_level'] == 'CRITICAL':
            effort = int(effort * 1.5)
        elif strategy['overall_risk_level'] == 'HIGH':
            effort = int(effort * 1.3)

        # Adjust for specialized-domain complexity
        if self._is_specialized_domain(context):
            if phase in ['security_testing', 'performance_testing']:
                effort = int(effort * 1.4)  # specialized-domain testing is more complex

        return effort

    def _adjust_coverage_target(self, phase: str, base_target: int, strategy: Dict) -> int:
        """Adjust coverage target based on risk strategy"""
        if strategy['overall_risk_level'] == 'CRITICAL':
            return min(base_target + 10, 100)
        elif strategy['overall_risk_level'] == 'HIGH':
            return min(base_target + 5, 100)
        else:
            return base_target

    def _determine_phase_dependencies(self, phase: str, all_phases: List[str]) -> List[str]:
        """Determine dependencies between test phases"""
        dependencies = []

        if phase == 'integration_testing':
            dependencies.append('Unit Testing')
        elif phase == 'security_testing':
            dependencies.extend(['Unit Testing', 'Integration Testing'])
        elif phase == 'performance_testing':
            dependencies.append('Integration Testing')
        elif phase == 'user_acceptance_testing':
            dependencies.extend(['Security Testing', 'Performance Testing'])

        return dependencies

    def generate_test_environments(self) -> List[TestEnvironment]:
        """Generate test environment specifications"""
        logger.info("Generating test environments...")

        environments = []
        project_context = self.risk_analysis['project_context']
        test_strategy = self.risk_analysis['test_strategy']

        # Always include basic environments
        base_environments = ['synthetic_data_env']

        # Add environments based on data sensitivity
        if project_context['data_sensitivity'] in ['HIGH', 'CRITICAL']:
            base_environments.append('anonymized_data_env')

        # Add security testing environment for high-risk projects
        if test_strategy['overall_risk_level'] in ['HIGH', 'CRITICAL']:
            base_environments.append('security_testing_env')

        # Add performance environment for complex projects
        if project_context['complexity_score'] > 0.6:
            base_environments.append('performance_testing_env')

        for env_key in base_environments:
            template = self.templates.domain_environments[env_key]

            # Customize access requirements
            access_requirements = self._generate_access_requirements(env_key, project_context)

            environments.append(TestEnvironment(
                name=env_key.replace('_', ' ').title(),
                purpose=template['purpose'],
                data_characteristics=template['data_characteristics'],
                access_requirements=access_requirements,
                special_configurations=template['configurations']
            ))

        return environments

    def _generate_access_requirements(self, env_key: str, context: Dict) -> List[str]:
        """Generate access requirements for test environment"""
        base_requirements = [
            'VPN access to test network',
            'Valid test account credentials',
            'Required role-based permissions'
        ]

        if env_key == 'security_testing_env':
            base_requirements.extend([
                'Security testing certification',
                'Isolated network access approval',
                'Penetration testing authorization'
            ])

        if context['data_sensitivity'] == 'CRITICAL':
            base_requirements.extend([
                'Data handling security training',
                'Signed confidentiality agreement',
                'Background check clearance'
            ])

        return base_requirements

    def generate_test_deliverables(self) -> List[TestDeliverable]:
        """Generate test deliverable specifications"""
        logger.info("Generating test deliverables...")

        deliverables = [
            TestDeliverable(
                deliverable="Test Plan Document",
                description="Comprehensive test planning document with strategy, approach, and schedules",
                owner="QA Lead",
                template="docs/templates/test-plan.md",
                due_phase="Planning"
            ),
            TestDeliverable(
                deliverable="Test Cases",
                description="Detailed test cases with BDD scenarios and expected results",
                owner="QA Engineers",
                template="BDD format in test management tool",
                due_phase="Test Design"
            ),
            TestDeliverable(
                deliverable="Test Data Management Plan",
                description="Strategy for test data creation, management, and cleanup",
                owner="QA Lead + DevOps",
                template="docs/templates/test-data-plan.md",
                due_phase="Environment Setup"
            ),
            TestDeliverable(
                deliverable="Test Execution Reports",
                description="Results of test execution with pass/fail status and defect summary",
                owner="QA Engineers",
                template="docs/templates/test-execution-report.md",
                due_phase="Test Execution"
            ),
            TestDeliverable(
                deliverable="Test Summary Report",
                description="Final test results with overall quality assessment and recommendations",
                owner="QA Lead",
                template="docs/templates/test-summary-report.md",
                due_phase="Test Closure"
            )
        ]

        # Add specialized-domain deliverables
        project_context = self.risk_analysis['project_context']
        if self._is_specialized_domain(project_context):
            deliverables.extend([
                TestDeliverable(
                    deliverable="Performance Benchmark Report",
                    description="Domain performance and reliability benchmark results",
                    owner="R&D + QA",
                    template="docs/templates/performance-benchmark-report.md",
                    due_phase="Performance Testing"
                ),
                TestDeliverable(
                    deliverable="Security Compliance Report",
                    description="Security and regulatory compliance validation results",
                    owner="Security + QA",
                    template="docs/templates/security-compliance-report.md",
                    due_phase="Security Testing"
                )
            ])

        return deliverables

    def generate_automation_strategy(self) -> str:
        """Generate automation strategy description"""
        project_context = self.risk_analysis['project_context']
        test_strategy = self.risk_analysis['test_strategy']

        automation_ratio = test_strategy['automation_ratio']
        tech_stack = project_context['tech_stack']

        strategy = f"""
**Automation Target**: {automation_ratio}% of total test cases

**Automation Approach**:
- **Unit Tests**: 95% automated using Jest/PyTest
- **API Tests**: 90% automated using REST client libraries
- **UI Tests**: {max(50, automation_ratio-20)}% automated using Playwright/Cypress
- **Security Tests**: 70% automated using SAST/DAST tools
- **Performance Tests**: 85% automated using load testing frameworks

**Technology Stack**:
{chr(10).join(f"- {tech}" for tech in tech_stack)}

**Automation Priorities**:
1. Critical business workflows (highest ROI)
2. Regression test scenarios (stability)
3. Data validation and transformation (accuracy)
4. Performance and load scenarios (scalability)

**Manual Testing Focus**:
- Exploratory testing for edge cases
- Usability and accessibility validation
- Complex business logic verification
- User acceptance scenarios
        """.strip()

        if self._is_specialized_domain(project_context):
            strategy += """

**Domain-Specific Automation**:
- Core artifact generation and validation automation
- End-to-end accuracy testing
- Performance benchmarking across configuration variations
- Compliance validation for regulatory requirements
            """.strip()

        return strategy

    def generate_resource_requirements(self) -> Dict[str, Any]:
        """Generate resource requirements"""
        project_context = self.risk_analysis['project_context']
        test_strategy = self.risk_analysis['test_strategy']
        phases = self.generate_test_phases()

        total_effort = sum(phase.estimated_effort_hours for phase in phases)

        # Apply timeline multiplier from risk analysis
        adjusted_effort = int(total_effort * test_strategy['timeline_multiplier'])

        return {
            "team_composition": {
                "QA Lead": 1,
                "QA Engineers": max(2, min(4, project_context['team_size'] // 3)),
                "Automation Engineers": 1 if test_strategy['automation_ratio'] > 60 else 0,
                "Performance Testing Specialist": 1 if project_context['complexity_score'] > 0.7 else 0
            },
            "effort_estimation": {
                "total_hours": adjusted_effort,
                "duration_weeks": max(4, adjusted_effort // 40),  # 40 hours per week
                "risk_buffer_percentage": 20 if test_strategy['overall_risk_level'] in ['HIGH', 'CRITICAL'] else 15
            },
            "infrastructure_needs": [
                "Test environments as specified",
                "Test data management system",
                "Automated testing framework setup",
                "Reporting and dashboard tools"
            ],
            "training_requirements": self._generate_training_requirements(project_context)
        }

    def _generate_training_requirements(self, context: Dict) -> List[str]:
        """Generate training requirements based on project context"""
        training = ["QA process and methodology training"]

        if self._is_specialized_domain(context):
            training.extend([
                "Domain system testing fundamentals",
                "Privacy and data-protection testing requirements",
                "Security testing for domain applications"
            ])

        if context['data_sensitivity'] == 'CRITICAL':
            training.append("Sensitive data handling and security protocols")

        if len(context['regulatory_requirements']) > 0:
            training.append(f"Regulatory compliance testing ({', '.join(context['regulatory_requirements'])})")

        return training

    def generate_special_considerations(self) -> List[str]:
        """Generate special considerations based on risks"""
        considerations = []
        project_context = self.risk_analysis['project_context']
        risks = self.risk_analysis['risk_analysis']
        test_strategy = self.risk_analysis['test_strategy']

        # High-risk considerations
        high_risk_factors = [r for r in risks if r['risk_score'] > 0.5]
        if high_risk_factors:
            considerations.append(f"Special attention required for {len(high_risk_factors)} high-risk factors identified in risk analysis")

        # Domain-specific considerations
        if self._is_specialized_domain(project_context):
            considerations.extend([
                "Sensitive data must be handled according to applicable data-protection requirements",
                "Performance testing requires statistical significance validation",
                "Resilience testing needs diverse adverse-condition scenarios",
                "Data-protection testing must validate irreversibility where applicable"
            ])

        # Regulatory considerations
        for regulation in project_context['regulatory_requirements']:
            if regulation in self.templates.REGULATORY_TEST_REQUIREMENTS:
                reg_reqs = self.templates.REGULATORY_TEST_REQUIREMENTS[regulation]
                considerations.append(f"{regulation} compliance requires testing: {', '.join(reg_reqs['test_areas'])}")

        # Technical considerations
        if project_context['complexity_score'] > 0.7:
            considerations.append("High complexity project requires additional integration testing and monitoring")

        if test_strategy['overall_risk_level'] == 'CRITICAL':
            considerations.append("Critical risk level requires executive oversight and frequent risk assessment reviews")

        return considerations

    def generate_complete_test_plan(self) -> TestPlan:
        """Generate complete test plan structure"""
        logger.info("Generating complete test plan...")

        project_context = self.risk_analysis['project_context']
        test_strategy = self.risk_analysis['test_strategy']

        phases = self.generate_test_phases()
        environments = self.generate_test_environments()
        deliverables = self.generate_test_deliverables()
        automation_strategy = self.generate_automation_strategy()
        resources = self.generate_resource_requirements()
        considerations = self.generate_special_considerations()

        # Timeline estimation
        total_effort = sum(phase.estimated_effort_hours for phase in phases)
        timeline = {
            "planning_phase_days": 5,
            "test_design_days": 10,
            "test_execution_days": max(15, total_effort // 8),  # 8 hours per day
            "total_days": 30 + (total_effort // 8)
        }

        return TestPlan(
            project_name=project_context['name'],
            overall_strategy=test_strategy['recommended_approach'],
            risk_level=test_strategy['overall_risk_level'],
            test_phases=phases,
            test_environments=environments,
            test_deliverables=deliverables,
            automation_strategy=automation_strategy,
            resource_requirements=resources,
            timeline_estimate=timeline,
            special_considerations=considerations
        )

    def save_test_plan(self, test_plan: TestPlan) -> Dict[str, str]:
        """Save test plan to multiple formats"""
        logger.info("Saving test plan...")

        # Save JSON for machine processing
        json_file = self.output_dir / "test-plan.json"
        with open(json_file, 'w', encoding='utf-8') as f:
            json.dump(asdict(test_plan), f, indent=2, ensure_ascii=False)

        # Save markdown report
        markdown_file = self.output_dir / "test-plan-document.md"
        self._generate_markdown_test_plan(markdown_file, test_plan)

        # Save CSV for project management
        csv_file = self.output_dir / "test-plan-summary.csv"
        self._generate_csv_summary(csv_file, test_plan)

        logger.info(f"Test plan saved to {self.output_dir}")

        return {
            "json_file": str(json_file),
            "markdown_file": str(markdown_file),
            "csv_file": str(csv_file)
        }

    def _generate_markdown_test_plan(self, file_path: Path, test_plan: TestPlan):
        """Generate comprehensive markdown test plan document"""
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(f"""---
id: test-plan-{test_plan.project_name.lower().replace(' ', '-')}
version: "1.0.0"
last_updated: "{datetime.now().strftime('%Y-%m-%d')}"
updated_by: "System: Test Plan Generator"
status: active
phase: 6
owner_role: "QA Lead"
type: test-plan
review_cycle: 30
next_review: "{(datetime.now() + timedelta(days=30)).strftime('%Y-%m-%d')}"
---

# Test Plan: {test_plan.project_name}

## Executive Summary

- **Project**: {test_plan.project_name}
- **Overall Strategy**: {test_plan.overall_strategy}
- **Risk Level**: {test_plan.risk_level}
- **Total Estimated Effort**: {test_plan.resource_requirements['effort_estimation']['total_hours']} hours
- **Estimated Duration**: {test_plan.resource_requirements['effort_estimation']['duration_weeks']} weeks

## Test Strategy

{test_plan.overall_strategy}

### Risk-Based Approach

This test plan is designed based on a comprehensive risk analysis that identified {len([p for p in test_plan.test_phases if p.coverage_target > 80])} high-priority test areas requiring enhanced coverage.

## Test Phases

""")

            for phase in test_plan.test_phases:
                f.write(f"""
### {phase.phase}

**Description**: {phase.description}

**Coverage Target**: {phase.coverage_target}%
**Estimated Effort**: {phase.estimated_effort_hours} hours

#### Entry Criteria
{chr(10).join(f"- {criteria}" for criteria in phase.entry_criteria)}

#### Exit Criteria
{chr(10).join(f"- {criteria}" for criteria in phase.exit_criteria)}

#### Test Types
{chr(10).join(f"- {test_type}" for test_type in phase.test_types)}

#### Dependencies
{chr(10).join(f"- {dep}" for dep in phase.dependencies) if phase.dependencies else "- None"}

""")

            f.write(f"""## Test Environments

""")

            for env in test_plan.test_environments:
                f.write(f"""
### {env.name}

**Purpose**: {env.purpose}

**Data Characteristics**: {env.data_characteristics}

#### Access Requirements
{chr(10).join(f"- {req}" for req in env.access_requirements)}

#### Special Configurations
{chr(10).join(f"- {config}" for config in env.special_configurations)}

""")

            f.write(f"""## Automation Strategy

{test_plan.automation_strategy}

## Test Deliverables

| Deliverable | Owner | Template | Due Phase |
|-------------|--------|----------|-----------|
""")

            for deliverable in test_plan.test_deliverables:
                f.write(f"| {deliverable.deliverable} | {deliverable.owner} | {deliverable.template} | {deliverable.due_phase} |\n")

            f.write(f"""

## Resource Requirements

### Team Composition
""")
            for role, count in test_plan.resource_requirements['team_composition'].items():
                f.write(f"- **{role}**: {count}\n")

            f.write(f"""
### Effort Estimation
- **Total Hours**: {test_plan.resource_requirements['effort_estimation']['total_hours']}
- **Duration**: {test_plan.resource_requirements['effort_estimation']['duration_weeks']} weeks
- **Risk Buffer**: {test_plan.resource_requirements['effort_estimation']['risk_buffer_percentage']}%

### Infrastructure Needs
{chr(10).join(f"- {need}" for need in test_plan.resource_requirements['infrastructure_needs'])}

### Training Requirements
{chr(10).join(f"- {training}" for training in test_plan.resource_requirements['training_requirements'])}

## Timeline Estimate

- **Planning Phase**: {test_plan.timeline_estimate['planning_phase_days']} days
- **Test Design**: {test_plan.timeline_estimate['test_design_days']} days
- **Test Execution**: {test_plan.timeline_estimate['test_execution_days']} days
- **Total Duration**: {test_plan.timeline_estimate['total_days']} days

## Special Considerations

{chr(10).join(f"- {consideration}" for consideration in test_plan.special_considerations)}

## Risk Mitigation

This test plan addresses the following high-priority risks identified in the risk analysis:

1. **Security Risks**: Comprehensive security testing phase with dedicated environment
2. **Complexity Risks**: Phased approach with clear entry/exit criteria
3. **Regulatory Risks**: Specific compliance testing integrated into all phases

## Success Criteria

The test execution will be considered successful when:

- All test phases meet their exit criteria
- Risk mitigation testing validates all high-priority risk factors
- Test coverage targets are achieved across all test types
- All deliverables are completed and approved

## Approval

This test plan requires approval from:

- **QA Lead**: Test approach and resource allocation
- **Tech Lead**: Technical feasibility and integration approach
- **Product Owner**: Business acceptance criteria and timeline
- **Security Lead**: Security testing approach and compliance validation

---

*Generated by the Test Plan Generator v1.0*
*Based on risk analysis dated: {datetime.now().strftime('%Y-%m-%d')}*
""")

    def _generate_csv_summary(self, file_path: Path, test_plan: TestPlan):
        """Generate CSV summary for project management"""
        with open(file_path, 'w', newline='', encoding='utf-8') as f:
            writer = csv.writer(f)

            # Test phases summary
            writer.writerow(['Test Phase', 'Coverage Target %', 'Effort Hours', 'Dependencies'])
            for phase in test_plan.test_phases:
                writer.writerow([
                    phase.phase,
                    phase.coverage_target,
                    phase.estimated_effort_hours,
                    '; '.join(phase.dependencies) if phase.dependencies else 'None'
                ])

            writer.writerow([])  # Empty row

            # Resource summary
            writer.writerow(['Resource Type', 'Requirement'])
            for role, count in test_plan.resource_requirements['team_composition'].items():
                writer.writerow([f'{role} (Team)', count])

            writer.writerow(['Total Effort Hours', test_plan.resource_requirements['effort_estimation']['total_hours']])
            writer.writerow(['Duration Weeks', test_plan.resource_requirements['effort_estimation']['duration_weeks']])
            writer.writerow(['Risk Buffer %', test_plan.resource_requirements['effort_estimation']['risk_buffer_percentage']])

    def run_generation(self) -> Dict[str, str]:
        """Run complete test plan generation workflow"""
        logger.info("Starting test plan generation...")

        try:
            # Load risk analysis
            self.risk_analysis = self.load_risk_analysis()

            # Generate complete test plan
            test_plan = self.generate_complete_test_plan()

            # Save test plan
            file_paths = self.save_test_plan(test_plan)

            logger.info("Test plan generation completed successfully!")
            return file_paths

        except Exception as e:
            logger.error(f"Generation failed: {str(e)}")
            raise

def main():
    """Main entry point"""
    parser = argparse.ArgumentParser(description="Generate test plan from risk analysis")
    parser.add_argument("--input-dir", default="test-analysis", help="Input directory with risk analysis")
    parser.add_argument("--output-dir", default="test-plan", help="Output directory for test plan")

    args = parser.parse_args()

    try:
        generator = TestStrategyGenerator(args.input_dir, args.output_dir)
        file_paths = generator.run_generation()

        print("✅ Test plan generation completed successfully!")
        print("\nGenerated files:")
        for file_type, file_path in file_paths.items():
            print(f"  📄 {file_type}: {file_path}")

        return 0

    except Exception as e:
        print(f"❌ Generation failed: {str(e)}")
        return 1

if __name__ == "__main__":
    sys.exit(main())
