import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Home, FileText, Settings, type LucideIcon } from 'lucide-react';
import type { RouteStatus } from '@/data/nav-config';

vi.mock('../useClientRegistry', () => ({
  useCurrentClient: vi.fn(),
}));

vi.mock('@/data/nav-config', () => ({
  getNavConfig: vi.fn(),
}));

vi.mock('@/app/route-registry', () => ({
  ROUTES_BY_ID: {
    home: {
      id: 'home',
      path: '',
      Component: () => null,
      icon: Home,
      defaultLabel: 'Inicio',
      defaultShortLabel: 'Inicio',
      group: 'overview',
      phase: null,
      gate: null,
    },
    docs: {
      id: 'docs',
      path: 'docs',
      Component: () => null,
      icon: FileText,
      defaultLabel: 'Documentación',
      defaultShortLabel: 'Docs',
      group: 'support',
      phase: null,
      gate: null,
    },
    settings: {
      id: 'settings',
      path: 'settings',
      Component: () => null,
      icon: Settings,
      defaultLabel: 'Settings',
      defaultShortLabel: 'Settings',
      group: 'support',
      phase: null,
      gate: null,
    },
  },
}));

import { useNavEntries } from '../useNavEntries';
import { useCurrentClient } from '../useClientRegistry';
import { getNavConfig } from '@/data/nav-config';
import type { ClientNavConfig } from '@/data/nav-config';

const mockUseCurrentClient = vi.mocked(useCurrentClient);
const mockGetNavConfig = vi.mocked(getNavConfig);

function mockCurrentClient(clientId: string) {
  mockUseCurrentClient.mockReturnValue({
    clientId,
    client: { name: clientId, fullName: clientId } as never,
  });
}

function link(
  id: string,
  label: string,
  icon: LucideIcon,
  shortLabel: string,
  status?: RouteStatus
) {
  return { type: 'link' as const, id, label, icon, shortLabel, status };
}

const sep = (label: string) => ({ type: 'separator' as const, label });

