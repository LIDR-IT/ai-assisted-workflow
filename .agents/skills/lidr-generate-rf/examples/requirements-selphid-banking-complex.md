# Requisitos Funcionales: SelphID Banking Onboarding

**Proyecto**: BBVA Digital Onboarding
**Generado desde**: PRD Funcional v1.0 + PRD Técnico v1.0
**Fecha**: 2026-03-15
**Aprobado por**: Product Owner + QA Lead
**Trazabilidad**: Epic BANK-123 → Features BANK-124, BANK-125, BANK-126

## RF-001: Captura de Documento de Identidad

**Como** cliente que quiere abrir una cuenta bancaria
**Quiero** poder fotografiar mi DNI/NIE con el móvil
**Para** verificar mi identidad sin ir a la sucursal

### Criterios de Aceptación

**Escenario 1: Captura exitosa de DNI anverso**

```gherkin
Given el cliente ha iniciado el proceso de onboarding
  And tiene un DNI español válido
  And está usando un smartphone con cámara >5MP
When selecciona "Fotografiar anverso del DNI"
  And apunta la cámara al anverso del documento
  And el sistema detecta automáticamente los bordes del documento
Then debe mostrar una preview con el documento enmarcado correctamente
  And debe habilitar el botón "Capturar"
  And debe mostrar guías visuales para alineamiento óptimo
```

**Escenario 2: Captura exitosa de DNI reverso**

```gherkin
Given el cliente ha capturado exitosamente el anverso
When selecciona "Fotografiar reverso del DNI"
  And gira el documento para mostrar el reverso
Then debe seguir el mismo proceso de detección automática
  And debe verificar que ambas imágenes pertenecen al mismo documento
  And debe permitir proceder al siguiente paso
```

**Escenario 3: Calidad de imagen insuficiente**

```gherkin
Given el cliente intenta capturar el documento
When la imagen está borrosa, muy oscura, o con reflejos
Then debe mostrar el mensaje "Imagen no clara. Inténtalo de nuevo"
  And debe ofrecer consejos específicos:
    - "Busca buena iluminación sin reflejos"
    - "Mantén el móvil estable"
    - "Asegúrate de que el documento esté completamente visible"
  And debe permitir reintentar la captura
```

**Escenario 4: Documento no reconocido**

```gherkin
Given el cliente presenta un documento no válido (pasaporte extranjero, carnet de conducir)
When el sistema analiza la imagen capturada
Then debe mostrar "Este documento no es válido. Necesitas DNI o NIE español"
  And debe permitir volver a la captura
  And debe ofrecer contacto con atención al cliente si tiene dudas
```

### Criterios de Calidad

- **Performance**: Detección de documento en <2 segundos
- **Accuracy**: 95% de detección correcta en condiciones normales
- **Usabilidad**: Máximo 3 intentos para captura exitosa
- **Accesibilidad**: Compatible con lectores de pantalla

---

## RF-002: Extracción Automática de Datos (OCR)

**Como** sistema de onboarding bancario
**Quiero** extraer automáticamente los datos del documento fotografiado
**Para** evitar entrada manual de datos y reducir errores

### Criterios de Aceptación

**Escenario 1: OCR exitoso de DNI estándar**

```gherkin
Given el cliente ha capturado imágenes de calidad suficiente
  And el DNI es un formato estándar español (post-2006)
When el sistema procesa las imágenes con OCR
Then debe extraer correctamente:
  - Nombre completo
  - Número de DNI (8 dígitos + letra)
  - Fecha de nacimiento (DD/MM/AAAA)
  - Fecha de expedición
  - Fecha de validez
  And debe mostrar los datos extraídos para confirmación
  And debe permitir corrección manual si detecta incertidumbre
```

**Escenario 2: OCR de NIE (Número de Identidad de Extranjero)**

```gherkin
Given el cliente presenta un NIE válido español
When el sistema procesa el documento
Then debe extraer correctamente:
  - Nombre completo
  - Número de NIE (X/Y/Z + 7 dígitos + letra)
  - Nacionalidad
  - Fecha de nacimiento
  And debe validar el formato específico del NIE
  And debe verificar que el documento no está caducado
```

**Escenario 3: Datos parcialmente ilegibles**

```gherkin
Given el documento tiene algunas zonas poco legibles
When el OCR no puede extraer algún campo con confianza >80%
Then debe marcar los campos inciertos como "Verificar manualmente"
  And debe permitir al cliente introducir los datos manualmente
  And debe mantener los campos que sí se extrajeron correctamente
  And debe proceder solo cuando todos los campos estén completos
```

