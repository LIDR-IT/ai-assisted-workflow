# Business Case: eID Digital para Gobierno Municipal

**Cliente**: Ayuntamiento de Valencia (ejemplo)
**Producto**: {{PRODUCT_NAME_1}}D + {{PRODUCT_NAME_1}} (módulo básico)
**Presupuesto Estimado**: €45K
**Timeline**: 3 meses
**Tipo**: Gobierno local, primera implementación

## 1. Problema de Negocio

### Situación Actual

- **Trámites presenciales**: 100% requieren visita física
- **Horario limitado**: Oficinas 8:00-14:00, colas de 2 horas
- **Personal saturado**: 12 funcionarios para 45,000 ciudadanos
- **Papeleos**: 85% trámites requieren documentación física
- **Satisfacción ciudadana**: 34% (encuesta municipal 2025)

### Trámites Objetivo (Fase 1)

1. **Certificados de empadronamiento** (3,200/mes)
2. **Certificados de vida laboral** (1,800/mes)
3. **Solicitud cita previa médica** (4,500/mes)
4. **Pago de multas e impuestos** (2,100/mes)
5. **Inscripción actividades deportivas** (800/mes)

### Marco Regulatorio

- **eIDAS Level Substantial**: Requerido para trámites oficiales
- **GDPR Art. 6**: Base legal servicio público
- **GDPR Art. 9**: Datos biométricos requieren DPIA
- **Ley 39/2015**: Administración digital obligatoria

## 2. Solución Propuesta

### Componentes Técnicos

| Producto                | Función                 | Compliance              |
| ----------------------- | ----------------------- | ----------------------- |
| **{{PRODUCT_NAME_1}}D** | Verificación DNI/NIE    | eIDAS Substantial level |
| **{{PRODUCT_NAME_1}}**  | Reconocimiento facial   | ISO 30107-1 PAD         |
| **Portal ciudadano**    | Interfaz web responsive | WCAG 2.1 AA             |

### Flujo de Identificación Digital

1. **Acceso al portal** → www.valencia.es/tramites
2. **Selección de trámite** → Certificado empadronamiento
3. **Identificación digital**:
   - Foto del DNI/NIE (OCR)
   - Selfie con liveness detection
   - Matching 1:1 (umbral: 0.88)
4. **Proceso automático** → Generación certificado PDF firmado
5. **Entrega digital** → Email + descarga inmediata

### GDPR Compliance (Simplificado)

- **Base legal**: Art. 6.1.e - Interés público (servicios municipales)
- **Datos biométricos**: Art. 9.2.g - Interés público esencial
- **Retention**: Templates eliminados tras completar trámite (max 48h)
- **DPIA**: Evaluación básica para gobierno local
- **DPO municipal**: Supervisión del proceso

## 3. Beneficios Esperados

### Reducción de Carga Administrativa

| Trámite                     | Tiempo Actual | Tiempo Digital | Ahorro |
| --------------------------- | ------------- | -------------- | ------ |
| Certificado empadronamiento | 45 min        | 3 min          | 42 min |
| Vida laboral                | 30 min        | 2 min          | 28 min |
| Cita médica                 | 25 min        | 1 min          | 24 min |
| Pago multas                 | 20 min        | 2 min          | 18 min |

### Ahorro Operacional (Anual)

- **Horas funcionarios liberadas**: 2,400 horas/año
- **Costos administrativos**: €72K → €45K (ahorro €27K)
- **Costos papel e impresión**: €8K → €2K (ahorro €6K)
- **Total ahorro directo**: €33K anuales

### Mejora de Servicio

- **Disponibilidad**: 24/7 vs 8:00-14:00
- **Tiempo de espera**: 0 vs 120 minutos promedio
- **Desplazamientos evitados**: 12,400 viajes/año al Ayuntamiento
- **Satisfacción esperada**: 75% (vs 34% actual)

## 4. Inversión

### Costos de Implementación

| Concepto                          | Costo    | Justificación                  |
| --------------------------------- | -------- | ------------------------------ |
| Licencias {{CLIENT_NAME}} (año 1) | €25K     | 15K verificaciones/mes         |
| Desarrollo portal                 | €12K     | Frontend + integración backend |
| Integración sistemas municipales  | €5K      | API connection con base datos  |
| DPIA + compliance                 | €3K      | Consultoría legal mínima       |
| **Total**                         | **€45K** |                                |

### ROI Simplificado

- **Ahorro anual**: €33K
- **Inversión**: €45K
- **Payback period**: 16.4 meses
- **ROI 3 años**: 120% (sin contar mejoras de satisfacción)

## 5. Implementación (Simple)

### Fase 1: Setup Básico (4 semanas)

- Instalación {{PRODUCT_NAME_1}}D + {{PRODUCT_NAME_1}}
- Portal web basic responsive
- Integración con 1 trámite piloto (empadronamiento)
- DPIA básica + approval

### Fase 2: Expansión (4 semanas)

- Integración 4 trámites restantes
- Testing con ciudadanos voluntarios (100 personas)
- Training personal municipal
- Go-live soft (20% ciudadanos)

### Fase 3: Full Launch (2 semanas)

- Comunicación ciudadana (web, redes, prensa local)
- Soporte on-site primera semana
- Monitoreo y ajustes

## 6. Riesgos (Low Complexity)

### Riesgos Técnicos

| Riesgo                        | Probabilidad | Mitigación                               |
| ----------------------------- | ------------ | ---------------------------------------- |
| Adopción lenta ciudadanos 65+ | Alta         | Soporte telefónico + presencial paralelo |
| Problemas con DNI antiguos    | Media        | Fallback manual documentado              |
| Overload del servidor         | Baja         | Hosting cloud auto-scaling               |

### Riesgos Regulatorios

- **GDPR compliance**: DPO municipal review obligatorio
- **eIDAS certification**: {{PRODUCT_NAME_1}}D ya certificado (no risk)
- **Accesibilidad WCAG**: Testing obligatorio antes launch

### Riesgos Organizacionales

- **Resistance funcionarios**: Training + involvement en diseño
- **Budget approval**: Sponsor político definido
- **Timeline electoral**: Evitar lanzamiento 2 meses pre-elecciones

## 7. Métricas de Éxito

### KPIs Operacionales (3 meses)

| Métrica                 | Target      |
| ----------------------- | ----------- |
| % trámites digitales    | > 40%       |
| Tiempo promedio trámite | < 5 minutos |
| Satisfacción ciudadana  | > 70%       |
| Llamadas soporte/día    | < 15        |

### KPIs Técnicos

- **Disponibilidad portal**: > 99%
- **False accept rate**: < 0.1%
- **False reject rate**: < 5%
- **Mobile compatibility**: 95% dispositivos

## 8. Beneficios a Largo Plazo

### Escalabilidad (Año 2)

- Expansión a todos los 47 trámites municipales
- Integración con Generalitat Valenciana
- API para terceros (gestorías)
- Mobile app nativa

### Smart City Integration

- Single sign-on municipal
- Integración con transporte público
- Servicios deportivos y culturales
- Participación ciudadana digital

---

**Sponsor**: Concejal de Modernización + Alcalde
**Aprobación**: Pleno municipal
**Contact DPO**: Secretario municipal (legal compliance)
**Timeline decisión**: 6 semanas (proceso municipal estándar)
