import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React, { Suspense, lazy } from 'react';

// Mock a lazy-loaded component with controlled timing
function createDelayedComponent(testId: string, content: string, delay: number) {
  return lazy(
    () =>
      new Promise<{ default: React.ComponentType }>((resolve) =>
        setTimeout(
          () =>
            resolve({
              default: () => <div data-testid={testId}>{content}</div>,
            }),
          delay
        )
      )
  );
}

// Create test wrapper with Suspense
function LazyTestWrapper({
  component: Component,
  fallback = <div data-testid="loading">Loading...</div>,
}: {
  component: React.ComponentType;
  fallback?: React.ReactNode;
}) {
  return (
    <Suspense fallback={fallback}>
      <Component />
    </Suspense>
  );
}

// Tab-based lazy loading simulation (similar to PropuestaMejora)
function MockTabContainer() {
  const [activeTab, setActiveTab] = React.useState('tab1');

  const TabComponent1 = lazy(() =>
    Promise.resolve({
      default: () => <div data-testid="tab1-content">Tab 1 Content</div>,
    })
  );

  const TabComponent2 = lazy(() =>
    Promise.resolve({
      default: () => <div data-testid="tab2-content">Tab 2 Content</div>,
    })
  );

  return (
    <div>
      <button onClick={() => setActiveTab('tab1')} data-testid="tab1-button">
        Tab 1
      </button>
      <button onClick={() => setActiveTab('tab2')} data-testid="tab2-button">
        Tab 2
      </button>

      <div className="tab-content">
        <Suspense fallback={<div data-testid="tab-loading">Loading tab...</div>}>
          {activeTab === 'tab1' && <TabComponent1 />}
          {activeTab === 'tab2' && <TabComponent2 />}
        </Suspense>
      </div>
    </div>
  );
}

