# 🔄 Handoff Dev → QA

**Ticket**: SDLC-456 - Implementar autenticación por reconocimiento facial
**Developer**: García, Miguel
**QA Assigned**: López, Ana
**Date**: 2026-03-16
**Environment**: https://staging.{{CLIENT_CODE}}.com
**Status**: READY FOR QA ✅

---

## 📋 Resumen de la Implementación

### ¿Qué se implementó?

Nuevo flujo de autenticación usando reconocimiento facial para usuarios móviles. Permite login sin contraseña usando la cámara del dispositivo.

### Cambios principales:

- **Frontend**: Nueva pantalla de captura facial en app móvil
- **Backend**: API de verificación facial con liveness detection
- **Base de datos**: Tabla para almacenar templates biométricos cifrados
- **Seguridad**: Implementación GDPR-compliant para datos biométricos

---

## 🎯 User Story y Criterios de Aceptación

### US Original

**Como** usuario de la app móvil
**Quiero** autenticarme usando mi rostro
**Para** acceder de forma rápida y segura sin recordar contraseñas

### Criterios de Aceptación (BDD)

```gherkin
Scenario: Login exitoso con reconocimiento facial
  Given que soy un usuario registrado con template facial
  And que abro la app móvil
  When selecciono "Login con rostro"
  And permito acceso a la cámara
  And capturo mi rostro siguiendo las instrucciones
  Then el sistema valida mi identidad en menos de 3 segundos
  And accedo al dashboard principal

Scenario: Rechazo por rostro no reconocido
  Given que abro la app móvil
  When selecciono "Login con rostro"
  And capturo un rostro no registrado
  Then veo mensaje "Usuario no reconocido"
  And se me ofrece opción de login tradicional

Scenario: Error de liveness detection
  Given que intento hacer login facial
  When el sistema detecta que uso una foto en lugar de rostro real
  Then veo mensaje "Por favor, usa tu rostro real"
  And se solicita nueva captura
```

---

## 🔧 Detalles Técnicos de la Implementación

### API Endpoints Nuevos

```
POST /api/v1/auth/face/verify
- Input: { image: base64, sessionId: string }
- Output: { success: boolean, token?: string, confidence: number }
- Rate limit: 5 requests/minute por IP

GET /api/v1/auth/face/status
- Output: { enrolled: boolean, templateExists: boolean }

POST /api/v1/auth/face/enroll
- Input: { userId: string, images: base64[] }
- Output: { templateId: string, quality: number }
```

### Base de Datos

**Nueva tabla**: `domain-specific_templates`

```sql
- id (UUID, primary key)
- user_id (UUID, foreign key)
- template_data (encrypted blob)
- created_at, updated_at
- quality_score (float)
- algorithm_version (string)
```

### Frontend Changes

- **Nueva pantalla**: `FaceAuthScreen.tsx`
- **Componentes**: `CameraCapture.tsx`, `LivenessGuide.tsx`
- **Estados**: loading, capturing, processing, success, error
- **Permisos**: Camera permission request flow

---

## 🧪 Cómo Probar

### Pre-requisitos

- [ ] **Device**: Smartphone con cámara frontal
- [ ] **Permissions**: Permitir acceso a cámara cuando la app lo solicite
- [ ] **Lighting**: Probar en buena iluminación (evitar contraluz)
- [ ] **Test users**: Usar cuentas `qa_user1@{{CLIENT_CODE}}.com` a `qa_user5@{{CLIENT_CODE}}.com`

### Flujo de Testing Principal

#### 1. Enrollment (Registro de Template)

1. Login con usuario QA usando password tradicional
2. Ve a Settings > Security > Face Authentication
3. Tap "Configurar Face ID"
4. Sigue instrucciones de captura (5 fotos en diferentes ángulos)
5. **Verificar**: Mensaje "Face ID configurado correctamente"

#### 2. Face Login Happy Path

1. Logout completo de la app
2. En login screen, tap "Login con Face ID"
3. Permite acceso a cámara
4. Posiciona rostro en el óvalo guía
5. **Verificar**: Login automático en <3 segundos

#### 3. Edge Cases a Validar

- **Lighting pobre**: Probar en ambiente oscuro → debe guiar al usuario
- **Múltiples rostros**: Probar con varias personas en cámara → debe rechazar
- **Sin rostro**: Probar con objeto, mano, etc. → debe solicitar rostro válido
- **Photo spoofing**: Probar con foto de la persona → debe detectar y rechazar
- **Rostro no registrado**: Usar persona diferente → debe rechazar elegantemente

### Test Data

- **qa_user1@{{CLIENT_CODE}}.com**: Template ya registrado, login debe funcionar
- **qa_user2@{{CLIENT_CODE}}.com**: Sin template, debe requerir enrollment
- **qa_user3@{{CLIENT_CODE}}.com**: Template corrupted (test edge case)

