#!/usr/bin/env python3
"""
Project Classifier Script - BMAD-Inspired Auto-Detection
Automatically detects project type, technology stack, and generates documentation requirements matrix
Inspired by BMAD Method's 13-type classification system + domain-specific domain intelligence
"""

import os
import json
import yaml
import argparse
from pathlib import Path
from typing import Dict, List, Any, Optional
from dataclasses import dataclass
from datetime import datetime

@dataclass
class ClassificationResult:
    project_type: str
    sub_type: str
    tech_stack: List[str]
    complexity: str
    domain: str
    confidence: float
    documentation_requirements: Dict[str, List[str]]
    detected_patterns: Dict[str, List[str]]

class ProjectClassifier:
    def __init__(self, config_path: str = None):
        self.config_path = config_path or Path(__file__).parent.parent / "project-type-patterns.yaml"
        self.load_patterns()

    def load_patterns(self):
        """Load project type patterns from YAML config"""
        try:
            with open(self.config_path, 'r') as f:
                self.patterns = yaml.safe_load(f)
        except FileNotFoundError:
            print(f"⚠️  Config file not found: {self.config_path}")
            self.patterns = self._get_default_patterns()

    def _get_default_patterns(self):
        """Fallback patterns if config file not found"""
        return {
            'project_types': {
                'web': {
                    'name': 'Web Application',
                    'indicators': {
                        'files': {'required_any': ['package.json'], 'tech_patterns': ['react', 'vue', 'angular']}
                    }
                }
            }
        }

    def scan_project(self, project_path: str) -> ClassificationResult:
        """Main entry point - scan project and return classification"""
        project_path = Path(project_path)

        print(f"🔍 Scanning project: {project_path}")

        # Phase 1: File pattern detection
        file_patterns = self._scan_file_patterns(project_path)

        # Phase 2: Directory structure analysis
        dir_structure = self._analyze_directory_structure(project_path)

        # Phase 3: Technology stack detection
        tech_stack = self._detect_technology_stack(project_path, file_patterns)

        # Phase 4: Content analysis for domain detection
        domain_analysis = self._analyze_domain_content(project_path)

        # Phase 5: Complexity assessment
        complexity = self._assess_complexity(project_path, file_patterns, dir_structure)

        # Phase 6: Project type classification
        project_type, confidence = self._classify_project_type(
            file_patterns, dir_structure, tech_stack, domain_analysis
        )

        # Phase 7: Generate documentation requirements
        doc_requirements = self._generate_documentation_requirements(project_type, domain_analysis)

        return ClassificationResult(
            project_type=project_type['name'],
            sub_type=self._determine_subtype(project_type, tech_stack),
            tech_stack=tech_stack,
            complexity=complexity,
            domain=domain_analysis.get('primary_domain', 'general'),
            confidence=confidence,
            documentation_requirements=doc_requirements,
            detected_patterns={
                'files': file_patterns,
                'directories': dir_structure,
                'content': domain_analysis
            }
        )

    def _scan_file_patterns(self, project_path: Path) -> Dict[str, List[str]]:
        """Scan for technology indicator files"""
        patterns = {}

        # Common technology indicator files
        tech_files = [
            'package.json', 'yarn.lock', 'pnpm-lock.yaml',  # Node.js
            'requirements.txt', 'pyproject.toml', 'Pipfile',  # Python
            'go.mod', 'go.sum',  # Go
            'Cargo.toml', 'Cargo.lock',  # Rust
            'pom.xml', 'build.gradle',  # Java
            'Gemfile', 'Gemfile.lock',  # Ruby
            'composer.json', 'composer.lock',  # PHP
            'pubspec.yaml', 'pubspec.lock',  # Flutter/Dart
            'Podfile', 'Package.swift',  # iOS
            'CMakeLists.txt', 'Makefile',  # C/C++
            'platformio.ini', '*.ino',  # Arduino/Embedded
            'manifest.json',  # Browser Extension
            '*.tf', '*.tfvars',  # Terraform
            'Dockerfile', 'docker-compose*.yml',  # Docker
            'dbt_project.yml', 'airflow.cfg',  # Data
            'tsconfig.json', 'webpack.config.*', 'vite.config.*',  # Frontend tools
        ]

        found_files = []
        for file_pattern in tech_files:
            matches = list(project_path.rglob(file_pattern))
            if matches:
                found_files.extend([str(f.relative_to(project_path)) for f in matches[:3]])  # Limit to 3

        patterns['tech_files'] = found_files

        # Scan package.json for specific technologies
        package_json = project_path / 'package.json'
        if package_json.exists():
            try:
                with open(package_json, 'r') as f:
                    pkg_data = json.load(f)
                    dependencies = {**pkg_data.get('dependencies', {}), **pkg_data.get('devDependencies', {})}
                    patterns['npm_dependencies'] = list(dependencies.keys())[:10]  # Top 10
            except:
                pass

        # Scan requirements.txt for Python packages
        requirements = project_path / 'requirements.txt'
        if requirements.exists():
            try:
                with open(requirements, 'r') as f:
                    reqs = [line.split('==')[0].split('>=')[0].strip() for line in f if line.strip() and not line.startswith('#')]
                    patterns['python_packages'] = reqs[:10]  # Top 10
            except:
                pass

        return patterns

    def _analyze_directory_structure(self, project_path: Path) -> List[str]:
        """Analyze project directory structure"""
        directories = []

        # Common project structure patterns
        common_dirs = [
            'src', 'app', 'api', 'components', 'pages', 'public', 'static', 'assets',
            'services', 'models', 'controllers', 'routes', 'middleware', 'handlers',
            'screens', 'navigation', 'ios', 'android', 'mobile',
            'cmd', 'cli', 'bin', 'lib', 'dist', 'build', 'target',
            'terraform', 'k8s', 'docker', 'charts', 'infra',
            'dags', 'pipelines', 'etl', 'notebooks', 'sql',
            'tests', '__tests__', 'test', 'spec',
            'docs', 'documentation',
            'config', 'scripts', 'tools', 'utils'
        ]

        for dir_name in common_dirs:
            if (project_path / dir_name).exists():
                directories.append(dir_name)

        return directories

    def _detect_technology_stack(self, project_path: Path, file_patterns: Dict) -> List[str]:
        """Detect technology stack based on files and patterns"""
        tech_stack = []

        # Node.js ecosystem detection
        if 'package.json' in str(file_patterns.get('tech_files', [])):
            tech_stack.append('Node.js')

            deps = file_patterns.get('npm_dependencies', [])

            # Frontend frameworks
            if any(fw in deps for fw in ['react', '@types/react']):
                tech_stack.append('React')
            if any(fw in deps for fw in ['vue', '@vue/cli']):
                tech_stack.append('Vue.js')
            if any(fw in deps for fw in ['@angular/core', '@angular/cli']):
                tech_stack.append('Angular')
            if 'svelte' in deps:
                tech_stack.append('Svelte')

            # Backend frameworks
            if any(fw in deps for fw in ['express', 'fastify', 'koa']):
                tech_stack.append('Express/Node.js Backend')
            if '@nestjs/core' in deps:
                tech_stack.append('NestJS')

            # Mobile frameworks
            if any(fw in deps for fw in ['react-native', '@react-native-community']):
                tech_stack.append('React Native')
            if any(fw in deps for fw in ['@ionic/react', '@ionic/angular', '@ionic/vue']):
                tech_stack.append('Ionic')

            # Build tools
            if any(tool in deps for tool in ['webpack', 'vite', 'rollup']):
                if 'webpack' in deps: tech_stack.append('Webpack')
                if 'vite' in deps: tech_stack.append('Vite')

            # Databases/ORM
            if any(db in deps for db in ['mongoose', 'prisma', 'typeorm']):
                if 'mongoose' in deps: tech_stack.append('MongoDB')
                if 'prisma' in deps: tech_stack.append('Prisma ORM')
                if 'typeorm' in deps: tech_stack.append('TypeORM')

        # Python ecosystem detection
        python_packages = file_patterns.get('python_packages', [])
        if python_packages or 'requirements.txt' in str(file_patterns.get('tech_files', [])):
            tech_stack.append('Python')

            # Web frameworks
            if any(fw in python_packages for fw in ['django', 'flask', 'fastapi']):
                if 'django' in python_packages: tech_stack.append('Django')
                if 'flask' in python_packages: tech_stack.append('Flask')
                if 'fastapi' in python_packages: tech_stack.append('FastAPI')

            # Data science
            if any(ds in python_packages for ds in ['pandas', 'numpy', 'scikit-learn', 'tensorflow', 'torch']):
                tech_stack.append('Data Science/ML')
                if 'tensorflow' in python_packages: tech_stack.append('TensorFlow')
                if 'torch' in python_packages: tech_stack.append('PyTorch')

        # Other languages
        if 'go.mod' in str(file_patterns.get('tech_files', [])):
            tech_stack.append('Go')
        if 'Cargo.toml' in str(file_patterns.get('tech_files', [])):
            tech_stack.append('Rust')
        if any(java in str(file_patterns.get('tech_files', [])) for java in ['pom.xml', 'build.gradle']):
            tech_stack.append('Java')
        if 'pubspec.yaml' in str(file_patterns.get('tech_files', [])):
            tech_stack.append('Flutter/Dart')

        # Infrastructure
        if any(infra in str(file_patterns.get('tech_files', [])) for infra in ['.tf', 'Dockerfile']):
            if '.tf' in str(file_patterns.get('tech_files', [])): tech_stack.append('Terraform')
            if 'Dockerfile' in str(file_patterns.get('tech_files', [])): tech_stack.append('Docker')

        return tech_stack

    def _analyze_domain_content(self, project_path: Path) -> Dict[str, Any]:
        """Analyze content for domain-specific patterns"""
        domain_analysis = {}

        # domain-specific domain detection
        domain-specific_keywords = [
            'domain-specific', 'face recognition', 'voice recognition', 'fingerprint',
            'liveness detection', 'anti-spoofing', 'identity verification',
            'document verification', 'domain-specific template', 'face verification',
            'voice verification', 'identity onboarding', 'kyc', 'aml'
        ]

        # Regulatory/compliance keywords
        compliance_keywords = [
            'GDPR Article 9', 'PSD2', 'eIDAS', 'ISO 30107', 'ISO 19795',
            'FIDO', 'WebAuthn', 'privacy policy', 'data protection',
            'domain-specific data', 'special category data'
        ]

        # Scan README and doc files for keywords
        doc_files = ['README.md', 'README.rst', 'README.txt', 'DESCRIPTION.md']
        content_analysis = {'domain-specific_score': 0, 'compliance_score': 0, 'found_keywords': []}

        for doc_file in doc_files:
            doc_path = project_path / doc_file
            if doc_path.exists():
                try:
                    with open(doc_path, 'r', encoding='utf-8', errors='ignore') as f:
                        content = f.read().lower()

                        for keyword in domain-specific_keywords:
                            if keyword.lower() in content:
                                content_analysis['domain-specific_score'] += 1
                                content_analysis['found_keywords'].append(keyword)

                        for keyword in compliance_keywords:
                            if keyword.lower() in content:
                                content_analysis['compliance_score'] += 1
                                content_analysis['found_keywords'].append(keyword)
                except:
                    pass

        # Determine primary domain
        if content_analysis['domain-specific_score'] >= 3:
            domain_analysis['primary_domain'] = 'domain-specific'
            domain_analysis['confidence'] = min(content_analysis['domain-specific_score'] / 10, 1.0)
        elif content_analysis['compliance_score'] >= 2:
            domain_analysis['primary_domain'] = 'fintech'
            domain_analysis['confidence'] = min(content_analysis['compliance_score'] / 5, 1.0)
        else:
            domain_analysis['primary_domain'] = 'general'
            domain_analysis['confidence'] = 0.5

        domain_analysis['analysis'] = content_analysis
        return domain_analysis

    def _assess_complexity(self, project_path: Path, file_patterns: Dict, dir_structure: List[str]) -> str:
        """Assess project complexity based on various indicators"""
        complexity_score = 0

        # File count indicator
        total_files = len(list(project_path.rglob('*'))) - len(list(project_path.rglob('.*')))
        if total_files > 1000:
            complexity_score += 3
        elif total_files > 500:
            complexity_score += 2
        elif total_files > 100:
            complexity_score += 1

        # Directory structure complexity
        if len(dir_structure) > 15:
            complexity_score += 2
        elif len(dir_structure) > 8:
            complexity_score += 1

        # Technology stack complexity
        tech_count = len(file_patterns.get('npm_dependencies', [])) + len(file_patterns.get('python_packages', []))
        if tech_count > 50:
            complexity_score += 3
        elif tech_count > 20:
            complexity_score += 2
        elif tech_count > 10:
            complexity_score += 1

        # Architecture patterns (microservices, monorepo)
        if any(pattern in dir_structure for pattern in ['services', 'microservices', 'packages', 'apps']):
            complexity_score += 2

        # Infrastructure complexity
        if any(infra in str(file_patterns.get('tech_files', [])) for infra in ['k8s/', 'terraform/', 'docker-compose']):
            complexity_score += 2

        # Determine complexity level
        if complexity_score >= 8:
            return 'Very High'
        elif complexity_score >= 6:
            return 'High'
        elif complexity_score >= 3:
            return 'Medium'
        else:
            return 'Low'

    def _classify_project_type(self, file_patterns: Dict, dir_structure: List[str],
                              tech_stack: List[str], domain_analysis: Dict) -> tuple:
        """Classify project type based on all indicators"""
        type_scores = {}

        for type_id, type_config in self.patterns['project_types'].items():
            score = 0

            # File pattern matching
            indicators = type_config.get('indicators', {})
            file_indicators = indicators.get('files', {})

            # Check required files
            required_files = file_indicators.get('required_any', [])
            tech_files = file_patterns.get('tech_files', [])

            for req_file in required_files:
                if any(req_file in tf for tf in tech_files):
                    score += 3

            # Check tech patterns
            tech_patterns = file_indicators.get('tech_patterns', [])
            for pattern in tech_patterns:
                if any(pattern.lower() in ts.lower() for ts in tech_stack):
                    score += 2

            # Directory structure matching
            dir_indicators = indicators.get('directories', {})
            required_dirs = dir_indicators.get('required_any', [])

            for req_dir in required_dirs:
                if req_dir.rstrip('/') in dir_structure:
                    score += 2

            # Special handling for domain-specific domain
            if type_id == 'domain-specific' and domain_analysis.get('primary_domain') == 'domain-specific':
                score += 5

            type_scores[type_id] = score

        # Find best match
        if not type_scores or max(type_scores.values()) == 0:
            return {'name': 'Unknown', 'config': {}}, 0.0

        best_type_id = max(type_scores, key=type_scores.get)
        best_score = type_scores[best_type_id]

        # Calculate confidence (0-1)
        max_possible_score = 10  # Rough estimate
        confidence = min(best_score / max_possible_score, 1.0)

        return self.patterns['project_types'][best_type_id], confidence

    def _determine_subtype(self, project_type: Dict, tech_stack: List[str]) -> str:
        """Determine project subtype based on tech stack"""
        if 'Web' in project_type['name']:
            if any('React' in ts for ts in tech_stack):
                if any('Next' in ts for ts in tech_stack):
                    return 'Next.js SPA'
                return 'React SPA'
            elif any('Vue' in ts for ts in tech_stack):
                return 'Vue.js SPA'
            elif any('Angular' in ts for ts in tech_stack):
                return 'Angular SPA'
            elif any('Backend' in ts for ts in tech_stack):
                return 'Full-Stack Web App'
            else:
                return 'Web Application'

        elif 'Mobile' in project_type['name']:
            if any('React Native' in ts for ts in tech_stack):
                return 'React Native Cross-Platform'
            elif any('Flutter' in ts for ts in tech_stack):
                return 'Flutter Cross-Platform'
            elif any('Ionic' in ts for ts in tech_stack):
                return 'Ionic Hybrid'
            else:
                return 'Native Mobile'

        elif 'Backend' in project_type['name']:
            if any('Django' in ts for ts in tech_stack):
                return 'Django REST API'
            elif any('FastAPI' in ts for ts in tech_stack):
                return 'FastAPI Service'
            elif any('Express' in ts for ts in tech_stack):
                return 'Node.js REST API'
            elif 'Go' in tech_stack:
                return 'Go Microservice'
            else:
                return 'API Service'

        return project_type['name']

    def _generate_documentation_requirements(self, project_type: Dict, domain_analysis: Dict) -> Dict[str, List[str]]:
        """Generate documentation requirements based on project type and domain"""
        base_requirements = project_type.get('documentation_requirements', {})

        # Add domain-specific requirements
        if domain_analysis.get('primary_domain') == 'domain-specific':
            domain-specific_patterns = self.patterns['project_types'].get('domain-specific', {})
            domain-specific_reqs = domain-specific_patterns.get('documentation_requirements', {})

            # Merge domain-specific requirements
            for category, requirements in domain-specific_reqs.items():
                if category not in base_requirements:
                    base_requirements[category] = []
                base_requirements[category].extend(requirements)

        return base_requirements

    def generate_classification_report(self, result: ClassificationResult, output_path: str = None) -> str:
        """Generate a comprehensive classification report"""
        report = f"""---
classificationDate: '{datetime.now().isoformat()}'
projectType: '{result.project_type}'
subType: '{result.sub_type}'
complexity: '{result.complexity}'
domain: '{result.domain}'
confidence: {result.confidence:.2f}
techStack: {result.tech_stack}
classificationEngine: '{{CLIENT_NAME}} SDLC Project Classifier v1.0'
bmadInspired: true
---

# Project Classification Report

**Generated:** {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
**Project Type:** {result.project_type}
**Sub-Type:** {result.sub_type}
**Domain:** {result.domain}
**Complexity:** {result.complexity}
**Confidence:** {result.confidence:.1%}

## Technology Stack Detected

"""

        for tech in result.tech_stack:
            report += f"- **{tech}**\n"

        report += f"""

## Documentation Requirements Matrix

### Critical (Must Have)
"""

        critical_docs = result.documentation_requirements.get('critical', [])
        for doc in critical_docs:
            report += f"- [ ] **{doc}**\n"

        report += f"""

### Recommended (Should Have)
"""

        recommended_docs = result.documentation_requirements.get('recommended', [])
        for doc in recommended_docs:
            report += f"- [ ] **{doc}**\n"

        if result.domain == 'domain-specific':
            domain-specific_docs = result.documentation_requirements.get('domain-specific_specific', [])
            if domain-specific_docs:
                report += f"""

### domain-specific-Specific (Domain Requirements)
"""
                for doc in domain-specific_docs:
                    report += f"- [ ] **{doc}**\n"

        report += f"""

## Detected Patterns

### File Patterns
"""
        for pattern_type, patterns in result.detected_patterns['files'].items():
            if patterns:
                report += f"- **{pattern_type.title()}**: {', '.join(patterns[:5])}\n"

        report += f"""

### Directory Structure
- **Directories Found**: {', '.join(result.detected_patterns['directories'][:10])}

### Domain Analysis
- **Primary Domain**: {result.domain}
- **Keywords Found**: {', '.join(result.detected_patterns['content'].get('found_keywords', [])[:5])}

## Recommended Next Steps

1. **Initialize Documentation**: Run `/init-project-docs` with detected type
2. **Set Up Templates**: Use {result.project_type.lower()} templates
3. **Configure CI/CD**: Set up validation for {result.complexity.lower()} complexity project
4. **Security Review**: {'Critical for domain-specific data processing' if result.domain == 'domain-specific' else 'Standard security checklist'}

---

**Generated by {{CLIENT_NAME}} SDLC Project Classifier v1.0**
**Inspired by BMAD Method's 13-type classification system**
"""

        if output_path:
            with open(output_path, 'w') as f:
                f.write(report)
            print(f"📋 Classification report saved: {output_path}")

        return report

