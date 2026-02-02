# VitePress Configuration Guide

## Overview

This guide documents the VitePress configuration used in the LIDR documentation site, including setup, customization options, known issues, and workarounds.

## Configuration File

**Location:** `docs/.vitepress/config.js`

The configuration file uses VitePress's `defineConfig` helper for type safety and autocomplete:

```javascript
import { defineConfig } from 'vitepress'

export default defineConfig({
  // Configuration options
})
```

## Current Configuration

### Basic Settings

```javascript
export default defineConfig({
  title: 'LIDR Docs',
  description: 'Documentación interna del equipo',

  // Base URL (default: '/')
  // Uncomment if deploying to subdirectory:
  // base: '/docs/',
})
```

### Build Configuration

```javascript
export default defineConfig({
  // Temporary workaround for dead links (see Known Issues)
  ignoreDeadLinks: true,

  // Build output directory (default: .vitepress/dist)
  outDir: '../dist',

  // Clean output directory before build (default: true)
  cleanUrls: true,
})
```

### Internationalization (i18n)

```javascript
export default defineConfig({
  locales: {
    es: {
      label: 'Español',
      lang: 'es',
      link: '/es/',
      title: 'LIDR Docs',
      description: 'Documentación interna del equipo'
    },
    en: {
      label: 'English',
      lang: 'en',
      link: '/en/',
      title: 'LIDR Docs',
      description: 'Internal team documentation'
    }
  }
})
```

**Directory Structure:**
```
docs/
├── es/          # Spanish content
│   └── index.md
└── en/          # English content
    └── index.md
```

### Theme Configuration

```javascript
export default defineConfig({
  themeConfig: {
    // Navbar
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/guide/' },
      { text: 'Reference', link: '/reference/' }
    ],

    // Sidebar
    sidebar: {
      '/guide/': [
        {
          text: 'Getting Started',
          items: [
            { text: 'Introduction', link: '/guide/' },
            { text: 'Installation', link: '/guide/installation' }
          ]
        }
      ]
    },

    // Social links
    socialLinks: [
      { icon: 'github', link: 'https://github.com/your-org/your-repo' }
    ],

    // Footer
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2026-present LIDR Team'
    }
  }
})
```

## Known Issues & Workarounds

### Dead Links in Build

**Issue:** Build fails when dead links are detected in markdown files.

**Status:** 67 dead links across documentation

**Root Causes:**
1. Broken internal links to moved/renamed files
2. References to non-existent documentation sections
3. Placeholder links in templates

**Current Workaround:**

```javascript
export default defineConfig({
  // Temporary: Allow build to complete despite dead links
  ignoreDeadLinks: true
})
```

**Limitations:**
- Masks real broken links from users
- No visibility into which links are broken
- Can lead to poor user experience

**Recommended Resolution:**
1. Create inventory of dead links:
   ```bash
   # Build without ignore to see all dead links
   npm run docs:build 2>&1 | grep "Dead link"
   ```

2. Categorize by type:
   - Internal links (fixable)
   - External links (verify availability)
   - Placeholder links (remove or update)

3. Create cleanup ticket (TICK-002):
   - Fix internal links
   - Verify external links
   - Remove placeholders
   - Remove `ignoreDeadLinks: true`

**Timeline:** Target removal in next sprint

### Vue Template Parsing Errors

**Issue:** Markdown content with `<server>` and `<tool>` tags parsed as HTML.

**Location:** `docs/en/references/hooks/automate-workflows-with-hooks.md:419`

**Error:**
```
Vue template parsing error: Tags with that name cannot be self-closing
```

**Root Cause:**
VitePress processes markdown through Vue, which treats angle brackets as HTML tags.

**Solution:**
Replace angle brackets with HTML entities:

```markdown
<!-- Before (broken) -->
<server> and <tool> placeholders

<!-- After (fixed) -->
&lt;server&gt; and &lt;tool&gt; placeholders
```

**Prevention:**
- Use backticks for code: `` `<server>` ``
- Use HTML entities in prose: `&lt;server&gt;`
- Use code fences for multi-line examples

### Build Performance

**Current:** ~3.5 seconds (acceptable)

**If build becomes slow (>10s):**

1. Enable build caching:
   ```javascript
   export default defineConfig({
     vite: {
       build: {
         rollupOptions: {
           cache: true
         }
       }
     }
   })
   ```

2. Reduce markdown processing:
   ```javascript
   export default defineConfig({
     markdown: {
       lineNumbers: false // Disable if not needed
     }
   })
   ```

## NPM Scripts

**Defined in `package.json`:**

```json
{
  "scripts": {
    "docs:dev": "vitepress dev docs",
    "docs:build": "vitepress build docs",
    "docs:preview": "vitepress preview docs"
  }
}
```

### Development Server

```bash
npm run docs:dev
```

**Features:**
- Hot module replacement (HMR)
- Instant updates on file changes
- Runs on `http://localhost:5173`
- Fast rebuild times (<100ms)

**Options:**
```bash
# Custom port
npm run docs:dev -- --port 3000

# Custom host (for network access)
npm run docs:dev -- --host 0.0.0.0
```

### Production Build

```bash
npm run docs:build
```

