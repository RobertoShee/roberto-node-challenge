import { 
  NotFoundError, 
  ValidationError, 
  DatabaseError, 
  ConflictError,
  UnauthorizedError,
  ForbiddenError,
  InternalServerError,
  isOperationalError,
  createValidationError
} from '../../src/common/errors';

describe('Error Classes', () => {
  describe('NotFoundError', () => {
    it('should create error with resource and id', () => {
      const error = new NotFoundError('Task', 123);
      expect(error.message).toBe('Task con ID 123 no fue encontrado');
      expect(error.statusCode).toBe(404);
      expect(error.context).toEqual({ resource: 'Task', id: 123 });
      expect(error.isOperational).toBe(true);
    });

    it('should create error with resource only', () => {
      const error = new NotFoundError('Task');
      expect(error.message).toBe('Task no fue encontrado');
      expect(error.statusCode).toBe(404);
      expect(error.context).toEqual({ resource: 'Task', id: undefined });
    });

    it('should have proper JSON representation', () => {
      const error = new NotFoundError('Task', 123);
      const json = error.toJSON();
      expect(json).toHaveProperty('type');
      expect(json).toHaveProperty('status', 404);
      expect(json).toHaveProperty('timestamp');
    });
  });

  describe('ValidationError', () => {
    it('should create validation error with errors object', () => {
      const errors = { titulo: ['Required field'] };
      const error = new ValidationError('Validation failed', errors);
      expect(error.message).toBe('Validation failed');
      expect(error.statusCode).toBe(400);
      expect(error.errors).toEqual(errors);
    });

    it('should include errors in JSON representation', () => {
      const errors = { titulo: ['Required field'] };
      const error = new ValidationError('Validation failed', errors);
      const json = error.toJSON();
      expect(json).toHaveProperty('errors', errors);
    });
  });

  describe('DatabaseError', () => {
    it('should create database error with operation', () => {
      const error = new DatabaseError('Connection failed', 'create');
      expect(error.message).toBe('Error en operación de base de datos: Connection failed');
      expect(error.statusCode).toBe(500);
      expect(error.operation).toBe('create');
    });
  });

  describe('ConflictError', () => {
    it('should create conflict error', () => {
      const error = new ConflictError('Resource conflict', { resource: 'task' });
      expect(error.statusCode).toBe(409);
      expect(error.title).toBe('Conflicto de recursos');
    });
  });

  describe('UnauthorizedError', () => {
    it('should create unauthorized error with default message', () => {
      const error = new UnauthorizedError();
      expect(error.statusCode).toBe(401);
      expect(error.message).toBe('Credenciales inválidas o token expirado');
    });

    it('should create unauthorized error with custom message', () => {
      const error = new UnauthorizedError('Custom auth error');
      expect(error.message).toBe('Custom auth error');
    });
  });

  describe('ForbiddenError', () => {
    it('should create forbidden error with default message', () => {
      const error = new ForbiddenError();
      expect(error.statusCode).toBe(403);
      expect(error.message).toBe('No tiene permisos para realizar esta acción');
    });

    it('should create forbidden error with custom message', () => {
      const error = new ForbiddenError('Custom forbidden error');
      expect(error.message).toBe('Custom forbidden error');
    });
  });

  describe('InternalServerError', () => {
    it('should create internal server error with default message', () => {
      const error = new InternalServerError();
      expect(error.statusCode).toBe(500);
      expect(error.message).toBe('Ha ocurrido un error interno del servidor');
    });

    it('should create internal server error with custom message', () => {
      const error = new InternalServerError('Custom server error');
      expect(error.message).toBe('Custom server error');
    });
  });

  describe('Helper Functions', () => {
    describe('isOperationalError', () => {
      it('should return true for operational errors', () => {
        const error = new NotFoundError('Task', 123);
        expect(isOperationalError(error)).toBe(true);
      });

      it('should return false for non-operational errors', () => {
        const error = new Error('Generic error');
        expect(isOperationalError(error)).toBe(false);
      });
    });

    describe('createValidationError', () => {
      it('should create validation error from class-validator errors', () => {
        const validationErrors = [
          {
            property: 'titulo',
            constraints: {
              isNotEmpty: 'titulo should not be empty',
              length: 'titulo must be between 1 and 100 characters'
            }
          },
          {
            property: 'descripcion',
            constraints: {
              maxLength: 'descripcion cannot exceed 500 characters'
            }
          }
        ];

        const error = createValidationError(validationErrors);
        
        expect(error).toBeInstanceOf(ValidationError);
        expect(error.message).toBe('Los datos enviados no cumplen las validaciones requeridas');
        expect(error.errors).toEqual({
          titulo: ['titulo should not be empty', 'titulo must be between 1 and 100 characters'],
          descripcion: ['descripcion cannot exceed 500 characters']
        });
      });

      it('should handle empty validation errors array', () => {
        const error = createValidationError([]);
        expect(error.errors).toEqual({});
      });
    });
  });
});
