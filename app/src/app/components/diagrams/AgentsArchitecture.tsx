import { Shield, TestTube2, Rocket, FileText, Users, BarChart3 } from 'lucide-react';
import { AgentsArchitectureView } from './AgentsArchitectureView';
import { ecosystemStats } from '@/data';
import { useCurrentClient } from '@/hooks/useClientRegistry';
import type { ClientConfig } from '@/data/schemas/client-schema';

/* ═══════════════════════════════════════════
   AGENT DEFINITIONS
   ═══════════════════════════════════════════ */
interface AgentSkill {
  name: string;
  phase: string;
}

interface AgentTemplate {
  code: string;
  name: string;
  role: 'consume' | 'produce';
}

export interface AgentDefinition {
  id: string;
  name: string;
  whenToUse: string;
  agentColor: 'blue' | 'cyan' | 'green' | 'yellow' | 'magenta' | 'red';
  preloadedSkills: string[];
  description: string;
  evolvedFrom: string;
  trigger: string;
  triggerType: 'manual' | 'event-driven' | 'scheduled';
  tools: string[];
  mcps: string[];
  skills: AgentSkill[];
  chainSteps: string[];
  templates: AgentTemplate[];
  memoryInstructions: string;
  agentInstructions: string;
  cannotDo: string[];
  handoffImpact: string;
  color: string;
  icon: React.ReactNode;
  badgeColor: string;
}

