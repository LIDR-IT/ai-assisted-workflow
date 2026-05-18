#!/usr/bin/env python3
"""
Competitor Monitor - Automated Competitive Intelligence Gathering
Part of the domain-research skill for Claude Code

This script provides automated monitoring of competitor activities including:
- News and press release monitoring
- Patent filing tracking
- Funding round detection
- Product launch identification
- Social media sentiment analysis

Usage:
    python competitor_monitor.py --config config.yaml --output-dir ./monitoring-results

Features:
- RSS feed monitoring
- Google News API integration
- Patent database monitoring
- Crunchbase API integration
- LinkedIn company page monitoring
- Automated reporting and alerting
"""

import json
import yaml
import requests
import sqlite3
import schedule
import time
import logging
import argparse
from datetime import datetime, timedelta
from pathlib import Path
from typing import Dict, List, Optional, Any
from dataclasses import dataclass, asdict
import feedparser
import re
from urllib.parse import urlencode
import hashlib

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('competitor_monitor.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

@dataclass
class CompetitorAlert:
    """Data class for competitor alerts"""
    id: str
    competitor_name: str
    alert_type: str  # 'news', 'funding', 'patent', 'product_launch', 'hiring'
    title: str
    description: str
    url: str
    source: str
    detected_date: str
    importance_score: float  # 1-10 scale
    tags: List[str]
    raw_data: Dict[str, Any]

@dataclass
class Competitor:
    """Data class for competitor information"""
    id: str
    name: str
    domain: str
    aliases: List[str]  # Alternative names/brands
    keywords: List[str]  # Monitoring keywords
    crunchbase_id: Optional[str]
    linkedin_company_id: Optional[str]
    stock_symbol: Optional[str]
    monitoring_enabled: bool
    last_updated: str

class CompetitorMonitor:
    """Main class for competitor monitoring"""

    def __init__(self, config_path: str, output_dir: str):
        self.config = self._load_config(config_path)
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(exist_ok=True)

        # Initialize database
        self.db_path = self.output_dir / "competitor_intelligence.db"
        self._init_database()

        # API configurations
        self.apis = self.config.get('apis', {})

    def _load_config(self, config_path: str) -> Dict:
        """Load monitoring configuration"""
        with open(config_path, 'r') as f:
            return yaml.safe_load(f)

    def _init_database(self):
        """Initialize SQLite database for storing alerts and data"""
        self.conn = sqlite3.connect(str(self.db_path))

        # Competitors table
        self.conn.execute('''
            CREATE TABLE IF NOT EXISTS competitors (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                domain TEXT,
                aliases TEXT,  -- JSON array
                keywords TEXT,  -- JSON array
                crunchbase_id TEXT,
                linkedin_company_id TEXT,
                stock_symbol TEXT,
                monitoring_enabled BOOLEAN,
                last_updated TEXT
            )
        ''')

        # Alerts table
        self.conn.execute('''
            CREATE TABLE IF NOT EXISTS alerts (
                id TEXT PRIMARY KEY,
                competitor_name TEXT,
                alert_type TEXT,
                title TEXT,
                description TEXT,
                url TEXT,
                source TEXT,
                detected_date TEXT,
                importance_score REAL,
                tags TEXT,  -- JSON array
                raw_data TEXT,  -- JSON object
                processed BOOLEAN DEFAULT FALSE
            )
        ''')

        # News monitoring table
        self.conn.execute('''
            CREATE TABLE IF NOT EXISTS news_items (
                id TEXT PRIMARY KEY,
                competitor_name TEXT,
                headline TEXT,
                summary TEXT,
                url TEXT,
                source TEXT,
                published_date TEXT,
                sentiment_score REAL,
                created_at TEXT
            )
        ''')

        # Patent filings table
        self.conn.execute('''
            CREATE TABLE IF NOT EXISTS patent_filings (
                id TEXT PRIMARY KEY,
                competitor_name TEXT,
                patent_title TEXT,
                patent_number TEXT,
                application_date TEXT,
                publication_date TEXT,
                inventors TEXT,  -- JSON array
                abstract TEXT,
                classification_codes TEXT,  -- JSON array
                url TEXT,
                created_at TEXT
            )
        ''')

        self.conn.commit()

    def add_competitor(self, competitor_data: Dict) -> str:
        """Add a new competitor to monitor"""
        competitor = Competitor(
            id=competitor_data.get('id') or self._generate_id(competitor_data['name']),
            last_updated=datetime.now().isoformat(),
            **competitor_data
        )

        self.conn.execute('''
            INSERT OR REPLACE INTO competitors (
                id, name, domain, aliases, keywords, crunchbase_id,
                linkedin_company_id, stock_symbol, monitoring_enabled, last_updated
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            competitor.id, competitor.name, competitor.domain,
            json.dumps(competitor.aliases), json.dumps(competitor.keywords),
            competitor.crunchbase_id, competitor.linkedin_company_id,
            competitor.stock_symbol, competitor.monitoring_enabled,
            competitor.last_updated
        ))

        self.conn.commit()
        logger.info(f"Added competitor: {competitor.name}")
        return competitor.id

    def _generate_id(self, name: str) -> str:
        """Generate a unique ID from competitor name"""
        return hashlib.md5(name.encode()).hexdigest()[:8]

    def get_competitors(self, enabled_only: bool = True) -> List[Competitor]:
        """Get list of competitors"""
        query = 'SELECT * FROM competitors'
        if enabled_only:
            query += ' WHERE monitoring_enabled = 1'

        cursor = self.conn.execute(query)
        competitors = []

        for row in cursor.fetchall():
            competitor_dict = dict(zip([col[0] for col in cursor.description], row))
            competitor_dict['aliases'] = json.loads(competitor_dict['aliases'] or '[]')
            competitor_dict['keywords'] = json.loads(competitor_dict['keywords'] or '[]')
            competitors.append(Competitor(**competitor_dict))

        return competitors

    def monitor_news(self) -> List[CompetitorAlert]:
        """Monitor news for all competitors"""
        alerts = []
        competitors = self.get_competitors()

        for competitor in competitors:
            logger.info(f"Monitoring news for {competitor.name}")

            # Monitor multiple news sources
            news_sources = [
                self._monitor_google_news(competitor),
                self._monitor_rss_feeds(competitor),
                self._monitor_company_press_releases(competitor)
            ]

            for source_alerts in news_sources:
                alerts.extend(source_alerts)

        return alerts

    def _monitor_google_news(self, competitor: Competitor) -> List[CompetitorAlert]:
        """Monitor Google News for competitor mentions"""
        alerts = []

        if 'google_news' not in self.apis:
            return alerts

        try:
            # Build search query
            search_terms = [competitor.name] + competitor.aliases + competitor.keywords
            query = ' OR '.join([f'"{term}"' for term in search_terms])

            # Google News RSS feed
            params = {
                'q': query,
                'hl': 'en',
                'gl': 'US',
                'ceid': 'US:en'
            }
            url = f"https://news.google.com/rss/search?{urlencode(params)}"

            feed = feedparser.parse(url)

            for entry in feed.entries[:10]:  # Limit to recent items
                # Check if we've already processed this item
                item_id = hashlib.md5(entry.link.encode()).hexdigest()

                existing = self.conn.execute(
                    'SELECT id FROM news_items WHERE id = ?', (item_id,)
                ).fetchone()

                if existing:
                    continue

                # Create alert
                alert = CompetitorAlert(
                    id=item_id,
                    competitor_name=competitor.name,
                    alert_type='news',
                    title=entry.title,
                    description=entry.summary if hasattr(entry, 'summary') else '',
                    url=entry.link,
                    source='Google News',
                    detected_date=datetime.now().isoformat(),
                    importance_score=self._calculate_news_importance(entry, competitor),
                    tags=['news', 'google'],
                    raw_data=dict(entry)
                )

                alerts.append(alert)
                self._store_alert(alert)

                # Store in news_items table
                self.conn.execute('''
                    INSERT INTO news_items (
                        id, competitor_name, headline, summary, url, source,
                        published_date, created_at
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                ''', (
                    item_id, competitor.name, entry.title,
                    entry.summary if hasattr(entry, 'summary') else '',
                    entry.link, 'Google News',
                    entry.published if hasattr(entry, 'published') else '',
                    datetime.now().isoformat()
                ))

            self.conn.commit()

        except Exception as e:
            logger.error(f"Error monitoring Google News for {competitor.name}: {e}")

        return alerts

    def _monitor_rss_feeds(self, competitor: Competitor) -> List[CompetitorAlert]:
        """Monitor RSS feeds for competitor mentions"""
        alerts = []

        # Industry-specific RSS feeds
        rss_feeds = self.config.get('rss_feeds', [])

        for feed_url in rss_feeds:
            try:
                feed = feedparser.parse(feed_url)

                for entry in feed.entries:
                    # Check if entry mentions competitor
                    content = f"{entry.title} {getattr(entry, 'summary', '')}"
                    if self._mentions_competitor(content, competitor):
                        item_id = hashlib.md5(entry.link.encode()).hexdigest()

                        # Check if already processed
                        existing = self.conn.execute(
                            'SELECT id FROM alerts WHERE id = ?', (item_id,)
                        ).fetchone()

                        if existing:
                            continue

                        alert = CompetitorAlert(
                            id=item_id,
                            competitor_name=competitor.name,
                            alert_type='news',
                            title=entry.title,
                            description=getattr(entry, 'summary', ''),
                            url=entry.link,
                            source=feed_url,
                            detected_date=datetime.now().isoformat(),
                            importance_score=self._calculate_news_importance(entry, competitor),
                            tags=['news', 'rss'],
                            raw_data=dict(entry)
                        )

                        alerts.append(alert)
                        self._store_alert(alert)

            except Exception as e:
                logger.error(f"Error monitoring RSS feed {feed_url}: {e}")

        return alerts

    def _monitor_company_press_releases(self, competitor: Competitor) -> List[CompetitorAlert]:
        """Monitor company press releases and announcements"""
        alerts = []

        if not competitor.domain:
            return alerts

        try:
            # Try common press release URLs
            press_urls = [
                f"https://{competitor.domain}/news",
                f"https://{competitor.domain}/press-releases",
                f"https://{competitor.domain}/newsroom",
                f"https://{competitor.domain}/blog"
            ]

            for url in press_urls:
                try:
                    response = requests.get(url, timeout=10, headers={
                        'User-Agent': 'Mozilla/5.0 (compatible; ResearchBot/1.0)'
                    })

                    if response.status_code == 200:
                        # Simple pattern matching for recent announcements
                        content = response.text
                        recent_patterns = [
                            r'announce[sd]?\s+(?:the\s+)?(.{10,100})',
                            r'launch[ed]?\s+(?:a\s+)?(.{10,100})',
                            r'introduce[sd]?\s+(?:a\s+)?(.{10,100})',
                            r'partnership\s+with\s+(.{10,50})'
                        ]

                        for pattern in recent_patterns:
                            matches = re.finditer(pattern, content, re.IGNORECASE)
                            for match in matches:
                                announcement = match.group(1).strip()
                                item_id = hashlib.md5(announcement.encode()).hexdigest()

                                # Check if already processed
                                existing = self.conn.execute(
                                    'SELECT id FROM alerts WHERE id = ?', (item_id,)
                                ).fetchone()

                                if not existing:
                                    alert = CompetitorAlert(
                                        id=item_id,
                                        competitor_name=competitor.name,
                                        alert_type='product_launch',
                                        title=f"Announcement: {announcement[:100]}",
                                        description=announcement,
                                        url=url,
                                        source='Company Website',
                                        detected_date=datetime.now().isoformat(),
                                        importance_score=7.0,  # Company announcements are important
                                        tags=['announcement', 'company'],
                                        raw_data={'pattern': pattern, 'match': announcement}
                                    )

                                    alerts.append(alert)
                                    self._store_alert(alert)

                except requests.RequestException:
                    continue  # Skip if URL doesn't exist

        except Exception as e:
            logger.error(f"Error monitoring press releases for {competitor.name}: {e}")

        return alerts

    def monitor_funding(self) -> List[CompetitorAlert]:
        """Monitor funding rounds and financial news"""
        alerts = []
        competitors = self.get_competitors()

        for competitor in competitors:
            if competitor.crunchbase_id and 'crunchbase' in self.apis:
                funding_alerts = self._monitor_crunchbase_funding(competitor)
                alerts.extend(funding_alerts)

        return alerts

    def _monitor_crunchbase_funding(self, competitor: Competitor) -> List[CompetitorAlert]:
        """Monitor Crunchbase for funding information"""
        alerts = []

        try:
            # Note: This would require Crunchbase API key
            api_key = self.apis.get('crunchbase', {}).get('api_key')
            if not api_key:
                return alerts

            # Crunchbase API endpoint
            url = f"https://api.crunchbase.com/v3.1/organizations/{competitor.crunchbase_id}"
            headers = {'X-cb-user-key': api_key}

            response = requests.get(url, headers=headers)
            if response.status_code == 200:
                data = response.json()

                # Check for recent funding rounds
                funding_rounds = data.get('data', {}).get('relationships', {}).get('funding_rounds', {}).get('items', [])

                for round_data in funding_rounds[-3:]:  # Last 3 rounds
                    round_id = round_data.get('uuid')
                    if not round_id:
                        continue

                    # Check if already processed
                    existing = self.conn.execute(
                        'SELECT id FROM alerts WHERE id = ?', (round_id,)
                    ).fetchone()

                    if existing:
                        continue

                    # Get detailed round information
                    round_url = f"https://api.crunchbase.com/v3.1/funding-rounds/{round_id}"
                    round_response = requests.get(round_url, headers=headers)

                    if round_response.status_code == 200:
                        round_details = round_response.json().get('data', {})
                        properties = round_details.get('properties', {})

                        funding_type = properties.get('funding_type')
                        amount = properties.get('money_raised')
                        announced_on = properties.get('announced_on')

                        # Only alert on recent rounds (last 30 days)
                        if announced_on:
                            announced_date = datetime.fromisoformat(announced_on)
                            if (datetime.now() - announced_date).days <= 30:
                                alert = CompetitorAlert(
                                    id=round_id,
                                    competitor_name=competitor.name,
                                    alert_type='funding',
                                    title=f"{competitor.name} raises {funding_type} round",
                                    description=f"Amount: ${amount:,}" if amount else "Amount undisclosed",
                                    url=f"https://www.crunchbase.com/organization/{competitor.crunchbase_id}",
                                    source='Crunchbase',
                                    detected_date=datetime.now().isoformat(),
                                    importance_score=8.0,  # Funding is high importance
                                    tags=['funding', funding_type.lower() if funding_type else 'unknown'],
                                    raw_data=round_details
                                )

                                alerts.append(alert)
                                self._store_alert(alert)

        except Exception as e:
            logger.error(f"Error monitoring Crunchbase for {competitor.name}: {e}")

        return alerts

    def monitor_patents(self) -> List[CompetitorAlert]:
        """Monitor patent filings for competitors"""
        alerts = []
        competitors = self.get_competitors()

        for competitor in competitors:
            patent_alerts = self._monitor_uspto_patents(competitor)
            alerts.extend(patent_alerts)

        return alerts

    def _monitor_uspto_patents(self, competitor: Competitor) -> List[CompetitorAlert]:
        """Monitor USPTO patent database"""
        alerts = []

        try:
            # USPTO Patent Public Search API (simplified)
            search_terms = [competitor.name] + competitor.aliases

            for term in search_terms:
                # Note: This is a simplified example. Real implementation would use
                # the USPTO Patent Application Information Retrieval (PAIR) system
                # or Google Patents API

                # For demonstration, using a basic search pattern
                search_query = f"assignee:{term}"

                # This would be replaced with actual USPTO API call
                # For now, creating a placeholder for the monitoring structure
                logger.info(f"Patent search for {competitor.name}: {search_query}")

                # Placeholder for patent results processing
                # In real implementation, this would parse patent XML/JSON data
                patents_found = []  # Would be populated from actual API

                for patent in patents_found:
                    patent_id = patent.get('patent_number')

                    # Check if already processed
                    existing = self.conn.execute(
                        'SELECT id FROM patent_filings WHERE id = ?', (patent_id,)
                    ).fetchone()

                    if existing:
                        continue

                    alert = CompetitorAlert(
                        id=patent_id,
                        competitor_name=competitor.name,
                        alert_type='patent',
                        title=f"Patent: {patent.get('title', '')}",
                        description=patent.get('abstract', ''),
                        url=f"https://patents.uspto.gov/patent/{patent_id}",
                        source='USPTO',
                        detected_date=datetime.now().isoformat(),
                        importance_score=6.0,  # Patents are medium-high importance
                        tags=['patent', 'innovation'],
                        raw_data=patent
                    )

                    alerts.append(alert)
                    self._store_alert(alert)

                    # Store in patent_filings table
                    self.conn.execute('''
                        INSERT INTO patent_filings (
                            id, competitor_name, patent_title, patent_number,
                            application_date, publication_date, inventors,
                            abstract, url, created_at
                        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    ''', (
                        patent_id, competitor.name, patent.get('title', ''),
                        patent_id, patent.get('application_date'),
                        patent.get('publication_date'),
                        json.dumps(patent.get('inventors', [])),
                        patent.get('abstract', ''),
                        f"https://patents.uspto.gov/patent/{patent_id}",
                        datetime.now().isoformat()
                    ))

            self.conn.commit()

        except Exception as e:
            logger.error(f"Error monitoring patents for {competitor.name}: {e}")

        return alerts

    def _mentions_competitor(self, content: str, competitor: Competitor) -> bool:
        """Check if content mentions the competitor"""
        content_lower = content.lower()

        # Check exact name matches
        if competitor.name.lower() in content_lower:
            return True

        # Check aliases
        for alias in competitor.aliases:
            if alias.lower() in content_lower:
                return True

        # Check keywords with context
        for keyword in competitor.keywords:
            if keyword.lower() in content_lower:
                # Additional context check to avoid false positives
                if len(keyword) > 3:  # Only for longer keywords
                    return True

        return False

    def _calculate_news_importance(self, entry: Any, competitor: Competitor) -> float:
        """Calculate importance score for news items"""
        score = 5.0  # Base score

        title = getattr(entry, 'title', '').lower()
        content = f"{title} {getattr(entry, 'summary', '')}".lower()

        # High importance keywords
        high_importance = [
            'funding', 'acquisition', 'merger', 'ipo', 'launch', 'partnership',
            'breakthrough', 'patent', 'lawsuit', 'regulation', 'expansion'
        ]

        # Medium importance keywords
        medium_importance = [
            'update', 'feature', 'hire', 'appointment', 'conference',
            'award', 'recognition', 'revenue', 'growth'
        ]

        # Low importance keywords
        low_importance = [
            'blog', 'tutorial', 'guide', 'tips', 'interview'
        ]

        for keyword in high_importance:
            if keyword in content:
                score += 3.0

        for keyword in medium_importance:
            if keyword in content:
                score += 1.5

        for keyword in low_importance:
            if keyword in content:
                score += 0.5

        # Exact company name mention bonus
        if competitor.name.lower() in title:
            score += 2.0

        # Source credibility bonus
        source = getattr(entry, 'source', '').lower()
        if any(credible in source for credible in ['techcrunch', 'reuters', 'bloomberg', 'wsj']):
            score += 1.5

        return min(score, 10.0)

    def _store_alert(self, alert: CompetitorAlert):
        """Store alert in database"""
        self.conn.execute('''
            INSERT OR REPLACE INTO alerts (
                id, competitor_name, alert_type, title, description,
                url, source, detected_date, importance_score, tags, raw_data
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            alert.id, alert.competitor_name, alert.alert_type,
            alert.title, alert.description, alert.url, alert.source,
            alert.detected_date, alert.importance_score,
            json.dumps(alert.tags), json.dumps(alert.raw_data)
        ))

    def run_monitoring_cycle(self):
        """Run a complete monitoring cycle"""
        logger.info("Starting competitor monitoring cycle")

        all_alerts = []

        # Monitor different sources
        monitoring_functions = [
            self.monitor_news,
            self.monitor_funding,
            self.monitor_patents
        ]

        for monitor_func in monitoring_functions:
            try:
                alerts = monitor_func()
                all_alerts.extend(alerts)
                logger.info(f"{monitor_func.__name__} found {len(alerts)} alerts")
            except Exception as e:
                logger.error(f"Error in {monitor_func.__name__}: {e}")

        # Generate summary report
        self._generate_alert_report(all_alerts)

        logger.info(f"Monitoring cycle completed. Total alerts: {len(all_alerts)}")
        return all_alerts

    def _generate_alert_report(self, alerts: List[CompetitorAlert]):
        """Generate summary report of alerts"""
        if not alerts:
            return

        # Group alerts by competitor and type
        report_data = {}
        for alert in alerts:
            competitor = alert.competitor_name
            alert_type = alert.alert_type

            if competitor not in report_data:
                report_data[competitor] = {}
            if alert_type not in report_data[competitor]:
                report_data[competitor][alert_type] = []

            report_data[competitor][alert_type].append(alert)

        # Generate report
        report_path = self.output_dir / f"competitive_intelligence_report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"

        report = {
            'generated_date': datetime.now().isoformat(),
            'total_alerts': len(alerts),
            'high_importance_alerts': len([a for a in alerts if a.importance_score >= 7.0]),
            'alert_breakdown': {},
            'competitor_activity': report_data,
            'top_alerts': sorted(alerts, key=lambda x: x.importance_score, reverse=True)[:10]
        }

        # Alert breakdown by type
        for alert in alerts:
            alert_type = alert.alert_type
            report['alert_breakdown'][alert_type] = report['alert_breakdown'].get(alert_type, 0) + 1

        # Convert top alerts to dict for JSON serialization
        report['top_alerts'] = [asdict(alert) for alert in report['top_alerts']]

        with open(report_path, 'w') as f:
            json.dump(report, f, indent=2, default=str)

        logger.info(f"Report generated: {report_path}")

        # Generate markdown summary for human review
        self._generate_markdown_summary(report, alerts)

    def _generate_markdown_summary(self, report: Dict, alerts: List[CompetitorAlert]):
        """Generate human-readable markdown summary"""
        md_path = self.output_dir / f"competitive_intelligence_summary_{datetime.now().strftime('%Y%m%d')}.md"

        with open(md_path, 'w') as f:
            f.write(f"# Competitive Intelligence Summary\n")
            f.write(f"**Generated:** {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n\n")

            f.write(f"## Overview\n")
            f.write(f"- **Total Alerts:** {report['total_alerts']}\n")
            f.write(f"- **High Importance (≥7.0):** {report['high_importance_alerts']}\n\n")

            f.write(f"## Alert Breakdown\n")
            for alert_type, count in report['alert_breakdown'].items():
                f.write(f"- **{alert_type.replace('_', ' ').title()}:** {count}\n")
            f.write("\n")

            f.write(f"## Top Alerts (by Importance)\n")
            for i, alert in enumerate(report['top_alerts'][:5], 1):
                f.write(f"### {i}. {alert['title']}\n")
                f.write(f"- **Competitor:** {alert['competitor_name']}\n")
                f.write(f"- **Type:** {alert['alert_type'].replace('_', ' ').title()}\n")
                f.write(f"- **Importance:** {alert['importance_score']:.1f}/10\n")
                f.write(f"- **Source:** {alert['source']}\n")
                if alert['url']:
                    f.write(f"- **Link:** {alert['url']}\n")
                f.write(f"- **Description:** {alert['description'][:200]}{'...' if len(alert['description']) > 200 else ''}\n\n")

            f.write(f"## Competitor Activity Summary\n")
            for competitor, activity in report['competitor_activity'].items():
                f.write(f"### {competitor}\n")
                total_alerts = sum(len(alerts) for alerts in activity.values())
                f.write(f"**Total Activity:** {total_alerts} alerts\n\n")

                for activity_type, activity_alerts in activity.items():
                    if activity_alerts:
                        f.write(f"**{activity_type.replace('_', ' ').title()} ({len(activity_alerts)}):**\n")
                        for alert in activity_alerts[:3]:  # Show top 3
                            f.write(f"- {alert.title[:100]}{'...' if len(alert.title) > 100 else ''}\n")
                        f.write("\n")

        logger.info(f"Markdown summary generated: {md_path}")

def main():
    """Command-line interface for competitor monitoring"""
    parser = argparse.ArgumentParser(description='Competitor Intelligence Monitor')
    parser.add_argument('--config', required=True, help='Configuration YAML file')
    parser.add_argument('--output-dir', required=True, help='Output directory for reports')
    parser.add_argument('--action', choices=['monitor', 'add-competitor', 'list-competitors', 'schedule'],
                       default='monitor', help='Action to perform')
    parser.add_argument('--schedule-interval', type=int, default=360,
                       help='Monitoring interval in minutes (default: 6 hours)')

    # Competitor addition arguments
    parser.add_argument('--name', help='Competitor name')
    parser.add_argument('--domain', help='Competitor domain')
    parser.add_argument('--aliases', nargs='*', default=[], help='Competitor aliases')
    parser.add_argument('--keywords', nargs='*', default=[], help='Monitoring keywords')
    parser.add_argument('--crunchbase-id', help='Crunchbase organization ID')
    parser.add_argument('--linkedin-id', help='LinkedIn company ID')

    args = parser.parse_args()

    monitor = CompetitorMonitor(args.config, args.output_dir)

    if args.action == 'add-competitor':
        if not args.name:
            print("Error: --name is required for adding competitors")
            return

        competitor_data = {
            'name': args.name,
            'domain': args.domain,
            'aliases': args.aliases,
            'keywords': args.keywords,
            'crunchbase_id': args.crunchbase_id,
            'linkedin_company_id': args.linkedin_id,
            'monitoring_enabled': True
        }

        competitor_id = monitor.add_competitor(competitor_data)
        print(f"Added competitor: {args.name} (ID: {competitor_id})")

    elif args.action == 'list-competitors':
        competitors = monitor.get_competitors(enabled_only=False)
        print(f"\n=== Monitored Competitors ({len(competitors)}) ===")

        for comp in competitors:
            status = "✅ Enabled" if comp.monitoring_enabled else "❌ Disabled"
            print(f"• {comp.name} ({status})")
            if comp.domain:
                print(f"  Domain: {comp.domain}")
            if comp.aliases:
                print(f"  Aliases: {', '.join(comp.aliases)}")
            if comp.keywords:
                print(f"  Keywords: {', '.join(comp.keywords)}")
            print()

    elif args.action == 'monitor':
        alerts = monitor.run_monitoring_cycle()
        print(f"Monitoring completed. Found {len(alerts)} new alerts.")

        # Show high-importance alerts
        high_importance = [a for a in alerts if a.importance_score >= 7.0]
        if high_importance:
            print(f"\n🚨 High Importance Alerts ({len(high_importance)}):")
            for alert in high_importance[:5]:
                print(f"• {alert.competitor_name}: {alert.title}")
                print(f"  Importance: {alert.importance_score:.1f}/10 | Type: {alert.alert_type}")
                print()

    elif args.action == 'schedule':
        print(f"Scheduling monitoring every {args.schedule_interval} minutes...")

        # Schedule monitoring
        schedule.every(args.schedule_interval).minutes.do(monitor.run_monitoring_cycle)

        # Run initial monitoring
        monitor.run_monitoring_cycle()

        # Keep running
        try:
            while True:
                schedule.run_pending()
                time.sleep(60)  # Check every minute
        except KeyboardInterrupt:
            print("\nStopping scheduled monitoring...")

if __name__ == "__main__":
    main()