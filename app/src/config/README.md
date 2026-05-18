# JSON Configuration Hierarchy System

Este directorio contiene el sistema de configuración jerárquica que permite a los desarrolladores personalizar la aplicación sin código, usando solo archivos JSON.

## 🎯 Filosofía: Simple y Basado en Archivos

- **No UI**: Solo archivos JSON editables
- **No Base de Datos**: Configuración en archivos versionables
- **Jerárquico**: Global → Cliente → Proyecto → Página → Bloque
- **Type-safe**: Validación TypeScript automática
- **Cacheable**: Performance optimizada con cache inteligente

## 📁 Estructura de Directorios

```
src/config/
├── global.json              # 🌍 Configuración base para toda la app
├── clients/                 # 🏢 Configuraciones específicas por cliente
│   ├── facephi.json        # Cliente FacePhi (biometría)
│   └── docline.json        # Cliente Docline (healthcare)
├── projects/                # 📋 Configuraciones específicas por proyecto
│   └── sdlc-2024.json      # Proyecto SDLC 2024 con overrides
└── README.md               # Esta documentación
```

## 🔄 Jerarquía de Configuración

### Orden de Precedencia (Mayor a Menor):

1. **Block Config** - Configuración específica en JSON del contenido
2. **Page Config** - Configuración a nivel de página
3. **Project Config** - `/config/projects/{projectId}.json`
4. **Client Config** - `/config/clients/{clientId}.json`
5. **Global Config** - `/config/global.json`

### Ejemplo de Resolución:

```javascript
// 1. Global: primary = "bg-blue-500"
// 2. Client (FacePhi): primary = "bg-indigo-600"  ← Override
// 3. Project (SDLC-2024): primary = "bg-purple-700"  ← Override
// 4. Block: primary = "bg-custom-red"  ← Final winner

// Resultado: "bg-custom-red"
```

## 🏗️ Estructura de Configuración

### Global Configuration (global.json)

Configuración base que se aplica a toda la aplicación:

```json
{
  "metadata": {
    "version": "1.0.0",
    "description": "Global defaults"
  },
  "colors": {
    "primary": "bg-blue-500",
    "secondary": "bg-gray-100"
  },
  "features": {
    "customBlocks": true,
    "colorCustomization": true
  },
  "components": {
    "blocks": {
      "defaultPadding": "p-6",
      "showIcons": true
    }
  }
}
```

### Client Configuration (clients/{clientId}.json)

Configuración específica para cada cliente:

```json
{
  "metadata": {
    "clientId": "facephi",
    "clientName": "FacePhi",
    "industry": "Biometric Technology"
  },
  "branding": {
    "companyName": "FacePhi",
    "primaryColor": "#6366F1"
  },
  "colors": {
    "primary": "bg-indigo-600", // Override global
    "accent": "text-indigo-600" // New color
  },
  "templateVariables": {
    "CLIENT_NAME": "FacePhi",
    "INDUSTRY": "Biometric Technology"
  },
  "features": {
    "biometricDiagrams": true // Client-specific feature
  }
}
```

### Project Configuration (projects/{projectId}.json)

Configuración específica para proyectos:

```json
{
  "metadata": {
    "projectId": "sdlc-2024",
    "clientId": "facephi",
    "inheritsFrom": ["global", "clients/facephi"]
  },
  "colors": {
    "primary": "bg-purple-700" // Override client color
  },
  "customizations": {
    "blockSpecific": {
      "chart": {
        // Configuración específica para ChartBlock
        "defaultHeight": 350,
        "showProjectBranding": true,
        "colors": {
          "primary": "#8B5CF6"
        }
      }
    }
  }
}
```

## 🚀 Uso en Componentes

### 1. Hook Principal - useConfiguration

```typescript
import { useConfiguration } from '../hooks/useConfiguration';

function MyComponent() {
  const { config, colors, templateVariables, isLoading } = useConfiguration({
    projectId: 'sdlc-2024',      // Opcional
    enableDebug: true           // Solo en desarrollo
  });

  if (isLoading) return <div>Loading config...</div>;

  return (
    <div className={colors.background}>
      <h1>Welcome {templateVariables.CLIENT_NAME}</h1>
    </div>
  );
}
```

