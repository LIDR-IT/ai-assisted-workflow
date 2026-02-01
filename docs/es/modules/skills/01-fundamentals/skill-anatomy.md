# Anatomía del Skill

## Descripción General

Cada skill sigue una estructura estandarizada que permite el descubrimiento, la divulgación progresiva y la compatibilidad multiplataforma. Esta guía cubre la anatomía de un skill bien estructurado.

![Anatomía del Skill](https://via.placeholder.com/800x400?text=Anatomía+del+Skill)

## Estructura del Directorio

Un skill no es solo un archivo, sino un directorio que contiene instrucciones principales y recursos de apoyo:

```
nombre-del-skill/
├── SKILL.md           # Punto de entrada e instrucciones principales (REQUERIDO)
│
├── references/        # Documentación profunda y guías detalladas (OPCIONAL)
│   ├── patrones.md
│   └── api-docs.md
│
├── examples/          # Ejemplos de código funcionales y ejecutables (OPCIONAL)
│   ├── implementacion-basica.js
│   └── caso-de-uso-avanzado.ts
│
├── scripts/           # Scripts de automatización y validación (OPCIONAL)
│   ├── validar.sh
│   └── generar-boilerplate.py
│
└── assets/            # Archivos estáticos y plantillas (OPCIONAL)
    ├── imagen.png
    └── plantilla-de-salida.md
```

### 1. SKILL.md (El Punto de Entrada)

Este es el archivo más importante. Contiene los metadatos y las instrucciones centrales.

**Componentes:**
- **Frontmatter YAML:** Metadatos para el descubrimiento y el comportamiento.
- **Contenido Markdown:** Las instrucciones reales para el agente.

### 2. Directorio references/

Utilizado para el conocimiento de "Nivel 3". Esta información no se carga inicialmente.

**Cuándo usar:**
- Guías de referencia extensas.
- Listas de API detalladas.
- Documentos de diseño de arquitectura.
- Guías de estilo de código completas.

**Cómo lo usa el Agente:**
"Cuando trabaje en el archivo X, lea el documento de referencia `references/api-docs.md` para entender el esquema."

### 3. Directorio examples/

Los agentes de IA aprenden mejor a través de ejemplos (few-shot prompting).

**Cuándo usar:**
- Para mostrar la implementación correcta de patrones.
- Para proporcionar puntos de partida (boilerplate).
- Para demostrar configuraciones complejas.

**Cómo lo usa el Agente:**
"Siga el patrón demostrado en `examples/implementacion-basica.js` para crear el nuevo servicio."

### 4. Directorio scripts/

Habilita a los agentes para realizar tareas deterministas.

**Cuándo usar:**
- Para validar el código (linters personalizados).
- Para generar archivos complejos.
- Para realizar limpiezas o migraciones.

**Cómo lo usa el Agente:**
"Después de crear el componente, ejecute `bash scripts/validar.sh` para asegurar el cumplimiento."

---

## El Archivo SKILL.md en Detalle

### Frontmatter YAML

Ubicado en la parte superior del archivo, entre marcadores `---`.

```yaml
---
name: explain-code
description: Explica código complejo usando analogías y diagramas visuales.
argument-hint: [filename]
disable-model-invocation: false
user-invocable: true
---
```

**Campos Clave:**
- `name`: Nombre del skill (usado en `/nombre-del-skill`).
- `description`: **CRÍTICO.** Determina cuándo el agente activa el skill automáticamente.
- `argument-hint`: Pista que se muestra al usuario durante la invocación manual.
- `disable-model-invocation`: Si es `true`, el agente no lo activará automáticamente.
- `user-invocable`: Si es `false`, no aparecerá en el menú de comandos slash.

### Contenido Markdown

Instrucciones directas, accionables y precisas.

**Mejores Prácticas:**
- **Sé directo:** "Utilice el patrón Factory para la creación de objetos."
- **Usa jerarquía:** Utilice encabezados (`#`, `##`) para organizar conceptos.
- **Usa bloques de código:** Proporcione fragmentos de código de ejemplo.
- **Evita la paja:** Mantenga las instrucciones concisas.

---

## Modelo de Carga de Contenido

Toda la anatomía del skill está diseñada para la **Divulgación Progresiva**:

| Nivel | Componente | Cuándo se carga | Presupuesto de Contexto |
|:------|:-----------|:----------------|:------------------------|
| **1** | Descripción (Frontmatter) | Siempre (Descubrimiento) | ~100 palabras |
| **2** | Cuerpo de SKILL.md | En la activación del skill | < 5,000 palabras |
| **3** | Recursos (Ref/Ex/Scripts) | Bajo demanda / Según necesidad | Variable |

### Por qué es importante:
Si se cargaran 50 skills completos por adelantado, el agente se quedaría sin memoria de contexto antes de empezar a trabajar. Esta anatomía permite que el agente tenga acceso a "experiencia infinita" cargando solo lo que es relevante en cada momento.

---

## Ciclo de Vida del Skill

1. **Descubrimiento:** El usuario pide algo -> El agente escanea las `descriptions` de los skills.
2. **Activación:** Se encuentra una coincidencia -> El agente carga el cuerpo de `SKILL.md`.
3. **Ejecución:** El agente sigue las instrucciones -> Carga archivos de `references/` o ejecuta `scripts/` si es necesario.
4. **Finalización:** La tarea termina -> El skill se descarga para liberar contexto.

---

## Siguientes Pasos

- **Aprender sobre el descubrimiento:** [Descubriendo Skills](../02-using-skills/discovery.md)
- **Ver ejemplos reales:** [Ejemplos de Skills](../07-reference/examples.md)
- **Crear un skill:** [Flujo de Trabajo de Creación](../03-creating-skills/workflow.md)

---

**Relacionado:**
- [¿Qué son los Skills?](what-are-skills.md) - Definición del concepto.
- [Arquitectura](architecture.md) - El modelo Agente + Skills + Computadora.
- [Campos Frontmatter](../07-reference/frontmatter-fields.md) - Referencia completa de YAML.
