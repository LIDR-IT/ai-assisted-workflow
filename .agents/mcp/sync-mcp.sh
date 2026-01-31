#!/bin/bash

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
MCP_CONFIG="$SCRIPT_DIR/mcp-servers.json"

echo "🔄 Sincronizando configuración MCP desde $MCP_CONFIG..."

# Verificar que existe el source of truth
if [ ! -f "$MCP_CONFIG" ]; then
  echo "❌ No se encontró $MCP_CONFIG"
  exit 1
fi

# Verificar que jq está instalado
if ! command -v jq &> /dev/null; then
  echo "❌ jq no está instalado. Instálalo con: brew install jq"
  exit 1
fi

# Función para generar config de Cursor/VS Code/Claude Code
generate_json_config() {
  local platform=$1
  local output_file=$2

  echo "  📝 Generando $output_file..."

  # Crear directorio si no existe
  mkdir -p "$(dirname "$output_file")"

  # Usar jq para transformar
  jq --arg platform "$platform" '{
    mcpServers: (
      .servers |
      to_entries |
      map(
        select(.value.platforms | index($platform)) |
        {
          key: .key,
          value: (
            .value |
            del(.platforms, .description) |
            if .type == "http" then
              {
                url: .url,
                headers: (.headers // {})
              }
            else
              {
                command: .command,
                args: (.args // []),
                env: (.env // {})
              }
            end
          )
        }
      ) |
      from_entries
    )
  }' "$MCP_CONFIG" > "$output_file"
}

# Función para generar config de Antigravity (solo referencia - NO es leído por Antigravity)
generate_antigravity_config() {
  echo "  📝 Generando .gemini/mcp_config.json (Antigravity - solo referencia)..."

  mkdir -p "$PROJECT_ROOT/.gemini"

  jq '{
    mcpServers: (
      .servers |
      to_entries |
      map(
        select(.value.platforms | index("antigravity")) |
        {
          key: .key,
          value: (
            .value |
            del(.platforms, .description) |
            if .type == "http" then
              {
                serverUrl: .url,
                headers: (.headers // {})
              }
            else
              {
                command: .command,
                args: (.args // []),
                env: (.env // {})
              }
            end
          )
        }
      ) |
      from_entries
    )
  }' "$MCP_CONFIG" > "$PROJECT_ROOT/.gemini/mcp_config.json"
}

# Función para generar config de Gemini (usa settings.json según documentación)
generate_gemini_config() {
  echo "  📝 Generando .gemini/settings.json..."

  mkdir -p "$PROJECT_ROOT/.gemini"

  # Generar settings.json para Gemini CLI
  jq '{
    mcpServers: (
      .servers |
      to_entries |
      map(
        select(.value.platforms | index("gemini")) |
        {
          key: .key,
          value: (
            .value |
            del(.platforms, .description) |
            if .type == "http" then
              {
                url: .url,
                headers: (.headers // {})
              }
            else
              {
                command: .command,
                args: (.args // []),
                env: (.env // {})
              }
            end
          )
        }
      ) |
      from_entries
    )
  }' "$MCP_CONFIG" > "$PROJECT_ROOT/.gemini/settings.json"
}

# Generar configs para cada plataforma
echo ""
echo "Generando configuraciones por plataforma..."
echo ""

# Cursor
generate_json_config "cursor" "$PROJECT_ROOT/.cursor/mcp.json"

# Claude Code
generate_json_config "claude" "$PROJECT_ROOT/.claude/mcp.json"

# Gemini CLI
generate_gemini_config

# Antigravity
generate_antigravity_config

echo ""
echo "✅ Sincronización completada"
echo ""
echo "Archivos generados:"
echo "  - .cursor/mcp.json ✅ (Cursor)"
echo "  - .claude/mcp.json ✅ (Claude Code)"
echo "  - .gemini/settings.json ✅ (Gemini CLI)"
echo "  - .gemini/mcp_config.json ⚠️  (Antigravity - solo referencia)"
echo ""
echo "⚠️  IMPORTANTE - Antigravity:"
echo "  Antigravity NO lee configuración a nivel de proyecto."
echo "  Debes configurar MCP servers manualmente en:"
echo "  ~/.gemini/antigravity/mcp_config.json"
echo ""
echo "  Ver docs/guides/mcp/ANTIGRAVITY_LIMITATION.md para más detalles."
echo ""
echo "⚠️  Recuerda configurar las variables de entorno necesarias:"
echo "  export CONTEXT7_API_KEY=\"tu-api-key\""
echo ""
echo "Para verificar:"
echo "  - Cursor: Abrir y verificar MCP servers"
echo "  - Claude Code: claude mcp list"
echo "  - Gemini CLI: gemini /mcp"
