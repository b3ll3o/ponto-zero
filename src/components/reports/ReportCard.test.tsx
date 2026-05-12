import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { ReportCard } from './ReportCard';

describe('ReportCard', () => {
  describe('Rendering', () => {
    it('renders title and value correctly', () => {
      render(<ReportCard title="Horas Trabalhadas" value="40h" />);
      expect(screen.getByText('Horas Trabalhadas')).toBeInTheDocument();
      expect(screen.getByText('40h')).toBeInTheDocument();
    });

    it('renders subtitle when provided', () => {
      render(<ReportCard title="Horas Extras" value="8h" subtitle="Esta semana" />);
      expect(screen.getByText('Esta semana')).toBeInTheDocument();
    });

    it('renders icon when provided', () => {
      const icon = <svg data-testid="test-icon" />;
      render(<ReportCard title="Test" value="10" icon={icon} />);
      expect(screen.getByTestId('test-icon')).toBeInTheDocument();
    });
  });

  describe('Variants', () => {
    it('renders default variant correctly', () => {
      const { container } = render(<ReportCard title="Default" value="100" variant="default" />);
      const card = container.firstChild;
      expect(card).toHaveClass('bg-white', 'dark:bg-zinc-900');
      expect(card).toHaveClass('border', 'border-zinc-200', 'dark:border-zinc-800');
    });

    it('renders highlight variant correctly', () => {
      const { container } = render(<ReportCard title="Highlight" value="100" variant="highlight" />);
      const card = container.firstChild;
      expect(card).toHaveClass('bg-gradient-to-br', 'from-emerald-50', 'to-white');
      expect(card).toHaveClass('dark:from-emerald-950/40', 'dark:to-zinc-900');
      expect(card).toHaveClass('border-emerald-200', 'dark:border-emerald-800');
    });

    it('renders compact variant correctly', () => {
      render(<ReportCard title="Compact" value="50" variant="compact" />);
      const value = screen.getByText('50');
      expect(value).toHaveClass('text-lg', 'font-bold', 'text-zinc-900', 'dark:text-zinc-50');
    });
  });

  describe('Trend Indicator', () => {
    it('renders up trend correctly', () => {
      render(<ReportCard title="Test" value="10" trend="up" />);
      const svg = document.querySelector('svg');
      expect(svg?.innerHTML).toContain('M13 7h8m0 0v8m0-8l-8 8-4-4-6 6');
    });

    it('renders down trend correctly', () => {
      render(<ReportCard title="Test" value="10" trend="down" />);
      const svg = document.querySelector('svg');
      expect(svg?.innerHTML).toContain('M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6');
    });

    it('renders neutral trend correctly', () => {
      render(<ReportCard title="Test" value="10" trend="neutral" />);
      const svg = document.querySelector('svg');
      expect(svg?.innerHTML).toContain('M20 12H4');
    });
  });

  describe('Loading State', () => {
    it('renders skeleton when loading is true', () => {
      const { container } = render(<ReportCard title="Test" value="10" loading={true} />);
      const skeleton = container.querySelector('.animate-pulse');
      expect(skeleton).toBeInTheDocument();
    });

    it('does not render content when loading', () => {
      render(<ReportCard title="Horas Trabalhadas" value="40h" loading={true} />);
      expect(screen.queryByText('Horas Trabalhadas')).not.toBeInTheDocument();
      expect(screen.queryByText('40h')).not.toBeInTheDocument();
    });
  });

  describe('Error State', () => {
    it('renders error state correctly', () => {
      render(<ReportCard title="Test" value="10" error={true} />);
      expect(screen.getByText('Erro ao carregar')).toBeInTheDocument();
    });

    it('renders retry button in error state', () => {
      const onRetry = vi.fn();
      render(<ReportCard title="Test" value="10" error={true} onRetry={onRetry} />);
      expect(screen.getByText('Tentar novamente')).toBeInTheDocument();
    });

    it('does not render title/value when in error state', () => {
      render(<ReportCard title="Horas Trabalhadas" value="40h" error={true} />);
      expect(screen.queryByText('Horas Trabalhadas')).not.toBeInTheDocument();
      expect(screen.queryByText('40h')).not.toBeInTheDocument();
    });
  });

  describe('Dark Mode Classes', () => {
    it('applies dark mode classes to default variant', () => {
      const { container } = render(<ReportCard title="Test" value="10" variant="default" />);
      const card = container.firstChild;
      expect(card).toHaveClass('dark:bg-zinc-900');
      expect(card).toHaveClass('dark:border-zinc-800');
    });

    it('applies dark mode classes to highlight variant', () => {
      const { container } = render(<ReportCard title="Test" value="10" variant="highlight" />);
      const card = container.firstChild;
      expect(card).toHaveClass('dark:from-emerald-950/40');
      expect(card).toHaveClass('dark:to-zinc-900');
      expect(card).toHaveClass('dark:border-emerald-800');
    });

    it('applies dark mode classes to value text', () => {
      render(<ReportCard title="Test" value="10" />);
      const value = screen.getByText('10');
      expect(value).toHaveClass('dark:text-zinc-50');
    });
  });

  describe('Interactive', () => {
    it('retry button is clickable', () => {
      const handleRetry = vi.fn();
      render(
        <ReportCard
          title="Test"
          value="10"
          error={true}
          onRetry={handleRetry}
        />
      );
      const retryButton = screen.getByText('Tentar novamente').closest('button');
      if (retryButton) {
        fireEvent.click(retryButton);
      }
      expect(handleRetry).toHaveBeenCalledTimes(1);
    });
  });
});
