/**
 * Centralized logging utility for CoreV4 Mental Health Platform
 * Provides structured logging with different severity levels
 */

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  CRITICAL = 4,
  CRISIS = 5 // Mental health crisis events requiring immediate attention
}

export interface LogEntry {
  timestamp: Date;
  level: LogLevel;
  message: string;
  context?: string;
  data?: unknown;
  stack?: string;
  isPrivacySafe?: boolean; // Indicates if log contains no sensitive user data
  urgency?: 'low' | 'medium' | 'high' | 'critical'; // For crisis situations
  userId?: string; // Anonymized user ID for tracking (never PII)
}

class Logger {
  private logLevel: LogLevel;
  private logs: LogEntry[] = [];
  private maxLogs = 1000;

  constructor() {
    // Set log level based on environment
    this.logLevel = import.meta.env.DEV ? LogLevel.DEBUG : LogLevel.INFO;
  }

  /**
   * Sanitizes sensitive data from log messages
   * Replaces PII with safe placeholders
   */
  private sanitizeData(data: unknown): unknown {
    if (typeof data === 'string') {
      let sanitized = data;
      // Basic PII sanitization
      sanitized = sanitized.replace(/[\w.-]+@[\w.-]+\.\w+/gi, '[EMAIL_REDACTED]');
      sanitized = sanitized.replace(/\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g, '[PHONE_REDACTED]');
      return sanitized;
    }
    return data;
  }

  private log(
    level: LogLevel, 
    message: string, 
    context?: string, 
    data?: unknown,
    options?: { isPrivacySafe?: boolean; urgency?: 'low' | 'medium' | 'high' | 'critical'; userId?: string }
  ): void {
    if (level < this.logLevel) return;

    // Sanitize data in production unless explicitly marked as privacy safe
    const sanitizedData = (import.meta.env.PROD && !options?.isPrivacySafe) 
      ? this.sanitizeData(data) 
      : data;

    const entry: LogEntry = {
      timestamp: new Date(),
      level,
      message,
      context,
      data: sanitizedData,
      ...options
    };

    // Store in memory for debugging
    this.logs.push(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    // Console output
    if (import.meta.env.DEV) {
      const formattedMessage = `${entry.timestamp.toISOString()} [${LogLevel[level]}] ${context || ''} ${message}`;
      
      switch (level) {
        case LogLevel.DEBUG:
          console.log(`%c${formattedMessage}`, 'color: #888', sanitizedData);
          break;
        case LogLevel.INFO:
          console.log(`%c${formattedMessage}`, 'color: #4CAF50', sanitizedData);
          break;
        case LogLevel.WARN:
          console.warn(formattedMessage, sanitizedData);
          break;
        case LogLevel.ERROR:
        case LogLevel.CRITICAL:
          console.error(formattedMessage, sanitizedData);
          break;
        case LogLevel.CRISIS:
          // Crisis logs always use console.error for visibility
          console.error(`🚨 CRISIS ${entry.urgency ? `[${entry.urgency.toUpperCase()}]` : ''}: ${formattedMessage}`, sanitizedData);
          break;
      }
    }
  }

  public debug(message: string, context?: string, data?: unknown): void {
    this.log(LogLevel.DEBUG, message, context, data);
  }

  public info(message: string, context?: string, data?: unknown): void {
    this.log(LogLevel.INFO, message, context, data);
  }

  public warn(message: string, context?: string, data?: unknown): void {
    this.log(LogLevel.WARN, message, context, data);
  }

  public error(message: string, context?: string, errorData?: Error | unknown): void {
    this.log(LogLevel.ERROR, message, context, errorData);
  }

  public critical(message: string, context?: string, error?: Error | unknown): void {
    this.log(LogLevel.CRITICAL, message, context, error);
  }

  /**
   * Logs a crisis event requiring immediate attention
   */
  public crisis(
    message: string, 
    urgency: 'low' | 'medium' | 'high' | 'critical',
    context?: string, 
    data?: unknown
  ): void {
    this.log(LogLevel.CRISIS, message, context, data, { urgency });
  }

  public getLogs(): LogEntry[] {
    return [...this.logs];
  }

  public clearLogs(): void {
    this.logs = [];
  }

  public setLogLevel(level: LogLevel): void {
    this.logLevel = level;
  }
}

// Export singleton instance
export const logger = new Logger();