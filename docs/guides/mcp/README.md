# MCP Setup Guides

Guías detalladas de configuración, troubleshooting y validación de MCP servers.

## 📚 Guías Disponibles

### Setup y Configuración

**[mcp-setup-guide.md](./mcp-setup-guide.md)**
- Configuración completa de Context7
- Setup por plataforma (Cursor, Claude, Gemini CLI)
- Uso de MCP servers
- Troubleshooting común

**[ANTIGRAVITY_SETUP.md](./ANTIGRAVITY_SETUP.md)**
- Configuración específica de Antigravity
- Configuración global vs proyecto
- Instrucciones paso a paso
- Ejemplos de otros MCP servers

### Limitaciones y Consideraciones

**[ANTIGRAVITY_LIMITATION.md](./ANTIGRAVITY_LIMITATION.md)**
- Por qué Antigravity no soporta MCP a nivel de proyecto
- Impacto en el desarrollo
- Soluciones alternativas
- Estado de la funcionalidad

### Validación y Testing

**[VALIDATION.md](./VALIDATION.md)**
- Checklist completo de validación
- Verificación por plataforma
- Testing de funcionalidad
- Troubleshooting avanzado

---

## 🔗 Enlaces Relacionados

### Configuración Operacional
- `.agents/mcp/` - Source of truth y scripts de sincronización
- `.agents/mcp/README.md` - Quick start

### Documentación de Referencia
- `docs/references/mcp/` - Documentación técnica por plataforma
  - mcp-cursor.md
  - mcp-gemini-cli.md
  - mcp-antigravity.md
  - mcp-integration-claude-code.md
  - mcp-usage-claude-code.md
  - mcp-openai-codex.md
  - mcp-introduction.md
  - mcp-server-builder.md

---

## 🚀 Quick Start

1. **Leer** [mcp-setup-guide.md](./mcp-setup-guide.md) para setup completo
2. **Ejecutar** `.agents/mcp/sync-mcp.sh` para sincronizar
3. **Validar** siguiendo [VALIDATION.md](./VALIDATION.md)
4. **Configurar Antigravity** siguiendo [ANTIGRAVITY_SETUP.md](./ANTIGRAVITY_SETUP.md)

---

## 📝 Estructura de Documentación

```
MCP Documentation
│
├── Operacional (.agents/mcp/)
│   ├── mcp-servers.json        # Source of truth
│   ├── sync-mcp.sh              # Script de sync
│   └── README.md                # Quick start
│
├── Guías (docs/guides/mcp/)     # ← ESTÁS AQUÍ
│   ├── mcp-setup-guide.md       # Setup completo
│   ├── ANTIGRAVITY_SETUP.md     # Setup Antigravity
│   ├── ANTIGRAVITY_LIMITATION.md
│   └── VALIDATION.md
│
└── Referencias (docs/references/mcp/)
    ├── mcp-introduction.md      # Introducción a MCP
    ├── mcp-server-builder.md    # Cómo crear servers
    └── mcp-{platform}.md        # Docs por plataforma
```

---

**Última actualización:** Enero 2026
**Mantenido por:** Template Best Practices Project
