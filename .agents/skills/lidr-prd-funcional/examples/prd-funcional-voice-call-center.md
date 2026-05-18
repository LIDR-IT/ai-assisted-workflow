# PRD Funcional: Voice Verification para Call Center

**Proyecto**: Voice Authentication System for Customer Service
**Cliente**: Telefónica España (ejemplo)
**Fecha**: 2026-03-15
**Versión**: 1.0
**Owner**: Product Manager - Customer Experience
**Reviewers**: Operations Manager, IT Security, Customer Service Director

## 1. Resumen Ejecutivo

### 1.1 Objetivo del Producto

Implementar autenticación por voz en el call center para reemplazar la verificación tradicional mediante preguntas personales, reduciendo el tiempo de autenticación de 2.5 minutos a 15 segundos y mejorando la seguridad anti-fraude.

### 1.2 Problema a Resolver

Los clientes dedican 180 segundos promedio a responder preguntas de verificación (fecha nacimiento, últimas facturas, direcciones), generando frustración y costos operativos elevados. El 34% de las llamadas son abandonadas durante la verificación.

### 1.3 Métricas de Éxito

| Métrica                 | Baseline | Target 6M |
| ----------------------- | -------- | --------- |
| Tiempo de autenticación | 2.5 min  | 15s       |
| Abandono durante auth   | 34%      | 8%        |
| Satisfacción CSAT       | 6.2/10   | 8.5/10    |
| Costos por llamada      | €3.20    | €1.80     |

## 2. Contexto y Audiencia

### 2.1 Situación Actual

El proceso de verificación telefónica requiere:

1. **Datos personales**: Nombre completo, fecha nacimiento
2. **Preguntas de seguridad**: Últimas facturas, direcciones, familiares autorizados
3. **Verificación adicional**: En caso de dudas, más preguntas
4. **Escalamiento**: Si fallan 2 intentos, transfer a supervisión

**Problemas identificados**:

- Clientes olvidan información personal
- Preguntas invasivas generan incomodidad
- Process propenso a ingeniería social
- Tiempo de verificación variable (45s - 6min)

### 2.2 Oportunidad de Negocio

- **Volume**: 2.8M llamadas de atención al cliente/mes
- **Call center cost**: €8.9M anuales en tiempo de verificación
- **Customer churn**: 12% de clientes citan "mal servicio telefónico"
- **Fraud losses**: €340K anuales en fraude telefónico

## 3. Usuarios y Personas

### 3.1 Persona Primaria: "Busy Professional Laura"

- **Demographics**: 35-45 años, ejecutiva, ingresos altos
- **Call patterns**: Llama durante commute o breaks de trabajo
- **Frustrations**:
  - "Odio tener que recordar cuándo pagué la última factura"
  - "¿Por qué necesito repetir mi DNI si ya marqué mi número de cliente?"
- **Expectativas**: Reconocimiento automático, proceso rápido
- **Quote**: "Mi voz debería ser suficiente para demostrar que soy yo"

### 3.2 Persona Secundaria: "Elder Customer Roberto"

- **Demographics**: 65+ años, pensionista, usuario básico
- **Call patterns**: Llama en horarios específicos, consultas largas
- **Concerns**:
  - "¿Es seguro que graben mi voz?"
  - "¿Qué pasa si estoy resfriado?"
- **Needs**: Seguridad, explicaciones claras, fallback humano
- **Quote**: "Mientras sea seguro y no me complique la vida, vale"

### 3.3 Persona Terciaria: "Call Center Agent María"

- **Role**: Agente de atención al cliente, 3 años experiencia
- **Daily challenges**:
  - 45 llamadas/día promedio
  - 35% del tiempo en verificación
  - Clientes frustrados antes de empezar a resolver problemas
- **Needs**: Herramientas que agilicen el proceso
- **Quote**: "Si no tengo que hacer 5 preguntas de verificación, puedo enfocarme en ayudar realmente"

## 4. User Journey Mapping

### 4.1 Journey Actual (TO-BE Replaced)

```
Llamada → IVR → Queue → Agent pickup → Greeting → Manual verification (2.5min) → Issue resolution → Closure
Pain points: Wait time, repetitive questions, memory burden, fraud risk
```

### 4.2 Journey Objetivo (TO-BE Voice)

