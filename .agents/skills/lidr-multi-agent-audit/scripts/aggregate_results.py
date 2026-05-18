#!/usr/bin/env python3
"""
Multi-Agent Audit Result Aggregation System
Collects, merges, and analyzes results from 10 parallel audit agents
"""

import json
import csv
import os
import sys
from datetime import datetime, timezone
from typing import Dict, List, Any, Tuple, Optional
from pathlib import Path
import statistics

class AuditResultAggregator:
    """Aggregates results from multiple parallel audit agents"""

    def __init__(self, workspace_path: str):
        self.workspace = Path(workspace_path)
        self.coordination_dir = self.workspace / "coordination"
        self.individual_reports_dir = self.workspace / "individual-reports"
        self.aggregated_results_dir = self.workspace / "aggregated-results"
        self.final_report_dir = self.workspace / "final-report"

        # Ensure output directories exist
        self.aggregated_results_dir.mkdir(exist_ok=True)
        self.final_report_dir.mkdir(exist_ok=True)

        # Initialize aggregation data structures
        self.agent_results: Dict[str, Dict] = {}
        self.consolidated_scores: List[Dict] = []
        self.ecosystem_metrics: Dict[str, Any] = {}
        self.remediation_priorities: List[Dict] = []

    def collect_agent_results(self) -> bool:
        """Collect and validate results from all agents"""
        print("🔍 Collecting results from all agents...")

        agents_found = 0
        agents_completed = 0

        # Scan for agent directories
        if not self.individual_reports_dir.exists():
            print("❌ No individual reports directory found")
            return False

        for agent_dir in self.individual_reports_dir.iterdir():
            if agent_dir.is_dir() and agent_dir.name.startswith('agent-'):
                agents_found += 1
                agent_id = agent_dir.name

                print(f"   Collecting from {agent_id}...")

                # Check if agent completed successfully
                completion_flag = self.coordination_dir / f"{agent_id}-complete.flag"
                if not completion_flag.exists():
                    print(f"   ⚠️  {agent_id} did not complete successfully")
                    continue

                # Load agent results
                agent_result = self._load_agent_results(agent_dir, agent_id)
                if agent_result:
                    self.agent_results[agent_id] = agent_result
                    agents_completed += 1
                else:
                    print(f"   ❌ Failed to load results from {agent_id}")

        print(f"✅ Collected results from {agents_completed}/{agents_found} agents")
        return agents_completed > 0

    def _load_agent_results(self, agent_dir: Path, agent_id: str) -> Optional[Dict]:
        """Load all results from a single agent directory"""
        result = {
            'agent_id': agent_id,
            'audit_reports': {},
            'compliance_scores': {},
            'batch_summary': {},
            'error_log': [],
            'timing_metrics': {}
        }

        try:
            # Load compliance scores (machine-readable format)
            scores_file = agent_dir / "compliance-scores.json"
            if scores_file.exists():
                with open(scores_file) as f:
                    result['compliance_scores'] = json.load(f)

            # Load batch summary
            summary_file = agent_dir / "batch-summary.md"
            if summary_file.exists():
                result['batch_summary'] = self._parse_batch_summary(summary_file)

            # Load individual audit reports
            for report_file in agent_dir.glob("*-audit.md"):
                skill_name = report_file.stem.replace('-audit', '')
                result['audit_reports'][skill_name] = self._parse_audit_report(report_file)

            # Load error log if exists
            error_file = agent_dir / "error-log.md"
            if error_file.exists():
                result['error_log'] = self._parse_error_log(error_file)

            # Load timing metrics
            timing_file = agent_dir / "timing-metrics.json"
            if timing_file.exists():
                with open(timing_file) as f:
                    result['timing_metrics'] = json.load(f)

            return result

        except Exception as e:
            print(f"   ❌ Error loading {agent_id} results: {e}")
            return None

    def _parse_batch_summary(self, summary_file: Path) -> Dict:
        """Parse agent batch summary markdown file"""
        summary = {
            'skills_processed': 0,
            'skills_completed': 0,
            'skills_failed': 0,
            'average_score': 0.0,
            'execution_time': 0
        }

        try:
            content = summary_file.read_text()

            # Extract metrics using simple parsing
            for line in content.split('\n'):
                if 'skills processed:' in line.lower():
                    summary['skills_processed'] = int(line.split(':')[1].strip())
                elif 'average score:' in line.lower():
                    summary['average_score'] = float(line.split(':')[1].strip().split('/')[0])
                elif 'execution time:' in line.lower():
                    summary['execution_time'] = self._parse_time_string(line.split(':')[1].strip())

        except Exception as e:
            print(f"   ⚠️  Could not parse batch summary: {e}")

        return summary

    def _parse_audit_report(self, report_file: Path) -> Dict:
        """Parse individual skill audit report"""
        audit = {
            'skill_name': report_file.stem.replace('-audit', ''),
            'overall_score': 0,
            'category_scores': {},
            'status': 'UNKNOWN',
            'critical_issues': [],
            'recommendations': []
        }

        try:
            content = report_file.read_text()

            # Extract overall score
            for line in content.split('\n'):
                if 'overall score:' in line.lower():
                    score_text = line.split(':')[1].strip()
                    audit['overall_score'] = int(score_text.split('/')[0])
                elif 'overall status:' in line.lower():
                    audit['status'] = line.split(':')[1].strip()

        except Exception as e:
            print(f"   ⚠️  Could not parse audit report {report_file.name}: {e}")

        return audit

    def _parse_error_log(self, error_file: Path) -> List[str]:
        """Parse error log file"""
        try:
            content = error_file.read_text()
            return [line.strip() for line in content.split('\n') if line.strip()]
        except:
            return []

    def _parse_time_string(self, time_str: str) -> int:
        """Parse time string to seconds"""
        try:
            if 'm' in time_str and 's' in time_str:
                parts = time_str.replace('m', '').replace('s', '').split()
                return int(parts[0]) * 60 + int(parts[1])
            elif 's' in time_str:
                return int(time_str.replace('s', '').strip())
            elif 'm' in time_str:
                return int(time_str.replace('m', '').strip()) * 60
        except:
            pass
        return 0

    def merge_compliance_data(self) -> None:
        """Merge all agent compliance data into unified format"""
        print("🔄 Merging compliance data from all agents...")

        all_skills = {}

        # Collect all skill data from agents
        for agent_id, agent_data in self.agent_results.items():
            compliance_scores = agent_data.get('compliance_scores', {})

            if 'skills_audited' in compliance_scores:
                for skill_data in compliance_scores['skills_audited']:
                    skill_name = skill_data.get('skill_name', 'unknown')
                    all_skills[skill_name] = {
                        'skill_name': skill_name,
                        'agent_id': agent_id,
                        'overall_score': skill_data.get('overall_score', 0),
                        'category_scores': skill_data.get('category_scores', {}),
                        'status': skill_data.get('status', 'UNKNOWN'),
                        'critical_issues': skill_data.get('critical_issues', []),
                        'recommendations': skill_data.get('recommendations', [])
                    }

        self.consolidated_scores = list(all_skills.values())

        # Generate compliance matrix CSV
        self._generate_compliance_matrix()

        print(f"✅ Merged data for {len(self.consolidated_scores)} skills")

    def _generate_compliance_matrix(self) -> None:
        """Generate CSV compliance matrix"""
        matrix_file = self.aggregated_results_dir / "compliance-matrix.csv"

        with open(matrix_file, 'w', newline='') as csvfile:
            fieldnames = [
                'skill_name', 'agent_id', 'overall_score', 'status',
                'frontmatter', 'domain_agnostic', 'description', 'structure',
                'phase_alignment', 'automation', 'references', 'language'
            ]
            writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
            writer.writeheader()

            for skill in self.consolidated_scores:
                category_scores = skill.get('category_scores', {})
                row = {
                    'skill_name': skill['skill_name'],
                    'agent_id': skill['agent_id'],
                    'overall_score': skill['overall_score'],
                    'status': skill['status'],
                    'frontmatter': category_scores.get('frontmatter', 0),
                    'domain_agnostic': category_scores.get('domain_agnostic', 0),
                    'description': category_scores.get('description', 0),
                    'structure': category_scores.get('structure', 0),
                    'phase_alignment': category_scores.get('phase_alignment', 0),
                    'automation': category_scores.get('automation', 0),
                    'references': category_scores.get('references', 0),
                    'language': category_scores.get('language', 0)
                }
                writer.writerow(row)

        print(f"📊 Generated compliance matrix: {matrix_file}")

    def calculate_ecosystem_metrics(self) -> None:
        """Calculate overall ecosystem health metrics"""
        print("📈 Calculating ecosystem metrics...")

        if not self.consolidated_scores:
            print("❌ No consolidated scores available")
            return

        # Basic statistics
        scores = [skill['overall_score'] for skill in self.consolidated_scores]
        total_skills = len(scores)

        self.ecosystem_metrics = {
            'total_skills_audited': total_skills,
            'average_score': round(statistics.mean(scores), 1),
            'median_score': round(statistics.median(scores), 1),
            'min_score': min(scores),
            'max_score': max(scores),
            'std_deviation': round(statistics.stdev(scores) if len(scores) > 1 else 0, 1)
        }

        # Compliance level distribution
        excellent = sum(1 for s in scores if s >= 90)
        good = sum(1 for s in scores if 80 <= s < 90)
        acceptable = sum(1 for s in scores if 70 <= s < 80)
        needs_improvement = sum(1 for s in scores if 60 <= s < 70)
        critical = sum(1 for s in scores if s < 60)

        self.ecosystem_metrics.update({
            'excellent_count': excellent,
            'good_count': good,
            'acceptable_count': acceptable,
            'needs_improvement_count': needs_improvement,
            'critical_count': critical,
            'compliance_rate': round((excellent + good + acceptable) * 100 / total_skills, 1)
        })

        # Performance metrics
        agent_times = []
        for agent_data in self.agent_results.values():
            batch_summary = agent_data.get('batch_summary', {})
            if 'execution_time' in batch_summary:
                agent_times.append(batch_summary['execution_time'])

        if agent_times:
            self.ecosystem_metrics.update({
                'average_agent_time': round(statistics.mean(agent_times), 1),
                'total_audit_time': round(max(agent_times), 1),  # Parallel execution
                'parallelization_efficiency': round(sum(agent_times) / max(agent_times) * 100, 1) if agent_times else 0
            })

        print(f"📊 Calculated metrics for {total_skills} skills")
        print(f"   Average score: {self.ecosystem_metrics['average_score']}/100")
        print(f"   Compliance rate: {self.ecosystem_metrics['compliance_rate']}%")

    def detect_conflicts(self) -> List[Dict]:
        """Detect potential conflicts or inconsistencies in results"""
        print("🔍 Detecting conflicts and inconsistencies...")

        conflicts = []

        # Check for duplicate skill audits (shouldn't happen but validate)
        skill_names = [skill['skill_name'] for skill in self.consolidated_scores]
        duplicates = [name for name in set(skill_names) if skill_names.count(name) > 1]

        if duplicates:
            conflicts.append({
                'type': 'DUPLICATE_AUDITS',
                'description': f'Skills audited by multiple agents: {duplicates}',
                'severity': 'HIGH',
                'impact': 'Result accuracy compromised'
            })

        # Check for extreme score variations in similar categories
        score_ranges = {}
        for skill in self.consolidated_scores:
            for category, score in skill.get('category_scores', {}).items():
                if category not in score_ranges:
                    score_ranges[category] = []
                score_ranges[category].append(score)

        for category, scores in score_ranges.items():
            if len(scores) > 5 and max(scores) - min(scores) > 50:
                conflicts.append({
                    'type': 'SCORE_VARIANCE',
                    'description': f'High variance in {category} scores ({min(scores)}-{max(scores)})',
                    'severity': 'MEDIUM',
                    'impact': 'Possible scoring inconsistency'
                })

        # Check for missing expected skills
        expected_skills = 49  # Known total from ecosystem
        if len(self.consolidated_scores) < expected_skills:
            missing_count = expected_skills - len(self.consolidated_scores)
            conflicts.append({
                'type': 'MISSING_SKILLS',
                'description': f'{missing_count} skills were not audited',
                'severity': 'HIGH',
                'impact': 'Incomplete ecosystem assessment'
            })

        if conflicts:
            print(f"   ⚠️  Found {len(conflicts)} potential conflicts")
            for conflict in conflicts:
                print(f"      {conflict['type']}: {conflict['description']}")
        else:
            print("   ✅ No conflicts detected")

        return conflicts

    def generate_remediation_priorities(self) -> None:
        """Generate prioritized remediation plan"""
        print("🛠️  Generating remediation priorities...")

        # Categorize skills by priority
        critical_skills = [s for s in self.consolidated_scores if s['overall_score'] < 60]
        needs_improvement = [s for s in self.consolidated_scores if 60 <= s['overall_score'] < 80]
        optimization_candidates = [s for s in self.consolidated_scores if 80 <= s['overall_score'] < 90]

        # Sort by score (lowest first for critical/needs improvement)
        critical_skills.sort(key=lambda x: x['overall_score'])
        needs_improvement.sort(key=lambda x: x['overall_score'])
        optimization_candidates.sort(key=lambda x: x['overall_score'])

        self.remediation_priorities = [
            {
                'phase': 1,
                'title': 'Critical Fixes (Week 1)',
                'priority': 'IMMEDIATE',
                'skills': critical_skills,
                'estimated_hours': len(critical_skills) * 2,
                'description': 'Skills failing minimum standards - immediate action required'
            },
            {
                'phase': 2,
                'title': 'Standards Compliance (Week 2-3)',
                'priority': 'HIGH',
                'skills': needs_improvement,
                'estimated_hours': len(needs_improvement) * 1,
                'description': 'Skills needing improvement to reach acceptable standards'
            },
            {
                'phase': 3,
                'title': 'Optimization (Week 4)',
                'priority': 'MEDIUM',
                'skills': optimization_candidates,
                'estimated_hours': len(optimization_candidates) * 0.5,
                'description': 'Good skills that could be excellent'
            }
        ]

        print(f"   📋 Generated {len(self.remediation_priorities)} remediation phases")
        print(f"      Critical: {len(critical_skills)} skills")
        print(f"      Improvement: {len(needs_improvement)} skills")
        print(f"      Optimization: {len(optimization_candidates)} skills")

    def generate_executive_dashboard(self) -> None:
        """Generate executive dashboard report"""
        print("📊 Generating executive dashboard...")

        dashboard_file = self.final_report_dir / "executive-dashboard.md"

        timestamp = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC")

        content = f"""# Multi-Agent Audit Executive Dashboard

**Audit Session ID:** {self.workspace.name}
**Execution Date:** {timestamp}
**Agents Deployed:** {len(self.agent_results)} parallel agents
**Skills Audited:** {self.ecosystem_metrics.get('total_skills_audited', 0)}/49 ecosystem skills

## Overall Health Score: {self.ecosystem_metrics.get('average_score', 0)}/100

### Compliance Distribution
| Status | Count | Percentage |
|--------|-------|------------|
| ✅ Excellent (90-100) | {self.ecosystem_metrics.get('excellent_count', 0)} | {self.ecosystem_metrics.get('excellent_count', 0) * 100 // self.ecosystem_metrics.get('total_skills_audited', 1)}% |
| 🟢 Good (80-89) | {self.ecosystem_metrics.get('good_count', 0)} | {self.ecosystem_metrics.get('good_count', 0) * 100 // self.ecosystem_metrics.get('total_skills_audited', 1)}% |
| 🟡 Acceptable (70-79) | {self.ecosystem_metrics.get('acceptable_count', 0)} | {self.ecosystem_metrics.get('acceptable_count', 0) * 100 // self.ecosystem_metrics.get('total_skills_audited', 1)}% |
| 🟠 Needs Improvement (60-69) | {self.ecosystem_metrics.get('needs_improvement_count', 0)} | {self.ecosystem_metrics.get('needs_improvement_count', 0) * 100 // self.ecosystem_metrics.get('total_skills_audited', 1)}% |
| ❌ Critical (0-59) | {self.ecosystem_metrics.get('critical_count', 0)} | {self.ecosystem_metrics.get('critical_count', 0) * 100 // self.ecosystem_metrics.get('total_skills_audited', 1)}% |

**Overall Compliance Rate:** {self.ecosystem_metrics.get('compliance_rate', 0)}% (≥70 threshold)

## Performance Metrics
- **Total Audit Time:** {self.ecosystem_metrics.get('total_audit_time', 0)} seconds
- **Average Agent Time:** {self.ecosystem_metrics.get('average_agent_time', 0)} seconds
- **Parallelization Efficiency:** {self.ecosystem_metrics.get('parallelization_efficiency', 0)}%
- **Success Rate:** {100 - (self.ecosystem_metrics.get('critical_count', 0) * 100 // self.ecosystem_metrics.get('total_skills_audited', 1))}%

## Critical Actions Required
"""

        # Add critical actions
        critical_skills = [s for s in self.consolidated_scores if s['overall_score'] < 60]
        if critical_skills:
            content += f"""
🚨 **{len(critical_skills)} skills require immediate attention**
"""
            for skill in critical_skills[:5]:  # Show top 5
                content += f"- {skill['skill_name']} (Score: {skill['overall_score']})\n"
            if len(critical_skills) > 5:
                content += f"- ... and {len(critical_skills) - 5} more critical skills\n"
        else:
            content += "\n✅ No critical compliance issues detected\n"

        content += f"""
## Next Steps
1. **Review Critical Skills** → Address {self.ecosystem_metrics.get('critical_count', 0)} skills scoring < 60
2. **Implement Quick Wins** → Fix common issues across multiple skills
3. **Schedule Follow-up** → Re-audit in 30 days
4. **Update Standards** → Revise standards if patterns emerge

## Reports Generated
- **Executive Dashboard:** `final-report/executive-dashboard.md`
- **Technical Findings:** `final-report/technical-findings.md`
- **Remediation Roadmap:** `final-report/remediation-roadmap.md`
- **Compliance Matrix:** `aggregated-results/compliance-matrix.csv`

**Archive Location:** `docs/audit-results/lidr-ecosystem-audit-{timestamp}-{version}.tar.gz`
"""

        dashboard_file.write_text(content)
        print(f"📄 Executive dashboard: {dashboard_file}")

    def generate_technical_findings(self) -> None:
        """Generate detailed technical findings report"""
        print("🔧 Generating technical findings report...")

        findings_file = self.final_report_dir / "technical-findings.md"

        content = f"""# Technical Audit Findings
**Detailed Results by Category**

## Skills Requiring Immediate Action
"""

        # Critical and needs improvement skills
        problem_skills = [s for s in self.consolidated_scores if s['overall_score'] < 70]
        problem_skills.sort(key=lambda x: x['overall_score'])

        for skill in problem_skills:
            content += f"""
### {skill['skill_name']}
- **Overall Score:** {skill['overall_score']}/100
- **Agent:** {skill['agent_id']}
- **Status:** {skill['status']}
- **Priority:** {"CRITICAL" if skill['overall_score'] < 60 else "HIGH"}
"""
            if skill.get('critical_issues'):
                content += "- **Issues:** " + ", ".join(skill['critical_issues']) + "\n"
            if skill.get('recommendations'):
                content += "- **Recommendations:** " + ", ".join(skill['recommendations']) + "\n"

        # Common issues analysis
        content += """
## Common Issues Identified
Based on analysis across all agents:

### Frontmatter Issues
- Missing or incorrect field formats
- Inconsistent versioning patterns
- Deprecated field usage

### Domain-Agnostic Violations
- Company-specific terminology usage
- Product name references
- Industry-specific examples

### Structure & Documentation
- Inconsistent markdown hierarchy
- Missing required sections
- Broken cross-references

## Category Performance Analysis
"""

        # Calculate average scores per category
        categories = ['frontmatter', 'domain_agnostic', 'description', 'structure',
                     'phase_alignment', 'automation', 'references', 'language']

        for category in categories:
            scores = []
            for skill in self.consolidated_scores:
                category_scores = skill.get('category_scores', {})
                if category in category_scores:
                    scores.append(category_scores[category])

            if scores:
                avg_score = round(statistics.mean(scores), 1)
                content += f"- **{category.replace('_', ' ').title()}:** {avg_score}/100 average\n"

        findings_file.write_text(content)
        print(f"📄 Technical findings: {findings_file}")

    def generate_remediation_roadmap(self) -> None:
        """Generate prioritized remediation roadmap"""
        print("🗺️  Generating remediation roadmap...")

        roadmap_file = self.final_report_dir / "remediation-roadmap.md"

        content = """# Remediation Roadmap
**Prioritized improvement plan based on audit findings**

"""

        for phase in self.remediation_priorities:
            content += f"""## Phase {phase['phase']}: {phase['title']}
**Priority:** {phase['priority']} - {phase['description']}

"""
            if phase['skills']:
                for skill in phase['skills'][:10]:  # Show top 10 per phase
                    current_score = skill['overall_score']
                    target_score = 85 if current_score < 60 else (current_score + 15)
                    content += f"- [ ] Fix {skill['skill_name']} (Current: {current_score}/100, Target: {target_score}+)\n"

                if len(phase['skills']) > 10:
                    content += f"- ... and {len(phase['skills']) - 10} more skills\n"

                content += f"\n**Estimated Effort:** {phase['estimated_hours']} hours\n\n"
            else:
                content += "✅ No skills in this category\n\n"

        # Success metrics
        content += """## Success Metrics
- [ ] **Critical Skills:** 0 skills scoring < 60
- [ ] **Compliance Rate:** 95%+ skills scoring ≥ 70
- [ ] **Excellence Rate:** 60%+ skills scoring ≥ 90
- [ ] **Follow-up Audit:** Improved scores in all categories

## Implementation Timeline
- **Week 1:** Focus on critical fixes (< 60 score)
- **Week 2-3:** Address improvement needs (60-79 score)
- **Week 4:** Optimize good skills (80-89 score)
- **Week 5:** Re-audit and validate improvements
"""

        roadmap_file.write_text(content)
        print(f"📄 Remediation roadmap: {roadmap_file}")

    def save_aggregation_metadata(self) -> None:
        """Save aggregation metadata for future reference"""
        metadata = {
            'aggregation_timestamp': datetime.now(timezone.utc).isoformat(),
            'workspace_path': str(self.workspace),
            'agents_processed': len(self.agent_results),
            'skills_aggregated': len(self.consolidated_scores),
            'ecosystem_metrics': self.ecosystem_metrics,
            'conflicts_detected': self.detect_conflicts(),
            'remediation_phases': len(self.remediation_priorities)
        }

        metadata_file = self.aggregated_results_dir / "aggregation-metadata.json"
        with open(metadata_file, 'w') as f:
            json.dump(metadata, f, indent=2)

        print(f"💾 Saved aggregation metadata: {metadata_file}")

    def run_full_aggregation(self) -> bool:
        """Execute complete result aggregation workflow"""
        print("🚀 Starting multi-agent audit result aggregation...")

        try:
            # Step 1: Collect all agent results
            if not self.collect_agent_results():
                print("❌ Failed to collect agent results")
                return False

            # Step 2: Merge compliance data
            self.merge_compliance_data()

            # Step 3: Calculate ecosystem metrics
            self.calculate_ecosystem_metrics()

            # Step 4: Detect conflicts
            conflicts = self.detect_conflicts()
            if conflicts:
                print(f"⚠️  {len(conflicts)} conflicts detected - review required")

            # Step 5: Generate remediation priorities
            self.generate_remediation_priorities()

            # Step 6: Generate all reports
            self.generate_executive_dashboard()
            self.generate_technical_findings()
            self.generate_remediation_roadmap()

            # Step 7: Save metadata
            self.save_aggregation_metadata()

            print("✅ Multi-agent audit aggregation completed successfully!")
            print(f"📁 Results available in: {self.workspace}")

            # Print summary
            print(f"""
📊 AGGREGATION SUMMARY:
   • Total Skills: {self.ecosystem_metrics.get('total_skills_audited', 0)}
   • Average Score: {self.ecosystem_metrics.get('average_score', 0)}/100
   • Compliance Rate: {self.ecosystem_metrics.get('compliance_rate', 0)}%
   • Critical Issues: {self.ecosystem_metrics.get('critical_count', 0)} skills
   • Agents Processed: {len(self.agent_results)}
   • Total Time: {self.ecosystem_metrics.get('total_audit_time', 0)}s
""")

            return True

        except Exception as e:
            print(f"❌ Aggregation failed with error: {e}")
            import traceback
            traceback.print_exc()
            return False

def main():
    """CLI entry point for result aggregation"""
    if len(sys.argv) != 2:
        print("Usage: python aggregate_results.py <workspace_path>")
        sys.exit(1)

    workspace_path = sys.argv[1]

    if not os.path.exists(workspace_path):
        print(f"❌ Workspace path does not exist: {workspace_path}")
        sys.exit(1)

    aggregator = AuditResultAggregator(workspace_path)
    success = aggregator.run_full_aggregation()

    sys.exit(0 if success else 1)

if __name__ == "__main__":
    main()