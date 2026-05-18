import { NavLink, Outlet } from 'react-router';
import { Suspense } from 'react';
import { Workflow, Menu, X, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { SimpleClientSelector, SimpleClientIndicator } from './shared/SimpleClientSelector';
import { useNavEntries } from '@/hooks/useNavEntries';
import { useClientPath } from '@/hooks/useClientPath';
import { useAppUI } from '@/contexts';
import { RouteLoadingSpinner } from './shared/RouteLoadingSpinner';
import { ROUTES_BY_ID } from '@/app/route-registry';
import { RouteStatusBanner } from './RouteStatusBanner';

// Navigation entries are now dynamically loaded per client via useNavEntries hook

export function Layout() {
  const { ui, setSidebarOpen, setSidebarCollapsed } = useAppUI();
  const { sidebarOpen, sidebarCollapsed: collapsed } = ui;
  const { path } = useClientPath();

  // Load navigation entries specific to the current client
  const navEntries = useNavEntries();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:sticky top-0 left-0 h-screen bg-white border-r border-slate-200 
          z-40 flex flex-col overflow-hidden transition-all duration-200 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          ${collapsed ? 'lg:w-16' : 'lg:w-64 w-64'}
        `}
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-200 flex flex-col gap-3 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div
              className={`flex items-center gap-2 ${collapsed ? 'lg:justify-center lg:w-full' : ''}`}
            >
              <Workflow className="text-indigo-600 flex-shrink-0" size={22} />
              <span
                className={`font-bold text-slate-800 text-sm whitespace-nowrap transition-opacity duration-200 ${collapsed ? 'lg:hidden' : ''}`}
              >
                LIDR SDLC
              </span>
            </div>
            <button className="lg:hidden" onClick={() => setSidebarOpen(false)}>
              <X size={20} className="text-slate-500" />
            </button>
          </div>

          {/* Client Selector */}
          <SimpleClientSelector
            collapsed={collapsed}
            size="sm"
            showClientInfo={true}
            className="lg:block"
          />
        </div>

        {/* Nav */}
        <nav className="flex-1 p-2 overflow-y-auto overflow-x-hidden">
          {navEntries.map((entry, _i) => {
            if (entry.type === 'separator') {
              return (
                <div key={`separator-${entry.label}`} className="mt-4 mb-2 first:mt-1">
                  {collapsed ? (
                    <div className="hidden lg:block mx-auto w-6 h-px bg-slate-300" />
                  ) : (
                    <>
                      <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">
                        {entry.label}
                      </div>
                      <div className="mx-3 h-px bg-slate-200" />
                    </>
                  )}
                </div>
              );
            }

            const isProposal = ROUTES_BY_ID[entry.id]?.isProposal === true;
            const navTo = path(entry.id);

            return (
              <NavLink
                key={entry.id}
                to={navTo}
                end={entry.id === 'home'}
                onClick={() => setSidebarOpen(false)}
                title={entry.label}
                className={({ isActive }) =>
                  `flex items-center gap-2 rounded-lg text-sm transition-colors mb-0.5 relative ${
                    collapsed ? 'lg:justify-center lg:px-0 lg:py-2.5 px-3 py-2.5' : 'px-3 py-2.5'
                  } ${
                    isActive
                      ? isProposal
                        ? 'bg-emerald-50 text-emerald-700 font-semibold'
                        : 'bg-indigo-50 text-indigo-700 font-semibold'
                      : isProposal
                        ? 'text-emerald-600 hover:bg-emerald-50 hover:text-emerald-800'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                  }`
                }
              >
                <entry.icon size={18} className="flex-shrink-0" />
                <span
                  className={`transition-opacity duration-200 truncate ${collapsed ? 'lg:hidden' : 'flex-1'}`}
                >
                  {entry.shortLabel}
                </span>
                {/* Status indicator */}
                {entry.status && entry.status !== 'hidden' && (
                  <div
                    className={`transition-opacity duration-200 ${collapsed ? 'lg:hidden' : ''}`}
                  >
                    {entry.status === 'warning' && (
                      <div
                        className="w-2 h-2 bg-amber-400 rounded-full flex-shrink-0"
                        title="Proceso con gaps"
                      />
                    )}
                    {entry.status === 'ok' && (
                      <div
                        className="w-2 h-2 bg-emerald-400 rounded-full flex-shrink-0"
                        title="Proceso funcional"
                      />
                    )}
                  </div>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Desktop collapse toggle — edge handle */}
        <button
          onClick={() => setSidebarCollapsed(!collapsed)}
          className="hidden lg:flex absolute top-1/2 -translate-y-1/2 -right-3 w-6 h-12 items-center justify-center bg-white border border-slate-200 rounded-r-md shadow-sm hover:bg-indigo-50 hover:border-indigo-300 transition-colors z-50 group"
          title={collapsed ? 'Expandir sidebar' : 'Colapsar sidebar'}
        >
          {collapsed ? (
            <ChevronsRight
              size={14}
              className="text-slate-400 group-hover:text-indigo-600 transition-colors"
            />
          ) : (
            <ChevronsLeft
              size={14}
              className="text-slate-400 group-hover:text-indigo-600 transition-colors"
            />
          )}
        </button>
      </aside>

      {/* Main content */}
      <div className="flex-1 min-w-0">
        {/* Mobile header */}
        <div className="lg:hidden sticky top-0 bg-white/90 backdrop-blur-sm border-b border-slate-200 px-4 py-3 z-20 flex items-center gap-3">
          <button onClick={() => setSidebarOpen(true)}>
            <Menu size={22} className="text-slate-600" />
          </button>
          <span className="font-semibold text-slate-800 text-sm">LIDR SDLC</span>
          <div className="ml-auto">
            <SimpleClientIndicator size="sm" />
          </div>
        </div>

        <main className="p-4 md:p-8 max-w-6xl mx-auto">
          <RouteStatusBanner />
          <Suspense fallback={<RouteLoadingSpinner />}>
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  );
}
