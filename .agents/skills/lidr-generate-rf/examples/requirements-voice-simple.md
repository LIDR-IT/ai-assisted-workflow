# Requisitos Funcionales: Voice Verification Call Center

**Proyecto**: Telefónica Voice Authentication
**Generado desde**: PRD Funcional v1.0
**Fecha**: 2026-03-15
**Complejidad**: Simple (5 RFs core)

## RF-001: Enrollment de Voz por Teléfono

**Como** cliente que llama por primera vez al call center
**Quiero** registrar mi voz de forma sencilla y segura
**Para** evitar responder preguntas personales en futuras llamadas

### Criterios de Aceptación

**Escenario 1: Enrollment exitoso**

```gherkin
Given soy un cliente nuevo en verificación por voz
  And llamo al 1004 de atención al cliente
When el IVR detecta que no tengo voice profile
  And me ofrece "configurar verificación por voz"
  And acepto diciendo "SÍ"
Then debe explicarme el proceso en lenguaje simple
  And debe pedirme que diga "Mi voz es mi contraseña para Telefónica"
  And debe repetir 3 veces para crear un perfil robusto
  And debe confirmar "Ya tienes verificación por voz configurada"
```

**Escenario 2: Cliente rechaza enrollment**

```gherkin
Given el IVR me ofrece configurar verificación por voz
When respondo "NO" o no respondo nada
Then debe continuar con verificación tradicional
  And debe permitir configurar voice verification en el futuro
  And no debe insistir más durante esta llamada
```

**Escenario 3: Problema durante enrollment**

```gherkin
Given estoy en proceso de enrollment
When hay ruido de fondo o línea de mala calidad
Then debe detectar automáticamente la mala calidad
  And debe sugerir "¿Puedes llamar desde un lugar más silencioso?"
  And debe permitir reintentar o continuar sin voice verification
```

---

## RF-002: Verificación de Voz para Clientes Registrados

**Como** cliente que ya tiene voice verification configurada
**Quiero** autenticarme diciendo mi frase
**Para** acceder rápidamente al servicio sin preguntas

### Criterios de Aceptación

**Escenario 1: Verificación exitosa**

```gherkin
Given soy un cliente con voice verification configurada
  And llamo desde mi número registrado
When el IVR me pide "Di tu frase de voz"
  And digo "Mi voz es mi contraseña para Telefónica"
Then debe verificar mi identidad en menos de 10 segundos
  And debe responder "Verificado. Te conecto con un agente"
  And debe conectarme directamente sin más preguntas
```

**Escenario 2: Verificación fallida**

```gherkin
Given intento verificarme con mi voz
When el sistema no puede confirmar mi identidad (voz diferente por resfriado)
Then debe decir "No hemos podido verificarte por voz"
  And debe continuar automáticamente con verificación tradicional
  And debe hacer las preguntas de seguridad habituales
```

**Escenario 3: Múltiples intentos fallidos**

```gherkin
Given fallo la verificación por voz 2 veces seguidas
When intento una tercera vez
Then debe bloquear verificación por voz temporalmente
  And debe pasar a verificación tradicional
  And debe sugerir re-enrollment después de la llamada
```

---

## RF-003: Consentimiento y Privacidad

**Como** cliente preocupado por la privacidad
**Quiero** entender y controlar cómo se usa mi voz
**Para** dar un consentimiento informado

### Criterios de Aceptación

**Escenario 1: Explicación clara antes del enrollment**

```gherkin
Given el IVR me ofrece configurar verificación por voz
When acepto conocer más información
Then debe explicar claramente:
  - "Tu voz se convierte en una huella digital única"
  - "Se almacena de forma segura en España"
  - "Se elimina automáticamente si no llamas en 2 años"
  - "Puedes desactivarla cuando quieras"
  And debe preguntar "¿Autorizas este uso de tu voz?"
```

**Escenario 2: Revocación de consentimiento**

```gherkin
Given tengo voice verification activa
When llamo y pido hablar con un agente
  And solicito "quiero desactivar la verificación por voz"
Then el agente debe:
  - Verificar mi identidad por métodos tradicionales
  - Eliminar inmediatamente mi perfil de voz
  - Confirmar "Tu perfil de voz ha sido eliminado"
  And en futuras llamadas debe usar verificación tradicional
```

---

## RF-004: Fallback a Verificación Tradicional

**Como** sistema de call center
**Quiero** tener siempre una alternativa de verificación
**Para** no dejar a ningún cliente sin servicio

### Criterios de Aceptación

**Escenario 1: Fallback automático**

```gherkin
Given la verificación por voz no está disponible por:
  - Fallo técnico del sistema
  - Calidad de línea insuficiente
  - Cliente sin voice profile
When el IVR detecta esta situación
Then debe automáticamente pasar a preguntas de verificación:
  - "Dime tu fecha de nacimiento"
  - "¿Cuál fue el importe de tu última factura?"
  - "¿Cuál es tu dirección de correspondencia?"
```

**Escenario 2: Escalamiento manual**

```gherkin
Given un cliente no puede verificarse ni por voz ni por preguntas
When el agente lo detecta
Then debe poder realizar verificación manual adicional:
  - Preguntas sobre historial de servicios
  - Verificación por SMS al móvil registrado
  - Verificación documental si es necesario
```

---

## RF-005: Integración con Sistema Existente

**Como** agente de atención al cliente
**Quiero** ver el resultado de la verificación en mi pantalla
**Para** saber inmediatamente si el cliente está verificado

### Criterios de Aceptación

**Escenario 1: Información clara para el agente**

```gherkin
Given un cliente se está verificando por voz
When me llega la llamada a mi puesto
Then mi pantalla debe mostrar:
  - Estado: "VERIFICADO POR VOZ" en verde
  - Confianza: Score de matching (ej: 92%)
  - Método: "Voice Verification"
  - Timestamp: Hora exacta de la verificación
  And debo poder proceder directamente a ayudar al cliente
```

**Escenario 2: Verificación manual pendiente**

```gherkin
Given un cliente requiere verificación adicional
When me llega la llamada
Then mi pantalla debe mostrar:
  - Estado: "VERIFICACIÓN MANUAL REQUERIDA" en amarillo
  - Motivo: "Voice verification inconclusive"
  - Acciones: Lista de preguntas de verificación sugeridas
  And debo completar la verificación antes de dar servicio
```

**Escenario 3: Cliente no verificado**

```gherkin
Given un cliente no ha pasado ninguna verificación
When recibo la llamada
Then mi pantalla debe mostrar:
  - Estado: "NO VERIFICADO" en rojo
  - Instrucción: "Completar verificación de identidad"
  - Bloqueador: No puedo acceder a datos sensibles del cliente
```

---

## Criterios de Calidad Global

### Performance

- **Enrollment**: <60 segundos proceso completo
- **Verification**: <10 segundos desde frase hasta resultado
- **Fallback**: <5 segundos para cambiar a método tradicional

### Accuracy

- **False Accept Rate**: <0.01% (muy difícil que un impostor pase)
- **False Reject Rate**: <5% (95% de usuarios legítimos pasan)
- **System Availability**: >99.9% (menos de 9 horas down/año)

### User Experience

- **Adoption Rate**: >70% de clientes elegibles completan enrollment
- **Satisfaction**: >80% prefieren voice vs preguntas tradicionales
- **Support Impact**: <10 llamadas/mes sobre problemas de voice verification

---

**Trazabilidad**:

- Epic: VOICE-100
- Features: VOICE-101 (Enrollment), VOICE-102 (Verification), VOICE-103 (Privacy)
- NFRs: Pendientes de generar con skill generate-nfr
