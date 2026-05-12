import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { TabNavigation } from './TabNavigation';

describe('TabNavigation', () => {
  const mockTabs = [
    { id: 'semanal', label: 'Semanal' },
    { id: 'overtime', label: 'Horas Extras' },
  ];

  describe('Rendering', () => {
    it('renders all tabs', () => {
      render(<TabNavigation tabs={mockTabs} activeTab="semanal" onChange={vi.fn()} />);
      expect(screen.getByRole('tab', { name: 'Semanal' })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: 'Horas Extras' })).toBeInTheDocument();
    });

    it('renders correct number of tabs', () => {
      render(<TabNavigation tabs={mockTabs} activeTab="semanal" onChange={vi.fn()} />);
      const tabs = screen.getAllByRole('tab');
      expect(tabs).toHaveLength(2);
    });

    it('renders tab labels correctly', () => {
      render(<TabNavigation tabs={mockTabs} activeTab="semanal" onChange={vi.fn()} />);
      expect(screen.getByText('Semanal')).toBeInTheDocument();
      expect(screen.getByText('Horas Extras')).toBeInTheDocument();
    });
  });

  describe('Active State', () => {
    it('marks active tab with aria-selected true', () => {
      render(<TabNavigation tabs={mockTabs} activeTab="semanal" onChange={vi.fn()} />);
      const activeTab = screen.getByRole('tab', { name: 'Semanal' });
      expect(activeTab).toHaveAttribute('aria-selected', 'true');
    });

    it('marks inactive tab with aria-selected false', () => {
      render(<TabNavigation tabs={mockTabs} activeTab="semanal" onChange={vi.fn()} />);
      const inactiveTab = screen.getByRole('tab', { name: 'Horas Extras' });
      expect(inactiveTab).toHaveAttribute('aria-selected', 'false');
    });

    it('applies active styling to active tab', () => {
      render(<TabNavigation tabs={mockTabs} activeTab="semanal" onChange={vi.fn()} />);
      const activeTab = screen.getByRole('tab', { name: 'Semanal' });
      expect(activeTab).toHaveClass('border-b-2', 'border-emerald-500', 'text-emerald-600');
    });

    it('applies inactive styling to inactive tab', () => {
      render(<TabNavigation tabs={mockTabs} activeTab="semanal" onChange={vi.fn()} />);
      const inactiveTab = screen.getByRole('tab', { name: 'Horas Extras' });
      expect(inactiveTab).toHaveClass('text-zinc-500');
    });
  });

  describe('Interaction', () => {
    it('calls onChange when tab is clicked', () => {
      const handleChange = vi.fn();
      render(<TabNavigation tabs={mockTabs} activeTab="semanal" onChange={handleChange} />);
      fireEvent.click(screen.getByRole('tab', { name: 'Horas Extras' }));
      expect(handleChange).toHaveBeenCalledWith('overtime');
    });

    it('prevents default link behavior', () => {
      const handleChange = vi.fn();
      render(<TabNavigation tabs={mockTabs} activeTab="semanal" onChange={handleChange} />);
      const tab = screen.getByRole('tab', { name: 'Horas Extras' });
      fireEvent.click(tab);
      expect(handleChange).toHaveBeenCalledWith('overtime');
      expect(tab.getAttribute('href')).toBe('#');
    });
  });

  describe('Keyboard Navigation', () => {
    it('moves to next tab on ArrowRight', () => {
      const handleChange = vi.fn();
      render(<TabNavigation tabs={mockTabs} activeTab="semanal" onChange={handleChange} />);
      const activeTab = screen.getByRole('tab', { name: 'Semanal' });
      activeTab.focus();
      fireEvent.keyDown(activeTab, { key: 'ArrowRight' });
      expect(handleChange).toHaveBeenCalledWith('overtime');
    });

    it('moves to previous tab on ArrowLeft', () => {
      const handleChange = vi.fn();
      render(<TabNavigation tabs={mockTabs} activeTab="overtime" onChange={handleChange} />);
      const activeTab = screen.getByRole('tab', { name: 'Horas Extras' });
      activeTab.focus();
      fireEvent.keyDown(activeTab, { key: 'ArrowLeft' });
      expect(handleChange).toHaveBeenCalledWith('semanal');
    });

    it('wraps to first tab on ArrowRight at end', () => {
      const handleChange = vi.fn();
      render(<TabNavigation tabs={mockTabs} activeTab="overtime" onChange={handleChange} />);
      const activeTab = screen.getByRole('tab', { name: 'Horas Extras' });
      activeTab.focus();
      fireEvent.keyDown(activeTab, { key: 'ArrowRight' });
      expect(handleChange).toHaveBeenCalledWith('semanal');
    });

    it('wraps to last tab on ArrowLeft at start', () => {
      const handleChange = vi.fn();
      render(<TabNavigation tabs={mockTabs} activeTab="semanal" onChange={handleChange} />);
      const activeTab = screen.getByRole('tab', { name: 'Semanal' });
      activeTab.focus();
      fireEvent.keyDown(activeTab, { key: 'ArrowLeft' });
      expect(handleChange).toHaveBeenCalledWith('overtime');
    });

    it('moves to first tab on Home', () => {
      const handleChange = vi.fn();
      render(<TabNavigation tabs={mockTabs} activeTab="overtime" onChange={handleChange} />);
      const activeTab = screen.getByRole('tab', { name: 'Horas Extras' });
      activeTab.focus();
      fireEvent.keyDown(activeTab, { key: 'Home' });
      expect(handleChange).toHaveBeenCalledWith('semanal');
    });

    it('moves to last tab on End', () => {
      const handleChange = vi.fn();
      render(<TabNavigation tabs={mockTabs} activeTab="semanal" onChange={handleChange} />);
      const activeTab = screen.getByRole('tab', { name: 'Semanal' });
      activeTab.focus();
      fireEvent.keyDown(activeTab, { key: 'End' });
      expect(handleChange).toHaveBeenCalledWith('overtime');
    });

    it('does not call onChange for unrelated keys', () => {
      const handleChange = vi.fn();
      render(<TabNavigation tabs={mockTabs} activeTab="semanal" onChange={handleChange} />);
      const activeTab = screen.getByRole('tab', { name: 'Semanal' });
      activeTab.focus();
      fireEvent.keyDown(activeTab, { key: 'Enter' });
      expect(handleChange).not.toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('has role="tablist" on container', () => {
      render(<TabNavigation tabs={mockTabs} activeTab="semanal" onChange={vi.fn()} />);
      expect(screen.getByRole('tablist')).toBeInTheDocument();
    });

    it('has role="tab" on each tab', () => {
      render(<TabNavigation tabs={mockTabs} activeTab="semanal" onChange={vi.fn()} />);
      const tabs = screen.getAllByRole('tab');
      tabs.forEach((tab) => {
        expect(tab).toBeInTheDocument();
      });
    });

    it('sets tabIndex 0 on active tab', () => {
      render(<TabNavigation tabs={mockTabs} activeTab="semanal" onChange={vi.fn()} />);
      const activeTab = screen.getByRole('tab', { name: 'Semanal' });
      expect(activeTab).toHaveAttribute('tabIndex', '0');
    });

    it('sets tabIndex -1 on inactive tab', () => {
      render(<TabNavigation tabs={mockTabs} activeTab="semanal" onChange={vi.fn()} />);
      const inactiveTab = screen.getByRole('tab', { name: 'Horas Extras' });
      expect(inactiveTab).toHaveAttribute('tabIndex', '-1');
    });
  });

  describe('Dark Mode', () => {
    it('applies dark mode classes to active tab', () => {
      render(<TabNavigation tabs={mockTabs} activeTab="semanal" onChange={vi.fn()} />);
      const activeTab = screen.getByRole('tab', { name: 'Semanal' });
      expect(activeTab).toHaveClass('dark:text-emerald-400');
    });

    it('applies dark mode classes to inactive tab', () => {
      render(<TabNavigation tabs={mockTabs} activeTab="semanal" onChange={vi.fn()} />);
      const inactiveTab = screen.getByRole('tab', { name: 'Horas Extras' });
      expect(inactiveTab).toHaveClass('dark:text-zinc-400', 'dark:hover:text-zinc-200');
    });

    it('applies border-dark class for tablist border', () => {
      render(<TabNavigation tabs={mockTabs} activeTab="semanal" onChange={vi.fn()} />);
      const tabList = screen.getByRole('tablist');
      expect(tabList).toHaveClass('dark:border-zinc-800');
    });
  });

  describe('Edge Cases', () => {
    it('handles single tab', () => {
      const singleTab = [{ id: 'only', label: 'Only Tab' }];
      render(<TabNavigation tabs={singleTab} activeTab="only" onChange={vi.fn()} />);
      expect(screen.getByRole('tab', { name: 'Only Tab' })).toBeInTheDocument();
    });

    it('handles empty tabs array', () => {
      render(<TabNavigation tabs={[]} activeTab="" onChange={vi.fn()} />);
      const tabList = screen.getByRole('tablist');
      expect(tabList).toBeInTheDocument();
      expect(tabList.children).toHaveLength(0);
    });

    it('handles href on tabs when provided', () => {
      const tabsWithHref = [
        { id: 'tab1', label: 'Tab 1', href: '/reports/weekly' },
        { id: 'tab2', label: 'Tab 2', href: '/reports/overtime' },
      ];
      render(<TabNavigation tabs={tabsWithHref} activeTab="tab1" onChange={vi.fn()} />);
      const tab = screen.getByRole('tab', { name: 'Tab 1' });
      expect(tab).toHaveAttribute('href', '/reports/weekly');
    });
  });
});