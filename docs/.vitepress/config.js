import { defineConfig } from "vitepress";

export default defineConfig({
  title: "LIDR Docs",
  description: "Internal team documentation",

  // Ignore dead links during build (temporary - needs link cleanup)
  ignoreDeadLinks: true,

  // i18n configuration
  locales: {
    root: {
      label: "English",
      lang: "en",
      link: "/en/",
      title: "LIDR - Internal Documentation",
      description: "Team best practices and guides",

      themeConfig: {
        siteTitle: "LIDR Docs",

        nav: [
          { text: "Home", link: "/en/" },
          { text: "Guides", link: "/en/guides/" },
          { text: "References", link: "/en/references/" },
          { text: "Notes", link: "/en/notes/" },
          { text: "PRD", link: "/en/PRD/" },
        ],

        sidebar: {
          "/en/guides/": [
            {
              text: "Guides",
              items: [
                {
                  text: "MCP",
                  collapsed: false,
                  items: [
                    {
                      text: "Setup Guide",
                      link: "/en/guides/mcp/mcp-setup-guide",
                    },
                    {
                      text: "Antigravity Setup",
                      link: "/en/guides/mcp/ANTIGRAVITY_SETUP",
                    },
                  ],
                },
              ],
            },
          ],

          "/en/references/": [
            {
              text: "References",
              items: [
                {
                  text: "Agents",
                  collapsed: false,
                  items: [
                    {
                      text: "Agent Format Standard",
                      link: "/en/references/agents/AGENT_FORMAT_STANDARD",
                    },
                    {
                      text: "Platform Comparison",
                      link: "/en/references/agents/PLATFORM_COMPARISON",
                    },
                  ],
                },
                {
                  text: "MCP",
                  collapsed: false,
                  items: [
                    {
                      text: "MCP Cursor",
                      link: "/en/references/mcp/mcp-cursor",
                    },
                    {
                      text: "MCP Claude Code",
                      link: "/en/references/mcp/mcp-usage-claude-code",
                    },
                  ],
                },
              ],
            },
          ],

          "/en/PRD/": [
            {
              text: "Product Requirements Document",
              items: [
                {
                  text: "Overview",
                  link: "/en/PRD/",
                },
                {
                  text: "PRD Template",
                  link: "/en/PRD/template",
                },
                {
                  text: "Educational Content",
                  link: "/en/PRD/content",
                },
              ],
            },
          ],
        },

        search: {
          provider: "local",
          options: {
            locales: {
              en: {
                translations: {
                  button: {
                    buttonText: "Search",
                    buttonAriaLabel: "Search",
                  },
                  modal: {
                    noResultsText: "No results found",
                    resetButtonTitle: "Clear search",
                    footer: {
                      selectText: "Select",
                      navigateText: "Navigate",
                      closeText: "Close",
                    },
                  },
                },
              },
            },
          },
        },

        footer: {
          message: "LIDR Team Internal Documentation",
          copyright: "Copyright © 2026 LIDR",
        },

        editLink: {
          pattern: "https://github.com/LIDR-IT/ai-assisted-workflow/edit/main/docs/:path",
          text: "Edit this page on GitHub",
        },

        lastUpdated: {
          text: "Last updated",
        },

        socialLinks: [{ icon: "github", link: "https://github.com/LIDR-IT" }],
      },
    },
  },

  // Markdown config
  markdown: {
    lineNumbers: true,
  },
});
