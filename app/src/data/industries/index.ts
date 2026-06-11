/**
 * Industry Packs — Pre-configured domain configurations for LIDR SDLC Methodology
 *
 * Each industry pack provides domain-specific terminology, regulations,
 * stakeholder types, and template variables so the ecosystem can be
 * deployed to any vertical without manual reconfiguration.
 *
 * Part of the Q3 productization effort for multi-industry portability.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Domain terms follow the same shape as clientConfig.templateVars */
export interface IndustryDomainTerms {
  readonly CLIENT_REGULATIONS: string;
  readonly STAKEHOLDER_TYPES: string;
  readonly DOMAIN_SYSTEMS: string;
  readonly SENSITIVE_DATA_TYPE: string;
  readonly COMPLIANCE_FRAMEWORK: string;
}

export interface IndustryPack {
  /** kebab-case identifier, e.g. "biometric-identity" */
  readonly id: string;
  /** Human-readable short name */
  readonly name: string;
  /** Full marketing / display name */
  readonly displayName: string;
  /** Industry-specific domain terms (maps to templateVars pattern) */
  readonly domainTerms: IndustryDomainTerms;
  /** Applicable regulations */
  readonly regulations: readonly string[];
  /** Typical stakeholder description */
  readonly stakeholderTypes: string;
  /** Kind of sensitive data handled */
  readonly sensitiveDataType: string;
  /** Primary compliance framework label */
  readonly complianceFramework: string;
  /** Representative products / services in this industry */
  readonly commonProducts: readonly string[];
}

// ---------------------------------------------------------------------------
// Industry Packs
// ---------------------------------------------------------------------------

const biometricIdentity: IndustryPack = {
  id: 'biometric-identity',
  name: 'Biometric Identity',
  displayName: 'Biometric Identity Verification',
  domainTerms: {
    CLIENT_REGULATIONS: 'GDPR Art. 9, PSD2, AML',
    STAKEHOLDER_TYPES: 'bancos, usuarios finales, reguladores',
    DOMAIN_SYSTEMS: 'sistemas de verificación de identidad',
    SENSITIVE_DATA_TYPE: 'datos biométricos',
    COMPLIANCE_FRAMEWORK: 'protección de datos (GDPR Art. 9)',
  },
  regulations: [
    'GDPR Art. 9',
    'eIDAS',
    'PSD2',
    'ISO 27001',
    'ISO 30107',
    'NIST SP 800-63B',
    'AML/KYC Directives',
  ],
  stakeholderTypes: 'Banks, end-users, regulators, identity providers, fintech partners',
  sensitiveDataType: 'Biometric templates, facial images, voice prints, behavioral patterns',
  complianceFramework: 'GDPR Art. 9 (special category data) + ISO 30107 (PAD)',
  commonProducts: [
    'Facial recognition SDK',
    'Document verification (OCR + NFC)',
    'Voice biometrics',
    'Behavioral biometrics',
    'Identity orchestration platform',
  ],
};

const healthcare: IndustryPack = {
  id: 'healthcare',
  name: 'Healthcare',
  displayName: 'Healthcare & Life Sciences',
  domainTerms: {
    CLIENT_REGULATIONS: 'HIPAA, HITECH, FDA 21 CFR Part 11',
    STAKEHOLDER_TYPES: 'pacientes, profesionales clínicos, reguladores sanitarios',
    DOMAIN_SYSTEMS: 'sistemas de historia clínica electrónica (EHR/EMR)',
    SENSITIVE_DATA_TYPE: 'datos clínicos protegidos (PHI)',
    COMPLIANCE_FRAMEWORK: 'protección de información sanitaria (HIPAA)',
  },
  regulations: [
    'HIPAA',
    'HITECH Act',
    'FDA 21 CFR Part 11',
    'GDPR (EU patients)',
    'HL7 FHIR R4',
    'ICD-10',
    'DICOM',
    'GxP (Good Practice)',
  ],
  stakeholderTypes:
    'Patients, clinicians, hospital administrators, payers, pharma sponsors, regulators',
  sensitiveDataType: 'Protected Health Information (PHI), clinical trial data, genomic data',
  complianceFramework: 'HIPAA Privacy & Security Rules + FDA validation',
  commonProducts: [
    'Electronic Health Records (EHR)',
    'Telemedicine platforms',
    'Clinical trial management (CTMS)',
    'Medical imaging systems (PACS)',
    'Patient portal & scheduling',
  ],
};

