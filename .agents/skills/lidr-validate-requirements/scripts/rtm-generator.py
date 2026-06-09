#!/usr/bin/env python3
"""
{{CLIENT_NAME}} Requirements Traceability Matrix (RTM) Generator
Automates the 5-pass validation process and generates comprehensive RTM reports.
"""

import json
import re
import argparse
import sys
from pathlib import Path
from typing import Dict, List, Set, Tuple, Optional
from dataclasses import dataclass, asdict
from enum import Enum
import yaml
from datetime import datetime

class ValidationResult(Enum):
    PASS = "✅"
    FAIL = "❌"
    WARN = "⚠️"
    INFO = "ℹ️"

@dataclass
class Requirement:
    id: str
    title: str
    description: str
    source: str  # PRD-F functionality or PRD-T section
    bdd_scenarios: List[str]
    dependencies: List[str]
    category: str = ""

@dataclass
class NFR:
    id: str
    title: str
    category: str  # performance, security, availability, etc.
    metric: str
    threshold: str
    validation_method: str
    applicable_rfs: List[str]
    system_wide: bool = False

@dataclass
class PRDFunctionality:
    id: str
    title: str
    description: str
    section: str

@dataclass
class ValidationIssue:
    type: str  # "CRITICAL", "GAP", "WARN"
    description: str
    action_required: str
    owner: str = ""

