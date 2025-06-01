import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { taskService } from '../../services/api';
import TaskForm from './TaskForm';
import TaskList from './TaskList';
import TaskStats from './TaskStats';
import './Dashboard.css';

/**
 * Main dashboard component
 */
const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showTaskForm, setShowTaskForm] = useState(false);

  // Load initial data
  useEffect(() => {
    loadTasks();
    loadStats();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const response = await taskService.getRecentTasks();
      setTasks(response.data || []);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await taskService.getTaskStats();
      setStats(response.data);
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const handleTaskCreated = async (taskData) => {
    try {
      await taskService.createTask(taskData);
      toast.success('Task created successfully!');
      setShowTaskForm(false);
      await loadTasks(); // Reload to get the most recent 5
      await loadStats(); // Update statistics
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleTaskCompleted = async (taskId) => {
    try {
      await taskService.markTaskCompleted(taskId);
      toast.success('Task marked as completed!');
      await loadTasks(); // Reload tasks (completed tasks won't appear)
      await loadStats(); // Update statistics
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleTaskDeleted = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await taskService.deleteTask(taskId);
        toast.success('Task deleted successfully!');
        await loadTasks();
        await loadStats();
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Loading your tasks...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="container">
        <div className="dashboard-header">
          <h1>My Todo Dashboard</h1>
          <p>Manage your daily tasks efficiently</p>
        </div>

        {/* Task Statistics */}
        {stats && <TaskStats stats={stats} />}

        {/* Add Task Section */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Add a Task</h3>
          </div>
          <div className="card-body">
            {!showTaskForm ? (
              <button
                onClick={() => setShowTaskForm(true)}
                className="btn btn-primary"
              >
                ➕ Create New Task
              </button>
            ) : (
              <TaskForm
                onSubmit={handleTaskCreated}
                onCancel={() => setShowTaskForm(false)}
              />
            )}
          </div>
        </div>

        {/* Recent Tasks Section */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Recent Tasks</h3>
            <p className="card-subtitle">Your 5 most recent incomplete tasks</p>
          </div>
          <div className="card-body">
            <TaskList
              tasks={tasks}
              onTaskCompleted={handleTaskCompleted}
              onTaskDeleted={handleTaskDeleted}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;