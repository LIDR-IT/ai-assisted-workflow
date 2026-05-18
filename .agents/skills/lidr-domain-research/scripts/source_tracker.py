#!/usr/bin/env python3
"""
Source Tracker - Bibliography and Source Management System
Part of the domain-research skill for Claude Code

This script provides automated source tracking, quality assessment,
and bibliography management for domain research projects.

Usage:
    python source_tracker.py --project "project-name" --action [add|list|assess|export]

Features:
- Automated source quality scoring
- Bibliography generation in multiple formats
- Source triangulation tracking
- Confidence level management
- Export to research reports
"""

import json
import uuid
import argparse
import sqlite3
import requests
import datetime
from pathlib import Path
from typing import Dict, List, Optional, Tuple
from dataclasses import dataclass, asdict
from urllib.parse import urlparse
import re

@dataclass
class Source:
    """Data class representing a research source"""
    id: str
    title: str
    author: str
    organization: str
    source_type: str  # 'academic', 'industry', 'news', 'interview', 'patent', 'company'
    url: Optional[str]
    publication_date: Optional[str]
    access_date: str
    quality_score: float
    confidence_level: str  # 'high', 'medium', 'low'
    notes: str
    tags: List[str]
    extracted_claims: List[str]

    def __post_init__(self):
        if not self.id:
            self.id = str(uuid.uuid4())
        if not self.access_date:
            self.access_date = datetime.datetime.now().isoformat()

@dataclass
class Claim:
    """Data class representing a research claim"""
    id: str
    source_id: str
    claim_text: str
    claim_type: str  # 'quantitative', 'qualitative', 'prediction'
    page_reference: Optional[str]
    confidence_level: str
    extracted_date: str
    validation_status: str  # 'unvalidated', 'confirmed', 'refuted', 'uncertain'
    supporting_sources: List[str]  # List of source IDs that support this claim

