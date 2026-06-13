#!/usr/bin/env python3
"""
Security Checklist Generator for generic software projects
Automated generation of security checklists with regulatory compliance scoring.

Transforms compliance-analyzer.py results into actionable security checklist reports.
Follows proven patterns from tech-debt and lidr-requirements automation.

Domain-relevance keys consumed here (`domain_critical`, `domain_relevance`) match
the keys emitted by compliance-analyzer.py. The active industry requirement set is
DOMAIN-AGNOSTIC (generic banking / government / consumer baselines). A biometric-
identity EXAMPLE is preserved as BIOMETRIC_EXAMPLE_INDUSTRY_STANDARDS below — it is
an example only, NOT the active default.

Author: LIDR SDLC Automation
Version: 1.1.0
"""

import json
import argparse
import os
import sys
from datetime import datetime
from pathlib import Path

# Tracking tool used as the label/target for the CSV remediation export.
# Defaults to the current tool so existing behavior is preserved; override via env.
TRACKING_TOOL = os.getenv("LIDR_TRACKING_TOOL", "jira")

# ---------------------------------------------------------------------------
# OVERRIDABLE EXAMPLE — biometric-identity industry standards.
#
# This is an EXAMPLE, NOT the active default (which is DEFAULT_INDUSTRY_STANDARDS
# below). It shows how the generic baselines specialize for a biometric-identity
# context. Swap it in by passing it to SecurityChecklistGenerator(...,
# industry_standards=BIOMETRIC_EXAMPLE_INDUSTRY_STANDARDS) or by editing a copy.
# ---------------------------------------------------------------------------
BIOMETRIC_EXAMPLE_INDUSTRY_STANDARDS = {
    'banking': {
        'name': 'Banking/Financial Services (PCI-DSS Equivalent)',
        'requirements': [
            'HSM-backed encryption for biometric templates',
            'Dual authorization for template access',
            'Immutable audit logging of all operations',
            '4-hour breach notification procedures',
            'Network segmentation for biometric processing'
        ]
    },
    'government': {
        'name': 'Government/eID (FedRAMP Equivalent)',
        'requirements': [
            'FIPS 140-2 Level 3 cryptographic modules',
            'Multi-factor authentication for all access',
            'Real-time security monitoring and alerting',
            'Data sovereignty and residency compliance',
            'Continuous security assessment programs'
        ]
    },
    'consumer': {
        'name': 'Consumer/General (OWASP Baseline)',
        'requirements': [
            'Industry-standard encryption (AES-256)',
            'OAuth2 + API key authentication',
            'Regular security scanning and updates',
            'Privacy policy and consent mechanisms',
            'Incident response and notification procedures'
        ]
    }
}

# Active DOMAIN-AGNOSTIC default industry standards. Generic security baselines
# for any application type — no biometric/FAR/FRR/liveness/template specifics.
DEFAULT_INDUSTRY_STANDARDS = {
    'banking': {
        'name': 'Banking/Financial Services (PCI-DSS Equivalent)',
        'requirements': [
            'HSM-backed encryption for sensitive data at rest',
            'Dual authorization for privileged data access',
            'Immutable audit logging of all operations',
            '4-hour breach notification procedures',
            'Network segmentation for sensitive data processing'
        ]
    },
    'government': {
        'name': 'Government/eID (FedRAMP Equivalent)',
        'requirements': [
            'FIPS 140-2 Level 3 cryptographic modules',
            'Multi-factor authentication for all access',
            'Real-time security monitoring and alerting',
            'Data sovereignty and residency compliance',
            'Continuous security assessment programs'
        ]
    },
    'consumer': {
        'name': 'Consumer/General (OWASP Baseline)',
        'requirements': [
            'Industry-standard encryption (AES-256)',
            'OAuth2 + API key authentication',
            'Regular security scanning and updates',
            'Privacy policy and consent mechanisms',
            'Incident response and notification procedures'
        ]
    }
}