// Dynamic agent generation based on current client
function getAgentsForClient(client: ClientConfig): AgentDefinition[] {
  // Dynamic tools based on client configuration
  const trackingTool =
    client?.domainTerms?.tracking_tool || (client?.name === 'Docline' ? 'Linear' : 'Jira');
  const testingTool =
    client?.domainTerms?.testing_tool || (client?.name === 'Docline' ? 'Cucumber' : 'TestRail');
  const docTool =
    client?.domainTerms?.doc_system ||
    (client?.name === 'Docline' ? 'Sistema de documentación' : 'Confluence');

  return [
    {
      id: 'qa-agent',
      name: 'qa-agent',
      whenToUse: `Use this agent when a ${trackingTool} ticket transitions to "Ready for QA" and needs a complete testing suite, or when QA explicitly requests test case generation for a ticket.\n<example>QA Lead runs: prepare testing for SDLC-456 -- qa-agent reads ticket + diff, generates test plan + BDD cases, writes to ${testingTool === 'Cucumber' ? 'test files' : 'Xray'}.</example>`,
      agentColor: 'green',
      preloadedSkills: [
        'test-plan',
        'create-test-cases',
        'regression-suite',
        'bug-report',
        'test-execution-report',
        'dev-handoff-qa',
      ],
      description:
        'Prepara suite de testing completa cuando un ticket llega a "Ready for QA". Evoluciona /prepare-testing a ejecucion autonoma.',
      evolvedFrom: '/prepare-testing',
      trigger: 'QA Lead invoca via CLI cuando ticket pasa a "Ready for QA"',
      triggerType: 'event-driven',
      tools: ['Read', 'Grep', 'Glob', 'Bash'],
      mcps: [
        `${trackingTool} MCP`,
        'GitHub CLI',
        testingTool === 'Cucumber' ? 'Cucumber files' : 'Xray CSV',
      ],
      skills: [
        { name: 'test-plan', phase: 'F6' },
        { name: 'create-test-cases', phase: 'F6' },
        { name: 'regression-suite', phase: 'F6' },
        { name: 'bug-report', phase: 'F6' },
        { name: 'test-execution-report', phase: 'F6' },
        { name: 'dev-handoff-qa', phase: 'F5' },
      ],
      chainSteps: [
        'GUARD: Verifica que ticket.AC contenga >=1 Given/When/Then. Si no -> ABORT: "RF-XXX sin BDD -- Gate 2 incompleto"',
        `Lee ticket via ${trackingTool} MCP (titulo, descripcion, criterios BDD)`,
        'Lee diff/PR via GitHub CLI (cambios de codigo)',
        'GUARD: Verifica existencia handoff dev->QA. Si no existe -> WARNING + flag coverage_confidence: LOW',
        'Lee handoff dev->QA adjunto al ticket',
        'Genera test plan con skill test-plan',
        'Genera test cases BDD con skill create-test-cases',
        'VALIDATE: Cada test case cumple schema T-QA-002 (ID, Given, When, Then, Priority, RF-link)',
        'Aplica regression-suite para seleccionar tests de regresion',
        `Escribe test cases en ${testingTool} ${testingTool === 'Cucumber' ? 'via archivos .feature' : 'via Xray CSV'}`,
        'Retorna resumen: N test cases creados, cobertura, gaps detectados, coverage_confidence',
      ],
      templates: [
        { code: 'T-QA-001', name: 'Test Plan Template', role: 'produce' },
        { code: 'T-QA-002', name: 'Test Case Template (BDD)', role: 'produce' },
        { code: 'T-QA-006', name: 'Regression Test Suite', role: 'produce' },
        { code: 'T-IA-DEV-003', name: 'Handoff Dev->QA', role: 'consume' },
      ],
      memoryInstructions:
        'Registra patrones de testing por tipo de feature (API, UI, integracion). Acumula edge cases descubiertos. Guarda metricas de cobertura por sprint. Anota bugs recurrentes y areas de codigo fragil para priorizar regresion.',
      agentInstructions: [
        `You are an expert QA engineer specializing in creating comprehensive BDD test suites for the ${client.name} SDLC ecosystem.`,
        '',
        '**Your Core Responsibilities:**',
        '1. Generate complete test plans from ticket context and code diffs',
        '2. Create BDD test cases (Given/When/Then) covering happy paths, edge cases, and error scenarios',
        '3. Select regression tests by analyzing code change impact',
        `4. Write test cases to ${testingTool} ${testingTool === 'Cucumber' ? 'via .feature files' : 'via Xray CSV'}`,
        '5. Identify coverage gaps and flag them explicitly',
        '',
        '**Test Generation Process:**',
        '1. Consult Memory: Check agent memory for testing patterns, recurring bugs, and fragile code areas',
        `2. Gather Context: Read ticket via ${trackingTool} MCP (title, description, BDD acceptance criteria)`,
        '3. Analyze Changes: Read PR diff via GitHub CLI to understand code changes',
        '4. Read Handoff: Parse dev->QA handoff document attached to ticket',
        '5. Generate Test Plan: Using preloaded test-plan skill, create plan covering happy paths, edge cases, error scenarios, regression scope',
        '6. Create Test Cases: Using preloaded create-test-cases skill, generate BDD scenarios',
        '7. Select Regression: Using preloaded regression-suite skill, identify impacted existing tests',
        `8. Write to ${testingTool}: Publish all test cases ${testingTool === 'Cucumber' ? 'as .feature files' : 'via Xray CSV'}`,
        '9. Update Memory: Save patterns, edge cases discovered, coverage metrics',
        '',
        '**Boundaries -- NEVER:**',
        '- Sign QA sign-off (so-qa) -- exclusive responsibility of human QA Lead',
        '- Modify source code -- you are read-only on the repository',
        '- Make go/no-go decisions -- only flag, never decide',
        '- Execute tests -- only generate them',
      ].join('\n'),
      cannotDo: [
        'Firmar QA sign-off (so-qa) -- solo QA Lead humano',
        'Modificar codigo fuente',
        'Ejecutar tests (solo los genera)',
        'Tomar decisiones go/no-go',
      ],
      handoffImpact:
        'Automatiza la preparacion del Handoff 5->6 (Dev->QA). El QA Lead recibe suite lista para revision en lugar de empezar desde cero.',
      color: 'bg-sky-50',
      icon: <TestTube2 size={20} className="text-sky-600" />,
      badgeColor: 'bg-sky-100 text-sky-700',
    },
    {
      id: 'release-agent',
      name: 'release-agent',
      whenToUse: `Use this agent when code is merged to main, a release branch is created, or when preparing release documentation for deployment.\n<example>PME runs: create release notes for v2.1.0 -- release-agent reads merged PRs, generates changelog + CR + rollback plan, publishes to ${docTool}.</example>`,
      agentColor: 'cyan',
      preloadedSkills: ['release-notes', 'change-request', 'rollback-plan', 'retrospective'],
      description:
        'Genera release notes, changelog y prepara Change Request cuando se mergea a main o se crea release branch.',
      evolvedFrom: '/create-release-notes + /update-changelog',
      trigger: 'PME invoca via CLI cuando se mergea a main o se crea release branch',
      triggerType: 'event-driven',
      tools: ['Read', 'Grep', 'Glob', 'Bash'],
      mcps: [
        'GitHub CLI',
        `${docTool === 'Sistema de documentación' ? 'Documentation System' : 'Confluence MCP'}`,
        'Slack MCP',
      ],
      skills: [
        { name: 'release-notes', phase: 'F8' },
        { name: 'change-request', phase: 'F8' },
        { name: 'rollback-plan', phase: 'F8' },
        { name: 'retrospective', phase: 'F8' },
      ],
      chainSteps: [
        `GUARD: Verifica via ${trackingTool} MCP que Gate 6 (Security Sign-off) status = PASS para la version target. Si no -> ABORT: "seguridad no firmada"`,
        'Lee PRs mergeados via GitHub CLI (desde ultimo tag)',
        'Agrupa cambios: features, fixes, breaking changes',
        'Genera changelog a 2 niveles (negocio + tecnico) con skill release-notes',
        'Pre-llena Change Request con skill change-request',
        'VALIDATE: CR cumple schema T-DEP-001 (impact_assessment != vacio, deployment_window != vacio, rollback_plan_ref != null)',
        'Genera rollback plan con skill rollback-plan',
        `Publica draft en ${docTool} via ${docTool === 'Sistema de documentación' ? 'Documentation System' : 'Confluence MCP'}`,
        'Notifica canal de releases en Slack via Slack MCP',
        'Retorna resumen: version, cambios, CR pendiente de aprobacion',
      ],
      templates: [
        { code: 'T-DEP-001', name: 'Change Request Template', role: 'produce' },
        { code: 'T-DEP-002', name: 'Rollback Plan Template', role: 'produce' },
        { code: 'T-DEP-003', name: 'Release Notes Template', role: 'produce' },
      ],
      memoryInstructions:
        'Registra patrones de releases: frecuencia, tamano promedio, tipos de cambio mas comunes. Guarda formato de changelog preferido por el equipo. Anota incidentes post-deploy y sus rollback plans para reutilizar.',
      agentInstructions: [
        `You are an expert release engineer specializing in preparing comprehensive release documentation for the ${client.name} SDLC ecosystem.`,
        '',
        '**Your Core Responsibilities:**',
        '1. Generate dual-level changelog (business + technical) from merged PRs',
        '2. Pre-fill Change Request for Change Advisory Board',
        '3. Create specific rollback plan for each release',
        `4. Publish documentation to ${docTool} and notify via Slack`,
        '',
        '**Boundaries -- NEVER:**',
        '- Approve Change Request -- exclusive responsibility of Change Advisory Board',
        '- Deploy to production -- only prepare documentation',
        '- Modify source code or tags',
        '- Sign any signoff',
      ].join('\n'),
      cannotDo: [
        'Aprobar Change Request -- solo Comite de Cambios',
        'Ejecutar deploy a produccion',
        'Modificar codigo fuente',
        'Firmar ningun signoff',
      ],
      handoffImpact:
        'Automatiza la preparacion del Handoff 7->8 (Seguridad->Despliegue). El PME recibe documentacion de release lista para revision del Comite.',
      color: 'bg-emerald-50',
      icon: <Rocket size={20} className="text-emerald-600" />,
      badgeColor: 'bg-emerald-100 text-emerald-700',
    },
    {
      id: 'security-agent',
      name: 'security-agent',
      whenToUse: `Use this agent when SAST/SCA/DAST scan results are available, when a PR touches security-critical code (auth, crypto, sensitive data), or when preparing for security review (Gate 6).\n<example>Sec Lead runs: review security for SDLC-789 -- security-agent interprets SAST results, triages vulns, generates remediation subtasks in ${trackingTool}.</example>`,
      agentColor: 'red',
      preloadedSkills: [
        'vuln-assessment',
        'dast-interpretation',
        'pentest-report',
        'security-checklist',
      ],
      description:
        'Interpreta resultados de scanners de seguridad, prioriza hallazgos y sugiere remediaciones. Se activa cuando hay resultados SAST/DAST nuevos.',
      evolvedFrom: 'security skills (vuln-assessment + dast-interpretation + security-checklist)',
      trigger: 'Sec Lead invoca via CLI cuando hay resultados de scan SAST/SCA/DAST',
      triggerType: 'event-driven',
      tools: ['Read', 'Grep', 'Glob', 'Bash'],
      mcps: [
        `${trackingTool} MCP`,
        'GitHub CLI',
        `${docTool === 'Sistema de documentación' ? 'Documentation System' : 'Confluence MCP'}`,
      ],
      skills: [
        { name: 'vuln-assessment', phase: 'F7' },
        { name: 'dast-interpretation', phase: 'F7' },
        { name: 'pentest-report', phase: 'F7' },
        { name: 'security-checklist', phase: 'F7' },
      ],
      chainSteps: [
        'GUARD: Verifica que scan.commit_sha coincide con HEAD del branch target. Si no -> WARN: "resultados potencialmente desactualizados"',
        'Lee resultados de scanner (SAST/SCA o DAST) del CI/CD',
        'GUARD: Verifica que exclusiones del scanner no cubren paths de produccion (src/, api/, lib/). Calcula scan_coverage',
        'Interpreta hallazgos con skill vuln-assessment o dast-interpretation',
        'Prioriza por impacto real (OWASP Top 10 mapping)',
        'Genera sugerencias de fix con codigo cuando es posible',
        `Crea tickets de remediacion en ${trackingTool} via ${trackingTool} MCP`,
        'GUARD: Si hallazgos > 50 -> notificar Slack MCP #security con escalacion automatica',
        'Evalua security-checklist pre-deploy',
        'VALIDATE: Reporte cumple schema T-SEC-001 (CWE ref, OWASP mapping, severity, remediation)',
        `Publica reporte en ${docTool} via ${docTool === 'Sistema de documentación' ? 'Documentation System' : 'Confluence MCP'}`,
        'Retorna resumen: criticas/altas/medias/bajas, tickets creados, bloqueante si/no, scan_coverage %',
      ],
      templates: [
        { code: 'T-SEC-001', name: 'Vulnerability Assessment Report', role: 'produce' },
        { code: 'T-SEC-002', name: 'DAST Scan Report', role: 'produce' },
        { code: 'T-SEC-005', name: 'Security Compliance Checklist', role: 'produce' },
      ],
      memoryInstructions:
        'Registra vulnerabilidades recurrentes por tipo (XSS, SQLi, IDOR, etc.). Guarda patrones de remediacion exitosos. Acumula conocimiento de la arquitectura de seguridad del proyecto. Anota falsos positivos confirmados para reducir ruido en futuras ejecuciones.',
      agentInstructions: [
        `You are an expert security analyst specializing in identifying and triaging vulnerabilities for the ${client.name} SDLC ecosystem.`,
        '',
        `**CRITICAL CONTEXT:** ${client.name} processes sensitive data requiring high security standards. Security is non-negotiable.`,
        '',
        '**Your Core Responsibilities:**',
        '1. Interpret SAST/SCA/DAST scan results and prioritize by real impact',
        '2. Filter known false positives from agent memory',
        '3. Generate remediation suggestions with code examples when possible',
        `4. Create remediation tickets in ${trackingTool} for critical/high findings`,
        '5. Evaluate OWASP security checklist pre-deploy',
        '',
        '**Boundaries -- NEVER:**',
        '- Sign security sign-off (so-security) -- exclusive responsibility of human Sec Lead',
        '- Ignore Critical or High vulnerabilities -- always flag them',
        '- Log PII/sensitive data in reports -- redact all confidential information',
        '- Accept residual risk -- that is a business decision for Sponsor/PME',
      ].join('\n'),
      cannotDo: [
        'Firmar security sign-off (so-security) -- solo Sec Lead',
        'Ejecutar pen testing manual',
        'Tomar decision de riesgo residual aceptado',
        'Modificar reglas de scanner',
      ],
      handoffImpact:
        'Acelera la Fase 7 (Seguridad). Reduce tiempo de triaje de vulnerabilidades. El Sec Lead recibe hallazgos ya priorizados y con sugerencias de fix.',
      color: 'bg-red-50',
      icon: <Shield size={20} className="text-red-600" />,
      badgeColor: 'bg-red-100 text-red-700',
    },
    {
      id: 'onboarding-agent',
      name: 'onboarding-agent',
      whenToUse:
        'Use this agent when a new team member joins, when someone needs guidance navigating the SDLC ecosystem, or when creating a personalized onboarding plan by role.\n<example>TL runs: onboard new QA engineer Maria -- onboarding-agent generates role-specific plan with skills, tools, and first-week tasks.</example>',
      agentColor: 'magenta',
      preloadedSkills: ['architecture-doc', 'implementation-phases'],
      description:
        'Guia a nuevos miembros del equipo por el ecosistema SDLC. Responde preguntas, sugiere lecturas y crea plan de onboarding personalizado.',
      evolvedFrom: '/help (Tier 3 utility command)',
      trigger: 'TL/PO invoca via CLI cuando un nuevo miembro se une o necesita guia',
      triggerType: 'manual',
      tools: ['Read', 'Grep', 'Glob'],
      mcps: [
        `${docTool === 'Sistema de documentación' ? 'Documentation System' : 'Confluence MCP'}`,
        'Slack MCP',
      ],
      skills: [
        { name: 'architecture-doc', phase: 'Cross' },
        { name: 'implementation-phases', phase: 'Cross' },
      ],
      chainSteps: [
        'Identifica el rol del nuevo miembro (Dev, QA, TL, PO, PME, Sec, DevOps)',
        'Genera plan de onboarding personalizado por rol',
        'Presenta los artefactos relevantes del ecosistema (rules, skills, commands)',
        'Explica los workflows que le aplican (de workflows.md)',
        'Muestra los quality gates en los que participa',
        'GUARD: Valida existencia de cada doc path referenciado via Glob antes de incluirlo en el plan',
        'Sugiere lecturas prioritarias de docs/',
        `Publica plan en ${docTool} via ${docTool === 'Sistema de documentación' ? 'Documentation System' : 'Confluence MCP'}`,
        'Retorna resumen: plan de onboarding + lecturas sugeridas + FAQ del rol',
      ],
      templates: [{ code: 'T-ORI-002', name: 'Acta de Kick-off', role: 'consume' }],
      memoryInstructions:
        'Acumula preguntas frecuentes por rol (Dev, QA, TL, etc.). Registra confusiones comunes de nuevos miembros. Guarda feedback sobre que lecturas fueron mas utiles. Anota atajos y tips que descubren los nuevos miembros.',
      agentInstructions: [
        `You are an expert onboarding facilitator specializing in guiding new team members through the ${client.name} SDLC ecosystem.`,
        '',
        '**Your Core Responsibilities:**',
        '1. Create personalized onboarding plans based on team member role',
        '2. Present the ecosystem progressively (do not overwhelm)',
        '3. Answer questions with references to specific documents (with paths)',
        '4. Accumulate FAQ and common confusions in agent memory',
        '',
        '**Boundaries -- NEVER:**',
        '- Grant access to repositories or tools -- that is TL/Admin responsibility',
        '- Modify any ecosystem files',
        '- Approve onboarding completion',
        '- Access production data',
      ].join('\n'),
      cannotDo: [
        'Otorgar acceso a repositorios o herramientas',
        'Modificar archivos del ecosistema',
        'Aprobar onboarding completado',
        'Acceder a datos de produccion',
      ],
      handoffImpact:
        'Transversal. Reduce el tiempo de onboarding de nuevos miembros de semanas a dias. Cada nuevo miembro recibe un plan personalizado por rol.',
      color: 'bg-purple-50',
      icon: <Users size={20} className="text-purple-600" />,
      badgeColor: 'bg-purple-100 text-purple-700',
    },
    {
      id: 'docs-agent',
      name: 'docs-agent',
      whenToUse:
        'Use this agent when documentation may be out of sync, after merging to develop, at end of session, or when integrity tests need to be run.\n<example>TL runs: sync docs after sprint -- docs-agent detects stale files, updates cross-references, runs 32 integrity tests.</example>',
      agentColor: 'blue',
      preloadedSkills: ['architecture-doc', 'implementation-phases'],
      description:
        'Mantiene documentacion sincronizada entre las 8 fuentes de verdad. Detecta drift, propone correcciones y actualiza docs automaticamente.',
      evolvedFrom: '/sync-docs + dtc-session-check hook',
      trigger: 'Dev/TL invoca via CLI al finalizar sesion o tras merge a develop',
      triggerType: 'event-driven',
      tools: ['Read', 'Write', 'Edit', 'Grep', 'Glob', 'Bash'],
      mcps: [
        `${docTool === 'Sistema de documentación' ? 'Documentation System' : 'Confluence MCP'}`,
        'GitHub CLI',
      ],
      skills: [
        { name: 'architecture-doc', phase: 'Cross' },
        { name: 'implementation-phases', phase: 'Cross' },
      ],
      chainSteps: [
        'GUARD: Validar integridad de CLAUDE.md -- checksum + version + frontmatter valido. Si corrupto -> ABORT: "fuente raiz comprometida"',
        'Ejecuta los 32 integrity tests (T1-T32) para detectar drift',
        'Identifica documentos desincronizados entre las 8 fuentes de verdad',
        'Clasifica drift: critico (bloquea gates) vs menor (cosmetico)',
        'Propone correcciones con diff concreto',
        'VALIDATE: Cada auto-fix genera before/after diff Y valida resultado contra template del documento',
        'Si es drift menor y tiene confianza alta, aplica correccion',
        'Si es drift critico, crea issue en GitHub y notifica al owner',
        `Sincroniza ${docTool} con repo via ${docTool === 'Sistema de documentación' ? 'Documentation System' : 'Confluence MCP'}`,
        'Retorna resumen: N tests passed, N drifts detectados, N corregidos automaticamente',
      ],
      templates: [],
      memoryInstructions:
        'Registra patrones de drift recurrente (que fuentes se desincronizan mas). Guarda decisiones de resolucion de conflictos. Acumula conocimiento de quien es owner de cada documento. Anota que integrity tests fallan mas frecuentemente.',
      agentInstructions: [
        `You are an expert documentation governance specialist ensuring coherence across the 8 sources of truth in the ${client.name} SDLC ecosystem.`,
        '',
        '**The 8 Sources of Truth:**',
        '1. CLAUDE.md (central index)',
        '2. rules/ (5 rules)',
        `3. skills/ (${ecosystemStats.skills} skills)`,
        `4. commands/ (${ecosystemStats.commands} commands)`,
        '5. hooks/ (4 hooks)',
        '6. docs/ (checklists, signoffs, templates, standards)',
        '7. mcp.json (MCP configuration)',
        '8. settings.json (team configuration)',
        '',
        '**Boundaries -- NEVER:**',
        '- Modify rules/ or skills/ without Tech Lead approval',
        '- Delete documents -- only update or propose deletion',
        '- Change settings.json or mcp.json without explicit request',
        '- Auto-fix critical drift -- always escalate',
      ].join('\n'),
      cannotDo: [
        'Modificar rules o skills sin aprobacion TL',
        'Eliminar documentos del ecosistema',
        'Cambiar la estructura de fuentes de verdad',
        'Modificar settings.json o mcp.json',
      ],
      handoffImpact: `Transversal. Reemplaza la verificacion manual de coherencia. Garantiza que los ${ecosystemStats.totalArtifacts} artefactos estan sincronizados continuamente.`,
      color: 'bg-indigo-50',
      icon: <FileText size={20} className="text-indigo-600" />,
      badgeColor: 'bg-indigo-100 text-indigo-700',
    },
    {
      id: 'metrics-agent',
      name: 'metrics-agent',
      whenToUse: `Use this agent when a sprint closes, when preparing a retrospective, or when on-demand metrics are needed for decision-making.\n<example>PME runs: generate sprint 14 metrics -- metrics-agent pulls velocity + carryover from ${trackingTool}, lead time from GitHub, computes DORA metrics.</example>`,
      agentColor: 'yellow',
      preloadedSkills: ['retrospective', 'sprint-capacity'],
      description: `Recopila metricas de ${trackingTool} y GitHub para generar dashboards de sprint y DORA. Se activa al cierre de sprint o bajo demanda.`,
      evolvedFrom: 'retrospective skill + sprint-capacity skill',
      trigger: 'Tech Lead invoca via CLI al cierre de sprint o bajo demanda',
      triggerType: 'scheduled',
      tools: ['Read', 'Grep', 'Glob', 'Bash'],
      mcps: [`${trackingTool} MCP`, 'GitHub CLI'],
      skills: [
        { name: 'retrospective', phase: 'F8' },
        { name: 'sprint-capacity', phase: 'F4' },
      ],
      chainSteps: [
        `Lee datos del sprint actual de ${trackingTool} MCP (velocity, carryover, bugs)`,
        `GUARD: Si ${trackingTool} MCP no devuelve datos -> distinguir velocity=0 (real) vs velocity=null (no disponible). Campo data_quality: complete|partial|unavailable`,
        'Lee datos de GitHub CLI (PRs merged, review time, CI pipeline)',
        'Calcula metricas Sprint: velocity, carryover %, scope change, bug ratio',
        'Calcula metricas DORA: lead time, deploy frequency, MTTR, change failure rate',
        'Genera informe de retrospectiva data-driven con skill retrospective',
        'VALIDATE: Output cumple schema T-DEP-005 para garantizar consistencia entre sprints',
        'Compara con sprints anteriores (tendencias)',
        'Retorna resumen: metricas clave + tendencias + areas de atencion + data_quality',
      ],
      templates: [
        { code: 'T-DEP-005', name: 'Retrospectiva Data-Driven', role: 'produce' },
        { code: 'T-SPR-003', name: 'Sprint Capacity Template', role: 'consume' },
      ],
      memoryInstructions:
        'Acumula metricas historicas sprint a sprint para calcular tendencias. Registra que metricas generaron mas discusion en retrospectivas. Guarda baselines del equipo para comparar. Anota correlaciones descubiertas (ej: mas carryover = mas bugs).',
      agentInstructions: [
        `You are an expert engineering metrics analyst specializing in Sprint and DORA metrics for the ${client.name} SDLC ecosystem.`,
        '',
        '**Your Core Responsibilities:**',
        `1. Extract Sprint metrics from ${trackingTool} (velocity, carryover, bugs, estimations)`,
        '2. Extract DORA metrics from GitHub (lead time, deploy frequency, MTTR, change failure rate)',
        '3. Calculate trends by comparing with historical data from agent memory',
        '4. Generate data-driven retrospective report using preloaded retrospective skill',
        '5. Present metrics objectively -- we are blameless',
        '',
        '**Boundaries -- NEVER:**',
        `- Modify tickets in ${trackingTool} or data in GitHub`,
        '- Make planning decisions based on metrics',
        '- Assign individual blame for metrics',
        '- Invent data when insufficient -- always indicate gaps',
        '- Present numbers without trend context',
      ].join('\n'),
      cannotDo: [
        `Modificar tickets en ${trackingTool}`,
        'Tomar decisiones de planificacion',
        'Asignar culpa individual por metricas',
        'Inventar datos cuando no hay suficientes',
      ],
      handoffImpact:
        'Alimenta la Retrospectiva (F8) con datos objetivos. El Scrum Master recibe metricas listas para discusion en lugar de recopilarlas manualmente.',
      color: 'bg-amber-50',
      icon: <BarChart3 size={20} className="text-amber-600" />,
      badgeColor: 'bg-amber-100 text-amber-700',
    },
  ];
}

