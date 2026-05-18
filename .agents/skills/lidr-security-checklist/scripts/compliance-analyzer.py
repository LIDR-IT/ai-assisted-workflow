#!/usr/bin/env python3
"""
Security Compliance Analyzer for {{CLIENT_NAME}} domain-specific Projects
Automated SAST/SCA/DAST analysis with GDPR Art. 9 compliance validation

Transforms 4+ hours manual security analysis into 5-minute automated workflow.
Follows proven patterns from tech-debt and validate-requirements automation.

Author: {{CLIENT_NAME}} SDLC Automation
Version: 1.0.0
"""

import json
import argparse
import os
import sys
import glob
from datetime import datetime
from pathlib import Path
import re
import subprocess

class SecurityComplianceAnalyzer:
    """
    Automated security analysis for domain-specific platforms
    """

    def __init__(self, project_dir=".", output_dir="security-analysis"):
        self.project_dir = Path(project_dir)
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(exist_ok=True)

        # domain-specific domain rules - {{CLIENT_NAME}} specific
        self.domain-specific_patterns = {
            'template_encryption': [
                r'AES-256-GCM', r'HSM', r'template.*encrypt',
                r'domain-specific.*encrypt', r'encrypt.*template'
            ],
            'gdpr_art9_compliance': [
                r'consent.*domain-specific', r'data.*subject.*rights',
                r'deletion.*template', r'gdpr.*domain-specific',
                r'special.*category.*data'
            ],
            'template_exposure': [
                r'log.*template', r'console.*template',
                r'debug.*domain-specific', r'template.*plain',
                r'domain-specific.*log'
            ],
            'api_security': [
                r'oauth2.*domain-specific', r'rate.*limit.*domain-specific',
                r'auth.*template', r'domain-specific.*endpoint'
            ],
            'liveness_detection': [
                r'liveness.*detection', r'anti.*spoofing',
                r'presentation.*attack', r'3d.*liveness'
            ]
        }

        # Security categorization mapping
        self.security_categories = {
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

        # Severity levels for remediation priority
        self.severity_weights = {
            'CRITICAL': 100,
            'HIGH': 75,
            'MEDIUM': 50,
            'LOW': 25,
            'INFO': 10
        }

    def discover_security_reports(self):
        """
        Auto-discover security scan reports in project directory
        """
        reports = {
            'sast': [],
            'sca': [],
            'dast': [],
            'infrastructure': [],
            'configs': []
        }

        # Common file patterns for security reports
        scan_patterns = {
            'sast': ['**/sonarqube*.json', '**/sonar*.json', '**/semgrep*.json', '**/checkmarx*.json'],
            'sca': ['**/snyk*.json', '**/npm-audit*.json', '**/safety*.json', '**/owasp-dependency*.json'],
            'dast': ['**/zap*.json', '**/burp*.json', '**/nuclei*.json', '**/nessus*.xml'],
            'infrastructure': ['**/nginx.conf', '**/apache*.conf', '**/*.k8s.yaml', '**/docker-compose*.yml'],
            'configs': ['**/package.json', '**/requirements.txt', '**/Dockerfile', '**/.env.example']
        }

        for scan_type, patterns in scan_patterns.items():
            for pattern in patterns:
                matches = list(self.project_dir.glob(pattern))
                reports[scan_type].extend(matches)

        return reports

    def parse_sonarqube_results(self, report_file):
        """
        Parse SonarQube SAST results with domain-specific domain focus
        """
        try:
            with open(report_file, 'r') as f:
                data = json.load(f)

            issues = []

            # Handle different SonarQube export formats
            if 'issues' in data:
                raw_issues = data['issues']
            elif 'components' in data:
                raw_issues = data.get('issues', [])
            else:
                raw_issues = data if isinstance(data, list) else []

            for issue in raw_issues:
                severity = issue.get('severity', 'MEDIUM')
                rule = issue.get('rule', 'unknown')
                message = issue.get('message', '')
                component = issue.get('component', '')

                # domain-specific domain categorization
                category = self.categorize_security_issue(rule, message, component)
                domain-specific_relevance = self.assess_domain-specific_relevance(rule, message, component)

                processed_issue = {
                    'source': 'SAST',
                    'tool': 'SonarQube',
                    'severity': severity,
                    'rule': rule,
                    'message': message,
                    'file': component,
                    'line': issue.get('line', 0),
                    'category': category,
                    'domain-specific_relevance': domain-specific_relevance,
                    'remediation_priority': self.calculate_priority(severity, domain-specific_relevance)
                }
                issues.append(processed_issue)

            return issues

        except Exception as e:
            print(f"Warning: Could not parse SonarQube report {report_file}: {e}")
            return []

    def parse_snyk_results(self, report_file):
        """
        Parse Snyk SCA results for dependency vulnerabilities
        """
        try:
            with open(report_file, 'r') as f:
                data = json.load(f)

            vulnerabilities = []

            # Handle Snyk JSON format
            if 'vulnerabilities' in data:
                raw_vulns = data['vulnerabilities']
            else:
                raw_vulns = data if isinstance(data, list) else []

            for vuln in raw_vulns:
                severity = vuln.get('severity', 'medium').upper()
                package_name = vuln.get('packageName', 'unknown')
                title = vuln.get('title', '')

                processed_vuln = {
                    'source': 'SCA',
                    'tool': 'Snyk',
                    'severity': severity,
                    'package': package_name,
                    'title': title,
                    'cve': vuln.get('identifiers', {}).get('CVE', []),
                    'category': 'dependencies',
                    'domain-specific_relevance': 'high' if any(pkg in package_name.lower()
                                                        for pkg in ['crypto', 'auth', 'security', 'jwt']) else 'medium',
                    'remediation_priority': self.calculate_priority(severity, 'high' if 'crypto' in package_name.lower() else 'medium')
                }
                vulnerabilities.append(processed_vuln)

            return vulnerabilities

        except Exception as e:
            print(f"Warning: Could not parse Snyk report {report_file}: {e}")
            return []

    def parse_zap_results(self, report_file):
        """
        Parse OWASP ZAP DAST results
        """
        try:
            with open(report_file, 'r') as f:
                data = json.load(f)

            alerts = []

            # Handle ZAP JSON format
            if 'site' in data:
                raw_alerts = data['site'][0].get('alerts', [])
            else:
                raw_alerts = data.get('alerts', [])

            for alert in raw_alerts:
                risk = alert.get('riskdesc', 'Medium').split()[0].upper()
                name = alert.get('name', '')

                processed_alert = {
                    'source': 'DAST',
                    'tool': 'OWASP ZAP',
                    'severity': risk,
                    'name': name,
                    'description': alert.get('desc', ''),
                    'url': alert.get('url', ''),
                    'category': self.categorize_dast_finding(name),
                    'domain-specific_relevance': self.assess_api_relevance(alert.get('url', '')),
                    'remediation_priority': self.calculate_priority(risk, self.assess_api_relevance(alert.get('url', '')))
                }
                alerts.append(processed_alert)

            return alerts

        except Exception as e:
            print(f"Warning: Could not parse ZAP report {report_file}: {e}")
            return []

    def categorize_security_issue(self, rule, message, component):
        """
        Categorize security issues using rule patterns and domain-specific domain knowledge
        """
        rule_lower = rule.lower()
        message_lower = message.lower()

        if any(keyword in rule_lower for keyword in ['auth', 'session', 'password', 'credential']):
            return 'authentication'
        elif any(keyword in rule_lower for keyword in ['permission', 'access', 'authorization', 'rbac']):
            return 'authorization'
        elif any(keyword in rule_lower for keyword in ['injection', 'xss', 'validation', 'sanitiz']):
            return 'validation'
        elif any(keyword in rule_lower for keyword in ['encrypt', 'crypto', 'tls', 'ssl', 'hash']):
            return 'encryption'
        elif any(keyword in rule_lower for keyword in ['header', 'cors', 'csp']):
            return 'headers'
        elif any(keyword in rule_lower for keyword in ['log', 'audit', 'monitor']):
            return 'logging'
        elif any(keyword in rule_lower for keyword in ['api', 'endpoint', 'rest']):
            return 'api'
        else:
            return 'infrastructure'

    def assess_domain-specific_relevance(self, rule, message, component):
        """
        Assess domain-specific relevance for prioritization
        """
        text = f"{rule} {message} {component}".lower()

        # Critical domain-specific patterns
        for pattern_type, patterns in self.domain-specific_patterns.items():
            for pattern in patterns:
                if re.search(pattern, text, re.IGNORECASE):
                    if pattern_type in ['template_exposure', 'gdpr_art9_compliance']:
                        return 'critical'
                    elif pattern_type in ['template_encryption', 'api_security']:
                        return 'high'
                    else:
                        return 'medium'

        return 'low'

    def categorize_dast_finding(self, finding_name):
        """
        Categorize DAST findings
        """
        finding_lower = finding_name.lower()

        if any(keyword in finding_lower for keyword in ['sql injection', 'command injection', 'ldap injection']):
            return 'validation'
        elif any(keyword in finding_lower for keyword in ['xss', 'cross-site scripting']):
            return 'validation'
        elif any(keyword in finding_lower for keyword in ['ssl', 'tls', 'certificate', 'encryption']):
            return 'encryption'
        elif any(keyword in finding_lower for keyword in ['header', 'cors', 'csp']):
            return 'headers'
        elif any(keyword in finding_lower for keyword in ['authentication', 'session', 'cookie']):
            return 'authentication'
        else:
            return 'api'

    def assess_api_relevance(self, url):
        """
        Assess if API endpoint is domain-specific-related
        """
        url_lower = url.lower()
        domain-specific_endpoints = ['domain-specific', 'template', 'face', 'voice', 'selph', 'liveness', 'verification']

        for endpoint in domain-specific_endpoints:
            if endpoint in url_lower:
                return 'critical'

        if any(keyword in url_lower for keyword in ['api', 'v1', 'v2', 'auth']):
            return 'high'

        return 'medium'

    def calculate_priority(self, severity, domain-specific_relevance):
        """
        Calculate remediation priority score
        """
        severity_score = self.severity_weights.get(severity, 25)

        relevance_multiplier = {
            'critical': 2.0,
            'high': 1.5,
            'medium': 1.0,
            'low': 0.7
        }.get(domain-specific_relevance, 1.0)

        return int(severity_score * relevance_multiplier)

    def generate_security_analysis(self, reports):
        """
        Generate comprehensive security analysis
        """
        all_findings = []

        # Process SAST reports
        for sast_report in reports['sast']:
            findings = self.parse_sonarqube_results(sast_report)
            all_findings.extend(findings)

        # Process SCA reports
        for sca_report in reports['sca']:
            findings = self.parse_snyk_results(sca_report)
            all_findings.extend(findings)

        # Process DAST reports
        for dast_report in reports['dast']:
            findings = self.parse_zap_results(dast_report)
            all_findings.extend(findings)

        # Sort by priority score (highest first)
        all_findings.sort(key=lambda x: x['remediation_priority'], reverse=True)

        # Generate statistics
        stats = self.calculate_statistics(all_findings)

        # Generate analysis summary
        analysis = {
            'timestamp': datetime.now().isoformat(),
            'project_dir': str(self.project_dir),
            'total_findings': len(all_findings),
            'statistics': stats,
            'findings': all_findings,
            'gate_assessment': self.assess_gate_readiness(all_findings, stats),
            'remediation_plan': self.generate_remediation_plan(all_findings)
        }

        return analysis

    def calculate_statistics(self, findings):
        """
        Calculate security statistics for summary
        """
        stats = {
            'by_severity': {},
            'by_category': {},
            'by_source': {},
            'domain-specific_critical': 0,
            'gdpr_compliance_issues': 0,
            'api_security_issues': 0
        }

        for finding in findings:
            # By severity
            severity = finding.get('severity', 'UNKNOWN')
            stats['by_severity'][severity] = stats['by_severity'].get(severity, 0) + 1

            # By category
            category = finding.get('category', 'unknown')
            stats['by_category'][category] = stats['by_category'].get(category, 0) + 1

            # By source
            source = finding.get('source', 'unknown')
            stats['by_source'][source] = stats['by_source'].get(source, 0) + 1

            # Special domain-specific counters
            if finding.get('domain-specific_relevance') == 'critical':
                stats['domain-specific_critical'] += 1

            if 'gdpr' in finding.get('message', '').lower() or 'domain-specific' in finding.get('message', '').lower():
                stats['gdpr_compliance_issues'] += 1

            if finding.get('category') == 'api' and finding.get('domain-specific_relevance') in ['critical', 'high']:
                stats['api_security_issues'] += 1

        return stats

    def assess_gate_readiness(self, findings, stats):
        """
        Assess Gate 6 readiness based on security findings
        """
        critical_count = stats['by_severity'].get('CRITICAL', 0)
        high_count = stats['by_severity'].get('HIGH', 0)
        domain-specific_critical = stats['domain-specific_critical']

        # Gate 6 criteria
        blocking_issues = []

        if critical_count > 0:
            blocking_issues.append(f"{critical_count} Critical severity issues")

        if domain-specific_critical > 0:
            blocking_issues.append(f"{domain-specific_critical} Critical domain-specific security issues")

        if stats['gdpr_compliance_issues'] > 0:
            blocking_issues.append(f"{stats['gdpr_compliance_issues']} GDPR compliance violations")

        # Determine gate status
        if len(blocking_issues) == 0:
            if high_count <= 2:
                gate_status = 'PASS'
                gate_message = 'All critical security requirements met'
            else:
                gate_status = 'CONDITIONAL'
                gate_message = f'{high_count} High severity issues require review'
        else:
            gate_status = 'FAIL'
            gate_message = f"Blocking issues: {'; '.join(blocking_issues)}"

        return {
            'status': gate_status,
            'message': gate_message,
            'blocking_issues': blocking_issues,
            'critical_count': critical_count,
            'high_count': high_count,
            'domain-specific_critical': domain-specific_critical
        }

    def generate_remediation_plan(self, findings):
        """
        Generate prioritized remediation plan
        """
        # Group findings by priority
        critical_findings = [f for f in findings if f['severity'] == 'CRITICAL' or f['domain-specific_relevance'] == 'critical']
        high_findings = [f for f in findings if f['severity'] == 'HIGH' or f['domain-specific_relevance'] == 'high']

        remediation_plan = {
            'blocking_items': [],
            'high_priority': [],
            'estimated_effort': {
                'critical': len(critical_findings) * 0.5,  # 0.5 days per critical issue
                'high': len(high_findings) * 0.25,         # 0.25 days per high issue
                'total_days': (len(critical_findings) * 0.5) + (len(high_findings) * 0.25)
            }
        }

        # Critical/blocking items
        for finding in critical_findings[:10]:  # Top 10 critical
            remediation_plan['blocking_items'].append({
                'description': finding.get('message', finding.get('title', finding.get('name', 'Unknown issue'))),
                'category': finding.get('category', 'unknown'),
                'severity': finding.get('severity', 'UNKNOWN'),
                'source': finding.get('source', 'unknown'),
                'file': finding.get('file', finding.get('url', 'unknown')),
                'estimated_effort': '0.5 days'
            })

        # High priority items
        for finding in high_findings[:15]:  # Top 15 high priority
            remediation_plan['high_priority'].append({
                'description': finding.get('message', finding.get('title', finding.get('name', 'Unknown issue'))),
                'category': finding.get('category', 'unknown'),
                'severity': finding.get('severity', 'UNKNOWN'),
                'source': finding.get('source', 'unknown'),
                'file': finding.get('file', finding.get('url', 'unknown')),
                'estimated_effort': '0.25 days'
            })

        return remediation_plan

    def run_analysis(self):
        """
        Execute complete security analysis workflow
        """
        print("🔍 Starting security compliance analysis...")

        # Auto-discover security reports
        reports = self.discover_security_reports()

        print(f"📊 Found reports:")
        for report_type, files in reports.items():
            print(f"  - {report_type.upper()}: {len(files)} files")

        # Generate analysis
        analysis = self.generate_security_analysis(reports)

        # Save JSON results
        json_file = self.output_dir / 'security-analysis.json'
        with open(json_file, 'w') as f:
            json.dump(analysis, f, indent=2)

        print(f"✅ Analysis complete:")
        print(f"   Total findings: {analysis['total_findings']}")
        print(f"   Gate 6 status: {analysis['gate_assessment']['status']}")
        print(f"   Critical issues: {analysis['statistics']['by_severity'].get('CRITICAL', 0)}")
        print(f"   domain-specific critical: {analysis['statistics']['domain-specific_critical']}")
        print(f"📊 JSON output: {json_file}")

        return analysis

def main():
    parser = argparse.ArgumentParser(description='Security Compliance Analyzer for {{CLIENT_NAME}} domain-specific Projects')
    parser.add_argument('--project-dir', default='.', help='Project directory to analyze')
    parser.add_argument('--output-dir', default='security-analysis', help='Output directory for results')
    parser.add_argument('--verbose', action='store_true', help='Verbose output')

    args = parser.parse_args()

    if args.verbose:
        print(f"Project directory: {args.project_dir}")
        print(f"Output directory: {args.output_dir}")

    # Run analysis
    analyzer = SecurityComplianceAnalyzer(args.project_dir, args.output_dir)
    analysis = analyzer.run_analysis()

    # Print summary
    print(f"\n🎯 Security Analysis Summary:")
    print(f"   Status: {analysis['gate_assessment']['status']}")
    print(f"   Message: {analysis['gate_assessment']['message']}")

    if analysis['gate_assessment']['blocking_issues']:
        print(f"   Blocking issues:")
        for issue in analysis['gate_assessment']['blocking_issues']:
            print(f"     - {issue}")

    print(f"\n⏱️  Estimated remediation time: {analysis['remediation_plan']['estimated_effort']['total_days']:.1f} days")

if __name__ == '__main__':
    main()