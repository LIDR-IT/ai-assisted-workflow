import { Loader2, AlertOctagon } from 'lucide-react';
import { useCurrentClient } from '@/hooks';
import { usePropuestaContent } from '@/hooks/usePropuestaContent';
import { MejorasRenderer } from './renderers/MejorasRenderer';

export function MejorasTab() {
  const { client } = useCurrentClient();
  const { data, isLoading, isError, error } = usePropuestaContent('mejoras');

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12 text-slate-500">
        <Loader2 className="animate-spin mr-2" size={18} />
        Cargando mejoras {client.name}…
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-start gap-2 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
        <AlertOctagon size={18} className="mt-0.5 flex-shrink-0" />
        <div>
          <p className="font-medium">Error al cargar mejoras</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-start gap-2 p-4 bg-amber-50 border border-amber-200 rounded-lg text-amber-800">
        <AlertOctagon size={18} className="mt-0.5 flex-shrink-0" />
        <div>
          <p className="font-medium">Mejoras no disponibles</p>
          <p className="text-sm">
            No se encontró <code>propuesta/mejoras.json</code> ni para {client.name} ni en base.
          </p>
        </div>
      </div>
    );
  }

  return <MejorasRenderer content={data} />;
}
