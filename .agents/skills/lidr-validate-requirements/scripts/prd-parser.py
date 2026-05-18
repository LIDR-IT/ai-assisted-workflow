#!/usr/bin/env python3
"""
{{CLIENT_NAME}} PRD Parser and Requirements Extractor
Systematically parses PRD Funcional and PRD Técnico to extract functionalities and NFR categories.
"""

import re
import json
import argparse
from pathlib import Path
from typing import Dict, List, Set, Optional
from dataclasses import dataclass, asdict
import yaml

@dataclass
class PRDFunctionality:
    id: str
    title: str
    description: str
    section: str
    priority: str = ""
    acceptance_criteria: List[str] = None
    related_personas: List[str] = None

    def __post_init__(self):
        if self.acceptance_criteria is None:
            self.acceptance_criteria = []
        if self.related_personas is None:
            self.related_personas = []

@dataclass
class NFRCategory:
    name: str
    section: str
    description: str
    requirements: List[str] = None
    mandatory: bool = False

    def __post_init__(self):
        if self.requirements is None:
            self.requirements = []

@dataclass
class PRDMetadata:
    title: str
    version: str
    authors: List[str]
    stakeholders: List[str]
    last_updated: str
    approval_status: str = ""

class PRDParser:
    def __init__(self):
        self.functionalities: Dict[str, PRDFunctionality] = {}
        self.nfr_categories: Dict[str, NFRCategory] = {}
        self.metadata = PRDMetadata("", "", [], [], "")

        # {{CLIENT_NAME}} domain patterns (template-based)
        self.domain_patterns = {
            '{{VERIFICATION_METHOD}}': ['{{PRIMARY_VERIFICATION_METHOD}}', '{{VERIFICATION_TYPE}}', '{{ACCURACY_METRIC}}', '{{DATA_CAPTURE_TYPE}}', '{{PRIMARY_ALGORITHM}}'],
            '{{DOCUMENT_TYPE}}': ['{{SENSITIVE_DATA_TYPE}}', '{{DATA_PROCESSING_METHOD}}', '{{DOCUMENT_FORMAT_1}}', '{{DOCUMENT_FORMAT_2}}', '{{VERIFICATION_TYPE}}_document', 'id'],
            '{{AUDIO_TYPE}}': ['{{AUDIO_VERIFICATION_METHOD}}', 'vocal', 'speech', 'audio'],
            '{{PATTERN_TYPE}}': ['behavioral', '{{PRIMARY_VERIFICATION_METHOD}}', 'pattern', 'typing'],
            'platform': ['platform', 'api', 'gateway', 'orchestrator']
        }

        # Mandatory NFR categories for domain-specific systems
        self.mandatory_nfr_categories = [
            'security', 'performance', 'availability', 'privacy', 'compliance'
        ]

    def parse_prd_funcional(self, file_path: Path) -> Dict[str, PRDFunctionality]:
        """Parse PRD Funcional to extract functionalities, personas, and journeys"""
        try:
            content = file_path.read_text(encoding='utf-8')
            print(f"📖 Parsing PRD Funcional: {file_path.name}")

            # Extract metadata
            self._extract_metadata(content, "funcional")

            # Parse section 2.4: Funcionalidades Clave
            self._parse_functionalities_section(content)

            # Parse section 3: User Journeys (for context)
            self._parse_user_journeys(content)

            # Parse section 4: Casos de Uso (for acceptance criteria)
            self._parse_use_cases(content)

            print(f"✅ Extracted {len(self.functionalities)} functionalities from PRD Funcional")
            return self.functionalities

        except Exception as e:
            print(f"❌ Error parsing PRD Funcional {file_path}: {e}")
            return {}

    def parse_prd_tecnico(self, file_path: Path) -> Dict[str, NFRCategory]:
        """Parse PRD Técnico to extract NFR categories and technical requirements"""
        try:
            content = file_path.read_text(encoding='utf-8')
            print(f"📖 Parsing PRD Técnico: {file_path.name}")

            # Extract metadata
            self._extract_metadata(content, "tecnico")

            # Parse section 5: Requisitos No Funcionales
            self._parse_nfr_section(content)

            # Parse section 3: Arquitectura Propuesta (for additional NFRs)
            self._parse_architecture_nfrs(content)

            # Parse section 6: Consideraciones Técnicas
            self._parse_technical_considerations(content)

            # Validate mandatory categories for {{CLIENT_NAME}} domain-specific projects
            self._validate_mandatory_nfrs()

            print(f"✅ Extracted {len(self.nfr_categories)} NFR categories from PRD Técnico")
            return self.nfr_categories

        except Exception as e:
            print(f"❌ Error parsing PRD Técnico {file_path}: {e}")
            return {}

    def _extract_metadata(self, content: str, doc_type: str):
        """Extract document metadata from frontmatter or header"""
        # Try to extract YAML frontmatter first
        if content.startswith('---'):
            try:
                parts = content.split('---', 2)
                if len(parts) >= 3:
                    frontmatter = yaml.safe_load(parts[1])
                    self.metadata.title = frontmatter.get('title', f'PRD {doc_type.title()}')
                    self.metadata.version = frontmatter.get('version', '1.0.0')
                    self.metadata.authors = frontmatter.get('authors', [])
                    self.metadata.last_updated = frontmatter.get('last_updated', '')
                    return
            except yaml.YAMLError:
                pass

        # Fallback to content parsing
        title_match = re.search(r'^#\s+(.+)', content, re.MULTILINE)
        if title_match:
            self.metadata.title = title_match.group(1).strip()

        version_match = re.search(r'(?:versión|version):\s*([^\n]+)', content, re.IGNORECASE)
        if version_match:
            self.metadata.version = version_match.group(1).strip()

        author_match = re.search(r'(?:autor|author|responsable):\s*([^\n]+)', content, re.IGNORECASE)
        if author_match:
            self.metadata.authors = [author_match.group(1).strip()]

    def _parse_functionalities_section(self, content: str):
        """Parse section 2.4: Funcionalidades Clave"""
        # Find section 2.4
        section_patterns = [
            r'##\s*2\.4[.\s]*(?:Funcionalidades?\s*Clave|Key\s*Features)\s*\n(.*?)(?=##|$)',
            r'##\s*Funcionalidades?\s*Clave\s*\n(.*?)(?=##|$)',
            r'##\s*Features\s*\n(.*?)(?=##|$)'
        ]

        section_content = ""
        for pattern in section_patterns:
            match = re.search(pattern, content, re.DOTALL | re.IGNORECASE)
            if match:
                section_content = match.group(1)
                break

        if not section_content:
            print("⚠️  Section 2.4 (Funcionalidades Clave) not found")
            return

        # Extract functionalities with multiple patterns
        functionality_patterns = [
            # F-XXX-YYY: Title format
            r'([F]-\w+-\d+):\s*([^\n]+)(?:\n((?:(?!^[F]-\w+-\d+:).*\n?)*?))?',
            # ### F-XXX: Title format
            r'###\s*([F]-\w+-\d+):\s*([^\n]+)\n(.*?)(?=###|##|$)',
            # Numbered list with F-XXX
            r'\d+\.\s*\*\*([F]-\w+-\d+)\*\*:\s*([^\n]+)(?:\n((?:(?!\d+\.\s*\*\*).*\n?)*?))?'
        ]

        for pattern in functionality_patterns:
            matches = re.finditer(pattern, section_content, re.MULTILINE | re.DOTALL)
            for match in matches:
                func_id = match.group(1)
                func_title = match.group(2).strip()
                func_desc = match.group(3).strip() if match.group(3) else ""

                # Determine priority from context
                priority = self._determine_priority(func_desc)

                # Extract related personas
                personas = self._extract_personas(func_desc)

                # Extract acceptance criteria
                criteria = self._extract_acceptance_criteria(func_desc)

                self.functionalities[func_id] = PRDFunctionality(
                    id=func_id,
                    title=func_title,
                    description=func_desc,
                    section="PRD-F §2.4",
                    priority=priority,
                    acceptance_criteria=criteria,
                    related_personas=personas
                )

    def _parse_user_journeys(self, content: str):
        """Parse user journeys for additional context"""
        journey_section = re.search(
            r'##\s*3[.\s]*(?:User\s*Journey|Journey|Flujo)\s*\n(.*?)(?=##|$)',
            content,
            re.DOTALL | re.IGNORECASE
        )

        if journey_section:
            journey_content = journey_section.group(1)

            # Extract journey steps and map to functionalities
            for func_id, functionality in self.functionalities.items():
                if any(keyword in journey_content.lower()
                      for keywords in self.domain_patterns.values()
                      for keyword in keywords):
                    # This functionality is mentioned in user journeys
                    functionality.description += f"\n\n**User Journey Context**: Mentioned in user journey flows"

    def _parse_use_cases(self, content: str):
        """Parse use cases for acceptance criteria"""
        use_case_section = re.search(
            r'##\s*4[.\s]*(?:Casos?\s*de\s*Uso|Use\s*Cases?)\s*\n(.*?)(?=##|$)',
            content,
            re.DOTALL | re.IGNORECASE
        )

        if use_case_section:
            use_case_content = use_case_section.group(1)

            # Extract acceptance criteria patterns
            criteria_patterns = [
                r'(?:Given|Dado|When|Cuando|Then|Entonces)\s+([^\n]+)',
                r'(?:Criterio|Criteria):\s*([^\n]+)',
                r'(?:Acepta|Accept).*?:\s*([^\n]+)'
            ]

            for func_id, functionality in self.functionalities.items():
                for pattern in criteria_patterns:
                    matches = re.findall(pattern, use_case_content, re.IGNORECASE)
                    for match in matches:
                        if any(keyword in match.lower() for keyword in functionality.title.lower().split()):
                            if match not in functionality.acceptance_criteria:
                                functionality.acceptance_criteria.append(match.strip())

    def _parse_nfr_section(self, content: str):
        """Parse section 5: Requisitos No Funcionales"""
        section_patterns = [
            r'##\s*5[.\s]*(?:Requisitos?\s*No\s*Funcionales?|Non.?Functional|NFR)\s*\n(.*?)(?=##|$)',
            r'##\s*NFR\s*\n(.*?)(?=##|$)',
            r'##\s*Non.?Functional\s+Requirements?\s*\n(.*?)(?=##|$)'
        ]

        section_content = ""
        for pattern in section_patterns:
            match = re.search(pattern, content, re.DOTALL | re.IGNORECASE)
            if match:
                section_content = match.group(1)
                break

        if not section_content:
            print("⚠️  Section 5 (NFR) not found")
            return

        # Define NFR categories with patterns
        nfr_category_patterns = {
            'performance': [
                r'(?:performance|rendimiento|velocidad|latencia|throughput)',
                r'(?:tiempo\s+de\s+respuesta|response\s+time)',
                r'(?:carga|load|stress)'
            ],
            'security': [
                r'(?:security|seguridad|autenticación|autorización)',
                r'(?:cifrado|encryption|crypto)',
                r'(?:gdpr|privacidad|privacy)'
            ],
            'availability': [
                r'(?:availability|disponibilidad|uptime)',
                r'(?:alta\s+disponibilidad|high\s+availability)',
                r'(?:continuidad|disaster\s+recovery)'
            ],
            'scalability': [
                r'(?:scalability|escalabilidad|crecimiento)',
                r'(?:horizontal|vertical)',
                r'(?:auto.?scaling|elastic)'
            ],
            'usability': [
                r'(?:usability|usabilidad|ux|experiencia)',
                r'(?:accesibilidad|accessibility|wcag)',
                r'(?:interfaz|interface|ui)'
            ],
            'compliance': [
                r'(?:compliance|cumplimiento|regulación)',
                r'(?:iso|sox|pci|gdpr|eidas)',
                r'(?:auditoría|audit|legal)'
            ],
            'reliability': [
                r'(?:reliability|fiabilidad|estabilidad)',
                r'(?:error\s+rate|tasa\s+de\s+error)',
                r'(?:mtbf|mttr|recovery)'
            ],
            'maintainability': [
                r'(?:maintainability|mantenibilidad|soporte)',
                r'(?:código\s+limpio|clean\s+code)',
                r'(?:documentación|documentation)'
            ]
        }

        # Extract NFR categories and their requirements
        for category, patterns in nfr_category_patterns.items():
            category_found = False
            requirements = []

            for pattern in patterns:
                matches = re.finditer(pattern, section_content, re.IGNORECASE)
                for match in matches:
                    category_found = True
                    # Extract the sentence/paragraph containing the match
                    start = max(0, match.start() - 100)
                    end = min(len(section_content), match.end() + 100)
                    context = section_content[start:end]

                    # Find sentence boundaries
                    sentences = re.split(r'[.!?]\s+', context)
                    for sentence in sentences:
                        if pattern in sentence.lower():
                            requirements.append(sentence.strip())
                            break

            if category_found:
                self.nfr_categories[category] = NFRCategory(
                    name=category,
                    section="PRD-T §5",
                    description=f"NFR category extracted from PRD-T section 5",
                    requirements=list(set(requirements)),  # Remove duplicates
                    mandatory=(category in self.mandatory_nfr_categories)
                )

    def _parse_architecture_nfrs(self, content: str):
        """Parse architecture section for additional NFRs"""
        arch_section = re.search(
            r'##\s*3[.\s]*(?:Arquitectura|Architecture)\s*\n(.*?)(?=##|$)',
            content,
            re.DOTALL | re.IGNORECASE
        )

        if arch_section:
            arch_content = arch_section.group(1)

            # Look for implicit NFRs in architecture decisions
            implicit_nfrs = {
                'microservices': 'scalability',
                'cache': 'performance',
                'load balancer': 'availability',
                'kubernetes': 'scalability',
                'redis': 'performance',
                'encryption': 'security',
                'https': 'security',
                'monitoring': 'reliability'
            }

            for tech_term, nfr_category in implicit_nfrs.items():
                if tech_term in arch_content.lower():
                    if nfr_category not in self.nfr_categories:
                        self.nfr_categories[nfr_category] = NFRCategory(
                            name=nfr_category,
                            section="PRD-T §3 (Architecture)",
                            description=f"Implicit NFR from architecture decision: {tech_term}",
                            requirements=[f"Architecture requires {tech_term} for {nfr_category}"],
                            mandatory=(nfr_category in self.mandatory_nfr_categories)
                        )
                    else:
                        # Add to existing category
                        self.nfr_categories[nfr_category].requirements.append(
                            f"Architecture decision: {tech_term}"
                        )

    def _parse_technical_considerations(self, content: str):
        """Parse technical considerations for additional NFRs"""
        tech_section = re.search(
            r'##\s*6[.\s]*(?:Consideraciones?\s*Técnicas?|Technical\s*Considerations?)\s*\n(.*?)(?=##|$)',
            content,
            re.DOTALL | re.IGNORECASE
        )

        if tech_section:
            tech_content = tech_section.group(1)

            # Extract specific metrics mentioned
            metric_patterns = [
                r'(?:(\d+(?:\.\d+)?)\s*(?:ms|milliseconds?|segundos?|minutes?))',  # Time metrics
                r'(?:(\d+(?:\.\d+)?)\s*(?:mb|gb|kb|bytes?))',  # Size metrics
                r'(?:(\d+(?:\.\d+)?)\s*(?:%|percent|porcentaje))',  # Percentage metrics
                r'(?:(\d+(?:\.\d+)?)\s*(?:rps|requests?.*?second|req.*?seg))'  # Throughput metrics
            ]

            for pattern in metric_patterns:
                matches = re.findall(pattern, tech_content, re.IGNORECASE)
                if matches:
                    # Add performance NFR if metrics are mentioned
                    if 'performance' not in self.nfr_categories:
                        self.nfr_categories['performance'] = NFRCategory(
                            name='performance',
                            section="PRD-T §6",
                            description="Performance requirements from technical considerations",
                            requirements=[f"Metrics specified: {', '.join(matches)}"],
                            mandatory=True
                        )

    def _validate_mandatory_nfrs(self):
        """Validate that mandatory NFR categories are present for domain-specific projects"""
        missing_mandatory = []

        for category in self.mandatory_nfr_categories:
            if category not in self.nfr_categories:
                missing_mandatory.append(category)

        if missing_mandatory:
            print(f"⚠️  Missing mandatory NFR categories for domain-specific project: {', '.join(missing_mandatory)}")

            # Add placeholders for missing mandatory categories
            for category in missing_mandatory:
                self.nfr_categories[category] = NFRCategory(
                    name=category,
                    section="PRD-T (Missing - Auto-generated)",
                    description=f"MISSING: This category is mandatory for {{CLIENT_NAME}} domain-specific projects",
                    requirements=[f"PLACEHOLDER: Define {category} requirements"],
                    mandatory=True
                )

    def _determine_priority(self, description: str) -> str:
        """Determine functionality priority from description context"""
        high_priority_keywords = ['critical', 'mandatory', 'required', 'must', 'essential']
        medium_priority_keywords = ['important', 'should', 'recommended']
        low_priority_keywords = ['nice', 'could', 'optional', 'future']

        desc_lower = description.lower()

        if any(keyword in desc_lower for keyword in high_priority_keywords):
            return "High"
        elif any(keyword in desc_lower for keyword in medium_priority_keywords):
            return "Medium"
        elif any(keyword in desc_lower for keyword in low_priority_keywords):
            return "Low"
        else:
            return "Medium"  # Default

    def _extract_personas(self, description: str) -> List[str]:
        """Extract mentioned personas from description"""
        persona_patterns = [
            r'(?:usuario|user|cliente|customer|administrador|admin)',
            r'(?:operador|operator|técnico|technician)',
            r'(?:end.?user|final\s+user)',
            r'(?:developer|desarrollador)'
        ]

        personas = []
        for pattern in persona_patterns:
            if re.search(pattern, description, re.IGNORECASE):
                personas.append(pattern)

        return list(set(personas))

    def _extract_acceptance_criteria(self, description: str) -> List[str]:
        """Extract acceptance criteria from description"""
        criteria_patterns = [
            r'(?:Given|Dado|When|Cuando|Then|Entonces)\s+([^\n.]+)',
            r'(?:Criteria|Criterio):\s*([^\n]+)',
            r'(?:Must|Debe)\s+([^\n.]+)'
        ]

        criteria = []
        for pattern in criteria_patterns:
            matches = re.findall(pattern, description, re.IGNORECASE)
            criteria.extend([match.strip() for match in matches])

        return criteria

    def export_to_json(self, output_file: str = "prd-analysis.json"):
        """Export parsed data to JSON for further processing"""
        data = {
            "metadata": asdict(self.metadata),
            "functionalities": {func_id: asdict(func) for func_id, func in self.functionalities.items()},
            "nfr_categories": {cat_id: asdict(cat) for cat_id, cat in self.nfr_categories.items()},
            "statistics": {
                "total_functionalities": len(self.functionalities),
                "total_nfr_categories": len(self.nfr_categories),
                "mandatory_nfr_categories": len([cat for cat in self.nfr_categories.values() if cat.mandatory]),
                "high_priority_functionalities": len([func for func in self.functionalities.values() if func.priority == "High"]),
                "functionalities_with_criteria": len([func for func in self.functionalities.values() if func.acceptance_criteria])
            }
        }

        output_path = Path(output_file)
        output_path.write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding='utf-8')
        print(f"✅ PRD analysis exported to: {output_path}")
        return str(output_path)

    def generate_summary_report(self, output_file: str = "prd-summary.md"):
        """Generate human-readable summary report"""
        output_path = Path(output_file)

        content = f"""# PRD Analysis Summary

**Documento**: {self.metadata.title}
**Versión**: {self.metadata.version}
**Última actualización**: {self.metadata.last_updated}

## Funcionalidades Extraídas ({len(self.functionalities)})

| ID | Título | Prioridad | Criterios | Personas |
|----|--------|-----------|-----------|----------|
"""

        for func in self.functionalities.values():
            criteria_count = len(func.acceptance_criteria)
            personas_text = ", ".join(func.related_personas[:2])  # Limit display
            if len(func.related_personas) > 2:
                personas_text += "..."

            content += f"| {func.id} | {func.title} | {func.priority} | {criteria_count} | {personas_text} |\n"

        content += f"""
## NFR Categories Identified ({len(self.nfr_categories)})

| Categoría | Sección | Obligatoria | Requisitos |
|-----------|---------|-------------|------------|
"""

        for nfr in self.nfr_categories.values():
            mandatory_mark = "✅" if nfr.mandatory else "—"
            req_count = len(nfr.requirements)

            content += f"| {nfr.name} | {nfr.section} | {mandatory_mark} | {req_count} |\n"

        content += f"""
## Summary Statistics

- **Total Functionalities**: {len(self.functionalities)}
- **High Priority**: {len([f for f in self.functionalities.values() if f.priority == "High"])}
- **With Acceptance Criteria**: {len([f for f in self.functionalities.values() if f.acceptance_criteria])}
- **NFR Categories**: {len(self.nfr_categories)}
- **Mandatory Categories**: {len([c for c in self.nfr_categories.values() if c.mandatory])}

## Validation Readiness

| Check | Status |
|-------|--------|
| All functionalities have IDs | {"✅" if all(f.id for f in self.functionalities.values()) else "❌"} |
| Mandatory NFR categories present | {"✅" if all(cat in self.nfr_categories for cat in self.mandatory_nfr_categories) else "❌"} |
| Functionalities have priorities | {"✅" if all(f.priority for f in self.functionalities.values()) else "❌"} |
| Some acceptance criteria defined | {"✅" if any(f.acceptance_criteria for f in self.functionalities.values()) else "❌"} |

## Recommendations

"""

        # Add recommendations based on analysis
        if len([f for f in self.functionalities.values() if not f.acceptance_criteria]) > 0:
            content += "- ⚠️  Some functionalities lack acceptance criteria - consider adding BDD scenarios\n"

        missing_mandatory = [cat for cat in self.mandatory_nfr_categories if cat not in self.nfr_categories]
        if missing_mandatory:
            content += f"- ❌ Missing mandatory NFR categories: {', '.join(missing_mandatory)}\n"

        if len([f for f in self.functionalities.values() if f.priority == "High"]) == 0:
            content += "- ⚠️  No high priority functionalities identified - verify prioritization\n"

        content += "\n---\n\n*Generated by {{CLIENT_NAME}} PRD Parser*"

        output_path.write_text(content, encoding='utf-8')
        print(f"✅ Summary report generated: {output_path}")
        return str(output_path)


