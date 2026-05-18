# PRD Funcional: {{PRODUCT_NAME_1}} Onboarding Digital Bancario

**Proyecto**: Digital Banking Onboarding Platform
**Cliente**: BBVA España (ejemplo)
**Fecha**: 2026-03-15
**Versión**: 1.0
**Owner**: Product Manager - Digital Experience
**Reviewers**: UX Lead, Compliance Officer, Business Stakeholders

## 1. Resumen Ejecutivo

### 1.1 Objetivo del Producto

Transformar el proceso de onboarding bancario de presencial a 100% digital mediante tecnología biométrica, reduciendo el tiempo de alta de 45 minutos a 3 minutos y cumpliendo con PSD2, GDPR Art. 9, y normativa AML española.

### 1.2 Propuesta de Valor

- **Para el cliente**: Onboarding desde casa en 3 minutos, 24/7, sin colas
- **Para el banco**: Reducción de costos €850K anuales, incremento de conversión +52%, cumplimiento automático
- **Para compliance**: Audit trail completo, GDPR by design, AML automatizado

### 1.3 Métricas de Éxito

| Métrica              | Baseline | Target 6M |
| -------------------- | -------- | --------- |
| Tiempo de onboarding | 45 min   | 3 min     |
| Tasa de abandono     | 67%      | 15%       |
| Cost per acquisition | €25      | €5        |
| NPS onboarding       | 23       | 75+       |

## 2. Contexto y Problema

### 2.1 Situación Actual

El proceso de onboarding actual requiere visita a sucursal:

1. **Cita previa** (3-7 días de espera)
2. **Documentación física** (DNI, nómina, justificantes)
3. **Entrevista presencial** (30-45 min)
4. **Verificaciones manuales** (15-20 min adicionales)
5. **Activación** (24-48h después)

### 2.2 Dolor Points Identificados

- **Fricciones temporales**: Horarios de sucursal, esperas
- **Fricciones geográficas**: Desplazamientos, aparcamiento
- **Fricciones documentales**: Fotocopias, formularios en papel
- **Fricciones digitales**: Apps diferentes para cada paso
- **Fricciones generacionales**: Proceso no optimizado para nativos digitales

### 2.3 Oportunidad de Negocio

- **Mercado objetivo**: 2.3M nuevos clientes potenciales/año
- **Ventaja competitiva**: Primer banco español con onboarding 100% biométrico
- **Compliance advantage**: Cumplimiento automático vs manual propenso a errores
- **Cost leadership**: Reducir dependency de red física

## 3. Usuarios y Personas

### 3.1 Persona Primaria: "Digital Native Ana"

- **Demographics**: 25-35 años, estudios superiores, ingresos €35-65K
- **Tech savviness**: Alta, smartphone como primary device
- **Banking behavior**: Digital-first, espera experiencias como Netflix/Uber
- **Pain points actuales**:
  - "¿Por qué tengo que ir a una sucursal en 2026?"
  - "El proceso debería ser como abrir cuenta en Revolut"
- **Motivaciones**: Rapidez, conveniencia, experiencia premium
- **Quote**: "Si no puedo hacerlo desde el sofá en 5 minutos, cambio de banco"

### 3.2 Persona Secundaria: "Professional Carlos"

- **Demographics**: 35-50 años, ejecutivo/empresario, ingresos €65-150K
- **Tech comfort**: Media-alta, usa smartphone para trabajo
- **Banking behavior**: Busca eficiencia, valora tiempo más que comodidades
- **Pain points actuales**:
  - "No tengo tiempo para ir a la sucursal en horario laboral"
  - "Necesito que el proceso sea rápido y seguro"
- **Motivaciones**: Ahorro de tiempo, prestigio del banco, servicio premium
- **Quote**: "Tiempo es dinero. El banco que me haga perder menos tiempo, gana"

### 3.3 Anti-Persona: "Traditional María"

- **Demographics**: 55+ años, baja adopción digital
- **Comportamiento**: Prefiere trato humano y procesos tradicionales
- **Por qué es anti-persona**: Requiere funcionalidades que contradicen el objetivo de automatización
- **Solución alternativa**: Mantener canal presencial en paralelo

## 4. User Journey Mapping

### 4.1 Journey Estado Actual (TO-BE Eliminated)

```
Awareness → Intent → Research → Visit Branch → Wait → Interview → Documentation → Verification → Manual Review → Account Creation → Cards Shipping → Activation
Timeline: 3-10 días | Touchpoints: 8 | Effort Score: 8.2/10
```

### 4.2 Journey Objetivo (TO-BE Digital)

```
Awareness → Intent → Start App → Identity Verification ({{PRODUCT_NAME_1}}D + {{PRODUCT_NAME_1}}) → Income Verification → Account Creation → Digital Cards → Activation
Timeline: 3-5 minutos | Touchpoints: 3 | Effort Score: 2.1/10
```

### 4.3 Journey Detallado TO-BE

#### Pre-Onboarding

