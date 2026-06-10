/**
 * @file StatsBar Test Suite
 * @description Tests for StatsBar component with statistics display (unified phase model)
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StatsBar } from '../StatsBar';

describe('StatsBar', () => {
  const mockStats = {
    phases: 5,
    stages: 9,
    handoffs: 8,
    templatesTotal: 44,
    mandatory: 32,
    withAI: 25,
  };

  describe('Basic Rendering', () => {
    it('renders all statistics with correct values', () => {
      render(<StatsBar {...mockStats} />);

      // Phases card renders combined "phases · stages"
      const phasesCard = screen.getByText('Fases · Etapas').parentElement;
      expect(phasesCard).toHaveTextContent('5 · 9');

      expect(screen.getByText('8')).toBeInTheDocument();
      expect(screen.getByText('44')).toBeInTheDocument();
      expect(screen.getByText('32')).toBeInTheDocument();
      expect(screen.getByText('25')).toBeInTheDocument();
    });

    it('renders all statistic labels', () => {
      render(<StatsBar {...mockStats} />);

      expect(screen.getByText('Fases · Etapas')).toBeInTheDocument();
      expect(screen.getByText('Handoffs (G0–G7)')).toBeInTheDocument();
      expect(screen.getByText('Templates Total')).toBeInTheDocument();
      expect(screen.getByText('Evidencia required')).toBeInTheDocument();
      expect(screen.getByText('Con asistencia IA')).toBeInTheDocument();
    });

    it('displays statistics in correct grid layout', () => {
      render(<StatsBar {...mockStats} />);

      const container = screen.getByText('Fases · Etapas').parentElement?.parentElement;
      expect(container).toHaveClass('grid', 'grid-cols-5', 'gap-4');
    });
  });

  describe('Individual Stat Cards', () => {
    it('applies correct styling to phases card', () => {
      render(<StatsBar {...mockStats} />);

      const phasesCard = screen.getByText('Fases · Etapas').parentElement;
      expect(phasesCard).toHaveClass(
        'bg-blue-50',
        'border',
        'border-blue-200',
        'rounded-lg',
        'p-4',
        'text-center'
      );

      const phasesLabel = screen.getByText('Fases · Etapas');
      expect(phasesLabel).toHaveClass('text-sm', 'text-blue-600');
    });

    it('applies correct styling to handoffs card', () => {
      render(<StatsBar {...mockStats} />);

      const handoffsCard = screen.getByText('Handoffs (G0–G7)').parentElement;
      expect(handoffsCard).toHaveClass('bg-orange-50', 'border', 'border-orange-200');

      const handoffsValue = screen.getByText('8');
      expect(handoffsValue).toHaveClass('text-2xl', 'font-bold', 'text-orange-700');

      const handoffsLabel = screen.getByText('Handoffs (G0–G7)');
      expect(handoffsLabel).toHaveClass('text-sm', 'text-orange-600');
    });

    it('applies correct styling to templates total card', () => {
      render(<StatsBar {...mockStats} />);

      const templatesCard = screen.getByText('Templates Total').parentElement;
      expect(templatesCard).toHaveClass('bg-purple-50', 'border', 'border-purple-200');

      const templatesValue = screen.getByText('44');
      expect(templatesValue).toHaveClass('text-2xl', 'font-bold', 'text-purple-700');

      const templatesLabel = screen.getByText('Templates Total');
      expect(templatesLabel).toHaveClass('text-sm', 'text-purple-600');
    });

    it('applies correct styling to mandatory card', () => {
      render(<StatsBar {...mockStats} />);

      const mandatoryCard = screen.getByText('Evidencia required').parentElement;
      expect(mandatoryCard).toHaveClass('bg-red-50', 'border', 'border-red-200');

      const mandatoryValue = screen.getByText('32');
      expect(mandatoryValue).toHaveClass('text-2xl', 'font-bold', 'text-red-700');

      const mandatoryLabel = screen.getByText('Evidencia required');
      expect(mandatoryLabel).toHaveClass('text-sm', 'text-red-600');
    });

    it('applies correct styling to AI assistance card', () => {
      render(<StatsBar {...mockStats} />);

      const aiCard = screen.getByText('Con asistencia IA').parentElement;
      expect(aiCard).toHaveClass('bg-violet-50', 'border', 'border-violet-200');

      const aiValue = screen.getByText('25');
      expect(aiValue).toHaveClass('text-2xl', 'font-bold', 'text-violet-700');

      const aiLabel = screen.getByText('Con asistencia IA');
      expect(aiLabel).toHaveClass('text-sm', 'text-violet-600');
    });
  });

  describe('Edge Cases', () => {
    it('handles zero values correctly', () => {
      const zeroStats = {
        phases: 0,
        stages: 0,
        handoffs: 0,
        templatesTotal: 0,
        mandatory: 0,
        withAI: 0,
      };

      render(<StatsBar {...zeroStats} />);

      const phasesCard = screen.getByText('Fases · Etapas').parentElement;
      expect(phasesCard).toHaveTextContent('0 · 0');

      // Labels should still be present
      expect(screen.getByText('Fases · Etapas')).toBeInTheDocument();
      expect(screen.getByText('Handoffs (G0–G7)')).toBeInTheDocument();
    });

    it('handles large numbers correctly', () => {
      const largeStats = {
        phases: 999,
        stages: 888,
        handoffs: 1234,
        templatesTotal: 9999,
        mandatory: 5678,
        withAI: 4321,
      };

      render(<StatsBar {...largeStats} />);

      const phasesCard = screen.getByText('Fases · Etapas').parentElement;
      expect(phasesCard).toHaveTextContent('999 · 888');
      expect(screen.getByText('1234')).toBeInTheDocument();
      expect(screen.getByText('9999')).toBeInTheDocument();
      expect(screen.getByText('5678')).toBeInTheDocument();
      expect(screen.getByText('4321')).toBeInTheDocument();
    });
  });

  describe('Visual Consistency', () => {
    it('maintains consistent structure across all stat cards', () => {
      render(<StatsBar {...mockStats} />);

      const labels = [
        'Fases · Etapas',
        'Handoffs (G0–G7)',
        'Templates Total',
        'Evidencia required',
        'Con asistencia IA',
      ];

      labels.forEach((label) => {
        const card = screen.getByText(label).parentElement;
        expect(card).toHaveClass('rounded-lg', 'p-4', 'text-center');
        expect(card).toHaveClass('border');
        expect(card).toContainElement(screen.getByText(label));
      });
    });

    it('uses distinct color schemes for each statistic', () => {
      render(<StatsBar {...mockStats} />);

      const colorTests = [
        { label: 'Fases · Etapas', bgColor: 'bg-blue-50' },
        { label: 'Handoffs (G0–G7)', bgColor: 'bg-orange-50' },
        { label: 'Templates Total', bgColor: 'bg-purple-50' },
        { label: 'Evidencia required', bgColor: 'bg-red-50' },
        { label: 'Con asistencia IA', bgColor: 'bg-violet-50' },
      ];

      colorTests.forEach(({ label, bgColor }) => {
        const card = screen.getByText(label).parentElement;
        expect(card).toHaveClass(bgColor);
      });
    });
  });

  describe('Data Integrity', () => {
    it('renders exactly 5 stat cards', () => {
      render(<StatsBar {...mockStats} />);

      const cards = screen.getAllByText(
        /^(Fases · Etapas|Handoffs \(G0–G7\)|Templates Total|Evidencia required|Con asistencia IA)$/
      );
      expect(cards).toHaveLength(5);
    });
  });

  describe('Accessibility', () => {
    it('provides meaningful text content for screen readers', () => {
      render(<StatsBar {...mockStats} />);

      const phasesCard = screen.getByText('Fases · Etapas').parentElement;
      expect(phasesCard).toBeDefined();
      expect(phasesCard).toHaveTextContent('5 · 9');
    });

    it('uses semantic structure for statistics display', () => {
      render(<StatsBar {...mockStats} />);

      const labels = [
        'Fases · Etapas',
        'Handoffs (G0–G7)',
        'Templates Total',
        'Evidencia required',
        'Con asistencia IA',
      ];

      labels.forEach((label) => {
        const labelElement = screen.getByText(label);
        expect(labelElement).toHaveClass('text-sm');

        const card = labelElement.parentElement;
        expect(card).toContainElement(labelElement);
      });
    });
  });
});
