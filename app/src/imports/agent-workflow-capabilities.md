Pueden los Subagentes ejecutar Workflows?
Ejecutar skills encadenados
Un subagente puede invocar multiples skills en secuencia como parte de su chain. Ejemplo: qa-agent invoca test-plan -> create-test-cases -> regression-suite.
Usar MCPs para leer/escribir
Los subagentes tienen acceso a MCPs configurados. Pueden leer de Jira, escribir en Xray, publicar en Confluence, etc.
Ejecutar commands como /advance-gate
Los commands son workflows invocados por humanos. Un subagente NO ejecuta /advance-gate directamente — puede preparar los inputs, pero el humano debe invocar el gate.
Spawear otros subagentes
Los subagentes NO pueden crear otros subagentes. Solo el agente orquestador (conversacion principal) puede spawnear subagentes. Si un workflow requiere delegacion anidada, el orquestador encadena subagentes en secuencia o se usan Skills.
Firmar signoffs
Los signoffs (so-qa, so-security) requieren firma humana. El subagente puede pre-llenar el documento pero nunca firmarlo.
Evaluar quality gates
Los gates requieren /advance-gate invocado por el rol correspondiente (PO, TL, QA Lead, Sec Lead, PME). El subagente puede recopilar evidencias.
Escribir en su memoria persistente
Cada subagente tiene acceso de escritura a .claude/agent-memory/{name}/ con scope project. Acumula conocimiento entre sesiones.
Ejecutar bash scripts
Subagentes con tool Bash pueden ejecutar scripts de analisis (ej: integrity tests, dependency analysis, metrics extraction).
Chain Patterns — Encadenamiento de Subagentes
Los subagentes no pueden spawear otros subagentes, pero el agente orquestador puede encadenarlos en secuencia. Cada subagente completa su tarea y retorna un resumen al orquestador, que lo pasa al siguiente subagente. El detonante siempre es un humano invocando Claude Code CLI en el momento adecuado del flujo.
Chain 1: Pipeline QA completo
qa-agent
retorna suite
QA Lead revisa + ejecuta
/advance-gate 5 (humano)
Invocado por: QA Lead via Claude Code CLI cuando el ticket pasa a "Ready for QA" en Jira. El subagente prepara, el humano valida y avanza el gate.
Chain 2: Security -> Release
security-agent
retorna reporte
Sec Lead firma so-security
release-agent
Comite aprueba CR
Invocado por: Sec Lead via CLI para security-agent; PME via CLI para release-agent tras la firma humana. Chain secuencial con intervencion humana entre pasos.
Chain 3: Cierre de Sprint
metrics-agent
retorna metricas
docs-agent
sincroniza docs
Equipo: Retrospectiva
Invocado por: Tech Lead via CLI al cierre de sprint. metrics-agent y docs-agent pueden ejecutarse en paralelo desde el orquestador.
Skills vs Subagentes — Cuando usar cada uno
Usar Skills cuando...

- La tarea necesita back-and-forth iterativo con el humano
- Multiples fases comparten contexto significativo
- Es un cambio rapido y targetizado
- La latencia importa (los subagentes arrancan desde cero)
- Quieres prompts reutilizables en el contexto de la conversacion
  Usar Subagentes cuando...
- La tarea produce output verbose que no necesitas en tu contexto
- Quieres restringir tools/permisos especificos
- El trabajo es autocontenido y puede retornar un resumen
- Necesitas memoria persistente entre sesiones
- El humano decide invocarlos en un momento concreto del flujo via CLI