**Output:**
- Directory: `docs/.vitepress/dist/`
- Optimized HTML, CSS, JS
- Pre-rendered static pages
- Build time: ~3-4 seconds

**Verification:**
```bash
# Check output
ls -lh docs/.vitepress/dist/

# Verify file sizes
du -sh docs/.vitepress/dist/*
```

### Preview Build

```bash
npm run docs:preview
```

**Purpose:**
- Preview production build locally
- Test before deployment
- Verify all assets load correctly

**Runs on:** `http://localhost:4173`

## Advanced Configuration

### Custom Markdown

```javascript
export default defineConfig({
  markdown: {
    // Line numbers in code blocks
    lineNumbers: true,

    // Anchor links on headings
    anchor: {
      permalink: true
    },

    // Code highlighting theme
    theme: {
      light: 'github-light',
      dark: 'github-dark'
    }
  }
})
```

### Vite Configuration

```javascript
export default defineConfig({
  vite: {
    // Server options
    server: {
      port: 5173,
      host: true
    },

    // Build options
    build: {
      chunkSizeWarningLimit: 1000
    },

    // Plugins
    plugins: [
      // Add Vite plugins here
    ]
  }
})
```

### Head Tags

Add meta tags, favicons, scripts:

```javascript
export default defineConfig({
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['meta', { name: 'theme-color', content: '#d4a574' }], // Gold brand color (hex approximation)
    ['meta', { name: 'og:type', content: 'website' }],
    ['meta', { name: 'og:locale', content: 'es' }],
  ]
})
```

**Note:** The theme uses `oklch(0.72 0.16 85)` for the gold brand color in CSS, but `theme-color` meta tag requires hex format. Use `#d4a574` as the closest hex approximation.

### Search Configuration

VitePress includes built-in search (local):

```javascript
export default defineConfig({
  themeConfig: {
    search: {
      provider: 'local',
      options: {
        // Search options
        locales: {
          es: {
            translations: {
              button: {
                buttonText: 'Buscar',
                buttonAriaLabel: 'Buscar'
              }
            }
          }
        }
      }
    }
  }
})
```

## Deployment Configuration

### Static Site Hosting

**GitHub Pages:**
```javascript
export default defineConfig({
  base: '/repository-name/',
  outDir: 'dist'
})
```

**Netlify/Vercel:**
```javascript
export default defineConfig({
  base: '/',
  outDir: 'dist'
})
```

**Build command:** `npm run docs:build`
**Output directory:** `docs/.vitepress/dist`

### Environment Variables

```javascript
export default defineConfig({
  vite: {
    define: {
      __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
      __VERSION__: JSON.stringify(process.env.npm_package_version)
    }
  }
})
```

## Troubleshooting

### Build Fails with "Dead link found"

**Temporary solution:**
```javascript
ignoreDeadLinks: true
```

**Proper solution:**
Fix the broken links and remove the workaround.

### Dev Server Not Hot Reloading

**Causes:**
1. File watcher limit exceeded
2. WSL/Docker filesystem issues

**Solutions:**
```bash
# Increase file watch limit (Linux/macOS)
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
sudo sysctl -p

# Restart dev server
npm run docs:dev
```

### Port Already in Use

```bash
# Find process using port 5173
lsof -ti:5173

# Kill process
kill -9 $(lsof -ti:5173)

# Or use different port
npm run docs:dev -- --port 3000
```

### Theme Not Loading

```bash
# Clear VitePress cache
rm -rf docs/.vitepress/cache

# Clear node_modules cache
rm -rf node_modules/.vite

# Restart dev server
npm run docs:dev
```

## Best Practices

### Configuration Organization

```javascript
// Separate theme config for readability
const themeConfig = {
  nav: [...],
  sidebar: {...},
  // ...
}

export default defineConfig({
  title: 'LIDR Docs',
  description: 'Documentación interna del equipo',
  themeConfig
})
```

### Version Control

**Commit:**
- `docs/.vitepress/config.js` ✅
- `docs/.vitepress/theme/` ✅

**Ignore:**
- `docs/.vitepress/cache/` ❌
- `docs/.vitepress/dist/` ❌

### Documentation

- Document all non-standard config options
- Add comments for workarounds (with ticket references)
- Keep this guide updated with changes

## Migration Checklist

**When removing `ignoreDeadLinks: true`:**

- [ ] Run build without flag to identify all dead links
- [ ] Create link inventory spreadsheet
- [ ] Fix all internal broken links
- [ ] Verify or remove external links
- [ ] Remove placeholder links
- [ ] Test build completes successfully
- [ ] Remove `ignoreDeadLinks: true` from config
- [ ] Update this documentation
- [ ] Commit changes

## Related Documentation

- [VitePress Theme Customization](./vitepress-theme-customization.md) - Theme and color system
- [VitePress Official Docs](https://vitepress.dev/reference/site-config) - Full config reference
- [Design Guidelines](../../.agents/rules/design/web-design.md) - Design system rules

## Change Log

| Date | Change | Ticket |
|------|--------|--------|
| 2026-02-02 | Added `ignoreDeadLinks: true` workaround | TICK-001 |
| 2026-02-02 | Fixed Vue template parsing errors | TICK-001 |
| 2026-02-02 | Initial configuration documentation | TICK-001 |
