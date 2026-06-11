#!/usr/bin/env python3
"""
Changelog Generator for Release Notes Automation
===============================================

Part of the LIDR SDLC Automation Suite
Transforms git analysis into comprehensive release notes with business impact

This script generates release notes from git analysis results:
1. Loads git analysis from git-analyzer.py output
2. Applies business impact categorization and prioritization
3. Generates executive summary for stakeholders
4. Creates technical changelog for engineering teams
5. Exports structured release notes + deployment guidance

Usage:
    python changelog-generator.py [--input-dir path] [--output-dir path] [--version x.y.z]

Dependencies:
    - git analysis results from git-analyzer.py
    - release note templates
    - business impact classification patterns

Domain configuration is DOMAIN-AGNOSTIC by default. LIDR is a multi-industry
framework, so the built-in business-impact and domain pattern sets are generic
(cross-industry). To target a specific industry, pass a domain pattern pack via
--domain-patterns (or BusinessImpactClassifier(domain_patterns=...)).

An overridable EXAMPLE industry pack (biometric identity) is preserved as the
BIOMETRIC_EXAMPLE_DOMAIN_PATTERNS constant and as a sibling file
`changelog-generator.biometric-example.json` (same schema as any override). It is
an example only — NOT the active default.
"""

import os
import sys
import json
import logging
import argparse
import re
from pathlib import Path
from dataclasses import dataclass, asdict
from typing import List, Dict, Any, Optional
from datetime import datetime

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(levelname)s: %(message)s')
logger = logging.getLogger(__name__)

@dataclass
class BusinessImpactCategory:
    """Business impact categorization"""
    category: str
    priority: int  # 1 = highest impact
    user_facing: bool
    description: str
    changes: List[str]

@dataclass
class ReleaseSection:
    """Section of release notes"""
    title: str
    subtitle: str
    priority: int
    changes: List[str]
    technical_notes: List[str]
    migration_required: bool

@dataclass
class DeploymentGuidance:
    """Deployment-specific guidance"""
    breaking_changes: List[str]
    migration_steps: List[str]
    rollback_considerations: List[str]
    testing_requirements: List[str]
    infrastructure_changes: List[str]

@dataclass
class ReleaseNotes:
    """Complete release notes structure"""
    version: str
    release_date: str
    git_range: str
    executive_summary: str
    business_impact_summary: str
    sections: List[ReleaseSection]
    deployment_guidance: DeploymentGuidance
    contributors: List[str]
    statistics: Dict[str, Any]

