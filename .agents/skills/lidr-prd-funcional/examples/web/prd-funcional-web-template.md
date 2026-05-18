---
id: prd-funcional-web-template
version: "1.0.0"
last_updated: "2026-03-15"
updated_by: "TL: Lead Engineer"
status: active
type: template

# BMAD-inspired enhancements
stepsCompleted: ["template-creation", "web-optimization"]
workflowType: "prd"
classification:
  projectType: "Web Application"
  targetFrameworks: ["React", "Vue", "Angular", "Next.js"]
  complexity: "{{COMPLEXITY}}"
  domain: "{{DOMAIN}}"

# Template metadata
templateInfo:
  context: "web"
  suitableFor: ["SPA", "Progressive Web App", "Server-side rendered", "Hybrid web app"]
  requiredSections: ["User Experience", "Browser Compatibility", "Performance Requirements"]
---

# PRD Funcional - {{PROJECT_NAME}}

**Proyecto:** {{PROJECT_NAME}}
**Tipo:** Web Application ({{PROJECT_SUBTYPE}})
**Dominio:** {{DOMAIN}}
**Fecha:** {{DATE}}

---

## 1. Executive Summary

### Vision del Producto

{{PROJECT_NAME}} es una {{PROJECT_DESCRIPTION}} diseñada para {{TARGET_AUDIENCE}} que {{MAIN_VALUE_PROPOSITION}}.

### Contexto Web-Específico

- **Plataforma Principal**: Web Application ({{FRAMEWORK}})
- **Dispositivos Objetivo**: Desktop, Tablet, Mobile (Responsive)
- **Navegadores Soportados**: {{BROWSER_MATRIX}}
- **Arquitectura**: {{WEB_ARCHITECTURE}} (SPA/SSR/Hybrid)

### Valor de Negocio

- **Problema que Resuelve**: {{BUSINESS_PROBLEM}}
- **Audiencia Objetivo**: {{USER_SEGMENTS}}
- **Métricas de Éxito**: {{SUCCESS_METRICS}}

---

## 2. User Personas (Web-Optimized)

### Persona Primaria: {{PRIMARY_PERSONA}}

- **Demografía**: {{PERSONA_DEMOGRAPHICS}}
- **Contexto de Uso Web**: {{WEB_USAGE_CONTEXT}}
- **Dispositivos Preferidos**: {{PREFERRED_DEVICES}}
- **Nivel Técnico**: {{TECHNICAL_LEVEL}}
- **Objetivos en la Plataforma**: {{WEB_GOALS}}
- **Frustaciones Web**: {{WEB_PAIN_POINTS}}

### Persona Secundaria: {{SECONDARY_PERSONA}}

- **Rol**: {{SECONDARY_ROLE}}
- **Necesidades Específicas**: {{SECONDARY_NEEDS}}
- **Interacción con la Aplicación**: {{SECONDARY_INTERACTIONS}}

---

## 3. User Journeys (Web Experience)

### Journey Principal: {{PRIMARY_JOURNEY_NAME}}

#### Pre-Interacción (Discovery)

1. **Descubrimiento**: Usuario llega via {{TRAFFIC_SOURCES}}
2. **Primera Impresión**: {{FIRST_IMPRESSION_GOALS}}
3. **Decisión de Engagement**: {{ENGAGEMENT_DECISION_FACTORS}}

#### Interacción Principal (In-App)

1. **{{STEP_1_NAME}}**
   - **Acción**: {{STEP_1_ACTION}}
   - **Interfaz**: {{STEP_1_UI_ELEMENTS}}
   - **Validaciones**: {{STEP_1_VALIDATIONS}}
   - **Feedback**: {{STEP_1_FEEDBACK}}

2. **{{STEP_2_NAME}}**
   - **Acción**: {{STEP_2_ACTION}}
   - **Componentes**: {{STEP_2_COMPONENTS}}
   - **Estados**: {{STEP_2_STATES}}
   - **Transiciones**: {{STEP_2_TRANSITIONS}}

3. **{{STEP_3_NAME}}**
   - **Resultado**: {{STEP_3_OUTCOME}}
   - **Confirmación**: {{STEP_3_CONFIRMATION}}
   - **Next Steps**: {{STEP_3_NEXT_ACTIONS}}

#### Post-Interacción (Retention)

1. **Follow-up**: {{FOLLOWUP_ACTIONS}}
2. **Retención**: {{RETENTION_STRATEGY}}
3. **Expansión**: {{EXPANSION_OPPORTUNITIES}}

### Journey Secundario: {{SECONDARY_JOURNEY_NAME}}

