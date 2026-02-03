# VitePress Theme Customization Guide

## Overview

This guide explains how to customize the VitePress theme used in the LIDR documentation site. The theme extends VitePress's default theme with custom branding, colors, and component styling.

## Theme Architecture

### Directory Structure

```
docs/.vitepress/
├── config.js           # VitePress configuration
└── theme/              # Custom theme directory
    ├── index.ts        # Theme entry point
    └── custom.css      # Color system and styles
```

### Theme Extension Pattern

The custom theme extends VitePress's DefaultTheme rather than replacing it:

```typescript
// docs/.vitepress/theme/index.ts
import DefaultTheme from "vitepress/theme";
import "./custom.css";

export default {
  extends: DefaultTheme,
  enhanceApp({ app, router, siteData }) {
    // Custom app-level enhancements
  },
};
```

**Why extend instead of replace:**

- Maintains all default VitePress features
- Inherits responsive layouts and components
- Simplifies upgrades to future VitePress versions
- Reduces maintenance burden

## Color System

### Brand Colors

The theme uses a gold primary color with complementary slate backgrounds:

**Light Mode:**

- Primary: `oklch(0.72 0.16 85)` (slightly darker gold for legibility)
- Soft: `oklch(0.95 0.05 90)` (very light gold tint)
- Dark: `oklch(0.6 0.18 80)` (darker gold for accents)

**Dark Mode:**

- Complementary gold palette optimized for dark backgrounds
- Enhanced contrast for WCAG AA compliance

**Why oklch():**

- Better perceptual uniformity than hex/rgb
- Easier to create consistent color scales
- Better color management across light/dark modes

### CSS Custom Properties

All colors are defined as CSS custom properties using oklch() format:

```css
:root {
  --gold-primary: oklch(0.72 0.16 85);
  --gold-soft: oklch(0.95 0.05 90);
  --gold-dark: oklch(0.6 0.18 80);

  --vp-c-brand-1: var(--gold-primary);
  --vp-c-brand-2: var(--gold-dark);
  --vp-c-brand-3: var(--gold-dark);
  --vp-c-brand-soft: oklch(0.72 0.16 85 / 10%);
}

.dark {
  /* Complementary gold palette for dark mode */
  --vp-c-brand-1: var(--gold-primary);
  /* Additional dark mode adjustments */
}
```

### Semantic Colors

**Tips (Green):**

- Light: `#10b981` (emerald-500)
- Dark: `#34d399` (emerald-400)

**Warnings (Orange):**

- Light: `#f59e0b` (amber-500)
- Dark: `#fbbf24` (amber-400)

**Danger (Red):**

- Light: `#ef4444` (red-500)
- Dark: `#f87171` (red-400)

## Customizing Colors

### Changing Brand Colors

Edit `docs/.vitepress/theme/custom.css`:

```css
:root {
  /* Change primary brand color */
  --vp-c-brand-1: #your-color;
  --vp-c-brand-2: #your-hover-color;
  --vp-c-brand-3: #your-active-color;
}
```

**Steps:**

1. Choose your brand color
2. Generate hover (-20% lightness) and active (-40% lightness) variants
3. Update both `:root` and `.dark` sections
4. Test in both light and dark modes

### Changing Background Colors

```css
.dark {
  --vp-c-bg: #0f172a; /* Main background */
  --vp-c-bg-alt: #1e293b; /* Sidebar/alternate */
  --vp-c-bg-soft: #334155; /* Soft backgrounds */
}
```

### Testing Color Changes

```bash
# Start dev server
npm run docs:dev

# Visit http://localhost:5173
# Toggle dark mode (moon icon in nav)
# Verify colors across different pages
```

## Component Customizations

### Code Blocks

```css
/* Enhanced code block styling */
div[class*="language-"] {
  border-radius: 8px;
  margin: 16px 0;
}

--vp-code-bg: #f3f4f6; /* Light mode background */
--vp-code-color: #1f2937; /* Light mode text */
```

### Links

```css
.vp-doc a {
  font-weight: 500;
  transition: color 0.2s ease;
}

.vp-doc a:hover {
  color: var(--vp-c-brand-2);
}
```

### Scrollbar (Dark Mode)

```css
.dark ::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.dark ::-webkit-scrollbar-thumb {
  background: var(--vp-c-bg-soft);
  border-radius: 4px;
}
```

### Sidebar

```css
.VPSidebar {
  border-right: 1px solid var(--vp-c-divider);
}
```

## VitePress Configuration

### Current Configuration

