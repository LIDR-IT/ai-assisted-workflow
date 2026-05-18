import type { ClientNavConfig } from '@/data/nav-config';

export const facephiNavConfig: ClientNavConfig = {
  sections: [
    {
      title: 'Procesos Establecidos',
      kind: 'current',
      routes: [
        'home',
        'requisitos',
        'prd',
        'requisitos-funcionales',
        'sprint',
        'desarrollo',
        'testing',
        'seguridad',
        'despliegue',
        'portafolio',
        'gobernanza',
      ],
    },
    {
      title: 'Propuesta LIDR',
      kind: 'solution',
      routes: ['propuesta', 'handoffs', 'sitemap', 'agents'],
    },
    {
      title: 'Soporte',
      kind: 'support',
      routes: ['help', 'integrity', 'content-demo'],
    },
  ],
  routes: {
    home: { status: 'ok' },
    requisitos: { status: 'ok' },
    prd: { status: 'ok' },
    'requisitos-funcionales': { label: 'RFs', status: 'ok' },
    sprint: { status: 'ok' },
    desarrollo: { status: 'ok' },
    testing: { label: 'QA', status: 'ok' },
    seguridad: { label: 'DevSecOps', status: 'ok' },
    despliegue: { label: 'Entornos', status: 'ok' },
    portafolio: { label: 'Portfolio', status: 'ok' },
    gobernanza: { label: 'Gobernanza', status: 'ok' },
    propuesta: {
      label: 'Evolución',
      status: 'ok',
      note: 'Próximos pasos de automatización y evolución del SDLC LIDR.',
    },
    handoffs: {
      label: 'Templates',
      status: 'ok',
      note: 'Plantillas estandarizadas del SDLC LIDR.',
    },
    sitemap: {
      label: 'Sitemap',
      status: 'ok',
      note: 'Arquitectura completa del ecosistema LIDR SDLC.',
    },
    agents: {
      label: 'Agentes IA',
      status: 'ok',
      note: 'Agentes autónomos para automatizar partes del SDLC.',
    },
    help: { label: 'Ayuda', status: 'ok' },
    integrity: { label: 'Calidad', status: 'ok' },
    'content-demo': { label: 'JSON Demo', status: 'ok' },
  },
};
