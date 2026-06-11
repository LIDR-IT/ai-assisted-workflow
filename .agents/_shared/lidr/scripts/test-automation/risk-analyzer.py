#!/usr/bin/env python3
"""
Risk Analyzer for Test Plan Automation
======================================

Part of the SDLC Automation Suite.
Transforms 3+ hours of manual risk assessment into 5-minute automated analysis.

This script analyzes project complexity, requirements, and domain factors to:
1. Auto-discover requirements and project context
2. Assess testing risks based on domain-agnostic heuristics
3. Generate risk-based test strategy recommendations
4. Export structured data for test-strategy-generator.py

Domain configuration
--------------------
The active defaults (``DomainRiskPatterns``) are domain-agnostic: generic
security, accuracy, performance, compliance and complexity patterns that apply
to any software project. To specialize the analyzer for a concrete vertical,
override the risk factors and complexity indicators.

A worked, overridable example for a biometric-identity vertical ships alongside
this module:
  - As an in-code constant block: ``BIOMETRIC_EXAMPLE_RISK_FACTORS`` and
    ``BIOMETRIC_EXAMPLE_COMPLEXITY_INDICATORS`` (see bottom of this file).
  - As a sibling config file: ``risk-analyzer.biometric-example.json`` in this
    same directory.
Neither is loaded by default; copy/adapt them only when you need that domain.

Usage:
    python risk-analyzer.py [--project-dir path] [--output-dir path]

Dependencies:
    - requirements files (RFs, NFRs, PRDs)
    - project context (architecture, tech stack)
    - domain-agnostic risk patterns (overridable per vertical)
"""

import os
import sys
import json
import re
import logging
import argparse
from pathlib import Path
from dataclasses import dataclass, asdict
from typing import List, Dict, Any, Optional, Tuple
from datetime import datetime

try:  # optional dependency — not required for the default workflow
    import yaml  # noqa: F401
except ImportError:
    yaml = None

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(levelname)s: %(message)s')
logger = logging.getLogger(__name__)

@dataclass
class ProjectContext:
    """Project context extracted from discovery"""
    name: str
    type: str
    domain: str
    tech_stack: List[str]
    team_size: int
    complexity_score: float
    regulatory_requirements: List[str]
    data_sensitivity: str

@dataclass
class RiskFactor:
    """Individual risk factor with assessment"""
    category: str
    factor: str
    probability: float  # 0.1-1.0
    impact: float      # 0.1-1.0
    risk_score: float  # probability * impact
    mitigation: str
    test_implications: List[str]

@dataclass
class TestStrategy:
    """Generated test strategy based on risk analysis"""
    overall_risk_level: str  # LOW/MEDIUM/HIGH/CRITICAL
    recommended_approach: str
    coverage_targets: Dict[str, int]
    automation_ratio: int
    environment_strategy: str
    data_strategy: str
    timeline_multiplier: float
    special_requirements: List[str]