- **Trigger**: Cliente descarga app o accede web
- **Entry point**: Landing page optimizada con CTA "Abrir cuenta en 3 min"
- **Pre-requisitos**: Smartphone con cámara, DNI/NIE español, ingresos mín €18K/año

#### Onboarding Core Flow

1. **Bienvenida y Consentimiento** (30s)
   - Video explicativo del proceso
   - Consentimiento GDPR explícito para datos biométricos
   - Términos y condiciones (resumen ejecutivo + link completo)

2. **Verificación de Identidad** (90s)
   - **{{PRODUCT_NAME_1}}D**: Captura DNI/NIE (anverso + reverso)
   - **OCR automático**: Extracción datos (nombre, fecha nacimiento, número)
   - **NFC reading** (opcional): Verificación chip para mayor seguridad
   - **{{PRODUCT_NAME_1}}**: Selfie con liveness detection (anti-spoofing)
   - **Matching 1:1**: Foto DNI vs selfie (umbral 0.88)

3. **Verificación Financiera** (45s)
   - Conexión con AEAT (autorización fiscal)
   - Import automático datos de ingresos
   - Verificación en centrales de riesgo (CIRBE, ASNEF)

4. **Personalización de Producto** (30s)
   - Selección de cuenta (básica/premium)
   - Configuración inicial (límites, preferencias)
   - Setup de notificaciones

5. **Finalización** (15s)
   - Creación de cuenta exitosa
   - IBAN generado
   - Tarjeta digital disponible (Apple Pay / Google Pay)
   - Tarjeta física enviada (24-48h)

#### Post-Onboarding

- **Activación**: Primera transacción guiada
- **Onboarding de features**: Tutorial interactivo de funcionalidades
- **Support**: Chat bot + escalado a humano si needed

### 4.4 Error Flows y Recovery

| Error Scenario           | User Experience                                        | Recovery Action                |
| ------------------------ | ------------------------------------------------------ | ------------------------------ |
| Document no readable     | "Inténtalo de nuevo. Busca buena iluminación."         | Retry con tips UX              |
| Liveness detection fail  | "No hemos podido verificar que eres una persona real." | Retry + tutorial               |
| 1:1 matching fail        | "Las fotos no coinciden lo suficiente."                | Retry + support option         |
| Income verification fail | "No podemos verificar tus ingresos automáticamente."   | Subida manual de nómina        |
| Age < 18                 | "Debes ser mayor de edad para abrir cuenta."           | Redirect a cuenta joven        |
| Non-resident             | "Necesitas residencia española."                       | Redirect a cuenta no-residente |

## 5. Functional Requirements

### 5.1 Core Features

#### F1: Captura de Documentos ({{PRODUCT_NAME_1}}D)

- **F1.1**: Capturar anverso y reverso de DNI/NIE español
- **F1.2**: OCR automático de datos (nombre, apellidos, fecha nacimiento, número documento)
- **F1.3**: Verificación de formato y validez del documento
- **F1.4**: Detección de documentos falsificados o manipulados
- **F1.5**: Soporte para NFC reading del chip (optional enhancement)

#### F2: Verificación Biométrica ({{PRODUCT_NAME_1}})

- **F2.1**: Captura de selfie con cámara frontal
- **F2.2**: Liveness detection activa (parpadeo, sonrisa, movimiento cabeza)
- **F2.3**: Anti-spoofing (detección fotos, vídeos, máscaras)
- **F2.4**: Extracción de template biométrico facial
- **F2.5**: Matching 1:1 template vs foto del documento (score > 0.88)

#### F3: Onboarding Orchestration

- **F3.1**: Flujo guiado paso a paso con progreso visual
- **F3.2**: Validación en tiempo real de cada paso
- **F3.3**: Recovery automático en caso de errores
- **F3.4**: Timeout management (abandono > 10 min)
- **F3.5**: Save progress para continuar después

#### F4: Compliance y GDPR

- **F4.1**: Consentimiento explícito para datos biométricos
- **F4.2**: Granular consent (OCR, biometry, income verification)
- **F4.3**: Audit trail inmutable de cada paso
- **F4.4**: Data retention automática (templates borrados tras 30 días)
- **F4.5**: Right to withdrawal consent

#### F5: Financial Verification

- **F5.1**: Integración con AEAT para verificación de ingresos
- **F5.2**: Consulta CIRBE para historial crediticio
- **F5.3**: Check ASNEF/other credit bureaus
- **F5.4**: Risk scoring automático
- **F5.5**: Manual override para casos edge

### 5.2 User Experience Features

#### UX1: Mobile-First Design

- **UX1.1**: Responsive design optimizado para móvil
- **UX1.2**: Progressive Web App (PWA) capability
- **UX1.3**: Native app integration (iOS/Android)
- **UX1.4**: Accesibilidad WCAG 2.1 AA compliance
- **UX1.5**: Dark mode support

#### UX2: Guided Experience

- **UX2.1**: Onboarding tooltip y hints contextuales
- **UX2.2**: Real-time feedback (green/red indicators)
- **UX2.3**: Progress bar con time estimation
- **UX2.4**: Help Center integrado con FAQs
- **UX2.5**: Video tutorials para cada paso

