import type { ClientNavConfig } from '@/data/nav-config';

export const doclineNavConfig: ClientNavConfig = {
  sections: [
    {
      title: 'Estado Actual',
      kind: 'current',
      routes: ['home', 'sprint', 'desarrollo', 'despliegue'],
    },
    {
      title: 'Procesos Rotos',
      kind: 'gap',
      routes: ['prd', 'requisitos', 'requisitos-funcionales', 'testing'],
    },
    {
      title: 'Propuesta LIDR',
      kind: 'solution',
      routes: ['propuesta', 'handoffs', 'sitemap', 'agents'],
    },
    {
      title: 'Soporte',
      kind: 'support',
      routes: ['help', 'integrity'],
    },
  ],
  routes: {
    home: { status: 'ok' },
    sprint: { status: 'ok' },
    desarrollo: { status: 'ok' },
    despliegue: { label: 'Entornos', status: 'ok' },
    prd: {
      label: 'PRD',
      status: 'warning',
      note: 'PRDs no estandarizados: cada feature usa su propio formato.',
    },
    requisitos: {
      label: 'Requisitos',
      status: 'warning',
      note: 'Requisitos informales, sin fuente única de verdad.',
    },
    'requisitos-funcionales': {
      label: 'RFs',
      status: 'warning',
      note: 'RFs sin Definition of Done; criterios de aceptación inconsistentes.',
    },
    testing: {
      label: 'QA',
      status: 'warning',
      note: 'QA solo reactivo (sobre bugs reportados), sin estrategia preventiva.',
    },
    seguridad: { status: 'hidden' },
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
      note: 'Plantillas estandarizadas del SDLC LIDR.',
    },
    sitemap: { label: 'Sitemap', status: 'ok' },
    agents: {
      label: 'Agentes IA',
      status: 'ok',
      note: 'Agentes autónomos propuestos para automatizar el SDLC.',
    },
    help: { label: 'Ayuda', status: 'ok' },
    integrity: { label: 'Calidad', status: 'ok' },
  },
};