class DomainRiskPatterns:
    """Domain-agnostic risk patterns for software systems.

    These are neutral defaults that apply to any project. Specialize them per
    vertical by overriding ``DOMAIN_RISK_FACTORS`` and ``COMPLEXITY_INDICATORS``
    (see the biometric example at the bottom of this module).
    """

    DOMAIN_RISK_FACTORS = {
        'sensitive_data_protection': {
            'patterns': [r'sensitive.*data', r'encrypt', r'hash', r'irreversible', r'privacy.*preserving'],
            'risk_level': 'HIGH',
            'test_implications': ['Data encryption testing', 'Privacy verification', 'Data breach simulation']
        },
        'authentication_integrity': {
            'patterns': [r'authentication', r'authoriz', r'access.*control', r'spoof.*detect', r'anti.*fraud'],
            'risk_level': 'HIGH',
            'test_implications': ['Authentication bypass tests', 'Access-control validation', 'Edge case scenarios']
        },
        'performance_accuracy': {
            'patterns': [r'latency', r'throughput', r'error.*rate', r'accuracy', r'performance.*metric'],
            'risk_level': 'MEDIUM',
            'test_implications': ['Performance benchmarking', 'Accuracy validation', 'Load testing']
        },
        'privacy_compliance': {
            'patterns': [r'GDPR', r'consent', r'data.*subject.*rights', r'privacy.*impact'],
            'risk_level': 'HIGH',
            'test_implications': ['Consent flow testing', 'Data deletion verification', 'Privacy audit']
        },
        'regulatory_compliance': {
            'patterns': [r'compliance', r'regulation', r'certification', r'audit.*trail'],
            'risk_level': 'HIGH',
            'test_implications': ['Compliance validation', 'Certification testing', 'Audit trail verification']
        }
    }

    COMPLEXITY_INDICATORS = {
        'multi_channel': {
            'patterns': [r'multi.*channel', r'omni.*channel', r'multi.*modal'],
            'complexity_score': 0.8
        },
        'real_time': {
            'patterns': [r'real.*time', r'streaming', r'live.*capture'],
            'complexity_score': 0.6
        },
        'mobile_integration': {
            'patterns': [r'mobile.*SDK', r'iOS', r'Android', r'React.*Native'],
            'complexity_score': 0.7
        },
        'api_integration': {
            'patterns': [r'REST.*API', r'microservice', r'webhook'],
            'complexity_score': 0.5
        }
    }

