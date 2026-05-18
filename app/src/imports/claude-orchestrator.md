Artefactos de IA Transversales — Estructura .claude/
Estos artefactos no pertenecen a una fase específica sino que son la infraestructura IA compartida por todo el equipo. CLAUDE.md los orquesta como índice central.

Rules
¿Quiénes somos?
Siempre cargadas
Skills
¿Qué sabemos hacer?
SKILL.md + ref/ + ex/ + scripts/
Commands
¿Cuándo "go"?
Orquestadores de acción
Agents
¿Quién autónomo?
Evolución de commands
Hooks
¿Qué ante evento?
Evalúan checklists docs/
MCPs
¿Dónde conectamos?
Cables a herramientas
docs/
¿Dónde está la verdad?
Fuente: checklists, signoffs
Código Artefacto Descripción Ubicación Rol Nivel
T-IA-CORE-001 CLAUDE.md — Orquestador Central Índice viviente del ecosistema: 148 artefactos (45 skills, 38 templates, 12 commands, 8 checklists, 6 agents, 5 rules, 3 MCPs, 4 hooks, 2 signoffs, 25 docs). Punto de entrada para toda la IA del equipo. Raíz proyecto Todos Orquestador
T-IA-CORE-002 Rules: Organización Estándares de la empresa: coding standards, políticas de seguridad, convenciones de naming, procesos obligatorios, cultura de ingeniería. .claude/rules/ Todos Nivel 1
T-IA-CORE-003 Rules: Tecnología Convenciones específicas del stack: React patterns, Node.js best practices, testing conventions, linting rules, estructura de proyecto. .claude/rules/ Dev Nivel 1
T-IA-CORE-004 Rules: Proyecto Contexto específico del proyecto: dominio de negocio, estructura de directorios, patrones arquitectónicos, APIs, convenciones propias. .claude/rules/ Dev Nivel 1
T-IA-CORE-005 Rules: Documentación Governance documental: frontmatter YAML obligatorio, staleness detection (TTL por tipo), naming conventions, estructura de skills. .claude/rules/ Todos Nivel 1
T-IA-CORE-006 Rules: Workflows Mapa de orquestación: qué rol ejecuta qué command, encadenamiento de skills + MCPs, flujos recomendados por fase SDLC. .claude/rules/ Todos Nivel 1
T-IA-CORE-007 MCP Config: Jira Conexión IA → Jira: lee tickets, crea subtareas, actualiza estados, adjunta documentos. El MCP más crítico para reducir cambios de contexto. .mcp.json Todos Nivel 2
T-IA-CORE-008 GitHub CLI Integration Conexión IA → GitHub via CLI: lee diffs, crea PRs con descripción, gestiona branches, lee PRs para release notes. scripts/ Dev Nivel 2
T-IA-CORE-009 MCP Config: Confluence Conexión IA → Confluence: lee documentación (PRDs, RFs), escribe release notes, publica reportes. .mcp.json Todos Nivel 2
T-IA-CORE-010 Xray CSV Integration Conexión IA → Xray via CSV export/import: escribe test cases generados, lee resultados de ejecución. scripts/ QA Nivel 2
T-IA-CORE-011 MCP Config: Slack Conexión IA → Slack: envía notificaciones de handoff, alertas de release, actualizaciones de estado. .mcp.json Todos Nivel 2
T-IA-CORE-012 Settings: Equipo Configuración compartida: modelo preferido, permisos, límites de autonomía de la IA, defaults. Commiteado al repo. .claude/settings.json Todos Config
T-IA-AGT-001 Agent: docs-agent Subagente autónomo event-driven transversal. Mantiene 8 fuentes de verdad sincronizadas, ejecuta 32 integrity tests (T1-T32), detecta y corrige drift entre archivos. Se activa al detectar cambios en docs/ o .claude/. Preloads: architecture-doc, implementation-phases. MCPs: Confluence, GitHub. Memoria persistente con drift recurrente y owners de docs. .claude/agents/ Todos Nivel 2
T-IA-AGT-002 Agent: onboarding-agent Subagente autónomo manual transversal. Guía a nuevos miembros del equipo con plan personalizado por rol (Dev, QA, PO, DevOps). Genera reading list, explica arquitectura, responde FAQ. Preloads: architecture-doc, implementation-phases. MCPs: Confluence, Slack. Memoria persistente con FAQ por rol y confusiones comunes. .claude/agents/ Nuevos miembros Nivel 2
