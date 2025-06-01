import { authAPI } from './api';

/**
 * Dedicated authentication service
 * Handles all authentication-related operations
 */
class AuthService {
  
  /**
   * Login user with credentials
   */
  async login(credentials) {
    try {
      const response = await authAPI.post('/auth/login', credentials);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Login failed'
      };
    }
  }

  /**
   * Register new user
   */
  async register(userData) {
    try {
      const response = await authAPI.post('/auth/register', userData);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Registration failed'
      };
    }
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated() {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    return !!(token && user);
  }

  /**
   * Get current user from localStorage
   */
  getCurrentUser() {
    try {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Get current token
   */
  getToken() {
    return localStorage.getItem('token');
  }

  /**
   * Clear authentication data
   */
  clearAuth() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete authAPI.defaults.headers.common['Authorization'];
  }

  /**
   * Set authentication token
   */
  setAuthToken(token) {
    localStorage.setItem('token', token);
    authAPI.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  /**
   * Validate token (check if it's expired)
   */
  isTokenValid() {
    const token = this.getToken();
    if (!token) return false;
    
    try {
      // Basic check - in a real app you might decode JWT and check expiration
      const tokenParts = token.split('.');
      if (tokenParts.length !== 3) return false;
      
      // You could add JWT decoding here to check expiration
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Check health of auth service
   */
  async healthCheck() {
    try {
      const response = await authAPI.get('/auth/health');
      return {
        success: true,
        data: response.data.data,
        message: response.data.message
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: 'Auth service unavailable'
      };
    }
  }
}

// Export a singleton instance
export default new AuthService();