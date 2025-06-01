import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TaskItem } from '../Dashboard';

/**
 * Tests for TaskItem component
 * Ensures the "Done" button functionality works as required
 */
describe('TaskItem', () => {
  const mockTask = {
    id: 1,
    title: 'Test Task',
    description: 'Test Description',
    completed: false,
    createdAt: '2023-01-01T12:00:00Z',
    updatedAt: '2023-01-01T12:00:00Z'
  };

  const mockOnCompleted = jest.fn();
  const mockOnDeleted = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders task information correctly', () => {
    render(
      <TaskItem 
        task={mockTask}
        onCompleted={mockOnCompleted}
        onDeleted={mockOnDeleted}
      />
    );

    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /done/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
  });

  test('calls onCompleted when Done button is clicked', async () => {
    render(
      <TaskItem 
        task={mockTask}
        onCompleted={mockOnCompleted}
        onDeleted={mockOnDeleted}
      />
    );

    const doneButton = screen.getByRole('button', { name: /done/i });
    fireEvent.click(doneButton);

    await waitFor(() => {
      expect(mockOnCompleted).toHaveBeenCalledWith(1);
    });
  });

  test('calls onDeleted when Delete button is clicked', async () => {
    // Mock window.confirm
    window.confirm = jest.fn(() => true);

    render(
      <TaskItem 
        task={mockTask}
        onCompleted={mockOnCompleted}
        onDeleted={mockOnDeleted}
      />
    );

    const deleteButton = screen.getByRole('button', { name: /delete/i });
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(mockOnDeleted).toHaveBeenCalledWith(1);
    });
  });

  test('disables buttons when completing task', () => {
    render(
      <TaskItem 
        task={mockTask}
        onCompleted={() => new Promise(() => {})} // Never resolves
        onDeleted={mockOnDeleted}
      />
    );

    const doneButton = screen.getByRole('button', { name: /done/i });
    fireEvent.click(doneButton);

    expect(doneButton).toBeDisabled();
    expect(screen.getByRole('button', { name: /delete/i })).toBeDisabled();
  });
});
