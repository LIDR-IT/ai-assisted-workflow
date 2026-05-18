#!/usr/bin/env node

/**
 * Script to convert relative imports to absolute imports
 * Converts ../../../ patterns to @/ patterns
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const srcDir = path.join(__dirname, '..', 'src');

// Mapping patterns for absolute imports
const importMappings = [
  // hooks
  { pattern: /from ['"](\.\.\/)*\.\.\/hooks['"];?/g, replacement: "from '@/hooks';" },
  { pattern: /from ['"](\.\.\/)*\.\.\/hooks\/([^'"]+)['"];?/g, replacement: "from '@/hooks/$2';" },

  // data
  { pattern: /from ['"](\.\.\/)*\.\.\/data['"];?/g, replacement: "from '@/data';" },
  { pattern: /from ['"](\.\.\/)*\.\.\/data\/([^'"]+)['"];?/g, replacement: "from '@/data/$2';" },

  // components
  { pattern: /from ['"](\.\.\/)*\.\.\/app\/components\/([^'"]+)['"];?/g, replacement: "from '@/app/components/$2';" },
  { pattern: /from ['"](\.\.\/)*\.\.\/components\/([^'"]+)['"];?/g, replacement: "from '@/app/components/$2';" },

  // styles
  { pattern: /from ['"](\.\.\/)*\.\.\/styles\/([^'"]+)['"];?/g, replacement: "from '@/styles/$2';" },

  // utils
  { pattern: /from ['"](\.\.\/)*\.\.\/utils\/([^'"]+)['"];?/g, replacement: "from '@/utils/$2';" },

  // Generic src patterns
  { pattern: /from ['"](\.\.\/)*\.\.\/([^'"]+)['"];?/g, replacement: "from '@/$2';" },
];

function fixImportsInFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  let updatedContent = content;
  let hasChanges = false;

  for (const mapping of importMappings) {
    const originalContent = updatedContent;
    updatedContent = updatedContent.replace(mapping.pattern, mapping.replacement);
    if (updatedContent !== originalContent) {
      hasChanges = true;
    }
  }

  if (hasChanges) {
    fs.writeFileSync(filePath, updatedContent);
    console.log(`✅ Fixed imports in: ${path.relative(srcDir, filePath)}`);
  }

  return hasChanges;
}

function findTypeScriptFiles(dir) {
  const files = [];
  const items = fs.readdirSync(dir, { withFileTypes: true });

  for (const item of items) {
    const itemPath = path.join(dir, item.name);

    if (item.isDirectory() && !item.name.startsWith('.') && item.name !== 'node_modules') {
      files.push(...findTypeScriptFiles(itemPath));
    } else if (item.isFile() && (item.name.endsWith('.ts') || item.name.endsWith('.tsx'))) {
      files.push(itemPath);
    }
  }

  return files;
}

async function main() {
  console.log('🔧 Starting import path standardization...\n');

  const files = findTypeScriptFiles(srcDir);
  let totalFixed = 0;

  for (const file of files) {
    if (fixImportsInFile(file)) {
      totalFixed++;
    }
  }

  console.log(`\n✨ Import standardization complete!`);
  console.log(`📊 Files processed: ${files.length}`);
  console.log(`🔧 Files updated: ${totalFixed}`);

  if (totalFixed > 0) {
    console.log('\n⚠️  Run npm run build to verify changes work correctly');
  }
}

main().catch(console.error);