class RTMGenerator:
    # Overridable DEFAULT clustering pattern set (example "industry pack").
    # LIDR is a multi-industry framework: this neutral default groups RFs by
    # generic software-architecture concerns (auth, core, api, ui). It can be
    # overridden per project/industry via a JSON file (see `cluster_config_path`)
    # without touching this script. When no override is provided, this default
    # is used as fallback, preserving the original matching behavior.
    #
    # Schema: list of cluster definitions, each a dict with:
    #   name      -> str   (cluster display name)
    #   keywords  -> [str] (case-insensitive substrings matched against rf.title)
    #   sprints   -> str   (estimated effort, free-form)
    #   deps      -> str   (cluster dependency note, free-form)
    DEFAULT_CLUSTER_PATTERNS: List[Dict] = [
        {"name": "Auth & Security", "keywords": ["auth", "login"], "sprints": "2-3 sprints", "deps": "None"},
        {"name": "Core domain-specifics", "keywords": ["domain-specific", "core"], "sprints": "3-4 sprints", "deps": "Auth cluster"},
        {"name": "API Gateway", "keywords": ["api", "endpoint"], "sprints": "2 sprints", "deps": "Core cluster"},
        {"name": "User Interface", "keywords": ["ui", "interface"], "sprints": "2-3 sprints", "deps": "API cluster"},
    ]

    def __init__(self, project_dir: str = ".", cluster_config_path: Optional[str] = None):
        self.project_dir = Path(project_dir)
        self.rfs: Dict[str, Requirement] = {}
        self.nfrs: Dict[str, NFR] = {}
        self.prd_functionalities: Dict[str, PRDFunctionality] = {}
        self.prd_nfr_categories: Dict[str, str] = {}
        self.validation_issues: List[ValidationIssue] = []
        self.gate2_criteria: Dict[str, ValidationResult] = {}
        # Resolve the clustering pattern set: optional JSON override, else default.
        self.cluster_patterns: List[Dict] = self._load_cluster_patterns(cluster_config_path)

    def _load_cluster_patterns(self, cluster_config_path: Optional[str]) -> List[Dict]:
        """Load the implementation-cluster pattern set.

        Returns an industry-overridable list of cluster definitions. When
        `cluster_config_path` points to a readable JSON file, its contents
        override the neutral DEFAULT_CLUSTER_PATTERNS (example industry pack);
        otherwise the default is returned unchanged, preserving behavior.
        """
        if cluster_config_path:
            config_file = Path(cluster_config_path)
            if config_file.exists():
                try:
                    loaded = json.loads(config_file.read_text(encoding='utf-8'))
                    if isinstance(loaded, list) and loaded:
                        return loaded
                    print(f"⚠️  Cluster config {config_file} is empty/invalid, using defaults.")
                except (json.JSONDecodeError, OSError) as e:
                    print(f"⚠️  Could not read cluster config {config_file}: {e}. Using defaults.")
            else:
                print(f"⚠️  Cluster config {config_file} not found, using defaults.")
        return list(self.DEFAULT_CLUSTER_PATTERNS)

    def load_requirements(self):
        """Load RFs from generate-rf skill outputs"""
        rf_dir = self.project_dir / ".claude" / "skills" / "generate-rf" / "outputs"
        if not rf_dir.exists():
            print("⚠️  RF directory not found. Run generate-rf skill first.")
            return

        for rf_file in rf_dir.glob("RF-*.md"):
            rf = self._parse_rf_file(rf_file)
            if rf:
                self.rfs[rf.id] = rf

        print(f"✅ Loaded {len(self.rfs)} functional requirements")

    def load_nfrs(self):
        """Load NFRs from generate-nfr skill outputs"""
        nfr_dir = self.project_dir / ".claude" / "skills" / "generate-nfr" / "outputs"
        if not nfr_dir.exists():
            print("⚠️  NFR directory not found. Run generate-nfr skill first.")
            return

        for nfr_file in nfr_dir.glob("NFR-*.md"):
            nfr = self._parse_nfr_file(nfr_file)
            if nfr:
                self.nfrs[nfr.id] = nfr

        print(f"✅ Loaded {len(self.nfrs)} non-functional requirements")

    def load_prd_context(self):
        """Load PRD Funcional and PRD Técnico for validation context"""
        # Try multiple possible locations for PRD files
        prd_locations = [
            self.project_dir / "docs" / "projects",
            self.project_dir / ".claude" / "skills" / "prd-funcional" / "outputs",
            self.project_dir / ".claude" / "skills" / "prd-tecnico" / "outputs",
            self.project_dir / "docs",
        ]

        prd_f_found = False
        prd_t_found = False

        for location in prd_locations:
            if not location.exists():
                continue

            for prd_file in location.glob("*PRD*.md"):
                prd_name = prd_file.name.lower()
                if "funcional" in prd_name or "functional" in prd_name:
                    self._parse_prd_funcional(prd_file)
                    prd_f_found = True
                elif "tecnico" in prd_name or "técnico" in prd_name or "technical" in prd_name:
                    self._parse_prd_tecnico(prd_file)
                    prd_t_found = True

        if not prd_f_found:
            print("⚠️  PRD Funcional not found. Some validations will be limited.")
        if not prd_t_found:
            print("⚠️  PRD Técnico not found. Some validations will be limited.")

        print(f"✅ Loaded {len(self.prd_functionalities)} PRD functionalities")
        print(f"✅ Loaded {len(self.prd_nfr_categories)} PRD NFR categories")

    def _parse_rf_file(self, file_path: Path) -> Optional[Requirement]:
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

            # Extract BDD scenarios (Given/When/Then blocks)
            bdd_scenarios = re.findall(
                r'(?:Given|Dado).*?(?=(?:Given|Dado|##|$))',
                content,
                re.DOTALL | re.IGNORECASE
            )

            # Extract dependencies (references to other RFs)
            dependencies = re.findall(r'RF-\w+-\d+', content)
            dependencies = [dep for dep in dependencies if dep != rf_id]

            # Extract source (PRD reference)
            source_match = re.search(r'(?:PRD-F|Funcionalidad|Functionality)\s+([F-]\w+-\d+)', content)
            source = source_match.group(1) if source_match else ""

            return Requirement(
                id=rf_id,
                title=title.strip(),
                description=content[:500] + "..." if len(content) > 500 else content,
                source=source,
                bdd_scenarios=bdd_scenarios,
                dependencies=list(set(dependencies)),
                category=frontmatter.get('category', '')
            )

        except Exception as e:
            print(f"Error parsing RF file {file_path}: {e}")
            return None

    def _parse_nfr_file(self, file_path: Path) -> Optional[NFR]:
        """Parse an NFR markdown file to extract NFR data"""
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

            nfr_id = frontmatter.get('id', file_path.stem)

            # Extract title
            title_match = re.search(r'^#\s+(.+)$', content, re.MULTILINE)
            title = title_match.group(1) if title_match else nfr_id

            # Extract category (PERF, SEC, AVAIL, etc.)
            category_match = re.search(r'NFR-\w+-(\w+)-\d+', nfr_id)
            category = category_match.group(1).lower() if category_match else frontmatter.get('category', 'unknown')

            # Extract metric and threshold
            metric_match = re.search(r'(?:Métrica|Metric):\s*(.+)', content)
            metric = metric_match.group(1).strip() if metric_match else ""

            threshold_match = re.search(r'(?:Umbral|Threshold):\s*(.+)', content)
            threshold = threshold_match.group(1).strip() if threshold_match else ""

            validation_match = re.search(r'(?:Validación|Validation):\s*(.+)', content)
            validation_method = validation_match.group(1).strip() if validation_match else ""

            # Extract applicable RFs
            applicable_rfs = re.findall(r'RF-\w+-\d+', content)

            # Check if system-wide
            system_wide = 'system-wide' in content.lower() or 'sistema completo' in content.lower()

            return NFR(
                id=nfr_id,
                title=title.strip(),
                category=category,
                metric=metric,
                threshold=threshold,
                validation_method=validation_method,
                applicable_rfs=list(set(applicable_rfs)),
                system_wide=system_wide
            )

        except Exception as e:
            print(f"Error parsing NFR file {file_path}: {e}")
            return None

    def _parse_prd_funcional(self, file_path: Path):
        """Parse PRD Funcional to extract functionalities from §2.4"""
        try:
            content = file_path.read_text(encoding='utf-8')

            # Find section 2.4 (Funcionalidades Clave / Key Features)
            section_match = re.search(
                r'##\s*2\.4[.\s]*(?:Funcionalidades?|Key\s*Features?|Features?).*?\n(.*?)(?=##|$)',
                content,
                re.DOTALL | re.IGNORECASE
            )

            if section_match:
                section_content = section_match.group(1)

                # Extract functionalities (F-XXX patterns)
                functionality_matches = re.finditer(
                    r'(?:^|\n)([F]-\w+-\d+):\s*([^\n]+)(?:\n((?:(?!^[F]-\w+-\d+:).*\n?)*?))?',
                    section_content,
                    re.MULTILINE
                )

                for match in functionality_matches:
                    func_id = match.group(1)
                    func_title = match.group(2).strip()
                    func_desc = match.group(3).strip() if match.group(3) else ""

                    self.prd_functionalities[func_id] = PRDFunctionality(
                        id=func_id,
                        title=func_title,
                        description=func_desc,
                        section="PRD-F §2.4"
                    )

        except Exception as e:
            print(f"Error parsing PRD Funcional {file_path}: {e}")

    def _parse_prd_tecnico(self, file_path: Path):
        """Parse PRD Técnico to extract NFR categories from §5"""
        try:
            content = file_path.read_text(encoding='utf-8')

            # Find section 5 (NFR categories)
            section_match = re.search(
                r'##\s*5[.\s]*(?:NFR|Non-Functional|Requisitos|Requirements).*?\n(.*?)(?=##|$)',
                content,
                re.DOTALL | re.IGNORECASE
            )

            if section_match:
                section_content = section_match.group(1)

                # Extract NFR categories mentioned
                categories = ['performance', 'security', 'availability', 'scalability',
                             'usability', 'compatibility', 'maintainability', 'reliability']

                for category in categories:
                    if category in section_content.lower():
                        self.prd_nfr_categories[category] = f"PRD-T §5.{len(self.prd_nfr_categories) + 1}"

        except Exception as e:
            print(f"Error parsing PRD Técnico {file_path}: {e}")

    def execute_validation_passes(self) -> Dict[str, ValidationResult]:
        """Execute all 5 validation passes"""
        print("\n🔍 Running the 5 validation passes...")

        results = {}

        # Pass 1: Functional Coverage
        print("Pass 1: Functional Coverage (PRD-F → RFs)")
        results['pass1'] = self._validate_functional_coverage()

        # Pass 2: Technical Coverage
        print("Pass 2: Technical Coverage (PRD-T → NFRs)")
        results['pass2'] = self._validate_technical_coverage()

        # Pass 3: NFR Allocation
        print("Pass 3: NFR Allocation (NFRs ↔ RFs)")
        results['pass3'] = self._validate_nfr_allocation()

        # Pass 4: Internal Coherence
        print("Pass 4: Internal Coherence (RFs ↔ RFs, NFRs ↔ NFRs)")
        results['pass4'] = self._validate_internal_coherence()

        # Pass 5: Testability & Sprint Readiness
        print("Pass 5: Testability & Sprint Readiness")
        results['pass5'] = self._validate_testability()

        # Overall Gate 2 assessment
        all_passes = all(result == ValidationResult.PASS for result in results.values())
        results['overall'] = ValidationResult.PASS if all_passes else ValidationResult.FAIL

        self.gate2_criteria = results
        return results

    def _validate_functional_coverage(self) -> ValidationResult:
        """Pass 1: Validate that all PRD functionalities are covered by RFs"""
        uncovered_functionalities = []
        under_decomposed = []

        for func_id, functionality in self.prd_functionalities.items():
            # Count RFs that trace to this functionality
            covering_rfs = [rf for rf in self.rfs.values() if func_id in rf.source]

            if len(covering_rfs) == 0:
                uncovered_functionalities.append(func_id)
                self.validation_issues.append(ValidationIssue(
                    type="GAP",
                    description=f"Functionality {func_id} has no associated RF",
                    action_required="Generate an RF covering this functionality",
                    owner="PO"
                ))
            elif len(covering_rfs) == 1:
                under_decomposed.append(func_id)
                self.validation_issues.append(ValidationIssue(
                    type="WARN",
                    description=f"Functionality {func_id} has only 1 RF, possible under-decomposition",
                    action_required="Review whether more RFs are needed"
                ))

        if uncovered_functionalities:
            print(f"  ❌ {len(uncovered_functionalities)} functionalities without coverage")
            return ValidationResult.FAIL
        elif under_decomposed:
            print(f"  ⚠️  {len(under_decomposed)} functionalities possibly under-decomposed")
            return ValidationResult.WARN
        else:
            print("  ✅ All functionalities covered by RFs")
            return ValidationResult.PASS

    def _validate_technical_coverage(self) -> ValidationResult:
        """Pass 2: Validate that all PRD NFR categories have NFRs"""
        missing_categories = []
        critical_missing = []

        # {{CLIENT_NAME}} domain-specific projects require security and compliance
        mandatory_categories = ['security', 'performance']

        for category in self.prd_nfr_categories:
            category_nfrs = [nfr for nfr in self.nfrs.values() if category in nfr.category.lower()]

            if len(category_nfrs) == 0:
                missing_categories.append(category)
                issue_type = "CRITICAL" if category in mandatory_categories else "GAP"
                self.validation_issues.append(ValidationIssue(
                    type=issue_type,
                    description=f"Category {category} mentioned in PRD-T but has no formal NFR",
                    action_required="Generate an NFR for this category",
                    owner="TL"
                ))

                if category in mandatory_categories:
                    critical_missing.append(category)

        if critical_missing:
            print(f"  ❌ Missing critical categories: {', '.join(critical_missing)}")
            return ValidationResult.FAIL
        elif missing_categories:
            print(f"  ⚠️  Missing categories: {', '.join(missing_categories)}")
            return ValidationResult.WARN
        else:
            print("  ✅ All NFR categories covered")
            return ValidationResult.PASS

    def _validate_nfr_allocation(self) -> ValidationResult:
        """Pass 3: Validate NFR-RF allocation and mapping"""
        orphan_nfrs = []
        rfs_without_nfrs = []

        # Check for orphan NFRs (not system-wide and no RF mapping)
        for nfr in self.nfrs.values():
            if not nfr.system_wide and len(nfr.applicable_rfs) == 0:
                orphan_nfrs.append(nfr.id)
                self.validation_issues.append(ValidationIssue(
                    type="GAP",
                    description=f"NFR {nfr.id} is not marked as system-wide and has no mapping to RFs",
                    action_required="Map to specific RFs or mark as system-wide",
                    owner="TL"
                ))

        # Check for RFs without any NFRs (should have at least performance/security)
        for rf in self.rfs.values():
            applicable_nfrs = [nfr for nfr in self.nfrs.values()
                             if rf.id in nfr.applicable_rfs or nfr.system_wide]

            if len(applicable_nfrs) == 0:
                rfs_without_nfrs.append(rf.id)
                self.validation_issues.append(ValidationIssue(
                    type="WARN",
                    description=f"RF {rf.id} has no applicable NFRs, consider at least performance",
                    action_required="Check whether it needs specific NFRs"
                ))

        if orphan_nfrs:
            print(f"  ❌ {len(orphan_nfrs)} orphan NFRs")
            return ValidationResult.FAIL
        elif rfs_without_nfrs:
            print(f"  ⚠️  {len(rfs_without_nfrs)} RFs without NFRs")
            return ValidationResult.WARN
        else:
            print("  ✅ NFR-RF allocation correct")
            return ValidationResult.PASS

    def _validate_internal_coherence(self) -> ValidationResult:
        """Pass 4: Check for contradictions and circular dependencies"""
        contradictions = []
        circular_deps = []

        # Check for circular dependencies in RFs
        def has_circular_dependency(rf_id: str, visited: Set[str], path: Set[str]) -> bool:
            if rf_id in path:
                return True
            if rf_id in visited:
                return False

            visited.add(rf_id)
            path.add(rf_id)

            rf = self.rfs.get(rf_id)
            if rf:
                for dep in rf.dependencies:
                    if has_circular_dependency(dep, visited, path):
                        circular_deps.append(f"{rf_id} → {dep}")
                        return True

            path.remove(rf_id)
            return False

        visited = set()
        for rf_id in self.rfs:
            if rf_id not in visited:
                has_circular_dependency(rf_id, visited, set())

        # Check for basic contradictions (keyword-based)
        contradiction_keywords = [
            ('allow', 'deny'), ('enable', 'disable'), ('required', 'optional'),
            ('public', 'private'), ('encrypted', 'unencrypted')
        ]

        for i, rf1 in enumerate(self.rfs.values()):
            for j, rf2 in enumerate(list(self.rfs.values())[i+1:], i+1):
                for pos_word, neg_word in contradiction_keywords:
                    if (pos_word in rf1.description.lower() and
                        neg_word in rf2.description.lower() and
                        len(set(rf1.description.split()) & set(rf2.description.split())) > 3):
                        contradictions.append(f"{rf1.id} vs {rf2.id}")

        if contradictions:
            for contradiction in contradictions:
                self.validation_issues.append(ValidationIssue(
                    type="CRITICAL",
                    description=f"Possible contradiction between RFs: {contradiction}",
                    action_required="Review and resolve the contradiction",
                    owner="PO"
                ))

        if circular_deps:
            for circular in circular_deps:
                self.validation_issues.append(ValidationIssue(
                    type="GAP",
                    description=f"Circular dependency detected: {circular}",
                    action_required="Reorganize dependencies",
                    owner="TL"
                ))

        if contradictions or circular_deps:
            print(f"  ❌ {len(contradictions)} contradictions, {len(circular_deps)} circular dependencies")
            return ValidationResult.FAIL
        else:
            print("  ✅ Internal coherence correct")
            return ValidationResult.PASS

    def _validate_testability(self) -> ValidationResult:
        """Pass 5: Validate BDD scenarios and measurable NFRs"""
        rfs_insufficient_bdd = []
        nfrs_not_measurable = []

        # Check RFs for sufficient BDD scenarios (minimum 3)
        for rf in self.rfs.values():
            if len(rf.bdd_scenarios) < 3:
                rfs_insufficient_bdd.append(rf.id)
                self.validation_issues.append(ValidationIssue(
                    type="GAP",
                    description=f"RF {rf.id} has {len(rf.bdd_scenarios)} BDD scenarios, minimum 3",
                    action_required="Add BDD scenarios (happy path + alternative + error)",
                    owner="PO"
                ))

        # Check NFRs for measurable metrics
        for nfr in self.nfrs.values():
            if not nfr.metric or not nfr.threshold or not nfr.validation_method:
                nfrs_not_measurable.append(nfr.id)
                self.validation_issues.append(ValidationIssue(
                    type="GAP",
                    description=f"NFR {nfr.id} does not have a complete metric/threshold/validation",
                    action_required="Define a measurable metric with threshold and validation method",
                    owner="TL"
                ))

        if rfs_insufficient_bdd or nfrs_not_measurable:
            print(f"  ❌ {len(rfs_insufficient_bdd)} RFs with insufficient BDD, {len(nfrs_not_measurable)} non-measurable NFRs")
            return ValidationResult.FAIL
        else:
            print("  ✅ Testability correct")
            return ValidationResult.PASS

    def generate_rtm(self, output_file: str = "rtm.md"):
        """Generate Requirements Traceability Matrix report"""
        output_path = self.project_dir / output_file

        # Calculate coverage statistics
        total_functionalities = len(self.prd_functionalities)
        covered_functionalities = len([f for f in self.prd_functionalities
                                     if any(f in rf.source for rf in self.rfs.values())])
        functional_coverage = (covered_functionalities / total_functionalities * 100) if total_functionalities > 0 else 0

        total_nfr_categories = len(self.prd_nfr_categories)
        covered_categories = len([c for c in self.prd_nfr_categories
                                if any(c in nfr.category.lower() for nfr in self.nfrs.values())])
        nfr_coverage = (covered_categories / total_nfr_categories * 100) if total_nfr_categories > 0 else 0

        rfs_with_bdd = len([rf for rf in self.rfs.values() if len(rf.bdd_scenarios) >= 3])
        bdd_coverage = (rfs_with_bdd / len(self.rfs) * 100) if len(self.rfs) > 0 else 0

        nfrs_measurable = len([nfr for nfr in self.nfrs.values()
                             if nfr.metric and nfr.threshold and nfr.validation_method])
        nfr_measurable_coverage = (nfrs_measurable / len(self.nfrs) * 100) if len(self.nfrs) > 0 else 0

        # Generate RTM content
        rtm_content = f"""---
id: rtm-{datetime.now().strftime('%Y%m%d')}
version: "1.0.0"
last_updated: "{datetime.now().strftime('%Y-%m-%d')}"
updated_by: "System: RTM Generator"
status: active
type: validation
owner_role: "PO + TL"
---

# Requirements Traceability Matrix: {{CLIENT_NAME}} SDLC Project

**Generated**: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
**RFs analyzed**: {len(self.rfs)} | **NFRs analyzed**: {len(self.nfrs)}

## Forward Traceability (BC → PRD → RF/NFR)

| PRD Functionality | Associated RF(s) | Applicable NFR(s) | Status |
|-------------------|----------------|------------------|--------|
"""

        for func_id, functionality in self.prd_functionalities.items():
            covering_rfs = [rf.id for rf in self.rfs.values() if func_id in rf.source]
            applicable_nfrs = [nfr.id for nfr in self.nfrs.values()
                             if any(rf_id in nfr.applicable_rfs for rf_id in covering_rfs)]

            status = "✅ Covered" if covering_rfs else "❌ GAP"
            rfs_text = ", ".join(covering_rfs) if covering_rfs else "—"
            nfrs_text = ", ".join(applicable_nfrs) if applicable_nfrs else "—"

            rtm_content += f"| {func_id}: {functionality.title} | {rfs_text} | {nfrs_text} | {status} |\n"

        rtm_content += f"""
## Backward Traceability (RF/NFR → PRD → BC)

| RF/NFR | PRD Reference | Functionality | Validated |
|--------|---------------|---------------|----------|
"""

        for rf in self.rfs.values():
            prd_ref = f"PRD-F {rf.source}" if rf.source else "—"
            functionality = self.prd_functionalities.get(rf.source, None)
            func_title = functionality.title if functionality else "—"
            validated = "✅" if rf.source and len(rf.bdd_scenarios) >= 3 else "❌"

            rtm_content += f"| {rf.id} | {prd_ref} | {func_title} | {validated} |\n"

        for nfr in self.nfrs.values():
            category_ref = self.prd_nfr_categories.get(nfr.category, "—")
            prd_ref = f"PRD-T {category_ref}" if category_ref != "—" else "—"
            validated = "✅" if nfr.metric and nfr.threshold else "❌"

            rtm_content += f"| {nfr.id} | {prd_ref} | {nfr.category} | {validated} |\n"

        rtm_content += f"""
## Coverage Summary

| Source | Total Items | Covered | Gaps | Coverage % |
|--------|-------------|-----------|------|-------------|
| **PRD-F Functionalities** | {total_functionalities} | {covered_functionalities} | {total_functionalities - covered_functionalities} | {functional_coverage:.1f}% |
| **PRD-T NFR Categories** | {total_nfr_categories} | {covered_categories} | {total_nfr_categories - covered_categories} | {nfr_coverage:.1f}% |
| **RFs with BDD ≥3** | {len(self.rfs)} | {rfs_with_bdd} | {len(self.rfs) - rfs_with_bdd} | {bdd_coverage:.1f}% |
| **NFRs with Metrics** | {len(self.nfrs)} | {nfrs_measurable} | {len(self.nfrs) - nfrs_measurable} | {nfr_measurable_coverage:.1f}% |

## Gate 2 Criteria Validation

| Criterion | Check | Result |
|----------|-------|-----------|
"""

        for criterion, result in self.gate2_criteria.items():
            criterion_names = {
                'pass1': '100% PRD functionalities covered by RFs',
                'pass2': 'All mandatory NFR categories present',
                'pass3': 'All NFRs allocated to RFs or system-wide',
                'pass4': '0 contradictions, 0 circular deps',
                'pass5': 'All RFs have ≥3 BDD scenarios + NFRs measurable',
                'overall': '**Overall Gate 2 Readiness**'
            }

            name = criterion_names.get(criterion, criterion)
            rtm_content += f"| {name} | {criterion} | {result.value} |\n"

        overall_status = "**PASS**" if self.gate2_criteria.get('overall') == ValidationResult.PASS else "**FAIL**"
        if ValidationResult.WARN in self.gate2_criteria.values():
            overall_status = "**CONDITIONAL**"

        rtm_content += f"\n**Final Gate 2 Status**: {overall_status}\n"

        # Write RTM to file
        output_path.write_text(rtm_content, encoding='utf-8')
        print(f"✅ RTM generated: {output_path}")

        return str(output_path)

    def generate_gap_report(self, output_file: str = "gap-report.md"):
        """Generate detailed gap report with action items"""
        output_path = self.project_dir / output_file

        critical_gaps = [issue for issue in self.validation_issues if issue.type == "CRITICAL"]
        gaps = [issue for issue in self.validation_issues if issue.type == "GAP"]
        warnings = [issue for issue in self.validation_issues if issue.type == "WARN"]

        gap_content = f"""---
id: gap-report-{datetime.now().strftime('%Y%m%d')}
version: "1.0.0"
last_updated: "{datetime.now().strftime('%Y-%m-%d')}"
updated_by: "System: RTM Generator"
status: active
type: validation
owner_role: "PO + TL"
---

# Gap Report: {{CLIENT_NAME}} SDLC Project

**Generated**: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}

## Executive Summary

- **Critical Gaps**: {len(critical_gaps)} (BLOCK Gate 2)
- **Gaps**: {len(gaps)} (MUST be resolved)
- **Warnings**: {len(warnings)} (SHOULD be resolved)

## Critical Gaps (MUST resolve before Gate 2)

| # | Type | Description | Action Required | Owner |
|---|------|------------|----------------|-------|
"""

        for i, issue in enumerate(critical_gaps, 1):
            gap_content += f"| {i} | {issue.type} | {issue.description} | {issue.action_required} | {issue.owner or 'TBD'} |\n"

        if not critical_gaps:
            gap_content += "| — | — | No critical gaps | — | — |\n"

        gap_content += f"""
## Gaps (SHOULD resolve, not blocking)

| # | Type | Description | Action Required | Owner |
|---|------|------------|----------------|-------|
"""

        for i, issue in enumerate(gaps, 1):
            gap_content += f"| {i} | {issue.type} | {issue.description} | {issue.action_required} | {issue.owner or 'TBD'} |\n"

        if not gaps:
            gap_content += "| — | — | No gaps | — | — |\n"

        gap_content += f"""
## Warnings (COULD improve, not blocking)

| # | Type | Description | Recommendation |
|---|------|------------|---------------|
"""

        for i, issue in enumerate(warnings, 1):
            gap_content += f"| {i} | {issue.type} | {issue.description} | {issue.action_required} |\n"

        if not warnings:
            gap_content += "| — | — | No warnings | — |\n"

        # Generate implementation clusters for Sprint Planning
        gap_content += f"""
## Implementation Clusters (for Sprint Planning)

| Cluster | RFs | Applicable NFRs | Est. Sprints | Dependencies |
|---------|-----|-----------------|-------------|-------------|
"""

        # Group RFs by category or dependencies for clustering.
        # The pattern set is industry-overridable (self.cluster_patterns); the
        # default reproduces the original generic auth/core/api/ui clustering.
        clusters = []
        for pattern in self.cluster_patterns:
            keywords = [kw.lower() for kw in pattern.get("keywords", [])]
            matched_rfs = [
                rf for rf in self.rfs.values()
                if any(kw in rf.title.lower() for kw in keywords)
            ]
            clusters.append((
                pattern.get("name", "Cluster"),
                matched_rfs,
                pattern.get("sprints", ""),
                pattern.get("deps", ""),
            ))

        for cluster_name, rfs, est_sprints, deps in clusters:
            if rfs:
                rf_list = ", ".join([rf.id for rf in rfs[:5]])  # Limit display
                if len(rfs) > 5:
                    rf_list += f"... (+{len(rfs) - 5} more)"

                applicable_nfrs = []
                for nfr in self.nfrs.values():
                    if any(rf.id in nfr.applicable_rfs for rf in rfs) or nfr.system_wide:
                        applicable_nfrs.append(nfr.id)

                nfr_list = ", ".join(applicable_nfrs[:3])
                if len(applicable_nfrs) > 3:
                    nfr_list += f"... (+{len(applicable_nfrs) - 3})"

                gap_content += f"| {cluster_name} | {rf_list} | {nfr_list} | {est_sprints} | {deps} |\n"

        gap_content += f"""
## Recommended Actions

### For Product Owner
1. **Resolve functional gaps** (Pass 1): Generate missing RFs for uncovered functionalities
2. **Complete BDD scenarios** (Pass 5): Add missing Given/When/Then scenarios
3. **Validate coherence** (Pass 4): Review possible contradictions between RFs

### For Tech Lead
1. **Resolve technical gaps** (Pass 2): Generate NFRs for categories mentioned in PRD-T
2. **Define NFR metrics** (Pass 5): Complete metrics, thresholds, and validation methods
3. **Map NFR-RF** (Pass 3): Assign NFRs to specific RFs or mark as system-wide

### Next Steps
- [ ] Run `/epic-breakdown` after resolving critical gaps
- [ ] Run `/advance-gate 2` for formal Gate 2 evaluation
- [ ] Plan sprints using the implementation clusters
"""

        # Write gap report to file
        output_path.write_text(gap_content, encoding='utf-8')
        print(f"✅ Gap Report generated: {output_path}")

        return str(output_path)

    def save_results(self, output_dir: str = "validation-results"):
        """Save detailed validation results as JSON for further processing"""
        output_path = self.project_dir / output_dir
        output_path.mkdir(exist_ok=True)

        results = {
            "timestamp": datetime.now().isoformat(),
            "summary": {
                "total_rfs": len(self.rfs),
                "total_nfrs": len(self.nfrs),
                "total_functionalities": len(self.prd_functionalities),
                "total_issues": len(self.validation_issues),
                "gate2_status": self.gate2_criteria.get('overall', ValidationResult.FAIL).name
            },
            "gate2_criteria": {k: v.name for k, v in self.gate2_criteria.items()},
            "validation_issues": [asdict(issue) for issue in self.validation_issues],
            "rfs": {rf_id: asdict(rf) for rf_id, rf in self.rfs.items()},
            "nfrs": {nfr_id: asdict(nfr) for nfr_id, nfr in self.nfrs.items()},
            "prd_functionalities": {func_id: asdict(func) for func_id, func in self.prd_functionalities.items()}
        }

        results_file = output_path / "validation-results.json"
        results_file.write_text(json.dumps(results, indent=2, ensure_ascii=False), encoding='utf-8')

        print(f"✅ Detailed results saved: {results_file}")
        return str(results_file)

