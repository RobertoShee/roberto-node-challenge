/**
 * Logger estructurado para la aplicación
 */

export enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3,
}

export interface LogEntry {
  level: keyof typeof LogLevel;
  message: string;
  timestamp: string;
  context?: Record<string, any>;
  error?: {
    name: string;
    message: string;
    stack?: string;
  };
}

/**
 * Logger simple y estructurado
 */
export class Logger {
  private static instance: Logger;
  private logLevel: LogLevel;

  private constructor() {
    // Configurar nivel de log desde variable de entorno
    const envLevel = process.env.LOG_LEVEL?.toUpperCase() || 'INFO';
    this.logLevel = LogLevel[envLevel as keyof typeof LogLevel] ?? LogLevel.INFO;
  }

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  /**
   * Log de error
   */
  error(message: string, error?: Error, context?: Record<string, any>): void {
    if (this.logLevel >= LogLevel.ERROR) {
      this.log('ERROR', message, context, error);
    }
  }

  /**
   * Log de advertencia
   */
  warn(message: string, context?: Record<string, any>): void {
    if (this.logLevel >= LogLevel.WARN) {
      this.log('WARN', message, context);
    }
  }

  /**
   * Log de información
   */
  info(message: string, context?: Record<string, any>): void {
    if (this.logLevel >= LogLevel.INFO) {
      this.log('INFO', message, context);
    }
  }

  /**
   * Log de debug
   */
  debug(message: string, context?: Record<string, any>): void {
    if (this.logLevel >= LogLevel.DEBUG) {
      this.log('DEBUG', message, context);
    }
  }

  /**
   * Método interno para escribir logs
   */
  private log(
    level: keyof typeof LogLevel,
    message: string,
    context?: Record<string, any>,
    error?: Error
  ): void {
    const logEntry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      ...(context && { context }),
      ...(error && {
        error: {
          name: error.name,
          message: error.message,
          ...(error.stack && { stack: error.stack })
        }
      })
    };

    // En desarrollo, usar console con formato bonito
    if (process.env.NODE_ENV !== 'production') {
      this.prettyLog(logEntry);
    } else {
      // En producción, usar JSON estructurado
      console.log(JSON.stringify(logEntry));
    }
  }

  /**
   * Formato bonito para desarrollo
   */
  private prettyLog(entry: LogEntry): void {
    const colors = {
      ERROR: '\x1b[31m', // Rojo
      WARN: '\x1b[33m',  // Amarillo
      INFO: '\x1b[36m',  // Cian
      DEBUG: '\x1b[35m', // Magenta
    };
    
    const reset = '\x1b[0m';
    const color = colors[entry.level];
    const time = new Date(entry.timestamp).toLocaleTimeString();
    
    console.log(
      `${color}[${entry.level}]${reset} ${time} - ${entry.message}`
    );
    
    if (entry.context) {
      console.log(`  📊 Context:`, JSON.stringify(entry.context, null, 2));
    }
    
    if (entry.error) {
      console.log(`  ❌ Error: ${entry.error.name} - ${entry.error.message}`);
      if (entry.error.stack) {
        console.log(`  📚 Stack:\n${entry.error.stack}`);
      }
    }
  }

  /**
   * Log específico para requests HTTP
   */
  httpRequest(
    method: string,
    url: string,
    statusCode: number,
    responseTime: number,
    userAgent?: string
  ): void {
    const context = {
      method,
      url,
      statusCode,
      responseTimeMs: responseTime,
      ...(userAgent && { userAgent })
    };

    const message = `${method} ${url} - ${statusCode} (${responseTime}ms)`;
    
    if (statusCode >= 500) {
      this.error(message, undefined, context);
    } else if (statusCode >= 400) {
      this.warn(message, context);
    } else {
      this.info(message, context);
    }
  }

  /**
   * Log específico para base de datos
   */
  database(operation: string, table: string, duration?: number, error?: Error): void {
    const context = {
      operation,
      table,
      ...(duration && { durationMs: duration })
    };

    if (error) {
      this.error(`Database operation failed: ${operation} on ${table}`, error, context);
    } else {
      this.debug(`Database operation: ${operation} on ${table}`, context);
    }
  }

  /**
   * Log específico para WebSockets
   */
  websocket(event: string, socketId: string, data?: any): void {
    const context = {
      event,
      socketId,
      ...(data && { data })
    };

    this.info(`WebSocket event: ${event}`, context);
  }
}

// Exportar instancia singleton
export const logger = Logger.getInstance();
