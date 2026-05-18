/**
 * @file HelpCenter Test Suite
 * @description Tests for HelpCenter component and search functionality
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router';
import { HelpCenter } from '../HelpCenter';
import { useCurrentClient } from '@/hooks';
import * as fixtures from '@/fixtures';

// Mock hooks
vi.mock('@/hooks', () => ({
  useCurrentClient: vi.fn(),
}));

// Mock search params
const mockSetSearchParams = vi.fn();
vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return {
    ...actual,
    useSearchParams: () => [new URLSearchParams(), mockSetSearchParams],
  };
});

// Mock fixtures
vi.mock('@/fixtures', () => ({
  getStatsForClient: vi.fn(),
  popularSearchTerms: ['business case', 'testing', 'security'],
}));

// Test wrapper component
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe('HelpCenter', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Setup default mocks
    (useCurrentClient as any).mockReturnValue({
      client: { name: 'facephi' },
    });

    (fixtures.getStatsForClient as any).mockReturnValue([
      { value: 57, label: 'Skills', color: 'text-blue-600' },
      { value: 23, label: 'Commands', color: 'text-green-600' },
    ]);
  });

  describe('Initial State', () => {
    it('renders help center with initial welcome message', () => {
      render(
        <TestWrapper>
          <HelpCenter />
        </TestWrapper>
      );

      expect(screen.getByText('Help Center')).toBeInTheDocument();
      expect(screen.getByText(/Busca en \d+ artefactos/)).toBeInTheDocument();
      expect(screen.getByText('Búsquedas populares:')).toBeInTheDocument();
    });

    it('displays client-specific statistics', () => {
      render(
        <TestWrapper>
          <HelpCenter />
        </TestWrapper>
      );

      expect(screen.getByText('57')).toBeInTheDocument();
      expect(screen.getByText('Skills')).toBeInTheDocument();
      expect(screen.getByText('23')).toBeInTheDocument();
      expect(screen.getByText('Commands')).toBeInTheDocument();
    });

    it('renders popular search suggestions', () => {
      render(
        <TestWrapper>
          <HelpCenter />
        </TestWrapper>
      );

      expect(screen.getByText('business case')).toBeInTheDocument();
      expect(screen.getByText('testing')).toBeInTheDocument();
      expect(screen.getByText('security')).toBeInTheDocument();
    });
  });

  describe('Search Functionality', () => {
    it('updates search input value', async () => {
      render(
        <TestWrapper>
          <HelpCenter />
        </TestWrapper>
      );

      const searchInput = screen.getByPlaceholderText(/Buscar skills, commands/);
      fireEvent.change(searchInput, { target: { value: 'business' } });

      expect(searchInput).toHaveValue('business');
    });

    it('triggers search on popular suggestion click', async () => {
      render(
        <TestWrapper>
          <HelpCenter />
        </TestWrapper>
      );

      const suggestionButton = screen.getByText('testing');
      fireEvent.click(suggestionButton);

      const searchInput = screen.getByPlaceholderText(/Buscar skills, commands/);
      expect(searchInput).toHaveValue('testing');
    });

    it('updates URL search params on query change', async () => {
      render(
        <TestWrapper>
          <HelpCenter />
        </TestWrapper>
      );

      const searchInput = screen.getByPlaceholderText(/Buscar skills, commands/);
      fireEvent.change(searchInput, { target: { value: 'prd' } });

      await waitFor(() => {
        expect(mockSetSearchParams).toHaveBeenCalledWith({ q: 'prd' });
      });
    });

    it('clears search params when query is empty', async () => {
      render(
        <TestWrapper>
          <HelpCenter />
        </TestWrapper>
      );

      const searchInput = screen.getByPlaceholderText(/Buscar skills, commands/);

      // First add a query
      fireEvent.change(searchInput, { target: { value: 'test' } });
      await waitFor(() => {
        expect(mockSetSearchParams).toHaveBeenCalledWith({ q: 'test' });
      });

      // Then clear it
      fireEvent.change(searchInput, { target: { value: '' } });
      await waitFor(() => {
        expect(mockSetSearchParams).toHaveBeenCalledWith({});
      });
    });
  });

  describe('Client Customization', () => {
    it('adapts statistics for Docline client', () => {
      (useCurrentClient as any).mockReturnValue({
        client: { name: 'Docline' },
      });

      (fixtures.getStatsForClient as any).mockReturnValue([
        { value: 42, label: 'Procesos', color: 'text-blue-600' },
        { value: 87, label: 'Adopción %', color: 'text-orange-600' },
      ]);

      render(
        <TestWrapper>
          <HelpCenter />
        </TestWrapper>
      );

      expect(screen.getByText('42')).toBeInTheDocument();
      expect(screen.getByText('Procesos')).toBeInTheDocument();
      expect(screen.getByText('87')).toBeInTheDocument();
      expect(screen.getByText('Adopción %')).toBeInTheDocument();
    });

    it('calls getStatsForClient with correct client name', () => {
      (useCurrentClient as any).mockReturnValue({
        client: { name: 'facephi' },
      });

      render(
        <TestWrapper>
          <HelpCenter />
        </TestWrapper>
      );

      expect(fixtures.getStatsForClient).toHaveBeenCalledWith('facephi');
    });

    it('handles missing client gracefully', () => {
      (useCurrentClient as any).mockReturnValue({
        client: null,
      });

      render(
        <TestWrapper>
          <HelpCenter />
        </TestWrapper>
      );

      expect(fixtures.getStatsForClient).toHaveBeenCalledWith('facephi');
    });
  });

  describe('Performance Optimizations', () => {
    it('memoizes client stats computation', () => {
      const { rerender } = render(
        <TestWrapper>
          <HelpCenter />
        </TestWrapper>
      );

      expect(fixtures.getStatsForClient).toHaveBeenCalledTimes(1);

      // Re-render with same client
      rerender(
        <TestWrapper>
          <HelpCenter />
        </TestWrapper>
      );

      // Should not call getStatsForClient again due to memoization
      expect(fixtures.getStatsForClient).toHaveBeenCalledTimes(1);
    });

    it('recalculates stats when client changes', () => {
      // Test that stats recalculation depends on client name change
      // Since the component uses useMemo with [client?.name] dependency,
      // it should recalculate when the client name changes

      const { rerender } = render(
        <TestWrapper>
          <HelpCenter />
        </TestWrapper>
      );

      expect(fixtures.getStatsForClient).toHaveBeenCalledWith('facephi');

      // Force a key change to trigger rerender with different client
      (useCurrentClient as any).mockReturnValue({
        client: { name: 'docline' },
        clientId: 'docline', // Add clientId to ensure the hook returns different data
      });

      rerender(
        <TestWrapper key="different-client">
          <HelpCenter />
        </TestWrapper>
      );

      // The function should be called again with the new client
      expect(fixtures.getStatsForClient).toHaveBeenCalledTimes(2);
      expect(fixtures.getStatsForClient).toHaveBeenNthCalledWith(2, 'docline');
    });
  });
});
