---
id: adr-0007
version: "1.0.0"
last_updated: "2026-06-09"
updated_by: "TL: command-cleanup"
status: accepted
type: standard
owner_role: "TL"
review_cycle: 90
next_review: "2026-09-07"
---

## ADR-0007: Resolución de colisión nombre-comando = nombre-skill

### Estado

accepted

### Fecha

2026-06-09

### Contexto

El ecosistema expone dos superficies de invocación que comparten el mismo espacio de nombres de slash en Claude Code:

- **Comandos** (`.agents/commands/<name>.md`) — verbos que el usuario teclea (`/name`), orquestadores con `authorized_roles`, precondiciones de gate y encadenamiento de skills.
- **Skills** (`.agents/skills/<name>/SKILL.md`) — conocimiento/motor que la IA auto-carga por _trigger phrases_; por defecto también son **user-invocable** vía `/name`.

Durante la limpieza de comandos (junio 2026) se detectó **una** colisión: el comando `lidr-validate-requirements` (orquestador de Fase 3) y la skill `lidr-validate-requirements` (motor RTM + validación 5-pass) compartían nombre. Ambos quedaban registrados bajo el mismo `/lidr-validate-requirements`, creando ambigüedad de invocación y confusión en el registro.

El patrón es legítimo y deseable: **el comando es el verbo y delega la lógica reutilizable en la skill** (command → skill). El problema es solo el nombre compartido en la superficie de slash.

### Problema

¿Cómo eliminar la competencia por el slash entre un comando y su skill-motor homónima, sin romper las ~15 referencias al nombre (incluido el `gate-evidence.yaml` machine-read, los validators y rutas internas de scripts) que un renombrado implicaría?

### Decision Drivers

- **Cero ambigüedad de invocación** en el slash `/<name>`.
- **Preservar la delegación** command → skill (la IA debe poder auto-cargar la skill-motor).
- **Mínimo blast radius**: no tocar `gate-evidence.yaml`, validators ni rutas de scripts salvo necesidad real.
- **Regla general reutilizable** para futuras parejas comando+skill.

### Opciones Consideradas

#### Opción 1: Renombrar la skill (nombres 100% limpios)

- **Pros**: Elimina el nombre compartido de raíz; registro sin ambigüedad cosmética.
- **Cons**: Blast radius alto — `name` + `id` + dir + ~15 refs en docs + `gate-evidence.yaml` (machine-read, alimenta G2) + validators + rutas internas de scripts (`cd .claude/skills/validate-requirements`, `@../skills/validate-requirements/templates/rtm.md`) + re-sync. Riesgo real de romper el gate system para un beneficio cosmético.

#### Opción 2: `user-invocable: false` en la skill (elegida)

- **Pros**: Una línea de frontmatter. El comando se queda con el slash; la skill se alcanza por delegación del comando o auto-load del modelo (no aparece en el menú `/`). **Cero referencias rotas**, cero cambio en `gate-evidence.yaml`/scripts. Colisión funcional resuelta.
- **Cons**: El `name` compartido persiste (confusión cosmética en lecturas del registro) — se mitiga documentando explícitamente el split comando=verbo / skill=motor.

#### Opción 3: Renombrar el comando

- **Pros**: Menos refs internas que la skill.
- **Cons**: Rompe el verbo que el equipo ya conoce y que `workflows.md`/onboarding documentan; el comando es la cara pública.

### Decision

Se elige **Opción 2: `user-invocable: false` en la skill-motor**. Cuando un comando y una skill comparten nombre intencionalmente (comando = verbo orquestador, skill = motor delegado), la skill declara `user-invocable: false`: el comando posee el slash y la skill se alcanza solo por delegación o auto-load.

**Regla general del ecosistema** (a aplicar a cualquier futura pareja):

> Si existe un comando `X` y una skill `X` que el comando usa como motor, la skill `X` DEBE declarar `user-invocable: false`. El comando posee `/X`; la skill nunca compite por el menú de slash.

Caso aplicado: `lidr-validate-requirements` (skill) → `user-invocable: false`. Es la **única** colisión existente en el ecosistema al momento de este ADR (verificado por comparación de basenames `commands/` vs `skills/`).

### Consecuencias

#### Positivas

- `/lidr-validate-requirements` resuelve sin ambigüedad al comando orquestador.
- La skill-motor sigue disponible por delegación y auto-load (no se pierde funcionalidad).
- Cero churn: `gate-evidence.yaml`, validators, scripts y los ~15 refs quedan intactos.
- Regla reutilizable documentada para futuras parejas.

#### Negativas

- El `name` compartido persiste — mitigación: notas de relación en ambos artefactos + esta entrada + `skills-readme.md`.

#### Neutras

- Si en el futuro se desea nombres 100% distintos, el renombrado (Opción 1) queda disponible como evolución, ya con el blast radius documentado aquí.

### Links

- Skill-motor: `.agents/skills/lidr-validate-requirements/SKILL.md` (`user-invocable: false`)
- Comando-verbo: `.agents/commands/lidr-validate-requirements.md`
- Decisión command-vs-skill: `.agents/skills-readme.md`, `.agents/commands-readme.md`
- Gate machine-read afectado por un eventual rename: `.agents/_shared/lidr/gate-evidence.yaml`
- Frontmatter `user-invocable`: https://code.claude.com/docs/en/skills
