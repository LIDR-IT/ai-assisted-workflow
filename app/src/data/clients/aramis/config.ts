/**
 * Aramis Group Client Configuration
 *
 * Aramis Group is a multi-country automotive retail platform specializing in
 * used vehicle commerce across Europe. Their core product, Polaris, is a 3-year-old
 * PHP-based CRM+ERP system used across multiple brands and countries, synchronized
 * with legacy local systems via a separate Bridge service.
 *
 * Discovery session: 2026-05-06 with Álvaro (Director / Tribe Lead), David (Liderazgo técnico),
 * Reme, Ramón, Dídac, Sheila, Alberto, Luis Marco, Pedro, Alejandro.
 * Pre-kickoff survey: 2026-04-07 (confirmed stack, sprint metrics, priorities).
 *
 * Tech stack confirmed: PHP + Symfony (backend), Angular (main) + Nuxt (frontend),
 * MySQL + MongoDB (DB), GKE/Google Cloud/Cloud SQL (infra), GitLab (CI/CD + repo).
 * DevOps: ArgoCD, Helm, Terraform, Grafana Cloud, Vault, Keycloak, Cloudflare, Ansible.
 * AI tools: Claude Code + JetBrains (frequently but unstructured).
 *
 * Sprint cadence: Scrumban hybrid, 2 weeks, starts Monday.
 * Completion: 70–90%. Ceremonies: Daily, Planning, Retro (no Sprint Review).
 * Engineering maturity self-score: 4/5.
 *
 * AS-IS diagnosis: Strong Scrum cadence (✅) and exceptional AI innovators (✅);
 * critical gaps: product documentation is "gran fracaso" (❌), no formal DoD/DoR (❌),
 * Bridge impact verification missing (❌), Dev/QA separation causing test breakage (❌),
 * Cypress disconnected from CI (❌), and slow CI pipelines (❌).
 */

import type { ClientConfig } from '@/data/schemas/client-schema';

