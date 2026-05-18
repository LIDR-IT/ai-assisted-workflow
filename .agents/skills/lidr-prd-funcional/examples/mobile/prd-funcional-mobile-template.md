---
id: prd-funcional-mobile-template
version: "1.0.0"
last_updated: "2026-03-15"
updated_by: "TL: Lead Engineer"
status: active
type: template

# BMAD-inspired enhancements
stepsCompleted: ["template-creation", "mobile-optimization"]
workflowType: "prd"
classification:
  projectType: "Mobile Application"
  targetPlatforms: ["iOS", "Android", "Cross-platform"]
  frameworks: ["React Native", "Flutter", "Native"]
  complexity: "{{COMPLEXITY}}"
  domain: "{{DOMAIN}}"

# Template metadata
templateInfo:
  context: "mobile"
  suitableFor: ["Native iOS", "Native Android", "Cross-platform", "Hybrid mobile"]
  requiredSections: ["App Store Requirements", "Device Compatibility", "Mobile UX Patterns"]
---

# PRD Funcional - {{APP_NAME}} (Mobile)

**App:** {{APP_NAME}}
**Plataformas:** {{TARGET_PLATFORMS}}
**Framework:** {{MOBILE_FRAMEWORK}}
**Dominio:** {{DOMAIN}}
**Fecha:** {{DATE}}

---

## 1. App Overview

### Visión de la App

{{APP_NAME}} es una {{APP_DESCRIPTION}} diseñada para {{TARGET_MOBILE_USERS}} que {{MOBILE_VALUE_PROPOSITION}}.

### Mobile-Specific Context

- **Plataformas**: {{PLATFORMS}} (iOS {{MIN_IOS_VERSION}}+, Android {{MIN_ANDROID_VERSION}}+)
- **Framework**: {{MOBILE_FRAMEWORK}}
- **App Type**: {{APP_TYPE}} (Native/Hybrid/Cross-platform)
- **Target Devices**: {{TARGET_DEVICE_TYPES}}
- **Orientation Support**: {{ORIENTATION_SUPPORT}}

### Business Value

- **Mobile-First Problem**: {{MOBILE_PROBLEM}}
- **Target Users**: {{MOBILE_USER_SEGMENTS}}
- **Key Mobile Metrics**: {{MOBILE_SUCCESS_METRICS}}

---

## 2. Mobile User Personas

### Primary Mobile Persona: {{PRIMARY_MOBILE_PERSONA}}

- **Demographics**: {{MOBILE_DEMOGRAPHICS}}
- **Device Usage**: {{DEVICE_USAGE_PATTERNS}}
- **Primary Device**: {{PRIMARY_DEVICE}}
- **Usage Context**: {{MOBILE_USAGE_CONTEXT}}
- **Technical Comfort**: {{MOBILE_TECHNICAL_LEVEL}}
- **App Goals**: {{MOBILE_GOALS}}
- **Mobile Frustrations**: {{MOBILE_PAIN_POINTS}}

**Mobile Behavior Patterns:**

- **Session Length**: {{TYPICAL_SESSION_LENGTH}}
- **Usage Frequency**: {{USAGE_FREQUENCY}}
- **Peak Usage Times**: {{PEAK_TIMES}}
- **Multitasking Habits**: {{MULTITASKING_PATTERNS}}

---

## 3. Mobile User Journeys

### Primary Mobile Journey: {{PRIMARY_MOBILE_JOURNEY}}

#### App Discovery & Install

1. **Discovery**: User finds app via {{DISCOVERY_CHANNELS}}
2. **Store Evaluation**: Reviews {{STORE_DECISION_FACTORS}}
3. **Install Decision**: Downloads based on {{INSTALL_TRIGGERS}}
4. **First Launch**: {{ONBOARDING_GOALS}}

#### Core Mobile Experience

1. **{{MOBILE_STEP_1}}**
   - **Touch Interaction**: {{TOUCH_INTERACTION_1}}
   - **Screen**: {{SCREEN_1}}
   - **Gestures**: {{GESTURES_1}}
   - **Feedback**: {{MOBILE_FEEDBACK_1}}

