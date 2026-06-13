#!/usr/bin/env python3
"""
Rollback Plan Deployment Analyzer v1.0

AUTOMATED ROLLBACK ANALYSIS ENGINE
- Auto-discovers PRs, database migrations, infrastructure changes, feature flags
- Analyzes rollback complexity and data loss risk
- Classifies deployment risk level (Simple/Medium/Complex/Dangerous)
- Generates deployment impact assessment with timing estimates
- Follows proven automation pattern: 4+ hours manual → 5 minutes automated

Part of the LIDR SDLC Ecosystem - Phase 2 Automation (45h/year ROI)
Following proven patterns from lidr-requirements and tech-debt skills

Domain configuration is DOMAIN-AGNOSTIC by default. LIDR is a multi-industry
framework, so the built-in domain risk-pattern set is a generic deployment
baseline (data store, public API, security, dependency and config risks). To
target a specific industry, point LIDR_DOMAIN_PATTERNS at an override JSON
(or pass --domain-patterns).

An overridable EXAMPLE industry pack (biometric identity) is preserved below as
the BIOMETRIC_EXAMPLE_DOMAIN_RISK_PATTERNS constant and as a sibling file
`deployment-analyzer.biometric-example.json` (same schema as any override). It is
an example only — NOT the active default.
"""

import os
import re
import json
import subprocess
import argparse
import logging
from pathlib import Path
from dataclasses import dataclass, asdict
from typing import List, Dict, Optional, Tuple
from datetime import datetime, timedelta

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

@dataclass
class MigrationAnalysis:
    """Database migration analysis result"""
    file: str
    type: str  # 'create_table', 'alter_table', 'data_change', 'index', 'constraint'
    reversible: bool
    risk_level: str  # 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'
    rollback_command: Optional[str]
    data_impact: str  # 'None', 'Minimal', 'Significant'
    estimated_time_minutes: int

@dataclass
class InfrastructureChange:
    """Infrastructure change analysis result"""
    file: str
    component: str  # 'kubernetes', 'terraform', 'docker', 'config'
    change_type: str  # 'create', 'update', 'delete', 'scale'
    risk_level: str
    rollback_strategy: str
    estimated_time_minutes: int

@dataclass
class FeatureFlag:
    """Feature flag analysis result"""
    name: str
    current_value: str
    rollback_value: str
    instant_rollback: bool
    effect: str

@dataclass
class PRAnalysis:
    """Pull Request analysis result"""
    number: str
    title: str
    author: str
    files_changed: int
    lines_changed: int
    breaking_changes: bool
    high_risk_files: List[str]
    business_impact: str

@dataclass
class DeploymentRiskAssessment:
    """Complete deployment risk assessment"""
    overall_complexity: str  # 'Simple', 'Medium', 'Complex', 'Dangerous'
    estimated_rollback_time_minutes: int
    data_loss_risk: str  # 'None', 'Minimal', 'Significant'
    db_migrations_reversible: bool
    feature_flag_fallback: bool
    critical_components_affected: List[str]
    risk_factors: List[str]
    mitigation_strategies: List[str]

