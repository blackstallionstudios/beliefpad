import { track } from '@vercel/analytics';

// Log levels for filtering
export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error'
}

// Log context interface
interface LogContext {
  component?: string;
  action?: string;
  userId?: string;
  sessionId?: string;
  timestamp: string;
  userAgent?: string;
  url?: string;
  [key: string]: any;
}

// Main logging function
export function log(
  level: LogLevel,
  component: string,
  message: string,
  data?: any,
  context?: Partial<LogContext>
) {
  const timestamp = new Date().toISOString();
  const logContext: LogContext = {
    component,
    timestamp,
    userAgent: navigator.userAgent,
    url: window.location.href,
    ...context
  };

  // Console logging (existing behavior)
  const consoleMessage = `${component}: ${message}`;
  switch (level) {
    case LogLevel.DEBUG:
      console.log(component, message, data);
      break;
    case LogLevel.INFO:
      console.log(component, message, data);
      break;
    case LogLevel.WARN:
      console.warn(component, message, data);
      break;
    case LogLevel.ERROR:
      console.error(component, message, data);
      break;
  }

  // Send to Vercel Analytics as custom event
  try {
    track('app_log', {
      level,
      component,
      message,
      data: data ? JSON.stringify(data) : undefined,
      ...logContext
    });
  } catch (error) {
    console.error('Failed to send log to Vercel Analytics:', error);
  }

  // Send detailed logs to custom endpoint for errors and warnings
  if (level === LogLevel.ERROR || level === LogLevel.WARN) {
    sendDetailedLog(level, component, message, data, logContext);
  }
}

// Send detailed logs to serverless function
async function sendDetailedLog(
  level: LogLevel,
  component: string,
  message: string,
  data?: any,
  context?: LogContext
) {
  try {
    const logData = {
      level,
      component,
      message,
      data,
      context,
      timestamp: new Date().toISOString()
    };

    // Send to Vercel serverless function
    await fetch('/api/logs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(logData),
    });
  } catch (error) {
    console.error('Failed to send detailed log:', error);
  }
}

// Convenience functions
export const logger = {
  debug: (component: string, message: string, data?: any, context?: Partial<LogContext>) => 
    log(LogLevel.DEBUG, component, message, data, context),
  
  info: (component: string, message: string, data?: any, context?: Partial<LogContext>) => 
    log(LogLevel.INFO, component, message, data, context),
  
  warn: (component: string, message: string, data?: any, context?: Partial<LogContext>) => 
    log(LogLevel.WARN, component, message, data, context),
  
  error: (component: string, message: string, data?: any, context?: Partial<LogContext>) => 
    log(LogLevel.ERROR, component, message, data, context),
};

// Track user interactions
export function trackUserAction(
  action: string,
  component: string,
  data?: any,
  context?: Partial<LogContext>
) {
  try {
    track('user_action', {
      action,
      component,
      data: data ? JSON.stringify(data) : undefined,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      ...context
    });
  } catch (error) {
    console.error('Failed to track user action:', error);
  }
}

// Track errors with stack traces
export function trackError(
  error: Error,
  component: string,
  context?: Partial<LogContext>
) {
  const errorData = {
    message: error.message,
    stack: error.stack,
    name: error.name
  };

  log(LogLevel.ERROR, component, error.message, errorData, context);
}

// Track performance metrics
export function trackPerformance(
  metric: string,
  value: number,
  component: string,
  context?: Partial<LogContext>
) {
  try {
    track('performance', {
      metric,
      value,
      component,
      timestamp: new Date().toISOString(),
      ...context
    });
  } catch (error) {
    console.error('Failed to track performance:', error);
  }
}
