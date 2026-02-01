# Fundamentos de Skills

Comprende los conceptos básicos de los skills y cómo extienden las capacidades de los agentes de IA.

## Contenido

### 📖 Conceptos Básicos

- **[¿Qué son los Skills?](what-are-skills.md)**
  Introducción a skills, diferencias con MCP y comandos, casos de uso principales

- **[Arquitectura](architecture.md)**
  Cómo funcionan los skills: carga, procesamiento y ejecución

- **[Anatomía de un Skill](skill-anatomy.md)**
  Estructura de archivos, frontmatter YAML, y formato Markdown

---

## Ruta de Aprendizaje

### Nivel 1: Conceptos
1. Empieza con [¿Qué son los Skills?](what-are-skills.md) para entender el propósito
2. Lee [Arquitectura](architecture.md) para ver cómo funcionan internamente

### Nivel 2: Estructura
3. Aprende la [Anatomía de un Skill](skill-anatomy.md) - frontmatter + markdown
4. Comprende las diferencias entre skills, MCP y comandos

### Siguiente Paso
Una vez que domines los fundamentos, continúa con:
- [Usando Skills](../02-using-skills/) - Descubrir e instalar skills
- [Creando Skills](../03-creating-skills/) - Construir tus propios skills

---

## Conceptos Clave

### Skills vs MCP vs Comandos

| Característica | Skills | MCP | Comandos |
|----------------|--------|-----|----------|
| **Propósito** | Conocimiento especializado | Herramientas externas | Acciones del usuario |
| **Formato** | Markdown + frontmatter | JSON-RPC server | Markdown + frontmatter |
| **Ejecución** | Inyección de contexto | Llamadas a funciones | Procesamiento directo |
| **Activación** | Automática o manual | Por herramientas | Manual (slash) |
| **Complejidad** | Baja | Alta | Media |

### Cuándo Usar Skills

**✅ Usa skills cuando:**
- Necesitas añadir conocimiento especializado
- Quieres flujos de trabajo reutilizables
- El contenido es principalmente textual
- La lógica es declarativa

**❌ No uses skills cuando:**
- Necesitas ejecutar código externo (usa MCP)
- Requieres acciones del sistema (usa comandos)
- La lógica es muy compleja (usa agentes)

---

## Ejemplo Básico

### Estructura Mínima

```markdown
---
name: ejemplo-skill
description: Skill de ejemplo para demostración
---

# Ejemplo de Skill

Este es el contenido del skill que será inyectado
en el contexto del agente cuando se active.

## Instrucciones

1. Sigue estos pasos
2. Aplica estos principios
3. Genera este resultado
```

### Frontmatter Esencial

```yaml
---
name: nombre-del-skill           # Requerido: identificador único
description: Descripción breve    # Requerido: cuándo activar
---
```

Ver [Anatomía de un Skill](skill-anatomy.md) para estructura completa.

---

## Preguntas Frecuentes

**¿Necesito saber programar para crear skills?**
No. Los skills son archivos Markdown simples con frontmatter YAML. No requieren código.

**¿Los skills funcionan en todas las plataformas?**
Principalmente Claude Code y Antigravity. Cursor y Gemini CLI pueden usar OpenSkills loader.

**¿Cuál es la diferencia entre un skill y un prompt?**
Un skill incluye metadata (frontmatter) y condiciones de activación. Un prompt es solo texto.

**¿Puedo combinar skills con MCP?**
Sí, son complementarios. Skills proveen conocimiento, MCP provee herramientas.

---

**Navegación:** [← Volver a Skills](../index.md) | [Usando Skills →](../02-using-skills/)
