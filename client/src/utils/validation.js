// Validation utility for consistent form validation across the application

// Common validation patterns
export const PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
  NAME: /^[a-zA-Z\s]+$/,
  PHONE: /^[\+]?[1-9][\d]{0,15}$/,
  USERNAME: /^[a-zA-Z0-9_]{3,20}$/,
  URL: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/
};

// Validation rules for different field types
export const VALIDATION_RULES = {
  name: {
    required: 'Full name is required',
    minLength: { value: 2, message: 'Name must be at least 2 characters long' },
    maxLength: { value: 50, message: 'Name must be less than 50 characters' },
    pattern: { value: PATTERNS.NAME, message: 'Name can only contain letters and spaces' }
  },
  email: {
    required: 'Email address is required',
    pattern: { 
      value: PATTERNS.EMAIL, 
      message: 'Please enter a valid email address' 
    }
  },
  password: {
    required: 'Password is required',
    minLength: { value: 6, message: 'Password must be at least 6 characters long' },
    maxLength: { value: 128, message: 'Password must be less than 128 characters' },
    pattern: { 
      value: PATTERNS.PASSWORD, 
      message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number' 
    }
  },
  confirmPassword: {
    required: 'Please confirm your password',
    match: 'Passwords do not match'
  },
  username: {
    required: 'Username is required',
    minLength: { value: 3, message: 'Username must be at least 3 characters long' },
    maxLength: { value: 20, message: 'Username must be less than 20 characters' },
    pattern: { 
      value: PATTERNS.USERNAME, 
      message: 'Username can only contain letters, numbers, and underscores' 
    }
  },
  phone: {
    pattern: { 
      value: PATTERNS.PHONE, 
      message: 'Please enter a valid phone number' 
    }
  },
  url: {
    pattern: { 
      value: PATTERNS.URL, 
      message: 'Please enter a valid URL' 
    }
  }
};

// Password strength calculator
export const getPasswordStrength = (password) => {
  if (!password) return { score: 0, label: '', color: '', feedback: [] };
  
  let score = 0;
  let feedback = [];

  // Length checks
  if (password.length >= 6) score++;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;

  // Character type checks
  if (/[a-z]/.test(password)) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++;

  // Feedback for missing requirements
  if (password.length < 6) feedback.push('At least 6 characters');
  if (!/[a-z]/.test(password)) feedback.push('One lowercase letter');
  if (!/[A-Z]/.test(password)) feedback.push('One uppercase letter');
  if (!/\d/.test(password)) feedback.push('One number');
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) feedback.push('One special character');

  const strengthMap = {
    0: { label: 'Very Weak', color: 'red' },
    1: { label: 'Weak', color: 'orange' },
    2: { label: 'Fair', color: 'yellow' },
    3: { label: 'Good', color: 'blue' },
    4: { label: 'Strong', color: 'green' },
    5: { label: 'Very Strong', color: 'emerald' },
    6: { label: 'Excellent', color: 'emerald' },
    7: { label: 'Exceptional', color: 'emerald' },
    8: { label: 'Perfect', color: 'emerald' }
  };

  return {
    score: Math.min(score, 8),
    label: strengthMap[Math.min(score, 8)].label,
    color: strengthMap[Math.min(score, 8)].color,
    feedback
  };
};

// Main validation function
export const validateField = (name, value, rules = VALIDATION_RULES, additionalData = {}) => {
  const fieldRules = rules[name];
  if (!fieldRules) return '';

  // Required check
  if (fieldRules.required && !value.trim()) {
    return fieldRules.required;
  }

  // Min length check
  if (fieldRules.minLength && value.length < fieldRules.minLength.value) {
    return fieldRules.minLength.message;
  }

  // Max length check
  if (fieldRules.maxLength && value.length > fieldRules.maxLength.value) {
    return fieldRules.maxLength.message;
  }

  // Pattern check
  if (fieldRules.pattern && !fieldRules.pattern.value.test(value)) {
    return fieldRules.pattern.message;
  }

  // Custom match check for confirm password
  if (name === 'confirmPassword' && additionalData.password && value !== additionalData.password) {
    return fieldRules.match;
  }

  return '';
};

// Validate entire form
export const validateForm = (formData, rules = VALIDATION_RULES) => {
  const errors = {};
  
  Object.keys(rules).forEach(field => {
    const error = validateField(field, formData[field], rules, formData);
    if (error) {
      errors[field] = error;
    }
  });

  return errors;
};

