/**
 * ConfigurableSection — Componente para renderizar secciones configurables
 *
 * Reemplaza las 4 cajas hardcodeadas del componente PlanificacionSprint
 * permitiendo configuración completa vía JSON por cliente.
 */

import {
  ConfiguracionSection,
  SeparacionRolesSection,
  NivelesGestionSection,
  ProcesoAdicionalSection,
} from '@/data/schemas/diagram-schema';

// ---------------------------------------------------------------------------
// Tipos y Props
// ---------------------------------------------------------------------------

interface ConfigurableSectionProps {
  section:
    | ConfiguracionSection
    | SeparacionRolesSection
    | NivelesGestionSection
    | ProcesoAdicionalSection;
  variant: 'configuracion' | 'separacion_roles' | 'niveles_gestion' | 'proceso_adicional';
}

// ---------------------------------------------------------------------------
// Componentes por Tipo de Sección
// ---------------------------------------------------------------------------

function ConfiguracionSectionComponent({ section }: { section: ConfiguracionSection }) {
  return (
    <div className="bg-gray-50 rounded-lg p-6 border">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Configuración del Sprint</h3>
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-gray-600">Duración:</span>
          <span className="font-medium">{section.duracion}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Metodología:</span>
          <span className="font-medium">{section.metodologia}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Estimación:</span>
          <span className="font-medium">{section.estimacion}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Herramienta principal:</span>
          <span className="font-medium">{section.herramienta}</span>
        </div>
        {section.herramientas_adicionales && section.herramientas_adicionales.length > 0 && (
          <div>
            <span className="text-gray-600">Herramientas adicionales:</span>
            <ul className="list-disc list-inside mt-1 text-sm text-gray-700">
              {section.herramientas_adicionales.map((tool, index) => (
                <li key={index}>{tool}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

function SeparacionRolesSectionComponent({ section }: { section: SeparacionRolesSection }) {
  return (
    <div className="bg-white rounded-lg p-6 border">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{section.title}</h3>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-green-50 p-4 rounded-lg">
          <h4 className="font-semibold text-green-800 mb-3">QUÉ (Product Owner define)</h4>
          <ul className="space-y-2">
            {section.po_define.map((item, index) => (
              <li key={index} className="text-green-700 text-sm flex items-start">
                <span className="mr-2">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-orange-50 p-4 rounded-lg">
          <h4 className="font-semibold text-orange-800 mb-3">CÓMO (Developers definen)</h4>
          <ul className="space-y-2">
            {section.dev_define.map((item, index) => (
              <li key={index} className="text-orange-700 text-sm flex items-start">
                <span className="mr-2">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      {section.nota_aramis && (
        <div className="mt-4 bg-blue-50 p-3 rounded border-l-4 border-blue-400">
          <p className="text-blue-800 text-sm">
            <strong>Nota ARAMIS:</strong> {section.nota_aramis}
          </p>
        </div>
      )}
    </div>
  );
}

function NivelesGestionSectionComponent({ section }: { section: NivelesGestionSection }) {
  return (
    <div className="bg-white rounded-lg p-6 border">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Niveles de Gestión</h3>
      <div className="space-y-6">
        <div>
          <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
            <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
            Product Owner gestiona
          </h4>
          <div className="bg-green-50 p-4 rounded-lg">
            {section.po_gestiona.map((item, index) => (
              <div key={index} className="text-green-700 text-sm mb-1 last:mb-0">
                {item}
              </div>
            ))}
          </div>
        </div>
        <div>
          <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
            <span className="w-3 h-3 bg-orange-500 rounded-full mr-2"></span>
            Developers gestionan
          </h4>
          <div className="bg-orange-50 p-4 rounded-lg">
            {section.dev_gestiona.map((item, index) => (
              <div key={index} className="text-orange-700 text-sm mb-1 last:mb-0">
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProcesoAdicionalSectionComponent({ section }: { section: ProcesoAdicionalSection }) {
  const getBackgroundColor = () => {
    switch (section.tipo) {
      case 'carryover':
        return 'bg-yellow-50 border-yellow-200';
      case 'innovaciones_aramis':
        return 'bg-blue-50 border-blue-200';
      case 'problemas_aramis':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const getTitleColor = () => {
    switch (section.tipo) {
      case 'carryover':
        return 'text-yellow-800';
      case 'innovaciones_aramis':
        return 'text-blue-800';
      case 'problemas_aramis':
        return 'text-red-800';
      default:
        return 'text-gray-800';
    }
  };

  return (
    <div className={`rounded-lg p-6 border ${getBackgroundColor()}`}>
      <h3 className={`text-lg font-semibold mb-4 ${getTitleColor()}`}>{section.title}</h3>

      {section.impacto && section.impacto.length > 0 && (
        <div className="mb-6">
          <h4 className={`font-semibold mb-3 ${getTitleColor()}`}>Impacto</h4>
          <ul className="space-y-1">
            {section.impacto.map((item, index) => (
              <li key={index} className="text-sm flex items-start">
                <span className="mr-2">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {section.mitigacion && section.mitigacion.length > 0 && (
        <div className="mb-6">
          <h4 className={`font-semibold mb-3 ${getTitleColor()}`}>Mitigación</h4>
          <ul className="space-y-1">
            {section.mitigacion.map((item, index) => (
              <li key={index} className="text-sm flex items-start">
                <span className="mr-2">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {section.items && section.items.length > 0 && (
        <div>
          <div className="space-y-4">
            {section.items.map((item, index) => (
              <div key={index} className="bg-white rounded p-4 border">
                <div className="flex items-start justify-between">
                  <h5 className="font-semibold text-gray-900">{item.title}</h5>
                  <div className="flex gap-2">
                    {item.impact && (
                      <span
                        className={`px-2 py-1 text-xs rounded ${
                          item.impact === 'critical'
                            ? 'bg-red-100 text-red-800'
                            : item.impact === 'high'
                              ? 'bg-orange-100 text-orange-800'
                              : item.impact === 'medium'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {item.impact}
                      </span>
                    )}
                    {item.timestamp && (
                      <span className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded">
                        {item.timestamp}
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-gray-700 text-sm mt-2">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Componente Principal
// ---------------------------------------------------------------------------

export function ConfigurableSection({ section, variant }: ConfigurableSectionProps) {
  switch (variant) {
    case 'configuracion':
      return <ConfiguracionSectionComponent section={section as ConfiguracionSection} />;
    case 'separacion_roles':
      return <SeparacionRolesSectionComponent section={section as SeparacionRolesSection} />;
    case 'niveles_gestion':
      return <NivelesGestionSectionComponent section={section as NivelesGestionSection} />;
    case 'proceso_adicional':
      return <ProcesoAdicionalSectionComponent section={section as ProcesoAdicionalSection} />;
    default:
      return null;
  }
}

export default ConfigurableSection;
