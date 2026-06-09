#!/usr/bin/env python3
"""
{{CLIENT_NAME}} RF Slicer and User Story Generator
Automatically slices large RFs into INVEST-compliant User Stories with BDD scenarios.
"""

import json
import os
import re
import argparse
import sys
from pathlib import Path
from typing import Dict, List, Set, Optional, Tuple
from dataclasses import dataclass, asdict, field
from enum import Enum
from datetime import datetime
import yaml

# Tracking tool used as the export/format identifier for generated artifacts.
# Defaults to the current tool so existing behavior is preserved byte-for-byte;
# override via the LIDR_TRACKING_TOOL environment variable.
TRACKING_TOOL = os.getenv("LIDR_TRACKING_TOOL", "jira")

class UserStorySize(Enum):
    SMALL = "S"      # 2-8h
    MEDIUM = "M"     # 8-24h
    LARGE = "L"      # 24-40h
    EXTRA_LARGE = "XL"  # >40h

class Priority(Enum):
    MUST = "Must"
    SHOULD = "Should"
    COULD = "Could"

class SlicingPattern(Enum):
    VERTICAL_PATH = "Vertical Path"
    WORKFLOW_STEPS = "Workflow Steps"
    CRUD_OPERATIONS = "CRUD Operations"
    USER_ROLES = "User Roles"
    BUSINESS_RULES = "Business Rules"
    DATA_VARIATIONS = "Data Variations"
    INTERFACE_SIMPLE_TO_COMPLEX = "Interface Simple-to-Complex"
    ACCEPTANCE_CRITERIA = "Acceptance Criteria"

@dataclass
class BDDScenario:
    name: str
    given: List[str]
    when: List[str]
    then: List[str]
    scenario_type: str = "normal"  # normal, outline, background

@dataclass
class RequirementFunction:
    id: str
    title: str
    description: str
    acceptance_criteria: List[str]
    bdd_scenarios: List[BDDScenario]
    dependencies: List[str]
    estimated_hours: int
    complexity_factors: List[str] = field(default_factory=list)
    personas: List[str] = field(default_factory=list)
    business_value: str = ""
    technical_notes: str = ""

@dataclass
class UserStory:
    id: str
    title: str
    actor: str
    action: str
    business_value: str
    rf_origin: str
    priority: Priority
    estimated_hours_min: int
    estimated_hours_max: int
    bdd_scenarios: List[BDDScenario] = field(default_factory=list)
    technical_notes: str = ""
    dependencies: List[str] = field(default_factory=list)
    subtasks: List[str] = field(default_factory=list)
    definition_of_done: List[str] = field(default_factory=list)
    slicing_pattern: Optional[SlicingPattern] = None
    slice_index: int = 1
    total_slices: int = 1

# ---------------------------------------------------------------------------
# Industry pack (overridable default)
#
# LIDR is a multi-industry framework, so the concrete domain vocabulary below
# is only an EXAMPLE industry pack (here: biometric / identity verification).
# It is the fallback used when no override is supplied, which keeps behavior
# byte-for-byte identical to previous versions. To target another industry,
# pass `domain_config=` to RFSlicer(...) or point LIDR_DOMAIN_CONFIG at a JSON
# file with any subset of these keys; missing keys fall back to this default.
#
# Keys:
#   patterns             -> category -> list of matching keywords
#   complexity_keywords  -> keywords that bump domain complexity hours
#   complexity_factor    -> keyword list for the "Domain-Specific Processing" factor
#   phrases              -> neutral business-value / action strings (see usage)
# ---------------------------------------------------------------------------
DEFAULT_DOMAIN_CONFIG = {
    # Example industry pack: biometric / identity verification.
    'patterns': {
        'onboarding': ['registration', 'enrollment', 'signup', 'alta'],
        'authentication': ['login', 'verify', 'authenticate', 'verificar'],
        'document_processing': ['ocr', 'document', 'dni', 'passport', '{{PRODUCT_NAME_1}}d'],
        'facial_recognition': ['face', 'facial', 'liveness', '{{PRODUCT_NAME_1}}', 'selfie'],
        'voice_verification': ['voice', 'vocal', 'speech', 'audio'],
        'admin_operations': ['admin', 'configure', 'manage', 'dashboard'],
    },
    # Keywords that signal domain-heavy processing (extra estimation hours).
    'complexity_keywords': ['facial', 'voice', 'domain-specific', 'liveness', 'ocr', 'template'],
    # Keyword list backing the "Domain-Specific Processing" complexity factor.
    'complexity_factor': ['domain-specific', 'facial', 'voice', 'liveness', 'template'],
    # Neutral business-value / action phrases inferred when the RF does not
    # state them explicitly. Override these to drop industry-specific wording.
    'phrases': {
        'value_verification': "verify the user's identity securely and quickly",
        'value_onboarding': "enable an efficient and secure user onboarding process",
        'value_security': "protect against fraud and comply with security regulations",
        'value_default': "improve the user experience in the biometric system",
        'value_security_factor': "guarantee the security and protection of biometric data",
        'value_performance_factor': "obtain fast and efficient results in the biometric process",
        'value_compliance_factor': "comply with privacy and data protection regulations",
        'value_generic_factor': "improve the user experience and security in the system",
        'action_register': 'register biometric data',
        'action_capture': 'capture biometric information',
        'action_analyze': 'analyze biometric data',
        'action_facial': 'verify facial identity',
        'action_document': 'process the identity document',
        'action_voice': 'verify voice identity',
        'action_default': 'use biometric functionality',
    },
}


def _load_domain_config(domain_config: Optional[Dict] = None) -> Dict:
    """Resolve the active industry pack.

    Resolution order (later steps only fill keys not already provided):
      1. explicit ``domain_config`` argument
      2. JSON file referenced by the ``LIDR_DOMAIN_CONFIG`` env variable
      3. ``DEFAULT_DOMAIN_CONFIG`` (the example biometric industry pack)

    Any subset of keys may be supplied; missing keys fall back to the default,
    so an empty/absent override reproduces the original behavior exactly.
    """
    resolved: Dict = {key: value for key, value in DEFAULT_DOMAIN_CONFIG.items()}

    override: Dict = {}
    config_path = os.getenv("LIDR_DOMAIN_CONFIG")
    if config_path and Path(config_path).exists():
        try:
            override = json.loads(Path(config_path).read_text(encoding='utf-8')) or {}
        except (json.JSONDecodeError, OSError):
            override = {}

    if domain_config:
        # Explicit argument takes precedence over the env-provided file.
        override = {**override, **domain_config}

    for key, value in override.items():
        if value is not None:
            resolved[key] = value

    # Ensure the phrases dict keeps default entries for any keys not overridden.
    merged_phrases = {key: value for key, value in DEFAULT_DOMAIN_CONFIG['phrases'].items()}
    merged_phrases.update(resolved.get('phrases') or {})
    resolved['phrases'] = merged_phrases

    return resolved


