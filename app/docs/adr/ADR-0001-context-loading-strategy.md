---
id: adr-0001
version: '1.0.1'
last_updated: '2026-05-15'
updated_by: 'audit-standards skill'
status: accepted
type: standard
owner_role: 'TL'
review_cycle: 90
next_review: '2026-08-13'
---

## ADR-0001: Estrategia de Carga de Contexto — Rules Lean + Skills Fat

### Estado

accepted

### Fecha

2026-03-09

### Contexto

Las 5 rules del ecosistema SDLC {{CLIENT_NAME}}, configuradas con `alwaysApply: true` y referencias `@` a 14 documentos en `docs/`, consumian aproximadamente ~80k tokens (40% de la ventana de contexto de 200k) en CADA sesion. Esto dejaba solo ~73k tokens disponibles para el trabajo real de la sesion (generacion, analisis, codigo).

El impacto observable era:

- **Autocompact frecuente** en tareas complejas que requerien multiples skills y herramientas
- **Perdida de contexto** al compactar, forzando al usuario a repetir instrucciones
- **Sesiones artificialmente cortas** porque el presupuesto de contexto se agotaba rapido
- **Tokens desperdiciados**: la mayoria de sesiones solo necesitan 1-2 docs de referencia, no los 14 cargados permanentemente

Las 5 rules afectadas y sus referencias `@`:

- `org.md` — referenciaba `@../../standards/org.md`, `@../../checklists/*` (8 archivos), `@../../signoffs/*` (2 archivos)
- `tech-stack.md` — autocontenida pero siempre cargada (200-400 lineas)
- `project.md` — referenciaba `@../../projects/sdlc-{{CLIENT_CODE}}.md`
- `documentation.md` — autocontenida, gobernanza DTC
- `workflows.md` — referenciaba commands y skills catalog

### Problema

Como reducir el consumo permanente de contexto (~40%) manteniendo acceso completo a todos los documentos del ecosistema cuando la tarea lo requiere?

### Decision Drivers

- **Eficiencia de ventana de contexto**: maximizar tokens disponibles para trabajo productivo
- **Autonomia de skills**: cada skill debe ser autocontenido y cargar solo lo que necesita
- **Escalabilidad**: a medida que el ecosistema crece (mas docs, mas checklists), el consumo fijo no debe crecer linealmente
- **Precision de retrieval**: cargar docs relevantes a la tarea, no todos siempre

### Opciones Consideradas

#### Opcion 1: All alwaysApply (status quo)

- **Pros**: Simple — no hay que pensar en que se carga. La IA siempre tiene todo el contexto organizacional disponible. Cero riesgo de que falte un doc.
- **Cons**: Consume ~80k tokens (40%) en cada sesion. No escala: cada nuevo doc referenciado por rules aumenta el consumo fijo. Causa autocompact en tareas complejas.

#### Opcion 2: Rules lean + skills fat (propuesta)

- **Pros**: Reduce consumo permanente a ~20k tokens (~10%). Libera ~60k tokens para trabajo productivo. Skills cargan exactamente los docs que necesitan. Escala sin aumentar consumo base. Elimina autocompact en la mayoria de sesiones.
- **Cons**: Si un skill no se activa, la IA no tendra ciertos docs en contexto. Requiere mantener referencias `@` en mas archivos (skills/commands en vez de rules). Esfuerzo inicial de migracion.

#### Opcion 3: Tier hibrido con description-based rules

- **Pros**: Ahorro moderado (~25% en vez de 40%). Algunas rules se cargan solo cuando son relevantes (por ejemplo, `tech-stack.md` solo en archivos de codigo). Menor esfuerzo de migracion que Opcion 2.
- **Cons**: Ahorro insuficiente — solo reduce de 40% a ~25%. No resuelve el problema de escalabilidad. La distincion entre "siempre" y "bajo demanda" es confusa para rules que son "casi siempre" necesarias.

### Decision

Se elige **Opcion 2: Rules lean + skills fat** porque maximiza la eficiencia de contexto (de 40% a ~10% de consumo fijo) mientras mantiene acceso completo al ecosistema a traves de skills y commands que cargan sus dependencias bajo demanda. Es la unica opcion que escala con el crecimiento del ecosistema.

**Cambios concretos**:

1. **Rules Tier 1 (alwaysApply, sin frontmatter YAML)**: `org.md`, `project.md`, `documentation.md`
   - Se eliminan las referencias `@` a `docs/` — las rules son lean, solo contienen directrices e interpretacion IA
   - Referencian docs por ruta textual (ej: `skills/pr-description/checklists/dod.md`) pero SIN prefijo `@` que auto-cargaria el archivo

2. **Rules Tier 2 (bajo demanda, con frontmatter YAML)**: `tech-stack.md`, `workflows.md`
   - `tech-stack.md` se activa via globs (`*.ts`, `*.tsx`, etc.) — solo se carga cuando se trabaja con codigo
   - `workflows.md` se activa via description — se carga cuando la tarea involucra workflows o comandos

3. **Skills y commands**: cada SKILL.md y command declara sus propias dependencias `@` a docs/
   - Ejemplo: skill `security-checklist` carga local dependencies from its own checklists/
   - Ejemplo: command `advance-gate` carga `@.claude/skills/pr-description/checklists/dod.md` + `@.claude/skills/test-execution-report/signoffs/qa-signoff.md`

### Consecuencias

#### Positivas

- ~60k tokens liberados en cada sesion, disponibles para trabajo productivo
- Skills son autocontenidos: declaran y cargan exactamente lo que necesitan
- Escala mejor: nuevos docs no aumentan consumo fijo de rules
- Menos episodios de autocompact, sesiones mas largas y productivas
- Principio de menor privilegio aplicado al contexto: solo se carga lo necesario

#### Negativas

- Si un skill no se activa explicitamente, la IA no tendra ciertos docs en contexto — mitigacion: CLAUDE.md lista todos los skills disponibles, y `/help` orienta al usuario hacia el skill correcto
- Requiere mantener referencias `@` en mas archivos (cada skill/command declara sus deps) — mitigacion: la guia de desarrollo de skills (`docs/guides/claude-code/skill-development-guide.md`) documenta esta convencion
- Si un doc critico solo esta referenciado en un skill poco usado, podria quedar "invisible" — mitigacion: docs criticos (DoD, DTC) son referenciados por hooks que siempre se ejecutan

#### Neutras

- Esfuerzo de migracion: mover referencias `@` de rules a skills/commands (esfuerzo unico)
- Cambio de convencion documentado en guias de desarrollo de rules y skills
- La regla `@` en rules se reserva exclusivamente para referenciar OTRAS rules del mismo directorio

### Links

- Rules afectadas: `.claude/rules/org.md`, `.claude/rules/tech-stack.md`, `.claude/rules/project.md`, `.claude/rules/documentation.md`, `.claude/rules/workflows.md`
- Guia de rules: `docs/guides/claude-code/rule-development.md`
- Guia de skills: `docs/guides/claude-code/skill-development-guide.md`
- Estrategia de hooks: `docs/standards/hooks-strategy.md`
- CLAUDE.md (indice): `.claude/CLAUDE.md`