class SourceTracker:
    """Main class for managing research sources and claims"""

    def __init__(self, project_name: str, db_path: Optional[str] = None):
        self.project_name = project_name
        self.db_path = db_path or f"{project_name}_research.db"
        self._init_database()

    def _init_database(self):
        """Initialize SQLite database with required tables"""
        self.conn = sqlite3.connect(self.db_path)

        # Sources table
        self.conn.execute('''
            CREATE TABLE IF NOT EXISTS sources (
                id TEXT PRIMARY KEY,
                title TEXT NOT NULL,
                author TEXT,
                organization TEXT,
                source_type TEXT,
                url TEXT,
                publication_date TEXT,
                access_date TEXT,
                quality_score REAL,
                confidence_level TEXT,
                notes TEXT,
                tags TEXT,  -- JSON array
                extracted_claims TEXT  -- JSON array
            )
        ''')

        # Claims table
        self.conn.execute('''
            CREATE TABLE IF NOT EXISTS claims (
                id TEXT PRIMARY KEY,
                source_id TEXT,
                claim_text TEXT NOT NULL,
                claim_type TEXT,
                page_reference TEXT,
                confidence_level TEXT,
                extracted_date TEXT,
                validation_status TEXT,
                supporting_sources TEXT,  -- JSON array
                FOREIGN KEY (source_id) REFERENCES sources (id)
            )
        ''')

        # Cross-references table for source triangulation
        self.conn.execute('''
            CREATE TABLE IF NOT EXISTS cross_references (
                claim_id TEXT,
                supporting_source_id TEXT,
                confirmation_type TEXT,  -- 'confirms', 'contradicts', 'qualifies'
                strength INTEGER,  -- 1-10 scale
                notes TEXT,
                FOREIGN KEY (claim_id) REFERENCES claims (id),
                FOREIGN KEY (supporting_source_id) REFERENCES sources (id)
            )
        ''')

        self.conn.commit()

    def add_source(self, source_data: Dict) -> Source:
        """Add a new source to the database"""
        source = Source(**source_data)

        # Calculate quality score if not provided
        if 'quality_score' not in source_data or source_data['quality_score'] is None:
            source.quality_score = self._calculate_quality_score(source)

        # Insert into database
        self.conn.execute('''
            INSERT INTO sources (
                id, title, author, organization, source_type, url,
                publication_date, access_date, quality_score, confidence_level,
                notes, tags, extracted_claims
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            source.id, source.title, source.author, source.organization,
            source.source_type, source.url, source.publication_date,
            source.access_date, source.quality_score, source.confidence_level,
            source.notes, json.dumps(source.tags), json.dumps(source.extracted_claims)
        ))

        self.conn.commit()
        return source

    def _calculate_quality_score(self, source: Source) -> float:
        """Calculate quality score based on multiple factors"""
        score = 5.0  # Base score

        # Authority scoring (0-3 points)
        authority_score = self._assess_authority(source)
        score += authority_score

        # Recency scoring (0-2 points)
        recency_score = self._assess_recency(source)
        score += recency_score

        # Source type scoring (0-1 points)
        type_scores = {
            'academic': 1.0,
            'industry': 0.8,
            'interview': 0.9,
            'company': 0.6,
            'news': 0.4,
            'patent': 0.7
        }
        score += type_scores.get(source.source_type, 0.5)

        # URL/DOI bonus (0-0.5 points)
        if source.url and ('doi.org' in source.url or 'academic' in source.source_type):
            score += 0.5

        return min(score, 10.0)  # Cap at 10.0

    def _assess_authority(self, source: Source) -> float:
        """Assess source authority (0-3 points)"""
        score = 0.0

        # Organization reputation
        prestigious_orgs = [
            'mit', 'stanford', 'harvard', 'cambridge', 'oxford',
            'mckinsey', 'bcg', 'deloitte', 'pwc', 'accenture',
            'gartner', 'forrester', 'idc', 'ieee', 'acm'
        ]

        if source.organization:
            org_lower = source.organization.lower()
            if any(org in org_lower for org in prestigious_orgs):
                score += 2.0
            elif 'university' in org_lower or 'institute' in org_lower:
                score += 1.5
            elif any(word in org_lower for word in ['research', 'center', 'lab']):
                score += 1.0

        # Author credentials (basic check)
        if source.author:
            if 'dr.' in source.author.lower() or 'prof.' in source.author.lower():
                score += 1.0
            elif 'phd' in source.author.lower():
                score += 0.5

        return min(score, 3.0)

    def _assess_recency(self, source: Source) -> float:
        """Assess source recency (0-2 points)"""
        if not source.publication_date:
            return 0.5  # Unknown date gets moderate score

        try:
            # Parse publication date
            pub_date = datetime.datetime.fromisoformat(source.publication_date.replace('Z', '+00:00'))
            now = datetime.datetime.now(datetime.timezone.utc)
            days_old = (now - pub_date).days

            # Scoring based on age
            if days_old <= 180:  # 6 months
                return 2.0
            elif days_old <= 365:  # 1 year
                return 1.5
            elif days_old <= 730:  # 2 years
                return 1.0
            elif days_old <= 1095:  # 3 years
                return 0.5
            else:
                return 0.0
        except:
            return 0.5  # Default for parsing errors

    def add_claim(self, claim_data: Dict) -> str:
        """Add a claim extracted from a source"""
        claim = Claim(
            id=str(uuid.uuid4()),
            extracted_date=datetime.datetime.now().isoformat(),
            **claim_data
        )

        self.conn.execute('''
            INSERT INTO claims (
                id, source_id, claim_text, claim_type, page_reference,
                confidence_level, extracted_date, validation_status, supporting_sources
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            claim.id, claim.source_id, claim.claim_text, claim.claim_type,
            claim.page_reference, claim.confidence_level, claim.extracted_date,
            claim.validation_status, json.dumps(claim.supporting_sources)
        ))

        self.conn.commit()
        return claim.id

    def validate_claim(self, claim_id: str, supporting_source_ids: List[str],
                      validation_status: str) -> None:
        """Update claim validation status with supporting sources"""
        self.conn.execute('''
            UPDATE claims
            SET validation_status = ?, supporting_sources = ?
            WHERE id = ?
        ''', (validation_status, json.dumps(supporting_source_ids), claim_id))

        # Add cross-references
        for source_id in supporting_source_ids:
            self.conn.execute('''
                INSERT OR REPLACE INTO cross_references (
                    claim_id, supporting_source_id, confirmation_type, strength
                ) VALUES (?, ?, ?, ?)
            ''', (claim_id, source_id, 'confirms', 8))  # Default strength

        self.conn.commit()

    def get_sources(self, source_type: Optional[str] = None,
                   min_quality: float = 0.0) -> List[Dict]:
        """Retrieve sources with optional filtering"""
        query = '''
            SELECT * FROM sources
            WHERE quality_score >= ?
        '''
        params = [min_quality]

        if source_type:
            query += ' AND source_type = ?'
            params.append(source_type)

        query += ' ORDER BY quality_score DESC, access_date DESC'

        cursor = self.conn.execute(query, params)
        sources = []

        for row in cursor.fetchall():
            source_dict = dict(zip([col[0] for col in cursor.description], row))
            source_dict['tags'] = json.loads(source_dict['tags'] or '[]')
            source_dict['extracted_claims'] = json.loads(source_dict['extracted_claims'] or '[]')
            sources.append(source_dict)

        return sources

    def get_claims_by_source(self, source_id: str) -> List[Dict]:
        """Get all claims from a specific source"""
        cursor = self.conn.execute('''
            SELECT * FROM claims WHERE source_id = ?
        ''', (source_id,))

        claims = []
        for row in cursor.fetchall():
            claim_dict = dict(zip([col[0] for col in cursor.description], row))
            claim_dict['supporting_sources'] = json.loads(claim_dict['supporting_sources'] or '[]')
            claims.append(claim_dict)

        return claims

    def generate_bibliography(self, format_type: str = 'apa') -> str:
        """Generate bibliography in specified format"""
        sources = self.get_sources(min_quality=6.0)  # Only high-quality sources

        if format_type.lower() == 'apa':
            return self._generate_apa_bibliography(sources)
        elif format_type.lower() == 'chicago':
            return self._generate_chicago_bibliography(sources)
        elif format_type.lower() == 'markdown':
            return self._generate_markdown_bibliography(sources)
        else:
            raise ValueError(f"Unsupported format: {format_type}")

    def _generate_apa_bibliography(self, sources: List[Dict]) -> str:
        """Generate APA format bibliography"""
        entries = []

        for source in sources:
            if source['source_type'] == 'academic':
                entry = f"{source['author']} ({source['publication_date'][:4] if source['publication_date'] else 'n.d.'}). {source['title']}. {source['organization']}."
                if source['url']:
                    entry += f" Retrieved from {source['url']}"

            elif source['source_type'] == 'industry':
                entry = f"{source['organization']} ({source['publication_date'][:4] if source['publication_date'] else 'n.d.'}). {source['title']}. Retrieved from {source['url'] or 'Industry Report'}"

            elif source['source_type'] == 'interview':
                entry = f"{source['author']}. ({source['access_date'][:10]}). Personal communication."
                if source['organization']:
                    entry = f"{source['author']}, {source['organization']}. ({source['access_date'][:10]}). Personal communication."

            else:
                # Generic format
                entry = f"{source['author'] or source['organization']} ({source['publication_date'][:4] if source['publication_date'] else 'n.d.'}). {source['title']}."
                if source['url']:
                    entry += f" Retrieved from {source['url']}"

            entries.append(entry)

        return '\n\n'.join(sorted(entries))

    def _generate_markdown_bibliography(self, sources: List[Dict]) -> str:
        """Generate Markdown format bibliography"""
        entries = []

        for i, source in enumerate(sources, 1):
            entry = f"{i}. **{source['title']}** - {source['author'] or source['organization']}"

            if source['publication_date']:
                entry += f" ({source['publication_date'][:4]})"

            if source['url']:
                entry += f" [Link]({source['url']})"

            entry += f"\n   - Quality Score: {source['quality_score']:.1f}/10"
            entry += f"\n   - Source Type: {source['source_type'].title()}"

            if source['notes']:
                entry += f"\n   - Notes: {source['notes'][:100]}{'...' if len(source['notes']) > 100 else ''}"

            entries.append(entry)

        return '\n\n'.join(entries)

    def assess_triangulation(self) -> Dict[str, any]:
        """Assess information triangulation across sources"""
        cursor = self.conn.execute('''
            SELECT c.claim_text, c.validation_status,
                   COUNT(cr.supporting_source_id) as support_count,
                   AVG(s.quality_score) as avg_quality
            FROM claims c
            LEFT JOIN cross_references cr ON c.id = cr.claim_id
            LEFT JOIN sources s ON cr.supporting_source_id = s.id
            GROUP BY c.id, c.claim_text, c.validation_status
        ''')

        triangulation_report = {
            'well_supported': [],  # 3+ sources, high quality
            'moderately_supported': [],  # 2 sources, medium quality
            'poorly_supported': [],  # 1 or no sources
            'conflicting': []  # Contradictory evidence
        }

        for row in cursor.fetchall():
            claim_text, status, support_count, avg_quality = row
            support_count = support_count or 0
            avg_quality = avg_quality or 0

            if support_count >= 3 and avg_quality >= 7.0:
                triangulation_report['well_supported'].append(claim_text)
            elif support_count >= 2 and avg_quality >= 5.0:
                triangulation_report['moderately_supported'].append(claim_text)
            elif status == 'refuted':
                triangulation_report['conflicting'].append(claim_text)
            else:
                triangulation_report['poorly_supported'].append(claim_text)

        return triangulation_report

    def export_research_summary(self, output_path: str) -> None:
        """Export comprehensive research summary"""
        sources = self.get_sources()
        triangulation = self.assess_triangulation()

        summary = {
            'project_name': self.project_name,
            'generated_date': datetime.datetime.now().isoformat(),
            'source_count': len(sources),
            'source_breakdown': {},
            'quality_distribution': {},
            'triangulation_assessment': triangulation,
            'top_sources': sources[:10],  # Top 10 by quality
            'research_quality_score': self._calculate_overall_quality()
        }

        # Source type breakdown
        for source in sources:
            source_type = source['source_type']
            summary['source_breakdown'][source_type] = summary['source_breakdown'].get(source_type, 0) + 1

        # Quality distribution
        for source in sources:
            quality_tier = 'high' if source['quality_score'] >= 8.0 else 'medium' if source['quality_score'] >= 6.0 else 'low'
            summary['quality_distribution'][quality_tier] = summary['quality_distribution'].get(quality_tier, 0) + 1

        # Write to file
        with open(output_path, 'w') as f:
            json.dump(summary, f, indent=2, default=str)

        print(f"Research summary exported to {output_path}")

    def _calculate_overall_quality(self) -> float:
        """Calculate overall research quality score"""
        sources = self.get_sources()
        if not sources:
            return 0.0

        # Weighted average quality score
        total_weight = 0
        weighted_sum = 0

        for source in sources:
            # Weight by source type importance
            type_weights = {
                'academic': 1.0,
                'interview': 0.9,
                'industry': 0.8,
                'patent': 0.7,
                'company': 0.6,
                'news': 0.4
            }
            weight = type_weights.get(source['source_type'], 0.5)

            weighted_sum += source['quality_score'] * weight
            total_weight += weight

        base_quality = weighted_sum / total_weight if total_weight > 0 else 0

        # Bonus for source diversity
        diversity_bonus = min(len(set(s['source_type'] for s in sources)) * 0.2, 1.0)

        # Penalty for insufficient triangulation
        triangulation = self.assess_triangulation()
        triangulation_penalty = len(triangulation['poorly_supported']) * 0.1

        final_score = base_quality + diversity_bonus - triangulation_penalty
        return max(0.0, min(10.0, final_score))