class DeploymentAnalyzer:
    """
    Analyzes deployment changes to assess rollback complexity and generate rollback strategy

    Auto-discovers and analyzes:
    - Git PRs since last release
    - Database migrations
    - Infrastructure changes (K8s, Terraform)
    - Feature flag changes
    - Configuration updates
    """

    # Default domain risk-pattern pack — DOMAIN-AGNOSTIC generic deployment
    # baseline. These categories and regexes target deployment risks common to
    # ANY application (core service changes, public API contract changes, data
    # store / persistence changes, security posture, regulatory/compliance).
    # The matching MECHANISM is industry-agnostic; only the concrete pattern SET
    # is configurable. Override it per project by passing a JSON config path to
    # `domain_patterns_config` (or via the --domain-patterns CLI flag), or by
    # setting the LIDR_DOMAIN_PATTERNS env var to a JSON file path.
    # The JSON must mirror this structure:
    #   { "<risk_type>": { "patterns": [<regex>...],
    #                       "risk_level": "LOW|MEDIUM|HIGH|CRITICAL",
    #                       "rollback_impact": "<text>" }, ... }
    # When no override is provided, this neutral default set is used.
    DEFAULT_DOMAIN_RISK_PATTERNS = {
        'core_logic_changes': {
            'patterns': [r'core.*logic', r'business.*rule', r'processing.*engine'],
            'risk_level': 'HIGH',
            'rollback_impact': 'Core logic rollback requires functional revalidation'
        },
        'public_api_changes': {
            'patterns': [r'public.*api', r'endpoint.*contract', r'breaking.*api'],
            'risk_level': 'MEDIUM',
            'rollback_impact': 'API changes may affect client integrations'
        },
        'data_store_changes': {
            'patterns': [r'data.*store', r'schema.*migration', r'encryption.*key'],
            'risk_level': 'CRITICAL',
            'rollback_impact': 'Data store changes risk data corruption'
        },
        'security_posture_changes': {
            'patterns': [r'access.*control', r'authentication.*change', r'authorization.*change'],
            'risk_level': 'HIGH',
            'rollback_impact': 'Security changes affect security posture'
        },
        'compliance_changes': {
            'patterns': [r'gdpr.*compliance', r'consent.*management', r'audit.*trail'],
            'risk_level': 'HIGH',
            'rollback_impact': 'Compliance changes may affect regulatory approval'
        }
    }

    # ---------------------------------------------------------------------- #
    # OVERRIDABLE EXAMPLE — biometric-identity industry pack.
    #
    # This is an EXAMPLE of an industry override, NOT the active default. It
    # mirrors the schema accepted by `_load_domain_patterns` /
    # LIDR_DOMAIN_PATTERNS. The same content is also shipped as the sibling JSON
    # file `deployment-analyzer.biometric-example.json` so it can be passed via:
    #
    #   --domain-patterns .../deployment-analyzer.biometric-example.json
    #   (or)  LIDR_DOMAIN_PATTERNS=.../deployment-analyzer.biometric-example.json
    # ---------------------------------------------------------------------- #
    BIOMETRIC_EXAMPLE_DOMAIN_RISK_PATTERNS = {
        'algorithm_changes': {
            'patterns': [r'biometric.*algorithm', r'face.*recognition', r'template.*generation'],
            'risk_level': 'HIGH',
            'rollback_impact': 'Algorithm rollback requires template revalidation'
        },
        'domain_specific_api_changes': {
            'patterns': [r'verification.*endpoint', r'enroll.*api', r'match.*service'],
            'risk_level': 'MEDIUM',
            'rollback_impact': 'API changes may affect client integrations'
        },
        'template_storage': {
            'patterns': [r'template.*storage', r'biometric.*database', r'encryption.*key'],
            'risk_level': 'CRITICAL',
            'rollback_impact': 'Template storage changes risk data corruption'
        },
        'liveness_detection': {
            'patterns': [r'liveness.*detection', r'anti.*spoofing', r'pam.*detection'],
            'risk_level': 'HIGH',
            'rollback_impact': 'Liveness changes affect security posture'
        },
        'compliance_changes': {
            'patterns': [r'gdpr.*compliance', r'consent.*management', r'audit.*trail'],
            'risk_level': 'HIGH',
            'rollback_impact': 'Compliance changes may affect regulatory approval'
        }
    }

    def __init__(self, project_dir: str = ".", output_dir: str = "rollback-analysis",
                 domain_patterns_config: Optional[str] = None):
        self.project_dir = Path(project_dir).resolve()
        self.output_dir = Path(output_dir).resolve()
        self.output_dir.mkdir(parents=True, exist_ok=True)

        # Resolve overridable domain pattern pack (industry-agnostic mechanism).
        # Precedence: explicit arg > LIDR_DOMAIN_PATTERNS env var > default pack.
        self.domain_specific_risk_patterns = self._load_domain_patterns(domain_patterns_config)

        # High-risk file patterns
        self.high_risk_files = [
            r'.*migration.*\.sql',
            r'.*\.tf$',  # Terraform
            r'.*\.yaml$',  # Kubernetes
            r'.*config.*\.json',
            r'.*\.env',
            r'package\.json',
            r'requirements\.txt',
            r'Dockerfile',
            r'.*algorithm.*\.py',
            r'.*template.*\.py'
        ]

        # Infrastructure file patterns
        self.infra_patterns = {
            'kubernetes': [r'.*\.yaml$', r'.*\.yml$', r'k8s/.*', r'manifests/.*'],
            'terraform': [r'.*\.tf$', r'terraform/.*'],
            'docker': [r'Dockerfile', r'docker-compose.*\.yml'],
            'config': [r'.*config.*\.json', r'.*\.env', r'settings\.py']
        }

        # Database migration patterns
        self.migration_patterns = {
            'create_table': [r'CREATE TABLE', r'create_table'],
            'alter_table': [r'ALTER TABLE', r'add_column', r'drop_column'],
            'data_change': [r'INSERT INTO', r'UPDATE .*SET', r'DELETE FROM'],
            'index': [r'CREATE INDEX', r'DROP INDEX'],
            'constraint': [r'ADD CONSTRAINT', r'DROP CONSTRAINT']
        }

    def _load_domain_patterns(self, domain_patterns_config: Optional[str]) -> Dict:
        """Resolve the domain (industry) risk-pattern pack.

        Industry-agnostic: the concrete pattern SET is configurable. An optional
        JSON file (passed via arg or the LIDR_DOMAIN_PATTERNS env var) overrides
        the example default pack. Falls back to DEFAULT_DOMAIN_RISK_PATTERNS so
        behavior is unchanged when no override is provided.
        """
        config_path = domain_patterns_config or os.environ.get('LIDR_DOMAIN_PATTERNS')

        if config_path:
            try:
                patterns_file = Path(config_path)
                if not patterns_file.is_absolute():
                    patterns_file = (self.project_dir / patterns_file)
                if patterns_file.exists():
                    loaded = json.loads(patterns_file.read_text(encoding='utf-8'))
                    if isinstance(loaded, dict) and loaded:
                        logger.info(f"Loaded domain risk patterns from {patterns_file}")
                        return loaded
                    logger.warning(
                        f"Domain patterns file {patterns_file} is empty or invalid; using default pack"
                    )
                else:
                    logger.warning(
                        f"Domain patterns file not found: {patterns_file}; using default pack"
                    )
            except (json.JSONDecodeError, OSError) as e:
                logger.warning(f"Could not load domain patterns from {config_path}: {e}; using default pack")

        # Default example pack (preserves original behavior).
        return dict(self.DEFAULT_DOMAIN_RISK_PATTERNS)

    def discover_changes_since_last_release(self) -> Tuple[List[str], str]:
        """Auto-discover PRs merged since last release tag"""
        try:
            logger.info("Auto-discovering changes since last release...")

            # Get latest release tag
            result = subprocess.run(
                ['git', 'describe', '--tags', '--abbrev=0'],
                cwd=self.project_dir,
                capture_output=True,
                text=True
            )

            if result.returncode != 0:
                logger.warning("No release tags found, analyzing last 50 commits")
                last_tag = 'HEAD~50'
            else:
                last_tag = result.stdout.strip()

            logger.info(f"Analyzing changes since {last_tag}")

            # Get merged PRs since last tag
            pr_result = subprocess.run(
                ['git', 'log', '--merges', '--pretty=format:%H|%s|%an', f'{last_tag}..HEAD'],
                cwd=self.project_dir,
                capture_output=True,
                text=True
            )

            prs = []
            if pr_result.returncode == 0 and pr_result.stdout.strip():
                for line in pr_result.stdout.strip().split('\n'):
                    if '|' in line:
                        commit_hash, title, author = line.split('|', 2)
                        # Extract PR number from merge commit title
                        pr_match = re.search(r'#(\d+)', title)
                        if pr_match:
                            prs.append(pr_match.group(1))

            return prs, last_tag

        except Exception as e:
            logger.error(f"Error discovering changes: {e}")
            return [], "HEAD~10"

    def discover_files_in_directory(self, directory: str, patterns: List[str]) -> List[str]:
        """Discover files matching patterns in directory"""
        discovered_files = []
        search_dir = self.project_dir / directory if directory else self.project_dir

        if not search_dir.exists():
            return discovered_files

        for pattern in patterns:
            try:
                # Use pathlib glob for pattern matching
                if '*' in pattern:
                    files = search_dir.glob(pattern)
                else:
                    # Use regex matching for more complex patterns
                    files = []
                    for file_path in search_dir.rglob('*'):
                        if file_path.is_file() and re.search(pattern, str(file_path.name)):
                            files.append(file_path)

                for file_path in files:
                    if file_path.is_file():
                        discovered_files.append(str(file_path.relative_to(self.project_dir)))

            except Exception as e:
                logger.warning(f"Error processing pattern {pattern}: {e}")

        return discovered_files

    def analyze_pr(self, pr_number: str) -> Optional[PRAnalysis]:
        """Analyze specific PR for rollback complexity"""
        try:
            # Get PR details using git show (if available) or log
            result = subprocess.run(
                ['git', 'show', '--stat', '--pretty=format:%s|%an', f'HEAD~{int(pr_number) if pr_number.isdigit() else 10}'],
                cwd=self.project_dir,
                capture_output=True,
                text=True
            )

            if result.returncode != 0:
                return None

            lines = result.stdout.strip().split('\n')
            if not lines:
                return None

            # Parse commit info
            title_author = lines[0].split('|', 1)
            title = title_author[0] if title_author else f"PR #{pr_number}"
            author = title_author[1] if len(title_author) > 1 else "Unknown"

            # Count files and lines changed
            files_changed = 0
            lines_changed = 0
            high_risk_files = []

            for line in lines[1:]:
                if '|' in line and ('+' in line or '-' in line):
                    files_changed += 1
                    file_match = re.search(r'(\S+)\s+\|', line)
                    if file_match:
                        filename = file_match.group(1)
                        # Check if high risk file
                        for pattern in self.high_risk_files:
                            if re.search(pattern, filename):
                                high_risk_files.append(filename)
                                break

                    # Extract lines changed
                    numbers = re.findall(r'\d+', line.split('|')[1] if '|' in line else '')
                    if numbers:
                        lines_changed += sum(int(n) for n in numbers)

            # Check for breaking changes
            breaking_changes = any(
                keyword in title.lower()
                for keyword in ['breaking', 'break', 'major', 'critical', 'migration']
            )

            # Classify business impact
            business_impact = self._classify_business_impact(title, high_risk_files)

            return PRAnalysis(
                number=pr_number,
                title=title,
                author=author,
                files_changed=files_changed,
                lines_changed=lines_changed,
                breaking_changes=breaking_changes,
                high_risk_files=high_risk_files,
                business_impact=business_impact
            )

        except Exception as e:
            logger.error(f"Error analyzing PR {pr_number}: {e}")
            return None

    def _classify_business_impact(self, title: str, high_risk_files: List[str]) -> str:
        """Classify business impact of changes"""
        title_lower = title.lower()

        # High impact keywords
        if any(keyword in title_lower for keyword in [
            'algorithm', 'security', 'performance', 'api', 'breaking', 'critical'
        ]):
            return 'HIGH'

        # Medium impact
        if any(keyword in title_lower for keyword in [
            'feature', 'enhancement', 'update', 'improve'
        ]):
            return 'MEDIUM'

        # High risk files impact
        if high_risk_files:
            return 'MEDIUM'

        return 'LOW'

    def analyze_database_migrations(self) -> List[MigrationAnalysis]:
        """Auto-discover and analyze database migrations"""
        logger.info("Analyzing database migrations...")
        migrations = []

        # Common migration directories
        migration_dirs = ['migrations', 'db/migrations', 'database/migrations', 'prisma/migrations']
        migration_files = []

        for dir_name in migration_dirs:
            migration_files.extend(self.discover_files_in_directory(
                dir_name,
                ['*.sql', '*.py', '*.js', 'migration.sql']
            ))

        for migration_file in migration_files:
            try:
                file_path = self.project_dir / migration_file
                if not file_path.exists():
                    continue

                content = file_path.read_text(encoding='utf-8', errors='ignore')

                # Analyze migration type
                migration_type = 'unknown'
                reversible = True
                risk_level = 'LOW'
                rollback_command = None
                data_impact = 'None'
                estimated_time = 2  # Default 2 minutes

                for mig_type, patterns in self.migration_patterns.items():
                    if any(re.search(pattern, content, re.IGNORECASE) for pattern in patterns):
                        migration_type = mig_type
                        break

                # Assess reversibility and risk
                if migration_type == 'create_table':
                    rollback_command = f"DROP TABLE IF EXISTS {self._extract_table_name(content)}"
                elif migration_type == 'alter_table':
                    if 'DROP COLUMN' in content.upper():
                        reversible = False
                        risk_level = 'HIGH'
                        data_impact = 'Significant'
                elif migration_type == 'data_change':
                    reversible = False
                    risk_level = 'CRITICAL'
                    data_impact = 'Significant'
                    estimated_time = 10

                # Check for domain-specific risks
                for risk_type, risk_info in self.domain_specific_risk_patterns.items():
                    if any(re.search(pattern, content, re.IGNORECASE) for pattern in risk_info['patterns']):
                        risk_level = risk_info['risk_level']
                        break

                migrations.append(MigrationAnalysis(
                    file=migration_file,
                    type=migration_type,
                    reversible=reversible,
                    risk_level=risk_level,
                    rollback_command=rollback_command,
                    data_impact=data_impact,
                    estimated_time_minutes=estimated_time
                ))

            except Exception as e:
                logger.error(f"Error analyzing migration {migration_file}: {e}")

        logger.info(f"Analyzed {len(migrations)} database migrations")
        return migrations

    def _extract_table_name(self, content: str) -> str:
        """Extract table name from CREATE TABLE statement"""
        match = re.search(r'CREATE TABLE\s+(?:IF NOT EXISTS\s+)?([`"]?\w+[`"]?)', content, re.IGNORECASE)
        return match.group(1) if match else 'table_name'

    def analyze_infrastructure_changes(self) -> List[InfrastructureChange]:
        """Auto-discover and analyze infrastructure changes"""
        logger.info("Analyzing infrastructure changes...")
        changes = []

        for component, patterns in self.infra_patterns.items():
            files = []
            for pattern in patterns:
                files.extend(self.discover_files_in_directory('', [pattern]))

            for infra_file in files:
                try:
                    file_path = self.project_dir / infra_file
                    if not file_path.exists():
                        continue

                    content = file_path.read_text(encoding='utf-8', errors='ignore')

                    # Analyze change type and risk
                    change_type = self._determine_change_type(content, component)
                    risk_level = self._assess_infrastructure_risk(content, component)
                    rollback_strategy = self._determine_rollback_strategy(content, component)
                    estimated_time = self._estimate_rollback_time(component, change_type)

                    changes.append(InfrastructureChange(
                        file=infra_file,
                        component=component,
                        change_type=change_type,
                        risk_level=risk_level,
                        rollback_strategy=rollback_strategy,
                        estimated_time_minutes=estimated_time
                    ))

                except Exception as e:
                    logger.error(f"Error analyzing infrastructure file {infra_file}: {e}")

        logger.info(f"Analyzed {len(changes)} infrastructure changes")
        return changes

    def _determine_change_type(self, content: str, component: str) -> str:
        """Determine type of infrastructure change"""
        if component == 'kubernetes':
            if 'kind: Deployment' in content:
                return 'update'
            elif 'kind: Service' in content:
                return 'create'
        elif component == 'terraform':
            if 'resource ' in content:
                return 'create'
        return 'update'

    def _assess_infrastructure_risk(self, content: str, component: str) -> str:
        """Assess risk level of infrastructure change"""
        # High risk indicators
        high_risk_keywords = ['database', 'persistent', 'volume', 'stateful', 'production']
        if any(keyword in content.lower() for keyword in high_risk_keywords):
            return 'HIGH'

        # Medium risk for most changes
        if component in ['kubernetes', 'terraform']:
            return 'MEDIUM'

        return 'LOW'

    def _determine_rollback_strategy(self, content: str, component: str) -> str:
        """Determine rollback strategy for infrastructure change"""
        if component == 'kubernetes':
            return 'kubectl rollout undo deployment/<name> -n <namespace>'
        elif component == 'terraform':
            return 'terraform apply -target=<resource> with previous state'
        elif component == 'docker':
            return 'docker-compose down && docker-compose up with previous image'
        return 'Manual rollback required'

    def _estimate_rollback_time(self, component: str, change_type: str) -> int:
        """Estimate rollback time in minutes"""
        base_times = {
            'kubernetes': 3,
            'terraform': 5,
            'docker': 2,
            'config': 1
        }

        multipliers = {
            'create': 1.0,
            'update': 1.2,
            'delete': 1.5,
            'scale': 0.8
        }

        base_time = base_times.get(component, 3)
        multiplier = multipliers.get(change_type, 1.0)

        return int(base_time * multiplier)

    def discover_feature_flags(self) -> List[FeatureFlag]:
        """Auto-discover and analyze feature flags"""
        logger.info("Analyzing feature flags...")
        flags = []

        # Common feature flag file patterns
        flag_files = self.discover_files_in_directory('', [
            'config/flags.json',
            'config/features.json',
            'feature-flags.json',
            'flags.yaml',
            '*.env'
        ])

        for flag_file in flag_files:
            try:
                file_path = self.project_dir / flag_file
                if not file_path.exists():
                    continue

                content = file_path.read_text(encoding='utf-8', errors='ignore')

                # Parse different formats
                if flag_file.endswith('.json'):
                    flags.extend(self._parse_json_flags(content))
                elif flag_file.endswith('.env'):
                    flags.extend(self._parse_env_flags(content))
                elif flag_file.endswith('.yaml') or flag_file.endswith('.yml'):
                    flags.extend(self._parse_yaml_flags(content))

            except Exception as e:
                logger.error(f"Error analyzing feature flags in {flag_file}: {e}")

        logger.info(f"Discovered {len(flags)} feature flags")
        return flags

    def _parse_json_flags(self, content: str) -> List[FeatureFlag]:
        """Parse JSON feature flags"""
        flags = []
        try:
            data = json.loads(content)
            for key, value in data.items():
                if isinstance(value, bool):
                    flags.append(FeatureFlag(
                        name=key,
                        current_value=str(value).lower(),
                        rollback_value=str(not value).lower(),
                        instant_rollback=True,
                        effect=f"Toggle {key} feature"
                    ))
        except json.JSONDecodeError:
            pass
        return flags

    def _parse_env_flags(self, content: str) -> List[FeatureFlag]:
        """Parse environment variable flags"""
        flags = []
        for line in content.split('\n'):
            line = line.strip()
            if '=' in line and not line.startswith('#'):
                key, value = line.split('=', 1)
                key = key.strip()
                value = value.strip().strip('"').strip("'")

                if value.lower() in ['true', 'false', '1', '0']:
                    rollback_value = 'false' if value.lower() in ['true', '1'] else 'true'
                    flags.append(FeatureFlag(
                        name=key,
                        current_value=value,
                        rollback_value=rollback_value,
                        instant_rollback=True,
                        effect=f"Toggle {key} feature"
                    ))
        return flags

    def _parse_yaml_flags(self, content: str) -> List[FeatureFlag]:
        """Parse YAML feature flags (simple implementation)"""
        flags = []
        for line in content.split('\n'):
            line = line.strip()
            if ':' in line and not line.startswith('#'):
                key, value = line.split(':', 1)
                key = key.strip()
                value = value.strip()

                if value.lower() in ['true', 'false']:
                    rollback_value = 'false' if value.lower() == 'true' else 'true'
                    flags.append(FeatureFlag(
                        name=key,
                        current_value=value,
                        rollback_value=rollback_value,
                        instant_rollback=True,
                        effect=f"Toggle {key} feature"
                    ))
        return flags

    def assess_deployment_risk(self, prs: List[PRAnalysis], migrations: List[MigrationAnalysis],
                             infra_changes: List[InfrastructureChange], flags: List[FeatureFlag]) -> DeploymentRiskAssessment:
        """Assess overall deployment risk and rollback complexity"""
        logger.info("Assessing deployment risk...")

        # Calculate risk factors
        risk_factors = []
        critical_components = []
        mitigation_strategies = []

        # Assess PR risk
        high_impact_prs = [pr for pr in prs if pr.business_impact == 'HIGH']
        breaking_changes = any(pr.breaking_changes for pr in prs)

        if high_impact_prs:
            risk_factors.append(f"{len(high_impact_prs)} high-impact PRs")
        if breaking_changes:
            risk_factors.append("Breaking changes detected")
            critical_components.append("API compatibility")

        # Assess migration risk
        irreversible_migrations = [m for m in migrations if not m.reversible]
        high_risk_migrations = [m for m in migrations if m.risk_level in ['HIGH', 'CRITICAL']]

        if irreversible_migrations:
            risk_factors.append(f"{len(irreversible_migrations)} irreversible migrations")
            critical_components.append("Database schema")

        data_loss_risk = 'None'
        if any(m.data_impact == 'Significant' for m in migrations):
            data_loss_risk = 'Significant'
        elif any(m.data_impact == 'Minimal' for m in migrations):
            data_loss_risk = 'Minimal'

        # Assess infrastructure risk
        high_risk_infra = [i for i in infra_changes if i.risk_level == 'HIGH']
        if high_risk_infra:
            risk_factors.append(f"{len(high_risk_infra)} high-risk infrastructure changes")
            critical_components.extend([i.component for i in high_risk_infra])

        # Calculate estimated rollback time
        total_rollback_time = 5  # Base overhead
        total_rollback_time += sum(m.estimated_time_minutes for m in migrations)
        total_rollback_time += sum(i.estimated_time_minutes for i in infra_changes)
        total_rollback_time += 2 * len(prs)  # 2 minutes per PR rollback

        # Feature flag fallback availability
        feature_flag_fallback = len(flags) > 0 and any(f.instant_rollback for f in flags)

        # Determine overall complexity
        complexity_score = 0
        complexity_score += len(high_impact_prs) * 2
        complexity_score += len(irreversible_migrations) * 3
        complexity_score += len(high_risk_migrations) * 2
        complexity_score += len(high_risk_infra) * 2
        complexity_score -= len(flags) * 0.5  # Feature flags reduce complexity

        if complexity_score >= 10:
            overall_complexity = 'Dangerous'
        elif complexity_score >= 6:
            overall_complexity = 'Complex'
        elif complexity_score >= 3:
            overall_complexity = 'Medium'
        else:
            overall_complexity = 'Simple'

        # Generate mitigation strategies
        if feature_flag_fallback:
            mitigation_strategies.append("Feature flags enable instant rollback")
        if irreversible_migrations:
            mitigation_strategies.append("Database backup before deployment")
        if high_risk_infra:
            mitigation_strategies.append("Blue-green deployment for zero downtime")
        if total_rollback_time > 15:
            mitigation_strategies.append("Consider splitting deployment into phases")

        return DeploymentRiskAssessment(
            overall_complexity=overall_complexity,
            estimated_rollback_time_minutes=total_rollback_time,
            data_loss_risk=data_loss_risk,
            db_migrations_reversible=len(irreversible_migrations) == 0,
            feature_flag_fallback=feature_flag_fallback,
            critical_components_affected=list(set(critical_components)),
            risk_factors=risk_factors,
            mitigation_strategies=mitigation_strategies
        )

    def save_analysis_results(self, prs: List[PRAnalysis], migrations: List[MigrationAnalysis],
                            infra_changes: List[InfrastructureChange], flags: List[FeatureFlag],
                            risk_assessment: DeploymentRiskAssessment, last_tag: str):
        """Save complete analysis results for rollback generator"""
        logger.info("Saving analysis results...")

        # Create comprehensive analysis result
        analysis_result = {
            'analysis_metadata': {
                'timestamp': datetime.now().isoformat(),
                'analyzer_version': '1.0.0',
                'project_dir': str(self.project_dir),
                'since_release': last_tag,
                'analysis_duration_seconds': 0  # Would track in real implementation
            },
            'pull_requests': [asdict(pr) for pr in prs],
            'database_migrations': [asdict(m) for m in migrations],
            'infrastructure_changes': [asdict(i) for i in infra_changes],
            'feature_flags': [asdict(f) for f in flags],
            'risk_assessment': asdict(risk_assessment),
            'domain_specific_domain_risks': self._assess_domain_specific_risks(prs, migrations, infra_changes),
            'summary_statistics': {
                'total_prs': len(prs),
                'total_migrations': len(migrations),
                'total_infra_changes': len(infra_changes),
                'total_feature_flags': len(flags),
                'high_risk_components': len(risk_assessment.critical_components_affected),
                'reversible_migrations': sum(1 for m in migrations if m.reversible),
                'instant_rollback_available': risk_assessment.feature_flag_fallback
            }
        }

        # Save JSON for machine processing
        json_output = self.output_dir / 'deployment-analysis.json'
        with open(json_output, 'w', encoding='utf-8') as f:
            json.dump(analysis_result, f, indent=2, ensure_ascii=False)

        # Save human-readable report
        self._generate_human_readable_report(analysis_result)

        # Save CSV for project management
        self._generate_csv_summary(analysis_result)

        logger.info(f"Analysis results saved to {self.output_dir}")

    def _assess_domain_specific_risks(self, prs: List[PRAnalysis], migrations: List[MigrationAnalysis],
                              infra_changes: List[InfrastructureChange]) -> Dict:
        """Assess domain-specific deployment risks.

        Industry-agnostic: the result keys are derived from the active domain
        pattern pack (``self.domain_specific_risk_patterns``) rather than a fixed
        biometric-flavored set. Each risk type in the loaded pack becomes a
        ``<risk_type>_risk`` boolean, set True when any of its patterns match a PR
        title or a migration filename. With the neutral default pack this yields
        generic keys (e.g. ``core_logic_changes_risk``); with an override pack it
        yields that pack's keys — no code change required.
        """
        domain_specific_risks = {
            f"{risk_type}_risk": False
            for risk_type in self.domain_specific_risk_patterns
        }

        # Check PR titles against each risk type's patterns.
        for pr in prs:
            for risk_type, risk_info in self.domain_specific_risk_patterns.items():
                for pattern in risk_info.get('patterns', []):
                    if re.search(pattern, pr.title, re.IGNORECASE):
                        domain_specific_risks[f"{risk_type}_risk"] = True
                        break

        # Check migration filenames against each risk type's pattern tokens.
        # The leading alphanumeric token of each regex acts as a filename keyword
        # indicator (e.g. r'data.*store' -> 'data'), so this stays agnostic to
        # whichever pattern pack is active.
        for risk_type, risk_info in self.domain_specific_risk_patterns.items():
            keywords = set()
            for pattern in risk_info.get('patterns', []):
                token_match = re.match(r'[a-z0-9_-]+', pattern, re.IGNORECASE)
                if token_match:
                    keywords.add(token_match.group(0).lower())
            if not keywords:
                continue
            for migration in migrations:
                if any(keyword in migration.file.lower() for keyword in keywords):
                    domain_specific_risks[f"{risk_type}_risk"] = True
                    break

        return domain_specific_risks

    def _generate_human_readable_report(self, analysis_result: Dict):
        """Generate human-readable analysis report"""
        report_content = f"""# Deployment Analysis Report

**Generated:** {analysis_result['analysis_metadata']['timestamp']}
**Since Release:** {analysis_result['analysis_metadata']['since_release']}

## Executive Summary

**Overall Risk:** {analysis_result['risk_assessment']['overall_complexity']}
**Estimated Rollback Time:** {analysis_result['risk_assessment']['estimated_rollback_time_minutes']} minutes
**Data Loss Risk:** {analysis_result['risk_assessment']['data_loss_risk']}
**Feature Flag Fallback Available:** {'Yes' if analysis_result['risk_assessment']['feature_flag_fallback'] else 'No'}

## Risk Factors

{chr(10).join(f"- {factor}" for factor in analysis_result['risk_assessment']['risk_factors'])}

## Mitigation Strategies

{chr(10).join(f"- {strategy}" for strategy in analysis_result['risk_assessment']['mitigation_strategies'])}

## Component Analysis

### Pull Requests ({analysis_result['summary_statistics']['total_prs']})
"""

        for pr in analysis_result['pull_requests']:
            report_content += f"""
- **#{pr['number']}** - {pr['title']}
  - Author: {pr['author']}
  - Files changed: {pr['files_changed']}
  - Business impact: {pr['business_impact']}
  - Breaking changes: {'Yes' if pr['breaking_changes'] else 'No'}
"""

        report_content += f"""
### Database Migrations ({analysis_result['summary_statistics']['total_migrations']})
"""

        for migration in analysis_result['database_migrations']:
            report_content += f"""
- **{migration['file']}**
  - Type: {migration['type']}
  - Reversible: {'Yes' if migration['reversible'] else 'No'}
  - Risk: {migration['risk_level']}
  - Data impact: {migration['data_impact']}
"""

        report_content += f"""
### Infrastructure Changes ({analysis_result['summary_statistics']['total_infra_changes']})
"""

        for infra in analysis_result['infrastructure_changes']:
            report_content += f"""
- **{infra['file']}** ({infra['component']})
  - Change type: {infra['change_type']}
  - Risk: {infra['risk_level']}
  - Rollback strategy: {infra['rollback_strategy']}
"""

        # Save the report
        report_path = self.output_dir / 'deployment-analysis-report.md'
        with open(report_path, 'w', encoding='utf-8') as f:
            f.write(report_content)

    def _generate_csv_summary(self, analysis_result: Dict):
        """Generate CSV summary for project management"""
        csv_content = "Component,Type,Risk_Level,Reversible,Estimated_Time_Minutes,Impact\n"

        # Add PRs
        for pr in analysis_result['pull_requests']:
            csv_content += f"PR #{pr['number']},{pr['business_impact']},MEDIUM,Yes,2,{pr['title'][:50]}\n"

        # Add migrations
        for migration in analysis_result['database_migrations']:
            reversible = 'Yes' if migration['reversible'] else 'No'
            csv_content += f"Migration,{migration['type']},{migration['risk_level']},{reversible},{migration['estimated_time_minutes']},{migration['file']}\n"

        # Add infrastructure
        for infra in analysis_result['infrastructure_changes']:
            csv_content += f"Infrastructure,{infra['change_type']},{infra['risk_level']},Depends,{infra['estimated_time_minutes']},{infra['file']}\n"

        # Save CSV
        csv_path = self.output_dir / 'deployment-analysis-summary.csv'
        with open(csv_path, 'w', encoding='utf-8') as f:
            f.write(csv_content)

