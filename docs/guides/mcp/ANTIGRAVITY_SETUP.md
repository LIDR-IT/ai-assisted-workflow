# Setup de MCP en Antigravity (Configuración Global)

## ⚠️ Importante

Antigravity **NO soporta** configuración MCP a nivel de proyecto. Solo lee la configuración global del usuario.

---

## Ubicación del Archivo

**macOS/Linux:**
```
~/.gemini/antigravity/mcp_config.json
```

**Windows:**
```
C:\Users\<USER_NAME>\.gemini\antigravity\mcp_config.json
```

---

## Método 1: Via UI (Recomendado)

1. Abre Antigravity
2. Inicia una sesión de Agent
3. Click en "..." (menú dropdown) en el top del panel lateral
4. Selecciona "MCP Servers"
5. Click "Manage MCP Servers"
6. Click "View raw config"
7. Edita el JSON agregando tu servidor

---

## Método 2: Edición Manual del Archivo

### Para agregar Context7

1. Abre el archivo de configuración:
```bash
# macOS/Linux
vim ~/.gemini/antigravity/mcp_config.json

# O con editor de texto
code ~/.gemini/antigravity/mcp_config.json
```

2. Agrega Context7 al objeto `mcpServers`:
```json
{
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp"],
      "env": {
        "CONTEXT7_API_KEY": "${env:CONTEXT7_API_KEY}"
      }
    }
  }
}
```

3. Si ya tienes otros servers, agrégalo como un nuevo entry:
```json
{
  "mcpServers": {
    "existing-server": {
      "command": "...",
      "args": [...]
    },
    "context7": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp"],
      "env": {
        "CONTEXT7_API_KEY": "${env:CONTEXT7_API_KEY}"
      }
    }
  }
}
```

---

## Verificación

Ejecuta el comando:
```bash
gemini mcp list
```

Deberías ver:
```
✓ context7: npx -y @upstash/context7-mcp (stdio) - Connected
```

---

## Configuración de Variables de Entorno

Context7 funciona sin API key, pero se recomienda configurarla para límites más altos.

**Agrega a tu `~/.zshrc` o `~/.bashrc`:**
```bash
export CONTEXT7_API_KEY="tu-api-key-aqui"
```

**Obtén tu API key gratis en:**
https://context7.com/dashboard

**Recarga el shell:**
```bash
source ~/.zshrc  # o ~/.bashrc
```

---

## Usando Context7 en Antigravity

Una vez configurado, puedes usarlo en tus sesiones:

```
@context7 How do I use React hooks?
@context7 What's new in Next.js 15?
@context7 Best practices for TypeScript
```

---

## Otros MCP Servers Útiles

### Supabase
```json
"supabase-mcp-server": {
  "command": "npx",
  "args": [
    "-y",
    "@supabase/mcp-server-supabase@latest",
    "--access-token",
    "tu-access-token"
  ],
  "env": {}
}
```

### Filesystem
```json
"filesystem": {
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-filesystem", "/ruta/al/directorio"],
  "env": {}
}
```

---

## Troubleshooting

### Server no aparece
1. Verifica que el JSON sea válido:
```bash
jq '.' ~/.gemini/antigravity/mcp_config.json
```

2. Reinicia Antigravity completamente

3. Verifica que NPX funcione:
```bash
npx -y @upstash/context7-mcp --help
```

### Error de conexión
1. Verifica la variable de entorno:
```bash
echo $CONTEXT7_API_KEY
```

2. Verifica permisos del archivo:
```bash
ls -la ~/.gemini/antigravity/mcp_config.json
```

---

## Para Equipos

Como Antigravity NO soporta configuración a nivel de proyecto:

1. **Documenta** los MCP servers necesarios en el README del proyecto
2. **Cada desarrollador** debe configurarlos manualmente en su máquina
3. **Usa `.gemini/mcp_config.json`** en el proyecto como referencia (no será leído)
4. **Automatiza** con script de onboarding si es posible

### Script de Ejemplo para Onboarding

```bash
#!/bin/bash
# scripts/setup-antigravity-mcp.sh

echo "📝 Configurando MCP servers para Antigravity..."

CONFIG_FILE="$HOME/.gemini/antigravity/mcp_config.json"
REFERENCE_FILE=".gemini/mcp_config.json"

if [ ! -f "$CONFIG_FILE" ]; then
  echo "⚠️  No se encontró $CONFIG_FILE"
  echo "Creando configuración inicial..."
  mkdir -p "$(dirname "$CONFIG_FILE")"
  cp "$REFERENCE_FILE" "$CONFIG_FILE"
  echo "✅ Configuración creada"
else
  echo "ℹ️  Ya existe $CONFIG_FILE"
  echo "Revisa .gemini/mcp_config.json como referencia"
  echo "y agrega manualmente los servers que necesites"
fi
```

---

## Referencias

- [Antigravity MCP Documentation](https://antigravity.google/docs/mcp)
- [Context7 GitHub](https://github.com/upstash/context7)
- [MCP Server Hub](https://antigravity.codes)
- Ver también: `docs/guides/mcp/ANTIGRAVITY_LIMITATION.md`

---

**Última actualización:** Enero 2026
**Probado con:** Antigravity (Google AI Studio)
**Estado:** ✅ Funcionando
