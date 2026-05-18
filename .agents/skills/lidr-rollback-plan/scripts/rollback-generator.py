#!/usr/bin/env python3
"""
Rollback Plan Generator v1.0

AUTOMATED ROLLBACK PLAN CREATION ENGINE
- Transforms deployment analysis into executable rollback procedures
- Generates step-by-step runbooks with exact commands
- Creates risk-based rollback criteria and communication plan
- Estimates rollback times and verifies procedures
- Follows proven automation pattern: 4+ hours manual → 5 minutes automated

Part of {{CLIENT_NAME}} SDLC Ecosystem - Phase 2 Automation (45h/year ROI)
Following proven patterns from validate-requirements and tech-debt skills
"""

import os
import re
import json
import argparse
import logging
from pathlib import Path
from dataclasses import dataclass
from typing import List, Dict, Optional, Tuple
from datetime import datetime

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

@dataclass
class RollbackStep:
    """Individual rollback step with verification"""
    step_number: int
    action: str
    command: str
    verification: str
    duration_minutes: int
    critical: bool = False
    dependencies: List[str] = None

@dataclass
class RollbackCriteria:
    """Criteria for triggering rollback"""
    condition: str
    baseline: str
    threshold: str
    monitoring_alert: Optional[str] = None

@dataclass
class CommunicationPlan:
    """Communication during rollback"""
    when: str
    who: str
    channel: str
    message: str