const fintech: IndustryPack = {
  id: 'fintech',
  name: 'Fintech',
  displayName: 'Financial Technology & Payments',
  domainTerms: {
    CLIENT_REGULATIONS: 'PSD2, PCI-DSS, AML/KYC, MiFID II',
    STAKEHOLDER_TYPES: 'entidades financieras, comercios, reguladores financieros',
    DOMAIN_SYSTEMS: 'sistemas de procesamiento de pagos y transacciones',
    SENSITIVE_DATA_TYPE: 'datos financieros y de tarjetas de pago',
    COMPLIANCE_FRAMEWORK: 'seguridad de datos de pago (PCI-DSS)',
  },
  regulations: [
    'PSD2',
    'PCI-DSS v4.0',
    'AML Directive (AMLD6)',
    'KYC Requirements',
    'MiFID II',
    'GDPR',
    'SOX (Sarbanes-Oxley)',
    'Basel III',
  ],
  stakeholderTypes: 'Financial institutions, merchants, end-users, payment networks, regulators',
  sensitiveDataType: 'Payment card data (PAN), transaction records, account credentials',
  complianceFramework: 'PCI-DSS v4.0 + PSD2 Strong Customer Authentication (SCA)',
  commonProducts: [
    'Payment processing gateway',
    'Digital wallets',
    'Lending platforms',
    'Fraud detection systems',
    'Open banking APIs',
  ],
};

const government: IndustryPack = {
  id: 'government',
  name: 'Government',
  displayName: 'Government & Public Sector',
  domainTerms: {
    CLIENT_REGULATIONS: 'eIDAS, WCAG 2.1 AA, ENS, GDPR',
    STAKEHOLDER_TYPES: 'ciudadanos, funcionarios públicos, organismos reguladores',
    DOMAIN_SYSTEMS: 'sistemas de administración electrónica y servicios al ciudadano',
    SENSITIVE_DATA_TYPE: 'datos personales de ciudadanos y registros oficiales',
    COMPLIANCE_FRAMEWORK: 'esquema nacional de seguridad (ENS) + eIDAS',
  },
  regulations: [
    'eIDAS',
    'GDPR',
    'WCAG 2.1 AA',
    'ENS (Esquema Nacional de Seguridad)',
    'ISO 27001',
    'NIST SP 800-53',
    'Section 508 (US)',
    'EU Accessibility Act',
  ],
  stakeholderTypes:
    'Citizens, public servants, oversight bodies, interoperability agencies, auditors',
  sensitiveDataType: 'Citizen PII, official records, digital identity credentials',
  complianceFramework: 'eIDAS (electronic identification) + ENS + WCAG 2.1 AA accessibility',
  commonProducts: [
    'Electronic ID (eID) platforms',
    'Citizen service portals',
    'Public procurement systems',
    'Digital signature solutions',
    'Interoperability middleware',
  ],
};

