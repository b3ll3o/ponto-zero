import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { Toast } from './Toast';

describe('Toast', () => {
  const defaultProps = {
    id: 'test-toast',
    type: 'info' as const,
    message: 'Test message',
    onDismiss: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders with correct message', () => {
      render(<Toast {...defaultProps} />);
      expect(screen.getByText('Test message')).toBeInTheDocument();
    });

    it('renders success toast with correct styling', () => {
      render(<Toast {...defaultProps} type="success" />);
      const toast = screen.getByRole('alert');
      expect(toast).toHaveClass('bg-green-50', 'border-green-200');
      expect(toast).toHaveClass('dark:bg-green-900', 'dark:border-green-700');
    });

    it('renders error toast with correct styling', () => {
      render(<Toast {...defaultProps} type="error" />);
      const toast = screen.getByRole('alert');
      expect(toast).toHaveClass('bg-red-50', 'border-red-200');
      expect(toast).toHaveClass('dark:bg-red-900', 'dark:border-red-700');
    });

    it('renders warning toast with correct styling', () => {
      render(<Toast {...defaultProps} type="warning" />);
      const toast = screen.getByRole('alert');
      expect(toast).toHaveClass('bg-amber-50', 'border-amber-200');
      expect(toast).toHaveClass('dark:bg-amber-900', 'dark:border-amber-700');
    });

    it('renders info toast with correct styling', () => {
      render(<Toast {...defaultProps} type="info" />);
      const toast = screen.getByRole('alert');
      expect(toast).toHaveClass('bg-blue-50', 'border-blue-200');
      expect(toast).toHaveClass('dark:bg-blue-900', 'dark:border-blue-700');
    });
  });

  describe('Icons', () => {
    it('renders check icon for success', () => {
      render(<Toast {...defaultProps} type="success" />);
      const icon = screen.getByRole('alert').querySelector('svg');
      expect(icon).toBeInTheDocument();
    });

    it('renders X icon for error', () => {
      render(<Toast {...defaultProps} type="error" />);
      const icon = screen.getByRole('alert').querySelector('svg');
      expect(icon).toBeInTheDocument();
    });

    it('renders exclamation icon for warning', () => {
      render(<Toast {...defaultProps} type="warning" />);
      const icon = screen.getByRole('alert').querySelector('svg');
      expect(icon).toBeInTheDocument();
    });

    it('renders info icon for info', () => {
      render(<Toast {...defaultProps} type="info" />);
      const icon = screen.getByRole('alert').querySelector('svg');
      expect(icon).toBeInTheDocument();
    });
  });

  describe('Dismiss', () => {
    it('calls onDismiss when dismiss button is clicked', () => {
      render(<Toast {...defaultProps} />);
      const dismissButton = screen.getByRole('button', { name: 'Dismiss' });
      fireEvent.click(dismissButton);
      expect(defaultProps.onDismiss).toHaveBeenCalledWith('test-toast');
    });

    it('dismisses after default duration of 3 seconds', async () => {
      vi.useFakeTimers();
      render(<Toast {...defaultProps} duration={3000} />);
      
      expect(defaultProps.onDismiss).not.toHaveBeenCalled();
      
      vi.advanceTimersByTime(3000);
      
      expect(defaultProps.onDismiss).toHaveBeenCalledWith('test-toast');
      vi.useRealTimers();
    });

    it('dismisses after custom duration', async () => {
      vi.useFakeTimers();
      render(<Toast {...defaultProps} duration={5000} />);
      
      vi.advanceTimersByTime(5000);
      
      expect(defaultProps.onDismiss).toHaveBeenCalledWith('test-toast');
      vi.useRealTimers();
    });

    it('does not auto-dismiss when duration is 0', async () => {
      vi.useFakeTimers();
      render(<Toast {...defaultProps} duration={0} />);
      
      vi.advanceTimersByTime(10000);
      
      expect(defaultProps.onDismiss).not.toHaveBeenCalled();
      vi.useRealTimers();
    });

    it('clears timer on unmount', async () => {
      vi.useFakeTimers();
      const { unmount } = render(<Toast {...defaultProps} duration={5000} />);
      
      unmount();
      
      vi.advanceTimersByTime(5000);
      expect(defaultProps.onDismiss).not.toHaveBeenCalled();
      vi.useRealTimers();
    });
  });

  describe('Action button', () => {
    it('renders action button when provided', () => {
      const action = { label: 'Undo', onClick: vi.fn() };
      render(<Toast {...defaultProps} action={action} />);
      expect(screen.getByText('Undo')).toBeInTheDocument();
    });

    it('calls action.onClick when action button is clicked', () => {
      const action = { label: 'Undo', onClick: vi.fn() };
      render(<Toast {...defaultProps} action={action} />);
      fireEvent.click(screen.getByText('Undo'));
      expect(action.onClick).toHaveBeenCalled();
    });

    it('does not render action button when not provided', () => {
      render(<Toast {...defaultProps} />);
      expect(screen.queryByRole('button', { name: 'Undo' })).not.toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has role alert', () => {
      render(<Toast {...defaultProps} />);
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('has aria-live polite', () => {
      render(<Toast {...defaultProps} />);
      expect(screen.getByRole('alert')).toHaveAttribute('aria-live', 'polite');
    });

    it('dismiss button has aria-label', () => {
      render(<Toast {...defaultProps} />);
      expect(screen.getByRole('button', { name: 'Dismiss' })).toBeInTheDocument();
    });
  });

  describe('Animation', () => {
    it('has slide-in animation class', () => {
      render(<Toast {...defaultProps} />);
      const toast = screen.getByRole('alert');
      expect(toast).toHaveClass('animate-slide-in');
    });
  });
});
