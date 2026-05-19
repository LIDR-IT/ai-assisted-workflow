---
id: ADR-0002
version: "1.0.0"
last_updated: "2026-03-25"
updated_by: "IA: sync-docs"
status: active
type: adr
review_cycle: 90
next_review: "2026-06-23"
owner_role: "Tech Lead"
---

# ADR-0002: React Flow for Interactive SDLC Diagrams

## Metadata

| Field              | Value                    |
| ------------------ | ------------------------ |
| **ID**             | ADR-0002                 |
| **Date**           | 2026-03-09               |
| **Status**         | Accepted                 |
| **Deciders**       | Tech Lead, R&D Core Lead |
| **Technical Area** | Frontend / Architecture  |

## Context

The SDLC-360 {{CLIENT_NAME}} project requires 17 interactive diagrams to visualize complex software development lifecycle flows. These diagrams need to support:

- Complex node/edge relationships representing SDLC phases, gates, roles, and artifacts
- Interactive capabilities: zoom, pan, drag for large workflow exploration
- Export functionality for documentation and presentations
- Integration with React 18 application architecture
- Performance suitable for complex workflows (50+ nodes per diagram)

The diagrams are central to the user experience as they serve as the primary navigation and learning interface for the SDLC process documentation.

## Decision Drivers

- **Interactivity required**: Static diagrams insufficient for complex SDLC flows
- **React integration**: Must work seamlessly with React 18 + TypeScript
- **Export capabilities**: PDF/PNG export needed for offline documentation
- **Development velocity**: Limited time to implement custom visualization
- **Maintenance burden**: Team has React experience, limited D3.js expertise
- **Bundle size consideration**: SPA performance target <200KB initial load

## Considered Options

1. **Mermaid** — Static diagram generation from markup
2. **@xyflow/react (React Flow)** — React-native interactive flow library
3. **D3.js** — Custom interactive visualization framework

## Decision Outcome

**Chosen option: "@xyflow/react (React Flow)"** because it provides native React integration with required interactivity features while maintaining development velocity within team expertise.

### Consequences

**Good:**

- Native React components with TypeScript support
- Built-in zoom, pan, drag interactions without custom implementation
- Export to PNG/PDF via html-to-image integration
- Extensive customization through React component patterns
- Strong community support and documentation
- Performance optimized for large graphs (virtualization, layout algorithms)

**Bad:**

- Larger bundle size (~45KB gzipped) vs Mermaid (~15KB)
- Learning curve for React Flow specific patterns
- Dependency on external library for core functionality

**Neutral:**

- Requires styling integration with Tailwind CSS design system
- Node/edge data modeling needed for SDLC domain concepts

## Pros and Cons of Options

### Mermaid (static)

- ✅ Lightweight bundle size (~15KB)
- ✅ Simple markup syntax
- ✅ Good for documentation generation
- ✅ Zero JavaScript required for basic diagrams
- ❌ No interactivity (zoom/pan limited)
- ❌ Limited customization of visual design
- ❌ No drag-and-drop for large workflow exploration
- ❌ Export quality limited

### @xyflow/react (React Flow) — chosen

- ✅ Full interactivity: zoom, pan, drag, selection
- ✅ Native React integration with hooks/components
- ✅ TypeScript support out of the box
- ✅ Built-in export capabilities
- ✅ Custom node/edge components with full styling control
- ✅ Performance optimized for complex graphs
- ✅ Active development and community
- ❌ Larger bundle impact (~45KB gzipped)
- ❌ React Flow specific learning curve

### D3.js (custom)

- ✅ Maximum flexibility and customization
- ✅ Smaller bundle (only include used features)
- ✅ Industry standard for complex visualizations
- ❌ Significant development time (3-4x React Flow)
- ❌ Team lacks D3.js expertise
- ❌ Custom interaction implementation required
- ❌ React integration complexity (DOM manipulation conflicts)
- ❌ Export functionality needs custom implementation

## Implementation Notes

- React Flow integrated with helper functions `n()` and `e()` for consistent node/edge styling
- Export functionality implemented via html-to-image + jsPDF for PDF generation
- Custom node types created for SDLC phases with role-based color coding
- Layout algorithms (dagre) used for automatic positioning of complex workflows

## Links

- [React Flow Documentation](https://reactflow.dev/)
- [Bundle analysis showing impact](../audits/bundle-analysis.md)
- [SDLC diagram requirements](../projects/sdlc-{{CLIENT_CODE}}/specs/components.md)
- [Related: ADR-0001 Context Loading Strategy](./ADR-0001-context-loading-strategy.md)
