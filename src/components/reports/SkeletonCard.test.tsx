import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import { SkeletonCard } from './SkeletonCard';

describe('SkeletonCard', () => {
  describe('Rendering', () => {
    it('renders correctly with default variant', () => {
      const { container } = render(<SkeletonCard variant="default" />);
      const skeleton = container.firstChild;
      expect(skeleton).toBeInTheDocument();
      expect(skeleton).toHaveClass('animate-pulse');
      expect(skeleton).toHaveClass('rounded-lg');
      expect(skeleton).toHaveClass('bg-zinc-200', 'dark:bg-zinc-800');
    });

    it('renders correctly with highlight variant', () => {
      const { container } = render(<SkeletonCard variant="highlight" />);
      const skeleton = container.firstChild;
      expect(skeleton).toBeInTheDocument();
      expect(skeleton).toHaveClass('animate-pulse');
      expect(skeleton).toHaveClass('rounded-lg');
      expect(skeleton).toHaveClass('bg-gradient-to-br', 'from-zinc-200', 'to-zinc-100');
      expect(skeleton).toHaveClass('dark:from-zinc-800', 'dark:to-zinc-900');
    });

    it('renders correctly with compact variant', () => {
      const { container } = render(<SkeletonCard variant="compact" />);
      const skeleton = container.firstChild;
      expect(skeleton).toBeInTheDocument();
      expect(skeleton).toHaveClass('flex', 'items-center', 'gap-3');
    });
  });

  describe('Dark Mode', () => {
    it('applies dark mode classes to default variant', () => {
      const { container } = render(<SkeletonCard variant="default" />);
      const skeleton = container.firstChild;
      expect(skeleton).toHaveClass('dark:bg-zinc-800');
    });

    it('applies dark mode classes to highlight variant', () => {
      const { container } = render(<SkeletonCard variant="highlight" />);
      const skeleton = container.firstChild;
      expect(skeleton).toHaveClass('dark:from-zinc-800');
      expect(skeleton).toHaveClass('dark:to-zinc-900');
    });

    it('applies dark mode classes to compact variant pulse elements', () => {
      const { container } = render(<SkeletonCard variant="compact" />);
      const skeleton = container.firstChild;
      const pulseDivs = (skeleton as Element)?.querySelectorAll('.animate-pulse');
      pulseDivs?.forEach((div: Element) => {
        expect(div).toHaveClass('dark:bg-zinc-800');
      });
    });
  });

  describe('Animation', () => {
    it('has animate-pulse class on default variant', () => {
      const { container } = render(<SkeletonCard variant="default" />);
      const skeleton = container.firstChild;
      expect(skeleton).toHaveClass('animate-pulse');
    });

    it('has animate-pulse class on highlight variant', () => {
      const { container } = render(<SkeletonCard variant="highlight" />);
      const skeleton = container.firstChild;
      expect(skeleton).toHaveClass('animate-pulse');
    });

    it('has animate-pulse class on compact variant', () => {
      const { container } = render(<SkeletonCard variant="compact" />);
      const skeleton = container.firstChild;
      const pulseDivs = (skeleton as Element)?.querySelectorAll('.animate-pulse');
      expect(pulseDivs?.length).toBeGreaterThan(0);
    });
  });

  describe('Default Props', () => {
    it('renders with default variant when no variant prop is provided', () => {
      const { container } = render(<SkeletonCard />);
      const skeleton = container.firstChild;
      expect(skeleton).toHaveClass('bg-zinc-200', 'dark:bg-zinc-800');
      expect(skeleton).toHaveClass('p-4');
    });
  });
});