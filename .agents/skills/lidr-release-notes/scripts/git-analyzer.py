#!/usr/bin/env python3
"""
Git Analyzer for Release Notes Automation
=========================================

Part of the LIDR SDLC Automation Suite
Transforms 2+ hours of manual PR analysis into 5-minute automated extraction

This script analyzes git history and pull requests to:
1. Auto-discover merged PRs since last release
2. Extract business impact from commit messages and PR descriptions
3. Categorize changes by type (feature, fix, enhancement, security)
4. Identify breaking changes and migration requirements
5. Export structured data for changelog-generator.py

Usage:
    python git-analyzer.py [--since-tag tag] [--branch main] [--output-dir path]

Dependencies:
    - git repository with merge commit history
    - GitHub CLI (gh) for PR metadata (optional but recommended)
    - Conventional commit format compliance
"""

import os
import sys
import json
import re
import logging
import argparse
import subprocess
from pathlib import Path
from dataclasses import dataclass, asdict
from typing import List, Dict, Any, Optional, Tuple
from datetime import datetime
import difflib

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(levelname)s: %(message)s')
logger = logging.getLogger(__name__)

# Tracking tool consuming the CSV export (project management / issue tracker).
# Read from the environment so the export label stays tool-agnostic; the default
# preserves the current behavior.
TRACKING_TOOL = os.getenv("LIDR_TRACKING_TOOL", "jira")

@dataclass
class Commit:
    """Individual commit information"""
    hash: str
    short_hash: str
    message: str
    author: str
    email: str
    date: str
    pr_number: Optional[int]
    files_changed: List[str]
    lines_added: int
    lines_deleted: int

@dataclass
class PullRequest:
    """Pull request information"""
    number: int
    title: str
    description: str
    author: str
    merged_at: str
    labels: List[str]
    commits: List[Commit]
    files_changed: List[str]
    total_lines_added: int
    total_lines_deleted: int

@dataclass
class ChangeCategory:
    """Categorized change information"""
    type: str  # feature, fix, enhancement, security, breaking, chore
    scope: str  # component or area affected
    description: str
    business_impact: str
    technical_details: str
    breaking_change: bool
    security_related: bool
    pr_numbers: List[int]
    commits: List[str]

@dataclass
class ReleaseAnalysis:
    """Complete release analysis"""
    since_tag: str
    target_branch: str
    analysis_date: str
    total_commits: int
    total_prs: int
    total_contributors: int
    pull_requests: List[PullRequest]
    change_categories: List[ChangeCategory]
    breaking_changes: List[str]
    security_changes: List[str]
    contributors: List[str]
    file_impact_summary: Dict[str, int]

class ConventionalCommitParser:
    """Parser for conventional commit format"""

    COMMIT_PATTERN = re.compile(
        r'^(?P<type>\w+)(?:\((?P<scope>[\w-]+)\))?(?P<breaking>!)?: (?P<description>.+)$'
    )

    CHANGE_TYPES = {
        'feat': 'feature',
        'fix': 'fix',
        'perf': 'enhancement',
        'refactor': 'enhancement',
        'style': 'chore',
        'docs': 'chore',
        'test': 'chore',
        'chore': 'chore',
        'ci': 'chore',
        'build': 'chore',
        'revert': 'fix',
        'security': 'security'
    }

    @classmethod
    def parse_commit_message(cls, message: str) -> Tuple[str, str, str, bool]:
        """
        Parse conventional commit message
        Returns: (type, scope, description, is_breaking)
        """
        lines = message.strip().split('\n')
        first_line = lines[0].strip()

        match = cls.COMMIT_PATTERN.match(first_line)
        if match:
            commit_type = match.group('type').lower()
            scope = match.group('scope') or ''
            description = match.group('description')
            breaking = match.group('breaking') is not None
        else:
            # Fallback for non-conventional commits
            commit_type = 'chore'
            scope = ''
            description = first_line
            breaking = 'BREAKING' in message.upper()

        # Check for breaking change indicators in body
        body = '\n'.join(lines[1:]).strip()
        if 'BREAKING CHANGE' in body or breaking:
            breaking = True

        # Map to standard categories
        category = cls.CHANGE_TYPES.get(commit_type, 'chore')

        return category, scope, description, breaking

