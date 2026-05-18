/**
 * ContentDemo — Demo component for JSON-driven content system
 *
 * This component demonstrates the JSON-driven content system by rendering
 * example content pages. It serves as both a test component and a showcase
 * of the system's capabilities.
 *
 * Features:
 * - Multiple demo content examples
 * - Tab-based navigation between examples
 * - Error handling and loading states
 * - Template variable resolution demonstration
 * - All content block types showcase
 *
 * Part of the JSON-driven content system infrastructure.
 */

import { useState, type JSX } from 'react';
import { ContentRenderer } from './ContentRenderer';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface DemoTab {
  readonly id: string;
  readonly label: string;
  readonly contentId: string;
  readonly description: string;
}

// ---------------------------------------------------------------------------
// Demo Configuration
// ---------------------------------------------------------------------------

const DEMO_TABS: readonly DemoTab[] = [
  {
    id: 'simple',
    label: 'Demo Simple',
    contentId: 'demo-simple',
    description: 'Ejemplo básico con variables de cliente',
  },
  {
    id: 'proceso-prd',
    label: 'Proceso PRD',
    contentId: 'proceso-prd',
    description: 'Migración de página existente a JSON',
  },
  {
    id: 'completo',
    label: 'Ejemplo Completo',
    contentId: 'ejemplo-completo',
    description: 'Todos los tipos de bloques disponibles',
  },
  {
    id: 'colors-avanzados',
    label: 'Colores Avanzados',
    contentId: 'demo-colors-avanzados',
    description: 'Hex, CSS Properties, validación automática',
  },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * Demo component showcasing the JSON-driven content system.
 *
 * This component provides an interactive way to explore different content
 * configurations and see how the system handles various block types and
 * template variables.
 */
export function ContentDemo(): JSX.Element {
  const [activeTab, setActiveTab] = useState<string>('simple');

  const activeDemoTab = DEMO_TABS.find((tab) => tab.id === activeTab) || DEMO_TABS[0]!;

  return (
    <div className="w-full">
      {/* Header */}
      <DemoHeader />

      {/* Tab Navigation */}
      <TabNavigation tabs={DEMO_TABS} activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Content Area */}
      <ContentArea contentId={activeDemoTab.contentId} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

/**
 * Demo header component
 */
function DemoHeader(): JSX.Element {
  return (
    <div className="mb-8">
      <h1 className="text-2xl font-bold text-slate-800 mb-2">Sistema de Contenido JSON - Demo</h1>
      <p className="text-slate-600">
        Exploración interactiva del sistema de contenido completamente configurable desde JSON.
        Selecciona una pestaña para ver diferentes ejemplos.
      </p>
    </div>
  );
}

/**
 * Tab navigation component
 */
interface TabNavigationProps {
  readonly tabs: readonly DemoTab[];
  readonly activeTab: string;
  readonly onTabChange: (tabId: string) => void;
}

function TabNavigation({ tabs, activeTab, onTabChange }: TabNavigationProps): JSX.Element {
  return (
    <div className="mb-6">
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <TabButton
              key={tab.id}
              tab={tab}
              isActive={activeTab === tab.id}
              onClick={() => onTabChange(tab.id)}
            />
          ))}
        </nav>
      </div>
    </div>
  );
}

/**
 * Individual tab button component
 */
interface TabButtonProps {
  readonly tab: DemoTab;
  readonly isActive: boolean;
  readonly onClick: () => void;
}

function TabButton({ tab, isActive, onClick }: TabButtonProps): JSX.Element {
  const baseClasses = 'py-2 px-1 border-b-2 font-medium text-sm transition-colors';
  const activeClasses = isActive
    ? 'border-blue-500 text-blue-600'
    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300';

  return (
    <button onClick={onClick} className={`${baseClasses} ${activeClasses}`} type="button">
      <div>
        <div className="font-medium">{tab.label}</div>
        <div className="text-xs text-gray-500 mt-0.5">{tab.description}</div>
      </div>
    </button>
  );
}

/**
 * Content area component that renders the selected content
 */
interface ContentAreaProps {
  readonly contentId: string;
}

function ContentArea({ contentId }: ContentAreaProps): JSX.Element {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <ContentRenderer
        contentId={contentId}
        showMetadata={true}
        resolveVariables={true}
        className="space-y-6"
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------

export default ContentDemo;