### 2. Hook para Blocks - useBlockConfiguration

```typescript
import { useBlockConfiguration } from '../hooks/useConfiguration';

function CustomChartBlock({ block }) {
  const { blockConfig, colors, templateVariables } = useBlockConfiguration('chart', {
    customColors: block.config?.colors,
    customConfig: { height: block.content.height }
  });

  // blockConfig contiene configuración jerárquica específica para charts
  const height = blockConfig?.defaultHeight || 200;
  const showBranding = blockConfig?.showProjectBranding || false;

  return (
    <div style={{ height }}>
      {showBranding && <div>{templateVariables.PROJECT_CODE}</div>}
      {/* Chart content */}
    </div>
  );
}
```

### 3. Hook Ligero - useTemplateVariables

```typescript
import { useTemplateVariables } from '../hooks/useConfiguration';

function HeaderComponent() {
  const { variables } = useTemplateVariables('sdlc-2024');

  return <h1>{variables.CLIENT_NAME} - {variables.PROJECT_NAME}</h1>;
}
```

## 🎨 Sistema de Colores Jerárquico

### Formatos Soportados:

- **Tailwind CSS**: `"bg-blue-500"`, `"text-red-600"`
- **Hex**: `"#3b82f6"`, `"#ff0000"`
- **RGB**: `"rgb(59, 130, 246)"`
- **CSS Custom Properties**: `"--primary-color"`

### Ejemplo de Herencia:

```json
// global.json
{
  "colors": {
    "primary": "bg-blue-500",
    "secondary": "bg-gray-100",
    "text": "text-gray-900"
  }
}

// clients/facephi.json
{
  "colors": {
    "primary": "bg-indigo-600",     // Override
    "accent": "text-indigo-600"     // Nuevo
    // secondary y text se heredan de global
  }
}

// Resultado final:
{
  "primary": "bg-indigo-600",       // De facephi
  "secondary": "bg-gray-100",       // De global
  "text": "text-gray-900",           // De global
  "accent": "text-indigo-600"       // De facephi
}
```

## 🔄 Template Variables

### Variables de Diferentes Niveles:

```json
// Global
{
  "templateVariables": {
    "APP_NAME": "LIDR SDLC",
    "VERSION": "1.0.0"
  }
}

// Client (facephi)
{
  "templateVariables": {
    "CLIENT_NAME": "FacePhi",
    "INDUSTRY": "Biometric Technology",
    "SUPPORT_EMAIL": "support@facephi.com"
  }
}

// Project (sdlc-2024)
{
  "templateVariables": {
    "PROJECT_NAME": "SDLC Implementation 2024",
    "PROJECT_CODE": "SDLC-2024",
    "TARGET_COMPLETION": "Q4 2024"
  }
}
```

### Uso en Contenido JSON:

```json
{
  "header": {
    "title": "{{CLIENT_NAME}} - {{PROJECT_NAME}}",
    "subtitle": "Industry: {{INDUSTRY}} • Target: {{TARGET_COMPLETION}}"
  },
  "blocks": [
    {
      "type": "rich-text",
      "content": {
        "text": "Welcome to {{CLIENT_NAME}}'s SDLC implementation project. Support: {{SUPPORT_EMAIL}}"
      }
    }
  ]
}
```

## 🛠️ Configuración de Block Personalizada

### Para Custom Blocks:

```json
// projects/sdlc-2024.json
{
  "customizations": {
    "blockSpecific": {
      "chart": {
        "defaultHeight": 350,
        "showProjectBranding": true,
        "colors": {
          "primary": "#8B5CF6",
          "secondary": "#6366F1"
        }
      },
      "table": {
        "striped": true,
        "sortable": true,
        "exportable": true
      }
    }
  }
}
```

### En el Custom Block:

```typescript
export default function ChartBlock({ block }) {
  const { blockConfig, colors, templateVariables } = useBlockConfiguration('chart', {
    customColors: block.config?.colors
  });

  // blockConfig contiene la configuración jerárquica para 'chart'
  const height = blockConfig?.defaultHeight || block.content.height || 200;
  const showBranding = blockConfig?.showProjectBranding || false;
  const chartColors = blockConfig?.colors || {};

  return (
    <div style={{ height }}>
      {/* Chart con configuración jerárquica */}
    </div>
  );
}
```

