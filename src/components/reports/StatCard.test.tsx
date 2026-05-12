import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { StatCard } from './StatCard';

describe('StatCard', () => {
  describe('Rendering', () => {
    it('renders label and value correctly', () => {
      render(<StatCard label="Horas Trabalhadas" value="40h" />);
      expect(screen.getByText('Horas Trabalhadas')).toBeInTheDocument();
      expect(screen.getByText('40h')).toBeInTheDocument();
    });

    it('renders unit when provided', () => {
      render(<StatCard label="Horas Extras" value="8" unit="h" />);
      expect(screen.getByText('8')).toBeInTheDocument();
      expect(screen.getByText('h')).toBeInTheDocument();
    });

    it('does not render unit when not provided', () => {
      render(<StatCard label="Total" value="100" />);
      const unitElements = screen.queryAllByText('h');
      expect(unitElements.length).toBe(0);
    });
  });

  describe('Variants', () => {
    it('renders positive variant correctly', () => {
      render(<StatCard label="Test" value="10" variant="positive" />);
      const value = screen.getByText('10');
      expect(value).toHaveClass('text-emerald-600');
      expect(value).toHaveClass('dark:text-emerald-400');
    });

    it('renders negative variant correctly', () => {
      render(<StatCard label="Test" value="10" variant="negative" />);
      const value = screen.getByText('10');
      expect(value).toHaveClass('text-red-600');
      expect(value).toHaveClass('dark:text-red-400');
    });

    it('renders neutral variant correctly', () => {
      render(<StatCard label="Test" value="10" variant="neutral" />);
      const value = screen.getByText('10');
      expect(value).toHaveClass('text-zinc-600');
      expect(value).toHaveClass('dark:text-zinc-400');
    });

    it('defaults to neutral variant', () => {
      render(<StatCard label="Test" value="10" />);
      const value = screen.getByText('10');
      expect(value).toHaveClass('text-zinc-600');
      expect(value).toHaveClass('dark:text-zinc-400');
    });
  });

  describe('Typography', () => {
    it('applies correct font size to label', () => {
      render(<StatCard label="Test Label" value="10" />);
      const label = screen.getByText('Test Label');
      expect(label).toHaveClass('text-sm');
    });

    it('applies correct font size and weight to value', () => {
      render(<StatCard label="Test" value="50" />);
      const value = screen.getByText('50');
      expect(value).toHaveClass('text-lg', 'font-bold');
    });
  });

  describe('Dark Mode', () => {
    it('applies dark mode classes to positive variant', () => {
      render(<StatCard label="Test" value="10" variant="positive" />);
      const value = screen.getByText('10');
      expect(value).toHaveClass('dark:text-emerald-400');
    });

    it('applies dark mode classes to negative variant', () => {
      render(<StatCard label="Test" value="10" variant="negative" />);
      const value = screen.getByText('10');
      expect(value).toHaveClass('dark:text-red-400');
    });

    it('applies dark mode classes to neutral variant', () => {
      render(<StatCard label="Test" value="10" variant="neutral" />);
      const value = screen.getByText('10');
      expect(value).toHaveClass('dark:text-zinc-400');
    });
  });
});
