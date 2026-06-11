#!/usr/bin/env python3
"""
Security Compliance Analyzer for generic software projects
Automated SAST/SCA/DAST analysis with gate-readiness and compliance scoring.

Transforms 4+ hours of manual security analysis into a 5-minute automated workflow.
Follows proven patterns from tech-debt and validate-requirements automation.

Domain configuration is DOMAIN-AGNOSTIC by default. LIDR is a multi-industry
framework, so the built-in pattern set is a generic security baseline (risk,
test, dependency and security patterns). To target a specific industry, point
LIDR_DOMAIN_PATTERNS_FILE at an override JSON.

An overridable EXAMPLE industry pack (biometric identity) is preserved below as
the BIOMETRIC_EXAMPLE_* constants and as a sibling file
`compliance-analyzer.biometric-example.json` (same schema as any override). It is
an example only — NOT the active default.

Author: LIDR SDLC Automation
Version: 1.1.0
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

# Tool names used as output labels / format identifiers. Read from the
# environment with the current tool as the default so existing behavior is
# preserved byte-for-byte. Override via env to point at a different scanner.
SAST_TOOL = os.getenv("LIDR_SAST_TOOL", "SonarQube")
SCA_TOOL = os.getenv("LIDR_SCA_TOOL", "Snyk")
DAST_TOOL = os.getenv("LIDR_DAST_TOOL", "OWASP ZAP")

# Optional path to a JSON file providing an industry-specific override for the
# domain pattern set and/or the domain endpoint keywords. LIDR is a
# multi-industry framework, so the built-in defaults below are DOMAIN-AGNOSTIC
# (a generic security baseline). When the env var is unset (or the file is
# missing/invalid) the built-in defaults are used.
#
# Expected JSON shape (all keys optional):
#   {
#     "domain_patterns": { "<category>": ["<regex>", ...], ... },
#     "domain_endpoint_keywords": ["<keyword>", ...]
#   }
DOMAIN_PATTERNS_FILE = os.getenv("LIDR_DOMAIN_PATTERNS_FILE", "")

# Default domain pattern set — DOMAIN-AGNOSTIC generic security baseline.
# These categories and regexes target sensitive-data handling, secrets, access
# control, injection and API exposure for ANY application. The matching
# MECHANISM (regex search in assess_domain_relevance) is industry-independent.
# Override via LIDR_DOMAIN_PATTERNS_FILE to target a specific industry.
DEFAULT_DOMAIN_PATTERNS = {
    'data_encryption': [
        r'AES-256', r'HSM', r'encrypt.*at.*rest',
        r'encrypt.*in.*transit', r'key.*management'
    ],
    'data_protection_compliance': [
        r'consent.*management', r'data.*subject.*rights',
        r'data.*deletion', r'data.*retention',
        r'personal.*data', r'sensitive.*data'
    ],
    'sensitive_data_exposure': [
        r'log.*secret', r'console.*token',
        r'debug.*password', r'plaintext.*credential',
        r'hardcoded.*secret'
    ],
    'api_security': [
        r'oauth2', r'rate.*limit',
        r'auth.*token', r'unauthenticated.*endpoint'
    ],
    'access_control': [
        r'broken.*access', r'privilege.*escalation',
        r'insecure.*direct.*object', r'missing.*authorization'
    ]
}

# Default domain endpoint keywords — DOMAIN-AGNOSTIC generic baseline.
# Used to flag whether a DAST-scanned URL touches a sensitive endpoint.
DEFAULT_DOMAIN_ENDPOINT_KEYWORDS = [
    'admin', 'auth', 'login', 'account', 'user',
    'payment', 'token', 'session'
]

# ---------------------------------------------------------------------------
# OVERRIDABLE EXAMPLE — biometric-identity industry pack.
#
# This is an EXAMPLE of an industry override, NOT the active default. It mirrors
# the schema accepted by load_domain_config / LIDR_DOMAIN_PATTERNS_FILE. The
# same content is also shipped as the sibling JSON file
# `compliance-analyzer.biometric-example.json` so it can be passed via env:
#
#   LIDR_DOMAIN_PATTERNS_FILE=.../compliance-analyzer.biometric-example.json
#
# Or imported in code: load_domain_config(...) accepts the same shape.
# ---------------------------------------------------------------------------
BIOMETRIC_EXAMPLE_DOMAIN_PATTERNS = {
    'template_encryption': [
        r'AES-256-GCM', r'HSM', r'template.*encrypt',
        r'biometric.*encrypt', r'encrypt.*template'
    ],
    'gdpr_art9_compliance': [
        r'consent.*biometric', r'data.*subject.*rights',
        r'deletion.*template', r'gdpr.*biometric',
        r'special.*category.*data'
    ],
    'template_exposure': [
        r'log.*template', r'console.*template',
        r'debug.*biometric', r'template.*plain',
        r'biometric.*log'
    ],
    'api_security': [
        r'oauth2.*biometric', r'rate.*limit.*biometric',
        r'auth.*template', r'biometric.*endpoint'
    ],
    'liveness_detection': [
        r'liveness.*detection', r'anti.*spoofing',
        r'presentation.*attack', r'3d.*liveness'
    ]
}

BIOMETRIC_EXAMPLE_DOMAIN_ENDPOINT_KEYWORDS = [
    'biometric', 'template', 'face', 'voice', 'selph',
    'liveness', 'verification'
]


def load_domain_config(config_path):
    """
    Load an optional industry-pack override from a JSON file.

    Returns a (domain_patterns, domain_endpoint_keywords) tuple. Falls back to
    the built-in generic defaults for any key that is absent, the file being
    unset, or the file being missing/invalid — so default behavior is fully
    preserved.
    """
    domain_patterns = dict(DEFAULT_DOMAIN_PATTERNS)
    domain_endpoint_keywords = list(DEFAULT_DOMAIN_ENDPOINT_KEYWORDS)

    if not config_path:
        return domain_patterns, domain_endpoint_keywords

    try:
        with open(config_path, 'r') as f:
            override = json.load(f)
        if isinstance(override.get('domain_patterns'), dict):
            domain_patterns = override['domain_patterns']
        if isinstance(override.get('domain_endpoint_keywords'), list):
            domain_endpoint_keywords = override['domain_endpoint_keywords']
    except Exception as e:
        print(f"Warning: Could not load domain config {config_path}: {e}")

    return domain_patterns, domain_endpoint_keywords

class SecurityComplianceAnalyzer:
    """
    Automated security analysis for generic software platforms
    """

    def __init__(self, project_dir=".", output_dir="security-analysis"):
        self.project_dir = Path(project_dir)
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(exist_ok=True)

        # Domain matching rules (neutral name). Concrete set is the generic,
        # DOMAIN-AGNOSTIC default — see DEFAULT_DOMAIN_PATTERNS above. Provide
        # LIDR_DOMAIN_PATTERNS_FILE (e.g. the biometric example sidecar) to swap
        # industries without code edits; the matching mechanism in
        # assess_domain_relevance is unchanged.
        self.domain_patterns, self.domain_endpoint_keywords = load_domain_config(
            DOMAIN_PATTERNS_FILE
        )

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
        Parse SAST results with a domain-relevance focus
        """
        try:
            with open(report_file, 'r') as f:
                data = json.load(f)

            issues = []

            # Handle different SAST tool export formats
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

                # Domain-relevance categorization
                category = self.categorize_security_issue(rule, message, component)
                domain_relevance = self.assess_domain_relevance(rule, message, component)

                processed_issue = {
                    'source': 'SAST',
                    'tool': SAST_TOOL,
                    'severity': severity,
                    'rule': rule,
                    'message': message,
                    'file': component,
                    'line': issue.get('line', 0),
                    'category': category,
                    'domain_relevance': domain_relevance,
                    'remediation_priority': self.calculate_priority(severity, domain_relevance)
                }
                issues.append(processed_issue)

            return issues

        except Exception as e:
            print(f"Warning: Could not parse {SAST_TOOL} report {report_file}: {e}")
            return []

    def parse_snyk_results(self, report_file):
        """
        Parse SCA results for dependency vulnerabilities
        """
        try:
            with open(report_file, 'r') as f:
                data = json.load(f)

            vulnerabilities = []

            # Handle SCA tool JSON format
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
                    'tool': SCA_TOOL,
                    'severity': severity,
                    'package': package_name,
                    'title': title,
                    'cve': vuln.get('identifiers', {}).get('CVE', []),
                    'category': 'dependencies',
                    'domain_relevance': 'high' if any(pkg in package_name.lower()
                                                        for pkg in ['crypto', 'auth', 'security', 'jwt']) else 'medium',
                    'remediation_priority': self.calculate_priority(severity, 'high' if 'crypto' in package_name.lower() else 'medium')
                }
                vulnerabilities.append(processed_vuln)

            return vulnerabilities

        except Exception as e:
            print(f"Warning: Could not parse {SCA_TOOL} report {report_file}: {e}")
            return []

    def parse_zap_results(self, report_file):
        """
        Parse DAST results
        """
        try:
            with open(report_file, 'r') as f:
                data = json.load(f)

            alerts = []

            # Handle DAST tool JSON format
            if 'site' in data:
                raw_alerts = data['site'][0].get('alerts', [])
            else:
                raw_alerts = data.get('alerts', [])

            for alert in raw_alerts:
                risk = alert.get('riskdesc', 'Medium').split()[0].upper()
                name = alert.get('name', '')

                processed_alert = {
                    'source': 'DAST',
                    'tool': DAST_TOOL,
                    'severity': risk,
                    'name': name,
                    'description': alert.get('desc', ''),
                    'url': alert.get('url', ''),
                    'category': self.categorize_dast_finding(name),
                    'domain_relevance': self.assess_api_relevance(alert.get('url', '')),
                    'remediation_priority': self.calculate_priority(risk, self.assess_api_relevance(alert.get('url', '')))
                }
                alerts.append(processed_alert)

            return alerts

        except Exception as e:
            print(f"Warning: Could not parse {DAST_TOOL} report {report_file}: {e}")
            return []

    def categorize_security_issue(self, rule, message, component):
        """
        Categorize security issues using rule patterns and domain knowledge
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

    def assess_domain_relevance(self, rule, message, component):
        """
        Assess domain relevance for prioritization
        """
        text = f"{rule} {message} {component}".lower()

        # Critical domain patterns (from the configured/overridable pattern set)
        for pattern_type, patterns in self.domain_patterns.items():
            for pattern in patterns:
                if re.search(pattern, text, re.IGNORECASE):
                    if pattern_type in ['sensitive_data_exposure', 'data_protection_compliance',
                                        'template_exposure', 'gdpr_art9_compliance']:
                        return 'critical'
                    elif pattern_type in ['data_encryption', 'access_control', 'api_security',
                                          'template_encryption']:
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
        Assess whether an API endpoint is domain-relevant.

        Endpoint keywords come from the configured/overridable industry pack
        (self.domain_endpoint_keywords); the default set is domain-agnostic.
        """
        url_lower = url.lower()

        for endpoint in self.domain_endpoint_keywords:
            if endpoint in url_lower:
                return 'critical'

        if any(keyword in url_lower for keyword in ['api', 'v1', 'v2', 'auth']):
            return 'high'

        return 'medium'

    def calculate_priority(self, severity, domain_relevance):
        """
        Calculate remediation priority score
        """
        severity_score = self.severity_weights.get(severity, 25)

        relevance_multiplier = {
            'critical': 2.0,
            'high': 1.5,
            'medium': 1.0,
            'low': 0.7
        }.get(domain_relevance, 1.0)

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
            'domain_critical': 0,
            'compliance_issues': 0,
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

            # Special domain-relevance counters
            if finding.get('domain_relevance') == 'critical':
                stats['domain_critical'] += 1

            message_lower = finding.get('message', '').lower()
            if 'gdpr' in message_lower or 'compliance' in message_lower or 'personal data' in message_lower:
                stats['compliance_issues'] += 1

            if finding.get('category') == 'api' and finding.get('domain_relevance') in ['critical', 'high']:
                stats['api_security_issues'] += 1

        return stats

    def assess_gate_readiness(self, findings, stats):
        """
        Assess Gate 6 readiness based on security findings
        """
        critical_count = stats['by_severity'].get('CRITICAL', 0)
        high_count = stats['by_severity'].get('HIGH', 0)
        domain_critical = stats['domain_critical']

        # Gate 6 criteria
        blocking_issues = []

        if critical_count > 0:
            blocking_issues.append(f"{critical_count} Critical severity issues")

        if domain_critical > 0:
            blocking_issues.append(f"{domain_critical} Critical domain-relevant security issues")

        if stats['compliance_issues'] > 0:
            blocking_issues.append(f"{stats['compliance_issues']} compliance violations")

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
            'domain_critical': domain_critical
        }

    def generate_remediation_plan(self, findings):
        """
        Generate prioritized remediation plan
        """
        # Group findings by priority
        critical_findings = [f for f in findings if f['severity'] == 'CRITICAL' or f['domain_relevance'] == 'critical']
        high_findings = [f for f in findings if f['severity'] == 'HIGH' or f['domain_relevance'] == 'high']

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
        print(f"   Domain-relevant critical: {analysis['statistics']['domain_critical']}")
        print(f"📊 JSON output: {json_file}")

        return analysis

def main():
    parser = argparse.ArgumentParser(description='Security Compliance Analyzer for generic software projects')
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