2. **{{MOBILE_STEP_2}}**
   - **Navigation**: {{MOBILE_NAVIGATION_2}}
   - **Input Method**: {{INPUT_METHOD_2}}
   - **Validation**: {{MOBILE_VALIDATION_2}}
   - **Error Handling**: {{ERROR_HANDLING_2}}

3. **{{MOBILE_STEP_3}}**
   - **Completion**: {{COMPLETION_FEEDBACK_3}}
   - **Sharing**: {{MOBILE_SHARING_3}}
   - **Next Action**: {{NEXT_ACTION_3}}

#### Background & Re-engagement

1. **Background Behavior**: {{BACKGROUND_FUNCTIONALITY}}
2. **Push Notifications**: {{NOTIFICATION_STRATEGY}}
3. **Re-engagement**: {{REENGAGEMENT_TACTICS}}

---

## 4. Mobile Functional Requirements

### 4.1 Core Mobile Features

#### FR-MOB-001: Native Device Integration

**Como** usuario móvil
**Quiero** que la app aproveche las capacidades nativas del dispositivo
**Para** tener una experiencia óptima y fluida

**Criterios de Aceptación:**

```gherkin
Given que tengo la app instalada
When uso funciones que requieren hardware específico
Then la app debe utilizar {{DEVICE_CAPABILITIES}}
And debe solicitar permisos de forma clara y justificada
```

**Device Capabilities Required:**

- {{CAPABILITY_1}}: {{CAPABILITY_1_PURPOSE}}
- {{CAPABILITY_2}}: {{CAPABILITY_2_PURPOSE}}
- {{CAPABILITY_3}}: {{CAPABILITY_3_PURPOSE}}

#### FR-MOB-002: Offline Functionality

**Como** usuario móvil
**Quiero** poder usar funciones básicas sin conexión a internet
**Para** no estar limitado por la conectividad

**Criterios de Aceptación:**

```gherkin
Given que no tengo conexión a internet
When uso la app
Then las funciones {{OFFLINE_FEATURES}} deben estar disponibles
And los datos se deben sincronizar cuando recupere la conexión
```

#### FR-MOB-003: Cross-Platform Consistency

**Como** usuario con múltiples dispositivos
**Quiero** una experiencia consistente entre plataformas
**Para** no tener que reaprender la interfaz

**Platform-Specific Adaptations:**

- **iOS**: {{IOS_SPECIFIC_ADAPTATIONS}}
- **Android**: {{ANDROID_SPECIFIC_ADAPTATIONS}}

### 4.2 Mobile UX/UI Requirements

#### FR-UX-001: Touch-First Design

**Como** usuario móvil
**Quiero** una interfaz optimizada para touch
**Para** interactuar de forma natural y eficiente

**Touch Targets:**

- Minimum size: 44pt (iOS) / 48dp (Android)
- Spacing: {{TOUCH_SPACING}}
- Gesture support: {{SUPPORTED_GESTURES}}

#### FR-UX-002: Mobile Navigation Patterns

**Como** usuario móvil
**Quiero** navegar intuitivamente por la app
**Para** encontrar lo que necesito rápidamente

**Navigation Structure:**

- **Primary Navigation**: {{PRIMARY_NAV_PATTERN}}
- **Secondary Navigation**: {{SECONDARY_NAV_PATTERN}}
- **Deep Linking**: {{DEEP_LINK_STRATEGY}}

#### FR-UX-003: Responsive Mobile Layout

**Como** usuario
**Quiero** que la app se adapte a mi dispositivo
**Para** aprovechar toda la pantalla disponible

**Screen Size Support:**

