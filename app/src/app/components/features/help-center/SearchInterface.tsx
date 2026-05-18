import { Search } from 'lucide-react';

interface SearchInterfaceProps {
  query: string;
  onQueryChange: (query: string) => void;
  placeholder?: string;
}

export function SearchInterface({
  query,
  onQueryChange,
  placeholder = 'Buscar skills, commands, rules, templates...',
}: SearchInterfaceProps) {
  return (
    <div className="relative max-w-2xl mx-auto mb-8">
      <div className="flex items-center gap-3 bg-white border border-slate-300 rounded-lg p-3 shadow-sm">
        <Search className="h-5 w-5 text-slate-400 flex-shrink-0" />
        <input
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 bg-transparent outline-none text-slate-900 placeholder-slate-500"
        />
      </div>
    </div>
  );
}