## 🎯 Casos de Uso Reales

### 1. Multi-Cliente con Mismo Sistema

```javascript
// Cliente FacePhi: Colores morados, iconos biométricos
await resolveConfig('facephi');

// Cliente Docline: Colores verdes, iconos healthcare
await resolveConfig('docline');

// Mismo código, diferentes configuraciones
```

### 2. Proyecto Especial con Overrides

```javascript
// Proyecto SDLC 2024: Colores especiales, branding adicional
await resolveConfig('facephi', 'sdlc-2024');
```

### 3. A/B Testing de Configuraciones

```javascript
// Versión A: Configuración estándar
const configA = await resolveConfig('facephi');

// Versión B: Con overrides específicos
const configB = await resolveConfig('facephi', 'experiment-v2');
```

## 🚀 Performance y Caching

### Cache Automático:

- **TTL**: 5 minutos por defecto
- **Invalidación**: Automática en development
- **Scope**: Por cliente + proyecto

### Cache Management:

```typescript
import { clearConfigCache, clearConfigCacheFor } from '../data/config-resolver';

// Limpiar todo el cache
clearConfigCache();

// Limpiar cache específico
clearConfigCacheFor('facephi', 'sdlc-2024');
```

## 🧪 Testing y Debug

### Development Mode:

```typescript
// Hook con debug habilitado
const { config } = useConfiguration({ enableDebug: true });

// Debugger para testing
const { testConfiguration } = useConfigurationDebugger();
await testConfiguration('facephi', 'sdlc-2024');
```

### Validación:

```typescript
import { validateConfig } from '../data/config-resolver';

const validation = validateConfig(myConfig, 'client');
if (!validation.isValid) {
  console.error('Errors:', validation.errors);
  console.warn('Warnings:', validation.warnings);
}
```

## 📝 Mejores Prácticas

### 1. Estructura de Archivos

- **global.json**: Solo defaults que aplican a todos
- **clients/\*.json**: Configuración específica del cliente
- **projects/\*.json**: Overrides temporales o específicos

### 2. Naming Conventions

```json
{
  "colors": {
    "primary": "...", // Consistente entre configs
    "clientPrimary": "..." // Cliente-específico
  }
}
```

### 3. Template Variables

```json
{
  "templateVariables": {
    "CLIENT_NAME": "FacePhi", // UPPER_SNAKE_CASE
    "support_email": "support@...", // snake_case para URLs/emails
    "projectCode": "SDLC-2024" // camelCase para códigos
  }
}
```

### 4. Versionado

- **Semantic Versioning**: `"version": "1.2.0"`
- **Changelog**: Documentar cambios breaking
- **Backup**: Versionar configs importantes

## 🔄 Migración desde Sistema Anterior

### Antes (hardcoded):

```typescript
const colors = {
  primary: 'bg-violet-600',
  background: 'bg-violet-50',
};
```

### Después (jerárquico):

```typescript
const { colors } = useConfiguration();
// Colores automáticamente resueltos por jerarquía
```

## 🚨 Troubleshooting

### Config No Se Carga:

1. Verificar que el archivo JSON sea válido
2. Comprobar la ruta del archivo
3. Limpiar cache: `clearConfigCache()`

### Variables No Se Resuelven:

1. Verificar sintaxis: `{{VARIABLE_NAME}}`
2. Comprobar que la variable existe en la jerarquía
3. Debug con `enableDebug: true`

### Colors No Aplican:

1. Verificar formato de color válido
2. Comprobar que el hook se ejecuta correctamente
3. Revisar conflictos en CSS

---

## 🎉 Resultado

Con este sistema, puedes:

- **Customizar visualmente** cualquier cliente sin tocar código
- **Mantener consistencia** con configuración global
- **Override específico** para proyectos especiales
- **Variables dinámicas** en todo el contenido
- **Performance optimizada** con caching inteligente

**¡Todo con archivos JSON simples, sin UI compleja ni base de datos!**
