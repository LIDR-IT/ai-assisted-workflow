import { lazy, type ComponentType, type LazyExoticComponent } from 'react';
import {
  Workflow,
  FileText,
  ClipboardList,
  ListChecks,
  CalendarDays,
  Code2,
  TestTube2,
  Server,
  Shield,
  Briefcase,
  GitMerge,
  Lightbulb,
  ArrowRightLeft,
  Map,
  HelpCircle,
  ShieldCheck,
  Bot,
  FileJson2,
  type LucideIcon,
} from 'lucide-react';

import { WorkflowDiagram } from './components/WorkflowDiagram';

// SDLC phase diagrams (lazy)
const FaseRequisitos = lazy(() =>
  import('./components/diagrams/FaseRequisitos').then((m) => ({ default: m.FaseRequisitos }))
);
const ProcesoPRD = lazy(() =>
  import('./components/diagrams/ProcesoPRD').then((m) => ({ default: m.ProcesoPRD }))
);
const RequisitosFuncionales = lazy(() =>
  import('./components/diagrams/RequisitosFuncionales').then((m) => ({
    default: m.RequisitosFuncionales,
  }))
);
const PlanificacionSprint = lazy(() =>
  import('./components/diagrams/PlanificacionSprint').then((m) => ({
    default: m.PlanificacionSprint,
  }))
);
const ProcesoDesarrollo = lazy(() =>
  import('./components/diagrams/ProcesoDesarrollo').then((m) => ({ default: m.ProcesoDesarrollo }))
);
const TestingQA = lazy(() =>
  import('./components/diagrams/TestingQA').then((m) => ({ default: m.TestingQA }))
);
const SeguridadSDLC = lazy(() =>
  import('./components/diagrams/SeguridadSDLC').then((m) => ({ default: m.SeguridadSDLC }))
);
const EntornosDespliegue = lazy(() =>
  import('./components/diagrams/EntornosDespliegue').then((m) => ({
    default: m.EntornosDespliegue,
  }))
);

// Governance
const GestionPortafolio = lazy(() =>
  import('./components/diagrams/GestionPortafolio').then((m) => ({ default: m.GestionPortafolio }))
);
const GobernanzaWorkflow = lazy(() =>
  import('./components/diagrams/GobernanzaWorkflow').then((m) => ({
    default: m.GobernanzaWorkflow,
  }))
);

// Proposal / heavy features
const PropuestaMejora = lazy(() =>
  import('./components/features/propuesta-mejora').then((m) => ({ default: m.PropuestaMejora }))
);
const HandoffsTemplates = lazy(() =>
  import('./components/features/handoffs-templates').then((m) => ({ default: m.HandoffsTemplates }))
);
const IntegrityTests = lazy(() =>
  import('./components/features/integrity-tests').then((m) => ({ default: m.IntegrityTests }))
);

// Support / docs
const SitemapView = lazy(() =>
  import('./components/diagrams/SitemapView').then((m) => ({ default: m.SitemapView }))
);
const MarkdownViewer = lazy(() =>
  import('./components/diagrams/MarkdownViewer').then((m) => ({ default: m.MarkdownViewer }))
);
const HelpCenter = lazy(() =>
  import('./components/diagrams/HelpCenter').then((m) => ({ default: m.HelpCenter }))
);
const AgentsArchitecture = lazy(() =>
  import('./components/diagrams/AgentsArchitecture').then((m) => ({
    default: m.AgentsArchitecture,
  }))
);
const ContentDemo = lazy(() =>
  import('./components/content/ContentDemo').then((m) => ({ default: m.ContentDemo }))
);

export type RouteGroup = 'overview' | 'sdlc-phases' | 'governance' | 'proposal' | 'support';

type AnyComponent = LazyExoticComponent<ComponentType<any>> | ComponentType<any>;

export interface RouteEntry {
  id: string;
  /** Path relative to `/:clientId`. Empty string for the index route. */
  path: string;
  Component: AnyComponent;
  icon: LucideIcon;
  defaultLabel: string;
  defaultShortLabel: string;
  group: RouteGroup;
  /** SDLC phase 0-8, or null for cross-cutting routes. */
  phase: number | null;
  /** SDLC gate 0-7, or null. */
  gate: number | null;
  isProposal?: boolean;
}

