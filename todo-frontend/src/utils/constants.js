export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    HEALTH: '/auth/health'
  },
  TASKS: {
    RECENT: '/tasks/recent',
    ALL: '/tasks',
    BY_ID: (id) => `/tasks/${id}`,
    COMPLETE: (id) => `/tasks/${id}/complete`,
    PENDING: (id) => `/tasks/${id}/pending`,
    DELETE: (id) => `/tasks/${id}`,
    SEARCH: '/tasks/search',
    STATS: '/tasks/stats'
  }
};


export const APP_ROUTES = {
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  HOME: '/'
};

export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user'
};

export const VALIDATION_RULES = {
  USERNAME: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 50
  },
  PASSWORD: {
    MIN_LENGTH: 6,
    MAX_LENGTH: 100
  },
  TASK_TITLE: {
    MAX_LENGTH: 255
  },
  TASK_DESCRIPTION: {
    MAX_LENGTH: 1000
  }
};

export const UI_CONSTANTS = {
  RECENT_TASKS_LIMIT: 5,
  DEFAULT_PAGE_SIZE: 10,
  TOAST_DURATION: 3000
};