# Template: UX Design Specification

> **Propósito**: Especificación de diseño de experiencia de usuario — wireframes, flujos, patrones UI, y criterios de accesibilidad.
> **Cuándo se crea**: Fase 2-3 — En paralelo con PRD funcional y antes de Sprint Planning
> **Quién lo llena**: UX Designer / PO con skill `ux-design-spec`
> **Quién lo valida**: PO (valor) + Dev (viabilidad) + QA (testabilidad)
> **Gate asociado**: Gate 1 (high-level) → Gate 3 (detallado por US)
> **Instancias**: `docs/projects/{proyecto}/ux-design-spec.md`

---

## Secciones del Documento

### 1. Principios de Diseño

```markdown
## Principios de Diseño

### Identidad Visual

| Aspecto           | Definición                                     |
| ----------------- | ---------------------------------------------- |
| Paleta de colores | Primary: #XXX, Secondary: #XXX, Error: #XXX    |
| Tipografía        | Headings: {font}, Body: {font}, Mono: {font}   |
| Spacing system    | Base: {N}px, Scale: {4, 8, 12, 16, 24, 32, 48} |
| Border radius     | Buttons: {N}px, Cards: {N}px, Modals: {N}px    |
| Shadows           | sm: {def}, md: {def}, lg: {def}                |

### Principios UX

| #   | Principio                    | Aplicación                        |
| --- | ---------------------------- | --------------------------------- |
| 1   | {ej: Progressive disclosure} | {cómo se aplica en este producto} |
| 2   | {ej: Minimal cognitive load} |                                   |
| 3   | {ej: Consistent feedback}    |                                   |

### Design Tokens

{Referencia al sistema de tokens si existe (ej: Figma variables, CSS custom properties)}
```

### 2. User Flows

```markdown
## User Flows

### Flow 1: {nombre del flujo — ej: {{PRIMARY_WORKFLOW}}}

**Persona**: {usuario tipo}
**Trigger**: {qué inicia el flujo}
**Objetivo**: {qué logra el usuario al completarlo}

| Paso | Pantalla | Acción del Usuario        | Respuesta del Sistema          | Notas de UI    |
| ---- | -------- | ------------------------- | ------------------------------ | -------------- |
| 1    | Landing  | Click "Comenzar"          | Navega a paso 1                | CTA prominente |
| 2    | Captura  | Posiciona rostro en óvalo | Feedback visual en tiempo real | Overlay guía   |
| 3    |          |                           |                                |                |

**Error States**:
| Error | Pantalla | Mensaje | Acción del Usuario |
|-------|---------|---------|-------------------|
| Cámara no disponible | Captura | "Necesitamos acceso a tu cámara" | Botón: Permitir / Ayuda |
| Liveness fail | Captura | "Intenta de nuevo con mejor luz" | Retry automático |

**Exit Points**: {dónde puede el usuario abandonar y cómo}
```

### 3. Wireframes / Mockups

```markdown
## Pantallas

### Screen 1: {nombre}

**Ruta**: {/path/to/screen}
**Funcionalidad PRD**: F-{NNN}
**Wireframe**: {link a Figma/imagen}

#### Layout

{Descripción del layout: header, sidebar, content area, footer}

#### Componentes en esta pantalla

| Componente | Tipo           | Comportamiento              | Estado                              |
| ---------- | -------------- | --------------------------- | ----------------------------------- |
| Header     | Navigation     | Fixed top, hamburger mobile | Default / Scrolled                  |
| Form       | Input group    | Validación inline           | Empty / Filled / Error / Disabled   |
| CTA Button | Primary action | Submit form                 | Default / Hover / Loading / Success |

#### Estados de la Pantalla

| Estado  | Condición         | UI                     |
| ------- | ----------------- | ---------------------- |
| Empty   | Sin datos         | Placeholder con CTA    |
| Loading | Fetching data     | Skeleton loader        |
| Loaded  | Datos disponibles | Contenido completo     |
| Error   | API falla         | Error message + retry  |
| Offline | Sin conexión      | Banner offline + cache |
```

### 4. Patrones de UI

```markdown
## Patrones de UI Reutilizables

### Feedback al Usuario

| Evento                   | Patrón                       | Ejemplo                         |
| ------------------------ | ---------------------------- | ------------------------------- |
| Acción exitosa           | Toast notification (success) | "Guardado correctamente"        |
| Error de validación      | Inline error bajo el campo   | "Este campo es obligatorio"     |
| Error del servidor       | Banner error + retry         | "Error de conexión. Reintentar" |
| Carga                    | Skeleton loader (no spinner) | Skeleton del layout final       |
| Confirmación destructiva | Modal de confirmación        | "¿Seguro que deseas eliminar?"  |

### Navegación

| Contexto              | Patrón                           |
| --------------------- | -------------------------------- |
| Navegación principal  | {Sidebar / Top nav / Bottom nav} |
| Navegación secundaria | {Tabs / Breadcrumbs / Steps}     |
| Acciones contextuales | {Dropdown / Context menu / FAB}  |
| Búsqueda              | {Inline / Modal / Omnibar}       |

### Formularios

| Regla        | Detalle                                                                         |
| ------------ | ------------------------------------------------------------------------------- |
| Validación   | Inline al blur, no al typear. Resumen de errores arriba del form                |
| Labels       | Siempre visibles (no solo placeholder). Float label pattern si espacio limitado |
| Obligatorios | Asterisco (_) + texto "Campos obligatorios marcados con _"                      |
| Autosave     | Cada 30s si formulario largo, con indicador visual                              |
```