def main():
    parser = argparse.ArgumentParser(description="{{CLIENT_NAME}} PRD Parser and Requirements Extractor")
    parser.add_argument("--prd-funcional", help="Path to PRD Funcional file")
    parser.add_argument("--prd-tecnico", help="Path to PRD Técnico file")
    parser.add_argument("--output-dir", default=".", help="Output directory")
    parser.add_argument("--json-output", default="prd-analysis.json", help="JSON output filename")
    parser.add_argument("--summary-output", default="prd-summary.md", help="Summary report filename")
    parser.add_argument("--verbose", "-v", action="store_true", help="Verbose output")

    args = parser.parse_args()

    print("🚀 {{CLIENT_NAME}} PRD Parser - Requirements Extraction")
    print("=" * 50)

    parser_instance = PRDParser()

    # Parse PRD Funcional
    if args.prd_funcional:
        prd_f_path = Path(args.prd_funcional)
        if prd_f_path.exists():
            parser_instance.parse_prd_funcional(prd_f_path)
        else:
            print(f"❌ PRD Funcional not found: {prd_f_path}")
    else:
        # Auto-discover PRD Funcional
        search_paths = [Path("."), Path("docs"), Path("docs/projects")]
        for search_path in search_paths:
            if search_path.exists():
                for prd_file in search_path.glob("*funcional*.md"):
                    print(f"📁 Auto-discovered PRD Funcional: {prd_file}")
                    parser_instance.parse_prd_funcional(prd_file)
                    break

    # Parse PRD Técnico
    if args.prd_tecnico:
        prd_t_path = Path(args.prd_tecnico)
        if prd_t_path.exists():
            parser_instance.parse_prd_tecnico(prd_t_path)
        else:
            print(f"❌ PRD Técnico not found: {prd_t_path}")
    else:
        # Auto-discover PRD Técnico
        search_paths = [Path("."), Path("docs"), Path("docs/projects")]
        for search_path in search_paths:
            if search_path.exists():
                for prd_file in search_path.glob("*tecnico*.md"):
                    print(f"📁 Auto-discovered PRD Técnico: {prd_file}")
                    parser_instance.parse_prd_tecnico(prd_file)
                    break

    # Export results
    output_dir = Path(args.output_dir)
    output_dir.mkdir(exist_ok=True)

    json_path = parser_instance.export_to_json(output_dir / args.json_output)
    summary_path = parser_instance.generate_summary_report(output_dir / args.summary_output)

    print(f"\n📊 Analysis Complete:")
    print(f"   Functionalities: {len(parser_instance.functionalities)}")
    print(f"   NFR Categories: {len(parser_instance.nfr_categories)}")
    print(f"   Mandatory Missing: {len([cat for cat in parser_instance.mandatory_nfr_categories if cat not in parser_instance.nfr_categories])}")

    print(f"\n📄 Output Files:")
    print(f"   📁 JSON: {json_path}")
    print(f"   📝 Summary: {summary_path}")

if __name__ == "__main__":
    main()