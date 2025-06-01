import axios from 'axios';
import { toast } from 'react-toastify';

/**
 * API service configuration
 * Handles HTTP requests to the backend API
 */
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

// Create axios instance for authentication endpoints
export const authAPI = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Create axios instance for protected endpoints
export const taskAPI = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
taskAPI.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
taskAPI.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
      toast.error('Session expired. Please login again.');
    }
    return Promise.reject(error);
  }
);

// API service functions
export const taskService = {
  // Get recent tasks (most recent 5)
  getRecentTasks: async () => {
    try {
      const response = await taskAPI.get('/tasks/recent');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch tasks');
    }
  },

  // Get all tasks with pagination
  getAllTasks: async (page = 0, size = 10) => {
    try {
      const response = await taskAPI.get(`/tasks?page=${page}&size=${size}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch tasks');
    }
  },

  // Get task by ID
  getTaskById: async (id) => {
    try {
      const response = await taskAPI.get(`/tasks/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch task');
    }
  },

  // Create new task
  createTask: async (taskData) => {
    try {
      const response = await taskAPI.post('/tasks', taskData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create task');
    }
  },

  // Update task
  updateTask: async (id, taskData) => {
    try {
      const response = await taskAPI.put(`/tasks/${id}`, taskData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update task');
    }
  },

  // Mark task as completed
  markTaskCompleted: async (id) => {
    try {
      const response = await taskAPI.put(`/tasks/${id}/complete`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to mark task as completed');
    }
  },

  // Mark task as pending
  markTaskPending: async (id) => {
    try {
      const response = await taskAPI.put(`/tasks/${id}/pending`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to mark task as pending');
    }
  },

  // Delete task
  deleteTask: async (id) => {
    try {
      const response = await taskAPI.delete(`/tasks/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete task');
    }
  },

  // Search tasks
  searchTasks: async (searchTerm, page = 0, size = 10) => {
    try {
      const response = await taskAPI.get(`/tasks/search?q=${encodeURIComponent(searchTerm)}&page=${page}&size=${size}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to search tasks');
    }
  },

  // Get task statistics
  getTaskStats: async () => {
    try {
      const response = await taskAPI.get('/tasks/stats');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch task statistics');
    }
  }
};

const apiService = {
  authAPI,
  taskAPI,
  taskService
};

export default apiService;