// Export a static version for backwards compatibility
// Static list of the 6 actual agents that exist in .claude/agents/
export const AGENTS: AgentDefinition[] = [
  {
    id: 'qa-agent',
    name: 'qa-agent',
    whenToUse: 'Use this agent when a ticket transitions to "Ready for QA"',
    agentColor: 'green',
    preloadedSkills: ['test-plan', 'create-test-cases', 'regression-suite', 'bug-report'],
    description: 'Automated QA testing suite generation',
    evolvedFrom: '/prepare-testing',
    trigger: 'Event-driven',
    triggerType: 'event-driven',
    tools: [],
    mcps: [],
    skills: [],
    chainSteps: [],
    templates: [],
    memoryInstructions: '',
    agentInstructions: '',
    cannotDo: [],
    handoffImpact: '',
    color: 'bg-green-50',
    icon: <TestTube2 size={20} className="text-green-600" />,
    badgeColor: 'bg-green-100 text-green-700',
  },
  {
    id: 'release-agent',
    name: 'release-agent',
    whenToUse: 'Use when code is merged to main and release artifacts are needed',
    agentColor: 'blue',
    preloadedSkills: ['release-notes', 'change-request', 'rollback-plan'],
    description: 'Automated release management',
    evolvedFrom: '/create-release-notes',
    trigger: 'Event-driven',
    triggerType: 'event-driven',
    tools: [],
    mcps: [],
    skills: [],
    chainSteps: [],
    templates: [],
    memoryInstructions: '',
    agentInstructions: '',
    cannotDo: [],
    handoffImpact: '',
    color: 'bg-blue-50',
    icon: <Rocket size={20} className="text-blue-600" />,
    badgeColor: 'bg-blue-100 text-blue-700',
  },
  {
    id: 'security-agent',
    name: 'security-agent',
    whenToUse: 'Use when security scans complete and interpretation is needed',
    agentColor: 'red',
    preloadedSkills: ['vuln-assessment', 'dast-interpretation', 'security-checklist'],
    description: 'Automated security analysis',
    evolvedFrom: 'Manual security reviews',
    trigger: 'Event-driven',
    triggerType: 'event-driven',
    tools: [],
    mcps: [],
    skills: [],
    chainSteps: [],
    templates: [],
    memoryInstructions: '',
    agentInstructions: '',
    cannotDo: [],
    handoffImpact: '',
    color: 'bg-red-50',
    icon: <Shield size={20} className="text-red-600" />,
    badgeColor: 'bg-red-100 text-red-700',
  },
  {
    id: 'docs-agent',
    name: 'docs-agent',
    whenToUse: 'Use when documentation changes need validation and sync',
    agentColor: 'cyan',
    preloadedSkills: ['architecture-doc', 'implementation-phases'],
    description: 'Automated documentation management',
    evolvedFrom: '/sync-docs',
    trigger: 'Event-driven',
    triggerType: 'event-driven',
    tools: [],
    mcps: [],
    skills: [],
    chainSteps: [],
    templates: [],
    memoryInstructions: '',
    agentInstructions: '',
    cannotDo: [],
    handoffImpact: '',
    color: 'bg-cyan-50',
    icon: <FileText size={20} className="text-cyan-600" />,
    badgeColor: 'bg-cyan-100 text-cyan-700',
  },
  {
    id: 'onboarding-agent',
    name: 'onboarding-agent',
    whenToUse: 'Use when new team members need role-specific onboarding',
    agentColor: 'yellow',
    preloadedSkills: ['architecture-doc', 'implementation-phases'],
    description: 'Automated team onboarding',
    evolvedFrom: 'Manual onboarding',
    trigger: 'Manual',
    triggerType: 'manual',
    tools: [],
    mcps: [],
    skills: [],
    chainSteps: [],
    templates: [],
    memoryInstructions: '',
    agentInstructions: '',
    cannotDo: [],
    handoffImpact: '',
    color: 'bg-yellow-50',
    icon: <Users size={20} className="text-yellow-600" />,
    badgeColor: 'bg-yellow-100 text-yellow-700',
  },
  {
    id: 'metrics-agent',
    name: 'metrics-agent',
    whenToUse: 'Use at sprint end for metrics collection and analysis',
    agentColor: 'magenta',
    preloadedSkills: ['retrospective', 'sprint-capacity'],
    description: 'Automated sprint metrics collection',
    evolvedFrom: 'Manual retrospectives',
    trigger: 'Scheduled',
    triggerType: 'scheduled',
    tools: [],
    mcps: [],
    skills: [],
    chainSteps: [],
    templates: [],
    memoryInstructions: '',
    agentInstructions: '',
    cannotDo: [],
    handoffImpact: '',
    color: 'bg-purple-50',
    icon: <BarChart3 size={20} className="text-purple-600" />,
    badgeColor: 'bg-purple-100 text-purple-700',
  },
];