**Escenario 4: Detección de documento falso o manipulado**

```gherkin
Given el cliente presenta un documento potencialmente falsificado
When el sistema analiza patrones de seguridad y consistencia
Then debe detectar inconsistencias como:
  - Tipografías incorrectas
  - Elementos de seguridad ausentes
  - Modificaciones digitales
  And debe marcar la transacción para revisión manual
  And debe permitir continuar con verificación adicional
```

### Criterios de Calidad

- **Accuracy**: 98% para campos estándar en documentos válidos
- **Performance**: Procesamiento OCR en <3 segundos
- **Robustez**: Funciona con documentos ligeramente desgastados
- **Security**: Detección de >90% de falsificaciones obvias

---

## RF-003: Verificación Facial con Liveness Detection

**Como** cliente que ha proporcionado mi documento
**Quiero** que el sistema verifique que soy realmente yo
**Para** demostrar que la persona que abre la cuenta es el titular del documento

### Criterios de Aceptación

**Escenario 1: Selfie simple con liveness pasivo**

```gherkin
Given el cliente ha completado la captura del documento
When accede a la verificación facial
  And toma un selfie mirando directamente a la cámara
Then el sistema debe:
  - Detectar una cara humana real (no foto ni pantalla)
  - Verificar que los ojos están abiertos y mirando a cámara
  - Confirmar que hay movimientos micro-faciales naturales
  And debe proceder al matching 1:1 con la foto del documento
```

**Escenario 2: Liveness activo con desafíos**

```gherkin
Given el sistema requiere verificación adicional de liveness
When solicita al cliente realizar acciones específicas:
  - "Sonríe naturalmente"
  - "Parpadea lentamente"
  - "Gira ligeramente la cabeza a la derecha"
Then el cliente debe completar cada acción en el tiempo indicado
  And el sistema debe validar que las acciones son naturales
  And debe rechazar respuestas robóticas o pregrabadas
```

**Escenario 3: Detección de spoofing (foto o vídeo)**

```gherkin
Given un intento de engañar al sistema con una foto impresa
When el cliente presenta la foto ante la cámara
Then el sistema debe detectar:
  - Falta de profundidad 3D
  - Ausencia de movimientos oculares naturales
  - Reflexiones anómalas o texturas de papel
  And debe rechazar la verificación
  And debe solicitar repetir con instrucciones anti-spoofing
```

**Escenario 4: Condiciones de iluminación difíciles**

```gherkin
Given el cliente está en un entorno con poca luz o contraluces
When intenta realizar la verificación facial
Then el sistema debe:
  - Detectar automáticamente condiciones subóptimas
  - Proporcionar feedback en tiempo real ("Busca mejor luz")
  - Ajustar los umbrales de confianza según las condiciones
  And debe permitir completar la verificación si es técnicamente viable
  Or debe sugerir cambiar de ubicación para mejor iluminación
```

### Criterios de Calidad

- **False Accept Rate (FAR)**: <0.01% (1 en 10,000)
- **False Reject Rate (FRR)**: <2% (98% de usuarios legítimos pasan)
- **Spoofing Detection**: >99% de detección de fotos/vídeos
- **Performance**: Verificación en <5 segundos

---

## RF-004: Matching 1:1 Documento vs Selfie

**Como** sistema de verificación de identidad
**Quiero** comparar la foto del documento con el selfie del cliente
**Para** confirmar que ambas imágenes corresponden a la misma persona

### Criterios de Aceptación

**Escenario 1: Match exitoso con alta confianza**

```gherkin
Given el cliente ha proporcionado documento válido y selfie con liveness
When el sistema compara ambas imágenes biométricamente
  And extrae y compara las características faciales únicas
Then debe calcular un score de similitud
  And si el score es >0.88 (umbral de alta confianza)
Then debe marcar la verificación como "EXITOSA"
  And debe permitir continuar con el siguiente paso del onboarding
```

**Escenario 2: Match con confianza media (revisión manual)**

```gherkin
Given la comparación biométrica da un score entre 0.70 y 0.87
When el resultado está en zona de incertidumbre
Then debe marcar la verificación como "REVISIÓN MANUAL REQUERIDA"
  And debe enviar el caso a un agente especializado
  And debe informar al cliente que habrá una verificación adicional
  And debe proporcionar un tiempo estimado de respuesta (24-48h)
```