class GitAnalyzer:
    """Main analyzer for git repository history"""

    def __init__(self, repo_path: str = ".", output_dir: str = "release-analysis"):
        self.repo_path = Path(repo_path)
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(exist_ok=True)

        self.parser = ConventionalCommitParser()
        self.gh_available = self._check_gh_cli()

    def _check_gh_cli(self) -> bool:
        """Check if GitHub CLI is available"""
        try:
            subprocess.run(['gh', '--version'], capture_output=True, check=True)
            return True
        except (subprocess.CalledProcessError, FileNotFoundError):
            logger.warning("GitHub CLI not available - PR metadata will be limited")
            return False

    def _run_git_command(self, args: List[str]) -> str:
        """Run git command and return output"""
        try:
            result = subprocess.run(
                ['git'] + args,
                cwd=self.repo_path,
                capture_output=True,
                text=True,
                check=True
            )
            return result.stdout.strip()
        except subprocess.CalledProcessError as e:
            logger.error(f"Git command failed: {' '.join(args)}")
            logger.error(f"Error: {e.stderr}")
            raise

    def _run_gh_command(self, args: List[str]) -> Optional[str]:
        """Run GitHub CLI command and return output"""
        if not self.gh_available:
            return None

        try:
            result = subprocess.run(
                ['gh'] + args,
                cwd=self.repo_path,
                capture_output=True,
                text=True,
                check=True
            )
            return result.stdout.strip()
        except subprocess.CalledProcessError as e:
            logger.warning(f"GitHub CLI command failed: {' '.join(args)}")
            return None

    def get_last_release_tag(self) -> Optional[str]:
        """Get the most recent release tag"""
        try:
            # Get all tags sorted by version
            tags_output = self._run_git_command(['tag', '--sort=-version:refname'])
            if not tags_output:
                return None

            tags = tags_output.split('\n')
            # Find the first tag that looks like a version
            for tag in tags:
                if re.match(r'^v?\d+\.\d+', tag):
                    return tag

            return None
        except Exception:
            return None

    def get_commits_since_tag(self, since_tag: Optional[str], branch: str = "main") -> List[Commit]:
        """Get commits since the specified tag"""
        logger.info(f"Getting commits since {since_tag or 'beginning'} on {branch}")

        # Build git log command
        git_args = ['log', '--oneline', '--no-merges', f'{branch}']
        if since_tag:
            git_args.append(f'{since_tag}..HEAD')

        # Add format to get detailed info
        git_args.extend([
            '--pretty=format:%H|%h|%s|%an|%ae|%ad|%P',
            '--date=iso'
        ])

        try:
            commits_output = self._run_git_command(git_args)
            if not commits_output:
                return []

            commits = []
            for line in commits_output.split('\n'):
                if not line.strip():
                    continue

                try:
                    parts = line.split('|')
                    if len(parts) >= 6:
                        commit_hash = parts[0]
                        short_hash = parts[1]
                        message = parts[2]
                        author = parts[3]
                        email = parts[4]
                        date = parts[5]
                        parents = parts[6] if len(parts) > 6 else ""

                        # Get file changes for this commit
                        files_changed, lines_added, lines_deleted = self._get_commit_changes(commit_hash)

                        # Extract PR number from commit message if present
                        pr_number = self._extract_pr_number(message)

                        commits.append(Commit(
                            hash=commit_hash,
                            short_hash=short_hash,
                            message=message,
                            author=author,
                            email=email,
                            date=date,
                            pr_number=pr_number,
                            files_changed=files_changed,
                            lines_added=lines_added,
                            lines_deleted=lines_deleted
                        ))

                except Exception as e:
                    logger.warning(f"Error parsing commit line: {line[:50]}... - {e}")
                    continue

            logger.info(f"Found {len(commits)} commits")
            return commits

        except Exception as e:
            logger.error(f"Error getting commits: {e}")
            return []

    def _get_commit_changes(self, commit_hash: str) -> Tuple[List[str], int, int]:
        """Get file changes and line counts for a commit"""
        try:
            # Get file list
            files_output = self._run_git_command(['show', '--name-only', '--format=', commit_hash])
            files_changed = [f for f in files_output.split('\n') if f.strip()]

            # Get line counts
            stats_output = self._run_git_command(['show', '--stat', '--format=', commit_hash])
            lines_added = 0
            lines_deleted = 0

            # Parse stats output (e.g., " 5 files changed, 123 insertions(+), 45 deletions(-)")
            for line in stats_output.split('\n'):
                if 'insertion' in line and 'deletion' in line:
                    # Extract numbers
                    insertions_match = re.search(r'(\d+) insertion', line)
                    deletions_match = re.search(r'(\d+) deletion', line)

                    if insertions_match:
                        lines_added = int(insertions_match.group(1))
                    if deletions_match:
                        lines_deleted = int(deletions_match.group(1))
                    break

            return files_changed, lines_added, lines_deleted

        except Exception:
            return [], 0, 0

    def _extract_pr_number(self, message: str) -> Optional[int]:
        """Extract PR number from commit message"""
        # Common patterns: (#123), PR #123, pull request #123
        patterns = [
            r'\(#(\d+)\)',
            r'PR #(\d+)',
            r'pull request #(\d+)',
            r'Merge pull request #(\d+)'
        ]

        for pattern in patterns:
            match = re.search(pattern, message, re.IGNORECASE)
            if match:
                return int(match.group(1))

        return None

    def get_pull_requests_info(self, commits: List[Commit]) -> List[PullRequest]:
        """Get detailed pull request information"""
        logger.info("Getting pull request information...")

        pr_numbers = set()
        for commit in commits:
            if commit.pr_number:
                pr_numbers.add(commit.pr_number)

        if not pr_numbers:
            logger.info("No PR numbers found in commits")
            return []

        pull_requests = []
        for pr_num in sorted(pr_numbers):
            pr_info = self._get_single_pr_info(pr_num, commits)
            if pr_info:
                pull_requests.append(pr_info)

        logger.info(f"Retrieved information for {len(pull_requests)} pull requests")
        return pull_requests

    def _get_single_pr_info(self, pr_number: int, all_commits: List[Commit]) -> Optional[PullRequest]:
        """Get information for a single pull request"""
        try:
            if self.gh_available:
                # Get PR info via GitHub CLI
                pr_json = self._run_gh_command([
                    'pr', 'view', str(pr_number), '--json',
                    'number,title,body,author,mergedAt,labels'
                ])

                if pr_json:
                    pr_data = json.loads(pr_json)
                    title = pr_data.get('title', f'PR #{pr_number}')
                    description = pr_data.get('body', '')
                    author = pr_data.get('author', {}).get('login', 'unknown')
                    merged_at = pr_data.get('mergedAt', '')
                    labels = [label['name'] for label in pr_data.get('labels', [])]
                else:
                    # Fallback to git log for basic info
                    title = f'Pull Request #{pr_number}'
                    description = ''
                    author = 'unknown'
                    merged_at = ''
                    labels = []
            else:
                # Use git log to get basic PR info
                title = f'Pull Request #{pr_number}'
                description = ''
                author = 'unknown'
                merged_at = ''
                labels = []

            # Find commits associated with this PR
            pr_commits = [c for c in all_commits if c.pr_number == pr_number]

            # Calculate totals
            files_changed = set()
            total_added = 0
            total_deleted = 0

            for commit in pr_commits:
                files_changed.update(commit.files_changed)
                total_added += commit.lines_added
                total_deleted += commit.lines_deleted

            return PullRequest(
                number=pr_number,
                title=title,
                description=description,
                author=author,
                merged_at=merged_at,
                labels=labels,
                commits=pr_commits,
                files_changed=list(files_changed),
                total_lines_added=total_added,
                total_lines_deleted=total_deleted
            )

        except Exception as e:
            logger.warning(f"Error getting PR {pr_number} info: {e}")
            return None

    def categorize_changes(self, commits: List[Commit], pull_requests: List[PullRequest]) -> List[ChangeCategory]:
        """Categorize all changes by type and impact"""
        logger.info("Categorizing changes...")

        changes = []
        processed_prs = set()

        # Process PR-based changes first (more reliable)
        for pr in pull_requests:
            if pr.number in processed_prs:
                continue

            category = self._categorize_pr(pr)
            if category:
                changes.append(category)
                processed_prs.add(pr.number)

        # Process individual commits not associated with PRs
        for commit in commits:
            if commit.pr_number is None or commit.pr_number not in processed_prs:
                category = self._categorize_commit(commit)
                if category:
                    changes.append(category)

        # Merge similar changes
        merged_changes = self._merge_similar_changes(changes)

        logger.info(f"Categorized {len(merged_changes)} distinct changes")
        return merged_changes

    def _categorize_pr(self, pr: PullRequest) -> Optional[ChangeCategory]:
        """Categorize a pull request"""
        # Use PR title for categorization (usually follows conventional commits)
        change_type, scope, description, breaking = self.parser.parse_commit_message(pr.title)

        # Extract business impact from PR description
        business_impact = self._extract_business_impact(pr.description)

        # Determine if security-related
        security_related = self._is_security_related(pr.title, pr.description, pr.labels)

        # Get technical details from commits
        technical_details = self._extract_technical_details(pr.commits, pr.files_changed)

        return ChangeCategory(
            type=change_type,
            scope=scope,
            description=description,
            business_impact=business_impact,
            technical_details=technical_details,
            breaking_change=breaking,
            security_related=security_related,
            pr_numbers=[pr.number],
            commits=[c.short_hash for c in pr.commits]
        )

    def _categorize_commit(self, commit: Commit) -> Optional[ChangeCategory]:
        """Categorize an individual commit"""
        change_type, scope, description, breaking = self.parser.parse_commit_message(commit.message)

        # For standalone commits, business impact is limited
        business_impact = self._extract_business_impact_from_commit(commit)

        security_related = self._is_security_related(commit.message, "", [])

        technical_details = f"Files changed: {', '.join(commit.files_changed[:5])}"
        if len(commit.files_changed) > 5:
            technical_details += f" and {len(commit.files_changed) - 5} more"

        return ChangeCategory(
            type=change_type,
            scope=scope,
            description=description,
            business_impact=business_impact,
            technical_details=technical_details,
            breaking_change=breaking,
            security_related=security_related,
            pr_numbers=[],
            commits=[commit.short_hash]
        )

    def _extract_business_impact(self, description: str) -> str:
        """Extract business impact from PR description"""
        if not description:
            return "No business impact specified"

        # Look for common sections that describe business impact
        impact_keywords = [
            'business impact', 'impact', 'benefits', 'value',
            'user impact', 'customer impact', 'why', 'motivation'
        ]

        lines = description.split('\n')
        impact_lines = []

        for i, line in enumerate(lines):
            line_lower = line.lower().strip()

            # Check if line contains impact keywords
            if any(keyword in line_lower for keyword in impact_keywords):
                # Include this line and potentially the next few lines
                impact_lines.append(line.strip())
                for j in range(i + 1, min(i + 4, len(lines))):
                    next_line = lines[j].strip()
                    if next_line and not next_line.startswith('#') and not next_line.startswith('-'):
                        impact_lines.append(next_line)
                    else:
                        break
                break

        if impact_lines:
            return ' '.join(impact_lines)

        # Fallback: use the first few sentences
        sentences = description.split('.')[:2]
        return '.'.join(sentences).strip() if sentences[0] else "No business impact specified"

    def _extract_business_impact_from_commit(self, commit: Commit) -> str:
        """Extract business impact from commit message"""
        # Limited information available in commit messages
        if 'fix' in commit.message.lower():
            return "Bug fix improving system reliability"
        elif 'feat' in commit.message.lower() or 'add' in commit.message.lower():
            return "New functionality for users"
        elif 'perf' in commit.message.lower():
            return "Performance improvement"
        else:
            return "Technical maintenance"

    def _is_security_related(self, title: str, description: str, labels: List[str]) -> bool:
        """Determine if change is security-related"""
        security_keywords = [
            'security', 'vulnerability', 'exploit', 'cve', 'auth', 'permission',
            'encrypt', 'decrypt', 'token', 'session', 'csrf', 'xss', 'sql injection',
            'sanitiz', 'validat', 'gdpr', 'compliance'
        ]

        text = f"{title} {description}".lower()
        label_text = ' '.join(labels).lower()

        return any(keyword in text or keyword in label_text for keyword in security_keywords)

    def _extract_technical_details(self, commits: List[Commit], files_changed: List[str]) -> str:
        """Extract technical details from commits and files"""
        details = []

        # Summarize files by category
        file_categories = self._categorize_files(files_changed)
        for category, count in file_categories.items():
            if count > 0:
                details.append(f"{count} {category} files")

        # Add commit count
        details.append(f"{len(commits)} commits")

        return ', '.join(details) if details else "No technical details available"

    def _categorize_files(self, files: List[str]) -> Dict[str, int]:
        """Categorize files by type"""
        categories = {
            'source': 0,
            'test': 0,
            'config': 0,
            'documentation': 0,
            'other': 0
        }

        for file_path in files:
            file_lower = file_path.lower()

            if any(ext in file_path for ext in ['.py', '.js', '.ts', '.tsx', '.java', '.cpp', '.go']):
                if 'test' in file_lower or 'spec' in file_lower:
                    categories['test'] += 1
                else:
                    categories['source'] += 1
            elif any(ext in file_path for ext in ['.json', '.yaml', '.yml', '.toml', '.ini']):
                categories['config'] += 1
            elif any(ext in file_path for ext in ['.md', '.rst', '.txt']):
                categories['documentation'] += 1
            else:
                categories['other'] += 1

        return categories

    def _merge_similar_changes(self, changes: List[ChangeCategory]) -> List[ChangeCategory]:
        """Merge similar changes to reduce duplication"""
        # Group by type and scope
        grouped = {}
        for change in changes:
            key = (change.type, change.scope)
            if key not in grouped:
                grouped[key] = []
            grouped[key].append(change)

        merged = []
        for group in grouped.values():
            if len(group) == 1:
                merged.append(group[0])
            else:
                # Merge multiple changes of the same type/scope
                base = group[0]
                descriptions = [c.description for c in group]
                pr_numbers = []
                commits = []

                for change in group:
                    pr_numbers.extend(change.pr_numbers)
                    commits.extend(change.commits)

                base.description = f"Multiple {base.type} changes: " + '; '.join(descriptions[:3])
                if len(descriptions) > 3:
                    base.description += f" and {len(descriptions) - 3} more"

                base.pr_numbers = list(set(pr_numbers))
                base.commits = list(set(commits))
                merged.append(base)

        return merged

    def generate_analysis_summary(self, commits: List[Commit], prs: List[PullRequest],
                                 changes: List[ChangeCategory]) -> Dict[str, Any]:
        """Generate analysis summary"""
        # Contributors
        contributors = list(set(c.author for c in commits))

        # Breaking changes
        breaking_changes = [c.description for c in changes if c.breaking_change]

        # Security changes
        security_changes = [c.description for c in changes if c.security_related]

        # File impact summary
        all_files = set()
        for commit in commits:
            all_files.update(commit.files_changed)
        for pr in prs:
            all_files.update(pr.files_changed)

        file_impact = self._categorize_files(list(all_files))

        return {
            'contributors': contributors,
            'breaking_changes': breaking_changes,
            'security_changes': security_changes,
            'file_impact_summary': file_impact
        }

    def run_analysis(self, since_tag: Optional[str] = None, branch: str = "main") -> ReleaseAnalysis:
        """Run complete git analysis workflow"""
        logger.info("Starting git analysis...")

        try:
            # If no tag specified, try to find the last release
            if since_tag is None:
                since_tag = self.get_last_release_tag()
                if since_tag:
                    logger.info(f"Using last release tag: {since_tag}")
                else:
                    logger.info("No release tag found - analyzing all history")

            # Get commits
            commits = self.get_commits_since_tag(since_tag, branch)
            if not commits:
                raise ValueError("No commits found for analysis")

            # Get PR information
            pull_requests = self.get_pull_requests_info(commits)

            # Categorize changes
            changes = self.categorize_changes(commits, pull_requests)

            # Generate summary
            summary = self.generate_analysis_summary(commits, pull_requests, changes)

            # Create analysis object
            analysis = ReleaseAnalysis(
                since_tag=since_tag or "beginning",
                target_branch=branch,
                analysis_date=datetime.now().isoformat(),
                total_commits=len(commits),
                total_prs=len(pull_requests),
                total_contributors=len(summary['contributors']),
                pull_requests=pull_requests,
                change_categories=changes,
                breaking_changes=summary['breaking_changes'],
                security_changes=summary['security_changes'],
                contributors=summary['contributors'],
                file_impact_summary=summary['file_impact_summary']
            )

            # Save results
            self.save_analysis(analysis)

            logger.info("Git analysis completed successfully!")
            return analysis

        except Exception as e:
            logger.error(f"Analysis failed: {str(e)}")
            raise

    def save_analysis(self, analysis: ReleaseAnalysis) -> Dict[str, str]:
        """Save analysis results to files"""
        logger.info("Saving analysis results...")

        # Save JSON for machine processing
        json_file = self.output_dir / "git-analysis.json"
        with open(json_file, 'w', encoding='utf-8') as f:
            json.dump(asdict(analysis), f, indent=2, ensure_ascii=False)

        # Save human-readable report
        report_file = self.output_dir / "git-analysis-report.md"
        self._generate_markdown_report(report_file, analysis)

        # Save CSV for the tracking tool (project management / issue tracker: TRACKING_TOOL)
        csv_file = self.output_dir / "git-changes-summary.csv"
        self._generate_csv_summary(csv_file, analysis)

        logger.info(f"Analysis saved to {self.output_dir}")

        return {
            "json_file": str(json_file),
            "report_file": str(report_file),
            "csv_file": str(csv_file)
        }

    def _generate_markdown_report(self, file_path: Path, analysis: ReleaseAnalysis):
        """Generate human-readable markdown report"""
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(f"""# Git Analysis Report

## Release Summary

- **Analysis Period**: Since {analysis.since_tag}
- **Target Branch**: {analysis.target_branch}
- **Total Commits**: {analysis.total_commits}
- **Total Pull Requests**: {analysis.total_prs}
- **Contributors**: {analysis.total_contributors}
- **Analysis Date**: {analysis.analysis_date}

## Change Categories

""")

            # Group changes by type
            changes_by_type = {}
            for change in analysis.change_categories:
                if change.type not in changes_by_type:
                    changes_by_type[change.type] = []
                changes_by_type[change.type].append(change)

            for change_type, changes in changes_by_type.items():
                f.write(f"### {change_type.title()} ({len(changes)} changes)\n\n")
                for change in changes:
                    f.write(f"- **{change.description}**")
                    if change.scope:
                        f.write(f" ({change.scope})")
                    if change.breaking_change:
                        f.write(" ⚠️ BREAKING")
                    if change.security_related:
                        f.write(" 🔒 SECURITY")
                    f.write("\n")

                    if change.business_impact and change.business_impact != "No business impact specified":
                        f.write(f"  - *Business Impact*: {change.business_impact}\n")

                    if change.pr_numbers:
                        f.write(f"  - *Pull Requests*: {', '.join(f'#{pr}' for pr in change.pr_numbers)}\n")

                    f.write("\n")

            if analysis.breaking_changes:
                f.write(f"""## ⚠️ Breaking Changes

{chr(10).join(f"- {change}" for change in analysis.breaking_changes)}

""")

            if analysis.security_changes:
                f.write(f"""## 🔒 Security Changes

{chr(10).join(f"- {change}" for change in analysis.security_changes)}

""")

            f.write(f"""## Contributors

{chr(10).join(f"- {contributor}" for contributor in sorted(analysis.contributors))}

## File Impact Summary

""")
            for file_type, count in analysis.file_impact_summary.items():
                if count > 0:
                    f.write(f"- **{file_type.title()}**: {count} files\n")

            f.write(f"""

---
*Generated by the LIDR Git Analyzer v1.0*
*Generated on: {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}*
""")

    def _generate_csv_summary(self, file_path: Path, analysis: ReleaseAnalysis):
        """Generate CSV summary for the tracking tool (project management / issue tracker: TRACKING_TOOL)"""
        import csv

        with open(file_path, 'w', newline='', encoding='utf-8') as f:
            writer = csv.writer(f)
            writer.writerow([
                'Type', 'Scope', 'Description', 'Business Impact',
                'Breaking Change', 'Security Related', 'PR Numbers', 'Commits'
            ])

            for change in analysis.change_categories:
                writer.writerow([
                    change.type,
                    change.scope,
                    change.description,
                    change.business_impact,
                    'Yes' if change.breaking_change else 'No',
                    'Yes' if change.security_related else 'No',
                    '; '.join(f'#{pr}' for pr in change.pr_numbers),
                    '; '.join(change.commits)
                ])