- **Small**: {{SMALL_SCREEN_SUPPORT}} (≤5.5")
- **Medium**: {{MEDIUM_SCREEN_SUPPORT}} (5.5"-6.5")
- **Large**: {{LARGE_SCREEN_SUPPORT}} (≥6.5")
- **Tablet**: {{TABLET_SUPPORT}} (if applicable)

### 4.3 Platform-Specific Features

#### FR-IOS-001: iOS Integration

**Como** usuario de iPhone/iPad
**Quiero** integración nativa con iOS
**Para** aprovechar las características específicas de la plataforma

**iOS-Specific Features:**

- **Siri Shortcuts**: {{SIRI_INTEGRATION}}
- **Spotlight Search**: {{SPOTLIGHT_INDEXING}}
- **iOS Widgets**: {{WIDGET_FUNCTIONALITY}}
- **Apple Pay**: {{APPLE_PAY_INTEGRATION}}

#### FR-AND-001: Android Integration

**Como** usuario de Android
**Quiero** integración nativa con Android
**Para** aprovechar las características específicas de la plataforma

**Android-Specific Features:**

- **App Shortcuts**: {{ANDROID_SHORTCUTS}}
- **Android Auto**: {{AUTO_INTEGRATION}}
- **Google Pay**: {{GOOGLE_PAY_INTEGRATION}}
- **Adaptive Icons**: {{ADAPTIVE_ICON_SUPPORT}}

### 4.4 Mobile Performance Requirements

#### FR-PERF-001: App Launch Performance

**Como** usuario móvil
**Quiero** que la app lance rápidamente
**Para** acceder inmediatamente a la funcionalidad

**Performance Targets:**

- **Cold Start**: < {{COLD_START_TIME}}ms
- **Warm Start**: < {{WARM_START_TIME}}ms
- **Hot Start**: < {{HOT_START_TIME}}ms

#### FR-PERF-002: Battery Optimization

**Como** usuario móvil
**Quiero** que la app no consuma excesiva batería
**Para** poder usar mi dispositivo normalmente

**Battery Guidelines:**

- **Background Usage**: {{BACKGROUND_BATTERY_LIMIT}}
- **CPU Usage**: {{CPU_USAGE_LIMIT}}
- **Network Efficiency**: {{NETWORK_OPTIMIZATION}}

---

## 5. Mobile Technical Requirements

### 5.1 Device Compatibility

#### Minimum Requirements

- **iOS**: {{MIN_IOS_VERSION}}+ ({{IOS_DEVICE_LIST}})
- **Android**: API {{MIN_ANDROID_API}}+ (Android {{MIN_ANDROID_VERSION}}+)
- **RAM**: {{MIN_RAM}}GB
- **Storage**: {{MIN_STORAGE}}MB free space

#### Supported Devices

- **iPhone**: {{SUPPORTED_IPHONES}}
- **iPad**: {{SUPPORTED_IPADS}}
- **Android Phones**: {{SUPPORTED_ANDROID_PHONES}}
- **Android Tablets**: {{SUPPORTED_ANDROID_TABLETS}}

### 5.2 Security Requirements

#### FR-SEC-001: Mobile Security

**Como** usuario
**Quiero** que mis datos estén seguros
**Para** confiar en la aplicación

**Security Measures:**

- **Data Encryption**: {{ENCRYPTION_STANDARDS}}
- **Biometric Authentication**: {{BIOMETRIC_AUTH}}
- **Secure Storage**: {{SECURE_STORAGE_METHOD}}
- **Network Security**: {{NETWORK_SECURITY}}

---

## 6. App Store Requirements

### 6.1 iOS App Store

- **App Store Guidelines**: Compliance with {{IOS_GUIDELINES_VERSION}}
- **Review Requirements**: {{IOS_REVIEW_REQUIREMENTS}}
- **Content Rating**: {{IOS_CONTENT_RATING}}
- **Privacy Labels**: {{IOS_PRIVACY_LABELS}}

### 6.2 Google Play Store

- **Play Store Policies**: Compliance with {{ANDROID_POLICIES_VERSION}}
- **Target API Level**: {{TARGET_ANDROID_API}}
- **Content Rating**: {{ANDROID_CONTENT_RATING}}
- **Data Safety**: {{ANDROID_DATA_SAFETY}}

---

## 7. Push Notifications & Engagement

### 7.1 Notification Strategy

#### FR-NOTIF-001: Smart Notifications

**Como** usuario
**Quiero** recibir notificaciones relevantes
**Para** mantenerme informado sin ser molestado

**Notification Types:**

- **Transactional**: {{TRANSACTIONAL_NOTIFICATIONS}}
- **Marketing**: {{MARKETING_NOTIFICATIONS}}
- **System**: {{SYSTEM_NOTIFICATIONS}}

**Smart Scheduling:**

- **Optimal Times**: {{OPTIMAL_NOTIFICATION_TIMES}}
- **Frequency Limits**: {{NOTIFICATION_FREQUENCY}}
- **Personalization**: {{NOTIFICATION_PERSONALIZATION}}

---

## 8. Analytics & Tracking (Mobile)

### 8.1 Mobile-Specific Metrics

- **App Installs**: {{INSTALL_TRACKING}}
- **Session Analytics**: {{SESSION_METRICS}}
- **Screen Views**: {{SCREEN_TRACKING}}
- **User Flows**: {{FLOW_ANALYSIS}}
- **Crash Reporting**: {{CRASH_TRACKING}}

### 8.2 Performance Monitoring

- **App Performance**: {{PERFORMANCE_MONITORING}}
- **Network Performance**: {{NETWORK_MONITORING}}
- **Battery Usage**: {{BATTERY_MONITORING}}

---

## 9. Accessibility (Mobile)

### 9.1 iOS Accessibility

- **VoiceOver**: {{VOICEOVER_SUPPORT}}
- **Dynamic Type**: {{DYNAMIC_TYPE_SUPPORT}}
- **Switch Control**: {{SWITCH_CONTROL_SUPPORT}}

### 9.2 Android Accessibility

- **TalkBack**: {{TALKBACK_SUPPORT}}
- **Select to Speak**: {{SELECT_TO_SPEAK}}
- **Voice Access**: {{VOICE_ACCESS_SUPPORT}}

---

## 10. Success Metrics (Mobile)

### 10.1 Acquisition Metrics

- **App Store Conversion**: {{STORE_CONVERSION_TARGET}}%
- **Install Rate**: {{INSTALL_RATE_TARGET}}
- **Organic vs Paid**: {{ORGANIC_PAID_SPLIT}}

### 10.2 Engagement Metrics

- **DAU/MAU Ratio**: {{DAU_MAU_TARGET}}
- **Session Length**: {{SESSION_LENGTH_TARGET}} minutes
- **Retention**: Day 1: {{D1_RETENTION}}%, Day 7: {{D7_RETENTION}}%, Day 30: {{D30_RETENTION}}%
- **Push Notification CTR**: {{PUSH_CTR_TARGET}}%

### 10.3 Performance Metrics

- **App Store Rating**: {{TARGET_RATING}}+ stars
- **Crash-Free Rate**: {{CRASH_FREE_TARGET}}%
- **App Launch Time**: {{LAUNCH_TIME_TARGET}}s

---

## 11. Assumptions & Dependencies (Mobile)

### 11.1 Technical Assumptions

- Users have updated mobile OS versions
- Stable mobile network connectivity for core features
- Users grant necessary permissions
- {{ADDITIONAL_MOBILE_ASSUMPTIONS}}

### 11.2 Platform Dependencies

- **iOS**: {{IOS_DEPENDENCIES}}
- **Android**: {{ANDROID_DEPENDENCIES}}
- **Backend APIs**: {{BACKEND_DEPENDENCIES}}

---

## 12. Future Mobile Roadmap

### 12.1 V2 Features

- **AR/VR Integration**: {{AR_VR_PLANS}}
- **Apple Watch**: {{WATCH_APP_PLANS}}
- **Android Wear**: {{WEAR_APP_PLANS}}
- **IoT Integration**: {{IOT_INTEGRATION_PLANS}}

### 12.2 Platform Evolution

- **New iOS Features**: {{IOS_FUTURE_FEATURES}}
- **New Android Features**: {{ANDROID_FUTURE_FEATURES}}

---

## Validación y Handoff

### Pre-Development Checklist

- [ ] Mobile wireframes/prototypes completados
- [ ] Platform-specific guidelines revisados
- [ ] Device testing strategy definida
- [ ] App store requirements validados
- [ ] Performance targets establecidos

### Development Handoff

- **Technical PRD**: Mobile architecture y APIs
- **Design System**: Mobile UI components
- **Platform Guidelines**: iOS/Android specific requirements
- **Testing Strategy**: Device matrix y automation

---

**Documento generado con Template Mobile-Optimizado**
**Compatible con iOS Human Interface Guidelines y Material Design**
**Optimizado para {{MOBILE_FRAMEWORK}} development**