// Check if form is valid
export const isFormValid = (formData, rules = VALIDATION_RULES) => {
  const errors = validateForm(formData, rules);
  const allFieldsFilled = Object.keys(rules).every(field => 
    formData[field] && formData[field].trim() !== ''
  );

  return Object.keys(errors).length === 0 && allFieldsFilled;
};

// Sanitize input data
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, ''); // Remove event handlers
};

// Format validation error messages
export const formatErrorMessage = (error, fieldName) => {
  if (!error) return '';
  
  // Capitalize field name for better UX
  const fieldDisplayName = fieldName
    .replace(/([A-Z])/g, ' $1') // Add space before capital letters
    .replace(/^./, str => str.toUpperCase()) // Capitalize first letter
    .trim();
  
  return error.replace(fieldName, fieldDisplayName);
};

// Common error messages for different scenarios
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your internet connection and try again.',
  SERVER_ERROR: 'Server error. Please try again later.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  FORBIDDEN: 'Access denied. You do not have permission to access this resource.',
  NOT_FOUND: 'The requested resource was not found.',
  VALIDATION_ERROR: 'Please fix the errors above before submitting.',
  UNKNOWN_ERROR: 'An unexpected error occurred. Please try again.',
  
  // Auth specific errors
  INVALID_CREDENTIALS: 'Invalid email or password. Please check your credentials and try again.',
  USER_NOT_FOUND: 'No account found with this email address. Please check your email or create a new account.',
  ACCOUNT_LOCKED: 'Account temporarily locked due to too many failed login attempts.',
  EMAIL_ALREADY_EXISTS: 'An account with this email address already exists.',
  WEAK_PASSWORD: 'Password is too weak. Please choose a stronger password.',
  
  // Form specific errors
  REQUIRED_FIELD: 'This field is required.',
  INVALID_EMAIL: 'Please enter a valid email address.',
  INVALID_PASSWORD: 'Password must be at least 6 characters long and contain uppercase, lowercase, and number.',
  PASSWORDS_DONT_MATCH: 'Passwords do not match.',
  INVALID_NAME: 'Name can only contain letters and spaces.',
  INVALID_USERNAME: 'Username can only contain letters, numbers, and underscores.',
  INVALID_PHONE: 'Please enter a valid phone number.',
  INVALID_URL: 'Please enter a valid URL.'
};

// Success messages
export const SUCCESS_MESSAGES = {
  REGISTRATION_SUCCESS: 'Registration successful! Redirecting to dashboard...',
  LOGIN_SUCCESS: 'Login successful! Redirecting to dashboard...',
  LOGOUT_SUCCESS: 'Logged out successfully.',
  PROFILE_UPDATED: 'Profile updated successfully.',
  PASSWORD_CHANGED: 'Password changed successfully.',
  DATA_SAVED: 'Data saved successfully.',
  ACCOUNT_DELETED: 'Account deleted successfully.'
};

// Helper function to get appropriate error message
export const getErrorMessage = (error, context = '') => {
  if (!error) return ERROR_MESSAGES.UNKNOWN_ERROR;
  
  const errorString = error.toString().toLowerCase();
  
  // Network errors
  if (errorString.includes('network') || errorString.includes('fetch')) {
    return ERROR_MESSAGES.NETWORK_ERROR;
  }
  
  // Server errors
  if (errorString.includes('500') || errorString.includes('server')) {
    return ERROR_MESSAGES.SERVER_ERROR;
  }
  
  // Auth errors
  if (errorString.includes('401') || errorString.includes('unauthorized')) {
    return ERROR_MESSAGES.UNAUTHORIZED;
  }
  
  if (errorString.includes('403') || errorString.includes('forbidden')) {
    return ERROR_MESSAGES.FORBIDDEN;
  }
  
  if (errorString.includes('404') || errorString.includes('not found')) {
    return ERROR_MESSAGES.NOT_FOUND;
  }
  
  // Specific auth errors
  if (errorString.includes('user not found')) {
    return ERROR_MESSAGES.USER_NOT_FOUND;
  }
  
  if (errorString.includes('invalid password') || errorString.includes('invalid credentials')) {
    return ERROR_MESSAGES.INVALID_CREDENTIALS;
  }
  
  if (errorString.includes('email already exists')) {
    return ERROR_MESSAGES.EMAIL_ALREADY_EXISTS;
  }
  
  // Return the original error if no specific match
  return error;
};

export default {
  PATTERNS,
  VALIDATION_RULES,
  getPasswordStrength,
  validateField,
  validateForm,
  isFormValid,
  sanitizeInput,
  formatErrorMessage,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  getErrorMessage
}; 