def main():
    parser = argparse.ArgumentParser(description="BMAD-inspired project classifier")
    parser.add_argument("project_path", help="Path to project directory")
    parser.add_argument("--output", help="Output file for classification report")
    parser.add_argument("--config", help="Path to classification patterns config")
    parser.add_argument("--json", action="store_true", help="Output JSON format")

    args = parser.parse_args()

    # Initialize classifier
    classifier = ProjectClassifier(args.config)

    # Classify project
    result = classifier.scan_project(args.project_path)

    # Output results
    if args.json:
        # JSON output for programmatic use
        output_data = {
            'project_type': result.project_type,
            'sub_type': result.sub_type,
            'tech_stack': result.tech_stack,
            'complexity': result.complexity,
            'domain': result.domain,
            'confidence': result.confidence,
            'documentation_requirements': result.documentation_requirements,
            'detected_patterns': result.detected_patterns
        }

        if args.output:
            with open(args.output, 'w') as f:
                json.dump(output_data, f, indent=2)
        else:
            print(json.dumps(output_data, indent=2))
    else:
        # Markdown report
        report = classifier.generate_classification_report(result, args.output)
        if not args.output:
            print(report)

    # Summary output
    print(f"\n🎯 Project Classification Complete:")
    print(f"   Type: {result.project_type} ({result.sub_type})")
    print(f"   Domain: {result.domain}")
    print(f"   Complexity: {result.complexity}")
    print(f"   Confidence: {result.confidence:.1%}")
    print(f"   Tech Stack: {', '.join(result.tech_stack[:3])}{'...' if len(result.tech_stack) > 3 else ''}")

if __name__ == "__main__":
    main()