class RFSlicer:
    def __init__(self, project_code: str = "{{CLIENT_CODE_UPPER}}", domain_config: Optional[Dict] = None):
        self.project_code = project_code
        self.rfs: Dict[str, RequirementFunction] = {}
        self.user_stories: Dict[str, UserStory] = {}

        # Active industry pack (overridable default — see DEFAULT_DOMAIN_CONFIG).
        # With no override this reproduces the previous biometric vocabulary.
        self._domain_config = _load_domain_config(domain_config)

        # Domain category -> matching keywords (overridable default).
        self.domain_patterns = self._domain_config['patterns']
        # Keywords used by complexity estimation / factor detection (overridable).
        self.domain_keywords = self._domain_config['complexity_keywords']
        self.domain_complexity_factor_keywords = self._domain_config['complexity_factor']
        # Neutral inferred phrases (overridable).
        self.domain_phrases = self._domain_config['phrases']

        # Slicing strategies by pattern
        self.slicing_strategies = {
            SlicingPattern.VERTICAL_PATH: self._slice_by_vertical_path,
            SlicingPattern.WORKFLOW_STEPS: self._slice_by_workflow_steps,
            SlicingPattern.CRUD_OPERATIONS: self._slice_by_crud_operations,
            SlicingPattern.USER_ROLES: self._slice_by_user_roles,
            SlicingPattern.BUSINESS_RULES: self._slice_by_business_rules,
            SlicingPattern.ACCEPTANCE_CRITERIA: self._slice_by_acceptance_criteria
        }

        # Standard DoD items for {{CLIENT_NAME}}
        self.standard_dod = [
            "Code review approved (minimum 1 peer + Tech Lead)",
            "Unit tests pass (coverage >= 80% on business logic)",
            "SAST/SCA clean (0 Critical/High vulnerabilities)",
            "PR description complete",
            "Dev->QA handoff generated and attached to the ticket",
            "Documentation updated if applicable"
        ]

    def load_requirements(self, rf_dir: str) -> bool:
        """Load RFs from generate-rf skill outputs"""
        rf_path = Path(rf_dir)
        if not rf_path.exists():
            print(f"❌ RF directory not found: {rf_path}")
            return False

        rf_files = list(rf_path.glob("RF-*.md"))
        if not rf_files:
            print(f"❌ No RF files found in {rf_path}")
            return False

        for rf_file in rf_files:
            rf = self._parse_rf_file(rf_file)
            if rf:
                self.rfs[rf.id] = rf

        print(f"✅ Loaded {len(self.rfs)} requirements from {rf_path}")
        return True

    def _parse_rf_file(self, file_path: Path) -> Optional[RequirementFunction]:
        """Parse an RF markdown file to extract requirement data"""
        try:
            content = file_path.read_text(encoding='utf-8')

            # Extract frontmatter if present
            frontmatter = {}
            if content.startswith('---'):
                parts = content.split('---', 2)
                if len(parts) >= 3:
                    try:
                        frontmatter = yaml.safe_load(parts[1])
                        content = parts[2]
                    except yaml.YAMLError:
                        pass

            # Extract RF ID from filename or content
            rf_id = frontmatter.get('id', file_path.stem)

            # Extract title (first # heading)
            title_match = re.search(r'^#\s+(.+)$', content, re.MULTILINE)
            title = title_match.group(1) if title_match else rf_id

            # Extract description (content after title before first ##)
            desc_match = re.search(r'^#\s+.+?\n\n(.*?)(?=##|$)', content, re.DOTALL | re.MULTILINE)
            description = desc_match.group(1).strip() if desc_match else ""

            # Extract acceptance criteria
            criteria_section = re.search(
                r'##\s*(?:Criterios?|Criteria|Acceptance).*?\n(.*?)(?=##|$)',
                content, re.DOTALL | re.IGNORECASE
            )
            acceptance_criteria = []
            if criteria_section:
                criteria_text = criteria_section.group(1)
                # Extract numbered or bulleted criteria
                criteria_matches = re.findall(r'(?:^\d+\.|^[*-])\s*(.+)', criteria_text, re.MULTILINE)
                acceptance_criteria = [criterion.strip() for criterion in criteria_matches]

            # Extract BDD scenarios
            bdd_scenarios = self._extract_bdd_scenarios(content)

            # Extract dependencies (references to other RFs)
            dependencies = re.findall(r'RF-[\w]+-\d+', content)
            dependencies = [dep for dep in dependencies if dep != rf_id]

            # Estimate complexity and hours
            estimated_hours = self._estimate_rf_complexity(content, title, acceptance_criteria, bdd_scenarios)

            # Extract complexity factors
            complexity_factors = self._identify_complexity_factors(content)

            # Extract personas (actors)
            personas = self._extract_personas(content)

            # Extract business value
            business_value = self._extract_business_value(content, description)

            return RequirementFunction(
                id=rf_id,
                title=title.strip(),
                description=description,
                acceptance_criteria=acceptance_criteria,
                bdd_scenarios=bdd_scenarios,
                dependencies=list(set(dependencies)),
                estimated_hours=estimated_hours,
                complexity_factors=complexity_factors,
                personas=personas,
                business_value=business_value,
                technical_notes=frontmatter.get('technical_notes', '')
            )

        except Exception as e:
            print(f"❌ Error parsing RF file {file_path}: {e}")
            return None

    def _extract_bdd_scenarios(self, content: str) -> List[BDDScenario]:
        """Extract BDD scenarios from RF content"""
        scenarios = []

        # Pattern to match complete BDD scenarios
        scenario_pattern = r'(?:^|\n)(?:Scenario|Escenario)(?:\s+Outline)?:\s*(.+?)\n(.*?)(?=\n(?:Scenario|Escenario)|$)'

        scenario_matches = re.finditer(scenario_pattern, content, re.DOTALL | re.MULTILINE | re.IGNORECASE)

        for match in scenario_matches:
            scenario_name = match.group(1).strip()
            scenario_content = match.group(2).strip()

            # Extract Given/When/Then statements
            given_statements = re.findall(r'(?:Given|Dado)\s+(.+)', scenario_content, re.IGNORECASE)
            when_statements = re.findall(r'(?:When|Cuando)\s+(.+)', scenario_content, re.IGNORECASE)
            then_statements = re.findall(r'(?:Then|Entonces)\s+(.+)', scenario_content, re.IGNORECASE)

            if given_statements or when_statements or then_statements:
                scenario_type = "outline" if "outline" in match.group(0).lower() else "normal"
                scenarios.append(BDDScenario(
                    name=scenario_name,
                    given=given_statements,
                    when=when_statements,
                    then=then_statements,
                    scenario_type=scenario_type
                ))

        return scenarios

    def _estimate_rf_complexity(self, content: str, title: str, criteria: List[str], scenarios: List[BDDScenario]) -> int:
        """Estimate RF complexity in hours based on various factors"""
        base_hours = 8  # Base complexity

        # Factor 1: Content length
        content_factor = min(3, len(content) / 2000)  # +0-3h for content complexity

        # Factor 2: Acceptance criteria count
        criteria_factor = min(5, len(criteria) * 1.5)  # +1.5h per criterion, max 5h

        # Factor 3: BDD scenarios complexity
        scenario_factor = 0
        for scenario in scenarios:
            total_steps = len(scenario.given) + len(scenario.when) + len(scenario.then)
            scenario_factor += min(4, total_steps * 0.5)  # +0.5h per step, max 4h per scenario

        # Factor 4: Domain-specific complexity
        domain_factor = 0
        content_lower = content.lower() + title.lower()

        # domain-specific processing is more complex (keywords overridable via industry pack)
        domain_keywords = self.domain_keywords
        if any(keyword in content_lower for keyword in domain_keywords):
            domain_factor += 4

        # Security and compliance add complexity
        security_keywords = ['security', 'encryption', 'gdpr', 'compliance', 'audit']
        if any(keyword in content_lower for keyword in security_keywords):
            domain_factor += 3

        # Integration complexity
        integration_keywords = ['api', 'integration', 'webhook', 'service', 'database']
        if any(keyword in content_lower for keyword in integration_keywords):
            domain_factor += 2

        total_hours = int(base_hours + content_factor + criteria_factor + scenario_factor + domain_factor)

        # Cap at reasonable maximum
        return min(80, max(4, total_hours))

    def _identify_complexity_factors(self, content: str) -> List[str]:
        """Identify specific complexity factors in the RF"""
        factors = []
        content_lower = content.lower()

        complexity_indicators = {
            'Domain-Specific Processing': self.domain_complexity_factor_keywords,
            'Real-time Requirements': ['real-time', 'instant', 'immediate', 'live'],
            'Security Requirements': ['encrypt', 'security', 'secure', 'auth', 'crypto'],
            'Compliance Requirements': ['gdpr', 'compliance', 'regulation', 'audit', 'eidas'],
            'Integration Complexity': ['api', 'webhook', 'integration', 'external service'],
            'Database Operations': ['database', 'query', 'transaction', 'persistence'],
            'User Interface': ['ui', 'interface', 'frontend', 'responsive'],
            'Performance Requirements': ['performance', 'speed', 'latency', 'throughput'],
            'Error Handling': ['error', 'exception', 'validation', 'fallback'],
            'Multiple Platforms': ['mobile', 'web', 'desktop', 'cross-platform']
        }

        for factor_name, keywords in complexity_indicators.items():
            if any(keyword in content_lower for keyword in keywords):
                factors.append(factor_name)

        return factors

    def _extract_personas(self, content: str) -> List[str]:
        """Extract user personas/actors from RF content"""
        personas = []

        # Common {{CLIENT_NAME}} personas
        persona_patterns = [
            r'(?:usuario|user)(?:\s+(?:final|end))?',
            r'(?:cliente|customer)',
            r'(?:administrador|admin|administrator)',
            r'(?:operador|operator)',
            r'(?:agente|agent)',
            r'(?:técnico|technician|support)',
            r'(?:auditor|compliance)',
            r'(?:desarrollador|developer)'
        ]

        content_lower = content.lower()
        for pattern in persona_patterns:
            if re.search(pattern, content_lower):
                # Clean up the pattern for display
                clean_pattern = pattern.replace(r'(?:', '').replace(r')', '').replace('\\s+', ' ')
                personas.append(clean_pattern.split('|')[0])  # Take first alternative

        return list(set(personas))

    def _extract_business_value(self, content: str, description: str) -> str:
        """Extract or infer business value from RF content"""
        # Look for explicit business value statements
        value_patterns = [
            r'(?:para|to|so that|in order to)\s+(.+?)(?:\.|$)',
            r'(?:value|valor|benefit|beneficio):\s*(.+?)(?:\.|$)',
            r'(?:business|negocio)\s+(?:value|valor):\s*(.+?)(?:\.|$)'
        ]

        combined_text = description + " " + content

        for pattern in value_patterns:
            match = re.search(pattern, combined_text, re.IGNORECASE)
            if match:
                value = match.group(1).strip()
                # Clean up common non-value phrases
                if not any(phrase in value.lower() for phrase in ['poder', 'can', 'able to', 'hacerlo']):
                    return value

        # If no explicit value found, infer from domain (phrases overridable via industry pack)
        content_lower = combined_text.lower()
        if any(word in content_lower for word in ['verification', 'verify', 'authentication']):
            return self.domain_phrases['value_verification']
        elif any(word in content_lower for word in ['onboarding', 'registration', 'enrollment']):
            return self.domain_phrases['value_onboarding']
        elif any(word in content_lower for word in ['fraud', 'security', 'compliance']):
            return self.domain_phrases['value_security']
        else:
            return self.domain_phrases['value_default']

    def determine_slicing_strategy(self, rf: RequirementFunction) -> Tuple[UserStorySize, SlicingPattern]:
        """Determine the appropriate slicing strategy for an RF"""
        hours = rf.estimated_hours

        # Determine size category
        if hours <= 8:
            size = UserStorySize.SMALL
        elif hours <= 24:
            size = UserStorySize.MEDIUM
        elif hours <= 40:
            size = UserStorySize.LARGE
        else:
            size = UserStorySize.EXTRA_LARGE

        # Determine slicing pattern based on RF content and complexity
        if size == UserStorySize.SMALL:
            return size, SlicingPattern.VERTICAL_PATH  # No slicing needed

        # Analyze RF content to determine best slicing pattern
        content_analysis = (rf.description + " " + " ".join(rf.acceptance_criteria)).lower()

        # CRUD operations pattern
        if any(word in content_analysis for word in ['create', 'read', 'update', 'delete', 'crud', 'manage']):
            return size, SlicingPattern.CRUD_OPERATIONS

        # Workflow steps pattern
        if any(word in content_analysis for word in ['step', 'process', 'workflow', 'stage', 'phase']):
            return size, SlicingPattern.WORKFLOW_STEPS

        # User roles pattern
        if len(rf.personas) > 1:
            return size, SlicingPattern.USER_ROLES

        # Business rules pattern
        if any(word in content_analysis for word in ['rule', 'validation', 'condition', 'if', 'when']):
            return size, SlicingPattern.BUSINESS_RULES

        # Default to acceptance criteria slicing
        return size, SlicingPattern.ACCEPTANCE_CRITERIA

    def slice_rf_into_user_stories(self, rf: RequirementFunction, sprint_capacity_hours: int = 80) -> List[UserStory]:
        """Slice an RF into appropriate User Stories"""
        size, pattern = self.determine_slicing_strategy(rf)

        print(f"📊 Slicing {rf.id}: {rf.estimated_hours}h → {size.value} using {pattern.value}")

        if size == UserStorySize.SMALL:
            # No slicing needed - create single User Story
            return [self._create_single_user_story(rf)]

        # Apply appropriate slicing strategy
        slicing_func = self.slicing_strategies.get(pattern, self._slice_by_acceptance_criteria)
        user_stories = slicing_func(rf, size)

        # Validate stories fit in sprint capacity
        total_story_hours = sum(us.estimated_hours_max for us in user_stories)
        if total_story_hours > sprint_capacity_hours:
            print(f"⚠️  Warning: Stories total {total_story_hours}h > sprint capacity {sprint_capacity_hours}h")

        return user_stories

    def _create_single_user_story(self, rf: RequirementFunction) -> UserStory:
        """Create a single User Story from an RF (no slicing)"""
        # Choose primary persona
        actor = rf.personas[0] if rf.personas else "user"

        # Generate action from RF title
        action = self._extract_action_from_title(rf.title)

        # Use RF business value or generate one
        business_value = rf.business_value or self._generate_business_value(rf)

        # Generate User Story ID
        story_id = f"US-{self.project_code}-{len(self.user_stories) + 1:03d}"

        # Determine priority based on RF content
        priority = self._determine_priority(rf)

        # Estimate hours with range
        min_hours = max(2, rf.estimated_hours - 4)
        max_hours = rf.estimated_hours + 4

        user_story = UserStory(
            id=story_id,
            title=self._generate_story_title(rf.title),
            actor=actor,
            action=action,
            business_value=business_value,
            rf_origin=rf.id,
            priority=priority,
            estimated_hours_min=min_hours,
            estimated_hours_max=max_hours,
            bdd_scenarios=rf.bdd_scenarios.copy(),
            technical_notes=rf.technical_notes,
            dependencies=rf.dependencies.copy(),
            definition_of_done=self.standard_dod.copy(),
            slicing_pattern=SlicingPattern.VERTICAL_PATH,
            slice_index=1,
            total_slices=1
        )

        # Add RF-specific DoD items
        if any(factor in ['Security Requirements', 'Compliance Requirements'] for factor in rf.complexity_factors):
            user_story.definition_of_done.append("Security review approved by CISO")

        if any(factor in ['Performance Requirements'] for factor in rf.complexity_factors):
            user_story.definition_of_done.append("Performance testing executed and approved")

        return user_story

    def _slice_by_vertical_path(self, rf: RequirementFunction, size: UserStorySize) -> List[UserStory]:
        """Slice by vertical paths: happy path → validations → edge cases"""
        stories = []

        base_hours = rf.estimated_hours
        if size == UserStorySize.MEDIUM:
            # 2 stories: happy path + validations/errors
            hours_split = [int(base_hours * 0.6), int(base_hours * 0.4)]
            slice_names = ["Happy Path", "Validations and Errors"]
        elif size == UserStorySize.LARGE:
            # 3 stories: happy path + validations + edge cases
            hours_split = [int(base_hours * 0.4), int(base_hours * 0.4), int(base_hours * 0.2)]
            slice_names = ["Happy Path", "Validations and Errors", "Edge Cases and Optimization"]
        else:  # EXTRA_LARGE
            # 4 stories: basic + standard + advanced + polish
            hours_split = [int(base_hours * 0.3), int(base_hours * 0.3), int(base_hours * 0.25), int(base_hours * 0.15)]
            slice_names = ["Basic Functionality", "Standard Validations", "Advanced Functionality", "Optimization and Polish"]

        for i, (slice_hours, slice_name) in enumerate(zip(hours_split, slice_names)):
            story = self._create_story_slice(rf, i+1, len(slice_names), slice_name, slice_hours, SlicingPattern.VERTICAL_PATH)
            stories.append(story)

        return stories

    def _slice_by_workflow_steps(self, rf: RequirementFunction, size: UserStorySize) -> List[UserStory]:
        """Slice by workflow steps identified in the RF"""
        # Extract workflow steps from acceptance criteria or description
        workflow_steps = self._extract_workflow_steps(rf)

        if len(workflow_steps) < 2:
            # Fallback to vertical slicing
            return self._slice_by_vertical_path(rf, size)

        stories = []
        hours_per_step = rf.estimated_hours // len(workflow_steps)

        for i, step in enumerate(workflow_steps):
            story = self._create_story_slice(rf, i+1, len(workflow_steps), f"Step: {step}", hours_per_step, SlicingPattern.WORKFLOW_STEPS)
            stories.append(story)

        return stories

    def _slice_by_crud_operations(self, rf: RequirementFunction, size: UserStorySize) -> List[UserStory]:
        """Slice by CRUD operations"""
        operations = []
        content_lower = (rf.description + " " + " ".join(rf.acceptance_criteria)).lower()

        crud_patterns = {
            'Create': ['create', 'add', 'new', 'register', 'crear'],
            'Read': ['read', 'view', 'display', 'list', 'get', 'leer'],
            'Update': ['update', 'edit', 'modify', 'change', 'actualizar'],
            'Delete': ['delete', 'remove', 'destroy', 'eliminar']
        }

        for operation, keywords in crud_patterns.items():
            if any(keyword in content_lower for keyword in keywords):
                operations.append(operation)

        if len(operations) < 2:
            return self._slice_by_vertical_path(rf, size)

        stories = []
        hours_per_operation = rf.estimated_hours // len(operations)

        for i, operation in enumerate(operations):
            story = self._create_story_slice(rf, i+1, len(operations), operation, hours_per_operation, SlicingPattern.CRUD_OPERATIONS)
            stories.append(story)

        return stories

    def _slice_by_user_roles(self, rf: RequirementFunction, size: UserStorySize) -> List[UserStory]:
        """Slice by different user roles/personas"""
        if len(rf.personas) < 2:
            return self._slice_by_vertical_path(rf, size)

        stories = []
        hours_per_role = rf.estimated_hours // len(rf.personas)

        for i, persona in enumerate(rf.personas):
            story = self._create_story_slice(rf, i+1, len(rf.personas), f"For {persona}", hours_per_role, SlicingPattern.USER_ROLES)
            # Override actor for this slice
            story.actor = persona
            stories.append(story)

        return stories

    def _slice_by_business_rules(self, rf: RequirementFunction, size: UserStorySize) -> List[UserStory]:
        """Slice by business rules complexity"""
        # Identify business rules from acceptance criteria
        business_rules = []
        for criteria in rf.acceptance_criteria:
            if any(word in criteria.lower() for word in ['if', 'when', 'rule', 'condition', 'validate']):
                business_rules.append(criteria)

        if len(business_rules) < 2:
            return self._slice_by_vertical_path(rf, size)

        stories = []
        base_hours = int(rf.estimated_hours * 0.4)  # 40% for core functionality
        rule_hours = int(rf.estimated_hours * 0.6) // len(business_rules)  # 60% split among rules

        # Core functionality story
        core_story = self._create_story_slice(rf, 1, len(business_rules) + 1, "Core Functionality", base_hours, SlicingPattern.BUSINESS_RULES)
        stories.append(core_story)

        # Business rule stories
        for i, rule in enumerate(business_rules):
            rule_story = self._create_story_slice(rf, i+2, len(business_rules) + 1, f"Rule: {rule[:50]}...", rule_hours, SlicingPattern.BUSINESS_RULES)
            stories.append(rule_story)

        return stories

    def _slice_by_acceptance_criteria(self, rf: RequirementFunction, size: UserStorySize) -> List[UserStory]:
        """Slice by acceptance criteria groups"""
        if len(rf.acceptance_criteria) < 3:
            return self._slice_by_vertical_path(rf, size)

        # Group criteria into logical slices
        criteria_per_slice = max(2, len(rf.acceptance_criteria) // 3)
        slices = [rf.acceptance_criteria[i:i + criteria_per_slice]
                 for i in range(0, len(rf.acceptance_criteria), criteria_per_slice)]

        stories = []
        hours_per_slice = rf.estimated_hours // len(slices)

        for i, criteria_group in enumerate(slices):
            slice_name = f"Criteria {i+1}-{min(i+criteria_per_slice, len(rf.acceptance_criteria))}"
            story = self._create_story_slice(rf, i+1, len(slices), slice_name, hours_per_slice, SlicingPattern.ACCEPTANCE_CRITERIA)

            # Add only relevant acceptance criteria to this slice
            story.bdd_scenarios = rf.bdd_scenarios[i:i+1] if i < len(rf.bdd_scenarios) else []

            stories.append(story)

        return stories

    def _create_story_slice(self, rf: RequirementFunction, slice_index: int, total_slices: int,
                          slice_name: str, estimated_hours: int, pattern: SlicingPattern) -> UserStory:
        """Create a User Story slice from an RF"""
        # Generate User Story ID
        story_id = f"US-{self.project_code}-{len(self.user_stories) + slice_index:03d}"

        # Adjust title for slice
        slice_title = f"{rf.title} - {slice_name}"

        # Choose primary persona
        actor = rf.personas[0] if rf.personas else "user"

        # Generate action with slice context
        action = f"{self._extract_action_from_title(rf.title)} ({slice_name.lower()})"

        # Business value remains the same but may be refined for slice
        business_value = rf.business_value or self._generate_business_value(rf)
        if slice_index > 1:
            business_value += f" (increment {slice_index})"

        # Determine priority - first slices are usually higher priority
        priority = Priority.MUST if slice_index <= 2 else Priority.SHOULD

        # Estimate hours with range
        min_hours = max(2, estimated_hours - 2)
        max_hours = estimated_hours + 4

        # Dependencies - first slice depends on RF dependencies, others depend on previous slices
        dependencies = rf.dependencies.copy() if slice_index == 1 else [f"US-{self.project_code}-{len(self.user_stories) + slice_index - 1:03d}"]

        user_story = UserStory(
            id=story_id,
            title=self._generate_story_title(slice_title),
            actor=actor,
            action=action,
            business_value=business_value,
            rf_origin=rf.id,
            priority=priority,
            estimated_hours_min=min_hours,
            estimated_hours_max=max_hours,
            bdd_scenarios=self._adapt_bdd_scenarios_for_slice(rf.bdd_scenarios, slice_index, pattern),
            technical_notes=rf.technical_notes,
            dependencies=dependencies,
            definition_of_done=self.standard_dod.copy(),
            slicing_pattern=pattern,
            slice_index=slice_index,
            total_slices=total_slices
        )

        # Add subtasks if story is still large
        if estimated_hours > 16:
            user_story.subtasks = self._generate_subtasks(rf, slice_name, estimated_hours)

        return user_story

    def _extract_workflow_steps(self, rf: RequirementFunction) -> List[str]:
        """Extract workflow steps from RF content"""
        steps = []

        # Look for numbered steps in acceptance criteria
        for criteria in rf.acceptance_criteria:
            step_match = re.search(r'(?:step|paso)\s*\d+[:\-]\s*(.+)', criteria, re.IGNORECASE)
            if step_match:
                steps.append(step_match.group(1).strip())

        # Look for workflow keywords
        workflow_keywords = ['first', 'then', 'next', 'finally', 'después', 'luego', 'finalmente']
        for criteria in rf.acceptance_criteria:
            for keyword in workflow_keywords:
                if keyword in criteria.lower():
                    steps.append(criteria.strip())
                    break

        return steps[:4]  # Limit to 4 steps max

    def _extract_action_from_title(self, title: str) -> str:
        """Extract action verb from RF title for User Story action"""
        # Common action patterns in {{CLIENT_NAME}} domain.
        # Domain-flavored actions come from the industry pack (overridable);
        # neutral verbs stay inline. Defaults reproduce previous behavior.
        actions = {
            'verify': 'verify the identity',
            'authenticate': 'authenticate the user',
            'register': self.domain_phrases['action_register'],
            'validate': 'validate information',
            'process': 'process data',
            'capture': self.domain_phrases['action_capture'],
            'analyze': self.domain_phrases['action_analyze'],
            'manage': 'manage configuration',
            'configure': 'configure parameters',
            'monitor': 'monitor the system'
        }

        title_lower = title.lower()
        for keyword, action in actions.items():
            if keyword in title_lower:
                return action

        # Default action based on common patterns (returned phrases overridable via industry pack)
        if any(word in title_lower for word in ['facial', 'face', '{{PRODUCT_NAME_1}}']):
            return self.domain_phrases['action_facial']
        elif any(word in title_lower for word in ['document', 'ocr', '{{PRODUCT_NAME_1}}d']):
            return self.domain_phrases['action_document']
        elif any(word in title_lower for word in ['voice', 'vocal']):
            return self.domain_phrases['action_voice']
        else:
            return self.domain_phrases['action_default']

    def _generate_business_value(self, rf: RequirementFunction) -> str:
        """Generate business value based on RF content"""
        if rf.business_value:
            return rf.business_value

        # Infer from domain and complexity factors (phrases overridable via industry pack)
        if 'Security Requirements' in rf.complexity_factors:
            return self.domain_phrases['value_security_factor']
        elif 'Performance Requirements' in rf.complexity_factors:
            return self.domain_phrases['value_performance_factor']
        elif 'Compliance Requirements' in rf.complexity_factors:
            return self.domain_phrases['value_compliance_factor']
        else:
            return self.domain_phrases['value_generic_factor']

    def _determine_priority(self, rf: RequirementFunction) -> Priority:
        """Determine User Story priority based on RF content"""
        content_lower = (rf.description + " " + " ".join(rf.acceptance_criteria)).lower()

        # High priority indicators
        if any(word in content_lower for word in ['critical', 'essential', 'must', 'required', 'security']):
            return Priority.MUST

        # Medium priority indicators
        if any(word in content_lower for word in ['important', 'should', 'recommended']):
            return Priority.SHOULD

        # Default
        return Priority.SHOULD

    def _generate_story_title(self, rf_title: str) -> str:
        """Generate concise User Story title from RF title"""
        # Remove RF prefix if present
        title = re.sub(r'^RF-[\w]+-\d+[:\-]\s*', '', rf_title)

        # Limit length and clean up
        if len(title) > 60:
            title = title[:60] + "..."

        return title.strip()

    def _adapt_bdd_scenarios_for_slice(self, scenarios: List[BDDScenario], slice_index: int, pattern: SlicingPattern) -> List[BDDScenario]:
        """Adapt BDD scenarios for specific slice"""
        if not scenarios:
            return []

        # For first slice or single story, use all scenarios
        if slice_index == 1 and pattern == SlicingPattern.VERTICAL_PATH:
            return scenarios

        # For slices, focus on relevant scenarios
        adapted_scenarios = []

        if slice_index == 1:  # Happy path slice
            for scenario in scenarios:
                if 'happy' in scenario.name.lower() or 'success' in scenario.name.lower() or slice_index == 1:
                    adapted_scenarios.append(scenario)
        elif slice_index == 2:  # Validation slice
            for scenario in scenarios:
                if any(word in scenario.name.lower() for word in ['error', 'invalid', 'fail', 'validation']):
                    adapted_scenarios.append(scenario)
        else:  # Later slices - edge cases
            for scenario in scenarios:
                if any(word in scenario.name.lower() for word in ['edge', 'limit', 'boundary', 'exception']):
                    adapted_scenarios.append(scenario)

        # If no specific scenarios found, create generic ones for the slice
        if not adapted_scenarios:
            adapted_scenarios = self._generate_slice_scenarios(slice_index, pattern)

        return adapted_scenarios

    def _generate_slice_scenarios(self, slice_index: int, pattern: SlicingPattern) -> List[BDDScenario]:
        """Generate generic BDD scenarios for a slice"""
        scenarios = []

        if slice_index == 1:  # Happy path
            scenarios.append(BDDScenario(
                name="Successful main flow",
                given=["the user is authenticated", "the system is available"],
                when=["the main functionality is executed"],
                then=["the system processes correctly", "the expected result is displayed"]
            ))
        elif slice_index == 2:  # Validations
            scenarios.append(BDDScenario(
                name="Invalid data validation",
                given=["the user provides invalid data"],
                when=["they attempt to execute the functionality"],
                then=["the system validates the data", "an appropriate error message is displayed"]
            ))
        else:  # Edge cases
            scenarios.append(BDDScenario(
                name="Edge cases and exceptions",
                given=["a boundary condition exists"],
                when=["the functionality is executed"],
                then=["the system handles the exception appropriately"]
            ))

        return scenarios

    def _generate_subtasks(self, rf: RequirementFunction, slice_name: str, estimated_hours: int) -> List[str]:
        """Generate technical subtasks for complex User Stories"""
        subtasks = []

        # Standard technical subtasks based on complexity factors
        if 'User Interface' in rf.complexity_factors:
            subtasks.extend([
                "Design user interfaces",
                "Implement responsive UI components",
                "Integrate frontend validation"
            ])

        if 'Database Operations' in rf.complexity_factors:
            subtasks.extend([
                "Design database schema",
                "Implement CRUD operations",
                "Optimize queries and performance"
            ])

        if 'Integration Complexity' in rf.complexity_factors:
            subtasks.extend([
                "Design API interfaces",
                "Implement integration with external services",
                "Handle connectivity errors"
            ])

        if 'Security Requirements' in rf.complexity_factors:
            subtasks.extend([
                "Implement validation and sanitization",
                "Configure authentication and authorization",
                "Perform security review"
            ])

        # Always include testing subtasks for complex stories
        if estimated_hours > 16:
            subtasks.extend([
                "Write unit tests",
                "Create integration tests",
                "Run manual testing"
            ])

        return subtasks

    def generate_user_stories_from_rfs(self, sprint_capacity_hours: int = 400, debt_percentage: float = 0.20) -> Dict[str, List[UserStory]]:
        """Generate User Stories from all loaded RFs with sprint capacity management"""
        if not self.rfs:
            print("❌ No RFs loaded. Use load_requirements() first.")
            return {}

        # Calculate available capacity for feature development (excluding debt)
        feature_capacity = int(sprint_capacity_hours * (1 - debt_percentage))

        print(f"📊 Sprint Planning:")
        print(f"   Total capacity: {sprint_capacity_hours}h")
        print(f"   Tech debt allocation: {int(sprint_capacity_hours * debt_percentage)}h ({debt_percentage*100}%)")
        print(f"   Feature capacity: {feature_capacity}h")
        print(f"   Processing {len(self.rfs)} RFs...")

        all_stories = []
        total_estimated_hours = 0

        # Sort RFs by priority/complexity for processing
        sorted_rfs = sorted(self.rfs.values(), key=lambda rf: (len(rf.dependencies), -rf.estimated_hours))

        for rf in sorted_rfs:
            if total_estimated_hours >= feature_capacity:
                print(f"⚠️  Capacity limit reached. Remaining RFs will be deferred.")
                break

            stories = self.slice_rf_into_user_stories(rf, feature_capacity - total_estimated_hours)

            for story in stories:
                if total_estimated_hours + story.estimated_hours_max <= feature_capacity:
                    all_stories.append(story)
                    self.user_stories[story.id] = story
                    total_estimated_hours += story.estimated_hours_max
                else:
                    print(f"⚠️  Story {story.id} ({story.estimated_hours_max}h) exceeds remaining capacity")
                    break

        # Organize stories by priority for sprint planning
        stories_by_priority = {
            'Must': [story for story in all_stories if story.priority == Priority.MUST],
            'Should': [story for story in all_stories if story.priority == Priority.SHOULD],
            'Could': [story for story in all_stories if story.priority == Priority.COULD]
        }

        print(f"\n✅ Generated {len(all_stories)} User Stories:")
        print(f"   Must: {len(stories_by_priority['Must'])} stories")
        print(f"   Should: {len(stories_by_priority['Should'])} stories")
        print(f"   Could: {len(stories_by_priority['Could'])} stories")
        print(f"   Total estimated: {total_estimated_hours}h / {feature_capacity}h capacity")

        return stories_by_priority

    def export_to_markdown(self, output_file: str = "user-stories-generated.md") -> str:
        """Export User Stories to markdown format"""
        if not self.user_stories:
            print("❌ No User Stories to export.")
            return ""

        output_path = Path(output_file)

        content = f"""---
id: user-stories-{datetime.now().strftime('%Y%m%d')}
version: "1.0.0"
last_updated: "{datetime.now().strftime('%Y-%m-%d')}"
updated_by: "System: RF Slicer"
status: active
type: backlog
owner_role: "PO + SM"
---

# User Stories Sprint Backlog

**Generated**: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
**RFs Processed**: {len(self.rfs)}
**Stories Generated**: {len(self.user_stories)}

## Summary by Priority

"""

        # Group stories by priority
        priority_stats = {}
        for priority in Priority:
            stories = [story for story in self.user_stories.values() if story.priority == priority]
            total_hours = sum(story.estimated_hours_max for story in stories)
            priority_stats[priority.value] = {
                'count': len(stories),
                'hours': total_hours
            }

        content += "| Priority | Count | Total Hours | Avg Hours |\n"
        content += "|----------|-------|-------------|----------|\n"

        for priority_name, stats in priority_stats.items():
            avg_hours = stats['hours'] / stats['count'] if stats['count'] > 0 else 0
            content += f"| **{priority_name}** | {stats['count']} | {stats['hours']}h | {avg_hours:.1f}h |\n"

        content += "\n---\n\n"

        # Generate detailed User Stories
        for priority in Priority:
            stories_in_priority = [story for story in self.user_stories.values() if story.priority == priority]
            if not stories_in_priority:
                continue

            stories_in_priority.sort(key=lambda x: x.id)

            content += f"## {priority.value} Priority ({len(stories_in_priority)} stories)\n\n"

            for story in stories_in_priority:
                content += self._generate_story_markdown(story)
                content += "\n---\n\n"

        # Write to file
        output_path.write_text(content, encoding='utf-8')
        print(f"✅ User Stories exported to: {output_path}")

        return str(output_path)

    def _generate_story_markdown(self, story: UserStory) -> str:
        """Generate markdown for individual User Story"""
        dependencies_text = ", ".join(story.dependencies) if story.dependencies else "None"
        subtasks_text = "\n".join([f"- [ ] {task}" for task in story.subtasks]) if story.subtasks else "Not required"

        scenarios_text = ""
        for scenario in story.bdd_scenarios:
            scenarios_text += f"### Scenario: {scenario.name}\n"
            for given in scenario.given:
                scenarios_text += f"**Given** {given}\n"
            for when in scenario.when:
                scenarios_text += f"**When** {when}\n"
            for then in scenario.then:
                scenarios_text += f"**Then** {then}\n"
            scenarios_text += "\n"

        if not scenarios_text:
            scenarios_text = """### Scenario 1: Happy Path
**Given** the user is authenticated
**When** they execute the functionality
**Then** they obtain the expected result

### Scenario 2: Error validation
**Given** invalid data is provided
**When** they execute the functionality
**Then** an appropriate error message is displayed
"""

        dod_text = "\n".join([f"- [ ] {item}" for item in story.definition_of_done])

        slice_info = ""
        if story.total_slices > 1:
            slice_info = f" (Slice {story.slice_index}/{story.total_slices} - {story.slicing_pattern.value})"

        return f"""### {story.id}: {story.title}{slice_info}

## Story
**As a** {story.actor}
**I want** {story.action}
**So that** {story.business_value}

## Details
| Field | Value |
|-------|-------|
| **ID** | {story.id} |
| **Sprint** | Current Sprint |
| **RF Origin** | {story.rf_origin} |
| **Priority** | {story.priority.value} |
| **Estimate** | {story.estimated_hours_min}-{story.estimated_hours_max}h |
| **Status** | To Do |

## Acceptance Criteria (BDD)
{scenarios_text}

## Technical Notes
{story.technical_notes or "See origin RF for technical details."}

## Definition of Done
{dod_text}

## Dependencies
{dependencies_text}

## Subtasks
{subtasks_text}
"""

    def export_to_jira_csv(self, output_file: str = "user-stories-jira.csv") -> str:
        """Export User Stories to CSV for tracking tool import"""
        if not self.user_stories:
            print("❌ No User Stories to export.")
            return ""

        output_path = Path(output_file)

        import csv
        with open(output_path, 'w', newline='', encoding='utf-8') as f:
            writer = csv.writer(f)

            # Header for tracking tool import
            writer.writerow([
                'Summary', 'Issue Type', 'Description', 'Acceptance Criteria',
                'Story Points', 'Priority', 'Epic Link', 'Labels',
                'Component/s', 'Custom Field (RF Origin)', 'Reporter'
            ])

            for story in self.user_stories.values():
                # Calculate story points (convert hours to Fibonacci points)
                avg_hours = (story.estimated_hours_min + story.estimated_hours_max) / 2
                if avg_hours <= 4:
                    story_points = 2
                elif avg_hours <= 8:
                    story_points = 3
                elif avg_hours <= 16:
                    story_points = 5
                elif avg_hours <= 24:
                    story_points = 8
                else:
                    story_points = 13

                # Format acceptance criteria
                criteria_text = ""
                for scenario in story.bdd_scenarios:
                    criteria_text += f"Scenario: {scenario.name}\n"
                    for given in scenario.given:
                        criteria_text += f"Given {given}\n"
                    for when in scenario.when:
                        criteria_text += f"When {when}\n"
                    for then in scenario.then:
                        criteria_text += f"Then {then}\n"
                    criteria_text += "\n"

                # Format description
                description = f"As a {story.actor}, I want {story.action} so that {story.business_value}.\n\n"
                if story.technical_notes:
                    description += f"Technical notes: {story.technical_notes}\n\n"
                description += f"Estimate: {story.estimated_hours_min}-{story.estimated_hours_max} hours"

                # Labels
                labels = ['user-story', story.priority.value.lower()]
                if story.total_slices > 1:
                    labels.append(f'slice-{story.slice_index}-of-{story.total_slices}')
                if story.slicing_pattern:
                    labels.append(story.slicing_pattern.value.lower().replace(' ', '-'))

                writer.writerow([
                    story.title,
                    'Story',
                    description,
                    criteria_text,
                    story_points,
                    story.priority.value,
                    'Feature Development',
                    ', '.join(labels),
                    'User Stories',
                    story.rf_origin,
                    'RF Slicer System'
                ])

        print(f"✅ {TRACKING_TOOL.title()} CSV export created: {output_path}")
        return str(output_path)

def main():
    parser = argparse.ArgumentParser(description="{{CLIENT_NAME}} RF Slicer and User Story Generator")
    parser.add_argument("--rf-dir", required=True, help="Directory containing RF markdown files")
    parser.add_argument("--project-code", default="{{CLIENT_CODE_UPPER}}", help="Project code for User Story IDs")
    parser.add_argument("--sprint-capacity", type=int, default=400, help="Sprint capacity in hours")
    parser.add_argument("--debt-percentage", type=float, default=0.20, help="Percentage reserved for tech debt")
    parser.add_argument("--output-dir", default=".", help="Output directory")
    parser.add_argument("--markdown-output", default="user-stories-generated.md", help="Markdown output filename")
    parser.add_argument("--csv-output", default="user-stories-jira.csv", help=f"CSV output for {TRACKING_TOOL.title()} import")
    parser.add_argument("--verbose", "-v", action="store_true", help="Verbose output")

    args = parser.parse_args()

    print("🚀 {{CLIENT_NAME}} RF Slicer and User Story Generator")
    print("=" * 50)

    # Initialize RF Slicer
    slicer = RFSlicer(args.project_code)

    # Load RFs
    if not slicer.load_requirements(args.rf_dir):
        print("❌ Failed to load requirements")
        sys.exit(1)

    # Generate User Stories
    stories_by_priority = slicer.generate_user_stories_from_rfs(
        args.sprint_capacity,
        args.debt_percentage
    )

    if not stories_by_priority or not any(stories_by_priority.values()):
        print("❌ No User Stories generated")
        sys.exit(1)

    # Generate outputs
    output_dir = Path(args.output_dir)
    output_dir.mkdir(exist_ok=True)

    markdown_path = slicer.export_to_markdown(output_dir / args.markdown_output)
    csv_path = slicer.export_to_jira_csv(output_dir / args.csv_output)

    # Summary
    total_stories = sum(len(stories) for stories in stories_by_priority.values())
    total_hours = sum(story.estimated_hours_max for stories in stories_by_priority.values() for story in stories)

    print(f"\n🎯 Generation Summary:")
    print(f"   RFs Processed: {len(slicer.rfs)}")
    print(f"   User Stories Generated: {total_stories}")
    print(f"   Estimated Effort: {total_hours} hours")
    print(f"   Sprint Fit: {total_hours <= args.sprint_capacity * (1-args.debt_percentage)}")

    for priority, stories in stories_by_priority.items():
        if stories:
            priority_hours = sum(story.estimated_hours_max for story in stories)
            print(f"   {priority}: {len(stories)} stories ({priority_hours}h)")

    print(f"\n📄 Outputs Generated:")
    print(f"   📝 Markdown: {markdown_path}")
    print(f"   📊 {TRACKING_TOOL.title()} CSV: {csv_path}")

    print(f"\n💡 Next Steps:")
    print(f"   1. Review User Stories for INVEST compliance")
    print(f"   2. Import CSV to {TRACKING_TOOL.title()} for sprint planning")
    print(f"   3. Validate estimates with development team")
    print(f"   4. Assign stories to developers")

if __name__ == "__main__":
    main()