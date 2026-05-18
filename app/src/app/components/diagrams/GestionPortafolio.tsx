import { Users, BarChart3, AlertTriangle } from 'lucide-react';
import {
  DiagramCard,
  PageHeader,
  SectionBox,
  InfoTable,
} from '@/app/components/shared/FlowComponents';
import { DiagramRenderer } from '@/app/components/shared/DiagramRenderer';

export function GestionPortafolio() {
  return (
    <div>
      <PageHeader
        title="Gestión de Portafolio (PME)"
        subtitle="Equipo de Portfolio Management que supervisa ~500 proyectos activos y define estándares organizacionales"
      />
      <div className="mt-6 space-y-6">
        {/* Team */}
        <SectionBox title="Equipo PME" icon={<Users className="w-5 h-5" />}>
          <InfoTable
            rows={[
              { label: 'PME #1', value: 'Portfolio Management' },
              { label: 'PME #2', value: 'Portfolio Management' },
              { label: 'PME #3', value: 'Portfolio Management & PM' },
              { label: 'PME #4', value: 'Portfolio Management & PM' },
            ]}
          />
        </SectionBox>

        {/* JSON-driven diagram renderer */}
        <DiagramCard>
          <DiagramRenderer
            diagramId="gestion-portafolio"
            showLegend={true}
            showMetadata={false}
            height={580}
            exportName="Doble Rol Equipo PME"
            onLoad={(data) =>
              console.warn('GestionPortafolio diagram loaded:', data.metadata.title)
            }
            onError={(error) => console.error('GestionPortafolio diagram error:', error)}
          />
        </DiagramCard>

        {/* Key metrics */}
        <SectionBox title="Indicadores Clave" icon={<BarChart3 className="w-5 h-5" />}>
          <InfoTable
            rows={[
              { label: 'Proyectos activos', value: '~500 bajo gestión simultánea' },
              { label: 'Cumplimiento de plazos', value: '% de proyectos entregados a tiempo' },
              { label: 'Adherencia a procesos', value: 'Auditoría trimestral de cumplimiento' },
              { label: 'Satisfacción del cliente', value: 'NPS interno por proyecto' },
              {
                label: 'Éxito del piloto 360',
                value: 'Métricas definidas para evaluar el estándar futuro',
              },
            ]}
          />
        </SectionBox>

        {/* Risks */}
        <SectionBox title="Riesgos Identificados" icon={<AlertTriangle className="w-5 h-5" />}>
          <InfoTable
            rows={[
              {
                label: 'Inconsistencia en procesos',
                value: 'Templates estandarizados y revisiones cruzadas',
              },
            ]}
          />
        </SectionBox>
      </div>
    </div>
  );
}
