import { taskAPI } from './api';

/**
 * Dedicated task service with all task-related operations
 */
class TaskService {
  
  /**
   * Get recent incomplete tasks
   */
  async getRecentTasks() {
    try {
      const response = await taskAPI.get('/tasks/recent');
      return {
        success: true,
        data: response.data.data || [],
        message: response.data.message
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        message: error.response?.data?.message || 'Failed to fetch recent tasks'
      };
    }
  }

  /**
   * Get all tasks with pagination
   */
  async getAllTasks(page = 0, size = 10) {
    try {
      const response = await taskAPI.get(`/tasks?page=${page}&size=${size}`);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message
      };
    } catch (error) {
      return {
        success: false,
        data: { content: [], totalElements: 0, totalPages: 0 },
        message: error.response?.data?.message || 'Failed to fetch tasks'
      };
    }
  }

  /**
   * Create a new task
   */
  async createTask(taskData) {
    try {
      const response = await taskAPI.post('/tasks', taskData);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Failed to create task'
      };
    }
  }

  /**
   * Update an existing task
   */
  async updateTask(id, taskData) {
    try {
      const response = await taskAPI.put(`/tasks/${id}`, taskData);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Failed to update task'
      };
    }
  }

  /**
   * Mark task as completed
   */
  async markTaskCompleted(id) {
    try {
      const response = await taskAPI.put(`/tasks/${id}/complete`);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Failed to mark task as completed'
      };
    }
  }

  /**
   * Mark task as pending
   */
  async markTaskPending(id) {
    try {
      const response = await taskAPI.put(`/tasks/${id}/pending`);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Failed to mark task as pending'
      };
    }
  }

  /**
   * Delete a task
   */
  async deleteTask(id) {
    try {
      const response = await taskAPI.delete(`/tasks/${id}`);
      return {
        success: true,
        data: null,
        message: response.data.message
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Failed to delete task'
      };
    }
  }

  /**
   * Get task by ID
   */
  async getTaskById(id) {
    try {
      const response = await taskAPI.get(`/tasks/${id}`);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Failed to fetch task'
      };
    }
  }

  /**
   * Search tasks by title or description
   */
  async searchTasks(searchTerm, page = 0, size = 10) {
    try {
      const response = await taskAPI.get(`/tasks/search?q=${encodeURIComponent(searchTerm)}&page=${page}&size=${size}`);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message
      };
    } catch (error) {
      return {
        success: false,
        data: { content: [], totalElements: 0, totalPages: 0 },
        message: error.response?.data?.message || 'Failed to search tasks'
      };
    }
  }

  /**
   * Get task statistics
   */
  async getTaskStats() {
    try {
      const response = await taskAPI.get('/tasks/stats');
      return {
        success: true,
        data: response.data.data,
        message: response.data.message
      };
    } catch (error) {
      return {
        success: false,
        data: { total: 0, completed: 0, incomplete: 0 },
        message: error.response?.data?.message || 'Failed to fetch task statistics'
      };
    }
  }

  /**
   * Batch operations for multiple tasks
   */
  async batchCompleteTask(taskIds) {
    try {
      const promises = taskIds.map(id => this.markTaskCompleted(id));
      const results = await Promise.allSettled(promises);
      
      const successful = results.filter(result => result.status === 'fulfilled' && result.value.success);
      const failed = results.filter(result => result.status === 'rejected' || !result.value.success);
      
      return {
        success: failed.length === 0,
        data: {
          successful: successful.length,
          failed: failed.length,
          total: taskIds.length
        },
        message: `${successful.length} of ${taskIds.length} tasks completed successfully`
      };
    } catch (error) {
      return {
        success: false,
        data: { successful: 0, failed: taskIds.length, total: taskIds.length },
        message: 'Batch operation failed'
      };
    }
  }

  /**
   * Get tasks with filters
   */
  async getTasksWithFilters(filters = {}) {
    try {
      const params = new URLSearchParams();
      
      if (filters.completed !== undefined) {
        params.append('completed', filters.completed);
      }
      if (filters.page !== undefined) {
        params.append('page', filters.page);
      }
      if (filters.size !== undefined) {
        params.append('size', filters.size);
      }
      if (filters.sortBy) {
        params.append('sort', filters.sortBy);
      }
      if (filters.sortDirection) {
        params.append('direction', filters.sortDirection);
      }
      
      const response = await taskAPI.get(`/tasks?${params.toString()}`);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message
      };
    } catch (error) {
      return {
        success: false,
        data: { content: [], totalElements: 0, totalPages: 0 },
        message: error.response?.data?.message || 'Failed to fetch filtered tasks'
      };
    }
  }
}

// Export a singleton instance
export default new TaskService();