```javascript
// docs/.vitepress/config.js
export default defineConfig({
  title: "LIDR Docs",
  description: "Documentación interna del equipo",

  // Temporary workaround for dead links (see Known Issues)
  ignoreDeadLinks: true,

  // Locales configuration
  locales: {
    // ...
  },
});
```

### Known Issues

**Dead Links (67 total):**

- **Status:** Temporarily ignored via `ignoreDeadLinks: true`
- **Impact:** Build succeeds despite broken links
- **Resolution:** Requires separate cleanup ticket
- **Recommendation:** Track dead links and fix systematically

**Workarounds Applied:**

1. Vue template parsing errors fixed (angle brackets → HTML entities)
2. Dead links ignored during build (temporary)

### Build Commands

```bash
# Development server (with hot reload)
npm run docs:dev

# Production build
npm run docs:build

# Preview production build
npm run docs:preview
```

## Adding Custom Components

### Create Component

```vue
<!-- docs/.vitepress/theme/components/MyComponent.vue -->
<template>
  <div class="my-component">
    <!-- Component content -->
  </div>
</template>

<style scoped>
.my-component {
  /* Use theme variables */
  color: var(--vp-c-text-1);
  background: var(--vp-c-bg-soft);
}
</style>
```

### Register Component

```typescript
// docs/.vitepress/theme/index.ts
import DefaultTheme from "vitepress/theme";
import MyComponent from "./components/MyComponent.vue";
import "./custom.css";

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component("MyComponent", MyComponent);
  },
};
```

### Use Component

```markdown
<!-- In any .md file -->
<MyComponent />
```

## Advanced Customization

### Layout Overrides

Replace default layouts by creating files in `docs/.vitepress/theme/`:

```
theme/
├── Layout.vue          # Override default layout
├── NotFound.vue        # Override 404 page
└── components/
    └── VPNavBar.vue    # Override navbar
```

### Custom CSS Classes

Add utility classes in `custom.css`:

```css
/* Custom utility classes */
.text-brand {
  color: var(--vp-c-brand-1);
}

.bg-soft {
  background: var(--vp-c-bg-soft);
  padding: 1rem;
  border-radius: 8px;
}
```

Use in markdown:

```markdown
<div class="bg-soft">
Custom styled content
</div>
```

## Troubleshooting

### Theme Not Loading

**Symptoms:** Default theme appears, custom colors not applied

**Solutions:**

```bash
# Clear cache
rm -rf docs/.vitepress/cache

# Restart dev server
npm run docs:dev
```

### Colors Not Updating

**Symptoms:** Color changes not visible

**Solutions:**

1. Hard refresh browser (Cmd+Shift+R / Ctrl+Shift+F5)
2. Check CSS syntax in `custom.css`
3. Verify custom property names match VitePress conventions
4. Check browser console for errors

### Build Fails

**Common issues:**

- Invalid CSS syntax
- Missing imports in `index.ts`
- Component import errors

**Debug:**

```bash
# Build with verbose output
npm run docs:build -- --debug
```

## Best Practices

### Naming Conventions

- Use VitePress naming: `--vp-c-*` for colors
- Follow VitePress structure: `brand`, `accent`, `bg`, `text`, `border`
- Maintain consistency with default theme variables

### Performance

- Minimize custom CSS (extends default, don't override everything)
- Use CSS custom properties (faster than SASS/LESS)
- Avoid heavy JavaScript in theme enhancements

### Maintenance

- Document all customizations inline
- Test in both light and dark modes
- Verify responsive behavior (mobile, tablet, desktop)
- Keep VitePress updated for security and features

## Reference

### Complete Color Variable List

See `docs/.vitepress/theme/custom.css` for the full list of 40+ CSS custom properties.

**Categories:**

- Brand colors (`--vp-c-brand-*`)
- Accent colors (`--vp-c-accent-*`)
- Background colors (`--vp-c-bg-*`)
- Text colors (`--vp-c-text-*`)
- Border colors (`--vp-c-border`, `--vp-c-divider`)
- Code colors (`--vp-code-*`)
- Semantic colors (`--vp-c-tip-*`, `--vp-c-warning-*`, `--vp-c-danger-*`)

### External Resources

- [VitePress Theme Guide](https://vitepress.dev/guide/extending-default-theme)
- [VitePress Custom CSS](https://vitepress.dev/guide/custom-theme)
- [CSS Custom Properties (MDN)](https://developer.mozilla.org/en-US/docs/Web/CSS/--*)

## Related Documentation

- [Web Design Guidelines](../../.agents/rules/design/web-design.md) - Design system rules
- [VitePress Config Reference](https://vitepress.dev/reference/site-config)