class SecurityChecklistGenerator:
    """
    Generate security checklists from analysis results
    """

    def __init__(self, analysis_file, project_name="Security Project", output_dir="security-analysis",
                 industry_standards=None):
        self.analysis_file = Path(analysis_file)
        self.project_name = project_name
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(exist_ok=True)

        # Security checklist templates for different industries. DOMAIN-AGNOSTIC
        # by default; pass `industry_standards` (e.g.
        # BIOMETRIC_EXAMPLE_INDUSTRY_STANDARDS) to specialize for an industry.
        self.industry_standards = industry_standards or DEFAULT_INDUSTRY_STANDARDS

        # OWASP Top 10 mapping to security categories
        self.owasp_categories = {
            'A01_2021_Broken_Access_Control': 'authorization',
            'A02_2021_Cryptographic_Failures': 'encryption',
            'A03_2021_Injection': 'validation',
            'A04_2021_Insecure_Design': 'architecture',
            'A05_2021_Security_Misconfiguration': 'infrastructure',
            'A06_2021_Vulnerable_Components': 'dependencies',
            'A07_2021_Identification_Authentication_Failures': 'authentication',
            'A08_2021_Software_Data_Integrity_Failures': 'validation',
            'A09_2021_Security_Logging_Monitoring_Failures': 'logging',
            'A10_2021_Server_Side_Request_Forgery': 'validation'
        }

    def load_analysis(self):
        """
        Load security analysis from JSON file
        """
        try:
            with open(self.analysis_file, 'r') as f:
                return json.load(f)
        except Exception as e:
            print(f"Error loading analysis file {self.analysis_file}: {e}")
            sys.exit(1)

    def generate_checklist_summary(self, analysis):
        """
        Generate summary section of checklist
        """
        stats = analysis['statistics']
        gate_assessment = analysis['gate_assessment']

        # Calculate status symbols
        status_symbol = {
            'PASS': '✅',
            'CONDITIONAL': '⚠️',
            'FAIL': '❌'
        }.get(gate_assessment['status'], '⚠️')

        # Generate category summary
        category_summary = []
        for category, count in stats['by_category'].items():
            category_name = category.replace('_', ' ').title()

            # Calculate pass/fail based on findings
            findings_for_category = [f for f in analysis['findings'] if f.get('category') == category]
            critical_count = len([f for f in findings_for_category if f.get('severity') == 'CRITICAL'])
            high_count = len([f for f in findings_for_category if f.get('severity') == 'HIGH'])
            total_checks = max(count, 5)  # Assume minimum 5 checks per category

            pass_count = max(0, total_checks - critical_count - high_count)
            fail_count = critical_count + high_count
            partial_count = 0  # Could be implemented based on medium severity issues

            category_summary.append({
                'category': category_name,
                'total': total_checks,
                'pass': pass_count,
                'fail': fail_count,
                'partial': partial_count,
                'na': 0
            })

        return {
            'overall_status': f"{status_symbol} {gate_assessment['status']}",
            'overall_message': gate_assessment.get('message', ''),
            'category_summary': category_summary,
            'critical_count': stats['by_severity'].get('CRITICAL', 0),
            'high_count': stats['by_severity'].get('HIGH', 0),
            'domain_critical': stats.get('domain_critical', 0)
        }

    def generate_detailed_evaluation(self, analysis):
        """
        Generate detailed security evaluation section
        """
        findings_by_category = {}

        # Group findings by category
        for finding in analysis['findings']:
            category = finding.get('category', 'infrastructure')
            if category not in findings_by_category:
                findings_by_category[category] = []
            findings_by_category[category].append(finding)

        detailed_sections = []

        for category, findings in findings_by_category.items():
            category_name = self.get_category_display_name(category)

            checks = []
            for i, finding in enumerate(findings[:10], 1):  # Limit to 10 per category
                status = '❌' if finding.get('severity') in ['CRITICAL', 'HIGH'] else '⚠️' if finding.get('severity') == 'MEDIUM' else '✅'
                source = finding.get('file', finding.get('url', 'N/A'))

                checks.append({
                    'number': f"{i}",
                    'check': finding.get('message', finding.get('title', finding.get('name', 'Unknown check'))),
                    'status': status,
                    'evidence': f"{finding.get('source', 'Manual')} - {source}",
                    'notes': f"Severity: {finding.get('severity', 'UNKNOWN')}, domain relevance: {finding.get('domain_relevance', 'low')}"
                })

            detailed_sections.append({
                'category': category_name,
                'checks': checks
            })

        return detailed_sections

    def get_category_display_name(self, category):
        """
        Convert category to display name
        """
        category_names = {
            'authentication': 'Authentication & Session Management',
            'authorization': 'Authorization & Access Control',
            'validation': 'Input Validation & Output Encoding',
            'encryption': 'Data Protection (encryption at rest + in transit)',
            'headers': 'Security Headers',
            'dependencies': 'Dependency Security (from SCA)',
            'api': 'API Security',
            'infrastructure': 'Infrastructure & Deployment',
            'logging': 'Logging & Monitoring',
            'compliance': 'Compliance-specific (GDPR/PCI-DSS/SOC2)'
        }
        return category_names.get(category, category.replace('_', ' ').title())

    def generate_remediation_section(self, analysis):
        """
        Generate failures and remediation section
        """
        remediation_plan = analysis['remediation_plan']
        remediation_items = []

        # Process blocking items
        for i, item in enumerate(remediation_plan['blocking_items'], 1):
            remediation_items.append({
                'number': str(i),
                'check': item['description'],
                'current_state': 'Vulnerable/Non-compliant',
                'required_fix': self.generate_fix_suggestion(item),
                'config_change': self.generate_config_suggestion(item),
                'effort': item.get('estimated_effort', '0.5 days')
            })

        # Process high priority items
        for i, item in enumerate(remediation_plan['high_priority'][:10], len(remediation_items) + 1):
            remediation_items.append({
                'number': str(i),
                'check': item['description'],
                'current_state': 'Needs improvement',
                'required_fix': self.generate_fix_suggestion(item),
                'config_change': self.generate_config_suggestion(item),
                'effort': item.get('estimated_effort', '0.25 days')
            })

        return remediation_items

    def generate_fix_suggestion(self, item):
        """
        Generate fix suggestion based on category and description
        """
        category = item.get('category', '')
        description = item.get('description', '').lower()

        if 'sql' in description or 'injection' in description:
            return 'Use parameterized queries/prepared statements'
        elif 'xss' in description or 'cross-site' in description:
            return 'Implement output encoding and CSP headers'
        elif 'password' in description or 'hash' in description:
            return 'Use bcrypt or Argon2 for password hashing'
        elif 'session' in description:
            return 'Configure secure session management'
        elif 'cors' in description:
            return 'Configure specific CORS origins, remove wildcards'
        elif 'header' in description:
            return 'Add security headers (CSP, X-Frame-Options, HSTS)'
        elif 'encrypt' in description or 'crypto' in description:
            return 'Implement AES-256-GCM encryption'
        elif 'template' in description:
            return 'Encrypt sensitive data payloads, prevent logging'
        elif 'gdpr' in description:
            return 'Implement applicable data-protection compliance measures'
        else:
            return 'Address security vulnerability according to best practices'

    def generate_config_suggestion(self, item):
        """
        Generate configuration change suggestion
        """
        category = item.get('category', '')
        description = item.get('description', '').lower()

        if 'cors' in description:
            return 'nginx.conf: add_header Access-Control-Allow-Origin "https://specific-domain.com"'
        elif 'header' in description and 'csp' in description:
            return 'Add CSP header: "default-src \'self\'; script-src \'self\'"'
        elif 'session' in description:
            return 'session.config: secure=true, httpOnly=true, sameSite=strict'
        elif 'ssl' in description or 'tls' in description:
            return 'nginx.conf: ssl_protocols TLSv1.3; ssl_ciphers ECDHE+AESGCM'
        elif 'template' in description:
            return 'app.config: encryption.algorithm=AES-256-GCM, logging.exclude=sensitive'
        elif 'database' in description:
            return 'database.config: ssl=true, encrypt=true, trustServerCertificate=false'
        else:
            return f'Update configuration for {category} security'

    def detect_industry_context(self, analysis):
        """
        Detect industry context from findings and generate appropriate requirements
        """
        findings_text = ' '.join([
            f.get('message', '') + ' ' + f.get('file', '') + ' ' + f.get('title', '')
            for f in analysis['findings']
        ]).lower()

        # Industry detection patterns
        if any(keyword in findings_text for keyword in ['bank', 'financial', 'payment', 'pci']):
            return 'banking'
        elif any(keyword in findings_text for keyword in ['government', 'gov', 'federal', 'fedramp']):
            return 'government'
        else:
            return 'consumer'

    def generate_industry_requirements(self, analysis, industry):
        """
        Generate industry-specific requirements section
        """
        requirements = self.industry_standards[industry]
        findings = analysis['findings']

        # Assess each requirement based on findings
        assessed_requirements = []
        for requirement in requirements['requirements']:
            # Simple pattern matching to assess compliance
            status = '✅'  # Default to pass, mark as fail if issues found

            # Check for relevant findings
            for finding in findings:
                if self.is_requirement_related(requirement, finding):
                    if finding.get('severity') in ['CRITICAL', 'HIGH']:
                        status = '❌'
                        break
                    elif finding.get('severity') == 'MEDIUM':
                        status = '⚠️'

            assessed_requirements.append({
                'requirement': requirement,
                'status': status
            })

        return {
            'industry_name': requirements['name'],
            'requirements': assessed_requirements
        }

    def is_requirement_related(self, requirement, finding):
        """
        Check if a finding is related to an industry requirement
        """
        requirement_lower = requirement.lower()
        finding_text = (
            finding.get('message', '') + ' ' +
            finding.get('title', '') + ' ' +
            finding.get('name', '')
        ).lower()

        # Simple keyword matching
        if 'hsm' in requirement_lower or 'encryption' in requirement_lower:
            return any(keyword in finding_text for keyword in ['encrypt', 'crypto', 'hsm', 'template'])
        elif 'dual authorization' in requirement_lower:
            return any(keyword in finding_text for keyword in ['auth', 'authorization', 'access'])
        elif 'audit' in requirement_lower or 'logging' in requirement_lower:
            return any(keyword in finding_text for keyword in ['log', 'audit', 'monitor'])
        elif 'network' in requirement_lower:
            return any(keyword in finding_text for keyword in ['network', 'cors', 'firewall'])

        return False

    def generate_gate_recommendation(self, analysis):
        """
        Generate Gate 6 recommendation section
        """
        gate_assessment = analysis['gate_assessment']
        remediation_plan = analysis['remediation_plan']

        blocking_issues = []
        if gate_assessment.get('blocking_issues'):
            for i, issue in enumerate(gate_assessment['blocking_issues'], 1):
                blocking_issues.append(f"{i}. {issue}")

        conditions = []
        if remediation_plan['blocking_items']:
            for item in remediation_plan['blocking_items'][:5]:  # Top 5
                conditions.append(f"- {item['description']} - {item.get('estimated_effort', 'TBD')}")

        timeline_days = int(remediation_plan['estimated_effort'].get('total_days', 3))
        expiry_date = datetime.now().strftime('%Y-%m-%d')  # Simplified - would add timeline_days

        return {
            'status': gate_assessment['status'],
            'blocking_issues': blocking_issues,
            'conditions': conditions,
            'timeline': f"{timeline_days} days",
            'expiry_date': expiry_date,
            'total_effort': f"{remediation_plan['estimated_effort'].get('total_days', 0):.1f} days"
        }

    def generate_checklist_report(self):
        """
        Generate complete security checklist report
        """
        print("📋 Generating security checklist report...")

        # Load analysis
        analysis = self.load_analysis()

        # Generate sections
        summary = self.generate_checklist_summary(analysis)
        detailed_evaluation = self.generate_detailed_evaluation(analysis)
        remediation_items = self.generate_remediation_section(analysis)

        # Detect industry context
        industry = self.detect_industry_context(analysis)
        industry_requirements = self.generate_industry_requirements(analysis, industry)

        # Generate gate recommendation
        gate_recommendation = self.generate_gate_recommendation(analysis)

        # Build complete report
        report_date = datetime.now().strftime('%Y-%m-%d')
        report = self.build_markdown_report(
            report_date, summary, detailed_evaluation, remediation_items,
            industry_requirements, gate_recommendation, analysis
        )

        # Save report
        report_file = self.output_dir / f'security-checklist-{report_date}.md'
        with open(report_file, 'w') as f:
            f.write(report)

        print(f"✅ Security checklist generated: {report_file}")

        # Generate CSV for project management integration
        self.generate_csv_export(remediation_items, analysis)

        return str(report_file)

    def build_markdown_report(self, report_date, summary, detailed_evaluation,
                            remediation_items, industry_requirements,
                            gate_recommendation, analysis):
        """
        Build complete markdown report
        """
        report = f"""# Security Checklist Evaluation: {self.project_name} — {report_date}

## Overall Status: {summary['overall_status']}

> {summary['overall_message']}

## Summary

| Category | Total | ✅ Pass | ❌ Fail | ⚠️ Partial | N/A |
|----------|-------|---------|---------|------------|-----|"""

        for cat in summary['category_summary']:
            report += f"\n| {cat['category']} | {cat['total']} | {cat['pass']} | {cat['fail']} | {cat['partial']} | {cat['na']} |"

        report += f"""

**Critical Issues**: {summary['critical_count']} | **High Issues**: {summary['high_count']} | **Domain-Relevant Critical**: {summary['domain_critical']}

## Detailed Evaluation

"""

        # Add detailed sections
        for section in detailed_evaluation:
            report += f"""### {section['category']}

| # | Check | Status | Evidence | Notes |
|---|-------|--------|----------|-------|"""

            for check in section['checks']:
                report += f"\n| {check['number']} | {check['check']} | {check['status']} | {check['evidence']} | {check['notes']} |"

            report += "\n\n"

        # Add remediation section
        if remediation_items:
            report += f"""## Failures & Remediation

| # | Check | Current State | Required Fix | Config/Code Change | Effort |
|---|-------|---------------|-------------|-------------------|--------|"""

            for item in remediation_items[:15]:  # Limit to top 15
                report += f"\n| {item['number']} | {item['check']} | {item['current_state']} | {item['required_fix']} | {item['config_change']} | {item['effort']} |"

        # Add industry requirements
        report += f"""

## Industry-Specific Requirements ({industry_requirements['industry_name']})

"""
        for req in industry_requirements['requirements']:
            report += f"- {req['status']} {req['requirement']}\n"

        # Add gate recommendation
        report += f"""

## Gate 6 Recommendation: {gate_recommendation['status']}

"""

        if gate_recommendation['blocking_issues']:
            report += "**Blocking Issues (must be fixed before production):**\n"
            for issue in gate_recommendation['blocking_issues']:
                report += f"{issue}\n"

        if gate_recommendation['conditions']:
            report += "\n**Conditions for Production Deployment:**\n"
            for condition in gate_recommendation['conditions']:
                report += f"{condition}\n"

        report += f"""
**Timeline**: {gate_recommendation['timeline']}
**Total Effort**: {gate_recommendation['total_effort']}
**Owner**: Security Team + R&D Lead

---

*Generated by LIDR Security Checklist Automation v1.1.0*
*Source: {self.analysis_file.name}*
*Total findings analyzed: {analysis['total_findings']}*
"""

        return report

    def generate_csv_export(self, remediation_items, analysis):
        """
        Generate CSV export for the configured tracking tool ({TRACKING_TOOL})
        """
        csv_file = self.output_dir / f'security-remediation-{datetime.now().strftime("%Y%m%d")}.csv'

        with open(csv_file, 'w') as f:
            f.write('Issue ID,Description,Severity,Category,Current State,Required Fix,Estimated Effort,Owner,Status\n')

            for i, item in enumerate(remediation_items, 1):
                issue_id = f"SEC-{i:03d}"
                description = item['check'].replace(',', ';')  # Escape commas
                severity = 'Critical' if 'Critical' in item.get('check', '') else 'High'
                category = item.get('category', 'Security')
                current_state = item.get('current_state', 'Vulnerable')
                required_fix = item['required_fix'].replace(',', ';')
                effort = item.get('effort', 'TBD')
                owner = 'Security Team'
                status = 'Open'

                f.write(f'{issue_id},"{description}",{severity},{category},"{current_state}","{required_fix}",{effort},{owner},{status}\n')

        print(f"📊 CSV export generated for {TRACKING_TOOL}: {csv_file}")

def main():
    parser = argparse.ArgumentParser(description='Security Checklist Generator for software projects')
    parser.add_argument('--analysis-file', required=True, help='Security analysis JSON file')
    parser.add_argument('--project-name', default='Security Project', help='Project name for report')
    parser.add_argument('--output-dir', default='security-analysis', help='Output directory for reports')
    parser.add_argument('--verbose', action='store_true', help='Verbose output')

    args = parser.parse_args()

    if args.verbose:
        print(f"Analysis file: {args.analysis_file}")
        print(f"Project name: {args.project_name}")
        print(f"Output directory: {args.output_dir}")

    # Generate checklist
    generator = SecurityChecklistGenerator(args.analysis_file, args.project_name, args.output_dir)
    report_file = generator.generate_checklist_report()

    print(f"\n📋 Security Checklist Report: {report_file}")

if __name__ == '__main__':
    main()