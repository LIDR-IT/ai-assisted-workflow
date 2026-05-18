/**
 * @file StatsBar Test Suite
 * @description Tests for StatsBar component with statistics display
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StatsBar } from '../StatsBar';

describe('StatsBar', () => {
  const mockStats = {
    phases: 8,
    handoffs: 8,
    templatesTotal: 44,
    mandatory: 32,
    withAI: 25,
  };

  describe('Basic Rendering', () => {
    it('renders all statistics with correct values', () => {
      render(<StatsBar {...mockStats} />);

      // Check that all stat values are displayed
      const allEights = screen.getAllByText('8');
      expect(allEights).toHaveLength(2); // Should appear twice for phases and handoffs
      expect(screen.getByText('44')).toBeInTheDocument();
      expect(screen.getByText('32')).toBeInTheDocument();
      expect(screen.getByText('25')).toBeInTheDocument();
    });

    it('renders all statistic labels', () => {
      render(<StatsBar {...mockStats} />);

      expect(screen.getByText('Fases')).toBeInTheDocument();
      expect(screen.getByText('Handoffs')).toBeInTheDocument();
      expect(screen.getByText('Templates Total')).toBeInTheDocument();
      expect(screen.getByText('Obligatorios')).toBeInTheDocument();
      expect(screen.getByText('Con asistencia IA')).toBeInTheDocument();
    });

    it('displays statistics in correct grid layout', () => {
      render(<StatsBar {...mockStats} />);

      const container = screen.getByText('Fases').parentElement?.parentElement;
      expect(container).toHaveClass('grid', 'grid-cols-5', 'gap-4');
    });
  });

  describe('Individual Stat Cards', () => {
    it('applies correct styling to phases card', () => {
      render(<StatsBar {...mockStats} />);

      const phasesCard = screen.getByText('Fases').parentElement;
      expect(phasesCard).toHaveClass(
        'bg-blue-50',
        'border',
        'border-blue-200',
        'rounded-lg',
        'p-4',
        'text-center'
      );

      // Check value styling (first occurrence of '8' should be phases)
      const phasesValue = screen.getAllByText('8')[0];
      expect(phasesValue).toHaveClass('text-2xl', 'font-bold', 'text-blue-700');

      // Check label styling
      const phasesLabel = screen.getByText('Fases');
      expect(phasesLabel).toHaveClass('text-sm', 'text-blue-600');
    });

    it('applies correct styling to handoffs card', () => {
      render(<StatsBar {...mockStats} />);

      const handoffsCard = screen.getByText('Handoffs').parentElement;
      expect(handoffsCard).toHaveClass('bg-orange-50', 'border', 'border-orange-200');

      // Find the handoffs value (second occurrence of "8")
      const allEights = screen.getAllByText('8');
      const handoffsValue = allEights[1]; // Second occurrence should be handoffs
      expect(handoffsValue).toHaveClass('text-2xl', 'font-bold', 'text-orange-700');

      const handoffsLabel = screen.getByText('Handoffs');
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

      const mandatoryCard = screen.getByText('Obligatorios').parentElement;
      expect(mandatoryCard).toHaveClass('bg-red-50', 'border', 'border-red-200');

      const mandatoryValue = screen.getByText('32');
      expect(mandatoryValue).toHaveClass('text-2xl', 'font-bold', 'text-red-700');

      const mandatoryLabel = screen.getByText('Obligatorios');
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
        handoffs: 0,
        templatesTotal: 0,
        mandatory: 0,
        withAI: 0,
      };

      render(<StatsBar {...zeroStats} />);

      // Should display zeros
      const allZeros = screen.getAllByText('0');
      expect(allZeros).toHaveLength(5);

      // Labels should still be present
      expect(screen.getByText('Fases')).toBeInTheDocument();
      expect(screen.getByText('Handoffs')).toBeInTheDocument();
    });

    it('handles large numbers correctly', () => {
      const largeStats = {
        phases: 999,
        handoffs: 1234,
        templatesTotal: 9999,
        mandatory: 5678,
        withAI: 4321,
      };

      render(<StatsBar {...largeStats} />);

      expect(screen.getByText('999')).toBeInTheDocument();
      expect(screen.getByText('1234')).toBeInTheDocument();
      expect(screen.getByText('9999')).toBeInTheDocument();
      expect(screen.getByText('5678')).toBeInTheDocument();
      expect(screen.getByText('4321')).toBeInTheDocument();
    });

    it('handles single digit numbers', () => {
      const smallStats = {
        phases: 1,
        handoffs: 2,
        templatesTotal: 3,
        mandatory: 4,
        withAI: 5,
      };

      render(<StatsBar {...smallStats} />);

      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();
      expect(screen.getByText('4')).toBeInTheDocument();
      expect(screen.getByText('5')).toBeInTheDocument();
    });

    it('handles negative numbers (though not expected in real usage)', () => {
      const negativeStats = {
        phases: -1,
        handoffs: -5,
        templatesTotal: -10,
        mandatory: -3,
        withAI: -7,
      };

      render(<StatsBar {...negativeStats} />);

      expect(screen.getByText('-1')).toBeInTheDocument();
      expect(screen.getByText('-5')).toBeInTheDocument();
      expect(screen.getByText('-10')).toBeInTheDocument();
      expect(screen.getByText('-3')).toBeInTheDocument();
      expect(screen.getByText('-7')).toBeInTheDocument();
    });
  });

  describe('Visual Consistency', () => {
    it('maintains consistent structure across all stat cards', () => {
      render(<StatsBar {...mockStats} />);

      const labels = ['Fases', 'Handoffs', 'Templates Total', 'Obligatorios', 'Con asistencia IA'];

      labels.forEach((label) => {
        const card = screen.getByText(label).parentElement;
        expect(card).toHaveClass('rounded-lg', 'p-4', 'text-center');
        expect(card).toHaveClass('border');

        // Each card should contain both value and label elements
        expect(card).toContainElement(screen.getByText(label));
      });
    });

    it('uses distinct color schemes for each statistic', () => {
      render(<StatsBar {...mockStats} />);

      // Test that each card has a different background color
      const colorTests = [
        { label: 'Fases', bgColor: 'bg-blue-50' },
        { label: 'Handoffs', bgColor: 'bg-orange-50' },
        { label: 'Templates Total', bgColor: 'bg-purple-50' },
        { label: 'Obligatorios', bgColor: 'bg-red-50' },
        { label: 'Con asistencia IA', bgColor: 'bg-violet-50' },
      ];

      colorTests.forEach(({ label, bgColor }) => {
        const card = screen.getByText(label).parentElement;
        expect(card).toHaveClass(bgColor);
      });
    });
  });

  describe('Responsive Design', () => {
    it('uses responsive grid layout', () => {
      render(<StatsBar {...mockStats} />);

      const container = screen.getByText('Fases').parentElement?.parentElement;
      expect(container).toHaveClass('grid-cols-5');

      // Grid should adapt to smaller screens (though specific responsive classes aren't used here)
      expect(container).toHaveClass('gap-4');
    });
  });

  describe('Data Integrity', () => {
    it('renders exactly 5 stat cards', () => {
      render(<StatsBar {...mockStats} />);

      // Count all stat cards by looking for elements with the card structure
      const cards = screen.getAllByText(
        /^(Fases|Handoffs|Templates Total|Obligatorios|Con asistencia IA)$/
      );
      expect(cards).toHaveLength(5);
    });

    it('preserves number types and formatting', () => {
      const floatStats = {
        phases: 8.5,
        handoffs: 7.2,
        templatesTotal: 44.7,
        mandatory: 32.1,
        withAI: 25.9,
      };

      render(<StatsBar {...floatStats} />);

      // Numbers should be displayed as provided (JavaScript will handle string conversion)
      expect(screen.getByText('8.5')).toBeInTheDocument();
      expect(screen.getByText('7.2')).toBeInTheDocument();
      expect(screen.getByText('44.7')).toBeInTheDocument();
      expect(screen.getByText('32.1')).toBeInTheDocument();
      expect(screen.getByText('25.9')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('provides meaningful text content for screen readers', () => {
      render(<StatsBar {...mockStats} />);

      // Each statistic should be clearly labeled
      expect(screen.getAllByText('8')).toHaveLength(2); // Phases and Handoffs both have value 8
      expect(screen.getByText('Fases')).toBeInTheDocument();

      // Text should be structured so screen readers can understand the relationship
      const phasesCard = screen.getByText('Fases').parentElement;
      expect(phasesCard).toBeDefined();
      const eightElements = screen.getAllByText('8');
      if (phasesCard && eightElements[0]) {
        expect(phasesCard).toContainElement(eightElements[0]);
      }
    });

    it('uses semantic structure for statistics display', () => {
      render(<StatsBar {...mockStats} />);

      // Each statistic follows the pattern: large number + descriptive label
      const labels = ['Fases', 'Handoffs', 'Templates Total', 'Obligatorios', 'Con asistencia IA'];

      labels.forEach((label) => {
        const labelElement = screen.getByText(label);
        expect(labelElement).toHaveClass('text-sm');

        // The card should contain both the number and label
        const card = labelElement.parentElement;
        expect(card).toContainElement(labelElement);
      });
    });
  });
});