const ecommerce: IndustryPack = {
  id: 'ecommerce',
  name: 'E-Commerce',
  displayName: 'E-Commerce & Retail',
  domainTerms: {
    CLIENT_REGULATIONS: 'GDPR, PCI-DSS, Consumer Protection Directive',
    STAKEHOLDER_TYPES: 'compradores, vendedores, operadores logísticos, pasarelas de pago',
    DOMAIN_SYSTEMS: 'sistemas de catálogo de productos, carrito y gestión de pedidos',
    SENSITIVE_DATA_TYPE: 'datos de pago de clientes e información personal de compra',
    COMPLIANCE_FRAMEWORK: 'protección del consumidor + seguridad de pagos (PCI-DSS)',
  },
  regulations: [
    'GDPR',
    'PCI-DSS v4.0',
    'Consumer Protection Directive (EU)',
    'Digital Services Act (DSA)',
    'CCPA (California)',
    'Cookie Directive (ePrivacy)',
    'Distance Selling Regulations',
    'Product Safety Directive',
  ],
  stakeholderTypes:
    'Buyers, sellers/merchants, logistics providers, payment gateways, marketplaces',
  sensitiveDataType:
    'Customer payment data, purchase history, delivery addresses, behavioral profiles',
  complianceFramework: 'PCI-DSS (payments) + GDPR (personal data) + consumer protection',
  commonProducts: [
    'Product catalog & search',
    'Shopping cart & checkout',
    'Order management system (OMS)',
    'Warehouse management (WMS)',
    'Customer loyalty & CRM',
  ],
};

// Domain-agnostic fallback pack. Used when a client's industry matches none of
// the specific packs above. Keeps the framework neutral by default — biometric
// (or any other vertical) is an OPT-IN pack, never the silent default.
const generic: IndustryPack = {
  id: 'generic',
  name: 'Generic',
  displayName: 'Generic / Domain-Agnostic',
  domainTerms: {
    CLIENT_REGULATIONS: 'GDPR, applicable local data-protection law',
    STAKEHOLDER_TYPES: 'usuarios, operadores, administradores',
    DOMAIN_SYSTEMS: 'sistemas de negocio de la aplicación',
    SENSITIVE_DATA_TYPE: 'datos personales (PII)',
    COMPLIANCE_FRAMEWORK: 'protección de datos (GDPR)',
  },
  regulations: ['GDPR', 'ISO 27001', 'SOC 2'],
  stakeholderTypes: 'End-users, operators, administrators, business owners',
  sensitiveDataType: 'Personally Identifiable Information (PII)',
  complianceFramework: 'GDPR (general data protection)',
  commonProducts: ['Web application', 'REST/GraphQL API', 'Admin dashboard', 'User management'],
};

// ---------------------------------------------------------------------------
// Registry
// ---------------------------------------------------------------------------

const industryPacksMap: ReadonlyMap<string, IndustryPack> = new Map([
  [biometricIdentity.id, biometricIdentity],
  [healthcare.id, healthcare],
  [fintech.id, fintech],
  [government.id, government],
  [ecommerce.id, ecommerce],
  [generic.id, generic],
]);

/** All available industry pack IDs and display names */
export const availableIndustries: readonly { id: string; name: string; displayName: string }[] = [
  {
    id: biometricIdentity.id,
    name: biometricIdentity.name,
    displayName: biometricIdentity.displayName,
  },
  { id: healthcare.id, name: healthcare.name, displayName: healthcare.displayName },
  { id: fintech.id, name: fintech.name, displayName: fintech.displayName },
  { id: government.id, name: government.name, displayName: government.displayName },
  { id: ecommerce.id, name: ecommerce.name, displayName: ecommerce.displayName },
];

/**
 * Retrieve a full industry pack by its ID.
 * Returns `undefined` if the ID is not recognized.
 */
export function getIndustryPack(id: string): IndustryPack | undefined {
  return industryPacksMap.get(id);
}

/**
 * Retrieve an industry pack or throw if not found.
 * Prefer this in contexts where the ID is known to be valid.
 */
export function getIndustryPackOrThrow(id: string): IndustryPack {
  const pack = industryPacksMap.get(id);
  if (!pack) {
    const validIds = availableIndustries.map((i) => i.id).join(', ');
    throw new Error(`Unknown industry pack "${id}". Available: ${validIds}`);
  }
  return pack;
}

// Re-export individual packs for direct import when needed
export const industryPacks = {
  biometricIdentity,
  healthcare,
  fintech,
  government,
  ecommerce,
  generic,
} as const;
