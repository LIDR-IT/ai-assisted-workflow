/**
 * Client Display Component - Demonstrates centralized client variables
 *
 * Shows how to use centralized client configuration instead of hardcoded values.
 * This component can be used in headers, titles, and anywhere client info is displayed.
 */

import { methodology } from '@/data';
import { useCurrentClient } from '@/hooks';

interface ClientDisplayProps {
  variant?: 'title' | 'header' | 'methodology' | 'domain' | 'full';
  className?: string;
}

export function ClientDisplay({ variant = 'title', className = '' }: ClientDisplayProps) {
  const { client } = useCurrentClient();
  const renderContent = () => {
    switch (variant) {
      case 'title':
        return (
          <span className={`font-bold text-2xl ${className}`}>Ecosistema SDLC {client.name}</span>
        );

      case 'header':
        return (
          <div className={`space-y-1 ${className}`}>
            <h1 className="text-3xl font-bold">{client.projectName}</h1>
            <p className="text-lg text-gray-600">
              {methodology.name} aplicada a {client.industry}
            </p>
          </div>
        );

      case 'methodology':
        return (
          <div className={`bg-blue-50 rounded-lg p-4 ${className}`}>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              <span className="font-semibold text-blue-900">{methodology.fullName}</span>
            </div>
            <p className="text-sm text-blue-700 mt-2">
              {methodology.principles.slice(0, 3).join(' • ')}
            </p>
          </div>
        );

      case 'domain':
        return (
          <div className={`space-y-2 ${className}`}>
            <h3 className="font-medium text-gray-900">Dominio: {client.domain}</h3>
            <div className="flex flex-wrap gap-2">
              {client.mainProducts.map((product) => (
                <span
                  key={product}
                  className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-md"
                >
                  {product}
                </span>
              ))}
            </div>
          </div>
        );

      case 'full':
        return (
          <div className={`space-y-4 ${className}`}>
            <div>
              <h2 className="text-2xl font-bold">{client.projectName}</h2>
              <p className="text-gray-600">
                {methodology.name} • {client.industry}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Proyecto</h3>
                <div className="space-y-1 text-sm text-gray-600">
                  <p>
                    <strong>Código:</strong> {client.projectCode}
                  </p>
                  <p>
                    <strong>Cliente:</strong> {client.fullName}
                  </p>
                  <p>
                    <strong>Industria:</strong> {client.segment}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 mb-2">Metodología</h3>
                <div className="space-y-1 text-sm text-gray-600">
                  <p>
                    <strong>Framework:</strong> {methodology.name}
                  </p>
                  <p>
                    <strong>Versión:</strong> {methodology.version}
                  </p>
                  <p>
                    <strong>Desarrollada:</strong> {methodology.developed}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-2">Componentes del Ecosistema</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                <div className="bg-violet-100 text-violet-800 p-2 rounded">
                  <div className="font-medium">Skills</div>
                  <div>{methodology.components.skills.split(' ')[0]}</div>
                </div>
                <div className="bg-indigo-100 text-indigo-800 p-2 rounded">
                  <div className="font-medium">Commands</div>
                  <div>{methodology.components.commands.split(' ')[0]}</div>
                </div>
                <div className="bg-emerald-100 text-emerald-800 p-2 rounded">
                  <div className="font-medium">Rules</div>
                  <div>{methodology.components.rules.split(' ')[0]}</div>
                </div>
                <div className="bg-amber-100 text-amber-800 p-2 rounded">
                  <div className="font-medium">Gates</div>
                  <div>{methodology.components.gates.split(' ')[0]}</div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return <span className={className}>{client.name}</span>;
    }
  };

  return renderContent();
}

// Utility hooks for accessing client data
export function useClientData() {
  const { client } = useCurrentClient();
  return client;
}

export function useMethodology() {
  return methodology;
}

// Hook for replacing template variables (must be called inside a component/hook)
export function useReplaceClientVariables() {
  const { client } = useCurrentClient();
  return (text: string): string =>
    text
      .replace(/\{\{CLIENT_NAME\}\}/g, client.name)
      .replace(/\{\{CLIENT_FULL_NAME\}\}/g, client.fullName)
      .replace(/\{\{CLIENT_CODE\}\}/g, client.projectCode.toLowerCase())
      .replace(/\{\{PROJECT_NAME\}\}/g, client.projectName)
      .replace(/\{\{DOMAIN\}\}/g, client.domain)
      .replace(/\{\{INDUSTRY\}\}/g, client.industry)
      .replace(/\{\{METHODOLOGY\}\}/g, methodology.name);
}
