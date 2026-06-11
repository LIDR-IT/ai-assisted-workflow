import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import {
  RouteLoadingSpinner,
  MinimalRouteSpinner,
  FullPageRouteSpinner,
  RouteLoadError,
} from '../RouteLoadingSpinner';

describe('RouteLoadingSpinner', () => {
  it('renders with default props', () => {
    const { container } = render(<RouteLoadingSpinner />);

    expect(screen.getByText('Cargando página...')).toBeInTheDocument();

    // Check for spinner icon
    const spinner = container.querySelector('svg.animate-spin');
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveClass('w-6', 'h-6', 'animate-spin', 'text-indigo-600');
  });

  it('renders custom message', () => {
    render(<RouteLoadingSpinner message="Custom loading message" />);

    expect(screen.getByText('Custom loading message')).toBeInTheDocument();
  });

  it('hides message when showMessage is false', () => {
    render(<RouteLoadingSpinner showMessage={false} />);

    expect(screen.queryByText('Cargando página...')).not.toBeInTheDocument();
  });

  it('applies correct size classes for small size', () => {
    const { container } = render(<RouteLoadingSpinner size="sm" />);

    const spinnerIcon = container.querySelector('svg');
    expect(spinnerIcon).toHaveClass('w-4', 'h-4');
  });

  it('applies correct size classes for medium size', () => {
    const { container } = render(<RouteLoadingSpinner size="md" />);

    const spinnerIcon = container.querySelector('svg');
    expect(spinnerIcon).toHaveClass('w-6', 'h-6');
  });

  it('applies correct size classes for large size', () => {
    const { container } = render(<RouteLoadingSpinner size="lg" />);

    const spinnerIcon = container.querySelector('svg');
    expect(spinnerIcon).toHaveClass('w-8', 'h-8');
  });

  it('has spinner animation class', () => {
    const { container } = render(<RouteLoadingSpinner />);

    const spinnerIcon = container.querySelector('svg');
    expect(spinnerIcon).toHaveClass('animate-spin');
  });
});

describe('MinimalRouteSpinner', () => {
  it('renders minimal spinner', () => {
    const { container } = render(<MinimalRouteSpinner />);

    const spinnerIcon = container.querySelector('svg');
    expect(spinnerIcon).toBeInTheDocument();
    expect(spinnerIcon).toHaveClass('w-4', 'h-4', 'animate-spin', 'text-indigo-600');
  });

  it('has correct container classes', () => {
    const { container } = render(<MinimalRouteSpinner />);

    const containerDiv = container.firstChild;
    expect(containerDiv).toHaveClass('flex', 'items-center', 'justify-center', 'p-2');
  });
});

describe('FullPageRouteSpinner', () => {
  it('renders full page spinner with branding', () => {
    render(<FullPageRouteSpinner />);

    expect(screen.getByText('LIDR SDLC')).toBeInTheDocument();
    expect(screen.getByText('Cargando componente...')).toBeInTheDocument();
  });

  it('has correct container classes', () => {
    const { container } = render(<FullPageRouteSpinner />);

    const containerDiv = container.firstChild;
    expect(containerDiv).toHaveClass(
      'flex',
      'flex-col',
      'items-center',
      'justify-center',
      'min-h-[400px]'
    );
  });

  it('has spinner with correct size', () => {
    const { container } = render(<FullPageRouteSpinner />);

    const spinnerIcon = container.querySelector('svg');
    expect(spinnerIcon).toHaveClass('w-8', 'h-8', 'animate-spin', 'text-indigo-600');
  });
});

describe('RouteLoadError', () => {
  it('renders default error message', () => {
    render(<RouteLoadError />);

    expect(screen.getByText('Error al cargar la página')).toBeInTheDocument();
    expect(screen.getByText('No se pudo cargar el componente')).toBeInTheDocument();
  });

  it('renders custom error message', () => {
    const customError = new Error('Custom error message');
    render(<RouteLoadError error={customError} />);

    expect(screen.getByText('Custom error message')).toBeInTheDocument();
  });

  it('renders retry button when retry function provided', () => {
    const retryFn = vi.fn();
    render(<RouteLoadError retry={retryFn} />);

    const retryButton = screen.getByRole('button', { name: 'Intentar de nuevo' });
    expect(retryButton).toBeInTheDocument();
  });

  it('calls retry function when button clicked', () => {
    const retryFn = vi.fn();
    render(<RouteLoadError retry={retryFn} />);

    const retryButton = screen.getByRole('button', { name: 'Intentar de nuevo' });
    fireEvent.click(retryButton);

    expect(retryFn).toHaveBeenCalledTimes(1);
  });

  it('does not render retry button when no retry function provided', () => {
    render(<RouteLoadError />);

    const retryButton = screen.queryByRole('button', { name: 'Intentar de nuevo' });
    expect(retryButton).not.toBeInTheDocument();
  });

  it('displays error message with proper styling', () => {
    const { container } = render(<RouteLoadError />);

    const errorContainer = container.firstChild;
    expect(errorContainer).toHaveClass(
      'flex',
      'flex-col',
      'items-center',
      'justify-center',
      'p-8',
      'space-y-4'
    );
  });
});