class RollbackPlanGenerator:
    """
    Generates comprehensive rollback plans from deployment analysis

    Transforms analysis JSON into:
    - Executive rollback plan with risk assessment
    - Step-by-step executable procedures
    - Communication plan
    - Post-rollback verification checklist
    - CSV export for incident management
    """

    def __init__(self, analysis_dir: str = "rollback-analysis", output_dir: str = "rollback-plan"):
        self.analysis_dir = Path(analysis_dir).resolve()
        self.output_dir = Path(output_dir).resolve()
        self.output_dir.mkdir(parents=True, exist_ok=True)

        # Rollback templates for different components
        self.rollback_templates = {
            'kubernetes': {
                'deployment': 'kubectl rollout undo deployment/{deployment_name} -n {namespace}',
                'service': 'kubectl apply -f {previous_manifest} -n {namespace}',
                'configmap': 'kubectl rollout restart deployment/{deployment_name} -n {namespace}',
                'verification': 'kubectl rollout status deployment/{deployment_name} -n {namespace}'
            },
            'terraform': {
                'apply': 'terraform apply -target={resource} -var-file={previous_vars}',
                'destroy': 'terraform destroy -target={resource} -auto-approve',
                'verification': 'terraform plan -detailed-exitcode'
            },
            'docker': {
                'compose': 'docker-compose down && docker-compose up -d',
                'container': 'docker stop {container} && docker run {previous_image}',
                'verification': 'docker ps | grep {container}'
            },
            'database': {
                'rollback_migration': 'python manage.py migrate {app} {previous_migration}',
                'restore_backup': 'pg_restore -d {database} {backup_file}',
                'verification': 'psql -d {database} -c "SELECT version();"'
            }
        }

        # Communication templates
        self.communication_templates = {
            'start_rollback': "🔄 ROLLBACK INITIATED: {release_version} due to {trigger_reason}. ETA: {estimated_time} minutes",
            'step_complete': "✅ Rollback step {step_number} completed: {action}",
            'rollback_complete': "✅ ROLLBACK COMPLETE: {release_version}. All systems restored. Post-rollback verification in progress.",
            'incident_created': "🚨 Incident ticket created: {incident_id}. Root cause analysis will follow."
        }

        # domain-specific domain-specific patterns
        self.domain-specific_rollback_patterns = {
            'algorithm_rollback': {
                'critical_steps': [
                    'Stop all domain-specific processing workflows',
                    'Rollback algorithm models to previous version',
                    'Restart domain-specific services',
                    'Verify template compatibility',
                    'Resume processing with previous algorithm'
                ],
                'verification': 'Test template matching with known good samples'
            },
            'template_encryption': {
                'critical_steps': [
                    'Backup current templates',
                    'Rollback encryption configuration',
                    'Verify template decryption',
                    'Test template operations'
                ],
                'verification': 'Verify template operations with test dataset'
            },
            'api_compatibility': {
                'critical_steps': [
                    'Rollback API changes',
                    'Verify client compatibility',
                    'Test critical endpoints',
                    'Monitor error rates'
                ],
                'verification': 'Run API compatibility test suite'
            }
        }

    def load_analysis_results(self) -> Dict:
        """Load deployment analysis results"""
        analysis_file = self.analysis_dir / 'deployment-analysis.json'

        if not analysis_file.exists():
            raise FileNotFoundError(f"Analysis file not found: {analysis_file}")

        try:
            with open(analysis_file, 'r', encoding='utf-8') as f:
                return json.load(f)
        except json.JSONDecodeError as e:
            raise ValueError(f"Invalid analysis JSON: {e}")

    def generate_rollback_classification(self, analysis: Dict) -> Dict:
        """Generate rollback classification summary"""
        risk_assessment = analysis['risk_assessment']

        # Determine data loss risk from migrations
        data_loss_risk = 'None'
        for migration in analysis.get('database_migrations', []):
            if migration.get('data_impact') == 'Significant':
                data_loss_risk = 'Significant'
                break
            elif migration.get('data_impact') == 'Minimal' and data_loss_risk == 'None':
                data_loss_risk = 'Minimal'

        return {
            'overall_complexity': risk_assessment['overall_complexity'],
            'estimated_time': risk_assessment['estimated_rollback_time_minutes'],
            'data_loss_risk': data_loss_risk,
            'db_migration_reversible': 'Yes' if risk_assessment['db_migrations_reversible'] else 'No',
            'feature_flag_fallback': 'Yes (instant)' if risk_assessment['feature_flag_fallback'] else 'No (requires rollback)'
        }

    def generate_rollback_criteria(self, analysis: Dict) -> List[RollbackCriteria]:
        """Generate criteria for triggering rollback"""
        criteria = []

        # Error rate threshold
        criteria.append(RollbackCriteria(
            condition="Error rate > 5%",
            baseline="< 0.1%",
            threshold="5%",
            monitoring_alert="ErrorRate"
        ))

        # Latency threshold
        criteria.append(RollbackCriteria(
            condition="P95 latency > 2000ms",
            baseline="< 500ms",
            threshold="2000ms",
            monitoring_alert="LatencyHigh"
        ))

        # Critical user journeys
        if analysis.get('domain-specific_domain_risks', {}).get('algorithm_change_risk'):
            criteria.append(RollbackCriteria(
                condition="domain-specific verification fails",
                baseline="> 95% success rate",
                threshold="< 90% success rate",
                monitoring_alert="domain-specificVerificationFailed"
            ))

        # Template compatibility
        if analysis.get('domain-specific_domain_risks', {}).get('template_storage_risk'):
            criteria.append(RollbackCriteria(
                condition="Template compatibility errors",
                baseline="0 template errors",
                threshold="> 10 template errors/hour",
                monitoring_alert="TemplateCompatibilityError"
            ))

        return criteria

    def generate_application_rollback_steps(self, prs: List[Dict]) -> List[RollbackStep]:
        """Generate application code rollback steps"""
        steps = []
        step_number = 1

        if prs:
            # Git-based rollback
            steps.append(RollbackStep(
                step_number=step_number,
                action="Identify current deployment commit",
                command="git log --oneline -1",
                verification="Note current commit hash for incident report",
                duration_minutes=1
            ))
            step_number += 1

            steps.append(RollbackStep(
                step_number=step_number,
                action="Rollback to previous stable release",
                command="git checkout {previous_release_tag}",
                verification="git describe --tags",
                duration_minutes=1
            ))
            step_number += 1

            steps.append(RollbackStep(
                step_number=step_number,
                action="Rebuild and deploy previous version",
                command="docker build -t {app_name}:{previous_tag} . && docker push {app_name}:{previous_tag}",
                verification="docker images | grep {app_name}:{previous_tag}",
                duration_minutes=5,
                critical=True
            ))
            step_number += 1

        return steps, step_number

    def generate_database_rollback_steps(self, migrations: List[Dict], start_step: int) -> Tuple[List[RollbackStep], int]:
        """Generate database rollback steps"""
        steps = []
        step_number = start_step

        if not migrations:
            return steps, step_number

        # Check for irreversible migrations first
        irreversible_migrations = [m for m in migrations if not m.get('reversible', True)]

        if irreversible_migrations:
            # Backup restoration approach
            steps.append(RollbackStep(
                step_number=step_number,
                action="Stop application to prevent new writes",
                command="kubectl scale deployment {app_deployment} --replicas=0 -n {namespace}",
                verification="kubectl get pods -n {namespace} | grep {app}",
                duration_minutes=2,
                critical=True
            ))
            step_number += 1

            steps.append(RollbackStep(
                step_number=step_number,
                action="Restore database from pre-deployment backup",
                command="pg_restore -d {database_name} {backup_file_path}",
                verification="psql -d {database_name} -c \"SELECT COUNT(*) FROM {key_table};\"",
                duration_minutes=10,
                critical=True
            ))
            step_number += 1

        else:
            # Migration rollback approach
            for migration in reversed(migrations):  # Rollback in reverse order
                steps.append(RollbackStep(
                    step_number=step_number,
                    action=f"Rollback migration: {migration['file']}",
                    command=migration.get('rollback_command', f"python manage.py migrate {migration['file']} --reverse"),
                    verification=f"python manage.py showmigrations | grep {migration['file']}",
                    duration_minutes=migration.get('estimated_time_minutes', 3),
                    critical=True
                ))
                step_number += 1

        return steps, step_number

    def generate_infrastructure_rollback_steps(self, infra_changes: List[Dict], start_step: int) -> Tuple[List[RollbackStep], int]:
        """Generate infrastructure rollback steps"""
        steps = []
        step_number = start_step

        for change in infra_changes:
            component = change.get('component', 'unknown')
            file_path = change.get('file', 'unknown')

            if component == 'kubernetes':
                steps.append(RollbackStep(
                    step_number=step_number,
                    action=f"Rollback Kubernetes deployment: {file_path}",
                    command=change.get('rollback_strategy', 'kubectl rollout undo deployment/{deployment_name} -n {namespace}'),
                    verification="kubectl rollout status deployment/{deployment_name} -n {namespace}",
                    duration_minutes=change.get('estimated_time_minutes', 3),
                    critical=True
                ))

            elif component == 'terraform':
                steps.append(RollbackStep(
                    step_number=step_number,
                    action=f"Rollback Terraform resource: {file_path}",
                    command=change.get('rollback_strategy', 'terraform apply -target={resource} -var-file={previous_vars}'),
                    verification="terraform plan -detailed-exitcode",
                    duration_minutes=change.get('estimated_time_minutes', 5),
                    critical=True
                ))

            elif component == 'docker':
                steps.append(RollbackStep(
                    step_number=step_number,
                    action=f"Rollback Docker configuration: {file_path}",
                    command=change.get('rollback_strategy', 'docker-compose down && docker-compose up -d'),
                    verification="docker ps | grep {container_name}",
                    duration_minutes=change.get('estimated_time_minutes', 2)
                ))

            step_number += 1

        return steps, step_number

    def generate_feature_flag_steps(self, flags: List[Dict]) -> List[RollbackStep]:
        """Generate feature flag rollback steps (instant rollback)"""
        steps = []

        if not flags:
            return steps

        # Feature flags can be rolled back instantly
        for i, flag in enumerate(flags, 1):
            steps.append(RollbackStep(
                step_number=i,
                action=f"Rollback feature flag: {flag.get('name', 'unknown')}",
                command=f"Set {flag.get('name')} = {flag.get('rollback_value', 'false')}",
                verification=f"Verify {flag.get('name')} = {flag.get('rollback_value')}",
                duration_minutes=1,
                critical=False
            ))

        return steps

    def generate_domain-specific_specific_steps(self, analysis: Dict, start_step: int) -> Tuple[List[RollbackStep], int]:
        """Generate domain-specific domain-specific rollback steps"""
        steps = []
        step_number = start_step
        domain-specific_risks = analysis.get('domain-specific_domain_risks', {})

        # Algorithm rollback
        if domain-specific_risks.get('algorithm_change_risk'):
            steps.append(RollbackStep(
                step_number=step_number,
                action="Stop domain-specific processing workflows",
                command="kubectl scale deployment domain-specific-processor --replicas=0 -n production",
                verification="kubectl get pods -l app=domain-specific-processor -n production",
                duration_minutes=1,
                critical=True
            ))
            step_number += 1

            steps.append(RollbackStep(
                step_number=step_number,
                action="Rollback algorithm models to previous version",
                command="aws s3 sync s3://models/previous/ /models/ --delete",
                verification="ls -la /models/ && md5sum /models/main_model.pkl",
                duration_minutes=3,
                critical=True
            ))
            step_number += 1

        # Template encryption rollback
        if domain-specific_risks.get('template_storage_risk'):
            steps.append(RollbackStep(
                step_number=step_number,
                action="Rollback template encryption configuration",
                command="kubectl apply -f k8s/template-encryption-previous.yaml -n production",
                verification="kubectl get secret template-encryption-key -n production",
                duration_minutes=2,
                critical=True
            ))
            step_number += 1

        # API compatibility rollback
        if domain-specific_risks.get('api_compatibility_risk'):
            steps.append(RollbackStep(
                step_number=step_number,
                action="Test domain-specific API compatibility",
                command="curl -X POST {api_endpoint}/verify -d @test_template.json",
                verification="Check HTTP 200 response and valid verification result",
                duration_minutes=2,
                critical=True
            ))
            step_number += 1

        return steps, step_number

    def generate_communication_plan(self, analysis: Dict) -> List[CommunicationPlan]:
        """Generate communication plan for rollback"""
        plan = []

        # Pre-rollback communication
        plan.append(CommunicationPlan(
            when="Rollback decision made",
            who="Tech Lead / DevOps",
            channel="#incidents + #releases",
            message=f"🔄 ROLLBACK INITIATED: Release {analysis.get('analysis_metadata', {}).get('since_release', 'unknown')} due to [TRIGGER_REASON]. ETA: {analysis.get('risk_assessment', {}).get('estimated_rollback_time_minutes', 15)} minutes"
        ))

        # During rollback
        plan.append(CommunicationPlan(
            when="Every major step completion",
            who="DevOps executing rollback",
            channel="#incidents",
            message="✅ Rollback step [STEP_NUMBER] completed: [ACTION_DESCRIPTION]"
        ))

        # Post-rollback
        plan.append(CommunicationPlan(
            when="Rollback completion",
            who="Tech Lead",
            channel="#incidents + #releases + #general",
            message="✅ ROLLBACK COMPLETE: All systems restored to previous stable state. Post-rollback verification in progress."
        ))

        # Incident creation
        plan.append(CommunicationPlan(
            when="After rollback verification",
            who="Tech Lead",
            channel="#incidents",
            message="🚨 Incident ticket created: [INCIDENT_ID]. Root cause analysis scheduled for next business day."
        ))

        return plan

    def generate_post_rollback_checklist(self) -> List[str]:
        """Generate post-rollback verification checklist"""
        return [
            "Verify all services are healthy and responding",
            "Check error rates are back to baseline levels",
            "Verify P95 latency is within acceptable limits",
            "Test critical user journeys manually",
            "Verify domain-specific verification workflows (if applicable)",
            "Check template operations and compatibility (if applicable)",
            "Verify data integrity - run data validation checks",
            "Notify stakeholders of rollback completion",
            "Create incident ticket for root cause analysis",
            "Schedule postmortem meeting within 24-48 hours",
            "Document lessons learned and prevention measures"
        ]

    def generate_rollback_plan_document(self, analysis: Dict) -> str:
        """Generate comprehensive rollback plan document"""
        classification = self.generate_rollback_classification(analysis)
        criteria = self.generate_rollback_criteria(analysis)
        communication_plan = self.generate_communication_plan(analysis)
        post_rollback_checklist = self.generate_post_rollback_checklist()

        # Generate rollback steps
        app_steps, next_step = self.generate_application_rollback_steps(analysis.get('pull_requests', []))
        db_steps, next_step = self.generate_database_rollback_steps(analysis.get('database_migrations', []), next_step)
        infra_steps, next_step = self.generate_infrastructure_rollback_steps(analysis.get('infrastructure_changes', []), next_step)
        flag_steps = self.generate_feature_flag_steps(analysis.get('feature_flags', []))
        domain-specific_steps, _ = self.generate_domain-specific_specific_steps(analysis, next_step)

        all_steps = app_steps + db_steps + infra_steps + domain-specific_steps

        # Build the document
        doc = f"""# Rollback Plan: {analysis.get('analysis_metadata', {}).get('since_release', 'Unknown Version')} — {datetime.now().strftime('%Y-%m-%d')}

**Generated:** {datetime.now().isoformat()}
**Based on Analysis:** {analysis.get('analysis_metadata', {}).get('timestamp', 'Unknown')}

## Rollback Classification

| Aspect | Assessment |
|--------|-----------|
| **Overall Complexity** | {classification['overall_complexity']} |
| **Estimated Time** | {classification['estimated_time']} minutes |
| **Data Loss Risk** | {classification['data_loss_risk']} |
| **DB Migration Reversible?** | {classification['db_migration_reversible']} |
| **Feature Flag Fallback?** | {classification['feature_flag_fallback']} |

## Rollback Decision Criteria

Trigger rollback if ANY of these occur within {classification['estimated_time']} minutes post-deploy:

"""

        for criteria_item in criteria:
            doc += f"- [ ] {criteria_item.condition} (baseline: {criteria_item.baseline})\n"

        doc += """
## Strategy per Component

### Application Code
"""
        if app_steps:
            doc += "| Strategy | Command | Verification |\n"
            doc += "|----------|---------|-------------|\n"
            for step in app_steps:
                doc += f"| {step.action} | `{step.command}` | {step.verification} |\n"
        else:
            doc += "No application rollback required.\n"

        doc += """
### Database
"""
        if analysis.get('database_migrations'):
            doc += "| Migration | Reversible? | Rollback Command | Data Impact |\n"
            doc += "|-----------|-------------|-----------------|-------------|\n"
            for migration in analysis['database_migrations']:
                reversible = 'Yes' if migration.get('reversible', True) else 'No'
                command = migration.get('rollback_command', 'Backup restoration required')
                impact = migration.get('data_impact', 'Unknown')
                doc += f"| {migration.get('file', 'Unknown')} | {reversible} | `{command}` | {impact} |\n"
        else:
            doc += "No database changes to rollback.\n"

        doc += """
### Infrastructure
"""
        if analysis.get('infrastructure_changes'):
            doc += "| Change | Rollback Command | Verification |\n"
            doc += "|--------|-----------------|-------------|\n"
            for change in analysis['infrastructure_changes']:
                doc += f"| {change.get('file', 'Unknown')} | `{change.get('rollback_strategy', 'Manual rollback')}` | Component health check |\n"
        else:
            doc += "No infrastructure changes to rollback.\n"

        doc += """
### Feature Flags (instant rollback)
"""
        if flag_steps:
            doc += "| Flag | Current | Rollback Value | Effect |\n"
            doc += "|------|---------|---------------|--------|\n"
            for flag in analysis.get('feature_flags', []):
                doc += f"| {flag.get('name', 'Unknown')} | {flag.get('current_value', 'Unknown')} | {flag.get('rollback_value', 'Unknown')} | {flag.get('effect', 'Toggle feature')} |\n"
        else:
            doc += "No feature flags available for instant rollback.\n"

        doc += """
## Step-by-Step Runbook

| Step | Action | Command | Verification | Duration |
|------|--------|---------|-------------|----------|
"""

        for step in all_steps:
            critical_marker = " 🔴" if step.critical else ""
            doc += f"| {step.step_number}{critical_marker} | {step.action} | `{step.command}` | {step.verification} | ~{step.duration_minutes}min |\n"

        doc += """
## Communication During Rollback

| When | Who | Channel | Message |
|------|-----|---------|---------|
"""

        for comm in communication_plan:
            doc += f"| {comm.when} | {comm.who} | {comm.channel} | {comm.message} |\n"

        doc += """
## Post-Rollback Checklist

"""
        for item in post_rollback_checklist:
            doc += f"- [ ] {item}\n"

        doc += """
## Risk Factors Identified

"""
        for factor in analysis.get('risk_assessment', {}).get('risk_factors', []):
            doc += f"- {factor}\n"

        doc += """
## Mitigation Strategies Applied

"""
        for strategy in analysis.get('risk_assessment', {}).get('mitigation_strategies', []):
            doc += f"- {strategy}\n"

        if analysis.get('domain-specific_domain_risks'):
            doc += """
## domain-specific-Specific Considerations

"""
            domain-specific_risks = analysis['domain-specific_domain_risks']
            if domain-specific_risks.get('algorithm_change_risk'):
                doc += "- ⚠️ **Algorithm Change Risk**: Template compatibility must be verified post-rollback\n"
            if domain-specific_risks.get('template_storage_risk'):
                doc += "- ⚠️ **Template Storage Risk**: Encryption rollback requires careful key management\n"
            if domain-specific_risks.get('gdpr_compliance_risk'):
                doc += "- ⚠️ **GDPR Compliance Risk**: Ensure consent mechanisms remain valid\n"

        doc += f"""
---

**CRITICAL REMINDERS:**
- Maximum rollback time target: 15 minutes
- Test rollback procedures in staging first
- Document actual rollback execution times for future reference
- Create incident ticket immediately after rollback completion

*Generated by {{CLIENT_NAME}} SDLC Rollback Plan Automation v1.0*
"""

        return doc

    def generate_csv_summary(self, analysis: Dict) -> str:
        """Generate CSV summary for incident management"""
        csv_content = "Step,Component,Action,Command,Duration_Minutes,Critical,Dependencies\n"

        # Get all steps
        app_steps, next_step = self.generate_application_rollback_steps(analysis.get('pull_requests', []))
        db_steps, next_step = self.generate_database_rollback_steps(analysis.get('database_migrations', []), next_step)
        infra_steps, next_step = self.generate_infrastructure_rollback_steps(analysis.get('infrastructure_changes', []), next_step)
        domain-specific_steps, _ = self.generate_domain-specific_specific_steps(analysis, next_step)

        all_steps = app_steps + db_steps + infra_steps + domain-specific_steps

        for step in all_steps:
            component = "Application"
            if "database" in step.action.lower() or "migration" in step.action.lower():
                component = "Database"
            elif "kubernetes" in step.command or "terraform" in step.command:
                component = "Infrastructure"
            elif "domain-specific" in step.action.lower():
                component = "domain-specific"

            csv_content += f"{step.step_number},{component},{step.action.replace(',', ';')},{step.command.replace(',', ';')},{step.duration_minutes},{step.critical},\n"

        return csv_content

    def save_rollback_plan(self, analysis: Dict, version: str = None):
        """Save complete rollback plan"""
        logger.info("Generating rollback plan...")

        if not version:
            version = analysis.get('analysis_metadata', {}).get('since_release', 'unknown')

        # Generate plan document
        plan_document = self.generate_rollback_plan_document(analysis)

        # Save markdown document
        plan_filename = f"rollback-plan-{version}-{datetime.now().strftime('%Y%m%d-%H%M')}.md"
        plan_path = self.output_dir / plan_filename
        with open(plan_path, 'w', encoding='utf-8') as f:
            f.write(plan_document)

        # Save CSV summary
        csv_summary = self.generate_csv_summary(analysis)
        csv_filename = f"rollback-plan-{version}-summary.csv"
        csv_path = self.output_dir / csv_filename
        with open(csv_path, 'w', encoding='utf-8') as f:
            f.write(csv_summary)

        # Save JSON structure for programmatic access
        plan_structure = {
            'metadata': {
                'version': version,
                'generated': datetime.now().isoformat(),
                'based_on_analysis': analysis.get('analysis_metadata', {}).get('timestamp'),
                'generator_version': '1.0.0'
            },
            'classification': self.generate_rollback_classification(analysis),
            'criteria': [criteria.__dict__ for criteria in self.generate_rollback_criteria(analysis)],
            'communication_plan': [comm.__dict__ for comm in self.generate_communication_plan(analysis)],
            'post_rollback_checklist': self.generate_post_rollback_checklist(),
            'estimated_total_time': analysis.get('risk_assessment', {}).get('estimated_rollback_time_minutes', 15)
        }

        json_filename = f"rollback-plan-{version}-structure.json"
        json_path = self.output_dir / json_filename
        with open(json_path, 'w', encoding='utf-8') as f:
            json.dump(plan_structure, f, indent=2, ensure_ascii=False)

        logger.info(f"Rollback plan saved to {self.output_dir}")
        return {
            'plan_document': plan_path,
            'csv_summary': csv_path,
            'json_structure': json_path
        }

