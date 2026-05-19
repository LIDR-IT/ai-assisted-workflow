---
id: ADR-0003
version: "1.0.0"
last_updated: "2026-03-25"
updated_by: "IA: sync-docs"
status: active
type: adr
review_cycle: 90
next_review: "2026-06-23"
owner_role: "Tech Lead"
---

# ADR-0003: Tailwind CSS v4 with CSS-first Configuration

## Metadata

| Field              | Value                    |
| ------------------ | ------------------------ |
| **ID**             | ADR-0003                 |
| **Date**           | 2026-03-09               |
| **Status**         | Accepted                 |
| **Deciders**       | Tech Lead, Frontend Lead |
| **Technical Area** | Frontend / Styling       |

## Context

The SDLC-360 {{CLIENT_NAME}} project requires a comprehensive styling solution for:

- 17 interactive React Flow diagrams with consistent color schemes and visual hierarchy
- Responsive UI components across desktop, tablet, and mobile viewports
- Design system maintenance across multiple page components (18 route components)
- Rapid prototyping and iteration during the development phase
- Performance optimization for SPA with <200KB bundle target

The styling approach needed to support complex diagram styling, custom component theming, and maintainable design tokens while enabling fast development velocity for a documentation-heavy application.

## Decision Drivers

- **Design consistency**: 17 diagrams need consistent color schemes by SDLC phase
- **Development velocity**: Rapid UI development without writing custom CSS
- **Performance**: Minimal CSS bundle size through purging unused styles
- **Maintainability**: Design tokens centralized for easy theme updates
- **Future-proofing**: Align with Tailwind's roadmap and best practices
- **React Flow integration**: Custom node styling requires flexible utility approach
- **Team expertise**: Team familiar with utility-first CSS patterns

## Considered Options

1. **Vanilla CSS with custom design system** — Traditional CSS with CSS variables
2. **Tailwind CSS v3 with JavaScript configuration** — Stable version with tailwind.config.js
3. **Tailwind CSS v4 with CSS-first configuration** — Latest version with theme.css
4. **CSS-in-JS (Emotion/Styled Components)** — Runtime CSS generation

## Decision Outcome

**Chosen option: "Tailwind CSS v4 with CSS-first configuration"** because it provides the utility-first development experience while adopting the new CSS-first paradigm that offers better performance and aligns with Tailwind's future direction.

### Consequences

**Good:**

- CSS-first configuration eliminates JavaScript config parsing overhead
- Design tokens in `theme.css` provide better IDE support and debugging
- Improved build performance with native CSS parsing
- Future-proof architecture aligned with Tailwind v4+ direction
- Better integration with standard CSS tooling and DevTools
- Simplified configuration without JavaScript config complexity

**Bad:**

- Bleeding edge version with potential stability issues
- Smaller community knowledge base compared to v3
- Migration complexity if rollback to v3 needed
- Limited documentation for CSS-first patterns during early adoption

**Neutral:**

- Requires learning CSS custom properties approach vs JavaScript config
- Different mental model for theme customization

## Pros and Cons of Options

### Vanilla CSS with custom design system

- ✅ Full control over CSS output and performance
- ✅ No external dependencies
- ✅ Easy debugging and inspection
- ✅ Standards-compliant CSS
- ❌ Significant development time for utility system
- ❌ Maintenance overhead for design system
- ❌ No automatic purging or optimization
- ❌ Requires custom responsive breakpoint system

### Tailwind CSS v3 with JavaScript configuration

- ✅ Mature, stable version with extensive community support
- ✅ Comprehensive documentation and examples
- ✅ Proven performance in production applications
- ✅ Rich plugin ecosystem
- ❌ JavaScript config creates build-time complexity
- ❌ Deprecated pattern (Tailwind moving away from JS config)
- ❌ Less optimal build performance
- ❌ IDE support limitations for config IntelliSense

### Tailwind CSS v4 with CSS-first configuration — chosen

- ✅ CSS-first configuration improves build performance
- ✅ Better IDE support with CSS custom properties
- ✅ Native CSS integration (no JavaScript execution)
- ✅ Simplified mental model aligned with web standards
- ✅ Future-proof architecture
- ✅ Better debugging experience in browser DevTools
- ❌ Bleeding edge with potential stability issues
- ❌ Limited community resources during early adoption
- ❌ Migration risk if rollback needed

### CSS-in-JS (Emotion/Styled Components)

- ✅ Dynamic styling capabilities
- ✅ Component-scoped styles
- ✅ TypeScript integration for style props
- ❌ Runtime performance overhead
- ❌ Larger JavaScript bundle size
- ❌ Server-side rendering complexity
- ❌ Debugging complexity with generated class names
- ❌ Not optimal for utility-first development approach

## Implementation Notes

- Design tokens defined in `src/styles/theme.css` using CSS custom properties
- Color schemes organized by SDLC phases (purple=originación, blue=discovery, etc.)
- Custom utilities for React Flow node styling through CSS classes
- Vite integration with `@tailwindcss/vite` plugin for optimal build performance
- Purge configuration optimized for React Flow and diagram components

## Migration Strategy

- Monitor Tailwind CSS v4 stability and community adoption
- Fallback plan: documented migration path back to v3 if critical issues emerge
- Performance monitoring to validate build time improvements
- Team training on CSS-first configuration patterns

## Links

- [Tailwind CSS v4 Alpha Documentation](https://v4.tailwindcss.com/)
- [CSS-first Configuration Guide](https://v4.tailwindcss.com/docs/configuration)
- [Project theme.css](../../src/styles/theme.css)
- [Related: ADR-0002 React Flow Interactive Diagrams](./ADR-0002-react-flow-interactive-diagrams.md)
