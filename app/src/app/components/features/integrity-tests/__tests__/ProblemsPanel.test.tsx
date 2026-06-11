import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ProblemsPanel } from '../ProblemsPanel';
import type { TestResult } from '@/data/features/integrityTests';

const result = (overrides: Partial<TestResult> & { id: string }): TestResult => ({
  name: `Test ${overrides.id}`,
  category: 'data-integrity',
  status: 'pass',
  message: `message for ${overrides.id}`,
  ...overrides,
});

describe('ProblemsPanel', () => {
  it('renders nothing visible (only the aria-live anchor) when there are no problems', () => {
    const { container } = render(
      <ProblemsPanel testResults={{ t1: result({ id: 't1', status: 'pass' }) }} isRunning={false} />
    );
    expect(screen.queryByTestId('problems-panel')).not.toBeInTheDocument();
    // The empty aria-live anchor must exist so async updates get announced.
    expect(container.querySelector('[aria-live="polite"]')).toBeInTheDocument();
  });

  it('shows failures and warnings with their messages', () => {
    render(
      <ProblemsPanel
        testResults={{
          t1: result({ id: 't1', status: 'pass' }),
          t5: result({ id: 't5', status: 'fail', message: '❌ 3 paths do not resolve' }),
          t9: result({ id: 't9', status: 'warn', message: '⚠️ 14 orphan docs' }),
        }}
        isRunning={false}
      />
    );
    const panel = screen.getByTestId('problems-panel');
    expect(panel).toBeInTheDocument();
    expect(panel).toHaveAttribute('aria-live', 'polite');
    expect(screen.getByText('Problemas detectados')).toBeInTheDocument();
    expect(screen.getByText('1 fallo')).toBeInTheDocument();
    expect(screen.getByText('1 advertencia')).toBeInTheDocument();
    expect(screen.getByText('❌ 3 paths do not resolve')).toBeInTheDocument();
    expect(screen.getByText('⚠️ 14 orphan docs')).toBeInTheDocument();
    // Passing tests never appear in the panel.
    expect(screen.queryByText('message for t1')).not.toBeInTheDocument();
  });

  it('lists failures before warnings, each group sorted by numeric test id', () => {
    render(
      <ProblemsPanel
        testResults={{
          t12: result({ id: 't12', status: 'warn' }),
          t3: result({ id: 't3', status: 'fail' }),
          t20: result({ id: 't20', status: 'fail' }),
          t2: result({ id: 't2', status: 'warn' }),
        }}
        isRunning={false}
      />
    );
    const ids = screen.getAllByText(/^T\d+$/).map((el) => el.textContent);
    expect(ids).toEqual(['T3', 'T20', 'T2', 'T12']);
  });

  it('expands details by default for failures and collapses them for warnings', () => {
    render(
      <ProblemsPanel
        testResults={{
          t3: result({ id: 't3', status: 'fail', details: ['broken/path.md'] }),
          t9: result({ id: 't9', status: 'warn', details: ['orphan/doc.md'] }),
        }}
        isRunning={false}
      />
    );
    const detailsElements = screen.getByTestId('problems-panel').querySelectorAll('details');
    expect(detailsElements).toHaveLength(2);
    expect(detailsElements[0]?.open).toBe(true); // failure → expanded
    expect(detailsElements[1]?.open).toBe(false); // warning → collapsed
    expect(screen.getByText('broken/path.md')).toBeInTheDocument();
  });

  it('truncates long detail lists and shows the remainder count', () => {
    const details = Array.from({ length: 14 }, (_, i) => `item-${i + 1}`);
    render(
      <ProblemsPanel
        testResults={{ t3: result({ id: 't3', status: 'fail', details }) }}
        isRunning={false}
      />
    );
    expect(screen.getByText('item-10')).toBeInTheDocument();
    expect(screen.queryByText('item-11')).not.toBeInTheDocument();
    expect(screen.getByText('…y 4 más')).toBeInTheDocument();
  });

  it('re-runs a single test from the panel and disables the button while running', () => {
    const onRunSingleTest = vi.fn();
    const { rerender } = render(
      <ProblemsPanel
        testResults={{ t3: result({ id: 't3', status: 'fail' }) }}
        isRunning={false}
        onRunSingleTest={onRunSingleTest}
      />
    );
    fireEvent.click(screen.getByRole('button', { name: /Re-ejecutar/ }));
    expect(onRunSingleTest).toHaveBeenCalledWith('t3');

    rerender(
      <ProblemsPanel
        testResults={{ t3: result({ id: 't3', status: 'fail' }) }}
        isRunning={true}
        onRunSingleTest={onRunSingleTest}
      />
    );
    expect(screen.getByRole('button', { name: /Re-ejecutar/ })).toBeDisabled();
  });

  it('omits the re-run button when no handler is wired', () => {
    render(
      <ProblemsPanel testResults={{ t3: result({ id: 't3', status: 'fail' }) }} isRunning={false} />
    );
    expect(screen.queryByRole('button', { name: /Re-ejecutar/ })).not.toBeInTheDocument();
  });
});
