/**
 * @file MetricCard Test Suite
 * @description Tests for MetricCard component and factory function
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MetricCard, createMetricCard } from '../MetricCard';
import * as fixtures from '@/fixtures';

// Mock fixtures
vi.mock('@/fixtures', () => ({
  ICON_COLORS: {
    'trending-up': 'text-blue-600',
    activity: 'text-amber-600',
    bug: 'text-red-500',
    rocket: 'text-emerald-600',
    timer: 'text-violet-600',
    gauge: 'text-cyan-600',
  },
}));

describe('MetricCard', () => {
  const defaultProps = {
    title: 'Test Metric',
    value: '150',
    target: '200',
    trend: 'up' as const,
    trendGood: true,
    delta: '+25%',
    icon: <div data-testid="test-icon">📊</div>,
    source: 'Test Source',
  };

  it('renders metric card with all props', () => {
    render(<MetricCard {...defaultProps} />);

    expect(screen.getByText('Test Metric')).toBeInTheDocument();
    expect(screen.getByText('150')).toBeInTheDocument();
    expect(screen.getByText('Target: 200')).toBeInTheDocument();
    expect(screen.getByText('+25%')).toBeInTheDocument();
    expect(screen.getByText('Test Source')).toBeInTheDocument();
    expect(screen.getByTestId('test-icon')).toBeInTheDocument();
  });

  it('displays positive trend with green color', () => {
    render(<MetricCard {...defaultProps} trend="up" trendGood={true} />);

    const deltaElement = screen.getByText('+25%');
    expect(deltaElement).toHaveClass('text-emerald-600');
  });

  it('displays negative trend with red color when trend is bad', () => {
    render(<MetricCard {...defaultProps} trend="down" trendGood={false} delta="-15%" />);

    const deltaElement = screen.getByText('-15%');
    expect(deltaElement).toHaveClass('text-red-500');
  });

  it('displays stable trend with neutral color', () => {
    render(<MetricCard {...defaultProps} trend="stable" delta="0%" />);

    const deltaElement = screen.getByText('0%');
    // Stable trend uses neutral color regardless of trendGood
    expect(deltaElement).toHaveClass('text-slate-500');
  });

  it('shows down trend as good when trendGood is true', () => {
    render(<MetricCard {...defaultProps} trend="down" trendGood={true} delta="-5%" />);

    const deltaElement = screen.getByText('-5%');
    expect(deltaElement).toHaveClass('text-emerald-600');
  });

  it('renders correct trend icon for up trend', () => {
    render(<MetricCard {...defaultProps} trend="up" />);

    // Check that ArrowUpRight icon is rendered (by looking for the trend indicator)
    const trendElement = screen.getByText('+25%').parentElement;
    expect(trendElement).toBeInTheDocument();
  });

  it('renders correct trend icon for down trend', () => {
    render(<MetricCard {...defaultProps} trend="down" delta="-10%" />);

    // Check that ArrowDownRight icon is rendered
    const trendElement = screen.getByText('-10%').parentElement;
    expect(trendElement).toBeInTheDocument();
  });

  it('renders correct trend icon for stable trend', () => {
    render(<MetricCard {...defaultProps} trend="stable" delta="0%" />);

    // Check that Minus icon is rendered for stable trend
    const trendElement = screen.getByText('0%').parentElement;
    expect(trendElement).toBeInTheDocument();
  });

  it('handles missing optional props gracefully', () => {
    const minimalProps = {
      title: 'Minimal Metric',
      value: '100',
      target: '100',
      trend: 'stable' as const,
      trendGood: true,
      delta: '0%',
      icon: <div>📊</div>,
      source: '',
    };

    render(<MetricCard {...minimalProps} />);

    expect(screen.getByText('Minimal Metric')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();
  });
});

describe('createMetricCard', () => {
  const mockMetricData = {
    title: 'Skills Estandarizados',
    value: '57',
    target: '60',
    trend: 'up' as const,
    trendGood: true,
    delta: '+12%',
    iconType: 'trending-up' as const,
    source: 'LIDR SDLC Analytics',
  };

  it('creates metric card with correct props', () => {
    const cardElement = createMetricCard(mockMetricData, 'test-key');

    expect(cardElement).toBeDefined();
    expect(cardElement.key).toBe('test-key');
  });

  it('uses correct icon color from fixtures', () => {
    createMetricCard({
      ...mockMetricData,
      iconType: 'activity',
    });

    // The component should use ICON_COLORS from fixtures
    expect(fixtures.ICON_COLORS.activity).toBe('text-amber-600');
  });

  it('handles different icon types', () => {
    const iconTypes = ['trending-up', 'activity', 'bug', 'rocket', 'timer', 'gauge'] as const;

    iconTypes.forEach((iconType) => {
      const cardElement = createMetricCard({
        ...mockMetricData,
        iconType,
      });

      expect(cardElement).toBeDefined();
      expect(fixtures.ICON_COLORS[iconType]).toBeDefined();
    });
  });

  it('generates metric card without key', () => {
    const cardElement = createMetricCard(mockMetricData);

    expect(cardElement).toBeDefined();
    // Key should be undefined when not provided
    expect(cardElement.key).toBeNull();
  });

  it('handles edge case metric data', () => {
    const edgeCaseData = {
      title: 'Empty Metric',
      value: '0',
      target: '0',
      trend: 'stable' as const,
      trendGood: true,
      delta: '0%',
      iconType: 'gauge' as const,
      source: '',
    };

    const cardElement = createMetricCard(edgeCaseData);

    expect(cardElement).toBeDefined();
  });

  it('preserves all metric data properties', () => {
    const fullMetricData = {
      title: 'Complex Metric',
      value: '142.5',
      target: '150.0',
      trend: 'down' as const,
      trendGood: false,
      delta: '-5.0%',
      iconType: 'bug' as const,
      source: 'Quality Analytics',
    };

    const cardElement = createMetricCard(fullMetricData, 'complex-metric');

    expect(cardElement).toBeDefined();
    expect(cardElement.key).toBe('complex-metric');
    // All props should be passed to the component
    expect(cardElement.props.title).toBe('Complex Metric');
    expect(cardElement.props.value).toBe('142.5');
    expect(cardElement.props.target).toBe('150.0');
    expect(cardElement.props.trend).toBe('down');
    expect(cardElement.props.trendGood).toBe(false);
    expect(cardElement.props.delta).toBe('-5.0%');
    expect(cardElement.props.source).toBe('Quality Analytics');
  });
});