class BusinessImpactClassifier:
    """Classifier for business impact of changes.

    The classifier is DOMAIN-AGNOSTIC. General (cross-industry) business impact
    categories live in ``BUSINESS_IMPACT_PATTERNS``. The active default domain
    categories in ``DEFAULT_DOMAIN_PATTERNS`` are also generic / cross-industry
    (core capability, compliance, integration). To specialize the tool for a
    specific vertical (fintech, healthcare, biometric identity, e-commerce,
    etc.), pass a ``domain_patterns`` dict to the constructor (or point it at a
    JSON file via ``domain_patterns_path``) without editing this file — see the
    overridable ``BIOMETRIC_EXAMPLE_DOMAIN_PATTERNS`` constant and the sibling
    ``changelog-generator.biometric-example.json`` for an example. When no
    override is provided, the generic default set is used.
    """

    BUSINESS_IMPACT_PATTERNS = {
        'high_value_features': {
            'priority': 1,
            'user_facing': True,
            'patterns': [
                r'new.*feature', r'add.*functionality', r'introduce.*capability',
                r'support.*for', r'enable.*users', r'capability.*enhancement',
                r'authentication.*improvement', r'onboarding.*flow',
                r'processing.*speed', r'accuracy.*improvement'
            ],
            'description': 'New features and capabilities that directly benefit users'
        },
        'user_experience': {
            'priority': 2,
            'user_facing': True,
            'patterns': [
                r'ui.*improvement', r'ux.*enhancement', r'user.*interface',
                r'design.*update', r'accessibility', r'usability',
                r'responsive', r'mobile.*experience', r'workflow.*optimization'
            ],
            'description': 'User interface and experience improvements'
        },
        'critical_fixes': {
            'priority': 1,
            'user_facing': True,
            'patterns': [
                r'critical.*fix', r'security.*fix', r'vulnerability',
                r'data.*loss', r'corruption', r'crash.*fix',
                r'memory.*leak', r'performance.*critical'
            ],
            'description': 'Critical fixes addressing security, stability, or data integrity issues'
        },
        'bug_fixes': {
            'priority': 3,
            'user_facing': True,
            'patterns': [
                r'fix.*bug', r'resolve.*issue', r'correct.*behavior',
                r'repair.*functionality', r'address.*problem'
            ],
            'description': 'Bug fixes improving system reliability and user experience'
        },
        'performance': {
            'priority': 2,
            'user_facing': True,
            'patterns': [
                r'performance.*improvement', r'optimization', r'faster.*processing',
                r'reduce.*latency', r'memory.*usage', r'cpu.*optimization',
                r'database.*performance', r'cache.*improvement'
            ],
            'description': 'Performance optimizations improving system speed and efficiency'
        },
        'api_changes': {
            'priority': 2,
            'user_facing': False,
            'patterns': [
                r'api.*change', r'endpoint.*update', r'schema.*change',
                r'contract.*modification', r'integration.*update'
            ],
            'description': 'API changes affecting integrations and third-party developers'
        },
        'security_enhancements': {
            'priority': 2,
            'user_facing': False,
            'patterns': [
                r'security.*enhancement', r'encryption.*update', r'auth.*improvement',
                r'permission.*change', r'compliance.*update', r'gdpr.*compliance',
                r'audit.*trail', r'access.*control'
            ],
            'description': 'Security enhancements and compliance improvements'
        },
        'infrastructure': {
            'priority': 4,
            'user_facing': False,
            'patterns': [
                r'infrastructure.*change', r'deployment.*update', r'build.*improvement',
                r'ci.*cd.*update', r'docker.*change', r'kubernetes.*update',
                r'monitoring.*enhancement'
            ],
            'description': 'Infrastructure and deployment improvements'
        },
        'developer_experience': {
            'priority': 4,
            'user_facing': False,
            'patterns': [
                r'dev.*experience', r'developer.*tool', r'build.*tool',
                r'testing.*framework', r'documentation.*update', r'code.*quality',
                r'linting.*update', r'type.*improvement'
            ],
            'description': 'Developer tools and experience improvements'
        },
        'maintenance': {
            'priority': 5,
            'user_facing': False,
            'patterns': [
                r'maintenance', r'cleanup', r'refactor', r'code.*organization',
                r'dependency.*update', r'library.*upgrade', r'housekeeping',
                r'technical.*debt'
            ],
            'description': 'Maintenance and technical debt reduction'
        }
    }

    # ------------------------------------------------------------------ #
    # DOMAIN-AGNOSTIC DEFAULT — generic cross-industry pack.                #
    # ------------------------------------------------------------------ #
    # LIDR is a multi-industry framework, so this active default set is     #
    # DOMAIN-AGNOSTIC: it only adds generic, cross-industry impact          #
    # categories (core capabilities, regulatory compliance, integrations).  #
    # Provide your own ``domain_patterns`` dict (or a JSON file via          #
    # ``domain_patterns_path``) to the constructor to specialize the         #
    # generator for a specific industry without editing this file. The       #
    # matching mechanism in ``_classify_single_change`` is the same          #
    # regardless of which pattern set is active.                            #
    DEFAULT_DOMAIN_PATTERNS = {
        'core_capability_improvements': {
            'priority': 1,
            'user_facing': True,
            'patterns': [
                r'accuracy.*improvement', r'precision.*improvement',
                r'core.*capability', r'engine.*optimization',
                r'quality.*improvement', r'processing.*speed'
            ],
            'description': 'Core capability accuracy and performance improvements'
        },
        'compliance_updates': {
            'priority': 2,
            'user_facing': False,
            'patterns': [
                r'gdpr.*compliance', r'regulatory.*compliance', r'data.*protection',
                r'consent.*management', r'audit.*requirement', r'privacy.*update'
            ],
            'description': 'Regulatory compliance and data protection updates'
        },
        'integration_enhancements': {
            'priority': 2,
            'user_facing': False,
            'patterns': [
                r'sdk.*integration', r'api.*integration', r'platform.*integration',
                r'mobile.*sdk', r'web.*integration', r'third.*party.*integration'
            ],
            'description': 'Integration and SDK improvements'
        }
    }

    # ------------------------------------------------------------------ #
    # OVERRIDABLE EXAMPLE — biometric-identity industry pack.              #
    # ------------------------------------------------------------------ #
    # This is an EXAMPLE of an industry override, NOT the active default.  #
    # It mirrors the schema of ``DEFAULT_DOMAIN_PATTERNS`` and can be       #
    # passed to the constructor as ``domain_patterns`` (or shipped as a     #
    # JSON file and loaded via ``domain_patterns_path``) to specialize the  #
    # generator for a biometric-identity context.                          #
    BIOMETRIC_EXAMPLE_DOMAIN_PATTERNS = {
        'algorithm_improvements': {
            'priority': 1,
            'user_facing': True,
            'patterns': [
                r'algorithm.*accuracy', r'far.*improvement', r'frr.*reduction',
                r'eer.*optimization', r'liveness.*detection', r'anti.*spoofing',
                r'template.*matching', r'biometric.*quality'
            ],
            'description': 'Biometric algorithm accuracy and performance improvements'
        },
        'compliance_updates': {
            'priority': 2,
            'user_facing': False,
            'patterns': [
                r'gdpr.*compliance', r'psd2.*update', r'eidas.*support',
                r'iso.*30107', r'regulatory.*compliance', r'data.*protection',
                r'consent.*management', r'audit.*requirement'
            ],
            'description': 'Regulatory compliance and data protection updates'
        },
        'integration_enhancements': {
            'priority': 2,
            'user_facing': False,
            'patterns': [
                r'sdk.*integration', r'api.*biometric', r'platform.*integration',
                r'mobile.*sdk', r'web.*integration', r'third.*party.*integration'
            ],
            'description': 'Integration and SDK improvements for biometric capabilities'
        }
    }

    def __init__(
        self,
        domain_patterns: Optional[Dict[str, Dict[str, Any]]] = None,
        domain_patterns_path: Optional[str] = None,
    ):
        """Initialize the classifier.

        Args:
            domain_patterns: Optional industry-pack pattern set. When provided,
                it overrides the bundled ``DEFAULT_DOMAIN_PATTERNS`` example.
                Same shape as ``DEFAULT_DOMAIN_PATTERNS``
                (``{category: {priority, user_facing, patterns, description}}``).
            domain_patterns_path: Optional path to a JSON file with the same
                shape. Used only when ``domain_patterns`` is not given. If the
                file is missing or invalid, the bundled default is used.

        When neither override is supplied, the bundled default set is used so
        behavior is identical to previous versions.
        """
        if domain_patterns is None and domain_patterns_path:
            domain_patterns = self._load_domain_patterns(domain_patterns_path)

        # Keep the active set on the instance under a neutral name. Fall back to
        # the bundled example default to preserve existing behavior.
        self.domain_patterns: Dict[str, Dict[str, Any]] = (
            domain_patterns if domain_patterns is not None
            else dict(self.DEFAULT_DOMAIN_PATTERNS)
        )

    @staticmethod
    def _load_domain_patterns(path: str) -> Optional[Dict[str, Dict[str, Any]]]:
        """Load an industry-pack pattern set from a JSON file.

        Returns ``None`` (so the caller falls back to the default) if the file
        is missing or cannot be parsed.
        """
        try:
            patterns_file = Path(path)
            if not patterns_file.exists():
                logger.warning(
                    "Domain patterns file not found: %s — using default industry pack",
                    patterns_file,
                )
                return None
            with open(patterns_file, encoding='utf-8') as f:
                loaded = json.load(f)
            logger.info(
                "Loaded %d domain pattern categories from %s",
                len(loaded), patterns_file,
            )
            return loaded
        except (json.JSONDecodeError, OSError) as exc:
            logger.warning(
                "Failed to load domain patterns from %s (%s) — using default industry pack",
                path, exc,
            )
            return None

    def classify_changes(self, changes: List[Dict]) -> List[BusinessImpactCategory]:
        """Classify changes by business impact"""
        logger.info("Classifying changes by business impact...")

        categories = {}

        for change in changes:
            impact_category = self._classify_single_change(change)
            if impact_category not in categories:
                pattern_info = (
                    self.domain_patterns.get(impact_category) or
                    self.BUSINESS_IMPACT_PATTERNS.get(impact_category, {})
                )
                categories[impact_category] = BusinessImpactCategory(
                    category=impact_category,
                    priority=pattern_info.get('priority', 5),
                    user_facing=pattern_info.get('user_facing', False),
                    description=pattern_info.get('description', 'Other changes'),
                    changes=[]
                )

            categories[impact_category].changes.append(change['description'])

        # Sort by priority
        sorted_categories = sorted(categories.values(), key=lambda x: x.priority)
        logger.info(f"Classified into {len(sorted_categories)} business impact categories")

        return sorted_categories

    def _classify_single_change(self, change: Dict) -> str:
        """Classify a single change"""
        text = f"{change.get('description', '')} {change.get('business_impact', '')}".lower()

        # Check domain-specific patterns first (higher specificity)
        for category, pattern_info in self.domain_patterns.items():
            if any(re.search(pattern, text) for pattern in pattern_info['patterns']):
                return category

        # Check general business patterns
        for category, pattern_info in self.BUSINESS_IMPACT_PATTERNS.items():
            if any(re.search(pattern, text) for pattern in pattern_info['patterns']):
                return category

        # Default fallback
        if change.get('type') == 'feature':
            return 'high_value_features'
        elif change.get('type') == 'fix':
            return 'bug_fixes'
        elif change.get('type') == 'security':
            return 'security_enhancements'
        else:
            return 'maintenance'

