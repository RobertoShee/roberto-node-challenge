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

export class Logger {
    private static instance: Logger;
    private logLevel: LogLevel;

    private constructor() {
        const envLevel = process.env.LOG_LEVEL?.toUpperCase() || 'INFO';
        this.logLevel = LogLevel[envLevel as keyof typeof LogLevel] ?? LogLevel.INFO;
    }

    static getInstance(): Logger {
        if (!Logger.instance) {
            Logger.instance = new Logger();
        }
        return Logger.instance;
    }

    error(message: string, error?: Error, context?: Record<string, any>): void {
        if (this.logLevel >= LogLevel.ERROR) {
            this.log('ERROR', message, context, error);
        }
    }

    warn(message: string, context?: Record<string, any>): void {
        if (this.logLevel >= LogLevel.WARN) {
            this.log('WARN', message, context);
        }
    }

    info(message: string, context?: Record<string, any>): void {
        if (this.logLevel >= LogLevel.INFO) {
            this.log('INFO', message, context);
        }
    }

    debug(message: string, context?: Record<string, any>): void {
        if (this.logLevel >= LogLevel.DEBUG) {
            this.log('DEBUG', message, context);
        }
    }

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

        if (process.env.NODE_ENV !== 'production') {
            this.prettyLog(logEntry);
        } else {
            console.log(JSON.stringify(logEntry));
        }
    }

    private prettyLog(entry: LogEntry): void {
        const colors = {
            ERROR: '\x1b[31m',
            WARN: '\x1b[33m',
            INFO: '\x1b[36m',
            DEBUG: '\x1b[35m',
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

    websocket(event: string, socketId: string, data?: any): void {
        const context = {
            event,
            socketId,
            ...(data && { data })
        };

        this.info(`WebSocket event: ${event}`, context);
    }
}

export const logger = Logger.getInstance();
