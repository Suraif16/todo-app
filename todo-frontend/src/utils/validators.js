import { VALIDATION_RULES } from './constants';

export const validateUsername = (username) => {
  const errors = [];
  
  if (!username || username.trim().length === 0) {
    errors.push('Username is required');
  } else if (username.length < VALIDATION_RULES.USERNAME.MIN_LENGTH) {
    errors.push(`Username must be at least ${VALIDATION_RULES.USERNAME.MIN_LENGTH} characters`);
  } else if (username.length > VALIDATION_RULES.USERNAME.MAX_LENGTH) {
    errors.push(`Username must be less than ${VALIDATION_RULES.USERNAME.MAX_LENGTH} characters`);
  }
  
  return errors;
};

export const validateEmail = (email) => {
  const errors = [];
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!email || email.trim().length === 0) {
    errors.push('Email is required');
  } else if (!emailRegex.test(email)) {
    errors.push('Please enter a valid email address');
  }
  
  return errors;
};

export const validatePassword = (password) => {
  const errors = [];
  
  if (!password) {
    errors.push('Password is required');
  } else if (password.length < VALIDATION_RULES.PASSWORD.MIN_LENGTH) {
    errors.push(`Password must be at least ${VALIDATION_RULES.PASSWORD.MIN_LENGTH} characters`);
  } else if (password.length > VALIDATION_RULES.PASSWORD.MAX_LENGTH) {
    errors.push(`Password must be less than ${VALIDATION_RULES.PASSWORD.MAX_LENGTH} characters`);
  }
  
  return errors;
};

export const validateTaskTitle = (title) => {
  const errors = [];
  
  if (!title || title.trim().length === 0) {
    errors.push('Title is required');
  } else if (title.length > VALIDATION_RULES.TASK_TITLE.MAX_LENGTH) {
    errors.push(`Title must be less than ${VALIDATION_RULES.TASK_TITLE.MAX_LENGTH} characters`);
  }
  
  return errors;
};

export const validateTaskDescription = (description) => {
  const errors = [];
  
  if (description && description.length > VALIDATION_RULES.TASK_DESCRIPTION.MAX_LENGTH) {
    errors.push(`Description must be less than ${VALIDATION_RULES.TASK_DESCRIPTION.MAX_LENGTH} characters`);
  }
  
  return errors;
};

export const validateRegistrationForm = (formData) => {
  const errors = {};
  
  const usernameErrors = validateUsername(formData.username);
  if (usernameErrors.length > 0) {
    errors.username = usernameErrors[0];
  }
  
  const emailErrors = validateEmail(formData.email);
  if (emailErrors.length > 0) {
    errors.email = emailErrors[0];
  }
  
  const passwordErrors = validatePassword(formData.password);
  if (passwordErrors.length > 0) {
    errors.password = passwordErrors[0];
  }
  
  if (formData.confirmPassword !== formData.password) {
    errors.confirmPassword = 'Passwords do not match';
  }
  
  return errors;
};

export const validateLoginForm = (formData) => {
  const errors = {};
  
  if (!formData.username || formData.username.trim().length === 0) {
    errors.username = 'Username is required';
  }
  
  if (!formData.password) {
    errors.password = 'Password is required';
  }
  
  return errors;
};

export const validateTaskForm = (formData) => {
  const errors = {};
  
  const titleErrors = validateTaskTitle(formData.title);
  if (titleErrors.length > 0) {
    errors.title = titleErrors[0];
  }
  
  const descriptionErrors = validateTaskDescription(formData.description);
  if (descriptionErrors.length > 0) {
    errors.description = descriptionErrors[0];
  }
  
  return errors;
};