export const ROUTE_REGISTRY: readonly RouteEntry[] = [
  {
    id: 'home',
    path: '',
    Component: WorkflowDiagram,
    icon: Workflow,
    defaultLabel: 'Flujo General SDLC',
    defaultShortLabel: 'General',
    group: 'overview',
    phase: null,
    gate: null,
  },
  {
    id: 'prd',
    path: 'prd',
    Component: ProcesoPRD,
    icon: ClipboardList,
    defaultLabel: 'Proceso PRD',
    defaultShortLabel: 'PRD',
    group: 'sdlc-phases',
    phase: 2,
    gate: 1,
  },
  {
    id: 'requisitos',
    path: 'requisitos',
    Component: FaseRequisitos,
    icon: FileText,
    defaultLabel: 'Fase Requisitos',
    defaultShortLabel: 'Requisitos',
    group: 'sdlc-phases',
    phase: 3,
    gate: 2,
  },
  {
    id: 'requisitos-funcionales',
    path: 'requisitos-funcionales',
    Component: RequisitosFuncionales,
    icon: ListChecks,
    defaultLabel: 'Requisitos Funcionales',
    defaultShortLabel: 'RF',
    group: 'sdlc-phases',
    phase: 3,
    gate: 2,
  },
  {
    id: 'sprint',
    path: 'sprint',
    Component: PlanificacionSprint,
    icon: CalendarDays,
    defaultLabel: 'Planificación Sprint',
    defaultShortLabel: 'Sprint',
    group: 'sdlc-phases',
    phase: 4,
    gate: 3,
  },
  {
    id: 'desarrollo',
    path: 'desarrollo',
    Component: ProcesoDesarrollo,
    icon: Code2,
    defaultLabel: 'Proceso Desarrollo',
    defaultShortLabel: 'Desarrollo',
    group: 'sdlc-phases',
    phase: 5,
    gate: 4,
  },
  {
    id: 'testing',
    path: 'testing',
    Component: TestingQA,
    icon: TestTube2,
    defaultLabel: 'Testing & QA',
    defaultShortLabel: 'QA',
    group: 'sdlc-phases',
    phase: 6,
    gate: 5,
  },
  {
    id: 'seguridad',
    path: 'seguridad',
    Component: SeguridadSDLC,
    icon: Shield,
    defaultLabel: 'Seguridad SDLC',
    defaultShortLabel: 'Seguridad',
    group: 'sdlc-phases',
    phase: 7,
    gate: 6,
  },
  {
    id: 'despliegue',
    path: 'despliegue',
    Component: EntornosDespliegue,
    icon: Server,
    defaultLabel: 'Entornos & Despliegue',
    defaultShortLabel: 'Despliegue',
    group: 'sdlc-phases',
    phase: 8,
    gate: 7,
  },
  {
    id: 'portafolio',
    path: 'portafolio',
    Component: GestionPortafolio,
    icon: Briefcase,
    defaultLabel: 'Gestión Portafolio',
    defaultShortLabel: 'PME',
    group: 'governance',
    phase: null,
    gate: null,
  },
  {
    id: 'gobernanza',
    path: 'gobernanza',
    Component: GobernanzaWorkflow,
    icon: GitMerge,
    defaultLabel: 'Gobernanza Workflow',
    defaultShortLabel: 'Gobernanza',
    group: 'governance',
    phase: null,
    gate: null,
  },
  {
    id: 'propuesta',
    path: 'propuesta',
    Component: PropuestaMejora,
    icon: Lightbulb,
    defaultLabel: 'Propuesta de Mejora',
    defaultShortLabel: 'Propuesta',
    group: 'proposal',
    phase: null,
    gate: null,
    isProposal: true,
  },
  {
    id: 'handoffs',
    path: 'handoffs',
    Component: HandoffsTemplates,
    icon: ArrowRightLeft,
    defaultLabel: 'Handoffs & Templates',
    defaultShortLabel: 'Handoffs',
    group: 'proposal',
    phase: null,
    gate: null,
    isProposal: true,
  },
  {
    id: 'agents',
    path: 'agents',
    Component: AgentsArchitecture,
    icon: Bot,
    defaultLabel: 'Agentes IA',
    defaultShortLabel: 'Agentes',
    group: 'proposal',
    phase: null,
    gate: null,
    isProposal: true,
  },
  {
    id: 'sitemap',
    path: 'sitemap',
    Component: SitemapView,
    icon: Map,
    defaultLabel: 'Sitemap',
    defaultShortLabel: 'Mapa',
    group: 'support',
    phase: null,
    gate: null,
    isProposal: true,
  },
  {
    id: 'help',
    path: 'help',
    Component: HelpCenter,
    icon: HelpCircle,
    defaultLabel: 'Centro de Ayuda',
    defaultShortLabel: 'Ayuda',
    group: 'support',
    phase: null,
    gate: null,
  },
  {
    id: 'integrity',
    path: 'integrity',
    Component: IntegrityTests,
    icon: ShieldCheck,
    defaultLabel: 'Validación de Calidad',
    defaultShortLabel: 'Calidad',
    group: 'support',
    phase: null,
    gate: null,
  },
  {
    id: 'content-demo',
    path: 'content-demo',
    Component: ContentDemo,
    icon: FileJson2,
    defaultLabel: 'Content Demo',
    defaultShortLabel: 'Demo',
    group: 'support',
    phase: null,
    gate: null,
  },
  {
    id: 'doc',
    path: 'doc/*',
    Component: MarkdownViewer,
    icon: FileText,
    defaultLabel: 'Documento',
    defaultShortLabel: 'Doc',
    group: 'support',
    phase: null,
    gate: null,
  },
] as const;

export const ROUTES_BY_ID: Record<string, RouteEntry> = Object.freeze(
  Object.fromEntries(ROUTE_REGISTRY.map((e) => [e.id, e]))
);

export const KNOWN_ROUTE_IDS: ReadonlySet<string> = new Set(ROUTE_REGISTRY.map((e) => e.id));

export function getRouteById(id: string): RouteEntry | undefined {
  return ROUTES_BY_ID[id];
}