- **Trigger**: {{SECONDARY_TRIGGER}}
- **Flujo**: {{SECONDARY_FLOW}}
- **Resultado**: {{SECONDARY_OUTCOME}}

---

## 4. Functional Requirements (Web-Specific)

### 4.1 Core Web Functionality

#### FR-WEB-001: Responsive Design

**Como** {{USER_ROLE}}
**Quiero** que la aplicación se adapte a diferentes tamaños de pantalla
**Para** poder usarla en desktop, tablet y móvil sin perder funcionalidad

**Criterios de Aceptación:**

```gherkin
Given que accedo desde un dispositivo con resolución {{MIN_RESOLUTION}}
When navego por la aplicación
Then todas las funciones principales deben ser accesibles
And la interfaz debe ser clara y usable
```

#### FR-WEB-002: Browser Compatibility

**Como** usuario
**Quiero** que la aplicación funcione en los navegadores principales
**Para** no estar limitado a un navegador específico

**Navegadores Soportados:**

- {{BROWSER_1}} ({{VERSION_1}}+)
- {{BROWSER_2}} ({{VERSION_2}}+)
- {{BROWSER_3}} ({{VERSION_3}}+)
- {{BROWSER_4}} ({{VERSION_4}}+)

#### FR-WEB-003: Progressive Web App (PWA) Features

**Como** usuario frecuente
**Quiero** poder instalar la aplicación como PWA
**Para** tener acceso rápido y experiencia similar a app nativa

**Criterios de Aceptación:**

```gherkin
Given que uso un navegador compatible con PWA
When visito la aplicación
Then debe aparecer la opción de "Añadir a pantalla de inicio"
And la app instalada debe funcionar offline para funciones básicas
```

### 4.2 User Interface Requirements

#### FR-UI-001: {{UI_FEATURE_1}}

**Como** {{USER_ROLE}}
**Quiero** {{UI_FUNCTIONALITY_1}}
**Para** {{UI_BENEFIT_1}}

**Criterios de Aceptación:**

```gherkin
Given que estoy en {{UI_CONTEXT_1}}
When {{UI_ACTION_1}}
Then {{UI_EXPECTED_RESULT_1}}
And {{UI_ADDITIONAL_VALIDATION_1}}
```

#### FR-UI-002: {{UI_FEATURE_2}}

**Como** {{USER_ROLE}}
**Quiero** {{UI_FUNCTIONALITY_2}}
**Para** {{UI_BENEFIT_2}}

**Componentes UI Requeridos:**

- {{COMPONENT_1}}: {{COMPONENT_1_DESCRIPTION}}
- {{COMPONENT_2}}: {{COMPONENT_2_DESCRIPTION}}
- {{COMPONENT_3}}: {{COMPONENT_3_DESCRIPTION}}

### 4.3 Web-Specific User Experience

#### FR-UX-001: Page Load Performance

**Como** usuario
**Quiero** que las páginas carguen rápidamente
**Para** tener una experiencia fluida

**Criterios de Aceptación:**

```gherkin
Given que accedo a cualquier página de la aplicación
When la página comienza a cargar
Then el LCP (Largest Contentful Paint) debe ser < 2.5s
And el FID (First Input Delay) debe ser < 100ms
And el CLS (Cumulative Layout Shift) debe ser < 0.1
```

#### FR-UX-002: Navigation & Routing

**Como** usuario
**Quiero** navegar intuitivamente por la aplicación
**Para** completar mis tareas eficientemente

**Estructura de Navegación:**

- {{NAV_SECTION_1}}: {{NAV_SECTION_1_DESCRIPTION}}
- {{NAV_SECTION_2}}: {{NAV_SECTION_2_DESCRIPTION}}
- {{NAV_SECTION_3}}: {{NAV_SECTION_3_DESCRIPTION}}

### 4.4 Domain-Specific Features ({{DOMAIN}})

#### FR-{{DOMAIN}}-001: {{DOMAIN_FEATURE_1}}

**Como** {{DOMAIN_USER_ROLE}}
**Quiero** {{DOMAIN_FUNCTIONALITY_1}}
**Para** {{DOMAIN_BENEFIT_1}}

**Criterios de Aceptación:**

```gherkin
Given que {{DOMAIN_CONTEXT_1}}
When {{DOMAIN_ACTION_1}}
Then {{DOMAIN_EXPECTED_RESULT_1}}
And {{DOMAIN_COMPLIANCE_CHECK_1}}
```

---

## 5. Web Technology Constraints

### 5.1 Technical Stack Requirements

- **Frontend Framework**: {{FRONTEND_FRAMEWORK}}
- **State Management**: {{STATE_MANAGEMENT}}
- **Routing**: {{ROUTING_SOLUTION}}
- **Build Tool**: {{BUILD_TOOL}}
- **CSS Framework**: {{CSS_FRAMEWORK}}

