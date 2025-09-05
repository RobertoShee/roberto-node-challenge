import { StatusCodes } from 'http-status-codes';

export abstract class AppError extends Error {
  abstract readonly statusCode: number;
  abstract readonly type: string;
  abstract readonly title: string;
  readonly isOperational = true;
  readonly timestamp = new Date().toISOString();

  constructor(
    message: string,
    public readonly context?: Record<string, any>
  ) {
    super(message);
    this.name = this.constructor.name;
    
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  toJSON() {
    return {
      type: this.type,
      title: this.title,
      status: this.statusCode,
      detail: this.message,
      timestamp: this.timestamp,
      ...(this.context && { context: this.context })
    };
  }
}

export class ValidationError extends AppError {
  readonly statusCode = StatusCodes.BAD_REQUEST;
  readonly type = 'https://httpstatuses.com/400';
  readonly title = 'Datos de entrada inválidos';

  constructor(
    message: string,
    public readonly errors?: Record<string, string[]>,
    context?: Record<string, any>
  ) {
    super(message, context);
  }

  toJSON() {
    return {
      ...super.toJSON(),
      ...(this.errors && { errors: this.errors })
    };
  }
}

export class NotFoundError extends AppError {
  readonly statusCode = StatusCodes.NOT_FOUND;
  readonly type = 'https://httpstatuses.com/404';
  readonly title = 'Recurso no encontrado';

  constructor(resource: string, id?: string | number) {
    const message = id 
      ? `${resource} con ID ${id} no fue encontrado`
      : `${resource} no fue encontrado`;
    super(message, { resource, id });
  }
}

export class ConflictError extends AppError {
  readonly statusCode = StatusCodes.CONFLICT;
  readonly type = 'https://httpstatuses.com/409';
  readonly title = 'Conflicto de recursos';

  constructor(message: string, context?: Record<string, any>) {
    super(message, context);
  }
}

export class UnauthorizedError extends AppError {
  readonly statusCode = StatusCodes.UNAUTHORIZED;
  readonly type = 'https://httpstatuses.com/401';
  readonly title = 'No autorizado';

  constructor(message = 'Credenciales inválidas o token expirado') {
    super(message);
  }
}

export class ForbiddenError extends AppError {
  readonly statusCode = StatusCodes.FORBIDDEN;
  readonly type = 'https://httpstatuses.com/403';
  readonly title = 'Acceso prohibido';

  constructor(message = 'No tiene permisos para realizar esta acción') {
    super(message);
  }
}

export class DatabaseError extends AppError {
  readonly statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
  readonly type = 'https://httpstatuses.com/500';
  readonly title = 'Error de base de datos';

  constructor(
    message: string,
    public readonly operation?: string,
    context?: Record<string, any>
  ) {
    super(`Error en operación de base de datos: ${message}`, {
      operation,
      ...context
    });
  }
}

export class InternalServerError extends AppError {
  readonly statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
  readonly type = 'about:blank';
  readonly title = 'Error interno del servidor';

  constructor(message = 'Ha ocurrido un error interno del servidor') {
    super(message);
  }
}

export function isOperationalError(error: Error): boolean {
  return error instanceof AppError && error.isOperational;
}

export function createValidationError(
  validationErrors: any[]
): ValidationError {
  const errors: Record<string, string[]> = {};
  
  validationErrors.forEach((error) => {
    if (error.constraints) {
      errors[error.property] = Object.values(error.constraints);
    }
  });

  return new ValidationError(
    'Los datos enviados no cumplen las validaciones requeridas',
    errors
  );
}
