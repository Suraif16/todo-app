import { useState, useEffect, useCallback } from 'react';
import { taskService } from '../services/api';
import { toast } from 'react-toastify';

/**
 * Custom hook for task management
 */
export const useTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load recent tasks
  const loadRecentTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await taskService.getRecentTasks();
      setTasks(response.data || []);
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load task statistics
  const loadStats = useCallback(async () => {
    try {
      const response = await taskService.getTaskStats();
      setStats(response.data);
    } catch (err) {
      console.error('Failed to load stats:', err);
    }
  }, []);

  // Create a new task
  const createTask = useCallback(async (taskData) => {
    try {
      await taskService.createTask(taskData);
      toast.success('Task created successfully!');
      await loadRecentTasks();
      await loadStats();
      return { success: true };
    } catch (err) {
      toast.error(err.message);
      return { success: false, error: err.message };
    }
  }, [loadRecentTasks, loadStats]);

  // Mark task as completed
  const completeTask = useCallback(async (taskId) => {
    try {
      await taskService.markTaskCompleted(taskId);
      toast.success('Task completed!');
      await loadRecentTasks();
      await loadStats();
      return { success: true };
    } catch (err) {
      toast.error(err.message);
      return { success: false, error: err.message };
    }
  }, [loadRecentTasks, loadStats]);

  // Delete a task
  const deleteTask = useCallback(async (taskId) => {
    try {
      await taskService.deleteTask(taskId);
      toast.success('Task deleted!');
      await loadRecentTasks();
      await loadStats();
      return { success: true };
    } catch (err) {
      toast.error(err.message);
      return { success: false, error: err.message };
    }
  }, [loadRecentTasks, loadStats]);

  // Load initial data
  useEffect(() => {
    loadRecentTasks();
    loadStats();
  }, [loadRecentTasks, loadStats]);

  return {
    tasks,
    stats,
    loading,
    error,
    createTask,
    completeTask,
    deleteTask,
    refreshTasks: loadRecentTasks,
    refreshStats: loadStats
  };
};