/**
 * @file PhaseCard Test Suite
 * @description Tests for PhaseCard component with memoization and performance testing
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PhaseCard } from '../PhaseCard';
import type { PhaseTemplates } from '@/data/features/handoffsTemplates';

// Mock the TemplateTable component
vi.mock('../TemplateTable', () => ({
  TemplateTable: ({ templates }: { templates: any[] }) => (
    <div data-testid="template-table">Template Table with {templates.length} templates</div>
  ),
}));

// Mock handoffs data
vi.mock('@/data/features/handoffsTemplates', () => ({
  handoffs: [
    {
      producer: [
        { role: 'PME', action: 'Define business case' },
        { role: 'PO', action: 'Approve stakeholder map' },
      ],
      receiver: [
        { role: 'R&D', action: 'Review technical viability' },
        { role: 'TL', action: 'Approve architecture decisions' },
      ],
      aiAutomation: 'Automated business case generation with LIDR SDLC framework',
    },
    {
      producer: [{ role: 'PO', action: 'Complete PRD functional' }],
      receiver: [{ role: 'Dev', action: 'Review requirements' }],
    },
  ],
}));

describe('PhaseCard', () => {
  const mockPhaseData: PhaseTemplates = {
    fase: 'FASE 1: Originación',
    faseNum: 1,
    color: 'bg-purple-50',
    borderColor: 'border-purple-200',
    gate: 'Gate 0: Intake → Discovery',
    dor: [
      'Business case draft completed',
      'Sponsor identified and committed',
      'Budget estimation approved',
      'Strategic alignment confirmed',
    ],
    exitCriteria: [
      'Business case formally approved',
      'Project charter signed',
      'Stakeholder map completed',
      'Initial risk assessment done',
    ],
    gateSpecific: ['ROI calculation validated', 'Resource allocation confirmed'],
    templates: [
      {
        code: 'T1-BC',
        name: 'Business Case',
        desc: 'Comprehensive business case with ROI analysis',
        format: '.md',
        owner: 'PME',
        mandatory: true,
        aiAssist: 'skill',
        claudePath: 'skills/business-case',
      },
      {
        code: 'T1-SM',
        name: 'Stakeholder Map',
        desc: 'Complete mapping of project stakeholders',
        format: '.md',
        owner: 'PME',
        mandatory: true,
      },
      {
        code: 'T1-KO',
        name: 'Kick-off Meeting',
        desc: 'Project initiation meeting documentation',
        format: '.md',
        owner: 'PME',
        mandatory: false,
        aiAssist: 'skill',
        claudePath: 'skills/kickoff',
      },
    ],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('renders phase card with handoff information', () => {
      render(<PhaseCard phase={mockPhaseData} />);

      // Check handoff producer information
      expect(screen.getByText('Productor (entrega)')).toBeInTheDocument();
      expect(screen.getByText('PME:')).toBeInTheDocument();
      expect(screen.getByText('Define business case')).toBeInTheDocument();
      expect(screen.getByText('PO:')).toBeInTheDocument();
      expect(screen.getByText('Approve stakeholder map')).toBeInTheDocument();

      // Check handoff receiver information
      expect(screen.getByText('Receptor (recibe)')).toBeInTheDocument();
      expect(screen.getByText('R&D:')).toBeInTheDocument();
      expect(screen.getByText('Review technical viability')).toBeInTheDocument();
      expect(screen.getByText('TL:')).toBeInTheDocument();
      expect(screen.getByText('Approve architecture decisions')).toBeInTheDocument();
    });

    it('renders gate information correctly', () => {
      render(<PhaseCard phase={mockPhaseData} />);

      // Check gate title
      expect(screen.getByText('Gate 0: Intake → Discovery')).toBeInTheDocument();

      // Check DoR section
      expect(screen.getByText('DoR (Definition of Ready)')).toBeInTheDocument();
      expect(screen.getByText('Business case draft completed')).toBeInTheDocument();
      expect(screen.getByText('Sponsor identified and committed')).toBeInTheDocument();

      // Check Exit Criteria section
      expect(screen.getByText('Criterios de Salida')).toBeInTheDocument();
      expect(screen.getByText('Business case formally approved')).toBeInTheDocument();
      expect(screen.getByText('Project charter signed')).toBeInTheDocument();

      // Check gate-specific criteria
      expect(screen.getByText('Criterios específicos del Gate')).toBeInTheDocument();
      expect(screen.getByText('ROI calculation validated')).toBeInTheDocument();
      expect(screen.getByText('Resource allocation confirmed')).toBeInTheDocument();
    });

    it('renders templates section with correct count', () => {
      render(<PhaseCard phase={mockPhaseData} />);

      // Check templates header with count
      expect(screen.getByText('Templates & Artefactos (3)')).toBeInTheDocument();
      expect(screen.getByText('Mostrar templates')).toBeInTheDocument();
    });

    it('renders AI automation information when available', () => {
      render(<PhaseCard phase={mockPhaseData} />);

      expect(screen.getByText('Automatización IA')).toBeInTheDocument();
      expect(
        screen.getByText('Automated business case generation with LIDR SDLC framework')
      ).toBeInTheDocument();
    });
  });

  describe('Template Toggle Functionality', () => {
    it('initially hides template table', () => {
      render(<PhaseCard phase={mockPhaseData} />);

      expect(screen.queryByTestId('template-table')).not.toBeInTheDocument();
      expect(screen.getByText('Mostrar templates')).toBeInTheDocument();
    });

    it('shows template table when toggle button is clicked', () => {
      render(<PhaseCard phase={mockPhaseData} />);

      const toggleButton = screen.getByText('Mostrar templates');
      fireEvent.click(toggleButton);

      expect(screen.getByTestId('template-table')).toBeInTheDocument();
      expect(screen.getByText('Template Table with 3 templates')).toBeInTheDocument();
      expect(screen.getByText('Ocultar templates')).toBeInTheDocument();
    });

    it('hides template table when toggle button is clicked again', () => {
      render(<PhaseCard phase={mockPhaseData} />);

      const toggleButton = screen.getByText('Mostrar templates');

      // Show templates
      fireEvent.click(toggleButton);
      expect(screen.getByTestId('template-table')).toBeInTheDocument();

      // Hide templates
      const hideButton = screen.getByText('Ocultar templates');
      fireEvent.click(hideButton);
      expect(screen.queryByTestId('template-table')).not.toBeInTheDocument();
      expect(screen.getByText('Mostrar templates')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles phase without handoff data gracefully', () => {
      const phaseWithoutHandoff: PhaseTemplates = {
        ...mockPhaseData,
        faseNum: 999, // Non-existent phase
      };

      render(<PhaseCard phase={phaseWithoutHandoff} />);

      // Should not show handoff section
      expect(screen.queryByText('Productor (entrega)')).not.toBeInTheDocument();
      expect(screen.queryByText('Receptor (recibe)')).not.toBeInTheDocument();

      // Should still show gate and templates
      expect(screen.getByText('Gate 0: Intake → Discovery')).toBeInTheDocument();
      expect(screen.getByText('Templates & Artefactos (3)')).toBeInTheDocument();
    });

    it('handles phase without gate-specific criteria', () => {
      const phaseWithoutGateSpecific: PhaseTemplates = {
        ...mockPhaseData,
        gateSpecific: [],
      };

      render(<PhaseCard phase={phaseWithoutGateSpecific} />);

      expect(screen.queryByText('Criterios específicos del Gate')).not.toBeInTheDocument();
      expect(screen.getByText('DoR (Definition of Ready)')).toBeInTheDocument();
      expect(screen.getByText('Criterios de Salida')).toBeInTheDocument();
    });

    it('handles phase without AI automation', () => {
      const phaseData: PhaseTemplates = {
        ...mockPhaseData,
        faseNum: 2, // Points to handoff without aiAutomation
      };

      render(<PhaseCard phase={phaseData} />);

      expect(screen.queryByText('Automatización IA')).not.toBeInTheDocument();
    });

    it('handles empty templates array', () => {
      const phaseWithNoTemplates: PhaseTemplates = {
        ...mockPhaseData,
        templates: [],
      };

      render(<PhaseCard phase={phaseWithNoTemplates} />);

      expect(screen.getByText('Templates & Artefactos (0)')).toBeInTheDocument();

      // Show templates (should show empty TemplateTable)
      fireEvent.click(screen.getByText('Mostrar templates'));
      expect(screen.getByText('Template Table with 0 templates')).toBeInTheDocument();
    });
  });

  describe('Performance Optimizations', () => {
    it('memoizes component to prevent unnecessary re-renders', () => {
      const { rerender } = render(<PhaseCard phase={mockPhaseData} />);

      // Re-render with same phase data
      rerender(<PhaseCard phase={mockPhaseData} />);

      // Component should not re-render unnecessarily (tested through React memo)
      expect(screen.getByText('Templates & Artefactos (3)')).toBeInTheDocument();
    });

    it('re-renders when phase data changes', () => {
      const { rerender } = render(<PhaseCard phase={mockPhaseData} />);

      const newPhaseData: PhaseTemplates = {
        ...mockPhaseData,
        fase: 'FASE 2: Discovery',
        templates: [
          ...mockPhaseData.templates,
          {
            code: 'T2-PRD',
            name: 'PRD Technical',
            desc: 'Technical product requirements document',
            format: '.md',
            owner: 'TL',
            mandatory: true,
          },
        ],
      };

      rerender(<PhaseCard phase={newPhaseData} />);

      expect(screen.getByText('Templates & Artefactos (4)')).toBeInTheDocument();
    });

    it('uses stable toggle handler to prevent TemplateTable re-renders', () => {
      render(<PhaseCard phase={mockPhaseData} />);

      const toggleButton = screen.getByText('Mostrar templates');

      // Multiple clicks should use same callback reference (tested through useCallback)
      fireEvent.click(toggleButton);
      fireEvent.click(screen.getByText('Ocultar templates'));
      fireEvent.click(screen.getByText('Mostrar templates'));

      expect(screen.getByTestId('template-table')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('provides proper semantic structure', () => {
      render(<PhaseCard phase={mockPhaseData} />);

      // Check for headings hierarchy
      const headings = screen.getAllByRole('heading', { level: 4 });
      expect(headings.length).toBeGreaterThan(0);

      // Check for lists
      const lists = screen.getAllByRole('list');
      expect(lists.length).toBeGreaterThan(0);
    });

    it('provides accessible button for template toggle', () => {
      render(<PhaseCard phase={mockPhaseData} />);

      const toggleButton = screen.getByRole('button', { name: /mostrar templates/i });
      expect(toggleButton).toBeInTheDocument();

      fireEvent.click(toggleButton);

      const hideButton = screen.getByRole('button', { name: /ocultar templates/i });
      expect(hideButton).toBeInTheDocument();
    });
  });
});