```
Llamada → IVR → Voice enrollment check → Voice verification (15s) → Issue resolution → Closure
Benefits: Instant recognition, seamless experience, enhanced security
```

### 4.3 Journey Detallado - First Time User

#### Enrollment Flow (Primera Llamada)

1. **Call initiation** (0s)
   - Cliente llama al número habitual
   - IVR detecta número no registrado para voice

2. **Enrollment invitation** (10s)
   - "Para mejorar tu experiencia, queremos configurar verificación por voz"
   - "Es rápido, seguro, y evitará preguntas en futuras llamadas"
   - Opción: Continuar o Skip to traditional

3. **Consent capture** (20s)
   - Explicación clara del uso de datos biométricos
   - "Tu voz será convertida en una huella digital única"
   - "Se almacena de forma segura y puedes revocarla cuando quieras"
   - Confirmación verbal: "¿Autorizas? Di SÍ o NO"

4. **Voice enrollment** (30s)
   - "Lee esta frase: 'Mi voz es mi contraseña para Telefónica'"
   - Repetir 2-3 veces para crear template robusto
   - Análisis de calidad en tiempo real

5. **Enrollment confirmation** (10s)
   - "Perfecto, ya tienes verificación por voz configurada"
   - "En próximas llamadas solo tendrás que decir tu frase"
   - Proceder con consulta actual

#### Returning User Flow

1. **Call recognition** (5s)
   - IVR detecta número registrado
   - "Di tu frase de voz para verificarte"

2. **Voice verification** (10s)
   - Cliente dice: "Mi voz es mi contraseña para Telefónica"
   - Matching 1:1 contra template almacenado
   - Anti-spoofing automático

3. **Authentication result** (0s)
   - Si match > 0.80: "Verificado. Te conecto con un agente"
   - Si match < 0.80: Fallback a verificación tradicional

### 4.4 Error Scenarios y Recovery

#### Enrollment Failures

| Scenario         | User Experience                                                | Recovery          |
| ---------------- | -------------------------------------------------------------- | ----------------- |
| Background noise | "Hay mucho ruido. ¿Puedes repetir en un lugar más silencioso?" | Retry + tips      |
| Voice too low    | "No te escucho bien. ¿Puedes hablar más alto?"                 | Volume adjustment |
| Wrong language   | "Detectamos que hablas en [idioma]. Cambiando idioma..."       | Language switch   |

#### Verification Failures

| Scenario                | User Experience                                                  | Recovery             |
| ----------------------- | ---------------------------------------------------------------- | -------------------- |
| Voice changed (illness) | "Tu voz suena diferente. Te haré unas preguntas rápidas."        | Fallback tradicional |
| Background noise        | "Hay interferencias. ¿Puedes repetir?"                           | Retry con tips       |
| No match                | "No hemos podido verificarte por voz. Verificación tradicional." | Traditional flow     |

## 5. Functional Requirements

### 5.1 Core Voice Features

#### F1: Voice Enrollment

- **F1.1**: Detect first-time callers and offer enrollment
- **F1.2**: Capture verbal consent for biometric data processing
- **F1.3**: Record voice samples (2-3 repetitions of passphrase)
- **F1.4**: Generate voice template with anti-spoofing features
- **F1.5**: Store encrypted template linked to customer ID

#### F2: Voice Verification

- **F2.1**: Recognize returning customers by phone number
- **F2.2**: Prompt for voice passphrase
- **F2.3**: Real-time voice template matching (1:1)
- **F2.4**: Anti-spoofing detection (synthetic voice, recordings)
- **F2.5**: Score-based decision (accept > 0.80, reject < 0.60, manual 0.60-0.80)

#### F3: Fallback Mechanisms

- **F3.1**: Automatic fallback to traditional verification when voice fails
- **F3.2**: Agent override capability for edge cases
- **F3.3**: Re-enrollment option for voice template updates
- **F3.4**: Opt-out mechanism for customers who prefer traditional

#### F4: Multi-language Support

- **F4.1**: Spanish (Castilian) primary language
- **F4.2**: Catalan support for Catalonia region
- **F4.3**: Basic English for international customers
- **F4.4**: Automatic language detection from speech

### 5.2 IVR Integration Features

#### F5: Call Flow Orchestration

- **F5.1**: Seamless integration with existing IVR system
- **F5.2**: Dynamic routing based on verification result
- **F5.3**: Queue prioritization for verified customers
- **F5.4**: Agent screen-pop with verification status

