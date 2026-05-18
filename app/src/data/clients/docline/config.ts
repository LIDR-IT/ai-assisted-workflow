/**
 * Docline Client Configuration
 *
 * This configuration defines the Docline client setup for the multi-client
 * architecture. Docline represents a healthcare technology platform founded in 2015,
 * specializing in telemedicine services connecting 6,000 doctors with 2M+ patients
 * across Spain, Morocco, and expanding to Latin America.
 *
 * Domain-specific content is housed in domain-context.md to maintain
 * framework portability across different industries and clients.
 */

import type { ClientConfig } from '@/data/schemas/client-schema';

export const doclineClientConfig: ClientConfig = {
  // Client Identity
  name: 'Docline',
  fullName: 'Docline Healthcare Technology Platform',
  industry: 'Healthcare Technology',
  segment: 'Telemedicine / Healthcare Technology',

  // Project Context
  projectCode: 'DOC-SDLC',
  projectName: 'SDLC Standardization & Process Improvement for Healthcare Platform',
  domain: 'Healthcare Technology and Telemedicine Services',

  // Technical Context
  mainProducts: [
    'Telemedicine Video Platform',
    'Medical Chat & Messaging',
    'E-Prescription System',
    'Appointment Management',
    'Electronic Health Records Integration',
  ],

  // Regulatory Context (healthcare-specific compliance)
  regulations: ['HIPAA', 'FDA 21 CFR Part 820', 'GDPR'],

  // Template Variables (healthcare telemedicine context)
  templateVars: {
    CLIENT_REGULATIONS: 'HIPAA, HITECH, FDA 21 CFR Part 11, GDPR, HL7 FHIR, DICOM',
    STAKEHOLDER_TYPES:
      'patients, healthcare providers, clinical staff, insurance companies, reguladores sanitarios',
    DOMAIN_SYSTEMS:
      'electronic health record systems, telemedicine platforms, and clinical management systems',
    SENSITIVE_DATA_TYPE:
      'protected health information (PHI), clinical records, patient data, and medical imaging',
    COMPLIANCE_FRAMEWORK: 'HIPAA Privacy & Security Rules and healthcare data protection standards',
    GOVERNANCE_STYLE: 'clinical governance with regulatory compliance and patient safety focus',
    TEAM_STRUCTURE: 'clinical operations team with healthcare compliance specialization',
    CRISIS_LANGUAGE: 'critical patient safety and healthcare compliance risk',
    TOOL_ECOSYSTEM:
      'Linear, Slack, Teams (confirmed); Grafana + service logs (basic monitoring, confirmed); GitHub/GitHub CLI (not confirmed); SonarQube, OWASP ZAP, Docker, Kubernetes (LIDR SDLC proposals)',
    PROCESS_MATURITY:
      'early SDLC standardization stage: planning/development working, requirements and QA partially informal',
    DELIVERY_PRESSURE: 'iterative delivery with active need for process standardization',
  },

  // Healthcare Telemedicine Domain Terms
  domainTerms: {
    sprint: '2-week development iteration with HIPAA compliance validation',
    retrospective: 'sprint reflection with clinical operations and compliance review',
    refinement: 'story preparation with patient safety and healthcare compliance assessment',
    handoff: 'HIPAA-validated documentation for clinical workflow transitions',
    gate_criteria: 'patient safety and healthcare compliance checkpoints for advancing phases',
    cicd_pipeline: 'automated build, healthcare security scan, and deployment pipeline',
    integration_env: 'secure integration environment for clinical workflow testing',
    demo_env: 'HIPAA-compliant demonstration environment for clinical stakeholders',
    production_env: 'high-security production environment with PHI data protection',
    dual_tech_leads:
      'clinical platform engineering and healthcare integration technical leadership',
    security_testing: 'penetration testing and vulnerability assessments for healthcare systems',
    code_review: 'healthcare-focused peer review with HIPAA compliance validation',
    deployment_pipeline: 'secure CI/CD workflow with healthcare data protection',
    testing_tool: 'QA live + tests automáticos (tooling no explícito); seguimiento en Linear',
    testing_approach: 'patient safety-first testing with healthcare compliance validation',
    testing_action: 'QA validates clinical workflow accuracy and security controls',
    testing_reporting: 'HIPAA-validated test results with healthcare compliance documentation',
    tracking_tool: 'Linear',
    vcs_tool: 'GitHub',
    project_management: 'Linear para tickets con clasificación de datos de salud',
    doc_system: 'Linear + Docs locales para documentación clínica sensible',

    // Healthcare-specific terms
    teleconsulta: 'consulta médica realizada por videoconferencia entre médico y paciente',
    historia_clinica_electronica: 'registro digital completo del historial médico del paciente',
    e_prescripcion: 'receta médica electrónica enviada directamente a la farmacia',
    portal_paciente: 'interfaz web/móvil para que pacientes gestionen citas y consulten historial',
    flujo_clinico: 'proceso estandarizado de atención médica desde consulta hasta seguimiento',
    phi_data: 'información sanitaria protegida bajo regulaciones de privacidad HIPAA',
    hl7_fhir: 'estándar de interoperabilidad para intercambio de información sanitaria',
    clinical_decision_support: 'sistemas de apoyo a la decisión clínica basados en evidencia',
    patient_onboarding: 'proceso de registro de pacientes con verificación de identidad médica',
    appointment_scheduling: 'gestión automatizada de citas médicas y disponibilidad',
    medical_imaging: 'gestión y procesamiento de imágenes médicas (DICOM)',
    clinical_workflow: 'flujo de trabajo clínico optimizado para atención al paciente',

    // Agent tools and MCP integrations
    agent_tools: 'filesystem, memory, playwright, context7',
    mcp_integrations: 'filesystem MCP, memory MCP, playwright MCP, context7 MCP',
    workflow_tools:
      'Linear, Slack, Teams (confirmed); Grafana + service logs (basic monitoring, confirmed); GitHub CLI (assumed); SonarQube, OWASP ZAP, Docker, Kubernetes (LIDR SDLC proposals)',

    // Governance and team style (compliance-driven)
    governance_style: 'formal compliance-driven',
    team_structure: 'hierarchical with security specialization',
    decision_making: 'security-first decision making with compliance validation',
    communication_style: 'formal and compliance-aware, focused on security and regulations',

    // Testing and quality approach (security-focused)
    testing_approach_detailed:
      'security-first testing with clinical workflow and patient safety validation',
    quality_gates: 'formal quality gates not evidenced yet in current process',
    ci_integration: 'CI/CD security integration not evidenced in the transcript',

    // Documentation and process style (compliance-focused)
    documentation_style: 'formal compliance documentation',
    knowledge_sharing: 'structured security training and compliance sessions',
    process_improvement: 'compliance-driven improvement with security review',
    change_management: 'formal change control with security impact assessment',

    // Process descriptions (security and compliance focused)
    sdlc_approach:
      'partially structured SDLC: strong sprint cadence, with gaps in formal requirements, QA planning, and gate governance',
    implementation_style: 'iterative and practical, with recurring ad-hoc/manual process steps',
    quality_assurance: 'QA present (QA live) but mostly reactive and not fully formalized',
    project_lifecycle:
      'working operational lifecycle with incomplete formalization in security/deploy governance',
  },

  // Team Configuration (healthcare telemedicine focused, 16 members total)
  team: {
    pme: 1,
    productOwner: 1, // Single product owner for healthcare platform
    techLead: 2, // Healthcare platform engineering & clinical integration leads
    developers: 6, // Healthcare application developers
    qaLead: 1,
    qaEngineers: 2, // Clinical workflow and HIPAA compliance testing
    security: 2, // CISO + Security engineer (critical for PHI data protection)
    devOps: 1,
    scrumMaster: 1,
  },

  // Branding (healthcare theme for medical trust and reliability)
  colors: {
    primary: '#0369A1', // Medical blue for healthcare trust
    secondary: '#059669', // Green for health and wellness
    accent: '#DC2626', // Red for medical alerts and critical information
  },

  // Subdomain (healthcare focused)
  subdomain: 'sdlc.docline.com',
};
