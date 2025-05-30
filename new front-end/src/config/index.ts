// Configuration utility for the application
// This centralizes all environment variable access

// API configuration
export const API_CONFIG = {
  // Base URL for API calls - if environment variable is not set, use default
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  
  // Timeout for API calls in milliseconds (30 seconds)
  TIMEOUT: 30000,
  
  // Whether to include credentials in API calls
  WITH_CREDENTIALS: true
};

// Application configuration
export const APP_CONFIG = {
  // Environment - development, staging, production
  ENV: import.meta.env.VITE_APP_ENV || 'development',
  
  // Debug mode - enables additional logging
  DEBUG: import.meta.env.VITE_APP_DEBUG === 'true' || false,
  
  // Version
  VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0'
};

// Feature flags - enable/disable features
export const FEATURES = {
  ENABLE_ANALYTICS: import.meta.env.VITE_ENABLE_ANALYTICS === 'true' || false,
  ENABLE_NOTIFICATIONS: import.meta.env.VITE_ENABLE_NOTIFICATIONS === 'true' || true
};

// Utility function to check if we're in development mode
export const isDevelopment = (): boolean => {
  return APP_CONFIG.ENV === 'development';
};

// Utility function to log debug information if debug mode is enabled
export const debugLog = (...args: any[]): void => {
  if (APP_CONFIG.DEBUG || isDevelopment()) {
    console.log('[DEBUG]', ...args);
  }
};

// Export a default config object with all configurations
export default {
  API: API_CONFIG,
  APP: APP_CONFIG,
  FEATURES
};