def main():
    """Main execution function"""
    parser = argparse.ArgumentParser(description="Rollback Plan Generator")
    parser.add_argument('--analysis-dir', '-a', default='rollback-analysis',
                      help='Directory containing deployment analysis results (default: rollback-analysis)')
    parser.add_argument('--output-dir', '-o', default='rollback-plan',
                      help='Output directory for rollback plan (default: rollback-plan)')
    parser.add_argument('--version', '-v',
                      help='Release version for rollback plan (auto-detects from analysis if not provided)')
    parser.add_argument('--verbose', '--debug', action='store_true',
                      help='Enable verbose logging')

    args = parser.parse_args()

    if args.verbose:
        logging.getLogger().setLevel(logging.DEBUG)

    # Initialize generator
    generator = RollbackPlanGenerator(args.analysis_dir, args.output_dir)

    try:
        # Load analysis results
        logger.info(f"Loading analysis results from {args.analysis_dir}")
        analysis = generator.load_analysis_results()

        # Generate rollback plan
        plan_files = generator.save_rollback_plan(analysis, args.version)

        # Print summary
        classification = generator.generate_rollback_classification(analysis)
        print(f"\n✅ Rollback Plan Generated Successfully")
        print(f"📋 Complexity: {classification['overall_complexity']}")
        print(f"⏱️  Estimated Time: {classification['estimated_time']} minutes")
        print(f"💾 Data Risk: {classification['data_loss_risk']}")
        print(f"🔄 DB Reversible: {classification['db_migration_reversible']}")
        print(f"🚩 Feature Flags: {classification['feature_flag_fallback']}")
        print(f"\n📄 Files Generated:")
        print(f"   • Plan Document: {plan_files['plan_document']}")
        print(f"   • CSV Summary: {plan_files['csv_summary']}")
        print(f"   • JSON Structure: {plan_files['json_structure']}")

        if classification['overall_complexity'] in ['Complex', 'Dangerous']:
            print(f"\n⚠️  WARNING: {classification['overall_complexity']} rollback detected")
            print("   Consider additional review and dry-run in staging")

        if int(classification['estimated_time']) > 15:
            print(f"\n⚠️  WARNING: Rollback time exceeds 15-minute target")
            print("   Consider splitting deployment or improving rollback strategy")

        return 0

    except Exception as e:
        logger.error(f"Rollback plan generation failed: {e}")
        return 1

if __name__ == '__main__':
    exit(main())