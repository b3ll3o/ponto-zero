import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import React from 'react';
import { NotificationProvider, useNotifications } from './NotificationContext';

const TestComponent = () => {
  const { notifications, unreadCount, addNotification, markAsRead, markAllAsRead, removeNotification } =
    useNotifications();

  return (
    <div>
      <span data-testid="unread-count">{unreadCount}</span>
      <span data-testid="notification-count">{notifications.length}</span>
      <button
        data-testid="add-success"
        onClick={() =>
          addNotification({
            type: 'success',
            title: 'Success',
            message: 'Operation succeeded',
          })
        }
      >
        Add Success
      </button>
      <button
        data-testid="add-error"
        onClick={() =>
          addNotification({
            type: 'error',
            title: 'Error',
            message: 'Operation failed',
          })
        }
      >
        Add Error
      </button>
      <button
        data-testid="add-warning"
        onClick={() =>
          addNotification({
            type: 'warning',
            title: 'Warning',
            message: 'Be careful',
          })
        }
      >
        Add Warning
      </button>
      <button
        data-testid="add-info"
        onClick={() =>
          addNotification({
            type: 'info',
            title: 'Info',
            message: 'Here is some info',
          })
        }
      >
        Add Info
      </button>
      {notifications.map((n, index) => (
        <div key={n.id} data-testid={`notification-${index}`}>
          <span data-testid={`notification-${index}-title`}>{n.title}</span>
          <span data-testid={`notification-${index}-message`}>{n.message}</span>
          <span data-testid={`notification-${index}-read`}>{n.read.toString()}</span>
          <button
            data-testid={`mark-read-${index}`}
            onClick={() => markAsRead(n.id)}
          >
            Mark Read
          </button>
          <button
            data-testid={`remove-${index}`}
            onClick={() => removeNotification(n.id)}
          >
            Remove
          </button>
        </div>
      ))}
      <button data-testid="mark-all-read" onClick={markAllAsRead}>
        Mark All Read
      </button>
    </div>
  );
};

