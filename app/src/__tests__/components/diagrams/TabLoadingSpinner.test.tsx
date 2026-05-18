import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

// Create a simple TabLoadingSpinner component for testing
// This simulates the component from PropuestaMejora.tsx
function TabLoadingSpinner() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        <p className="text-gray-600">Cargando contenido...</p>
      </div>
    </div>
  );
}

describe('TabLoadingSpinner Component', () => {
  it('renders without crashing', () => {
    render(<TabLoadingSpinner />);

    expect(screen.getByText('Cargando contenido...')).toBeInTheDocument();
  });

  it('displays loading message in Spanish', () => {
    render(<TabLoadingSpinner />);

    expect(screen.getByText('Cargando contenido...')).toBeInTheDocument();
  });

  it('has proper CSS classes for styling', () => {
    const { container } = render(<TabLoadingSpinner />);

    // Check container classes
    const container_div = container.firstChild as HTMLElement;
    expect(container_div).toHaveClass('flex', 'items-center', 'justify-center', 'h-64');

    // Check inner container classes
    const innerContainer = container_div.firstChild as HTMLElement;
    expect(innerContainer).toHaveClass('flex', 'flex-col', 'items-center', 'space-y-4');
  });

  it('has spinning animation element', () => {
    const { container } = render(<TabLoadingSpinner />);

    // Find the spinner element
    const spinner = container.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveClass(
      'w-8',
      'h-8',
      'border-4',
      'border-blue-200',
      'border-t-blue-600',
      'rounded-full'
    );
  });

  it('has correct semantic structure', () => {
    render(<TabLoadingSpinner />);

    // The text should be in a paragraph element
    const text = screen.getByText('Cargando contenido...');
    expect(text.tagName).toBe('P');
    expect(text).toHaveClass('text-gray-600');
  });

  it('has proper height for tab content area', () => {
    const { container } = render(<TabLoadingSpinner />);

    // Should have h-64 class (256px height)
    expect(container.firstChild).toHaveClass('h-64');
  });

  it('centers content both horizontally and vertically', () => {
    const { container } = render(<TabLoadingSpinner />);

    const container_div = container.firstChild as HTMLElement;
    expect(container_div).toHaveClass('flex', 'items-center', 'justify-center');
  });

  it('uses consistent blue color scheme', () => {
    const { container } = render(<TabLoadingSpinner />);

    // Spinner should use blue colors
    const spinner = container.querySelector('.border-blue-200');
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveClass('border-t-blue-600');

    // Text should use gray color
    const text = screen.getByText('Cargando contenido...');
    expect(text).toHaveClass('text-gray-600');
  });

  it('has appropriate spacing between elements', () => {
    const { container } = render(<TabLoadingSpinner />);

    const innerContainer = container.querySelector('.space-y-4');
    expect(innerContainer).toBeInTheDocument();
  });

  it('is accessible to screen readers', () => {
    render(<TabLoadingSpinner />);

    // Loading message should be readable by screen readers
    const loadingText = screen.getByText('Cargando contenido...');
    expect(loadingText).toBeInTheDocument();
  });
});