---

## 🚦 Estados y Mensajes de Error

| Escenario                 | Mensaje Mostrado                              | Acción Siguiente         |
| ------------------------- | --------------------------------------------- | ------------------------ |
| **Cámara sin permiso**    | "Necesitamos acceso a tu cámara para Face ID" | Botón "Ir a Settings"    |
| **Sin rostro detectado**  | "Posiciona tu rostro dentro del óvalo"        | Guía visual animada      |
| **Liveness fallo**        | "Por favor, usa tu rostro real, no una foto"  | Nueva captura automática |
| **Usuario no reconocido** | "No pudimos verificar tu identidad"           | Botón "Usar contraseña"  |
| **Error de red**          | "Error de conexión. Intentando de nuevo..."   | Retry automático 3x      |
| **Error de servidor**     | "Servicio temporalmente no disponible"        | Botón "Usar contraseña"  |

---

## 🔍 Regression Areas

### Impacto en Funcionalidades Existentes

- **Login tradicional**: NO afectado, sigue funcionando igual
- **Password reset**: NO afectado
- **2FA**: Face ID cuenta como primer factor, sigue requiriendo 2FA si está habilitado
- **Session management**: Usa misma lógica de tokens JWT

### Areas a Re-testear

- [ ] **Login flow completo** (tradicional) - debe seguir funcionando
- [ ] **Settings screen** - nueva sección Face ID visible
- [ ] **Security settings** - opciones de disable/enable Face ID
- [ ] **Logout flow** - debe limpiar session normalmente

---

## 📱 Device Testing Matrix

| Device                | OS Version  | Camera          | Expected Result                   |
| --------------------- | ----------- | --------------- | --------------------------------- |
| **iPhone 12+**        | iOS 15+     | Front TrueDepth | ✅ Full functionality             |
| **Samsung S21+**      | Android 11+ | Front 32MP      | ✅ Full functionality             |
| **iPhone SE**         | iOS 15+     | Front standard  | ⚠️ Reduced liveness accuracy      |
| **Android mid-range** | Android 9+  | Front 8MP       | ⚠️ Slower processing              |
| **Tablets**           | Any OS      | Front camera    | ❌ Not supported (blocked in app) |

---

## 🔐 Security & Compliance Notes

### GDPR Compliance

- ✅ **Explicit consent**: Usuario debe aprobar en enrollment
- ✅ **Data minimization**: Solo template matemático, no imagen original
- ✅ **Right to deletion**: Botón "Eliminar Face ID" en settings
- ✅ **Encryption**: Templates cifrados con AES-256

### Testing Security Aspects

- [ ] **Template encryption**: Verificar que DB no contiene datos raw
- [ ] **Consent flow**: Debe mostrar disclaimer de GDPR antes de enrollment
- [ ] **Data deletion**: "Eliminar Face ID" debe limpiar template de DB
- [ ] **Anti-spoofing**: Probar con fotos, videos, máscaras (debe fallar)

---

## ⚠️ Known Issues & Limitations

### Limitaciones Actuales

- **Network dependency**: Requiere conexión para verificación (no offline)
- **Single template**: Un template por usuario (no múltiples rostros)
- **Device rotation**: Solo funciona en portrait mode
- **Background app**: Si app va a background durante captura, debe reiniciar

### Bugs Pendientes (No blocking)

- **SDLC-458**: Mejora de UI feedback durante processing
- **SDLC-461**: Optimización para Android low-end devices

---

## ✅ Definition of Done Checklist

### Development

- [x] Código implementado y code review aprobado
- [x] Unit tests escritos y pasando (coverage 85%)
- [x] Integration tests para API endpoints
- [x] Error handling completo implementado
- [x] Logging y monitoring agregado

### Security

- [x] Security review completado (CISO approval)
- [x] GDPR compliance validado (Privacy Officer)
- [x] Penetration testing básico pasado
- [x] No vulnerabilidades críticas en SAST scan

### QA Readiness

- [x] Feature flag configurado (pode disable en prod)
- [x] Test environment con data seeded
- [x] Documentation actualizada
- [x] Rollback plan documentado

---

## 📞 Support & Questions

**Primary Developer**: García, Miguel (@miguel.garcia)
**Backup Support**: Rodríguez, Sandra (@sandra.rodriguez)
**Security Questions**: Martínez, Carlos (@carlos.martinez)
**QA Questions**: López, Ana (@ana.lopez)

**Slack Channel**: #facial-auth-testing
**Environment Issues**: #devops-support

---

**✨ Happy Testing! Si algo no queda claro, ping a Miguel antes que QA fail 😄**
