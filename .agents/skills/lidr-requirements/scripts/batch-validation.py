#!/usr/bin/env python3
"""
Batch Validation Script - BMAD-Style Quality Dashboard
Validates multiple documents and generates comprehensive quality reports
Inspired by BMAD Method's 13-step validation process
"""

import os
import sys
import json
import yaml
import subprocess
from pathlib import Path
from datetime import datetime
from typing import List, Dict, Any
import argparse

class BatchValidator:
    def __init__(self, config_path: str = None):
        self.config_path = config_path or "validation_config.yaml"
        self.validation_script = "validation-engine.py"
        self.results = []

    def find_documents(self, root_dir: str) -> List[Dict[str, str]]:
        """Find all documents to validate in the ecosystem"""
        documents = []

        # Skills examples
        skills_dir = Path(root_dir) / ".claude" / "skills"
        if skills_dir.exists():
            for skill_dir in skills_dir.iterdir():
                if skill_dir.is_dir():
                    # Generic examples
                    generic_dir = skill_dir / "examples" / "generic"
                    if generic_dir.exists():
                        for doc in generic_dir.glob("*.md"):
                            documents.append({
                                "path": str(doc),
                                "type": "template",
                                "domain": "generic",
                                "skill": skill_dir.name,
                                "category": "examples"
                            })

                    # Domain-specific examples
                    domains_dir = skill_dir / "examples" / "domains"
                    if domains_dir.exists():
                        for domain_dir in domains_dir.iterdir():
                            if domain_dir.is_dir():
                                for doc in domain_dir.glob("*.md"):
                                    documents.append({
                                        "path": str(doc),
                                        "type": "example",
                                        "domain": domain_dir.name,
                                        "skill": skill_dir.name,
                                        "category": "examples"
                                    })

                    # Legacy examples (root of examples/)
                    examples_dir = skill_dir / "examples"
                    if examples_dir.exists():
                        for doc in examples_dir.glob("*.md"):
                            if not (doc.parent / "generic").exists():  # Only if no generic/ folder
                                documents.append({
                                    "path": str(doc),
                                    "type": "legacy",
                                    "domain": "unknown",
                                    "skill": skill_dir.name,
                                    "category": "examples"
                                })

        # Documentation
        docs_dir = Path(root_dir) / ".claude" / "docs"
        if docs_dir.exists():
            for category_dir in docs_dir.iterdir():
                if category_dir.is_dir():
                    for doc in category_dir.glob("*.md"):
                        documents.append({
                            "path": str(doc),
                            "type": "documentation",
                            "domain": "process",
                            "skill": "docs",
                            "category": category_dir.name
                        })

        return documents

    def validate_document(self, doc_info: Dict[str, str]) -> Dict[str, Any]:
        """Validate a single document using validation-engine.py"""
        print(f"🔍 Validating {doc_info['skill']}/{Path(doc_info['path']).name}")

        # Determine document type
        doc_type = "auto"
        if "prd" in doc_info['path'].lower():
            doc_type = "prd"
        elif "requirements" in doc_info['path'].lower():
            doc_type = "rf"
        elif "nfr" in doc_info['path'].lower():
            doc_type = "nfr"
        elif "epic" in doc_info['path'].lower():
            doc_type = "epic"

        try:
            # Run validation
            cmd = [
                sys.executable,
                self.validation_script,
                doc_info['path'],
                "--type", doc_type
            ]

            result = subprocess.run(cmd, capture_output=True, text=True, cwd=Path(__file__).parent)

            # Extract score from output
            score = 0.0
            rating = "Unknown"
            status = "Error"

            if result.returncode == 0 or "Validation complete" in result.stdout:
                # Parse the output for score
                for line in result.stdout.split('\n'):
                    if "Validation complete:" in line:
                        # Extract rating like "4/5 - Good"
                        rating_part = line.split("Validation complete: ")[1].split(" (")[0]
                        rating = rating_part
                        status_part = line.split(" (")[1].rstrip(")")
                        status = status_part

                        # Convert to numeric score
                        if "5/5" in rating:
                            score = 5.0
                        elif "4/5" in rating:
                            score = 4.0
                        elif "3/5" in rating:
                            score = 3.0
                        elif "2/5" in rating:
                            score = 2.0
                        elif "1/5" in rating:
                            score = 1.0
                        break

            return {
                "document": doc_info,
                "score": score,
                "rating": rating,
                "status": status,
                "validated": True,
                "error": None if result.returncode == 0 else result.stderr
            }

        except Exception as e:
            return {
                "document": doc_info,
                "score": 0.0,
                "rating": "Error",
                "status": "Failed",
                "validated": False,
                "error": str(e)
            }

    def generate_quality_dashboard(self, results: List[Dict[str, Any]]) -> str:
        """Generate BMAD-style quality dashboard"""
        total_docs = len(results)
        validated_docs = len([r for r in results if r['validated']])
        avg_score = sum(r['score'] for r in results if r['validated']) / validated_docs if validated_docs > 0 else 0

        # Score distribution
        score_dist = {
            "5": len([r for r in results if r['score'] >= 4.5]),
            "4": len([r for r in results if 3.5 <= r['score'] < 4.5]),
            "3": len([r for r in results if 2.5 <= r['score'] < 3.5]),
            "2": len([r for r in results if 1.5 <= r['score'] < 2.5]),
            "1": len([r for r in results if 0.5 <= r['score'] < 1.5]),
            "0": len([r for r in results if r['score'] < 0.5])
        }

        # Category analysis
        by_category = {}
        by_skill = {}
        by_domain = {}

        for result in results:
            if not result['validated']:
                continue

            doc = result['document']

            # By category
            cat = doc['category']
            if cat not in by_category:
                by_category[cat] = []
            by_category[cat].append(result['score'])

            # By skill
            skill = doc['skill']
            if skill not in by_skill:
                by_skill[skill] = []
            by_skill[skill].append(result['score'])

            # By domain
            domain = doc['domain']
            if domain not in by_domain:
                by_domain[domain] = []
            by_domain[domain].append(result['score'])

        # Calculate averages
        category_averages = {k: sum(v)/len(v) for k, v in by_category.items()}
        skill_averages = {k: sum(v)/len(v) for k, v in by_skill.items()}
        domain_averages = {k: sum(v)/len(v) for k, v in by_domain.items()}

        # Generate report
        report = f"""---
validationDate: '{datetime.now().isoformat()}'
totalDocuments: {total_docs}
validatedDocuments: {validated_docs}
averageScore: {avg_score:.2f}
validationEngine: '{{CLIENT_NAME}} SDLC Validation Engine v1.0'
reportType: 'Quality Dashboard'
---

# Quality Dashboard - BMAD-Style Validation Report

**Generated:** {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
**Ecosystem Health:** {avg_score:.2f}/5.0 ⭐
**Coverage:** {validated_docs}/{total_docs} documents ({(validated_docs/total_docs*100):.1f}%)

## Executive Summary

### Overall Quality Distribution
```
⭐⭐⭐⭐⭐ Excellent (5/5): {score_dist['5']} documents ({(score_dist['5']/validated_docs*100):.1f}%)
⭐⭐⭐⭐   Good (4/5):      {score_dist['4']} documents ({(score_dist['4']/validated_docs*100):.1f}%)
⭐⭐⭐     Satisfactory:    {score_dist['3']} documents ({(score_dist['3']/validated_docs*100):.1f}%)
⭐⭐       Needs Work:      {score_dist['2']} documents ({(score_dist['2']/validated_docs*100):.1f}%)
⭐         Poor:           {score_dist['1']} documents ({(score_dist['1']/validated_docs*100):.1f}%)
          Failed:         {score_dist['0']} documents ({(score_dist['0']/validated_docs*100):.1f}%)
```

### Quality by Category
"""

        for category, avg in sorted(category_averages.items(), key=lambda x: x[1], reverse=True):
            count = len(by_category[category])
            status_emoji = "🟢" if avg >= 4.0 else "🟡" if avg >= 3.0 else "🔴"
            report += f"- {status_emoji} **{category}**: {avg:.2f}/5.0 ({count} documents)\n"

        report += f"""

### Quality by Domain
"""

        for domain, avg in sorted(domain_averages.items(), key=lambda x: x[1], reverse=True):
            count = len(by_domain[domain])
            status_emoji = "🟢" if avg >= 4.0 else "🟡" if avg >= 3.0 else "🔴"
            report += f"- {status_emoji} **{domain}**: {avg:.2f}/5.0 ({count} documents)\n"

        # Top and bottom performers
        report += f"""

## Detailed Analysis

### 🏆 Top Performers (Score ≥ 4.0)
"""

        top_performers = [r for r in results if r['validated'] and r['score'] >= 4.0]
        top_performers.sort(key=lambda x: x['score'], reverse=True)

        for result in top_performers[:10]:  # Top 10
            doc = result['document']
            report += f"- **{doc['skill']}/{Path(doc['path']).name}** → {result['rating']} ({result['score']:.1f}/5.0)\n"

        # Areas needing improvement
        report += f"""

### 🔧 Areas Needing Improvement (Score < 3.0)
"""

        need_work = [r for r in results if r['validated'] and r['score'] < 3.0]
        need_work.sort(key=lambda x: x['score'])

        for result in need_work:
            doc = result['document']
            report += f"- **{doc['skill']}/{Path(doc['path']).name}** → {result['rating']} ({result['score']:.1f}/5.0) - {result['status']}\n"

        # Validation errors
        errors = [r for r in results if not r['validated']]
        if errors:
            report += f"""

### ❌ Validation Errors ({len(errors)} documents)
"""
            for result in errors:
                doc = result['document']
                error = result['error'][:100] + "..." if result['error'] and len(result['error']) > 100 else result['error']
                report += f"- **{doc['skill']}/{Path(doc['path']).name}** → {error}\n"

        # Skills ranking
        report += f"""

## Skills Quality Ranking

| Rank | Skill | Avg Score | Documents | Status |
|------|-------|-----------|-----------|--------|
"""

        for i, (skill, avg) in enumerate(sorted(skill_averages.items(), key=lambda x: x[1], reverse=True), 1):
            count = len(by_skill[skill])
            status = "🟢 Excellent" if avg >= 4.5 else "🟢 Good" if avg >= 4.0 else "🟡 Fair" if avg >= 3.0 else "🔴 Poor"
            report += f"| {i} | {skill} | {avg:.2f} | {count} | {status} |\n"

        report += f"""

## Recommendations

### Immediate Actions (Critical)
"""

        critical_issues = [r for r in results if r['validated'] and r['score'] < 2.0]
        if critical_issues:
            for result in critical_issues:
                doc = result['document']
                report += f"- Fix **{doc['skill']}/{Path(doc['path']).name}** - Score: {result['score']:.1f}/5.0\n"
        else:
            report += "- ✅ No critical quality issues found\n"

        report += f"""
### Process Improvements
- **Templates standardization**: {len([r for r in results if r['document']['type'] == 'template'])}/{len([r for r in results if r['document']['type'] == 'template'])} generic templates validated
- **Domain coverage**: {len(domain_averages)} domains represented
- **Frontmatter compliance**: Add YAML frontmatter to low-scoring documents
- **Traceability**: Improve cross-references in documentation

### Next Steps
1. Address documents scoring < 3.0/5.0
2. Standardize YAML frontmatter across all templates
3. Implement automated validation in CI/CD
4. Review skills with consistently low scores

---

**Generated by {{CLIENT_NAME}} SDLC Validation Engine v1.0**
**Inspired by BMAD Method's 13-step validation process**
"""

        return report

    def run_batch_validation(self, root_dir: str, output_dir: str = None) -> str:
        """Run batch validation on entire ecosystem"""
        print("🚀 Starting batch validation of {{CLIENT_NAME}} SDLC ecosystem")

        # Find all documents
        documents = self.find_documents(root_dir)
        print(f"📄 Found {len(documents)} documents to validate")

        # Validate each document
        results = []
        for doc_info in documents:
            result = self.validate_document(doc_info)
            results.append(result)

            # Progress indicator
            validated = len([r for r in results if r['validated']])
            total = len(results)
            print(f"   Progress: {total}/{len(documents)} ({(total/len(documents)*100):.1f}%) | Quality: {validated}/{total}")

        self.results = results

        # Generate dashboard
        dashboard = self.generate_quality_dashboard(results)

        # Save results
        if output_dir:
            output_path = Path(output_dir)
        else:
            output_path = Path(root_dir) / ".claude" / "validation-reports"

        output_path.mkdir(parents=True, exist_ok=True)

        # Save dashboard
        dashboard_file = output_path / f"quality-dashboard-{datetime.now().strftime('%Y-%m-%d')}.md"
        dashboard_file.write_text(dashboard)

        # Save JSON data
        json_file = output_path / f"validation-results-{datetime.now().strftime('%Y-%m-%d')}.json"
        with open(json_file, 'w') as f:
            json.dump(results, f, indent=2, default=str)

        print(f"✅ Batch validation complete!")
        print(f"📊 Quality dashboard: {dashboard_file}")
        print(f"📋 Raw results: {json_file}")

        return str(dashboard_file)

def main():
    parser = argparse.ArgumentParser(description="Batch validation of SDLC ecosystem")
    parser.add_argument("root_dir", help="Root directory of the ecosystem")
    parser.add_argument("--output", help="Output directory for reports")
    parser.add_argument("--config", help="Validation configuration file")

    args = parser.parse_args()

    validator = BatchValidator(args.config)
    dashboard_file = validator.run_batch_validation(args.root_dir, args.output)

    print(f"\n🎯 Executive Summary:")
    results = validator.results
    validated = len([r for r in results if r['validated']])
    avg_score = sum(r['score'] for r in results if r['validated']) / validated if validated > 0 else 0
    print(f"   Documents validated: {validated}/{len(results)}")
    print(f"   Average quality: {avg_score:.2f}/5.0")

    if avg_score >= 4.0:
        print("   🟢 Ecosystem health: EXCELLENT")
    elif avg_score >= 3.0:
        print("   🟡 Ecosystem health: GOOD")
    else:
        print("   🔴 Ecosystem health: NEEDS IMPROVEMENT")

if __name__ == "__main__":
    main()