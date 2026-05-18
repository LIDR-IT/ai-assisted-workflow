/**
 * Handoff Utilities
 *
 * Utility functions for handoffs and templates components.
 * Extracted from HandoffsTemplates.tsx for better maintainability.
 */

/**
 * Helper function to dynamically replace tool names and content in templates
 */
export const replaceToolNames = (
  content: string,
  trackingTool: string,
  testingTool: string,
  docTool: string,
  clientName?: string
): string => {
  return (
    content
      // Tool replacements
      .replace(/\bJira\b/g, trackingTool)
      .replace(/\bTestRail\b/g, testingTool)
      .replace(/\bConfluence\b/g, docTool)
      .replace(/\bXray\/TestRail\b/g, clientName === 'Docline' ? 'Cucumber' : `Xray/${testingTool}`)
      // Contextual tool phrases
      .replace(/\ben TestRail\b/g, `en ${testingTool}`)
      .replace(/\bvía TestRail\b/g, `vía ${testingTool}`)
      .replace(/\bdesde TestRail\b/g, `desde ${testingTool}`)
      .replace(/\ben Jira\b/g, `en ${trackingTool}`)
      .replace(/\bvía Jira\b/g, `vía ${trackingTool}`)
      .replace(/\bdesde Jira\b/g, `desde ${trackingTool}`)
      .replace(/\ben Confluence\b/g, `en ${docTool}`)
      .replace(/\bvía Confluence\b/g, `vía ${docTool}`)
      .replace(/\bdesde Confluence\b/g, `desde ${docTool}`)
      // Format specific replacements
      .replace(/\bTestRail\/Confluence\b/g, `${testingTool}/${docTool}`)
      // Remove "primera vez" claims for Docline
      .replace(
        /primera implementación formal del SDLC/g,
        clientName === 'Docline'
          ? 'implementación del SDLC'
          : 'primera implementación formal del SDLC'
      )
      .replace(
        /primer proyecto piloto/g,
        clientName === 'Docline' ? 'proyecto de mejora' : 'primer proyecto piloto'
      )
  );
};