class ProjectRiskAnalyzer:
    """Main analyzer for project testing risks"""

    def __init__(self, project_dir: str = ".", output_dir: str = "test-analysis"):
        self.project_dir = Path(project_dir)
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(exist_ok=True)

        self.patterns = DomainRiskPatterns()
        self.project_context: Optional[ProjectContext] = None
        self.risk_factors: List[RiskFactor] = []

    def discover_project_context(self) -> ProjectContext:
        """Auto-discover project context from available files"""
        logger.info("Discovering project context...")

        # Discover project files
        project_files = self._discover_project_files()

        # Extract basic project info
        project_name = self._extract_project_name(project_files)
        project_type = self._classify_project_type(project_files)
        domain = self._identify_domain(project_files)
        tech_stack = self._extract_tech_stack(project_files)
        team_size = self._estimate_team_size(project_files)
        complexity_score = self._calculate_complexity_score(project_files)
        regulatory_reqs = self._identify_regulatory_requirements(project_files)
        data_sensitivity = self._assess_data_sensitivity(project_files)

        context = ProjectContext(
            name=project_name,
            type=project_type,
            domain=domain,
            tech_stack=tech_stack,
            team_size=team_size,
            complexity_score=complexity_score,
            regulatory_requirements=regulatory_reqs,
            data_sensitivity=data_sensitivity
        )

        logger.info(f"Project context discovered: {context.name} ({context.type})")
        return context

    def _discover_project_files(self) -> Dict[str, List[Path]]:
        """Discover relevant project files"""
        files = {
            'requirements': [],
            'prds': [],
            'architecture': [],
            'config': [],
            'code': []
        }

        # Common locations to check
        search_paths = [
            self.project_dir,
            self.project_dir / "docs",
            self.project_dir / "docs" / "projects",
            self.project_dir / "docs" / "templates",
            self.project_dir / ".claude" / "skills"
        ]

        for search_path in search_paths:
            if search_path.exists():
                # Requirements files
                files['requirements'].extend(search_path.rglob("*RF*.md"))
                files['requirements'].extend(search_path.rglob("*NFR*.md"))
                files['requirements'].extend(search_path.rglob("*requirements*.md"))

                # PRD files
                files['prds'].extend(search_path.rglob("*PRD*.md"))
                files['prds'].extend(search_path.rglob("*prd*.md"))

                # Architecture files
                files['architecture'].extend(search_path.rglob("*architecture*.md"))
                files['architecture'].extend(search_path.rglob("*ADR*.md"))

                # Config files
                files['config'].extend(search_path.rglob("package.json"))
                files['config'].extend(search_path.rglob("*.config.*"))

                # Code files (for tech stack detection)
                files['code'].extend(search_path.rglob("*.ts"))
                files['code'].extend(search_path.rglob("*.tsx"))
                files['code'].extend(search_path.rglob("*.py"))

        logger.info(f"Discovered files: {sum(len(v) for v in files.values())} total")
        return files

    def _extract_project_name(self, project_files: Dict[str, List[Path]]) -> str:
        """Extract project name from files"""
        # Check package.json first
        for config_file in project_files['config']:
            if config_file.name == 'package.json':
                try:
                    with open(config_file) as f:
                        package_data = json.load(f)
                        if 'name' in package_data:
                            return package_data['name']
                except:
                    pass

        # Check PRD files for project name
        for prd_file in project_files['prds']:
            content = self._read_file_safely(prd_file)
            if content:
                # Look for project name patterns
                name_patterns = [
                    r'proyecto\s*([A-Za-z0-9\s\-]+)',
                    r'project\s*([A-Za-z0-9\s\-]+)',
                    r'#\s*([A-Za-z0-9\s\-]+)\s*PRD'
                ]
                for pattern in name_patterns:
                    match = re.search(pattern, content, re.IGNORECASE)
                    if match:
                        return match.group(1).strip()

        # Default to directory name
        return self.project_dir.name

    def _classify_project_type(self, project_files: Dict[str, List[Path]]) -> str:
        """Classify project type based on files and content"""
        all_content = ""

        # Collect content from relevant files
        for file_list in [project_files['requirements'], project_files['prds'], project_files['architecture']]:
            for file_path in file_list[:5]:  # Limit to avoid excessive content
                content = self._read_file_safely(file_path)
                if content:
                    all_content += content + "\n"

        # Project type patterns
        type_patterns = {
            'Web Application': [r'React', r'frontend', r'SPA', r'web.*app'],
            'Mobile Application': [r'iOS', r'Android', r'mobile.*app', r'React.*Native'],
            'Backend Service': [r'API', r'microservice', r'backend', r'REST'],
            'SDK/Library': [r'SDK', r'library', r'framework'],
            'Platform': [r'platform', r'ecosystem', r'multiple.*service']
        }

        for project_type, patterns in type_patterns.items():
            if any(re.search(pattern, all_content, re.IGNORECASE) for pattern in patterns):
                return project_type

        return 'Unknown'

    def _identify_domain(self, project_files: Dict[str, List[Path]]) -> str:
        """Identify business domain"""
        all_content = ""

        for file_list in project_files.values():
            for file_path in file_list[:3]:
                content = self._read_file_safely(file_path)
                if content:
                    all_content += content + "\n"

        domain_patterns = {
            'Identity Verification': [r'identity', r'verification', r'authentication', r'onboarding'],
            'Fintech': [r'banking', r'financial', r'payment', r'fintech'],
            'Healthcare': [r'medical', r'healthcare', r'clinical', r'patient'],
            'Government': [r'government', r'public.*sector', r'eIDAS', r'identity.*card'],
            'Security': [r'security', r'authentication', r'authorization', r'cybersecurity']
        }

        for domain, patterns in domain_patterns.items():
            if any(re.search(pattern, all_content, re.IGNORECASE) for pattern in patterns):
                return domain

        return 'General'

    def _extract_tech_stack(self, project_files: Dict[str, List[Path]]) -> List[str]:
        """Extract technology stack from files"""
        tech_stack = set()

        # Check package.json dependencies
        for config_file in project_files['config']:
            if config_file.name == 'package.json':
                try:
                    with open(config_file) as f:
                        package_data = json.load(f)
                        deps = {**package_data.get('dependencies', {}),
                               **package_data.get('devDependencies', {})}

                        # Map dependencies to tech stack
                        if 'react' in deps:
                            tech_stack.add('React')
                        if 'typescript' in deps:
                            tech_stack.add('TypeScript')
                        if 'tailwindcss' in deps:
                            tech_stack.add('Tailwind CSS')
                        if '@xyflow/react' in deps:
                            tech_stack.add('React Flow')
                        if 'vite' in deps:
                            tech_stack.add('Vite')
                except:
                    pass

        # Check file extensions
        if project_files['code']:
            extensions = {f.suffix for f in project_files['code']}
            if '.ts' in extensions or '.tsx' in extensions:
                tech_stack.add('TypeScript')
            if '.py' in extensions:
                tech_stack.add('Python')

        return list(tech_stack)

    def _estimate_team_size(self, project_files: Dict[str, List[Path]]) -> int:
        """Estimate team size based on project complexity"""
        # Simple heuristic based on file count and project type
        total_files = sum(len(files) for files in project_files.values())

        if total_files < 10:
            return 3  # Small team
        elif total_files < 50:
            return 7  # Medium team
        else:
            return 12  # Large team

    def _calculate_complexity_score(self, project_files: Dict[str, List[Path]]) -> float:
        """Calculate project complexity score (0.0-1.0)"""
        complexity_score = 0.3  # Base complexity

        all_content = ""
        for file_list in project_files.values():
            for file_path in file_list[:5]:
                content = self._read_file_safely(file_path)
                if content:
                    all_content += content + "\n"

        # Check complexity indicators
        for indicator, data in self.patterns.COMPLEXITY_INDICATORS.items():
            if any(re.search(pattern, all_content, re.IGNORECASE) for pattern in data['patterns']):
                complexity_score += data['complexity_score'] * 0.2  # Weight factor

        return min(complexity_score, 1.0)  # Cap at 1.0

    def _identify_regulatory_requirements(self, project_files: Dict[str, List[Path]]) -> List[str]:
        """Identify regulatory requirements"""
        requirements = set()

        all_content = ""
        for file_list in project_files.values():
            for file_path in file_list[:5]:
                content = self._read_file_safely(file_path)
                if content:
                    all_content += content + "\n"

        regulatory_patterns = {
            'GDPR': [r'GDPR', r'data.*protection', r'privacy.*regulation'],
            'eIDAS': [r'eIDAS', r'electronic.*identification'],
            'PSD2': [r'PSD2', r'payment.*directive', r'strong.*customer.*authentication'],
            'PCI DSS': [r'PCI.*DSS', r'payment.*card.*industry'],
            'CCPA': [r'CCPA', r'california.*consumer.*privacy'],
            'HIPAA': [r'HIPAA', r'protected.*health.*information'],
        }

        for regulation, patterns in regulatory_patterns.items():
            if any(re.search(pattern, all_content, re.IGNORECASE) for pattern in patterns):
                requirements.add(regulation)

        return list(requirements)

    def _assess_data_sensitivity(self, project_files: Dict[str, List[Path]]) -> str:
        """Assess data sensitivity level"""
        all_content = ""
        for file_list in project_files.values():
            for file_path in file_list[:5]:
                content = self._read_file_safely(file_path)
                if content:
                    all_content += content + "\n"

        if re.search(r'sensitive.*data|special.*category|biometric', all_content, re.IGNORECASE):
            return 'CRITICAL'
        elif re.search(r'financial|banking|payment', all_content, re.IGNORECASE):
            return 'HIGH'
        elif re.search(r'personal.*data|PII', all_content, re.IGNORECASE):
            return 'MEDIUM'
        else:
            return 'LOW'

    def analyze_testing_risks(self) -> List[RiskFactor]:
        """Analyze testing risks based on project context"""
        logger.info("Analyzing testing risks...")

        risk_factors = []

        # Domain-specific risks
        risk_factors.extend(self._analyze_domain_risks())

        # Technical complexity risks
        risk_factors.extend(self._analyze_technical_risks())

        # Regulatory compliance risks
        risk_factors.extend(self._analyze_compliance_risks())

        # Team and process risks
        risk_factors.extend(self._analyze_process_risks())

        # Sort by risk score (highest first)
        risk_factors.sort(key=lambda x: x.risk_score, reverse=True)

        logger.info(f"Identified {len(risk_factors)} risk factors")
        return risk_factors

    def _analyze_domain_risks(self) -> List[RiskFactor]:
        """Analyze domain-specific testing risks driven by data sensitivity and compliance.

        Domain-agnostic: triggers on sensitive-data handling and privacy
        regulation rather than any one industry vertical.
        """
        risks = []

        # Only raise domain data-protection risks when the project handles
        # sensitive data (HIGH or CRITICAL sensitivity).
        if self.project_context.data_sensitivity not in ('HIGH', 'CRITICAL'):
            return risks

        # Sensitive-data protection risk
        risks.append(RiskFactor(
            category="Security",
            factor="Sensitive Data Protection",
            probability=0.8,
            impact=0.9,
            risk_score=0.72,
            mitigation="Implement comprehensive sensitive-data encryption testing",
            test_implications=["Data encryption validation", "Key management testing", "Data breach simulation"]
        ))

        # Authentication / access integrity
        risks.append(RiskFactor(
            category="Accuracy",
            factor="Authentication Accuracy (False Positives/Negatives)",
            probability=0.7,
            impact=0.8,
            risk_score=0.56,
            mitigation="Extensive authentication and access-control testing with diverse scenarios",
            test_implications=["Authentication bypass test suite", "Edge case validation", "Performance benchmarking"]
        ))

        # Privacy regulation compliance
        if 'GDPR' in self.project_context.regulatory_requirements:
            risks.append(RiskFactor(
                category="Compliance",
                factor="Privacy Regulation Violations",
                probability=0.6,
                impact=1.0,
                risk_score=0.6,
                mitigation="Privacy-by-design testing and consent flow validation",
                test_implications=["Consent mechanism testing", "Data deletion verification", "Privacy audit testing"]
            ))

        return risks

    def _analyze_technical_risks(self) -> List[RiskFactor]:
        """Analyze technical complexity risks"""
        risks = []

        # High complexity projects
        if self.project_context.complexity_score > 0.7:
            risks.append(RiskFactor(
                category="Technical",
                factor="High System Complexity",
                probability=0.8,
                impact=0.7,
                risk_score=0.56,
                mitigation="Comprehensive integration testing and component isolation",
                test_implications=["Integration test suite", "Component isolation testing", "End-to-end scenarios"]
            ))

        # Multi-technology stack
        if len(self.project_context.tech_stack) > 4:
            risks.append(RiskFactor(
                category="Technical",
                factor="Multi-Technology Integration",
                probability=0.6,
                impact=0.6,
                risk_score=0.36,
                mitigation="Technology-specific testing strategies and compatibility testing",
                test_implications=["Cross-platform testing", "Technology compatibility validation", "Version compatibility testing"]
            ))

        # Mobile integration risks
        if any('mobile' in tech.lower() for tech in self.project_context.tech_stack):
            risks.append(RiskFactor(
                category="Technical",
                factor="Mobile Platform Fragmentation",
                probability=0.7,
                impact=0.5,
                risk_score=0.35,
                mitigation="Device matrix testing and OS version compatibility",
                test_implications=["Device compatibility testing", "OS version testing", "Performance on low-end devices"]
            ))

        return risks

    def _analyze_compliance_risks(self) -> List[RiskFactor]:
        """Analyze regulatory compliance risks"""
        risks = []

        for regulation in self.project_context.regulatory_requirements:
            if regulation == 'eIDAS':
                risks.append(RiskFactor(
                    category="Compliance",
                    factor="eIDAS Interoperability Requirements",
                    probability=0.5,
                    impact=0.8,
                    risk_score=0.4,
                    mitigation="Cross-border interoperability testing",
                    test_implications=["Interoperability testing", "Certificate validation", "Cross-border scenarios"]
                ))
            elif regulation == 'PSD2':
                risks.append(RiskFactor(
                    category="Compliance",
                    factor="Strong Customer Authentication (SCA) Requirements",
                    probability=0.6,
                    impact=0.7,
                    risk_score=0.42,
                    mitigation="Multi-factor authentication flow testing",
                    test_implications=["SCA flow testing", "Fallback mechanism testing", "Authentication factor validation"]
                ))

        return risks

    def _analyze_process_risks(self) -> List[RiskFactor]:
        """Analyze team and process risks"""
        risks = []

        # Large team coordination
        if self.project_context.team_size > 10:
            risks.append(RiskFactor(
                category="Process",
                factor="Large Team Coordination",
                probability=0.5,
                impact=0.5,
                risk_score=0.25,
                mitigation="Clear testing responsibilities and communication protocols",
                test_implications=["Parallel testing coordination", "Test environment management", "Result consolidation"]
            ))

        # Critical data sensitivity
        if self.project_context.data_sensitivity == 'CRITICAL':
            risks.append(RiskFactor(
                category="Process",
                factor="Critical Data Handling in Test Environments",
                probability=0.7,
                impact=0.8,
                risk_score=0.56,
                mitigation="Synthetic data generation and secure test environment setup",
                test_implications=["Test data management", "Environment security validation", "Data anonymization testing"]
            ))

        return risks

    def generate_test_strategy(self, risk_factors: List[RiskFactor]) -> TestStrategy:
        """Generate test strategy based on risk analysis"""
        logger.info("Generating test strategy...")

        # Calculate overall risk level
        high_risk_count = sum(1 for r in risk_factors if r.risk_score > 0.5)
        total_risks = len(risk_factors)

        if high_risk_count > total_risks * 0.6:
            overall_risk = "CRITICAL"
            coverage_targets = {"unit": 90, "integration": 85, "e2e": 70}
            automation_ratio = 60
            timeline_multiplier = 1.8
        elif high_risk_count > total_risks * 0.4:
            overall_risk = "HIGH"
            coverage_targets = {"unit": 85, "integration": 75, "e2e": 50}
            automation_ratio = 70
            timeline_multiplier = 1.5
        elif high_risk_count > total_risks * 0.2:
            overall_risk = "MEDIUM"
            coverage_targets = {"unit": 80, "integration": 65, "e2e": 30}
            automation_ratio = 75
            timeline_multiplier = 1.2
        else:
            overall_risk = "LOW"
            coverage_targets = {"unit": 75, "integration": 55, "e2e": 20}
            automation_ratio = 80
            timeline_multiplier = 1.0

        # Generate approach based on data sensitivity and risks
        if self.project_context.data_sensitivity in ('HIGH', 'CRITICAL'):
            approach = "Sensitive-data-specialized testing with security-first approach"
            environment_strategy = "Isolated test environments with synthetic sensitive data"
            data_strategy = "Anonymized datasets with comprehensive edge case coverage"
        else:
            approach = "Risk-based testing with focus on identified critical areas"
            environment_strategy = "Standard test environment progression (dev/staging/UAT)"
            data_strategy = "Representative test data with privacy protection"

        # Special requirements based on risks
        special_requirements = []
        for risk in risk_factors:
            if risk.risk_score > 0.5:
                special_requirements.extend(risk.test_implications)

        # Remove duplicates
        special_requirements = list(set(special_requirements))

        return TestStrategy(
            overall_risk_level=overall_risk,
            recommended_approach=approach,
            coverage_targets=coverage_targets,
            automation_ratio=automation_ratio,
            environment_strategy=environment_strategy,
            data_strategy=data_strategy,
            timeline_multiplier=timeline_multiplier,
            special_requirements=special_requirements
        )

    def _read_file_safely(self, file_path: Path) -> Optional[str]:
        """Safely read file content"""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                return f.read()
        except Exception:
            return None

    def save_analysis_results(self, context: ProjectContext, risks: List[RiskFactor], strategy: TestStrategy) -> Dict[str, str]:
        """Save analysis results to files"""
        logger.info("Saving analysis results...")

        # Save comprehensive analysis
        analysis_data = {
            "analysis_metadata": {
                "timestamp": datetime.now().isoformat(),
                "analyzer_version": "1.0.0",
                "project_analyzed": context.name
            },
            "project_context": asdict(context),
            "risk_analysis": [asdict(risk) for risk in risks],
            "test_strategy": asdict(strategy),
            "summary": {
                "total_risks_identified": len(risks),
                "high_risk_factors": sum(1 for r in risks if r.risk_score > 0.5),
                "overall_risk_level": strategy.overall_risk_level,
                "automation_recommendation": f"{strategy.automation_ratio}% automated testing"
            }
        }

        # Save JSON for machine processing
        json_file = self.output_dir / "test-risk-analysis.json"
        with open(json_file, 'w', encoding='utf-8') as f:
            json.dump(analysis_data, f, indent=2, ensure_ascii=False)

        # Save human-readable report
        report_file = self.output_dir / "test-risk-analysis-report.md"
        self._generate_markdown_report(report_file, context, risks, strategy)

        # Save CSV for project management
        csv_file = self.output_dir / "test-risks.csv"
        self._generate_csv_report(csv_file, risks)

        logger.info(f"Analysis complete. Results saved to {self.output_dir}")

        return {
            "json_file": str(json_file),
            "report_file": str(report_file),
            "csv_file": str(csv_file)
        }

    def _generate_markdown_report(self, file_path: Path, context: ProjectContext,
                                 risks: List[RiskFactor], strategy: TestStrategy):
        """Generate human-readable markdown report"""
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(f"""# Test Risk Analysis Report

## Project Overview

- **Project**: {context.name}
- **Type**: {context.type}
- **Domain**: {context.domain}
- **Team Size**: {context.team_size}
- **Complexity Score**: {context.complexity_score:.2f}
- **Data Sensitivity**: {context.data_sensitivity}

### Technology Stack
{chr(10).join(f"- {tech}" for tech in context.tech_stack)}

### Regulatory Requirements
{chr(10).join(f"- {req}" for req in context.regulatory_requirements) if context.regulatory_requirements else "- None identified"}

## Risk Analysis Summary

- **Overall Risk Level**: {strategy.overall_risk_level}
- **Total Risks Identified**: {len(risks)}
- **High-Risk Factors**: {sum(1 for r in risks if r.risk_score > 0.5)}

## Recommended Test Strategy

- **Approach**: {strategy.recommended_approach}
- **Automation Ratio**: {strategy.automation_ratio}%
- **Timeline Multiplier**: {strategy.timeline_multiplier}x

### Coverage Targets
{chr(10).join(f"- **{test_type.title()}**: {target}%" for test_type, target in strategy.coverage_targets.items())}

### Environment Strategy
{strategy.environment_strategy}

### Data Strategy
{strategy.data_strategy}

## Risk Factors Detail

| Risk Factor | Category | Probability | Impact | Score | Mitigation |
|-------------|----------|-------------|--------|-------|------------|
""")
            for risk in risks:
                f.write(f"| {risk.factor} | {risk.category} | {risk.probability:.1f} | {risk.impact:.1f} | {risk.risk_score:.2f} | {risk.mitigation} |\n")

            f.write(f"""
## Special Testing Requirements

{chr(10).join(f"- {req}" for req in strategy.special_requirements)}

## Implementation Recommendations

1. **Immediate Actions**
   - Set up test environments according to strategy
   - Implement high-risk factor mitigations first
   - Establish test data management process

2. **Testing Approach**
   - Focus on identified risk areas
   - Implement recommended automation ratio
   - Follow coverage targets for each test type

3. **Monitoring**
   - Track risk mitigation effectiveness
   - Monitor test coverage against targets
   - Adjust strategy based on findings

---
*Report generated by Test Risk Analyzer v1.0*
*Generated on: {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}*
""")

    def _generate_csv_report(self, file_path: Path, risks: List[RiskFactor]):
        """Generate CSV report for project management tools"""
        import csv

        with open(file_path, 'w', newline='', encoding='utf-8') as f:
            writer = csv.writer(f)
            writer.writerow([
                'Risk Factor', 'Category', 'Probability', 'Impact',
                'Risk Score', 'Mitigation', 'Test Implications'
            ])

            for risk in risks:
                writer.writerow([
                    risk.factor,
                    risk.category,
                    f"{risk.probability:.2f}",
                    f"{risk.impact:.2f}",
                    f"{risk.risk_score:.2f}",
                    risk.mitigation,
                    "; ".join(risk.test_implications)
                ])

    def run_analysis(self) -> Dict[str, str]:
        """Run complete risk analysis workflow"""
        logger.info("Starting test risk analysis...")

        try:
            # Phase 1: Discover project context
            self.project_context = self.discover_project_context()

            # Phase 2: Analyze testing risks
            self.risk_factors = self.analyze_testing_risks()

            # Phase 3: Generate test strategy
            test_strategy = self.generate_test_strategy(self.risk_factors)

            # Phase 4: Save results
            file_paths = self.save_analysis_results(self.project_context, self.risk_factors, test_strategy)

            logger.info("Risk analysis completed successfully!")
            return file_paths

        except Exception as e:
            logger.error(f"Analysis failed: {str(e)}")
            raise