def main():
    """Command-line interface for source tracker"""
    parser = argparse.ArgumentParser(description='Source Tracker for Domain Research')
    parser.add_argument('--project', required=True, help='Project name')
    parser.add_argument('--action', required=True,
                       choices=['add', 'list', 'assess', 'export', 'claims'],
                       help='Action to perform')
    parser.add_argument('--source-type', help='Filter by source type')
    parser.add_argument('--min-quality', type=float, default=0.0, help='Minimum quality score')
    parser.add_argument('--format', default='markdown', help='Output format (apa, chicago, markdown)')
    parser.add_argument('--output', help='Output file path')

    # Source addition arguments
    parser.add_argument('--title', help='Source title')
    parser.add_argument('--author', help='Source author')
    parser.add_argument('--organization', help='Source organization')
    parser.add_argument('--url', help='Source URL')
    parser.add_argument('--publication-date', help='Publication date (ISO format)')
    parser.add_argument('--notes', help='Additional notes')
    parser.add_argument('--tags', nargs='*', default=[], help='Tags for source')

    args = parser.parse_args()

    tracker = SourceTracker(args.project)

    if args.action == 'add':
        if not args.title:
            print("Error: --title is required for adding sources")
            return

        source_data = {
            'title': args.title,
            'author': args.author or '',
            'organization': args.organization or '',
            'source_type': args.source_type or 'unknown',
            'url': args.url,
            'publication_date': args.publication_date,
            'notes': args.notes or '',
            'tags': args.tags,
            'extracted_claims': [],
            'confidence_level': 'medium'
        }

        source = tracker.add_source(source_data)
        print(f"Added source: {source.title}")
        print(f"Quality Score: {source.quality_score:.1f}/10")

    elif args.action == 'list':
        sources = tracker.get_sources(args.source_type, args.min_quality)

        print(f"\n=== Sources for {args.project} ===")
        print(f"Total sources: {len(sources)}")
        print(f"Filters: type={args.source_type or 'all'}, min_quality={args.min_quality}")
        print()

        for source in sources:
            print(f"• {source['title']}")
            print(f"  Author: {source['author'] or 'Unknown'}")
            print(f"  Type: {source['source_type']} | Quality: {source['quality_score']:.1f}/10")
            if source['url']:
                print(f"  URL: {source['url']}")
            print()

    elif args.action == 'assess':
        triangulation = tracker.assess_triangulation()
        overall_quality = tracker._calculate_overall_quality()

        print(f"\n=== Research Quality Assessment for {args.project} ===")
        print(f"Overall Quality Score: {overall_quality:.1f}/10")
        print()

        print("Triangulation Assessment:")
        print(f"  Well Supported Claims: {len(triangulation['well_supported'])}")
        print(f"  Moderately Supported: {len(triangulation['moderately_supported'])}")
        print(f"  Poorly Supported: {len(triangulation['poorly_supported'])}")
        print(f"  Conflicting Evidence: {len(triangulation['conflicting'])}")

        if triangulation['poorly_supported']:
            print("\nClaims needing additional validation:")
            for claim in triangulation['poorly_supported'][:5]:
                print(f"  • {claim[:100]}...")

    elif args.action == 'export':
        output_path = args.output or f"{args.project}_research_summary.json"
        tracker.export_research_summary(output_path)

        # Also generate bibliography
        bib_path = f"{args.project}_bibliography.md"
        bibliography = tracker.generate_bibliography(args.format)
        with open(bib_path, 'w') as f:
            f.write(f"# Bibliography - {args.project}\n\n")
            f.write(bibliography)
        print(f"Bibliography exported to {bib_path}")

    elif args.action == 'claims':
        sources = tracker.get_sources()

        print(f"\n=== Claims Analysis for {args.project} ===")
        for source in sources[:5]:  # Top 5 sources
            claims = tracker.get_claims_by_source(source['id'])
            if claims:
                print(f"\nSource: {source['title']}")
                print(f"Claims extracted: {len(claims)}")
                for claim in claims[:3]:  # Show first 3 claims
                    print(f"  • {claim['claim_text'][:100]}...")
                    print(f"    Status: {claim['validation_status']} | Type: {claim['claim_type']}")

if __name__ == "__main__":
    main()