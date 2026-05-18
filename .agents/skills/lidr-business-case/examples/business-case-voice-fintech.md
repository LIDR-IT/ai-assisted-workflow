# Business Case: Voice Verification para Fintech Argentina

**Cliente**: Mercado Pago / Ualá (fintech example)
**Producto**: {{CLIENT_NAME}} Voice + Platform
**Presupuesto Estimado**: €95K
**Timeline**: 4 meses
**Tipo**: Expansión de cliente existente

## 1. Problema de Negocio

### Situación Actual

- **Autenticación telefónica**: 8 minutos promedio por llamada
- **Call center saturado**: 45% de llamadas abandonan tras 4 min en cola
- **Costos operativos**: €4.50 por transacción telefónica autenticada
- **Fraude telefónico**: 1.8% de transacciones telefónicas son fraudulentas
- **Compliance**: Necesita cumplir PCI DSS + BCRA normativa argentina

### Contexto Regional

- **Argentina**: 89% de transacciones financieras por mobile/web
- **Cultura telefónica fuerte**: 67% usuarios prefieren teléfono para soporte
- **Español Argentino**: Variantes regionales (Rioplatense, Cordobés, Norteño)
- **Regulación BCRA**: Requiere strong authentication para transfers > $50K ARS

### Impacto en el Negocio

- **Volume**: 180K llamadas/mes de autenticación
- **Costo call center**: €810K anuales
- **Revenue perdido**: €1.2M por transacciones abandonadas
- **Fraude losses**: €45K anuales en transacciones telefónicas fraudulentas

## 2. Solución Propuesta

### Componentes Tecnológicos

| Producto {{CLIENT_NAME}}  | Función                                | Cumplimiento                 |
| ------------------------- | -------------------------------------- | ---------------------------- |
| **Voice Verification**    | Autenticación por voz (1:1 matching)   | ISO 19794-13 voice templates |
| **Anti-spoofing**         | Detección de ataques sintéticos/replay | ISO 30107-1 PAD              |
| **Platform**              | Orquestación + analytics               | PCI DSS Level 1 compliance   |
| **Spanish Language Pack** | Optimizado para español argentino      | Dialectos regionales trained |

### Flujo de Autenticación Mejorado

1. **Llamada entrante** → IVR detecta número + intent
2. **Voice enrollment** (primera vez) → Graba passphrase "Mi voz es mi contraseña"
3. **Authentication** → Dice passphrase + verificación anti-spoofing
4. **Voice matching 1:1** → Template stored vs voice sample (score > 0.8)
5. **Risk scoring** → Combina voice + behavioral patterns
6. **Decision** → Autoaproval o escalado a agente humano

### GDPR + BCRA Compliance

- **Datos biométricos**: Template irreversible almacenado 60 días max
- **Cross-border**: Datos no salen de Argentina (AWS São Paulo)
- **Audit trail**: Log inmutable de todas las autenticaciones
- **User rights**: Enrollment/un-enrollment por web self-service
- **BCRA Article 5**: Strong customer authentication compliance

## 3. Beneficios Cuantificables

### Reducción de Costos Call Center

| Concepto                   | Actual | Con Voice   | Ahorro Anual |
| -------------------------- | ------ | ----------- | ------------ |
| Tiempo por autenticación   | 8 min  | 45 seg      | €650K        |
| Agentes necesarios         | 85 FTE | 35 FTE      | €420K        |
| Abandono de llamadas       | 45%    | 8% (target) | €380K        |
| **Total ahorro operativo** |        |             | **€1.45M**   |

### Reducción de Fraude

- **Fraud rate telefónico**: 1.8% → 0.3% (target)
- **Ahorro fraude**: €32K anuales
- **False accept rate**: < 0.01% (vs 2.1% actual)

### Mejora de UX

- **NPS telefónico**: 12 → 65 (target)
- **Customer effort score**: 7.2 → 3.1 (target)
- **Retention impact**: +2.3% por mejor experiencia

## 4. Inversión y ROI

### Inversión Total

| Concepto                  | Costo    | Notas                            |
| ------------------------- | -------- | -------------------------------- |
| Voice platform licenses   | €60K     | 200K authentications/month       |
| Spanish language training | €15K     | Argentinian dialect optimization |
| API integration           | €12K     | 6 weeks development              |
| PCI DSS compliance audit  | €8K      | Required for financial services  |
| **Total inversión**       | **€95K** |                                  |

### Retorno Financiero

