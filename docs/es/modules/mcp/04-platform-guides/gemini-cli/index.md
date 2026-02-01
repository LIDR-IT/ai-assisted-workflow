# Gemini CLI - Guía MCP

Documentación completa de MCP para Gemini CLI.

## Contenido

### 📦 Instalación
- **Setup básico** - Configurar Gemini CLI con MCP
- **Google Cloud** - Integración con GCP
- **Servicios Google** - Auth, Drive, etc.

### ⚙️ Configuración
- **Archivo de configuración** - `.gemini/settings.json`
- **Scopes** - Global, Project
- **Variables de entorno** - Interpolación ${VAR}

### 🔐 Autenticación
- **OAuth Google Cloud** - `gcloud auth`
- **OAuth dinámico** - Para servicios externos
- **Service Accounts** - Autenticación sin interacción

### 🎨 Contenido Rico
- **Imágenes** - Procesamiento de imágenes
- **Audio** - Transcripción y análisis
- **Video** - Análisis de video

---

## Quick Start

```bash
# 1. Instalar Gemini CLI
npm install -g @google/gemini-cli

# 2. Autenticar con Google Cloud
gcloud auth application-default login

# 3. Configurar servidor MCP
mkdir -p .gemini
cat > .gemini/settings.json << 'EOF'
{
  "mcp_servers": {
    "context7": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp"]
    }
  }
}
EOF

# 4. Verificar
gemini mcp list
```

---

**Navegación:** [← Guías de Plataforma](../index.md) | [Volver a MCP](../../README.md)