export const aramisClientConfig: ClientConfig = {
  // Client Identity
  name: 'Aramis',
  fullName: 'Aramis Group — Automotive Digital Retail Platform',
  industry: 'Custom',
  segment: 'Multi-brand Used Vehicle E-commerce & CRM',

  // Project Context
  projectCode: 'ARAMIS-SDLC',
  projectName: 'LIDR SDLC Standardization for Polaris CRM/ERP Platform',
  domain: 'Multi-country Automotive CRM, ERP & Legacy Synchronization',

  // Technical Context
  mainProducts: [
    'Polaris CRM (multi-brand, multi-country)',
    'Polaris ERP',
    'Bridge Sync (Polaris ↔ Legacy local systems)',
  ],

  // Regulatory Context
  regulations: ['GDPR'],

  // Template Variables (automotive multi-country context)
  templateVars: {
    CLIENT_REGULATIONS:
      'GDPR, multi-country automotive retail compliance (múltiples países europeos)',
    STAKEHOLDER_TYPES:
      'business stakeholders, country managers, brand managers, dealership ops, product & engineering tribes',
    DOMAIN_SYSTEMS:
      'Polaris CRM/ERP, Bridge synchronization service, legacy country-specific dealer management systems',
    SENSITIVE_DATA_TYPE:
      'vehicle transaction data, customer PII, multi-country pricing and stock data',
    COMPLIANCE_FRAMEWORK: 'GDPR data protection, multi-jurisdiction automotive retail regulations',

    // Aramis-specific context
    GOVERNANCE_STYLE:
      'two-tribe autonomous structure (Compras/Ventas) under shared technical leadership (Álvaro + David); high AI innovation at individual level, low institutional standardization',
    TEAM_STRUCTURE:
      'Tribe Compras (Adrián Louro TL) + Tribe Ventas (David liderazgo técnico + EMs: Reme, Ramón, Alberto); Transversal: Pedro (Polaris Knowledge Agent); QA: Sheila; Design: Alejandro; AI innovators: Luis Marco (PM), Pedro, Ramón',
    CRISIS_LANGUAGE:
      'Polaris production incident or Bridge synchronization failure causing data inconsistency across countries',
    TOOL_ECOSYSTEM:
      'Backend: PHP + Symfony | Frontend: Angular (main project), Nuxt | DB: MySQL, MongoDB | Cloud: GKE (Google Kubernetes Engine), Cloud SQL (Google Cloud) | CI/CD: GitLab Pipelines | Repo: GitLab | DevOps: ArgoCD, Helm, Terraform, Grafana Cloud, Vault, Keycloak, Cloudflare, Ansible | QA: Cypress (E2E — separate repo, not CI-blocking), PHPStan (static analysis — strength) | PM: Redmine | Docs: Notion (product initiatives — not maintained) | AI: Claude Code + JetBrains (frequently, unstructured)',
    PROCESS_MATURITY:
      'AS-IS: Scrum funciona bien ✅: 2-week sprints, ceremonies establecidas, Gherkin/BDD, capacity planning. Gaps críticos ❌: PRD = "gran fracaso" (David), DoD = "No hay definition of done como tal", Bridge impact sin verificar sistemáticamente, Dev/QA separados rompiendo tests, Cypress desconectado de CI, code review inconsistente. IA individual excepcional pero sin estandarizar.',
    DELIVERY_PRESSURE:
      'brownfield product active across multiple countries with legacy sync constraints; business speed exceeds IT delivery capacity',
  },

  // Aramis Domain Terms
  domainTerms: {
    sdlc: 'Software Development Lifecycle aplicado a Polaris y proyectos satélite',
    sprint: 'Iteración de 2 semanas con Scrum — cadencia establecida y funcional',
    epic: 'Iniciativa de producto documentada en Notion antes de llegar a Redmine',
    prd: 'Product Requirements Document — AS-IS: "gran fracaso" (David): Notion existe pero no se mantiene, criterios dispersos en tickets Redmine históricos',
    nfr: 'Non-Functional Requirement — no formalizados en el proceso actual',
    dor: 'Definition of Ready — AS-IS: sin criterios escritos formales, depende de criterio individual por tribu',
    dod: 'Definition of Done — AS-IS: "No hay definition of done como tal" confirmado en discovery session',
    gate: 'Quality gate de transición de fase — AS-IS: completamente ausentes, sin gates que bloqueen merge/avance de fase',
    rtm: 'Trazabilidad formal entre requisito y código — no implementada actualmente',

    // Aramis-specific
    polaris: 'CRM + ERP multi-marca desarrollado en PHP (3 años de antigüedad, brownfield activo)',
    polaris_backend: 'Repositorio PHP + Symfony de backend de Polaris (lógica de negocio y API)',
    polaris_frontend:
      'Repositorio de frontend de Polaris — Angular (proyecto principal) y Nuxt (secundario); interfaz de usuario multi-marca',
    bridge:
      'Servicio PHP de sincronización que mapea datos de Polaris hacia los sistemas legados locales por país — fuente crítica de fallos silenciosos',
    bridge_failure:
      'AS-IS: Rotura silenciosa frecuente de Bridge — "A veces cuando desarrollamos dentro de Polaris estamos rompiendo lo que hay establecido en Bridge para mapeo. Te cargas un enum [...] y eso va provocando problemas de sincronización" (Ramón). Sin verificación sistemática de impacto.',
    brand_rules:
      'Reglas de negocio específicas por país y marca — actualmente dispersas en tickets históricos de Redmine, sin fuente de verdad centralizada',
    tribe_compras:
      'Tribu de Compras: Adrián Louro (TL) + equipo de desarrollo asignado a flujos de adquisición de vehículos',
    tribe_ventas:
      'Tribu de Ventas: David (liderazgo técnico) + Reme (EM), Ramón (EM/Dev), Dídac (Dev), Alberto (EM/PM), Sheila (QA); Pedro (rol transversal — no exclusivo de Ventas)',
    vmat: 'Sistema de instrucciones/configuración del agente IA — Adrián Louro designado como "maestro de VMAT" para el piloto LIDR',
    polaris_knowledge_agent:
      'MCP Knowledge Server desarrollado por Pedro: da acceso semántico a datos de Redmine para responder preguntas sobre Polaris a través de IA',
    luis_marco_orchestrator:
      'Sistema multi-agente de Luis Marco: ~70% del flujo automatizado (iniciativa → story slicing → criterios de aceptación). El caso de uso más avanzado de IA en la organización.',
    mcp_redmine_gitlab:
      'MCP desarrollado por el equipo de plataforma, usado por Ramón: conecta Claude Code con Redmine + GitLab para leer tickets y generar planes de desarrollo',
    phpstan: 'Análisis estático PHP — herramienta de calidad de código ya en uso (fortaleza)',
    cypress_separate:
      'AS-IS: Tests E2E Cypress en repositorio separado — "los desarrolladores trabajan por un lado y QA trabaja por otro. Cuando un desarrollador saca su ticket puede ser que rompa los test de Cypress" pero "no lo pueden probar en local antes de mandarlo". Sheila ejecuta tests en "ratos libres", no es gate bloqueante.',
    code_review_dual:
      'AS-IS: Code review inconsistente — "dependiendo del reviewer [...] algunos, si tienen una parte más técnica [...] otros más en la parte del code review, revisando que no se haya dejado ningún criterio por implementar". Resultado variable según perfil del reviewer.',
    tracking_tool: 'Redmine',
    vcs_tool: 'GitLab',
    doc_system:
      'AS-IS: Notion existe pero "es uno de nuestros grandes fracasos [...] no hemos sido capaces de conseguir" mantenerlo. Criterios reales dispersos en "tickets de Redmine dispersos", sin fuente de verdad centralizada.',
    testing_tool:
      'Cypress (E2E, repo separado) + PHPStan (análisis estático) + tests unitarios PHP',
    testing_approach:
      'AS-IS: Backend robusto con PHPStan en CI ✅; Frontend débil: "mucho margen de mejora [...] tenemos pantallas muy complejas donde en función de lo que selecciones te aparecen o te desaparecen algunos [campos]" sin cobertura ❌; E2E crítico: "muchísimo margen de mejora [...] no tenemos cubierto, por ejemplo, un flujo de trabajo" completo ❌. Cypress separado, devs "no lo pueden probar en local antes de mandarlo" ❌.',
    symfony:
      'Framework PHP usado en el backend de Polaris — confirma el stack tecnológico del equipo',
    angular_stack:
      'Angular es el framework principal del frontend de Polaris; Nuxt se usa como framework secundario',
    gke_cloud:
      'Google Kubernetes Engine (GKE) para orquestación de contenedores en Google Cloud; Cloud SQL como base de datos gestionada (no BigQuery)',
    mongodb: 'MongoDB usado junto con MySQL para almacenamiento de datos en Polaris',
    slow_ci:
      'CI pipelines muy lentos — principal pain en developer experience (survey: "Very slow, breaks developer flow"); CI/CD quality self-score: 3/5',
    frontend_complexity:
      'AS-IS: "Pantallas muy complejas donde en función de lo que selecciones te aparecen o te desaparecen algunos [campos]" — lógica condicional compleja sin cobertura de tests adecuada (Dídac, discovery session)',
    e2e_coverage_gap:
      'AS-IS: "No tenemos cubierto, por ejemplo, un flujo de trabajo [completo]" — cobertura E2E parcial, "muchísimo margen de mejora" confirmado por QA (discovery session)',
    ai_token_limits:
      'AS-IS: "Hay un punto importante, que es el límite de tokens [...] nos toparemos con que a la primera que lo ejecutemos no tendremos el resultado que queríamos" — constraint real en workflows IA de Luis Marco y Pedro (discovery session)',
  },

  // Team Configuration (confirmed from discovery session)
  team: {
    pme: 1, // Álvaro (Director / Tribe Lead — sponsor del proyecto)
    productOwner: 1, // David (liderazgo técnico)
    techLead: 2, // Adrián Louro (Compras) + TL Ventas pendiente de confirmar
    developers: 6, // Reme (EM), Ramón (EM/Dev), Dídac (Dev), Alberto (EM/PM), Luis Marco (PM), + otros
    qaLead: 1, // Sheila
    qaEngineers: 1,
    security: 0, // Equipo de ciberseguridad a nivel de Aramis Group (no en las tribus de producto)
    devOps: 1, // No asistió a la sesión — owner de jobs CI/CD por confirmar
    scrumMaster: 0, // No identificado — posiblemente rol absorbido por EMs
  },

  // Branding (automotive — placeholder, pendiente confirmar con Álvaro)
  colors: {
    primary: '#1E3A5F', // Navy — automotive professional [PENDIENTE CONFIRMAR MARCA]
    secondary: '#64748B', // Slate gray — technology neutral
    accent: '#F59E0B', // Amber/gold — automotive premium
  },

  // Subdomain
  subdomain: 'sdlc.aramis.com',
};