# ---------------------------------------------------------------------------
# OVERRIDABLE EXAMPLE — Biometric-identity vertical (NOT loaded by default)
# ---------------------------------------------------------------------------
# These constants show how to specialize DomainRiskPatterns for a concrete
# vertical (here: biometric identity verification). They are reference-only.
# To use them, assign them onto DomainRiskPatterns before instantiating the
# analyzer, e.g.:
#
#     DomainRiskPatterns.DOMAIN_RISK_FACTORS = BIOMETRIC_EXAMPLE_RISK_FACTORS
#     DomainRiskPatterns.COMPLEXITY_INDICATORS = BIOMETRIC_EXAMPLE_COMPLEXITY_INDICATORS
#
# A machine-readable copy lives in risk-analyzer.biometric-example.json.

BIOMETRIC_EXAMPLE_RISK_FACTORS = {
    'template_security': {
        'patterns': [r'biometric.*encrypt', r'biometric.*hash', r'irreversible', r'privacy.*preserving'],
        'risk_level': 'HIGH',
        'test_implications': ['Template encryption testing', 'Privacy verification', 'Data breach simulation']
    },
    'liveness_detection': {
        'patterns': [r'liveness', r'spoof.*detect', r'anti.*spoof', r'spoof.*attack'],
        'risk_level': 'HIGH',
        'test_implications': ['Spoofing attack tests', 'Liveness accuracy testing', 'Edge case scenarios']
    },
    'performance_accuracy': {
        'patterns': [r'FAR', r'FRR', r'liveness', r'accuracy', r'performance.*metric'],
        'risk_level': 'MEDIUM',
        'test_implications': ['Performance benchmarking', 'Accuracy validation', 'Load testing']
    },
    'gdpr_compliance': {
        'patterns': [r'GDPR', r'consent', r'data.*subject.*rights', r'privacy.*impact'],
        'risk_level': 'HIGH',
        'test_implications': ['Consent flow testing', 'Data deletion verification', 'Privacy audit']
    },
    'regulatory_compliance': {
        'patterns': [r'eIDAS', r'PSD2', r'ISO.*30107', r'banking.*compliance'],
        'risk_level': 'HIGH',
        'test_implications': ['Compliance validation', 'Certification testing', 'Audit trail verification']
    }
}