/* ═══════════════════════════════════════════
   DELEGATION MATRIX
   ═══════════════════════════════════════════ */
const delegateYes = [
  {
    task: 'Generar test cases BDD desde ticket + diff',
    agent: 'qa-agent',
    reason: 'Repetitivo, alto volumen, formato estandarizado',
  },
  {
    task: 'Generar release notes desde PRs mergeados',
    agent: 'release-agent',
    reason: 'Mecanico, fuente de datos clara (Git log)',
  },
  {
    task: 'Triaje de vulnerabilidades SAST/DAST',
    agent: 'security-agent',
    reason: 'Alto volumen de hallazgos, priorizacion por criterios OWASP conocidos',
  },
  {
    task: 'Plan de onboarding por rol',
    agent: 'onboarding-agent',
    reason: 'Contenido del ecosistema es estatico, personalizacion por rol',
  },
  {
    task: 'Detectar drift entre fuentes de verdad',
    agent: 'docs-agent',
    reason: 'Verificacion mecanica de 32 tests de integridad',
  },
  {
    task: 'Recopilar metricas Sprint + DORA',
    agent: 'metrics-agent',
    reason: 'Extraccion de datos de APIs, calculos estandar',
  },
  {
    task: 'Seleccionar tests de regresion por impacto',
    agent: 'qa-agent',
    reason: 'Analisis de codigo cambiado vs cobertura de tests existentes',
  },
  {
    task: 'Pre-llenar Change Request',
    agent: 'release-agent',
    reason: 'Datos de PRs y release notes ya generados',
  },
];