### 5. Responsive Design

```markdown
## Responsive

### Breakpoints

| Nombre  | Min-width | Layout              | Notas              |
| ------- | --------- | ------------------- | ------------------ |
| Mobile  | 0px       | Single column       | Touch-first        |
| Tablet  | 768px     | Two columns         | Sidebar colapsable |
| Desktop | 1024px    | Full layout         | Sidebar expandido  |
| Wide    | 1440px    | Max-width container | Centered content   |

### Adaptaciones por Breakpoint

| Componente | Mobile                    | Tablet            | Desktop           |
| ---------- | ------------------------- | ----------------- | ----------------- |
| Navigation | Bottom tab / Hamburger    | Sidebar collapsed | Sidebar expanded  |
| Tables     | Horizontal scroll / Cards | Responsive table  | Full table        |
| Forms      | Full width, stacked       | Two columns       | Two-three columns |
| Modals     | Full screen               | Centered overlay  | Centered overlay  |
```

### 6. Accesibilidad (a11y)

```markdown
## Accesibilidad

### Estándares

- **Target**: WCAG 2.1 Level AA (mínimo)
- **Testing**: aXe / Lighthouse / Screen reader manual

### Checklist a11y

| Criterio           | Requisito                                            | Verificación            |
| ------------------ | ---------------------------------------------------- | ----------------------- |
| Contraste          | ≥4.5:1 texto normal, ≥3:1 texto grande               | Automática (Lighthouse) |
| Keyboard nav       | Todo operable con teclado (Tab, Enter, Esc)          | Manual                  |
| Focus visible      | Focus ring visible en todos los interactivos         | Automática + Manual     |
| Alt text           | Todas las imágenes con alt descriptivo               | Automática              |
| ARIA labels        | Componentes custom con roles y labels ARIA           | Manual                  |
| Screen reader      | Flujos principales navegables con lector             | Manual                  |
| Touch targets      | ≥44x44px en mobile                                   | Automática              |
| Reduced motion     | Respetar `prefers-reduced-motion`                    | Manual                  |
| Color independence | Información no solo por color (agregar iconos/texto) | Manual                  |
```

### 7. Animaciones y Micro-interacciones

```markdown
## Animaciones

### Principios

| Principio      | Detalle                                                                             |
| -------------- | ----------------------------------------------------------------------------------- |
| Propósito      | Toda animación tiene función (feedback, orientación, transición) — nunca decorativa |
| Duración       | Micro: 100-200ms, Transición: 200-400ms, Página: 300-500ms                          |
| Easing         | ease-out para entradas, ease-in para salidas                                        |
| Reduced motion | Respetar preferencia del SO — deshabilitar animaciones                              |

### Catálogo

| Interacción     | Animación                    | Duración | Easing   |
| --------------- | ---------------------------- | -------- | -------- |
| Button press    | Scale 0.98 + color change    | 100ms    | ease-out |
| Page transition | Fade + slide left            | 300ms    | ease-out |
| Modal open      | Fade overlay + scale content | 200ms    | ease-out |
| Toast appear    | Slide in from right          | 200ms    | ease-out |
```

---

## Criterios de Completitud

| Criterio                                                 | Obligatorio | Validación |
| -------------------------------------------------------- | ----------- | ---------- |
| Principios de diseño definidos                           | Sí          | Manual     |
| Al menos 1 user flow completo                            | Sí          | Automática |
| Wireframes para pantallas principales                    | Sí          | Manual     |
| Error states documentados por pantalla                   | Sí          | Automática |
| Responsive breakpoints definidos                         | Sí          | Automática |
| Checklist a11y presente                                  | Sí          | Automática |
| Patrones de UI documentados (feedback, nav, forms)       | Sí          | Automática |
| Estados de pantalla documentados (empty, loading, error) | Sí          | Automática |

---

## Skills que Asisten

- **Generación**: Skill `ux-design-spec` genera spec desde PRD funcional + wireframes
- **Validación**: `/validate-project-docs` verifica secciones obligatorias
- **Input**: PRD Funcional (user journeys, funcionalidades)
- **Output**: Referencia para skills `user-stories` (criterios BDD incluyen UI) y `create-test-cases`

---

_Template — instancia en `docs/projects/{proyecto}/ux-design-spec.md`_