def main():
    """Main entry point"""
    parser = argparse.ArgumentParser(description="Analyze git repository for release notes")
    parser.add_argument("--since-tag", help="Analyze changes since this tag")
    parser.add_argument("--branch", default="main", help="Target branch to analyze")
    parser.add_argument("--output-dir", default="release-analysis", help="Output directory for results")

    args = parser.parse_args()

    try:
        analyzer = GitAnalyzer(".", args.output_dir)
        analysis = analyzer.run_analysis(args.since_tag, args.branch)

        print("✅ Git analysis completed successfully!")
        print("\nSummary:")
        print(f"  📊 Commits analyzed: {analysis.total_commits}")
        print(f"  🔀 Pull requests: {analysis.total_prs}")
        print(f"  👥 Contributors: {analysis.total_contributors}")
        print(f"  📝 Change categories: {len(analysis.change_categories)}")

        if analysis.breaking_changes:
            print(f"  ⚠️  Breaking changes: {len(analysis.breaking_changes)}")
        if analysis.security_changes:
            print(f"  🔒 Security changes: {len(analysis.security_changes)}")

        print(f"\n📁 Results saved to: {args.output_dir}")

        return 0

    except Exception as e:
        print(f"❌ Analysis failed: {str(e)}")
        return 1

if __name__ == "__main__":
    sys.exit(main())