#### UX3: Error Handling

- **UX3.1**: Error messages específicos y accionables
- **UX3.2**: Retry mechanisms con improved guidance
- **UX3.3**: Escalación a soporte humano
- **UX3.4**: Fallback a proceso semi-manual
- **UX3.5**: Exit survey para abandonment analysis

## 6. Out of Scope (v1.0)

### Funcionalidades Explicitly Excluidas

- **Non-EU documents**: Solo DNI/NIE español en v1.0
- **Business accounts**: Solo cuentas personales
- **Joint accounts**: Solo titulares individuales
- **Advanced products**: Solo cuenta corriente básica (sin hipotecas, inversiones)
- **Offline capability**: Requiere conexión internet

### Integraciones No Incluidas

- **Open Banking**: Importar cuentas de otros bancos (v2.0)
- **Digital signature**: Firma electrónica de contratos (v2.0)
- **Video KYC**: Videollamada con agente (v1.5)
- **Voice biometry**: Verificación por voz (roadmap 2027)

## 7. Success Metrics y KPIs

### 7.1 Product Metrics

| Métrica                    | Baseline | Target 3M | Target 6M | Método de Medición       |
| -------------------------- | -------- | --------- | --------- | ------------------------ |
| **Conversion rate**        | 33%      | 60%       | 75%       | GA4 + internal analytics |
| **Time to completion**     | 45 min   | 5 min     | 3 min     | Backend timestamps       |
| **Mobile completion rate** | 12%      | 85%       | 92%       | Device detection         |
| **Error rate per step**    | N/A      | <5%       | <2%       | Error tracking logs      |

### 7.2 Business Metrics

| Métrica                         | Baseline | Target 6M | Business Impact        |
| ------------------------------- | -------- | --------- | ---------------------- |
| **Cost per acquisition**        | €25      | €5        | €850K annual savings   |
| **Customer satisfaction (NPS)** | 23       | 75+       | Brand reputation       |
| **Daily onboardings**           | 45       | 200+      | Revenue growth         |
| **Support tickets/onboarding**  | 2.3      | 0.1       | Operational efficiency |

### 7.3 Technical Metrics

| Métrica               | Target | SLA    | Monitoring                        |
| --------------------- | ------ | ------ | --------------------------------- |
| **API response time** | <2s    | 95%    | APM Dashboard                     |
| **Uptime**            | 99.9%  | 99.9%  | StatusPage                        |
| **False Accept Rate** | <0.01% | <0.01% | domain-specific accuracy tracking |
| **False Reject Rate** | <2%    | <3%    | domain-specific accuracy tracking |

### 7.4 Compliance Metrics

- **GDPR compliance score**: 100% (quarterly audit)
- **AML false positive rate**: <5% (regulatory reporting)
- **Data breach incidents**: 0 (mandatory reporting)
- **Regulatory findings**: 0 (audit results)

## 8. Assumptions y Dependencies

### 8.1 Technical Assumptions

- **Mobile camera quality**: 95% devices tienen cámara >5MP
- **Internet connectivity**: Users tienen data/wifi estable
- **AEAT API availability**: >99% uptime para income verification
- **Document validity**: 90%+ users tienen documentos válidos y vigentes

### 8.2 Business Assumptions

- **Regulatory approval**: Banco de España aprova el proceso 100% digital
- **Risk appetite**: Banco acepta aumentar automation vs control manual
- **Marketing support**: Campaign budget para educación y adopción
- **Change management**: Sucursales apoyan reducción de onboarding presencial

### 8.3 External Dependencies

- **{{CLIENT_NAME}} platform**: {{PRODUCT_NAME_1}}D + {{PRODUCT_NAME_1}} APIs available
- **AEAT integration**: API fiscal disponible y stable
- **Credit bureaus**: CIRBE + ASNEF APIs operational
- **Card issuance**: Existing vendor adapted to digital flow
- **Legal review**: Compliance team approves each step

## 9. Risks y Mitigation

### 9.1 Product Risks

| Risk                                            | Impact | Probability | Mitigation                       |
| ----------------------------------------------- | ------ | ----------- | -------------------------------- |
| User adoption slower than expected              | High   | Medium      | Gradual rollout + incentives     |
| domain-specific false negatives frustrate users | High   | Low         | Tuning thresholds + fallbacks    |
| Compliance issues delay launch                  | High   | Low         | Legal review at each milestone   |
| Fraud increase with automation                  | Medium | Medium      | Enhanced monitoring + ML scoring |

### 9.2 Technical Risks

- **API dependencies**: Fallbacks for each external integration
- **Mobile compatibility**: Progressive enhancement for older devices
- **Data security**: End-to-end encryption + penetration testing
- **Performance at scale**: Load testing + auto-scaling architecture

---

**Next Steps**:

1. Technical PRD creation (R&D team)
2. Legal review and regulatory alignment
3. UX wireframe and prototype creation
4. Backend architecture definition
5. Integration planning with existing systems

**Approval Required**: Chief Digital Officer + Head of Compliance
**Timeline**: Review cycle 2 weeks → Gate 1 evaluation
