/**
 * FacePhi Client Configuration
 *
 * This configuration defines the FacePhi client setup for the multi-client
 * architecture. FacePhi specializes in biometric identity verification and
 * digital identity solutions across banking, fintech, government, and healthcare sectors.
 */

import type { ClientConfig } from '@/data/schemas/client-schema';

export const facePhiClientConfig: ClientConfig = {
  // Client Identity
  name: 'FacePhi',
  fullName: 'FacePhi Biometrics Solutions',
  industry: 'Biometric Identity Verification',
  segment: 'Identity & Security Technology / Biometric Solutions',

  // Project Context
  projectCode: 'SDLC-360',
  projectName: 'LIDR SDLC Methodology: Documentation, Mejora e Integración IA',
  domain: 'Biometric Identity Verification & Digital Identity',

  // Technical Context
  mainProducts: ['SelphID', 'Selphi', 'Voice', 'Behavioral', 'Platform'],

  // Regulatory Context (biometric-specific compliance)
  regulations: ['GDPR', 'eIDAS', 'PSD2', 'ISO 27001', 'ISO 30107', 'NIST SP 800-63B'],

  // Template Variables (biometric context)
  templateVars: {
    CLIENT_REGULATIONS: 'GDPR Art. 9 (biometric data), eIDAS, PSD2, ISO 27001, ISO 30107',
    STAKEHOLDER_TYPES: 'financial institutions, government agencies, healthcare providers',
    DOMAIN_SYSTEMS: 'biometric verification systems and identity platforms',
    SENSITIVE_DATA_TYPE: 'biometric templates and personal identification data',
    COMPLIANCE_FRAMEWORK: 'strict biometric data protection standards (GDPR Art. 9, ISO 30107)',
    GOVERNANCE_STYLE: 'formal compliance with audit trails',
    TEAM_STRUCTURE: 'hierarchical with specialized security and compliance roles',
    CRISIS_LANGUAGE: 'security incidents and compliance breaches',
    TOOL_ECOSYSTEM: 'Jira, TestRail, GitHub, SonarQube, OWASP ZAP, Datadog',
    PROCESS_MATURITY: 'enterprise-grade development practices with formal security gates',
    DELIVERY_PRESSURE: 'high-stakes delivery with zero-tolerance for security issues',
  },

  // Biometric Domain Terms
  domainTerms: {
    // Core biometric concepts
    template_biometrico:
      'representación matemática de un rasgo biométrico (huella, rostro, voz), vector de features irreversible',
    liveness_detection:
      'técnica para determinar si el input biométrico proviene de una persona real (vs foto, vídeo, deepfake)',
    verification_1_to_1: 'comparar un template contra otro específico - "¿Eres quien dices ser?"',
    identification_1_to_n: 'comparar un template contra una base de datos - "¿Quién eres?"',

    // Products and services
    selphid: 'SDK de verificación de identidad documental con OCR + NFC + ML',
    selphi: 'SDK de reconocimiento facial con liveness detection y deep learning',
    voice_biometrics: 'verificación por voz con anti-spoofing',
    behavioral_biometrics: 'análisis de patrones de comportamiento (typing dynamics, gestures)',
    biometric_platform: 'orquestador SaaS que integra todos los SDKs biométricos',

    // Technical processes
    onboarding_digital:
      'proceso de alta: captura de documento + selfie + verificación de identidad',
    ocr_documental: 'extracción automática de datos de documentos de identidad',
    nfc_chip_reading: 'lectura del chip electrónico en pasaportes e-passport y DNIe',

    // Metrics and compliance
    far_false_accept_rate: 'probabilidad de aceptar incorrectamente a un impostor',
    frr_false_reject_rate: 'probabilidad de rechazar incorrectamente al usuario legítimo',
    eer_equal_error_rate: 'punto donde FAR = FRR, menor = mejor algoritmo',
    dpia: 'Data Protection Impact Assessment - obligatorio para datos biométricos',
    kyc_know_your_customer: 'proceso regulatorio de identificación para banca/fintech',
    aml_anti_money_laundering: 'regulación contra lavado de dinero',

    // Regulatory compliance
    gdpr_art_9: 'consentimiento explícito requerido para datos biométricos',
    eidas_compliance: 'interoperabilidad de identidad electrónica en EU',
    psd2_sca: 'Strong Customer Authentication con multifactor biométrico',
    iso_30107: 'Presentation Attack Detection contra spoofing',

    // Security and testing
    pad_presentation_attack_detection: 'testing formal contra ataques con fotos, vídeos, máscaras',
    anti_spoofing: 'protección contra intentos de suplantación biométrica',
    audit_trail: 'registro inmutable para compliance y auditorías',
    biometric_encryption: 'cifrado específico para templates biométricos',

    // Development processes
    security_gate: 'checkpoint de seguridad específico para datos biométricos',
    biometric_testing: 'validación con datasets reales y ataques simulados',
    compliance_validation: 'verificación contra estándares biométricos internacionales',
    penetration_testing: 'testing especializado en vulnerabilidades biométricas',

    // Business context
    financial_onboarding: 'integración biométrica en procesos bancarios',
    government_eid: 'identidad electrónica para sector público',
    healthcare_patient_id: 'identificación de pacientes con biometría',
    fraud_prevention: 'prevención de fraude con liveness detection',

    // Integration and deployment
    sdk_integration: 'integración de SDKs biométricos en aplicaciones cliente',
    biometric_api: 'API REST para servicios de verificación e identificación',
    cloud_biometrics: 'servicios biométricos en cloud con compliance',
    edge_biometrics: 'procesamiento biométrico local en dispositivos',

    // Tool ecosystem
    tracking_tool: 'Jira',
    testing_tool: 'TestRail',
    doc_system: 'Confluence',
    vcs_tool: 'GitHub',
  },

  // Team Configuration (biometric enterprise team, 12-13 members total)
  team: {
    pme: 1,
    productOwner: 1, // Single PO for biometric product vision
    techLead: 1, // R&D Core Lead (algorithms + architecture)
    developers: 4, // 3-4 specialized in biometric algorithms
    qaLead: 1,
    qaEngineers: 2, // Specialized in biometric testing
    security: 1, // CISO - critical for biometric compliance
    devOps: 1,
    scrumMaster: 1,
  },

  // Branding (blue/teal theme for trust and security)
  colors: {
    primary: '#0EA5E9', // Sky blue for trust/security
    secondary: '#0F172A', // Dark slate for enterprise
    accent: '#10B981', // Green for verification/success
  },

  // Subdomain (proposed)
  subdomain: 'sdlc.facephi.com',
};
