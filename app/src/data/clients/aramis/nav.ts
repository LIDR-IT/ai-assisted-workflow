import type { ClientNavConfig } from '@/data/nav-config';

export const aramisNavConfig: ClientNavConfig = {
  sections: [
    {
      title: 'Estado Actual',
      kind: 'current',
      routes: ['home', 'sprint', 'desarrollo'],
    },
    {
      title: 'Procesos Rotos',
      kind: 'gap',
      routes: ['prd', 'requisitos', 'requisitos-funcionales', 'testing'],
    },
    {
      title: 'Riesgos Técnicos',
      kind: 'risk',
      routes: ['despliegue', 'seguridad'],
    },
    {
      title: 'Propuesta LIDR',
      kind: 'solution',
      routes: ['propuesta', 'handoffs', 'agents'],
    },
    {
      title: 'Soporte',
      kind: 'support',
      routes: ['help', 'integrity', 'sitemap'],
    },
  ],
  routes: {
    home: { status: 'ok' },
    sprint: { status: 'ok' },
    desarrollo: { status: 'ok' },
    prd: {
      label: 'PRD',
      status: 'warning',
      note: 'Documentación de producto ausente: no existe un PRD formal por feature.',
    },
    requisitos: {
      label: 'Requisitos',
      status: 'warning',
      note: 'Sin fuente de verdad central: los requisitos viven en chats, emails y documentos dispersos.',
    },
    'requisitos-funcionales': {
      label: 'RFs',
      status: 'warning',
      note: 'RFs y brand rules dispersas; sin Definition of Done estandarizada.',
    },
    testing: {
      label: 'QA',
      status: 'warning',
      note: 'Frontend sin cobertura sistemática; QA reactivo, no preventivo.',
    },
    despliegue: {
      label: 'Bridge Sync',
      status: 'warning',
      note: 'Bridge Sync presenta riesgo silencioso: fallos pueden pasar inadvertidos.',
    },
    seguridad: {
      label: 'Seguridad IA',
      status: 'warning',
      note: 'Prácticas de seguridad sobre flujos con IA aún no formalizadas.',
    },
    gobernanza: { status: 'hidden' },
    portafolio: { status: 'hidden' },
    propuesta: {
      label: 'Propuesta',
      shortLabel: 'Propuesta',
      status: 'ok',
      note: 'Propuesta LIDR para cerrar los gaps detectados en el diagnóstico.',
    },
    handoffs: {
      label: 'Templates',
      status: 'ok',
      note: 'Plantillas estandarizadas del SDLC LIDR para acelerar entregables.',
    },
    agents: {
      label: 'Agentes IA',
      status: 'ok',
      note: 'Agentes autónomos propuestos para automatizar partes del SDLC en Aramis.',
    },
    sitemap: { label: 'Sitemap', status: 'ok' },
    help: { label: 'Ayuda', status: 'ok' },
    integrity: { label: 'Calidad', status: 'ok' },
  },
};