class ChangelogGenerator:
    """Main generator for release notes and changelogs"""

    def __init__(self, input_dir: str = "release-analysis", output_dir: str = "release-notes",
                 domain_patterns_path: Optional[str] = None):
        self.input_dir = Path(input_dir)
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(exist_ok=True)

        # ``domain_patterns_path`` is optional: when omitted the classifier uses
        # its bundled example industry pack (default behavior preserved).
        self.classifier = BusinessImpactClassifier(domain_patterns_path=domain_patterns_path)
        self.git_analysis: Optional[Dict] = None

    def load_git_analysis(self) -> Dict:
        """Load git analysis from previous step"""
        logger.info("Loading git analysis...")

        analysis_file = self.input_dir / "git-analysis.json"
        if not analysis_file.exists():
            raise FileNotFoundError(f"Git analysis not found: {analysis_file}")

        with open(analysis_file) as f:
            analysis = json.load(f)

        logger.info(f"Loaded analysis with {len(analysis.get('change_categories', []))} changes")
        return analysis

    def generate_executive_summary(self, categories: List[BusinessImpactCategory]) -> str:
        """Generate executive summary for stakeholders"""
        high_impact_categories = [c for c in categories if c.priority <= 2 and c.user_facing]
        total_changes = sum(len(c.changes) for c in categories)

        if not high_impact_categories:
            return f"This release includes {total_changes} improvements focused on system maintenance and technical enhancements."

        # Identify the most significant improvements
        top_improvements = []
        for category in high_impact_categories[:3]:  # Top 3 categories
            change_count = len(category.changes)
            top_improvements.append(f"{change_count} {category.description.lower()}")

        summary_parts = [
            f"This release delivers {total_changes} improvements, featuring "
        ]

        if len(top_improvements) == 1:
            summary_parts.append(top_improvements[0])
        elif len(top_improvements) == 2:
            summary_parts.append(f"{top_improvements[0]} and {top_improvements[1]}")
        else:
            summary_parts.append(f"{', '.join(top_improvements[:-1])}, and {top_improvements[-1]}")

        summary_parts.append(".")

        # Add a highlight when a high-impact change comes from the active
        # domain pack (domain patterns) rather than the generic business
        # categories. The set of domain category keys is derived from the
        # configured ``domain_patterns`` so this stays industry-agnostic: with
        # the neutral default pack this matches the generic domain categories
        # (e.g. ``core_capability_improvements``); with a custom/industry pack it
        # matches that pack's categories instead — no code change required.
        domain_category_keys = set(self.classifier.domain_patterns.keys())
        if any(c.category in domain_category_keys for c in high_impact_categories):
            summary_parts.append(" Key highlights include enhanced core capability performance and improved user-facing workflows.")

        return ''.join(summary_parts)

    def generate_business_impact_summary(self, categories: List[BusinessImpactCategory]) -> str:
        """Generate business impact summary"""
        user_facing_categories = [c for c in categories if c.user_facing and c.changes]

        if not user_facing_categories:
            return "This release focuses on technical improvements and system maintenance."

        impact_statements = []

        for category in user_facing_categories:
            change_count = len(category.changes)
            if change_count > 0:
                if category.priority == 1:
                    impact_statements.append(f"**High Impact**: {category.description} ({change_count} improvements)")
                elif category.priority == 2:
                    impact_statements.append(f"**Medium Impact**: {category.description} ({change_count} improvements)")
                else:
                    impact_statements.append(f"**Standard Impact**: {category.description} ({change_count} improvements)")

        return "\n".join(impact_statements)

    def generate_release_sections(self, categories: List[BusinessImpactCategory]) -> List[ReleaseSection]:
        """Generate release note sections"""
        logger.info("Generating release note sections...")

        sections = []

        # Group categories by user-facing status and priority
        user_facing = [c for c in categories if c.user_facing and c.changes]
        technical = [c for c in categories if not c.user_facing and c.changes]

        # User-facing changes first
        if user_facing:
            for category in user_facing:
                section = self._create_section_from_category(category, user_facing=True)
                sections.append(section)

        # Technical changes
        if technical:
            for category in technical[:3]:  # Limit technical details
                section = self._create_section_from_category(category, user_facing=False)
                sections.append(section)

        logger.info(f"Generated {len(sections)} release sections")
        return sections

    def _create_section_from_category(self, category: BusinessImpactCategory, user_facing: bool) -> ReleaseSection:
        """Create a release section from a business impact category"""
        # Map category to section title
        title_mapping = {
            'high_value_features': '🚀 New Features',
            'user_experience': '✨ User Experience',
            'critical_fixes': '🔧 Critical Fixes',
            'bug_fixes': '🐛 Bug Fixes',
            'performance': '⚡ Performance',
            'core_capability_improvements': '🎯 Core Capability Improvements',
            'algorithm_improvements': '🎯 Algorithm Improvements',
            'compliance_updates': '📋 Compliance Updates',
            'security_enhancements': '🔒 Security',
            'api_changes': '🔌 API Changes',
            'integration_enhancements': '🔗 Integration',
            'infrastructure': '🏗️ Infrastructure',
            'developer_experience': '🛠️ Developer Experience',
            'maintenance': '🧹 Maintenance'
        }

        title = title_mapping.get(category.category, f"📝 {category.category.replace('_', ' ').title()}")
        subtitle = category.description

        # Limit number of changes shown (most important first)
        displayed_changes = category.changes[:5]
        if len(category.changes) > 5:
            displayed_changes.append(f"...and {len(category.changes) - 5} more improvements")

        # Generate technical notes for high-priority items
        technical_notes = []
        if category.priority <= 2:
            technical_notes.append(f"Includes {len(category.changes)} changes in this area")
            if category.category in ('core_capability_improvements', 'algorithm_improvements'):
                technical_notes.append("Performance impact: Improved accuracy and reduced processing time")
            elif category.category == 'security_enhancements':
                technical_notes.append("Security impact: Enhanced data protection and compliance")

        # Migration required for breaking changes or API changes
        migration_required = (
            category.category in ['api_changes', 'critical_fixes'] or
            any('breaking' in change.lower() for change in category.changes)
        )

        return ReleaseSection(
            title=title,
            subtitle=subtitle,
            priority=category.priority,
            changes=displayed_changes,
            technical_notes=technical_notes,
            migration_required=migration_required
        )

    def generate_deployment_guidance(self, analysis: Dict) -> DeploymentGuidance:
        """Generate deployment guidance"""
        logger.info("Generating deployment guidance...")

        breaking_changes = analysis.get('breaking_changes', [])
        security_changes = analysis.get('security_changes', [])
        changes = analysis.get('change_categories', [])

        # Migration steps for breaking changes
        migration_steps = []
        if breaking_changes:
            migration_steps.extend([
                "Review all breaking changes listed below",
                "Update client integrations to accommodate API changes",
                "Test critical workflows in staging environment",
                "Coordinate with dependent services for simultaneous updates"
            ])

        # Rollback considerations
        rollback_considerations = [
            "Database migrations are included - ensure backup before deployment",
            "API changes may affect external integrations - coordinate rollback timing"
        ]

        if breaking_changes:
            rollback_considerations.append("Breaking changes require coordinated rollback with dependent services")

        if security_changes:
            rollback_considerations.append("Security updates should not be rolled back - address issues with hotfixes")

        # Testing requirements
        testing_requirements = [
            "Execute full regression test suite",
            "Verify critical user workflows",
            "Test API integrations and third-party connections"
        ]

        if security_changes:
            testing_requirements.append("Perform security validation testing")

        if any('core' in str(change).lower() for change in changes):
            testing_requirements.append("Validate core capability performance benchmarks")

        if any('performance' in str(change).lower() for change in changes):
            testing_requirements.append("Execute performance benchmarks and load testing")

        # Infrastructure changes
        infrastructure_changes = []
        for change in changes:
            if any(keyword in str(change).lower() for keyword in ['database', 'redis', 'kubernetes', 'docker']):
                infrastructure_changes.append("Infrastructure configuration updates may be required")
                break

        return DeploymentGuidance(
            breaking_changes=breaking_changes,
            migration_steps=migration_steps,
            rollback_considerations=rollback_considerations,
            testing_requirements=testing_requirements,
            infrastructure_changes=infrastructure_changes
        )

    def generate_statistics(self, analysis: Dict) -> Dict[str, Any]:
        """Generate release statistics"""
        changes = analysis.get('change_categories', [])

        # Count by type
        type_counts = {}
        for change in changes:
            change_type = change.get('type', 'unknown')
            type_counts[change_type] = type_counts.get(change_type, 0) + 1

        return {
            'total_changes': len(changes),
            'total_commits': analysis.get('total_commits', 0),
            'total_pull_requests': analysis.get('total_prs', 0),
            'total_contributors': analysis.get('total_contributors', 0),
            'changes_by_type': type_counts,
            'breaking_changes_count': len(analysis.get('breaking_changes', [])),
            'security_changes_count': len(analysis.get('security_changes', [])),
            'file_impact': analysis.get('file_impact_summary', {})
        }

    def generate_release_notes(self, version: str) -> ReleaseNotes:
        """Generate complete release notes"""
        logger.info(f"Generating release notes for version {version}...")

        # Load and classify changes
        categories = self.classifier.classify_changes(self.git_analysis['change_categories'])

        # Generate sections
        sections = self.generate_release_sections(categories)

        # Generate summaries
        executive_summary = self.generate_executive_summary(categories)
        business_impact_summary = self.generate_business_impact_summary(categories)

        # Generate deployment guidance
        deployment_guidance = self.generate_deployment_guidance(self.git_analysis)

        # Generate statistics
        statistics = self.generate_statistics(self.git_analysis)

        # Create release notes
        release_notes = ReleaseNotes(
            version=version,
            release_date=datetime.now().strftime("%Y-%m-%d"),
            git_range=f"{self.git_analysis.get('since_tag', 'beginning')}..HEAD",
            executive_summary=executive_summary,
            business_impact_summary=business_impact_summary,
            sections=sections,
            deployment_guidance=deployment_guidance,
            contributors=self.git_analysis.get('contributors', []),
            statistics=statistics
        )

        logger.info("Release notes generation completed")
        return release_notes

    def save_release_notes(self, release_notes: ReleaseNotes) -> Dict[str, str]:
        """Save release notes in multiple formats"""
        logger.info("Saving release notes...")

        # Save JSON for machine processing
        json_file = self.output_dir / f"release-notes-{release_notes.version}.json"
        with open(json_file, 'w', encoding='utf-8') as f:
            json.dump(asdict(release_notes), f, indent=2, ensure_ascii=False)

        # Save executive summary (business-focused)
        executive_file = self.output_dir / f"release-summary-{release_notes.version}.md"
        self._generate_executive_markdown(executive_file, release_notes)

        # Save technical changelog (engineering-focused)
        changelog_file = self.output_dir / f"CHANGELOG-{release_notes.version}.md"
        self._generate_technical_changelog(changelog_file, release_notes)

        # Save deployment guide
        deployment_file = self.output_dir / f"deployment-guide-{release_notes.version}.md"
        self._generate_deployment_guide(deployment_file, release_notes)

        # Save CSV summary for project management
        csv_file = self.output_dir / f"release-summary-{release_notes.version}.csv"
        self._generate_csv_summary(csv_file, release_notes)

        logger.info(f"Release notes saved to {self.output_dir}")

        return {
            "json_file": str(json_file),
            "executive_file": str(executive_file),
            "changelog_file": str(changelog_file),
            "deployment_file": str(deployment_file),
            "csv_file": str(csv_file)
        }

    def _generate_executive_markdown(self, file_path: Path, release_notes: ReleaseNotes):
        """Generate executive summary markdown (business-focused)"""
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(f"""---
title: "Release Summary - Version {release_notes.version}"
version: "{release_notes.version}"
release_date: "{release_notes.release_date}"
audience: "Executive, Product, Business Stakeholders"
---

# Release Summary: Version {release_notes.version}

**Release Date**: {release_notes.release_date}
**Version**: {release_notes.version}

## Executive Summary

{release_notes.executive_summary}

## Business Impact

{release_notes.business_impact_summary}

## Key Highlights

""")

            # Show only user-facing, high-priority sections
            user_facing_sections = [s for s in release_notes.sections if s.priority <= 3]

            for section in user_facing_sections[:5]:  # Top 5 sections
                f.write(f"### {section.title}\n\n")
                f.write(f"*{section.subtitle}*\n\n")

                for change in section.changes[:3]:  # Top 3 changes per section
                    f.write(f"- {change}\n")

                if len(section.changes) > 3:
                    f.write(f"- *...and {len(section.changes) - 3} additional improvements*\n")
                f.write("\n")

            if release_notes.deployment_guidance.breaking_changes:
                f.write(f"""## ⚠️ Important Notes

This release includes changes that may require coordination with your technical team:

{chr(10).join(f"- {change}" for change in release_notes.deployment_guidance.breaking_changes[:3])}

""")

            f.write(f"""## Release Statistics

- **Total Improvements**: {release_notes.statistics['total_changes']}
- **Contributors**: {release_notes.statistics['total_contributors']} team members
- **Development Activity**: {release_notes.statistics['total_commits']} commits across {release_notes.statistics['total_pull_requests']} pull requests

## Next Steps

1. Review the detailed technical changelog for complete implementation details
2. Coordinate with your technical team regarding any migration requirements
3. Plan validation testing for critical business workflows

---

**For Technical Details**: See `CHANGELOG-{release_notes.version}.md`
**For Deployment**: See `deployment-guide-{release_notes.version}.md`

*Generated on {datetime.now().strftime("%Y-%m-%d")} by the LIDR Release Notes Generator*
""")

    def _generate_technical_changelog(self, file_path: Path, release_notes: ReleaseNotes):
        """Generate technical changelog (engineering-focused)"""
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(f"""# Changelog

## [{release_notes.version}] - {release_notes.release_date}

**Git Range**: `{release_notes.git_range}`

""")

            # All sections with full technical details
            for section in release_notes.sections:
                f.write(f"### {section.title}\n\n")

                for change in section.changes:
                    f.write(f"- {change}\n")

                if section.technical_notes:
                    f.write("\n**Technical Notes**:\n")
                    for note in section.technical_notes:
                        f.write(f"- {note}\n")

                f.write("\n")

            if release_notes.deployment_guidance.breaking_changes:
                f.write(f"""### ⚠️ Breaking Changes

{chr(10).join(f"- {change}" for change in release_notes.deployment_guidance.breaking_changes)}

""")

            if release_notes.deployment_guidance.migration_steps:
                f.write(f"""### Migration Required

{chr(10).join(f"{i+1}. {step}" for i, step in enumerate(release_notes.deployment_guidance.migration_steps))}

""")

            f.write(f"""### Contributors

{chr(10).join(f"- {contributor}" for contributor in sorted(release_notes.contributors))}

### Statistics

- **Commits**: {release_notes.statistics['total_commits']}
- **Pull Requests**: {release_notes.statistics['total_pull_requests']}
- **Files Changed**: {sum(release_notes.statistics['file_impact'].values())}
- **Contributors**: {release_notes.statistics['total_contributors']}

#### Changes by Type

""")
            for change_type, count in release_notes.statistics['changes_by_type'].items():
                f.write(f"- **{change_type.title()}**: {count}\n")

            f.write(f"\n---\n\n*Generated by the LIDR Changelog Generator on {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}*\n")

    def _generate_deployment_guide(self, file_path: Path, release_notes: ReleaseNotes):
        """Generate deployment guide"""
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(f"""# Deployment Guide - Version {release_notes.version}

## Pre-Deployment Checklist

### Testing Requirements

{chr(10).join(f"- [ ] {req}" for req in release_notes.deployment_guidance.testing_requirements)}

### Infrastructure Preparation

{chr(10).join(f"- [ ] {change}" for change in release_notes.deployment_guidance.infrastructure_changes) if release_notes.deployment_guidance.infrastructure_changes else "- [ ] No infrastructure changes required"}

""")

            if release_notes.deployment_guidance.migration_steps:
                f.write(f"""## Migration Steps

{chr(10).join(f"{i+1}. {step}" for i, step in enumerate(release_notes.deployment_guidance.migration_steps))}

""")

            if release_notes.deployment_guidance.breaking_changes:
                f.write(f"""## ⚠️ Breaking Changes

{chr(10).join(f"- {change}" for change in release_notes.deployment_guidance.breaking_changes)}

""")

            f.write(f"""## Rollback Considerations

{chr(10).join(f"- {consideration}" for consideration in release_notes.deployment_guidance.rollback_considerations)}

## Post-Deployment Validation

1. **Health Checks**: Verify all services are running properly
2. **Smoke Tests**: Execute critical user workflows
3. **Performance Monitoring**: Check for any performance regressions
4. **Error Monitoring**: Monitor error rates for 24 hours post-deployment

## Support Contact

For deployment issues, contact the engineering team with:
- Version number: {release_notes.version}
- Deployment timestamp
- Error logs and system state

---

*Generated on {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}*
""")

    def _generate_csv_summary(self, file_path: Path, release_notes: ReleaseNotes):
        """Generate CSV summary for project management"""
        import csv

        with open(file_path, 'w', newline='', encoding='utf-8') as f:
            writer = csv.writer(f)
            writer.writerow(['Section', 'Priority', 'Change Count', 'Migration Required', 'User Facing'])

            for section in release_notes.sections:
                writer.writerow([
                    section.title.replace('🚀', '').replace('✨', '').replace('🔧', '').replace('🐛', '').replace('⚡', '').replace('🎯', '').replace('📋', '').replace('🔒', '').replace('🔌', '').replace('🔗', '').replace('🏗️', '').replace('🛠️', '').replace('🧹', '').strip(),
                    section.priority,
                    len(section.changes),
                    'Yes' if section.migration_required else 'No',
                    'Yes' if section.priority <= 3 else 'No'
                ])

    def run_generation(self, version: str) -> Dict[str, str]:
        """Run complete changelog generation workflow"""
        logger.info("Starting changelog generation...")

        try:
            # Load git analysis
            self.git_analysis = self.load_git_analysis()

            # Generate release notes
            release_notes = self.generate_release_notes(version)

            # Save release notes
            file_paths = self.save_release_notes(release_notes)

            logger.info("Changelog generation completed successfully!")
            return file_paths

        except Exception as e:
            logger.error(f"Generation failed: {str(e)}")
            raise

def main():
    """Main entry point"""
    parser = argparse.ArgumentParser(description="Generate release notes from git analysis")
    parser.add_argument("--input-dir", default="release-analysis", help="Input directory with git analysis")
    parser.add_argument("--output-dir", default="release-notes", help="Output directory for release notes")
    parser.add_argument("--version", required=True, help="Release version (e.g., 1.2.0)")
    parser.add_argument(
        "--domain-patterns",
        default=None,
        help=(
            "Optional path to a JSON file with an industry-specific pattern set "
            "(industry pack). Overrides the bundled example default. When omitted, "
            "the default pattern set is used."
        ),
    )

    args = parser.parse_args()

    try:
        generator = ChangelogGenerator(args.input_dir, args.output_dir, args.domain_patterns)
        file_paths = generator.run_generation(args.version)

        print("✅ Release notes generation completed successfully!")
        print(f"\n📋 Version: {args.version}")
        print("\nGenerated files:")
        for file_type, file_path in file_paths.items():
            print(f"  📄 {file_type}: {file_path}")

        return 0

    except Exception as e:
        print(f"❌ Generation failed: {str(e)}")
        return 1

if __name__ == "__main__":
    sys.exit(main())