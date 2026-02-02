import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'LIDR Docs',
  description: 'Documentación interna del equipo',

  // Ignore dead links during build (temporary - needs link cleanup)
  ignoreDeadLinks: true,

  // i18n configuration
  locales: {
    es: {
      label: 'Español',
      lang: 'es',
      link: '/es/',
      title: 'LIDR - Documentación Interna',
      description: 'Best Practices y guías del equipo',

      themeConfig: {
        siteTitle: 'LIDR Docs',

        // Navegación en español
        nav: [
          { text: 'Inicio', link: '/es/' },
          { text: 'Módulos', link: '/es/modules/skills/' },
          { text: 'Guías', link: '/es/guides/' },
          { text: 'Referencias', link: '/es/references/' },
          { text: 'Guidelines', link: '/es/guidelines/' },
          { text: 'Notas', link: '/es/notes/' }
        ],

        // Sidebar en español
        sidebar: {
          '/es/modules/skills/': [
            {
              text: 'Módulo Skills',
              items: [
                {
                  text: '🎯 Fundamentos',
                  collapsed: false,
                  items: [
                    { text: '¿Qué son los Skills?', link: '/es/modules/skills/01-fundamentals/what-are-skills' },
                    { text: 'Arquitectura', link: '/es/modules/skills/01-fundamentals/architecture' },
                    { text: 'Anatomía de un Skill', link: '/es/modules/skills/01-fundamentals/skill-anatomy' }
                  ]
                },
                {
                  text: '📦 Usando Skills',
                  collapsed: false,
                  items: [
                    { text: 'Descubrimiento', link: '/es/modules/skills/02-using-skills/discovery' },
                    { text: 'Instalación', link: '/es/modules/skills/02-using-skills/installation' }
                  ]
                }
              ]
            }
          ],

          '/es/modules/mcp/': [
            {
              text: 'Módulo MCP',
              items: [
                { text: 'Introducción', link: '/es/modules/mcp/' },
                {
                  text: '🎯 Fundamentos',
                  collapsed: false,
                  items: [
                    { text: '¿Qué es MCP?', link: '/es/modules/mcp/01-fundamentals/what-is-mcp' },
                    { text: 'Arquitectura del Protocolo', link: '/es/modules/mcp/01-fundamentals/protocol-architecture' },
                    { text: 'Primitivos Principales', link: '/es/modules/mcp/01-fundamentals/core-primitives' },
                    { text: 'Ciclo de Vida', link: '/es/modules/mcp/01-fundamentals/lifecycle' }
                  ]
                },
                {
                  text: '📦 Usando MCP',
                  collapsed: false,
                  items: [
                    { text: 'Variables de Entorno', link: '/es/modules/mcp/02-using-mcp/environment-variables' }
                  ]
                },
                {
                  text: '🔧 Creando Servidores',
                  collapsed: false,
                  items: [
                    { text: 'Estructura del Proyecto', link: '/es/modules/mcp/03-creating-servers/project-structure' }
                  ]
                }
              ]
            }
          ],

          '/es/guides/': [
            {
              text: 'Guías',
              items: [
                {
                  text: 'MCP',
                  collapsed: false,
                  items: [
                    { text: 'Setup Guide', link: '/es/guides/mcp/mcp-setup-guide' },
                    { text: 'Antigravity Setup', link: '/es/guides/mcp/ANTIGRAVITY_SETUP' }
                  ]
                }
              ]
            }
          ],

          '/es/references/': [
            {
              text: 'Referencias',
              items: [
                {
                  text: 'Agents',
                  collapsed: false,
                  items: [
                    { text: 'Agent Format Standard', link: '/es/references/agents/AGENT_FORMAT_STANDARD' },
                    { text: 'Platform Comparison', link: '/es/references/agents/PLATFORM_COMPARISON' }
                  ]
                },
                {
                  text: 'MCP',
                  collapsed: false,
                  items: [
                    { text: 'MCP Cursor', link: '/es/references/mcp/mcp-cursor' },
                    { text: 'MCP Claude Code', link: '/es/references/mcp/mcp-usage-claude-code' }
                  ]
                }
              ]
            }
          ]
        },

        // Búsqueda en español
        search: {
          provider: 'local',
          options: {
            locales: {
              es: {
                translations: {
                  button: {
                    buttonText: 'Buscar',
                    buttonAriaLabel: 'Buscar'
                  },
                  modal: {
                    noResultsText: 'No se encontraron resultados',
                    resetButtonTitle: 'Limpiar búsqueda',
                    footer: {
                      selectText: 'Seleccionar',
                      navigateText: 'Navegar',
                      closeText: 'Cerrar'
                    }
                  }
                }
              }
            }
          }
        },

        footer: {
          message: 'Documentación interna del equipo LIDR',
          copyright: 'Copyright © 2026 LIDR'
        },

        editLink: {
          pattern: 'https://github.com/LIDR-IT/ai-assisted-workflow/edit/main/docs/:path',
          text: 'Editar esta página en GitHub'
        },

        lastUpdated: {
          text: 'Última actualización'
        },

        socialLinks: [
          { icon: 'github', link: 'https://github.com/LIDR-IT' }
        ],

        // Mensajes UI en español
        outlineTitle: 'En esta página',
        returnToTopLabel: 'Volver arriba',
        sidebarMenuLabel: 'Menú',
        darkModeSwitchLabel: 'Tema'
      }
    },

    en: {
      label: 'English',
      lang: 'en',
      link: '/en/',
      title: 'LIDR - Internal Documentation',
      description: 'Team best practices and guides',

      themeConfig: {
        siteTitle: 'LIDR Docs',

        // English navigation
        nav: [
          { text: 'Home', link: '/en/' },
          { text: 'Modules', link: '/en/modules/skills/' },
          { text: 'Guides', link: '/en/guides/' },
          { text: 'References', link: '/en/references/' },
          { text: 'Guidelines', link: '/en/guidelines/' },
          { text: 'Notes', link: '/en/notes/' }
        ],

        // English sidebar
        sidebar: {
          '/en/modules/skills/': [
            {
              text: 'Skills Module',
              items: [
                {
                  text: '🎯 Fundamentals',
                  collapsed: false,
                  items: [
                    { text: 'What Are Skills?', link: '/en/modules/skills/01-fundamentals/what-are-skills' },
                    { text: 'Architecture', link: '/en/modules/skills/01-fundamentals/architecture' },
                    { text: 'Skill Anatomy', link: '/en/modules/skills/01-fundamentals/skill-anatomy' }
                  ]
                },
                {
                  text: '📦 Using Skills',
                  collapsed: false,
                  items: [
                    { text: 'Discovery', link: '/en/modules/skills/02-using-skills/discovery' },
                    { text: 'Installation', link: '/en/modules/skills/02-using-skills/installation' }
                  ]
                }
              ]
            }
          ],

          '/en/modules/mcp/': [
            {
              text: 'MCP Module',
              items: [
                { text: 'Introduction', link: '/en/modules/mcp/' },
                {
                  text: '🎯 Fundamentals',
                  collapsed: false,
                  items: [
                    { text: 'What is MCP?', link: '/en/modules/mcp/01-fundamentals/what-is-mcp' },
                    { text: 'Protocol Architecture', link: '/en/modules/mcp/01-fundamentals/protocol-architecture' },
                    { text: 'Core Primitives', link: '/en/modules/mcp/01-fundamentals/core-primitives' },
                    { text: 'Lifecycle', link: '/en/modules/mcp/01-fundamentals/lifecycle' }
                  ]
                },
                {
                  text: '📦 Using MCP',
                  collapsed: false,
                  items: [
                    { text: 'Environment Variables', link: '/en/modules/mcp/02-using-mcp/environment-variables' }
                  ]
                },
                {
                  text: '🔧 Creating Servers',
                  collapsed: false,
                  items: [
                    { text: 'Project Structure', link: '/en/modules/mcp/03-creating-servers/project-structure' }
                  ]
                }
              ]
            }
          ],

          '/en/guides/': [
            {
              text: 'Guides',
              items: [
                {
                  text: 'MCP',
                  collapsed: false,
                  items: [
                    { text: 'Setup Guide', link: '/en/guides/mcp/mcp-setup-guide' },
                    { text: 'Antigravity Setup', link: '/en/guides/mcp/ANTIGRAVITY_SETUP' }
                  ]
                }
              ]
            }
          ],

          '/en/references/': [
            {
              text: 'References',
              items: [
                {
                  text: 'Agents',
                  collapsed: false,
                  items: [
                    { text: 'Agent Format Standard', link: '/en/references/agents/AGENT_FORMAT_STANDARD' },
                    { text: 'Platform Comparison', link: '/en/references/agents/PLATFORM_COMPARISON' }
                  ]
                },
                {
                  text: 'MCP',
                  collapsed: false,
                  items: [
                    { text: 'MCP Cursor', link: '/en/references/mcp/mcp-cursor' },
                    { text: 'MCP Claude Code', link: '/en/references/mcp/mcp-usage-claude-code' }
                  ]
                }
              ]
            }
          ]
        },

        // English search
        search: {
          provider: 'local',
          options: {
            locales: {
              en: {
                translations: {
                  button: {
                    buttonText: 'Search',
                    buttonAriaLabel: 'Search'
                  },
                  modal: {
                    noResultsText: 'No results found',
                    resetButtonTitle: 'Clear search',
                    footer: {
                      selectText: 'Select',
                      navigateText: 'Navigate',
                      closeText: 'Close'
                    }
                  }
                }
              }
            }
          }
        },

        footer: {
          message: 'LIDR Team Internal Documentation',
          copyright: 'Copyright © 2026 LIDR'
        },

        editLink: {
          pattern: 'https://github.com/LIDR-IT/ai-assisted-workflow/edit/main/docs/:path',
          text: 'Edit this page on GitHub'
        },

        lastUpdated: {
          text: 'Last updated'
        },

        socialLinks: [
          { icon: 'github', link: 'https://github.com/LIDR-IT' }
        ]
      }
    }
  },

  // Markdown config
  markdown: {
    lineNumbers: true
  }
})