const delegateNo = [
  {
    task: 'Firmar QA sign-off (so-qa)',
    owner: 'QA Lead',
    reason: 'Responsabilidad legal/contractual, requiere juicio humano sobre calidad',
  },
  {
    task: 'Firmar Security sign-off (so-security)',
    owner: 'Sec Lead',
    reason: 'Riesgo residual aceptado, decision de negocio sobre seguridad',
  },
  {
    task: 'Aprobar Change Request',
    owner: 'Comite de Cambios',
    reason: 'Decision organizacional multi-stakeholder',
  },
  {
    task: 'Ejecutar Pen Testing manual',
    owner: 'Pentester',
    reason: 'Requiere creatividad, conocimiento de negocio, hacking etico',
  },
  {
    task: 'Priorizar backlog / Sprint commitment',
    owner: 'PO + TL',
    reason: 'Decision de negocio + capacidad tecnica real',
  },
  {
    task: 'Decisiones arquitectonicas (ADR)',
    owner: 'Tech Lead',
    reason: 'Trade-offs a largo plazo, vision tecnica, contexto organizacional',
  },
  {
    task: 'Retrospectiva (discusion)',
    owner: 'Equipo completo',
    reason: 'Reflexion cualitativa, dinamica de equipo, mejora continua',
  },
  {
    task: 'Aceptar riesgo residual',
    owner: 'Sponsor / PME',
    reason: 'Decision de negocio con implicaciones legales/financieras',
  },
];

