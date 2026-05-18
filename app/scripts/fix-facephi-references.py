#!/usr/bin/env python3
"""
{{CLIENT_NAME}} Reference Cleanup Script - ZERO TOLERANCE

This script systematically replaces all {{CLIENT_NAME}} references in the codebase
to achieve ABSOLUTE ZERO references for Docline delivery.

Strategy:
1. TypeScript/JavaScript code: Use "Docline" or "Acme Corp" as client examples
2. Configuration files: Use "{{CLIENT_NAME}}" template variables
3. Documentation: Use "{{CLIENT_NAME}}" or "Docline" based on context
4. Python scripts: Use "acme" or "docline" as client codes
5. Directory paths: Replace {{CLIENT_CODE}} with docline
"""

import os
import re
import sys
from pathlib import Path

# Replacement strategies by file type and context
REPLACEMENTS = {
    # TypeScript/JavaScript/JSON files (need actual values, not templates)
    'code': {
        '{{CLIENT_NAME}}': 'Docline',
        '{{CLIENT_CODE}}': 'docline',
        '{{CLIENT_CODE_UPPER}}': 'DOCLINE',
    },

    # Documentation files (can use template variables)
    'docs': {
        '{{CLIENT_NAME}}': '{{CLIENT_NAME}}',
        '{{CLIENT_CODE}}': '{{CLIENT_CODE}}',
        '{{CLIENT_CODE_UPPER}}': '{{CLIENT_CODE_UPPER}}',
    },

    # Configuration files (use template variables)
    'config': {
        '{{CLIENT_NAME}}': '{{CLIENT_NAME}}',
        '{{CLIENT_CODE}}': '{{CLIENT_CODE}}',
        '{{CLIENT_CODE_UPPER}}': '{{CLIENT_CODE_UPPER}}',
    },
}

# File type classification
CODE_EXTENSIONS = {'.ts', '.tsx', '.js', '.jsx'}
CONFIG_EXTENSIONS = {'.json', '.yml', '.yaml', '.toml', '.ini'}
DOCS_EXTENSIONS = {'.md', '.txt', '.rst'}

# Special handling for paths and context
SPECIAL_PATTERNS = {
    # Path references that need client code
    r'sdlc-{{CLIENT_CODE}}': 'sdlc-{{CLIENT_CODE}}',
    r'/{{CLIENT_CODE}}/': '/{{CLIENT_CODE}}/',
    r'{{CLIENT_CODE}}-': '{{CLIENT_CODE}}-',

    # Specific domain references
    r'domain-specific': 'domain-specific',
    r'domain-specific': 'Domain-Specific',

    # Company specific terms that should be generic
    r'{{PRODUCT_NAME_1}}': '{{PRODUCT_NAME_1}}',
    r'{{PRODUCT_NAME_1}}D': '{{PRODUCT_NAME_2}}',
}

def get_replacement_strategy(file_path):
    """Determine which replacement strategy to use based on file type"""
    ext = Path(file_path).suffix.lower()

    if ext in CODE_EXTENSIONS:
        return 'code'
    elif ext in CONFIG_EXTENSIONS:
        return 'config'
    elif ext in DOCS_EXTENSIONS:
        return 'docs'
    else:
        # Default to docs for unknown extensions
        return 'docs'

def clean_file(file_path):
    """Clean a single file of {{CLIENT_NAME}} references"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        original_content = content
        strategy = get_replacement_strategy(file_path)
        replacements = REPLACEMENTS[strategy]

        # Apply regular replacements
        for old, new in replacements.items():
            content = content.replace(old, new)

        # Apply special pattern replacements for docs and config
        if strategy in ['docs', 'config']:
            for pattern, replacement in SPECIAL_PATTERNS.items():
                content = re.sub(pattern, replacement, content, flags=re.IGNORECASE)

        # Write back if changed
        if content != original_content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"✅ Fixed: {file_path}")
            return True
        else:
            return False

    except Exception as e:
        print(f"❌ Error processing {file_path}: {e}")
        return False

def main():
    """Main execution"""
    if len(sys.argv) > 1:
        root_dir = sys.argv[1]
    else:
        root_dir = '.'

    print("🔍 Scanning for {{CLIENT_NAME}} references...")

    # Find all files with {{CLIENT_NAME}} references
    files_with_{{CLIENT_CODE}} = []

    for root, dirs, files in os.walk(root_dir):
        # Skip certain directories
        if any(skip_dir in root for skip_dir in ['node_modules', '.git', 'dist', '.next']):
            continue

        for file in files:
            file_path = os.path.join(root, file)

            # Only process text files
            if not any(file.endswith(ext) for ext in ['.ts', '.tsx', '.js', '.jsx', '.md', '.json', '.py', '.yml', '.yaml', '.html', '.txt']):
                continue

            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                    if '{{CLIENT_CODE}}' in content.lower():
                        files_with_{{CLIENT_CODE}}.append(file_path)
            except:
                continue

    print(f"📊 Found {len(files_with_{{CLIENT_CODE}})} files with {{CLIENT_NAME}} references")

    if not files_with_{{CLIENT_CODE}}:
        print("🎉 No {{CLIENT_NAME}} references found!")
        return

    # Process each file
    fixed_count = 0
    for file_path in files_with_{{CLIENT_CODE}}:
        if clean_file(file_path):
            fixed_count += 1

    print(f"\n🎯 SUMMARY:")
    print(f"   Files scanned: {len(files_with_{{CLIENT_CODE}})}")
    print(f"   Files fixed: {fixed_count}")

    # Verify cleanup
    print("\n🔍 Verifying cleanup...")
    remaining_files = []
    for root, dirs, files in os.walk(root_dir):
        if any(skip_dir in root for skip_dir in ['node_modules', '.git', 'dist', '.next']):
            continue

        for file in files:
            file_path = os.path.join(root, file)
            if not any(file.endswith(ext) for ext in ['.ts', '.tsx', '.js', '.jsx', '.md', '.json', '.py', '.yml', '.yaml', '.html', '.txt']):
                continue

            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                    if '{{CLIENT_CODE}}' in content.lower():
                        remaining_files.append(file_path)
            except:
                continue

    if remaining_files:
        print(f"⚠️  WARNING: {len(remaining_files)} files still contain {{CLIENT_NAME}} references:")
        for file_path in remaining_files[:10]:  # Show first 10
            print(f"   - {file_path}")
        if len(remaining_files) > 10:
            print(f"   ... and {len(remaining_files) - 10} more")
    else:
        print("🎉 ZERO {{CLIENT_CODE_UPPER}} REFERENCES ACHIEVED!")

if __name__ == '__main__':
    main()