### 5.2 Performance Requirements

- **Initial Bundle Size**: < {{MAX_BUNDLE_SIZE}}KB (gzipped)
- **Code Splitting**: Implement route-based and component-based splitting
- **Caching Strategy**: {{CACHING_STRATEGY}}
- **CDN Requirements**: {{CDN_REQUIREMENTS}}

### 5.3 SEO Requirements (if applicable)

- **Meta Tags**: Comprehensive meta tag strategy
- **Structured Data**: {{STRUCTURED_DATA_REQUIREMENTS}}
- **Sitemap**: Automated sitemap generation
- **Open Graph**: Social media sharing optimization

---

## 6. Integration Requirements

### 6.1 Backend Integration

- **API Architecture**: {{API_ARCHITECTURE}}
- **Authentication**: {{AUTH_METHOD}}
- **Data Format**: {{DATA_FORMAT}}
- **Real-time Features**: {{REALTIME_REQUIREMENTS}}

### 6.2 Third-Party Integrations

- {{INTEGRATION_1}}: {{INTEGRATION_1_PURPOSE}}
- {{INTEGRATION_2}}: {{INTEGRATION_2_PURPOSE}}
- {{INTEGRATION_3}}: {{INTEGRATION_3_PURPOSE}}

---

## 7. Accessibility & Compliance (Web)

### 7.1 Accessibility Requirements (WCAG 2.1)

- **Level**: {{WCAG_LEVEL}} (A/AA/AAA)
- **Screen Reader Support**: {{SCREEN_READER_SUPPORT}}
- **Keyboard Navigation**: Full keyboard accessibility
- **Color Contrast**: {{COLOR_CONTRAST_RATIO}}

### 7.2 Web Compliance

- **Privacy Policy**: {{PRIVACY_REQUIREMENTS}}
- **Cookie Consent**: {{COOKIE_CONSENT_REQUIREMENTS}}
- **Data Protection**: {{DATA_PROTECTION_COMPLIANCE}}

---

## 8. Success Metrics (Web-Specific)

### 8.1 User Experience Metrics

- **Page Load Speed**: LCP < 2.5s, FID < 100ms
- **Bounce Rate**: < {{TARGET_BOUNCE_RATE}}%
- **Session Duration**: > {{TARGET_SESSION_DURATION}} minutes
- **Pages per Session**: > {{TARGET_PAGES_PER_SESSION}}

### 8.2 Conversion Metrics

- **Primary Conversion**: {{PRIMARY_CONVERSION_METRIC}}
- **Secondary Conversion**: {{SECONDARY_CONVERSION_METRIC}}
- **User Retention**: {{RETENTION_METRICS}}

### 8.3 Technical Metrics

- **Browser Compatibility**: 99%+ success rate across supported browsers
- **Uptime**: {{UPTIME_TARGET}}%
- **Error Rate**: < {{ERROR_RATE_TARGET}}%

---

## 9. Assumptions & Dependencies

### 9.1 Technical Assumptions

- Users have JavaScript enabled
- Modern browser support (ES6+)
- Stable internet connection for core features
- {{ADDITIONAL_TECHNICAL_ASSUMPTIONS}}

### 9.2 Business Dependencies

- {{BUSINESS_DEPENDENCY_1}}
- {{BUSINESS_DEPENDENCY_2}}
- {{BUSINESS_DEPENDENCY_3}}

---

## 10. Out of Scope (V1)

### 10.1 Features Explicitly Excluded

- {{OUT_OF_SCOPE_FEATURE_1}}
- {{OUT_OF_SCOPE_FEATURE_2}}
- {{OUT_OF_SCOPE_FEATURE_3}}

### 10.2 Future Considerations

- {{FUTURE_FEATURE_1}}: {{FUTURE_ROADMAP_1}}
- {{FUTURE_FEATURE_2}}: {{FUTURE_ROADMAP_2}}

---

## Validación y Próximos Pasos

### Pre-Development Checklist

- [ ] Wireframes/Mockups completados
- [ ] User flows validados con UX team
- [ ] Technical feasibility confirmada
- [ ] Performance targets definidos
- [ ] Browser testing strategy establecida

### Handoff to Development

- **Technical PRD**: Required for technical specifications
- **Architecture Document**: System design and component architecture
- **API Specification**: Backend integration details
- **Design System**: UI components and style guide

---

**Documento generado con Template Web-Optimizado**
**Compatible con BMAD Method validation standards**
**Optimizado para {{FRAMEWORK}} applications**