#### F6: Real-time Performance

- **F6.1**: Voice processing < 3 seconds end-to-end
- **F6.2**: Concurrent processing for 500+ simultaneous calls
- **F6.3**: Graceful degradation under high load
- **F6.4**: Real-time monitoring and alerting

### 5.3 Security & Compliance

#### F7: Data Protection (GDPR)

- **F7.1**: Explicit consent capture and storage
- **F7.2**: Granular consent management (enroll/verify/retention)
- **F7.3**: Right to data deletion/voice template removal
- **F7.4**: Audit trail of all voice processing activities
- **F7.5**: Data residency compliance (Spain/EU only)

#### F8: Fraud Prevention

- **F8.1**: Synthetic voice detection (AI-generated voices)
- **F8.2**: Recorded voice detection (playback attacks)
- **F8.3**: Cross-channel fraud scoring integration
- **F8.4**: Suspicious pattern detection and flagging

### 5.4 Agent Experience

#### F9: Agent Dashboard

- **F9.1**: Real-time verification status display
- **F9.2**: Voice match score visibility (for transparency)
- **F9.3**: Manual override buttons (accept/reject/re-verify)
- **F9.4**: Customer voice enrollment status history

#### F10: Training & Support

- **F10.1**: Agent training materials for voice verification
- **F10.2**: Troubleshooting guides for common voice issues
- **F10.3**: Escalation procedures for voice verification failures
- **F10.4**: Performance metrics dashboard (success rates, timing)

## 6. Out of Scope (v1.0)

### Technical Limitations

- **Voice identification (1:N)**: Solo 1:1 verification vs customer database
- **Real-time transcription**: No speech-to-text integration
- **Emotional analysis**: No sentiment or stress detection
- **Multi-speaker detection**: Solo single speaker per call

### Business Limitations

- **Outbound calls**: Solo inbound customer service calls
- **Sales verification**: Solo for existing customer support
- **Third-party authorization**: Solo primary account holder
- **Cross-brand verification**: Solo Telefónica España customers

## 7. Success Metrics

### 7.1 Operational Metrics

| Métrica                          | Baseline       | Target 3M      | Target 6M      |
| -------------------------------- | -------------- | -------------- | -------------- |
| **Authentication time**          | 2.5 min        | 45s            | 15s            |
| **First call resolution**        | 67%            | 78%            | 85%            |
| **Agent productivity**           | 6.2 calls/hour | 8.5 calls/hour | 9.8 calls/hour |
| **Call abandonment during auth** | 34%            | 15%            | 8%             |

### 7.2 Customer Experience

| Métrica                        | Baseline | Target 6M |
| ------------------------------ | -------- | --------- |
| **CSAT score**                 | 6.2/10   | 8.5/10    |
| **NPS**                        | 12       | 45+       |
| **Voice enrollment rate**      | 0%       | 70%       |
| **Voice verification success** | N/A      | 92%       |

### 7.3 Business Impact

| Métrica                | Annual Impact             |
| ---------------------- | ------------------------- |
| **Cost savings**       | €2.1M (reduced auth time) |
| **Fraud reduction**    | €280K (improved security) |
| **Customer retention** | +1.8% (better experience) |

### 7.4 Technical KPIs

- **Voice processing latency**: <3s P95
- **System availability**: >99.9%
- **False Accept Rate**: <0.01%
- **False Reject Rate**: <5%
- **Enrollment success rate**: >85%

## 8. Implementation Phases

### Phase 1: Core Voice Verification (Month 1-2)

- Basic enrollment and verification
- Spanish language only
- Manual fallback procedures
- 10% of call volume pilot

### Phase 2: Enhanced Features (Month 3-4)

- Anti-spoofing improvements
- Agent dashboard integration
- Performance optimization
- 50% call volume rollout

### Phase 3: Full Launch (Month 5-6)

- Multi-language support
- Advanced fraud detection
- Complete agent training
- 100% call volume capability

---

**Stakeholder Sign-off Required**:

- Customer Service Director (user experience)
- IT Security Officer (biometric data protection)
- Operations Manager (call center workflow)
- Legal/DPO (GDPR compliance)

**Next Steps**: Technical PRD + Architecture design + GDPR DPIA preparation
