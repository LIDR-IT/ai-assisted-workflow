# Template: UI Components Specification

> **Propósito**: Catálogo de componentes de UI — diseño, props, estados, y comportamiento.
> **Quién lo llena**: Frontend Lead / UX con skill `architecture-doc`
> **Instancias**: `docs/projects/{proyecto}/specs/components.md`
> **Complementa**: `ux-design-spec.md`, `specs/routes.md`

---

## 1. Design System Base

```markdown
## Design System

### Componentes Primitivos (Atoms)

| Componente | Variantes                              | Props clave                      | Librería base  |
| ---------- | -------------------------------------- | -------------------------------- | -------------- |
| Button     | primary, secondary, ghost, destructive | size, disabled, loading          | Radix / Custom |
| Input      | text, password, email, number, search  | error, disabled, placeholder     | Radix / Custom |
| Select     | single, multi                          | options, searchable, clearable   | Radix / Custom |
| Checkbox   | default                                | checked, indeterminate, disabled | Radix          |
| Badge      | info, success, warning, error          | size                             | Custom         |
| Avatar     | image, initials, fallback              | size, src                        | Radix          |
| Tooltip    | default                                | content, side, delay             | Radix          |

### Componentes Compuestos (Molecules)

| Componente | Composición                  | Props clave                     |
| ---------- | ---------------------------- | ------------------------------- |
| FormField  | Label + Input + ErrorMessage | name, label, error, required    |
| SearchBar  | Input + Icon + ClearButton   | onSearch, placeholder, debounce |
| Card       | Header + Body + Footer       | title, actions, clickable       |
| DataTable  | Table + Pagination + Sorting | data, columns, onSort, onPage   |
| Modal      | Overlay + Dialog + Actions   | open, onClose, title            |
| Toast      | Icon + Message + Action      | type, message, duration         |

### Componentes de Layout (Organisms)

| Componente    | Contenido                        | Responsive                  |
| ------------- | -------------------------------- | --------------------------- |
| AppShell      | Sidebar + Header + Content       | Sidebar collapses on mobile |
| PageHeader    | Title + Breadcrumb + Actions     | Actions stack on mobile     |
| EmptyState    | Icon + Title + Description + CTA | Centered at all sizes       |
| ErrorBoundary | Error message + Retry + Report   | Full width                  |
```

## 2. Detalle por Componente (ejemplo)

```markdown
## {ComponentName}

### Propósito

{1 oración — qué hace y cuándo se usa}

### Props

| Prop     | Tipo       | Default     | Requerido | Descripción                  |
| -------- | ---------- | ----------- | --------- | ---------------------------- | --- | ------------- |
| variant  | 'primary'  | 'secondary' | 'ghost'   | 'primary'                    | No  | Estilo visual |
| size     | 'sm'       | 'md'        | 'lg'      | 'md'                         | No  | Tamaño        |
| disabled | boolean    | false       | No        | Deshabilita interacción      |
| loading  | boolean    | false       | No        | Muestra spinner, deshabilita |
| onClick  | () => void | —           | Sí        | Handler de click             |
| children | ReactNode  | —           | Sí        | Contenido                    |

### Estados

| Estado         | Visual                          | Interacción         |
| -------------- | ------------------------------- | ------------------- |
| Default        | {descripción}                   | Clickeable          |
| Hover          | {descripción}                   | Cursor pointer      |
| Active/Pressed | {descripción}                   | Scale 0.98          |
| Focus          | {descripción} + focus ring      | Keyboard accessible |
| Disabled       | Opacity 0.5, cursor not-allowed | No interacción      |
| Loading        | Spinner reemplaza children      | No interacción      |

### Accesibilidad

| Requisito     | Implementación           |
| ------------- | ------------------------ |
| Role          | `button` (native)        |
| Keyboard      | Enter/Space activan      |
| Screen reader | aria-label si solo icono |
| Disabled      | aria-disabled="true"     |
| Loading       | aria-busy="true"         |

### Uso

{Ejemplo de código de cómo se usa el componente}
```

## 3. Composición de Pantallas

```markdown
## Composición por Pantalla

### {ScreenName}

| Zona    | Componentes                            | Notas        |
| ------- | -------------------------------------- | ------------ |
| Header  | PageHeader(title, breadcrumb, actions) | Sticky top   |
| Sidebar | NavMenu(items, activeItem)             | Colapsable   |
| Content | DataTable + Filters + SearchBar        | Main area    |
| Footer  | Pagination(page, total, onChange)      | Fixed bottom |
```

---

## Criterios de Completitud

| Criterio                                                                      | Obligatorio |
| ----------------------------------------------------------------------------- | ----------- |
| Primitivos documentados con variantes y props                                 | Sí          |
| Componentes compuestos con composición                                        | Sí          |
| Estados (default, hover, disabled, loading, error) por componente interactivo | Sí          |
| Accesibilidad documentada por componente interactivo                          | Sí          |
| Composición de al menos las 3 pantallas principales                           | Sí          |

---

_Template — instancia en `docs/projects/{proyecto}/specs/components.md`_