/* ═══════════════════════════════════════════
   AGENT ORCHESTRATION DIAGRAM
   ═══════════════════════════════════════════ */

/* ═══════════════════════════════════════════
   CAN AGENTS EXECUTE WORKFLOWS?
   ═══════════════════════════════════════════ */
const getWorkflowCapabilities = (trackingTool: string, testingTool: string, docTool: string) => [
  {
    capability: 'Ejecutar skills encadenados',
    canDo: true,
    detail:
      'Un subagente puede invocar multiples skills en secuencia como parte de su chain. Ejemplo: qa-agent invoca test-plan -> create-test-cases -> regression-suite.',
  },
  {
    capability: 'Usar MCPs para leer/escribir',
    canDo: true,
    detail: `Los subagentes tienen acceso a MCPs configurados. Pueden leer de ${trackingTool}, escribir en ${testingTool === 'Cucumber' ? 'archivos .feature' : 'Xray'}, publicar en ${docTool}, etc.`,
  },
  {
    capability: 'Ejecutar commands como /advance-gate',
    canDo: false,
    detail:
      'Los commands son workflows invocados por humanos. Un subagente NO ejecuta /advance-gate directamente -- puede preparar los inputs, pero el humano debe invocar el gate.',
  },
  {
    capability: 'Spawear otros subagentes',
    canDo: false,
    detail:
      'Los subagentes NO pueden crear otros subagentes. Solo el agente orquestador (conversacion principal) puede spawnear subagentes y encadenarlos en secuencia.',
  },
  {
    capability: 'Firmar signoffs',
    canDo: false,
    detail:
      'Los signoffs (so-qa, so-security) requieren firma humana. El subagente puede pre-llenar el documento pero nunca firmarlo.',
  },
  {
    capability: 'Evaluar quality gates',
    canDo: false,
    detail:
      'Los gates requieren /advance-gate invocado por el rol correspondiente (PO, TL, QA Lead, Sec Lead, PME). El subagente puede recopilar evidencias.',
  },
  {
    capability: 'Escribir en su memoria persistente',
    canDo: true,
    detail:
      'Cada subagente tiene acceso de escritura a .claude/agent-memory/{name}/ con scope project. Acumula conocimiento entre sesiones.',
  },
  {
    capability: 'Ejecutar bash scripts',
    canDo: true,
    detail:
      'Subagentes con tool Bash pueden ejecutar scripts de analisis (ej: integrity tests, dependency analysis, metrics extraction).',
  },
];

/* Audit data (gateMandatoryArtifacts, subagentChainGaps, falsePositiveChains)
   removed -- now IMPLEMENTED as executable logic in advance-gate.md v2.0.0,
   tpl-gate-evaluation, and agent guards. Original JSX extracted to AgentsArchitectureView.tsx. */

export function AgentsArchitecture() {
  const { client } = useCurrentClient();
  const agents = getAgentsForClient(client);

  // Get dynamic tools for workflow capabilities
  const trackingTool =
    client?.domainTerms?.tracking_tool || (client?.name === 'Docline' ? 'Linear' : 'Jira');
  const testingTool =
    client?.domainTerms?.testing_tool || (client?.name === 'Docline' ? 'Cucumber' : 'TestRail');
  const docTool =
    client?.domainTerms?.doc_system ||
    (client?.name === 'Docline' ? 'Sistema de documentación' : 'Confluence');

  const workflowCapabilities = getWorkflowCapabilities(trackingTool, testingTool, docTool);

  return (
    <AgentsArchitectureView
      agents={agents}
      delegateYes={delegateYes}
      delegateNo={delegateNo}
      workflowCapabilities={workflowCapabilities}
    />
  );
}