def main():
    parser = argparse.ArgumentParser(description="{{CLIENT_NAME}} RTM Generator - 5-Pass Validation Automation")
    parser.add_argument("--project-dir", default=".", help="Project directory path")
    parser.add_argument("--output-dir", default=".", help="Output directory for reports")
    parser.add_argument("--rtm-file", default="rtm.md", help="RTM output filename")
    parser.add_argument("--gap-file", default="gap-report.md", help="Gap report output filename")
    parser.add_argument("--cluster-config", default=None,
                        help="Optional JSON file overriding the implementation-cluster "
                             "pattern set (industry pack). Falls back to the neutral default.")
    parser.add_argument("--verbose", "-v", action="store_true", help="Verbose output")

    args = parser.parse_args()

    print("🚀 {{CLIENT_NAME}} Requirements Validation - 5-Pass Automation")
    print("=" * 60)

    # Initialize RTM generator
    generator = RTMGenerator(args.project_dir, cluster_config_path=args.cluster_config)

    # Load all requirements data
    print("\n📂 Loading requirements data...")
    generator.load_requirements()
    generator.load_nfrs()
    generator.load_prd_context()

    if not generator.rfs and not generator.nfrs:
        print("❌ No RFs or NFRs found. Run generate-rf and generate-nfr first.")
        sys.exit(1)

    # Execute validation passes
    validation_results = generator.execute_validation_passes()

    # Generate reports
    print("\n📋 Generating reports...")
    rtm_path = generator.generate_rtm(f"{args.output_dir}/{args.rtm_file}")
    gap_path = generator.generate_gap_report(f"{args.output_dir}/{args.gap_file}")
    json_path = generator.save_results(f"{args.output_dir}/validation-results")

    # Summary
    print(f"\n🎯 Validation Summary:")
    print(f"   RFs: {len(generator.rfs)} | NFRs: {len(generator.nfrs)}")
    print(f"   Issues: {len(generator.validation_issues)}")
    print(f"   Gate 2 Status: {generator.gate2_criteria.get('overall', ValidationResult.FAIL).value}")

    print(f"\n📄 Reports generated:")
    print(f"   📊 RTM: {rtm_path}")
    print(f"   📝 Gap Report: {gap_path}")
    print(f"   📁 JSON Data: {json_path}")

    # Exit with appropriate code
    overall_result = generator.gate2_criteria.get('overall', ValidationResult.FAIL)
    if overall_result == ValidationResult.FAIL:
        print("\n❌ Validation FAILED - Review critical gaps before Gate 2")
        sys.exit(1)
    elif overall_result == ValidationResult.WARN:
        print("\n⚠️  Validation CONDITIONAL - Review warnings before continuing")
        sys.exit(2)
    else:
        print("\n✅ Validation SUCCESSFUL - Ready for epic-breakdown and Gate 2")
        sys.exit(0)

if __name__ == "__main__":
    main()