**Escenario 3: No match - personas diferentes**

```gherkin
Given las imágenes corresponden claramente a personas diferentes
When el score de matching es <0.70
Then debe marcar la verificación como "FALLIDA"
  And debe permitir al cliente repetir todo el proceso una vez
  And debe sugerir verificar que está usando su propio documento
  And si falla el segundo intento, debe escalar a soporte humano
```

**Escenario 4: Factores que afectan el matching**

```gherkin
Given existen diferencias menores explicables entre las imágenes:
  - Envejecimiento natural (documento de hace años)
  - Cambios de peso facial
  - Diferencias de iluminación o ángulo
  - Uso de gafas (si no las llevaba en el documento o viceversa)
When el sistema detecta estas variaciones
Then debe aplicar algoritmos de compensación
  And debe ajustar dinámicamente los umbrales de confianza
  And debe priorizar características faciales más estables
```

### Criterios de Calidad

- **Accuracy**: 99.5% para casos obvios (muy similar o muy diferente)
- **Consistency**: Mismo resultado para mismas imágenes
- **Bias Mitigation**: Performance equitativo independientemente de edad, género, etnia
- **Performance**: Matching en <2 segundos

---

## RF-005: Gestión de Consentimiento GDPR

**Como** persona física cuyos datos biométricos van a ser procesados
**Quiero** dar mi consentimiento explícito y granular
**Para** cumplir con GDPR Art. 9 y mantener control sobre mis datos

### Criterios de Aceptación

**Escenario 1: Presentación clara del consentimiento**

```gherkin
Given el cliente va a iniciar la verificación biométrica
When accede por primera vez al proceso
Then debe mostrar una explicación clara que incluya:
  - "Vamos a procesar tu imagen facial para verificar tu identidad"
  - "Esto incluye crear una 'huella digital' de tu rostro"
  - "Los datos se eliminarán automáticamente en 30 días"
  - "Puedes retirar tu consentimiento en cualquier momento"
  And debe presentar opciones "ACEPTO" y "NO ACEPTO" claramente diferenciadas
  And no debe permitir continuar sin selección explícita
```

**Escenario 2: Consentimiento granular por tipo de procesamiento**

```gherkin
Given el cliente decide dar su consentimiento
When revisa las opciones específicas
Then debe poder autorizar por separado:
  ☑ Procesamiento de imagen del documento (OCR)
  ☑ Procesamiento de imagen facial (biometría)
  ☑ Almacenamiento temporal para verificación (30 días)
  ☐ Marketing personalizado basado en verificación (opcional)
  And debe poder proceder aunque rechace elementos opcionales
  And debe quedar registrado exactamente qué autorizó
```

**Escenario 3: Información sobre derechos del usuario**

```gherkin
Given el cliente quiere entender sus derechos
When accede a "Más información sobre el tratamiento de datos"
Then debe mostrar información clara sobre:
  - Derecho de acceso: "Puedes ver qué datos tenemos"
  - Derecho de rectificación: "Puedes corregir datos incorrectos"
  - Derecho de supresión: "Puedes solicitar borrar tus datos"
  - Derecho de portabilidad: "Puedes llevarte tus datos"
  And debe incluir medios de contacto para ejercer estos derechos
```

**Escenario 4: Revocación de consentimiento**

```gherkin
Given el cliente ha dado consentimiento previamente
When decide revocarlo a través de la app/web o por teléfono
Then el sistema debe:
  - Detener inmediatamente cualquier procesamiento biométrico futuro
  - Eliminar irreversiblemente todas las huellas digitales faciales almacenadas
  - Mantener solo los datos mínimos para cumplir obligaciones legales
  And debe confirmar la revocación por escrito
  And debe explicar las implicaciones (ej: necesidad de verificación presencial)
```

### Criterios de Calidad

- **Legal Compliance**: 100% conformidad con GDPR Art. 9
- **User Experience**: Comprensible para usuarios sin conocimientos jurídicos
- **Audit Trail**: Registro inmutable de todos los consentimientos
- **Performance**: Revocación efectiva en <24 horas

---

## RF-006: Integración con Sistemas Bancarios

**Como** empleado del banco que necesita verificar la identidad del cliente
**Quiero** que los resultados de la verificación biométrica se integren automáticamente
**Para** completar el proceso de onboarding sin pasos manuales adicionales

### Criterios de Aceptación