def main():
    """Main execution function"""
    parser = argparse.ArgumentParser(description="Deployment Analysis for Rollback Planning")
    parser.add_argument('--project-dir', '-p', default='.',
                      help='Project directory to analyze (default: current directory)')
    parser.add_argument('--output-dir', '-o', default='rollback-analysis',
                      help='Output directory for analysis results (default: rollback-analysis)')
    parser.add_argument('--since-tag', '-s',
                      help='Analyze changes since specific tag (auto-detects latest if not provided)')
    parser.add_argument('--domain-patterns', '-d',
                      help='Path to a JSON file overriding the domain (industry) risk-pattern pack '
                           '(falls back to the built-in example pack; also reads LIDR_DOMAIN_PATTERNS env var)')
    parser.add_argument('--verbose', '-v', action='store_true',
                      help='Enable verbose logging')

    args = parser.parse_args()

    if args.verbose:
        logging.getLogger().setLevel(logging.DEBUG)

    # Initialize analyzer
    analyzer = DeploymentAnalyzer(args.project_dir, args.output_dir, args.domain_patterns)

    try:
        # Auto-discover changes
        if args.since_tag:
            prs = [args.since_tag]  # Would need PR discovery logic here
            last_tag = args.since_tag
        else:
            prs, last_tag = analyzer.discover_changes_since_last_release()

        logger.info(f"Analyzing {len(prs)} PRs since {last_tag}")

        # Analyze each component
        pr_analyses = []
        for pr_number in prs:
            pr_analysis = analyzer.analyze_pr(pr_number)
            if pr_analysis:
                pr_analyses.append(pr_analysis)

        migrations = analyzer.analyze_database_migrations()
        infra_changes = analyzer.analyze_infrastructure_changes()
        flags = analyzer.discover_feature_flags()

        # Assess overall risk
        risk_assessment = analyzer.assess_deployment_risk(pr_analyses, migrations, infra_changes, flags)

        # Save results
        analyzer.save_analysis_results(pr_analyses, migrations, infra_changes, flags, risk_assessment, last_tag)

        # Print summary
        print(f"\n✅ Deployment Analysis Complete")
        print(f"📊 Overall Complexity: {risk_assessment.overall_complexity}")
        print(f"⏱️  Estimated Rollback Time: {risk_assessment.estimated_rollback_time_minutes} minutes")
        print(f"🔄 Reversible: {'Yes' if risk_assessment.db_migrations_reversible else 'No'}")
        print(f"🚩 Feature Flag Fallback: {'Available' if risk_assessment.feature_flag_fallback else 'Not Available'}")
        print(f"📁 Results saved to: {analyzer.output_dir}")

        if risk_assessment.overall_complexity in ['Complex', 'Dangerous']:
            print(f"\n⚠️  WARNING: {risk_assessment.overall_complexity} deployment detected")
            print("Consider additional review and phased deployment approach")

        return 0

    except Exception as e:
        logger.error(f"Analysis failed: {e}")
        return 1

if __name__ == '__main__':
    exit(main())