BIOMETRIC_EXAMPLE_COMPLEXITY_INDICATORS = {
    'multi_modal': {
        'patterns': [r'face.*document', r'multi.*biometric'],
        'complexity_score': 0.8
    },
    'real_time': {
        'patterns': [r'real.*time', r'streaming', r'live.*capture'],
        'complexity_score': 0.6
    },
    'mobile_integration': {
        'patterns': [r'mobile.*SDK', r'iOS', r'Android', r'React.*Native'],
        'complexity_score': 0.7
    },
    'api_integration': {
        'patterns': [r'REST.*API', r'microservice', r'webhook'],
        'complexity_score': 0.5
    }
}


def main():
    """Main entry point"""
    parser = argparse.ArgumentParser(description="Analyze testing risks for project")
    parser.add_argument("--project-dir", default=".", help="Project directory to analyze")
    parser.add_argument("--output-dir", default="test-analysis", help="Output directory for results")

    args = parser.parse_args()

    try:
        analyzer = ProjectRiskAnalyzer(args.project_dir, args.output_dir)
        file_paths = analyzer.run_analysis()

        print("✅ Test risk analysis completed successfully!")
        print("\nGenerated files:")
        for file_type, file_path in file_paths.items():
            print(f"  📄 {file_type}: {file_path}")

        return 0

    except Exception as e:
        print(f"❌ Analysis failed: {str(e)}")
        return 1

if __name__ == "__main__":
    sys.exit(main())