**Escenario 1: Verificación exitosa y creación automática de perfil**

```gherkin
Given un cliente ha completado exitosamente la verificación biométrica
  And todos los checks de cumplimiento han pasado
When el sistema procesa el resultado final
Then debe automáticamente:
  - Crear el perfil de cliente en Core Banking
  - Asignar un IBAN único
  - Configurar productos básicos (cuenta corriente)
  - Generar tarjeta de débito virtual
  And debe enviar notificación de bienvenida por email
  And debe permitir al cliente acceder inmediatamente a la app
```

**Escenario 2: Integración con sistema anti-fraude**

```gherkin
Given la verificación biométrica está en proceso
When el sistema detecta algún indicador de riesgo:
  - Score de matching en zona gris (0.70-0.87)
  - Múltiples intentos fallidos
  - Patrones de comportamiento anómalos
Then debe automáticamente consultar al sistema de fraude
  And debe enviar datos relevantes: ubicación IP, device fingerprint, timing
  And debe recibir score de riesgo adicional
  And debe combinar ambos scores para decisión final
```

**Escenario 3: Escalamiento automático para revisión manual**

```gherkin
Given el caso requiere revisión humana (score ambiguo, fraude potencial)
When el sistema determina que no puede auto-aprobar
Then debe crear automáticamente un ticket en el sistema de gestión
  And debe incluir toda la información relevante:
    - Imágenes capturadas (enmascaradas para privacidad)
    - Scores de confianza detallados
    - Contexto de la sesión
  And debe asignar al agente especializado disponible
  And debe notificar al cliente del tiempo estimado de revisión
```

**Escenario 4: Reporting y compliance automático**

```gherkin
Given se han completado verificaciones durante el día
When llega el momento del reporte regulatorio diario
Then el sistema debe generar automáticamente:
  - Estadísticas de volumen y success rate
  - Casos escalados y tiempo de resolución
  - Indicadores de posibles intentos fraudulentos
  - Métricas de calidad del servicio
  And debe enviar estos reportes a Compliance y Risk Management
  And debe archivar toda la documentación para auditorías futuras
```

### Criterios de Calidad

- **Integration Reliability**: 99.9% de llamadas exitosas a sistemas bancarios
- **Data Consistency**: 0 discrepancias entre sistemas
- **Performance**: Integración completa en <30 segundos
- **Error Handling**: Recovery automático de errores temporales

---

## Matriz de Trazabilidad

| RF ID  | Epic     | Feature  | User Story  | Test Cases      | NFR Relacionado       |
| ------ | -------- | -------- | ----------- | --------------- | --------------------- |
| RF-001 | BANK-123 | BANK-124 | BANK-124-01 | TC-001 a TC-005 | NFR-001 (Performance) |
| RF-002 | BANK-123 | BANK-124 | BANK-124-02 | TC-006 a TC-012 | NFR-002 (Accuracy)    |
| RF-003 | BANK-123 | BANK-125 | BANK-125-01 | TC-013 a TC-020 | NFR-003 (Security)    |
| RF-004 | BANK-123 | BANK-125 | BANK-125-02 | TC-021 a TC-028 | NFR-003 (Security)    |
| RF-005 | BANK-123 | BANK-126 | BANK-126-01 | TC-029 a TC-036 | NFR-004 (Compliance)  |
| RF-006 | BANK-123 | BANK-126 | BANK-126-02 | TC-037 a TC-044 | NFR-005 (Integration) |

## Criterios de Completitud

### Definition of Ready para Desarrollo

- [ ] Todos los criterios de aceptación están definidos en formato BDD
- [ ] NFRs asociados están documentados y son medibles
- [ ] Dependencias con sistemas externos están identificadas
- [ ] Casos de error y recovery están especificados
- [ ] Criterios de GDPR compliance están validados por Legal

### Definition of Done para Testing

- [ ] Todos los escenarios BDD tienen test cases automatizados
- [ ] Performance testing cumple con NFRs especificados
- [ ] Security testing incluye casos de spoofing y ataques comunes
- [ ] Integration testing valida todos los sistemas conectados
- [ ] Compliance testing verifica cumplimiento GDPR

---

**Próximos Pasos**:

1. Review cruzado técnico-producto (skill review-cruzado)
2. Generación de NFRs detallados (skill generate-nfr)
3. Breakdown en user stories implementables (skill user-stories)
4. Planificación de epic en sub-epics (skill epic-breakdown)