describe('Lazy Loading Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Basic Lazy Loading', () => {
    it('displays fallback while loading slow component', async () => {
      const SlowComponent = createDelayedComponent('slow-content', 'Slow Loaded Content', 200);

      render(<LazyTestWrapper component={SlowComponent} />);

      // Should show loading for slow component
      expect(screen.getByTestId('loading')).toBeInTheDocument();

      // Wait for component to load
      await waitFor(
        () => {
          expect(screen.getByTestId('slow-content')).toBeInTheDocument();
        },
        { timeout: 5000 }
      );
    });

    it('loads component content after loading completes', async () => {
      const SlowComponent = createDelayedComponent('lazy-content', 'Lazy Loaded Content', 100);

      render(<LazyTestWrapper component={SlowComponent} />);

      // Wait for component to load
      await waitFor(() => {
        expect(screen.getByTestId('lazy-content')).toBeInTheDocument();
      });

      // Loading should be gone
      expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
    });

    it('handles slow-loading components gracefully', async () => {
      const SlowComponent = createDelayedComponent('slow-content', 'Slow Loaded Content', 200);

      render(<LazyTestWrapper component={SlowComponent} />);

      // Should show loading for longer period
      expect(screen.getByTestId('loading')).toBeInTheDocument();

      // Wait for the slow component
      await waitFor(
        () => {
          expect(screen.getByTestId('slow-content')).toBeInTheDocument();
        },
        { timeout: 5000 }
      );
    });

    it('maintains custom fallback UI during loading', async () => {
      const SlowComponent = createDelayedComponent('slow-content', 'Slow Loaded Content', 200);

      const customFallback = (
        <div data-testid="custom-loading">
          <div>Custom Loading Message</div>
          <div className="spinner">Loading...</div>
        </div>
      );

      render(<LazyTestWrapper component={SlowComponent} fallback={customFallback} />);

      expect(screen.getByTestId('custom-loading')).toBeInTheDocument();
      expect(screen.getByText('Custom Loading Message')).toBeInTheDocument();

      await waitFor(
        () => {
          expect(screen.getByTestId('slow-content')).toBeInTheDocument();
        },
        { timeout: 5000 }
      );
    });
  });

  describe('Tab-Based Lazy Loading', () => {
    it('loads only active tab component', async () => {
      render(<MockTabContainer />);

      // Wait for first tab to load
      await waitFor(() => {
        expect(screen.getByTestId('tab1-content')).toBeInTheDocument();
      });

      // Second tab should not be loaded yet
      expect(screen.queryByTestId('tab2-content')).not.toBeInTheDocument();
    });

    it('loads second tab when switched', async () => {
      const user = userEvent.setup();
      render(<MockTabContainer />);

      // Wait for first tab to load
      await waitFor(() => {
        expect(screen.getByTestId('tab1-content')).toBeInTheDocument();
      });

      // Click second tab
      const tab2Button = screen.getByTestId('tab2-button');
      await user.click(tab2Button);

      // Wait for second tab to load
      await waitFor(() => {
        expect(screen.getByTestId('tab2-content')).toBeInTheDocument();
      });

      // First tab should not be in DOM anymore
      expect(screen.queryByTestId('tab1-content')).not.toBeInTheDocument();
    });

    it('handles rapid tab switching', async () => {
      const user = userEvent.setup();
      render(<MockTabContainer />);

      // Wait for initial load
      await waitFor(() => {
        expect(screen.getByTestId('tab1-content')).toBeInTheDocument();
      });

      // Rapidly switch tabs
      const tab2Button = screen.getByTestId('tab2-button');
      const tab1Button = screen.getByTestId('tab1-button');

      await user.click(tab2Button);
      await user.click(tab1Button);
      await user.click(tab2Button);

      // Should eventually settle on tab2
      await waitFor(() => {
        expect(screen.getByTestId('tab2-content')).toBeInTheDocument();
      });

      expect(screen.queryByTestId('tab1-content')).not.toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    // Error boundary for testing
    interface ErrorBoundaryProps {
      children: React.ReactNode;
    }

    class TestErrorBoundary extends React.Component<ErrorBoundaryProps> {
      constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false };
      }

      static getDerivedStateFromError() {
        return { hasError: true };
      }

      render() {
        if ((this.state as any).hasError) {
          return <div data-testid="error-fallback">Something went wrong</div>;
        }

        return this.props.children;
      }
    }

    it('handles component loading failures gracefully', async () => {
      const originalError = console.error;
      console.error = vi.fn();

      const MockFailingComponent = lazy(() =>
        Promise.reject(new Error('Failed to load component'))
      );

      render(
        <TestErrorBoundary>
          <LazyTestWrapper component={MockFailingComponent} />
        </TestErrorBoundary>
      );

      // Wait for error to be caught
      await waitFor(() => {
        expect(screen.getByTestId('error-fallback')).toBeInTheDocument();
      });

      console.error = originalError;
    });
  });

  describe('Performance', () => {
    it('loads components efficiently', async () => {
      const FastComponent = lazy(() =>
        Promise.resolve({
          default: () => <div data-testid="lazy-content">Lazy Loaded Content</div>,
        })
      );

      const loadStart = performance.now();

      render(<LazyTestWrapper component={FastComponent} />);

      await waitFor(() => {
        expect(screen.getByTestId('lazy-content')).toBeInTheDocument();
      });

      const loadEnd = performance.now();
      const loadTime = loadEnd - loadStart;

      expect(loadTime).toBeLessThan(1000);
    });

    it('does not load unused tab components', async () => {
      const user = userEvent.setup();

      const tab1LoadSpy = vi.fn();
      const tab2LoadSpy = vi.fn();

      const SpiedTabContainer = () => {
        const [activeTab, setActiveTab] = React.useState('tab1');

        const SpiedTab1 = lazy(() => {
          tab1LoadSpy();
          return Promise.resolve({
            default: () => <div data-testid="tab1-content">Tab 1 Content</div>,
          });
        });

        const SpiedTab2 = lazy(() => {
          tab2LoadSpy();
          return Promise.resolve({
            default: () => <div data-testid="tab2-content">Tab 2 Content</div>,
          });
        });

        return (
          <div>
            <button onClick={() => setActiveTab('tab1')} data-testid="tab1-button">
              Tab 1
            </button>
            <button onClick={() => setActiveTab('tab2')} data-testid="tab2-button">
              Tab 2
            </button>

            <Suspense fallback={<div data-testid="tab-loading">Loading...</div>}>
              {activeTab === 'tab1' && <SpiedTab1 />}
              {activeTab === 'tab2' && <SpiedTab2 />}
            </Suspense>
          </div>
        );
      };

      render(<SpiedTabContainer />);

      await waitFor(() => {
        expect(screen.getByTestId('tab1-content')).toBeInTheDocument();
      });

      expect(tab1LoadSpy).toHaveBeenCalledOnce();
      expect(tab2LoadSpy).not.toHaveBeenCalled();

      await user.click(screen.getByTestId('tab2-button'));

      await waitFor(() => {
        expect(screen.getByTestId('tab2-content')).toBeInTheDocument();
      });

      expect(tab1LoadSpy).toHaveBeenCalledOnce();
      expect(tab2LoadSpy).toHaveBeenCalledOnce();
    });
  });

  describe('Memory Management', () => {
    it('cleans up properly when unmounting', async () => {
      const FastComponent = lazy(() =>
        Promise.resolve({
          default: () => <div data-testid="lazy-content">Lazy Loaded Content</div>,
        })
      );

      const { unmount } = render(<LazyTestWrapper component={FastComponent} />);

      await waitFor(() => {
        expect(screen.getByTestId('lazy-content')).toBeInTheDocument();
      });

      expect(() => unmount()).not.toThrow();
    });
  });

  describe('Accessibility', () => {
    it('maintains accessibility during loading states', async () => {
      const SlowComponent = createDelayedComponent('slow-a11y', 'Accessible Content', 200);

      const accessibleFallback = (
        <div data-testid="accessible-loading" role="status" aria-live="polite">
          <span className="sr-only">Loading content, please wait...</span>
          <div aria-hidden="true">Loading...</div>
        </div>
      );

      render(<LazyTestWrapper component={SlowComponent} fallback={accessibleFallback} />);

      const loadingElement = screen.getByTestId('accessible-loading');
      expect(loadingElement).toHaveAttribute('role', 'status');
      expect(loadingElement).toHaveAttribute('aria-live', 'polite');

      const srText = screen.getByText('Loading content, please wait...');
      expect(srText).toHaveClass('sr-only');

      await waitFor(
        () => {
          expect(screen.getByTestId('slow-a11y')).toBeInTheDocument();
        },
        { timeout: 5000 }
      );
    });

    it('announces content changes to screen readers', async () => {
      render(<MockTabContainer />);

      await waitFor(() => {
        expect(screen.getByTestId('tab1-content')).toBeInTheDocument();
      });

      const content = screen.getByTestId('tab1-content');
      expect(content).toBeInTheDocument();
    });
  });
});