describe('useNavEntries', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns empty array when no client configuration exists', () => {
    mockCurrentClient('test-client');
    mockGetNavConfig.mockReturnValue(undefined);

    const { result } = renderHook(() => useNavEntries());

    expect(result.current).toEqual([]);
  });

  it('generates navigation entries for a simple client configuration', () => {
    mockCurrentClient('test-client');

    const cfg: ClientNavConfig = {
      sections: [{ title: 'Main', routes: ['home'] }],
      routes: {
        home: { label: 'Home', shortLabel: 'Home', status: 'ok' },
      },
    };
    mockGetNavConfig.mockReturnValue(cfg);

    const { result } = renderHook(() => useNavEntries());

    expect(result.current).toEqual([sep('Main'), link('home', 'Home', Home, 'Home', 'ok')]);
  });

  it('falls back to defaultLabel when override is missing (no status emitted)', () => {
    mockCurrentClient('test-client');

    const cfg: ClientNavConfig = {
      sections: [{ title: 'Main', routes: ['docs'] }],
      routes: {},
    };
    mockGetNavConfig.mockReturnValue(cfg);

    const { result } = renderHook(() => useNavEntries());

    expect(result.current).toEqual([
      sep('Main'),
      link('docs', 'Documentación', FileText, 'Docs', undefined),
    ]);
  });

  it('generates navigation entries with multiple sections', () => {
    mockCurrentClient('test-client');

    const cfg: ClientNavConfig = {
      sections: [
        { title: 'Navigation', routes: ['home'] },
        { title: 'Documentation', routes: ['docs'] },
      ],
      routes: {
        home: { label: 'Home', shortLabel: 'Home', status: 'ok' },
        docs: { label: 'Documentation', shortLabel: 'Docs', status: 'ok' },
      },
    };
    mockGetNavConfig.mockReturnValue(cfg);

    const { result } = renderHook(() => useNavEntries());

    expect(result.current).toEqual([
      sep('Navigation'),
      link('home', 'Home', Home, 'Home', 'ok'),
      sep('Documentation'),
      link('docs', 'Documentation', FileText, 'Docs', 'ok'),
    ]);
  });

  it('skips routes with hidden status', () => {
    mockCurrentClient('test-client');

    const cfg: ClientNavConfig = {
      sections: [{ title: 'Main', routes: ['home', 'settings'] }],
      routes: {
        home: { label: 'Home', shortLabel: 'Home', status: 'ok' },
        settings: { label: 'Settings', shortLabel: 'Settings', status: 'hidden' },
      },
    };
    mockGetNavConfig.mockReturnValue(cfg);

    const { result } = renderHook(() => useNavEntries());

    expect(result.current).toEqual([sep('Main'), link('home', 'Home', Home, 'Home', 'ok')]);
  });

  it('skips ids that are not present in the route registry', () => {
    mockCurrentClient('test-client');

    const cfg: ClientNavConfig = {
      sections: [{ title: 'Main', routes: ['home', 'nonexistent'] }],
      routes: {
        home: { label: 'Home', shortLabel: 'Home', status: 'ok' },
      },
    };
    mockGetNavConfig.mockReturnValue(cfg);

    const { result } = renderHook(() => useNavEntries());

    expect(result.current).toEqual([sep('Main'), link('home', 'Home', Home, 'Home', 'ok')]);
  });

  it('emits section separators even when no routes survive filtering', () => {
    mockCurrentClient('test-client');

    const cfg: ClientNavConfig = {
      sections: [
        { title: 'Main', routes: ['home'] },
        { title: 'Empty Section', routes: ['settings'] },
      ],
      routes: {
        home: { label: 'Home', shortLabel: 'Home', status: 'ok' },
        settings: { label: 'Hidden', shortLabel: 'Hidden', status: 'hidden' },
      },
    };
    mockGetNavConfig.mockReturnValue(cfg);

    const { result } = renderHook(() => useNavEntries());

    expect(result.current).toEqual([
      sep('Main'),
      link('home', 'Home', Home, 'Home', 'ok'),
      sep('Empty Section'),
    ]);
  });

  it('memoizes result based on clientId', () => {
    mockCurrentClient('test-client');

    const cfg: ClientNavConfig = {
      sections: [{ title: 'Main', routes: ['home'] }],
      routes: { home: { label: 'Home', shortLabel: 'Home', status: 'ok' } },
    };
    mockGetNavConfig.mockReturnValue(cfg);

    const { result, rerender } = renderHook(() => useNavEntries());
    const firstResult = result.current;

    rerender();
    const secondResult = result.current;

    expect(firstResult).toBe(secondResult);
    expect(mockGetNavConfig).toHaveBeenCalledTimes(1);
  });

  it('recalculates when clientId changes', () => {
    mockCurrentClient('client1');
    mockGetNavConfig.mockReturnValue({
      sections: [{ title: 'Client 1', routes: ['home'] }],
      routes: { home: { label: 'Home', shortLabel: 'Home', status: 'ok' } },
    });

    const { result, rerender } = renderHook(() => useNavEntries());
    const firstResult = result.current;

    mockCurrentClient('client2');
    mockGetNavConfig.mockReturnValue({
      sections: [{ title: 'Client 2', routes: ['docs'] }],
      routes: { docs: { label: 'Documentation', shortLabel: 'Docs', status: 'ok' } },
    });

    rerender();
    const secondResult = result.current;

    expect(firstResult).not.toBe(secondResult);
    expect(firstResult[0]?.label).toBe('Client 1');
    expect(secondResult[0]?.label).toBe('Client 2');
    expect(mockGetNavConfig).toHaveBeenCalledTimes(2);
  });

  it('treats warning status as visible (not hidden) and emits status', () => {
    mockCurrentClient('test-client');

    const cfg: ClientNavConfig = {
      sections: [{ title: 'Main', routes: ['home', 'docs'] }],
      routes: {
        home: { label: 'Home', shortLabel: 'Home', status: 'ok' },
        docs: { label: 'Docs (rough)', shortLabel: 'Docs', status: 'warning' },
      },
    };
    mockGetNavConfig.mockReturnValue(cfg);

    const { result } = renderHook(() => useNavEntries());

    expect(result.current).toEqual([
      sep('Main'),
      link('home', 'Home', Home, 'Home', 'ok'),
      link('docs', 'Docs (rough)', FileText, 'Docs', 'warning'),
    ]);
  });

  it('uses override.label as shortLabel fallback when shortLabel is omitted', () => {
    mockCurrentClient('test-client');

    const cfg: ClientNavConfig = {
      sections: [{ title: 'Main', routes: ['docs'] }],
      routes: {
        // Only label, no shortLabel — should be used for both.
        docs: { label: 'Bridge Sync', status: 'warning' },
      },
    };
    mockGetNavConfig.mockReturnValue(cfg);

    const { result } = renderHook(() => useNavEntries());

    expect(result.current).toEqual([
      sep('Main'),
      link('docs', 'Bridge Sync', FileText, 'Bridge Sync', 'warning'),
    ]);
  });
});
