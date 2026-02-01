# Usando MCP

Guías prácticas para instalar, configurar y usar servidores MCP en tus proyectos.

## Contenido

### 🚀 Instalación y Configuración

- **[Resumen de Instalación](installation-overview.md)**
  Métodos de transporte (stdio, SSE, HTTP) y cómo elegir el adecuado

- **[Variables de Entorno](environment-variables.md)**
  Interpolación de configuración con ${VARIABLE_NAME}

- **[Configuración por Ámbito](scoped-configuration.md)**
  Configuraciones a nivel Local, Proyecto y Usuario

### 🔐 Autenticación

- **[Guía de OAuth](authentication/oauth-guide.md)**
  Configurar autenticación OAuth para servidores MCP
  - OAuth dinámico vs estático
  - Integración con Google Cloud
  - Flujo de autorización

### 📦 Trabajando con Recursos

- **[Recursos y Prompts](resources-and-prompts.md)**
  Usar menciones @ y comandos con recursos MCP
  - Menciones de recursos (@resource)
  - Plantillas de prompts
  - Integración con slash commands

---

## Guías Paso a Paso

### Instalando tu Primer Servidor MCP

1. **Elige el método de transporte**
   - stdio: Para servidores locales (más común)
   - SSE: Para servidores remotos con streaming
   - HTTP: Para APIs REST

2. **Configura el servidor**
   ```json
   {
     "mcpServers": {
       "nombre-servidor": {
         "command": "npx",
         "args": ["-y", "paquete-servidor"]
       }
     }
   }
   ```

3. **Verifica la instalación**
   - Claude Code: `claude mcp list`
   - Cursor: Revisar extensiones MCP
   - Gemini CLI: `gemini mcp list`

### Usando Variables de Entorno

```json
{
  "mcpServers": {
    "api-server": {
      "command": "npx",
      "args": ["-y", "api-mcp-server"],
      "env": {
        "API_KEY": "${MI_API_KEY}"
      }
    }
  }
}
```

Luego define en tu shell:
```bash
export MI_API_KEY="tu-api-key-aqui"
```

---

## Configuración por Plataforma

### Claude Code
- **Archivo:** `.claude/mcp.json`
- **Ámbitos:** Local, Proyecto, Usuario
- **OAuth:** Dinámico (nativo)

### Cursor
- **Archivo:** `.cursor/mcp.json`
- **Ámbitos:** Local, Proyecto
- **OAuth:** Estático (manual)

### Gemini CLI
- **Archivo:** `.gemini/settings.json`
- **Ámbitos:** Global, Proyecto
- **OAuth:** Google Cloud + Dinámico

### Antigravity
- **Archivo:** `~/.gemini/antigravity/mcp_config.json`
- **Ámbitos:** Solo Global
- **OAuth:** Dinámico

Ver [Guías de Plataforma](../04-platform-guides/) para detalles específicos.

---

## Recursos Comunes

### Servidores MCP Populares

- **Context7** - Documentación de librerías
- **Supabase** - Base de datos y autenticación
- **Playwright** - Automatización de navegador
- **Browserbase** - Navegador en la nube
- **GitHub** - Integración con repositorios

Ver [Servidores Disponibles](../06-ecosystem-tools/available-servers.md) para lista completa.

---

## Solución de Problemas

### El servidor no se conecta
1. Verifica que el comando existe: `which npx`
2. Prueba el servidor manualmente: `npx -y paquete-servidor`
3. Revisa los logs de la plataforma

### Variables de entorno no funcionan
1. Asegúrate de usar el formato correcto: `${NOMBRE_VAR}`
2. Verifica que la variable esté exportada en tu shell
3. Reinicia el cliente MCP después de cambiar variables

### OAuth falla
1. Verifica las credenciales en el proveedor OAuth
2. Confirma que la URL de callback sea correcta
3. Revisa que los scopes sean suficientes

Ver [Troubleshooting](../07-reference/troubleshooting.md) para más soluciones.

---

## Siguiente Paso

Una vez que sepas usar servidores MCP:
- Aprende a [Crear tus Propios Servidores](../03-creating-servers/)
- Explora [Guías Específicas de Plataforma](../04-platform-guides/)
- Revisa [Temas Avanzados](../05-advanced/) para configuraciones complejas

---

**Navegación:** [← Fundamentos](../01-fundamentals/) | [Volver a MCP](../README.md) | [Crear Servidores →](../03-creating-servers/)