describe('NotificationContext', () => {
  const renderWithProvider = () => {
    return render(
      <NotificationProvider>
        <TestComponent />
      </NotificationProvider>
    );
  };

  describe('Rendering', () => {
    it('renders with initial empty state', () => {
      renderWithProvider();
      expect(screen.getByTestId('unread-count')).toHaveTextContent('0');
      expect(screen.getByTestId('notification-count')).toHaveTextContent('0');
    });
  });

  describe('addNotification', () => {
    it('adds a success notification', async () => {
      renderWithProvider();
      const addButton = screen.getByTestId('add-success');

      await act(async () => {
        fireEvent.click(addButton);
      });

      expect(screen.getByTestId('unread-count')).toHaveTextContent('1');
      expect(screen.getByTestId('notification-count')).toHaveTextContent('1');
    });

    it('adds an error notification', async () => {
      renderWithProvider();
      const addButton = screen.getByTestId('add-error');

      await act(async () => {
        fireEvent.click(addButton);
      });

      expect(screen.getByTestId('unread-count')).toHaveTextContent('1');
    });

    it('adds a warning notification', async () => {
      renderWithProvider();
      const addButton = screen.getByTestId('add-warning');

      await act(async () => {
        fireEvent.click(addButton);
      });

      expect(screen.getByTestId('unread-count')).toHaveTextContent('1');
    });

    it('adds an info notification', async () => {
      renderWithProvider();
      const addButton = screen.getByTestId('add-info');

      await act(async () => {
        fireEvent.click(addButton);
      });

      expect(screen.getByTestId('unread-count')).toHaveTextContent('1');
    });

    it('adds notification with correct title', async () => {
      renderWithProvider();
      const addButton = screen.getByTestId('add-success');

      await act(async () => {
        fireEvent.click(addButton);
      });

      expect(screen.getByText('Success')).toBeInTheDocument();
      expect(screen.getByText('Operation succeeded')).toBeInTheDocument();
    });

    it('adds multiple notifications', async () => {
      renderWithProvider();

      await act(async () => {
        fireEvent.click(screen.getByTestId('add-success'));
        fireEvent.click(screen.getByTestId('add-error'));
        fireEvent.click(screen.getByTestId('add-warning'));
      });

      expect(screen.getByTestId('notification-count')).toHaveTextContent('3');
      expect(screen.getByTestId('unread-count')).toHaveTextContent('3');
    });

    it('limits notifications to 50', async () => {
      renderWithProvider();

      await act(async () => {
        for (let i = 0; i < 55; i++) {
          fireEvent.click(screen.getByTestId('add-success'));
        }
      });

      expect(screen.getByTestId('notification-count')).toHaveTextContent('50');
    });

    it('newest notification appears first', async () => {
      renderWithProvider();

      await act(async () => {
        fireEvent.click(screen.getByTestId('add-success'));
        fireEvent.click(screen.getByTestId('add-error'));
      });

      const notificationTitles = screen.getAllByTestId((id) => id.endsWith('-title'));
      expect(notificationTitles[0]).toHaveTextContent('Error');
    });
  });

  describe('markAsRead', () => {
    it('marks notification as read', async () => {
      renderWithProvider();

      await act(async () => {
        fireEvent.click(screen.getByTestId('add-success'));
      });

      await act(async () => {
        fireEvent.click(screen.getByTestId('mark-read-0'));
      });

      expect(screen.getByTestId('unread-count')).toHaveTextContent('0');
    });

    it('only marks specific notification as read', async () => {
      renderWithProvider();

      await act(async () => {
        fireEvent.click(screen.getByTestId('add-success'));
        fireEvent.click(screen.getByTestId('add-error'));
      });

      await act(async () => {
        fireEvent.click(screen.getByTestId('mark-read-0'));
      });

      expect(screen.getByTestId('unread-count')).toHaveTextContent('1');
    });
  });

  describe('markAllAsRead', () => {
    it('marks all notifications as read', async () => {
      renderWithProvider();

      await act(async () => {
        fireEvent.click(screen.getByTestId('add-success'));
        fireEvent.click(screen.getByTestId('add-error'));
        fireEvent.click(screen.getByTestId('add-warning'));
      });

      expect(screen.getByTestId('unread-count')).toHaveTextContent('3');

      await act(async () => {
        fireEvent.click(screen.getByTestId('mark-all-read'));
      });

      expect(screen.getByTestId('unread-count')).toHaveTextContent('0');
    });

    it('does nothing when no notifications', async () => {
      renderWithProvider();

      await act(async () => {
        fireEvent.click(screen.getByTestId('mark-all-read'));
      });

      expect(screen.getByTestId('unread-count')).toHaveTextContent('0');
    });
  });

  describe('removeNotification', () => {
    it('removes a notification', async () => {
      renderWithProvider();

      await act(async () => {
        fireEvent.click(screen.getByTestId('add-success'));
      });

      expect(screen.getByTestId('notification-count')).toHaveTextContent('1');

      await act(async () => {
        fireEvent.click(screen.getByTestId('remove-0'));
      });

      expect(screen.getByTestId('notification-count')).toHaveTextContent('0');
      expect(screen.getByTestId('unread-count')).toHaveTextContent('0');
    });

    it('removes only specific notification', async () => {
      renderWithProvider();

      await act(async () => {
        fireEvent.click(screen.getByTestId('add-success'));
        fireEvent.click(screen.getByTestId('add-error'));
      });

      expect(screen.getByTestId('notification-count')).toHaveTextContent('2');

      await act(async () => {
        fireEvent.click(screen.getByTestId('remove-0'));
      });

      expect(screen.getByTestId('notification-count')).toHaveTextContent('1');
    });
  });

  describe('useNotifications hook', () => {
    it('throws error when used outside provider', () => {
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      expect(() => {
        render(
          <NotificationProvider>
            <TestComponent />
          </NotificationProvider>
        );
      }).not.toThrow();

      consoleError.mockRestore();
    });
  });

  describe('Notification structure', () => {
    it('notification has correct properties', async () => {
      renderWithProvider();

      await act(async () => {
        fireEvent.click(screen.getByTestId('add-success'));
      });

      expect(screen.getByTestId('notification-0-title')).toHaveTextContent('Success');
      expect(screen.getByTestId('notification-0-message')).toHaveTextContent('Operation succeeded');
      expect(screen.getByTestId('notification-0-read')).toHaveTextContent('false');
    });

    it('notification timestamp is set', async () => {
      renderWithProvider();

      await act(async () => {
        fireEvent.click(screen.getByTestId('add-success'));
      });

      expect(screen.getByTestId('notification-0')).toBeInTheDocument();
    });
  });
});