- **Ahorro directo**: €1.45M (reducción call center)
- **Revenue protection**: €380K (reduced abandonment)
- **Total benefits**: €1.83M
- **ROI año 1**: 1,826% ((1.83M - 0.095M) / 0.095M \* 100)
- **Payback period**: 0.6 meses

## 5. Riesgos Técnicos y Mitigaciones

### Riesgos de Accuracy

| Riesgo                       | Probabilidad | Impacto | Mitigación                             |
| ---------------------------- | ------------ | ------- | -------------------------------------- |
| Dialectos no reconocidos     | Media        | Alto    | Training adicional con corpus regional |
| Calidad línea telefónica     | Alta         | Medio   | Fallback a SMS OTP automático          |
| Enfermedades que cambian voz | Baja         | Alto    | Re-enrollment automático tras 3 fallos |

### Riesgos Regulatorios

- **BCRA changes**: Cláusulas de adaptación regulatoria
- **Data residency**: Hosting exclusivo en AWS São Paulo
- **Cross-border**: Restricción técnica de no transferencia

### Riesgos de Adopción

- **Resistance telefónica**: Comunicación + incentivos enrollment
- **Age demographics**: Fallback a agente humano para 65+
- **Technical literacy**: Onboarding gradual 20% → 80%

## 6. Implementación

### Fase 1: PoC (3 semanas)

- Integración técnica básica
- Testing con 1,000 voces de empleados
- Validación de accuracy con dialectos
- **Go/No-go decision point**

### Fase 2: Desarrollo (8 semanas)

- API completa + anti-spoofing
- IVR integration (Twilio/Asterisk)
- PCI DSS compliance implementation
- Security testing + penetration testing

### Fase 3: Piloto Soft-Launch (3 semanas)

- 5% de llamadas entrantes
- 15,000 authentications reales
- Tuning de umbrales por región
- Training del call center

### Fase 4: Full Rollout (2 semanas)

- Graduación 25% → 75% → 100%
- Monitoring 24/7 + alerting
- Performance optimization

## 7. Métricas de Éxito

### KPIs Operacionales

| Métrica              | Baseline | Target Mes 2 | Target Mes 4 |
| -------------------- | -------- | ------------ | ------------ |
| Tiempo autenticación | 8:00 min | 2:00 min     | 0:45 min     |
| Abandono llamadas    | 45%      | 15%          | 8%           |
| Agents needed        | 85 FTE   | 55 FTE       | 35 FTE       |
| Cost per auth        | €4.50    | €1.50        | €0.85        |

### KPIs de Seguridad

- **False Accept Rate**: < 0.01%
- **False Reject Rate**: < 3%
- **Fraud detection**: > 99.7% de intentos sintéticos detectados
- **Attack resistance**: 0 bypasses confirmed

### KPIs de UX

- **Enrollment rate**: > 85% primera llamada
- **User satisfaction**: NPS > 60
- **Effort score**: < 4.0 (1-10 scale)

## 8. Consideraciones Culturales Argentina

### Dialectos y Variedades

- **Rioplatense** (Buenos Aires, Uruguay): 65% de usuarios
- **Cordobés**: 15% de usuarios
- **Norteño** (Salta, Tucumán): 12% de usuarios
- **Cuyo** (Mendoza): 8% de usuarios

### Patrones de Uso

- **Horarios peak**: 09:00-11:00 y 15:00-18:00 ART
- **Días laborales**: Lunes más pesado, Viernes más liviano
- **Estacionalidad**: Enero 40% menos volume (vacaciones)

### Compliance Local

- **BCRA A5374**: Strong authentication for high-value transfers
- **Ley 25.326**: Protección datos personales (pre-GDPR argentino)
- **UIF**: Unidad de Información Financiera reporting obligatorio

## 9. Integration Architecture

### Technical Stack

```
[Twilio SIP] → [Voice API Gateway] → [{{CLIENT_NAME}} Voice Engine] → [Platform] → [Fintech Backend]
```

### Performance Requirements

- **Voice processing**: < 2 segundos
- **API response time**: < 500ms P95
- **Concurrent users**: 500 simultaneous authentications
- **Availability**: 99.95% (4.5h downtime/year max)

### Security Architecture

- **Voice templates**: Encrypted AES-256, stored 60 días max
- **Network**: VPN dedicado + TLS 1.3
- **Monitoring**: SOC 24/7 + SIEM integration
- **Incident response**: < 15 min para security events

---

**Business Sponsor**: VP Operations + CTO
**Regulatory Approval**: Compliance team + Legal
**Next Steps**: Technical PoC + regulatory review (parallel)
**Decision Timeline**: 3 semanas para approval final
